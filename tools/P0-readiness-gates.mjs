import crypto from "node:crypto";
import path from "node:path";

export const READINESS_SCHEMA_VERSION = "2.0.0";
export const APPROVAL_REGISTRY_PATH = "docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json";
export const ARTIFACT_KINDS = Object.freeze([
  "product",
  "architecture",
  "design",
  "qa",
  "delivery",
  "council",
]);
export const COUNCIL_SEATS = Object.freeze([
  "product",
  "design",
  "architecture",
  "qa",
  "project",
]);
export const P0_R0_SCOPE_TASK_IDS = Object.freeze([
  "AUD-001",
  "PC-001",
  "PRD-R0-001",
  "SPK-R0-001",
  "UX-R0-001",
  "ARCH-R0-001",
  "ENG-R0-001",
  "REL-R0-001",
]);
export const P0_R0_SUBSTANTIVE_TASK_IDS = Object.freeze([
  "SPK-R0-001",
  "UX-R0-001",
  "ARCH-R0-001",
  "ENG-R0-001",
  "REL-R0-001",
]);
export const TASK_PREPARATION_SCHEMA_VERSION = "1.0.0";
export const STAGE_EXECUTION_SCHEMA_VERSION = "1.0.0";
export const STAGE_APPROVAL_REGISTRY_PATH = "docs/council/execution/P0-R0-STAGE-APPROVAL-REGISTRY.json";
export const DELIVERY_TRANSITION_GATE_B_CONTRACT = Object.freeze({
  stageIdSuffix: "-DELIVERY-TRANSITION",
  scopeClass: "private-execution",
  actionClass: "project-workflow-mutation",
  moduleId: "p0.delivery-transition",
  modulePath: "tools/P0-delivery-transition.mjs",
});
export const STAGE_LIFECYCLE_STATES = Object.freeze([
  "declared",
  "ready",
  "running",
  "verification-pending",
  "recovery-required",
  "rolling-back",
  "verified-complete",
  "verified-rolled-back",
  "cancelled-before-mutation",
  "blocked-no-mutation",
  "expired-before-mutation",
]);
export const TERMINAL_STAGE_STATES = Object.freeze([
  "verified-complete",
  "verified-rolled-back",
  "cancelled-before-mutation",
  "blocked-no-mutation",
  "expired-before-mutation",
]);
export const TASK_FILE_PURPOSES = Object.freeze([
  ...ARTIFACT_KINDS.map((kind) => `artifact:${kind}`),
  "implementation",
  "evidence",
]);
export const TASK_FILE_GIT_MODES = Object.freeze(["100644", "100755"]);
const LOCAL_SYNTHETIC_TEXT_EXTENSIONS = Object.freeze([
  ".cjs", ".css", ".csv", ".html", ".js", ".json", ".jsonl", ".jsx",
  ".md", ".mjs", ".py", ".scss", ".sh", ".sql", ".toml", ".ts",
  ".tsv", ".tsx", ".txt", ".xml", ".yaml", ".yml", ".zsh",
]);
const LOCAL_SYNTHETIC_FORBIDDEN_EMBEDDED_EXTENSIONS = Object.freeze([
  ".7z", ".aac", ".aiff", ".apk", ".avi", ".avif", ".bin", ".bmp",
  ".class", ".db", ".dmg", ".doc", ".docx", ".exe", ".flac", ".gif",
  ".gz", ".heic", ".heif", ".ico", ".iso", ".jar", ".jpeg", ".jpg",
  ".m4a", ".mkv", ".mov", ".mp3", ".mp4", ".mpeg", ".mpg", ".ogg",
  ".pdf", ".pkg", ".png", ".ppt", ".pptx", ".rar", ".raw", ".sqlite",
  ".svg", ".tar", ".tif", ".tiff", ".wav", ".wasm", ".webm", ".webp",
  ".xls", ".xlsx", ".xz", ".zip",
]);
export const LOCAL_SYNTHETIC_CONTENT_POLICY = Object.freeze({
  textExtensions: LOCAL_SYNTHETIC_TEXT_EXTENSIONS,
  workbookExtensions: Object.freeze([".xlsx"]),
  workbookPurposes: Object.freeze(["evidence"]),
  forbiddenEmbeddedExtensions: LOCAL_SYNTHETIC_FORBIDDEN_EMBEDDED_EXTENSIONS,
  byteChecksByContentClass: Object.freeze({
    text: Object.freeze(["fatal-utf8", "no-nul", "no-binary-magic"]),
    "xlsx-workbook": Object.freeze(["xlsx-archive"]),
  }),
});
export const LOCAL_SYNTHETIC_TASK_FILE_EXTENSIONS = Object.freeze([
  ...LOCAL_SYNTHETIC_CONTENT_POLICY.textExtensions,
  ...LOCAL_SYNTHETIC_CONTENT_POLICY.workbookExtensions,
]);
// These publication/projection surfaces are regenerated after candidate review
// and independently validated, so they are excluded from the candidate diff.
// Immutable task evidence (including the P0 review workbook) is not excluded.
// Deletions, renames, and non-blob type transitions remain forbidden in v2.
export const TASK_FILE_DIFF_EXCLUSIONS = Object.freeze([
  APPROVAL_REGISTRY_PATH,
  "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json",
  "docs/project/PHASE1-ROADMAP-MANIFEST.json",
  "docs/project/PHASE1-RELEASE-PLAN.md",
  "outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx",
]);
export const TASK_FILE_DESCENDANT_DELTA_PATHS = Object.freeze([
  ...TASK_FILE_DIFF_EXCLUSIONS,
  // Gate A acceptance and later Gate B stage approval are append-only records
  // published after their distinct reviewed candidates.
  STAGE_APPROVAL_REGISTRY_PATH,
  // A private/release candidate may complete its candidate-bound accountable-
  // human action only after candidate review and before approval publication.
  "docs/council/execution/P0-OWNER-ACTION-STATE.json",
]);
export const DESIGN_STATE_DIMENSIONS = Object.freeze([
  "normal",
  "empty",
  "loading",
  "error",
  "interruption",
  "destructive",
]);
export const DESIGN_ACCESSIBILITY_DIMENSIONS = Object.freeze([
  "keyboard",
  "focus",
  "screenReader",
  "targetSize",
  "contrast",
  "zoom",
  "reducedMotion",
]);
export const SCOPE_ACTION_COMPATIBILITY = Object.freeze({
  "local-synthetic": Object.freeze([
    "planning-control",
    "readiness-control-hardening",
    "synthetic-foundation",
  ]),
  "private-execution": Object.freeze([
    "private-system-read",
    "private-system-mutation",
    "account-authentication",
    "credential-use",
    "project-workflow-mutation",
    "project-non-delivery-item",
    "deployment",
    "provider-change",
    "spend-change",
    "integration-activation",
    "privacy-decision",
  ]),
  release: Object.freeze([
    "private-system-read",
    "private-system-mutation",
    "account-authentication",
    "credential-use",
    "deployment",
    "synthetic-foundation",
    "authentic-text-admission",
    "authentic-photo-admission",
    "authentic-photo-uat",
    "date-integrity-release",
    "source-lifecycle-release",
    "integration-activation",
    "provider-change",
    "privacy-decision",
    "spend-change",
    "integrated-evidence",
    "recovery-key-custody",
    "recovery-ceremony",
    "owner-uat",
    "final-launch-decision",
    "transition-trigger",
    "irreversible-transition-stage",
    "last-copy-retirement",
    "release-publication",
  ]),
});

const freezeScopeActionMap = (value) => Object.freeze(Object.fromEntries(
  Object.entries(value).map(([scopeClass, actionClasses]) => [scopeClass, Object.freeze([...actionClasses])]),
));
const taskExecutionContract = (milestone, scopeActions) => Object.freeze({
  milestone,
  scopeActions: freezeScopeActionMap(scopeActions),
});

/**
 * Closed task-milestone/scope/action contract. Scope compatibility answers
 * whether an action is safe in the abstract; this matrix additionally answers
 * whether that exact milestone (or named task override) owns the action.
 */
export const MILESTONE_SCOPE_ACTION_COMPATIBILITY = Object.freeze({
  P0: freezeScopeActionMap({
    "local-synthetic": ["planning-control", "readiness-control-hardening"],
    "private-execution": ["private-system-read", "private-system-mutation", "project-workflow-mutation", "project-non-delivery-item"],
    release: ["release-publication"],
  }),
  R0: freezeScopeActionMap({
    "local-synthetic": ["planning-control", "synthetic-foundation"],
    "private-execution": ["private-system-read", "private-system-mutation", "deployment"],
    release: ["synthetic-foundation"],
  }),
  R1: freezeScopeActionMap({
    "local-synthetic": ["planning-control"],
    release: ["authentic-text-admission"],
  }),
  R2: freezeScopeActionMap({
    "local-synthetic": ["planning-control"],
    release: ["authentic-photo-admission"],
  }),
  R3: freezeScopeActionMap({
    "local-synthetic": ["planning-control"],
    release: ["date-integrity-release"],
  }),
  R4: freezeScopeActionMap({
    "local-synthetic": ["planning-control"],
    release: ["source-lifecycle-release"],
  }),
  R5: freezeScopeActionMap({
    "local-synthetic": ["planning-control", "synthetic-foundation"],
    "private-execution": ["account-authentication"],
    release: ["integration-activation"],
  }),
  R6: freezeScopeActionMap({
    "local-synthetic": ["planning-control"],
    release: ["provider-change"],
  }),
  R7: freezeScopeActionMap({
    "local-synthetic": ["planning-control"],
    release: ["privacy-decision"],
  }),
  R8: freezeScopeActionMap({
    "local-synthetic": ["planning-control"],
    release: ["integrated-evidence"],
  }),
  R9: freezeScopeActionMap({
    "local-synthetic": ["planning-control"],
    release: ["final-launch-decision"],
  }),
  R10: freezeScopeActionMap({
    "local-synthetic": ["planning-control"],
    release: ["transition-trigger"],
  }),
});

/**
 * Every Phase 1 task is named here. There is deliberately no milestone
 * fallback: an action must be present in this task contract and in the
 * milestone upper bound. One task approval binds one execution-bearing action;
 * multi-action work requires a Council-approved task split or a future staged
 * approval schema.
 */
export const TASK_EXECUTION_CONTRACT = Object.freeze({
  "AUD-001": taskExecutionContract("P0", {
    "local-synthetic": ["planning-control"],
  }),
  "PC-001": taskExecutionContract("P0", {
    "local-synthetic": ["readiness-control-hardening"],
  }),
  "SPK-R0-001": taskExecutionContract("R0", {
    "local-synthetic": ["synthetic-foundation"],
    "private-execution": ["private-system-read"],
  }),
  "PRD-R0-001": taskExecutionContract("R0", {
    "local-synthetic": ["planning-control"],
  }),
  "UX-R0-001": taskExecutionContract("R0", {
    "local-synthetic": ["synthetic-foundation"],
  }),
  "ARCH-R0-001": taskExecutionContract("R0", {
    "local-synthetic": ["synthetic-foundation"],
    "private-execution": ["private-system-read"],
  }),
  "ENG-R0-001": taskExecutionContract("R0", {
    "local-synthetic": ["synthetic-foundation"],
    "private-execution": ["deployment"],
  }),
  "REL-R0-001": taskExecutionContract("R0", {
    release: ["synthetic-foundation"],
    "private-execution": ["private-system-read", "private-system-mutation"],
  }),
  "PRD-R1-001": taskExecutionContract("R1", { "local-synthetic": ["planning-control"] }),
  "UX-R1-001": taskExecutionContract("R1", { "local-synthetic": ["planning-control"] }),
  "ARCH-R1-001": taskExecutionContract("R1", { "local-synthetic": ["planning-control"] }),
  "ENG-R1-001": taskExecutionContract("R1", { release: ["authentic-text-admission"] }),
  "REL-R1-001": taskExecutionContract("R1", { release: ["authentic-text-admission"] }),
  "PRD-R2-001": taskExecutionContract("R2", { "local-synthetic": ["planning-control"] }),
  "UX-R2-001": taskExecutionContract("R2", { "local-synthetic": ["planning-control"] }),
  "ARCH-R2-001": taskExecutionContract("R2", { "local-synthetic": ["planning-control"] }),
  "ENG-R2-001": taskExecutionContract("R2", { release: ["authentic-photo-admission"] }),
  "ENG-R2-002": taskExecutionContract("R2", { release: ["authentic-photo-admission"] }),
  "REL-R2-001": taskExecutionContract("R2", { release: ["authentic-photo-admission"] }),
  "PRD-R3-001": taskExecutionContract("R3", { "local-synthetic": ["planning-control"] }),
  "UX-R3-001": taskExecutionContract("R3", { "local-synthetic": ["planning-control"] }),
  "ARCH-R3-001": taskExecutionContract("R3", { "local-synthetic": ["planning-control"] }),
  "ENG-R3-001": taskExecutionContract("R3", { release: ["date-integrity-release"] }),
  "REL-R3-001": taskExecutionContract("R3", { release: ["date-integrity-release"] }),
  "PRD-R4-001": taskExecutionContract("R4", { "local-synthetic": ["planning-control"] }),
  "UX-R4-001": taskExecutionContract("R4", { "local-synthetic": ["planning-control"] }),
  "ARCH-R4-001": taskExecutionContract("R4", { "local-synthetic": ["planning-control"] }),
  "ENG-R4-001": taskExecutionContract("R4", { release: ["source-lifecycle-release"] }),
  "ENG-R4-002": taskExecutionContract("R4", { release: ["source-lifecycle-release"] }),
  "REL-R4-001": taskExecutionContract("R4", { release: ["source-lifecycle-release"] }),
  "SPK-R5-001": taskExecutionContract("R5", {
    "local-synthetic": ["synthetic-foundation"],
    "private-execution": ["account-authentication"],
  }),
  "PRD-R5-001": taskExecutionContract("R5", { "local-synthetic": ["planning-control"] }),
  "UX-R5-001": taskExecutionContract("R5", { "local-synthetic": ["planning-control"] }),
  "ARCH-R5-001": taskExecutionContract("R5", { "local-synthetic": ["planning-control"] }),
  "ENG-R5-001": taskExecutionContract("R5", { release: ["integration-activation"] }),
  "REL-R5-001": taskExecutionContract("R5", { release: ["integration-activation"] }),
  "EVAL-R6-001": taskExecutionContract("R6", {
    "local-synthetic": ["planning-control"],
    release: ["provider-change"],
  }),
  "PRD-R6-001": taskExecutionContract("R6", { "local-synthetic": ["planning-control"] }),
  "UX-R6-001": taskExecutionContract("R6", { "local-synthetic": ["planning-control"] }),
  "ARCH-R6-001": taskExecutionContract("R6", { "local-synthetic": ["planning-control"] }),
  "ENG-R6-001": taskExecutionContract("R6", { release: ["provider-change"] }),
  "REL-R6-001": taskExecutionContract("R6", { release: ["provider-change"] }),
  "EVAL-R7-001": taskExecutionContract("R7", {
    "local-synthetic": ["planning-control"],
    release: ["privacy-decision"],
  }),
  "PRD-R7-001": taskExecutionContract("R7", { "local-synthetic": ["planning-control"] }),
  "UX-R7-001": taskExecutionContract("R7", { "local-synthetic": ["planning-control"] }),
  "ARCH-R7-001": taskExecutionContract("R7", { "local-synthetic": ["planning-control"] }),
  "ENG-R7-001": taskExecutionContract("R7", { release: ["privacy-decision"] }),
  "REL-R7-001": taskExecutionContract("R7", { release: ["privacy-decision"] }),
  "PRD-R8-001": taskExecutionContract("R8", { "local-synthetic": ["planning-control"] }),
  "ARCH-R8-001": taskExecutionContract("R8", { "local-synthetic": ["planning-control"] }),
  "QA-R8-001": taskExecutionContract("R8", { release: ["integrated-evidence"] }),
  "REL-R8-001": taskExecutionContract("R8", { release: ["integrated-evidence"] }),
  "PRD-R9-001": taskExecutionContract("R9", { "local-synthetic": ["planning-control"] }),
  "QA-R9-001": taskExecutionContract("R9", { release: ["final-launch-decision"] }),
  "REL-R9-001": taskExecutionContract("R9", { release: ["final-launch-decision"] }),
  "PID-R10-001": taskExecutionContract("R10", { "local-synthetic": ["planning-control"] }),
  "ARCH-R10-001": taskExecutionContract("R10", { "local-synthetic": ["planning-control"] }),
  "REL-R10-001": taskExecutionContract("R10", { release: ["transition-trigger"] }),
});

export const TASK_SCOPE_ACTION_COMPATIBILITY = Object.freeze(Object.fromEntries(
  Object.entries(TASK_EXECUTION_CONTRACT).map(([taskId, contract]) => [taskId, contract.scopeActions]),
));
export const TASK_APPROVAL_EXECUTION_ACTION_CARDINALITY = 1;

export const HISTORICAL_DONE_PLANNING_TASK_IDS = Object.freeze([
  "AUD-001",
  "PRD-R0-001", "PRD-R1-001", "PRD-R2-001", "PRD-R3-001", "PRD-R4-001",
  "PRD-R5-001", "PRD-R6-001", "PRD-R7-001", "PRD-R8-001", "PRD-R9-001",
  "PID-R10-001",
]);
const HISTORICAL_DONE_PLANNING_TASK_ID_SET = new Set(HISTORICAL_DONE_PLANNING_TASK_IDS);
export const HISTORICAL_NON_AUTHORIZING_TASK_IDS = Object.freeze([
  ...HISTORICAL_DONE_PLANNING_TASK_IDS,
  "PC-001",
]);
const HISTORICAL_NON_AUTHORIZING_TASK_ID_SET = new Set(HISTORICAL_NON_AUTHORIZING_TASK_IDS);

/** Non-authorizing future intent; these pairs cannot satisfy the current PC-001 approval contract. */
export const TASK_FUTURE_SCOPE_ACTION_OPTIONS = Object.freeze({
  "PC-001": freezeScopeActionMap({
    "local-synthetic": ["planning-control"],
    "private-execution": ["private-system-read", "private-system-mutation", "project-workflow-mutation", "project-non-delivery-item"],
    release: ["release-publication"],
  }),
});

export function isHistoricalDonePlanningTaskId(taskId) {
  return HISTORICAL_DONE_PLANNING_TASK_ID_SET.has(taskId);
}

export function isHistoricalNonAuthorizingTaskId(taskId) {
  return HISTORICAL_NON_AUTHORIZING_TASK_ID_SET.has(taskId);
}

export function taskExecutionContractPairCount(taskId) {
  const scopeActions = TASK_EXECUTION_CONTRACT[taskId]?.scopeActions;
  return Object.values(scopeActions ?? {}).reduce((count, actionClasses) => count + asArray(actionClasses).length, 0);
}

export function defaultTaskScopeAction(taskId) {
  const scopeEntries = Object.entries(TASK_EXECUTION_CONTRACT[taskId]?.scopeActions ?? {});
  if (scopeEntries.length === 0) return null;
  const [scopeClass, actionClasses] = scopeEntries[0];
  const actionClass = actionClasses[0];
  return isNonemptyString(scopeClass) && isNonemptyString(actionClass)
    ? { scopeClass, actionClass }
    : null;
}

export function canonicalMilestoneForTaskId(taskId) {
  return TASK_EXECUTION_CONTRACT[taskId]?.milestone ?? null;
}

export function isTaskMilestoneScopeActionCompatible({ taskId, milestone, scopeClass, actionClass }) {
  const taskContract = TASK_EXECUTION_CONTRACT[taskId];
  if (!taskContract || taskContract.milestone !== milestone) return false;
  if (!asArray(SCOPE_ACTION_COMPATIBILITY[scopeClass]).includes(actionClass)) return false;
  if (!asArray(MILESTONE_SCOPE_ACTION_COMPATIBILITY[milestone]?.[scopeClass]).includes(actionClass)) return false;
  return asArray(taskContract.scopeActions[scopeClass]).includes(actionClass);
}

export function isDedicatedDeliveryTransitionScopeAction({ taskId, stageId, scopeClass, actionClass }) {
  return P0_R0_SUBSTANTIVE_TASK_IDS.includes(taskId)
    && typeof stageId === "string"
    && stageId.startsWith(`P0-STAGE-${taskId}-`)
    && stageId.endsWith(DELIVERY_TRANSITION_GATE_B_CONTRACT.stageIdSuffix)
    && scopeClass === DELIVERY_TRANSITION_GATE_B_CONTRACT.scopeClass
    && actionClass === DELIVERY_TRANSITION_GATE_B_CONTRACT.actionClass;
}

export const OWNER_ACTION_IDS_BY_MILESTONE = Object.freeze({
  P0: Object.freeze([]),
  R0: Object.freeze(["P0-OA-001", "R0-OA-001", "R0-OA-002"]),
  R1: Object.freeze(["P0-OA-001", "R1-OA-001"]),
  R2: Object.freeze(["P0-OA-001", "R2-OA-001", "R2-OA-002"]),
  R3: Object.freeze(["P0-OA-001"]),
  R4: Object.freeze(["P0-OA-001"]),
  R5: Object.freeze(["P0-OA-001", "R5-OA-001"]),
  R6: Object.freeze(["P0-OA-001", "R6-OA-001"]),
  R7: Object.freeze(["P0-OA-001", "R7-OA-001"]),
  R8: Object.freeze(["P0-OA-001"]),
  R9: Object.freeze(["P0-OA-001", "R9-OA-001", "R9-OA-002", "R9-OA-003", "R9-OA-004"]),
  R10: Object.freeze(["P0-OA-001", "R10-OA-001", "R10-OA-002"]),
});

export const OWNER_ACTION_IDS_BY_TASK = Object.freeze({
  "PC-001": Object.freeze(["P0-OA-001", "P0-OA-002"]),
});

export function canonicalOwnerActionIdsForTask({ taskId, milestone }) {
  if (canonicalMilestoneForTaskId(taskId) !== milestone) return [];
  return [...(OWNER_ACTION_IDS_BY_TASK[taskId] ?? OWNER_ACTION_IDS_BY_MILESTONE[milestone] ?? [])];
}

const GLOBAL_PRIVATE_RELEASE_ACTION_CLASSES = Object.freeze([
  ...new Set([
    ...SCOPE_ACTION_COMPATIBILITY["private-execution"],
    ...SCOPE_ACTION_COMPATIBILITY.release,
  ]),
]);

export const OWNER_ACTION_REQUIREMENT_CATALOG = Object.freeze({
  "P0-OA-001": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["private-execution", "release"]),
    requiredForActionClasses: GLOBAL_PRIVATE_RELEASE_ACTION_CLASSES,
  }),
  "P0-OA-002": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["private-execution"]),
    requiredForActionClasses: Object.freeze(["project-workflow-mutation", "project-non-delivery-item"]),
  }),
  "R0-OA-001": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["private-execution"]),
    requiredForActionClasses: Object.freeze(["private-system-read", "private-system-mutation", "deployment"]),
  }),
  "R0-OA-002": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["private-execution", "release"]),
    requiredForActionClasses: Object.freeze(["provider-change", "spend-change"]),
  }),
  "R1-OA-001": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["private-execution", "release"]),
    requiredForActionClasses: Object.freeze(["authentic-text-admission"]),
  }),
  "R2-OA-001": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["private-execution", "release"]),
    requiredForActionClasses: Object.freeze(["account-authentication", "credential-use", "authentic-photo-admission"]),
  }),
  "R2-OA-002": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["private-execution", "release"]),
    requiredForActionClasses: Object.freeze(["authentic-photo-admission", "authentic-photo-uat"]),
  }),
  "R5-OA-001": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["private-execution", "release"]),
    requiredForActionClasses: Object.freeze(["account-authentication", "integration-activation"]),
  }),
  "R6-OA-001": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["private-execution", "release"]),
    requiredForActionClasses: Object.freeze(["provider-change", "privacy-decision", "spend-change", "credential-use"]),
  }),
  "R7-OA-001": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["private-execution", "release"]),
    requiredForActionClasses: Object.freeze(["provider-change", "privacy-decision", "spend-change", "credential-use"]),
  }),
  "R9-OA-001": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["release"]),
    requiredForActionClasses: Object.freeze(["recovery-key-custody", "final-launch-decision"]),
  }),
  "R9-OA-002": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["release"]),
    requiredForActionClasses: Object.freeze(["recovery-ceremony", "final-launch-decision"]),
  }),
  "R9-OA-003": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["release"]),
    requiredForActionClasses: Object.freeze(["owner-uat", "final-launch-decision"]),
  }),
  "R9-OA-004": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["release"]),
    requiredForActionClasses: Object.freeze(["final-launch-decision"]),
  }),
  "R10-OA-001": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["release"]),
    requiredForActionClasses: Object.freeze(["transition-trigger", "provider-change", "spend-change"]),
  }),
  "R10-OA-002": Object.freeze({
    accountableHumanRole: "owner-authority",
    requiredForScopeClasses: Object.freeze(["release"]),
    requiredForActionClasses: Object.freeze(["irreversible-transition-stage", "last-copy-retirement", "transition-trigger"]),
  }),
});

const FULL_REVISION = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const STAGE_ID = /^P0-STAGE-[A-Z0-9]+(?:-[A-Z0-9]+)+$/;
const PREPARATION_REVIEW_ID = /^P0-PREP-[A-Z0-9]+(?:-[A-Z0-9]+)+$/;
const IDEMPOTENCY_KEY = /^P0-IDEMP-[A-Z0-9]+(?:-[A-Z0-9]+)+$/;
const OPAQUE_REFERENCE = /^[a-z][a-z0-9-]*:[A-Za-z0-9._/-]{4,}$/;
const AUTHORITY_ID = /^P0-AUTH-[A-Z0-9-]{4,}$/;
const REQUIRED_APPROVED_ARTIFACTS = new Set(["product", "qa", "delivery", "council"]);
const OPTIONAL_NA_ARTIFACTS = new Set(["architecture", "design"]);
const PERMITTING_VERDICTS = new Set([
  "ready-local-synthetic",
  "ready-private-execution",
  "proceed-release",
]);
const ARTIFACT_CONTENT_STATES = new Set(["draft", "in-review", "approved", "blocked", "not-applicable"]);
const ARTIFACT_ROLE = Object.freeze({
  product: "product",
  architecture: "architecture",
  design: "design",
  qa: "qa",
  delivery: "project",
  council: "project",
});
const SEAT_ROLE = Object.freeze({
  product: "product",
  design: "design",
  architecture: "architecture",
  qa: "qa",
  project: "project",
});
const VERDICT_FOR_SCOPE = Object.freeze({
  "local-synthetic": "ready-local-synthetic",
  "private-execution": "ready-private-execution",
  release: "proceed-release",
});
const DECISION_FOR_SCOPE = Object.freeze({
  "local-synthetic": "Ready for local synthetic execution",
  "private-execution": "Ready for private execution",
  release: "Proceed to release",
});
const FORBIDDEN_DERIVED_KEYS = Object.freeze([
  "artifactReadiness",
  "executionDecision",
  "executionAllowed",
  "executionScope",
  "gateResults",
  "blockers",
  "nextAction",
  "dependenciesEntryEvidenceSatisfied",
  "privateAuthorityState",
  "privateAuthorityEvidenceReference",
  "ownerActionsSatisfied",
  "effectiveArtifactStates",
  "candidatePublication",
  "approvalPublication",
  "publication",
  "gitFacts",
  "approvalRevision",
  "approvalRecordRevision",
  "approvalRegistrySha256",
  "registrySha256",
  "currentRegistrySha256",
  "publishedTaskApprovalSha256",
  "currentTaskApprovalSha256",
  "taskApprovalBytesVerified",
  "reviewerRegistrySha256",
  "publishedReviewerRegistrySha256",
  "currentReviewerRegistrySha256",
  "reviewerRegistryBytesVerified",
  "ownerActionStateSha256",
  "publishedOwnerActionStateSha256",
  "currentOwnerActionStateSha256",
  "ownerActionStateBytesVerified",
  "publishedTaskContractSha256",
  "currentTaskContractSha256",
  "taskContractBytesVerified",
  "publishedTaskFilesSha256",
  "currentTaskFilesSha256",
  "publishedTaskFilesBytesVerified",
  "currentTaskFilesBytesVerified",
  "taskFilesCoverageVerified",
  "currentTaskFilesRevision",
  "taskFilesVerifiedAtRevision",
  "baseAncestorOfCandidate",
  "candidateDiffTaskFilesSha256",
  "candidateDiffExactMatchVerified",
  "candidateDiffNoDeletionsVerified",
  "candidateDiffExclusions",
  "publishedTaskFilesModesVerified",
  "currentTaskFilesModesVerified",
  "publishedTaskFileContentClassesVerified",
  "currentTaskFileContentClassesVerified",
  "candidateTaskContractSha256",
  "candidateTaskContractBytesVerified",
  "publishedTaskFileArchivesVerified",
  "currentTaskFileArchivesVerified",
  "currentDescendantDeltaPaths",
  "currentDescendantDeltaPathsVerified",
  "currentDescendantDeltaNoDeletionsVerified",
  "runtimeRequestedScopeClass",
  "runtimeRequestedActionClass",
  "candidateOnFetchedMain",
  "candidateBytesVerified",
  "registryBytesVerified",
  "publishedOnFetchedMain",
  "candidateAncestorOfApproval",
  "activation",
]);
const SENSITIVE_KEY = /^(?:credential|credentials|secret|privateKey|privateUrl|host|hostname|account|accountId|topology|projectNodeId|recoveryValue|recoveryKey|rawResponse|authenticJournal|authenticContent|photo|photoDerived|imageBytes|thumbnail|screenshot|token|accessToken|refreshToken|authToken|apiKey|accessKey|secretKey|clientSecret|password|passphrase|signingKey|encryptionKey|key|authorization)$/i;
const sensitiveSentinelSuffix = ["SENT", "INEL"].join("");
const SENSITIVE_VALUE = new RegExp(`(?:${[
  `-----BEGIN [A-Z ]*${["PRIVATE", "KEY"].join(" ")}-----`,
  `\\b${["AK", "IA"].join("")}[0-9A-Z]{12,}\\b`,
  `\\b${["github", "pat", ""].join("_")}[A-Za-z0-9_]{12,}\\b`,
  `\\b${["gh", "[pousr]", "_"].join("")}[A-Za-z0-9]{12,}\\b`,
  `\\b${["Bear", "er"].join("")}\\s+[A-Za-z0-9._~+/=-]{8,}\\b`,
  `\\b${["xo", "x"].join("")}[A-Za-z0-9]*-[A-Za-z0-9-]{8,}\\b`,
  `\\b${["s", "k", "[-_]"].join("")}[A-Za-z0-9_-]{12,}\\b`,
  "(?:https?|ssh|postgres|mysql):\\/\\/",
  `${["AUTHENTIC", ""].join("_")}(?:JOURNAL|PHOTO|MEDIA|CONTENT)_${sensitiveSentinelSuffix}`,
  `${["PRIVATE", ""].join("_")}(?:HOST|URL|ACCOUNT|TOPOLOGY)_${sensitiveSentinelSuffix}`,
  ["PROJECT", "NODE", "ID", sensitiveSentinelSuffix].join("_"),
  ["RECOVERY", "VALUE", sensitiveSentinelSuffix].join("_"),
  ["RAW", "RESPONSE", sensitiveSentinelSuffix].join("_"),
].join("|")})`, "i");

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const asObject = (value) => isObject(value) ? value : {};
const asArray = (value) => Array.isArray(value) ? value : [];
const isNonemptyString = (value) => typeof value === "string" && value.trim().length > 0;
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(asObject(value), key);
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const unique = (values) => new Set(values).size === values.length;
const sameStringSet = (left, right) => {
  if (!Array.isArray(left) || !Array.isArray(right)) return false;
  return unique(left) && unique(right)
    && left.length === right.length
    && [...left].sort().every((value, index) => value === [...right].sort()[index]);
};
const hasExactKeys = (value, keys) => isObject(value) && sameStringSet(Object.keys(value), keys);
const isOpaqueReference = (value) => isNonemptyString(value)
  && OPAQUE_REFERENCE.test(value)
  && !value.includes("://")
  && !value.split(":", 2)[1]?.startsWith("/")
  && !value.includes("..")
  && !/(?:pending|unknown|tbd|placeholder)/i.test(value);
const parseInstant = (value) => {
  if (!isNonemptyString(value)) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

/**
 * Derive the only permitted local-synthetic content class from canonical path
 * and purpose metadata. Adapters must perform every returned byte check against
 * the exact candidate/current blob; content class is never source-declared.
 */
export function classifyLocalSyntheticTaskFile(entry) {
  const source = asObject(entry);
  const safeRelativePath = isNonemptyString(source.path)
    && !path.posix.isAbsolute(source.path)
    && !source.path.split("/").includes("..")
    && path.posix.normalize(source.path) === source.path;
  const basename = safeRelativePath ? path.posix.basename(source.path).toLowerCase() : "";
  const extension = safeRelativePath ? path.posix.extname(basename) : null;
  const extensionTokens = basename.match(/\.[a-z0-9]+/g) ?? [];
  const embeddedExtensions = extensionTokens.slice(0, -1).filter((candidate) => (
    LOCAL_SYNTHETIC_CONTENT_POLICY.forbiddenEmbeddedExtensions.includes(candidate)
  ));

  let contentClass = null;
  let reasonCode = null;
  if (!safeRelativePath) {
    reasonCode = "LOCAL_CONTENT_UNSAFE_PATH";
  } else if (!TASK_FILE_PURPOSES.includes(source.purpose)) {
    reasonCode = "LOCAL_CONTENT_PURPOSE";
  } else if (embeddedExtensions.length > 0) {
    reasonCode = "LOCAL_CONTENT_EMBEDDED_EXTENSION";
  } else if (LOCAL_SYNTHETIC_CONTENT_POLICY.textExtensions.includes(extension)) {
    contentClass = "text";
  } else if (LOCAL_SYNTHETIC_CONTENT_POLICY.workbookExtensions.includes(extension)) {
    if (LOCAL_SYNTHETIC_CONTENT_POLICY.workbookPurposes.includes(source.purpose)) {
      contentClass = "xlsx-workbook";
    } else {
      reasonCode = "LOCAL_CONTENT_WORKBOOK_PURPOSE";
    }
  } else {
    reasonCode = "LOCAL_CONTENT_EXTENSION";
  }

  return {
    allowed: contentClass !== null,
    contentClass,
    extension,
    requiredByteChecks: contentClass === null
      ? []
      : [...LOCAL_SYNTHETIC_CONTENT_POLICY.byteChecksByContentClass[contentClass]],
    reasonCode,
  };
}

const ARTIFACT_CONTROL_MARKER_DEFINITIONS = Object.freeze([
  Object.freeze({
    key: "taskId",
    canonical: /^- \*\*Task ID:\*\* `([A-Z0-9]+(?:-[A-Z0-9]+)+)`$/,
  }),
  Object.freeze({
    key: "artifactKind",
    canonical: new RegExp(`^- \\*\\*Artifact kind:\\*\\* \`(${ARTIFACT_KINDS.join("|")})\`$`),
  }),
  Object.freeze({
    key: "artifactState",
    canonical: new RegExp(`^- \\*\\*Artifact state:\\*\\* \`(${[...ARTIFACT_CONTENT_STATES].join("|")})\`$`),
  }),
]);

function markerLikeKey(line) {
  const normalized = line
    .replace(/^\s*(?:(?:[-+*>#]|\d+[.)])\s*)*/, "")
    .replace(/^(?:<!--\s*)?[*_`\[\](){}]*\s*/, "");
  if (/^task[\s_-]*id(?=\s|:|=|\*|`|\]|$)/i.test(normalized)) return "taskId";
  if (/^artifact[\s_-]*kind(?=\s|:|=|\*|`|\]|$)/i.test(normalized)) return "artifactKind";
  if (/^artifact[\s_-]*state(?=\s|:|=|\*|`|\]|$)/i.test(normalized)) return "artifactState";
  return null;
}

/**
 * Parse the three canonical Markdown control markers from exact artifact bytes.
 * The optional expectation object lets callers bind the parsed values to their
 * task/artifact record without reimplementing syntax or duplicate handling.
 */
export function parseArtifactControlMarkers(markdown, expected = {}) {
  const emptyResult = {
    valid: false,
    taskId: null,
    artifactKind: null,
    artifactState: null,
    errors: [{ code: "MARKER_INPUT", marker: null, lines: [] }],
  };
  if (typeof markdown !== "string" || !isObject(expected)) return emptyResult;

  const occurrences = Object.fromEntries(
    ARTIFACT_CONTROL_MARKER_DEFINITIONS.map(({ key }) => [key, []]),
  );
  const errors = [];
  const lines = markdown.split(/\r\n|\n|\r/);
  lines.forEach((line, index) => {
    let canonicalKey = null;
    for (const definition of ARTIFACT_CONTROL_MARKER_DEFINITIONS) {
      const match = line.match(definition.canonical);
      if (!match) continue;
      canonicalKey = definition.key;
      occurrences[definition.key].push({ line: index + 1, value: match[1] });
      break;
    }
    if (canonicalKey === null) {
      const marker = markerLikeKey(line);
      if (marker !== null) {
        errors.push({ code: "MARKER_NONCANONICAL", marker, lines: [index + 1] });
      }
    }
  });

  const values = {};
  for (const { key } of ARTIFACT_CONTROL_MARKER_DEFINITIONS) {
    const found = occurrences[key];
    values[key] = found.length === 1 ? found[0].value : null;
    if (found.length === 0) {
      errors.push({ code: "MARKER_MISSING", marker: key, lines: [] });
      continue;
    }
    if (found.length > 1) {
      errors.push({ code: "MARKER_DUPLICATE", marker: key, lines: found.map(({ line }) => line) });
      if (new Set(found.map(({ value }) => value)).size > 1) {
        errors.push({ code: "MARKER_CONFLICT", marker: key, lines: found.map(({ line }) => line) });
      }
      continue;
    }
    if (hasOwn(expected, key) && expected[key] !== found[0].value) {
      errors.push({ code: "MARKER_MISMATCH", marker: key, lines: [found[0].line] });
    }
  }

  return {
    valid: errors.length === 0,
    taskId: values.taskId,
    artifactKind: values.artifactKind,
    artifactState: values.artifactState,
    errors,
  };
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isObject(value)) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .filter((key) => value[key] !== undefined)
      .map((key) => [key, canonicalize(value[key])]),
  );
}

/** Return stable JSON for fingerprints and comparison. Arrays retain their order. */
export function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

function compareCanonical(left, right) {
  const leftJson = canonicalJson(left);
  const rightJson = canonicalJson(right);
  return leftJson < rightJson ? -1 : leftJson > rightJson ? 1 : 0;
}

/** Canonical, order-insensitive task-scoped file bindings. */
export function taskFilesPayload(taskFiles) {
  return asArray(taskFiles)
    .map((entry) => ({
      path: entry?.path ?? null,
      sha256: entry?.sha256 ?? null,
      purpose: entry?.purpose ?? null,
      gitMode: entry?.gitMode ?? null,
      gitType: entry?.gitType ?? null,
    }))
    .sort(compareCanonical);
}

export function computeTaskFilesSha256(taskFiles) {
  return sha256(canonicalJson(taskFilesPayload(taskFiles)));
}

/**
 * Shared schema/coverage validator for a task-scoped full-diff manifest.
 * Git-history completeness is separately proven by trusted publication facts;
 * this function owns the one canonical record shape used by every adapter.
 */
export function validateTaskFilesManifest({ taskId, taskFiles, artifacts, scopeClass = null }) {
  const records = asArray(taskFiles);
  const taskFilePaths = records.map((entry) => entry?.path);
  const schemaValid = Array.isArray(taskFiles)
    && records.length >= ARTIFACT_KINDS.length + 2
    && unique(taskFilePaths)
    && records.every((entry) => {
      const safeRelativePath = isNonemptyString(entry?.path)
        && !path.posix.isAbsolute(entry.path)
        && !entry.path.split("/").includes("..")
        && path.posix.normalize(entry.path) === entry.path;
      const basename = safeRelativePath ? path.posix.basename(entry.path) : "";
      return isObject(entry)
        && sameStringSet(Object.keys(entry), ["path", "sha256", "purpose", "gitMode", "gitType"])
        && safeRelativePath
        && !TASK_FILE_DIFF_EXCLUSIONS.includes(entry.path)
        && (entry.purpose === "implementation"
          || (entry.purpose === "evidence" && basename.startsWith("P0-"))
          || (entry.purpose?.startsWith("artifact:")
            && basename.startsWith("P0-") && basename.includes(taskId)))
        && SHA256.test(entry.sha256 ?? "")
        && TASK_FILE_PURPOSES.includes(entry.purpose)
        && TASK_FILE_GIT_MODES.includes(entry.gitMode)
        && entry.gitType === "blob";
    });
  const artifactCoverageValid = ARTIFACT_KINDS.every((kind) => {
    const matches = records.filter((entry) => entry?.purpose === `artifact:${kind}`);
    return matches.length === 1
      && matches[0].path === artifacts?.[kind]?.path
      && matches[0].sha256 === artifacts?.[kind]?.sha256;
  });
  const workCoverageValid = records.some((entry) => entry?.purpose === "implementation")
    && records.some((entry) => entry?.purpose === "evidence");
  const localSyntheticClassifications = records.map((entry) => ({
    path: entry?.path ?? null,
    purpose: entry?.purpose ?? null,
    ...classifyLocalSyntheticTaskFile(entry),
  }));
  const xlsxPaths = localSyntheticClassifications
    .filter(({ contentClass }) => contentClass === "xlsx-workbook")
    .map(({ path: entryPath }) => entryPath)
    .sort();
  const localSyntheticContentClassesValid = scopeClass !== "local-synthetic"
    || localSyntheticClassifications.every(({ allowed }) => allowed);
  return {
    valid: schemaValid && artifactCoverageValid && workCoverageValid && localSyntheticContentClassesValid,
    schemaValid,
    artifactCoverageValid,
    workCoverageValid,
    localSyntheticTypesValid: localSyntheticContentClassesValid,
    localSyntheticContentClassesValid,
    localSyntheticClassifications,
    xlsxPaths,
    payload: taskFilesPayload(records),
    sha256: computeTaskFilesSha256(records),
  };
}

/**
 * Build the frozen dossier payload. The explicit key and artifact order preserves
 * compatibility with the existing P0 JSON.stringify digest contract.
 */
export function dossierPayload({ taskId, revision, baseRevision, artifacts, taskFilesSha256 }) {
  const payload = {
    taskId,
    revision,
    artifacts: Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
      path: artifacts?.[kind]?.path ?? null,
      sha256: artifacts?.[kind]?.sha256 ?? null,
    }])),
  };
  // Keep the accepted pre-manifest planning digest readable while requiring
  // this field on every permitting candidate through evaluator gates below.
  if (taskFilesSha256 !== undefined && taskFilesSha256 !== null) {
    payload.baseRevision = baseRevision ?? null;
    payload.taskFilesSha256 = taskFilesSha256;
  }
  return payload;
}

export function computeDossierDigest(candidate) {
  return `sha256:${sha256(JSON.stringify(dossierPayload(candidate)))}`;
}

export function computeIdentitySetDigest(values) {
  const normalized = asArray(values).map((value) => typeof value === "string" ? value : null).sort();
  return `sha256:${sha256(JSON.stringify(normalized))}`;
}

export function computeStringSetDigest(values) {
  const normalized = asArray(values).map((value) => typeof value === "string" ? value : null).sort();
  return `sha256:${sha256(JSON.stringify(normalized))}`;
}

/** Canonical digest of one taskApprovals[taskId] value, independent of sibling appends. */
export function computeTaskApprovalSha256(taskApproval) {
  return sha256(canonicalJson(taskApproval));
}

export function taskContractPayload(input) {
  const source = asObject(input);
  return {
    taskId: source.taskId ?? source.id ?? null,
    outcome: source.outcome ?? null,
    requirementIds: [...asArray(source.requirementIds)].sort(),
    dependencyIds: [...asArray(source.dependencyIds ?? source.dependencies)].sort(),
    acceptanceEvidence: source.acceptanceEvidence ?? null,
    acceptanceScenarioIds: [...asArray(source.acceptanceScenarioIds)].sort(),
  };
}

export function computeTaskContractSha256(input) {
  return sha256(canonicalJson(taskContractPayload(input)));
}

export function computeReviewerRegistrySha256(reviewerRegistry) {
  return sha256(canonicalJson(asObject(reviewerRegistry)));
}

export function computeDependencyEvidenceSha256(dependencyEvidence) {
  const records = asArray(dependencyEvidence)
    .map((record) => canonicalize(record))
    .sort(compareCanonical);
  return sha256(canonicalJson(records));
}

export function computePrivateAuthoritySha256(privateAuthority) {
  return sha256(canonicalJson(privateAuthority ?? null));
}

export function computeArtifactReviewsSha256(artifactReviews) {
  return sha256(canonicalJson(asObject(artifactReviews)));
}

export function taskOwnerActionStatePayload({ taskId, requirements, records }) {
  const normalizedRequirements = asArray(requirements)
    .map((requirement) => ({
      actionId: requirement?.actionId ?? null,
      requiredForScopeClasses: [...asArray(requirement?.requiredForScopeClasses)].sort(),
      requiredForActionClasses: [...asArray(requirement?.requiredForActionClasses)].sort(),
      accountableHumanId: requirement?.accountableHumanId ?? null,
      accountableHumanRole: requirement?.accountableHumanRole ?? null,
    }))
    .sort(compareCanonical);
  const actionIds = new Set(normalizedRequirements.map((requirement) => requirement.actionId));
  const recordValues = Array.isArray(records)
    ? records
    : Object.values(asObject(records?.actions ?? records));
  const normalizedRecords = recordValues
    .filter((record) => actionIds.has(record?.actionId))
    .map((record) => ({
      actionId: record?.actionId ?? null,
      status: record?.status ?? null,
      result: record?.result ?? null,
      verifierId: record?.verifierId ?? null,
      verifierRole: record?.verifierRole ?? null,
      verifiedAt: record?.verifiedAt ?? null,
      evidenceReference: record?.evidenceReference ?? null,
      candidateRevision: record?.candidateRevision ?? null,
      dossierDigest: record?.dossierDigest ?? null,
      accountableHumanId: record?.accountableHumanId ?? null,
      accountableHumanRole: record?.accountableHumanRole ?? null,
      ownerAttestationReference: record?.ownerAttestationReference ?? null,
    }))
    .sort(compareCanonical);
  return {
    taskId,
    requirements: normalizedRequirements,
    records: normalizedRecords,
  };
}

export function computeTaskOwnerActionStateSha256(input) {
  return sha256(canonicalJson(taskOwnerActionStatePayload(input)));
}

export function designCoveragePayload(coverage) {
  const source = asObject(coverage);
  return {
    applicability: source.applicability ?? null,
    journeyIds: [...asArray(source.journeyIds)].sort(),
    stateCoverage: Object.fromEntries(DESIGN_STATE_DIMENSIONS.map((dimension) => [
      dimension,
      [...asArray(source.stateCoverage?.[dimension])].sort(),
    ])),
    accessibilityCoverage: Object.fromEntries(DESIGN_ACCESSIBILITY_DIMENSIONS.map((dimension) => [
      dimension,
      [...asArray(source.accessibilityCoverage?.[dimension])].sort(),
    ])),
    notApplicableRationale: source.notApplicableRationale ?? null,
  };
}

export function computeDesignCoverageDigest(coverage) {
  return `sha256:${sha256(JSON.stringify(designCoveragePayload(coverage)))}`;
}

export function attestationPayload({
  taskId,
  subjectType,
  subject,
  decision,
  reviewerId,
  reviewerRole,
  reviewedRevision,
  dossierDigest,
  artifactSha256 = null,
  evidenceReference,
  requestedScopeClass = null,
  requestedActionClass = null,
  requestedCouncilVerdict = null,
  rationale = null,
  designCoverageDigest = null,
  implementerIdsDigest = null,
  evidenceProducerIdsDigest = null,
  openDecisionsDigest = null,
  unresolvedBlockersDigest = null,
  specialistVetoesDigest = null,
  taskContractSha256 = null,
  baseRevision = null,
  taskFilesSha256 = null,
  dependencyEvidenceSha256 = null,
  privateAuthoritySha256 = null,
  artifactReviewsSha256 = null,
  reviewerRegistrySha256 = null,
  ownerActionStateSha256 = null,
  notApplicableRationale = null,
  specialistConcurrence = null,
}) {
  return {
    taskId,
    subjectType,
    subject,
    decision,
    reviewerId,
    reviewerRole,
    reviewedRevision,
    dossierDigest,
    artifactSha256,
    evidenceReference,
    requestedScopeClass,
    requestedActionClass,
    requestedCouncilVerdict,
    rationale,
    designCoverageDigest,
    implementerIdsDigest,
    evidenceProducerIdsDigest,
    openDecisionsDigest,
    unresolvedBlockersDigest,
    specialistVetoesDigest,
    taskContractSha256,
    baseRevision,
    taskFilesSha256,
    dependencyEvidenceSha256,
    privateAuthoritySha256,
    artifactReviewsSha256,
    reviewerRegistrySha256,
    ownerActionStateSha256,
    notApplicableRationale,
    specialistConcurrence,
  };
}

export function computeAttestationDigest(attestation) {
  return `sha256:${sha256(JSON.stringify(attestationPayload(attestation)))}`;
}

export function preparationDossierPayload(input) {
  const source = asObject(input);
  const candidate = asObject(source.candidate);
  return {
    schemaVersion: source.schemaVersion ?? null,
    preparationReviewId: source.preparationReviewId ?? null,
    taskId: source.taskId ?? null,
    milestone: source.milestone ?? null,
    stageId: source.stageId ?? null,
    requestedScope: {
      scopeClass: source.requestedScope?.scopeClass ?? null,
      actionClass: source.requestedScope?.actionClass ?? null,
    },
    candidate: {
      revision: candidate.revision ?? null,
      baseRevision: candidate.baseRevision ?? null,
      artifacts: Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
        path: candidate.artifacts?.[kind]?.path ?? null,
        sha256: candidate.artifacts?.[kind]?.sha256 ?? null,
      }])),
    },
    dependencyIds: [...asArray(source.dependencyIds)].sort(),
    acceptanceScenarioIds: [...asArray(source.acceptanceScenarioIds)].sort(),
  };
}

export function computePreparationDossierDigest(input) {
  return `sha256:${sha256(canonicalJson(preparationDossierPayload(input)))}`;
}

export function stageCouncilAttestationPayload(input) {
  const source = asObject(input);
  return {
    gateKind: source.gateKind ?? null,
    preparationReviewId: source.preparationReviewId ?? null,
    taskId: source.taskId ?? null,
    stageId: source.stageId ?? null,
    subject: source.subject ?? null,
    decision: source.decision ?? null,
    reviewerId: source.reviewerId ?? null,
    reviewerRole: source.reviewerRole ?? null,
    reviewedRevision: source.reviewedRevision ?? null,
    dossierDigest: source.dossierDigest ?? null,
    artifactSha256: source.artifactSha256 ?? null,
    scopeClass: source.scopeClass ?? null,
    actionClass: source.actionClass ?? null,
    evidenceReference: source.evidenceReference ?? null,
  };
}

export function computeStageCouncilAttestationDigest(input) {
  return `sha256:${sha256(canonicalJson(stageCouncilAttestationPayload(input)))}`;
}

export function computePreparationReviewRecordSha256(record) {
  return sha256(canonicalJson(asObject(record)));
}

export function stageApprovalContextPayload(record) {
  const source = asObject(record);
  return Object.fromEntries(Object.entries(source).filter(([key]) => key !== "stageCouncil"));
}

export function computeStageApprovalContextSha256(record) {
  return sha256(canonicalJson(stageApprovalContextPayload(record)));
}

export function stageApprovalSeatAttestationPayload(input) {
  const source = asObject(input);
  return {
    reviewerId: source.reviewerId ?? null,
    reviewerRole: source.reviewerRole ?? null,
    verdict: source.verdict ?? null,
    reviewedRevision: source.reviewedRevision ?? null,
    dossierDigest: source.dossierDigest ?? null,
    preparationReviewId: source.preparationReviewId ?? null,
    preparationReviewSha256: source.preparationReviewSha256 ?? null,
    stageId: source.stageId ?? null,
    gateKind: source.gateKind ?? null,
    scopeClass: source.scopeClass ?? null,
    actionClass: source.actionClass ?? null,
    stageContextSha256: source.stageContextSha256 ?? null,
    evidenceReference: source.evidenceReference ?? null,
  };
}

export function computeStageApprovalSeatAttestationDigest(input) {
  return `sha256:${sha256(canonicalJson(stageApprovalSeatAttestationPayload(input)))}`;
}

function gateEvaluation(taskId, gates, allowedKey, allowed, decision, nextAction, normalizedEvidence) {
  const failedGates = gates.filter((gate) => !gate.passed);
  const result = {
    [allowedKey]: allowed === true && failedGates.length === 0,
    executionAllowed: allowedKey === "executionAllowed" && allowed === true && failedGates.length === 0,
    decision: failedGates.length === 0 ? decision : "Hold",
    nextAction: failedGates.length === 0 ? nextAction : failedGates[0].correctiveAction,
    blockers: failedGates.map(({ code, reason, correctiveAction }) => ({
      code,
      reason: `${taskId}: ${reason}; action: ${correctiveAction}.`,
    })),
    gateResults: gates.map(({ code, passed, reason, correctiveAction }) => ({
      code,
      passed,
      reason: passed
        ? `${taskId}: ${code} passed.`
        : `${taskId}: ${reason}; action: ${correctiveAction}.`,
    })),
    normalizedEvidence,
  };
  if (allowedKey === "preparationAllowed") result.executionAllowed = false;
  return result;
}

/**
 * Gate A authorizes only preparation of a later immutable implementation and
 * test candidate. It deliberately has no path to task execution permission.
 * Publication facts and the canonical manifest task are trusted adapter inputs.
 */
export function evaluateTaskPreparationGateA(input, context = {}) {
  const source = asObject(input);
  const taskId = isNonemptyString(source.taskId) ? source.taskId : "UNKNOWN-TASK";
  const isDeliveryTransitionStage = typeof source.stageId === "string"
    && source.stageId.endsWith(DELIVERY_TRANSITION_GATE_B_CONTRACT.stageIdSuffix);
  const candidate = asObject(source.candidate);
  const publication = asObject(context.candidatePublication);
  const expectedTask = asObject(context.expectedTask);
  const requestedScope = asObject(source.requestedScope);
  const artifacts = asObject(candidate.artifacts);
  const reviews = asObject(source.artifactReviews);
  const council = asObject(source.council);
  const seats = asObject(council.seatVerdicts);
  const { records: registryRecords, byId: registryById, duplicateIds } = normalizeRegistry(source.reviewerRegistry);
  const proposalAuthorIds = asArray(source.proposalAuthorIds);
  const computedDossierDigest = computePreparationDossierDigest(source);
  const gates = [];
  const addGate = (code, passed, reason, correctiveAction) => gates.push({
    code,
    passed: passed === true,
    reason,
    correctiveAction,
  });

  addGate("PREP_SCHEMA", source.schemaVersion === TASK_PREPARATION_SCHEMA_VERSION
    && hasExactKeys(source, [
      "schemaVersion", "preparationReviewId", "taskId", "milestone", "stageId", "requestedScope",
      "candidate", "dependencyIds", "dependencyEvidence", "acceptanceScenarioIds", "proposalAuthorIds",
      "artifactReviews", "council", "reviewerRegistry", "openDecisions", "specialistVetoes", "safety",
    ]), "the Gate A proposal has an unknown or incomplete schema", "rebuild the exact preparation proposal schema");
  addGate("PREP_SCOPE_TASK", P0_R0_SUBSTANTIVE_TASK_IDS.includes(taskId),
    "Gate A names a historical, unknown, or out-of-scope task", "select one of the five substantive R0 tasks");
  addGate("PREP_STAGE_ID", STAGE_ID.test(source.stageId ?? "") && source.stageId.includes(taskId),
    "the immutable task-bound stage ID is missing or malformed", "use a P0-STAGE-* ID containing the exact task ID");
  addGate("PREP_REVIEW_ID", PREPARATION_REVIEW_ID.test(source.preparationReviewId ?? ""),
    "the preparation review ID is missing or malformed", "use a stable P0-PREP-* review ID");
  addGate("PREP_TASK_CONTRACT", expectedTask.taskId === taskId
    && expectedTask.milestone === source.milestone
    && sameStringSet(expectedTask.dependencyIds, source.dependencyIds)
    && sameStringSet(expectedTask.acceptanceScenarioIds, source.acceptanceScenarioIds),
  "the proposal differs from the trusted manifest task contract", "rebuild task, milestone, dependency, and scenario bindings from the manifest");
  addGate("PREP_SCOPE_ACTION", hasExactKeys(requestedScope, ["scopeClass", "actionClass"])
    && (isDeliveryTransitionStage
      ? isDedicatedDeliveryTransitionScopeAction({
          taskId,
          stageId: source.stageId,
          scopeClass: requestedScope.scopeClass,
          actionClass: requestedScope.actionClass,
        })
      : isTaskMilestoneScopeActionCompatible({
          taskId,
          milestone: source.milestone,
          scopeClass: requestedScope.scopeClass,
          actionClass: requestedScope.actionClass,
        })), "the intended later stage scope/action is neither task-owned nor the closed delivery-transition pair", "select one exact task pair or the dedicated private delivery-transition contract");
  addGate("PREP_LOCAL_ONLY", source.safety?.authenticMediaAccessed === false
    && source.safety?.privateNetworkAccessed === false
    && source.safety?.externalMutationPerformed === false,
  "Gate A evidence includes or permits a private, authentic, or external action", "use only local, public, fictional, and synthetic preparation evidence");
  addGate("PREP_PUBLIC_SAFETY", sensitiveInputPaths(source).length === 0,
    "the preparation proposal contains a sensitive or authentic-content sentinel", "replace sensitive values with approved opaque public-safe references");
  addGate("PREP_CANDIDATE", hasExactKeys(candidate, ["revision", "baseRevision", "dossierDigest", "artifacts"])
    && FULL_REVISION.test(candidate.revision ?? "")
    && FULL_REVISION.test(candidate.baseRevision ?? "")
    && candidate.revision !== candidate.baseRevision
    && candidate.dossierDigest === computedDossierDigest,
  "the proposal candidate revision, base, or dossier digest is invalid", "bind the exact proposal commit and recompute its preparation dossier digest");
  addGate("PREP_PUBLICATION", publication.revision === candidate.revision
    && publication.baseRevision === candidate.baseRevision
    && publication.bytesVerified === true
    && publication.fullDiffVerified === true
    && publication.candidateOnFetchedMain === true,
  "trusted Git facts do not prove the exact merged proposal candidate", "verify the full proposal diff and candidate bytes on fetched origin/main");
  addGate("PREP_ARTIFACT_SET", sameStringSet(Object.keys(artifacts), [...ARTIFACT_KINDS])
    && ARTIFACT_KINDS.every((kind) => {
      const artifact = asObject(artifacts[kind]);
      const basename = isNonemptyString(artifact.path) ? path.posix.basename(artifact.path) : "";
      return hasExactKeys(artifact, ["path", "sha256", "contentState"])
        && basename.startsWith("P0-")
        && basename.includes(taskId)
        && SHA256.test(artifact.sha256 ?? "")
        && ["in-review", "approved", "not-applicable"].includes(artifact.contentState);
    }), "the six proposal artifact bindings are missing, unsafe, or malformed", "bind exactly six P0-prefixed task artifacts with exact hashes");
  addGate("PREP_REVIEWER_REGISTRY", registryRecords.length > 0 && duplicateIds.size === 0,
    "the reviewer registry is empty or contains duplicate IDs", "use the canonical active reviewer registry");

  const artifactReviewerIds = [];
  for (const kind of ARTIFACT_KINDS) {
    const artifact = asObject(artifacts[kind]);
    const review = asObject(reviews[kind]);
    const reviewer = registryById.get(review.reviewerId);
    const role = registryRole(reviewer);
    const expectedDecision = OPTIONAL_NA_ARTIFACTS.has(kind) && artifact.contentState === "not-applicable"
      ? "not-applicable"
      : "approved";
    if (isNonemptyString(review.reviewerId)) artifactReviewerIds.push(review.reviewerId);
    const expectedDigest = computeStageCouncilAttestationDigest({
      gateKind: "gate-a-prepare",
      preparationReviewId: source.preparationReviewId,
      taskId,
      stageId: source.stageId,
      subject: `artifact:${kind}`,
      decision: expectedDecision,
      reviewerId: review.reviewerId,
      reviewerRole: review.reviewerRole,
      reviewedRevision: review.reviewedRevision,
      dossierDigest: review.dossierDigest,
      artifactSha256: review.artifactSha256,
      scopeClass: requestedScope.scopeClass,
      actionClass: requestedScope.actionClass,
      evidenceReference: review.evidenceReference,
    });
    addGate(`PREP_ARTIFACT_${kind.toUpperCase()}_REVIEW`, hasExactKeys(review, [
      "reviewerId", "reviewerRole", "decision", "reviewedRevision", "dossierDigest",
      "artifactSha256", "evidenceReference", "attestationDigest",
    ]) && reviewer?.active === true
      && role === ARTIFACT_ROLE[kind]
      && review.reviewerRole === role
      && review.decision === expectedDecision
      && review.reviewedRevision === candidate.revision
      && review.dossierDigest === candidate.dossierDigest
      && review.artifactSha256 === artifact.sha256
      && isOpaqueReference(review.evidenceReference)
      && review.attestationDigest === expectedDigest,
    `${kind} proposal review is absent, role-invalid, stale, or tampered`, `obtain an exact-candidate ${kind} proposal review`);
  }
  const dependencyIds = asArray(source.dependencyIds);
  const dependencyEvidence = asArray(source.dependencyEvidence);
  addGate("PREP_DEPENDENCIES", unique(dependencyIds)
    && dependencyEvidence.length === dependencyIds.length
    && dependencyIds.every((dependencyId) => dependencyEvidence.filter((record) => (
      record?.dependencyId === dependencyId
        && record?.result === "pass"
        && isOpaqueReference(record?.evidenceReference)
    )).length === 1), "dependency-entry evidence is incomplete or non-canonical", "record one passing opaque reference per canonical dependency");
  addGate("PREP_OPEN_DECISIONS", Array.isArray(source.openDecisions) && source.openDecisions.length === 0,
    "the proposal retains an open decision", "resolve every open proposal decision");
  addGate("PREP_SPECIALIST_VETO", Array.isArray(source.specialistVetoes) && source.specialistVetoes.length === 0,
    "the proposal retains a specialist veto", "resolve every specialist veto");
  addGate("PREP_COUNCIL", council.verdict === "ready-to-prepare"
    && council.reviewedRevision === candidate.revision
    && council.dossierDigest === candidate.dossierDigest
    && Array.isArray(council.unresolvedBlockers)
    && council.unresolvedBlockers.length === 0
    && sameStringSet(Object.keys(seats), [...COUNCIL_SEATS]),
  "the five-seat Council proposal decision is absent, stale, or blocked", "record a blocker-free exact-candidate ready-to-prepare decision");

  const seatIds = [];
  for (const seat of COUNCIL_SEATS) {
    const record = asObject(seats[seat]);
    const reviewer = registryById.get(record.reviewerId);
    const role = registryRole(reviewer);
    if (isNonemptyString(record.reviewerId)) seatIds.push(record.reviewerId);
    const expectedDigest = computeStageCouncilAttestationDigest({
      gateKind: "gate-a-prepare",
      preparationReviewId: source.preparationReviewId,
      taskId,
      stageId: source.stageId,
      subject: `council:${seat}`,
      decision: "approve-preparation-candidate",
      reviewerId: record.reviewerId,
      reviewerRole: record.reviewerRole,
      reviewedRevision: record.reviewedRevision,
      dossierDigest: record.dossierDigest,
      scopeClass: requestedScope.scopeClass,
      actionClass: requestedScope.actionClass,
      evidenceReference: record.evidenceReference,
    });
    addGate(`PREP_SEAT_${seat.toUpperCase()}`, hasExactKeys(record, [
      "reviewerId", "reviewerRole", "verdict", "reviewedRevision", "dossierDigest",
      "preparationReviewId", "stageId", "evidenceReference", "attestationDigest",
    ]) && reviewer?.active === true
      && role === SEAT_ROLE[seat]
      && record.reviewerRole === role
      && record.verdict === "approve-preparation-candidate"
      && record.reviewedRevision === candidate.revision
      && record.dossierDigest === candidate.dossierDigest
      && record.preparationReviewId === source.preparationReviewId
      && record.stageId === source.stageId
      && isOpaqueReference(record.evidenceReference)
      && record.attestationDigest === expectedDigest,
    `${seat} preparation seat is absent, role-invalid, stale, or tampered`, `obtain the exact ${seat} preparation attestation`);
  }
  addGate("PREP_SEAT_INDEPENDENCE", seatIds.length === COUNCIL_SEATS.length
    && unique(seatIds)
    && !seatIds.some((reviewerId) => proposalAuthorIds.includes(reviewerId)),
  "Council seats are duplicated or overlap proposal authors", "use five distinct reviewers independent of proposal authors");

  return gateEvaluation(
    taskId,
    gates,
    "preparationAllowed",
    true,
    "Ready to prepare — Gate A",
    "Prepare only the named local/public/fictional/synthetic implementation-and-test candidate; private and external actions remain prohibited.",
    {
      schemaVersion: source.schemaVersion ?? null,
      preparationReviewId: source.preparationReviewId ?? null,
      taskId,
      stageId: source.stageId ?? null,
      requestedScope: {
        scopeClass: requestedScope.scopeClass ?? null,
        actionClass: requestedScope.actionClass ?? null,
      },
      candidateRevision: candidate.revision ?? null,
      dossierDigest: candidate.dossierDigest ?? null,
      preparationBounds: ["local", "public", "fictional", "synthetic"],
      privateActionsAllowed: false,
      externalMutationsAllowed: false,
      sourceFingerprint: `sha256:${sha256(canonicalJson(source))}`,
    },
  );
}

/**
 * Gate B adds an immutable stage envelope around the existing exact-candidate
 * execution evaluator. It consumes all non-legacy task gates without changing
 * the direct task evaluator, then replaces only the task-wide authorization
 * gates with immutable preparation and stage authorization.
 */
export function evaluateStageExecutionGateB(input, context = {}) {
  const source = asObject(input);
  const taskInput = asObject(source.taskInput);
  const preparationReview = asObject(source.preparationReview);
  const stage = asObject(source.stage);
  const taskId = isNonemptyString(taskInput.taskId) ? taskInput.taskId : "UNKNOWN-TASK";
  const isDeliveryTransitionStage = typeof stage.stageId === "string"
    && stage.stageId.endsWith(DELIVERY_TRANSITION_GATE_B_CONTRACT.stageIdSuffix);
  const taskOptions = asObject(context.taskEvaluationOptions);
  const baseEvaluation = evaluateReadiness(taskInput, {
    ...taskOptions,
    deliveryTransitionStageId: stage.stageId,
  });
  const legacyAuthorizationGate = (code) => code === "TASK_EXECUTION_CONTRACT_CARDINALITY"
    || code === "COUNCIL_SCOPE_VERDICT"
    || code === "COUNCIL_CANDIDATE_BINDING"
    || code === "COUNCIL_SEAT_SET"
    || code === "COUNCIL_SEAT_UNIQUENESS"
    || code === "UNRESOLVED_BLOCKERS"
    || code.startsWith("SEAT_")
    || code.startsWith("APPROVAL_RECORD_")
    || code.startsWith("APPROVAL_PUBLICATION_")
    || code === "ACTIVATION_APPROVAL_REACHABLE";
  const gates = baseEvaluation.gateResults.filter((gate) => !legacyAuthorizationGate(gate.code)
    && !(isDeliveryTransitionStage && gate.code === "TASK_SCOPE_ACTION_COMPATIBILITY")).map((gate) => ({
    code: gate.code,
    passed: gate.passed,
    reason: gate.reason.replace(new RegExp(`^${taskId}: `), "").replace(/; action: .+\.$/, ""),
    correctiveAction: gate.reason.match(/; action: (.+)\.$/)?.[1] ?? "repair the failed task authorization gate",
  }));
  const addGate = (code, passed, reason, correctiveAction) => gates.push({ code, passed: passed === true, reason, correctiveAction });
  const requestedScope = asObject(taskInput.requestedScope);
  const candidate = asObject(taskInput.candidate);
  const requirementIds = asArray(taskInput.requirementIds);
  const requirementEvidence = asArray(stage.requirementEvidence);
  const acceptanceScenarioIds = asArray(taskInput.acceptanceScenarioIds);
  const independentQa = asObject(stage.independentQa);
  const rollback = asObject(stage.rollback);
  const publication = asObject(taskOptions.approvalPublication);
  const reviewerRegistry = normalizeRegistry(taskInput.reviewerRegistry);
  const qaReviewer = reviewerRegistry.byId.get(independentQa.reviewerId);
  const qaRole = registryRole(qaReviewer);
  const candidateContributors = new Set([
    ...asArray(candidate.implementerIds),
    ...asArray(candidate.evidenceProducerIds),
  ]);
  const preparationCandidate = asObject(preparationReview.proposalCandidate);
  const preparationSeats = asObject(preparationReview.councilSeatAttestations);
  const stageCouncil = asObject(stage.stageCouncil);
  const stageSeats = asObject(stageCouncil.seatVerdicts);
  const reviewerRegistrySha256 = computeReviewerRegistrySha256(taskInput.reviewerRegistry);
  const ownerActionStateSha256 = computeTaskOwnerActionStateSha256({
    taskId,
    requirements: asArray(taskInput.ownerActionRequirements),
    records: asArray(taskInput.ownerActions),
  });
  const preparationReviewSha256 = computePreparationReviewRecordSha256(preparationReview);
  const stageContextSha256 = computeStageApprovalContextSha256(stage);
  const stageApprovalSha256 = sha256(canonicalJson(stage));

  addGate("STAGE_GATE_B_BINDING", P0_R0_SUBSTANTIVE_TASK_IDS.includes(taskId)
    && stage.taskId === taskId
    && STAGE_ID.test(stage.stageId ?? "")
    && stage.stageId.includes(taskId)
    && ["execute", "accept"].includes(stage.gateKind)
    && stage.state === "ready"
    && stage.scopeClass === requestedScope.scopeClass
    && stage.actionClass === requestedScope.actionClass,
  "the stage envelope is malformed or differs from the task request", "supply one exact immutable ready stage for the requested pair");

  addGate("STAGE_SCHEMA", source.schemaVersion === STAGE_EXECUTION_SCHEMA_VERSION
    && hasExactKeys(source, ["schemaVersion", "taskInput", "preparationReview", "stage"])
    && hasExactKeys(stage, [
      "stageId", "preparationReviewId", "preparationReviewSha256", "taskId", "gateKind", "state", "scopeClass", "actionClass",
      "sequence", "candidateRevision", "dossierDigest", "predecessorReceiptSha256", "idempotencyKey",
      "stageDefinitionSha256", "moduleId", "moduleSha256",
      "candidate", "artifactReviews", "designCoverage", "dependencyEvidence", "openDecisions", "specialistVetoes",
      "privateAuthority", "reviewerRegistrySha256", "ownerActionStateSha256", "requirementEvidence",
      "independentQa", "rollback", "stageCouncil",
    ]), "the Gate B stage envelope has an unknown or incomplete schema", "rebuild the exact stage authorization record");
  addGate("STAGE_SCOPE_TASK", P0_R0_SUBSTANTIVE_TASK_IDS.includes(taskId) && stage.taskId === taskId,
    "the stage names a historical, unknown, or out-of-scope task", "select one of the five substantive R0 tasks");
  addGate("STAGE_ID", STAGE_ID.test(stage.stageId ?? "") && stage.stageId.includes(taskId),
    "the immutable task-bound stage ID is missing or malformed", "use a P0-STAGE-* ID containing the exact task ID");
  addGate("STAGE_GATE_KIND", ["execute", "accept"].includes(stage.gateKind),
    "the Gate B action kind is not execute or accept", "select the exact execute or accept gate kind");
  addGate("STAGE_STATE", stage.state === "ready",
    "the stage is not in the explicit ready state", "complete declaration and Gate B review before runtime start");
  addGate("STAGE_SCOPE_ACTION", stage.scopeClass === requestedScope.scopeClass
    && stage.actionClass === requestedScope.actionClass
    && (isDedicatedDeliveryTransitionScopeAction({
      taskId,
      stageId: stage.stageId,
      scopeClass: stage.scopeClass,
      actionClass: stage.actionClass,
    }) || isTaskMilestoneScopeActionCompatible({
      taskId,
      milestone: taskInput.milestone,
      scopeClass: stage.scopeClass,
      actionClass: stage.actionClass,
    })), "the stage scope/action differs from the exact task candidate or closed delivery-transition contract", "bind one task-owned pair or the dedicated private delivery-transition pair");
  addGate("STAGE_DELIVERY_TRANSITION_CONTRACT", !isDeliveryTransitionStage
    || (isDedicatedDeliveryTransitionScopeAction({
      taskId,
      stageId: stage.stageId,
      scopeClass: stage.scopeClass,
      actionClass: stage.actionClass,
    })
      && stage.moduleId === DELIVERY_TRANSITION_GATE_B_CONTRACT.moduleId
      && asArray(candidate.taskFiles).some((entry) => entry?.path === DELIVERY_TRANSITION_GATE_B_CONTRACT.modulePath
        && entry?.purpose === "implementation"
        && entry.gitMode === "100644"
        && entry.gitType === "blob"
        && `sha256:${entry.sha256}` === stage.moduleSha256)),
  "the delivery-transition stage is not bound to the exact private workflow scope, action, and code-owned module", "bind the dedicated delivery-transition contract without widening the ordinary task contract");
  addGate("STAGE_CANDIDATE", stage.candidateRevision === candidate.revision
    && stage.dossierDigest === candidate.dossierDigest
    && canonicalJson(stage.candidate) === canonicalJson(candidate)
    && canonicalJson(stage.artifactReviews) === canonicalJson(taskInput.artifactReviews)
    && canonicalJson(stage.designCoverage) === canonicalJson(taskInput.designCoverage)
    && canonicalJson(stage.dependencyEvidence) === canonicalJson(taskInput.dependencyEvidence)
    && canonicalJson(stage.openDecisions) === canonicalJson(taskInput.openDecisions)
    && canonicalJson(stage.specialistVetoes) === canonicalJson(taskInput.specialistVetoes)
    && canonicalJson(stage.privateAuthority) === canonicalJson(taskInput.privateAuthority),
  "the stage does not bind the exact implementation/evidence candidate", "bind stage revision and dossier digest to the reviewed candidate");
  addGate("STAGE_MODULE_CANDIDATE_BINDING", /^sha256:[0-9a-f]{64}$/.test(stage.stageDefinitionSha256 ?? "")
    && /^[a-z][a-z0-9.-]{2,63}$/.test(stage.moduleId ?? "")
    && /^sha256:[0-9a-f]{64}$/.test(stage.moduleSha256 ?? "")
    && asArray(candidate.taskFiles).some((entry) => entry?.purpose === "implementation"
      && ["100644", "100755"].includes(entry.gitMode)
      && entry.gitType === "blob"
      && entry.sha256 === stage.moduleSha256.slice("sha256:".length)),
  "the stage does not bind a reviewed implementation module in the exact candidate", "bind the stage definition and module digest to one candidate implementation file");
  addGate("STAGE_CURRENT_CONTEXT", stage.reviewerRegistrySha256 === reviewerRegistrySha256
    && stage.ownerActionStateSha256 === ownerActionStateSha256,
  "the reviewer registry or task owner-action state differs from the stage review context", "obtain fresh stage review after any reviewer or owner-action change");
  addGate("STAGE_PREPARATION_RECORD", hasExactKeys(preparationReview, [
    "preparationReviewId", "taskId", "stageId", "state", "scopeClass", "actionClass", "proposalCandidate",
    "reviewerRegistrySha256", "councilSeatAttestations", "evidenceReference",
  ]) && preparationReview.preparationReviewId === stage.preparationReviewId
    && preparationReview.taskId === taskId
    && preparationReview.stageId === stage.stageId
    && preparationReview.state === "accepted"
    && preparationReview.scopeClass === stage.scopeClass
    && preparationReview.actionClass === stage.actionClass
    && preparationReview.reviewerRegistrySha256 === reviewerRegistrySha256
    && preparationReviewSha256 === stage.preparationReviewSha256
    && preparationCandidate.revision !== stage.candidateRevision
    && FULL_REVISION.test(preparationCandidate.revision ?? "")
    && FULL_REVISION.test(preparationCandidate.baseRevision ?? "")
    && preparationCandidate.revision !== preparationCandidate.baseRevision
    && SHA256.test(preparationCandidate.dossierDigest ?? "")
    && isOpaqueReference(preparationReview.evidenceReference),
  "the stage does not resolve to one immutable accepted Gate A preparation record", "publish and bind the exact accepted preparation predecessor");
  const preparationSeatIds = [];
  addGate("PREPARATION_SEAT_SET", sameStringSet(Object.keys(preparationSeats), [...COUNCIL_SEATS]),
    "the accepted preparation record does not contain exactly five seats", "publish the five exact Gate A seat attestations");
  for (const seat of COUNCIL_SEATS) {
    const record = asObject(preparationSeats[seat]);
    const reviewer = reviewerRegistry.byId.get(record.reviewerId);
    const role = registryRole(reviewer);
    if (isNonemptyString(record.reviewerId)) preparationSeatIds.push(record.reviewerId);
    const expectedDigest = computeStageCouncilAttestationDigest({
      gateKind: "gate-a-prepare",
      preparationReviewId: preparationReview.preparationReviewId,
      taskId,
      stageId: stage.stageId,
      subject: `council:${seat}`,
      decision: "approve-preparation-candidate",
      reviewerId: record.reviewerId,
      reviewerRole: record.reviewerRole,
      reviewedRevision: preparationCandidate.revision,
      dossierDigest: preparationCandidate.dossierDigest,
      scopeClass: stage.scopeClass,
      actionClass: stage.actionClass,
      evidenceReference: record.evidenceReference,
    });
    addGate(`PREPARATION_SEAT_${seat.toUpperCase()}`, hasExactKeys(record, [
      "reviewerId", "reviewerRole", "verdict", "reviewedRevision", "dossierDigest", "preparationReviewId",
      "stageId", "scopeClass", "actionClass", "evidenceReference", "attestationDigest",
    ]) && reviewer?.active === true
      && role === SEAT_ROLE[seat]
      && record.reviewerRole === role
      && record.verdict === "approve-preparation-candidate"
      && record.reviewedRevision === preparationCandidate.revision
      && record.dossierDigest === preparationCandidate.dossierDigest
      && record.preparationReviewId === preparationReview.preparationReviewId
      && record.stageId === stage.stageId
      && record.scopeClass === stage.scopeClass
      && record.actionClass === stage.actionClass
      && isOpaqueReference(record.evidenceReference)
      && record.attestationDigest === expectedDigest,
    `${seat} accepted-preparation seat is absent, stale, role-invalid, or tampered`, `publish a valid ${seat} Gate A attestation`);
  }
  addGate("PREPARATION_SEAT_INDEPENDENCE", preparationSeatIds.length === COUNCIL_SEATS.length && unique(preparationSeatIds),
    "accepted-preparation seat identities are missing or duplicated", "use five distinct active Gate A reviewers");
  addGate("STAGE_PREPARATION_PREDECESSOR", PREPARATION_REVIEW_ID.test(stage.preparationReviewId ?? "")
    && Number.isInteger(stage.sequence)
    && stage.sequence >= 1
    && ((stage.sequence === 1 && stage.predecessorReceiptSha256 === null)
      || (stage.sequence > 1 && SHA256.test(stage.predecessorReceiptSha256 ?? ""))),
  "the Gate A predecessor, stage sequence, or predecessor receipt is invalid", "bind the accepted preparation review and exact prior-stage receipt");
  addGate("STAGE_IDEMPOTENCY", IDEMPOTENCY_KEY.test(stage.idempotencyKey ?? ""),
    "the stage lacks a stable closed-schema idempotency key", "use a P0-IDEMP-* key bound to this stage input");
  addGate("STAGE_REQUIREMENT_EVIDENCE", unique(requirementIds)
    && requirementEvidence.length === requirementIds.length
    && requirementIds.every((requirementId) => requirementEvidence.filter((record) => (
      hasExactKeys(record, [
        "requirementId", "stageId", "acceptanceScenarioIds", "candidateRevision", "environmentClass",
        "fixtureClass", "evidenceReference", "result", "residualObligations",
      ])
        && record.requirementId === requirementId
        && record.stageId === stage.stageId
        && record.candidateRevision === candidate.revision
        && Array.isArray(record.acceptanceScenarioIds)
        && record.acceptanceScenarioIds.length > 0
        && unique(record.acceptanceScenarioIds)
        && record.acceptanceScenarioIds.every((scenarioId) => acceptanceScenarioIds.includes(scenarioId))
        && ["fictional-local", "synthetic-local", "sanitized-private", "private-target"].includes(record.environmentClass)
        && ["fictional", "synthetic", "sanitized-metadata"].includes(record.fixtureClass)
        && record.result === "pass"
        && isOpaqueReference(record.evidenceReference)
        && Array.isArray(record.residualObligations)
    )).length === 1), "stage-scoped requirement evidence is missing, duplicated, stale, or unsafe", "bind one passing stage record to every canonical requirement");
  addGate("STAGE_INDEPENDENT_QA", hasExactKeys(independentQa, [
    "reviewerId", "reviewerRole", "result", "candidateRevision", "dossierDigest", "evidenceReference",
  ]) && qaReviewer?.active === true
    && qaRole === "qa"
    && independentQa.reviewerRole === "qa"
    && independentQa.result === "pass"
    && independentQa.candidateRevision === candidate.revision
    && independentQa.dossierDigest === candidate.dossierDigest
    && isOpaqueReference(independentQa.evidenceReference)
    && !candidateContributors.has(independentQa.reviewerId),
  "independent executed QA is absent, stale, or contributor-conflicted", "obtain an active independent QA pass for the exact candidate");
  addGate("STAGE_ROLLBACK", hasExactKeys(rollback, [
    "planReference", "snapshotReference", "rehearsalResult", "evidenceReference",
  ]) && isOpaqueReference(rollback.planReference)
    && isOpaqueReference(rollback.snapshotReference)
    && rollback.rehearsalResult === "pass"
    && isOpaqueReference(rollback.evidenceReference),
  "rollback plan, snapshot, or rehearsal evidence is incomplete", "record passing rollback evidence and an exact pre-action snapshot reference");
  addGate("STAGE_COUNCIL", hasExactKeys(stageCouncil, [
    "verdict", "reviewedRevision", "dossierDigest", "unresolvedBlockers", "seatVerdicts",
  ]) && stageCouncil.verdict === (stage.gateKind === "accept" ? "ready-to-accept" : "ready-to-execute")
    && stageCouncil.reviewedRevision === stage.candidateRevision
    && stageCouncil.dossierDigest === stage.dossierDigest
    && Array.isArray(stageCouncil.unresolvedBlockers)
    && stageCouncil.unresolvedBlockers.length === 0,
  "the stage-specific Council verdict is missing, stale, or blocked", "obtain a blocker-free five-seat stage verdict");
  const stageSeatIds = [];
  addGate("STAGE_SEAT_SET", sameStringSet(Object.keys(stageSeats), [...COUNCIL_SEATS]),
    "the stage Council does not contain exactly five seats", "publish Product, Design, Architecture, QA, and Project stage seats only");
  for (const seat of COUNCIL_SEATS) {
    const record = asObject(stageSeats[seat]);
    const reviewer = reviewerRegistry.byId.get(record.reviewerId);
    const role = registryRole(reviewer);
    if (isNonemptyString(record.reviewerId)) stageSeatIds.push(record.reviewerId);
    const expectedVerdict = stage.gateKind === "accept" ? "approve-stage-acceptance" : "approve-stage-execution";
    const expectedDigest = computeStageApprovalSeatAttestationDigest(record);
    addGate(`STAGE_SEAT_${seat.toUpperCase()}`, hasExactKeys(record, [
      "reviewerId", "reviewerRole", "verdict", "reviewedRevision", "dossierDigest", "preparationReviewId",
      "preparationReviewSha256", "stageId", "gateKind", "scopeClass", "actionClass", "stageContextSha256",
      "evidenceReference", "attestationDigest",
    ]) && reviewer?.active === true
      && role === SEAT_ROLE[seat]
      && record.reviewerRole === role
      && record.verdict === expectedVerdict
      && record.reviewedRevision === stage.candidateRevision
      && record.dossierDigest === stage.dossierDigest
      && record.preparationReviewId === stage.preparationReviewId
      && record.preparationReviewSha256 === stage.preparationReviewSha256
      && record.stageId === stage.stageId
      && record.gateKind === stage.gateKind
      && record.scopeClass === stage.scopeClass
      && record.actionClass === stage.actionClass
      && record.stageContextSha256 === stageContextSha256
      && isOpaqueReference(record.evidenceReference)
      && record.attestationDigest === expectedDigest,
    `${seat} stage seat is absent, stale, role-invalid, or tampered`, `publish a valid ${seat} full-context stage attestation`);
  }
  addGate("STAGE_SEAT_INDEPENDENCE", stageSeatIds.length === COUNCIL_SEATS.length
    && unique(stageSeatIds)
    && stageSeatIds.every((reviewerId) => !candidateContributors.has(reviewerId)),
  "stage seats are duplicated or overlap candidate contributors", "use five distinct stage reviewers independent of implementation and evidence production");
  addGate("STAGE_PUBLICATION", publication.stageId === stage.stageId
    && publication.taskId === taskId
    && publication.registryPath === STAGE_APPROVAL_REGISTRY_PATH
    && publication.registryBytesVerified === true
    && SHA256.test(publication.registrySha256 ?? "")
    && publication.preparationReviewId === preparationReview.preparationReviewId
    && publication.publishedPreparationReviewSha256 === preparationReviewSha256
    && publication.currentPreparationReviewSha256 === preparationReviewSha256
    && publication.preparationReviewBytesVerified === true
    && FULL_REVISION.test(publication.preparationPublicationRevision ?? "")
    && publication.preparationCandidateAncestorOfPublication === true
    && publication.stageApprovalBytesVerified === true
    && SHA256.test(publication.publishedStageApprovalSha256 ?? "")
    && publication.publishedStageApprovalSha256 === stageApprovalSha256
    && publication.currentStageApprovalSha256 === stageApprovalSha256
    && FULL_REVISION.test(publication.stagePublicationRevision ?? "")
    && publication.stageCandidateAncestorOfPublication === true
    && publication.preparationPublicationAncestorOfStageCandidate === true
    && publication.stageApprovalPublishedOnFetchedMain === true,
  "trusted publication facts do not bind the append-only preparation and stage records", "verify the exact two-record publication sequence from Git history");
  const activation = asObject(taskOptions.activation);
  addGate("STAGE_ACTIVATION_REACHABLE", activation.stageApprovalRecordReachableFromHead === true
    && activation.candidateReachableFromHead === true,
  "the exact stage record or implementation candidate is not reachable from fetched main", "refresh exact-main stage publication facts before runtime start");

  return gateEvaluation(
    taskId,
    gates,
    "executionAllowed",
    true,
    stage.gateKind === "accept" ? "Ready to accept — Gate B" : "Ready to execute — Gate B",
    `Run only ${stage.stageId ?? "the named stage"} through the guarded runtime with its frozen idempotency and predecessor bindings.`,
    {
      schemaVersion: source.schemaVersion ?? null,
      taskId,
      stageId: stage.stageId ?? null,
      preparationReviewId: stage.preparationReviewId ?? null,
      gateKind: stage.gateKind ?? null,
      stageState: stage.state ?? null,
      scopeClass: stage.scopeClass ?? null,
      actionClass: stage.actionClass ?? null,
      candidateRevision: stage.candidateRevision ?? null,
      dossierDigest: stage.dossierDigest ?? null,
      predecessorReceiptSha256: stage.predecessorReceiptSha256 ?? null,
      idempotencyKey: stage.idempotencyKey ?? null,
      taskEvaluationFingerprint: baseEvaluation.normalizedEvidence?.sourceFingerprint ?? null,
      sourceFingerprint: `sha256:${sha256(canonicalJson(source))}`,
    },
  );
}

export function deriveEffectiveArtifactState(artifact, review) {
  if (!isObject(artifact)) return "missing";
  const contentState = artifact?.contentState ?? artifact?.state ?? "missing";
  if (review?.decision === "approved" && ["in-review", "approved"].includes(contentState)) return "approved";
  if (review?.decision === "not-applicable" && ["in-review", "not-applicable"].includes(contentState)) return "not-applicable";
  return ["approved", "not-applicable"].includes(contentState) ? "in-review" : contentState;
}

function sensitiveInputPaths(value, currentPath = "$", matches = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => sensitiveInputPaths(entry, `${currentPath}[${index}]`, matches));
    return matches;
  }
  if (isObject(value)) {
    for (const [key, entry] of Object.entries(value)) {
      const entryPath = `${currentPath}.${key}`;
      if (SENSITIVE_KEY.test(key)) matches.push(entryPath);
      sensitiveInputPaths(entry, entryPath, matches);
    }
    return matches;
  }
  if (typeof value === "string" && SENSITIVE_VALUE.test(value)) matches.push(currentPath);
  return matches;
}

function normalizeRegistry(registry) {
  const records = Array.isArray(registry) ? registry : asArray(registry?.reviewers);
  const byId = new Map();
  const duplicateIds = new Set();
  for (const record of records) {
    const reviewerId = record?.reviewerId;
    if (!isNonemptyString(reviewerId)) continue;
    if (byId.has(reviewerId)) duplicateIds.add(reviewerId);
    else byId.set(reviewerId, record);
  }
  return { records, byId, duplicateIds };
}

function registryRole(record) {
  if (!record) return null;
  if (isNonemptyString(record.role) && !Array.isArray(record.roles)) return record.role;
  if (Array.isArray(record.roles) && record.roles.length === 1 && isNonemptyString(record.roles[0])) return record.roles[0];
  return null;
}

function expectedArtifactState(kind) {
  return OPTIONAL_NA_ARTIFACTS.has(kind) ? new Set(["approved", "not-applicable"]) : new Set(["approved"]);
}

function expectedSeatVerdict(seat, effectiveStates) {
  if (seat === "design" && effectiveStates.design === "not-applicable") return "not-applicable";
  if (seat === "architecture" && effectiveStates.architecture === "not-applicable") return "not-applicable";
  return "approved";
}

function expectedScopeVerdict(scopeClass) {
  return VERDICT_FOR_SCOPE[scopeClass] ?? null;
}

function artifactBindingsMatch(candidateArtifacts, sourceArtifacts) {
  if (!isObject(candidateArtifacts)) return false;
  if (!sameStringSet(Object.keys(candidateArtifacts), [...ARTIFACT_KINDS])) return false;
  return ARTIFACT_KINDS.every((kind) => candidateArtifacts[kind]?.path === sourceArtifacts[kind]?.path
    && candidateArtifacts[kind]?.sha256 === sourceArtifacts[kind]?.sha256);
}

/**
 * Pure fail-closed evaluator. `input` contains source evidence only; callers may
 * never supply a derived authorization or publication field. Git/filesystem
 * publication facts are injected through options.candidatePublication and
 * options.approvalPublication so source records cannot bless themselves.
 */
export function evaluateReadiness(input, options = {}) {
  const source = asObject(input);
  const taskId = isNonemptyString(source.taskId) ? source.taskId : "UNKNOWN-TASK";
  const canonicalMilestone = canonicalMilestoneForTaskId(taskId);
  const phase = options.phase ?? source.evaluationPhase ?? "approval";
  // Time is a trusted adapter input, never a source-evidence field that can be
  // moved by the record seeking authorization.
  const now = parseInstant(options.now ?? "") ?? Number.NaN;
  const gateResults = [];
  const addGate = (code, passed, failure, correctiveAction) => {
    gateResults.push({
      code,
      passed: passed === true,
      reason: passed === true
        ? `${taskId}: ${code} passed.`
        : `${taskId}: ${failure}; action: ${correctiveAction}.`,
    });
  };

  addGate("SCHEMA_VERSION", source.schemaVersion === READINESS_SCHEMA_VERSION,
    "the readiness evidence schema is missing or unsupported", `supply schemaVersion ${READINESS_SCHEMA_VERSION}`);
  addGate("TASK_ID", /^[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(taskId),
    "the stable task ID is missing or malformed", "supply the canonical task ID");
  addGate("TASK_MILESTONE_COMPATIBILITY", canonicalMilestone !== null && source.milestone === canonicalMilestone,
    "the source milestone is missing or does not belong to the stable task ID", "use the canonical milestone encoded by the manifest task ID");
  addGate("EVALUATION_PHASE", ["candidate", "approval", "activation"].includes(phase),
    "the evaluation phase is unknown", "select candidate, approval, or activation");
  const derivedOverrides = FORBIDDEN_DERIVED_KEYS.filter((key) => hasOwn(source, key));
  addGate("DERIVED_OVERRIDE", derivedOverrides.length === 0,
    "one or more derived authorization fields were supplied as source evidence", "remove all derived readiness, decision, permission, gate, and blocker fields");
  const approvalRecordSource = asObject(source.approvalRecord);
  const approvalRecordKeys = Object.keys(approvalRecordSource);
  const approvalRecordHasPublicationFields = approvalRecordKeys.some((key) => [
    "revision",
    "approvalRevision",
    "path",
    "registryPath",
    "registrySha256",
    "registryBytesVerified",
    "taskId",
    "publishedTaskApprovalSha256",
    "currentTaskApprovalSha256",
    "taskApprovalBytesVerified",
    "publishedReviewerRegistrySha256",
    "currentReviewerRegistrySha256",
    "reviewerRegistryBytesVerified",
    "publishedOwnerActionStateSha256",
    "currentOwnerActionStateSha256",
    "ownerActionStateBytesVerified",
    "publishedTaskContractSha256",
    "currentTaskContractSha256",
    "taskContractBytesVerified",
    "publishedTaskFilesSha256",
    "currentTaskFilesSha256",
    "publishedTaskFilesBytesVerified",
    "currentTaskFilesBytesVerified",
    "taskFilesCoverageVerified",
    "currentTaskFilesRevision",
    "baseRevision",
    "baseAncestorOfCandidate",
    "candidateDiffTaskFilesSha256",
    "candidateDiffExactMatchVerified",
    "candidateDiffNoDeletionsVerified",
    "candidateDiffExclusions",
    "publishedTaskFilesModesVerified",
    "currentTaskFilesModesVerified",
    "publishedTaskFileContentClassesVerified",
    "currentTaskFileContentClassesVerified",
    "currentDescendantDeltaPaths",
    "currentDescendantDeltaPathsVerified",
    "currentDescendantDeltaNoDeletionsVerified",
    "candidateTaskContractSha256",
    "candidateTaskContractBytesVerified",
    "publishedTaskFileArchivesVerified",
    "currentTaskFileArchivesVerified",
    "publishedOnFetchedMain",
    "candidateAncestorOfApproval",
  ].includes(key));
  addGate("PUBLICATION_SOURCE_OVERRIDE", !hasOwn(source, "candidatePublication")
    && !hasOwn(source, "approvalPublication")
    && !approvalRecordHasPublicationFields,
  "mutable source evidence contains a publication assertion", "remove publication facts and inject them from the trusted Git/filesystem adapter");
  const unsafePaths = sensitiveInputPaths(source);
  addGate("PUBLIC_SAFETY", unsafePaths.length === 0,
    "the input contains a sensitive or authentic-content sentinel", "replace sensitive data with an approved opaque public-safe reference");
  addGate("AUTHENTIC_MEDIA_EXCLUSION", source.safety?.authenticMediaAccessed === false,
    "authentic-media exclusion is not explicitly evidenced", "record authenticMediaAccessed=false without inspecting media");
  addGate("PRIVATE_NETWORK_EXCLUSION", source.safety?.privateNetworkAccessed === false,
    "private-network exclusion is not explicitly evidenced", "record privateNetworkAccessed=false for this local/public evaluation");

  const artifacts = asObject(source.artifacts);
  const reviews = asObject(source.artifactReviews);
  const effectiveArtifactStates = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [
    kind,
    deriveEffectiveArtifactState(artifacts[kind], reviews[kind]),
  ]));
  const artifactReadiness = ARTIFACT_KINDS.every((kind) => expectedArtifactState(kind).has(effectiveArtifactStates[kind]))
    ? "Ready"
    : "Incomplete";

  for (const kind of ARTIFACT_KINDS) {
    const artifact = asObject(artifacts[kind]);
    const review = asObject(reviews[kind]);
    const prefix = `ARTIFACT_${kind.toUpperCase()}`;
    const basename = isNonemptyString(artifact.path) ? path.posix.basename(artifact.path) : "";
    const safeRelativePath = isNonemptyString(artifact.path)
      && !path.posix.isAbsolute(artifact.path)
      && !artifact.path.split("/").includes("..")
      && path.posix.normalize(artifact.path) === artifact.path;
    addGate(`${prefix}_PRESENT`, isObject(artifacts[kind]), `${kind} artifact metadata is missing`, `supply the task-bound ${kind} artifact metadata`);
    addGate(`${prefix}_NAME`, safeRelativePath && basename.startsWith("P0-") && basename.includes(taskId),
      `${kind} artifact naming is not P0-prefixed and task-bound`, `use a P0-${taskId}-* basename`);
    addGate(`${prefix}_CONTENT_STATE`, ARTIFACT_CONTENT_STATES.has(artifact.contentState)
      && (review.decision !== "approved" || ["in-review", "approved"].includes(artifact.contentState))
      && (review.decision !== "not-applicable" || ["in-review", "not-applicable"].includes(artifact.contentState)),
    `${kind} artifact content state is missing or incompatible with its review`, "return the content to a valid reviewable state before approval");
    addGate(`${prefix}_MARKERS`, artifact.markersValid === true,
      `${kind} artifact task, kind, or state markers are unverified`, "validate all artifact markers against the file bytes");
    addGate(`${prefix}_HASH`, SHA256.test(artifact.sha256 ?? "") && artifact.observedSha256 === artifact.sha256,
      `${kind} artifact content hash is missing or mismatched`, "recompute the SHA-256 from the exact artifact bytes");
    addGate(`${prefix}_STATE`, expectedArtifactState(kind).has(effectiveArtifactStates[kind]),
      `${kind} effective artifact state is ${effectiveArtifactStates[kind]}`, `obtain the required exact-byte ${kind} approval`);
    addGate(`${prefix}_REVIEW_DECISION`, review.decision === "approved" || (OPTIONAL_NA_ARTIFACTS.has(kind) && review.decision === "not-applicable"),
      `${kind} artifact review is not permitting`, `record an approved review${OPTIONAL_NA_ARTIFACTS.has(kind) ? " or a valid not-applicable decision" : ""}`);
    if (review.decision === "not-applicable") {
      addGate(`${prefix}_NA_ROUTE`, OPTIONAL_NA_ARTIFACTS.has(kind)
        && isNonemptyString(review.notApplicableRationale)
        && review.notApplicableRationale.trim().length >= 20
        && review.specialistConcurrence === true,
      `${kind} not-applicable evidence is invalid`, "record a concrete rationale and explicit specialist concurrence");
    }
  }

  const candidate = asObject(source.candidate);
  const candidatePublication = asObject(options.candidatePublication);
  const approvalPublication = asObject(options.approvalPublication);
  const candidateRevisionValid = FULL_REVISION.test(candidate.revision ?? "");
  const acceptanceScenarioIds = source.acceptanceScenarioIds;
  const dependencyRequirements = asArray(source.dependencyRequirements);
  const contractDependencyIds = dependencyRequirements.map((entry) => (
    typeof entry === "string" ? entry : entry?.dependencyId
  ));
  const taskContractSha256 = computeTaskContractSha256({
    taskId,
    outcome: source.outcome,
    requirementIds: source.requirementIds,
    dependencyIds: contractDependencyIds,
    acceptanceEvidence: source.acceptanceEvidence,
    acceptanceScenarioIds,
  });
  const candidateArtifacts = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
    path: artifacts[kind]?.path ?? null,
    sha256: artifacts[kind]?.sha256 ?? null,
  }]));
  const candidateTaskFiles = asArray(candidate.taskFiles);
  const taskFilesValidation = validateTaskFilesManifest({
    taskId,
    taskFiles: candidateTaskFiles,
    artifacts: candidateArtifacts,
    scopeClass: source.requestedScope?.scopeClass,
  });
  const taskFilesSha256 = taskFilesValidation.sha256;
  const computedDossierDigest = computeDossierDigest({
    taskId,
    revision: candidate.revision ?? null,
    baseRevision: candidate.baseRevision ?? null,
    artifacts: candidateArtifacts,
    taskFilesSha256,
  });
  addGate("CANDIDATE_REVISION", candidateRevisionValid,
    "the candidate revision is not a full commit SHA", "bind the dossier to the exact 40-character candidate commit");
  addGate("CANDIDATE_BASE_REVISION", FULL_REVISION.test(candidate.baseRevision ?? "")
    && candidate.baseRevision !== candidate.revision
    && candidatePublication.baseRevision === candidate.baseRevision
    && candidatePublication.baseAncestorOfCandidate === true,
  "the candidate lacks a distinct trusted ancestor base revision", "bind and verify the exact merge-base ancestor used for the full candidate diff");
  addGate("CANDIDATE_ARTIFACT_BINDINGS", artifactBindingsMatch(candidate.artifacts, artifacts),
    "candidate artifact paths or hashes do not match the source artifacts", "rebuild the complete six-artifact candidate binding");
  addGate("CANDIDATE_TASK_FILES_SCHEMA", taskFilesValidation.schemaValid,
    "the task-file manifest is missing, malformed, duplicated, unsafe, or non-canonical", "publish exact path, SHA-256, and permitted purpose bindings for every task file");
  addGate("CANDIDATE_TASK_FILES_ARTIFACT_COVERAGE", taskFilesValidation.artifactCoverageValid,
    "the task-file manifest does not exactly cover all six artifact bindings", "bind one matching artifact-purpose entry for every canonical task artifact");
  addGate("CANDIDATE_TASK_FILES_WORK_COVERAGE", taskFilesValidation.workCoverageValid,
    "the task-file manifest lacks implementation or evidence files", "bind every implementation and evidence file in the task-scoped manifest");
  addGate("CANDIDATE_TASK_FILES_LOCAL_TYPES", source.requestedScope?.scopeClass !== "local-synthetic"
    || taskFilesValidation.localSyntheticContentClassesValid,
  "local-synthetic task files contain an unsupported, disguised, or purpose-incompatible content class", "use only the closed text extension policy and evidence-only XLSX workbook class");
  addGate("CANDIDATE_TASK_FILES_LOCAL_BYTES", source.requestedScope?.scopeClass !== "local-synthetic"
    || (candidatePublication.publishedTaskFileContentClassesVerified === true
      && candidatePublication.currentTaskFileContentClassesVerified === true
      && (taskFilesValidation.xlsxPaths.length === 0
        || (candidatePublication.publishedTaskFileArchivesVerified === true
          && candidatePublication.currentTaskFileArchivesVerified === true))),
  "local-synthetic task-file bytes lack content-class verification at candidate or current revision", "apply fatal UTF-8, NUL, binary-magic, and XLSX archive checks required by the closed content policy");
  addGate("CANDIDATE_TASK_FILES_DIGEST", candidate.taskFilesSha256 === taskFilesSha256,
    "the candidate task-file digest does not match its canonical manifest", "recompute the canonical task-file manifest SHA-256");
  addGate("CANDIDATE_TASK_FILES_FULL_DIFF", candidatePublication.candidateDiffTaskFilesSha256 === taskFilesSha256
    && candidatePublication.candidateDiffExactMatchVerified === true
    && candidatePublication.candidateDiffNoDeletionsVerified === true
    && sameStringSet(candidatePublication.candidateDiffExclusions, [...TASK_FILE_DIFF_EXCLUSIONS]),
  "the task-file manifest is not the exact permitted base-to-candidate Git diff", "bind every added or modified blob, reject deletions and renames, and use only the immutable publication/projection exclusions");
  addGate("CANDIDATE_DOSSIER_DIGEST", candidate.dossierDigest === computedDossierDigest,
    "the dossier digest does not match the canonical candidate payload", "recompute the canonical dossier digest");
  addGate("TASK_CONTRACT_SOURCE", isNonemptyString(source.outcome)
    && Array.isArray(source.requirementIds)
    && Array.isArray(source.dependencyRequirements)
    && isNonemptyString(source.acceptanceEvidence)
    && Array.isArray(acceptanceScenarioIds),
  "the canonical task outcome, requirements, dependencies, acceptance evidence, or scenarios are missing", "rebuild the task contract from the immutable manifest task");
  addGate("CANDIDATE_TASK_CONTRACT", candidate.taskContractSha256 === taskContractSha256,
    "the candidate does not bind the canonical task contract", "bind the candidate to the current canonical task-contract SHA-256");
  addGate("CANDIDATE_TASK_CONTRACT_PUBLICATION", SHA256.test(candidatePublication.candidateTaskContractSha256 ?? "")
    && candidatePublication.candidateTaskContractSha256 === candidate.taskContractSha256
    && candidatePublication.candidateTaskContractSha256 === taskContractSha256
    && candidatePublication.candidateTaskContractBytesVerified === true,
  "the manifest task at candidate publication differs from the bound task contract", "read and verify the canonical manifest task at the candidate revision");
  addGate("CANDIDATE_PUBLICATION_BINDING", candidatePublication.revision === candidate.revision,
    "trusted candidate publication does not bind the source candidate revision", "verify and inject publication evidence for the exact candidate revision");
  addGate("CANDIDATE_BYTES_VERIFIED", candidatePublication.candidateBytesVerified === true,
    "the exact candidate bytes are not verified", "verify every candidate path and hash at the candidate revision");
  addGate("CANDIDATE_TASK_FILES_PUBLISHED", SHA256.test(candidatePublication.publishedTaskFilesSha256 ?? "")
    && candidatePublication.publishedTaskFilesSha256 === taskFilesSha256
    && candidatePublication.publishedTaskFilesBytesVerified === true
    && candidatePublication.publishedTaskFilesModesVerified === true,
  "the published candidate task-file bytes do not match the bound manifest", "read every bound task file at the candidate revision and verify its canonical digest");
  addGate("CANDIDATE_TASK_FILES_CURRENT", SHA256.test(candidatePublication.currentTaskFilesSha256 ?? "")
    && candidatePublication.currentTaskFilesSha256 === taskFilesSha256
    && candidatePublication.currentTaskFilesSha256 === candidatePublication.publishedTaskFilesSha256
    && candidatePublication.currentTaskFilesBytesVerified === true
    && candidatePublication.currentTaskFilesModesVerified === true
    && candidatePublication.taskFilesCoverageVerified === true,
  "the current task-scoped files differ from the approved candidate or lack complete trusted coverage", "restore exact approved task bytes or publish a fresh candidate and attestations");
  addGate("CANDIDATE_DESCENDANT_DELTA", candidatePublication.currentDescendantDeltaPathsVerified === true
    && candidatePublication.currentDescendantDeltaNoDeletionsVerified === true,
  "candidate descendants contain an unapproved path, deletion, or unverified delta", "allow only the closed post-candidate publication and projection surfaces");
  addGate("CANDIDATE_PUBLISHED", candidatePublication.candidateOnFetchedMain === true,
    "the candidate is absent from fetched origin/main", "publish the candidate through normal review and refresh origin/main");

  const { records: registryRecords, byId: registryById, duplicateIds: duplicateRegistryIds } = normalizeRegistry(source.reviewerRegistry);
  addGate("REVIEWER_REGISTRY", registryRecords.length > 0 && duplicateRegistryIds.size === 0,
    "the reviewer registry is empty or contains duplicate stable IDs", "publish a unique public-safe reviewer registry");

  for (const kind of ARTIFACT_KINDS) {
    const artifact = asObject(artifacts[kind]);
    const review = asObject(reviews[kind]);
    const prefix = `REVIEW_${kind.toUpperCase()}`;
    const reviewer = registryById.get(review.reviewerId);
    const role = registryRole(reviewer);
    const expectedDecision = effectiveArtifactStates[kind] === "not-applicable" ? "not-applicable" : "approved";
    addGate(`${prefix}_IDENTITY`, isNonemptyString(review.reviewerId) && Boolean(reviewer) && reviewer?.active === true,
      `${kind} artifact reviewer identity is missing, unknown, duplicate, or inactive`, "use one active stable reviewer ID from the registry");
    addGate(`${prefix}_ROLE`, role === ARTIFACT_ROLE[kind] && review.reviewerRole === role,
      `${kind} artifact reviewer is not bound to the required role`, `use a registry reviewer with the ${ARTIFACT_ROLE[kind]} role`);
    addGate(`${prefix}_BINDING`, review.reviewedRevision === candidate.revision
      && review.artifactSha256 === artifact.sha256
      && review.dossierDigest === candidate.dossierDigest,
    `${kind} artifact review does not bind the exact candidate bytes`, "bind revision, artifact hash, and dossier digest to the candidate");
    addGate(`${prefix}_EVIDENCE`, isOpaqueReference(review.evidenceReference),
      `${kind} artifact review lacks an opaque public-safe evidence reference`, "publish a retrievable opaque review reference");
    const expectedAttestation = computeAttestationDigest({
      taskId,
      subjectType: "artifact",
      subject: kind,
      decision: expectedDecision,
      reviewerId: review.reviewerId,
      reviewerRole: review.reviewerRole,
      reviewedRevision: review.reviewedRevision,
      dossierDigest: review.dossierDigest,
      artifactSha256: review.artifactSha256,
      evidenceReference: review.evidenceReference,
      notApplicableRationale: review.notApplicableRationale ?? null,
      specialistConcurrence: review.specialistConcurrence ?? null,
    });
    addGate(`${prefix}_ATTESTATION`, review.attestationDigest === expectedAttestation,
      `${kind} artifact attestation is missing or tampered`, "recompute and record the canonical exact-candidate attestation");
  }

  addGate("REQUIREMENT_SET", sameStringSet(source.requirementIds, source.expectedRequirementIds),
    "task requirement IDs are missing, duplicated, unknown, or mismatched", "use the exact canonical manifest requirement-ID set");
  addGate("ACCEPTANCE_SCENARIOS", Array.isArray(acceptanceScenarioIds)
    && acceptanceScenarioIds.length > 0
    && unique(acceptanceScenarioIds)
    && acceptanceScenarioIds.every((id) => isNonemptyString(id) && id.startsWith(`${taskId}-`)),
  "acceptance scenario IDs are missing, duplicated, or not task-bound", "publish nonempty unique task acceptance scenario IDs");

  const designCoverage = asObject(source.designCoverage);
  if (effectiveArtifactStates.design === "approved") {
    addGate("DESIGN_APPLICABILITY", designCoverage.applicability === "applicable",
      "approved Design is not marked applicable", "mark Design applicable and map its evidence");
    addGate("DESIGN_JOURNEYS", Array.isArray(designCoverage.journeyIds)
      && designCoverage.journeyIds.length > 0
      && designCoverage.journeyIds.every((id) => acceptanceScenarioIds?.includes(id)),
    "Design journey coverage is incomplete or references an unknown scenario", "map at least one registered journey scenario");
    for (const dimension of DESIGN_STATE_DIMENSIONS) {
      const ids = designCoverage.stateCoverage?.[dimension];
      addGate(`DESIGN_STATE_${dimension.toUpperCase()}`, Array.isArray(ids)
        && ids.length > 0
        && ids.every((id) => acceptanceScenarioIds?.includes(id)),
      `Design ${dimension} state coverage is missing or unknown`, `map ${dimension} to a registered acceptance scenario`);
    }
    for (const dimension of DESIGN_ACCESSIBILITY_DIMENSIONS) {
      const ids = designCoverage.accessibilityCoverage?.[dimension];
      addGate(`DESIGN_A11Y_${dimension.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}`, Array.isArray(ids)
        && ids.length > 0
        && ids.every((id) => acceptanceScenarioIds?.includes(id)),
      `Design ${dimension} accessibility coverage is missing or unknown`, `map ${dimension} to a registered acceptance scenario`);
    }
  } else if (effectiveArtifactStates.design === "not-applicable") {
    addGate("DESIGN_NA_COVERAGE", designCoverage.applicability === "not-applicable"
      && isNonemptyString(designCoverage.notApplicableRationale)
      && designCoverage.notApplicableRationale.trim().length >= 20
      && reviews.design?.specialistConcurrence === true,
    "Design not-applicable coverage lacks rationale or Designer concurrence", "record the complete not-applicable route");
  } else {
    addGate("DESIGN_APPLICABILITY", false,
      "Design coverage cannot be accepted before the Design artifact is approved", "complete the Design artifact review first");
  }

  const council = asObject(source.council);
  const requestedScope = asObject(source.requestedScope);
  const actionRequirements = asArray(source.ownerActionRequirements);
  const actionRecords = asArray(source.ownerActions);
  const dependencyEvidence = asArray(source.dependencyEvidence);
  const implementerIds = asArray(source.candidate?.implementerIds);
  const evidenceProducerIds = asArray(source.candidate?.evidenceProducerIds);
  const designCoverageDigest = computeDesignCoverageDigest(designCoverage);
  const implementerIdsDigest = computeIdentitySetDigest(implementerIds);
  const evidenceProducerIdsDigest = computeIdentitySetDigest(evidenceProducerIds);
  const openDecisionsDigest = computeStringSetDigest(source.openDecisions);
  const unresolvedBlockersDigest = computeStringSetDigest(council.unresolvedBlockers);
  const specialistVetoesDigest = computeStringSetDigest(source.specialistVetoes);
  const dependencyEvidenceSha256 = computeDependencyEvidenceSha256(dependencyEvidence);
  const privateAuthoritySha256 = computePrivateAuthoritySha256(source.privateAuthority);
  const artifactReviewsSha256 = computeArtifactReviewsSha256(reviews);
  const reviewerRegistrySha256 = computeReviewerRegistrySha256(source.reviewerRegistry);
  const ownerActionStateSha256 = computeTaskOwnerActionStateSha256({
    taskId,
    requirements: actionRequirements,
    records: actionRecords,
  });
  const expectedVerdict = expectedScopeVerdict(requestedScope.scopeClass);
  const executionContractPairCount = taskExecutionContractPairCount(taskId);
  addGate("TASK_APPROVAL_ACTION_CARDINALITY",
    sameStringSet(Object.keys(requestedScope), ["scopeClass", "actionClass"])
      && isNonemptyString(requestedScope.scopeClass)
      && isNonemptyString(requestedScope.actionClass),
  "the task approval does not identify exactly one execution-bearing scope/action pair", "split multi-action work into Council-approved tasks or adopt a future reviewed staged-approval schema");
  addGate("TASK_EXECUTION_CONTRACT_CARDINALITY",
    executionContractPairCount === TASK_APPROVAL_EXECUTION_ACTION_CARDINALITY,
  "the exact task contract contains zero or multiple execution-bearing scope/action pairs", "obtain a Council-approved task split or adopt a future reviewed staged-approval schema before task approval");
  addGate("HISTORICAL_TASK_NON_AUTHORIZING", !isHistoricalNonAuthorizingTaskId(taskId),
    "this Done record is historical planning or control-review evidence and can never authorize execution", "create and approve a distinct non-historical execution task instead of attaching a later taskApproval");
  addGate("REQUESTED_SCOPE", Boolean(expectedVerdict) && isNonemptyString(requestedScope.actionClass),
    "the requested scope or action class is missing or unsupported", "select a named local-synthetic, private-execution, or release scope and action");
  addGate("SCOPE_ACTION_COMPATIBILITY",
    asArray(SCOPE_ACTION_COMPATIBILITY[requestedScope.scopeClass]).includes(requestedScope.actionClass),
  "the requested action class is not permitted for the requested scope", "select the immutable scope/action pair required by the canonical task contract");
  addGate("TASK_SCOPE_ACTION_COMPATIBILITY", isTaskMilestoneScopeActionCompatible({
    taskId,
    milestone: source.milestone,
    scopeClass: requestedScope.scopeClass,
    actionClass: requestedScope.actionClass,
  }),
  "the requested scope/action pair is not owned by this task and milestone", "use the closed task-milestone action contract from the canonical manifest task");
  addGate("COUNCIL_SCOPE_VERDICT", council.verdict === expectedVerdict && PERMITTING_VERDICTS.has(council.verdict),
    "the Council verdict does not permit the requested scope", `record the exact ${expectedVerdict ?? "permitting"} verdict after review`);
  addGate("COUNCIL_CANDIDATE_BINDING", council.reviewedRevision === candidate.revision
    && council.dossierDigest === candidate.dossierDigest,
  "the Council decision does not bind the exact task candidate", "bind the Council decision to the candidate revision and dossier digest");
  addGate("OPEN_DECISIONS", Array.isArray(source.openDecisions) && source.openDecisions.length === 0,
    "one or more product or technical decisions remain open", "resolve and record every open decision");
  addGate("UNRESOLVED_BLOCKERS", Array.isArray(council.unresolvedBlockers) && council.unresolvedBlockers.length === 0,
    "one or more Council blockers remain unresolved", "resolve every Council blocker and attach evidence");
  addGate("SPECIALIST_VETO", Array.isArray(source.specialistVetoes) && source.specialistVetoes.length === 0,
    "a specialist veto remains", "resolve the veto with the accountable specialist");

  const seatVerdicts = asObject(council.seatVerdicts);
  addGate("COUNCIL_SEAT_SET", sameStringSet(Object.keys(seatVerdicts), [...COUNCIL_SEATS]),
    "the Council record does not contain exactly the five required seats", "supply Product, Design, Architecture, QA, and Project records only");
  const seatReviewerIds = [];
  for (const seat of COUNCIL_SEATS) {
    const record = asObject(seatVerdicts[seat]);
    const prefix = `SEAT_${seat.toUpperCase()}`;
    const expectedSeatDecision = expectedSeatVerdict(seat, effectiveArtifactStates);
    const reviewer = registryById.get(record.reviewerId);
    const role = registryRole(reviewer);
    if (isNonemptyString(record.reviewerId)) seatReviewerIds.push(record.reviewerId);
    addGate(`${prefix}_VERDICT`, record.verdict === expectedSeatDecision,
      `${seat} Council seat is not permitting`, `record the required ${expectedSeatDecision} seat verdict`);
    addGate(`${prefix}_IDENTITY`, isNonemptyString(record.reviewerId) && Boolean(reviewer) && reviewer?.active === true,
      `${seat} Council reviewer identity is missing, unknown, duplicate, or inactive`, "use one active stable reviewer ID from the registry");
    addGate(`${prefix}_ROLE`, role === SEAT_ROLE[seat] && record.reviewerRole === role,
      `${seat} Council reviewer is not bound to the required role`, `use a registry reviewer with the ${SEAT_ROLE[seat]} role`);
    addGate(`${prefix}_BINDING`, record.reviewedRevision === candidate.revision
      && record.dossierDigest === candidate.dossierDigest,
    `${seat} Council seat does not bind the exact candidate`, "bind the seat to the candidate revision and dossier digest");
    addGate(`${prefix}_EVIDENCE`, isOpaqueReference(record.evidenceReference) && isNonemptyString(record.rationale),
      `${seat} Council seat lacks rationale or opaque public-safe evidence`, "publish both a rationale and retrievable opaque evidence reference");
    addGate(`${prefix}_CONTEXT`, record.requestedScopeClass === requestedScope.scopeClass
      && record.requestedActionClass === requestedScope.actionClass
      && record.requestedCouncilVerdict === council.verdict
      && record.designCoverageDigest === designCoverageDigest
      && record.implementerIdsDigest === implementerIdsDigest
      && record.evidenceProducerIdsDigest === evidenceProducerIdsDigest
      && record.openDecisionsDigest === openDecisionsDigest
      && record.unresolvedBlockersDigest === unresolvedBlockersDigest
      && record.specialistVetoesDigest === specialistVetoesDigest
      && record.taskContractSha256 === taskContractSha256
      && record.baseRevision === candidate.baseRevision
      && record.taskFilesSha256 === taskFilesSha256
      && record.dependencyEvidenceSha256 === dependencyEvidenceSha256
      && record.privateAuthoritySha256 === privateAuthoritySha256
      && record.artifactReviewsSha256 === artifactReviewsSha256
      && record.reviewerRegistrySha256 === reviewerRegistrySha256
      && record.ownerActionStateSha256 === ownerActionStateSha256,
    `${seat} Council attestation context does not bind scope, verdict, coverage, contributors, decisions, blockers, and vetoes`, "re-attest the complete canonical review context");
    const expectedAttestation = computeAttestationDigest({
      taskId,
      subjectType: "seat",
      subject: seat,
      decision: expectedSeatDecision,
      reviewerId: record.reviewerId,
      reviewerRole: record.reviewerRole,
      reviewedRevision: record.reviewedRevision,
      dossierDigest: record.dossierDigest,
      artifactSha256: null,
      evidenceReference: record.evidenceReference,
      requestedScopeClass: requestedScope.scopeClass,
      requestedActionClass: requestedScope.actionClass,
      requestedCouncilVerdict: council.verdict,
      rationale: record.rationale,
      designCoverageDigest,
      implementerIdsDigest,
      evidenceProducerIdsDigest,
      openDecisionsDigest,
      unresolvedBlockersDigest,
      specialistVetoesDigest,
      taskContractSha256,
      baseRevision: candidate.baseRevision,
      taskFilesSha256,
      dependencyEvidenceSha256,
      privateAuthoritySha256,
      artifactReviewsSha256,
      reviewerRegistrySha256,
      ownerActionStateSha256,
    });
    addGate(`${prefix}_ATTESTATION`, record.attestationDigest === expectedAttestation,
      `${seat} Council attestation is missing or tampered`, "recompute and record the canonical exact-candidate seat attestation");
  }
  addGate("COUNCIL_SEAT_UNIQUENESS", seatReviewerIds.length === COUNCIL_SEATS.length && unique(seatReviewerIds),
    "Council reviewer IDs are not unique across all five seats", "assign one distinct eligible reviewer to every seat");

  const qaReviewerIds = [reviews.qa?.reviewerId, seatVerdicts.qa?.reviewerId].filter(isNonemptyString);
  addGate("CANDIDATE_CONTRIBUTOR_IDS", implementerIds.length > 0
    && evidenceProducerIds.length > 0
    && implementerIds.every(isNonemptyString)
    && evidenceProducerIds.every(isNonemptyString)
    && unique(implementerIds)
    && unique(evidenceProducerIds),
  "candidate implementer or evidence-producer IDs are malformed or duplicated", "publish unique stable contributor IDs before attestation");
  addGate("CANDIDATE_CONTRIBUTOR_ROLES", implementerIds.every((reviewerId) => {
    const reviewer = registryById.get(reviewerId);
    return reviewer?.active === true && registryRole(reviewer) === "implementation";
  }) && evidenceProducerIds.every((reviewerId) => {
    const reviewer = registryById.get(reviewerId);
    return reviewer?.active === true && registryRole(reviewer) === "evidence-producer";
  }),
  "candidate contributors are unknown, inactive, or assigned to the wrong registry role", "bind implementers and evidence producers to their stable registry roles");
  addGate("QA_INDEPENDENCE_IMPLEMENTER", qaReviewerIds.every((reviewerId) => !implementerIds.includes(reviewerId)),
    "a QA reviewer is also a candidate implementer", "assign independent QA reviewers who did not implement the candidate");
  addGate("QA_INDEPENDENCE_EVIDENCE", qaReviewerIds.every((reviewerId) => !evidenceProducerIds.includes(reviewerId)),
    "a QA reviewer produced the evidence it would certify", "assign independent QA reviewers who did not produce the test evidence");

  const dependencyIds = dependencyRequirements.map((entry) => typeof entry === "string" ? entry : entry?.dependencyId);
  const dependencyEvidenceIds = dependencyEvidence.map((entry) => entry?.dependencyId);
  addGate("DEPENDENCY_REQUIREMENTS", unique(dependencyIds)
    && dependencyIds.every(isNonemptyString)
    && dependencyEvidenceIds.every((id) => dependencyIds.includes(id)),
  "dependency requirements or evidence contain missing, duplicate, or unknown IDs", "use the canonical dependency set and no unrelated evidence");
  for (const dependencyId of dependencyIds) {
    const matches = dependencyEvidence.filter((entry) => entry?.dependencyId === dependencyId);
    addGate(`DEPENDENCY_${String(dependencyId).replace(/[^A-Za-z0-9]/g, "_").toUpperCase()}`,
      matches.length === 1 && matches[0]?.result === "pass" && isOpaqueReference(matches[0]?.evidenceReference),
      `dependency ${dependencyId} lacks one passing evidence record`, "record one passing opaque dependency-entry reference");
  }

  const actionRequirementIds = actionRequirements.map((entry) => entry?.actionId);
  const expectedActionIds = canonicalOwnerActionIdsForTask({
    taskId,
    milestone: source.milestone,
  });
  if (isDedicatedDeliveryTransitionScopeAction({
    taskId,
    stageId: options.deliveryTransitionStageId,
    scopeClass: requestedScope.scopeClass,
    actionClass: requestedScope.actionClass,
  }) && !expectedActionIds.includes("P0-OA-002")) {
    expectedActionIds.push("P0-OA-002");
    expectedActionIds.sort();
  }
  const canonicalActionRequirements = expectedActionIds.map((actionId) => ({
    actionId,
    ...OWNER_ACTION_REQUIREMENT_CATALOG[actionId],
  }));
  const dueActionRequirements = canonicalActionRequirements.filter((requirement) => (
    asArray(requirement.requiredForScopeClasses).includes(requestedScope.scopeClass)
      && asArray(requirement.requiredForActionClasses).includes(requestedScope.actionClass)
  ));
  const dueActionIds = dueActionRequirements.map((requirement) => requirement.actionId);
  addGate("OWNER_ACTION_REQUIREMENTS", Array.isArray(source.ownerActionRequirements)
    && unique(actionRequirementIds)
    && sameStringSet(actionRequirementIds, expectedActionIds)
    && actionRequirements.every((entry) => isNonemptyString(entry?.actionId)
      && Boolean(OWNER_ACTION_REQUIREMENT_CATALOG[entry.actionId])
      && sameStringSet(entry.requiredForScopeClasses, OWNER_ACTION_REQUIREMENT_CATALOG[entry.actionId]?.requiredForScopeClasses)
      && sameStringSet(entry.requiredForActionClasses, OWNER_ACTION_REQUIREMENT_CATALOG[entry.actionId]?.requiredForActionClasses)
      && (entry?.accountableHumanId === null || isNonemptyString(entry?.accountableHumanId))
      && entry?.accountableHumanRole === OWNER_ACTION_REQUIREMENT_CATALOG[entry.actionId]?.accountableHumanRole),
  "owner-action requirements are malformed, non-canonical, incomplete, or duplicated", "rebuild the exact task-and-milestone owner-action requirements from the immutable catalog");
  addGate("OWNER_ACTION_SCOPE_COVERAGE", requestedScope.scopeClass === "local-synthetic"
    || dueActionIds.includes("P0-OA-001"),
  "the requested private or release scope-and-action pair lacks the global P0-OA-001 gate", "map P0-OA-001 to every canonical private and release action before evaluating it");
  addGate("OWNER_ACTION_RECORD_SET", Array.isArray(source.ownerActions)
    && unique(actionRecords.map((entry) => entry?.actionId))
    && actionRecords.every((entry) => isNonemptyString(entry?.actionId)
      && expectedActionIds.includes(entry.actionId)
      && sameStringSet(entry.requiredForScopeClasses, OWNER_ACTION_REQUIREMENT_CATALOG[entry.actionId]?.requiredForScopeClasses)
      && sameStringSet(entry.requiredForActionClasses, OWNER_ACTION_REQUIREMENT_CATALOG[entry.actionId]?.requiredForActionClasses)),
  "owner-action evidence contains malformed, duplicated, or unknown records", "retain one structured record for each known action only");
  for (const actionId of dueActionIds) {
    const matches = actionRecords.filter((record) => record?.actionId === actionId);
    const record = matches[0];
    const requirement = actionRequirements.find((entry) => entry?.actionId === actionId);
    const canonicalRequirement = OWNER_ACTION_REQUIREMENT_CATALOG[actionId];
    const verifier = registryById.get(record?.verifierId);
    const role = registryRole(verifier);
    const accountableHuman = registryById.get(record?.accountableHumanId);
    const accountableHumanRole = registryRole(accountableHuman);
    const verifiedAt = parseInstant(record?.verifiedAt);
    const actionGateCode = `OWNER_ACTION_${String(actionId).replace(/[^A-Za-z0-9]/g, "_").toUpperCase()}`;
    const humanGatePassed = requirement?.accountableHumanId === record?.accountableHumanId
      && requirement?.accountableHumanRole === record?.accountableHumanRole
      && isNonemptyString(record?.accountableHumanId)
      && record?.accountableHumanRole === "owner-authority"
      && Boolean(accountableHuman)
      && accountableHuman?.active === true
      && accountableHuman?.identityClass === "human"
      && accountableHumanRole === "owner-authority"
      && isOpaqueReference(record?.ownerAttestationReference);
    const verifierGatePassed = Boolean(verifier)
      && verifier?.active === true
      && record?.verifierRole === role
      && ["project", "qa"].includes(role);
    const actionGatePassed =
      matches.length === 1
      && sameStringSet(record?.requiredForScopeClasses, canonicalRequirement?.requiredForScopeClasses)
      && sameStringSet(record?.requiredForActionClasses, canonicalRequirement?.requiredForActionClasses)
      && record?.status === "complete"
      && record?.result === "pass"
      && humanGatePassed
      && verifierGatePassed
      && verifiedAt !== null
      && Number.isFinite(now)
      && verifiedAt <= now
      && isOpaqueReference(record?.evidenceReference)
      && record?.candidateRevision === candidate.revision
      && record?.dossierDigest === candidate.dossierDigest;
    addGate(actionGateCode, actionGatePassed,
      `due owner action ${actionId} lacks complete candidate-bound passing evidence`, "complete and verify the due action with an opaque evidence reference");
    addGate(`${actionGateCode}_HUMAN`, humanGatePassed,
      `due owner action ${actionId} lacks an active accountable human owner`, "obtain an owner-authority human attestation and keep only its opaque reference");
    addGate(`${actionGateCode}_VERIFIER`, verifierGatePassed,
      `due owner action ${actionId} uses an ineligible evidence verifier`, "use an active Project or QA evidence verifier independent of the human owner");
  }

  const privateAuthorityRequired = ["private-execution", "release"].includes(requestedScope.scopeClass);
  if (privateAuthorityRequired) {
    const authority = asObject(source.privateAuthority);
    const verifier = registryById.get(authority.verifierId);
    const role = registryRole(verifier);
    const accountableHuman = registryById.get(authority.accountableHumanId);
    const accountableHumanRole = registryRole(accountableHuman);
    const ownerActionRecord = actionRecords.find((record) => record?.actionId === "P0-OA-001");
    const windowStart = parseInstant(authority.windowStart);
    const windowEnd = parseInstant(authority.windowEnd);
    addGate("PRIVATE_AUTHORITY_STRUCTURED", isObject(source.privateAuthority),
      "private authority is missing or not structured", "supply the public-safe structured authority record");
    addGate("PRIVATE_AUTHORITY_ID", AUTHORITY_ID.test(authority.authorityId ?? ""),
      "private authority lacks an opaque P0 authority ID", "use a P0-AUTH-* opaque authority identifier");
    addGate("PRIVATE_AUTHORITY_SCOPE", authority.taskId === taskId
      && authority.scopeClass === requestedScope.scopeClass
      && authority.allowedActionClass === requestedScope.actionClass,
    "private authority does not match the task, scope, or action", "obtain authority for this exact task and requested action");
    addGate("PRIVATE_AUTHORITY_VERIFIER", Boolean(verifier)
      && verifier?.active === true
      && authority.verifierRole === role
      && ["project", "qa", "architecture"].includes(role),
    "private authority verifier is unknown or role-mismatched", "use an active role-bound verifier from the registry");
    addGate("PRIVATE_AUTHORITY_HUMAN", isNonemptyString(authority.accountableHumanId)
      && authority.accountableHumanRole === "owner-authority"
      && Boolean(accountableHuman)
      && accountableHuman?.active === true
      && accountableHuman?.identityClass === "human"
      && accountableHumanRole === "owner-authority"
      && isOpaqueReference(authority.ownerAttestationReference),
    "private authority lacks an active accountable human owner", "obtain an owner-authority human attestation and retain only its opaque reference");
    addGate("PRIVATE_AUTHORITY_WINDOW", windowStart !== null
      && windowEnd !== null
      && Number.isFinite(now)
      && windowStart <= now
      && now <= windowEnd
      && windowStart < windowEnd,
    "private authority is expired, not yet valid, or has an invalid window", "obtain a current bounded authority window");
    addGate("PRIVATE_AUTHORITY_RESULT", authority.result === "pass" && authority.ownerActionId === "P0-OA-001",
      "private authority is not passing or is detached from P0-OA-001", "record a passing result bound to P0-OA-001");
    addGate("PRIVATE_AUTHORITY_CUSTODY", isOpaqueReference(authority.evidenceReference),
      "private authority lacks an opaque custody reference", "record the approved opaque evidence reference only");
    addGate("PRIVATE_AUTHORITY_CANDIDATE", authority.candidateRevision === candidate.revision
      && authority.dossierDigest === candidate.dossierDigest,
    "private authority does not bind the exact candidate", "bind authority to the candidate revision and dossier digest");
    addGate("PRIVATE_AUTHORITY_ACTION_RECORD", dueActionIds.includes("P0-OA-001")
      && ownerActionRecord?.result === "pass"
      && ownerActionRecord?.status === "complete"
      && ownerActionRecord?.accountableHumanId === authority.accountableHumanId
      && ownerActionRecord?.accountableHumanRole === authority.accountableHumanRole
      && ownerActionRecord?.ownerAttestationReference === authority.ownerAttestationReference,
    "private authority lacks a matching completed owner-action record", "complete P0-OA-001 for the requested private scope");
  }

  if (["approval", "activation"].includes(phase)) {
    const approval = asObject(source.approvalRecord);
    addGate("APPROVAL_RECORD_SOURCE_SHAPE", sameStringSet(Object.keys(approval), [
      "candidateRevision",
      "dossierDigest",
      "approvalsVerified",
    ]),
    "the source approval payload contains missing or publication-owned fields", "retain only candidateRevision, dossierDigest, and approvalsVerified in the source record");
    addGate("APPROVAL_RECORD_BINDING", approval.candidateRevision === candidate.revision
      && approval.dossierDigest === candidate.dossierDigest
      && approval.approvalsVerified === true,
    "the approval record does not bind the candidate and verified attestations", "bind the later approval record to the exact candidate evidence");
    addGate("APPROVAL_PUBLICATION_REVISION", FULL_REVISION.test(approvalPublication.revision ?? "")
      && approvalPublication.revision !== candidate.revision,
    "trusted approval publication lacks a distinct full revision", "inject the later containing commit revision from the trusted Git adapter");
    addGate("APPROVAL_PUBLICATION_PATH", approvalPublication.registryPath === APPROVAL_REGISTRY_PATH,
      "approval publication does not bind the canonical registry path", `verify ${APPROVAL_REGISTRY_PATH} at the publication revision`);
    addGate("APPROVAL_PUBLICATION_HASH", SHA256.test(approvalPublication.registrySha256 ?? ""),
      "approval publication lacks a valid registry SHA-256", "hash the exact canonical registry bytes at the publication revision");
    addGate("APPROVAL_PUBLICATION_BYTES", approvalPublication.registryBytesVerified === true,
      "approval registry bytes at the publication revision are not verified", "read and hash the canonical registry at the publication revision");
    addGate("APPROVAL_PUBLICATION_TASK_RECORD", approvalPublication.taskId === taskId
      && SHA256.test(approvalPublication.publishedTaskApprovalSha256 ?? "")
      && SHA256.test(approvalPublication.currentTaskApprovalSha256 ?? "")
      && approvalPublication.publishedTaskApprovalSha256 === approvalPublication.currentTaskApprovalSha256
      && approvalPublication.taskApprovalBytesVerified === true,
    "the canonical per-task approval record differs from its published bytes", "compare the current and published canonical task-approval record without requiring full-registry equality");
    addGate("APPROVAL_PUBLICATION_REVIEWER_REGISTRY", SHA256.test(approvalPublication.publishedReviewerRegistrySha256 ?? "")
      && approvalPublication.publishedReviewerRegistrySha256 === approvalPublication.currentReviewerRegistrySha256
      && approvalPublication.currentReviewerRegistrySha256 === reviewerRegistrySha256
      && approvalPublication.reviewerRegistryBytesVerified === true,
    "the reviewer registry differs from its approval-time authorization context", "restore the exact approval-time reviewer registry or obtain fresh task approval");
    addGate("APPROVAL_PUBLICATION_OWNER_ACTION_STATE", SHA256.test(approvalPublication.publishedOwnerActionStateSha256 ?? "")
      && approvalPublication.publishedOwnerActionStateSha256 === approvalPublication.currentOwnerActionStateSha256
      && approvalPublication.currentOwnerActionStateSha256 === ownerActionStateSha256
      && approvalPublication.ownerActionStateBytesVerified === true,
    "task-relevant owner-action evidence differs from its approval-time context", "restore the exact approval-time task action state or obtain fresh task approval");
    addGate("APPROVAL_PUBLICATION_TASK_CONTRACT", SHA256.test(approvalPublication.publishedTaskContractSha256 ?? "")
      && approvalPublication.publishedTaskContractSha256 === approvalPublication.currentTaskContractSha256
      && approvalPublication.currentTaskContractSha256 === taskContractSha256
      && approvalPublication.taskContractBytesVerified === true,
    "the canonical task contract differs from its approval-time context", "restore the approval-time task contract or obtain fresh candidate and task approval");
    addGate("APPROVAL_PUBLICATION_MAIN", approvalPublication.publishedOnFetchedMain === true,
      "the approval publication is not on fetched origin/main", "merge the approval registry normally and refresh origin/main");
    addGate("APPROVAL_PUBLICATION_ANCESTRY", approvalPublication.candidateAncestorOfApproval === true,
      "the candidate is not an ancestor of the approval publication", "publish the approval only in a later commit containing the candidate history");
  }

  if (phase === "activation") {
    const activation = asObject(options.activation);
    addGate("ACTIVATION_FETCH", activation.fetchSucceeded === true,
      "origin/main was not freshly fetched", "fetch origin before runtime start verification");
    addGate("ACTIVATION_CLEAN", activation.worktreeClean === true,
      "the activation checkout is dirty", "use a clean checkout with no staged, unstaged, or untracked files");
    addGate("ACTIVATION_BRANCH", isNonemptyString(activation.branch)
      && activation.detached !== true
      && activation.upstream === "origin/main",
    "the activation checkout is detached or does not track origin/main", "use a non-detached branch whose upstream is origin/main");
    addGate("ACTIVATION_EXACT_MAIN", FULL_REVISION.test(activation.headRevision ?? "")
      && activation.headRevision === activation.originMainRevision,
    "HEAD does not equal freshly fetched origin/main", "update to the exact fetched origin/main revision");
    addGate("ACTIVATION_APPROVAL_REACHABLE", activation.approvalRecordReachableFromHead === true
      && activation.candidateReachableFromHead === true
      && activation.approvalPublicationRevision === approvalPublication.revision
      && activation.candidateRevision === candidate.revision,
    "candidate or approval publication is not reachable from activation HEAD", "activate only from main containing both publications");
    addGate("ACTIVATION_SOURCE", activation.externalSyncSourceRevision === activation.headRevision,
      "external synchronization is not sourced from exact activation HEAD", "bind synchronization to the verified clean main revision");
    addGate("ACTIVATION_TASK_FILES", FULL_REVISION.test(activation.taskFilesVerifiedAtRevision ?? "")
      && activation.taskFilesVerifiedAtRevision === activation.headRevision,
    "runtime task-file verification is not bound to exact activation HEAD", "rehash the complete task-file manifest at exact fetched origin/main immediately before activation");
    addGate("ACTIVATION_RUNTIME_REQUEST", activation.runtimeRequestedScopeClass === requestedScope.scopeClass
      && activation.runtimeRequestedActionClass === requestedScope.actionClass,
    "the runtime request does not exactly match the approved scope and action", "invoke the guarded execution callback with the exact approved scope/action pair");
  }

  if (phase === "candidate") {
    addGate("CANDIDATE_PHASE_NONPERMITTING", false,
      "candidate review cannot itself authorize execution", "publish a later approval record before deriving permission");
  }

  const failedGates = gateResults.filter((gate) => !gate.passed);
  const executionAllowed = failedGates.length === 0;
  const executionDecision = executionAllowed
    ? DECISION_FOR_SCOPE[requestedScope.scopeClass]
    : council.verdict === "historical-non-authorizing"
      ? "Historical non-authorizing"
      : "Hold";
  const firstCorrectiveAction = failedGates[0]?.reason.match(/; action: (.+)\.$/)?.[1] ?? null;
  const nextAction = executionAllowed
    ? phase === "activation"
      ? `Proceed only with ${requestedScope.scopeClass}/${requestedScope.actionClass} within the approved bounds.`
      : "Run exact-main activation verification before starting the requested action."
    : firstCorrectiveAction;
  const stableCandidatePublication = Object.fromEntries(
    Object.entries(candidatePublication).filter(([key]) => ![
      "currentTaskFilesRevision",
      "currentDescendantDeltaPaths",
    ].includes(key)),
  );

  return {
    artifactReadiness,
    executionDecision,
    executionAllowed,
    nextAction,
    blockers: failedGates.map((gate) => ({ code: gate.code, reason: gate.reason })),
    gateResults,
    normalizedEvidence: {
      schemaVersion: source.schemaVersion ?? null,
      taskId,
      milestone: source.milestone ?? null,
      executionContractPairCount,
      historicalTaskNonAuthorizing: isHistoricalNonAuthorizingTaskId(taskId),
      evaluationPhase: phase,
      requestedScope: {
        scopeClass: requestedScope.scopeClass ?? null,
        actionClass: requestedScope.actionClass ?? null,
      },
      effectiveArtifactStates,
      candidateRevision: candidate.revision ?? null,
      candidateBaseRevision: candidate.baseRevision ?? null,
      candidatePublicationRevision: candidatePublication.revision ?? null,
      candidateDiffTaskFilesSha256: candidatePublication.candidateDiffTaskFilesSha256 ?? null,
      dossierDigest: candidate.dossierDigest ?? null,
      approvalPublicationRevision: options.approvalPublication?.revision ?? null,
      approvalRegistryPath: options.approvalPublication?.registryPath ?? null,
      approvalRegistrySha256: options.approvalPublication?.registrySha256 ?? null,
      taskApprovalSha256: options.approvalPublication?.publishedTaskApprovalSha256 ?? null,
      taskContractSha256,
      taskFilesSha256,
      publishedTaskFilesSha256: options.candidatePublication?.publishedTaskFilesSha256 ?? null,
      currentTaskFilesSha256: options.candidatePublication?.currentTaskFilesSha256 ?? null,
      publishedTaskFileContentClassesVerified:
        options.candidatePublication?.publishedTaskFileContentClassesVerified ?? null,
      currentTaskFileContentClassesVerified:
        options.candidatePublication?.currentTaskFileContentClassesVerified ?? null,
      dependencyEvidenceSha256,
      privateAuthoritySha256,
      artifactReviewsSha256,
      reviewerRegistrySha256,
      ownerActionStateSha256,
      trustedPublicationFingerprint: `sha256:${sha256(canonicalJson({
        candidatePublication: stableCandidatePublication,
        approvalPublication,
        activation: phase === "activation" ? asObject(options.activation) : null,
      }))}`,
      dueOwnerActionIds: [...dueActionIds].sort(),
      privateAuthorityRequired,
      sourceFingerprint: `sha256:${sha256(canonicalJson(source))}`,
    },
  };
}

function targetProtectionReasons(target) {
  const reasons = [];
  if (target?.exists !== false && target?.artifactState !== "draft") reasons.push("non-draft artifact marker");
  if (target?.artifactReviewDecision && target.artifactReviewDecision !== "hold") reasons.push("non-Hold artifact review");
  if (target?.candidateBinding) reasons.push("candidate binding");
  if (asArray(target?.seatVerdicts).some((verdict) => verdict !== "hold")) reasons.push("non-Hold Council seat");
  if (asArray(target?.attestationBindings).length > 0) reasons.push("attestation binding");
  if (asArray(target?.evidenceBindings).length > 0) reasons.push("evidence binding");
  return reasons;
}

/** Canonical mutation-protection state, deliberately independent of file bytes. */
export function refreshProtectionPayload(target) {
  const source = asObject(target);
  return {
    exists: source.exists !== false,
    artifactState: source.artifactState ?? null,
    artifactReviewDecision: source.artifactReviewDecision ?? null,
    candidateBinding: source.candidateBinding ?? null,
    seatVerdicts: asArray(source.seatVerdicts),
    attestationBindings: asArray(source.attestationBindings),
    evidenceBindings: asArray(source.evidenceBindings),
  };
}

export function computeRefreshProtectionFingerprint(target) {
  return `sha256:${sha256(canonicalJson(refreshProtectionPayload(target)))}`;
}

/**
 * Pure protected-refresh preflight. `sourceGuardInputs` are read-only snapshots
 * that may influence generated output; they are rechecked but never promoted or
 * restored by the transaction.
 */
export function planProtectedRefresh(targets, intendedFiles, sourceGuardInputs = []) {
  const originals = asArray(targets);
  const intended = asArray(intendedFiles);
  const guards = asArray(sourceGuardInputs);
  const originalPaths = originals.map((target) => target?.path);
  const intendedPaths = intended.map((target) => target?.path);
  const guardPaths = guards.map((guard) => guard?.path);
  const blockers = [];
  if (!unique(originalPaths) || !unique(intendedPaths)) {
    blockers.push({ code: "REFRESH_DUPLICATE_PATH", reason: "Refresh input contains a duplicate path." });
  }
  if (!unique(guardPaths)) {
    blockers.push({ code: "REFRESH_DUPLICATE_GUARD", reason: "Refresh source guards contain a duplicate path." });
  }
  if (guardPaths.some((guardPath) => intendedPaths.includes(guardPath))) {
    blockers.push({ code: "REFRESH_GUARD_TARGET_OVERLAP", reason: "A read-only source guard is also a refresh target." });
  }
  const sourceGuards = [];
  for (const guard of guards) {
    const safeRelativePath = isNonemptyString(guard?.path)
      && !path.posix.isAbsolute(guard.path)
      && !guard.path.split("/").includes("..")
      && path.posix.normalize(guard.path) === guard.path;
    const exists = guard?.exists !== false;
    if (!safeRelativePath || (exists && typeof guard?.content !== "string")) {
      blockers.push({ code: "REFRESH_SOURCE_GUARD", reason: "Refresh source guard path or content snapshot is invalid." });
      continue;
    }
    sourceGuards.push({
      path: guard.path,
      originalSha256: exists ? sha256(guard.content) : null,
      originalProtectionFingerprint: hasOwn(guard, "protection")
        ? computeRefreshProtectionFingerprint(guard.protection)
        : null,
    });
  }
  const originalByPath = new Map(originals.map((target) => [target?.path, target]));
  const changes = [];
  for (const next of intended) {
    const original = originalByPath.get(next?.path) ?? { path: next?.path, exists: false, content: null };
    const basename = isNonemptyString(next?.path) ? path.posix.basename(next.path) : "";
    const safeRelativePath = isNonemptyString(next?.path)
      && !path.posix.isAbsolute(next.path)
      && !next.path.split("/").includes("..")
      && path.posix.normalize(next.path) === next.path;
    if (!safeRelativePath || !basename.startsWith("P0-")) {
      blockers.push({ code: "REFRESH_NAME", reason: "Refresh target basename is not P0-prefixed." });
      continue;
    }
    if (typeof next?.content !== "string") {
      blockers.push({ code: "REFRESH_CONTENT", reason: "Refresh target content is not a string." });
      continue;
    }
    if (original.content === next.content) continue;
    const protectionReasons = targetProtectionReasons(original);
    if (protectionReasons.length > 0) {
      blockers.push({
        code: "REFRESH_PROTECTED",
        path: next.path,
        reason: `Protected target would change: ${protectionReasons.join(", ")}.`,
      });
    }
    changes.push({
      path: next.path,
      originalContent: original.exists === false ? null : original.content,
      originalSha256: original.exists === false ? null : sha256(original.content ?? ""),
      originalProtectionFingerprint: computeRefreshProtectionFingerprint(original),
      intendedContent: next.content,
      intendedSha256: sha256(next.content),
    });
  }
  return {
    allowed: blockers.length === 0,
    blockers,
    changes,
    sourceGuards,
    fingerprint: `sha256:${sha256(canonicalJson({ changes, sourceGuards, blockers }))}`,
  };
}

/**
 * Execute an already approved refresh plan through an injected adapter. All
 * writes are staged and verified before promotion; source guards are checked
 * again after promotion to bound drift during the promotion window. Once any
 * promotion begins, failures never auto-restore or overwrite targets: current
 * bytes and the prewritten recovery journal remain for inspected recovery.
 */
export async function executeRefreshTransaction(plan, adapter) {
  if (!plan?.allowed) return { applied: false, restored: true, code: "REFRESH_PREFLIGHT_DENIED" };
  const changes = asArray(plan?.changes);
  const sourceGuards = asArray(plan?.sourceGuards);
  const staged = [];
  const verifyOriginal = async (change) => {
    if (typeof adapter?.readProtection !== "function") throw new Error("REFRESH_PROTECTION_ADAPTER");
    const current = await adapter.read(change.path);
    const currentHash = current === null ? null : sha256(current);
    if (currentHash !== change.originalSha256) throw new Error("REFRESH_SOURCE_DRIFT");
    const currentProtection = await adapter.readProtection(change.path);
    if (computeRefreshProtectionFingerprint(currentProtection) !== change.originalProtectionFingerprint
      || targetProtectionReasons(currentProtection).length > 0) {
      throw new Error("REFRESH_PROTECTION_DRIFT");
    }
  };
  const verifyOriginals = async () => {
    for (const change of changes) {
      await verifyOriginal(change);
    }
  };
  const verifySourceGuards = async () => {
    for (const guard of sourceGuards) {
      const current = await adapter.read(guard.path);
      const currentHash = current === null ? null : sha256(current);
      if (currentHash !== guard.originalSha256) throw new Error("REFRESH_SOURCE_GUARD_DRIFT");
      if (guard.originalProtectionFingerprint !== null) {
        if (typeof adapter?.readProtection !== "function") throw new Error("REFRESH_PROTECTION_ADAPTER");
        const currentProtection = await adapter.readProtection(guard.path);
        if (computeRefreshProtectionFingerprint(currentProtection) !== guard.originalProtectionFingerprint) {
          throw new Error("REFRESH_SOURCE_GUARD_DRIFT");
        }
      }
    }
    return true;
  };
  const sourceGuardsIntact = async () => {
    try {
      await verifySourceGuards();
      return true;
    } catch {
      return false;
    }
  };
  const cleanup = async () => {
    let cleaned = true;
    for (const change of changes) {
      try { await adapter.discard(change.path); } catch { cleaned = false; }
    }
    return cleaned;
  };
  const recoveryJournal = {
    schemaVersion: "1.0.0",
    planFingerprint: plan?.fingerprint ?? null,
    changes: changes.map((change) => ({
      path: change.path,
      originalContent: change.originalContent,
      originalSha256: change.originalSha256,
      intendedContent: change.intendedContent,
      intendedSha256: change.intendedSha256,
      originalProtectionFingerprint: change.originalProtectionFingerprint,
    })),
    sourceGuards,
  };
  const recoveryJournalFingerprint = `sha256:${sha256(canonicalJson(recoveryJournal))}`;
  const recoveryJournalIntact = async () => {
    if (typeof adapter?.readRecoveryJournal !== "function") return false;
    try {
      const observed = await adapter.readRecoveryJournal();
      return canonicalJson(observed) === canonicalJson(recoveryJournal);
    } catch {
      return false;
    }
  };

  let promotionStarted = false;
  let recoveryJournalWritten = false;
  try {
    await verifyOriginals();
    await verifySourceGuards();
    for (const change of changes) {
      await adapter.stage(change.path, change.intendedContent);
      staged.push(change.path);
      const stagedContent = await adapter.readStaged(change.path);
      if (sha256(stagedContent ?? "") !== change.intendedSha256) throw new Error("REFRESH_STAGE_HASH");
    }
    // Recheck every original byte hash and protection fact after all staging and
    // immediately before the first promotion. Any concurrent drift aborts with
    // no planned output promoted and without overwriting the concurrent state.
    await verifyOriginals();
    await verifySourceGuards();
    if (changes.length > 0) {
      if (typeof adapter?.writeRecoveryJournal !== "function"
        || typeof adapter?.readRecoveryJournal !== "function"
        || typeof adapter?.clearRecoveryJournal !== "function") {
        throw new Error("REFRESH_RECOVERY_ADAPTER");
      }
      recoveryJournalWritten = await adapter.writeRecoveryJournal(recoveryJournal) === true;
      if (!recoveryJournalWritten || !await recoveryJournalIntact()) throw new Error("REFRESH_RECOVERY_JOURNAL");
    }
    for (const change of changes) {
      // Bound inter-target drift by checking this still-unpromoted target and
      // every read-only input immediately before its own promotion. A writer
      // can still race the final read-to-promote gap; no OS-level atomicity is
      // claimed, and any observable post-promotion mismatch requires recovery.
      await verifyOriginal(change);
      await verifySourceGuards();
      promotionStarted = true;
      await adapter.promote(change.path);
    }
    for (const change of changes) {
      const current = await adapter.read(change.path);
      if (sha256(current ?? "") !== change.intendedSha256) throw new Error("REFRESH_PROMOTION_HASH");
    }
    // Promotion is not assumed to be atomic with reads of independent source
    // files. Recheck every read-only input after the final promotion and before
    // declaring success; a detected race stops authorization and retains the
    // recovery journal without overwriting any promoted or concurrent bytes.
    const finalSourceGuardsIntact = await verifySourceGuards();
    if (!await cleanup()) throw new Error("REFRESH_CLEANUP");
    if (recoveryJournalWritten && await adapter.clearRecoveryJournal() !== true) {
      throw new Error("REFRESH_RECOVERY_JOURNAL_CLEAR");
    }
    if (recoveryJournalWritten && await adapter.readRecoveryJournal() !== null) {
      throw new Error("REFRESH_RECOVERY_JOURNAL_CLEAR");
    }
    return {
      applied: true,
      restored: false,
      sourceGuardsIntact: finalSourceGuardsIntact,
      recoveryRequired: false,
      recoveryJournalFingerprint,
      code: "REFRESH_APPLIED",
      changedPaths: staged,
    };
  } catch (error) {
    let restored = false;
    let prePromotionJournalCleared = !recoveryJournalWritten;
    if (!promotionStarted) {
      restored = await cleanup();
      for (const change of changes) {
        try {
          const current = await adapter.read(change.path);
          const currentHash = current === null ? null : sha256(current);
          if (currentHash !== change.originalSha256) restored = false;
          const currentProtection = await adapter.readProtection(change.path);
          if (computeRefreshProtectionFingerprint(currentProtection) !== change.originalProtectionFingerprint) restored = false;
        } catch { restored = false; }
      }
      if (recoveryJournalWritten) {
        try {
          prePromotionJournalCleared = await adapter.clearRecoveryJournal() === true
            && await adapter.readRecoveryJournal() === null;
        } catch {
          prePromotionJournalCleared = false;
        }
        if (!prePromotionJournalCleared) restored = false;
      }
    }
    const failureCode = error?.message?.startsWith("REFRESH_") ? error.message : "REFRESH_HANDLED_FAILURE";
    const recoveryRequired = promotionStarted || !prePromotionJournalCleared;
    const recoveryJournalRetained = recoveryRequired && recoveryJournalWritten && await recoveryJournalIntact();
    const retainedStagedPaths = [];
    if (recoveryRequired) {
      for (const change of changes) {
        try {
          const stagedContent = await adapter.readStaged(change.path);
          if (sha256(stagedContent ?? "") === change.intendedSha256) retainedStagedPaths.push(change.path);
        } catch {
          // The full verified journal remains the primary recovery source when
          // an adapter's promotion operation consumed a staged file.
        }
      }
    }
    const stagedEvidenceRetained = recoveryRequired && retainedStagedPaths.length === staged.length;
    return {
      applied: false,
      restored,
      sourceGuardsIntact: await sourceGuardsIntact(),
      code: recoveryRequired ? "REFRESH_RECOVERY_REQUIRED" : failureCode,
      causeCode: failureCode,
      rollbackAttempted: false,
      recoveryRequired,
      recoveryJournalRetained,
      recoveryJournalFingerprint,
      recoveryEvidenceRetained: recoveryJournalRetained || stagedEvidenceRetained,
      stagedEvidenceRetained,
      retainedStagedPaths,
      changedPaths: [],
    };
  }
}
