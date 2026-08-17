import crypto from "node:crypto";
import {
  ARTIFACT_KINDS,
  COUNCIL_SEATS,
  DELIVERY_TRANSITION_GATE_B_CONTRACT,
  P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS,
  P0_R0_SCOPE_TASK_IDS,
  P0_R0_SUBSTANTIVE_TASK_IDS,
  SCOPE_ACTION_COMPATIBILITY,
  STAGE_APPROVAL_REGISTRY_PATH,
  STAGE_EXECUTION_SCHEMA_VERSION,
  STAGE_LIFECYCLE_STATES,
  TASK_PREPARATION_SCHEMA_VERSION,
  TASK_EXECUTION_CONTRACT,
  TERMINAL_STAGE_STATES,
  computeTaskContractSha256,
  computeReviewerRegistrySha256,
  evaluateTaskPreparationGateA,
  isDedicatedDeliveryTransitionScopeAction,
  parseArtifactControlMarkers,
} from "./P0-readiness-gates.mjs";
import { acceptanceScenarioIdsFor } from "./P0-build-task-readiness-input.mjs";
import {
  canonicalJson,
  hasExactKeys,
  isPlainRecord,
  publicTextBytesAreSafe,
} from "./P0-content-safety.mjs";
import { parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";

export {
  P0_R0_SUBSTANTIVE_TASK_IDS,
  STAGE_LIFECYCLE_STATES,
  TERMINAL_STAGE_STATES,
};

export const STAGED_ACTION_SCHEMA_VERSION = "1.0.0";
export const STAGE_APPROVAL_REGISTRY_SOURCE_BASE_REVISION = "2dc4d05cdeca8cb9aeacf393076f6c6f946ff62b";
export const STAGE_APPROVAL_REGISTRY_BOOTSTRAP_PARENT_REVISION = "43c5ccb772bd5e4cabc52d73aa40c35ed999dbb7";
export const P0_R0_GATE_A_MINIMUM_BASE_REVISION = "9eb923475421fe566a8d24d89fe09c42f26d2158";
const TASK_SET = new Set(P0_R0_SUBSTANTIVE_TASK_IDS);
const HISTORICAL_TASK_IDS = Object.freeze(P0_R0_SCOPE_TASK_IDS.filter((taskId) => !TASK_SET.has(taskId)));
const TERMINAL_STATE_SET = new Set(TERMINAL_STAGE_STATES);
const FULL_REVISION = /^[0-9a-f]{40}$/;
const SHA256_DIGEST = /^sha256:[0-9a-f]{64}$/;
const STAGE_ID = /^P0-STAGE-[A-Z0-9]+(?:-[A-Z0-9]+){2,}-[A-Z0-9][A-Z0-9-]{2,63}$/;
const IDEMPOTENCY_KEY = /^P0-IDEMP-[A-Za-z0-9][A-Za-z0-9._:-]{15,111}$/;
const CLOSED_IDENTIFIER = /^[a-z][a-z0-9.-]{2,63}$/;
const MIN_STAGE_DEADLINE_MS = 1_000;
// Serializable reviewed children may cover the bounded four-hour recovery
// drill target. The in-process callback lane enforces its separate five-minute
// cap at invocation and never inherits this longer process-lane ceiling.
export const MAX_SERIALIZABLE_STAGE_DEADLINE_MS = 4 * 60 * 60 * 1_000;
const PREPARATION_REVIEW_ID = /^P0-PREP-[A-Z0-9]+(?:-[A-Z0-9]+)+$/;
const RAW_SHA256 = /^[0-9a-f]{64}$/;
const OPAQUE_REFERENCE = /^[a-z][a-z0-9-]*:[A-Za-z0-9._/-]{4,}$/;
const MANIFEST_PATH = "docs/project/PHASE1-ROADMAP-MANIFEST.json";
const REVIEWER_REGISTRY_PATH = "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json";
const CONTROL_INTEGRITY_MANIFEST_PATH = "docs/council/execution/P0-STAGE0-CONTROL-INTEGRITY.json";
const CONTROL_INTEGRITY_SCHEMA_VERSION = "1.0.0";
const CONTROL_INTEGRITY_BASELINE_PATH_COUNT = 54;
const CONTROL_INTEGRITY_ACTIVATED_PATH_COUNT = 55;
const CONTROL_INTEGRITY_ENTRY_KEYS = Object.freeze(["path", "mode", "type", "sha256"]);
const CONTROL_INTEGRITY_CHANGE_KEYS = Object.freeze(["operation", ...CONTROL_INTEGRITY_ENTRY_KEYS]);
export const P0_GATE_A_PROPOSAL_PROJECTION_PATHS = Object.freeze([
  "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json",
  "docs/project/PHASE1-ROADMAP-MANIFEST.json",
  "outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx",
]);

const DEFINITION_KEYS = Object.freeze([
  "schemaVersion",
  "taskId",
  "scopeClass",
  "actionClass",
  "stageId",
  "predecessor",
  "idempotencyKey",
  "moduleId",
  "argumentSetId",
  "deadlineMs",
]);
const PREDECESSOR_KEYS = Object.freeze(["stageId", "receiptDigest"]);
const PREPARATION_KEYS = Object.freeze([
  "schemaVersion",
  "gate",
  "taskId",
  "candidateRevision",
  "dossierDigest",
  "preparationAllowed",
]);
const RECEIPT_KEYS = Object.freeze([
  "schemaVersion",
  "taskId",
  "scopeClass",
  "actionClass",
  "stageId",
  "idempotencyKey",
  "sourceRevision",
  "gateKind",
  "authorityDeadline",
  "rollbackSnapshotReference",
  "stageBindingDigest",
  "predecessorReceiptSha256",
  "preparationReviewId",
  "preparationReviewSha256",
  "candidateRevision",
  "dossierDigest",
  "stageApprovalSha256",
  "registrySha256",
  "gateSourceFingerprint",
  "moduleSha256",
  "childResultSha256",
  "evidenceDigest",
  "stdoutSha256",
  "stderrSha256",
  "immediateVerificationSha256",
  "immediateVerificationResult",
  "quiescent1VerificationSha256",
  "quiescent1VerificationResult",
  "quiescent2VerificationSha256",
  "quiescent2VerificationResult",
  "state",
  "attempt",
]);
const HISTORICAL_RECEIPT_BINDING_KEYS = Object.freeze([
  "taskId",
  "stageId",
  "scopeClass",
  "actionClass",
  "idempotencyKey",
  "predecessorReceiptSha256",
  "preparationReviewId",
  "preparationReviewSha256",
  "candidateRevision",
  "dossierDigest",
  "stageApprovalSha256",
  "stageDefinitionSha256",
  "moduleSha256",
  "gateKind",
  "rollbackSnapshotReference",
]);
const STAGE_REGISTRY_KEYS = Object.freeze([
  "schemaVersion",
  "registryId",
  "scopeTaskIds",
  "historicalNonAuthorizingTaskIds",
  "preparationReviews",
  "stageApprovals",
]);
export const PREPARATION_REVIEW_RECORD_KEYS = Object.freeze([
  "preparationReviewId",
  "taskId",
  "stageId",
  "state",
  "scopeClass",
  "actionClass",
  "gateAProof",
  "proposalCandidate",
  "reviewerRegistrySha256",
  "councilSeatAttestations",
  "evidenceReference",
]);
const GATE_A_PROOF_KEYS = Object.freeze(["input", "context", "result"]);
const GATE_A_CONTEXT_KEYS = Object.freeze(["expectedTask", "candidatePublication"]);
const GATE_A_EXPECTED_TASK_KEYS = Object.freeze([
  "taskId", "milestone", "dependencyIds", "acceptanceScenarioIds", "taskContractSha256",
]);
const GATE_A_CANDIDATE_PUBLICATION_KEYS = Object.freeze([
  "revision", "baseRevision", "bytesVerified", "fullDiffVerified", "candidateOnFetchedMain",
]);
const GATE_A_RESULT_KEYS = Object.freeze([
  "preparationAllowed", "executionAllowed", "decision", "blockers", "preparationBounds",
  "privateActionsAllowed", "externalMutationsAllowed", "taskContractSha256", "sourceFingerprint",
]);
const PROPOSAL_CANDIDATE_KEYS = Object.freeze([
  "revision", "baseRevision", "dossierDigest", "artifactBindings",
]);
const ARTIFACT_BINDING_KEYS = Object.freeze(["path", "sha256"]);
const PREPARATION_SEAT_KEYS = Object.freeze([
  "reviewerId", "reviewerRole", "verdict", "reviewedRevision", "dossierDigest",
  "preparationReviewId", "stageId", "scopeClass", "actionClass", "evidenceReference", "attestationDigest",
]);
export const STAGE_APPROVAL_RECORD_KEYS = Object.freeze([
  "stageId",
  "preparationReviewId",
  "preparationReviewSha256",
  "taskId",
  "gateKind",
  "state",
  "scopeClass",
  "actionClass",
  "sequence",
  "candidateRevision",
  "dossierDigest",
  "predecessorReceiptSha256",
  "idempotencyKey",
  "stageDefinitionSha256",
  "moduleId",
  "moduleSha256",
  "candidate",
  "artifactReviews",
  "designCoverage",
  "dependencyEvidence",
  "openDecisions",
  "specialistVetoes",
  "privateAuthority",
  "reviewerRegistrySha256",
  "ownerActionStateSha256",
  "requirementEvidence",
  "independentQa",
  "rollback",
  "stageCouncil",
]);
const STAGE_CANDIDATE_KEYS = Object.freeze([
  "revision", "baseRevision", "dossierDigest", "taskContractSha256", "artifacts",
  "taskFiles", "taskFilesSha256", "implementerIds", "evidenceProducerIds",
]);
const STAGE_COUNCIL_KEYS = Object.freeze([
  "verdict", "reviewedRevision", "dossierDigest", "unresolvedBlockers", "seatVerdicts",
]);
const STAGE_SEAT_KEYS = Object.freeze([
  "reviewerId", "reviewerRole", "verdict", "reviewedRevision", "dossierDigest",
  "preparationReviewId", "preparationReviewSha256", "stageId", "gateKind", "scopeClass", "actionClass",
  "stageContextSha256", "evidenceReference", "attestationDigest",
]);

function fail(code, details = {}) {
  return Object.freeze({ ok: false, code, ...details });
}

function pass(code, details = {}) {
  return Object.freeze({ ok: true, code, ...details });
}

function pairIsOwned(taskId, stageId, scopeClass, actionClass) {
  const isDeliveryTransitionStage = typeof stageId === "string"
    && stageId.endsWith(DELIVERY_TRANSITION_GATE_B_CONTRACT.stageIdSuffix);
  if (isDeliveryTransitionStage) {
    return isDedicatedDeliveryTransitionScopeAction({ taskId, stageId, scopeClass, actionClass });
  }
  const contract = TASK_EXECUTION_CONTRACT[taskId];
  return TASK_SET.has(taskId)
    && SCOPE_ACTION_COMPATIBILITY[scopeClass]?.includes(actionClass) === true
    && contract?.milestone === "R0"
    && contract.scopeActions?.[scopeClass]?.includes(actionClass) === true;
}

function stageTaskIsAllowlisted(taskId, stageId, scopeClass, actionClass) {
  return TASK_SET.has(taskId)
    || isDedicatedDeliveryTransitionScopeAction({ taskId, stageId, scopeClass, actionClass });
}

function deliveryTransitionModuleIsBound({ taskId, stageId, scopeClass, actionClass, moduleId }) {
  const dedicated = isDedicatedDeliveryTransitionScopeAction({ taskId, stageId, scopeClass, actionClass });
  return (moduleId === DELIVERY_TRANSITION_GATE_B_CONTRACT.moduleId) === dedicated;
}

function sameStrings(left, right) {
  return Array.isArray(left)
    && Array.isArray(right)
    && left.length === right.length
    && left.every((value, index) => value === right[index]);
}

function isOpaqueReference(value) {
  return typeof value === "string"
    && OPAQUE_REFERENCE.test(value)
    && !value.includes("://")
    && !value.split(":", 2)[1]?.startsWith("/")
    && !value.includes("..")
    && !/(?:pending|unknown|tbd|placeholder)/i.test(value);
}

function proposalAuthorTrailerValid(message) {
  if (typeof message !== "string") return false;
  const expected = `P0-Proposal-Author-Id: ${P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS[0]}`;
  const lines = message.replace(/\r\n/g, "\n").split("\n");
  while (lines.at(-1) === "") lines.pop();
  const authorLikeLines = lines.filter((line) => /^\s*p0-proposal-author-id\s*[:=]/i.test(line));
  const paragraphs = lines.join("\n").split(/\n[\t ]*\n+/);
  const finalParagraph = paragraphs.at(-1)?.split("\n") ?? [];
  return authorLikeLines.length === 1
    && authorLikeLines[0] === expected
    && paragraphs.length >= 2
    && finalParagraph.length === 1
    && finalParagraph[0] === expected;
}

function artifactBindingsValid(bindings) {
  return isPlainRecord(bindings)
    && Object.keys(bindings).length === ARTIFACT_KINDS.length
    && ARTIFACT_KINDS.every((kind) => hasExactKeys(bindings[kind], ARTIFACT_BINDING_KEYS)
      && typeof bindings[kind].path === "string"
      && RAW_SHA256.test(bindings[kind].sha256 ?? ""));
}

function seatSetValid(seats, seatKeys) {
  return isPlainRecord(seats)
    && sameStrings(Object.keys(seats).sort(), [...COUNCIL_SEATS].sort())
    && COUNCIL_SEATS.every((seat) => hasExactKeys(seats[seat], seatKeys)
      && typeof seats[seat].reviewerId === "string"
      && typeof seats[seat].reviewerRole === "string"
      && RAW_SHA256.test(seats[seat].dossierDigest ?? "")
      && SHA256_DIGEST.test(seats[seat].attestationDigest ?? "")
      && typeof seats[seat].evidenceReference === "string");
}

function gateAResultProof(evaluation) {
  return {
    preparationAllowed: evaluation?.preparationAllowed === true,
    executionAllowed: evaluation?.executionAllowed === true,
    decision: evaluation?.decision ?? null,
    blockers: Array.isArray(evaluation?.blockers) ? structuredClone(evaluation.blockers) : null,
    preparationBounds: Array.isArray(evaluation?.normalizedEvidence?.preparationBounds)
      ? [...evaluation.normalizedEvidence.preparationBounds]
      : null,
    privateActionsAllowed: evaluation?.normalizedEvidence?.privateActionsAllowed ?? null,
    externalMutationsAllowed: evaluation?.normalizedEvidence?.externalMutationsAllowed ?? null,
    taskContractSha256: evaluation?.normalizedEvidence?.taskContractSha256 ?? null,
    sourceFingerprint: evaluation?.normalizedEvidence?.sourceFingerprint ?? null,
  };
}

function reducedProposalCandidate(input) {
  return {
    revision: input?.candidate?.revision ?? null,
    baseRevision: input?.candidate?.baseRevision ?? null,
    dossierDigest: input?.candidate?.dossierDigest ?? null,
    artifactBindings: Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
      path: input?.candidate?.artifacts?.[kind]?.path ?? null,
      sha256: input?.candidate?.artifacts?.[kind]?.sha256 ?? null,
    }])),
  };
}

function reducedPreparationSeats(input) {
  return Object.fromEntries(COUNCIL_SEATS.map((seat) => [seat, {
    ...(input?.council?.seatVerdicts?.[seat] ?? {}),
    scopeClass: input?.requestedScope?.scopeClass ?? null,
    actionClass: input?.requestedScope?.actionClass ?? null,
  }]));
}

function gateAProofShapeValid(proof) {
  return hasExactKeys(proof, GATE_A_PROOF_KEYS)
    && hasExactKeys(proof.context, GATE_A_CONTEXT_KEYS)
    && hasExactKeys(proof.context.expectedTask, GATE_A_EXPECTED_TASK_KEYS)
    && hasExactKeys(proof.context.candidatePublication, GATE_A_CANDIDATE_PUBLICATION_KEYS)
    && hasExactKeys(proof.result, GATE_A_RESULT_KEYS)
    && proof.input?.schemaVersion === TASK_PREPARATION_SCHEMA_VERSION;
}

function replayPreparationGateA(record, context = record?.gateAProof?.context) {
  const proof = record?.gateAProof;
  if (!gateAProofShapeValid(proof)
    || !hasExactKeys(context, GATE_A_CONTEXT_KEYS)
    || !hasExactKeys(context.expectedTask, GATE_A_EXPECTED_TASK_KEYS)
    || !hasExactKeys(context.candidatePublication, GATE_A_CANDIDATE_PUBLICATION_KEYS)) {
    return fail("PREPARATION_REVIEW_GATE_A_PROOF_INVALID");
  }
  let evaluation;
  try {
    evaluation = evaluateTaskPreparationGateA(proof.input, context);
  } catch {
    return fail("PREPARATION_REVIEW_GATE_A_REPLAY_FAILED");
  }
  const result = gateAResultProof(evaluation);
  if (evaluation.preparationAllowed !== true
    || evaluation.executionAllowed !== false
    || evaluation.decision !== "Ready to prepare — Gate A"
    || !Array.isArray(evaluation.blockers)
    || evaluation.blockers.length !== 0
    || canonicalJson(evaluation.normalizedEvidence?.preparationBounds) !== canonicalJson([
      "local", "public", "fictional", "synthetic",
    ])
    || evaluation.normalizedEvidence?.privateActionsAllowed !== false
    || evaluation.normalizedEvidence?.externalMutationsAllowed !== false
    || canonicalJson(result) !== canonicalJson(proof.result)) {
    return fail("PREPARATION_REVIEW_GATE_A_REPLAY_DENIED");
  }
  return pass("PREPARATION_REVIEW_GATE_A_REPLAY_VALID", { evaluation, result });
}

function validatePreparationReviewRecord(record) {
  const candidate = record?.proposalCandidate;
  const proof = record?.gateAProof;
  const input = proof?.input;
  if (!hasExactKeys(record, PREPARATION_REVIEW_RECORD_KEYS)
    || !stageTaskIsAllowlisted(record.taskId, record.stageId, record.scopeClass, record.actionClass)
    || !PREPARATION_REVIEW_ID.test(record.preparationReviewId ?? "")
    || !record.preparationReviewId.startsWith(`P0-PREP-${record.taskId}-`)
    || !STAGE_ID.test(record.stageId ?? "")
    || !record.stageId.startsWith(`P0-STAGE-${record.taskId}-`)
    || record.state !== "accepted"
    || !pairIsOwned(record.taskId, record.stageId, record.scopeClass, record.actionClass)
    || !hasExactKeys(candidate, PROPOSAL_CANDIDATE_KEYS)
    || !FULL_REVISION.test(candidate.revision ?? "")
    || !FULL_REVISION.test(candidate.baseRevision ?? "")
    || candidate.revision === candidate.baseRevision
    || !RAW_SHA256.test(candidate.dossierDigest ?? "")
    || !artifactBindingsValid(candidate.artifactBindings)
    || !RAW_SHA256.test(record.reviewerRegistrySha256 ?? "")
    || !seatSetValid(record.councilSeatAttestations, PREPARATION_SEAT_KEYS)
    || !isOpaqueReference(record.evidenceReference)
    || !gateAProofShapeValid(proof)) {
    return fail("PREPARATION_REVIEW_RECORD_INVALID");
  }
  const replay = replayPreparationGateA(record);
  if (!replay.ok) return replay;
  if (record.preparationReviewId !== input.preparationReviewId
    || record.taskId !== input.taskId
    || record.stageId !== input.stageId
    || record.scopeClass !== input.requestedScope?.scopeClass
    || record.actionClass !== input.requestedScope?.actionClass
    || canonicalJson(record.proposalCandidate) !== canonicalJson(reducedProposalCandidate(input))
    || record.reviewerRegistrySha256 !== computeReviewerRegistrySha256(input.reviewerRegistry)
    || canonicalJson(record.councilSeatAttestations) !== canonicalJson(reducedPreparationSeats(input))) {
    return fail("PREPARATION_REVIEW_GATE_A_TOP_LEVEL_MISMATCH");
  }
  for (const seat of COUNCIL_SEATS) {
    const attestation = record.councilSeatAttestations[seat];
    if (attestation.verdict !== "approve-preparation-candidate"
      || attestation.reviewedRevision !== candidate.revision
      || attestation.dossierDigest !== candidate.dossierDigest
      || attestation.preparationReviewId !== record.preparationReviewId
      || attestation.stageId !== record.stageId
      || attestation.scopeClass !== record.scopeClass
      || attestation.actionClass !== record.actionClass) {
      return fail("PREPARATION_REVIEW_SEAT_BINDING_INVALID");
    }
  }
  const reviewerIds = COUNCIL_SEATS.map((seat) => record.councilSeatAttestations[seat].reviewerId);
  if (new Set(reviewerIds).size !== COUNCIL_SEATS.length) return fail("PREPARATION_REVIEW_SEAT_DUPLICATE");
  try {
    if (!publicTextBytesAreSafe(canonicalJson(record))) return fail("PREPARATION_REVIEW_PUBLIC_SAFETY");
  } catch {
    return fail("PREPARATION_REVIEW_RECORD_INVALID");
  }
  return pass("PREPARATION_REVIEW_RECORD_VALID", {
    taskId: record.taskId,
    stageId: record.stageId,
    preparationReviewId: record.preparationReviewId,
    preparationReviewSha256: crypto.createHash("sha256").update(canonicalJson(record)).digest("hex"),
  });
}

export function preparationReviewRecordDigest(record) {
  const validation = validatePreparationReviewRecord(record);
  if (!validation.ok) throw new TypeError(validation.code);
  return crypto.createHash("sha256").update(canonicalJson(record)).digest("hex");
}

export function stageApprovalContextPayload(record) {
  if (!isPlainRecord(record)) throw new TypeError("STAGE_APPROVAL_RECORD_INVALID");
  return Object.fromEntries(Object.entries(record).filter(([key]) => key !== "stageCouncil"));
}

export function stageApprovalContextDigest(record) {
  return crypto.createHash("sha256").update(canonicalJson(stageApprovalContextPayload(record))).digest("hex");
}

function validateStageApprovalRecord(record) {
  const candidate = record?.candidate;
  const stageCouncil = record?.stageCouncil;
  if (!hasExactKeys(record, STAGE_APPROVAL_RECORD_KEYS)
    || !stageTaskIsAllowlisted(record.taskId, record.stageId, record.scopeClass, record.actionClass)
    || !STAGE_ID.test(record.stageId ?? "")
    || !record.stageId.startsWith(`P0-STAGE-${record.taskId}-`)
    || !PREPARATION_REVIEW_ID.test(record.preparationReviewId ?? "")
    || !RAW_SHA256.test(record.preparationReviewSha256 ?? "")
    || !["execute", "accept"].includes(record.gateKind)
    || record.state !== "ready"
    || !pairIsOwned(record.taskId, record.stageId, record.scopeClass, record.actionClass)
    || !Number.isSafeInteger(record.sequence)
    || record.sequence < 1
    || !FULL_REVISION.test(record.candidateRevision ?? "")
    || !RAW_SHA256.test(record.dossierDigest ?? "")
    || !IDEMPOTENCY_KEY.test(record.idempotencyKey ?? "")
    || !SHA256_DIGEST.test(record.stageDefinitionSha256 ?? "")
    || !CLOSED_IDENTIFIER.test(record.moduleId ?? "")
    || !deliveryTransitionModuleIsBound(record)
    || !SHA256_DIGEST.test(record.moduleSha256 ?? "")
    || !Array.isArray(record.requirementEvidence)
    || !hasExactKeys(candidate, STAGE_CANDIDATE_KEYS)
    || candidate.revision !== record.candidateRevision
    || candidate.dossierDigest !== record.dossierDigest
    || !RAW_SHA256.test(candidate.dossierDigest ?? "")
    || !FULL_REVISION.test(candidate.baseRevision ?? "")
    || candidate.baseRevision === candidate.revision
    || !RAW_SHA256.test(candidate.taskContractSha256 ?? "")
    || !artifactBindingsValid(candidate.artifacts)
    || !Array.isArray(candidate.taskFiles)
    || !RAW_SHA256.test(candidate.taskFilesSha256 ?? "")
    || !Array.isArray(candidate.implementerIds)
    || !Array.isArray(candidate.evidenceProducerIds)
    || !isPlainRecord(record.artifactReviews)
    || !sameStrings(Object.keys(record.artifactReviews).sort(), [...ARTIFACT_KINDS].sort())
    || !isPlainRecord(record.designCoverage)
    || !Array.isArray(record.dependencyEvidence)
    || !Array.isArray(record.openDecisions)
    || !Array.isArray(record.specialistVetoes)
    || !(record.privateAuthority === null || isPlainRecord(record.privateAuthority))
    || !RAW_SHA256.test(record.reviewerRegistrySha256 ?? "")
    || !RAW_SHA256.test(record.ownerActionStateSha256 ?? "")
    || !isPlainRecord(record.independentQa)
    || !isPlainRecord(record.rollback)
    || !hasExactKeys(stageCouncil, STAGE_COUNCIL_KEYS)
    || stageCouncil.verdict !== (record.gateKind === "accept" ? "ready-to-accept" : "ready-to-execute")
    || stageCouncil.reviewedRevision !== record.candidateRevision
    || stageCouncil.dossierDigest !== record.dossierDigest
    || !Array.isArray(stageCouncil.unresolvedBlockers)
    || stageCouncil.unresolvedBlockers.length !== 0
    || !seatSetValid(stageCouncil.seatVerdicts, STAGE_SEAT_KEYS)
    || (record.sequence === 1
      ? record.predecessorReceiptSha256 !== null
      : !RAW_SHA256.test(record.predecessorReceiptSha256 ?? ""))) {
    return fail("STAGE_APPROVAL_RECORD_INVALID");
  }
  const contextSha256 = stageApprovalContextDigest(record);
  for (const seat of COUNCIL_SEATS) {
    const attestation = stageCouncil.seatVerdicts[seat];
    if (attestation.verdict !== (record.gateKind === "accept" ? "approve-stage-acceptance" : "approve-stage-execution")
      || attestation.reviewedRevision !== record.candidateRevision
      || attestation.dossierDigest !== record.dossierDigest
      || attestation.preparationReviewId !== record.preparationReviewId
      || attestation.preparationReviewSha256 !== record.preparationReviewSha256
      || attestation.stageId !== record.stageId
      || attestation.gateKind !== record.gateKind
      || attestation.scopeClass !== record.scopeClass
      || attestation.actionClass !== record.actionClass
      || attestation.stageContextSha256 !== contextSha256) {
      return fail("STAGE_APPROVAL_SEAT_BINDING_INVALID");
    }
  }
  const reviewerIds = COUNCIL_SEATS.map((seat) => stageCouncil.seatVerdicts[seat].reviewerId);
  if (new Set(reviewerIds).size !== COUNCIL_SEATS.length) return fail("STAGE_APPROVAL_SEAT_DUPLICATE");
  try {
    if (!publicTextBytesAreSafe(canonicalJson(record))) return fail("STAGE_APPROVAL_RECORD_PUBLIC_SAFETY");
  } catch {
    return fail("STAGE_APPROVAL_RECORD_INVALID");
  }
  return pass("STAGE_APPROVAL_RECORD_VALID", {
    taskId: record.taskId,
    stageId: record.stageId,
    stageApprovalSha256: crypto.createHash("sha256").update(canonicalJson(record)).digest("hex"),
  });
}

export function validateStageApprovalRegistry(registry) {
  if (!hasExactKeys(registry, STAGE_REGISTRY_KEYS)
    || registry.schemaVersion !== STAGE_EXECUTION_SCHEMA_VERSION
    || registry.registryId !== "P0-R0-STAGE-APPROVAL-REGISTRY"
    || !sameStrings(registry.scopeTaskIds, P0_R0_SUBSTANTIVE_TASK_IDS)
    || !sameStrings(registry.historicalNonAuthorizingTaskIds, HISTORICAL_TASK_IDS)
    || !Array.isArray(registry.preparationReviews)
    || !Array.isArray(registry.stageApprovals)) {
    return fail("STAGE_APPROVAL_REGISTRY_INVALID");
  }
  const preparationIds = new Set();
  const preparationStageIds = new Set();
  const proposalCandidates = new Set();
  const preparationById = new Map();
  for (const record of registry.preparationReviews) {
    const validation = validatePreparationReviewRecord(record);
    if (!validation.ok) return validation;
    if (preparationIds.has(record.preparationReviewId)) return fail("PREPARATION_REVIEW_ID_DUPLICATE");
    if (preparationStageIds.has(record.stageId)) return fail("PREPARATION_REVIEW_STAGE_DUPLICATE");
    if (proposalCandidates.has(record.proposalCandidate.revision)) return fail("PREPARATION_REVIEW_CANDIDATE_DUPLICATE");
    preparationIds.add(record.preparationReviewId);
    preparationStageIds.add(record.stageId);
    proposalCandidates.add(record.proposalCandidate.revision);
    preparationById.set(record.preparationReviewId, record);
  }
  const stageIds = new Set();
  const idempotencyKeys = new Set();
  const stageCandidates = new Set();
  const stagesByTask = new Map();
  for (const record of registry.stageApprovals) {
    const validation = validateStageApprovalRecord(record);
    if (!validation.ok) return validation;
    if (stageIds.has(record.stageId)) return fail("STAGE_APPROVAL_STAGE_DUPLICATE");
    if (idempotencyKeys.has(record.idempotencyKey)) return fail("STAGE_APPROVAL_IDEMPOTENCY_DUPLICATE");
    if (stageCandidates.has(record.candidateRevision)) return fail("STAGE_APPROVAL_CANDIDATE_DUPLICATE");
    const preparation = preparationById.get(record.preparationReviewId);
    if (!preparation
      || preparation.stageId !== record.stageId
      || preparation.taskId !== record.taskId
      || preparation.scopeClass !== record.scopeClass
      || preparation.actionClass !== record.actionClass
      || preparationReviewRecordDigest(preparation) !== record.preparationReviewSha256
      || preparation.proposalCandidate.revision === record.candidateRevision) {
      return fail("STAGE_APPROVAL_PREPARATION_BINDING_INVALID");
    }
    stageIds.add(record.stageId);
    idempotencyKeys.add(record.idempotencyKey);
    stageCandidates.add(record.candidateRevision);
    const taskStages = stagesByTask.get(record.taskId) ?? [];
    taskStages.push(record);
    stagesByTask.set(record.taskId, taskStages);
  }
  for (const taskStages of stagesByTask.values()) {
    const ordered = [...taskStages].sort((left, right) => left.sequence - right.sequence);
    for (const [index, record] of ordered.entries()) {
      if (record.sequence !== index + 1) return fail("STAGE_APPROVAL_SEQUENCE_INVALID");
      if (index === 0 && record.predecessorReceiptSha256 !== null) {
        return fail("STAGE_APPROVAL_PREDECESSOR_CHAIN_INVALID");
      }
      if (index > 0 && !RAW_SHA256.test(record.predecessorReceiptSha256 ?? "")) {
        return fail("STAGE_APPROVAL_PREDECESSOR_CHAIN_INVALID");
      }
    }
  }
  return pass("STAGE_APPROVAL_REGISTRY_VALID", {
    preparationReviewCount: registry.preparationReviews.length,
    stageApprovalCount: registry.stageApprovals.length,
  });
}

export function stageApprovalRecordDigest(record) {
  const validation = validateStageApprovalRecord(record);
  if (!validation.ok) throw new TypeError(validation.code);
  return crypto.createHash("sha256").update(canonicalJson(record)).digest("hex");
}

async function runGit(run, repoRoot, args, encoding = "utf8") {
  try {
    const outcome = await run("git", args, { cwd: repoRoot, encoding });
    const raw = outcome?.stdout;
    const stdout = encoding === null
      ? Buffer.isBuffer(raw) ? raw : typeof raw === "string" ? Buffer.from(raw, "utf8") : Buffer.alloc(0)
      : typeof raw === "string" ? raw : Buffer.isBuffer(raw) ? raw.toString("utf8") : "";
    return { ok: outcome?.ok === true || outcome?.status === 0, stdout };
  } catch {
    return { ok: false, stdout: encoding === null ? Buffer.alloc(0) : "" };
  }
}

async function gitTreeEntryAtRevision(run, repoRoot, revision, relativePath) {
  const tree = await runGit(run, repoRoot, ["ls-tree", revision, "--", relativePath]);
  if (!tree.ok) return { ok: false, code: "PREPARATION_GATE_A_GIT_FILE_UNAVAILABLE" };
  if (tree.stdout.trim() === "") return { ok: true, exists: false };
  const match = tree.stdout.trim().match(/^(\d{6})\s+(\w+)\s+([0-9a-f]{40,64})\t(.+)$/);
  if (!match || match[4] !== relativePath) {
    return { ok: false, code: "PREPARATION_GATE_A_GIT_FILE_TYPE_INVALID" };
  }
  return { ok: true, exists: true, gitMode: match[1], gitType: match[2], objectId: match[3] };
}

async function gitFileAtRevision(run, repoRoot, revision, relativePath) {
  const shown = await runGit(run, repoRoot, ["show", `${revision}:${relativePath}`], null);
  const tree = await gitTreeEntryAtRevision(run, repoRoot, revision, relativePath);
  if (!shown.ok || !tree.ok || !tree.exists) {
    return { ok: false, code: "PREPARATION_GATE_A_GIT_FILE_UNAVAILABLE" };
  }
  if (tree.gitMode !== "100644" || tree.gitType !== "blob") {
    return { ok: false, code: "PREPARATION_GATE_A_GIT_FILE_TYPE_INVALID" };
  }
  return { ...tree, bytes: shown.stdout };
}

async function gitJsonAtRevision(run, repoRoot, revision, relativePath) {
  const file = await gitFileAtRevision(run, repoRoot, revision, relativePath);
  if (!file.ok) return file;
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(file.bytes);
    return {
      ...file,
      value: parseJsonWithoutDuplicateKeys(text, `${revision}:${relativePath}`),
    };
  } catch {
    return { ok: false, code: "PREPARATION_GATE_A_GIT_JSON_INVALID" };
  }
}

function gateATaskSnapshot(manifest, taskId) {
  const taskMatches = Array.isArray(manifest?.tasks)
    ? manifest.tasks.filter((task) => task?.id === taskId)
    : [];
  if (taskMatches.length !== 1) return null;
  const task = taskMatches[0];
  const canonicalAcceptanceScenarioIds = acceptanceScenarioIdsFor(task.id);
  const artifactPaths = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [
    kind,
    task.taskDossier?.artifacts?.[kind]?.path ?? null,
  ]));
  if (!Array.isArray(task.dependencies)
    || !Array.isArray(task.requirementIds)
    || task.requirementIds.length === 0
    || !(typeof task.description === "string" || typeof task.outcome === "string")
    || task.acceptanceEvidence === null || task.acceptanceEvidence === undefined
    || canonicalJson(task.taskDossier?.acceptanceScenarioIds) !== canonicalJson(canonicalAcceptanceScenarioIds)
    || Object.values(artifactPaths).some((artifactPath) => typeof artifactPath !== "string")) {
    return null;
  }
  const taskContractSha256 = computeTaskContractSha256({
    taskId: task.id,
    outcome: task.description ?? task.outcome,
    requirementIds: task.requirementIds,
    dependencyIds: task.dependencies,
    acceptanceEvidence: task.acceptanceEvidence,
    acceptanceScenarioIds: canonicalAcceptanceScenarioIds,
  });
  return {
    expectedTask: {
      taskId: task.id,
      milestone: task.milestone,
      dependencyIds: task.dependencies,
      acceptanceScenarioIds: canonicalAcceptanceScenarioIds,
      taskContractSha256,
    },
    artifactPaths,
  };
}

async function commitParentsAtRevision(run, repoRoot, revision) {
  const result = await runGit(run, repoRoot, ["rev-list", "--parents", "-n", "1", revision]);
  const tokens = result.ok ? result.stdout.trim().split(/\s+/) : [];
  if (tokens.length < 2 || tokens[0] !== revision
    || tokens.some((token) => !FULL_REVISION.test(token))) {
    return { ok: false, code: "PREPARATION_GATE_A_PUBLICATION_HISTORY_INVALID" };
  }
  return { ok: true, parents: tokens.slice(1) };
}

async function firstParentRevisions(run, repoRoot, tipRevision) {
  const ancestry = await runGit(run, repoRoot, [
    "merge-base", "--is-ancestor", P0_R0_GATE_A_MINIMUM_BASE_REVISION, tipRevision,
  ]);
  const history = await runGit(run, repoRoot, [
    "rev-list", "--first-parent", "--reverse",
    `${P0_R0_GATE_A_MINIMUM_BASE_REVISION}..${tipRevision}`,
  ]);
  const revisions = history.ok
    ? history.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    : [];
  if (!ancestry.ok || !history.ok || revisions.some((revision) => !FULL_REVISION.test(revision))) {
    return { ok: false, code: "PREPARATION_GATE_A_PUBLICATION_HISTORY_INVALID" };
  }
  return { ok: true, revisions };
}

async function laterPullRequestHeadAfterMainAnchor({
  run,
  repoRoot,
  anchorMainRevision,
  fetchedMainRevision,
  publishedRef,
}) {
  const head = await commitParentsAtRevision(run, repoRoot, publishedRef);
  if (!head.ok || head.parents.length !== 1 || head.parents[0] !== fetchedMainRevision) return false;
  const history = await firstParentRevisions(run, repoRoot, publishedRef);
  if (!history.ok || history.revisions.at(-1) !== publishedRef) return false;
  const anchorIndex = history.revisions.indexOf(anchorMainRevision);
  const fetchedMainIndex = history.revisions.indexOf(fetchedMainRevision);
  const headIndex = history.revisions.indexOf(publishedRef);
  return anchorIndex >= 0
    && fetchedMainIndex >= anchorIndex
    && headIndex === fetchedMainIndex + 1;
}

async function rawGitDiffRecords(run, repoRoot, fromRevision, toRevision) {
  const rawDiff = await runGit(run, repoRoot, [
    "diff", "--raw", "--no-abbrev", "--no-ext-diff", "--no-renames", "-z",
    fromRevision, toRevision, "--",
  ], null);
  const rawTokens = rawDiff.ok ? rawDiff.stdout.toString("utf8").split("\0") : [];
  if (rawTokens.at(-1) === "") rawTokens.pop();
  const records = [];
  if (rawTokens.length % 2 === 0) {
    for (let index = 0; index < rawTokens.length; index += 2) {
      const match = rawTokens[index].match(
        /^:(\d{6}) (\d{6}) ([0-9a-f]{40,64}) ([0-9a-f]{40,64}) ([AM])$/,
      );
      if (!match) return { ok: false, records: [] };
      records.push({
        oldMode: match[1],
        newMode: match[2],
        oldObjectId: match[3],
        newObjectId: match[4],
        status: match[5],
        path: rawTokens[index + 1],
      });
    }
  }
  return { ok: rawDiff.ok, records };
}

function controlIntegrityEntryValid(entry, keys = CONTROL_INTEGRITY_ENTRY_KEYS) {
  return hasExactKeys(entry, keys)
    && typeof entry.path === "string" && entry.path.length > 0
    && entry.mode === "100644" && entry.type === "blob"
    && RAW_SHA256.test(entry.sha256 ?? "");
}

function parseControlIntegrityManifestFile(file) {
  const value = file?.value;
  if (!file?.ok || !hasExactKeys(value, ["schemaVersion", "current", "next"])
    || value.schemaVersion !== CONTROL_INTEGRITY_SCHEMA_VERSION
    || !Array.isArray(value.current) || value.current.length === 0
    || value.current.some((entry) => !controlIntegrityEntryValid(entry))) {
    return { ok: false };
  }
  const currentPaths = value.current.map((entry) => entry.path);
  if (new Set(currentPaths).size !== currentPaths.length
    || canonicalJson(currentPaths) !== canonicalJson([...currentPaths].sort())) {
    return { ok: false };
  }
  if (value.next !== null) {
    if (!hasExactKeys(value.next, ["changes"])
      || !Array.isArray(value.next.changes) || value.next.changes.length === 0
      || value.next.changes.length > 8
      || value.next.changes.some((change) => !controlIntegrityEntryValid(
        change,
        CONTROL_INTEGRITY_CHANGE_KEYS,
      ) || !["add", "modify", "delete"].includes(change.operation))) {
      return { ok: false };
    }
    const changePaths = value.next.changes.map((change) => change.path);
    if (new Set(changePaths).size !== changePaths.length
      || canonicalJson(changePaths) !== canonicalJson([...changePaths].sort())) {
      return { ok: false };
    }
  }
  const canonicalBytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");
  if (!file.bytes.equals(canonicalBytes)) return { ok: false };
  return { ok: true, manifest: value, bytes: file.bytes };
}

async function controlIntegrityManifestAtRevision(run, repoRoot, revision) {
  return parseControlIntegrityManifestFile(await gitJsonAtRevision(
    run,
    repoRoot,
    revision,
    CONTROL_INTEGRITY_MANIFEST_PATH,
  ));
}

function exactModifiedPathSet(diff, expectedPaths) {
  const paths = [...expectedPaths].sort();
  return diff.ok && diff.records.length === paths.length
    && canonicalJson(diff.records.map((entry) => entry.path).sort()) === canonicalJson(paths)
    && diff.records.every((entry) => entry.status === "M"
      && entry.oldMode === "100644" && entry.newMode === "100644");
}

function applyRegistryIntegrityChange(current, targetSha256) {
  const entries = new Map(current.map((entry) => [entry.path, entry]));
  entries.set(STAGE_APPROVAL_REGISTRY_PATH, {
    path: STAGE_APPROVAL_REGISTRY_PATH,
    mode: "100644",
    type: "blob",
    sha256: targetSha256,
  });
  return [...entries.values()].sort((left, right) => (
    left.path < right.path ? -1 : left.path > right.path ? 1 : 0
  ));
}

async function verifyRegistryRatchetPublicationBoundary({
  run,
  repoRoot,
  prerequisiteMainRevision,
  armMainRevision,
  recordPublicationRevision,
  mainPublicationRevision,
  boundaryCode,
}) {
  const failBoundary = () => ({ ok: false, code: boundaryCode });
  const armMainCommit = await commitParentsAtRevision(run, repoRoot, armMainRevision);
  if (!armMainCommit.ok || armMainCommit.parents.length !== 2
    || armMainCommit.parents[0] !== prerequisiteMainRevision) return failBoundary();
  const armRevision = armMainCommit.parents[1];
  const armCommit = await commitParentsAtRevision(run, repoRoot, armRevision);
  const recordCommit = await commitParentsAtRevision(run, repoRoot, recordPublicationRevision);
  if (!armCommit.ok || armCommit.parents.length !== 1
    || armCommit.parents[0] !== prerequisiteMainRevision
    || !recordCommit.ok || recordCommit.parents.length !== 1
    || recordCommit.parents[0] !== armMainRevision) return failBoundary();

  const [armDiff, armMergeDiff, consumeDiff, armTreeEqualsBranch] = await Promise.all([
    rawGitDiffRecords(run, repoRoot, prerequisiteMainRevision, armRevision),
    rawGitDiffRecords(run, repoRoot, prerequisiteMainRevision, armMainRevision),
    rawGitDiffRecords(run, repoRoot, armMainRevision, recordPublicationRevision),
    runGit(run, repoRoot, ["diff", "--quiet", armRevision, armMainRevision, "--"]),
  ]);
  if (!exactModifiedPathSet(armDiff, [CONTROL_INTEGRITY_MANIFEST_PATH])
    || !exactModifiedPathSet(armMergeDiff, [CONTROL_INTEGRITY_MANIFEST_PATH])
    || !exactModifiedPathSet(consumeDiff, [
      CONTROL_INTEGRITY_MANIFEST_PATH,
      STAGE_APPROVAL_REGISTRY_PATH,
    ]) || !armTreeEqualsBranch.ok) return failBoundary();

  const [baseManifest, armManifest, armMainManifest, consumeManifest,
    baseRegistry, consumedRegistry] = await Promise.all([
    controlIntegrityManifestAtRevision(run, repoRoot, prerequisiteMainRevision),
    controlIntegrityManifestAtRevision(run, repoRoot, armRevision),
    controlIntegrityManifestAtRevision(run, repoRoot, armMainRevision),
    controlIntegrityManifestAtRevision(run, repoRoot, recordPublicationRevision),
    trustedRegistrySnapshotAtRevision(run, repoRoot, prerequisiteMainRevision),
    trustedRegistrySnapshotAtRevision(run, repoRoot, recordPublicationRevision),
  ]);
  if (!baseManifest.ok || !armManifest.ok || !armMainManifest.ok || !consumeManifest.ok
    || !baseRegistry.ok || !baseRegistry.exists || !consumedRegistry.ok || !consumedRegistry.exists
    || baseManifest.manifest.next !== null) return failBoundary();
  const targetSha256 = crypto.createHash("sha256").update(consumedRegistry.bytes).digest("hex");
  const baseRegistrySha256 = crypto.createHash("sha256").update(baseRegistry.bytes).digest("hex");
  const baseEntry = baseManifest.manifest.current.find((entry) => (
    entry.path === STAGE_APPROVAL_REGISTRY_PATH
  ));
  const baseRegistryHasRecords = baseRegistry.registry.preparationReviews.length !== 0
    || baseRegistry.registry.stageApprovals.length !== 0;
  if ((!baseEntry && baseRegistryHasRecords) || (baseEntry && !baseRegistryHasRecords)) {
    return failBoundary();
  }
  if (baseManifest.manifest.current.length !== (baseEntry
    ? CONTROL_INTEGRITY_ACTIVATED_PATH_COUNT
    : CONTROL_INTEGRITY_BASELINE_PATH_COUNT)) return failBoundary();
  if (baseEntry && baseEntry.sha256 !== baseRegistrySha256) return failBoundary();
  const expectedOperation = baseEntry ? "modify" : "add";
  if (expectedOperation === "modify" && baseRegistrySha256 === targetSha256) return failBoundary();
  const expectedChange = {
    operation: expectedOperation,
    path: STAGE_APPROVAL_REGISTRY_PATH,
    mode: "100644",
    type: "blob",
    sha256: targetSha256,
  };
  const expectedArmedManifest = {
    schemaVersion: CONTROL_INTEGRITY_SCHEMA_VERSION,
    current: baseManifest.manifest.current,
    next: { changes: [expectedChange] },
  };
  const expectedConsumedManifest = {
    schemaVersion: CONTROL_INTEGRITY_SCHEMA_VERSION,
    current: applyRegistryIntegrityChange(baseManifest.manifest.current, targetSha256),
    next: null,
  };
  if (canonicalJson(armManifest.manifest) !== canonicalJson(expectedArmedManifest)
    || canonicalJson(armMainManifest.manifest) !== canonicalJson(expectedArmedManifest)
    || canonicalJson(consumeManifest.manifest) !== canonicalJson(expectedConsumedManifest)) {
    return failBoundary();
  }

  if (mainPublicationRevision !== null) {
    const mainCommit = await commitParentsAtRevision(run, repoRoot, mainPublicationRevision);
    if (!mainCommit.ok || mainCommit.parents.length !== 2
      || mainCommit.parents[0] !== armMainRevision
      || mainCommit.parents[1] !== recordPublicationRevision) return failBoundary();
    const [mainDiff, mainTreeEqualsRecord, mainManifest, mainRegistry] = await Promise.all([
      rawGitDiffRecords(run, repoRoot, armMainRevision, mainPublicationRevision),
      runGit(run, repoRoot, ["diff", "--quiet", recordPublicationRevision, mainPublicationRevision, "--"]),
      controlIntegrityManifestAtRevision(run, repoRoot, mainPublicationRevision),
      trustedRegistrySnapshotAtRevision(run, repoRoot, mainPublicationRevision),
    ]);
    if (!exactModifiedPathSet(mainDiff, [
      CONTROL_INTEGRITY_MANIFEST_PATH,
      STAGE_APPROVAL_REGISTRY_PATH,
    ]) || !mainTreeEqualsRecord.ok || !mainManifest.ok || !mainRegistry.ok || !mainRegistry.exists
      || !mainManifest.bytes.equals(consumeManifest.bytes)
      || !mainRegistry.bytes.equals(consumedRegistry.bytes)) return failBoundary();
  }
  return {
    ok: true,
    armRevision,
    armMainRevision,
    publicationRevision: mainPublicationRevision,
    targetSha256,
  };
}

async function deriveRegistryMainPublicationBoundary({
  run,
  repoRoot,
  fetchedMainRevision,
  publishedRef,
  prerequisiteMainRevision,
  recordPublicationRevision,
  collectionName,
  idKey,
  recordId,
  record,
  orderCode,
  boundaryCode,
}) {
  const history = await firstParentRevisions(run, repoRoot, fetchedMainRevision);
  if (!history.ok) return history;
  let publicationRevision = null;
  for (const revision of history.revisions) {
    const snapshot = await registryAtRevision(run, repoRoot, revision);
    const matches = snapshot.registry?.[collectionName]?.filter((entry) => entry?.[idKey] === recordId) ?? [];
    if (matches.length > 1) return { ok: false, code: orderCode };
    if (matches.length === 1) {
      if (canonicalJson(matches[0]) !== canonicalJson(record)) return { ok: false, code: orderCode };
      publicationRevision = revision;
      break;
    }
  }
  const publicationPrMode = publicationRevision === null;
  if (publicationPrMode && fetchedMainRevision === publishedRef) return { ok: true, published: false };
  if (publicationRevision === prerequisiteMainRevision) return { ok: false, code: orderCode };
  let armMainRevision = fetchedMainRevision;
  if (!publicationPrMode) {
    const publicationCommit = await commitParentsAtRevision(run, repoRoot, publicationRevision);
    if (!publicationCommit.ok || publicationCommit.parents.length !== 2
      || publicationCommit.parents[1] !== recordPublicationRevision) {
      return { ok: false, code: boundaryCode };
    }
    [armMainRevision] = publicationCommit.parents;
  }
  const ratchet = await verifyRegistryRatchetPublicationBoundary({
    run,
    repoRoot,
    prerequisiteMainRevision,
    armMainRevision,
    recordPublicationRevision,
    mainPublicationRevision: publicationPrMode ? null : publicationRevision,
    boundaryCode,
  });
  if (!ratchet.ok) return ratchet;
  return {
    ok: true,
    published: !publicationPrMode,
    publicationRevision: publicationPrMode ? null : publicationRevision,
    armRevision: ratchet.armRevision,
    armMainRevision,
    targetSha256: ratchet.targetSha256,
  };
}

async function deriveProposalPublicationBoundary({
  run,
  repoRoot,
  fetchedMainRevision,
  candidateRevision,
  candidateBaseRevision,
  artifactPaths,
}) {
  const history = await firstParentRevisions(run, repoRoot, fetchedMainRevision);
  if (!history.ok) return history;
  let publicationRevision = null;
  for (const revision of history.revisions) {
    const containsCandidate = await runGit(run, repoRoot, [
      "merge-base", "--is-ancestor", candidateRevision, revision,
    ]);
    if (containsCandidate.ok) {
      publicationRevision = revision;
      break;
    }
  }
  if (publicationRevision === null) {
    return { ok: false, code: "PREPARATION_GATE_A_PROPOSAL_UNPUBLISHED" };
  }
  const commit = await commitParentsAtRevision(run, repoRoot, publicationRevision);
  if (!commit.ok || commit.parents.length !== 2) {
    return { ok: false, code: "PREPARATION_GATE_A_PROPOSAL_PUBLICATION_BOUNDARY_INVALID" };
  }
  const firstParentContainsCandidate = await runGit(run, repoRoot, [
    "merge-base", "--is-ancestor", candidateRevision, commit.parents[0],
  ]);
  const baseOnFirstParent = await runGit(run, repoRoot, [
    "merge-base", "--is-ancestor", candidateBaseRevision, commit.parents[0],
  ]);
  const projectionCommit = await commitParentsAtRevision(run, repoRoot, commit.parents[1]);
  const candidateBeforeProjection = await runGit(run, repoRoot, [
    "merge-base", "--is-ancestor", candidateRevision, commit.parents[1],
  ]);
  const projectionDiff = await rawGitDiffRecords(
    run, repoRoot, candidateRevision, commit.parents[1],
  );
  const mergeDiff = await rawGitDiffRecords(
    run, repoRoot, commit.parents[0], publicationRevision,
  );
  const expectedMergePaths = [...artifactPaths, ...P0_GATE_A_PROPOSAL_PROJECTION_PATHS].sort();
  const projectionShapeValid = projectionDiff.ok
    && projectionCommit.ok
    && projectionCommit.parents.length === 1
    && projectionCommit.parents[0] === candidateRevision
    && projectionDiff.records.length === P0_GATE_A_PROPOSAL_PROJECTION_PATHS.length
    && canonicalJson(projectionDiff.records.map((entry) => entry.path).sort())
      === canonicalJson([...P0_GATE_A_PROPOSAL_PROJECTION_PATHS].sort())
    && projectionDiff.records.every((entry) => entry.newMode === "100644"
      && (entry.status === "A" ? entry.oldMode === "000000" : entry.oldMode === "100644"));
  const mergeShapeValid = mergeDiff.ok
    && mergeDiff.records.length === expectedMergePaths.length
    && canonicalJson(mergeDiff.records.map((entry) => entry.path).sort())
      === canonicalJson(expectedMergePaths)
    && mergeDiff.records.every((entry) => entry.newMode === "100644"
      && (entry.status === "A" ? entry.oldMode === "000000" : entry.oldMode === "100644"));
  const mergeTreeEqualsSecondParent = await runGit(run, repoRoot, [
    "diff", "--quiet", commit.parents[1], publicationRevision, "--",
  ]);
  if (commit.parents[0] !== candidateBaseRevision
    || firstParentContainsCandidate.ok || !baseOnFirstParent.ok || !candidateBeforeProjection.ok
    || !projectionShapeValid || !mergeShapeValid || !mergeTreeEqualsSecondParent.ok) {
    return { ok: false, code: "PREPARATION_GATE_A_PROPOSAL_PUBLICATION_BOUNDARY_INVALID" };
  }
  return {
    ok: true,
    publicationRevision,
    firstParentRevision: commit.parents[0],
  };
}

async function derivePreparationMainPublicationBoundary({
  run,
  repoRoot,
  fetchedMainRevision,
  publishedRef,
  proposalPublicationRevision,
  preparationPublicationRevision,
  record,
}) {
  const baseline = await registryAtRevision(run, repoRoot, P0_R0_GATE_A_MINIMUM_BASE_REVISION);
  if (baseline.registry?.preparationReviews?.some((entry) => (
    entry?.preparationReviewId === record.preparationReviewId
  ))) {
    return { ok: false, code: "PREPARATION_GATE_A_PUBLICATION_ORDER_INVALID" };
  }
  return deriveRegistryMainPublicationBoundary({
    run,
    repoRoot,
    fetchedMainRevision,
    publishedRef,
    prerequisiteMainRevision: proposalPublicationRevision,
    recordPublicationRevision: preparationPublicationRevision,
    collectionName: "preparationReviews",
    idKey: "preparationReviewId",
    recordId: record.preparationReviewId,
    record,
    orderCode: "PREPARATION_GATE_A_PUBLICATION_ORDER_INVALID",
    boundaryCode: "PREPARATION_GATE_A_PREPARATION_PUBLICATION_BOUNDARY_INVALID",
  });
}

async function deriveImplementationMainPublicationBoundary({
  run,
  repoRoot,
  fetchedMainRevision,
  preparationMainPublicationRevision,
  candidateRevision,
  candidateBaseRevision,
}) {
  const candidateCommit = await commitParentsAtRevision(run, repoRoot, candidateRevision);
  if (!candidateCommit.ok || candidateCommit.parents.length !== 1
    || candidateCommit.parents[0] !== candidateBaseRevision) {
    return { ok: false, code: "STAGE_IMPLEMENTATION_PREPARATION_BASE_INVALID" };
  }
  const history = await firstParentRevisions(run, repoRoot, fetchedMainRevision);
  if (!history.ok) return history;
  const preparationIndex = history.revisions.indexOf(preparationMainPublicationRevision);
  const candidateBaseIndex = history.revisions.indexOf(candidateBaseRevision);
  if (preparationIndex < 0 || candidateBaseIndex < preparationIndex) {
    return { ok: false, code: "STAGE_IMPLEMENTATION_PREPARATION_BASE_INVALID" };
  }
  let publicationRevision = null;
  for (const revision of history.revisions) {
    const containsCandidate = await runGit(run, repoRoot, [
      "merge-base", "--is-ancestor", candidateRevision, revision,
    ]);
    if (containsCandidate.ok) {
      publicationRevision = revision;
      break;
    }
  }
  if (publicationRevision === null) {
    return { ok: false, code: "STAGE_IMPLEMENTATION_UNPUBLISHED" };
  }
  const commit = await commitParentsAtRevision(run, repoRoot, publicationRevision);
  if (!commit.ok || commit.parents.length !== 2
    || commit.parents[0] !== candidateBaseRevision
    || commit.parents[1] !== candidateRevision) {
    return { ok: false, code: "STAGE_IMPLEMENTATION_PUBLICATION_BOUNDARY_INVALID" };
  }
  const publicationIndex = history.revisions.indexOf(publicationRevision);
  const preparationBeforeFirstParent = await runGit(run, repoRoot, [
    "merge-base", "--is-ancestor", preparationMainPublicationRevision, commit.parents[0],
  ]);
  const candidateBeforeFirstParent = await runGit(run, repoRoot, [
    "merge-base", "--is-ancestor", candidateRevision, commit.parents[0],
  ]);
  const mergeTreeEqualsCandidate = await runGit(run, repoRoot, [
    "diff", "--quiet", candidateRevision, publicationRevision, "--",
  ]);
  if (publicationIndex !== candidateBaseIndex + 1
    || !preparationBeforeFirstParent.ok || candidateBeforeFirstParent.ok || !mergeTreeEqualsCandidate.ok) {
    return { ok: false, code: "STAGE_IMPLEMENTATION_PUBLICATION_BOUNDARY_INVALID" };
  }
  return { ok: true, publicationRevision, candidateBaseRevision };
}

async function deriveStageMainPublicationBoundary({
  run,
  repoRoot,
  fetchedMainRevision,
  publishedRef,
  implementationMainPublicationRevision,
  stagePublicationRevision,
  record,
}) {
  return deriveRegistryMainPublicationBoundary({
    run,
    repoRoot,
    fetchedMainRevision,
    publishedRef,
    prerequisiteMainRevision: implementationMainPublicationRevision,
    recordPublicationRevision: stagePublicationRevision,
    collectionName: "stageApprovals",
    idKey: "stageId",
    recordId: record.stageId,
    record,
    orderCode: "STAGE_MAIN_PUBLICATION_ORDER_INVALID",
    boundaryCode: "STAGE_MAIN_PUBLICATION_BOUNDARY_INVALID",
  });
}

/**
 * Rebuild the Gate A context from immutable Git evidence and replay the exact
 * evaluator. Embedded context is never accepted as publication or task truth.
 */
export async function verifyPreparationGateAProofFromGit({
  repoRoot,
  run,
  publishedRef,
  fetchedMainRevision = publishedRef,
  preparationPublicationRevision,
  record,
} = {}) {
  if (typeof repoRoot !== "string" || typeof run !== "function"
    || !FULL_REVISION.test(publishedRef ?? "")
    || !FULL_REVISION.test(fetchedMainRevision ?? "")
    || !FULL_REVISION.test(preparationPublicationRevision ?? "")) {
    return fail("PREPARATION_GATE_A_GIT_INPUT_INVALID");
  }
  const structural = validatePreparationReviewRecord(record);
  if (!structural.ok) return fail(structural.code);
  const proof = record.gateAProof;
  const input = proof.input;
  const candidate = input.candidate;

  const parent = await runGit(run, repoRoot, ["rev-list", "--parents", "-n", "1", candidate.revision]);
  const parentTokens = parent.ok ? parent.stdout.trim().split(/\s+/) : [];
  if (parentTokens.length !== 2
    || parentTokens[0] !== candidate.revision
    || parentTokens[1] !== candidate.baseRevision) {
    return fail("PREPARATION_GATE_A_PROPOSAL_PARENT_INVALID");
  }
  const proposalMessage = await runGit(run, repoRoot, [
    "show", "-s", "--format=%B", candidate.revision,
  ]);
  if (!proposalMessage.ok
    || !proposalAuthorTrailerValid(proposalMessage.stdout)
    || canonicalJson(input.proposalAuthorIds) !== canonicalJson(P0_R0_GATE_A_PROPOSAL_AUTHOR_IDS)) {
    return fail("PREPARATION_GATE_A_PROPOSAL_AUTHOR_TRAILER_INVALID");
  }
  const fetchedMainAncestry = await runGit(run, repoRoot, [
    "merge-base", "--is-ancestor", candidate.revision, fetchedMainRevision,
  ]);
  const baselineAncestry = await runGit(run, repoRoot, [
    "merge-base", "--is-ancestor", P0_R0_GATE_A_MINIMUM_BASE_REVISION, candidate.baseRevision,
  ]);
  if (!fetchedMainAncestry.ok || !baselineAncestry.ok) {
    return fail("PREPARATION_GATE_A_PROPOSAL_UNPUBLISHED");
  }
  const proposalPublication = await deriveProposalPublicationBoundary({
    run,
    repoRoot,
    fetchedMainRevision,
    candidateRevision: candidate.revision,
    candidateBaseRevision: candidate.baseRevision,
    artifactPaths: ARTIFACT_KINDS.map((kind) => candidate.artifacts[kind].path),
  });
  if (!proposalPublication.ok) return fail(proposalPublication.code);
  const preparationMainPublication = await derivePreparationMainPublicationBoundary({
    run,
    repoRoot,
    fetchedMainRevision,
    publishedRef,
    proposalPublicationRevision: proposalPublication.publicationRevision,
    preparationPublicationRevision,
    record,
  });
  if (!preparationMainPublication.ok) return fail(preparationMainPublication.code);
  if (fetchedMainRevision === publishedRef && preparationMainPublication.published !== true) {
    return fail("PREPARATION_GATE_A_PREPARATION_UNPUBLISHED");
  }

  const artifactPaths = ARTIFACT_KINDS.map((kind) => candidate.artifacts[kind].path);
  if (new Set(artifactPaths).size !== ARTIFACT_KINDS.length) {
    return fail("PREPARATION_GATE_A_ARTIFACT_SET_INVALID");
  }
  const rawDiff = await runGit(run, repoRoot, [
    "diff", "--raw", "--no-abbrev", "--no-ext-diff", "--no-renames", "-z",
    candidate.baseRevision, candidate.revision, "--",
  ], null);
  const rawTokens = rawDiff.ok ? rawDiff.stdout.toString("utf8").split("\0") : [];
  if (rawTokens.at(-1) === "") rawTokens.pop();
  const rawRecords = [];
  if (rawTokens.length % 2 === 0) {
    for (let index = 0; index < rawTokens.length; index += 2) {
      const match = rawTokens[index].match(
        /^:(\d{6}) (\d{6}) ([0-9a-f]{40,64}) ([0-9a-f]{40,64}) ([AM])$/,
      );
      if (!match) {
        rawRecords.length = 0;
        break;
      }
      rawRecords.push({
        oldMode: match[1],
        newMode: match[2],
        oldObjectId: match[3],
        newObjectId: match[4],
        status: match[5],
        path: rawTokens[index + 1],
      });
    }
  }
  if (!rawDiff.ok || rawRecords.length !== ARTIFACT_KINDS.length
    || canonicalJson(rawRecords.map((entry) => entry.path).sort()) !== canonicalJson([...artifactPaths].sort())
    || rawRecords.some((entry) => entry.newMode !== "100644"
      || (entry.status === "A" ? entry.oldMode !== "000000" : entry.oldMode !== "100644"))) {
    return fail("PREPARATION_GATE_A_PROPOSAL_DIFF_INVALID");
  }

  for (const kind of ARTIFACT_KINDS) {
    const artifact = candidate.artifacts[kind];
    const diffRecord = rawRecords.find((entry) => entry.path === artifact.path);
    const baseTree = await gitTreeEntryAtRevision(run, repoRoot, candidate.baseRevision, artifact.path);
    const file = await gitFileAtRevision(run, repoRoot, candidate.revision, artifact.path);
    const baseSemanticsValid = diffRecord?.status === "A"
      ? baseTree.ok && !baseTree.exists
      : baseTree.ok && baseTree.exists && baseTree.gitMode === "100644" && baseTree.gitType === "blob"
        && baseTree.objectId === diffRecord?.oldObjectId;
    if (!diffRecord || !baseSemanticsValid || !file.ok
      || file.objectId !== diffRecord.newObjectId
      || crypto.createHash("sha256").update(file.bytes).digest("hex") !== artifact.sha256) {
      return fail("PREPARATION_GATE_A_ARTIFACT_BYTES_INVALID", { artifactKind: kind });
    }
    let markdown;
    try {
      markdown = new TextDecoder("utf-8", { fatal: true }).decode(file.bytes);
    } catch {
      return fail("PREPARATION_GATE_A_ARTIFACT_BYTES_INVALID", { artifactKind: kind });
    }
    const markers = parseArtifactControlMarkers(markdown, {
      taskId: record.taskId,
      artifactKind: kind,
      artifactState: artifact.contentState,
    });
    if (!markers.valid || !publicTextBytesAreSafe(markdown)) {
      return fail("PREPARATION_GATE_A_ARTIFACT_MARKERS_INVALID", { artifactKind: kind });
    }
    const continuityRevisions = new Set([
      proposalPublication.publicationRevision,
      preparationPublicationRevision,
      preparationMainPublication.publicationRevision,
      fetchedMainRevision,
      publishedRef,
    ].filter((revision) => FULL_REVISION.test(revision ?? "")));
    for (const revision of continuityRevisions) {
      const currentFile = await gitFileAtRevision(run, repoRoot, revision, artifact.path);
      if (!currentFile.ok
        || !currentFile.bytes.equals(file.bytes)
        || crypto.createHash("sha256").update(currentFile.bytes).digest("hex") !== artifact.sha256) {
        return fail("PREPARATION_GATE_A_ARTIFACT_CONTINUITY_INVALID", {
          artifactKind: kind,
          revision,
        });
      }
    }
  }

  const candidateManifest = await gitJsonAtRevision(run, repoRoot, candidate.revision, MANIFEST_PATH);
  const proposalPublicationManifest = await gitJsonAtRevision(
    run, repoRoot, proposalPublication.publicationRevision, MANIFEST_PATH,
  );
  const publicationManifest = await gitJsonAtRevision(
    run, repoRoot, preparationPublicationRevision, MANIFEST_PATH,
  );
  const preparationMainManifest = FULL_REVISION.test(
    preparationMainPublication.publicationRevision ?? "",
  ) ? await gitJsonAtRevision(
      run, repoRoot, preparationMainPublication.publicationRevision, MANIFEST_PATH,
    ) : null;
  const currentManifest = await gitJsonAtRevision(run, repoRoot, publishedRef, MANIFEST_PATH);
  const fetchedMainManifest = fetchedMainRevision === publishedRef
    ? currentManifest
    : await gitJsonAtRevision(run, repoRoot, fetchedMainRevision, MANIFEST_PATH);
  const candidateReviewerRegistry = await gitJsonAtRevision(
    run, repoRoot, candidate.revision, REVIEWER_REGISTRY_PATH,
  );
  const proposalPublicationReviewerRegistry = await gitJsonAtRevision(
    run, repoRoot, proposalPublication.publicationRevision, REVIEWER_REGISTRY_PATH,
  );
  const publicationReviewerRegistry = await gitJsonAtRevision(
    run, repoRoot, preparationPublicationRevision, REVIEWER_REGISTRY_PATH,
  );
  const preparationMainReviewerRegistry = FULL_REVISION.test(
    preparationMainPublication.publicationRevision ?? "",
  ) ? await gitJsonAtRevision(
      run, repoRoot, preparationMainPublication.publicationRevision, REVIEWER_REGISTRY_PATH,
    ) : null;
  const currentReviewerRegistry = await gitJsonAtRevision(
    run, repoRoot, publishedRef, REVIEWER_REGISTRY_PATH,
  );
  const fetchedMainReviewerRegistry = fetchedMainRevision === publishedRef
    ? currentReviewerRegistry
    : await gitJsonAtRevision(run, repoRoot, fetchedMainRevision, REVIEWER_REGISTRY_PATH);
  if (!candidateManifest.ok || !proposalPublicationManifest.ok || !publicationManifest.ok
    || !fetchedMainManifest.ok || !currentManifest.ok
    || (preparationMainManifest !== null && !preparationMainManifest.ok)
    || !candidateReviewerRegistry.ok
    || !proposalPublicationReviewerRegistry.ok || !publicationReviewerRegistry.ok
    || (preparationMainReviewerRegistry !== null && !preparationMainReviewerRegistry.ok)
    || !fetchedMainReviewerRegistry.ok || !currentReviewerRegistry.ok) {
    return fail(!candidateManifest.ok || !proposalPublicationManifest.ok || !publicationManifest.ok
      || (preparationMainManifest !== null && !preparationMainManifest.ok)
      || !fetchedMainManifest.ok || !currentManifest.ok
      ? "PREPARATION_GATE_A_MANIFEST_UNAVAILABLE"
      : "PREPARATION_GATE_A_REVIEWER_REGISTRY_UNAVAILABLE");
  }
  const candidateTask = gateATaskSnapshot(candidateManifest.value, record.taskId);
  const proposalPublicationTask = gateATaskSnapshot(proposalPublicationManifest.value, record.taskId);
  const publicationTask = gateATaskSnapshot(publicationManifest.value, record.taskId);
  const preparationMainTask = preparationMainManifest === null
    ? null
    : gateATaskSnapshot(preparationMainManifest.value, record.taskId);
  const currentTask = gateATaskSnapshot(currentManifest.value, record.taskId);
  const fetchedMainTask = gateATaskSnapshot(fetchedMainManifest.value, record.taskId);
  if (candidateTask === null || proposalPublicationTask === null
    || publicationTask === null || fetchedMainTask === null || currentTask === null
    || (preparationMainManifest !== null && preparationMainTask === null)
    || canonicalJson(candidateTask) !== canonicalJson(proposalPublicationTask)
    || canonicalJson(proposalPublicationTask) !== canonicalJson(publicationTask)
    || (preparationMainTask !== null
      && canonicalJson(publicationTask) !== canonicalJson(preparationMainTask))
    || canonicalJson(preparationMainTask ?? publicationTask) !== canonicalJson(fetchedMainTask)
    || canonicalJson(fetchedMainTask) !== canonicalJson(currentTask)) {
    return fail("PREPARATION_GATE_A_EXPECTED_TASK_INVALID");
  }
  const expectedTask = candidateTask.expectedTask;
  if (ARTIFACT_KINDS.some((kind) => candidate.artifacts[kind].path !== candidateTask.artifactPaths[kind])) {
    return fail("PREPARATION_GATE_A_ARTIFACT_PATH_INVALID");
  }
  const candidatePublication = {
    revision: candidate.revision,
    baseRevision: candidate.baseRevision,
    bytesVerified: true,
    fullDiffVerified: true,
    candidateOnFetchedMain: true,
  };
  const derivedContext = { expectedTask, candidatePublication };
  if (!hasExactKeys(expectedTask, GATE_A_EXPECTED_TASK_KEYS)
    || !Array.isArray(expectedTask.dependencyIds)
    || !Array.isArray(expectedTask.acceptanceScenarioIds)
    || canonicalJson(proof.context) !== canonicalJson(derivedContext)) {
    return fail("PREPARATION_GATE_A_EXPECTED_CONTEXT_MISMATCH");
  }
  if (!candidateReviewerRegistry.bytes.equals(proposalPublicationReviewerRegistry.bytes)
    || !proposalPublicationReviewerRegistry.bytes.equals(publicationReviewerRegistry.bytes)
    || (preparationMainReviewerRegistry !== null
      && !publicationReviewerRegistry.bytes.equals(preparationMainReviewerRegistry.bytes))
    || !(preparationMainReviewerRegistry?.bytes ?? publicationReviewerRegistry.bytes)
      .equals(fetchedMainReviewerRegistry.bytes)
    || !fetchedMainReviewerRegistry.bytes.equals(currentReviewerRegistry.bytes)
    || canonicalJson(input.reviewerRegistry) !== canonicalJson(currentReviewerRegistry.value)
    || record.reviewerRegistrySha256 !== computeReviewerRegistrySha256(currentReviewerRegistry.value)) {
    return fail("PREPARATION_GATE_A_REVIEWER_REGISTRY_MISMATCH");
  }
  const replay = replayPreparationGateA(record, derivedContext);
  if (!replay.ok) return fail(replay.code);
  return pass("PREPARATION_GATE_A_GIT_PROOF_VALID", {
    proofVerified: true,
    taskId: record.taskId,
    stageId: record.stageId,
    preparationReviewId: record.preparationReviewId,
    expectedTask,
    candidatePublication,
    reviewerRegistrySha256: record.reviewerRegistrySha256,
    sourceFingerprint: replay.result.sourceFingerprint,
    proposalPublicationRevision: proposalPublication.publicationRevision,
    preparationArmMainRevision: preparationMainPublication.armMainRevision ?? null,
    preparationMainPublicationRevision: preparationMainPublication.publicationRevision ?? null,
  });
}

async function registryAtRevision(run, repoRoot, revision) {
  const shown = await runGit(run, repoRoot, ["show", `${revision}:${STAGE_APPROVAL_REGISTRY_PATH}`], null);
  if (!shown.ok) return { exists: false, bytes: null, registry: null };
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(shown.stdout);
    const registry = parseJsonWithoutDuplicateKeys(text, STAGE_APPROVAL_REGISTRY_PATH);
    return { exists: true, bytes: shown.stdout, registry };
  } catch {
    return { exists: true, bytes: shown.stdout, registry: null };
  }
}

function appendOnlyPrefix(previous, current) {
  return current.length >= previous.length
    && previous.every((record, index) => canonicalJson(record) === canonicalJson(current[index]));
}

function registryStaticFields(registry) {
  return {
    schemaVersion: registry.schemaVersion,
    registryId: registry.registryId,
    scopeTaskIds: registry.scopeTaskIds,
    historicalNonAuthorizingTaskIds: registry.historicalNonAuthorizingTaskIds,
  };
}

async function trustedRegistrySnapshotAtRevision(run, repoRoot, revision) {
  const snapshot = await registryAtRevision(run, repoRoot, revision);
  const tree = await runGit(run, repoRoot, ["ls-tree", revision, "--", STAGE_APPROVAL_REGISTRY_PATH]);
  if (!tree.ok) return { ok: false, code: "STAGE_REGISTRY_CONTINUITY_TREE_UNAVAILABLE" };
  const row = tree.stdout.trim();
  const match = row.match(/^(\d{6})\s+(\w+)\s+([0-9a-f]{40,64})\t(.+)$/);
  const treeExists = row !== "";
  if (snapshot.exists !== treeExists
    || (treeExists && (!match || match[4] !== STAGE_APPROVAL_REGISTRY_PATH))) {
    return { ok: false, code: "STAGE_REGISTRY_CONTINUITY_TREE_INVALID" };
  }
  if (!snapshot.exists) return { ok: true, exists: false, registry: null, bytes: null };
  if (match[1] !== "100644" || match[2] !== "blob") {
    return { ok: false, code: "STAGE_REGISTRY_CONTINUITY_PATH_TYPE_INVALID" };
  }
  const validation = validateStageApprovalRegistry(snapshot.registry);
  if (!validation.ok) return { ok: false, code: "STAGE_REGISTRY_CONTINUITY_SNAPSHOT_INVALID" };
  const canonicalBytes = Buffer.from(`${JSON.stringify(snapshot.registry, null, 2)}\n`, "utf8");
  if (!snapshot.bytes.equals(canonicalBytes)) {
    return { ok: false, code: "STAGE_REGISTRY_CONTINUITY_BYTES_NONCANONICAL" };
  }
  return {
    ok: true,
    exists: true,
    registry: snapshot.registry,
    bytes: snapshot.bytes,
    gitMode: match[1],
    gitType: match[2],
  };
}

/**
 * Prove registry-wide append-only continuity from the exact Stage 0 source
 * base through every parent edge. This remains authoritative even when a
 * record is removed and later reintroduced, which per-record history cannot
 * detect after the removal disappears from the current arrays.
 */
export async function verifyStageApprovalRegistryContinuity({
  repoRoot,
  run,
  publishedRef,
} = {}) {
  const sourceBaseRevision = STAGE_APPROVAL_REGISTRY_SOURCE_BASE_REVISION;
  if (typeof repoRoot !== "string" || typeof run !== "function"
    || !FULL_REVISION.test(publishedRef ?? "") || !FULL_REVISION.test(sourceBaseRevision ?? "")
    || publishedRef === sourceBaseRevision) {
    return fail("STAGE_REGISTRY_CONTINUITY_INPUT_INVALID");
  }
  const ancestry = await runGit(run, repoRoot, [
    "merge-base", "--is-ancestor", sourceBaseRevision, publishedRef,
  ]);
  if (!ancestry.ok) return fail("STAGE_REGISTRY_CONTINUITY_ANCESTRY_INVALID");

  const cache = new Map();
  const snapshotAt = async (revision) => {
    if (!cache.has(revision)) {
      cache.set(revision, await trustedRegistrySnapshotAtRevision(run, repoRoot, revision));
    }
    return cache.get(revision);
  };
  const base = await snapshotAt(sourceBaseRevision);
  if (!base.ok) return fail(base.code);
  if (base.exists) return fail("STAGE_REGISTRY_CONTINUITY_BASE_PRESENT");

  const history = await runGit(run, repoRoot, [
    "rev-list", "--reverse", "--topo-order", "--parents", "--ancestry-path",
    `${sourceBaseRevision}..${publishedRef}`,
  ]);
  if (!history.ok) return fail("STAGE_REGISTRY_CONTINUITY_HISTORY_UNAVAILABLE");
  const rows = history.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    .map((line) => line.split(/\s+/));
  if (rows.length === 0
    || rows.some((tokens) => tokens.length < 2 || tokens.some((token) => !FULL_REVISION.test(token)))
    || rows.at(-1)?.[0] !== publishedRef) {
    return fail("STAGE_REGISTRY_CONTINUITY_HISTORY_UNAVAILABLE");
  }

  const seenRevisions = new Set([sourceBaseRevision]);
  const registryIntroductionRevisions = [];
  const preparationIntroductions = new Map();
  const stageIntroductions = new Map();
  for (const [revision, ...parents] of rows) {
    if (seenRevisions.has(revision)) return fail("STAGE_REGISTRY_CONTINUITY_HISTORY_UNAVAILABLE");
    for (const parent of parents) {
      if (!seenRevisions.has(parent)) {
        return fail("STAGE_REGISTRY_CONTINUITY_PARENT_GRAPH_INVALID");
      }
    }
    const current = await snapshotAt(revision);
    if (!current.ok) return fail(current.code);
    const parentSnapshots = await Promise.all(parents.map((parent) => snapshotAt(parent)));
    const invalidParent = parentSnapshots.find((snapshot) => !snapshot.ok);
    if (invalidParent) return fail(invalidParent.code);
    const existingParents = parentSnapshots.filter((snapshot) => snapshot.exists);

    if (!current.exists) {
      if (existingParents.length > 0) {
        return fail("STAGE_REGISTRY_CONTINUITY_DELETION");
      }
      seenRevisions.add(revision);
      continue;
    }

    if (existingParents.length === 0) {
      if (parents.length !== 1
        || current.registry.preparationReviews.length !== 0
        || current.registry.stageApprovals.length !== 0) {
        return fail("STAGE_REGISTRY_CONTINUITY_GENESIS_INVALID");
      }
      registryIntroductionRevisions.push(revision);
      seenRevisions.add(revision);
      continue;
    }
    if (registryIntroductionRevisions.length === 0) return fail("STAGE_REGISTRY_CONTINUITY_GENESIS_INVALID");
    for (const parent of existingParents) {
      if (canonicalJson(registryStaticFields(parent.registry)) !== canonicalJson(registryStaticFields(current.registry))
        || !appendOnlyPrefix(parent.registry.preparationReviews, current.registry.preparationReviews)
        || !appendOnlyPrefix(parent.registry.stageApprovals, current.registry.stageApprovals)) {
        return fail("STAGE_REGISTRY_CONTINUITY_REWRITE");
      }
    }
    for (const record of current.registry.preparationReviews) {
      if (existingParents.every((parent) => !parent.registry.preparationReviews.some((entry) => (
        entry.preparationReviewId === record.preparationReviewId
      )))) {
        preparationIntroductions.set(record.preparationReviewId, [
          ...(preparationIntroductions.get(record.preparationReviewId) ?? []),
          revision,
        ]);
      }
    }
    for (const record of current.registry.stageApprovals) {
      if (existingParents.every((parent) => !parent.registry.stageApprovals.some((entry) => (
        entry.stageId === record.stageId
      )))) {
        stageIntroductions.set(record.stageId, [
          ...(stageIntroductions.get(record.stageId) ?? []),
          revision,
        ]);
      }
    }
    seenRevisions.add(revision);
  }

  const published = await snapshotAt(publishedRef);
  if (!published.ok) return fail(published.code);
  if (!published.exists || registryIntroductionRevisions.length === 0) {
    return fail("STAGE_REGISTRY_CONTINUITY_CURRENT_MISSING");
  }
  if (registryIntroductionRevisions.length !== 1) {
    return fail("STAGE_REGISTRY_CONTINUITY_GENESIS_INVALID");
  }
  if (published.registry.preparationReviews.some((record) => (
    preparationIntroductions.get(record.preparationReviewId)?.length !== 1
  )) || published.registry.stageApprovals.some((record) => (
    stageIntroductions.get(record.stageId)?.length !== 1
  ))) {
    return fail("STAGE_REGISTRY_CONTINUITY_RECORD_PUBLICATION_CARDINALITY_INVALID");
  }
  return pass("STAGE_REGISTRY_CONTINUITY_VALID", {
    sourceBaseRevision,
    introductionRevision: registryIntroductionRevisions[0],
    publishedRef,
    preparationReviewCount: published.registry.preparationReviews.length,
    stageApprovalCount: published.registry.stageApprovals.length,
    registrySha256: crypto.createHash("sha256").update(published.bytes).digest("hex"),
    preparationPublicationRevisions: Object.fromEntries(
      [...preparationIntroductions].map(([recordId, revisions]) => [recordId, revisions[0]]),
    ),
    stagePublicationRevisions: Object.fromEntries(
      [...stageIntroductions].map(([recordId, revisions]) => [recordId, revisions[0]]),
    ),
  });
}

async function exactSingleRecordPublication({
  run,
  repoRoot,
  revision,
  requiredParentRevision,
  collectionName,
  idKey,
  recordId,
}) {
  const parents = await runGit(run, repoRoot, ["rev-list", "--parents", "-n", "1", revision]);
  const tokens = parents.ok ? parents.stdout.trim().split(/\s+/) : [];
  if (tokens.length !== 2 || tokens[0] !== revision || tokens[1] !== requiredParentRevision) return false;
  const parent = await registryAtRevision(run, repoRoot, tokens[1]);
  const current = await registryAtRevision(run, repoRoot, revision);
  if (!parent.exists || !current.exists
    || !validateStageApprovalRegistry(parent.registry).ok
    || !validateStageApprovalRegistry(current.registry).ok) return false;
  const otherCollection = collectionName === "preparationReviews" ? "stageApprovals" : "preparationReviews";
  return appendOnlyPrefix(parent.registry[collectionName], current.registry[collectionName])
    && current.registry[collectionName].length === parent.registry[collectionName].length + 1
    && canonicalJson(parent.registry[otherCollection]) === canonicalJson(current.registry[otherCollection])
    && current.registry[collectionName].at(-1)?.[idKey] === recordId;
}

/** Verify proposal candidate absence -> first later immutable Gate-A acceptance publication. */
export async function verifyPreparationReviewRegistryHistory({
  repoRoot,
  run,
  publishedRef,
  fetchedMainRevision = publishedRef,
  preparationReviewId,
  continuity = null,
} = {}) {
  if (typeof repoRoot !== "string" || typeof run !== "function"
    || !FULL_REVISION.test(publishedRef ?? "") || !FULL_REVISION.test(fetchedMainRevision ?? "")
    || !PREPARATION_REVIEW_ID.test(preparationReviewId ?? "")) {
    return fail("PREPARATION_REVIEW_HISTORY_INPUT_INVALID");
  }
  const published = await registryAtRevision(run, repoRoot, publishedRef);
  const publishedValidation = validateStageApprovalRegistry(published.registry);
  if (!published.exists || !publishedValidation.ok) return fail("PREPARATION_REVIEW_HISTORY_PUBLISHED_INVALID");
  const matches = published.registry.preparationReviews.filter((record) => (
    record.preparationReviewId === preparationReviewId
  ));
  if (matches.length !== 1) return fail("PREPARATION_REVIEW_HISTORY_RECORD_MISSING");
  const record = matches[0];
  const proposalRevision = record.proposalCandidate.revision;
  const ancestry = await runGit(run, repoRoot, ["merge-base", "--is-ancestor", proposalRevision, publishedRef]);
  if (!ancestry.ok || proposalRevision === publishedRef) return fail("PREPARATION_REVIEW_HISTORY_ANCESTRY_INVALID");
  const proposal = await registryAtRevision(run, repoRoot, proposalRevision);
  if (!proposal.exists || !validateStageApprovalRegistry(proposal.registry).ok
    || proposal.registry.preparationReviews.some((entry) => entry.preparationReviewId === preparationReviewId)) {
    return fail("PREPARATION_REVIEW_HISTORY_SELF_REFERENCE");
  }
  const continuityResult = continuity ?? await verifyStageApprovalRegistryContinuity({
    repoRoot,
    run,
    publishedRef,
  });
  if (!continuityResult.ok) return fail("PREPARATION_REVIEW_HISTORY_REWRITE");
  const preparationPublicationRevision = continuityResult
    .preparationPublicationRevisions?.[preparationReviewId] ?? null;
  if (!FULL_REVISION.test(preparationPublicationRevision ?? "")) {
    return fail("PREPARATION_REVIEW_HISTORY_RECORD_MISSING");
  }
  const publication = await registryAtRevision(run, repoRoot, preparationPublicationRevision);
  const publicationRecord = publication.registry?.preparationReviews.find((entry) => (
    entry.preparationReviewId === preparationReviewId
  ));
  if (!publication.exists || canonicalJson(publicationRecord) !== canonicalJson(record)) {
    return fail("PREPARATION_REVIEW_HISTORY_REWRITE");
  }
  const gateAProof = await verifyPreparationGateAProofFromGit({
    repoRoot,
    run,
    publishedRef,
    fetchedMainRevision,
    preparationPublicationRevision,
    record,
  });
  if (!gateAProof.ok || gateAProof.proofVerified !== true) {
    return fail(gateAProof.code ?? "PREPARATION_GATE_A_GIT_PROOF_INVALID");
  }
  if (!FULL_REVISION.test(gateAProof.preparationArmMainRevision ?? "")) {
    return fail("PREPARATION_GATE_A_PREPARATION_PUBLICATION_BOUNDARY_INVALID");
  }
  if (fetchedMainRevision !== publishedRef) {
    const exactPublicationPr = publishedRef === preparationPublicationRevision
      && fetchedMainRevision === gateAProof.preparationArmMainRevision;
    const laterDescendantPr = !exactPublicationPr
      && FULL_REVISION.test(gateAProof.preparationMainPublicationRevision ?? "")
      && await laterPullRequestHeadAfterMainAnchor({
        run,
        repoRoot,
        anchorMainRevision: gateAProof.preparationMainPublicationRevision,
        fetchedMainRevision,
        publishedRef,
      });
    if (!exactPublicationPr && !laterDescendantPr) {
      return fail("PREPARATION_REVIEW_PUBLICATION_SCOPE_INVALID");
    }
  }
  if (!await exactSingleRecordPublication({
    run,
    repoRoot,
    revision: preparationPublicationRevision,
    requiredParentRevision: gateAProof.preparationArmMainRevision,
    collectionName: "preparationReviews",
    idKey: "preparationReviewId",
    recordId: preparationReviewId,
  })) return fail("PREPARATION_REVIEW_PUBLICATION_SCOPE_INVALID");
  return pass("PREPARATION_REVIEW_HISTORY_VALID", {
    taskId: record.taskId,
    stageId: record.stageId,
    preparationReviewId,
    record,
    preparationReviewSha256: preparationReviewRecordDigest(record),
    registrySha256: crypto.createHash("sha256").update(published.bytes).digest("hex"),
    preparationPublicationRevision,
    publishedRef,
    preparationProofVerified: true,
    preparationExpectedTask: gateAProof.expectedTask,
    preparationTaskContractSha256: gateAProof.expectedTask.taskContractSha256,
    preparationCandidatePublication: gateAProof.candidatePublication,
    preparationSourceFingerprint: gateAProof.sourceFingerprint,
    proposalPublicationRevision: gateAProof.proposalPublicationRevision,
    preparationArmMainRevision: gateAProof.preparationArmMainRevision,
    preparationMainPublicationRevision: gateAProof.preparationMainPublicationRevision,
  });
}

/** Verify proposal -> accepted preparation -> implementation candidate -> stage approval publication. */
export async function verifyStageApprovalRegistryHistory({
  repoRoot,
  run,
  publishedRef,
  fetchedMainRevision = publishedRef,
  stageId,
  continuity = null,
} = {}) {
  if (typeof repoRoot !== "string" || typeof run !== "function"
    || !FULL_REVISION.test(publishedRef ?? "") || !FULL_REVISION.test(fetchedMainRevision ?? "")
    || !STAGE_ID.test(stageId ?? "")) {
    return fail("STAGE_APPROVAL_HISTORY_INPUT_INVALID");
  }
  const published = await registryAtRevision(run, repoRoot, publishedRef);
  const publishedValidation = validateStageApprovalRegistry(published.registry);
  if (!published.exists || !publishedValidation.ok) return fail("STAGE_APPROVAL_HISTORY_PUBLISHED_INVALID");
  const matches = published.registry.stageApprovals.filter((record) => record.stageId === stageId);
  if (matches.length !== 1) return fail("STAGE_APPROVAL_HISTORY_RECORD_MISSING");
  const record = matches[0];
  const preparationMatches = published.registry.preparationReviews.filter((entry) => (
    entry.preparationReviewId === record.preparationReviewId
  ));
  if (preparationMatches.length !== 1) return fail("PREPARATION_REVIEW_HISTORY_RECORD_MISSING");
  const preparationReview = preparationMatches[0];
  if (preparationReviewRecordDigest(preparationReview) !== record.preparationReviewSha256) {
    return fail("STAGE_APPROVAL_PREPARATION_BINDING_INVALID");
  }
  const stagePrMode = fetchedMainRevision !== publishedRef;
  const preparationHistory = await verifyPreparationReviewRegistryHistory({
    repoRoot,
    run,
    publishedRef: stagePrMode ? fetchedMainRevision : publishedRef,
    fetchedMainRevision,
    preparationReviewId: record.preparationReviewId,
    continuity: stagePrMode ? null : continuity,
  });
  if (!preparationHistory.ok) return preparationHistory;
  const proposalRevision = preparationReview.proposalCandidate.revision;
  const proposalAncestry = await runGit(run, repoRoot, ["merge-base", "--is-ancestor", proposalRevision, publishedRef]);
  const stageAncestry = await runGit(run, repoRoot, ["merge-base", "--is-ancestor", record.candidateRevision, publishedRef]);
  if (!proposalAncestry.ok || !stageAncestry.ok
    || proposalRevision === publishedRef || record.candidateRevision === publishedRef) {
    return fail("STAGE_APPROVAL_HISTORY_ANCESTRY_INVALID");
  }
  const proposal = await registryAtRevision(run, repoRoot, proposalRevision);
  if (!proposal.exists || !validateStageApprovalRegistry(proposal.registry).ok
    || proposal.registry.preparationReviews.some((entry) => entry.preparationReviewId === record.preparationReviewId)
    || proposal.registry.stageApprovals.some((entry) => entry.stageId === stageId)) {
    return fail("STAGE_APPROVAL_HISTORY_SELF_REFERENCE");
  }
  const continuityResult = continuity ?? await verifyStageApprovalRegistryContinuity({
    repoRoot,
    run,
    publishedRef,
  });
  if (!continuityResult.ok) return fail("STAGE_APPROVAL_HISTORY_REWRITE");
  const preparationPublicationRevision = continuityResult
    .preparationPublicationRevisions?.[record.preparationReviewId] ?? null;
  const stagePublicationRevision = continuityResult.stagePublicationRevisions?.[stageId] ?? null;
  if (!FULL_REVISION.test(preparationPublicationRevision ?? "")
    || !FULL_REVISION.test(stagePublicationRevision ?? "")) {
    return fail("STAGE_APPROVAL_HISTORY_RECORD_MISSING");
  }
  const stagePublication = await registryAtRevision(run, repoRoot, stagePublicationRevision);
  const publishedStageRecord = stagePublication.registry?.stageApprovals.find((entry) => entry.stageId === stageId);
  if (canonicalJson(publishedStageRecord) !== canonicalJson(record)) return fail("STAGE_APPROVAL_HISTORY_REWRITE");
  const preparationMainPublicationRevision = preparationHistory.preparationMainPublicationRevision;
  if (!FULL_REVISION.test(preparationMainPublicationRevision ?? "")) {
    return fail("STAGE_PREPARATION_MAIN_PUBLICATION_MISSING");
  }
  const implementationMainPublication = await deriveImplementationMainPublicationBoundary({
    run,
    repoRoot,
    fetchedMainRevision,
    preparationMainPublicationRevision,
    candidateRevision: record.candidateRevision,
    candidateBaseRevision: record.candidate?.baseRevision,
  });
  if (!implementationMainPublication.ok) return fail(implementationMainPublication.code);
  const stageMainPublication = await deriveStageMainPublicationBoundary({
    run,
    repoRoot,
    fetchedMainRevision,
    publishedRef,
    implementationMainPublicationRevision: implementationMainPublication.publicationRevision,
    stagePublicationRevision,
    record,
  });
  if (!stageMainPublication.ok) return fail(stageMainPublication.code);
  if (!FULL_REVISION.test(stageMainPublication.armMainRevision ?? "")) {
    return fail("STAGE_MAIN_PUBLICATION_BOUNDARY_INVALID");
  }
  if (stagePrMode) {
    const exactPublicationPr = publishedRef === stagePublicationRevision
      && fetchedMainRevision === stageMainPublication.armMainRevision;
    const laterDescendantPr = !exactPublicationPr
      && FULL_REVISION.test(stageMainPublication.publicationRevision ?? "")
      && await laterPullRequestHeadAfterMainAnchor({
        run,
        repoRoot,
        anchorMainRevision: stageMainPublication.publicationRevision,
        fetchedMainRevision,
        publishedRef,
      });
    if (!exactPublicationPr && !laterDescendantPr) {
      return fail("STAGE_APPROVAL_PUBLICATION_SCOPE_INVALID");
    }
  }
  if (fetchedMainRevision === publishedRef && stageMainPublication.published !== true) {
    return fail("STAGE_MAIN_PUBLICATION_MISSING");
  }
  if (preparationPublicationRevision !== preparationHistory.preparationPublicationRevision
    || !await exactSingleRecordPublication({
    run,
    repoRoot,
    revision: stagePublicationRevision,
    requiredParentRevision: stageMainPublication.armMainRevision,
    collectionName: "stageApprovals",
      idKey: "stageId",
      recordId: stageId,
    })) {
    return fail("STAGE_APPROVAL_PUBLICATION_SCOPE_INVALID");
  }
  const preparationBeforeCandidate = await runGit(run, repoRoot, [
    "merge-base", "--is-ancestor", preparationMainPublicationRevision, record.candidateRevision,
  ]);
  const candidateBeforeStage = await runGit(run, repoRoot, [
    "merge-base", "--is-ancestor", implementationMainPublication.publicationRevision, stagePublicationRevision,
  ]);
  const stageCandidateRegistry = await registryAtRevision(run, repoRoot, record.candidateRevision);
  const candidateBaseManifest = await gitJsonAtRevision(
    run, repoRoot, implementationMainPublication.candidateBaseRevision, MANIFEST_PATH,
  );
  const implementationManifest = await gitJsonAtRevision(run, repoRoot, record.candidateRevision, MANIFEST_PATH);
  const implementationMainManifest = await gitJsonAtRevision(
    run, repoRoot, implementationMainPublication.publicationRevision, MANIFEST_PATH,
  );
  const stagePublicationManifest = await gitJsonAtRevision(run, repoRoot, stagePublicationRevision, MANIFEST_PATH);
  const currentManifest = await gitJsonAtRevision(run, repoRoot, publishedRef, MANIFEST_PATH);
  const candidateBaseReviewerRegistry = await gitJsonAtRevision(
    run, repoRoot, implementationMainPublication.candidateBaseRevision, REVIEWER_REGISTRY_PATH,
  );
  const trustedPreparationReviewerRegistry = await gitJsonAtRevision(
    run, repoRoot, preparationHistory.preparationCandidatePublication.revision, REVIEWER_REGISTRY_PATH,
  );
  for (const kind of ARTIFACT_KINDS) {
    const proposalBinding = preparationReview.proposalCandidate.artifactBindings[kind];
    const implementationBinding = record.candidate?.artifacts?.[kind];
    const candidateBaseArtifact = await gitFileAtRevision(
      run,
      repoRoot,
      implementationMainPublication.candidateBaseRevision,
      proposalBinding.path,
    );
    if (implementationBinding?.path !== proposalBinding.path
      || implementationBinding?.sha256 !== proposalBinding.sha256
      || !candidateBaseArtifact.ok
      || crypto.createHash("sha256").update(candidateBaseArtifact.bytes).digest("hex")
        !== proposalBinding.sha256) {
      return fail("PREPARATION_GATE_A_ARTIFACT_CONTINUITY_INVALID", {
        artifactKind: kind,
        revision: implementationMainPublication.candidateBaseRevision,
      });
    }
  }
  const expectedTask = preparationHistory.preparationExpectedTask;
  const candidateBaseTask = candidateBaseManifest.ok
    ? gateATaskSnapshot(candidateBaseManifest.value, record.taskId)?.expectedTask ?? null
    : null;
  const implementationTask = implementationManifest.ok
    ? gateATaskSnapshot(implementationManifest.value, record.taskId)?.expectedTask ?? null
    : null;
  const implementationMainTask = implementationMainManifest.ok
    ? gateATaskSnapshot(implementationMainManifest.value, record.taskId)?.expectedTask ?? null
    : null;
  const stagePublicationTask = stagePublicationManifest.ok
    ? gateATaskSnapshot(stagePublicationManifest.value, record.taskId)?.expectedTask ?? null
    : null;
  const currentTask = currentManifest.ok
    ? gateATaskSnapshot(currentManifest.value, record.taskId)?.expectedTask ?? null
    : null;
  if (expectedTask === null
    || candidateBaseTask === null || implementationTask === null || implementationMainTask === null
    || stagePublicationTask === null || currentTask === null
    || canonicalJson(candidateBaseTask) !== canonicalJson(expectedTask)
    || canonicalJson(implementationTask) !== canonicalJson(expectedTask)
    || canonicalJson(implementationMainTask) !== canonicalJson(expectedTask)
    || canonicalJson(stagePublicationTask) !== canonicalJson(expectedTask)
    || canonicalJson(currentTask) !== canonicalJson(expectedTask)
    || record.candidate?.taskContractSha256 !== expectedTask.taskContractSha256) {
    return fail("PREPARATION_GATE_A_EXPECTED_TASK_INVALID");
  }
  if (!candidateBaseReviewerRegistry.ok
    || !trustedPreparationReviewerRegistry.ok
    || !candidateBaseReviewerRegistry.bytes.equals(trustedPreparationReviewerRegistry.bytes)
    || computeReviewerRegistrySha256(candidateBaseReviewerRegistry.value)
      !== preparationReview.reviewerRegistrySha256) {
    return fail("PREPARATION_GATE_A_REVIEWER_REGISTRY_MISMATCH");
  }
  if (!preparationBeforeCandidate.ok || !candidateBeforeStage.ok
    || preparationMainPublicationRevision === record.candidateRevision
    || record.candidateRevision === stagePublicationRevision
    || !stageCandidateRegistry.exists
    || !validateStageApprovalRegistry(stageCandidateRegistry.registry).ok
    || stageCandidateRegistry.registry.stageApprovals.some((entry) => entry.stageId === stageId)
    || stageCandidateRegistry.registry.preparationReviews.filter((entry) => (
      entry.preparationReviewId === record.preparationReviewId
        && preparationReviewRecordDigest(entry) === record.preparationReviewSha256
    )).length !== 1) {
    return fail("STAGE_APPROVAL_HISTORY_SEQUENCE_INVALID");
  }
  return pass("STAGE_APPROVAL_HISTORY_VALID", {
    taskId: record.taskId,
    stageId,
    record,
    preparationReview,
    preparationReviewSha256: record.preparationReviewSha256,
    stageApprovalSha256: stageApprovalRecordDigest(record),
    registrySha256: crypto.createHash("sha256").update(published.bytes).digest("hex"),
    preparationPublicationRevision,
    stagePublicationRevision,
    preparationMainPublicationRevision,
    implementationMainPublicationRevision: implementationMainPublication.publicationRevision,
    stageArmMainRevision: stageMainPublication.armMainRevision,
    stageMainPublicationRevision: stageMainPublication.publicationRevision ?? null,
    publishedRef,
    preparationProofVerified: preparationHistory.preparationProofVerified === true,
    preparationExpectedTask: preparationHistory.preparationExpectedTask,
    preparationTaskContractSha256: preparationHistory.preparationTaskContractSha256,
    preparationCandidatePublication: preparationHistory.preparationCandidatePublication,
    preparationSourceFingerprint: preparationHistory.preparationSourceFingerprint,
  });
}

export function stageBindingDigest(definition) {
  const validation = validateStagedActionDefinition(definition);
  if (!validation.ok) throw new TypeError(validation.code);
  return `sha256:${crypto.createHash("sha256").update(canonicalJson(definition)).digest("hex")}`;
}

export function validateStagedActionDefinition(definition) {
  if (!hasExactKeys(definition, DEFINITION_KEYS)) return fail("STAGE_DEFINITION_SHAPE_INVALID");
  if (definition.schemaVersion !== STAGED_ACTION_SCHEMA_VERSION) return fail("STAGE_SCHEMA_VERSION_INVALID");
  if (!stageTaskIsAllowlisted(
    definition.taskId,
    definition.stageId,
    definition.scopeClass,
    definition.actionClass,
  )) return fail("STAGE_TASK_NOT_ALLOWLISTED");
  if (!pairIsOwned(definition.taskId, definition.stageId, definition.scopeClass, definition.actionClass)) {
    return fail("STAGE_SCOPE_ACTION_NOT_OWNED");
  }
  if (!STAGE_ID.test(definition.stageId)
    || !definition.stageId.startsWith(`P0-STAGE-${definition.taskId}-`)) {
    return fail("STAGE_ID_INVALID");
  }
  if (!IDEMPOTENCY_KEY.test(definition.idempotencyKey)) return fail("STAGE_IDEMPOTENCY_KEY_INVALID");
  if (!CLOSED_IDENTIFIER.test(definition.moduleId) || !CLOSED_IDENTIFIER.test(definition.argumentSetId)) {
    return fail("STAGE_RUNNER_BINDING_INVALID");
  }
  if (!deliveryTransitionModuleIsBound(definition)) {
    return fail("STAGE_DELIVERY_TRANSITION_CONTRACT_INVALID");
  }
  if (!Number.isSafeInteger(definition.deadlineMs)
    || definition.deadlineMs < MIN_STAGE_DEADLINE_MS
    || definition.deadlineMs > MAX_SERIALIZABLE_STAGE_DEADLINE_MS) {
    return fail("STAGE_DEADLINE_INVALID");
  }
  if (definition.predecessor !== null) {
    if (!hasExactKeys(definition.predecessor, PREDECESSOR_KEYS)
      || !STAGE_ID.test(definition.predecessor.stageId)
      || !SHA256_DIGEST.test(definition.predecessor.receiptDigest)
      || definition.predecessor.stageId === definition.stageId) {
      return fail("STAGE_PREDECESSOR_INVALID");
    }
  }
  return pass("STAGE_DEFINITION_VALID", {
    taskId: definition.taskId,
    stageId: definition.stageId,
    stageBindingDigest: `sha256:${crypto.createHash("sha256").update(canonicalJson(definition)).digest("hex")}`,
  });
}

/** Gate A authorizes candidate preparation only and cannot carry execution permission. */
export function validateGateAPreparationDecision(decision) {
  if (!hasExactKeys(decision, PREPARATION_KEYS)) return fail("GATE_A_DECISION_SHAPE_INVALID");
  if (decision.schemaVersion !== STAGED_ACTION_SCHEMA_VERSION || decision.gate !== "Gate A") {
    return fail("GATE_A_DECISION_INVALID");
  }
  if (!TASK_SET.has(decision.taskId)) return fail("GATE_A_TASK_NOT_ALLOWLISTED");
  if (!FULL_REVISION.test(decision.candidateRevision) || !RAW_SHA256.test(decision.dossierDigest)) {
    return fail("GATE_A_BINDING_INVALID");
  }
  if (typeof decision.preparationAllowed !== "boolean") return fail("GATE_A_DECISION_INVALID");
  return pass("GATE_A_PREPARATION_DECISION_VALID", {
    taskId: decision.taskId,
    preparationAllowed: decision.preparationAllowed,
    executionAllowed: false,
  });
}

function validateReceiptEnvelope(receipt) {
  if (!hasExactKeys(receipt, RECEIPT_KEYS)) return fail("STAGE_RECEIPT_SHAPE_INVALID");
  if (receipt.schemaVersion !== STAGED_ACTION_SCHEMA_VERSION
    || !stageTaskIsAllowlisted(receipt.taskId, receipt.stageId, receipt.scopeClass, receipt.actionClass)
    || !STAGE_ID.test(receipt.stageId ?? "")
    || !receipt.stageId.startsWith(`P0-STAGE-${receipt.taskId}-`)
    || !IDEMPOTENCY_KEY.test(receipt.idempotencyKey ?? "")
    || !FULL_REVISION.test(receipt.sourceRevision)
    || !["execute", "accept"].includes(receipt.gateKind)
    || !Number.isFinite(Date.parse(receipt.authorityDeadline ?? ""))
    || typeof receipt.rollbackSnapshotReference !== "string"
    || !/^[a-z][a-z0-9-]*:[A-Za-z0-9._/-]{4,160}$/.test(receipt.rollbackSnapshotReference)
    || !publicTextBytesAreSafe(receipt.rollbackSnapshotReference)
    || !SHA256_DIGEST.test(receipt.stageBindingDigest ?? "")
    || !PREPARATION_REVIEW_ID.test(receipt.preparationReviewId ?? "")
    || !RAW_SHA256.test(receipt.preparationReviewSha256 ?? "")
    || !FULL_REVISION.test(receipt.candidateRevision ?? "")
    || !RAW_SHA256.test(receipt.dossierDigest ?? "")
    || !RAW_SHA256.test(receipt.stageApprovalSha256 ?? "")
    || !RAW_SHA256.test(receipt.registrySha256 ?? "")
    || !SHA256_DIGEST.test(receipt.gateSourceFingerprint ?? "")
    || !STAGE_LIFECYCLE_STATES.includes(receipt.state)
    || !Number.isSafeInteger(receipt.attempt)
    || receipt.attempt < 1) {
    return fail("STAGE_RECEIPT_BINDING_INVALID");
  }
  const evidenceKeys = [
    "moduleSha256", "childResultSha256", "evidenceDigest", "stdoutSha256", "stderrSha256",
    "immediateVerificationSha256", "quiescent1VerificationSha256", "quiescent2VerificationSha256",
  ];
  if (!evidenceKeys.every((key) => receipt[key] === null || SHA256_DIGEST.test(receipt[key] ?? ""))
    || (receipt.state === "verified-complete" && !evidenceKeys.every((key) => SHA256_DIGEST.test(receipt[key] ?? "")))) {
    return fail("STAGE_RECEIPT_EVIDENCE_INVALID");
  }
  const verificationResultKeys = [
    "immediateVerificationResult", "quiescent1VerificationResult", "quiescent2VerificationResult",
  ];
  if (!verificationResultKeys.every((key) => receipt[key] === null || receipt[key] === "pass")
    || (receipt.state === "verified-complete" && !verificationResultKeys.every((key) => receipt[key] === "pass"))) {
    return fail("STAGE_RECEIPT_VERIFICATION_INVALID");
  }
  return pass("STAGE_RECEIPT_ENVELOPE_VALID");
}

export function validateStageReceipt(receipt, definition, authorization = null) {
  const definitionValidation = validateStagedActionDefinition(definition);
  if (!definitionValidation.ok) return definitionValidation;
  const envelopeValidation = validateReceiptEnvelope(receipt);
  if (!envelopeValidation.ok) return envelopeValidation;
  if (receipt.taskId !== definition.taskId
    || receipt.scopeClass !== definition.scopeClass
    || receipt.actionClass !== definition.actionClass
    || receipt.stageId !== definition.stageId
    || receipt.idempotencyKey !== definition.idempotencyKey
    || receipt.stageBindingDigest !== definitionValidation.stageBindingDigest) {
    return fail("STAGE_RECEIPT_BINDING_INVALID");
  }
  const expectedPredecessor = definition.predecessor?.receiptDigest ?? null;
  if (receipt.predecessorReceiptSha256 !== expectedPredecessor) {
    return fail("STAGE_RECEIPT_PREDECESSOR_MISMATCH");
  }
  if (authorization !== null && (receipt.sourceRevision !== authorization.sourceRevision
    || receipt.gateKind !== authorization.gateKind
    || receipt.authorityDeadline !== authorization.deadlineAt
    || receipt.rollbackSnapshotReference !== authorization.rollbackSnapshotReference
    || receipt.preparationReviewId !== authorization.preparationReviewId
    || receipt.preparationReviewSha256 !== authorization.preparationReviewSha256
    || receipt.candidateRevision !== authorization.candidateRevision
    || receipt.dossierDigest !== authorization.dossierDigest
    || receipt.stageApprovalSha256 !== authorization.stageApprovalSha256
    || receipt.registrySha256 !== authorization.registrySha256
    || receipt.gateSourceFingerprint !== authorization.gateSourceFingerprint
    || receipt.moduleSha256 !== authorization.moduleSha256)) {
    return fail("STAGE_RECEIPT_AUTHORIZATION_MISMATCH");
  }
  return pass("STAGE_RECEIPT_VALID", {
    taskId: receipt.taskId,
    stageId: receipt.stageId,
    terminal: TERMINAL_STATE_SET.has(receipt.state),
  });
}

export function validateHistoricalStageReceipt(receipt, binding) {
  const envelopeValidation = validateReceiptEnvelope(receipt);
  if (!envelopeValidation.ok) return envelopeValidation;
  if (!hasExactKeys(binding, HISTORICAL_RECEIPT_BINDING_KEYS)
    || !TERMINAL_STATE_SET.has(receipt.state)) {
    return fail("STAGE_HISTORICAL_RECEIPT_BINDING_INVALID");
  }
  const comparisons = {
    taskId: binding.taskId,
    stageId: binding.stageId,
    scopeClass: binding.scopeClass,
    actionClass: binding.actionClass,
    idempotencyKey: binding.idempotencyKey,
    predecessorReceiptSha256: binding.predecessorReceiptSha256,
    preparationReviewId: binding.preparationReviewId,
    preparationReviewSha256: binding.preparationReviewSha256,
    candidateRevision: binding.candidateRevision,
    dossierDigest: binding.dossierDigest,
    stageApprovalSha256: binding.stageApprovalSha256,
    stageBindingDigest: binding.stageDefinitionSha256,
    moduleSha256: binding.moduleSha256,
    gateKind: binding.gateKind,
    rollbackSnapshotReference: binding.rollbackSnapshotReference,
  };
  if (!Object.entries(comparisons).every(([key, value]) => receipt[key] === value)) {
    return fail("STAGE_HISTORICAL_RECEIPT_BINDING_INVALID");
  }
  return pass("STAGE_HISTORICAL_RECEIPT_VALID", {
    taskId: receipt.taskId,
    stageId: receipt.stageId,
    terminal: true,
  });
}

export function validateStageChain(definitions, receipts = []) {
  if (!Array.isArray(definitions) || definitions.length === 0 || !Array.isArray(receipts)) {
    return fail("STAGE_CHAIN_SHAPE_INVALID");
  }
  const definitionById = new Map();
  const idempotencyKeys = new Set();
  for (const definition of definitions) {
    const validation = validateStagedActionDefinition(definition);
    if (!validation.ok) return validation;
    if (definitionById.has(definition.stageId)) return fail("STAGE_ID_DUPLICATE");
    if (idempotencyKeys.has(definition.idempotencyKey)) return fail("STAGE_IDEMPOTENCY_KEY_DUPLICATE");
    definitionById.set(definition.stageId, definition);
    idempotencyKeys.add(definition.idempotencyKey);
  }
  const receiptByDigest = new Map();
  for (const receipt of receipts) {
    if (!isPlainRecord(receipt) || typeof receipt.stageId !== "string") return fail("STAGE_RECEIPT_SHAPE_INVALID");
    const definition = definitionById.get(receipt.stageId);
    if (!definition) return fail("STAGE_RECEIPT_UNKNOWN_STAGE");
    const validation = validateStageReceipt(receipt, definition);
    if (!validation.ok) return validation;
    const digest = `sha256:${crypto.createHash("sha256").update(canonicalJson(receipt)).digest("hex")}`;
    if (receiptByDigest.has(digest)) return fail("STAGE_RECEIPT_DUPLICATE");
    receiptByDigest.set(digest, receipt);
  }
  for (const definition of definitions) {
    if (definition.predecessor === null) continue;
    const predecessor = receiptByDigest.get(definition.predecessor.receiptDigest);
    if (!predecessor
      || predecessor.stageId !== definition.predecessor.stageId
      || predecessor.taskId !== definition.taskId
      || predecessor.state !== "verified-complete") {
      return fail("STAGE_PREDECESSOR_NOT_SUCCEEDED", { stageId: definition.stageId });
    }
  }
  return pass("STAGE_CHAIN_VALID", {
    stageCount: definitions.length,
    receiptCount: receipts.length,
  });
}

/** Closed lifecycle check: registry records cannot select code without reviewed code-owned maps. */
export function validateStageRuntimeLifecycle({
  registry,
  definitions,
  moduleBindings,
  outcomeVerificationModuleIds,
} = {}) {
  const registryValidation = validateStageApprovalRegistry(registry);
  if (!registryValidation.ok) return registryValidation;
  if (!Array.isArray(definitions) || !Array.isArray(moduleBindings)
    || !Array.isArray(outcomeVerificationModuleIds)) return fail("STAGE_RUNTIME_LIFECYCLE_SHAPE_INVALID");
  const definitionsByStage = new Map();
  const definitionIdempotencyKeys = new Set();
  for (const definition of definitions) {
    const validation = validateStagedActionDefinition(definition);
    if (!validation.ok) return validation;
    if (definitionsByStage.has(definition.stageId) || definitionIdempotencyKeys.has(definition.idempotencyKey)) {
      return fail("STAGE_RUNTIME_DEFINITION_DUPLICATE");
    }
    definitionsByStage.set(definition.stageId, definition);
    definitionIdempotencyKeys.add(definition.idempotencyKey);
  }
  const moduleById = new Map();
  for (const binding of moduleBindings) {
    if (!hasExactKeys(binding, ["moduleId", "moduleRelativePath", "moduleSha256", "gitMode", "argumentSetIds"])
      || !CLOSED_IDENTIFIER.test(binding.moduleId ?? "")
      || !/^tools\/[A-Za-z0-9._/-]+\.mjs$/.test(binding.moduleRelativePath ?? "")
      || binding.moduleRelativePath.includes("..")
      || !SHA256_DIGEST.test(binding.moduleSha256 ?? "")
      || !["100644", "100755"].includes(binding.gitMode)
      || !Array.isArray(binding.argumentSetIds)
      || binding.argumentSetIds.length === 0
      || !binding.argumentSetIds.every((id) => CLOSED_IDENTIFIER.test(id ?? ""))
      || moduleById.has(binding.moduleId)) return fail("STAGE_RUNTIME_MODULE_BINDING_INVALID");
    moduleById.set(binding.moduleId, binding);
  }
  if (new Set(outcomeVerificationModuleIds).size !== outcomeVerificationModuleIds.length
    || !outcomeVerificationModuleIds.every((id) => CLOSED_IDENTIFIER.test(id ?? ""))) {
    return fail("STAGE_RUNTIME_VERIFICATION_BINDING_INVALID");
  }
  const verificationIds = new Set(outcomeVerificationModuleIds);
  for (const definition of definitions) {
    const moduleBinding = moduleById.get(definition.moduleId);
    if (!moduleBinding || !moduleBinding.argumentSetIds.includes(definition.argumentSetId)
      || !verificationIds.has(definition.moduleId)) return fail("STAGE_RUNTIME_DEFINITION_MODULE_MISMATCH");
  }
  for (const stage of registry.stageApprovals) {
    const definition = definitionsByStage.get(stage.stageId);
    const moduleBinding = definition ? moduleById.get(definition.moduleId) : null;
    if (!definition
      || definition.taskId !== stage.taskId
      || definition.scopeClass !== stage.scopeClass
      || definition.actionClass !== stage.actionClass
      || definition.idempotencyKey !== stage.idempotencyKey
      || (definition.predecessor?.receiptDigest?.slice("sha256:".length) ?? null) !== stage.predecessorReceiptSha256
      || stageBindingDigest(definition) !== stage.stageDefinitionSha256
      || definition.moduleId !== stage.moduleId
      || moduleBinding?.moduleSha256 !== stage.moduleSha256
      || !verificationIds.has(stage.moduleId)) return fail("STAGE_RUNTIME_APPROVAL_ORPHANED");
  }
  const approvalsByTask = new Map();
  for (const stage of registry.stageApprovals) {
    const taskStages = approvalsByTask.get(stage.taskId) ?? [];
    taskStages.push(stage);
    approvalsByTask.set(stage.taskId, taskStages);
  }
  for (const taskStages of approvalsByTask.values()) {
    const ordered = [...taskStages].sort((left, right) => left.sequence - right.sequence);
    for (const [index, stage] of ordered.entries()) {
      const definition = definitionsByStage.get(stage.stageId);
      const predecessor = definition?.predecessor ?? null;
      if (index === 0) {
        if (predecessor !== null || stage.predecessorReceiptSha256 !== null) {
          return fail("STAGE_RUNTIME_PREDECESSOR_CHAIN_INVALID");
        }
        continue;
      }
      const previous = ordered[index - 1];
      if (predecessor?.stageId !== previous.stageId
        || predecessor?.receiptDigest?.slice("sha256:".length) !== stage.predecessorReceiptSha256) {
        return fail("STAGE_RUNTIME_PREDECESSOR_CHAIN_INVALID");
      }
    }
  }
  return pass("STAGE_RUNTIME_LIFECYCLE_VALID", {
    preparationReviewCount: registry.preparationReviews.length,
    definitionCount: definitions.length,
    stageApprovalCount: registry.stageApprovals.length,
    executableStageCount: registry.stageApprovals.length,
  });
}

// Stage 0 deliberately ships no executable production module or argument set.
// Reviewed task-specific stages must be added later through an immutable Gate B candidate.
export const PRODUCTION_STAGED_ACTIONS = Object.freeze([]);

export function resolveProductionStagedAction({ taskId, stageId, idempotencyKey } = {}) {
  const matches = PRODUCTION_STAGED_ACTIONS.filter((definition) => definition.taskId === taskId
    && definition.stageId === stageId
    && definition.idempotencyKey === idempotencyKey);
  return matches.length === 1 ? matches[0] : null;
}
