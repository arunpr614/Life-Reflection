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

const FORBIDDEN_AUTHORITY_SURFACE_SOURCE = String.raw`(?:` + [
  String.raw`(?:all\s+)?R0(?:\s+(?:actions?|work|execution|implementation))?`,
  String.raw`private(?:-system|\s+host)?\s+(?:access|reads?)`,
  String.raw`authentic(?:-|\s+)content\s+admission`,
  String.raw`deployments?`,
  String.raw`production(?:\s+(?:deployments?|rollouts?))?`,
  String.raw`releases?`,
  String.raw`acceptance`,
].join("|") + String.raw`)`;
const FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE =
  String.raw`(?:${FORBIDDEN_AUTHORITY_SURFACE_SOURCE})(?:\s+(?:and|or)\s+(?:${FORBIDDEN_AUTHORITY_SURFACE_SOURCE}))*`;
const AUTHORITY_ACTOR_SOURCE = String.raw`(?:` + [
  String.raw`we`,
  String.raw`(?:the\s+)?(?:product\s+)?owner`,
  String.raw`(?:the\s+)?council`,
  String.raw`(?:the\s+)?(?:active|current)\s+(?:bounded\s+)?Goal`,
  String.raw`current\s+(?:execution\s+)?authorit(?:y|ization)`,
].join("|") + String.raw`)`;
const DELEGATED_AUTHORITY_ACTOR_SOURCE =
  String.raw`(?:(?:the\s+)?council|(?:the\s+)?(?:product\s+)?owner)`;
const AUTHORITY_PERMISSION_NOUN_SOURCE = String.raw`(?:authority|authorization|permission|approval)`;
const AUTHORITY_POSITIVE_STATE_SOURCE =
  String.raw`(?:authorized|permitted|allowed|approved|cleared|greenlit|enabled)`;
const AUTHORITY_ACTION_SOURCE = String.raw`(?:` + [
  String.raw`proceed`,
  String.raw`start`,
  String.raw`begin`,
  String.raw`commence`,
  String.raw`continue`,
  String.raw`deploy`,
  String.raw`implement`,
  String.raw`execute`,
  String.raw`release`,
  String.raw`accept`,
  String.raw`admit`,
  String.raw`access`,
  String.raw`activate`,
  String.raw`roll\s*out`,
  String.raw`be\s+implemented`,
  String.raw`be\s+deployed`,
  String.raw`be\s+released`,
  String.raw`be\s+accepted`,
].join("|") + String.raw`)`;
const AUTHORITY_OPERATION_TARGET_SOURCE =
  String.raw`(?:${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}|deploy|roll\s*out)`;
const positiveAuthorityPattern = (source) => new RegExp(source, "giu");

// These are grammar families, not phrase signatures: each requires a forbidden
// surface or operation and an affirmative permission/start/deploy predicate.
const POSITIVE_CURRENT_AUTHORITY_PATTERNS = Object.freeze([
  positiveAuthorityPattern(String.raw`\b${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\s+(?:is|are|has\s+been|have\s+been|remains?|remain)\s+(?:(?:now|currently|presently|actively)\s+)?${AUTHORITY_POSITIVE_STATE_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\s+(?:(?:now|currently|presently)\s+)?${AUTHORITY_POSITIVE_STATE_SOURCE}\b(?=\s*(?:[.!?;]|$))`),
  positiveAuthorityPattern(String.raw`\b${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\s+(?:may|can)\s+(?:now\s+)?${AUTHORITY_ACTION_SOURCE}(?:\s+(?:now|immediately))?\b`),
  positiveAuthorityPattern(String.raw`\b${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\s+(?:has|have)\s+(?:(?:current|active)\s+)?${AUTHORITY_PERMISSION_NOUN_SOURCE}(?:\s+(?:to|for)\s+${AUTHORITY_ACTION_SOURCE})?\b`),
  positiveAuthorityPattern(String.raw`\b${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\s+(?:is|are)\s+free\s+to\s+${AUTHORITY_ACTION_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\s+(?:is|are)\s+granted\s+${AUTHORITY_PERMISSION_NOUN_SOURCE}(?:\s+(?:to|for)\s+${AUTHORITY_ACTION_SOURCE})?\b`),
  positiveAuthorityPattern(String.raw`\b${AUTHORITY_PERMISSION_NOUN_SOURCE}\s+(?:to|for)\s+${AUTHORITY_OPERATION_TARGET_SOURCE}\s+(?:is|are|has\s+been|have\s+been|remains?|remain)\s+(?:(?:now|currently|presently)\s+)?(?:active|granted|${AUTHORITY_POSITIVE_STATE_SOURCE})\b`),
  positiveAuthorityPattern(String.raw`\b${AUTHORITY_ACTOR_SOURCE}\s+(?:(?:now|currently|presently)\s+)?(?:authorizes?|authorized|permits?|permitted|allows?|allowed|approves?|approved|clears?|cleared|greenlights?|greenlit|covers?|covered|empowers?|empowered|enables?|enabled|grants?|granted|includes?|included|reaches|reached)\s+${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b${AUTHORITY_ACTOR_SOURCE}\s+(?:has|have)\s+(?:now\s+)?(?:authorized|permitted|allowed|approved|cleared|greenlit|empowered)\s+${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b${AUTHORITY_ACTOR_SOURCE}\s+(?:grants?|gives?|confers?)\s+(?:current\s+)?${AUTHORITY_PERMISSION_NOUN_SOURCE}\s+(?:to|for)\s+${AUTHORITY_OPERATION_TARGET_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b${AUTHORITY_ACTOR_SOURCE}\s+(?:has|have)\s+(?:current\s+)?${AUTHORITY_PERMISSION_NOUN_SOURCE}\s+(?:to|for)\s+${AUTHORITY_ACTION_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b${AUTHORITY_ACTOR_SOURCE}\s+(?:(?:is|are|has\s+been|have\s+been)\s+)?(?:authorized|permitted|allowed|approved|empowered|cleared|greenlit)\s+to\s+${AUTHORITY_ACTION_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b${AUTHORITY_ACTOR_SOURCE}\s+(?:may|can)\s+(?:now\s+)?(?:deploy|roll\s*out|release)\b`),
  positiveAuthorityPattern(String.raw`\b${AUTHORITY_ACTOR_SOURCE}\s+(?:may|can)\s+(?:now\s+)?(?:begin|start|commence|implement|proceed(?:\s+with)?)\s+${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b${AUTHORITY_ACTOR_SOURCE}\s+(?:(?:now|currently|presently)\s+)?(?:authorizes?|authorized|permits?|permitted|allows?|allowed|approves?|approved|clears?|cleared|empowers?|empowered|enables?|enabled)\s+${DELEGATED_AUTHORITY_ACTOR_SOURCE}\s+to\s+${AUTHORITY_ACTION_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b${AUTHORITY_PERMISSION_NOUN_SOURCE}\s+(?:now\s+)?(?:(?:has|have)\s+been\s+|(?:is|are)\s+)?(?:granted|given|issued|provided|available|exists?)\s+(?:to|for)\s+${AUTHORITY_OPERATION_TARGET_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\s+(?:is|are|remains?|remain)\s+(?:(?:now|currently|presently)\s+)?(?:ready\s+to\s+${AUTHORITY_ACTION_SOURCE}|open|unlocked)\b`),
  positiveAuthorityPattern(String.raw`\b${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\s+(?:has|have)\s+(?:the\s+)?go-ahead\b`),
  positiveAuthorityPattern(String.raw`\bno\s+(?:further|additional)\s+${AUTHORITY_PERMISSION_NOUN_SOURCE}\s+(?:is|are)\s+required\s+(?:to|for)\s+${AUTHORITY_OPERATION_TARGET_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\bnothing\s+(?:now\s+)?(?:prevents?|blocks?|prohibits?)\s+${AUTHORITY_OPERATION_TARGET_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b(?:the\s+)?(?:exact\s+)?Gate\s+B\s+(?:is|has\s+been)\s+(?:waived|deemed\s+satisfied)\s+(?:to|for)\s+${AUTHORITY_OPERATION_TARGET_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\s+(?:is|are)\s+exempt\s+from\s+(?:the\s+)?(?:exact\s+)?Gate\s+B\b`),
  positiveAuthorityPattern(String.raw`\b${AUTHORITY_ACTOR_SOURCE}\s+(?:is|are|has\s+been|have\s+been)\s+(?:now\s+)?${AUTHORITY_POSITIVE_STATE_SOURCE}\s+for\s+${FORBIDDEN_AUTHORITY_SURFACE_GROUP_SOURCE}\b`),
  positiveAuthorityPattern(String.raw`\b${AUTHORITY_ACTOR_SOURCE}\s+(?:may|can)\s+(?:now\s+)?access\s+(?:the\s+)?private(?:-system|\s+system|\s+host)\b`),
]);

const SAFE_HISTORICAL_AUTHORITY_CONTEXT =
  /^(?:\s|[-*>|]|\d+[.)])*(?:historically|previously|formerly)\b|\bunder\s+(?:an?\s+|the\s+)?(?:historical|prior|superseded|former)\s+(?:goal|plan|policy|authorization|authority)\b/iu;
const SAFE_CONDITIONAL_AUTHORITY_CONTEXT =
  /\b(?:if|once|when|after)\s+(?:the\s+)?exact\s+(?:stage\s+)?Gate\s+[AB]\s+(?:passes|has\s+passed|is\s+satisfied|has\s+been\s+satisfied|is\s+accepted|has\s+been\s+accepted)\b|\bonly\s+(?:if|after|once|when)\s+(?:the\s+)?exact\s+(?:stage\s+)?Gate\s+[AB]\s+(?:passes|has\s+passed|is\s+satisfied|has\s+been\s+satisfied|is\s+accepted|has\s+been\s+accepted)\b/iu;

const BOUNDED_AUTHORITY_ADVERSARIAL_CLAIMS = Object.freeze([
  "R0 implementation may proceed now.",
  "R0 implementation is authorized.",
  "We authorize R0 implementation and deployment.",
  "The council can deploy to production.",
  "Deployment and production are permitted.",
  "All R0 work has authority to proceed.",
  "Private-system access is allowed.",
  "R0 work may start immediately.",
  "Production may proceed now.",
  "Deployment may start immediately.",
  "Private-system access can begin.",
  "R0 execution can now proceed.",
  "The owner grants authority for deployment.",
  "The council has approved production deployment.",
  "R0 work is approved.",
  "R0 implementation has permission to start.",
  "Private host reads can start now.",
  "Authentic-content admission can proceed.",
  "Release may proceed immediately.",
  "Acceptance is now approved.",
  "We can begin R0 implementation.",
  "Production rollout has permission to begin.",
  "R0 implementation can proceed now.",
  "R0 implementation can start immediately.",
  "Private-system access may proceed.",
  "Production may now begin.",
  "The council may deploy to production.",
  "R0 implementation is approved.",
  "Deployment has been authorized.",
  "Private host reads have current authority.",
  "The owner grants deployment authority.",
  "The council has authority to deploy.",
  "The Product Owner has authorized deployment.",
  "Authorization for R0 implementation is active.",
  "Permission to deploy is granted.",
  "R0 implementation is cleared.",
  "R0 implementation is greenlit.",
  "R0 implementation is free to proceed.",
  "R0 implementation may commence.",
  "R0 implementation can be implemented now.",
  "Deployments authorized.",
  "Private host access has been authorized.",
  "Private host access remains authorized.",
  "The active Goal covers R0 implementation.",
  "The active Goal empowers R0 implementation.",
  "The council is authorized to deploy.",
  "The council is empowered to deploy.",
  "The council authorized to deploy.",
  "Current authority covers R0 implementation.",
  "The Product Owner empowered the council to deploy.",
  "The active Goal enables R0 execution.",
  "The Product Owner authorizes the council to implement.",
  "The owner allows the council to release.",
  "The active Goal enabled R0 work.",
  "The council permits the owner to deploy.",
  "The Product Owner cleared the council to implement.",
  "The active Goal empowers the council to deploy.",
  "The owner enables the council to execute.",
  "The council authorized the owner to release.",
  "Authority has been granted for deployment.",
  "Approval has been given for R0 implementation.",
  "Permission now exists to deploy.",
  "Production is ready to proceed.",
  "R0 work has the go-ahead.",
  "Private access is open.",
  "Private access is unlocked.",
  "No further approval is required for deployment.",
  "Nothing prevents deployment.",
  "Gate B is waived for deployment.",
  "Gate B is deemed satisfied for deployment.",
  "Deployment is exempt from Gate B.",
  "We are authorized for R0 implementation.",
  "We may access the private system.",
  "The Owner authorizes the council to deploy.",
  "The Owner empowers the council to deploy.",
  "The Owner permits the council to deploy.",
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

function sourceTextIsSafe(value) {
  return typeof value === "string"
    && value.length > 0
    && publicTextBytesAreSafe(Buffer.from(value, "utf8"));
}

function normalizedProse(value) {
  return value.replace(/\s+/gu, " ").trim();
}

function authorityClauses(value) {
  return value
    .split(/\n+|(?<=[.!?;])\s+|,\s+(?:and|or)\s+|(?:,\s*)?\b(?:but|however|yet|nevertheless|whereas)\b(?:,\s*)?/iu)
    .map((part) => part.trim())
    .filter(Boolean);
}

function matchHasBoundNegation(clause, match) {
  const prefix = clause.slice(0, match.index);
  return /(?:^|[\s([{:|])(?:no|not|never|neither|nor)(?:\s+even)?\s*$/iu.test(prefix);
}

function matchIsGenericReleaseRule(clause, match) {
  if (!/^releases?\b/iu.test(match[0])) return false;
  return /(?:^|[\s([{:|])(?:a|first)\s*$/iu.test(clause.slice(0, match.index));
}

function hasPositivePresentAuthorityClaim(value) {
  return authorityClauses(value).some((clause) => {
    if (SAFE_HISTORICAL_AUTHORITY_CONTEXT.test(clause)) return false;
    for (const pattern of POSITIVE_CURRENT_AUTHORITY_PATTERNS) {
      for (const match of clause.matchAll(pattern)) {
        if (matchHasBoundNegation(clause, match)) continue;
        if (matchIsGenericReleaseRule(clause, match)) continue;
        if (SAFE_CONDITIONAL_AUTHORITY_CONTEXT.test(clause)) continue;
        return true;
      }
    }
    return false;
  });
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
    if (hasPositivePresentAuthorityClaim(source)) {
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
    || hasPositivePresentAuthorityClaim(decisionText)) {
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

  for (const claim of BOUNDED_AUTHORITY_ADVERSARIAL_CLAIMS) {
    for (const filePath of BOUNDED_AUTHORITY_SOURCE_PATHS) {
      const positive = { ...valid, [filePath]: `${valid[filePath]}\n${claim}\n` };
      expect(validateBoundedAuthoritySources(positive).findings
        .includes(`BOUNDED_AUTHORITY_PRESENT_AUTHORITY_CLAIM:${filePath}`),
      `positive current authority claim fails in ${filePath}: ${claim}`);
    }
  }

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

  const safeAuthorityContexts = Object.freeze([
    "Historically, R0 implementation is authorized under the superseded plan.",
    "If exact Gate B passes, R0 implementation may proceed now.",
    "Deployment is authorized only if exact Gate B passes.",
    "R0 implementation may not proceed now.",
    "R0 implementation is not authorized.",
    "The owner does not grant authority for deployment.",
    "No production rollout has permission to begin.",
    "The council has not approved production deployment.",
    "Permission to deploy is not granted.",
    "The active Goal does not cover R0 implementation.",
    "The council may not deploy to production.",
    "Private host reads do not have current authority.",
    "The Product Owner did not empower the council to deploy.",
    "Historically, the Product Owner empowered the council to deploy.",
    "If exact Gate B passes, the Product Owner empowers the council to deploy.",
    "Authority has not been granted for deployment.",
    "Approval has not been given for R0 implementation.",
    "Permission does not exist to deploy.",
    "Production is not ready to proceed.",
    "R0 work has no go-ahead.",
    "Private access is closed.",
    "Further approval is required for deployment.",
    "Something prevents deployment.",
    "Gate B is not waived for deployment.",
    "Gate B has not been deemed satisfied for deployment.",
    "Deployment is not exempt from Gate B.",
    "We are not authorized for R0 implementation.",
    "We may not access the private system.",
    "Historically, authority has been granted for deployment.",
    "If exact Gate B passes, authority has been granted for deployment.",
  ]);
  for (const claim of safeAuthorityContexts) {
    for (const filePath of BOUNDED_AUTHORITY_SOURCE_PATHS) {
      const safe = { ...valid, [filePath]: `${valid[filePath]}\n${claim}\n` };
      expect(validateBoundedAuthoritySources(safe).ok,
        `historical, conditional, or negated authority remains safe in ${filePath}: ${claim}`);
    }
  }

  const siblingClauseShields = Object.freeze([
    "R0 implementation is not authorized, but deployment and production are permitted.",
    "If exact Gate B passes, R0 may proceed, and production is authorized now.",
    "If exact Gate B passes, R0 may proceed, and production is currently authorized.",
    "If exact Gate B passes, the Product Owner empowers the council to deploy, and the active Goal enables R0 execution.",
    "If exact Gate B passes, authority has been granted for deployment, and deployment is exempt from Gate B.",
    "Historically, authority has been granted for deployment, but no further approval is required for R0 implementation.",
    "Historically, R0 implementation was authorized, but production is currently authorized.",
  ]);
  for (const shield of siblingClauseShields) {
    for (const filePath of BOUNDED_AUTHORITY_SOURCE_PATHS) {
      const shielded = { ...valid, [filePath]: `${valid[filePath]}\n${shield}\n` };
      expect(validateBoundedAuthoritySources(shielded).findings
        .includes(`BOUNDED_AUTHORITY_PRESENT_AUTHORITY_CLAIM:${filePath}`),
      `safe context cannot shield a positive sibling clause in ${filePath}: ${shield}`);
    }
  }

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
