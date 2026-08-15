import assert from "node:assert/strict";
import crypto from "node:crypto";
import {
  preparationReviewRecordDigest,
  PRODUCTION_STAGED_ACTIONS,
  stageApprovalContextDigest,
  stageApprovalRecordDigest,
  STAGED_ACTION_SCHEMA_VERSION,
  stageBindingDigest,
  STAGE_APPROVAL_REGISTRY_SOURCE_BASE_REVISION,
  validateGateAPreparationDecision,
  validateStageApprovalRegistry,
  validateStageChain,
  validateStageReceipt,
  validateStageRuntimeLifecycle,
  validateStagedActionDefinition,
  verifyPreparationReviewRegistryHistory,
  verifyStageApprovalRegistryContinuity,
  verifyStageApprovalRegistryHistory,
} from "./P0-staged-actions.mjs";
import { canonicalJson } from "./P0-content-safety.mjs";
import {
  ARTIFACT_KINDS,
  COUNCIL_SEATS,
  DELIVERY_TRANSITION_GATE_B_CONTRACT,
  P0_R0_SCOPE_TASK_IDS,
  P0_R0_SUBSTANTIVE_TASK_IDS,
  STAGE_APPROVAL_REGISTRY_PATH,
  STAGE_EXECUTION_SCHEMA_VERSION,
} from "./P0-readiness-gates.mjs";

const REVISION = "a".repeat(40);
const DIGEST = `sha256:${"b".repeat(64)}`;
let cases = 0;

function expectCode(actual, code) {
  assert.equal(actual.code, code);
  cases += 1;
}

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

for (const [change, code] of [
  [{ taskId: "AUD-001" }, "STAGE_TASK_NOT_ALLOWLISTED"],
  [{ taskId: "PRD-R1-001" }, "STAGE_TASK_NOT_ALLOWLISTED"],
  [{ scopeClass: "private-execution", actionClass: "deployment" }, "STAGE_SCOPE_ACTION_NOT_OWNED"],
  [{ stageId: "P0-STAGE-ENG-R0-001-WRONG-TASK" }, "STAGE_ID_INVALID"],
  [{ idempotencyKey: "short" }, "STAGE_IDEMPOTENCY_KEY_INVALID"],
  [{ moduleId: "../../evil" }, "STAGE_RUNNER_BINDING_INVALID"],
  [{ argumentSetId: "/tmp/args" }, "STAGE_RUNNER_BINDING_INVALID"],
  [{ deadlineMs: 999 }, "STAGE_DEADLINE_INVALID"],
  [{ deadlineMs: 300_001 }, "STAGE_DEADLINE_INVALID"],
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

function stageRegistryFixture() {
  const sourceBaseRevision = STAGE_APPROVAL_REGISTRY_SOURCE_BASE_REVISION;
  const proposalRevision = "8".repeat(40);
  const proposalBaseRevision = "9".repeat(40);
  const preparationPublicationRevision = "a".repeat(40);
  const candidateRevision = "b".repeat(40);
  const stagePublicationRevision = "c".repeat(40);
  const stageId = base.stageId;
  const preparationReviewId = "P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION";
  const artifactBindings = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
    path: `docs/synthetic/${kind}.md`,
    sha256: rawDigest(`artifact:${kind}`),
  }]));
  const preparationReview = {
    preparationReviewId,
    taskId: base.taskId,
    stageId,
    state: "accepted",
    scopeClass: base.scopeClass,
    actionClass: base.actionClass,
    proposalCandidate: {
      revision: proposalRevision,
      baseRevision: proposalBaseRevision,
      dossierDigest: rawDigest("proposal dossier"),
      artifactBindings,
    },
    reviewerRegistrySha256: rawDigest("reviewer registry"),
    councilSeatAttestations: {},
    evidenceReference: "synthetic:gate-a:accepted",
  };
  for (const [index, seat] of COUNCIL_SEATS.entries()) {
    preparationReview.councilSeatAttestations[seat] = {
      reviewerId: `reviewer-preparation-${index + 1}`,
      reviewerRole: `role-${index + 1}`,
      verdict: "approve-preparation-candidate",
      reviewedRevision: proposalRevision,
      dossierDigest: preparationReview.proposalCandidate.dossierDigest,
      preparationReviewId,
      stageId,
      scopeClass: base.scopeClass,
      actionClass: base.actionClass,
      evidenceReference: `synthetic:gate-a:${seat}`,
      attestationDigest: `sha256:${rawDigest(`preparation seat:${seat}`)}`,
    };
  }
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
    dossierDigest: rawDigest("implementation dossier"),
    predecessorReceiptSha256: null,
    idempotencyKey: base.idempotencyKey,
    stageDefinitionSha256: stageBindingDigest(base),
    moduleId: base.moduleId,
    moduleSha256: `sha256:${rawDigest("reviewed module")}`,
    candidate: {
      revision: candidateRevision,
      baseRevision: preparationPublicationRevision,
      dossierDigest: rawDigest("implementation dossier"),
      taskContractSha256: rawDigest("task contract"),
      artifacts: artifactBindings,
      taskFiles: [],
      taskFilesSha256: rawDigest("task files"),
      implementerIds: ["implementer-synthetic"],
      evidenceProducerIds: ["evidence-producer-synthetic"],
    },
    artifactReviews: Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {}])),
    designCoverage: {},
    dependencyEvidence: [],
    openDecisions: [],
    specialistVetoes: [],
    privateAuthority: null,
    reviewerRegistrySha256: rawDigest("reviewer registry"),
    ownerActionStateSha256: rawDigest("owner action state"),
    requirementEvidence: [],
    independentQa: {},
    rollback: {},
    stageCouncil: {
      verdict: "ready-to-execute",
      reviewedRevision: candidateRevision,
      dossierDigest: rawDigest("implementation dossier"),
      unresolvedBlockers: [],
      seatVerdicts: {},
    },
  };
  const contextSha256 = stageApprovalContextDigest(stage);
  for (const [index, seat] of COUNCIL_SEATS.entries()) {
    stage.stageCouncil.seatVerdicts[seat] = {
      reviewerId: `reviewer-stage-${index + 1}`,
      reviewerRole: `role-${index + 1}`,
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
      evidenceReference: `synthetic:gate-b:${seat}`,
      attestationDigest: `sha256:${rawDigest(`stage seat:${seat}`)}`,
    };
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
    [proposalRevision, empty],
    [preparationPublicationRevision, prepared],
    [candidateRevision, prepared],
    [stagePublicationRevision, published],
  ]);
  const parentByRevision = new Map([
    [proposalRevision, sourceBaseRevision],
    [preparationPublicationRevision, proposalRevision],
    [candidateRevision, preparationPublicationRevision],
    [stagePublicationRevision, candidateRevision],
  ]);
  const run = async (_command, args, options = {}) => {
    if (args[0] === "show") {
      const revision = args[1].split(":", 1)[0];
      const value = snapshots.get(revision);
      if (!value) return { ok: false, status: 1, stdout: options.encoding === null ? Buffer.alloc(0) : "" };
      const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
      return { ok: true, status: 0, stdout: options.encoding === null ? bytes : bytes.toString("utf8") };
    }
    if (args[0] === "merge-base") return { ok: true, status: 0, stdout: "" };
    if (args[0] === "rev-list") {
      if (args.includes("--parents") && args.includes("--ancestry-path")
        && args.at(-1).startsWith(`${sourceBaseRevision}..`)) {
        const publishedRef = args.at(-1).slice(`${sourceBaseRevision}..`.length);
        const revisions = [proposalRevision, preparationPublicationRevision, candidateRevision, stagePublicationRevision];
        const end = revisions.indexOf(publishedRef);
        if (end === -1) return { ok: false, status: 1, stdout: "" };
        return {
          ok: true,
          status: 0,
          stdout: `${revisions.slice(0, end + 1)
            .map((revision) => `${revision} ${parentByRevision.get(revision)}`).join("\n")}\n`,
        };
      }
      if (args[1] === "--parents") {
        const revision = args.at(-1);
        const parent = parentByRevision.get(revision);
        return parent
          ? { ok: true, status: 0, stdout: `${revision} ${parent}\n` }
          : { ok: false, status: 1, stdout: "" };
      }
      const range = args.at(-1);
      return { ok: true, status: 0, stdout: range.endsWith(stagePublicationRevision)
        ? `${preparationPublicationRevision}\n${candidateRevision}\n${stagePublicationRevision}\n`
        : `${preparationPublicationRevision}\n` };
    }
    if (args[0] === "diff-tree") {
      return { ok: true, status: 0, stdout: `M\t${STAGE_APPROVAL_REGISTRY_PATH}\n` };
    }
    if (args[0] === "ls-tree") {
      if (!snapshots.has(args[1])) return { ok: true, status: 0, stdout: "" };
      return { ok: true, status: 0, stdout: `100644 blob ${"4".repeat(40)}\t${STAGE_APPROVAL_REGISTRY_PATH}\n` };
    }
    return { ok: false, status: 1, stdout: "" };
  };
  return {
    empty,
    prepared,
    published,
    preparationReview,
    stage,
    sourceBaseRevision,
    proposalRevision,
    preparationPublicationRevision,
    candidateRevision,
    stagePublicationRevision,
    snapshots,
    run,
  };
}

const registryFixture = stageRegistryFixture();

function resealPreparationReview(record) {
  for (const seat of COUNCIL_SEATS) {
    const attestation = record.councilSeatAttestations[seat];
    Object.assign(attestation, {
      reviewedRevision: record.proposalCandidate.revision,
      dossierDigest: record.proposalCandidate.dossierDigest,
      preparationReviewId: record.preparationReviewId,
      stageId: record.stageId,
      scopeClass: record.scopeClass,
      actionClass: record.actionClass,
    });
  }
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
  preparationReview.evidenceReference = "synthetic:gate-a:delivery-transition";
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
  stageId: registryFixture.stage.stageId,
});
expectCode(historyResult, "STAGE_APPROVAL_HISTORY_VALID");
assert.equal(historyResult.preparationReviewSha256, registryFixture.stage.preparationReviewSha256); cases += 1;
assert.equal(historyResult.stageApprovalSha256, stageApprovalRecordDigest(registryFixture.stage)); cases += 1;
const preparationHistoryResult = await verifyPreparationReviewRegistryHistory({
  repoRoot: "/synthetic/repository",
  run: registryFixture.run,
  publishedRef: registryFixture.preparationPublicationRevision,
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
  stageId: unrelatedStagePublication.stage.stageId,
}), "STAGE_APPROVAL_PUBLICATION_SCOPE_INVALID");

const selfReferentialFixture = stageRegistryFixture();
selfReferentialFixture.snapshots.set(selfReferentialFixture.proposalRevision, selfReferentialFixture.prepared);
expectCode(await verifyStageApprovalRegistryHistory({
  repoRoot: "/synthetic/repository",
  run: selfReferentialFixture.run,
  publishedRef: selfReferentialFixture.stagePublicationRevision,
  stageId: selfReferentialFixture.stage.stageId,
}), "PREPARATION_REVIEW_HISTORY_SELF_REFERENCE");

const rewriteFixture = stageRegistryFixture();
const rewrittenPreparation = structuredClone(rewriteFixture.preparationReview);
rewrittenPreparation.evidenceReference = "synthetic:gate-a:rewritten";
rewriteFixture.snapshots.set(rewriteFixture.candidateRevision, {
  ...rewriteFixture.prepared,
  preparationReviews: [rewrittenPreparation],
});
expectCode(await verifyStageApprovalRegistryHistory({
  repoRoot: "/synthetic/repository",
  run: rewriteFixture.run,
  publishedRef: rewriteFixture.stagePublicationRevision,
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
globallyRewrittenPreparation.evidenceReference = "synthetic:gate-a:global-rewrite";
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
const missingMergeParent = "d".repeat(40);
const globalMergeRun = async (command, args, options) => {
  if (args[0] === "rev-list" && args.includes("--parents") && args.includes("--ancestry-path")) {
    const result = await globalMergeFixture.run(command, args, options);
    return {
      ...result,
      stdout: result.stdout.replace(
        `${globalMergeFixture.stagePublicationRevision} ${globalMergeFixture.candidateRevision}`,
        `${globalMergeFixture.stagePublicationRevision} ${globalMergeFixture.candidateRevision} ${missingMergeParent}`,
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
const duplicateBranchRevision = "d".repeat(40);
duplicateBranchFixture.snapshots.set(duplicateBranchRevision, duplicateBranchFixture.prepared);
const duplicateBranchRun = async (command, args, options) => {
  if (args[0] === "rev-list" && args.includes("--parents") && args.includes("--ancestry-path")) {
    return {
      ok: true,
      status: 0,
      stdout: [
        `${duplicateBranchFixture.proposalRevision} ${duplicateBranchFixture.sourceBaseRevision}`,
        `${duplicateBranchFixture.preparationPublicationRevision} ${duplicateBranchFixture.proposalRevision}`,
        `${duplicateBranchRevision} ${duplicateBranchFixture.proposalRevision}`,
        `${duplicateBranchFixture.candidateRevision} ${duplicateBranchFixture.preparationPublicationRevision} ${duplicateBranchRevision}`,
        `${duplicateBranchFixture.stagePublicationRevision} ${duplicateBranchFixture.candidateRevision}`,
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
const absentSideRevision = "e".repeat(40);
const inheritedMergeRevision = "f".repeat(40);
inheritedMergeFixture.snapshots.set(inheritedMergeRevision, inheritedMergeFixture.empty);
const inheritedMergeRun = async (command, args, options) => {
  if (args[0] === "rev-list" && args.includes("--parents") && args.includes("--ancestry-path")) {
    return {
      ok: true,
      status: 0,
      stdout: [
        `${inheritedMergeFixture.proposalRevision} ${inheritedMergeFixture.sourceBaseRevision}`,
        `${absentSideRevision} ${inheritedMergeFixture.sourceBaseRevision}`,
        `${inheritedMergeRevision} ${inheritedMergeFixture.proposalRevision} ${absentSideRevision}`,
        `${inheritedMergeFixture.preparationPublicationRevision} ${inheritedMergeRevision}`,
        `${inheritedMergeFixture.candidateRevision} ${inheritedMergeFixture.preparationPublicationRevision}`,
        `${inheritedMergeFixture.stagePublicationRevision} ${inheritedMergeFixture.candidateRevision}`,
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
const duplicateGenesisRevision = "e".repeat(40);
const duplicateGenesisMerge = "f".repeat(40);
duplicateGenesisFixture.snapshots.set(duplicateGenesisRevision, duplicateGenesisFixture.empty);
duplicateGenesisFixture.snapshots.set(duplicateGenesisMerge, duplicateGenesisFixture.empty);
const duplicateGenesisRun = async (command, args, options) => {
  if (args[0] === "rev-list" && args.includes("--parents") && args.includes("--ancestry-path")) {
    return {
      ok: true,
      status: 0,
      stdout: [
        `${duplicateGenesisFixture.proposalRevision} ${duplicateGenesisFixture.sourceBaseRevision}`,
        `${duplicateGenesisRevision} ${duplicateGenesisFixture.sourceBaseRevision}`,
        `${duplicateGenesisMerge} ${duplicateGenesisFixture.proposalRevision} ${duplicateGenesisRevision}`,
        "",
      ].join("\n"),
    };
  }
  return duplicateGenesisFixture.run(command, args, options);
};
expectCode(await verifyStageApprovalRegistryContinuity({
  repoRoot: "/synthetic/repository",
  run: duplicateGenesisRun,
  publishedRef: duplicateGenesisMerge,
}), "STAGE_REGISTRY_CONTINUITY_GENESIS_INVALID");

console.log(JSON.stringify({ ok: true, code: "SELF_TEST_OK", cases, productionActions: 0 }));
