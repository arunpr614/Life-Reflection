import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

export const FULL_COMMIT_PATTERN = /^[0-9a-f]{40}$/;
export const SHA256_PATTERN = /^[0-9a-f]{64}$/;
export const REQUIRED_REGULAR_FILE_MODE = "100644";
export const REQUIRED_GIT_TYPE = "blob";

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isObject(value)) return value;
  return Object.fromEntries(Object.keys(value).sort()
    .filter((key) => value[key] !== undefined)
    .map((key) => [key, canonicalize(value[key])]));
}

export function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function hasExactKeys(value, expectedKeys) {
  if (!isObject(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

export function strictUtf8(bytes) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

const PRIVATE_TEXT_PATTERNS = Object.freeze([
  ["PRIVATE_LOCAL_PATH", /(?:^|[\s`'"(])(?:\/Users\/|\/home\/|[A-Za-z]:\\Users\\)/m],
  ["PRIVATE_KEY", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["AWS_ACCESS_KEY", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["GITHUB_TOKEN", /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/],
  ["SLACK_TOKEN", /\bxox[baprs]-[A-Za-z0-9-]{16,}\b/],
  ["BEARER_TOKEN", /\bBearer\s+[A-Za-z0-9._~+\/-]{20,}={0,2}\b/i],
  ["URL_USERINFO", /https?:\/\/[^\s/@:]+:[^\s/@]+@/i],
  ["PRIVATE_IPV4", /\b(?:10\.(?:\d{1,3}\.){2}\d{1,3}|192\.168\.(?:\d{1,3}\.)\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.(?:\d{1,3}\.)\d{1,3})\b/],
  ["PROJECT_NODE_ID", /\b(?:PVT|PVTI|PVTF|PVTSSF|PVTSF|PVTV)_[A-Za-z0-9_-]{8,}\b/],
]);

export function privateTextFindings(text) {
  if (typeof text !== "string") return ["TEXT_NOT_UTF8"];
  const findings = [];
  for (const [code, pattern] of PRIVATE_TEXT_PATTERNS) {
    if (pattern.test(text)) findings.push(code);
  }
  return findings;
}

function git(repoRoot, args, options = {}) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: options.encoding === undefined ? "utf8" : options.encoding,
    maxBuffer: options.maxBuffer ?? 64 * 1024 * 1024,
    stdio: options.stdio,
  });
}

export function resolveRevision(repoRoot, revision) {
  try {
    const resolved = git(repoRoot, ["rev-parse", "--verify", `${revision}^{commit}`]).trim();
    return FULL_COMMIT_PATTERN.test(resolved) ? resolved : null;
  } catch {
    return null;
  }
}

export function isAncestor(repoRoot, ancestor, descendant) {
  try {
    git(repoRoot, ["merge-base", "--is-ancestor", ancestor, descendant], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function gitEntryAtRevision(repoRoot, revision, filePath) {
  try {
    const row = git(repoRoot, ["ls-tree", revision, "--", filePath]).trim();
    const match = row.match(/^(\d+)\s+(\w+)\s+([0-9a-f]+)\t(.+)$/);
    if (!match || match[4] !== filePath) return null;
    const bytes = git(repoRoot, ["show", `${revision}:${filePath}`], { encoding: null });
    return {
      path: filePath,
      gitMode: match[1],
      gitType: match[2],
      gitObjectId: match[3],
      byteLength: bytes.length,
      sha256: sha256(bytes),
      bytes,
    };
  } catch {
    return null;
  }
}

function lineageCommits(repoRoot, baseRevision, currentRevision) {
  const output = git(repoRoot, ["rev-list", "--reverse", "--topo-order", `${baseRevision}..${currentRevision}`]);
  return output.split(/\r?\n/).filter(FULL_COMMIT_PATTERN.test.bind(FULL_COMMIT_PATTERN))
    .filter((revision) => isAncestor(repoRoot, baseRevision, revision));
}

function commitParents(repoRoot, revision) {
  return git(repoRoot, ["show", "-s", "--format=%P", revision]).trim()
    .split(/\s+/).filter(FULL_COMMIT_PATTERN.test.bind(FULL_COMMIT_PATTERN));
}

function lineageParents(repoRoot, revision, baseRevision) {
  return commitParents(repoRoot, revision)
    .filter((parent) => parent === baseRevision || isAncestor(repoRoot, baseRevision, parent));
}

/**
 * Prove that a path was absent at the reviewed candidate, was introduced once
 * later, and then retained with byte-for-byte identical regular-file content
 * along every committed descendant edge reachable from currentRevision.
 */
export function verifyImmutableAddOnlyFileHistory({
  repoRoot,
  filePath,
  absentRevision,
  currentRevision = "HEAD",
  expectedSha256 = null,
  expectedMode = REQUIRED_REGULAR_FILE_MODE,
  expectedType = REQUIRED_GIT_TYPE,
}) {
  const findings = [];
  const base = resolveRevision(repoRoot, absentRevision);
  const current = resolveRevision(repoRoot, currentRevision);
  if (!base || !current || !isAncestor(repoRoot, base, current)) {
    return { ok: false, findings: ["ADD_ONLY_REVISION_INVALID"], publicationRevision: null };
  }
  if (gitEntryAtRevision(repoRoot, base, filePath) !== null) {
    return { ok: false, findings: ["ADD_ONLY_PRESENT_AT_CANDIDATE"], publicationRevision: null };
  }

  const snapshots = new Map([[base, null]]);
  const introductions = [];
  for (const revision of lineageCommits(repoRoot, base, current)) {
    const entry = gitEntryAtRevision(repoRoot, revision, filePath);
    snapshots.set(revision, entry);
    if (entry && (entry.gitMode !== expectedMode || entry.gitType !== expectedType)) {
      findings.push("ADD_ONLY_PATH_TYPE_OR_MODE_INVALID");
    }
    const parentEntries = [];
    for (const parent of lineageParents(repoRoot, revision, base)) {
      const parentEntry = snapshots.has(parent)
        ? snapshots.get(parent)
        : gitEntryAtRevision(repoRoot, parent, filePath);
      parentEntries.push(parentEntry);
      if (parentEntry && !entry) findings.push("ADD_ONLY_HISTORY_DELETION");
      if (parentEntry && entry
        && (parentEntry.sha256 !== entry.sha256
          || parentEntry.gitMode !== entry.gitMode
          || parentEntry.gitType !== entry.gitType)) {
        findings.push("ADD_ONLY_HISTORY_REWRITE");
      }
    }
    if (entry && parentEntries.length > 0 && parentEntries.every((parentEntry) => parentEntry === null)) {
      introductions.push(revision);
    }
  }
  const uniqueIntroductions = [...new Set(introductions)];
  if (uniqueIntroductions.length !== 1) findings.push("ADD_ONLY_PUBLICATION_CARDINALITY_INVALID");
  const currentEntry = gitEntryAtRevision(repoRoot, current, filePath);
  if (!currentEntry) findings.push("ADD_ONLY_CURRENT_FILE_MISSING");
  if (expectedSha256 !== null && currentEntry?.sha256 !== expectedSha256) {
    findings.push("ADD_ONLY_CURRENT_DIGEST_INVALID");
  }
  return {
    ok: findings.length === 0,
    findings: [...new Set(findings)],
    publicationRevision: uniqueIntroductions.length === 1 ? uniqueIntroductions[0] : null,
    currentEntry: currentEntry ? { ...currentEntry, bytes: undefined } : null,
  };
}

/**
 * Prove prefix continuity at every descendant commit, not merely from the
 * genesis bytes to HEAD. This detects an edit followed by a later restoration.
 */
export function verifyPrefixOnlyFileHistory({
  repoRoot,
  filePath,
  genesisRevision,
  currentRevision = "HEAD",
  genesisSha256,
  genesisByteLength,
  expectedMode = REQUIRED_REGULAR_FILE_MODE,
  expectedType = REQUIRED_GIT_TYPE,
  maxTotalBytes,
  validateAppend = () => [],
}) {
  const findings = [];
  const genesis = resolveRevision(repoRoot, genesisRevision);
  const current = resolveRevision(repoRoot, currentRevision);
  if (!genesis || !current || !isAncestor(repoRoot, genesis, current)) {
    return { ok: false, findings: ["PREFIX_REVISION_INVALID"], appendedCommitCount: 0 };
  }
  const genesisEntry = gitEntryAtRevision(repoRoot, genesis, filePath);
  if (!genesisEntry || genesisEntry.gitMode !== expectedMode || genesisEntry.gitType !== expectedType
    || genesisEntry.sha256 !== genesisSha256 || genesisEntry.byteLength !== genesisByteLength) {
    return { ok: false, findings: ["PREFIX_GENESIS_BINDING_INVALID"], appendedCommitCount: 0 };
  }
  if (genesisEntry.byteLength > maxTotalBytes) findings.push("PREFIX_SIZE_LIMIT_EXCEEDED");

  const snapshots = new Map([[genesis, genesisEntry]]);
  const appendedCommits = new Set();
  for (const revision of lineageCommits(repoRoot, genesis, current)) {
    const entry = gitEntryAtRevision(repoRoot, revision, filePath);
    snapshots.set(revision, entry);
    if (!entry || entry.gitMode !== expectedMode || entry.gitType !== expectedType) {
      findings.push("PREFIX_PATH_TYPE_OR_MODE_INVALID");
      continue;
    }
    if (entry.byteLength > maxTotalBytes) findings.push("PREFIX_SIZE_LIMIT_EXCEEDED");
    const validPrefixParents = [];
    for (const parent of lineageParents(repoRoot, revision, genesis)) {
      const parentEntry = snapshots.get(parent) ?? gitEntryAtRevision(repoRoot, parent, filePath);
      if (!parentEntry || entry.byteLength < parentEntry.byteLength
        || !entry.bytes.subarray(0, parentEntry.byteLength).equals(parentEntry.bytes)) {
        findings.push("PREFIX_HISTORY_REWRITE");
        continue;
      }
      validPrefixParents.push({ parent, parentEntry });
    }
    // A merge may expose an append to a shorter parent even though that event
    // was already introduced on the longer parent. Validate provenance once,
    // against the longest inherited prefix, while still checking every edge.
    validPrefixParents.sort((left, right) => right.parentEntry.byteLength - left.parentEntry.byteLength
      || left.parent.localeCompare(right.parent));
    const inherited = validPrefixParents[0];
    if (inherited && entry.byteLength > inherited.parentEntry.byteLength) {
      appendedCommits.add(revision);
      const appendBytes = entry.bytes.subarray(inherited.parentEntry.byteLength);
      findings.push(...validateAppend({
        revision,
        parentRevision: inherited.parent,
        previousEntry: inherited.parentEntry,
        currentEntry: entry,
        appendBytes,
      }));
    }
  }
  return {
    ok: findings.length === 0,
    findings: [...new Set(findings)],
    appendedCommitCount: appendedCommits.size,
    currentEntry: (() => {
      const entry = gitEntryAtRevision(repoRoot, current, filePath);
      return entry ? { ...entry, bytes: undefined } : null;
    })(),
  };
}
