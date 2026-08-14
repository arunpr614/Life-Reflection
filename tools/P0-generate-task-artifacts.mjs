import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(repoRoot, "docs/project/PHASE1-ROADMAP-MANIFEST.json");
const issueMapPath = path.join(repoRoot, "docs/project/PHASE1-GITHUB-ISSUES.json");
const outputRoot = path.join(repoRoot, "docs/work-items");
const registerPath = path.join(repoRoot, "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json");
const readinessStatePath = path.join(repoRoot, "docs/project/P0-PHASE1-TASK-READINESS-STATE.json");
const generatedAt = "2026-08-14";
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

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const issueMap = JSON.parse(fs.readFileSync(issueMapPath, "utf8")).issues ?? {};
const readinessState = JSON.parse(fs.readFileSync(readinessStatePath, "utf8"));
if (manifest.tasks?.length !== 58 || Object.keys(issueMap).length !== 58) {
  throw new Error("Task artifacts require exactly 58 manifest tasks and 58 issue-map entries");
}
const taskIds = new Set(manifest.tasks.map((task) => task.id));
const readinessOverrides = readinessState.taskOverrides ?? {};
const unknownReadinessTaskIds = Object.keys(readinessOverrides).filter((taskId) => !taskIds.has(taskId));
if (unknownReadinessTaskIds.length) {
  throw new Error(`Readiness state contains unknown task IDs: ${unknownReadinessTaskIds.join(", ")}`);
}
const allowedOverrideKeys = new Set([
  "artifactReadiness",
  "executionDecision",
  "executionAllowed",
  "executionScope",
  "dependenciesEntryEvidenceSatisfied",
  "privateAuthorityState",
  "ownerActions",
  "ownerActionsSatisfied",
  "openDecisions",
  "artifactReviews",
  "designCoverage",
  "privateAuthorityEvidenceReference",
  "council",
]);
const artifactReviewKinds = ["product", "architecture", "design", "qa", "delivery", "council"];
const councilSeatKinds = ["product", "design", "architecture", "qa", "project"];
const allowedArtifactReviewKeys = new Set([
  "decision",
  "reviewer",
  "reviewedRevision",
  "artifactSha256",
  "dossierDigest",
  "evidenceReference",
  "notApplicableRationale",
  "specialistConcurrence",
]);
const designStateDimensions = ["normal", "empty", "loading", "error", "interruption", "destructive"];
const designAccessibilityDimensions = ["keyboard", "focus", "screenReader", "targetSize", "contrast", "zoom", "reducedMotion"];
const allowedDesignCoverageKeys = new Set(["applicability", "journeyIds", "stateCoverage", "accessibilityCoverage", "notApplicableRationale"]);
const allowedSeatVerdictKeys = new Set(["verdict", "reviewer", "reviewedRevision", "dossierDigest", "evidenceReference", "rationale"]);
for (const [taskId, override] of Object.entries(readinessOverrides)) {
  const unknownKeys = Object.keys(override).filter((key) => !allowedOverrideKeys.has(key));
  if (unknownKeys.length) throw new Error(`${taskId}: unknown readiness override keys: ${unknownKeys.join(", ")}`);
  const unknownCouncilKeys = Object.keys(override.council ?? {}).filter(
    (key) => !["verdict", "reviewedRevision", "unresolvedBlockers", "seatVerdicts"].includes(key),
  );
  if (unknownCouncilKeys.length) throw new Error(`${taskId}: unknown council override keys: ${unknownCouncilKeys.join(", ")}`);
  const unknownReviewKinds = Object.keys(override.artifactReviews ?? {}).filter((kind) => !artifactReviewKinds.includes(kind));
  if (unknownReviewKinds.length) throw new Error(`${taskId}: unknown artifact-review kinds: ${unknownReviewKinds.join(", ")}`);
  for (const [kind, review] of Object.entries(override.artifactReviews ?? {})) {
    const unknownReviewKeys = Object.keys(review).filter((key) => !allowedArtifactReviewKeys.has(key));
    if (unknownReviewKeys.length) throw new Error(`${taskId} ${kind}: unknown artifact-review keys: ${unknownReviewKeys.join(", ")}`);
  }
  const unknownCoverageKeys = Object.keys(override.designCoverage ?? {}).filter((key) => !allowedDesignCoverageKeys.has(key));
  if (unknownCoverageKeys.length) throw new Error(`${taskId}: unknown design-coverage keys: ${unknownCoverageKeys.join(", ")}`);
  const unknownStateDimensions = Object.keys(override.designCoverage?.stateCoverage ?? {}).filter((key) => !designStateDimensions.includes(key));
  if (unknownStateDimensions.length) throw new Error(`${taskId}: unknown Design state dimensions: ${unknownStateDimensions.join(", ")}`);
  const unknownAccessibilityDimensions = Object.keys(override.designCoverage?.accessibilityCoverage ?? {}).filter((key) => !designAccessibilityDimensions.includes(key));
  if (unknownAccessibilityDimensions.length) throw new Error(`${taskId}: unknown Design accessibility dimensions: ${unknownAccessibilityDimensions.join(", ")}`);
  const unknownSeats = Object.keys(override.council?.seatVerdicts ?? {}).filter((seat) => !councilSeatKinds.includes(seat));
  if (unknownSeats.length) throw new Error(`${taskId}: unknown council seats: ${unknownSeats.join(", ")}`);
  for (const [seat, verdict] of Object.entries(override.council?.seatVerdicts ?? {})) {
    const unknownSeatKeys = Object.keys(verdict).filter((key) => !allowedSeatVerdictKeys.has(key));
    if (unknownSeatKeys.length) throw new Error(`${taskId} ${seat}: unknown seat-verdict keys: ${unknownSeatKeys.join(", ")}`);
  }
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
  const state = content.match(/^- \*\*Artifact state:\*\* `([^`]+)`$/m)?.[1];
  if (!state) throw new Error(`${taskId} ${kind}: missing Artifact state marker`);
  if (!allowedArtifactStates.has(state)) throw new Error(`${taskId} ${kind}: invalid Artifact state ${state}`);
  return state;
}

function artifactPath(taskId, kind) {
  return `docs/work-items/${taskId}/P0-${taskId}-${artifactKinds[kind]}.md`;
}

function ownerActionsFor(task) {
  const byMilestone = {
    P0: task.id === "PC-001" ? ["P0-OA-001", "P0-OA-002"] : [],
    R0: ["P0-OA-001", "R0-OA-001", "R0-OA-002"],
    R1: ["R1-OA-001"],
    R2: ["R2-OA-001", "R2-OA-002"],
    R5: ["R5-OA-001"],
    R6: ["R6-OA-001"],
    R7: ["R7-OA-001"],
    R9: ["R9-OA-001", "R9-OA-002", "R9-OA-003", "R9-OA-004"],
    R10: ["R10-OA-001", "R10-OA-002"],
  };
  return byMilestone[task.milestone] ?? [];
}

function executionScopeFor(task) {
  if (task.status === "Done") return "planning-only-historical";
  if (task.milestone === "P0") return "local-public-control-only";
  if (task.milestone === "R0") return "local-synthetic-artifact-authoring-only";
  if (["R1", "R2", "R3", "R4"].includes(task.milestone)) return "future-release-gated";
  if (task.milestone === "R5") return "future-synthetic-contract-gated";
  if (["R6", "R7"].includes(task.milestone)) return "future-evaluation-and-human-approval-gated";
  if (task.milestone === "R8") return "future-integrated-evidence-gated";
  if (task.milestone === "R9") return "future-human-launch-gated";
  return "trigger-only-no-execution";
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

fs.mkdirSync(outputRoot, { recursive: true });
const records = [];
const writeCounts = { created: 0, refreshedDrafts: 0, preserved: 0 };

for (const task of manifest.tasks) {
  const ownerActions = ownerActionsFor(task);
  const executionScope = executionScopeFor(task);
  const filePaths = Object.fromEntries(Object.keys(artifactKinds).map((kind) => [kind, artifactPath(task.id, kind)]));
  const contents = {
    product: productArtifact(task, filePaths.product, ownerActions),
    architecture: technicalArtifact(task, filePaths.architecture),
    design: designArtifact(task, filePaths.design),
    qa: qaArtifact(task, filePaths.qa),
    delivery: deliveryArtifact(task, filePaths.delivery, ownerActions, executionScope),
    council: councilArtifact(task, filePaths.council, executionScope),
  };
  const artifactRecords = {};
  for (const [kind, filePath] of Object.entries(filePaths)) {
    const absolutePath = path.join(repoRoot, filePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    const generatedContent = contents[kind].endsWith("\n") ? contents[kind] : `${contents[kind]}\n`;
    const exists = fs.existsSync(absolutePath);
    const existingContent = exists ? fs.readFileSync(absolutePath, "utf8") : null;
    const existingState = exists ? artifactStateFromContent(existingContent, task.id, kind) : null;
    const shouldRefresh = refreshDrafts && existingState === "draft";
    if (!exists || shouldRefresh) {
      fs.writeFileSync(absolutePath, generatedContent);
      if (exists) writeCounts.refreshedDrafts += 1;
      else writeCounts.created += 1;
    } else {
      writeCounts.preserved += 1;
    }
    const content = !exists || shouldRefresh ? generatedContent : existingContent;
    const artifactState = artifactStateFromContent(content, task.id, kind);
    artifactRecords[kind] = {
      required: true,
      path: filePath,
      url: `${repositoryUrl}/blob/main/${filePath}`,
      state: artifactState,
      sha256: sha256(content),
    };
  }
  const scenarioIds = [
    ...["P-001", "P-002", "P-003"].map((suffix) => `${task.id}-${suffix}`),
    ...["T-001", "T-002", "T-003"].map((suffix) => `${task.id}-${suffix}`),
    ...["D-001", "D-002", "D-003"].map((suffix) => `${task.id}-${suffix}`),
    ...["QA-001", "QA-002", "QA-003", "QA-004", "QA-005", "QA-006"].map((suffix) => `${task.id}-${suffix}`),
  ];
  const baseCouncil = {
    decisionPath: filePaths.council,
    decisionUrl: `${repositoryUrl}/blob/main/${filePaths.council}`,
    verdict: task.status === "Done" ? "historical-non-authorizing" : "hold",
    reviewedRevision: null,
    unresolvedBlockers: [
      "Required task-bound artifacts remain draft.",
      "Five-seat task-level approval is not complete.",
    ],
    seatVerdicts: Object.fromEntries(councilSeatKinds.map((seat) => [seat, {
      verdict: "hold",
      reviewer: null,
      reviewedRevision: null,
      dossierDigest: null,
      evidenceReference: null,
      rationale: "Task-bound artifacts remain draft.",
    }])),
  };
  const baseArtifactReviews = Object.fromEntries(artifactReviewKinds.map((kind) => [kind, {
    decision: "hold",
    reviewer: null,
    reviewedRevision: null,
    artifactSha256: null,
    dossierDigest: null,
    evidenceReference: null,
    notApplicableRationale: null,
    specialistConcurrence: false,
  }]));
  const baseDesignCoverage = {
    applicability: "pending",
    journeyIds: [],
    stateCoverage: Object.fromEntries(designStateDimensions.map((dimension) => [dimension, []])),
    accessibilityCoverage: Object.fromEntries(designAccessibilityDimensions.map((dimension) => [dimension, []])),
    notApplicableRationale: null,
  };
  const baseRecord = {
    taskId: task.id,
    issueNumber: issueMap[task.id].number,
    issueUrl: issueMap[task.id].url,
    artifactReadiness: "Incomplete",
    executionDecision: task.status === "Done" ? "Historical non-authorizing" : "Hold",
    executionAllowed: false,
    executionScope,
    artifacts: artifactRecords,
    requirementIds: task.requirementIds,
    acceptanceScenarioIds: scenarioIds,
    dependenciesEntryEvidenceSatisfied: task.dependencies.length === 0,
    privateAuthorityState: task.milestone === "R10"
      ? "not-triggered"
      : task.milestone === "P0"
        ? "not-required-for-current-local-control-work"
        : "pending-if-private-action-is-requested",
    privateAuthorityEvidenceReference: null,
    ownerActions,
    ownerActionsSatisfied: true,
    openDecisions: ["Five-seat task-level dossier approval pending."],
    artifactReviews: baseArtifactReviews,
    designCoverage: baseDesignCoverage,
    council: baseCouncil,
  };
  const override = readinessOverrides[task.id] ?? {};
  const artifactReviews = Object.fromEntries(artifactReviewKinds.map((kind) => [kind, {
    ...baseArtifactReviews[kind],
    ...(override.artifactReviews?.[kind] ?? {}),
  }]));
  const seatVerdicts = Object.fromEntries(councilSeatKinds.map((seat) => [seat, {
    ...baseCouncil.seatVerdicts[seat],
    ...(override.council?.seatVerdicts?.[seat] ?? {}),
  }]));
  for (const kind of artifactReviewKinds) {
    const contentState = artifactRecords[kind].state;
    const decision = artifactReviews[kind].decision;
    artifactRecords[kind] = {
      ...artifactRecords[kind],
      contentState,
      state: decision === "approved"
        ? "approved"
        : decision === "not-applicable"
          ? "not-applicable"
          : ["approved", "not-applicable"].includes(contentState)
            ? "in-review"
            : contentState,
    };
  }
  const candidateRevision = override.council?.reviewedRevision ?? baseCouncil.reviewedRevision;
  const candidateArtifacts = Object.fromEntries(artifactReviewKinds.map((kind) => [kind, {
    path: artifactRecords[kind].path,
    sha256: artifactRecords[kind].sha256,
  }]));
  const dossierDigest = candidateRevision
    ? `sha256:${sha256(JSON.stringify({ taskId: task.id, revision: candidateRevision, artifacts: candidateArtifacts }))}`
    : null;
  records.push({
    ...baseRecord,
    ...override,
    taskId: baseRecord.taskId,
    issueNumber: baseRecord.issueNumber,
    issueUrl: baseRecord.issueUrl,
    artifacts: artifactRecords,
    candidate: {
      revision: candidateRevision,
      dossierDigest,
      artifacts: candidateArtifacts,
    },
    artifactReviews,
    designCoverage: {
      ...baseDesignCoverage,
      ...(override.designCoverage ?? {}),
      stateCoverage: {
        ...baseDesignCoverage.stateCoverage,
        ...(override.designCoverage?.stateCoverage ?? {}),
      },
      accessibilityCoverage: {
        ...baseDesignCoverage.accessibilityCoverage,
        ...(override.designCoverage?.accessibilityCoverage ?? {}),
      },
    },
    requirementIds: baseRecord.requirementIds,
    acceptanceScenarioIds: baseRecord.acceptanceScenarioIds,
    council: {
      ...baseCouncil,
      ...(override.council ?? {}),
      decisionPath: baseCouncil.decisionPath,
      decisionUrl: baseCouncil.decisionUrl,
      seatVerdicts,
    },
  });
}

const register = {
  schemaVersion: "1.1.0",
  generatedAt,
  readinessStatePath: path.relative(repoRoot, readinessStatePath),
  readinessStateUrl: `${repositoryUrl}/blob/main/${path.relative(repoRoot, readinessStatePath)}`,
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
  startRule: "executionAllowed is true only after every required artifact, dependency, authority, owner-action and five-seat council gate passes for the exact reviewed revision and hashes.",
  approvalModel: {
    artifactReviewDecisions: ["hold", "approved", "not-applicable"],
    councilSeatVerdicts: ["hold", "approved", "not-applicable"],
    designStateDimensions,
    designAccessibilityDimensions,
    privateAuthorityEvidenceReferencePattern: "^P0-AUTH-[A-Z0-9-]{4,}$",
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

fs.writeFileSync(registerPath, `${JSON.stringify(register, null, 2)}\n`);
console.log(JSON.stringify({
  register: path.relative(repoRoot, registerPath),
  tasks: records.length,
  artifacts: records.length * Object.keys(artifactKinds).length,
  ready: register.summary.readyCount,
  executionAllowed: register.summary.executionAllowedCount,
  writes: writeCounts,
}, null, 2));
