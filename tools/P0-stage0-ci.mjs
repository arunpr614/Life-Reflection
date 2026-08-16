#!/usr/bin/env node

import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  appendFileSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BOUNDED_AUTHORITY_SOURCE_PATHS as SCANNER_BOUNDED_AUTHORITY_SOURCE_PATHS,
} from "./P0-bounded-authority.mjs";
import { P0_GATE_A_PROPOSAL_PROJECTION_PATHS } from "./P0-staged-actions.mjs";

export const STAGE0_CI_SCHEMA_VERSION = "1.0.0";
export const STAGE0_WORKFLOW_GUARD_PATH = ".github/workflows/P0-stage0-workflow-guard.yml";
export const STAGE0_PROTECTED_WORKFLOW_PATH = ".github/workflows/prototype-syntax.yml";
export const STAGE0_CONTROL_INTEGRITY_PATH = "docs/council/execution/P0-STAGE0-CONTROL-INTEGRITY.json";
export const STAGE0_STAGE_APPROVAL_REGISTRY_PATH =
  "docs/council/execution/P0-R0-STAGE-APPROVAL-REGISTRY.json";
export const STAGE0_PROTECTED_WORKFLOW_SHA256 = "b30ab0281ab56742136c6b2cd53e7d2a85657ffb8d214dce2e5279c0dbeec062";
const STAGE0_WORKFLOW_GUARD_SHA256 = "355b856d69e5f78aaf6f58b23a1d848690b2ee8b2ee031e321ce047865831445";
const MODULE_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function compareCodeUnits(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export const CONTROL_TOOL_PATHS = Object.freeze([
  "tools/P0-append-only-trust.mjs",
  "tools/P0-bounded-authority.mjs",
  "tools/P0-build-task-readiness-input.mjs",
  "tools/P0-content-safety.mjs",
  "tools/P0-control-review-trust.mjs",
  "tools/P0-delivery-transition.mjs",
  "tools/P0-exact-main.mjs",
  "tools/P0-generate-task-artifacts.mjs",
  "tools/P0-github-projection-model.mjs",
  "tools/P0-json-trust.mjs",
  "tools/P0-readiness-gates.mjs",
  "tools/P0-running-log-trust.mjs",
  "tools/P0-stage-runner.mjs",
  "tools/P0-stage0-ci.mjs",
  "tools/P0-staged-actions.mjs",
  "tools/P0-successor-control-review.mjs",
  "tools/P0-test-control-review-trust.mjs",
  "tools/P0-test-delivery-transition.mjs",
  "tools/P0-test-execution-controls.mjs",
  "tools/P0-test-r1-r10-freeze.mjs",
  "tools/P0-test-running-log-trust.mjs",
  "tools/P0-test-stage-runner.mjs",
  "tools/P0-test-staged-actions.mjs",
  "tools/P0-test-successor-control-review.mjs",
  "tools/P0-test-wiki-trust.mjs",
  "tools/P0-validate-execution-controls.mjs",
  "tools/P0-verify-execution-start.mjs",
  "tools/P0-verify-generated-tracking.mjs",
  "tools/P0-verify-r1-r10-freeze.mjs",
  "tools/P0-wiki-trust.mjs",
  "tools/build-wiki.mjs",
  "tools/build_phase1_release_plan.mjs",
  "tools/generate_phase1_roadmap_manifest.mjs",
  "tools/sync_phase1_github.mjs",
]);

// This is an independent, closed copy of the semantic scanner's source
// boundary. The CI contract compares the two exact sets before it trusts either
// one, and the base-owned workflow carries the same immutable set.
export const CONTROL_AUTHORITY_SOURCE_PATHS = Object.freeze([
  "AGENTS.md",
  "README.md",
  "docs/INDEX.md",
  "docs/council/PHASE1-COUNCIL-DECISION-RECORD.md",
  "docs/council/PRODUCT-COUNCIL-CHARTER.md",
  "docs/council/PRODUCT-COUNCIL.md",
  "docs/council/agents/P0-QA-LEAD.md",
  "docs/council/execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md",
  "docs/council/execution/P0-PHASE1-EXECUTION-COUNCIL-CHARTER.md",
  "docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md",
  "docs/council/execution/P0-PHASE1-EXECUTION-DECISIONS.md",
  "docs/council/execution/releases/P0-P0-R0-STAGE0-STATE-CONTRACT.md",
  "docs/product/PRODUCT-REQUIREMENTS.md",
  "docs/project/PHASE1-GITHUB-PROJECT-SYNC.md",
  "docs/project/PHASE1-RELEASE-PLAN.md",
  "docs/project/PROJECT-TRACKER.md",
  "tools/generate_phase1_roadmap_manifest.mjs",
]);

export const CONTROL_INTEGRITY_PATHS = Object.freeze([
  ...CONTROL_TOOL_PATHS,
  ...CONTROL_AUTHORITY_SOURCE_PATHS,
  STAGE0_PROTECTED_WORKFLOW_PATH,
  "prototypes/calendar-ui/app-v10.js",
  "prototypes/calendar-ui/package.json",
  "prototypes/calendar-ui/serve.mjs",
].filter((filePath, index, paths) => paths.indexOf(filePath) === index).sort(compareCodeUnits));

// The empty Stage 0 registry predates the base-owned ratchet inventory. Its
// first accepted record is therefore the sole allowed 54 -> 55 inventory
// activation. Once activated, the immutable manifest keeps the registry pinned
// and every later append uses an ordinary exact-hash modify transition.
export const CONTROL_INTEGRITY_ACTIVATABLE_PATHS = Object.freeze([
  STAGE0_STAGE_APPROVAL_REGISTRY_PATH,
]);
const ACTIVATED_CONTROL_INTEGRITY_PATHS = Object.freeze([
  ...CONTROL_INTEGRITY_PATHS,
  ...CONTROL_INTEGRITY_ACTIVATABLE_PATHS,
].sort(compareCodeUnits));

const gateAProjectionControlOverlap = P0_GATE_A_PROPOSAL_PROJECTION_PATHS
  .filter((filePath) => CONTROL_INTEGRITY_PATHS.includes(filePath));
if (gateAProjectionControlOverlap.length !== 0) {
  throw new Error(`P0_GATE_A_PROPOSAL_PROJECTION_CONTROL_OVERLAP:${gateAProjectionControlOverlap.join(",")}`);
}

const TEST_COMMANDS = Object.freeze([
  ["bounded_authority_fixtures", "node", ["tools/P0-bounded-authority.mjs", "--self-test"], {
    ok: true, code: "P0_BOUNDED_AUTHORITY_SELF_TEST_OK", cases: 1935, sourceCount: 17,
  }],
  ["readiness", "node", ["tools/P0-test-execution-controls.mjs"], { passed: 403, failed: 0 }],
  ["historical_control_review", "node", ["tools/P0-test-control-review-trust.mjs"], { assertions: 35, failed: 0 }],
  ["successor_control_review_fixtures", "node", ["tools/P0-test-successor-control-review.mjs"], { failed: 0 }],
  ["running_log_fixtures", "node", ["tools/P0-test-running-log-trust.mjs"], { failed: 0 }],
  ["r1_r10_freeze_fixtures", "node", ["tools/P0-test-r1-r10-freeze.mjs"], {
    ok: true, cases: 58, frozenTasks: 50, frozenArtifacts: 300, aggregateExceptionCount: 4,
  }],
  ["wiki_fixtures", "node", ["tools/P0-test-wiki-trust.mjs"], { ok: true, cases: 30, helpWrites: 0 }],
  ["staged_action_fixtures", "node", ["tools/P0-test-staged-actions.mjs"], {
    ok: true, code: "SELF_TEST_OK", cases: 223, productionActions: 0,
  }],
  ["stage_runner_fixtures", "node", ["tools/P0-test-stage-runner.mjs"], {
    ok: true, code: "SELF_TEST_OK", cases: 90, productionModules: 0,
  }],
  ["delivery_transition_fixtures", "node", ["tools/P0-test-delivery-transition.mjs"], {
    ok: true, code: "SELF_TEST_OK", cases: 96, applyEnabled: false,
  }],
  ["execution_start_fixtures", "node", ["tools/P0-verify-execution-start.mjs", "--self-test"], {
    ok: true, code: "SELF_TEST_OK", cases: 66,
  }],
  ["github_sync_fixtures", "node", ["tools/sync_phase1_github.mjs", "--self-test"], {
    ok: true, cases: 56, mutableProjectFieldCount: 16,
  }],
  ["stage0_ci_contract_fixtures", "node", ["tools/P0-stage0-ci.mjs", "--self-test"], {
    ok: true, code: "P0_STAGE0_CI_SELF_TEST_OK", cases: 214,
  }],
]);

const TRUST_COMMANDS = Object.freeze([
  ["bounded_authority", "node", ["tools/P0-bounded-authority.mjs"], {
    passed: true, findingCount: 0, sourceCount: 17, decisionId: "P0-ED-016",
  }],
  ["successor_control_review", "node", ["tools/P0-successor-control-review.mjs"], {
    passed: true,
    findingCount: 0,
    runtimeAuthority: false,
    taskApprovalEffect: "none",
    permissionEffect: "none",
  }],
  ["running_log_trust", "node", ["tools/P0-running-log-trust.mjs"], {
    passed: true,
    findingCount: 0,
    evidenceEffect: { taskApprovalEffect: "none", permissionEffect: "none", executionAllowed: false },
  }],
  ["r1_r10_freeze", "node", ["tools/P0-verify-r1-r10-freeze.mjs", "--projection-from-sync"], {
    passed: true,
    source: { taskCount: 50, artifactCount: 300, executionAllowedCount: 0 },
    projection: { taskCount: 50, mismatchCount: 0, nodeIdsPresent: false },
  }],
]);

const GENERATION_COMMANDS = Object.freeze([
  ["task_artifacts_1", "node", ["tools/P0-generate-task-artifacts.mjs"], {}],
  ["roadmap_manifest_1", "node", ["tools/generate_phase1_roadmap_manifest.mjs"], {}],
  ["task_artifacts_2", "node", ["tools/P0-generate-task-artifacts.mjs"], {}],
  ["roadmap_manifest_2", "node", ["tools/generate_phase1_roadmap_manifest.mjs"], {}],
  ["generated_tracking", "node", ["tools/P0-verify-generated-tracking.mjs"], {
    ok: true, code: "P0_GENERATED_TRACKING_OK", generatedPathCount: 352,
  }],
  ["structural_validator", "node", ["tools/P0-validate-execution-controls.mjs"], {
    result: "pass",
    requirements: { total: 78, active: 71 },
    tasks: { total: 58 },
    authenticMediaAccessed: false,
    deploymentState: "Unknown — private read authority pending",
  }],
  ["r1_r10_freeze_after_generation", "node", ["tools/P0-verify-r1-r10-freeze.mjs", "--projection-from-sync"], {
    passed: true,
    source: { taskCount: 50, artifactCount: 300, executionAllowedCount: 0 },
    projection: { taskCount: 50, mismatchCount: 0, nodeIdsPresent: false },
  }],
]);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
}

function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

function isPlainRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function containsExpected(actual, expected) {
  if (Array.isArray(expected)) {
    return Array.isArray(actual) && actual.length === expected.length
      && expected.every((entry, index) => containsExpected(actual[index], entry));
  }
  if (isPlainRecord(expected)) {
    return isPlainRecord(actual)
      && Object.entries(expected).every(([key, value]) => Object.hasOwn(actual, key)
        && containsExpected(actual[key], value));
  }
  return Object.is(actual, expected);
}

export function validateToolInventory(actualPaths, expectedPaths = CONTROL_TOOL_PATHS) {
  const actual = [...actualPaths].sort(compareCodeUnits);
  const expected = [...expectedPaths].sort(compareCodeUnits);
  const findings = [];
  if (canonicalJson(actual) !== canonicalJson(expected)) findings.push("CI_TOOL_INVENTORY_DRIFT");
  return Object.freeze({ ok: findings.length === 0, findings });
}

function exactPathSet(value) {
  if (!Array.isArray(value)
    || value.some((filePath) => typeof filePath !== "string" || filePath.length === 0)
    || new Set(value).size !== value.length) return null;
  return [...value].sort(compareCodeUnits);
}

export function validateAuthoritySourcePathSet(actualPaths) {
  const actual = exactPathSet(actualPaths);
  const expected = exactPathSet(CONTROL_AUTHORITY_SOURCE_PATHS);
  const findings = [];
  if (actual === null || canonicalJson(actual) !== canonicalJson(expected)) {
    findings.push("CI_BOUNDED_AUTHORITY_SOURCE_PATH_SET_INVALID");
  }
  return Object.freeze({ ok: findings.length === 0, findings });
}

export function validateControlIntegrityDefinition({
  scannerPaths = SCANNER_BOUNDED_AUTHORITY_SOURCE_PATHS,
  integrityPaths = CONTROL_INTEGRITY_PATHS,
  activatablePaths = CONTROL_INTEGRITY_ACTIVATABLE_PATHS,
} = {}) {
  const findings = [];
  if (!validateAuthoritySourcePathSet(scannerPaths).ok) {
    findings.push("CI_BOUNDED_AUTHORITY_SCANNER_PATH_SET_DRIFT");
  }
  const actualIntegrity = exactPathSet(integrityPaths);
  const expectedIntegrity = exactPathSet([
    ...new Set([
      ...CONTROL_TOOL_PATHS,
      ...CONTROL_AUTHORITY_SOURCE_PATHS,
      STAGE0_PROTECTED_WORKFLOW_PATH,
      "prototypes/calendar-ui/app-v10.js",
      "prototypes/calendar-ui/package.json",
      "prototypes/calendar-ui/serve.mjs",
    ]),
  ]);
  if (actualIntegrity === null || canonicalJson(actualIntegrity) !== canonicalJson(expectedIntegrity)) {
    findings.push("CI_CONTROL_INTEGRITY_PATH_SET_INVALID");
  }
  if (actualIntegrity === null
    || CONTROL_AUTHORITY_SOURCE_PATHS.some((filePath) => !actualIntegrity.includes(filePath))) {
    findings.push("CI_CONTROL_INTEGRITY_AUTHORITY_SOURCE_SUBSET_INVALID");
  }
  if (CONTROL_AUTHORITY_SOURCE_PATHS.length !== 17 || expectedIntegrity?.length !== 54) {
    findings.push("CI_CONTROL_INTEGRITY_EXPECTED_CARDINALITY_INVALID");
  }
  const actualActivatable = exactPathSet(activatablePaths);
  if (actualActivatable === null
    || canonicalJson(actualActivatable) !== canonicalJson([STAGE0_STAGE_APPROVAL_REGISTRY_PATH])
    || actualActivatable.some((filePath) => expectedIntegrity.includes(filePath))) {
    findings.push("CI_CONTROL_INTEGRITY_ACTIVATABLE_PATH_SET_INVALID");
  }
  return Object.freeze({ ok: findings.length === 0, findings: [...new Set(findings)] });
}

const CONTROL_INTEGRITY_SCHEMA_VERSION = "1.0.0";
const CONTROL_INTEGRITY_MAX_CHANGES = 8;
const CONTROL_INTEGRITY_MODES = new Set(["100644"]);
const CONTROL_INTEGRITY_SHA256 = /^[0-9a-f]{64}$/;

function exactObjectKeys(value, keys) {
  return isPlainRecord(value) && canonicalJson(Object.keys(value)) === canonicalJson(keys);
}

function isAllowedControlIntegrityPath(filePath) {
  return CONTROL_INTEGRITY_PATHS.includes(filePath)
    || CONTROL_INTEGRITY_ACTIVATABLE_PATHS.includes(filePath)
    || /^tools\/P0-[A-Za-z0-9][A-Za-z0-9-]*\.mjs$/.test(filePath)
    || /^docs\/council\/execution\/P0-[A-Z0-9][A-Z0-9-]*\.(?:json|md)$/.test(filePath)
    || /^\.github\/workflows\/P0-[a-z0-9][a-z0-9-]*\.yml$/.test(filePath);
}

function parseControlIntegrityEntry(value, label) {
  if (!exactObjectKeys(value, ["path", "mode", "type", "sha256"])
    || typeof value.path !== "string" || value.path.length === 0
    || !CONTROL_INTEGRITY_MODES.has(value.mode) || value.type !== "blob"
    || !CONTROL_INTEGRITY_SHA256.test(value.sha256 ?? "")
    || value.path === STAGE0_WORKFLOW_GUARD_PATH || value.path === STAGE0_CONTROL_INTEGRITY_PATH
    || !isAllowedControlIntegrityPath(value.path)) {
    throw new Error(`CI_CONTROL_INTEGRITY_${label}_INVALID`);
  }
  return { path: value.path, mode: value.mode, type: value.type, sha256: value.sha256 };
}

function assertControlIntegritySortedUnique(entries, label) {
  const paths = entries.map((entry) => entry.path);
  if (new Set(paths).size !== paths.length
    || canonicalJson(paths) !== canonicalJson([...paths].sort(compareCodeUnits))) {
    throw new Error(`CI_CONTROL_INTEGRITY_${label}_NOT_SORTED_UNIQUE`);
  }
}

function assertAuthoritySourceSubset(entries, label) {
  const paths = new Set(entries.map((entry) => entry.path));
  if (CONTROL_AUTHORITY_SOURCE_PATHS.some((filePath) => !paths.has(filePath))) {
    throw new Error(`CI_CONTROL_INTEGRITY_${label}_AUTHORITY_SOURCE_SET_INVALID`);
  }
}

function renderControlIntegrityManifest(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function parseControlIntegrityManifest(source, label) {
  if (typeof source !== "string") throw new Error(`CI_CONTROL_INTEGRITY_${label}_SOURCE_INVALID`);
  let value;
  try {
    value = JSON.parse(source);
  } catch {
    throw new Error(`CI_CONTROL_INTEGRITY_${label}_JSON_INVALID`);
  }
  if (!exactObjectKeys(value, ["schemaVersion", "current", "next"])
    || value.schemaVersion !== CONTROL_INTEGRITY_SCHEMA_VERSION
    || !Array.isArray(value.current) || value.current.length === 0) {
    throw new Error(`CI_CONTROL_INTEGRITY_${label}_SCHEMA_INVALID`);
  }
  const current = value.current.map((entry) => parseControlIntegrityEntry(entry, `${label}_CURRENT`));
  assertControlIntegritySortedUnique(current, `${label}_CURRENT`);
  const currentByPath = new Map(current.map((entry) => [entry.path, entry]));
  let next = null;
  if (value.next !== null) {
    if (!exactObjectKeys(value.next, ["changes"])
      || !Array.isArray(value.next.changes) || value.next.changes.length === 0
      || value.next.changes.length > CONTROL_INTEGRITY_MAX_CHANGES) {
      throw new Error(`CI_CONTROL_INTEGRITY_${label}_NEXT_INVALID`);
    }
    const changes = value.next.changes.map((change) => {
      if (!exactObjectKeys(change, ["operation", "path", "mode", "type", "sha256"])
        || !["add", "modify", "delete"].includes(change.operation)) {
        throw new Error(`CI_CONTROL_INTEGRITY_${label}_CHANGE_INVALID`);
      }
      const entry = parseControlIntegrityEntry({
        path: change.path,
        mode: change.mode,
        type: change.type,
        sha256: change.sha256,
      }, `${label}_CHANGE`);
      const currentEntry = currentByPath.get(entry.path);
      if (change.operation === "add") {
        if (currentEntry) throw new Error(`CI_CONTROL_INTEGRITY_${label}_ADD_PRESENT`);
      } else if (!currentEntry) {
        throw new Error(`CI_CONTROL_INTEGRITY_${label}_${change.operation.toUpperCase()}_ABSENT`);
      } else if (change.operation === "delete") {
        if (canonicalJson(entry) !== canonicalJson(currentEntry)) {
          throw new Error(`CI_CONTROL_INTEGRITY_${label}_DELETE_PREIMAGE_INVALID`);
        }
      } else if (canonicalJson(entry) === canonicalJson(currentEntry)) {
        throw new Error(`CI_CONTROL_INTEGRITY_${label}_MODIFY_NOOP`);
      }
      return { operation: change.operation, ...entry };
    });
    assertControlIntegritySortedUnique(changes, `${label}_CHANGES`);
    next = { changes };
  }
  const manifest = { schemaVersion: CONTROL_INTEGRITY_SCHEMA_VERSION, current, next };
  if (source !== renderControlIntegrityManifest(manifest)) {
    throw new Error(`CI_CONTROL_INTEGRITY_${label}_NONCANONICAL`);
  }
  return manifest;
}

export function validateControlIntegrityManifest(source) {
  try {
    return Object.freeze({ ok: true, findings: [], manifest: parseControlIntegrityManifest(source, "MANIFEST") });
  } catch (error) {
    return Object.freeze({ ok: false, findings: [error.message] });
  }
}

export function validateControlIntegrityCurrent(source, observed, {
  stageRegistryNonEmpty = false,
} = {}) {
  try {
    if (typeof stageRegistryNonEmpty !== "boolean") {
      throw new Error("CI_CONTROL_INTEGRITY_STAGE_REGISTRY_STATE_INVALID");
    }
    const definition = validateControlIntegrityDefinition();
    if (!definition.ok) throw new Error(definition.findings[0]);
    const manifest = parseControlIntegrityManifest(source, "CURRENT");
    const paths = manifest.current.map((entry) => entry.path);
    const expectedPaths = stageRegistryNonEmpty
      ? ACTIVATED_CONTROL_INTEGRITY_PATHS
      : CONTROL_INTEGRITY_PATHS;
    if (canonicalJson(paths) !== canonicalJson(expectedPaths)) {
      throw new Error("CI_CONTROL_INTEGRITY_CURRENT_PATH_SET_INVALID");
    }
    assertAuthoritySourceSubset(manifest.current, "CURRENT");
    assertControlIntegrityObserved(manifest.current, observed, "CURRENT");
    return Object.freeze({ ok: true, findings: [], manifest });
  } catch (error) {
    return Object.freeze({ ok: false, findings: [error.message] });
  }
}

function applyControlIntegrityChanges(current, changes) {
  const entries = new Map(current.map((entry) => [entry.path, entry]));
  for (const change of changes) {
    if (change.operation === "delete") entries.delete(change.path);
    else entries.set(change.path, {
      path: change.path,
      mode: change.mode,
      type: change.type,
      sha256: change.sha256,
    });
  }
  return [...entries.values()].sort((left, right) => compareCodeUnits(left.path, right.path));
}

function assertControlIntegrityObserved(inventory, observed, label) {
  if (!isPlainRecord(observed)) throw new Error(`CI_CONTROL_INTEGRITY_${label}_OBSERVED_INVALID`);
  for (const expected of inventory) {
    const actual = observed[expected.path];
    if (!exactObjectKeys(actual, ["mode", "type", "sha256"])
      || actual.mode !== expected.mode || actual.type !== expected.type
      || actual.sha256 !== expected.sha256) {
      throw new Error(`CI_CONTROL_INTEGRITY_${label}_MISMATCH:${expected.path}`);
    }
  }
}

export function validateControlIntegrityTransition({
  baseSource,
  headSource,
  changedPaths,
  baseObserved,
  headObserved,
}) {
  try {
    const definition = validateControlIntegrityDefinition();
    if (!definition.ok) throw new Error(definition.findings[0]);
    const base = parseControlIntegrityManifest(baseSource, "BASE");
    const head = parseControlIntegrityManifest(headSource, "HEAD");
    assertAuthoritySourceSubset(base.current, "BASE");
    assertAuthoritySourceSubset(head.current, "HEAD");
    if (!Array.isArray(changedPaths) || new Set(changedPaths).size !== changedPaths.length
      || canonicalJson(changedPaths) !== canonicalJson([...changedPaths].sort(compareCodeUnits))) {
      throw new Error("CI_CONTROL_INTEGRITY_CHANGED_PATHS_INVALID");
    }
    assertControlIntegrityObserved(base.current, baseObserved, "BASE_CURRENT");
    let transition;
    let expectedHead;
    if (base.next === null) {
      if (head.next !== null) {
        if (canonicalJson(head.current) !== canonicalJson(base.current)
          || canonicalJson(changedPaths) !== canonicalJson([STAGE0_CONTROL_INTEGRITY_PATH])) {
          throw new Error("CI_CONTROL_INTEGRITY_ARM_INVALID");
        }
        transition = "armed";
        expectedHead = base.current;
      } else {
        if (canonicalJson(head.current) !== canonicalJson(base.current)) {
          throw new Error("CI_CONTROL_INTEGRITY_CLEAR_CURRENT_CHANGED");
        }
        const current = new Set(base.current.map((entry) => entry.path));
        const forbidden = changedPaths.filter((filePath) => filePath === STAGE0_WORKFLOW_GUARD_PATH
          || filePath === STAGE0_CONTROL_INTEGRITY_PATH || current.has(filePath)
          || filePath.startsWith(".github/workflows/") || isAllowedControlIntegrityPath(filePath));
        if (forbidden.length !== 0) throw new Error(`CI_CONTROL_INTEGRITY_UNAUTHORIZED_PATH:${forbidden[0]}`);
        transition = "clear";
        expectedHead = base.current;
      }
    } else {
      if (head.next !== null) throw new Error("CI_CONTROL_INTEGRITY_ARMED_BASE_REQUIRES_CLEAR_HEAD");
      if (canonicalJson(head.current) === canonicalJson(base.current)) {
        if (canonicalJson(changedPaths) !== canonicalJson([STAGE0_CONTROL_INTEGRITY_PATH])) {
          throw new Error("CI_CONTROL_INTEGRITY_CANCEL_INVALID");
        }
        transition = "cancelled";
        expectedHead = base.current;
      } else {
        const applied = applyControlIntegrityChanges(base.current, base.next.changes);
        const expectedPaths = [STAGE0_CONTROL_INTEGRITY_PATH,
          ...base.next.changes.map((change) => change.path)].sort(compareCodeUnits);
        if (canonicalJson(head.current) !== canonicalJson(applied)
          || canonicalJson(changedPaths) !== canonicalJson(expectedPaths)) {
          throw new Error("CI_CONTROL_INTEGRITY_CONSUME_INVALID");
        }
        transition = "consumed";
        expectedHead = applied;
      }
    }
    assertControlIntegrityObserved(expectedHead, headObserved, "HEAD_CURRENT");
    return Object.freeze({ ok: true, findings: [], transition });
  } catch (error) {
    return Object.freeze({ ok: false, findings: [error.message] });
  }
}

// This workflow is itself part of the Stage 0 control boundary. Accepting one
// exact source shape avoids YAML ambiguity, duplicate-key shadowing, extra
// triggers/jobs/steps, and conditions that can silently neutralize a required
// check. Any intended workflow evolution must update this contract and its
// adversarial fixtures in the same reviewed change.
const EXPECTED_WORKFLOW_SOURCE = `${[
  "name: Phase 1 static controls",
  "",
  "on:",
  "  push:",
  "  pull_request:",
  "",
  "permissions:",
  "  contents: read",
  "",
  "env:",
  "  P0_EXPECTED_REVISION: ${{ github.event.pull_request.head.sha || github.sha }}",
  "",
  "jobs:",
  "  static-controls:",
  "    name: Exact-head P0/R0 control suite",
  "    runs-on: ubuntu-latest",
  "    timeout-minutes: 20",
  "    steps:",
  "      - name: Check out exact event revision",
  "        uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262",
  "        with:",
  "          fetch-depth: 0",
  "          persist-credentials: false",
  "          ref: ${{ github.event.pull_request.head.sha || github.sha }}",
  "      - name: Set up Node.js",
  "        uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020",
  "        with:",
  "          node-version: 22",
  "      - name: Verify the closed CI contract",
  "        run: |",
  "          node --check tools/P0-stage0-ci.mjs",
  "          node tools/P0-stage0-ci.mjs --self-test",
  "      - name: Run two deterministic exact-head passes",
  "        run: |",
  "          node tools/P0-stage0-ci.mjs",
].join("\n")}\n`;

export function validateWorkflowContract(source) {
  const findings = [];
  if (typeof source !== "string") {
    return Object.freeze({ ok: false, findings: ["CI_WORKFLOW_SOURCE_INVALID"] });
  }
  const normalized = source.replace(/\r\n/g, "\n");
  if (normalized.includes("\r")) findings.push("CI_WORKFLOW_LINE_ENDING_INVALID");
  if (/^\s*(?:if|"if"|'if')\s*:/im.test(normalized)) findings.push("CI_WORKFLOW_CONDITION_FORBIDDEN");
  if (/^\s*(?:continue-on-error|"continue-on-error"|'continue-on-error')\s*:/im.test(normalized)) {
    findings.push("CI_WORKFLOW_CONTINUE_ON_ERROR_FORBIDDEN");
  }
  if (/\|\|\s*true\b/i.test(normalized)) findings.push("CI_WORKFLOW_ERROR_SUPPRESSION_FORBIDDEN");
  if (/^\s*fetch-depth\s*:\s*[1-9]\d*\s*$/im.test(normalized)) {
    findings.push("CI_WORKFLOW_SHALLOW_CHECKOUT_FORBIDDEN");
  }
  if (normalized !== EXPECTED_WORKFLOW_SOURCE) findings.push("CI_WORKFLOW_CLOSED_CONTRACT_DRIFT");
  return Object.freeze({ ok: findings.length === 0, findings: [...new Set(findings)] });
}

export function validateWorkflowGuardContract(source) {
  const findings = [];
  if (typeof source !== "string") {
    return Object.freeze({ ok: false, findings: ["CI_WORKFLOW_GUARD_SOURCE_ABSENT"] });
  }
  const authorityBlock = source.match(
    /const AUTHORITY_SOURCE_PATHS = new Set\(\[\n([\s\S]*?)\n\s{12}\]\);/u,
  );
  let inlineAuthorityPaths = null;
  if (authorityBlock) {
    try {
      inlineAuthorityPaths = authorityBlock[1].split("\n").map((line) => {
        const match = line.match(/^\s{14}("(?:[^"\\]|\\.)*"),$/u);
        if (!match) throw new Error("invalid path literal");
        return JSON.parse(match[1]);
      });
    } catch {
      inlineAuthorityPaths = null;
    }
  }
  if (!validateAuthoritySourcePathSet(inlineAuthorityPaths).ok) {
    findings.push("CI_WORKFLOW_GUARD_AUTHORITY_SOURCE_PATH_SET_INVALID");
  }
  if (sha256(source) !== STAGE0_WORKFLOW_GUARD_SHA256) findings.push("CI_WORKFLOW_GUARD_CLOSED_CONTRACT_DRIFT");
  if (!/^on:\n  pull_request_target:\n/m.test(source)) findings.push("CI_WORKFLOW_GUARD_TRIGGER_INVALID");
  if (/^\s*pull_request\s*:/m.test(source)) findings.push("CI_WORKFLOW_GUARD_PR_HEAD_TRIGGER_FORBIDDEN");
  if (/actions\/checkout@/i.test(source)) findings.push("CI_WORKFLOW_GUARD_CHECKOUT_FORBIDDEN");
  if (/^\s*run\s*:/im.test(source)) findings.push("CI_WORKFLOW_GUARD_RUN_STEP_FORBIDDEN");
  if (/^\s*(?:if|"if"|'if')\s*:/im.test(source)) findings.push("CI_WORKFLOW_GUARD_CONDITION_FORBIDDEN");
  if (/^\s*(?:continue-on-error|"continue-on-error"|'continue-on-error')\s*:/im.test(source)) {
    findings.push("CI_WORKFLOW_GUARD_CONTINUE_ON_ERROR_FORBIDDEN");
  }
  if (/\|\|\s*true\b/i.test(source)) findings.push("CI_WORKFLOW_GUARD_ERROR_SUPPRESSION_FORBIDDEN");
  return Object.freeze({ ok: findings.length === 0, findings: [...new Set(findings)] });
}

export function validatePassResults(results, expectedIds) {
  const findings = [];
  if (!Array.isArray(expectedIds) || expectedIds.length === 0
    || expectedIds.some((id) => typeof id !== "string" || id.length === 0)
    || new Set(expectedIds).size !== expectedIds.length) {
    findings.push("CI_EXPECTED_RESULT_SET_INVALID");
  }
  if (!Array.isArray(results) || results.length === 0) {
    findings.push("CI_RESULTS_ABSENT");
    return Object.freeze({ ok: false, findings: [...new Set(findings)] });
  }
  if (canonicalJson(results.map((entry) => entry?.id)) !== canonicalJson(expectedIds)) findings.push("CI_RESULT_SET_INVALID");
  for (const entry of results) {
    if (!isPlainRecord(entry)
      || canonicalJson(Object.keys(entry).sort()) !== canonicalJson(["id", "outputBytes", "outputSha256", "status"])
      || entry.status !== 0 || !/^[0-9a-f]{64}$/.test(entry.outputSha256 ?? "")
      || !Number.isSafeInteger(entry.outputBytes) || entry.outputBytes < 0) {
      findings.push("CI_RESULT_INVALID_OR_NONZERO");
    }
  }
  return Object.freeze({ ok: findings.length === 0, findings: [...new Set(findings)] });
}

function stage0SelfTest() {
  let cases = 0;
  const expect = (condition, label) => {
    cases += 1;
    if (!condition) throw new Error(`P0_STAGE0_CI_SELF_TEST_FAILED: ${label}`);
  };
  const workflow = EXPECTED_WORKFLOW_SOURCE;
  expect(validateWorkflowContract(workflow).ok, "valid workflow");
  expect(!validateWorkflowContract(workflow.replace("  push:\n", "")).ok, "missing push trigger");
  expect(!validateWorkflowContract(workflow.replace("  pull_request:\n", "")).ok, "missing pull request trigger");
  expect(!validateWorkflowContract(workflow.replace("  pull_request:\n", "  pull_request:\n  workflow_dispatch:\n")).ok, "extra trigger");
  expect(!validateWorkflowContract(`${workflow.trimEnd()}\n  bypass:\n    runs-on: ubuntu-latest\n    steps: []\n`).ok, "second job");
  expect(!validateWorkflowContract(workflow.replace(
    "    runs-on: ubuntu-latest\n",
    "    runs-on: ubuntu-latest\n    if: ${{ github.event_name == 'never-event' }}\n",
  )).ok, "nonliteral always-false job condition");
  expect(!validateWorkflowContract(workflow.replace(
    "      - name: Check out exact event revision\n",
    "      - name: Check out exact event revision\n        if: ${{ 1 == 0 }}\n",
  )).ok, "nonliteral always-false step condition");
  expect(!validateWorkflowContract(workflow.replace(
    "      - name: Run two deterministic exact-head passes\n",
    "      - name: Run two deterministic exact-head passes\n        if: false\n",
  )).ok, "literal false condition");
  expect(!validateWorkflowContract(workflow.replace(
    "      - name: Run two deterministic exact-head passes\n",
    "      - name: Run two deterministic exact-head passes\n        continue-on-error: true\n",
  )).ok, "continue on error true");
  expect(!validateWorkflowContract(workflow.replace(
    "      - name: Run two deterministic exact-head passes\n",
    "      - name: Run two deterministic exact-head passes\n        continue-on-error: false\n",
  )).ok, "continue on error false");
  expect(!validateWorkflowContract(workflow.replace(
    "          node tools/P0-stage0-ci.mjs\n",
    "          node tools/P0-stage0-ci.mjs || true\n",
  )).ok, "shell suppression");
  expect(!validateWorkflowContract(workflow.replace(
    "actions/checkout@11d5960a326750d5838078e36cf38b85af677262",
    "actions/checkout@v4",
  )).ok, "unpinned checkout");
  expect(!validateWorkflowContract(workflow.replace(
    "      - name: Check out exact event revision\n        uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262\n        with:\n          fetch-depth: 0\n          persist-credentials: false\n          ref: ${{ github.event.pull_request.head.sha || github.sha }}\n",
    "",
  )).ok, "missing checkout");
  expect(!validateWorkflowContract(workflow.replace("fetch-depth: 0", "fetch-depth: 1")).ok, "shallow checkout");
  expect(!validateWorkflowContract(workflow.replace("          persist-credentials: false\n", "")).ok,
    "missing checkout credential isolation");
  expect(!validateWorkflowContract(workflow.replace("persist-credentials: false", "persist-credentials: true")).ok,
    "checkout credentials persisted");
  expect(!validateWorkflowContract(workflow.replace(
    "ref: ${{ github.event.pull_request.head.sha || github.sha }}",
    "ref: ${{ github.sha }}",
  )).ok, "stale checkout ref");
  expect(!validateWorkflowContract(workflow.replace(
    "      - name: Set up Node.js\n        uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020\n        with:\n          node-version: 22\n",
    "",
  )).ok, "missing node setup");
  expect(!validateWorkflowContract(workflow.replace(
    "actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020",
    "actions/setup-node@v4",
  )).ok, "unpinned node setup");
  expect(!validateWorkflowContract(workflow.replace("node-version: 22", "node-version: 20")).ok, "wrong node version");
  expect(!validateWorkflowContract(workflow.replace(" --self-test", " --renamed")).ok, "renamed self-test command");
  expect(!validateWorkflowContract(workflow.replace("          node --check tools/P0-stage0-ci.mjs\n", "")).ok, "missing syntax command");
  expect(!validateWorkflowContract(workflow.replace(
    "          node tools/P0-stage0-ci.mjs\n",
    "          node tools/missing.mjs\n",
  )).ok, "renamed full run");
  expect(!validateWorkflowContract(workflow.replace(
    "          node --check tools/P0-stage0-ci.mjs\n          node tools/P0-stage0-ci.mjs --self-test\n",
    "          node tools/P0-stage0-ci.mjs --self-test\n          node --check tools/P0-stage0-ci.mjs\n",
  )).ok, "reordered contract commands");
  expect(!validateWorkflowContract(workflow.replace(
    "          node tools/P0-stage0-ci.mjs\n",
    "          echo skipped\n          node tools/P0-stage0-ci.mjs\n",
  )).ok, "extra runner command");
  expect(!validateWorkflowContract(workflow.replace(
    "          node tools/P0-stage0-ci.mjs\n",
    "          node tools/P0-stage0-ci.mjs\n          node tools/P0-stage0-ci.mjs\n",
  )).ok, "duplicate full run");
  expect(!validateWorkflowContract(workflow.replace("P0_EXPECTED_REVISION: ${{ github.event.pull_request.head.sha || github.sha }}", "P0_EXPECTED_REVISION: deadbeef")).ok, "wrong revision");
  expect(!validateWorkflowContract(workflow.replace(
    "  P0_EXPECTED_REVISION: ${{ github.event.pull_request.head.sha || github.sha }}\n",
    "  P0_EXPECTED_REVISION: ${{ github.event.pull_request.head.sha || github.sha }}\n  P0_EXPECTED_REVISION: ${{ github.sha }}\n",
  )).ok, "duplicate revision binding");
  const guardWorkflow = readFileSync(path.join(MODULE_REPO_ROOT, STAGE0_WORKFLOW_GUARD_PATH), "utf8");
  expect(validateWorkflowGuardContract(guardWorkflow).ok, "valid base-owned workflow guard");
  expect(!validateWorkflowGuardContract(null).ok, "absent base-owned workflow guard");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace("  pull_request_target:\n", "")).ok,
    "missing pull request target trigger");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace("pull_request_target:", "pull_request:")).ok,
    "PR-head workflow trigger substitution");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace("    branches:\n      - main\n", "")).ok,
    "missing guard main-branch filter");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace("      - main\n", "      - shadow-main\n")).ok,
    "changed guard main-branch filter");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace("      - edited\n", "")).ok,
    "missing guard edited activity trigger");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace("contents: read", "contents: write")).ok,
    "write contents permission");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace("  pull-requests: read\n", "")).ok,
    "missing pull request read permission");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "    steps:\n",
    "    steps:\n      - uses: actions/checkout@v4\n",
  )).ok, "guard checkout injection");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "    steps:\n",
    "    steps:\n      - run: node untrusted-pr-code.mjs\n",
  )).ok, "guard run-step injection");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "    runs-on: ubuntu-latest\n",
    "    runs-on: ubuntu-latest\n    if: ${{ github.event_name == 'never-event' }}\n",
  )).ok, "guard nonliteral always-false condition");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "      - name: Verify exact base-owned control ratchet\n",
    "      - name: Verify exact base-owned control ratchet\n        continue-on-error: true\n",
  )).ok, "guard continue on error");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "core.info(`P0_CONTROL_INTEGRITY_OK:${transition}`);",
    "core.info(`P0_CONTROL_INTEGRITY_OK:${transition}`) || true;",
  )).ok, "guard shell-style suppression");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "actions/github-script@f28e40c7f34bde8b3046d885e986cb6290c5673b",
    "actions/github-script@v7",
  )).ok, "guard action pin drift");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    ".github/workflows/P0-stage0-workflow-guard.yml",
    ".github/workflows/P0-shadow-workflow-guard.yml",
  )).ok, "guard self-path drift");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    ".github/workflows/prototype-syntax.yml",
    ".github/workflows/shadow-syntax.yml",
  )).ok, "guard protected-path drift");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "docs/council/execution/P0-STAGE0-CONTROL-INTEGRITY.json",
    "docs/council/execution/P0-SHADOW-CONTROL-INTEGRITY.json",
  )).ok, "guard manifest-path drift");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "assertExactMatch(GUARD_PATH, baseGuard, headGuard,",
    "assertExactMatch(GUARD_PATH, baseGuard, baseGuard,",
  )).ok, "guard self-comparison neutralization");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "const baseManifest = parseManifest(baseManifestFile, \"BASE_MANIFEST\");",
    "false",
  )).ok, "guard base-manifest authority neutralization");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "const CANONICAL_BASE_REPOSITORY = \"arunpr614/Life-Reflection\";",
    "const CANONICAL_BASE_REPOSITORY = \"attacker/shadow\";",
  )).ok, "guard canonical base identity drift");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "pullRequest.base?.repo?.full_name !== CANONICAL_BASE_REPOSITORY",
    "false",
  )).ok, "guard base-repository comparison neutralization");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "pullRequest.base?.ref !== CANONICAL_BASE_REF",
    "false",
  )).ok, "guard base-ref comparison neutralization");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "              \"tools/P0-append-only-trust.mjs\",\n",
    "",
  )).ok, "guard control-tool path deletion");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "prototypes/calendar-ui/package.json",
    "prototypes/calendar-ui/shadow-package.json",
  )).ok, "guard prototype command path drift");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "for (const expected of inventory)",
    "for (const expected of [])",
  )).ok, "guard control comparison loop neutralization");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "headFile.mode !== baseFile.mode",
    "false",
  )).ok, "guard mode comparison neutralization");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "headFile.type !== baseFile.type",
    "false",
  )).ok, "guard type comparison neutralization");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "headFile.blobSha !== baseFile.blobSha",
    "false",
  )).ok, "guard blob comparison neutralization");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "headFile.sha256 !== baseFile.sha256",
    "false",
  )).ok, "guard byte-digest comparison neutralization");
  expect(!validateWorkflowGuardContract(guardWorkflow.replace(
    "!headFile.bytes.equals(baseFile.bytes)",
    "false",
  )).ok, "guard exact-byte comparison neutralization");

  expect(CONTROL_TOOL_PATHS.length === 34
    && CONTROL_TOOL_PATHS.every((filePath) => filePath.startsWith("tools/")),
  "control-tool inventory remains tool-only");
  expect(CONTROL_AUTHORITY_SOURCE_PATHS.length === 17
    && validateAuthoritySourcePathSet(CONTROL_AUTHORITY_SOURCE_PATHS).ok,
  "frozen authority-source path set");
  expect(validateAuthoritySourcePathSet(SCANNER_BOUNDED_AUTHORITY_SOURCE_PATHS).ok,
    "semantic scanner authority-source path set equality");
  expect(validateControlIntegrityDefinition().ok
    && CONTROL_INTEGRITY_PATHS.length === 54
    && CONTROL_INTEGRITY_ACTIVATABLE_PATHS.length === 1
    && CONTROL_INTEGRITY_ACTIVATABLE_PATHS[0] === STAGE0_STAGE_APPROVAL_REGISTRY_PATH,
  "closed control-integrity definition");
  const caseNearPath = (filePath) => `${filePath[0] === filePath[0].toUpperCase()
    ? filePath[0].toLowerCase() : filePath[0].toUpperCase()}${filePath.slice(1)}`;
  for (const authorityPath of CONTROL_AUTHORITY_SOURCE_PATHS) {
    expect(!validateAuthoritySourcePathSet(
      CONTROL_AUTHORITY_SOURCE_PATHS.filter((filePath) => filePath !== authorityPath),
    ).ok, `authority-source omission rejected: ${authorityPath}`);
    expect(!validateAuthoritySourcePathSet([
      ...CONTROL_AUTHORITY_SOURCE_PATHS,
      `${authorityPath}.extra`,
    ]).ok, `authority-source extra rejected: ${authorityPath}`);
    expect(!validateAuthoritySourcePathSet(CONTROL_AUTHORITY_SOURCE_PATHS.map((filePath) => (
      filePath === authorityPath ? `${filePath}.renamed` : filePath
    ))).ok, `authority-source rename rejected: ${authorityPath}`);
    expect(!validateAuthoritySourcePathSet(CONTROL_AUTHORITY_SOURCE_PATHS.map((filePath) => (
      filePath === authorityPath ? caseNearPath(filePath) : filePath
    ))).ok, `authority-source case-nearmiss rejected: ${authorityPath}`);
    expect(!validateControlIntegrityDefinition({
      integrityPaths: CONTROL_INTEGRITY_PATHS.filter((filePath) => filePath !== authorityPath),
    }).ok, `authority source required in manifest definition: ${authorityPath}`);
  }
  expect(!validateControlIntegrityDefinition({
    scannerPaths: [...SCANNER_BOUNDED_AUTHORITY_SOURCE_PATHS, "docs/product/EXTRA-AUTHORITY.md"],
  }).ok, "scanner authority-source extra rejected");
  expect(!validateControlIntegrityDefinition({
    integrityPaths: [...CONTROL_INTEGRITY_PATHS, "docs/product/EXTRA-AUTHORITY.md"],
  }).ok, "control-integrity definition extra rejected");
  expect(!validateControlIntegrityDefinition({
    activatablePaths: [...CONTROL_INTEGRITY_ACTIVATABLE_PATHS, "docs/product/EXTRA-AUTHORITY.md"],
  }).ok, "activatable control-integrity path extra rejected");

  const fixtureCurrent = CONTROL_INTEGRITY_PATHS.map((filePath) => ({
    path: filePath,
    mode: "100644",
    type: "blob",
    sha256: sha256(`fixture:${filePath}`),
  }));
  const fixtureEntry = fixtureCurrent.find((entry) => entry.path === "tools/P0-staged-actions.mjs");
  const modifiedEntry = { ...fixtureEntry, sha256: "2".repeat(64) };
  const executableEntry = { ...fixtureEntry, mode: "100755" };
  const replaceFixtureEntry = (entries, replacement) => entries.map((entry) => (
    entry.path === replacement.path ? replacement : entry
  ));
  const modifiedCurrent = replaceFixtureEntry(fixtureCurrent, modifiedEntry);
  const fixtureObserved = (entries) => Object.fromEntries(entries.map((entry) => [entry.path, {
    mode: entry.mode,
    type: entry.type,
    sha256: entry.sha256,
  }]));
  const clearManifest = {
    schemaVersion: CONTROL_INTEGRITY_SCHEMA_VERSION,
    current: fixtureCurrent,
    next: null,
  };
  const armedManifest = {
    schemaVersion: CONTROL_INTEGRITY_SCHEMA_VERSION,
    current: fixtureCurrent,
    next: { changes: [{ operation: "modify", ...modifiedEntry }] },
  };
  const consumedManifest = {
    schemaVersion: CONTROL_INTEGRITY_SCHEMA_VERSION,
    current: modifiedCurrent,
    next: null,
  };
  const clearSource = renderControlIntegrityManifest(clearManifest);
  const armedSource = renderControlIntegrityManifest(armedManifest);
  const consumedSource = renderControlIntegrityManifest(consumedManifest);
  const baseObserved = fixtureObserved(clearManifest.current);
  const modifiedObserved = fixtureObserved(consumedManifest.current);
  expect(validateControlIntegrityManifest(clearSource).ok, "valid clear control-integrity manifest");
  expect(validateControlIntegrityCurrent(clearSource, baseObserved).ok,
    "exact 54-path current control-integrity inventory");
  const activatedRegistryEntry = {
    path: STAGE0_STAGE_APPROVAL_REGISTRY_PATH,
    mode: "100644",
    type: "blob",
    sha256: sha256("nonempty stage approval registry"),
  };
  const activatedCurrent = [...fixtureCurrent, activatedRegistryEntry]
    .sort((left, right) => compareCodeUnits(left.path, right.path));
  const activatedSource = renderControlIntegrityManifest({
    ...clearManifest,
    current: activatedCurrent,
  });
  expect(validateControlIntegrityCurrent(
    activatedSource,
    fixtureObserved(activatedCurrent),
    { stageRegistryNonEmpty: true },
  ).ok, "exact singleton-activated 55-path current inventory");
  expect(!validateControlIntegrityCurrent(
    activatedSource,
    fixtureObserved(activatedCurrent),
  ).ok, "empty registry state cannot claim activated inventory");
  expect(!validateControlIntegrityCurrent(
    clearSource,
    baseObserved,
    { stageRegistryNonEmpty: true },
  ).ok, "nonempty registry state requires activated inventory");
  const missingAuthorityCurrent = fixtureCurrent.filter((entry) => entry.path !== "README.md");
  const missingAuthoritySource = renderControlIntegrityManifest({
    ...clearManifest,
    current: missingAuthorityCurrent,
  });
  expect(!validateControlIntegrityCurrent(
    missingAuthoritySource,
    fixtureObserved(missingAuthorityCurrent),
  ).ok, "manifest authority-source omission rejected");
  expect(!validateControlIntegrityTransition({
    baseSource: missingAuthoritySource,
    headSource: clearSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH],
    baseObserved: fixtureObserved(missingAuthorityCurrent),
    headObserved: baseObserved,
  }).ok, "base authority-source disagreement rejected");
  expect(!validateControlIntegrityTransition({
    baseSource: clearSource,
    headSource: missingAuthoritySource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, "README.md"].sort(compareCodeUnits),
    baseObserved,
    headObserved: fixtureObserved(missingAuthorityCurrent),
  }).ok, "head authority-source disagreement rejected");
  expect(!validateControlIntegrityManifest(clearSource.trimEnd()).ok, "noncanonical control-integrity manifest");
  expect(!validateControlIntegrityManifest(renderControlIntegrityManifest({
    ...clearManifest,
    current: [fixtureEntry, fixtureEntry],
  })).ok, "duplicate current control path");
  expect(!validateControlIntegrityManifest(renderControlIntegrityManifest({
    ...clearManifest,
    next: { changes: [{ operation: "modify", ...fixtureEntry }] },
  })).ok, "no-op modification allowance");
  expect(!validateControlIntegrityManifest(renderControlIntegrityManifest({
    ...clearManifest,
    next: { changes: [{ operation: "delete", ...modifiedEntry }] },
  })).ok, "delete preimage mismatch");
  for (const [label, invalidEntry] of [
    ["symlink", { ...fixtureEntry, mode: "120000" }],
    ["submodule", { ...fixtureEntry, mode: "160000", type: "commit" }],
    ["executable", { ...fixtureEntry, mode: "100755" }],
  ]) {
    expect(!validateControlIntegrityManifest(renderControlIntegrityManifest({
      ...clearManifest,
      current: replaceFixtureEntry(fixtureCurrent, invalidEntry),
    })).ok, `${label} control entry rejected`);
  }
  expect(!validateControlIntegrityManifest(renderControlIntegrityManifest({
    ...clearManifest,
    next: { changes: [{
      operation: "add",
      path: "scripts/unbounded.mjs",
      mode: "100644",
      type: "blob",
      sha256: "3".repeat(64),
    }] },
  })).ok, "addition outside closed P0 namespace");
  expect(!validateControlIntegrityManifest(renderControlIntegrityManifest({
    ...clearManifest,
    next: { changes: [{
      operation: "add",
      path: STAGE0_WORKFLOW_GUARD_PATH,
      mode: "100644",
      type: "blob",
      sha256: "3".repeat(64),
    }] },
  })).ok, "guard path cannot be authorized");
  expect(!validateControlIntegrityManifest(renderControlIntegrityManifest({
    ...clearManifest,
    next: { changes: [{
      operation: "add",
      path: STAGE0_CONTROL_INTEGRITY_PATH,
      mode: "100644",
      type: "blob",
      sha256: "3".repeat(64),
    }] },
  })).ok, "manifest path cannot self-authorize");
  expect(validateControlIntegrityTransition({
    baseSource: clearSource,
    headSource: clearSource,
    changedPaths: ["docs/product/ordinary.md"],
    baseObserved,
    headObserved: baseObserved,
  }).ok, "clear base permits unrelated PR");
  for (const [label, changedPaths, clearHeadObserved] of [
    ["ordinary controlled modify", [fixtureEntry.path], fixtureObserved(replaceFixtureEntry(
      fixtureCurrent, { ...fixtureEntry, sha256: "9".repeat(64) },
    ))],
    ["ordinary controlled delete", [fixtureEntry.path], fixtureObserved(
      fixtureCurrent.filter((entry) => entry.path !== fixtureEntry.path),
    )],
    ["ordinary controlled mode change", [fixtureEntry.path], fixtureObserved(replaceFixtureEntry(
      fixtureCurrent, { ...fixtureEntry, mode: "100755" },
    ))],
    ["ordinary controlled type change", [fixtureEntry.path], fixtureObserved(replaceFixtureEntry(
      fixtureCurrent, { ...fixtureEntry, type: "tree" },
    ))],
    ["ordinary controlled rename", [fixtureEntry.path, "docs/product/ordinary-renamed.md"], fixtureObserved(
      fixtureCurrent.filter((entry) => entry.path !== fixtureEntry.path),
    )],
  ]) {
    expect(!validateControlIntegrityTransition({
      baseSource: clearSource,
      headSource: clearSource,
      changedPaths: changedPaths.sort(compareCodeUnits),
      baseObserved,
      headObserved: clearHeadObserved,
    }).ok, `${label} rejected`);
  }
  expect(!validateControlIntegrityTransition({
    baseSource: clearSource,
    headSource: clearSource,
    changedPaths: ["README.md", "tools/P0-bounded-authority.mjs"].sort(compareCodeUnits),
    baseObserved,
    headObserved: fixtureObserved(fixtureCurrent.map((entry) => (
      ["README.md", "tools/P0-bounded-authority.mjs"].includes(entry.path)
        ? { ...entry, sha256: sha256(`unratcheted:${entry.path}`) } : entry
    ))),
  }).ok, "scanner and authority source co-change without ratchet rejected");
  expect(validateControlIntegrityTransition({
    baseSource: clearSource,
    headSource: armedSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH],
    baseObserved,
    headObserved: baseObserved,
  }).transition === "armed", "manifest-only arm transition");
  expect(!validateControlIntegrityTransition({
    baseSource: clearSource,
    headSource: armedSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, fixtureEntry.path].sort(compareCodeUnits),
    baseObserved,
    headObserved: modifiedObserved,
  }).ok, "arm cannot change target in same PR");
  expect(!validateControlIntegrityTransition({
    baseSource: armedSource,
    headSource: armedSource,
    changedPaths: ["docs/product/unrelated.md"],
    baseObserved,
    headObserved: baseObserved,
  }).ok, "armed base rejects unrelated PR");
  expect(validateControlIntegrityTransition({
    baseSource: armedSource,
    headSource: clearSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH],
    baseObserved,
    headObserved: baseObserved,
  }).transition === "cancelled", "manifest-only cancellation");
  expect(!validateControlIntegrityTransition({
    baseSource: armedSource,
    headSource: clearSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, fixtureEntry.path].sort(compareCodeUnits),
    baseObserved,
    headObserved: baseObserved,
  }).ok, "cancellation cannot change target");
  expect(validateControlIntegrityTransition({
    baseSource: armedSource,
    headSource: consumedSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, fixtureEntry.path].sort(compareCodeUnits),
    baseObserved,
    headObserved: modifiedObserved,
  }).transition === "consumed", "exact full consumption");
  expect(!validateControlIntegrityTransition({
    baseSource: armedSource,
    headSource: consumedSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH],
    baseObserved,
    headObserved: modifiedObserved,
  }).ok, "partial consumption rejected");
  expect(!validateControlIntegrityTransition({
    baseSource: armedSource,
    headSource: consumedSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, "docs/product/extra.md", fixtureEntry.path]
      .sort(compareCodeUnits),
    baseObserved,
    headObserved: modifiedObserved,
  }).ok, "extra consumption path rejected");
  expect(!validateControlIntegrityTransition({
    baseSource: clearSource,
    headSource: consumedSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, fixtureEntry.path].sort(compareCodeUnits),
    baseObserved,
    headObserved: modifiedObserved,
  }).ok, "unarmed replay rejected");
  expect(!validateControlIntegrityTransition({
    baseSource: armedSource,
    headSource: consumedSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, fixtureEntry.path].sort(compareCodeUnits),
    baseObserved,
    headObserved: fixtureObserved(replaceFixtureEntry(modifiedCurrent, {
      ...modifiedEntry,
      sha256: "4".repeat(64),
    })),
  }).ok, "target byte mismatch rejected");
  const wrongHashEntry = { ...modifiedEntry, sha256: "6".repeat(64) };
  const wrongHashConsumedSource = renderControlIntegrityManifest({
    ...clearManifest,
    current: replaceFixtureEntry(fixtureCurrent, wrongHashEntry),
  });
  expect(!validateControlIntegrityTransition({
    baseSource: armedSource,
    headSource: wrongHashConsumedSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, fixtureEntry.path].sort(compareCodeUnits),
    baseObserved,
    headObserved: fixtureObserved(replaceFixtureEntry(fixtureCurrent, wrongHashEntry)),
  }).ok, "armed target manifest hash mismatch rejected");
  expect(!validateControlIntegrityTransition({
    baseSource: armedSource,
    headSource: consumedSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, fixtureEntry.path].sort(compareCodeUnits),
    baseObserved: fixtureObserved(replaceFixtureEntry(fixtureCurrent, {
      ...fixtureEntry,
      sha256: "7".repeat(64),
    })),
    headObserved: modifiedObserved,
  }).ok, "stale armed-base preimage rejected");
  const disagreeingHeadSource = renderControlIntegrityManifest({
    ...clearManifest,
    current: replaceFixtureEntry(fixtureCurrent, {
      ...fixtureEntry,
      sha256: "8".repeat(64),
    }),
  });
  expect(!validateControlIntegrityTransition({
    baseSource: clearSource,
    headSource: disagreeingHeadSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, fixtureEntry.path].sort(compareCodeUnits),
    baseObserved,
    headObserved: fixtureObserved(replaceFixtureEntry(fixtureCurrent, {
      ...fixtureEntry,
      sha256: "8".repeat(64),
    })),
  }).ok, "unarmed base-head manifest disagreement rejected");
  const armedModeSource = renderControlIntegrityManifest({
    ...clearManifest,
    next: { changes: [{ operation: "modify", ...executableEntry }] },
  });
  const consumedModeSource = renderControlIntegrityManifest({
    ...clearManifest,
    current: replaceFixtureEntry(fixtureCurrent, executableEntry),
  });
  expect(!validateControlIntegrityManifest(armedModeSource).ok, "executable allowance rejected");
  expect(!validateControlIntegrityTransition({
    baseSource: armedModeSource,
    headSource: consumedModeSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, fixtureEntry.path].sort(compareCodeUnits),
    baseObserved,
    headObserved: fixtureObserved(replaceFixtureEntry(fixtureCurrent, executableEntry)),
  }).ok, "executable transition rejected");
  expect(!validateControlIntegrityTransition({
    baseSource: armedSource,
    headSource: consumedSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, fixtureEntry.path].sort(compareCodeUnits),
    baseObserved,
    headObserved: fixtureObserved(replaceFixtureEntry(modifiedCurrent, {
      ...modifiedEntry,
      mode: "100755",
    })),
  }).ok, "observed executable mode rejected");
  expect(!validateControlIntegrityTransition({
    baseSource: armedSource,
    headSource: consumedSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, fixtureEntry.path].sort(compareCodeUnits),
    baseObserved,
    headObserved: fixtureObserved(replaceFixtureEntry(modifiedCurrent, {
      ...modifiedEntry,
      type: "tree",
    })),
  }).ok, "type mismatch rejected");
  const addedEntry = {
    path: "tools/P0-new-control.mjs",
    mode: "100644",
    type: "blob",
    sha256: "3".repeat(64),
  };
  const armedAddSource = renderControlIntegrityManifest({
    ...clearManifest,
    next: { changes: [{ operation: "add", ...addedEntry }] },
  });
  const addedCurrent = [...fixtureCurrent, addedEntry]
    .sort((left, right) => compareCodeUnits(left.path, right.path));
  expect(validateControlIntegrityTransition({
    baseSource: armedAddSource,
    headSource: renderControlIntegrityManifest({ ...clearManifest, current: addedCurrent }),
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, addedEntry.path].sort(compareCodeUnits),
    baseObserved,
    headObserved: fixtureObserved(addedCurrent),
  }).transition === "consumed", "closed-namespace addition consumed");
  const armedStageRegistrySource = renderControlIntegrityManifest({
    ...clearManifest,
    next: { changes: [{ operation: "add", ...activatedRegistryEntry }] },
  });
  expect(validateControlIntegrityTransition({
    baseSource: armedStageRegistrySource,
    headSource: activatedSource,
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, STAGE0_STAGE_APPROVAL_REGISTRY_PATH]
      .sort(compareCodeUnits),
    baseObserved,
    headObserved: fixtureObserved(activatedCurrent),
  }).transition === "consumed", "first nonempty stage registry activates singleton inventory path");
  const deleteCurrent = fixtureCurrent;
  const deletedCurrent = fixtureCurrent.filter((entry) => entry.path !== fixtureEntry.path);
  const armedDeleteSource = renderControlIntegrityManifest({
    ...clearManifest,
    current: deleteCurrent,
    next: { changes: [{ operation: "delete", ...fixtureEntry }] },
  });
  expect(validateControlIntegrityTransition({
    baseSource: armedDeleteSource,
    headSource: renderControlIntegrityManifest({ ...clearManifest, current: deletedCurrent }),
    changedPaths: [STAGE0_CONTROL_INTEGRITY_PATH, fixtureEntry.path].sort(compareCodeUnits),
    baseObserved: fixtureObserved(deleteCurrent),
    headObserved: fixtureObserved(deletedCurrent),
  }).transition === "consumed", "exact deletion consumed");
  const mixedCaseBaseCurrent = CONTROL_INTEGRITY_PATHS.map((filePath) => ({
    path: filePath,
    mode: "100644",
    type: "blob",
    sha256: sha256(`mixed-base:${filePath}`),
  }));
  const mixedAdd = {
    operation: "add",
    path: "tools/P0-Z-code-unit-order.mjs",
    mode: "100644",
    type: "blob",
    sha256: sha256("mixed-add"),
  };
  const mixedModify = {
    operation: "modify",
    ...mixedCaseBaseCurrent.find((entry) => entry.path === "tools/P0-stage0-ci.mjs"),
    sha256: sha256("mixed-modify"),
  };
  const mixedDelete = {
    operation: "delete",
    ...mixedCaseBaseCurrent.find((entry) => entry.path === "tools/P0-content-safety.mjs"),
  };
  const mixedChanges = [mixedAdd, mixedModify, mixedDelete]
    .sort((left, right) => compareCodeUnits(left.path, right.path));
  const mixedApplied = applyControlIntegrityChanges(mixedCaseBaseCurrent, mixedChanges);
  const mixedArmedSource = renderControlIntegrityManifest({
    schemaVersion: CONTROL_INTEGRITY_SCHEMA_VERSION,
    current: mixedCaseBaseCurrent,
    next: { changes: mixedChanges },
  });
  const mixedHeadSource = renderControlIntegrityManifest({
    schemaVersion: CONTROL_INTEGRITY_SCHEMA_VERSION,
    current: mixedApplied,
    next: null,
  });
  const parsedMixedHead = validateControlIntegrityManifest(mixedHeadSource);
  expect(parsedMixedHead.ok
    && canonicalJson(parsedMixedHead.manifest.current) === canonicalJson(mixedApplied),
  "mixed-case canonical head equals applied inventory");
  expect(validateControlIntegrityTransition({
    baseSource: mixedArmedSource,
    headSource: mixedHeadSource,
    changedPaths: [
      STAGE0_CONTROL_INTEGRITY_PATH,
      ...mixedChanges.map((change) => change.path),
    ].sort(compareCodeUnits),
    baseObserved: fixtureObserved(mixedCaseBaseCurrent),
    headObserved: fixtureObserved(mixedApplied),
  }).transition === "consumed", "mixed-case add-modify-delete arm-to-consume transition");
  expect(!validateControlIntegrityTransition({
    baseSource: clearSource,
    headSource: clearSource,
    changedPaths: [".github/workflows/colliding-check-name.yml"],
    baseObserved,
    headObserved: baseObserved,
  }).ok, "workflow check-name collision path rejected");
  expect(!validateControlIntegrityTransition({
    baseSource: clearSource,
    headSource: clearSource,
    changedPaths: [STAGE0_WORKFLOW_GUARD_PATH],
    baseObserved,
    headObserved: baseObserved,
  }).ok, "guard change rejected by state machine");
  expect(validateToolInventory(CONTROL_TOOL_PATHS).ok, "tool inventory");
  expect(!validateToolInventory(CONTROL_TOOL_PATHS.slice(1)).ok, "missing tool");
  expect(!validateToolInventory([...CONTROL_TOOL_PATHS, "tools/P0-shadow-runner.mjs"]).ok, "extra tool");
  const result = (id) => ({ id, status: 0, outputSha256: sha256(id), outputBytes: 1 });
  expect(validatePassResults([result("one"), result("two")], ["one", "two"]).ok, "valid results");
  expect(!validatePassResults(null, ["one"]).ok, "absent results");
  expect(!validatePassResults([], ["one"]).ok, "empty results");
  expect(!validatePassResults([result("one")], []).ok, "absent expected result IDs");
  expect(!validatePassResults([result("one")], ["one", "two"]).ok, "missing result");
  expect(!validatePassResults([result("two"), result("one")], ["one", "two"]).ok, "reordered results");
  expect(!validatePassResults([result("one"), result("one")], ["one", "two"]).ok, "duplicate result");
  expect(!validatePassResults([{ id: "one", status: 1, outputSha256: "0".repeat(64), outputBytes: 0 }], ["one"]).ok, "nonzero result");
  expect(!validatePassResults([{ ...result("one"), ignored: true }], ["one"]).ok, "extra result field");
  expect(!validatePassResults([{ ...result("one"), outputSha256: "not-a-digest" }], ["one"]).ok, "invalid result digest");
  expect(!validatePassResults([{ ...result("one"), outputBytes: -1 }], ["one"]).ok, "invalid result byte count");
  return Object.freeze({ ok: true, code: "P0_STAGE0_CI_SELF_TEST_OK", cases });
}

function git(repoRoot, args) {
  const result = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`P0_STAGE0_CI_GIT_FAILED: ${args[0]}`);
  return result.stdout.trim();
}

function safeEnvironment() {
  return {
    PATH: process.env.PATH ?? "",
    HOME: process.env.HOME ?? "",
    LANG: "C.UTF-8",
    LC_ALL: "C.UTF-8",
    TZ: "Asia/Kolkata",
    CI: "true",
  };
}

function runCommand(repoRoot, [id, command, args, expected], childEnvironment) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: childEnvironment,
    maxBuffer: 256 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`P0_STAGE0_CI_COMMAND_FAILED: ${id} status=${result.status} stderrSha256=${sha256(result.stderr ?? "")}`);
  }
  const output = result.stdout ?? "";
  if (expected !== null) {
    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch {
      throw new Error(`P0_STAGE0_CI_RESULT_MISSING: ${id}`);
    }
    if (!containsExpected(parsed, expected)) throw new Error(`P0_STAGE0_CI_RESULT_INVALID: ${id}`);
  }
  return Object.freeze({ id, status: 0, outputSha256: sha256(output), outputBytes: Buffer.byteLength(output) });
}

function treeDigest(directory) {
  const files = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  return Object.freeze({
    fileCount: files.length,
    sha256: sha256(files.map((file) => `${file}\0${sha256(readFileSync(path.join(directory, file)))}\n`).join("")),
  });
}

function commandIds() {
  return [
    ...CONTROL_TOOL_PATHS.map((file) => `syntax:${file}`),
    ...TEST_COMMANDS.map(([id]) => id),
    ...TRUST_COMMANDS.map(([id]) => id),
    "prototype_v10",
    ...GENERATION_COMMANDS.map(([id]) => id),
    "github_sync_determinism",
    "wiki_determinism",
    "worktree_clean",
  ];
}

function runPass(repoRoot, revision, passNumber) {
  const childEnvironment = safeEnvironment();
  const results = [];
  for (const file of CONTROL_TOOL_PATHS) {
    results.push(runCommand(repoRoot, [`syntax:${file}`, "node", ["--check", file], null], childEnvironment));
  }
  for (const command of TEST_COMMANDS) results.push(runCommand(repoRoot, command, childEnvironment));
  for (const command of TRUST_COMMANDS) results.push(runCommand(repoRoot, command, childEnvironment));
  const prototypeApp = runCommand(repoRoot, [
    "prototype_v10_app",
    "node",
    ["--check", "prototypes/calendar-ui/app-v10.js"],
    null,
  ], childEnvironment);
  const prototypeServer = runCommand(repoRoot, [
    "prototype_v10_server",
    "node",
    ["--check", "prototypes/calendar-ui/serve.mjs"],
    null,
  ], childEnvironment);
  results.push(Object.freeze({
    id: "prototype_v10",
    status: 0,
    outputSha256: sha256(canonicalJson([prototypeApp, prototypeServer])),
    outputBytes: prototypeApp.outputBytes + prototypeServer.outputBytes,
  }));
  for (const command of GENERATION_COMMANDS) results.push(runCommand(repoRoot, command, childEnvironment));

  const syncOne = runCommand(repoRoot, [`sync_plan_${passNumber}_1`, "node", ["tools/sync_phase1_github.mjs"], {}], childEnvironment);
  const syncTwo = runCommand(repoRoot, [`sync_plan_${passNumber}_2`, "node", ["tools/sync_phase1_github.mjs"], {}], childEnvironment);
  if (syncOne.outputSha256 !== syncTwo.outputSha256 || syncOne.outputBytes !== syncTwo.outputBytes) {
    throw new Error("P0_STAGE0_CI_SYNC_NONDETERMINISTIC");
  }
  results.push(Object.freeze({
    id: "github_sync_determinism",
    status: 0,
    outputSha256: syncOne.outputSha256,
    outputBytes: syncOne.outputBytes,
  }));

  const wikiRoot = mkdtempSync(path.join(tmpdir(), `p0-stage0-ci-${passNumber}-`));
  const firstWiki = path.join(wikiRoot, "wiki-1");
  const secondWiki = path.join(wikiRoot, "wiki-2");
  try {
    runCommand(repoRoot, [`wiki_build_${passNumber}_1`, "node", ["tools/build-wiki.mjs", firstWiki, revision], {}], childEnvironment);
    runCommand(repoRoot, [`wiki_trust_${passNumber}_1`, "node", ["tools/P0-wiki-trust.mjs", "--revision", revision, "--wiki-directory", firstWiki], { passed: true }], childEnvironment);
    runCommand(repoRoot, [`wiki_build_${passNumber}_2`, "node", ["tools/build-wiki.mjs", secondWiki, revision], {}], childEnvironment);
    runCommand(repoRoot, [`wiki_trust_${passNumber}_2`, "node", ["tools/P0-wiki-trust.mjs", "--revision", revision, "--wiki-directory", secondWiki], { passed: true }], childEnvironment);
    const firstDigest = treeDigest(firstWiki);
    const secondDigest = treeDigest(secondWiki);
    if (canonicalJson(firstDigest) !== canonicalJson(secondDigest)) throw new Error("P0_STAGE0_CI_WIKI_NONDETERMINISTIC");
    results.push(Object.freeze({
      id: "wiki_determinism",
      status: 0,
      outputSha256: firstDigest.sha256,
      outputBytes: firstDigest.fileCount,
    }));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }

  const status = git(repoRoot, ["status", "--porcelain=v1", "--untracked-files=all"]);
  if (status !== "") throw new Error(`P0_STAGE0_CI_WORKTREE_DRIFT: sha256=${sha256(status)}`);
  results.push(Object.freeze({ id: "worktree_clean", status: 0, outputSha256: sha256(status), outputBytes: 0 }));
  const expectedIds = commandIds();
  const validation = validatePassResults(results, expectedIds);
  if (!validation.ok) throw new Error(`P0_STAGE0_CI_PASS_INVALID: ${validation.findings.join(",")}`);
  return Object.freeze({ results, digest: sha256(canonicalJson(results)) });
}

function actualToolPaths(repoRoot) {
  return readdirSync(path.join(repoRoot, "tools"), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mjs"))
    .map((entry) => `tools/${entry.name}`)
    .sort(compareCodeUnits);
}

function stageRegistryHasRecords(repoRoot) {
  let registry;
  try {
    registry = JSON.parse(readFileSync(path.join(repoRoot, STAGE0_STAGE_APPROVAL_REGISTRY_PATH), "utf8"));
  } catch {
    throw new Error("P0_STAGE0_CI_STAGE_REGISTRY_STATE_INVALID");
  }
  if (registry === null || typeof registry !== "object" || Array.isArray(registry)
    || !Array.isArray(registry.preparationReviews) || !Array.isArray(registry.stageApprovals)) {
    throw new Error("P0_STAGE0_CI_STAGE_REGISTRY_STATE_INVALID");
  }
  return registry.preparationReviews.length !== 0 || registry.stageApprovals.length !== 0;
}

function localControlIntegrityObserved(repoRoot, filePaths = ACTIVATED_CONTROL_INTEGRITY_PATHS) {
  return Object.fromEntries(filePaths.map((filePath) => {
    const absolutePath = path.join(repoRoot, filePath);
    const metadata = lstatSync(absolutePath);
    if (!metadata.isFile()) throw new Error(`P0_STAGE0_CI_CONTROL_PATH_INVALID:${filePath}`);
    return [filePath, {
      mode: (metadata.mode & 0o111) === 0 ? "100644" : "100755",
      type: "blob",
      sha256: sha256(readFileSync(absolutePath)),
    }];
  }));
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    process.stdout.write("Usage: node tools/P0-stage0-ci.mjs [--self-test|--help]\n");
    return;
  }
  if (args.length === 1 && args[0] === "--self-test") {
    process.stdout.write(`${JSON.stringify(stage0SelfTest())}\n`);
    return;
  }
  if (args.length !== 0) throw new Error("P0_STAGE0_CI_UNKNOWN_ARGUMENT");

  const repoRoot = git(process.cwd(), ["rev-parse", "--show-toplevel"]);
  const revision = git(repoRoot, ["rev-parse", "HEAD^{commit}"]);
  const expectedRevision = process.env.P0_EXPECTED_REVISION ?? revision;
  if (!/^[0-9a-f]{40}$/.test(expectedRevision) || expectedRevision !== revision) {
    throw new Error("P0_STAGE0_CI_REVISION_MISMATCH");
  }
  if (git(repoRoot, ["status", "--porcelain=v1", "--untracked-files=all"]) !== "") {
    throw new Error("P0_STAGE0_CI_REQUIRES_CLEAN_WORKTREE");
  }
  const inventory = validateToolInventory(actualToolPaths(repoRoot));
  if (!inventory.ok) throw new Error(`P0_STAGE0_CI_TOOL_INVENTORY_INVALID: ${inventory.findings.join(",")}`);
  const workflowSource = readFileSync(path.join(repoRoot, STAGE0_PROTECTED_WORKFLOW_PATH), "utf8");
  const workflow = validateWorkflowContract(workflowSource);
  if (!workflow.ok) throw new Error(`P0_STAGE0_CI_WORKFLOW_INVALID: ${workflow.findings.join(",")}`);
  const workflowGuardSource = readFileSync(path.join(repoRoot, STAGE0_WORKFLOW_GUARD_PATH), "utf8");
  const workflowGuard = validateWorkflowGuardContract(workflowGuardSource);
  if (!workflowGuard.ok) throw new Error(`P0_STAGE0_CI_WORKFLOW_GUARD_INVALID: ${workflowGuard.findings.join(",")}`);
  const stageRegistryNonEmpty = stageRegistryHasRecords(repoRoot);
  const controlIntegritySource = readFileSync(path.join(repoRoot, STAGE0_CONTROL_INTEGRITY_PATH), "utf8");
  const controlIntegrity = validateControlIntegrityCurrent(
    controlIntegritySource,
    localControlIntegrityObserved(repoRoot),
    { stageRegistryNonEmpty },
  );
  if (!controlIntegrity.ok) {
    throw new Error(`P0_STAGE0_CI_CONTROL_INTEGRITY_INVALID: ${controlIntegrity.findings.join(",")}`);
  }

  const first = runPass(repoRoot, revision, 1);
  const second = runPass(repoRoot, revision, 2);
  if (first.digest !== second.digest) throw new Error("P0_STAGE0_CI_TWO_PASS_MISMATCH");
  const suiteDefinition = {
    schemaVersion: STAGE0_CI_SCHEMA_VERSION,
    toolPaths: CONTROL_TOOL_PATHS,
    authoritySourcePaths: CONTROL_AUTHORITY_SOURCE_PATHS,
    controlIntegrityPaths: controlIntegrity.manifest.current.map((entry) => entry.path),
    activatableControlIntegrityPaths: CONTROL_INTEGRITY_ACTIVATABLE_PATHS,
    resultIds: commandIds(),
    passCount: 2,
    workflowContracts: [
      { path: STAGE0_PROTECTED_WORKFLOW_PATH, sha256: STAGE0_PROTECTED_WORKFLOW_SHA256 },
      { path: STAGE0_WORKFLOW_GUARD_PATH, sha256: STAGE0_WORKFLOW_GUARD_SHA256 },
    ],
    controlIntegrityPath: STAGE0_CONTROL_INTEGRITY_PATH,
  };
  const report = {
    ok: true,
    code: "P0_STAGE0_CI_OK",
    schemaVersion: STAGE0_CI_SCHEMA_VERSION,
    revision,
    passCount: 2,
    suiteDefinitionSha256: `sha256:${sha256(canonicalJson(suiteDefinition))}`,
    resultManifestSha256: `sha256:${first.digest}`,
    results: first.results,
  };
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, [
      "## P0/R0 Stage 0 exact-head controls",
      "",
      `- Revision: \`${report.revision}\``,
      `- Full deterministic passes: **${report.passCount}**`,
      `- Suite definition: \`${report.suiteDefinitionSha256}\``,
      `- Result manifest: \`${report.resultManifestSha256}\``,
      "- Result: **Pass**",
      "",
    ].join("\n"));
  }
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
