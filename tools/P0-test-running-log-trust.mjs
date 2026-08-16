import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  RUNNING_LOG_EVIDENCE_EFFECT,
  RUNNING_LOG_ALLOWED_AUTHOR_IDS,
  RUNNING_LOG_EVENT_PREFIX,
  buildRunningLogEventAppend,
  computeRunningLogGenesisPayloadSha256,
  parseRunningLogEventAppend,
  runningLogEvidenceEffect,
  runningLogGenesisFindings,
  verifyRunningLogTrust,
} from "./P0-running-log-trust.mjs";
import { canonicalJson, sha256 } from "./P0-append-only-trust.mjs";

const authorId = "codex-primary-integrator-01";
const groups = new Map();
function expect(group, condition, label) {
  assert.equal(condition, true, label);
  if (!groups.has(group)) groups.set(group, []);
  groups.get(group).push(label);
}

function git(repoRoot, args) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();
}

function commitAll(repoRoot, message) {
  git(repoRoot, ["add", "-A"]);
  git(repoRoot, ["commit", "-m", message]);
  return git(repoRoot, ["rev-parse", "HEAD"]);
}

function createRepo() {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "p0-running-log-trust-"));
  git(repoRoot, ["init", "-q"]);
  git(repoRoot, ["config", "user.name", "Synthetic QA"]);
  git(repoRoot, ["config", "user.email", "synthetic@example.invalid"]);
  const initial = Buffer.from("# Life in Days - Running Log\n\n## 2026-08-15 00:00 IST — Synthetic genesis\n\nFictional baseline.\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "RUNNING_LOG.md"), initial, { mode: 0o644 });
  const baseRevision = commitAll(repoRoot, "synthetic genesis");
  const genesis = {
    schemaVersion: "1.0.0",
    genesisId: "P0-RUNNING-LOG-TRUST-GENESIS",
    createdDate: "2026-08-15",
    logPath: "RUNNING_LOG.md",
    baseRevision,
    baseSha256: sha256(initial),
    baseByteLength: initial.length,
    requiredGitMode: "100644",
    requiredGitType: "blob",
    maximumTotalBytes: 1024 * 1024,
    maximumAppendBytes: 64 * 1024,
    eventMarkerPrefix: RUNNING_LOG_EVENT_PREFIX,
    allowedEventAuthorIds: [...RUNNING_LOG_ALLOWED_AUTHOR_IDS],
    evidenceEffect: { ...RUNNING_LOG_EVIDENCE_EFFECT },
    genesisPayloadSha256: null,
  };
  genesis.genesisPayloadSha256 = computeRunningLogGenesisPayloadSha256(genesis);
  return { repoRoot, baseRevision, genesis, initial };
}

function buildAppend({ repoRoot, eventId = "P0-SYNTHETIC-EVENT-001", eventType = "intent", body = null,
  parentRevision = null, author = authorId, evidenceReference = "local-evidence:synthetic-fixture", overrides = {} }) {
  const previous = fs.readFileSync(path.join(repoRoot, "RUNNING_LOG.md"));
  const parent = parentRevision ?? git(repoRoot, ["rev-parse", "HEAD"]);
  const eventBody = Buffer.from(body
    ?? "## 2026-08-15 12:34 IST — Synthetic append\n\nFictional, public-safe evidence only.\n", "utf8");
  const event = {
    schemaVersion: "1.0.0",
    eventId,
    eventType,
    recordedAt: "2026-08-15T12:34:00+05:30",
    parentRevision: parent,
    previousByteLength: previous.length,
    previousSha256: sha256(previous),
    evidenceReference,
    authorId: author,
    bodySha256: sha256(eventBody),
    ...overrides,
  };
  const marker = Buffer.from(`${RUNNING_LOG_EVENT_PREFIX}${canonicalJson(event)} -->\n`, "utf8");
  return { event, appendBytes: Buffer.concat([marker, eventBody]), previous };
}

{
  const { repoRoot, genesis } = createRepo();
  expect("genesis", runningLogGenesisFindings(genesis).length === 0, "valid genesis passes");
  const invalidGenesis = structuredClone(genesis);
  invalidGenesis.evidenceEffect.executionAllowed = true;
  invalidGenesis.genesisPayloadSha256 = computeRunningLogGenesisPayloadSha256(invalidGenesis);
  expect("genesis", runningLogGenesisFindings(invalidGenesis).includes("RUNNING_LOG_EFFECT_INVALID"),
    "authority-bearing genesis fails");
  expect("history", verifyRunningLogTrust({ repoRoot, genesis, verifyWorktree: false, verifyGenesisRecord: false }).ok,
    "unchanged genesis history passes");
  const reviewerRecords = [
    { reviewerId: "codex-primary-integrator-01", role: "implementation", active: true },
    { reviewerId: "codex-project-manager-01", role: "project", active: false },
  ];
  expect("genesis", verifyRunningLogTrust({
    repoRoot, genesis, verifyWorktree: false, reviewerRecords, verifyGenesisRecord: false,
  })
    .findings.includes("RUNNING_LOG_AUTHOR_REGISTRY_BINDING_INVALID"),
  "inactive provenance author fails registry binding");
}

{
  const { repoRoot, genesis } = createRepo();
  const genesisPath = path.join(repoRoot, "docs/council/execution/control-reviews");
  fs.mkdirSync(genesisPath, { recursive: true });
  fs.writeFileSync(path.join(repoRoot,
    "docs/council/execution/control-reviews/P0-RUNNING-LOG-TRUST-GENESIS.json"),
  `${JSON.stringify(genesis, null, 2)}\n`, { mode: 0o644 });
  commitAll(repoRoot, "publish running-log genesis");
  expect("genesis", verifyRunningLogTrust({ repoRoot, genesis }).ok,
    "running-log genesis absent at base and immutably published later passes");
  fs.appendFileSync(path.join(repoRoot,
    "docs/council/execution/control-reviews/P0-RUNNING-LOG-TRUST-GENESIS.json"), "\n");
  commitAll(repoRoot, "rewrite running-log genesis");
  expect("genesis", verifyRunningLogTrust({ repoRoot, genesis }).findings
    .includes("RUNNING_LOG_GENESIS_HISTORY_ADD_ONLY_HISTORY_REWRITE"),
  "running-log genesis rewrite fails even when semantic JSON is unchanged");
}

{
  const { repoRoot, genesis } = createRepo();
  const built = buildAppend({ repoRoot });
  fs.appendFileSync(path.join(repoRoot, "RUNNING_LOG.md"), built.appendBytes);
  commitAll(repoRoot, "valid synthetic append");
  const result = verifyRunningLogTrust({ repoRoot, genesis, verifyWorktree: false, verifyGenesisRecord: false });
  expect("history", result.ok && result.appendedCommitCount === 1, "valid canonical append passes history");
  expect("history", result.eventIds[0] === built.event.eventId, "event provenance is retained");
  expect("effects", canonicalJson(runningLogEvidenceEffect(Buffer.from("one")))
    === canonicalJson(runningLogEvidenceEffect(Buffer.from("different"))), "log bytes cannot alter evidence-only effect");
  expect("effects", runningLogEvidenceEffect().executionAllowed === false
    && Object.values(runningLogEvidenceEffect()).every((value) => value === false || value === "none"),
  "valid append cannot change contract dossier gates authority owner action status or permission");
}

{
  const { repoRoot, genesis } = createRepo();
  const primaryBranch = git(repoRoot, ["branch", "--show-current"]);
  git(repoRoot, ["checkout", "-q", "-b", "synthetic-append"]);
  const built = buildAppend({ repoRoot, eventId: "P0-SYNTHETIC-MERGE-EVENT" });
  fs.appendFileSync(path.join(repoRoot, "RUNNING_LOG.md"), built.appendBytes);
  commitAll(repoRoot, "branch append");
  git(repoRoot, ["checkout", "-q", primaryBranch]);
  fs.writeFileSync(path.join(repoRoot, "UNRELATED.md"), "synthetic unrelated branch work\n");
  commitAll(repoRoot, "unrelated main work");
  git(repoRoot, ["merge", "--no-ff", "-m", "merge synthetic append", "synthetic-append"]);
  const result = verifyRunningLogTrust({ repoRoot, genesis, verifyWorktree: false, verifyGenesisRecord: false });
  expect("history", result.ok && result.appendedCommitCount === 1
    && result.eventIds.length === 1, "merge inherits one append without duplicating provenance");
}

{
  const { repoRoot, genesis, initial } = createRepo();
  const edited = Buffer.from(initial);
  edited[edited.length - 3] = edited[edited.length - 3] === 97 ? 98 : 97;
  fs.writeFileSync(path.join(repoRoot, "RUNNING_LOG.md"), edited);
  commitAll(repoRoot, "malformed edit");
  fs.writeFileSync(path.join(repoRoot, "RUNNING_LOG.md"), initial);
  commitAll(repoRoot, "restore bytes");
  const result = verifyRunningLogTrust({ repoRoot, genesis, verifyWorktree: false, verifyGenesisRecord: false });
  expect("history", result.findings.includes("PREFIX_HISTORY_REWRITE"), "edit then restore is detected");
}

{
  const { repoRoot, genesis } = createRepo();
  fs.rmSync(path.join(repoRoot, "RUNNING_LOG.md"));
  commitAll(repoRoot, "delete log");
  expect("history", verifyRunningLogTrust({
    repoRoot, genesis, verifyWorktree: false, verifyGenesisRecord: false,
  }).findings
    .includes("PREFIX_PATH_TYPE_OR_MODE_INVALID"), "committed deletion fails closed");
}

{
  const { repoRoot, genesis } = createRepo();
  git(repoRoot, ["update-index", "--chmod=+x", "RUNNING_LOG.md"]);
  git(repoRoot, ["commit", "-m", "mode drift"]);
  expect("history", verifyRunningLogTrust({
    repoRoot, genesis, verifyWorktree: false, verifyGenesisRecord: false,
  }).findings
    .includes("PREFIX_PATH_TYPE_OR_MODE_INVALID"), "mode drift fails closed");
}

{
  const { repoRoot, genesis } = createRepo();
  const valid = buildAppend({ repoRoot });
  const previousEntry = { byteLength: valid.previous.length, sha256: sha256(valid.previous) };
  const parse = (appendBytes, parentRevision = valid.event.parentRevision) => parseRunningLogEventAppend({
    appendBytes,
    previousEntry,
    parentRevision,
    allowedAuthorIds: genesis.allowedEventAuthorIds,
    maximumAppendBytes: genesis.maximumAppendBytes,
  }).findings;
  expect("event", parse(valid.appendBytes).length === 0, "valid event marker passes");
  const builtByApi = buildRunningLogEventAppend({
    eventId: valid.event.eventId,
    eventType: valid.event.eventType,
    recordedAt: valid.event.recordedAt,
    parentRevision: valid.event.parentRevision,
    previousBytes: valid.previous,
    evidenceReference: valid.event.evidenceReference,
    authorId: valid.event.authorId,
    body: valid.appendBytes.subarray(valid.appendBytes.indexOf(0x0a) + 1),
  });
  expect("event", parse(builtByApi.appendBytes).length === 0, "canonical append builder emits valid provenance");
  expect("event", parse(Buffer.from([0xff, 0xfe])).includes("RUNNING_LOG_APPEND_UTF8_INVALID"),
    "invalid UTF-8 fails");
  expect("event", parse(Buffer.from("not a marker\nbody\n")).includes("RUNNING_LOG_EVENT_MARKER_INVALID"),
    "missing marker fails");
  const privatePathCanary = ["/", "Users", "/example/private.txt"].join("");
  const privateAppend = buildAppend({ repoRoot, body: `## 2026-08-15 12:34 IST — Unsafe\n\n${privatePathCanary}\n` });
  expect("privacy", parse(privateAppend.appendBytes).includes("RUNNING_LOG_APPEND_PRIVACY_PRIVATE_LOCAL_PATH"),
    "local absolute path fails privacy scan");
  const privateKeyCanary = ["-----BEGIN ", "PRIVATE", " KEY-----"].join("");
  const keyAppend = buildAppend({ repoRoot, body: `## 2026-08-15 12:34 IST — Unsafe\n\n${privateKeyCanary}\n` });
  expect("privacy", parse(keyAppend.appendBytes).includes("RUNNING_LOG_APPEND_PRIVACY_PRIVATE_KEY"),
    "private-key material fails privacy scan");
  const wrongParent = buildAppend({ repoRoot, overrides: { parentRevision: "f".repeat(40) } });
  expect("event", parse(wrongParent.appendBytes).includes("RUNNING_LOG_EVENT_PARENT_INVALID"),
    "wrong parent provenance fails");
  const wrongPrefix = buildAppend({ repoRoot, overrides: { previousByteLength: 1 } });
  expect("event", parse(wrongPrefix.appendBytes).includes("RUNNING_LOG_EVENT_PREFIX_BINDING_INVALID"),
    "wrong prior-byte binding fails");
  const wrongAuthor = buildAppend({ repoRoot, author: "codex-unregistered-01" });
  expect("event", parse(wrongAuthor.appendBytes).includes("RUNNING_LOG_EVENT_AUTHOR_INVALID"),
    "unregistered author fails");
  const wrongDigest = buildAppend({ repoRoot, overrides: { bodySha256: "0".repeat(64) } });
  expect("event", parse(wrongDigest.appendBytes).includes("RUNNING_LOG_EVENT_BODY_DIGEST_INVALID"),
    "wrong body digest fails");
}

const namedChecks = Object.fromEntries([...groups].sort(([left], [right]) => left.localeCompare(right))
  .map(([group, labels]) => [group, `sha256:${crypto.createHash("sha256").update(canonicalJson(labels)).digest("hex")}`]));
console.log(JSON.stringify({
  suite: "P0 append-only running-log trust fixtures",
  fixtureClass: "fictional/synthetic only",
  namedChecks,
  failed: 0,
}, null, 2));
