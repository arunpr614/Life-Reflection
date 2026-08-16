import assert from "node:assert/strict";
import {
  CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION,
  CONTROL_REVIEW_EXPECTED_COUNTS,
  CONTROL_REVIEW_MUTABLE_SNAPSHOT_PATHS,
  CONTROL_REVIEW_PERMITTED_CLAIM,
  CONTROL_REVIEW_STABLE_IMPLEMENTATION_PATHS,
  computeControlReviewContextSha256,
  computeControlReviewSeatAttestationDigest,
  controlReviewEvidenceFindings,
  controlReviewStableTaskFiles,
  validateControlReviewHistorySequence,
  validateControlReviewRegistryContinuity,
} from "./P0-control-review-trust.mjs";

const taskId = "PC-001";
const candidateRevision = "a".repeat(40);
const currentRevision = "c".repeat(40);
const manifestSha256 = "1".repeat(64);
const workbookSha256 = "2".repeat(64);
const reviewerRegistrySha256 = "6".repeat(64);
const dossierDigest = `sha256:${"3".repeat(64)}`;
const reviewerRecords = [
  ["codex-product-manager-01", "product"],
  ["codex-ui-ux-designer-01", "design"],
  ["codex-technical-architect-01", "architecture"],
  ["codex-independent-qa-01", "qa"],
  ["codex-project-manager-01", "project"],
  ["codex-primary-integrator-01", "implementation"],
  ["codex-evidence-producer-01", "evidence-producer"],
].map(([reviewerId, role]) => ({ reviewerId, role, active: true }));

function registry(controlReview = null, taskApproval = null) {
  return {
    controlReviews: controlReview === null ? {} : { [taskId]: controlReview },
    taskApprovals: taskApproval === null ? {} : { [taskId]: taskApproval },
  };
}

function candidateFacts() {
  return {
    candidateManifestSha256: manifestSha256,
    publicationManifestSha256: manifestSha256,
    headManifestSha256: manifestSha256,
    worktreeManifestSha256: manifestSha256,
    candidateReviewerRegistrySha256: reviewerRegistrySha256,
    publicationReviewerRegistrySha256: reviewerRegistrySha256,
    headReviewerRegistrySha256: reviewerRegistrySha256,
    worktreeReviewerRegistrySha256: reviewerRegistrySha256,
    candidateEvidenceWorkbookCount: 1,
    candidateEvidenceWorkbookPurpose: "evidence",
    candidateEvidenceWorkbookSha256: workbookSha256,
    candidateCanonicalWorkbookSha256: workbookSha256,
    publicationEvidenceWorkbookSha256: workbookSha256,
    publicationCanonicalWorkbookSha256: workbookSha256,
    headEvidenceWorkbookSha256: workbookSha256,
    headCanonicalWorkbookSha256: workbookSha256,
    worktreeEvidenceWorkbookSha256: workbookSha256,
    worktreeCanonicalWorkbookSha256: workbookSha256,
    publicationTaskFilesSha256: "5".repeat(64),
    candidateStableTaskFilesSha256: "7".repeat(64),
    headStableTaskFilesSha256: "7".repeat(64),
    worktreeStableTaskFilesSha256: "7".repeat(64),
    publicationDescendantDeltaPaths: ["docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json"],
    publicationForbiddenDeltaPathCount: 0,
    headDescendantDeltaPaths: ["docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json"],
    headForbiddenDeltaPathCount: 0,
  };
}

function completeReview() {
  const review = {
    reviewId: "P0-PC-001-GATE-B-CONTROL-REVIEW",
    taskId,
    reviewType: "non-authorizing-control-implementation",
    reviewDate: "2026-08-15",
    requestedScopeClass: "local-synthetic",
    requestedActionClass: "readiness-control-hardening",
    candidate: {
      baseRevision: CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION,
      revision: candidateRevision,
      dossierDigest,
      taskContractSha256: "4".repeat(64),
      artifacts: {},
      taskFiles: [...CONTROL_REVIEW_STABLE_IMPLEMENTATION_PATHS, ...CONTROL_REVIEW_MUTABLE_SNAPSHOT_PATHS]
        .map((filePath) => ({ path: filePath, purpose: "implementation" })),
      taskFilesSha256: "5".repeat(64),
      implementerIds: ["codex-primary-integrator-01"],
      evidenceProducerIds: ["codex-evidence-producer-01"],
    },
    verification: {
      nodeVersion: "v22.22.3",
      gitVersion: "git version 2.50.1",
      ...CONTROL_REVIEW_EXPECTED_COUNTS,
      validatorPassed: true,
      generatorChangedPaths: 0,
      dryRunDeterministic: true,
      workbookSha256,
      manifestSha256,
      reviewerRegistrySha256,
      workbookDisposition: "go-artifact-only",
      authenticMediaAccessed: false,
      privateNetworkAccessed: false,
      deploymentState: "Unknown — private read authority pending",
    },
    reviewContextSha256: null,
    seatAttestations: {},
    unresolvedVetoes: [],
    disposition: "accepted-local-public-control-implementation",
    executionAllowed: false,
    permittedClaim: CONTROL_REVIEW_PERMITTED_CLAIM,
  };
  review.reviewContextSha256 = computeControlReviewContextSha256(review);
  for (const [reviewerId, seat] of reviewerRecords.slice(0, 5).map(({ reviewerId, role }) => [reviewerId, role])) {
    const attestation = {
      reviewerId,
      reviewerRole: seat,
      verdict: "approve-implementation-candidate",
      reviewedRevision: candidateRevision,
      dossierDigest,
      reviewContextSha256: review.reviewContextSha256,
      evidenceReference: `review:${seat}-gate-b`,
      rationale: `The ${seat} seat independently reviewed the exact fictional candidate and bounded evidence context.`,
      attestationDigest: null,
    };
    attestation.attestationDigest = computeControlReviewSeatAttestationDigest({ taskId, seat, attestation });
    review.seatAttestations[seat] = attestation;
  }
  return review;
}

let assertions = 0;
function expect(condition, message) {
  assert.equal(condition, true, message);
  assertions += 1;
}

function expectFinding(mutator, code) {
  const review = completeReview();
  const facts = candidateFacts();
  mutator(review, facts);
  const findings = controlReviewEvidenceFindings({ taskId, review, reviewerRecords, candidateFacts: facts });
  expect(findings.includes(code), `Expected ${code}; got ${findings.join(", ")}`);
}

function history(overrides = {}) {
  const review = completeReview();
  return validateControlReviewHistorySequence({
    taskId,
    candidateRevision,
    currentRevision,
    currentRecord: review,
    candidateRegistry: registry(),
    historyEntries: [
      { revision: "b".repeat(40), registry: registry() },
      { revision: currentRevision, registry: registry(review) },
    ],
    candidateAncestorOfCurrent: true,
    ...overrides,
  });
}

function continuity(overrides = {}) {
  const review = completeReview();
  return validateControlReviewRegistryContinuity({
    taskId,
    currentRegistry: registry(review),
    historyEntries: [
      { revision: CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION, registry: { taskApprovals: {} } },
      { revision: "b".repeat(40), registry: registry() },
      { revision: currentRevision, registry: registry(review) },
    ],
    ...overrides,
  });
}

const validReview = completeReview();
expect(controlReviewEvidenceFindings({ taskId, review: validReview, reviewerRecords, candidateFacts: candidateFacts() }).length === 0,
  "Complete fictional control review should pass shared evidence checks");
expect(history().ok === true, "Candidate-absent then immutable later publication should pass");
expect(continuity().ok === true, "Repository-wide first publication and current record should pass");
expect(validateControlReviewRegistryContinuity({
  taskId,
  currentRegistry: registry(),
  historyEntries: [{ revision: CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION, registry: { taskApprovals: {} } }],
}).ok === true, "Pre-publication empty control-review history should pass");

expect(history({ candidateAncestorOfCurrent: false }).code === "CONTROL_REVIEW_CANDIDATE_NOT_ANCESTOR",
  "Unrelated candidate ancestry must fail");
expect(history({ candidateRegistry: registry(completeReview()) }).code === "CONTROL_REVIEW_PRESENT_AT_CANDIDATE",
  "Candidate self-reference must fail");
expect(history({ candidateRegistry: registry(null, { approvalRecord: {} }) }).code === "CONTROL_REVIEW_TASK_APPROVAL_CONTAMINATION",
  "Candidate taskApproval contamination must fail");
expect(history({ candidateRegistry: { controlReviews: {}, taskApprovals: { [taskId]: null } } }).code
  === "CONTROL_REVIEW_TASK_APPROVAL_CONTAMINATION", "A null-valued taskApproval key is still contamination");
expect(history({ historyEntries: [{ revision: currentRevision, registry: registry(completeReview(), { approvalRecord: {} }) }] }).code
  === "CONTROL_REVIEW_TASK_APPROVAL_CONTAMINATION", "Published taskApproval contamination must fail");
expect(history({ historyEntries: [{ revision: currentRevision, registry: registry() }] }).code === "CONTROL_REVIEW_PUBLICATION_MISSING",
  "Missing later publication must fail");
const differentReview = completeReview();
differentReview.reviewDate = "2026-08-16";
differentReview.reviewContextSha256 = computeControlReviewContextSha256(differentReview);
expect(history({ historyEntries: [
  { revision: "b".repeat(40), registry: registry(differentReview) },
  { revision: currentRevision, registry: registry(completeReview()) },
] }).code === "CONTROL_REVIEW_HISTORY_REWRITE", "First-publication rewrite must fail");
expect(history({ historyEntries: [
  { revision: "b".repeat(40), registry: registry(completeReview()) },
  { revision: currentRevision, registry: registry() },
] }).code === "CONTROL_REVIEW_HISTORY_REWRITE", "Deletion after publication must fail");
expect(history({ isAncestor: () => false }).code === "CONTROL_REVIEW_PUBLICATION_NOT_ANCESTOR",
  "Publication outside committed HEAD ancestry must fail");
const parallelRevision = "d".repeat(40);
expect(history({
  historyEntries: [
    { revision: "b".repeat(40), registry: registry(completeReview()) },
    { revision: parallelRevision, registry: registry() },
    { revision: currentRevision, registry: registry(completeReview()) },
  ],
  isAncestor: (_ancestor, descendant) => descendant !== parallelRevision,
}).ok === true, "A parallel pre-publication line without a record must not look like a later deletion");
expect(continuity({ currentRegistry: registry() }).code === "CONTROL_REVIEW_HISTORY_REWRITE",
  "Current deletion must fail even when the current controlReviews section is empty");
expect(continuity({ currentRegistry: registry(null, { approvalRecord: {} }) }).code
  === "CONTROL_REVIEW_TASK_APPROVAL_CONTAMINATION",
"PC-001 must remain absent from current taskApprovals even without relying on the per-record loop");
expect(continuity({ historyEntries: [
  { revision: CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION, registry: { taskApprovals: {} } },
  { revision: "b".repeat(40), registry: registry(null, { approvalRecord: {} }) },
  { revision: currentRevision, registry: registry() },
] }).code === "CONTROL_REVIEW_TASK_APPROVAL_CONTAMINATION",
"Transient historical PC-001 taskApproval contamination must fail");

expectFinding((review) => {
  review.candidate.baseRevision = "0".repeat(40);
  review.reviewContextSha256 = computeControlReviewContextSha256(review);
}, "CONTROL_REVIEW_GATE_A_BASE_INVALID");
expectFinding((review) => { review.verification.manifestSha256 = "9".repeat(64); }, "CONTROL_REVIEW_CONTEXT_DIGEST_INVALID");
expectFinding((review) => {
  review.verification.manifestSha256 = "9".repeat(64);
  review.reviewContextSha256 = computeControlReviewContextSha256(review);
}, "CONTROL_REVIEW_MANIFEST_BINDING_INVALID");
expectFinding((_review, facts) => { facts.publicationReviewerRegistrySha256 = "9".repeat(64); },
  "CONTROL_REVIEW_REVIEWER_REGISTRY_BINDING_INVALID");
expectFinding((_review, facts) => { facts.publicationCanonicalWorkbookSha256 = "9".repeat(64); }, "CONTROL_REVIEW_WORKBOOK_BINDING_INVALID");
expectFinding((_review, facts) => { facts.publicationTaskFilesSha256 = "9".repeat(64); },
  "CONTROL_REVIEW_PUBLICATION_TASK_FILES_BINDING_INVALID");
expectFinding((review) => {
  review.candidate.taskFiles.push({ path: "src/P0-unreviewed-control.mjs", purpose: "implementation" });
  review.reviewContextSha256 = computeControlReviewContextSha256(review);
}, "CONTROL_REVIEW_TASK_FILE_PARTITION_INVALID");
expectFinding((_review, facts) => { facts.candidateStableTaskFilesSha256 = "invalid"; },
  "CONTROL_REVIEW_CANDIDATE_CONTROL_FILES_BINDING_INVALID");
const descendantControlDriftFacts = candidateFacts();
descendantControlDriftFacts.headStableTaskFilesSha256 = "9".repeat(64);
descendantControlDriftFacts.worktreeStableTaskFilesSha256 = "8".repeat(64);
expect(controlReviewEvidenceFindings({
  taskId,
  review: completeReview(),
  reviewerRecords,
  candidateFacts: descendantControlDriftFacts,
}).length === 0,
"Later successor-reviewed control changes must not rewrite or invalidate the historical PC-001 review");
expectFinding((_review, facts) => { facts.publicationDescendantDeltaPaths.push("tools/unreviewed-change.mjs"); },
  "CONTROL_REVIEW_PUBLICATION_DELTA_INVALID");
const laterUnrelatedFacts = candidateFacts();
for (const field of [
  "headManifestSha256", "worktreeManifestSha256", "headReviewerRegistrySha256", "worktreeReviewerRegistrySha256",
  "headEvidenceWorkbookSha256", "headCanonicalWorkbookSha256", "worktreeEvidenceWorkbookSha256",
  "worktreeCanonicalWorkbookSha256",
]) laterUnrelatedFacts[field] = "9".repeat(64);
laterUnrelatedFacts.headDescendantDeltaPaths = ["docs/project/P0-later-r0-projection.json"];
laterUnrelatedFacts.headForbiddenDeltaPathCount = 1;
const stableControlFiles = controlReviewStableTaskFiles([
  { path: "tools/P0-readiness-gates.mjs", purpose: "implementation" },
  { path: "docs/INDEX.md", purpose: "implementation" },
  { path: "docs/project/PROJECT-TRACKER.md", purpose: "implementation" },
  { path: "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json", purpose: "implementation" },
  { path: "outputs/P0-reviewed-evidence.xlsx", purpose: "evidence" },
  { path: "docs/project/P0-later-r0-projection.json", purpose: "evidence" },
]);
expect(controlReviewEvidenceFindings({
  taskId,
  review: completeReview(),
  reviewerRecords,
  candidateFacts: laterUnrelatedFacts,
}).length === 0 && stableControlFiles.length === 1
  && stableControlFiles[0].path === "tools/P0-readiness-gates.mjs",
"Later unrelated R0 manifest/workbook/identity/evidence/Markdown tracker drift must not rewrite the historical review");
expectFinding((review) => {
  review.verification.readinessAssertions += 1;
  review.reviewContextSha256 = computeControlReviewContextSha256(review);
}, "CONTROL_REVIEW_READINESSASSERTIONS_INVALID");
expectFinding((review) => {
  review.candidate.implementerIds = ["codex-product-manager-01"];
  review.reviewContextSha256 = computeControlReviewContextSha256(review);
}, "CONTROL_REVIEW_IMPLEMENTER_ROLE_INVALID");
expectFinding((review) => {
  review.candidate.evidenceProducerIds = ["codex-primary-integrator-01"];
  review.reviewContextSha256 = computeControlReviewContextSha256(review);
}, "CONTROL_REVIEW_EVIDENCE_PRODUCER_ROLE_INVALID");
expectFinding((review) => { review.permittedClaim = `${CONTROL_REVIEW_PERMITTED_CLAIM} Deployment approved.`; },
  "CONTROL_REVIEW_PERMITTED_CLAIM_INVALID");
expectFinding((review) => { review.seatAttestations.qa.reviewContextSha256 = "8".repeat(64); },
  "CONTROL_REVIEW_QA_CONTEXT_INVALID");
expectFinding((review) => { review.seatAttestations.qa.attestationDigest = "7".repeat(64); },
  "CONTROL_REVIEW_QA_ATTESTATION_INVALID");
expectFinding((review) => {
  review.candidate.implementerIds.push(review.seatAttestations.qa.reviewerId);
  review.reviewContextSha256 = computeControlReviewContextSha256(review);
}, "CONTROL_REVIEW_QA_INDEPENDENCE_INVALID");

console.log(JSON.stringify({
  suite: "PC-001 audit-only control-review trust",
  fixtureClass: "fictional/synthetic only",
  assertions,
  failed: 0,
}, null, 2));
