import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";
import { parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";

const repoRoot = path.resolve(import.meta.dirname, "..");
const threadId = process.argv[2] ?? "local";
if (!/^[A-Za-z0-9_-]+$/.test(threadId)) {
  throw new Error("Output identifier must contain only letters, numbers, underscores, or hyphens.");
}
const outputDir = path.join(repoRoot, "outputs", threadId);
const publicOutputDir = path.join(repoRoot, "outputs", "phase1");
const previewDir = path.join("/tmp", `life-in-days-phase1-workbook-${threadId}`);
const outputPath = path.join(outputDir, "P0-Life-in-Days-Phase1-Release-Plan.xlsx");
const publicOutputPath = path.join(publicOutputDir, "Life-in-Days-Phase1-Release-Plan.xlsx");
const manifestPath = path.join(repoRoot, "docs/project/PHASE1-ROADMAP-MANIFEST.json");

const manifestBytes = await fs.readFile(manifestPath);
const manifestSha256 = `sha256:${crypto.createHash("sha256").update(manifestBytes).digest("hex")}`;
const manifest = parseJsonWithoutDuplicateKeys(
  manifestBytes.toString("utf8"),
  "docs/project/PHASE1-ROADMAP-MANIFEST.json",
);
const { releases, tasks, requirementMap } = manifest;

if (tasks.length !== 58 || requirementMap.length !== 78 || releases.length !== 12) {
  throw new Error(`Unexpected manifest shape: ${releases.length} releases, ${tasks.length} tasks, ${requirementMap.length} requirements`);
}

const dossierUrlFields = [
  "taskPrdUrl",
  "taskArchitectureUrl",
  "taskDesignUrl",
  "taskQaUrl",
  "taskDeliveryUrl",
  "taskCouncilUrl",
];
const issueUrlPattern = /^https:\/\/github\.com\/arunpr614\/Life-Reflection\/issues\/\d+$/;
const issueUrls = tasks.map((task) => task.github?.issueUrl);
if (issueUrls.some((url) => !issueUrlPattern.test(url)) || new Set(issueUrls).size !== tasks.length) {
  throw new Error("All 58 tasks must have unique canonical Life-Reflection GitHub issue URLs.");
}
for (const task of tasks) {
  if (typeof task.artifactReadiness !== "string" || typeof task.executionAllowed !== "boolean" || !task.executionScope) {
    throw new Error(`${task.id} is missing an artifact readiness, execution permission, or execution scope field.`);
  }
  for (const field of dossierUrlFields) {
    const url = task[field];
    if (typeof url !== "string" || !url.includes(`/docs/work-items/${task.id}/P0-${task.id}-`)) {
      throw new Error(`${task.id} has an invalid ${field}: ${url ?? "missing"}`);
    }
  }
}
const readyCount = tasks.filter((task) => task.artifactReadiness === "Ready").length;
const executionAllowedCount = tasks.filter((task) => task.executionAllowed).length;
const holdCount = tasks.filter((task) => task.executionDecision === "Hold").length;
const historicalNonAuthorizingCount = tasks.filter(
  (task) => task.executionDecision === "Historical non-authorizing",
).length;
if ((manifest.summary.artifactReadinessCounts.Ready ?? 0) !== readyCount
  || manifest.summary.executionAllowedCount !== executionAllowedCount) {
  throw new Error("Manifest readiness summary does not match task-level readiness fields.");
}
if (tasks.length !== 58
  || (manifest.summary.artifactReadinessCounts.Incomplete ?? 0) !== 58
  || readyCount !== 0
  || holdCount !== 45
  || historicalNonAuthorizingCount !== 13
  || executionAllowedCount !== 0) {
  throw new Error("Current readiness truth must remain exactly 58 Incomplete; 45 Hold + 13 Historical non-authorizing; 0 Ready; 0 execution-allowed.");
}
const currentReadinessTruth = `${manifest.summary.artifactReadinessCounts.Incomplete} Incomplete; ${holdCount} Hold + ${historicalNonAuthorizingCount} Historical non-authorizing; ${readyCount} Ready; ${executionAllowedCount} execution-allowed`;
if (tasks.some((task) => task.executionAllowed && task.artifactReadiness !== "Ready")) {
  throw new Error("Execution cannot be allowed unless the task dossier is Ready.");
}
const r10Release = releases.find((release) => release.id === "R10");
const r10Tasks = tasks.filter((task) => task.milestone === "R10");
if (!r10Release || r10Release.startDate !== null || r10Release.targetDate !== null
  || r10Tasks.length !== 3
  || r10Tasks.some((task) => task.startDate !== null || task.targetDate !== null)) {
  throw new Error("R10 must remain trigger-only with null release and task dates.");
}

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(publicOutputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const workbook = Workbook.create();
const summary = workbook.worksheets.add("Executive Summary");
const releaseSheet = workbook.worksheets.add("Release Plan");
const taskSheet = workbook.worksheets.add("Roadmap Tasks");
const timelineSheet = workbook.worksheets.add("Roadmap Timeline");
const requirementSheet = workbook.worksheets.add("Requirement Map");
const riskSheet = workbook.worksheets.add("Risks & Gates");
const guideSheet = workbook.worksheets.add("Review Guide");

const colors = {
  ink: "#0F172A",
  slate: "#334155",
  muted: "#64748B",
  line: "#CBD5E1",
  paper: "#F8FAFC",
  white: "#FFFFFF",
  teal: "#0F766E",
  tealLight: "#CCFBF1",
  blue: "#2563EB",
  blueLight: "#DBEAFE",
  green: "#15803D",
  greenLight: "#DCFCE7",
  amber: "#B45309",
  amberLight: "#FEF3C7",
  purple: "#7C3AED",
  purpleLight: "#EDE9FE",
  red: "#B91C1C",
  redLight: "#FEE2E2",
};

const statusFill = {
  Backlog: colors.paper,
  Next: colors.blueLight,
  "In progress": colors.amberLight,
  Done: colors.greenLight,
};

const toDate = (value) => value ? new Date(`${value}T00:00:00.000Z`) : null;
const excelDateFormat = "yyyy-mm-dd";
const safe = (value) => value ?? "";
const join = (values) => values?.length ? values.join(", ") : "";

function addTitle(sheet, endColumn, title, subtitle) {
  const titleRange = sheet.getRange(`A1:${endColumn}2`);
  titleRange.merge();
  titleRange.values = [[title]];
  titleRange.format = {
    fill: colors.ink,
    font: { bold: true, color: colors.white, size: 20 },
    verticalAlignment: "center",
    horizontalAlignment: "left",
    wrapText: true,
  };
  titleRange.format.rowHeight = 28;

  const subtitleRange = sheet.getRange(`A3:${endColumn}3`);
  subtitleRange.merge();
  subtitleRange.values = [[subtitle]];
  subtitleRange.format = {
    fill: colors.tealLight,
    font: { color: colors.ink, italic: true, size: 10 },
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "outside", style: "thin", color: colors.line },
  };
  subtitleRange.format.rowHeight = 34;
  sheet.showGridLines = false;
}

function styleHeader(range) {
  range.format = {
    fill: colors.teal,
    font: { bold: true, color: colors.white, size: 10 },
    verticalAlignment: "center",
    horizontalAlignment: "left",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: colors.line },
  };
  range.format.rowHeight = 30;
}

function styleBody(range) {
  range.format = {
    font: { color: colors.ink, size: 9 },
    verticalAlignment: "top",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: colors.line },
  };
}

function addStatusConditionalFormatting(range) {
  range.conditionalFormats.add("containsText", { text: "Backlog", format: { fill: statusFill.Backlog, font: { color: colors.slate } } });
  range.conditionalFormats.add("containsText", { text: "Next", format: { fill: statusFill.Next, font: { color: colors.blue, bold: true } } });
  range.conditionalFormats.add("containsText", { text: "In progress", format: { fill: statusFill["In progress"], font: { color: colors.amber, bold: true } } });
  range.conditionalFormats.add("containsText", { text: "Done", format: { fill: statusFill.Done, font: { color: colors.green, bold: true } } });
}

function addReadinessConditionalFormatting(range) {
  range.conditionalFormats.add("containsText", { text: "Incomplete", format: { fill: colors.redLight, font: { color: colors.red, bold: true } } });
  range.conditionalFormats.add("containsText", { text: "Ready", format: { fill: colors.greenLight, font: { color: colors.green, bold: true } } });
}

function addExecutionAllowedConditionalFormatting(range) {
  range.conditionalFormats.add("containsText", { text: "Yes", format: { fill: colors.greenLight, font: { color: colors.green, bold: true } } });
  range.conditionalFormats.add("containsText", { text: "No", format: { fill: colors.amberLight, font: { color: colors.amber, bold: true } } });
}

function dateColumns(range) {
  range.setNumberFormat(excelDateFormat);
  range.format.horizontalAlignment = "center";
}

function estimateWrappedLines(value, charactersPerLine) {
  const text = String(value ?? "");
  return text.split(/\r?\n/).reduce(
    (lineCount, line) => lineCount + Math.max(1, Math.ceil(line.length / charactersPerLine)),
    0,
  );
}

function estimateRowHeight(values, charactersPerLine, { min = 40, max = 148 } = {}) {
  const wrappedLines = Math.max(
    1,
    ...values.map((value, index) => estimateWrappedLines(value, charactersPerLine[index] ?? 40)),
  );
  return Math.min(max, Math.max(min, 8 + wrappedLines * 13));
}

// Executive Summary
addTitle(
  summary,
  "U",
  "Life in Days — Phase 1 Release Plan",
  `Review workbook generated from PHASE1-ROADMAP-MANIFEST.json on 2026-08-15. Current readiness: ${currentReadinessTruth}. Dates are estimates; evidence gates control delivery.`,
);
summary.getRange("A5:B5").values = [["Plan metric", "Value"]];
styleHeader(summary.getRange("A5:B5"));
summary.getRange("A6:A16").values = [
  ["Roadmap tasks"],
  ["Done planning tasks"],
  ["In progress"],
  ["Next"],
  ["Backlog"],
  ["Milestones"],
  ["Requirements"],
  ["Active coverage"],
  ["Dossiers Ready"],
  ["Execution allowed"],
  ["Planning completion"],
];
summary.getRange("B6:B16").formulas = [
  ["=COUNTA('Roadmap Tasks'!$A$6:$A$63)"],
  ["=COUNTIF('Roadmap Tasks'!$C$6:$C$63,\"Done\")"],
  ["=COUNTIF('Roadmap Tasks'!$C$6:$C$63,\"In progress\")"],
  ["=COUNTIF('Roadmap Tasks'!$C$6:$C$63,\"Next\")"],
  ["=COUNTIF('Roadmap Tasks'!$C$6:$C$63,\"Backlog\")"],
  ["=COUNTA('Release Plan'!$A$6:$A$17)"],
  ["=COUNTA('Requirement Map'!$A$6:$A$83)"],
  ["=COUNTIF('Requirement Map'!$B$6:$B$83,\"<>Deferred\")"],
  ["=COUNTIF('Roadmap Tasks'!$D$6:$D$63,\"Ready\")"],
  ["=COUNTIF('Roadmap Tasks'!$E$6:$E$63,\"Yes\")"],
  ["=B7/B6"],
];
styleBody(summary.getRange("A6:B16"));
summary.getRange("A14:B14").format.fill = readyCount === tasks.length ? colors.greenLight : colors.redLight;
summary.getRange("A14:B14").format.font = { color: readyCount === tasks.length ? colors.green : colors.red, bold: true };
summary.getRange("A15:B15").format.fill = executionAllowedCount > 0 ? colors.greenLight : colors.amberLight;
summary.getRange("A15:B15").format.font = { color: executionAllowedCount > 0 ? colors.green : colors.amber, bold: true };
summary.getRange("B16").setNumberFormat("0.0%");
summary.getRange("A18:H18").merge();
summary.getRange("A18:H18").values = [["Council release sequence"]];
summary.getRange("A18:H18").format = { fill: colors.slate, font: { bold: true, color: colors.white, size: 12 } };
summary.getRange("A19:H19").values = [["Milestone", "Release", "Start", "Target", "Outcome", "Entry dependency", "Tasks", "Status note"]];
styleHeader(summary.getRange("A19:H19"));
summary.getRange("A20:H31").values = releases.map((release) => [
  release.id,
  release.name,
  toDate(release.startDate),
  toDate(release.targetDate),
  release.outcome,
  release.dependency,
  tasks.filter((task) => task.milestone === release.id).length,
  release.id === "R10" ? "Dates intentionally blank" : "Evidence-gated estimate",
]);
styleBody(summary.getRange("A20:H31"));
dateColumns(summary.getRange("C20:D31"));
summary.getRange("A20:A31").format.font = { bold: true, color: colors.teal };

summary.getRange("K5:L5").values = [["Status", "Tasks"]];
styleHeader(summary.getRange("K5:L5"));
summary.getRange("K6:K9").values = [["Backlog"], ["Next"], ["In progress"], ["Done"]];
summary.getRange("L6:L9").formulas = [
  ["=COUNTIF('Roadmap Tasks'!$C$6:$C$63,K6)"],
  ["=COUNTIF('Roadmap Tasks'!$C$6:$C$63,K7)"],
  ["=COUNTIF('Roadmap Tasks'!$C$6:$C$63,K8)"],
  ["=COUNTIF('Roadmap Tasks'!$C$6:$C$63,K9)"],
];
styleBody(summary.getRange("K6:L9"));
addStatusConditionalFormatting(summary.getRange("K6:K9"));

summary.getRange("K12:L12").values = [["Milestone", "Tasks"]];
styleHeader(summary.getRange("K12:L12"));
summary.getRange("K13:K24").values = releases.map((release) => [release.id]);
summary.getRange("L13:L24").formulas = releases.map((_, i) => [`=COUNTIF('Roadmap Tasks'!$G$6:$G$63,K${13 + i})`]);
styleBody(summary.getRange("K13:L24"));

const statusChart = summary.charts.add("bar", summary.getRange("K5:L9"));
statusChart.title = "Tasks by status";
statusChart.hasLegend = false;
statusChart.setPosition("N5", "U14");
const releaseChart = summary.charts.add("bar", summary.getRange("K12:L24"));
releaseChart.title = "Tasks by milestone";
releaseChart.hasLegend = false;
releaseChart.setPosition("N16", "U30");

summary.getRange("A5:U31").format.verticalAlignment = "top";
summary.getRange("A1:A31").format.columnWidth = 20;
summary.getRange("B1:B31").format.columnWidth = 22;
summary.getRange("C1:D31").format.columnWidth = 13;
summary.getRange("E1:E31").format.columnWidth = 42;
summary.getRange("F1:F31").format.columnWidth = 34;
summary.getRange("G1:G31").format.columnWidth = 10;
summary.getRange("H1:H31").format.columnWidth = 24;
summary.getRange("K1:K31").format.columnWidth = 18;
summary.getRange("L1:L31").format.columnWidth = 10;
summary.freezePanes.freezeRows(3);

// Release Plan
addTitle(
  releaseSheet,
  "L",
  "Milestone Release Plan",
  "Every milestone is independently reviewable, but task entry requires its own approved dossier. Start/Target are proposed estimates in Asia/Kolkata. R10 remains blank until the approved storage trigger exists.",
);
releaseSheet.getRange("A5:L5").values = [["Milestone", "Release", "Start", "Target", "Days", "Meaningful outcome", "Exit evidence", "Entry dependency", "Date basis", "Tasks", "Dossiers Ready", "Execution allowed"]];
styleHeader(releaseSheet.getRange("A5:L5"));
releaseSheet.getRange("A6:L17").values = releases.map((release) => [
  release.id,
  release.name,
  toDate(release.startDate),
  toDate(release.targetDate),
  null,
  release.outcome,
  release.exitEvidence,
  release.dependency,
  release.startDate ? "Estimate; evidence gates control" : "Trigger-only; no commitment",
  null,
  null,
  null,
]);
releaseSheet.getRange("E6:E17").formulas = releases.map((_, i) => [`=IF(OR(C${6 + i}=\"\",D${6 + i}=\"\"),\"\",D${6 + i}-C${6 + i}+1)`]);
releaseSheet.getRange("J6:J17").formulas = releases.map((_, i) => [`=COUNTIF('Roadmap Tasks'!$G$6:$G$63,A${6 + i})`]);
releaseSheet.getRange("K6:K17").formulas = releases.map((_, i) => [`=COUNTIFS('Roadmap Tasks'!$G$6:$G$63,A${6 + i},'Roadmap Tasks'!$D$6:$D$63,\"Ready\")`]);
releaseSheet.getRange("L6:L17").formulas = releases.map((_, i) => [`=COUNTIFS('Roadmap Tasks'!$G$6:$G$63,A${6 + i},'Roadmap Tasks'!$E$6:$E$63,\"Yes\")`]);
styleBody(releaseSheet.getRange("A6:L17"));
dateColumns(releaseSheet.getRange("C6:D17"));
releaseSheet.getRange("A6:A17").format = { fill: colors.tealLight, font: { bold: true, color: colors.teal }, verticalAlignment: "top", borders: { preset: "all", style: "thin", color: colors.line } };
releaseSheet.tables.add("A5:L17", true, "ReleasePlanTable");
releaseSheet.getRange("A1:A17").format.columnWidth = 12;
releaseSheet.getRange("B1:B17").format.columnWidth = 34;
releaseSheet.getRange("C1:D17").format.columnWidth = 13;
releaseSheet.getRange("E1:E17").format.columnWidth = 9;
releaseSheet.getRange("F1:F17").format.columnWidth = 42;
releaseSheet.getRange("G1:G17").format.columnWidth = 48;
releaseSheet.getRange("H1:H17").format.columnWidth = 32;
releaseSheet.getRange("I1:I17").format.columnWidth = 26;
releaseSheet.getRange("J1:L17").format.columnWidth = 14;
releaseSheet.getRange("A6:L17").format.rowHeight = 62;
releaseSheet.freezePanes.freezeRows(5);
releaseSheet.freezePanes.freezeColumns(2);

// Roadmap Tasks
addTitle(
  taskSheet,
  "AC",
  "Detailed Roadmap Tasks — 58 Work Packages",
  "Every stable task ID projects six P0-prefixed dossier artifacts into its existing issue and Roadmap item. Current control truth: 58 Incomplete; 45 Hold + 13 Historical non-authorizing; 0 Ready; 0 execution-allowed. Done on a planning item never implies implementation or deployment.",
);
const taskHeaders = [
  "ID", "Title", "Status", "Artifact readiness", "Execution allowed", "Execution scope", "Milestone", "Type", "Owner role", "Priority", "Start", "Target", "Days",
  "Requirement IDs", "Dependencies", "Parent PRD / PID", "Task PRD", "Task technical plan", "Task design spec", "Task QA plan", "Task delivery checklist", "Task council readiness",
  "Shared design input", "Shared architecture input", "Description", "Acceptance evidence", "Rollback / restore impact", "Done meaning", "GitHub issue",
];
taskSheet.getRange("A5:AC5").values = [taskHeaders];
styleHeader(taskSheet.getRange("A5:AC5"));
const taskRows = tasks.map((task) => [
  task.id,
  task.title,
  task.status,
  task.artifactReadiness,
  task.executionAllowed ? "Yes" : "No",
  task.executionScope,
  task.milestone,
  task.taskType,
  task.ownerRole,
  task.priority,
  toDate(task.startDate),
  toDate(task.targetDate),
  null,
  join(task.requirementIds),
  join(task.dependencies),
  task.prdPidUrl,
  task.taskPrdUrl,
  task.taskArchitectureUrl,
  task.taskDesignUrl,
  task.taskQaUrl,
  task.taskDeliveryUrl,
  task.taskCouncilUrl,
  task.designArtifactUrls[0],
  task.architectureUrl,
  task.description,
  task.acceptanceEvidence,
  task.rollbackRestoreImpact,
  task.doneMeaning,
  task.github.issueUrl ?? "Pending GitHub sync",
]);
if (taskHeaders.length !== 29 || taskRows.some((row) => row.length !== taskHeaders.length)) {
  throw new Error(`Roadmap Tasks shape mismatch: ${taskHeaders.length} headers and row widths ${[...new Set(taskRows.map((row) => row.length))].join(", ")}.`);
}
taskSheet.getRange("A6:AC63").values = taskRows;
taskSheet.getRange("M6:M63").formulas = tasks.map((_, i) => [`=IF(OR(K${6 + i}=\"\",L${6 + i}=\"\"),\"\",L${6 + i}-K${6 + i}+1)`]);
styleBody(taskSheet.getRange("A6:AC63"));
dateColumns(taskSheet.getRange("K6:L63"));
addStatusConditionalFormatting(taskSheet.getRange("C6:C63"));
addReadinessConditionalFormatting(taskSheet.getRange("D6:D63"));
addExecutionAllowedConditionalFormatting(taskSheet.getRange("E6:E63"));
taskSheet.getRange("C6:C63").dataValidation = { rule: { type: "list", values: ["Backlog", "Next", "In progress", "Done"] } };
taskSheet.getRange("G6:G63").dataValidation = { rule: { type: "list", values: releases.map((release) => release.id) } };
taskSheet.getRange("J6:J63").dataValidation = { rule: { type: "list", values: ["High", "Medium", "Low"] } };
taskSheet.tables.add("A5:AC63", true, "RoadmapTasksTable");
taskSheet.getRange("A1:A63").format.columnWidth = 16;
taskSheet.getRange("B1:B63").format.columnWidth = 34;
taskSheet.getRange("C1:C63").format.columnWidth = 14;
taskSheet.getRange("D1:D63").format.columnWidth = 17;
taskSheet.getRange("E1:E63").format.columnWidth = 14;
taskSheet.getRange("F1:F63").format.columnWidth = 38;
taskSheet.getRange("G1:G63").format.columnWidth = 11;
taskSheet.getRange("H1:H63").format.columnWidth = 19;
taskSheet.getRange("I1:I63").format.columnWidth = 28;
taskSheet.getRange("J1:J63").format.columnWidth = 11;
taskSheet.getRange("K1:L63").format.columnWidth = 13;
taskSheet.getRange("M1:M63").format.columnWidth = 8;
taskSheet.getRange("N1:N63").format.columnWidth = 38;
taskSheet.getRange("O1:O63").format.columnWidth = 27;
taskSheet.getRange("P1:X63").format.columnWidth = 42;
taskSheet.getRange("Y1:Y63").format.columnWidth = 48;
taskSheet.getRange("Z1:AB63").format.columnWidth = 52;
taskSheet.getRange("AC1:AC63").format.columnWidth = 28;
taskSheet.getRange("A6:AC63").format.rowHeight = 90;
taskSheet.freezePanes.freezeRows(5);
taskSheet.freezePanes.freezeColumns(2);

// Roadmap Timeline
const timelineStart = new Date("2026-08-17T00:00:00.000Z");
const timelineEnd = new Date("2027-03-15T00:00:00.000Z");
const weeks = [];
for (let cursor = new Date(timelineStart); cursor <= timelineEnd; cursor.setUTCDate(cursor.getUTCDate() + 7)) {
  weeks.push(new Date(cursor));
}
const timelineEndColumnIndex = 8 + weeks.length;
function excelColumn(index) {
  let n = index;
  let out = "";
  while (n > 0) {
    const remainder = (n - 1) % 26;
    out = String.fromCharCode(65 + remainder) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}
const timelineEndColumn = excelColumn(timelineEndColumnIndex);
addTitle(
  timelineSheet,
  timelineEndColumn,
  "Task Roadmap Timeline — Weekly Planning View",
  "Bars show proposed task windows only; Readiness and Allowed are independent start gates. Blank R10 rows are intentional. Status colors: gray Backlog, blue Next, amber In progress, green Done.",
);
timelineSheet.getRange(`A5:${timelineEndColumn}5`).values = [["ID", "Title", "Status", "Readiness", "Allowed", "Milestone", "Start", "Target", ...weeks]];
styleHeader(timelineSheet.getRange(`A5:${timelineEndColumn}5`));
timelineSheet.getRange("A6:H63").values = tasks.map((task) => [task.id, task.title, task.status, task.artifactReadiness, task.executionAllowed ? "Yes" : "No", task.milestone, toDate(task.startDate), toDate(task.targetDate)]);
styleBody(timelineSheet.getRange("A6:H63"));
dateColumns(timelineSheet.getRange("G6:H63"));
timelineSheet.getRange(`I5:${timelineEndColumn}5`).setNumberFormat("dd-mmm");
timelineSheet.getRange(`I6:${timelineEndColumn}63`).formulas = tasks.map((_, rowIndex) => weeks.map((__, weekIndex) => {
  const col = excelColumn(9 + weekIndex);
  const row = 6 + rowIndex;
  return `=IF(OR($G${row}=\"\",$H${row}=\"\"),\"\",IF(AND(${col}$5<=$H${row},${col}$5+6>=$G${row}),\"■\",\"\"))`;
}));
timelineSheet.getRange(`I6:${timelineEndColumn}63`).format = {
  horizontalAlignment: "center",
  verticalAlignment: "center",
  font: { color: colors.white, bold: true, size: 9 },
  borders: { preset: "all", style: "thin", color: "#E2E8F0" },
};
const ganttRange = timelineSheet.getRange(`I6:${timelineEndColumn}63`);
ganttRange.conditionalFormats.addCustom('=AND(I6="■",$C6="Backlog")', { fill: "#94A3B8", font: { color: "#94A3B8" } });
ganttRange.conditionalFormats.addCustom('=AND(I6="■",$C6="Next")', { fill: colors.blue, font: { color: colors.blue } });
ganttRange.conditionalFormats.addCustom('=AND(I6="■",$C6="In progress")', { fill: "#F59E0B", font: { color: "#F59E0B" } });
ganttRange.conditionalFormats.addCustom('=AND(I6="■",$C6="Done")', { fill: "#22C55E", font: { color: "#22C55E" } });
addStatusConditionalFormatting(timelineSheet.getRange("C6:C63"));
addReadinessConditionalFormatting(timelineSheet.getRange("D6:D63"));
addExecutionAllowedConditionalFormatting(timelineSheet.getRange("E6:E63"));
timelineSheet.getRange("A1:A63").format.columnWidth = 16;
timelineSheet.getRange("B1:B63").format.columnWidth = 34;
timelineSheet.getRange("C1:C63").format.columnWidth = 14;
timelineSheet.getRange("D1:D63").format.columnWidth = 16;
timelineSheet.getRange("E1:E63").format.columnWidth = 11;
timelineSheet.getRange("F1:F63").format.columnWidth = 11;
timelineSheet.getRange("G1:H63").format.columnWidth = 13;
timelineSheet.getRange(`I1:${timelineEndColumn}63`).format.columnWidth = 9;
timelineSheet.getRange("A6:H63").format.rowHeight = 28;
timelineSheet.freezePanes.freezeRows(5);
timelineSheet.freezePanes.freezeColumns(8);

// Requirement Map
addTitle(
  requirementSheet,
  "F",
  "Requirement Traceability — 78 Stable IDs",
  "All 71 active requirements map to roadmap tasks. LID-UP-004 and LID-DEF-001 through LID-DEF-006 are explicitly deferred rather than silently omitted.",
);
requirementSheet.getRange("A5:F5").values = [["Requirement ID", "Primary milestone", "Roadmap task IDs", "Disposition", "Rationale", "Task count"]];
styleHeader(requirementSheet.getRange("A5:F5"));
const requirementRows = requirementMap.map((entry) => [
  entry.requirementId,
  entry.primaryMilestone,
  entry.roadmapTaskIds.length ? entry.roadmapTaskIds.join(", ") : "None — explicitly deferred",
  entry.disposition,
  entry.rationale,
  null,
]);
requirementSheet.getRange("A6:F83").values = requirementRows;
requirementSheet.getRange("F6:F83").formulas = requirementMap.map((entry, i) => [
  entry.roadmapTaskIds.length ? `=LEN(C${6 + i})-LEN(SUBSTITUTE(C${6 + i},\",\",\"\"))+1` : "=0",
]);
styleBody(requirementSheet.getRange("A6:F83"));
requirementSheet.getRange("B6:B83").conditionalFormats.add("containsText", { text: "Deferred", format: { fill: colors.purpleLight, font: { color: colors.purple, bold: true } } });
requirementSheet.tables.add("A5:F83", true, "RequirementMapTable");
requirementSheet.getRange("A1:A83").format.columnWidth = 18;
requirementSheet.getRange("B1:B83").format.columnWidth = 18;
requirementSheet.getRange("C1:C83").format.columnWidth = 54;
requirementSheet.getRange("D1:D83").format.columnWidth = 28;
requirementSheet.getRange("E1:E83").format.columnWidth = 50;
requirementSheet.getRange("F1:F83").format.columnWidth = 12;
requirementSheet.getRange("A6:F83").format.rowHeight = 40;
requirementRows.forEach((row, index) => {
  requirementSheet.getRange(`A${6 + index}:F${6 + index}`).format.rowHeight = estimateRowHeight(
    row.slice(0, 5),
    [22, 22, 64, 34, 60],
  );
});
requirementSheet.freezePanes.freezeRows(5);
requirementSheet.freezePanes.freezeColumns(2);

// Risks & Gates
addTitle(
  riskSheet,
  "H",
  "Delivery Risks, Assumptions, Dependencies, and Release Gates",
  "Risk responses preserve privacy, recovery, accessibility, and co-resident safety before schedule. Unknown live/provider facts remain evidence-gated.",
);
const risks = [
  ["RAID-001", "Risk", "R0", "Shared-host contention or namespace/routing collision harms an existing service.", "Technical Architect", "R0 entry/exit", "Synthetic-only live preflight, limits, non-regression, and rollback; block R1 on failure.", "Open"],
  ["RAID-002", "Assumption", "R0", "SQLCipher/SQLite works with FTS5, WAL concurrency, backup, migration, and crash recovery in the target runtime.", "Technical Architect", "R0", "Execute target proof; select PostgreSQL only if documented gates fail.", "Open"],
  ["RAID-003", "Dependency", "R0", "Human and callback routing require approved Cloudflare configuration.", "Technical Architect / Owner", "R0 deploy", "Prepare sanitized plan; make provider mutations only in the scoped execution step.", "Open"],
  ["RAID-004", "Risk", "All", "A successful backup upload is mistaken for recovery evidence.", "Project Manager", "Every release", "Require executed restore for each new shape and full Recovery Ceremony at R9.", "Open"],
  ["RAID-005", "Dependency", "R5", "VoiceNotes identity, authentication, and reconciliation behavior is partly unknown.", "Product + Architecture", "R5 entry", "Synthetic contract spike; block R5 and reopen decisions on material failure.", "Open"],
  ["RAID-006", "Risk", "R2/R6/R7", "Real photos or derived photo data reach AI.", "Architecture + QA", "R2, R6, R7", "Typed allowlists, structural no-photo tests, sanitized evidence, release block on leakage.", "Open"],
  ["RAID-007", "Risk", "All", "Proposed dates become commitments and weaken gates.", "Project Manager", "Weekly", "Move dates before weakening privacy, recovery, accessibility, or evidence gates.", "Open"],
  ["RAID-008", "Risk", "R2/R8", "Small-host image work exhausts memory or disk.", "Technical Architect", "R2 and R8", "Bounded staging/decoder, one heavy job, watermarks, backpressure, and fault tests.", "Open"],
  ["RAID-009", "Risk", "R6/R7", "AI output is mistaken for authentic source truth.", "Product + Design + QA", "R6 and R7", "Separate records, persistent labels, provenance, protected fields, and owner acceptance.", "Open"],
  ["RAID-010", "Risk", "R10", "Object-store transition starts without a measured need or recovery proof.", "Project Manager", "R10", "Keep dates blank; require trigger, inventory, dual-write, restore, observation, and rollback.", "Open"],
  ["RAID-011", "Risk", "All", "A task starts from shared plans or roadmap status without task-specific Product Council readiness.", "Project Manager", "Every task entry", "Require six P0-prefixed task artifacts, exact hashes/revision, five-seat verdict, and executionAllowed=true.", "Open — all 58 dossiers Incomplete"],
  ["RAID-012", "Risk", "P0", "Broad Project views or unreadable workflows admit non-delivery items or change status unexpectedly.", "Project Manager", "GitHub synchronization", "Narrow views one at a time to phase1; do not mutate unreadable workflows; verify exact issue/field parity after publication.", "Open — live hardening pending"],
];
riskSheet.getRange("A5:H5").values = [["ID", "Type", "Milestone", "Risk / assumption / dependency", "Owner", "Trigger", "Response", "Status"]];
styleHeader(riskSheet.getRange("A5:H5"));
riskSheet.getRange("A6:H17").values = risks;
styleBody(riskSheet.getRange("A6:H17"));
riskSheet.getRange("B6:B17").conditionalFormats.add("containsText", { text: "Risk", format: { fill: colors.redLight, font: { color: colors.red, bold: true } } });
riskSheet.getRange("B6:B17").conditionalFormats.add("containsText", { text: "Assumption", format: { fill: colors.amberLight, font: { color: colors.amber, bold: true } } });
riskSheet.getRange("B6:B17").conditionalFormats.add("containsText", { text: "Dependency", format: { fill: colors.blueLight, font: { color: colors.blue, bold: true } } });
riskSheet.getRange("A20:H20").merge();
riskSheet.getRange("A20:H20").values = [["Milestone entry and exit gates"]];
riskSheet.getRange("A20:H20").format = { fill: colors.slate, font: { bold: true, color: colors.white, size: 12 } };
riskSheet.getRange("A21:H21").values = [["Milestone", "Release", "Start", "Target", "Entry dependency", "Exit evidence", "Rollback/restore rule", "Decision state"]];
styleHeader(riskSheet.getRange("A21:H21"));
riskSheet.getRange("A22:H33").values = releases.map((release) => [
  release.id,
  release.name,
  toDate(release.startDate),
  toDate(release.targetDate),
  release.dependency,
  release.exitEvidence,
  release.id === "P0" ? "Planning evidence only; no production mutation." : "Restore every new persistent shape and prove reversible rollback before acceptance.",
  release.id === "P0"
    ? "Hold — control candidate under review"
    : release.id === "R10"
      ? "Trigger not approved; dates blank"
      : "Hold — task dossiers Incomplete",
]);
styleBody(riskSheet.getRange("A22:H33"));
dateColumns(riskSheet.getRange("C22:D33"));
riskSheet.getRange("A1:A33").format.columnWidth = 15;
riskSheet.getRange("B1:B33").format.columnWidth = 18;
riskSheet.getRange("C1:D33").format.columnWidth = 14;
riskSheet.getRange("E1:E33").format.columnWidth = 30;
riskSheet.getRange("F1:F33").format.columnWidth = 32;
riskSheet.getRange("G1:G33").format.columnWidth = 52;
riskSheet.getRange("H1:H33").format.columnWidth = 30;
riskSheet.getRange("A6:H17").format.rowHeight = 62;
riskSheet.getRange("A22:H33").format.rowHeight = 72;
riskSheet.freezePanes.freezeRows(5);
riskSheet.freezePanes.freezeColumns(2);

// Review Guide
addTitle(
  guideSheet,
  "C",
  "Workbook Review Guide and Evidence Boundary",
  "Use this workbook to review the plan; use the JSON manifest as the edit source. Reconcile any approved change to Markdown, GitHub issues, and the live Project.",
);
const guideRows = [
  ["Purpose", "Detailed reviewable Phase 1 release plan for a single-user private archive.", "Owner: Project Manager"],
  ["Source manifest SHA-256", manifestSha256, "docs/project/PHASE1-ROADMAP-MANIFEST.json — do not use a workbook-only edit as a planning decision."],
  ["Governing product", "docs/product/PRODUCT-REQUIREMENTS.md", "78 stable requirement IDs."],
  ["Governing design", "docs/design/UX-SPECIFICATION.md", "Prototype v5 is interaction intent only."],
  ["Implementation plan", "docs/architecture/PHASE1-IMPLEMENTATION-PLAN.md", "Detailed technical sequence, architecture, security, recovery, and task contracts."],
  ["Task Definition of Ready", "docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md", "Every substantive task requires Product, Architecture, Design, QA, Delivery, and Council approval."],
  ["Task artifact register", "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json", "Paths, states, SHA-256, scenario IDs, owner actions, execution scope, and council decision."],
  ["Current task readiness", currentReadinessTruth, "Artifact generation is not specialist approval; roadmap status is not a start override."],
  ["GitHub projection", "58 existing issues; 17 managed Project fields; six dossier links per task", "Publish only from merged remote main, then verify read-only by stable task ID."],
  ["Deployment spike", "docs/research/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md", "Live host capacity/readiness remains unverified until sanitized evidence exists."],
  ["Roadmap", "https://github.com/users/arunpr614/projects/1", "Four lanes: Backlog, Next, In progress, Done."],
  ["Date semantics", "Start/Target are proposed estimates in Asia/Kolkata.", "Evidence gates move dates; dates never weaken gates."],
  ["R0", "Synthetic fixtures only.", "No authentic memory may enter before R0 restore/rollback/privacy proof."],
  ["R1", "First authentic-memory release.", "Use only an owner-approved fixture after R0 acceptance."],
  ["R10", "Start/Target intentionally blank.", "Populate only after measured watermark trigger approval."],
  ["Done — planning", "Named planning artifact exists and validates.", "Does not imply implementation, testing, deployment, production, or release acceptance."],
  ["Done — delivery", "Behavior works in the named environment with linked tests, migration, restore, rollback, and approvals.", "Code, CI, deploy, or backup upload alone is insufficient."],
  ["Privacy", "No personal content, prompts, tokens, credentials, private account IDs, or unsanitized infrastructure evidence in public artifacts.", "Real-photo data is structurally excluded from all AI requests."],
  ["Recovery", "Every release restores each new persistent data shape.", "Backup success is not restore evidence."],
  ["Workbook sheets", "Executive Summary; Release Plan; Roadmap Tasks; Roadmap Timeline; Requirement Map; Risks & Gates; Review Guide.", "Filters, validations, formulas, conditional formatting, and charts support review."],
];
guideSheet.getRange("A5:C5").values = [["Topic", "Decision / instruction", "Reviewer note"]];
styleHeader(guideSheet.getRange("A5:C5"));
guideSheet.getRange(`A6:C${5 + guideRows.length}`).values = guideRows;
styleBody(guideSheet.getRange(`A6:C${5 + guideRows.length}`));
guideSheet.getRange(`A6:A${5 + guideRows.length}`).format = { fill: colors.tealLight, font: { bold: true, color: colors.teal }, verticalAlignment: "top", wrapText: true, borders: { preset: "all", style: "thin", color: colors.line } };
guideSheet.getRange(`A1:A${5 + guideRows.length}`).format.columnWidth = 24;
guideSheet.getRange(`B1:B${5 + guideRows.length}`).format.columnWidth = 72;
guideSheet.getRange(`C1:C${5 + guideRows.length}`).format.columnWidth = 58;
guideSheet.getRange(`A6:C${5 + guideRows.length}`).format.rowHeight = 58;
guideSheet.freezePanes.freezeRows(5);

// Formula and workbook validation
const sheets = [summary, releaseSheet, taskSheet, timelineSheet, requirementSheet, riskSheet, guideSheet];
const formulaErrors = [];
for (const sheet of sheets) {
  const used = sheet.getUsedRange();
  const values = used?.values ?? [];
  values.forEach((row, rowIndex) => row.forEach((value, colIndex) => {
    if (typeof value === "string" && /^#(REF!|DIV\/0!|VALUE!|NAME\?|N\/A|NUM!|NULL!)/.test(value)) {
      formulaErrors.push(`${sheet.name}!R${rowIndex + 1}C${colIndex + 1}:${value}`);
    }
  }));
}
if (formulaErrors.length) throw new Error(`Formula errors: ${formulaErrors.join(", ")}`);

const overviewInspect = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 5000 });
const inspectionSpecs = [
  ["EXECUTIVE SUMMARY", "Executive Summary", "A5:L31", 9000],
  ["RELEASE PLAN", "Release Plan", "A5:L17", 7000],
  ["ROADMAP TASK SAMPLE", "Roadmap Tasks", "A5:AC9", 10000],
  ["ROADMAP TIMELINE SAMPLE", "Roadmap Timeline", "A5:P9", 7000],
  ["REQUIREMENT MAP SAMPLE", "Requirement Map", "A5:F12", 6000],
  ["RISKS AND GATES", "Risks & Gates", "A5:H33", 10000],
  ["REVIEW GUIDE", "Review Guide", `A5:C${5 + guideRows.length}`, 9000],
];
const regionInspections = [];
for (const [label, sheetId, range, maxChars] of inspectionSpecs) {
  const result = await workbook.inspect({ kind: "region", sheetId, range, maxChars });
  regionInspections.push(`\n${label}\n${result.ndjson ?? String(result)}`);
}
const taskFormulaInspect = await workbook.inspect({ kind: "formula", sheetId: "Roadmap Tasks", range: "K5:M12", maxChars: 4000, options: { maxResults: 30 } });
const timelineFormulaInspect = await workbook.inspect({ kind: "formula", sheetId: "Roadmap Timeline", range: "G5:P12", maxChars: 6000, options: { maxResults: 60 } });
const releaseFormulaInspect = await workbook.inspect({ kind: "formula", sheetId: "Release Plan", range: "C5:L17", maxChars: 6000, options: { maxResults: 80 } });
const requirementFormulaInspect = await workbook.inspect({ kind: "formula", sheetId: "Requirement Map", range: "F5:F16", maxChars: 3000, options: { maxResults: 20 } });
await fs.writeFile(path.join(previewDir, "workbook-inspect.txt"), [
  "SHEETS",
  overviewInspect.ndjson ?? String(overviewInspect),
  ...regionInspections,
  "\nTASK FORMULAS",
  taskFormulaInspect.ndjson ?? String(taskFormulaInspect),
  "\nTIMELINE FORMULAS",
  timelineFormulaInspect.ndjson ?? String(timelineFormulaInspect),
  "\nRELEASE FORMULAS",
  releaseFormulaInspect.ndjson ?? String(releaseFormulaInspect),
  "\nREQUIREMENT FORMULAS",
  requirementFormulaInspect.ndjson ?? String(requirementFormulaInspect),
  `\nFORMULA ERRORS: ${formulaErrors.length}`,
].join("\n"));

const previewSpecs = [
  ["Executive Summary", "A1:U31", 1.0, "01-executive-summary.png"],
  ["Release Plan", "A1:L17", 0.9, "02-release-plan.png"],
  ["Risks & Gates", "A1:H33", 0.8, "06-risks-and-gates.png"],
  ["Review Guide", `A1:C${5 + guideRows.length}`, 0.8, "07-review-guide.png"],
];
for (const [sheetName, range, scale, fileName] of previewSpecs) {
  const preview = await workbook.render({ sheetName, range, scale, format: "png" });
  await fs.writeFile(path.join(previewDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

// Paginated source-sheet crops lose the title and header after their first
// page. Build standalone review-only compositions for every paginated preview.
// This workbook is never exported, so the deliverable remains exactly seven
// canonical sheets and its data, tables, validations, and formulas are not
// changed by the visual-review layout.
const reviewWorkbook = Workbook.create();
const metadataPreviewSpecs = [
  [6, 20, "03a-roadmap-tasks-metadata-r01-r20.png"],
  [21, 35, "03b-roadmap-tasks-metadata-r21-r35.png"],
  [36, 50, "03c-roadmap-tasks-metadata-r36-r50.png"],
  [51, 63, "03d-roadmap-tasks-metadata-r51-r63.png"],
];
for (const [sourceStartRow, sourceEndRow, fileName] of metadataPreviewSpecs) {
  const reviewSheet = reviewWorkbook.worksheets.add(`Metadata ${sourceStartRow}-${sourceEndRow}`);
  const segmentTasks = tasks.slice(sourceStartRow - 6, sourceEndRow - 5);
  const segmentRows = taskRows.slice(sourceStartRow - 6, sourceEndRow - 5).map((row, index) => {
    const start = toDate(segmentTasks[index].startDate);
    const target = toDate(segmentTasks[index].targetDate);
    const days = start && target ? Math.round((target.getTime() - start.getTime()) / 86_400_000) + 1 : null;
    return [...row.slice(0, 12), days];
  });
  const dataEndRow = 5 + segmentRows.length;
  addTitle(
    reviewSheet,
    "M",
    `Roadmap Task Metadata — Source Rows ${sourceStartRow}–${sourceEndRow}`,
    "Review-only composition. Source columns A–M remain unchanged in the exported Roadmap Tasks sheet.",
  );
  reviewSheet.getRange("A5:M5").values = [taskHeaders.slice(0, 13)];
  styleHeader(reviewSheet.getRange("A5:M5"));
  reviewSheet.getRange(`A6:M${dataEndRow}`).values = segmentRows;
  styleBody(reviewSheet.getRange(`A6:M${dataEndRow}`));
  dateColumns(reviewSheet.getRange(`K6:L${dataEndRow}`));
  addStatusConditionalFormatting(reviewSheet.getRange(`C6:C${dataEndRow}`));
  addReadinessConditionalFormatting(reviewSheet.getRange(`D6:D${dataEndRow}`));
  addExecutionAllowedConditionalFormatting(reviewSheet.getRange(`E6:E${dataEndRow}`));
  reviewSheet.getRange(`A1:A${dataEndRow}`).format.columnWidth = 16;
  reviewSheet.getRange(`B1:B${dataEndRow}`).format.columnWidth = 34;
  reviewSheet.getRange(`C1:C${dataEndRow}`).format.columnWidth = 14;
  reviewSheet.getRange(`D1:D${dataEndRow}`).format.columnWidth = 17;
  reviewSheet.getRange(`E1:E${dataEndRow}`).format.columnWidth = 14;
  reviewSheet.getRange(`F1:F${dataEndRow}`).format.columnWidth = 38;
  reviewSheet.getRange(`G1:G${dataEndRow}`).format.columnWidth = 11;
  reviewSheet.getRange(`H1:H${dataEndRow}`).format.columnWidth = 19;
  reviewSheet.getRange(`I1:I${dataEndRow}`).format.columnWidth = 28;
  reviewSheet.getRange(`J1:J${dataEndRow}`).format.columnWidth = 11;
  reviewSheet.getRange(`K1:L${dataEndRow}`).format.columnWidth = 13;
  reviewSheet.getRange(`M1:M${dataEndRow}`).format.columnWidth = 8;
  reviewSheet.getRange(`A6:M${dataEndRow}`).format.rowHeight = 90;
  reviewSheet.showGridLines = false;
  const preview = await reviewWorkbook.render({ sheetName: reviewSheet.name, range: `A1:M${dataEndRow}`, scale: 0.75, format: "png" });
  await fs.writeFile(path.join(previewDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

// The task-detail half of the source sheet is too wide to review legibly as a
// single 16-column crop. Repeat task identity and split N–AC into two stacked
// blocks while preserving the exact source values.
const taskDetailPreviewSpecs = [
  [6, 20, "03e-roadmap-tasks-details-r01-r20.png"],
  [21, 35, "03f-roadmap-tasks-details-r21-r35.png"],
  [36, 50, "03g-roadmap-tasks-details-r36-r50.png"],
  [51, 63, "03h-roadmap-tasks-details-r51-r63.png"],
];
for (const [sourceStartRow, sourceEndRow, fileName] of taskDetailPreviewSpecs) {
  const reviewSheet = reviewWorkbook.worksheets.add(`Details ${sourceStartRow}-${sourceEndRow}`);
  const segmentTasks = tasks.slice(sourceStartRow - 6, sourceEndRow - 5);
  const segmentRows = taskRows.slice(sourceStartRow - 6, sourceEndRow - 5);
  const firstBlockHeaders = ["Task ID", ...taskHeaders.slice(13, 22)];
  const secondBlockHeaders = ["Task ID", ...taskHeaders.slice(22, 29)];
  const firstBlockRows = segmentRows.map((row, index) => [segmentTasks[index].id, ...row.slice(13, 22)]);
  const secondBlockRows = segmentRows.map((row, index) => [segmentTasks[index].id, ...row.slice(22, 29)]);
  const firstHeaderRow = 6;
  const firstDataStartRow = 7;
  const firstDataEndRow = firstDataStartRow + firstBlockRows.length - 1;
  const secondSectionRow = firstDataEndRow + 2;
  const secondHeaderRow = secondSectionRow + 1;
  const secondDataStartRow = secondHeaderRow + 1;
  const secondDataEndRow = secondDataStartRow + secondBlockRows.length - 1;

  addTitle(
    reviewSheet,
    "J",
    `Roadmap Task Details — Source Rows ${sourceStartRow}–${sourceEndRow}`,
    "Review-only composition. Stable task IDs repeat in both blocks; source columns N–AC remain unchanged in the exported Roadmap Tasks sheet.",
  );
  reviewSheet.getRange("A5:J5").merge();
  reviewSheet.getRange("A5:J5").values = [["Dossier links and traceability — source columns N–V"]];
  reviewSheet.getRange("A5:J5").format = { fill: colors.slate, font: { bold: true, color: colors.white, size: 11 }, verticalAlignment: "center" };
  reviewSheet.getRange(`A${firstHeaderRow}:J${firstHeaderRow}`).values = [firstBlockHeaders];
  styleHeader(reviewSheet.getRange(`A${firstHeaderRow}:J${firstHeaderRow}`));
  reviewSheet.getRange(`A${firstDataStartRow}:J${firstDataEndRow}`).values = firstBlockRows;
  styleBody(reviewSheet.getRange(`A${firstDataStartRow}:J${firstDataEndRow}`));

  reviewSheet.getRange(`A${secondSectionRow}:J${secondSectionRow}`).merge();
  reviewSheet.getRange(`A${secondSectionRow}:J${secondSectionRow}`).values = [["Delivery evidence and references — source columns W–AC"]];
  reviewSheet.getRange(`A${secondSectionRow}:J${secondSectionRow}`).format = { fill: colors.slate, font: { bold: true, color: colors.white, size: 11 }, verticalAlignment: "center" };
  reviewSheet.getRange(`A${secondHeaderRow}:H${secondHeaderRow}`).values = [secondBlockHeaders];
  styleHeader(reviewSheet.getRange(`A${secondHeaderRow}:H${secondHeaderRow}`));
  reviewSheet.getRange(`A${secondDataStartRow}:H${secondDataEndRow}`).values = secondBlockRows;
  styleBody(reviewSheet.getRange(`A${secondDataStartRow}:H${secondDataEndRow}`));

  reviewSheet.getRange(`A1:A${secondDataEndRow}`).format.columnWidth = 16;
  reviewSheet.getRange(`B1:J${secondDataEndRow}`).format.columnWidth = 34;
  firstBlockRows.forEach((row, index) => {
    reviewSheet.getRange(`A${firstDataStartRow + index}:J${firstDataStartRow + index}`).format.rowHeight = estimateRowHeight(
      row,
      [18, 40, 34, 42, 42, 42, 42, 42, 42, 42],
      // Requirement ID lists reach 901 characters in R8/R9. Preserve their
      // complete wrapped text and cap only below Excel's 409.5-point limit.
      { min: 58, max: 408 },
    );
  });
  secondBlockRows.forEach((row, index) => {
    reviewSheet.getRange(`A${secondDataStartRow + index}:H${secondDataStartRow + index}`).format.rowHeight = estimateRowHeight(
      row,
      [18, 42, 42, 46, 48, 48, 44, 36],
      { min: 58, max: 126 },
    );
  });
  reviewSheet.showGridLines = false;
  reviewSheet.freezePanes.freezeRows(firstHeaderRow);
  reviewSheet.freezePanes.freezeColumns(1);

  const preview = await reviewWorkbook.render({
    sheetName: reviewSheet.name,
    range: `A1:J${secondDataEndRow}`,
    scale: 1.0,
    format: "png",
  });
  await fs.writeFile(path.join(previewDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

const timelinePreviewSpecs = [
  [6, 20, "04a-roadmap-timeline-r01-r20.png"],
  [21, 35, "04b-roadmap-timeline-r21-r35.png"],
  [36, 50, "04c-roadmap-timeline-r36-r50.png"],
  [51, 63, "04d-roadmap-timeline-r51-r63.png"],
];
for (const [sourceStartRow, sourceEndRow, fileName] of timelinePreviewSpecs) {
  const reviewSheet = reviewWorkbook.worksheets.add(`Timeline ${sourceStartRow}-${sourceEndRow}`);
  const segmentTasks = tasks.slice(sourceStartRow - 6, sourceEndRow - 5);
  const timelineRows = segmentTasks.map((task) => {
    const start = toDate(task.startDate);
    const target = toDate(task.targetDate);
    const bars = weeks.map((week) => {
      if (!start || !target) return "";
      const weekEnd = new Date(week);
      weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
      return week <= target && weekEnd >= start ? "■" : "";
    });
    return [task.id, task.title, task.status, task.artifactReadiness, task.executionAllowed ? "Yes" : "No", task.milestone, start, target, ...bars];
  });
  const dataEndRow = 5 + timelineRows.length;
  addTitle(
    reviewSheet,
    timelineEndColumn,
    `Roadmap Timeline — Source Rows ${sourceStartRow}–${sourceEndRow}`,
    "Review-only composition. Proposed weekly windows repeat with their source task IDs, statuses, readiness, permissions, and dates.",
  );
  reviewSheet.getRange(`A5:${timelineEndColumn}5`).values = [["ID", "Title", "Status", "Readiness", "Allowed", "Milestone", "Start", "Target", ...weeks]];
  styleHeader(reviewSheet.getRange(`A5:${timelineEndColumn}5`));
  reviewSheet.getRange(`A6:${timelineEndColumn}${dataEndRow}`).values = timelineRows;
  styleBody(reviewSheet.getRange(`A6:H${dataEndRow}`));
  dateColumns(reviewSheet.getRange(`G6:H${dataEndRow}`));
  reviewSheet.getRange(`I5:${timelineEndColumn}5`).setNumberFormat("dd-mmm");
  reviewSheet.getRange(`I6:${timelineEndColumn}${dataEndRow}`).format = {
    horizontalAlignment: "center",
    verticalAlignment: "center",
    font: { color: colors.white, bold: true, size: 9 },
    borders: { preset: "all", style: "thin", color: "#E2E8F0" },
  };
  const reviewGanttRange = reviewSheet.getRange(`I6:${timelineEndColumn}${dataEndRow}`);
  reviewGanttRange.conditionalFormats.addCustom('=AND(I6="■",$C6="Backlog")', { fill: "#94A3B8", font: { color: "#94A3B8" } });
  reviewGanttRange.conditionalFormats.addCustom('=AND(I6="■",$C6="Next")', { fill: colors.blue, font: { color: colors.blue } });
  reviewGanttRange.conditionalFormats.addCustom('=AND(I6="■",$C6="In progress")', { fill: "#F59E0B", font: { color: "#F59E0B" } });
  reviewGanttRange.conditionalFormats.addCustom('=AND(I6="■",$C6="Done")', { fill: "#22C55E", font: { color: "#22C55E" } });
  addStatusConditionalFormatting(reviewSheet.getRange(`C6:C${dataEndRow}`));
  addReadinessConditionalFormatting(reviewSheet.getRange(`D6:D${dataEndRow}`));
  addExecutionAllowedConditionalFormatting(reviewSheet.getRange(`E6:E${dataEndRow}`));
  reviewSheet.getRange(`A1:A${dataEndRow}`).format.columnWidth = 16;
  reviewSheet.getRange(`B1:B${dataEndRow}`).format.columnWidth = 34;
  reviewSheet.getRange(`C1:C${dataEndRow}`).format.columnWidth = 14;
  reviewSheet.getRange(`D1:D${dataEndRow}`).format.columnWidth = 16;
  reviewSheet.getRange(`E1:E${dataEndRow}`).format.columnWidth = 11;
  reviewSheet.getRange(`F1:F${dataEndRow}`).format.columnWidth = 11;
  reviewSheet.getRange(`G1:H${dataEndRow}`).format.columnWidth = 13;
  reviewSheet.getRange(`I1:${timelineEndColumn}${dataEndRow}`).format.columnWidth = 9;
  reviewSheet.getRange(`A6:H${dataEndRow}`).format.rowHeight = 28;
  reviewSheet.showGridLines = false;
  const preview = await reviewWorkbook.render({ sheetName: reviewSheet.name, range: `A1:${timelineEndColumn}${dataEndRow}`, scale: 0.55, format: "png" });
  await fs.writeFile(path.join(previewDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

const requirementPreviewSpecs = [
  [6, 25, "05a-requirement-map-r01-r25.png"],
  [26, 45, "05b-requirement-map-r26-r45.png"],
  [46, 65, "05c-requirement-map-r46-r65.png"],
  [66, 83, "05d-requirement-map-r66-r83.png"],
];
for (const [sourceStartRow, sourceEndRow, fileName] of requirementPreviewSpecs) {
  const reviewSheet = reviewWorkbook.worksheets.add(`Requirements ${sourceStartRow}-${sourceEndRow}`);
  const segmentEntries = requirementMap.slice(sourceStartRow - 6, sourceEndRow - 5);
  const segmentRows = segmentEntries.map((entry) => [
    entry.requirementId,
    entry.primaryMilestone,
    entry.roadmapTaskIds.length ? entry.roadmapTaskIds.join(", ") : "None — explicitly deferred",
    entry.disposition,
    entry.rationale,
    entry.roadmapTaskIds.length,
  ]);
  const dataEndRow = 5 + segmentRows.length;
  addTitle(
    reviewSheet,
    "F",
    `Requirement Traceability — Source Rows ${sourceStartRow}–${sourceEndRow}`,
    "Review-only composition. All stable requirement IDs and their roadmap-task mappings remain unchanged in the exported Requirement Map sheet.",
  );
  reviewSheet.getRange("A5:F5").values = [["Requirement ID", "Primary milestone", "Roadmap task IDs", "Disposition", "Rationale", "Task count"]];
  styleHeader(reviewSheet.getRange("A5:F5"));
  reviewSheet.getRange(`A6:F${dataEndRow}`).values = segmentRows;
  styleBody(reviewSheet.getRange(`A6:F${dataEndRow}`));
  reviewSheet.getRange(`B6:B${dataEndRow}`).conditionalFormats.add("containsText", { text: "Deferred", format: { fill: colors.purpleLight, font: { color: colors.purple, bold: true } } });
  reviewSheet.getRange(`A1:A${dataEndRow}`).format.columnWidth = 18;
  reviewSheet.getRange(`B1:B${dataEndRow}`).format.columnWidth = 18;
  reviewSheet.getRange(`C1:C${dataEndRow}`).format.columnWidth = 54;
  reviewSheet.getRange(`D1:D${dataEndRow}`).format.columnWidth = 28;
  reviewSheet.getRange(`E1:E${dataEndRow}`).format.columnWidth = 50;
  reviewSheet.getRange(`F1:F${dataEndRow}`).format.columnWidth = 12;
  segmentRows.forEach((row, index) => {
    reviewSheet.getRange(`A${6 + index}:F${6 + index}`).format.rowHeight = estimateRowHeight(
      row.slice(0, 5),
      [22, 22, 64, 34, 60],
    );
  });
  reviewSheet.showGridLines = false;
  const preview = await reviewWorkbook.render({ sheetName: reviewSheet.name, range: `A1:F${dataEndRow}`, scale: 0.9, format: "png" });
  await fs.writeFile(path.join(previewDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

const previewCount = previewSpecs.length
  + metadataPreviewSpecs.length
  + taskDetailPreviewSpecs.length
  + timelinePreviewSpecs.length
  + requirementPreviewSpecs.length;

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
await fs.copyFile(outputPath, publicOutputPath);

// artifact-tool may emit a large sibling inspection trace during export. Keep
// that diagnostic with temporary previews rather than publishing it.
const automaticInspectPath = `${outputPath}.inspect.ndjson`;
try {
  await fs.rename(automaticInspectPath, path.join(previewDir, "artifact-tool-export-inspect.ndjson"));
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

console.log(JSON.stringify({
  outputPath,
  publicOutputPath,
  previewDir,
  sheets: sheets.map((sheet) => sheet.name),
  releases: releases.length,
  tasks: tasks.length,
  requirements: requirementMap.length,
  issueUrls: issueUrls.length,
  readyCount,
  executionAllowedCount,
  r10BlankDateTasks: r10Tasks.length,
  previewCount,
  formulaErrors: formulaErrors.length,
}, null, 2));
