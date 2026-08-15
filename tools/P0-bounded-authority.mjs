#!/usr/bin/env node

import { lstatSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hasExactKeys, publicTextBytesAreSafe } from "./P0-content-safety.mjs";

const MODULE_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DECISION_PATH = "docs/council/execution/P0-PHASE1-EXECUTION-DECISIONS.md";

export const BOUNDED_AUTHORITY_TASK_IDS = Object.freeze([
  "AUD-001",
  "PC-001",
  "PRD-R0-001",
  "SPK-R0-001",
  "UX-R0-001",
  "ARCH-R0-001",
  "ENG-R0-001",
  "REL-R0-001",
]);

export const BOUNDED_AUTHORITY_SUBSTANTIVE_TASK_IDS = Object.freeze([
  "SPK-R0-001",
  "UX-R0-001",
  "ARCH-R0-001",
  "ENG-R0-001",
  "REL-R0-001",
]);

export const BOUNDED_AUTHORITY_SOURCE_PATHS = Object.freeze([
  "AGENTS.md",
  "README.md",
  "docs/INDEX.md",
  "docs/council/PHASE1-COUNCIL-DECISION-RECORD.md",
  "docs/council/PRODUCT-COUNCIL-CHARTER.md",
  "docs/council/PRODUCT-COUNCIL.md",
  "docs/council/agents/P0-QA-LEAD.md",
  "docs/council/execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md",
  "docs/council/execution/P0-PHASE1-EXECUTION-COUNCIL-CHARTER.md",
  "docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md",
  DECISION_PATH,
  "docs/council/execution/releases/P0-P0-R0-STAGE0-STATE-CONTRACT.md",
  "docs/product/PRODUCT-REQUIREMENTS.md",
  "docs/project/PHASE1-GITHUB-PROJECT-SYNC.md",
  "docs/project/PHASE1-RELEASE-PLAN.md",
  "docs/project/PROJECT-TRACKER.md",
  "tools/generate_phase1_roadmap_manifest.mjs",
]);

const BROAD_CURRENT_AUTHORITY_PATTERNS = Object.freeze([
  /routine\s+R0[–-]R8\s+(?:decisions?|promotion).*delegat/iu,
  /delegates?\s+routine\s+R0[–-]R8/iu,
  /Scoped\s+R0[–-]R8\s+deployment/iu,
  /Active\s+for\s+P0\s+and\s+R0[–-]R9\s+execution/iu,
  /\*\*Scope:\*\*\s+P0\s+and\s+R0[–-]R9/iu,
]);

const POSITIVE_CURRENT_AUTHORITY_PATTERNS = Object.freeze([
  /\bcurrent\s+(?:execution\s+)?authorit(?:y|ization)\s+(?:permits?|allows?|authorizes?|includes?|reaches|grants?)\s+(?:all\s+)?(?:R0(?:\s+(?:actions?|work|execution|implementation))?|private(?:-system|\s+host)?\s+(?:access|reads?)|deployment|authentic-content\s+admission|acceptance|release|production)/iu,
  /\b(?:R0\s+(?:actions?|work|execution|implementation)|private(?:-system|\s+host)?\s+(?:access|reads?)|deployment|authentic-content\s+admission|acceptance|release|production)\s+(?:is|are)\s+(?:now|currently|presently)\s+(?:authorized|permitted|allowed)\b/iu,
  /\b(?:the\s+)?(?:active|current)\s+(?:bounded\s+)?Goal\s+(?:permits?|allows?|authorizes?|grants?)\s+(?:all\s+)?(?:R0(?:\s+(?:actions?|work|execution|implementation))?|private(?:-system|\s+host)?\s+(?:access|reads?)|deployment|authentic-content\s+admission|acceptance|release|production)/iu,
]);

const DECISION_CURRENT_STAGE0_CLAUSE =
  "Its current authorization reaches only the one-time local/public Stage 0 control repair.";
const BOUNDED_AUTHORITY_SUBSTANTIVE_TASK_LIST =
  `${BOUNDED_AUTHORITY_SUBSTANTIVE_TASK_IDS.slice(0, -1).map((taskId) => `\`${taskId}\``).join(", ")}, or \`${BOUNDED_AUTHORITY_SUBSTANTIVE_TASK_IDS.at(-1)}\``;
const DECISION_LATER_GATE_CLAUSE =
  `After Stage 0 closes, the five-seat council may authorize one of the five substantive R0 tasks (${BOUNDED_AUTHORITY_SUBSTANTIVE_TASK_LIST}) only through its separate exact Gate A and Gate B controls.`;
const DECISION_OWNER_REACTIVATION_CLAUSE =
  "Any broader execution requires a new direct Product Owner activation.";
const DECISION_NO_PRESENT_AUTHORITY_CLAUSE =
  "Nothing in this decision presently authorizes R0 implementation, private-system access, deployment, authentic-content admission, acceptance, release, or production; every named human-only act retains its separate authority gate.";

const FORBIDDEN_PRESENT_AUTHORITY_TERMS =
  /(?:R0\s+implementation|private-system\s+access|deployment|authentic-content\s+admission|acceptance|release|production)/iu;
const AUTHORITY_CLAIM_TERMS = /(?:authoriz|permit|authority)/iu;
const AUTHORITY_NEGATION_TERMS =
  /(?:\bno\b|\bnot\b|\bnothing\b|\bnever\b|\bcannot\b|\bprohibit|\bblocked\b|\bretain(?:s|ed)?\b|\brequires?\b|\bonly\s+through\b)/iu;

function sourceTextIsSafe(value) {
  return typeof value === "string"
    && value.length > 0
    && publicTextBytesAreSafe(Buffer.from(value, "utf8"));
}

function normalizedProse(value) {
  return value.replace(/\s+/gu, " ").trim();
}

function hasPositiveForbiddenAuthorityClaim(value) {
  return value
    .split(/(?<=[.!?;])\s+|\n+/u)
    .map((part) => part.trim())
    .filter(Boolean)
    .some((part) => FORBIDDEN_PRESENT_AUTHORITY_TERMS.test(part)
      && AUTHORITY_CLAIM_TERMS.test(part)
      && !AUTHORITY_NEGATION_TERMS.test(part));
}

export function validateBoundedAuthoritySources(sourceByPath) {
  const findings = [];
  if (!hasExactKeys(sourceByPath, BOUNDED_AUTHORITY_SOURCE_PATHS)) {
    return Object.freeze({
      ok: false,
      findings: Object.freeze(["BOUNDED_AUTHORITY_SOURCE_SET_INVALID"]),
    });
  }

  for (const filePath of BOUNDED_AUTHORITY_SOURCE_PATHS) {
    const source = sourceByPath[filePath];
    if (!sourceTextIsSafe(source)) {
      findings.push(`BOUNDED_AUTHORITY_SOURCE_INVALID:${filePath}`);
      continue;
    }
    if (!/R1[–-]R10/iu.test(source)
      || !/(?:frozen|out of scope|unavailable|prohibited)/iu.test(source)) {
      findings.push(`BOUNDED_AUTHORITY_FREEZE_MISSING:${filePath}`);
    }
    if (filePath !== DECISION_PATH
      && BROAD_CURRENT_AUTHORITY_PATTERNS.some((pattern) => pattern.test(source))) {
      findings.push(`BOUNDED_AUTHORITY_BROAD_DELEGATION:${filePath}`);
    }
    if (POSITIVE_CURRENT_AUTHORITY_PATTERNS.some((pattern) => pattern.test(source))) {
      findings.push(`BOUNDED_AUTHORITY_PRESENT_AUTHORITY_CLAIM:${filePath}`);
    }
  }

  const decisions = sourceByPath?.[DECISION_PATH] ?? "";
  const decisionRows = decisions.match(/\| `P0-ED-016` \|/gu) ?? [];
  const decisionSections = decisions.match(/^### P0-ED-016\b/gmu) ?? [];
  const decisionStart = decisions.search(/^### P0-ED-016\b/mu);
  const decisionRemainder = decisionStart >= 0 ? decisions.slice(decisionStart) : "";
  const nextSection = /\n##(?!#)(?: |$)/u.exec(decisionRemainder);
  const decisionText = nextSection !== null
    ? decisionRemainder.slice(0, nextSection.index)
    : decisionRemainder;
  const normalizedDecisionText = normalizedProse(decisionText);
  if (decisionRows.length !== 1
    || decisionSections.length !== 1
    || !/supersed/iu.test(decisionText)
    || !/R0\s+only/iu.test(decisionText)
    || !/R1[–-]R10/iu.test(decisionText)
    || !/(?:frozen|out of scope|unavailable|prohibited)/iu.test(decisionText)
    || !/\b50\b/u.test(decisionText)
    || !/\b300\b/u.test(decisionText)
    || !BOUNDED_AUTHORITY_TASK_IDS.every((taskId) => decisionText.includes(`\`${taskId}\``))
    || !normalizedDecisionText.includes(DECISION_CURRENT_STAGE0_CLAUSE)
    || !normalizedDecisionText.includes(DECISION_LATER_GATE_CLAUSE)
    || !normalizedDecisionText.includes(DECISION_OWNER_REACTIVATION_CLAUSE)
    || !normalizedDecisionText.includes(DECISION_NO_PRESENT_AUTHORITY_CLAUSE)
    || BROAD_CURRENT_AUTHORITY_PATTERNS.some((pattern) => pattern.test(decisionText))
    || hasPositiveForbiddenAuthorityClaim(decisionText)) {
    findings.push("BOUNDED_AUTHORITY_DECISION_016_INVALID");
  }

  return Object.freeze({ ok: findings.length === 0, findings: Object.freeze([...new Set(findings)]) });
}

export function loadBoundedAuthoritySources(repoRoot = MODULE_REPO_ROOT) {
  const sourceByPath = {};
  const findings = [];
  for (const filePath of BOUNDED_AUTHORITY_SOURCE_PATHS) {
    const absolutePath = path.join(repoRoot, filePath);
    try {
      const metadata = lstatSync(absolutePath);
      if (!metadata.isFile() || metadata.isSymbolicLink() || (metadata.mode & 0o111) !== 0) {
        findings.push(`BOUNDED_AUTHORITY_FILE_TYPE_INVALID:${filePath}`);
        continue;
      }
      sourceByPath[filePath] = readFileSync(absolutePath, "utf8");
    } catch {
      findings.push(`BOUNDED_AUTHORITY_FILE_UNREADABLE:${filePath}`);
    }
  }
  if (findings.length > 0) {
    return Object.freeze({ ok: false, findings: Object.freeze(findings), sourceByPath: Object.freeze(sourceByPath) });
  }
  const validation = validateBoundedAuthoritySources(sourceByPath);
  return Object.freeze({ ...validation, sourceByPath: Object.freeze(sourceByPath) });
}

function validFixture() {
  const sourceByPath = Object.fromEntries(BOUNDED_AUTHORITY_SOURCE_PATHS.map((filePath) => [
    filePath,
    "Current authority is R0 only under the active bounded Goal; R1-R10 remain frozen and out of scope.\n",
  ]));
  sourceByPath[DECISION_PATH] = [
    "| `P0-ED-016` | Bounded authority correction. | Accepted | P0/R0 |",
    "",
    "### P0-ED-016 — Bounded P0/R0 authority",
    "",
    `This decision supersedes broad execution authority. Authority is R0 only for exactly ${BOUNDED_AUTHORITY_TASK_IDS.map((taskId) => `\`${taskId}\``).join(", ")}; all 50 R1-R10 tasks and 300 artifacts remain frozen and out of scope.`,
    "",
    DECISION_CURRENT_STAGE0_CLAUSE,
    "",
    DECISION_LATER_GATE_CLAUSE,
    "",
    DECISION_OWNER_REACTIVATION_CLAUSE,
    "",
    DECISION_NO_PRESENT_AUTHORITY_CLAUSE,
    "",
  ].join("\n");
  return sourceByPath;
}

function selfTest() {
  let cases = 0;
  const expect = (condition, label) => {
    cases += 1;
    if (!condition) throw new Error(`P0_BOUNDED_AUTHORITY_SELF_TEST_FAILED:${label}`);
  };
  const valid = validFixture();
  expect(validateBoundedAuthoritySources(valid).ok, "valid bounded authority sources");

  const missing = { ...valid };
  delete missing[BOUNDED_AUTHORITY_SOURCE_PATHS[0]];
  expect(validateBoundedAuthoritySources(missing).findings.includes("BOUNDED_AUTHORITY_SOURCE_SET_INVALID"),
    "missing active source fails");

  const broad = { ...valid, [BOUNDED_AUTHORITY_SOURCE_PATHS[1]]:
    "Routine R0–R8 decisions are council-delegated. R1-R10 remain frozen.\n" };
  expect(validateBoundedAuthoritySources(broad).findings
    .some((finding) => finding.startsWith("BOUNDED_AUTHORITY_BROAD_DELEGATION:")),
  "broad current delegation fails");

  expect(BOUNDED_AUTHORITY_SOURCE_PATHS.every((filePath) => {
    const positive = {
      ...valid,
      [filePath]: `${valid[filePath]}\nCurrent authority permits deployment and production.\n`,
    };
    return validateBoundedAuthoritySources(positive).findings
      .includes(`BOUNDED_AUTHORITY_PRESENT_AUTHORITY_CLAIM:${filePath}`);
  }), "positive current authority fails in every active source");

  const positiveAuthoritySynonyms = Object.freeze([
    "Current authority permits all R0 actions.",
    "Current authority allows deployment and production.",
    "R0 execution is currently authorized.",
    "Private access is now authorized.",
    "The active Goal authorizes R0 work.",
    "Current execution authority grants private host reads.",
  ]);
  expect(positiveAuthoritySynonyms.every((claim) => {
    const positive = { ...valid, "README.md": `${valid["README.md"]}\n${claim}\n` };
    return validateBoundedAuthoritySources(positive).findings
      .includes("BOUNDED_AUTHORITY_PRESENT_AUTHORITY_CLAIM:README.md");
  }), "positive current authority synonyms fail");

  const noFreeze = { ...valid, [BOUNDED_AUTHORITY_SOURCE_PATHS[2]]: "Current R0 authority only.\n" };
  expect(validateBoundedAuthoritySources(noFreeze).findings
    .some((finding) => finding.startsWith("BOUNDED_AUTHORITY_FREEZE_MISSING:")),
  "missing frozen boundary fails");

  const oldDecision = { ...valid, [DECISION_PATH]:
    "Routine R0–R8 decisions were historically delegated. R1-R10 remain frozen.\n" };
  expect(validateBoundedAuthoritySources(oldDecision).findings.includes("BOUNDED_AUTHORITY_DECISION_016_INVALID"),
    "missing superseding decision fails");

  const narrowedDecision = { ...valid, [DECISION_PATH]: valid[DECISION_PATH].replaceAll("`REL-R0-001`", "`REL-R0-999`") };
  expect(validateBoundedAuthoritySources(narrowedDecision).findings.includes("BOUNDED_AUTHORITY_DECISION_016_INVALID"),
    "incomplete exact task envelope fails");

  const widenedCurrentAuthority = { ...valid, [DECISION_PATH]: valid[DECISION_PATH].replace(
    DECISION_CURRENT_STAGE0_CLAUSE,
    "Its current authorization reaches R0 implementation, private-system access, deployment, authentic-content admission, acceptance, release, and production.",
  ) };
  expect(validateBoundedAuthoritySources(widenedCurrentAuthority).findings.includes("BOUNDED_AUTHORITY_DECISION_016_INVALID"),
    "present substantive authority fails");

  const contradictoryCurrentAuthority = { ...valid, [DECISION_PATH]: `${valid[DECISION_PATH]}\nCurrent authority permits deployment and production.\n` };
  expect(validateBoundedAuthoritySources(contradictoryCurrentAuthority).findings.includes("BOUNDED_AUTHORITY_DECISION_016_INVALID"),
    "contradictory positive authority claim fails");

  const broadCurrentDecision = { ...valid, [DECISION_PATH]: `${valid[DECISION_PATH]}\nRoutine R0–R8 decisions are council-delegated.\n` };
  expect(validateBoundedAuthoritySources(broadCurrentDecision).findings.includes("BOUNDED_AUTHORITY_DECISION_016_INVALID"),
    "broad current delegation inside P0-ED-016 fails");

  const missingLaterGates = { ...valid, [DECISION_PATH]: valid[DECISION_PATH].replace(
    DECISION_LATER_GATE_CLAUSE,
    "After Stage 0 closes, the council may authorize the five substantive R0 tasks.",
  ) };
  expect(validateBoundedAuthoritySources(missingLaterGates).findings.includes("BOUNDED_AUTHORITY_DECISION_016_INVALID"),
    "missing later exact Gate A and Gate B boundary fails");

  const wrongLaterTaskSet = { ...valid, [DECISION_PATH]: valid[DECISION_PATH].replace(
    DECISION_LATER_GATE_CLAUSE,
    DECISION_LATER_GATE_CLAUSE.replace("`REL-R0-001`", "`REL-R0-999`"),
  ) };
  expect(validateBoundedAuthoritySources(wrongLaterTaskSet).findings.includes("BOUNDED_AUTHORITY_DECISION_016_INVALID"),
    "wrong later substantive task set fails");

  const missingOwnerReactivation = { ...valid, [DECISION_PATH]: valid[DECISION_PATH].replace(
    DECISION_OWNER_REACTIVATION_CLAUSE,
    "Broader execution may proceed after council review.",
  ) };
  expect(validateBoundedAuthoritySources(missingOwnerReactivation).findings.includes("BOUNDED_AUTHORITY_DECISION_016_INVALID"),
    "missing direct Product Owner reactivation fails");

  const missingNoPresentAuthority = { ...valid, [DECISION_PATH]: valid[DECISION_PATH].replace(
    DECISION_NO_PRESENT_AUTHORITY_CLAUSE,
    "Every named human-only act retains its separate authority gate.",
  ) };
  expect(validateBoundedAuthoritySources(missingNoPresentAuthority).findings.includes("BOUNDED_AUTHORITY_DECISION_016_INVALID"),
    "missing explicit no-present-authority boundary fails");

  return Object.freeze({
    ok: true,
    code: "P0_BOUNDED_AUTHORITY_SELF_TEST_OK",
    cases,
    sourceCount: BOUNDED_AUTHORITY_SOURCE_PATHS.length,
  });
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    process.stdout.write("Usage: node tools/P0-bounded-authority.mjs [--self-test|--help]\n");
    return;
  }
  if (args.length === 1 && args[0] === "--self-test") {
    process.stdout.write(`${JSON.stringify(selfTest())}\n`);
    return;
  }
  if (args.length !== 0) throw new Error("P0_BOUNDED_AUTHORITY_UNKNOWN_ARGUMENT");
  const result = loadBoundedAuthoritySources();
  process.stdout.write(`${JSON.stringify({
    passed: result.ok,
    findingCount: result.findings.length,
    sourceCount: BOUNDED_AUTHORITY_SOURCE_PATHS.length,
    decisionId: "P0-ED-016",
    findings: result.findings,
  }, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
