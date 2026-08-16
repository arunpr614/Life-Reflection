import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  ARTIFACT_KINDS,
  COUNCIL_SEATS,
  DELIVERY_TRANSITION_GATE_B_CONTRACT,
  DESIGN_ACCESSIBILITY_DIMENSIONS,
  DESIGN_STATE_DIMENSIONS,
  LOCAL_SYNTHETIC_CONTENT_POLICY,
  P0_R0_SCOPE_TASK_IDS,
  P0_R0_SUBSTANTIVE_TASK_IDS,
  READINESS_SCHEMA_VERSION,
  SCOPE_ACTION_COMPATIBILITY,
  STAGE_APPROVAL_REGISTRY_PATH,
  STAGE_EXECUTION_SCHEMA_VERSION,
  STAGE_LIFECYCLE_STATES,
  TASK_EXECUTION_CONTRACT,
  TERMINAL_STAGE_STATES,
  TASK_FILE_DESCENDANT_DELTA_PATHS,
  TASK_FILE_DIFF_EXCLUSIONS,
  TASK_FILE_GIT_MODES,
  TASK_FILE_PURPOSES,
  computeDossierDigest,
  computeTaskContractSha256,
  computeTaskFilesSha256,
  evaluateReadiness,
  isTaskMilestoneScopeActionCompatible,
  parseArtifactControlMarkers,
  validateTaskFilesManifest,
} from "./P0-readiness-gates.mjs";
import { loadBoundedAuthoritySources } from "./P0-bounded-authority.mjs";
import {
  OWNER_ACTION_REQUIREMENT_CATALOG,
  acceptanceScenarioIdsFor,
  buildTaskReadinessInput,
  executionScopeLabelFor,
  ownerActionIdsFor,
  requestedScopeFor,
  validateReadinessState,
} from "./P0-build-task-readiness-input.mjs";
import {
  deriveApprovalPublicationFacts,
  deriveCandidatePublicationFacts,
  emptyCandidatePublicationFacts,
  localSyntheticTextBytesAreSafe,
  xlsxArchiveIsSafe,
  xlsxFormulaXmlIsSafe,
  xlsxRelationshipXmlIsSafe,
} from "./P0-verify-execution-start.mjs";
import { assertDuplicateKeyRejection, parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";
import {
  CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION,
  CONTROL_REVIEW_EXPECTED_COUNTS,
  CONTROL_REVIEW_PERMITTED_CLAIM,
  CONTROL_REVIEW_RECORD_KEYS,
  CONTROL_REVIEW_SEAT_KEYS,
  CONTROL_REVIEW_TASK_ID,
  computeControlReviewContextSha256,
  computeControlReviewStableTaskFilesSha256,
  computeControlReviewSeatAttestationDigest,
  controlReviewStableTaskFiles,
  controlReviewEvidenceFindings,
  validateControlReviewHistorySequence,
  validateControlReviewRegistryContinuity,
} from "./P0-control-review-trust.mjs";
import { verifySuccessorControlReviews } from "./P0-successor-control-review.mjs";
import {
  RUNNING_LOG_GENESIS_PATH,
  verifyRunningLogTrust,
} from "./P0-running-log-trust.mjs";
import {
  PRODUCTION_STAGED_ACTIONS,
  STAGE_APPROVAL_REGISTRY_BOOTSTRAP_PARENT_REVISION,
  validateStageApprovalRegistry,
  validateStageRuntimeLifecycle,
  verifyPreparationReviewRegistryHistory,
  verifyStageApprovalRegistryContinuity,
  verifyStageApprovalRegistryHistory,
} from "./P0-staged-actions.mjs";
import {
  PRODUCTION_MODULE_METADATA,
  PRODUCTION_OUTCOME_VERIFICATION_MODULE_IDS,
} from "./P0-stage-runner.mjs";

const repoRoot = path.resolve(import.meta.dirname, "..");
const readText = (filePath) => fs.readFileSync(path.join(repoRoot, filePath), "utf8");
const readJson = (filePath) => parseJsonWithoutDuplicateKeys(readText(filePath), filePath);
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
let boundedAuthority;
try {
  boundedAuthority = loadBoundedAuthoritySources(repoRoot);
} catch {
  boundedAuthority = { ok: false, findings: ["BOUNDED_AUTHORITY_HELPER_FAILED"] };
}
const boundedAuthorityFindings = Array.isArray(boundedAuthority.findings)
  ? boundedAuthority.findings
  : ["BOUNDED_AUTHORITY_FINDINGS_MISSING"];
for (const finding of boundedAuthorityFindings) {
  check(false, `GOV-AUTH-SCOPE: ${finding}`);
}
if (boundedAuthority.ok !== true && boundedAuthorityFindings.length === 0) {
  check(false, "GOV-AUTH-SCOPE: BOUNDED_AUTHORITY_VALIDATION_FAILED");
}
check(assertDuplicateKeyRejection(), "GOV-JSON-001: duplicate-key JSON rejection self-test failed");
const sameSet = (left, right) => left.size === right.size && [...left].every((value) => right.has(value));
const hasExactKeys = (value, expected) => value !== null
  && typeof value === "object"
  && !Array.isArray(value)
  && sameSet(new Set(Object.keys(value)), new Set(expected));
const sha256 = (content) => crypto.createHash("sha256").update(content).digest("hex");
const fullCommitPattern = /^[0-9a-f]{40}$/;
const opaqueEvidencePattern = /^[a-z][a-z0-9-]*:[A-Za-z0-9._/-]{4,}$/;
const isOpaqueEvidenceReference = (value) => typeof value === "string"
  && opaqueEvidencePattern.test(value)
  && !value.includes("://")
  && !/(?:pending|unknown|tbd|placeholder)/i.test(value);
const gitSuccess = (args) => {
  try {
    execFileSync("git", args, { cwd: repoRoot, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};
const revisionExists = (revision) => fullCommitPattern.test(revision ?? "")
  && gitSuccess(["cat-file", "-e", `${revision}^{commit}`]);
const revisionIsPublished = (revision) => revisionExists(revision)
  && gitSuccess(["merge-base", "--is-ancestor", revision, "refs/remotes/origin/main"]);
const revisionIsAncestorOfHead = (revision) => revisionExists(revision)
  && gitSuccess(["merge-base", "--is-ancestor", revision, "HEAD"]);
const fetchedMainRevision = (() => {
  try {
    const revision = execFileSync("git", ["rev-parse", "--verify", "refs/remotes/origin/main^{commit}"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
    return fullCommitPattern.test(revision) ? revision : null;
  } catch {
    return null;
  }
})();
const headRevision = (() => {
  try {
    const revision = execFileSync("git", ["rev-parse", "--verify", "HEAD^{commit}"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
    return fullCommitPattern.test(revision) ? revision : null;
  } catch {
    return null;
  }
})();
const countBy = (values) => Object.fromEntries(
  [...new Set(values)].sort().map((value) => [value, values.filter((candidate) => candidate === value).length]),
);
const walkFiles = (relativeDirectory) => {
  const absoluteDirectory = path.join(repoRoot, relativeDirectory);
  const files = [];
  for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(relativePath));
    if (entry.isFile()) files.push(relativePath);
  }
  return files;
};
const taskFilesShaAtRevision = (revision, taskFiles) => computeTaskFilesSha256(taskFiles.map((entry) => {
  const treeRow = execFileSync("git", ["ls-tree", revision, "--", entry.path], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
  const match = treeRow.match(/^(\d+)\s+(\w+)\s+[0-9a-f]+\t/);
  if (!match) throw new Error(`Missing Git tree entry ${revision}:${entry.path}`);
  const bytes = execFileSync("git", ["show", `${revision}:${entry.path}`], {
    cwd: repoRoot,
    encoding: null,
    maxBuffer: 64 * 1024 * 1024,
  });
  return {
    path: entry.path,
    sha256: sha256(bytes),
    purpose: entry.purpose,
    gitMode: match[1],
    gitType: match[2],
  };
}));
const taskFilesShaAtWorktree = (taskFiles) => computeTaskFilesSha256(taskFiles.map((entry) => {
  const absolutePath = path.join(repoRoot, entry.path);
  const stats = fs.lstatSync(absolutePath);
  if (!stats.isFile()) throw new Error(`Worktree task file is not a regular file: ${entry.path}`);
  return {
    ...entry,
    sha256: sha256(fs.readFileSync(absolutePath)),
  };
}));
const descendantDeltaFacts = (fromRevision, toRevision) => {
  const paths = execFileSync("git", ["diff", "--name-only", "-z", fromRevision, toRevision], {
    cwd: repoRoot,
    encoding: null,
    maxBuffer: 64 * 1024 * 1024,
  }).toString("utf8").split("\0").filter(Boolean).sort();
  const forbidden = execFileSync("git", ["diff", "--name-only", "-z", "--diff-filter=DRT", fromRevision, toRevision], {
    cwd: repoRoot,
    encoding: null,
    maxBuffer: 64 * 1024 * 1024,
  }).toString("utf8").split("\0").filter(Boolean);
  return { paths, forbiddenCount: forbidden.length };
};

const manifestPath = "docs/project/PHASE1-ROADMAP-MANIFEST.json";
const taskStatePath = "docs/project/P0-PHASE1-TASK-STATE.json";
const issueMapPath = "docs/project/PHASE1-GITHUB-ISSUES.json";
const artifactRegisterPath = "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json";
const readinessStatePath = "docs/project/P0-PHASE1-TASK-READINESS-STATE.json";
const reviewerRegistryPath = "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json";
const approvalRegistryPath = "docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json";
const ownerActionStatePath = "docs/council/execution/P0-OWNER-ACTION-STATE.json";
const stageApprovalRegistryPath = STAGE_APPROVAL_REGISTRY_PATH;
const controlReviewCanonicalWorkbookPath = "outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx";
const manifest = readJson(manifestPath);
const taskState = readJson(taskStatePath);
const issueMap = readJson(issueMapPath).issues ?? {};
const artifactRegister = readJson(artifactRegisterPath);
const readinessState = readJson(readinessStatePath);
const reviewerRegistry = readJson(reviewerRegistryPath);
const approvalRegistry = readJson(approvalRegistryPath);
const ownerActionState = readJson(ownerActionStatePath);
const stageApprovalRegistry = readJson(stageApprovalRegistryPath);
const dossierById = new Map(artifactRegister.tasks.map((record) => [record.taskId, record]));
const productRequirements = readText("docs/product/PRODUCT-REQUIREMENTS.md");
const traceability = readText("docs/project/REQUIREMENTS-TRACEABILITY.md");
const r4Release = readText("docs/product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md");
const uxSpecification = readText("docs/design/UX-SPECIFICATION.md");
const architecturePlan = readText("docs/architecture/PHASE1-IMPLEMENTATION-PLAN.md");
const sharedArchitecturePlan = readText("docs/architecture/IMPLEMENTATION-PLAN.md");
const r0Prd = readText("docs/product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md");
const r3Prd = readText("docs/product/releases/PRD-R3-RETRIEVAL-DATE-INTEGRITY.md");
const prototypeTracker = readText("docs/project/PROTOTYPE-COMPLETENESS-TRACKER.md");
const requirementPattern = /\bLID-[A-Z]+-\d{3}\b/g;
const prdIds = new Set(productRequirements.match(requirementPattern) ?? []);
const traceabilityIds = new Set(traceability.match(requirementPattern) ?? []);
const manifestIds = new Set(manifest.requirementMap.map((entry) => entry.requirementId));
const deferredIds = new Set(
  manifest.requirementMap
    .filter((entry) => entry.primaryMilestone === "Deferred")
    .map((entry) => entry.requirementId),
);
const expectedDeferred = new Set([
  "LID-UP-004",
  "LID-DEF-001",
  "LID-DEF-002",
  "LID-DEF-003",
  "LID-DEF-004",
  "LID-DEF-005",
  "LID-DEF-006",
]);

check(prdIds.size === 78, `GOV-REQ-001: governing PRD has ${prdIds.size} unique requirement IDs, expected 78`);
check(traceabilityIds.size === 78, `GOV-REQ-002: traceability has ${traceabilityIds.size} unique requirement IDs, expected 78`);
check(manifestIds.size === 78, `GOV-REQ-003: manifest has ${manifestIds.size} unique requirement IDs, expected 78`);
check(sameSet(prdIds, traceabilityIds), "GOV-REQ-004: governing PRD and traceability requirement-ID sets differ");
check(sameSet(prdIds, manifestIds), "GOV-REQ-005: governing PRD and manifest requirement-ID sets differ");
check(sameSet(deferredIds, expectedDeferred), "GOV-REQ-006: deferred requirement set is not the exact approved seven IDs");
check(manifest.summary?.activeRequirementCount === 71, "GOV-REQ-007: active requirement count is not 71");

const tasks = manifest.tasks ?? [];
const taskIds = new Set(tasks.map((task) => task.id));
const taskById = new Map(tasks.map((task) => [task.id, task]));
check(tasks.length === 58 && taskIds.size === 58, `GOV-TASK-001: got ${tasks.length}/${taskIds.size} total/unique tasks, expected 58/58`);
check(tasks.filter((task) => task.milestone !== "R10").length === 55, "GOV-TASK-002: P0/R0-R9 task count is not 55");
check(tasks.filter((task) => task.milestone === "R10").length === 3, "GOV-TASK-003: R10 task count is not 3");
const actualStatuses = countBy(tasks.map((task) => task.status));
const expectedStatuses = { Backlog: 40, Done: 13, "In progress": 1, Next: 4 };
check(JSON.stringify(actualStatuses) === JSON.stringify(expectedStatuses), `GOV-TASK-004: status counts are ${JSON.stringify(actualStatuses)}, expected ${JSON.stringify(expectedStatuses)}`);
check(
  tasks.filter((task) => task.milestone === "R10").every((task) => task.startDate === null && task.targetDate === null),
  "GOV-TASK-005: every R10 task must have null start and target dates",
);
check(
  manifest.releases.find((release) => release.id === "R10")?.startDate === null
    && manifest.releases.find((release) => release.id === "R10")?.targetDate === null,
  "GOV-TASK-006: the R10 milestone must have null start and target dates",
);
check(Object.keys(issueMap).length === 58 && sameSet(new Set(Object.keys(issueMap)), taskIds), "GOV-TASK-007: public issue-map IDs must equal the 58 manifest task IDs");
const repositoryUrl = "https://github.com/arunpr614/Life-Reflection";
const artifactKinds = [...ARTIFACT_KINDS];
const councilSeats = [...COUNCIL_SEATS];
const designStateDimensions = [...DESIGN_STATE_DIMENSIONS];
const designAccessibilityDimensions = [...DESIGN_ACCESSIBILITY_DIMENSIONS];
const allowedArtifactStates = new Set(["missing", "draft", "in-review", "approved", "blocked", "not-applicable"]);
check(JSON.stringify(artifactKinds) === JSON.stringify(["product", "architecture", "design", "qa", "delivery", "council"]), "GOV-SCHEMA-001: evaluator artifact-kind set is not the exact six-task dossier contract");
check(JSON.stringify(councilSeats) === JSON.stringify(["product", "design", "architecture", "qa", "project"]), "GOV-SCHEMA-002: evaluator Council-seat set is not the exact five-seat contract");
check(JSON.stringify(designStateDimensions) === JSON.stringify(["normal", "empty", "loading", "error", "interruption", "destructive"]), "GOV-SCHEMA-003: evaluator Design-state dimensions have drifted");
check(JSON.stringify(designAccessibilityDimensions) === JSON.stringify(["keyboard", "focus", "screenReader", "targetSize", "contrast", "zoom", "reducedMotion"]), "GOV-SCHEMA-004: evaluator Design-accessibility dimensions have drifted");
const artifactSuffix = Object.freeze({
  product: "PRD",
  architecture: "TECHNICAL-PLAN",
  design: "DESIGN-SPEC",
  qa: "QA-PLAN",
  delivery: "DELIVERY-CHECKLIST",
  council: "COUNCIL-READINESS",
});
const jsonEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const expectedP0R0ScopeTaskIds = [
  "AUD-001", "PC-001", "PRD-R0-001", "SPK-R0-001", "UX-R0-001", "ARCH-R0-001", "ENG-R0-001", "REL-R0-001",
];
const expectedP0R0SubstantiveTaskIds = ["SPK-R0-001", "UX-R0-001", "ARCH-R0-001", "ENG-R0-001", "REL-R0-001"];
const expectedP0R0HistoricalTaskIds = ["AUD-001", "PC-001", "PRD-R0-001"];
check(jsonEqual(P0_R0_SCOPE_TASK_IDS, expectedP0R0ScopeTaskIds), "GOV-STAGE-001: bounded P0/R0 scope task IDs drifted");
check(jsonEqual(P0_R0_SUBSTANTIVE_TASK_IDS, expectedP0R0SubstantiveTaskIds), "GOV-STAGE-002: substantive R0 stage task IDs drifted");
check(jsonEqual(DELIVERY_TRANSITION_GATE_B_CONTRACT.taskIds, expectedP0R0SubstantiveTaskIds),
  "GOV-STAGE-017: delivery-transition task allowlist is not the exact five substantive R0 tasks");
check(DELIVERY_TRANSITION_GATE_B_CONTRACT.stageIdSuffix === "-DELIVERY-TRANSITION"
  && DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass === "delivery-control"
  && DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass === "delivery-status-transition"
  && DELIVERY_TRANSITION_GATE_B_CONTRACT.moduleId === "p0.delivery-transition"
  && DELIVERY_TRANSITION_GATE_B_CONTRACT.modulePath === "tools/P0-delivery-transition.mjs",
"GOV-STAGE-018: delivery-transition Gate-B contract drifted");
check(jsonEqual(SCOPE_ACTION_COMPATIBILITY[DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass], [
  DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass,
]), "GOV-STAGE-019: delivery-control scope is not closed to one status-transition action");
check(Object.values(TASK_EXECUTION_CONTRACT).every((contract) => (
  contract.scopeActions[DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass] === undefined
)), "GOV-STAGE-020: ordinary task execution contract borrowed delivery-transition authority");
check(!OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-001"].requiredForScopeClasses
  .includes(DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass)
  && !OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-002"].requiredForScopeClasses
    .includes(DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass),
"GOV-STAGE-021: delivery transition incorrectly requires P0-OA-001 or P0-OA-002");
check(jsonEqual(OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-002"].requiredForScopeClasses, ["private-execution"])
  && jsonEqual(OWNER_ACTION_REQUIREMENT_CATALOG["P0-OA-002"].requiredForActionClasses, [
    "project-workflow-mutation", "project-non-delivery-item",
  ]), "GOV-STAGE-022: P0-OA-002 no longer remains exclusive to private workflow/non-delivery mutations");
check(jsonEqual(STAGE_LIFECYCLE_STATES, [
  "declared", "ready", "running", "verification-pending", "recovery-required", "rolling-back",
  "verified-complete", "verified-rolled-back", "cancelled-before-mutation", "blocked-no-mutation", "expired-before-mutation",
]), "GOV-STAGE-003: stage lifecycle vocabulary drifted");
check(jsonEqual(TERMINAL_STAGE_STATES, [
  "verified-complete", "verified-rolled-back", "cancelled-before-mutation", "blocked-no-mutation", "expired-before-mutation",
]), "GOV-STAGE-004: terminal stage vocabulary drifted");
check(hasExactKeys(stageApprovalRegistry, [
  "schemaVersion", "registryId", "scopeTaskIds", "historicalNonAuthorizingTaskIds", "preparationReviews", "stageApprovals",
]), "GOV-STAGE-005: stage-approval registry top-level schema contains missing or unknown fields");
check(stageApprovalRegistry.schemaVersion === STAGE_EXECUTION_SCHEMA_VERSION, "GOV-STAGE-006: stage-approval registry schema version drifted");
check(stageApprovalRegistry.registryId === "P0-R0-STAGE-APPROVAL-REGISTRY", "GOV-STAGE-007: stage-approval registry ID drifted");
check(jsonEqual(stageApprovalRegistry.scopeTaskIds, expectedP0R0SubstantiveTaskIds), "GOV-STAGE-008: stage-approval registry scope is not the exact five substantive tasks");
check(jsonEqual(stageApprovalRegistry.historicalNonAuthorizingTaskIds, expectedP0R0HistoricalTaskIds), "GOV-STAGE-009: stage-approval historical denylist drifted");
const stageApprovals = Array.isArray(stageApprovalRegistry.stageApprovals) ? stageApprovalRegistry.stageApprovals : [];
const preparationReviews = Array.isArray(stageApprovalRegistry.preparationReviews) ? stageApprovalRegistry.preparationReviews : [];
check(Array.isArray(stageApprovalRegistry.preparationReviews), "GOV-STAGE-010: preparationReviews is not an array");
check(Array.isArray(stageApprovalRegistry.stageApprovals), "GOV-STAGE-010: stageApprovals is not an array");
check(new Set(preparationReviews.map((record) => record?.preparationReviewId)).size === preparationReviews.length,
  "GOV-STAGE-011: preparation review IDs are duplicated");
check(new Set(preparationReviews.map((record) => record?.stageId)).size === preparationReviews.length,
  "GOV-STAGE-011: preparation review stage IDs are duplicated");
check(new Set(stageApprovals.map((record) => record?.stageId)).size === stageApprovals.length, "GOV-STAGE-011: stage approval IDs are duplicated");
check(new Set(stageApprovals.map((record) => record?.idempotencyKey)).size === stageApprovals.length, "GOV-STAGE-012: stage idempotency keys are duplicated");
const stageRegistryValidation = validateStageApprovalRegistry(stageApprovalRegistry);
check(stageRegistryValidation.ok, `GOV-STAGE-013: stage approval registry is invalid (${stageRegistryValidation.code})`);
const stageLifecycleValidation = validateStageRuntimeLifecycle({
  registry: stageApprovalRegistry,
  definitions: PRODUCTION_STAGED_ACTIONS,
  moduleBindings: PRODUCTION_MODULE_METADATA,
  outcomeVerificationModuleIds: PRODUCTION_OUTCOME_VERIFICATION_MODULE_IDS,
});
check(stageLifecycleValidation.ok,
  `GOV-STAGE-016: stage registry/runtime lifecycle is invalid (${stageLifecycleValidation.code})`);
const stageHistoryRun = async (command, args, options = {}) => {
  try {
    return {
      ok: true,
      status: 0,
      stdout: execFileSync(command, args, {
        cwd: options.cwd ?? repoRoot,
        encoding: options.encoding === null ? null : "utf8",
        env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
        maxBuffer: 64 * 1024 * 1024,
      }),
    };
  } catch (error) {
    return {
      ok: false,
      status: Number.isSafeInteger(error?.status) ? error.status : 1,
      stdout: options.encoding === null ? Buffer.alloc(0) : "",
    };
  }
};
let stageRegistryTrackedAtHead = false;
let stageRegistryHeadBytes = null;
let stageRegistryHeadInspectionOk = false;
if (fullCommitPattern.test(headRevision ?? "")) {
  try {
    const tree = execFileSync("git", ["ls-tree", headRevision, "--", stageApprovalRegistryPath], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
    stageRegistryTrackedAtHead = tree !== "";
    stageRegistryHeadInspectionOk = true;
    if (stageRegistryTrackedAtHead) {
      stageRegistryHeadBytes = execFileSync("git", ["show", `${headRevision}:${stageApprovalRegistryPath}`], {
        cwd: repoRoot,
        encoding: null,
        maxBuffer: 64 * 1024 * 1024,
      });
    }
  } catch {
    stageRegistryTrackedAtHead = false;
    stageRegistryHeadBytes = null;
    stageRegistryHeadInspectionOk = false;
  }
}
check(stageRegistryHeadInspectionOk, "GOV-STAGE-014: committed HEAD stage-registry inspection failed");
if (stageRegistryHeadInspectionOk && stageRegistryTrackedAtHead && fullCommitPattern.test(headRevision ?? "")) {
  check(stageRegistryHeadBytes?.equals(fs.readFileSync(path.join(repoRoot, stageApprovalRegistryPath))) === true,
    "GOV-STAGE-014: stage registry worktree bytes differ from committed HEAD");
  const continuity = await verifyStageApprovalRegistryContinuity({
    repoRoot,
    run: stageHistoryRun,
    publishedRef: headRevision,
  });
  check(continuity.ok,
    `GOV-STAGE-015: global stage registry continuity is invalid (${continuity.code})`);
  for (const record of preparationReviews) {
    const history = await verifyPreparationReviewRegistryHistory({
      repoRoot,
      run: stageHistoryRun,
      publishedRef: headRevision,
      fetchedMainRevision,
      preparationReviewId: record.preparationReviewId,
      continuity,
    });
    check(history.ok && history.preparationProofVerified === true,
      `GOV-STAGE-017: ${record.preparationReviewId ?? "unknown preparation"} history or Gate A replay proof is invalid (${history.code})`);
  }
  for (const record of stageApprovals) {
    const history = await verifyStageApprovalRegistryHistory({
      repoRoot,
      run: stageHistoryRun,
      publishedRef: headRevision,
      fetchedMainRevision,
      stageId: record.stageId,
      continuity,
    });
    check(history.ok && history.preparationProofVerified === true,
      `GOV-STAGE-018: ${record.stageId ?? "unknown stage"} history or Gate A replay proof is invalid (${history.code})`);
  }
} else if (stageRegistryHeadInspectionOk) {
  const bootstrapStats = fs.lstatSync(path.join(repoRoot, stageApprovalRegistryPath));
  check(headRevision === STAGE_APPROVAL_REGISTRY_BOOTSTRAP_PARENT_REVISION
    && bootstrapStats.isFile()
    && (bootstrapStats.mode & 0o777) === 0o644
    && preparationReviews.length === 0
    && stageApprovals.length === 0,
  "GOV-STAGE-015: uncommitted bootstrap registry must be an empty regular file at the exact Stage 0 parent");
}
const expectedArtifactPath = (taskId, kind) => `docs/work-items/${taskId}/P0-${taskId}-${artifactSuffix[kind]}.md`;
const actualArtifactInputs = (task) => Object.fromEntries(artifactKinds.map((kind) => {
  const filePath = expectedArtifactPath(task.id, kind);
  const absolutePath = path.join(repoRoot, filePath);
  const exists = fs.existsSync(absolutePath);
  const content = exists ? fs.readFileSync(absolutePath, "utf8") : "";
  const markers = exists
    ? parseArtifactControlMarkers(content, { taskId: task.id, artifactKind: kind })
    : { valid: false, artifactState: null };
  const contentState = markers.artifactState ?? "missing";
  const digest = exists ? sha256(content) : null;
  return [kind, {
    required: true,
    path: filePath,
    url: `${repositoryUrl}/blob/main/${filePath}`,
    contentState,
    sha256: digest,
    observedSha256: digest,
    markersValid: exists && markers.valid && allowedArtifactStates.has(contentState),
  }];
}));

check(Array.isArray(artifactRegister.tasks) && artifactRegister.tasks.length === 58 && dossierById.size === 58, "GOV-DOR-001: task-artifact register must have 58 unique records");
check(sameSet(new Set(dossierById.keys()), taskIds), "GOV-DOR-002: task-artifact register IDs must equal manifest task IDs");
check(jsonEqual(artifactRegister.tasks.map((record) => record.taskId), tasks.map((task) => task.id)), "GOV-DOR-048: task-artifact register order differs from the canonical manifest order");
check(artifactRegister.schemaVersion === READINESS_SCHEMA_VERSION, `GOV-DOR-039: register schema version is not ${READINESS_SCHEMA_VERSION}`);
check(hasExactKeys(artifactRegister, [
  "schemaVersion", "generatedAt", "authenticMediaAccessed", "privateNetworkAccessed", "evaluationTimeBasis", "readinessStatePath",
  "readinessStateUrl", "reviewerRegistryPath", "approvalRegistryPath", "ownerActionStatePath", "policyPath", "policyUrl", "artifactStates",
  "councilVerdicts", "startRule", "sourceEvidenceModel", "summary", "tasks",
]), "GOV-DOR-043: artifact-register top-level schema contains missing or unknown fields");
check(jsonEqual(artifactRegister.sourceEvidenceModel, {
  schemaVersion: READINESS_SCHEMA_VERSION,
  artifactReviewDecisions: ["hold", "approved", "not-applicable"],
  councilSeatVerdicts: ["hold", "approved", "not-applicable"],
  designStateDimensions,
  designAccessibilityDimensions,
  requestedScopeClasses: ["local-synthetic", "delivery-control", "private-execution", "release"],
  scopeActionCompatibility: SCOPE_ACTION_COMPATIBILITY,
  taskFilePurposes: TASK_FILE_PURPOSES,
  taskFileGitModes: TASK_FILE_GIT_MODES,
  taskFileDiffExclusions: TASK_FILE_DIFF_EXCLUSIONS,
  taskFileDescendantDeltaPaths: TASK_FILE_DESCENDANT_DELTA_PATHS,
  derivedOverridesForbidden: true,
}), "GOV-DOR-044: artifact-register source-evidence model differs from the executable schema");
check(readinessState.schemaVersion === READINESS_SCHEMA_VERSION, `GOV-DOR-040: readiness schema version is not ${READINESS_SCHEMA_VERSION}`);
check(hasExactKeys(readinessState, [
  "schemaVersion", "asOf", "evidenceBoundary", "approvalRegistryPath", "reviewerRegistryPath", "ownerActionStatePath", "taskOverrides",
]), "GOV-DOR-041: readiness-state top-level schema contains missing or unknown fields");
check(Number.isFinite(Date.parse(readinessState.asOf ?? "")), "GOV-DOR-046: readiness-state asOf is not a valid timestamp");
check(readinessState.taskOverrides !== null && typeof readinessState.taskOverrides === "object" && !Array.isArray(readinessState.taskOverrides), "GOV-DOR-047: readiness-state taskOverrides is not an object");
for (const [field, expected] of Object.entries({
  readinessStatePath,
  reviewerRegistryPath,
  approvalRegistryPath,
  ownerActionStatePath,
})) {
  check(artifactRegister[field] === expected, `GOV-DOR-033: register ${field} is not ${expected}`);
  if (field !== "readinessStatePath") check(readinessState[field] === expected, `GOV-DOR-034: readiness-state ${field} is not ${expected}`);
}
check(
  artifactRegister.readinessStateUrl === `${repositoryUrl}/blob/main/${readinessStatePath}`,
  "GOV-DOR-035: readiness-state URL/path mismatch",
);
try {
  validateReadinessState(readinessState, taskIds);
} catch (error) {
  failures.push(`GOV-DOR-036: ${error.message}`);
}
for (const [taskId, override] of Object.entries(readinessState.taskOverrides ?? {})) {
  check(!Object.hasOwn(override, "approvalPublication"), `GOV-DOR-042: ${taskId} cannot source approval publication from mutable readiness state`);
}

const expectedReviewerRoles = new Set(["implementation", "product", "design", "architecture", "qa", "project", "evidence-producer", "owner-authority"]);
const reviewerRecords = Array.isArray(reviewerRegistry.reviewers) ? reviewerRegistry.reviewers : [];
const reviewerIds = reviewerRecords.map((record) => record?.reviewerId);
const reviewerRoles = reviewerRecords.map((record) => record?.role);
check(reviewerRegistry.schemaVersion === "1.0.0", "GOV-ID-001: reviewer registry schema is not 1.0.0");
check(hasExactKeys(reviewerRegistry, ["schemaVersion", "asOf", "evidenceBoundary", "reviewers"]), "GOV-ID-008: reviewer-registry top-level schema contains missing or unknown fields");
check(reviewerRecords.length === 8 && new Set(reviewerIds).size === reviewerIds.length, "GOV-ID-002: reviewer registry must contain eight unique identities");
check(sameSet(new Set(reviewerRoles), expectedReviewerRoles), "GOV-ID-003: reviewer registry does not contain exactly one identity for every required role");
for (const record of reviewerRecords) {
  check(/^[a-z][a-z0-9-]{5,}$/.test(record?.reviewerId ?? ""), `GOV-ID-004: invalid public-safe reviewer ID ${record?.reviewerId}`);
  check(expectedReviewerRoles.has(record?.role), `GOV-ID-005: ${record?.reviewerId} has unknown role ${record?.role}`);
  check(["agent", "human"].includes(record?.identityClass), `GOV-ID-010: ${record?.reviewerId} has invalid identity class`);
  check(record?.role === "owner-authority" ? record?.identityClass === "human" : record?.identityClass === "agent", `GOV-ID-011: ${record?.reviewerId} role/identity class is invalid`);
  check(record?.active === true || record?.active === false, `GOV-ID-006: ${record?.reviewerId} lacks an explicit active Boolean`);
  check(!Object.hasOwn(record ?? {}, "roles"), `GOV-ID-007: ${record?.reviewerId} must bind exactly one role, not a roles array`);
  check(hasExactKeys(record, ["reviewerId", "role", "identityClass", "active"]), `GOV-ID-009: ${record?.reviewerId} reviewer record contains missing or unknown fields`);
}

const successorGenesisPath = "docs/council/execution/control-reviews/P0-SUCCESSOR-CONTROL-REVIEW-GENESIS.json";
const successorGenesisTracked = gitSuccess(["ls-files", "--error-unmatch", successorGenesisPath]);
check(fs.existsSync(path.join(repoRoot, successorGenesisPath)), "GOV-SUCCESSOR-001: successor control-review genesis is missing");
if (successorGenesisTracked) {
  const successorResult = verifySuccessorControlReviews({ repoRoot, currentRevision: "HEAD" });
  check(successorResult.ok === true, `GOV-SUCCESSOR-002: successor control-review trust failed: ${successorResult.findings.join(", ")}`);
  check(successorResult.runtimeAuthority === false
    && successorResult.taskApprovalEffect === "none"
    && successorResult.permissionEffect === "none", "GOV-SUCCESSOR-003: successor review has an authority or permission effect");
}

const runningLogGenesisTracked = gitSuccess(["ls-files", "--error-unmatch", RUNNING_LOG_GENESIS_PATH]);
check(fs.existsSync(path.join(repoRoot, RUNNING_LOG_GENESIS_PATH)), "GOV-LOG-001: running-log trust genesis is missing");
if (runningLogGenesisTracked) {
  let runningLogTrust;
  try {
    runningLogTrust = verifyRunningLogTrust({
      repoRoot,
      genesis: readJson(RUNNING_LOG_GENESIS_PATH),
      currentRevision: "HEAD",
      verifyWorktree: true,
      reviewerRecords,
    });
  } catch {
    runningLogTrust = { ok: false, findings: ["RUNNING_LOG_TRUST_UNAVAILABLE"] };
  }
  check(runningLogTrust.ok === true, `GOV-LOG-002: append-only running-log trust failed: ${runningLogTrust.findings.join(", ")}`);
  check(runningLogTrust.evidenceEffect?.executionAllowed === false
    && runningLogTrust.evidenceEffect?.taskApprovalEffect === "none", "GOV-LOG-003: running-log evidence changes task approval or permission");
}

const expectedActionIds = new Set(Object.keys(OWNER_ACTION_REQUIREMENT_CATALOG));
const ownerActions = ownerActionState.actions && typeof ownerActionState.actions === "object" && !Array.isArray(ownerActionState.actions)
  ? ownerActionState.actions
  : {};
check(ownerActionState.schemaVersion === "1.0.0", "GOV-ACTION-001: owner-action state schema is not 1.0.0");
check(ownerActionState.actions !== null && typeof ownerActionState.actions === "object" && !Array.isArray(ownerActionState.actions), "GOV-ACTION-012: owner-action actions is not an object");
check(hasExactKeys(ownerActionState, ["schemaVersion", "asOf", "sourceLedgerPath", "evidenceBoundary", "actions"]), "GOV-ACTION-010: owner-action top-level schema contains missing or unknown fields");
check(ownerActionState.sourceLedgerPath === "docs/council/execution/P0-OWNER-ACTION-LEDGER.md", "GOV-ACTION-002: owner-action state is detached from the canonical ledger");
check(sameSet(new Set(Object.keys(ownerActions)), expectedActionIds), "GOV-ACTION-003: owner-action state does not contain the exact 16 canonical action IDs");
const actionRecordIds = Object.values(ownerActions).map((record) => record?.actionId);
check(new Set(actionRecordIds).size === actionRecordIds.length, "GOV-ACTION-004: owner-action records contain duplicate action IDs");
for (const [actionId, record] of Object.entries(ownerActions)) {
  const canonicalRequirement = OWNER_ACTION_REQUIREMENT_CATALOG[actionId];
  check(record?.actionId === actionId, `GOV-ACTION-005: owner-action key ${actionId} differs from its record ID`);
  check(["pending", "not-triggered", "complete"].includes(record?.status), `GOV-ACTION-006: ${actionId} has invalid status ${record?.status}`);
  check(Array.isArray(record?.requiredForScopeClasses) && new Set(record.requiredForScopeClasses).size === record.requiredForScopeClasses.length, `GOV-ACTION-007: ${actionId} scope classes are absent or duplicated`);
  check(Array.isArray(record?.requiredForActionClasses) && new Set(record.requiredForActionClasses).size === record.requiredForActionClasses.length, `GOV-ACTION-008: ${actionId} action classes are absent or duplicated`);
  check(record?.accountableHumanRole === canonicalRequirement?.accountableHumanRole, `GOV-ACTION-013: ${actionId} accountable human role differs from the canonical requirement`);
  check(jsonEqual(record?.requiredForScopeClasses, canonicalRequirement?.requiredForScopeClasses), `GOV-ACTION-016: ${actionId} scope classes differ from the immutable canonical requirement`);
  check(jsonEqual(record?.requiredForActionClasses, canonicalRequirement?.requiredForActionClasses), `GOV-ACTION-017: ${actionId} action classes differ from the immutable canonical requirement`);
  check(record?.accountableHumanId === null || /^[a-z][a-z0-9-]{5,}$/.test(record.accountableHumanId), `GOV-ACTION-014: ${actionId} has an invalid accountable human ID`);
  check(record?.ownerAttestationReference === null || isOpaqueEvidenceReference(record.ownerAttestationReference), `GOV-ACTION-015: ${actionId} has an invalid owner attestation reference`);
  check(hasExactKeys(record, [
    "actionId", "accountableHumanRole", "accountableHumanId", "ownerAttestationReference", "status", "requiredForScopeClasses",
    "requiredForActionClasses", "result", "verifierId", "verifierRole", "verifiedAt", "candidateRevision", "dossierDigest", "evidenceReference",
  ]), `GOV-ACTION-011: ${actionId} owner-action record contains missing or unknown fields`);
}

const taskApprovals = approvalRegistry.taskApprovals && typeof approvalRegistry.taskApprovals === "object" && !Array.isArray(approvalRegistry.taskApprovals)
  ? approvalRegistry.taskApprovals
  : {};
const controlReviews = approvalRegistry.controlReviews && typeof approvalRegistry.controlReviews === "object" && !Array.isArray(approvalRegistry.controlReviews)
  ? approvalRegistry.controlReviews
  : {};
check(approvalRegistry.schemaVersion === "1.1.0", "GOV-APPROVAL-001: approval registry schema is not 1.1.0");
check(approvalRegistry.taskApprovals !== null && typeof approvalRegistry.taskApprovals === "object" && !Array.isArray(approvalRegistry.taskApprovals), "GOV-APPROVAL-036: approval-registry taskApprovals is not an object");
check(approvalRegistry.controlReviews !== null && typeof approvalRegistry.controlReviews === "object" && !Array.isArray(approvalRegistry.controlReviews), "GOV-CONTROL-001: approval-registry controlReviews is not an object");
check(hasExactKeys(approvalRegistry, ["schemaVersion", "asOf", "evidenceBoundary", "reviewerRegistryPath", "ownerActionStatePath", "controlReviews", "taskApprovals"]), "GOV-APPROVAL-024: approval-registry top-level schema contains missing or unknown fields");
check(approvalRegistry.reviewerRegistryPath === reviewerRegistryPath, "GOV-APPROVAL-002: approval registry does not bind the canonical reviewer registry");
check(approvalRegistry.ownerActionStatePath === ownerActionStatePath, "GOV-APPROVAL-037: approval registry does not bind the canonical owner-action state");
const unknownControlReviewTasks = Object.keys(controlReviews)
  .filter((taskId) => !taskIds.has(taskId) || taskId !== CONTROL_REVIEW_TASK_ID);
check(unknownControlReviewTasks.length === 0, `GOV-CONTROL-002: controlReviews contains a task outside the closed control-review allowlist: ${unknownControlReviewTasks.join(", ")}`);
const controlReviewVerificationKeys = [
  "nodeVersion", "gitVersion", "readinessAssertions", "startVerifierCases", "syncSelfTestCases", "controlReviewTrustAssertions",
  "generatedPathCount", "validatorPassed", "generatorChangedPaths", "dryRunDeterministic",
  "workbookSha256", "manifestSha256", "reviewerRegistrySha256", "workbookDisposition", "authenticMediaAccessed",
  "privateNetworkAccessed", "deploymentState",
];
check(!Object.hasOwn(taskApprovals, CONTROL_REVIEW_TASK_ID),
  `GOV-CONTROL-043: ${CONTROL_REVIEW_TASK_ID} must remain absent from taskApprovals`);
let controlReviewContinuity = {
  ok: false,
  code: "CONTROL_REVIEW_CONTINUITY_UNAVAILABLE",
  publicationRevision: null,
};
try {
  const currentRevision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, encoding: "utf8" }).trim();
  if (!revisionIsAncestorOfHead(CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION)) {
    throw new Error("Accepted Gate A base is not an ancestor of HEAD");
  }
  const registryAt = (revision) => {
    if (revision === CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION
      && !gitSuccess(["cat-file", "-e", `${revision}:${approvalRegistryPath}`])) {
      return { taskApprovals: {} };
    }
    return parseJsonWithoutDuplicateKeys(
      execFileSync("git", ["show", `${revision}:${approvalRegistryPath}`], {
        cwd: repoRoot,
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
      }),
      `${revision}:${approvalRegistryPath}`,
    );
  };
  const laterRevisions = execFileSync("git", [
    "rev-list", "--reverse", "--topo-order", "--ancestry-path",
    `${CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION}..${currentRevision}`,
  ], { cwd: repoRoot, encoding: "utf8" }).split(/\r?\n/).map((revision) => revision.trim()).filter(Boolean);
  const historyRevisions = [CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION, ...laterRevisions];
  controlReviewContinuity = validateControlReviewRegistryContinuity({
    taskId: CONTROL_REVIEW_TASK_ID,
    currentRegistry: approvalRegistry,
    historyEntries: historyRevisions.map((revision) => ({ revision, registry: registryAt(revision) })),
    isAncestor: (ancestor, descendant) => gitSuccess(["merge-base", "--is-ancestor", ancestor, descendant]),
  });
} catch {
  controlReviewContinuity = {
    ok: false,
    code: "CONTROL_REVIEW_CONTINUITY_UNAVAILABLE",
    publicationRevision: null,
  };
}
check(controlReviewContinuity.ok === true,
  `GOV-CONTROL-049: ${CONTROL_REVIEW_TASK_ID} repository-wide control-review continuity failed: ${controlReviewContinuity.code}`);
for (const [taskId, review] of Object.entries(controlReviews)) {
  check(hasExactKeys(review, CONTROL_REVIEW_RECORD_KEYS), `GOV-CONTROL-003: ${taskId} control review contains missing or unknown fields`);
  check(review?.taskId === taskId, `GOV-CONTROL-004: ${taskId} control review key differs from its task ID`);
  check(new RegExp(`^P0-${taskId}-[A-Z0-9-]+$`).test(review?.reviewId ?? ""), `GOV-CONTROL-005: ${taskId} control review ID is not P0-prefixed and task-bound`);
  check(review?.reviewType === "non-authorizing-control-implementation", `GOV-CONTROL-006: ${taskId} control review type is not audit-only`);
  const reviewDate = /^\d{4}-\d{2}-\d{2}$/.test(review?.reviewDate ?? "")
    ? new Date(`${review.reviewDate}T00:00:00.000Z`)
    : null;
  check(reviewDate instanceof Date && Number.isFinite(reviewDate.valueOf())
    && reviewDate.toISOString().slice(0, 10) === review.reviewDate, `GOV-CONTROL-007: ${taskId} control review date is invalid`);
  check(SCOPE_ACTION_COMPATIBILITY[review?.requestedScopeClass]?.includes(review?.requestedActionClass)
    && isTaskMilestoneScopeActionCompatible({
      taskId,
      milestone: taskById.get(taskId)?.milestone,
      scopeClass: review?.requestedScopeClass,
      actionClass: review?.requestedActionClass,
    }), `GOV-CONTROL-008: ${taskId} control review scope/action is incompatible with its task/milestone contract`);
  check(review?.executionAllowed === false, `GOV-CONTROL-009: ${taskId} audit-only control review cannot allow execution`);
  check(review?.disposition === "accepted-local-public-control-implementation", `GOV-CONTROL-010: ${taskId} control review disposition is not the closed accepted value`);
  check(Array.isArray(review?.unresolvedVetoes) && review.unresolvedVetoes.length === 0, `GOV-CONTROL-011: ${taskId} control review retains a veto`);
  check(review?.permittedClaim === CONTROL_REVIEW_PERMITTED_CLAIM, `GOV-CONTROL-012: ${taskId} control review lacks the exact bounded permitted claim`);
  check(/^[0-9a-f]{64}$/.test(review?.reviewContextSha256 ?? "")
    && review.reviewContextSha256 === computeControlReviewContextSha256(review), `GOV-CONTROL-042: ${taskId} control-review context digest is invalid`);
  check(taskApprovals[taskId] === undefined, `GOV-CONTROL-043: ${taskId} control review may not populate taskApprovals`);

  const candidate = review?.candidate;
  check(hasExactKeys(candidate, [
    "baseRevision", "revision", "dossierDigest", "taskContractSha256", "artifacts", "taskFiles",
    "taskFilesSha256", "implementerIds", "evidenceProducerIds",
  ]), `GOV-CONTROL-013: ${taskId} control-review candidate contains missing or unknown fields`);
  const taskFilesValidation = validateTaskFilesManifest({
    taskId,
    taskFiles: candidate?.taskFiles,
    artifacts: candidate?.artifacts,
    scopeClass: review?.requestedScopeClass,
  });
  check(candidate?.baseRevision === CONTROL_REVIEW_ACCEPTED_GATE_A_BASE_REVISION
    && candidate?.baseRevision !== candidate?.revision,
  `GOV-CONTROL-014: ${taskId} candidate base is not the exact accepted Gate A merge`);
  check(fullCommitPattern.test(candidate?.revision ?? "") && revisionExists(candidate?.revision), `GOV-CONTROL-015: ${taskId} candidate revision is invalid or unavailable`);
  check(/^sha256:[0-9a-f]{64}$/.test(candidate?.dossierDigest ?? ""), `GOV-CONTROL-016: ${taskId} candidate dossier digest is invalid`);
  check(/^[0-9a-f]{64}$/.test(candidate?.taskContractSha256 ?? ""), `GOV-CONTROL-017: ${taskId} candidate task-contract digest is invalid`);
  check(taskFilesValidation.valid && candidate?.taskFilesSha256 === taskFilesValidation.sha256, `GOV-CONTROL-018: ${taskId} candidate task-file manifest is invalid`);
  check(sameSet(new Set(Object.keys(candidate?.artifacts ?? {})), new Set(artifactKinds)), `GOV-CONTROL-019: ${taskId} candidate does not bind six artifacts`);
  check(candidate?.dossierDigest === computeDossierDigest({
    taskId,
    revision: candidate?.revision,
    baseRevision: candidate?.baseRevision,
    artifacts: candidate?.artifacts,
    taskFilesSha256: candidate?.taskFilesSha256,
  }), `GOV-CONTROL-020: ${taskId} candidate dossier digest is not canonical`);
  for (const field of ["implementerIds", "evidenceProducerIds"]) {
    const ids = candidate?.[field];
    check(Array.isArray(ids) && ids.length > 0 && new Set(ids).size === ids.length, `GOV-CONTROL-021: ${taskId} candidate ${field} are absent or duplicated`);
  }
  let candidateGitBytesValid = false;
  let candidateTaskContractValid = false;
  const candidateFacts = {
    candidateManifestSha256: null,
    publicationManifestSha256: null,
    candidateReviewerRegistrySha256: null,
    publicationReviewerRegistrySha256: null,
    candidateEvidenceWorkbookCount: 0,
    candidateEvidenceWorkbookPurpose: null,
    candidateEvidenceWorkbookSha256: null,
    candidateCanonicalWorkbookSha256: null,
    publicationEvidenceWorkbookSha256: null,
    publicationCanonicalWorkbookSha256: null,
    publicationTaskFilesSha256: null,
    candidateStableTaskFilesSha256: null,
    headStableTaskFilesSha256: null,
    worktreeStableTaskFilesSha256: null,
    publicationDescendantDeltaPaths: null,
    publicationForbiddenDeltaPathCount: null,
  };
  let candidateEvidenceWorkbookPath = null;
  let boundControlReviewReviewerRecords = [];
  try {
    const parentLine = execFileSync("git", ["rev-list", "--parents", "-n", "1", candidate.revision], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim().split(/\s+/);
    const forbiddenDiff = execFileSync("git", ["diff", "--name-only", "-z", "--diff-filter=DRT", candidate.baseRevision, candidate.revision], {
      cwd: repoRoot,
      encoding: null,
    });
    const expectedPaths = execFileSync("git", ["diff", "--name-only", "-z", "--diff-filter=AM", candidate.baseRevision, candidate.revision], {
      cwd: repoRoot,
      encoding: null,
    }).toString("utf8").split("\0").filter(Boolean)
      .filter((filePath) => !TASK_FILE_DIFF_EXCLUSIONS.includes(filePath)).sort();
    const actualPaths = candidate.taskFiles.map((entry) => entry.path).sort();
    const candidateManifestBytes = execFileSync("git", ["show", `${candidate.revision}:${manifestPath}`], {
      cwd: repoRoot,
      encoding: null,
      maxBuffer: 64 * 1024 * 1024,
    });
    const candidateManifestText = candidateManifestBytes.toString("utf8");
    const candidateManifest = parseJsonWithoutDuplicateKeys(candidateManifestText, `${candidate.revision}:${manifestPath}`);
    const candidateReviewerRegistryBytes = execFileSync("git", ["show", `${candidate.revision}:${reviewerRegistryPath}`], {
      cwd: repoRoot,
      encoding: null,
      maxBuffer: 64 * 1024 * 1024,
    });
    const candidateReviewerRegistry = parseJsonWithoutDuplicateKeys(
      candidateReviewerRegistryBytes.toString("utf8"),
      `${candidate.revision}:${reviewerRegistryPath}`,
    );
    boundControlReviewReviewerRecords = Array.isArray(candidateReviewerRegistry.reviewers)
      ? candidateReviewerRegistry.reviewers
      : [];
    const candidateTask = candidateManifest.tasks?.find((task) => task.id === taskId);
    candidateTaskContractValid = Boolean(candidateTask)
      && candidateTask.milestone === taskById.get(taskId)?.milestone
      && candidate.taskContractSha256 === computeTaskContractSha256({
        taskId,
        outcome: candidateTask.description,
        requirementIds: candidateTask.requirementIds,
        dependencyIds: candidateTask.dependencies,
        acceptanceEvidence: candidateTask.acceptanceEvidence,
        acceptanceScenarioIds: acceptanceScenarioIdsFor(taskId),
      });
    const evidenceWorkbookPaths = taskFilesValidation.xlsxPaths;
    const evidenceWorkbookEntry = evidenceWorkbookPaths.length === 1
      ? candidate.taskFiles.find((entry) => entry.path === evidenceWorkbookPaths[0])
      : null;
    candidateEvidenceWorkbookPath = evidenceWorkbookEntry?.path ?? null;
    const candidateEvidenceWorkbookBytes = evidenceWorkbookEntry
      ? execFileSync("git", ["show", `${candidate.revision}:${evidenceWorkbookEntry.path}`], {
        cwd: repoRoot,
        encoding: null,
        maxBuffer: 64 * 1024 * 1024,
      })
      : null;
    const candidateCanonicalWorkbookBytes = execFileSync("git", ["show", `${candidate.revision}:${controlReviewCanonicalWorkbookPath}`], {
      cwd: repoRoot,
      encoding: null,
      maxBuffer: 64 * 1024 * 1024,
    });
    candidateFacts.candidateManifestSha256 = sha256(candidateManifestBytes);
    candidateFacts.candidateReviewerRegistrySha256 = sha256(candidateReviewerRegistryBytes);
    candidateFacts.candidateEvidenceWorkbookCount = evidenceWorkbookPaths.length;
    candidateFacts.candidateEvidenceWorkbookPurpose = evidenceWorkbookEntry?.purpose ?? null;
    candidateFacts.candidateEvidenceWorkbookSha256 = candidateEvidenceWorkbookBytes ? sha256(candidateEvidenceWorkbookBytes) : null;
    candidateFacts.candidateCanonicalWorkbookSha256 = sha256(candidateCanonicalWorkbookBytes);
    const stableTaskFiles = controlReviewStableTaskFiles(candidate.taskFiles);
    candidateFacts.candidateStableTaskFilesSha256 = computeControlReviewStableTaskFilesSha256(candidate.taskFiles);
    candidateFacts.headStableTaskFilesSha256 = taskFilesShaAtRevision("HEAD", stableTaskFiles);
    candidateFacts.worktreeStableTaskFilesSha256 = taskFilesShaAtWorktree(stableTaskFiles);
    candidateGitBytesValid = parentLine.length === 2
      && parentLine[1] === candidate.baseRevision
      && forbiddenDiff.length === 0
      && JSON.stringify(actualPaths) === JSON.stringify(expectedPaths)
      && candidate.taskFiles.every((entry) => {
        const treeRow = execFileSync("git", ["ls-tree", candidate.revision, "--", entry.path], {
          cwd: repoRoot,
          encoding: "utf8",
        }).trim();
        const match = treeRow.match(/^(\d+)\s+(\w+)\s+[0-9a-f]+\t/);
        const bytes = execFileSync("git", ["show", `${candidate.revision}:${entry.path}`], {
          cwd: repoRoot,
          encoding: null,
          maxBuffer: 64 * 1024 * 1024,
        });
        return match?.[1] === entry.gitMode && match?.[2] === entry.gitType && sha256(bytes) === entry.sha256;
      });
  } catch {
    candidateGitBytesValid = false;
    candidateTaskContractValid = false;
  }
  check(candidateGitBytesValid, `GOV-CONTROL-040: ${taskId} control-review candidate Git diff, mode, type, or bytes do not match`);
  check(candidateTaskContractValid, `GOV-CONTROL-041: ${taskId} control-review task contract does not match the exact candidate manifest`);
  check(revisionIsAncestorOfHead(candidate?.revision), `GOV-CONTROL-044: ${taskId} control-review candidate is not an ancestor of committed HEAD`);

  let controlReviewHistory = { ok: false, code: "CONTROL_REVIEW_HISTORY_UNAVAILABLE", publicationRevision: null };
  try {
    const currentRevision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, encoding: "utf8" }).trim();
    const registryAt = (revision) => parseJsonWithoutDuplicateKeys(
      execFileSync("git", ["show", `${revision}:${approvalRegistryPath}`], {
        cwd: repoRoot,
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
      }),
      `${revision}:${approvalRegistryPath}`,
    );
    const historyRevisions = execFileSync("git", [
      "rev-list", "--reverse", "--topo-order", "--ancestry-path", `${candidate.revision}..${currentRevision}`,
    ], { cwd: repoRoot, encoding: "utf8" }).split(/\r?\n/).map((revision) => revision.trim()).filter(Boolean);
    controlReviewHistory = validateControlReviewHistorySequence({
      taskId,
      candidateRevision: candidate.revision,
      currentRevision,
      currentRecord: review,
      candidateRegistry: registryAt(candidate.revision),
      historyEntries: historyRevisions.map((revision) => ({ revision, registry: registryAt(revision) })),
      candidateAncestorOfCurrent: revisionIsAncestorOfHead(candidate.revision),
      isAncestor: (ancestor, descendant) => gitSuccess(["merge-base", "--is-ancestor", ancestor, descendant]),
    });
  } catch {
    controlReviewHistory = { ok: false, code: "CONTROL_REVIEW_HISTORY_UNAVAILABLE", publicationRevision: null };
  }
  check(controlReviewHistory.ok === true, `GOV-CONTROL-045: ${taskId} control-review publication history failed: ${controlReviewHistory.code}`);
  check(controlReviewHistory.ok === true
    && controlReviewContinuity.publicationRevision === controlReviewHistory.publicationRevision,
  `GOV-CONTROL-050: ${taskId} candidate-relative and repository-wide first publication differ`);
  if (controlReviewHistory.ok === true && candidateEvidenceWorkbookPath) {
    try {
      const publicationBytes = (filePath) => execFileSync("git", ["show", `${controlReviewHistory.publicationRevision}:${filePath}`], {
        cwd: repoRoot,
        encoding: null,
        maxBuffer: 64 * 1024 * 1024,
      });
      candidateFacts.publicationManifestSha256 = sha256(publicationBytes(manifestPath));
      candidateFacts.publicationReviewerRegistrySha256 = sha256(publicationBytes(reviewerRegistryPath));
      candidateFacts.publicationEvidenceWorkbookSha256 = sha256(publicationBytes(candidateEvidenceWorkbookPath));
      candidateFacts.publicationCanonicalWorkbookSha256 = sha256(publicationBytes(controlReviewCanonicalWorkbookPath));
      candidateFacts.publicationTaskFilesSha256 = taskFilesShaAtRevision(
        controlReviewHistory.publicationRevision,
        candidate.taskFiles,
      );
      const publicationDelta = descendantDeltaFacts(candidate.revision, controlReviewHistory.publicationRevision);
      candidateFacts.publicationDescendantDeltaPaths = publicationDelta.paths;
      candidateFacts.publicationForbiddenDeltaPathCount = publicationDelta.forbiddenCount;
    } catch {
      candidateFacts.publicationManifestSha256 = null;
      candidateFacts.publicationReviewerRegistrySha256 = null;
      candidateFacts.publicationEvidenceWorkbookSha256 = null;
      candidateFacts.publicationCanonicalWorkbookSha256 = null;
      candidateFacts.publicationTaskFilesSha256 = null;
      candidateFacts.publicationDescendantDeltaPaths = null;
      candidateFacts.publicationForbiddenDeltaPathCount = null;
    }
  }

  const verification = review?.verification;
  check(hasExactKeys(verification, controlReviewVerificationKeys), `GOV-CONTROL-022: ${taskId} verification record contains missing or unknown fields`);
  check(/^v\d+\.\d+\.\d+$/.test(verification?.nodeVersion ?? ""), `GOV-CONTROL-023: ${taskId} Node version is invalid`);
  check(/^git version \d+\.\d+/.test(verification?.gitVersion ?? ""), `GOV-CONTROL-024: ${taskId} Git version is invalid`);
  for (const [field, expected] of Object.entries(CONTROL_REVIEW_EXPECTED_COUNTS)) {
    check(verification?.[field] === expected, `GOV-CONTROL-025: ${taskId} ${field} is not the exact reviewed count ${expected}`);
  }
  check(verification?.validatorPassed === true && verification?.generatorChangedPaths === 0 && verification?.dryRunDeterministic === true, `GOV-CONTROL-026: ${taskId} deterministic control verification did not pass`);
  check(/^[0-9a-f]{64}$/.test(verification?.workbookSha256 ?? "")
    && /^[0-9a-f]{64}$/.test(verification?.manifestSha256 ?? "")
    && /^[0-9a-f]{64}$/.test(verification?.reviewerRegistrySha256 ?? ""),
  `GOV-CONTROL-027: ${taskId} workbook/manifest/reviewer-registry hashes are invalid`);
  check(verification?.workbookDisposition === "go-artifact-only", `GOV-CONTROL-028: ${taskId} workbook disposition exceeds or misses the artifact-only boundary`);
  check(verification?.authenticMediaAccessed === false && verification?.privateNetworkAccessed === false, `GOV-CONTROL-029: ${taskId} control review crossed a private/authentic boundary`);
  check(verification?.deploymentState === "Unknown — private read authority pending", `GOV-CONTROL-030: ${taskId} deployment state is overstated`);

  const seats = review?.seatAttestations;
  check(hasExactKeys(seats, COUNCIL_SEATS), `GOV-CONTROL-031: ${taskId} control review does not contain exactly five seats`);
  const boundControlReviewReviewerById = new Map(
    boundControlReviewReviewerRecords.map((record) => [record?.reviewerId, record]),
  );
  const seatReviewerIds = [];
  for (const seat of COUNCIL_SEATS) {
    const attestation = seats?.[seat];
    const reviewer = boundControlReviewReviewerById.get(attestation?.reviewerId);
    seatReviewerIds.push(attestation?.reviewerId);
    check(hasExactKeys(attestation, CONTROL_REVIEW_SEAT_KEYS), `GOV-CONTROL-032: ${taskId}/${seat} attestation contains missing or unknown fields`);
    check(reviewer?.active === true && reviewer?.role === seat && attestation?.reviewerRole === seat, `GOV-CONTROL-033: ${taskId}/${seat} reviewer identity or role is invalid`);
    check(attestation?.verdict === "approve-implementation-candidate", `GOV-CONTROL-034: ${taskId}/${seat} verdict is not approving`);
    check(attestation?.reviewedRevision === candidate?.revision && attestation?.dossierDigest === candidate?.dossierDigest, `GOV-CONTROL-035: ${taskId}/${seat} attestation is not candidate-bound`);
    check(attestation?.reviewContextSha256 === review?.reviewContextSha256, `GOV-CONTROL-046: ${taskId}/${seat} attestation does not bind the complete review context`);
    check(isOpaqueEvidenceReference(attestation?.evidenceReference), `GOV-CONTROL-036: ${taskId}/${seat} evidence reference is invalid`);
    check(typeof attestation?.rationale === "string" && attestation.rationale.length >= 40, `GOV-CONTROL-037: ${taskId}/${seat} rationale is incomplete`);
    check(attestation?.attestationDigest === computeControlReviewSeatAttestationDigest({ taskId, seat, attestation }), `GOV-CONTROL-047: ${taskId}/${seat} attestation digest is invalid`);
  }
  check(new Set(seatReviewerIds).size === COUNCIL_SEATS.length, `GOV-CONTROL-038: ${taskId} control review reuses a Council reviewer`);
  check(!candidate?.implementerIds?.includes(seats?.qa?.reviewerId)
    && !candidate?.evidenceProducerIds?.includes(seats?.qa?.reviewerId), `GOV-CONTROL-039: ${taskId} QA reviewer is not independent`);
  for (const finding of controlReviewEvidenceFindings({
    taskId,
    review,
    reviewerRecords: boundControlReviewReviewerRecords,
    candidateFacts,
  })) {
    check(false, `GOV-CONTROL-048: ${taskId} ${finding}`);
  }
}
const unknownApprovalTasks = Object.keys(taskApprovals).filter((taskId) => !taskIds.has(taskId));
check(unknownApprovalTasks.length === 0, `GOV-APPROVAL-003: approval registry contains unknown task IDs: ${unknownApprovalTasks.join(", ")}`);
const allowedApprovalKeys = new Set(["candidate", "artifactReviews", "designCoverage", "dependencyEvidence", "privateAuthority", "openDecisions", "specialistVetoes", "council", "approvalRecord"]);
for (const [taskId, approval] of Object.entries(taskApprovals)) {
  const unknownKeys = Object.keys(approval ?? {}).filter((key) => !allowedApprovalKeys.has(key));
  check(unknownKeys.length === 0, `GOV-APPROVAL-004: ${taskId} approval has unknown keys: ${unknownKeys.join(", ")}`);
  if (approval?.candidate) {
    check(hasExactKeys(approval.candidate, [
      "baseRevision", "revision", "dossierDigest", "taskContractSha256", "artifacts", "taskFiles", "taskFilesSha256",
      "implementerIds", "evidenceProducerIds",
    ]), `GOV-APPROVAL-025: ${taskId} candidate contains missing or unknown fields`);
    check(fullCommitPattern.test(approval.candidate.baseRevision ?? "") && approval.candidate.baseRevision !== approval.candidate.revision, `GOV-APPROVAL-042: ${taskId} candidate base revision is missing or not distinct`);
    check(fullCommitPattern.test(approval.candidate.revision ?? ""), `GOV-APPROVAL-008: ${taskId} candidate revision is not a full commit SHA`);
    check(/^sha256:[0-9a-f]{64}$/.test(approval.candidate.dossierDigest ?? ""), `GOV-APPROVAL-009: ${taskId} candidate lacks a canonical dossier digest`);
    check(/^[0-9a-f]{64}$/.test(approval.candidate.taskContractSha256 ?? ""), `GOV-APPROVAL-038: ${taskId} candidate lacks a canonical task-contract digest`);
    const taskFilesValidation = validateTaskFilesManifest({
      taskId,
      taskFiles: approval.candidate.taskFiles,
      artifacts: approval.candidate.artifacts,
    });
    check(taskFilesValidation.valid, `GOV-APPROVAL-039: ${taskId} candidate task-file manifest is incomplete or malformed`);
    check(approval.candidate.taskFilesSha256 === taskFilesValidation.sha256
      && approval.candidate.taskFilesSha256 === computeTaskFilesSha256(approval.candidate.taskFiles), `GOV-APPROVAL-040: ${taskId} candidate task-file digest is not canonical`);
    check(sameSet(new Set(Object.keys(approval.candidate.artifacts ?? {})), new Set(artifactKinds)), `GOV-APPROVAL-010: ${taskId} candidate does not bind exactly six artifacts`);
    for (const [kind, binding] of Object.entries(approval.candidate.artifacts ?? {})) {
      check(hasExactKeys(binding, ["path", "sha256"]), `GOV-APPROVAL-026: ${taskId} ${kind} candidate binding contains missing or unknown fields`);
    }
    for (const field of ["implementerIds", "evidenceProducerIds"]) {
      const ids = approval.candidate[field];
      check(Array.isArray(ids) && ids.length > 0 && new Set(ids).size === ids.length, `GOV-APPROVAL-011: ${taskId} candidate ${field} are absent or duplicated`);
    }
  }
  if (approval?.artifactReviews) {
    check(sameSet(new Set(Object.keys(approval.artifactReviews)), new Set(artifactKinds)), `GOV-APPROVAL-012: ${taskId} approval does not contain exactly six artifact reviews`);
    for (const [kind, review] of Object.entries(approval.artifactReviews)) {
      check(hasExactKeys(review, [
        "decision", "reviewerId", "reviewerRole", "reviewedRevision", "artifactSha256", "dossierDigest", "evidenceReference",
        "attestationDigest", "notApplicableRationale", "specialistConcurrence",
      ]), `GOV-APPROVAL-027: ${taskId} ${kind} artifact review contains missing or unknown fields`);
      check(["hold", "approved", "not-applicable"].includes(review?.decision), `GOV-APPROVAL-013: ${taskId} ${kind} has invalid artifact-review decision ${review?.decision}`);
      if (["approved", "not-applicable"].includes(review?.decision)) {
        check(isOpaqueEvidenceReference(review?.evidenceReference), `GOV-APPROVAL-014: ${taskId} ${kind} lacks a public-safe opaque review reference`);
      }
    }
  }
  if (approval?.council) {
    check(hasExactKeys(approval.council, ["verdict", "reviewedRevision", "dossierDigest", "unresolvedBlockers", "seatVerdicts"]), `GOV-APPROVAL-028: ${taskId} Council record contains missing or unknown fields`);
    check(sameSet(new Set(Object.keys(approval.council.seatVerdicts ?? {})), new Set(councilSeats)), `GOV-APPROVAL-015: ${taskId} Council approval does not contain exactly five seats`);
    for (const [seat, record] of Object.entries(approval.council.seatVerdicts ?? {})) {
      check(hasExactKeys(record, [
        "verdict", "reviewerId", "reviewerRole", "reviewedRevision", "dossierDigest", "evidenceReference", "attestationDigest", "rationale",
        "requestedScopeClass", "requestedActionClass", "requestedCouncilVerdict", "designCoverageDigest", "implementerIdsDigest", "evidenceProducerIdsDigest",
        "openDecisionsDigest", "unresolvedBlockersDigest", "specialistVetoesDigest", "reviewerRegistrySha256", "ownerActionStateSha256", "taskContractSha256",
        "dependencyEvidenceSha256", "privateAuthoritySha256", "artifactReviewsSha256", "baseRevision", "taskFilesSha256",
      ]), `GOV-APPROVAL-029: ${taskId} ${seat} Council seat contains missing or unknown fields`);
      check(["hold", "approved", "not-applicable"].includes(record?.verdict), `GOV-APPROVAL-016: ${taskId} ${seat} has invalid seat verdict ${record?.verdict}`);
      if (["approved", "not-applicable"].includes(record?.verdict)) {
        check(isOpaqueEvidenceReference(record?.evidenceReference), `GOV-APPROVAL-017: ${taskId} ${seat} lacks a public-safe opaque seat reference`);
      }
    }
  }
  if (approval?.designCoverage) {
    check(hasExactKeys(approval.designCoverage, ["applicability", "journeyIds", "stateCoverage", "accessibilityCoverage", "notApplicableRationale"]), `GOV-APPROVAL-030: ${taskId} Design coverage contains missing or unknown fields`);
    check(["pending", "applicable", "not-applicable"].includes(approval.designCoverage.applicability), `GOV-APPROVAL-018: ${taskId} Design applicability is invalid`);
    check(Array.isArray(approval.designCoverage.journeyIds), `GOV-APPROVAL-019: ${taskId} Design journey coverage is not an array`);
    for (const dimension of designStateDimensions) check(Array.isArray(approval.designCoverage.stateCoverage?.[dimension]), `GOV-APPROVAL-020: ${taskId} Design ${dimension} state coverage is not an array`);
    for (const dimension of designAccessibilityDimensions) check(Array.isArray(approval.designCoverage.accessibilityCoverage?.[dimension]), `GOV-APPROVAL-021: ${taskId} Design ${dimension} accessibility coverage is not an array`);
  }
  const mutableCoverage = readinessState.taskOverrides?.[taskId]?.designCoverage;
  if (approval?.designCoverage && mutableCoverage) {
    check(jsonEqual(approval.designCoverage, mutableCoverage), `GOV-APPROVAL-033: ${taskId} mutable Design coverage conflicts with its approval-bound coverage`);
  }
  for (const evidence of approval?.dependencyEvidence ?? []) {
    check(hasExactKeys(evidence, ["dependencyId", "result", "evidenceReference"]), `GOV-APPROVAL-031: ${taskId} dependency evidence contains missing or unknown fields`);
  }
  if (approval?.approvalRecord) {
    check(hasExactKeys(approval.approvalRecord, ["candidateRevision", "dossierDigest", "approvalsVerified"]), `GOV-APPROVAL-032: ${taskId} approval record contains missing, unknown, or injected publication fields`);
  }
  if (approval?.privateAuthority) {
    check(hasExactKeys(approval.privateAuthority, [
      "authorityId", "taskId", "scopeClass", "allowedActionClass", "verifierId", "verifierRole", "windowStart", "windowEnd", "result",
      "ownerActionId", "accountableHumanId", "accountableHumanRole", "ownerAttestationReference", "evidenceReference", "candidateRevision", "dossierDigest",
    ]), `GOV-APPROVAL-034: ${taskId} private-authority record contains missing or unknown fields`);
  }
  for (const field of ["openDecisions", "specialistVetoes"]) {
    if (approval?.[field] !== undefined) check(Array.isArray(approval[field]) && approval[field].every((value) => typeof value === "string"), `GOV-APPROVAL-035: ${taskId} ${field} must be a string array`);
  }
}

const allScenarioIds = new Set();
const evaluationNow = readinessState.asOf;
const emptyApprovalPublication = (taskId) => ({
  revision: null,
  registryPath: approvalRegistryPath,
  registrySha256: null,
  registryBytesVerified: false,
  taskId,
  publishedTaskApprovalSha256: null,
  currentTaskApprovalSha256: null,
  taskApprovalBytesVerified: false,
  publishedReviewerRegistrySha256: null,
  currentReviewerRegistrySha256: null,
  reviewerRegistryBytesVerified: false,
  publishedOwnerActionStateSha256: null,
  currentOwnerActionStateSha256: null,
  ownerActionStateBytesVerified: false,
  publishedTaskContractSha256: null,
  currentTaskContractSha256: null,
  taskContractBytesVerified: false,
  publishedOnFetchedMain: false,
  candidateAncestorOfApproval: false,
});
for (const task of tasks) {
  const dossier = dossierById.get(task.id);
  check(Boolean(dossier), `GOV-DOR-003: ${task.id} has no dossier record`);
  const sourceArtifacts = actualArtifactInputs(task);
  const evaluatorInput = buildTaskReadinessInput({
    task,
    artifacts: sourceArtifacts,
    readinessState,
    reviewerRegistry,
    approvalRegistry,
    ownerActionState,
  });
  const candidateRevision = evaluatorInput.candidate?.revision;
  let candidatePublication = emptyCandidatePublicationFacts(evaluatorInput.candidate);
  if (fullCommitPattern.test(candidateRevision ?? "")
    && fullCommitPattern.test(evaluatorInput.candidate?.baseRevision ?? "")
    && fetchedMainRevision) {
    const candidateResult = await deriveCandidatePublicationFacts({
      repoRoot,
      taskId: task.id,
      candidate: evaluatorInput.candidate,
      registeredArtifacts: sourceArtifacts,
      publishedRef: fetchedMainRevision,
      scopeClass: evaluatorInput.requestedScope.scopeClass,
    });
    if (candidateResult.ok === true) {
      const { ok: _ok, code: _code, scope: _scope, ...facts } = candidateResult;
      candidatePublication = facts;
    }
  }
  let approvalPublication = emptyApprovalPublication(task.id);
  if (evaluatorInput.approvalRecord && fullCommitPattern.test(candidateRevision ?? "") && fetchedMainRevision) {
    const publicationResult = await deriveApprovalPublicationFacts({
      repoRoot,
      taskId: task.id,
      approvalRegistry,
      candidateRevision,
      publishedRef: fetchedMainRevision,
      reviewerRegistry,
      ownerActionState,
      ownerActionRequirements: evaluatorInput.ownerActionRequirements,
    });
    if (publicationResult.ok === true) {
      const { ok: _ok, code: _code, scope: _scope, ...facts } = publicationResult;
      approvalPublication = facts;
    }
  }
  const approvalRevision = approvalPublication.revision;
  const expectedResult = evaluateReadiness(evaluatorInput, {
    phase: "approval",
    now: evaluationNow,
    candidatePublication,
    approvalPublication,
  });
  const expectedEffectiveStates = expectedResult.normalizedEvidence.effectiveArtifactStates;
  const expectedExecutionScope = executionScopeLabelFor(task, requestedScopeFor(task, readinessState.taskOverrides?.[task.id] ?? {}));
  const expectedScenarios = acceptanceScenarioIdsFor(task.id);
  const expectedTaskContractSha256 = computeTaskContractSha256({
    taskId: task.id,
    outcome: task.description,
    requirementIds: task.requirementIds,
    dependencyIds: task.dependencies,
    acceptanceEvidence: task.acceptanceEvidence,
    acceptanceScenarioIds: expectedScenarios,
  });
  check(evaluatorInput.candidate.taskContractSha256 === expectedTaskContractSha256, `GOV-CANDIDATE-005: ${task.id} candidate task-contract digest differs from the canonical manifest task`);
  const expectedGateByCode = new Map(expectedResult.gateResults.map((gate) => [gate.code, gate]));
  for (const code of [
    "SCHEMA_VERSION", "TASK_ID", "TASK_MILESTONE_COMPATIBILITY", "EVALUATION_PHASE", "DERIVED_OVERRIDE", "PUBLIC_SAFETY", "AUTHENTIC_MEDIA_EXCLUSION",
    "PRIVATE_NETWORK_EXCLUSION", "REVIEWER_REGISTRY", "REQUIREMENT_SET", "ACCEPTANCE_SCENARIOS", "REQUESTED_SCOPE", "SCOPE_ACTION_COMPATIBILITY",
    "TASK_SCOPE_ACTION_COMPATIBILITY", "TASK_CONTRACT_SOURCE", "DEPENDENCY_REQUIREMENTS", "OWNER_ACTION_REQUIREMENTS", "OWNER_ACTION_RECORD_SET",
  ]) {
    check(expectedGateByCode.get(code)?.passed === true, `GOV-SOURCE-011: ${task.id} canonical source assembly fails ${code}`);
  }
  for (const actionId of ownerActionIdsFor(task)) {
    check(Boolean(ownerActions[actionId]), `GOV-ACTION-009: ${task.id} maps unknown owner action ${actionId}`);
  }

  if (fullCommitPattern.test(candidateRevision ?? "")) {
    check(revisionExists(candidateRevision), `GOV-CANDIDATE-001: ${task.id} candidate revision does not exist locally`);
    check(revisionIsAncestorOfHead(candidateRevision), `GOV-CANDIDATE-002: ${task.id} candidate revision is not an ancestor of checkout HEAD`);
    check(evaluatorInput.candidate.dossierDigest === computeDossierDigest(evaluatorInput.candidate), `GOV-CANDIDATE-003: ${task.id} candidate dossier digest is not canonical`);
  }
  if (fullCommitPattern.test(approvalRevision ?? "")) {
    check(revisionExists(approvalRevision), `GOV-APPROVAL-005: ${task.id} approval-record revision does not exist locally`);
    check(revisionIsAncestorOfHead(approvalRevision), `GOV-APPROVAL-006: ${task.id} approval-record revision is not an ancestor of checkout HEAD`);
    check(approvalRevision !== candidateRevision, `GOV-APPROVAL-007: ${task.id} approval record self-references the candidate revision`);
  }
  for (const [kind, review] of Object.entries(evaluatorInput.artifactReviews)) {
    if (!["approved", "not-applicable"].includes(review?.decision)) continue;
    const prefix = `REVIEW_${kind.toUpperCase()}_`;
    const reviewGates = expectedResult.gateResults.filter((gate) => gate.code.startsWith(prefix));
    check(reviewGates.length === 5 && reviewGates.every((gate) => gate.passed), `GOV-APPROVAL-022: ${task.id} ${kind} non-Hold review is structurally invalid`);
  }
  for (const [seat, record] of Object.entries(evaluatorInput.council.seatVerdicts)) {
    if (!["approved", "not-applicable"].includes(record?.verdict)) continue;
    const prefix = `SEAT_${seat.toUpperCase()}_`;
    const seatGates = expectedResult.gateResults.filter((gate) => gate.code.startsWith(prefix));
    check(seatGates.length === 7 && seatGates.every((gate) => gate.passed), `GOV-APPROVAL-023: ${task.id} ${seat} non-Hold Council attestation is structurally invalid`);
  }
  if (taskApprovals[task.id]?.candidate) {
    for (const code of [
      "CANDIDATE_REVISION", "CANDIDATE_BASE_REVISION", "CANDIDATE_ARTIFACT_BINDINGS",
      "CANDIDATE_TASK_FILES_SCHEMA", "CANDIDATE_TASK_FILES_ARTIFACT_COVERAGE", "CANDIDATE_TASK_FILES_WORK_COVERAGE",
      "CANDIDATE_TASK_FILES_DIGEST", "CANDIDATE_TASK_FILES_FULL_DIFF", "CANDIDATE_DOSSIER_DIGEST",
      "CANDIDATE_TASK_CONTRACT", "CANDIDATE_TASK_CONTRACT_PUBLICATION", "CANDIDATE_BYTES_VERIFIED",
    ]) {
      check(expectedGateByCode.get(code)?.passed === true, `GOV-CANDIDATE-004: ${task.id} approval-registry candidate fails ${code}`);
    }
  }

  if (dossier) {
    check(hasExactKeys(dossier, [
      "taskId", "issueNumber", "issueUrl", "artifactReadiness", "executionDecision", "executionAllowed", "executionScope", "requestedScope",
      "artifacts", "artifactReviews", "candidate", "candidatePublication", "approvalRecord", "approvalPublication", "requirementIds", "acceptanceScenarioIds",
      "designCoverage", "dependencyControl", "ownerActionControl", "privateAuthority", "privateAuthorityRequired", "openDecisions", "specialistVetoes",
      "council", "effectiveArtifactStates", "gateResults", "blockers", "nextAction", "normalizedEvidence",
    ]), `GOV-DOR-045: ${task.id} dossier contains missing or unknown projection fields`);
    check(dossier.issueNumber === issueMap[task.id]?.number && dossier.issueUrl === issueMap[task.id]?.url, `GOV-DOR-049: ${task.id} issue number/URL differs from the canonical issue map`);
    check(jsonEqual(task.taskDossier, dossier), `GOV-DOR-004: ${task.id} manifest dossier differs from the central register`);
    check(task.artifactReadiness === dossier.artifactReadiness, `GOV-DOR-005: ${task.id} readiness projection differs`);
    check(task.executionAllowed === dossier.executionAllowed, `GOV-DOR-006: ${task.id} executionAllowed projection differs`);
    check(task.executionScope === dossier.executionScope, `GOV-DOR-007: ${task.id} execution scope projection differs`);
    check(jsonEqual(dossier.requirementIds, task.requirementIds), `GOV-DOR-008: ${task.id} requirement IDs differ from the manifest`);
    check(jsonEqual(dossier.acceptanceScenarioIds, expectedScenarios), `GOV-DOR-009: ${task.id} acceptance scenario projection differs from the canonical task contract`);
    for (const scenarioId of dossier.acceptanceScenarioIds ?? []) {
      check(!allScenarioIds.has(scenarioId), `GOV-DOR-010: duplicate acceptance scenario ID ${scenarioId}`);
      allScenarioIds.add(scenarioId);
    }

    check(dossier.artifactReadiness === expectedResult.artifactReadiness, `GOV-DERIVED-001: ${task.id} artifactReadiness differs from unconditional evaluator output`);
    check(dossier.executionDecision === expectedResult.executionDecision, `GOV-DERIVED-002: ${task.id} executionDecision differs from unconditional evaluator output`);
    check(dossier.executionAllowed === expectedResult.executionAllowed, `GOV-DERIVED-003: ${task.id} executionAllowed differs from unconditional evaluator output`);
    check(dossier.nextAction === expectedResult.nextAction, `GOV-DERIVED-004: ${task.id} nextAction differs from unconditional evaluator output`);
    check(jsonEqual(dossier.gateResults, expectedResult.gateResults), `GOV-DERIVED-005: ${task.id} gateResults differ from unconditional evaluator output`);
    check(jsonEqual(dossier.blockers, expectedResult.blockers), `GOV-DERIVED-006: ${task.id} blockers differ from unconditional evaluator output`);
    check(jsonEqual(dossier.normalizedEvidence, expectedResult.normalizedEvidence), `GOV-DERIVED-007: ${task.id} normalizedEvidence differs from unconditional evaluator output`);
    check(jsonEqual(dossier.effectiveArtifactStates, expectedEffectiveStates), `GOV-DERIVED-008: ${task.id} effectiveArtifactStates differ from unconditional evaluator output`);
    check(jsonEqual(dossier.requestedScope, evaluatorInput.requestedScope), `GOV-DERIVED-009: ${task.id} requestedScope projection differs from source intent`);
    check(dossier.executionScope === expectedExecutionScope, `GOV-DERIVED-010: ${task.id} executionScope label differs from source intent`);
    check(jsonEqual(dossier.candidatePublication, candidatePublication), `GOV-DERIVED-011: ${task.id} candidate-publication facts differ from independently inspected Git/file evidence`);
    check(jsonEqual(dossier.approvalRecord, evaluatorInput.approvalRecord), `GOV-DERIVED-012: ${task.id} approval-record source differs from the approval registry`);
    check(jsonEqual(dossier.approvalPublication, approvalPublication), `GOV-DERIVED-016: ${task.id} approval-publication facts differ from independently inspected Git history and bytes`);
    check(jsonEqual(dossier.candidate, evaluatorInput.candidate), `GOV-SOURCE-001: ${task.id} candidate projection differs from the approval registry`);
    check(jsonEqual(dossier.artifactReviews, evaluatorInput.artifactReviews), `GOV-SOURCE-002: ${task.id} artifact-review projection differs from the approval registry`);
    check(jsonEqual(dossier.designCoverage, evaluatorInput.designCoverage), `GOV-SOURCE-003: ${task.id} Design coverage projection differs from canonical source evidence`);
    const { decisionPath: registeredDecisionPath, decisionUrl: registeredDecisionUrl, ...registeredCouncilSource } = dossier.council ?? {};
    check(jsonEqual(registeredCouncilSource, evaluatorInput.council), `GOV-SOURCE-004: ${task.id} Council projection differs from canonical source evidence`);
    check(registeredDecisionPath === sourceArtifacts.council.path
      && registeredDecisionUrl === sourceArtifacts.council.url, `GOV-SOURCE-006: ${task.id} Council decision path/URL differs from its canonical artifact`);
    check(jsonEqual(dossier.openDecisions, evaluatorInput.openDecisions), `GOV-SOURCE-005: ${task.id} open-decision projection differs from canonical source evidence`);
    const dependencyFailures = expectedResult.gateResults.filter((gate) => !gate.passed
      && (gate.code === "DEPENDENCY_REQUIREMENTS" || gate.code.startsWith("DEPENDENCY_")));
    check(jsonEqual(dossier.dependencyControl, {
      requirements: evaluatorInput.dependencyRequirements,
      evidence: evaluatorInput.dependencyEvidence,
      satisfied: dependencyFailures.length === 0,
    }), `GOV-SOURCE-007: ${task.id} dependency control differs from canonical source evidence and evaluator gates`);
    const dueActionFailures = expectedResult.gateResults.filter((gate) => !gate.passed
      && gate.code.startsWith("OWNER_ACTION_")
      && !["OWNER_ACTION_REQUIREMENTS", "OWNER_ACTION_RECORD_SET"].includes(gate.code));
    check(jsonEqual(dossier.ownerActionControl, {
      requirements: evaluatorInput.ownerActionRequirements,
      records: evaluatorInput.ownerActions,
      dueActionIds: expectedResult.normalizedEvidence.dueOwnerActionIds,
      allDueSatisfied: dueActionFailures.length === 0,
    }), `GOV-SOURCE-008: ${task.id} owner-action control differs from canonical source evidence and evaluator gates`);
    check(jsonEqual(dossier.privateAuthority, evaluatorInput.privateAuthority)
      && dossier.privateAuthorityRequired === expectedResult.normalizedEvidence.privateAuthorityRequired, `GOV-SOURCE-009: ${task.id} private-authority projection differs from canonical source evidence`);
    check(jsonEqual(dossier.specialistVetoes, evaluatorInput.specialistVetoes), `GOV-SOURCE-010: ${task.id} specialist-veto projection differs from canonical source evidence`);

    for (const kind of artifactKinds) {
      const registered = dossier.artifacts?.[kind];
      const observed = sourceArtifacts[kind];
      check(Boolean(registered), `GOV-DOR-011: ${task.id} lacks ${kind} artifact metadata`);
      if (!registered) continue;
      check(registered.required === true, `GOV-DOR-012: ${task.id} ${kind} is not marked required`);
      check(registered.path === observed.path && registered.url === observed.url, `GOV-DOR-013: ${task.id} ${kind} path/URL differs from the canonical P0 location`);
      check(path.basename(registered.path).startsWith("P0-") && path.basename(registered.path).includes(task.id), `GOV-NAME-004: ${task.id} ${kind} artifact lacks its P0/task prefix`);
      check(fs.existsSync(path.join(repoRoot, observed.path)), `GOV-DOR-014: ${task.id} ${kind} artifact is missing: ${observed.path}`);
      check(registered.sha256 === observed.sha256, `GOV-DOR-015: ${task.id} ${kind} SHA-256 differs from exact file bytes`);
      check(observed.markersValid, `GOV-DOR-016: ${task.id} ${kind} task/kind/state markers are invalid`);
      check(registered.contentState === observed.contentState, `GOV-DOR-017: ${task.id} ${kind} content-state projection differs from its marker`);
      check(registered.state === expectedEffectiveStates[kind], `GOV-DOR-018: ${task.id} ${kind} effective state is not evaluator-derived`);
      check(allowedArtifactStates.has(registered.state), `GOV-DOR-019: ${task.id} ${kind} has invalid effective state ${registered.state}`);
    }

    if (dossier.executionAllowed) {
      check(dossier.artifactReadiness === "Ready", `GOV-DOR-020: ${task.id} execution is allowed without Ready artifacts`);
      check(expectedResult.gateResults.every((gate) => gate.passed), `GOV-DOR-021: ${task.id} execution is allowed while an evaluator gate fails`);
      check(fullCommitPattern.test(candidateRevision ?? "") && revisionIsPublished(candidateRevision), `GOV-DOR-022: ${task.id} execution is allowed without a candidate published on fetched origin/main`);
      check(fullCommitPattern.test(approvalRevision ?? "") && revisionIsPublished(approvalRevision), `GOV-DOR-023: ${task.id} execution is allowed without a later approval record published on fetched origin/main`);
    }
  }
  const expectedStatus = taskState.statusOverrides?.[task.id] ?? taskState.defaultStatus;
  check(task.status === expectedStatus, `GOV-STATE-001: ${task.id} manifest status does not match the task-state ledger`);
  for (const dependency of task.dependencies ?? []) {
    check(taskIds.has(dependency), `GOV-DEP-001: ${task.id} has unknown dependency ${dependency}`);
    check(dependency !== task.id, `GOV-DEP-002: ${task.id} depends on itself`);
  }
  const references = task.evidenceReferencePaths ?? [];
  if (["In progress", "Done"].includes(task.status)) {
    check(references.length > 0, `GOV-EVID-001: ${task.id} ${task.status} has no retrievable evidence reference`);
  }
  check(
    JSON.stringify(references) === JSON.stringify(taskState.evidenceReferences?.[task.id] ?? []),
    `GOV-EVID-002: ${task.id} manifest references differ from the task-state ledger`,
  );
  for (const [index, filePath] of references.entries()) {
    check(fs.existsSync(path.join(repoRoot, filePath)), `GOV-EVID-003: ${task.id} evidence path does not exist: ${filePath}`);
    check(
      task.evidenceReferenceUrls?.[index] === `https://github.com/arunpr614/Life-Reflection/blob/main/${filePath}`,
      `GOV-EVID-004: ${task.id} evidence URL does not match ${filePath}`,
    );
  }
  check(
    task.evidenceState === (["In progress", "Done"].includes(task.status) ? "Linked" : "Not yet provided"),
    `GOV-EVID-005: ${task.id} evidenceState is inconsistent with status`,
  );
}

const expectedRegisterSummary = {
  taskCount: tasks.length,
  readyCount: artifactRegister.tasks.filter((record) => record.artifactReadiness === "Ready").length,
  executionAllowedCount: artifactRegister.tasks.filter((record) => record.executionAllowed === true).length,
  incompleteCount: artifactRegister.tasks.filter((record) => record.artifactReadiness === "Incomplete").length,
  artifactStateCounts: Object.fromEntries([...allowedArtifactStates].map((state) => [
    state,
    artifactRegister.tasks.flatMap((record) => Object.values(record.artifacts ?? {})).filter((artifact) => artifact.state === state).length,
  ])),
};
check(jsonEqual(artifactRegister.summary, expectedRegisterSummary), "GOV-DERIVED-013: artifact-register summary differs from the 58 recomputed dossier projections");
check(expectedRegisterSummary.readyCount + expectedRegisterSummary.incompleteCount === 58, "GOV-DERIVED-014: readiness summary does not classify exactly 58 tasks");
check(Object.values(expectedRegisterSummary.artifactStateCounts).reduce((sum, count) => sum + count, 0) === 348, "GOV-DERIVED-015: artifact-state summary does not classify all 348 artifacts");

const dependencyMap = new Map(tasks.map((task) => [task.id, task.dependencies ?? []]));
const visiting = new Set();
const visited = new Set();
const visit = (taskId, stack = []) => {
  if (visiting.has(taskId)) {
    failures.push(`GOV-DEP-003: dependency cycle: ${[...stack, taskId].join(" -> ")}`);
    return;
  }
  if (visited.has(taskId)) return;
  visiting.add(taskId);
  for (const dependency of dependencyMap.get(taskId) ?? []) visit(dependency, [...stack, taskId]);
  visiting.delete(taskId);
  visited.add(taskId);
};
for (const taskId of taskIds) visit(taskId);

const actionPhrases = [
  "keep the correction",
  "display newest upstream revision",
  "create a new correction based on both",
];
for (const [filePath, content] of [
  ["docs/product/PRODUCT-REQUIREMENTS.md", productRequirements],
  ["docs/product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md", r4Release],
  ["docs/design/UX-SPECIFICATION.md", uxSpecification],
]) {
  const lower = content.toLowerCase();
  for (const phrase of actionPhrases) check(lower.includes(phrase), `GOV-R4-001: ${filePath} is missing exact outcome: ${phrase}`);
  check(!lower.includes("use source update"), `GOV-R4-002: ${filePath} contains forbidden fourth/alternate outcome: use source update`);
  check(!lower.includes("save source update as suggestion"), `GOV-R4-003: ${filePath} contains forbidden fourth/alternate outcome: save source update as suggestion`);
}
check(
  !/\bconflict suggestions?\b/i.test(r4Release)
    && !/\brevision, correction, suggestion\b/i.test(r4Release)
    && !/\bsource revisions?, suggestions?\b/i.test(r4Release)
    && r4Release.includes("recorded conflict-resolution choices")
    && r4Release.includes("never modeled as a fourth suggestion outcome"),
  "GOV-R4-004: R4 still models a conflict suggestion or lacks the exact three-choice persistence boundary",
);

const healthContract = [
  "`unknown`, `never run`, `success`, `delayed`, `failed`, or `blocked`",
  "`Unknown`, `Never verified`, `Healthy`, `Attention — delayed`, `Failed`, and `Blocked`",
  "`Not configured` is a separate prerequisite/configuration state",
];
for (const phrase of healthContract) check(uxSpecification.includes(phrase), `GOV-HEALTH-001: UX specification is missing: ${phrase}`);
check(
  uxSpecification.includes("| Health Status Card | Operational evidence | `Unknown`, `Never verified`, `Healthy`, `Attention — delayed`, `Failed`, or `Blocked`; `Not configured` is a separate prerequisite/configuration state |"),
  "GOV-HEALTH-006: Health Status Card inventory does not preserve the exact six labels and separate prerequisite state",
);
check(
  architecturePlan.includes("exactly: `unknown`, `never run`, `success`, `delayed`, `failed`, or `blocked`"),
  "GOV-HEALTH-002: architecture plan lacks the exact six durable health states",
);
check(
  architecturePlan.includes("`recovery verified` is separate evidence/detail"),
  "GOV-HEALTH-003: architecture plan does not classify recovery verified as separate evidence/detail",
);
check(
  r0Prd.includes("`unknown`, `never run`, `success`, `delayed`, `failed`, and `blocked`"),
  "GOV-HEALTH-004: R0 PRD lacks the exact six durable health states",
);
check(
  !/distinguish(?:es)?[^\n.]*\bhealthy\b[^\n.]*\bdelayed\b/i.test(architecturePlan)
    && !/distinguish(?:es)?[^\n.]*\bhealthy\b[^\n.]*\bdelayed\b/i.test(r0Prd),
  "GOV-HEALTH-005: an authoritative architecture/R0 state list still uses healthy as a durable state",
);

check(
  productRequirements.includes("LID-REF-002 — Monthly Almanac")
    && productRequirements.includes("there is no competing Timeline tab")
    && productRequirements.includes("Calendar and Almanac share the approved switcher near Search"),
  "GOV-UX-001: governing Product requirements do not preserve the approved Monthly Almanac/navigation contract",
);
check(
  uxSpecification.includes("| Primary | Monthly Almanac |")
    && uxSpecification.includes("The approved Calendar/Almanac switcher sits near Search")
    && uxSpecification.includes("do not add a competing Timeline tab or persistent primary-navigation rail")
    && uxSpecification.includes("management surfaces live under Settings/More"),
  "GOV-UX-002: UX specification does not preserve the approved Almanac/switcher/management contract",
);
check(
  productRequirements.includes("Calendar tiles use no source/AI overlay chip")
    && uxSpecification.includes("No persistent source-type, `AI artwork`, or attention overlay chip")
    && uxSpecification.includes("selected Museum Margin/detail exposes it visibly"),
  "GOV-UX-003: Calendar progressive-disclosure and AI/source-label contract has drifted",
);
check(!r3Prd.includes("Timeline"), "GOV-UX-004: R3 PRD still presents Timeline as a separate user-facing destination");
check(
  !uxSpecification.includes("real versus AI cover badges")
    && !uxSpecification.includes("| Wide | 1024 px and above | Persistent rail")
    && !uxSpecification.includes("Adding timeline results")
    && uxSpecification.includes("Do not add overlay badges or a persistent primary-navigation rail")
    && uxSpecification.includes("Calendar tile itself uses progressive disclosure and no persistent source-type overlay chip"),
  "GOV-UX-005: UX still contains a persistent rail/badge/Timeline instruction that conflicts with the approved Calendar/Almanac contract",
);
check(
  architecturePlan.includes("`/api/calendar`, `/api/almanac`, `/api/days/:date`")
    && !architecturePlan.includes("`/api/timeline`")
    && sharedArchitecturePlan.includes("Image-first Calendar, Monthly Almanac, deterministic Search, and Journal Day detail are primary surfaces")
    && sharedArchitecturePlan.includes("`GET /api/almanac`")
    && !sharedArchitecturePlan.includes("`GET /api/timeline`")
    && !sharedArchitecturePlan.includes("Calendar, timeline, Journal Day detail"),
  "GOV-UX-006: architecture still models Timeline as a separate user-facing surface",
);
check(
  prototypeTracker.includes("new `P0-index-vN.html`, `P0-app-vN.js`, `P0-styles-vN.css`, `P0-README-vN.md`")
    && prototypeTracker.includes("Frozen v6–v10 names remain grandfathered and unchanged"),
  "GOV-NAME-006: v11+ prototype artifact names do not follow the P0-prefix rule",
);

const executionGovernance = manifest.project?.executionGovernance ?? {};
for (const [name, filePath] of Object.entries(executionGovernance)) {
  check(fs.existsSync(path.join(repoRoot, filePath)), `GOV-CTRL-001: ${name} path does not exist: ${filePath}`);
  check(path.basename(filePath).startsWith("P0-"), `GOV-NAME-001: new execution artifact lacks P0- prefix: ${filePath}`);
}
for (const requiredPath of [
  readinessStatePath,
  artifactRegisterPath,
  reviewerRegistryPath,
  approvalRegistryPath,
  ownerActionStatePath,
  stageApprovalRegistryPath,
  successorGenesisPath,
  RUNNING_LOG_GENESIS_PATH,
  "docs/project/P0-R1-R10-FREEZE-SNAPSHOT.json",
  "docs/council/execution/releases/P0-P0-R0-STAGE0-STATE-CONTRACT.md",
]) {
  check(Object.values(executionGovernance).includes(requiredPath), `GOV-CTRL-002: manifest execution governance omits ${requiredPath}`);
}
const executionFiles = walkFiles("docs/council/execution");
for (const filePath of executionFiles) {
  check(path.basename(filePath).startsWith("P0-"), `GOV-NAME-002: execution artifact lacks P0- prefix: ${filePath}`);
}
check(path.basename(import.meta.filename).startsWith("P0-"), "GOV-NAME-003: this new validator lacks the P0- prefix");
const workItemFiles = walkFiles("docs/work-items");
check(workItemFiles.length === 58 * artifactKinds.length, `GOV-DOR-032: expected 348 task artifacts; found ${workItemFiles.length}`);
for (const filePath of workItemFiles) {
  check(path.basename(filePath).startsWith("P0-"), `GOV-NAME-005: task artifact lacks P0- prefix: ${filePath}`);
}

const governedMarkdown = [
  "README.md",
  "docs/INDEX.md",
  "docs/council/PRODUCT-COUNCIL.md",
  "docs/council/PRODUCT-COUNCIL-CHARTER.md",
  "docs/council/PHASE1-COUNCIL-DECISION-RECORD.md",
  "docs/product/PRODUCT-REQUIREMENTS.md",
  "docs/product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md",
  "docs/design/UX-SPECIFICATION.md",
  "docs/architecture/PHASE1-IMPLEMENTATION-PLAN.md",
  "docs/product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md",
  "docs/project/PHASE1-GITHUB-PROJECT-SYNC.md",
  ...executionFiles.filter((filePath) => filePath.endsWith(".md")),
  "docs/council/agents/P0-QA-LEAD.md",
  ...workItemFiles.filter((filePath) => filePath.endsWith(".md")),
];
const markdownLinkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
for (const filePath of governedMarkdown) {
  const content = readText(filePath);
  for (const match of content.matchAll(markdownLinkPattern)) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, "").split(/\s+[\"']/)[0];
    if (!rawTarget || rawTarget.startsWith("#") || /^(?:https?:|mailto:)/.test(rawTarget)) continue;
    const targetWithoutFragment = decodeURI(rawTarget.split("#")[0].split("?")[0]);
    if (!targetWithoutFragment) continue;
    const resolved = path.resolve(path.dirname(path.join(repoRoot, filePath)), targetWithoutFragment);
    check(resolved.startsWith(`${repoRoot}${path.sep}`) || resolved === repoRoot, `GOV-LINK-001: ${filePath} link escapes the repository: ${rawTarget}`);
    check(fs.existsSync(resolved), `GOV-LINK-002: ${filePath} has a missing local link target: ${rawTarget}`);
  }
}

const publicSafePaths = [
  ...governedMarkdown,
  manifestPath,
  taskStatePath,
  readinessStatePath,
  artifactRegisterPath,
  reviewerRegistryPath,
  approvalRegistryPath,
  ownerActionStatePath,
  stageApprovalRegistryPath,
  successorGenesisPath,
  RUNNING_LOG_GENESIS_PATH,
  "tools/generate_phase1_roadmap_manifest.mjs",
  "tools/sync_phase1_github.mjs",
  "tools/build-wiki.mjs",
  "tools/P0-validate-execution-controls.mjs",
  "tools/P0-generate-task-artifacts.mjs",
  "tools/P0-json-trust.mjs",
  "tools/P0-build-task-readiness-input.mjs",
  "tools/P0-readiness-gates.mjs",
  "tools/P0-verify-generated-tracking.mjs",
  "tools/P0-verify-execution-start.mjs",
  "tools/P0-test-execution-controls.mjs",
];
const repositoryPaths = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
  cwd: repoRoot,
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
}).split("\0").filter(Boolean);
const repositoryTextPaths = repositoryPaths.filter((filePath) => {
  const absolutePath = path.join(repoRoot, filePath);
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) return false;
  const extension = path.extname(filePath).toLowerCase();
  if ([".xlsx", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".woff", ".woff2", ".pdf"].includes(extension)) return false;
  const bytes = fs.readFileSync(absolutePath);
  return bytes.length <= 16 * 1024 * 1024 && !bytes.includes(0);
});
const repositoryLocalSyntheticTextPaths = repositoryPaths.filter((filePath) => {
  const absolutePath = path.join(repoRoot, filePath);
  return fs.existsSync(absolutePath)
    && fs.statSync(absolutePath).isFile()
    && LOCAL_SYNTHETIC_CONTENT_POLICY.textExtensions.includes(path.extname(filePath).toLowerCase());
});
for (const filePath of repositoryLocalSyntheticTextPaths) {
  check(
    localSyntheticTextBytesAreSafe(fs.readFileSync(path.join(repoRoot, filePath))),
    `GOV-SAFE-005: ${filePath} contains binary or encoded media bytes under a local-synthetic text extension`,
  );
}
check(
  !localSyntheticTextBytesAreSafe(Buffer.from([0xff, 0xd8, 0xff, 0x00])),
  "GOV-SAFE-006: binary photo bytes pass the local-synthetic text verifier",
);
check(
  !localSyntheticTextBytesAreSafe(Buffer.from(["data", ":", "im", "age/png;base64,", "iV", "BORw0KGgoAAAANSUhEUg"].join(""), "utf8")),
  "GOV-SAFE-007: text-encoded image bytes pass the local-synthetic text verifier",
);
check(
  !localSyntheticTextBytesAreSafe(Buffer.from(["<", "s", "vg xmlns=\"http://www.w3.org/2000/svg\"></", "s", "vg>"].join(""), "utf8")),
  "GOV-SAFE-008: SVG media bytes pass the local-synthetic text verifier",
);
check(
  localSyntheticTextBytesAreSafe(Buffer.from("export const P0_CONTROL = true;\n", "utf8")),
  "GOV-SAFE-009: ordinary UTF-8 control source is rejected",
);
for (const [code, value] of [
  ["GOV-SAFE-010", ["123456789", ":", "A", "A", "abcdefghijklmnopqrstuvwxy123456"].join("")],
  ["GOV-SAFE-011", [["AS", "IA"].join(""), "ABCDEFGHIJKLMNOP"].join("")],
  ["GOV-SAFE-012", [["AI", "za"].join(""), "ABCDEFGHIJKLMNOPQRSTUVWX"].join("")],
  ["GOV-SAFE-013", ["postgres", "://", "user", ":", "password", "@", "private.example/db"].join("")],
]) {
  check(
    !localSyntheticTextBytesAreSafe(Buffer.from(value, "utf8")),
    `${code}: an expanded credential family passes the local-synthetic text verifier`,
  );
}
const githubPatPrefix = ["github", "pat", ""].join("_");
const githubClassicPrefix = ["gh", "[pousr]", "_"].join("");
const slackTokenPrefix = ["xo", "x", "[aboprs]", "-"].join("");
const genericSecretPrefix = ["s", "k", "[-_]"].join("");
const bearerWord = ["Bear", "er"].join("");
const privateKeyWords = ["PRIVATE", "KEY"].join(" ");
const genericApiTokenPattern = new RegExp(`\\b${genericSecretPrefix}[A-Za-z0-9_-]{12,}(?![A-Za-z0-9_-])`);
check(
  genericApiTokenPattern.test(["s", "k", "-", "proj", "-", "ABCDEFGHIJKL"].join("")),
  "GOV-SAFE-003: generic API-token detector misses hyphenated token families",
);
check(
  genericApiTokenPattern.test(["s", "k", "_", "project", "_", "ABCDEFGHIJKL"].join("")),
  "GOV-SAFE-004: generic API-token detector misses underscored token families",
);
const forbiddenPublicPatterns = [
  ["absolute user path", /\/Users\//],
  ["GitHub token", new RegExp(`(?:${githubClassicPrefix}|${githubPatPrefix})[A-Za-z0-9_]{16,}`)],
  ["Slack token", new RegExp(`${slackTokenPrefix}[A-Za-z0-9-]{10,}`)],
  ["Bearer credential", new RegExp(`\\b${bearerWord}\\s+[A-Za-z0-9._~+/=-]{12,}`, "i")],
  ["generic API token", genericApiTokenPattern],
  ["AWS access key", /\bAKIA[0-9A-Z]{12,}\b/],
  ["private key", new RegExp(`-----BEGIN (?:RSA |EC |OPENSSH )?${privateKeyWords}-----`)],
  ["private Project node ID", /\b(?:PVT|PVTI|PVTF|PVTV)_[A-Za-z0-9_-]+\b/],
];
for (const filePath of new Set([...publicSafePaths, ...repositoryTextPaths])) {
  const content = readText(filePath);
  for (const [label, pattern] of forbiddenPublicPatterns) {
    check(!pattern.test(content), `GOV-SAFE-001: ${filePath} contains a ${label}`);
  }
}

const workbookPaths = repositoryPaths.filter((filePath) => path.extname(filePath).toLowerCase() === ".xlsx");
const canonicalWorkbookPath = "outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx";
const sourceManifestDigest = `sha256:${sha256(fs.readFileSync(path.join(repoRoot, manifestPath)))}`;
const sourceManifestLabel = "Source manifest SHA-256";
const sourceManifestWorkbookPath = "docs/project/PHASE1-ROADMAP-MANIFEST.json";
const decodeWorkbookXmlText = (value) => value
  .replace(/&#x([0-9a-f]+);/gi, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 16)))
  .replace(/&#([0-9]+);/g, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 10)))
  .replace(/&quot;/g, "\"")
  .replace(/&apos;/g, "'")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&amp;/g, "&");
const workbookXmlAttributes = (tag) => Object.fromEntries([...tag.matchAll(/([A-Za-z_:][A-Za-z0-9_.:-]*)="([^"]*)"/g)]
  .map((match) => [match[1], decodeWorkbookXmlText(match[2])]));
const readWorkbookEntry = (absolutePath, entry) => execFileSync("unzip", ["-p", absolutePath, entry], {
  cwd: repoRoot,
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
});
const reviewGuideCells = (absolutePath) => {
  const workbookXml = readWorkbookEntry(absolutePath, "xl/workbook.xml");
  const reviewGuideTags = [...workbookXml.matchAll(/<(?:[\p{L}_][\p{L}\p{N}_.-]*:)?sheet\b[^>]*>/gu)]
    .filter((match) => workbookXmlAttributes(match[0]).name === "Review Guide");
  if (reviewGuideTags.length !== 1) return null;
  const relationshipId = workbookXmlAttributes(reviewGuideTags[0][0])["r:id"];
  if (!relationshipId) return null;
  const relationshipsXml = readWorkbookEntry(absolutePath, "xl/_rels/workbook.xml.rels");
  const relationshipTags = [...relationshipsXml.matchAll(/<(?:[\p{L}_][\p{L}\p{N}_.-]*:)?Relationship\b[^>]*\/?\s*>/gu)]
    .filter((match) => workbookXmlAttributes(match[0]).Id === relationshipId);
  if (relationshipTags.length !== 1) return null;
  const rawTarget = workbookXmlAttributes(relationshipTags[0][0]).Target;
  if (!rawTarget) return null;
  const entry = rawTarget.startsWith("/")
    ? rawTarget.slice(1)
    : path.posix.normalize(path.posix.join("xl", rawTarget));
  if (!/^xl\/worksheets\/sheet\d+\.xml$/.test(entry)) return null;
  const sheetXml = readWorkbookEntry(absolutePath, entry);
  const cells = new Map();
  for (const match of sheetXml.matchAll(/<(?:[\p{L}_][\p{L}\p{N}_.-]*:)?c\b([^>]*)>([\s\S]*?)<\/(?:[\p{L}_][\p{L}\p{N}_.-]*:)?c>/gu)) {
    const reference = workbookXmlAttributes(`<c ${match[1]}>`).r;
    const values = [...match[2].matchAll(/<(?:[\p{L}_][\p{L}\p{N}_.-]*:)?(?:v|t)\b[^>]*>([\s\S]*?)<\/(?:[\p{L}_][\p{L}\p{N}_.-]*:)?(?:v|t)>/gu)];
    if (reference && values.length === 1) cells.set(reference, decodeWorkbookXmlText(values[0][1]));
  }
  return cells;
};
const forbiddenWorkbookEntries = /^(?:customXml|xl\/(?:embeddings|externalLinks|media|threadedComments|persons))\/|(?:^|\/)vbaProject\.bin$|(?:^|\/)comments\d*\.xml$/i;
const safeWorkbookEntry = /^(?:\[Content_Types\]\.xml|_rels\/\.rels|docProps\/(?:app|core|custom)\.xml|xl\/(?:workbook|styles|sharedStrings|calcChain|metadata)\.xml|xl\/_rels\/workbook\.xml\.rels|xl\/theme\/theme\d+\.xml|xl\/worksheets\/sheet\d+\.xml|xl\/worksheets\/_rels\/sheet\d+\.xml\.rels|xl\/drawings\/drawing\d+\.xml|xl\/drawings\/_rels\/drawing\d+\.xml\.rels|xl\/drawings\/charts\/chart\d+\.xml|xl\/tables\/table\d+\.xml)$/;
const unsafeArchivePath = /(?:^\/|(?:^|\/)\.\.(?:\/|$)|\\)/;
const privateWorkbookTargets = /(?:file|ssh|postgres(?:ql)?|mysql|mongodb|redis):\/\/|https?:\/\/(?:localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)(?=[:/]|$)/i;
const workbookSentinelSuffix = ["SENT", "INEL"].join("");
const forbiddenWorkbookSentinels = [
  new RegExp(`AUTHENTIC_(?:JOURNAL|PHOTO|MEDIA|CONTENT)_${workbookSentinelSuffix}`),
  new RegExp(`PRIVATE_(?:HOST|URL|ACCOUNT|TOPOLOGY)_${workbookSentinelSuffix}`),
  new RegExp(`(?:PROJECT_NODE_ID|RECOVERY_VALUE|RAW_RESPONSE)_${workbookSentinelSuffix}`),
];
check(
  ["payload.jpg", "docProps/thumbnail.jpeg", "secret.bin", "xl/media/image1.png"].every((entry) => !safeWorkbookEntry.test(entry)),
  "GOV-WORKBOOK-SAFE-009: closed workbook-part allowlist accepts an adversarial binary payload",
);
check(!xlsxRelationshipXmlIsSafe('<r:Relationship TargetMode="External" Target="//example.invalid/x"/>'), "GOV-WORKBOOK-SAFE-012: prefixed external relationship bypasses the shared parser");
check(!xlsxRelationshipXmlIsSafe('<Relationship TargetMode="Ext&#x65;rnal" Target="//example.invalid/x"/>'), "GOV-WORKBOOK-SAFE-013: entity-encoded external relationship bypasses the shared parser");
check(!xlsxRelationshipXmlIsSafe('<α:Relationship TargetMode="External" Target="//example.invalid/x"/>'), "GOV-WORKBOOK-SAFE-015: Unicode-prefixed external relationship bypasses the shared parser");
check(!xlsxFormulaXmlIsSafe('<x:f>WEBSERVICE("https://example.invalid/x")</x:f>'), "GOV-WORKBOOK-SAFE-016: network-capable worksheet formula bypasses the shared parser");
check(!xlsxFormulaXmlIsSafe('<x:f>\'[other.xlsx]Sheet 1\'!A1</x:f>'), "GOV-WORKBOOK-SAFE-017: external-workbook formula bypasses the shared parser");
check(xlsxFormulaXmlIsSafe('<x:f>COUNTA(A1:A3)</x:f>'), "GOV-WORKBOOK-SAFE-018: ordinary local worksheet formula is rejected");
check(!xlsxFormulaXmlIsSafe('<x:f>_xlfn.WEBSERVICE("h"&amp;"ttps://example.invalid/x")</x:f>'), "GOV-WORKBOOK-SAFE-019: qualified network-capable worksheet formula bypasses the shared parser");
check(!xlsxFormulaXmlIsSafe('<definedName>_xlfn.HYPERLINK("h"&amp;"ttps://example.invalid/x")</definedName>'), "GOV-WORKBOOK-SAFE-020: dangerous defined-name formula bypasses the shared parser");
check(!xlsxFormulaXmlIsSafe('<x:calculatedColumnFormula>\'[other.xlsx]Sheet 1\'!A1</x:calculatedColumnFormula>'), "GOV-WORKBOOK-SAFE-021: table external-reference formula bypasses the shared parser");
check(!xlsxRelationshipXmlIsSafe('<Relationship x:Target="xl/workbook.xml" Target="https://example.invalid/x"/>'), "GOV-WORKBOOK-SAFE-022: namespaced Target shadows the unsafe OPC Target");
check(!xlsxFormulaXmlIsSafe('<definedName name="_xlnm.Auto_Open">EVALUATE("x")</definedName>'), "GOV-WORKBOOK-SAFE-023: legacy XLM auto-open formula bypasses the shared parser");
check(!xlsxFormulaXmlIsSafe('<definedName>GET.WORKSPACE(1)</definedName>'), "GOV-WORKBOOK-SAFE-024: legacy XLM information function bypasses the shared parser");
for (const filePath of workbookPaths) {
  const absolutePath = path.join(repoRoot, filePath);
  check(xlsxArchiveIsSafe(fs.readFileSync(absolutePath)), `GOV-WORKBOOK-SAFE-014: ${filePath} fails the shared raw-byte XLSX safety verifier`);
  try {
    execFileSync("unzip", ["-tqq", absolutePath], { cwd: repoRoot, stdio: "ignore" });
  } catch {
    failures.push(`GOV-WORKBOOK-SAFE-001: ${filePath} is not a valid readable XLSX archive`);
    continue;
  }
  const entries = execFileSync("unzip", ["-Z1", absolutePath], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  }).split(/\r?\n/).filter(Boolean);
  check(new Set(entries).size === entries.length, `GOV-WORKBOOK-SAFE-002: ${filePath} contains duplicate ZIP entries`);
  check(entries.every((entry) => !unsafeArchivePath.test(entry)), `GOV-WORKBOOK-SAFE-003: ${filePath} contains an unsafe ZIP path`);
  check(entries.every((entry) => !forbiddenWorkbookEntries.test(entry)), `GOV-WORKBOOK-SAFE-004: ${filePath} contains media, embedding, external-link, comment, custom-XML, or macro content`);
  check(entries.every((entry) => safeWorkbookEntry.test(entry)), `GOV-WORKBOOK-SAFE-010: ${filePath} contains a ZIP part outside the closed safe workbook allowlist`);
  let inspectedBytes = 0;
  for (const entry of entries.filter((entry) => /(?:\.xml|\.rels)$/i.test(entry))) {
    let content;
    try {
      const archiveEntryArgument = entry.replaceAll("[", "\\[").replaceAll("]", "\\]");
      const bytes = execFileSync("unzip", ["-p", absolutePath, archiveEntryArgument], {
        cwd: repoRoot,
        encoding: null,
        maxBuffer: 32 * 1024 * 1024,
      });
      inspectedBytes += bytes.length;
      if (inspectedBytes > 64 * 1024 * 1024) throw new Error("archive text budget exceeded");
      content = bytes.toString("utf8");
    } catch {
      failures.push(`GOV-WORKBOOK-SAFE-005: ${filePath} could not safely inspect ${entry}`);
      break;
    }
    for (const [label, pattern] of forbiddenPublicPatterns) {
      check(!pattern.test(content), `GOV-WORKBOOK-SAFE-006: ${filePath}:${entry} contains a ${label}`);
    }
    check(!privateWorkbookTargets.test(content), `GOV-WORKBOOK-SAFE-007: ${filePath}:${entry} contains a private/local target`);
    check(forbiddenWorkbookSentinels.every((pattern) => !pattern.test(content)), `GOV-WORKBOOK-SAFE-008: ${filePath}:${entry} contains a forbidden private/authentic sentinel`);
    if (entry === "[Content_Types].xml") {
      check(!/ContentType="[^"]*(?:image|vba|oleObject|externalLink|customXml|comments)/i.test(content), `GOV-WORKBOOK-SAFE-011: ${filePath} declares a forbidden workbook content type`);
    }
  }
  if (filePath === canonicalWorkbookPath) {
    let cells;
    try {
      cells = reviewGuideCells(absolutePath);
    } catch {
      cells = null;
    }
    check(cells instanceof Map, `GOV-WORKBOOK-FRESH-001: ${filePath} does not resolve exactly one Review Guide worksheet`);
    if (cells instanceof Map) {
      check(cells.get("A7") === sourceManifestLabel, `GOV-WORKBOOK-FRESH-002: ${filePath} Review Guide A7 lacks the canonical source-manifest label`);
      check(cells.get("B7") === sourceManifestDigest, `GOV-WORKBOOK-FRESH-003: ${filePath} Review Guide B7 is stale for the current manifest bytes`);
      check(cells.get("C7")?.startsWith(sourceManifestWorkbookPath), `GOV-WORKBOOK-FRESH-004: ${filePath} Review Guide C7 lacks the canonical source-manifest path`);
      check([...cells.values()].filter((value) => value === sourceManifestLabel).length === 1, `GOV-WORKBOOK-FRESH-005: ${filePath} has a duplicate source-manifest label in Review Guide`);
      check([...cells.values()].filter((value) => value === sourceManifestDigest).length === 1, `GOV-WORKBOOK-FRESH-006: ${filePath} has a duplicate source-manifest digest in Review Guide`);
    }
  }
}

const publicEvidencePaths = new Set([
  ...governedMarkdown,
  manifestPath,
  taskStatePath,
  readinessStatePath,
  artifactRegisterPath,
  reviewerRegistryPath,
  approvalRegistryPath,
  ownerActionStatePath,
  stageApprovalRegistryPath,
  successorGenesisPath,
  RUNNING_LOG_GENESIS_PATH,
  ...repositoryTextPaths,
]);
const sentinelSuffix = ["SENT", "INEL"].join("");
const forbiddenEvidenceSentinels = [
  ["authentic-content sentinel", new RegExp(`AUTHENTIC_(?:JOURNAL|PHOTO|MEDIA|CONTENT)_${sentinelSuffix}`)],
  ["private-target sentinel", new RegExp(`PRIVATE_(?:HOST|URL|ACCOUNT|TOPOLOGY)_${sentinelSuffix}`)],
  ["private Project node sentinel", new RegExp(`PROJECT_NODE_ID_${sentinelSuffix}`)],
  ["recovery-value sentinel", new RegExp(`RECOVERY_VALUE_${sentinelSuffix}`)],
  ["raw-response sentinel", new RegExp(`RAW_RESPONSE_${sentinelSuffix}`)],
];
for (const filePath of publicEvidencePaths) {
  const content = readText(filePath);
  for (const [label, pattern] of forbiddenEvidenceSentinels) {
    check(!pattern.test(content), `GOV-SAFE-002: ${filePath} contains a ${label}`);
  }
}

check(manifest.project?.deploymentState === "Unknown — private read authority pending", "GOV-AUTH-001: deployment state is not the exact approved unknown value");
check(manifest.project?.latestFrozenPrototype === "prototypes/calendar-ui/index-v10.html", "GOV-PROT-001: latest frozen prototype is not v10");
check(artifactRegister.authenticMediaAccessed === false, "GOV-AUTH-002: artifact register does not explicitly preserve authenticMediaAccessed=false");
check(artifactRegister.privateNetworkAccessed === false, "GOV-AUTH-003: artifact register does not explicitly preserve privateNetworkAccessed=false");

if (failures.length) {
  console.error(`P0 execution-control validation failed (${failures.length} finding${failures.length === 1 ? "" : "s"}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  result: "pass",
  requirements: { total: prdIds.size, active: 71, deferred: [...deferredIds].sort() },
  tasks: { total: tasks.length, p0ThroughR9: 55, r10: 3, statuses: actualStatuses },
  evidenceLinkedTasks: tasks.filter((task) => task.evidenceReferencePaths?.length).length,
  executionArtifacts: executionFiles.length,
  taskArtifacts: workItemFiles.length,
  artifactReadiness: artifactRegister.summary,
  authenticMediaAccessed: false,
  deploymentState: manifest.project.deploymentState,
}, null, 2));
