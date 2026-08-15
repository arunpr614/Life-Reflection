#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";
import {
  FULL_COMMIT_PATTERN,
  REQUIRED_GIT_TYPE,
  REQUIRED_REGULAR_FILE_MODE,
  SHA256_PATTERN,
  canonicalJson,
  gitEntryAtRevision,
  hasExactKeys,
  privateTextFindings,
  resolveRevision,
  sha256,
  strictUtf8,
  verifyPrefixOnlyFileHistory,
  verifyImmutableAddOnlyFileHistory,
} from "./P0-append-only-trust.mjs";

export const RUNNING_LOG_PATH = "RUNNING_LOG.md";
export const RUNNING_LOG_GENESIS_PATH = "docs/council/execution/control-reviews/P0-RUNNING-LOG-TRUST-GENESIS.json";
export const RUNNING_LOG_EVENT_PREFIX = "<!-- P0-RUNNING-LOG-EVENT:";
export const RUNNING_LOG_EVENT_SUFFIX = " -->";
export const RUNNING_LOG_ALLOWED_AUTHOR_IDS = Object.freeze([
  "codex-primary-integrator-01",
  "codex-project-manager-01",
]);
export const RUNNING_LOG_EVENT_TYPES = Object.freeze([
  "intent",
  "decision",
  "candidate",
  "qa",
  "mutation-intent",
  "mutation-result",
  "hold",
  "handoff",
  "terminal-recap",
]);

export const RUNNING_LOG_EVIDENCE_EFFECT = Object.freeze({
  taskContractEffect: "none",
  dossierDigestEffect: "none",
  taskApprovalEffect: "none",
  gateAEffect: "none",
  gateBEffect: "none",
  authorityEffect: "none",
  ownerActionEffect: "none",
  taskStatusEffect: "none",
  issueOrProjectStatusEffect: "none",
  permissionEffect: "none",
  executionAllowed: false,
});

export const RUNNING_LOG_GENESIS_KEYS = Object.freeze([
  "schemaVersion",
  "genesisId",
  "createdDate",
  "logPath",
  "baseRevision",
  "baseSha256",
  "baseByteLength",
  "requiredGitMode",
  "requiredGitType",
  "maximumTotalBytes",
  "maximumAppendBytes",
  "eventMarkerPrefix",
  "allowedEventAuthorIds",
  "evidenceEffect",
  "genesisPayloadSha256",
]);

export const RUNNING_LOG_EVENT_KEYS = Object.freeze([
  "schemaVersion",
  "eventId",
  "eventType",
  "recordedAt",
  "parentRevision",
  "previousByteLength",
  "previousSha256",
  "evidenceReference",
  "authorId",
  "bodySha256",
]);

const EVENT_ID_PATTERN = /^P0-[A-Z0-9][A-Z0-9-]{5,95}$/;
const AUTHOR_ID_PATTERN = /^[a-z][a-z0-9-]{5,95}$/;
const EVIDENCE_REFERENCE_PATTERN = /^(?:github-pr|github-check|commit|review|local-evidence):[A-Za-z0-9._\/-]{1,160}$/;
const IST_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+05:30$/;

function withoutKey(value, key) {
  return Object.fromEntries(Object.entries(value ?? {}).filter(([entry]) => entry !== key));
}

export function computeRunningLogGenesisPayloadSha256(genesis) {
  return sha256(canonicalJson(withoutKey(genesis, "genesisPayloadSha256")));
}

export function runningLogEvidenceEffect(_logBytes = null) {
  return { ...RUNNING_LOG_EVIDENCE_EFFECT };
}

export function buildRunningLogEventAppend({
  eventId,
  eventType,
  recordedAt,
  parentRevision,
  previousBytes,
  evidenceReference,
  authorId,
  body,
}) {
  if (!Buffer.isBuffer(previousBytes)) throw new TypeError("previousBytes must be a Buffer");
  const bodyBytes = Buffer.isBuffer(body) ? body : Buffer.from(body ?? "", "utf8");
  const event = {
    schemaVersion: "1.0.0",
    eventId,
    eventType,
    recordedAt,
    parentRevision,
    previousByteLength: previousBytes.length,
    previousSha256: sha256(previousBytes),
    evidenceReference,
    authorId,
    bodySha256: sha256(bodyBytes),
  };
  return {
    event,
    appendBytes: Buffer.concat([
      Buffer.from(`${RUNNING_LOG_EVENT_PREFIX}${canonicalJson(event)}${RUNNING_LOG_EVENT_SUFFIX}\n`, "utf8"),
      bodyBytes,
    ]),
  };
}

export function runningLogGenesisFindings(genesis) {
  const findings = [];
  const add = (condition, code) => { if (!condition) findings.push(code); };
  add(hasExactKeys(genesis, RUNNING_LOG_GENESIS_KEYS), "RUNNING_LOG_GENESIS_SCHEMA_INVALID");
  add(genesis?.schemaVersion === "1.0.0", "RUNNING_LOG_GENESIS_VERSION_INVALID");
  add(genesis?.genesisId === "P0-RUNNING-LOG-TRUST-GENESIS", "RUNNING_LOG_GENESIS_ID_INVALID");
  add(/^\d{4}-\d{2}-\d{2}$/.test(genesis?.createdDate ?? ""), "RUNNING_LOG_GENESIS_DATE_INVALID");
  add(genesis?.logPath === RUNNING_LOG_PATH, "RUNNING_LOG_PATH_INVALID");
  add(FULL_COMMIT_PATTERN.test(genesis?.baseRevision ?? ""), "RUNNING_LOG_BASE_REVISION_INVALID");
  add(SHA256_PATTERN.test(genesis?.baseSha256 ?? ""), "RUNNING_LOG_BASE_DIGEST_INVALID");
  add(Number.isSafeInteger(genesis?.baseByteLength) && genesis.baseByteLength > 0,
    "RUNNING_LOG_BASE_SIZE_INVALID");
  add(genesis?.requiredGitMode === REQUIRED_REGULAR_FILE_MODE
    && genesis?.requiredGitType === REQUIRED_GIT_TYPE, "RUNNING_LOG_MODE_TYPE_INVALID");
  add(Number.isSafeInteger(genesis?.maximumTotalBytes)
    && genesis.maximumTotalBytes >= genesis?.baseByteLength
    && genesis.maximumTotalBytes <= 16 * 1024 * 1024, "RUNNING_LOG_TOTAL_LIMIT_INVALID");
  add(Number.isSafeInteger(genesis?.maximumAppendBytes)
    && genesis.maximumAppendBytes >= 1024
    && genesis.maximumAppendBytes <= 512 * 1024, "RUNNING_LOG_APPEND_LIMIT_INVALID");
  add(genesis?.eventMarkerPrefix === RUNNING_LOG_EVENT_PREFIX, "RUNNING_LOG_MARKER_INVALID");
  add(Array.isArray(genesis?.allowedEventAuthorIds)
    && canonicalJson(genesis.allowedEventAuthorIds) === canonicalJson(RUNNING_LOG_ALLOWED_AUTHOR_IDS)
    && genesis.allowedEventAuthorIds.every((id) => AUTHOR_ID_PATTERN.test(id)),
  "RUNNING_LOG_AUTHOR_ALLOWLIST_INVALID");
  add(canonicalJson(genesis?.evidenceEffect) === canonicalJson(RUNNING_LOG_EVIDENCE_EFFECT),
    "RUNNING_LOG_EFFECT_INVALID");
  add(SHA256_PATTERN.test(genesis?.genesisPayloadSha256 ?? "")
    && genesis.genesisPayloadSha256 === computeRunningLogGenesisPayloadSha256(genesis),
  "RUNNING_LOG_GENESIS_PAYLOAD_DIGEST_INVALID");
  return [...new Set(findings)];
}

export function parseRunningLogEventAppend({ appendBytes, previousEntry, parentRevision, allowedAuthorIds, maximumAppendBytes }) {
  const findings = [];
  if (!Buffer.isBuffer(appendBytes) || appendBytes.length === 0 || appendBytes.length > maximumAppendBytes) {
    return { event: null, findings: ["RUNNING_LOG_APPEND_SIZE_INVALID"] };
  }
  if (appendBytes.includes(0)) findings.push("RUNNING_LOG_APPEND_NUL_INVALID");
  const text = strictUtf8(appendBytes);
  if (text === null) return { event: null, findings: [...findings, "RUNNING_LOG_APPEND_UTF8_INVALID"] };
  findings.push(...privateTextFindings(text).map((code) => `RUNNING_LOG_APPEND_PRIVACY_${code}`));
  const newline = text.indexOf("\n");
  if (newline < 0) return { event: null, findings: [...findings, "RUNNING_LOG_EVENT_MARKER_INVALID"] };
  const marker = text.slice(0, newline);
  if (!marker.startsWith(RUNNING_LOG_EVENT_PREFIX) || !marker.endsWith(RUNNING_LOG_EVENT_SUFFIX)) {
    return { event: null, findings: [...findings, "RUNNING_LOG_EVENT_MARKER_INVALID"] };
  }
  const jsonSource = marker.slice(RUNNING_LOG_EVENT_PREFIX.length, -RUNNING_LOG_EVENT_SUFFIX.length);
  let event;
  try {
    event = parseJsonWithoutDuplicateKeys(jsonSource, "running-log event marker");
  } catch {
    return { event: null, findings: [...findings, "RUNNING_LOG_EVENT_JSON_INVALID"] };
  }
  if (jsonSource !== canonicalJson(event)) findings.push("RUNNING_LOG_EVENT_NOT_CANONICAL");
  if (!hasExactKeys(event, RUNNING_LOG_EVENT_KEYS)) findings.push("RUNNING_LOG_EVENT_SCHEMA_INVALID");
  if (event?.schemaVersion !== "1.0.0") findings.push("RUNNING_LOG_EVENT_VERSION_INVALID");
  if (!EVENT_ID_PATTERN.test(event?.eventId ?? "")) findings.push("RUNNING_LOG_EVENT_ID_INVALID");
  if (!RUNNING_LOG_EVENT_TYPES.includes(event?.eventType)) findings.push("RUNNING_LOG_EVENT_TYPE_INVALID");
  if (!IST_TIMESTAMP_PATTERN.test(event?.recordedAt ?? "")) findings.push("RUNNING_LOG_EVENT_TIME_INVALID");
  if (event?.parentRevision !== parentRevision || !FULL_COMMIT_PATTERN.test(event?.parentRevision ?? "")) {
    findings.push("RUNNING_LOG_EVENT_PARENT_INVALID");
  }
  if (event?.previousByteLength !== previousEntry?.byteLength
    || event?.previousSha256 !== previousEntry?.sha256) findings.push("RUNNING_LOG_EVENT_PREFIX_BINDING_INVALID");
  if (!EVIDENCE_REFERENCE_PATTERN.test(event?.evidenceReference ?? "")) {
    findings.push("RUNNING_LOG_EVENT_EVIDENCE_REFERENCE_INVALID");
  }
  if (!Array.isArray(allowedAuthorIds) || !allowedAuthorIds.includes(event?.authorId)) {
    findings.push("RUNNING_LOG_EVENT_AUTHOR_INVALID");
  }
  const bodyBytes = appendBytes.subarray(Buffer.byteLength(`${marker}\n`, "utf8"));
  const body = strictUtf8(bodyBytes);
  if (!body || !body.startsWith("## ") || !body.endsWith("\n")) findings.push("RUNNING_LOG_EVENT_BODY_INVALID");
  if (!SHA256_PATTERN.test(event?.bodySha256 ?? "") || event?.bodySha256 !== sha256(bodyBytes)) {
    findings.push("RUNNING_LOG_EVENT_BODY_DIGEST_INVALID");
  }
  const bodyTime = body?.match(/^## (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) IST(?:\s|—|-)/)?.slice(1, 3);
  if (!bodyTime || `${bodyTime[0]}T${bodyTime[1]}` !== event?.recordedAt?.slice(0, 16)) {
    findings.push("RUNNING_LOG_EVENT_BODY_TIME_INVALID");
  }
  return { event, findings: [...new Set(findings)] };
}

export function verifyRunningLogTrust({
  repoRoot,
  genesis,
  currentRevision = "HEAD",
  verifyWorktree = true,
  reviewerRecords = null,
  verifyGenesisRecord = true,
}) {
  const findings = runningLogGenesisFindings(genesis);
  if (findings.length > 0) return { ok: false, findings, appendedCommitCount: 0, eventIds: [] };
  if (reviewerRecords !== null) {
    const reviewerById = new Map(reviewerRecords.map((entry) => [entry?.reviewerId, entry]));
    const roleById = new Map([
      ["codex-primary-integrator-01", "implementation"],
      ["codex-project-manager-01", "project"],
    ]);
    if (RUNNING_LOG_ALLOWED_AUTHOR_IDS.some((id) => reviewerById.get(id)?.active !== true
      || reviewerById.get(id)?.role !== roleById.get(id))) {
      findings.push("RUNNING_LOG_AUTHOR_REGISTRY_BINDING_INVALID");
    }
  }
  if (verifyGenesisRecord) {
    try {
      const absoluteGenesisPath = path.join(repoRoot, RUNNING_LOG_GENESIS_PATH);
      const genesisRaw = fs.readFileSync(absoluteGenesisPath);
      const genesisHistory = verifyImmutableAddOnlyFileHistory({
        repoRoot,
        filePath: RUNNING_LOG_GENESIS_PATH,
        absentRevision: genesis.baseRevision,
        currentRevision,
        expectedSha256: sha256(genesisRaw),
      });
      findings.push(...genesisHistory.findings.map((code) => `RUNNING_LOG_GENESIS_HISTORY_${code}`));
      const stats = fs.lstatSync(absoluteGenesisPath);
      const current = resolveRevision(repoRoot, currentRevision);
      const committed = current ? gitEntryAtRevision(repoRoot, current, RUNNING_LOG_GENESIS_PATH) : null;
      if (!stats.isFile() || stats.isSymbolicLink() || (stats.mode & 0o777).toString(8) !== "644"
        || !committed || committed.sha256 !== sha256(genesisRaw)) {
        findings.push("RUNNING_LOG_GENESIS_WORKTREE_BINDING_INVALID");
      }
    } catch {
      findings.push("RUNNING_LOG_GENESIS_WORKTREE_BINDING_INVALID");
    }
  }
  for (const [label, revision] of [["BASE", genesis.baseRevision], ["CURRENT", currentRevision]]) {
    const resolved = resolveRevision(repoRoot, revision);
    const entry = resolved ? gitEntryAtRevision(repoRoot, resolved, RUNNING_LOG_PATH) : null;
    if (!entry || entry.bytes.includes(0) || strictUtf8(entry.bytes) === null) {
      findings.push(`RUNNING_LOG_${label}_TEXT_INVALID`);
      continue;
    }
    findings.push(...privateTextFindings(strictUtf8(entry.bytes))
      .map((code) => `RUNNING_LOG_${label}_PRIVACY_${code}`));
  }
  const eventIds = new Set();
  const history = verifyPrefixOnlyFileHistory({
    repoRoot,
    filePath: RUNNING_LOG_PATH,
    genesisRevision: genesis.baseRevision,
    currentRevision,
    genesisSha256: genesis.baseSha256,
    genesisByteLength: genesis.baseByteLength,
    expectedMode: genesis.requiredGitMode,
    expectedType: genesis.requiredGitType,
    maxTotalBytes: genesis.maximumTotalBytes,
    validateAppend: ({ appendBytes, previousEntry, parentRevision }) => {
      const result = parseRunningLogEventAppend({
        appendBytes,
        previousEntry,
        parentRevision,
        allowedAuthorIds: genesis.allowedEventAuthorIds,
        maximumAppendBytes: genesis.maximumAppendBytes,
      });
      const localFindings = [...result.findings];
      if (result.event && eventIds.has(result.event.eventId)) localFindings.push("RUNNING_LOG_EVENT_ID_REUSED");
      if (result.event) eventIds.add(result.event.eventId);
      return localFindings;
    },
  });
  findings.push(...history.findings);

  if (verifyWorktree) {
    const absolutePath = path.join(repoRoot, RUNNING_LOG_PATH);
    let stats;
    try {
      stats = fs.lstatSync(absolutePath);
      const worktreeBytes = fs.readFileSync(absolutePath);
      const committed = resolveRevision(repoRoot, currentRevision);
      const committedEntry = committed ? gitEntryAtRevision(repoRoot, committed, RUNNING_LOG_PATH) : null;
      if (!stats.isFile() || stats.isSymbolicLink() || (stats.mode & 0o777).toString(8) !== "644") {
        findings.push("RUNNING_LOG_WORKTREE_MODE_TYPE_INVALID");
      }
      if (!committedEntry || committedEntry.sha256 !== sha256(worktreeBytes)) {
        findings.push("RUNNING_LOG_WORKTREE_NOT_COMMITTED");
      }
    } catch {
      findings.push("RUNNING_LOG_WORKTREE_INVALID");
    }
  }
  return {
    ok: findings.length === 0,
    findings: [...new Set(findings)],
    appendedCommitCount: history.appendedCommitCount,
    eventIds: [...eventIds],
    evidenceEffect: runningLogEvidenceEffect(),
  };
}

function main() {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const genesisSource = fs.readFileSync(path.join(repoRoot, RUNNING_LOG_GENESIS_PATH), "utf8");
  const genesis = parseJsonWithoutDuplicateKeys(genesisSource, RUNNING_LOG_GENESIS_PATH);
  const reviewerRegistry = parseJsonWithoutDuplicateKeys(
    fs.readFileSync(path.join(repoRoot, "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json"), "utf8"),
    "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json",
  );
  const result = verifyRunningLogTrust({ repoRoot, genesis, reviewerRecords: reviewerRegistry.reviewers });
  console.log(JSON.stringify({
    suite: "P0 append-only running-log trust",
    passed: result.ok,
    namedChecks: {
      genesis: sha256(canonicalJson(runningLogGenesisFindings(genesis))),
      committedHistory: sha256(canonicalJson(result.findings)),
      evidenceOnlyEffect: sha256(canonicalJson(result.evidenceEffect)),
    },
    appendedCommitCount: result.appendedCommitCount,
    findingCount: result.findings.length,
    findings: result.findings,
    evidenceEffect: result.evidenceEffect,
  }, null, 2));
  if (!result.ok) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
