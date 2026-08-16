import crypto from "node:crypto";
import {
  APPROVAL_REGISTRY_PATH,
  COUNCIL_SEATS,
  canonicalJson,
  computeTaskFilesSha256,
} from "./P0-readiness-gates.mjs";

export const CONTROL_REVIEW_TASK_ID = "PC-001";

export const CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION = "2fc31ec905f4c664b86bebdc511a87390a24a4e9";

export const CONTROL_REVIEW_PUBLICATION_DELTA_PATHS = Object.freeze([
  APPROVAL_REGISTRY_PATH,
]);

export const CONTROL_REVIEW_MUTABLE_SNAPSHOT_PATHS = Object.freeze([
  "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json",
  "docs/council/execution/P0-OWNER-ACTION-STATE.json",
  "docs/project/P0-PHASE1-TASK-READINESS-STATE.json",
  "docs/project/P0-PHASE1-TASK-STATE.json",
  "AGENTS.md",
  "README.md",
  "docs/INDEX.md",
  "docs/council/execution/P0-PHASE1-EXECUTION-DECISIONS.md",
  "docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md",
  "docs/project/AI-AGENT-RESOURCE-INDEX-2026-08-14-15-10-39-IST.md",
  "docs/project/CODEX-GOAL-PROMPT-P0-TO-PRODUCTION.md",
  "docs/project/PHASE1-GITHUB-PROJECT-SYNC.md",
  "docs/project/PROJECT-TRACKER.md",
]);

export const CONTROL_REVIEW_STABLE_IMPLEMENTATION_PATHS = Object.freeze([
  ".github/workflows/prototype-syntax.yml",
  "tools/P0-build-task-readiness-input.mjs",
  "tools/P0-control-review-trust.mjs",
  "tools/P0-generate-task-artifacts.mjs",
  "tools/P0-json-trust.mjs",
  "tools/P0-readiness-gates.mjs",
  "tools/P0-test-control-review-trust.mjs",
  "tools/P0-test-execution-controls.mjs",
  "tools/P0-validate-execution-controls.mjs",
  "tools/P0-verify-execution-start.mjs",
  "tools/P0-verify-generated-tracking.mjs",
  "tools/build_phase1_release_plan.mjs",
  "tools/generate_phase1_roadmap_manifest.mjs",
  "tools/sync_phase1_github.mjs",
]);

export function controlReviewImplementationPartition(taskFiles) {
  const implementationEntries = Array.isArray(taskFiles)
    ? taskFiles.filter((entry) => entry?.purpose === "implementation")
    : [];
  const implementationPaths = implementationEntries.map((entry) => entry?.path);
  const stablePaths = new Set(CONTROL_REVIEW_STABLE_IMPLEMENTATION_PATHS);
  const mutablePaths = new Set(CONTROL_REVIEW_MUTABLE_SNAPSHOT_PATHS);
  const actualPaths = new Set(implementationPaths);
  const expectedPaths = new Set([...stablePaths, ...mutablePaths]);
  const valid = Array.isArray(taskFiles)
    && implementationPaths.length === actualPaths.size
    && actualPaths.size === expectedPaths.size
    && [...actualPaths].every((entry) => expectedPaths.has(entry));
  return {
    valid,
    stableTaskFiles: implementationEntries.filter((entry) => stablePaths.has(entry?.path)),
    mutableSnapshotTaskFiles: implementationEntries.filter((entry) => mutablePaths.has(entry?.path)),
    unknownImplementationPaths: implementationPaths.filter((entry) => !expectedPaths.has(entry)),
    missingStablePaths: [...stablePaths].filter((entry) => !actualPaths.has(entry)),
    missingMutableSnapshotPaths: [...mutablePaths].filter((entry) => !actualPaths.has(entry)),
  };
}

export function controlReviewStableTaskFiles(taskFiles) {
  return controlReviewImplementationPartition(taskFiles).stableTaskFiles;
}

export function computeControlReviewStableTaskFilesSha256(taskFiles) {
  return computeTaskFilesSha256(controlReviewStableTaskFiles(taskFiles));
}

export const CONTROL_REVIEW_PERMITTED_CLAIM = "Accepted only for normal merge and local/public control reconciliation; this record authorizes no task execution, R0 work, private access, authentic content, deployment, release, or production use.";

export const CONTROL_REVIEW_EXPECTED_COUNTS = Object.freeze({
  readinessAssertions: 341,
  startVerifierCases: 62,
  syncSelfTestCases: 48,
  controlReviewTrustAssertions: 35,
  generatedPathCount: 352,
});

export const CONTROL_REVIEW_RECORD_KEYS = Object.freeze([
  "reviewId",
  "taskId",
  "reviewType",
  "reviewDate",
  "requestedScopeClass",
  "requestedActionClass",
  "candidate",
  "verification",
  "reviewContextSha256",
  "seatAttestations",
  "unresolvedVetoes",
  "disposition",
  "executionAllowed",
  "permittedClaim",
]);

export const CONTROL_REVIEW_SEAT_KEYS = Object.freeze([
  "reviewerId",
  "reviewerRole",
  "verdict",
  "reviewedRevision",
  "dossierDigest",
  "reviewContextSha256",
  "evidenceReference",
  "rationale",
  "attestationDigest",
]);

const SHA256 = /^[0-9a-f]{64}$/;
const ABSENT_TASK_RECORD = Symbol("absent-task-record");
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

function sameSet(left, right) {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

export function hasExactControlReviewKeys(value, expected) {
  return isObject(value) && sameSet(new Set(Object.keys(value)), new Set(expected));
}

/**
 * Canonical non-seat review context. The digest field and seat records are
 * deliberately excluded, which keeps this payload acyclic while binding every
 * decision, candidate, verification, limitation, and permission field.
 */
export function controlReviewContextPayload(review) {
  return {
    reviewId: review?.reviewId ?? null,
    taskId: review?.taskId ?? null,
    reviewType: review?.reviewType ?? null,
    reviewDate: review?.reviewDate ?? null,
    requestedScopeClass: review?.requestedScopeClass ?? null,
    requestedActionClass: review?.requestedActionClass ?? null,
    candidate: review?.candidate ?? null,
    verification: review?.verification ?? null,
    unresolvedVetoes: review?.unresolvedVetoes ?? null,
    disposition: review?.disposition ?? null,
    executionAllowed: review?.executionAllowed ?? null,
    permittedClaim: review?.permittedClaim ?? null,
  };
}

export function computeControlReviewContextSha256(review) {
  return sha256(canonicalJson(controlReviewContextPayload(review)));
}

export function controlReviewSeatAttestationPayload({ taskId, seat, attestation }) {
  return {
    taskId,
    seat,
    reviewerId: attestation?.reviewerId ?? null,
    reviewerRole: attestation?.reviewerRole ?? null,
    verdict: attestation?.verdict ?? null,
    reviewedRevision: attestation?.reviewedRevision ?? null,
    dossierDigest: attestation?.dossierDigest ?? null,
    reviewContextSha256: attestation?.reviewContextSha256 ?? null,
    evidenceReference: attestation?.evidenceReference ?? null,
    rationale: attestation?.rationale ?? null,
  };
}

export function computeControlReviewSeatAttestationDigest(input) {
  return sha256(canonicalJson(controlReviewSeatAttestationPayload(input)));
}

function registryTaskRecord(registry, section, taskId) {
  if (!isObject(registry) || !isObject(registry[section])) return undefined;
  return hasOwn(registry[section], taskId) ? registry[section][taskId] : ABSENT_TASK_RECORD;
}

function historicalControlReviewRecord(registry, taskId) {
  if (!isObject(registry)) return undefined;
  if (registry.controlReviews === undefined) return ABSENT_TASK_RECORD;
  if (!isObject(registry.controlReviews)) return undefined;
  return hasOwn(registry.controlReviews, taskId) ? registry.controlReviews[taskId] : ABSENT_TASK_RECORD;
}

/**
 * Repository-wide continuity proof. This runs even when the current registry
 * has no control-review record, so a deletion cannot bypass the per-record
 * validator loop. Historical schema 1.0 registries predate controlReviews and
 * are therefore treated as an empty section; taskApprovals must always exist.
 */
export function validateControlReviewRegistryContinuity({
  taskId,
  currentRegistry,
  historyEntries,
  isAncestor = () => true,
}) {
  const fail = (code) => ({ ok: false, code, publicationRevision: null });
  if (taskId !== CONTROL_REVIEW_TASK_ID || !isObject(currentRegistry)
    || !isObject(currentRegistry.controlReviews) || !isObject(currentRegistry.taskApprovals)
    || !Array.isArray(historyEntries) || historyEntries.length === 0
    || typeof isAncestor !== "function") {
    return fail("CONTROL_REVIEW_CONTINUITY_INPUT_INVALID");
  }
  if (hasOwn(currentRegistry.taskApprovals, taskId)) {
    return fail("CONTROL_REVIEW_TASK_APPROVAL_CONTAMINATION");
  }

  let publicationRevision = null;
  let publishedCanonical = null;
  for (const entry of historyEntries) {
    if (!isObject(entry) || typeof entry.revision !== "string" || !isObject(entry.registry)
      || !isObject(entry.registry.taskApprovals)) {
      return fail("CONTROL_REVIEW_CONTINUITY_HISTORY_INVALID");
    }
    if (hasOwn(entry.registry.taskApprovals, taskId)) {
      return fail("CONTROL_REVIEW_TASK_APPROVAL_CONTAMINATION");
    }
    const historicalReview = historicalControlReviewRecord(entry.registry, taskId);
    if (historicalReview === undefined) {
      return fail("CONTROL_REVIEW_CONTINUITY_HISTORY_INVALID");
    }
    if (publicationRevision === null) {
      if (historicalReview === ABSENT_TASK_RECORD) continue;
      if (!isObject(historicalReview)) return fail("CONTROL_REVIEW_HISTORY_REGISTRY_INVALID");
      publicationRevision = entry.revision;
      publishedCanonical = canonicalJson(historicalReview);
      continue;
    }
    const publicationIsAncestor = isAncestor(publicationRevision, entry.revision) === true;
    if (historicalReview !== ABSENT_TASK_RECORD
      && canonicalJson(historicalReview) !== publishedCanonical) {
      return fail("CONTROL_REVIEW_HISTORY_REWRITE");
    }
    if (publicationIsAncestor && historicalReview === ABSENT_TASK_RECORD) {
      return fail("CONTROL_REVIEW_HISTORY_REWRITE");
    }
  }

  const currentReview = registryTaskRecord(currentRegistry, "controlReviews", taskId);
  if (currentReview === undefined) return fail("CONTROL_REVIEW_CONTINUITY_INPUT_INVALID");
  if (publicationRevision !== null) {
    if (currentReview === ABSENT_TASK_RECORD) return fail("CONTROL_REVIEW_HISTORY_REWRITE");
    if (canonicalJson(currentReview) !== publishedCanonical) {
      return fail("CONTROL_REVIEW_HISTORY_REWRITE");
    }
  }
  return {
    ok: true,
    code: "CONTROL_REVIEW_CONTINUITY_OK",
    publicationRevision,
  };
}

/**
 * Pure history verifier. Callers provide the candidate registry plus the
 * candidate-exclusive, reverse-topological ancestry through committed HEAD.
 * The containing publication revision is derived and never stored in the
 * reviewed record, avoiding a commit-hash self-reference.
 */
export function validateControlReviewHistorySequence({
  taskId,
  candidateRevision,
  currentRevision,
  currentRecord,
  candidateRegistry,
  historyEntries,
  candidateAncestorOfCurrent,
  isAncestor = () => true,
}) {
  const fail = (code) => ({ ok: false, code, publicationRevision: null });
  if (taskId !== CONTROL_REVIEW_TASK_ID || !isObject(currentRecord)) {
    return fail("CONTROL_REVIEW_HISTORY_INPUT_INVALID");
  }
  if (candidateAncestorOfCurrent !== true) {
    return fail("CONTROL_REVIEW_CANDIDATE_NOT_ANCESTOR");
  }
  const candidateReview = registryTaskRecord(candidateRegistry, "controlReviews", taskId);
  const candidateApproval = registryTaskRecord(candidateRegistry, "taskApprovals", taskId);
  if (candidateReview === undefined || candidateApproval === undefined) {
    return fail("CONTROL_REVIEW_CANDIDATE_REGISTRY_INVALID");
  }
  if (candidateReview !== ABSENT_TASK_RECORD) return fail("CONTROL_REVIEW_PRESENT_AT_CANDIDATE");
  if (candidateApproval !== ABSENT_TASK_RECORD) return fail("CONTROL_REVIEW_TASK_APPROVAL_CONTAMINATION");
  if (!Array.isArray(historyEntries) || historyEntries.length === 0
    || !historyEntries.some((entry) => entry?.revision === currentRevision)
    || typeof isAncestor !== "function") {
    return fail("CONTROL_REVIEW_HISTORY_INCOMPLETE");
  }

  const currentCanonical = canonicalJson(currentRecord);
  let publicationRevision = null;
  for (const entry of historyEntries) {
    if (!isObject(entry) || typeof entry.revision !== "string") {
      return fail("CONTROL_REVIEW_HISTORY_INCOMPLETE");
    }
    const historicalReview = registryTaskRecord(entry.registry, "controlReviews", taskId);
    const historicalApproval = registryTaskRecord(entry.registry, "taskApprovals", taskId);
    if (historicalReview === undefined || historicalApproval === undefined) {
      return fail("CONTROL_REVIEW_HISTORY_REGISTRY_INVALID");
    }
    if (historicalApproval !== ABSENT_TASK_RECORD) {
      return fail("CONTROL_REVIEW_TASK_APPROVAL_CONTAMINATION");
    }
    const afterPublication = publicationRevision === null
      ? false
      : isAncestor(publicationRevision, entry.revision) === true;
    if (publicationRevision === null) {
      if (historicalReview === ABSENT_TASK_RECORD) continue;
      if (canonicalJson(historicalReview) !== currentCanonical) {
        return fail("CONTROL_REVIEW_HISTORY_REWRITE");
      }
      publicationRevision = entry.revision;
      continue;
    }
    if (historicalReview !== ABSENT_TASK_RECORD && canonicalJson(historicalReview) !== currentCanonical) {
      return fail("CONTROL_REVIEW_HISTORY_REWRITE");
    }
    if (afterPublication && (historicalReview === ABSENT_TASK_RECORD || canonicalJson(historicalReview) !== currentCanonical)) {
      return fail("CONTROL_REVIEW_HISTORY_REWRITE");
    }
  }
  if (publicationRevision === null) return fail("CONTROL_REVIEW_PUBLICATION_MISSING");
  if (isAncestor(publicationRevision, currentRevision) !== true) {
    return fail("CONTROL_REVIEW_PUBLICATION_NOT_ANCESTOR");
  }
  return { ok: true, code: "CONTROL_REVIEW_HISTORY_OK", publicationRevision };
}

/**
 * Shared static evidence checks used by the repository validator and fictional
 * negative tests. Git traversal and raw-byte collection remain adapter work.
 */
export function controlReviewEvidenceFindings({
  taskId,
  review,
  reviewerRecords,
  candidateFacts,
}) {
  const findings = [];
  const add = (condition, code) => {
    if (!condition) findings.push(code);
  };
  const candidate = review?.candidate;
  const verification = review?.verification;
  const expectedContext = computeControlReviewContextSha256(review);
  add(taskId === CONTROL_REVIEW_TASK_ID, "CONTROL_REVIEW_TASK_NOT_ALLOWLISTED");
  add(candidate?.baseRevision === CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION,
    "CONTROL_REVIEW_GATE_A_BASE_INVALID");
  add(review?.permittedClaim === CONTROL_REVIEW_PERMITTED_CLAIM, "CONTROL_REVIEW_PERMITTED_CLAIM_INVALID");
  add(SHA256.test(review?.reviewContextSha256 ?? "")
    && review.reviewContextSha256 === expectedContext, "CONTROL_REVIEW_CONTEXT_DIGEST_INVALID");

  for (const [field, expected] of Object.entries(CONTROL_REVIEW_EXPECTED_COUNTS)) {
    add(verification?.[field] === expected, `CONTROL_REVIEW_${field.toUpperCase()}_INVALID`);
  }
  add(SHA256.test(verification?.manifestSha256 ?? "")
    && verification.manifestSha256 === candidateFacts?.candidateManifestSha256
    && verification.manifestSha256 === candidateFacts?.publicationManifestSha256,
  "CONTROL_REVIEW_MANIFEST_BINDING_INVALID");
  add(SHA256.test(verification?.reviewerRegistrySha256 ?? "")
    && verification.reviewerRegistrySha256 === candidateFacts?.candidateReviewerRegistrySha256
    && verification.reviewerRegistrySha256 === candidateFacts?.publicationReviewerRegistrySha256,
  "CONTROL_REVIEW_REVIEWER_REGISTRY_BINDING_INVALID");
  add(candidateFacts?.candidateEvidenceWorkbookCount === 1
    && candidateFacts?.candidateEvidenceWorkbookPurpose === "evidence"
    && SHA256.test(verification?.workbookSha256 ?? "")
    && verification.workbookSha256 === candidateFacts?.candidateEvidenceWorkbookSha256
    && verification.workbookSha256 === candidateFacts?.candidateCanonicalWorkbookSha256
    && verification.workbookSha256 === candidateFacts?.publicationEvidenceWorkbookSha256
    && verification.workbookSha256 === candidateFacts?.publicationCanonicalWorkbookSha256,
  "CONTROL_REVIEW_WORKBOOK_BINDING_INVALID");
  add(SHA256.test(candidate?.taskFilesSha256 ?? "")
    && candidate.taskFilesSha256 === candidateFacts?.publicationTaskFilesSha256,
  "CONTROL_REVIEW_PUBLICATION_TASK_FILES_BINDING_INVALID");
  add(controlReviewImplementationPartition(candidate?.taskFiles).valid,
    "CONTROL_REVIEW_TASK_FILE_PARTITION_INVALID");
  // PC-001 remains an immutable historical exact-candidate review. Its stable
  // implementation partition is still validated at the candidate and first
  // publication, but it must not freeze current descendant control bytes.
  // Current controls are governed by add-only successor reviews instead.
  add(SHA256.test(candidateFacts?.candidateStableTaskFilesSha256 ?? ""),
    "CONTROL_REVIEW_CANDIDATE_CONTROL_FILES_BINDING_INVALID");
  const publicationDeltaValid = (paths, forbiddenCount) => Array.isArray(paths)
    && paths.length === CONTROL_REVIEW_PUBLICATION_DELTA_PATHS.length
    && new Set(paths).size === paths.length
    && paths.every((entry) => CONTROL_REVIEW_PUBLICATION_DELTA_PATHS.includes(entry))
    && forbiddenCount === 0;
  add(publicationDeltaValid(candidateFacts?.publicationDescendantDeltaPaths,
    candidateFacts?.publicationForbiddenDeltaPathCount),
  "CONTROL_REVIEW_PUBLICATION_DELTA_INVALID");

  const reviewerById = new Map((reviewerRecords ?? []).map((record) => [record?.reviewerId, record]));
  const contributorsValid = (ids, role) => Array.isArray(ids)
    && ids.length > 0
    && new Set(ids).size === ids.length
    && ids.every((id) => reviewerById.get(id)?.active === true && reviewerById.get(id)?.role === role);
  add(contributorsValid(candidate?.implementerIds, "implementation"), "CONTROL_REVIEW_IMPLEMENTER_ROLE_INVALID");
  add(contributorsValid(candidate?.evidenceProducerIds, "evidence-producer"), "CONTROL_REVIEW_EVIDENCE_PRODUCER_ROLE_INVALID");

  const seats = review?.seatAttestations;
  const seatReviewerIds = [];
  for (const seat of COUNCIL_SEATS) {
    const attestation = seats?.[seat];
    const reviewer = reviewerById.get(attestation?.reviewerId);
    seatReviewerIds.push(attestation?.reviewerId);
    add(hasExactControlReviewKeys(attestation, CONTROL_REVIEW_SEAT_KEYS), `CONTROL_REVIEW_${seat.toUpperCase()}_SCHEMA_INVALID`);
    add(reviewer?.active === true && reviewer?.role === seat && attestation?.reviewerRole === seat,
      `CONTROL_REVIEW_${seat.toUpperCase()}_ROLE_INVALID`);
    add(attestation?.reviewContextSha256 === expectedContext,
      `CONTROL_REVIEW_${seat.toUpperCase()}_CONTEXT_INVALID`);
    add(attestation?.attestationDigest === computeControlReviewSeatAttestationDigest({ taskId, seat, attestation }),
      `CONTROL_REVIEW_${seat.toUpperCase()}_ATTESTATION_INVALID`);
  }
  add(new Set(seatReviewerIds).size === COUNCIL_SEATS.length, "CONTROL_REVIEW_SEAT_UNIQUENESS_INVALID");
  add(!candidate?.implementerIds?.includes(seats?.qa?.reviewerId)
    && !candidate?.evidenceProducerIds?.includes(seats?.qa?.reviewerId), "CONTROL_REVIEW_QA_INDEPENDENCE_INVALID");
  return findings;
}
