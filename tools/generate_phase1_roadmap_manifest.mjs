import fs from "node:fs";
import path from "node:path";
import { parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";

const repoRoot = path.resolve(import.meta.dirname, "..");
const repoUrl = "https://github.com/arunpr614/Life-Reflection";
const generatedAt = "2026-08-15";
const executionGovernance = {
  contextDigest: "docs/council/execution/P0-PHASE1-CONTEXT-DIGEST.md",
  councilCharter: "docs/council/execution/P0-PHASE1-EXECUTION-COUNCIL-CHARTER.md",
  authorization: "docs/council/execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md",
  decisions: "docs/council/execution/P0-PHASE1-EXECUTION-DECISIONS.md",
  ownerActionLedger: "docs/council/execution/P0-OWNER-ACTION-LEDGER.md",
  qaCharter: "docs/council/agents/P0-QA-LEAD.md",
  p0Review: "docs/council/execution/releases/P0-P0-EXECUTION-CONTROL-REVIEW.md",
  taskState: "docs/project/P0-PHASE1-TASK-STATE.json",
  taskReadinessState: "docs/project/P0-PHASE1-TASK-READINESS-STATE.json",
  taskDefinitionOfReady: "docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md",
  taskArtifactRegister: "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json",
  reviewerRegistry: "docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json",
  approvalRegistry: "docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json",
  ownerActionState: "docs/council/execution/P0-OWNER-ACTION-STATE.json",
};
const taskState = JSON.parse(
  fs.readFileSync(path.join(repoRoot, executionGovernance.taskState), "utf8"),
);
const allowedStatuses = new Set(["Backlog", "Next", "In progress", "Done"]);
if (!allowedStatuses.has(taskState.defaultStatus)) {
  throw new Error(`Invalid default task status: ${taskState.defaultStatus}`);
}
for (const [taskId, status] of Object.entries(taskState.statusOverrides ?? {})) {
  if (!allowedStatuses.has(status)) throw new Error(`${taskId}: invalid task status ${status}`);
}
const issueMapPath = path.join(repoRoot, "docs/project/PHASE1-GITHUB-ISSUES.json");
let issueMap = {};
if (fs.existsSync(issueMapPath)) {
  issueMap = parseJsonWithoutDuplicateKeys(
    fs.readFileSync(issueMapPath, "utf8"),
    "docs/project/PHASE1-GITHUB-ISSUES.json",
  ).issues ?? {};
}
const taskArtifactRegister = JSON.parse(
  fs.readFileSync(path.join(repoRoot, executionGovernance.taskArtifactRegister), "utf8"),
);
const taskDossierById = Object.fromEntries(
  taskArtifactRegister.tasks.map((record) => [record.taskId, record]),
);

const releases = [
  {
    id: "P0",
    name: "Council Planning Baseline",
    startDate: "2026-08-14",
    targetDate: "2026-08-16",
    outcome: "A source-grounded, reviewable Product Council package and one canonical delivery manifest.",
    exitEvidence: "Council reviews, source hashes, requirement coverage, workbook, and GitHub roadmap agree.",
    dependency: "None",
  },
  {
    id: "R0",
    name: "Shared-Host Private Foundation",
    startDate: "2026-08-17",
    targetDate: "2026-08-28",
    outcome: "A synthetic-only private shell can coexist with current services, recover, upgrade, and roll back.",
    exitEvidence: "Owner access/denial, sanitized capacity and non-regression evidence, encrypted synthetic restore, and rollback proof.",
    dependency: "P0 accepted",
  },
  {
    id: "R1",
    name: "Manual Journal Archive",
    startDate: "2026-08-31",
    targetDate: "2026-09-18",
    outcome: "First memory-creating release: explicit-date text upload, Calendar, and Journal Day recall.",
    exitEvidence: "An owner-approved text fixture survives ingestion, restart, backup, restore, and export/checksum validation.",
    dependency: "R0 accepted",
  },
  {
    id: "R2",
    name: "Telegram Photo Capture",
    startDate: "2026-09-21",
    targetDate: "2026-10-09",
    outcome: "Authorized durable photo capture with review-safe dating, gallery, cover, duplicates, and privacy-safe derivatives.",
    exitEvidence: "Authorization, invalid media/date, album, duplicate, cover, Original, privacy, backup, and restore fixtures pass.",
    dependency: "R1 accepted",
  },
  {
    id: "R3",
    name: "Retrieval and Date Integrity",
    startDate: "2026-10-12",
    targetDate: "2026-10-30",
    outcome: "Cross-month browsing, deterministic search, Needs Date Review, and atomic source redating.",
    exitEvidence: "Known queries work without leakage and a redated item updates both days and restored indexes atomically.",
    dependency: "R2 accepted",
  },
  {
    id: "R4",
    name: "Source History and Lifecycle Safety",
    startDate: "2026-11-02",
    targetDate: "2026-11-20",
    outcome: "Corrections, upstream conflicts, History, Trash, suppressions, and complete restorable export.",
    exitEvidence: "Three conflict outcomes and delete/restore/export/import invariants pass across every existing data shape.",
    dependency: "R3 accepted",
  },
  {
    id: "R5",
    name: "Prospective VoiceNotes Sync",
    startDate: "2026-11-23",
    targetDate: "2026-12-11",
    outcome: "Spike-proven, prospective-only VoiceNotes retrieval and replay-safe reconciliation.",
    exitEvidence: "Synthetic contract, activation, eligibility, dating, replay, suppression, upstream revision, and restore gates pass.",
    dependency: "R4 accepted and VoiceNotes synthetic contract spike passes",
  },
  {
    id: "R6",
    name: "Generated Text Reflection",
    startDate: "2026-12-14",
    targetDate: "2027-01-08",
    outcome: "Optional evaluated titles, summaries, tags, and Visual Briefs with protection, provenance, and budget enforcement.",
    exitEvidence: "Evaluation, typed privacy allowlist, field protection, source-race, failure, spend, and restore gates pass.",
    dependency: "R5 accepted and text-model evaluation passes",
  },
  {
    id: "R7",
    name: "Generated Artwork",
    startDate: "2027-01-11",
    targetDate: "2027-01-29",
    outcome: "Optional evaluated symbolic artwork with explicit preflight, versions, suppression, and real-photo cover precedence.",
    exitEvidence: "Evaluation, safety, cost, lifecycle, labeling, privacy, cover, and restore gates pass.",
    dependency: "R6 accepted and artwork-model evaluation passes",
  },
  {
    id: "R8",
    name: "Operational Scale and Resilience",
    startDate: "2027-02-01",
    targetDate: "2027-02-19",
    outcome: "The integrated archive degrades safely under dependency, capacity, restart, and job failures.",
    exitEvidence: "Watermark, restart, alert, fault, backup/restore, security, browser, and accessibility evidence passes.",
    dependency: "R0 through R7 accepted",
  },
  {
    id: "R9",
    name: "Private Launch Acceptance and Stabilization",
    startDate: "2027-02-22",
    targetDate: "2027-03-12",
    outcome: "The complete private archive is owner-accepted for routine personal use and stabilized without new scope.",
    exitEvidence: "Owner UAT, Recovery Ceremony, observation window, severity gate, and go/no-go or rollback record pass.",
    dependency: "R8 accepted and explicit launch authority",
  },
  {
    id: "R10",
    name: "Conditional Object-store Transition",
    startDate: null,
    targetDate: null,
    outcome: "Live encrypted media moves only after approved local-capacity watermarks trigger a reversible transition.",
    exitEvidence: "Trigger, inventory, dual-write, reconciliation, restore, observed reads, cutover, and rollback gates pass.",
    dependency: "Measured storage trigger; no calendar commitment",
  },
];

const req = {
  R0: [
    "LID-SCP-001", "LID-OPS-001", "LID-OPS-002", "LID-OPS-003", "LID-OPS-004",
    "LID-OPS-008", "LID-OPS-011", "LID-OPS-012", "LID-OPS-014", "LID-OPS-016", "LID-OPS-018",
  ],
  R1: [
    "LID-SCP-002", "LID-SCP-003", "LID-UP-001", "LID-UP-002", "LID-UP-003",
    "LID-REF-001", "LID-REF-004", "LID-REF-005", "LID-REF-006", "LID-OPS-011", "LID-OPS-018",
  ],
  R2: [
    "LID-TG-001", "LID-TG-002", "LID-TG-003", "LID-TG-004", "LID-TG-005",
    "LID-TG-006", "LID-TG-007", "LID-TG-008", "LID-TG-009", "LID-TG-010",
    "LID-OPS-005", "LID-OPS-009", "LID-OPS-011", "LID-OPS-015", "LID-OPS-018",
  ],
  R3: ["LID-SRC-003", "LID-REF-002", "LID-REF-003", "LID-REF-006", "LID-OPS-011", "LID-OPS-018"],
  R4: [
    "LID-SCP-004", "LID-SRC-001", "LID-SRC-002", "LID-SRC-004", "LID-REF-007",
    "LID-OPS-010", "LID-OPS-011", "LID-OPS-013", "LID-OPS-018",
  ],
  R5: [
    "LID-VN-001", "LID-VN-002", "LID-VN-003", "LID-VN-004", "LID-VN-005", "LID-VN-006", "LID-VN-007",
    "LID-OPS-011", "LID-OPS-015", "LID-OPS-018",
  ],
  R6: [
    "LID-AIT-001", "LID-AIT-002", "LID-AIT-003", "LID-AIT-004", "LID-AIT-005", "LID-AIT-006", "LID-AIT-007",
    "LID-REF-006", "LID-OPS-011", "LID-OPS-017", "LID-OPS-018",
  ],
  R7: [
    "LID-AIA-001", "LID-AIA-002", "LID-AIA-003", "LID-AIA-004", "LID-AIA-005", "LID-AIA-006",
    "LID-AIA-007", "LID-AIA-008", "LID-AIA-009", "LID-AIA-010", "LID-AIA-011",
    "LID-REF-006", "LID-OPS-011", "LID-OPS-017", "LID-OPS-018",
  ],
  R8: ["LID-OPS-006", "LID-OPS-011", "LID-OPS-014", "LID-OPS-018", "LID-REF-006"],
  R9: [],
  R10: ["LID-OPS-006", "LID-OPS-007", "LID-OPS-008", "LID-OPS-011", "LID-OPS-014", "LID-OPS-018"],
};

const deferredRequirements = [
  { id: "LID-UP-004", reason: "Blank composition and unsupported document/OCR ingestion remain outside R0–R10." },
  { id: "LID-DEF-001", reason: "Historical VoiceNotes import is deferred." },
  { id: "LID-DEF-002", reason: "Coaching, themes, streaks, reminders, and resurfacing are deferred." },
  { id: "LID-DEF-003", reason: "Semantic, conversational, and question-answering retrieval is deferred." },
  { id: "LID-DEF-004", reason: "Year mosaic, media wall, maps, and native/offline applications are deferred." },
  { id: "LID-DEF-005", reason: "PDF/Word/OCR ingestion, books/printing, and immutable export are deferred." },
  { id: "LID-DEF-006", reason: "Additional or fuzzy VoiceNotes tag eligibility is deferred." },
];

const allProductRequirements = [
  ...["LID-SCP-001", "LID-SCP-002", "LID-SCP-003", "LID-SCP-004"],
  ...Array.from({ length: 10 }, (_, i) => `LID-TG-${String(i + 1).padStart(3, "0")}`),
  ...Array.from({ length: 7 }, (_, i) => `LID-VN-${String(i + 1).padStart(3, "0")}`),
  ...Array.from({ length: 4 }, (_, i) => `LID-UP-${String(i + 1).padStart(3, "0")}`),
  ...Array.from({ length: 4 }, (_, i) => `LID-SRC-${String(i + 1).padStart(3, "0")}`),
  ...Array.from({ length: 7 }, (_, i) => `LID-REF-${String(i + 1).padStart(3, "0")}`),
  ...Array.from({ length: 7 }, (_, i) => `LID-AIT-${String(i + 1).padStart(3, "0")}`),
  ...Array.from({ length: 11 }, (_, i) => `LID-AIA-${String(i + 1).padStart(3, "0")}`),
  ...Array.from({ length: 18 }, (_, i) => `LID-OPS-${String(i + 1).padStart(3, "0")}`),
  ...Array.from({ length: 6 }, (_, i) => `LID-DEF-${String(i + 1).padStart(3, "0")}`),
];

const activeRequirements = allProductRequirements.filter(
  (id) => !deferredRequirements.some((entry) => entry.id === id),
);
req.R9 = [...activeRequirements];

const prdPaths = {
  P0: "docs/product/PRODUCT-REQUIREMENTS.md",
  R0: "docs/product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md",
  R1: "docs/product/releases/PRD-R1-MANUAL-JOURNAL-ARCHIVE.md",
  R2: "docs/product/releases/PRD-R2-TELEGRAM-PHOTO-CAPTURE.md",
  R3: "docs/product/releases/PRD-R3-RETRIEVAL-DATE-INTEGRITY.md",
  R4: "docs/product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md",
  R5: "docs/product/releases/PRD-R5-PROSPECTIVE-VOICENOTES-SYNC.md",
  R6: "docs/product/releases/PRD-R6-GENERATED-TEXT-REFLECTION.md",
  R7: "docs/product/releases/PRD-R7-GENERATED-ARTWORK.md",
  R8: "docs/product/releases/PRD-R8-OPERATIONAL-SCALE-RESILIENCE.md",
  R9: "docs/product/releases/PRD-R9-PRIVATE-LAUNCH-ACCEPTANCE.md",
  R10: "docs/product/releases/PID-R10-OBJECT-STORE-TRANSITION.md",
};

const designByRelease = {
  P0: ["docs/council/UX-DESIGN-REVIEW.md", "docs/design/UX-SPECIFICATION.md", "prototypes/calendar-ui/index-v5.html"],
  R0: ["docs/council/UX-DESIGN-REVIEW.md", "docs/design/UX-SPECIFICATION.md"],
  R1: ["docs/council/UX-DESIGN-REVIEW.md", "docs/design/UX-SPECIFICATION.md", "prototypes/calendar-ui/index-v5.html"],
  R2: ["docs/council/UX-DESIGN-REVIEW.md", "docs/design/UX-SPECIFICATION.md", "prototypes/calendar-ui/index-v5.html"],
  R3: ["docs/council/UX-DESIGN-REVIEW.md", "docs/design/UX-SPECIFICATION.md", "prototypes/calendar-ui/index-v5.html"],
  R4: ["docs/council/UX-DESIGN-REVIEW.md", "docs/design/UX-SPECIFICATION.md"],
  R5: ["docs/council/UX-DESIGN-REVIEW.md", "docs/design/UX-SPECIFICATION.md"],
  R6: ["docs/council/UX-DESIGN-REVIEW.md", "docs/design/UX-SPECIFICATION.md", "prototypes/calendar-ui/index-v5.html"],
  R7: ["docs/council/UX-DESIGN-REVIEW.md", "docs/design/UX-SPECIFICATION.md", "prototypes/calendar-ui/index-v5.html"],
  R8: ["docs/council/UX-DESIGN-REVIEW.md", "docs/design/UX-SPECIFICATION.md"],
  R9: ["docs/council/UX-DESIGN-REVIEW.md", "docs/design/UX-SPECIFICATION.md"],
  R10: ["docs/council/UX-DESIGN-REVIEW.md", "docs/design/UX-SPECIFICATION.md"],
};

const architecturePath = "docs/architecture/PHASE1-IMPLEMENTATION-PLAN.md";

function taskStatus(id) {
  return taskState.statusOverrides?.[id] ?? taskState.defaultStatus;
}

function priorityFor(milestone) {
  if (["P0", "R0", "R1", "R2", "R3", "R4", "R5", "R8", "R9"].includes(milestone)) return "High";
  return "Medium";
}

function typeFor(id) {
  if (id.startsWith("AUD-")) return "Audit";
  if (id.startsWith("PC-")) return "Planning";
  if (id.startsWith("SPK-")) return "Spike";
  if (id.startsWith("PRD-") || id.startsWith("PID-")) return "Product definition";
  if (id.startsWith("UX-")) return "Design";
  if (id.startsWith("ARCH-")) return "Architecture";
  if (id.startsWith("ENG-")) return "Implementation";
  if (id.startsWith("EVAL-")) return "Evaluation";
  if (id.startsWith("QA-")) return "Quality";
  return "Release acceptance";
}

function ownerFor(id) {
  if (id.startsWith("PRD-") || id.startsWith("PID-")) return "Product Manager";
  if (id.startsWith("UX-")) return "UI/UX Designer";
  if (id.startsWith("ARCH-") || id.startsWith("SPK-")) return "Technical Architect";
  if (id.startsWith("ENG-")) return "Engineering";
  if (id.startsWith("EVAL-")) return "Product Manager + Technical Architect";
  if (id.startsWith("QA-")) return "Independent QA + Project Manager";
  if (id.startsWith("REL-")) return "Project Manager + Independent QA";
  if (id.startsWith("AUD-")) return "Product Manager + UI/UX Designer";
  return "Project Manager";
}

function evidenceFor(id, milestone, title, description) {
  if (id === "AUD-001") return "Published v5 feature audit with a source hash and requirement-by-requirement evidence classification.";
  if (id === "PC-001") return "Historical four-seat planning evidence and the five-seat P0 execution-control review, decision record, 58-task manifest, validated workbook, and live roadmap reconcile without inflating planning Done.";
  if (id.startsWith("PRD-") || id.startsWith("PID-")) return `Release document ${prdPaths[milestone]} exists, passes link/requirement validation, and separates council-delegated evidence gates from specifically named non-delegable human acts.`;
  if (id.startsWith("UX-")) return `Approved task-specific design for ${id} — ${title} links complete normal/empty/loading/error/interruption/destructive states, responsive behavior, accessibility annotations, prototype dispositions, and Designer sign-off.`;
  if (id.startsWith("ARCH-")) return `Approved task-specific technical plan for ${id} — ${title} links owned modules, ADRs, threats/data flows, interfaces/data shapes, capacity, migration, restore, rollback, and Architect sign-off.`;
  if (id.startsWith("ENG-")) return `Merged implementation for ${id} — ${title} proves “${description}” with task-specific tests, immutable build/SBOM, migrations, sanitized deployment evidence when authorized, separate-path restore, rollback, and no-regression results.`;
  if (id.startsWith("EVAL-")) return `Signed task-specific evaluation for ${id} — ${title} records frozen fixtures/protocol, exact provider/model snapshots, hard-gate outcomes, measured cost/latency, privacy checks, and council decision.`;
  if (id.startsWith("QA-")) return `Independent task-specific matrix for ${id} — ${title} links executed scenarios, defects/retests, privacy/security/accessibility/browser evidence, restore/rollback results, reviewer independence, and permitted claim.`;
  if (id === "SPK-R0-001") return "Research report plus sanitized live host capacity/topology, collision, restart, backup/restore, rollback, and co-resident non-regression evidence.";
  if (id === "SPK-R5-001") return "Synthetic VoiceNotes contract report proves identity, OAuth renewal, authoritative retrieval, tag/date/transcript, replay, reconciliation, and failure behavior.";
  return `Release acceptance for ${id} — ${title} links independent QA, five-seat review, every task-specific dossier, backup/separate-path restore for each new shape, rollback, defect gate, and proceed/hold/rollback record; a human attestation is included only for a named non-delegable act.`;
}

function evidenceReferencePathsFor(id) {
  return taskState.evidenceReferences?.[id] ?? [];
}

function impactFor(id, milestone) {
  const type = typeFor(id);
  if (["Audit", "Planning", "Product definition", "Design", "Evaluation"].includes(type)) {
    return "Planning evidence only; no production data mutation. Any later implementation still needs its own migration, restore, and rollback proof.";
  }
  if (type === "Architecture" || type === "Spike") {
    return "No personal-data mutation is authorized by this task; it must define or prove reversible deployment and recovery before dependent implementation.";
  }
  if (type === "Quality" || type === "Release acceptance") {
    return "Validates rollback and restore for every persistent shape introduced by the milestone; acceptance never substitutes a successful backup upload for restore evidence.";
  }
  const shapes = {
    R0: "synthetic encrypted database/configuration and job state only",
    R1: "journal-day, source-file, checksum, and correction-ready records",
    R2: "encrypted media, derivative, gallery, duplicate-reference, and review-queue state",
    R3: "search index, date-review, and atomic redating state",
    R4: "revision, Correction, conflict, Trash, suppression, and export state",
    R5: "VoiceNotes identity, activation, revision, reconciliation, and suppression state",
    R6: "derived-text versions, protection, provenance, job, and usage-ledger state",
    R7: "artwork versions, job, provenance, suppression, and cover-selection state",
    R8: "health, alert, fault, and capacity evidence",
    R10: "object inventory, dual-write, migration pointer, and reconciliation state",
  };
  return `Adds ${shapes[milestone] ?? "persistent application state"}; migration must be reversible and backup/restore coverage must pass before release acceptance.`;
}

function urlFor(filePath) {
  return `${repoUrl}/blob/main/${filePath}`;
}

const definitions = [
  ["AUD-001", "P0", "v5 Feature Audit", "2026-08-14", "2026-08-14", "Classify every v5 interaction as strong, partial, missing, or outside implementation evidence.", [], []],
  ["PC-001", "P0", "Integrated Council Planning Package", "2026-08-14", "2026-08-16", "Reconcile Product, Design, Architecture, and Project Management decisions into one delivery baseline.", ["AUD-001"], []],

  ["SPK-R0-001", "R0", "Shared-host Coexistence & Rollback Spike", "2026-08-17", "2026-08-19", "Prove namespaced shared-host fit with synthetic data, explicit capacity assumptions, non-regression, restore, and rollback.", ["PC-001"], req.R0],
  ["PRD-R0-001", "R0", "Private Foundation PRD", "2026-08-17", "2026-08-20", "Define the synthetic-only private foundation outcome and prohibit authentic memory ingestion before R0 acceptance.", ["PC-001"], req.R0],
  ["UX-R0-001", "R0", "First-use/Access/Health States", "2026-08-18", "2026-08-21", "Design first use, access denial/expiry, System Health, synthetic recovery, failure, and rollback states.", ["PRD-R0-001", "SPK-R0-001"], ["LID-SCP-001", "LID-OPS-001", "LID-OPS-012", "LID-OPS-014", "LID-OPS-018"]],
  ["ARCH-R0-001", "R0", "Private Shell Architecture & Threat Baseline", "2026-08-17", "2026-08-21", "Freeze namespaced processes, loopback ingress, callback isolation, encryption, secrets, logging, backup, and recovery architecture.", ["PRD-R0-001", "SPK-R0-001"], req.R0],
  ["ENG-R0-001", "R0", "Deploy Synthetic Private Shell", "2026-08-21", "2026-08-26", "Build and deploy an authenticated synthetic shell with health evidence and no route or data path for real memories.", ["UX-R0-001", "ARCH-R0-001"], req.R0],
  ["REL-R0-001", "R0", "Restore/Rollback/Non-regression Acceptance", "2026-08-27", "2026-08-28", "Execute access, coexistence, encrypted synthetic restore, restart, rollback, and co-resident non-regression gates.", ["ENG-R0-001"], req.R0],

  ["PRD-R1-001", "R1", "Manual Archive PRD", "2026-08-31", "2026-09-02", "Define the first memory-creating release with explicit-date text upload and authentic Calendar/Journal Day recall.", ["PC-001"], req.R1],
  ["UX-R1-001", "R1", "Calendar/Day/Upload Designs", "2026-08-31", "2026-09-04", "Finalize Calendar, Journal Day, upload, empty/loading/error, responsive, theme, and accessibility states.", ["PRD-R1-001"], ["LID-SCP-002", "LID-SCP-003", "LID-UP-001", "LID-UP-003", "LID-REF-001", "LID-REF-004", "LID-REF-005", "LID-REF-006"]],
  ["ARCH-R1-001", "R1", "Journal/Source/Encryption Schema", "2026-08-31", "2026-09-04", "Define Journal Day, immutable source file, checksum, encryption, index, backup, restore, and migration contracts.", ["PRD-R1-001", "REL-R0-001"], ["LID-SCP-002", "LID-SCP-003", "LID-UP-001", "LID-UP-002", "LID-UP-003", "LID-OPS-011", "LID-OPS-018"]],
  ["ENG-R1-001", "R1", "Manual Upload & Reflection Core", "2026-09-03", "2026-09-15", "Implement durable explicit-date text upload, duplicate override, Calendar, and authentic Journal Day display.", ["UX-R1-001", "ARCH-R1-001", "REL-R0-001"], req.R1],
  ["REL-R1-001", "R1", "First-memory Restore/Rollback Acceptance", "2026-09-16", "2026-09-18", "Verify one owner-approved source survives upload, restart, export, backup, restore, and rollback without time/date drift.", ["ENG-R1-001"], req.R1],

  ["PRD-R2-001", "R2", "Telegram Capture PRD", "2026-09-21", "2026-09-23", "Define authorized media forms, dating/review, durable acknowledgement, gallery, duplicate, caption, and privacy behavior.", ["PC-001"], req.R2],
  ["UX-R2-001", "R2", "Telegram/Date Review/Gallery Designs", "2026-09-21", "2026-09-25", "Design companion messages, media/date failures, Needs Date Review, gallery, cover, duplicates, and media management.", ["PRD-R2-001"], ["LID-TG-002", "LID-TG-003", "LID-TG-004", "LID-TG-005", "LID-TG-006", "LID-TG-007", "LID-TG-008", "LID-TG-009", "LID-OPS-015"]],
  ["ARCH-R2-001", "R2", "Media Pipeline & Asset Lifecycle", "2026-09-21", "2026-09-25", "Define callback authorization, bounded staging/decoding, ciphertext/derivative flow, media references, deduplication, and restore.", ["PRD-R2-001", "REL-R1-001"], req.R2],
  ["ENG-R2-001", "R2", "Telegram Authorization & Durable Capture", "2026-09-24", "2026-10-02", "Implement secret/sender/chat authorization, media validation, exact dating, review holding, and post-commit acknowledgement.", ["UX-R2-001", "ARCH-R2-001", "REL-R1-001"], ["LID-TG-001", "LID-TG-002", "LID-TG-003", "LID-TG-004", "LID-TG-005", "LID-TG-006", "LID-OPS-005", "LID-OPS-011", "LID-OPS-015", "LID-OPS-018"]],
  ["ENG-R2-002", "R2", "Gallery/Cover/Dedup/Derivatives", "2026-09-28", "2026-10-06", "Implement durable gallery order, real-photo cover, global checksum references, captions, byte-preserved Originals, and local metadata-free thumbnails.", ["ENG-R2-001"], ["LID-TG-007", "LID-TG-008", "LID-TG-009", "LID-TG-010", "LID-OPS-009", "LID-OPS-011", "LID-OPS-018"]],
  ["REL-R2-001", "R2", "Media Privacy/Restore Acceptance", "2026-10-07", "2026-10-09", "Execute capture, invalid input/date, album, duplicate, cover, Original, AI-exclusion, media restore, and rollback fixtures.", ["ENG-R2-001", "ENG-R2-002"], req.R2],

  ["PRD-R3-001", "R3", "Retrieval & Date Integrity PRD", "2026-10-12", "2026-10-14", "Define the cross-month Monthly Almanac, exact retrieval, query privacy, Date Review, and atomic redating invariants.", ["PC-001"], req.R3],
  ["UX-R3-001", "R3", "Almanac/Search/Date Review Designs", "2026-10-12", "2026-10-16", "Design the Monthly Almanac, search scope/results/history, Date Review, redating preview, interruption, and failure states.", ["PRD-R3-001"], ["LID-SRC-003", "LID-REF-002", "LID-REF-003", "LID-REF-006"]],
  ["ARCH-R3-001", "R3", "Search Index & Redating Transaction", "2026-10-12", "2026-10-16", "Define encrypted lexical indexes, query/log privacy, date-review storage, and one-transaction old/new-day redating.", ["PRD-R3-001", "REL-R2-001"], req.R3],
  ["ENG-R3-001", "R3", "Almanac/Search/Date Review/Redating", "2026-10-15", "2026-10-28", "Implement cross-month Almanac browsing, deterministic lexical/date/tag/caption retrieval, review resolution, and atomic redating.", ["UX-R3-001", "ARCH-R3-001", "REL-R2-001"], req.R3],
  ["REL-R3-001", "R3", "Query Privacy & Date Atomicity Acceptance", "2026-10-29", "2026-10-30", "Verify exact results, opt-in history, zero query leakage, two-day atomicity, index recovery, restore, and rollback.", ["ENG-R3-001"], req.R3],

  ["PRD-R4-001", "R4", "Lifecycle PRD", "2026-11-02", "2026-11-04", "Define Corrections, conflict choices, source binding, History, Trash, suppressions, confirmations, and complete export.", ["PC-001"], req.R4],
  ["UX-R4-001", "R4", "Diff/History/Trash/Export Designs", "2026-11-02", "2026-11-06", "Design accessible diff, Correction, History, Trash, suppression, confirmation, and encrypted-export workflows.", ["PRD-R4-001"], ["LID-SCP-004", "LID-SRC-001", "LID-SRC-002", "LID-SRC-004", "LID-REF-007", "LID-OPS-010", "LID-OPS-013"]],
  ["ARCH-R4-001", "R4", "Revision/Suppression/Export Lifecycle", "2026-11-02", "2026-11-06", "Define immutable revisions/Corrections, active display binding, Trash/suppression state machine, passphrase handoff, export cleanup, and restore.", ["PRD-R4-001", "REL-R3-001"], req.R4],
  ["ENG-R4-001", "R4", "Corrections/Conflict/History", "2026-11-05", "2026-11-13", "Implement immutable Corrections, retained revisions, exactly three conflict outcomes, exact source-set binding, and inspectable History.", ["UX-R4-001", "ARCH-R4-001", "REL-R3-001"], ["LID-SCP-004", "LID-SRC-001", "LID-SRC-002", "LID-SRC-004", "LID-REF-007", "LID-OPS-011", "LID-OPS-018"]],
  ["ENG-R4-002", "R4", "Trash/Suppressions/Export", "2026-11-09", "2026-11-18", "Implement 30-day Trash, restoration/permanent deletion, suppressions, complete encrypted export, cleanup, and import validation.", ["ENG-R4-001"], ["LID-SCP-004", "LID-REF-007", "LID-OPS-010", "LID-OPS-011", "LID-OPS-013", "LID-OPS-018"]],
  ["REL-R4-001", "R4", "Lifecycle/Export Restore Acceptance", "2026-11-19", "2026-11-20", "Verify conflict outcomes, deletion/restoration, day visibility, suppression, export completeness, import/restore, and rollback.", ["ENG-R4-001", "ENG-R4-002"], req.R4],

  ["SPK-R5-001", "R5", "VoiceNotes Synthetic Contract Spike", "2026-11-23", "2026-11-25", "Prove exact note/revision identity, unattended authorization, authoritative retrieval, tag/date/transcript, wakeups, reconciliation, and failure behavior using synthetic data.", ["REL-R4-001"], ["LID-VN-001", "LID-VN-002", "LID-VN-003", "LID-VN-004", "LID-VN-005"]],
  ["PRD-R5-001", "R5", "VoiceNotes PRD", "2026-11-23", "2026-11-27", "Define spike-gated prospective eligibility, activation, dating, reconciliation, revisions, suppression, and lifecycle behavior.", ["PC-001"], req.R5],
  ["UX-R5-001", "R5", "Integration/Reconciliation/Lifecycle Designs", "2026-11-24", "2026-11-27", "Design activation, integration health, Date Review, reconciliation, upstream revision/conflict, suppression, and re-import states.", ["PRD-R5-001", "SPK-R5-001"], ["LID-VN-002", "LID-VN-003", "LID-VN-004", "LID-VN-005", "LID-VN-006", "LID-VN-007", "LID-OPS-015"]],
  ["ARCH-R5-001", "R5", "VoiceNotes Adapter & Reconciliation Contract", "2026-11-24", "2026-11-27", "Freeze the spike-proven adapter, opaque identities, authorization renewal, fail-closed paging, durable jobs, reconciliation, and restore design.", ["PRD-R5-001", "SPK-R5-001", "REL-R4-001"], req.R5],
  ["ENG-R5-001", "R5", "Prospective Import & Revisions", "2026-11-26", "2026-12-09", "Implement exact post-activation import, creation-time dating/review, replay-safe reconciliation, revisions, upstream status, suppression, and alerts.", ["UX-R5-001", "ARCH-R5-001", "REL-R4-001"], req.R5],
  ["REL-R5-001", "R5", "Replay/Suppression/Restore Acceptance", "2026-12-10", "2026-12-11", "Verify activation boundaries, missed/duplicate/out-of-order replay, revisions, suppression/re-import, integration failure isolation, restore, and rollback.", ["ENG-R5-001"], req.R5],

  ["EVAL-R6-001", "R6", "Text Model Evaluation", "2026-12-14", "2026-12-18", "Evaluate exact text provider/model snapshots against privacy, fidelity, schema, language, latency, and measured-cost hard gates.", ["REL-R5-001"], ["LID-AIT-001", "LID-AIT-002", "LID-AIT-003", "LID-AIT-006", "LID-AIT-007", "LID-OPS-017"]],
  ["PRD-R6-001", "R6", "Generated Text PRD", "2026-12-14", "2026-12-18", "Define evaluated optional text derivation, typed inputs, quiet/final refresh, protection, provenance, failures, and budgets.", ["PC-001"], req.R6],
  ["UX-R6-001", "R6", "Text/Provider/Budget States", "2026-12-16", "2026-12-22", "Design title/summary/tag/brief review, field protection, stale suggestions, provenance, provider health, budget, and failure states.", ["PRD-R6-001", "EVAL-R6-001"], ["LID-AIT-002", "LID-AIT-003", "LID-AIT-004", "LID-AIT-005", "LID-AIT-007", "LID-REF-006", "LID-OPS-017"]],
  ["ARCH-R6-001", "R6", "Text Adapter/Jobs/Budget/Provenance", "2026-12-16", "2026-12-22", "Define typed allowlist serialization, exact adapter configuration, source-race-safe jobs, independent protection, provenance, usage ledger, and restore.", ["PRD-R6-001", "EVAL-R6-001", "REL-R5-001"], req.R6],
  ["ENG-R6-001", "R6", "Text Derivation & Protected Fields", "2026-12-21", "2027-01-06", "Implement evaluated title/summary/tag/Visual Brief derivation, quiet/final refresh, field protection, version choice, provenance, and budget enforcement.", ["UX-R6-001", "ARCH-R6-001", "REL-R5-001"], req.R6],
  ["REL-R6-001", "R6", "Text Privacy/Quality/Restore Acceptance", "2027-01-07", "2027-01-08", "Verify hard-gate model quality, photo/caption exclusion, source races, protected fields, failures, monthly ceiling, derived restore, and rollback.", ["ENG-R6-001"], req.R6],

  ["EVAL-R7-001", "R7", "Artwork Model Evaluation", "2027-01-11", "2027-01-13", "Evaluate exact artwork provider/model configurations against non-photorealism, safety, quality, latency, cost, and automatic-sweep eligibility gates.", ["REL-R6-001"], ["LID-AIA-001", "LID-AIA-003", "LID-AIA-005", "LID-AIA-006", "LID-AIA-011", "LID-OPS-017"]],
  ["PRD-R7-001", "R7", "Artwork PRD", "2027-01-11", "2027-01-13", "Define evaluated Visual Brief, manual/sweep generation, safety/failure, labeling, versions, cover precedence, suppression, and configuration.", ["PC-001"], req.R7],
  ["UX-R7-001", "R7", "Artwork/Version/Suppression Designs", "2027-01-12", "2027-01-15", "Design preflight, meaningful-word, safety/failure, persistent label, versions, stale, suppression, and real-photo-cover states.", ["PRD-R7-001", "EVAL-R7-001"], ["LID-AIA-002", "LID-AIA-003", "LID-AIA-005", "LID-AIA-006", "LID-AIA-007", "LID-AIA-008", "LID-AIA-009", "LID-AIA-010", "LID-REF-006", "LID-OPS-017"]],
  ["ARCH-R7-001", "R7", "Artwork Adapter/Sweep/Budget/Provenance", "2027-01-12", "2027-01-15", "Define exact adapter/configuration, preflight, idempotent sweep, artifact lifecycle, provenance, budget reservation, suppression, and restore.", ["PRD-R7-001", "EVAL-R7-001", "REL-R6-001"], req.R7],
  ["ENG-R7-001", "R7", "Manual & Sweep Artwork Lifecycle", "2027-01-14", "2027-01-27", "Implement evaluated explicit/sweep generation, versions, labeling, stale state, suppression, cover precedence, failures, and spend control.", ["UX-R7-001", "ARCH-R7-001", "REL-R6-001"], req.R7],
  ["REL-R7-001", "R7", "Artwork Privacy/Cover/Restore Acceptance", "2027-01-28", "2027-01-29", "Verify privacy, evaluation gates, preflight, failures, versions, suppression, real-photo cover, budget, artifact restore, and rollback.", ["ENG-R7-001"], req.R7],

  ["PRD-R8-001", "R8", "Resilience PRD", "2027-02-01", "2027-02-03", "Define measured capacity, safe degradation, health, alerts, failure isolation, integrated recovery, and hardening outcomes.", ["PC-001"], req.R8],
  ["ARCH-R8-001", "R8", "Capacity/Health/Alert/Fault Hardening", "2027-02-01", "2027-02-05", "Harden measured watermarks, process/job supervision, durable health, alert transitions, dependency isolation, and recovery operations.", ["PRD-R8-001", "REL-R7-001"], req.R8],
  ["QA-R8-001", "R8", "Integrated Fault/Security/Browser/Accessibility Suite", "2027-02-04", "2027-02-17", "Execute integrated capacity, restart, dependency, privacy, security, browser, keyboard, screen-reader, zoom, theme, and restore tests.", ["ARCH-R8-001", "REL-R7-001"], activeRequirements],
  ["REL-R8-001", "R8", "Resilience Release Acceptance", "2027-02-18", "2027-02-19", "Accept the integrated operating envelope only after faults, alerts, capacity, backup/restore, rollback, and regressions pass.", ["QA-R8-001"], activeRequirements],

  ["PRD-R9-001", "R9", "Launch Acceptance Plan", "2027-02-22", "2027-02-24", "Define the owner UAT, Recovery Ceremony, severity gate, observation window, explicit authority, go/no-go, and rollback plan with no feature growth.", ["PC-001"], activeRequirements],
  ["QA-R9-001", "R9", "Owner UAT/Recovery Ceremony/Stabilization", "2027-02-22", "2027-03-10", "Execute complete owner journeys, full representative recovery, defect stabilization, accessibility, privacy, spend, capacity, and failure scenarios.", ["PRD-R9-001", "REL-R8-001"], activeRequirements],
  ["REL-R9-001", "R9", "Private Launch Go/No-go & Observation", "2027-03-11", "2027-03-12", "Record explicit owner authority, severity status, Recovery Ceremony, observation evidence, and go/no-go or rollback decision.", ["QA-R9-001"], activeRequirements],

  ["PID-R10-001", "R10", "Object-store Transition PID", null, null, "Define the date-free capacity trigger, user-visible states, outcomes, non-goals, cutover, recovery, rollback, and owner acceptance boundary.", ["PC-001"], req.R10],
  ["ARCH-R10-001", "R10", "Migration/Inventory/Backup/Rollback Runbook", null, null, "Define complete pagination/inventory, encrypted keys, dual-write/copy, reconciliation, remote backup/restore, reversible pointers, observation, and rollback.", ["PID-R10-001", "REL-R9-001"], req.R10],
  ["REL-R10-001", "R10", "Conditional Transition Acceptance", null, null, "After an approved trigger, execute and verify reversible object-store transition before retiring any local authoritative copy.", ["ARCH-R10-001"], req.R10],
];

const tasks = definitions.map(([id, milestone, title, startDate, targetDate, description, dependencies, requirementIds]) => {
  const status = taskStatus(id);
  const taskDossier = taskDossierById[id];
  if (!taskDossier) throw new Error(`${id}: missing task-artifact register record`);
  const task = {
    id,
    title,
    issueTitle: `[${id}] ${title}`,
    milestone,
    status,
    taskType: typeFor(id),
    ownerRole: ownerFor(id),
    priority: priorityFor(milestone),
    startDate,
    targetDate,
    dateBasis: startDate ? "Proposed planning estimate in Asia/Kolkata; evidence gates control actual entry and exit." : "Intentionally date-free until the approved storage trigger exists.",
    description,
    requirementIds: [...new Set(requirementIds)],
    dependencies,
    prdPidPath: prdPaths[milestone],
    prdPidUrl: urlFor(prdPaths[milestone]),
    designArtifactPaths: designByRelease[milestone],
    designArtifactUrls: designByRelease[milestone].map(urlFor),
    architecturePath,
    architectureUrl: urlFor(architecturePath),
    acceptanceEvidence: evidenceFor(id, milestone, title, description),
    evidenceReferencePaths: evidenceReferencePathsFor(id),
    evidenceReferenceUrls: evidenceReferencePathsFor(id).map(urlFor),
    evidenceState: ["In progress", "Done"].includes(status) ? "Linked" : "Not yet provided",
    taskDossier,
    artifactReadiness: taskDossier.artifactReadiness,
    executionDecision: taskDossier.executionDecision,
    executionAllowed: taskDossier.executionAllowed,
    executionScope: taskDossier.executionScope,
    taskPrdPath: taskDossier.artifacts.product.path,
    taskPrdUrl: taskDossier.artifacts.product.url,
    taskArchitecturePath: taskDossier.artifacts.architecture.path,
    taskArchitectureUrl: taskDossier.artifacts.architecture.url,
    taskDesignPath: taskDossier.artifacts.design.path,
    taskDesignUrl: taskDossier.artifacts.design.url,
    taskQaPath: taskDossier.artifacts.qa.path,
    taskQaUrl: taskDossier.artifacts.qa.url,
    taskDeliveryPath: taskDossier.artifacts.delivery.path,
    taskDeliveryUrl: taskDossier.artifacts.delivery.url,
    taskCouncilPath: taskDossier.artifacts.council.path,
    taskCouncilUrl: taskDossier.artifacts.council.url,
    rollbackRestoreImpact: impactFor(id, milestone),
    doneMeaning: status === "Done"
      ? "This planning artifact is complete; it does not claim feature implementation, deployment, production readiness, or release acceptance."
      : "Move to Done only when the named task evidence exists; prototype or document intent cannot prove implementation or release completion.",
    github: {
      issueNumber: issueMap[id]?.number ?? null,
      issueUrl: issueMap[id]?.url ?? null,
      projectItemId: issueMap[id]?.projectItemId ?? null,
    },
  };
  return task;
});

const expectedIds = [
  "AUD-001", "PC-001",
  "SPK-R0-001", "PRD-R0-001", "UX-R0-001", "ARCH-R0-001", "ENG-R0-001", "REL-R0-001",
  "PRD-R1-001", "UX-R1-001", "ARCH-R1-001", "ENG-R1-001", "REL-R1-001",
  "PRD-R2-001", "UX-R2-001", "ARCH-R2-001", "ENG-R2-001", "ENG-R2-002", "REL-R2-001",
  "PRD-R3-001", "UX-R3-001", "ARCH-R3-001", "ENG-R3-001", "REL-R3-001",
  "PRD-R4-001", "UX-R4-001", "ARCH-R4-001", "ENG-R4-001", "ENG-R4-002", "REL-R4-001",
  "SPK-R5-001", "PRD-R5-001", "UX-R5-001", "ARCH-R5-001", "ENG-R5-001", "REL-R5-001",
  "EVAL-R6-001", "PRD-R6-001", "UX-R6-001", "ARCH-R6-001", "ENG-R6-001", "REL-R6-001",
  "EVAL-R7-001", "PRD-R7-001", "UX-R7-001", "ARCH-R7-001", "ENG-R7-001", "REL-R7-001",
  "PRD-R8-001", "ARCH-R8-001", "QA-R8-001", "REL-R8-001",
  "PRD-R9-001", "QA-R9-001", "REL-R9-001",
  "PID-R10-001", "ARCH-R10-001", "REL-R10-001",
];

const uniqueIds = new Set(tasks.map((task) => task.id));
if (tasks.length !== 58 || uniqueIds.size !== 58) throw new Error(`Expected 58 unique tasks; got ${tasks.length}/${uniqueIds.size}`);
if (expectedIds.some((id) => !uniqueIds.has(id))) throw new Error("Canonical task ID set is incomplete");
if (allProductRequirements.length !== 78 || new Set(allProductRequirements).size !== 78) {
  throw new Error(`Expected 78 unique product requirements; got ${allProductRequirements.length}/${new Set(allProductRequirements).size}`);
}
if (taskArtifactRegister.tasks.length !== 58 || Object.keys(taskDossierById).length !== 58) {
  throw new Error(`Expected 58 unique task-artifact records; got ${taskArtifactRegister.tasks.length}/${Object.keys(taskDossierById).length}`);
}
const unknownStatusOverrides = Object.keys(taskState.statusOverrides ?? {}).filter((id) => !uniqueIds.has(id));
const unknownEvidenceEntries = Object.keys(taskState.evidenceReferences ?? {}).filter((id) => !uniqueIds.has(id));
if (unknownStatusOverrides.length || unknownEvidenceEntries.length) {
  throw new Error(`Task-state ledger contains unknown task IDs: ${[...unknownStatusOverrides, ...unknownEvidenceEntries].join(", ")}`);
}
for (const task of tasks) {
  if (["In progress", "Done"].includes(task.status) && task.evidenceReferencePaths.length === 0) {
    throw new Error(`${task.id}: ${task.status} requires at least one retrievable evidence reference`);
  }
  for (const filePath of task.evidenceReferencePaths) {
    if (!fs.existsSync(path.join(repoRoot, filePath))) {
      throw new Error(`${task.id}: evidence reference does not exist: ${filePath}`);
    }
  }
}

const requirementMap = allProductRequirements.map((id) => {
  const deferred = deferredRequirements.find((entry) => entry.id === id);
  const primaryMilestone = deferred
    ? "Deferred"
    : Object.entries(req).find(([, ids]) => ids.includes(id))?.[0] ?? "R9";
  const taskIds = tasks.filter((task) => task.requirementIds.includes(id)).map((task) => task.id);
  return {
    requirementId: id,
    primaryMilestone,
    roadmapTaskIds: taskIds,
    disposition: deferred ? "Explicitly deferred; no R0–R10 implementation task." : "Planned and regression-gated.",
    rationale: deferred?.reason ?? "Mapped to one or more release-planning, implementation, or acceptance tasks.",
  };
});

const uncoveredActive = requirementMap.filter((entry) => entry.primaryMilestone !== "Deferred" && entry.roadmapTaskIds.length === 0);
if (uncoveredActive.length) throw new Error(`Uncovered active requirements: ${uncoveredActive.map((entry) => entry.requirementId).join(", ")}`);

const manifest = {
  schemaVersion: "1.0.0",
  generatedAt,
  project: {
    name: "Life in Days — Phase 1 Delivery",
    repository: `${repoUrl}`,
    githubProject: "https://github.com/users/arunpr614/projects/1",
    owner: "Product Owner",
    authoritativeFolder: "Phase1",
    timezone: "Asia/Kolkata",
    governingPrd: "docs/product/PRODUCT-REQUIREMENTS.md",
    governingUxSpecification: "docs/design/UX-SPECIFICATION.md",
    reviewedPrototype: "prototypes/calendar-ui/index-v5.html",
    latestFrozenPrototype: "prototypes/calendar-ui/index-v10.html",
    executionGovernance,
    deploymentState: "Unknown — private read authority pending",
    roadmapStatusValues: ["Backlog", "Next", "In progress", "Done"],
  },
  statusPolicy: {
    Backlog: "Scoped but not selected for immediate execution.",
    Next: "Entry conditions are being prepared; work is next after the named dependency/gate.",
    "In progress": "Active work has evidence, but its exit criteria are not yet satisfied.",
    Done: "The task's named evidence exists. For planning tasks this does not imply implementation, deployment, or release completion.",
  },
  releases,
  tasks,
  requirementMap,
  summary: {
    releaseCount: releases.length,
    taskCount: tasks.length,
    requirementCount: allProductRequirements.length,
    activeRequirementCount: activeRequirements.length,
    explicitlyDeferredRequirementCount: deferredRequirements.length,
    statusCounts: Object.fromEntries(["Backlog", "Next", "In progress", "Done"].map((status) => [status, tasks.filter((task) => task.status === status).length])),
    artifactReadinessCounts: Object.fromEntries(
      [...new Set(tasks.map((task) => task.artifactReadiness))].sort().map((state) => [state, tasks.filter((task) => task.artifactReadiness === state).length]),
    ),
    executionAllowedCount: tasks.filter((task) => task.executionAllowed).length,
  },
};

const outputPath = path.join(repoRoot, "docs/project/PHASE1-ROADMAP-MANIFEST.json");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);

const rel = (filePath) => filePath.startsWith("docs/")
  ? `../${filePath.replace(/^docs\//, "")}`
  : `../../${filePath}`;
const mdLink = (label, filePath) => `[${label}](${rel(filePath)})`;
const displayDate = (date) => date ?? "Trigger-gated";
const escapeCell = (value) => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");

const releaseRows = releases.map((release) =>
  `| ${release.id} | ${escapeCell(release.name)} | ${displayDate(release.startDate)} | ${displayDate(release.targetDate)} | ${escapeCell(release.outcome)} | ${escapeCell(release.exitEvidence)} | ${escapeCell(release.dependency)} |`,
).join("\n");

const taskRows = tasks.map((task) => {
  const prd = mdLink(path.basename(task.prdPidPath), task.prdPidPath);
  const design = task.designArtifactPaths.map((filePath) => mdLink(path.basename(filePath), filePath)).join("; ");
  const requirements = task.requirementIds.length ? task.requirementIds.map((id) => `\`${id}\``).join(", ") : "Planning-only";
  return `| \`${task.id}\` | ${task.status} | ${task.artifactReadiness} | ${task.executionAllowed ? "Yes" : "No"} | ${task.milestone} | ${task.ownerRole} | ${displayDate(task.startDate)} | ${displayDate(task.targetDate)} | ${escapeCell(task.description)} | ${requirements} | ${prd} | ${design} |`;
}).join("\n");

const requirementRows = requirementMap.map((entry) =>
  `| \`${entry.requirementId}\` | ${entry.primaryMilestone} | ${entry.roadmapTaskIds.length ? entry.roadmapTaskIds.map((id) => `\`${id}\``).join(", ") : "None — explicitly deferred"} | ${escapeCell(entry.disposition)} |`,
).join("\n");

const releasePlan = `# Life in Days — Phase 1 Release Plan

- **Owner:** Project Manager, accountable to the Product Council
- **Baseline date:** ${generatedAt}
- **Planning timezone:** \`Asia/Kolkata\`
- **Source of truth:** [Phase 1 Roadmap Manifest](PHASE1-ROADMAP-MANIFEST.json)
- **Detailed implementation:** [Phase 1 Implementation Plan](../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- **Deployment spike:** [Hetzner Shared-host Deployment Spike](../research/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md)
- **Evidence boundary:** Proposed dates are planning estimates, not promises. Prototype and documentation evidence never prove implementation, deployment, production readiness, or release acceptance.

## 1. Council decision

Deliver eleven gated releases after the P0 planning baseline. R0 admits synthetic fixtures only. R1 is the first release allowed to contain authentic owner memories. R10 is intentionally date-free and cannot start until approved storage watermarks trigger it.

The release plan contains exactly **${tasks.length} task work packages**. The same manifest drives this document, the review workbook, repository issues, and the live GitHub Project. A task may move to \`Done\` only when its own named evidence exists. Completing a PRD or design task does not complete its feature release.

Current execution uses a five-seat council and the directly activated Goal under these public-safe records: ${Object.entries(executionGovernance).map(([key, filePath]) => mdLink(key, filePath)).join("; ")}. Routine R0–R8 decisions are council-delegated only when every named gate passes. Named account/MFA/secret, terms/spend/provider, authentic-content/UAT, recovery-key/ceremony, final R9, and irreversible R10 acts remain human-only. Deployment is **Unknown — private read authority pending**.

## 2. Roadmap status contract

| Status | Meaning |
| --- | --- |
| Backlog | Scoped but not selected for immediate execution. |
| Next | Entry conditions are being prepared; work is next after its dependency or gate. |
| In progress | Active work has evidence, but exit criteria are not yet satisfied. |
| Done | The task's named evidence exists. Planning-task completion does not imply implementation or deployment. |

Current planned counts: **${manifest.summary.statusCounts.Backlog} Backlog**, **${manifest.summary.statusCounts.Next} Next**, **${manifest.summary.statusCounts["In progress"]} In progress**, and **${manifest.summary.statusCounts.Done} Done**.

## 3. Milestone release plan

| Milestone | Release | Start | Target | Independently meaningful outcome | Exit evidence | Entry dependency |
| --- | --- | --- | --- | --- | --- | --- |
${releaseRows}

## 4. Detailed task plan

Every row carries the metadata required in GitHub: lane, milestone, dates, description, exact requirement IDs, PRD/PID link, and design-artifact link. Dependencies, acceptance evidence, architecture link, and rollback/restore impact are retained in the JSON manifest and issue body.

Task dependency links are progressive handoffs unless a release entry gate explicitly says otherwise. Discovery, definition, design, and architecture work may overlap while inputs stabilize; a dependent task cannot close, admit authentic data, or pass a release gate until its prerequisite evidence exists. Milestone dependencies in Section 3 remain hard release-entry gates.

| ID | Status | Artifact readiness | Execution allowed | Milestone | Owner | Start | Target | Description | Requirement IDs | Parent PRD/PID | Shared design inputs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${taskRows}

## 5. Requirement coverage

The governing PRD contains **${allProductRequirements.length} stable requirements**. **${activeRequirements.length}** are scheduled and regression-gated; **${deferredRequirements.length}** are explicitly excluded from R0–R10 implementation. Deferred rows remain visible here so absence from the roadmap cannot be mistaken for an omission.

| Requirement | Primary milestone | Roadmap tasks | Disposition |
| --- | --- | --- | --- |
${requirementRows}

## 6. Release governance

1. The Project Manager owns dates, dependencies, status hygiene, evidence links, and the weekly GitHub Project review.
2. The Product Manager owns the governing and release PRDs; an authored PRD is planning evidence, not implementation or release acceptance.
3. The UI/UX Designer owns release-specific flows, responsive/accessibility states, and design evidence. v5 remains design intent only.
4. The Technical Architect owns ADRs, the shared-host envelope, threat/data flows, migrations, deployment, recovery, and rollback contracts.
5. The Independent QA Lead owns test strategy, evidence integrity, defect severity, privacy/security/browser/accessibility validation and release vetoes, and cannot certify a candidate it implemented.
6. Engineering and independent QA attach implementation and executed evidence to the applicable existing task before a delivery task moves to Done.
7. The Project Manager owns dependency/status truth and keeps GitHub, Project, workbook, Wiki, and running log reconciled.
8. Routine R0–R8 promotion uses council delegation only after all gates pass; specifically named human acts remain separate gates.
9. Any entry-gate failure moves the affected item to Backlog or keeps it In progress; dates move before privacy, recovery, accessibility, or non-regression gates are weakened.
10. Every release that adds a persistent data shape must restore that shape and prove rollback independently before its release-acceptance item closes.
11. R10 remains undated in the workbook and GitHub Project until the measured trigger is approved.
12. No substantive task execution begins until the task-bound Product, Architecture, Design, QA, Delivery and Council artifacts satisfy the P0 Definition of Ready. Shared sources are parent inputs only.

## 7. GitHub Project visualization contract

The live Project must provide:

- a status-segmented table or board with exactly \`Backlog\`, \`Next\`, \`In progress\`, and \`Done\`;
- a Roadmap layout using Start date and Target date, grouped or sliced by Status;
- visible Title, Status, Milestone, Start date, Target date, PRD/PID, Design artifact, Requirement IDs, Owner role, Priority, and Evidence fields;
- all ${tasks.length} manifest tasks represented by repository issues;
- blank Start/Target dates for all R10 work until the trigger exists; and
- no automated close/merge workflow that bypasses the named acceptance evidence.

## 8. Change control

Edit the generator and regenerate the manifest before changing task identity, release windows, or requirement mappings. Update repository issues and the live Project from the manifest, validate counts and links, and record any evidence-driven date change in the affected issue. Do not use a spreadsheet-only change as a planning source.
`;

fs.writeFileSync(path.join(repoRoot, "docs/project/PHASE1-RELEASE-PLAN.md"), releasePlan);

console.log(JSON.stringify({
  manifest: path.relative(repoRoot, outputPath),
  releasePlan: "docs/project/PHASE1-RELEASE-PLAN.md",
  tasks: tasks.length,
  requirements: requirementMap.length,
  statuses: manifest.summary.statusCounts,
}, null, 2));
