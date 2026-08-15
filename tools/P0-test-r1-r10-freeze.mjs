#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import {
  ALLOWED_AGGREGATE_PROVENANCE_PATHS,
  extractFrozenMarkdownProjection,
  loadSourceAtGitRevision,
  validateFreezeSnapshot,
  verifyFrozenScope,
  verifySanitizedIssueProjectAdapter,
  verifySourceAgainstFreeze,
} from "./P0-verify-r1-r10-freeze.mjs";
import { execFileSync } from "node:child_process";
import { parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";

const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();
const revision = execFileSync("git", ["rev-parse", "HEAD^{commit}"], {
  cwd: repoRoot,
  encoding: "utf8",
}).trim();
const snapshotBytes = execFileSync(
  "git",
  ["show", `${revision}:docs/project/P0-R1-R10-FREEZE-SNAPSHOT.json`],
  { cwd: repoRoot, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
);
const snapshot = parseJsonWithoutDuplicateKeys(snapshotBytes, "freeze snapshot test fixture");
const source = loadSourceAtGitRevision({ repoRoot, revision, snapshot });

let cases = 0;

function clone(value) {
  return structuredClone(value);
}

function expectPass(action, label) {
  cases += 1;
  try {
    action();
  } catch (error) {
    throw new Error(`${label} unexpectedly failed: ${error.message}`);
  }
}

function expectFailure(action, pattern, label) {
  cases += 1;
  let error = null;
  try {
    action();
  } catch (caught) {
    error = caught;
  }
  if (!error) throw new Error(`${label} unexpectedly passed`);
  if (!pattern.test(error.message)) {
    throw new Error(`${label} failed for the wrong reason: ${error.message}`);
  }
}

function adapterFromSnapshot() {
  return {
    repository: snapshot.repository,
    projectNumber: snapshot.projectNumber,
    tasks: snapshot.tasks.map((task) => ({
      taskId: task.taskId,
      issue: clone(task.issue),
      projectFields: clone(task.projectFields),
    })),
  };
}

expectPass(() => validateFreezeSnapshot(snapshot), "immutable snapshot validates");
expectPass(() => verifySourceAgainstFreeze(snapshot, source), "exact Git source validates");
expectPass(
  () => verifyFrozenScope({ snapshot, source, projection: adapterFromSnapshot(), live: adapterFromSnapshot() }),
  "source plus sanitized projection/live adapters validate",
);
expectPass(
  () => verifySanitizedIssueProjectAdapter(snapshot, adapterFromSnapshot(), "fixture"),
  "standalone projection API validates",
);
expectPass(() => {
  if (source.aggregateChanges.some((change) => !ALLOWED_AGGREGATE_PROVENANCE_PATHS.includes(change.path))) {
    throw new Error("aggregate allowlist escaped");
  }
}, "aggregate changes remain in the closed four-path set");

expectPass(() => {
  const result = verifyFrozenScope({ snapshot, source });
  if (result.source.ownerActionSemantics.actionCount !== 12
    || result.source.aggregateSemantics.markdownMilestoneRows !== 10
    || result.source.aggregateSemantics.markdownTaskRows !== 50
    || result.source.aggregateSemantics.workbookMilestoneRows !== 42
    || result.source.aggregateSemantics.workbookTaskRows !== 100
    || result.source.aggregateSemantics.workbookRequirementRows !== 71
    || result.source.aggregateSemantics.workbookRequirementMappings !== 762) {
    throw new Error(`unexpected frozen aggregate row counts: ${JSON.stringify(result.source.aggregateSemantics)}`);
  }
}, "all owner-action, Markdown, and workbook frozen projections validate");

const changedSnapshot = clone(snapshot);
changedSnapshot.tasks[0].authoredTask.title = "tampered";
expectFailure(() => validateFreezeSnapshot(changedSnapshot), /snapshot payload digest/, "snapshot tampering is rejected");

const authoredDrift = clone(source);
authoredDrift.manifest.tasks.find((task) => task.id === snapshot.tasks[0].taskId).title = "semantic drift";
expectFailure(() => verifySourceAgainstFreeze(snapshot, authoredDrift), /authored semantics/, "authored semantics drift is rejected");

const generatedTaskDrift = clone(source);
generatedTaskDrift.manifest.tasks.find((task) => task.id === snapshot.tasks[0].taskId).taskDossier.nextAction = "drift";
expectFailure(() => verifySourceAgainstFreeze(snapshot, generatedTaskDrift), /full manifest-task digest/, "full manifest task drift is rejected");

const registerDrift = clone(source);
registerDrift.register.tasks.find((task) => task.taskId === snapshot.tasks[0].taskId).nextAction = "drift";
expectFailure(() => verifySourceAgainstFreeze(snapshot, registerDrift), /full artifact-register task digest/, "full register task drift is rejected");

const manifestIdDrift = clone(source);
manifestIdDrift.manifest.tasks = manifestIdDrift.manifest.tasks.filter((task) => task.id !== snapshot.tasks[0].taskId);
expectFailure(() => verifySourceAgainstFreeze(snapshot, manifestIdDrift), /exact frozen 50-task ID set/, "missing manifest task is rejected");

const registerIdDrift = clone(source);
registerIdDrift.register.tasks = registerIdDrift.register.tasks.filter((task) => task.taskId !== snapshot.tasks[0].taskId);
expectFailure(() => verifySourceAgainstFreeze(snapshot, registerIdDrift), /exact frozen 50-task ID set/, "missing register task is rejected");

const readinessDrift = clone(source);
readinessDrift.readiness.taskOverrides[snapshot.tasks[0].taskId] = { executionAllowed: true };
expectFailure(() => verifySourceAgainstFreeze(snapshot, readinessDrift), /readiness override/, "readiness drift is rejected");

const taskStateDrift = clone(source);
taskStateDrift.taskState.statusOverrides[snapshot.tasks[0].taskId] = "In progress";
expectFailure(() => verifySourceAgainstFreeze(snapshot, taskStateDrift), /task-state override/, "task status drift is rejected");

const approvalDrift = clone(source);
approvalDrift.approvals.taskApprovals[snapshot.tasks[0].taskId] = { verdict: "approve" };
expectFailure(() => verifySourceAgainstFreeze(snapshot, approvalDrift), /task approval/, "task approval is rejected");

const controlReviewDrift = clone(source);
controlReviewDrift.approvals.controlReviews[snapshot.tasks[0].taskId] = { verdict: "approve" };
expectFailure(() => verifySourceAgainstFreeze(snapshot, controlReviewDrift), /control review/, "control review is rejected");

const issueMapDrift = clone(source);
issueMapDrift.issueMap.issues[snapshot.tasks[0].taskId].expectedFinalState = "closed";
expectFailure(() => verifySourceAgainstFreeze(snapshot, issueMapDrift), /issue map/, "issue-map drift is rejected");

const permittedP0OwnerActionChange = clone(source);
permittedP0OwnerActionChange.ownerActionSemantics.current.actions["R0-OA-001"].status = "P0/R0-only test change";
expectPass(
  () => verifySourceAgainstFreeze(snapshot, permittedP0OwnerActionChange),
  "P0/R0-only owner-action changes remain outside the frozen projection",
);

const ownerActionStateDrift = clone(source);
ownerActionStateDrift.ownerActionSemantics.current.actions["R1-OA-001"].status = "verified";
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, ownerActionStateDrift),
  /owner-action requirement\/state semantics/,
  "R1-R10 owner-action state drift is rejected",
);

const ownerActionRequirementDrift = clone(source);
ownerActionRequirementDrift.ownerActionSemantics.current.actions["R2-OA-001"].requiredForActionClasses.push("unfrozen-action");
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, ownerActionRequirementDrift),
  /owner-action requirement\/state semantics/,
  "R1-R10 owner-action requirement drift is rejected",
);

const missingOwnerAction = clone(source);
delete missingOwnerAction.ownerActionSemantics.current.actions["R10-OA-002"];
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, missingOwnerAction),
  /exact R1-R10 owner-action record set/,
  "a missing R1-R10 owner-action record is rejected",
);

const extraOwnerAction = clone(source);
extraOwnerAction.ownerActionSemantics.current.actions["R3-OA-001"] = {
  ...clone(extraOwnerAction.ownerActionSemantics.current.actions["R1-OA-001"]),
  actionId: "R3-OA-001",
};
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, extraOwnerAction),
  /exact R1-R10 owner-action record set/,
  "an added R1-R10 owner-action record is rejected",
);

const substitutedOwnerActionBaseline = clone(source);
substitutedOwnerActionBaseline.ownerActionSemantics.baseline.actions["R1-OA-001"].status = "substituted";
substitutedOwnerActionBaseline.ownerActionSemantics.current.actions["R1-OA-001"].status = "substituted";
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, substitutedOwnerActionBaseline),
  /baseline R1-R10 owner-action semantics/,
  "a matching but substituted owner-action baseline is rejected",
);

const ownerActionModeDrift = clone(source);
ownerActionModeDrift.ownerActionSemantics.currentFile.gitMode = "100755";
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, ownerActionModeDrift),
  /canonical regular 100644 source/,
  "an executable owner-action source is rejected",
);

const firstArtifact = snapshot.tasks[0].artifacts[0];
const artifactByteDrift = clone(source);
artifactByteDrift.artifacts[firstArtifact.path].sha256 = "0".repeat(64);
expectFailure(() => verifySourceAgainstFreeze(snapshot, artifactByteDrift), /bytes differ/, "artifact byte drift is rejected");

const artifactModeDrift = clone(source);
artifactModeDrift.artifacts[firstArtifact.path].gitMode = "100755";
expectFailure(() => verifySourceAgainstFreeze(snapshot, artifactModeDrift), /regular 100644/, "artifact mode drift is rejected");

const provenanceDrift = clone(source);
provenanceDrift.baselineSourceFiles.manifest.sha256 = "0".repeat(64);
expectFailure(() => verifySourceAgainstFreeze(snapshot, provenanceDrift), /baseline source provenance/, "baseline source mismatch is rejected");

const ancestryDrift = clone(source);
ancestryDrift.baselineAncestor = false;
expectFailure(() => verifySourceAgainstFreeze(snapshot, ancestryDrift), /not an ancestor/, "non-descendant source is rejected");

const extraAggregate = clone(source);
extraAggregate.aggregateChanges.push({
  path: "docs/work-items/ARCH-R1-001/P0-ARCH-R1-001-PRD.md",
  baselineSha256: "0".repeat(64),
  currentSha256: "1".repeat(64),
  baselineGitMode: "100644",
  baselineGitType: "blob",
  currentGitMode: "100644",
  currentGitType: "blob",
});
expectFailure(() => verifySourceAgainstFreeze(snapshot, extraAggregate), /unallowlisted aggregate/, "fifth aggregate exception is rejected");

const aggregateModeDrift = clone(source);
aggregateModeDrift.aggregateChanges.push({
  path: ALLOWED_AGGREGATE_PROVENANCE_PATHS[0],
  baselineSha256: "0".repeat(64),
  currentSha256: "1".repeat(64),
  baselineGitMode: "100644",
  baselineGitType: "blob",
  currentGitMode: "100755",
  currentGitType: "blob",
});
expectFailure(() => verifySourceAgainstFreeze(snapshot, aggregateModeDrift), /regular 100644/, "aggregate mode/type escape is rejected");

const markdownRowDrift = clone(source);
markdownRowDrift.aggregateSemantics.current.markdown.tasks[snapshot.tasks[0].taskId] += " semantic drift";
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, markdownRowDrift),
  /release-plan Markdown frozen rows/,
  "generated Markdown frozen task-row drift is rejected",
);

const markdownMilestoneDrift = clone(source);
markdownMilestoneDrift.aggregateSemantics.current.markdown.milestones.R1 += " semantic drift";
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, markdownMilestoneDrift),
  /release-plan Markdown frozen rows/,
  "generated Markdown frozen milestone-row drift is rejected",
);

const workbookRowDrift = clone(source);
workbookRowDrift.aggregateSemantics.current.workbook.taskRows[snapshot.tasks[0].taskId].B.value = "semantic drift";
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, workbookRowDrift),
  /workbook frozen rows\/cells\/links\/formulas/,
  "canonical workbook frozen task-cell drift is rejected",
);

const workbookFormulaDrift = clone(source);
workbookFormulaDrift.aggregateSemantics.current.workbook.timelineRows[snapshot.tasks[0].taskId].I.formula = "1+1";
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, workbookFormulaDrift),
  /workbook frozen rows\/cells\/links\/formulas/,
  "canonical workbook frozen formula drift is rejected",
);

const workbookLinkDrift = clone(source);
workbookLinkDrift.aggregateSemantics.current.workbook.taskRows[snapshot.tasks[0].taskId].P.hyperlink = "https://example.invalid/drift";
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, workbookLinkDrift),
  /workbook frozen rows\/cells\/links\/formulas/,
  "canonical workbook frozen link drift is rejected",
);

const firstRequirementId = Object.keys(source.aggregateSemantics.current.workbook.requirementRows)[0];
const workbookRequirementMappingDrift = clone(source);
workbookRequirementMappingDrift.aggregateSemantics.current.workbook.requirementRows[firstRequirementId].C.frozenTaskIds.pop();
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, workbookRequirementMappingDrift),
  /workbook frozen rows\/cells\/links\/formulas/,
  "canonical workbook Requirement Map task mapping drift is rejected",
);

const workbookRequirementMetadataDrift = clone(source);
workbookRequirementMetadataDrift.aggregateSemantics.current.workbook.requirementRows[firstRequirementId].E.value = "semantic drift";
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, workbookRequirementMetadataDrift),
  /workbook frozen rows\/cells\/links\/formulas/,
  "canonical workbook Requirement Map row metadata drift is rejected",
);

const workbookRequirementFormulaDrift = clone(source);
workbookRequirementFormulaDrift.aggregateSemantics.current.workbook.requirementRows[firstRequirementId].F.formula = "1+1";
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, workbookRequirementFormulaDrift),
  /workbook frozen rows\/cells\/links\/formulas/,
  "canonical workbook Requirement Map formula drift is rejected",
);

const missingWorkbookRequirementRow = clone(source);
delete missingWorkbookRequirementRow.aggregateSemantics.current.workbook.requirementRows[firstRequirementId];
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, missingWorkbookRequirementRow),
  /workbook frozen rows\/cells\/links\/formulas/,
  "a missing canonical workbook Requirement Map row is rejected",
);

const missingAggregateSemantics = clone(source);
delete missingAggregateSemantics.aggregateSemantics;
expectFailure(
  () => verifySourceAgainstFreeze(snapshot, missingAggregateSemantics),
  /semantic projections are missing/,
  "missing generated aggregate semantic evidence is rejected",
);

const markdownBytes = Buffer.from(source.aggregateSemantics.current.markdown.tasks[snapshot.tasks[0].taskId]);
expectFailure(
  () => extractFrozenMarkdownProjection(markdownBytes, snapshot),
  /exact R1-R10 milestone rows/,
  "partial Markdown input cannot masquerade as a complete projection",
);

const projectionIssueDrift = adapterFromSnapshot();
projectionIssueDrift.tasks[0].issue.bodySha256 = "0".repeat(64);
expectFailure(
  () => verifySanitizedIssueProjectAdapter(snapshot, projectionIssueDrift, "projection"),
  /issue values/,
  "issue-body projection drift is rejected",
);

const projectionIssueTitleDrift = adapterFromSnapshot();
projectionIssueTitleDrift.tasks[0].issue.title = "drifted issue title";
expectFailure(
  () => verifySanitizedIssueProjectAdapter(snapshot, projectionIssueTitleDrift, "projection"),
  /issue values/,
  "issue title drift is rejected",
);

const projectionContentTitleDrift = adapterFromSnapshot();
projectionContentTitleDrift.tasks[0].projectFields.content.title = "drifted Project content title";
expectFailure(
  () => verifySanitizedIssueProjectAdapter(snapshot, projectionContentTitleDrift, "projection"),
  /Project values/,
  "Project content title drift is rejected",
);

const redundantProjectTitleDrift = adapterFromSnapshot();
redundantProjectTitleDrift.tasks[0].projectFields.title = "known redundant live-only title drift";
expectPass(
  () => verifySanitizedIssueProjectAdapter(snapshot, redundantProjectTitleDrift, "projection"),
  "only the redundant unmanaged top-level Project title is excluded",
);

const redundantProjectTitleAbsent = adapterFromSnapshot();
delete redundantProjectTitleAbsent.tasks[0].projectFields.title;
expectPass(
  () => verifySanitizedIssueProjectAdapter(snapshot, redundantProjectTitleAbsent, "projection"),
  "the redundant unmanaged top-level Project title may be absent",
);

const extraProjectField = adapterFromSnapshot();
extraProjectField.tasks[0].projectFields.unexpected = "drift";
expectFailure(
  () => verifySanitizedIssueProjectAdapter(snapshot, extraProjectField, "projection"),
  /Project values/,
  "every other extra Project key is rejected",
);

const missingManagedProjectField = adapterFromSnapshot();
delete missingManagedProjectField.tasks[0].projectFields.evidence;
expectFailure(
  () => verifySanitizedIssueProjectAdapter(snapshot, missingManagedProjectField, "projection"),
  /Project values/,
  "a missing managed Project field is rejected",
);

const projectFieldDrift = adapterFromSnapshot();
projectFieldDrift.tasks[0].projectFields.status = "In progress";
expectFailure(
  () => verifySanitizedIssueProjectAdapter(snapshot, projectFieldDrift, "live"),
  /Project values/,
  "live Project-field drift is rejected",
);

const missingAdapterTask = adapterFromSnapshot();
missingAdapterTask.tasks.pop();
expectFailure(
  () => verifySanitizedIssueProjectAdapter(snapshot, missingAdapterTask, "live"),
  /exactly 50/,
  "missing live task is rejected",
);

expectFailure(
  () => verifyFrozenScope({ snapshot, source, projectionClaimed: true }),
  /projection parity was claimed without a sanitized exact-50 adapter/,
  "missing claimed projection adapter is rejected",
);

expectFailure(
  () => verifyFrozenScope({ snapshot, source, liveClaimed: true }),
  /live parity was claimed without a sanitized exact-50 adapter/,
  "missing claimed live adapter is rejected",
);

const duplicateAdapterTask = adapterFromSnapshot();
duplicateAdapterTask.tasks[1].taskId = duplicateAdapterTask.tasks[0].taskId;
expectFailure(
  () => verifySanitizedIssueProjectAdapter(snapshot, duplicateAdapterTask, "live"),
  /malformed or duplicated/,
  "duplicate live task identity is rejected",
);

const nodeIdAdapter = adapterFromSnapshot();
const projectNodeCanary = ["PV", "TI", "_prohibited12345"].join("");
nodeIdAdapter.tasks[0].projectFields.nodeId = projectNodeCanary;
expectFailure(
  () => verifySanitizedIssueProjectAdapter(snapshot, nodeIdAdapter, "live"),
  /prohibited nodeId/,
  "Project node ID is rejected",
);

const nodeValueAdapter = adapterFromSnapshot();
nodeValueAdapter.tasks[0].projectFields.evidence = projectNodeCanary;
expectFailure(
  () => verifySanitizedIssueProjectAdapter(snapshot, nodeValueAdapter, "live"),
  /GraphQL node value/,
  "GraphQL node value is rejected",
);

const repositoryDrift = adapterFromSnapshot();
repositoryDrift.repository = "example/other";
expectFailure(
  () => verifySanitizedIssueProjectAdapter(snapshot, repositoryDrift, "live"),
  /wrong repository or Project/,
  "wrong live target is rejected",
);

const help = spawnSync(process.execPath, [resolve(repoRoot, "tools/P0-verify-r1-r10-freeze.mjs"), "--help"], {
  cwd: repoRoot,
  encoding: "utf8",
});
expectPass(() => {
  if (help.status !== 0 || !help.stdout.startsWith("Usage:") || help.stderr !== "") {
    throw new Error(`unexpected help result: ${help.status} ${help.stderr}`);
  }
}, "CLI help is side-effect-free and successful");

const unknown = spawnSync(process.execPath, [resolve(repoRoot, "tools/P0-verify-r1-r10-freeze.mjs"), "--unknown"], {
  cwd: repoRoot,
  encoding: "utf8",
});
expectPass(() => {
  if (unknown.status === 0 || !unknown.stderr.includes("unknown option")) {
    throw new Error("unknown CLI option did not fail closed");
  }
}, "unknown CLI option fails closed");

process.stdout.write(`${JSON.stringify({
  ok: true,
  suite: "P0 R1-R10 activation freeze",
  cases,
  frozenTasks: snapshot.tasks.length,
  frozenArtifacts: snapshot.tasks.flatMap((task) => task.artifacts).length,
  aggregateExceptionCount: ALLOWED_AGGREGATE_PROVENANCE_PATHS.length,
  sourceRevision: source.revision,
}, null, 2)}\n`);
