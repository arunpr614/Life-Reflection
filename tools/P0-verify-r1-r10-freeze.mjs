#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstatSync, readFileSync } from "node:fs";
import { posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync } from "node:zlib";
import { parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";

export const FREEZE_SNAPSHOT_PATH = "docs/project/P0-R1-R10-FREEZE-SNAPSHOT.json";
export const FROZEN_SOURCE_REVISION = "2dc4d05cdeca8cb9aeacf393076f6c6f946ff62b";
export const FROZEN_SNAPSHOT_SHA256 = "sha256:0f1e213e666309a2338a965434b4644c17bb37c6285d7e799278ab033c7257b1";
export const FROZEN_OWNER_ACTION_PROJECTION_SHA256 = "498a5a8b278d3c54942b2aba506e3f0fcaa9e9ad98317896cd9224d751e0d382";
export const ALLOWED_AGGREGATE_PROVENANCE_PATHS = Object.freeze([
  "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json",
  "docs/project/PHASE1-RELEASE-PLAN.md",
  "docs/project/PHASE1-ROADMAP-MANIFEST.json",
  "outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx",
]);

const SOURCE_PATHS = Object.freeze({
  manifest: "docs/project/PHASE1-ROADMAP-MANIFEST.json",
  register: "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json",
  readiness: "docs/project/P0-PHASE1-TASK-READINESS-STATE.json",
  taskState: "docs/project/P0-PHASE1-TASK-STATE.json",
  approvals: "docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json",
  issueMap: "docs/project/PHASE1-GITHUB-ISSUES.json",
});
const RELEASE_PLAN_PATH = "docs/project/PHASE1-RELEASE-PLAN.md";
const RELEASE_WORKBOOK_PATH = "outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx";
export const OWNER_ACTION_STATE_PATH = "docs/council/execution/P0-OWNER-ACTION-STATE.json";
const FROZEN_TASK_ID_PATTERN = /^.+-R(?:[1-9]|10)-\d{3}$/;
const FROZEN_MILESTONE_PATTERN = /^R(?:[1-9]|10)$/;
const FROZEN_OWNER_ACTION_ID_PATTERN = /^R(?:[1-9]|10)-OA-\d{3}$/;
const PHASE1_TASK_ID_PATTERN = /^[A-Z][A-Z0-9]*-(?:P0|R0|R(?:[1-9]|10))-\d{3}$/;
const REQUIREMENT_ID_PATTERN = /^LID-[A-Z0-9]+-\d{3}$/;
const REQUIREMENT_COUNT_FORMULA = 'LEN(C<ROW>)-LEN(SUBSTITUTE(C<ROW>,",",""))+1';
const FROZEN_OWNER_ACTION_IDS = Object.freeze([
  "R1-OA-001",
  "R10-OA-001",
  "R10-OA-002",
  "R2-OA-001",
  "R2-OA-002",
  "R5-OA-001",
  "R6-OA-001",
  "R7-OA-001",
  "R9-OA-001",
  "R9-OA-002",
  "R9-OA-003",
  "R9-OA-004",
]);
const EXPECTED_ARTIFACT_KINDS = Object.freeze([
  "architecture",
  "council",
  "delivery",
  "design",
  "product",
  "qa",
]);
const SHA256_PATTERN = /^(?:sha256:)?[0-9a-f]{64}$/;
const GRAPHQL_NODE_VALUE_PATTERN = /^(?:(?:PVT|PVTI|PVTF|PVTSSF|PVTSI|PVTV|PVTL)_[A-Za-z0-9_-]{8,}|I_kw[A-Za-z0-9_-]{6,}|MDQ6[A-Za-z0-9+/=_-]{8,})$/;
const DISALLOWED_NODE_KEYS = new Set([
  "nodeId",
  "projectId",
  "projectItemId",
  "fieldId",
  "optionId",
  "repositoryId",
  "contentId",
]);

function fail(message) {
  throw new Error(`P0_R1_R10_FREEZE_FAILED: ${message}`);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, canonicalize(value[key])]),
  );
}

export function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

export function sha256Bytes(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function sha256Canonical(value) {
  return sha256Bytes(canonicalJson(value));
}

function deepEqual(left, right) {
  return canonicalJson(left) === canonicalJson(right);
}

function xmlText(value) {
  return String(value ?? "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function xmlAttributes(source) {
  const attributes = {};
  for (const match of source.matchAll(/(?:^|\s)([A-Za-z_][\w:.-]*)=(?:"([^"]*)"|'([^']*)')/g)) {
    attributes[match[1]] = xmlText(match[2] ?? match[3] ?? "");
  }
  return attributes;
}

function safeZipName(name) {
  return typeof name === "string"
    && name.length > 0
    && !name.includes("\\")
    && !name.startsWith("/")
    && !name.split("/").includes("..")
    && posix.normalize(name) === name;
}

/**
 * Read the small, deterministic OOXML subset needed by the freeze verifier.
 * This is deliberately read-only and rejects encrypted, ZIP64, duplicated,
 * path-traversing, or unsupported archive entries before decompressing them.
 */
export function readSafeZipEntries(bytes, label = "workbook") {
  if (!Buffer.isBuffer(bytes)) fail(`${label} must be supplied as workbook bytes`);
  const minimumEocd = 22;
  let eocd = -1;
  for (let offset = bytes.length - minimumEocd; offset >= Math.max(0, bytes.length - 65_557); offset -= 1) {
    if (bytes.readUInt32LE(offset) === 0x06054b50) {
      eocd = offset;
      break;
    }
  }
  if (eocd < 0) fail(`${label} is not a complete ZIP workbook`);
  const disk = bytes.readUInt16LE(eocd + 4);
  const centralDisk = bytes.readUInt16LE(eocd + 6);
  const diskEntries = bytes.readUInt16LE(eocd + 8);
  const totalEntries = bytes.readUInt16LE(eocd + 10);
  const centralSize = bytes.readUInt32LE(eocd + 12);
  const centralOffset = bytes.readUInt32LE(eocd + 16);
  if (disk !== 0 || centralDisk !== 0 || diskEntries !== totalEntries
    || totalEntries === 0xffff || centralSize === 0xffffffff || centralOffset === 0xffffffff) {
    fail(`${label} uses unsupported split or ZIP64 archive metadata`);
  }
  if (centralOffset + centralSize > eocd) fail(`${label} central directory is out of bounds`);
  const entries = new Map();
  let cursor = centralOffset;
  for (let index = 0; index < totalEntries; index += 1) {
    if (cursor + 46 > bytes.length || bytes.readUInt32LE(cursor) !== 0x02014b50) {
      fail(`${label} central directory entry ${index + 1} is malformed`);
    }
    const flags = bytes.readUInt16LE(cursor + 8);
    const method = bytes.readUInt16LE(cursor + 10);
    const compressedSize = bytes.readUInt32LE(cursor + 20);
    const uncompressedSize = bytes.readUInt32LE(cursor + 24);
    const nameLength = bytes.readUInt16LE(cursor + 28);
    const extraLength = bytes.readUInt16LE(cursor + 30);
    const commentLength = bytes.readUInt16LE(cursor + 32);
    const localOffset = bytes.readUInt32LE(cursor + 42);
    const end = cursor + 46 + nameLength + extraLength + commentLength;
    if (end > bytes.length) fail(`${label} central directory entry ${index + 1} is truncated`);
    const name = bytes.subarray(cursor + 46, cursor + 46 + nameLength).toString("utf8");
    if (!safeZipName(name) || entries.has(name)) fail(`${label} contains an unsafe or duplicate archive path: ${name}`);
    if ((flags & 1) !== 0 || ![0, 8].includes(method)) fail(`${label} contains an encrypted or unsupported entry: ${name}`);
    if (compressedSize === 0xffffffff || uncompressedSize === 0xffffffff || localOffset === 0xffffffff) {
      fail(`${label} contains an unsupported ZIP64 entry: ${name}`);
    }
    if (localOffset + 30 > bytes.length || bytes.readUInt32LE(localOffset) !== 0x04034b50) {
      fail(`${label} local entry is malformed: ${name}`);
    }
    const localNameLength = bytes.readUInt16LE(localOffset + 26);
    const localExtraLength = bytes.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    if (dataOffset + compressedSize > bytes.length) fail(`${label} entry is truncated: ${name}`);
    const compressed = bytes.subarray(dataOffset, dataOffset + compressedSize);
    const content = method === 0 ? Buffer.from(compressed) : inflateRawSync(compressed);
    if (content.length !== uncompressedSize) fail(`${label} entry length is inconsistent: ${name}`);
    entries.set(name, content);
    cursor = end;
  }
  if (cursor !== centralOffset + centralSize) fail(`${label} central directory size is inconsistent`);
  return entries;
}

function requiredZipText(entries, name, label) {
  const bytes = entries.get(name);
  if (!bytes) fail(`${label} is missing ${name}`);
  return bytes.toString("utf8").replace(/^\uFEFF/, "");
}

function packagePath(base, target) {
  const normalized = target.startsWith("/")
    ? posix.normalize(target.slice(1))
    : posix.normalize(posix.join(posix.dirname(base), target));
  if (!safeZipName(normalized)) fail(`workbook relationship has an unsafe target: ${target}`);
  return normalized;
}

function relationshipMap(xml, basePath) {
  const relationships = new Map();
  for (const match of xml.matchAll(/<(?:\w+:)?Relationship\b([^>]*?)(?:\/?>)/g)) {
    const attributes = xmlAttributes(match[1]);
    if (!attributes.Id || !attributes.Target || relationships.has(attributes.Id)) {
      fail(`workbook contains a malformed or duplicate relationship in ${basePath}`);
    }
    relationships.set(attributes.Id, {
      target: attributes.TargetMode === "External" ? attributes.Target : packagePath(basePath, attributes.Target),
      external: attributes.TargetMode === "External",
      type: attributes.Type ?? "",
    });
  }
  return relationships;
}

function sharedStrings(xml) {
  if (!xml) return [];
  return [...xml.matchAll(/<(?:\w+:)?si\b[^>]*>([\s\S]*?)<\/(?:\w+:)?si>/g)].map((match) =>
    [...match[1].matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)]
      .map((part) => xmlText(part[1]))
      .join(""));
}

function cellValue(cellXml, type, strings) {
  const inline = [...cellXml.matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)]
    .map((match) => xmlText(match[1]))
    .join("");
  if (type === "inlineStr") return inline;
  const valueMatch = cellXml.match(/<(?:\w+:)?v\b[^>]*>([\s\S]*?)<\/(?:\w+:)?v>/);
  const value = valueMatch ? xmlText(valueMatch[1]) : "";
  if (type === "s") {
    const index = Number.parseInt(value, 10);
    if (!Number.isInteger(index) || index < 0 || index >= strings.length) fail("workbook has an invalid shared-string reference");
    return strings[index];
  }
  return value;
}

function normalizeFormulaForRow(formula, rowNumber) {
  if (!formula) return null;
  return formula.replace(/(\$?[A-Z]{1,3}\$?)\d+/g, (reference, column) => {
    const digits = reference.slice(column.length);
    return Number.parseInt(digits, 10) === rowNumber ? `${column}<ROW>` : reference;
  });
}

function parseSheetRows(xml, strings) {
  const rows = [];
  for (const rowMatch of xml.matchAll(/<(?:\w+:)?row\b([^>]*)>([\s\S]*?)<\/(?:\w+:)?row>/g)) {
    const rowAttributes = xmlAttributes(rowMatch[1]);
    const rowNumber = Number.parseInt(rowAttributes.r, 10);
    if (!Number.isInteger(rowNumber) || rowNumber <= 0) fail("workbook has a row without a valid coordinate");
    const cells = {};
    for (const cellMatch of rowMatch[2].matchAll(/<(?:\w+:)?c\b(?![^>]*\/\s*>)([^>]*)>([\s\S]*?)<\/(?:\w+:)?c>/g)) {
      // A self-closing empty cell can otherwise consume the next closing cell
      // tag under a regex parser; it has no displayed semantic value to retain.
      if (cellMatch[1].trimEnd().endsWith("/")) continue;
      const attributes = xmlAttributes(cellMatch[1]);
      const coordinate = attributes.r;
      const coordinateMatch = coordinate?.match(/^([A-Z]{1,3})(\d+)$/);
      if (!coordinateMatch || Number.parseInt(coordinateMatch[2], 10) !== rowNumber || cells[coordinateMatch[1]]) {
        fail(`workbook has a malformed or duplicate cell coordinate in row ${rowNumber}`);
      }
      const formulaMatch = cellMatch[2].match(/<(?:\w+:)?f\b[^>]*>([\s\S]*?)<\/(?:\w+:)?f>/);
      cells[coordinateMatch[1]] = {
        type: attributes.t ?? "n",
        value: cellValue(cellMatch[2], attributes.t ?? "n", strings),
        formula: formulaMatch ? normalizeFormulaForRow(xmlText(formulaMatch[1]), rowNumber) : null,
        hyperlink: null,
      };
    }
    rows.push({ rowNumber, cells });
  }
  return rows;
}

function attachHyperlinks(rows, sheetXml, relationships) {
  const cellsByCoordinate = new Map();
  for (const row of rows) {
    for (const [column, cell] of Object.entries(row.cells)) cellsByCoordinate.set(`${column}${row.rowNumber}`, cell);
  }
  for (const match of sheetXml.matchAll(/<(?:\w+:)?hyperlink\b([^>]*?)(?:\/?>)/g)) {
    const attributes = xmlAttributes(match[1]);
    const references = attributes.ref?.split(":") ?? [];
    if (references.length !== 1 || !cellsByCoordinate.has(references[0])) {
      fail(`workbook has an unsupported or dangling hyperlink reference: ${attributes.ref ?? "missing"}`);
    }
    const relationship = attributes["r:id"] ? relationships.get(attributes["r:id"]) : null;
    if (attributes["r:id"] && !relationship) fail(`workbook hyperlink ${references[0]} has a missing relationship`);
    cellsByCoordinate.get(references[0]).hyperlink = relationship?.target ?? attributes.location ?? null;
  }
}

function rowProjection(row, firstColumn, lastColumn) {
  const output = {};
  for (const [column, cell] of Object.entries(row.cells)) {
    const numeric = [...column].reduce((value, character) => value * 26 + character.charCodeAt(0) - 64, 0);
    const first = [...firstColumn].reduce((value, character) => value * 26 + character.charCodeAt(0) - 64, 0);
    const last = [...lastColumn].reduce((value, character) => value * 26 + character.charCodeAt(0) - 64, 0);
    if (numeric >= first && numeric <= last) output[column] = cell;
  }
  return output;
}

function keyedRows(rows, keyColumn, keyPattern, firstColumn, lastColumn, label) {
  const result = {};
  for (const row of rows) {
    const key = row.cells[keyColumn]?.value;
    if (!keyPattern.test(key ?? "")) continue;
    if (Object.hasOwn(result, key)) fail(`${label} contains duplicate frozen row ${key}`);
    result[key] = rowProjection(row, firstColumn, lastColumn);
  }
  return result;
}

export function extractFrozenOwnerActionProjection(ownerActionDocument) {
  if (!isPlainObject(ownerActionDocument) || !isPlainObject(ownerActionDocument.actions)) {
    fail("owner-action source is missing its actions object");
  }
  const actions = {};
  for (const [actionId, action] of Object.entries(ownerActionDocument.actions)) {
    if (!FROZEN_OWNER_ACTION_ID_PATTERN.test(actionId)) continue;
    if (!isPlainObject(action) || action.actionId !== actionId) {
      fail(`owner-action source has a malformed frozen record: ${actionId}`);
    }
    assertNoNodeIds(action, `frozen owner action ${actionId}`);
    actions[actionId] = canonicalize(action);
  }
  const actualIds = Object.keys(actions).sort();
  if (!deepEqual(actualIds, [...FROZEN_OWNER_ACTION_IDS].sort())) {
    fail("owner-action source does not contain the exact R1-R10 owner-action record set");
  }
  return Object.freeze(canonicalize(actions));
}

export function verifyFrozenOwnerActionSemantics(ownerActionSemantics) {
  if (!isPlainObject(ownerActionSemantics)
    || !isPlainObject(ownerActionSemantics.baseline)
    || !isPlainObject(ownerActionSemantics.current)) {
    fail("R1-R10 owner-action semantic sources are missing");
  }
  for (const label of ["baselineFile", "currentFile"]) {
    const record = ownerActionSemantics[label];
    if (!isPlainObject(record) || record.path !== OWNER_ACTION_STATE_PATH
      || record.gitMode !== "100644" || record.gitType !== "blob") {
      fail(`owner-action ${label} is not the canonical regular 100644 source`);
    }
  }
  const baseline = extractFrozenOwnerActionProjection(ownerActionSemantics.baseline);
  const current = extractFrozenOwnerActionProjection(ownerActionSemantics.current);
  if (sha256Canonical(baseline) !== FROZEN_OWNER_ACTION_PROJECTION_SHA256) {
    fail(`baseline R1-R10 owner-action semantics do not match ${FROZEN_SOURCE_REVISION}`);
  }
  assertExactObject(current, baseline, "R1-R10 owner-action requirement/state semantics");
  return Object.freeze({ actionCount: Object.keys(current).length });
}

export function extractFrozenMarkdownProjection(markdownBytes, snapshot) {
  const markdown = Buffer.isBuffer(markdownBytes) ? markdownBytes.toString("utf8") : String(markdownBytes);
  const frozenIds = new Set(snapshot.tasks.map((task) => task.taskId));
  const milestones = {};
  const tasks = {};
  for (const line of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const milestone = line.match(/^\| (R(?:[1-9]|10)) \|/)?.[1];
    if (milestone) {
      if (Object.hasOwn(milestones, milestone)) fail(`generated release-plan Markdown duplicates milestone row ${milestone}`);
      milestones[milestone] = line;
    }
    const taskId = line.match(/^\| `([^`]+)` \|/)?.[1];
    if (taskId && frozenIds.has(taskId)) {
      if (Object.hasOwn(tasks, taskId)) fail(`generated release-plan Markdown duplicates task row ${taskId}`);
      tasks[taskId] = line;
    }
  }
  const expectedMilestones = Array.from({ length: 10 }, (_, index) => `R${index + 1}`);
  if (!deepEqual(Object.keys(milestones).sort((left, right) => Number(left.slice(1)) - Number(right.slice(1))), expectedMilestones)) {
    fail("generated release-plan Markdown does not contain the exact R1-R10 milestone rows");
  }
  const expectedTasks = [...frozenIds].sort();
  if (!deepEqual(Object.keys(tasks).sort(), expectedTasks)) {
    fail("generated release-plan Markdown does not contain the exact frozen 50 task rows");
  }
  return Object.freeze({ milestones: canonicalize(milestones), tasks: canonicalize(tasks) });
}

function expectedFrozenRequirementMappings(snapshot) {
  const mappings = {};
  for (const task of snapshot.tasks) {
    if (!Array.isArray(task.authoredTask?.requirementIds)) {
      fail(`${task.taskId} has no authored requirement-ID list`);
    }
    const uniqueRequirementIds = new Set(task.authoredTask.requirementIds);
    if (uniqueRequirementIds.size !== task.authoredTask.requirementIds.length) {
      fail(`${task.taskId} has duplicated authored requirement IDs`);
    }
    for (const requirementId of task.authoredTask.requirementIds) {
      if (typeof requirementId !== "string" || !REQUIREMENT_ID_PATTERN.test(requirementId)) {
        fail(`${task.taskId} has a malformed authored requirement ID`);
      }
      (mappings[requirementId] ??= []).push(task.taskId);
    }
  }
  const requirementCount = Object.keys(mappings).length;
  const mappingCount = Object.values(mappings).reduce((count, taskIds) => count + taskIds.length, 0);
  if (requirementCount !== 71 || mappingCount !== 762) {
    fail(`activation snapshot requirement mapping invariant is ${requirementCount} rows/${mappingCount} pairs, expected 71/762`);
  }
  return canonicalize(mappings);
}

function frozenRequirementRows(rows, snapshot) {
  const expectedMappings = expectedFrozenRequirementMappings(snapshot);
  const expectedRequirementIds = Object.keys(expectedMappings).sort();
  const frozenTaskIds = new Set(snapshot.tasks.map((task) => task.taskId));
  const seenRequirementIds = new Set();
  const result = {};
  let mappingCount = 0;

  for (const row of rows) {
    const requirementId = row.cells.A?.value;
    const rawTaskList = row.cells.C?.value;
    const displayedTaskIds = typeof rawTaskList === "string"
      ? rawTaskList.split(",").map((taskId) => taskId.trim()).filter(Boolean)
      : [];
    const scopedTokens = displayedTaskIds.filter((taskId) => FROZEN_TASK_ID_PATTERN.test(taskId));
    if (typeof requirementId !== "string" || !REQUIREMENT_ID_PATTERN.test(requirementId)) {
      if (scopedTokens.length > 0) {
        fail("canonical release workbook Requirement Map has a frozen task mapping without a stable requirement ID");
      }
      continue;
    }
    if (seenRequirementIds.has(requirementId)) {
      fail(`canonical release workbook Requirement Map duplicates ${requirementId}`);
    }
    seenRequirementIds.add(requirementId);

    if (!Object.hasOwn(expectedMappings, requirementId)) {
      if (scopedTokens.length > 0) {
        fail(`canonical release workbook Requirement Map adds an unexpected frozen mapping for ${requirementId}`);
      }
      continue;
    }
    for (const column of ["A", "B", "C", "D", "E", "F"]) {
      if (!isPlainObject(row.cells[column])) {
        fail(`canonical release workbook Requirement Map ${requirementId} is missing cell ${column}`);
      }
    }
    if (displayedTaskIds.length === 0
      || new Set(displayedTaskIds).size !== displayedTaskIds.length
      || displayedTaskIds.some((taskId) => !PHASE1_TASK_ID_PATTERN.test(taskId))) {
      fail(`canonical release workbook Requirement Map ${requirementId} has a malformed or duplicated task list`);
    }
    const unknownFrozenTaskId = displayedTaskIds.find((taskId) =>
      FROZEN_TASK_ID_PATTERN.test(taskId) && !frozenTaskIds.has(taskId));
    if (unknownFrozenTaskId) {
      fail(`canonical release workbook Requirement Map ${requirementId} references unknown frozen task ${unknownFrozenTaskId}`);
    }
    const displayedFrozenTaskIds = displayedTaskIds.filter((taskId) => frozenTaskIds.has(taskId));
    if (!deepEqual([...displayedFrozenTaskIds].sort(), [...expectedMappings[requirementId]].sort())) {
      fail(`canonical release workbook Requirement Map ${requirementId} differs from the frozen task/requirement pairs`);
    }
    const taskCount = Number.parseInt(row.cells.F.value, 10);
    if (row.cells.F.type !== "n"
      || row.cells.F.formula !== REQUIREMENT_COUNT_FORMULA
      || !/^(?:0|[1-9]\d*)$/.test(row.cells.F.value)
      || taskCount !== displayedTaskIds.length) {
      fail(`canonical release workbook Requirement Map ${requirementId} has an invalid task-count formula or cached value`);
    }
    result[requirementId] = {
      A: canonicalize(row.cells.A),
      B: canonicalize(row.cells.B),
      C: canonicalize({
        type: row.cells.C.type,
        formula: row.cells.C.formula,
        hyperlink: row.cells.C.hyperlink,
        frozenTaskIds: displayedFrozenTaskIds,
      }),
      D: canonicalize(row.cells.D),
      E: canonicalize(row.cells.E),
      F: canonicalize({
        type: row.cells.F.type,
        formula: row.cells.F.formula,
        hyperlink: row.cells.F.hyperlink,
        frozenTaskCount: displayedFrozenTaskIds.length,
      }),
    };
    mappingCount += displayedFrozenTaskIds.length;
  }

  if (!deepEqual(Object.keys(result).sort(), expectedRequirementIds)) {
    fail("canonical release workbook Requirement Map does not contain the exact frozen requirement row set");
  }
  if (mappingCount !== 762) {
    fail(`canonical release workbook Requirement Map contains ${mappingCount} frozen task/requirement pairs, expected 762`);
  }
  return canonicalize(result);
}

export function extractFrozenWorkbookProjection(workbookBytes, snapshot) {
  const entries = readSafeZipEntries(workbookBytes, "canonical release workbook");
  const workbookPath = "xl/workbook.xml";
  const workbookXml = requiredZipText(entries, workbookPath, "canonical release workbook");
  const workbookRelsPath = "xl/_rels/workbook.xml.rels";
  const workbookRels = relationshipMap(
    requiredZipText(entries, workbookRelsPath, "canonical release workbook"),
    workbookPath,
  );
  const strings = sharedStrings(entries.get("xl/sharedStrings.xml")?.toString("utf8") ?? "");
  const sheets = new Map();
  for (const match of workbookXml.matchAll(/<(?:\w+:)?sheet\b([^>]*?)(?:\/?>)/g)) {
    const attributes = xmlAttributes(match[1]);
    const relationship = workbookRels.get(attributes["r:id"]);
    if (!attributes.name || !relationship || relationship.external || sheets.has(attributes.name)) {
      fail("canonical release workbook has a malformed, external, or duplicate worksheet");
    }
    const sheetXml = requiredZipText(entries, relationship.target, "canonical release workbook");
    const relsPath = posix.join(posix.dirname(relationship.target), "_rels", `${posix.basename(relationship.target)}.rels`);
    const relsXml = entries.get(relsPath)?.toString("utf8").replace(/^\uFEFF/, "") ?? "";
    const rels = relationshipMap(relsXml, relationship.target);
    const rows = parseSheetRows(sheetXml, strings);
    attachHyperlinks(rows, sheetXml, rels);
    sheets.set(attributes.name, rows);
  }
  const requiredSheets = ["Executive Summary", "Release Plan", "Roadmap Tasks", "Roadmap Timeline", "Requirement Map", "Risks & Gates", "Review Guide"];
  for (const sheetName of requiredSheets) {
    if (!sheets.has(sheetName)) fail(`canonical release workbook is missing ${sheetName}`);
  }
  const projection = {
    executiveReleaseRows: keyedRows(sheets.get("Executive Summary"), "A", FROZEN_MILESTONE_PATTERN, "A", "H", "Executive Summary release sequence"),
    executiveMilestoneCounts: keyedRows(sheets.get("Executive Summary"), "K", FROZEN_MILESTONE_PATTERN, "K", "L", "Executive Summary milestone counts"),
    releaseRows: keyedRows(sheets.get("Release Plan"), "A", FROZEN_MILESTONE_PATTERN, "A", "L", "Release Plan"),
    taskRows: keyedRows(sheets.get("Roadmap Tasks"), "A", FROZEN_TASK_ID_PATTERN, "A", "AC", "Roadmap Tasks"),
    timelineRows: keyedRows(sheets.get("Roadmap Timeline"), "A", FROZEN_TASK_ID_PATTERN, "A", "ZZZ", "Roadmap Timeline"),
    requirementRows: frozenRequirementRows(sheets.get("Requirement Map"), snapshot),
    gateRows: keyedRows(sheets.get("Risks & Gates"), "A", FROZEN_MILESTONE_PATTERN, "A", "H", "Risks & Gates"),
    guideRows: keyedRows(sheets.get("Review Guide"), "A", FROZEN_MILESTONE_PATTERN, "A", "C", "Review Guide"),
  };
  const frozenIds = snapshot.tasks.map((task) => task.taskId).sort();
  const milestoneIds = Array.from({ length: 10 }, (_, index) => `R${index + 1}`);
  for (const [label, rows] of Object.entries(projection)) {
    if (label === "requirementRows") continue;
    const expected = label === "taskRows" || label === "timelineRows"
      ? frozenIds
      : label === "guideRows" ? ["R1", "R10"] : milestoneIds;
    const actual = Object.keys(rows).sort((left, right) => {
      if (FROZEN_MILESTONE_PATTERN.test(left) && FROZEN_MILESTONE_PATTERN.test(right)) {
        return Number(left.slice(1)) - Number(right.slice(1));
      }
      return left.localeCompare(right);
    });
    if (!deepEqual(actual, expected)) fail(`canonical release workbook ${label} does not contain the exact frozen row set`);
  }
  return Object.freeze(canonicalize(projection));
}

export function verifyFrozenAggregateSemantics(snapshot, aggregateSemantics) {
  if (!isPlainObject(aggregateSemantics)
    || !isPlainObject(aggregateSemantics.baseline)
    || !isPlainObject(aggregateSemantics.current)) {
    fail("frozen aggregate semantic projections are missing");
  }
  assertExactObject(
    aggregateSemantics.current.markdown,
    aggregateSemantics.baseline.markdown,
    "generated release-plan Markdown frozen rows",
  );
  assertExactObject(
    aggregateSemantics.current.workbook,
    aggregateSemantics.baseline.workbook,
    "canonical release workbook frozen rows/cells/links/formulas",
  );
  return Object.freeze({
    markdownMilestoneRows: Object.keys(aggregateSemantics.current.markdown.milestones).length,
    markdownTaskRows: Object.keys(aggregateSemantics.current.markdown.tasks).length,
    workbookMilestoneRows: ["executiveReleaseRows", "executiveMilestoneCounts", "releaseRows", "gateRows", "guideRows"]
      .reduce((count, key) => count + Object.keys(aggregateSemantics.current.workbook[key]).length, 0),
    workbookTaskRows: Object.keys(aggregateSemantics.current.workbook.taskRows).length
      + Object.keys(aggregateSemantics.current.workbook.timelineRows).length,
    workbookRequirementRows: Object.keys(aggregateSemantics.current.workbook.requirementRows).length,
    workbookRequirementMappings: Object.values(aggregateSemantics.current.workbook.requirementRows)
      .reduce((count, row) => count + row.C.frozenTaskIds.length, 0),
  });
}

function countBy(values) {
  const result = {};
  for (const value of values) result[value] = (result[value] ?? 0) + 1;
  return Object.fromEntries(Object.entries(result).sort(([left], [right]) => left.localeCompare(right)));
}

function assertNoNodeIds(value, label, path = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoNodeIds(entry, label, [...path, String(index)]));
    return;
  }
  if (!isPlainObject(value)) {
    if (typeof value === "string" && GRAPHQL_NODE_VALUE_PATTERN.test(value)) {
      fail(`${label} contains a prohibited GraphQL node value at ${path.join(".") || "root"}`);
    }
    return;
  }
  for (const [key, entry] of Object.entries(value)) {
    if (DISALLOWED_NODE_KEYS.has(key) && entry !== null) {
      fail(`${label} contains prohibited ${key} at ${[...path, key].join(".")}`);
    }
    assertNoNodeIds(entry, label, [...path, key]);
  }
}

function expectedLabels(task) {
  const token = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return [
    "phase1",
    `priority:${token(task.priority)}`,
    "roadmap",
    `status:${token(task.status)}`,
    `type:${token(task.taskType)}`,
  ].sort();
}

function authoredTaskFromManifest(task) {
  const { taskDossier: _taskDossier, ...authoredTask } = task;
  return authoredTask;
}

function snapshotPayload(snapshot) {
  const { snapshotSha256: _snapshotSha256, ...payload } = snapshot;
  return payload;
}

function assertExactObject(actual, expected, label) {
  if (!deepEqual(actual, expected)) fail(`${label} differs from the activation freeze`);
}

function assertHash(value, label, { prefixOptional = true } = {}) {
  if (typeof value !== "string" || !SHA256_PATTERN.test(value) || (!prefixOptional && !value.startsWith("sha256:"))) {
    fail(`${label} is not a canonical SHA-256 value`);
  }
}

function assertTaskSnapshotShape(task, artifactPaths) {
  if (!isPlainObject(task) || typeof task.taskId !== "string") fail("snapshot contains a malformed task record");
  if (!/^.+-R(?:[1-9]|10)-\d{3}$/.test(task.taskId)) fail(`${task.taskId} is not an R1-R10 task ID`);
  const milestone = task.taskId.match(/-(R(?:[1-9]|10))-/)?.[1];
  if (task.milestone !== milestone || task.authoredTask?.milestone !== milestone || task.authoredTask?.id !== task.taskId) {
    fail(`${task.taskId} milestone or authored identity is inconsistent`);
  }
  if (task.authoredTask?.executionAllowed !== false || task.artifactRegisterProjection?.executionAllowed !== false) {
    fail(`${task.taskId} has execution permission in the activation snapshot`);
  }
  if (task.taskApproval !== null || task.controlReview !== null || task.readinessOverride !== null) {
    fail(`${task.taskId} has an approval, control review, or readiness override in the activation snapshot`);
  }
  if (task.authoredTask?.github?.projectItemId !== null) fail(`${task.taskId} exposes a Project node ID`);
  assertHash(task.manifestTaskSha256, `${task.taskId} manifest task digest`);
  assertHash(task.artifactRegisterTaskSha256, `${task.taskId} artifact-register task digest`);
  assertHash(task.projectFieldsSha256, `${task.taskId} Project-field digest`);
  if (sha256Canonical(task.projectFields) !== task.projectFieldsSha256) {
    fail(`${task.taskId} Project-field digest does not match its sanitized values`);
  }
  const labels = [...(task.issue?.labels ?? [])].sort();
  if (!deepEqual(labels, expectedLabels(task.authoredTask))) fail(`${task.taskId} issue labels are not canonical`);
  const expectedIssueState = task.authoredTask.status === "Done" ? "CLOSED" : "OPEN";
  if (task.issue?.state !== expectedIssueState) fail(`${task.taskId} issue state contradicts roadmap status`);
  if (task.issue?.title !== task.authoredTask.issueTitle || task.issue?.number !== task.issueMap?.number
    || task.issue?.url !== task.issueMap?.url || task.issueMap?.expectedStatus !== task.authoredTask.status
    || task.issueMap?.expectedFinalState !== expectedIssueState.toLowerCase()
    || task.issue?.milestone?.title !== task.milestone) {
    fail(`${task.taskId} issue identity or issue-map projection is inconsistent`);
  }
  assertHash(task.issue?.bodySha256, `${task.taskId} issue-body digest`);
  if (!Number.isInteger(task.issue?.bodyByteSize) || task.issue.bodyByteSize <= 0) {
    fail(`${task.taskId} issue-body byte size is invalid`);
  }
  if (task.projectFields?.status !== task.authoredTask.status
    || task.projectFields?.priority !== task.authoredTask.priority
    || task.projectFields?.["owner role"] !== task.authoredTask.ownerRole
    || (task.projectFields?.["start date"] ?? null) !== task.authoredTask.startDate
    || (task.projectFields?.["target date"] ?? null) !== task.authoredTask.targetDate
    || task.projectFields?.["requirement IDs"] !== task.authoredTask.requirementIds.join(", ")
    || task.projectFields?.milestone?.title !== task.milestone
    || !deepEqual([...(task.projectFields?.labels ?? [])].sort(), labels)
    || task.projectFields?.content?.number !== task.issue.number
    || task.projectFields?.content?.url !== task.issue.url
    || task.projectFields?.content?.title !== task.issue.title) {
    fail(`${task.taskId} sanitized Project values contradict authored task or issue identity`);
  }
  if (!Array.isArray(task.artifacts) || task.artifacts.length !== EXPECTED_ARTIFACT_KINDS.length) {
    fail(`${task.taskId} must freeze exactly six task artifacts`);
  }
  const kinds = task.artifacts.map((artifact) => artifact.kind).sort();
  if (!deepEqual(kinds, EXPECTED_ARTIFACT_KINDS)) fail(`${task.taskId} artifact kinds are incomplete or duplicated`);
  for (const artifact of task.artifacts) {
    if (artifact.gitMode !== "100644" || artifact.gitType !== "blob" || artifact.required !== true) {
      fail(`${task.taskId} artifact ${artifact.path} is not a required regular 100644 blob`);
    }
    if (artifact.state !== "draft" || artifact.contentState !== "draft") {
      fail(`${task.taskId} artifact ${artifact.path} was not Draft at activation`);
    }
    if (typeof artifact.path !== "string" || !artifact.path.startsWith(`docs/work-items/${task.taskId}/P0-`)) {
      fail(`${task.taskId} contains a non-task or non-P0 artifact path`);
    }
    if (artifactPaths.has(artifact.path)) fail(`duplicate frozen artifact path: ${artifact.path}`);
    artifactPaths.add(artifact.path);
    assertHash(artifact.sha256, `${task.taskId} artifact digest`);
    if (!Number.isInteger(artifact.byteSize) || artifact.byteSize <= 0) {
      fail(`${task.taskId} artifact ${artifact.path} has an invalid byte size`);
    }
  }
  assertNoNodeIds(task, `snapshot task ${task.taskId}`);
}

export function validateFreezeSnapshot(snapshot) {
  if (!isPlainObject(snapshot)) fail("snapshot root must be an object");
  if (snapshot.schemaVersion !== "1.0.0" || snapshot.recordType !== "P0/R0 activation freeze"
    || snapshot.boundary !== "P0/R0 activation freeze for all 50 R1-R10 tasks"
    || snapshot.nonAuthorizing !== true) {
    fail("snapshot identity or non-authorizing boundary is invalid");
  }
  if (snapshot.sourceRevision !== FROZEN_SOURCE_REVISION || snapshot.remoteMainRevision !== FROZEN_SOURCE_REVISION) {
    fail("snapshot source revisions do not equal the owner-activated exact main revision");
  }
  if (snapshot.repository !== "arunpr614/Life-Reflection" || snapshot.projectNumber !== 1
    || snapshot.excludedProjectNodeIds !== true) {
    fail("snapshot repository, Project, or node-ID exclusion boundary is invalid");
  }
  if (snapshot.snapshotSha256 !== FROZEN_SNAPSHOT_SHA256) fail("snapshot digest is not the immutable activation digest");
  const actualSnapshotSha = `sha256:${sha256Canonical(snapshotPayload(snapshot))}`;
  if (actualSnapshotSha !== snapshot.snapshotSha256) fail("snapshot payload digest does not match its bytes");
  const allowed = [...(snapshot.allowedAggregateProvenancePaths ?? [])].sort();
  if (!deepEqual(allowed, [...ALLOWED_AGGREGATE_PROVENANCE_PATHS].sort())) {
    fail("aggregate provenance exceptions are not the closed four-path allowlist");
  }
  if (!Array.isArray(snapshot.tasks) || snapshot.tasks.length !== 50) fail("snapshot must contain exactly 50 tasks");
  const taskIds = snapshot.tasks.map((task) => task.taskId);
  if (!deepEqual(taskIds, [...taskIds].sort()) || new Set(taskIds).size !== 50) {
    fail("snapshot task IDs must be unique and bytewise sorted");
  }
  const artifactPaths = new Set();
  for (const task of snapshot.tasks) assertTaskSnapshotShape(task, artifactPaths);
  if (artifactPaths.size !== 300) fail("snapshot must contain exactly 300 unique task artifacts");

  const derivedCounts = {
    taskCount: snapshot.tasks.length,
    artifactCount: artifactPaths.size,
    taskStatus: countBy(snapshot.tasks.map((task) => task.authoredTask.status)),
    issueState: countBy(snapshot.tasks.map((task) => task.issue.state)),
    projectStatus: countBy(snapshot.tasks.map((task) => task.projectFields.status)),
    milestone: countBy(snapshot.tasks.map((task) => task.milestone)),
    executionDecision: countBy(snapshot.tasks.map((task) => task.artifactRegisterProjection.executionDecision)),
    artifactState: countBy(snapshot.tasks.flatMap((task) => task.artifacts.map((artifact) => artifact.state))),
    executionAllowedTrue: snapshot.tasks.filter((task) => task.authoredTask.executionAllowed === true
      || task.artifactRegisterProjection.executionAllowed === true).length,
  };
  assertExactObject(snapshot.counts, derivedCounts, "snapshot aggregate counts");
  if (derivedCounts.executionAllowedTrue !== 0) fail("snapshot grants execution permission");
  assertNoNodeIds(snapshot, "freeze snapshot");
  return Object.freeze({ taskCount: 50, artifactCount: 300, snapshotSha256: actualSnapshotSha });
}

function compareArtifactRecord(taskId, expected, actual) {
  if (!actual || actual.gitMode !== "100644" || actual.gitType !== "blob") {
    fail(`${taskId} artifact ${expected.path} is missing or is not a regular 100644 Git blob`);
  }
  if (actual.sha256 !== expected.sha256 || actual.byteSize !== expected.byteSize) {
    fail(`${taskId} artifact ${expected.path} bytes differ from the activation freeze`);
  }
}

function compareSourceFileProvenance(snapshot, source) {
  for (const [name, expected] of Object.entries(snapshot.sourceFiles)) {
    const actual = source.baselineSourceFiles?.[name];
    if (!actual || actual.path !== expected.path || actual.sha256 !== expected.sha256
      || actual.byteSize !== expected.byteSize || actual.gitMode !== "100644" || actual.gitType !== "blob") {
      fail(`baseline source provenance for ${name} does not match ${snapshot.sourceRevision}`);
    }
  }
}

export function verifySourceAgainstFreeze(snapshot, source) {
  validateFreezeSnapshot(snapshot);
  if (!isPlainObject(source) || typeof source.revision !== "string") fail("source adapter is malformed");
  if (source.baselineAncestor !== true) fail("the activation source is not an ancestor of the verified revision");
  compareSourceFileProvenance(snapshot, source);
  const ownerActionSemanticResult = verifyFrozenOwnerActionSemantics(source.ownerActionSemantics);
  const manifestTasks = (source.manifest?.tasks ?? []).filter((task) => /^.+-R(?:[1-9]|10)-\d{3}$/.test(task.id));
  const registerTasks = (source.register?.tasks ?? []).filter((task) => /^.+-R(?:[1-9]|10)-\d{3}$/.test(task.taskId));
  const manifestById = new Map(manifestTasks.map((task) => [task.id, task]));
  const registerById = new Map(registerTasks.map((task) => [task.taskId, task]));
  const frozenIds = snapshot.tasks.map((task) => task.taskId);
  const manifestIds = [...manifestById.keys()].sort();
  const registerIds = [...registerById.keys()].sort();
  if (manifestById.size !== 50 || registerById.size !== 50 || !deepEqual(manifestIds, frozenIds)
    || !deepEqual(registerIds, frozenIds)) {
    fail("current manifest/register do not contain the exact frozen 50-task ID set");
  }
  for (const frozenTask of snapshot.tasks) {
    const taskId = frozenTask.taskId;
    const manifestTask = manifestById.get(taskId);
    const registerTask = registerById.get(taskId);
    assertExactObject(authoredTaskFromManifest(manifestTask), frozenTask.authoredTask, `${taskId} authored semantics`);
    if (sha256Canonical(manifestTask) !== frozenTask.manifestTaskSha256) {
      fail(`${taskId} full manifest-task digest differs from activation`);
    }
    if (sha256Canonical(registerTask) !== frozenTask.artifactRegisterTaskSha256) {
      fail(`${taskId} full artifact-register task digest differs from activation`);
    }
    if (manifestTask.executionAllowed !== false || registerTask.executionAllowed !== false) {
      fail(`${taskId} is execution-allowed at ${source.revision}`);
    }
    const readinessOverride = source.readiness?.taskOverrides?.[taskId] ?? null;
    const taskStateOverride = source.taskState?.statusOverrides?.[taskId] ?? null;
    const taskApproval = source.approvals?.taskApprovals?.[taskId] ?? null;
    const controlReview = source.approvals?.controlReviews?.[taskId] ?? null;
    assertExactObject(readinessOverride, frozenTask.readinessOverride, `${taskId} readiness override`);
    assertExactObject(taskStateOverride, frozenTask.taskStateOverride, `${taskId} task-state override`);
    assertExactObject(taskApproval, frozenTask.taskApproval, `${taskId} task approval`);
    assertExactObject(controlReview, frozenTask.controlReview, `${taskId} control review`);
    assertExactObject(source.issueMap?.issues?.[taskId] ?? null, frozenTask.issueMap, `${taskId} issue map`);
    const frozenArtifactByPath = new Map(frozenTask.artifacts.map((artifact) => [artifact.path, artifact]));
    for (const artifact of frozenTask.artifacts) compareArtifactRecord(taskId, artifact, source.artifacts?.[artifact.path]);
    const registerArtifacts = registerTask.artifacts ?? {};
    for (const [kind, registerArtifact] of Object.entries(registerArtifacts)) {
      const frozenArtifact = [...frozenArtifactByPath.values()].find((artifact) => artifact.kind === kind);
      if (!frozenArtifact || registerArtifact.path !== frozenArtifact.path
        || registerArtifact.state !== frozenArtifact.state
        || registerArtifact.contentState !== frozenArtifact.contentState
        || registerArtifact.sha256 !== frozenArtifact.sha256) {
        fail(`${taskId} ${kind} artifact register projection differs from activation`);
      }
    }
  }
  for (const change of source.aggregateChanges ?? []) {
    if (!ALLOWED_AGGREGATE_PROVENANCE_PATHS.includes(change.path)) {
      fail(`unallowlisted aggregate provenance change: ${change.path}`);
    }
    if (change.baselineGitMode !== "100644" || change.currentGitMode !== "100644"
      || change.baselineGitType !== "blob" || change.currentGitType !== "blob") {
      fail(`aggregate exception is not a regular 100644 blob: ${change.path}`);
    }
  }
  const aggregateSemanticResult = verifyFrozenAggregateSemantics(snapshot, source.aggregateSemantics);
  return Object.freeze({
    revision: source.revision,
    taskCount: frozenIds.length,
    artifactCount: snapshot.counts.artifactCount,
    executionAllowedCount: 0,
    aggregateChanges: (source.aggregateChanges ?? []).map(({ path, baselineSha256, currentSha256 }) => ({
      path,
      baselineSha256,
      currentSha256,
    })),
    aggregateSemantics: aggregateSemanticResult,
    ownerActionSemantics: ownerActionSemanticResult,
  });
}

function normalizeSanitizedAdapter(adapter, label) {
  if (!isPlainObject(adapter)) fail(`${label} adapter must be an object`);
  if (adapter.repository !== "arunpr614/Life-Reflection" || adapter.projectNumber !== 1) {
    fail(`${label} adapter targets the wrong repository or Project`);
  }
  assertNoNodeIds(adapter, `${label} adapter`);
  const taskEntries = Array.isArray(adapter.tasks)
    ? adapter.tasks.map((task) => [task.taskId, task])
    : Object.entries(adapter.tasks ?? {});
  if (taskEntries.some(([taskId]) => typeof taskId !== "string") || new Map(taskEntries).size !== taskEntries.length) {
    fail(`${label} adapter task identities are malformed or duplicated`);
  }
  return new Map(taskEntries);
}

export function verifySanitizedIssueProjectAdapter(snapshot, adapter, label = "projection") {
  validateFreezeSnapshot(snapshot);
  const tasks = normalizeSanitizedAdapter(adapter, label);
  if (tasks.size !== snapshot.tasks.length) fail(`${label} adapter must contain exactly 50 frozen tasks`);
  for (const frozenTask of snapshot.tasks) {
    const actual = tasks.get(frozenTask.taskId);
    if (!actual) fail(`${label} adapter is missing ${frozenTask.taskId}`);
    assertExactObject(actual.issue, frozenTask.issue, `${label} ${frozenTask.taskId} issue values`);
    if (!isPlainObject(actual.projectFields)) fail(`${label} ${frozenTask.taskId} Project values are malformed`);
    // GitHub exposes a redundant top-level Project `title` projection which is
    // not one of the 17 managed fields. The activation snapshot captured one
    // known stale value there for ENG-R3-001 while issue.title and
    // projectFields.content.title already held the canonical authored title.
    // Exclude only that closed key; every managed value and immutable content
    // identity remains exact and extra/missing keys still fail closed.
    const { title: _actualRedundantProjectTitle, ...actualProjectFields } = actual.projectFields;
    const { title: _frozenRedundantProjectTitle, ...frozenProjectFields } = frozenTask.projectFields;
    assertExactObject(actualProjectFields, frozenProjectFields, `${label} ${frozenTask.taskId} Project values`);
  }
  return Object.freeze({
    label,
    taskCount: tasks.size,
    mismatchCount: 0,
    nodeIdsPresent: false,
    excludedRedundantProjectKeys: ["title"],
  });
}

export function verifyFrozenScope({
  snapshot,
  source,
  projection = null,
  live = null,
  projectionClaimed = projection !== null,
  liveClaimed = live !== null,
}) {
  if (projectionClaimed && projection === null) fail("projection parity was claimed without a sanitized exact-50 adapter");
  if (liveClaimed && live === null) fail("live parity was claimed without a sanitized exact-50 adapter");
  const sourceResult = verifySourceAgainstFreeze(snapshot, source);
  const projectionResult = projection
    ? verifySanitizedIssueProjectAdapter(snapshot, projection, "projection")
    : null;
  const liveResult = live ? verifySanitizedIssueProjectAdapter(snapshot, live, "live") : null;
  return Object.freeze({
    passed: true,
    snapshotSha256: snapshot.snapshotSha256,
    source: sourceResult,
    projection: projectionResult,
    live: liveResult,
  });
}

function git(repoRoot, args, options = {}) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: Object.hasOwn(options, "encoding") ? options.encoding : "utf8",
    maxBuffer: 128 * 1024 * 1024,
  });
}

function gitEntry(repoRoot, revision, path) {
  const output = git(repoRoot, ["ls-tree", "-z", revision, "--", path]);
  const entries = output.split("\0").filter(Boolean);
  if (entries.length !== 1) fail(`expected one Git entry for ${path} at ${revision}`);
  const match = entries[0].match(/^(\d{6}) (\w+) ([0-9a-f]+)\t(.+)$/s);
  if (!match || match[4] !== path) fail(`could not parse the Git entry for ${path} at ${revision}`);
  return { gitMode: match[1], gitType: match[2] };
}

function gitBytes(repoRoot, revision, path) {
  return git(repoRoot, ["show", `${revision}:${path}`], { encoding: null });
}

function gitJson(repoRoot, revision, path) {
  const bytes = gitBytes(repoRoot, revision, path);
  return parseJsonWithoutDuplicateKeys(bytes.toString("utf8"), `${path}@${revision}`);
}

export function loadCommittedFreezeSnapshot({ repoRoot, revision = "HEAD" }) {
  const exactRevision = git(repoRoot, ["rev-parse", `${revision}^{commit}`]).trim();
  return gitJson(repoRoot, exactRevision, FREEZE_SNAPSHOT_PATH);
}

function fileRecordAtRevision(repoRoot, revision, path) {
  const entry = gitEntry(repoRoot, revision, path);
  const bytes = gitBytes(repoRoot, revision, path);
  return {
    path,
    ...entry,
    sha256: sha256Bytes(bytes),
    byteSize: bytes.length,
  };
}

function fileRecordAtWorkingTree(repoRoot, path) {
  const absolute = resolve(repoRoot, path);
  let stats;
  let bytes;
  try {
    stats = lstatSync(absolute);
    bytes = readFileSync(absolute);
  } catch {
    fail(`expected a working-tree file at ${path}`);
  }
  if (!stats.isFile()) fail(`working-tree path is not a regular file: ${path}`);
  return {
    path,
    gitMode: (stats.mode & 0o111) === 0 ? "100644" : "100755",
    gitType: "blob",
    sha256: sha256Bytes(bytes),
    byteSize: bytes.length,
  };
}

function aggregateSemantics(snapshot, baselineMarkdown, currentMarkdown, baselineWorkbook, currentWorkbook) {
  return {
    baseline: {
      markdown: extractFrozenMarkdownProjection(baselineMarkdown, snapshot),
      workbook: extractFrozenWorkbookProjection(baselineWorkbook, snapshot),
    },
    current: {
      markdown: extractFrozenMarkdownProjection(currentMarkdown, snapshot),
      workbook: extractFrozenWorkbookProjection(currentWorkbook, snapshot),
    },
  };
}

function isGitAncestor(repoRoot, ancestor, revision) {
  const result = spawnSync("git", ["merge-base", "--is-ancestor", ancestor, revision], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  if (![0, 1].includes(result.status)) fail(`could not evaluate Git ancestry: ${result.stderr.trim()}`);
  return result.status === 0;
}

export function loadSourceAtGitRevision({ repoRoot, revision = "HEAD", snapshot }) {
  validateFreezeSnapshot(snapshot);
  const exactRevision = git(repoRoot, ["rev-parse", `${revision}^{commit}`]).trim();
  const documents = Object.fromEntries(
    Object.entries(SOURCE_PATHS).map(([name, path]) => [name, gitJson(repoRoot, exactRevision, path)]),
  );
  const ownerActionSemantics = {
    baseline: gitJson(repoRoot, snapshot.sourceRevision, OWNER_ACTION_STATE_PATH),
    current: gitJson(repoRoot, exactRevision, OWNER_ACTION_STATE_PATH),
    baselineFile: fileRecordAtRevision(repoRoot, snapshot.sourceRevision, OWNER_ACTION_STATE_PATH),
    currentFile: fileRecordAtRevision(repoRoot, exactRevision, OWNER_ACTION_STATE_PATH),
  };
  const baselineSourceFiles = Object.fromEntries(
    Object.entries(snapshot.sourceFiles).map(([name, record]) => [
      name,
      fileRecordAtRevision(repoRoot, snapshot.sourceRevision, record.path),
    ]),
  );
  const artifacts = {};
  for (const artifact of snapshot.tasks.flatMap((task) => task.artifacts)) {
    artifacts[artifact.path] = fileRecordAtRevision(repoRoot, exactRevision, artifact.path);
  }
  const aggregateChanges = [];
  for (const path of ALLOWED_AGGREGATE_PROVENANCE_PATHS) {
    const baseline = fileRecordAtRevision(repoRoot, snapshot.sourceRevision, path);
    const current = fileRecordAtRevision(repoRoot, exactRevision, path);
    if (baseline.sha256 !== current.sha256 || baseline.gitMode !== current.gitMode
      || baseline.gitType !== current.gitType) {
      aggregateChanges.push({
        path,
        baselineSha256: baseline.sha256,
        currentSha256: current.sha256,
        baselineGitMode: baseline.gitMode,
        baselineGitType: baseline.gitType,
        currentGitMode: current.gitMode,
        currentGitType: current.gitType,
      });
    }
  }
  const frozenAggregateSemantics = aggregateSemantics(
    snapshot,
    gitBytes(repoRoot, snapshot.sourceRevision, RELEASE_PLAN_PATH),
    gitBytes(repoRoot, exactRevision, RELEASE_PLAN_PATH),
    gitBytes(repoRoot, snapshot.sourceRevision, RELEASE_WORKBOOK_PATH),
    gitBytes(repoRoot, exactRevision, RELEASE_WORKBOOK_PATH),
  );
  return {
    revision: exactRevision,
    baselineAncestor: isGitAncestor(repoRoot, snapshot.sourceRevision, exactRevision),
    ...documents,
    baselineSourceFiles,
    artifacts,
    aggregateChanges,
    aggregateSemantics: frozenAggregateSemantics,
    ownerActionSemantics,
  };
}

export function loadSourceFromWorkingTree({ repoRoot, snapshot }) {
  validateFreezeSnapshot(snapshot);
  const headRevision = git(repoRoot, ["rev-parse", "HEAD^{commit}"]).trim();
  const documents = Object.fromEntries(
    Object.entries(SOURCE_PATHS).map(([name, path]) => {
      const bytes = readFileSync(resolve(repoRoot, path));
      return [name, parseJsonWithoutDuplicateKeys(bytes.toString("utf8"), `${path}@working-tree`)];
    }),
  );
  const ownerActionSemantics = {
    baseline: gitJson(repoRoot, snapshot.sourceRevision, OWNER_ACTION_STATE_PATH),
    current: parseJsonWithoutDuplicateKeys(
      readFileSync(resolve(repoRoot, OWNER_ACTION_STATE_PATH), "utf8"),
      `${OWNER_ACTION_STATE_PATH}@working-tree`,
    ),
    baselineFile: fileRecordAtRevision(repoRoot, snapshot.sourceRevision, OWNER_ACTION_STATE_PATH),
    currentFile: fileRecordAtWorkingTree(repoRoot, OWNER_ACTION_STATE_PATH),
  };
  const baselineSourceFiles = Object.fromEntries(
    Object.entries(snapshot.sourceFiles).map(([name, record]) => [
      name,
      fileRecordAtRevision(repoRoot, snapshot.sourceRevision, record.path),
    ]),
  );
  const artifacts = {};
  for (const artifact of snapshot.tasks.flatMap((task) => task.artifacts)) {
    artifacts[artifact.path] = fileRecordAtWorkingTree(repoRoot, artifact.path);
  }
  const aggregateChanges = [];
  for (const path of ALLOWED_AGGREGATE_PROVENANCE_PATHS) {
    const baseline = fileRecordAtRevision(repoRoot, snapshot.sourceRevision, path);
    const current = fileRecordAtWorkingTree(repoRoot, path);
    if (baseline.sha256 !== current.sha256 || baseline.gitMode !== current.gitMode
      || baseline.gitType !== current.gitType) {
      aggregateChanges.push({
        path,
        baselineSha256: baseline.sha256,
        currentSha256: current.sha256,
        baselineGitMode: baseline.gitMode,
        baselineGitType: baseline.gitType,
        currentGitMode: current.gitMode,
        currentGitType: current.gitType,
      });
    }
  }
  return {
    revision: `WORKTREE@${headRevision}`,
    baselineAncestor: isGitAncestor(repoRoot, snapshot.sourceRevision, headRevision),
    ...documents,
    baselineSourceFiles,
    artifacts,
    aggregateChanges,
    ownerActionSemantics,
    aggregateSemantics: aggregateSemantics(
      snapshot,
      gitBytes(repoRoot, snapshot.sourceRevision, RELEASE_PLAN_PATH),
      readFileSync(resolve(repoRoot, RELEASE_PLAN_PATH)),
      gitBytes(repoRoot, snapshot.sourceRevision, RELEASE_WORKBOOK_PATH),
      readFileSync(resolve(repoRoot, RELEASE_WORKBOOK_PATH)),
    ),
  };
}

function usage() {
  return `Usage: node tools/P0-verify-r1-r10-freeze.mjs [options]

Verifies the committed 50-task R1-R10 activation freeze without network or writes.

Options:
  --revision <commit>       Verify committed source and artifacts at this Git revision.
                            Without this option, verify the current working tree against committed HEAD.
  --projection-json <path>  Also compare a sanitized 50-task issue/Project projection adapter.
  --projection-from-sync    Require the ephemeral adapter emitted by sync_phase1_github.mjs.
  --live-json <path>        Also compare a sanitized read-only live issue/Project adapter.
  --help                    Show this help without reading or writing repository state.
`;
}

function parseCli(argv) {
  if (argv.length === 1 && ["--help", "-h"].includes(argv[0])) return { help: true };
  if (argv.some((arg) => ["--help", "-h"].includes(arg))) fail("--help cannot be combined with other options");
  const parsed = { revision: null, projectionPath: null, projectionFromSync: false, livePath: null };
  const options = new Map([
    ["--revision", "revision"],
    ["--projection-json", "projectionPath"],
    ["--live-json", "livePath"],
  ]);
  const seen = new Set();
  for (let index = 0; index < argv.length; index += 1) {
    const option = argv[index];
    if (option === "--projection-from-sync") {
      if (seen.has(option)) fail(`duplicate option: ${option}`);
      parsed.projectionFromSync = true;
      seen.add(option);
      continue;
    }
    if (!options.has(option)) fail(`unknown option: ${option}`);
    if (seen.has(option)) fail(`duplicate option: ${option}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("-")) fail(`${option} requires one non-option value`);
    parsed[options.get(option)] = value;
    seen.add(option);
    index += 1;
  }
  if (parsed.projectionPath && parsed.projectionFromSync) {
    fail("--projection-json and --projection-from-sync are mutually exclusive");
  }
  return parsed;
}

function readAdapter(path, label) {
  const bytes = readFileSync(resolve(path), "utf8");
  return parseJsonWithoutDuplicateKeys(bytes, `${label} adapter`);
}

function readProjectionFromSync(repoRoot) {
  const result = spawnSync(process.execPath, [resolve(repoRoot, "tools/sync_phase1_github.mjs"), "--freeze-adapter"], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    fail(`sync projection adapter failed (${result.status}): ${result.stderr.trim()}`);
  }
  const output = parseJsonWithoutDuplicateKeys(result.stdout, "sync freeze-adapter output");
  if (output.mode !== "freeze-adapter" || !isPlainObject(output.adapter)) {
    fail("sync projection adapter output is malformed");
  }
  return output.adapter;
}

async function main() {
  const options = parseCli(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }
  const repoRoot = git(process.cwd(), ["rev-parse", "--show-toplevel"]).trim();
  const committedRevision = git(repoRoot, ["rev-parse", `${options.revision ?? "HEAD"}^{commit}`]).trim();
  const snapshot = gitJson(repoRoot, committedRevision, FREEZE_SNAPSHOT_PATH);
  const source = options.revision
    ? loadSourceAtGitRevision({ repoRoot, revision: committedRevision, snapshot })
    : loadSourceFromWorkingTree({ repoRoot, snapshot });
  const projection = options.projectionPath
    ? readAdapter(options.projectionPath, "projection")
    : options.projectionFromSync ? readProjectionFromSync(repoRoot) : null;
  const live = options.livePath ? readAdapter(options.livePath, "live") : null;
  process.stdout.write(`${JSON.stringify(verifyFrozenScope({
    snapshot,
    source,
    projection,
    live,
    projectionClaimed: Boolean(options.projectionPath || options.projectionFromSync),
    liveClaimed: Boolean(options.livePath),
  }), null, 2)}\n`);
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
