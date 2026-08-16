import {
  ARTIFACT_KINDS,
  COUNCIL_SEATS,
  DELIVERY_TRANSITION_GATE_B_CONTRACT,
  DESIGN_ACCESSIBILITY_DIMENSIONS,
  DESIGN_STATE_DIMENSIONS,
  OWNER_ACTION_REQUIREMENT_CATALOG,
  READINESS_SCHEMA_VERSION,
  SCOPE_ACTION_COMPATIBILITY,
  canonicalMilestoneForTaskId,
  canonicalOwnerActionIdsForTask,
  computeDossierDigest,
  computeTaskContractSha256,
  computeTaskFilesSha256,
  defaultTaskScopeAction,
  isDedicatedDeliveryTransitionScopeAction,
  isTaskMilestoneScopeActionCompatible,
} from "./P0-readiness-gates.mjs";

export { OWNER_ACTION_REQUIREMENT_CATALOG } from "./P0-readiness-gates.mjs";

const DERIVED_OVERRIDE_KEYS = new Set([
  "artifactReadiness",
  "executionDecision",
  "executionAllowed",
  "executionScope",
  "gateResults",
  "blockers",
  "nextAction",
  "dependenciesEntryEvidenceSatisfied",
  "privateAuthorityState",
  "privateAuthorityEvidenceReference",
  "ownerActions",
  "ownerActionsSatisfied",
  "effectiveArtifactStates",
  "normalizedEvidence",
  "approvalPublication",
]);

const ALLOWED_OVERRIDE_KEYS = new Set([
  "requestedScopeClass",
  "requestedActionClass",
  "implementerIds",
  "evidenceProducerIds",
  "dependencyEvidence",
  "privateAuthority",
  "openDecisions",
  "unresolvedBlockers",
  "specialistVetoes",
  "designCoverage",
]);

const clone = (value) => value === undefined ? undefined : structuredClone(value);
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value ?? {}, key);
const APPROVAL_BOUND_OVERRIDE_KEYS = Object.freeze([
  "implementerIds",
  "evidenceProducerIds",
  "dependencyEvidence",
  "privateAuthority",
  "openDecisions",
  "unresolvedBlockers",
  "specialistVetoes",
  "designCoverage",
]);

export function acceptanceScenarioIdsFor(taskId) {
  return [
    ...["P-001", "P-002", "P-003"].map((suffix) => `${taskId}-${suffix}`),
    ...["T-001", "T-002", "T-003"].map((suffix) => `${taskId}-${suffix}`),
    ...["D-001", "D-002", "D-003"].map((suffix) => `${taskId}-${suffix}`),
    ...["QA-001", "QA-002", "QA-003", "QA-004", "QA-005", "QA-006"].map((suffix) => `${taskId}-${suffix}`),
  ];
}

export function ownerActionIdsFor(task) {
  if (canonicalMilestoneForTaskId(task?.id) !== task?.milestone) {
    throw new Error(`${task?.id ?? "UNKNOWN-TASK"}: task ID does not belong to milestone ${task?.milestone ?? "UNKNOWN"}`);
  }
  return canonicalOwnerActionIdsForTask({ taskId: task.id, milestone: task.milestone });
}

export function requestedScopeFor(task, override = {}) {
  const taskDefault = defaultTaskScopeAction(task.id);
  if (!taskDefault) throw new Error(`${task.id}: no closed default scope/action pair exists`);
  const requestedStageIdPresent = hasOwn(override, "requestedStageId");
  const requestedScopeClassPresent = hasOwn(override, "requestedScopeClass");
  const requestedActionClassPresent = hasOwn(override, "requestedActionClass");
  if (requestedStageIdPresent && !(requestedScopeClassPresent && requestedActionClassPresent)) {
    throw new Error(`${task.id}: requested stage does not bind the exact dedicated delivery-transition scope/action pair`);
  }
  const requestedScope = {
    scopeClass: override.requestedScopeClass ?? taskDefault.scopeClass,
    actionClass: override.requestedActionClass ?? taskDefault.actionClass,
  };
  if (!SCOPE_ACTION_COMPATIBILITY[requestedScope.scopeClass]?.includes(requestedScope.actionClass)) {
    throw new Error(`${task.id}: incompatible requested scope/action pair ${requestedScope.scopeClass}/${requestedScope.actionClass}`);
  }
  const dedicatedDeliveryTransition = requestedStageIdPresent
    && requestedScopeClassPresent
    && requestedActionClassPresent
    && isDedicatedDeliveryTransitionScopeAction({
      taskId: task.id,
      stageId: override.requestedStageId,
      scopeClass: requestedScope.scopeClass,
      actionClass: requestedScope.actionClass,
    });
  if (requestedStageIdPresent && !dedicatedDeliveryTransition) {
    throw new Error(`${task.id}: requested stage does not bind the exact dedicated delivery-transition scope/action pair`);
  }
  if (!dedicatedDeliveryTransition && !isTaskMilestoneScopeActionCompatible({
    taskId: task.id,
    milestone: task.milestone,
    scopeClass: requestedScope.scopeClass,
    actionClass: requestedScope.actionClass,
  })) {
    throw new Error(`${task.id}: action ${requestedScope.scopeClass}/${requestedScope.actionClass} is not permitted for milestone ${task.milestone}`);
  }
  return requestedScope;
}

function isRequestedDedicatedDeliveryTransition(task, override, requestedScope) {
  return hasOwn(override, "requestedStageId")
    && isDedicatedDeliveryTransitionScopeAction({
      taskId: task.id,
      stageId: override.requestedStageId,
      scopeClass: requestedScope.scopeClass,
      actionClass: requestedScope.actionClass,
    });
}

export function executionScopeLabelFor(task, requestedScope) {
  if (task.status === "Done") return "planning-only-historical";
  if (task.milestone === "P0") return "local-public-control-only";
  if (task.milestone === "R0") {
    if (requestedScope.scopeClass === "private-execution") return "private-authority-and-council-gated";
    if (requestedScope.scopeClass === "release") return "future-release-gated";
    return "local-synthetic-artifact-authoring-only";
  }
  if (["R1", "R2", "R3", "R4"].includes(task.milestone)) return "future-release-gated";
  if (task.milestone === "R5") return "future-synthetic-contract-gated";
  if (["R6", "R7"].includes(task.milestone)) return "future-evaluation-and-human-approval-gated";
  if (task.milestone === "R8") return "future-integrated-evidence-gated";
  if (task.milestone === "R9") return "future-human-launch-gated";
  if (task.milestone === "R10") return "trigger-only-no-execution";
  return requestedScope.scopeClass === "private-execution"
    ? "private-authority-and-council-gated"
    : "future-release-gated";
}

export function validateReadinessState(readinessState, taskIds) {
  if (readinessState?.schemaVersion !== READINESS_SCHEMA_VERSION) {
    throw new Error(`Readiness state schema must be ${READINESS_SCHEMA_VERSION}`);
  }
  const overrides = readinessState.taskOverrides ?? {};
  const unknownTaskIds = Object.keys(overrides).filter((taskId) => !taskIds.has(taskId));
  if (unknownTaskIds.length) throw new Error(`Readiness state contains unknown task IDs: ${unknownTaskIds.join(", ")}`);
  for (const [taskId, override] of Object.entries(overrides)) {
    const derived = Object.keys(override).filter((key) => DERIVED_OVERRIDE_KEYS.has(key));
    if (derived.length) throw new Error(`${taskId}: derived readiness overrides are forbidden: ${derived.join(", ")}`);
    const unknown = Object.keys(override).filter((key) => !ALLOWED_OVERRIDE_KEYS.has(key));
    if (unknown.length) throw new Error(`${taskId}: unknown source-evidence override keys: ${unknown.join(", ")}`);
    if (override.requestedScopeClass === DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass
      || override.requestedActionClass === DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass) {
      throw new Error(`${taskId}: delivery-transition scope/action is ephemeral Gate-B stage authority and cannot be persisted`);
    }
    if (override.requestedScopeClass !== undefined && override.requestedActionClass !== undefined
      && !SCOPE_ACTION_COMPATIBILITY[override.requestedScopeClass]?.includes(override.requestedActionClass)) {
      throw new Error(`${taskId}: incompatible requested scope/action pair ${override.requestedScopeClass}/${override.requestedActionClass}`);
    }
  }
}

function emptyArtifactReviews() {
  return Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
    decision: "hold",
    reviewerId: null,
    reviewerRole: null,
    reviewedRevision: null,
    artifactSha256: null,
    dossierDigest: null,
    evidenceReference: null,
    attestationDigest: null,
    notApplicableRationale: null,
    specialistConcurrence: false,
  }]));
}

function emptySeatVerdicts() {
  return Object.fromEntries(COUNCIL_SEATS.map((seat) => [seat, {
    verdict: "hold",
    reviewerId: null,
    reviewerRole: null,
    reviewedRevision: null,
    dossierDigest: null,
    evidenceReference: null,
    attestationDigest: null,
    rationale: "No execution-permitting exact-candidate attestation is recorded.",
    requestedScopeClass: null,
    requestedActionClass: null,
    requestedCouncilVerdict: null,
    designCoverageDigest: null,
    implementerIdsDigest: null,
    evidenceProducerIdsDigest: null,
    openDecisionsDigest: null,
    unresolvedBlockersDigest: null,
    specialistVetoesDigest: null,
    reviewerRegistrySha256: null,
    ownerActionStateSha256: null,
    taskContractSha256: null,
    baseRevision: null,
    taskFilesSha256: null,
    dependencyEvidenceSha256: null,
    privateAuthoritySha256: null,
    artifactReviewsSha256: null,
  }]));
}

function emptyDesignCoverage() {
  return {
    applicability: "pending",
    journeyIds: [],
    stateCoverage: Object.fromEntries(DESIGN_STATE_DIMENSIONS.map((dimension) => [dimension, []])),
    accessibilityCoverage: Object.fromEntries(DESIGN_ACCESSIBILITY_DIMENSIONS.map((dimension) => [dimension, []])),
    notApplicableRationale: null,
  };
}

function mergeDesignCoverage(...sources) {
  const result = emptyDesignCoverage();
  for (const source of sources.filter(Boolean)) {
    Object.assign(result, source);
    result.stateCoverage = { ...result.stateCoverage, ...(source.stateCoverage ?? {}) };
    result.accessibilityCoverage = { ...result.accessibilityCoverage, ...(source.accessibilityCoverage ?? {}) };
  }
  return result;
}

function candidateFor(task, artifacts, approval, override, taskContractSha256) {
  const source = approval?.candidate ?? {};
  const approvalBound = approval !== null && approval !== undefined;
  const revision = source.revision ?? null;
  const baseRevision = source.baseRevision ?? null;
  const bindings = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
    path: source.artifacts?.[kind]?.path ?? artifacts[kind]?.path ?? null,
    sha256: source.artifacts?.[kind]?.sha256 ?? artifacts[kind]?.sha256 ?? null,
  }]));
  const taskFiles = approvalBound
    ? clone(source.taskFiles ?? [])
    : ARTIFACT_KINDS.map((kind) => ({
      path: bindings[kind].path,
      sha256: bindings[kind].sha256,
      purpose: `artifact:${kind}`,
      gitMode: "100644",
      gitType: "blob",
    }));
  const taskFilesSha256 = approvalBound
    ? source.taskFilesSha256 ?? null
    : computeTaskFilesSha256(taskFiles);
  const computedDigest = revision ? computeDossierDigest({
    taskId: task.id,
    revision,
    baseRevision,
    artifacts: bindings,
    taskFilesSha256,
  }) : null;
  return {
    revision,
    baseRevision,
    dossierDigest: source.dossierDigest ?? computedDigest,
    taskContractSha256: approvalBound ? source.taskContractSha256 ?? null : taskContractSha256,
    artifacts: bindings,
    taskFiles,
    taskFilesSha256,
    implementerIds: clone(approvalBound ? source.implementerIds ?? [] : override.implementerIds ?? []),
    evidenceProducerIds: clone(approvalBound ? source.evidenceProducerIds ?? [] : override.evidenceProducerIds ?? []),
  };
}

/**
 * Build the evaluator's source-only input. Generated projections are never
 * accepted here; candidate reviews come only from the append-only approval
 * registry and mutable readiness state contains requested intent/open facts.
 */
export function buildTaskReadinessInput({
  task,
  artifacts,
  readinessState,
  reviewerRegistry,
  approvalRegistry,
  ownerActionState,
  evaluationPhase = "approval",
}) {
  if (!task?.id) throw new Error("Task readiness input requires a canonical task");
  const override = readinessState?.taskOverrides?.[task.id] ?? {};
  const approval = approvalRegistry?.taskApprovals?.[task.id] ?? null;
  if (approval !== null) {
    const conflictingKeys = APPROVAL_BOUND_OVERRIDE_KEYS.filter((key) => hasOwn(override, key));
    if (conflictingKeys.length) {
      throw new Error(`${task.id}: mutable readiness state cannot override approval-bound evidence: ${conflictingKeys.join(", ")}`);
    }
  }
  const requestedScope = requestedScopeFor(task, override);
  const normalizedArtifacts = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
    path: artifacts?.[kind]?.path ?? null,
    contentState: artifacts?.[kind]?.contentState ?? null,
    sha256: artifacts?.[kind]?.sha256 ?? null,
    observedSha256: artifacts?.[kind]?.observedSha256 ?? null,
    markersValid: artifacts?.[kind]?.markersValid === true,
  }]));
  const acceptanceScenarioIds = acceptanceScenarioIdsFor(task.id);
  const taskContract = {
    taskId: task.id,
    outcome: task.description ?? null,
    requirementIds: clone(task.requirementIds ?? []),
    dependencyIds: clone(task.dependencies ?? []),
    acceptanceEvidence: task.acceptanceEvidence ?? null,
    acceptanceScenarioIds,
  };
  const taskContractSha256 = computeTaskContractSha256(taskContract);
  const candidate = candidateFor(task, normalizedArtifacts, approval, override, taskContractSha256);
  const artifactReviews = {
    ...emptyArtifactReviews(),
    ...clone(approval?.artifactReviews ?? {}),
  };
  const designCoverage = approval === null
    ? mergeDesignCoverage(override.designCoverage)
    : mergeDesignCoverage(approval.designCoverage);
  const unresolvedBlockers = clone(approval?.council?.unresolvedBlockers
    ?? override.unresolvedBlockers
    ?? ["Required task-bound execution reviews and five-seat approval are incomplete."]);
  const council = {
    verdict: approval?.council?.verdict ?? (task.status === "Done" ? "historical-non-authorizing" : "hold"),
    reviewedRevision: approval?.council?.reviewedRevision ?? null,
    dossierDigest: approval?.council?.dossierDigest ?? null,
    unresolvedBlockers,
    seatVerdicts: {
      ...emptySeatVerdicts(),
      ...clone(approval?.council?.seatVerdicts ?? {}),
    },
  };
  const dedicatedDeliveryTransition = isRequestedDedicatedDeliveryTransition(task, override, requestedScope);
  const actionIds = dedicatedDeliveryTransition ? [] : ownerActionIdsFor(task);
  const actionRecords = actionIds.map((actionId) => ownerActionState?.actions?.[actionId]).filter(Boolean).map(clone);
  const actionRecordById = new Map(actionRecords.map((record) => [record.actionId, record]));
  const approvalRecord = clone(approval?.approvalRecord ?? null);
  const source = {
    schemaVersion: READINESS_SCHEMA_VERSION,
    taskId: task.id,
    milestone: task.milestone,
    evaluationPhase,
    requestedScope,
    safety: {
      authenticMediaAccessed: false,
      privateNetworkAccessed: false,
    },
    artifacts: normalizedArtifacts,
    artifactReviews,
    candidate,
    reviewerRegistry: clone(reviewerRegistry),
    outcome: taskContract.outcome,
    acceptanceEvidence: taskContract.acceptanceEvidence,
    requirementIds: clone(task.requirementIds ?? []),
    expectedRequirementIds: clone(task.requirementIds ?? []),
    acceptanceScenarioIds,
    designCoverage,
    dependencyRequirements: (task.dependencies ?? []).map((dependencyId) => ({ dependencyId })),
    dependencyEvidence: clone(approval?.dependencyEvidence ?? override.dependencyEvidence ?? []),
    ownerActionRequirements: actionIds.map((actionId) => {
      const requirement = OWNER_ACTION_REQUIREMENT_CATALOG[actionId];
      if (!requirement) throw new Error(`${task.id}: no canonical owner-action requirement exists for ${actionId}`);
      return {
        actionId,
        accountableHumanId: actionRecordById.get(actionId)?.accountableHumanId ?? null,
        accountableHumanRole: requirement.accountableHumanRole,
        requiredForScopeClasses: clone(requirement.requiredForScopeClasses),
        requiredForActionClasses: clone(requirement.requiredForActionClasses),
      };
    }),
    ownerActions: actionRecords,
    privateAuthority: clone(approval?.privateAuthority ?? override.privateAuthority ?? null),
    openDecisions: clone(approval?.openDecisions ?? override.openDecisions ?? ["Five-seat task-level dossier approval pending."]),
    specialistVetoes: clone(approval?.specialistVetoes ?? override.specialistVetoes ?? []),
    council,
    approvalRecord,
  };
  return source;
}
