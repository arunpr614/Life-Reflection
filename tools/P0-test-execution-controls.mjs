import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  APPROVAL_REGISTRY_PATH,
  ARTIFACT_KINDS,
  COUNCIL_SEATS,
  DESIGN_ACCESSIBILITY_DIMENSIONS,
  DESIGN_STATE_DIMENSIONS,
  DELIVERY_TRANSITION_GATE_B_CONTRACT,
  HISTORICAL_DONE_PLANNING_TASK_IDS,
  HISTORICAL_NON_AUTHORIZING_TASK_IDS,
  LOCAL_SYNTHETIC_CONTENT_POLICY,
  MILESTONE_SCOPE_ACTION_COMPATIBILITY,
  P0_R0_SCOPE_TASK_IDS,
  P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS,
  P0_R0_SUBSTANTIVE_TASK_IDS,
  READINESS_SCHEMA_VERSION,
  SCOPE_ACTION_COMPATIBILITY,
  STAGE_APPROVAL_REGISTRY_PATH,
  STAGE_EXECUTION_SCHEMA_VERSION,
  STAGE_LIFECYCLE_STATES,
  TASK_PREPARATION_SCHEMA_VERSION,
  TASK_APPROVAL_EXECUTION_ACTION_CARDINALITY,
  TASK_EXECUTION_CONTRACT,
  TASK_FUTURE_SCOPE_ACTION_OPTIONS,
  TASK_FILE_DESCENDANT_DELTA_PATHS,
  TASK_FILE_DIFF_EXCLUSIONS,
  TASK_FILE_RUNTIME_DESCENDANT_DELTA_PATHS,
  canonicalJson,
  canonicalMilestoneForTaskId,
  computeArtifactReviewsSha256,
  computeAttestationDigest,
  computeDependencyEvidenceSha256,
  computeDesignCoverageDigest,
  computeDossierDigest,
  computeIdentitySetDigest,
  computePrivateAuthoritySha256,
  computePreparationDossierDigest,
  computePreparationProposalAuthorAttestationDigest,
  computePreparationReviewRecordSha256,
  computeRefreshProtectionFingerprint,
  computeReviewerRegistrySha256,
  computeStringSetDigest,
  computeStageCouncilAttestationDigest,
  computeStageApprovalContextSha256,
  computeStageApprovalSeatAttestationDigest,
  computeTaskApprovalSha256,
  computeTaskContractSha256,
  computeTaskFilesSha256,
  computeTaskOwnerActionStateSha256,
  classifyLocalSyntheticTaskFile,
  evaluateReadiness,
  evaluateStageExecutionGateB,
  evaluateTaskPreparationGateA,
  executeRefreshTransaction,
  isDedicatedDeliveryTransitionScopeAction,
  isTaskMilestoneScopeActionCompatible,
  taskExecutionContractPairCount,
  parseArtifactControlMarkers,
  planProtectedRefresh,
  validateTaskFilesManifest,
} from "./P0-readiness-gates.mjs";
import {
  OWNER_ACTION_REQUIREMENT_CATALOG,
  buildTaskReadinessInput,
  ownerActionIdsFor,
  requestedScopeFor,
  validateReadinessState,
} from "./P0-build-task-readiness-input.mjs";
import { parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";

const FIXED_NOW = "2026-08-15T12:00:00.000Z";
const BASE_REVISION = "9".repeat(40);
const CANDIDATE_REVISION = "a".repeat(40);
const APPROVAL_REVISION = "b".repeat(40);
const ACTIVATION_REVISION = "c".repeat(40);
const repoRoot = path.resolve(import.meta.dirname, "..");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const APPROVAL_REGISTRY_SHA256 = sha256("{\"schemaVersion\":\"1.1.0\",\"controlReviews\":{},\"taskApprovals\":{}}\n");
const clone = (value) => structuredClone(value);
const results = [];

const roleByArtifact = {
  product: "product",
  architecture: "architecture",
  design: "design",
  qa: "qa",
  delivery: "project",
  council: "project",
};
const roleBySeat = {
  product: "product",
  design: "design",
  architecture: "architecture",
  qa: "qa",
  project: "project",
};

function reviewerIdForRole(role) {
  return `reviewer-${role}`;
}

function recomputeBindings(fixture) {
  fixture.candidate.artifacts = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
    path: fixture.artifacts[kind].path,
    sha256: fixture.artifacts[kind].sha256,
  }]));
  const taskFilesSha256 = computeTaskFilesSha256(fixture.candidate.taskFiles);
  fixture.candidate.taskFilesSha256 = taskFilesSha256;
  fixture.candidate.dossierDigest = computeDossierDigest({
    taskId: fixture.taskId,
    revision: fixture.candidate.revision,
    baseRevision: fixture.candidate.baseRevision,
    artifacts: fixture.candidate.artifacts,
    taskFilesSha256,
  });
  const taskContractSha256 = computeTaskContractSha256({
    taskId: fixture.taskId,
    outcome: fixture.outcome,
    requirementIds: fixture.requirementIds,
    dependencyIds: fixture.dependencyRequirements.map((entry) => (
      typeof entry === "string" ? entry : entry.dependencyId
    )),
    acceptanceEvidence: fixture.acceptanceEvidence,
    acceptanceScenarioIds: fixture.acceptanceScenarioIds,
  });
  fixture.candidate.taskContractSha256 = taskContractSha256;
  for (const kind of ARTIFACT_KINDS) {
    const review = fixture.artifactReviews[kind];
    review.reviewedRevision = fixture.candidate.revision;
    review.artifactSha256 = fixture.artifacts[kind].sha256;
    review.dossierDigest = fixture.candidate.dossierDigest;
    review.attestationDigest = computeAttestationDigest({
      taskId: fixture.taskId,
      subjectType: "artifact",
      subject: kind,
      decision: review.decision,
      reviewerId: review.reviewerId,
      reviewerRole: review.reviewerRole,
      reviewedRevision: review.reviewedRevision,
      dossierDigest: review.dossierDigest,
      artifactSha256: review.artifactSha256,
      evidenceReference: review.evidenceReference,
      notApplicableRationale: review.notApplicableRationale,
      specialistConcurrence: review.specialistConcurrence,
    });
  }
  fixture.council.reviewedRevision = fixture.candidate.revision;
  fixture.council.dossierDigest = fixture.candidate.dossierDigest;
  fixture.approvalRecord.candidateRevision = fixture.candidate.revision;
  fixture.approvalRecord.dossierDigest = fixture.candidate.dossierDigest;
  for (const action of fixture.ownerActions) {
    if (action.status !== "complete") continue;
    action.candidateRevision = fixture.candidate.revision;
    action.dossierDigest = fixture.candidate.dossierDigest;
  }
  if (fixture.privateAuthority && typeof fixture.privateAuthority === "object") {
    fixture.privateAuthority.candidateRevision = fixture.candidate.revision;
    fixture.privateAuthority.dossierDigest = fixture.candidate.dossierDigest;
  }
  const designCoverageDigest = computeDesignCoverageDigest(fixture.designCoverage);
  const implementerIdsDigest = computeIdentitySetDigest(fixture.candidate.implementerIds);
  const evidenceProducerIdsDigest = computeIdentitySetDigest(fixture.candidate.evidenceProducerIds);
  const openDecisionsDigest = computeStringSetDigest(fixture.openDecisions);
  const unresolvedBlockersDigest = computeStringSetDigest(fixture.council.unresolvedBlockers);
  const specialistVetoesDigest = computeStringSetDigest(fixture.specialistVetoes);
  const dependencyEvidenceSha256 = computeDependencyEvidenceSha256(fixture.dependencyEvidence);
  const privateAuthoritySha256 = computePrivateAuthoritySha256(fixture.privateAuthority);
  const artifactReviewsSha256 = computeArtifactReviewsSha256(fixture.artifactReviews);
  const reviewerRegistrySha256 = computeReviewerRegistrySha256(fixture.reviewerRegistry);
  const ownerActionStateSha256 = computeTaskOwnerActionStateSha256({
    taskId: fixture.taskId,
    requirements: fixture.ownerActionRequirements,
    records: fixture.ownerActions,
  });
  for (const seat of COUNCIL_SEATS) {
    const record = fixture.council.seatVerdicts[seat];
    record.reviewedRevision = fixture.candidate.revision;
    record.dossierDigest = fixture.candidate.dossierDigest;
    record.requestedScopeClass = fixture.requestedScope.scopeClass;
    record.requestedActionClass = fixture.requestedScope.actionClass;
    record.requestedCouncilVerdict = fixture.council.verdict;
    record.designCoverageDigest = designCoverageDigest;
    record.implementerIdsDigest = implementerIdsDigest;
    record.evidenceProducerIdsDigest = evidenceProducerIdsDigest;
    record.openDecisionsDigest = openDecisionsDigest;
    record.unresolvedBlockersDigest = unresolvedBlockersDigest;
    record.specialistVetoesDigest = specialistVetoesDigest;
    record.taskContractSha256 = taskContractSha256;
    record.baseRevision = fixture.candidate.baseRevision;
    record.taskFilesSha256 = taskFilesSha256;
    record.dependencyEvidenceSha256 = dependencyEvidenceSha256;
    record.privateAuthoritySha256 = privateAuthoritySha256;
    record.artifactReviewsSha256 = artifactReviewsSha256;
    record.reviewerRegistrySha256 = reviewerRegistrySha256;
    record.ownerActionStateSha256 = ownerActionStateSha256;
    record.attestationDigest = computeAttestationDigest({
      taskId: fixture.taskId,
      subjectType: "seat",
      subject: seat,
      decision: record.verdict,
      reviewerId: record.reviewerId,
      reviewerRole: record.reviewerRole,
      reviewedRevision: record.reviewedRevision,
      dossierDigest: record.dossierDigest,
      artifactSha256: null,
      evidenceReference: record.evidenceReference,
      requestedScopeClass: record.requestedScopeClass,
      requestedActionClass: record.requestedActionClass,
      requestedCouncilVerdict: record.requestedCouncilVerdict,
      rationale: record.rationale,
      designCoverageDigest: record.designCoverageDigest,
      implementerIdsDigest: record.implementerIdsDigest,
      evidenceProducerIdsDigest: record.evidenceProducerIdsDigest,
      openDecisionsDigest: record.openDecisionsDigest,
      unresolvedBlockersDigest: record.unresolvedBlockersDigest,
      specialistVetoesDigest: record.specialistVetoesDigest,
      taskContractSha256: record.taskContractSha256,
      baseRevision: record.baseRevision,
      taskFilesSha256: record.taskFilesSha256,
      dependencyEvidenceSha256: record.dependencyEvidenceSha256,
      privateAuthoritySha256: record.privateAuthoritySha256,
      artifactReviewsSha256: record.artifactReviewsSha256,
      reviewerRegistrySha256: record.reviewerRegistrySha256,
      ownerActionStateSha256: record.ownerActionStateSha256,
    });
  }
  return fixture;
}

function localFixture() {
  const taskId = "PC-001";
  const acceptanceScenarioIds = [
    "PC-001-P-001",
    "PC-001-T-001",
    "PC-001-D-001",
    "PC-001-D-002",
    "PC-001-D-003",
    "PC-001-QA-001",
  ];
  const artifacts = Object.fromEntries(ARTIFACT_KINDS.map((kind) => {
    const bytes = `# ${taskId} ${kind}\n\nFictional public-safe fixture.\n`;
    const digest = sha256(bytes);
    return [kind, {
      path: `tools/P0-fixtures/P0-${taskId}-${kind}.md`,
      contentState: "in-review",
      sha256: digest,
      observedSha256: digest,
      markersValid: true,
    }];
  }));
  const taskFiles = [
    ...ARTIFACT_KINDS.map((kind) => ({
      path: artifacts[kind].path,
      sha256: artifacts[kind].sha256,
      purpose: `artifact:${kind}`,
      gitMode: "100644",
      gitType: "blob",
    })),
    {
      path: "tools/P0-readiness-gates.mjs",
      sha256: sha256("fictional readiness-gate implementation bytes\n"),
      purpose: "implementation",
      gitMode: "100644",
      gitType: "blob",
    },
    {
      path: "tools/sync_phase1_github.mjs",
      sha256: sha256("fictional grandfathered implementation bytes\n"),
      purpose: "implementation",
      gitMode: "100755",
      gitType: "blob",
    },
    {
      path: "tools/P0-test-execution-controls.mjs",
      sha256: sha256("fictional execution-control evidence bytes\n"),
      purpose: "implementation",
      gitMode: "100644",
      gitType: "blob",
    },
    {
      path: "docs/council/execution/releases/P0-PC-001-READINESS-HARDENING-PLANNING-REVIEW.md",
      sha256: sha256("fictional task-scoped review evidence bytes\n"),
      purpose: "evidence",
      gitMode: "100644",
      gitType: "blob",
    },
    {
      path: "docs/council/execution/releases/P0-PC-001-READINESS-HARDENING-REVIEW.xlsx",
      sha256: sha256("fictional public-safe review workbook bytes\n"),
      purpose: "evidence",
      gitMode: "100644",
      gitType: "blob",
    },
  ];
  const reviewerRegistry = {
    reviewers: [
      { reviewerId: "reviewer-product", role: "product", active: true },
      { reviewerId: "reviewer-design", role: "design", active: true },
      { reviewerId: "reviewer-architecture", role: "architecture", active: true },
      { reviewerId: "reviewer-qa", role: "qa", active: true },
      { reviewerId: "reviewer-project", role: "project", active: true },
      { reviewerId: "implementer-controls", role: "implementation", active: true },
      { reviewerId: P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0], role: "implementation", active: true },
      { reviewerId: "fixture-author-controls", role: "evidence-producer", active: true },
      {
        reviewerId: "fictional-owner-human",
        role: "owner-authority",
        identityClass: "human",
        active: true,
      },
    ],
  };
  const artifactReviews = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
    decision: "approved",
    reviewerId: reviewerIdForRole(roleByArtifact[kind]),
    reviewerRole: roleByArtifact[kind],
    reviewedRevision: null,
    artifactSha256: null,
    dossierDigest: null,
    evidenceReference: `review:${taskId}-${kind}-R1`,
    attestationDigest: null,
    notApplicableRationale: null,
    specialistConcurrence: false,
  }]));
  const seatVerdicts = Object.fromEntries(COUNCIL_SEATS.map((seat) => [seat, {
    verdict: "approved",
    reviewerId: reviewerIdForRole(roleBySeat[seat]),
    reviewerRole: roleBySeat[seat],
    reviewedRevision: null,
    dossierDigest: null,
    evidenceReference: `seat:${taskId}-${seat}-R1`,
    attestationDigest: null,
    rationale: `The ${seat} seat approves this fictional candidate.`,
  }]));
  const fixture = {
    schemaVersion: READINESS_SCHEMA_VERSION,
    taskId,
    milestone: "P0",
    outcome: "Prove fictional task-readiness controls fail closed before any execution starts.",
    acceptanceEvidence: "Executable fictional gate fixtures pass with isolated negative evidence for every control class.",
    evaluatedAt: FIXED_NOW,
    evaluationPhase: "approval",
    requestedScope: {
      scopeClass: "local-synthetic",
      actionClass: "readiness-control-hardening",
    },
    safety: {
      authenticMediaAccessed: false,
      privateNetworkAccessed: false,
    },
    artifacts,
    artifactReviews,
    candidate: {
      baseRevision: BASE_REVISION,
      revision: CANDIDATE_REVISION,
      dossierDigest: null,
      artifacts: {},
      taskFiles,
      taskFilesSha256: null,
      implementerIds: ["implementer-controls"],
      evidenceProducerIds: ["fixture-author-controls"],
    },
    reviewerRegistry,
    requirementIds: [],
    expectedRequirementIds: [],
    acceptanceScenarioIds,
    designCoverage: {
      applicability: "applicable",
      journeyIds: ["PC-001-D-001", "PC-001-D-002", "PC-001-D-003"],
      stateCoverage: Object.fromEntries(DESIGN_STATE_DIMENSIONS.map((dimension) => [
        dimension,
        [dimension === "normal" || dimension === "empty" || dimension === "loading" ? "PC-001-D-001" : "PC-001-D-003"],
      ])),
      accessibilityCoverage: Object.fromEntries(DESIGN_ACCESSIBILITY_DIMENSIONS.map((dimension) => [dimension, ["PC-001-D-002"]])),
      notApplicableRationale: null,
    },
    dependencyRequirements: [{ dependencyId: "AUD-001" }],
    dependencyEvidence: [{
      dependencyId: "AUD-001",
      result: "pass",
      evidenceReference: "dependency:PC-001-AUD-001",
    }],
    ownerActionRequirements: [
      {
        actionId: "P0-OA-001",
        requiredForScopeClasses: ["private-execution", "release"],
        requiredForActionClasses: [...OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-001"].requiredForActionClasses],
        accountableHumanId: null,
        accountableHumanRole: "owner-authority",
      },
      {
        actionId: "P0-OA-002",
        requiredForScopeClasses: [...OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-002"].requiredForScopeClasses],
        requiredForActionClasses: [...OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-002"].requiredForActionClasses],
        accountableHumanId: null,
        accountableHumanRole: "owner-authority",
      },
    ],
    ownerActions: [
      {
        actionId: "P0-OA-001",
        status: "pending",
        requiredForScopeClasses: ["private-execution", "release"],
        requiredForActionClasses: [...OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-001"].requiredForActionClasses],
        accountableHumanId: null,
        accountableHumanRole: "owner-authority",
        ownerAttestationReference: null,
        result: null,
        verifierId: null,
        verifierRole: null,
        verifiedAt: null,
        evidenceReference: null,
        candidateRevision: null,
        dossierDigest: null,
      },
      {
        actionId: "P0-OA-002",
        status: "pending",
        requiredForScopeClasses: [...OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-002"].requiredForScopeClasses],
        requiredForActionClasses: [...OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-002"].requiredForActionClasses],
        accountableHumanId: null,
        accountableHumanRole: "owner-authority",
        ownerAttestationReference: null,
        result: null,
        verifierId: null,
        verifierRole: null,
        verifiedAt: null,
        evidenceReference: null,
        candidateRevision: null,
        dossierDigest: null,
      },
    ],
    privateAuthority: null,
    openDecisions: [],
    specialistVetoes: [],
    council: {
      verdict: "ready-local-synthetic",
      reviewedRevision: null,
      dossierDigest: null,
      unresolvedBlockers: [],
      seatVerdicts,
    },
    approvalRecord: {
      candidateRevision: null,
      dossierDigest: null,
      approvalsVerified: true,
    },
  };
  return recomputeBindings(fixture);
}

function privateFixture() {
  const fixture = localFixture();
  fixture.requestedScope = {
    scopeClass: "private-execution",
    actionClass: "private-system-read",
  };
  fixture.council.verdict = "ready-private-execution";
  fixture.ownerActionRequirements[0].accountableHumanId = "fictional-owner-human";
  fixture.ownerActions = [{
    actionId: "P0-OA-001",
    status: "complete",
    requiredForScopeClasses: ["private-execution", "release"],
    requiredForActionClasses: [...OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-001"].requiredForActionClasses],
    accountableHumanId: "fictional-owner-human",
    accountableHumanRole: "owner-authority",
    ownerAttestationReference: "owner:P0-OA-001-FICTIONAL",
    result: "pass",
    verifierId: "reviewer-project",
    verifierRole: "project",
    verifiedAt: "2026-08-15T11:00:00.000Z",
    evidenceReference: "action:P0-OA-001-FICTIONAL",
    candidateRevision: null,
    dossierDigest: null,
  }];
  fixture.privateAuthority = {
    authorityId: "P0-AUTH-FICTIONAL-001",
    taskId: fixture.taskId,
    scopeClass: "private-execution",
    allowedActionClass: "private-system-read",
    verifierId: "reviewer-project",
    verifierRole: "project",
    windowStart: "2026-08-15T11:30:00.000Z",
    windowEnd: "2026-08-15T12:30:00.000Z",
    result: "pass",
    ownerActionId: "P0-OA-001",
    evidenceReference: "authority:P0-AUTH-FICTIONAL-001",
    accountableHumanId: "fictional-owner-human",
    accountableHumanRole: "owner-authority",
    ownerAttestationReference: "owner:P0-OA-001-FICTIONAL",
    candidateRevision: null,
    dossierDigest: null,
  };
  return recomputeBindings(fixture);
}

function projectWorkflowFixture() {
  const fixture = privateFixture();
  fixture.requestedScope.actionClass = "project-workflow-mutation";
  fixture.privateAuthority.allowedActionClass = "project-workflow-mutation";
  fixture.ownerActionRequirements[1].accountableHumanId = "fictional-owner-human";
  fixture.ownerActions.push({
    actionId: "P0-OA-002",
    status: "complete",
    requiredForScopeClasses: [...OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-002"].requiredForScopeClasses],
    requiredForActionClasses: [...OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-002"].requiredForActionClasses],
    accountableHumanId: "fictional-owner-human",
    accountableHumanRole: "owner-authority",
    ownerAttestationReference: "owner:P0-OA-002-FICTIONAL",
    result: "pass",
    verifierId: "reviewer-project",
    verifierRole: "project",
    verifiedAt: "2026-08-15T11:02:00.000Z",
    evidenceReference: "action:P0-OA-002-FICTIONAL",
    candidateRevision: null,
    dossierDigest: null,
  });
  return recomputeBindings(fixture);
}

function designNotApplicableFixture() {
  const fixture = localFixture();
  const rationale = "This fictional control has no human-facing or operator-facing Design decision.";
  fixture.artifactReviews.design.decision = "not-applicable";
  fixture.artifactReviews.design.notApplicableRationale = rationale;
  fixture.artifactReviews.design.specialistConcurrence = true;
  fixture.designCoverage = {
    applicability: "not-applicable",
    journeyIds: [],
    stateCoverage: Object.fromEntries(DESIGN_STATE_DIMENSIONS.map((dimension) => [dimension, []])),
    accessibilityCoverage: Object.fromEntries(DESIGN_ACCESSIBILITY_DIMENSIONS.map((dimension) => [dimension, []])),
    notApplicableRationale: rationale,
  };
  fixture.council.seatVerdicts.design.verdict = "not-applicable";
  return recomputeBindings(fixture);
}

function releaseFixture() {
  const fixture = privateFixture();
  fixture.requestedScope = {
    scopeClass: "release",
    actionClass: "release-publication",
  };
  fixture.council.verdict = "proceed-release";
  fixture.privateAuthority.scopeClass = "release";
  fixture.privateAuthority.allowedActionClass = "release-publication";
  return recomputeBindings(fixture);
}

function retargetedActionFixture(factory, { taskId, milestone, scopeClass, actionClass }) {
  const fixture = factory();
  fixture.taskId = taskId;
  fixture.milestone = milestone;
  fixture.requestedScope = { scopeClass, actionClass };
  fixture.council.verdict = scopeClass === "local-synthetic"
    ? "ready-local-synthetic"
    : scopeClass === "private-execution" ? "ready-private-execution" : "proceed-release";
  if (fixture.privateAuthority) {
    fixture.privateAuthority.taskId = taskId;
    fixture.privateAuthority.scopeClass = scopeClass;
    fixture.privateAuthority.allowedActionClass = actionClass;
  }
  return recomputeBindings(fixture);
}

function retargetTaskFixture(factory, {
  taskId,
  milestone,
  scopeClass,
  actionClass,
  completeDueActions = false,
}) {
  const fixture = factory();
  fixture.taskId = taskId;
  fixture.milestone = milestone;
  fixture.requestedScope = { scopeClass, actionClass };
  fixture.council.verdict = scopeClass === "local-synthetic"
    ? "ready-local-synthetic"
    : scopeClass === "private-execution" ? "ready-private-execution" : "proceed-release";
  for (const kind of ARTIFACT_KINDS) {
    fixture.artifacts[kind].path = fixture.artifacts[kind].path.replaceAll("PC-001", taskId);
  }
  fixture.candidate.taskFiles = fixture.candidate.taskFiles.map((entry) => ({
    ...entry,
    path: entry.path.replaceAll("PC-001", taskId),
  }));
  fixture.acceptanceScenarioIds = fixture.acceptanceScenarioIds.map((id) => id.replaceAll("PC-001", taskId));
  fixture.designCoverage = JSON.parse(JSON.stringify(fixture.designCoverage).replaceAll("PC-001", taskId));

  const actionIds = ownerActionIdsFor({ id: taskId, milestone });
  fixture.ownerActionRequirements = actionIds.map((actionId) => {
    const requirement = OWNER_ACTION_REQUIREMENT_CATALOG[actionId];
    const due = requirement.requiredForScopeClasses.includes(scopeClass)
      && requirement.requiredForActionClasses.includes(actionClass);
    return {
      actionId,
      requiredForScopeClasses: [...requirement.requiredForScopeClasses],
      requiredForActionClasses: [...requirement.requiredForActionClasses],
      accountableHumanId: due && completeDueActions ? "fictional-owner-human" : null,
      accountableHumanRole: requirement.accountableHumanRole,
    };
  });
  fixture.ownerActions = actionIds.map((actionId) => {
    const requirement = OWNER_ACTION_REQUIREMENT_CATALOG[actionId];
    const due = requirement.requiredForScopeClasses.includes(scopeClass)
      && requirement.requiredForActionClasses.includes(actionClass);
    if (!due || !completeDueActions) return pendingOwnerActionRecord(actionId);
    return {
      actionId,
      status: "complete",
      requiredForScopeClasses: [...requirement.requiredForScopeClasses],
      requiredForActionClasses: [...requirement.requiredForActionClasses],
      accountableHumanId: "fictional-owner-human",
      accountableHumanRole: "owner-authority",
      ownerAttestationReference: `owner:${actionId}-FICTIONAL`,
      result: "pass",
      verifierId: "reviewer-project",
      verifierRole: "project",
      verifiedAt: "2026-08-15T11:10:00.000Z",
      evidenceReference: `action:${actionId}-FICTIONAL`,
      candidateRevision: null,
      dossierDigest: null,
    };
  });
  fixture.privateAuthority = ["private-execution", "release"].includes(scopeClass) && completeDueActions
    ? {
        authorityId: `P0-AUTH-${taskId.replaceAll("-", "")}-001`,
        taskId,
        scopeClass,
        allowedActionClass: actionClass,
        verifierId: "reviewer-project",
        verifierRole: "project",
        windowStart: "2026-08-15T11:30:00.000Z",
        windowEnd: "2026-08-15T12:30:00.000Z",
        result: "pass",
        ownerActionId: "P0-OA-001",
        evidenceReference: `authority:P0-AUTH-${taskId.replaceAll("-", "")}-001`,
        accountableHumanId: "fictional-owner-human",
        accountableHumanRole: "owner-authority",
        ownerAttestationReference: "owner:P0-OA-001-FICTIONAL",
        candidateRevision: null,
        dossierDigest: null,
      }
    : null;
  return recomputeBindings(fixture);
}

function activationFixture() {
  const fixture = localFixture();
  fixture.evaluationPhase = "activation";
  return fixture;
}

function pendingOwnerActionRecord(actionId) {
  const requirement = OWNER_ACTION_REQUIREMENT_CATALOG[actionId];
  return {
    actionId,
    accountableHumanRole: requirement.accountableHumanRole,
    accountableHumanId: null,
    ownerAttestationReference: null,
    status: "pending",
    requiredForScopeClasses: [...requirement.requiredForScopeClasses],
    requiredForActionClasses: [...requirement.requiredForActionClasses],
    result: null,
    verifierId: null,
    verifierRole: null,
    verifiedAt: null,
    candidateRevision: null,
    dossierDigest: null,
    evidenceReference: null,
  };
}

function builderDerivedLocalFixture() {
  const base = localFixture();
  const task = {
    id: base.taskId,
    milestone: "P0",
    status: "Backlog",
    description: base.outcome,
    acceptanceEvidence: base.acceptanceEvidence,
    requirementIds: [...base.requirementIds],
    dependencies: base.dependencyRequirements.map((entry) => entry.dependencyId),
  };
  const approval = {
    candidate: clone(base.candidate),
    artifactReviews: clone(base.artifactReviews),
    designCoverage: clone(base.designCoverage),
    dependencyEvidence: clone(base.dependencyEvidence),
    privateAuthority: null,
    openDecisions: [],
    specialistVetoes: [],
    council: clone(base.council),
    approvalRecord: clone(base.approvalRecord),
  };
  const ownerActions = Object.fromEntries(["P0-OA-001", "P0-OA-002"].map((actionId) => [
    actionId,
    pendingOwnerActionRecord(actionId),
  ]));
  const fixture = buildTaskReadinessInput({
    task,
    artifacts: clone(base.artifacts),
    readinessState: {
      schemaVersion: READINESS_SCHEMA_VERSION,
      taskOverrides: {
        [task.id]: {
          requestedScopeClass: "local-synthetic",
          requestedActionClass: "readiness-control-hardening",
        },
      },
    },
    reviewerRegistry: clone(base.reviewerRegistry),
    approvalRegistry: { taskApprovals: { [task.id]: approval } },
    ownerActionState: { actions: ownerActions },
  });
  assert.deepEqual(fixture.ownerActionRequirements.map((entry) => entry.actionId), ["P0-OA-001", "P0-OA-002"]);
  assert.ok(fixture.ownerActionRequirements.every((entry) => entry.accountableHumanId === null));
  // Until the parent-owned builder adopts the new schema, retain the trusted
  // fictional base binding supplied by its approval candidate input.
  fixture.candidate.baseRevision = base.candidate.baseRevision;
  return recomputeBindings(fixture);
}

function builderDerivedHistoricalPlanningFixture(taskId, milestone) {
  const approved = retargetTaskFixture(localFixture, {
    taskId,
    milestone,
    scopeClass: "local-synthetic",
    actionClass: "planning-control",
  });
  return buildTaskReadinessInput({
    task: {
      id: taskId,
      milestone,
      status: "Done",
      description: approved.outcome,
      acceptanceEvidence: approved.acceptanceEvidence,
      requirementIds: [...approved.requirementIds],
      dependencies: approved.dependencyRequirements.map((entry) => entry.dependencyId),
    },
    artifacts: clone(approved.artifacts),
    readinessState: {
      schemaVersion: READINESS_SCHEMA_VERSION,
      taskOverrides: {
        [taskId]: {
          requestedScopeClass: "local-synthetic",
          requestedActionClass: "planning-control",
        },
      },
    },
    reviewerRegistry: clone(approved.reviewerRegistry),
    approvalRegistry: { taskApprovals: { [taskId]: taskApprovalPayloadForFixture(approved) } },
    ownerActionState: { actions: Object.fromEntries(approved.ownerActions.map((record) => [record.actionId, clone(record)])) },
  });
}

function builderDerivedCompatibilityProbe({ taskId, milestone, scopeClass, actionClass }) {
  const base = localFixture();
  const ownerActions = Object.fromEntries(Object.keys(OWNER_ACTION_REQUIREMENT_CATALOG).map((actionId) => [
    actionId,
    pendingOwnerActionRecord(actionId),
  ]));
  const source = buildTaskReadinessInput({
    task: {
      id: taskId,
      milestone,
      status: "Backlog",
      description: `Fictional ${taskId} owner-action intersection probe.`,
      acceptanceEvidence: "Synthetic evaluator evidence only.",
      requirementIds: [],
      dependencies: [],
    },
    artifacts: {},
    readinessState: {
      schemaVersion: READINESS_SCHEMA_VERSION,
      taskOverrides: {
        [taskId]: {
          requestedScopeClass: scopeClass,
          requestedActionClass: actionClass,
        },
      },
    },
    reviewerRegistry: clone(base.reviewerRegistry),
    approvalRegistry: { taskApprovals: {} },
    ownerActionState: { actions: ownerActions },
  });
  return {
    source,
    evaluation: evaluateReadiness(source, { now: FIXED_NOW }),
  };
}

function emptyCanonicalOwnerActionFixture() {
  const fixture = localFixture();
  fixture.ownerActionRequirements = [];
  fixture.ownerActions = [];
  return recomputeBindings(fixture);
}

function contextClearedAfterAttestationFixture(kind) {
  const fixture = localFixture();
  if (kind === "decision") fixture.openDecisions = ["Approval-bound fictional open decision."];
  if (kind === "blocker") fixture.council.unresolvedBlockers = ["Approval-bound fictional blocker."];
  if (kind === "veto") fixture.specialistVetoes = ["approval-bound-fictional-veto"];
  recomputeBindings(fixture);
  if (kind === "decision") fixture.openDecisions = [];
  if (kind === "blocker") fixture.council.unresolvedBlockers = [];
  if (kind === "veto") fixture.specialistVetoes = [];
  return fixture;
}

function failedCodes(result) {
  return result.gateResults.filter((gate) => !gate.passed).map((gate) => gate.code);
}

function taskApprovalPayloadForFixture(fixture) {
  return {
    candidate: fixture.candidate,
    artifactReviews: fixture.artifactReviews,
    designCoverage: fixture.designCoverage,
    dependencyEvidence: fixture.dependencyEvidence,
    privateAuthority: fixture.privateAuthority,
    openDecisions: fixture.openDecisions,
    specialistVetoes: fixture.specialistVetoes,
    council: fixture.council,
    approvalRecord: fixture.approvalRecord,
  };
}

function trustedFacts(fixture) {
  const taskApprovalSha256 = computeTaskApprovalSha256(taskApprovalPayloadForFixture(fixture));
  const taskFilesSha256 = computeTaskFilesSha256(fixture.candidate.taskFiles);
  const reviewerRegistrySha256 = computeReviewerRegistrySha256(fixture.reviewerRegistry);
  const ownerActionStateSha256 = computeTaskOwnerActionStateSha256({
    taskId: fixture.taskId,
    requirements: fixture.ownerActionRequirements,
    records: fixture.ownerActions,
  });
  const taskContractSha256 = computeTaskContractSha256({
    taskId: fixture.taskId,
    outcome: fixture.outcome,
    requirementIds: fixture.requirementIds,
    dependencyIds: fixture.dependencyRequirements.map((entry) => (
      typeof entry === "string" ? entry : entry.dependencyId
    )),
    acceptanceEvidence: fixture.acceptanceEvidence,
    acceptanceScenarioIds: fixture.acceptanceScenarioIds,
  });
  return {
    candidatePublication: {
      revision: CANDIDATE_REVISION,
      baseRevision: BASE_REVISION,
      baseAncestorOfCandidate: true,
      candidateBytesVerified: true,
      candidateOnFetchedMain: true,
      candidateDiffTaskFilesSha256: taskFilesSha256,
      candidateDiffExactMatchVerified: true,
      candidateDiffNoDeletionsVerified: true,
      candidateDiffExclusions: [...TASK_FILE_DIFF_EXCLUSIONS],
      publishedTaskFilesSha256: taskFilesSha256,
      currentTaskFilesSha256: taskFilesSha256,
      publishedTaskFilesBytesVerified: true,
      currentTaskFilesBytesVerified: true,
      publishedTaskFilesModesVerified: true,
      currentTaskFilesModesVerified: true,
      publishedTaskFileContentClassesVerified: true,
      currentTaskFileContentClassesVerified: true,
      taskFilesCoverageVerified: true,
      currentDescendantDeltaPathsVerified: true,
      currentDescendantDeltaNoDeletionsVerified: true,
      candidateTaskContractSha256: taskContractSha256,
      candidateTaskContractBytesVerified: true,
      publishedTaskFileArchivesVerified: true,
      currentTaskFileArchivesVerified: true,
    },
    approvalPublication: {
      revision: APPROVAL_REVISION,
      registryPath: APPROVAL_REGISTRY_PATH,
      registrySha256: APPROVAL_REGISTRY_SHA256,
      registryBytesVerified: true,
      taskId: fixture.taskId,
      publishedTaskApprovalSha256: taskApprovalSha256,
      currentTaskApprovalSha256: taskApprovalSha256,
      taskApprovalBytesVerified: true,
      publishedReviewerRegistrySha256: reviewerRegistrySha256,
      currentReviewerRegistrySha256: reviewerRegistrySha256,
      reviewerRegistryBytesVerified: true,
      publishedOwnerActionStateSha256: ownerActionStateSha256,
      currentOwnerActionStateSha256: ownerActionStateSha256,
      ownerActionStateBytesVerified: true,
      publishedTaskContractSha256: taskContractSha256,
      currentTaskContractSha256: taskContractSha256,
      taskContractBytesVerified: true,
      publishedOnFetchedMain: true,
      candidateAncestorOfApproval: true,
      currentRegistrySha256: sha256("later unrelated task append changes full registry bytes\n"),
    },
    activation: {
      fetchSucceeded: true,
      worktreeClean: true,
      branch: "codex/exact-main-activation",
      detached: false,
      upstream: "origin/main",
      headRevision: ACTIVATION_REVISION,
      originMainRevision: ACTIVATION_REVISION,
      approvalRecordReachableFromHead: true,
      candidateReachableFromHead: true,
      approvalPublicationRevision: APPROVAL_REVISION,
      candidateRevision: CANDIDATE_REVISION,
      externalSyncSourceRevision: ACTIVATION_REVISION,
      taskFilesVerifiedAtRevision: ACTIVATION_REVISION,
      runtimeRequestedScopeClass: fixture.requestedScope.scopeClass,
      runtimeRequestedActionClass: fixture.requestedScope.actionClass,
    },
  };
}

function recordResult(id, name, status, details = {}) {
  results.push({ id, name, status, ...details });
}

function assertPositive(id, name, factory, options = {}) {
  const fixture = factory();
  const trusted = trustedFacts(fixture);
  const actual = evaluateReadiness(fixture, { now: FIXED_NOW, ...trusted, ...options });
  assert.equal(actual.artifactReadiness, "Ready", `${id}: artifacts should be Ready`);
  assert.equal(actual.executionAllowed, true, `${id}: ${failedCodes(actual).join(", ")}`);
  assert.ok(typeof actual.nextAction === "string" && actual.nextAction.length > 0, `${id}: nextAction is missing`);
  assert.deepEqual(failedCodes(actual), [], `${id}: positive path has failed gates`);
  assert.equal(actual.normalizedEvidence.approvalPublicationRevision, APPROVAL_REVISION, `${id}: normalized approval publication revision is missing`);
  assert.equal(actual.normalizedEvidence.publishedTaskFilesSha256, fixture.candidate.taskFilesSha256,
    `${id}: candidate task-file publication digest is missing`);
  assert.equal(actual.normalizedEvidence.currentTaskFilesSha256, fixture.candidate.taskFilesSha256,
    `${id}: unchanged descendant task-file digest is missing`);
  recordResult(id, name, "pass", {
    sourceFingerprint: actual.normalizedEvidence.sourceFingerprint,
    decision: actual.executionDecision,
  });
  return actual;
}

function assertNegative(id, name, factory, mutate, expectedCodes, options = {}) {
  const fixture = factory();
  const trusted = trustedFacts(fixture);
  mutate(fixture, trusted);
  const actual = evaluateReadiness(fixture, { now: FIXED_NOW, ...trusted, ...options });
  const codes = failedCodes(actual);
  assert.equal(actual.executionAllowed, false, `${id}: negative fixture unexpectedly permitted execution`);
  assert.ok(typeof actual.nextAction === "string" && actual.nextAction.length > 0, `${id}: nextAction is missing`);
  for (const expectedCode of expectedCodes) {
    assert.ok(codes.includes(expectedCode), `${id}: missing ${expectedCode}; got ${codes.join(", ")}`);
  }
  assert.ok(actual.blockers.every((blocker) => blocker.reason.startsWith(`${fixture.taskId ?? "UNKNOWN-TASK"}:`)), `${id}: blocker lacks task ID`);
  assert.ok(actual.blockers.every((blocker) => blocker.reason.includes("; action:")), `${id}: blocker lacks corrective action`);
  recordResult(id, name, "pass", { expectedCodes, actualCodes: codes });
  return actual;
}

const singletonLocalFixture = () => retargetTaskFixture(localFixture, {
  taskId: "UX-R0-001",
  milestone: "R0",
  scopeClass: "local-synthetic",
  actionClass: "synthetic-foundation",
});
const singletonReleaseFixture = () => retargetTaskFixture(localFixture, {
  taskId: "ENG-R1-001",
  milestone: "R1",
  scopeClass: "release",
  actionClass: "authentic-text-admission",
  completeDueActions: true,
});
assertPositive("PC-001-CTL-P01", "valid singleton non-historical local-synthetic permitting path", singletonLocalFixture);
assertPositive("PC-001-CTL-P03", "valid singleton non-historical release permitting path", singletonReleaseFixture);
const pcHistoricalResult = assertNegative("PC-001-CTL-N05.pc-historical", "PC control-review evidence cannot become a task execution approval",
  localFixture, () => {}, ["HISTORICAL_TASK_NON_AUTHORIZING"]);
assert.deepEqual(failedCodes(pcHistoricalResult), ["HISTORICAL_TASK_NON_AUTHORIZING"]);
const audHistoricalResult = assertNegative("PC-001-CTL-N05.aud-historical", "AUD planning evidence cannot become a task execution approval",
  () => retargetTaskFixture(localFixture, {
    taskId: "AUD-001", milestone: "P0", scopeClass: "local-synthetic", actionClass: "planning-control",
  }), () => {}, ["HISTORICAL_TASK_NON_AUTHORIZING"]);
assert.deepEqual(failedCodes(audHistoricalResult), ["HISTORICAL_TASK_NON_AUTHORIZING"]);
const prdHistoricalApprovalResult = assertNegative("PC-001-CTL-N05.prd-later-approval", "later permitting taskApproval cannot reactivate a Done PRD",
  () => builderDerivedHistoricalPlanningFixture("PRD-R1-001", "R1"), () => {}, ["HISTORICAL_TASK_NON_AUTHORIZING"]);
assert.ok(failedCodes(prdHistoricalApprovalResult).includes("HISTORICAL_TASK_NON_AUTHORIZING"));
const compositeTaskResult = assertNegative("PC-001-CTL-N05.composite-contract", "approved SPK evidence cannot authorize a composite task contract",
  () => retargetTaskFixture(localFixture, {
    taskId: "SPK-R0-001", milestone: "R0", scopeClass: "local-synthetic", actionClass: "synthetic-foundation",
  }), () => {}, ["TASK_EXECUTION_CONTRACT_CARDINALITY"]);
assert.deepEqual(failedCodes(compositeTaskResult), ["TASK_EXECUTION_CONTRACT_CARDINALITY"]);
assertNegative("PC-001-CTL-N05.pc-future-private", "future PC private-read intent is outside its current singleton approval contract",
  privateFixture, () => {}, ["TASK_SCOPE_ACTION_COMPATIBILITY", "HISTORICAL_TASK_NON_AUTHORIZING"]);
assertNegative("PC-001-CTL-N05.pc-future-workflow", "future PC Project-workflow intent is outside its current singleton approval contract",
  projectWorkflowFixture, () => {}, ["TASK_SCOPE_ACTION_COMPATIBILITY", "HISTORICAL_TASK_NON_AUTHORIZING"]);
assertNegative("PC-001-CTL-N05.pc-future-release", "future PC publication intent is outside its current singleton approval contract",
  releaseFixture, () => {}, ["TASK_SCOPE_ACTION_COMPATIBILITY", "HISTORICAL_TASK_NON_AUTHORIZING"]);
assertNegative("PC-001-CTL-N05.pc-builder-historical", "builder-derived PC taskApproval remains historical and non-authorizing",
  builderDerivedLocalFixture, () => {}, ["HISTORICAL_TASK_NON_AUTHORIZING"]);
assertNegative("PC-001-CTL-N05.empty-actions", "PC task cannot omit its canonical non-due owner-action requirements",
  emptyCanonicalOwnerActionFixture, () => {}, ["OWNER_ACTION_REQUIREMENTS"]);
assertPositive("PC-001-CTL-N01.na-valid", "valid singleton Design not-applicable rationale and concurrence route",
  () => retargetTaskFixture(designNotApplicableFixture, {
    taskId: "UX-R0-001", milestone: "R0", scopeClass: "local-synthetic", actionClass: "synthetic-foundation",
  }));
assertPositive("PC-001-CTL-N04.activation-valid", "valid singleton exact-main activation adapter path",
  () => retargetTaskFixture(activationFixture, {
    taskId: "UX-R0-001", milestone: "R0", scopeClass: "local-synthetic", actionClass: "synthetic-foundation",
  }), { phase: "activation" });

const globalPrivateReleaseActionClasses = [
  ...new Set([
    ...SCOPE_ACTION_COMPATIBILITY["private-execution"],
    ...SCOPE_ACTION_COMPATIBILITY.release,
  ]),
];
assert.deepEqual(
  OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-001"].requiredForActionClasses,
  globalPrivateReleaseActionClasses,
);
assert.equal(TASK_APPROVAL_EXECUTION_ACTION_CARDINALITY, 1);
assert.deepEqual(OWNER_ACTION_REQUIREMENT_CATALOG["R0-OA-001"].requiredForScopeClasses, ["private-execution"]);
assert.deepEqual(OWNER_ACTION_REQUIREMENT_CATALOG["R0-OA-001"].requiredForActionClasses,
  ["private-system-read", "private-system-mutation", "deployment"]);
assert.deepEqual(OWNER_ACTION_REQUIREMENT_CATALOG["R0-OA-002"].requiredForActionClasses,
  ["provider-change", "spend-change"]);
assert.ok(!OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-001"].requiredForScopeClasses
  .includes(DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass));
assert.deepEqual(OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-002"].requiredForActionClasses,
  ["project-workflow-mutation", "project-non-delivery-item"]);

const manifestForActionContract = parseJsonWithoutDuplicateKeys(
  fs.readFileSync(path.join(repoRoot, "docs/project/PHASE1-ROADMAP-MANIFEST.json"), "utf8"),
  "Phase 1 roadmap manifest action-contract fixture",
);
const manifestTaskIds = manifestForActionContract.tasks.map((task) => task.id).sort();
assert.equal(manifestTaskIds.length, 58);
assert.deepEqual(Object.keys(TASK_EXECUTION_CONTRACT).sort(), manifestTaskIds,
  "the closed task action contract must enumerate exactly the 58 manifest tasks");
const historicalPlanningTaskIdSet = new Set(HISTORICAL_DONE_PLANNING_TASK_IDS);
const historicalNonAuthorizingTaskIdSet = new Set(HISTORICAL_NON_AUTHORIZING_TASK_IDS);
assert.deepEqual([...historicalPlanningTaskIdSet].sort(), manifestForActionContract.tasks
  .filter((task) => task.status === "Done" && (task.id === "AUD-001" || task.id.startsWith("PRD-") || task.id.startsWith("PID-")))
  .map((task) => task.id).sort());
assert.deepEqual([...historicalNonAuthorizingTaskIdSet].sort(), [...historicalPlanningTaskIdSet, "PC-001"].sort());

const pairKey = ({ scopeClass, actionClass }) => `${scopeClass}/${actionClass}`;
const globalScopeActionPairs = Object.entries(SCOPE_ACTION_COMPATIBILITY).flatMap(([scopeClass, actionClasses]) => (
  actionClasses.map((actionClass) => ({ scopeClass, actionClass }))
));
const defaultAssemblyBase = localFixture();
const defaultAssemblyOwnerActions = Object.fromEntries(Object.keys(OWNER_ACTION_REQUIREMENT_CATALOG).map((actionId) => [
  actionId,
  pendingOwnerActionRecord(actionId),
]));
for (const task of manifestForActionContract.tasks) {
  const contract = TASK_EXECUTION_CONTRACT[task.id];
  const contractPairCount = taskExecutionContractPairCount(task.id);
  assert.equal(contract.milestone, task.milestone, `${task.id}: explicit milestone mismatch`);
  assert.equal(canonicalMilestoneForTaskId(task.id), task.milestone, `${task.id}: canonical milestone mismatch`);
  const allowedPairs = new Set(Object.entries(contract.scopeActions).flatMap(([scopeClass, actionClasses]) => (
    actionClasses.map((actionClass) => `${scopeClass}/${actionClass}`)
  )));
  for (const pair of globalScopeActionPairs) {
    const expected = allowedPairs.has(pairKey(pair));
    assert.equal(isTaskMilestoneScopeActionCompatible({
      taskId: task.id,
      milestone: task.milestone,
      ...pair,
    }), expected, `${task.id}: ${pairKey(pair)} closed-contract mismatch`);
    const evaluatorProbe = evaluateReadiness({
      schemaVersion: READINESS_SCHEMA_VERSION,
      taskId: task.id,
      milestone: task.milestone,
      evaluationPhase: "candidate",
      requestedScope: pair,
    }, { now: FIXED_NOW });
    assert.equal(evaluatorProbe.gateResults.find((gate) => gate.code === "TASK_SCOPE_ACTION_COMPATIBILITY")?.passed,
      expected, `${task.id}: ${pairKey(pair)} pure-evaluator mismatch`);
    if (expected) {
      assert.ok(MILESTONE_SCOPE_ACTION_COMPATIBILITY[task.milestone]?.[pair.scopeClass]?.includes(pair.actionClass),
        `${task.id}: allowed pair exceeds milestone upper bound`);
    }
  }
  const defaultPair = requestedScopeFor(task);
  const defaultSource = buildTaskReadinessInput({
    task,
    artifacts: {},
    readinessState: { schemaVersion: READINESS_SCHEMA_VERSION, taskOverrides: {} },
    reviewerRegistry: clone(defaultAssemblyBase.reviewerRegistry),
    approvalRegistry: { taskApprovals: {} },
    ownerActionState: { actions: clone(defaultAssemblyOwnerActions) },
  });
  assert.deepEqual(defaultSource.requestedScope, defaultPair, `${task.id}: default source assembly drifted`);
  assert.equal(isTaskMilestoneScopeActionCompatible({
    taskId: task.id,
    milestone: task.milestone,
    ...defaultPair,
  }), true, `${task.id}: builder default is outside the closed task contract`);
  const defaultEvaluation = evaluateReadiness({
    schemaVersion: READINESS_SCHEMA_VERSION,
    taskId: task.id,
    milestone: task.milestone,
    evaluationPhase: "candidate",
    requestedScope: defaultPair,
  }, { now: FIXED_NOW });
  const defaultGateByCode = new Map(defaultEvaluation.gateResults.map((gate) => [gate.code, gate]));
  assert.equal(defaultGateByCode.get("TASK_EXECUTION_CONTRACT_CARDINALITY")?.passed,
    contractPairCount === TASK_APPROVAL_EXECUTION_ACTION_CARDINALITY,
    `${task.id}: execution-contract cardinality gate mismatch`);
  assert.equal(defaultGateByCode.get("HISTORICAL_TASK_NON_AUTHORIZING")?.passed,
    !historicalNonAuthorizingTaskIdSet.has(task.id),
    `${task.id}: historical non-authorization gate mismatch`);
}
const deliveryTransitionTask = manifestForActionContract.tasks.find((task) => task.id === "SPK-R0-001");
const deliveryTransitionStageId = "P0-STAGE-SPK-R0-001-STATUS-DELIVERY-TRANSITION";
const deliveryTransitionOverride = {
  requestedStageId: deliveryTransitionStageId,
  requestedScopeClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass,
  requestedActionClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass,
};
const deliveryTransitionSource = buildTaskReadinessInput({
  task: deliveryTransitionTask,
  artifacts: {},
  readinessState: {
    schemaVersion: READINESS_SCHEMA_VERSION,
    taskOverrides: { [deliveryTransitionTask.id]: deliveryTransitionOverride },
  },
  reviewerRegistry: clone(defaultAssemblyBase.reviewerRegistry),
  approvalRegistry: { taskApprovals: {} },
  ownerActionState: { actions: clone(defaultAssemblyOwnerActions) },
  evaluationPhase: "activation",
});
assert.deepEqual(deliveryTransitionSource.requestedScope, {
  scopeClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass,
  actionClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass,
});
assert.deepEqual(deliveryTransitionSource.ownerActionRequirements, []);
assert.deepEqual(deliveryTransitionSource.ownerActions, []);
assert.equal(deliveryTransitionSource.privateAuthority, null);
recordResult("PC-001-CTL-P05", "ephemeral task-bound transition stage reaches source assembly with the exact delivery-control pair and no owner-action leakage", "pass");
assert.throws(() => requestedScopeFor(deliveryTransitionTask, {
  requestedScopeClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass,
  requestedActionClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass,
}), /not permitted for milestone/);
recordResult("PC-001-CTL-P05", "delivery-control authority without a transition stage remains outside ordinary task execution", "pass");
assert.throws(() => requestedScopeFor(deliveryTransitionTask, {
  ...deliveryTransitionOverride,
  requestedStageId: "P0-STAGE-UX-R0-001-STATUS-DELIVERY-TRANSITION",
}), /does not bind the exact dedicated delivery-transition/);
recordResult("PC-001-CTL-P05", "a transition stage bound to a different task cannot reach source assembly", "pass");
assert.throws(() => requestedScopeFor(deliveryTransitionTask, {
  requestedStageId: deliveryTransitionStageId,
  requestedScopeClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass,
}), /does not bind the exact dedicated delivery-transition/);
recordResult("PC-001-CTL-P05", "the ephemeral transition key cannot default a missing scope or action", "pass");
assert.throws(() => validateReadinessState({
  schemaVersion: READINESS_SCHEMA_VERSION,
  taskOverrides: { [deliveryTransitionTask.id]: deliveryTransitionOverride },
}, new Set(manifestTaskIds)), /unknown source-evidence override keys: requestedStageId/);
recordResult("PC-001-CTL-P05", "persisted readiness state still rejects the ephemeral transition-stage key", "pass");
assert.throws(() => validateReadinessState({
  schemaVersion: READINESS_SCHEMA_VERSION,
  taskOverrides: {
    [deliveryTransitionTask.id]: {
      requestedScopeClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass,
      requestedActionClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass,
    },
  },
}, new Set(manifestTaskIds)), /cannot be persisted/);
recordResult("PC-001-CTL-P05", "persisted readiness state rejects the delivery-control pair even without the ephemeral stage key", "pass");
assert.deepEqual(requestedScopeFor(manifestForActionContract.tasks.find((task) => task.id === "PRD-R0-001")), {
  scopeClass: "local-synthetic",
  actionClass: "planning-control",
});
assert.deepEqual(requestedScopeFor(manifestForActionContract.tasks.find((task) => task.id === "REL-R0-001")), {
  scopeClass: "release",
  actionClass: "synthetic-foundation",
});
assert.deepEqual(requestedScopeFor(manifestForActionContract.tasks.find((task) => task.id === "PC-001")), {
  scopeClass: "local-synthetic",
  actionClass: "readiness-control-hardening",
});
for (const taskId of HISTORICAL_DONE_PLANNING_TASK_IDS) {
  assert.deepEqual(requestedScopeFor(manifestForActionContract.tasks.find((task) => task.id === taskId)), {
    scopeClass: "local-synthetic",
    actionClass: "planning-control",
  }, `${taskId}: historical planning default changed`);
}

const expectedCompositeTaskIds = [
  "SPK-R0-001", "ARCH-R0-001", "ENG-R0-001", "REL-R0-001",
  "SPK-R5-001", "EVAL-R6-001", "EVAL-R7-001",
].sort();
assert.deepEqual(manifestTaskIds.filter((taskId) => taskExecutionContractPairCount(taskId) > 1), expectedCompositeTaskIds);
for (const taskId of expectedCompositeTaskIds) {
  assert.ok(taskExecutionContractPairCount(taskId) > TASK_APPROVAL_EXECUTION_ACTION_CARDINALITY);
}
for (const task of manifestForActionContract.tasks) {
  const pairKeys = Object.entries(TASK_EXECUTION_CONTRACT[task.id].scopeActions).flatMap(([scopeClass, actionClasses]) => (
    actionClasses.map((actionClass) => `${scopeClass}/${actionClass}`)
  ));
  if (task.id === "AUD-001" || task.id.startsWith("PRD-") || task.id.startsWith("PID-")) {
    assert.deepEqual(pairKeys, ["local-synthetic/planning-control"], `${task.id}: planning task gained an execution role`);
  }
  if ((task.id.startsWith("UX-") || task.id.startsWith("ARCH-")) && !["UX-R0-001", "ARCH-R0-001"].includes(task.id)) {
    assert.deepEqual(pairKeys, ["local-synthetic/planning-control"], `${task.id}: artifact task borrowed a release role`);
  }
  if ((task.id.startsWith("ENG-") || task.id.startsWith("REL-") || task.id.startsWith("QA-"))
    && !["ENG-R0-001", "REL-R0-001"].includes(task.id)) {
    assert.deepEqual(Object.keys(TASK_EXECUTION_CONTRACT[task.id].scopeActions), ["release"],
      `${task.id}: release-bearing task lost its exact role`);
  }
}

for (const [scopeClass, actionClasses] of Object.entries(TASK_FUTURE_SCOPE_ACTION_OPTIONS["PC-001"])) {
  for (const actionClass of actionClasses) {
    assert.equal(isTaskMilestoneScopeActionCompatible({
      taskId: "PC-001",
      milestone: "P0",
      scopeClass,
      actionClass,
    }), false, `PC-001 future option ${scopeClass}/${actionClass} entered the current approval contract`);
  }
}

for (const taskId of ["ENG-R0-999", "UNKNOWN-001", "PC-999", ""]) {
  assert.equal(canonicalMilestoneForTaskId(taskId), null, `${taskId}: unknown task gained a milestone`);
  for (const pair of globalScopeActionPairs) {
    assert.equal(isTaskMilestoneScopeActionCompatible({ taskId, milestone: "R0", ...pair }), false,
      `${taskId}: unknown task gained ${pairKey(pair)}`);
    const evaluatorProbe = evaluateReadiness({
      schemaVersion: READINESS_SCHEMA_VERSION,
      taskId,
      milestone: "R0",
      evaluationPhase: "candidate",
      requestedScope: pair,
    }, { now: FIXED_NOW });
    assert.equal(evaluatorProbe.gateResults.find((gate) => gate.code === "TASK_SCOPE_ACTION_COMPATIBILITY")?.passed,
      false, `${taskId}: pure evaluator authorized an unknown task`);
  }
}
assert.equal(isTaskMilestoneScopeActionCompatible({
  taskId: "ENG-R0-001",
  milestone: "R0",
  scopeClass: "private-execution",
  actionClass: "unknown-action",
}), false);
recordResult("PC-001-CTL-R01", "all 58 tasks deny every non-allowlisted global scope/action pair", "pass", {
  taskCount: manifestTaskIds.length,
  globalPairCount: globalScopeActionPairs.length,
  checkedPairs: manifestTaskIds.length * globalScopeActionPairs.length,
});

const canonicalCompatibilityProbes = [
  {
    taskId: "PC-001",
    milestone: "P0",
    scopeClass: "local-synthetic",
    actionClass: "readiness-control-hardening",
    expected: [],
  },
  {
    taskId: "SPK-R0-001",
    milestone: "R0",
    scopeClass: "local-synthetic",
    actionClass: "synthetic-foundation",
    expected: [],
  },
  {
    taskId: "SPK-R0-001",
    milestone: "R0",
    scopeClass: "private-execution",
    actionClass: "private-system-read",
    expected: ["P0-OA-001", "R0-OA-001"],
  },
  {
    taskId: "PRD-R0-001",
    milestone: "R0",
    scopeClass: "local-synthetic",
    actionClass: "planning-control",
    expected: [],
  },
  {
    taskId: "UX-R0-001",
    milestone: "R0",
    scopeClass: "local-synthetic",
    actionClass: "synthetic-foundation",
    expected: [],
  },
  {
    taskId: "ARCH-R0-001",
    milestone: "R0",
    scopeClass: "local-synthetic",
    actionClass: "synthetic-foundation",
    expected: [],
  },
  {
    taskId: "ARCH-R0-001",
    milestone: "R0",
    scopeClass: "private-execution",
    actionClass: "private-system-read",
    expected: ["P0-OA-001", "R0-OA-001"],
  },
  {
    taskId: "ENG-R0-001",
    milestone: "R0",
    scopeClass: "local-synthetic",
    actionClass: "synthetic-foundation",
    expected: [],
  },
  {
    taskId: "ENG-R0-001",
    milestone: "R0",
    scopeClass: "private-execution",
    actionClass: "deployment",
    expected: ["P0-OA-001", "R0-OA-001"],
  },
  {
    taskId: "REL-R0-001",
    milestone: "R0",
    scopeClass: "private-execution",
    actionClass: "private-system-read",
    expected: ["P0-OA-001", "R0-OA-001"],
  },
  {
    taskId: "REL-R0-001",
    milestone: "R0",
    scopeClass: "private-execution",
    actionClass: "private-system-mutation",
    expected: ["P0-OA-001", "R0-OA-001"],
  },
  {
    taskId: "REL-R0-001",
    milestone: "R0",
    scopeClass: "release",
    actionClass: "synthetic-foundation",
    expected: ["P0-OA-001"],
  },
  {
    taskId: "REL-R9-001",
    milestone: "R9",
    scopeClass: "release",
    actionClass: "final-launch-decision",
    expected: ["P0-OA-001", "R9-OA-001", "R9-OA-002", "R9-OA-003", "R9-OA-004"],
  },
  {
    taskId: "REL-R10-001",
    milestone: "R10",
    scopeClass: "release",
    actionClass: "transition-trigger",
    expected: ["P0-OA-001", "R10-OA-001", "R10-OA-002"],
  },
];
for (const probe of canonicalCompatibilityProbes) {
  const { source, evaluation } = builderDerivedCompatibilityProbe(probe);
  const actual = evaluation.normalizedEvidence.dueOwnerActionIds;
  const gateByCode = new Map(evaluation.gateResults.map((gate) => [gate.code, gate]));
  assert.equal(source.milestone, probe.milestone);
  assert.equal(canonicalMilestoneForTaskId(probe.taskId), probe.milestone);
  assert.equal(isTaskMilestoneScopeActionCompatible(probe), true);
  assert.equal(gateByCode.get("TASK_MILESTONE_COMPATIBILITY")?.passed, true);
  assert.equal(gateByCode.get("SCOPE_ACTION_COMPATIBILITY")?.passed, true);
  assert.equal(gateByCode.get("TASK_SCOPE_ACTION_COMPATIBILITY")?.passed, true);
  assert.equal(gateByCode.get("TASK_EXECUTION_CONTRACT_CARDINALITY")?.passed,
    taskExecutionContractPairCount(probe.taskId) === TASK_APPROVAL_EXECUTION_ACTION_CARDINALITY);
  assert.equal(gateByCode.get("HISTORICAL_TASK_NON_AUTHORIZING")?.passed,
    !historicalNonAuthorizingTaskIdSet.has(probe.taskId));
  assert.equal(gateByCode.get("OWNER_ACTION_REQUIREMENTS")?.passed, true);
  assert.deepEqual(actual, probe.expected, `${probe.taskId}/${probe.scopeClass}/${probe.actionClass}`);
  recordResult("PC-001-CTL-R01", `canonical due-action intersection: ${probe.taskId}/${probe.actionClass}`, "pass", {
    dueOwnerActionIds: actual,
  });
}

for (const probe of [
  { taskId: "PRD-R0-001", milestone: "R0", scopeClass: "local-synthetic", actionClass: "synthetic-foundation" },
  { taskId: "UX-R0-001", milestone: "R0", scopeClass: "private-execution", actionClass: "private-system-read" },
  { taskId: "SPK-R0-001", milestone: "R0", scopeClass: "private-execution", actionClass: "deployment" },
  { taskId: "ARCH-R0-001", milestone: "R0", scopeClass: "private-execution", actionClass: "deployment" },
  { taskId: "ENG-R0-001", milestone: "R0", scopeClass: "private-execution", actionClass: "private-system-read" },
  { taskId: "REL-R0-001", milestone: "R0", scopeClass: "local-synthetic", actionClass: "synthetic-foundation" },
  { taskId: "REL-R0-001", milestone: "R0", scopeClass: "private-execution", actionClass: "provider-change" },
  { taskId: "REL-R0-001", milestone: "R0", scopeClass: "private-execution", actionClass: "spend-change" },
]) {
  assert.equal(isTaskMilestoneScopeActionCompatible(probe), false,
    `${probe.taskId}: sibling R0 action borrowing was permitted`);
  assert.throws(() => builderDerivedCompatibilityProbe(probe), /not permitted for milestone/);
  recordResult("PC-001-CTL-N05.r0-task-isolation", `${probe.taskId} denies ${pairKey(probe)}`, "pass", {
    expectedCodes: ["SOURCE_BUILDER_TASK_ACTION_REJECTED"],
  });
}

for (const probe of [
  {
    name: "R3 task cannot launder the R9 final-launch action",
    taskId: "REL-R3-001",
    milestone: "R3",
    scopeClass: "release",
    actionClass: "final-launch-decision",
  },
  {
    name: "non-PC task cannot launder the PC Project-workflow mutation action",
    taskId: "ENG-R0-001",
    milestone: "R0",
    scopeClass: "private-execution",
    actionClass: "project-workflow-mutation",
  },
  {
    name: "R0 task cannot launder the R2 authentic-photo admission action",
    taskId: "ENG-R0-001",
    milestone: "R0",
    scopeClass: "release",
    actionClass: "authentic-photo-admission",
  },
  {
    name: "task ID cannot claim a different milestone contract",
    taskId: "REL-R3-001",
    milestone: "R9",
    scopeClass: "release",
    actionClass: "final-launch-decision",
  },
]) {
  assert.equal(isTaskMilestoneScopeActionCompatible(probe), false, probe.name);
  assert.throws(() => builderDerivedCompatibilityProbe(probe),
    /(?:not permitted for milestone|task ID does not belong to milestone)/,
    probe.name);
  recordResult("PC-001-CTL-N05.builder-action-contract", probe.name, "pass", {
    expectedCodes: ["SOURCE_BUILDER_TASK_MILESTONE_ACTION_REJECTED"],
  });
}

const n01 = [
  ["missing product artifact", (fixture) => { delete fixture.artifacts.product; }, ["ARTIFACT_PRODUCT_PRESENT", "ARTIFACT_PRODUCT_STATE"]],
  ["blocked Product content cannot be approved", (fixture) => { fixture.artifacts.product.contentState = "blocked"; }, ["ARTIFACT_PRODUCT_CONTENT_STATE", "ARTIFACT_PRODUCT_STATE"]],
  ["Product review Hold", (fixture) => { fixture.artifactReviews.product.decision = "hold"; }, ["ARTIFACT_PRODUCT_STATE", "ARTIFACT_PRODUCT_REVIEW_DECISION"]],
  ["Product artifact byte hash mismatch", (fixture) => { fixture.artifacts.product.observedSha256 = "0".repeat(64); }, ["ARTIFACT_PRODUCT_HASH"]],
  ["Product review revision mismatch", (fixture) => { fixture.artifactReviews.product.reviewedRevision = "d".repeat(40); }, ["REVIEW_PRODUCT_BINDING"]],
  ["Product review dossier mismatch", (fixture) => { fixture.artifactReviews.product.dossierDigest = `sha256:${"0".repeat(64)}`; }, ["REVIEW_PRODUCT_BINDING"]],
  ["candidate artifact binding mismatch", (fixture) => { fixture.candidate.artifacts.product.sha256 = "0".repeat(64); }, ["CANDIDATE_ARTIFACT_BINDINGS"]],
  ["candidate dossier mismatch", (fixture) => { fixture.candidate.dossierDigest = `sha256:${"0".repeat(64)}`; }, ["CANDIDATE_DOSSIER_DIGEST"]],
  ["candidate bytes unverified", (_fixture, trusted) => { trusted.candidatePublication.candidateBytesVerified = false; }, ["CANDIDATE_BYTES_VERIFIED"]],
  ["candidate unpublished", (_fixture, trusted) => { trusted.candidatePublication.candidateOnFetchedMain = false; }, ["CANDIDATE_PUBLISHED"]],
  ["candidate task-file digest tampered", (fixture) => { fixture.candidate.taskFilesSha256 = "0".repeat(64); }, ["CANDIDATE_TASK_FILES_DIGEST"]],
  ["candidate task-file manifest missing", (fixture) => { delete fixture.candidate.taskFiles; }, ["CANDIDATE_TASK_FILES_SCHEMA"]],
  ["candidate base revision missing", (fixture) => { fixture.candidate.baseRevision = null; }, ["CANDIDATE_BASE_REVISION"]],
  ["candidate task-file symlink mode", (fixture) => {
    fixture.candidate.taskFiles.find((entry) => entry.purpose === "implementation").gitMode = "120000";
  }, ["CANDIDATE_TASK_FILES_SCHEMA"]],
  ["candidate task-file non-blob type", (fixture) => {
    fixture.candidate.taskFiles.find((entry) => entry.purpose === "implementation").gitType = "commit";
  }, ["CANDIDATE_TASK_FILES_SCHEMA"]],
  ["candidate task-file uses closed publication exclusion", (fixture) => {
    fixture.candidate.taskFiles.find((entry) => entry.purpose === "implementation").path = APPROVAL_REGISTRY_PATH;
  }, ["CANDIDATE_TASK_FILES_SCHEMA"]],
  ["candidate implementation purpose missing", (fixture) => {
    fixture.candidate.taskFiles.filter((entry) => entry.purpose === "implementation")
      .forEach((entry) => { entry.purpose = "evidence"; });
  }, ["CANDIDATE_TASK_FILES_WORK_COVERAGE"]],
  ["candidate non-P0 evidence path", (fixture) => {
    fixture.candidate.taskFiles.find((entry) => entry.purpose === "evidence").path = "tools/runtime-evidence.json";
  }, ["CANDIDATE_TASK_FILES_SCHEMA"]],
  ["candidate cross-task P0 artifact path", (fixture) => {
    fixture.candidate.taskFiles.find((entry) => entry.purpose === "artifact:product").path = "tools/P0-PC-999-product.md";
  }, ["CANDIDATE_TASK_FILES_SCHEMA"]],
  ["invalid Architecture not-applicable route", (fixture) => {
    fixture.artifactReviews.architecture.decision = "not-applicable";
    fixture.artifactReviews.architecture.notApplicableRationale = "short";
    fixture.artifactReviews.architecture.specialistConcurrence = false;
  }, ["ARTIFACT_ARCHITECTURE_NA_ROUTE"]],
  ["supplied readiness override", (fixture) => { fixture.executionAllowed = true; }, ["DERIVED_OVERRIDE"]],
  ["supplied legacy aggregate", (fixture) => { fixture.dependenciesEntryEvidenceSatisfied = true; }, ["DERIVED_OVERRIDE"]],
];
n01.forEach(([name, mutate, codes], index) => assertNegative(`PC-001-CTL-N01.${String(index + 1).padStart(2, "0")}`, name, localFixture, mutate, codes));

const canonicalMarkerLines = Object.freeze([
  "- **Task ID:** `PC-001`",
  "- **Artifact kind:** `product`",
  "- **Artifact state:** `in-review`",
]);
const canonicalMarkerExpectations = Object.freeze({
  taskId: "PC-001",
  artifactKind: "product",
  artifactState: "in-review",
});
const markerDocument = (lines, newline = "\n") => ["# Fictional artifact", "", ...lines, ""].join(newline);
const parsedMarkers = parseArtifactControlMarkers(
  markerDocument(canonicalMarkerLines),
  canonicalMarkerExpectations,
);
assert.deepEqual(parsedMarkers, {
  valid: true,
  taskId: "PC-001",
  artifactKind: "product",
  artifactState: "in-review",
  errors: [],
});
assert.deepEqual(
  parseArtifactControlMarkers(markerDocument(canonicalMarkerLines, "\r\n"), canonicalMarkerExpectations),
  parsedMarkers,
);
recordResult("PC-001-CTL-P01.markers", "strict canonical artifact markers parse once with LF or CRLF", "pass");

function assertMarkerNegative(suffix, name, lines, expectedCodes, expectations = canonicalMarkerExpectations) {
  const actual = parseArtifactControlMarkers(markerDocument(lines), expectations);
  const actualCodes = actual.errors.map(({ code }) => code);
  assert.equal(actual.valid, false, `${suffix}: malformed markers unexpectedly parsed`);
  for (const expectedCode of expectedCodes) {
    assert.ok(actualCodes.includes(expectedCode), `${suffix}: missing ${expectedCode}; got ${actualCodes.join(", ")}`);
  }
  recordResult("PC-001-CTL-N01", `artifact marker parser: ${name}`, "pass", { expectedCodes, actualCodes });
}

for (const [suffix, name, lines, codes] of [
  ["duplicate-task", "duplicate Task ID", [canonicalMarkerLines[0], ...canonicalMarkerLines], ["MARKER_DUPLICATE"]],
  ["conflict-task", "conflicting Task IDs", [canonicalMarkerLines[0], "- **Task ID:** `PC-002`", ...canonicalMarkerLines.slice(1)], ["MARKER_DUPLICATE", "MARKER_CONFLICT"]],
  ["duplicate-kind", "duplicate artifact kind", [canonicalMarkerLines[0], canonicalMarkerLines[1], ...canonicalMarkerLines.slice(1)], ["MARKER_DUPLICATE"]],
  ["conflict-kind", "conflicting artifact kinds", [canonicalMarkerLines[0], canonicalMarkerLines[1], "- **Artifact kind:** `qa`", canonicalMarkerLines[2]], ["MARKER_DUPLICATE", "MARKER_CONFLICT"]],
  ["duplicate-state", "duplicate artifact state", [...canonicalMarkerLines, canonicalMarkerLines[2]], ["MARKER_DUPLICATE"]],
  ["conflict-state", "conflicting artifact states", [...canonicalMarkerLines, "- **Artifact state:** `approved`"], ["MARKER_DUPLICATE", "MARKER_CONFLICT"]],
  ["missing-task", "missing Task ID", canonicalMarkerLines.slice(1), ["MARKER_MISSING"]],
  ["missing-kind", "missing artifact kind", [canonicalMarkerLines[0], canonicalMarkerLines[2]], ["MARKER_MISSING"]],
  ["missing-state", "missing artifact state", canonicalMarkerLines.slice(0, 2), ["MARKER_MISSING"]],
  ["noncanonical-task", "Task ID without code delimiters", ["- **Task ID:** PC-001", ...canonicalMarkerLines.slice(1)], ["MARKER_NONCANONICAL", "MARKER_MISSING"]],
  ["noncanonical-kind", "artifact-kind label with changed capitalization", [canonicalMarkerLines[0], "- **Artifact Kind:** `product`", canonicalMarkerLines[2]], ["MARKER_NONCANONICAL", "MARKER_MISSING"]],
  ["noncanonical-state", "artifact-state marker with trailing whitespace", [...canonicalMarkerLines.slice(0, 2), `${canonicalMarkerLines[2]} `], ["MARKER_NONCANONICAL", "MARKER_MISSING"]],
]) {
  assertMarkerNegative(suffix, name, lines, codes);
}
assertMarkerNegative("mismatch-task", "Task ID differs from the bound record", canonicalMarkerLines, ["MARKER_MISMATCH"], {
  ...canonicalMarkerExpectations,
  taskId: "PC-999",
});
assertMarkerNegative("mismatch-kind", "artifact kind differs from the bound record", canonicalMarkerLines, ["MARKER_MISMATCH"], {
  ...canonicalMarkerExpectations,
  artifactKind: "qa",
});
assertMarkerNegative("mismatch-state", "artifact state differs from the bound record", canonicalMarkerLines, ["MARKER_MISMATCH"], {
  ...canonicalMarkerExpectations,
  artifactState: "approved",
});

for (const extension of [".pdf", ".png", ".jpg", ".mp3", ".wav", ".mp4", ".mov", ".bin"]) {
  assertNegative(
    "PC-001-CTL-N01.local-file-type",
    `local-synthetic task manifest rejects ${extension} media/binary path`,
    localFixture,
    (fixture) => {
      fixture.candidate.taskFiles.find((entry) => entry.purpose === "evidence" && entry.path.endsWith(".md")).path =
        `docs/council/execution/releases/P0-PC-001-UNSAFE${extension}`;
    },
    ["CANDIDATE_TASK_FILES_LOCAL_TYPES"],
  );
}
for (const disguisedSuffix of [".png.md", ".jpg.yml", ".mp4.json", ".pdf.txt", ".zip.json", ".xlsx.md"]) {
  assertNegative(
    "PC-001-CTL-N01.local-content-smuggling",
    `local-synthetic manifest rejects disguised ${disguisedSuffix} media/binary suffix`,
    localFixture,
    (fixture) => {
      fixture.candidate.taskFiles.find((entry) => entry.purpose === "evidence" && entry.path.endsWith(".md")).path =
        `docs/council/execution/releases/P0-PC-001-DISGUISED${disguisedSuffix}`;
    },
    ["CANDIDATE_TASK_FILES_LOCAL_TYPES"],
  );
}
assertNegative(
  "PC-001-CTL-N01.local-workbook-purpose",
  "local-synthetic workbook cannot be classified as implementation",
  localFixture,
  (fixture) => {
    fixture.candidate.taskFiles.find((entry) => entry.purpose === "implementation").path =
      "tools/P0-PC-001-IMPLEMENTATION.xlsx";
  },
  ["CANDIDATE_TASK_FILES_LOCAL_TYPES"],
);
for (const legacyKey of [
  "executionScope",
  "dependenciesEntryEvidenceSatisfied",
  "privateAuthorityState",
  "privateAuthorityEvidenceReference",
  "ownerActionsSatisfied",
  "effectiveArtifactStates",
]) {
  assertNegative(
    "PC-001-CTL-N01.legacy",
    `supplied legacy aggregate: ${legacyKey}`,
    localFixture,
    (fixture) => { fixture[legacyKey] = legacyKey === "ownerActionsSatisfied" ? true : "legacy-aggregate"; },
    ["DERIVED_OVERRIDE"],
  );
}
for (const publicationProofKey of [
  "publishedTaskFileContentClassesVerified",
  "currentTaskFileContentClassesVerified",
]) {
  assertNegative(
    "PC-001-CTL-N01.content-proof-override",
    `source cannot supply trusted content-class proof: ${publicationProofKey}`,
    localFixture,
    (fixture) => { fixture[publicationProofKey] = true; },
    ["DERIVED_OVERRIDE"],
  );
}

assertNegative("PC-001-CTL-N02.01", "missing Design journey coverage", localFixture,
  (fixture) => { fixture.designCoverage.journeyIds = []; }, ["DESIGN_JOURNEYS"]);
DESIGN_STATE_DIMENSIONS.forEach((dimension, index) => assertNegative(
  `PC-001-CTL-N02.${String(index + 2).padStart(2, "0")}`,
  `missing Design ${dimension} state coverage`,
  localFixture,
  (fixture) => { fixture.designCoverage.stateCoverage[dimension] = []; },
  [`DESIGN_STATE_${dimension.toUpperCase()}`],
));
DESIGN_ACCESSIBILITY_DIMENSIONS.forEach((dimension, index) => {
  const suffix = dimension.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase();
  assertNegative(
    `PC-001-CTL-N02.${String(index + 8).padStart(2, "0")}`,
    `missing Design ${dimension} accessibility coverage`,
    localFixture,
    (fixture) => { fixture.designCoverage.accessibilityCoverage[dimension] = []; },
    [`DESIGN_A11Y_${suffix}`],
  );
});

const n03 = [
  ["missing Product seat reviewer ID", (fixture) => { fixture.council.seatVerdicts.product.reviewerId = null; }, ["SEAT_PRODUCT_IDENTITY"]],
  ["unknown Product seat reviewer ID", (fixture) => { fixture.council.seatVerdicts.product.reviewerId = "reviewer-unknown"; }, ["SEAT_PRODUCT_IDENTITY"]],
  ["wrong Product seat role", (fixture) => { fixture.council.seatVerdicts.product.reviewerRole = "design"; }, ["SEAT_PRODUCT_ROLE"]],
  ["duplicate Council seat reviewer", (fixture) => { fixture.council.seatVerdicts.design.reviewerId = "reviewer-product"; }, ["COUNCIL_SEAT_UNIQUENESS"]],
  ["tampered Product seat attestation", (fixture) => { fixture.council.seatVerdicts.product.attestationDigest = `sha256:${"0".repeat(64)}`; }, ["SEAT_PRODUCT_ATTESTATION"]],
  ["Product seat revision mismatch", (fixture) => { fixture.council.seatVerdicts.product.reviewedRevision = "d".repeat(40); }, ["SEAT_PRODUCT_BINDING"]],
  ["Product seat dossier mismatch", (fixture) => { fixture.council.seatVerdicts.product.dossierDigest = `sha256:${"0".repeat(64)}`; }, ["SEAT_PRODUCT_BINDING"]],
  ["QA reviewer is implementer", (fixture) => { fixture.candidate.implementerIds.push("reviewer-qa"); }, ["QA_INDEPENDENCE_IMPLEMENTER"]],
  ["QA reviewer produced test evidence", (fixture) => { fixture.candidate.evidenceProducerIds.push("reviewer-qa"); }, ["QA_INDEPENDENCE_EVIDENCE"]],
  ["candidate implementer IDs empty", (fixture) => { fixture.candidate.implementerIds = []; }, ["CANDIDATE_CONTRIBUTOR_IDS"]],
  ["candidate evidence-producer IDs empty", (fixture) => { fixture.candidate.evidenceProducerIds = []; }, ["CANDIDATE_CONTRIBUTOR_IDS"]],
  ["specialist veto", (fixture) => { fixture.specialistVetoes = ["fictional-veto"]; }, ["SPECIALIST_VETO"]],
  ["seat scope context tampered", (fixture) => { fixture.council.seatVerdicts.product.requestedScopeClass = "private-execution"; }, ["SEAT_PRODUCT_CONTEXT"]],
  ["seat action context tampered", (fixture) => { fixture.council.seatVerdicts.product.requestedActionClass = "write-data"; }, ["SEAT_PRODUCT_CONTEXT"]],
  ["seat Council verdict context tampered", (fixture) => { fixture.council.seatVerdicts.product.requestedCouncilVerdict = "ready-private-execution"; }, ["SEAT_PRODUCT_CONTEXT"]],
  ["seat rationale tampered after attestation", (fixture) => { fixture.council.seatVerdicts.product.rationale = "Tampered rationale."; }, ["SEAT_PRODUCT_ATTESTATION"]],
  ["seat Design digest tampered", (fixture) => { fixture.council.seatVerdicts.product.designCoverageDigest = `sha256:${"0".repeat(64)}`; }, ["SEAT_PRODUCT_CONTEXT"]],
  ["seat implementer digest tampered", (fixture) => { fixture.council.seatVerdicts.product.implementerIdsDigest = `sha256:${"0".repeat(64)}`; }, ["SEAT_PRODUCT_CONTEXT"]],
  ["seat evidence-producer digest tampered", (fixture) => { fixture.council.seatVerdicts.product.evidenceProducerIdsDigest = `sha256:${"0".repeat(64)}`; }, ["SEAT_PRODUCT_CONTEXT"]],
  ["seat task-contract digest tampered", (fixture) => { fixture.council.seatVerdicts.product.taskContractSha256 = "0".repeat(64); }, ["SEAT_PRODUCT_CONTEXT"]],
  ["seat task-file digest tampered", (fixture) => { fixture.council.seatVerdicts.product.taskFilesSha256 = "0".repeat(64); }, ["SEAT_PRODUCT_CONTEXT"]],
  ["seat base revision tampered", (fixture) => { fixture.council.seatVerdicts.product.baseRevision = "8".repeat(40); }, ["SEAT_PRODUCT_CONTEXT"]],
  ["candidate task-contract digest tampered", (fixture) => { fixture.candidate.taskContractSha256 = "0".repeat(64); }, ["CANDIDATE_TASK_CONTRACT"]],
];
n03.forEach(([name, mutate, codes], index) => assertNegative(`PC-001-CTL-N03.${String(index + 1).padStart(2, "0")}`, name, localFixture, mutate, codes));
assertNegative("PC-001-CTL-N03.registry-context", "reviewer-registry broadening after approval requires fresh approval", localFixture,
  (fixture) => {
    fixture.reviewerRegistry.reviewers.push({
      reviewerId: "reviewer-unrelated-new",
      role: "implementation",
      identityClass: "agent",
      active: true,
    });
    recomputeBindings(fixture);
  }, ["APPROVAL_PUBLICATION_REVIEWER_REGISTRY"]);
assertNegative("PC-001-CTL-N03.owner-context", "non-due owner-action evidence change after approval requires fresh approval", localFixture,
  (fixture) => {
    fixture.ownerActions.find((record) => record.actionId === "P0-OA-002").status = "not-triggered";
    recomputeBindings(fixture);
  }, ["APPROVAL_PUBLICATION_OWNER_ACTION_STATE"]);
assertNegative("PC-001-CTL-N03.requirement-contract", "requirement remap after approval invalidates the task contract", localFixture,
  (fixture) => {
    fixture.requirementIds = ["LID-FICTIONAL-001"];
    fixture.expectedRequirementIds = ["LID-FICTIONAL-001"];
    recomputeBindings(fixture);
  }, ["APPROVAL_PUBLICATION_TASK_CONTRACT"]);
assertNegative("PC-001-CTL-N03.dependency-contract", "dependency removal after approval invalidates the task contract", localFixture,
  (fixture) => {
    fixture.dependencyRequirements = [];
    fixture.dependencyEvidence = [];
    recomputeBindings(fixture);
  }, ["APPROVAL_PUBLICATION_TASK_CONTRACT"]);
for (const kind of ["decision", "blocker", "veto"]) {
  assertNegative(
    "PC-001-CTL-N03.context-clear",
    `clearing approval-bound ${kind} invalidates seat attestations`,
    () => contextClearedAfterAttestationFixture(kind),
    () => {},
    ["SEAT_PRODUCT_CONTEXT", "SEAT_PRODUCT_ATTESTATION"],
  );
}
assertNegative("PC-001-CTL-N03.dependency-replay", "dependency evidence replacement invalidates existing seat attestations", localFixture,
  (fixture) => { fixture.dependencyEvidence[0].evidenceReference = "dependency:PC-001-AUD-001-R2"; },
  ["SEAT_PRODUCT_CONTEXT", "SEAT_PRODUCT_ATTESTATION"]);
assertNegative("PC-001-CTL-N03.authority-replay", "private-authority replacement invalidates existing seat attestations", privateFixture,
  (fixture) => { fixture.privateAuthority.evidenceReference = "authority:P0-AUTH-FICTIONAL-002"; },
  ["SEAT_PRODUCT_CONTEXT", "SEAT_PRODUCT_ATTESTATION"]);
assertNegative("PC-001-CTL-N03.review-replay", "artifact-review replacement invalidates existing seat attestations", localFixture,
  (fixture) => {
    const review = fixture.artifactReviews.product;
    review.evidenceReference = "review:PC-001-product-R2";
    review.attestationDigest = computeAttestationDigest({
      taskId: fixture.taskId,
      subjectType: "artifact",
      subject: "product",
      decision: review.decision,
      reviewerId: review.reviewerId,
      reviewerRole: review.reviewerRole,
      reviewedRevision: review.reviewedRevision,
      dossierDigest: review.dossierDigest,
      artifactSha256: review.artifactSha256,
      evidenceReference: review.evidenceReference,
      notApplicableRationale: review.notApplicableRationale,
      specialistConcurrence: review.specialistConcurrence,
    });
  }, ["SEAT_PRODUCT_CONTEXT", "SEAT_PRODUCT_ATTESTATION"]);

assertNegative("PC-001-CTL-N04.01", "candidate absent from fetched main", localFixture,
  (_fixture, trusted) => { trusted.candidatePublication.candidateOnFetchedMain = false; }, ["CANDIDATE_PUBLISHED"]);
assertNegative("PC-001-CTL-N04.02", "approval publication unmerged", localFixture,
  (_fixture, trusted) => { trusted.approvalPublication.publishedOnFetchedMain = false; }, ["APPROVAL_PUBLICATION_MAIN"]);
const publicationCases = [
  ["candidate publication revision mismatch", (_fixture, trusted) => { trusted.candidatePublication.revision = "d".repeat(40); }, "CANDIDATE_PUBLICATION_BINDING"],
  ["candidate publication missing", (_fixture, trusted) => { trusted.candidatePublication = {}; }, "CANDIDATE_PUBLICATION_BINDING"],
  ["candidate base ancestry unverified", (_fixture, trusted) => { trusted.candidatePublication.baseAncestorOfCandidate = false; }, "CANDIDATE_BASE_REVISION"],
  ["candidate closure digest mismatched", (_fixture, trusted) => { trusted.candidatePublication.candidateDiffTaskFilesSha256 = "0".repeat(64); }, "CANDIDATE_TASK_FILES_FULL_DIFF"],
  ["candidate closure set unverified", (_fixture, trusted) => { trusted.candidatePublication.candidateDiffExactMatchVerified = false; }, "CANDIDATE_TASK_FILES_FULL_DIFF"],
  ["candidate closure contains a forbidden diff shape", (_fixture, trusted) => { trusted.candidatePublication.candidateDiffNoDeletionsVerified = false; }, "CANDIDATE_TASK_FILES_FULL_DIFF"],
  ["candidate closure uses an extra exclusion", (_fixture, trusted) => { trusted.candidatePublication.candidateDiffExclusions.push("tools/extra.mjs"); }, "CANDIDATE_TASK_FILES_FULL_DIFF"],
  ["candidate manifest task differs", (_fixture, trusted) => { trusted.candidatePublication.candidateTaskContractSha256 = "0".repeat(64); }, "CANDIDATE_TASK_CONTRACT_PUBLICATION"],
  ["candidate manifest task bytes unverified", (_fixture, trusted) => { trusted.candidatePublication.candidateTaskContractBytesVerified = false; }, "CANDIDATE_TASK_CONTRACT_PUBLICATION"],
  ["candidate content classes unverified", (_fixture, trusted) => { trusted.candidatePublication.publishedTaskFileContentClassesVerified = false; }, "CANDIDATE_TASK_FILES_LOCAL_BYTES"],
  ["current content classes unverified", (_fixture, trusted) => { trusted.candidatePublication.currentTaskFileContentClassesVerified = false; }, "CANDIDATE_TASK_FILES_LOCAL_BYTES"],
  ["candidate XLSX archive scan unverified", (_fixture, trusted) => { trusted.candidatePublication.publishedTaskFileArchivesVerified = false; }, "CANDIDATE_TASK_FILES_LOCAL_BYTES"],
  ["current XLSX archive scan unverified", (_fixture, trusted) => { trusted.candidatePublication.currentTaskFileArchivesVerified = false; }, "CANDIDATE_TASK_FILES_LOCAL_BYTES"],
  ["published task-file digest mismatched", (_fixture, trusted) => { trusted.candidatePublication.publishedTaskFilesSha256 = "0".repeat(64); }, "CANDIDATE_TASK_FILES_PUBLISHED"],
  ["published task-file bytes unverified", (_fixture, trusted) => { trusted.candidatePublication.publishedTaskFilesBytesVerified = false; }, "CANDIDATE_TASK_FILES_PUBLISHED"],
  ["published task-file modes unverified", (_fixture, trusted) => { trusted.candidatePublication.publishedTaskFilesModesVerified = false; }, "CANDIDATE_TASK_FILES_PUBLISHED"],
  ["descendant implementation bytes drifted", (_fixture, trusted) => { trusted.candidatePublication.currentTaskFilesSha256 = "0".repeat(64); }, "CANDIDATE_TASK_FILES_CURRENT"],
  ["descendant task-file bytes unverified", (_fixture, trusted) => { trusted.candidatePublication.currentTaskFilesBytesVerified = false; }, "CANDIDATE_TASK_FILES_CURRENT"],
  ["descendant task-file modes unverified", (_fixture, trusted) => { trusted.candidatePublication.currentTaskFilesModesVerified = false; }, "CANDIDATE_TASK_FILES_CURRENT"],
  ["task-file coverage unverified", (_fixture, trusted) => { trusted.candidatePublication.taskFilesCoverageVerified = false; }, "CANDIDATE_TASK_FILES_CURRENT"],
  ["descendant adapter reports an unapproved path", (_fixture, trusted) => { trusted.candidatePublication.currentDescendantDeltaPathsVerified = false; }, "CANDIDATE_DESCENDANT_DELTA"],
  ["descendant delta deletes a path", (_fixture, trusted) => { trusted.candidatePublication.currentDescendantDeltaNoDeletionsVerified = false; }, "CANDIDATE_DESCENDANT_DELTA"],
  ["source-supplied candidate publication", (fixture) => {
    fixture.candidatePublication = { revision: CANDIDATE_REVISION, candidateBytesVerified: true, candidateOnFetchedMain: true };
  }, "PUBLICATION_SOURCE_OVERRIDE"],
  ["source-supplied approval publication", (fixture) => {
    fixture.approvalPublication = { revision: APPROVAL_REVISION, publishedOnFetchedMain: true };
  }, "PUBLICATION_SOURCE_OVERRIDE"],
  ["source approval record contains its revision", (fixture) => { fixture.approvalRecord.revision = APPROVAL_REVISION; }, "APPROVAL_RECORD_SOURCE_SHAPE"],
  ["source approval record contains publication Boolean", (fixture) => { fixture.approvalRecord.publishedOnFetchedMain = true; }, "PUBLICATION_SOURCE_OVERRIDE"],
  ["approval publication missing", (_fixture, trusted) => { trusted.approvalPublication = {}; }, "APPROVAL_PUBLICATION_REVISION"],
  ["approval publication reuses candidate revision", (_fixture, trusted) => { trusted.approvalPublication.revision = CANDIDATE_REVISION; }, "APPROVAL_PUBLICATION_REVISION"],
  ["approval publication revision malformed", (_fixture, trusted) => { trusted.approvalPublication.revision = "not-a-revision"; }, "APPROVAL_PUBLICATION_REVISION"],
  ["approval publication registry path mismatched", (_fixture, trusted) => { trusted.approvalPublication.registryPath = "docs/P0-WRONG.json"; }, "APPROVAL_PUBLICATION_PATH"],
  ["approval publication registry hash malformed", (_fixture, trusted) => { trusted.approvalPublication.registrySha256 = "not-a-sha"; }, "APPROVAL_PUBLICATION_HASH"],
  ["approval publication registry bytes unverified", (_fixture, trusted) => { trusted.approvalPublication.registryBytesVerified = false; }, "APPROVAL_PUBLICATION_BYTES"],
  ["approval publication task ID mismatched", (_fixture, trusted) => { trusted.approvalPublication.taskId = "PC-999"; }, "APPROVAL_PUBLICATION_TASK_RECORD"],
  ["approval publication task record hash malformed", (_fixture, trusted) => { trusted.approvalPublication.publishedTaskApprovalSha256 = "not-a-sha"; }, "APPROVAL_PUBLICATION_TASK_RECORD"],
  ["approval publication task record bytes changed", (_fixture, trusted) => { trusted.approvalPublication.currentTaskApprovalSha256 = "0".repeat(64); }, "APPROVAL_PUBLICATION_TASK_RECORD"],
  ["approval publication task bytes unverified", (_fixture, trusted) => { trusted.approvalPublication.taskApprovalBytesVerified = false; }, "APPROVAL_PUBLICATION_TASK_RECORD"],
  ["approval-time reviewer digest mismatched", (_fixture, trusted) => { trusted.approvalPublication.publishedReviewerRegistrySha256 = "0".repeat(64); }, "APPROVAL_PUBLICATION_REVIEWER_REGISTRY"],
  ["current reviewer digest mismatched", (_fixture, trusted) => { trusted.approvalPublication.currentReviewerRegistrySha256 = "0".repeat(64); }, "APPROVAL_PUBLICATION_REVIEWER_REGISTRY"],
  ["reviewer registry bytes unverified", (_fixture, trusted) => { trusted.approvalPublication.reviewerRegistryBytesVerified = false; }, "APPROVAL_PUBLICATION_REVIEWER_REGISTRY"],
  ["approval-time owner-action digest mismatched", (_fixture, trusted) => { trusted.approvalPublication.publishedOwnerActionStateSha256 = "0".repeat(64); }, "APPROVAL_PUBLICATION_OWNER_ACTION_STATE"],
  ["current owner-action digest mismatched", (_fixture, trusted) => { trusted.approvalPublication.currentOwnerActionStateSha256 = "0".repeat(64); }, "APPROVAL_PUBLICATION_OWNER_ACTION_STATE"],
  ["owner-action bytes unverified", (_fixture, trusted) => { trusted.approvalPublication.ownerActionStateBytesVerified = false; }, "APPROVAL_PUBLICATION_OWNER_ACTION_STATE"],
  ["approval-time task-contract digest mismatched", (_fixture, trusted) => { trusted.approvalPublication.publishedTaskContractSha256 = "0".repeat(64); }, "APPROVAL_PUBLICATION_TASK_CONTRACT"],
  ["current task-contract digest mismatched", (_fixture, trusted) => { trusted.approvalPublication.currentTaskContractSha256 = "0".repeat(64); }, "APPROVAL_PUBLICATION_TASK_CONTRACT"],
  ["task-contract bytes unverified", (_fixture, trusted) => { trusted.approvalPublication.taskContractBytesVerified = false; }, "APPROVAL_PUBLICATION_TASK_CONTRACT"],
  ["candidate is not ancestor of approval publication", (_fixture, trusted) => { trusted.approvalPublication.candidateAncestorOfApproval = false; }, "APPROVAL_PUBLICATION_ANCESTRY"],
  ["approval source binding false", (fixture) => { fixture.approvalRecord.approvalsVerified = false; }, "APPROVAL_RECORD_BINDING"],
];
publicationCases.forEach(([name, mutate, code], index) => assertNegative(
  `PC-001-CTL-N04.${String(index + 3).padStart(2, "0")}`,
  name,
  localFixture,
  mutate,
  [code],
));
const activationCases = [
  ["fresh fetch failed", (_fixture, trusted) => { trusted.activation.fetchSucceeded = false; }, "ACTIVATION_FETCH"],
  ["dirty checkout", (_fixture, trusted) => { trusted.activation.worktreeClean = false; }, "ACTIVATION_CLEAN"],
  ["wrong activation upstream", (_fixture, trusted) => { trusted.activation.upstream = "origin/feature"; }, "ACTIVATION_BRANCH"],
  ["HEAD differs from origin/main", (_fixture, trusted) => { trusted.activation.headRevision = "d".repeat(40); }, "ACTIVATION_EXACT_MAIN"],
  ["approval unreachable from HEAD", (_fixture, trusted) => { trusted.activation.approvalRecordReachableFromHead = false; }, "ACTIVATION_APPROVAL_REACHABLE"],
  ["activation approval revision mismatched", (_fixture, trusted) => { trusted.activation.approvalPublicationRevision = "d".repeat(40); }, "ACTIVATION_APPROVAL_REACHABLE"],
  ["activation candidate revision mismatched", (_fixture, trusted) => { trusted.activation.candidateRevision = "d".repeat(40); }, "ACTIVATION_APPROVAL_REACHABLE"],
  ["external sync source mismatch", (_fixture, trusted) => { trusted.activation.externalSyncSourceRevision = "d".repeat(40); }, "ACTIVATION_SOURCE"],
  ["runtime task files verified at another revision", (_fixture, trusted) => { trusted.activation.taskFilesVerifiedAtRevision = "d".repeat(40); }, "ACTIVATION_TASK_FILES"],
  ["runtime scope differs from approval", (_fixture, trusted) => { trusted.activation.runtimeRequestedScopeClass = "private-execution"; }, "ACTIVATION_RUNTIME_REQUEST"],
  ["runtime action differs from approval", (_fixture, trusted) => { trusted.activation.runtimeRequestedActionClass = "planning-control"; }, "ACTIVATION_RUNTIME_REQUEST"],
];
activationCases.forEach(([name, mutate, code], index) => assertNegative(
  `PC-001-CTL-N04.${String(index + 21).padStart(2, "0")}`,
  name,
  activationFixture,
  mutate,
  [code],
  { phase: "activation" },
));
assertNegative("PC-001-CTL-N04.activation-source", "source-supplied activation facts", activationFixture,
  (fixture, trusted) => { fixture.activation = trusted.activation; }, ["DERIVED_OVERRIDE"], { phase: "activation" });

const n05 = [
  ["missing dependency evidence", localFixture, (fixture) => { fixture.dependencyEvidence = []; }, ["DEPENDENCY_AUD_001"]],
  ["requirement mismatch", localFixture, (fixture) => { fixture.expectedRequirementIds = ["LID-FICTIONAL-001"]; }, ["REQUIREMENT_SET"]],
  ["acceptance scenarios missing", localFixture, (fixture) => { fixture.acceptanceScenarioIds = []; }, ["ACCEPTANCE_SCENARIOS"]],
  ["scope/verdict mismatch", localFixture, (fixture) => { fixture.council.verdict = "ready-private-execution"; }, ["COUNCIL_SCOPE_VERDICT"]],
  ["local scope launders authentic-photo admission", localFixture, (fixture) => {
    fixture.requestedScope.actionClass = "authentic-photo-admission";
    recomputeBindings(fixture);
  }, ["SCOPE_ACTION_COMPATIBILITY"]],
  ["local scope launders credential use", localFixture, (fixture) => {
    fixture.requestedScope.actionClass = "credential-use";
    recomputeBindings(fixture);
  }, ["SCOPE_ACTION_COMPATIBILITY"]],
  ["local scope launders deployment", localFixture, (fixture) => {
    fixture.requestedScope.actionClass = "deployment";
    recomputeBindings(fixture);
  }, ["SCOPE_ACTION_COMPATIBILITY"]],
  ["local scope launders provider change", localFixture, (fixture) => {
    fixture.requestedScope.actionClass = "provider-change";
    recomputeBindings(fixture);
  }, ["SCOPE_ACTION_COMPATIBILITY"]],
  ["R3 task launders R9 final-launch action", () => retargetedActionFixture(releaseFixture, {
    taskId: "REL-R3-001",
    milestone: "R3",
    scopeClass: "release",
    actionClass: "final-launch-decision",
  }), () => {}, ["TASK_SCOPE_ACTION_COMPATIBILITY"]],
  ["non-PC task launders PC Project-workflow mutation", () => retargetedActionFixture(projectWorkflowFixture, {
    taskId: "ENG-R0-001",
    milestone: "R0",
    scopeClass: "private-execution",
    actionClass: "project-workflow-mutation",
  }), () => {}, ["TASK_SCOPE_ACTION_COMPATIBILITY"]],
  ["R0 task launders R2 authentic-photo admission", () => retargetedActionFixture(releaseFixture, {
    taskId: "ENG-R0-001",
    milestone: "R0",
    scopeClass: "release",
    actionClass: "authentic-photo-admission",
  }), () => {}, ["TASK_SCOPE_ACTION_COMPATIBILITY"]],
  ["task ID claims a different milestone action contract", () => retargetedActionFixture(releaseFixture, {
    taskId: "REL-R3-001",
    milestone: "R9",
    scopeClass: "release",
    actionClass: "final-launch-decision",
  }), () => {}, ["TASK_MILESTONE_COMPATIBILITY", "TASK_SCOPE_ACTION_COMPATIBILITY"]],
  ["one task approval claims multiple execution-bearing actions", localFixture, (fixture) => {
    fixture.requestedScope.actionClasses = ["readiness-control-hardening", "planning-control"];
    recomputeBindings(fixture);
  }, ["TASK_APPROVAL_ACTION_CARDINALITY"]],
  ["open decision", localFixture, (fixture) => { fixture.openDecisions = ["fictional decision"]; }, ["OPEN_DECISIONS"]],
  ["unresolved blocker", localFixture, (fixture) => { fixture.council.unresolvedBlockers = ["fictional blocker"]; }, ["UNRESOLVED_BLOCKERS"]],
  ["due owner action pending", privateFixture, (fixture) => { fixture.ownerActions[0].status = "pending"; }, ["OWNER_ACTION_P0_OA_001"]],
  ["due owner action failed", privateFixture, (fixture) => { fixture.ownerActions[0].result = "fail"; }, ["OWNER_ACTION_P0_OA_001"]],
  ["workflow-specific due owner action pending", projectWorkflowFixture, (fixture) => { fixture.ownerActions[1].status = "pending"; }, ["OWNER_ACTION_P0_OA_002"]],
  ["mutable owner-action record narrowing cannot remove the canonical due action", privateFixture, (fixture) => { fixture.ownerActions[0].requiredForActionClasses = ["write-data"]; }, ["OWNER_ACTION_P0_OA_001"]],
  ["no canonical owner action covers requested private scope and action", privateFixture, (fixture) => {
    fixture.ownerActionRequirements[0].requiredForActionClasses = ["private-system-mutation"];
  }, ["OWNER_ACTION_REQUIREMENTS"]],
  ["scope-mapped owner action wrong candidate", privateFixture, (fixture) => { fixture.ownerActions[0].candidateRevision = "d".repeat(40); }, ["OWNER_ACTION_P0_OA_001"]],
  ["scope-mapped owner action wrong dossier", privateFixture, (fixture) => { fixture.ownerActions[0].dossierDigest = `sha256:${"0".repeat(64)}`; }, ["OWNER_ACTION_P0_OA_001"]],
  ["scope-mapped owner action missing human", privateFixture, (fixture) => { fixture.ownerActions[0].accountableHumanId = null; }, ["OWNER_ACTION_P0_OA_001_HUMAN"]],
  ["scope-mapped owner action inactive human", privateFixture, (fixture) => {
    fixture.reviewerRegistry.reviewers.find((reviewer) => reviewer.reviewerId === "fictional-owner-human").active = false;
  }, ["OWNER_ACTION_P0_OA_001_HUMAN"]],
  ["scope-mapped owner action non-human identity", privateFixture, (fixture) => {
    fixture.reviewerRegistry.reviewers.find((reviewer) => reviewer.reviewerId === "fictional-owner-human").identityClass = "agent";
  }, ["OWNER_ACTION_P0_OA_001_HUMAN"]],
  ["scope-mapped owner action wrong human role", privateFixture, (fixture) => {
    fixture.reviewerRegistry.reviewers.find((reviewer) => reviewer.reviewerId === "fictional-owner-human").role = "product";
  }, ["OWNER_ACTION_P0_OA_001_HUMAN"]],
  ["scope-mapped owner action missing owner attestation", privateFixture, (fixture) => { fixture.ownerActions[0].ownerAttestationReference = null; }, ["OWNER_ACTION_P0_OA_001_HUMAN"]],
  ["scope-mapped owner action ineligible verifier", privateFixture, (fixture) => {
    fixture.ownerActions[0].verifierId = "reviewer-architecture";
    fixture.ownerActions[0].verifierRole = "architecture";
  }, ["OWNER_ACTION_P0_OA_001_VERIFIER"]],
  ["scope-mapped owner action inactive verifier", privateFixture, (fixture) => {
    fixture.reviewerRegistry.reviewers.find((reviewer) => reviewer.reviewerId === "reviewer-project").active = false;
  }, ["OWNER_ACTION_P0_OA_001_VERIFIER"]],
  ["scope-mapped requirement and record human roles differ", privateFixture, (fixture) => {
    fixture.ownerActionRequirements[0].accountableHumanRole = "different-owner-role";
  }, ["OWNER_ACTION_P0_OA_001_HUMAN"]],
  ["second composite owner action missing", privateFixture, (fixture) => {
    fixture.ownerActionRequirements.push({
      actionId: "P0-OA-003",
      requiredForScopeClasses: ["private-execution"],
      requiredForActionClasses: ["private-system-read"],
      accountableHumanId: "fictional-owner-human",
      accountableHumanRole: "owner-authority",
    });
  }, ["OWNER_ACTION_REQUIREMENTS"]],
  ["specialist veto", localFixture, (fixture) => { fixture.specialistVetoes = ["fictional-veto"]; }, ["SPECIALIST_VETO"]],
];
n05.forEach(([name, factory, mutate, codes], index) => assertNegative(`PC-001-CTL-N05.${String(index + 1).padStart(2, "0")}`, name, factory, mutate, codes));

assert.throws(() => buildTaskReadinessInput({
  task: { id: "PC-001", milestone: "P0", status: "Done", requirementIds: [], dependencies: [] },
  artifacts: {},
  readinessState: { taskOverrides: { "PC-001": { openDecisions: [] } } },
  reviewerRegistry: { reviewers: [] },
  approvalRegistry: { taskApprovals: { "PC-001": { approvalRecord: { approvalsVerified: true } } } },
  ownerActionState: { actions: {} },
}), /mutable readiness state cannot override approval-bound evidence/);
recordResult("PC-001-CTL-N05", "post-approval mutable state cannot clear approval-bound decisions", "pass", {
  expectedCodes: ["SOURCE_BUILDER_APPROVAL_BOUND_OVERRIDE"],
});

const n06 = [
  ["private authority missing", (fixture) => { fixture.privateAuthority = null; }, "PRIVATE_AUTHORITY_STRUCTURED"],
  ["regex-only private authority", (fixture) => { fixture.privateAuthority = "P0-AUTH-FICTIONAL-001"; }, "PRIVATE_AUTHORITY_STRUCTURED"],
  ["private authority expired", (fixture) => { fixture.privateAuthority.windowEnd = "2026-08-15T11:59:59.000Z"; }, "PRIVATE_AUTHORITY_WINDOW"],
  ["private authority not yet valid", (fixture) => { fixture.privateAuthority.windowStart = "2026-08-15T12:00:01.000Z"; }, "PRIVATE_AUTHORITY_WINDOW"],
  ["private authority failed", (fixture) => { fixture.privateAuthority.result = "fail"; }, "PRIVATE_AUTHORITY_RESULT"],
  ["private authority wrong task", (fixture) => { fixture.privateAuthority.taskId = "PC-999"; }, "PRIVATE_AUTHORITY_SCOPE"],
  ["private authority wrong scope", (fixture) => { fixture.privateAuthority.scopeClass = "release"; }, "PRIVATE_AUTHORITY_SCOPE"],
  ["private authority wrong action", (fixture) => { fixture.privateAuthority.allowedActionClass = "write-data"; }, "PRIVATE_AUTHORITY_SCOPE"],
  ["private authority unknown verifier", (fixture) => { fixture.privateAuthority.verifierId = "reviewer-unknown"; }, "PRIVATE_AUTHORITY_VERIFIER"],
  ["private authority ineligible verifier", (fixture) => {
    fixture.privateAuthority.verifierId = "reviewer-product";
    fixture.privateAuthority.verifierRole = "product";
  }, "PRIVATE_AUTHORITY_VERIFIER"],
  ["private authority inactive verifier", (fixture) => {
    fixture.reviewerRegistry.reviewers.find((reviewer) => reviewer.reviewerId === "reviewer-project").active = false;
  }, "PRIVATE_AUTHORITY_VERIFIER"],
  ["private authority missing human", (fixture) => { fixture.privateAuthority.accountableHumanId = null; }, "PRIVATE_AUTHORITY_HUMAN"],
  ["private authority inactive human", (fixture) => {
    fixture.reviewerRegistry.reviewers.find((reviewer) => reviewer.reviewerId === "fictional-owner-human").active = false;
  }, "PRIVATE_AUTHORITY_HUMAN"],
  ["private authority non-human identity", (fixture) => {
    fixture.reviewerRegistry.reviewers.find((reviewer) => reviewer.reviewerId === "fictional-owner-human").identityClass = "agent";
  }, "PRIVATE_AUTHORITY_HUMAN"],
  ["private authority wrong human role", (fixture) => {
    fixture.privateAuthority.accountableHumanRole = "project";
  }, "PRIVATE_AUTHORITY_HUMAN"],
  ["private authority missing owner attestation", (fixture) => { fixture.privateAuthority.ownerAttestationReference = null; }, "PRIVATE_AUTHORITY_HUMAN"],
  ["private authority human differs from owner action", (fixture) => {
    fixture.privateAuthority.ownerAttestationReference = "owner:DIFFERENT-FICTIONAL";
  }, "PRIVATE_AUTHORITY_ACTION_RECORD"],
  ["private authority wrong owner action", (fixture) => { fixture.privateAuthority.ownerActionId = "P0-OA-002"; }, "PRIVATE_AUTHORITY_RESULT"],
  ["private authority wrong candidate", (fixture) => { fixture.privateAuthority.candidateRevision = "d".repeat(40); }, "PRIVATE_AUTHORITY_CANDIDATE"],
  ["private authority custody missing", (fixture) => { fixture.privateAuthority.evidenceReference = null; }, "PRIVATE_AUTHORITY_CUSTODY"],
  ["private authority unmatched owner action", (fixture) => { fixture.ownerActions = []; }, "PRIVATE_AUTHORITY_ACTION_RECORD"],
];
n06.forEach(([name, mutate, code], index) => assertNegative(`PC-001-CTL-N06.${String(index + 1).padStart(2, "0")}`, name, privateFixture, mutate, [code]));

function refreshTargets(overrides = {}) {
  return [
    {
      path: "P0-fixture-one.md",
      exists: true,
      content: "original one\n",
      artifactState: "draft",
      artifactReviewDecision: "hold",
      candidateBinding: null,
      seatVerdicts: ["hold"],
      attestationBindings: [],
      evidenceBindings: [],
      ...overrides,
    },
    {
      path: "P0-fixture-two.md",
      exists: true,
      content: "original two\n",
      artifactState: "draft",
      artifactReviewDecision: "hold",
      candidateBinding: null,
      seatVerdicts: ["hold"],
      attestationBindings: [],
      evidenceBindings: [],
    },
  ];
}
const refreshIntended = [
  { path: "P0-fixture-one.md", content: "new one\n" },
  { path: "P0-fixture-two.md", content: "new two\n" },
];
const protectionCases = [
  ["non-draft marker", { artifactState: "in-review" }],
  ["non-Hold artifact review", { artifactReviewDecision: "approved" }],
  ["candidate binding", { candidateBinding: { revision: CANDIDATE_REVISION } }],
  ["non-Hold Council seat", { seatVerdicts: ["approved"] }],
  ["attestation binding", { attestationBindings: [`sha256:${"1".repeat(64)}`] }],
  ["evidence binding", { evidenceBindings: ["review:fixture-binding"] }],
];
for (const [name, overrides] of protectionCases) {
  const plan = planProtectedRefresh(refreshTargets(overrides), refreshIntended);
  assert.equal(plan.allowed, false, `PC-001-CTL-N07: ${name} should deny refresh`);
  assert.ok(plan.blockers.some((blocker) => blocker.code === "REFRESH_PROTECTED"));
  recordResult("PC-001-CTL-N07", `protected refresh: ${name}`, "pass", { expectedCodes: ["REFRESH_PROTECTED"] });
}
for (const [name, overrides] of [
  ["missing target with candidate binding", { candidateBinding: { revision: CANDIDATE_REVISION } }],
  ["missing target with approved review", { artifactReviewDecision: "approved" }],
]) {
  const target = {
    path: "P0-missing-fixture.md",
    exists: false,
    content: null,
    artifactState: null,
    artifactReviewDecision: null,
    candidateBinding: null,
    seatVerdicts: [],
    attestationBindings: [],
    evidenceBindings: [],
    ...overrides,
  };
  const plan = planProtectedRefresh([target], [{ path: target.path, content: "new missing fixture\n" }]);
  assert.equal(plan.allowed, false, `PC-001-CTL-N07: ${name} should deny refresh`);
  assert.ok(plan.blockers.some((blocker) => blocker.code === "REFRESH_PROTECTED"));
  recordResult("PC-001-CTL-N07", `protected refresh: ${name}`, "pass", { expectedCodes: ["REFRESH_PROTECTED"] });
}
const unboundMissingPlan = planProtectedRefresh([{
  path: "P0-missing-fixture.md",
  exists: false,
  content: null,
  artifactState: null,
  artifactReviewDecision: null,
  candidateBinding: null,
  seatVerdicts: [],
  attestationBindings: [],
  evidenceBindings: [],
}], [{ path: "P0-missing-fixture.md", content: "new missing fixture\n" }]);
assert.equal(unboundMissingPlan.allowed, true);
recordResult("PC-001-CTL-N07", "unbound missing target remains creatable", "pass");

function memoryAdapter(initial, failLabel = null, {
  afterStage = null,
  afterWriteJournal = null,
  afterPromote = null,
} = {}) {
  const files = new Map(Object.entries(initial));
  const protections = new Map(refreshTargets().map((target) => [target.path, clone(target)]));
  const staged = new Map();
  const recovery = { journal: null };
  const counts = { stage: 0, promote: 0 };
  return {
    files,
    protections,
    staged,
    recovery,
    async read(filePath) { return files.has(filePath) ? files.get(filePath) : null; },
    async readProtection(filePath) {
      const protection = clone(protections.get(filePath) ?? { exists: false });
      protection.exists = files.has(filePath);
      return protection;
    },
    async stage(filePath, content) {
      const index = counts.stage++;
      staged.set(filePath, content);
      if (failLabel === `stage:${index}`) throw new Error("injected stage failure");
      if (afterStage) await afterStage({ index, filePath, files, protections, staged });
    },
    async readStaged(filePath) { return staged.has(filePath) ? staged.get(filePath) : null; },
    async promote(filePath) {
      const index = counts.promote++;
      if (staged.has(filePath)) files.set(filePath, staged.get(filePath));
      if (failLabel === `promote:${index}`) throw new Error("injected promote failure");
      if (afterPromote) await afterPromote({ index, filePath, files, protections, staged });
    },
    async writeRecoveryJournal(journal) {
      recovery.journal = clone(journal);
      if (afterWriteJournal) await afterWriteJournal({ files, protections, staged, recovery });
      return true;
    },
    async readRecoveryJournal() {
      return recovery.journal === null ? null : clone(recovery.journal);
    },
    async clearRecoveryJournal() {
      recovery.journal = null;
      return true;
    },
    async discard(filePath) { staged.delete(filePath); },
  };
}

const refreshPlan = planProtectedRefresh(refreshTargets(), refreshIntended);
assert.equal(refreshPlan.allowed, true);
assert.equal(refreshPlan.changes[0].originalProtectionFingerprint,
  computeRefreshProtectionFingerprint(refreshTargets()[0]));
for (const failure of ["stage:0", "stage:1"]) {
  const adapter = memoryAdapter({
    "P0-fixture-one.md": "original one\n",
    "P0-fixture-two.md": "original two\n",
  }, failure);
  const outcome = await executeRefreshTransaction(refreshPlan, adapter);
  assert.equal(outcome.applied, false, `PC-001-CTL-N07: ${failure} unexpectedly applied`);
  assert.equal(outcome.restored, true, `PC-001-CTL-N07: ${failure} did not restore`);
  assert.deepEqual(Object.fromEntries(adapter.files), {
    "P0-fixture-one.md": "original one\n",
    "P0-fixture-two.md": "original two\n",
  });
  assert.equal(adapter.staged.size, 0, `PC-001-CTL-N07: ${failure} left staged output`);
  assert.equal(adapter.recovery.journal, null);
  recordResult("PC-001-CTL-N07", `pre-promotion cleanup after ${failure}`, "pass", { expectedCodes: ["REFRESH_HANDLED_FAILURE"] });
}
for (const failure of ["promote:0", "promote:1"]) {
  const adapter = memoryAdapter({
    "P0-fixture-one.md": "original one\n",
    "P0-fixture-two.md": "original two\n",
  }, failure);
  const outcome = await executeRefreshTransaction(refreshPlan, adapter);
  assert.equal(outcome.applied, false);
  assert.equal(outcome.restored, false);
  assert.equal(outcome.recoveryRequired, true);
  assert.equal(outcome.recoveryJournalRetained, true);
  assert.equal(outcome.code, "REFRESH_RECOVERY_REQUIRED");
  assert.deepEqual(Object.fromEntries(adapter.files), failure === "promote:0" ? {
    "P0-fixture-one.md": "new one\n",
    "P0-fixture-two.md": "original two\n",
  } : {
    "P0-fixture-one.md": "new one\n",
    "P0-fixture-two.md": "new two\n",
  });
  assert.equal(adapter.staged.size, 2);
  assert.ok(adapter.recovery.journal);
  recordResult("PC-001-CTL-N07", `post-promotion failure retains current bytes and recovery evidence: ${failure}`, "pass", {
    expectedCodes: ["REFRESH_RECOVERY_REQUIRED"],
  });
}

const contentDriftAdapter = memoryAdapter({
  "P0-fixture-one.md": "original one\n",
  "P0-fixture-two.md": "original two\n",
}, null, {
  afterStage: ({ index, files }) => {
    if (index === 1) files.set("P0-fixture-one.md", "concurrent one\n");
  },
});
const contentDriftOutcome = await executeRefreshTransaction(refreshPlan, contentDriftAdapter);
assert.equal(contentDriftOutcome.applied, false);
assert.equal(contentDriftOutcome.restored, false);
assert.equal(contentDriftOutcome.code, "REFRESH_SOURCE_DRIFT");
assert.deepEqual(Object.fromEntries(contentDriftAdapter.files), {
  "P0-fixture-one.md": "concurrent one\n",
  "P0-fixture-two.md": "original two\n",
});
assert.equal(contentDriftAdapter.staged.size, 0);
recordResult("PC-001-CTL-N07", "content mutation during staging aborts before first promotion", "pass", {
  expectedCodes: ["REFRESH_SOURCE_DRIFT"],
});

const protectionDriftAdapter = memoryAdapter({
  "P0-fixture-one.md": "original one\n",
  "P0-fixture-two.md": "original two\n",
}, null, {
  afterStage: ({ index, protections }) => {
    if (index === 1) protections.get("P0-fixture-one.md").artifactReviewDecision = "approved";
  },
});
const protectionDriftOutcome = await executeRefreshTransaction(refreshPlan, protectionDriftAdapter);
assert.equal(protectionDriftOutcome.applied, false);
assert.equal(protectionDriftOutcome.restored, false);
assert.equal(protectionDriftOutcome.code, "REFRESH_PROTECTION_DRIFT");
assert.deepEqual(Object.fromEntries(protectionDriftAdapter.files), {
  "P0-fixture-one.md": "original one\n",
  "P0-fixture-two.md": "original two\n",
});
assert.equal(protectionDriftAdapter.staged.size, 0);
recordResult("PC-001-CTL-N07", "protection mutation during staging aborts before first promotion", "pass", {
  expectedCodes: ["REFRESH_PROTECTION_DRIFT"],
});

const journalWindowDriftAdapter = memoryAdapter({
  "P0-fixture-one.md": "original one\n",
  "P0-fixture-two.md": "original two\n",
}, null, {
  afterWriteJournal: ({ files }) => {
    files.set("P0-fixture-one.md", "concurrent after journal\n");
  },
});
const journalWindowDriftOutcome = await executeRefreshTransaction(refreshPlan, journalWindowDriftAdapter);
assert.equal(journalWindowDriftOutcome.applied, false);
assert.equal(journalWindowDriftOutcome.restored, false);
assert.equal(journalWindowDriftOutcome.recoveryRequired, false);
assert.equal(journalWindowDriftOutcome.code, "REFRESH_SOURCE_DRIFT");
assert.deepEqual(Object.fromEntries(journalWindowDriftAdapter.files), {
  "P0-fixture-one.md": "concurrent after journal\n",
  "P0-fixture-two.md": "original two\n",
});
assert.equal(journalWindowDriftAdapter.staged.size, 0);
assert.equal(journalWindowDriftAdapter.recovery.journal, null);
recordResult("PC-001-CTL-N07", "target drift after journal is caught before first promotion", "pass", {
  expectedCodes: ["REFRESH_SOURCE_DRIFT"],
});

const guardedRefreshPlan = planProtectedRefresh(refreshTargets(), refreshIntended, [{
  path: "docs/project/P0-fictional-refresh-source.json",
  exists: true,
  content: "source version one\n",
}]);
assert.equal(guardedRefreshPlan.allowed, true);
const sourceGuardDriftAdapter = memoryAdapter({
  "P0-fixture-one.md": "original one\n",
  "P0-fixture-two.md": "original two\n",
  "docs/project/P0-fictional-refresh-source.json": "source version one\n",
}, null, {
  afterStage: ({ index, files }) => {
    if (index === 1) files.set("docs/project/P0-fictional-refresh-source.json", "source version two\n");
  },
});
const sourceGuardDriftOutcome = await executeRefreshTransaction(guardedRefreshPlan, sourceGuardDriftAdapter);
assert.equal(sourceGuardDriftOutcome.applied, false);
assert.equal(sourceGuardDriftOutcome.restored, true);
assert.equal(sourceGuardDriftOutcome.sourceGuardsIntact, false);
assert.equal(sourceGuardDriftOutcome.code, "REFRESH_SOURCE_GUARD_DRIFT");
assert.deepEqual(Object.fromEntries(sourceGuardDriftAdapter.files), {
  "P0-fixture-one.md": "original one\n",
  "P0-fixture-two.md": "original two\n",
  "docs/project/P0-fictional-refresh-source.json": "source version two\n",
});
assert.equal(sourceGuardDriftAdapter.staged.size, 0);
recordResult("PC-001-CTL-N07", "read-only source guard drift aborts stale output promotion without restoring the source", "pass", {
  expectedCodes: ["REFRESH_SOURCE_GUARD_DRIFT"],
});
const promoteTimeGuardDriftAdapter = memoryAdapter({
  "P0-fixture-one.md": "original one\n",
  "P0-fixture-two.md": "original two\n",
  "docs/project/P0-fictional-refresh-source.json": "source version one\n",
}, null, {
  afterPromote: ({ index, files }) => {
    if (index === 0) files.set("docs/project/P0-fictional-refresh-source.json", "source version three\n");
  },
});
const promoteTimeGuardDriftOutcome = await executeRefreshTransaction(guardedRefreshPlan, promoteTimeGuardDriftAdapter);
assert.equal(promoteTimeGuardDriftOutcome.applied, false);
assert.equal(promoteTimeGuardDriftOutcome.restored, false);
assert.equal(promoteTimeGuardDriftOutcome.sourceGuardsIntact, false);
assert.equal(promoteTimeGuardDriftOutcome.code, "REFRESH_RECOVERY_REQUIRED");
assert.equal(promoteTimeGuardDriftOutcome.causeCode, "REFRESH_SOURCE_GUARD_DRIFT");
assert.equal(promoteTimeGuardDriftOutcome.recoveryJournalRetained, true);
assert.deepEqual(Object.fromEntries(promoteTimeGuardDriftAdapter.files), {
  "P0-fixture-one.md": "new one\n",
  "P0-fixture-two.md": "original two\n",
  "docs/project/P0-fictional-refresh-source.json": "source version three\n",
});
assert.equal(promoteTimeGuardDriftAdapter.staged.size, 2);
recordResult("PC-001-CTL-N07", "source guard drift during promotion preserves current bytes for inspected recovery", "pass", {
  expectedCodes: ["REFRESH_RECOVERY_REQUIRED"],
});
const laterTargetDriftAdapter = memoryAdapter({
  "P0-fixture-one.md": "original one\n",
  "P0-fixture-two.md": "original two\n",
}, null, {
  afterPromote: ({ index, files }) => {
    if (index === 0) files.set("P0-fixture-two.md", "concurrent later target\n");
  },
});
const laterTargetDriftOutcome = await executeRefreshTransaction(refreshPlan, laterTargetDriftAdapter);
assert.equal(laterTargetDriftOutcome.applied, false);
assert.equal(laterTargetDriftOutcome.restored, false);
assert.equal(laterTargetDriftOutcome.recoveryRequired, true);
assert.equal(laterTargetDriftOutcome.recoveryJournalRetained, true);
assert.equal(laterTargetDriftOutcome.code, "REFRESH_RECOVERY_REQUIRED");
assert.equal(laterTargetDriftOutcome.causeCode, "REFRESH_SOURCE_DRIFT");
assert.deepEqual(Object.fromEntries(laterTargetDriftAdapter.files), {
  "P0-fixture-one.md": "new one\n",
  "P0-fixture-two.md": "concurrent later target\n",
});
assert.equal(laterTargetDriftAdapter.staged.size, 2);
recordResult("PC-001-CTL-N07", "later target drift is detected immediately before its promotion", "pass", {
  expectedCodes: ["REFRESH_RECOVERY_REQUIRED"],
});
const promoteTimeTargetMutationAdapter = memoryAdapter({
  "P0-fixture-one.md": "original one\n",
  "P0-fixture-two.md": "original two\n",
}, null, {
  afterPromote: ({ index, files }) => {
    if (index === 1) files.set("P0-fixture-one.md", "concurrent owner bytes\n");
  },
});
const promoteTimeTargetMutationOutcome = await executeRefreshTransaction(refreshPlan, promoteTimeTargetMutationAdapter);
assert.equal(promoteTimeTargetMutationOutcome.applied, false);
assert.equal(promoteTimeTargetMutationOutcome.restored, false);
assert.equal(promoteTimeTargetMutationOutcome.rollbackAttempted, false);
assert.equal(promoteTimeTargetMutationOutcome.stagedEvidenceRetained, true);
assert.equal(promoteTimeTargetMutationOutcome.recoveryJournalRetained, true);
assert.equal(promoteTimeTargetMutationOutcome.code, "REFRESH_RECOVERY_REQUIRED");
assert.equal(promoteTimeTargetMutationOutcome.causeCode, "REFRESH_PROMOTION_HASH");
assert.deepEqual(Object.fromEntries(promoteTimeTargetMutationAdapter.files), {
  "P0-fixture-one.md": "concurrent owner bytes\n",
  "P0-fixture-two.md": "new two\n",
});
assert.equal(promoteTimeTargetMutationAdapter.staged.size, 2);
assert.equal(promoteTimeTargetMutationAdapter.recovery.journal.changes.length, 2);
assert.equal(promoteTimeTargetMutationAdapter.recovery.journal.changes[0].originalContent, "original one\n");
assert.equal(promoteTimeTargetMutationAdapter.recovery.journal.changes[0].intendedContent, "new one\n");
assert.match(promoteTimeTargetMutationOutcome.recoveryJournalFingerprint, /^sha256:[0-9a-f]{64}$/);
assert.deepEqual(promoteTimeTargetMutationOutcome.retainedStagedPaths, [
  "P0-fixture-one.md",
  "P0-fixture-two.md",
]);
recordResult("PC-001-CTL-N07", "promote-time target mutation is preserved and makes rollback non-authorizing", "pass", {
  expectedCodes: ["REFRESH_RECOVERY_REQUIRED"],
});
const missingRecoveryAdapter = memoryAdapter({
  "P0-fixture-one.md": "original one\n",
  "P0-fixture-two.md": "original two\n",
});
delete missingRecoveryAdapter.writeRecoveryJournal;
const missingRecoveryOutcome = await executeRefreshTransaction(refreshPlan, missingRecoveryAdapter);
assert.equal(missingRecoveryOutcome.applied, false);
assert.equal(missingRecoveryOutcome.restored, true);
assert.equal(missingRecoveryOutcome.recoveryRequired, false);
assert.equal(missingRecoveryOutcome.code, "REFRESH_RECOVERY_ADAPTER");
assert.deepEqual(Object.fromEntries(missingRecoveryAdapter.files), {
  "P0-fixture-one.md": "original one\n",
  "P0-fixture-two.md": "original two\n",
});
assert.equal(missingRecoveryAdapter.staged.size, 0);
recordResult("PC-001-CTL-N07", "missing recovery-journal adapter aborts before first promotion", "pass", {
  expectedCodes: ["REFRESH_RECOVERY_ADAPTER"],
});
const successfulAdapter = memoryAdapter({
  "P0-fixture-one.md": "original one\n",
  "P0-fixture-two.md": "original two\n",
});
const successfulRefresh = await executeRefreshTransaction(refreshPlan, successfulAdapter);
assert.equal(successfulRefresh.applied, true);
assert.equal(successfulRefresh.sourceGuardsIntact, true);
assert.equal(successfulRefresh.recoveryRequired, false);
assert.deepEqual(Object.fromEntries(successfulAdapter.files), {
  "P0-fixture-one.md": "new one\n",
  "P0-fixture-two.md": "new two\n",
});
assert.equal(successfulAdapter.staged.size, 0);
assert.equal(successfulAdapter.recovery.journal, null);
recordResult("PC-001-CTL-N07", "verified multi-target refresh success", "pass", { actualCodes: [successfulRefresh.code] });

const deterministicFixture = localFixture();
const deterministicTrusted = trustedFacts(deterministicFixture);
const deterministicA = evaluateReadiness(deterministicFixture, { now: FIXED_NOW, ...deterministicTrusted });
const deterministicB = evaluateReadiness(clone(deterministicFixture), { now: FIXED_NOW, ...clone(deterministicTrusted) });
assert.deepEqual(deterministicA, deterministicB);
assert.equal(canonicalJson({ z: 1, a: { y: 2, x: 3 } }), canonicalJson({ a: { x: 3, y: 2 }, z: 1 }));
const originalCwd = process.cwd();
const originalLang = process.env.LANG;
try {
  process.chdir("/");
  process.env.LANG = "C";
  assert.deepEqual(evaluateReadiness(clone(deterministicFixture), { now: FIXED_NOW, ...clone(deterministicTrusted) }), deterministicA);
} finally {
  process.chdir(originalCwd);
  if (originalLang === undefined) delete process.env.LANG;
  else process.env.LANG = originalLang;
}
recordResult("PC-001-CTL-R01", "pure evaluator is deterministic across repeated calls, cwd, and locale", "pass", {
  sourceFingerprint: deterministicA.normalizedEvidence.sourceFingerprint,
});

const sharedManifestFixture = localFixture();
const sharedManifestValidation = validateTaskFilesManifest({
  taskId: sharedManifestFixture.taskId,
  taskFiles: [...sharedManifestFixture.candidate.taskFiles].reverse(),
  artifacts: sharedManifestFixture.candidate.artifacts,
});
assert.equal(sharedManifestValidation.valid, true);
assert.equal(sharedManifestValidation.sha256, sharedManifestFixture.candidate.taskFilesSha256);
assert.deepEqual(TASK_FILE_DIFF_EXCLUSIONS, [
  APPROVAL_REGISTRY_PATH,
  "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json",
  "docs/project/PHASE1-ROADMAP-MANIFEST.json",
  "docs/project/PHASE1-RELEASE-PLAN.md",
  "outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx",
]);
assert.deepEqual(TASK_FILE_DESCENDANT_DELTA_PATHS, [
  ...TASK_FILE_DIFF_EXCLUSIONS,
  STAGE_APPROVAL_REGISTRY_PATH,
  "docs/council/execution/P0-OWNER-ACTION-STATE.json",
]);
assert.deepEqual(TASK_FILE_RUNTIME_DESCENDANT_DELTA_PATHS, [
  ...TASK_FILE_DESCENDANT_DELTA_PATHS,
  "docs/council/execution/P0-STAGE0-CONTROL-INTEGRITY.json",
  "RUNNING_LOG.md",
]);
assert.notStrictEqual(TASK_FILE_DIFF_EXCLUSIONS, TASK_FILE_DESCENDANT_DELTA_PATHS);
assert.notStrictEqual(TASK_FILE_DESCENDANT_DELTA_PATHS, TASK_FILE_RUNTIME_DESCENDANT_DELTA_PATHS);
assert.equal(Object.isFrozen(TASK_FILE_DIFF_EXCLUSIONS), true);
assert.equal(Object.isFrozen(TASK_FILE_DESCENDANT_DELTA_PATHS), true);
assert.equal(Object.isFrozen(TASK_FILE_RUNTIME_DESCENDANT_DELTA_PATHS), true);
recordResult("PC-001-CTL-R01", "shared task-file schema has five candidate exclusions, seven projected descendants, and nine runtime-trusted descendants", "pass", {
  taskFilesSha256: sharedManifestValidation.sha256,
});

assert.equal(Object.isFrozen(LOCAL_SYNTHETIC_CONTENT_POLICY), true);
assert.deepEqual(LOCAL_SYNTHETIC_CONTENT_POLICY.workbookExtensions, [".xlsx"]);
assert.deepEqual(LOCAL_SYNTHETIC_CONTENT_POLICY.workbookPurposes, ["evidence"]);
for (const [extension, entry, expectedContentClass] of [
  [".yml", { path: "config/P0-PC-001-config.yml", purpose: "implementation" }, "text"],
  [".md", { path: "docs/work-items/PC-001/P0-PC-001-PRD.md", purpose: "artifact:product" }, "text"],
  [".json", { path: "tools/P0-PC-001-evidence.json", purpose: "evidence" }, "text"],
  [".mjs", { path: "tools/P0-readiness-gates.mjs", purpose: "implementation" }, "text"],
  [".xlsx", { path: "docs/council/execution/releases/P0-PC-001-REVIEW.xlsx", purpose: "evidence" }, "xlsx-workbook"],
]) {
  const classification = classifyLocalSyntheticTaskFile(entry);
  assert.deepEqual(classification, {
    allowed: true,
    contentClass: expectedContentClass,
    extension,
    requiredByteChecks: [...LOCAL_SYNTHETIC_CONTENT_POLICY.byteChecksByContentClass[expectedContentClass]],
    reasonCode: null,
  });
  recordResult("PC-001-CTL-R01", `closed local content policy classifies ${extension}`, "pass", {
    contentClass: expectedContentClass,
    requiredByteChecks: classification.requiredByteChecks,
  });
}

const postCandidateOwnerActionFixture = singletonReleaseFixture();
const postCandidateOwnerActionTrusted = trustedFacts(postCandidateOwnerActionFixture);
assert.equal(TASK_FILE_DESCENDANT_DELTA_PATHS.includes("docs/council/execution/P0-OWNER-ACTION-STATE.json"), true);
assert.equal(TASK_FILE_DESCENDANT_DELTA_PATHS.includes("docs/council/execution/P0-STAGE0-CONTROL-INTEGRITY.json"), false);
assert.equal(TASK_FILE_DESCENDANT_DELTA_PATHS.includes("RUNNING_LOG.md"), false);
assert.equal(TASK_FILE_RUNTIME_DESCENDANT_DELTA_PATHS.includes("docs/council/execution/P0-STAGE0-CONTROL-INTEGRITY.json"), true);
assert.equal(TASK_FILE_RUNTIME_DESCENDANT_DELTA_PATHS.includes("RUNNING_LOG.md"), true);
assert.equal(evaluateReadiness(postCandidateOwnerActionFixture, {
  now: FIXED_NOW,
  ...postCandidateOwnerActionTrusted,
}).executionAllowed, true);
recordResult("PC-001-CTL-R01", "verified owner-action publication is permitted after candidate review", "pass");

const projectionMergeFixture = retargetTaskFixture(activationFixture, {
  taskId: "UX-R0-001", milestone: "R0", scopeClass: "local-synthetic", actionClass: "synthetic-foundation",
});
const projectionMergeTrusted = trustedFacts(projectionMergeFixture);
assert.equal(Object.hasOwn(projectionMergeTrusted.candidatePublication, "currentTaskFilesRevision"), false);
assert.equal(Object.hasOwn(projectionMergeTrusted.candidatePublication, "currentDescendantDeltaPaths"), false);
const projectionApprovalResult = evaluateReadiness(projectionMergeFixture, {
  now: FIXED_NOW,
  ...projectionMergeTrusted,
  phase: "approval",
});
const legacyVolatileTrusted = clone(projectionMergeTrusted);
legacyVolatileTrusted.candidatePublication.currentTaskFilesRevision = ACTIVATION_REVISION;
legacyVolatileTrusted.candidatePublication.currentDescendantDeltaPaths = [...TASK_FILE_DESCENDANT_DELTA_PATHS];
const legacyVolatileResult = evaluateReadiness(projectionMergeFixture, {
  now: FIXED_NOW,
  ...legacyVolatileTrusted,
  phase: "approval",
});
assert.equal(projectionApprovalResult.executionAllowed, true);
assert.equal(legacyVolatileResult.executionAllowed, true);
assert.deepEqual(legacyVolatileResult.normalizedEvidence, projectionApprovalResult.normalizedEvidence);
const postProjectionHead = "d".repeat(40);
Object.assign(projectionMergeTrusted.activation, {
  headRevision: postProjectionHead,
  originMainRevision: postProjectionHead,
  externalSyncSourceRevision: postProjectionHead,
  taskFilesVerifiedAtRevision: postProjectionHead,
});
const projectionMergeResult = evaluateReadiness(projectionMergeFixture, {
  now: FIXED_NOW,
  ...projectionMergeTrusted,
  phase: "activation",
});
assert.equal(projectionMergeResult.executionAllowed, true, failedCodes(projectionMergeResult).join(", "));
assert.equal(Object.hasOwn(projectionMergeResult.normalizedEvidence, "currentTaskFilesRevision"), false);
assert.equal(Object.hasOwn(projectionMergeResult.normalizedEvidence, "currentDescendantDeltaPaths"), false);
assert.equal(projectionMergeResult.normalizedEvidence.publishedTaskFileContentClassesVerified, true);
assert.equal(projectionMergeResult.normalizedEvidence.currentTaskFileContentClassesVerified, true);
recordResult("PC-001-CTL-R01", "projection merge advances exact-main activation without persisted revision or delta self-reference", "pass");

const appendOnlyFixture = singletonLocalFixture();
const appendOnlyTrusted = trustedFacts(appendOnlyFixture);
assert.notEqual(appendOnlyTrusted.approvalPublication.registrySha256, appendOnlyTrusted.approvalPublication.currentRegistrySha256);
assert.equal(evaluateReadiness(appendOnlyFixture, { now: FIXED_NOW, ...appendOnlyTrusted }).executionAllowed, true);
recordResult("PC-001-CTL-R01", "unrelated approval-registry append preserves an unchanged canonical per-task approval", "pass", {
  taskApprovalSha256: appendOnlyTrusted.approvalPublication.publishedTaskApprovalSha256,
});

const planningDigest = computeDossierDigest({
  taskId: "PC-001",
  revision: "d44dbfbc8d040baddf46b7288476d4dc53c81e8c",
  artifacts: {
    product: { path: "docs/work-items/PC-001/P0-PC-001-PRD.md", sha256: "68ab74c94226a4ee650d1cb89929abe85941bdef3acabac50fa846e048f23f27" },
    architecture: { path: "docs/work-items/PC-001/P0-PC-001-TECHNICAL-PLAN.md", sha256: "43367fff28fa07042de795c6a90af7cbe4c9a3721d1e797c20fbbf257ffacfcf" },
    design: { path: "docs/work-items/PC-001/P0-PC-001-DESIGN-SPEC.md", sha256: "5f5343a528313f000b0b22ea9c02aa3d17e449b84ad7c5fed3e84999debb09e2" },
    qa: { path: "docs/work-items/PC-001/P0-PC-001-QA-PLAN.md", sha256: "c7a8f4c346e3715f8ea015fcb9f96a07b3327d68b38e7e9b18115e3c167e5bfb" },
    delivery: { path: "docs/work-items/PC-001/P0-PC-001-DELIVERY-CHECKLIST.md", sha256: "ddd11117218c3c65428e4743b62d7677c1f90d024b3b7817f5bbc6788f4c5b8d" },
    council: { path: "docs/work-items/PC-001/P0-PC-001-COUNCIL-READINESS.md", sha256: "b01136fe1979d079157a8cedfbfcdb4d361a18016e9d7b2b9bbeedc1c726a1ff" },
  },
});
assert.equal(planningDigest, "sha256:32deebe971b1321a7ccd4203d4c861d93c4ec3d45ba3bf4c9fab2ea048b9eaed");
recordResult("PC-001-CTL-R01", "canonical dossier digest remains compatible with the accepted planning packet", "pass", {
  dossierDigest: planningDigest,
});

assertNegative("PC-001-CTL-R01.schema", "unknown schema fails closed", localFixture,
  (fixture) => { fixture.schemaVersion = "99.0.0"; }, ["SCHEMA_VERSION"]);

const registerPath = path.join(repoRoot, "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json");
if (fs.existsSync(registerPath)) {
  const register = parseJsonWithoutDuplicateKeys(
    fs.readFileSync(registerPath, "utf8"),
    "P0 task-artifact register",
  );
  assert.equal(register.tasks?.length, 58, "R01 baseline task count changed");
  assert.equal(register.tasks?.filter((task) => task.artifactReadiness === "Incomplete").length, 58, "R01 baseline readiness changed");
  assert.equal(register.tasks?.filter((task) => task.executionAllowed === true).length, 0, "R01 baseline permission changed");
  const proposalPacketTaskIds = new Set(["PC-001", ...P0_R0_SUBSTANTIVE_TASK_IDS]);
  const observedArtifactStateCounts = { draft: 0, "in-review": 0 };
  const inReviewTaskIds = [];
  for (const task of register.tasks) {
    assert.deepEqual(
      Object.keys(task.artifacts ?? {}).sort(),
      [...ARTIFACT_KINDS].sort(),
      `${task.taskId} artifact packet changed`,
    );
    const packetStates = [...new Set(ARTIFACT_KINDS.map((kind) => task.artifacts[kind]?.contentState))];
    assert.equal(packetStates.length, 1, `${task.taskId} artifact packet is not homogeneous`);
    const [packetState] = packetStates;
    assert(["draft", "in-review"].includes(packetState), `${task.taskId} artifact packet state changed`);
    if (packetState === "in-review") {
      assert(proposalPacketTaskIds.has(task.taskId), `${task.taskId} cannot publish an in-review proposal packet`);
      inReviewTaskIds.push(task.taskId);
    }
    observedArtifactStateCounts[packetState] += ARTIFACT_KINDS.length;
  }
  assert(inReviewTaskIds.includes("PC-001"), "PC-001 planning packet left In-review");
  assert.equal(observedArtifactStateCounts.draft + observedArtifactStateCounts["in-review"], 348,
    "R01 artifact packet count changed");
  assert.equal(register.summary?.artifactStateCounts?.draft, observedArtifactStateCounts.draft,
    "R01 Draft artifact summary changed");
  assert.equal(register.summary?.artifactStateCounts?.["in-review"], observedArtifactStateCounts["in-review"],
    "R01 In-review artifact summary changed");
  for (const state of ["missing", "approved", "blocked", "not-applicable"]) {
    assert.equal(register.summary?.artifactStateCounts?.[state], 0, `R01 ${state} artifact count changed`);
  }
  recordResult("PC-001-CTL-R01", "live 58/348 all-Hold proposal-packet projection", "pass", {
    tasks: 58,
    incomplete: 58,
    executionAllowed: 0,
    draft: observedArtifactStateCounts.draft,
    inReview: observedArtifactStateCounts["in-review"],
    inReviewTaskIds: inReviewTaskIds.sort(),
  });
}

const joinFixtureParts = (...parts) => parts.join("");
const fieldSentinel = (field) => joinFixtureParts("FICTIONAL_", field, "_FIELD_", "SENTINEL");
const safetyCases = [
  ["credential", joinFixtureParts("FICTIONAL_CREDENTIAL_", "SENTINEL")],
  ["credentials", fieldSentinel("CREDENTIALS")],
  ["secret", fieldSentinel("SECRET")],
  ["privateKey", joinFixtureParts("-----BEGIN ", "PRIVATE ", "KEY-----")],
  ["privateUrl", joinFixtureParts("ht", "tps://PRIVATE_", "URL_SENTINEL.invalid")],
  ["host", joinFixtureParts("PRIVATE_", "HOST_SENTINEL")],
  ["accountId", joinFixtureParts("PRIVATE_", "ACCOUNT_SENTINEL")],
  ["topology", joinFixtureParts("PRIVATE_", "TOPOLOGY_SENTINEL")],
  ["projectNodeId", joinFixtureParts("PROJECT_", "NODE_ID_SENTINEL")],
  ["recoveryValue", joinFixtureParts("RECOVERY_", "VALUE_SENTINEL")],
  ["rawResponse", joinFixtureParts("RAW_", "RESPONSE_SENTINEL")],
  ["authenticJournal", joinFixtureParts("AUTHENTIC_", "JOURNAL_SENTINEL")],
  ["photo", joinFixtureParts("AUTHENTIC_", "PHOTO_SENTINEL")],
  ["photoDerived", joinFixtureParts("AUTHENTIC_", "MEDIA_SENTINEL")],
  ["token", fieldSentinel("TOKEN")],
  ["accessToken", fieldSentinel("ACCESS_TOKEN")],
  ["refreshToken", fieldSentinel("REFRESH_TOKEN")],
  ["authToken", fieldSentinel("AUTH_TOKEN")],
  ["password", fieldSentinel("PASSWORD")],
  ["apiKey", fieldSentinel("API_KEY")],
  ["accessKey", fieldSentinel("ACCESS_KEY")],
  ["secretKey", fieldSentinel("SECRET_KEY")],
  ["clientSecret", fieldSentinel("CLIENT_SECRET")],
  ["signingKey", fieldSentinel("SIGNING_KEY")],
  ["encryptionKey", fieldSentinel("ENCRYPTION_KEY")],
  ["recoveryKey", fieldSentinel("RECOVERY_KEY")],
  ["passphrase", fieldSentinel("PASSPHRASE")],
  ["key", fieldSentinel("GENERIC_KEY")],
  ["authorization", fieldSentinel("AUTHORIZATION")],
  ["value", joinFixtureParts(["github", "pat", ""].join("_"), "FICTIONAL0123456789ABCDEF")],
  ["value", joinFixtureParts("gh", "p_", "FICTIONAL0123456789")],
  ["value", joinFixtureParts("gh", "o_", "FICTIONAL0123456789")],
  ["value", joinFixtureParts("gh", "u_", "FICTIONAL0123456789")],
  ["value", joinFixtureParts("gh", "s_", "FICTIONAL0123456789")],
  ["value", joinFixtureParts("gh", "r_", "FICTIONAL0123456789")],
  ["value", joinFixtureParts("Bear", "er ", "FICTIONAL0123456789.TOKEN")],
  ["value", joinFixtureParts("xo", "xb-", "FICTIONAL-0123456789")],
  ["value", joinFixtureParts("s", "k-", "FICTIONAL0123456789")],
  ["value", joinFixtureParts("s", "k-", "proj-", "FICTIONAL_0123456789")],
  ["value", joinFixtureParts("s", "k_", "proj_", "FICTIONAL-0123456789")],
  ["value", joinFixtureParts("AK", "IA", "FICTIONAL0123456789")],
];
for (const [key, sentinel] of safetyCases) {
  const fixture = localFixture();
  fixture.injected = { [key]: sentinel };
  const actual = evaluateReadiness(fixture, { now: FIXED_NOW, ...trustedFacts(fixture) });
  assert.equal(actual.executionAllowed, false, `PC-001-CTL-S01: ${key} unexpectedly permitted`);
  assert.ok(failedCodes(actual).includes("PUBLIC_SAFETY"), `PC-001-CTL-S01: ${key} lacked PUBLIC_SAFETY`);
  assert.ok(!JSON.stringify(actual).includes(sentinel), `PC-001-CTL-S01: ${key} sentinel leaked into output`);
  recordResult("PC-001-CTL-S01", `reject public-safety sentinel: ${key}`, "pass", { expectedCodes: ["PUBLIC_SAFETY"] });
}
assertNegative("PC-001-CTL-S01.media", "authentic-media access flag rejects", localFixture,
  (fixture) => { fixture.safety.authenticMediaAccessed = true; }, ["AUTHENTIC_MEDIA_EXCLUSION"]);
assertNegative("PC-001-CTL-S01.network", "private-network access flag rejects", localFixture,
  (fixture) => { fixture.safety.privateNetworkAccessed = true; }, ["PRIVATE_NETWORK_EXCLUSION"]);

function preparationTaskContractSha256({ taskId, dependencyIds, acceptanceScenarioIds }) {
  return computeTaskContractSha256({
    taskId,
    outcome: "Prove one fictional synthetic preparation contract.",
    requirementIds: ["LID-SCP-001", "LID-OPS-001"],
    dependencyIds,
    acceptanceEvidence: "Synthetic preparation evidence.",
    acceptanceScenarioIds,
  });
}

function preparationFixture({
  deliveryTransition = false,
  taskId = "SPK-R0-001",
  milestone = "R0",
  candidateRevision = CANDIDATE_REVISION,
  baseRevision = BASE_REVISION,
  acceptanceScenarioIds = [`${taskId}-P-001`, `${taskId}-QA-001`],
} = {}) {
  const stageId = deliveryTransition
    ? `P0-STAGE-${taskId}-STATUS-DELIVERY-TRANSITION`
    : `P0-STAGE-${taskId}-SYNTHETIC-001`;
  const preparationReviewId = deliveryTransition
    ? `P0-PREP-${taskId}-STATUS-DELIVERY-TRANSITION`
    : `P0-PREP-${taskId}-SYNTHETIC-001`;
  const base = localFixture();
  const dependencyIds = ["PC-001"];
  const taskContractSha256 = preparationTaskContractSha256({
    taskId,
    dependencyIds,
    acceptanceScenarioIds,
  });
  const artifacts = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
    path: `docs/work-items/${taskId}/P0-${taskId}-${kind}.md`,
    sha256: sha256(`fictional ${taskId} ${kind} proposal bytes\n`),
    contentState: "in-review",
  }]));
  const source = {
    schemaVersion: TASK_PREPARATION_SCHEMA_VERSION,
    preparationReviewId,
    taskId,
    milestone,
    taskContractSha256,
    stageId,
    requestedScope: {
      scopeClass: deliveryTransition ? DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass : "local-synthetic",
      actionClass: deliveryTransition ? DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass : "synthetic-foundation",
    },
    candidate: {
      revision: candidateRevision,
      baseRevision,
      dossierDigest: null,
      artifacts,
    },
    dependencyIds,
    dependencyEvidence: [{
      dependencyId: "PC-001",
      result: "pass",
      evidenceReference: `dependency:${taskId}-PC-001`,
    }],
    acceptanceScenarioIds,
    proposalAuthorIds: [...P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS],
    proposalAuthorEvidence: {
      proposalAuthorIds: [...P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS],
      candidateRevision,
      evidenceReference: `authors:${taskId}-proposal`,
      attestationDigest: null,
    },
    artifactReviews: {},
    council: {
      verdict: "ready-to-prepare",
      reviewedRevision: candidateRevision,
      dossierDigest: null,
      unresolvedBlockers: [],
      seatVerdicts: {},
    },
    reviewerRegistry: clone(base.reviewerRegistry),
    openDecisions: [],
    specialistVetoes: [],
    safety: {
      authenticMediaAccessed: false,
      privateNetworkAccessed: false,
      externalMutationPerformed: false,
    },
  };
  source.candidate.dossierDigest = computePreparationDossierDigest(source);
  source.proposalAuthorEvidence.attestationDigest = computePreparationProposalAuthorAttestationDigest({
    preparationReviewId,
    taskId,
    stageId,
    candidateRevision: source.candidate.revision,
    dossierDigest: source.candidate.dossierDigest,
    proposalAuthorIds: source.proposalAuthorIds,
    evidenceReference: source.proposalAuthorEvidence.evidenceReference,
  });
  for (const kind of ARTIFACT_KINDS) {
    const role = roleByArtifact[kind];
    const review = {
      reviewerId: reviewerIdForRole(role),
      reviewerRole: role,
      decision: "approved",
      reviewedRevision: candidateRevision,
      dossierDigest: source.candidate.dossierDigest,
      artifactSha256: artifacts[kind].sha256,
      evidenceReference: `review:${taskId}-${kind}-proposal`,
      attestationDigest: null,
    };
    review.attestationDigest = computeStageCouncilAttestationDigest({
      gateKind: "gate-a-prepare",
      preparationReviewId,
      taskId,
      stageId,
      subject: `artifact:${kind}`,
      decision: review.decision,
      reviewerId: review.reviewerId,
      reviewerRole: review.reviewerRole,
      reviewedRevision: review.reviewedRevision,
      dossierDigest: review.dossierDigest,
      artifactSha256: review.artifactSha256,
      scopeClass: source.requestedScope.scopeClass,
      actionClass: source.requestedScope.actionClass,
      evidenceReference: review.evidenceReference,
    });
    source.artifactReviews[kind] = review;
  }
  source.council.dossierDigest = source.candidate.dossierDigest;
  for (const seat of COUNCIL_SEATS) {
    const role = roleBySeat[seat];
    const record = {
      reviewerId: reviewerIdForRole(role),
      reviewerRole: role,
      verdict: "approve-preparation-candidate",
      reviewedRevision: candidateRevision,
      dossierDigest: source.candidate.dossierDigest,
      preparationReviewId,
      stageId,
      evidenceReference: `seat:${taskId}-${seat}-preparation`,
      attestationDigest: null,
    };
    record.attestationDigest = computeStageCouncilAttestationDigest({
      gateKind: "gate-a-prepare",
      preparationReviewId,
      taskId,
      stageId,
      subject: `council:${seat}`,
      decision: record.verdict,
      reviewerId: record.reviewerId,
      reviewerRole: record.reviewerRole,
      reviewedRevision: record.reviewedRevision,
      dossierDigest: record.dossierDigest,
      scopeClass: source.requestedScope.scopeClass,
      actionClass: source.requestedScope.actionClass,
      evidenceReference: record.evidenceReference,
    });
    source.council.seatVerdicts[seat] = record;
  }
  return {
    source,
    context: {
      expectedTask: {
        taskId,
        milestone,
        dependencyIds,
        acceptanceScenarioIds: [...source.acceptanceScenarioIds],
        taskContractSha256,
      },
      candidatePublication: {
        revision: candidateRevision,
        baseRevision,
        bytesVerified: true,
        fullDiffVerified: true,
        candidateOnFetchedMain: true,
      },
    },
  };
}

function assertPreparationNegative(name, mutate, expectedCode) {
  const fixture = preparationFixture();
  mutate(fixture.source, fixture.context);
  const actual = evaluateTaskPreparationGateA(fixture.source, fixture.context);
  assert.equal(actual.preparationAllowed, false, `${name}: Gate A unexpectedly passed`);
  assert.equal(actual.executionAllowed, false, `${name}: Gate A created execution permission`);
  assert.ok(failedCodes(actual).includes(expectedCode), `${name}: missing ${expectedCode}; got ${failedCodes(actual).join(", ")}`);
  recordResult("PC-001-CTL-P04", name, "pass", { expectedCodes: [expectedCode] });
}

function resealPreparationFixture(fixture) {
  const { source, context } = fixture;
  source.candidate.dossierDigest = computePreparationDossierDigest(source);
  source.proposalAuthorEvidence.proposalAuthorIds = [...source.proposalAuthorIds];
  source.proposalAuthorEvidence.candidateRevision = source.candidate.revision;
  source.proposalAuthorEvidence.attestationDigest = computePreparationProposalAuthorAttestationDigest({
    preparationReviewId: source.preparationReviewId,
    taskId: source.taskId,
    stageId: source.stageId,
    candidateRevision: source.candidate.revision,
    dossierDigest: source.candidate.dossierDigest,
    proposalAuthorIds: source.proposalAuthorIds,
    evidenceReference: source.proposalAuthorEvidence.evidenceReference,
  });
  for (const kind of ARTIFACT_KINDS) {
    const review = source.artifactReviews[kind];
    review.reviewedRevision = source.candidate.revision;
    review.dossierDigest = source.candidate.dossierDigest;
    review.artifactSha256 = source.candidate.artifacts[kind].sha256;
    review.attestationDigest = computeStageCouncilAttestationDigest({
      gateKind: "gate-a-prepare",
      preparationReviewId: source.preparationReviewId,
      taskId: source.taskId,
      stageId: source.stageId,
      subject: `artifact:${kind}`,
      decision: review.decision,
      reviewerId: review.reviewerId,
      reviewerRole: review.reviewerRole,
      reviewedRevision: review.reviewedRevision,
      dossierDigest: review.dossierDigest,
      artifactSha256: review.artifactSha256,
      scopeClass: source.requestedScope.scopeClass,
      actionClass: source.requestedScope.actionClass,
      evidenceReference: review.evidenceReference,
    });
  }
  source.council.reviewedRevision = source.candidate.revision;
  source.council.dossierDigest = source.candidate.dossierDigest;
  for (const seat of COUNCIL_SEATS) {
    const record = source.council.seatVerdicts[seat];
    record.reviewedRevision = source.candidate.revision;
    record.dossierDigest = source.candidate.dossierDigest;
    record.preparationReviewId = source.preparationReviewId;
    record.stageId = source.stageId;
    record.attestationDigest = computeStageCouncilAttestationDigest({
      gateKind: "gate-a-prepare",
      preparationReviewId: source.preparationReviewId,
      taskId: source.taskId,
      stageId: source.stageId,
      subject: `council:${seat}`,
      decision: record.verdict,
      reviewerId: record.reviewerId,
      reviewerRole: record.reviewerRole,
      reviewedRevision: record.reviewedRevision,
      dossierDigest: record.dossierDigest,
      scopeClass: source.requestedScope.scopeClass,
      actionClass: source.requestedScope.actionClass,
      evidenceReference: record.evidenceReference,
    });
  }
  context.expectedTask = {
    taskId: source.taskId,
    milestone: source.milestone,
    dependencyIds: [...source.dependencyIds],
    acceptanceScenarioIds: [...source.acceptanceScenarioIds],
    taskContractSha256: preparationTaskContractSha256({
      taskId: source.taskId,
      dependencyIds: source.dependencyIds,
      acceptanceScenarioIds: source.acceptanceScenarioIds,
    }),
  };
  source.taskContractSha256 = context.expectedTask.taskContractSha256;
  context.candidatePublication.revision = source.candidate.revision;
  context.candidatePublication.baseRevision = source.candidate.baseRevision;
  return fixture;
}

assert.deepEqual(P0_R0_SCOPE_TASK_IDS, [
  "AUD-001", "PC-001", "PRD-R0-001", "SPK-R0-001", "UX-R0-001", "ARCH-R0-001", "ENG-R0-001", "REL-R0-001",
]);
assert.deepEqual(P0_R0_SUBSTANTIVE_TASK_IDS, ["SPK-R0-001", "UX-R0-001", "ARCH-R0-001", "ENG-R0-001", "REL-R0-001"]);
assert.deepEqual(STAGE_LIFECYCLE_STATES, [
  "declared", "ready", "running", "verification-pending", "recovery-required", "rolling-back",
  "verified-complete", "verified-rolled-back", "cancelled-before-mutation", "blocked-no-mutation", "expired-before-mutation",
]);
recordResult("PC-001-CTL-P04", "bounded P0/R0 task and stage-state vocabularies are exact", "pass");

const preparationPositive = preparationFixture();
const preparationResult = evaluateTaskPreparationGateA(preparationPositive.source, preparationPositive.context);
assert.equal(preparationResult.preparationAllowed, true, failedCodes(preparationResult).join(", "));
assert.equal(preparationResult.executionAllowed, false, "Gate A must never create execution permission");
assert.equal(preparationResult.decision, "Ready to prepare — Gate A");
assert.deepEqual(preparationResult.normalizedEvidence.preparationBounds, ["local", "public", "fictional", "synthetic"]);
assert.equal(preparationResult.normalizedEvidence.privateActionsAllowed, false);
recordResult("PC-001-CTL-P04", "Gate A permits only exact local/public/fictional/synthetic candidate preparation", "pass", {
  decision: preparationResult.decision,
  sourceFingerprint: preparationResult.normalizedEvidence.sourceFingerprint,
});
const transitionPreparation = preparationFixture({ deliveryTransition: true });
const transitionPreparationResult = evaluateTaskPreparationGateA(transitionPreparation.source, transitionPreparation.context);
assert.equal(transitionPreparationResult.preparationAllowed, true, failedCodes(transitionPreparationResult).join(", "));
assert.equal(transitionPreparationResult.executionAllowed, false, "transition Gate A must remain preparation-only");
assert.equal(transitionPreparationResult.normalizedEvidence.privateActionsAllowed, false);
assert.equal(transitionPreparationResult.normalizedEvidence.externalMutationsAllowed, false);
recordResult("PC-001-CTL-P04", "Gate A can prepare the dedicated transition proposal but grants no private or external authority", "pass", {
  decision: transitionPreparationResult.decision,
  sourceFingerprint: transitionPreparationResult.normalizedEvidence.sourceFingerprint,
});
const wrongTransitionPreparation = preparationFixture({ deliveryTransition: true });
wrongTransitionPreparation.source.requestedScope = { scopeClass: "local-synthetic", actionClass: "synthetic-foundation" };
const wrongTransitionPreparationResult = evaluateTaskPreparationGateA(
  wrongTransitionPreparation.source,
  wrongTransitionPreparation.context,
);
assert.equal(wrongTransitionPreparationResult.preparationAllowed, false);
assert.ok(failedCodes(wrongTransitionPreparationResult).includes("PREP_SCOPE_ACTION"));
recordResult("PC-001-CTL-P04", "delivery-transition Gate A rejects a generic task scope and action", "pass", {
  expectedCodes: ["PREP_SCOPE_ACTION"],
});
assertPreparationNegative("Gate A rejects an unknown top-level field", (source) => { source.executionAllowed = true; }, "PREP_SCHEMA");
assertPreparationNegative("Gate A rejects private-network access", (source) => { source.safety.privateNetworkAccessed = true; }, "PREP_LOCAL_ONLY");
assertPreparationNegative("Gate A rejects external mutation", (source) => { source.safety.externalMutationPerformed = true; }, "PREP_LOCAL_ONLY");
assertPreparationNegative("Gate A rejects a missing Council seat", (source) => { delete source.council.seatVerdicts.qa; }, "PREP_COUNCIL");
assertPreparationNegative("Gate A rejects a stale proposal candidate", (_source, context) => { context.candidatePublication.bytesVerified = false; }, "PREP_PUBLICATION");
assertPreparationNegative("Gate A rejects a tampered seat attestation", (source) => { source.council.seatVerdicts.design.attestationDigest = `sha256:${"0".repeat(64)}`; }, "PREP_SEAT_DESIGN");
assertPreparationNegative("Gate A rejects a task-mismatched preparation review ID", (source, context) => {
  source.preparationReviewId = "P0-PREP-UX-R0-001-SYNTHETIC-001";
  resealPreparationFixture({ source, context });
}, "PREP_REVIEW_ID");
assertPreparationNegative("Gate A rejects self-claimed approved proposal artifacts", (source) => {
  source.candidate.artifacts.product.contentState = "approved";
}, "PREP_ARTIFACT_SET");
assertPreparationNegative("Gate A rejects an omitted code-owned proposal author", (source, context) => {
  source.proposalAuthorIds = [];
  resealPreparationFixture({ source, context });
}, "PREP_PROPOSAL_AUTHORS");
assertPreparationNegative("Gate A rejects an additional proposal author", (source, context) => {
  source.proposalAuthorIds.push("implementer-controls");
  resealPreparationFixture({ source, context });
}, "PREP_PROPOSAL_AUTHORS");
assertPreparationNegative("Gate A rejects a duplicated proposal author", (source, context) => {
  source.proposalAuthorIds.push(P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0]);
  resealPreparationFixture({ source, context });
}, "PREP_PROPOSAL_AUTHORS");
assertPreparationNegative("Gate A rejects an unregistered code-owned proposal author", (source) => {
  source.reviewerRegistry.reviewers = source.reviewerRegistry.reviewers.filter((reviewer) => (
    reviewer.reviewerId !== P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0]
  ));
}, "PREP_PROPOSAL_AUTHORS");
assertPreparationNegative("Gate A rejects proposal-author Council overlap", (source, context) => {
  source.council.seatVerdicts.product.reviewerId = P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0];
  source.council.seatVerdicts.product.reviewerRole = "implementation";
  resealPreparationFixture({ source, context });
}, "PREP_SEAT_INDEPENDENCE");
assertPreparationNegative("Gate A rejects a nested execution authority safety claim", (source) => {
  source.safety.executionAllowed = true;
}, "PREP_LOCAL_ONLY");
assertPreparationNegative("Gate A rejects a nested private authority safety claim", (source) => {
  source.safety.privateActionsAllowed = true;
}, "PREP_LOCAL_ONLY");
assertPreparationNegative("Gate A rejects a nested Council execution claim", (source) => {
  source.council.executionAllowed = true;
}, "PREP_COUNCIL");
assertPreparationNegative("Gate A rejects an extra artifact-review kind", (source) => {
  source.artifactReviews.execution = {};
}, "PREP_ARTIFACT_SET");
assertPreparationNegative("Gate A rejects dependency-evidence sibling fields", (source) => {
  source.dependencyEvidence[0].executionAllowed = true;
}, "PREP_DEPENDENCIES");
assertPreparationNegative("Gate A rejects historical PC-001", (source, context) => {
  source.taskId = "PC-001";
  context.expectedTask.taskId = "PC-001";
}, "PREP_SCOPE_TASK");

function gateAProofResult(evaluation) {
  return {
    preparationAllowed: evaluation.preparationAllowed,
    executionAllowed: evaluation.executionAllowed,
    decision: evaluation.decision,
    blockers: clone(evaluation.blockers),
    preparationBounds: [...evaluation.normalizedEvidence.preparationBounds],
    privateActionsAllowed: evaluation.normalizedEvidence.privateActionsAllowed,
    externalMutationsAllowed: evaluation.normalizedEvidence.externalMutationsAllowed,
    taskContractSha256: evaluation.normalizedEvidence.taskContractSha256,
    sourceFingerprint: evaluation.normalizedEvidence.sourceFingerprint,
  };
}

function preparationReviewFromGateA(fixture) {
  const { source, context } = fixture;
  const evaluation = evaluateTaskPreparationGateA(source, context);
  assert.equal(evaluation.preparationAllowed, true, failedCodes(evaluation).join(", "));
  return {
    preparationReviewId: source.preparationReviewId,
    taskId: source.taskId,
    stageId: source.stageId,
    state: "accepted",
    scopeClass: source.requestedScope.scopeClass,
    actionClass: source.requestedScope.actionClass,
    gateAProof: {
      input: clone(source),
      context: clone(context),
      result: gateAProofResult(evaluation),
    },
    proposalCandidate: {
      revision: source.candidate.revision,
      baseRevision: source.candidate.baseRevision,
      dossierDigest: source.candidate.dossierDigest,
      artifactBindings: Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
        path: source.candidate.artifacts[kind].path,
        sha256: source.candidate.artifacts[kind].sha256,
      }])),
    },
    reviewerRegistrySha256: computeReviewerRegistrySha256(source.reviewerRegistry),
    councilSeatAttestations: Object.fromEntries(COUNCIL_SEATS.map((seat) => [seat, {
      ...clone(source.council.seatVerdicts[seat]),
      scopeClass: source.requestedScope.scopeClass,
      actionClass: source.requestedScope.actionClass,
    }])),
    evidenceReference: `preparation:${source.preparationReviewId}`,
  };
}

function normalizeStageDossierBindings(fixture) {
  const rawDossierDigest = computeDossierDigest({
    taskId: fixture.taskId,
    revision: fixture.candidate.revision,
    baseRevision: fixture.candidate.baseRevision,
    artifacts: fixture.candidate.artifacts,
    taskFilesSha256: fixture.candidate.taskFilesSha256,
  }).slice("sha256:".length);
  fixture.candidate.dossierDigest = rawDossierDigest;
  for (const kind of ARTIFACT_KINDS) {
    const review = fixture.artifactReviews[kind];
    review.dossierDigest = rawDossierDigest;
    review.attestationDigest = computeAttestationDigest({
      taskId: fixture.taskId,
      subjectType: "artifact",
      subject: kind,
      decision: review.decision,
      reviewerId: review.reviewerId,
      reviewerRole: review.reviewerRole,
      reviewedRevision: review.reviewedRevision,
      dossierDigest: review.dossierDigest,
      artifactSha256: review.artifactSha256,
      evidenceReference: review.evidenceReference,
      notApplicableRationale: review.notApplicableRationale,
      specialistConcurrence: review.specialistConcurrence,
    });
  }
  return fixture;
}

function stageGateBFixture({ deliveryTransition = false, taskId = "SPK-R0-001", milestone = "R0" } = {}) {
  const taskInput = retargetTaskFixture(localFixture, {
    taskId,
    milestone,
    scopeClass: deliveryTransition ? DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass : "local-synthetic",
    actionClass: deliveryTransition ? DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass : "synthetic-foundation",
    completeDueActions: false,
  });
  if (deliveryTransition) {
    const implementationEntry = taskInput.candidate.taskFiles.find((entry) => entry.purpose === "implementation");
    implementationEntry.path = DELIVERY_TRANSITION_GATE_B_CONTRACT.modulePath;
    taskInput.ownerActionRequirements = [];
    taskInput.ownerActions = [];
    taskInput.privateAuthority = null;
    recomputeBindings(taskInput);
  }
  taskInput.requirementIds = ["LID-OPS-001"];
  taskInput.expectedRequirementIds = ["LID-OPS-001"];
  taskInput.acceptanceScenarioIds = [`${taskId}-QA-001`];
  taskInput.designCoverage = {
    applicability: "applicable",
    journeyIds: [`${taskId}-QA-001`],
    stateCoverage: Object.fromEntries(DESIGN_STATE_DIMENSIONS.map((dimension) => [dimension, [`${taskId}-QA-001`]])),
    accessibilityCoverage: Object.fromEntries(DESIGN_ACCESSIBILITY_DIMENSIONS.map((dimension) => [dimension, [`${taskId}-QA-001`]])),
    notApplicableRationale: null,
  };
  recomputeBindings(taskInput);
  normalizeStageDossierBindings(taskInput);
  const stageId = deliveryTransition
    ? `P0-STAGE-${taskId}-STATUS-DELIVERY-TRANSITION`
    : `P0-STAGE-${taskId}-SYNTHETIC-001`;
  const preparationReviewId = deliveryTransition
    ? `P0-PREP-${taskId}-STATUS-DELIVERY-TRANSITION`
    : `P0-PREP-${taskId}-SYNTHETIC-001`;
  const proposalRevision = "d".repeat(40);
  const proposalBaseRevision = "e".repeat(40);
  const preparationTaskId = P0_R0_SUBSTANTIVE_TASK_IDS.includes(taskId) ? taskId : "SPK-R0-001";
  const preparationMilestone = P0_R0_SUBSTANTIVE_TASK_IDS.includes(taskId) ? milestone : "R0";
  const preparationReview = preparationReviewFromGateA(preparationFixture({
    deliveryTransition,
    taskId: preparationTaskId,
    milestone: preparationMilestone,
    candidateRevision: proposalRevision,
    baseRevision: proposalBaseRevision,
    acceptanceScenarioIds: [`${preparationTaskId}-QA-001`],
  }));
  if (preparationTaskId === taskId) {
    assert.equal(preparationReview.preparationReviewId, preparationReviewId);
    assert.equal(preparationReview.stageId, stageId);
  }
  const preparationReviewSha256 = computePreparationReviewRecordSha256(preparationReview);
  const stage = {
    stageId,
    preparationReviewId,
    preparationReviewSha256,
    taskId: taskInput.taskId,
    gateKind: "execute",
    state: "ready",
    scopeClass: taskInput.requestedScope.scopeClass,
    actionClass: taskInput.requestedScope.actionClass,
    sequence: 1,
    candidateRevision: taskInput.candidate.revision,
    dossierDigest: taskInput.candidate.dossierDigest,
    predecessorReceiptSha256: null,
    idempotencyKey: deliveryTransition
      ? `P0-IDEMP-${taskId}-STATUS-DELIVERY-TRANSITION`
      : `P0-IDEMP-${taskId}-SYNTHETIC-001`,
    stageDefinitionSha256: `sha256:${sha256("synthetic stage definition")}`,
    moduleId: deliveryTransition ? DELIVERY_TRANSITION_GATE_B_CONTRACT.moduleId : "spk.synthetic",
    moduleSha256: `sha256:${taskInput.candidate.taskFiles.find((entry) => entry.purpose === "implementation").sha256}`,
    candidate: clone(taskInput.candidate),
    artifactReviews: clone(taskInput.artifactReviews),
    designCoverage: clone(taskInput.designCoverage),
    dependencyEvidence: clone(taskInput.dependencyEvidence),
    openDecisions: clone(taskInput.openDecisions),
    specialistVetoes: clone(taskInput.specialistVetoes),
    privateAuthority: clone(taskInput.privateAuthority),
    reviewerRegistrySha256: computeReviewerRegistrySha256(taskInput.reviewerRegistry),
    ownerActionStateSha256: computeTaskOwnerActionStateSha256({
      taskId: taskInput.taskId,
      requirements: taskInput.ownerActionRequirements,
      records: taskInput.ownerActions,
    }),
    requirementEvidence: [{
      requirementId: "LID-OPS-001",
      stageId,
      acceptanceScenarioIds: [`${taskId}-QA-001`],
      candidateRevision: taskInput.candidate.revision,
      environmentClass: deliveryTransition ? "sanitized-private" : "synthetic-local",
      fixtureClass: deliveryTransition ? "sanitized-metadata" : "synthetic",
      evidenceReference: "evidence:SPK-R0-001-SYNTHETIC-001",
      result: "pass",
      residualObligations: ["Private-host qualification remains separately gated."],
    }],
    independentQa: {
      reviewerId: "reviewer-qa",
      reviewerRole: "qa",
      result: "pass",
      candidateRevision: taskInput.candidate.revision,
      dossierDigest: taskInput.candidate.dossierDigest,
      evidenceReference: "qa:SPK-R0-001-SYNTHETIC-001",
    },
    rollback: {
      planReference: "rollback:SPK-R0-001-SYNTHETIC-001",
      snapshotReference: "snapshot:SPK-R0-001-SYNTHETIC-001",
      rehearsalResult: "pass",
      evidenceReference: "rehearsal:SPK-R0-001-SYNTHETIC-001",
    },
    stageCouncil: {
      verdict: "ready-to-execute",
      reviewedRevision: taskInput.candidate.revision,
      dossierDigest: taskInput.candidate.dossierDigest,
      unresolvedBlockers: [],
      seatVerdicts: {},
    },
  };
  const stageContextSha256 = computeStageApprovalContextSha256(stage);
  for (const seat of COUNCIL_SEATS) {
    const role = roleBySeat[seat];
    const record = {
      reviewerId: reviewerIdForRole(role),
      reviewerRole: role,
      verdict: "approve-stage-execution",
      reviewedRevision: stage.candidateRevision,
      dossierDigest: stage.dossierDigest,
      preparationReviewId,
      preparationReviewSha256,
      stageId,
      gateKind: stage.gateKind,
      scopeClass: stage.scopeClass,
      actionClass: stage.actionClass,
      stageContextSha256,
      evidenceReference: `seat:SPK-R0-001-${seat}-stage-execution`,
      attestationDigest: null,
    };
    record.attestationDigest = computeStageApprovalSeatAttestationDigest(record);
    stage.stageCouncil.seatVerdicts[seat] = record;
  }
  const taskFacts = trustedFacts(taskInput);
  const stageApprovalSha256 = sha256(canonicalJson(stage));
  taskFacts.approvalPublication = {
    registryPath: STAGE_APPROVAL_REGISTRY_PATH,
    registrySha256: sha256("fictional append-only stage approval registry bytes\n"),
    registryBytesVerified: true,
    taskId: taskInput.taskId,
    stageId,
    preparationReviewId,
    publishedPreparationReviewSha256: preparationReviewSha256,
    currentPreparationReviewSha256: preparationReviewSha256,
    preparationReviewBytesVerified: true,
    preparationPublicationRevision: "f".repeat(40),
    preparationCandidateAncestorOfPublication: true,
    publishedStageApprovalSha256: stageApprovalSha256,
    currentStageApprovalSha256: stageApprovalSha256,
    stageApprovalBytesVerified: true,
    stagePublicationRevision: "1".repeat(40),
    stageCandidateAncestorOfPublication: true,
    preparationPublicationAncestorOfStageCandidate: true,
    stageApprovalPublishedOnFetchedMain: true,
  };
  taskFacts.activation.stageApprovalRecordReachableFromHead = true;
  // Legacy task-wide approval and seats cannot contribute to Gate B.
  taskInput.approvalRecord = null;
  taskInput.council = {
    verdict: "hold",
    reviewedRevision: null,
    dossierDigest: null,
    unresolvedBlockers: ["Legacy task approval deliberately absent."],
    seatVerdicts: {},
  };
  return {
    source: {
      schemaVersion: STAGE_EXECUTION_SCHEMA_VERSION,
      taskInput,
      preparationReview,
      stage,
    },
    context: {
      taskEvaluationOptions: {
        now: FIXED_NOW,
        ...taskFacts,
      },
    },
  };
}

function assertStageNegative(name, mutate, expectedCode) {
  const fixture = stageGateBFixture();
  mutate(fixture.source, fixture.context);
  const actual = evaluateStageExecutionGateB(fixture.source, fixture.context);
  assert.equal(actual.executionAllowed, false, `${name}: stage Gate B unexpectedly passed`);
  assert.ok(failedCodes(actual).includes(expectedCode), `${name}: missing ${expectedCode}; got ${failedCodes(actual).join(", ")}`);
  recordResult("PC-001-CTL-P05", name, "pass", { expectedCodes: [expectedCode] });
}

function resealStageDossierDigest(fixture, dossierDigest) {
  const { source, context } = fixture;
  source.taskInput.candidate.dossierDigest = dossierDigest;
  for (const kind of ARTIFACT_KINDS) {
    const review = source.taskInput.artifactReviews[kind];
    review.dossierDigest = dossierDigest;
    review.attestationDigest = computeAttestationDigest({
      taskId: source.taskInput.taskId,
      subjectType: "artifact",
      subject: kind,
      decision: review.decision,
      reviewerId: review.reviewerId,
      reviewerRole: review.reviewerRole,
      reviewedRevision: review.reviewedRevision,
      dossierDigest: review.dossierDigest,
      artifactSha256: review.artifactSha256,
      evidenceReference: review.evidenceReference,
      notApplicableRationale: review.notApplicableRationale,
      specialistConcurrence: review.specialistConcurrence,
    });
  }
  source.stage.dossierDigest = dossierDigest;
  source.stage.candidate.dossierDigest = dossierDigest;
  source.stage.artifactReviews = clone(source.taskInput.artifactReviews);
  source.stage.independentQa.dossierDigest = dossierDigest;
  source.stage.stageCouncil.dossierDigest = dossierDigest;
  const stageContextSha256 = computeStageApprovalContextSha256(source.stage);
  for (const seat of COUNCIL_SEATS) {
    const record = source.stage.stageCouncil.seatVerdicts[seat];
    record.dossierDigest = dossierDigest;
    record.stageContextSha256 = stageContextSha256;
    record.attestationDigest = computeStageApprovalSeatAttestationDigest(record);
  }
  const stageApprovalSha256 = sha256(canonicalJson(source.stage));
  context.taskEvaluationOptions.approvalPublication.publishedStageApprovalSha256 = stageApprovalSha256;
  context.taskEvaluationOptions.approvalPublication.currentStageApprovalSha256 = stageApprovalSha256;
  return fixture;
}

const stagePositive = stageGateBFixture();
const directCompositeEvaluation = evaluateReadiness(stagePositive.source.taskInput, stagePositive.context.taskEvaluationOptions);
assert.equal(directCompositeEvaluation.executionAllowed, false);
assert.ok(failedCodes(directCompositeEvaluation).includes("TASK_EXECUTION_CONTRACT_CARDINALITY"));
const stagePositiveResult = evaluateStageExecutionGateB(stagePositive.source, stagePositive.context);
assert.equal(stagePositiveResult.executionAllowed, true, failedCodes(stagePositiveResult).join(", "));
assert.equal(stagePositiveResult.decision, "Ready to execute — Gate B");
recordResult("PC-001-CTL-P05", "stage Gate B permits one exact pair on a composite R0 task while legacy task-wide approval stays denied", "pass", {
  decision: stagePositiveResult.decision,
  sourceFingerprint: stagePositiveResult.normalizedEvidence.sourceFingerprint,
});

assert.match(stagePositive.source.preparationReview.proposalCandidate.dossierDigest, /^[0-9a-f]{64}$/);
recordResult("PC-001-CTL-P05", "staged Gate A and Gate B preparation digests use raw SHA-256", "pass");
const legacyPrefixedFixture = singletonLocalFixture();
const legacyPrefixedResult = evaluateReadiness(legacyPrefixedFixture, {
  now: FIXED_NOW,
  ...trustedFacts(legacyPrefixedFixture),
});
assert.match(legacyPrefixedFixture.candidate.dossierDigest, /^sha256:[0-9a-f]{64}$/);
assert.equal(legacyPrefixedResult.executionAllowed, true, failedCodes(legacyPrefixedResult).join(", "));
recordResult("PC-001-CTL-P05", "ordinary legacy evaluator retains its prefixed dossier digest contract", "pass");
assertStageNegative("stage Gate B rejects an unknown envelope field", (source) => { source.stage.extraAction = "second"; }, "STAGE_SCHEMA");
assertStageNegative("stage Gate B rejects a fully resealed wrong raw dossier digest", (source, context) => {
  resealStageDossierDigest({ source, context }, "0".repeat(64));
}, "STAGE_CANDIDATE_DOSSIER_DIGEST");
assertStageNegative("stage Gate B rejects a prefixed staged dossier digest", (source, context) => {
  resealStageDossierDigest({ source, context }, `sha256:${"0".repeat(64)}`);
}, "STAGE_CANDIDATE");
assertStageNegative("stage Gate B rejects a well-formed module digest absent from the candidate", (source) => {
  source.stage.moduleSha256 = `sha256:${"0".repeat(64)}`;
}, "STAGE_MODULE_CANDIDATE_BINDING");
assertStageNegative("stage Gate B rejects a scope/action mismatch", (source) => { source.stage.actionClass = "private-system-read"; }, "STAGE_GATE_B_BINDING");
assertStageNegative("stage Gate B rejects a missing predecessor receipt on sequence two", (source) => { source.stage.sequence = 2; }, "STAGE_PREPARATION_PREDECESSOR");
assertStageNegative("stage Gate B rejects contributor-conflicted QA", (source) => { source.stage.independentQa.reviewerId = "implementer-controls"; source.stage.independentQa.reviewerRole = "implementation"; }, "STAGE_INDEPENDENT_QA");
assertStageNegative("stage Gate B rejects stale requirement evidence", (source) => { source.stage.requirementEvidence[0].candidateRevision = BASE_REVISION; }, "STAGE_REQUIREMENT_EVIDENCE");
assertStageNegative("stage Gate B rejects missing rollback rehearsal", (source) => { source.stage.rollback.rehearsalResult = "pending"; }, "STAGE_ROLLBACK");
assertStageNegative("stage Gate B rejects unpublished stage bytes", (_source, context) => { context.taskEvaluationOptions.approvalPublication.stageApprovalBytesVerified = false; }, "STAGE_PUBLICATION");
assertStageNegative("legacy task-wide seats cannot substitute for exact stage seats", (source) => {
  source.taskInput.council = clone(localFixture().council);
  source.stage.stageCouncil.seatVerdicts = {};
}, "STAGE_SEAT_SET");

const transitionStagePositive = stageGateBFixture({ deliveryTransition: true });
const directTransitionEvaluation = evaluateReadiness(
  transitionStagePositive.source.taskInput,
  transitionStagePositive.context.taskEvaluationOptions,
);
assert.equal(directTransitionEvaluation.executionAllowed, false, "ordinary task evaluation must not gain transition authority");
assert.ok(failedCodes(directTransitionEvaluation).includes("TASK_SCOPE_ACTION_COMPATIBILITY"));
assert.ok(!TASK_EXECUTION_CONTRACT["SPK-R0-001"].scopeActions["private-execution"].includes("project-workflow-mutation"));
assert.ok(Object.values(TASK_EXECUTION_CONTRACT).every((contract) => (
  contract.scopeActions[DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass] === undefined
)), "delivery-control must remain absent from every ordinary task execution contract");
const transitionStageResult = evaluateStageExecutionGateB(transitionStagePositive.source, transitionStagePositive.context);
assert.equal(transitionStageResult.executionAllowed, true, failedCodes(transitionStageResult).join(", "));
assert.equal(transitionStageResult.normalizedEvidence.scopeClass, DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass);
assert.equal(transitionStageResult.normalizedEvidence.actionClass, DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass);
assert.deepEqual(transitionStageResult.normalizedEvidence.dueOwnerActionIds, []);
assert.equal(transitionStageResult.normalizedEvidence.privateAuthorityRequired, false);
recordResult("PC-001-CTL-P05", "dedicated transition Gate B permits only the closed delivery-control branch while ordinary task execution stays denied", "pass", {
  decision: transitionStageResult.decision,
  sourceFingerprint: transitionStageResult.normalizedEvidence.sourceFingerprint,
});

for (const taskId of DELIVERY_TRANSITION_GATE_B_CONTRACT.taskIds) {
  const milestone = manifestForActionContract.tasks.find((task) => task.id === taskId)?.milestone;
  const fixture = stageGateBFixture({ deliveryTransition: true, taskId, milestone });
  const actual = evaluateStageExecutionGateB(fixture.source, fixture.context);
  assert.equal(actual.executionAllowed, true, `${taskId}: ${failedCodes(actual).join(", ")}`);
  assert.deepEqual(actual.normalizedEvidence.dueOwnerActionIds, [], `${taskId}: owner action leaked`);
  assert.equal(actual.normalizedEvidence.privateAuthorityRequired, false, `${taskId}: private authority leaked`);
  recordResult("PC-001-CTL-P05", `dedicated delivery-transition Gate B permits bounded task ${taskId} without owner-action authority`, "pass", {
    decision: actual.decision,
    sourceFingerprint: actual.normalizedEvidence.sourceFingerprint,
  });
}
const disallowedDeliveryTransitionTasks = [
  { taskId: "AUD-001", milestone: "P0" },
  { taskId: "PC-001", milestone: "P0" },
  { taskId: "PRD-R0-001", milestone: "R0" },
  { taskId: "PRD-R1-001", milestone: "R1" },
  { taskId: "UNKNOWN-R0-001", milestone: null },
];
for (const { taskId, milestone } of disallowedDeliveryTransitionTasks) {
  assert.equal(isDedicatedDeliveryTransitionScopeAction({
    taskId,
    stageId: `P0-STAGE-${taskId}-STATUS-DELIVERY-TRANSITION`,
    scopeClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass,
    actionClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass,
  }), false, `${taskId}: disallowed task entered delivery-transition allowlist`);
  if (milestone !== null) {
    const fixture = stageGateBFixture({ deliveryTransition: true, taskId, milestone });
    const actual = evaluateStageExecutionGateB(fixture.source, fixture.context);
    assert.equal(actual.executionAllowed, false, `${taskId}: disallowed transition passed`);
    assert.ok(failedCodes(actual).includes("STAGE_SCOPE_TASK"), `${taskId}: ${failedCodes(actual).join(", ")}`);
  }
  recordResult("PC-001-CTL-P05", `${taskId} cannot enter or borrow the five-task delivery-transition exception`, "pass", {
    expectedCodes: milestone === null ? ["DELIVERY_TRANSITION_TASK_ALLOWLIST"] : ["STAGE_SCOPE_TASK"],
  });
}

function assertTransitionStageNegative(name, mutate, expectedCode) {
  const fixture = stageGateBFixture({ deliveryTransition: true });
  mutate(fixture.source, fixture.context);
  const actual = evaluateStageExecutionGateB(fixture.source, fixture.context);
  assert.equal(actual.executionAllowed, false, `${name}: transition Gate B unexpectedly passed`);
  assert.ok(failedCodes(actual).includes(expectedCode), `${name}: missing ${expectedCode}; got ${failedCodes(actual).join(", ")}`);
  recordResult("PC-001-CTL-P05", name, "pass", { expectedCodes: [expectedCode] });
}

assertTransitionStageNegative("delivery-transition Gate B rejects a generic local-synthetic action", (source) => {
  source.stage.scopeClass = "local-synthetic";
  source.stage.actionClass = "synthetic-foundation";
}, "STAGE_DELIVERY_TRANSITION_CONTRACT");
assertTransitionStageNegative("delivery-transition Gate B rejects a non-canonical module ID", (source) => {
  source.stage.moduleId = "spk.synthetic";
}, "STAGE_DELIVERY_TRANSITION_CONTRACT");
assertTransitionStageNegative("delivery-transition Gate B rejects a renamed module path", (source) => {
  source.taskInput.candidate.taskFiles.find((entry) => entry.purpose === "implementation").path = "tools/P0-delivery-transition-copy.mjs";
}, "STAGE_DELIVERY_TRANSITION_CONTRACT");
assertTransitionStageNegative("delivery-transition Gate B rejects an executable module mode", (source) => {
  source.taskInput.candidate.taskFiles.find((entry) => entry.purpose === "implementation").gitMode = "100755";
}, "STAGE_DELIVERY_TRANSITION_CONTRACT");
assertTransitionStageNegative("private workflow authority without the transition suffix remains outside the ordinary task contract", (source) => {
  source.stage.stageId = "P0-STAGE-SPK-R0-001-STATUS-MUTATION";
}, "STAGE_SCOPE_ACTION");
assertTransitionStageNegative("private workflow pair cannot masquerade behind the delivery-transition suffix", (source) => {
  source.taskInput.requestedScope = {
    scopeClass: "private-execution",
    actionClass: "project-workflow-mutation",
  };
  source.stage.scopeClass = "private-execution";
  source.stage.actionClass = "project-workflow-mutation";
}, "STAGE_DELIVERY_TRANSITION_CONTRACT");
assertTransitionStageNegative("delivery-transition Gate B rejects leaked P0-OA-001 requirements", (source) => {
  const requirement = OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-001"];
  source.taskInput.ownerActionRequirements.push({
    actionId: "P0-OA-001",
    requiredForScopeClasses: [...requirement.requiredForScopeClasses],
    requiredForActionClasses: [...requirement.requiredForActionClasses],
    accountableHumanId: null,
    accountableHumanRole: requirement.accountableHumanRole,
  });
}, "OWNER_ACTION_REQUIREMENTS");
assertTransitionStageNegative("delivery-transition Gate B rejects leaked P0-OA-002 requirements", (source) => {
  const requirement = OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-002"];
  source.taskInput.ownerActionRequirements.push({
    actionId: "P0-OA-002",
    requiredForScopeClasses: [...requirement.requiredForScopeClasses],
    requiredForActionClasses: [...requirement.requiredForActionClasses],
    accountableHumanId: null,
    accountableHumanRole: requirement.accountableHumanRole,
  });
}, "OWNER_ACTION_REQUIREMENTS");

const countsByScenario = Object.fromEntries(
  [...new Set(results.map((result) => result.id.split(".")[0]))]
    .sort()
    .map((scenario) => [scenario, results.filter((result) => result.id.split(".")[0] === scenario).length]),
);
console.log(JSON.stringify({
  suite: "PC-001 readiness-control primitives",
  node: process.version,
  fixtureClass: "fictional/synthetic only",
  passed: results.length,
  failed: 0,
  countsByScenario,
  positiveFingerprints: results
    .filter((result) => ["PC-001-CTL-P01", "PC-001-CTL-P02", "PC-001-CTL-P03"].includes(result.id))
    .map(({ id, sourceFingerprint, decision }) => ({ id, sourceFingerprint, decision })),
}, null, 2));
