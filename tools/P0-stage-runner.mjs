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
import { types as utilTypes } from "node:util";
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

// Callback code runs in-process, so deadline and restoration logic must not
// look up mutable globals after the reviewed function starts.
const PRIMORDIAL_DATE = Date;
const PRIMORDIAL_DATE_NOW = Date.now.bind(Date);
const PRIMORDIAL_DATE_PARSE = Date.parse.bind(Date);
const PRIMORDIAL_DATE_GET_TIME = Date.prototype.getTime.call.bind(Date.prototype.getTime);
const PRIMORDIAL_DATE_TO_ISO_STRING = Date.prototype.toISOString.call.bind(Date.prototype.toISOString);
const PRIMORDIAL_HRTIME_BIGINT = process.hrtime.bigint.bind(process.hrtime);
const PRIMORDIAL_SET_TIMEOUT = globalThis.setTimeout.bind(globalThis);
const PRIMORDIAL_CLEAR_TIMEOUT = globalThis.clearTimeout.bind(globalThis);
const PRIMORDIAL_QUEUE_MICROTASK = globalThis.queueMicrotask.bind(globalThis);
const PRIMORDIAL_OBJECT_DEFINE_PROPERTY = Object.defineProperty.bind(Object);
const PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTOR = Object.getOwnPropertyDescriptor.bind(Object);
const PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTORS = Object.getOwnPropertyDescriptors.bind(Object);
const PRIMORDIAL_OBJECT_GET_PROTOTYPE_OF = Object.getPrototypeOf.bind(Object);
const PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_SYMBOLS = Object.getOwnPropertySymbols.bind(Object);
const PRIMORDIAL_OBJECT_FREEZE = Object.freeze.bind(Object);
const PRIMORDIAL_REFLECT_DELETE_PROPERTY = Reflect.deleteProperty.bind(Reflect);
const PRIMORDIAL_BUFFER_FROM = Buffer.from.bind(Buffer);
const PRIMORDIAL_BUFFER_IS_BUFFER = Buffer.isBuffer.bind(Buffer);
const PRIMORDIAL_ARRAY_BUFFER_IS_VIEW = ArrayBuffer.isView.bind(ArrayBuffer);
const PRIMORDIAL_STDOUT = process.stdout;
const PRIMORDIAL_STDERR = process.stderr;
const primordialClock = () => new PRIMORDIAL_DATE(PRIMORDIAL_DATE_NOW());

const DEFAULT_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTION_REQUEST_KEYS = Object.freeze([
  "taskId",
  "scopeClass",
  "actionClass",
  "stageId",
  "predecessorReceiptSha256",
  "idempotencyKey",
]);
const CALLBACK_PRODUCTION_REQUEST_KEYS = Object.freeze([
  ...PRODUCTION_REQUEST_KEYS,
  "execute",
]);
const MODULE_ENTRY_KEYS = Object.freeze([
  "moduleId",
  "moduleRelativePath",
  "moduleSha256",
  "gitMode",
  "argumentSets",
]);
const CALLBACK_ALLOWLIST_ENTRY_KEYS = Object.freeze([
  "moduleId",
  "moduleRelativePath",
  "moduleSha256",
  "gitMode",
  "execute",
  "capabilityProfile",
  "capabilityReviewSha256",
]);
const CALLBACK_CAPABILITY_PROFILE = "trusted-public-synthetic-no-native-io-v1";
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
const CALLBACK_COMPLETION_KEYS = Object.freeze([
  "schemaVersion", "outcome", "taskId", "scopeClass", "actionClass", "stageId",
  "predecessorReceiptSha256", "idempotencyKey", "sourceRevision", "candidateRevision",
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
const MAX_CALLBACK_DEADLINE_MS = 5 * 60 * 1_000;
const EMPTY_EVIDENCE_SHA256 = `sha256:${crypto.createHash("sha256").update(Buffer.alloc(0)).digest("hex")}`;

// Stage 0 intentionally has no executable production modules or argument sets.
// Later task candidates must add exact reviewed entries; callers can never add one.
const PRODUCTION_MODULE_ALLOWLIST = Object.freeze({});
const PRODUCTION_CALLBACK_ALLOWLIST = Object.freeze({});
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
    || !Number.isFinite(PRIMORDIAL_DATE_PARSE(authorization.deadlineAt ?? ""))) return false;
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
  return new Promise((resolve) => PRIMORDIAL_SET_TIMEOUT(resolve, milliseconds));
}

async function syncDirectory(directory) {
  const handle = await open(directory, "r");
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function syncRegularFile(filePath) {
  const before = await lstat(filePath);
  if (!before.isFile() || before.isSymbolicLink()) {
    throw new Error("journal tail is not a regular file");
  }
  const handle = await open(filePath, "r");
  try {
    const opened = await handle.stat();
    const current = await lstat(filePath);
    if (!current.isFile()
      || current.isSymbolicLink()
      || opened.dev !== current.dev
      || opened.ino !== current.ino
      || before.dev !== current.dev
      || before.ino !== current.ino) {
      throw new Error("journal tail identity changed before fsync");
    }
    await handle.sync();
    return Object.freeze({ dev: current.dev, ino: current.ino });
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

function captureSerializableProductionRequest(request) {
  try {
    if (request === null
      || typeof request !== "object"
      || Array.isArray(request)
      || utilTypes.isProxy(request)
      || PRIMORDIAL_OBJECT_GET_PROTOTYPE_OF(request) !== Object.prototype
      || PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_SYMBOLS(request).length !== 0) {
      return null;
    }
    const descriptors = PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTORS(request);
    if (Object.keys(descriptors).sort().join("\0") !== [...PRODUCTION_REQUEST_KEYS].sort().join("\0")
      || !Object.values(descriptors).every((descriptor) => Object.hasOwn(descriptor, "value")
        && descriptor.get === undefined
        && descriptor.set === undefined
        && descriptor.enumerable === true)) {
      return null;
    }
    const identity = PRIMORDIAL_OBJECT_FREEZE(Object.fromEntries(
      PRODUCTION_REQUEST_KEYS.map((key) => [key, descriptors[key].value]),
    ));
    return validateProductionRequest(identity).ok ? identity : null;
  } catch {
    return null;
  }
}

function captureCallbackProductionRequest(request) {
  try {
    if (request === null
      || typeof request !== "object"
      || Array.isArray(request)
      || utilTypes.isProxy(request)
      || PRIMORDIAL_OBJECT_GET_PROTOTYPE_OF(request) !== Object.prototype
      || PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_SYMBOLS(request).length !== 0) {
      return null;
    }
    const descriptors = PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTORS(request);
    if (Object.keys(descriptors).sort().join("\0") !== [...CALLBACK_PRODUCTION_REQUEST_KEYS].sort().join("\0")
      || !Object.values(descriptors).every((descriptor) => Object.hasOwn(descriptor, "value")
        && descriptor.get === undefined
        && descriptor.set === undefined
        && descriptor.enumerable === true)
      || typeof descriptors.execute.value !== "function") {
      return null;
    }
    const identity = PRIMORDIAL_OBJECT_FREEZE(Object.fromEntries(
      PRODUCTION_REQUEST_KEYS.map((key) => [key, descriptors[key].value]),
    ));
    const validation = validateProductionRequest(identity);
    return validation.ok
      ? PRIMORDIAL_OBJECT_FREEZE({ identity, execute: descriptors.execute.value })
      : null;
  } catch {
    return null;
  }
}

function reviewedCallbackMatches(entry, moduleEntry, execute) {
  try {
    if (entry === null
      || typeof entry !== "object"
      || Array.isArray(entry)
      || utilTypes.isProxy(entry)
      || PRIMORDIAL_OBJECT_GET_PROTOTYPE_OF(entry) !== Object.prototype
      || PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_SYMBOLS(entry).length !== 0) return false;
    const descriptors = PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTORS(entry);
    return Object.keys(descriptors).sort().join("\0") === [...CALLBACK_ALLOWLIST_ENTRY_KEYS].sort().join("\0")
      && Object.values(descriptors).every((descriptor) => Object.hasOwn(descriptor, "value")
        && descriptor.get === undefined
        && descriptor.set === undefined
        && descriptor.enumerable === true)
      && descriptors.execute.value === execute
      && descriptors.moduleId.value === moduleEntry.moduleId
      && descriptors.moduleRelativePath.value === moduleEntry.moduleRelativePath
      && descriptors.moduleSha256.value === moduleEntry.moduleSha256
      && descriptors.gitMode.value === moduleEntry.gitMode
      && descriptors.capabilityProfile.value === CALLBACK_CAPABILITY_PROFILE
      && RECEIPT_DIGEST.test(descriptors.capabilityReviewSha256.value ?? "");
  } catch {
    return false;
  }
}

function validateCallbackCompletion(value, expected) {
  if (!hasExactKeys(value, CALLBACK_COMPLETION_KEYS)
    || value.schemaVersion !== "1.0.0"
    || value.outcome !== "succeeded"
    || value.taskId !== expected.taskId
    || value.scopeClass !== expected.scopeClass
    || value.actionClass !== expected.actionClass
    || value.stageId !== expected.stageId
    || value.predecessorReceiptSha256 !== expected.predecessorReceiptSha256
    || value.idempotencyKey !== expected.idempotencyKey
    || value.sourceRevision !== expected.sourceRevision
    || value.candidateRevision !== expected.candidateRevision
    || value.stageBindingDigest !== expected.stageBindingDigest
    || !RECEIPT_DIGEST.test(value.evidenceDigest ?? "")) return null;
  try {
    const bytes = Buffer.from(canonicalJson(value), "utf8");
    if (bytes.length === 0 || bytes.length > MAX_CHILD_RESULT_BYTES || !publicTextBytesAreSafe(bytes)) return null;
    return Object.freeze({ value: Object.freeze({ ...value }), digest: sha256(bytes) });
  } catch {
    return null;
  }
}

function frozenCallbackContext({ definition, authorization, deadlineAt }) {
  const signalController = new AbortController();
  // Freeze the complete caller-owned context and every ordinary data value.
  // AbortSignal is the intentional native exception: its reference is frozen
  // into the context while its internal aborted/reason state must remain able
  // to change when the runner requests cancellation.
  return Object.freeze({
    controller: signalController,
    value: Object.freeze({
      taskId: definition.taskId,
      scopeClass: definition.scopeClass,
      actionClass: definition.actionClass,
      stageId: definition.stageId,
      predecessorReceiptSha256: definition.predecessor?.receiptDigest ?? null,
      idempotencyKey: definition.idempotencyKey,
      revision: authorization.sourceRevision,
      candidateRevision: authorization.candidateRevision,
      deadlineAt: PRIMORDIAL_DATE_TO_ISO_STRING(new PRIMORDIAL_DATE(deadlineAt)),
      signal: signalController.signal,
    }),
  });
}

function installCallbackStreamCapture() {
  const install = (stream, channel) => {
    const originalDescriptor = PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTOR(stream, "write");
    const hash = crypto.createHash("sha256");
    const updateHash = hash.update.bind(hash);
    const digestHash = hash.digest.bind(hash);
    let writeCount = 0;
    let byteCount = 0;
    const interceptedWrite = function interceptedCallbackStreamWrite(chunk, encoding, callback) {
      let completion = callback;
      let selectedEncoding = encoding;
      if (typeof encoding === "function") {
        completion = encoding;
        selectedEncoding = undefined;
      }
      let bytes;
      try {
        if (typeof chunk === "string") {
          bytes = PRIMORDIAL_BUFFER_FROM(chunk, typeof selectedEncoding === "string" ? selectedEncoding : "utf8");
        } else if (PRIMORDIAL_BUFFER_IS_BUFFER(chunk)) {
          bytes = chunk;
        } else if (PRIMORDIAL_ARRAY_BUFFER_IS_VIEW(chunk)) {
          bytes = PRIMORDIAL_BUFFER_FROM(chunk.buffer, chunk.byteOffset, chunk.byteLength);
        } else {
          bytes = PRIMORDIAL_BUFFER_FROM("P0_CALLBACK_INVALID_STREAM_CHUNK", "utf8");
        }
      } catch {
        bytes = PRIMORDIAL_BUFFER_FROM("P0_CALLBACK_INVALID_STREAM_ENCODING", "utf8");
      }
      writeCount += 1;
      byteCount += bytes.length;
      // Preserve a non-empty digest even for an attempted zero-byte write.
      updateHash(bytes.length === 0 ? PRIMORDIAL_BUFFER_FROM([0]) : bytes);
      if (typeof completion === "function") PRIMORDIAL_QUEUE_MICROTASK(() => completion());
      return true;
    };
    PRIMORDIAL_OBJECT_DEFINE_PROPERTY(stream, "write", {
      configurable: true,
      enumerable: originalDescriptor?.enumerable ?? false,
      value: interceptedWrite,
      writable: true,
    });
    return {
      channel,
      stream,
      originalDescriptor,
      interceptedWrite,
      writeCount: () => writeCount,
      byteCount: () => byteCount,
      digest: () => `sha256:${digestHash("hex")}`,
    };
  };

  const captures = [];
  try {
    captures.push(install(PRIMORDIAL_STDOUT, "stdout"));
    captures.push(install(PRIMORDIAL_STDERR, "stderr"));
  } catch (error) {
    for (const capture of captures) {
      try {
        if (capture.originalDescriptor === undefined) {
          PRIMORDIAL_REFLECT_DELETE_PROPERTY(capture.stream, "write");
        } else {
          PRIMORDIAL_OBJECT_DEFINE_PROPERTY(capture.stream, "write", capture.originalDescriptor);
        }
      } catch {
        // The caller treats installation failure as fail-closed before action.
      }
    }
    throw error;
  }
  let finished = false;
  return () => {
    if (finished) throw new Error("callback stream capture already finished");
    finished = true;
    let tampered = false;
    let restored = true;
    for (const capture of captures) {
      try {
        const current = PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTOR(capture.stream, "write");
        if (current?.value !== capture.interceptedWrite) tampered = true;
        if (capture.originalDescriptor === undefined) {
          if (!PRIMORDIAL_REFLECT_DELETE_PROPERTY(capture.stream, "write")) restored = false;
        } else {
          PRIMORDIAL_OBJECT_DEFINE_PROPERTY(capture.stream, "write", capture.originalDescriptor);
        }
      } catch {
        restored = false;
      }
    }
    const stdout = captures[0];
    const stderr = captures[1];
    return PRIMORDIAL_OBJECT_FREEZE({
      stdoutSha256: stdout.digest(),
      stderrSha256: stderr.digest(),
      stdoutWriteCount: stdout.writeCount(),
      stderrWriteCount: stderr.writeCount(),
      stdoutByteCount: stdout.byteCount(),
      stderrByteCount: stderr.byteCount(),
      rawStreamAttempted: stdout.writeCount() + stderr.writeCount() > 0,
      streamBindingTampered: tampered,
      streamsRestored: restored,
    });
  };
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

async function proveReadableEventTailDurable({
  eventDir,
  events,
  syncEventFile,
  syncEventDirectory,
}) {
  const lastObserved = events.at(-1);
  if (!lastObserved) throw new Error("post-action journal tail missing");
  const eventNames = (await readdir(eventDir)).filter((name) => EVENT_FILE.test(name)).sort();
  const tailName = eventNames.at(-1);
  const expectedTailName = `${String(events.length).padStart(4, "0")}-${lastObserved.state}.json`;
  if (eventNames.length !== events.length || tailName !== expectedTailName) {
    throw new Error("post-action journal tail identity not proven");
  }
  const tailPath = path.join(eventDir, tailName);
  const syncedTailIdentity = await syncEventFile(tailPath);
  const revalidatedEvents = await readEvents(eventDir);
  const revalidatedLast = revalidatedEvents.at(-1);
  const tailAfterRead = await lstat(tailPath);
  if (revalidatedEvents.length !== events.length
    || revalidatedLast?.eventSha256 !== lastObserved.eventSha256
    || revalidatedLast?.state !== lastObserved.state
    || !tailAfterRead.isFile()
    || tailAfterRead.isSymbolicLink()
    || tailAfterRead.dev !== syncedTailIdentity?.dev
    || tailAfterRead.ino !== syncedTailIdentity?.ino) {
    throw new Error("post-action journal durability not proven");
  }
  await syncEventDirectory(eventDir);
  return revalidatedLast;
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
  clock = primordialClock,
  quiescenceIntervalMs = QUIESCENCE_INTERVAL_MS,
  appendJournalEvent = appendEvent,
  syncEventFile = syncRegularFile,
  syncEventDirectory = syncDirectory,
  childLockRecordPersistBarrier = async () => {},
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
  let deadlineAt = Number.NaN;
  let deadlineHandle;
  let cancellationReason = null;
  let terminationPromise = null;
  let outcomePromise = null;
  let actionMayHaveStarted = false;
  let durableRecoveryOrTerminal = false;
  let provenEventCount = 0;
  let latestEvidence = {
    moduleSha256: reviewedModule.moduleSha256,
    childResultSha256: null,
    evidenceDigest: null,
    stdoutSha256: null,
    stderrSha256: null,
  };
  let latestVerification = {};
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
    let childLockRecordBarrierUsed = false;
    const persistLockRecord = async () => {
      lockRecord.heartbeatAt = clock().toISOString();
      const bytes = Buffer.from(`${canonicalJson(lockRecord)}\n`, "utf8");
      await lockHandle.truncate(0);
      await lockHandle.write(bytes, 0, bytes.length, 0);
      if (lockRecord.childPid !== null && !childLockRecordBarrierUsed) {
        childLockRecordBarrierUsed = true;
        await childLockRecordPersistBarrier(Object.freeze({
          childPid: lockRecord.childPid,
          childStartIdentity: lockRecord.childStartIdentity,
          stageId: definition.stageId,
        }));
      }
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
      await appendJournalEvent(eventDir, existingEvents.length + 1, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: clock().toISOString(),
        receipt: recoveredReceipt,
      });
      durableRecoveryOrTerminal = true;
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

    const runningAt = clock();
    const initialDeadline = PRIMORDIAL_DATE_PARSE(authorization.deadlineAt);
    if (!Number.isFinite(initialDeadline)
      || initialDeadline <= PRIMORDIAL_DATE_GET_TIME(runningAt)) {
      return result(false, "STAGE_DEADLINE_INVALID", { taskId: definition.taskId, stageId: definition.stageId });
    }

    await appendJournalEvent(eventDir, 1, {
      schemaVersion: definition.schemaVersion,
      state: "running",
      occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(runningAt),
      processGroupId: null,
      sourceRevision: authorization.sourceRevision,
      stageBindingDigest: definitionValidation.stageBindingDigest,
      executorSha256: reviewedModule.moduleSha256,
    });
    provenEventCount = 1;
    const appendNoMutationTerminal = async ({ expired, occurredAt }) => {
      const terminalState = expired ? "expired-before-mutation" : "blocked-no-mutation";
      const terminalReceipt = closedReceipt({
        definition,
        authorization,
        state: terminalState,
        attempt: 1,
        evidence: { moduleSha256: reviewedModule.moduleSha256 },
      });
      const terminalValidation = validateStageReceipt(terminalReceipt, definition, authorization);
      if (!terminalValidation.ok) throw new Error(terminalValidation.code);
      await appendJournalEvent(eventDir, 2, {
        schemaVersion: definition.schemaVersion,
        state: terminalState,
        occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(occurredAt),
        receipt: terminalReceipt,
      });
      provenEventCount = 2;
      durableRecoveryOrTerminal = true;
      return result(false, expired ? "STAGE_EXPIRED_BEFORE_MUTATION" : "STAGE_BLOCKED_NO_MUTATION", {
        taskId: definition.taskId,
        stageId: definition.stageId,
        state: terminalState,
        receiptDigest: sha256(canonicalJson(terminalReceipt)),
      });
    };
    const bindingArgs = [
      `--p0-task-id=${definition.taskId}`,
      `--p0-stage-id=${definition.stageId}`,
      `--p0-idempotency-key=${definition.idempotencyKey}`,
      `--p0-source-revision=${authorization.sourceRevision}`,
      `--p0-stage-binding=${definitionValidation.stageBindingDigest}`,
    ];
    const resolvedLauncherPath = await realpath(launcherPath);
    const resolvedStageRoot = path.dirname(resolvedLauncherPath);

    // The durable running event is only intent. Re-fetch the predecessor and
    // exact-main Gate B after every awaited setup/journal operation, then take
    // the actual spawn time. No await or caller-controlled work is allowed
    // between this boundary and child creation.
    const predecessorStillCurrent = await predecessorReceiptExists(runtimeRoot, definition);
    let spawnAuthorization;
    try {
      spawnAuthorization = await authorize(request);
    } catch {
      spawnAuthorization = null;
    }
    const spawnAt = clock();
    const spawnAtMs = PRIMORDIAL_DATE_GET_TIME(spawnAt);
    const authorityDeadlines = [
      PRIMORDIAL_DATE_PARSE(authorization.deadlineAt),
      PRIMORDIAL_DATE_PARSE(spawnAuthorization?.deadlineAt ?? ""),
    ];
    const authorityExpired = authorityDeadlines.some((value) => Number.isFinite(value) && value <= spawnAtMs);
    const spawnAuthorizationValid = predecessorStillCurrent
      && validateAuthorization(spawnAuthorization, request, definition)
      && sameAuthorization(authorization, spawnAuthorization)
      && authorityDeadlines.every((value) => Number.isFinite(value) && value > spawnAtMs);
    deadlineAt = spawnAuthorizationValid
      ? Math.min(spawnAtMs + definition.deadlineMs, ...authorityDeadlines)
      : Number.NaN;
    if (!spawnAuthorizationValid || !Number.isFinite(deadlineAt) || deadlineAt <= spawnAtMs) {
      return await appendNoMutationTerminal({ expired: authorityExpired, occurredAt: spawnAt });
    }

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
    const requestCancellation = (reason) => {
      cancellationReason ??= reason;
      terminationPromise ??= terminateProcessTree(child);
    };
    // The child exists but the trusted launcher is still blocked on fd 4.
    // Observe settlement and arm cancellation before any await or identity/
    // lock-record work can consume the remaining authority window.
    outcomePromise = new Promise((resolve) => {
      child.once("error", () => resolve({ exitCode: null, signal: null, spawnFailed: true }));
      child.once("close", (exitCode, signal) => resolve({ exitCode, signal, spawnFailed: false }));
    });
    deadlineHandle = PRIMORDIAL_SET_TIMEOUT(
      () => requestCancellation("deadline-before-or-during-action"),
      Math.max(1, deadlineAt - PRIMORDIAL_DATE_NOW()),
    );
    const childStartIdentity = processStartIdentity(child.pid);
    if (childStartIdentity === null) {
      requestCancellation("child-identity-unavailable");
      retainLock = !await terminationPromise.catch(() => false);
      return result(false, "STAGE_CHILD_IDENTITY_UNAVAILABLE", {
        taskId: definition.taskId,
        stageId: definition.stageId,
      });
    }
    lockRecord.childPid = child.pid;
    lockRecord.childStartIdentity = childStartIdentity;
    lockRecord.childProcessGroupId = child.pid;
    await persistLockRecord();

    // LAUNCH_SIGNAL, not launcher creation, is the possible module-effect
    // boundary. Re-fetch every mutable authorization fact after the durable
    // child lock-record fsync, then allow no await before the first signal byte.
    const predecessorStillCurrentAtSignal = await predecessorReceiptExists(runtimeRoot, definition);
    let signalAuthorization;
    try {
      signalAuthorization = await authorize(request);
    } catch {
      signalAuthorization = null;
    }
    const signalAt = clock();
    const signalAtMs = PRIMORDIAL_DATE_GET_TIME(signalAt);
    const signalAuthorityDeadlines = [
      ...authorityDeadlines,
      PRIMORDIAL_DATE_PARSE(signalAuthorization?.deadlineAt ?? ""),
    ];
    const signalDeadlineAt = Math.min(deadlineAt, ...signalAuthorityDeadlines);
    const signalAuthorityExpired = cancellationReason !== null
      || signalAuthorityDeadlines.some((value) => Number.isFinite(value) && value <= signalAtMs)
      || deadlineAt <= signalAtMs;
    const launcherStillWaiting = child.exitCode === null && child.signalCode === null;
    const signalAuthorizationValid = cancellationReason === null
      && launcherStillWaiting
      && predecessorStillCurrentAtSignal
      && validateAuthorization(signalAuthorization, request, definition)
      && sameAuthorization(authorization, signalAuthorization)
      && sameAuthorization(spawnAuthorization, signalAuthorization)
      && signalAuthorityDeadlines.every((value) => Number.isFinite(value) && value > signalAtMs)
      && Number.isFinite(signalDeadlineAt)
      && signalDeadlineAt > signalAtMs;
    if (!signalAuthorizationValid) {
      requestCancellation(signalAuthorityExpired ? "expired-before-signal" : "blocked-before-signal");
      const launcherQuiescent = await terminationPromise.catch(() => false);
      if (!launcherQuiescent) {
        retainLock = true;
        try {
          const recoveryReceipt = closedReceipt({
            definition,
            authorization,
            state: "recovery-required",
            attempt: 1,
            evidence: latestEvidence,
          });
          await appendJournalEvent(eventDir, 2, {
            schemaVersion: definition.schemaVersion,
            state: "recovery-required",
            occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(signalAt),
            receipt: recoveryReceipt,
          });
          provenEventCount = 2;
          durableRecoveryOrTerminal = true;
        } catch {
          // Keep the lock pinned when neither launcher settlement nor durable
          // recovery can be proven.
        }
        return result(false, "STAGE_RECOVERY_REQUIRED", {
          taskId: definition.taskId,
          stageId: definition.stageId,
        });
      }
      return await appendNoMutationTerminal({
        expired: signalAuthorityExpired,
        occurredAt: signalAt,
      });
    }

    deadlineAt = signalDeadlineAt;
    PRIMORDIAL_CLEAR_TIMEOUT(deadlineHandle);
    deadlineHandle = PRIMORDIAL_SET_TIMEOUT(
      () => requestCancellation("deadline-during-action"),
      Math.max(1, deadlineAt - PRIMORDIAL_DATE_NOW()),
    );
    // Set this before .end(): signal bytes may escape even if .end() throws.
    actionMayHaveStarted = true;
    child.stdio[4].end(LAUNCH_SIGNAL);

    const outcome = await outcomePromise;
    PRIMORDIAL_CLEAR_TIMEOUT(deadlineHandle);
    deadlineHandle = undefined;
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
    latestEvidence = {
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
        evidence: latestEvidence,
      });
      await appendJournalEvent(eventDir, 2, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
        receipt: failedReceipt,
      });
      provenEventCount = 2;
      durableRecoveryOrTerminal = true;
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
      evidence: latestEvidence,
    });
    const pendingReceiptSha256 = sha256(canonicalJson(pendingReceipt));
    await appendJournalEvent(eventDir, 2, {
      schemaVersion: definition.schemaVersion,
      state: "verification-pending",
      occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
      receipt: pendingReceipt,
    });
    provenEventCount = 2;
    lockRecord.pendingReceiptSha256 = pendingReceiptSha256;
    await persistLockRecord();

    const authorizationStillValid = async () => {
      let preNowMs;
      try {
        preNowMs = PRIMORDIAL_DATE_GET_TIME(clock());
      } catch {
        return false;
      }
      if (!Number.isFinite(preNowMs) || preNowMs >= deadlineAt) return false;
      let refreshed;
      try {
        refreshed = await authorize(request);
      } catch {
        return false;
      }
      let postNowMs;
      try {
        postNowMs = PRIMORDIAL_DATE_GET_TIME(clock());
      } catch {
        return false;
      }
      return validateAuthorization(refreshed, request, definition)
        && sameAuthorization(authorization, refreshed)
        && Number.isFinite(postNowMs)
        && postNowMs < deadlineAt
        && PRIMORDIAL_DATE_PARSE(refreshed.deadlineAt) > postNowMs;
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
          moduleSha256: latestEvidence.moduleSha256,
          childResultSha256: latestEvidence.childResultSha256,
          evidenceDigest: latestEvidence.evidenceDigest,
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
        moduleSha256: latestEvidence.moduleSha256,
        childResultSha256: latestEvidence.childResultSha256,
        evidenceDigest: latestEvidence.evidenceDigest,
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
    latestVerification = verificationDigests;
    const verifiedEvidence = { ...latestEvidence, ...verificationDigests };
    if (!postActionAuthorized) {
      const recoveryReceipt = closedReceipt({
        definition,
        authorization,
        state: "recovery-required",
        attempt: 1,
        evidence: verifiedEvidence,
      });
      await appendJournalEvent(eventDir, 3, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
        receipt: recoveryReceipt,
      });
      provenEventCount = 3;
      durableRecoveryOrTerminal = true;
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
    await appendJournalEvent(eventDir, 3, {
      schemaVersion: definition.schemaVersion,
      state: "verified-complete",
      occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
      receipt: completedReceipt,
      pendingReceiptSha256,
    });
    provenEventCount = 3;
    durableRecoveryOrTerminal = true;
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
    if (actionMayHaveStarted && !durableRecoveryOrTerminal) {
      try {
        const events = await readEvents(eventDir);
        if (events.length < provenEventCount || events.length > provenEventCount + 1) {
          throw new Error("post-action journal event count is not provable");
        }
        let provenTail = events.at(-1);
        if (events.length === provenEventCount + 1) {
          // A later recovery event must never depend on a merely readable,
          // fsync-uncertain predecessor created by the failed append.
          provenTail = await proveReadableEventTailDurable({
            eventDir,
            events,
            syncEventFile,
            syncEventDirectory,
          });
          provenEventCount = events.length;
        }
        const alreadyWritten = provenTail?.state === "recovery-required"
          || TERMINAL_STAGE_STATES.includes(provenTail?.state);
        if (!alreadyWritten) {
          const recoveryReceipt = closedReceipt({
            definition,
            authorization,
            state: "recovery-required",
            attempt: 1,
            evidence: { ...latestEvidence, ...latestVerification },
          });
          await appendJournalEvent(eventDir, events.length + 1, {
            schemaVersion: definition.schemaVersion,
            state: "recovery-required",
            occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
            receipt: recoveryReceipt,
          });
          provenEventCount = events.length + 1;
        }
        durableRecoveryOrTerminal = true;
      } catch {
        // A possible child effect without a proven durable recovery/terminal
        // tail remains fail-stuck for reviewed recovery.
        retainLock = true;
      }
      return result(false, "STAGE_RECOVERY_REQUIRED", {
        taskId: definition.taskId,
        stageId: definition.stageId,
      });
    }
    return result(false, "STAGE_RUNNER_FAILED", { taskId: definition.taskId, stageId: definition.stageId });
  } finally {
    if (deadlineHandle !== undefined) {
      PRIMORDIAL_CLEAR_TIMEOUT(deadlineHandle);
      deadlineHandle = undefined;
    }
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

async function executeResolvedCallbackStage({
  definition,
  moduleEntry,
  execute,
  repoRoot,
  runtimeRoot,
  authorize = verifyStageGateBAtExactMain,
  verifyOutcome = verifyReviewedStageOutcome,
  clock = primordialClock,
  quiescenceIntervalMs = QUIESCENCE_INTERVAL_MS,
  appendJournalEvent = appendEvent,
  syncEventFile = syncRegularFile,
  syncEventDirectory = syncDirectory,
  installStreamCapture = installCallbackStreamCapture,
}) {
  const definitionValidation = validateStagedActionDefinition(definition);
  if (!definitionValidation.ok) return result(false, definitionValidation.code);
  if (typeof execute !== "function") return result(false, "STAGE_CALLBACK_REQUIRED");
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
  const callbackLockPath = path.join(lockDir, "in-process-callback-global.lock");
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

  let ownerNonce = null;
  let retainLock = false;
  let callbackLockHandle = null;
  let callbackLockOwnerNonce = null;
  let retainCallbackLock = false;
  let finishStreamCapture = null;
  let actionStartDurable = false;
  let durableRecoveryOrTerminal = false;
  let provenEventCount = 0;
  let latestEvidence = {
    moduleSha256: reviewedModule.moduleSha256,
    childResultSha256: null,
    evidenceDigest: null,
    stdoutSha256: null,
    stderrSha256: null,
  };
  let latestVerification = {};
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
      heartbeatAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
    };
    const persistLockRecord = async () => {
      lockRecord.heartbeatAt = PRIMORDIAL_DATE_TO_ISO_STRING(clock());
      const bytes = Buffer.from(`${canonicalJson(lockRecord)}\n`, "utf8");
      await lockHandle.truncate(0);
      await lockHandle.write(bytes, 0, bytes.length, 0);
      await lockHandle.sync();
    };
    await persistLockRecord();

    const existingEvents = await readEvents(eventDir);
    const existingTerminal = terminalEvent(existingEvents);
    if (existingTerminal) {
      const receiptValidation = validateHistoricalStageReceipt(
        existingTerminal.receipt,
        historicalBindingFromAuthorization(authorization),
      );
      if (!receiptValidation.ok) {
        return result(false, "STAGE_RECEIPT_INVALID", { taskId: definition.taskId, stageId: definition.stageId });
      }
      return terminalPublicResult(existingTerminal.receipt);
    }
    if (existingEvents.length > 0) {
      const recoveredReceipt = closedReceipt({
        definition,
        authorization,
        state: "recovery-required",
        attempt: 1,
      });
      await appendJournalEvent(eventDir, existingEvents.length + 1, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
        receipt: recoveredReceipt,
      });
      durableRecoveryOrTerminal = true;
      return publicOperatorResult({
        ok: false,
        code: "STAGE_RECOVERY_REQUIRED",
        definition,
        authorization,
        state: "recovery-required",
        receiptDigest: sha256(canonicalJson(recoveredReceipt)),
        attempt: 1,
        authorityStatus: "not-rechecked",
        mutationStatement: "Mutation may have occurred",
        immediateVerification: "not-run",
        quiescentVerification: "not-run",
        consequence: "Stage state requires reviewed recovery before replay.",
        nextAction: "Perform reviewed recovery or rollback.",
      });
    }

    let lockedAuthorization;
    try {
      lockedAuthorization = await authorize(request);
    } catch {
      lockedAuthorization = null;
    }
    const lockedNow = clock();
    const lockedNowMs = PRIMORDIAL_DATE_GET_TIME(lockedNow);
    if (!validateAuthorization(lockedAuthorization, request, definition)
      || !sameAuthorization(authorization, lockedAuthorization)
      || PRIMORDIAL_DATE_PARSE(authorization.deadlineAt) <= lockedNowMs
      || PRIMORDIAL_DATE_PARSE(lockedAuthorization.deadlineAt) <= lockedNowMs
      || !await predecessorReceiptExists(runtimeRoot, definition)) {
      return result(false, "STAGE_GATE_B_DENIED", { taskId: definition.taskId, stageId: definition.stageId });
    }

    callbackLockHandle = await acquireOwnedLock(callbackLockPath, {});
    if (!callbackLockHandle) {
      return result(false, "STAGE_CALLBACK_LOCK_UNAVAILABLE", {
        taskId: definition.taskId,
        stageId: definition.stageId,
      });
    }
    await syncDirectory(lockDir);
    callbackLockOwnerNonce = crypto.randomBytes(32).toString("hex");
    const callbackLockRecord = {
      schemaVersion: definition.schemaVersion,
      runtimeKey: "in-process-callback-global",
      taskId: definition.taskId,
      stageId: definition.stageId,
      sourceRevision: authorization.sourceRevision,
      stageBindingDigest: definitionValidation.stageBindingDigest,
      ownerNonce: callbackLockOwnerNonce,
      supervisorPid: process.pid,
      supervisorStartIdentity,
      childPid: null,
      childStartIdentity: null,
      childProcessGroupId: null,
      pendingReceiptSha256: null,
      heartbeatAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
    };
    const callbackLockBytes = PRIMORDIAL_BUFFER_FROM(`${canonicalJson(callbackLockRecord)}\n`, "utf8");
    await callbackLockHandle.write(callbackLockBytes, 0, callbackLockBytes.length, 0);
    await callbackLockHandle.sync();
    finishStreamCapture = installStreamCapture();

    await appendJournalEvent(eventDir, 1, {
      schemaVersion: definition.schemaVersion,
      state: "running",
      occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
      processGroupId: null,
      actionKind: "in-process-reviewed-callback",
      actionStartAuthorized: true,
      sourceRevision: authorization.sourceRevision,
      stageBindingDigest: definitionValidation.stageBindingDigest,
      executorSha256: reviewedModule.moduleSha256,
    });
    provenEventCount = 1;
    actionStartDurable = true;

    // Durable running is only an intent marker. Fetch and evaluate Gate B once
    // more after every lock/fsync/journal delay, then take the actual action
    // start time. No await or caller-controlled operation occurs between this
    // boundary and invocation of the exact reviewed function.
    const predecessorStillCurrent = await predecessorReceiptExists(runtimeRoot, definition);
    let invocationAuthorization;
    try {
      invocationAuthorization = await authorize(request);
    } catch {
      invocationAuthorization = null;
    }
    const callbackStart = clock();
    const callbackStartMs = PRIMORDIAL_DATE_GET_TIME(callbackStart);
    const authorityDeadlines = [
      PRIMORDIAL_DATE_PARSE(authorization.deadlineAt),
      PRIMORDIAL_DATE_PARSE(lockedAuthorization.deadlineAt),
      PRIMORDIAL_DATE_PARSE(invocationAuthorization?.deadlineAt ?? ""),
    ];
    const authorityExpired = authorityDeadlines.some((value) => Number.isFinite(value) && value <= callbackStartMs);
    const invocationAuthorizationValid = predecessorStillCurrent
      && validateAuthorization(invocationAuthorization, request, definition)
      && sameAuthorization(authorization, invocationAuthorization)
      && authorityDeadlines.every((value) => Number.isFinite(value) && value > callbackStartMs);
    const deadlineAt = invocationAuthorizationValid
      ? Math.min(
        callbackStartMs + Math.min(definition.deadlineMs, MAX_CALLBACK_DEADLINE_MS),
        ...authorityDeadlines,
      )
      : Number.NaN;
    if (!invocationAuthorizationValid || !Number.isFinite(deadlineAt) || deadlineAt <= callbackStartMs) {
      const terminalState = authorityExpired ? "expired-before-mutation" : "blocked-no-mutation";
      const terminalReceipt = closedReceipt({
        definition,
        authorization,
        state: terminalState,
        attempt: 1,
        evidence: { moduleSha256: reviewedModule.moduleSha256 },
      });
      const terminalValidation = validateStageReceipt(terminalReceipt, definition, authorization);
      if (!terminalValidation.ok) throw new Error(terminalValidation.code);
      await appendJournalEvent(eventDir, 2, {
        schemaVersion: definition.schemaVersion,
        state: terminalState,
        occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(callbackStart),
        receipt: terminalReceipt,
      });
      provenEventCount = 2;
      durableRecoveryOrTerminal = true;
      return result(false, authorityExpired ? "STAGE_EXPIRED_BEFORE_MUTATION" : "STAGE_BLOCKED_NO_MUTATION", {
        taskId: definition.taskId,
        stageId: definition.stageId,
        state: terminalState,
        receiptDigest: sha256(canonicalJson(terminalReceipt)),
      });
    }

    const callbackContext = frozenCallbackContext({ definition, authorization, deadlineAt });
    const callbackStartedAt = PRIMORDIAL_HRTIME_BIGINT();
    const callbackDeadlineNanoseconds = BigInt(Math.max(1, deadlineAt - callbackStartMs)) * 1_000_000n;
    let deadlineReached = false;
    let deadlineHandle;
    const deadlinePromise = new Promise((resolve) => {
      deadlineHandle = PRIMORDIAL_SET_TIMEOUT(() => {
        deadlineReached = true;
        callbackContext.controller.abort("callback-deadline-exceeded");
        resolve(PRIMORDIAL_OBJECT_FREEZE({ status: "deadline", value: null }));
      }, Math.max(1, deadlineAt - callbackStartMs));
    });
    let actionValue;
    let actionThrew = false;
    try {
      actionValue = execute(callbackContext.value);
    } catch {
      actionThrew = true;
    }
    const actionPromise = actionThrew
      ? Promise.resolve(PRIMORDIAL_OBJECT_FREEZE({ status: "rejected", value: null }))
      : Promise.resolve(actionValue).then(
        (value) => PRIMORDIAL_OBJECT_FREEZE({ status: "fulfilled", value }),
        () => PRIMORDIAL_OBJECT_FREEZE({ status: "rejected", value: null }),
      );
    let firstOutcome;
    let settledOutcome;
    let callbackDeadlineExceeded;
    let streamObservation;
    try {
      firstOutcome = await Promise.race([actionPromise, deadlinePromise]);
      PRIMORDIAL_CLEAR_TIMEOUT(deadlineHandle);
      const callbackElapsedNanoseconds = PRIMORDIAL_HRTIME_BIGINT() - callbackStartedAt;
      callbackDeadlineExceeded = deadlineReached
        || firstOutcome.status === "deadline"
        || callbackElapsedNanoseconds >= callbackDeadlineNanoseconds
        || PRIMORDIAL_DATE_GET_TIME(clock()) >= deadlineAt;
      if (callbackDeadlineExceeded && !callbackContext.value.signal.aborted) {
        callbackContext.controller.abort("callback-deadline-exceeded");
      }
      // An in-process callback cannot be terminated safely. If the deadline
      // wins, await the original Promise while retaining both locks and stream
      // interception. Non-settlement therefore remains durably fail-stuck.
      settledOutcome = firstOutcome.status === "deadline" ? await actionPromise : firstOutcome;
    } finally {
      if (deadlineHandle !== undefined) PRIMORDIAL_CLEAR_TIMEOUT(deadlineHandle);
      if (finishStreamCapture !== null) {
        const finish = finishStreamCapture;
        finishStreamCapture = null;
        try {
          streamObservation = finish();
          if (streamObservation.streamsRestored !== true) retainCallbackLock = true;
        } catch (error) {
          retainCallbackLock = true;
          throw error;
        }
      }
      if (callbackLockHandle !== null && callbackLockOwnerNonce !== null) {
        if (!retainCallbackLock
          && !await releaseOwnedLock(callbackLockHandle, callbackLockPath, callbackLockOwnerNonce)) {
          retainCallbackLock = true;
        }
        await callbackLockHandle.close().catch(() => {});
        callbackLockHandle = null;
      }
    }
    const callbackCompletion = settledOutcome.status === "fulfilled"
      ? validateCallbackCompletion(settledOutcome.value, {
        ...request,
        sourceRevision: authorization.sourceRevision,
        candidateRevision: authorization.candidateRevision,
        stageBindingDigest: definitionValidation.stageBindingDigest,
      })
      : null;
    latestEvidence = {
      moduleSha256: reviewedModule.moduleSha256,
      childResultSha256: callbackCompletion?.digest ?? null,
      evidenceDigest: callbackCompletion?.value.evidenceDigest ?? null,
      stdoutSha256: streamObservation?.stdoutSha256 ?? null,
      stderrSha256: streamObservation?.stderrSha256 ?? null,
    };
    const appendRecovery = async ({ code, sequence, evidenceValue = latestEvidence, verification = {} }) => {
      const receipt = closedReceipt({
        definition,
        authorization,
        state: "recovery-required",
        attempt: 1,
        evidence: { ...evidenceValue, ...verification },
      });
      await appendJournalEvent(eventDir, sequence, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
        receipt,
      });
      provenEventCount = sequence;
      durableRecoveryOrTerminal = true;
      return publicOperatorResult({
        ok: false,
        code,
        definition,
        authorization,
        state: "recovery-required",
        receiptDigest: sha256(canonicalJson(receipt)),
        attempt: 1,
        authorityStatus: "not-rechecked",
        mutationStatement: "Mutation may have occurred",
        immediateVerification: verification.immediateVerificationResult === "pass" ? "pass" : "not-run",
        quiescentVerification: verification.quiescent1VerificationResult === "pass"
          && verification.quiescent2VerificationResult === "pass" ? "pass" : "not-run",
        consequence: "Stage state requires reviewed recovery before replay.",
        nextAction: "Perform reviewed recovery or rollback.",
      });
    };
    if (streamObservation === undefined
      || streamObservation.streamsRestored !== true
      || retainCallbackLock) {
      callbackContext.controller.abort("callback-stream-containment-failed");
      return await appendRecovery({ code: "STAGE_CALLBACK_CONTAINMENT_FAILED", sequence: 2 });
    }
    if (streamObservation.rawStreamAttempted || streamObservation.streamBindingTampered) {
      callbackContext.controller.abort("callback-raw-stream-rejected");
      return await appendRecovery({ code: "STAGE_CALLBACK_RAW_STREAM_REJECTED", sequence: 2 });
    }
    if (callbackDeadlineExceeded) {
      return await appendRecovery({ code: "STAGE_CALLBACK_DEADLINE_EXCEEDED", sequence: 2 });
    }
    if (settledOutcome.status !== "fulfilled") {
      callbackContext.controller.abort("callback-failed");
      return await appendRecovery({ code: "STAGE_CALLBACK_FAILED", sequence: 2 });
    }
    if (callbackCompletion === null) {
      callbackContext.controller.abort("callback-receipt-rejected");
      return await appendRecovery({ code: "STAGE_CALLBACK_RECEIPT_REJECTED", sequence: 2 });
    }

    const authorizationStillValid = async () => {
      let preNowMs;
      try {
        preNowMs = PRIMORDIAL_DATE_GET_TIME(clock());
      } catch {
        return false;
      }
      if (!Number.isFinite(preNowMs) || preNowMs >= deadlineAt) return false;
      let refreshed;
      try {
        refreshed = await authorize(request);
      } catch {
        return false;
      }
      let postNowMs;
      try {
        postNowMs = PRIMORDIAL_DATE_GET_TIME(clock());
      } catch {
        return false;
      }
      return validateAuthorization(refreshed, request, definition)
        && sameAuthorization(authorization, refreshed)
        && Number.isFinite(postNowMs)
        && postNowMs < deadlineAt
        && PRIMORDIAL_DATE_PARSE(refreshed.deadlineAt) > postNowMs;
    };
    if (!await authorizationStillValid()) {
      callbackContext.controller.abort("callback-authority-invalidated");
      return await appendRecovery({ code: "STAGE_POST_ACTION_VERIFICATION_INVALID", sequence: 2 });
    }

    const pendingReceipt = closedReceipt({
      definition,
      authorization,
      state: "verification-pending",
      attempt: 1,
      evidence: latestEvidence,
    });
    const pendingReceiptSha256 = sha256(canonicalJson(pendingReceipt));
    await appendJournalEvent(eventDir, 2, {
      schemaVersion: definition.schemaVersion,
      state: "verification-pending",
      occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
      receipt: pendingReceipt,
    });
    provenEventCount = 2;
    lockRecord.pendingReceiptSha256 = pendingReceiptSha256;
    await persistLockRecord();

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
        supplied = await verifyOutcome(PRIMORDIAL_OBJECT_FREEZE({
          schemaVersion: definition.schemaVersion,
          boundary,
          moduleId: definition.moduleId,
          taskId: definition.taskId,
          stageId: definition.stageId,
          sourceRevision: authorization.sourceRevision,
          stageBindingDigest: definitionValidation.stageBindingDigest,
          moduleSha256: latestEvidence.moduleSha256,
          childResultSha256: latestEvidence.childResultSha256,
          evidenceDigest: latestEvidence.evidenceDigest,
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
        moduleSha256: latestEvidence.moduleSha256,
        childResultSha256: latestEvidence.childResultSha256,
        evidenceDigest: latestEvidence.evidenceDigest,
      });
      if (verified === null || !await authorizationStillValid()) return false;
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
    // This is intentionally a separate fresh exact-main/Gate B evaluation at
    // the final success boundary rather than relying on the verifier's check.
    if (postActionAuthorized) postActionAuthorized = await authorizationStillValid();
    if (!postActionAuthorized) {
      callbackContext.controller.abort("callback-authority-invalidated");
      latestVerification = verificationDigests;
      return await appendRecovery({
        code: "STAGE_POST_ACTION_VERIFICATION_INVALID",
        sequence: 3,
        verification: verificationDigests,
      });
    }

    const completedReceipt = closedReceipt({
      definition,
      authorization,
      state: "verified-complete",
      attempt: 1,
      evidence: { ...latestEvidence, ...verificationDigests },
    });
    const completedValidation = validateStageReceipt(completedReceipt, definition, authorization);
    if (!completedValidation.ok) throw new Error(completedValidation.code);
    await appendJournalEvent(eventDir, 3, {
      schemaVersion: definition.schemaVersion,
      state: "verified-complete",
      occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
      receipt: completedReceipt,
      pendingReceiptSha256,
    });
    provenEventCount = 3;
    durableRecoveryOrTerminal = true;
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
    if (actionStartDurable && !durableRecoveryOrTerminal) {
      try {
        const events = await readEvents(eventDir);
        if (events.length < provenEventCount || events.length > provenEventCount + 1) {
          throw new Error("post-action journal event count is not provable");
        }
        let provenTail = events.at(-1);
        if (events.length === provenEventCount + 1) {
          // Any newly readable tail—not only a recovery/terminal tail—must be
          // independently proven before a later recovery event may depend on it.
          provenTail = await proveReadableEventTailDurable({
            eventDir,
            events,
            syncEventFile,
            syncEventDirectory,
          });
          provenEventCount = events.length;
        }
        const alreadyWritten = provenTail?.state === "recovery-required"
          || TERMINAL_STAGE_STATES.includes(provenTail?.state);
        if (!alreadyWritten) {
          const recoveryReceipt = closedReceipt({
            definition,
            authorization,
            state: "recovery-required",
            attempt: 1,
            evidence: { ...latestEvidence, ...latestVerification },
          });
          await appendJournalEvent(eventDir, events.length + 1, {
            schemaVersion: definition.schemaVersion,
            state: "recovery-required",
            occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
            receipt: recoveryReceipt,
          });
          provenEventCount = events.length + 1;
        }
        durableRecoveryOrTerminal = true;
      } catch {
        // A possible effect without a durable recovery/terminal event must not
        // release the stage lock. Reviewed recovery owns this fail-stuck state.
        retainLock = true;
      }
      return result(false, "STAGE_RECOVERY_REQUIRED", {
        taskId: definition.taskId,
        stageId: definition.stageId,
      });
    }
    return result(false, "STAGE_RUNNER_FAILED", { taskId: definition.taskId, stageId: definition.stageId });
  } finally {
    if (finishStreamCapture !== null) {
      try {
        const finish = finishStreamCapture;
        finishStreamCapture = null;
        const finalObservation = finish();
        if (finalObservation.streamsRestored !== true) {
          retainCallbackLock = true;
          if (actionStartDurable && !durableRecoveryOrTerminal) retainLock = true;
        }
      } catch {
        retainCallbackLock = true;
        if (actionStartDurable && !durableRecoveryOrTerminal) retainLock = true;
      }
    }
    if (callbackLockHandle !== null) {
      if (!retainCallbackLock && callbackLockOwnerNonce !== null) {
        if (!await releaseOwnedLock(callbackLockHandle, callbackLockPath, callbackLockOwnerNonce)) {
          retainCallbackLock = true;
        }
      } else if (!retainCallbackLock && callbackLockOwnerNonce === null) {
        if (!await releaseOwnedEmptyLock(callbackLockHandle, callbackLockPath)) retainCallbackLock = true;
      }
      await callbackLockHandle.close().catch(() => {});
    }
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
 * Bounded in-process production surface. The caller must supply the exact
 * code-owned reviewed function for the complete short action; an arbitrary or
 * module-mismatched closure is rejected. Git facts, Gate B evaluation,
 * immutable stage resolution, module/evidence bindings, clock, deadline, lock,
 * journal, receipt, and verification policy remain internal and non-injectable.
 */
export async function executeStageFromExactMain(request = {}) {
  // Capture exact own data-descriptor values synchronously. The caller may
  // mutate its object as soon as this async function first yields; no property
  // on `request` is read again after this point.
  const capturedRequest = captureCallbackProductionRequest(request);
  if (capturedRequest === null) return result(false, "STAGE_CALLBACK_REQUEST_SHAPE_INVALID");
  const { identity, execute } = capturedRequest;
  const repoRoot = DEFAULT_REPO_ROOT;
  const runtimeRoot = await defaultRuntimeRoot(repoRoot);
  const reconciled = await reconcileTerminalStage({ request: identity, runtimeRoot });
  if (reconciled !== null) return reconciled;
  const definition = resolveProductionStagedAction(identity);
  if (!definition
    || definition.scopeClass !== identity.scopeClass
    || definition.actionClass !== identity.actionClass
    || (definition.predecessor?.receiptDigest ?? null) !== identity.predecessorReceiptSha256) {
    return result(false, "STAGE_ACTION_NOT_REVIEWED", { taskId: identity.taskId, stageId: identity.stageId });
  }
  const moduleEntry = PRODUCTION_MODULE_ALLOWLIST[definition.moduleId];
  if (!moduleEntry) {
    return result(false, "STAGE_MODULE_NOT_ALLOWLISTED", { taskId: identity.taskId, stageId: identity.stageId });
  }
  const callbackEntry = PRODUCTION_CALLBACK_ALLOWLIST[definition.moduleId];
  if (!reviewedCallbackMatches(callbackEntry, moduleEntry, execute)) {
    return result(false, "STAGE_CALLBACK_NOT_ALLOWLISTED", {
      taskId: identity.taskId,
      stageId: identity.stageId,
    });
  }
  return executeResolvedCallbackStage({
    definition,
    moduleEntry,
    execute,
    repoRoot,
    runtimeRoot,
    authorize: verifyStageGateBAtExactMain,
    verifyOutcome: verifyReviewedStageOutcome,
  });
}

/**
 * Serializable production surface. The caller supplies only the immutable
 * stage identity and binding. Module, arguments, cwd, environment, output
 * custody, process model, clock, Git facts, evaluator, and callback are not
 * injectable.
 */
export async function runSerializableStageFromExactMain(request = {}) {
  // Capture the closed identity from own data descriptors before this async
  // function can yield. Caller mutation/accessors can never influence a later
  // reconciliation, definition lookup, or execution boundary.
  const identity = captureSerializableProductionRequest(request);
  if (identity === null) return result(false, "STAGE_REQUEST_SHAPE_INVALID");
  const repoRoot = DEFAULT_REPO_ROOT;
  const runtimeRoot = await defaultRuntimeRoot(repoRoot);
  const reconciled = await reconcileTerminalStage({ request: identity, runtimeRoot });
  if (reconciled !== null) return reconciled;
  const definition = resolveProductionStagedAction(identity);
  if (!definition
    || definition.scopeClass !== identity.scopeClass
    || definition.actionClass !== identity.actionClass
    || (definition.predecessor?.receiptDigest ?? null) !== identity.predecessorReceiptSha256) {
    return result(false, "STAGE_ACTION_NOT_REVIEWED", { taskId: identity.taskId, stageId: identity.stageId });
  }
  const moduleEntry = PRODUCTION_MODULE_ALLOWLIST[definition.moduleId];
  if (!moduleEntry) return result(false, "STAGE_MODULE_NOT_ALLOWLISTED", { taskId: identity.taskId, stageId: identity.stageId });

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
        runtimeRoot: overrides.runtimeRoot ?? runtimeRoot,
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
        spawnProcess: overrides.spawnProcess ?? spawn,
        appendJournalEvent: overrides.appendJournalEvent ?? appendEvent,
        syncEventFile: overrides.syncEventFile ?? syncRegularFile,
        syncEventDirectory: overrides.syncEventDirectory ?? syncDirectory,
        childLockRecordPersistBarrier: overrides.childLockRecordPersistBarrier ?? (async () => {}),
      });
    };
    const callbackCompletionFor = (definition, context, overrides = {}) => ({
      schemaVersion: definition.schemaVersion,
      outcome: "succeeded",
      taskId: context.taskId,
      scopeClass: context.scopeClass,
      actionClass: context.actionClass,
      stageId: context.stageId,
      predecessorReceiptSha256: context.predecessorReceiptSha256,
      idempotencyKey: context.idempotencyKey,
      sourceRevision: context.revision,
      candidateRevision: context.candidateRevision,
      stageBindingDigest: stageBindingDigest(definition),
      evidenceDigest: `sha256:${"9".repeat(64)}`,
      ...overrides,
    });
    const executeCallbackFixture = async (definition, moduleEntry, execute, overrides = {}) => {
      const authorization = overrides.authorization ?? authorizationFor(definition, {
        moduleSha256: moduleEntry.moduleSha256,
      });
      return executeResolvedCallbackStage({
        definition,
        moduleEntry,
        execute,
        repoRoot,
        runtimeRoot: overrides.runtimeRoot ?? runtimeRoot,
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
          observationDigest: sha256(`synthetic callback observation:${request.boundary}`),
        })),
        quiescenceIntervalMs: overrides.quiescenceIntervalMs ?? 5,
        clock: overrides.clock ?? primordialClock,
        appendJournalEvent: overrides.appendJournalEvent ?? appendEvent,
        syncEventFile: overrides.syncEventFile ?? syncRegularFile,
        syncEventDirectory: overrides.syncEventDirectory ?? syncDirectory,
        installStreamCapture: overrides.installStreamCapture ?? installCallbackStreamCapture,
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
    if (authorizationCalls !== 10) throw new Error("post-action authorization count case failed");
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

    const preSpawnExpiryDefinition = definitionFor({ suffix: "PRESPAWN-DELAYED-EXPIRY" });
    const preSpawnExpiryEntry = await entryFor(preSpawnExpiryDefinition, successName);
    let preSpawnNowMs = Date.now();
    const preSpawnExpiryAuthorization = authorizationFor(preSpawnExpiryDefinition, {
      moduleSha256: preSpawnExpiryEntry.moduleSha256,
      deadlineAt: new Date(preSpawnNowMs + 1_000).toISOString(),
    });
    let expiredSpawnCount = 0;
    const delayedRunningJournal = async (directory, sequence, event) => {
      const eventPath = await appendEvent(directory, sequence, event);
      if (sequence === 1 && event.state === "running") preSpawnNowMs += 2_000;
      return eventPath;
    };
    const preSpawnExpired = await executeFixture(preSpawnExpiryDefinition, preSpawnExpiryEntry, {
      authorization: preSpawnExpiryAuthorization,
      clock: () => new Date(preSpawnNowMs),
      appendJournalEvent: delayedRunningJournal,
      spawnProcess: (...args) => {
        expiredSpawnCount += 1;
        return spawn(...args);
      },
    });
    const preSpawnExpiryKey = safeRuntimeSegment(`${preSpawnExpiryDefinition.taskId}\0${preSpawnExpiryDefinition.stageId}\0${preSpawnExpiryDefinition.idempotencyKey}`);
    const preSpawnExpiryEvents = await readEvents(path.join(runtimeRoot, preSpawnExpiryKey, "events"));
    if (preSpawnExpired.code !== "STAGE_EXPIRED_BEFORE_MUTATION"
      || expiredSpawnCount !== 0
      || preSpawnExpiryEvents.map((event) => event.state).join(",") !== "running,expired-before-mutation") {
      throw new Error("serializable delayed pre-spawn expiry zero-child case failed");
    }
    cases += 1;

    const preSpawnDriftDefinition = definitionFor({ suffix: "PRESPAWN-AUTHORITY-DRIFT" });
    const preSpawnDriftEntry = await entryFor(preSpawnDriftDefinition, successName);
    const preSpawnStableAuthorization = authorizationFor(preSpawnDriftDefinition, {
      moduleSha256: preSpawnDriftEntry.moduleSha256,
    });
    let preSpawnAuthorizationCalls = 0;
    let driftSpawnCount = 0;
    let runningJournalPersisted = false;
    const driftAfterRunningJournal = async (directory, sequence, event) => {
      const eventPath = await appendEvent(directory, sequence, event);
      if (sequence === 1 && event.state === "running") runningJournalPersisted = true;
      return eventPath;
    };
    const preSpawnDrift = await executeFixture(preSpawnDriftDefinition, preSpawnDriftEntry, {
      authorize: async () => {
        preSpawnAuthorizationCalls += 1;
        return !runningJournalPersisted
          ? preSpawnStableAuthorization
          : { ...preSpawnStableAuthorization, stageApprovalSha256: "0".repeat(64) };
      },
      appendJournalEvent: driftAfterRunningJournal,
      spawnProcess: (...args) => {
        driftSpawnCount += 1;
        return spawn(...args);
      },
    });
    const preSpawnDriftKey = safeRuntimeSegment(`${preSpawnDriftDefinition.taskId}\0${preSpawnDriftDefinition.stageId}\0${preSpawnDriftDefinition.idempotencyKey}`);
    const preSpawnDriftEvents = await readEvents(path.join(runtimeRoot, preSpawnDriftKey, "events"));
    if (preSpawnDrift.code !== "STAGE_BLOCKED_NO_MUTATION"
      || preSpawnAuthorizationCalls !== 2
      || !runningJournalPersisted
      || driftSpawnCount !== 0
      || preSpawnDriftEvents.map((event) => event.state).join(",") !== "running,blocked-no-mutation") {
      throw new Error("serializable pre-spawn authority drift zero-child case failed");
    }
    cases += 1;

    const preSignalDriftDefinition = definitionFor({ suffix: "PRESIGNAL-AUTHORITY-DRIFT" });
    const preSignalDriftEntry = await entryFor(preSignalDriftDefinition, successName);
    const preSignalDriftRuntimeRoot = path.join(root, "pre-signal-authority-drift-runtime");
    const preSignalStableAuthorization = authorizationFor(preSignalDriftDefinition, {
      moduleSha256: preSignalDriftEntry.moduleSha256,
    });
    let preSignalBarrierReached = false;
    let preSignalAuthorizationCalls = 0;
    let preSignalSpawnCount = 0;
    let preSignalChild = null;
    const preSignalDrift = await executeFixture(preSignalDriftDefinition, preSignalDriftEntry, {
      runtimeRoot: preSignalDriftRuntimeRoot,
      authorize: async () => {
        preSignalAuthorizationCalls += 1;
        return preSignalBarrierReached
          ? { ...preSignalStableAuthorization, stageApprovalSha256: "0".repeat(64) }
          : preSignalStableAuthorization;
      },
      childLockRecordPersistBarrier: async () => {
        preSignalBarrierReached = true;
        await Promise.resolve();
      },
      spawnProcess: (...args) => {
        preSignalSpawnCount += 1;
        preSignalChild = spawn(...args);
        return preSignalChild;
      },
    });
    const preSignalDriftKey = safeRuntimeSegment(`${preSignalDriftDefinition.taskId}\0${preSignalDriftDefinition.stageId}\0${preSignalDriftDefinition.idempotencyKey}`);
    const preSignalDriftEvents = await readEvents(path.join(preSignalDriftRuntimeRoot, preSignalDriftKey, "events"));
    const preSignalChildResultBytes = await readFile(path.join(
      preSignalDriftRuntimeRoot,
      preSignalDriftKey,
      "raw-evidence",
      "child-result.json",
    ));
    if (preSignalDrift.code !== "STAGE_BLOCKED_NO_MUTATION"
      || preSignalSpawnCount !== 1
      || preSignalAuthorizationCalls !== 3
      || !preSignalBarrierReached
      || preSignalChildResultBytes.length !== 0
      || processTreeAlive(preSignalChild)
      || preSignalDriftEvents.map((event) => event.state).join(",") !== "running,blocked-no-mutation") {
      throw new Error("serializable post-lock pre-signal authority drift case failed");
    }
    cases += 1;

    const preSignalDriftReplay = await executeFixture(preSignalDriftDefinition, preSignalDriftEntry, {
      runtimeRoot: preSignalDriftRuntimeRoot,
      spawnProcess: (...args) => {
        preSignalSpawnCount += 1;
        return spawn(...args);
      },
    });
    if (preSignalDriftReplay.code !== "STAGE_ALREADY_TERMINAL"
      || preSignalSpawnCount !== 1
      || preSignalChildResultBytes.length !== 0) {
      throw new Error("serializable post-lock pre-signal authority drift replay case failed");
    }
    cases += 1;

    const preSignalExpiryDefinition = definitionFor({ suffix: "PRESIGNAL-DEADLINE-EXPIRY" });
    const preSignalExpiryEntry = await entryFor(preSignalExpiryDefinition, successName);
    const preSignalExpiryRuntimeRoot = path.join(root, "pre-signal-deadline-expiry-runtime");
    const preSignalExpiryAuthorization = authorizationFor(preSignalExpiryDefinition, {
      moduleSha256: preSignalExpiryEntry.moduleSha256,
      deadlineAt: new Date(Date.now() + 4_000).toISOString(),
    });
    let preSignalExpirySpawnCount = 0;
    let preSignalExpiryChild = null;
    let preSignalExpiryBarrierCount = 0;
    const preSignalExpired = await executeFixture(preSignalExpiryDefinition, preSignalExpiryEntry, {
      runtimeRoot: preSignalExpiryRuntimeRoot,
      authorization: preSignalExpiryAuthorization,
      childLockRecordPersistBarrier: async () => {
        preSignalExpiryBarrierCount += 1;
        await delay(4_200);
      },
      spawnProcess: (...args) => {
        preSignalExpirySpawnCount += 1;
        preSignalExpiryChild = spawn(...args);
        return preSignalExpiryChild;
      },
    });
    const preSignalExpiryKey = safeRuntimeSegment(`${preSignalExpiryDefinition.taskId}\0${preSignalExpiryDefinition.stageId}\0${preSignalExpiryDefinition.idempotencyKey}`);
    const preSignalExpiryEvents = await readEvents(path.join(preSignalExpiryRuntimeRoot, preSignalExpiryKey, "events"));
    const preSignalExpiryChildResultBytes = await readFile(path.join(
      preSignalExpiryRuntimeRoot,
      preSignalExpiryKey,
      "raw-evidence",
      "child-result.json",
    ));
    if (preSignalExpired.code !== "STAGE_EXPIRED_BEFORE_MUTATION"
      || preSignalExpirySpawnCount !== 1
      || preSignalExpiryBarrierCount !== 1
      || preSignalExpiryChildResultBytes.length !== 0
      || processTreeAlive(preSignalExpiryChild)
      || preSignalExpiryEvents.map((event) => event.state).join(",") !== "running,expired-before-mutation") {
      throw new Error("serializable post-lock pre-signal deadline termination case failed");
    }
    cases += 1;

    const preSignalExpiryReplay = await executeFixture(preSignalExpiryDefinition, preSignalExpiryEntry, {
      runtimeRoot: preSignalExpiryRuntimeRoot,
      authorization: preSignalExpiryAuthorization,
      spawnProcess: (...args) => {
        preSignalExpirySpawnCount += 1;
        return spawn(...args);
      },
    });
    if (preSignalExpiryReplay.code !== "STAGE_ALREADY_TERMINAL"
      || preSignalExpirySpawnCount !== 1
      || preSignalExpiryChildResultBytes.length !== 0) {
      throw new Error("serializable post-lock pre-signal deadline replay case failed");
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

    const serialPendingFileSyncDefinition = definitionFor({ suffix: "SERIAL-PENDING-FILESYNC-FAIL-STUCK" });
    const serialPendingFileSyncEntry = await entryFor(serialPendingFileSyncDefinition, successName);
    const serialPendingFileSyncRuntimeRoot = path.join(root, "serial-pending-filesync-fail-stuck-runtime");
    let serialPendingSpawnCount = 0;
    let serialPendingFileSyncAttempts = 0;
    let serialPendingRecoveryAppendAttempts = 0;
    const appendSerialPendingThenThrow = async (directory, sequence, event) => {
      if (event.state === "recovery-required") serialPendingRecoveryAppendAttempts += 1;
      const eventPath = await appendEvent(directory, sequence, event);
      if (sequence === 2 && event.state === "verification-pending") {
        throw new Error("synthetic serializable verification-pending file fsync uncertainty");
      }
      return eventPath;
    };
    const serialPendingFileSyncFailure = await executeFixture(
      serialPendingFileSyncDefinition,
      serialPendingFileSyncEntry,
      {
        runtimeRoot: serialPendingFileSyncRuntimeRoot,
        appendJournalEvent: appendSerialPendingThenThrow,
        syncEventFile: async () => {
          serialPendingFileSyncAttempts += 1;
          throw new Error("synthetic serializable tail file fsync failure");
        },
        spawnProcess: (...args) => {
          serialPendingSpawnCount += 1;
          return spawn(...args);
        },
      },
    );
    const serialPendingFileSyncKey = safeRuntimeSegment(`${serialPendingFileSyncDefinition.taskId}\0${serialPendingFileSyncDefinition.stageId}\0${serialPendingFileSyncDefinition.idempotencyKey}`);
    const serialPendingFileSyncLockPath = path.join(
      serialPendingFileSyncRuntimeRoot,
      "locks",
      `${serialPendingFileSyncKey}.lock`,
    );
    const serialPendingFileSyncEvents = await readEvents(path.join(
      serialPendingFileSyncRuntimeRoot,
      serialPendingFileSyncKey,
      "events",
    ));
    let serialPendingFileSyncLockRetained = true;
    try {
      await access(serialPendingFileSyncLockPath, fsConstants.F_OK);
    } catch {
      serialPendingFileSyncLockRetained = false;
    }
    if (serialPendingFileSyncFailure.code !== "STAGE_RECOVERY_REQUIRED"
      || serialPendingSpawnCount !== 1
      || serialPendingFileSyncAttempts !== 1
      || serialPendingRecoveryAppendAttempts !== 0
      || serialPendingFileSyncEvents.map((event) => event.state).join(",") !== "running,verification-pending"
      || !serialPendingFileSyncLockRetained) {
      throw new Error("serializable verification-pending predecessor durability case failed");
    }
    cases += 1;

    const serialPendingFileSyncReplay = await executeFixture(
      serialPendingFileSyncDefinition,
      serialPendingFileSyncEntry,
      {
        runtimeRoot: serialPendingFileSyncRuntimeRoot,
        spawnProcess: (...args) => {
          serialPendingSpawnCount += 1;
          return spawn(...args);
        },
      },
    );
    if (serialPendingFileSyncReplay.code !== "STAGE_LOCK_UNAVAILABLE"
      || serialPendingSpawnCount !== 1) {
      throw new Error("serializable file-fsync-unproven replay lock case failed");
    }
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
        return revokeCalls <= 3
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

    const serialRefreshStraddleDefinition = definitionFor({ suffix: "REFRESH-DEADLINE-STRADDLE" });
    const serialRefreshStraddleEntry = await entryFor(serialRefreshStraddleDefinition, successName);
    const serialRefreshStraddleRuntimeRoot = path.join(root, "serial-refresh-deadline-straddle-runtime");
    let serialRefreshNowMs = Date.now();
    const serialRefreshAuthorization = authorizationFor(serialRefreshStraddleDefinition, {
      moduleSha256: serialRefreshStraddleEntry.moduleSha256,
      deadlineAt: new Date(serialRefreshNowMs + 30_000).toISOString(),
    });
    let serialRefreshAuthorizationCalls = 0;
    let serialRefreshSpawnCount = 0;
    const serialRefreshStraddle = await executeFixture(
      serialRefreshStraddleDefinition,
      serialRefreshStraddleEntry,
      {
        runtimeRoot: serialRefreshStraddleRuntimeRoot,
        clock: () => new Date(serialRefreshNowMs),
        authorize: async () => {
          serialRefreshAuthorizationCalls += 1;
          if (serialRefreshAuthorizationCalls === 4) {
            await Promise.resolve();
            serialRefreshNowMs += 6_000;
            return {
              ...serialRefreshAuthorization,
              deadlineAt: new Date(serialRefreshNowMs + 60_000).toISOString(),
            };
          }
          return serialRefreshAuthorization;
        },
        spawnProcess: (...args) => {
          serialRefreshSpawnCount += 1;
          return spawn(...args);
        },
      },
    );
    const serialRefreshStraddleKey = safeRuntimeSegment(`${serialRefreshStraddleDefinition.taskId}\0${serialRefreshStraddleDefinition.stageId}\0${serialRefreshStraddleDefinition.idempotencyKey}`);
    const serialRefreshStraddleEvents = await readEvents(path.join(
      serialRefreshStraddleRuntimeRoot,
      serialRefreshStraddleKey,
      "events",
    ));
    if (serialRefreshStraddle.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID"
      || serialRefreshAuthorizationCalls !== 4
      || serialRefreshSpawnCount !== 1
      || serialRefreshStraddleEvents.map((event) => event.state).join(",") !== "running,verification-pending,recovery-required"
      || serialRefreshStraddleEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("serializable post-refresh fixed-deadline straddle case failed");
    }
    cases += 1;

    const serialRefreshStraddleReplay = await executeFixture(
      serialRefreshStraddleDefinition,
      serialRefreshStraddleEntry,
      {
        runtimeRoot: serialRefreshStraddleRuntimeRoot,
        authorization: serialRefreshAuthorization,
        clock: () => new Date(serialRefreshNowMs),
        spawnProcess: (...args) => {
          serialRefreshSpawnCount += 1;
          return spawn(...args);
        },
      },
    );
    const serialRefreshReplayEvents = await readEvents(path.join(
      serialRefreshStraddleRuntimeRoot,
      serialRefreshStraddleKey,
      "events",
    ));
    if (serialRefreshStraddleReplay.code !== "STAGE_RECOVERY_REQUIRED"
      || serialRefreshSpawnCount !== 1
      || serialRefreshReplayEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("serializable post-refresh fixed-deadline replay case failed");
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

    const productionCallbackRequest = {
      ...bindingRequest(definition),
      execute: async () => {
        throw new Error("Stage 0 must not invoke an unreviewed callback");
      },
    };
    const absentCallbackStage = await executeStageFromExactMain(productionCallbackRequest);
    if (absentCallbackStage.code !== "STAGE_ACTION_NOT_REVIEWED") {
      throw new Error("callback production stage-absence case failed");
    }
    cases += 1;

    for (const invalidCallbackRequest of [
      { ...productionCallbackRequest, trust: true },
      { ...bindingRequest(definition) },
      { ...productionCallbackRequest, execute: "not-a-function" },
    ]) {
      const rejected = await executeStageFromExactMain(invalidCallbackRequest);
      if (rejected.code !== "STAGE_CALLBACK_REQUEST_SHAPE_INVALID") {
        throw new Error("callback exact production schema case failed");
      }
    }
    cases += 1;

    const capturedExecute = productionCallbackRequest.execute;
    const mutableCallbackRequest = { ...productionCallbackRequest };
    const synchronouslyCaptured = captureCallbackProductionRequest(mutableCallbackRequest);
    mutableCallbackRequest.taskId = "REL-R0-001";
    mutableCallbackRequest.stageId = "P0-STAGE-REL-R0-001-MUTATED-AFTER-CAPTURE";
    mutableCallbackRequest.execute = async () => null;
    if (synchronouslyCaptured?.identity.taskId !== definition.taskId
      || synchronouslyCaptured?.identity.stageId !== definition.stageId
      || synchronouslyCaptured?.execute !== capturedExecute) {
      throw new Error("callback synchronous descriptor capture case failed");
    }
    cases += 1;

    const callbackModuleName = "P0-runner-callback-binding-fixture.mjs";
    await writeModule(callbackModuleName, "export const reviewedCallbackBinding = true;\n");
    const callbackEntryFor = (callbackDefinition) => entryFor(callbackDefinition, callbackModuleName);
    const callbackSuccessDefinition = definitionFor({
      suffix: "CALLBACK-SUCCESS",
      moduleId: "eng.callback-success",
      argumentSetId: "callback-success.v1",
    });
    const callbackSuccessEntry = await callbackEntryFor(callbackSuccessDefinition);
    const reviewedCallbackIdentity = async () => null;
    const wrongCallbackIdentity = async () => null;
    const reviewedCallbackEntry = Object.freeze({
      moduleId: callbackSuccessEntry.moduleId,
      moduleRelativePath: callbackSuccessEntry.moduleRelativePath,
      moduleSha256: callbackSuccessEntry.moduleSha256,
      gitMode: callbackSuccessEntry.gitMode,
      execute: reviewedCallbackIdentity,
      capabilityProfile: CALLBACK_CAPABILITY_PROFILE,
      capabilityReviewSha256: `sha256:${"6".repeat(64)}`,
    });
    if (!reviewedCallbackMatches(reviewedCallbackEntry, callbackSuccessEntry, reviewedCallbackIdentity)
      || reviewedCallbackMatches(reviewedCallbackEntry, callbackSuccessEntry, wrongCallbackIdentity)
      || reviewedCallbackMatches(
        { ...reviewedCallbackEntry, capabilityProfile: "native-io-permitted" },
        callbackSuccessEntry,
        reviewedCallbackIdentity,
      )
      || reviewedCallbackMatches(
        { ...reviewedCallbackEntry, capabilityReviewSha256: "unbound-review" },
        callbackSuccessEntry,
        reviewedCallbackIdentity,
      )
      || Object.keys(PRODUCTION_CALLBACK_ALLOWLIST).length !== 0) {
      throw new Error("callback code-owned function identity case failed");
    }
    cases += 1;
    const callbackSuccessAuthorization = authorizationFor(callbackSuccessDefinition, {
      moduleSha256: callbackSuccessEntry.moduleSha256,
    });
    let callbackContextObserved = null;
    let callbackRunningObserved = false;
    let callbackExecutions = 0;
    const callbackSucceeded = await executeCallbackFixture(
      callbackSuccessDefinition,
      callbackSuccessEntry,
      async (context) => {
        callbackExecutions += 1;
        callbackContextObserved = context;
        const runtimeKeyValue = safeRuntimeSegment(`${context.taskId}\0${context.stageId}\0${context.idempotencyKey}`);
        const events = await readEvents(path.join(runtimeRoot, runtimeKeyValue, "events"));
        callbackRunningObserved = events.length === 1 && events[0].state === "running";
        return callbackCompletionFor(callbackSuccessDefinition, context);
      },
      { authorization: callbackSuccessAuthorization },
    );
    const callbackContextKeys = [
      "actionClass", "candidateRevision", "deadlineAt", "idempotencyKey", "predecessorReceiptSha256",
      "revision", "scopeClass", "signal", "stageId", "taskId",
    ];
    if (callbackSucceeded.code !== "STAGE_SUCCEEDED"
      || callbackExecutions !== 1
      || !callbackRunningObserved
      || !Object.isFrozen(callbackContextObserved)
      || Object.keys(callbackContextObserved).sort().join("\0") !== callbackContextKeys.join("\0")
      || callbackContextObserved.taskId !== callbackSuccessDefinition.taskId
      || callbackContextObserved.scopeClass !== callbackSuccessDefinition.scopeClass
      || callbackContextObserved.actionClass !== callbackSuccessDefinition.actionClass
      || callbackContextObserved.stageId !== callbackSuccessDefinition.stageId
      || callbackContextObserved.predecessorReceiptSha256 !== null
      || callbackContextObserved.idempotencyKey !== callbackSuccessDefinition.idempotencyKey
      || callbackContextObserved.revision !== callbackSuccessAuthorization.sourceRevision
      || callbackContextObserved.candidateRevision !== callbackSuccessAuthorization.candidateRevision
      || Date.parse(callbackContextObserved.deadlineAt) - Date.now() > MAX_CALLBACK_DEADLINE_MS) {
      throw new Error("bounded frozen callback context/running-before-action case failed");
    }
    cases += 1;

    const callbackSuccessKey = safeRuntimeSegment(`${callbackSuccessDefinition.taskId}\0${callbackSuccessDefinition.stageId}\0${callbackSuccessDefinition.idempotencyKey}`);
    const callbackSuccessEvents = await readEvents(path.join(runtimeRoot, callbackSuccessKey, "events"));
    const callbackTerminalReceipt = callbackSuccessEvents.at(-1)?.receipt;
    if (callbackSuccessEvents.map((event) => event.state).join(",") !== "running,verification-pending,verified-complete"
      || callbackTerminalReceipt.preparationReviewSha256 !== callbackSuccessAuthorization.preparationReviewSha256
      || callbackTerminalReceipt.stageBindingDigest !== callbackSuccessAuthorization.stageDefinitionSha256
      || callbackTerminalReceipt.moduleSha256 !== callbackSuccessAuthorization.moduleSha256
      || callbackTerminalReceipt.registrySha256 !== callbackSuccessAuthorization.registrySha256
      || callbackTerminalReceipt.predecessorReceiptSha256 !== null
      || callbackTerminalReceipt.childResultSha256 === null
      || callbackTerminalReceipt.stdoutSha256 !== EMPTY_EVIDENCE_SHA256
      || callbackTerminalReceipt.stderrSha256 !== EMPTY_EVIDENCE_SHA256) {
      throw new Error("callback durable receipt binding case failed");
    }
    cases += 1;

    const callbackReplay = await executeCallbackFixture(
      callbackSuccessDefinition,
      callbackSuccessEntry,
      async () => {
        callbackExecutions += 1;
        return null;
      },
      { authorization: callbackSuccessAuthorization },
    );
    if (callbackReplay.code !== "STAGE_ALREADY_SUCCEEDED"
      || callbackReplay.receiptDigest !== callbackSucceeded.receiptDigest
      || callbackExecutions !== 1) {
      throw new Error("callback replay/no-second-execution case failed");
    }
    cases += 1;

    const callbackIdentityMutations = [
      ["taskId", "REL-R0-001"],
      ["scopeClass", "private-execution"],
      ["actionClass", "deployment"],
      ["stageId", "P0-STAGE-ENG-R0-001-WRONG-STAGE"],
      ["predecessorReceiptSha256", `sha256:${"7".repeat(64)}`],
      ["idempotencyKey", "P0-IDEMP-ENG-R0-001-WRONG-CALLBACK-001"],
    ];
    for (const [index, [key, value]] of callbackIdentityMutations.entries()) {
      const mismatchDefinition = definitionFor({
        suffix: `CALLBACK-IDENTITY-${index + 1}`,
        moduleId: `eng.callback-identity-${index + 1}`,
        argumentSetId: `callback-identity-${index + 1}.v1`,
      });
      const mismatchEntry = await callbackEntryFor(mismatchDefinition);
      const mismatch = await executeCallbackFixture(mismatchDefinition, mismatchEntry, async (context) => (
        callbackCompletionFor(mismatchDefinition, context, { [key]: value })
      ));
      if (mismatch.code !== "STAGE_CALLBACK_RECEIPT_REJECTED") {
        throw new Error(`callback completion identity mismatch case failed: ${key}`);
      }
      cases += 1;
    }

    const callbackThrowDefinition = definitionFor({
      suffix: "CALLBACK-THROW",
      moduleId: "eng.callback-throw",
      argumentSetId: "callback-throw.v1",
    });
    const callbackThrowEntry = await callbackEntryFor(callbackThrowDefinition);
    const callbackThrew = await executeCallbackFixture(callbackThrowDefinition, callbackThrowEntry, async () => {
      throw new Error("synthetic callback failure detail must not escape");
    });
    if (callbackThrew.code !== "STAGE_CALLBACK_FAILED"
      || JSON.stringify(callbackThrew).includes("synthetic callback failure detail")) {
      throw new Error("callback throw sanitization case failed");
    }
    cases += 1;

    const callbackEarlyDefinition = definitionFor({
      suffix: "CALLBACK-EARLY-RETURN",
      moduleId: "eng.callback-early",
      argumentSetId: "callback-early.v1",
    });
    const callbackEarlyEntry = await callbackEntryFor(callbackEarlyDefinition);
    const callbackEarly = await executeCallbackFixture(callbackEarlyDefinition, callbackEarlyEntry, async () => undefined);
    if (callbackEarly.code !== "STAGE_CALLBACK_RECEIPT_REJECTED") {
      throw new Error("callback early-return rejection case failed");
    }
    cases += 1;

    const callbackOutputDefinition = definitionFor({
      suffix: "CALLBACK-RAW-OUTPUT",
      moduleId: "eng.callback-output",
      argumentSetId: "callback-output.v1",
    });
    const callbackOutputEntry = await callbackEntryFor(callbackOutputDefinition);
    const callbackRawCanary = "synthetic-private-callback-output-canary";
    const callbackOutput = await executeCallbackFixture(callbackOutputDefinition, callbackOutputEntry, async (context) => ({
      ...callbackCompletionFor(callbackOutputDefinition, context),
      output: callbackRawCanary,
    }));
    if (callbackOutput.code !== "STAGE_CALLBACK_RECEIPT_REJECTED"
      || JSON.stringify(callbackOutput).includes(callbackRawCanary)) {
      throw new Error("callback raw-output rejection case failed");
    }
    cases += 1;

    const callbackStreamDefinition = definitionFor({
      suffix: "CALLBACK-RAW-STREAM",
      moduleId: "eng.callback-stream",
      argumentSetId: "callback-stream.v1",
    });
    const callbackStreamEntry = await callbackEntryFor(callbackStreamDefinition);
    const callbackStreamCanary = "synthetic-callback-stream-canary";
    const originalStdoutWrite = process.stdout.write;
    const originalStderrWrite = process.stderr.write;
    const callbackStreamResult = await executeCallbackFixture(
      callbackStreamDefinition,
      callbackStreamEntry,
      async (context) => {
        console.log(callbackStreamCanary);
        process.stderr.write(callbackStreamCanary);
        return callbackCompletionFor(callbackStreamDefinition, context);
      },
    );
    const callbackStreamKey = safeRuntimeSegment(`${callbackStreamDefinition.taskId}\0${callbackStreamDefinition.stageId}\0${callbackStreamDefinition.idempotencyKey}`);
    const callbackStreamRoot = path.join(runtimeRoot, callbackStreamKey);
    const callbackStreamEvents = await readEvents(path.join(callbackStreamRoot, "events"));
    const callbackStreamReceipt = callbackStreamEvents.at(-1)?.receipt;
    if (callbackStreamResult.code !== "STAGE_CALLBACK_RAW_STREAM_REJECTED"
      || JSON.stringify(callbackStreamResult).includes(callbackStreamCanary)
      || process.stdout.write !== originalStdoutWrite
      || process.stderr.write !== originalStderrWrite
      || callbackStreamEvents.map((event) => event.state).join(",") !== "running,recovery-required"
      || callbackStreamReceipt?.stdoutSha256 === null
      || callbackStreamReceipt?.stderrSha256 === null
      || callbackStreamReceipt?.stdoutSha256 === EMPTY_EVIDENCE_SHA256
      || callbackStreamReceipt?.stderrSha256 === EMPTY_EVIDENCE_SHA256
      || (await readdir(path.join(callbackStreamRoot, "raw-evidence"))).length !== 0) {
      throw new Error("callback raw-stream containment case failed");
    }
    cases += 1;

    const callbackInitialGateDefinition = definitionFor({
      suffix: "CALLBACK-INITIAL-GATE-DRIFT",
      moduleId: "eng.callback-initial-gate",
      argumentSetId: "callback-initial-gate.v1",
    });
    const callbackInitialGateEntry = await callbackEntryFor(callbackInitialGateDefinition);
    let callbackInitialGateRan = false;
    const callbackInitialGate = await executeCallbackFixture(
      callbackInitialGateDefinition,
      callbackInitialGateEntry,
      async () => {
        callbackInitialGateRan = true;
        return null;
      },
      {
        authorization: authorizationFor(callbackInitialGateDefinition, {
          moduleSha256: callbackInitialGateEntry.moduleSha256,
          taskId: "REL-R0-001",
        }),
      },
    );
    if (callbackInitialGate.code !== "STAGE_GATE_B_DENIED" || callbackInitialGateRan) {
      throw new Error("callback initial Gate B identity case failed");
    }
    cases += 1;

    const callbackModuleDriftDefinition = definitionFor({
      suffix: "CALLBACK-MODULE-DRIFT",
      moduleId: "eng.callback-module-drift",
      argumentSetId: "callback-module-drift.v1",
    });
    const callbackModuleDriftEntry = await callbackEntryFor(callbackModuleDriftDefinition);
    let callbackModuleDriftRan = false;
    const callbackModuleDrift = await executeCallbackFixture(
      callbackModuleDriftDefinition,
      { ...callbackModuleDriftEntry, moduleSha256: `sha256:${"0".repeat(64)}` },
      async () => {
        callbackModuleDriftRan = true;
        return null;
      },
      {
        authorization: authorizationFor(callbackModuleDriftDefinition, {
          moduleSha256: `sha256:${"0".repeat(64)}`,
        }),
      },
    );
    if (callbackModuleDrift.code !== "STAGE_MODULE_NOT_ALLOWLISTED" || callbackModuleDriftRan) {
      throw new Error("callback reviewed-module binding case failed");
    }
    cases += 1;

    const callbackLockedGateDefinition = definitionFor({
      suffix: "CALLBACK-LOCKED-GATE-DRIFT",
      moduleId: "eng.callback-locked-gate",
      argumentSetId: "callback-locked-gate.v1",
    });
    const callbackLockedGateEntry = await callbackEntryFor(callbackLockedGateDefinition);
    const callbackLockedAuthorization = authorizationFor(callbackLockedGateDefinition, {
      moduleSha256: callbackLockedGateEntry.moduleSha256,
    });
    let callbackLockedCalls = 0;
    let callbackLockedGateRan = false;
    const callbackLockedGate = await executeCallbackFixture(
      callbackLockedGateDefinition,
      callbackLockedGateEntry,
      async () => {
        callbackLockedGateRan = true;
        return null;
      },
      {
        authorize: async () => {
          callbackLockedCalls += 1;
          return callbackLockedCalls === 1
            ? callbackLockedAuthorization
            : { ...callbackLockedAuthorization, stageApprovalSha256: "0".repeat(64) };
        },
      },
    );
    if (callbackLockedGate.code !== "STAGE_GATE_B_DENIED" || callbackLockedGateRan) {
      throw new Error("callback under-lock Gate B recheck case failed");
    }
    cases += 1;

    const callbackSourceDriftDefinition = definitionFor({
      suffix: "CALLBACK-SOURCE-DRIFT",
      moduleId: "eng.callback-source-drift",
      argumentSetId: "callback-source-drift.v1",
    });
    const callbackSourceDriftEntry = await callbackEntryFor(callbackSourceDriftDefinition);
    const callbackSourceAuthorization = authorizationFor(callbackSourceDriftDefinition, {
      moduleSha256: callbackSourceDriftEntry.moduleSha256,
    });
    let callbackSourceCalls = 0;
    let sourceDriftSignal = null;
    const callbackSourceDrift = await executeCallbackFixture(
      callbackSourceDriftDefinition,
      callbackSourceDriftEntry,
      async (context) => {
        sourceDriftSignal = context.signal;
        return callbackCompletionFor(callbackSourceDriftDefinition, context);
      },
      {
        authorize: async () => {
          callbackSourceCalls += 1;
          return callbackSourceCalls <= 3
            ? callbackSourceAuthorization
            : { ...callbackSourceAuthorization, sourceRevision: "2".repeat(40) };
        },
      },
    );
    if (callbackSourceDrift.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID"
      || sourceDriftSignal?.aborted !== true
      || sourceDriftSignal?.reason !== "callback-authority-invalidated") {
      throw new Error("callback post-settlement source movement case failed");
    }
    cases += 1;

    const callbackRefreshStraddleDefinition = definitionFor({
      suffix: "CALLBACK-REFRESH-DEADLINE-STRADDLE",
      moduleId: "eng.callback-refresh-straddle",
      argumentSetId: "callback-refresh-straddle.v1",
    });
    const callbackRefreshStraddleEntry = await callbackEntryFor(callbackRefreshStraddleDefinition);
    const callbackRefreshStraddleRuntimeRoot = path.join(root, "callback-refresh-deadline-straddle-runtime");
    let callbackRefreshNowMs = Date.now();
    const callbackRefreshAuthorization = authorizationFor(callbackRefreshStraddleDefinition, {
      moduleSha256: callbackRefreshStraddleEntry.moduleSha256,
      deadlineAt: new Date(callbackRefreshNowMs + 30_000).toISOString(),
    });
    let callbackRefreshAuthorizationCalls = 0;
    let callbackRefreshExecutions = 0;
    const callbackRefreshStraddle = await executeCallbackFixture(
      callbackRefreshStraddleDefinition,
      callbackRefreshStraddleEntry,
      async (context) => {
        callbackRefreshExecutions += 1;
        return callbackCompletionFor(callbackRefreshStraddleDefinition, context);
      },
      {
        runtimeRoot: callbackRefreshStraddleRuntimeRoot,
        clock: () => new Date(callbackRefreshNowMs),
        authorize: async () => {
          callbackRefreshAuthorizationCalls += 1;
          if (callbackRefreshAuthorizationCalls === 4) {
            await Promise.resolve();
            callbackRefreshNowMs += 6_000;
            return {
              ...callbackRefreshAuthorization,
              deadlineAt: new Date(callbackRefreshNowMs + 60_000).toISOString(),
            };
          }
          return callbackRefreshAuthorization;
        },
      },
    );
    const callbackRefreshStraddleKey = safeRuntimeSegment(`${callbackRefreshStraddleDefinition.taskId}\0${callbackRefreshStraddleDefinition.stageId}\0${callbackRefreshStraddleDefinition.idempotencyKey}`);
    const callbackRefreshStraddleEvents = await readEvents(path.join(
      callbackRefreshStraddleRuntimeRoot,
      callbackRefreshStraddleKey,
      "events",
    ));
    if (callbackRefreshStraddle.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID"
      || callbackRefreshAuthorizationCalls !== 4
      || callbackRefreshExecutions !== 1
      || callbackRefreshStraddleEvents.map((event) => event.state).join(",") !== "running,recovery-required"
      || callbackRefreshStraddleEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("callback post-refresh fixed-deadline straddle case failed");
    }
    cases += 1;

    const callbackRefreshStraddleReplay = await executeCallbackFixture(
      callbackRefreshStraddleDefinition,
      callbackRefreshStraddleEntry,
      async () => {
        callbackRefreshExecutions += 1;
        return null;
      },
      {
        runtimeRoot: callbackRefreshStraddleRuntimeRoot,
        authorization: callbackRefreshAuthorization,
        clock: () => new Date(callbackRefreshNowMs),
      },
    );
    const callbackRefreshReplayEvents = await readEvents(path.join(
      callbackRefreshStraddleRuntimeRoot,
      callbackRefreshStraddleKey,
      "events",
    ));
    if (callbackRefreshStraddleReplay.code !== "STAGE_RECOVERY_REQUIRED"
      || callbackRefreshExecutions !== 1
      || callbackRefreshReplayEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("callback post-refresh fixed-deadline replay case failed");
    }
    cases += 1;

    const callbackFinalGateDefinition = definitionFor({
      suffix: "CALLBACK-FINAL-GATE-DRIFT",
      moduleId: "eng.callback-final-gate",
      argumentSetId: "callback-final-gate.v1",
    });
    const callbackFinalGateEntry = await callbackEntryFor(callbackFinalGateDefinition);
    const callbackFinalAuthorization = authorizationFor(callbackFinalGateDefinition, {
      moduleSha256: callbackFinalGateEntry.moduleSha256,
    });
    let callbackFinalGateCalls = 0;
    const callbackFinalGate = await executeCallbackFixture(
      callbackFinalGateDefinition,
      callbackFinalGateEntry,
      async (context) => callbackCompletionFor(callbackFinalGateDefinition, context),
      {
        authorize: async () => {
          callbackFinalGateCalls += 1;
          return callbackFinalGateCalls < 11
            ? callbackFinalAuthorization
            : { ...callbackFinalAuthorization, registrySha256: "0".repeat(64) };
        },
      },
    );
    const callbackFinalKey = safeRuntimeSegment(`${callbackFinalGateDefinition.taskId}\0${callbackFinalGateDefinition.stageId}\0${callbackFinalGateDefinition.idempotencyKey}`);
    const callbackFinalEvents = await readEvents(path.join(runtimeRoot, callbackFinalKey, "events"));
    if (callbackFinalGate.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID"
      || callbackFinalGateCalls !== 11
      || callbackFinalEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("callback final pre-terminal Gate B recheck case failed");
    }
    cases += 1;

    const callbackVerifierDefinition = definitionFor({
      suffix: "CALLBACK-VERIFIER-REJECTS",
      moduleId: "eng.callback-verifier",
      argumentSetId: "callback-verifier.v1",
    });
    const callbackVerifierEntry = await callbackEntryFor(callbackVerifierDefinition);
    const callbackVerifier = await executeCallbackFixture(
      callbackVerifierDefinition,
      callbackVerifierEntry,
      async (context) => callbackCompletionFor(callbackVerifierDefinition, context),
      { verifyOutcome: async () => null },
    );
    if (callbackVerifier.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID") {
      throw new Error("callback outcome-verifier rejection case failed");
    }
    cases += 1;

    const callbackPrestartExpiryDefinition = definitionFor({
      suffix: "CALLBACK-PRESTART-AUTHORITY-EXPIRY",
      moduleId: "eng.callback-prestart-expiry",
      argumentSetId: "callback-prestart-expiry.v1",
    });
    const callbackPrestartExpiryEntry = await callbackEntryFor(callbackPrestartExpiryDefinition);
    const callbackPrestartExpiryAuthorization = authorizationFor(callbackPrestartExpiryDefinition, {
      moduleSha256: callbackPrestartExpiryEntry.moduleSha256,
      deadlineAt: new Date(Date.now() + 1_000).toISOString(),
    });
    let callbackPrestartExpiryExecutions = 0;
    let callbackPrestartExpiryAuthorizationCalls = 0;
    const delayedRunningAppend = async (directory, sequence, event) => {
      if (sequence === 1) await delay(1_200);
      return appendEvent(directory, sequence, event);
    };
    const callbackPrestartExpiry = await executeCallbackFixture(
      callbackPrestartExpiryDefinition,
      callbackPrestartExpiryEntry,
      async () => {
        callbackPrestartExpiryExecutions += 1;
        return null;
      },
      {
        authorization: callbackPrestartExpiryAuthorization,
        authorize: async () => {
          callbackPrestartExpiryAuthorizationCalls += 1;
          return callbackPrestartExpiryAuthorization;
        },
        appendJournalEvent: delayedRunningAppend,
      },
    );
    const callbackPrestartExpiryKey = safeRuntimeSegment(`${callbackPrestartExpiryDefinition.taskId}\0${callbackPrestartExpiryDefinition.stageId}\0${callbackPrestartExpiryDefinition.idempotencyKey}`);
    const callbackPrestartExpiryEvents = await readEvents(path.join(runtimeRoot, callbackPrestartExpiryKey, "events"));
    if (callbackPrestartExpiry.code !== "STAGE_EXPIRED_BEFORE_MUTATION"
      || callbackPrestartExpiry.state !== "expired-before-mutation"
      || callbackPrestartExpiryExecutions !== 0
      || callbackPrestartExpiryAuthorizationCalls !== 3
      || callbackPrestartExpiryEvents.map((event) => event.state).join(",") !== "running,expired-before-mutation"
      || callbackPrestartExpiryEvents.at(-1)?.receipt?.childResultSha256 !== null) {
      throw new Error("callback post-running pre-invocation authority expiry case failed");
    }
    cases += 1;

    const callbackDeadlineDefinition = definitionFor({
      suffix: "CALLBACK-DEADLINE",
      moduleId: "eng.callback-deadline",
      argumentSetId: "callback-deadline.v1",
      deadlineMs: 1_000,
    });
    const callbackDeadlineEntry = await callbackEntryFor(callbackDeadlineDefinition);
    const callbackDeadlineAuthorization = authorizationFor(callbackDeadlineDefinition, {
      moduleSha256: callbackDeadlineEntry.moduleSha256,
      deadlineAt: new Date(Date.now() + 150).toISOString(),
    });
    let callbackDeadlineSignal = null;
    let callbackDeadlineSettled = false;
    const callbackDeadline = await executeCallbackFixture(
      callbackDeadlineDefinition,
      callbackDeadlineEntry,
      async (context) => new Promise((resolve) => {
        callbackDeadlineSignal = context.signal;
        context.signal.addEventListener("abort", () => {
          setTimeout(() => {
            callbackDeadlineSettled = true;
            resolve(callbackCompletionFor(callbackDeadlineDefinition, context));
          }, 15);
        }, { once: true });
      }),
      { authorization: callbackDeadlineAuthorization },
    );
    if (callbackDeadline.code !== "STAGE_CALLBACK_DEADLINE_EXCEEDED"
      || callbackDeadlineSignal?.aborted !== true
      || callbackDeadlineSignal?.reason !== "callback-deadline-exceeded"
      || !callbackDeadlineSettled) {
      throw new Error("callback deadline/abort/settlement case failed");
    }
    cases += 1;

    const callbackPrimordialDefinition = definitionFor({
      suffix: "CALLBACK-PRIMORDIAL-DEADLINE",
      moduleId: "eng.callback-primordial",
      argumentSetId: "callback-primordial.v1",
      deadlineMs: 1_000,
    });
    const callbackPrimordialEntry = await callbackEntryFor(callbackPrimordialDefinition);
    const callbackPrimordialAuthorization = authorizationFor(callbackPrimordialDefinition, {
      moduleSha256: callbackPrimordialEntry.moduleSha256,
      deadlineAt: new Date(Date.now() + 150).toISOString(),
    });
    const originalDateNow = Date.now;
    const originalDateParse = Date.parse;
    const originalDateGetTime = Date.prototype.getTime;
    const originalDateToISOString = Date.prototype.toISOString;
    const originalHrtimeBigint = process.hrtime.bigint;
    const originalGlobalSetTimeout = globalThis.setTimeout;
    const originalGlobalClearTimeout = globalThis.clearTimeout;
    const restoreTimeGlobals = () => {
      Date.now = originalDateNow;
      Date.parse = originalDateParse;
      Date.prototype.getTime = originalDateGetTime;
      Date.prototype.toISOString = originalDateToISOString;
      process.hrtime.bigint = originalHrtimeBigint;
      globalThis.setTimeout = originalGlobalSetTimeout;
      globalThis.clearTimeout = originalGlobalClearTimeout;
    };
    let callbackPrimordialSignal = null;
    const callbackPrimordial = await executeCallbackFixture(
      callbackPrimordialDefinition,
      callbackPrimordialEntry,
      async (context) => new Promise((resolve, reject) => {
        callbackPrimordialSignal = context.signal;
        try {
          Date.now = () => 0;
          Date.parse = () => Number.POSITIVE_INFINITY;
          Date.prototype.getTime = () => 0;
          Date.prototype.toISOString = () => "1970-01-01T00:00:00.000Z";
          process.hrtime.bigint = () => 0n;
          globalThis.setTimeout = () => ({ synthetic: true });
          globalThis.clearTimeout = () => {};
          originalGlobalSetTimeout(() => {
            restoreTimeGlobals();
            resolve(callbackCompletionFor(callbackPrimordialDefinition, context));
          }, 180);
        } catch (error) {
          restoreTimeGlobals();
          reject(error);
        }
      }),
      { authorization: callbackPrimordialAuthorization },
    );
    restoreTimeGlobals();
    if (callbackPrimordial.code !== "STAGE_CALLBACK_DEADLINE_EXCEEDED"
      || callbackPrimordialSignal?.aborted !== true
      || callbackPrimordialSignal?.reason !== "callback-deadline-exceeded") {
      throw new Error("callback primordial deadline containment case failed");
    }
    cases += 1;

    const callbackFailStuckDefinition = definitionFor({
      suffix: "CALLBACK-FAIL-STUCK",
      moduleId: "eng.callback-fail-stuck",
      argumentSetId: "callback-fail-stuck.v1",
      deadlineMs: 1_000,
    });
    const callbackFailStuckEntry = await callbackEntryFor(callbackFailStuckDefinition);
    const callbackFailStuckAuthorization = authorizationFor(callbackFailStuckDefinition, {
      moduleSha256: callbackFailStuckEntry.moduleSha256,
      deadlineAt: new Date(Date.now() + 150).toISOString(),
    });
    let settleIgnoredAbort;
    let ignoredAbortContext;
    const ignoredAbortPromise = executeCallbackFixture(
      callbackFailStuckDefinition,
      callbackFailStuckEntry,
      async (context) => new Promise((resolve) => {
        ignoredAbortContext = context;
        settleIgnoredAbort = () => resolve(callbackCompletionFor(callbackFailStuckDefinition, context));
      }),
      { authorization: callbackFailStuckAuthorization },
    );
    while (typeof settleIgnoredAbort !== "function") await delay(1);
    await delay(170);
    const blockedWhileUnsettled = await executeCallbackFixture(
      callbackFailStuckDefinition,
      callbackFailStuckEntry,
      async () => null,
      { authorization: callbackFailStuckAuthorization },
    );
    if (blockedWhileUnsettled.code !== "STAGE_LOCK_UNAVAILABLE"
      || ignoredAbortContext.signal.aborted !== true) {
      throw new Error("callback ignored-abort lock retention case failed");
    }
    settleIgnoredAbort();
    const ignoredAbortResult = await ignoredAbortPromise;
    if (ignoredAbortResult.code !== "STAGE_CALLBACK_DEADLINE_EXCEEDED") {
      throw new Error("callback ignored-abort settlement case failed");
    }
    cases += 1;

    const callbackConcurrencyDefinition = definitionFor({
      suffix: "CALLBACK-CONCURRENT-LOCK",
      moduleId: "eng.callback-concurrent",
      argumentSetId: "callback-concurrent.v1",
    });
    const callbackConcurrencyEntry = await callbackEntryFor(callbackConcurrencyDefinition);
    let releaseConcurrentCallback;
    let concurrentContext;
    const concurrentFirst = executeCallbackFixture(
      callbackConcurrencyDefinition,
      callbackConcurrencyEntry,
      async (context) => new Promise((resolve) => {
        concurrentContext = context;
        releaseConcurrentCallback = () => resolve(callbackCompletionFor(callbackConcurrencyDefinition, context));
      }),
    );
    while (typeof releaseConcurrentCallback !== "function") await delay(1);
    const concurrentSecond = await executeCallbackFixture(
      callbackConcurrencyDefinition,
      callbackConcurrencyEntry,
      async () => null,
    );
    releaseConcurrentCallback();
    const concurrentFirstResult = await concurrentFirst;
    if (concurrentSecond.code !== "STAGE_LOCK_UNAVAILABLE"
      || concurrentFirstResult.code !== "STAGE_SUCCEEDED"
      || concurrentContext.signal.aborted) {
      throw new Error("callback unique-owner lock case failed");
    }
    cases += 1;

    const callbackGlobalLockDefinitionA = definitionFor({
      suffix: "CALLBACK-GLOBAL-LOCK-A",
      moduleId: "eng.callback-global-a",
      argumentSetId: "callback-global-a.v1",
    });
    const callbackGlobalLockDefinitionB = definitionFor({
      suffix: "CALLBACK-GLOBAL-LOCK-B",
      moduleId: "eng.callback-global-b",
      argumentSetId: "callback-global-b.v1",
    });
    const callbackGlobalLockEntryA = await callbackEntryFor(callbackGlobalLockDefinitionA);
    const callbackGlobalLockEntryB = await callbackEntryFor(callbackGlobalLockDefinitionB);
    let releaseGlobalCallback;
    let globalCallbackBExecutions = 0;
    const globalCallbackA = executeCallbackFixture(
      callbackGlobalLockDefinitionA,
      callbackGlobalLockEntryA,
      async (context) => new Promise((resolve) => {
        releaseGlobalCallback = () => resolve(callbackCompletionFor(callbackGlobalLockDefinitionA, context));
      }),
    );
    while (typeof releaseGlobalCallback !== "function") await delay(1);
    const globalCallbackB = await executeCallbackFixture(
      callbackGlobalLockDefinitionB,
      callbackGlobalLockEntryB,
      async (context) => {
        globalCallbackBExecutions += 1;
        return callbackCompletionFor(callbackGlobalLockDefinitionB, context);
      },
    );
    releaseGlobalCallback();
    const globalCallbackAResult = await globalCallbackA;
    if (globalCallbackB.code !== "STAGE_CALLBACK_LOCK_UNAVAILABLE"
      || globalCallbackBExecutions !== 0
      || globalCallbackAResult.code !== "STAGE_SUCCEEDED") {
      throw new Error("callback global stream-interception lock case failed");
    }
    cases += 1;

    const callbackPredecessorDefinition = definitionFor({
      suffix: "CALLBACK-MISSING-PREDECESSOR",
      moduleId: "eng.callback-predecessor",
      argumentSetId: "callback-predecessor.v1",
      predecessor: {
        stageId: callbackSuccessDefinition.stageId,
        receiptDigest: `sha256:${"8".repeat(64)}`,
      },
    });
    const callbackPredecessorEntry = await callbackEntryFor(callbackPredecessorDefinition);
    const callbackPredecessorRuntimeRoot = path.join(root, "callback-predecessor-runtime");
    let callbackPredecessorRan = false;
    const callbackPredecessor = await executeCallbackFixture(
      callbackPredecessorDefinition,
      callbackPredecessorEntry,
      async () => {
        callbackPredecessorRan = true;
        return null;
      },
      { runtimeRoot: callbackPredecessorRuntimeRoot },
    );
    if (callbackPredecessor.code !== "STAGE_PREDECESSOR_RECEIPT_MISSING" || callbackPredecessorRan) {
      throw new Error("callback predecessor receipt case failed");
    }
    cases += 1;

    const callbackJournalDefinition = definitionFor({
      suffix: "CALLBACK-JOURNAL-FAIL-STUCK",
      moduleId: "eng.callback-journal-fail-stuck",
      argumentSetId: "callback-journal-fail-stuck.v1",
    });
    const callbackJournalEntry = await callbackEntryFor(callbackJournalDefinition);
    const callbackJournalRuntimeRoot = path.join(root, "callback-journal-fail-stuck-runtime");
    let callbackJournalExecutions = 0;
    let callbackJournalAppends = 0;
    const appendRunningThenFail = async (directory, sequence, event) => {
      callbackJournalAppends += 1;
      if (sequence === 1) return appendEvent(directory, sequence, event);
      throw new Error("synthetic post-action journal failure");
    };
    const callbackJournalFailure = await executeCallbackFixture(
      callbackJournalDefinition,
      callbackJournalEntry,
      async (context) => {
        callbackJournalExecutions += 1;
        return callbackCompletionFor(callbackJournalDefinition, context);
      },
      {
        runtimeRoot: callbackJournalRuntimeRoot,
        appendJournalEvent: appendRunningThenFail,
      },
    );
    const callbackJournalKey = safeRuntimeSegment(`${callbackJournalDefinition.taskId}\0${callbackJournalDefinition.stageId}\0${callbackJournalDefinition.idempotencyKey}`);
    const callbackJournalLockPath = path.join(callbackJournalRuntimeRoot, "locks", `${callbackJournalKey}.lock`);
    const callbackJournalEvents = await readEvents(path.join(callbackJournalRuntimeRoot, callbackJournalKey, "events"));
    let callbackJournalLockRetained = true;
    try {
      await access(callbackJournalLockPath, fsConstants.F_OK);
    } catch {
      callbackJournalLockRetained = false;
    }
    if (callbackJournalFailure.code !== "STAGE_RECOVERY_REQUIRED"
      || callbackJournalExecutions !== 1
      || callbackJournalAppends !== 3
      || callbackJournalEvents.length !== 1
      || callbackJournalEvents[0].state !== "running"
      || callbackJournalEvents[0].actionStartAuthorized !== true
      || !callbackJournalLockRetained) {
      throw new Error("callback post-action journal fail-stuck case failed");
    }
    cases += 1;

    const callbackJournalReplay = await executeCallbackFixture(
      callbackJournalDefinition,
      callbackJournalEntry,
      async () => {
        callbackJournalExecutions += 1;
        return null;
      },
      { runtimeRoot: callbackJournalRuntimeRoot },
    );
    if (callbackJournalReplay.code !== "STAGE_LOCK_UNAVAILABLE" || callbackJournalExecutions !== 1) {
      throw new Error("callback fail-stuck replay lock case failed");
    }
    cases += 1;

    const callbackJournalDurabilityDefinition = definitionFor({
      suffix: "CALLBACK-JOURNAL-DIRSYNC-FAIL-STUCK",
      moduleId: "eng.callback-journal-dirsync-fail-stuck",
      argumentSetId: "callback-journal-dirsync-fail-stuck.v1",
    });
    const callbackJournalDurabilityEntry = await callbackEntryFor(callbackJournalDurabilityDefinition);
    const callbackJournalDurabilityRuntimeRoot = path.join(root, "callback-journal-dirsync-fail-stuck-runtime");
    let callbackJournalDurabilityExecutions = 0;
    let callbackJournalDurabilitySyncAttempts = 0;
    const appendRecoveryThenReportFailure = async (directory, sequence, event) => {
      const eventPath = await appendEvent(directory, sequence, event);
      if (sequence === 2 && event.state === "recovery-required") {
        throw new Error("synthetic final event-directory fsync uncertainty");
      }
      return eventPath;
    };
    const callbackJournalDurabilityFailure = await executeCallbackFixture(
      callbackJournalDurabilityDefinition,
      callbackJournalDurabilityEntry,
      async () => {
        callbackJournalDurabilityExecutions += 1;
        return undefined;
      },
      {
        runtimeRoot: callbackJournalDurabilityRuntimeRoot,
        appendJournalEvent: appendRecoveryThenReportFailure,
        syncEventDirectory: async () => {
          callbackJournalDurabilitySyncAttempts += 1;
          throw new Error("synthetic event-directory fsync failure");
        },
      },
    );
    const callbackJournalDurabilityKey = safeRuntimeSegment(`${callbackJournalDurabilityDefinition.taskId}\0${callbackJournalDurabilityDefinition.stageId}\0${callbackJournalDurabilityDefinition.idempotencyKey}`);
    const callbackJournalDurabilityLockPath = path.join(
      callbackJournalDurabilityRuntimeRoot,
      "locks",
      `${callbackJournalDurabilityKey}.lock`,
    );
    const callbackJournalDurabilityEvents = await readEvents(path.join(
      callbackJournalDurabilityRuntimeRoot,
      callbackJournalDurabilityKey,
      "events",
    ));
    let callbackJournalDurabilityLockRetained = true;
    try {
      await access(callbackJournalDurabilityLockPath, fsConstants.F_OK);
    } catch {
      callbackJournalDurabilityLockRetained = false;
    }
    if (callbackJournalDurabilityFailure.code !== "STAGE_RECOVERY_REQUIRED"
      || callbackJournalDurabilityExecutions !== 1
      || callbackJournalDurabilitySyncAttempts !== 1
      || callbackJournalDurabilityEvents.map((event) => event.state).join(",") !== "running,recovery-required"
      || !callbackJournalDurabilityLockRetained) {
      throw new Error("callback written-but-unproven journal durability case failed");
    }
    cases += 1;

    const callbackJournalDurabilityReplay = await executeCallbackFixture(
      callbackJournalDurabilityDefinition,
      callbackJournalDurabilityEntry,
      async () => {
        callbackJournalDurabilityExecutions += 1;
        return null;
      },
      { runtimeRoot: callbackJournalDurabilityRuntimeRoot },
    );
    if (callbackJournalDurabilityReplay.code !== "STAGE_LOCK_UNAVAILABLE"
      || callbackJournalDurabilityExecutions !== 1) {
      throw new Error("callback unproven-durability replay lock case failed");
    }
    cases += 1;

    const callbackJournalFileSyncDefinition = definitionFor({
      suffix: "CALLBACK-JOURNAL-FILESYNC-FAIL-STUCK",
      moduleId: "eng.callback-journal-filesync-fail-stuck",
      argumentSetId: "callback-journal-filesync-fail-stuck.v1",
    });
    const callbackJournalFileSyncEntry = await callbackEntryFor(callbackJournalFileSyncDefinition);
    const callbackJournalFileSyncRuntimeRoot = path.join(root, "callback-journal-filesync-fail-stuck-runtime");
    let callbackJournalFileSyncExecutions = 0;
    let callbackJournalFileSyncAttempts = 0;
    let callbackJournalFileSyncDirectoryAttempts = 0;
    const appendCompleteRecoveryThenThrow = async (directory, sequence, event) => {
      const eventPath = await appendEvent(directory, sequence, event);
      if (sequence === 2 && event.state === "recovery-required") {
        throw new Error("synthetic complete write with uncertain file fsync");
      }
      return eventPath;
    };
    const callbackJournalFileSyncFailure = await executeCallbackFixture(
      callbackJournalFileSyncDefinition,
      callbackJournalFileSyncEntry,
      async () => {
        callbackJournalFileSyncExecutions += 1;
        return undefined;
      },
      {
        runtimeRoot: callbackJournalFileSyncRuntimeRoot,
        appendJournalEvent: appendCompleteRecoveryThenThrow,
        syncEventFile: async () => {
          callbackJournalFileSyncAttempts += 1;
          throw new Error("synthetic journal tail file fsync failure");
        },
        syncEventDirectory: async (directory) => {
          callbackJournalFileSyncDirectoryAttempts += 1;
          return syncDirectory(directory);
        },
      },
    );
    const callbackJournalFileSyncKey = safeRuntimeSegment(`${callbackJournalFileSyncDefinition.taskId}\0${callbackJournalFileSyncDefinition.stageId}\0${callbackJournalFileSyncDefinition.idempotencyKey}`);
    const callbackJournalFileSyncLockPath = path.join(
      callbackJournalFileSyncRuntimeRoot,
      "locks",
      `${callbackJournalFileSyncKey}.lock`,
    );
    const callbackJournalFileSyncEvents = await readEvents(path.join(
      callbackJournalFileSyncRuntimeRoot,
      callbackJournalFileSyncKey,
      "events",
    ));
    let callbackJournalFileSyncLockRetained = true;
    try {
      await access(callbackJournalFileSyncLockPath, fsConstants.F_OK);
    } catch {
      callbackJournalFileSyncLockRetained = false;
    }
    if (callbackJournalFileSyncFailure.code !== "STAGE_RECOVERY_REQUIRED"
      || callbackJournalFileSyncExecutions !== 1
      || callbackJournalFileSyncAttempts !== 1
      || callbackJournalFileSyncDirectoryAttempts !== 0
      || callbackJournalFileSyncEvents.map((event) => event.state).join(",") !== "running,recovery-required"
      || !callbackJournalFileSyncLockRetained) {
      throw new Error("callback readable-but-file-fsync-unproven journal case failed");
    }
    cases += 1;

    const callbackJournalFileSyncReplay = await executeCallbackFixture(
      callbackJournalFileSyncDefinition,
      callbackJournalFileSyncEntry,
      async () => {
        callbackJournalFileSyncExecutions += 1;
        return null;
      },
      { runtimeRoot: callbackJournalFileSyncRuntimeRoot },
    );
    if (callbackJournalFileSyncReplay.code !== "STAGE_LOCK_UNAVAILABLE"
      || callbackJournalFileSyncExecutions !== 1) {
      throw new Error("callback file-fsync-unproven replay lock case failed");
    }
    cases += 1;

    const callbackPendingFileSyncDefinition = definitionFor({
      suffix: "CALLBACK-PENDING-FILESYNC-FAIL-STUCK",
      moduleId: "eng.callback-pending-filesync-fail-stuck",
      argumentSetId: "callback-pending-filesync-fail-stuck.v1",
    });
    const callbackPendingFileSyncEntry = await callbackEntryFor(callbackPendingFileSyncDefinition);
    const callbackPendingFileSyncRuntimeRoot = path.join(root, "callback-pending-filesync-fail-stuck-runtime");
    let callbackPendingFileSyncExecutions = 0;
    let callbackPendingFileSyncAttempts = 0;
    let callbackPendingRecoveryAppendAttempts = 0;
    const appendPendingThenThrow = async (directory, sequence, event) => {
      if (event.state === "recovery-required") callbackPendingRecoveryAppendAttempts += 1;
      const eventPath = await appendEvent(directory, sequence, event);
      if (sequence === 2 && event.state === "verification-pending") {
        throw new Error("synthetic readable verification-pending file fsync uncertainty");
      }
      return eventPath;
    };
    const callbackPendingFileSyncFailure = await executeCallbackFixture(
      callbackPendingFileSyncDefinition,
      callbackPendingFileSyncEntry,
      async (context) => {
        callbackPendingFileSyncExecutions += 1;
        return callbackCompletionFor(callbackPendingFileSyncDefinition, context);
      },
      {
        runtimeRoot: callbackPendingFileSyncRuntimeRoot,
        appendJournalEvent: appendPendingThenThrow,
        syncEventFile: async () => {
          callbackPendingFileSyncAttempts += 1;
          throw new Error("synthetic verification-pending tail file fsync failure");
        },
      },
    );
    const callbackPendingFileSyncKey = safeRuntimeSegment(`${callbackPendingFileSyncDefinition.taskId}\0${callbackPendingFileSyncDefinition.stageId}\0${callbackPendingFileSyncDefinition.idempotencyKey}`);
    const callbackPendingFileSyncLockPath = path.join(
      callbackPendingFileSyncRuntimeRoot,
      "locks",
      `${callbackPendingFileSyncKey}.lock`,
    );
    const callbackPendingFileSyncEvents = await readEvents(path.join(
      callbackPendingFileSyncRuntimeRoot,
      callbackPendingFileSyncKey,
      "events",
    ));
    let callbackPendingFileSyncLockRetained = true;
    try {
      await access(callbackPendingFileSyncLockPath, fsConstants.F_OK);
    } catch {
      callbackPendingFileSyncLockRetained = false;
    }
    if (callbackPendingFileSyncFailure.code !== "STAGE_RECOVERY_REQUIRED"
      || callbackPendingFileSyncExecutions !== 1
      || callbackPendingFileSyncAttempts !== 1
      || callbackPendingRecoveryAppendAttempts !== 0
      || callbackPendingFileSyncEvents.map((event) => event.state).join(",") !== "running,verification-pending"
      || !callbackPendingFileSyncLockRetained) {
      throw new Error("callback verification-pending predecessor durability case failed");
    }
    cases += 1;

    const callbackPendingFileSyncReplay = await executeCallbackFixture(
      callbackPendingFileSyncDefinition,
      callbackPendingFileSyncEntry,
      async () => {
        callbackPendingFileSyncExecutions += 1;
        return null;
      },
      { runtimeRoot: callbackPendingFileSyncRuntimeRoot },
    );
    if (callbackPendingFileSyncReplay.code !== "STAGE_LOCK_UNAVAILABLE"
      || callbackPendingFileSyncExecutions !== 1) {
      throw new Error("callback verification-pending predecessor replay lock case failed");
    }
    cases += 1;

    const callbackInterruptedDefinition = definitionFor({
      suffix: "CALLBACK-INTERRUPTED",
      moduleId: "eng.callback-interrupted",
      argumentSetId: "callback-interrupted.v1",
    });
    const callbackInterruptedEntry = await callbackEntryFor(callbackInterruptedDefinition);
    const callbackInterruptedAuthorization = authorizationFor(callbackInterruptedDefinition, {
      moduleSha256: callbackInterruptedEntry.moduleSha256,
    });
    const callbackInterruptedKey = safeRuntimeSegment(`${callbackInterruptedDefinition.taskId}\0${callbackInterruptedDefinition.stageId}\0${callbackInterruptedDefinition.idempotencyKey}`);
    const callbackInterruptedEvents = path.join(runtimeRoot, callbackInterruptedKey, "events");
    await mkdir(callbackInterruptedEvents, { recursive: true });
    await appendEvent(callbackInterruptedEvents, 1, {
      schemaVersion: callbackInterruptedDefinition.schemaVersion,
      state: "running",
      occurredAt: new Date().toISOString(),
      processGroupId: null,
      sourceRevision: callbackInterruptedAuthorization.sourceRevision,
      stageBindingDigest: stageBindingDigest(callbackInterruptedDefinition),
      executorSha256: callbackInterruptedEntry.moduleSha256,
    });
    let callbackInterruptedRan = false;
    const callbackInterrupted = await executeCallbackFixture(
      callbackInterruptedDefinition,
      callbackInterruptedEntry,
      async () => {
        callbackInterruptedRan = true;
        return null;
      },
      { authorization: callbackInterruptedAuthorization },
    );
    if (callbackInterrupted.code !== "STAGE_RECOVERY_REQUIRED" || callbackInterruptedRan) {
      throw new Error("callback interrupted-journal recovery case failed");
    }
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
