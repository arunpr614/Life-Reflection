import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const repo = "arunpr614/Life-Reflection";
const repoUrl = `https://github.com/${repo}`;
const projectOwner = "arunpr614";
const projectNumber = 1;
const projectUrl = `https://github.com/users/${projectOwner}/projects/${projectNumber}`;
const canonicalViewFilter = `repo:${repo} is:issue label:phase1`;
const manifestPath = path.join(repoRoot, "docs/project/PHASE1-ROADMAP-MANIFEST.json");
const issueMapPath = path.join(repoRoot, "docs/project/PHASE1-GITHUB-ISSUES.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
let existingIssueMapDocument = null;
if (fs.existsSync(issueMapPath)) {
  existingIssueMapDocument = JSON.parse(fs.readFileSync(issueMapPath, "utf8"));
}
const issueMap = existingIssueMapDocument?.issues ?? {};

const args = new Set(process.argv.slice(2));
const supportedArgs = new Set([
  "--apply",
  "--close-done",
  "--help",
  "--issues-only",
  "--project-only",
  "--skip-views",
  "--verify",
  "--views-only",
  "--view-status",
  "--view-roadmap",
]);
const unknownArgs = [...args].filter((arg) => !supportedArgs.has(arg));
if (unknownArgs.length) throw new Error(`Unknown argument(s): ${unknownArgs.join(", ")}`);

const apply = args.has("--apply");
const closeDone = args.has("--close-done");
const issuesOnly = args.has("--issues-only");
const projectOnly = args.has("--project-only");
const skipViews = args.has("--skip-views");
const verify = args.has("--verify");
const viewsOnly = args.has("--views-only");
const viewStatus = args.has("--view-status");
const viewRoadmap = args.has("--view-roadmap");
const selectedViewName = viewStatus
  ? "Phase 1 Status"
  : viewRoadmap
    ? "Phase 1 Roadmap"
    : null;

if (args.has("--help")) {
  console.log(`Usage: node tools/sync_phase1_github.mjs [options]

Dry-run is the default and makes no GitHub or local-file changes.

Options:
  --apply          Apply repository and Project V2 changes.
  --project-only   Require the 58 issues to exist; update only Project V2.
  --issues-only    Synchronize labels, milestones, and issues; skip Project V2.
  --skip-views     Skip creation of the two saved Project V2 views.
  --verify         Read-only live parity check; makes no GitHub or local-file changes.
  --views-only     Update exactly one saved view and no issues/items/fields.
  --view-status    Select Phase 1 Status; requires --views-only.
  --view-roadmap   Select Phase 1 Roadmap; requires --views-only.
  --close-done     Close evidence-backed Done issues (requires --apply).
  --help           Show this help.
`);
  process.exit(0);
}

if (closeDone && !apply) throw new Error("--close-done requires --apply");
if (projectOnly && issuesOnly) throw new Error("--project-only and --issues-only are mutually exclusive");
if (projectOnly && closeDone) throw new Error("--close-done cannot be combined with --project-only");
if (verify && apply) throw new Error("--verify is read-only and cannot be combined with --apply");
if (verify && (projectOnly || issuesOnly || closeDone || skipViews || viewsOnly || viewStatus || viewRoadmap)) {
  throw new Error("--verify cannot be combined with mutation-selection options");
}
if ((viewStatus || viewRoadmap) && !viewsOnly) throw new Error("--view-status/--view-roadmap require --views-only");
if (viewsOnly && (!selectedViewName || (viewStatus && viewRoadmap))) {
  throw new Error("--views-only requires exactly one of --view-status or --view-roadmap");
}
if (viewsOnly && (projectOnly || issuesOnly || closeDone || skipViews)) {
  throw new Error("--views-only cannot be combined with issue/item/full-project options");
}

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

function api(method, endpoint, payload, { headers = [] } = {}) {
  const ghArgs = ["api", "--method", method];
  for (const header of headers) ghArgs.push("-H", header);
  ghArgs.push(endpoint);
  if (payload !== undefined) ghArgs.push("--input", "-");
  const result = runGh(ghArgs, {
    input: payload === undefined ? undefined : JSON.stringify(payload),
  });
  return result.stdout ? JSON.parse(result.stdout) : null;
}

function apiPaginated(endpoint) {
  const result = runGh(["api", "--paginate", "--slurp", endpoint]);
  if (!result.stdout) return [];
  const pages = JSON.parse(result.stdout);
  return pages.flatMap((page) => Array.isArray(page) ? page : [page]);
}

function graphql(query, variables = {}) {
  const result = runGh(["api", "graphql", "--input", "-"], {
    input: JSON.stringify({ query, variables }),
  });
  const response = JSON.parse(result.stdout);
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

function statusLabel(status) {
  return `status:${slug(status)}`;
}

function priorityLabel(priority) {
  return `priority:${priority.toLowerCase()}`;
}

function typeLabel(taskType) {
  return `type:${slug(taskType)}`;
}

function mdLink(label, url) {
  return `[${label}](${url})`;
}

function issueBody(task, issueNumbers) {
  const requirements = task.requirementIds.length
    ? task.requirementIds.map((id) => `\`${id}\``).join(", ")
    : "Planning-only; no product behavior requirement.";
  const dependencies = task.dependencies.length
    ? task.dependencies.map((id) => issueNumbers[id] ? `#${issueNumbers[id]} (\`${id}\`)` : `\`${id}\``).join(", ")
    : "None";
  const designLinks = task.designArtifactPaths
    .map((artifactPath, index) => mdLink(artifactPath, task.designArtifactUrls[index]))
    .join("\n- ");
  const start = task.startDate ?? "Blank — trigger-gated";
  const target = task.targetDate ?? "Blank — trigger-gated";
  const evidenceReferences = task.evidenceReferencePaths?.length
    ? task.evidenceReferencePaths
      .map((filePath, index) => `- ${mdLink(filePath, task.evidenceReferenceUrls[index])}`)
      .join("\n")
    : "- Not yet provided; the acceptance text below describes what must exist.";
  const dossier = task.taskDossier;
  const artifactLabels = { product: "Product", architecture: "Architecture", design: "Design", qa: "QA", delivery: "Delivery", council: "Council" };
  const artifactRows = Object.entries(dossier.artifacts)
    .map(([kind, artifact]) => {
      const review = dossier.artifactReviews[kind];
      const reviewer = review.reviewer
        ? `${review.reviewer}${review.reviewedRevision ? ` at \`${review.reviewedRevision.slice(0, 12)}…\`` : " (revision missing)"}`
        : "Not yet recorded";
      return `| ${artifactLabels[kind]} | \`${artifact.state}\` | \`${review.decision}\` | ${reviewer} | ${mdLink(artifact.path, artifact.url)} | \`${artifact.sha256.slice(0, 16)}…\` |`;
    })
    .join("\n");
  const seatLabels = { product: "Product Manager", design: "UI/UX Designer", architecture: "Technical Architect", qa: "Independent QA", project: "Project Manager" };
  const seatRows = Object.entries(dossier.council.seatVerdicts)
    .map(([seat, record]) => `| ${seatLabels[seat]} | \`${record.verdict}\` | ${record.reviewer ?? "Not yet recorded"} | ${record.rationale} |`)
    .join("\n");
  const designStateCoverage = Object.entries(dossier.designCoverage.stateCoverage)
    .map(([dimension, scenarioIds]) => `${dimension}: ${scenarioIds.length ? scenarioIds.map((id) => `\`${id}\``).join(", ") : "not yet mapped"}`)
    .join("; ");
  const designAccessibilityCoverage = Object.entries(dossier.designCoverage.accessibilityCoverage)
    .map(([dimension, scenarioIds]) => `${dimension}: ${scenarioIds.length ? scenarioIds.map((id) => `\`${id}\``).join(", ") : "not yet mapped"}`)
    .join("; ");
  const ownerActions = dossier.ownerActions.length
    ? dossier.ownerActions.map((id) => `\`${id}\``).join(", ")
    : "None currently mapped";
  const openDecisions = dossier.openDecisions.length
    ? dossier.openDecisions.map((decision) => `- ${decision}`).join("\n")
    : "- None";
  const blockers = dossier.council.unresolvedBlockers.length
    ? dossier.council.unresolvedBlockers.map((blocker) => `- ${blocker}`).join("\n")
    : "- None";

  return `<!-- phase1-roadmap-id: ${task.id} -->
## Outcome

${task.description}

## Planning metadata

| Field | Value |
| --- | --- |
| Stable task ID | \`${task.id}\` |
| Roadmap status | **${task.status}** |
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
- **Reviewed revision:** ${dossier.council.reviewedRevision ? `\`${dossier.council.reviewedRevision}\`` : "Not yet recorded"}
- **Dossier digest:** ${dossier.candidate.dossierDigest ? `\`${dossier.candidate.dossierDigest}\`` : "Not yet recorded"}
- **Dependency entry evidence satisfied:** ${dossier.dependenciesEntryEvidenceSatisfied ? "Yes" : "No"}
- **Private authority state:** \`${dossier.privateAuthorityState}\`
- **Private authority evidence reference:** ${dossier.privateAuthorityEvidenceReference ? `\`${dossier.privateAuthorityEvidenceReference}\`` : "Not yet recorded / not due"}
- **Relevant owner actions (due only at their named gate):** ${ownerActions}
- **Currently due owner actions satisfied:** ${dossier.ownerActionsSatisfied ? "Yes" : "No"}
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
  const evidenceReferences = task.evidenceReferenceUrls?.length
    ? task.evidenceReferenceUrls.join("\n")
    : "Not yet provided";
  return {
    "Status": task.status,
    "Start date": task.startDate,
    "Target date": task.targetDate,
    "Priority": task.priority,
    "PRD / PID": task.taskPrdUrl,
    "Design artifact": task.taskDesignUrl,
    "Architecture plan": task.taskArchitectureUrl,
    "QA plan": task.taskQaUrl,
    "Delivery control": task.taskDeliveryUrl,
    "Council decision": task.taskCouncilUrl,
    "Task dossier": Object.values(task.taskDossier.artifacts).map((artifact) => artifact.url).join("\n"),
    "Artifact readiness": task.artifactReadiness,
    "Execution scope": task.executionScope,
    "Requirement IDs": task.requirementIds.length ? task.requirementIds.join(", ") : "Planning-only",
    "Evidence": `Required: ${task.acceptanceEvidence}\nReferences: ${evidenceReferences}`,
    "Owner role": task.ownerRole,
    "Task summary": task.description,
  };
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
      if (spec.dataType === "SINGLE_SELECT" && !spec.options.some((option) => option.name === values[spec.name])) {
        throw new Error(`${task.id} uses unsupported ${spec.name} value: ${values[spec.name]}`);
      }
    }
  }
}

validateManifest();

const plannedIssueNumbers = Object.fromEntries(
  manifest.tasks.map((task) => [task.id, issueMap[task.id]?.number ?? null]),
);

const plan = {
  repository: repo,
  project: projectUrl,
  selection: {
    issues: !projectOnly && !viewsOnly,
    projectItemsAndFields: !issuesOnly && !viewsOnly,
    views: viewsOnly || (!issuesOnly && !skipViews),
    selectedView: selectedViewName,
    closeDone,
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
    fieldWritesPerItem: projectFieldSpecs.length,
    views: savedViewSpecs,
    canonicalViewFilter,
    applyBoundary: "addProjectV2ItemById runs before item field updates; existing items are returned rather than duplicated",
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
};

if (!apply && !verify) {
  await new Promise((resolve, reject) => {
    process.stdout.write(`${JSON.stringify({ mode: "dry-run", ...plan }, null, 2)}\n`, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
  process.exit(0);
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

function syncRepository() {
  for (const label of labels) {
    runGh([
      "label", "create", label.name,
      "--repo", repo,
      "--color", label.color,
      "--description", label.description,
      "--force",
    ]);
  }

  const existingMilestones = apiPaginated(`repos/${repo}/milestones?state=all&per_page=100`);
  const milestoneByTitle = Object.fromEntries(existingMilestones.map((milestone) => [milestone.title, milestone]));
  for (const release of manifest.releases) {
    const existing = milestoneByTitle[release.id];
    const payload = {
      title: release.id,
      description: `${release.name}. ${release.outcome}\n\nProposed planning estimate; evidence gates control entry and exit.`,
      state: "open",
    };
    if (release.targetDate) {
      payload.due_on = `${release.targetDate}T12:00:00Z`;
    } else if (existing?.due_on) {
      // GitHub's milestone API rejects both null and an empty string as a
      // clearing value. Stop rather than silently preserve a dated R10.
      throw new Error(`${release.id}: expected an undated milestone; clear its due date in GitHub before rerunning`);
    }
    const milestone = existing
      ? api("PATCH", `repos/${repo}/milestones/${existing.number}`, payload)
      : api("POST", `repos/${repo}/milestones`, payload);
    milestoneByTitle[release.id] = milestone;
  }

  const issueById = loadExistingIssues();
  const issueNumbers = Object.fromEntries(Object.entries(issueById).map(([id, issue]) => [id, issue.number]));

  // First pass never changes issue state. This prevents evidence-backed Done
  // issues from being reopened transiently while their metadata is refreshed.
  for (const task of manifest.tasks) {
    const milestone = milestoneByTitle[task.milestone];
    if (!milestone) throw new Error(`No GitHub milestone resolved for ${task.milestone}`);
    const issueLabels = ["phase1", "roadmap", statusLabel(task.status), priorityLabel(task.priority), typeLabel(task.taskType)];
    const payload = {
      title: task.issueTitle,
      body: issueBody(task, issueNumbers),
      milestone: milestone.number,
      labels: issueLabels,
    };
    const existing = issueById[task.id];
    const issue = existing
      ? api("PATCH", `repos/${repo}/issues/${existing.number}`, payload)
      : api("POST", `repos/${repo}/issues`, payload);
    issueById[task.id] = issue;
    issueNumbers[task.id] = issue.number;
  }

  // Second pass resolves dependency IDs now that every issue number exists.
  for (const task of manifest.tasks) {
    const issue = issueById[task.id];
    const payload = {
      body: issueBody(task, issueNumbers),
    };
    if (task.status !== "Done") payload.state = "open";
    if (closeDone && task.status === "Done") {
      payload.state = "closed";
      payload.state_reason = "completed";
    }
    api("PATCH", `repos/${repo}/issues/${issue.number}`, payload);
  }

  return { issueById, milestoneByTitle };
}

function requireAllIssues(issueById) {
  const missing = manifest.tasks.filter((task) => !issueById[task.id]).map((task) => task.id);
  if (missing.length) {
    throw new Error(`Project sync requires all 58 repository issues. Missing: ${missing.join(", ")}`);
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

function createProjectField(projectId, spec) {
  graphql(`
    mutation CreatePhase1Field($input: CreateProjectV2FieldInput!) {
      createProjectV2Field(input: $input) {
        projectV2Field {
          ... on ProjectV2FieldCommon { id }
        }
      }
    }
  `, {
    input: {
      projectId,
      name: spec.name,
      dataType: spec.dataType,
      ...(spec.options ? { singleSelectOptions: spec.options } : {}),
    },
  });
}

function updateProjectField(field, spec) {
  const input = { fieldId: field.id };
  let changed = false;
  if (field.name !== spec.name) {
    input.name = spec.name;
    changed = true;
  }

  if (spec.options) {
    const desiredByName = new Map(spec.options.map((option) => [option.name.toLowerCase(), option]));
    const matched = new Set();
    const singleSelectOptions = field.options.map((existing) => {
      const desired = desiredByName.get(existing.name.toLowerCase());
      if (!desired) {
        return {
          id: existing.id,
          name: existing.name,
          color: existing.color,
          description: existing.description,
        };
      }
      matched.add(desired.name.toLowerCase());
      if (
        existing.name !== desired.name ||
        existing.color !== desired.color ||
        existing.description !== desired.description
      ) changed = true;
      return { id: existing.id, ...desired };
    });
    for (const desired of spec.options) {
      if (!matched.has(desired.name.toLowerCase())) {
        singleSelectOptions.push(desired);
        changed = true;
      }
    }
    if (changed) input.singleSelectOptions = singleSelectOptions;
  }

  if (!changed) return;
  graphql(`
    mutation UpdatePhase1Field($input: UpdateProjectV2FieldInput!) {
      updateProjectV2Field(input: $input) {
        projectV2Field {
          ... on ProjectV2FieldCommon { id }
        }
      }
    }
  `, { input });
}

function ensureProjectFields(projectId) {
  let fields = queryProjectFields(projectId);
  for (const spec of projectFieldSpecs) {
    const matches = fields.filter((field) => field.name.toLowerCase() === spec.name.toLowerCase());
    if (matches.length > 1) throw new Error(`Multiple Project fields match ${spec.name}`);
    if (!matches.length) {
      createProjectField(projectId, spec);
      fields = queryProjectFields(projectId);
      continue;
    }
    const field = matches[0];
    if (field.dataType !== spec.dataType) {
      throw new Error(`Project field ${field.name} is ${field.dataType}; expected ${spec.dataType}`);
    }
    updateProjectField(field, spec);
    fields = queryProjectFields(projectId);
  }

  const resolved = Object.fromEntries(projectFieldSpecs.map((spec) => {
    const field = fields.find((candidate) => candidate.name === spec.name);
    if (!field) throw new Error(`Project field was not resolved after sync: ${spec.name}`);
    if (spec.options) {
      for (const option of spec.options) {
        if (!field.options.some((candidate) => candidate.name === option.name)) {
          throw new Error(`Project field ${spec.name} has no ${option.name} option after sync`);
        }
      }
    }
    return [spec.name, field];
  }));
  return resolved;
}

function addIssueToProject(projectId, issue) {
  const data = graphql(`
    mutation AddPhase1Issue($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
        item { id }
      }
    }
  `, { projectId, contentId: issue.node_id });
  const itemId = data.addProjectV2ItemById?.item?.id;
  if (!itemId) throw new Error(`GitHub did not return a Project item for issue #${issue.number}`);
  return itemId;
}

function updateProjectItem(projectId, itemId, fields, task) {
  const values = projectValues(task);
  const definitions = ["$projectId: ID!", "$itemId: ID!"];
  const variables = { projectId, itemId };
  const operations = [];

  for (const [index, spec] of projectFieldSpecs.entries()) {
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

  graphql(`mutation SyncPhase1Item(${definitions.join(", ")}) { ${operations.join("\n")} }`, variables);
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

function nodeFieldId(fields, name) {
  const id = fields[name]?.id;
  if (typeof id !== "string" || !id) throw new Error(`Project field ${name} has no node ID for the view API`);
  return id;
}

function createSavedViews(projectId, onlyViewName = null) {
  const existingViews = queryProjectViews(projectId);
  const viewFields = Object.fromEntries(queryProjectFields(projectId).map((field) => [field.name, field]));
  const filter = canonicalViewFilter;
  const created = [];
  const updated = [];
  const before = [];
  const after = [];

  for (const spec of savedViewSpecs.filter((candidate) => !onlyViewName || candidate.name === onlyViewName)) {
    const matches = existingViews.filter((view) => view.name === spec.name);
    if (matches.length > 1) throw new Error(`Multiple Project views match ${spec.name}`);
    const configuration = spec.visibleFieldNames
      ? { visibleFieldIds: spec.visibleFieldNames.map((name) => nodeFieldId(viewFields, name)) }
      : undefined;
    let view = matches[0];
    if (view) before.push({ name: view.name, layout: view.layout, filter: view.filter });

    if (!view) {
      const data = graphql(`
        mutation CreatePhase1View($input: CreateProjectV2ViewInput!) {
          createProjectV2View(input: $input) {
            projectV2View { id name layout }
          }
        }
      `, {
        input: {
          projectId,
          name: spec.name,
          layout: spec.layout,
          ...(configuration ? { configuration } : {}),
        },
      });
      view = data.createProjectV2View?.projectV2View;
      if (!view?.id) throw new Error(`GitHub did not return the created Project view ${spec.name}`);
      created.push(spec.name);
    } else {
      updated.push(spec.name);
    }

    const data = graphql(`
      mutation UpdatePhase1View($input: UpdateProjectV2ViewInput!) {
        updateProjectV2View(input: $input) {
          projectV2View { id name layout filter }
        }
      }
    `, {
      input: {
        viewId: view.id,
        name: spec.name,
        layout: spec.layout,
        filter,
        ...(configuration ? { configuration } : {}),
      },
    });
    const updatedView = data.updateProjectV2View?.projectV2View;
    if (!updatedView) throw new Error(`GitHub did not return the updated Project view ${spec.name}`);
    after.push({ name: updatedView.name, layout: updatedView.layout, filter: updatedView.filter });
  }

  return { created, updated, before, after };
}

function syncProject(issueById) {
  requireAllIssues(issueById);
  const project = queryProject();
  const fields = ensureProjectFields(project.id);
  const projectItemByTask = {};

  for (const task of manifest.tasks) {
    const issue = issueById[task.id];
    const itemId = addIssueToProject(project.id, issue);
    updateProjectItem(project.id, itemId, fields, task);
    projectItemByTask[task.id] = itemId;
  }

  const views = skipViews
    ? { created: [], updated: [], before: [], after: [] }
    : createSavedViews(project.id);
  return { projectItemByTask, views };
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
      statusLabel(task.status),
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
    const expectedState = task.status === "Done" ? "closed" : "open";
    if (issue.state !== expectedState) mismatches.push(`${task.id}:issue-state`);
    if (issueMap[task.id]?.expectedStatus !== task.status) mismatches.push(`${task.id}:issue-map-status`);
    if (issueMap[task.id]?.expectedFinalState !== expectedState) mismatches.push(`${task.id}:issue-map-state`);
    if (task.milestone === "R10" && issue.milestone?.due_on) mismatches.push(`${task.id}:r10-milestone-date`);
  }

  const itemResult = runGh([
    "project", "item-list", String(projectNumber),
    "--owner", projectOwner,
    "--limit", "200",
    "--format", "json",
  ]);
  const projectItems = JSON.parse(itemResult.stdout).items ?? [];
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
    itemByTask[markerId] = item;
  }

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
      statusLabel(task.status),
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

  const project = queryProject();
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
  };
}

runGh(["auth", "status", "--hostname", "github.com"]);

if (verify) {
  const report = verifyLiveParity();
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
} else if (viewsOnly) {
  const project = queryProject();
  const views = createSavedViews(project.id, selectedViewName);
  console.log(JSON.stringify({
    mode: "apply-view-only",
    repository: repo,
    project: projectUrl,
    selectedView: selectedViewName,
    canonicalViewFilter,
    views,
  }, null, 2));
} else {

let issueById;
let milestoneByTitle = {};
if (projectOnly) {
  issueById = loadExistingIssues();
  requireAllIssues(issueById);
} else {
  ({ issueById, milestoneByTitle } = syncRepository());
}

let projectResult = null;
if (!issuesOnly) projectResult = syncProject(issueById);

const updatedIssueMapDocument = {
  schemaVersion: "1.0.0",
  generatedAt: existingIssueMapDocument?.generatedAt ?? new Date().toISOString(),
  repository: repoUrl,
  project: projectUrl,
  issues: Object.fromEntries(manifest.tasks.map((task) => {
    const issue = issueById[task.id];
    return [task.id, {
      number: issue.number,
      url: issue.html_url,
      expectedStatus: task.status,
      expectedFinalState: task.status === "Done" ? "closed" : "open",
    }];
  })),
};
const issueMapChanged = JSON.stringify({
  repository: existingIssueMapDocument?.repository,
  project: existingIssueMapDocument?.project,
  issues: existingIssueMapDocument?.issues,
}) !== JSON.stringify({
  repository: updatedIssueMapDocument.repository,
  project: updatedIssueMapDocument.project,
  issues: updatedIssueMapDocument.issues,
});
if (issueMapChanged) {
  updatedIssueMapDocument.generatedAt = new Date().toISOString();
  fs.writeFileSync(issueMapPath, `${JSON.stringify(updatedIssueMapDocument, null, 2)}\n`);
}

console.log(JSON.stringify({
  mode: projectOnly
    ? "apply-project-only"
    : issuesOnly
      ? "apply-issues-only"
      : closeDone
        ? "apply-and-close-done"
        : "apply",
  repository: repo,
  project: projectUrl,
  labels: projectOnly ? 0 : labels.length,
  milestones: projectOnly
    ? 0
    : Object.keys(milestoneByTitle).filter((title) => manifest.releases.some((release) => release.id === title)).length,
  issues: Object.keys(issueById).filter((id) => manifest.tasks.some((task) => task.id === id)).length,
  projectItems: projectResult ? Object.keys(projectResult.projectItemByTask).length : 0,
  views: projectResult?.views ?? { created: [], updated: [] },
  expectedFinalStates: plan.finalIssueStates,
  issueMap: path.relative(repoRoot, issueMapPath),
  issueMapChanged,
  uiOnlyRemaining: projectResult ? plan.projectSync.uiOnlyAfterSync : [],
}, null, 2));
}
