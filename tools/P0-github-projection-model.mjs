import crypto from "node:crypto";
import { P0_R0_SCOPE_TASK_IDS, P0_R0_SUBSTANTIVE_TASK_IDS } from "./P0-readiness-gates.mjs";
import { canonicalJson, hasExactKeys, isPlainRecord } from "./P0-content-safety.mjs";

export { P0_R0_SCOPE_TASK_IDS, P0_R0_SUBSTANTIVE_TASK_IDS };

export const DELIVERY_STATUSES = Object.freeze(["Backlog", "Next", "In progress", "Done"]);
export const HISTORICAL_NON_TRANSITION_TASK_IDS = Object.freeze([
  "AUD-001",
  "PC-001",
  "PRD-R0-001",
]);
export const CANONICAL_STATUS_LABELS = Object.freeze([
  "status:backlog",
  "status:next",
  "status:in-progress",
  "status:done",
]);

const STATUS_EDGES = Object.freeze({
  Backlog: Object.freeze(["Next"]),
  Next: Object.freeze(["In progress"]),
  "In progress": Object.freeze(["Done"]),
  Done: Object.freeze([]),
});
const FULL_REVISION = /^[0-9a-f]{40}$/;
const SNAPSHOT_INPUT_KEYS = Object.freeze(["taskId", "sourceRevision", "taskStatus", "issue", "projectItem"]);
const ISSUE_KEYS = Object.freeze(["number", "url", "title", "body", "state", "milestone", "labels"]);
const PROJECT_KEYS = Object.freeze(["itemIdentity", "status", "fields"]);

function digest(value) {
  return `sha256:${crypto.createHash("sha256").update(canonicalJson(value)).digest("hex")}`;
}

function sortedStrings(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

export function statusLabelFor(status) {
  if (!DELIVERY_STATUSES.includes(status)) throw new TypeError("unsupported delivery status");
  return `status:${status.toLowerCase().replaceAll(" ", "-")}`;
}

export function issueStateFor(status) {
  if (!DELIVERY_STATUSES.includes(status)) throw new TypeError("unsupported delivery status");
  return status === "Done" ? "closed" : "open";
}

export function statusFromLabel(label) {
  const index = CANONICAL_STATUS_LABELS.indexOf(label);
  return index < 0 ? null : DELIVERY_STATUSES[index];
}

export function transitionEdgeAllowed(fromStatus, toStatus) {
  return STATUS_EDGES[fromStatus]?.includes(toStatus) === true;
}

export function buildProjectionSnapshot(input) {
  const observationResult = buildProjectionTransitionObservation(input);
  if (!observationResult.ok) return observationResult;
  const { observation } = observationResult;
  if (observation.statusLabelStatus !== input.taskStatus
    || observation.projectStatus !== input.taskStatus
    || observation.issueState !== issueStateFor(input.taskStatus)) {
    return Object.freeze({ ok: false, code: "PROJECTION_STATUS_PREIMAGE_MISMATCH" });
  }
  const snapshot = Object.freeze({
    schemaVersion: "1.0.0",
    taskId: input.taskId,
    sourceRevision: input.sourceRevision,
    taskStatus: input.taskStatus,
    projectStatus: observation.projectStatus,
    issueState: observation.issueState,
    statusLabel: observation.statusLabel,
    protectedIssueDigest: observation.protectedIssueDigest,
    protectedProjectDigest: observation.protectedProjectDigest,
  });
  return Object.freeze({
    ok: true,
    code: "PROJECTION_SNAPSHOT_VALID",
    snapshot,
    snapshotDigest: digest(snapshot),
  });
}

/** Observe a possibly partial transition without accepting it as a coherent snapshot. */
export function buildProjectionTransitionObservation(input) {
  if (!hasExactKeys(input, SNAPSHOT_INPUT_KEYS)
    || !P0_R0_SCOPE_TASK_IDS.includes(input.taskId)
    || !FULL_REVISION.test(input.sourceRevision ?? "")
    || !DELIVERY_STATUSES.includes(input.taskStatus)
    || !hasExactKeys(input.issue, ISSUE_KEYS)
    || !hasExactKeys(input.projectItem, PROJECT_KEYS)
    || !Number.isSafeInteger(input.issue.number)
    || input.issue.number <= 0
    || typeof input.issue.url !== "string"
    || typeof input.issue.title !== "string"
    || typeof input.issue.body !== "string"
    || !["open", "closed"].includes(input.issue.state)
    || typeof input.issue.milestone !== "string"
    || !Array.isArray(input.issue.labels)
    || !input.issue.labels.every((label) => typeof label === "string")
    || typeof input.projectItem.itemIdentity !== "string"
    || !DELIVERY_STATUSES.includes(input.projectItem.status)
    || !isPlainRecord(input.projectItem.fields)) {
    return Object.freeze({ ok: false, code: "PROJECTION_SNAPSHOT_SHAPE_INVALID" });
  }
  const labels = sortedStrings(input.issue.labels);
  const statusLabels = labels.filter((label) => CANONICAL_STATUS_LABELS.includes(label));
  if (statusLabels.length !== 1) {
    return Object.freeze({ ok: false, code: "PROJECTION_STATUS_LABEL_CARDINALITY" });
  }
  const issueStatus = statusFromLabel(statusLabels[0]);
  if (Object.hasOwn(input.projectItem.fields, "Status")) {
    return Object.freeze({ ok: false, code: "PROJECTION_DUPLICATE_STATUS_FIELD" });
  }
  const protectedIssue = {
    number: input.issue.number,
    url: input.issue.url,
    title: input.issue.title,
    body: input.issue.body,
    milestone: input.issue.milestone,
    nonStatusLabels: labels.filter((label) => !CANONICAL_STATUS_LABELS.includes(label)),
  };
  const protectedProject = {
    itemIdentity: input.projectItem.itemIdentity,
    fields: input.projectItem.fields,
  };
  const observation = Object.freeze({
    schemaVersion: "1.0.0",
    taskId: input.taskId,
    sourceRevision: input.sourceRevision,
    projectStatus: input.projectItem.status,
    issueState: input.issue.state,
    statusLabel: statusLabels[0],
    statusLabelStatus: issueStatus,
    protectedIssueDigest: digest(protectedIssue),
    protectedProjectDigest: digest(protectedProject),
  });
  return Object.freeze({
    ok: true,
    code: "PROJECTION_TRANSITION_OBSERVATION_VALID",
    observation,
    observationDigest: digest(observation),
  });
}

export function buildTransitionTarget({ taskId, fromStatus, toStatus } = {}) {
  if (!P0_R0_SUBSTANTIVE_TASK_IDS.includes(taskId)) {
    return Object.freeze({ ok: false, code: HISTORICAL_NON_TRANSITION_TASK_IDS.includes(taskId)
      ? "TRANSITION_HISTORICAL_TASK_LOCKED"
      : "TRANSITION_TASK_NOT_ALLOWLISTED" });
  }
  if (!transitionEdgeAllowed(fromStatus, toStatus)) {
    return Object.freeze({ ok: false, code: "TRANSITION_EDGE_INVALID" });
  }
  return Object.freeze({
    ok: true,
    code: "TRANSITION_TARGET_VALID",
    target: Object.freeze({
      taskId,
      projectStatus: toStatus,
      issueState: issueStateFor(toStatus),
      removeStatusLabel: statusLabelFor(fromStatus),
      addStatusLabel: statusLabelFor(toStatus),
    }),
  });
}

export function snapshotMatches(left, right) {
  try {
    return canonicalJson(left) === canonicalJson(right);
  } catch {
    return false;
  }
}
