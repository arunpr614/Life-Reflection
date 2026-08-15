import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  CANONICAL_ORIGIN_URL,
  verifyExactMainPreflight,
} from "./P0-exact-main.mjs";
import { issueStateFor, statusLabelFor } from "./P0-github-projection-model.mjs";
import { assertDuplicateKeyRejection, parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";
import {
  loadCommittedFreezeSnapshot,
  loadSourceFromWorkingTree,
  verifyFrozenScope,
  verifySanitizedIssueProjectAdapter,
} from "./P0-verify-r1-r10-freeze.mjs";

const repoRoot = path.resolve(import.meta.dirname, "..");
const repo = "arunpr614/Life-Reflection";
const repoUrl = `https://github.com/${repo}`;
const projectOwner = "arunpr614";
const projectNumber = 1;
const projectUrl = `https://github.com/users/${projectOwner}/projects/${projectNumber}`;
const canonicalViewFilter = `repo:${repo} is:issue label:phase1`;
const manifestPath = path.join(repoRoot, "docs/project/PHASE1-ROADMAP-MANIFEST.json");
const issueMapPath = path.join(repoRoot, "docs/project/PHASE1-GITHUB-ISSUES.json");

function readProjectionSourceSnapshot() {
  const issueMapPresent = fs.existsSync(issueMapPath);
  return Object.freeze({
    manifestBytes: fs.readFileSync(manifestPath, "utf8"),
    issueMapPresent,
    issueMapBytes: issueMapPresent ? fs.readFileSync(issueMapPath, "utf8") : null,
  });
}

function createProjectionSourceGuard({ expectedSnapshot, readSnapshot = readProjectionSourceSnapshot } = {}) {
  if (!expectedSnapshot || typeof readSnapshot !== "function") {
    throw new Error("P0_CONTROL_SNAPSHOT_DRIFT: projection source guard is not configured");
  }
  return (boundary) => {
    const currentSnapshot = readSnapshot(boundary);
    if (currentSnapshot?.manifestBytes !== expectedSnapshot.manifestBytes
      || currentSnapshot?.issueMapPresent !== expectedSnapshot.issueMapPresent
      || currentSnapshot?.issueMapBytes !== expectedSnapshot.issueMapBytes) {
      throw new Error(`P0_CONTROL_SNAPSHOT_DRIFT at ${boundary}: manifest or issue-map bytes changed during structural validation/projection`);
    }
    return Object.freeze({
      boundary,
      manifestSha256: crypto.createHash("sha256").update(expectedSnapshot.manifestBytes).digest("hex"),
      issueMapSha256: expectedSnapshot.issueMapPresent
        ? crypto.createHash("sha256").update(expectedSnapshot.issueMapBytes).digest("hex")
        : null,
    });
  };
}

const projectionSourceSnapshot = readProjectionSourceSnapshot();
const projectionSourceGuard = createProjectionSourceGuard({ expectedSnapshot: projectionSourceSnapshot });
const manifestBytes = projectionSourceSnapshot.manifestBytes;
assertDuplicateKeyRejection();
const manifest = parseJsonWithoutDuplicateKeys(manifestBytes, "docs/project/PHASE1-ROADMAP-MANIFEST.json");
let existingIssueMapDocument = null;
const issueMapBytes = projectionSourceSnapshot.issueMapBytes;
if (projectionSourceSnapshot.issueMapPresent) {
  existingIssueMapDocument = parseJsonWithoutDuplicateKeys(issueMapBytes, "docs/project/PHASE1-GITHUB-ISSUES.json");
}
const issueMap = existingIssueMapDocument?.issues ?? {};

const args = new Set(process.argv.slice(2));
const supportedArgs = new Set([
  "--apply",
  "--freeze-adapter",
  "--help",
  "--issues-only",
  "--project-only",
  "--self-test",
  "--verify",
]);
const unknownArgs = [...args].filter((arg) => !supportedArgs.has(arg));
if (unknownArgs.length) throw new Error(`Unknown argument(s): ${unknownArgs.join(", ")}`);

const apply = args.has("--apply");
const freezeAdapter = args.has("--freeze-adapter");
const issuesOnly = args.has("--issues-only");
const projectOnly = args.has("--project-only");
const selfTest = args.has("--self-test");
const verify = args.has("--verify");

if (args.has("--help")) {
  console.log(`Usage: node tools/sync_phase1_github.mjs [options]

Dry-run is the default and makes no GitHub or local-file changes.

Options:
  --apply          From clean exact origin/main, apply only preflighted body/field deltas to existing issues/items.
  --freeze-adapter Emit the sanitized exact-50 local projection used by the freeze gate; no network or writes.
  --project-only   Require the 58 issues to exist; update only Project V2.
  --issues-only    Update only existing issue bodies; static metadata must already match.
  --self-test      Exercise the mutation allowlist without network access.
  --verify         Read-only live parity check; makes no GitHub or local-file changes.
  --help           Show this help.
`);
  process.exit(0);
}

if (projectOnly && issuesOnly) throw new Error("--project-only and --issues-only are mutually exclusive");
if (verify && apply) throw new Error("--verify is read-only and cannot be combined with --apply");
if (verify && (projectOnly || issuesOnly)) {
  throw new Error("--verify cannot be combined with mutation-selection options");
}
if (selfTest && args.size !== 1) throw new Error("--self-test cannot be combined with another option");
if (freezeAdapter && args.size !== 1) throw new Error("--freeze-adapter cannot be combined with another option");

function runStructuralValidation(snapshotGuard) {
  snapshotGuard("pre-structural-validation");
  const result = spawnSync(process.execPath, ["tools/P0-validate-execution-controls.mjs"], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  snapshotGuard("post-structural-validation");
  return Object.freeze({
    passed: result.status === 0,
    exitCode: Number.isInteger(result.status) ? result.status : 1,
  });
}

// The isolated mutation self-test supplies a known passing structural oracle;
// every real dry-run, verify, or apply evaluates the repository validator first.
const structuralValidation = selfTest
  ? Object.freeze({ passed: true, exitCode: 0 })
  : runStructuralValidation(projectionSourceGuard);

function runGh(ghArgs, { input, allowFailure = false } = {}) {
  const result = spawnSync("gh", ghArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    input,
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0 && !allowFailure) {
    const command = ghArgs[0] === "api" && ghArgs.includes("graphql")
      ? "gh api graphql"
      : `gh ${ghArgs.join(" ")}`;
    throw new Error(`${command} failed (${result.status}): ${result.stderr.trim()}`);
  }
  return {
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function assertSnapshotBytes(label, loadedBytes, committedBytes) {
  if (typeof loadedBytes !== "string" || loadedBytes !== committedBytes) {
    throw new Error(`${label} in-memory snapshot does not match the verified source revision`);
  }
}

function gitTextAtRevision(revision, relativePath) {
  const result = spawnSync("git", ["show", `${revision}:${relativePath}`], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Unable to read ${relativePath} from verified revision ${revision}: ${result.stderr.trim()}`);
  }
  return result.stdout;
}

function assertLoadedControlSnapshot(revision) {
  assertSnapshotBytes(
    "Roadmap manifest",
    manifestBytes,
    gitTextAtRevision(revision, "docs/project/PHASE1-ROADMAP-MANIFEST.json"),
  );
  assertSnapshotBytes(
    "Issue map",
    issueMapBytes,
    gitTextAtRevision(revision, "docs/project/PHASE1-GITHUB-ISSUES.json"),
  );
}

function runGitSourceGuard(gitArgs) {
  const result = spawnSync("git", gitArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  return {
    ok: result.status === 0,
    stdout: result.stdout,
    stderr: result.stderr,
    status: result.status,
  };
}

function oneLine(value) {
  return typeof value === "string" ? value.trim() : "";
}

function probeSourceMain() {
  const originBefore = runGitSourceGuard(["remote", "get-url", "origin"]);
  const fetch = runGitSourceGuard([
    "fetch",
    "--quiet",
    "--no-tags",
    "--prune",
    CANONICAL_ORIGIN_URL,
    "+refs/heads/main:refs/remotes/origin/main",
  ]);
  const branch = runGitSourceGuard(["symbolic-ref", "--quiet", "--short", "HEAD"]);
  const upstream = runGitSourceGuard([
    "rev-parse",
    "--abbrev-ref",
    "--symbolic-full-name",
    "@{upstream}",
  ]);
  const head = runGitSourceGuard(["rev-parse", "--verify", "HEAD^{commit}"]);
  const originMain = runGitSourceGuard([
    "rev-parse",
    "--verify",
    "refs/remotes/origin/main^{commit}",
  ]);
  const status = runGitSourceGuard(["status", "--porcelain=v1", "--untracked-files=all"]);
  const originAfter = runGitSourceGuard(["remote", "get-url", "origin"]);
  return {
    originBeforeOk: originBefore.ok,
    originBeforeUrl: oneLine(originBefore.stdout),
    originAfterOk: originAfter.ok,
    originAfterUrl: oneLine(originAfter.stdout),
    fetchOk: fetch.ok,
    branchOk: branch.ok,
    branch: oneLine(branch.stdout),
    upstreamOk: upstream.ok,
    upstream: oneLine(upstream.stdout),
    statusOk: status.ok,
    status: status.stdout,
    headOk: head.ok,
    head: oneLine(head.stdout),
    originMainOk: originMain.ok,
    originMain: oneLine(originMain.stdout),
  };
}

function assertSourceMainFacts(expectedRevision, boundary, facts) {
  const exactRevision = /^[0-9a-f]{40}$/;
  if (!facts
    || facts.originBeforeOk !== true
    || facts.originBeforeUrl !== CANONICAL_ORIGIN_URL
    || facts.originAfterOk !== true
    || facts.originAfterUrl !== CANONICAL_ORIGIN_URL
    || facts.fetchOk !== true
    || facts.branchOk !== true
    || typeof facts.branch !== "string"
    || facts.branch.length === 0
    || facts.upstreamOk !== true
    || facts.upstream !== "origin/main"
    || facts.statusOk !== true
    || facts.status !== ""
    || facts.headOk !== true
    || facts.originMainOk !== true
    || !exactRevision.test(facts.head ?? "")
    || !exactRevision.test(facts.originMain ?? "")
    || facts.head !== expectedRevision
    || facts.originMain !== expectedRevision) {
    throw new Error(`SOURCE_MAIN_GUARD_FAILED at ${boundary}: canonical origin/main moved or the exact tracking checkout became dirty/drifted`);
  }
}

function createSourceMainGuard({
  expectedRevision,
  probe = probeSourceMain,
  verifySnapshot = assertLoadedControlSnapshot,
} = {}) {
  if (!/^[0-9a-f]{40}$/.test(expectedRevision ?? "")) {
    throw new Error("SOURCE_MAIN_GUARD_FAILED: expected source revision is invalid");
  }
  return (boundary) => {
    const facts = probe({ boundary, expectedRevision });
    assertSourceMainFacts(expectedRevision, boundary, facts);
    verifySnapshot(expectedRevision);
    return { boundary, revision: expectedRevision };
  };
}

function createTargetMutationGuard(sourceMainGuard) {
  if (typeof sourceMainGuard !== "function") {
    throw new Error("SOURCE_MAIN_GUARD_FAILED: target mutation guard requires a source-main guard");
  }
  let mutationTargetCount = 0;
  return (boundary) => {
    if (mutationTargetCount === 0) sourceMainGuard("pre-first-mutation");
    sourceMainGuard(boundary);
    mutationTargetCount += 1;
  };
}

function assertAllowedRestMutation(method, endpoint, payload) {
  const issueBodyEndpoint = new RegExp(`^repos/${repo.replace("/", "\\/")}/issues/[0-9]+$`);
  const payloadKeys = payload && typeof payload === "object" && !Array.isArray(payload)
    ? Object.keys(payload)
    : [];
  if (method !== "PATCH"
    || !issueBodyEndpoint.test(endpoint)
    || payloadKeys.length !== 1
    || payloadKeys[0] !== "body"
    || typeof payload.body !== "string") {
    throw new Error("REST mutation rejected: only an existing issue body PATCH is authorized");
  }
}

function assertAllowedGraphqlMutation(query) {
  if (!/\bmutation\b/.test(query)) return;
  const operations = [...query.matchAll(/\b([A-Za-z][A-Za-z0-9]*)\s*\(\s*input\s*:/g)]
    .map((match) => match[1]);
  const allowed = new Set(["updateProjectV2ItemFieldValue", "clearProjectV2ItemFieldValue"]);
  if (operations.length === 0 || operations.some((operation) => !allowed.has(operation))) {
    throw new Error("GraphQL mutation rejected: only existing Project item field-value updates are authorized");
  }
}

function api(method, endpoint, payload, { headers = [] } = {}) {
  if (["POST", "PATCH", "PUT", "DELETE"].includes(method)) {
    assertAllowedRestMutation(method, endpoint, payload);
  }
  const ghArgs = ["api", "--method", method];
  for (const header of headers) ghArgs.push("-H", header);
  ghArgs.push(endpoint);
  if (payload !== undefined) ghArgs.push("--input", "-");
  const result = runGh(ghArgs, {
    input: payload === undefined ? undefined : JSON.stringify(payload),
  });
  return result.stdout ? parseJsonWithoutDuplicateKeys(result.stdout, `GitHub ${method} ${endpoint} response`) : null;
}

function apiPaginated(endpoint) {
  const result = runGh(["api", "--paginate", "--slurp", endpoint]);
  if (!result.stdout) return [];
  const pages = parseJsonWithoutDuplicateKeys(result.stdout, `GitHub paginated ${endpoint} response`);
  return pages.flatMap((page) => Array.isArray(page) ? page : [page]);
}

function graphql(query, variables = {}) {
  assertAllowedGraphqlMutation(query);
  const result = runGh(["api", "graphql", "--input", "-"], {
    input: JSON.stringify({ query, variables }),
  });
  const response = parseJsonWithoutDuplicateKeys(result.stdout, "GitHub GraphQL response");
  if (response.errors?.length) {
    throw new Error(`GitHub GraphQL error: ${response.errors.map((error) => error.message).join("; ")}`);
  }
  return response.data;
}

function slug(value) {
  return value.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-");
}

const labels = [
  { name: "phase1", color: "0E8A16", description: "Life in Days Phase 1 delivery plan" },
  { name: "roadmap", color: "1D76DB", description: "Tracked in the Life Reflection roadmap" },
  { name: "status:backlog", color: "C5DEF5", description: "Scoped but not selected for immediate execution" },
  { name: "status:next", color: "2563EB", description: "Expected after the named dependency or gate" },
  { name: "status:in-progress", color: "F9D0C4", description: "Active work; exit evidence remains incomplete" },
  { name: "status:done", color: "0E8A16", description: "The task-specific named evidence exists" },
  { name: "priority:high", color: "B60205", description: "High delivery priority" },
  { name: "priority:medium", color: "FBCA04", description: "Medium delivery priority" },
  { name: "priority:low", color: "C2E0C6", description: "Low delivery priority" },
  ...["Audit", "Planning", "Spike", "Product definition", "Design", "Architecture", "Implementation", "Evaluation", "Quality", "Release acceptance"].map((type) => ({
    name: `type:${slug(type)}`,
    color: {
      Audit: "5319E7",
      Planning: "6F42C1",
      Spike: "D4C5F9",
      "Product definition": "0052CC",
      Design: "E99695",
      Architecture: "006B75",
      Implementation: "0E8A16",
      Evaluation: "FBCA04",
      Quality: "BFD4F2",
      "Release acceptance": "B60205",
    }[type],
    description: `${type} work package`,
  })),
];

const projectFieldSpecs = [
  {
    name: "Status",
    dataType: "SINGLE_SELECT",
    options: [
      { name: "Backlog", color: "GRAY", description: "Scoped but not selected for immediate execution" },
      { name: "Next", color: "BLUE", description: "Expected after the named dependency or gate" },
      { name: "In progress", color: "YELLOW", description: "Active work; exit evidence remains incomplete" },
      { name: "Done", color: "GREEN", description: "The task-specific named evidence exists" },
    ],
  },
  { name: "Start date", dataType: "DATE" },
  { name: "Target date", dataType: "DATE" },
  {
    name: "Priority",
    dataType: "SINGLE_SELECT",
    options: [
      { name: "High", color: "RED", description: "High delivery priority" },
      { name: "Medium", color: "YELLOW", description: "Medium delivery priority" },
      { name: "Low", color: "GREEN", description: "Low delivery priority" },
    ],
  },
  { name: "PRD / PID", dataType: "TEXT" },
  { name: "Design artifact", dataType: "TEXT" },
  { name: "Architecture plan", dataType: "TEXT" },
  { name: "QA plan", dataType: "TEXT" },
  { name: "Delivery control", dataType: "TEXT" },
  { name: "Council decision", dataType: "TEXT" },
  { name: "Task dossier", dataType: "TEXT" },
  { name: "Artifact readiness", dataType: "TEXT" },
  { name: "Execution scope", dataType: "TEXT" },
  { name: "Requirement IDs", dataType: "TEXT" },
  { name: "Evidence", dataType: "TEXT" },
  { name: "Owner role", dataType: "TEXT" },
  { name: "Task summary", dataType: "TEXT" },
];
const immutableProjectValueFields = new Set(["Status"]);
const projectTextValueLimit = 1000;

const savedViewSpecs = [
  {
    name: "Phase 1 Status",
    layout: "BOARD_LAYOUT",
    purpose: "Board view with all Phase 1 planning fields; select Status columns in the UI",
    visibleFieldNames: [
      "Status",
      "Milestone",
      "Priority",
      "Start date",
      "Target date",
      "Owner role",
      "PRD / PID",
      "Design artifact",
      "Architecture plan",
      "QA plan",
      "Delivery control",
      "Council decision",
      "Task dossier",
      "Artifact readiness",
      "Execution scope",
      "Requirement IDs",
      "Evidence",
      "Task summary",
    ],
  },
  {
    name: "Phase 1 Roadmap",
    layout: "ROADMAP_LAYOUT",
    purpose: "Roadmap view; select Start date, Target date, and Milestone grouping in the UI",
  },
];

function priorityLabel(priority) {
  return `priority:${priority.toLowerCase()}`;
}

function typeLabel(taskType) {
  return `type:${slug(taskType)}`;
}

const missingValueCopy = "Not yet recorded";
const fullRevisionPattern = /^[0-9a-f]{40}$/;
const dossierDigestPattern = /^sha256:[0-9a-f]{64}$/;
const rawSha256Pattern = /^[0-9a-f]{64}$/;
const authorityIdPattern = /^P0-AUTH-[A-Z0-9-]{4,}$/;
const opaqueEvidencePattern = /^[a-z][a-z0-9-]*:[A-Za-z0-9._/-]{4,}$/;
const privateAuthorityKeys = Object.freeze([
  "authorityId", "taskId", "scopeClass", "allowedActionClass", "verifierId", "verifierRole",
  "windowStart", "windowEnd", "result", "ownerActionId", "accountableHumanId",
  "accountableHumanRole", "ownerAttestationReference", "evidenceReference", "candidateRevision",
  "dossierDigest",
]);

function isPlainRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactKeys(value, expectedKeys) {
  return isPlainRecord(value)
    && Object.keys(value).length === expectedKeys.length
    && expectedKeys.every((key) => Object.hasOwn(value, key));
}

function isNonblankString(value) {
  return typeof value === "string" && value.length > 0 && value === value.trim();
}

function normalizedRevision(value) {
  return typeof value === "string" && fullRevisionPattern.test(value) ? value : missingValueCopy;
}

function normalizedDossierDigest(value) {
  return typeof value === "string" && dossierDigestPattern.test(value) ? value : missingValueCopy;
}

function normalizedRawSha256(value) {
  return typeof value === "string" && rawSha256Pattern.test(value) ? value : missingValueCopy;
}

function isOpaqueEvidenceReference(value) {
  return isNonblankString(value)
    && opaqueEvidencePattern.test(value)
    && !value.includes("://")
    && !/(?:pending|unknown|tbd|placeholder)/i.test(value);
}

function isPublicReferenceUrl(value) {
  if (!isNonblankString(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:"
      && parsed.hostname.length > 0
      && parsed.username.length === 0
      && parsed.password.length === 0;
  } catch {
    return false;
  }
}

function isRepositoryRelativePath(value) {
  if (!isNonblankString(value) || path.posix.isAbsolute(value) || value.includes("\\") || value.includes("\0")) return false;
  return !value.split("/").some((segment) => segment === ".." || segment.length === 0);
}

function normalizedReferencePairs(paths, urls) {
  if (!Array.isArray(paths) || !Array.isArray(urls) || paths.length === 0 || paths.length !== urls.length) return null;
  const pairs = paths.map((referencePath, index) => ({ path: referencePath, url: urls[index] }));
  return pairs.every((reference) => isRepositoryRelativePath(reference.path) && isPublicReferenceUrl(reference.url))
    ? pairs
    : null;
}

function normalizedEvidenceReferencePairs(task) {
  return normalizedReferencePairs(task?.evidenceReferencePaths, task?.evidenceReferenceUrls);
}

function normalizedPublicReference(value) {
  return isPublicReferenceUrl(value) ? value : missingValueCopy;
}

function mdLink(label, url) {
  return isNonblankString(label) && isPublicReferenceUrl(url)
    ? `[${label}](${url})`
    : missingValueCopy;
}

function normalizedPrivateAuthority(task) {
  const dossier = isPlainRecord(task?.taskDossier) ? task.taskDossier : {};
  const authority = dossier.privateAuthority;
  const requestedScope = isPlainRecord(dossier.requestedScope) ? dossier.requestedScope : {};
  const candidateRevision = normalizedRevision(dossier.candidate?.revision);
  const dossierDigest = normalizedDossierDigest(dossier.candidate?.dossierDigest);
  const windowStart = Date.parse(authority?.windowStart ?? "");
  const windowEnd = Date.parse(authority?.windowEnd ?? "");
  const complete = hasExactKeys(authority, privateAuthorityKeys)
    && authorityIdPattern.test(authority.authorityId)
    && authority.taskId === task.id
    && authority.scopeClass === requestedScope.scopeClass
    && authority.allowedActionClass === requestedScope.actionClass
    && isNonblankString(authority.verifierId)
    && ["project", "qa", "architecture"].includes(authority.verifierRole)
    && Number.isFinite(windowStart)
    && Number.isFinite(windowEnd)
    && windowStart < windowEnd
    && authority.result === "pass"
    && authority.ownerActionId === "P0-OA-001"
    && isNonblankString(authority.accountableHumanId)
    && authority.accountableHumanRole === "owner-authority"
    && isOpaqueEvidenceReference(authority.ownerAttestationReference)
    && isOpaqueEvidenceReference(authority.evidenceReference)
    && candidateRevision !== missingValueCopy
    && dossierDigest !== missingValueCopy
    && authority.candidateRevision === candidateRevision
    && authority.dossierDigest === dossierDigest;
  return complete
    ? `\`${authority.authorityId}\` / ${authority.result} / ${authority.evidenceReference}`
    : missingValueCopy;
}

function roadmapStatusProjection(status) {
  return status === "Done" ? "Planning Done — historical" : status;
}

const taskSummaryBlockerPreviewLimit = 8;

function controlValidationLabel(passed) {
  return passed === true ? "Passed" : "Failed";
}

function projectEvidence(task) {
  const dossier = isPlainRecord(task.taskDossier) ? task.taskDossier : {};
  const evidenceReferencePairs = normalizedEvidenceReferencePairs(task);
  const evidenceReferences = evidenceReferencePairs
    ? `${evidenceReferencePairs.length} linked in the issue/dossier`
    : missingValueCopy;
  const candidateRevision = normalizedRevision(dossier.candidate?.revision);
  const dossierDigest = normalizedDossierDigest(dossier.candidate?.dossierDigest);
  return [
    `Control validation: ${controlValidationLabel(structuralValidation.passed)}`,
    `Candidate revision: ${candidateRevision}`,
    `Dossier digest: ${dossierDigest}`,
    `Required evidence: ${task.acceptanceEvidence}`,
    `References: ${evidenceReferences}`,
    "Remaining limitation: planning, prototype, CI, or status alone does not prove implementation, deployment, restore, or release.",
  ].join("\n");
}

function projectTaskSummary(task) {
  const dossier = task.taskDossier;
  const blockerCodes = [...new Set(dossier.blockers.map((blocker) => blocker.code))].sort();
  const blockerPreview = blockerCodes.slice(0, taskSummaryBlockerPreviewLimit);
  const blockerRemainder = blockerCodes.length - blockerPreview.length;
  const blockerLine = `Blockers: ${blockerCodes.length}; preview: ${blockerPreview.length ? blockerPreview.join(", ") : "None"}${blockerRemainder > 0 ? `; plus ${blockerRemainder} more in the linked issue/dossier` : ""}`;
  return [
    `Roadmap status: ${roadmapStatusProjection(task.status)}`,
    task.description,
    blockerLine,
    `Next action: ${dossier.nextAction ?? "Run exact-main activation verification."}`,
  ].join("\n");
}

function issueBody(task, issueNumbers) {
  const requirements = task.requirementIds.length
    ? task.requirementIds.map((id) => `\`${id}\``).join(", ")
    : "Planning-only; no product behavior requirement.";
  const dependencies = task.dependencies.length
    ? task.dependencies.map((id) => issueNumbers[id] ? `#${issueNumbers[id]} (\`${id}\`)` : `\`${id}\``).join(", ")
    : "None";
  const designReferencePairs = normalizedReferencePairs(task.designArtifactPaths, task.designArtifactUrls);
  const designLinks = designReferencePairs
    ? designReferencePairs.map((reference) => mdLink(reference.path, reference.url)).join("\n- ")
    : missingValueCopy;
  const start = task.startDate ?? "Blank — trigger-gated";
  const target = task.targetDate ?? "Blank — trigger-gated";
  const evidenceReferencePairs = normalizedEvidenceReferencePairs(task);
  const evidenceReferences = evidenceReferencePairs
    ? evidenceReferencePairs
      .map((reference) => `- ${mdLink(reference.path, reference.url)}`)
      .join("\n")
    : `- ${missingValueCopy}; the acceptance text below describes what must exist.`;
  const dossier = task.taskDossier;
  const artifactLabels = { product: "Product", architecture: "Architecture", design: "Design", qa: "QA", delivery: "Delivery", council: "Council" };
  const artifactRows = Object.entries(dossier.artifacts)
    .map(([kind, artifact]) => {
      const review = dossier.artifactReviews[kind];
      const reviewedRevision = normalizedRevision(review?.reviewedRevision);
      const reviewer = isNonblankString(review?.reviewerId)
        && isNonblankString(review?.reviewerRole)
        && reviewedRevision !== missingValueCopy
        ? `${review.reviewerId} (${review.reviewerRole}) at \`${reviewedRevision.slice(0, 12)}…\``
        : missingValueCopy;
      const artifactSha256 = normalizedRawSha256(artifact?.sha256);
      const artifactDigest = artifactSha256 === missingValueCopy
        ? missingValueCopy
        : `\`${artifactSha256.slice(0, 16)}…\``;
      return `| ${artifactLabels[kind]} | \`${artifact.state}\` | \`${review.decision}\` | ${reviewer} | ${mdLink(artifact.path, artifact.url)} | ${artifactDigest} |`;
    })
    .join("\n");
  const seatLabels = { product: "Product Manager", design: "UI/UX Designer", architecture: "Technical Architect", qa: "Independent QA", project: "Project Manager" };
  const seatRows = Object.entries(dossier.council.seatVerdicts)
    .map(([seat, record]) => `| ${seatLabels[seat]} | \`${record.verdict}\` | ${isNonblankString(record.reviewerId) ? record.reviewerId : missingValueCopy} | ${record.rationale} |`)
    .join("\n");
  const designStateCoverage = Object.entries(dossier.designCoverage.stateCoverage)
    .map(([dimension, scenarioIds]) => `${dimension}: ${scenarioIds.length ? scenarioIds.map((id) => `\`${id}\``).join(", ") : "not yet mapped"}`)
    .join("; ");
  const designAccessibilityCoverage = Object.entries(dossier.designCoverage.accessibilityCoverage)
    .map(([dimension, scenarioIds]) => `${dimension}: ${scenarioIds.length ? scenarioIds.map((id) => `\`${id}\``).join(", ") : "not yet mapped"}`)
    .join("; ");
  const ownerActionIds = dossier.ownerActionControl.requirements.map((entry) => entry.actionId);
  const ownerActions = ownerActionIds.length
    ? ownerActionIds.map((id) => `\`${id}\``).join(", ")
    : "None currently mapped";
  const openDecisions = dossier.openDecisions.length
    ? dossier.openDecisions.map((decision) => `- ${decision}`).join("\n")
    : "- None";
  const blockers = dossier.council.unresolvedBlockers.length
    ? dossier.council.unresolvedBlockers.map((blocker) => `- ${blocker}`).join("\n")
    : "- None";
  const derivedBlockerCodes = dossier.blockers.length
    ? [...new Set(dossier.blockers.map((blocker) => blocker.code))].map((code) => `\`${code}\``).join(", ")
    : "None";
  const privateAuthority = normalizedPrivateAuthority(task);

  return `<!-- phase1-roadmap-id: ${task.id} -->
## Outcome

${task.description}

## Planning metadata

| Field | Value |
| --- | --- |
| Stable task ID | \`${task.id}\` |
| Roadmap status | **${roadmapStatusProjection(task.status)}** |
| Milestone | **${task.milestone}** |
| Task type | ${task.taskType} |
| Owner role | ${task.ownerRole} |
| Priority | ${task.priority} |
| Proposed start | ${start} |
| Proposed target | ${target} |
| Date basis | ${task.dateBasis} |
| Artifact readiness | **${task.artifactReadiness}** |
| Execution allowed | **${task.executionAllowed ? "Yes" : "No"}** |
| Execution scope | \`${task.executionScope}\` |

## Traceability

- **Requirement IDs:** ${requirements}
- **Dependencies:** ${dependencies}
- **Dependency semantics:** Progressive handoff is allowed, but this task cannot close or cross its evidence/release gate before prerequisite evidence exists.
- **Parent PRD / PID:** ${mdLink(task.prdPidPath, task.prdPidUrl)}
- **Shared design inputs:** ${designLinks}
- **Global architecture input:** ${mdLink(task.architecturePath, task.architectureUrl)}
- **Canonical manifest:** ${mdLink("docs/project/PHASE1-ROADMAP-MANIFEST.json", `${repoUrl}/blob/main/docs/project/PHASE1-ROADMAP-MANIFEST.json`)}

## Task-bound Definition of Ready

| Discipline | Effective state | Review decision | Named exact-revision reviewer | Task artifact | SHA-256 prefix |
| --- | --- | --- | --- | --- | --- |
${artifactRows}

- **Council verdict:** \`${dossier.council.verdict}\`
- **Council decision:** ${mdLink(dossier.council.decisionPath, dossier.council.decisionUrl)}
- **Reviewed revision:** ${normalizedRevision(dossier.council.reviewedRevision) === missingValueCopy ? missingValueCopy : `\`${normalizedRevision(dossier.council.reviewedRevision)}\``}
- **Dossier digest:** ${normalizedDossierDigest(dossier.candidate.dossierDigest) === missingValueCopy ? missingValueCopy : `\`${normalizedDossierDigest(dossier.candidate.dossierDigest)}\``}
- **Dependency entry evidence satisfied (derived):** ${dossier.dependencyControl.satisfied ? "Yes" : "No"}
- **Private authority required (derived):** ${dossier.privateAuthorityRequired ? "Yes" : "No"}
- **Structured private authority:** ${privateAuthority}
- **Relevant owner actions (due only at their named gate):** ${ownerActions}
- **Currently due owner action IDs:** ${dossier.ownerActionControl.dueActionIds.length ? dossier.ownerActionControl.dueActionIds.map((id) => `\`${id}\``).join(", ") : "None"}
- **Currently due owner actions satisfied (derived):** ${dossier.ownerActionControl.allDueSatisfied ? "Yes" : "No"}
- **Acceptance scenario IDs:** ${dossier.acceptanceScenarioIds.map((id) => `\`${id}\``).join(", ")}

### Five-seat council record

| Seat | Verdict | Named reviewer | Rationale |
| --- | --- | --- | --- |
${seatRows}

### Structured Design assurance

- **Applicability:** \`${dossier.designCoverage.applicability}\`
- **Journeys:** ${dossier.designCoverage.journeyIds.length ? dossier.designCoverage.journeyIds.map((id) => `\`${id}\``).join(", ") : "Not yet mapped"}
- **State coverage:** ${designStateCoverage}
- **Accessibility coverage:** ${designAccessibilityCoverage}
- **Not-applicable rationale:** ${dossier.designCoverage.notApplicableRationale ?? "None recorded"}

### Open decisions

${openDecisions}

### Council blockers

${blockers}

### Derived fail-closed control result

- **Failed gate codes:** ${derivedBlockerCodes}
- **Next corrective action:** ${dossier.nextAction ?? "None — exact-main runtime verification is still required before start."}

The roadmap status is not a readiness override. Substantive execution remains blocked unless \`executionAllowed=true\` for the exact reviewed revision and artifact hashes.

## Acceptance evidence required

${task.acceptanceEvidence}

## Evidence references

${evidenceReferences}

Evidence links establish only the bounded claim recorded by the source. A planning document or prototype is not implementation, deployment, restore, or release evidence.

## Rollback / restore impact

${task.rollbackRestoreImpact}

## Status evidence boundary

${task.doneMeaning}

---

Managed from the Phase 1 roadmap manifest. Update the manifest and synchronize this issue rather than changing planning metadata in only one place.
`;
}

function projectValues(task) {
  const taskDossierUrls = Object.values(task.taskDossier.artifacts).map((artifact) => artifact?.url);
  const taskDossierReference = taskDossierUrls.length > 0 && taskDossierUrls.every(isPublicReferenceUrl)
    ? taskDossierUrls.join("\n")
    : missingValueCopy;
  return {
    "Status": task.status,
    "Start date": task.startDate,
    "Target date": task.targetDate,
    "Priority": task.priority,
    "PRD / PID": normalizedPublicReference(task.taskPrdUrl),
    "Design artifact": normalizedPublicReference(task.taskDesignUrl),
    "Architecture plan": normalizedPublicReference(task.taskArchitectureUrl),
    "QA plan": normalizedPublicReference(task.taskQaUrl),
    "Delivery control": normalizedPublicReference(task.taskDeliveryUrl),
    "Council decision": normalizedPublicReference(task.taskCouncilUrl),
    "Task dossier": taskDossierReference,
    "Artifact readiness": task.artifactReadiness,
    "Execution scope": `Execution allowed: ${task.executionAllowed ? "Yes" : "No"}\nScope: ${task.executionScope}`,
    "Requirement IDs": task.requirementIds.length ? task.requirementIds.join(", ") : "Planning-only",
    "Evidence": projectEvidence(task),
    "Owner role": task.ownerRole,
    "Task summary": projectTaskSummary(task),
  };
}

const frozenTaskIdPattern = /^.+-R(?:[1-9]|10)-\d{3}$/;

function freezeMilestone(task) {
  const release = manifest.releases.find((candidate) => candidate.id === task.milestone);
  if (!release) throw new Error(`${task.id}: release milestone is missing from the manifest`);
  return {
    title: release.id,
    dueOn: release.targetDate ? `${release.targetDate}T00:00:00Z` : null,
    description: `${release.name}. ${release.outcome}\n\nProposed planning estimate; evidence gates control entry and exit.`,
  };
}

function lowerInitial(value) {
  return `${value.slice(0, 1).toLowerCase()}${value.slice(1)}`;
}

function expectedTaskLabels(task) {
  return sortedStrings([
    "phase1",
    "roadmap",
    statusLabelFor(task.status),
    priorityLabel(task.priority),
    typeLabel(task.taskType),
  ]);
}

function deriveSanitizedFreezeAdapter({ issueNumbers, issueById = null, itemByTask = null }) {
  if (!issueNumbers || typeof issueNumbers !== "object") {
    throw new Error("P0_R1_R10_FREEZE_FAILED: exact issue-number projection is required");
  }
  const frozenTasks = manifest.tasks.filter((task) => frozenTaskIdPattern.test(task.id));
  if (frozenTasks.length !== 50) {
    throw new Error(`P0_R1_R10_FREEZE_FAILED: expected 50 frozen manifest tasks; found ${frozenTasks.length}`);
  }
  return {
    repository: repo,
    projectNumber,
    tasks: frozenTasks.map((task) => {
      const liveIssue = issueById?.[task.id] ?? null;
      const liveItem = itemByTask?.[task.id] ?? null;
      if ((issueById && !liveIssue) || (itemByTask && !liveItem)) {
        throw new Error(`P0_R1_R10_FREEZE_FAILED: live adapter is missing ${task.id}`);
      }
      const number = liveIssue?.number ?? issueNumbers[task.id];
      const url = liveIssue?.html_url ?? issueMap[task.id]?.url ?? null;
      if (!Number.isInteger(number) || typeof url !== "string") {
        throw new Error(`P0_R1_R10_FREEZE_FAILED: ${task.id} lacks a sanitized issue identity`);
      }
      const body = liveIssue ? String(liveIssue.body ?? "") : issueBody(task, issueNumbers);
      const labels = liveIssue
        ? sortedStrings((liveIssue.labels ?? []).map((label) => typeof label === "string" ? label : label.name))
        : expectedTaskLabels(task);
      const milestone = freezeMilestone(task);
      const issue = {
        number,
        url,
        state: String(liveIssue?.state ?? issueStateFor(task.status)).toUpperCase(),
        title: liveIssue?.title ?? task.issueTitle,
        bodySha256: crypto.createHash("sha256").update(body).digest("hex"),
        bodyByteSize: Buffer.byteLength(body),
        labels,
        milestone: liveIssue ? {
          title: liveIssue.milestone?.title ?? null,
          dueOn: liveIssue.milestone?.due_on ?? null,
          description: liveIssue.milestone?.description ?? null,
        } : milestone,
      };
      const managedValues = Object.fromEntries((liveItem
        ? projectFieldSpecs.map((spec) => [lowerInitial(spec.name), projectItemField(liveItem, spec.name)])
        : Object.entries(projectValues(task)).map(([name, value]) => [lowerInitial(name), value]))
        .filter(([, value]) => value !== null && value !== undefined));
      const projectMilestone = {
        ...(liveIssue ? issue.milestone : milestone),
        dueOn: (liveIssue ? issue.milestone.dueOn : milestone.dueOn) ?? "",
      };
      const projectFields = {
        ...managedValues,
        content: {
          number: liveItem?.content?.number ?? number,
          repository: liveItem?.content?.repository ?? repo,
          title: liveItem?.content?.title ?? issue.title,
          type: liveItem?.content?.type ?? "Issue",
          url: liveItem?.content?.url ?? url,
        },
        labels: liveItem ? sortedStrings(liveItem.labels ?? []) : labels,
        milestone: projectMilestone,
        repository: repoUrl,
        title: liveItem?.content?.title ?? issue.title,
      };
      return { taskId: task.id, issue, projectFields };
    }),
  };
}

function verifyFreezeBoundary(boundary, { projection, live = null }) {
  projectionSourceGuard(`freeze:${boundary}:pre-source`);
  const snapshot = loadCommittedFreezeSnapshot({ repoRoot });
  const source = loadSourceFromWorkingTree({ repoRoot, snapshot });
  const result = verifyFrozenScope({
    snapshot,
    source,
    projection,
    live,
    projectionClaimed: true,
    liveClaimed: live !== null,
  });
  projectionSourceGuard(`freeze:${boundary}:post-source`);
  return result;
}

function assertNoFrozenMutationTargets(issueBodyDeltas, projectFieldDeltas) {
  const frozenIssueTargets = issueBodyDeltas.filter((change) => frozenTaskIdPattern.test(change.taskId));
  const frozenProjectTargets = projectFieldDeltas.filter((change) => frozenTaskIdPattern.test(change.taskId));
  if (frozenIssueTargets.length || frozenProjectTargets.length) {
    const targets = [
      ...frozenIssueTargets.map((change) => `${change.taskId}:issue-body`),
      ...frozenProjectTargets.map((change) => `${change.taskId}:project:${change.fieldName}`),
    ];
    throw new Error(`P0_R1_R10_FREEZE_FAILED: sync may not target frozen fields (${targets.join(", ")})`);
  }
  return true;
}

function validateManifest() {
  if (manifest.tasks.length !== 58) {
    throw new Error(`Expected the canonical 58 tasks; found ${manifest.tasks.length}`);
  }
  const fieldNames = projectFieldSpecs.map((spec) => spec.name);
  if (new Set(fieldNames).size !== fieldNames.length) {
    throw new Error("Project field specifications must have unique names");
  }
  for (const view of savedViewSpecs) {
    if (view.visibleFieldNames?.some((name) => name !== "Milestone" && !fieldNames.includes(name))) {
      throw new Error(`${view.name} references an unmanaged visible field`);
    }
  }
  const ids = new Set();
  for (const task of manifest.tasks) {
    if (ids.has(task.id)) throw new Error(`Duplicate task ID: ${task.id}`);
    ids.add(task.id);
    const values = projectValues(task);
    for (const spec of projectFieldSpecs) {
      if (!(spec.name in values)) throw new Error(`${task.id} has no value for ${spec.name}`);
      if (spec.dataType === "TEXT"
        && (typeof values[spec.name] !== "string" || values[spec.name].length > projectTextValueLimit)) {
        throw new Error(`${task.id} ${spec.name} exceeds the ${projectTextValueLimit}-character public projection limit`);
      }
      if (spec.dataType === "SINGLE_SELECT" && !spec.options.some((option) => option.name === values[spec.name])) {
        throw new Error(`${task.id} uses unsupported ${spec.name} value: ${values[spec.name]}`);
      }
    }
  }
}

if (!selfTest) projectionSourceGuard("pre-projection");
validateManifest();
if (!selfTest && !structuralValidation.passed) {
  throw new Error("P0_CONTROL_VALIDATION_FAILED: structural validation must pass before freeze projection or sync");
}

const plannedIssueNumbers = Object.fromEntries(
  manifest.tasks.map((task) => [task.id, issueMap[task.id]?.number ?? null]),
);
const localFreezeProjection = selfTest
  ? null
  : deriveSanitizedFreezeAdapter({ issueNumbers: plannedIssueNumbers });
const preSyncFreeze = selfTest
  ? null
  : verifyFreezeBoundary("pre-sync", { projection: localFreezeProjection });

if (freezeAdapter) {
  await new Promise((resolve, reject) => {
    process.stdout.write(`${JSON.stringify({
      mode: "freeze-adapter",
      adapter: localFreezeProjection,
      verification: {
        passed: preSyncFreeze.passed,
        frozenTasks: preSyncFreeze.projection.taskCount,
        snapshotSha256: preSyncFreeze.snapshotSha256,
      },
    }, null, 2)}\n`, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
  process.exit(0);
}

const plan = {
  repository: repo,
  project: projectUrl,
  controlValidation: {
    status: structuralValidation.passed ? "Passed" : "Failed",
    exitCode: structuralValidation.exitCode,
  },
  selection: {
    existingIssueBodies: !projectOnly,
    existingProjectItemFields: !issuesOnly,
    projectDefinitions: false,
    views: false,
    issueStatesAndMetadata: false,
  },
  authorization: {
    currentReadGate: "Project query requires read:project",
    smallestReadOnlyRefresh: "gh auth refresh -h github.com -s read:project",
    smallestApplyRefresh: "gh auth refresh -h github.com -s project",
    note: "project includes Project V2 query and mutation access; existing repo scope remains required for private repository issues",
  },
  labels: labels.map((label) => label.name),
  milestones: manifest.releases.map((release) => ({
    title: release.id,
    dueOn: release.targetDate,
    description: `${release.name}. ${release.outcome}`,
  })),
  tasks: manifest.tasks.map((task) => ({
    id: task.id,
    title: task.issueTitle,
    milestone: task.milestone,
    status: task.status,
    startDate: task.startDate,
    targetDate: task.targetDate,
    priority: task.priority,
    body: issueBody(task, plannedIssueNumbers),
    projectValues: projectValues(task),
  })),
  projectSync: {
    items: manifest.tasks.length,
    fields: projectFieldSpecs.map((field) => ({
      name: field.name,
      dataType: field.dataType,
      options: field.options?.map((option) => option.name),
    })),
    fieldWritesPerItem: "Only mismatched values after a complete 58-item preflight",
    views: savedViewSpecs,
    canonicalViewFilter,
    applyBoundary: "Existing-only, delta-only: no issue/item/field/view/workflow creation or reconfiguration; issue state, labels, milestones, and status remain unchanged.",
    uiOnlyAfterSync: [
      "Open Phase 1 Status and select Status as the board's column field.",
      "Open Phase 1 Roadmap and select Start date and Target date as its date fields if GitHub does not auto-select them.",
      "Select Milestone as the roadmap grouping, then choose roadmap zoom/markers and reorder saved views; current GraphQL view inputs do not expose those settings.",
    ],
  },
  finalIssueStates: {
    open: manifest.tasks.filter((task) => task.status !== "Done").length,
    closed: manifest.tasks.filter((task) => task.status === "Done").length,
  },
  frozenScope: {
    passed: preSyncFreeze?.passed ?? null,
    taskCount: preSyncFreeze?.projection?.taskCount ?? null,
    mutationTargets: 0,
  },
};

if (selfTest) {
  console.log(JSON.stringify(runMutationAllowlistSelfTest(), null, 2));
  process.exit(0);
}

if (!apply && !verify) {
  projectionSourceGuard("pre-dry-run-output");
  await new Promise((resolve, reject) => {
    process.stdout.write(`${JSON.stringify({ mode: "dry-run", ...plan }, null, 2)}\n`, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
  process.exit(structuralValidation.passed ? 0 : 1);
}

function loadExistingIssues() {
  const issues = apiPaginated(`repos/${repo}/issues?state=all&per_page=100`)
    .filter((issue) => !issue.pull_request);
  const issueById = {};
  for (const task of manifest.tasks) {
    const mappedNumber = issueMap[task.id]?.number ?? null;
    const marker = `<!-- phase1-roadmap-id: ${task.id} -->`;
    const candidates = issues.filter((issue) =>
      issue.title.startsWith(`[${task.id}]`) ||
      issue.body?.includes(marker) ||
      (mappedNumber !== null && issue.number === mappedNumber));
    if (candidates.length > 1) {
      throw new Error(`${task.id}: multiple issues match title/body-marker/issue-map identity`);
    }
    if (!candidates.length) continue;
    const issue = candidates[0];
    const signals = {
      title: issue.title.startsWith(`[${task.id}]`),
      marker: issue.body?.includes(marker) === true,
      phase1Label: issue.labels.some((label) => (typeof label === "string" ? label : label.name) === "phase1"),
      issueMap: mappedNumber === issue.number && issueMap[task.id]?.url === issue.html_url,
      manifest: manifest.tasks.some((candidate) => candidate.id === task.id),
    };
    const failedSignals = Object.entries(signals).filter(([, passed]) => !passed).map(([name]) => name);
    if (failedSignals.length) {
      throw new Error(`${task.id}: issue identity failed ${failedSignals.join(", ")}`);
    }
    issueById[task.id] = issue;
  }
  return issueById;
}

function requireAllIssues(issueById) {
  const missing = manifest.tasks.filter((task) => !issueById[task.id]).map((task) => task.id);
  if (missing.length) {
    throw new Error(`Project sync requires all 58 repository issues. Missing: ${missing.join(", ")}`);
  }
}

function canonicalIssueSnapshot(issue) {
  return {
    number: issue?.number ?? null,
    url: issue?.html_url ?? null,
    title: issue?.title ?? null,
    body: issue?.body ?? null,
    state: issue?.state ?? null,
    milestone: issue?.milestone?.title ?? null,
    labels: sortedStrings((issue?.labels ?? []).map((label) => typeof label === "string" ? label : label.name)),
  };
}

function assertIssueSnapshotUnchanged(taskId, original, current) {
  if (JSON.stringify(canonicalIssueSnapshot(original)) !== JSON.stringify(canonicalIssueSnapshot(current))) {
    throw new Error(`${taskId}: issue changed after preflight; refusing a stale body write`);
  }
}

function queryProject() {
  const data = graphql(`
    query Phase1Project($login: String!, $number: Int!) {
      user(login: $login) {
        projectV2(number: $number) {
          id
          number
          title
          url
        }
      }
    }
  `, { login: projectOwner, number: projectNumber });
  const project = data.user?.projectV2;
  if (!project) throw new Error(`GitHub Project ${projectOwner}/${projectNumber} was not found or is not visible`);
  if (project.number !== projectNumber || project.url !== projectUrl) {
    throw new Error("Resolved GitHub Project does not match the configured target URL");
  }
  return project;
}

function queryProjectFields(projectId) {
  const fields = [];
  let after = null;
  do {
    const data = graphql(`
      query Phase1ProjectFields($projectId: ID!, $after: String) {
        node(id: $projectId) {
          ... on ProjectV2 {
            fields(first: 100, after: $after) {
              nodes {
                __typename
                ... on ProjectV2FieldCommon {
                  id
                  databaseId
                  name
                  dataType
                }
                ... on ProjectV2SingleSelectField {
                  options {
                    id
                    name
                    color
                    description
                  }
                }
              }
              pageInfo { hasNextPage endCursor }
            }
          }
        }
      }
    `, { projectId, after });
    const connection = data.node?.fields;
    if (!connection) throw new Error("Could not query Project V2 fields");
    fields.push(...connection.nodes);
    after = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
  } while (after);
  return fields;
}

function queryProjectItem(itemId) {
  const data = graphql(`
    query Phase1ProjectItem($itemId: ID!) {
      node(id: $itemId) {
        ... on ProjectV2Item {
          id
          content {
            ... on Issue {
              number
              url
              title
              body
              repository { nameWithOwner }
              milestone { title }
              labels(first: 20) { nodes { name } }
            }
          }
          fieldValues(first: 100) {
            nodes {
              __typename
              ... on ProjectV2ItemFieldTextValue {
                text
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldDateValue {
                date
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                field { ... on ProjectV2FieldCommon { name } }
              }
            }
          }
        }
      }
    }
  `, { itemId });
  const node = data.node;
  if (!node || node.id !== itemId) throw new Error(`Project item ${itemId} disappeared after preflight`);
  const item = {
    id: node.id,
    content: {
      ...node.content,
      repository: node.content?.repository?.nameWithOwner ?? null,
    },
    labels: (node.content?.labels?.nodes ?? []).map((label) => label.name),
    milestone: node.content?.milestone ?? null,
  };
  for (const value of node.fieldValues?.nodes ?? []) {
    const fieldName = value?.field?.name;
    if (!fieldName) continue;
    item[fieldName] = value.text ?? value.date ?? value.name ?? null;
  }
  return item;
}

function collectCompleteConnection(fetchPage) {
  const nodes = [];
  let after = null;
  let expectedTotal = null;
  do {
    const connection = fetchPage(after);
    if (!connection || !Array.isArray(connection.nodes) || !connection.pageInfo) {
      throw new Error("Project item pagination returned an invalid connection");
    }
    if (!Number.isInteger(connection.totalCount) || connection.totalCount < 0) {
      throw new Error("Project item pagination did not expose a valid totalCount");
    }
    if (expectedTotal === null) expectedTotal = connection.totalCount;
    if (connection.totalCount !== expectedTotal) throw new Error("Project item totalCount changed during pagination");
    nodes.push(...connection.nodes);
    after = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
    if (connection.pageInfo.hasNextPage && !after) throw new Error("Project item pagination omitted its next cursor");
  } while (after !== null);
  if (nodes.length !== expectedTotal) {
    throw new Error(`Project item pagination returned ${nodes.length} of ${expectedTotal} items`);
  }
  if (new Set(nodes.map((node) => node?.id)).size !== nodes.length) {
    throw new Error("Project item pagination returned duplicate node IDs");
  }
  return nodes;
}

function projectItemFromGraphqlNode(node) {
  const contentType = node.content?.__typename === "Issue"
    ? "Issue"
    : node.content?.__typename === "PullRequest"
      ? "PullRequest"
      : node.content?.__typename ?? "Unknown";
  const item = {
    id: node.id,
    content: {
      ...node.content,
      type: contentType,
      repository: node.content?.repository?.nameWithOwner ?? null,
    },
    labels: (node.content?.labels?.nodes ?? []).map((label) => label.name),
    milestone: node.content?.milestone ?? null,
  };
  for (const value of node.fieldValues?.nodes ?? []) {
    const fieldName = value?.field?.name;
    if (!fieldName) continue;
    item[fieldName] = value.text ?? value.date ?? value.name ?? null;
  }
  return item;
}

function queryProjectItems(projectId) {
  const nodes = collectCompleteConnection((after) => {
    const data = graphql(`
      query Phase1ProjectItems($projectId: ID!, $after: String) {
        node(id: $projectId) {
          ... on ProjectV2 {
            items(first: 100, after: $after) {
              totalCount
              nodes {
                id
                content {
                  __typename
                  ... on Issue {
                    number
                    url
                    title
                    body
                    repository { nameWithOwner }
                    milestone { title }
                    labels(first: 20) { nodes { name } }
                  }
                  ... on PullRequest {
                    number
                    url
                    title
                    repository { nameWithOwner }
                  }
                }
                fieldValues(first: 100) {
                  nodes {
                    __typename
                    ... on ProjectV2ItemFieldTextValue {
                      text
                      field { ... on ProjectV2FieldCommon { name } }
                    }
                    ... on ProjectV2ItemFieldDateValue {
                      date
                      field { ... on ProjectV2FieldCommon { name } }
                    }
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field { ... on ProjectV2FieldCommon { name } }
                    }
                  }
                }
              }
              pageInfo { hasNextPage endCursor }
            }
          }
        }
      }
    `, { projectId, after });
    return data.node?.items;
  });
  return nodes.map(projectItemFromGraphqlNode);
}

function assertManagedProjectSnapshotUnchanged(taskId, original, current) {
  for (const spec of projectFieldSpecs) {
    if (comparable(projectItemField(original, spec.name)) !== comparable(projectItemField(current, spec.name))) {
      throw new Error(`${taskId}: Project ${spec.name} changed after preflight; refusing a stale field write`);
    }
  }
}

function changedProjectSpecs(currentItem, task) {
  const values = projectValues(task);
  const changedSpecs = [];
  for (const spec of projectFieldSpecs) {
    if (comparable(projectItemField(currentItem, spec.name)) === comparable(values[spec.name])) continue;
    if (immutableProjectValueFields.has(spec.name)) {
      throw new Error(`${task.id}: Project ${spec.name} drift is outside delta reconciliation`);
    }
    changedSpecs.push(spec);
  }
  return changedSpecs;
}

function updateProjectItem(projectId, itemId, fields, task, currentItem, beforeMutation) {
  const values = projectValues(task);
  const changedSpecs = changedProjectSpecs(currentItem, task);
  if (changedSpecs.length === 0) return [];
  const definitions = ["$projectId: ID!", "$itemId: ID!"];
  const variables = { projectId, itemId };
  const operations = [];

  for (const [index, spec] of changedSpecs.entries()) {
    const key = `field${index}`;
    const field = fields[spec.name];
    const value = values[spec.name];
    definitions.push(`$${key}Id: ID!`);
    variables[`${key}Id`] = field.id;

    if (value === null) {
      operations.push(`
        clear${index}: clearProjectV2ItemFieldValue(input: {
          projectId: $projectId
          itemId: $itemId
          fieldId: $${key}Id
        }) { clientMutationId }
      `);
      continue;
    }

    if (spec.dataType === "SINGLE_SELECT") {
      const option = field.options.find((candidate) => candidate.name === value);
      if (!option) throw new Error(`${task.id}: ${spec.name} option not found: ${value}`);
      definitions.push(`$${key}Value: String!`);
      variables[`${key}Value`] = option.id;
      operations.push(`
        set${index}: updateProjectV2ItemFieldValue(input: {
          projectId: $projectId
          itemId: $itemId
          fieldId: $${key}Id
          value: { singleSelectOptionId: $${key}Value }
        }) { clientMutationId }
      `);
      continue;
    }

    if (spec.dataType === "DATE") {
      definitions.push(`$${key}Value: Date!`);
      variables[`${key}Value`] = value;
      operations.push(`
        set${index}: updateProjectV2ItemFieldValue(input: {
          projectId: $projectId
          itemId: $itemId
          fieldId: $${key}Id
          value: { date: $${key}Value }
        }) { clientMutationId }
      `);
      continue;
    }

    definitions.push(`$${key}Value: String!`);
    variables[`${key}Value`] = value;
    operations.push(`
      set${index}: updateProjectV2ItemFieldValue(input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $${key}Id
        value: { text: $${key}Value }
      }) { clientMutationId }
    `);
  }

  if (typeof beforeMutation !== "function") {
    throw new Error(`${task.id}: source-main guard is required before a Project mutation`);
  }
  beforeMutation();
  graphql(`mutation SyncPhase1Item(${definitions.join(", ")}) { ${operations.join("\n")} }`, variables);
  return changedSpecs.map((spec) => spec.name);
}

function queryProjectViews(projectId) {
  const views = [];
  let after = null;
  do {
    const data = graphql(`
      query Phase1ProjectViews($projectId: ID!, $after: String) {
        node(id: $projectId) {
          ... on ProjectV2 {
            views(first: 100, after: $after) {
              nodes { id name number layout filter }
              pageInfo { hasNextPage endCursor }
            }
          }
        }
      }
    `, { projectId, after });
    const connection = data.node?.views;
    if (!connection) throw new Error("Could not query Project V2 views");
    views.push(...connection.nodes);
    after = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
  } while (after);
  return views;
}

function normalizedFieldName(value) {
  return String(value).toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

function projectItemField(item, fieldName) {
  const expected = normalizedFieldName(fieldName);
  const key = Object.keys(item).find((candidate) => normalizedFieldName(candidate) === expected);
  return key ? item[key] : null;
}

function comparable(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function sortedStrings(values) {
  return [...values].map(String).sort((left, right) => left.localeCompare(right));
}

function runMutationAllowlistSelfTest() {
  const task = manifest.tasks[0];
  const current = projectValues(task);
  const expectRejected = (operation, label) => {
    let rejected = false;
    try {
      operation();
    } catch {
      rejected = true;
    }
    if (!rejected) throw new Error(`Mutation allowlist self-test did not reject ${label}`);
  };
  const summaryDrift = { ...current, "Task summary": "stale" };
  const changed = changedProjectSpecs(summaryDrift, task).map((spec) => spec.name);
  if (changed.length !== 1 || changed[0] !== "Task summary") {
    throw new Error("Mutation allowlist self-test did not isolate the expected field delta");
  }
  const doneTask = manifest.tasks.find((candidate) => candidate.status === "Done");
  const activeTask = manifest.tasks.find((candidate) => candidate.status !== "Done");
  if (!doneTask || !activeTask) {
    throw new Error("Projection-contract self-test requires both historical Done and active planning tasks");
  }
  const expectedEvidenceLineNames = [
    "Control validation",
    "Candidate revision",
    "Dossier digest",
    "Required evidence",
    "References",
    "Remaining limitation",
  ];
  if (controlValidationLabel(true) !== "Passed" || controlValidationLabel(false) !== "Failed") {
    throw new Error("Control validation label is not derived from the structural validator result");
  }
  for (const candidate of manifest.tasks) {
    const evidenceLines = projectValues(candidate).Evidence.split("\n");
    const evidenceLineNames = evidenceLines.map((line) => line.slice(0, line.indexOf(":")));
    if (evidenceLines.length !== expectedEvidenceLineNames.length
      || JSON.stringify(evidenceLineNames) !== JSON.stringify(expectedEvidenceLineNames)
      || evidenceLines[0] !== "Control validation: Passed") {
      throw new Error(`${candidate.id}: Evidence projection does not preserve the frozen six-line label/value contract`);
    }
    const expectedReferencePairs = normalizedEvidenceReferencePairs(candidate);
    const expectedReferenceValue = expectedReferencePairs
      ? `${expectedReferencePairs.length} linked in the issue/dossier`
      : missingValueCopy;
    if (evidenceLines[4] !== `References: ${expectedReferenceValue}`) {
      throw new Error(`${candidate.id}: Evidence references are not bounded and retrievable through the linked issue/dossier`);
    }
  }
  const oppositeExecutionState = structuredClone(doneTask);
  oppositeExecutionState.executionAllowed = !doneTask.executionAllowed;
  oppositeExecutionState.taskDossier.executionAllowed = !doneTask.taskDossier.executionAllowed;
  if (projectValues(oppositeExecutionState).Evidence !== projectValues(doneTask).Evidence) {
    throw new Error("Control validation projection must not derive from executionAllowed");
  }
  const doneSummaryLines = projectValues(doneTask)["Task summary"].split("\n");
  if (doneSummaryLines.length !== 4
    || doneSummaryLines[0] !== "Roadmap status: Planning Done — historical"
    || !doneSummaryLines[2].startsWith("Blockers: ")
    || !doneSummaryLines[3].startsWith("Next action: ")) {
    throw new Error("Historical Done task summary does not preserve the frozen status and line-label contract");
  }
  if (!issueBody(doneTask, {}).includes("| Roadmap status | **Planning Done — historical** |")) {
    throw new Error("Historical Done issue body does not use the planning-history roadmap status");
  }
  const activeStatusLine = `Roadmap status: ${activeTask.status}`;
  if (projectValues(activeTask)["Task summary"].split("\n")[0] !== activeStatusLine
    || !issueBody(activeTask, {}).includes(`| Roadmap status | **${activeTask.status}** |`)) {
    throw new Error("Active task Project and issue-body roadmap status projections are not aligned");
  }
  const boundedPreviewTask = structuredClone(activeTask);
  boundedPreviewTask.description = "Synthetic bounded-preview contract";
  boundedPreviewTask.taskDossier.blockers = ["Z9", "A1", "H8", "B2", "G7", "C3", "F6", "D4", "E5", "A1"]
    .map((code) => ({ code }));
  boundedPreviewTask.taskDossier.nextAction = "Continue with the exact reviewed candidate.";
  const expectedBoundedSummary = [
    `Roadmap status: ${activeTask.status}`,
    "Synthetic bounded-preview contract",
    "Blockers: 9; preview: A1, B2, C3, D4, E5, F6, G7, H8; plus 1 more in the linked issue/dossier",
    "Next action: Continue with the exact reviewed candidate.",
  ].join("\n");
  if (projectValues(boundedPreviewTask)["Task summary"] !== expectedBoundedSummary) {
    throw new Error("Task summary blocker preview is not unique, sorted, bounded, and exactly labelled");
  }

  const assertEvidenceValue = (candidate, label, expected, testName) => {
    const line = projectValues(candidate).Evidence.split("\n").find((value) => value.startsWith(`${label}:`));
    if (line !== `${label}: ${expected}`) {
      throw new Error(`Missing-value normalization self-test failed for ${testName}`);
    }
  };
  const validRevision = "a".repeat(40);
  const validDossierDigest = `sha256:${"b".repeat(64)}`;
  const validProjectionTask = structuredClone(activeTask);
  validProjectionTask.taskDossier.requestedScope = {
    scopeClass: "private-execution",
    actionClass: "private-system-read",
  };
  validProjectionTask.taskDossier.candidate.revision = validRevision;
  validProjectionTask.taskDossier.candidate.dossierDigest = validDossierDigest;
  validProjectionTask.evidenceReferencePaths = ["docs/evidence/P0-SYNTHETIC-EVIDENCE.md"];
  validProjectionTask.evidenceReferenceUrls = [`${repoUrl}/blob/main/docs/evidence/P0-SYNTHETIC-EVIDENCE.md`];
  validProjectionTask.taskDossier.privateAuthority = {
    authorityId: "P0-AUTH-FICTIONAL-001",
    taskId: validProjectionTask.id,
    scopeClass: "private-execution",
    allowedActionClass: "private-system-read",
    verifierId: "codex-project-manager-01",
    verifierRole: "project",
    windowStart: "2026-08-15T11:30:00.000Z",
    windowEnd: "2026-08-15T12:30:00.000Z",
    result: "pass",
    ownerActionId: "P0-OA-001",
    accountableHumanId: "fictional-owner-human",
    accountableHumanRole: "owner-authority",
    ownerAttestationReference: "owner:P0-OA-001-FICTIONAL",
    evidenceReference: "authority:P0-AUTH-FICTIONAL-001",
    candidateRevision: validRevision,
    dossierDigest: validDossierDigest,
  };

  const blankCandidateTask = structuredClone(validProjectionTask);
  blankCandidateTask.taskDossier.candidate.revision = "";
  assertEvidenceValue(blankCandidateTask, "Candidate revision", missingValueCopy, "blank candidate revision");
  const malformedCandidateTask = structuredClone(validProjectionTask);
  malformedCandidateTask.taskDossier.candidate.revision = "not-a-revision";
  assertEvidenceValue(malformedCandidateTask, "Candidate revision", missingValueCopy, "malformed candidate revision");

  const blankDigestTask = structuredClone(validProjectionTask);
  blankDigestTask.taskDossier.candidate.dossierDigest = " ";
  assertEvidenceValue(blankDigestTask, "Dossier digest", missingValueCopy, "blank dossier digest");
  const malformedDigestTask = structuredClone(validProjectionTask);
  malformedDigestTask.taskDossier.candidate.dossierDigest = "sha256:bad";
  assertEvidenceValue(malformedDigestTask, "Dossier digest", missingValueCopy, "malformed dossier digest");

  const partialReferenceTask = structuredClone(validProjectionTask);
  partialReferenceTask.evidenceReferenceUrls = [];
  assertEvidenceValue(partialReferenceTask, "References", missingValueCopy, "partial evidence references");
  if (!issueBody(partialReferenceTask, {}).includes(`\n- ${missingValueCopy}; the acceptance text below describes what must exist.\n`)) {
    throw new Error("Missing-value normalization self-test failed for partial issue evidence references");
  }
  const malformedReferenceTask = structuredClone(validProjectionTask);
  malformedReferenceTask.evidenceReferencePaths = [""];
  malformedReferenceTask.evidenceReferenceUrls = ["https://"];
  assertEvidenceValue(malformedReferenceTask, "References", missingValueCopy, "malformed evidence references");

  const partialAuthorityTask = structuredClone(validProjectionTask);
  delete partialAuthorityTask.taskDossier.privateAuthority.evidenceReference;
  if (!issueBody(partialAuthorityTask, {}).includes(`- **Structured private authority:** ${missingValueCopy}`)) {
    throw new Error("Missing-value normalization self-test failed for partial private authority");
  }
  const malformedAuthorityTask = structuredClone(validProjectionTask);
  malformedAuthorityTask.taskDossier.privateAuthority.result = "not-passing";
  if (!issueBody(malformedAuthorityTask, {}).includes(`- **Structured private authority:** ${missingValueCopy}`)) {
    throw new Error("Missing-value normalization self-test failed for malformed private authority");
  }

  const validProjectionEvidence = projectValues(validProjectionTask).Evidence;
  const validProjectionBody = issueBody(validProjectionTask, {});
  if (!validProjectionEvidence.includes(`Candidate revision: ${validRevision}`)
    || !validProjectionEvidence.includes(`Dossier digest: ${validDossierDigest}`)
    || !validProjectionEvidence.includes("References: 1 linked in the issue/dossier")
    || !validProjectionBody.includes("- **Structured private authority:** `P0-AUTH-FICTIONAL-001` / pass / authority:P0-AUTH-FICTIONAL-001")
    || !validProjectionBody.includes(`[docs/evidence/P0-SYNTHETIC-EVIDENCE.md](${repoUrl}/blob/main/docs/evidence/P0-SYNTHETIC-EVIDENCE.md)`)) {
    throw new Error("Missing-value normalization self-test did not preserve valid-value rendering");
  }
  const failedStateBodies = [
    issueBody(blankCandidateTask, {}),
    issueBody(malformedCandidateTask, {}),
    issueBody(blankDigestTask, {}),
    issueBody(malformedDigestTask, {}),
    issueBody(partialReferenceTask, {}),
    issueBody(malformedReferenceTask, {}),
    issueBody(partialAuthorityTask, {}),
    issueBody(malformedAuthorityTask, {}),
  ].join("\n");
  if (/undefined|`invalid`|evidence missing|not-passing/.test(failedStateBodies)) {
    throw new Error("Missing-value normalization self-test found a forbidden fallback token");
  }
  expectRejected(() => changedProjectSpecs({ ...current, Status: "Backlog" }, task), "Project Status drift");
  assertAllowedRestMutation("PATCH", `repos/${repo}/issues/1`, { body: "safe body" });
  expectRejected(() => assertAllowedRestMutation("PATCH", `repos/${repo}/issues/1`, { state: "closed" }), "issue-state mutation");
  expectRejected(() => assertAllowedRestMutation("PATCH", `repos/${repo}/issues/1`, { labels: ["phase1"] }), "issue-label mutation");
  expectRejected(() => assertAllowedRestMutation("PATCH", `repos/${repo}/issues/1`, { milestone: 1 }), "issue-milestone mutation");
  expectRejected(() => assertAllowedRestMutation("POST", `repos/${repo}/issues`, { body: "new issue" }), "issue creation");
  expectRejected(() => assertAllowedRestMutation("DELETE", `repos/${repo}/issues/1`, {}), "issue deletion");
  assertAllowedGraphqlMutation("mutation Safe { set: updateProjectV2ItemFieldValue(input: {}) { clientMutationId } }");
  expectRejected(() => assertAllowedGraphqlMutation("mutation Unsafe { addProjectV2ItemById(input: {}) { clientMutationId } }"), "Project item creation");
  expectRejected(() => assertAllowedGraphqlMutation("mutation Unsafe { deleteProjectV2Item(input: {}) { clientMutationId } }"), "Project item deletion");
  expectRejected(() => assertAllowedGraphqlMutation("mutation Unsafe { createProjectV2Field(input: {}) { clientMutationId } }"), "Project field creation");
  expectRejected(() => assertAllowedGraphqlMutation("mutation Unsafe { updateProjectV2Field(input: {}) { clientMutationId } }"), "Project field reconfiguration");
  expectRejected(() => assertAllowedGraphqlMutation("mutation Unsafe { deleteProjectV2Field(input: {}) { clientMutationId } }"), "Project field deletion");
  expectRejected(() => assertAllowedGraphqlMutation("mutation Unsafe { updateProjectV2View(input: {}) { clientMutationId } }"), "Project view mutation");
  expectRejected(() => assertAllowedGraphqlMutation("mutation Unsafe { updateProjectV2Workflow(input: {}) { clientMutationId } }"), "Project workflow mutation");
  const canonicalIssue = { number: 1, html_url: `https://github.com/${repo}/issues/1` };
  const canonicalItem = {
    content: {
      number: 1,
      repository: repo,
      url: canonicalIssue.html_url,
    },
  };
  assertCanonicalProjectItemIdentity(canonicalItem, "AUD-001", canonicalIssue);
  expectRejected(() => assertCanonicalProjectItemIdentity({
    content: { ...canonicalItem.content, repository: "another-owner/another-repo" },
  }, "AUD-001", canonicalIssue), "cross-repository Project item");
  expectRejected(() => assertCanonicalProjectItemIdentity({
    content: { ...canonicalItem.content, number: 2, url: `https://github.com/${repo}/issues/2` },
  }, "AUD-001", canonicalIssue), "wrong-number Project item");
  const verificationMismatches = [];
  if (!appendProjectItemIdentityMismatch(verificationMismatches, canonicalItem, "AUD-001", canonicalIssue)
    || verificationMismatches.length !== 0) {
    throw new Error("Project-item identity verification rejected the canonical issue");
  }
  appendProjectItemIdentityMismatch(verificationMismatches, {
    content: { ...canonicalItem.content, repository: "another-owner/another-repo" },
  }, "AUD-001", canonicalIssue);
  appendProjectItemIdentityMismatch(verificationMismatches, {
    content: { ...canonicalItem.content, url: `https://github.com/${repo}/issues/99` },
  }, "AUD-002", canonicalIssue);
  if (JSON.stringify(verificationMismatches) !== JSON.stringify([
    "AUD-001:project-issue-identity",
    "AUD-002:project-issue-identity",
  ])) {
    throw new Error("Project-item identity verification did not report wrong repository/URL mismatches");
  }
  const issueSnapshot = {
    ...canonicalIssue,
    title: "[AUD-001] Synthetic",
    body: "old body",
    state: "open",
    milestone: { title: "P0" },
    labels: [{ name: "phase1" }],
  };
  assertIssueSnapshotUnchanged("AUD-001", issueSnapshot, structuredClone(issueSnapshot));
  expectRejected(() => assertIssueSnapshotUnchanged("AUD-001", issueSnapshot, {
    ...issueSnapshot,
    body: "concurrent body",
  }), "concurrent issue-body edit");
  assertManagedProjectSnapshotUnchanged("AUD-001", current, { ...current });
  expectRejected(() => assertManagedProjectSnapshotUnchanged("AUD-001", current, {
    ...current,
    "Task summary": "concurrent summary",
  }), "concurrent Project-field edit");
  const paginationPages = [
    { nodes: Array.from({ length: 100 }, (_, index) => ({ id: `item-${index}` })), totalCount: 205, pageInfo: { hasNextPage: true, endCursor: "page-2" } },
    { nodes: Array.from({ length: 100 }, (_, index) => ({ id: `item-${index + 100}` })), totalCount: 205, pageInfo: { hasNextPage: true, endCursor: "page-3" } },
    { nodes: Array.from({ length: 5 }, (_, index) => ({ id: `item-${index + 200}` })), totalCount: 205, pageInfo: { hasNextPage: false, endCursor: null } },
  ];
  const pageByCursor = new Map([[null, paginationPages[0]], ["page-2", paginationPages[1]], ["page-3", paginationPages[2]]]);
  const paginatedItems = collectCompleteConnection((after) => pageByCursor.get(after));
  if (paginatedItems.length !== 205 || paginatedItems.at(-1)?.id !== "item-204") {
    throw new Error("Project-item pagination self-test truncated a connection over 200 items");
  }
  expectRejected(() => collectCompleteConnection(() => ({
    nodes: [{ id: "item-1" }],
    totalCount: 2,
    pageInfo: { hasNextPage: false, endCursor: null },
  })), "truncated Project-item pagination");
  assertSnapshotBytes("synthetic manifest", "canonical", "canonical");
  expectRejected(() => assertSnapshotBytes("synthetic manifest", "stale", "canonical"), "post-load source-byte drift");
  const syntheticProjectionSnapshot = Object.freeze({
    manifestBytes: "synthetic-manifest-v1",
    issueMapPresent: true,
    issueMapBytes: "synthetic-issue-map-v1",
  });
  let manifestSnapshotRead = 0;
  const concurrentManifestGuard = createProjectionSourceGuard({
    expectedSnapshot: syntheticProjectionSnapshot,
    readSnapshot: () => {
      manifestSnapshotRead += 1;
      return manifestSnapshotRead === 1
        ? syntheticProjectionSnapshot
        : { ...syntheticProjectionSnapshot, manifestBytes: "synthetic-manifest-v2" };
    },
  });
  concurrentManifestGuard("pre-structural-validation");
  expectRejected(
    () => concurrentManifestGuard("post-structural-validation"),
    "concurrent manifest drift during structural validation",
  );
  let issueMapSnapshotRead = 0;
  const concurrentIssueMapGuard = createProjectionSourceGuard({
    expectedSnapshot: syntheticProjectionSnapshot,
    readSnapshot: () => {
      issueMapSnapshotRead += 1;
      return issueMapSnapshotRead === 1
        ? syntheticProjectionSnapshot
        : { ...syntheticProjectionSnapshot, issueMapBytes: "synthetic-issue-map-v2" };
    },
  });
  concurrentIssueMapGuard("pre-structural-validation");
  expectRejected(
    () => concurrentIssueMapGuard("post-structural-validation"),
    "concurrent issue-map drift during structural validation",
  );
  const sourceRevision = "a".repeat(40);
  const movedRevision = "b".repeat(40);
  const healthySourceFacts = {
    originBeforeOk: true,
    originBeforeUrl: CANONICAL_ORIGIN_URL,
    originAfterOk: true,
    originAfterUrl: CANONICAL_ORIGIN_URL,
    fetchOk: true,
    branchOk: true,
    branch: "codex/synthetic-exact-main",
    upstreamOk: true,
    upstream: "origin/main",
    statusOk: true,
    status: "",
    headOk: true,
    head: sourceRevision,
    originMainOk: true,
    originMain: sourceRevision,
  };
  const sourceGuardBoundaries = [
    "pre-first-mutation",
    "issue:AUD-002:pre-mutation",
    "project:AUD-002:pre-mutation",
    "post-apply-parity",
  ];
  for (const movementBoundary of sourceGuardBoundaries) {
    const guard = createSourceMainGuard({
      expectedRevision: sourceRevision,
      probe: ({ boundary }) => boundary === movementBoundary
        ? { ...healthySourceFacts, originMain: movedRevision }
        : { ...healthySourceFacts },
      verifySnapshot: () => {},
    });
    const guardTargetMutation = createTargetMutationGuard(guard);
    expectRejected(() => {
      guardTargetMutation("issue:AUD-001:pre-mutation");
      guardTargetMutation("issue:AUD-002:pre-mutation");
      guardTargetMutation("project:AUD-001:pre-mutation");
      guardTargetMutation("project:AUD-002:pre-mutation");
      guard("post-apply-parity");
    }, `source-main movement at ${movementBoundary}`);
  }
  const freezeSnapshot = loadCommittedFreezeSnapshot({ repoRoot });
  const selfTestIssueNumbers = Object.fromEntries(
    manifest.tasks.map((candidate) => [candidate.id, issueMap[candidate.id]?.number ?? null]),
  );
  const selfTestFreezeAdapter = deriveSanitizedFreezeAdapter({ issueNumbers: selfTestIssueNumbers });
  verifySanitizedIssueProjectAdapter(freezeSnapshot, selfTestFreezeAdapter, "self-test projection");
  const partialFreezeAdapter = structuredClone(selfTestFreezeAdapter);
  partialFreezeAdapter.tasks.pop();
  expectRejected(
    () => verifySanitizedIssueProjectAdapter(freezeSnapshot, partialFreezeAdapter, "self-test projection"),
    "partial exact-50 projection adapter",
  );
  const driftedFreezeAdapter = structuredClone(selfTestFreezeAdapter);
  driftedFreezeAdapter.tasks[0].issue.bodySha256 = "0".repeat(64);
  expectRejected(
    () => verifySanitizedIssueProjectAdapter(freezeSnapshot, driftedFreezeAdapter, "self-test projection"),
    "frozen projection drift",
  );
  const incompleteIssueNumbers = { ...selfTestIssueNumbers };
  delete incompleteIssueNumbers[selfTestFreezeAdapter.tasks[0].taskId];
  expectRejected(
    () => deriveSanitizedFreezeAdapter({ issueNumbers: incompleteIssueNumbers }),
    "sync omission from the issue-number projection",
  );
  assertNoFrozenMutationTargets(
    [{ taskId: "AUD-001", issueNumber: 2, body: "allowed P0 body" }],
    [{ taskId: "ENG-R0-001", fieldName: "Task summary", expectedValue: "allowed R0 field" }],
  );
  expectRejected(
    () => assertNoFrozenMutationTargets([{ taskId: selfTestFreezeAdapter.tasks[0].taskId }], []),
    "frozen issue-body mutation target",
  );
  expectRejected(
    () => assertNoFrozenMutationTargets([], [{ taskId: selfTestFreezeAdapter.tasks[0].taskId, fieldName: "Evidence" }]),
    "frozen Project-field mutation target",
  );
  const capturedFreezeAdapter = spawnSync(
    process.execPath,
    [path.join(repoRoot, "tools/sync_phase1_github.mjs"), "--freeze-adapter"],
    {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  if (capturedFreezeAdapter.status !== 0
    || Buffer.byteLength(capturedFreezeAdapter.stdout) <= 64 * 1024) {
    throw new Error("Freeze-adapter capture self-test did not flush the complete projection beyond pipe capacity");
  }
  let capturedFreezeDocument;
  try {
    capturedFreezeDocument = JSON.parse(capturedFreezeAdapter.stdout);
  } catch {
    throw new Error("Freeze-adapter capture self-test did not emit complete JSON");
  }
  if (capturedFreezeDocument.mode !== "freeze-adapter"
    || capturedFreezeDocument.adapter?.tasks?.length !== 50
    || capturedFreezeDocument.verification?.passed !== true) {
    throw new Error("Freeze-adapter capture self-test did not preserve the exact frozen projection contract");
  }
  return {
    ok: true,
    suite: "PC-001 GitHub mutation allowlist",
    cases: 56,
    legacyMutationAllowlistCases: 30,
    projectionContractCases: 16,
    missingValueNormalizationCases: 10,
    snapshotBindingCases: 2,
    largeFreezeAdapterCaptureCases: 1,
    sourceMainGuardMovementCases: sourceGuardBoundaries.length,
    mutableProjectFieldCount: projectFieldSpecs.length - immutableProjectValueFields.size,
    immutableProjectFields: [...immutableProjectValueFields],
  };
}

function requireExistingProjectFields(projectId) {
  const fields = queryProjectFields(projectId);
  const resolved = {};
  for (const spec of projectFieldSpecs) {
    const matches = fields.filter((field) => field.name.toLowerCase() === spec.name.toLowerCase());
    if (matches.length !== 1) throw new Error(`Existing-only sync requires exactly one Project field named ${spec.name}`);
    const field = matches[0];
    if (field.name !== spec.name || field.dataType !== spec.dataType) {
      throw new Error(`Existing Project field ${spec.name} does not match the canonical name/type`);
    }
    if (spec.options) {
      const actualNames = new Set(field.options.map((option) => option.name));
      for (const option of spec.options) {
        if (!actualNames.has(option.name)) throw new Error(`Existing Project field ${spec.name} lacks option ${option.name}`);
      }
    }
    resolved[spec.name] = field;
  }
  return resolved;
}

function assertCanonicalProjectItemIdentity(item, taskId, issue) {
  const content = item?.content ?? {};
  const repository = typeof content.repository === "string"
    ? content.repository
    : content.repository?.nameWithOwner;
  if (repository !== repo
    || content.number !== issue?.number
    || content.url !== issue?.html_url) {
    throw new Error(`${taskId}: Project item content does not match the canonical repository issue`);
  }
}

function appendProjectItemIdentityMismatch(mismatches, item, taskId, issue) {
  try {
    assertCanonicalProjectItemIdentity(item, taskId, issue);
    return true;
  } catch {
    mismatches.push(`${taskId}:project-issue-identity`);
    return false;
  }
}

function loadExistingProjectItems(projectId, issueById) {
  const items = queryProjectItems(projectId);
  const issueItems = items.filter((item) => item.content?.type === "Issue");
  if (issueItems.length !== manifest.tasks.length) {
    throw new Error(`Existing-only sync requires exactly ${manifest.tasks.length} issue items; found ${issueItems.length}`);
  }
  const itemByTask = {};
  for (const item of issueItems) {
    const taskId = item.content?.body?.match(/<!-- phase1-roadmap-id: ([^ ]+) -->/)?.[1] ?? null;
    if (!taskId || !manifest.tasks.some((task) => task.id === taskId) || itemByTask[taskId]) {
      throw new Error("Existing Project items do not form one unique canonical 58-task set");
    }
    assertCanonicalProjectItemIdentity(item, taskId, issueById[taskId]);
    if (typeof item.id !== "string" || item.id.length === 0) throw new Error(`${taskId}: Project item node ID is missing`);
    itemByTask[taskId] = item;
  }
  requireAllIssues(itemByTask);
  return itemByTask;
}

function requireExistingViews(projectId) {
  const views = queryProjectViews(projectId);
  for (const spec of savedViewSpecs) {
    const matches = views.filter((view) => view.name === spec.name);
    if (matches.length !== 1
      || matches[0].layout !== spec.layout
      || matches[0].filter !== canonicalViewFilter) {
      throw new Error(`Existing Project view ${spec.name} is absent or drifted; this sync may not mutate views`);
    }
  }
}

function canonicalDeltaDigest(delta) {
  return `sha256:${crypto.createHash("sha256").update(JSON.stringify(delta)).digest("hex")}`;
}

function reconcileExistingOnly(sourceMainGuard) {
  const issueById = loadExistingIssues();
  requireAllIssues(issueById);
  const issueNumbers = Object.fromEntries(Object.entries(issueById).map(([id, issue]) => [id, issue.number]));

  for (const task of manifest.tasks) {
    const issue = issueById[task.id];
    const expectedLabels = ["phase1", "roadmap", statusLabelFor(task.status), priorityLabel(task.priority), typeLabel(task.taskType)];
    const actualLabels = issue.labels.map((label) => typeof label === "string" ? label : label.name);
    const expectedState = issueStateFor(task.status);
    if (issue.title !== task.issueTitle
      || JSON.stringify(sortedStrings(actualLabels)) !== JSON.stringify(sortedStrings(expectedLabels))
      || issue.milestone?.title !== task.milestone
      || issue.state !== expectedState
      || issueMap[task.id]?.number !== issue.number
      || issueMap[task.id]?.url !== issue.html_url
      || issueMap[task.id]?.expectedStatus !== task.status
      || issueMap[task.id]?.expectedFinalState !== expectedState) {
      throw new Error(`${task.id}: static issue identity/status/label/milestone or issue-map drift is outside delta reconciliation`);
    }
  }

  const project = queryProject();
  const fields = requireExistingProjectFields(project.id);
  const itemByTask = loadExistingProjectItems(project.id, issueById);
  requireExistingViews(project.id);
  const liveFreezeProjection = deriveSanitizedFreezeAdapter({ issueNumbers, issueById, itemByTask });
  verifyFreezeBoundary("pre-apply-live", { projection: localFreezeProjection, live: liveFreezeProjection });
  const issueBodyDeltas = [];
  const projectFieldDeltas = [];
  for (const task of manifest.tasks) {
    const issue = issueById[task.id];
    const body = issueBody(task, issueNumbers);
    if (!projectOnly && issue.body !== body) issueBodyDeltas.push({ taskId: task.id, issueNumber: issue.number, body });
    if (!issuesOnly) {
      const item = itemByTask[task.id];
      const values = projectValues(task);
      for (const spec of changedProjectSpecs(item, task)) {
        projectFieldDeltas.push({ taskId: task.id, fieldName: spec.name, expectedValue: values[spec.name] });
      }
    }
  }
  assertNoFrozenMutationTargets(issueBodyDeltas, projectFieldDeltas);
  const delta = {
    sourceRevision: exactMainPreflight.revision,
    issueBodies: issueBodyDeltas.map(({ taskId, issueNumber, body }) => ({
      taskId,
      issueNumber,
      expectedSha256: crypto.createHash("sha256").update(body).digest("hex"),
    })),
    projectFields: projectFieldDeltas.map(({ taskId, fieldName, expectedValue }) => ({
      taskId,
      fieldName,
      expectedSha256: crypto.createHash("sha256").update(String(expectedValue ?? "")).digest("hex"),
    })),
  };
  const deltaDigest = canonicalDeltaDigest(delta);

  const guardTargetMutation = createTargetMutationGuard(sourceMainGuard);
  for (const change of issueBodyDeltas) {
    const originalIssue = issueById[change.taskId];
    const currentIssue = api("GET", `repos/${repo}/issues/${change.issueNumber}`);
    assertIssueSnapshotUnchanged(change.taskId, originalIssue, currentIssue);
    guardTargetMutation(`issue:${change.taskId}:pre-mutation`);
    api("PATCH", `repos/${repo}/issues/${change.issueNumber}`, { body: change.body });
  }
  const changedProjectFields = [];
  if (!issuesOnly) {
    for (const task of manifest.tasks) {
      const item = itemByTask[task.id];
      const preflightChanges = changedProjectSpecs(item, task);
      if (preflightChanges.length === 0) continue;
      const currentItem = queryProjectItem(item.id);
      assertCanonicalProjectItemIdentity(currentItem, task.id, issueById[task.id]);
      assertManagedProjectSnapshotUnchanged(task.id, item, currentItem);
      const changedFields = updateProjectItem(
        project.id,
        item.id,
        fields,
        task,
        currentItem,
        () => guardTargetMutation(`project:${task.id}:pre-mutation`),
      );
      changedProjectFields.push(...changedFields.map((fieldName) => ({ taskId: task.id, fieldName })));
    }
  }

  return {
    mode: "apply-existing-delta-only",
    sourceRevision: exactMainPreflight.revision,
    deltaDigest,
    issueBodiesChanged: issueBodyDeltas.length,
    projectFieldsChanged: changedProjectFields.length,
    unchangedIssueStates: manifest.tasks.length,
    createdIssues: 0,
    createdProjectItems: 0,
    changedProjectDefinitions: 0,
    changedViews: 0,
    issueMapChanged: false,
  };
}

function verifyLiveParity() {
  const mismatches = [];
  const issueById = loadExistingIssues();
  requireAllIssues(issueById);
  const issueNumbers = Object.fromEntries(Object.entries(issueById).map(([id, issue]) => [id, issue.number]));

  for (const task of manifest.tasks) {
    const issue = issueById[task.id];
    const expectedLabels = [
      "phase1",
      "roadmap",
      statusLabelFor(task.status),
      priorityLabel(task.priority),
      typeLabel(task.taskType),
    ];
    const actualLabels = issue.labels.map((label) => typeof label === "string" ? label : label.name);
    if (issue.title !== task.issueTitle) mismatches.push(`${task.id}:issue-title`);
    if (issue.body !== issueBody(task, issueNumbers)) mismatches.push(`${task.id}:issue-body`);
    if (JSON.stringify(sortedStrings(actualLabels)) !== JSON.stringify(sortedStrings(expectedLabels))) {
      mismatches.push(`${task.id}:issue-labels`);
    }
    if (issue.milestone?.title !== task.milestone) mismatches.push(`${task.id}:issue-milestone`);
    const expectedState = issueStateFor(task.status);
    if (issue.state !== expectedState) mismatches.push(`${task.id}:issue-state`);
    if (issueMap[task.id]?.expectedStatus !== task.status) mismatches.push(`${task.id}:issue-map-status`);
    if (issueMap[task.id]?.expectedFinalState !== expectedState) mismatches.push(`${task.id}:issue-map-state`);
    if (task.milestone === "R10" && issue.milestone?.due_on) mismatches.push(`${task.id}:r10-milestone-date`);
  }

  const project = queryProject();
  const projectItems = queryProjectItems(project.id);
  const issueItems = projectItems.filter((item) => item.content?.type === "Issue");
  if (issueItems.length !== manifest.tasks.length) {
    mismatches.push(`project:issue-item-count:${issueItems.length}`);
  }

  const itemByTask = {};
  for (const item of issueItems) {
    const markerId = item.content?.body?.match(/<!-- phase1-roadmap-id: ([^ ]+) -->/)?.[1] ?? null;
    if (!markerId || !manifest.tasks.some((task) => task.id === markerId)) {
      mismatches.push(`project:unexpected-issue:${item.content?.number ?? "unknown"}`);
      continue;
    }
    if (itemByTask[markerId]) {
      mismatches.push(`${markerId}:duplicate-project-item`);
      continue;
    }
    if (!appendProjectItemIdentityMismatch(mismatches, item, markerId, issueById[markerId])) {
      continue;
    }
    itemByTask[markerId] = item;
  }

  const liveFreezeProjection = deriveSanitizedFreezeAdapter({ issueNumbers, issueById, itemByTask });
  const liveFreeze = verifyFreezeBoundary("live-parity", {
    projection: localFreezeProjection,
    live: liveFreezeProjection,
  });

  for (const task of manifest.tasks) {
    const item = itemByTask[task.id];
    if (!item) {
      mismatches.push(`${task.id}:missing-project-item`);
      continue;
    }
    const issue = issueById[task.id];
    if (item.content.number !== issue.number) mismatches.push(`${task.id}:project-issue-number`);
    if (item.content.title !== task.issueTitle) mismatches.push(`${task.id}:project-title`);
    if (item.milestone?.title !== task.milestone) mismatches.push(`${task.id}:project-milestone`);
    const actualLabels = item.labels ?? [];
    const expectedLabels = [
      "phase1",
      "roadmap",
      statusLabelFor(task.status),
      priorityLabel(task.priority),
      typeLabel(task.taskType),
    ];
    if (JSON.stringify(sortedStrings(actualLabels)) !== JSON.stringify(sortedStrings(expectedLabels))) {
      mismatches.push(`${task.id}:project-labels`);
    }
    for (const [fieldName, expectedValue] of Object.entries(projectValues(task))) {
      const actualValue = projectItemField(item, fieldName);
      if (comparable(actualValue) !== comparable(expectedValue)) {
        mismatches.push(`${task.id}:project-field:${fieldName}`);
      }
    }
  }

  const views = queryProjectViews(project.id);
  for (const spec of savedViewSpecs) {
    const matches = views.filter((view) => view.name === spec.name);
    if (matches.length !== 1) {
      mismatches.push(`view:${spec.name}:count:${matches.length}`);
      continue;
    }
    if (matches[0].layout !== spec.layout) mismatches.push(`view:${spec.name}:layout`);
    if (matches[0].filter !== canonicalViewFilter) mismatches.push(`view:${spec.name}:filter`);
  }

  const statusCounts = Object.fromEntries(
    ["Backlog", "Next", "In progress", "Done"].map((status) => [
      status,
      manifest.tasks.filter((task) => projectItemField(itemByTask[task.id] ?? {}, "Status") === status).length,
    ]),
  );

  return {
    mode: "verify-read-only",
    sourceRevision: exactMainPreflight.revision,
    repository: repo,
    project: projectUrl,
    canonicalTasks: manifest.tasks.length,
    issueItems: issueItems.length,
    pullRequestItems: projectItems.filter((item) => item.content?.type === "PullRequest").length,
    statusCounts,
    viewFilter: canonicalViewFilter,
    mismatchCount: mismatches.length,
    mismatches,
    passed: mismatches.length === 0,
    frozenScope: {
      passed: liveFreeze.passed,
      projectionTasks: liveFreeze.projection.taskCount,
      liveTasks: liveFreeze.live.taskCount,
    },
  };
}

let exactMainPreflight = null;
if (apply || verify) {
  if (!structuralValidation.passed) {
    throw new Error("P0_CONTROL_VALIDATION_FAILED: structural validation must pass before live verification or mutation");
  }
  exactMainPreflight = await verifyExactMainPreflight({ repoRoot });
  if (exactMainPreflight.ok !== true) {
    throw new Error(`${exactMainPreflight.code}: ${exactMainPreflight.message} ${exactMainPreflight.correctiveAction}`);
  }
  assertLoadedControlSnapshot(exactMainPreflight.revision);
}

runGh(["auth", "status", "--hostname", "github.com"]);

if (verify) {
  const report = verifyLiveParity();
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
} else {
  const sourceMainGuard = createSourceMainGuard({ expectedRevision: exactMainPreflight.revision });
  const reconciliation = reconcileExistingOnly(sourceMainGuard);
  const postApplyParity = verifyLiveParity();
  if (!postApplyParity.passed) {
    throw new Error(`POST_APPLY_PARITY_FAILED: ${postApplyParity.mismatchCount} mismatch(es) remain`);
  }
  sourceMainGuard("post-apply-parity");
  console.log(JSON.stringify({
    repository: repo,
    project: projectUrl,
    ...reconciliation,
    postApplyParity: {
      passed: true,
      mismatchCount: 0,
      sourceRevision: postApplyParity.sourceRevision,
    },
  }, null, 2));
}
