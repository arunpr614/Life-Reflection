import crypto from "node:crypto";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { open, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { TextDecoder } from "node:util";
import { inflateRawSync } from "node:zlib";
import {
  APPROVAL_REGISTRY_PATH,
  ARTIFACT_KINDS,
  DELIVERY_TRANSITION_GATE_B_CONTRACT,
  READINESS_SCHEMA_VERSION,
  SCOPE_ACTION_COMPATIBILITY,
  STAGE_EXECUTION_SCHEMA_VERSION,
  TASK_FILE_DESCENDANT_DELTA_PATHS,
  TASK_FILE_DIFF_EXCLUSIONS,
  canonicalJson,
  classifyLocalSyntheticTaskFile,
  computeReviewerRegistrySha256,
  computeTaskContractSha256,
  computeTaskFilesSha256,
  computeTaskOwnerActionStateSha256,
  evaluateReadiness,
  evaluateStageExecutionGateB,
  isDedicatedDeliveryTransitionScopeAction,
  parseArtifactControlMarkers,
  validateTaskFilesManifest,
} from "./P0-readiness-gates.mjs";
import { parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";
import {
  hasExactKeys,
  inspectPublicTextBytes,
  publicTextBytesAreSafe,
} from "./P0-content-safety.mjs";
import {
  CANONICAL_ORIGIN_URL,
  verifyExactMainPreflight,
  verifyExactMainStillCurrent,
} from "./P0-exact-main.mjs";
import {
  MAX_SERIALIZABLE_STAGE_DEADLINE_MS,
  resolveProductionStagedAction,
  verifyStageApprovalRegistryContinuity,
  verifyStageApprovalRegistryHistory,
} from "./P0-staged-actions.mjs";

export { CANONICAL_ORIGIN_URL, verifyExactMainPreflight };

const DEFAULT_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FULL_REVISION = /^[0-9a-f]{40}$/;
const TASK_ID = /^[A-Z0-9]+(?:-[A-Z0-9]+)+$/;
const DEFAULT_CALLBACK_DEADLINE_MS = 5 * 60 * 1000;

const DOCUMENT_PATHS = Object.freeze({
  register: "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json",
  manifest: "docs/project/PHASE1-ROADMAP-MANIFEST.json",
  readinessState: "docs/project/P0-PHASE1-TASK-READINESS-STATE.json",
  reviewerRegistry: "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json",
  approvalRegistry: APPROVAL_REGISTRY_PATH,
  ownerActionState: "docs/council/execution/P0-OWNER-ACTION-STATE.json",
});

const messages = Object.freeze({
  PREFLIGHT_ORIGIN_URL: [
    "The origin remote is not the canonical public repository URL.",
    "Set origin to the canonical HTTPS URL and retry.",
  ],
  PREFLIGHT_FETCH: [
    "The fresh origin/main fetch did not complete.",
    "Restore public Git access and retry the exact-main preflight.",
  ],
  PREFLIGHT_DETACHED: [
    "The checkout is detached.",
    "Use a non-detached branch whose upstream is origin/main.",
  ],
  PREFLIGHT_UPSTREAM: [
    "The current branch does not track origin/main.",
    "Set the current branch upstream to origin/main and retry.",
  ],
  PREFLIGHT_DIRTY: [
    "The checkout contains staged, unstaged, or untracked changes.",
    "Use a clean isolated checkout and retry.",
  ],
  PREFLIGHT_REVISION: [
    "The local or fetched main revision is unavailable or malformed.",
    "Refresh the repository references and retry.",
  ],
  PREFLIGHT_EXACT_MAIN: [
    "HEAD is not the freshly fetched origin/main revision.",
    "Update the tracking checkout to exact origin/main and retry.",
  ],
  PREFLIGHT_STRUCTURAL_VALIDATION: [
    "The structural execution-control validator did not pass.",
    "Resolve the public control validation findings before synchronization or task start.",
  ],
  TASK_ID_INVALID: [
    "The task ID is missing or malformed.",
    "Supply the canonical stable task ID with --task.",
  ],
  TASK_CONTROL_DOCUMENT_UNAVAILABLE: [
    "A required public control document is missing or malformed.",
    "Restore the generated control documents from exact origin/main and retry.",
  ],
  TASK_REGISTER_RECORD_MISSING: [
    "The task has no unique artifact-register record.",
    "Regenerate and validate the task artifact register.",
  ],
  TASK_REGISTER_PERMISSION_DENIED: [
    "The artifact register does not permit this task to start.",
    "Complete the exact-candidate approval gates and publish the derived permission.",
  ],
  TASK_APPROVAL_RECORD_MISSING: [
    "The task has no structured approval record.",
    "Publish the later candidate-bound approval record through normal review.",
  ],
  TASK_CANDIDATE_REVISION_INVALID: [
    "The approval record does not identify one valid candidate revision.",
    "Bind the approval record to one full candidate commit SHA.",
  ],
  TASK_CANDIDATE_BYTES_UNVERIFIED: [
    "The approved candidate bytes are unavailable, mismatched, or not on fetched main.",
    "Publish the exact candidate artifact bindings and refresh origin/main.",
  ],
  TASK_CANDIDATE_TASK_FILES_UNVERIFIED: [
    "The approved task-file manifest is incomplete, mismatched, or differs on fetched main.",
    "Publish one canonical candidate manifest for the task implementation, evidence, and six artifacts, then obtain fresh approval.",
  ],
  TASK_CANDIDATE_TASK_CONTRACT_UNVERIFIED: [
    "The candidate task contract is missing or differs from the approved/current task contract.",
    "Restore one immutable manifest task from candidate through approval or obtain a fresh candidate approval.",
  ],
  TASK_REQUESTED_ACTION_INVALID: [
    "The requested runtime scope or action is missing or unsupported.",
    "Supply one explicit compatible --scope and --action pair.",
  ],
  TASK_REQUESTED_ACTION_MISMATCH: [
    "The requested runtime scope or action differs from the approved task request.",
    "Use the exact approved scope and action or obtain a fresh candidate approval.",
  ],
  TASK_EXECUTION_CALLBACK_REQUIRED: [
    "Standalone authorization tokens and legacy task-wide callbacks are not issued by this verifier.",
    "Use executeStageFromExactMain only with its exact code-owned reviewed callback, or use the serializable stage runner.",
  ],
  TASK_BOUNDED_ACTION_FAILED: [
    "The bounded action did not complete successfully.",
    "Inspect the public action result, repair the failure, and rerun the full preflight.",
  ],
  TASK_BOUNDED_ACTION_DEADLINE_EXCEEDED: [
    "The callback deadline elapsed; cancellation was requested and the execution lock was retained until callback settlement.",
    "Confirm the settled callback left no work in flight, then rerun the full preflight.",
  ],
  TASK_EXECUTION_LOCK_UNAVAILABLE: [
    "The bounded execution lock could not be acquired.",
    "Wait for the active guarded execution to finish, remove only a confirmed stale lock, and rerun the full preflight.",
  ],
  TASK_PRODUCTION_OPTIONS_INVALID: [
    "The production execution request contains unsupported or injectable options.",
    "Use one closed staged runner; arbitrary or module-mismatched in-process callbacks are not accepted.",
  ],
  TASK_SERIALIZABLE_RUNNER_REQUIRED: [
    "Legacy task-wide in-process execution is disabled.",
    "Use executeStageFromExactMain for one code-owned reviewed short callback, or the serializable stage runner for long or process work.",
  ],
  APPROVAL_PUBLICATION_INPUT_INVALID: [
    "Approval publication input is missing or malformed.",
    "Use the canonical task record, candidate revision, registry path, and fetched-main revision.",
  ],
  APPROVAL_PUBLICATION_CANDIDATE_SELF_REFERENCE: [
    "The candidate already contains a task approval record.",
    "Publish approval in a distinct later commit after candidate review.",
  ],
  APPROVAL_PUBLICATION_CURRENT_RECORD_MISMATCH: [
    "The supplied task approval differs from the record on fetched main.",
    "Reload the canonical approval registry from exact fetched main.",
  ],
  APPROVAL_PUBLICATION_HISTORY_MISSING: [
    "No later fetched-main commit first publishes the exact current task approval.",
    "Publish the task approval through normal review after the candidate.",
  ],
  APPROVAL_PUBLICATION_HISTORY_REWRITE: [
    "The task approval record was introduced early, replaced, removed, or later restored.",
    "Use one append-only per-task approval record after the candidate; never replace or version it in place.",
  ],
  APPROVAL_PUBLICATION_BYTES_MISMATCH: [
    "Approval registry bytes at the publication commit could not be verified.",
    "Restore the exact canonical registry bytes and retry from fetched main.",
  ],
  APPROVAL_PUBLICATION_ANCESTRY_INVALID: [
    "Candidate, approval publication, and fetched main do not have the required ancestry.",
    "Publish approval as a descendant of the candidate and an ancestor of fetched main.",
  ],
  APPROVAL_PUBLICATION_REVIEWER_STATE_MISMATCH: [
    "The approval-time reviewer registry differs from the current evaluated registry.",
    "Re-review the task after any reviewer-registry change.",
  ],
  APPROVAL_PUBLICATION_OWNER_ACTION_STATE_MISMATCH: [
    "Task-relevant owner-action evidence differs from its approval-time state.",
    "Publish a new task approval after any relevant owner-action evidence change.",
  ],
  APPROVAL_PUBLICATION_TASK_CONTRACT_MISMATCH: [
    "The task contract differs from its approval-time manifest state.",
    "Publish a new approval after any outcome, requirement, dependency, acceptance, or scenario change.",
  ],
  TASK_EVALUATION_ADAPTER_UNAVAILABLE: [
    "The source-evidence evaluation adapter is unavailable.",
    "Restore the source-only task-input builder before task start.",
  ],
  TASK_RUNTIME_EVALUATION_FAILED: [
    "Runtime readiness evaluation could not complete.",
    "Repair the public control evidence or evaluator before task start.",
  ],
  TASK_RUNTIME_PERMISSION_DENIED: [
    "Runtime readiness evaluation denied task start.",
    "Resolve every reported gate and rerun from exact origin/main.",
  ],
});

function pass(code, scope, details = {}) {
  return { ok: true, scope, code, ...details };
}

function fail(code, scope, details = {}) {
  const [message, correctiveAction] = messages[code] ?? [
    "The execution-start preflight failed closed.",
    "Inspect the public control state and retry.",
  ];
  return { ok: false, scope, code, message, correctiveAction, ...details };
}

function defaultRun(command, args, { cwd, encoding = "utf8" }) {
  const result = spawnSync(command, args, {
    cwd,
    ...(encoding === null ? {} : { encoding }),
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    maxBuffer: 8 * 1024 * 1024,
  });
  return {
    ok: !result.error && result.status === 0,
    stdout: typeof result.stdout === "string" || Buffer.isBuffer(result.stdout)
      ? result.stdout
      : encoding === null ? Buffer.alloc(0) : "",
  };
}

async function invoke(run, command, args, options) {
  try {
    const result = await run(command, args, options);
    const rawStdout = result?.stdout;
    const stdout = options?.encoding === null
      ? Buffer.isBuffer(rawStdout)
        ? rawStdout
        : typeof rawStdout === "string" ? Buffer.from(rawStdout, "utf8") : Buffer.alloc(0)
      : typeof rawStdout === "string"
        ? rawStdout
        : Buffer.isBuffer(rawStdout) ? rawStdout.toString("utf8") : "";
    return {
      ok: result?.ok === true || result?.status === 0,
      stdout,
    };
  } catch {
    return { ok: false, stdout: options?.encoding === null ? Buffer.alloc(0) : "" };
  }
}

async function git(run, repoRoot, args, options = {}) {
  return invoke(run, "git", args, { cwd: repoRoot, ...options });
}

async function defaultWithExecutionLock({ repoRoot, run }, callback) {
  const commonDirResult = await git(run, repoRoot, [
    "rev-parse",
    "--path-format=absolute",
    "--git-common-dir",
  ]);
  const commonDir = oneLine(commonDirResult);
  if (!commonDirResult.ok || !path.isAbsolute(commonDir)) throw new Error("execution lock unavailable");
  const lockPath = path.join(commonDir, "P0-execution-start.lock");
  let handle;
  try {
    handle = await open(lockPath, "wx", 0o600);
    return await callback();
  } finally {
    if (handle) {
      await handle.close().catch(() => {});
      await unlink(lockPath).catch(() => {});
    }
  }
}

function oneLine(result) {
  return result.stdout.trim().split(/\r?\n/, 1)[0] ?? "";
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

const strictUtf8Decoder = new TextDecoder("utf-8", { fatal: true });

function decodeUtf8(value) {
  if (typeof value === "string") return value;
  if (!Buffer.isBuffer(value) && !(value instanceof Uint8Array)) throw new TypeError("bytes required");
  return strictUtf8Decoder.decode(value);
}

function sameBytes(left, right) {
  const leftBytes = Buffer.isBuffer(left) ? left : Buffer.from(left);
  const rightBytes = Buffer.isBuffer(right) ? right : Buffer.from(right);
  return leftBytes.equals(rightBytes);
}

export function inspectLocalSyntheticTextBytes(value) {
  return inspectPublicTextBytes(value);
}

export function localSyntheticTextBytesAreSafe(value) {
  return publicTextBytesAreSafe(value);
}

export function localSyntheticTaskFileBytesAreSafe(entry, value) {
  const classification = classifyLocalSyntheticTaskFile(entry);
  if (!classification.allowed) return false;
  if (classification.contentClass === "xlsx-workbook") return xlsxArchiveIsSafe(value);
  return classification.contentClass === "text" && localSyntheticTextBytesAreSafe(value);
}

function trustedNow(options) {
  let value;
  try {
    value = typeof options.clock === "function"
      ? options.clock()
      : options.now ?? new Date();
  } catch {
    return null;
  }
  if (value instanceof Date) {
    if (!Number.isFinite(value.getTime())) return null;
    value = value.toISOString();
  }
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) return null;
  return new Date(value).toISOString();
}

function callbackDeadline({ options, evaluationInput, now }) {
  const configuredDuration = options.callbackDeadlineMs ?? DEFAULT_CALLBACK_DEADLINE_MS;
  if (!Number.isSafeInteger(configuredDuration)
    || configuredDuration <= 0
    || configuredDuration > DEFAULT_CALLBACK_DEADLINE_MS) return null;
  const nowMs = Date.parse(now);
  if (!Number.isFinite(nowMs)) return null;
  let durationMs = configuredDuration;
  if (["private-execution", "release"].includes(evaluationInput.requestedScope?.scopeClass)) {
    const authorityWindowEnd = Date.parse(evaluationInput.privateAuthority?.windowEnd);
    if (Number.isFinite(authorityWindowEnd)) durationMs = Math.min(durationMs, authorityWindowEnd - nowMs);
  }
  if (!Number.isSafeInteger(durationMs) || durationMs <= 0) return null;
  return {
    durationMs,
    deadlineAt: new Date(nowMs + durationMs).toISOString(),
  };
}

function serializableStageDeadline({ options, evaluationInput, now, request, stage }) {
  const resolver = options.resolveStageDefinition ?? resolveProductionStagedAction;
  let definition;
  try {
    definition = resolver(request);
  } catch {
    return null;
  }
  const predecessorReceiptSha256 = definition?.predecessor?.receiptDigest ?? null;
  if (definition === null
    || typeof definition !== "object"
    || definition.taskId !== request.taskId
    || definition.stageId !== request.stageId
    || definition.scopeClass !== request.scopeClass
    || definition.actionClass !== request.actionClass
    || definition.idempotencyKey !== request.idempotencyKey
    || predecessorReceiptSha256 !== request.predecessorReceiptSha256
    || definition.moduleId !== stage.moduleId
    || `sha256:${sha256(canonicalJson(definition))}` !== stage.stageDefinitionSha256
    || !Number.isSafeInteger(definition.deadlineMs)
    || definition.deadlineMs < 1_000
    || definition.deadlineMs > MAX_SERIALIZABLE_STAGE_DEADLINE_MS) return null;
  const nowMs = Date.parse(now);
  if (!Number.isFinite(nowMs)) return null;
  let durationMs = definition.deadlineMs;
  if (["private-execution", "release"].includes(evaluationInput.requestedScope?.scopeClass)) {
    const authorityWindowEnd = Date.parse(evaluationInput.privateAuthority?.windowEnd);
    if (Number.isFinite(authorityWindowEnd)) durationMs = Math.min(durationMs, authorityWindowEnd - nowMs);
  }
  if (!Number.isSafeInteger(durationMs) || durationMs <= 0) return null;
  return {
    durationMs,
    deadlineAt: new Date(nowMs + durationMs).toISOString(),
  };
}

function canonicalAcceptanceScenarioIds(taskId) {
  return [
    ...["P-001", "P-002", "P-003"].map((suffix) => `${taskId}-${suffix}`),
    ...["T-001", "T-002", "T-003"].map((suffix) => `${taskId}-${suffix}`),
    ...["D-001", "D-002", "D-003"].map((suffix) => `${taskId}-${suffix}`),
    ...["QA-001", "QA-002", "QA-003", "QA-004", "QA-005", "QA-006"].map((suffix) => `${taskId}-${suffix}`),
  ];
}

function oneManifestTask(manifest, taskId) {
  const matches = Array.isArray(manifest?.tasks)
    ? manifest.tasks.filter((task) => task?.id === taskId)
    : [];
  return matches.length === 1 ? matches[0] : null;
}

function manifestTaskContract(task, taskId) {
  return {
    taskId,
    outcome: task?.description ?? task?.outcome ?? null,
    requirementIds: task?.requirementIds ?? [],
    dependencyIds: task?.dependencies ?? task?.dependencyIds ?? [],
    acceptanceEvidence: task?.acceptanceEvidence ?? null,
    acceptanceScenarioIds: canonicalAcceptanceScenarioIds(taskId),
  };
}

function canonicalTaskApproval(record) {
  if (record === null || typeof record !== "object" || Array.isArray(record)) return null;
  return canonicalJson(record);
}

function taskApprovalFromRegistryBytes(bytes, taskId) {
  try {
    const document = parseJsonWithoutDuplicateKeys(decodeUtf8(bytes), "approval registry");
    return document?.taskApprovals?.[taskId] ?? null;
  } catch {
    return undefined;
  }
}

function jsonObjectFromBytes(bytes) {
  try {
    const value = parseJsonWithoutDuplicateKeys(decodeUtf8(bytes), "governed control");
    return value !== null && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

async function gitObjectExists(run, repoRoot, objectName) {
  return (await git(run, repoRoot, ["cat-file", "-e", objectName])).ok;
}

async function gitFile(run, repoRoot, revision, relativePath) {
  const objectName = `${revision}:${relativePath}`;
  if (!await gitObjectExists(run, repoRoot, objectName)) return { exists: false, bytes: null };
  const result = await git(run, repoRoot, ["show", objectName], { encoding: null });
  return result.ok ? { exists: true, bytes: result.stdout } : { exists: true, bytes: null };
}

function nulFields(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
  if (bytes.length === 0) return [];
  if (bytes[bytes.length - 1] !== 0) return null;
  const fields = [];
  let start = 0;
  for (let index = 0; index < bytes.length; index += 1) {
    if (bytes[index] !== 0) continue;
    fields.push(bytes.subarray(start, index));
    start = index + 1;
  }
  if (fields.at(-1)?.length === 0) fields.pop();
  return fields;
}

async function gitTreeBlob(run, repoRoot, revision, relativePath) {
  const tree = await git(run, repoRoot, ["ls-tree", "-z", revision, "--", relativePath], { encoding: null });
  if (!tree.ok) return { exists: false, bytes: null };
  const records = nulFields(tree.stdout);
  if (!records || records.length !== 1) return { exists: records?.length > 0, bytes: null };
  const separator = records[0].indexOf(9);
  if (separator < 0) return { exists: true, bytes: null };
  let header;
  let treePath;
  try {
    header = decodeUtf8(records[0].subarray(0, separator));
    treePath = decodeUtf8(records[0].subarray(separator + 1));
  } catch {
    return { exists: true, bytes: null };
  }
  const [gitMode, gitType, objectId, ...extra] = header.split(" ");
  if (extra.length > 0 || treePath !== relativePath || !/^[0-9a-f]{40,64}$/.test(objectId ?? "")) {
    return { exists: true, bytes: null };
  }
  const result = await git(run, repoRoot, ["show", `${revision}:${relativePath}`], { encoding: null });
  return result.ok
    ? { exists: true, bytes: result.stdout, gitMode, gitType }
    : { exists: true, bytes: null };
}

async function gitDiffPaths(run, repoRoot, fromRevision, toRevision, diffFilter = null) {
  const args = ["diff", "--name-only", "-z", "--no-renames"];
  if (diffFilter) args.push(`--diff-filter=${diffFilter}`);
  args.push(fromRevision, toRevision, "--");
  const result = await git(run, repoRoot, args, { encoding: null });
  if (!result.ok) return null;
  const fields = nulFields(result.stdout);
  if (!fields) return null;
  const paths = [];
  try {
    for (const field of fields) paths.push(decodeUtf8(field));
  } catch {
    return null;
  }
  return paths;
}

const CRC32_TABLE = Object.freeze(Array.from({ length: 256 }, (_, value) => {
  let current = value;
  for (let bit = 0; bit < 8; bit += 1) {
    current = (current >>> 1) ^ ((current & 1) ? 0xedb88320 : 0);
  }
  return current >>> 0;
}));

function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) value = CRC32_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

function zipExtraFieldsValid(bytes) {
  return bytes.length === 0;
}

function safeZipEntryName(name) {
  if (!name || name.includes("\\") || name.includes("\0") || name.startsWith("/") || /^[A-Za-z]:/.test(name)) {
    return false;
  }
  const segments = name.split("/");
  if (segments.some((segment, index) => (segment === "" && index !== segments.length - 1)
    || segment === "." || segment === "..")) return false;
  return /^(?:\[Content_Types\]\.xml|_rels\/\.rels|docProps\/(?:app|core|custom)\.xml|xl\/(?:workbook|styles|sharedStrings|calcChain|metadata)\.xml|xl\/_rels\/workbook\.xml\.rels|xl\/theme\/theme\d+\.xml|xl\/worksheets\/sheet\d+\.xml|xl\/worksheets\/_rels\/sheet\d+\.xml\.rels|xl\/drawings\/drawing\d+\.xml|xl\/drawings\/_rels\/drawing\d+\.xml\.rels|xl\/drawings\/charts\/chart\d+\.xml|xl\/tables\/table\d+\.xml)$/.test(name);
}

function decodeXmlEntities(value) {
  const withoutKnownEntities = value.replace(/&(?:#x[0-9a-f]+|#[0-9]+|amp|lt|gt|quot|apos);/gi, "");
  if (withoutKnownEntities.includes("&")) return null;
  let valid = true;
  const decoded = value.replace(/&(#x[0-9a-f]+|#[0-9]+|amp|lt|gt|quot|apos);/gi, (_match, entity) => {
    const lowered = entity.toLowerCase();
    if (lowered === "amp") return "&";
    if (lowered === "lt") return "<";
    if (lowered === "gt") return ">";
    if (lowered === "quot") return '"';
    if (lowered === "apos") return "'";
    const codePoint = lowered.startsWith("#x")
      ? Number.parseInt(lowered.slice(2), 16)
      : Number.parseInt(lowered.slice(1), 10);
    if (!Number.isInteger(codePoint) || codePoint <= 0 || codePoint > 0x10ffff
      || (codePoint >= 0xd800 && codePoint <= 0xdfff)) {
      valid = false;
      return "";
    }
    return String.fromCodePoint(codePoint);
  });
  if (!valid) return null;
  return decoded;
}

export function xlsxRelationshipXmlIsSafe(xml) {
  if (typeof xml !== "string" || /<!DOCTYPE|<!ENTITY/i.test(xml)) return false;
  const decoded = decodeXmlEntities(xml);
  if (decoded === null) return false;
  if (/TargetMode\s*=/iu.test(decoded)) return false;
  const tags = [...decoded.matchAll(/<\s*([^!?/\s>][^\s/>]*)([^>]*)>/gu)];
  for (const match of tags) {
    const qualifiedName = match[1];
    const nameParts = qualifiedName.split(":");
    if (nameParts.some((part) => part.length === 0) || nameParts.length > 2) return false;
    if (nameParts.at(-1)?.toLowerCase() !== "relationship") continue;
    const attributes = match[2];
    const targetMatches = [...attributes.matchAll(/(?:^|\s)((?:[^\s=:'"]+:)?Target)\s*=\s*(["'])(.*?)\2/giu)];
    if (targetMatches.length !== 1 || targetMatches[0][1] !== "Target") return false;
    const target = targetMatches[0][3].trim();
    if (!target || target.startsWith("//") || target.startsWith("\\\\")
      || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(target)
      || target.includes("\\") || target.split(/[?#]/, 1)[0].split("/").includes("..")) return false;
  }
  return true;
}

export function xlsxFormulaXmlIsSafe(xml) {
  if (typeof xml !== "string") return false;
  const decodedXml = decodeXmlEntities(xml);
  if (decodedXml === null) return false;
  const dangerousFunction = /(?:^|[^A-Za-z0-9_])(?:WEBSERVICE|RTD|HYPERLINK|IMAGE|STOCKHISTORY|SQL\.REQUEST|CALL|EXEC|EVALUATE|RUN|REGISTER(?:\.ID)?|GET\.[A-Z0-9_.]+|SET\.[A-Z0-9_.]+|FORMULA(?:\.FILL)?|FOPEN|FCLOSE|FREAD|FWRITE|FILES|DIRECTORY|SOUND|HALT|ALERT|GOTO|ON\.TIME|ON\.KEY|INDIRECT(?:\.EXT)?|CELL|INFO)\s*\(/iu;
  if (dangerousFunction.test(decodedXml) || /_xlnm\.Auto_[A-Za-z0-9_.-]+\b/iu.test(decodedXml)) return false;
  const allowedFunctions = new Set(["AND", "COUNTA", "COUNTIF", "COUNTIFS", "IF", "LEN", "OR", "SUBSTITUTE"]);
  const formulaPattern = /<\s*((?:[^<>\s/:]+:)?)(f|definedName|formula1|formula2|formula|calculatedColumnFormula|totalsRowFormula)(?:\s[^>]*)?>([\s\S]*?)<\s*\/\s*\1\2\s*>/giu;
  for (const match of xml.matchAll(formulaPattern)) {
    const formula = decodeXmlEntities(match[3]);
    if (formula === null) return false;
    const formulaWithoutStrings = formula.replace(/"(?:[^"]|"")*"/gu, '""');
    const functionNames = [...formulaWithoutStrings.matchAll(/(?:^|[^A-Za-z0-9_.])((?:_xlfn\.|_xlws\.)?[A-Za-z_][A-Za-z0-9_.]*)\s*\(/giu)]
      .map((functionMatch) => functionMatch[1].toUpperCase());
    if (dangerousFunction.test(formula)
      || functionNames.some((functionName) => !allowedFunctions.has(functionName))
      || /(?:https?|ftp|file):\/\/|(?:^|[^:])\/\/|\\\\/iu.test(formula)
      || /(?:^|[^A-Za-z0-9_])\[[^\]\r\n]+\][^!\r\n]*!/u.test(formula)
      || /\|[^!\r\n]*!/u.test(formula)) return false;
  }
  return true;
}

export function xlsxArchiveIsSafe(value) {
  try {
    const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
    if (bytes.length < 22 || bytes.length > 64 * 1024 * 1024) return false;
    const minimumEocdOffset = Math.max(0, bytes.length - 22 - 0xffff);
    const eocdOffsets = [];
    for (let offset = bytes.length - 22; offset >= minimumEocdOffset; offset -= 1) {
      if (bytes.readUInt32LE(offset) !== 0x06054b50) continue;
      const commentLength = bytes.readUInt16LE(offset + 20);
      if (commentLength === 0 && offset + 22 === bytes.length) eocdOffsets.push(offset);
    }
    if (eocdOffsets.length !== 1) return false;
    const eocdOffset = eocdOffsets[0];
    const diskNumber = bytes.readUInt16LE(eocdOffset + 4);
    const centralDisk = bytes.readUInt16LE(eocdOffset + 6);
    const entriesOnDisk = bytes.readUInt16LE(eocdOffset + 8);
    const totalEntries = bytes.readUInt16LE(eocdOffset + 10);
    const centralSize = bytes.readUInt32LE(eocdOffset + 12);
    const centralOffset = bytes.readUInt32LE(eocdOffset + 16);
    if (diskNumber !== 0 || centralDisk !== 0 || entriesOnDisk !== totalEntries
      || totalEntries < 3 || totalEntries > 512
      || totalEntries === 0xffff || centralSize === 0xffffffff || centralOffset === 0xffffffff
      || centralOffset + centralSize !== eocdOffset) return false;

    const entries = new Map();
    const localSpans = [];
    let totalUncompressed = 0;
    let cursor = centralOffset;
    for (let index = 0; index < totalEntries; index += 1) {
      if (cursor + 46 > eocdOffset || bytes.readUInt32LE(cursor) !== 0x02014b50) return false;
      const flags = bytes.readUInt16LE(cursor + 8);
      const method = bytes.readUInt16LE(cursor + 10);
      const expectedCrc = bytes.readUInt32LE(cursor + 16);
      const compressedSize = bytes.readUInt32LE(cursor + 20);
      const uncompressedSize = bytes.readUInt32LE(cursor + 24);
      const nameLength = bytes.readUInt16LE(cursor + 28);
      const extraLength = bytes.readUInt16LE(cursor + 30);
      const commentLength = bytes.readUInt16LE(cursor + 32);
      const startDisk = bytes.readUInt16LE(cursor + 34);
      const localOffset = bytes.readUInt32LE(cursor + 42);
      const recordEnd = cursor + 46 + nameLength + extraLength + commentLength;
      if (recordEnd > eocdOffset || commentLength !== 0 || startDisk !== 0 || (flags & ~0x0800) !== 0
        || ![0, 8].includes(method)
        || compressedSize === 0xffffffff || uncompressedSize === 0xffffffff
        || uncompressedSize > 8 * 1024 * 1024
        || totalUncompressed + uncompressedSize > 32 * 1024 * 1024
        || (uncompressedSize > 0 && (compressedSize === 0 || uncompressedSize / compressedSize > 100))) {
        return false;
      }
      const nameBytes = bytes.subarray(cursor + 46, cursor + 46 + nameLength);
      if ([...nameBytes].some((byte) => byte < 0x20 || byte > 0x7e)) return false;
      const name = nameBytes.toString("ascii");
      const centralExtra = bytes.subarray(cursor + 46 + nameLength, cursor + 46 + nameLength + extraLength);
      if (!safeZipEntryName(name) || entries.has(name) || !zipExtraFieldsValid(centralExtra)) return false;
      if (localOffset + 30 > centralOffset || bytes.readUInt32LE(localOffset) !== 0x04034b50) return false;
      const localFlags = bytes.readUInt16LE(localOffset + 6);
      const localMethod = bytes.readUInt16LE(localOffset + 8);
      const localCrc = bytes.readUInt32LE(localOffset + 14);
      const localCompressedSize = bytes.readUInt32LE(localOffset + 18);
      const localUncompressedSize = bytes.readUInt32LE(localOffset + 22);
      const localNameLength = bytes.readUInt16LE(localOffset + 26);
      const localExtraLength = bytes.readUInt16LE(localOffset + 28);
      const localNameStart = localOffset + 30;
      const localNameEnd = localNameStart + localNameLength;
      const localExtraEnd = localNameEnd + localExtraLength;
      const dataEnd = localExtraEnd + compressedSize;
      if (localFlags !== flags || localMethod !== method || localCrc !== expectedCrc
        || localCompressedSize !== compressedSize || localUncompressedSize !== uncompressedSize
        || localNameLength !== nameLength || dataEnd > centralOffset
        || !bytes.subarray(localNameStart, localNameEnd).equals(nameBytes)
        || !zipExtraFieldsValid(bytes.subarray(localNameEnd, localExtraEnd))) return false;
      const compressed = bytes.subarray(localExtraEnd, dataEnd);
      const content = method === 0
        ? Buffer.from(compressed)
        : inflateRawSync(compressed, { maxOutputLength: 8 * 1024 * 1024 + 1 });
      if (content.length !== uncompressedSize || crc32(content) !== expectedCrc) return false;
      totalUncompressed += uncompressedSize;
      entries.set(name, content);
      localSpans.push([localOffset, dataEnd]);
      cursor = recordEnd;
    }
    if (cursor !== eocdOffset) return false;
    localSpans.sort((left, right) => left[0] - right[0]);
    if (localSpans[0]?.[0] !== 0
      || localSpans.some((span, index) => index > 0 && localSpans[index - 1][1] !== span[0])
      || localSpans.at(-1)?.[1] !== centralOffset) return false;
    for (const required of ["[Content_Types].xml", "_rels/.rels", "xl/workbook.xml"]) {
      if (!entries.has(required)) return false;
    }

    const xmlEntries = [...entries].filter(([name]) => name.endsWith(".xml") || name.endsWith(".rels"));
    const decodedXml = new Map();
    for (const [name, content] of xmlEntries) {
      if (!localSyntheticTextBytesAreSafe(content)) return false;
      const xml = decodeUtf8(content);
      const decoded = decodeXmlEntities(xml);
      if (decoded === null) return false;
      const lowered = decoded.toLowerCase();
      if (lowered.includes("<!doctype") || lowered.includes("<!entity")
        || lowered.includes("macroenabled") || lowered.includes("vbaproject")
        || /<(?:[^<>\s/:]+:)?dde(?:link|items?|itemvalues?)\b/iu.test(decoded)
        || /<(?:[^<>\s/:]+:)?oleobject\b/iu.test(decoded)) return false;
      if (name.endsWith(".rels") && !xlsxRelationshipXmlIsSafe(xml)) return false;
      if (name.endsWith(".xml") && !xlsxFormulaXmlIsSafe(xml)) return false;
      decodedXml.set(name, decoded);
    }
    const contentTypesXml = decodedXml.get("[Content_Types].xml") ?? "";
    const contentTypes = contentTypesXml.toLowerCase();
    const allowedContentTypes = new Set([
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
      "application/vnd.openxmlformats-package.relationships+xml",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml",
      "application/vnd.openxmlformats-officedocument.theme+xml",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
      "application/vnd.openxmlformats-officedocument.drawing+xml",
      "application/vnd.openxmlformats-officedocument.drawingml.chart+xml",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml",
      "application/vnd.openxmlformats-package.core-properties+xml",
      "application/vnd.openxmlformats-officedocument.extended-properties+xml",
      "application/vnd.openxmlformats-officedocument.custom-properties+xml",
    ]);
    const declaredContentTypes = [...contentTypesXml.matchAll(/\bContentType\s*=\s*(["'])(.*?)\1/giu)]
      .map((match) => match[2].toLowerCase());
    const declaredParts = [...contentTypesXml.matchAll(/\bPartName\s*=\s*(["'])(.*?)\1/giu)]
      .map((match) => match[2].replace(/^\//, ""));
    const declaredExtensions = [...contentTypesXml.matchAll(/\bExtension\s*=\s*(["'])(.*?)\1/giu)]
      .map((match) => match[2].toLowerCase());
    return contentTypes.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml")
      && !contentTypes.includes("macroenabled")
      && declaredContentTypes.length > 0
      && declaredContentTypes.every((contentType) => allowedContentTypes.has(contentType))
      && declaredExtensions.every((extension) => ["xml", "rels"].includes(extension))
      && declaredParts.every((partName) => safeZipEntryName(partName) && entries.has(partName));
  } catch {
    return false;
  }
}

/** Canonical non-authorizing projection for tasks without verified Git facts. */
export function emptyCandidatePublicationFacts(candidate = {}) {
  return Object.freeze({
    revision: FULL_REVISION.test(candidate?.revision ?? "") ? candidate.revision : null,
    baseRevision: FULL_REVISION.test(candidate?.baseRevision ?? "") ? candidate.baseRevision : null,
    baseAncestorOfCandidate: false,
    candidateBytesVerified: false,
    candidateOnFetchedMain: false,
    candidateDiffTaskFilesSha256: null,
    candidateDiffExactMatchVerified: false,
    candidateDiffNoDeletionsVerified: false,
    candidateDiffExclusions: Object.freeze([...TASK_FILE_DIFF_EXCLUSIONS]),
    publishedTaskFilesSha256: null,
    currentTaskFilesSha256: null,
    publishedTaskFilesBytesVerified: false,
    currentTaskFilesBytesVerified: false,
    publishedTaskFilesModesVerified: false,
    currentTaskFilesModesVerified: false,
    taskFilesCoverageVerified: false,
    publishedTaskFileContentClassesVerified: false,
    currentTaskFileContentClassesVerified: false,
    publishedTaskFileArchivesVerified: false,
    currentTaskFileArchivesVerified: false,
    currentDescendantDeltaPathsVerified: false,
    currentDescendantDeltaNoDeletionsVerified: false,
    candidateTaskContractSha256: null,
    candidateTaskContractBytesVerified: false,
  });
}

/**
 * Derive immutable approval-publication facts from fetched Git history. The
 * publication binds one canonical task record, so unrelated later registry
 * appends do not invalidate an earlier approval.
 */
export async function deriveApprovalPublicationFacts({
  repoRoot = DEFAULT_REPO_ROOT,
  run = defaultRun,
  taskId,
  approvalRegistry,
  candidateRevision,
  publishedRef,
  reviewerRegistry,
  ownerActionState,
  ownerActionRequirements,
} = {}) {
  const resolvedRoot = path.resolve(repoRoot);
  const currentApproval = taskApproval(approvalRegistry, taskId);
  const currentCanonical = canonicalTaskApproval(currentApproval);
  if (!TASK_ID.test(taskId ?? "")
    || !FULL_REVISION.test(candidateRevision ?? "")
    || !FULL_REVISION.test(publishedRef ?? "")
    || currentCanonical === null
    || reviewerRegistry === null || typeof reviewerRegistry !== "object" || Array.isArray(reviewerRegistry)
    || ownerActionState === null || typeof ownerActionState !== "object" || Array.isArray(ownerActionState)
    || !Array.isArray(ownerActionRequirements)) {
    return fail("APPROVAL_PUBLICATION_INPUT_INVALID", "approval-publication", { taskId });
  }

  if (!await isAncestor(run, resolvedRoot, candidateRevision, publishedRef)) {
    return fail("APPROVAL_PUBLICATION_ANCESTRY_INVALID", "approval-publication", { taskId });
  }

  const candidateRegistry = await gitFile(run, resolvedRoot, candidateRevision, APPROVAL_REGISTRY_PATH);
  if (candidateRegistry.exists && candidateRegistry.bytes === null) {
    return fail("APPROVAL_PUBLICATION_BYTES_MISMATCH", "approval-publication", { taskId });
  }
  if (candidateRegistry.exists) {
    const candidateApproval = taskApprovalFromRegistryBytes(candidateRegistry.bytes, taskId);
    if (candidateApproval === undefined) {
      return fail("APPROVAL_PUBLICATION_BYTES_MISMATCH", "approval-publication", { taskId });
    }
    if (candidateApproval !== null) {
      return fail("APPROVAL_PUBLICATION_CANDIDATE_SELF_REFERENCE", "approval-publication", { taskId });
    }
  }

  const fetchedMainRegistry = await gitFile(run, resolvedRoot, publishedRef, APPROVAL_REGISTRY_PATH);
  if (!fetchedMainRegistry.exists || fetchedMainRegistry.bytes === null) {
    return fail("APPROVAL_PUBLICATION_BYTES_MISMATCH", "approval-publication", { taskId });
  }
  const fetchedMainApproval = taskApprovalFromRegistryBytes(fetchedMainRegistry.bytes, taskId);
  if (canonicalTaskApproval(fetchedMainApproval) !== currentCanonical) {
    return fail("APPROVAL_PUBLICATION_CURRENT_RECORD_MISMATCH", "approval-publication", { taskId });
  }

  const history = await git(run, resolvedRoot, [
    "rev-list",
    "--reverse",
    "--topo-order",
    "--ancestry-path",
    `${candidateRevision}..${publishedRef}`,
  ]);
  if (!history.ok) return fail("APPROVAL_PUBLICATION_HISTORY_MISSING", "approval-publication", { taskId });
  const revisions = history.stdout.split(/\r?\n/).map((revision) => revision.trim()).filter(Boolean);
  let publicationRevision = null;
  let publicationBytes = null;
  for (const revision of revisions) {
    if (!FULL_REVISION.test(revision)) {
      return fail("APPROVAL_PUBLICATION_HISTORY_MISSING", "approval-publication", { taskId });
    }
    const historicalRegistry = await gitFile(run, resolvedRoot, revision, APPROVAL_REGISTRY_PATH);
    const afterPublication = publicationRevision
      ? await isAncestor(run, resolvedRoot, publicationRevision, revision)
      : false;
    if (!historicalRegistry.exists || historicalRegistry.bytes === null) {
      if (afterPublication) {
        return fail("APPROVAL_PUBLICATION_HISTORY_REWRITE", "approval-publication", { taskId });
      }
      continue;
    }
    const historicalApproval = taskApprovalFromRegistryBytes(historicalRegistry.bytes, taskId);
    if (historicalApproval === undefined) {
      return fail("APPROVAL_PUBLICATION_BYTES_MISMATCH", "approval-publication", { taskId });
    }
    const historicalCanonical = canonicalTaskApproval(historicalApproval);
    if (!publicationRevision && historicalApproval !== null && historicalCanonical !== currentCanonical) {
      return fail("APPROVAL_PUBLICATION_HISTORY_REWRITE", "approval-publication", { taskId });
    }
    if (!publicationRevision && historicalCanonical === currentCanonical) {
      publicationRevision = revision;
      publicationBytes = historicalRegistry.bytes;
      continue;
    }
    if (publicationRevision && historicalApproval !== null && historicalCanonical !== currentCanonical) {
      return fail("APPROVAL_PUBLICATION_HISTORY_REWRITE", "approval-publication", { taskId });
    }
    if (afterPublication && historicalCanonical !== currentCanonical) {
      return fail("APPROVAL_PUBLICATION_HISTORY_REWRITE", "approval-publication", { taskId });
    }
  }
  if (!publicationRevision || publicationBytes === null) {
    return fail("APPROVAL_PUBLICATION_HISTORY_MISSING", "approval-publication", { taskId });
  }

  const verifiedRegistry = await gitFile(run, resolvedRoot, publicationRevision, APPROVAL_REGISTRY_PATH);
  if (!verifiedRegistry.exists || verifiedRegistry.bytes === null || !sameBytes(verifiedRegistry.bytes, publicationBytes)) {
    return fail("APPROVAL_PUBLICATION_BYTES_MISMATCH", "approval-publication", { taskId });
  }
  const verifiedApproval = taskApprovalFromRegistryBytes(verifiedRegistry.bytes, taskId);
  const publishedCanonical = canonicalTaskApproval(verifiedApproval);
  if (publishedCanonical !== currentCanonical) {
    return fail("APPROVAL_PUBLICATION_BYTES_MISMATCH", "approval-publication", { taskId });
  }

  const candidateAncestorOfApproval = await isAncestor(run, resolvedRoot, candidateRevision, publicationRevision);
  const approvalAncestorOfMain = await isAncestor(run, resolvedRoot, publicationRevision, publishedRef);
  if (!candidateAncestorOfApproval || !approvalAncestorOfMain) {
    return fail("APPROVAL_PUBLICATION_ANCESTRY_INVALID", "approval-publication", { taskId });
  }

  const reviewerPath = DOCUMENT_PATHS.reviewerRegistry;
  const publishedReviewerFile = await gitFile(run, resolvedRoot, publicationRevision, reviewerPath);
  const currentReviewerFile = await gitFile(run, resolvedRoot, publishedRef, reviewerPath);
  const publishedReviewerRegistry = publishedReviewerFile.bytes === null
    ? null
    : jsonObjectFromBytes(publishedReviewerFile.bytes);
  const currentReviewerRegistry = currentReviewerFile.bytes === null
    ? null
    : jsonObjectFromBytes(currentReviewerFile.bytes);
  if (!publishedReviewerFile.exists || !currentReviewerFile.exists
    || !publishedReviewerRegistry || !currentReviewerRegistry) {
    return fail("APPROVAL_PUBLICATION_REVIEWER_STATE_MISMATCH", "approval-publication", { taskId });
  }
  const publishedReviewerRegistrySha256 = computeReviewerRegistrySha256(publishedReviewerRegistry);
  const currentReviewerRegistrySha256 = computeReviewerRegistrySha256(currentReviewerRegistry);
  if (publishedReviewerRegistrySha256 !== currentReviewerRegistrySha256
    || currentReviewerRegistrySha256 !== computeReviewerRegistrySha256(reviewerRegistry)) {
    return fail("APPROVAL_PUBLICATION_REVIEWER_STATE_MISMATCH", "approval-publication", { taskId });
  }

  const ownerActionPath = DOCUMENT_PATHS.ownerActionState;
  const publishedOwnerActionFile = await gitFile(run, resolvedRoot, publicationRevision, ownerActionPath);
  const currentOwnerActionFile = await gitFile(run, resolvedRoot, publishedRef, ownerActionPath);
  const publishedOwnerActionState = publishedOwnerActionFile.bytes === null
    ? null
    : jsonObjectFromBytes(publishedOwnerActionFile.bytes);
  const currentOwnerActionState = currentOwnerActionFile.bytes === null
    ? null
    : jsonObjectFromBytes(currentOwnerActionFile.bytes);
  if (!publishedOwnerActionFile.exists || !currentOwnerActionFile.exists
    || !publishedOwnerActionState || !currentOwnerActionState) {
    return fail("APPROVAL_PUBLICATION_OWNER_ACTION_STATE_MISMATCH", "approval-publication", { taskId });
  }
  const ownerDigestInput = (records) => ({
    taskId,
    requirements: ownerActionRequirements,
    records,
  });
  const publishedOwnerActionStateSha256 = computeTaskOwnerActionStateSha256(ownerDigestInput(publishedOwnerActionState));
  const currentOwnerActionStateSha256 = computeTaskOwnerActionStateSha256(ownerDigestInput(currentOwnerActionState));
  if (publishedOwnerActionStateSha256 !== currentOwnerActionStateSha256
    || currentOwnerActionStateSha256 !== computeTaskOwnerActionStateSha256(ownerDigestInput(ownerActionState))) {
    return fail("APPROVAL_PUBLICATION_OWNER_ACTION_STATE_MISMATCH", "approval-publication", { taskId });
  }

  const manifestPath = DOCUMENT_PATHS.manifest;
  const publishedManifestFile = await gitFile(run, resolvedRoot, publicationRevision, manifestPath);
  const currentManifestFile = await gitFile(run, resolvedRoot, publishedRef, manifestPath);
  const publishedManifest = publishedManifestFile.bytes === null ? null : jsonObjectFromBytes(publishedManifestFile.bytes);
  const currentManifest = currentManifestFile.bytes === null ? null : jsonObjectFromBytes(currentManifestFile.bytes);
  const publishedTask = publishedManifest ? oneManifestTask(publishedManifest, taskId) : null;
  const currentTask = currentManifest ? oneManifestTask(currentManifest, taskId) : null;
  if (!publishedManifestFile.exists || !currentManifestFile.exists || !publishedTask || !currentTask) {
    return fail("APPROVAL_PUBLICATION_TASK_CONTRACT_MISMATCH", "approval-publication", { taskId });
  }
  const publishedTaskContractSha256 = computeTaskContractSha256(manifestTaskContract(publishedTask, taskId));
  const currentTaskContractSha256 = computeTaskContractSha256(manifestTaskContract(currentTask, taskId));
  if (publishedTaskContractSha256 !== currentTaskContractSha256) {
    return fail("APPROVAL_PUBLICATION_TASK_CONTRACT_MISMATCH", "approval-publication", { taskId });
  }

  const taskApprovalSha256 = sha256(currentCanonical);
  return pass("APPROVAL_PUBLICATION_OK", "approval-publication", {
    revision: publicationRevision,
    registryPath: APPROVAL_REGISTRY_PATH,
    registrySha256: sha256(verifiedRegistry.bytes),
    registryBytesVerified: true,
    taskId,
    publishedTaskApprovalSha256: taskApprovalSha256,
    currentTaskApprovalSha256: taskApprovalSha256,
    taskApprovalBytesVerified: true,
    publishedReviewerRegistrySha256,
    currentReviewerRegistrySha256,
    reviewerRegistryBytesVerified: true,
    publishedOwnerActionStateSha256,
    currentOwnerActionStateSha256,
    ownerActionStateBytesVerified: true,
    publishedTaskContractSha256,
    currentTaskContractSha256,
    taskContractBytesVerified: true,
    publishedOnFetchedMain: true,
    candidateAncestorOfApproval: true,
  });
}

export async function deriveCandidatePublicationFacts({
  repoRoot = DEFAULT_REPO_ROOT,
  run = defaultRun,
  taskId,
  candidate,
  registeredArtifacts,
  publishedRef,
  scopeClass,
} = {}) {
  const resolvedRoot = path.resolve(repoRoot);
  const revision = candidate?.revision;
  const baseRevision = candidate?.baseRevision;
  if (!TASK_ID.test(taskId ?? "")
    || !FULL_REVISION.test(revision ?? "")
    || !FULL_REVISION.test(baseRevision ?? "")
    || baseRevision === revision
    || !FULL_REVISION.test(publishedRef ?? "")) {
    return fail("TASK_CANDIDATE_BYTES_UNVERIFIED", "candidate-publication", { taskId });
  }
  const parents = await git(run, resolvedRoot, ["rev-list", "--parents", "-n", "1", revision]);
  const parentFields = parents.ok ? parents.stdout.trim().split(/\s+/) : [];
  const baseAncestorOfCandidate = parentFields.length === 2
    && parentFields[0] === revision
    && parentFields[1] === baseRevision
    && await isAncestor(run, resolvedRoot, baseRevision, revision);
  if (!baseAncestorOfCandidate || !await isAncestor(run, resolvedRoot, revision, publishedRef)) {
    return fail("TASK_CANDIDATE_BYTES_UNVERIFIED", "candidate-publication", { taskId });
  }

  for (const kind of ARTIFACT_KINDS) {
    const candidateBinding = candidate?.artifacts?.[kind];
    const registeredBinding = registeredArtifacts?.[kind];
    if (candidateBinding?.path !== registeredBinding?.path
      || candidateBinding?.sha256 !== registeredBinding?.sha256) {
      return fail("TASK_CANDIDATE_TASK_FILES_UNVERIFIED", "candidate-publication", { taskId });
    }
  }

  let taskFilesValidation;
  try {
    taskFilesValidation = validateTaskFilesManifest({
      taskId,
      taskFiles: candidate?.taskFiles,
      artifacts: candidate?.artifacts,
      scopeClass,
    });
  } catch {
    taskFilesValidation = null;
  }
  const taskFiles = candidate?.taskFiles;
  if (taskFilesValidation?.valid !== true
    || taskFilesValidation.sha256 !== candidate?.taskFilesSha256) {
    return fail("TASK_CANDIDATE_TASK_FILES_UNVERIFIED", "candidate-publication", { taskId });
  }

  const candidateDiffPaths = await gitDiffPaths(run, resolvedRoot, baseRevision, revision);
  const candidateForbiddenDiffPaths = await gitDiffPaths(run, resolvedRoot, baseRevision, revision, "DT");
  if (!candidateDiffPaths || !candidateForbiddenDiffPaths || candidateForbiddenDiffPaths.length > 0) {
    return fail("TASK_CANDIDATE_TASK_FILES_UNVERIFIED", "candidate-publication", { taskId });
  }
  const candidateManifestPaths = taskFiles.map((entry) => entry.path).sort();
  const candidateBoundDiffPaths = candidateDiffPaths
    .filter((entry) => !TASK_FILE_DIFF_EXCLUSIONS.includes(entry))
    .sort();
  if (new Set(candidateDiffPaths).size !== candidateDiffPaths.length
    || candidateBoundDiffPaths.length !== candidateManifestPaths.length
    || candidateBoundDiffPaths.some((entry, index) => entry !== candidateManifestPaths[index])) {
    return fail("TASK_CANDIDATE_TASK_FILES_UNVERIFIED", "candidate-publication", { taskId });
  }

  const publishedTaskFiles = [];
  const currentTaskFiles = [];
  let publishedTaskFileContentClassesVerified = scopeClass === "local-synthetic";
  let currentTaskFileContentClassesVerified = scopeClass === "local-synthetic";
  let publishedTaskFileArchivesVerified = scopeClass === "local-synthetic";
  let currentTaskFileArchivesVerified = scopeClass === "local-synthetic";
  for (const binding of taskFiles) {
    const publishedFile = await gitTreeBlob(run, resolvedRoot, revision, binding.path);
    const currentFile = await gitTreeBlob(run, resolvedRoot, publishedRef, binding.path);
    if (!publishedFile.exists || publishedFile.bytes === null
      || !currentFile.exists || currentFile.bytes === null) {
      return fail("TASK_CANDIDATE_TASK_FILES_UNVERIFIED", "candidate-publication", { taskId });
    }
    if (scopeClass === "local-synthetic") {
      const classification = classifyLocalSyntheticTaskFile(binding);
      publishedTaskFileContentClassesVerified &&= localSyntheticTaskFileBytesAreSafe(binding, publishedFile.bytes);
      currentTaskFileContentClassesVerified &&= localSyntheticTaskFileBytesAreSafe(binding, currentFile.bytes);
      if (classification.contentClass === "xlsx-workbook") {
        publishedTaskFileArchivesVerified &&= xlsxArchiveIsSafe(publishedFile.bytes);
        currentTaskFileArchivesVerified &&= xlsxArchiveIsSafe(currentFile.bytes);
      }
      if (!publishedTaskFileContentClassesVerified || !currentTaskFileContentClassesVerified
        || !publishedTaskFileArchivesVerified || !currentTaskFileArchivesVerified) {
        return fail("TASK_CANDIDATE_TASK_FILES_UNVERIFIED", "candidate-publication", { taskId });
      }
    }
    publishedTaskFiles.push({
      path: binding.path,
      sha256: sha256(publishedFile.bytes),
      purpose: binding.purpose,
      gitMode: publishedFile.gitMode,
      gitType: publishedFile.gitType,
    });
    currentTaskFiles.push({
      path: binding.path,
      sha256: sha256(currentFile.bytes),
      purpose: binding.purpose,
      gitMode: currentFile.gitMode,
      gitType: currentFile.gitType,
    });
  }
  const publishedTaskFilesSha256 = computeTaskFilesSha256(publishedTaskFiles);
  const currentTaskFilesSha256 = computeTaskFilesSha256(currentTaskFiles);
  const candidateDiffTaskFilesSha256 = computeTaskFilesSha256(publishedTaskFiles);
  if (publishedTaskFilesSha256 !== candidate.taskFilesSha256
    || currentTaskFilesSha256 !== candidate.taskFilesSha256
    || candidateDiffTaskFilesSha256 !== candidate.taskFilesSha256) {
    return fail("TASK_CANDIDATE_TASK_FILES_UNVERIFIED", "candidate-publication", { taskId });
  }

  const currentDescendantDeltaPaths = await gitDiffPaths(run, resolvedRoot, revision, publishedRef);
  const currentForbiddenDeltaPaths = await gitDiffPaths(run, resolvedRoot, revision, publishedRef, "DT");
  if (!currentDescendantDeltaPaths
    || !currentForbiddenDeltaPaths
    || currentForbiddenDeltaPaths.length > 0
    || new Set(currentDescendantDeltaPaths).size !== currentDescendantDeltaPaths.length
    || currentDescendantDeltaPaths.some((entry) => !TASK_FILE_DESCENDANT_DELTA_PATHS.includes(entry))) {
    return fail("TASK_CANDIDATE_TASK_FILES_UNVERIFIED", "candidate-publication", { taskId });
  }

  const candidateManifestFile = await gitFile(run, resolvedRoot, revision, DOCUMENT_PATHS.manifest);
  const candidateManifest = candidateManifestFile.bytes === null
    ? null
    : jsonObjectFromBytes(candidateManifestFile.bytes);
  const candidateManifestTask = candidateManifest ? oneManifestTask(candidateManifest, taskId) : null;
  if (!candidateManifestFile.exists || !candidateManifestTask) {
    return fail("TASK_CANDIDATE_TASK_CONTRACT_UNVERIFIED", "candidate-publication", { taskId });
  }
  const candidateTaskContractSha256 = computeTaskContractSha256(
    manifestTaskContract(candidateManifestTask, taskId),
  );
  if (candidateTaskContractSha256 !== candidate.taskContractSha256) {
    return fail("TASK_CANDIDATE_TASK_CONTRACT_UNVERIFIED", "candidate-publication", { taskId });
  }

  return pass("CANDIDATE_PUBLICATION_OK", "candidate-publication", {
    revision,
    baseRevision,
    baseAncestorOfCandidate: true,
    candidateBytesVerified: true,
    candidateOnFetchedMain: true,
    candidateDiffTaskFilesSha256,
    candidateDiffExactMatchVerified: true,
    candidateDiffNoDeletionsVerified: true,
    candidateDiffExclusions: [...TASK_FILE_DIFF_EXCLUSIONS],
    publishedTaskFilesSha256,
    currentTaskFilesSha256,
    publishedTaskFilesBytesVerified: true,
    currentTaskFilesBytesVerified: true,
    publishedTaskFilesModesVerified: true,
    currentTaskFilesModesVerified: true,
    taskFilesCoverageVerified: true,
    publishedTaskFileContentClassesVerified,
    currentTaskFileContentClassesVerified,
    publishedTaskFileArchivesVerified,
    currentTaskFileArchivesVerified,
    currentDescendantDeltaPathsVerified: true,
    currentDescendantDeltaNoDeletionsVerified: true,
    candidateTaskContractSha256,
    candidateTaskContractBytesVerified: true,
  });
}
async function defaultReadJson(repoRoot, relativePath, { run, revision }) {
  const file = await gitFile(run, repoRoot, revision, relativePath);
  if (!file.exists || file.bytes === null) throw new Error("snapshot document unavailable");
  return parseJsonWithoutDuplicateKeys(decodeUtf8(file.bytes), relativePath);
}

async function defaultLoadEvaluationInput(context) {
  const module = await import("./P0-build-task-readiness-input.mjs");
  if (typeof module.buildTaskReadinessInput !== "function") throw new Error("adapter unavailable");
  const task = context.manifest?.tasks?.find((entry) => entry?.id === context.taskId);
  const record = taskRecords(context.register, context.taskId)[0];
  if (!task || !record) throw new Error("task unavailable");
  const artifacts = {};
  for (const [kind, artifact] of Object.entries(record.artifacts ?? {})) {
    const snapshot = await gitFile(context.run, context.repoRoot, context.revision, artifact.path);
    if (!snapshot.exists || snapshot.bytes === null) throw new Error("snapshot artifact unavailable");
    const observedSha256 = sha256(snapshot.bytes);
    const content = decodeUtf8(snapshot.bytes);
    const markers = parseArtifactControlMarkers(content, {
      taskId: context.taskId,
      artifactKind: kind,
    });
    const contentState = markers.artifactState;
    artifacts[kind] = {
      path: artifact.path,
      contentState,
      sha256: artifact.sha256,
      observedSha256,
      markersValid: markers.valid,
    };
  }
  return module.buildTaskReadinessInput({
    task,
    artifacts,
    readinessState: context.readinessState,
    reviewerRegistry: context.reviewerRegistry,
    approvalRegistry: context.approvalRegistry,
    ownerActionState: context.ownerActionState,
    gitFacts: context.gitFacts,
    evaluationPhase: "activation",
  });
}

function taskRecords(register, taskId) {
  return Array.isArray(register?.tasks)
    ? register.tasks.filter((record) => record?.taskId === taskId)
    : [];
}

function taskApproval(approvalRegistry, taskId) {
  const record = approvalRegistry?.taskApprovals?.[taskId];
  return record !== null && typeof record === "object" && !Array.isArray(record) ? record : null;
}

function oneCandidateRevision(approval) {
  const values = [
    approval?.approvalRecord?.candidateRevision,
    approval?.candidate?.revision,
  ];
  const revisions = [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))];
  return revisions.length === 1 && FULL_REVISION.test(revisions[0]) ? revisions[0] : null;
}

async function isAncestor(run, repoRoot, revision, head) {
  const result = await git(run, repoRoot, ["merge-base", "--is-ancestor", revision, head]);
  return result.ok;
}

/**
 * Verify one task immediately before execution. Source evidence is rebuilt by
 * the injected/default adapter; generated register projections are used only as
 * an initial fail-closed permission assertion and are never the evaluation input.
 */
async function verifyTaskExecutionStartCore(taskId, options = {}) {
  if (!TASK_ID.test(taskId ?? "")) return fail("TASK_ID_INVALID", "task-start");
  const scopeClass = options.scopeClass;
  const actionClass = options.actionClass;
  if (typeof scopeClass !== "string"
    || typeof actionClass !== "string"
    || !SCOPE_ACTION_COMPATIBILITY[scopeClass]?.includes(actionClass)) {
    return fail("TASK_REQUESTED_ACTION_INVALID", "task-start", { taskId });
  }

  const repoRoot = path.resolve(options.repoRoot ?? DEFAULT_REPO_ROOT);
  const run = options.run ?? defaultRun;
  const exactMain = options.exactMainResult ?? await verifyExactMainPreflight({ ...options, repoRoot, run });
  if (exactMain?.ok !== true) return exactMain;

  const readJson = options.readJson ?? defaultReadJson;
  const documents = {};
  try {
    for (const [name, relativePath] of Object.entries(DOCUMENT_PATHS)) {
      documents[name] = await readJson(repoRoot, relativePath, {
        run,
        revision: exactMain.revision,
      });
    }
  } catch {
    return fail("TASK_CONTROL_DOCUMENT_UNAVAILABLE", "task-start", { taskId });
  }

  const records = taskRecords(documents.register, taskId);
  if (records.length !== 1) return fail("TASK_REGISTER_RECORD_MISSING", "task-start", { taskId });
  if (records[0].executionAllowed !== true) {
    return fail("TASK_REGISTER_PERMISSION_DENIED", "task-start", { taskId });
  }

  const approval = taskApproval(documents.approvalRegistry, taskId);
  if (!approval) return fail("TASK_APPROVAL_RECORD_MISSING", "task-start", { taskId });
  const candidateRevision = oneCandidateRevision(approval);
  if (!candidateRevision) return fail("TASK_CANDIDATE_REVISION_INVALID", "task-start", { taskId });

  const candidateResult = await deriveCandidatePublicationFacts({
    repoRoot,
    run,
    taskId,
    candidate: approval.candidate,
    registeredArtifacts: records[0].artifacts,
    publishedRef: exactMain.revision,
    scopeClass,
  });
  if (!candidateResult.ok) return candidateResult;
  const { ok: _candidateOk, code: _candidateCode, scope: _candidateScope, ...candidatePublication } = candidateResult;
  const candidateAncestorOfHead = candidatePublication.candidateOnFetchedMain === true;

  const context = {
    repoRoot,
    run,
    revision: exactMain.revision,
    taskId,
    register: documents.register,
    manifest: documents.manifest,
    readinessState: documents.readinessState,
    reviewerRegistry: documents.reviewerRegistry,
    approvalRegistry: documents.approvalRegistry,
    ownerActionState: documents.ownerActionState,
    gitFacts: {},
  };

  const loadEvaluationInput = options.loadEvaluationInput ?? defaultLoadEvaluationInput;
  let input;
  try {
    input = await loadEvaluationInput(context);
  } catch {
    return fail("TASK_EVALUATION_ADAPTER_UNAVAILABLE", "task-start", { taskId });
  }
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return fail("TASK_EVALUATION_ADAPTER_UNAVAILABLE", "task-start", { taskId });
  }
  if (input.requestedScope?.scopeClass !== scopeClass
    || input.requestedScope?.actionClass !== actionClass) {
    return fail("TASK_REQUESTED_ACTION_MISMATCH", "task-start", { taskId });
  }

  const approvalResult = await deriveApprovalPublicationFacts({
    repoRoot,
    run,
    taskId,
    approvalRegistry: documents.approvalRegistry,
    candidateRevision,
    publishedRef: exactMain.revision,
    reviewerRegistry: input.reviewerRegistry,
    ownerActionState: documents.ownerActionState,
    ownerActionRequirements: input.ownerActionRequirements,
  });
  if (!approvalResult.ok) return approvalResult;
  const { ok: _approvalOk, code: _approvalCode, scope: _approvalScope, ...approvalPublication } = approvalResult;
  if (candidatePublication.candidateTaskContractSha256 !== approvalPublication.publishedTaskContractSha256) {
    return fail("TASK_CANDIDATE_TASK_CONTRACT_UNVERIFIED", "task-start", { taskId });
  }
  const approvalRecordReachable = approvalPublication.publishedOnFetchedMain === true;
  const gitFacts = {
    ...exactMain.gitFacts,
    candidateRevision,
    approvalRevision: approvalPublication.revision,
    candidateAncestorOfHead,
    candidateReachableFromHead: candidateAncestorOfHead,
    approvalRecordReachable,
    approvalRecordReachableFromHead: approvalRecordReachable,
    candidateBytesVerified: candidatePublication.candidateBytesVerified,
    candidateOnFetchedMain: candidatePublication.candidateOnFetchedMain,
  };

  const activation = {
    fetchSucceeded: true,
    worktreeClean: gitFacts.checkoutClean === true,
    branch: gitFacts.branch,
    detached: gitFacts.detached,
    upstream: gitFacts.upstream,
    headRevision: gitFacts.head,
    originMainRevision: gitFacts.originMain,
    approvalRecordReachableFromHead: approvalRecordReachable,
    approvalPublicationRevision: approvalPublication.revision,
    candidateReachableFromHead: candidateAncestorOfHead,
    candidateRevision,
    taskFilesVerifiedAtRevision: exactMain.revision,
    runtimeRequestedScopeClass: scopeClass,
    runtimeRequestedActionClass: actionClass,
    externalSyncSourceRevision: gitFacts.head,
  };
  const evaluationInput = {
    ...input,
    evaluationPhase: "activation",
  };
  const evaluator = options.evaluate ?? evaluateReadiness;
  const evaluateAt = async (now) => {
    try {
      return await evaluator(evaluationInput, {
        phase: "activation",
        now,
        candidatePublication,
        approvalPublication,
        activation,
      });
    } catch {
      return null;
    }
  };
  const permissionFailure = (evaluation) => {
    const failedGateCodes = Array.isArray(evaluation?.gateResults)
      ? evaluation.gateResults.filter((gate) => gate?.passed !== true && typeof gate?.code === "string").map((gate) => gate.code)
      : [];
    return fail("TASK_RUNTIME_PERMISSION_DENIED", "task-start", { taskId, failedGateCodes });
  };

  const evaluationNow = trustedNow(options);
  if (evaluationNow === null) return fail("TASK_RUNTIME_EVALUATION_FAILED", "task-start", { taskId });
  const initialEvaluation = await evaluateAt(evaluationNow);
  if (initialEvaluation === null) return fail("TASK_RUNTIME_EVALUATION_FAILED", "task-start", { taskId });
  if (initialEvaluation.executionAllowed !== true) {
    return permissionFailure(initialEvaluation);
  }
  if (typeof options.execute !== "function") {
    return fail("TASK_EXECUTION_CALLBACK_REQUIRED", "task-start", { taskId });
  }

  const withExecutionLock = options.withExecutionLock ?? defaultWithExecutionLock;
  let guardedResult;
  try {
    guardedResult = await withExecutionLock({ repoRoot, run, taskId }, async () => {
      const finalExactMain = await verifyExactMainStillCurrent({
        repoRoot,
        run,
        expectedRevision: exactMain.revision,
      });
      if (!finalExactMain.ok) return { status: "preflight-failed", result: finalExactMain };

      const finalNow = trustedNow(options);
      if (finalNow === null) {
        return {
          status: "evaluation-failed",
          result: fail("TASK_RUNTIME_EVALUATION_FAILED", "task-start", { taskId }),
        };
      }
      const finalEvaluation = await evaluateAt(finalNow);
      if (finalEvaluation === null) {
        return {
          status: "evaluation-failed",
          result: fail("TASK_RUNTIME_EVALUATION_FAILED", "task-start", { taskId }),
        };
      }
      if (finalEvaluation.executionAllowed !== true) {
        return { status: "permission-denied", result: permissionFailure(finalEvaluation) };
      }

      const deadline = callbackDeadline({
        options,
        evaluationInput,
        now: finalNow,
      });
      if (deadline === null) {
        return {
          status: "action-deadline-exceeded",
          result: fail("TASK_BOUNDED_ACTION_DEADLINE_EXCEEDED", "task-start", { taskId }),
        };
      }
      const cancellation = new AbortController();
      const executionContext = Object.freeze({
        taskId,
        revision: exactMain.revision,
        scopeClass,
        actionClass,
        deadlineAt: deadline.deadlineAt,
        signal: cancellation.signal,
      });
      const callbackStartedAt = process.hrtime.bigint();
      const callbackDeadlineNanoseconds = BigInt(deadline.durationMs) * 1_000_000n;
      let deadlineReached = false;
      let deadlineHandle;
      const actionPromise = Promise.resolve()
        .then(() => options.execute(executionContext))
        .then(
          (result) => ({ status: "fulfilled", result }),
          () => ({ status: "rejected", result: null }),
        );
      const deadlinePromise = new Promise((resolve) => {
        deadlineHandle = setTimeout(() => {
          deadlineReached = true;
          resolve({ status: "deadline", result: null });
          cancellation.abort("callback-deadline-exceeded");
        }, deadline.durationMs);
      });
      const actionOutcome = await Promise.race([actionPromise, deadlinePromise]);
      clearTimeout(deadlineHandle);
      const callbackElapsedNanoseconds = process.hrtime.bigint() - callbackStartedAt;
      const callbackDeadlineExceeded = deadlineReached
        || actionOutcome.status === "deadline"
        || callbackElapsedNanoseconds >= callbackDeadlineNanoseconds;
      if (callbackDeadlineExceeded && !cancellation.signal.aborted) {
        cancellation.abort("callback-deadline-exceeded");
      }
      // An arbitrary in-process callback cannot be forcibly terminated. Once
      // the deadline wins, retain the execution lock and await settlement after
      // requesting cooperative cancellation. A callback that ignores abort and
      // never settles therefore leaves this verifier fail-stuck instead of
      // releasing the lock while unbounded work can continue.
      const settledActionOutcome = actionOutcome.status === "deadline"
        ? await actionPromise
        : actionOutcome;
      const deadlineFailure = (details = {}) => fail(
        "TASK_BOUNDED_ACTION_DEADLINE_EXCEEDED",
        "task-start",
        {
          taskId,
          callbackCancellationRequested: true,
          callbackSettlementObserved: true,
          executionLockRetainedUntilSettlement: true,
          ...details,
        },
      );
      if (settledActionOutcome.status !== "fulfilled") {
        if (callbackDeadlineExceeded) {
          return { status: "action-deadline-exceeded", result: deadlineFailure() };
        }
        cancellation.abort("callback-failed");
        return {
          status: "action-failed",
          result: fail("TASK_BOUNDED_ACTION_FAILED", "task-start", { taskId }),
        };
      }
      const actionResult = settledActionOutcome.result;
      const completionReceiptValid = actionResult !== null
        && typeof actionResult === "object"
        && !Array.isArray(actionResult)
        && Object.keys(actionResult).length === 1
        && actionResult.ok === true;
      if (!completionReceiptValid) {
        if (callbackDeadlineExceeded) {
          return { status: "action-deadline-exceeded", result: deadlineFailure() };
        }
        cancellation.abort("callback-receipt-rejected");
        return {
          status: "action-failed",
          result: fail("TASK_BOUNDED_ACTION_FAILED", "task-start", { taskId }),
        };
      }

      const completionExactMain = await verifyExactMainStillCurrent({
        repoRoot,
        run,
        expectedRevision: exactMain.revision,
      });
      if (!completionExactMain.ok) {
        cancellation.abort("callback-source-invalidated");
        if (callbackDeadlineExceeded) {
          return {
            status: "action-deadline-exceeded",
            result: deadlineFailure({ completionGuardCode: completionExactMain.code }),
          };
        }
        return { status: "completion-preflight-failed", result: completionExactMain };
      }

      const completionNow = trustedNow(options);
      if (completionNow === null) {
        cancellation.abort("callback-evaluation-invalidated");
        if (callbackDeadlineExceeded) {
          return {
            status: "action-deadline-exceeded",
            result: deadlineFailure({ completionGuardCode: "TASK_RUNTIME_EVALUATION_FAILED" }),
          };
        }
        return {
          status: "completion-evaluation-failed",
          result: fail("TASK_RUNTIME_EVALUATION_FAILED", "task-start", { taskId }),
        };
      }
      const completionEvaluation = await evaluateAt(completionNow);
      if (completionEvaluation === null) {
        cancellation.abort("callback-evaluation-invalidated");
        if (callbackDeadlineExceeded) {
          return {
            status: "action-deadline-exceeded",
            result: deadlineFailure({ completionGuardCode: "TASK_RUNTIME_EVALUATION_FAILED" }),
          };
        }
        return {
          status: "completion-evaluation-failed",
          result: fail("TASK_RUNTIME_EVALUATION_FAILED", "task-start", { taskId }),
        };
      }
      if (completionEvaluation.executionAllowed !== true) {
        cancellation.abort("callback-authority-invalidated");
        if (callbackDeadlineExceeded) {
          return {
            status: "action-deadline-exceeded",
            result: deadlineFailure({
              completionGuardCode: "TASK_RUNTIME_PERMISSION_DENIED",
              completionFailedGateCodes: permissionFailure(completionEvaluation).failedGateCodes,
            }),
          };
        }
        return { status: "completion-permission-denied", result: permissionFailure(completionEvaluation) };
      }
      if (callbackDeadlineExceeded) {
        return { status: "action-deadline-exceeded", result: deadlineFailure() };
      }
      return { status: "callback-completed", finalEvaluation: completionEvaluation };
    });
  } catch {
    return fail("TASK_EXECUTION_LOCK_UNAVAILABLE", "task-start", { taskId });
  }
  if (guardedResult?.status !== "callback-completed") {
    return guardedResult?.result ?? fail("TASK_BOUNDED_ACTION_FAILED", "task-start", { taskId });
  }

  return pass("TASK_EXECUTION_START_OK", "task-start", {
    taskId,
    revision: exactMain.revision,
    executionDecision: guardedResult.finalEvaluation.executionDecision,
    scopeClass,
    actionClass,
    callbackCompletionAccepted: true,
  });
}

const STAGE_GATE_B_REQUEST_KEYS = Object.freeze([
  "taskId",
  "scopeClass",
  "actionClass",
  "stageId",
  "predecessorReceiptSha256",
  "idempotencyKey",
]);
const STAGE_ID_PATTERN = /^P0-STAGE-[A-Z0-9]+(?:-[A-Z0-9]+)+$/;
const IDEMPOTENCY_KEY_PATTERN = /^P0-IDEMP-[A-Z0-9]+(?:-[A-Z0-9]+)+$/;
const PREFIXED_SHA256_PATTERN = /^sha256:[0-9a-f]{64}$/;

function validateStageGateBRequest(request) {
  return hasExactKeys(request, STAGE_GATE_B_REQUEST_KEYS)
    && TASK_ID.test(request.taskId ?? "")
    && typeof request.scopeClass === "string"
    && typeof request.actionClass === "string"
    && SCOPE_ACTION_COMPATIBILITY[request.scopeClass]?.includes(request.actionClass) === true
    && STAGE_ID_PATTERN.test(request.stageId ?? "")
    && request.stageId.includes(request.taskId)
    && IDEMPOTENCY_KEY_PATTERN.test(request.idempotencyKey ?? "")
    && (request.predecessorReceiptSha256 === null
      || PREFIXED_SHA256_PATTERN.test(request.predecessorReceiptSha256 ?? ""));
}

function stageReadinessOverride({ taskId, stageId, scopeClass, actionClass }) {
  return {
    ...(isDedicatedDeliveryTransitionScopeAction({ taskId, stageId, scopeClass, actionClass })
      ? { requestedStageId: stageId }
      : {}),
    requestedScopeClass: scopeClass,
    requestedActionClass: actionClass,
  };
}

async function verifyStageTerminalHistoryAtExactMainCore(request, options = {}) {
  if (!validateStageGateBRequest(request)) {
    return fail("TASK_PRODUCTION_OPTIONS_INVALID", "stage-terminal-history", { taskId: request?.taskId });
  }
  const { taskId, scopeClass, actionClass } = request;
  const repoRoot = path.resolve(options.repoRoot ?? DEFAULT_REPO_ROOT);
  const run = options.run ?? defaultRun;
  const exactMain = options.exactMainResult ?? await verifyExactMainPreflight({ ...options, repoRoot, run });
  if (exactMain?.ok !== true) return exactMain;
  const continuityVerifier = options.verifyStageRegistryContinuity ?? verifyStageApprovalRegistryContinuity;
  const continuity = await continuityVerifier({ repoRoot, run, publishedRef: exactMain.revision });
  if (continuity?.ok !== true) {
    return fail(continuity?.code ?? "STAGE_REGISTRY_CONTINUITY_INVALID", "stage-terminal-history", { taskId });
  }
  const historyVerifier = options.verifyStageHistory ?? verifyStageApprovalRegistryHistory;
  const history = await historyVerifier({
    repoRoot,
    run,
    publishedRef: exactMain.revision,
    stageId: request.stageId,
    continuity,
  });
  if (history?.ok !== true) {
    return fail(history?.code ?? "STAGE_APPROVAL_HISTORY_INVALID", "stage-terminal-history", { taskId });
  }
  if (history.registrySha256 !== continuity.registrySha256) {
    return fail("STAGE_REGISTRY_CONTINUITY_DIGEST_MISMATCH", "stage-terminal-history", { taskId });
  }
  const stage = history.record;
  const requestPredecessorHex = request.predecessorReceiptSha256?.slice("sha256:".length) ?? null;
  if (stage.taskId !== taskId
    || stage.stageId !== request.stageId
    || stage.scopeClass !== scopeClass
    || stage.actionClass !== actionClass
    || stage.idempotencyKey !== request.idempotencyKey
    || stage.predecessorReceiptSha256 !== requestPredecessorHex) {
    return fail("STAGE_APPROVAL_REQUEST_MISMATCH", "stage-terminal-history", { taskId });
  }
  const finalExactMain = await verifyExactMainStillCurrent({
    repoRoot,
    run,
    expectedRevision: exactMain.revision,
  });
  if (!finalExactMain.ok) return finalExactMain;
  return pass("STAGE_TERMINAL_HISTORY_VALID", "stage-terminal-history", {
    taskId,
    stageId: stage.stageId,
    scopeClass,
    actionClass,
    sourceRevision: exactMain.revision,
    candidateRevision: stage.candidateRevision,
    dossierDigest: stage.dossierDigest,
    preparationReviewId: stage.preparationReviewId,
    preparationReviewSha256: history.preparationReviewSha256,
    gateKind: stage.gateKind,
    predecessorReceiptSha256: request.predecessorReceiptSha256,
    idempotencyKey: stage.idempotencyKey,
    stageDefinitionSha256: stage.stageDefinitionSha256,
    moduleId: stage.moduleId,
    moduleSha256: stage.moduleSha256,
    rollbackSnapshotReference: stage.rollback.snapshotReference,
    stageApprovalSha256: history.stageApprovalSha256,
    registrySha256: history.registrySha256,
  });
}

/** Read-only immutable-history proof for reconciling an already terminal receipt. */
export async function verifyStageTerminalHistoryAtExactMain(request = {}) {
  return verifyStageTerminalHistoryAtExactMainCore(request);
}

async function verifyStageGateBAtExactMainCore(request, options = {}) {
  if (!validateStageGateBRequest(request)) {
    return fail("TASK_PRODUCTION_OPTIONS_INVALID", "stage-gate-b", { taskId: request?.taskId });
  }
  const { taskId, scopeClass, actionClass } = request;
  const repoRoot = path.resolve(options.repoRoot ?? DEFAULT_REPO_ROOT);
  const run = options.run ?? defaultRun;
  const exactMain = options.exactMainResult ?? await verifyExactMainPreflight({ ...options, repoRoot, run });
  if (exactMain?.ok !== true) return exactMain;

  const continuityVerifier = options.verifyStageRegistryContinuity ?? verifyStageApprovalRegistryContinuity;
  const continuity = await continuityVerifier({
    repoRoot,
    run,
    publishedRef: exactMain.revision,
  });
  if (continuity?.ok !== true) {
    return fail(continuity?.code ?? "STAGE_REGISTRY_CONTINUITY_INVALID", "stage-gate-b", { taskId });
  }
  const historyVerifier = options.verifyStageHistory ?? verifyStageApprovalRegistryHistory;
  const history = await historyVerifier({
    repoRoot,
    run,
    publishedRef: exactMain.revision,
    stageId: request.stageId,
    continuity,
  });
  if (history?.ok !== true) return fail(history?.code ?? "STAGE_APPROVAL_HISTORY_INVALID", "stage-gate-b", { taskId });
  if (history.registrySha256 !== continuity.registrySha256) {
    return fail("STAGE_REGISTRY_CONTINUITY_DIGEST_MISMATCH", "stage-gate-b", { taskId });
  }
  const stage = history.record;
  const requestPredecessorHex = request.predecessorReceiptSha256?.slice("sha256:".length) ?? null;
  if (stage.taskId !== taskId
    || stage.scopeClass !== scopeClass
    || stage.actionClass !== actionClass
    || stage.idempotencyKey !== request.idempotencyKey
    || stage.predecessorReceiptSha256 !== requestPredecessorHex) {
    return fail("STAGE_APPROVAL_REQUEST_MISMATCH", "stage-gate-b", { taskId });
  }

  const readJson = options.readJson ?? defaultReadJson;
  const documents = {};
  try {
    for (const [name, relativePath] of Object.entries(DOCUMENT_PATHS)) {
      documents[name] = await readJson(repoRoot, relativePath, { run, revision: exactMain.revision });
    }
  } catch {
    return fail("TASK_CONTROL_DOCUMENT_UNAVAILABLE", "stage-gate-b", { taskId });
  }
  const records = taskRecords(documents.register, taskId);
  if (records.length !== 1) return fail("TASK_REGISTER_RECORD_MISSING", "stage-gate-b", { taskId });
  const candidateRevision = stage.candidateRevision;
  if (!FULL_REVISION.test(candidateRevision ?? "") || stage.candidate?.revision !== candidateRevision) {
    return fail("TASK_CANDIDATE_REVISION_INVALID", "stage-gate-b", { taskId });
  }

  const candidateResult = await deriveCandidatePublicationFacts({
    repoRoot,
    run,
    taskId,
    candidate: stage.candidate,
    registeredArtifacts: records[0].artifacts,
    publishedRef: exactMain.revision,
    scopeClass,
  });
  if (!candidateResult.ok) return candidateResult;
  const { ok: _candidateOk, code: _candidateCode, scope: _candidateScope, ...candidatePublication } = candidateResult;
  const context = {
    repoRoot,
    run,
    revision: exactMain.revision,
    taskId,
    register: documents.register,
    manifest: documents.manifest,
    readinessState: {
      schemaVersion: documents.readinessState.schemaVersion,
      asOf: documents.readinessState.asOf,
      evidenceBoundary: documents.readinessState.evidenceBoundary,
      taskOverrides: {
        [taskId]: stageReadinessOverride({ taskId, stageId: stage.stageId, scopeClass, actionClass }),
      },
    },
    reviewerRegistry: documents.reviewerRegistry,
    // Gate B deliberately builds the ordinary task facts with no legacy
    // task-wide approval. Candidate and authorization facts are overlaid only
    // from the immutable stage record returned by the trusted history verifier.
    approvalRegistry: { taskApprovals: {} },
    ownerActionState: documents.ownerActionState,
    gitFacts: {},
  };
  const loadEvaluationInput = options.loadEvaluationInput ?? defaultLoadEvaluationInput;
  let input;
  try {
    input = await loadEvaluationInput(context);
  } catch {
    return fail("TASK_EVALUATION_ADAPTER_UNAVAILABLE", "stage-gate-b", { taskId });
  }
  if (input !== null && typeof input === "object" && !Array.isArray(input)) {
    input = {
      ...input,
      candidate: structuredClone(stage.candidate),
      artifactReviews: structuredClone(stage.artifactReviews),
      designCoverage: structuredClone(stage.designCoverage),
      dependencyEvidence: structuredClone(stage.dependencyEvidence),
      privateAuthority: structuredClone(stage.privateAuthority),
      openDecisions: structuredClone(stage.openDecisions),
      specialistVetoes: structuredClone(stage.specialistVetoes),
      council: {
        verdict: "hold",
        reviewedRevision: null,
        dossierDigest: null,
        unresolvedBlockers: ["Legacy task-wide approval is non-authorizing for Gate B."],
        seatVerdicts: {},
      },
      approvalRecord: null,
    };
  }
  if (input === null || typeof input !== "object" || Array.isArray(input)
    || input.requestedScope?.scopeClass !== scopeClass
    || input.requestedScope?.actionClass !== actionClass) {
    return fail("TASK_REQUESTED_ACTION_MISMATCH", "stage-gate-b", { taskId });
  }
  if (candidatePublication.candidateTaskContractSha256 !== stage.candidate.taskContractSha256) {
    return fail("TASK_CANDIDATE_TASK_CONTRACT_UNVERIFIED", "stage-gate-b", { taskId });
  }
  const candidateAncestorOfHead = candidatePublication.candidateOnFetchedMain === true;
  const gitFacts = {
    ...exactMain.gitFacts,
    candidateRevision,
    approvalRevision: history.stagePublicationRevision,
    candidateAncestorOfHead,
    candidateReachableFromHead: candidateAncestorOfHead,
    approvalRecordReachable: false,
    approvalRecordReachableFromHead: false,
    candidateBytesVerified: candidatePublication.candidateBytesVerified,
    candidateOnFetchedMain: candidatePublication.candidateOnFetchedMain,
  };
  const activation = {
    fetchSucceeded: true,
    worktreeClean: gitFacts.checkoutClean === true,
    branch: gitFacts.branch,
    detached: gitFacts.detached,
    upstream: gitFacts.upstream,
    headRevision: gitFacts.head,
    originMainRevision: gitFacts.originMain,
    approvalRecordReachableFromHead: false,
    approvalPublicationRevision: history.stagePublicationRevision,
    stageApprovalRecordReachableFromHead: true,
    candidateReachableFromHead: candidateAncestorOfHead,
    candidateRevision,
    taskFilesVerifiedAtRevision: exactMain.revision,
    runtimeRequestedScopeClass: scopeClass,
    runtimeRequestedActionClass: actionClass,
    externalSyncSourceRevision: gitFacts.head,
  };
  const evaluationInput = { ...input, evaluationPhase: "activation" };
  const stageApprovalPublication = {
    registryPath: "docs/council/execution/P0-R0-STAGE-APPROVAL-REGISTRY.json",
    registrySha256: history.registrySha256,
    registryBytesVerified: true,
    taskId,
    stageId: stage.stageId,
    preparationReviewId: history.preparationReview.preparationReviewId,
    publishedPreparationReviewSha256: history.preparationReviewSha256,
    currentPreparationReviewSha256: history.preparationReviewSha256,
    preparationReviewBytesVerified: true,
    preparationPublicationRevision: history.preparationPublicationRevision,
    preparationCandidateAncestorOfPublication: true,
    publishedStageApprovalSha256: history.stageApprovalSha256,
    currentStageApprovalSha256: history.stageApprovalSha256,
    stageApprovalBytesVerified: true,
    stagePublicationRevision: history.stagePublicationRevision,
    stageCandidateAncestorOfPublication: true,
    preparationPublicationAncestorOfStageCandidate: true,
    stageApprovalPublishedOnFetchedMain: true,
  };
  const now = trustedNow(options);
  if (now === null) return fail("TASK_RUNTIME_EVALUATION_FAILED", "stage-gate-b", { taskId });
  const evaluator = options.evaluateStage ?? evaluateStageExecutionGateB;
  let evaluation;
  try {
    evaluation = await evaluator({
      schemaVersion: STAGE_EXECUTION_SCHEMA_VERSION,
      taskInput: evaluationInput,
      preparationReview: history.preparationReview,
      stage,
    }, {
      taskEvaluationOptions: {
        phase: "activation",
        now,
        candidatePublication,
        approvalPublication: stageApprovalPublication,
        activation,
      },
    });
  } catch {
    return fail("TASK_RUNTIME_EVALUATION_FAILED", "stage-gate-b", { taskId });
  }
  if (evaluation?.executionAllowed !== true
    || !["Ready to execute — Gate B", "Ready to accept — Gate B"].includes(evaluation.decision)) {
    const failedGateCodes = Array.isArray(evaluation?.gateResults)
      ? evaluation.gateResults.filter((gate) => gate?.passed !== true).map((gate) => gate?.code).filter(Boolean)
      : [];
    return fail("TASK_RUNTIME_PERMISSION_DENIED", "stage-gate-b", { taskId, failedGateCodes });
  }
  const deadline = serializableStageDeadline({
    options,
    evaluationInput,
    now,
    request,
    stage,
  });
  if (deadline === null) return fail("TASK_BOUNDED_ACTION_DEADLINE_EXCEEDED", "stage-gate-b", { taskId });
  const finalExactMain = await verifyExactMainStillCurrent({ repoRoot, run, expectedRevision: exactMain.revision });
  if (!finalExactMain.ok) return finalExactMain;
  return pass("STAGE_GATE_B_READY", "stage-gate-b", {
    taskId,
    stageId: stage.stageId,
    scopeClass,
    actionClass,
    sourceRevision: exactMain.revision,
    candidateRevision: stage.candidateRevision,
    dossierDigest: stage.dossierDigest,
    preparationReviewId: stage.preparationReviewId,
    preparationReviewSha256: history.preparationReviewSha256,
    gateKind: stage.gateKind,
    gateDecision: evaluation.decision,
    independentQaResult: stage.independentQa.result,
    predecessorReceiptSha256: request.predecessorReceiptSha256,
    idempotencyKey: stage.idempotencyKey,
    stageDefinitionSha256: stage.stageDefinitionSha256,
    moduleId: stage.moduleId,
    moduleSha256: stage.moduleSha256,
    rollbackSnapshotReference: stage.rollback.snapshotReference,
    stageApprovalSha256: history.stageApprovalSha256,
    registrySha256: history.registrySha256,
    gateSourceFingerprint: evaluation.normalizedEvidence?.sourceFingerprint,
    deadlineAt: deadline.deadlineAt,
  });
}

/** Closed read-only Gate B authorization shared by both reviewed staged runners. */
export async function verifyStageGateBAtExactMain(request = {}) {
  return verifyStageGateBAtExactMainCore(request);
}

/**
 * Retained diagnostic surface. This legacy task-wide function stays disabled;
 * reviewed work may start only through executeStageFromExactMain's bounded
 * in-process lane or the serializable stage runner.
 */
export async function executeTaskFromExactMain(request = {}) {
  if (!hasExactKeys(request, ["taskId", "scopeClass", "actionClass"])) {
    return fail("TASK_PRODUCTION_OPTIONS_INVALID", "task-start");
  }
  return fail("TASK_SERIALIZABLE_RUNNER_REQUIRED", "task-start", { taskId: request.taskId });
}

async function selfTest() {
  const buildStoredZip = (sourceEntries, {
    firstEntryExtra = Buffer.alloc(0),
    firstCentralComment = Buffer.alloc(0),
    eocdComment = Buffer.alloc(0),
  } = {}) => {
    const localRecords = [];
    const centralRecords = [];
    let localOffset = 0;
    for (const [index, [name, sourceContent]] of sourceEntries.entries()) {
      const nameBytes = Buffer.from(name, "ascii");
      const content = Buffer.isBuffer(sourceContent) ? sourceContent : Buffer.from(sourceContent, "utf8");
      const entryExtra = index === 0 ? firstEntryExtra : Buffer.alloc(0);
      const centralComment = index === 0 ? firstCentralComment : Buffer.alloc(0);
      const checksum = crc32(content);
      const localHeader = Buffer.alloc(30);
      localHeader.writeUInt32LE(0x04034b50, 0);
      localHeader.writeUInt16LE(20, 4);
      localHeader.writeUInt32LE(checksum, 14);
      localHeader.writeUInt32LE(content.length, 18);
      localHeader.writeUInt32LE(content.length, 22);
      localHeader.writeUInt16LE(nameBytes.length, 26);
      localHeader.writeUInt16LE(entryExtra.length, 28);
      const localRecord = Buffer.concat([localHeader, nameBytes, entryExtra, content]);
      localRecords.push(localRecord);

      const centralHeader = Buffer.alloc(46);
      centralHeader.writeUInt32LE(0x02014b50, 0);
      centralHeader.writeUInt16LE(20, 4);
      centralHeader.writeUInt16LE(20, 6);
      centralHeader.writeUInt32LE(checksum, 16);
      centralHeader.writeUInt32LE(content.length, 20);
      centralHeader.writeUInt32LE(content.length, 24);
      centralHeader.writeUInt16LE(nameBytes.length, 28);
      centralHeader.writeUInt16LE(entryExtra.length, 30);
      centralHeader.writeUInt16LE(centralComment.length, 32);
      centralHeader.writeUInt32LE(localOffset, 42);
      centralRecords.push(Buffer.concat([centralHeader, nameBytes, entryExtra, centralComment]));
      localOffset += localRecord.length;
    }
    const central = Buffer.concat(centralRecords);
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0);
    eocd.writeUInt16LE(sourceEntries.length, 8);
    eocd.writeUInt16LE(sourceEntries.length, 10);
    eocd.writeUInt32LE(central.length, 12);
    eocd.writeUInt32LE(localOffset, 16);
    eocd.writeUInt16LE(eocdComment.length, 20);
    return Buffer.concat([...localRecords, central, eocd, eocdComment]);
  };
  const taskId = "PC-001";
  const scopeClass = "local-synthetic";
  const actionClass = "readiness-control-hardening";
  const mainRevision = "a".repeat(40);
  const candidateRevision = "b".repeat(40);
  const baseRevision = "f".repeat(40);
  const approvalRevision = "c".repeat(40);
  const priorRevision = "d".repeat(40);
  const mutationRevision = "e".repeat(40);
  const reviewerRegistry = {
    schemaVersion: "1.0.0",
    reviewers: [{ reviewerId: "fixture-reviewer", role: "project", active: true }],
  };
  const ownerActionRequirements = [{
    actionId: "FIX-ACT-001",
    requiredForScopeClasses: ["local-synthetic"],
    requiredForActionClasses: ["fixture-action"],
    accountableHumanId: "fixture-owner",
    accountableHumanRole: "owner-authority",
  }];
  const relevantOwnerAction = {
    actionId: "FIX-ACT-001",
    status: "complete",
    result: "pass",
    verifierId: "fixture-reviewer",
    verifierRole: "project",
    verifiedAt: "2026-08-15T11:00:00.000Z",
    evidenceReference: "fixture:owner-action",
    candidateRevision,
    dossierDigest: `sha256:${"1".repeat(64)}`,
    accountableHumanId: "fixture-owner",
    accountableHumanRole: "owner-authority",
    ownerAttestationReference: "fixture:owner-attestation",
  };
  const publishedOwnerActionState = {
    schemaVersion: "1.0.0",
    actions: { "FIX-ACT-001": relevantOwnerAction },
  };
  const ownerActionState = {
    schemaVersion: "1.0.0",
    actions: {
      "FIX-ACT-001": relevantOwnerAction,
      "UNRELATED-001": { actionId: "UNRELATED-001", status: "pending" },
    },
  };
  const manifestTask = {
    id: taskId,
    description: "Fixture controls are ready.",
    requirementIds: ["FIX-REQ-001"],
    dependencies: ["AUD-001"],
    acceptanceEvidence: "fixture:acceptance",
  };
  const manifestDocument = { tasks: [manifestTask] };
  const changedManifestDocument = {
    tasks: [{ ...manifestTask, description: "Changed after approval." }],
  };
  const taskContractSha256 = computeTaskContractSha256(manifestTaskContract(manifestTask, taskId));
  const changedTaskContractSha256 = computeTaskContractSha256(
    manifestTaskContract(changedManifestDocument.tasks[0], taskId),
  );
  const artifactBytes = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, `# ${taskId} ${kind}\n` ]));
  const artifactBindings = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
    path: `docs/work-items/${taskId}/P0-${taskId}-${kind}.md`,
    sha256: sha256(artifactBytes[kind]),
  }]));
  const implementationPath = "src/reflect-controls.mjs";
  const evidencePath = `outputs/P0-${taskId}-evidence.xlsx`;
  const textFixturePath = "src/P0-runtime-fixture.txt";
  const implementationBytes = "export const fixture = true;\n";
  const textFixtureBytes = Buffer.from("raw-byte fixture\n", "utf8");
  const minimalWorkbookEntries = [
    [
      "[Content_Types].xml",
      "<Types><Override PartName=\"/xl/workbook.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\"/></Types>",
    ],
    ["_rels/.rels", "<Relationships><Relationship Id=\"rId1\" Type=\"officeDocument\" Target=\"xl/workbook.xml\"/></Relationships>"],
    ["xl/workbook.xml", "<workbook/>"] ,
  ];
  const evidenceBytes = buildStoredZip(minimalWorkbookEntries);
  const unicodePathPayload = Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00, ...Buffer.from("xl/media/photo.jpg", "utf8")]);
  const unicodePathExtra = Buffer.alloc(4 + unicodePathPayload.length);
  unicodePathExtra.writeUInt16LE(0x7075, 0);
  unicodePathExtra.writeUInt16LE(unicodePathPayload.length, 2);
  unicodePathPayload.copy(unicodePathExtra, 4);
  const archiveWithUnicodePathExtra = buildStoredZip(minimalWorkbookEntries, { firstEntryExtra: unicodePathExtra });
  const archiveWithCentralComment = buildStoredZip(minimalWorkbookEntries, {
    firstCentralComment: Buffer.from("private-payload", "utf8"),
  });
  const archiveWithEocdComment = buildStoredZip(minimalWorkbookEntries, {
    eocdComment: Buffer.from("private-payload", "utf8"),
  });
  const archiveWithUnexpectedBinary = buildStoredZip([
    [
      "[Content_Types].xml",
      "<Types><Override PartName=\"/xl/workbook.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\"/></Types>",
    ],
    ["_rels/.rels", "<Relationships><Relationship Id=\"rId1\" Type=\"officeDocument\" Target=\"xl/workbook.xml\"/></Relationships>"],
    ["xl/workbook.xml", "<workbook/>"],
    ["xl/payload.bin", Buffer.from([0xff, 0xfe, 0xfd])],
  ]);
  const archiveWithExternalFormula = buildStoredZip([
    [
      "[Content_Types].xml",
      "<Types><Default Extension=\"xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\"/><Override PartName=\"/xl/worksheets/sheet1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/></Types>",
    ],
    ["_rels/.rels", "<Relationships><Relationship Id=\"rId1\" Type=\"officeDocument\" Target=\"xl/workbook.xml\"/></Relationships>"],
    ["xl/workbook.xml", "<workbook/>"],
    ["xl/worksheets/sheet1.xml", "<worksheet><c><f>WEBSERVICE(&quot;https://example.invalid/x&quot;)</f></c></worksheet>"],
  ]);
  const archiveWithDangerousDefinedName = buildStoredZip([
    [
      "[Content_Types].xml",
      "<Types><Override PartName=\"/xl/workbook.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\"/></Types>",
    ],
    ["_rels/.rels", "<Relationships><Relationship Id=\"rId1\" Type=\"officeDocument\" Target=\"xl/workbook.xml\"/></Relationships>"],
    ["xl/workbook.xml", "<workbook><definedNames><definedName name=\"_xlnm.Auto_Open\">EVALUATE(&quot;CHAR(61)&amp;RUN&quot;)</definedName></definedNames></workbook>"],
  ]);
  const encodedPngFixture = ["iV", "BORw0KGgoAAAANSUhEUgAAAAEAAAAB"].join("");
  const archiveWithEncodedMedia = buildStoredZip([
    [
      "[Content_Types].xml",
      "<Types><Default Extension=\"xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\"/><Override PartName=\"/xl/sharedStrings.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml\"/></Types>",
    ],
    ["_rels/.rels", "<Relationships><Relationship Id=\"rId1\" Type=\"officeDocument\" Target=\"xl/workbook.xml\"/></Relationships>"],
    ["xl/workbook.xml", "<workbook/>"],
    ["xl/sharedStrings.xml", `<sst><si><t>${encodedPngFixture}</t></si></sst>`],
  ]);
  const archiveSafetyCases = [
    ["valid-minimal-archive", xlsxArchiveIsSafe(evidenceBytes), true],
    ["unicode-path-extra-field", xlsxArchiveIsSafe(archiveWithUnicodePathExtra), false],
    ["central-directory-comment", xlsxArchiveIsSafe(archiveWithCentralComment), false],
    ["archive-comment", xlsxArchiveIsSafe(archiveWithEocdComment), false],
    ["unexpected-binary-part", xlsxArchiveIsSafe(archiveWithUnexpectedBinary), false],
    ["unicode-prefixed-external-relationship", xlsxRelationshipXmlIsSafe('<α:Relationship TargetMode="External" Target="//example.invalid/x"/>'), false],
    ["entity-encoded-external-relationship", xlsxRelationshipXmlIsSafe('<Relationship TargetMode="Ext&#x65;rnal" Target="//example.invalid/x"/>'), false],
    ["network-formula", xlsxFormulaXmlIsSafe('<x:f>WEBSERVICE("https://example.invalid/x")</x:f>'), false],
    ["qualified-network-formula", xlsxFormulaXmlIsSafe('<x:f>_xlfn.WEBSERVICE("h"&amp;"ttps://example.invalid/x")</x:f>'), false],
    ["defined-name-network-formula", xlsxFormulaXmlIsSafe('<definedName>_xlfn.HYPERLINK("h"&amp;"ttps://example.invalid/x")</definedName>'), false],
    ["legacy-xlm-function", xlsxFormulaXmlIsSafe('<definedName>EXEC("x")</definedName>'), false],
    ["legacy-auto-open-name", xlsxFormulaXmlIsSafe('<definedName name="_xlnm.Auto_Open">EVALUATE("x")</definedName>'), false],
    ["shadowed-target-relationship", xlsxRelationshipXmlIsSafe('<Relationship x:Target="xl/workbook.xml" Target="https://example.invalid/x"/>'), false],
    ["ordinary-local-formula", xlsxFormulaXmlIsSafe("<x:f>COUNTA(A1:A3)</x:f>"), true],
    ["external-formula-archive", xlsxArchiveIsSafe(archiveWithExternalFormula), false],
    ["dangerous-defined-name-archive", xlsxArchiveIsSafe(archiveWithDangerousDefinedName), false],
    ["encoded-media-archive", xlsxArchiveIsSafe(archiveWithEncodedMedia), false],
  ];
  for (const [label, actual, expected] of archiveSafetyCases) {
    if (actual !== expected) throw new Error(`XLSX archive-safety self-test failed: ${label}`);
  }
  const localTextSafetyCases = [
    ["leading-pdf", Buffer.from("\n  %PDF-1.7\n", "utf8"), false],
    ["base64-pdf", Buffer.from(["JV", "BERi0xLjcKMSAwIG9iago="].join(""), "utf8"), false],
    ["base64-zip", Buffer.from(["UE", "sDBBQAAAAIAAAAIQAAAAAAAAAAAAA="].join(""), "utf8"), false],
    ["base64-heic", Buffer.from(["AAAA", "GG", "Z0e", "XBo", "ZWljAAAAAG1pZjFoZWlj"].join(""), "utf8"), false],
    ["data-image", Buffer.from(["data", ":", "im", "age/png;base64,", encodedPngFixture].join(""), "utf8"), false],
    ["telegram-token", Buffer.from(["123456789", ":", "A", "A", "abcdefghijklmnopqrstuvwxy123456"].join(""), "utf8"), false],
    ["google-key", Buffer.from([["AI", "za"].join(""), "ABCDEFGHIJKLMNOPQRSTUVWX"].join(""), "utf8"), false],
    ["ordinary-source", Buffer.from("export const P0_CONTROL = true;\n", "utf8"), true],
  ];
  for (const [label, bytes, expected] of localTextSafetyCases) {
    if (localSyntheticTextBytesAreSafe(bytes) !== expected) {
      throw new Error(`local text-safety self-test failed: ${label}`);
    }
  }
  const taskFileMode = (purpose) => purpose === "implementation" ? "100755" : "100644";
  const taskFiles = [
    ...ARTIFACT_KINDS.map((kind) => ({
      path: artifactBindings[kind].path,
      sha256: artifactBindings[kind].sha256,
      purpose: `artifact:${kind}`,
      gitMode: taskFileMode(`artifact:${kind}`),
      gitType: "blob",
    })),
    {
      path: implementationPath,
      sha256: sha256(implementationBytes),
      purpose: "implementation",
      gitMode: taskFileMode("implementation"),
      gitType: "blob",
    },
    {
      path: textFixturePath,
      sha256: sha256(textFixtureBytes),
      purpose: "implementation",
      gitMode: taskFileMode("implementation"),
      gitType: "blob",
    },
    {
      path: evidencePath,
      sha256: sha256(evidenceBytes),
      purpose: "evidence",
      gitMode: taskFileMode("evidence"),
      gitType: "blob",
    },
  ];
  const taskFilesSha256 = computeTaskFilesSha256(taskFiles);
  const taskFileBytes = new Map([
    ...ARTIFACT_KINDS.map((kind) => [artifactBindings[kind].path, artifactBytes[kind]]),
    [implementationPath, implementationBytes],
    [textFixturePath, textFixtureBytes],
    [evidencePath, evidenceBytes],
  ]);
  const taskFileModes = new Map(taskFiles.map((entry) => [entry.path, entry.gitMode]));
  const currentTaskApproval = {
    candidate: {
      revision: candidateRevision,
      baseRevision,
      dossierDigest: `sha256:${"1".repeat(64)}`,
      artifacts: artifactBindings,
      taskFiles,
      taskFilesSha256,
      taskContractSha256,
    },
    approvalRecord: {
      candidateRevision,
      dossierDigest: `sha256:${"1".repeat(64)}`,
      approvalsVerified: true,
    },
  };
  const differentTaskApproval = {
    ...structuredClone(currentTaskApproval),
    approvalRecord: {
      ...currentTaskApproval.approvalRecord,
      dossierDigest: `sha256:${"2".repeat(64)}`,
    },
  };
  const changedContractTaskApproval = structuredClone(currentTaskApproval);
  changedContractTaskApproval.candidate.taskContractSha256 = changedTaskContractSha256;
  const malformedArchiveBytes = Buffer.from("not-an-xlsx-archive", "utf8");
  const malformedArchiveTaskApproval = structuredClone(currentTaskApproval);
  const malformedArchiveBinding = malformedArchiveTaskApproval.candidate.taskFiles
    .find((entry) => entry.path === evidencePath);
  malformedArchiveBinding.sha256 = sha256(malformedArchiveBytes);
  malformedArchiveTaskApproval.candidate.taskFilesSha256 = computeTaskFilesSha256(
    malformedArchiveTaskApproval.candidate.taskFiles,
  );
  const disguisedBinaryBytes = Buffer.from([0xff, 0xd8, 0xff, 0x00]);
  const disguisedBinaryTaskApproval = structuredClone(currentTaskApproval);
  const disguisedBinaryBinding = disguisedBinaryTaskApproval.candidate.taskFiles
    .find((entry) => entry.path === textFixturePath);
  disguisedBinaryBinding.sha256 = sha256(disguisedBinaryBytes);
  disguisedBinaryTaskApproval.candidate.taskFilesSha256 = computeTaskFilesSha256(
    disguisedBinaryTaskApproval.candidate.taskFiles,
  );
  const encodedMediaBytes = Buffer.from(encodedPngFixture, "utf8");
  const encodedMediaTaskApproval = structuredClone(currentTaskApproval);
  const encodedMediaBinding = encodedMediaTaskApproval.candidate.taskFiles
    .find((entry) => entry.path === textFixturePath);
  encodedMediaBinding.sha256 = sha256(encodedMediaBytes);
  encodedMediaTaskApproval.candidate.taskFilesSha256 = computeTaskFilesSha256(
    encodedMediaTaskApproval.candidate.taskFiles,
  );
  const registryBytes = (taskApproval, appendSibling = false) => `${JSON.stringify({
    schemaVersion: "1.1.0",
    controlReviews: {},
    taskApprovals: {
      ...(taskApproval === null ? {} : { [taskId]: taskApproval }),
      ...(appendSibling ? { "ZZ-999": { approvalRecord: { approvalsVerified: false } } } : {}),
    },
  }, null, 2)}\n`;
  const reviewerBytes = `${JSON.stringify(reviewerRegistry, null, 2)}\n`;
  const ownerActionBytes = `${JSON.stringify(ownerActionState, null, 2)}\n`;
  const manifestBytes = `${JSON.stringify(manifestDocument, null, 2)}\n`;

  function fixtureRun({
    currentApprovalOverride = null,
    candidateApproval = null,
    priorApproval = null,
    mutateThenRevert = false,
    alteredPublicationBytes = false,
    wrongAncestry = false,
    reviewerChangedAfterApproval = false,
    ownerActionChangedAfterApproval = false,
    taskContractChangedAfterApproval = false,
    candidateTaskContractChanged = false,
    omittedCandidateDiffPath = false,
    candidateModeMismatch = false,
    descendantTaskFileDrift = false,
    descendantModeDrift = false,
    invalidUtf8CollisionDrift = false,
    disguisedBinaryText = false,
    encodedMediaText = false,
    malformedArchive = false,
    wrongBaseParent = false,
    multipleCandidateParents = false,
    originMovesOnFinalFetch = false,
    originMovesAfterCallback = false,
    dirty = false,
    stale = false,
  } = {}) {
    const effectiveCurrentApproval = currentApprovalOverride ?? currentTaskApproval;
    const history = [
      ...(priorApproval === null ? [] : [priorRevision]),
      approvalRevision,
      ...(mutateThenRevert ? [mutationRevision] : []),
      mainRevision,
    ];
    const approvalByRevision = {
      [candidateRevision]: candidateApproval,
      ...(priorApproval === null ? {} : { [priorRevision]: priorApproval }),
      [approvalRevision]: effectiveCurrentApproval,
      ...(mutateThenRevert ? { [mutationRevision]: differentTaskApproval } : {}),
      [mainRevision]: effectiveCurrentApproval,
    };
    let approvalShowCount = 0;
    let postPreflightDirty = false;
    let originMoved = false;
    let exactMainRecheckFetches = 0;
    const fileBytes = (revision, relativePath) => {
      if (relativePath === APPROVAL_REGISTRY_PATH) {
        const appendSibling = revision === mainRevision;
        return registryBytes(approvalByRevision[revision] ?? null, appendSibling);
      }
      if (relativePath === DOCUMENT_PATHS.reviewerRegistry) {
        if (reviewerChangedAfterApproval && revision === approvalRevision) {
          return `${JSON.stringify({ ...reviewerRegistry, reviewers: [{ ...reviewerRegistry.reviewers[0], active: false }] }, null, 2)}\n`;
        }
        return reviewerBytes;
      }
      if (relativePath === DOCUMENT_PATHS.ownerActionState) {
        if (ownerActionChangedAfterApproval && revision === approvalRevision) {
          return `${JSON.stringify({
            ...publishedOwnerActionState,
            actions: { "FIX-ACT-001": { ...relevantOwnerAction, result: "fail" } },
          }, null, 2)}\n`;
        }
        return revision === mainRevision ? ownerActionBytes : `${JSON.stringify(publishedOwnerActionState, null, 2)}\n`;
      }
      if (relativePath === DOCUMENT_PATHS.manifest) {
        if (candidateTaskContractChanged && revision === candidateRevision) {
          return `${JSON.stringify(changedManifestDocument, null, 2)}\n`;
        }
        if (taskContractChangedAfterApproval && revision === approvalRevision) {
          return `${JSON.stringify(changedManifestDocument, null, 2)}\n`;
        }
        return manifestBytes;
      }
      if ([candidateRevision, mainRevision].includes(revision) && taskFileBytes.has(relativePath)) {
        if (malformedArchive && relativePath === evidencePath) return malformedArchiveBytes;
        if (descendantTaskFileDrift && revision === mainRevision && relativePath === implementationPath) {
          return `${implementationBytes}// descendant drift\n`;
        }
        if (disguisedBinaryText && relativePath === textFixturePath) return disguisedBinaryBytes;
        if (encodedMediaText && relativePath === textFixturePath) return encodedMediaBytes;
        if (invalidUtf8CollisionDrift && revision === mainRevision && relativePath === textFixturePath) {
          return Buffer.from([0xfe]);
        }
        return taskFileBytes.get(relativePath);
      }
      return null;
    };
    const run = async (command, args) => {
      if (command !== "git") return { ok: false, stdout: "" };
      const key = args.join(" ");
      if (key === "remote get-url --all origin"
        || key === "remote get-url --push --all origin") {
        return { ok: true, stdout: `${CANONICAL_ORIGIN_URL}\n` };
      }
      if (key === "rev-parse --show-toplevel") return { ok: true, stdout: `${DEFAULT_REPO_ROOT}\n` };
      if (key === "rev-parse --path-format=absolute --git-dir") {
        return { ok: true, stdout: "/fixture/.git/worktrees/Phase1\n" };
      }
      if (key === "rev-parse --path-format=absolute --git-common-dir") {
        return { ok: true, stdout: "/fixture/.git\n" };
      }
      if (key === "fetch --quiet --no-tags origin +refs/heads/main:refs/remotes/origin/main") return { ok: true, stdout: "" };
      if (key === "fetch --quiet --no-tags --prune origin +refs/heads/main:refs/remotes/origin/main") {
        exactMainRecheckFetches += 1;
        originMoved = originMoved
          || originMovesOnFinalFetch
          || (originMovesAfterCallback && exactMainRecheckFetches >= 2);
        return { ok: true, stdout: "" };
      }
      if (key === "symbolic-ref --quiet --short HEAD") return { ok: true, stdout: "codex/exact-main-fixture\n" };
      if (key === "rev-parse --abbrev-ref --symbolic-full-name @{upstream}") return { ok: true, stdout: "origin/main\n" };
      if (key === "status --porcelain=v1 --untracked-files=all") {
        return { ok: true, stdout: dirty || postPreflightDirty ? " M P0-fixture\n" : "" };
      }
      if (key === "rev-parse --verify HEAD^{commit}") return { ok: true, stdout: `${stale ? candidateRevision : mainRevision}\n` };
      if (key === "rev-parse --verify refs/remotes/origin/main^{commit}") {
        return { ok: true, stdout: `${originMoved ? "9".repeat(40) : mainRevision}\n` };
      }
      if (key === `rev-list --parents -n 1 ${candidateRevision}`) {
        const firstParent = wrongBaseParent ? "7".repeat(40) : baseRevision;
        const extraParent = multipleCandidateParents ? ` ${"8".repeat(40)}` : "";
        return { ok: true, stdout: `${candidateRevision} ${firstParent}${extraParent}\n` };
      }
      if (args[0] === "merge-base" && args[1] === "--is-ancestor") {
        const [, , ancestor, descendant] = args;
        if (ancestor === candidateRevision && descendant === approvalRevision && wrongAncestry) return { ok: false, stdout: "" };
        const known = ancestor === descendant
          || (ancestor === baseRevision && [candidateRevision, ...history].includes(descendant))
          || (ancestor === candidateRevision && history.includes(descendant))
          || (ancestor === priorRevision && [approvalRevision, mutationRevision, mainRevision].includes(descendant))
          || (ancestor === approvalRevision && [mutationRevision, mainRevision].includes(descendant))
          || (ancestor === mutationRevision && descendant === mainRevision);
        return { ok: known, stdout: "" };
      }
      if (key === `rev-list --reverse --topo-order --ancestry-path ${candidateRevision}..${mainRevision}`) {
        return { ok: true, stdout: `${history.join("\n")}\n` };
      }
      if (args[0] === "diff" && args[1] === "--name-only" && args[2] === "-z" && args[3] === "--no-renames") {
        const hasFilter = args[4]?.startsWith("--diff-filter=");
        const fromRevision = args[hasFilter ? 5 : 4];
        const toRevision = args[hasFilter ? 6 : 5];
        const filter = hasFilter ? args[4].slice("--diff-filter=".length) : null;
        let paths = [];
        if (fromRevision === baseRevision && toRevision === candidateRevision) {
          paths = filter === "DT"
            ? []
            : [
              ...taskFiles.map((entry) => entry.path),
              DOCUMENT_PATHS.manifest,
              ...(omittedCandidateDiffPath ? ["config/unbound-runtime.json"] : []),
            ];
        } else if (fromRevision === candidateRevision && toRevision === mainRevision) {
          paths = filter === "DT"
            ? []
            : [
              APPROVAL_REGISTRY_PATH,
              ...(descendantTaskFileDrift ? [implementationPath] : []),
            ];
        } else {
          return { ok: false, stdout: "" };
        }
        return {
          ok: true,
          stdout: paths.length === 0 ? Buffer.alloc(0) : Buffer.from(`${paths.join("\0")}\0`),
        };
      }
      if (args[0] === "ls-tree" && args[1] === "-z" && args[3] === "--") {
        const revision = args[2];
        const relativePath = args[4];
        if (![candidateRevision, mainRevision].includes(revision) || !taskFileBytes.has(relativePath)) {
          return { ok: true, stdout: Buffer.alloc(0) };
        }
        let gitMode = taskFileModes.get(relativePath);
        if ((candidateModeMismatch && revision === candidateRevision
            || descendantModeDrift && revision === mainRevision)
          && relativePath === implementationPath) {
          gitMode = "120000";
        }
        return {
          ok: true,
          stdout: Buffer.from(`${gitMode} blob ${"0".repeat(40)}\t${relativePath}\0`),
        };
      }
      if (args[0] === "cat-file" && args[1] === "-e") {
        const separator = args[2].indexOf(":");
        const revision = args[2].slice(0, separator);
        const relativePath = args[2].slice(separator + 1);
        return { ok: fileBytes(revision, relativePath) !== null, stdout: "" };
      }
      if (args[0] === "cat-file" && args[1] === "-t") {
        const separator = args[2].indexOf(":");
        const revision = args[2].slice(0, separator);
        const relativePath = args[2].slice(separator + 1);
        return fileBytes(revision, relativePath) === null
          ? { ok: false, stdout: "" }
          : { ok: true, stdout: "blob\n" };
      }
      if (args[0] === "show") {
        const separator = args[1].indexOf(":");
        const revision = args[1].slice(0, separator);
        const relativePath = args[1].slice(separator + 1);
        let bytes = fileBytes(revision, relativePath);
        if (alteredPublicationBytes && revision === approvalRevision && relativePath === APPROVAL_REGISTRY_PATH) {
          approvalShowCount += 1;
          if (approvalShowCount > 1) bytes = registryBytes(differentTaskApproval);
        }
        return bytes === null ? { ok: false, stdout: "" } : { ok: true, stdout: bytes };
      }
      return { ok: false, stdout: "" };
    };
    return {
      run,
      setPostPreflightDirty(value) { postPreflightDirty = value; },
    };
  }

  const validFixture = fixtureRun();
  const exactMain = await verifyExactMainPreflight({
    run: validFixture.run,
    validateStructure: async () => ({ ok: true }),
  });
  if (!exactMain.ok || exactMain.branch !== "codex/exact-main-fixture") throw new Error("exact-main self-test failed");

  const documents = {
    [DOCUMENT_PATHS.register]: { tasks: [{ taskId, executionAllowed: true, artifacts: artifactBindings }] },
    [DOCUMENT_PATHS.manifest]: manifestDocument,
    [DOCUMENT_PATHS.readinessState]: { taskOverrides: {} },
    [DOCUMENT_PATHS.reviewerRegistry]: reviewerRegistry,
    [DOCUMENT_PATHS.approvalRegistry]: {
      taskApprovals: {
        [taskId]: currentTaskApproval,
        "ZZ-999": { approvalRecord: { approvalsVerified: false } },
      },
    },
    [DOCUMENT_PATHS.ownerActionState]: ownerActionState,
  };
  const stageId = `P0-STAGE-${taskId}-SYNTHETIC`;
  const stageRequest = {
    taskId,
    scopeClass,
    actionClass,
    stageId,
    predecessorReceiptSha256: null,
    idempotencyKey: `P0-IDEMP-${taskId}-SYNTHETIC`,
  };
  const stageDefinition = {
    schemaVersion: "1.0.0",
    taskId,
    scopeClass,
    actionClass,
    stageId,
    predecessor: null,
    idempotencyKey: stageRequest.idempotencyKey,
    moduleId: "pc.synthetic",
    argumentSetId: "synthetic.v1",
    deadlineMs: MAX_SERIALIZABLE_STAGE_DEADLINE_MS,
  };
  const stageRecord = {
    taskId,
    stageId,
    scopeClass,
    actionClass,
    idempotencyKey: stageRequest.idempotencyKey,
    predecessorReceiptSha256: null,
    candidateRevision,
    dossierDigest: currentTaskApproval.candidate.dossierDigest,
    candidate: structuredClone(currentTaskApproval.candidate),
    artifactReviews: { trustedStageMarker: true },
    designCoverage: { trustedStageMarker: true },
    dependencyEvidence: [{ trustedStageMarker: true }],
    privateAuthority: null,
    openDecisions: [],
    specialistVetoes: [],
    preparationReviewId: `P0-PREP-${taskId}-SYNTHETIC`,
    preparationReviewSha256: "1".repeat(64),
    gateKind: "execute",
    independentQa: { result: "pass" },
    rollback: { snapshotReference: "rollback:synthetic-snapshot" },
    stageDefinitionSha256: `sha256:${sha256(canonicalJson(stageDefinition))}`,
    moduleId: "pc.synthetic",
    moduleSha256: sha256(implementationBytes),
  };
  const preparationReview = {
    preparationReviewId: stageRecord.preparationReviewId,
    trustedPreparationMarker: true,
  };
  let stageAdapterContext = null;
  let stageEvaluationSource = null;
  const gateBAuthorization = await verifyStageGateBAtExactMainCore(stageRequest, {
    exactMainResult: exactMain,
    run: validFixture.run,
    verifyStageRegistryContinuity: async () => ({
      ok: true,
      code: "STAGE_REGISTRY_CONTINUITY_VALID",
      registrySha256: "4".repeat(64),
    }),
    verifyStageHistory: async () => ({
      ok: true,
      record: structuredClone(stageRecord),
      preparationReview: structuredClone(preparationReview),
      preparationReviewSha256: stageRecord.preparationReviewSha256,
      stageApprovalSha256: "3".repeat(64),
      registrySha256: "4".repeat(64),
      preparationPublicationRevision: priorRevision,
      stagePublicationRevision: approvalRevision,
    }),
    readJson: async (_repoRoot, relativePath) => structuredClone(documents[relativePath]),
    loadEvaluationInput: async (context) => {
      stageAdapterContext = context;
      return {
        taskId,
        requestedScope: { scopeClass, actionClass },
        candidate: { revision: "9".repeat(40), untrustedLegacyMarker: true },
        artifactReviews: { untrustedLegacyMarker: true },
        designCoverage: { untrustedLegacyMarker: true },
        dependencyEvidence: [{ untrustedLegacyMarker: true }],
        privateAuthority: { untrustedLegacyMarker: true },
        openDecisions: ["untrusted legacy decision"],
        specialistVetoes: ["untrusted legacy veto"],
        council: { verdict: "ready-for-execution", seatVerdicts: { legacy: true } },
        approvalRecord: { approvalsVerified: true },
      };
    },
    evaluateStage: async (source) => {
      stageEvaluationSource = source;
      const stageFactsOnly = canonicalJson(source.taskInput.candidate) === canonicalJson(stageRecord.candidate)
        && canonicalJson(source.taskInput.artifactReviews) === canonicalJson(stageRecord.artifactReviews)
        && canonicalJson(source.taskInput.designCoverage) === canonicalJson(stageRecord.designCoverage)
        && canonicalJson(source.taskInput.dependencyEvidence) === canonicalJson(stageRecord.dependencyEvidence)
        && source.taskInput.privateAuthority === null
        && source.taskInput.openDecisions.length === 0
        && source.taskInput.specialistVetoes.length === 0
        && source.taskInput.approvalRecord === null
        && source.taskInput.council.verdict === "hold";
      return {
        executionAllowed: stageFactsOnly,
        decision: "Ready to execute — Gate B",
        gateResults: stageFactsOnly ? [] : [{ code: "LEGACY_STAGE_SUBSTITUTION", passed: false }],
        normalizedEvidence: { sourceFingerprint: sha256("trusted synthetic stage source") },
      };
    },
    resolveStageDefinition: () => structuredClone(stageDefinition),
    now: "2026-08-15T12:00:00.000Z",
  });
  const terminalHistory = await verifyStageTerminalHistoryAtExactMainCore(stageRequest, {
    exactMainResult: exactMain,
    run: validFixture.run,
    verifyStageRegistryContinuity: async () => ({
      ok: true,
      code: "STAGE_REGISTRY_CONTINUITY_VALID",
      registrySha256: "4".repeat(64),
    }),
    verifyStageHistory: async () => ({
      ok: true,
      record: structuredClone(stageRecord),
      preparationReview: structuredClone(preparationReview),
      preparationReviewSha256: stageRecord.preparationReviewSha256,
      stageApprovalSha256: "3".repeat(64),
      registrySha256: "4".repeat(64),
      preparationPublicationRevision: priorRevision,
      stagePublicationRevision: approvalRevision,
    }),
  });
  if (!gateBAuthorization.ok
    || gateBAuthorization.code !== "STAGE_GATE_B_READY"
    || Object.keys(stageAdapterContext?.approvalRegistry?.taskApprovals ?? {}).length !== 0
    || Object.hasOwn(stageAdapterContext?.readinessState?.taskOverrides?.[taskId] ?? {}, "requestedStageId")
    || stageEvaluationSource?.preparationReview?.trustedPreparationMarker !== true
    || stageEvaluationSource?.stage?.stageId !== stageId
    || gateBAuthorization.stageDefinitionSha256 !== stageRecord.stageDefinitionSha256
    || gateBAuthorization.moduleSha256 !== stageRecord.moduleSha256
    || gateBAuthorization.deadlineAt !== "2026-08-15T16:00:00.000Z"
    || terminalHistory.code !== "STAGE_TERMINAL_HISTORY_VALID"
    || terminalHistory.stageDefinitionSha256 !== stageRecord.stageDefinitionSha256
    || terminalHistory.moduleSha256 !== stageRecord.moduleSha256) {
    throw new Error("Gate B immutable-stage/no-legacy-approval self-test failed");
  }
  const overCeilingStageDefinition = {
    ...stageDefinition,
    deadlineMs: MAX_SERIALIZABLE_STAGE_DEADLINE_MS + 1,
  };
  const overCeilingDeadline = serializableStageDeadline({
    options: { resolveStageDefinition: () => overCeilingStageDefinition },
    evaluationInput: { requestedScope: { scopeClass, actionClass } },
    now: "2026-08-15T12:00:00.000Z",
    request: stageRequest,
    stage: {
      ...stageRecord,
      stageDefinitionSha256: `sha256:${sha256(canonicalJson(overCeilingStageDefinition))}`,
    },
  });
  if (overCeilingDeadline !== null) throw new Error("Gate B serializable deadline ceiling self-test failed");
  const deliveryTransitionTaskId = "SPK-R0-001";
  const deliveryTransitionStageId = `P0-STAGE-${deliveryTransitionTaskId}-STATUS-DELIVERY-TRANSITION`;
  const deliveryTransitionOverrideProbe = stageReadinessOverride({
    taskId: deliveryTransitionTaskId,
    stageId: deliveryTransitionStageId,
    scopeClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass,
    actionClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass,
  });
  if (deliveryTransitionOverrideProbe.requestedStageId !== deliveryTransitionStageId
    || deliveryTransitionOverrideProbe.requestedScopeClass !== DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass
    || deliveryTransitionOverrideProbe.requestedActionClass !== DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass) {
    throw new Error("Gate B delivery-transition readiness seam self-test failed");
  }
  const rejectedStageRegistryContinuity = await verifyStageGateBAtExactMainCore(stageRequest, {
    exactMainResult: exactMain,
    run: validFixture.run,
    verifyStageRegistryContinuity: async () => ({
      ok: false,
      code: "STAGE_REGISTRY_CONTINUITY_REWRITE",
    }),
  });
  if (rejectedStageRegistryContinuity.code !== "STAGE_REGISTRY_CONTINUITY_REWRITE") {
    throw new Error("Gate B global registry-continuity self-test failed");
  }
  const rejectedStageRegistryDigest = await verifyStageGateBAtExactMainCore(stageRequest, {
    exactMainResult: exactMain,
    run: validFixture.run,
    verifyStageRegistryContinuity: async () => ({
      ok: true,
      code: "STAGE_REGISTRY_CONTINUITY_VALID",
      registrySha256: "5".repeat(64),
    }),
    verifyStageHistory: async () => ({
      ok: true,
      registrySha256: "4".repeat(64),
    }),
  });
  if (rejectedStageRegistryDigest.code !== "STAGE_REGISTRY_CONTINUITY_DIGEST_MISMATCH") {
    throw new Error("Gate B registry-continuity digest self-test failed");
  }
  const withFixtureLock = async (_context, callback) => callback();
  const productionOverrideAttempt = await executeTaskFromExactMain({
    taskId,
    scopeClass,
    actionClass,
    execute: async () => ({ ok: true }),
    run: validFixture.run,
  });
  if (productionOverrideAttempt.code !== "TASK_PRODUCTION_OPTIONS_INVALID") {
    throw new Error("production API override self-test failed");
  }
  const productionDeadlineOverrideAttempt = await executeTaskFromExactMain({
    taskId,
    scopeClass,
    actionClass,
    execute: async () => ({ ok: true }),
    callbackDeadlineMs: 1,
  });
  if (productionDeadlineOverrideAttempt.code !== "TASK_PRODUCTION_OPTIONS_INVALID") {
    throw new Error("production callback-deadline override self-test failed");
  }
  let capturedTrustedFacts = null;
  let executedContext = null;
  const task = await verifyTaskExecutionStartCore("PC-001", {
    scopeClass,
    actionClass,
    exactMainResult: exactMain,
    run: validFixture.run,
    readJson: async (_repoRoot, relativePath) => structuredClone(documents[relativePath]),
    loadEvaluationInput: async () => ({
      taskId,
      outcome: manifestTask.description,
      requirementIds: manifestTask.requirementIds,
      dependencyRequirements: manifestTask.dependencies.map((dependencyId) => ({ dependencyId })),
      acceptanceEvidence: manifestTask.acceptanceEvidence,
      acceptanceScenarioIds: canonicalAcceptanceScenarioIds(taskId),
      requestedScope: { scopeClass, actionClass },
      candidate: structuredClone(currentTaskApproval.candidate),
      reviewerRegistry,
      ownerActionRequirements,
      approvalRecord: currentTaskApproval.approvalRecord,
    }),
    evaluate: async (input, trusted) => {
      capturedTrustedFacts = trusted;
      const publication = trusted.approvalPublication;
      const sourceTaskContractSha256 = computeTaskContractSha256({
        taskId: input.taskId,
        outcome: input.outcome,
        requirementIds: input.requirementIds,
        dependencyIds: input.dependencyRequirements.map((entry) => entry.dependencyId),
        acceptanceEvidence: input.acceptanceEvidence,
        acceptanceScenarioIds: input.acceptanceScenarioIds,
      });
      const allowed = trusted.now === "2026-08-15T12:00:00.000Z"
        && !Object.hasOwn(input, "approvalPublication")
        && !Object.hasOwn(input.approvalRecord, "revision")
        && trusted.candidatePublication.candidateBytesVerified === true
        && trusted.candidatePublication.publishedTaskFilesSha256 === taskFilesSha256
        && trusted.candidatePublication.currentTaskFilesSha256 === taskFilesSha256
        && trusted.candidatePublication.publishedTaskFilesBytesVerified === true
        && trusted.candidatePublication.currentTaskFilesBytesVerified === true
        && trusted.candidatePublication.publishedTaskFilesModesVerified === true
        && trusted.candidatePublication.currentTaskFilesModesVerified === true
        && trusted.candidatePublication.taskFilesCoverageVerified === true
        && trusted.candidatePublication.publishedTaskFileContentClassesVerified === true
        && trusted.candidatePublication.currentTaskFileContentClassesVerified === true
        && trusted.candidatePublication.publishedTaskFileArchivesVerified === true
        && trusted.candidatePublication.currentTaskFileArchivesVerified === true
        && trusted.candidatePublication.baseRevision === baseRevision
        && trusted.candidatePublication.baseAncestorOfCandidate === true
        && trusted.candidatePublication.candidateDiffTaskFilesSha256 === taskFilesSha256
        && trusted.candidatePublication.candidateDiffExactMatchVerified === true
        && trusted.candidatePublication.candidateDiffNoDeletionsVerified === true
        && trusted.candidatePublication.currentDescendantDeltaPathsVerified === true
        && trusted.candidatePublication.currentDescendantDeltaNoDeletionsVerified === true
        && trusted.candidatePublication.candidateTaskContractSha256 === taskContractSha256
        && trusted.candidatePublication.candidateTaskContractBytesVerified === true
        && publication.revision === approvalRevision
        && publication.publishedTaskApprovalSha256 === publication.currentTaskApprovalSha256
        && publication.publishedReviewerRegistrySha256 === publication.currentReviewerRegistrySha256
        && publication.publishedOwnerActionStateSha256 === publication.currentOwnerActionStateSha256
        && publication.publishedTaskContractSha256 === publication.currentTaskContractSha256
        && publication.currentTaskContractSha256 === sourceTaskContractSha256
        && trusted.activation.approvalPublicationRevision === approvalRevision
        && trusted.activation.taskFilesVerifiedAtRevision === mainRevision
        && trusted.activation.runtimeRequestedScopeClass === scopeClass
        && trusted.activation.runtimeRequestedActionClass === actionClass;
      return {
        executionAllowed: allowed,
        executionDecision: "Ready for local synthetic execution",
        gateResults: allowed ? [] : [{ code: "SELF_TEST", passed: false }],
      };
    },
    withExecutionLock: withFixtureLock,
    execute: async (context) => {
      executedContext = context;
      return { ok: true };
    },
    now: "2026-08-15T12:00:00.000Z",
  });
  if (!task.ok
    || task.scopeClass !== scopeClass
    || task.actionClass !== actionClass
    || executedContext?.scopeClass !== scopeClass
    || executedContext?.actionClass !== actionClass) {
    throw new Error("task-start self-test failed");
  }
  const activationProbe = evaluateReadiness({
    schemaVersion: READINESS_SCHEMA_VERSION,
    taskId,
    evaluationPhase: "activation",
    safety: { authenticMediaAccessed: false, privateNetworkAccessed: false },
    requestedScope: { scopeClass, actionClass },
    outcome: manifestTask.description,
    requirementIds: manifestTask.requirementIds,
    dependencyRequirements: manifestTask.dependencies.map((dependencyId) => ({ dependencyId })),
    acceptanceEvidence: manifestTask.acceptanceEvidence,
    acceptanceScenarioIds: canonicalAcceptanceScenarioIds(taskId),
    candidate: structuredClone(currentTaskApproval.candidate),
    approvalRecord: currentTaskApproval.approvalRecord,
  }, capturedTrustedFacts);
  const activationReachabilityGate = activationProbe.gateResults.find((gate) => gate.code === "ACTIVATION_APPROVAL_REACHABLE");
  if (activationReachabilityGate?.passed !== true) throw new Error("real evaluator activation binding self-test failed");
  const activationTaskFilesGate = activationProbe.gateResults.find((gate) => gate.code === "ACTIVATION_TASK_FILES");
  if (activationTaskFilesGate?.passed !== true) throw new Error("real evaluator activation task-files self-test failed");
  const activationRuntimeRequestGate = activationProbe.gateResults.find((gate) => gate.code === "ACTIVATION_RUNTIME_REQUEST");
  if (activationRuntimeRequestGate?.passed !== true) throw new Error("real evaluator runtime-request self-test failed");
  for (const code of [
    "CANDIDATE_TASK_FILES_FULL_DIFF",
    "CANDIDATE_DESCENDANT_DELTA",
    "CANDIDATE_TASK_CONTRACT_PUBLICATION",
  ]) {
    if (activationProbe.gateResults.find((gate) => gate.code === code)?.passed !== true) {
      throw new Error(`real evaluator ${code} self-test failed`);
    }
  }

  const derive = async (configuration = {}) => {
    const fixture = fixtureRun(configuration);
    return deriveApprovalPublicationFacts({
      repoRoot: DEFAULT_REPO_ROOT,
      run: fixture.run,
      taskId,
      approvalRegistry: documents[DOCUMENT_PATHS.approvalRegistry],
      candidateRevision,
      publishedRef: mainRevision,
      reviewerRegistry,
      ownerActionState,
      ownerActionRequirements,
    });
  };
  const candidateHasRecord = await derive({ candidateApproval: differentTaskApproval });
  if (candidateHasRecord.code !== "APPROVAL_PUBLICATION_CANDIDATE_SELF_REFERENCE") throw new Error("candidate-record self-test failed");
  const priorRecord = await derive({ priorApproval: differentTaskApproval });
  if (priorRecord.code !== "APPROVAL_PUBLICATION_HISTORY_REWRITE") throw new Error("prior-record self-test failed");
  const mutationRevert = await derive({ mutateThenRevert: true });
  if (mutationRevert.code !== "APPROVAL_PUBLICATION_HISTORY_REWRITE") throw new Error("mutation/revert self-test failed");
  const alteredBytes = await derive({ alteredPublicationBytes: true });
  if (alteredBytes.code !== "APPROVAL_PUBLICATION_BYTES_MISMATCH") throw new Error("altered-publication self-test failed");
  const wrongAncestry = await derive({ wrongAncestry: true });
  if (wrongAncestry.code !== "APPROVAL_PUBLICATION_ANCESTRY_INVALID") throw new Error("approval-ancestry self-test failed");
  const reviewerChanged = await derive({ reviewerChangedAfterApproval: true });
  if (reviewerChanged.code !== "APPROVAL_PUBLICATION_REVIEWER_STATE_MISMATCH") throw new Error("reviewer-state self-test failed");
  const ownerActionChanged = await derive({ ownerActionChangedAfterApproval: true });
  if (ownerActionChanged.code !== "APPROVAL_PUBLICATION_OWNER_ACTION_STATE_MISMATCH") throw new Error("owner-action-state self-test failed");
  const taskContractChanged = await derive({ taskContractChangedAfterApproval: true });
  if (taskContractChanged.code !== "APPROVAL_PUBLICATION_TASK_CONTRACT_MISMATCH") throw new Error("task-contract self-test failed");

  const runTaskFixture = async (configuration = {}, {
    approval = currentTaskApproval,
    runtimeScopeClass = scopeClass,
    runtimeActionClass = actionClass,
    execute = true,
    executeResult = { ok: true },
    executeCallback = null,
    callbackDeadlineMs = undefined,
    evaluateCallback = null,
    executionLock = withFixtureLock,
  } = {}) => {
    const fixture = fixtureRun({ ...configuration, currentApprovalOverride: approval });
    const fixtureExactMain = await verifyExactMainPreflight({
      run: fixture.run,
      validateStructure: async () => ({ ok: true }),
    });
    const fixtureDocuments = structuredClone(documents);
    fixtureDocuments[DOCUMENT_PATHS.approvalRegistry].taskApprovals[taskId] = structuredClone(approval);
    return verifyTaskExecutionStartCore(taskId, {
      scopeClass: runtimeScopeClass,
      actionClass: runtimeActionClass,
      exactMainResult: fixtureExactMain,
      run: fixture.run,
      readJson: async (_repoRoot, relativePath) => structuredClone(fixtureDocuments[relativePath]),
      loadEvaluationInput: async () => ({
        taskId,
        requestedScope: { scopeClass, actionClass },
        reviewerRegistry,
        ownerActionRequirements,
        approvalRecord: approval.approvalRecord,
      }),
      evaluate: evaluateCallback ?? (async () => ({ executionAllowed: true, executionDecision: "Ready", gateResults: [] })),
      withExecutionLock: executionLock,
      ...(execute ? { execute: executeCallback ?? (async () => executeResult) } : {}),
      ...(callbackDeadlineMs === undefined ? {} : { callbackDeadlineMs }),
      now: "2026-08-15T12:00:00.000Z",
    });
  };

  for (const [label, configuration, settings, expectedCode] of [
    ["candidate-contract-drift", { candidateTaskContractChanged: true }, { approval: changedContractTaskApproval }, "TASK_CANDIDATE_TASK_CONTRACT_UNVERIFIED"],
    ["omitted-candidate-diff", { omittedCandidateDiffPath: true }, {}, "TASK_CANDIDATE_TASK_FILES_UNVERIFIED"],
    ["candidate-mode-mismatch", { candidateModeMismatch: true }, {}, "TASK_CANDIDATE_TASK_FILES_UNVERIFIED"],
    ["descendant-mode-drift", { descendantModeDrift: true }, {}, "TASK_CANDIDATE_TASK_FILES_UNVERIFIED"],
    ["invalid-utf8-collision", { invalidUtf8CollisionDrift: true }, {}, "TASK_CANDIDATE_TASK_FILES_UNVERIFIED"],
    ["binary-photo-disguised-as-text", { disguisedBinaryText: true }, { approval: disguisedBinaryTaskApproval }, "TASK_CANDIDATE_TASK_FILES_UNVERIFIED"],
    ["encoded-photo-disguised-as-text", { encodedMediaText: true }, { approval: encodedMediaTaskApproval }, "TASK_CANDIDATE_TASK_FILES_UNVERIFIED"],
    ["malformed-xlsx", { malformedArchive: true }, { approval: malformedArchiveTaskApproval }, "TASK_CANDIDATE_TASK_FILES_UNVERIFIED"],
    ["wrong-base-parent", { wrongBaseParent: true }, {}, "TASK_CANDIDATE_BYTES_UNVERIFIED"],
    ["multiple-candidate-parents", { multipleCandidateParents: true }, {}, "TASK_CANDIDATE_BYTES_UNVERIFIED"],
    ["wrong-action", {}, { runtimeActionClass: "synthetic-foundation" }, "TASK_REQUESTED_ACTION_MISMATCH"],
    ["wrong-scope", {}, { runtimeScopeClass: "private-execution", runtimeActionClass: "private-system-read" }, "TASK_REQUESTED_ACTION_MISMATCH"],
    ["standalone-token", {}, { execute: false }, "TASK_EXECUTION_CALLBACK_REQUIRED"],
    ["missing-completion-receipt", {}, { executeResult: null }, "TASK_BOUNDED_ACTION_FAILED"],
    ["moving-origin", { originMovesOnFinalFetch: true }, {}, "PREFLIGHT_EXACT_MAIN"],
    ["origin-moves-during-callback", { originMovesAfterCallback: true }, {}, "PREFLIGHT_EXACT_MAIN"],
  ]) {
    const result = await runTaskFixture(configuration, settings);
    if (result.code !== expectedCode) throw new Error(`${label} self-test failed: ${result.code}`);
  }

  let deadlineContext = null;
  let cancellationObserved = false;
  const callbackDeadline = await runTaskFixture({}, {
    callbackDeadlineMs: 5,
    executeCallback: async (context) => {
      deadlineContext = context;
      return new Promise((resolve) => {
        const cancelled = () => {
          cancellationObserved = true;
          resolve({ ok: true });
        };
        if (context.signal.aborted) cancelled();
        else context.signal.addEventListener("abort", cancelled, { once: true });
      });
    },
  });
  if (callbackDeadline.code !== "TASK_BOUNDED_ACTION_DEADLINE_EXCEEDED"
    || cancellationObserved !== true
    || deadlineContext?.signal?.aborted !== true
    || deadlineContext?.deadlineAt !== "2026-08-15T12:00:00.005Z"
    || !Object.isFrozen(deadlineContext)
    || Object.keys(deadlineContext).sort().join(",") !== "actionClass,deadlineAt,revision,scopeClass,signal,taskId") {
    throw new Error("callback deadline/cancellation self-test failed");
  }

  let blockedDeadlineContext = null;
  const blockedPastDeadline = await runTaskFixture({}, {
    callbackDeadlineMs: 1,
    executeCallback: async (context) => {
      blockedDeadlineContext = context;
      const stopAt = process.hrtime.bigint() + 5_000_000n;
      while (process.hrtime.bigint() < stopAt) {
        // Deliberately block the event loop to prove elapsed time is enforced
        // even when the deadline timer cannot run before the callback returns.
      }
      return { ok: true };
    },
  });
  if (blockedPastDeadline.code !== "TASK_BOUNDED_ACTION_DEADLINE_EXCEEDED"
    || blockedDeadlineContext?.signal?.aborted !== true
    || blockedDeadlineContext?.signal?.reason !== "callback-deadline-exceeded") {
    throw new Error("blocked callback deadline self-test failed");
  }

  const delay = (durationMs) => new Promise((resolve) => setTimeout(resolve, durationMs));
  let ignoringLockHeld = false;
  let ignoringLockReleased = false;
  let ignoringCallbackSettled = false;
  let ignoringContext = null;
  let ignoringVerifierReturned = false;
  let ignoringEvaluationCount = 0;
  let markIgnoringCallbackStarted;
  const ignoringCallbackStarted = new Promise((resolve) => {
    markIgnoringCallbackStarted = resolve;
  });
  const ignoringExecutionLock = async (_context, callback) => {
    ignoringLockHeld = true;
    try {
      return await callback();
    } finally {
      ignoringLockHeld = false;
      ignoringLockReleased = true;
    }
  };
  const abortIgnoringResultPromise = runTaskFixture({}, {
    callbackDeadlineMs: 5,
    executionLock: ignoringExecutionLock,
    evaluateCallback: async () => {
      ignoringEvaluationCount += 1;
      return { executionAllowed: true, executionDecision: "Ready", gateResults: [] };
    },
    executeCallback: async (context) => {
      ignoringContext = context;
      markIgnoringCallbackStarted();
      await delay(30);
      ignoringCallbackSettled = true;
      return { ok: true };
    },
  }).then((result) => {
    ignoringVerifierReturned = true;
    return result;
  });
  await ignoringCallbackStarted;
  await delay(12);
  if (ignoringVerifierReturned
    || ignoringCallbackSettled
    || ignoringLockHeld !== true
    || ignoringLockReleased
    || ignoringContext?.signal?.aborted !== true) {
    throw new Error("abort-ignoring callback escaped the execution lock self-test failed");
  }
  const abortIgnoringResult = await abortIgnoringResultPromise;
  if (abortIgnoringResult.code !== "TASK_BOUNDED_ACTION_DEADLINE_EXCEEDED"
    || ignoringCallbackSettled !== true
    || ignoringLockHeld
    || ignoringLockReleased !== true
    || ignoringEvaluationCount !== 3
    || abortIgnoringResult.callbackSettlementObserved !== true
    || abortIgnoringResult.executionLockRetainedUntilSettlement !== true) {
    throw new Error("abort-ignoring callback settlement self-test failed");
  }

  let cleanupLockHeld = false;
  let cleanupLockReleased = false;
  let cleanupStarted = false;
  let cleanupCompleted = false;
  let cleanupVerifierReturned = false;
  let cleanupEvaluationCount = 0;
  let markCleanupStarted;
  const cleanupStartedSignal = new Promise((resolve) => {
    markCleanupStarted = resolve;
  });
  const cleanupExecutionLock = async (_context, callback) => {
    cleanupLockHeld = true;
    try {
      return await callback();
    } finally {
      cleanupLockHeld = false;
      cleanupLockReleased = true;
    }
  };
  const delayedCleanupResultPromise = runTaskFixture({}, {
    callbackDeadlineMs: 5,
    executionLock: cleanupExecutionLock,
    evaluateCallback: async () => {
      cleanupEvaluationCount += 1;
      return { executionAllowed: true, executionDecision: "Ready", gateResults: [] };
    },
    executeCallback: async (context) => {
      try {
        await new Promise((resolve) => {
          if (context.signal.aborted) resolve();
          else context.signal.addEventListener("abort", resolve, { once: true });
        });
      } finally {
        cleanupStarted = true;
        markCleanupStarted();
        await delay(25);
        cleanupCompleted = true;
      }
      return { ok: true };
    },
  }).then((result) => {
    cleanupVerifierReturned = true;
    return result;
  });
  await cleanupStartedSignal;
  if (cleanupStarted !== true
    || cleanupCompleted
    || cleanupVerifierReturned
    || cleanupLockHeld !== true
    || cleanupLockReleased) {
    throw new Error("delayed callback cleanup escaped the execution lock self-test failed");
  }
  const delayedCleanupResult = await delayedCleanupResultPromise;
  if (delayedCleanupResult.code !== "TASK_BOUNDED_ACTION_DEADLINE_EXCEEDED"
    || cleanupCompleted !== true
    || cleanupLockHeld
    || cleanupLockReleased !== true
    || cleanupEvaluationCount !== 3
    || delayedCleanupResult.callbackSettlementObserved !== true
    || delayedCleanupResult.executionLockRetainedUntilSettlement !== true) {
    throw new Error("delayed callback cleanup settlement self-test failed");
  }

  const driftFixture = fixtureRun({ descendantTaskFileDrift: true });
  const driftExactMain = await verifyExactMainPreflight({
    run: driftFixture.run,
    validateStructure: async () => ({ ok: true }),
  });
  const descendantCodeDrift = await verifyTaskExecutionStartCore(taskId, {
    scopeClass,
    actionClass,
    exactMainResult: driftExactMain,
    run: driftFixture.run,
    readJson: async (_repoRoot, relativePath) => structuredClone(documents[relativePath]),
    loadEvaluationInput: async () => ({ taskId }),
    evaluate: async () => ({ executionAllowed: true, executionDecision: "Ready", gateResults: [] }),
    now: "2026-08-15T12:00:00.000Z",
  });
  if (descendantCodeDrift.code !== "TASK_CANDIDATE_TASK_FILES_UNVERIFIED") {
    throw new Error("descendant-code-drift self-test failed");
  }

  for (const [configuration, expectedCode] of [
    [{ dirty: true }, "PREFLIGHT_DIRTY"],
    [{ stale: true }, "PREFLIGHT_EXACT_MAIN"],
  ]) {
    const fixture = fixtureRun(configuration);
    const result = await verifyExactMainPreflight({ run: fixture.run, validateStructure: async () => ({ ok: true }) });
    if (result.code !== expectedCode) throw new Error(`${expectedCode} self-test failed`);
  }

  const mutationFixture = fixtureRun();
  const mutationExactMain = await verifyExactMainPreflight({
    run: mutationFixture.run,
    validateStructure: async () => ({ ok: true }),
  });
  mutationFixture.setPostPreflightDirty(true);
  const postPreflightMutation = await verifyTaskExecutionStartCore(taskId, {
    scopeClass,
    actionClass,
    exactMainResult: mutationExactMain,
    run: mutationFixture.run,
    readJson: async (_repoRoot, relativePath) => structuredClone(documents[relativePath]),
    loadEvaluationInput: async () => ({
      taskId,
      requestedScope: { scopeClass, actionClass },
      reviewerRegistry,
      ownerActionRequirements,
      approvalRecord: currentTaskApproval.approvalRecord,
    }),
    evaluate: async () => ({ executionAllowed: true, executionDecision: "Ready", gateResults: [] }),
    withExecutionLock: withFixtureLock,
    execute: async () => ({ ok: true }),
    now: "2026-08-15T12:00:00.000Z",
  });
  if (postPreflightMutation.code !== "PREFLIGHT_DIRTY") throw new Error("post-preflight mutation self-test failed");

  const expiryFixture = fixtureRun();
  const expiryExactMain = await verifyExactMainPreflight({
    run: expiryFixture.run,
    validateStructure: async () => ({ ok: true }),
  });
  const expiryScopeClass = "private-execution";
  const expiryActionClass = "private-system-read";
  const clockValues = [
    "2026-08-15T11:59:59.998Z",
    "2026-08-15T11:59:59.999Z",
    "2026-08-15T12:00:00.001Z",
  ];
  let nearExpiryCallbackCompleted = false;
  let nearExpiryContext = null;
  const nearExpiry = await verifyTaskExecutionStartCore(taskId, {
    scopeClass: expiryScopeClass,
    actionClass: expiryActionClass,
    exactMainResult: expiryExactMain,
    run: expiryFixture.run,
    readJson: async (_repoRoot, relativePath) => structuredClone(documents[relativePath]),
    loadEvaluationInput: async () => ({
      taskId,
      requestedScope: { scopeClass: expiryScopeClass, actionClass: expiryActionClass },
      privateAuthority: { windowEnd: "2026-08-15T12:00:00.000Z" },
      reviewerRegistry,
      ownerActionRequirements,
      approvalRecord: currentTaskApproval.approvalRecord,
    }),
    evaluate: async (_input, { now }) => {
      const allowed = Date.parse(now) <= Date.parse("2026-08-15T12:00:00.000Z");
      return {
        executionAllowed: allowed,
        executionDecision: allowed ? "Ready" : "Hold",
        gateResults: allowed ? [] : [{ code: "PRIVATE_AUTHORITY_WINDOW", passed: false }],
      };
    },
    withExecutionLock: withFixtureLock,
    execute: async (context) => {
      nearExpiryContext = context;
      nearExpiryCallbackCompleted = true;
      return { ok: true };
    },
    clock: () => clockValues.shift(),
  });
  if (nearExpiry.code !== "TASK_RUNTIME_PERMISSION_DENIED"
    || !nearExpiry.failedGateCodes?.includes("PRIVATE_AUTHORITY_WINDOW")
    || nearExpiryCallbackCompleted !== true
    || nearExpiryContext?.deadlineAt !== "2026-08-15T12:00:00.000Z"
    || nearExpiryContext?.signal?.aborted !== true
    || nearExpiryContext?.signal?.reason !== "callback-authority-invalidated"
    || clockValues.length !== 0) {
    throw new Error("advancing-clock near-expiry self-test failed");
  }

  return { ok: true, code: "SELF_TEST_OK", cases: 66 };
}

function usage() {
  return "Usage: node tools/P0-verify-execution-start.mjs --task <TASK-ID> --scope <SCOPE-CLASS> --action <ACTION-CLASS>\n       node tools/P0-verify-execution-start.mjs --self-test";
}

async function main(argv) {
  if (argv.length === 1 && argv[0] === "--self-test") return selfTest();
  if (argv.length === 1 && argv[0] === "--help") return { ok: true, code: "HELP", usage: usage() };
  if (argv.length !== 6) {
    return { ...fail("TASK_ID_INVALID", "task-start"), usage: usage() };
  }
  const flags = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    if (!/^--(?:task|scope|action)$/.test(argv[index]) || flags.has(argv[index])) {
      return { ...fail("TASK_ID_INVALID", "task-start"), usage: usage() };
    }
    flags.set(argv[index], argv[index + 1]);
  }
  if (!["--task", "--scope", "--action"].every((flag) => flags.has(flag))) {
    return { ...fail("TASK_ID_INVALID", "task-start"), usage: usage() };
  }
  return executeTaskFromExactMain({
    taskId: flags.get("--task"),
    scopeClass: flags.get("--scope"),
    actionClass: flags.get("--action"),
  });
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const result = await main(process.argv.slice(2));
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}
