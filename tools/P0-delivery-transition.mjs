import crypto from "node:crypto";
import { lstat, mkdir, mkdtemp, open, readdir, readFile, rmdir, rm, symlink, unlink } from "node:fs/promises";
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
  buildProjectionSnapshot,
  buildProjectionTransitionObservation,
  buildTransitionTarget,
  HISTORICAL_NON_TRANSITION_TASK_IDS,
  issueStateFor,
  P0_R0_SUBSTANTIVE_TASK_IDS,
  snapshotMatches,
  statusLabelFor,
} from "./P0-github-projection-model.mjs";
import { DELIVERY_TRANSITION_GATE_B_CONTRACT } from "./P0-readiness-gates.mjs";
import { FROZEN_SNAPSHOT_SHA256 } from "./P0-verify-r1-r10-freeze.mjs";

export const DELIVERY_TRANSITION_SCHEMA_VERSION = "1.0.0";
export const DELIVERY_TRANSITION_APPLY_ENABLED = false;

const FULL_REVISION = /^[0-9a-f]{40}$/;
const SHA256_DIGEST = /^sha256:[0-9a-f]{64}$/;
const STAGE_ID = /^P0-STAGE-[A-Z0-9]+(?:-[A-Z0-9]+){2,}-[A-Z0-9][A-Z0-9-]{2,63}$/;
const INPUT_KEYS = Object.freeze([
  "schemaVersion",
  "taskId",
  "sourceRevision",
  "sourceTaskStatus",
  "targetStatus",
  "authorization",
  "rollback",
  "liveProjection",
]);
const AUTHORIZATION_KEYS = Object.freeze([
  "ok", "scope", "code", "taskId", "stageId", "scopeClass", "actionClass", "sourceRevision",
  "candidateRevision", "dossierDigest", "preparationReviewId", "preparationReviewSha256", "gateKind",
  "predecessorReceiptSha256", "idempotencyKey", "stageApprovalSha256", "registrySha256",
  "stageDefinitionSha256", "moduleId", "moduleSha256", "gateSourceFingerprint", "deadlineAt",
  "gateDecision", "independentQaResult", "rollbackSnapshotReference",
]);
const ROLLBACK_KEYS = Object.freeze(["preChangeSnapshotDigest", "recoveryPlanDigest", "rehearsalResult"]);
const PUBLIC_APPLY_KEYS = Object.freeze(["reviewedPlanDigest"]);
const PLAN_KEYS = Object.freeze([
  "schemaVersion", "mode", "taskId", "sourceRevision", "freezeSnapshotSha256", "stageId", "scopeClass", "actionClass", "candidateRevision",
  "preparationReviewId", "preparationReviewSha256", "stageApprovalSha256", "registrySha256",
  "stageDefinitionSha256", "moduleId", "moduleSha256", "gateKind", "gateDecision", "fromStatus", "toStatus", "preimageDigest", "targetSnapshotDigest",
  "protectedIssueDigest", "protectedProjectDigest", "authorizationDigest", "rollbackSnapshotReference", "recoveryPlanDigest",
  "operations", "rollbackOperations", "verification", "forbiddenSurfaces",
]);
const OPERATION_KEYS = Object.freeze(["surface", "from", "to"]);
const LABEL_OPERATION_KEYS = Object.freeze(["surface", "remove", "add"]);
const VERIFICATION_KEYS = Object.freeze(["immediateSnapshots", "quiescentSnapshots", "quiescenceIntervalMs"]);
const FROZEN_PARITY_KEYS = Object.freeze(["ok", "taskCount", "snapshotSha256"]);
const TASK_LOCK_KEYS = Object.freeze(["schemaVersion", "taskId", "planDigest", "ownerNonce"]);
const DELIVERY_FORBIDDEN_SURFACES = Object.freeze([
  "issue-title",
  "issue-body",
  "issue-milestone",
  "issue-non-status-label",
  "project-non-status-field",
  "project-field-definition",
  "project-view",
  "project-workflow",
  "project-item",
]);
const SAGA_EVENT = /^\d{4}-[a-z][a-z0-9-]{2,63}\.json$/;
const SAGA_STATES = new Set([
  "declared", "operation-intent", "operation-complete", "verification-pending",
  "verification-complete",
  "recovery-start", "rollback-intent", "rollback-complete", "rolled-back",
  "recovery-required", "applied-verified",
]);
const SAGA_COMMON_KEYS = Object.freeze([
  "schemaVersion", "planDigest", "occurredAt", "state", "taskId", "previousEventSha256", "eventSha256",
]);
const SAGA_EVENT_EXTRA_KEYS = Object.freeze({
  declared: Object.freeze([]),
  "operation-intent": Object.freeze(["operationIndex", "surface"]),
  "operation-complete": Object.freeze(["operationIndex", "surface"]),
  "verification-pending": Object.freeze([]),
  "verification-complete": Object.freeze([
    "boundary", "snapshotDigest", "protectedIssueDigest", "protectedProjectDigest", "authorizationDigest",
  ]),
  "recovery-start": Object.freeze([]),
  "rollback-intent": Object.freeze(["operationIndex", "surface"]),
  "rollback-complete": Object.freeze(["operationIndex", "surface"]),
  "rolled-back": Object.freeze([]),
  "recovery-required": Object.freeze([]),
  "applied-verified": Object.freeze(["verificationReceiptsSha256"]),
});
const QUIESCENCE_INTERVAL_MS = 1_000;
const MAX_SAGA_EVENT_BYTES = 64 * 1024;

function sha256(value) {
  return `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
}

function result(ok, code, details = {}) {
  const value = Object.freeze({ ok, code, ...details });
  if (!sanitizedResultIsSafe(value)) return Object.freeze({ ok: false, code: "TRANSITION_PUBLIC_RESULT_REJECTED" });
  return value;
}

function isDedicatedDeliveryTransitionStage(stageId, taskId) {
  return STAGE_ID.test(stageId ?? "")
    && typeof taskId === "string"
    && stageId.startsWith(`P0-STAGE-${taskId}-`)
    && stageId.endsWith(DELIVERY_TRANSITION_GATE_B_CONTRACT.stageIdSuffix);
}

function rollbackSnapshotReferenceIsValid(value) {
  return typeof value === "string"
    && /^[a-z][a-z0-9-]*:[A-Za-z0-9._/-]{4,160}$/.test(value)
    && !value.split(/[:/]/).includes("..")
    && publicTextBytesAreSafe(value);
}

function validateAuthorization(authorization, input) {
  const expectedGate = {
    Next: {
      scope: "stage-gate-b",
      code: "STAGE_GATE_B_READY",
      gateKind: "execute",
      gateDecision: "Ready to execute — Gate B",
      independentQaResult: "pass",
    },
    "In progress": {
      scope: "stage-gate-b",
      code: "STAGE_GATE_B_READY",
      gateKind: "execute",
      gateDecision: "Ready to execute — Gate B",
      independentQaResult: "pass",
    },
    Done: {
      scope: "stage-gate-b",
      code: "STAGE_GATE_B_READY",
      gateKind: "accept",
      gateDecision: "Ready to accept — Gate B",
      independentQaResult: "pass",
    },
  }[input.targetStatus];
  return expectedGate !== undefined
    && hasExactKeys(authorization, AUTHORIZATION_KEYS)
    && authorization.ok === true
    && authorization.scope === expectedGate.scope
    && authorization.code === expectedGate.code
    && authorization.taskId === input.taskId
    && authorization.sourceRevision === input.sourceRevision
    && isDedicatedDeliveryTransitionStage(authorization.stageId, input.taskId)
    && authorization.scopeClass === DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass
    && authorization.actionClass === DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass
    && FULL_REVISION.test(authorization.candidateRevision ?? "")
    && /^[0-9a-f]{64}$/.test(authorization.dossierDigest ?? "")
    && /^P0-PREP-[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(authorization.preparationReviewId ?? "")
    && /^[0-9a-f]{64}$/.test(authorization.preparationReviewSha256 ?? "")
    && authorization.gateKind === expectedGate.gateKind
    && authorization.gateDecision === expectedGate.gateDecision
    && authorization.independentQaResult === expectedGate.independentQaResult
    && (authorization.predecessorReceiptSha256 === null
      || SHA256_DIGEST.test(authorization.predecessorReceiptSha256 ?? ""))
    && /^P0-IDEMP-[A-Za-z0-9][A-Za-z0-9._:-]{15,111}$/.test(authorization.idempotencyKey ?? "")
    && /^[0-9a-f]{64}$/.test(authorization.stageApprovalSha256 ?? "")
    && SHA256_DIGEST.test(authorization.stageDefinitionSha256 ?? "")
    && authorization.moduleId === DELIVERY_TRANSITION_GATE_B_CONTRACT.moduleId
    && SHA256_DIGEST.test(authorization.moduleSha256 ?? "")
    && /^[0-9a-f]{64}$/.test(authorization.registrySha256 ?? "")
    && SHA256_DIGEST.test(authorization.gateSourceFingerprint ?? "")
    && rollbackSnapshotReferenceIsValid(authorization.rollbackSnapshotReference)
    && Number.isFinite(Date.parse(authorization.deadlineAt ?? ""));
}

function stableAuthorization(authorization) {
  return Object.fromEntries(Object.entries(authorization).filter(([key]) => key !== "deadlineAt"));
}

function validateRollback(rollback, preimageDigest) {
  return hasExactKeys(rollback, ROLLBACK_KEYS)
    && rollback.preChangeSnapshotDigest === preimageDigest
    && SHA256_DIGEST.test(rollback.recoveryPlanDigest ?? "")
    && rollback.rehearsalResult === "pass";
}

function targetProjectionInput(input, target) {
  return {
    ...input.liveProjection,
    taskStatus: input.targetStatus,
    issue: {
      ...input.liveProjection.issue,
      state: target.issueState,
      labels: input.liveProjection.issue.labels.map((label) => (
        label === target.removeStatusLabel ? target.addStatusLabel : label
      )),
    },
    projectItem: {
      ...input.liveProjection.projectItem,
      status: target.projectStatus,
    },
  };
}

/** Build a deterministic, sanitized, mutation-free delivery transition plan. */
export function createDeliveryTransitionDryRun(input) {
  if (!hasExactKeys(input, INPUT_KEYS)
    || input.schemaVersion !== DELIVERY_TRANSITION_SCHEMA_VERSION
    || typeof input.taskId !== "string"
    || !FULL_REVISION.test(input.sourceRevision ?? "")
    || typeof input.sourceTaskStatus !== "string"
    || typeof input.targetStatus !== "string"
    || input.liveProjection?.taskId !== input.taskId
    || input.liveProjection?.sourceRevision !== input.sourceRevision) {
    return result(false, "TRANSITION_INPUT_SHAPE_INVALID");
  }
  if (HISTORICAL_NON_TRANSITION_TASK_IDS.includes(input.taskId)) {
    return result(false, "TRANSITION_HISTORICAL_TASK_LOCKED", { taskId: input.taskId });
  }
  if (!P0_R0_SUBSTANTIVE_TASK_IDS.includes(input.taskId)) {
    return result(false, "TRANSITION_TASK_NOT_ALLOWLISTED", { taskId: input.taskId });
  }
  const preimage = buildProjectionSnapshot(input.liveProjection);
  if (!preimage.ok) return result(false, preimage.code, { taskId: input.taskId });
  if (input.sourceTaskStatus !== preimage.snapshot.taskStatus) {
    return result(false, "TRANSITION_SOURCE_PREIMAGE_MISMATCH", { taskId: input.taskId });
  }
  const targetResult = buildTransitionTarget({
    taskId: input.taskId,
    fromStatus: preimage.snapshot.taskStatus,
    toStatus: input.targetStatus,
  });
  if (!targetResult.ok) return result(false, targetResult.code, { taskId: input.taskId });
  if (!validateAuthorization(input.authorization, input)) {
    return result(false, "TRANSITION_GATE_B_AUTHORIZATION_INVALID", { taskId: input.taskId });
  }
  if (!validateRollback(input.rollback, preimage.snapshotDigest)) {
    return result(false, "TRANSITION_ROLLBACK_INVALID", { taskId: input.taskId });
  }
  const targetProjection = buildProjectionSnapshot(targetProjectionInput(input, targetResult.target));
  if (!targetProjection.ok) return result(false, "TRANSITION_TARGET_PROJECTION_INVALID", { taskId: input.taskId });

  const operations = Object.freeze([
    Object.freeze({ surface: "project-status", from: preimage.snapshot.projectStatus, to: targetResult.target.projectStatus }),
    Object.freeze({ surface: "issue-state", from: preimage.snapshot.issueState, to: targetResult.target.issueState }),
    Object.freeze({
      surface: "issue-status-label",
      remove: targetResult.target.removeStatusLabel,
      add: targetResult.target.addStatusLabel,
    }),
  ]);
  const rollbackOperations = Object.freeze([
    Object.freeze({
      surface: "issue-status-label",
      remove: targetResult.target.addStatusLabel,
      add: targetResult.target.removeStatusLabel,
    }),
    Object.freeze({ surface: "issue-state", from: targetResult.target.issueState, to: preimage.snapshot.issueState }),
    Object.freeze({ surface: "project-status", from: targetResult.target.projectStatus, to: preimage.snapshot.projectStatus }),
  ]);
  const plan = Object.freeze({
    schemaVersion: DELIVERY_TRANSITION_SCHEMA_VERSION,
    mode: "reviewed-dry-run",
    taskId: input.taskId,
    sourceRevision: input.sourceRevision,
    freezeSnapshotSha256: FROZEN_SNAPSHOT_SHA256,
    stageId: input.authorization.stageId,
    scopeClass: input.authorization.scopeClass,
    actionClass: input.authorization.actionClass,
    candidateRevision: input.authorization.candidateRevision,
    preparationReviewId: input.authorization.preparationReviewId,
    preparationReviewSha256: input.authorization.preparationReviewSha256,
    stageApprovalSha256: input.authorization.stageApprovalSha256,
    registrySha256: input.authorization.registrySha256,
    stageDefinitionSha256: input.authorization.stageDefinitionSha256,
    moduleId: input.authorization.moduleId,
    moduleSha256: input.authorization.moduleSha256,
    gateKind: input.authorization.gateKind,
    gateDecision: input.authorization.gateDecision,
    fromStatus: preimage.snapshot.taskStatus,
    toStatus: input.targetStatus,
    preimageDigest: preimage.snapshotDigest,
    targetSnapshotDigest: targetProjection.snapshotDigest,
    protectedIssueDigest: preimage.snapshot.protectedIssueDigest,
    protectedProjectDigest: preimage.snapshot.protectedProjectDigest,
    authorizationDigest: sha256(canonicalJson(stableAuthorization(input.authorization))),
    rollbackSnapshotReference: input.authorization.rollbackSnapshotReference,
    recoveryPlanDigest: input.rollback.recoveryPlanDigest,
    operations,
    rollbackOperations,
    verification: Object.freeze({ immediateSnapshots: 1, quiescentSnapshots: 2, quiescenceIntervalMs: QUIESCENCE_INTERVAL_MS }),
    forbiddenSurfaces: DELIVERY_FORBIDDEN_SURFACES,
  });
  const planDigest = sha256(canonicalJson(plan));
  return Object.freeze({
    ok: true,
    code: "TRANSITION_DRY_RUN_READY",
    plan,
    planDigest,
  });
}

function planIsStructurallyBound(planEnvelope) {
  if (planEnvelope?.ok !== true
    || planEnvelope.code !== "TRANSITION_DRY_RUN_READY"
    || !SHA256_DIGEST.test(planEnvelope.planDigest ?? "")
    || planEnvelope.planDigest !== sha256(canonicalJson(planEnvelope.plan))) return false;
  const plan = planEnvelope.plan;
  if (!(hasExactKeys(plan, PLAN_KEYS)
    && plan.schemaVersion === DELIVERY_TRANSITION_SCHEMA_VERSION
    && plan.mode === "reviewed-dry-run"
    && P0_R0_SUBSTANTIVE_TASK_IDS.includes(plan.taskId)
    && FULL_REVISION.test(plan.sourceRevision ?? "")
    && plan.freezeSnapshotSha256 === FROZEN_SNAPSHOT_SHA256
    && isDedicatedDeliveryTransitionStage(plan.stageId, plan.taskId)
    && plan.scopeClass === DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass
    && plan.actionClass === DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass
    && FULL_REVISION.test(plan.candidateRevision ?? "")
    && /^P0-PREP-[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(plan.preparationReviewId ?? "")
    && /^[0-9a-f]{64}$/.test(plan.preparationReviewSha256 ?? "")
    && /^[0-9a-f]{64}$/.test(plan.stageApprovalSha256 ?? "")
    && /^[0-9a-f]{64}$/.test(plan.registrySha256 ?? "")
    && SHA256_DIGEST.test(plan.stageDefinitionSha256 ?? "")
    && plan.moduleId === DELIVERY_TRANSITION_GATE_B_CONTRACT.moduleId
    && SHA256_DIGEST.test(plan.moduleSha256 ?? "")
    && ["execute", "accept"].includes(plan.gateKind)
    && ["Ready to execute — Gate B", "Ready to accept — Gate B"].includes(plan.gateDecision)
    && SHA256_DIGEST.test(plan.preimageDigest ?? "")
    && SHA256_DIGEST.test(plan.targetSnapshotDigest ?? "")
    && SHA256_DIGEST.test(plan.protectedIssueDigest ?? "")
    && SHA256_DIGEST.test(plan.protectedProjectDigest ?? "")
    && SHA256_DIGEST.test(plan.authorizationDigest ?? "")
    && rollbackSnapshotReferenceIsValid(plan.rollbackSnapshotReference)
    && SHA256_DIGEST.test(plan.recoveryPlanDigest ?? "")
    && hasExactKeys(plan.verification, VERIFICATION_KEYS)
    && plan.verification?.immediateSnapshots === 1
    && plan.verification?.quiescentSnapshots === 2
    && plan.verification?.quiescenceIntervalMs === QUIESCENCE_INTERVAL_MS)) return false;

  const targetResult = buildTransitionTarget({
    taskId: plan.taskId,
    fromStatus: plan.fromStatus,
    toStatus: plan.toStatus,
  });
  if (!targetResult.ok) return false;
  const expectedGate = plan.toStatus === "Done"
    ? { gateKind: "accept", gateDecision: "Ready to accept — Gate B" }
    : { gateKind: "execute", gateDecision: "Ready to execute — Gate B" };
  if (plan.gateKind !== expectedGate.gateKind || plan.gateDecision !== expectedGate.gateDecision) return false;

  const expectedOperations = [
    { surface: "project-status", from: plan.fromStatus, to: plan.toStatus },
    { surface: "issue-state", from: issueStateFor(plan.fromStatus), to: issueStateFor(plan.toStatus) },
    {
      surface: "issue-status-label",
      remove: statusLabelFor(plan.fromStatus),
      add: statusLabelFor(plan.toStatus),
    },
  ];
  const expectedRollbackOperations = [
    {
      surface: "issue-status-label",
      remove: statusLabelFor(plan.toStatus),
      add: statusLabelFor(plan.fromStatus),
    },
    { surface: "issue-state", from: issueStateFor(plan.toStatus), to: issueStateFor(plan.fromStatus) },
    { surface: "project-status", from: plan.toStatus, to: plan.fromStatus },
  ];
  if (!Array.isArray(plan.operations)
    || plan.operations.length !== 3
    || !hasExactKeys(plan.operations[0], OPERATION_KEYS)
    || !hasExactKeys(plan.operations[1], OPERATION_KEYS)
    || !hasExactKeys(plan.operations[2], LABEL_OPERATION_KEYS)
    || canonicalJson(plan.operations) !== canonicalJson(expectedOperations)
    || !Array.isArray(plan.rollbackOperations)
    || plan.rollbackOperations.length !== 3
    || !hasExactKeys(plan.rollbackOperations[0], LABEL_OPERATION_KEYS)
    || !hasExactKeys(plan.rollbackOperations[1], OPERATION_KEYS)
    || !hasExactKeys(plan.rollbackOperations[2], OPERATION_KEYS)
    || canonicalJson(plan.rollbackOperations) !== canonicalJson(expectedRollbackOperations)
    || canonicalJson(plan.forbiddenSurfaces) !== canonicalJson(DELIVERY_FORBIDDEN_SURFACES)) return false;

  const preimageSnapshot = {
    schemaVersion: DELIVERY_TRANSITION_SCHEMA_VERSION,
    taskId: plan.taskId,
    sourceRevision: plan.sourceRevision,
    taskStatus: plan.fromStatus,
    projectStatus: plan.fromStatus,
    issueState: issueStateFor(plan.fromStatus),
    statusLabel: statusLabelFor(plan.fromStatus),
    protectedIssueDigest: plan.protectedIssueDigest,
    protectedProjectDigest: plan.protectedProjectDigest,
  };
  const targetSnapshot = {
    ...preimageSnapshot,
    taskStatus: plan.toStatus,
    projectStatus: plan.toStatus,
    issueState: issueStateFor(plan.toStatus),
    statusLabel: statusLabelFor(plan.toStatus),
  };
  return plan.preimageDigest === sha256(canonicalJson(preimageSnapshot))
    && plan.targetSnapshotDigest === sha256(canonicalJson(targetSnapshot));
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function sagaDirectory(sagaRoot, planDigest) {
  return path.join(sagaRoot, planDigest.slice("sha256:".length));
}

function taskLockDirectory(sagaRoot, taskId) {
  return path.join(sagaRoot, ".task-locks", taskId);
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
  const resolved = path.resolve(directory);
  const parent = path.dirname(resolved);
  if (resolved === parent) return;
  try {
    await mkdir(resolved, { mode: 0o700 });
    await syncDirectory(parent);
  } catch (error) {
    if (error?.code === "ENOENT") {
      await ensureDurableDirectory(parent);
      try {
        await mkdir(resolved, { mode: 0o700 });
        await syncDirectory(parent);
      } catch (retryError) {
        if (retryError?.code !== "EEXIST") throw retryError;
      }
    } else if (error?.code !== "EEXIST") {
      throw error;
    }
  }
  const metadata = await lstat(resolved);
  if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
    throw new Error("durable path is not a plain directory");
  }
}

async function readTaskLock(sagaRoot, taskId) {
  const lockPath = taskLockDirectory(sagaRoot, taskId);
  const bytes = await readFile(path.join(lockPath, "binding.json"));
  if (bytes.length === 0 || bytes.length > MAX_SAGA_EVENT_BYTES || !publicTextBytesAreSafe(bytes)) {
    throw new Error("task lock bytes invalid");
  }
  const binding = parseJsonWithoutDuplicateKeys(bytes.toString("utf8"), `transition-task-lock:${taskId}`);
  if (!hasExactKeys(binding, TASK_LOCK_KEYS)
    || binding.schemaVersion !== DELIVERY_TRANSITION_SCHEMA_VERSION
    || binding.taskId !== taskId
    || !SHA256_DIGEST.test(binding.planDigest ?? "")
    || !/^[0-9a-f]{64}$/.test(binding.ownerNonce ?? "")) throw new Error("task lock binding invalid");
  return binding;
}

async function acquireTaskLock(sagaRoot, taskId, planDigest, ownerNonce) {
  const lockRoot = path.join(sagaRoot, ".task-locks");
  const lockPath = taskLockDirectory(sagaRoot, taskId);
  try {
    await ensureDurableDirectory(sagaRoot);
    await ensureDurableDirectory(lockRoot);
  } catch {
    return { ok: false, code: "TRANSITION_TASK_LOCK_INVALID" };
  }
  try {
    await mkdir(lockPath, { mode: 0o700 });
    await syncDirectory(lockRoot);
  } catch (error) {
    if (error?.code !== "EEXIST") return { ok: false, code: "TRANSITION_TASK_LOCK_INVALID" };
    try {
      await readTaskLock(sagaRoot, taskId);
      return { ok: false, code: "TRANSITION_TASK_LOCKED" };
    } catch {
      return { ok: false, code: "TRANSITION_TASK_LOCK_INVALID" };
    }
  }
  const binding = { schemaVersion: DELIVERY_TRANSITION_SCHEMA_VERSION, taskId, planDigest, ownerNonce };
  try {
    const handle = await open(path.join(lockPath, "binding.json"), "wx", 0o600);
    try {
      await handle.writeFile(`${canonicalJson(binding)}\n`, "utf8");
      await handle.sync();
    } finally {
      await handle.close();
    }
    await syncDirectory(lockPath);
    return { ok: true, code: "TRANSITION_TASK_LOCK_ACQUIRED" };
  } catch {
    return { ok: false, code: "TRANSITION_TASK_LOCK_INVALID" };
  }
}

async function releaseTaskLock(sagaRoot, taskId, planDigest, ownerNonce) {
  try {
    const binding = await readTaskLock(sagaRoot, taskId);
    if (binding.planDigest !== planDigest || binding.ownerNonce !== ownerNonce) return false;
    const lockRoot = path.join(sagaRoot, ".task-locks");
    const lockPath = taskLockDirectory(sagaRoot, taskId);
    await unlink(path.join(lockPath, "binding.json"));
    await syncDirectory(lockPath);
    await rmdir(lockPath);
    await syncDirectory(lockRoot);
    return true;
  } catch {
    return false;
  }
}

function sagaEventShapeValid(event) {
  const extraKeys = SAGA_EVENT_EXTRA_KEYS[event?.state];
  if (!extraKeys || !hasExactKeys(event, [...SAGA_COMMON_KEYS, ...extraKeys])
    || event.schemaVersion !== DELIVERY_TRANSITION_SCHEMA_VERSION
    || !SHA256_DIGEST.test(event.planDigest ?? "")
    || !Number.isFinite(Date.parse(event.occurredAt ?? ""))
    || !P0_R0_SUBSTANTIVE_TASK_IDS.includes(event.taskId)
    || !(event.previousEventSha256 === null || SHA256_DIGEST.test(event.previousEventSha256 ?? ""))
    || !SHA256_DIGEST.test(event.eventSha256 ?? "")) return false;
  if (["operation-intent", "operation-complete", "rollback-intent", "rollback-complete"].includes(event.state)) {
    return Number.isSafeInteger(event.operationIndex)
      && event.operationIndex >= 0
      && event.operationIndex < 3
      && ["project-status", "issue-state", "issue-status-label"].includes(event.surface);
  }
  if (event.state === "verification-complete") {
    return ["immediate", "quiescent-1", "quiescent-2"].includes(event.boundary)
      && SHA256_DIGEST.test(event.snapshotDigest ?? "")
      && SHA256_DIGEST.test(event.protectedIssueDigest ?? "")
      && SHA256_DIGEST.test(event.protectedProjectDigest ?? "")
      && SHA256_DIGEST.test(event.authorizationDigest ?? "");
  }
  if (event.state === "applied-verified") {
    return SHA256_DIGEST.test(event.verificationReceiptsSha256 ?? "");
  }
  return true;
}

async function readSagaEvents(sagaRoot, planDigest) {
  const directory = sagaDirectory(sagaRoot, planDigest);
  let names;
  try {
    names = (await readdir(directory)).filter((name) => SAGA_EVENT.test(name)).sort();
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  const events = [];
  let previousEventSha256 = null;
  for (const [index, name] of names.entries()) {
    if (!name.startsWith(`${String(index + 1).padStart(4, "0")}-`)) throw new Error("saga sequence invalid");
    const bytes = await readFile(path.join(directory, name));
    if (bytes.length === 0 || bytes.length > MAX_SAGA_EVENT_BYTES || !publicTextBytesAreSafe(bytes)) {
      throw new Error("saga bytes invalid");
    }
    const parsed = parseJsonWithoutDuplicateKeys(bytes.toString("utf8"), `transition-saga:${name}`);
    const { eventSha256, ...payload } = parsed;
    if (!sagaEventShapeValid(parsed)
      || payload.planDigest !== planDigest
      || payload.previousEventSha256 !== previousEventSha256
      || eventSha256 !== sha256(canonicalJson(payload))) throw new Error("saga chain invalid");
    events.push(parsed);
    previousEventSha256 = eventSha256;
  }
  return events;
}

async function appendSagaEvent(sagaRoot, planDigest, event, clock) {
  if (!SAGA_STATES.has(event.state)) throw new Error("saga state invalid");
  const directory = sagaDirectory(sagaRoot, planDigest);
  await ensureDurableDirectory(sagaRoot);
  await ensureDurableDirectory(directory);
  const existing = await readSagaEvents(sagaRoot, planDigest);
  const sequence = existing.length + 1;
  const payload = {
    schemaVersion: DELIVERY_TRANSITION_SCHEMA_VERSION,
    planDigest,
    occurredAt: clock().toISOString(),
    ...event,
    previousEventSha256: existing.at(-1)?.eventSha256 ?? null,
  };
  const envelope = { ...payload, eventSha256: sha256(canonicalJson(payload)) };
  if (!sagaEventShapeValid(envelope)) throw new Error("saga event shape invalid");
  const filePath = path.join(directory, `${String(sequence).padStart(4, "0")}-${event.state}.json`);
  const handle = await open(filePath, "wx", 0o600);
  try {
    await handle.writeFile(`${canonicalJson(envelope)}\n`, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
  await syncDirectory(directory);
  return envelope;
}

function appliedSagaHistoryIsValid(events, plan) {
  const expectedStates = [
    "declared",
    "operation-intent", "operation-complete",
    "operation-intent", "operation-complete",
    "operation-intent", "operation-complete",
    "verification-pending",
    "verification-complete", "verification-complete", "verification-complete",
    "applied-verified",
  ];
  if (events.map((event) => event.state).join("\0") !== expectedStates.join("\0")) return false;
  const operationEvents = events.filter((event) => event.state === "operation-intent" || event.state === "operation-complete");
  for (const [index, operation] of plan.operations.entries()) {
    const pair = operationEvents.slice(index * 2, index * 2 + 2);
    if (pair.length !== 2
      || pair[0].state !== "operation-intent"
      || pair[1].state !== "operation-complete"
      || pair.some((event) => event.operationIndex !== index || event.surface !== operation.surface)) return false;
  }
  const verificationEvents = events.filter((event) => event.state === "verification-complete");
  const boundaries = ["immediate", "quiescent-1", "quiescent-2"];
  if (verificationEvents.length !== boundaries.length
    || verificationEvents.some((event, index) => event.boundary !== boundaries[index]
      || event.snapshotDigest !== plan.targetSnapshotDigest
      || event.protectedIssueDigest !== plan.protectedIssueDigest
      || event.protectedProjectDigest !== plan.protectedProjectDigest
      || event.authorizationDigest !== plan.authorizationDigest)) return false;
  return events.at(-1).verificationReceiptsSha256 === sha256(canonicalJson(
    verificationEvents.map((event) => event.eventSha256),
  ));
}

function rolledBackSagaHistoryIsValid(events, plan) {
  const tail = events.slice(-4);
  if (!events.some((event) => event.state === "recovery-start")
    || tail.map((event) => event.state).join("\0")
      !== ["verification-complete", "verification-complete", "verification-complete", "rolled-back"].join("\0")) {
    return false;
  }
  const boundaries = ["immediate", "quiescent-1", "quiescent-2"];
  return tail.slice(0, 3).every((event, index) => event.boundary === boundaries[index]
    && event.snapshotDigest === plan.preimageDigest
    && event.protectedIssueDigest === plan.protectedIssueDigest
    && event.protectedProjectDigest === plan.protectedProjectDigest
    && event.authorizationDigest === plan.authorizationDigest);
}

function observationIsProtected(observation, plan) {
  return observation.taskId === plan.taskId
    && observation.sourceRevision === plan.sourceRevision
    && observation.protectedIssueDigest === plan.protectedIssueDigest
    && observation.protectedProjectDigest === plan.protectedProjectDigest;
}

function operationSide(observation, operation) {
  if (operation.surface === "project-status") return observation.projectStatus;
  if (operation.surface === "issue-state") return observation.issueState;
  if (operation.surface === "issue-status-label") return observation.statusLabel;
  return null;
}

async function executeTransitionOperation(adapter, taskId, operation) {
  if (operation.surface === "project-status") return adapter.setProjectStatus(taskId, operation.from, operation.to);
  if (operation.surface === "issue-state") return adapter.setIssueState(taskId, operation.from, operation.to);
  if (operation.surface === "issue-status-label") return adapter.replaceStatusLabel(taskId, operation.remove, operation.add);
  throw new Error("forbidden operation");
}

async function trustedAuthorizationMatches(plan, adapter) {
  let authorization;
  try {
    authorization = await adapter.verifyAuthorization(plan);
  } catch {
    return false;
  }
  return validateAuthorization(authorization, {
    taskId: plan.taskId,
    sourceRevision: plan.sourceRevision,
    targetStatus: plan.toStatus,
  })
    && authorization.stageId === plan.stageId
    && authorization.scopeClass === plan.scopeClass
    && authorization.actionClass === plan.actionClass
    && authorization.candidateRevision === plan.candidateRevision
    && authorization.preparationReviewId === plan.preparationReviewId
    && authorization.preparationReviewSha256 === plan.preparationReviewSha256
    && authorization.stageApprovalSha256 === plan.stageApprovalSha256
    && authorization.registrySha256 === plan.registrySha256
    && authorization.stageDefinitionSha256 === plan.stageDefinitionSha256
    && authorization.moduleId === plan.moduleId
    && authorization.moduleSha256 === plan.moduleSha256
    && authorization.gateKind === plan.gateKind
    && authorization.gateDecision === plan.gateDecision
    && authorization.rollbackSnapshotReference === plan.rollbackSnapshotReference
    && sha256(canonicalJson(stableAuthorization(authorization))) === plan.authorizationDigest;
}

async function frozenTaskParityMatches(plan, adapter, boundary) {
  let parity;
  try {
    parity = await adapter.verifyFrozenTaskParity(plan.freezeSnapshotSha256, boundary);
  } catch {
    return false;
  }
  return hasExactKeys(parity, FROZEN_PARITY_KEYS)
    && parity.ok === true
    && parity.taskCount === 50
    && parity.snapshotSha256 === plan.freezeSnapshotSha256
    && parity.snapshotSha256 === FROZEN_SNAPSHOT_SHA256;
}

async function verifyRollbackProjectionAtBoundaries({
  plan,
  adapter,
  quiescenceIntervalMs,
  onVerified = async () => {},
}) {
  for (const [index, boundary] of ["immediate", "quiescent-1", "quiescent-2"].entries()) {
    if (index > 0) await delay(quiescenceIntervalMs);
    if (!await frozenTaskParityMatches(plan, adapter, `rollback-${boundary}`)) return false;
    const verified = buildProjectionSnapshot(await adapter.readProjection(plan.taskId));
    if (!verified.ok
      || verified.snapshotDigest !== plan.preimageDigest
      || verified.snapshot.protectedIssueDigest !== plan.protectedIssueDigest
      || verified.snapshot.protectedProjectDigest !== plan.protectedProjectDigest) return false;
    await onVerified(boundary, verified);
  }
  return true;
}

async function recoverTransitionToPreimage({
  planEnvelope,
  adapter,
  sagaRoot,
  clock,
  quiescenceIntervalMs = QUIESCENCE_INTERVAL_MS,
}) {
  const { plan, planDigest } = planEnvelope;
  try {
    if (!await frozenTaskParityMatches(plan, adapter, "recovery-start")) throw new Error("frozen task parity drift");
    await appendSagaEvent(sagaRoot, planDigest, { state: "recovery-start", taskId: plan.taskId }, clock);
    for (const [index, operation] of plan.rollbackOperations.entries()) {
      if (!await frozenTaskParityMatches(plan, adapter, `pre-rollback-${operation.surface}`)) {
        throw new Error("frozen task parity drift");
      }
      const rawProjection = await adapter.readProjection(plan.taskId);
      const observed = buildProjectionTransitionObservation(rawProjection);
      if (!observed.ok || !observationIsProtected(observed.observation, plan)) throw new Error("protected drift");
      const currentSide = operationSide(observed.observation, operation);
      const rollbackFrom = operation.surface === "issue-status-label" ? operation.remove : operation.from;
      const rollbackTo = operation.surface === "issue-status-label" ? operation.add : operation.to;
      if (currentSide === rollbackTo) continue;
      if (currentSide !== rollbackFrom) throw new Error("unknown partial state");
      await appendSagaEvent(sagaRoot, planDigest, {
        state: "rollback-intent", taskId: plan.taskId, operationIndex: index, surface: operation.surface,
      }, clock);
      await executeTransitionOperation(adapter, plan.taskId, operation);
      await appendSagaEvent(sagaRoot, planDigest, {
        state: "rollback-complete", taskId: plan.taskId, operationIndex: index, surface: operation.surface,
      }, clock);
      if (!await frozenTaskParityMatches(plan, adapter, `post-rollback-${operation.surface}`)) {
        throw new Error("frozen task parity drift");
      }
    }
    const rollbackVerified = await verifyRollbackProjectionAtBoundaries({
      plan,
      adapter,
      quiescenceIntervalMs,
      onVerified: async (boundary, verified) => appendSagaEvent(sagaRoot, planDigest, {
        state: "verification-complete",
        taskId: plan.taskId,
        boundary,
        snapshotDigest: verified.snapshotDigest,
        protectedIssueDigest: verified.snapshot.protectedIssueDigest,
        protectedProjectDigest: verified.snapshot.protectedProjectDigest,
        authorizationDigest: plan.authorizationDigest,
      }, clock),
    });
    if (!rollbackVerified) throw new Error("rollback mismatch");
    await appendSagaEvent(sagaRoot, planDigest, { state: "rolled-back", taskId: plan.taskId }, clock);
    return result(false, "TRANSITION_ROLLED_BACK", { taskId: plan.taskId, planDigest });
  } catch {
    await appendSagaEvent(sagaRoot, planDigest, { state: "recovery-required", taskId: plan.taskId }, clock).catch(() => {});
    return result(false, "TRANSITION_RECOVERY_REQUIRED", { taskId: plan.taskId, planDigest });
  }
}

async function applyPlanCore(planEnvelope, adapter, {
  sagaRoot,
  clock = () => new Date(),
  quiescenceIntervalMs = QUIESCENCE_INTERVAL_MS,
} = {}) {
  if (!planIsStructurallyBound(planEnvelope)) return result(false, "TRANSITION_REVIEWED_PLAN_INVALID");
  const plan = planEnvelope.plan;
  const requiredMethods = [
    "guardExactMain", "verifyAuthorization", "verifyFrozenTaskParity", "readProjection",
    "setProjectStatus", "setIssueState", "replaceStatusLabel",
  ];
  if (!requiredMethods.every((name) => typeof adapter?.[name] === "function")
    || typeof sagaRoot !== "string"
    || !path.isAbsolute(sagaRoot)
    || path.resolve(sagaRoot) === path.parse(path.resolve(sagaRoot)).root) {
    return result(false, "TRANSITION_ADAPTER_INVALID", { taskId: plan.taskId });
  }
  const lockOwnerNonce = crypto.randomBytes(32).toString("hex");
  const taskLock = await acquireTaskLock(
    sagaRoot,
    plan.taskId,
    planEnvelope.planDigest,
    lockOwnerNonce,
  );
  if (!taskLock.ok) return result(false, taskLock.code, { taskId: plan.taskId });
  const finishTerminal = async (terminalResult) => {
    if (!["TRANSITION_APPLIED_VERIFIED", "TRANSITION_ALREADY_APPLIED_VERIFIED",
      "TRANSITION_ROLLED_BACK", "TRANSITION_ALREADY_ROLLED_BACK"].includes(terminalResult.code)) {
      return terminalResult;
    }
    if (await releaseTaskLock(sagaRoot, plan.taskId, planEnvelope.planDigest, lockOwnerNonce)) return terminalResult;
    return result(false, "TRANSITION_RECOVERY_REQUIRED", {
      taskId: plan.taskId,
      planDigest: planEnvelope.planDigest,
    });
  };
  let sagaEvents;
  try {
    sagaEvents = await readSagaEvents(sagaRoot, planEnvelope.planDigest);
  } catch {
    return result(false, "TRANSITION_SAGA_INVALID", { taskId: plan.taskId });
  }
  const terminal = sagaEvents.at(-1)?.state;
  if (terminal === "applied-verified") {
    const verified = buildProjectionSnapshot(await adapter.readProjection(plan.taskId));
    if (appliedSagaHistoryIsValid(sagaEvents, plan)
      && await adapter.guardExactMain(plan.sourceRevision, "replay") === true
      && await trustedAuthorizationMatches(plan, adapter)
      && await frozenTaskParityMatches(plan, adapter, "applied-replay")
      && verified.ok && verified.snapshotDigest === plan.targetSnapshotDigest) {
      return finishTerminal(result(true, "TRANSITION_ALREADY_APPLIED_VERIFIED", {
        taskId: plan.taskId, sourceRevision: plan.sourceRevision, planDigest: planEnvelope.planDigest,
      }));
    }
    return result(false, "TRANSITION_RECOVERY_REQUIRED", { taskId: plan.taskId, planDigest: planEnvelope.planDigest });
  }
  if (terminal === "rolled-back") {
    const replayVerified = rolledBackSagaHistoryIsValid(sagaEvents, plan)
      && await adapter.guardExactMain(plan.sourceRevision, "rollback-replay") === true
      && await frozenTaskParityMatches(plan, adapter, "rolled-back-replay")
      && await verifyRollbackProjectionAtBoundaries({ plan, adapter, quiescenceIntervalMs });
    if (replayVerified) {
      return finishTerminal(result(false, "TRANSITION_ALREADY_ROLLED_BACK", {
        taskId: plan.taskId, planDigest: planEnvelope.planDigest,
      }));
    }
    return result(false, "TRANSITION_RECOVERY_REQUIRED", {
      taskId: plan.taskId, planDigest: planEnvelope.planDigest,
    });
  }
  if (sagaEvents.length > 0) {
    return finishTerminal(await recoverTransitionToPreimage({
      planEnvelope, adapter, sagaRoot, clock, quiescenceIntervalMs,
    }));
  }
  try {
    await appendSagaEvent(sagaRoot, planEnvelope.planDigest, { state: "declared", taskId: plan.taskId }, clock);
  } catch {
    return result(false, "TRANSITION_SAGA_CONFLICT", { taskId: plan.taskId });
  }
  if (await adapter.guardExactMain(plan.sourceRevision, "pre-apply") !== true
    || !await trustedAuthorizationMatches(plan, adapter)) {
    return finishTerminal(await recoverTransitionToPreimage({
      planEnvelope, adapter, sagaRoot, clock, quiescenceIntervalMs,
    }));
  }
  const current = buildProjectionSnapshot(await adapter.readProjection(plan.taskId));
  if (!current.ok || current.snapshotDigest !== plan.preimageDigest
    || !await frozenTaskParityMatches(plan, adapter, "pre-first-operation")) {
    return finishTerminal(await recoverTransitionToPreimage({
      planEnvelope, adapter, sagaRoot, clock, quiescenceIntervalMs,
    }));
  }

  try {
    for (const [index, operation] of plan.operations.entries()) {
      if (await adapter.guardExactMain(plan.sourceRevision, `pre-${operation.surface}`) !== true
        || !await trustedAuthorizationMatches(plan, adapter)
        || !await frozenTaskParityMatches(plan, adapter, `pre-${operation.surface}`)) throw new Error("authority drift");
      await appendSagaEvent(sagaRoot, planEnvelope.planDigest, {
        state: "operation-intent", taskId: plan.taskId, operationIndex: index, surface: operation.surface,
      }, clock);
      await executeTransitionOperation(adapter, plan.taskId, operation);
      await appendSagaEvent(sagaRoot, planEnvelope.planDigest, {
        state: "operation-complete", taskId: plan.taskId, operationIndex: index, surface: operation.surface,
      }, clock);
      if (!await frozenTaskParityMatches(plan, adapter, `post-${operation.surface}`)) {
        throw new Error("frozen task parity drift");
      }
    }
    await appendSagaEvent(sagaRoot, planEnvelope.planDigest, { state: "verification-pending", taskId: plan.taskId }, clock);
    const verificationReceipts = [];
    for (const [index, boundary] of ["immediate", "quiescent-1", "quiescent-2"].entries()) {
      if (index > 0) await delay(quiescenceIntervalMs);
      if (await adapter.guardExactMain(plan.sourceRevision, boundary) !== true
        || !await trustedAuthorizationMatches(plan, adapter)
        || !await frozenTaskParityMatches(plan, adapter, boundary)) throw new Error("verification authority drift");
      const verified = buildProjectionSnapshot(await adapter.readProjection(plan.taskId));
      if (!verified.ok
        || verified.snapshotDigest !== plan.targetSnapshotDigest
        || verified.snapshot.protectedIssueDigest !== plan.protectedIssueDigest
        || verified.snapshot.protectedProjectDigest !== plan.protectedProjectDigest) {
        throw new Error("verification projection drift");
      }
      verificationReceipts.push(await appendSagaEvent(sagaRoot, planEnvelope.planDigest, {
        state: "verification-complete",
        taskId: plan.taskId,
        boundary,
        snapshotDigest: verified.snapshotDigest,
        protectedIssueDigest: verified.snapshot.protectedIssueDigest,
        protectedProjectDigest: verified.snapshot.protectedProjectDigest,
        authorizationDigest: plan.authorizationDigest,
      }, clock));
    }
    await appendSagaEvent(sagaRoot, planEnvelope.planDigest, {
      state: "applied-verified",
      taskId: plan.taskId,
      verificationReceiptsSha256: sha256(canonicalJson(verificationReceipts.map((event) => event.eventSha256))),
    }, clock);
    return finishTerminal(result(true, "TRANSITION_APPLIED_VERIFIED", {
      taskId: plan.taskId,
      sourceRevision: plan.sourceRevision,
      planDigest: planEnvelope.planDigest,
    }));
  } catch {
    return finishTerminal(await recoverTransitionToPreimage({
      planEnvelope, adapter, sagaRoot, clock, quiescenceIntervalMs,
    }));
  }
}

/**
 * Stage 0 production apply is deliberately inert. Enabling it requires a later
 * exact-main change that resolves the reviewed plan by digest internally and
 * supplies the fixed GitHub plus exact-frozen-50 adapter; callers cannot inject
 * either.
 */
export async function applyReviewedDeliveryTransition(request = {}) {
  if (!hasExactKeys(request, PUBLIC_APPLY_KEYS)
    || !SHA256_DIGEST.test(request.reviewedPlanDigest ?? "")) {
    return result(false, "TRANSITION_APPLY_REQUEST_INVALID");
  }
  return result(false, "TRANSITION_APPLY_DISABLED_STAGE0", { planDigest: request.reviewedPlanDigest });
}

async function selfTest() {
  const root = await mkdtemp(path.join(os.tmpdir(), "P0-transition-"));
  try {
    const revision = "a".repeat(40);
    const recoveryDigest = `sha256:${"b".repeat(64)}`;
    const initialLabels = () => ["phase1", "roadmap", "status:next", "priority:high", "type:design"];
    const state = { status: "Next", issueState: "open", labels: initialLabels() };
    const reset = () => {
      state.status = "Next";
      state.issueState = "open";
      state.labels = initialLabels();
    };
    const projection = () => ({
      taskId: "UX-R0-001",
      sourceRevision: revision,
      taskStatus: state.status,
      issue: {
        number: 6,
        url: "https://github.com/arunpr614/Life-Reflection/issues/6",
        title: "[UX-R0-001] Synthetic shell UX",
        body: "<!-- phase1-roadmap-id: UX-R0-001 -->",
        state: state.issueState,
        milestone: "R0",
        labels: [...state.labels],
      },
      projectItem: {
        itemIdentity: "opaque:ux-r0-001",
        status: state.status,
        fields: { Priority: "High", Evidence: "Not yet recorded" },
      },
    });
    const authorization = {
      ok: true,
      scope: "stage-gate-b",
      code: "STAGE_GATE_B_READY",
      taskId: "UX-R0-001",
      stageId: "P0-STAGE-UX-R0-001-DELIVERY-TRANSITION",
      scopeClass: "private-execution",
      actionClass: "project-workflow-mutation",
      sourceRevision: revision,
      candidateRevision: "c".repeat(40),
      dossierDigest: "d".repeat(64),
      preparationReviewId: "P0-PREP-UX-R0-001-DELIVERY-TRANSITION",
      preparationReviewSha256: "e".repeat(64),
      gateKind: "execute",
      predecessorReceiptSha256: null,
      idempotencyKey: "P0-IDEMP-UX-R0-001-DELIVERY-TRANSITION-001",
      stageApprovalSha256: "f".repeat(64),
      registrySha256: "1".repeat(64),
      stageDefinitionSha256: `sha256:${"3".repeat(64)}`,
      moduleId: "p0.delivery-transition",
      moduleSha256: `sha256:${"4".repeat(64)}`,
      gateSourceFingerprint: `sha256:${"2".repeat(64)}`,
      deadlineAt: new Date(Date.now() + 30_000).toISOString(),
      gateDecision: "Ready to execute — Gate B",
      independentQaResult: "pass",
      rollbackSnapshotReference: "rollback:synthetic-transition-snapshot",
    };
    const preimage = buildProjectionSnapshot(projection());
    const input = {
      schemaVersion: DELIVERY_TRANSITION_SCHEMA_VERSION,
      taskId: "UX-R0-001",
      sourceRevision: revision,
      sourceTaskStatus: "Next",
      targetStatus: "In progress",
      authorization,
      rollback: {
        preChangeSnapshotDigest: preimage.snapshotDigest,
        recoveryPlanDigest: recoveryDigest,
        rehearsalResult: "pass",
      },
      liveProjection: projection(),
    };
    let cases = 0;
    let sagaIndex = 0;
    const nextSagaRoot = () => path.join(root, `saga-${++sagaIndex}`);
    const plan = createDeliveryTransitionDryRun(input);
    if (!plan.ok || !planIsStructurallyBound(plan)) throw new Error("positive dry-run case failed");
    cases += 1;
    const methods = [];
    const boundaries = [];
    let positiveSagaRoot = null;
    let durableIntentObservedBeforeMutation = false;
    const adapter = {
      guardExactMain: async (_revision, boundary) => { boundaries.push({ boundary, at: Date.now() }); return true; },
      verifyAuthorization: async () => ({ ...authorization, deadlineAt: new Date(Date.now() + 30_000).toISOString() }),
      verifyFrozenTaskParity: async () => ({
        ok: true,
        taskCount: 50,
        snapshotSha256: FROZEN_SNAPSHOT_SHA256,
      }),
      readProjection: async () => projection(),
      setProjectStatus: async (_taskId, from, to) => {
        if (!durableIntentObservedBeforeMutation && positiveSagaRoot !== null) {
          const durableEvents = await readSagaEvents(positiveSagaRoot, plan.planDigest);
          durableIntentObservedBeforeMutation = durableEvents.map((event) => event.state).join("\0")
            === ["declared", "operation-intent"].join("\0");
        }
        if (state.status !== from) throw new Error("status compare-and-swap failed");
        state.status = to;
        methods.push("project-status");
      },
      setIssueState: async (_taskId, from, to) => {
        if (state.issueState !== from) throw new Error("state compare-and-swap failed");
        state.issueState = to;
        methods.push("issue-state");
      },
      replaceStatusLabel: async (_taskId, remove, add) => {
        const matches = state.labels.filter((label) => label === remove);
        if (matches.length !== 1 || state.labels.includes(add)) throw new Error("label compare-and-swap failed");
        state.labels = state.labels.map((label) => label === remove ? add : label);
        methods.push("issue-status-label");
      },
    };
    positiveSagaRoot = nextSagaRoot();
    const applied = await applyPlanCore(plan, adapter, { sagaRoot: positiveSagaRoot, quiescenceIntervalMs: 5 });
    if (applied.code !== "TRANSITION_APPLIED_VERIFIED" || methods.join(",") !== "project-status,issue-state,issue-status-label") {
      throw new Error("positive apply case failed");
    }
    cases += 1;
    const positiveSaga = await readSagaEvents(positiveSagaRoot, plan.planDigest);
    if (positiveSaga.at(-1)?.state !== "applied-verified"
      || !positiveSaga.some((event) => event.state === "verification-pending")
      || !appliedSagaHistoryIsValid(positiveSaga, plan.plan)
      || positiveSaga.filter((event) => event.state === "verification-complete").length !== 3
      || durableIntentObservedBeforeMutation !== true) {
      throw new Error("durable saga case failed");
    }
    cases += 1;
    cases += 1;
    const quiescentBoundaries = boundaries.filter(({ boundary }) => boundary.startsWith("quiescent"));
    if (quiescentBoundaries.length !== 2 || quiescentBoundaries[1].at - quiescentBoundaries[0].at < 4) {
      throw new Error("timed quiescence case failed");
    }
    cases += 1;
    const replay = await applyPlanCore(plan, adapter, { sagaRoot: positiveSagaRoot, quiescenceIntervalMs: 5 });
    if (replay.code !== "TRANSITION_ALREADY_APPLIED_VERIFIED") throw new Error("applied saga replay case failed");
    cases += 1;

    reset();
    const alternateAuthorization = {
      ...authorization,
      stageId: "P0-STAGE-UX-R0-001-ALTERNATE-DELIVERY-TRANSITION",
      candidateRevision: "9".repeat(40),
      dossierDigest: "8".repeat(64),
      preparationReviewId: "P0-PREP-UX-R0-001-ALTERNATE-DELIVERY-TRANSITION",
      preparationReviewSha256: "7".repeat(64),
      idempotencyKey: "P0-IDEMP-UX-R0-001-ALTERNATE-DELIVERY-TRANSITION-001",
      stageApprovalSha256: "6".repeat(64),
      registrySha256: "5".repeat(64),
      stageDefinitionSha256: `sha256:${"4".repeat(64)}`,
      moduleId: "p0.delivery-transition",
      moduleSha256: `sha256:${"3".repeat(64)}`,
      gateSourceFingerprint: `sha256:${"2".repeat(64)}`,
    };
    const alternatePlan = createDeliveryTransitionDryRun({
      ...input,
      authorization: alternateAuthorization,
      liveProjection: projection(),
    });
    if (!alternatePlan.ok || alternatePlan.planDigest === plan.planDigest) {
      throw new Error("alternate transition plan case failed");
    }
    const sharedSagaRoot = nextSagaRoot();
    let releaseFirstGuard;
    let announceFirstGuard;
    const firstGuardEntered = new Promise((resolve) => { announceFirstGuard = resolve; });
    const firstGuardRelease = new Promise((resolve) => { releaseFirstGuard = resolve; });
    let firstGuardPaused = false;
    const firstApplyPromise = applyPlanCore(plan, {
      ...adapter,
      guardExactMain: async (_sourceRevision, boundary) => {
        if (boundary === "pre-apply" && !firstGuardPaused) {
          firstGuardPaused = true;
          announceFirstGuard();
          await firstGuardRelease;
        }
        return true;
      },
    }, { sagaRoot: sharedSagaRoot, quiescenceIntervalMs: 5 });
    await firstGuardEntered;
    let samePlanWrites = 0;
    const samePlanCompeting = await applyPlanCore(plan, {
      ...adapter,
      setProjectStatus: async () => { samePlanWrites += 1; },
      setIssueState: async () => { samePlanWrites += 1; },
      replaceStatusLabel: async () => { samePlanWrites += 1; },
    }, { sagaRoot: sharedSagaRoot, quiescenceIntervalMs: 5 });
    if (samePlanCompeting.code !== "TRANSITION_TASK_LOCKED" || samePlanWrites !== 0) {
      throw new Error("per-task same-plan owner lock case failed");
    }
    cases += 1;
    let competingWrites = 0;
    const competing = await applyPlanCore(alternatePlan, {
      ...adapter,
      verifyAuthorization: async () => ({
        ...alternateAuthorization,
        deadlineAt: new Date(Date.now() + 30_000).toISOString(),
      }),
      setProjectStatus: async () => { competingWrites += 1; },
      setIssueState: async () => { competingWrites += 1; },
      replaceStatusLabel: async () => { competingWrites += 1; },
    }, { sagaRoot: sharedSagaRoot, quiescenceIntervalMs: 5 });
    if (competing.code !== "TRANSITION_TASK_LOCKED" || competingWrites !== 0) {
      throw new Error("per-task cross-plan lock case failed");
    }
    cases += 1;
    releaseFirstGuard();
    const firstLockedApply = await firstApplyPromise;
    if (firstLockedApply.code !== "TRANSITION_APPLIED_VERIFIED") throw new Error("first locked plan case failed");
    reset();
    const afterRelease = await applyPlanCore(alternatePlan, {
      ...adapter,
      verifyAuthorization: async () => ({
        ...alternateAuthorization,
        deadlineAt: new Date(Date.now() + 30_000).toISOString(),
      }),
    }, { sagaRoot: sharedSagaRoot, quiescenceIntervalMs: 5 });
    if (afterRelease.code !== "TRANSITION_APPLIED_VERIFIED") throw new Error("terminal task-lock release case failed");
    cases += 1;

    const tamperedPlan = { ...plan, plan: { ...plan.plan, toStatus: "Done" } };
    const tampered = await applyPlanCore(tamperedPlan, adapter, { sagaRoot: nextSagaRoot() });
    if (tampered.code !== "TRANSITION_REVIEWED_PLAN_INVALID") throw new Error("plan digest tamper case failed");
    cases += 1;

    const semanticAttacks = [
      ["forward-operation", (candidate) => { candidate.operations[0].to = "Done"; }],
      ["rollback-operation", (candidate) => { candidate.rollbackOperations[2].to = "Backlog"; }],
      ["forbidden-surface", (candidate) => { candidate.forbiddenSurfaces.pop(); }],
      ["preimage-digest", (candidate) => { candidate.preimageDigest = `sha256:${"0".repeat(64)}`; }],
      ["target-digest", (candidate) => { candidate.targetSnapshotDigest = `sha256:${"0".repeat(64)}`; }],
      ["freeze-digest", (candidate) => { candidate.freezeSnapshotSha256 = `sha256:${"0".repeat(64)}`; }],
      ["rollback-reference", (candidate) => { candidate.rollbackSnapshotReference = "rollback:../unsafe"; }],
      ["transition-edge", (candidate) => { candidate.toStatus = "Done"; }],
      ["transition-authority", (candidate) => {
        candidate.scopeClass = "local-synthetic";
        candidate.actionClass = "synthetic-foundation";
      }],
      ["transition-module", (candidate) => { candidate.moduleId = "ux.delivery-transition"; }],
    ];
    for (const [attackName, mutate] of semanticAttacks) {
      const candidate = structuredClone(plan.plan);
      mutate(candidate);
      const forgedEnvelope = {
        ...plan,
        plan: candidate,
        planDigest: sha256(canonicalJson(candidate)),
      };
      const beforeMethods = methods.length;
      const denied = await applyPlanCore(forgedEnvelope, adapter, { sagaRoot: nextSagaRoot() });
      if (denied.code !== "TRANSITION_REVIEWED_PLAN_INVALID" || methods.length !== beforeMethods) {
        throw new Error(`recomputed semantic plan forgery case failed: ${attackName}:${denied.code}`);
      }
      cases += 1;
    }

    reset();
    const alternateRollbackReferencePlan = structuredClone(plan.plan);
    alternateRollbackReferencePlan.rollbackSnapshotReference = "rollback:alternate-synthetic-snapshot";
    const alternateRollbackReferenceEnvelope = {
      ...plan,
      plan: alternateRollbackReferencePlan,
      planDigest: sha256(canonicalJson(alternateRollbackReferencePlan)),
    };
    const methodsBeforeRollbackReferenceAttack = methods.length;
    const rollbackReferenceDenied = await applyPlanCore(alternateRollbackReferenceEnvelope, adapter, {
      sagaRoot: nextSagaRoot(),
      quiescenceIntervalMs: 5,
    });
    if (rollbackReferenceDenied.code !== "TRANSITION_ROLLED_BACK"
      || methods.length !== methodsBeforeRollbackReferenceAttack) {
      throw new Error("rollback snapshot authorization binding case failed");
    }
    cases += 1;

    reset();
    let parityDeniedWrites = 0;
    const parityDeniedBeforeMutation = await applyPlanCore(plan, {
      ...adapter,
      verifyFrozenTaskParity: async () => ({
        ok: false,
        taskCount: 49,
        snapshotSha256: FROZEN_SNAPSHOT_SHA256,
      }),
      setProjectStatus: async () => { parityDeniedWrites += 1; },
      setIssueState: async () => { parityDeniedWrites += 1; },
      replaceStatusLabel: async () => { parityDeniedWrites += 1; },
    }, { sagaRoot: nextSagaRoot(), quiescenceIntervalMs: 5 });
    if (parityDeniedBeforeMutation.code !== "TRANSITION_RECOVERY_REQUIRED" || parityDeniedWrites !== 0) {
      throw new Error("frozen-50 pre-mutation parity case failed");
    }
    cases += 1;

    reset();
    const parityBoundedWrites = [];
    const parityDriftAfterFirstOperation = await applyPlanCore(plan, {
      ...adapter,
      verifyFrozenTaskParity: async (_snapshotSha256, boundary) => ({
        ok: boundary !== "post-project-status",
        taskCount: boundary === "post-project-status" ? 49 : 50,
        snapshotSha256: FROZEN_SNAPSHOT_SHA256,
      }),
      setProjectStatus: async (...args) => {
        parityBoundedWrites.push("project-status");
        return adapter.setProjectStatus(...args);
      },
      setIssueState: async (...args) => {
        parityBoundedWrites.push("issue-state");
        return adapter.setIssueState(...args);
      },
      replaceStatusLabel: async (...args) => {
        parityBoundedWrites.push("issue-status-label");
        return adapter.replaceStatusLabel(...args);
      },
    }, { sagaRoot: nextSagaRoot(), quiescenceIntervalMs: 5 });
    if (parityDriftAfterFirstOperation.code !== "TRANSITION_ROLLED_BACK"
      || state.status !== "Next"
      || parityBoundedWrites.join(",") !== "project-status,project-status") {
      throw new Error("frozen-50 post-operation recovery case failed");
    }
    cases += 1;

    reset();
    const driftedPreimage = await applyPlanCore(plan, {
      ...adapter,
      readProjection: async () => ({ ...projection(), issue: { ...projection().issue, body: "unexpected drift" } }),
    }, { sagaRoot: nextSagaRoot(), quiescenceIntervalMs: 5 });
    if (driftedPreimage.code !== "TRANSITION_RECOVERY_REQUIRED") throw new Error("live preimage drift case failed");
    cases += 1;

    reset();
    const rollbackSagaRoot = nextSagaRoot();
    const rollbackReadTimes = [];
    const rolledBack = await applyPlanCore(plan, {
      ...adapter,
      readProjection: async () => {
        rollbackReadTimes.push(Date.now());
        return projection();
      },
      setIssueState: async () => { throw new Error("synthetic partial failure"); },
    }, { sagaRoot: rollbackSagaRoot, quiescenceIntervalMs: 5 });
    if (rolledBack.code !== "TRANSITION_ROLLED_BACK" || state.status !== "Next") {
      throw new Error("partial failure rollback case failed");
    }
    cases += 1;
    const rollbackSaga = await readSagaEvents(rollbackSagaRoot, plan.planDigest);
    const rollbackVerificationTimes = rollbackReadTimes.slice(-3);
    if (!rolledBackSagaHistoryIsValid(rollbackSaga, plan.plan)
      || rollbackVerificationTimes.length !== 3
      || rollbackVerificationTimes[1] - rollbackVerificationTimes[0] < 4
      || rollbackVerificationTimes[2] - rollbackVerificationTimes[1] < 4) {
      throw new Error("timed rollback verification case failed");
    }
    cases += 1;
    const methodsBeforeRollbackReplay = methods.length;
    const rolledBackReplay = await applyPlanCore(plan, adapter, {
      sagaRoot: rollbackSagaRoot,
      quiescenceIntervalMs: 5,
    });
    if (rolledBackReplay.code !== "TRANSITION_ALREADY_ROLLED_BACK"
      || methods.length !== methodsBeforeRollbackReplay) {
      throw new Error("rolled-back replay verification case failed");
    }
    cases += 1;
    const rolledBackReplayDrift = await applyPlanCore(plan, {
      ...adapter,
      readProjection: async () => ({
        ...projection(),
        issue: { ...projection().issue, body: "synthetic post-rollback drift" },
      }),
    }, { sagaRoot: rollbackSagaRoot, quiescenceIntervalMs: 5 });
    if (rolledBackReplayDrift.code !== "TRANSITION_RECOVERY_REQUIRED") {
      throw new Error("rolled-back replay drift case failed");
    }
    cases += 1;

    reset();
    let projectWrites = 0;
    const recoveryRequired = await applyPlanCore(plan, {
      ...adapter,
      setProjectStatus: async (_taskId, from, to) => {
        projectWrites += 1;
        if (projectWrites > 1) throw new Error("synthetic rollback failure");
        if (state.status !== from) throw new Error("status compare-and-swap failed");
        state.status = to;
      },
      setIssueState: async () => { throw new Error("synthetic partial failure"); },
    }, { sagaRoot: nextSagaRoot(), quiescenceIntervalMs: 5 });
    if (recoveryRequired.code !== "TRANSITION_RECOVERY_REQUIRED") throw new Error("rollback failure hold case failed");
    cases += 1;

    reset();
    let projectionReads = 0;
    const quiescentDrift = await applyPlanCore(plan, {
      ...adapter,
      readProjection: async () => {
        projectionReads += 1;
        const currentProjection = projection();
        return projectionReads >= 3
          ? { ...currentProjection, projectItem: {
            ...currentProjection.projectItem,
            fields: { ...currentProjection.projectItem.fields, Evidence: "workflow drift" },
          } }
          : currentProjection;
      },
    }, { sagaRoot: nextSagaRoot(), quiescenceIntervalMs: 5 });
    if (quiescentDrift.code !== "TRANSITION_RECOVERY_REQUIRED") throw new Error("quiescent drift case failed");
    cases += 1;

    reset();
    const resumeSagaRoot = nextSagaRoot();
    await appendSagaEvent(resumeSagaRoot, plan.planDigest, { state: "declared", taskId: plan.plan.taskId }, () => new Date());
    await appendSagaEvent(resumeSagaRoot, plan.planDigest, {
      state: "operation-intent", taskId: plan.plan.taskId, operationIndex: 0, surface: "project-status",
    }, () => new Date());
    await adapter.setProjectStatus(plan.plan.taskId, "Next", "In progress");
    const resumed = await applyPlanCore(plan, adapter, { sagaRoot: resumeSagaRoot, quiescenceIntervalMs: 5 });
    if (resumed.code !== "TRANSITION_ROLLED_BACK" || state.status !== "Next") throw new Error("persisted saga recovery case failed");
    cases += 1;

    reset();
    const sourceMismatch = createDeliveryTransitionDryRun({ ...input, sourceTaskStatus: "In progress" });
    if (sourceMismatch.code !== "TRANSITION_SOURCE_PREIMAGE_MISMATCH") throw new Error("source preimage binding case failed");
    cases += 1;

    state.status = "Backlog";
    state.issueState = "open";
    state.labels = ["phase1", "roadmap", "status:backlog", "priority:high", "type:design"];
    const backlogPreimage = buildProjectionSnapshot(projection());
    const gateAAuthorization = {
      ...authorization,
      scope: "preparation-gate-a",
      code: "PREPARATION_GATE_A_ACCEPTED",
      gateKind: "prepare",
      idempotencyKey: null,
      stageApprovalSha256: null,
      stageDefinitionSha256: null,
      moduleId: null,
      moduleSha256: null,
      gateDecision: "Ready to prepare — Gate A",
      independentQaResult: "not-required",
    };
    const gateABacklogTransition = createDeliveryTransitionDryRun({
      ...input,
      sourceTaskStatus: "Backlog",
      targetStatus: "Next",
      authorization: gateAAuthorization,
      rollback: { ...input.rollback, preChangeSnapshotDigest: backlogPreimage.snapshotDigest },
      liveProjection: projection(),
    });
    if (gateABacklogTransition.code !== "TRANSITION_GATE_B_AUTHORIZATION_INVALID") {
      throw new Error("Gate A Backlog-to-Next authority case failed");
    }
    cases += 1;
    const gateBBacklogTransition = createDeliveryTransitionDryRun({
      ...input,
      sourceTaskStatus: "Backlog",
      targetStatus: "Next",
      authorization,
      rollback: { ...input.rollback, preChangeSnapshotDigest: backlogPreimage.snapshotDigest },
      liveProjection: projection(),
    });
    if (!gateBBacklogTransition.ok
      || gateBBacklogTransition.plan.gateKind !== "execute"
      || gateBBacklogTransition.plan.gateDecision !== "Ready to execute — Gate B"
      || gateBBacklogTransition.plan.stageApprovalSha256 === null) {
      throw new Error("Gate B Backlog-to-Next authority case failed");
    }
    cases += 1;
    reset();

    state.status = "In progress";
    state.issueState = "open";
    state.labels = ["phase1", "roadmap", "status:in-progress", "priority:high", "type:design"];
    const donePreimage = buildProjectionSnapshot(projection());
    const acceptAuthorization = {
      ...authorization,
      stageId: "P0-STAGE-UX-R0-001-ACCEPT-DELIVERY-TRANSITION",
      preparationReviewId: "P0-PREP-UX-R0-001-DELIVERY-ACCEPTANCE",
      idempotencyKey: "P0-IDEMP-UX-R0-001-DELIVERY-ACCEPTANCE-001",
      gateKind: "accept",
      gateDecision: "Ready to accept — Gate B",
    };
    const donePlan = createDeliveryTransitionDryRun({
      ...input,
      sourceTaskStatus: "In progress",
      targetStatus: "Done",
      authorization: acceptAuthorization,
      rollback: { ...input.rollback, preChangeSnapshotDigest: donePreimage.snapshotDigest },
      liveProjection: projection(),
    });
    if (!donePlan.ok || donePlan.plan.gateDecision !== "Ready to accept — Gate B") {
      throw new Error("Gate B acceptance vocabulary case failed");
    }
    cases += 1;
    reset();

    for (const taskId of ["AUD-001", "PC-001", "PRD-R0-001", "PRD-R1-001", "REL-R10-001"]) {
      const denied = createDeliveryTransitionDryRun({
        ...input,
        taskId,
        authorization: { ...input.authorization, taskId, stageId: `P0-STAGE-${taskId}-DELIVERY-TRANSITION` },
        liveProjection: { ...input.liveProjection, taskId },
      });
      if (!["TRANSITION_HISTORICAL_TASK_LOCKED", "TRANSITION_TASK_NOT_ALLOWLISTED"].includes(denied.code)) {
        throw new Error("task allowlist case failed");
      }
      cases += 1;
    }
    for (const mutation of [
      { gateDecision: "Ready to prepare — Gate A" },
      { independentQaResult: "skip" },
      { gateKind: "prepare" },
      { stageApprovalSha256: null },
      { code: "TASK_EXECUTION_START_OK" },
      { stageId: "P0-STAGE-UX-R0-001-SYNTHETIC-FOUNDATION" },
      { idempotencyKey: null },
      { preparationReviewSha256: null },
      { registrySha256: null },
      { stageDefinitionSha256: null },
      { moduleId: null },
      { moduleSha256: null },
      { scopeClass: "local-synthetic", actionClass: "synthetic-foundation" },
      { moduleId: "ux.delivery-transition" },
    ]) {
      const denied = createDeliveryTransitionDryRun({ ...input, authorization: { ...input.authorization, ...mutation } });
      if (denied.code !== "TRANSITION_GATE_B_AUTHORIZATION_INVALID") throw new Error("authorization case failed");
      cases += 1;
    }
    const extra = createDeliveryTransitionDryRun({ ...input, body: "mutation" });
    if (extra.code !== "TRANSITION_INPUT_SHAPE_INVALID") throw new Error("extra surface case failed");
    cases += 1;
    const disabled = await applyReviewedDeliveryTransition({ reviewedPlanDigest: plan.planDigest });
    const symlinkTarget = path.join(root, "transition-symlink-target");
    const symlinkRoot = path.join(root, "transition-symlink-root");
    await mkdir(symlinkTarget, { mode: 0o700 });
    await symlink(symlinkTarget, symlinkRoot);
    const symlinkDenied = await applyPlanCore(plan, adapter, { sagaRoot: symlinkRoot });
    if (disabled.code !== "TRANSITION_APPLY_DISABLED_STAGE0"
      || symlinkDenied.code !== "TRANSITION_TASK_LOCK_INVALID") {
      throw new Error("Stage 0 apply-disable/plain-directory case failed");
    }
    cases += 1;

    const badLabelInput = structuredClone(input);
    badLabelInput.liveProjection.issue.labels.push("status:backlog");
    const badLabels = createDeliveryTransitionDryRun(badLabelInput);
    if (badLabels.code !== "PROJECTION_STATUS_LABEL_CARDINALITY") throw new Error("status-label cardinality case failed");
    cases += 1;

    if (!snapshotMatches(plan.plan, structuredClone(plan.plan))) throw new Error("canonical plan case failed");
    cases += 1;
    return { ok: true, code: "SELF_TEST_OK", cases, applyEnabled: DELIVERY_TRANSITION_APPLY_ENABLED };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function usage() {
  return "Usage: node tools/P0-delivery-transition.mjs --self-test|--help\nStage 0 supports deterministic dry-run planning only; live apply is disabled.";
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  if (process.argv.length === 3 && process.argv[2] === "--self-test") {
    console.log(JSON.stringify(await selfTest()));
  } else if (process.argv.length === 3 && process.argv[2] === "--help") {
    console.log(usage());
  } else {
    console.log(JSON.stringify(result(false, "TRANSITION_CLI_DRY_RUN_ONLY")));
    process.exitCode = 1;
  }
}
