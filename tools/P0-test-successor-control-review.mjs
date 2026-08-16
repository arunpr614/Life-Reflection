import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  SUCCESSOR_CONTROL_REVIEW_DIRECTORY,
  SUCCESSOR_CONTROL_REVIEW_GENESIS_PATH,
  SUCCESSOR_CONTROL_REVIEW_PERMITTED_CLAIM,
  SUCCESSOR_CONTROL_REVIEW_ROLES,
  computeSuccessorChangedFilesSha256,
  computeSuccessorGenesisPayloadSha256,
  computeSuccessorNamedChecksSha256,
  computeSuccessorReviewContextSha256,
  computeSuccessorReviewRecordSha256,
  computeSuccessorSeatAttestationDigest,
  deriveSuccessorChangedFiles,
  successorControlReviewFindings,
  successorGenesisFindings,
  verifySuccessorControlReviews,
} from "./P0-successor-control-review.mjs";
import { canonicalJson, sha256, verifyImmutableAddOnlyFileHistory } from "./P0-append-only-trust.mjs";

const groups = new Map();
function expect(group, condition, label) {
  assert.equal(condition, true, label);
  if (!groups.has(group)) groups.set(group, []);
  groups.get(group).push(label);
}

function git(repoRoot, args) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();
}

function commitAll(repoRoot, message) {
  git(repoRoot, ["add", "-A"]);
  git(repoRoot, ["commit", "-m", message]);
  return git(repoRoot, ["rev-parse", "HEAD"]);
}

const reviewerRecords = [
  ["codex-product-manager-01", "product"],
  ["codex-ui-ux-designer-01", "design"],
  ["codex-technical-architect-01", "architecture"],
  ["codex-independent-qa-01", "qa"],
  ["codex-project-manager-01", "project"],
  ["codex-primary-integrator-01", "implementation"],
  ["codex-evidence-producer-01", "evidence-producer"],
].map(([reviewerId, role]) => ({ reviewerId, role, identityClass: "agent", active: true }));

function createCandidateRepo() {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "p0-successor-review-"));
  git(repoRoot, ["init", "-q"]);
  git(repoRoot, ["config", "user.name", "Synthetic QA"]);
  git(repoRoot, ["config", "user.email", "synthetic@example.invalid"]);
  fs.mkdirSync(path.join(repoRoot, "docs/council/execution/releases"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "tools"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, "README.md"), "synthetic base\n");
  fs.writeFileSync(path.join(repoRoot, "tools/P0-synthetic.mjs"), "export const value = 1;\n");
  fs.writeFileSync(path.join(repoRoot, "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json"),
    `${JSON.stringify({ schemaVersion: "1.0.0", reviewers: reviewerRecords }, null, 2)}\n`);
  const baseRevision = commitAll(repoRoot, "synthetic base");
  fs.writeFileSync(path.join(repoRoot, "docs/council/execution/P0-SYNTHETIC-FREEZE.json"),
    `${JSON.stringify({ schemaVersion: "1.0.0", frozen: true }, null, 2)}\n`);
  const intermediateRevision = commitAll(repoRoot, "synthetic freeze evidence");
  const dossierPath = "docs/council/execution/releases/P0-SYNTHETIC-CANDIDATE.md";
  fs.writeFileSync(path.join(repoRoot, dossierPath), "# Synthetic candidate dossier\n");
  fs.mkdirSync(path.join(repoRoot, "docs/council/execution/control-reviews"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "tools/build"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, "P0-SYNTHETIC-ROOT.md"), "# Synthetic root candidate\n");
  fs.writeFileSync(path.join(repoRoot, "docs/council/execution/P0-SYNTHETIC-UPPER.json"), "{}\n");
  fs.writeFileSync(path.join(repoRoot,
    "docs/council/execution/control-reviews/P0-SYNTHETIC-LOWER.json"), "{}\n");
  fs.writeFileSync(path.join(repoRoot, "tools/P0-synthetic-upper.mjs"), "export const upper = true;\n");
  fs.writeFileSync(path.join(repoRoot, "tools/build/P0-synthetic-lower.mjs"), "export const lower = true;\n");
  fs.writeFileSync(path.join(repoRoot, "tools/P0-synthetic.mjs"), "export const value = 2;\n");
  const candidateRevision = commitAll(repoRoot, "synthetic candidate");
  const changedFiles = deriveSuccessorChangedFiles(repoRoot, baseRevision, candidateRevision);
  const reviewerRegistrySha256 = sha256(fs.readFileSync(
    path.join(repoRoot, "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json"),
  ));
  return {
    repoRoot,
    baseRevision,
    intermediateRevision,
    candidateRevision,
    dossierPath,
    changedFiles,
    reviewerRegistrySha256,
  };
}

function genesisFixture() {
  const historicalReview = {
    reviewId: "P0-PC-001-GATE-B-CONTROL-IMPLEMENTATION-REVIEW",
    candidate: { revision: "9".repeat(40) },
    reviewContextSha256: "8".repeat(64),
  };
  const genesis = {
    schemaVersion: "1.0.0",
    genesisId: "P0-SUCCESSOR-CONTROL-REVIEW-GENESIS",
    createdDate: "2026-08-15",
    sourceBaseRevision: "7".repeat(40),
    recordDirectory: SUCCESSOR_CONTROL_REVIEW_DIRECTORY,
    recordFilePattern: "^P0-CONTROL-REVIEW-P0-[A-Z0-9][A-Z0-9-]{5,95}\\.json$",
    historicalAnchor: {
      registryPath: "docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json",
      taskId: "PC-001",
      reviewId: historicalReview.reviewId,
      candidateRevision: historicalReview.candidate.revision,
      publicationRevision: "6".repeat(40),
      canonicalRecordSha256: sha256(canonicalJson(historicalReview)),
      reviewContextSha256: historicalReview.reviewContextSha256,
    },
    requiredCouncilRoles: [...SUCCESSOR_CONTROL_REVIEW_ROLES],
    bootstrapPendingPolicy: {
      maximumPendingCandidates: 1,
      state: "review-pending",
      mergeAuthority: "one-time-stage0-goal-only",
      runtimeAuthority: false,
      taskApprovalEffect: "none",
      permissionEffect: "none",
    },
    permittedClaim: SUCCESSOR_CONTROL_REVIEW_PERMITTED_CLAIM,
    genesisPayloadSha256: null,
  };
  genesis.genesisPayloadSha256 = computeSuccessorGenesisPayloadSha256(genesis);
  return { genesis, historicalReview };
}

function reviewFixture(candidate, genesis) {
  const reviewId = "P0-SYNTHETIC-STAGE0-REVIEW";
  const dossierEntry = candidate.changedFiles.find((entry) => entry.path === candidate.dossierPath);
  const review = {
    schemaVersion: "1.0.0",
    reviewId,
    reviewDate: "2026-08-15",
    reviewType: "non-authorizing-successor-control-review",
    predecessor: {
      kind: "genesis",
      reviewId: genesis.genesisId,
      recordPath: SUCCESSOR_CONTROL_REVIEW_GENESIS_PATH,
      recordSha256: genesis.genesisPayloadSha256,
    },
    candidate: {
      baseRevision: candidate.baseRevision,
      revision: candidate.candidateRevision,
      dossierPath: candidate.dossierPath,
      dossierSha256: dossierEntry.candidate.sha256,
      reviewerRegistryPath: "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json",
      reviewerRegistrySha256: candidate.reviewerRegistrySha256,
      changedFiles: structuredClone(candidate.changedFiles),
      changedFilesSha256: computeSuccessorChangedFilesSha256(candidate.changedFiles),
      implementerIds: ["codex-primary-integrator-01"],
      evidenceProducerIds: ["codex-evidence-producer-01"],
    },
    namedChecks: [
      ["P0-CHECK-ADVERSARIAL", "a"],
      ["P0-CHECK-CI", "b"],
      ["P0-CHECK-INDEPENDENT-QA", "c"],
    ].map(([checkId, value]) => ({
      checkId,
      result: "pass",
      evidenceDigest: `sha256:${value.repeat(64)}`,
      evidenceReference: `local-evidence:${checkId.toLowerCase()}`,
    })),
    namedChecksSha256: null,
    reviewContextSha256: null,
    seatAttestations: {},
    unresolvedVetoes: [],
    disposition: "accepted-normal-merge-only",
    taskApprovalCreated: false,
    runtimeAuthority: false,
    executionAllowed: false,
    privateActionAllowed: false,
    statusTransitionAllowed: false,
    r1R10Effect: "none",
    permittedClaim: SUCCESSOR_CONTROL_REVIEW_PERMITTED_CLAIM,
  };
  review.namedChecksSha256 = computeSuccessorNamedChecksSha256(review.namedChecks);
  resign(review);
  return review;
}

function resign(review) {
  review.reviewContextSha256 = computeSuccessorReviewContextSha256(review);
  const reviewerByRole = new Map(reviewerRecords.map((entry) => [entry.role, entry]));
  for (const seat of SUCCESSOR_CONTROL_REVIEW_ROLES) {
    const existing = review.seatAttestations[seat] ?? {};
    const attestation = {
      reviewerId: existing.reviewerId ?? reviewerByRole.get(seat).reviewerId,
      reviewerRole: existing.reviewerRole ?? seat,
      verdict: existing.verdict ?? "approve-normal-merge-only",
      reviewedRevision: existing.reviewedRevision ?? review.candidate.revision,
      reviewContextSha256: review.reviewContextSha256,
      evidenceDigest: existing.evidenceDigest ?? `sha256:${sha256(seat)}`,
      evidenceReference: existing.evidenceReference ?? `review:synthetic-${seat}`,
      rationale: existing.rationale ?? `The ${seat} seat independently approves only normal publication of this exact fictional control candidate.`,
      attestationDigest: null,
    };
    attestation.attestationDigest = computeSuccessorSeatAttestationDigest({ reviewId: review.reviewId, seat, attestation });
    review.seatAttestations[seat] = attestation;
  }
}

function findingsFor(review, candidate, genesis) {
  return successorControlReviewFindings({
    review,
    filePath: `${SUCCESSOR_CONTROL_REVIEW_DIRECTORY}/P0-CONTROL-REVIEW-${review.reviewId}.json`,
    genesis,
    reviewerRecords,
    derivedChangedFiles: candidate.changedFiles,
    derivedReviewerRegistrySha256: candidate.reviewerRegistrySha256,
  });
}

function expectFinding(group, mutator, code) {
  const candidate = createCandidateRepo();
  const { genesis } = genesisFixture();
  const review = reviewFixture(candidate, genesis);
  mutator(review, candidate);
  expect(group, findingsFor(review, candidate, genesis).includes(code), `expected ${code}`);
}

{
  const { genesis, historicalReview } = genesisFixture();
  expect("genesis", successorGenesisFindings(genesis, historicalReview).length === 0, "valid genesis passes");
  const mutable = structuredClone(genesis);
  mutable.bootstrapPendingPolicy.runtimeAuthority = true;
  mutable.genesisPayloadSha256 = computeSuccessorGenesisPayloadSha256(mutable);
  expect("genesis", successorGenesisFindings(mutable, historicalReview)
    .includes("SUCCESSOR_GENESIS_PENDING_POLICY_INVALID"), "pending candidate cannot gain runtime authority");
  const wrongAnchor = structuredClone(genesis);
  wrongAnchor.historicalAnchor.canonicalRecordSha256 = "0".repeat(64);
  wrongAnchor.genesisPayloadSha256 = computeSuccessorGenesisPayloadSha256(wrongAnchor);
  expect("genesis", successorGenesisFindings(wrongAnchor, historicalReview)
    .includes("SUCCESSOR_GENESIS_HISTORICAL_REVIEW_INVALID"), "historical PC digest drift fails");
}

{
  const candidate = createCandidateRepo();
  const { genesis } = genesisFixture();
  const review = reviewFixture(candidate, genesis);
  expect("record", findingsFor(review, candidate, genesis).length === 0, "complete successor review passes");
  expect("binding", review.candidate.baseRevision === candidate.baseRevision
    && review.candidate.changedFiles.some((entry) => entry.path === "docs/council/execution/P0-SYNTHETIC-FREEZE.json"),
  "multi-commit candidate binds the complete activation-base range");
  const changedPaths = candidate.changedFiles.map((entry) => entry.path);
  const codePointSortedPaths = [...changedPaths].sort();
  expect("ordering", canonicalJson(changedPaths) === canonicalJson(codePointSortedPaths),
    "mixed uppercase/lowercase path prefixes derive in deterministic code-point order");
  expect("ordering", changedPaths.indexOf("docs/council/execution/P0-SYNTHETIC-UPPER.json")
    < changedPaths.indexOf("docs/council/execution/control-reviews/P0-SYNTHETIC-LOWER.json")
    && changedPaths.indexOf("tools/P0-synthetic-upper.mjs")
      < changedPaths.indexOf("tools/build/P0-synthetic-lower.mjs"),
  "code-point order keeps uppercase path components before lowercase path components");

  const parentOnlyFiles = deriveSuccessorChangedFiles(
    candidate.repoRoot, candidate.intermediateRevision, candidate.candidateRevision,
  );
  const parentOnlyReview = reviewFixture(candidate, genesis);
  parentOnlyReview.candidate.changedFiles = parentOnlyFiles;
  parentOnlyReview.candidate.changedFilesSha256 = computeSuccessorChangedFilesSha256(parentOnlyFiles);
  resign(parentOnlyReview);
  expect("binding", findingsFor(parentOnlyReview, candidate, genesis)
    .includes("SUCCESSOR_CHANGED_FILES_BINDING_INVALID"),
  "parent-only changed-file manifest cannot omit earlier Stage 0 commits");

  const reviewPath = `${SUCCESSOR_CONTROL_REVIEW_DIRECTORY}/P0-CONTROL-REVIEW-${review.reviewId}.json`;
  fs.mkdirSync(path.join(candidate.repoRoot, SUCCESSOR_CONTROL_REVIEW_DIRECTORY), { recursive: true });
  const raw = `${JSON.stringify(review, null, 2)}\n`;
  fs.writeFileSync(path.join(candidate.repoRoot, reviewPath), raw);
  const publicationRevision = commitAll(candidate.repoRoot, "publish add-only review");
  const history = verifyImmutableAddOnlyFileHistory({
    repoRoot: candidate.repoRoot,
    filePath: reviewPath,
    absentRevision: candidate.candidateRevision,
    currentRevision: publicationRevision,
    expectedSha256: sha256(Buffer.from(raw)),
  });
  expect("history", history.ok && history.publicationRevision === publicationRevision,
    "record absent at candidate and introduced once later passes");
}

expectFinding("binding", (review) => {
  review.candidate.changedFiles[0].candidate.sha256 = "0".repeat(64);
  review.candidate.changedFilesSha256 = computeSuccessorChangedFilesSha256(review.candidate.changedFiles);
  resign(review);
}, "SUCCESSOR_CHANGED_FILES_BINDING_INVALID");
expectFinding("binding", (review) => {
  review.candidate.dossierSha256 = "0".repeat(64);
  resign(review);
}, "SUCCESSOR_DOSSIER_BINDING_INVALID");
expectFinding("binding", (review) => {
  review.candidate.reviewerRegistrySha256 = "0".repeat(64);
  resign(review);
}, "SUCCESSOR_CANDIDATE_REVIEWER_REGISTRY_BINDING_INVALID");
expectFinding("binding", (review) => {
  review.candidate.changedFiles[0].candidate.gitMode = "120000";
  review.candidate.changedFilesSha256 = computeSuccessorChangedFilesSha256(review.candidate.changedFiles);
  resign(review);
}, "SUCCESSOR_CHANGED_FILES_SAFE_TYPES_INVALID");
expectFinding("binding", (review) => {
  const added = review.candidate.changedFiles.find((entry) => entry.changeType === "add");
  added.path = "docs/council/execution/releases/unprefixed-candidate.md";
  review.candidate.changedFiles.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
  review.candidate.changedFilesSha256 = computeSuccessorChangedFilesSha256(review.candidate.changedFiles);
  resign(review);
}, "SUCCESSOR_CHANGED_FILES_SAFE_TYPES_INVALID");
expectFinding("checks", (review) => {
  review.namedChecks[0].result = "skip";
  review.namedChecksSha256 = computeSuccessorNamedChecksSha256(review.namedChecks);
  resign(review);
}, "SUCCESSOR_NAMED_CHECKS_INVALID");
expectFinding("checks", (review) => {
  review.namedChecksSha256 = "0".repeat(64);
  resign(review);
}, "SUCCESSOR_NAMED_CHECKS_DIGEST_INVALID");
expectFinding("council", (review) => {
  review.seatAttestations.qa.reviewerId = review.seatAttestations.product.reviewerId;
  review.seatAttestations.qa.attestationDigest = computeSuccessorSeatAttestationDigest({
    reviewId: review.reviewId, seat: "qa", attestation: review.seatAttestations.qa,
  });
}, "SUCCESSOR_QA_ROLE_INVALID");
expectFinding("council", (review) => {
  review.candidate.implementerIds.push(review.seatAttestations.qa.reviewerId);
  resign(review);
}, "SUCCESSOR_QA_INDEPENDENCE_INVALID");
expectFinding("council", (review) => {
  review.unresolvedVetoes.push("synthetic-veto");
  resign(review);
}, "SUCCESSOR_UNRESOLVED_VETO_INVALID");
expectFinding("effects", (review) => {
  review.taskApprovalCreated = true;
  resign(review);
}, "SUCCESSOR_NON_AUTHORIZING_EFFECT_INVALID");
expectFinding("effects", (review) => {
  review.privateActionAllowed = true;
  resign(review);
}, "SUCCESSOR_NON_AUTHORIZING_EFFECT_INVALID");
expectFinding("effects", (review) => {
  review.r1R10Effect = "changed";
  resign(review);
}, "SUCCESSOR_NON_AUTHORIZING_EFFECT_INVALID");
expectFinding("effects", (review) => {
  review.permittedClaim = `${SUCCESSOR_CONTROL_REVIEW_PERMITTED_CLAIM} Execution approved.`;
  resign(review);
}, "SUCCESSOR_PERMITTED_CLAIM_INVALID");

{
  const candidate = createCandidateRepo();
  const { genesis } = genesisFixture();
  const review = reviewFixture(candidate, genesis);
  const reviewPath = `${SUCCESSOR_CONTROL_REVIEW_DIRECTORY}/P0-CONTROL-REVIEW-${review.reviewId}.json`;
  fs.mkdirSync(path.join(candidate.repoRoot, SUCCESSOR_CONTROL_REVIEW_DIRECTORY), { recursive: true });
  fs.writeFileSync(path.join(candidate.repoRoot, reviewPath), `${JSON.stringify(review, null, 2)}\n`);
  commitAll(candidate.repoRoot, "publish review");
  review.reviewDate = "2026-08-16";
  resign(review);
  fs.writeFileSync(path.join(candidate.repoRoot, reviewPath), `${JSON.stringify(review, null, 2)}\n`);
  commitAll(candidate.repoRoot, "rewrite review");
  const restored = reviewFixture(candidate, genesis);
  fs.writeFileSync(path.join(candidate.repoRoot, reviewPath), `${JSON.stringify(restored, null, 2)}\n`);
  const current = commitAll(candidate.repoRoot, "restore review");
  expect("history", verifyImmutableAddOnlyFileHistory({
    repoRoot: candidate.repoRoot,
    filePath: reviewPath,
    absentRevision: candidate.candidateRevision,
    currentRevision: current,
  }).findings.includes("ADD_ONLY_HISTORY_REWRITE"), "review edit then restore is detected");
}

{
  const candidate = createCandidateRepo();
  const { genesis } = genesisFixture();
  const review = reviewFixture(candidate, genesis);
  const reviewPath = `${SUCCESSOR_CONTROL_REVIEW_DIRECTORY}/P0-CONTROL-REVIEW-${review.reviewId}.json`;
  fs.mkdirSync(path.join(candidate.repoRoot, SUCCESSOR_CONTROL_REVIEW_DIRECTORY), { recursive: true });
  fs.writeFileSync(path.join(candidate.repoRoot, reviewPath), `${JSON.stringify(review, null, 2)}\n`);
  const contaminatedCandidate = commitAll(candidate.repoRoot, "candidate already contains review");
  expect("history", verifyImmutableAddOnlyFileHistory({
    repoRoot: candidate.repoRoot,
    filePath: reviewPath,
    absentRevision: contaminatedCandidate,
    currentRevision: contaminatedCandidate,
  }).findings.includes("ADD_ONLY_PRESENT_AT_CANDIDATE"), "self-referential candidate review fails");
}

{
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "p0-successor-integrated-"));
  git(repoRoot, ["init", "-q"]);
  git(repoRoot, ["config", "user.name", "Synthetic QA"]);
  git(repoRoot, ["config", "user.email", "synthetic@example.invalid"]);
  fs.mkdirSync(path.join(repoRoot, "docs/council/execution/control-reviews"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "docs/council/execution/releases"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "tools"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json"),
    `${JSON.stringify({ schemaVersion: "1.0.0", reviewers: reviewerRecords }, null, 2)}\n`);
  fs.writeFileSync(path.join(repoRoot, "docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json"),
    `${JSON.stringify({ controlReviews: {}, taskApprovals: {} }, null, 2)}\n`);
  fs.writeFileSync(path.join(repoRoot, "README.md"), "synthetic historical candidate\n");
  const historicalCandidate = commitAll(repoRoot, "historical candidate");
  const historicalReview = {
    reviewId: "P0-PC-001-GATE-B-CONTROL-IMPLEMENTATION-REVIEW",
    candidate: { revision: historicalCandidate },
    reviewContextSha256: "8".repeat(64),
  };
  fs.writeFileSync(path.join(repoRoot, "docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json"),
    `${JSON.stringify({ controlReviews: { "PC-001": historicalReview }, taskApprovals: {} }, null, 2)}\n`);
  const historicalPublication = commitAll(repoRoot, "historical review publication");
  fs.writeFileSync(path.join(repoRoot, "README.md"), "synthetic successor source base\n");
  const sourceBaseRevision = commitAll(repoRoot, "successor source base");
  const genesis = {
    schemaVersion: "1.0.0",
    genesisId: "P0-SUCCESSOR-CONTROL-REVIEW-GENESIS",
    createdDate: "2026-08-15",
    sourceBaseRevision,
    recordDirectory: SUCCESSOR_CONTROL_REVIEW_DIRECTORY,
    recordFilePattern: "^P0-CONTROL-REVIEW-P0-[A-Z0-9][A-Z0-9-]{5,95}\\.json$",
    historicalAnchor: {
      registryPath: "docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json",
      taskId: "PC-001",
      reviewId: historicalReview.reviewId,
      candidateRevision: historicalCandidate,
      publicationRevision: historicalPublication,
      canonicalRecordSha256: sha256(canonicalJson(historicalReview)),
      reviewContextSha256: historicalReview.reviewContextSha256,
    },
    requiredCouncilRoles: [...SUCCESSOR_CONTROL_REVIEW_ROLES],
    bootstrapPendingPolicy: {
      maximumPendingCandidates: 1,
      state: "review-pending",
      mergeAuthority: "one-time-stage0-goal-only",
      runtimeAuthority: false,
      taskApprovalEffect: "none",
      permissionEffect: "none",
    },
    permittedClaim: SUCCESSOR_CONTROL_REVIEW_PERMITTED_CLAIM,
    genesisPayloadSha256: null,
  };
  genesis.genesisPayloadSha256 = computeSuccessorGenesisPayloadSha256(genesis);
  fs.writeFileSync(path.join(repoRoot, SUCCESSOR_CONTROL_REVIEW_GENESIS_PATH), `${JSON.stringify(genesis, null, 2)}\n`);
  const dossierPath = "docs/council/execution/releases/P0-SYNTHETIC-INTEGRATED-DOSSIER.md";
  fs.writeFileSync(path.join(repoRoot, dossierPath), "# Integrated synthetic dossier\n");
  fs.writeFileSync(path.join(repoRoot, "tools/P0-integrated.mjs"), "export const synthetic = true;\n");
  const candidateRevision = commitAll(repoRoot, "successor bootstrap candidate");
  const pending = verifySuccessorControlReviews({ repoRoot });
  expect("integrated", pending.ok && pending.state === "bootstrap-review-pending"
    && pending.runtimeAuthority === false && pending.taskApprovalEffect === "none",
  "one inert bootstrap candidate validates without runtime or task authority");

  const changedFiles = deriveSuccessorChangedFiles(repoRoot, sourceBaseRevision, candidateRevision);
  const candidate = {
    repoRoot,
    baseRevision: sourceBaseRevision,
    candidateRevision,
    dossierPath,
    changedFiles,
    reviewerRegistrySha256: sha256(fs.readFileSync(
      path.join(repoRoot, "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json"),
    )),
  };
  const review = reviewFixture(candidate, genesis);
  const reviewPath = `${SUCCESSOR_CONTROL_REVIEW_DIRECTORY}/P0-CONTROL-REVIEW-${review.reviewId}.json`;
  fs.writeFileSync(path.join(repoRoot, reviewPath), `${JSON.stringify(review, null, 2)}\n`);
  const publicationRevision = commitAll(repoRoot, "successor review publication");
  const published = verifySuccessorControlReviews({ repoRoot, requireReviewId: review.reviewId });
  expect("integrated", published.ok && published.state === "reviewed"
    && published.reviews[0].candidateRevision === candidateRevision,
  "integrated add-only publication and required-review gate pass");

  fs.writeFileSync(path.join(repoRoot, dossierPath), "# Integrated synthetic dossier\n\nSecond candidate.\n");
  const extraDeltaBase = publicationRevision;
  const extraDeltaCandidateRevision = commitAll(repoRoot, "second successor candidate");
  const extraDeltaChangedFiles = deriveSuccessorChangedFiles(repoRoot, extraDeltaBase, extraDeltaCandidateRevision);
  const extraDeltaReview = reviewFixture({
    repoRoot,
    baseRevision: extraDeltaBase,
    candidateRevision: extraDeltaCandidateRevision,
    dossierPath,
    changedFiles: extraDeltaChangedFiles,
    reviewerRegistrySha256: candidate.reviewerRegistrySha256,
  }, genesis);
  extraDeltaReview.reviewId = "P0-SYNTHETIC-EXTRA-DELTA";
  extraDeltaReview.predecessor = {
    kind: "review",
    reviewId: review.reviewId,
    recordPath: reviewPath,
    recordSha256: computeSuccessorReviewRecordSha256(review),
  };
  resign(extraDeltaReview);
  const extraDeltaReviewPath = `${SUCCESSOR_CONTROL_REVIEW_DIRECTORY}/P0-CONTROL-REVIEW-${extraDeltaReview.reviewId}.json`;
  fs.writeFileSync(path.join(repoRoot, extraDeltaReviewPath), `${JSON.stringify(extraDeltaReview, null, 2)}\n`);
  fs.writeFileSync(path.join(repoRoot, "README.md"), "unrelated publication delta\n");
  commitAll(repoRoot, "publish review with unrelated delta");
  const extraDeltaPublication = verifySuccessorControlReviews({ repoRoot });
  expect("history", !extraDeltaPublication.ok
    && extraDeltaPublication.findings.includes("SUCCESSOR_REVIEW_PUBLICATION_SCOPE_INVALID"),
  "review publication commit cannot carry an unrelated delta");

  fs.writeFileSync(path.join(repoRoot, "README.md"), "synthetic omitted-history base\n");
  const omittedHistoryBase = commitAll(repoRoot, "omitted-history base");
  fs.writeFileSync(path.join(repoRoot, dossierPath), "# Integrated synthetic dossier\n\nOmitted-history candidate.\n");
  const omittedHistoryCandidateRevision = commitAll(repoRoot, "omitted-history candidate");
  const omittedHistoryChangedFiles = deriveSuccessorChangedFiles(
    repoRoot, omittedHistoryBase, omittedHistoryCandidateRevision,
  );
  const omittedHistoryReview = reviewFixture({
    repoRoot,
    baseRevision: omittedHistoryBase,
    candidateRevision: omittedHistoryCandidateRevision,
    dossierPath,
    changedFiles: omittedHistoryChangedFiles,
    reviewerRegistrySha256: candidate.reviewerRegistrySha256,
  }, genesis);
  omittedHistoryReview.reviewId = "P0-SYNTHETIC-OMITTED-HISTORY";
  resign(omittedHistoryReview);
  const omittedHistoryReviewPath = `${SUCCESSOR_CONTROL_REVIEW_DIRECTORY}/P0-CONTROL-REVIEW-${omittedHistoryReview.reviewId}.json`;
  fs.writeFileSync(path.join(repoRoot, omittedHistoryReviewPath), `${JSON.stringify(omittedHistoryReview, null, 2)}\n`);
  commitAll(repoRoot, "publish review with omitted activation history");
  const omittedHistory = verifySuccessorControlReviews({ repoRoot });
  expect("history", !omittedHistory.ok
    && omittedHistory.findings.includes("SUCCESSOR_GENESIS_PREDECESSOR_INVALID"),
  "first successor review cannot choose a later base and omit activation history");

  fs.rmSync(path.join(repoRoot, reviewPath));
  commitAll(repoRoot, "forbidden successor review deletion");
  const deleted = verifySuccessorControlReviews({ repoRoot, requireReviewId: review.reviewId });
  expect("integrated", !deleted.ok
    && deleted.findings.some((code) => code === "SUCCESSOR_REVIEW_WORKTREE_BINDING_INVALID"
      || code === "SUCCESSOR_REVIEW_HISTORY_ADD_ONLY_HISTORY_DELETION"),
  "integrated committed deletion remains discoverable and fails closed");
}

const namedChecks = Object.fromEntries([...groups].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
  .map(([group, labels]) => [group, `sha256:${crypto.createHash("sha256").update(canonicalJson(labels)).digest("hex")}`]));
console.log(JSON.stringify({
  suite: "P0 successor control-review trust fixtures",
  fixtureClass: "fictional/synthetic only",
  namedChecks,
  failed: 0,
}, null, 2));
