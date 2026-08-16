import crypto from "node:crypto";
import { constants as fsConstants } from "node:fs";
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
  issueStateFor,
  snapshotMatches,
  statusLabelFor,
  transitionEdgeAllowed,
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
  "stageDefinitionSha256", "moduleId", "moduleSha256", "gateKind", "gateDecision", "predecessorReceiptSha256", "fromStatus", "toStatus", "preimageDigest", "targetSnapshotDigest",
  "protectedIssueDigest", "protectedProjectDigest", "authorizationDigest", "rollbackSnapshotReference", "recoveryPlanDigest",
  "operations", "rollbackOperations", "verification", "forbiddenSurfaces",
]);
const OPERATION_KEYS = Object.freeze(["surface", "from", "to"]);
const LABEL_OPERATION_KEYS = Object.freeze(["surface", "remove", "add"]);
const VERIFICATION_KEYS = Object.freeze(["immediateSnapshots", "quiescentSnapshots", "quiescenceIntervalMs"]);
const FROZEN_PARITY_KEYS = Object.freeze(["ok", "taskCount", "snapshotSha256"]);
const PREDECESSOR_VERIFICATION_KEYS = Object.freeze(["ok", "taskId", "stageId", "receiptSha256", "state"]);
const OPERATION_CONTEXT_KEYS = Object.freeze([
  "schemaVersion", "taskId", "stageId", "sourceRevision", "planDigest", "operationIndex",
  "surface", "direction", "deadlineAt", "signal",
]);
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
const VERIFICATION_BOUNDARIES = Object.freeze(["immediate", "quiescent-1", "quiescent-2"]);

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

function validateAuthorization(authorization, input, trustedNowMs = Date.now()) {
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
    && Number.isFinite(trustedNowMs)
    && Number.isFinite(Date.parse(authorization.deadlineAt ?? ""))
    && Date.parse(authorization.deadlineAt) > trustedNowMs;
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

function buildOrdinaryDeliveryTransitionTarget({ taskId, fromStatus, toStatus } = {}) {
  if (!DELIVERY_TRANSITION_GATE_B_CONTRACT.taskIds.includes(taskId)) {
    return Object.freeze({ ok: false, code: "TRANSITION_TASK_NOT_ALLOWLISTED" });
  }
  if (!transitionEdgeAllowed(fromStatus, toStatus)) {
    return Object.freeze({ ok: false, code: "TRANSITION_EDGE_INVALID" });
  }
  return Object.freeze({
    ok: true,
    code: "TRANSITION_TARGET_VALID",
    target: Object.freeze({
      taskId,
      projectStatus: toStatus,
      issueState: issueStateFor(toStatus),
      removeStatusLabel: statusLabelFor(fromStatus),
      addStatusLabel: statusLabelFor(toStatus),
    }),
  });
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
  if (!DELIVERY_TRANSITION_GATE_B_CONTRACT.taskIds.includes(input.taskId)) {
    return result(false, "TRANSITION_TASK_NOT_ALLOWLISTED", { taskId: input.taskId });
  }
  const preimage = buildProjectionSnapshot(input.liveProjection);
  if (!preimage.ok) return result(false, preimage.code, { taskId: input.taskId });
  if (input.sourceTaskStatus !== preimage.snapshot.taskStatus) {
    return result(false, "TRANSITION_SOURCE_PREIMAGE_MISMATCH", { taskId: input.taskId });
  }
  const targetResult = buildOrdinaryDeliveryTransitionTarget({
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
    predecessorReceiptSha256: input.authorization.predecessorReceiptSha256,
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
    && DELIVERY_TRANSITION_GATE_B_CONTRACT.taskIds.includes(plan.taskId)
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
    && (plan.predecessorReceiptSha256 === null
      || SHA256_DIGEST.test(plan.predecessorReceiptSha256 ?? ""))
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

  const targetResult = buildOrdinaryDeliveryTransitionTarget({
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

const DURABLE_DIRECTORY_OPERATIONS = Object.freeze({ lstat, mkdir, syncDirectory });

async function ensureDurableDirectoryWithOperations(directory, operations) {
  const resolved = path.resolve(directory);
  const parent = path.dirname(resolved);
  try {
    await operations.mkdir(resolved, { mode: 0o700 });
  } catch (error) {
    if (error?.code === "ENOENT") {
      await ensureDurableDirectoryWithOperations(parent, operations);
      try {
        await operations.mkdir(resolved, { mode: 0o700 });
      } catch (retryError) {
        if (retryError?.code !== "EEXIST") throw retryError;
      }
    } else if (error?.code !== "EEXIST") {
      throw error;
    }
  }
  const metadata = await operations.lstat(resolved);
  if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
    throw new Error("durable path is not a plain directory");
  }
  await operations.syncDirectory(parent);
  await operations.syncDirectory(resolved);
}

async function ensureDurableDirectory(directory) {
  await ensureDurableDirectoryWithOperations(directory, DURABLE_DIRECTORY_OPERATIONS);
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
    || !DELIVERY_TRANSITION_GATE_B_CONTRACT.taskIds.includes(event.taskId)
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

class SagaAppendDurabilityUncertainError extends Error {
  constructor(cause) {
    super("saga append durability is uncertain", { cause });
    this.name = "SagaAppendDurabilityUncertainError";
  }
}

class SagaLifecycleInvalidError extends Error {
  constructor() {
    super("saga lifecycle is invalid");
    this.name = "SagaLifecycleInvalidError";
  }
}

const DEFAULT_SAGA_APPEND_OPERATIONS = Object.freeze({
  ensureDurableDirectory,
  lstat,
  open,
  readSagaEvents,
  syncDirectory,
});

function statIsPinnedRegularFile(metadata) {
  return metadata?.isFile() === true
    && metadata.isSymbolicLink() === false
    && (metadata.nlink === 1 || metadata.nlink === 1n);
}

function sameFileIdentity(left, right) {
  return left !== undefined
    && right !== undefined
    && left.dev === right.dev
    && left.ino === right.ino;
}

function sagaChainEquals(events, expectedEvents) {
  return events.length === expectedEvents.length
    && canonicalJson(events) === canonicalJson(expectedEvents);
}

async function proveExactDurableSagaTail({
  operations,
  directory,
  filePath,
  createdIdentity,
  expectedBytes,
  existing,
  envelope,
  sagaRoot,
  planDigest,
}) {
  const pathMetadata = await operations.lstat(filePath, { bigint: true });
  if (!statIsPinnedRegularFile(pathMetadata) || !sameFileIdentity(pathMetadata, createdIdentity)) {
    throw new Error("saga tail path identity changed");
  }
  const verifyHandle = await operations.open(
    filePath,
    fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW,
  );
  try {
    const openedMetadata = await verifyHandle.stat({ bigint: true });
    if (!statIsPinnedRegularFile(openedMetadata)
      || !sameFileIdentity(openedMetadata, createdIdentity)
      || !sameFileIdentity(openedMetadata, pathMetadata)) {
      throw new Error("saga tail open identity changed");
    }
    const rereadBytes = await verifyHandle.readFile();
    if (!rereadBytes.equals(expectedBytes)) throw new Error("saga tail bytes differ");
    await verifyHandle.sync();
    const syncedMetadata = await verifyHandle.stat({ bigint: true });
    if (!sameFileIdentity(syncedMetadata, createdIdentity)) throw new Error("saga tail inode changed during fsync");
  } finally {
    await verifyHandle.close();
  }

  const expectedEvents = [...existing, envelope];
  const firstChain = await operations.readSagaEvents(sagaRoot, planDigest);
  const firstPathMetadata = await operations.lstat(filePath, { bigint: true });
  if (!sagaChainEquals(firstChain, expectedEvents)
    || !statIsPinnedRegularFile(firstPathMetadata)
    || !sameFileIdentity(firstPathMetadata, createdIdentity)) {
    throw new Error("saga chain did not acquire exact durable tail");
  }
  await operations.syncDirectory(directory);
  const secondChain = await operations.readSagaEvents(sagaRoot, planDigest);
  const secondPathMetadata = await operations.lstat(filePath, { bigint: true });
  if (!sagaChainEquals(secondChain, firstChain)
    || !sagaChainEquals(secondChain, expectedEvents)
    || !statIsPinnedRegularFile(secondPathMetadata)
    || !sameFileIdentity(secondPathMetadata, createdIdentity)) {
    throw new Error("saga chain changed across directory fsync");
  }
}

async function appendSagaEvent(
  sagaRoot,
  planDigest,
  event,
  clock,
  operations = DEFAULT_SAGA_APPEND_OPERATIONS,
) {
  if (!SAGA_STATES.has(event.state)) throw new Error("saga state invalid");
  const directory = sagaDirectory(sagaRoot, planDigest);
  await operations.ensureDurableDirectory(sagaRoot);
  await operations.ensureDurableDirectory(directory);
  const existing = await operations.readSagaEvents(sagaRoot, planDigest);
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
  const expectedBytes = Buffer.from(`${canonicalJson(envelope)}\n`, "utf8");
  let handle = await operations.open(filePath, "wx", 0o600);
  let createdIdentity;
  try {
    createdIdentity = await handle.stat({ bigint: true });
    if (!statIsPinnedRegularFile(createdIdentity)) throw new Error("new saga tail is not a regular single-link file");
    await handle.writeFile(expectedBytes);
    await handle.sync();
    await handle.close();
    handle = null;
    const visibleMetadata = await operations.lstat(filePath, { bigint: true });
    if (!statIsPinnedRegularFile(visibleMetadata)
      || !sameFileIdentity(visibleMetadata, createdIdentity)) throw new Error("new saga tail path identity changed");
    await operations.syncDirectory(directory);
    return envelope;
  } catch (error) {
    if (handle !== null) await handle.close().catch(() => {});
    try {
      await proveExactDurableSagaTail({
        operations,
        directory,
        filePath,
        createdIdentity,
        expectedBytes,
        existing,
        envelope,
        sagaRoot,
        planDigest,
      });
      return envelope;
    } catch (proofError) {
      throw new SagaAppendDurabilityUncertainError(new AggregateError([error, proofError]));
    }
  }
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
  const tail = events.slice(-5);
  if (!events.some((event) => event.state === "recovery-start")
    || tail.map((event) => event.state).join("\0")
      !== ["verification-pending", "verification-complete", "verification-complete", "verification-complete", "rolled-back"].join("\0")) {
    return false;
  }
  return tail.slice(1, 4).every((event, index) => event.boundary === VERIFICATION_BOUNDARIES[index]
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

async function executeTransitionOperation(adapter, taskId, operation, operationContext) {
  if (operation.surface === "project-status") {
    return adapter.setProjectStatus(taskId, operation.from, operation.to, operationContext);
  }
  if (operation.surface === "issue-state") {
    return adapter.setIssueState(taskId, operation.from, operation.to, operationContext);
  }
  if (operation.surface === "issue-status-label") {
    return adapter.replaceStatusLabel(taskId, operation.remove, operation.add, operationContext);
  }
  throw new Error("forbidden operation");
}

function trustedClockMilliseconds(clock) {
  try {
    const trustedNow = clock();
    return trustedNow instanceof Date ? trustedNow.getTime() : Number.NaN;
  } catch {
    return Number.NaN;
  }
}

async function trustedAuthorizationSnapshot(plan, adapter, clock, boundary) {
  let authorization;
  try {
    authorization = await adapter.verifyAuthorization(plan, boundary);
  } catch {
    return Object.freeze({ ok: false });
  }
  const trustedNowMs = trustedClockMilliseconds(clock);
  const matches = validateAuthorization(authorization, {
    taskId: plan.taskId,
    sourceRevision: plan.sourceRevision,
    targetStatus: plan.toStatus,
  }, trustedNowMs)
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
    && authorization.predecessorReceiptSha256 === plan.predecessorReceiptSha256
    && authorization.rollbackSnapshotReference === plan.rollbackSnapshotReference
    && sha256(canonicalJson(stableAuthorization(authorization))) === plan.authorizationDigest;
  if (!matches) return Object.freeze({ ok: false });
  return Object.freeze({
    ok: true,
    deadlineAt: authorization.deadlineAt,
    deadlineMs: Date.parse(authorization.deadlineAt),
  });
}

async function trustedAuthorizationMatches(plan, adapter, clock, boundary) {
  return (await trustedAuthorizationSnapshot(plan, adapter, clock, boundary)).ok;
}

async function predecessorStillValid(plan, adapter, boundary) {
  if (plan.predecessorReceiptSha256 === null) return true;
  let verification;
  try {
    verification = await adapter.verifyPredecessor({
      taskId: plan.taskId,
      stageId: plan.stageId,
      receiptSha256: plan.predecessorReceiptSha256,
    }, boundary);
  } catch {
    return false;
  }
  return hasExactKeys(verification, PREDECESSOR_VERIFICATION_KEYS)
    && verification.ok === true
    && verification.taskId === plan.taskId
    && verification.stageId === plan.stageId
    && verification.receiptSha256 === plan.predecessorReceiptSha256
    && verification.state === "verified-complete";
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

function projectionMatchesForwardPrefix(rawProjection, plan, prefix) {
  if (!Number.isSafeInteger(prefix) || prefix < 0 || prefix > plan.operations.length) return false;
  const observed = buildProjectionTransitionObservation(rawProjection);
  if (!observed.ok || !observationIsProtected(observed.observation, plan)) return false;
  const expectedTaskStatus = prefix >= 1 ? plan.toStatus : plan.fromStatus;
  const expectedProjectStatus = prefix >= 1 ? plan.toStatus : plan.fromStatus;
  const expectedIssueState = prefix >= 2 ? issueStateFor(plan.toStatus) : issueStateFor(plan.fromStatus);
  const expectedStatusLabel = prefix >= 3 ? statusLabelFor(plan.toStatus) : statusLabelFor(plan.fromStatus);
  return rawProjection.taskStatus === expectedTaskStatus
    && observed.observation.projectStatus === expectedProjectStatus
    && observed.observation.issueState === expectedIssueState
    && observed.observation.statusLabel === expectedStatusLabel;
}

async function operationBoundarySnapshot({ plan, adapter, clock, boundary, expectedPrefix }) {
  try {
    if (await adapter.guardExactMain(plan.sourceRevision, boundary) !== true) {
      return Object.freeze({ ok: false });
    }
    const authorization = await trustedAuthorizationSnapshot(plan, adapter, clock, boundary);
    const projectionMatches = authorization.ok
      && await predecessorStillValid(plan, adapter, boundary)
      && await frozenTaskParityMatches(plan, adapter, boundary)
      && projectionMatchesForwardPrefix(await adapter.readProjection(plan.taskId), plan, expectedPrefix);
    const finalNowMs = trustedClockMilliseconds(clock);
    if (!authorization.ok
      || !projectionMatches
      || !Number.isFinite(finalNowMs)
      || authorization.deadlineMs <= finalNowMs) {
      return Object.freeze({ ok: false });
    }
    return authorization;
  } catch {
    return Object.freeze({ ok: false });
  }
}

async function operationBoundaryMatches(input) {
  return (await operationBoundarySnapshot(input)).ok;
}

function operationExecutionContext({
  plan,
  planDigest,
  operationIndex,
  operation,
  direction,
  authorization,
  controller,
}) {
  const context = Object.freeze({
    schemaVersion: DELIVERY_TRANSITION_SCHEMA_VERSION,
    taskId: plan.taskId,
    stageId: plan.stageId,
    sourceRevision: plan.sourceRevision,
    planDigest,
    operationIndex,
    surface: operation.surface,
    direction,
    deadlineAt: authorization.deadlineAt,
    signal: controller.signal,
  });
  if (Object.keys(context).sort().join("\0") !== [...OPERATION_CONTEXT_KEYS].sort().join("\0")) {
    throw new Error("operation context shape invalid");
  }
  return context;
}

async function executeTransitionOperationWithinAuthority({
  adapter,
  plan,
  planDigest,
  operationIndex,
  operation,
  direction,
  authorization,
  clock,
}) {
  const startedAtMs = trustedClockMilliseconds(clock);
  if (!Number.isFinite(startedAtMs) || authorization.deadlineMs <= startedAtMs) {
    throw new Error("operation authority expired before invocation");
  }
  const controller = new AbortController();
  const context = operationExecutionContext({
    plan,
    planDigest,
    operationIndex,
    operation,
    direction,
    authorization,
    controller,
  });
  const remainingMs = authorization.deadlineMs - startedAtMs;
  const timer = setTimeout(() => controller.abort("operation authority deadline elapsed"), Math.min(remainingMs, 2_147_483_647));
  try {
    const operationResult = await executeTransitionOperation(adapter, plan.taskId, operation, context);
    const settledAtMs = trustedClockMilliseconds(clock);
    if (!Number.isFinite(settledAtMs) || settledAtMs >= authorization.deadlineMs) {
      if (!controller.signal.aborted) controller.abort("operation settled after authority deadline");
      throw new Error("operation settled after authority deadline");
    }
    return operationResult;
  } catch (error) {
    if (trustedClockMilliseconds(clock) >= authorization.deadlineMs && !controller.signal.aborted) {
      controller.abort("operation failed after authority deadline");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function sagaLifecycleIsStrict(events, plan) {
  if (events.length === 0) return Object.freeze({
    phase: "empty",
    prefixes: new Set([0]),
    recoveryStarted: false,
    rollbackIntentIndex: null,
    lastRollbackIndex: -1,
    verificationIndex: 0,
    terminal: null,
  });
  let phase = "forward";
  let prefixes = new Set([0]);
  let nextForwardIndex = 0;
  let forwardIntentIndex = null;
  let recoveryStarted = false;
  let rollbackIntentIndex = null;
  let lastRollbackIndex = -1;
  let verificationIndex = 0;
  let verificationEventDigests = [];
  let terminal = null;

  for (const [eventIndex, event] of events.entries()) {
    if (event.taskId !== plan.taskId || terminal !== null) return null;
    if (eventIndex === 0) {
      if (event.state !== "declared") return null;
      continue;
    }
    if (event.state === "declared") return null;

    if (event.state === "operation-intent") {
      const operation = plan.operations[event.operationIndex];
      if (phase !== "forward"
        || recoveryStarted
        || forwardIntentIndex !== null
        || event.operationIndex !== nextForwardIndex
        || operation?.surface !== event.surface
        || prefixes.size !== 1
        || !prefixes.has(nextForwardIndex)) return null;
      forwardIntentIndex = event.operationIndex;
      prefixes = new Set([event.operationIndex, event.operationIndex + 1]);
      continue;
    }
    if (event.state === "operation-complete") {
      const operation = plan.operations[event.operationIndex];
      if (phase !== "forward"
        || recoveryStarted
        || forwardIntentIndex !== event.operationIndex
        || operation?.surface !== event.surface
        || !prefixes.has(event.operationIndex + 1)) return null;
      prefixes = new Set([event.operationIndex + 1]);
      forwardIntentIndex = null;
      nextForwardIndex += 1;
      continue;
    }
    if (event.state === "recovery-start") {
      if (recoveryStarted || !["forward", "forward-verification"].includes(phase)) return null;
      recoveryStarted = true;
      phase = "recovery-rollback";
      verificationIndex = 0;
      verificationEventDigests = [];
      continue;
    }
    if (event.state === "rollback-intent") {
      const operation = plan.rollbackOperations[event.operationIndex];
      const mutatedPrefix = plan.rollbackOperations.length - event.operationIndex;
      if (!recoveryStarted
        || phase !== "recovery-rollback"
        || rollbackIntentIndex !== null
        || event.operationIndex <= lastRollbackIndex
        || operation?.surface !== event.surface
        || !prefixes.has(mutatedPrefix)) return null;
      rollbackIntentIndex = event.operationIndex;
      prefixes = new Set([mutatedPrefix, mutatedPrefix - 1]);
      continue;
    }
    if (event.state === "rollback-complete") {
      const operation = plan.rollbackOperations[event.operationIndex];
      const mutatedPrefix = plan.rollbackOperations.length - event.operationIndex;
      if (!recoveryStarted
        || phase !== "recovery-rollback"
        || rollbackIntentIndex !== event.operationIndex
        || operation?.surface !== event.surface
        || !prefixes.has(mutatedPrefix - 1)) return null;
      prefixes = new Set([mutatedPrefix - 1]);
      rollbackIntentIndex = null;
      lastRollbackIndex = event.operationIndex;
      continue;
    }
    if (event.state === "verification-pending") {
      if (phase === "forward") {
        if (recoveryStarted
          || forwardIntentIndex !== null
          || nextForwardIndex !== plan.operations.length
          || prefixes.size !== 1
          || !prefixes.has(plan.operations.length)) return null;
        phase = "forward-verification";
      } else if (phase === "recovery-rollback") {
        if (!recoveryStarted || rollbackIntentIndex !== null || !prefixes.has(0)) return null;
        prefixes = new Set([0]);
        phase = "recovery-verification";
      } else {
        return null;
      }
      verificationIndex = 0;
      verificationEventDigests = [];
      continue;
    }
    if (event.state === "verification-complete") {
      const expectedPrefix = phase === "forward-verification"
        ? plan.operations.length
        : phase === "recovery-verification" ? 0 : null;
      const expectedSnapshotDigest = expectedPrefix === plan.operations.length
        ? plan.targetSnapshotDigest
        : plan.preimageDigest;
      if (expectedPrefix === null
        || event.boundary !== VERIFICATION_BOUNDARIES[verificationIndex]
        || event.snapshotDigest !== expectedSnapshotDigest
        || event.protectedIssueDigest !== plan.protectedIssueDigest
        || event.protectedProjectDigest !== plan.protectedProjectDigest
        || event.authorizationDigest !== plan.authorizationDigest
        || !prefixes.has(expectedPrefix)) return null;
      verificationEventDigests.push(event.eventSha256);
      verificationIndex += 1;
      continue;
    }
    if (event.state === "applied-verified") {
      if (phase !== "forward-verification"
        || verificationIndex !== VERIFICATION_BOUNDARIES.length
        || event.verificationReceiptsSha256
          !== sha256(canonicalJson(verificationEventDigests))) return null;
      terminal = event.state;
      continue;
    }
    if (event.state === "rolled-back") {
      if (phase !== "recovery-verification"
        || verificationIndex !== VERIFICATION_BOUNDARIES.length
        || !prefixes.has(0)) return null;
      terminal = event.state;
      continue;
    }
    if (event.state === "recovery-required") {
      if (!recoveryStarted
        || !["recovery-rollback", "recovery-verification"].includes(phase)) return null;
      terminal = event.state;
      continue;
    }
    return null;
  }
  return Object.freeze({
    phase,
    prefixes,
    recoveryStarted,
    rollbackIntentIndex,
    lastRollbackIndex,
    verificationIndex,
    terminal,
  });
}

async function canonicalForwardPrefix(plan, adapter, allowedPrefixes) {
  let rawProjection;
  try {
    rawProjection = await adapter.readProjection(plan.taskId);
  } catch {
    return null;
  }
  for (const prefix of [...allowedPrefixes].sort((left, right) => left - right)) {
    if (projectionMatchesForwardPrefix(rawProjection, plan, prefix)) return prefix;
  }
  return null;
}

async function verifyRollbackProjectionAtBoundaries({
  plan,
  adapter,
  clock,
  quiescenceIntervalMs,
  startIndex = 0,
  onVerified = async () => {},
}) {
  for (let index = startIndex; index < VERIFICATION_BOUNDARIES.length; index += 1) {
    const boundary = VERIFICATION_BOUNDARIES[index];
    if (index > 0) await delay(quiescenceIntervalMs);
    if (!await operationBoundaryMatches({
      plan, adapter, clock, boundary: `rollback-${boundary}-pre-verifier`, expectedPrefix: 0,
    })) return false;
    const verified = buildProjectionSnapshot(await adapter.readProjection(plan.taskId));
    if (!verified.ok
      || verified.snapshotDigest !== plan.preimageDigest
      || verified.snapshot.protectedIssueDigest !== plan.protectedIssueDigest
      || verified.snapshot.protectedProjectDigest !== plan.protectedProjectDigest) return false;
    if (!await operationBoundaryMatches({
      plan, adapter, clock, boundary: `rollback-${boundary}-post-verifier`, expectedPrefix: 0,
    })) return false;
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
  sagaOperations = DEFAULT_SAGA_APPEND_OPERATIONS,
}) {
  const { plan, planDigest } = planEnvelope;
  let recoveryDeclared = false;
  try {
    let recoveryEvents = await sagaOperations.readSagaEvents(sagaRoot, planDigest);
    let lifecycle = sagaLifecycleIsStrict(recoveryEvents, plan);
    if (lifecycle === null || lifecycle.terminal !== null) throw new SagaLifecycleInvalidError();
    if (!lifecycle.recoveryStarted) {
      await appendSagaEvent(
        sagaRoot, planDigest, { state: "recovery-start", taskId: plan.taskId }, clock, sagaOperations,
      );
      recoveryEvents = await sagaOperations.readSagaEvents(sagaRoot, planDigest);
      lifecycle = sagaLifecycleIsStrict(recoveryEvents, plan);
      if (lifecycle === null || !lifecycle.recoveryStarted) throw new SagaLifecycleInvalidError();
    }
    recoveryDeclared = true;
    if (!await frozenTaskParityMatches(plan, adapter, "recovery-start")) throw new Error("frozen task parity drift");
    let forwardPrefix = await canonicalForwardPrefix(plan, adapter, lifecycle.prefixes);
    if (forwardPrefix === null) throw new Error("unknown partial state");
    let rollbackVerificationStartIndex = 0;
    if (lifecycle.phase === "recovery-rollback") {
      let nextRollbackIndex = lifecycle.lastRollbackIndex + 1;
      if (lifecycle.rollbackIntentIndex !== null) {
        const index = lifecycle.rollbackIntentIndex;
        const operation = plan.rollbackOperations[index];
        const mutatedPrefix = plan.rollbackOperations.length - index;
        const rolledBackPrefix = mutatedPrefix - 1;
        if (forwardPrefix === mutatedPrefix) {
          const operationAuthorization = await operationBoundarySnapshot({
            plan,
            adapter,
            clock,
            boundary: `post-intent-rollback-${operation.surface}`,
            expectedPrefix: forwardPrefix,
          });
          if (!operationAuthorization.ok) throw new Error("resumed rollback post-intent boundary drift");
          await executeTransitionOperationWithinAuthority({
            adapter,
            plan,
            planDigest,
            operationIndex: index,
            operation,
            direction: "rollback",
            authorization: operationAuthorization,
            clock,
          });
          if (!await operationBoundaryMatches({
            plan,
            adapter,
            clock,
            boundary: `post-effect-rollback-${operation.surface}`,
            expectedPrefix: rolledBackPrefix,
          })) throw new Error("resumed rollback post-effect boundary drift");
        } else if (forwardPrefix === rolledBackPrefix) {
          if (!await operationBoundaryMatches({
            plan,
            adapter,
            clock,
            boundary: `post-effect-rollback-${operation.surface}`,
            expectedPrefix: rolledBackPrefix,
          })) throw new Error("resumed rollback completion boundary drift");
        } else {
          throw new Error("resumed rollback projection is not intent-bound");
        }
        await appendSagaEvent(sagaRoot, planDigest, {
          state: "rollback-complete", taskId: plan.taskId, operationIndex: index, surface: operation.surface,
        }, clock, sagaOperations);
        forwardPrefix = rolledBackPrefix;
        nextRollbackIndex = index + 1;
      }
      for (let index = nextRollbackIndex; index < plan.rollbackOperations.length; index += 1) {
        const operation = plan.rollbackOperations[index];
        const mutatedPrefix = plan.rollbackOperations.length - index;
        if (forwardPrefix < mutatedPrefix) continue;
        if (forwardPrefix !== mutatedPrefix
          || !await operationBoundaryMatches({
            plan,
            adapter,
            clock,
            boundary: `pre-intent-rollback-${operation.surface}`,
            expectedPrefix: forwardPrefix,
          })) throw new Error("rollback pre-intent boundary drift");
        await appendSagaEvent(sagaRoot, planDigest, {
          state: "rollback-intent", taskId: plan.taskId, operationIndex: index, surface: operation.surface,
        }, clock, sagaOperations);
        const operationAuthorization = await operationBoundarySnapshot({
          plan,
          adapter,
          clock,
          boundary: `post-intent-rollback-${operation.surface}`,
          expectedPrefix: forwardPrefix,
        });
        if (!operationAuthorization.ok) throw new Error("rollback post-intent boundary drift");
        await executeTransitionOperationWithinAuthority({
          adapter,
          plan,
          planDigest,
          operationIndex: index,
          operation,
          direction: "rollback",
          authorization: operationAuthorization,
          clock,
        });
        const rolledBackPrefix = forwardPrefix - 1;
        if (!await operationBoundaryMatches({
          plan,
          adapter,
          clock,
          boundary: `post-effect-rollback-${operation.surface}`,
          expectedPrefix: rolledBackPrefix,
        })) throw new Error("rollback post-effect boundary drift");
        await appendSagaEvent(sagaRoot, planDigest, {
          state: "rollback-complete", taskId: plan.taskId, operationIndex: index, surface: operation.surface,
        }, clock, sagaOperations);
        forwardPrefix = rolledBackPrefix;
      }
      if (forwardPrefix !== 0) throw new Error("rollback prefix incomplete");
      await appendSagaEvent(
        sagaRoot, planDigest, { state: "verification-pending", taskId: plan.taskId }, clock, sagaOperations,
      );
    } else if (lifecycle.phase === "recovery-verification") {
      if (forwardPrefix !== 0) throw new Error("rollback verification prefix invalid");
      rollbackVerificationStartIndex = lifecycle.verificationIndex;
    } else {
      throw new SagaLifecycleInvalidError();
    }
    const rollbackVerified = await verifyRollbackProjectionAtBoundaries({
      plan,
      adapter,
      clock,
      quiescenceIntervalMs,
      startIndex: rollbackVerificationStartIndex,
      onVerified: async (boundary, verified) => appendSagaEvent(sagaRoot, planDigest, {
        state: "verification-complete",
        taskId: plan.taskId,
        boundary,
        snapshotDigest: verified.snapshotDigest,
        protectedIssueDigest: verified.snapshot.protectedIssueDigest,
        protectedProjectDigest: verified.snapshot.protectedProjectDigest,
        authorizationDigest: plan.authorizationDigest,
      }, clock, sagaOperations),
    });
    if (!rollbackVerified) throw new Error("rollback mismatch");
    if (!await operationBoundaryMatches({
      plan, adapter, clock, boundary: "rollback-terminal", expectedPrefix: 0,
    })) throw new Error("rollback terminal boundary drift");
    await appendSagaEvent(
      sagaRoot, planDigest, { state: "rolled-back", taskId: plan.taskId }, clock, sagaOperations,
    );
    return result(false, "TRANSITION_ROLLED_BACK", { taskId: plan.taskId, planDigest });
  } catch (error) {
    if (error instanceof SagaAppendDurabilityUncertainError
      || error instanceof SagaLifecycleInvalidError) throw error;
    if (recoveryDeclared) {
      try {
        await appendSagaEvent(
          sagaRoot, planDigest, { state: "recovery-required", taskId: plan.taskId }, clock, sagaOperations,
        );
      } catch (appendError) {
        if (appendError instanceof SagaAppendDurabilityUncertainError) throw appendError;
      }
    }
    return result(false, "TRANSITION_RECOVERY_REQUIRED", { taskId: plan.taskId, planDigest });
  }
}

async function applyPlanCore(planEnvelope, adapter, {
  sagaRoot,
  clock = () => new Date(),
  quiescenceIntervalMs = QUIESCENCE_INTERVAL_MS,
  sagaOperations = DEFAULT_SAGA_APPEND_OPERATIONS,
} = {}) {
  if (!planIsStructurallyBound(planEnvelope)) return result(false, "TRANSITION_REVIEWED_PLAN_INVALID");
  const plan = planEnvelope.plan;
  const requiredMethods = [
    "guardExactMain", "verifyAuthorization", "verifyFrozenTaskParity", "readProjection",
    "setProjectStatus", "setIssueState", "replaceStatusLabel",
  ];
  if (!requiredMethods.every((name) => typeof adapter?.[name] === "function")
    || (plan.predecessorReceiptSha256 !== null && typeof adapter?.verifyPredecessor !== "function")
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
  const failStuck = () => result(false, "TRANSITION_RECOVERY_REQUIRED", {
    taskId: plan.taskId,
    planDigest: planEnvelope.planDigest,
  });
  const recoverSafely = async () => {
    try {
      return await recoverTransitionToPreimage({
        planEnvelope, adapter, sagaRoot, clock, quiescenceIntervalMs, sagaOperations,
      });
    } catch (error) {
      if (error instanceof SagaAppendDurabilityUncertainError
        || error instanceof SagaLifecycleInvalidError) return failStuck();
      throw error;
    }
  };
  let sagaEvents;
  try {
    sagaEvents = await readSagaEvents(sagaRoot, planEnvelope.planDigest);
  } catch {
    return result(false, "TRANSITION_SAGA_INVALID", { taskId: plan.taskId });
  }
  const sagaLifecycle = sagaLifecycleIsStrict(sagaEvents, plan);
  if (sagaLifecycle === null || sagaLifecycle.terminal === "recovery-required") return failStuck();
  const terminal = sagaEvents.at(-1)?.state;
  if (terminal === "applied-verified") {
    if (appliedSagaHistoryIsValid(sagaEvents, plan)
      && await operationBoundaryMatches({
        plan, adapter, clock, boundary: "applied-replay", expectedPrefix: plan.operations.length,
      })) {
      return finishTerminal(result(true, "TRANSITION_ALREADY_APPLIED_VERIFIED", {
        taskId: plan.taskId, sourceRevision: plan.sourceRevision, planDigest: planEnvelope.planDigest,
      }));
    }
    return result(false, "TRANSITION_RECOVERY_REQUIRED", { taskId: plan.taskId, planDigest: planEnvelope.planDigest });
  }
  if (terminal === "rolled-back") {
    const replayVerified = rolledBackSagaHistoryIsValid(sagaEvents, plan)
      && await operationBoundaryMatches({
        plan, adapter, clock, boundary: "rolled-back-replay", expectedPrefix: 0,
      })
      && await verifyRollbackProjectionAtBoundaries({ plan, adapter, clock, quiescenceIntervalMs });
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
    return finishTerminal(await recoverSafely());
  }
  try {
    await appendSagaEvent(
      sagaRoot, planEnvelope.planDigest, { state: "declared", taskId: plan.taskId }, clock, sagaOperations,
    );
  } catch (error) {
    return error instanceof SagaAppendDurabilityUncertainError
      ? failStuck()
      : result(false, "TRANSITION_SAGA_CONFLICT", { taskId: plan.taskId });
  }
  if (!await operationBoundaryMatches({
    plan, adapter, clock, boundary: "pre-apply", expectedPrefix: 0,
  })) {
    return finishTerminal(await recoverSafely());
  }

  try {
    for (const [index, operation] of plan.operations.entries()) {
      if (!await operationBoundaryMatches({
        plan,
        adapter,
        clock,
        boundary: `pre-intent-forward-${operation.surface}`,
        expectedPrefix: index,
      })) throw new Error("forward pre-intent boundary drift");
      await appendSagaEvent(sagaRoot, planEnvelope.planDigest, {
        state: "operation-intent", taskId: plan.taskId, operationIndex: index, surface: operation.surface,
      }, clock, sagaOperations);
      const operationAuthorization = await operationBoundarySnapshot({
        plan,
        adapter,
        clock,
        boundary: `post-intent-forward-${operation.surface}`,
        expectedPrefix: index,
      });
      if (!operationAuthorization.ok) throw new Error("forward post-intent boundary drift");
      await executeTransitionOperationWithinAuthority({
        adapter,
        plan,
        planDigest: planEnvelope.planDigest,
        operationIndex: index,
        operation,
        direction: "forward",
        authorization: operationAuthorization,
        clock,
      });
      if (!await operationBoundaryMatches({
        plan,
        adapter,
        clock,
        boundary: `post-effect-forward-${operation.surface}`,
        expectedPrefix: index + 1,
      })) throw new Error("forward post-effect boundary drift");
      await appendSagaEvent(sagaRoot, planEnvelope.planDigest, {
        state: "operation-complete", taskId: plan.taskId, operationIndex: index, surface: operation.surface,
      }, clock, sagaOperations);
    }
    await appendSagaEvent(
      sagaRoot, planEnvelope.planDigest, { state: "verification-pending", taskId: plan.taskId }, clock, sagaOperations,
    );
    const verificationReceipts = [];
    for (const [index, boundary] of ["immediate", "quiescent-1", "quiescent-2"].entries()) {
      if (index > 0) await delay(quiescenceIntervalMs);
      if (!await operationBoundaryMatches({
        plan,
        adapter,
        clock,
        boundary: `${boundary}-pre-verifier`,
        expectedPrefix: plan.operations.length,
      })) throw new Error("verification authority drift");
      const verified = buildProjectionSnapshot(await adapter.readProjection(plan.taskId));
      if (!verified.ok
        || verified.snapshotDigest !== plan.targetSnapshotDigest
        || verified.snapshot.protectedIssueDigest !== plan.protectedIssueDigest
        || verified.snapshot.protectedProjectDigest !== plan.protectedProjectDigest) {
        throw new Error("verification projection drift");
      }
      if (!await operationBoundaryMatches({
        plan,
        adapter,
        clock,
        boundary: `${boundary}-post-verifier`,
        expectedPrefix: plan.operations.length,
      })) throw new Error("post-verification authority drift");
      verificationReceipts.push(await appendSagaEvent(sagaRoot, planEnvelope.planDigest, {
        state: "verification-complete",
        taskId: plan.taskId,
        boundary,
        snapshotDigest: verified.snapshotDigest,
        protectedIssueDigest: verified.snapshot.protectedIssueDigest,
        protectedProjectDigest: verified.snapshot.protectedProjectDigest,
        authorizationDigest: plan.authorizationDigest,
      }, clock, sagaOperations));
    }
    if (!await operationBoundaryMatches({
      plan,
      adapter,
      clock,
      boundary: "applied-terminal",
      expectedPrefix: plan.operations.length,
    })) throw new Error("applied terminal boundary drift");
    await appendSagaEvent(sagaRoot, planEnvelope.planDigest, {
      state: "applied-verified",
      taskId: plan.taskId,
      verificationReceiptsSha256: sha256(canonicalJson(verificationReceipts.map((event) => event.eventSha256))),
    }, clock, sagaOperations);
    return finishTerminal(result(true, "TRANSITION_APPLIED_VERIFIED", {
      taskId: plan.taskId,
      sourceRevision: plan.sourceRevision,
      planDigest: planEnvelope.planDigest,
    }));
  } catch (error) {
    if (error instanceof SagaAppendDurabilityUncertainError) return failStuck();
    return finishTerminal(await recoverSafely());
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
      scopeClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass,
      actionClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass,
      sourceRevision: revision,
      candidateRevision: "c".repeat(40),
      dossierDigest: "d".repeat(64),
      preparationReviewId: "P0-PREP-UX-R0-001-DELIVERY-TRANSITION",
      preparationReviewSha256: "e".repeat(64),
      gateKind: "execute",
      predecessorReceiptSha256: `sha256:${"9".repeat(64)}`,
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
    const sagaAppendFault = ({ sagaRoot, planDigest, eventState, phase, makeProofFail = false }) => {
      let armed = true;
      let faultThrown = false;
      let targetFile = null;
      let postFaultChainReads = 0;
      let postFaultDirectorySyncs = 0;
      return {
        faultObserved: () => faultThrown,
        proofChainReads: () => postFaultChainReads,
        proofDirectorySyncs: () => postFaultDirectorySyncs,
        operations: {
          ...DEFAULT_SAGA_APPEND_OPERATIONS,
          open: async (candidate, flags, mode) => {
            const handle = await open(candidate, flags, mode);
            if (!armed
              || flags !== "wx"
              || !path.basename(candidate).endsWith(`-${eventState}.json`)) return handle;
            targetFile = candidate;
            if (phase !== "file-sync") return handle;
            return new Proxy(handle, {
              get(target, property) {
                if (property === "sync") {
                  return async () => {
                    await target.sync();
                    if (armed) {
                      armed = false;
                      faultThrown = true;
                      throw new Error("synthetic write-complete file-sync uncertainty");
                    }
                  };
                }
                const value = target[property];
                return typeof value === "function" ? value.bind(target) : value;
              },
            });
          },
          lstat: async (candidate, options) => {
            if (makeProofFail && faultThrown && candidate === targetFile) {
              throw new Error("synthetic unreadable tail proof");
            }
            return lstat(candidate, options);
          },
          readSagaEvents: async (...args) => {
            if (faultThrown) postFaultChainReads += 1;
            return readSagaEvents(...args);
          },
          syncDirectory: async (candidate) => {
            await syncDirectory(candidate);
            if (faultThrown && candidate === sagaDirectory(sagaRoot, planDigest)) {
              postFaultDirectorySyncs += 1;
            }
            if (armed
              && phase === "directory-sync"
              && targetFile !== null
              && candidate === sagaDirectory(sagaRoot, planDigest)) {
              armed = false;
              faultThrown = true;
              throw new Error("synthetic write-complete directory-sync uncertainty");
            }
          },
        },
      };
    };
    const observedDirectory = path.join(root, "concurrent-observed-directory");
    const observedParent = path.dirname(observedDirectory);
    const durabilityTrace = [];
    let observedDirectoryExists = false;
    const observingOperations = (caller) => ({
      mkdir: async (candidate) => {
        if (candidate !== observedDirectory) throw new Error("unexpected durable directory candidate");
        if (!observedDirectoryExists) {
          observedDirectoryExists = true;
          durabilityTrace.push(`${caller}:mkdir-created`);
          return;
        }
        durabilityTrace.push(`${caller}:mkdir-eexist`);
        const error = new Error("synthetic concurrent observer");
        error.code = "EEXIST";
        throw error;
      },
      lstat: async (candidate) => {
        durabilityTrace.push(`${caller}:lstat-${candidate === observedDirectory ? "directory" : "unexpected"}`);
        return { isDirectory: () => true, isSymbolicLink: () => false };
      },
      syncDirectory: async (candidate) => {
        durabilityTrace.push(`${caller}:sync-${candidate === observedParent ? "parent" : "directory"}`);
      },
    });
    await Promise.all([
      ensureDurableDirectoryWithOperations(observedDirectory, observingOperations("creator")),
      ensureDurableDirectoryWithOperations(observedDirectory, observingOperations("observer")),
    ]);
    const traceFor = (caller) => durabilityTrace.filter((entry) => entry.startsWith(`${caller}:`));
    if (traceFor("creator").join(",")
        !== "creator:mkdir-created,creator:lstat-directory,creator:sync-parent,creator:sync-directory"
      || traceFor("observer").join(",")
        !== "observer:mkdir-eexist,observer:lstat-directory,observer:sync-parent,observer:sync-directory") {
      throw new Error("concurrent EEXIST durable-directory observer case failed");
    }
    cases += 1;
    const plan = createDeliveryTransitionDryRun(input);
    if (!plan.ok || !planIsStructurallyBound(plan)) throw new Error("positive dry-run case failed");
    cases += 1;
    const expiredDryRun = createDeliveryTransitionDryRun({
      ...input,
      authorization: { ...authorization, deadlineAt: new Date(Date.now() - 1).toISOString() },
    });
    if (expiredDryRun.code !== "TRANSITION_GATE_B_AUTHORIZATION_INVALID") {
      throw new Error("expired dry-run authorization case failed");
    }
    cases += 1;
    const methods = [];
    const boundaries = [];
    let positiveSagaRoot = null;
    let durableIntentObservedBeforeMutation = false;
    const adapter = {
      guardExactMain: async (_revision, boundary) => { boundaries.push({ boundary, at: Date.now() }); return true; },
      verifyAuthorization: async () => ({ ...authorization, deadlineAt: new Date(Date.now() + 30_000).toISOString() }),
      verifyPredecessor: async ({ taskId, stageId, receiptSha256 }) => ({
        ok: true,
        taskId,
        stageId,
        receiptSha256,
        state: "verified-complete",
      }),
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
    const { verifyPredecessor: _omittedPredecessorVerifier, ...adapterWithoutPredecessor } = adapter;
    const missingPredecessorVerifier = await applyPlanCore(plan, adapterWithoutPredecessor, {
      sagaRoot: nextSagaRoot(), quiescenceIntervalMs: 5,
    });
    if (missingPredecessorVerifier.code !== "TRANSITION_ADAPTER_INVALID") {
      throw new Error("missing predecessor verifier case failed");
    }
    cases += 1;
    const mismatchedPredecessor = await applyPlanCore(plan, {
      ...adapter,
      verifyPredecessor: async ({ taskId, stageId }) => ({
        ok: true,
        taskId,
        stageId,
        receiptSha256: `sha256:${"0".repeat(64)}`,
        state: "verified-complete",
      }),
    }, { sagaRoot: nextSagaRoot(), quiescenceIntervalMs: 5 });
    if (mismatchedPredecessor.code !== "TRANSITION_RECOVERY_REQUIRED") {
      throw new Error("mismatched predecessor receipt case failed");
    }
    cases += 1;
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
    const quiescentBoundaries = boundaries.filter(({ boundary }) => /^quiescent-[12]-pre-verifier$/.test(boundary));
    if (quiescentBoundaries.length !== 2 || quiescentBoundaries[1].at - quiescentBoundaries[0].at < 4) {
      throw new Error("timed quiescence case failed");
    }
    cases += 1;
    const replay = await applyPlanCore(plan, adapter, { sagaRoot: positiveSagaRoot, quiescenceIntervalMs: 5 });
    if (replay.code !== "TRANSITION_ALREADY_APPLIED_VERIFIED") throw new Error("applied saga replay case failed");
    cases += 1;

    reset();
    let expiredIntentWrites = 0;
    let intentAuthorityExpired = false;
    const trustedIntentNow = new Date("2030-01-01T00:00:00.000Z");
    const expiredDuringIntent = await applyPlanCore(plan, {
      ...adapter,
      verifyAuthorization: async (_candidatePlan, boundary) => {
        if (boundary === "post-intent-forward-project-status") intentAuthorityExpired = true;
        return {
          ...authorization,
          deadlineAt: new Date(trustedIntentNow.getTime()
            + (intentAuthorityExpired ? 0 : 30_000)).toISOString(),
        };
      },
      setProjectStatus: async () => { expiredIntentWrites += 1; },
      setIssueState: async () => { expiredIntentWrites += 1; },
      replaceStatusLabel: async () => { expiredIntentWrites += 1; },
    }, {
      sagaRoot: nextSagaRoot(),
      clock: () => new Date(trustedIntentNow),
      quiescenceIntervalMs: 5,
    });
    if (expiredDuringIntent.code !== "TRANSITION_RECOVERY_REQUIRED" || expiredIntentWrites !== 0) {
      throw new Error("expiry-during-intent case failed");
    }
    cases += 1;

    reset();
    let revokedIntentWrites = 0;
    let intentAuthorityRevoked = false;
    const revokedDuringIntent = await applyPlanCore(plan, {
      ...adapter,
      verifyAuthorization: async (_candidatePlan, boundary) => {
        if (boundary === "post-intent-forward-project-status") intentAuthorityRevoked = true;
        return {
          ...authorization,
          ok: !intentAuthorityRevoked,
          deadlineAt: new Date(Date.now() + 30_000).toISOString(),
        };
      },
      setProjectStatus: async () => { revokedIntentWrites += 1; },
      setIssueState: async () => { revokedIntentWrites += 1; },
      replaceStatusLabel: async () => { revokedIntentWrites += 1; },
    }, { sagaRoot: nextSagaRoot(), quiescenceIntervalMs: 5 });
    if (revokedDuringIntent.code !== "TRANSITION_RECOVERY_REQUIRED" || revokedIntentWrites !== 0) {
      throw new Error("revocation-during-intent case failed");
    }
    cases += 1;

    reset();
    let activeIntermediateBoundary = null;
    const intermediateWrites = [];
    const intermediateProjectionDrift = await applyPlanCore(plan, {
      ...adapter,
      guardExactMain: async (_revision, boundary) => {
        activeIntermediateBoundary = boundary;
        return true;
      },
      readProjection: async () => {
        const currentProjection = projection();
        if (activeIntermediateBoundary === "post-intent-forward-issue-state") {
          return {
            ...currentProjection,
            issue: {
              ...currentProjection.issue,
              body: "synthetic protected intermediate drift",
            },
          };
        }
        return currentProjection;
      },
      setProjectStatus: async (...args) => {
        intermediateWrites.push("project-status");
        return adapter.setProjectStatus(...args);
      },
      setIssueState: async (...args) => {
        intermediateWrites.push("issue-state");
        return adapter.setIssueState(...args);
      },
      replaceStatusLabel: async (...args) => {
        intermediateWrites.push("issue-status-label");
        return adapter.replaceStatusLabel(...args);
      },
    }, { sagaRoot: nextSagaRoot(), quiescenceIntervalMs: 5 });
    if (intermediateProjectionDrift.code !== "TRANSITION_RECOVERY_REQUIRED"
      || state.status !== "In progress"
      || intermediateWrites.join(",") !== "project-status") {
      throw new Error("intermediate projection drift case failed");
    }
    cases += 1;

    const operationContextIsBound = (context, { direction, operationIndex, surface, deadlineAt }) => (
      context !== null
      && Object.isFrozen(context)
      && Object.keys(context).sort().join("\0") === [...OPERATION_CONTEXT_KEYS].sort().join("\0")
      && context.schemaVersion === DELIVERY_TRANSITION_SCHEMA_VERSION
      && context.taskId === plan.plan.taskId
      && context.stageId === plan.plan.stageId
      && context.sourceRevision === plan.plan.sourceRevision
      && context.planDigest === plan.planDigest
      && context.operationIndex === operationIndex
      && context.surface === surface
      && context.direction === direction
      && context.deadlineAt === deadlineAt
      && context.signal instanceof AbortSignal
    );

    reset();
    const forwardStraddleStartMs = Date.parse("2031-01-01T00:00:00.000Z");
    const forwardStraddleDeadlineMs = forwardStraddleStartMs + 100;
    const forwardStraddleDeadlineAt = new Date(forwardStraddleDeadlineMs).toISOString();
    let forwardStraddleNowMs = forwardStraddleStartMs;
    let forwardStraddleContext = null;
    const forwardStraddleCalls = [];
    const forwardStraddleSagaRoot = nextSagaRoot();
    const forwardStraddleAdapter = {
      ...adapter,
      verifyAuthorization: async () => ({ ...authorization, deadlineAt: forwardStraddleDeadlineAt }),
      setProjectStatus: async (taskId, from, to, context) => {
        forwardStraddleCalls.push(`${context.direction}:project-status`);
        forwardStraddleContext = context;
        if (context.signal.aborted) throw new Error("operation signal aborted before invocation");
        await Promise.resolve();
        forwardStraddleNowMs = forwardStraddleDeadlineMs + 1;
        return adapter.setProjectStatus(taskId, from, to);
      },
      setIssueState: async (_taskId, _from, _to, context) => {
        forwardStraddleCalls.push(`${context.direction}:issue-state`);
      },
      replaceStatusLabel: async (_taskId, _remove, _add, context) => {
        forwardStraddleCalls.push(`${context.direction}:issue-status-label`);
      },
    };
    const forwardStraddle = await applyPlanCore(plan, forwardStraddleAdapter, {
      sagaRoot: forwardStraddleSagaRoot,
      clock: () => new Date(forwardStraddleNowMs),
      quiescenceIntervalMs: 5,
    });
    const forwardStraddleReplay = await applyPlanCore(plan, forwardStraddleAdapter, {
      sagaRoot: forwardStraddleSagaRoot,
      clock: () => new Date(forwardStraddleNowMs),
      quiescenceIntervalMs: 5,
    });
    if (forwardStraddle.code !== "TRANSITION_RECOVERY_REQUIRED"
      || forwardStraddleReplay.code !== "TRANSITION_TASK_LOCKED"
      || state.status !== "In progress"
      || forwardStraddleCalls.join(",") !== "forward:project-status"
      || !operationContextIsBound(forwardStraddleContext, {
        direction: "forward",
        operationIndex: 0,
        surface: "project-status",
        deadlineAt: forwardStraddleDeadlineAt,
      })
      || forwardStraddleContext.signal.aborted !== true) {
      throw new Error("forward in-flight deadline straddle case failed");
    }
    cases += 1;

    reset();
    const rollbackStraddleStartMs = Date.parse("2031-01-02T00:00:00.000Z");
    const rollbackStraddleDeadlineMs = rollbackStraddleStartMs + 100;
    const rollbackStraddleDeadlineAt = new Date(rollbackStraddleDeadlineMs).toISOString();
    let rollbackStraddleNowMs = rollbackStraddleStartMs;
    let rollbackStraddleContext = null;
    const rollbackStraddleCalls = [];
    const rollbackStraddleSagaRoot = nextSagaRoot();
    const rollbackStraddleAdapter = {
      ...adapter,
      verifyAuthorization: async () => ({ ...authorization, deadlineAt: rollbackStraddleDeadlineAt }),
      setProjectStatus: async (taskId, from, to, context) => {
        rollbackStraddleCalls.push(`${context.direction}:project-status`);
        if (context.direction === "rollback") {
          rollbackStraddleContext = context;
          if (context.signal.aborted) throw new Error("rollback signal aborted before invocation");
          await Promise.resolve();
          rollbackStraddleNowMs = rollbackStraddleDeadlineMs + 1;
        }
        return adapter.setProjectStatus(taskId, from, to);
      },
      setIssueState: async (_taskId, _from, _to, context) => {
        rollbackStraddleCalls.push(`${context.direction}:issue-state`);
        throw new Error("synthetic forward failure before rollback straddle");
      },
      replaceStatusLabel: async (_taskId, _remove, _add, context) => {
        rollbackStraddleCalls.push(`${context.direction}:issue-status-label`);
      },
    };
    const rollbackStraddle = await applyPlanCore(plan, rollbackStraddleAdapter, {
      sagaRoot: rollbackStraddleSagaRoot,
      clock: () => new Date(rollbackStraddleNowMs),
      quiescenceIntervalMs: 5,
    });
    const rollbackStraddleReplay = await applyPlanCore(plan, rollbackStraddleAdapter, {
      sagaRoot: rollbackStraddleSagaRoot,
      clock: () => new Date(rollbackStraddleNowMs),
      quiescenceIntervalMs: 5,
    });
    if (rollbackStraddle.code !== "TRANSITION_RECOVERY_REQUIRED"
      || rollbackStraddleReplay.code !== "TRANSITION_TASK_LOCKED"
      || state.status !== "Next"
      || rollbackStraddleCalls.join(",")
        !== "forward:project-status,forward:issue-state,rollback:project-status"
      || !operationContextIsBound(rollbackStraddleContext, {
        direction: "rollback",
        operationIndex: 2,
        surface: "project-status",
        deadlineAt: rollbackStraddleDeadlineAt,
      })
      || rollbackStraddleContext.signal.aborted !== true) {
      throw new Error("rollback in-flight deadline straddle case failed");
    }
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
    if (rollbackReferenceDenied.code !== "TRANSITION_RECOVERY_REQUIRED"
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
        ok: boundary !== "post-effect-forward-project-status",
        taskCount: boundary === "post-effect-forward-project-status" ? 49 : 50,
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
    const rollbackBoundaryTimes = [];
    const rolledBack = await applyPlanCore(plan, {
      ...adapter,
      guardExactMain: async (_revision, boundary) => {
        if (/^rollback-(?:immediate|quiescent-[12])-pre-verifier$/.test(boundary)) {
          rollbackBoundaryTimes.push(Date.now());
        }
        return true;
      },
      setIssueState: async () => { throw new Error("synthetic partial failure"); },
    }, { sagaRoot: rollbackSagaRoot, quiescenceIntervalMs: 5 });
    if (rolledBack.code !== "TRANSITION_ROLLED_BACK" || state.status !== "Next") {
      throw new Error("partial failure rollback case failed");
    }
    cases += 1;
    const rollbackSaga = await readSagaEvents(rollbackSagaRoot, plan.planDigest);
    if (!rolledBackSagaHistoryIsValid(rollbackSaga, plan.plan)
      || rollbackBoundaryTimes.length !== 3
      || rollbackBoundaryTimes[1] - rollbackBoundaryTimes[0] < 4
      || rollbackBoundaryTimes[2] - rollbackBoundaryTimes[1] < 4) {
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

    for (const phase of ["file-sync", "directory-sync"]) {
      reset();
      const faultSagaRoot = nextSagaRoot();
      const fault = sagaAppendFault({
        sagaRoot: faultSagaRoot,
        planDigest: plan.planDigest,
        eventState: "operation-complete",
        phase,
      });
      const faultApplied = await applyPlanCore(plan, adapter, {
        sagaRoot: faultSagaRoot,
        quiescenceIntervalMs: 5,
        sagaOperations: fault.operations,
      });
      const faultSaga = await readSagaEvents(faultSagaRoot, plan.planDigest);
      if (faultApplied.code !== "TRANSITION_APPLIED_VERIFIED"
        || !fault.faultObserved()
        || fault.proofChainReads() < 2
        || fault.proofDirectorySyncs() < 1
        || state.status !== "In progress"
        || !appliedSagaHistoryIsValid(faultSaga, plan.plan)) {
        throw new Error(`forward ${phase} tail-proof case failed`);
      }
      cases += 1;
    }

    for (const phase of ["file-sync", "directory-sync"]) {
      reset();
      const faultSagaRoot = nextSagaRoot();
      const fault = sagaAppendFault({
        sagaRoot: faultSagaRoot,
        planDigest: plan.planDigest,
        eventState: "rollback-complete",
        phase,
      });
      const faultRolledBack = await applyPlanCore(plan, {
        ...adapter,
        setIssueState: async () => { throw new Error("synthetic partial failure"); },
      }, {
        sagaRoot: faultSagaRoot,
        quiescenceIntervalMs: 5,
        sagaOperations: fault.operations,
      });
      const faultSaga = await readSagaEvents(faultSagaRoot, plan.planDigest);
      if (faultRolledBack.code !== "TRANSITION_ROLLED_BACK"
        || !fault.faultObserved()
        || fault.proofChainReads() < 2
        || fault.proofDirectorySyncs() < 1
        || state.status !== "Next"
        || !rolledBackSagaHistoryIsValid(faultSaga, plan.plan)) {
        throw new Error(`rollback ${phase} tail-proof case failed`);
      }
      cases += 1;
    }

    reset();
    const unprovableSagaRoot = nextSagaRoot();
    const unprovableFault = sagaAppendFault({
      sagaRoot: unprovableSagaRoot,
      planDigest: plan.planDigest,
      eventState: "operation-complete",
      phase: "file-sync",
      makeProofFail: true,
    });
    let unprovableWrites = 0;
    const unprovableAppend = await applyPlanCore(plan, {
      ...adapter,
      setProjectStatus: async (...args) => {
        unprovableWrites += 1;
        return adapter.setProjectStatus(...args);
      },
      setIssueState: async (...args) => {
        unprovableWrites += 1;
        return adapter.setIssueState(...args);
      },
      replaceStatusLabel: async (...args) => {
        unprovableWrites += 1;
        return adapter.replaceStatusLabel(...args);
      },
    }, {
      sagaRoot: unprovableSagaRoot,
      quiescenceIntervalMs: 5,
      sagaOperations: unprovableFault.operations,
    });
    const unprovableReplay = await applyPlanCore(plan, adapter, {
      sagaRoot: unprovableSagaRoot,
      quiescenceIntervalMs: 5,
    });
    if (unprovableAppend.code !== "TRANSITION_RECOVERY_REQUIRED"
      || !unprovableFault.faultObserved()
      || unprovableWrites !== 1
      || state.status !== "In progress"
      || unprovableReplay.code !== "TRANSITION_TASK_LOCKED") {
      throw new Error("unprovable post-effect tail pin case failed");
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

    const rollbackVerificationEvent = (boundary) => ({
      state: "verification-complete",
      taskId: plan.plan.taskId,
      boundary,
      snapshotDigest: plan.plan.preimageDigest,
      protectedIssueDigest: plan.plan.protectedIssueDigest,
      protectedProjectDigest: plan.plan.protectedProjectDigest,
      authorizationDigest: plan.plan.authorizationDigest,
    });
    const otherTaskId = DELIVERY_TRANSITION_GATE_B_CONTRACT.taskIds.find((taskId) => taskId !== plan.plan.taskId);
    const illegalSagaCases = [
      ["rollback-before-recovery", [
        { state: "declared", taskId: plan.plan.taskId },
        {
          state: "rollback-intent",
          taskId: plan.plan.taskId,
          operationIndex: 2,
          surface: "project-status",
        },
      ]],
      ["forward-after-recovery", [
        { state: "declared", taskId: plan.plan.taskId },
        { state: "recovery-start", taskId: plan.plan.taskId },
        {
          state: "operation-intent",
          taskId: plan.plan.taskId,
          operationIndex: 0,
          surface: "project-status",
        },
      ]],
      ["verification-without-pending", [
        { state: "declared", taskId: plan.plan.taskId },
        rollbackVerificationEvent("immediate"),
      ]],
      ["mismatched-task", [
        { state: "declared", taskId: otherTaskId },
      ]],
      ["post-terminal-append", [
        { state: "declared", taskId: plan.plan.taskId },
        { state: "recovery-start", taskId: plan.plan.taskId },
        { state: "verification-pending", taskId: plan.plan.taskId },
        ...VERIFICATION_BOUNDARIES.map(rollbackVerificationEvent),
        { state: "rolled-back", taskId: plan.plan.taskId },
        { state: "recovery-required", taskId: plan.plan.taskId },
      ]],
    ];
    for (const [caseName, illegalEvents] of illegalSagaCases) {
      reset();
      const illegalSagaRoot = nextSagaRoot();
      for (const illegalEvent of illegalEvents) {
        await appendSagaEvent(illegalSagaRoot, plan.planDigest, illegalEvent, () => new Date());
      }
      let illegalExternalCalls = 0;
      const noCallAdapter = {
        guardExactMain: async () => { illegalExternalCalls += 1; return true; },
        verifyAuthorization: async () => {
          illegalExternalCalls += 1;
          return { ...authorization, deadlineAt: new Date(Date.now() + 30_000).toISOString() };
        },
        verifyPredecessor: async ({ taskId, stageId, receiptSha256 }) => {
          illegalExternalCalls += 1;
          return { ok: true, taskId, stageId, receiptSha256, state: "verified-complete" };
        },
        verifyFrozenTaskParity: async () => {
          illegalExternalCalls += 1;
          return { ok: true, taskCount: 50, snapshotSha256: FROZEN_SNAPSHOT_SHA256 };
        },
        readProjection: async () => { illegalExternalCalls += 1; return projection(); },
        setProjectStatus: async () => { illegalExternalCalls += 1; },
        setIssueState: async () => { illegalExternalCalls += 1; },
        replaceStatusLabel: async () => { illegalExternalCalls += 1; },
      };
      const denied = await applyPlanCore(plan, noCallAdapter, {
        sagaRoot: illegalSagaRoot, quiescenceIntervalMs: 5,
      });
      const pinnedReplay = await applyPlanCore(plan, noCallAdapter, {
        sagaRoot: illegalSagaRoot, quiescenceIntervalMs: 5,
      });
      if (denied.code !== "TRANSITION_RECOVERY_REQUIRED"
        || pinnedReplay.code !== "TRANSITION_TASK_LOCKED"
        || illegalExternalCalls !== 0) {
        throw new Error(`strict illegal saga case failed: ${caseName}`);
      }
      cases += 1;
    }

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

    const ordinaryEdges = [
      ["Backlog", "Next", "execute", "Ready to execute — Gate B"],
      ["Next", "In progress", "execute", "Ready to execute — Gate B"],
      ["In progress", "Done", "accept", "Ready to accept — Gate B"],
    ];
    for (const taskId of DELIVERY_TRANSITION_GATE_B_CONTRACT.taskIds) {
      for (const [fromStatus, toStatus, gateKind, gateDecision] of ordinaryEdges) {
        const liveProjection = {
          ...input.liveProjection,
          taskId,
          taskStatus: fromStatus,
          issue: {
            ...input.liveProjection.issue,
            state: issueStateFor(fromStatus),
            labels: input.liveProjection.issue.labels
              .filter((label) => !label.startsWith("status:"))
              .concat(statusLabelFor(fromStatus)),
          },
          projectItem: { ...input.liveProjection.projectItem, status: fromStatus },
        };
        const edgePreimage = buildProjectionSnapshot(liveProjection);
        const allowed = createDeliveryTransitionDryRun({
          ...input,
          taskId,
          sourceTaskStatus: fromStatus,
          targetStatus: toStatus,
          authorization: {
            ...input.authorization,
            taskId,
            stageId: `P0-STAGE-${taskId}-STATUS-DELIVERY-TRANSITION`,
            preparationReviewId: `P0-PREP-${taskId}-STATUS-DELIVERY-TRANSITION`,
            idempotencyKey: `P0-IDEMP-${taskId}-STATUS-DELIVERY-TRANSITION-001`,
            gateKind,
            gateDecision,
          },
          rollback: { ...input.rollback, preChangeSnapshotDigest: edgePreimage.snapshotDigest },
          liveProjection,
        });
        if (!allowed.ok || !planIsStructurallyBound(allowed)) {
          throw new Error(`ordinary delivery edge case failed: ${taskId}:${fromStatus}:${toStatus}:${allowed.code}`);
        }
        cases += 1;
      }
    }
    for (const taskId of [
      "AUD-001", "PC-001", "PRD-R0-001", "PRD-R1-001", "REL-R10-001", "UNKNOWN-R0-001",
    ]) {
      const denied = createDeliveryTransitionDryRun({
        ...input,
        taskId,
        authorization: { ...input.authorization, taskId, stageId: `P0-STAGE-${taskId}-DELIVERY-TRANSITION` },
        liveProjection: { ...input.liveProjection, taskId },
      });
      if (denied.code !== "TRANSITION_TASK_NOT_ALLOWLISTED") throw new Error("task allowlist case failed");
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
      { scopeClass: "private-execution", actionClass: "project-workflow-mutation" },
      { scopeClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass, actionClass: "project-workflow-mutation" },
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
    if (disabled.code !== "TRANSITION_APPLY_DISABLED_STAGE0") throw new Error("Stage 0 apply-disable case failed");
    cases += 1;
    if (symlinkDenied.code !== "TRANSITION_TASK_LOCK_INVALID") throw new Error("plain-directory case failed");
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
