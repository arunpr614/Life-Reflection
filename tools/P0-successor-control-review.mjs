#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";
import {
  FULL_COMMIT_PATTERN,
  REQUIRED_GIT_TYPE,
  REQUIRED_REGULAR_FILE_MODE,
  SHA256_PATTERN,
  canonicalJson,
  gitEntryAtRevision,
  hasExactKeys,
  isAncestor,
  resolveRevision,
  sha256,
  verifyImmutableAddOnlyFileHistory,
} from "./P0-append-only-trust.mjs";

export const SUCCESSOR_CONTROL_REVIEW_GENESIS_PATH = "docs/council/execution/control-reviews/P0-SUCCESSOR-CONTROL-REVIEW-GENESIS.json";
export const SUCCESSOR_CONTROL_REVIEW_DIRECTORY = "docs/council/execution/control-reviews";
export const SUCCESSOR_CONTROL_REVIEW_PERMITTED_CLAIM = "Accepted only for normal publication of the exact public/local control candidate; this review is non-authorizing and creates no task approval, execution permission, private access, R0 action, deployment, acceptance, status transition, or R1-R10 effect.";
export const SUCCESSOR_CONTROL_REVIEW_ROLES = Object.freeze(["product", "design", "architecture", "qa", "project"]);

export const SUCCESSOR_GENESIS_KEYS = Object.freeze([
  "schemaVersion",
  "genesisId",
  "createdDate",
  "sourceBaseRevision",
  "recordDirectory",
  "recordFilePattern",
  "historicalAnchor",
  "requiredCouncilRoles",
  "bootstrapPendingPolicy",
  "permittedClaim",
  "genesisPayloadSha256",
]);
export const SUCCESSOR_REVIEW_KEYS = Object.freeze([
  "schemaVersion",
  "reviewId",
  "reviewDate",
  "reviewType",
  "predecessor",
  "candidate",
  "namedChecks",
  "namedChecksSha256",
  "reviewContextSha256",
  "seatAttestations",
  "unresolvedVetoes",
  "disposition",
  "taskApprovalCreated",
  "runtimeAuthority",
  "executionAllowed",
  "privateActionAllowed",
  "statusTransitionAllowed",
  "r1R10Effect",
  "permittedClaim",
]);
export const SUCCESSOR_CANDIDATE_KEYS = Object.freeze([
  "baseRevision",
  "revision",
  "dossierPath",
  "dossierSha256",
  "reviewerRegistryPath",
  "reviewerRegistrySha256",
  "changedFiles",
  "changedFilesSha256",
  "implementerIds",
  "evidenceProducerIds",
]);
export const SUCCESSOR_CHANGED_FILE_KEYS = Object.freeze([
  "path",
  "changeType",
  "base",
  "candidate",
]);
export const SUCCESSOR_FILE_SIDE_KEYS = Object.freeze(["sha256", "gitMode", "gitType"]);
export const SUCCESSOR_CHECK_KEYS = Object.freeze(["checkId", "result", "evidenceDigest", "evidenceReference"]);
export const SUCCESSOR_PREDECESSOR_KEYS = Object.freeze(["kind", "reviewId", "recordPath", "recordSha256"]);
export const SUCCESSOR_SEAT_KEYS = Object.freeze([
  "reviewerId",
  "reviewerRole",
  "verdict",
  "reviewedRevision",
  "reviewContextSha256",
  "evidenceDigest",
  "evidenceReference",
  "rationale",
  "attestationDigest",
]);

const REVIEW_ID_PATTERN = /^P0-[A-Z0-9][A-Z0-9-]{5,95}$/;
const CHECK_ID_PATTERN = /^P0-[A-Z0-9][A-Z0-9-]{3,95}$/;
const SAFE_PATH_PATTERN = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))(?!.*[\0\r\n])[A-Za-z0-9._/-]+$/;
const EVIDENCE_REFERENCE_PATTERN = /^(?:github-pr|github-check|commit|review|local-evidence):[A-Za-z0-9._\/-]{1,160}$/;
const CHANGE_TYPES = Object.freeze(["add", "modify", "delete", "type-change"]);

const withoutKey = (value, key) => Object.fromEntries(Object.entries(value ?? {}).filter(([entry]) => entry !== key));
const compareCodePointStrings = (left, right) => left < right ? -1 : left > right ? 1 : 0;
const canonicalSort = (left, right) => compareCodePointStrings(canonicalJson(left), canonicalJson(right));

export function computeSuccessorGenesisPayloadSha256(genesis) {
  return sha256(canonicalJson(withoutKey(genesis, "genesisPayloadSha256")));
}

export function successorReviewContextPayload(review) {
  return Object.fromEntries(Object.entries(review ?? {})
    .filter(([key]) => !["seatAttestations", "reviewContextSha256"].includes(key)));
}

export function computeSuccessorReviewContextSha256(review) {
  return sha256(canonicalJson(successorReviewContextPayload(review)));
}

export function computeSuccessorReviewRecordSha256(review) {
  return sha256(canonicalJson(review));
}

export function computeSuccessorChangedFilesSha256(changedFiles) {
  return sha256(canonicalJson([...(changedFiles ?? [])].sort(canonicalSort)));
}

export function computeSuccessorNamedChecksSha256(namedChecks) {
  return sha256(canonicalJson([...(namedChecks ?? [])].sort(canonicalSort)));
}

export function successorSeatAttestationPayload({ reviewId, seat, attestation }) {
  return {
    reviewId,
    seat,
    reviewerId: attestation?.reviewerId ?? null,
    reviewerRole: attestation?.reviewerRole ?? null,
    verdict: attestation?.verdict ?? null,
    reviewedRevision: attestation?.reviewedRevision ?? null,
    reviewContextSha256: attestation?.reviewContextSha256 ?? null,
    evidenceDigest: attestation?.evidenceDigest ?? null,
    evidenceReference: attestation?.evidenceReference ?? null,
    rationale: attestation?.rationale ?? null,
  };
}

export function computeSuccessorSeatAttestationDigest(input) {
  return sha256(canonicalJson(successorSeatAttestationPayload(input)));
}

function sideFromEntry(entry) {
  return entry ? { sha256: entry.sha256, gitMode: entry.gitMode, gitType: entry.gitType } : null;
}

function git(repoRoot, args, options = {}) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: options.encoding === undefined ? "utf8" : options.encoding,
    maxBuffer: 64 * 1024 * 1024,
  });
}

export function deriveSuccessorChangedFiles(repoRoot, baseRevision, candidateRevision) {
  const base = resolveRevision(repoRoot, baseRevision);
  const candidate = resolveRevision(repoRoot, candidateRevision);
  if (!base || !candidate || base === candidate || !isAncestor(repoRoot, base, candidate)) return null;
  const fields = git(repoRoot, ["diff", "--no-renames", "--name-status", "-z", base, candidate], { encoding: null })
    .toString("utf8").split("\0").filter((value) => value !== "");
  if (fields.length % 2 !== 0) return null;
  const records = [];
  for (let index = 0; index < fields.length; index += 2) {
    const status = fields[index];
    const filePath = fields[index + 1];
    const baseEntry = gitEntryAtRevision(repoRoot, base, filePath);
    const candidateEntry = gitEntryAtRevision(repoRoot, candidate, filePath);
    const changeType = status === "A" ? "add"
      : status === "D" ? "delete"
        : status === "T" ? "type-change" : status === "M" ? "modify" : null;
    if (!changeType || !SAFE_PATH_PATTERN.test(filePath)) return null;
    records.push({
      path: filePath,
      changeType,
      base: sideFromEntry(baseEntry),
      candidate: sideFromEntry(candidateEntry),
    });
  }
  return records.sort((left, right) => compareCodePointStrings(left.path, right.path));
}

function validFileSide(side) {
  return hasExactKeys(side, SUCCESSOR_FILE_SIDE_KEYS)
    && SHA256_PATTERN.test(side?.sha256 ?? "")
    && /^\d{6}$/.test(side?.gitMode ?? "")
    && /^(?:blob|tree|commit)$/.test(side?.gitType ?? "");
}

function validChangedFile(entry) {
  if (!hasExactKeys(entry, SUCCESSOR_CHANGED_FILE_KEYS)
    || !SAFE_PATH_PATTERN.test(entry?.path ?? "") || !CHANGE_TYPES.includes(entry?.changeType)) return false;
  const baseValid = entry.base === null || validFileSide(entry.base);
  const candidateValid = entry.candidate === null || validFileSide(entry.candidate);
  if (!baseValid || !candidateValid) return false;
  if (entry.changeType === "add") return entry.base === null && entry.candidate !== null;
  if (entry.changeType === "delete") return entry.base !== null && entry.candidate === null;
  return entry.base !== null && entry.candidate !== null;
}

function validSafeCandidateChangedFile(entry) {
  if (!["add", "modify"].includes(entry?.changeType)) return false;
  if (entry?.candidate?.gitMode !== REQUIRED_REGULAR_FILE_MODE
    || entry?.candidate?.gitType !== REQUIRED_GIT_TYPE) return false;
  if (entry.base !== null
    && (entry.base?.gitMode !== REQUIRED_REGULAR_FILE_MODE || entry.base?.gitType !== REQUIRED_GIT_TYPE)) {
    return false;
  }
  return entry.changeType !== "add" || path.posix.basename(entry.path).startsWith("P0-");
}

export function successorGenesisFindings(genesis, historicalReview = null) {
  const findings = [];
  const add = (condition, code) => { if (!condition) findings.push(code); };
  add(hasExactKeys(genesis, SUCCESSOR_GENESIS_KEYS), "SUCCESSOR_GENESIS_SCHEMA_INVALID");
  add(genesis?.schemaVersion === "1.0.0", "SUCCESSOR_GENESIS_VERSION_INVALID");
  add(genesis?.genesisId === "P0-SUCCESSOR-CONTROL-REVIEW-GENESIS", "SUCCESSOR_GENESIS_ID_INVALID");
  add(/^\d{4}-\d{2}-\d{2}$/.test(genesis?.createdDate ?? ""), "SUCCESSOR_GENESIS_DATE_INVALID");
  add(FULL_COMMIT_PATTERN.test(genesis?.sourceBaseRevision ?? ""), "SUCCESSOR_GENESIS_BASE_INVALID");
  add(genesis?.recordDirectory === SUCCESSOR_CONTROL_REVIEW_DIRECTORY, "SUCCESSOR_GENESIS_DIRECTORY_INVALID");
  add(genesis?.recordFilePattern === "^P0-CONTROL-REVIEW-P0-[A-Z0-9][A-Z0-9-]{5,95}\\.json$",
    "SUCCESSOR_GENESIS_PATTERN_INVALID");
  const anchor = genesis?.historicalAnchor;
  add(hasExactKeys(anchor, ["registryPath", "taskId", "reviewId", "candidateRevision", "publicationRevision",
    "canonicalRecordSha256", "reviewContextSha256"]), "SUCCESSOR_GENESIS_ANCHOR_SCHEMA_INVALID");
  add(anchor?.registryPath === "docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json"
    && anchor?.taskId === "PC-001", "SUCCESSOR_GENESIS_ANCHOR_PATH_INVALID");
  add(FULL_COMMIT_PATTERN.test(anchor?.candidateRevision ?? "")
    && FULL_COMMIT_PATTERN.test(anchor?.publicationRevision ?? "")
    && SHA256_PATTERN.test(anchor?.canonicalRecordSha256 ?? "")
    && SHA256_PATTERN.test(anchor?.reviewContextSha256 ?? ""), "SUCCESSOR_GENESIS_ANCHOR_BINDING_INVALID");
  if (historicalReview !== null) {
    add(anchor?.reviewId === historicalReview?.reviewId
      && anchor?.candidateRevision === historicalReview?.candidate?.revision
      && anchor?.reviewContextSha256 === historicalReview?.reviewContextSha256
      && anchor?.canonicalRecordSha256 === computeSuccessorReviewRecordSha256(historicalReview),
    "SUCCESSOR_GENESIS_HISTORICAL_REVIEW_INVALID");
  }
  add(canonicalJson(genesis?.requiredCouncilRoles) === canonicalJson(SUCCESSOR_CONTROL_REVIEW_ROLES),
    "SUCCESSOR_GENESIS_ROLES_INVALID");
  add(hasExactKeys(genesis?.bootstrapPendingPolicy,
    ["maximumPendingCandidates", "state", "mergeAuthority", "runtimeAuthority", "taskApprovalEffect", "permissionEffect"])
    && genesis.bootstrapPendingPolicy.maximumPendingCandidates === 1
    && genesis.bootstrapPendingPolicy.state === "review-pending"
    && genesis.bootstrapPendingPolicy.mergeAuthority === "one-time-stage0-goal-only"
    && genesis.bootstrapPendingPolicy.runtimeAuthority === false
    && genesis.bootstrapPendingPolicy.taskApprovalEffect === "none"
    && genesis.bootstrapPendingPolicy.permissionEffect === "none", "SUCCESSOR_GENESIS_PENDING_POLICY_INVALID");
  add(genesis?.permittedClaim === SUCCESSOR_CONTROL_REVIEW_PERMITTED_CLAIM,
    "SUCCESSOR_GENESIS_PERMITTED_CLAIM_INVALID");
  add(SHA256_PATTERN.test(genesis?.genesisPayloadSha256 ?? "")
    && genesis.genesisPayloadSha256 === computeSuccessorGenesisPayloadSha256(genesis),
  "SUCCESSOR_GENESIS_PAYLOAD_DIGEST_INVALID");
  return [...new Set(findings)];
}

export function successorControlReviewFindings({
  review,
  filePath,
  genesis,
  reviewerRecords,
  derivedChangedFiles = null,
  derivedReviewerRegistrySha256 = null,
}) {
  const findings = [];
  const add = (condition, code) => { if (!condition) findings.push(code); };
  add(hasExactKeys(review, SUCCESSOR_REVIEW_KEYS), "SUCCESSOR_REVIEW_SCHEMA_INVALID");
  add(review?.schemaVersion === "1.0.0", "SUCCESSOR_REVIEW_VERSION_INVALID");
  add(REVIEW_ID_PATTERN.test(review?.reviewId ?? ""), "SUCCESSOR_REVIEW_ID_INVALID");
  add(filePath === `${SUCCESSOR_CONTROL_REVIEW_DIRECTORY}/P0-CONTROL-REVIEW-${review?.reviewId}.json`,
    "SUCCESSOR_REVIEW_PATH_INVALID");
  add(/^\d{4}-\d{2}-\d{2}$/.test(review?.reviewDate ?? ""), "SUCCESSOR_REVIEW_DATE_INVALID");
  add(review?.reviewType === "non-authorizing-successor-control-review", "SUCCESSOR_REVIEW_TYPE_INVALID");
  add(hasExactKeys(review?.predecessor, SUCCESSOR_PREDECESSOR_KEYS)
    && ["genesis", "review"].includes(review?.predecessor?.kind)
    && REVIEW_ID_PATTERN.test(review?.predecessor?.reviewId ?? "")
    && SAFE_PATH_PATTERN.test(review?.predecessor?.recordPath ?? "")
    && SHA256_PATTERN.test(review?.predecessor?.recordSha256 ?? ""), "SUCCESSOR_PREDECESSOR_SCHEMA_INVALID");
  const candidate = review?.candidate;
  add(hasExactKeys(candidate, SUCCESSOR_CANDIDATE_KEYS), "SUCCESSOR_CANDIDATE_SCHEMA_INVALID");
  add(FULL_COMMIT_PATTERN.test(candidate?.baseRevision ?? "")
    && FULL_COMMIT_PATTERN.test(candidate?.revision ?? "")
    && candidate?.baseRevision !== candidate?.revision, "SUCCESSOR_CANDIDATE_REVISIONS_INVALID");
  add(SAFE_PATH_PATTERN.test(candidate?.dossierPath ?? "")
    && SHA256_PATTERN.test(candidate?.dossierSha256 ?? ""), "SUCCESSOR_CANDIDATE_DOSSIER_INVALID");
  add(candidate?.reviewerRegistryPath === "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json"
    && SHA256_PATTERN.test(candidate?.reviewerRegistrySha256 ?? ""),
  "SUCCESSOR_CANDIDATE_REVIEWER_REGISTRY_INVALID");
  if (derivedReviewerRegistrySha256 !== null) {
    add(candidate?.reviewerRegistrySha256 === derivedReviewerRegistrySha256,
      "SUCCESSOR_CANDIDATE_REVIEWER_REGISTRY_BINDING_INVALID");
  }
  add(Array.isArray(candidate?.changedFiles) && candidate.changedFiles.length > 0
    && candidate.changedFiles.every(validChangedFile)
    && new Set(candidate.changedFiles.map((entry) => entry.path)).size === candidate.changedFiles.length
    && candidate.changedFiles.every((entry, index, array) => index === 0
      || compareCodePointStrings(array[index - 1].path, entry.path) < 0),
  "SUCCESSOR_CHANGED_FILES_SCHEMA_INVALID");
  add(Array.isArray(candidate?.changedFiles)
    && candidate.changedFiles.every(validSafeCandidateChangedFile),
  "SUCCESSOR_CHANGED_FILES_SAFE_TYPES_INVALID");
  add(SHA256_PATTERN.test(candidate?.changedFilesSha256 ?? "")
    && candidate.changedFilesSha256 === computeSuccessorChangedFilesSha256(candidate?.changedFiles),
  "SUCCESSOR_CHANGED_FILES_DIGEST_INVALID");
  if (derivedChangedFiles !== null) {
    add(canonicalJson(candidate?.changedFiles) === canonicalJson(derivedChangedFiles),
      "SUCCESSOR_CHANGED_FILES_BINDING_INVALID");
  }
  const dossierEntry = candidate?.changedFiles?.find((entry) => entry.path === candidate?.dossierPath)?.candidate;
  add(dossierEntry?.sha256 === candidate?.dossierSha256, "SUCCESSOR_DOSSIER_BINDING_INVALID");

  const reviewerById = new Map((reviewerRecords ?? []).map((entry) => [entry?.reviewerId, entry]));
  const validContributors = (ids, role) => Array.isArray(ids) && ids.length > 0
    && new Set(ids).size === ids.length
    && ids.every((id) => reviewerById.get(id)?.active === true && reviewerById.get(id)?.role === role);
  add(validContributors(candidate?.implementerIds, "implementation"), "SUCCESSOR_IMPLEMENTER_ROLE_INVALID");
  add(validContributors(candidate?.evidenceProducerIds, "evidence-producer"), "SUCCESSOR_EVIDENCE_ROLE_INVALID");

  const checks = review?.namedChecks;
  add(Array.isArray(checks) && checks.length > 0
    && checks.every((entry) => hasExactKeys(entry, SUCCESSOR_CHECK_KEYS)
      && CHECK_ID_PATTERN.test(entry?.checkId ?? "")
      && entry?.result === "pass"
      && /^sha256:[0-9a-f]{64}$/.test(entry?.evidenceDigest ?? "")
      && EVIDENCE_REFERENCE_PATTERN.test(entry?.evidenceReference ?? ""))
    && new Set(checks.map((entry) => entry.checkId)).size === checks.length
    && checks.every((entry, index, array) => index === 0 || array[index - 1].checkId < entry.checkId),
  "SUCCESSOR_NAMED_CHECKS_INVALID");
  add(SHA256_PATTERN.test(review?.namedChecksSha256 ?? "")
    && review.namedChecksSha256 === computeSuccessorNamedChecksSha256(checks),
  "SUCCESSOR_NAMED_CHECKS_DIGEST_INVALID");
  const expectedContext = computeSuccessorReviewContextSha256(review);
  add(SHA256_PATTERN.test(review?.reviewContextSha256 ?? "")
    && review.reviewContextSha256 === expectedContext, "SUCCESSOR_REVIEW_CONTEXT_INVALID");

  const seatReviewerIds = [];
  for (const seat of SUCCESSOR_CONTROL_REVIEW_ROLES) {
    const attestation = review?.seatAttestations?.[seat];
    const reviewer = reviewerById.get(attestation?.reviewerId);
    seatReviewerIds.push(attestation?.reviewerId);
    add(hasExactKeys(attestation, SUCCESSOR_SEAT_KEYS), `SUCCESSOR_${seat.toUpperCase()}_SCHEMA_INVALID`);
    add(reviewer?.active === true && reviewer?.role === seat && attestation?.reviewerRole === seat,
      `SUCCESSOR_${seat.toUpperCase()}_ROLE_INVALID`);
    add(attestation?.verdict === "approve-normal-merge-only", `SUCCESSOR_${seat.toUpperCase()}_VERDICT_INVALID`);
    add(attestation?.reviewedRevision === candidate?.revision, `SUCCESSOR_${seat.toUpperCase()}_REVISION_INVALID`);
    add(attestation?.reviewContextSha256 === expectedContext, `SUCCESSOR_${seat.toUpperCase()}_CONTEXT_INVALID`);
    add(/^sha256:[0-9a-f]{64}$/.test(attestation?.evidenceDigest ?? "")
      && EVIDENCE_REFERENCE_PATTERN.test(attestation?.evidenceReference ?? ""),
    `SUCCESSOR_${seat.toUpperCase()}_EVIDENCE_INVALID`);
    add(typeof attestation?.rationale === "string" && attestation.rationale.length >= 24,
      `SUCCESSOR_${seat.toUpperCase()}_RATIONALE_INVALID`);
    add(attestation?.attestationDigest === computeSuccessorSeatAttestationDigest({
      reviewId: review?.reviewId, seat, attestation,
    }), `SUCCESSOR_${seat.toUpperCase()}_ATTESTATION_INVALID`);
  }
  add(hasExactKeys(review?.seatAttestations, SUCCESSOR_CONTROL_REVIEW_ROLES),
    "SUCCESSOR_SEAT_SET_INVALID");
  add(new Set(seatReviewerIds).size === SUCCESSOR_CONTROL_REVIEW_ROLES.length,
    "SUCCESSOR_SEAT_UNIQUENESS_INVALID");
  add(!candidate?.implementerIds?.includes(review?.seatAttestations?.qa?.reviewerId)
    && !candidate?.evidenceProducerIds?.includes(review?.seatAttestations?.qa?.reviewerId),
  "SUCCESSOR_QA_INDEPENDENCE_INVALID");
  add(Array.isArray(review?.unresolvedVetoes) && review.unresolvedVetoes.length === 0,
    "SUCCESSOR_UNRESOLVED_VETO_INVALID");
  add(review?.disposition === "accepted-normal-merge-only", "SUCCESSOR_DISPOSITION_INVALID");
  add(review?.taskApprovalCreated === false && review?.runtimeAuthority === false
    && review?.executionAllowed === false && review?.privateActionAllowed === false
    && review?.statusTransitionAllowed === false && review?.r1R10Effect === "none",
  "SUCCESSOR_NON_AUTHORIZING_EFFECT_INVALID");
  add(review?.permittedClaim === SUCCESSOR_CONTROL_REVIEW_PERMITTED_CLAIM,
    "SUCCESSOR_PERMITTED_CLAIM_INVALID");
  return [...new Set(findings)];
}

function readJson(repoRoot, filePath) {
  return parseJsonWithoutDuplicateKeys(fs.readFileSync(path.join(repoRoot, filePath), "utf8"), filePath);
}

function successorRecordPaths(repoRoot, genesis, currentRevision) {
  const pattern = new RegExp(genesis.recordFilePattern);
  const paths = new Set();
  const absoluteDirectory = path.join(repoRoot, genesis.recordDirectory);
  if (fs.existsSync(absoluteDirectory)) {
    for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
      if (entry.isFile() && pattern.test(entry.name)) paths.add(`${genesis.recordDirectory}/${entry.name}`);
    }
  }
  const current = resolveRevision(repoRoot, currentRevision);
  const base = resolveRevision(repoRoot, genesis.sourceBaseRevision);
  if (current && base && isAncestor(repoRoot, base, current)) {
    const revisions = [base, ...git(repoRoot, ["rev-list", "--reverse", `${base}..${current}`])
      .split(/\r?\n/).filter((entry) => FULL_COMMIT_PATTERN.test(entry))];
    for (const revision of revisions) {
      const names = git(repoRoot, ["ls-tree", "-r", "--name-only", "-z", revision, "--", genesis.recordDirectory],
        { encoding: null }).toString("utf8").split("\0").filter(Boolean);
      for (const filePath of names) {
        if (pattern.test(path.posix.basename(filePath))) paths.add(filePath);
      }
    }
  }
  return [...paths].sort();
}

function reviewPublicationScopeValid(repoRoot, history, candidateRevision, filePath) {
  const publicationRevision = history?.publicationRevision;
  if (!FULL_COMMIT_PATTERN.test(publicationRevision ?? "")) return false;
  const parentLine = git(repoRoot, ["rev-list", "--parents", "-n", "1", publicationRevision])
    .split(/\s+/).filter(Boolean);
  if (parentLine.length !== 2 || parentLine[0] !== publicationRevision) return false;
  const parentRevision = parentLine[1];
  if (!isAncestor(repoRoot, candidateRevision, parentRevision)) return false;
  const delta = git(repoRoot, ["diff", "--no-renames", "--name-status", "-z", parentRevision, publicationRevision],
    { encoding: null }).toString("utf8").split("\0").filter(Boolean);
  if (delta.length !== 2 || delta[0] !== "A" || delta[1] !== filePath) return false;
  const entry = gitEntryAtRevision(repoRoot, publicationRevision, filePath);
  return entry?.gitMode === REQUIRED_REGULAR_FILE_MODE && entry?.gitType === REQUIRED_GIT_TYPE;
}

export function verifySuccessorControlReviews({ repoRoot, currentRevision = "HEAD", requireReviewId = null }) {
  const findings = [];
  let genesis;
  let historicalReview;
  try {
    genesis = readJson(repoRoot, SUCCESSOR_CONTROL_REVIEW_GENESIS_PATH);
    const approval = readJson(repoRoot, genesis.historicalAnchor.registryPath);
    historicalReview = approval?.controlReviews?.[genesis.historicalAnchor.taskId] ?? null;
  } catch {
    return { ok: false, state: "invalid", findings: ["SUCCESSOR_INPUT_READ_INVALID"], reviews: [] };
  }
  findings.push(...successorGenesisFindings(genesis, historicalReview));
  const genesisRawSha = sha256(fs.readFileSync(path.join(repoRoot, SUCCESSOR_CONTROL_REVIEW_GENESIS_PATH)));
  const genesisHistory = verifyImmutableAddOnlyFileHistory({
    repoRoot,
    filePath: SUCCESSOR_CONTROL_REVIEW_GENESIS_PATH,
    absentRevision: genesis.sourceBaseRevision,
    currentRevision,
    expectedSha256: genesisRawSha,
  });
  findings.push(...genesisHistory.findings.map((code) => `SUCCESSOR_GENESIS_HISTORY_${code}`));
  try {
    const stats = fs.lstatSync(path.join(repoRoot, SUCCESSOR_CONTROL_REVIEW_GENESIS_PATH));
    const current = resolveRevision(repoRoot, currentRevision);
    const committed = current
      ? gitEntryAtRevision(repoRoot, current, SUCCESSOR_CONTROL_REVIEW_GENESIS_PATH)
      : null;
    if (!stats.isFile() || stats.isSymbolicLink() || (stats.mode & 0o777).toString(8) !== "644"
      || !committed || committed.sha256 !== genesisRawSha) {
      findings.push("SUCCESSOR_GENESIS_WORKTREE_BINDING_INVALID");
    }
  } catch {
    findings.push("SUCCESSOR_GENESIS_WORKTREE_BINDING_INVALID");
  }
  if (!isAncestor(repoRoot, genesis.historicalAnchor.publicationRevision, genesis.sourceBaseRevision)) {
    findings.push("SUCCESSOR_GENESIS_HISTORICAL_ANCESTRY_INVALID");
  }

  const recordPaths = successorRecordPaths(repoRoot, genesis, currentRevision);
  const records = [];
  for (const filePath of recordPaths) {
    let review;
    let reviewEntry = null;
    try {
      const current = resolveRevision(repoRoot, currentRevision);
      reviewEntry = current ? gitEntryAtRevision(repoRoot, current, filePath) : null;
      if (!reviewEntry) {
        const revisions = git(repoRoot, ["rev-list", "--reverse", `${genesis.sourceBaseRevision}..${currentRevision}`])
          .split(/\r?\n/).filter((entry) => FULL_COMMIT_PATTERN.test(entry));
        for (const revision of revisions) {
          reviewEntry = gitEntryAtRevision(repoRoot, revision, filePath);
          if (reviewEntry) break;
        }
      }
      if (!reviewEntry) throw new Error("record bytes unavailable");
      review = parseJsonWithoutDuplicateKeys(reviewEntry.bytes.toString("utf8"), filePath);
    } catch {
      findings.push("SUCCESSOR_REVIEW_JSON_INVALID");
      continue;
    }
    const absoluteReviewPath = path.join(repoRoot, filePath);
    try {
      const stats = fs.lstatSync(absoluteReviewPath);
      const worktreeBytes = fs.readFileSync(absoluteReviewPath);
      const current = resolveRevision(repoRoot, currentRevision);
      const currentEntry = current ? gitEntryAtRevision(repoRoot, current, filePath) : null;
      if (!stats.isFile() || stats.isSymbolicLink() || (stats.mode & 0o777).toString(8) !== "644"
        || !currentEntry || currentEntry.sha256 !== sha256(worktreeBytes)) {
        findings.push("SUCCESSOR_REVIEW_WORKTREE_BINDING_INVALID");
      }
    } catch {
      findings.push("SUCCESSOR_REVIEW_WORKTREE_BINDING_INVALID");
    }
    const derivedChangedFiles = deriveSuccessorChangedFiles(repoRoot,
      review?.candidate?.baseRevision, review?.candidate?.revision);
    const candidateReviewerRegistry = gitEntryAtRevision(repoRoot, review?.candidate?.revision,
      review?.candidate?.reviewerRegistryPath);
    let candidateReviewerRecords = [];
    try {
      candidateReviewerRecords = candidateReviewerRegistry
        ? parseJsonWithoutDuplicateKeys(candidateReviewerRegistry.bytes.toString("utf8"),
          `${review.candidate.revision}:${review.candidate.reviewerRegistryPath}`).reviewers
        : [];
    } catch {
      findings.push("SUCCESSOR_CANDIDATE_REVIEWER_REGISTRY_JSON_INVALID");
    }
    findings.push(...successorControlReviewFindings({
      review,
      filePath,
      genesis,
      reviewerRecords: candidateReviewerRecords,
      derivedChangedFiles,
      derivedReviewerRegistrySha256: candidateReviewerRegistry?.sha256 ?? null,
    }));
    if (derivedChangedFiles === null) findings.push("SUCCESSOR_CANDIDATE_GIT_BINDING_INVALID");
    if (!candidateReviewerRegistry) findings.push("SUCCESSOR_CANDIDATE_REVIEWER_REGISTRY_GIT_INVALID");
    if (!isAncestor(repoRoot, review?.candidate?.revision, resolveRevision(repoRoot, currentRevision) ?? "")) {
      findings.push("SUCCESSOR_CANDIDATE_NOT_ANCESTOR");
    }
    const candidateDossier = gitEntryAtRevision(repoRoot, review?.candidate?.revision, review?.candidate?.dossierPath);
    if (candidateDossier?.sha256 !== review?.candidate?.dossierSha256) {
      findings.push("SUCCESSOR_CANDIDATE_DOSSIER_GIT_BINDING_INVALID");
    }
    const expectedRawSha = reviewEntry.sha256;
    const history = verifyImmutableAddOnlyFileHistory({
      repoRoot,
      filePath,
      absentRevision: review?.candidate?.revision,
      currentRevision,
      expectedSha256: expectedRawSha,
    });
    findings.push(...history.findings.map((code) => `SUCCESSOR_REVIEW_HISTORY_${code}`));
    if (!reviewPublicationScopeValid(repoRoot, history, review?.candidate?.revision, filePath)) {
      findings.push("SUCCESSOR_REVIEW_PUBLICATION_SCOPE_INVALID");
    }
    records.push({ filePath, review, history, recordSha256: computeSuccessorReviewRecordSha256(review) });
  }

  const reviewIds = records.map(({ review }) => review.reviewId);
  if (new Set(reviewIds).size !== reviewIds.length) findings.push("SUCCESSOR_REVIEW_ID_REUSED");
  const candidateIds = records.map(({ review }) => review.candidate?.revision);
  if (new Set(candidateIds).size !== candidateIds.length) findings.push("SUCCESSOR_CANDIDATE_REVIEWED_TWICE");
  const predecessorKeys = records.map(({ review }) => canonicalJson(review.predecessor));
  if (new Set(predecessorKeys).size !== predecessorKeys.length) findings.push("SUCCESSOR_PREDECESSOR_REUSED");

  const byId = new Map(records.map((record) => [record.review.reviewId, record]));
  for (const record of records) {
    const predecessor = record.review.predecessor;
    if (predecessor?.kind === "genesis") {
      if (predecessor.reviewId !== genesis.genesisId
        || predecessor.recordPath !== SUCCESSOR_CONTROL_REVIEW_GENESIS_PATH
        || predecessor.recordSha256 !== genesis.genesisPayloadSha256
        || record.review.candidate.baseRevision !== genesis.sourceBaseRevision) {
        findings.push("SUCCESSOR_GENESIS_PREDECESSOR_INVALID");
      }
    } else if (predecessor?.kind === "review") {
      const prior = byId.get(predecessor.reviewId);
      if (!prior || predecessor.recordPath !== prior.filePath
        || predecessor.recordSha256 !== prior.recordSha256
        || !prior.history.publicationRevision
        || !isAncestor(repoRoot, prior.history.publicationRevision, record.review.candidate.baseRevision)) {
        findings.push("SUCCESSOR_REVIEW_PREDECESSOR_INVALID");
      }
    }
  }
  if (records.length > 0 && records.filter(({ review }) => review.predecessor?.kind === "genesis").length !== 1) {
    findings.push("SUCCESSOR_CHAIN_ROOT_CARDINALITY_INVALID");
  }
  if (requireReviewId !== null && !byId.has(requireReviewId)) findings.push("SUCCESSOR_REQUIRED_REVIEW_MISSING");

  const state = records.length === 0 ? "bootstrap-review-pending" : "reviewed";
  return {
    ok: findings.length === 0,
    state,
    findings: [...new Set(findings)],
    reviews: records.map(({ filePath, review, history, recordSha256 }) => ({
      filePath,
      reviewId: review.reviewId,
      candidateRevision: review.candidate.revision,
      publicationRevision: history.publicationRevision,
      recordSha256,
    })),
    runtimeAuthority: false,
    taskApprovalEffect: "none",
    permissionEffect: "none",
  };
}

function main() {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const requireArgument = process.argv.find((argument) => argument.startsWith("--require-review="));
  const requireReviewId = requireArgument ? requireArgument.slice("--require-review=".length) : null;
  const result = verifySuccessorControlReviews({ repoRoot, requireReviewId });
  console.log(JSON.stringify({
    suite: "P0 successor control-review trust",
    passed: result.ok,
    state: result.state,
    namedChecks: {
      immutableHistory: sha256(canonicalJson(result.reviews)),
      failClosedFindings: sha256(canonicalJson(result.findings)),
      nonAuthorizingEffect: sha256(canonicalJson({
        runtimeAuthority: result.runtimeAuthority,
        taskApprovalEffect: result.taskApprovalEffect,
        permissionEffect: result.permissionEffect,
      })),
    },
    reviewCount: result.reviews.length,
    findingCount: result.findings.length,
    findings: result.findings,
    runtimeAuthority: result.runtimeAuthority,
    taskApprovalEffect: result.taskApprovalEffect,
    permissionEffect: result.permissionEffect,
  }, null, 2));
  if (!result.ok) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
