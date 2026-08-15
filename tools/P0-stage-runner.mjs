import crypto from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import {
  access,
  lstat,
  mkdir,
  mkdtemp,
  open,
  readdir,
  readFile,
  realpath,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  canonicalJson,
  hasExactKeys,
  publicTextBytesAreSafe,
  sanitizedResultIsSafe,
} from "./P0-content-safety.mjs";
import { parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";
import {
  resolveProductionStagedAction,
  stageBindingDigest,
  TERMINAL_STAGE_STATES,
  validateHistoricalStageReceipt,
  validateStageReceipt,
  validateStagedActionDefinition,
} from "./P0-staged-actions.mjs";
import {
  verifyStageGateBAtExactMain,
  verifyStageTerminalHistoryAtExactMain,
} from "./P0-verify-execution-start.mjs";

const DEFAULT_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTION_REQUEST_KEYS = Object.freeze([
  "taskId",
  "scopeClass",
  "actionClass",
  "stageId",
  "predecessorReceiptSha256",
  "idempotencyKey",
]);
const MODULE_ENTRY_KEYS = Object.freeze([
  "moduleId",
  "moduleRelativePath",
  "moduleSha256",
  "gitMode",
  "argumentSets",
]);
const MODULE_ID = /^[a-z][a-z0-9.-]{2,63}$/;
const RELATIVE_MODULE_PATH = /^tools\/[A-Za-z0-9._/-]+\.mjs$/;
const RECEIPT_DIGEST = /^sha256:[0-9a-f]{64}$/;
const FULL_REVISION = /^[0-9a-f]{40}$/;
const EVENT_FILE = /^\d{4}-(?:running|verification-pending|recovery-required|rolling-back|verified-complete|verified-rolled-back|cancelled-before-mutation|blocked-no-mutation|expired-before-mutation)\.json$/;
const TERMINATION_GRACE_MS = 500;
const QUIESCENCE_INTERVAL_MS = 1_000;
const MAX_CHILD_RESULT_BYTES = 64 * 1024;
const AUTHORIZATION_KEYS = Object.freeze([
  "ok", "scope", "code", "taskId", "stageId", "scopeClass", "actionClass", "sourceRevision",
  "candidateRevision", "dossierDigest", "preparationReviewId", "gateKind", "predecessorReceiptSha256",
  "gateDecision", "independentQaResult", "preparationReviewSha256", "idempotencyKey", "stageApprovalSha256",
  "stageDefinitionSha256", "moduleId", "moduleSha256", "registrySha256", "gateSourceFingerprint", "deadlineAt",
  "rollbackSnapshotReference",
]);
const TERMINAL_HISTORY_KEYS = Object.freeze([
  "ok", "scope", "code", "taskId", "stageId", "scopeClass", "actionClass", "sourceRevision",
  "candidateRevision", "dossierDigest", "preparationReviewId", "preparationReviewSha256", "gateKind",
  "predecessorReceiptSha256", "idempotencyKey", "stageDefinitionSha256", "moduleId", "moduleSha256",
  "rollbackSnapshotReference", "stageApprovalSha256", "registrySha256",
]);
const CHILD_RESULT_KEYS = Object.freeze([
  "schemaVersion", "outcome", "taskId", "stageId", "idempotencyKey", "sourceRevision",
  "stageBindingDigest", "evidenceDigest",
]);
const OUTCOME_VERIFICATION_KEYS = Object.freeze([
  "schemaVersion", "outcome", "boundary", "taskId", "stageId", "sourceRevision",
  "stageBindingDigest", "moduleSha256", "childResultSha256", "evidenceDigest", "observationDigest",
]);
const RECOVERY_REVIEW_KEYS = Object.freeze([
  "schemaVersion", "decision", "taskId", "stageId", "sourceRevision", "stageBindingDigest",
  "ownerNonce", "ownerClaimDigest", "recoveryReviewDigest",
]);
const PUBLIC_RECOVERY_REQUEST_KEYS = Object.freeze([
  "taskId", "stageId", "idempotencyKey", "sourceRevision", "stageBindingDigest", "recoveryReviewDigest",
]);
const LOCK_RECORD_KEYS = Object.freeze([
  "schemaVersion", "runtimeKey", "taskId", "stageId", "sourceRevision", "stageBindingDigest",
  "ownerNonce", "supervisorPid", "supervisorStartIdentity", "childPid", "childStartIdentity",
  "childProcessGroupId", "pendingReceiptSha256", "heartbeatAt",
]);
const LAUNCH_SIGNAL = "P0_STAGE_START\n";
const TRUSTED_LAUNCHER_BYTES = Buffer.from([
  "import { readFileSync } from 'node:fs';",
  `const signal = readFileSync(4, 'utf8');`,
  `if (signal !== ${JSON.stringify(LAUNCH_SIGNAL)}) process.exit(75);`,
  "await import('./executor.mjs');",
  "",
].join("\n"), "utf8");

// Stage 0 intentionally has no executable production modules or argument sets.
// Later task candidates must add exact reviewed entries; callers can never add one.
const PRODUCTION_MODULE_ALLOWLIST = Object.freeze({});
const PRODUCTION_OUTCOME_VERIFICATION_ALLOWLIST = Object.freeze({});
export const PRODUCTION_MODULE_METADATA = Object.freeze(Object.values(PRODUCTION_MODULE_ALLOWLIST).map((entry) => Object.freeze({
  moduleId: entry.moduleId,
  moduleRelativePath: entry.moduleRelativePath,
  moduleSha256: entry.moduleSha256,
  gitMode: entry.gitMode,
  argumentSetIds: Object.freeze(Object.keys(entry.argumentSets).sort()),
})));
export const PRODUCTION_OUTCOME_VERIFICATION_MODULE_IDS = Object.freeze(
  Object.keys(PRODUCTION_OUTCOME_VERIFICATION_ALLOWLIST).sort(),
);

function result(ok, code, details = {}) {
  const value = Object.freeze({ ok, code, ...details });
  if (!sanitizedResultIsSafe(value)) {
    return Object.freeze({ ok: false, code: "STAGE_PUBLIC_RESULT_REJECTED" });
  }
  return value;
}

function publicOperatorResult({
  ok,
  code,
  definition,
  authorization,
  state,
  receiptDigest,
  attempt,
  authorityStatus,
  mutationStatement,
  immediateVerification,
  quiescentVerification,
  consequence,
  nextAction,
}) {
  return result(ok, code, {
    taskId: definition.taskId,
    stageId: definition.stageId,
    gateKind: authorization.gateKind,
    scopeClass: definition.scopeClass,
    actionClass: definition.actionClass,
    sourceRevision: authorization.sourceRevision,
    dossierDigest: authorization.dossierDigest,
    predecessorReceiptDigest: definition.predecessor?.receiptDigest ?? null,
    idempotencyKey: definition.idempotencyKey,
    authorityDeadline: authorization.deadlineAt,
    authorityStatus,
    state,
    mutationStatement,
    rollbackSnapshotReference: authorization.rollbackSnapshotReference,
    immediateVerification,
    quiescentVerification,
    receiptDigest,
    attempt,
    consequence,
    nextAction,
  });
}

function sha256(value) {
  return `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
}

function safeRuntimeSegment(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function processStartIdentity(pid) {
  if (!Number.isSafeInteger(pid) || pid <= 0) return null;
  const observed = spawnSync("ps", ["-o", "lstart=", "-p", String(pid)], {
    encoding: "utf8",
    env: { LANG: "C", LC_ALL: "C", PATH: process.env.PATH ?? "/usr/bin:/bin" },
    timeout: 2_000,
  });
  const identity = observed.status === 0 ? observed.stdout.trim().replace(/\s+/g, " ") : "";
  return identity.length > 0 ? identity : null;
}

function processIdentityMatches(pid, expectedIdentity) {
  return typeof expectedIdentity === "string"
    && expectedIdentity.length > 0
    && processStartIdentity(pid) === expectedIdentity;
}

function validateAuthorization(authorization, request, definition) {
  if (!hasExactKeys(authorization, AUTHORIZATION_KEYS)
    || authorization.ok !== true
    || authorization.scope !== "stage-gate-b"
    || authorization.code !== "STAGE_GATE_B_READY"
    || authorization.taskId !== request.taskId
    || authorization.stageId !== request.stageId
    || authorization.scopeClass !== request.scopeClass
    || authorization.actionClass !== request.actionClass
    || authorization.idempotencyKey !== request.idempotencyKey
    || authorization.predecessorReceiptSha256 !== request.predecessorReceiptSha256
    || !FULL_REVISION.test(authorization.sourceRevision ?? "")
    || !FULL_REVISION.test(authorization.candidateRevision ?? "")
    || !/^[0-9a-f]{64}$/.test(authorization.dossierDigest ?? "")
    || !/^P0-PREP-[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(authorization.preparationReviewId ?? "")
    || !/^[0-9a-f]{64}$/.test(authorization.preparationReviewSha256 ?? "")
    || !["execute", "accept"].includes(authorization.gateKind)
    || authorization.gateDecision !== (authorization.gateKind === "accept"
      ? "Ready to accept — Gate B"
      : "Ready to execute — Gate B")
    || authorization.independentQaResult !== "pass"
    || !/^[0-9a-f]{64}$/.test(authorization.stageApprovalSha256 ?? "")
    || !RECEIPT_DIGEST.test(authorization.stageDefinitionSha256 ?? "")
    || !MODULE_ID.test(authorization.moduleId ?? "")
    || !RECEIPT_DIGEST.test(authorization.moduleSha256 ?? "")
    || !/^[0-9a-f]{64}$/.test(authorization.registrySha256 ?? "")
    || !RECEIPT_DIGEST.test(authorization.gateSourceFingerprint ?? "")
    || typeof authorization.rollbackSnapshotReference !== "string"
    || !/^[a-z][a-z0-9-]*:[A-Za-z0-9._/-]{4,160}$/.test(authorization.rollbackSnapshotReference)
    || !publicTextBytesAreSafe(authorization.rollbackSnapshotReference)
    || !Number.isFinite(Date.parse(authorization.deadlineAt ?? ""))) return false;
  return definition.taskId === authorization.taskId
    && definition.stageId === authorization.stageId
    && definition.scopeClass === authorization.scopeClass
    && definition.actionClass === authorization.actionClass
    && definition.idempotencyKey === authorization.idempotencyKey
    && stageBindingDigest(definition) === authorization.stageDefinitionSha256
    && definition.moduleId === authorization.moduleId
    && (definition.predecessor?.receiptDigest ?? null) === authorization.predecessorReceiptSha256;
}

function sameAuthorization(left, right) {
  const stableKeys = AUTHORIZATION_KEYS.filter((key) => key !== "deadlineAt");
  return stableKeys.every((key) => left[key] === right[key]);
}

function bindingRequest(definition) {
  return Object.freeze({
    taskId: definition.taskId,
    scopeClass: definition.scopeClass,
    actionClass: definition.actionClass,
    stageId: definition.stageId,
    predecessorReceiptSha256: definition.predecessor?.receiptDigest ?? null,
    idempotencyKey: definition.idempotencyKey,
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function syncDirectory(directory) {
  const handle = await open(directory, "r");
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function ensureDurableDirectory(directory) {
  let created = false;
  try {
    await mkdir(directory, { mode: 0o700 });
    created = true;
  } catch (error) {
    if (error?.code !== "EEXIST") throw error;
  }
  const stat = await lstat(directory);
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw new Error("runtime directory is not a plain directory");
  }
  // Every contender syncs the owning directory. If another process created
  // this entry but has not yet fsynced its parent, observing EEXIST alone is
  // not sufficient durability before an external effect.
  await syncDirectory(path.dirname(directory));
  await syncDirectory(directory);
}

function isWithin(parent, child) {
  const relative = path.relative(parent, child);
  return relative.length > 0 && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}

function validateProductionRequest(request) {
  if (!hasExactKeys(request, PRODUCTION_REQUEST_KEYS)) return result(false, "STAGE_REQUEST_SHAPE_INVALID");
  if (typeof request.taskId !== "string"
    || typeof request.scopeClass !== "string"
    || typeof request.actionClass !== "string"
    || typeof request.stageId !== "string"
    || typeof request.idempotencyKey !== "string"
    || request.predecessorReceiptSha256 !== null
      && (typeof request.predecessorReceiptSha256 !== "string"
        || !RECEIPT_DIGEST.test(request.predecessorReceiptSha256))) {
    return result(false, "STAGE_REQUEST_SHAPE_INVALID");
  }
  return result(true, "STAGE_REQUEST_VALID", { taskId: request.taskId, stageId: request.stageId });
}

function validateModuleEntry(entry, definition) {
  if (!hasExactKeys(entry, MODULE_ENTRY_KEYS)
    || entry.moduleId !== definition.moduleId
    || !MODULE_ID.test(entry.moduleId)
    || !RELATIVE_MODULE_PATH.test(entry.moduleRelativePath)
    || !RECEIPT_DIGEST.test(entry.moduleSha256 ?? "")
    || !["100644", "100755"].includes(entry.gitMode)
    || entry.moduleRelativePath.includes("..")
    || entry.moduleRelativePath.includes("//")
    || entry.argumentSets === null
    || typeof entry.argumentSets !== "object"
    || Array.isArray(entry.argumentSets)
    || Object.getPrototypeOf(entry.argumentSets) !== Object.prototype) {
    return false;
  }
  const args = entry.argumentSets[definition.argumentSetId];
  return Array.isArray(args)
    && args.every((arg) => typeof arg === "string" && /^[A-Za-z0-9._:=/-]{1,160}$/.test(arg)
      && !arg.includes("..") && !arg.startsWith("/"));
}

async function resolveReviewedModule({ repoRoot, definition, moduleEntry }) {
  if (!validateModuleEntry(moduleEntry, definition)) return null;
  const modulePath = path.resolve(repoRoot, moduleEntry.moduleRelativePath);
  if (!isWithin(repoRoot, modulePath)) return null;
  let moduleStat;
  let resolvedModule;
  let moduleBytes;
  try {
    moduleStat = await lstat(modulePath);
    resolvedModule = await realpath(modulePath);
    moduleBytes = await readFile(modulePath);
    await access(modulePath, fsConstants.R_OK);
  } catch {
    return null;
  }
  const resolvedRoot = await realpath(repoRoot);
  const expectedResolvedModule = path.resolve(resolvedRoot, moduleEntry.moduleRelativePath);
  if (!moduleStat.isFile()
    || moduleStat.isSymbolicLink()
    || resolvedModule !== expectedResolvedModule
    || !isWithin(resolvedRoot, resolvedModule)
    || sha256(moduleBytes) !== moduleEntry.moduleSha256
    || (moduleStat.mode & 0o111 ? "100755" : "100644") !== moduleEntry.gitMode) return null;
  return Object.freeze({
    modulePath,
    moduleBytes,
    moduleSha256: moduleEntry.moduleSha256,
    gitMode: moduleEntry.gitMode,
    args: Object.freeze([...moduleEntry.argumentSets[definition.argumentSetId]]),
  });
}

async function appendEvent(eventDir, sequence, event) {
  const eventName = `${String(sequence).padStart(4, "0")}-${event.state}.json`;
  if (!EVENT_FILE.test(eventName)) throw new Error("event state invalid");
  const existingNames = (await readdir(eventDir)).filter((name) => EVENT_FILE.test(name)).sort();
  if (sequence !== existingNames.length + 1) throw new Error("event sequence invalid");
  let previousEventSha256 = null;
  if (existingNames.length > 0) {
    const previousBytes = await readFile(path.join(eventDir, existingNames.at(-1)));
    const previous = JSON.parse(previousBytes.toString("utf8"));
    previousEventSha256 = previous.eventSha256;
    if (!RECEIPT_DIGEST.test(previousEventSha256 ?? "")) throw new Error("prior event digest invalid");
  }
  const eventPayload = { ...event, previousEventSha256 };
  const eventEnvelope = {
    ...eventPayload,
    eventSha256: sha256(canonicalJson(eventPayload)),
  };
  const eventPath = path.join(eventDir, eventName);
  const handle = await open(eventPath, "wx", 0o600);
  try {
    await handle.writeFile(`${canonicalJson(eventEnvelope)}\n`, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
  // The event is not durable until its directory entry is durable too.
  await syncDirectory(eventDir);
  return eventPath;
}

async function readEvents(eventDir) {
  let names;
  try {
    names = await readdir(eventDir);
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  const sorted = names.filter((name) => EVENT_FILE.test(name)).sort();
  const events = [];
  let previousEventSha256 = null;
  for (const [index, name] of sorted.entries()) {
    if (!name.startsWith(`${String(index + 1).padStart(4, "0")}-`)) throw new Error("event sequence invalid");
    const bytes = await readFile(path.join(eventDir, name));
    if (bytes.length === 0 || bytes.length > MAX_CHILD_RESULT_BYTES || !publicTextBytesAreSafe(bytes)) {
      throw new Error("event bytes invalid");
    }
    const parsed = parseJsonWithoutDuplicateKeys(bytes.toString("utf8"), `stage-event:${name}`);
    const { eventSha256, ...payload } = parsed;
    if (!RECEIPT_DIGEST.test(eventSha256 ?? "")
      || payload.previousEventSha256 !== previousEventSha256
      || eventSha256 !== sha256(canonicalJson(payload))) {
      throw new Error("event hash chain invalid");
    }
    events.push(parsed);
    previousEventSha256 = eventSha256;
  }
  return events;
}

function terminalEvent(events) {
  return [...events].reverse().find((event) => TERMINAL_STAGE_STATES.includes(event?.state)) ?? null;
}

async function predecessorReceiptExists(runtimeRoot, definition) {
  if (definition.predecessor === null) return true;
  let entries;
  try {
    entries = await readdir(runtimeRoot, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
  let matches = 0;
  for (const entry of entries) {
    if (!entry.isDirectory() || !/^[0-9a-f]{64}$/.test(entry.name)) continue;
    const events = await readEvents(path.join(runtimeRoot, entry.name, "events"));
    const receipt = terminalEvent(events)?.receipt;
    if (!receipt || receipt.taskId !== definition.taskId
      || receipt.stageId !== definition.predecessor.stageId
      || receipt.state !== "verified-complete") continue;
    if (sha256(canonicalJson(receipt)) === definition.predecessor.receiptDigest) matches += 1;
  }
  return matches === 1;
}

function processTreeAlive(child) {
  if (!child || !Number.isInteger(child.pid) || child.pid <= 0) return false;
  try {
    if (process.platform === "win32") return child.exitCode === null && child.signalCode === null;
    process.kill(-child.pid, 0);
    return true;
  } catch (error) {
    return error?.code !== "ESRCH";
  }
}

async function terminateProcessTree(child, graceMs = TERMINATION_GRACE_MS) {
  if (!child || !Number.isInteger(child.pid) || child.pid <= 0) return true;
  const killGroup = (signal) => {
    try {
      if (process.platform === "win32") child.kill(signal);
      else process.kill(-child.pid, signal);
    } catch (error) {
      if (error?.code !== "ESRCH") throw error;
    }
  };
  killGroup("SIGTERM");
  await new Promise((resolve) => setTimeout(resolve, graceMs));
  if (processTreeAlive(child)) {
    killGroup("SIGKILL");
    await new Promise((resolve) => setTimeout(resolve, graceMs));
  }
  return !processTreeAlive(child);
}

function validateLockRecord(lockRecord, expected) {
  return hasExactKeys(lockRecord, LOCK_RECORD_KEYS)
    && lockRecord.schemaVersion === expected.schemaVersion
    && lockRecord.runtimeKey === expected.runtimeKey
    && lockRecord.taskId === expected.taskId
    && lockRecord.stageId === expected.stageId
    && lockRecord.sourceRevision === expected.sourceRevision
    && lockRecord.stageBindingDigest === expected.stageBindingDigest
    && typeof lockRecord.ownerNonce === "string"
    && /^[0-9a-f]{64}$/.test(lockRecord.ownerNonce)
    && Number.isSafeInteger(lockRecord.supervisorPid)
    && typeof lockRecord.supervisorStartIdentity === "string"
    && (lockRecord.childPid === null || Number.isSafeInteger(lockRecord.childPid))
    && (lockRecord.childStartIdentity === null || typeof lockRecord.childStartIdentity === "string")
    && (lockRecord.childProcessGroupId === null || Number.isSafeInteger(lockRecord.childProcessGroupId))
    && (lockRecord.pendingReceiptSha256 === null || RECEIPT_DIGEST.test(lockRecord.pendingReceiptSha256 ?? ""))
    && (lockRecord.childPid === null
      ? lockRecord.childStartIdentity === null && lockRecord.childProcessGroupId === null
      : lockRecord.childPid > 0
        && lockRecord.childProcessGroupId === lockRecord.childPid
        && typeof lockRecord.childStartIdentity === "string"
        && lockRecord.childStartIdentity.length > 0)
    && Number.isFinite(Date.parse(lockRecord.heartbeatAt ?? ""));
}

async function readLockRecord(lockPath) {
  try {
    const bytes = await readFile(lockPath);
    if (bytes.length > 16 * 1024 || !publicTextBytesAreSafe(bytes)) return null;
    return parseJsonWithoutDuplicateKeys(bytes.toString("utf8"), "stage-runtime-lock");
  } catch {
    return null;
  }
}

function validateRecoveryReview(review, lockRecord, expected) {
  if (!hasExactKeys(review, RECOVERY_REVIEW_KEYS)
    || review.schemaVersion !== expected.schemaVersion
    || review.decision !== "recover-stale-stage-lock"
    || review.taskId !== expected.taskId
    || review.stageId !== expected.stageId
    || review.sourceRevision !== expected.sourceRevision
    || review.stageBindingDigest !== expected.stageBindingDigest
    || review.ownerNonce !== lockRecord.ownerNonce) return false;
  const expectedOwnerClaimDigest = sha256(canonicalJson(lockRecord));
  const { recoveryReviewDigest, ...reviewedClaim } = review;
  return review.ownerClaimDigest === expectedOwnerClaimDigest
    && recoveryReviewDigest === sha256(canonicalJson(reviewedClaim));
}

async function reconcileStaleLock(lockPath, expected, recoveryReview) {
  const lockRecord = await readLockRecord(lockPath);
  if (!validateLockRecord(lockRecord, expected)
    || !validateRecoveryReview(recoveryReview, lockRecord, expected)) return false;
  if (lockRecord.pendingReceiptSha256 !== null) {
    let events;
    try {
      events = await readEvents(expected.eventDir);
    } catch {
      return false;
    }
    const pendingMatches = events.filter((event) => event.state === "verification-pending"
      && event.receipt
      && sha256(canonicalJson(event.receipt)) === lockRecord.pendingReceiptSha256);
    if (pendingMatches.length !== 1) return false;
  }
  if (processIdentityMatches(lockRecord.supervisorPid, lockRecord.supervisorStartIdentity)) return false;
  if (lockRecord.childPid !== null) {
    if (processIdentityMatches(lockRecord.childPid, lockRecord.childStartIdentity)) {
      const child = { pid: lockRecord.childPid };
      if (!await terminateProcessTree(child)) return false;
    } else if (processTreeAlive({ pid: lockRecord.childProcessGroupId })) {
      // A surviving group without its exact leader identity cannot be killed
      // safely because the numeric ID may have been reused.
      return false;
    }
  }
  const claimPath = `${lockPath}.reconciled-${lockRecord.ownerNonce}`;
  try {
    await rename(lockPath, claimPath);
    await syncDirectory(path.dirname(lockPath));
  } catch {
    return false;
  }
  const claimed = await readLockRecord(claimPath);
  return claimed?.ownerNonce === lockRecord.ownerNonce
    && canonicalJson(claimed) === canonicalJson(lockRecord);
}

async function acquireOwnedLock(lockPath, expected) {
  try {
    return await open(lockPath, "wx", 0o600);
  } catch {
    return null;
  }
}

async function releaseOwnedLock(lockHandle, lockPath, ownerNonce) {
  try {
    const [handleStat, pathStat, lockRecord] = await Promise.all([
      lockHandle.stat(),
      lstat(lockPath),
      readLockRecord(lockPath),
    ]);
    if (handleStat.dev !== pathStat.dev || handleStat.ino !== pathStat.ino || lockRecord?.ownerNonce !== ownerNonce) {
      return false;
    }
    await rm(lockPath, { force: false });
    await syncDirectory(path.dirname(lockPath));
    return true;
  } catch {
    return false;
  }
}

async function releaseOwnedEmptyLock(lockHandle, lockPath) {
  try {
    const [handleStat, pathStat] = await Promise.all([lockHandle.stat(), lstat(lockPath)]);
    if (handleStat.dev !== pathStat.dev || handleStat.ino !== pathStat.ino || handleStat.size !== 0) return false;
    await rm(lockPath, { force: false });
    await syncDirectory(path.dirname(lockPath));
    return true;
  } catch {
    return false;
  }
}

async function readChildResult(resultPath, expected) {
  try {
    const resultStat = await lstat(resultPath);
    if (!resultStat.isFile() || resultStat.isSymbolicLink() || resultStat.size <= 0
      || resultStat.size > MAX_CHILD_RESULT_BYTES) return null;
    const bytes = await readFile(resultPath);
    if (!publicTextBytesAreSafe(bytes)) return null;
    const parsed = parseJsonWithoutDuplicateKeys(bytes.toString("utf8"), "stage-child-result");
    if (!hasExactKeys(parsed, CHILD_RESULT_KEYS)
      || parsed.schemaVersion !== "1.0.0"
      || parsed.outcome !== "succeeded"
      || parsed.taskId !== expected.taskId
      || parsed.stageId !== expected.stageId
      || parsed.idempotencyKey !== expected.idempotencyKey
      || parsed.sourceRevision !== expected.sourceRevision
      || parsed.stageBindingDigest !== expected.stageBindingDigest
      || !RECEIPT_DIGEST.test(parsed.evidenceDigest ?? "")) return null;
    return { value: parsed, digest: sha256(bytes) };
  } catch {
    return null;
  }
}

function validateOutcomeVerification(value, expected) {
  if (!hasExactKeys(value, OUTCOME_VERIFICATION_KEYS)
    || value.schemaVersion !== "1.0.0"
    || value.outcome !== "pass"
    || value.boundary !== expected.boundary
    || value.taskId !== expected.taskId
    || value.stageId !== expected.stageId
    || value.sourceRevision !== expected.sourceRevision
    || value.stageBindingDigest !== expected.stageBindingDigest
    || value.moduleSha256 !== expected.moduleSha256
    || value.childResultSha256 !== expected.childResultSha256
    || value.evidenceDigest !== expected.evidenceDigest
    || !RECEIPT_DIGEST.test(value.observationDigest ?? "")) return null;
  return Object.freeze({ value, digest: sha256(canonicalJson(value)) });
}

async function verifyReviewedStageOutcome(request) {
  const verifier = PRODUCTION_OUTCOME_VERIFICATION_ALLOWLIST[request?.moduleId];
  if (typeof verifier !== "function") return null;
  try {
    return await verifier(Object.freeze({ ...request }));
  } catch {
    return null;
  }
}

function closedReceipt({ definition, authorization, state, attempt, evidence = {} }) {
  return Object.freeze({
    schemaVersion: definition.schemaVersion,
    taskId: definition.taskId,
    scopeClass: definition.scopeClass,
    actionClass: definition.actionClass,
    stageId: definition.stageId,
    idempotencyKey: definition.idempotencyKey,
    sourceRevision: authorization.sourceRevision,
    gateKind: authorization.gateKind,
    authorityDeadline: authorization.deadlineAt,
    rollbackSnapshotReference: authorization.rollbackSnapshotReference,
    stageBindingDigest: stageBindingDigest(definition),
    predecessorReceiptSha256: definition.predecessor?.receiptDigest ?? null,
    preparationReviewId: authorization.preparationReviewId,
    preparationReviewSha256: authorization.preparationReviewSha256,
    candidateRevision: authorization.candidateRevision,
    dossierDigest: authorization.dossierDigest,
    stageApprovalSha256: authorization.stageApprovalSha256,
    registrySha256: authorization.registrySha256,
    gateSourceFingerprint: authorization.gateSourceFingerprint,
    moduleSha256: evidence.moduleSha256 ?? null,
    childResultSha256: evidence.childResultSha256 ?? null,
    evidenceDigest: evidence.evidenceDigest ?? null,
    stdoutSha256: evidence.stdoutSha256 ?? null,
    stderrSha256: evidence.stderrSha256 ?? null,
    immediateVerificationSha256: evidence.immediateVerificationSha256 ?? null,
    immediateVerificationResult: evidence.immediateVerificationResult ?? null,
    quiescent1VerificationSha256: evidence.quiescent1VerificationSha256 ?? null,
    quiescent1VerificationResult: evidence.quiescent1VerificationResult ?? null,
    quiescent2VerificationSha256: evidence.quiescent2VerificationSha256 ?? null,
    quiescent2VerificationResult: evidence.quiescent2VerificationResult ?? null,
    state,
    attempt,
  });
}

function historicalBindingFromAuthorization(authorization) {
  return {
    taskId: authorization.taskId,
    stageId: authorization.stageId,
    scopeClass: authorization.scopeClass,
    actionClass: authorization.actionClass,
    idempotencyKey: authorization.idempotencyKey,
    predecessorReceiptSha256: authorization.predecessorReceiptSha256,
    preparationReviewId: authorization.preparationReviewId,
    preparationReviewSha256: authorization.preparationReviewSha256,
    candidateRevision: authorization.candidateRevision,
    dossierDigest: authorization.dossierDigest,
    stageApprovalSha256: authorization.stageApprovalSha256,
    stageDefinitionSha256: authorization.stageDefinitionSha256,
    moduleSha256: authorization.moduleSha256,
    gateKind: authorization.gateKind,
    rollbackSnapshotReference: authorization.rollbackSnapshotReference,
  };
}

function validateTerminalHistory(history, request) {
  return hasExactKeys(history, TERMINAL_HISTORY_KEYS)
    && history.ok === true
    && history.scope === "stage-terminal-history"
    && history.code === "STAGE_TERMINAL_HISTORY_VALID"
    && history.taskId === request.taskId
    && history.stageId === request.stageId
    && history.scopeClass === request.scopeClass
    && history.actionClass === request.actionClass
    && history.idempotencyKey === request.idempotencyKey
    && history.predecessorReceiptSha256 === request.predecessorReceiptSha256
    && FULL_REVISION.test(history.sourceRevision ?? "")
    && FULL_REVISION.test(history.candidateRevision ?? "")
    && /^[0-9a-f]{64}$/.test(history.dossierDigest ?? "")
    && /^P0-PREP-[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(history.preparationReviewId ?? "")
    && /^[0-9a-f]{64}$/.test(history.preparationReviewSha256 ?? "")
    && ["execute", "accept"].includes(history.gateKind)
    && RECEIPT_DIGEST.test(history.stageDefinitionSha256 ?? "")
    && MODULE_ID.test(history.moduleId ?? "")
    && RECEIPT_DIGEST.test(history.moduleSha256 ?? "")
    && typeof history.rollbackSnapshotReference === "string"
    && publicTextBytesAreSafe(history.rollbackSnapshotReference)
    && /^[0-9a-f]{64}$/.test(history.stageApprovalSha256 ?? "")
    && /^[0-9a-f]{64}$/.test(history.registrySha256 ?? "");
}

function terminalPublicResult(receipt) {
  const alreadySucceeded = receipt.state === "verified-complete";
  return result(alreadySucceeded, alreadySucceeded ? "STAGE_ALREADY_SUCCEEDED" : "STAGE_ALREADY_TERMINAL", {
    taskId: receipt.taskId,
    stageId: receipt.stageId,
    gateKind: receipt.gateKind,
    scopeClass: receipt.scopeClass,
    actionClass: receipt.actionClass,
    sourceRevision: receipt.sourceRevision,
    dossierDigest: receipt.dossierDigest,
    predecessorReceiptDigest: receipt.predecessorReceiptSha256,
    idempotencyKey: receipt.idempotencyKey,
    authorityDeadline: receipt.authorityDeadline,
    authorityStatus: "historical-terminal",
    state: receipt.state,
    mutationStatement: alreadySucceeded
      ? "Mutation verified complete"
      : receipt.state === "verified-rolled-back"
        ? "Rollback verified complete"
        : "No mutation performed",
    rollbackSnapshotReference: receipt.rollbackSnapshotReference,
    immediateVerification: receipt.immediateVerificationResult === "pass" ? "pass" : "not-run",
    quiescentVerification: receipt.quiescent1VerificationResult === "pass"
      && receipt.quiescent2VerificationResult === "pass" ? "pass" : "not-run",
    receiptDigest: sha256(canonicalJson(receipt)),
    attempt: receipt.attempt,
    consequence: "Stage was already terminal; no second execution occurred.",
    nextAction: "Preserve the terminal receipt; no replay is permitted.",
  });
}

async function reconcileTerminalStage({
  request,
  runtimeRoot,
  verifyHistory = verifyStageTerminalHistoryAtExactMain,
}) {
  try {
    const runtimeMetadata = await lstat(runtimeRoot);
    if (!runtimeMetadata.isDirectory() || runtimeMetadata.isSymbolicLink()) {
      return result(false, "STAGE_RECEIPT_INVALID", { taskId: request.taskId, stageId: request.stageId });
    }
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    return result(false, "STAGE_RECEIPT_INVALID", { taskId: request.taskId, stageId: request.stageId });
  }
  const runtimeKey = safeRuntimeSegment(`${request.taskId}\0${request.stageId}\0${request.idempotencyKey}`);
  let events;
  try {
    events = await readEvents(path.join(runtimeRoot, runtimeKey, "events"));
  } catch {
    return result(false, "STAGE_RECEIPT_INVALID", { taskId: request.taskId, stageId: request.stageId });
  }
  const terminal = terminalEvent(events);
  if (!terminal) return null;
  let history;
  try {
    history = await verifyHistory(request);
  } catch {
    history = null;
  }
  if (!validateTerminalHistory(history, request)) {
    return result(false, "STAGE_TERMINAL_HISTORY_INVALID", { taskId: request.taskId, stageId: request.stageId });
  }
  const receiptValidation = validateHistoricalStageReceipt(
    terminal.receipt,
    historicalBindingFromAuthorization(history),
  );
  if (!receiptValidation.ok) {
    return result(false, "STAGE_RECEIPT_INVALID", { taskId: request.taskId, stageId: request.stageId });
  }
  return terminalPublicResult(terminal.receipt);
}

async function executeResolvedStage({
  definition,
  moduleEntry,
  repoRoot,
  runtimeRoot,
  authorize = verifyStageGateBAtExactMain,
  verifyOutcome = verifyReviewedStageOutcome,
  spawnProcess = spawn,
  clock = () => new Date(),
  quiescenceIntervalMs = QUIESCENCE_INTERVAL_MS,
}) {
  const definitionValidation = validateStagedActionDefinition(definition);
  if (!definitionValidation.ok) return result(false, definitionValidation.code);
  const request = bindingRequest(definition);
  let authorization;
  try {
    authorization = await authorize(request);
  } catch {
    authorization = null;
  }
  if (!validateAuthorization(authorization, request, definition)) {
    return result(false, "STAGE_GATE_B_DENIED", { taskId: definition.taskId, stageId: definition.stageId });
  }
  const reviewedModule = await resolveReviewedModule({ repoRoot, definition, moduleEntry });
  if (!reviewedModule || reviewedModule.moduleSha256 !== authorization.moduleSha256) {
    return result(false, "STAGE_MODULE_NOT_ALLOWLISTED", { taskId: definition.taskId, stageId: definition.stageId });
  }
  if (!await predecessorReceiptExists(runtimeRoot, definition)) {
    return result(false, "STAGE_PREDECESSOR_RECEIPT_MISSING", {
      taskId: definition.taskId,
      stageId: definition.stageId,
    });
  }

  const runtimeKey = safeRuntimeSegment(`${definition.taskId}\0${definition.stageId}\0${definition.idempotencyKey}`);
  const stageRoot = path.join(runtimeRoot, runtimeKey);
  const eventDir = path.join(stageRoot, "events");
  const rawDir = path.join(stageRoot, "raw-evidence");
  const lockDir = path.join(runtimeRoot, "locks");
  const lockPath = path.join(lockDir, `${runtimeKey}.lock`);
  // Create each level separately and fsync the directory that owns the new
  // entry. In particular, the Git common directory must durably contain the
  // first P0-stage-runtime entry before a reviewed external action can begin.
  await ensureDurableDirectory(runtimeRoot);
  await ensureDurableDirectory(stageRoot);
  await ensureDurableDirectory(eventDir);
  await ensureDurableDirectory(rawDir);
  await ensureDurableDirectory(lockDir);

  const expectedLock = {
    schemaVersion: definition.schemaVersion,
    runtimeKey,
    taskId: definition.taskId,
    stageId: definition.stageId,
    sourceRevision: authorization.sourceRevision,
    stageBindingDigest: definitionValidation.stageBindingDigest,
    eventDir,
  };
  const lockHandle = await acquireOwnedLock(lockPath, expectedLock);
  if (!lockHandle) {
    return result(false, "STAGE_LOCK_UNAVAILABLE", { taskId: definition.taskId, stageId: definition.stageId });
  }
  await syncDirectory(lockDir);

  let stdoutHandle;
  let stderrHandle;
  let childResultHandle;
  let retainLock = false;
  let child = null;
  let ownerNonce = null;
  try {
    const supervisorStartIdentity = processStartIdentity(process.pid);
    if (supervisorStartIdentity === null) {
      return result(false, "STAGE_SUPERVISOR_IDENTITY_UNAVAILABLE", {
        taskId: definition.taskId,
        stageId: definition.stageId,
      });
    }
    ownerNonce = crypto.randomBytes(32).toString("hex");
    const lockRecord = {
      schemaVersion: definition.schemaVersion,
      runtimeKey,
      taskId: definition.taskId,
      stageId: definition.stageId,
      sourceRevision: authorization.sourceRevision,
      stageBindingDigest: definitionValidation.stageBindingDigest,
      ownerNonce,
      supervisorPid: process.pid,
      supervisorStartIdentity,
      childPid: null,
      childStartIdentity: null,
      childProcessGroupId: null,
      pendingReceiptSha256: null,
      heartbeatAt: clock().toISOString(),
    };
    const persistLockRecord = async () => {
      lockRecord.heartbeatAt = clock().toISOString();
      const bytes = Buffer.from(`${canonicalJson(lockRecord)}\n`, "utf8");
      await lockHandle.truncate(0);
      await lockHandle.write(bytes, 0, bytes.length, 0);
      await lockHandle.sync();
    };
    await persistLockRecord();
    const existingEvents = await readEvents(eventDir);
    const existingTerminal = terminalEvent(existingEvents);
    if (existingTerminal) {
      const receipt = existingTerminal.receipt;
      const receiptValidation = validateHistoricalStageReceipt(
        receipt,
        historicalBindingFromAuthorization(authorization),
      );
      if (!receiptValidation.ok) return result(false, "STAGE_RECEIPT_INVALID", { taskId: definition.taskId, stageId: definition.stageId });
      return terminalPublicResult(receipt);
    }
    if (existingEvents.length > 0) {
      const recoveredReceipt = closedReceipt({
        definition,
        authorization,
        state: "recovery-required",
        attempt: 1,
      });
      await appendEvent(eventDir, existingEvents.length + 1, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: clock().toISOString(),
        receipt: recoveredReceipt,
      });
      return publicOperatorResult({
        ok: false,
        code: "STAGE_RECOVERY_REQUIRED",
        definition,
        authorization,
        state: "recovery-required",
        receiptDigest: sha256(canonicalJson(recoveredReceipt)),
        attempt: 1,
        authorityStatus: "current",
        mutationStatement: "Mutation may have occurred",
        immediateVerification: "not-run",
        quiescentVerification: "not-run",
        consequence: "Stage state requires reviewed recovery before replay.",
        nextAction: "Perform reviewed recovery or rollback.",
      });
    }

    const stdoutPath = path.join(rawDir, "stdout.raw");
    const stderrPath = path.join(rawDir, "stderr.raw");
    const childResultPath = path.join(rawDir, "child-result.json");
    const executorPath = path.join(stageRoot, "executor.mjs");
    const launcherPath = path.join(stageRoot, "launcher.mjs");
    const executorHandle = await open(executorPath, "wx", reviewedModule.gitMode === "100755" ? 0o500 : 0o400);
    try {
      await executorHandle.writeFile(reviewedModule.moduleBytes);
      await executorHandle.sync();
    } finally {
      await executorHandle.close();
    }
    const launcherHandle = await open(launcherPath, "wx", 0o400);
    try {
      await launcherHandle.writeFile(TRUSTED_LAUNCHER_BYTES);
      await launcherHandle.sync();
    } finally {
      await launcherHandle.close();
    }
    stdoutHandle = await open(stdoutPath, "wx", 0o600);
    stderrHandle = await open(stderrPath, "wx", 0o600);
    childResultHandle = await open(childResultPath, "wx", 0o600);
    await syncDirectory(stageRoot);
    await syncDirectory(rawDir);

    const startedAt = clock();
    const configuredDeadline = startedAt.getTime() + definition.deadlineMs;
    const gateDeadline = Date.parse(authorization.deadlineAt);
    const deadlineAt = Number.isFinite(gateDeadline)
      ? Math.min(configuredDeadline, gateDeadline)
      : configuredDeadline;
    if (!Number.isFinite(deadlineAt) || deadlineAt <= startedAt.getTime()) {
      return result(false, "STAGE_DEADLINE_INVALID", { taskId: definition.taskId, stageId: definition.stageId });
    }

    await appendEvent(eventDir, 1, {
      schemaVersion: definition.schemaVersion,
      state: "running",
      occurredAt: startedAt.toISOString(),
      processGroupId: null,
      sourceRevision: authorization.sourceRevision,
      stageBindingDigest: definitionValidation.stageBindingDigest,
      executorSha256: reviewedModule.moduleSha256,
    });
    const bindingArgs = [
      `--p0-task-id=${definition.taskId}`,
      `--p0-stage-id=${definition.stageId}`,
      `--p0-idempotency-key=${definition.idempotencyKey}`,
      `--p0-source-revision=${authorization.sourceRevision}`,
      `--p0-stage-binding=${definitionValidation.stageBindingDigest}`,
    ];
    const resolvedLauncherPath = await realpath(launcherPath);
    const resolvedStageRoot = path.dirname(resolvedLauncherPath);
    child = spawnProcess(process.execPath, [
      "--permission",
      `--allow-fs-read=${resolvedStageRoot}`,
      resolvedLauncherPath,
      ...reviewedModule.args,
      ...bindingArgs,
    ], {
      cwd: repoRoot,
      env: Object.freeze({ LANG: "C.UTF-8", LC_ALL: "C.UTF-8", NODE_ENV: "production" }),
      shell: false,
      detached: process.platform !== "win32",
      windowsHide: true,
      stdio: ["ignore", stdoutHandle.fd, stderrHandle.fd, childResultHandle.fd, "pipe"],
    });
    const childStartIdentity = processStartIdentity(child.pid);
    if (childStartIdentity === null) {
      retainLock = !await terminateProcessTree(child).catch(() => false);
      return result(false, "STAGE_CHILD_IDENTITY_UNAVAILABLE", {
        taskId: definition.taskId,
        stageId: definition.stageId,
      });
    }
    lockRecord.childPid = child.pid;
    lockRecord.childStartIdentity = childStartIdentity;
    lockRecord.childProcessGroupId = child.pid;
    await persistLockRecord();
    child.stdio[4].end(LAUNCH_SIGNAL);

    let cancellationReason = null;
    let terminationPromise = null;
    const requestCancellation = (reason) => {
      cancellationReason ??= reason;
      terminationPromise ??= terminateProcessTree(child);
    };
    const deadlineHandle = setTimeout(() => requestCancellation("recovery-required"), Math.max(1, deadlineAt - Date.now()));
    const outcome = await new Promise((resolve) => {
      child.once("error", () => resolve({ exitCode: null, signal: null, spawnFailed: true }));
      child.once("close", (exitCode, signal) => resolve({ exitCode, signal, spawnFailed: false }));
    });
    clearTimeout(deadlineHandle);
    let processTreeQuiescent = true;
    if (terminationPromise) processTreeQuiescent = await terminationPromise;
    if (processTreeAlive(child)) processTreeQuiescent = await terminateProcessTree(child);
    if (!processTreeQuiescent) retainLock = true;
    await Promise.all([
      stdoutHandle.sync(),
      stderrHandle.sync(),
      childResultHandle.sync(),
    ]);
    await Promise.all([stdoutHandle.close(), stderrHandle.close(), childResultHandle.close()]);
    stdoutHandle = null;
    stderrHandle = null;
    childResultHandle = null;
    const childResult = await readChildResult(childResultPath, {
      taskId: definition.taskId,
      stageId: definition.stageId,
      idempotencyKey: definition.idempotencyKey,
      sourceRevision: authorization.sourceRevision,
      stageBindingDigest: definitionValidation.stageBindingDigest,
    });
    const evidence = {
      moduleSha256: reviewedModule.moduleSha256,
      childResultSha256: childResult?.digest ?? null,
      evidenceDigest: childResult?.value?.evidenceDigest ?? null,
      stdoutSha256: sha256(await readFile(stdoutPath)),
      stderrSha256: sha256(await readFile(stderrPath)),
    };
    if (cancellationReason !== null || outcome.spawnFailed || outcome.exitCode !== 0
      || !processTreeQuiescent || childResult === null) {
      const failedReceipt = closedReceipt({
        definition,
        authorization,
        state: "recovery-required",
        attempt: 1,
        evidence,
      });
      await appendEvent(eventDir, 2, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: clock().toISOString(),
        receipt: failedReceipt,
      });
      return publicOperatorResult({
        ok: false,
        code: "STAGE_RECOVERY_REQUIRED",
        definition,
        authorization,
        state: "recovery-required",
        receiptDigest: sha256(canonicalJson(failedReceipt)),
        attempt: 1,
        authorityStatus: "not-rechecked",
        mutationStatement: "Mutation may have occurred",
        immediateVerification: "not-run",
        quiescentVerification: "not-run",
        consequence: "Stage state requires reviewed recovery before replay.",
        nextAction: "Perform reviewed recovery or rollback.",
      });
    }

    const pendingReceipt = closedReceipt({
      definition,
      authorization,
      state: "verification-pending",
      attempt: 1,
      evidence,
    });
    const pendingReceiptSha256 = sha256(canonicalJson(pendingReceipt));
    await appendEvent(eventDir, 2, {
      schemaVersion: definition.schemaVersion,
      state: "verification-pending",
      occurredAt: clock().toISOString(),
      receipt: pendingReceipt,
    });
    lockRecord.pendingReceiptSha256 = pendingReceiptSha256;
    await persistLockRecord();

    const authorizationStillValid = async () => {
      if (clock().getTime() > deadlineAt) return false;
      let refreshed;
      try {
        refreshed = await authorize(request);
      } catch {
        return false;
      }
      return validateAuthorization(refreshed, request, definition)
        && sameAuthorization(authorization, refreshed);
    };
    const verificationDigests = {
      immediateVerificationSha256: null,
      immediateVerificationResult: null,
      quiescent1VerificationSha256: null,
      quiescent1VerificationResult: null,
      quiescent2VerificationSha256: null,
      quiescent2VerificationResult: null,
    };
    const verifyBoundary = async (boundary, receiptKey) => {
      if (!await authorizationStillValid()) return false;
      let supplied;
      try {
        supplied = await verifyOutcome(Object.freeze({
          schemaVersion: definition.schemaVersion,
          boundary,
          moduleId: definition.moduleId,
          taskId: definition.taskId,
          stageId: definition.stageId,
          sourceRevision: authorization.sourceRevision,
          stageBindingDigest: definitionValidation.stageBindingDigest,
          moduleSha256: evidence.moduleSha256,
          childResultSha256: evidence.childResultSha256,
          evidenceDigest: evidence.evidenceDigest,
        }));
      } catch {
        return false;
      }
      const verified = validateOutcomeVerification(supplied, {
        boundary,
        taskId: definition.taskId,
        stageId: definition.stageId,
        sourceRevision: authorization.sourceRevision,
        stageBindingDigest: definitionValidation.stageBindingDigest,
        moduleSha256: evidence.moduleSha256,
        childResultSha256: evidence.childResultSha256,
        evidenceDigest: evidence.evidenceDigest,
      });
      if (verified === null) return false;
      // Outcome verification may itself be slow. Re-fetch exact main and
      // re-evaluate the immutable Gate B authorization after the verifier
      // settles so an expired or revoked stage cannot become durable success.
      if (!await authorizationStillValid()) return false;
      verificationDigests[receiptKey] = verified.digest;
      verificationDigests[receiptKey.replace("Sha256", "Result")] = verified.value.outcome;
      return true;
    };
    let postActionAuthorized = await verifyBoundary("immediate", "immediateVerificationSha256");
    if (postActionAuthorized) {
      await delay(quiescenceIntervalMs);
      postActionAuthorized = await verifyBoundary("quiescent-1", "quiescent1VerificationSha256");
    }
    if (postActionAuthorized) {
      await delay(quiescenceIntervalMs);
      postActionAuthorized = await verifyBoundary("quiescent-2", "quiescent2VerificationSha256");
    }
    // Keep the final append boundary fail-closed as well. This deliberately
    // incurs one more exact-main/authority check immediately before the
    // terminal receipt is constructed and persisted.
    if (postActionAuthorized) postActionAuthorized = await authorizationStillValid();
    const verifiedEvidence = { ...evidence, ...verificationDigests };
    if (!postActionAuthorized) {
      const recoveryReceipt = closedReceipt({
        definition,
        authorization,
        state: "recovery-required",
        attempt: 1,
        evidence: verifiedEvidence,
      });
      await appendEvent(eventDir, 3, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: clock().toISOString(),
        receipt: recoveryReceipt,
      });
      return publicOperatorResult({
        ok: false,
        code: "STAGE_POST_ACTION_VERIFICATION_INVALID",
        definition,
        authorization,
        state: "recovery-required",
        receiptDigest: sha256(canonicalJson(recoveryReceipt)),
        attempt: 1,
        authorityStatus: "not-rechecked",
        mutationStatement: "Mutation may have occurred",
        immediateVerification: verificationDigests.immediateVerificationResult === "pass" ? "pass" : "fail",
        quiescentVerification: verificationDigests.quiescent1VerificationResult === "pass"
          && verificationDigests.quiescent2VerificationResult === "pass" ? "pass" : "fail",
        consequence: "Stage state requires reviewed recovery before replay.",
        nextAction: "Perform reviewed recovery or rollback.",
      });
    }

    const completedReceipt = closedReceipt({
      definition,
      authorization,
      state: "verified-complete",
      attempt: 1,
      evidence: verifiedEvidence,
    });
    const completedValidation = validateStageReceipt(completedReceipt, definition, authorization);
    if (!completedValidation.ok) throw new Error(completedValidation.code);
    await appendEvent(eventDir, 3, {
      schemaVersion: definition.schemaVersion,
      state: "verified-complete",
      occurredAt: clock().toISOString(),
      receipt: completedReceipt,
      pendingReceiptSha256,
    });
    return publicOperatorResult({
      ok: true,
      code: "STAGE_SUCCEEDED",
      definition,
      authorization,
      state: "verified-complete",
      receiptDigest: sha256(canonicalJson(completedReceipt)),
      attempt: 1,
      authorityStatus: "current",
      mutationStatement: "Mutation verified complete",
      immediateVerification: "pass",
      quiescentVerification: "pass",
      consequence: "Stage effect is verified; task delivery status is unchanged.",
      nextAction: "Run a separately reviewed delivery transition.",
    });
  } catch {
    if (child && !(await terminateProcessTree(child).catch(() => false))) retainLock = true;
    return result(false, "STAGE_RUNNER_FAILED", { taskId: definition.taskId, stageId: definition.stageId });
  } finally {
    if (stdoutHandle) await stdoutHandle.close().catch(() => {});
    if (stderrHandle) await stderrHandle.close().catch(() => {});
    if (childResultHandle) await childResultHandle.close().catch(() => {});
    if (!retainLock && ownerNonce !== null) {
      if (!await releaseOwnedLock(lockHandle, lockPath, ownerNonce)) retainLock = true;
    } else if (!retainLock && ownerNonce === null) {
      if (!await releaseOwnedEmptyLock(lockHandle, lockPath)) retainLock = true;
    }
    await lockHandle.close().catch(() => {});
  }
}

async function defaultRuntimeRoot(repoRoot) {
  const { spawnSync } = await import("node:child_process");
  const resultValue = spawnSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  if (resultValue.status !== 0) throw new Error("git common directory unavailable");
  const commonDir = resultValue.stdout.trim();
  if (!path.isAbsolute(commonDir)) throw new Error("git common directory is not absolute");
  return path.join(commonDir, "P0-stage-runtime");
}

/**
 * Production surface. The caller supplies only the immutable stage identity and
 * binding. Module, arguments, cwd, environment, output custody, process model,
 * clock, Git facts, evaluator, and execution callback are not injectable.
 */
export async function runSerializableStageFromExactMain(request = {}) {
  const requestValidation = validateProductionRequest(request);
  if (!requestValidation.ok) return requestValidation;
  const repoRoot = DEFAULT_REPO_ROOT;
  const runtimeRoot = await defaultRuntimeRoot(repoRoot);
  const reconciled = await reconcileTerminalStage({ request, runtimeRoot });
  if (reconciled !== null) return reconciled;
  const definition = resolveProductionStagedAction(request);
  if (!definition
    || definition.scopeClass !== request.scopeClass
    || definition.actionClass !== request.actionClass
    || (definition.predecessor?.receiptDigest ?? null) !== request.predecessorReceiptSha256) {
    return result(false, "STAGE_ACTION_NOT_REVIEWED", { taskId: request.taskId, stageId: request.stageId });
  }
  const moduleEntry = PRODUCTION_MODULE_ALLOWLIST[definition.moduleId];
  if (!moduleEntry) return result(false, "STAGE_MODULE_NOT_ALLOWLISTED", { taskId: request.taskId, stageId: request.stageId });

  return executeResolvedStage({
    definition,
    moduleEntry,
    repoRoot,
    runtimeRoot,
    authorize: verifyStageGateBAtExactMain,
    verifyOutcome: verifyReviewedStageOutcome,
  });
}

/** Stage 0 recovery is fail-stuck; a later reviewed recovery registry must resolve this digest internally. */
export async function recoverReviewedStageLock(request = {}) {
  if (!hasExactKeys(request, PUBLIC_RECOVERY_REQUEST_KEYS)
    || typeof request.taskId !== "string"
    || typeof request.stageId !== "string"
    || typeof request.idempotencyKey !== "string"
    || !FULL_REVISION.test(request.sourceRevision ?? "")
    || !RECEIPT_DIGEST.test(request.stageBindingDigest ?? "")
    || !RECEIPT_DIGEST.test(request.recoveryReviewDigest ?? "")) {
    return result(false, "STAGE_LOCK_RECOVERY_REQUEST_INVALID");
  }
  return result(false, "STAGE_LOCK_RECOVERY_DISABLED_STAGE0", {
    taskId: request.taskId,
    stageId: request.stageId,
  });
}

async function selfTest() {
  const root = await mkdtemp(path.join(os.tmpdir(), "P0-stage-runner-"));
  let cases = 0;
  try {
    const repoRoot = path.join(root, "repo");
    const runtimeRoot = path.join(root, "runtime");
    await mkdir(path.join(repoRoot, "tools"), { recursive: true });
    const tokenCanary = `${["g", "h", "p", "_"].join("")}ABCDEFGHIJKLMNOPQRSTUV`;
    const definitionFor = ({
      suffix = "SYNTHETIC-SHELL",
      moduleId = "eng.synthetic",
      argumentSetId = "synthetic.v1",
      deadlineMs = 5_000,
      scopeClass = "local-synthetic",
      actionClass = "synthetic-foundation",
      predecessor = null,
    } = {}) => ({
      schemaVersion: "1.0.0",
      taskId: "ENG-R0-001",
      scopeClass,
      actionClass,
      stageId: `P0-STAGE-ENG-R0-001-${suffix}`,
      predecessor,
      idempotencyKey: `P0-IDEMP-ENG-R0-001-${suffix}-001`,
      moduleId,
      argumentSetId,
      deadlineMs,
    });
    const childResultSource = ({ rawOutput = "", taskIdExpression = "binding('task-id')", prelude = "" } = {}) => [
      "import { writeFileSync } from 'node:fs';",
      prelude,
      "const binding = (name) => process.argv.find((value) => value.startsWith(`--p0-${name}=`))?.split('=', 2)[1];",
      rawOutput.length > 0 ? `process.stdout.write(${JSON.stringify(rawOutput)});` : "",
      "const childResult = {",
      "  schemaVersion: '1.0.0',",
      "  outcome: 'succeeded',",
      `  taskId: ${taskIdExpression},`,
      "  stageId: binding('stage-id'),",
      "  idempotencyKey: binding('idempotency-key'),",
      "  sourceRevision: binding('source-revision'),",
      "  stageBindingDigest: binding('stage-binding'),",
      `  evidenceDigest: ${JSON.stringify(`sha256:${"e".repeat(64)}`)},`,
      "};",
      "writeFileSync(3, `${JSON.stringify(childResult)}\\n`);",
      "",
    ].filter(Boolean).join("\n");
    const writeModule = async (name, source) => {
      const modulePath = path.join(repoRoot, "tools", name);
      await writeFile(modulePath, source, { mode: 0o600 });
      return modulePath;
    };
    const entryFor = async (definition, relativeName) => ({
      moduleId: definition.moduleId,
      moduleRelativePath: `tools/${relativeName}`,
      moduleSha256: sha256(await readFile(path.join(repoRoot, "tools", relativeName))),
      gitMode: "100644",
      argumentSets: { [definition.argumentSetId]: [] },
    });
    const authorizationFor = (definition, overrides = {}) => ({
      ok: true,
      scope: "stage-gate-b",
      code: "STAGE_GATE_B_READY",
      taskId: definition.taskId,
      stageId: definition.stageId,
      scopeClass: definition.scopeClass,
      actionClass: definition.actionClass,
      sourceRevision: "a".repeat(40),
      candidateRevision: "b".repeat(40),
      dossierDigest: "c".repeat(64),
      preparationReviewId: `P0-PREP-ENG-R0-001-${definition.stageId.split("-").slice(5).join("-")}`,
      gateKind: "execute",
      gateDecision: "Ready to execute — Gate B",
      independentQaResult: "pass",
      predecessorReceiptSha256: definition.predecessor?.receiptDigest ?? null,
      preparationReviewSha256: "d".repeat(64),
      idempotencyKey: definition.idempotencyKey,
      stageDefinitionSha256: stageBindingDigest(definition),
      moduleId: definition.moduleId,
      moduleSha256: null,
      stageApprovalSha256: "e".repeat(64),
      registrySha256: "f".repeat(64),
      gateSourceFingerprint: `sha256:${"1".repeat(64)}`,
      deadlineAt: new Date(Date.now() + 30_000).toISOString(),
      rollbackSnapshotReference: "rollback:synthetic-snapshot",
      ...overrides,
    });
    const terminalHistoryFor = (definition, authorization, overrides = {}) => ({
      ok: true,
      scope: "stage-terminal-history",
      code: "STAGE_TERMINAL_HISTORY_VALID",
      taskId: definition.taskId,
      stageId: definition.stageId,
      scopeClass: definition.scopeClass,
      actionClass: definition.actionClass,
      sourceRevision: authorization.sourceRevision,
      candidateRevision: authorization.candidateRevision,
      dossierDigest: authorization.dossierDigest,
      preparationReviewId: authorization.preparationReviewId,
      preparationReviewSha256: authorization.preparationReviewSha256,
      gateKind: authorization.gateKind,
      predecessorReceiptSha256: definition.predecessor?.receiptDigest ?? null,
      idempotencyKey: definition.idempotencyKey,
      stageDefinitionSha256: authorization.stageDefinitionSha256,
      moduleId: definition.moduleId,
      moduleSha256: authorization.moduleSha256,
      rollbackSnapshotReference: authorization.rollbackSnapshotReference,
      stageApprovalSha256: authorization.stageApprovalSha256,
      registrySha256: authorization.registrySha256,
      ...overrides,
    });
    const executeFixture = async (definition, moduleEntry, overrides = {}) => {
      const authorization = overrides.authorization ?? authorizationFor(definition, {
        moduleSha256: moduleEntry.moduleSha256,
      });
      return executeResolvedStage({
        definition,
        moduleEntry,
        repoRoot,
        runtimeRoot,
        authorize: overrides.authorize ?? (async () => authorization),
        verifyOutcome: overrides.verifyOutcome ?? (async (request) => ({
          schemaVersion: request.schemaVersion,
          outcome: "pass",
          boundary: request.boundary,
          taskId: request.taskId,
          stageId: request.stageId,
          sourceRevision: request.sourceRevision,
          stageBindingDigest: request.stageBindingDigest,
          moduleSha256: request.moduleSha256,
          childResultSha256: request.childResultSha256,
          evidenceDigest: request.evidenceDigest,
          observationDigest: sha256(`synthetic observation:${request.boundary}`),
        })),
        quiescenceIntervalMs: overrides.quiescenceIntervalMs ?? 5,
        clock: overrides.clock ?? (() => new Date()),
      });
    };

    const definition = definitionFor();
    const successName = "P0-runner-fixture.mjs";
    await writeModule(successName, childResultSource({ rawOutput: `synthetic raw token: ${tokenCanary}\n` }));
    const moduleEntry = await entryFor(definition, successName);
    let authorizationCalls = 0;
    const stableAuthorization = authorizationFor(definition, { moduleSha256: moduleEntry.moduleSha256 });
    const succeeded = await executeFixture(definition, moduleEntry, {
      authorize: async () => {
        authorizationCalls += 1;
        return { ...stableAuthorization, deadlineAt: new Date(Date.now() + 30_000).toISOString() };
      },
    });
    if (succeeded.code !== "STAGE_SUCCEEDED" || JSON.stringify(succeeded).includes(tokenCanary)) {
      throw new Error("successful closed-output case failed");
    }
    cases += 1;
    const expectedPublicReceiptKeys = [
      "ok", "code", "taskId", "stageId", "gateKind", "scopeClass", "actionClass", "sourceRevision",
      "dossierDigest", "predecessorReceiptDigest", "idempotencyKey", "authorityDeadline", "authorityStatus",
      "state", "mutationStatement", "rollbackSnapshotReference", "immediateVerification",
      "quiescentVerification", "receiptDigest", "attempt", "consequence", "nextAction",
    ];
    if (canonicalJson(Object.keys(succeeded)) !== canonicalJson(expectedPublicReceiptKeys)
      || succeeded.gateKind !== "execute"
      || succeeded.authorityStatus !== "current"
      || succeeded.mutationStatement !== "Mutation verified complete"
      || succeeded.immediateVerification !== "pass"
      || succeeded.quiescentVerification !== "pass"
      || succeeded.nextAction !== "Run a separately reviewed delivery transition.") {
      throw new Error("ordered public operator receipt contract case failed");
    }
    cases += 1;
    const privatePathCanary = ["", "Users", "private", "raw-output"].join("/");
    if (sanitizedResultIsSafe({ ...succeeded, nextAction: privatePathCanary })) {
      throw new Error("public operator receipt private-path rejection case failed");
    }
    cases += 1;
    if (authorizationCalls !== 8) throw new Error("post-action authorization count case failed");
    cases += 1;
    const successKey = safeRuntimeSegment(`${definition.taskId}\0${definition.stageId}\0${definition.idempotencyKey}`);
    const successEvents = await readEvents(path.join(runtimeRoot, successKey, "events"));
    if (successEvents.map((event) => event.state).join(",") !== "running,verification-pending,verified-complete") {
      throw new Error("verification-pending ordering case failed");
    }
    cases += 1;
    const terminalVerificationDigests = [
      successEvents.at(-1).receipt.immediateVerificationSha256,
      successEvents.at(-1).receipt.quiescent1VerificationSha256,
      successEvents.at(-1).receipt.quiescent2VerificationSha256,
    ];
    const terminalVerificationResults = [
      successEvents.at(-1).receipt.immediateVerificationResult,
      successEvents.at(-1).receipt.quiescent1VerificationResult,
      successEvents.at(-1).receipt.quiescent2VerificationResult,
    ];
    if (!terminalVerificationDigests.every((digest) => RECEIPT_DIGEST.test(digest ?? ""))
      || new Set(terminalVerificationDigests).size !== 3
      || !terminalVerificationResults.every((outcome) => outcome === "pass")) {
      throw new Error("terminal outcome-verification binding case failed");
    }
    cases += 1;

    const replay = await executeFixture(definition, moduleEntry);
    if (replay.code !== "STAGE_ALREADY_SUCCEEDED" || replay.receiptDigest !== succeeded.receiptDigest) {
      throw new Error("idempotent replay case failed");
    }
    cases += 1;
    const crossRevisionReplay = await executeFixture(definition, moduleEntry, {
      authorization: authorizationFor(definition, {
        moduleSha256: moduleEntry.moduleSha256,
        sourceRevision: "2".repeat(40),
        registrySha256: "3".repeat(64),
        gateSourceFingerprint: `sha256:${"4".repeat(64)}`,
      }),
    });
    const changedImmutableBindingReplay = await executeFixture(definition, moduleEntry, {
      authorization: authorizationFor(definition, {
        moduleSha256: moduleEntry.moduleSha256,
        sourceRevision: "2".repeat(40),
        registrySha256: "3".repeat(64),
        gateSourceFingerprint: `sha256:${"4".repeat(64)}`,
        dossierDigest: "5".repeat(64),
      }),
    });
    const laterHistoryAuthorization = authorizationFor(definition, {
      moduleSha256: moduleEntry.moduleSha256,
      sourceRevision: "6".repeat(40),
      registrySha256: "7".repeat(64),
      gateSourceFingerprint: `sha256:${"8".repeat(64)}`,
    });
    const readOnlyHistoryReplay = await reconcileTerminalStage({
      request: bindingRequest(definition),
      runtimeRoot,
      verifyHistory: async () => terminalHistoryFor(definition, laterHistoryAuthorization),
    });
    const readOnlyHistoryBindingDrift = await reconcileTerminalStage({
      request: bindingRequest(definition),
      runtimeRoot,
      verifyHistory: async () => terminalHistoryFor(definition, laterHistoryAuthorization, {
        dossierDigest: "9".repeat(64),
      }),
    });
    if (crossRevisionReplay.code !== "STAGE_ALREADY_SUCCEEDED"
      || crossRevisionReplay.receiptDigest !== succeeded.receiptDigest
      || changedImmutableBindingReplay.code !== "STAGE_RECEIPT_INVALID"
      || readOnlyHistoryReplay.code !== "STAGE_ALREADY_SUCCEEDED"
      || readOnlyHistoryReplay.receiptDigest !== succeeded.receiptDigest
      || readOnlyHistoryBindingDrift.code !== "STAGE_RECEIPT_INVALID") {
      throw new Error("cross-revision idempotency case failed");
    }
    cases += 1;

    const rawOutput = await readFile(path.join(runtimeRoot, successKey, "raw-evidence", "stdout.raw"), "utf8");
    if (!rawOutput.includes(tokenCanary)) throw new Error("raw evidence direct-custody case failed");
    cases += 1;

    for (const injected of [
      { command: "sh" },
      { path: "/tmp/evil" },
      { env: { TOKEN: "x" } },
      { callback: "evil" },
      { output: "raw" },
      { trust: true },
    ]) {
      const denied = await runSerializableStageFromExactMain({
        taskId: definition.taskId,
        scopeClass: definition.scopeClass,
        actionClass: definition.actionClass,
        stageId: definition.stageId,
        predecessorReceiptSha256: null,
        idempotencyKey: definition.idempotencyKey,
        ...injected,
      });
      if (denied.code !== "STAGE_REQUEST_SHAPE_INVALID") throw new Error("injection case failed");
      cases += 1;
    }
    const unreviewed = await runSerializableStageFromExactMain({
      taskId: definition.taskId,
      scopeClass: definition.scopeClass,
      actionClass: definition.actionClass,
      stageId: definition.stageId,
      predecessorReceiptSha256: null,
      idempotencyKey: definition.idempotencyKey,
    });
    if (unreviewed.code !== "STAGE_ACTION_NOT_REVIEWED") throw new Error("empty production allowlist case failed");
    cases += 1;

    const deniedDefinition = definitionFor({ suffix: "INVALID-AUTHORIZATION" });
    const deniedEntry = { ...moduleEntry, moduleId: deniedDefinition.moduleId };
    const invalidContext = await executeFixture(deniedDefinition, deniedEntry, {
      authorization: authorizationFor(deniedDefinition, {
        moduleSha256: deniedEntry.moduleSha256,
        taskId: "REL-R0-001",
      }),
    });
    if (invalidContext.code !== "STAGE_GATE_B_DENIED") throw new Error("Gate B context binding case failed");
    cases += 1;

    const missingPredecessorDefinition = definitionFor({
      suffix: "PRIVATE-DEPLOY",
      scopeClass: "private-execution",
      actionClass: "deployment",
      predecessor: {
        stageId: definition.stageId,
        receiptDigest: `sha256:${"f".repeat(64)}`,
      },
    });
    const missingPredecessor = await executeFixture(missingPredecessorDefinition, moduleEntry);
    if (missingPredecessor.code !== "STAGE_PREDECESSOR_RECEIPT_MISSING") {
      throw new Error("predecessor receipt existence case failed");
    }
    cases += 1;

    const tamperedDefinition = definitionFor({ suffix: "TAMPERED-MODULE" });
    const tamperedModule = await executeFixture(tamperedDefinition, {
      ...moduleEntry,
      moduleSha256: `sha256:${"0".repeat(64)}`,
    });
    if (tamperedModule.code !== "STAGE_MODULE_NOT_ALLOWLISTED") {
      throw new Error("tampered module digest case failed");
    }
    cases += 1;

    const interruptedDefinition = definitionFor({ suffix: "INTERRUPTED" });
    const interruptedKey = safeRuntimeSegment(`${interruptedDefinition.taskId}\0${interruptedDefinition.stageId}\0${interruptedDefinition.idempotencyKey}`);
    const interruptedEvents = path.join(runtimeRoot, interruptedKey, "events");
    await mkdir(interruptedEvents, { recursive: true });
    await appendEvent(interruptedEvents, 1, {
      schemaVersion: interruptedDefinition.schemaVersion,
      state: "running",
      occurredAt: new Date().toISOString(),
      processGroupId: null,
      sourceRevision: stableAuthorization.sourceRevision,
      stageBindingDigest: stageBindingDigest(interruptedDefinition),
      executorSha256: moduleEntry.moduleSha256,
    });
    const interrupted = await executeFixture(interruptedDefinition, moduleEntry);
    if (interrupted.code !== "STAGE_RECOVERY_REQUIRED" || interrupted.state !== "recovery-required") {
      throw new Error("interrupted journal recovery case failed");
    }
    cases += 1;

    const noResultName = "P0-runner-no-result-fixture.mjs";
    await writeModule(noResultName, "process.stdout.write('exit zero without a result receipt\\n');\n");
    const noResultDefinition = definitionFor({ suffix: "NO-CHILD-RESULT", moduleId: "eng.no-result", argumentSetId: "no-result.v1" });
    const noResult = await executeFixture(noResultDefinition, await entryFor(noResultDefinition, noResultName));
    if (noResult.code !== "STAGE_RECOVERY_REQUIRED") throw new Error("exit-zero child-result requirement case failed");
    cases += 1;

    const wrongResultName = "P0-runner-wrong-result-fixture.mjs";
    await writeModule(wrongResultName, childResultSource({ taskIdExpression: "'REL-R0-001'" }));
    const wrongResultDefinition = definitionFor({ suffix: "WRONG-CHILD-RESULT", moduleId: "eng.wrong-result", argumentSetId: "wrong-result.v1" });
    const wrongResult = await executeFixture(wrongResultDefinition, await entryFor(wrongResultDefinition, wrongResultName));
    if (wrongResult.code !== "STAGE_RECOVERY_REQUIRED") throw new Error("child-result binding case failed");
    cases += 1;

    const escapedMarker = path.join(root, "escaped-descendant.txt");
    const detachedName = "P0-runner-detached-fixture.mjs";
    const detachedPrelude = [
      "import { spawn } from 'node:child_process';",
      "let detachedDenied = false;",
      "try {",
      `  const escaped = spawn(process.execPath, ['-e', ${JSON.stringify(`require('node:fs').writeFileSync(${JSON.stringify(escapedMarker)}, 'escaped')`)}], { detached: true, stdio: 'ignore' });`,
      "  escaped.unref();",
      "} catch (error) { detachedDenied = error?.code === 'ERR_ACCESS_DENIED'; }",
      "if (!detachedDenied) process.exit(74);",
    ].join("\n");
    await writeModule(detachedName, childResultSource({ prelude: detachedPrelude }));
    const detachedDefinition = definitionFor({ suffix: "DETACHED-DESCENDANT", moduleId: "eng.detached", argumentSetId: "detached.v1" });
    const detachedResult = await executeFixture(detachedDefinition, await entryFor(detachedDefinition, detachedName));
    if (detachedResult.code !== "STAGE_SUCCEEDED") throw new Error("detached descendant denial case failed");
    cases += 1;
    await delay(100);
    let markerExists = true;
    try { await access(escapedMarker); } catch { markerExists = false; }
    if (markerExists) throw new Error("detached descendant escaped containment");
    cases += 1;

    const revokedDefinition = definitionFor({ suffix: "POST-ACTION-REVOKED" });
    let revokeCalls = 0;
    const revokedAuthorization = authorizationFor(revokedDefinition, { moduleSha256: moduleEntry.moduleSha256 });
    const revoked = await executeFixture(revokedDefinition, moduleEntry, {
      authorize: async () => {
        revokeCalls += 1;
        return revokeCalls === 1
          ? revokedAuthorization
          : { ...revokedAuthorization, stageApprovalSha256: "0".repeat(64) };
      },
    });
    if (revoked.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID" || revoked.state !== "recovery-required") {
      throw new Error("post-action authority revocation case failed");
    }
    cases += 1;

    const expiredDuringVerificationDefinition = definitionFor({ suffix: "EXPIRED-DURING-VERIFICATION" });
    let verifierNowMs = Date.now();
    const expiredDuringVerificationAuthorization = authorizationFor(expiredDuringVerificationDefinition, {
      moduleSha256: moduleEntry.moduleSha256,
      deadlineAt: new Date(verifierNowMs + 30_000).toISOString(),
    });
    const expiredDuringVerification = await executeFixture(expiredDuringVerificationDefinition, moduleEntry, {
      authorization: expiredDuringVerificationAuthorization,
      clock: () => new Date(verifierNowMs),
      verifyOutcome: async (request) => {
        if (request.boundary === "quiescent-2") verifierNowMs += 31_000;
        return {
          schemaVersion: request.schemaVersion,
          outcome: "pass",
          boundary: request.boundary,
          taskId: request.taskId,
          stageId: request.stageId,
          sourceRevision: request.sourceRevision,
          stageBindingDigest: request.stageBindingDigest,
          moduleSha256: request.moduleSha256,
          childResultSha256: request.childResultSha256,
          evidenceDigest: request.evidenceDigest,
          observationDigest: sha256(`synthetic slow observation:${request.boundary}`),
        };
      },
    });
    if (expiredDuringVerification.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID"
      || expiredDuringVerification.state !== "recovery-required") {
      throw new Error("authority expiry during outcome verification case failed");
    }
    cases += 1;
    const expiredDuringVerificationKey = safeRuntimeSegment(`${expiredDuringVerificationDefinition.taskId}\0${expiredDuringVerificationDefinition.stageId}\0${expiredDuringVerificationDefinition.idempotencyKey}`);
    const expiredDuringVerificationEvents = await readEvents(path.join(runtimeRoot, expiredDuringVerificationKey, "events"));
    if (expiredDuringVerificationEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("expired outcome verification became replayable success");
    }
    cases += 1;

    const verificationDriftDefinition = definitionFor({ suffix: "QUIESCENT-OUTCOME-DRIFT" });
    const verificationDrift = await executeFixture(verificationDriftDefinition, moduleEntry, {
      verifyOutcome: async (request) => ({
        schemaVersion: request.schemaVersion,
        outcome: request.boundary === "quiescent-1" ? "hold" : "pass",
        boundary: request.boundary,
        taskId: request.taskId,
        stageId: request.stageId,
        sourceRevision: request.sourceRevision,
        stageBindingDigest: request.stageBindingDigest,
        moduleSha256: request.moduleSha256,
        childResultSha256: request.childResultSha256,
        evidenceDigest: request.evidenceDigest,
        observationDigest: sha256(`synthetic drift observation:${request.boundary}`),
      }),
    });
    if (verificationDrift.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID") {
      throw new Error("quiescent outcome drift case failed");
    }
    cases += 1;
    const verificationDriftKey = safeRuntimeSegment(`${verificationDriftDefinition.taskId}\0${verificationDriftDefinition.stageId}\0${verificationDriftDefinition.idempotencyKey}`);
    const verificationDriftEvents = await readEvents(path.join(runtimeRoot, verificationDriftKey, "events"));
    if (verificationDriftEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("quiescent outcome drift became replayable success");
    }
    cases += 1;
    const revokedKey = safeRuntimeSegment(`${revokedDefinition.taskId}\0${revokedDefinition.stageId}\0${revokedDefinition.idempotencyKey}`);
    const revokedEvents = await readEvents(path.join(runtimeRoot, revokedKey, "events"));
    if (revokedEvents.some((event) => event.state === "verified-complete")
      || revokedEvents.map((event) => event.state).join(",") !== "running,verification-pending,recovery-required") {
      throw new Error("pending receipt replay safety case failed");
    }
    cases += 1;

    const staleDefinition = definitionFor({ suffix: "STALE-LOCK-RECOVERY" });
    const staleAuthorization = authorizationFor(staleDefinition, { moduleSha256: moduleEntry.moduleSha256 });
    const staleRuntimeKey = safeRuntimeSegment(`${staleDefinition.taskId}\0${staleDefinition.stageId}\0${staleDefinition.idempotencyKey}`);
    const staleEventDir = path.join(runtimeRoot, staleRuntimeKey, "events");
    const staleLockDir = path.join(runtimeRoot, "locks");
    const staleLockPath = path.join(staleLockDir, `${staleRuntimeKey}.lock`);
    await mkdir(staleEventDir, { recursive: true });
    await mkdir(staleLockDir, { recursive: true });
    const staleNonce = "3".repeat(64);
    const staleLockRecord = {
      schemaVersion: staleDefinition.schemaVersion,
      runtimeKey: staleRuntimeKey,
      taskId: staleDefinition.taskId,
      stageId: staleDefinition.stageId,
      sourceRevision: staleAuthorization.sourceRevision,
      stageBindingDigest: stageBindingDigest(staleDefinition),
      ownerNonce: staleNonce,
      supervisorPid: 2_147_483_000,
      supervisorStartIdentity: "synthetic stale supervisor identity",
      childPid: null,
      childStartIdentity: null,
      childProcessGroupId: null,
      pendingReceiptSha256: null,
      heartbeatAt: new Date().toISOString(),
    };
    await writeFile(staleLockPath, `${canonicalJson(staleLockRecord)}\n`, { mode: 0o600 });
    const ordinaryStaleAttempt = await executeFixture(staleDefinition, moduleEntry, { authorization: staleAuthorization });
    if (ordinaryStaleAttempt.code !== "STAGE_LOCK_UNAVAILABLE") throw new Error("ordinary stale-lock fail-stuck case failed");
    cases += 1;
    const staleLockStillPresent = await readLockRecord(staleLockPath);
    if (staleLockStillPresent?.ownerNonce !== staleNonce) throw new Error("ordinary execution altered stale lock");
    cases += 1;
    const expectedStaleLock = {
      schemaVersion: staleDefinition.schemaVersion,
      runtimeKey: staleRuntimeKey,
      taskId: staleDefinition.taskId,
      stageId: staleDefinition.stageId,
      sourceRevision: staleAuthorization.sourceRevision,
      stageBindingDigest: stageBindingDigest(staleDefinition),
      eventDir: staleEventDir,
    };
    const reviewedRecoveryClaim = {
      schemaVersion: staleDefinition.schemaVersion,
      decision: "recover-stale-stage-lock",
      taskId: staleDefinition.taskId,
      stageId: staleDefinition.stageId,
      sourceRevision: staleAuthorization.sourceRevision,
      stageBindingDigest: stageBindingDigest(staleDefinition),
      ownerNonce: staleNonce,
      ownerClaimDigest: sha256(canonicalJson(staleLockRecord)),
    };
    const reviewedRecovery = {
      ...reviewedRecoveryClaim,
      recoveryReviewDigest: sha256(canonicalJson(reviewedRecoveryClaim)),
    };
    const forgedRecoveryClaim = {
      ...reviewedRecoveryClaim,
      ownerClaimDigest: sha256(canonicalJson({
        ...staleLockRecord,
        pendingReceiptSha256: sha256("forged pending receipt"),
      })),
    };
    if (await reconcileStaleLock(staleLockPath, expectedStaleLock, {
      ...forgedRecoveryClaim,
      recoveryReviewDigest: sha256(canonicalJson(forgedRecoveryClaim)),
    })) throw new Error("unbound stale-lock owner claim case failed");
    if (!await reconcileStaleLock(staleLockPath, expectedStaleLock, reviewedRecovery)) {
      throw new Error("reviewed stale-lock reconciliation case failed");
    }
    cases += 1;
    const staleRecovered = await executeFixture(staleDefinition, moduleEntry, { authorization: staleAuthorization });
    if (staleRecovered.code !== "STAGE_SUCCEEDED") throw new Error("post-recovery stage execution case failed");
    cases += 1;
    const reconciledNames = await readdir(staleLockDir);
    if (!reconciledNames.includes(`${staleRuntimeKey}.lock.reconciled-${staleNonce}`)) {
      throw new Error("stale-lock owner claim case failed");
    }
    cases += 1;

    const malformedLockDefinition = definitionFor({ suffix: "MALFORMED-LOCK" });
    const malformedKey = safeRuntimeSegment(`${malformedLockDefinition.taskId}\0${malformedLockDefinition.stageId}\0${malformedLockDefinition.idempotencyKey}`);
    const malformedLockPath = path.join(staleLockDir, `${malformedKey}.lock`);
    await writeFile(malformedLockPath, "{}\n", { mode: 0o600 });
    const malformedLock = await executeFixture(malformedLockDefinition, moduleEntry);
    if (malformedLock.code !== "STAGE_LOCK_UNAVAILABLE") throw new Error("malformed stale-lock denial case failed");
    cases += 1;

    const disabledRecovery = await recoverReviewedStageLock({
      taskId: staleDefinition.taskId,
      stageId: staleDefinition.stageId,
      idempotencyKey: staleDefinition.idempotencyKey,
      sourceRevision: staleAuthorization.sourceRevision,
      stageBindingDigest: stageBindingDigest(staleDefinition),
      recoveryReviewDigest: reviewedRecovery.recoveryReviewDigest,
    });
    if (disabledRecovery.code !== "STAGE_LOCK_RECOVERY_DISABLED_STAGE0") {
      throw new Error("Stage 0 lock recovery disable case failed");
    }
    cases += 1;

    const hangName = "P0-runner-hang-fixture.mjs";
    await writeModule(hangName, "setInterval(() => {}, 1000);\n");
    const hangDefinition = definitionFor({
      suffix: "PROCESS-TREE-TIMEOUT",
      moduleId: "eng.hang",
      argumentSetId: "hang.v1",
      deadlineMs: 1_000,
    });
    const hangEntry = await entryFor(hangDefinition, hangName);
    const hangResult = await executeFixture(hangDefinition, hangEntry);
    if (hangResult.code !== "STAGE_RECOVERY_REQUIRED" || hangResult.state !== "recovery-required") {
      throw new Error("process-tree timeout case failed");
    }
    cases += 1;

    const hangKey = safeRuntimeSegment(`${hangDefinition.taskId}\0${hangDefinition.stageId}\0${hangDefinition.idempotencyKey}`);
    const hangEventDir = path.join(runtimeRoot, hangKey, "events");
    const hangEventNames = (await readdir(hangEventDir)).filter((name) => EVENT_FILE.test(name)).sort();
    await writeFile(path.join(hangEventDir, hangEventNames.at(-1)), "{}\n", { mode: 0o600 });
    const tamperedJournal = await executeFixture(hangDefinition, hangEntry);
    if (tamperedJournal.code !== "STAGE_RUNNER_FAILED") throw new Error("receipt journal tamper case failed");
    cases += 1;

    return { ok: true, code: "SELF_TEST_OK", cases, productionModules: 0 };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function usage() {
  return "Usage: node tools/P0-stage-runner.mjs --self-test\nProduction execution is available only through the exported closed API.";
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  if (process.argv.length === 3 && process.argv[2] === "--self-test") {
    console.log(JSON.stringify(await selfTest()));
  } else if (process.argv.length === 3 && process.argv[2] === "--help") {
    console.log(usage());
  } else {
    console.log(JSON.stringify(result(false, "STAGE_CLI_DIAGNOSTIC_ONLY")));
    process.exitCode = 1;
  }
}
