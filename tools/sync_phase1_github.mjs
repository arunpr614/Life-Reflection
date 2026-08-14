import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const repo = "arunpr614/Life-Reflection";
const repoUrl = `https://github.com/${repo}`;
const projectOwner = "arunpr614";
const projectNumber = 1;
const projectUrl = `https://github.com/users/${projectOwner}/projects/${projectNumber}`;
const manifestPath = path.join(repoRoot, "docs/project/PHASE1-ROADMAP-MANIFEST.json");
const issueMapPath = path.join(repoRoot, "docs/project/PHASE1-GITHUB-ISSUES.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const args = new Set(process.argv.slice(2));
const supportedArgs = new Set([
  "--apply",
  "--close-done",
  "--help",
  "--issues-only",
  "--project-only",
  "--skip-views",
]);
const unknownArgs = [...args].filter((arg) => !supportedArgs.has(arg));
if (unknownArgs.length) throw new Error(`Unknown argument(s): ${unknownArgs.join(", ")}`);

const apply = args.has("--apply");
const closeDone = args.has("--close-done");
const issuesOnly = args.has("--issues-only");
const projectOnly = args.has("--project-only");
const skipViews = args.has("--skip-views");

if (args.has("--help")) {
  console.log(`Usage: node tools/sync_phase1_github.mjs [options]

Dry-run is the default and makes no GitHub or local-file changes.

Options:
  --apply          Apply repository and Project V2 changes.
  --project-only   Require the 58 issues to exist; update only Project V2.
  --issues-only    Synchronize labels, milestones, and issues; skip Project V2.
  --skip-views     Skip creation of the two saved Project V2 views.
  --close-done     Close evidence-backed Done issues (requires --apply).
  --help           Show this help.
`);
  process.exit(0);
}

if (closeDone && !apply) throw new Error("--close-done requires --apply");
if (projectOnly && issuesOnly) throw new Error("--project-only and --issues-only are mutually exclusive");
if (projectOnly && closeDone) throw new Error("--close-done cannot be combined with --project-only");

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

## Traceability

- **Requirement IDs:** ${requirements}
- **Dependencies:** ${dependencies}
- **Dependency semantics:** Progressive handoff is allowed, but this task cannot close or cross its evidence/release gate before prerequisite evidence exists.
- **PRD / PID:** ${mdLink(task.prdPidPath, task.prdPidUrl)}
- **Design artifacts:** ${designLinks}
- **Architecture:** ${mdLink(task.architecturePath, task.architectureUrl)}
- **Canonical manifest:** ${mdLink("docs/project/PHASE1-ROADMAP-MANIFEST.json", `${repoUrl}/blob/main/docs/project/PHASE1-ROADMAP-MANIFEST.json`)}

## Acceptance evidence required

${task.acceptanceEvidence}

## Rollback / restore impact

${task.rollbackRestoreImpact}

## Status evidence boundary

${task.doneMeaning}

---

Managed from the Phase 1 roadmap manifest. Update the manifest and synchronize this issue rather than changing planning metadata in only one place.
`;
}

function projectValues(task) {
  return {
    "Status": task.status,
    "Start date": task.startDate,
    "Target date": task.targetDate,
    "Priority": task.priority,
    "PRD / PID": task.prdPidUrl,
    "Design artifact": task.designArtifactUrls.join("\n"),
    "Requirement IDs": task.requirementIds.length ? task.requirementIds.join(", ") : "Planning-only",
    "Evidence": task.acceptanceEvidence,
    "Owner role": task.ownerRole,
    "Task summary": task.description,
  };
}

function validateManifest() {
  if (manifest.tasks.length !== 58) {
    throw new Error(`Expected the canonical 58 tasks; found ${manifest.tasks.length}`);
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

const plan = {
  repository: repo,
  project: projectUrl,
  selection: {
    issues: !projectOnly,
    project: !issuesOnly,
    views: !issuesOnly && !skipViews,
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

if (!apply) {
  console.log(JSON.stringify({ mode: "dry-run", ...plan }, null, 2));
  process.exit(0);
}

function loadExistingIssues() {
  const issues = apiPaginated(`repos/${repo}/issues?state=all&per_page=100`)
    .filter((issue) => !issue.pull_request);
  const issueById = {};
  for (const issue of issues) {
    const match = issue.title.match(/^\[([^\]]+)\]/);
    if (!match || !manifest.tasks.some((task) => task.id === match[1])) continue;
    if (issueById[match[1]]) throw new Error(`Multiple repository issues match task ${match[1]}`);
    issueById[match[1]] = issue;
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

  // First pass keeps new issues open so existing Project auto-add workflows can see them.
  // Evidence-backed Done issues close only when --close-done is explicit.
  for (const task of manifest.tasks) {
    const milestone = milestoneByTitle[task.milestone];
    if (!milestone) throw new Error(`No GitHub milestone resolved for ${task.milestone}`);
    const issueLabels = ["phase1", "roadmap", statusLabel(task.status), priorityLabel(task.priority), typeLabel(task.taskType)];
    const payload = {
      title: task.issueTitle,
      body: issueBody(task, issueNumbers),
      milestone: milestone.number,
      labels: issueLabels,
      state: "open",
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
      state: closeDone && task.status === "Done" ? "closed" : "open",
    };
    if (closeDone && task.status === "Done") payload.state_reason = "completed";
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

function createSavedViews(projectId) {
  const existingViews = queryProjectViews(projectId);
  const viewFields = Object.fromEntries(queryProjectFields(projectId).map((field) => [field.name, field]));
  const filter = `repo:${repo} is:issue`;
  const created = [];
  const updated = [];

  for (const spec of savedViewSpecs) {
    const matches = existingViews.filter((view) => view.name === spec.name);
    if (matches.length > 1) throw new Error(`Multiple Project views match ${spec.name}`);
    const configuration = spec.visibleFieldNames
      ? { visibleFieldIds: spec.visibleFieldNames.map((name) => nodeFieldId(viewFields, name)) }
      : undefined;
    let view = matches[0];

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

    graphql(`
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
  }

  return { created, updated };
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

  const views = skipViews ? { created: [], updated: [] } : createSavedViews(project.id);
  return { projectItemByTask, views };
}

runGh(["auth", "status", "--hostname", "github.com"]);

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

const issueMap = {
  schemaVersion: "1.0.0",
  generatedAt: new Date().toISOString(),
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
fs.writeFileSync(issueMapPath, `${JSON.stringify(issueMap, null, 2)}\n`);

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
  uiOnlyRemaining: projectResult ? plan.projectSync.uiOnlyAfterSync : [],
}, null, 2));
