import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  ARTIFACT_KINDS,
  COUNCIL_SEATS,
  DESIGN_ACCESSIBILITY_DIMENSIONS,
  DESIGN_STATE_DIMENSIONS,
  READINESS_SCHEMA_VERSION,
  SCOPE_ACTION_COMPATIBILITY,
  TASK_FILE_DESCENDANT_DELTA_PATHS,
  TASK_FILE_DIFF_EXCLUSIONS,
  TASK_FILE_GIT_MODES,
  TASK_FILE_PURPOSES,
  evaluateReadiness,
  executeRefreshTransaction,
  parseArtifactControlMarkers,
  planProtectedRefresh,
} from "./P0-readiness-gates.mjs";
import {
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
} from "./P0-verify-execution-start.mjs";
import { assertDuplicateKeyRejection, parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";

const repoRoot = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(repoRoot, "docs/project/PHASE1-ROADMAP-MANIFEST.json");
const issueMapPath = path.join(repoRoot, "docs/project/PHASE1-GITHUB-ISSUES.json");
const outputRoot = path.join(repoRoot, "docs/work-items");
const registerPath = path.join(repoRoot, "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json");
const readinessStatePath = path.join(repoRoot, "docs/project/P0-PHASE1-TASK-READINESS-STATE.json");
const reviewerRegistryPath = path.join(repoRoot, "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json");
const approvalRegistryPath = path.join(repoRoot, "docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json");
const ownerActionStatePath = path.join(repoRoot, "docs/council/execution/P0-OWNER-ACTION-STATE.json");
const generatedAt = "2026-08-16";
const repositoryUrl = "https://github.com/arunpr614/Life-Reflection";
const projectUrl = "https://github.com/users/arunpr614/projects/1";
const policyPath = "docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md";

const args = new Set(process.argv.slice(2));
const supportedArgs = new Set(["--refresh-drafts", "--help"]);
const unknownArgs = [...args].filter((arg) => !supportedArgs.has(arg));
if (unknownArgs.length) throw new Error(`Unknown argument(s): ${unknownArgs.join(", ")}`);
if (args.has("--help")) {
  console.log(`Usage: node tools/P0-generate-task-artifacts.mjs [--refresh-drafts]\n\nDefault: create missing task artifacts, preserve every existing artifact, and recompute the register.\n--refresh-drafts: replace only artifacts whose current state is draft; never replace in-review, approved, blocked, or not-applicable artifacts.`);
  process.exit(0);
}
const refreshDrafts = args.has("--refresh-drafts");

const refreshLockPath = path.resolve(repoRoot, execFileSync("git", ["rev-parse", "--git-path", "P0-readiness-refresh.lock"], {
  cwd: repoRoot,
  encoding: "utf8",
}).trim());
let refreshLockOwned = false;
try {
  fs.mkdirSync(refreshLockPath);
  refreshLockOwned = true;
} catch (error) {
  if (error?.code === "EEXIST") {
    throw new Error("REFRESH_LOCKED: another generator or an uninspected interrupted run owns P0-readiness-refresh.lock");
  }
  throw error;
}
process.on("exit", () => {
  if (!refreshLockOwned) return;
  try { fs.rmdirSync(refreshLockPath); } catch { /* a retained lock is fail-closed on the next run */ }
});

const manifestContent = fs.readFileSync(manifestPath, "utf8");
const issueMapContent = fs.readFileSync(issueMapPath, "utf8");
const readinessStateContent = fs.readFileSync(readinessStatePath, "utf8");
const reviewerRegistryContent = fs.readFileSync(reviewerRegistryPath, "utf8");
const approvalRegistryContent = fs.readFileSync(approvalRegistryPath, "utf8");
const ownerActionStateContent = fs.readFileSync(ownerActionStatePath, "utf8");
assertDuplicateKeyRejection();
const manifest = parseJsonWithoutDuplicateKeys(manifestContent, path.relative(repoRoot, manifestPath));
const issueMap = parseJsonWithoutDuplicateKeys(issueMapContent, path.relative(repoRoot, issueMapPath)).issues ?? {};
const readinessState = parseJsonWithoutDuplicateKeys(readinessStateContent, path.relative(repoRoot, readinessStatePath));
const reviewerRegistry = parseJsonWithoutDuplicateKeys(reviewerRegistryContent, path.relative(repoRoot, reviewerRegistryPath));
const approvalRegistry = parseJsonWithoutDuplicateKeys(approvalRegistryContent, path.relative(repoRoot, approvalRegistryPath));
const ownerActionState = parseJsonWithoutDuplicateKeys(ownerActionStateContent, path.relative(repoRoot, ownerActionStatePath));
if (manifest.tasks?.length !== 58 || Object.keys(issueMap).length !== 58) {
  throw new Error("Task artifacts require exactly 58 manifest tasks and 58 issue-map entries");
}
const taskIds = new Set(manifest.tasks.map((task) => task.id));
validateReadinessState(readinessState, taskIds);
if (readinessState.reviewerRegistryPath !== path.relative(repoRoot, reviewerRegistryPath)
  || readinessState.approvalRegistryPath !== path.relative(repoRoot, approvalRegistryPath)
  || readinessState.ownerActionStatePath !== path.relative(repoRoot, ownerActionStatePath)) {
  throw new Error("Readiness-state registry paths do not match the canonical P0 control files");
}

const deferredIds = manifest.requirementMap
  .filter((entry) => entry.primaryMilestone === "Deferred")
  .map((entry) => entry.requirementId);
const sha256 = (content) => crypto.createHash("sha256").update(content).digest("hex");
const asList = (values, empty = "None") => values?.length ? values.map((value) => `- ${value}`).join("\n") : `- ${empty}`;
const codeList = (values, empty = "None") => values?.length ? values.map((value) => `\`${value}\``).join(", ") : empty;
const mdLink = (label, target) => `[${label}](${target})`;
const relativeLink = (fromFile, targetFile) => {
  const fromDirectory = path.dirname(path.join(repoRoot, fromFile));
  const target = path.join(repoRoot, targetFile);
  const relative = path.relative(fromDirectory, target).replaceAll(path.sep, "/");
  return relative.startsWith(".") ? relative : `./${relative}`;
};
const sourceLinks = (fromFile, paths) => paths
  .map((filePath) => `- ${mdLink(filePath, relativeLink(fromFile, filePath))}`)
  .join("\n");

const artifactKinds = {
  product: "PRD",
  architecture: "TECHNICAL-PLAN",
  design: "DESIGN-SPEC",
  qa: "QA-PLAN",
  delivery: "DELIVERY-CHECKLIST",
  council: "COUNCIL-READINESS",
};
const allowedArtifactStates = new Set(["missing", "draft", "in-review", "approved", "blocked", "not-applicable"]);

function artifactStateFromContent(content, taskId, kind) {
  const markers = parseArtifactControlMarkers(content, { taskId, artifactKind: kind });
  if (!markers.valid) {
    const codes = [...new Set(markers.errors.map((error) => error.code))].join(", ");
    throw new Error(`${taskId} ${kind}: invalid artifact control markers (${codes})`);
  }
  return markers.artifactState;
}

function artifactPath(taskId, kind) {
  return `docs/work-items/${taskId}/P0-${taskId}-${artifactKinds[kind]}.md`;
}

function ownerActionsFor(task) {
  return ownerActionIdsFor(task);
}

function executionScopeFor(task) {
  const override = readinessState.taskOverrides?.[task.id] ?? {};
  return executionScopeLabelFor(task, requestedScopeFor(task, override));
}

function controlBlock(task, kind, state = "draft") {
  return `- **Task ID:** \`${task.id}\`
- **Artifact kind:** \`${kind}\`
- **Artifact state:** \`${state}\`
- **Roadmap status:** \`${task.status}\`
- **Milestone:** \`${task.milestone}\`
- **Execution allowed:** \`false\`
- **Evidence boundary:** Creation of this draft does not approve implementation, deployment, testing, restore, release, or production use.`;
}

function parentInputs(task, fromFile) {
  const paths = [
    task.prdPidPath,
    task.architecturePath,
    ...task.designArtifactPaths,
    policyPath,
    "docs/council/agents/P0-QA-LEAD.md",
    "docs/council/execution/P0-OWNER-ACTION-LEDGER.md",
  ];
  return sourceLinks(fromFile, [...new Set(paths)]);
}

function productArtifact(task, filePath, ownerActions) {
  const scenarioIds = [`${task.id}-P-001`, `${task.id}-P-002`, `${task.id}-P-003`];
  return `# ${task.id} — task product requirements

${controlBlock(task, "product")}

## Parent product source

${sourceLinks(filePath, [task.prdPidPath, "docs/product/PRODUCT-REQUIREMENTS.md"])}

## Task outcome

${task.description}

This artifact narrows the parent release contract to \`${task.id}\`. It does not expand the release, change source precedence, or make a shared parent document task approval.

## Scope and traceability

- **Task type:** ${task.taskType}
- **Owner role:** ${task.ownerRole}
- **Requirement IDs:** ${codeList(task.requirementIds, "Planning-only")}
- **Dependencies:** ${codeList(task.dependencies)}
- **Deferred requirements excluded:** ${codeList(deferredIds)}

## Product acceptance scenarios

1. **\`${scenarioIds[0]}\` — Outcome:** the task produces exactly the outcome above and the result is reviewable without implying a later task or release is complete.
2. **\`${scenarioIds[1]}\` — Boundary:** every mapped requirement is addressed, every deferred requirement stays absent, and no authentic/private/human-only act is inferred from synthetic or public evidence.
3. **\`${scenarioIds[2]}\` — Evidence:** the task's named acceptance evidence is retrievable, task-bound, independently reviewable, and no broader than the supported claim.

## Required acceptance evidence

${task.acceptanceEvidence}

## Product metric

Primary task metric: all mapped requirement outcomes and the three task scenarios have retrievable pass/fail evidence, with zero unresolved scope or product decision.

## Non-goals

- Do not implement work owned by a dependent or later task.
- Do not admit ${task.milestone === "R0" ? "authentic memories" : "authentic content without its named owner gate"}.
- Do not treat a prototype, document, code path, CI result, deployment, or backup upload as release acceptance.
- Do not add the seven deferred requirements.

## Owner actions

${asList(ownerActions.map((id) => `\`${id}\` — see the Owner Action Ledger`), "None currently mapped")}

These are relevant future gates, not a request for secrets or owner action during local task-artifact authoring. Their due/satisfied state is recorded separately in the readiness register.

## Open product decisions

- Five-seat task-level Product approval is pending.
- Acceptance scenarios must be confirmed against the exact stable candidate before this artifact can become \`approved\`.

## Product Manager disposition

**Draft / Hold.** The parent PRD/PID is a planning input. Substantive execution is not permitted until this exact task artifact and the complete dossier pass council review.
`;
}

function technicalArtifact(task, filePath) {
  const scenarioIds = [`${task.id}-T-001`, `${task.id}-T-002`, `${task.id}-T-003`];
  return `# ${task.id} — task technical plan

${controlBlock(task, "architecture")}

## Parent inputs

${parentInputs(task, filePath)}

## Technical objective

Translate **${task.title}** into a reversible, bounded implementation or evidence plan for this task only:

> ${task.description}

## Required task-specific decisions

| Area | Required before approval | Current draft state |
| --- | --- | --- |
| Modules and files | Exact owned packages/files, interfaces, and PR decomposition | Not frozen |
| ADRs | Accepted decisions and explicitly rejected alternatives | Not frozen |
| APIs and integrations | Inputs, outputs, auth, validation, timeouts, retries, pagination, rate/size bounds | Not frozen |
| Data and schema | Shapes, invariants, indexes, migrations, compatibility, inventory | Not frozen |
| Trust boundaries | Threats, secrets, logs, cache, private evidence, AI allowlists/exclusions | Not frozen |
| Concurrency | Transactions, idempotency, replay, leases, crash/restart behavior | Not frozen |
| Operations | Capacity assumptions, dependency failure, observability, alerts | Not frozen |
| Recovery | Backup, separate-path restore, rollback and forward-fix | Not frozen |

## Task contracts

- **Requirements:** ${codeList(task.requirementIds, "Planning-only")}
- **Dependencies:** ${codeList(task.dependencies)}
- **Persistent-state / recovery impact:** ${task.rollbackRestoreImpact}
- **Health vocabulary:** durable state is exactly one of \`unknown\`, \`never run\`, \`success\`, \`delayed\`, \`failed\`, or \`blocked\`; \`Healthy\` is the UX label for \`success\`. Recovery verification is separate evidence/detail.
- **Authentic-media boundary:** no agent or AI-controlled tool opens, renders, thumbnails, OCRs, screenshots, or inspects authentic photos or photo-derived data.

## Technical verification scenarios

1. **\`${scenarioIds[0]}\` — Boundary and failure:** invalid, absent, repeated, interrupted, or out-of-order inputs fail safely and leave no partial or falsely successful state.
2. **\`${scenarioIds[1]}\` — Recovery:** every persistent shape introduced or changed by this task is inventoried, backed up, restored in a separate empty path, compared, and rolled back or forward-fixed.
3. **\`${scenarioIds[2]}\` — Isolation:** privacy, security, resource, dependency, and co-resident failure cannot broaden access, leak sensitive data, or corrupt an accepted earlier release.

## Proposed sequence

1. Freeze task-owned modules/files, interfaces, schemas, ADRs, threats, and fixtures.
2. Obtain Design and QA concurrence on states, errors, accessibility, scenario IDs, evidence, and stop conditions.
3. Record exact dependency-entry and authority evidence.
4. Implement only the smallest council-approved scope with fictional/synthetic fixtures.
5. Produce immutable build, migration, test, restore, rollback, and no-regression evidence.
6. Submit a stable commit and artifact hashes to independent QA and the full council.

## Stop conditions

- Any required decision above remains unfrozen.
- Private target facts or authority are needed but unavailable.
- A human-only owner action is due.
- A privacy, security, recovery, accessibility, evidence, or specialist veto remains.

## Technical Architect disposition

**Draft / Hold.** The global implementation plan is useful source material but is not this task's approved detailed plan.
`;
}

function designArtifact(task, filePath) {
  const scenarioIds = [`${task.id}-D-001`, `${task.id}-D-002`, `${task.id}-D-003`];
  return `# ${task.id} — task design specification

${controlBlock(task, "design")}

## Design inputs

${sourceLinks(filePath, [...new Set([task.prdPidPath, ...task.designArtifactPaths, policyPath])])}

## Experience objective

Specify every human-facing, operator-facing, status, error, privacy, recovery, and accessibility consequence of **${task.title}** without treating shared specifications or prototypes as task approval.

## Required state family

- normal and success;
- empty and never-run;
- loading and long-running;
- validation and dependency error;
- interruption, timeout, retry, and stale result;
- denied, expired, blocked, unavailable, and not-configured prerequisite;
- destructive, spend-bearing, migration, recovery, and rollback states where applicable;
- wide, compact, 320 px, 200% text, 400% page zoom, landscape, light/dark theme, and reduced-motion behavior; and
- keyboard order, focus entry/return, semantic names, live-region behavior, non-color cues, target size, contrast, and screen-reader reading order.

## Task traceability

- **Outcome:** ${task.description}
- **Requirement IDs:** ${codeList(task.requirementIds, "Planning-only")}
- **Parent design sources:** ${task.designArtifactPaths.map((value) => `\`${value}\``).join(", ")}
- **Prototype boundary:** frozen prototypes are interaction inputs only; they do not prove runtime auth, persistence, privacy, recovery, accessibility conformance, or production behavior.

## Design verification scenarios

1. **\`${scenarioIds[0]}\` — Complete states:** the applicable state family above is specified with exact content and permitted actions.
2. **\`${scenarioIds[1]}\` — Responsive/accessibility:** the task remains understandable and operable across the named responsive, keyboard, focus, screen-reader, contrast, zoom, theme, and motion conditions.
3. **\`${scenarioIds[2]}\` — Truth/privacy:** copy never claims success before durable evidence, never confuses backup with restore, and never exposes authentic/private data in review artifacts.

## Open design decisions

- Exact task-specific journeys, layouts, components, content, and state applicability require Designer review.
- Architecture-dependent timing, evidence sources, recovery, failure, and maintenance facts remain provisional until the technical plan is approved.
- Any \`not-applicable\` decision requires a concrete rationale and explicit Designer/council concurrence; this draft does not assert it.

## UI/UX Designer disposition

**Draft / Hold.** Shared UX and prototype sources are inputs. Substantive implementation cannot start until the task-specific design contract is approved or validly marked not applicable.
`;
}

function qaArtifact(task, filePath) {
  const scenarioIds = [
    `${task.id}-QA-001`, `${task.id}-QA-002`, `${task.id}-QA-003`,
    `${task.id}-QA-004`, `${task.id}-QA-005`, `${task.id}-QA-006`,
  ];
  return `# ${task.id} — task QA plan

${controlBlock(task, "qa")}

## QA inputs

${parentInputs(task, filePath)}

## Test objective

Independently determine whether **${task.title}** satisfies its exact requirements and bounded claim in the named environment, using fictional/synthetic fixtures unless a later explicit human gate authorizes otherwise.

## Scenario matrix

| Scenario | Required coverage | Current state |
| --- | --- | --- |
| \`${scenarioIds[0]}\` | Happy path and exact task outcome: ${task.description} | Draft |
| \`${scenarioIds[1]}\` | Invalid, missing, duplicate, replayed, interrupted, timeout, stale, dependency-failure, and retry behavior | Draft |
| \`${scenarioIds[2]}\` | Privacy/security/authorization, secret/log/cache/export/backup/evidence scans, and AI exclusions | Draft |
| \`${scenarioIds[3]}\` | Schema, migration, compatibility, inventory, backup, separate-path restore, rollback/forward-fix | Draft |
| \`${scenarioIds[4]}\` | Supported browsers, keyboard, focus, screen reader, contrast, 320 px, text/page zoom, landscape, themes, reduced motion | Draft |
| \`${scenarioIds[5]}\` | Dependencies, co-resident/non-regression scope, performance/capacity bounds, observability and exact health states | Draft |

## Traceability and fixtures

- **Requirement IDs:** ${codeList(task.requirementIds, "Planning-only")}
- **Dependencies:** ${codeList(task.dependencies)}
- **Fixture class:** fictional/synthetic; fingerprint and authentic-content exclusion required in executed evidence.
- **Deferred negative scope:** ${codeList(deferredIds)} must remain absent.

## Evidence bundle

Executed evidence records task/release/requirement/scenario IDs, source SHA, artifact and dependency/SBOM digests, fixture fingerprint, environment class, sanitized configuration digest, exact commands/tool versions, expected/actual results and timestamps, defects/retests, schema/migration state, backup/restore/rollback result, reviewer identity/independence, opaque private evidence reference when authorized, remaining limitations, and exact permitted claim.

## Independence and severity gate

The executing QA reviewer must not be the candidate implementer. Any unresolved Sev-1/Sev-2, critical/high privacy or security finding, authentic-media violation, status/evidence mismatch, missing restore/rollback, optimistic Health behavior, missing authority, or specialist veto produces \`Hold\` or \`Roll back\`.

## Independent QA disposition

**Draft / Hold.** QA is always required. Scenario design here is not executed evidence and cannot make the task Ready or Done.
`;
}

function deliveryArtifact(task, filePath, ownerActions, executionScope) {
  const issue = issueMap[task.id];
  return `# ${task.id} — task delivery checklist

${controlBlock(task, "delivery")}

## Canonical tracking

- **GitHub issue:** ${mdLink(`#${issue.number}`, issue.url)}
- **GitHub Project:** ${mdLink("Phase 1 Delivery Project", projectUrl)}
- **Manifest task:** ${mdLink(task.id, relativeLink(filePath, "docs/project/PHASE1-ROADMAP-MANIFEST.json"))}
- **Artifact register:** ${mdLink("P0 task artifact register", relativeLink(filePath, "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json"))}
- **Allowed current scope:** \`${executionScope}\`

## Schedule and dependencies

- **Status:** \`${task.status}\`
- **Priority:** \`${task.priority}\`
- **Proposed start:** ${task.startDate ?? "Blank — trigger-gated"}
- **Proposed target:** ${task.targetDate ?? "Blank — trigger-gated"}
- **Dependencies:** ${codeList(task.dependencies)}
- **Dependency rule:** status alone is insufficient; exact entry evidence must be linked and accepted.

## Required dossier state

| Discipline | Initial state | Requirement |
| --- | --- | --- |
| Product | \`draft\` | Must become \`approved\` |
| Architecture | \`draft\` | Must become \`approved\` or validly \`not-applicable\` |
| Design | \`draft\` | Must become \`approved\` or validly \`not-applicable\` |
| QA | \`draft\` | Must become \`approved\`; executed evidence remains separate |
| Delivery | \`draft\` | Must become \`approved\` |
| Council | \`draft\` | All five verdicts and reviewed commit/hash required |

## Owner actions

${asList(ownerActions.map((id) => `\`${id}\` — due only at its named gate`), "None currently mapped")}

## Promotion checklist

- [ ] Every task-bound artifact is approved or validly not applicable and its SHA-256 matches.
- [ ] Product Council requirements are clear and open decisions are empty.
- [ ] Dependency entry evidence passes.
- [ ] Requested scope is within council authorization.
- [ ] Due private authority and human-only actions are complete.
- [ ] Stable branch/commit, PR decomposition, checks, migration, recovery, rollback, and evidence plan are recorded.
- [ ] Fresh independent QA and affected specialist re-review pass.
- [ ] Issue, Project, manifest, workbook, Wiki, and running log reconcile.

## Project Manager disposition

**Draft / Hold.** The Project Manager must keep the issue and Roadmap at this exact readiness state and must not schedule around a failed gate.
`;
}

function councilArtifact(task, filePath, executionScope) {
  const historical = task.status === "Done";
  const verdict = historical ? "historical-non-authorizing" : "hold";
  const seatVerdict = historical ? "Historical planning evidence only; no downstream execution authorization" : "Hold pending approved task-bound artifact";
  return `# ${task.id} — Product Council task readiness

${controlBlock(task, "council")}

## Candidate

- **Task:** ${task.title}
- **Outcome:** ${task.description}
- **Requested execution scope:** \`${executionScope}\`
- **Reviewed candidate binding:** Not yet recorded. The exact commit and dossier digest are recorded after review in the central readiness registry; this file must not self-reference the commit that contains itself.
- **Artifact hashes:** Recorded in the central register; all artifacts are initial drafts

## Five-seat verdicts

| Seat | Verdict | Reason |
| --- | --- | --- |
| Product Manager | Hold | ${seatVerdict} |
| UI/UX Designer | Hold | ${seatVerdict} |
| Technical Architect | Hold | ${seatVerdict} |
| Independent QA | Hold | ${seatVerdict} |
| Project Manager | Hold | ${seatVerdict} |

## Unresolved blockers

- Task-bound Product, Architecture, Design, QA, Delivery, and Council artifacts remain \`draft\`.
- Acceptance scenario ownership, exact implementation surface, evidence plan, and reviewed commit require specialist approval.
- Dependency entry evidence and any due owner/private gates have not been accepted for execution.

## Council decision

**\`${verdict}\`** with \`executionAllowed=false\`.

${historical
    ? "The roadmap `Done` state records a bounded historical planning artifact. It does not make this or a dependent implementation task Ready."
    : "Only local task-dossier authoring and expressly authorized P0 control remediation may continue. No substantive implementation, private-system action, authentic-content action, or release promotion is authorized."}

## Re-review trigger

Re-review all five seats after every required artifact is stable in one candidate commit, open decisions are empty, dependency/authority/human gates are evidenced, and Independent QA can review without implementation conflict. Each external seat attestation binds the candidate commit and dossier digest; a later approval-registry commit records those bindings without modifying the six candidate artifacts.
`;
}

const fullRevision = /^[0-9a-f]{40}$/;
const readFetchedMainRevision = () => {
  try {
    const revision = execFileSync("git", ["rev-parse", "--verify", "refs/remotes/origin/main^{commit}"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
    return fullRevision.test(revision) ? revision : null;
  } catch {
    return null;
  }
};
const fetchedMainRevision = readFetchedMainRevision();

async function candidatePublicationFacts(taskId, artifacts, scopeClass) {
  const approval = approvalRegistry.taskApprovals?.[taskId] ?? {};
  const candidate = approval.candidate ?? {};
  const empty = emptyCandidatePublicationFacts(candidate);
  if (!fetchedMainRevision || !fullRevision.test(candidate.revision ?? "")
    || !fullRevision.test(candidate.baseRevision ?? "")) return empty;
  const result = await deriveCandidatePublicationFacts({
    repoRoot,
    taskId,
    candidate,
    registeredArtifacts: artifacts,
    publishedRef: fetchedMainRevision,
    scopeClass,
  });
  if (result.ok !== true) return empty;
  const { ok: _ok, code: _code, scope: _scope, ...facts } = result;
  return facts;
}

function emptyApprovalPublication(taskId) {
  return {
    revision: null,
    registryPath: path.relative(repoRoot, approvalRegistryPath),
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
  };
}

async function approvalPublicationFacts(taskId, sourceInput) {
  const approval = approvalRegistry.taskApprovals?.[taskId];
  if (!approval?.approvalRecord || !fullRevision.test(sourceInput.candidate?.revision ?? "") || !fetchedMainRevision) {
    return emptyApprovalPublication(taskId);
  }
  const result = await deriveApprovalPublicationFacts({
    repoRoot,
    taskId,
    approvalRegistry,
    candidateRevision: sourceInput.candidate.revision,
    publishedRef: fetchedMainRevision,
    reviewerRegistry,
    ownerActionState,
    ownerActionRequirements: sourceInput.ownerActionRequirements,
  });
  if (result.ok !== true) return emptyApprovalPublication(taskId);
  const { ok: _ok, code: _code, scope: _scope, ...facts } = result;
  return facts;
}

function protectionMetadata(taskId, kind, registry = approvalRegistry) {
  const approval = registry.taskApprovals?.[taskId] ?? {};
  const review = approval.artifactReviews?.[kind] ?? {};
  const seatRecords = Object.values(approval.council?.seatVerdicts ?? {});
  return {
    artifactReviewDecision: review.decision ?? "hold",
    candidateBinding: Boolean(approval.candidate?.revision || approval.candidate?.artifacts?.[kind]),
    seatVerdicts: seatRecords.map((record) => record.verdict ?? "hold"),
    attestationBindings: [review.attestationDigest, ...seatRecords.map((record) => record.attestationDigest)].filter(Boolean),
    evidenceBindings: [review.evidenceReference, ...seatRecords.map((record) => record.evidenceReference)].filter(Boolean),
  };
}

const plannedArtifactTargets = [];
const intendedArtifactFiles = [];
const artifactContentsByTask = new Map();
const artifactIdentityByPath = new Map();
const writeCounts = { created: 0, refreshedDrafts: 0, preserved: 0 };

for (const task of manifest.tasks) {
  const ownerActions = ownerActionsFor(task);
  const executionScope = executionScopeFor(task);
  const filePaths = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, artifactPath(task.id, kind)]));
  const generatedContents = {
    product: productArtifact(task, filePaths.product, ownerActions),
    architecture: technicalArtifact(task, filePaths.architecture),
    design: designArtifact(task, filePaths.design),
    qa: qaArtifact(task, filePaths.qa),
    delivery: deliveryArtifact(task, filePaths.delivery, ownerActions, executionScope),
    council: councilArtifact(task, filePaths.council, executionScope),
  };
  const finalContents = {};
  for (const [kind, filePath] of Object.entries(filePaths)) {
    const absolutePath = path.join(repoRoot, filePath);
    const exists = fs.existsSync(absolutePath);
    const existingContent = exists ? fs.readFileSync(absolutePath, "utf8") : null;
    const existingState = exists ? artifactStateFromContent(existingContent, task.id, kind) : null;
    const generatedContent = generatedContents[kind].endsWith("\n") ? generatedContents[kind] : `${generatedContents[kind]}\n`;
    const shouldUseGenerated = !exists || (refreshDrafts && existingState === "draft");
    const finalContent = shouldUseGenerated ? generatedContent : existingContent;
    finalContents[kind] = finalContent;
    const changed = existingContent !== finalContent;
    if (!exists) writeCounts.created += 1;
    else if (changed) writeCounts.refreshedDrafts += 1;
    else writeCounts.preserved += 1;
    plannedArtifactTargets.push({
      path: filePath,
      exists,
      content: existingContent,
      artifactState: existingState,
      ...protectionMetadata(task.id, kind),
    });
    artifactIdentityByPath.set(filePath, { taskId: task.id, kind });
    intendedArtifactFiles.push({ path: filePath, content: finalContent });
  }
  artifactContentsByTask.set(task.id, { filePaths, finalContents });
}

const records = [];
for (const task of manifest.tasks) {
  const { filePaths, finalContents } = artifactContentsByTask.get(task.id);
  const sourceArtifacts = Object.fromEntries(ARTIFACT_KINDS.map((kind) => {
    const content = finalContents[kind];
    const markerResult = parseArtifactControlMarkers(content, { taskId: task.id, artifactKind: kind });
    if (!markerResult.valid) {
      const codes = [...new Set(markerResult.errors.map((error) => error.code))].join(", ");
      throw new Error(`${task.id} ${kind}: invalid artifact control markers (${codes})`);
    }
    const contentState = markerResult.artifactState;
    const digest = sha256(content);
    const markersValid = markerResult.valid;
    return [kind, {
      required: true,
      path: filePaths[kind],
      url: `${repositoryUrl}/blob/main/${filePaths[kind]}`,
      contentState,
      sha256: digest,
      observedSha256: digest,
      markersValid,
    }];
  }));
  const sourceInput = buildTaskReadinessInput({
    task,
    artifacts: sourceArtifacts,
    readinessState,
    reviewerRegistry,
    approvalRegistry,
    ownerActionState,
    evaluationPhase: "approval",
  });
  const candidatePublication = await candidatePublicationFacts(
    task.id,
    sourceArtifacts,
    sourceInput.requestedScope.scopeClass,
  );
  const approvalPublication = await approvalPublicationFacts(task.id, sourceInput);
  const evaluation = evaluateReadiness(sourceInput, {
    phase: "approval",
    now: readinessState.asOf,
    candidatePublication,
    approvalPublication,
  });
  const requiredSafetyCodes = ["PUBLIC_SAFETY", "AUTHENTIC_MEDIA_EXCLUSION", "PRIVATE_NETWORK_EXCLUSION"];
  const failedSafetyCodes = requiredSafetyCodes.filter((code) => (
    evaluation.gateResults.find((gate) => gate.code === code)?.passed !== true
  ));
  if (failedSafetyCodes.length) {
    throw new Error(`${task.id}: safety gate failed (${failedSafetyCodes.join(", ")}); no register or artifact bytes were written`);
  }
  const artifacts = Object.fromEntries(ARTIFACT_KINDS.map((kind) => [kind, {
    required: true,
    path: sourceArtifacts[kind].path,
    url: sourceArtifacts[kind].url,
    state: evaluation.normalizedEvidence.effectiveArtifactStates[kind],
    sha256: sourceArtifacts[kind].sha256,
    contentState: sourceArtifacts[kind].contentState,
  }]));
  const failedDependencyGates = evaluation.gateResults.filter((gate) => !gate.passed
    && (gate.code === "DEPENDENCY_REQUIREMENTS" || gate.code.startsWith("DEPENDENCY_")));
  const failedDueActionGates = evaluation.gateResults.filter((gate) => !gate.passed
    && gate.code.startsWith("OWNER_ACTION_")
    && !["OWNER_ACTION_REQUIREMENTS", "OWNER_ACTION_RECORD_SET"].includes(gate.code));
  records.push({
    taskId: task.id,
    issueNumber: issueMap[task.id].number,
    issueUrl: issueMap[task.id].url,
    artifactReadiness: evaluation.artifactReadiness,
    executionDecision: evaluation.executionDecision,
    executionAllowed: evaluation.executionAllowed,
    executionScope: executionScopeFor(task),
    requestedScope: sourceInput.requestedScope,
    artifacts,
    artifactReviews: sourceInput.artifactReviews,
    candidate: sourceInput.candidate,
    candidatePublication,
    approvalRecord: sourceInput.approvalRecord,
    approvalPublication,
    requirementIds: sourceInput.requirementIds,
    acceptanceScenarioIds: sourceInput.acceptanceScenarioIds,
    designCoverage: sourceInput.designCoverage,
    dependencyControl: {
      requirements: sourceInput.dependencyRequirements,
      evidence: sourceInput.dependencyEvidence,
      satisfied: failedDependencyGates.length === 0,
    },
    ownerActionControl: {
      requirements: sourceInput.ownerActionRequirements,
      records: sourceInput.ownerActions,
      dueActionIds: evaluation.normalizedEvidence.dueOwnerActionIds,
      allDueSatisfied: failedDueActionGates.length === 0,
    },
    privateAuthority: sourceInput.privateAuthority,
    privateAuthorityRequired: evaluation.normalizedEvidence.privateAuthorityRequired,
    openDecisions: sourceInput.openDecisions,
    specialistVetoes: sourceInput.specialistVetoes,
    council: {
      ...sourceInput.council,
      decisionPath: filePaths.council,
      decisionUrl: `${repositoryUrl}/blob/main/${filePaths.council}`,
    },
    effectiveArtifactStates: evaluation.normalizedEvidence.effectiveArtifactStates,
    gateResults: evaluation.gateResults,
    blockers: evaluation.blockers,
    nextAction: evaluation.nextAction,
    normalizedEvidence: evaluation.normalizedEvidence,
  });
}

const register = {
  schemaVersion: READINESS_SCHEMA_VERSION,
  generatedAt,
  authenticMediaAccessed: false,
  privateNetworkAccessed: false,
  evaluationTimeBasis: "Deterministic planning projection at readinessState.asOf; actual execution start always re-evaluates with current time from a clean exact-origin/main checkout.",
  readinessStatePath: path.relative(repoRoot, readinessStatePath),
  readinessStateUrl: `${repositoryUrl}/blob/main/${path.relative(repoRoot, readinessStatePath)}`,
  reviewerRegistryPath: path.relative(repoRoot, reviewerRegistryPath),
  approvalRegistryPath: path.relative(repoRoot, approvalRegistryPath),
  ownerActionStatePath: path.relative(repoRoot, ownerActionStatePath),
  policyPath,
  policyUrl: `${repositoryUrl}/blob/main/${policyPath}`,
  artifactStates: ["missing", "draft", "in-review", "approved", "blocked", "not-applicable"],
  councilVerdicts: [
    "hold",
    "ready-local-synthetic",
    "ready-private-execution",
    "proceed-release",
    "historical-non-authorizing",
    "not-applicable",
  ],
  startRule: "executionAllowed is derived only after every required artifact, exact-candidate review, dependency, authority, owner-action, five-seat Council, approval-publication, and exact-main activation gate passes.",
  sourceEvidenceModel: {
    schemaVersion: READINESS_SCHEMA_VERSION,
    artifactReviewDecisions: ["hold", "approved", "not-applicable"],
    councilSeatVerdicts: ["hold", "approved", "not-applicable"],
    designStateDimensions: DESIGN_STATE_DIMENSIONS,
    designAccessibilityDimensions: DESIGN_ACCESSIBILITY_DIMENSIONS,
    requestedScopeClasses: ["local-synthetic", "delivery-control", "private-execution", "release"],
    scopeActionCompatibility: SCOPE_ACTION_COMPATIBILITY,
    taskFilePurposes: TASK_FILE_PURPOSES,
    taskFileGitModes: TASK_FILE_GIT_MODES,
    taskFileDiffExclusions: TASK_FILE_DIFF_EXCLUSIONS,
    taskFileDescendantDeltaPaths: TASK_FILE_DESCENDANT_DELTA_PATHS,
    derivedOverridesForbidden: true,
  },
  summary: {
    taskCount: records.length,
    readyCount: records.filter((record) => record.artifactReadiness === "Ready").length,
    executionAllowedCount: records.filter((record) => record.executionAllowed).length,
    incompleteCount: records.filter((record) => record.artifactReadiness === "Incomplete").length,
    artifactStateCounts: Object.fromEntries(
      [...allowedArtifactStates].map((state) => [
        state,
        records.flatMap((record) => Object.values(record.artifacts)).filter((artifact) => artifact.state === state).length,
      ]),
    ),
  },
  tasks: records,
};

const registerRelativePath = path.relative(repoRoot, registerPath);
const existingRegisterContent = fs.existsSync(registerPath) ? fs.readFileSync(registerPath, "utf8") : null;
const intendedRegisterContent = `${JSON.stringify(register, null, 2)}\n`;
const refreshTargets = [
  ...plannedArtifactTargets,
  {
    path: registerRelativePath,
    exists: existingRegisterContent !== null,
    content: existingRegisterContent,
    artifactState: "draft",
    artifactReviewDecision: "hold",
    candidateBinding: false,
    seatVerdicts: [],
    attestationBindings: [],
    evidenceBindings: [],
  },
];
const intendedFiles = [...intendedArtifactFiles, { path: registerRelativePath, content: intendedRegisterContent }];
const fetchedMainGuardPath = "P0-git-ref-origin-main";
const sourceGuardInputs = [
  [manifestPath, manifestContent],
  [issueMapPath, issueMapContent],
  [readinessStatePath, readinessStateContent],
  [reviewerRegistryPath, reviewerRegistryContent],
  [approvalRegistryPath, approvalRegistryContent],
  [ownerActionStatePath, ownerActionStateContent],
].map(([absolutePath, content]) => ({
  path: path.relative(repoRoot, absolutePath),
  exists: true,
  content,
}));
sourceGuardInputs.push({
  path: fetchedMainGuardPath,
  exists: fetchedMainRevision !== null,
  content: fetchedMainRevision,
});
const refreshPlan = planProtectedRefresh(refreshTargets, intendedFiles, sourceGuardInputs);
if (!refreshPlan.allowed) {
  throw new Error(`Protected refresh denied: ${refreshPlan.blockers.map((blocker) => `${blocker.code}${blocker.path ? `:${blocker.path}` : ""}`).join(", ")}`);
}
const changedPaths = refreshPlan.changes.map((change) => change.path);
if (changedPaths.some((filePath) => filePath !== registerRelativePath)
  && changedPaths.at(-1) !== registerRelativePath) {
  throw new Error("REFRESH_REGISTER_LAST: every artifact promotion must be followed by the generated register as the unique last promotion");
}

const gitStagePath = execFileSync("git", ["rev-parse", "--git-path", `P0-readiness-refresh-${process.pid}`], {
  cwd: repoRoot,
  encoding: "utf8",
}).trim();
const stagingRoot = path.resolve(repoRoot, gitStagePath);
const stagingParent = path.dirname(stagingRoot);
const staleStagingEntries = fs.existsSync(stagingParent)
  ? fs.readdirSync(stagingParent, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("P0-readiness-refresh-"))
    .map((entry) => entry.name)
  : [];
if (staleStagingEntries.length > 0) {
  throw new Error(`REFRESH_STALE_STAGING: inspect and recover prior interrupted staging before retrying (${staleStagingEntries.join(", ")})`);
}
const stagedPath = (relativePath) => path.join(stagingRoot, relativePath);
const recoveryJournalPath = path.join(stagingRoot, "P0-recovery-journal.json");
const adapter = {
  read: async (relativePath) => {
    if (relativePath === fetchedMainGuardPath) return readFetchedMainRevision();
    const absolutePath = path.join(repoRoot, relativePath);
    return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf8") : null;
  },
  readProtection: async (relativePath) => {
    const absolutePath = path.join(repoRoot, relativePath);
    const exists = fs.existsSync(absolutePath);
    if (relativePath === registerRelativePath) {
      return {
        exists,
        artifactState: "draft",
        artifactReviewDecision: "hold",
        candidateBinding: false,
        seatVerdicts: [],
        attestationBindings: [],
        evidenceBindings: [],
      };
    }
    const identity = artifactIdentityByPath.get(relativePath);
    if (!identity) throw new Error("REFRESH_PROTECTION_UNKNOWN_TARGET");
    const currentRegistry = parseJsonWithoutDuplicateKeys(
      fs.readFileSync(approvalRegistryPath, "utf8"),
      path.relative(repoRoot, approvalRegistryPath),
    );
    const content = exists ? fs.readFileSync(absolutePath, "utf8") : null;
    return {
      exists,
      artifactState: exists ? artifactStateFromContent(content, identity.taskId, identity.kind) : null,
      ...protectionMetadata(identity.taskId, identity.kind, currentRegistry),
    };
  },
  stage: async (relativePath, content) => {
    const target = stagedPath(relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  },
  readStaged: async (relativePath) => fs.readFileSync(stagedPath(relativePath), "utf8"),
  writeRecoveryJournal: async (journal) => {
    fs.mkdirSync(stagingRoot, { recursive: true });
    const temporaryPath = `${recoveryJournalPath}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(journal, null, 2)}\n`, { flag: "wx" });
    fs.renameSync(temporaryPath, recoveryJournalPath);
    return true;
  },
  readRecoveryJournal: async () => fs.existsSync(recoveryJournalPath)
    ? parseJsonWithoutDuplicateKeys(fs.readFileSync(recoveryJournalPath, "utf8"), "P0 recovery journal")
    : null,
  clearRecoveryJournal: async () => {
    if (fs.existsSync(recoveryJournalPath)) fs.unlinkSync(recoveryJournalPath);
    return !fs.existsSync(recoveryJournalPath);
  },
  promote: async (relativePath) => {
    const target = path.join(repoRoot, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.renameSync(stagedPath(relativePath), target);
  },
  discard: async (relativePath) => {
    const target = stagedPath(relativePath);
    if (fs.existsSync(target)) fs.unlinkSync(target);
  },
  restore: async (relativePath, originalContent) => {
    const target = path.join(repoRoot, relativePath);
    if (originalContent === null) {
      if (fs.existsSync(target)) fs.unlinkSync(target);
      return;
    }
    const rollback = `${target}.P0-rollback-${process.pid}`;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(rollback, originalContent);
    fs.renameSync(rollback, target);
  },
};
const transaction = await executeRefreshTransaction(refreshPlan, adapter);
const retainStagingForRecovery = transaction.applied !== true && transaction.restored !== true;
if (!retainStagingForRecovery) {
  try {
    fs.rmSync(stagingRoot, { recursive: true, force: true });
  } catch {
    // A stale marker is fail-closed on the next run; successful/restored output
    // bytes remain authoritative even if the empty staging directory persists.
  }
}
if (!transaction.applied) {
  throw new Error(`Artifact refresh transaction failed: ${transaction.code}; restored=${transaction.restored}; stagingRetained=${retainStagingForRecovery}`);
}

console.log(JSON.stringify({
  register: registerRelativePath,
  schemaVersion: register.schemaVersion,
  tasks: records.length,
  artifacts: records.length * ARTIFACT_KINDS.length,
  ready: register.summary.readyCount,
  executionAllowed: register.summary.executionAllowedCount,
  transaction: {
    code: transaction.code,
    changedPaths: transaction.changedPaths?.length ?? 0,
    sourceGuardsIntact: transaction.sourceGuardsIntact === true,
    fingerprint: refreshPlan.fingerprint,
  },
  writes: writeCounts,
}, null, 2));
