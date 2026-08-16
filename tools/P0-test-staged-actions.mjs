import assert from "node:assert/strict";
import crypto from "node:crypto";
import {
  preparationReviewRecordDigest,
  MAX_SERIALIZABLE_STAGE_DEADLINE_MS,
  P0_GATE_A_PROPOSAL_PROJECTION_PATHS,
  PRODUCTION_STAGED_ACTIONS,
  stageApprovalContextDigest,
  stageApprovalRecordDigest,
  STAGED_ACTION_SCHEMA_VERSION,
  stageBindingDigest,
  P0_R0_GATE_A_MINIMUM_BASE_REVISION,
  STAGE_APPROVAL_REGISTRY_SOURCE_BASE_REVISION,
  validateGateAPreparationDecision,
  validateStageApprovalRegistry,
  validateStageChain,
  validateStageReceipt,
  validateStageRuntimeLifecycle,
  validateStagedActionDefinition,
  verifyPreparationReviewRegistryHistory,
  verifyPreparationGateAProofFromGit,
  verifyStageApprovalRegistryContinuity,
  verifyStageApprovalRegistryHistory,
} from "./P0-staged-actions.mjs";
import { canonicalJson } from "./P0-content-safety.mjs";
import {
  ARTIFACT_KINDS,
  COUNCIL_SEATS,
  DESIGN_ACCESSIBILITY_DIMENSIONS,
  DESIGN_STATE_DIMENSIONS,
  DELIVERY_TRANSITION_GATE_B_CONTRACT,
  P0_R0_SCOPE_TASK_IDS,
  P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS,
  P0_R0_SUBSTANTIVE_TASK_IDS,
  STAGE_APPROVAL_REGISTRY_PATH,
  STAGE_EXECUTION_SCHEMA_VERSION,
  TASK_FILE_DIFF_EXCLUSIONS,
  TASK_PREPARATION_SCHEMA_VERSION,
  computeDossierDigest,
  computeAttestationDigest,
  computePreparationDossierDigest,
  computePreparationProposalAuthorAttestationDigest,
  computeReviewerRegistrySha256,
  computeStageCouncilAttestationDigest,
  computeStageApprovalSeatAttestationDigest,
  computeTaskContractSha256,
  computeTaskFilesSha256,
  computeTaskOwnerActionStateSha256,
  evaluateStageExecutionGateB,
  evaluateTaskPreparationGateA,
} from "./P0-readiness-gates.mjs";
import {
  acceptanceScenarioIdsFor,
  buildTaskReadinessInput,
} from "./P0-build-task-readiness-input.mjs";

const REVISION = "a".repeat(40);
const DIGEST = "b".repeat(64);
const MANIFEST_PATH = "docs/project/PHASE1-ROADMAP-MANIFEST.json";
const REVIEWER_REGISTRY_PATH = "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json";
const PROPOSAL_PROJECTION_PATHS = P0_GATE_A_PROPOSAL_PROJECTION_PATHS;
let cases = 0;

function expectCode(actual, code) {
  assert.equal(actual.code, code);
  cases += 1;
}

assert.deepEqual(PROPOSAL_PROJECTION_PATHS, [
  "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json",
  MANIFEST_PATH,
  "outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx",
]); cases += 1;

const base = Object.freeze({
  schemaVersion: STAGED_ACTION_SCHEMA_VERSION,
  taskId: "SPK-R0-001",
  scopeClass: "local-synthetic",
  actionClass: "synthetic-foundation",
  stageId: "P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION",
  predecessor: null,
  idempotencyKey: "P0-IDEMP-SPK-R0-001-SYNTHETIC-001",
  moduleId: "spk.synthetic",
  argumentSetId: "synthetic.v1",
  deadlineMs: 60_000,
});

expectCode(validateStagedActionDefinition(base), "STAGE_DEFINITION_VALID");
assert.match(stageBindingDigest(base), /^sha256:[0-9a-f]{64}$/); cases += 1;

const deliveryTransitionDefinition = Object.freeze({
  ...base,
  scopeClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass,
  actionClass: DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass,
  stageId: "P0-STAGE-SPK-R0-001-STATUS-DELIVERY-TRANSITION",
  idempotencyKey: "P0-IDEMP-SPK-R0-001-STATUS-DELIVERY-TRANSITION-001",
  moduleId: DELIVERY_TRANSITION_GATE_B_CONTRACT.moduleId,
  argumentSetId: "transition.v1",
});
expectCode(validateStagedActionDefinition(deliveryTransitionDefinition), "STAGE_DEFINITION_VALID");
assert.deepEqual(DELIVERY_TRANSITION_GATE_B_CONTRACT.taskIds, P0_R0_SUBSTANTIVE_TASK_IDS); cases += 1;
for (const taskId of DELIVERY_TRANSITION_GATE_B_CONTRACT.taskIds) {
  expectCode(validateStagedActionDefinition({
    ...deliveryTransitionDefinition,
    taskId,
    stageId: `P0-STAGE-${taskId}-STATUS-DELIVERY-TRANSITION`,
    idempotencyKey: `P0-IDEMP-${taskId}-STATUS-DELIVERY-TRANSITION-001`,
  }), "STAGE_DEFINITION_VALID");
}
expectCode(validateStagedActionDefinition({
  ...deliveryTransitionDefinition,
  scopeClass: "local-synthetic",
  actionClass: "synthetic-foundation",
}), "STAGE_SCOPE_ACTION_NOT_OWNED");
expectCode(validateStagedActionDefinition({
  ...deliveryTransitionDefinition,
  stageId: "P0-STAGE-SPK-R0-001-STATUS-MUTATION",
}), "STAGE_SCOPE_ACTION_NOT_OWNED");
expectCode(validateStagedActionDefinition({
  ...deliveryTransitionDefinition,
  stageId: "P0-STAGE-UX-R0-001-STATUS-DELIVERY-TRANSITION",
}), "STAGE_SCOPE_ACTION_NOT_OWNED");
expectCode(validateStagedActionDefinition({
  ...deliveryTransitionDefinition,
  moduleId: "spk.synthetic",
}), "STAGE_DELIVERY_TRANSITION_CONTRACT_INVALID");
expectCode(validateStagedActionDefinition({
  ...base,
  moduleId: DELIVERY_TRANSITION_GATE_B_CONTRACT.moduleId,
}), "STAGE_DELIVERY_TRANSITION_CONTRACT_INVALID");
expectCode(validateStagedActionDefinition({
  ...deliveryTransitionDefinition,
  scopeClass: "private-execution",
  actionClass: "project-workflow-mutation",
}), "STAGE_SCOPE_ACTION_NOT_OWNED");
expectCode(validateStagedActionDefinition({
  ...deliveryTransitionDefinition,
  taskId: "PRD-R1-001",
  stageId: "P0-STAGE-PRD-R1-001-STATUS-DELIVERY-TRANSITION",
  idempotencyKey: "P0-IDEMP-PRD-R1-001-STATUS-DELIVERY-TRANSITION-001",
}), "STAGE_TASK_NOT_ALLOWLISTED");
for (const taskId of P0_R0_SCOPE_TASK_IDS.filter((candidate) => !P0_R0_SUBSTANTIVE_TASK_IDS.includes(candidate))) {
  expectCode(validateStagedActionDefinition({
    ...deliveryTransitionDefinition,
    taskId,
    stageId: `P0-STAGE-${taskId}-STATUS-DELIVERY-TRANSITION`,
    idempotencyKey: `P0-IDEMP-${taskId}-STATUS-DELIVERY-TRANSITION-001`,
  }), "STAGE_TASK_NOT_ALLOWLISTED");
}
expectCode(validateStagedActionDefinition({
  ...deliveryTransitionDefinition,
  taskId: "UNKNOWN-R0-001",
  stageId: "P0-STAGE-UNKNOWN-R0-001-STATUS-DELIVERY-TRANSITION",
  idempotencyKey: "P0-IDEMP-UNKNOWN-R0-001-STATUS-DELIVERY-TRANSITION-001",
}), "STAGE_TASK_NOT_ALLOWLISTED");

for (const [change, code] of [
  [{ taskId: "AUD-001" }, "STAGE_TASK_NOT_ALLOWLISTED"],
  [{ taskId: "PRD-R1-001" }, "STAGE_TASK_NOT_ALLOWLISTED"],
  [{ scopeClass: "private-execution", actionClass: "deployment" }, "STAGE_SCOPE_ACTION_NOT_OWNED"],
  [{ stageId: "P0-STAGE-ENG-R0-001-WRONG-TASK" }, "STAGE_ID_INVALID"],
  [{ idempotencyKey: "short" }, "STAGE_IDEMPOTENCY_KEY_INVALID"],
  [{ moduleId: "../../evil" }, "STAGE_RUNNER_BINDING_INVALID"],
  [{ argumentSetId: "/tmp/args" }, "STAGE_RUNNER_BINDING_INVALID"],
  [{ deadlineMs: 999 }, "STAGE_DEADLINE_INVALID"],
  [{ deadlineMs: MAX_SERIALIZABLE_STAGE_DEADLINE_MS }, "STAGE_DEFINITION_VALID"],
  [{ deadlineMs: MAX_SERIALIZABLE_STAGE_DEADLINE_MS + 1 }, "STAGE_DEADLINE_INVALID"],
  [{ predecessor: { stageId: base.stageId, receiptDigest: DIGEST } }, "STAGE_PREDECESSOR_INVALID"],
  [{ command: "sh" }, "STAGE_DEFINITION_SHAPE_INVALID"],
  [{ env: { TOKEN: "secret" } }, "STAGE_DEFINITION_SHAPE_INVALID"],
  [{ callback: "run" }, "STAGE_DEFINITION_SHAPE_INVALID"],
  [{ outputPath: "/tmp/out" }, "STAGE_DEFINITION_SHAPE_INVALID"],
  [{ trust: true }, "STAGE_DEFINITION_SHAPE_INVALID"],
]) {
  expectCode(validateStagedActionDefinition({ ...base, ...change }), code);
}

let accessorInvoked = false;
const accessorDefinition = { ...base };
Object.defineProperty(accessorDefinition, "moduleId", {
  enumerable: true,
  get() {
    accessorInvoked = true;
    throw new Error("must not execute");
  },
});
expectCode(validateStagedActionDefinition(accessorDefinition), "STAGE_DEFINITION_SHAPE_INVALID");
assert.equal(accessorInvoked, false); cases += 1;
expectCode(validateStagedActionDefinition(new Proxy({ ...base }, {
  ownKeys() { throw new Error("proxy trap"); },
})), "STAGE_DEFINITION_SHAPE_INVALID");
const symbolDefinition = { ...base };
symbolDefinition[Symbol("trust")] = true;
expectCode(validateStagedActionDefinition(symbolDefinition), "STAGE_DEFINITION_SHAPE_INVALID");
expectCode(validateStagedActionDefinition(Object.assign(Object.create(null), base)), "STAGE_DEFINITION_SHAPE_INVALID");

const gateA = {
  schemaVersion: STAGED_ACTION_SCHEMA_VERSION,
  gate: "Gate A",
  taskId: base.taskId,
  candidateRevision: REVISION,
  dossierDigest: DIGEST,
  preparationAllowed: true,
};
const gateAResult = validateGateAPreparationDecision(gateA);
assert.equal(gateAResult.executionAllowed, false); cases += 1;
expectCode(validateGateAPreparationDecision({ ...gateA, executionAllowed: true }), "GATE_A_DECISION_SHAPE_INVALID");
expectCode(validateGateAPreparationDecision({ ...gateA, taskId: "PC-001" }), "GATE_A_TASK_NOT_ALLOWLISTED");

const receipt = {
  schemaVersion: STAGED_ACTION_SCHEMA_VERSION,
  taskId: base.taskId,
  scopeClass: base.scopeClass,
  actionClass: base.actionClass,
  stageId: base.stageId,
  idempotencyKey: base.idempotencyKey,
  sourceRevision: REVISION,
  gateKind: "execute",
  authorityDeadline: "2026-08-15T12:05:00.000Z",
  rollbackSnapshotReference: "rollback:synthetic-snapshot",
  stageBindingDigest: stageBindingDigest(base),
  predecessorReceiptSha256: null,
  preparationReviewId: "P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION",
  preparationReviewSha256: "c".repeat(64),
  candidateRevision: "d".repeat(40),
  dossierDigest: "e".repeat(64),
  stageApprovalSha256: "f".repeat(64),
  registrySha256: "1".repeat(64),
  gateSourceFingerprint: `sha256:${"2".repeat(64)}`,
  moduleSha256: `sha256:${"3".repeat(64)}`,
  childResultSha256: `sha256:${"4".repeat(64)}`,
  evidenceDigest: `sha256:${"5".repeat(64)}`,
  stdoutSha256: `sha256:${"6".repeat(64)}`,
  stderrSha256: `sha256:${"7".repeat(64)}`,
  immediateVerificationSha256: `sha256:${"8".repeat(64)}`,
  immediateVerificationResult: "pass",
  quiescent1VerificationSha256: `sha256:${"9".repeat(64)}`,
  quiescent1VerificationResult: "pass",
  quiescent2VerificationSha256: `sha256:${"a".repeat(64)}`,
  quiescent2VerificationResult: "pass",
  state: "verified-complete",
  attempt: 1,
};
expectCode(validateStageReceipt(receipt, base), "STAGE_RECEIPT_VALID");
const receiptAuthorization = {
  sourceRevision: receipt.sourceRevision,
  gateKind: receipt.gateKind,
  deadlineAt: receipt.authorityDeadline,
  rollbackSnapshotReference: receipt.rollbackSnapshotReference,
  preparationReviewId: receipt.preparationReviewId,
  preparationReviewSha256: receipt.preparationReviewSha256,
  candidateRevision: receipt.candidateRevision,
  dossierDigest: receipt.dossierDigest,
  stageApprovalSha256: receipt.stageApprovalSha256,
  registrySha256: receipt.registrySha256,
  gateSourceFingerprint: receipt.gateSourceFingerprint,
  moduleSha256: receipt.moduleSha256,
};
expectCode(validateStageReceipt(receipt, base, receiptAuthorization), "STAGE_RECEIPT_VALID");
expectCode(validateStageReceipt(receipt, base, {
  ...receiptAuthorization,
  moduleSha256: `sha256:${"0".repeat(64)}`,
}), "STAGE_RECEIPT_AUTHORIZATION_MISMATCH");
expectCode(validateStageReceipt({
  ...receipt,
  state: "ready",
  moduleSha256: null,
  childResultSha256: null,
  evidenceDigest: null,
  stdoutSha256: null,
  stderrSha256: null,
  immediateVerificationSha256: null,
  immediateVerificationResult: null,
  quiescent1VerificationSha256: null,
  quiescent1VerificationResult: null,
  quiescent2VerificationSha256: null,
  quiescent2VerificationResult: null,
}, base), "STAGE_RECEIPT_VALID");
expectCode(validateStageReceipt({ ...receipt, taskId: "ENG-R0-001" }, base), "STAGE_RECEIPT_BINDING_INVALID");
expectCode(validateStageReceipt({ ...receipt, rawStdout: "no" }, base), "STAGE_RECEIPT_SHAPE_INVALID");
expectCode(validateStageReceipt({ ...receipt, childResultSha256: null }, base), "STAGE_RECEIPT_EVIDENCE_INVALID");
expectCode(validateStageReceipt({ ...receipt, quiescent2VerificationSha256: null }, base), "STAGE_RECEIPT_EVIDENCE_INVALID");
expectCode(validateStageReceipt({ ...receipt, quiescent2VerificationResult: null }, base), "STAGE_RECEIPT_VERIFICATION_INVALID");

const receiptDigest = `sha256:${crypto.createHash("sha256").update(canonicalJson(receipt)).digest("hex")}`;
const second = {
  ...base,
  stageId: "P0-STAGE-SPK-R0-001-PRIVATE-READ",
  scopeClass: "private-execution",
  actionClass: "private-system-read",
  idempotencyKey: "P0-IDEMP-SPK-R0-001-PRIVATE-READ-001",
  predecessor: { stageId: base.stageId, receiptDigest },
};
expectCode(validateStageChain([base, second], [receipt]), "STAGE_CHAIN_VALID");
expectCode(validateStageChain([base, second], [{ ...receipt, state: "recovery-required" }]), "STAGE_PREDECESSOR_NOT_SUCCEEDED");
expectCode(validateStageChain([base, { ...second, idempotencyKey: base.idempotencyKey }], [receipt]), "STAGE_IDEMPOTENCY_KEY_DUPLICATE");
assert.deepEqual(PRODUCTION_STAGED_ACTIONS, []); cases += 1;

function rawDigest(label) {
  return crypto.createHash("sha256").update(label).digest("hex");
}

const artifactRole = Object.freeze({
  product: "product",
  architecture: "architecture",
  design: "design",
  qa: "qa",
  delivery: "project",
  council: "project",
});
const seatRole = Object.freeze({
  product: "product",
  design: "design",
  architecture: "architecture",
  qa: "qa",
  project: "project",
});

function gateAProofResult(evaluation) {
  return {
    preparationAllowed: evaluation.preparationAllowed,
    executionAllowed: evaluation.executionAllowed,
    decision: evaluation.decision,
    blockers: structuredClone(evaluation.blockers),
    preparationBounds: [...evaluation.normalizedEvidence.preparationBounds],
    privateActionsAllowed: evaluation.normalizedEvidence.privateActionsAllowed,
    externalMutationsAllowed: evaluation.normalizedEvidence.externalMutationsAllowed,
    taskContractSha256: evaluation.normalizedEvidence.taskContractSha256,
    sourceFingerprint: evaluation.normalizedEvidence.sourceFingerprint,
  };
}

function stageRegistryFixture() {
  const sourceBaseRevision = STAGE_APPROVAL_REGISTRY_SOURCE_BASE_REVISION;
  const minimumGateABaseRevision = P0_R0_GATE_A_MINIMUM_BASE_REVISION;
  const proposalRevision = "8".repeat(40);
  const proposalBaseRevision = minimumGateABaseRevision;
  const projectionRevision = "7".repeat(40);
  const proposalMainPublicationRevision = "9".repeat(40);
  const preparationPublicationRevision = "a".repeat(40);
  const preparationMainPublicationRevision = "d".repeat(40);
  const candidateRevision = "b".repeat(40);
  const stagePublicationRevision = "c".repeat(40);
  const implementationMainPublicationRevision = "e".repeat(40);
  const stageMainPublicationRevision = "f".repeat(40);
  const stageId = base.stageId;
  const preparationReviewId = "P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION";
  const reviewerRegistry = {
    schemaVersion: "1.0.0",
    reviewers: [
      ...Object.entries(seatRole).map(([seat, role]) => ({
        reviewerId: `reviewer-${seat}`,
        role,
        active: true,
      })),
      { reviewerId: P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0], role: "implementation", active: true },
      { reviewerId: "evidence-producer-synthetic", role: "evidence-producer", active: true },
    ],
  };
  const artifactBytes = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, [
    `# P0 ${base.taskId} ${kind}`,
    "",
    `- **Task ID:** \`${base.taskId}\``,
    `- **Artifact kind:** \`${kind}\``,
    "- **Artifact state:** `in-review`",
    "",
    "Fictional synthetic Gate A proposal evidence only.",
    "",
  ].join("\n")]));
  const artifactBindings = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
    path: `docs/work-items/${base.taskId}/P0-${base.taskId}-${kind}.md`,
    sha256: rawDigest(artifactBytes[kind]),
  }]));
  const artifactPaths = ARTIFACT_KINDS.map((kind) => artifactBindings[kind].path);
  const acceptanceScenarioIds = acceptanceScenarioIdsFor(base.taskId);
  const requirementIds = [
    "LID-SCP-001", "LID-OPS-001", "LID-OPS-002", "LID-OPS-003", "LID-OPS-004",
    "LID-OPS-008", "LID-OPS-011", "LID-OPS-012", "LID-OPS-014", "LID-OPS-016",
    "LID-OPS-018",
  ];
  const taskOutcome = "Prove namespaced shared-host fit with synthetic data and reversible recovery.";
  const acceptanceEvidence = "Synthetic capacity, collision, restart, restore, rollback, and non-regression evidence.";
  const taskContractSha256 = computeTaskContractSha256({
    taskId: base.taskId,
    outcome: taskOutcome,
    requirementIds,
    dependencyIds: ["PC-001"],
    acceptanceEvidence,
    acceptanceScenarioIds,
  });
  const manifestDocument = {
    tasks: [{
      id: base.taskId,
      milestone: "R0",
      description: taskOutcome,
      requirementIds,
      dependencies: ["PC-001"],
      acceptanceEvidence,
      taskDossier: {
        acceptanceScenarioIds,
        artifacts: Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
          path: artifactBindings[kind].path,
        }])),
      },
    }],
  };
  const gateAInput = {
    schemaVersion: TASK_PREPARATION_SCHEMA_VERSION,
    preparationReviewId,
    taskId: base.taskId,
    milestone: "R0",
    taskContractSha256,
    stageId,
    requestedScope: { scopeClass: base.scopeClass, actionClass: base.actionClass },
    candidate: {
      revision: proposalRevision,
      baseRevision: proposalBaseRevision,
      dossierDigest: null,
      artifacts: Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
        ...artifactBindings[kind],
        contentState: "in-review",
      }])),
    },
    dependencyIds: ["PC-001"],
    dependencyEvidence: [{
      dependencyId: "PC-001",
      result: "pass",
      evidenceReference: "dependency:SPK-R0-001-PC-001",
    }],
    acceptanceScenarioIds,
    proposalAuthorIds: [...P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS],
    proposalAuthorEvidence: {
      proposalAuthorIds: [...P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS],
      candidateRevision: proposalRevision,
      evidenceReference: "authors:SPK-R0-001-proposal",
      attestationDigest: null,
    },
    artifactReviews: {},
    council: {
      verdict: "ready-to-prepare",
      reviewedRevision: proposalRevision,
      dossierDigest: null,
      unresolvedBlockers: [],
      seatVerdicts: {},
    },
    reviewerRegistry,
    openDecisions: [],
    specialistVetoes: [],
    safety: {
      authenticMediaAccessed: false,
      privateNetworkAccessed: false,
      externalMutationPerformed: false,
    },
  };
  gateAInput.candidate.dossierDigest = computePreparationDossierDigest(gateAInput);
  gateAInput.proposalAuthorEvidence.attestationDigest = computePreparationProposalAuthorAttestationDigest({
    preparationReviewId,
    taskId: base.taskId,
    stageId,
    candidateRevision: proposalRevision,
    dossierDigest: gateAInput.candidate.dossierDigest,
    proposalAuthorIds: gateAInput.proposalAuthorIds,
    evidenceReference: gateAInput.proposalAuthorEvidence.evidenceReference,
  });
  for (const kind of ARTIFACT_KINDS) {
    const role = artifactRole[kind];
    const review = {
      reviewerId: `reviewer-${role === "project" ? "project" : role}`,
      reviewerRole: role,
      decision: "approved",
      reviewedRevision: proposalRevision,
      dossierDigest: gateAInput.candidate.dossierDigest,
      artifactSha256: artifactBindings[kind].sha256,
      evidenceReference: `review:${base.taskId}-${kind}`,
      attestationDigest: null,
    };
    review.attestationDigest = computeStageCouncilAttestationDigest({
      gateKind: "gate-a-prepare",
      preparationReviewId,
      taskId: base.taskId,
      stageId,
      subject: `artifact:${kind}`,
      decision: review.decision,
      reviewerId: review.reviewerId,
      reviewerRole: review.reviewerRole,
      reviewedRevision: review.reviewedRevision,
      dossierDigest: review.dossierDigest,
      artifactSha256: review.artifactSha256,
      scopeClass: base.scopeClass,
      actionClass: base.actionClass,
      evidenceReference: review.evidenceReference,
    });
    gateAInput.artifactReviews[kind] = review;
  }
  gateAInput.council.dossierDigest = gateAInput.candidate.dossierDigest;
  for (const seat of COUNCIL_SEATS) {
    const role = seatRole[seat];
    const attestation = {
      reviewerId: `reviewer-${seat}`,
      reviewerRole: role,
      verdict: "approve-preparation-candidate",
      reviewedRevision: proposalRevision,
      dossierDigest: gateAInput.candidate.dossierDigest,
      preparationReviewId,
      stageId,
      evidenceReference: `synthetic:gate-a-${seat}`,
      attestationDigest: null,
    };
    attestation.attestationDigest = computeStageCouncilAttestationDigest({
      gateKind: "gate-a-prepare",
      preparationReviewId,
      taskId: base.taskId,
      stageId,
      subject: `council:${seat}`,
      decision: attestation.verdict,
      reviewerId: attestation.reviewerId,
      reviewerRole: attestation.reviewerRole,
      reviewedRevision: attestation.reviewedRevision,
      dossierDigest: attestation.dossierDigest,
      scopeClass: base.scopeClass,
      actionClass: base.actionClass,
      evidenceReference: attestation.evidenceReference,
    });
    gateAInput.council.seatVerdicts[seat] = attestation;
  }
  const gateAContext = {
    expectedTask: {
      taskId: base.taskId,
      milestone: "R0",
      dependencyIds: ["PC-001"],
      acceptanceScenarioIds,
      taskContractSha256,
    },
    candidatePublication: {
      revision: proposalRevision,
      baseRevision: proposalBaseRevision,
      bytesVerified: true,
      fullDiffVerified: true,
      candidateOnFetchedMain: true,
    },
  };
  const gateAEvaluation = evaluateTaskPreparationGateA(gateAInput, gateAContext);
  assert.equal(gateAEvaluation.preparationAllowed, true);
  const preparationReview = {
    preparationReviewId,
    taskId: base.taskId,
    stageId,
    state: "accepted",
    scopeClass: base.scopeClass,
    actionClass: base.actionClass,
    gateAProof: {
      input: gateAInput,
      context: gateAContext,
      result: gateAProofResult(gateAEvaluation),
    },
    proposalCandidate: {
      revision: gateAInput.candidate.revision,
      baseRevision: gateAInput.candidate.baseRevision,
      dossierDigest: gateAInput.candidate.dossierDigest,
      artifactBindings,
    },
    reviewerRegistrySha256: computeReviewerRegistrySha256(reviewerRegistry),
    councilSeatAttestations: Object.fromEntries(COUNCIL_SEATS.map((seat) => [seat, {
      ...gateAInput.council.seatVerdicts[seat],
      scopeClass: base.scopeClass,
      actionClass: base.actionClass,
    }])),
    evidenceReference: "synthetic:gate-a-accepted",
  };
  const implementationBytes = "export const P0_SYNTHETIC_FOUNDATION = true;\n";
  const evidenceBytes = "# P0 SPK-R0-001 synthetic execution evidence\n\nFictional local fixture only.\n";
  const implementationPath = "tools/P0-SPK-R0-001-synthetic-foundation.mjs";
  const evidencePath = "outputs/P0-SPK-R0-001-synthetic-evidence.md";
  const taskFiles = [
    ...ARTIFACT_KINDS.map((kind) => ({
      path: artifactBindings[kind].path,
      sha256: artifactBindings[kind].sha256,
      purpose: `artifact:${kind}`,
      gitMode: "100644",
      gitType: "blob",
    })),
    {
      path: implementationPath,
      sha256: rawDigest(implementationBytes),
      purpose: "implementation",
      gitMode: "100644",
      gitType: "blob",
    },
    {
      path: evidencePath,
      sha256: rawDigest(evidenceBytes),
      purpose: "evidence",
      gitMode: "100644",
      gitType: "blob",
    },
  ];
  const designCoverage = {
    applicability: "applicable",
    journeyIds: [acceptanceScenarioIds[0]],
    stateCoverage: Object.fromEntries(DESIGN_STATE_DIMENSIONS.map((dimension) => [
      dimension, [acceptanceScenarioIds[0]],
    ])),
    accessibilityCoverage: Object.fromEntries(DESIGN_ACCESSIBILITY_DIMENSIONS.map((dimension) => [
      dimension, [acceptanceScenarioIds[0]],
    ])),
    notApplicableRationale: null,
  };
  const dependencyEvidence = [{
    dependencyId: "PC-001",
    result: "pass",
    evidenceReference: "dependency:SPK-R0-001-PC-001-execution",
  }];
  const taskInput = buildTaskReadinessInput({
    task: manifestDocument.tasks[0],
    artifacts: Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
      path: artifactBindings[kind].path,
      sha256: artifactBindings[kind].sha256,
      observedSha256: artifactBindings[kind].sha256,
      contentState: "in-review",
      markersValid: true,
    }])),
    readinessState: {
      taskOverrides: {
        [base.taskId]: {
          requestedScopeClass: base.scopeClass,
          requestedActionClass: base.actionClass,
          implementerIds: [...P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS],
          evidenceProducerIds: ["evidence-producer-synthetic"],
          dependencyEvidence,
          privateAuthority: null,
          openDecisions: [],
          unresolvedBlockers: [],
          specialistVetoes: [],
          designCoverage,
        },
      },
    },
    reviewerRegistry,
    approvalRegistry: { taskApprovals: {} },
    ownerActionState: { actions: {} },
    evaluationPhase: "activation",
  });
  const stageCandidate = {
    revision: candidateRevision,
    baseRevision: preparationMainPublicationRevision,
    dossierDigest: null,
    taskContractSha256,
    artifacts: artifactBindings,
    taskFiles,
    taskFilesSha256: computeTaskFilesSha256(taskFiles),
    implementerIds: [...P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS],
    evidenceProducerIds: ["evidence-producer-synthetic"],
  };
  stageCandidate.dossierDigest = computeDossierDigest({
    taskId: base.taskId,
    ...stageCandidate,
  }).slice("sha256:".length);
  const artifactReviews = Object.fromEntries(ARTIFACT_KINDS.map((kind) => {
    const role = artifactRole[kind];
    const review = {
      decision: "approved",
      reviewerId: `reviewer-${role === "project" ? "project" : role}`,
      reviewerRole: role,
      reviewedRevision: candidateRevision,
      artifactSha256: artifactBindings[kind].sha256,
      dossierDigest: stageCandidate.dossierDigest,
      evidenceReference: `review:${base.taskId}-${kind}-execution`,
      attestationDigest: null,
      notApplicableRationale: null,
      specialistConcurrence: false,
    };
    review.attestationDigest = computeAttestationDigest({
      taskId: base.taskId,
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
    return [kind, review];
  }));
  Object.assign(taskInput, {
    candidate: structuredClone(stageCandidate),
    artifactReviews: structuredClone(artifactReviews),
    designCoverage: structuredClone(designCoverage),
    dependencyEvidence: structuredClone(dependencyEvidence),
    privateAuthority: null,
    openDecisions: [],
    specialistVetoes: [],
    council: {
      verdict: "hold",
      reviewedRevision: null,
      dossierDigest: null,
      unresolvedBlockers: ["Legacy task-wide approval is non-authorizing for Gate B."],
      seatVerdicts: {},
    },
    approvalRecord: null,
  });
  const stage = {
    stageId,
    preparationReviewId,
    preparationReviewSha256: preparationReviewRecordDigest(preparationReview),
    taskId: base.taskId,
    gateKind: "execute",
    state: "ready",
    scopeClass: base.scopeClass,
    actionClass: base.actionClass,
    sequence: 1,
    candidateRevision,
    dossierDigest: stageCandidate.dossierDigest,
    predecessorReceiptSha256: null,
    idempotencyKey: base.idempotencyKey,
    stageDefinitionSha256: stageBindingDigest(base),
    moduleId: base.moduleId,
    moduleSha256: `sha256:${rawDigest(implementationBytes)}`,
    candidate: stageCandidate,
    artifactReviews,
    designCoverage,
    dependencyEvidence,
    openDecisions: [],
    specialistVetoes: [],
    privateAuthority: null,
    reviewerRegistrySha256: computeReviewerRegistrySha256(reviewerRegistry),
    ownerActionStateSha256: computeTaskOwnerActionStateSha256({
      taskId: base.taskId,
      requirements: taskInput.ownerActionRequirements,
      records: taskInput.ownerActions,
    }),
    requirementEvidence: requirementIds.map((requirementId) => ({
      requirementId,
      stageId,
      acceptanceScenarioIds: [acceptanceScenarioIds[0]],
      candidateRevision,
      environmentClass: "synthetic-local",
      fixtureClass: "synthetic",
      evidenceReference: `evidence:${base.taskId}-${requirementId}`,
      result: "pass",
      residualObligations: [],
    })),
    independentQa: {
      reviewerId: "reviewer-qa",
      reviewerRole: "qa",
      result: "pass",
      candidateRevision,
      dossierDigest: stageCandidate.dossierDigest,
      evidenceReference: `qa:${base.taskId}-synthetic-execution`,
    },
    rollback: {
      planReference: `rollback:${base.taskId}-synthetic-plan`,
      snapshotReference: `snapshot:${base.taskId}-synthetic-snapshot`,
      rehearsalResult: "pass",
      evidenceReference: `rehearsal:${base.taskId}-synthetic-pass`,
    },
    stageCouncil: {
      verdict: "ready-to-execute",
      reviewedRevision: candidateRevision,
      dossierDigest: stageCandidate.dossierDigest,
      unresolvedBlockers: [],
      seatVerdicts: {},
    },
  };
  const contextSha256 = stageApprovalContextDigest(stage);
  for (const seat of COUNCIL_SEATS) {
    const role = seatRole[seat];
    stage.stageCouncil.seatVerdicts[seat] = {
      reviewerId: `reviewer-${seat}`,
      reviewerRole: role,
      verdict: "approve-stage-execution",
      reviewedRevision: candidateRevision,
      dossierDigest: stage.dossierDigest,
      preparationReviewId,
      preparationReviewSha256: stage.preparationReviewSha256,
      stageId,
      gateKind: "execute",
      scopeClass: base.scopeClass,
      actionClass: base.actionClass,
      stageContextSha256: contextSha256,
      evidenceReference: `synthetic:gate-b-${seat}`,
      attestationDigest: null,
    };
    stage.stageCouncil.seatVerdicts[seat].attestationDigest =
      computeStageApprovalSeatAttestationDigest(stage.stageCouncil.seatVerdicts[seat]);
  }
  const empty = {
    schemaVersion: STAGE_EXECUTION_SCHEMA_VERSION,
    registryId: "P0-R0-STAGE-APPROVAL-REGISTRY",
    scopeTaskIds: [...P0_R0_SUBSTANTIVE_TASK_IDS],
    historicalNonAuthorizingTaskIds: P0_R0_SCOPE_TASK_IDS.filter((taskId) => !P0_R0_SUBSTANTIVE_TASK_IDS.includes(taskId)),
    preparationReviews: [],
    stageApprovals: [],
  };
  const prepared = { ...empty, preparationReviews: [preparationReview] };
  const published = { ...prepared, stageApprovals: [stage] };
  const snapshots = new Map([
    [minimumGateABaseRevision, empty],
    [proposalRevision, empty],
    [projectionRevision, empty],
    [proposalMainPublicationRevision, empty],
    [preparationPublicationRevision, prepared],
    [preparationMainPublicationRevision, prepared],
    [candidateRevision, prepared],
    [implementationMainPublicationRevision, prepared],
    [stagePublicationRevision, published],
    [stageMainPublicationRevision, published],
  ]);
  const parentByRevision = new Map([
    [minimumGateABaseRevision, [sourceBaseRevision]],
    [proposalRevision, [minimumGateABaseRevision]],
    [projectionRevision, [proposalRevision]],
    [proposalMainPublicationRevision, [minimumGateABaseRevision, projectionRevision]],
    [preparationPublicationRevision, [proposalMainPublicationRevision]],
    [preparationMainPublicationRevision, [proposalMainPublicationRevision, preparationPublicationRevision]],
    [candidateRevision, [preparationMainPublicationRevision]],
    [implementationMainPublicationRevision, [preparationMainPublicationRevision, candidateRevision]],
    [stagePublicationRevision, [implementationMainPublicationRevision]],
    [stageMainPublicationRevision, [implementationMainPublicationRevision, stagePublicationRevision]],
  ]);
  const manifestBytes = Buffer.from(`${JSON.stringify(manifestDocument, null, 2)}\n`);
  const reviewerRegistryBytes = Buffer.from(`${JSON.stringify(reviewerRegistry, null, 2)}\n`);
  const objectIdByPath = new Map([
    [MANIFEST_PATH, rawDigest("manifest object").slice(0, 40)],
    [REVIEWER_REGISTRY_PATH, rawDigest("reviewer registry object").slice(0, 40)],
    ...PROPOSAL_PROJECTION_PATHS.map((relativePath) => [relativePath, rawDigest(`projection:${relativePath}`).slice(0, 40)]),
    ...ARTIFACT_KINDS.map((kind) => [artifactBindings[kind].path, rawDigest(`object:${kind}`).slice(0, 40)]),
    [STAGE_APPROVAL_REGISTRY_PATH, "4".repeat(40)],
  ]);
  objectIdByPath.set(MANIFEST_PATH, rawDigest("manifest object").slice(0, 40));
  const bytesForPath = (relativePath) => {
    if (relativePath === MANIFEST_PATH) return manifestBytes;
    if (relativePath === REVIEWER_REGISTRY_PATH) return reviewerRegistryBytes;
    const artifactKind = ARTIFACT_KINDS.find((kind) => artifactBindings[kind].path === relativePath);
    if (artifactKind) return Buffer.from(artifactBytes[artifactKind]);
    return PROPOSAL_PROJECTION_PATHS.includes(relativePath)
      ? Buffer.from(`synthetic projection for ${relativePath}\n`)
      : null;
  };
  const orderedRevisions = [
    minimumGateABaseRevision,
    proposalRevision,
    projectionRevision,
    proposalMainPublicationRevision,
    preparationPublicationRevision,
    preparationMainPublicationRevision,
    candidateRevision,
    implementationMainPublicationRevision,
    stagePublicationRevision,
    stageMainPublicationRevision,
  ];
  const revisionAncestors = (revision, values = new Set()) => {
    if (values.has(revision)) return values;
    values.add(revision);
    for (const parentRevision of parentByRevision.get(revision) ?? []) revisionAncestors(parentRevision, values);
    return values;
  };
  const isAncestor = (ancestor, descendant) => revisionAncestors(descendant).has(ancestor);
  const firstParentHistory = (tipRevision) => {
    const revisions = [];
    let revision = tipRevision;
    while (revision !== minimumGateABaseRevision) {
      if (!parentByRevision.has(revision)) return null;
      revisions.push(revision);
      [revision] = parentByRevision.get(revision);
    }
    return revisions.reverse();
  };
  const rawRecordTokens = (entries) => Buffer.from(`${entries.flatMap((entry) => [
    `:${entry.oldMode} ${entry.newMode} ${entry.oldObjectId} ${entry.newObjectId} ${entry.status}`,
    entry.path,
  ]).join("\0")}\0`);
  const addedRecord = (relativePath) => ({
    oldMode: "000000",
    newMode: "100644",
    oldObjectId: "0".repeat(40),
    newObjectId: objectIdByPath.get(relativePath),
    status: "A",
    path: relativePath,
  });
  const modifiedRecord = (relativePath) => ({
    oldMode: "100644",
    newMode: "100644",
    oldObjectId: rawDigest(`old:${relativePath}`).slice(0, 40),
    newObjectId: objectIdByPath.get(relativePath),
    status: "M",
    path: relativePath,
  });
  const rawDiffFor = (fromRevision, toRevision) => {
    if (fromRevision === proposalBaseRevision && toRevision === proposalRevision) {
      return ARTIFACT_KINDS.map((kind) => modifiedRecord(artifactBindings[kind].path));
    }
    if (fromRevision === proposalRevision && toRevision === projectionRevision) {
      return PROPOSAL_PROJECTION_PATHS.map((relativePath) => modifiedRecord(relativePath));
    }
    if (fromRevision === minimumGateABaseRevision && toRevision === proposalMainPublicationRevision) {
      return [
        ...ARTIFACT_KINDS.map((kind) => modifiedRecord(artifactBindings[kind].path)),
        ...PROPOSAL_PROJECTION_PATHS.map((relativePath) => modifiedRecord(relativePath)),
      ];
    }
    if ((fromRevision === proposalMainPublicationRevision && toRevision === preparationMainPublicationRevision)
      || (fromRevision === implementationMainPublicationRevision && toRevision === stageMainPublicationRevision)) {
      return [modifiedRecord(STAGE_APPROVAL_REGISTRY_PATH)];
    }
    return null;
  };
  const run = async (_command, args, options = {}) => {
    if (args[0] === "show" && args[1] === "-s") {
      return {
        ok: true,
        status: 0,
        stdout: `Synthetic Gate A proposal\n\nP0-Proposal-Author-Id: ${P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0]}\n`,
      };
    }
    if (args[0] === "show") {
      const separator = args[1].indexOf(":");
      const revision = args[1].slice(0, separator);
      const relativePath = args[1].slice(separator + 1);
      let bytes = null;
      if (relativePath === STAGE_APPROVAL_REGISTRY_PATH) {
        const value = snapshots.get(revision);
        if (value) bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
      } else if (!(revision === proposalBaseRevision && artifactPaths.includes(relativePath))) {
        bytes = bytesForPath(relativePath);
      }
      if (bytes === null) return { ok: false, status: 1, stdout: options.encoding === null ? Buffer.alloc(0) : "" };
      return { ok: true, status: 0, stdout: options.encoding === null ? bytes : bytes.toString("utf8") };
    }
    if (args[0] === "merge-base" && args[1] === "--is-ancestor") {
      return isAncestor(args[2], args[3])
        ? { ok: true, status: 0, stdout: "" }
        : { ok: false, status: 1, stdout: "" };
    }
    if (args[0] === "rev-list") {
      if (args.includes("--parents") && args.includes("--ancestry-path")
        && args.at(-1).startsWith(`${sourceBaseRevision}..`)) {
        const publishedRef = args.at(-1).slice(`${sourceBaseRevision}..`.length);
        const ancestors = revisionAncestors(publishedRef);
        const revisions = orderedRevisions.filter((revision) => ancestors.has(revision));
        if (!revisions.includes(publishedRef)) return { ok: false, status: 1, stdout: "" };
        return {
          ok: true,
          status: 0,
          stdout: `${revisions.map((revision) => (
            `${revision} ${(parentByRevision.get(revision) ?? []).join(" ")}`
          )).join("\n")}\n`,
        };
      }
      if (args.includes("--first-parent")) {
        const tipRevision = args.at(-1).slice(`${minimumGateABaseRevision}..`.length);
        const revisions = firstParentHistory(tipRevision);
        return revisions === null
          ? { ok: false, status: 1, stdout: "" }
          : { ok: true, status: 0, stdout: revisions.length > 0 ? `${revisions.join("\n")}\n` : "" };
      }
      if (args[1] === "--parents") {
        const revision = args.at(-1);
        const parents = parentByRevision.get(revision);
        return parents
          ? { ok: true, status: 0, stdout: `${revision} ${parents.join(" ")}\n` }
          : { ok: false, status: 1, stdout: "" };
      }
    }
    if (args[0] === "diff-tree") {
      return { ok: true, status: 0, stdout: `M\t${STAGE_APPROVAL_REGISTRY_PATH}\n` };
    }
    if (args[0] === "diff" && args.includes("--quiet")) {
      return { ok: true, status: 0, stdout: "" };
    }
    if (args[0] === "diff" && args.includes("--raw")) {
      const separator = args.indexOf("-z") + 1;
      const records = rawDiffFor(args[separator], args[separator + 1]);
      if (records === null) return { ok: false, status: 1, stdout: options.encoding === null ? Buffer.alloc(0) : "" };
      const bytes = rawRecordTokens(records);
      return { ok: true, status: 0, stdout: options.encoding === null ? bytes : bytes.toString("utf8") };
    }
    if (args[0] === "ls-tree") {
      const revision = args[1];
      const relativePath = args.at(-1);
      if (relativePath === STAGE_APPROVAL_REGISTRY_PATH) {
        if (!snapshots.has(revision)) return { ok: true, status: 0, stdout: "" };
        return { ok: true, status: 0, stdout: `100644 blob ${objectIdByPath.get(relativePath)}\t${relativePath}\n` };
      }
      if (revision === proposalBaseRevision && artifactPaths.includes(relativePath)) {
        return {
          ok: true,
          status: 0,
          stdout: `100644 blob ${rawDigest(`old:${relativePath}`).slice(0, 40)}\t${relativePath}\n`,
        };
      }
      if (!objectIdByPath.has(relativePath)) return { ok: true, status: 0, stdout: "" };
      return { ok: true, status: 0, stdout: `100644 blob ${objectIdByPath.get(relativePath)}\t${relativePath}\n` };
    }
    return { ok: false, status: 1, stdout: "" };
  };
  return {
    empty,
    prepared,
    published,
    preparationReview,
    stage,
    taskInput,
    sourceBaseRevision,
    minimumGateABaseRevision,
    proposalRevision,
    projectionRevision,
    proposalMainPublicationRevision,
    preparationPublicationRevision,
    preparationMainPublicationRevision,
    candidateRevision,
    stagePublicationRevision,
    implementationMainPublicationRevision,
    stageMainPublicationRevision,
    snapshots,
    artifactBindings,
    artifactBytes,
    manifestDocument,
    reviewerRegistry,
    run,
  };
}

function fixtureWithLinearChild(fixture, revision, parentRevision, registry) {
  const registryBytes = Buffer.from(`${JSON.stringify(registry, null, 2)}\n`);
  return async (command, args, options = {}) => {
    if (args[0] === "show" && args[1] === `${revision}:${STAGE_APPROVAL_REGISTRY_PATH}`) {
      return {
        ok: true,
        status: 0,
        stdout: options.encoding === null ? registryBytes : registryBytes.toString("utf8"),
      };
    }
    if (args[0] === "ls-tree" && args[1] === revision
      && args.at(-1) === STAGE_APPROVAL_REGISTRY_PATH) {
      return fixture.run(command, [args[0], parentRevision, ...args.slice(2)], options);
    }
    if (args[0] === "merge-base" && args[1] === "--is-ancestor" && args[3] === revision) {
      return fixture.run(command, [...args.slice(0, 3), parentRevision], options);
    }
    if (args[0] === "rev-list" && args.includes("--ancestry-path")
      && args.at(-1).endsWith(`..${revision}`)) {
      const parentArgs = [...args];
      parentArgs[parentArgs.length - 1] = args.at(-1).replace(revision, parentRevision);
      const result = await fixture.run(command, parentArgs, options);
      return result.ok
        ? { ...result, stdout: `${result.stdout.trimEnd()}\n${revision} ${parentRevision}\n` }
        : result;
    }
    if (args[0] === "rev-list" && args.includes("--first-parent")
      && args.at(-1).endsWith(`..${revision}`)) {
      const parentArgs = [...args];
      parentArgs[parentArgs.length - 1] = args.at(-1).replace(revision, parentRevision);
      const result = await fixture.run(command, parentArgs, options);
      return result.ok
        ? { ...result, stdout: `${result.stdout.trimEnd()}\n${revision}\n` }
        : result;
    }
    if (args[0] === "rev-list" && args[1] === "--parents" && args.at(-1) === revision) {
      return { ok: true, status: 0, stdout: `${revision} ${parentRevision}\n` };
    }
    return fixture.run(command, args, options);
  };
}

const registryFixture = stageRegistryFixture();

function resealPreparationReview(record) {
  const input = record.gateAProof.input;
  input.preparationReviewId = record.preparationReviewId;
  input.taskId = record.taskId;
  input.stageId = record.stageId;
  input.taskContractSha256 = record.gateAProof.context.expectedTask.taskContractSha256;
  input.requestedScope = {
    scopeClass: record.scopeClass,
    actionClass: record.actionClass,
  };
  input.candidate.revision = record.proposalCandidate.revision;
  input.candidate.baseRevision = record.proposalCandidate.baseRevision;
  for (const kind of ARTIFACT_KINDS) {
    input.candidate.artifacts[kind].path = record.proposalCandidate.artifactBindings[kind].path;
    input.candidate.artifacts[kind].sha256 = record.proposalCandidate.artifactBindings[kind].sha256;
  }
  input.candidate.dossierDigest = computePreparationDossierDigest(input);
  input.proposalAuthorEvidence.candidateRevision = input.candidate.revision;
  input.proposalAuthorEvidence.proposalAuthorIds = [...input.proposalAuthorIds];
  input.proposalAuthorEvidence.attestationDigest = computePreparationProposalAuthorAttestationDigest({
    preparationReviewId: input.preparationReviewId,
    taskId: input.taskId,
    stageId: input.stageId,
    candidateRevision: input.candidate.revision,
    dossierDigest: input.candidate.dossierDigest,
    proposalAuthorIds: input.proposalAuthorIds,
    evidenceReference: input.proposalAuthorEvidence.evidenceReference,
  });
  for (const kind of ARTIFACT_KINDS) {
    const review = input.artifactReviews[kind];
    Object.assign(review, {
      reviewedRevision: input.candidate.revision,
      dossierDigest: input.candidate.dossierDigest,
      artifactSha256: input.candidate.artifacts[kind].sha256,
    });
    review.attestationDigest = computeStageCouncilAttestationDigest({
      gateKind: "gate-a-prepare",
      preparationReviewId: input.preparationReviewId,
      taskId: input.taskId,
      stageId: input.stageId,
      subject: `artifact:${kind}`,
      decision: review.decision,
      reviewerId: review.reviewerId,
      reviewerRole: review.reviewerRole,
      reviewedRevision: review.reviewedRevision,
      dossierDigest: review.dossierDigest,
      artifactSha256: review.artifactSha256,
      scopeClass: input.requestedScope.scopeClass,
      actionClass: input.requestedScope.actionClass,
      evidenceReference: review.evidenceReference,
    });
  }
  input.council.reviewedRevision = input.candidate.revision;
  input.council.dossierDigest = input.candidate.dossierDigest;
  for (const seat of COUNCIL_SEATS) {
    const attestation = input.council.seatVerdicts[seat];
    Object.assign(attestation, {
      reviewedRevision: input.candidate.revision,
      dossierDigest: input.candidate.dossierDigest,
      preparationReviewId: input.preparationReviewId,
      stageId: input.stageId,
    });
    attestation.attestationDigest = computeStageCouncilAttestationDigest({
      gateKind: "gate-a-prepare",
      preparationReviewId: input.preparationReviewId,
      taskId: input.taskId,
      stageId: input.stageId,
      subject: `council:${seat}`,
      decision: attestation.verdict,
      reviewerId: attestation.reviewerId,
      reviewerRole: attestation.reviewerRole,
      reviewedRevision: attestation.reviewedRevision,
      dossierDigest: attestation.dossierDigest,
      scopeClass: input.requestedScope.scopeClass,
      actionClass: input.requestedScope.actionClass,
      evidenceReference: attestation.evidenceReference,
    });
  }
  record.gateAProof.context = {
    expectedTask: {
      taskId: input.taskId,
      milestone: input.milestone,
      dependencyIds: [...input.dependencyIds],
      acceptanceScenarioIds: [...input.acceptanceScenarioIds],
      taskContractSha256: record.gateAProof.context.expectedTask.taskContractSha256,
    },
    candidatePublication: {
      revision: input.candidate.revision,
      baseRevision: input.candidate.baseRevision,
      bytesVerified: true,
      fullDiffVerified: true,
      candidateOnFetchedMain: true,
    },
  };
  const evaluation = evaluateTaskPreparationGateA(input, record.gateAProof.context);
  record.gateAProof.result = gateAProofResult(evaluation);
  record.proposalCandidate.dossierDigest = input.candidate.dossierDigest;
  record.reviewerRegistrySha256 = computeReviewerRegistrySha256(input.reviewerRegistry);
  record.councilSeatAttestations = Object.fromEntries(COUNCIL_SEATS.map((seat) => [seat, {
    ...input.council.seatVerdicts[seat],
    scopeClass: record.scopeClass,
    actionClass: record.actionClass,
  }]));
  return record;
}

function resealStageApproval(record) {
  record.stageCouncil.reviewedRevision = record.candidateRevision;
  record.stageCouncil.dossierDigest = record.dossierDigest;
  const contextSha256 = stageApprovalContextDigest(record);
  for (const seat of COUNCIL_SEATS) {
    const attestation = record.stageCouncil.seatVerdicts[seat];
    Object.assign(attestation, {
      reviewedRevision: record.candidateRevision,
      dossierDigest: record.dossierDigest,
      preparationReviewId: record.preparationReviewId,
      preparationReviewSha256: record.preparationReviewSha256,
      stageId: record.stageId,
      gateKind: record.gateKind,
      scopeClass: record.scopeClass,
      actionClass: record.actionClass,
      stageContextSha256: contextSha256,
    });
  }
  return record;
}

function deliveryTransitionRegistryFixture() {
  const preparationReview = structuredClone(registryFixture.preparationReview);
  preparationReview.preparationReviewId = "P0-PREP-SPK-R0-001-STATUS-DELIVERY-TRANSITION";
  preparationReview.stageId = deliveryTransitionDefinition.stageId;
  preparationReview.scopeClass = deliveryTransitionDefinition.scopeClass;
  preparationReview.actionClass = deliveryTransitionDefinition.actionClass;
  preparationReview.evidenceReference = "synthetic:gate-a-delivery-transition";
  resealPreparationReview(preparationReview);

  const stage = structuredClone(registryFixture.stage);
  stage.stageId = deliveryTransitionDefinition.stageId;
  stage.preparationReviewId = preparationReview.preparationReviewId;
  stage.preparationReviewSha256 = preparationReviewRecordDigest(preparationReview);
  stage.scopeClass = deliveryTransitionDefinition.scopeClass;
  stage.actionClass = deliveryTransitionDefinition.actionClass;
  stage.idempotencyKey = deliveryTransitionDefinition.idempotencyKey;
  stage.stageDefinitionSha256 = stageBindingDigest(deliveryTransitionDefinition);
  stage.moduleId = deliveryTransitionDefinition.moduleId;
  resealStageApproval(stage);
  return {
    preparationReview,
    stage,
    registry: {
      ...registryFixture.empty,
      preparationReviews: [preparationReview],
      stageApprovals: [stage],
    },
  };
}

const deliveryTransitionRegistry = deliveryTransitionRegistryFixture();
expectCode(validateStageApprovalRegistry(deliveryTransitionRegistry.registry), "STAGE_APPROVAL_REGISTRY_VALID");
const deliveryTransitionModuleBindings = [{
  moduleId: DELIVERY_TRANSITION_GATE_B_CONTRACT.moduleId,
  moduleRelativePath: DELIVERY_TRANSITION_GATE_B_CONTRACT.modulePath,
  moduleSha256: deliveryTransitionRegistry.stage.moduleSha256,
  gitMode: "100644",
  argumentSetIds: [deliveryTransitionDefinition.argumentSetId],
}];
expectCode(validateStageRuntimeLifecycle({
  registry: deliveryTransitionRegistry.registry,
  definitions: [deliveryTransitionDefinition],
  moduleBindings: deliveryTransitionModuleBindings,
  outcomeVerificationModuleIds: [DELIVERY_TRANSITION_GATE_B_CONTRACT.moduleId],
}), "STAGE_RUNTIME_LIFECYCLE_VALID");
for (const taskId of ["AUD-001", "PC-001", "PRD-R0-001"]) {
  const preparationReview = structuredClone(deliveryTransitionRegistry.preparationReview);
  preparationReview.taskId = taskId;
  preparationReview.stageId = `P0-STAGE-${taskId}-STATUS-DELIVERY-TRANSITION`;
  preparationReview.preparationReviewId = `P0-PREP-${taskId}-STATUS-DELIVERY-TRANSITION`;
  resealPreparationReview(preparationReview);
  expectCode(validateStageApprovalRegistry({
    ...registryFixture.empty,
    preparationReviews: [preparationReview],
  }), "PREPARATION_REVIEW_RECORD_INVALID");
}
const genericPairTransitionRegistry = structuredClone(deliveryTransitionRegistry.registry);
genericPairTransitionRegistry.preparationReviews[0].scopeClass = "local-synthetic";
genericPairTransitionRegistry.preparationReviews[0].actionClass = "synthetic-foundation";
resealPreparationReview(genericPairTransitionRegistry.preparationReviews[0]);
expectCode(validateStageApprovalRegistry(genericPairTransitionRegistry), "PREPARATION_REVIEW_RECORD_INVALID");
const missingSuffixTransitionRegistry = structuredClone(deliveryTransitionRegistry.registry);
missingSuffixTransitionRegistry.preparationReviews[0].stageId = "P0-STAGE-SPK-R0-001-STATUS-MUTATION";
resealPreparationReview(missingSuffixTransitionRegistry.preparationReviews[0]);
expectCode(validateStageApprovalRegistry(missingSuffixTransitionRegistry), "PREPARATION_REVIEW_RECORD_INVALID");

function secondStageRegistryFixture() {
  const preparationReview = resealPreparationReview(structuredClone(registryFixture.preparationReview));
  preparationReview.preparationReviewId = "P0-PREP-SPK-R0-001-PRIVATE-READ";
  preparationReview.stageId = second.stageId;
  preparationReview.scopeClass = second.scopeClass;
  preparationReview.actionClass = second.actionClass;
  preparationReview.proposalCandidate.revision = "6".repeat(40);
  preparationReview.proposalCandidate.baseRevision = "7".repeat(40);
  preparationReview.proposalCandidate.dossierDigest = rawDigest("second proposal dossier");
  resealPreparationReview(preparationReview);

  const stage = structuredClone(registryFixture.stage);
  stage.stageId = second.stageId;
  stage.preparationReviewId = preparationReview.preparationReviewId;
  stage.preparationReviewSha256 = preparationReviewRecordDigest(preparationReview);
  stage.scopeClass = second.scopeClass;
  stage.actionClass = second.actionClass;
  stage.sequence = 2;
  stage.candidateRevision = "5".repeat(40);
  stage.dossierDigest = rawDigest("second implementation dossier");
  stage.predecessorReceiptSha256 = receiptDigest.slice("sha256:".length);
  stage.idempotencyKey = second.idempotencyKey;
  stage.stageDefinitionSha256 = stageBindingDigest(second);
  stage.candidate.revision = stage.candidateRevision;
  stage.candidate.baseRevision = "6".repeat(40);
  stage.candidate.dossierDigest = stage.dossierDigest;
  resealStageApproval(stage);
  return { preparationReview, stage };
}

expectCode(validateStageApprovalRegistry(registryFixture.empty), "STAGE_APPROVAL_REGISTRY_VALID");
expectCode(validateStageApprovalRegistry(registryFixture.published), "STAGE_APPROVAL_REGISTRY_VALID");
const chainedFixture = secondStageRegistryFixture();
const chainedRegistry = {
  ...registryFixture.empty,
  preparationReviews: [registryFixture.preparationReview, chainedFixture.preparationReview],
  stageApprovals: [registryFixture.stage, chainedFixture.stage],
};
expectCode(validateStageApprovalRegistry(chainedRegistry), "STAGE_APPROVAL_REGISTRY_VALID");
const duplicateSequenceStage = resealStageApproval(structuredClone(chainedFixture.stage));
duplicateSequenceStage.sequence = 1;
duplicateSequenceStage.predecessorReceiptSha256 = null;
resealStageApproval(duplicateSequenceStage);
expectCode(validateStageApprovalRegistry({
  ...chainedRegistry,
  stageApprovals: [registryFixture.stage, duplicateSequenceStage],
}), "STAGE_APPROVAL_SEQUENCE_INVALID");
const gapSequenceStage = resealStageApproval(structuredClone(chainedFixture.stage));
gapSequenceStage.sequence = 3;
resealStageApproval(gapSequenceStage);
expectCode(validateStageApprovalRegistry({
  ...chainedRegistry,
  stageApprovals: [registryFixture.stage, gapSequenceStage],
}), "STAGE_APPROVAL_SEQUENCE_INVALID");
assert.notEqual(registryFixture.preparationReview.proposalCandidate.revision, registryFixture.stage.candidateRevision); cases += 1;
assert.match(preparationReviewRecordDigest(registryFixture.preparationReview), /^[0-9a-f]{64}$/); cases += 1;
assert.match(stageApprovalRecordDigest(registryFixture.stage), /^[0-9a-f]{64}$/); cases += 1;
expectCode(await verifyStageApprovalRegistryContinuity({
  repoRoot: "/synthetic/repository",
  run: registryFixture.run,
  sourceBaseRevision: registryFixture.sourceBaseRevision,
  publishedRef: registryFixture.proposalRevision,
}), "STAGE_REGISTRY_CONTINUITY_VALID");
expectCode(await verifyStageApprovalRegistryContinuity({
  repoRoot: "/synthetic/repository",
  run: registryFixture.run,
  sourceBaseRevision: registryFixture.sourceBaseRevision,
  publishedRef: registryFixture.preparationPublicationRevision,
}), "STAGE_REGISTRY_CONTINUITY_VALID");
expectCode(await verifyStageApprovalRegistryContinuity({
  repoRoot: "/synthetic/repository",
  run: registryFixture.run,
  sourceBaseRevision: registryFixture.sourceBaseRevision,
  publishedRef: registryFixture.stagePublicationRevision,
}), "STAGE_REGISTRY_CONTINUITY_VALID");
const moduleBindings = [{
  moduleId: base.moduleId,
  moduleRelativePath: "tools/P0-reviewed-synthetic.mjs",
  moduleSha256: registryFixture.stage.moduleSha256,
  gitMode: "100644",
  argumentSetIds: [base.argumentSetId],
}];
expectCode(validateStageRuntimeLifecycle({
  registry: registryFixture.prepared,
  definitions: [],
  moduleBindings: [],
  outcomeVerificationModuleIds: [],
}), "STAGE_RUNTIME_LIFECYCLE_VALID");
expectCode(validateStageRuntimeLifecycle({
  registry: registryFixture.prepared,
  definitions: [base],
  moduleBindings,
  outcomeVerificationModuleIds: [base.moduleId],
}), "STAGE_RUNTIME_LIFECYCLE_VALID");
expectCode(validateStageRuntimeLifecycle({
  registry: registryFixture.published,
  definitions: [base],
  moduleBindings,
  outcomeVerificationModuleIds: [base.moduleId],
}), "STAGE_RUNTIME_LIFECYCLE_VALID");
expectCode(validateStageRuntimeLifecycle({
  registry: chainedRegistry,
  definitions: [base, second],
  moduleBindings,
  outcomeVerificationModuleIds: [base.moduleId],
}), "STAGE_RUNTIME_LIFECYCLE_VALID");
const wrongPredecessorDefinition = {
  ...second,
  predecessor: {
    stageId: "P0-STAGE-SPK-R0-001-UNRELATED-FIRST",
    receiptDigest,
  },
};
const wrongPredecessorStage = structuredClone(chainedFixture.stage);
wrongPredecessorStage.stageDefinitionSha256 = stageBindingDigest(wrongPredecessorDefinition);
resealStageApproval(wrongPredecessorStage);
expectCode(validateStageRuntimeLifecycle({
  registry: { ...chainedRegistry, stageApprovals: [registryFixture.stage, wrongPredecessorStage] },
  definitions: [base, wrongPredecessorDefinition],
  moduleBindings,
  outcomeVerificationModuleIds: [base.moduleId],
}), "STAGE_RUNTIME_PREDECESSOR_CHAIN_INVALID");
expectCode(validateStageRuntimeLifecycle({
  registry: registryFixture.published,
  definitions: [],
  moduleBindings: [],
  outcomeVerificationModuleIds: [],
}), "STAGE_RUNTIME_APPROVAL_ORPHANED");
expectCode(validateStageRuntimeLifecycle({
  registry: registryFixture.prepared,
  definitions: [base],
  moduleBindings,
  outcomeVerificationModuleIds: [],
}), "STAGE_RUNTIME_DEFINITION_MODULE_MISMATCH");
const historyResult = await verifyStageApprovalRegistryHistory({
  repoRoot: "/synthetic/repository",
  run: registryFixture.run,
  publishedRef: registryFixture.stagePublicationRevision,
  fetchedMainRevision: registryFixture.implementationMainPublicationRevision,
  stageId: registryFixture.stage.stageId,
});
expectCode(historyResult, "STAGE_APPROVAL_HISTORY_VALID");
assert.equal(historyResult.preparationReviewSha256, registryFixture.stage.preparationReviewSha256); cases += 1;
assert.equal(historyResult.stageApprovalSha256, stageApprovalRecordDigest(registryFixture.stage)); cases += 1;
const runtimeHistoryResult = await verifyStageApprovalRegistryHistory({
  repoRoot: "/synthetic/repository",
  run: registryFixture.run,
  publishedRef: registryFixture.stageMainPublicationRevision,
  stageId: registryFixture.stage.stageId,
});
expectCode(runtimeHistoryResult, "STAGE_APPROVAL_HISTORY_VALID");
assert.equal(runtimeHistoryResult.preparationMainPublicationRevision,
  registryFixture.preparationMainPublicationRevision); cases += 1;
assert.equal(runtimeHistoryResult.implementationMainPublicationRevision,
  registryFixture.implementationMainPublicationRevision); cases += 1;
assert.equal(runtimeHistoryResult.stageMainPublicationRevision,
  registryFixture.stageMainPublicationRevision); cases += 1;
const integratedTaskFilesSha256 = runtimeHistoryResult.record.candidate.taskFilesSha256;
const integratedStageEvaluation = evaluateStageExecutionGateB({
  schemaVersion: STAGE_EXECUTION_SCHEMA_VERSION,
  taskInput: structuredClone(registryFixture.taskInput),
  preparationReview: runtimeHistoryResult.preparationReview,
  stage: runtimeHistoryResult.record,
}, {
  taskEvaluationOptions: {
    phase: "activation",
    now: "2026-08-15T12:00:00.000Z",
    candidatePublication: {
      revision: registryFixture.candidateRevision,
      baseRevision: registryFixture.preparationMainPublicationRevision,
      baseAncestorOfCandidate: true,
      candidateBytesVerified: true,
      candidateOnFetchedMain: true,
      candidateDiffTaskFilesSha256: integratedTaskFilesSha256,
      candidateDiffExactMatchVerified: true,
      candidateDiffNoDeletionsVerified: true,
      candidateDiffExclusions: [...TASK_FILE_DIFF_EXCLUSIONS],
      publishedTaskFilesSha256: integratedTaskFilesSha256,
      currentTaskFilesSha256: integratedTaskFilesSha256,
      publishedTaskFilesBytesVerified: true,
      currentTaskFilesBytesVerified: true,
      publishedTaskFilesModesVerified: true,
      currentTaskFilesModesVerified: true,
      taskFilesCoverageVerified: true,
      publishedTaskFileContentClassesVerified: true,
      currentTaskFileContentClassesVerified: true,
      publishedTaskFileArchivesVerified: true,
      currentTaskFileArchivesVerified: true,
      currentDescendantDeltaPathsVerified: true,
      currentDescendantDeltaNoDeletionsVerified: true,
      candidateTaskContractSha256: runtimeHistoryResult.preparationTaskContractSha256,
      candidateTaskContractBytesVerified: true,
    },
    approvalPublication: {
      registryPath: STAGE_APPROVAL_REGISTRY_PATH,
      registrySha256: runtimeHistoryResult.registrySha256,
      registryBytesVerified: true,
      taskId: runtimeHistoryResult.taskId,
      stageId: runtimeHistoryResult.stageId,
      preparationReviewId: runtimeHistoryResult.preparationReview.preparationReviewId,
      publishedPreparationReviewSha256: runtimeHistoryResult.preparationReviewSha256,
      currentPreparationReviewSha256: runtimeHistoryResult.preparationReviewSha256,
      preparationReviewBytesVerified: true,
      preparationPublicationRevision: runtimeHistoryResult.preparationPublicationRevision,
      preparationCandidateAncestorOfPublication: true,
      publishedStageApprovalSha256: runtimeHistoryResult.stageApprovalSha256,
      currentStageApprovalSha256: runtimeHistoryResult.stageApprovalSha256,
      stageApprovalBytesVerified: true,
      stagePublicationRevision: runtimeHistoryResult.stagePublicationRevision,
      stageCandidateAncestorOfPublication: true,
      preparationPublicationAncestorOfStageCandidate: true,
      stageApprovalPublishedOnFetchedMain: true,
    },
    activation: {
      fetchSucceeded: true,
      worktreeClean: true,
      branch: "codex/integrated-stage-fixture",
      detached: false,
      upstream: "origin/main",
      headRevision: registryFixture.stageMainPublicationRevision,
      originMainRevision: registryFixture.stageMainPublicationRevision,
      approvalRecordReachableFromHead: false,
      approvalPublicationRevision: runtimeHistoryResult.stagePublicationRevision,
      stageApprovalRecordReachableFromHead: true,
      candidateReachableFromHead: true,
      candidateRevision: registryFixture.candidateRevision,
      taskFilesVerifiedAtRevision: registryFixture.stageMainPublicationRevision,
      runtimeRequestedScopeClass: registryFixture.stage.scopeClass,
      runtimeRequestedActionClass: registryFixture.stage.actionClass,
      externalSyncSourceRevision: registryFixture.stageMainPublicationRevision,
    },
  },
});
assert.equal(integratedStageEvaluation.executionAllowed, true,
  integratedStageEvaluation.gateResults.filter((gate) => !gate.passed).map((gate) => gate.code).join(", "));
assert.equal(integratedStageEvaluation.decision, "Ready to execute — Gate B"); cases += 2;
const preparationHistoryResult = await verifyPreparationReviewRegistryHistory({
  repoRoot: "/synthetic/repository",
  run: registryFixture.run,
  publishedRef: registryFixture.preparationPublicationRevision,
  fetchedMainRevision: registryFixture.proposalMainPublicationRevision,
  preparationReviewId: registryFixture.preparationReview.preparationReviewId,
});
expectCode(preparationHistoryResult, "PREPARATION_REVIEW_HISTORY_VALID");
assert.equal(preparationHistoryResult.preparationReviewSha256, registryFixture.stage.preparationReviewSha256); cases += 1;

const unrelatedPreparationPublication = stageRegistryFixture();
const unrelatedPreparationRun = async (command, args, options) => {
  if (args[0] === "diff-tree" && args.at(-1) === unrelatedPreparationPublication.preparationPublicationRevision) {
    return {
      ok: true,
      status: 0,
      stdout: `M\t${STAGE_APPROVAL_REGISTRY_PATH}\nM\tdocs/unrelated.md\n`,
    };
  }
  return unrelatedPreparationPublication.run(command, args, options);
};
expectCode(await verifyPreparationReviewRegistryHistory({
  repoRoot: "/synthetic/repository",
  run: unrelatedPreparationRun,
  publishedRef: unrelatedPreparationPublication.preparationPublicationRevision,
  fetchedMainRevision: unrelatedPreparationPublication.proposalMainPublicationRevision,
  preparationReviewId: unrelatedPreparationPublication.preparationReview.preparationReviewId,
}), "PREPARATION_REVIEW_PUBLICATION_SCOPE_INVALID");

const unrelatedStagePublication = stageRegistryFixture();
const unrelatedStageRun = async (command, args, options) => {
  if (args[0] === "diff-tree" && args.at(-1) === unrelatedStagePublication.stagePublicationRevision) {
    return {
      ok: true,
      status: 0,
      stdout: `M\t${STAGE_APPROVAL_REGISTRY_PATH}\nA\ttools/unrelated.mjs\n`,
    };
  }
  return unrelatedStagePublication.run(command, args, options);
};
expectCode(await verifyStageApprovalRegistryHistory({
  repoRoot: "/synthetic/repository",
  run: unrelatedStageRun,
  publishedRef: unrelatedStagePublication.stagePublicationRevision,
  fetchedMainRevision: unrelatedStagePublication.implementationMainPublicationRevision,
  stageId: unrelatedStagePublication.stage.stageId,
}), "STAGE_APPROVAL_PUBLICATION_SCOPE_INVALID");

const selfReferentialFixture = stageRegistryFixture();
selfReferentialFixture.snapshots.set(selfReferentialFixture.proposalRevision, selfReferentialFixture.prepared);
expectCode(await verifyStageApprovalRegistryHistory({
  repoRoot: "/synthetic/repository",
  run: selfReferentialFixture.run,
  publishedRef: selfReferentialFixture.stagePublicationRevision,
  fetchedMainRevision: selfReferentialFixture.implementationMainPublicationRevision,
  stageId: selfReferentialFixture.stage.stageId,
}), "PREPARATION_REVIEW_HISTORY_SELF_REFERENCE");

const rewriteFixture = stageRegistryFixture();
const rewrittenPreparation = structuredClone(rewriteFixture.preparationReview);
rewrittenPreparation.evidenceReference = "synthetic:gate-a-rewritten";
rewriteFixture.snapshots.set(rewriteFixture.candidateRevision, {
  ...rewriteFixture.prepared,
  preparationReviews: [rewrittenPreparation],
});
expectCode(await verifyStageApprovalRegistryHistory({
  repoRoot: "/synthetic/repository",
  run: rewriteFixture.run,
  publishedRef: rewriteFixture.stagePublicationRevision,
  fetchedMainRevision: rewriteFixture.implementationMainPublicationRevision,
  stageId: rewriteFixture.stage.stageId,
}), "PREPARATION_REVIEW_HISTORY_REWRITE");

const globalDeletionFixture = stageRegistryFixture();
globalDeletionFixture.snapshots.delete(globalDeletionFixture.candidateRevision);
expectCode(await verifyStageApprovalRegistryContinuity({
  repoRoot: "/synthetic/repository",
  run: globalDeletionFixture.run,
  sourceBaseRevision: globalDeletionFixture.sourceBaseRevision,
  publishedRef: globalDeletionFixture.stagePublicationRevision,
}), "STAGE_REGISTRY_CONTINUITY_DELETION");

const globalRewriteFixture = stageRegistryFixture();
const globallyRewrittenPreparation = structuredClone(globalRewriteFixture.preparationReview);
globallyRewrittenPreparation.evidenceReference = "synthetic:gate-a-global-rewrite";
globalRewriteFixture.snapshots.set(globalRewriteFixture.candidateRevision, {
  ...globalRewriteFixture.prepared,
  preparationReviews: [globallyRewrittenPreparation],
});
expectCode(await verifyStageApprovalRegistryContinuity({
  repoRoot: "/synthetic/repository",
  run: globalRewriteFixture.run,
  sourceBaseRevision: globalRewriteFixture.sourceBaseRevision,
  publishedRef: globalRewriteFixture.stagePublicationRevision,
}), "STAGE_REGISTRY_CONTINUITY_REWRITE");

for (const treeEntry of [
  `120000 blob ${"4".repeat(40)}`,
  `040000 tree ${"4".repeat(40)}`,
  `160000 commit ${"4".repeat(40)}`,
]) {
  const globalModeFixture = stageRegistryFixture();
  const globalModeRun = async (command, args, options) => {
    if (args[0] === "ls-tree" && args[1] === globalModeFixture.candidateRevision) {
      return { ok: true, status: 0, stdout: `${treeEntry}\t${STAGE_APPROVAL_REGISTRY_PATH}\n` };
    }
    return globalModeFixture.run(command, args, options);
  };
  expectCode(await verifyStageApprovalRegistryContinuity({
    repoRoot: "/synthetic/repository",
    run: globalModeRun,
    sourceBaseRevision: globalModeFixture.sourceBaseRevision,
    publishedRef: globalModeFixture.stagePublicationRevision,
  }), "STAGE_REGISTRY_CONTINUITY_PATH_TYPE_INVALID");
}

const globalBasePresentFixture = stageRegistryFixture();
globalBasePresentFixture.snapshots.set(globalBasePresentFixture.sourceBaseRevision, globalBasePresentFixture.empty);
expectCode(await verifyStageApprovalRegistryContinuity({
  repoRoot: "/synthetic/repository",
  run: globalBasePresentFixture.run,
  sourceBaseRevision: globalBasePresentFixture.sourceBaseRevision,
  publishedRef: globalBasePresentFixture.stagePublicationRevision,
}), "STAGE_REGISTRY_CONTINUITY_BASE_PRESENT");

const globalMergeFixture = stageRegistryFixture();
const missingMergeParent = "1".repeat(40);
const globalMergeRun = async (command, args, options) => {
  if (args[0] === "rev-list" && args.includes("--parents") && args.includes("--ancestry-path")) {
    const result = await globalMergeFixture.run(command, args, options);
    return {
      ...result,
      stdout: result.stdout.replace(
        `${globalMergeFixture.stagePublicationRevision} ${globalMergeFixture.implementationMainPublicationRevision}`,
        `${globalMergeFixture.stagePublicationRevision} ${globalMergeFixture.implementationMainPublicationRevision} ${missingMergeParent}`,
      ),
    };
  }
  return globalMergeFixture.run(command, args, options);
};
expectCode(await verifyStageApprovalRegistryContinuity({
  repoRoot: "/synthetic/repository",
  run: globalMergeRun,
  sourceBaseRevision: globalMergeFixture.sourceBaseRevision,
  publishedRef: globalMergeFixture.stagePublicationRevision,
}), "STAGE_REGISTRY_CONTINUITY_PARENT_GRAPH_INVALID");

const duplicateBranchFixture = stageRegistryFixture();
const duplicateBranchRevision = "2".repeat(40);
duplicateBranchFixture.snapshots.set(duplicateBranchRevision, duplicateBranchFixture.prepared);
const duplicateBranchRun = async (command, args, options) => {
  if (args[0] === "rev-list" && args.includes("--parents") && args.includes("--ancestry-path")) {
    return {
      ok: true,
      status: 0,
      stdout: [
        `${duplicateBranchFixture.minimumGateABaseRevision} ${duplicateBranchFixture.sourceBaseRevision}`,
        `${duplicateBranchFixture.proposalRevision} ${duplicateBranchFixture.minimumGateABaseRevision}`,
        `${duplicateBranchFixture.projectionRevision} ${duplicateBranchFixture.proposalRevision}`,
        `${duplicateBranchFixture.proposalMainPublicationRevision} ${duplicateBranchFixture.minimumGateABaseRevision} ${duplicateBranchFixture.projectionRevision}`,
        `${duplicateBranchFixture.preparationPublicationRevision} ${duplicateBranchFixture.proposalMainPublicationRevision}`,
        `${duplicateBranchRevision} ${duplicateBranchFixture.proposalMainPublicationRevision}`,
        `${duplicateBranchFixture.preparationMainPublicationRevision} ${duplicateBranchFixture.preparationPublicationRevision} ${duplicateBranchRevision}`,
        `${duplicateBranchFixture.candidateRevision} ${duplicateBranchFixture.preparationMainPublicationRevision}`,
        `${duplicateBranchFixture.implementationMainPublicationRevision} ${duplicateBranchFixture.preparationMainPublicationRevision} ${duplicateBranchFixture.candidateRevision}`,
        `${duplicateBranchFixture.stagePublicationRevision} ${duplicateBranchFixture.implementationMainPublicationRevision}`,
        "",
      ].join("\n"),
    };
  }
  return duplicateBranchFixture.run(command, args, options);
};
expectCode(await verifyStageApprovalRegistryContinuity({
  repoRoot: "/synthetic/repository",
  run: duplicateBranchRun,
  sourceBaseRevision: duplicateBranchFixture.sourceBaseRevision,
  publishedRef: duplicateBranchFixture.stagePublicationRevision,
}), "STAGE_REGISTRY_CONTINUITY_RECORD_PUBLICATION_CARDINALITY_INVALID");

const inheritedMergeFixture = stageRegistryFixture();
const absentSideRevision = "3".repeat(40);
const inheritedMergeRevision = "4".repeat(40);
inheritedMergeFixture.snapshots.set(inheritedMergeRevision, inheritedMergeFixture.empty);
const inheritedMergeRun = async (command, args, options) => {
  if (args[0] === "rev-list" && args.includes("--parents") && args.includes("--ancestry-path")) {
    return {
      ok: true,
      status: 0,
      stdout: [
        `${inheritedMergeFixture.minimumGateABaseRevision} ${inheritedMergeFixture.sourceBaseRevision}`,
        `${absentSideRevision} ${inheritedMergeFixture.sourceBaseRevision}`,
        `${inheritedMergeRevision} ${inheritedMergeFixture.minimumGateABaseRevision} ${absentSideRevision}`,
        `${inheritedMergeFixture.proposalRevision} ${inheritedMergeRevision}`,
        `${inheritedMergeFixture.projectionRevision} ${inheritedMergeFixture.proposalRevision}`,
        `${inheritedMergeFixture.proposalMainPublicationRevision} ${inheritedMergeRevision} ${inheritedMergeFixture.projectionRevision}`,
        `${inheritedMergeFixture.preparationPublicationRevision} ${inheritedMergeFixture.proposalMainPublicationRevision}`,
        `${inheritedMergeFixture.preparationMainPublicationRevision} ${inheritedMergeFixture.proposalMainPublicationRevision} ${inheritedMergeFixture.preparationPublicationRevision}`,
        `${inheritedMergeFixture.candidateRevision} ${inheritedMergeFixture.preparationMainPublicationRevision}`,
        `${inheritedMergeFixture.implementationMainPublicationRevision} ${inheritedMergeFixture.preparationMainPublicationRevision} ${inheritedMergeFixture.candidateRevision}`,
        `${inheritedMergeFixture.stagePublicationRevision} ${inheritedMergeFixture.implementationMainPublicationRevision}`,
        "",
      ].join("\n"),
    };
  }
  return inheritedMergeFixture.run(command, args, options);
};
expectCode(await verifyStageApprovalRegistryContinuity({
  repoRoot: "/synthetic/repository",
  run: inheritedMergeRun,
  publishedRef: inheritedMergeFixture.stagePublicationRevision,
}), "STAGE_REGISTRY_CONTINUITY_VALID");

const duplicateGenesisFixture = stageRegistryFixture();
const duplicateGenesisRevision = "3".repeat(40);
const duplicateGenesisMerge = "4".repeat(40);
duplicateGenesisFixture.snapshots.set(duplicateGenesisRevision, duplicateGenesisFixture.empty);
duplicateGenesisFixture.snapshots.set(duplicateGenesisMerge, duplicateGenesisFixture.empty);
const duplicateGenesisRun = async (command, args, options) => {
  if (args[0] === "rev-list" && args.includes("--parents") && args.includes("--ancestry-path")) {
    return {
      ok: true,
      status: 0,
      stdout: [
        `${duplicateGenesisFixture.minimumGateABaseRevision} ${duplicateGenesisFixture.sourceBaseRevision}`,
        `${duplicateGenesisRevision} ${duplicateGenesisFixture.sourceBaseRevision}`,
        `${duplicateGenesisMerge} ${duplicateGenesisFixture.minimumGateABaseRevision} ${duplicateGenesisRevision}`,
        "",
      ].join("\n"),
    };
  }
  if (args[0] === "merge-base" && args[1] === "--is-ancestor"
    && args[2] === duplicateGenesisFixture.sourceBaseRevision && args[3] === duplicateGenesisMerge) {
    return { ok: true, status: 0, stdout: "" };
  }
  return duplicateGenesisFixture.run(command, args, options);
};
expectCode(await verifyStageApprovalRegistryContinuity({
  repoRoot: "/synthetic/repository",
  run: duplicateGenesisRun,
  publishedRef: duplicateGenesisMerge,
}), "STAGE_REGISTRY_CONTINUITY_GENESIS_INVALID");

function preparationRegistryNegative(mutate, expectedCode) {
  const record = structuredClone(registryFixture.preparationReview);
  mutate(record);
  expectCode(validateStageApprovalRegistry({
    ...registryFixture.empty,
    preparationReviews: [record],
  }), expectedCode);
}

preparationRegistryNegative((record) => { delete record.gateAProof; }, "PREPARATION_REVIEW_RECORD_INVALID");
preparationRegistryNegative((record) => {
  record.gateAProof.result.executionAllowed = true;
}, "PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
preparationRegistryNegative((record) => {
  record.gateAProof.result.blockers = [{ code: "FORGED", reason: "Forged blocker." }];
}, "PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
preparationRegistryNegative((record) => {
  record.gateAProof.result.preparationBounds = ["local"];
}, "PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
preparationRegistryNegative((record) => {
  record.gateAProof.result.privateActionsAllowed = true;
}, "PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
preparationRegistryNegative((record) => {
  record.gateAProof.result.externalMutationsAllowed = true;
}, "PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
preparationRegistryNegative((record) => {
  record.gateAProof.result.sourceFingerprint = `sha256:${"0".repeat(64)}`;
}, "PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
preparationRegistryNegative((record) => {
  record.gateAProof.result.taskContractSha256 = "0".repeat(64);
}, "PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
preparationRegistryNegative((record) => {
  record.proposalCandidate.artifactBindings.product.sha256 = "0".repeat(64);
}, "PREPARATION_REVIEW_GATE_A_TOP_LEVEL_MISMATCH");
preparationRegistryNegative((record) => {
  record.reviewerRegistrySha256 = "0".repeat(64);
}, "PREPARATION_REVIEW_GATE_A_TOP_LEVEL_MISMATCH");
preparationRegistryNegative((record) => {
  record.gateAProof.input.artifactReviews.product.attestationDigest = `sha256:${"0".repeat(64)}`;
}, "PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
preparationRegistryNegative((record) => {
  record.gateAProof.input.dependencyEvidence[0].result = "fail";
}, "PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
preparationRegistryNegative((record) => {
  record.gateAProof.context.expectedTask.dependencyIds = [];
}, "PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
preparationRegistryNegative((record) => {
  record.gateAProof.context.expectedTask.taskContractSha256 = "0".repeat(64);
}, "PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
preparationRegistryNegative((record) => {
  record.gateAProof.input.council.seatVerdicts.design.reviewerId =
    record.gateAProof.input.council.seatVerdicts.product.reviewerId;
}, "PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
preparationRegistryNegative((record) => {
  record.proposalCandidate.dossierDigest = `sha256:${record.proposalCandidate.dossierDigest}`;
}, "PREPARATION_REVIEW_RECORD_INVALID");
preparationRegistryNegative((record) => {
  record.evidenceReference = "synthetic:../pending";
}, "PREPARATION_REVIEW_RECORD_INVALID");

const premergeGateAProof = await verifyPreparationGateAProofFromGit({
  repoRoot: "/synthetic/repository",
  run: registryFixture.run,
  publishedRef: registryFixture.preparationPublicationRevision,
  fetchedMainRevision: registryFixture.proposalMainPublicationRevision,
  preparationPublicationRevision: registryFixture.preparationPublicationRevision,
  record: registryFixture.preparationReview,
});
expectCode(premergeGateAProof, "PREPARATION_GATE_A_GIT_PROOF_VALID");
assert.equal(premergeGateAProof.preparationMainPublicationRevision, null); cases += 1;
const mergedGateAProof = await verifyPreparationGateAProofFromGit({
  repoRoot: "/synthetic/repository",
  run: registryFixture.run,
  publishedRef: registryFixture.preparationMainPublicationRevision,
  preparationPublicationRevision: registryFixture.preparationPublicationRevision,
  record: registryFixture.preparationReview,
});
expectCode(mergedGateAProof, "PREPARATION_GATE_A_GIT_PROOF_VALID");
assert.equal(mergedGateAProof.preparationMainPublicationRevision,
  registryFixture.preparationMainPublicationRevision); cases += 1;
assert.equal(registryFixture.preparationReview.gateAProof.input.acceptanceScenarioIds.length, 15); cases += 1;
assert.deepEqual(registryFixture.preparationReview.gateAProof.input.acceptanceScenarioIds,
  acceptanceScenarioIdsFor(registryFixture.preparationReview.taskId)); cases += 1;

async function expectGateAGitNegative({ fixture = stageRegistryFixture(), run, publishedRef, fetchedMainRevision, code }) {
  expectCode(await verifyPreparationGateAProofFromGit({
    repoRoot: "/synthetic/repository",
    run: run ?? fixture.run,
    publishedRef: publishedRef ?? fixture.preparationPublicationRevision,
    fetchedMainRevision: fetchedMainRevision ?? fixture.proposalMainPublicationRevision,
    preparationPublicationRevision: fixture.preparationPublicationRevision,
    record: fixture.preparationReview,
  }), code);
}

for (const message of [
  "Synthetic proposal\n",
  `Synthetic proposal\nP0-Proposal-Author-Id: ${P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0]}\n`,
  "Synthetic proposal\n\nP0-Proposal-Author-Id: attacker\n",
  `Synthetic proposal\n\np0-proposal-author-id: ${P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0]}\n`,
  `Synthetic proposal\n\n P0-Proposal-Author-Id: ${P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0]}\n`,
  `Synthetic proposal\n\nP0-Proposal-Author-Id=${P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0]}\n`,
  `Synthetic proposal\n\nP0-Proposal-Author-Id: ${P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0]}\np0-proposal-author-id: attacker\n`,
  `Synthetic proposal\n\nP0-Proposal-Author-Id: ${P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0]}\n\ntext after trailer\n`,
]) {
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => (
    args[0] === "show" && args[1] === "-s"
      ? { ok: true, status: 0, stdout: message }
      : fixture.run(command, args, options)
  );
  await expectGateAGitNegative({ fixture, run, code: "PREPARATION_GATE_A_PROPOSAL_AUTHOR_TRAILER_INVALID" });
}

const rawCandidateMutation = async (mutate, expectedCode = "PREPARATION_GATE_A_PROPOSAL_DIFF_INVALID") => {
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => {
    const result = await fixture.run(command, args, options);
    const separator = args.indexOf("-z") + 1;
    if (args[0] === "diff" && args.includes("--raw")
      && args[separator] === fixture.minimumGateABaseRevision
      && args[separator + 1] === fixture.proposalRevision) {
      return { ...result, stdout: mutate(result.stdout) };
    }
    return result;
  };
  await expectGateAGitNegative({ fixture, run, code: expectedCode });
};
await rawCandidateMutation((bytes) => Buffer.concat([bytes, Buffer.from(
  `:000000 100644 ${"0".repeat(40)} ${"1".repeat(40)} A\0docs/unrelated.md\0`,
)]));
await rawCandidateMutation((bytes) => Buffer.from(bytes.toString("utf8").replace(" M\0", " R100\0")));
await rawCandidateMutation((bytes) => Buffer.from(bytes.toString("utf8").replace(" M\0", " D\0")));
await rawCandidateMutation((bytes) => Buffer.from(bytes.toString("utf8").replace("100644 100644", "100644 100755")));

{
  const fixture = stageRegistryFixture();
  for (const kind of ARTIFACT_KINDS) {
    fixture.preparationReview.proposalCandidate.artifactBindings[kind].path =
      `docs/work-items/${fixture.preparationReview.taskId}/P0-${fixture.preparationReview.taskId}-parallel-${kind}.md`;
  }
  resealPreparationReview(fixture.preparationReview);
  await expectGateAGitNegative({ fixture, code: "PREPARATION_GATE_A_PROPOSAL_PUBLICATION_BOUNDARY_INVALID" });
}

{
  const fixture = stageRegistryFixture();
  const artifactPath = fixture.artifactBindings.product.path;
  const run = async (command, args, options) => (
    args[0] === "ls-tree" && args[1] === fixture.proposalRevision && args.at(-1) === artifactPath
      ? { ok: true, status: 0, stdout: `120000 blob ${"1".repeat(40)}\t${artifactPath}\n` }
      : fixture.run(command, args, options)
  );
  await expectGateAGitNegative({ fixture, run, code: "PREPARATION_GATE_A_ARTIFACT_BYTES_INVALID" });
}

{
  const fixture = stageRegistryFixture();
  const artifactPath = fixture.artifactBindings.product.path;
  const run = async (command, args, options) => (
    args[0] === "ls-tree" && args[1] === fixture.minimumGateABaseRevision && args.at(-1) === artifactPath
      ? { ok: true, status: 0, stdout: `100644 blob ${"1".repeat(40)}\t${artifactPath}\n` }
      : fixture.run(command, args, options)
  );
  await expectGateAGitNegative({ fixture, run, code: "PREPARATION_GATE_A_ARTIFACT_BYTES_INVALID" });
}

for (const topologyMutation of [
  (fixture, args, result) => args[0] === "rev-list" && args[1] === "--parents"
      && args.at(-1) === fixture.proposalMainPublicationRevision
    ? { ...result, stdout: result.stdout.trimEnd() + ` ${"1".repeat(40)}\n` }
    : result,
  (fixture, args, result) => args[0] === "rev-list" && args[1] === "--parents"
      && args.at(-1) === fixture.projectionRevision
    ? { ...result, stdout: `${fixture.projectionRevision} ${"1".repeat(40)}\n` }
    : result,
  (fixture, args, result) => args[0] === "diff" && args.includes("--quiet")
      && args.includes(fixture.proposalMainPublicationRevision)
    ? { ok: false, status: 1, stdout: "" }
    : result,
]) {
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => topologyMutation(
    fixture, args, await fixture.run(command, args, options),
  );
  await expectGateAGitNegative({ fixture, run, code: "PREPARATION_GATE_A_PROPOSAL_PUBLICATION_BOUNDARY_INVALID" });
}

{
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => {
    const result = await fixture.run(command, args, options);
    const separator = args.indexOf("-z") + 1;
    if (args[0] === "diff" && args.includes("--raw")
      && args[separator] === fixture.minimumGateABaseRevision
      && args[separator + 1] === fixture.proposalMainPublicationRevision) {
      return { ...result, stdout: Buffer.concat([result.stdout, Buffer.from(
        `:000000 100644 ${"0".repeat(40)} ${"1".repeat(40)} A\0tools/unrelated.mjs\0`,
      )]) };
    }
    return result;
  };
  await expectGateAGitNegative({ fixture, run, code: "PREPARATION_GATE_A_PROPOSAL_PUBLICATION_BOUNDARY_INVALID" });
}

{
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => {
    const result = await fixture.run(command, args, options);
    const separator = args.indexOf("-z") + 1;
    if (args[0] === "diff" && args.includes("--raw")
      && args[separator] === fixture.proposalRevision
      && args[separator + 1] === fixture.projectionRevision) {
      return { ...result, stdout: Buffer.concat([result.stdout, Buffer.from(
        `:100644 100644 ${"1".repeat(40)} ${"2".repeat(40)} M\0docs/project/PHASE1-RELEASE-PLAN.md\0`,
      )]) };
    }
    return result;
  };
  await expectGateAGitNegative({ fixture, run, code: "PREPARATION_GATE_A_PROPOSAL_PUBLICATION_BOUNDARY_INVALID" });
}

{
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => {
    const result = await fixture.run(command, args, options);
    const separator = args.indexOf("-z") + 1;
    if (args[0] === "diff" && args.includes("--raw")
      && args[separator] === fixture.proposalRevision
      && args[separator + 1] === fixture.projectionRevision) {
      return { ...result, stdout: Buffer.concat([result.stdout, Buffer.from(
        `:000000 100644 ${"0".repeat(40)} ${"1".repeat(40)} A\0tools/unrelated.mjs\0`,
      )]) };
    }
    return result;
  };
  await expectGateAGitNegative({ fixture, run, code: "PREPARATION_GATE_A_PROPOSAL_PUBLICATION_BOUNDARY_INVALID" });
}

{
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => {
    if (args[0] === "merge-base" && args[1] === "--is-ancestor"
      && args[2] === fixture.minimumGateABaseRevision && args[3] === fixture.minimumGateABaseRevision) {
      return { ok: false, status: 1, stdout: "" };
    }
    return fixture.run(command, args, options);
  };
  await expectGateAGitNegative({ fixture, run, code: "PREPARATION_GATE_A_PROPOSAL_UNPUBLISHED" });
}

for (const revisionKey of ["proposalRevision", "preparationPublicationRevision", "stagePublicationRevision"]) {
  const fixture = stageRegistryFixture();
  const revision = fixture[revisionKey];
  const changedRegistry = structuredClone(fixture.reviewerRegistry);
  changedRegistry.reviewers[0].active = false;
  const bytes = Buffer.from(`${JSON.stringify(changedRegistry, null, 2)}\n`);
  const run = async (command, args, options = {}) => (
    args[0] === "show" && args[1] === `${revision}:${REVIEWER_REGISTRY_PATH}`
      ? { ok: true, status: 0, stdout: options.encoding === null ? bytes : bytes.toString("utf8") }
      : fixture.run(command, args, options)
  );
  await expectGateAGitNegative({
    fixture,
    run,
    publishedRef: fixture.stagePublicationRevision,
    fetchedMainRevision: fixture.implementationMainPublicationRevision,
    code: "PREPARATION_GATE_A_REVIEWER_REGISTRY_MISMATCH",
  });
}

for (const revisionKey of ["proposalRevision", "preparationPublicationRevision", "stagePublicationRevision"]) {
  const fixture = stageRegistryFixture();
  const revision = fixture[revisionKey];
  const changedManifest = structuredClone(fixture.manifestDocument);
  changedManifest.tasks[0].taskDossier.acceptanceScenarioIds = ["SPK-R0-001-QA-FORGED"];
  const bytes = Buffer.from(`${JSON.stringify(changedManifest, null, 2)}\n`);
  const run = async (command, args, options = {}) => (
    args[0] === "show" && args[1] === `${revision}:${MANIFEST_PATH}`
      ? { ok: true, status: 0, stdout: options.encoding === null ? bytes : bytes.toString("utf8") }
      : fixture.run(command, args, options)
  );
  await expectGateAGitNegative({
    fixture,
    run,
    publishedRef: fixture.stagePublicationRevision,
    fetchedMainRevision: fixture.implementationMainPublicationRevision,
    code: "PREPARATION_GATE_A_EXPECTED_TASK_INVALID",
  });
}

for (const revisionKey of [
  "proposalRevision", "proposalMainPublicationRevision", "preparationPublicationRevision", "stagePublicationRevision",
]) {
  const fixture = stageRegistryFixture();
  const revision = fixture[revisionKey];
  const changedManifest = structuredClone(fixture.manifestDocument);
  changedManifest.tasks[0].requirementIds[0] = "LID-R1-FORGED";
  const bytes = Buffer.from(`${JSON.stringify(changedManifest, null, 2)}\n`);
  const run = async (command, args, options = {}) => (
    args[0] === "show" && args[1] === `${revision}:${MANIFEST_PATH}`
      ? { ok: true, status: 0, stdout: options.encoding === null ? bytes : bytes.toString("utf8") }
      : fixture.run(command, args, options)
  );
  await expectGateAGitNegative({
    fixture,
    run,
    publishedRef: fixture.stagePublicationRevision,
    fetchedMainRevision: fixture.implementationMainPublicationRevision,
    code: "PREPARATION_GATE_A_EXPECTED_TASK_INVALID",
  });
}

for (const { revisionKey, mutate } of [
  {
    revisionKey: "candidateRevision",
    mutate: (task) => { task.requirementIds[0] = "LID-R1-FORGED"; },
  },
  {
    revisionKey: "implementationMainPublicationRevision",
    mutate: (task) => { task.description = "Forged implementation-era outcome."; },
  },
]) {
  const fixture = stageRegistryFixture();
  const revision = fixture[revisionKey];
  const changedManifest = structuredClone(fixture.manifestDocument);
  mutate(changedManifest.tasks[0]);
  const bytes = Buffer.from(`${JSON.stringify(changedManifest, null, 2)}\n`);
  const run = async (command, args, options = {}) => (
    args[0] === "show" && args[1] === `${revision}:${MANIFEST_PATH}`
      ? { ok: true, status: 0, stdout: options.encoding === null ? bytes : bytes.toString("utf8") }
      : fixture.run(command, args, options)
  );
  expectCode(await verifyStageApprovalRegistryHistory({
    repoRoot: "/synthetic/repository",
    run,
    publishedRef: fixture.stagePublicationRevision,
    fetchedMainRevision: fixture.implementationMainPublicationRevision,
    stageId: fixture.stage.stageId,
  }), "PREPARATION_GATE_A_EXPECTED_TASK_INVALID");
}

for (const { publishedRefKey, revisionKey } of [
  { publishedRefKey: "stagePublicationRevision", revisionKey: "stagePublicationRevision" },
  { publishedRefKey: "stageMainPublicationRevision", revisionKey: "stageMainPublicationRevision" },
]) {
  const fixture = stageRegistryFixture();
  const revision = fixture[revisionKey];
  const changedManifest = structuredClone(fixture.manifestDocument);
  changedManifest.tasks[0].acceptanceEvidence = "Forged stage-era acceptance evidence.";
  const bytes = Buffer.from(`${JSON.stringify(changedManifest, null, 2)}\n`);
  const run = async (command, args, options = {}) => (
    args[0] === "show" && args[1] === `${revision}:${MANIFEST_PATH}`
      ? { ok: true, status: 0, stdout: options.encoding === null ? bytes : bytes.toString("utf8") }
      : fixture.run(command, args, options)
  );
  expectCode(await verifyStageApprovalRegistryHistory({
    repoRoot: "/synthetic/repository",
    run,
    publishedRef: fixture[publishedRefKey],
    fetchedMainRevision: fixture[publishedRefKey] === fixture.stagePublicationRevision
      ? fixture.implementationMainPublicationRevision
      : fixture.stageMainPublicationRevision,
    stageId: fixture.stage.stageId,
  }), "PREPARATION_GATE_A_EXPECTED_TASK_INVALID");
}

for (const revisionKey of ["preparationPublicationRevision", "stagePublicationRevision"]) {
  const fixture = stageRegistryFixture();
  const revision = fixture[revisionKey];
  const artifactPath = fixture.artifactBindings.product.path;
  const drifted = Buffer.from(`${fixture.artifactBytes.product}\npublication drift\n`);
  const run = async (command, args, options = {}) => (
    args[0] === "show" && args[1] === `${revision}:${artifactPath}`
      ? { ok: true, status: 0, stdout: options.encoding === null ? drifted : drifted.toString("utf8") }
      : fixture.run(command, args, options)
  );
  await expectGateAGitNegative({
    fixture,
    run,
    publishedRef: fixture.stagePublicationRevision,
    fetchedMainRevision: fixture.implementationMainPublicationRevision,
    code: "PREPARATION_GATE_A_ARTIFACT_CONTINUITY_INVALID",
  });
}

for (const revisionKey of ["preparationPublicationRevision", "stagePublicationRevision"]) {
  const fixture = stageRegistryFixture();
  const revision = fixture[revisionKey];
  const artifactPath = fixture.artifactBindings.product.path;
  const run = async (command, args, options) => (
    args[0] === "ls-tree" && args[1] === revision && args.at(-1) === artifactPath
      ? { ok: true, status: 0, stdout: `100755 blob ${"1".repeat(40)}\t${artifactPath}\n` }
      : fixture.run(command, args, options)
  );
  await expectGateAGitNegative({
    fixture,
    run,
    publishedRef: fixture.stagePublicationRevision,
    fetchedMainRevision: fixture.implementationMainPublicationRevision,
    code: "PREPARATION_GATE_A_ARTIFACT_CONTINUITY_INVALID",
  });
}

{
  const fixture = stageRegistryFixture();
  const artifactPath = fixture.artifactBindings.product.path;
  const unsafeBytes = Buffer.from(`${fixture.artifactBytes.product}\nhttp://10.0.0.1/evidence\n`);
  fixture.preparationReview.proposalCandidate.artifactBindings.product.sha256 = rawDigest(unsafeBytes);
  resealPreparationReview(fixture.preparationReview);
  const run = async (command, args, options = {}) => {
    if (args[0] === "show" && typeof args[1] === "string" && args[1].endsWith(`:${artifactPath}`)
      && !args[1].startsWith(`${fixture.minimumGateABaseRevision}:`)) {
      return { ok: true, status: 0, stdout: options.encoding === null ? unsafeBytes : unsafeBytes.toString("utf8") };
    }
    return fixture.run(command, args, options);
  };
  await expectGateAGitNegative({ fixture, run, code: "PREPARATION_GATE_A_ARTIFACT_MARKERS_INVALID" });
}

{
  const fixture = stageRegistryFixture();
  fixture.snapshots.set(fixture.proposalMainPublicationRevision, fixture.prepared);
  await expectGateAGitNegative({
    fixture,
    code: "PREPARATION_GATE_A_PUBLICATION_ORDER_INVALID",
  });
}

{
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => {
    if (args[0] === "rev-list" && args[1] === "--parents"
      && args.at(-1) === fixture.preparationPublicationRevision) {
      return { ok: true, status: 0, stdout: `${fixture.preparationPublicationRevision} ${fixture.projectionRevision}\n` };
    }
    return fixture.run(command, args, options);
  };
  expectCode(await verifyPreparationReviewRegistryHistory({
    repoRoot: "/synthetic/repository",
    run,
    publishedRef: fixture.preparationPublicationRevision,
    fetchedMainRevision: fixture.proposalMainPublicationRevision,
    preparationReviewId: fixture.preparationReview.preparationReviewId,
  }), "PREPARATION_REVIEW_PUBLICATION_SCOPE_INVALID");
}

{
  const fixture = stageRegistryFixture();
  const intermediateRevision = "6".repeat(40);
  const run = async (command, args, options) => {
    if (args[0] === "rev-list" && args[1] === "--parents"
      && args.at(-1) === fixture.preparationPublicationRevision) {
      return {
        ok: true,
        status: 0,
        stdout: `${fixture.preparationPublicationRevision} ${intermediateRevision}\n`,
      };
    }
    if (args[0] === "merge-base" && args[1] === "--is-ancestor"
      && args[2] === fixture.proposalMainPublicationRevision && args[3] === intermediateRevision) {
      return { ok: true, status: 0, stdout: "" };
    }
    return fixture.run(command, args, options);
  };
  expectCode(await verifyPreparationReviewRegistryHistory({
    repoRoot: "/synthetic/repository",
    run,
    publishedRef: fixture.preparationPublicationRevision,
    fetchedMainRevision: fixture.proposalMainPublicationRevision,
    preparationReviewId: fixture.preparationReview.preparationReviewId,
  }), "PREPARATION_REVIEW_PUBLICATION_SCOPE_INVALID");
}

for (const boundary of [
  {
    revisionKey: "proposalMainPublicationRevision",
    firstParentKey: "sourceBaseRevision",
    publishedRefKey: "preparationPublicationRevision",
    fetchedMainKey: "proposalMainPublicationRevision",
    code: "PREPARATION_GATE_A_PROPOSAL_PUBLICATION_BOUNDARY_INVALID",
  },
  {
    revisionKey: "preparationMainPublicationRevision",
    firstParentKey: "minimumGateABaseRevision",
    publishedRefKey: "preparationMainPublicationRevision",
    fetchedMainKey: "preparationMainPublicationRevision",
    code: "PREPARATION_GATE_A_PREPARATION_PUBLICATION_BOUNDARY_INVALID",
  },
]) {
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => {
    const result = await fixture.run(command, args, options);
    if (args[0] === "rev-list" && args[1] === "--parents" && args.at(-1) === fixture[boundary.revisionKey]) {
      const tokens = result.stdout.trim().split(/\s+/);
      tokens[1] = fixture[boundary.firstParentKey];
      return { ...result, stdout: `${tokens.join(" ")}\n` };
    }
    return result;
  };
  await expectGateAGitNegative({
    fixture,
    run,
    publishedRef: fixture[boundary.publishedRefKey],
    fetchedMainRevision: fixture[boundary.fetchedMainKey],
    code: boundary.code,
  });
}

{
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => {
    const result = await fixture.run(command, args, options);
    if (args[0] === "rev-list" && args[1] === "--parents"
      && args.at(-1) === fixture.preparationMainPublicationRevision) {
      return { ...result, stdout: result.stdout.trimEnd() + ` ${"1".repeat(40)}\n` };
    }
    return result;
  };
  await expectGateAGitNegative({
    fixture,
    run,
    publishedRef: fixture.preparationMainPublicationRevision,
    fetchedMainRevision: fixture.preparationMainPublicationRevision,
    code: "PREPARATION_GATE_A_PREPARATION_PUBLICATION_BOUNDARY_INVALID",
  });
}

{
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => (
    args[0] === "diff" && args.includes("--quiet")
      && args.includes(fixture.preparationMainPublicationRevision)
      ? { ok: false, status: 1, stdout: "" }
      : fixture.run(command, args, options)
  );
  await expectGateAGitNegative({
    fixture,
    run,
    publishedRef: fixture.preparationMainPublicationRevision,
    fetchedMainRevision: fixture.preparationMainPublicationRevision,
    code: "PREPARATION_GATE_A_PREPARATION_PUBLICATION_BOUNDARY_INVALID",
  });
}

expectCode(await verifyStageApprovalRegistryHistory({
  repoRoot: "/synthetic/repository",
  run: registryFixture.run,
  publishedRef: registryFixture.stagePublicationRevision,
  stageId: registryFixture.stage.stageId,
}), "STAGE_MAIN_PUBLICATION_BOUNDARY_INVALID");
expectCode(await verifyStageApprovalRegistryHistory({
  repoRoot: "/synthetic/repository",
  run: registryFixture.run,
  publishedRef: registryFixture.stagePublicationRevision,
  fetchedMainRevision: registryFixture.preparationMainPublicationRevision,
  stageId: registryFixture.stage.stageId,
}), "STAGE_IMPLEMENTATION_UNPUBLISHED");
{
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => {
    if (args[0] === "rev-list" && args[1] === "--parents" && args.at(-1) === fixture.candidateRevision) {
      return { ok: true, status: 0, stdout: `${fixture.candidateRevision} ${fixture.preparationPublicationRevision}\n` };
    }
    return fixture.run(command, args, options);
  };
  expectCode(await verifyStageApprovalRegistryHistory({
    repoRoot: "/synthetic/repository",
    run,
    publishedRef: fixture.stagePublicationRevision,
    fetchedMainRevision: fixture.implementationMainPublicationRevision,
    stageId: fixture.stage.stageId,
  }), "STAGE_IMPLEMENTATION_PREPARATION_BASE_INVALID");
}

for (const boundary of [
  {
    revisionKey: "implementationMainPublicationRevision",
    firstParentKey: "proposalMainPublicationRevision",
    code: "STAGE_IMPLEMENTATION_PUBLICATION_BOUNDARY_INVALID",
  },
  {
    revisionKey: "stageMainPublicationRevision",
    firstParentKey: "preparationMainPublicationRevision",
    code: "STAGE_MAIN_PUBLICATION_BOUNDARY_INVALID",
  },
]) {
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => {
    const result = await fixture.run(command, args, options);
    if (args[0] === "rev-list" && args[1] === "--parents" && args.at(-1) === fixture[boundary.revisionKey]) {
      const tokens = result.stdout.trim().split(/\s+/);
      tokens[1] = fixture[boundary.firstParentKey];
      return { ...result, stdout: `${tokens.join(" ")}\n` };
    }
    return result;
  };
  expectCode(await verifyStageApprovalRegistryHistory({
    repoRoot: "/synthetic/repository",
    run,
    publishedRef: fixture.stageMainPublicationRevision,
    stageId: fixture.stage.stageId,
  }), boundary.code);
}

for (const boundaryKey of ["implementationMainPublicationRevision", "stageMainPublicationRevision"]) {
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => {
    if (args[0] === "diff" && args.includes("--quiet") && args.includes(fixture[boundaryKey])) {
      return { ok: false, status: 1, stdout: "" };
    }
    return fixture.run(command, args, options);
  };
  expectCode(await verifyStageApprovalRegistryHistory({
    repoRoot: "/synthetic/repository",
    run,
    publishedRef: fixture.stageMainPublicationRevision,
    stageId: fixture.stage.stageId,
  }), boundaryKey === "implementationMainPublicationRevision"
    ? "STAGE_IMPLEMENTATION_PUBLICATION_BOUNDARY_INVALID"
    : "STAGE_MAIN_PUBLICATION_BOUNDARY_INVALID");
}

{
  const fixture = stageRegistryFixture();
  const run = async (command, args, options) => {
    if (args[0] === "rev-list" && args[1] === "--parents"
      && args.at(-1) === fixture.stagePublicationRevision) {
      return { ok: true, status: 0, stdout: `${fixture.stagePublicationRevision} ${fixture.candidateRevision}\n` };
    }
    return fixture.run(command, args, options);
  };
  expectCode(await verifyStageApprovalRegistryHistory({
    repoRoot: "/synthetic/repository",
    run,
    publishedRef: fixture.stageMainPublicationRevision,
    stageId: fixture.stage.stageId,
  }), "STAGE_MAIN_PUBLICATION_BOUNDARY_INVALID");
}

{
  const fixture = stageRegistryFixture();
  const intermediateRevision = "6".repeat(40);
  const run = async (command, args, options) => {
    if (args[0] === "rev-list" && args[1] === "--parents"
      && args.at(-1) === fixture.stagePublicationRevision) {
      return {
        ok: true,
        status: 0,
        stdout: `${fixture.stagePublicationRevision} ${intermediateRevision}\n`,
      };
    }
    if (args[0] === "merge-base" && args[1] === "--is-ancestor"
      && args[2] === fixture.implementationMainPublicationRevision && args[3] === intermediateRevision) {
      return { ok: true, status: 0, stdout: "" };
    }
    return fixture.run(command, args, options);
  };
  expectCode(await verifyStageApprovalRegistryHistory({
    repoRoot: "/synthetic/repository",
    run,
    publishedRef: fixture.stagePublicationRevision,
    fetchedMainRevision: fixture.implementationMainPublicationRevision,
    stageId: fixture.stage.stageId,
  }), "STAGE_APPROVAL_PUBLICATION_SCOPE_INVALID");
}

{
  const fixture = stageRegistryFixture();
  const extraPrHead = "5".repeat(40);
  expectCode(await verifyPreparationReviewRegistryHistory({
    repoRoot: "/synthetic/repository",
    run: fixtureWithLinearChild(
      fixture,
      extraPrHead,
      fixture.preparationPublicationRevision,
      fixture.prepared,
    ),
    publishedRef: extraPrHead,
    fetchedMainRevision: fixture.proposalMainPublicationRevision,
    preparationReviewId: fixture.preparationReview.preparationReviewId,
  }), "PREPARATION_REVIEW_PUBLICATION_SCOPE_INVALID");
}

{
  const fixture = stageRegistryFixture();
  const advancedFetchedMain = "6".repeat(40);
  expectCode(await verifyPreparationReviewRegistryHistory({
    repoRoot: "/synthetic/repository",
    run: fixtureWithLinearChild(
      fixture,
      advancedFetchedMain,
      fixture.proposalMainPublicationRevision,
      fixture.empty,
    ),
    publishedRef: fixture.preparationPublicationRevision,
    fetchedMainRevision: advancedFetchedMain,
    preparationReviewId: fixture.preparationReview.preparationReviewId,
  }), "PREPARATION_REVIEW_PUBLICATION_SCOPE_INVALID");
}

{
  const fixture = stageRegistryFixture();
  const extraPrHead = "5".repeat(40);
  expectCode(await verifyStageApprovalRegistryHistory({
    repoRoot: "/synthetic/repository",
    run: fixtureWithLinearChild(
      fixture,
      extraPrHead,
      fixture.stagePublicationRevision,
      fixture.published,
    ),
    publishedRef: extraPrHead,
    fetchedMainRevision: fixture.implementationMainPublicationRevision,
    stageId: fixture.stage.stageId,
  }), "STAGE_APPROVAL_PUBLICATION_SCOPE_INVALID");
}

{
  const fixture = stageRegistryFixture();
  const advancedFetchedMain = "6".repeat(40);
  expectCode(await verifyStageApprovalRegistryHistory({
    repoRoot: "/synthetic/repository",
    run: fixtureWithLinearChild(
      fixture,
      advancedFetchedMain,
      fixture.implementationMainPublicationRevision,
      fixture.prepared,
    ),
    publishedRef: fixture.stagePublicationRevision,
    fetchedMainRevision: advancedFetchedMain,
    stageId: fixture.stage.stageId,
  }), "STAGE_APPROVAL_PUBLICATION_SCOPE_INVALID");
}

console.log(JSON.stringify({ ok: true, code: "SELF_TEST_OK", cases, productionActions: 0 }));
