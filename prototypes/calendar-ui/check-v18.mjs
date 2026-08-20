#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const pathFor = (name) => resolve(directory, name);
const read = (name) => existsSync(pathFor(name)) ? readFileSync(pathFor(name)) : Buffer.alloc(0);
const text = (name) => read(name).toString("utf8");
const sha256 = (name) => createHash("sha256").update(read(name)).digest("hex");
const failures = [];
const pass = (condition, message) => {
  if (!condition) failures.push(message);
};
const occurrences = (source, value) => source.split(value).length - 1;
const between = (source, start, end) => {
  const startAt = source.indexOf(start);
  const endAt = startAt < 0 ? -1 : source.indexOf(end, startAt + start.length);
  return startAt >= 0 && endAt >= 0 ? source.slice(startAt, endAt) : "";
};
const occursInOrder = (source, values) => {
  let cursor = -1;
  return values.every((value) => {
    cursor = source.indexOf(value, cursor + 1);
    return cursor >= 0;
  });
};

const frozen = new Map([
  ["index-v16.html", "c6df9d7c05d506efe39d1df7f311930f097e3ab8fcd9401517170d78f41fe413"],
  ["app-v16.js", "cca04c3db1938331479af6c63423ec7874b9ea0a3dd808b15e22cb0e7b13968f"],
  ["styles-v16.css", "3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869"],
  ["styles-v16-almanac.css", "7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b"],
  ["styles-v16-readiness.css", "e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e"],
  ["styles-v16-resilience.css", "d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c"],
  ["styles-v16-date-review.css", "525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5"],
  ["styles-v16-telegram.css", "6489ac5e330af80c0488ed411229a6256d13765535b8cdf2eb9a3e42a21e4992"],
  ["styles-v16-upload.css", "ca45322956ba372850550be860a02bcd6b63735108808d1612033bf327b81b74"],
  ["styles-v16-correction.css", "8a97c0d60b3871ecbdd690f213407cec7388a4890a77a2ae0d9ba6826a654c5e"],
  ["styles-v16-conflict.css", "2b9d8b7de6c5e5f24b5d7b1b3e428573783ffae1d895ccb7b9e4d4266fe6bfce"],
  ["package.json", "81719c71b307e1c5724e69625cdc015912bbfd3b0aa0ff1209ad7cdbddb39a5d"],
  ["serve.mjs", "ebdd73e72ad93e6e2059ce195475b9c32a6cb9ef5091e6d758f986350f6368f2"],
  ["index-v17.html", "402c4f6b3f26267411d793a23a11dedc150c7f118532049f47bffab1f6d9afc7"],
  ["runtime-v17.js", "474bd76af246beed53a8ec1c2eae6aa61decf31e2df1400edd1be0fd0674f8ad"],
  ["app-v17.js", "3618222f8a156b52f8cf37fdd2ba6178cb75c7bc5bf89b330ee33997307a9f4a"],
  ["styles-v17.css", "dbebc3b92af0fca95fd1f61fcfbe308c320a30df798ff2e2801210f80dddade2"],
  ["README-v17.md", "4b29f95c8878ca243638022a346c0f1b5aa37253400b5490adb11d7575151851"],
  ["check-v17.mjs", "e3d21faf514b856ce991609147212e23702b2b49df87f028c4d3aa10a37fbcd1"],
  ["capture-phase2-evidence-v17.mjs", "860f01a5ea135d53650552c508a91f2c51ccf306b183e09486a3691e3afa3c37"],
]);

for (const [name, expected] of frozen) {
  pass(read(name).length > 0, `${name} is missing`);
  pass(sha256(name) === expected, `${name} no longer matches its frozen SHA-256`);
}

const required = ["index-v18.html", "app-v18.js", "styles-v18.css", "README-v18.md", "check-v18.mjs", "capture-phase2-evidence-v18.mjs"];
for (const name of required) pass(read(name).length > 0, `${name} is missing or empty`);
const additiveV18Files = readdirSync(directory).filter((name) => name.includes("v18")).sort();
pass(JSON.stringify(additiveV18Files) === JSON.stringify([...required].sort()), "calendar-ui must contain exactly the six additive v18 assets");

const index = text("index-v18.html");
const app = text("app-v18.js");
const styles = text("styles-v18.css");
const guide = text("README-v18.md");
const evidence = text("capture-phase2-evidence-v18.mjs");
const compactApp = app.replace(/\s+/g, "");
const compactEvidence = evidence.replace(/\s+/g, "");
const implementation = `${index}\n${app}\n${styles}`;
const hasQuotedSequence = (values) => compactApp.includes(values.map((value) => `"${value}"`).join(","));
const evidenceHasQuotedSequence = (values) => compactEvidence.includes(values.map((value) => `"${value}"`).join(","));

pass(index.includes('data-lid-version="18"'), "index-v18.html must declare v18");
pass(index.includes("<title>Life in Days</title>"), "index-v18.html must retain the generic title");
pass(index.includes('<meta name="robots" content="noindex,nofollow,noarchive"'), "index-v18.html must retain the no-index metadata");
for (const asset of [
  "styles-v16.css",
  "styles-v16-almanac.css",
  "styles-v16-readiness.css",
  "styles-v16-resilience.css",
  "styles-v16-date-review.css",
  "styles-v16-telegram.css",
  "styles-v16-upload.css",
  "styles-v16-correction.css",
  "styles-v16-conflict.css",
  "styles-v17.css",
  "styles-v18.css",
]) {
  pass(index.includes(`href="${asset}"`), `index-v18.html must load ${asset}`);
}
for (const script of ["app-v16.js", "runtime-v17.js", "app-v17.js", "app-v18.js"]) {
  pass(index.includes(`<script src="${script}" defer></script>`), `index-v18.html must load ${script} as a classic defer script`);
}
const scriptOrder = ["app-v16.js", "runtime-v17.js", "app-v17.js", "app-v18.js"].map((name) => index.indexOf(name));
pass(scriptOrder.every((position) => position >= 0) && scriptOrder.every((position, item) => item === 0 || scriptOrder[item - 1] < position), "v18 script order must be app-v16, runtime-v17, app-v17, app-v18");
pass(index.indexOf("styles-v16.css") < index.indexOf("styles-v17.css") && index.indexOf("styles-v17.css") < index.indexOf("styles-v18.css"), "v18 stylesheet order must be frozen v16, frozen v17, then v18");
pass(!index.includes('type="module"'), "browser scripts must remain classic defer scripts");
pass(!/\b(?:src|href)=["']https?:\/\//.test(index), "index-v18.html must not load a remote asset");

const fixtures = [
  "global-ready",
  "day-ready",
  "item-ready",
  "field-ready",
  "artwork-ready",
  "hidden-day",
  "upstream-revised",
  "upstream-conflict",
  "upstream-untagged",
  "upstream-deleted",
  "empty",
  "loading",
  "failure",
  "interrupted",
];
pass(hasQuotedSequence(fixtures), "app-v18.js must declare the exact 14 top-level fixtures in Council order");
const captureScenarios = ["compact-filtered-open", "pagination-both-success"];
pass(hasQuotedSequence(captureScenarios), "app-v18.js must declare the exact two capture scenarios in Council order");
pass(captureScenarios.every((scenario) => !fixtures.includes(scenario)), "capture scenarios must remain disjoint from top-level fixtures");
pass(app.includes("fixtures: [...REQUIRED_FIXTURES]") && app.includes("captureScenarios: [...CAPTURE_SCENARIOS]"), "the manifest must expose fixtures and captureScenarios as separate closed arrays");
pass(hasQuotedSequence(required), "the v18 QA manifest must expose the exact ordered six-asset roster");
const consolePanel = between(app, "function consolePanel(state)", "function render(state)");
pass(consolePanel.includes("REQUIRED_FIXTURES.map") && captureScenarios.every((scenario) => !consolePanel.includes(scenario)), "capture scenarios must not appear as visible fixture-console keys");
for (const forbiddenFixture of ["status-unavailable", "filtered-empty", "pagination-success", "long-metadata"]) {
  pass(!compactApp.includes(`REQUIRED_FIXTURES=[${forbiddenFixture}`), `${forbiddenFixture} must remain a transition branch, not a top-level fixture`);
}

const canonicalOrder = ["E10", "E14", "E13", "E12", "E11", "E09", "E08", "E07", "E06", "E05", "E04", "E03", "E02", "E01", "E17", "E16", "E15"];
const sourceOrder = ["E10", "E14", "E13", "E12", "E11", "E05", "E04", "E01", "E17", "E15"];
const derivedOrder = ["E09", "E08", "E07", "E06", "E03", "E02", "E16"];
for (const [label, order] of [["canonical", canonicalOrder], ["Source", sourceOrder], ["Derived", derivedOrder]]) {
  pass(hasQuotedSequence(order), `app-v18.js is missing the exact ${label} event order`);
}
for (let number = 1; number <= 17; number += 1) {
  const key = `E${String(number).padStart(2, "0")}`;
  pass(app.includes(`"${key}"`) || app.includes(`'${key}'`), `app-v18.js is missing accepted event ${key}`);
}
pass(!/["']E(?:1[89]|[2-9]\d)["']/.test(app), "app-v18.js must not add an eighteenth event");

for (const heading of [
  "Source Item captured",
  "Generated field version created",
  "Generated Artwork version created",
  "Source Revision received",
  "Correction created",
  "Protected field version selected",
  "Artwork version selected",
  "Journal Date changed",
  "Source conflict detected",
  "Upstream status changed",
]) {
  pass(app.includes(heading), `app-v18.js is missing exact event heading: ${heading}`);
}
for (const actor of [
  "Archive owner · simulated",
  "VoiceNotes upstream · simulated",
  "Life in Days rule · simulated",
  "Text generation lane · simulated",
  "Artwork generation lane · simulated",
]) {
  pass(app.includes(actor), `app-v18.js is missing exact safe actor class: ${actor}`);
}
for (const exactFact of [
  "17 Aug 2026, 11:42 pm IST",
  "19 Aug 2026, 10:00 am IST",
  "Summary version 2",
  "Protected Field",
  "Artwork version 2",
  "AI-generated artwork",
  "Deleted upstream",
  "Retained locally",
  "Historical day — not shown in Calendar or Almanac",
  "History for 11 August 2026",
  "Synthetic UI fixture · external evidence required",
]) {
  pass(app.includes(exactFact), `app-v18.js is missing exact Council fact: ${exactFact}`);
}
pass(/"Revision 1"\s*,\s*"Revision 2"\s*,\s*"Revision 3"/.test(app), "app-v18.js must encode the exact Source Revision lineage");
pass(app.includes('basedOn: "Revision 2"') && app.includes('["Based on", "Revision 2"]'), "app-v18.js must encode Correction 1 as Based on Revision 2 in state and visible lineage");

for (const providerCopy of [
  "Text Provider A — synthetic fixture",
  "Artwork Provider A — synthetic fixture",
  "Fixture configuration A",
  "Synthetic cost · fixture only",
]) {
  pass(app.includes(providerCopy), `app-v18.js is missing safe provenance copy: ${providerCopy}`);
}

for (const filter of ["History lane", "Record type", "Event type", "Attention", "Journal Date"]) {
  pass(app.includes(filter), `app-v18.js is missing exact filter label: ${filter}`);
}
for (const filterValue of [
  "All lanes", "Source history", "Derived history",
  "All record types", "Journal Days", "Source records", "Generated fields", "Artwork",
  "All event types", "Source Items", "Source Revisions", "Corrections and conflicts", "Journal Date changes", "Upstream lifecycle",
  "All attention", "Needs attention",
]) {
  pass(app.includes(filterValue), `app-v18.js is missing exact filter value: ${filterValue}`);
}
pass(app.includes("Apply filters") && app.includes("Clear filters"), "app-v18.js must expose explicit Apply and Clear filter actions");
pass(app.includes('type="date"') || app.includes("type=\"date\""), "Global History must use a native Journal Date input");
pass(app.includes("Filter history"), "compact filters must use the exact native-disclosure summary");
pass(!app.includes('type="search"'), "v18 must not add text search");
pass(occurrences(app, "<form") === 1, "v18 must render exactly one semantic filter form");
pass(occurrences(app, '<details class="lid-filter-details-v18"') === 1, "v18 must render exactly one native filter details element");
pass(app.includes('const panelOpen = state.filterOpen || window.matchMedia("(min-width: 1024px)").matches'), "the single filter details must remain open in the wide layout and state-controlled on compact");
pass(app.includes('<form onsubmit="return false">${filterFields(state)}</form>'), "the one filter form must be shared by wide and compact layouts");
pass(!app.includes("lid-filter-modal-v18") && !app.includes("lid-filter-dialog-v18"), "v18 filters must not introduce a modal or dialog copy of the form");

pass(app.includes('const label = lane === "source" ? "Source" : "Derived"'), "pagination must derive only the exact Source/Derived lane labels");
for (const paginationTemplate of [
  "Load earlier ${label} events",
  "Loading earlier ${label} events…",
  '3 earlier ${lane === "source" ? "Source" : "Derived"} events added',
  "Beginning of represented ${label} history",
]) pass(app.includes(paginationTemplate), `app-v18.js is missing exact per-lane pagination template: ${paginationTemplate}`);
for (const paginationOrder of [
  ["E10", "E14", "E13", "E12", "E11", "E05", "E04"],
  ["E09", "E08", "E07", "E06"],
]) {
  pass(hasQuotedSequence(paginationOrder), `app-v18.js is missing pagination first-page order ${paginationOrder.join(",")}`);
}
pass(app.includes("if (!page.added)") && app.includes("page.added = 3") && app.includes('page.stage = "complete-delivered"'), "pagination success must record exactly three earlier additions once and reach its delivered terminal state");
pass(app.includes("requestGeneration") && app.includes("terminalGeneration") && app.includes("payloadGeneration") && app.includes("paginationRequestSerial"), "pagination must reject stale/duplicate terminal delivery through per-lane request generations");
pass(app.includes("page.duplicateIgnored = true") && app.includes('page.stage = "complete-duplicate"'), "duplicate pagination delivery must remain an explicit zero-add terminal state");
const payloadGenerationApp = between(app, "function payloadGeneration", "function reduce");
const paginationReducerApp = between(app, "const laneAction =", 'if (action.type === "retry-history")');
pass(payloadGenerationApp.includes('Object.hasOwn(payload, "requestGeneration")')
  && payloadGenerationApp.includes('Object.hasOwn(payload, "generation")')
  && payloadGenerationApp.includes("payload.requestGeneration !== payload.generation")
  && payloadGenerationApp.includes('typeof generation === "number"')
  && payloadGenerationApp.includes("Number.isInteger(generation)")
  && payloadGenerationApp.includes("generation > 0")
  && !payloadGenerationApp.includes("Number(generation)"), "terminal generation parsing must accept only an explicit positive integer and reject conflicting aliases without coercion");
pass(paginationReducerApp.includes("const terminalOutcome = outcome !== \"pending\"")
  && paginationReducerApp.includes("!Number.isInteger(suppliedGeneration)")
  && paginationReducerApp.includes("normalizedLane(action.payload?.lane) !== lane")
  && paginationReducerApp.includes("page.stage !== \"pending\" || suppliedGeneration !== page.requestGeneration")
  && paginationReducerApp.includes("page.stage !== \"complete-delivered\"")
  && paginationReducerApp.includes("const requestGeneration = paginationRequestSerial[lane] + 1")
  && paginationReducerApp.includes("suppliedGeneration !== requestGeneration")
  && occurrences(paginationReducerApp, "return null") >= 5
  && !paginationReducerApp.includes('String(action.payload?.outcome || "success")'), "all direct/generic terminal outcomes must fail closed on missing, invalid, stale, future, cross-lane, consumed, or wrong-stage generations");
for (const action of [
  "deliver-source-success", "deliver-derived-success", "deliver-source-failure", "deliver-derived-failure",
  "deliver-source-interruption", "deliver-derived-interruption", "duplicate-source", "duplicate-derived",
  "pagination-success", "pagination-failure", "pagination-interrupted", "pagination-duplicate", "settle-pagination",
]) pass(paginationReducerApp.includes(action), `terminal generation reducer is missing direct or alias action ${action}`);
const paginationControlApp = between(app, "function paginationControl", "function lane");
pass(occurrences(paginationControlApp, 'data-lid-request-generation="${page.requestGeneration}"') === 3
  && paginationControlApp.includes('data-lid-request-generation="${page.requestGeneration + 1}"'), "every visible success/failure/interruption/duplicate control must bind its exact current-lane generation");

for (const stateCopy of [
  "No history matches this view",
  "No events match these filters",
  "Try clearing one filter. History was not changed.",
  "Loading history",
  "History could not be loaded",
  "The current archive view is unchanged. Try again.",
  "Retry loading history",
  "Connection interrupted",
  "The history already shown remains readable and may be out of date. Earlier events were not added.",
  "Upstream status unavailable",
  "Retry represented status check",
]) {
  pass(app.includes(stateCopy), `app-v18.js is missing exact state copy: ${stateCopy}`);
}

for (const semantic of ["<main", "<h1", "<h2", "<h3", "<ol", "<time", "<dl", "<dt", "<dd", "<details", "<summary"]) {
  pass(app.includes(semantic), `app-v18.js is missing semantic markup ${semantic}`);
}
pass((app.match(/<h1\b/g) || []).length === 1, "app-v18.js must render exactly one feature h1 template");
pass(app.includes("Event sequence") && app.includes("Record lineage"), "app-v18.js must separate Event sequence from Record lineage");
pass(app.includes("Later represented event") && app.includes("Earlier represented event"), "app-v18.js is missing exact event-relation vocabulary");
pass(app.includes("No earlier") && app.includes("No later"), "app-v18.js must expose visible lineage endpoints");
pass(app.includes('<nav class="lid-topbar-v18" aria-label="History navigation">'), "persistent Back actions must be inside a named History navigation landmark");
pass(app.includes('<h2 id="lid-v18-interrupted-title" tabindex="-1">'), "the interrupted fixture heading must accept its required initial focus");

pass(app.includes('runtime.registerFeature("v18"'), "app-v18.js must register v18 through the frozen runtime");
pass(app.includes("version: 18"), "v18 descriptor/manifest version is missing");
pass(!app.includes('Object.defineProperty(window, "__LID_QA__"'), "v18 must not replace the frozen generic QA API");
const launchContextValidator = between(app, "function validateLaunchContext", "function fixtureState");
pass(app.includes("validateLaunchContext,") && launchContextValidator.includes('if (!launchContext || typeof launchContext !== "object") return false'), "v18 descriptor must reject launcher or direct opens that lack a governed launch context");
pass(launchContextValidator.includes('["settings", "more"].includes(launchContext.origin)') && launchContextValidator.includes('launchContext.scope === "global"') && launchContextValidator.includes("!launchContext.canonicalContextToken") && launchContextValidator.includes("!launchContext.field"), "only native Settings and More may validate as Global launch contexts");
pass(launchContextValidator.includes("CANONICAL_ENTRY_MAP") && launchContextValidator.includes("launchContext.scope !== entry.scope") && launchContextValidator.includes("launchContext.origin !== entry.origin") && launchContextValidator.includes("launchContext.field === entry.field"), "canonical launch validation must bind the closed token to its exact scope, origin, and Summary-only field");
for (const file of required) pass(app.includes(`"${file}"`) || guide.includes(`\`${file}\``), `v18 QA/runbook is missing additive asset ${file}`);
for (const requirement of ["LID-SCP-003", "LID-VN-006", "LID-REF-004"]) {
  pass(app.includes(requirement), `v18 QA manifest is missing primary requirement ${requirement}`);
}
pass(app.includes("LID-SRC-004"), "v18 QA manifest must identify LID-SRC-004 as supporting regression");
pass(app.includes("LID-VN-005"), "v18 QA manifest must retain the LID-VN-005 external-evidence boundary");
pass(!app.includes("LID-HIS-"), "no LID-HIS requirement identifier exists");
pass(app.includes("mutationIntents") && app.includes("mutationEffects") && app.includes("providerRequests"), "v18 snapshot/invariants must expose all three zero counters");
pass(app.includes("domainFingerprint"), "v18 snapshot/invariants must expose a deterministic domain fingerprint");
pass(app.includes("canonicalTotalOrder") && app.includes("visibleSourceKeys") && app.includes("visibleDerivedKeys"), "v18 snapshot must expose canonical and separate visible lane keys");
pass(app.includes("loadedVersions") || app.includes("runtime.manifest"), "v18 QA surface must expose or consume the cumulative loaded-version chain");
pass(app.includes("captureScenarios: [...CAPTURE_SCENARIOS]"), "v18 QA manifest must expose the exact disjoint captureScenarios array");
pass(app.includes('"capture-phase2-evidence-v18.mjs"'), "v18 QA manifest must include its additive capture driver");
const canonicalEntryCopy = [
  "PROTOTYPE V18 · FIXED SYNTHETIC CONTEXTS",
  "Open canonical History contexts",
  "These controls open the fixed fictional 17 Aug 2026 history for Monsoon walk note. They do not represent the Journal Days, Source Items, generated fields, or artwork shown elsewhere in the frozen v16 archive.",
];
const canonicalEntries = [
  { id: "lid-v18-canonical-entry-day", describedBy: "lid-v18-canonical-entry-fact-day", token: "day", fact: "Journal Day · 17 Aug 2026", label: "History & provenance", fixture: "day-ready", scope: "day", back: "Back to Journal Day" },
  { id: "lid-v18-canonical-entry-item", describedBy: "lid-v18-canonical-entry-fact-item", token: "item", fact: "Source Item · Monsoon walk note", label: "View source history", fixture: "item-ready", scope: "item", back: "Back to Source Item" },
  { id: "lid-v18-canonical-entry-summary", describedBy: "lid-v18-canonical-entry-fact-summary", token: "field", fact: "Generated field · Summary", label: "View Summary history", fixture: "field-ready", scope: "field", back: "Back to Summary" },
  { id: "lid-v18-canonical-entry-artwork", describedBy: "lid-v18-canonical-entry-fact-artwork", token: "artwork", fact: "Generated Artwork · Artwork version 2", label: "View artwork history", fixture: "artwork-ready", scope: "artwork", back: "Back to Generated Artwork" },
];
const canonicalPanelBuilder = between(app, "function createCanonicalEntryPanel", "function reconcileCanonicalPanelPlacement");
for (const copy of canonicalEntryCopy) pass(app.includes(copy), `canonical entry panel is missing exact Product copy: ${copy}`);
pass(canonicalPanelBuilder.includes('document.createElement("section")') && canonicalPanelBuilder.includes('panel.id = "lid-v18-canonical-entry-panel"') && canonicalPanelBuilder.includes('panel.className = "lid-v18-canonical-entry-panel"') && canonicalPanelBuilder.includes('panel.setAttribute("aria-labelledby", "lid-v18-canonical-entry-title")') && canonicalPanelBuilder.includes('panel.setAttribute("aria-describedby", "lid-v18-canonical-entry-description")'), "canonical entry panel must create the exact section identity and ARIA wiring");
pass(occursInOrder(canonicalPanelBuilder, canonicalEntryCopy), "canonical entry panel eyebrow, heading, and description must retain exact Product order");
for (const entry of canonicalEntries) {
  for (const value of [entry.id, entry.describedBy, entry.token, entry.fact, entry.label, entry.fixture, entry.scope, entry.back]) {
    pass(app.includes(value), `canonical entry map is missing ${entry.id} fact: ${value}`);
  }
}
pass(occursInOrder(canonicalPanelBuilder, [
  "lid-v18-canonical-entry-fact-day", "<strong>Journal Day</strong>", "17 Aug 2026", "lid-v18-canonical-entry-day", "History &amp; provenance",
  "lid-v18-canonical-entry-fact-item", "<strong>Source Item</strong>", "Monsoon walk note", "lid-v18-canonical-entry-item", "View source history",
  "lid-v18-canonical-entry-fact-summary", "<strong>Generated field</strong>", "Summary", "lid-v18-canonical-entry-summary", "View Summary history",
  "lid-v18-canonical-entry-fact-artwork", "<strong>Generated Artwork</strong>", "Artwork version 2", "lid-v18-canonical-entry-artwork", "View artwork history",
]), "canonical panel facts, fact IDs, button IDs, and labels must retain exact Day/Item/Summary/Artwork order");
const canonicalOwnedButtonTags = canonicalPanelBuilder.match(/<button\b[^>]*data-lid-v18-canonical-entry=[^>]*>/g) || [];
pass(canonicalOwnedButtonTags.length === 4
  && canonicalOwnedButtonTags.every((tag) => !/\sdata-action=|\sdata-lid-action=|\sdata-lid-v18-entry=/.test(tag))
  && canonicalEntries.every((entry) => canonicalOwnedButtonTags.some((tag) => tag.includes(`id="${entry.id}"`) && tag.includes(`data-lid-v18-canonical-entry="${entry.token}"`) && tag.includes(`aria-describedby="${entry.describedBy}"`))), "exactly four owned canonical buttons must describe their exact adjacent fact without inherited, runtime, or retired eligibility attributes");
pass(app.includes("inheritedContextPatchedCount"), "snapshot and invariants must expose inheritedContextPatchedCount");

const inheritedNegativeAudit = between(app, "function inheritedContextPatchCount", "function entryReturnSnapshot");
const appOutsideInheritedNegativeAudit = app.replace(inheritedNegativeAudit, "");
for (const forbiddenInheritedMechanism of [
  "patchInheritedEntrypoints",
  '.day-actions-section [data-action="view-provenance"]',
  '.journal-card [data-action="view-provenance"]',
  '[data-action="view-art-history"]',
  '.manage-row-actions',
  "lid-injected-history-v18",
  "data-lid-v18-entry",
  "dataset.lidV18Entry",
  "dataset.lidV18Origin",
  "dataset.lidV18Field",
  "inheritedModalRoot",
  "entryObserver",
]) pass(!appOutsideInheritedNegativeAudit.includes(forbiddenInheritedMechanism), `v18 must not retain the failed inherited contextual mechanism outside the bounded native-negative audit: ${forbiddenInheritedMechanism}`);
pass(!/\.reflection-manage-row[\s\S]{0,600}(?:append|insertAdjacent|createElement|innerHTML)/.test(app), "Manage Reflection rows must not receive injected v18 History controls");
pass(!/\.reflection-meta[\s\S]{0,600}(?:append|insertAdjacent|createElement|innerHTML)/.test(app), "read-only reflection cards must not receive injected v18 History controls");
pass(app.includes('[data-action="settings-related"][data-label="History"]'), "Global entry must evaluate only the exact native Settings/More History selector");
pass(!app.includes("querySelectorAll('[data-action=\"settings-related\"][data-label=\"History\"]')") && !app.includes('querySelectorAll("[data-action=\\"settings-related\\"][data-label=\\"History\\"]")'), "Settings/More History eligibility must be evaluated from activation, never patched by enumeration");
pass(/document\.addEventListener\(\s*["']click["'][\s\S]*?\}\s*,\s*true\s*\)/.test(app), "the exact native Global and owned canonical entries must be handled in capture phase");
const renderedButtonEligibilityApp = between(app, "function eligibleRenderedButton", "function paginationActivation");
for (const eligibilityFact of [
  "target.isConnected", "target.disabled", 'getAttribute("aria-disabled")', "target.hidden", "target.inert",
  '[hidden], [inert], [aria-hidden="true"]', "getClientRects().length",
  'style.display === "none"', "style.visibility", "Number(style.opacity) <= 0",
  "rectangle.width <= 0", "rectangle.height <= 0", "rectangle.bottom <= 0", "rectangle.top >= innerHeight",
  "document.elementFromPoint(centerX, centerY)", 'getAttribute("aria-label")', "accessibleName",
]) pass(renderedButtonEligibilityApp.includes(eligibilityFact), `rendered origin/control eligibility is missing ${eligibilityFact}`);
pass(!app.includes("isTrusted"), "V18 eligibility and activation must not depend on Event.isTrusted");

const paginationAnchorCaptureApp = between(app, "function paginationInput", "function confirmPaginationAnchor");
const paginationTerminalDispatchApp = between(app, "function terminalPaginationActivation", "function restorePaginationTerminal");
pass(paginationAnchorCaptureApp.includes('eventObject.type === "click"')
  && paginationAnchorCaptureApp.includes('return "click-only"')
  && paginationAnchorCaptureApp.includes("existing && !existing.confirmed")
  && paginationAnchorCaptureApp.includes("existing.controlAction === control.dataset.lidAction")
  && paginationAnchorCaptureApp.includes("boundDuplicateGeneration")
  && paginationAnchorCaptureApp.includes("expectedDuplicateGeneration"), "click-only pagination fallback must capture only when no pointer/key precursor exists and must reject unbound duplicate anchors");
pass(paginationTerminalDispatchApp.includes("eligibleRenderedButton(control)")
  && paginationTerminalDispatchApp.includes("control.dataset.lidRequestGeneration")
  && paginationTerminalDispatchApp.includes("generation !== expectedGeneration")
  && paginationTerminalDispatchApp.includes("!validStage")
  && paginationTerminalDispatchApp.includes('runtime.dispatch("v18", terminal.type, { lane: terminal.lane, requestGeneration: generation })')
  && paginationTerminalDispatchApp.includes("stopImmediatePropagation")
  && paginationTerminalDispatchApp.includes("confirmPaginationAnchor(control)"), "visible terminal controls must dispatch their exact bound lane/generation before the frozen runtime and never double-deliver");
pass(app.indexOf('window.addEventListener("click", capturePaginationAnchor, true);') >= 0
  && app.indexOf('window.addEventListener("click", dispatchBoundPaginationTerminal, true);') > app.indexOf('window.addEventListener("click", capturePaginationAnchor, true);')
  && app.indexOf('window.addEventListener("click", dispatchBoundPaginationTerminal, true);') < app.indexOf('document.addEventListener("click", (eventObject) => {'), "click-only anchor fallback and bound terminal dispatch must run on window capture before the frozen document-capture path");

const governedOriginEligibilityApp = between(app, "function eligibleGovernedHistoryTrigger", "function beginInstantReturnScroll");
const governedOpenApp = between(app, "function openGovernedHistoryEntry", 'window.addEventListener("click", capturePaginationAnchor, true);');
pass(governedOriginEligibilityApp.includes("eligibleRenderedButton(trigger)")
  && governedOriginEligibilityApp.includes('matchMedia("(max-width: 960px)").matches')
  && !governedOriginEligibilityApp.includes("1023")
  && governedOriginEligibilityApp.includes('document.querySelector("#prototype-root")?.contains(trigger)')
  && governedOriginEligibilityApp.includes('document.querySelector("#modal-root")?.contains(trigger)')
  && governedOriginEligibilityApp.includes('trigger.closest(".more-management")'), "Settings, More, and canonical origins must be both fully rendered/eligible and on their exact responsive/root surface");
pass(governedOriginEligibilityApp.includes('matchMedia("(max-width: 960px)").matches')
  && app.includes('const panelOpen = state.filterOpen || window.matchMedia("(min-width: 1024px)").matches')
  && styles.includes("@media (max-width: 1023px)")
  && styles.includes("@media (min-width: 1024px)"), "global-origin eligibility must use the 960/961 boundary independently of the unchanged 1023/1024 filter layout boundary");
const governedEligibilityAt = governedOpenApp.indexOf("eligibleGovernedHistoryTrigger(trigger, launchContext)");
pass(governedEligibilityAt >= 0
  && governedEligibilityAt < governedOpenApp.indexOf("eventObject.preventDefault()")
  && governedEligibilityAt < governedOpenApp.indexOf("eventObject.stopImmediatePropagation()")
  && governedEligibilityAt < governedOpenApp.indexOf("captureEntryReturnAnchor(trigger, launchContext)")
  && governedEligibilityAt < governedOpenApp.indexOf('runtime.openFeature("v18"'), "ineligible origins must return before event suppression, anchor capture, open, focus, scroll, announcement, or state effects");
pass(!/runtime\.openFeature\(\s*["']v18["']\s*\)\s*;/.test(app), "fresh v18 load must not automatically open a capsule");
pass(inheritedNegativeAudit.includes("View day history") && inheritedNegativeAudit.includes("Revisions & provenance") && inheritedNegativeAudit.includes("View versions") && inheritedNegativeAudit.includes(".reflection-manage-row .manage-row-actions button"), "inheritedContextPatchedCount must audit native day/item/artwork copy and zero Manage Reflection injection");
pass(app.includes("inheritedContextPatchedCount === 0") || app.includes("inheritedContextPatchedCount: 0"), "native contextual regression must fail unless inheritedContextPatchedCount is exactly zero");
const nativeNegativeAudit = between(app, "function nativeNegativeAnchorSnapshot", "function entryReturnSnapshot");
const compactNativeNegativeAudit = nativeNegativeAudit.replace(/\s+/g, "");
pass(nativeNegativeAudit.includes("2 August 2026") && nativeNegativeAudit.includes("Before sleep — synthetic fixture") && nativeNegativeAudit.includes("View day history") && nativeNegativeAudit.includes("Revisions & provenance") && nativeNegativeAudit.includes("View versions") && nativeNegativeAudit.includes("manageHistoryCount === 0"), "bounded native-negative snapshot must bind exact 2 Aug, Before sleep, artwork, and zero Manage Reflection identity");
pass(compactNativeNegativeAudit.includes("artworkRepresented:artworkActioninstanceofElement")
  && compactNativeNegativeAudit.includes('artworkExactWhenRepresented:!artworkAction||normalizedArtworkAction==="Viewversions"'), "snapshot must safely distinguish absent artwork from exact represented native artwork");
pass(occurrences(compactNativeNegativeAudit, '!artworkAction||normalizedArtworkAction==="Viewversions"') === 2
  && compactNativeNegativeAudit.includes("exactWhenRepresented:!isTwoAugust||("), "aggregate native-negative truth must accept missing artwork and require exact View versions whenever represented");
pass(app.includes("nativeNegativeAnchors: nativeNegativeAnchorSnapshot()") && app.includes("current.nativeNegativeAnchors.exactWhenRepresented"), "snapshot and invariants must export and enforce the presence-aware native-negative guard");
pass(!app.includes('origin: "launcher"') && !app.includes('"Back to archive"') && !app.includes("origins.launcher"), "active state must not retain the retired launcher origin or its superseded Back copy");
pass(app.includes('document.querySelector("#prototype-root")') && app.includes('document.querySelector("#modal-root")'), "canonical placement must resolve the two stable direct-body anchors");
pass(app.includes("prototypeRoot.nextElementSibling") && (app.includes("canonicalEntryPanel.nextElementSibling") || app.includes("panel.nextElementSibling")) && app.includes("modalRoot"), "canonical reconciliation must enforce prototypeRoot → panel → modalRoot direct-sibling order");
pass((app.match(/\.observe\(\s*document\.body\s*,\s*\{\s*childList\s*:\s*true\s*\}\s*\)/g) || []).length === 1, "exactly one canonical observer must watch only direct document.body child-list changes");
pass(!/\.observe\(\s*document\.body\s*,\s*\{[^}]*\b(?:subtree|attributes|characterData)\b/.test(app), "the canonical body observer must not watch subtree, attributes, or character data");
const canonicalPlacementCode = between(app, "function reconcileCanonicalPanelPlacement", "function queueCanonicalPanelPlacement");
pass(!/(?:prototypeRoot|modalRoot)\.(?:querySelector|querySelectorAll|getElementsBy|matches|closest)\s*\(/.test(canonicalPlacementCode), "canonical placement code must not inspect inherited or modal descendants");
pass(canonicalPlacementCode.includes("matches.length > 1") && canonicalPlacementCode.includes("canonicalPanelPlacementFailed = true"), "missing anchors and duplicate canonical panel IDs must fail placement closed");
pass(canonicalPlacementCode.includes("if (!canonicalEntryPanel)") && canonicalPlacementCode.includes("createCanonicalEntryPanel()"), "canonical panel creation must cache one node and create only when absent");
pass(/if\s*\([^)]*prototypeRoot\.nextElementSibling[^)]*canonicalEntryPanel[^)]*\|\|[^)]*canonicalEntryPanel\.nextElementSibling[^)]*modalRoot[^)]*\)\s*\{\s*prototypeRoot\.after\(canonicalEntryPanel\)/s.test(canonicalPlacementCode), "canonical reconciliation must write only when the exact direct-sibling relation is absent");
pass(!/\.observe\(\s*(?:prototypeRoot|modalRoot|inheritedRoot|inheritedModalRoot)\b/.test(app), "v18 must not observe inherited archive or modal descendants");
pass((app.includes("queueMicrotask") || app.includes("requestAnimationFrame")) && /(?:reconcil|canonical)[\s\S]{0,1600}(?:queued|pending|scheduled|reentran)/i.test(app), "canonical placement must use a queued reentrancy guard");
pass(app.includes('querySelectorAll("#lid-v18-canonical-entry-panel")') || app.includes("querySelectorAll('#lid-v18-canonical-entry-panel')"), "canonical invariants must count duplicate panel IDs fail closed");

pass(app.includes('.lid-launcher-v17'), "v18 must explicitly retire the frozen compatibility launcher");
pass(/\.hidden\s*=\s*true/.test(app) && /\.disabled\s*=\s*true/.test(app), "v18 launcher retirement must make the compatibility node hidden and disabled");
pass(app.includes('setAttribute("aria-hidden", "true")') || app.includes("setAttribute('aria-hidden', 'true')"), "v18 launcher retirement must remove the compatibility node from the accessibility tree");
pass(app.includes('setAttribute("tabindex", "-1")') || app.includes("setAttribute('tabindex', '-1')") || /\.tabIndex\s*=\s*-1/.test(app), "v18 launcher retirement must remove the compatibility node from sequential focus");
pass(app.includes("getBoundingClientRect().top") && app.includes("window.scrollY") && app.includes("isConnected"), "entry return must capture invoker viewport top, scroll position, and connected identity");
pass(/Math\.abs\([^)]*(?:top|Top|scroll|Scroll)[^)]*\)\s*(?:<=|>)\s*1/.test(app), "app-owned return correction must enforce the one-CSS-pixel top/scroll tolerance");
pass(/(?:consum|pending|oneShot|one_shot)[\s\S]{0,1000}(?:return|restore)|(?:return|restore)[\s\S]{0,1000}(?:consum|pending|oneShot|one_shot)/i.test(app), "entry return correction must be one-shot and consumed");
const entryReturnImplementation = between(app, "function captureEntryReturnAnchor", "function openGovernedHistoryEntry");
for (const returnFact of ["window.scrollY", "getBoundingClientRect()", "isConnected", "window.scrollTo", "window.scrollBy", "preventScroll: true", "scrollDelta", "targetTopDelta", "sameConnectedInvoker", "consumed: true", "entryReturnAnchor = null"]) {
  pass(entryReturnImplementation.includes(returnFact), `app-owned entry return is missing exact one-shot fact: ${returnFact}`);
}
pass(entryReturnImplementation.includes("Math.abs(scrollDelta) <= 1") && entryReturnImplementation.includes("Math.abs(targetTopDelta) <= 1"), "app-owned entry return must independently enforce scroll and invoker-top deltas within one CSS pixel");
pass(!entryReturnImplementation.includes(".lid-launcher-v17"), "the retired compatibility launcher must never be an entry-return fallback");
const activeHistoryTabShield = between(app, "function shieldActiveHistoryTabFromInheritedModal", 'window.addEventListener("keydown", shieldActiveHistoryTabFromInheritedModal, true);');
const compactActiveHistoryTabShield = activeHistoryTabShield.replace(/\s+/g, " ").trim();
pass(/^function shieldActiveHistoryTabFromInheritedModal\(eventObject\) \{ if \(eventObject\.key !== "Tab" \|\| !runtime\.isActive\("v18"\)\) return; eventObject\.stopPropagation\(\); \}$/.test(compactActiveHistoryTabShield), "app-v18 must install an active-v18-only, Tab-only propagation shield with no custom traversal");
pass(occurrences(app, 'window.addEventListener("keydown", shieldActiveHistoryTabFromInheritedModal, true);') === 1, "the History Tab shield must be registered exactly once on window capture");
pass(activeHistoryTabShield.includes("stopPropagation()") && !activeHistoryTabShield.includes("stopImmediatePropagation"), "the History Tab shield must stop inherited propagation without suppressing unrelated same-target listeners");
pass(!/(?:preventDefault|\.focus\(|scrollIntoView|window\.scroll|runtime\.dispatch|openFeature|setFixture)/.test(activeHistoryTabShield), "the History Tab shield must preserve native default traversal and never focus, scroll, dispatch, or open state itself");
pass(app.includes('action === "back-history"') && app.includes('runtime.dispatch("v18", "back-history"') && app.includes("consume-return-scroll") && app.includes("window.scrollTo"), "hidden-day Back must dispatch, restore its exact saved scroll, and consume the one-shot return");
pass(app.includes('function fixtureState(fixture, current)') && app.includes('return stateForFixture(fixture, current?.theme === "dark" ? "dark" : "light")'), "each fixture selection must construct isolated fresh state while retaining only theme");
pass(app.includes('if (action.type === "reset") return stateForFixture("global-ready", state.theme)'), "reset must reconstruct fresh global-ready state");
for (const freshStateFact of [
  "draftFilters: { ...DEFAULT_FILTERS }",
  "appliedFilters: { ...DEFAULT_FILTERS }",
  "filterOpen: false",
  "consoleOpen: false",
  "selectedRelationTarget: null",
  "pagination: freshPagination()",
  "statusUnavailable: false",
  "mutationIntents: 0",
  "mutationEffects: 0",
  "providerRequests: 0",
]) pass(app.includes(freshStateFact), `fresh fixture state is missing lifecycle isolation fact: ${freshStateFact}`);
pass(app.includes('function initialDisclosureKeys(fixture)') && app.includes('return fixture === "item-ready" ? ["E12"] : []'), "fresh item-ready must open only E12 provenance while every other fixture starts with no event disclosure");
pass(app.includes("openDisclosureKeys: initialDisclosureKeys(selected)") && app.includes("disclosureDefaultIntact: true"), "fresh fixture state must apply and track the exact default disclosure exception");
pass(app.includes("disclosureDefaultsExact") && app.includes('fixture === "item-ready" ? ["E12"] : []') && app.includes("Fresh Item history opens only E12 provenance by default"), "invariants must enforce E12-only item-ready default provenance and empty defaults for the other thirteen fixtures");
pass(app.includes('data-lid-v18-event-details="${key}"') && app.includes('state.openDisclosureKeys.includes(key) ? "open" : ""'), "event provenance DOM must reflect the governed disclosure key set");

const sourceProseCorrection = "Fictional Correction 1 — A rain-washed path curved past paper lanterns; the synthetic narrator paused beside three quiet puddles before heading home.";
const sourceProseRevision2 = "Fictional Revision 2 — Rain softened the path beneath the paper lanterns; the synthetic narrator counted three quiet puddles before walking home.";
for (const [label, prose] of [["Correction 1", sourceProseCorrection], ["Revision 2", sourceProseRevision2]]) {
  pass(occurrences(app, prose) === 1, `the exact ${label} source-context prose must have one source definition in app-v18.js`);
}
pass(hasQuotedSequence(["revision-2", "correction-1", "none"]), "sourceContextVariant must use only the exact ordered safe enum");
pass(app.includes('if (!["day", "item"].includes(state.scope)) return "none"') && app.includes('return state.fixture === "upstream-revised" ? "revision-2" : "correction-1"'), "sourceContextVariant must map only upstream-revised Day/Item ownership to revision-2 and other Day/Item ownership to correction-1");
pass(app.includes("sourceContextVariant: sourceContextVariant(state)"), "the detached snapshot must export sourceContextVariant");
pass(app.includes('if (variant === "none") return ""') && app.includes('const prose = variant === "revision-2" ? SOURCE_CONTEXT_PROSE_REVISION_2 : SOURCE_CONTEXT_PROSE'), "only Day/Item task content may render the selected exact source-context prose");
pass(app.includes('"upstream-revised": { scope: "item", source: ["E04", "E01"], derived: []'), "upstream-revised must remain the isolated two-Source-event, zero-Derived fixture");
pass(app.includes('revisionLineage: ["Revision 1", "Revision 2"], displayedRecord: "Revision 2", correction: null, currentUpstream: "Revision 2", upstreamState: ["Revised upstream"], conflict: null'), "upstream-revised must retain exact R1-to-R2 state without correction or conflict");
pass(app.includes('return { ...record, states: ["Displayed", "Current upstream", "Revised upstream"] }'), "upstream-revised E04 must visibly carry Displayed, Current upstream, and Revised upstream");
pass(app.includes('!/\\b(Correction|Revision 3|conflict|Conflict|Untagged|Deleted)\\b/.test(lifecycleText)'), "invariants must reject revised-fixture Correction/R3/conflict/Untagged/Deleted contamination");
pass(app.includes("Current source prose is confined to Day or Item task content") && app.includes("Safe source-context variant is exact and prose-free in structured state"), "invariants must enforce source-context placement, owner mapping, enum, and structured privacy");

const exactLoadingMarkup = '<section class="lid-results-v18 lid-loading-results-v18" aria-label="History results"><section class="lid-history-lane-v18 is-source" aria-labelledby="lid-v18-loading-source-title" aria-busy="true"><header><div><p class="lid-eyebrow-v18">Source lane</p><h2 id="lid-v18-loading-source-title">Source history</h2></div></header><section class="lid-loading-status-v18" aria-labelledby="lid-v18-loading-title"><h3 id="lid-v18-loading-title">Loading history</h3><p>Preparing separate Source and Derived event lists from synthetic browser-memory fixtures.</p></section></section></section>';
pass(app.includes(exactLoadingMarkup), "top-level loading must render the exact single named busy Source-lane tree");
pass(app.includes('...(state.transitionBranch === "loading" ? [] : [["Lane counts"'), "top-level loading scope summary must omit the false final lane count");
pass(app.includes("loadingBusyNodes.length === 1") && app.includes("loadingBusyNodes[0] === loadingLane") && app.includes('!loadingLane.hasAttribute("aria-label")') && app.includes("h2#lid-v18-loading-source-title") && app.includes("h3#lid-v18-loading-title") && app.includes('!host?.querySelector(".lid-history-lane-v18.is-derived, .lid-event-card-v18, .lid-loading-results-v18 ol")') && app.includes('!/represented events/.test'), "loading invariants must enforce the h2-named Source lane and reject global/Derived busy state, cards/lists, and a false represented count");
pass(app.includes('const focusSelector = config.branch === "empty"') && app.includes(': `#lid-v18-title`'), "top-level loading must retain entry focus on History & provenance");

for (const forbidden of [
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bWebSocket\b/,
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
  /\bindexedDB\b/,
  /\bcaches\s*\./,
  /\bserviceWorker\b/,
  /\bsetTimeout\s*\(/,
  /\bsetInterval\s*\(/,
  /\bMath\.random\s*\(/,
  /\bDate\.now\s*\(/,
  /\bconsole\s*\./,
]) {
  pass(!forbidden.test(app), `app-v18.js contains forbidden browser/static API ${forbidden}`);
}
pass(!app.includes("pushState("), "v18 must not push private browser-history entries");
pass(!/https?:\/\//.test(`${app}\n${styles}`), "v18 application/styles must not contain a remote URL");
pass(!/@import\b/.test(styles), "styles-v18.css must not import an external stylesheet");
pass(!/url\s*\(/.test(styles), "styles-v18.css must not load an external or embedded asset");

pass(/\.lid-filter-rail-v18\s*\{[^}]*display\s*:\s*none\s*!important[^}]*\}/s.test(styles), "the obsolete duplicate filter rail must remain defensively hidden");
pass(/grid-template-columns\s*:\s*minmax\(240px,\s*26[0-9]px\)\s+minmax\(0,/.test(styles), "wide v18 layout must include a supporting rail between 240 and 272 px");
pass(/@media\s*\(min-width:\s*1024px\)[\s\S]*?\.lid-filter-details-v18\s*>\s*summary\s*\{[^}]*display\s*:\s*none[^}]*\}[\s\S]*?\.lid-filter-details-v18:not\(\[open\]\)\s*>\s*\.lid-filter-wide-heading-v18,[\s\S]*?\.lid-filter-details-v18:not\(\[open\]\)\s*>\s*form\s*\{[^}]*display\s*:\s*block[^}]*\}/.test(styles), "wide CSS must hide the native summary and keep the same heading/form visibly open");
pass(/@media\s*\(max-width:\s*1023px\)[\s\S]*?\.lid-filter-details-v18\s*>\s*summary\s*\{[^}]*display\s*:\s*flex[^}]*\}[\s\S]*?\.lid-filter-wide-heading-v18\s*\{[^}]*display\s*:\s*none[^}]*\}/.test(styles), "compact CSS must expose the native details summary and hide only the wide heading");
pass(styles.includes("@media (forced-colors: active)"), "forced-colour treatment is missing");
pass(styles.includes("@media (prefers-reduced-motion: reduce)"), "reduced-motion treatment is missing");
pass(styles.includes("@media (max-width: 1023px)") || styles.includes("@media (max-width:1023px)"), "compact inline-filter breakpoint is missing");
pass(styles.includes("@media (max-width: 480px)") || styles.includes("@media (max-width:480px)"), "320/390 px compact treatment is missing");
pass(styles.includes("min-height: 44px"), "primary compact controls need a 44 px target floor");
pass(styles.includes("font-size: 13px") || styles.includes("font-size: .8125rem") || styles.includes("font-size: 0.8125rem"), "essential metadata needs a 13 px floor");
pass(!/overflow-x\s*:\s*(?:auto|scroll)/.test(styles), "v18 must not create a horizontal event/filter scroller");

const canonicalPanelRule = styles.match(/\.lid-v18-canonical-entry-panel\s*\{([^}]*)\}/s)?.[1] || "";
pass(/width\s*:\s*min\(1128px,\s*calc\(100%\s*-\s*32px\)\)/.test(canonicalPanelRule), "canonical panel width must be exactly min(1128px, calc(100% - 32px))");
const canonicalPanelWidthDeclarations = [...styles.matchAll(/\.lid-v18-canonical-entry-panel\s*\{([^}]*)\}/gs)]
  .flatMap((match) => match[1].match(/\bwidth\s*:[^;]+/g) || []);
pass(canonicalPanelWidthDeclarations.length === 1 && /width\s*:\s*min\(1128px,\s*calc\(100%\s*-\s*32px\)\)/.test(canonicalPanelWidthDeclarations[0]), "responsive CSS must not override the canonical panel's exact 32 px-gutter width");
const canonicalPanelStyleBlocks = [...styles.matchAll(/\.lid-v18-canonical-entry-panel\s*\{([^}]*)\}/gs)].map((match) => match[1]);
pass(canonicalPanelStyleBlocks.every((block) => !/position\s*:\s*(?:fixed|sticky|absolute)/.test(block)), "no responsive rule may turn the canonical panel into a fixed, sticky, or absolute surface");
pass(canonicalPanelStyleBlocks.flatMap((block) => block.match(/\bmargin(?:-block|-inline)?\s*:[^;]+/g) || [])
  .every((declaration) => !/:\s*(?:0(?:px|rem|em|%)?)(?:\s|;|$)|-\s*\d/.test(declaration)), "canonical panel margins must remain positive at every responsive width");
pass(/margin(?:-block)?\s*:\s*(?!0(?:\D|$))(?:[^;]*\s)?auto(?:\s|;|$)/.test(canonicalPanelRule), "canonical panel must be centered with positive block margins");
pass(!/position\s*:\s*(?:fixed|sticky|absolute)/.test(canonicalPanelRule) && !/-\d/.test(canonicalPanelRule), "canonical panel must remain positive-margin normal flow, never fixed, sticky, absolute, or negatively positioned");
pass(/#lid-runtime-v17\[data-active-feature\]\s*~\s*#lid-v18-canonical-entry-panel\s*\{\s*display\s*:\s*none\s*!important\s*;?\s*\}/.test(styles), "active capsules must hide the body-sibling canonical panel with the exact general-sibling rule");
pass(/\.lid-v18-canonical-entry-panel[^{}]*(?:button|\[data-lid-v18-canonical-entry\])\s*\{[^}]*min-height\s*:\s*(?:4[4-9]|5[0-6])px[^}]*\}/s.test(styles), "canonical entry buttons must have at least a 44 px target floor");
pass(/@media\s*\(max-width:\s*(?:480|390)px\)[\s\S]*?(?:canonical-entry[^{}]*(?:ol|list)|canonical-entry-list)[^{]*\{[^}]*grid-template-columns\s*:\s*(?:minmax\(0,\s*)?1fr/.test(styles), "canonical entry list must be exactly one column at 390 and 320 px");
pass(/@media\s*\(forced-colors:\s*active\)[\s\S]*?canonical-entry[\s\S]*?\b(?:Canvas|CanvasText|ButtonFace|ButtonText|Highlight)\b/.test(styles), "canonical panel must retain explicit system-colour forced-colours treatment");
pass(/(?:body\[data-lid-version=["']?18["']?\]|\[data-lid-version=["']?18["']?\])[^{]*\.lid-launcher-v17\s*\{[^}]*display\s*:\s*none\s*!important/.test(styles), "v18 CSS must permanently remove the compatibility launcher from layout");

for (const evidenceContract of [
  "mkdtemp",
  "--headless=new",
  "--remote-debugging-port=",
  "Emulation.setDeviceMetricsOverride",
  "Page.captureScreenshot",
  "window.__LID_QA__",
  "targetVersion",
  "expectedLoadedVersions",
  "--fixture",
  "--scenario",
  "--selector",
  "--motion",
  "--forced-colors",
  "Emulation.setEmulatedMedia",
  "Network.requestWillBeSent",
  "localStorage",
  "sessionStorage",
  "indexedDB",
  "serviceWorkers",
  "sha256",
  "compact-filtered-open",
  "pagination-both-success",
  "captureScenarios",
]) {
  pass(evidence.includes(evidenceContract), `capture-phase2-evidence-v18.mjs is missing ${evidenceContract}`);
}
pass(!/\bfrom\s+["'](?!node:)/.test(evidence), "v18 evidence driver must import only Node built-ins");
pass(evidence.includes("file: basename(options.out)"), "v18 evidence metadata must store only the PNG basename");
pass(!evidence.includes("png: { path: options.out"), "v18 evidence metadata must not store the absolute PNG path");
pass(evidence.includes("values.has(\"--fixture\")") && evidence.includes("values.has(\"--scenario\")"), "v18 evidence driver must validate fixture/scenario argument presence");
pass(evidence.includes("--fixture and --scenario") || evidence.includes("--scenario and --fixture"), "v18 evidence driver must reject fixture and scenario together");
pass(evidence.includes("manifest.captureScenarios"), "v18 evidence driver must validate scenarios against the QA manifest");
pass(!evidence.includes("index-v17.html"), "v18 evidence driver must be target-bound to v18 rather than act as a second v17 route");
pass(evidence.includes('url.pathname !== "/index-v18.html"') && evidence.includes("url.search || url.hash"), "v18 evidence driver must reject every non-exact or state-bearing route");
pass(evidenceHasQuotedSequence(fixtures), "v18 evidence driver must carry the exact ordered 14-fixture allowlist");
pass(evidenceHasQuotedSequence(captureScenarios), "v18 evidence driver must carry the exact ordered two-scenario allowlist");
pass(evidence.includes("manifest.captureScenarios.some((scenario) => manifest.fixtures.includes(scenario))"), "v18 evidence driver must fail when fixture and scenario manifests overlap");
pass(evidence.includes("v18-16-canonical-entry-320-forced.png") && evidence.includes("v18-16-canonical-entry-320-forced.json") && !evidence.includes("v18-16-archive-launcher-320-forced"), "helper help/parser must bind only the canonical frame-16 PNG/JSON basename");
pass(evidence.includes("archive capture is exactly v18 frame 16 at 320x900") && evidence.includes("forced colours active"), "helper help/parser must bind exact frame-16 viewport and media requirements");
const viewportStageKeys = ["initial-compact", "settings-wide", "restored-compact"];
pass(evidenceHasQuotedSequence(viewportStageKeys), "frame 16 must declare the exact three ordered C18-22 viewportStages keys");
pass(evidence.includes("viewportStages"), "frame 16 sidecar must expose ordered viewportStages metadata");
pass((/viewportStages\.length\s*!==\s*3/.test(evidence) || evidence.includes("viewportStages.length !== VIEWPORT_STAGE_KEYS.length"))
  && /arraysEqual\(viewportStages\.map\([\s\S]{0,180}VIEWPORT_STAGE_KEYS/.test(evidence), "helper must fail closed unless viewportStages has exactly three records in the closed Council order");
for (const stageKey of viewportStageKeys) pass(!app.includes(stageKey), `viewport stage ${stageKey} must remain evidence metadata and never enter app state`);
pass(!app.includes("viewportStages") && !app.includes("viewportStage"), "detached app manifest/snapshot must contain no viewport-stage state");

for (const archiveContract of [
  "archiveDiagnostics",
  "canonicalEntry",
  "#lid-v18-canonical-entry-panel",
  "lid-v18-canonical-entry-day",
  "lid-v18-canonical-entry-item",
  "lid-v18-canonical-entry-summary",
  "lid-v18-canonical-entry-artwork",
  "inheritedContextPatchedCount",
  "otherInheritedV18OriginCount",
  "launcherUserSurfaceAbsent",
  "View day history",
  "Before sleep — synthetic fixture",
  "Revisions & provenance",
  "View versions",
  "Back to Settings",
  "Back to More",
  "Back to Journal Day",
  "Back to Source Item",
  "Back to Summary",
  "Back to Generated Artwork",
]) pass(evidence.includes(archiveContract), `v18 evidence driver is missing canonical archive contract: ${archiveContract}`);
pass(evidence.includes("Accessibility.getFullAXTree") || evidence.includes("Accessibility.queryAXTree"), "frame 16 must inspect canonical-panel and launcher accessibility-tree exposure");
pass(evidence.includes('const RETURN_TOLERANCE_PX = 1') || evidence.includes('const ORIGIN_RETURN_TOLERANCE_PX = 1'), "six-origin return tolerance must be exactly one CSS pixel");
pass(evidence.includes("isConnected") && (evidence.includes("isSameNode") || evidence.includes("sameNode")), "frame 16 must prove the same still-connected origin node after return");
pass(evidence.includes("scrollY") && evidence.includes("getBoundingClientRect().top"), "frame 16 must record both scroll and origin viewport-top measurements");
pass(evidence.includes("visibleCount") && evidence.includes("focusableCount") && evidence.includes("hitCount") && (evidence.includes("axCount") || evidence.includes("accessibilityCount")), "launcher retirement diagnostics must record zero visible, focusable, hit, and accessibility counts");
pass(evidenceHasQuotedSequence(["settings", "more"]), "archive diagnostics must bind the exact two native Global-origin tokens in order");
pass(evidence.includes('[data-action="settings-related"][data-label="History"]') && evidence.includes(".more-management"), "frame 16 must reach Global through the actual native Settings and compact More History controls");
pass(occursInOrder(evidence, canonicalEntries.map((entry) => entry.id)), "frame 16 must exercise canonical Day, Item, Summary, and Artwork controls in exact order");
const entryRoundTripSpecs = between(evidence, "const CANONICAL_ENTRY_SPECS", "const GLOBAL_ORIGIN_TOKENS");
const globalEntrySpecs = between(evidence, "const GLOBAL_ENTRY_SPECS", "const GLOBAL_ORIGIN_TOKENS").replace(/\s+/g, "");
pass(occurrences(entryRoundTripSpecs, "expectedSourceCount: 10") === 2 && occurrences(entryRoundTripSpecs, "expectedDerivedCount: 7") === 2 && occurrences(entryRoundTripSpecs, "expectedCount: 17") === 2, "Settings and More round trips must each bind exact 10 Source / 7 Derived / 17 total counts");
pass(occurrences(entryRoundTripSpecs, "expectedSourceCount: 8") === 2 && occurrences(entryRoundTripSpecs, "expectedDerivedCount: 6") === 2 && occurrences(entryRoundTripSpecs, "expectedCount: 14") === 2, "Day and Item round trips must each bind exact 8 Source / 6 Derived / 14 total counts");
pass(occurrences(entryRoundTripSpecs, "expectedSourceCount: 0") === 2 && occurrences(entryRoundTripSpecs, "expectedDerivedCount: 3") === 2 && occurrences(entryRoundTripSpecs, "expectedCount: 3") === 2, "Summary and Artwork round trips must each bind exact 0 Source / 3 Derived / 3 total counts");
pass(occursInOrder(globalEntrySpecs, [
  'originToken:"settings"',
  'activationMethod:"pointer"',
  'closeMethod:"back"',
  'originToken:"more"',
  'activationMethod:"pointer"',
  'closeMethod:"escape"',
]), "frame 16 must use Settings pointer/Back and compact More pointer/Escape in exact order");
pass(occursInOrder(evidence, [
  'activationMethod: "pointer"',
  'closeMethod: "back"',
  'activationMethod: "enter"',
  'closeMethod: "escape"',
  'activationMethod: "space"',
  'closeMethod: "back"',
  'activationMethod: "pointer"',
  'closeMethod: "escape"',
]), "frame 16 must encode exact pointer/Enter/Space and Back/Escape canonical round-trip order");
pass(evidence.includes("finalFocus") && evidence.includes("lid-v18-canonical-entry-artwork"), "frame 16 must end inactive with visible focus on the Artwork entry");
pass(!evidence.includes("inspectArchiveLauncher") && !evidence.includes("closeToArchiveThroughVisibleBackControl"), "the retired launcher-only archive procedure must be removed");
pass(!evidence.includes("archive launcher is not fully visible") && !evidence.includes("archive launcher failed one or more center/corner hit-tests"), "the helper must not retain positive visible-launcher acceptance");
pass(!evidence.includes("after.launcherHidden === false") && !evidence.includes("launcherHidden !== false"), "archive return must never require the retired launcher to become user-visible");
pass(evidence.includes("launcherUserSurfaceAbsent: true") || evidence.includes("launcherUserSurfaceAbsent !== true"), "the helper must fail closed unless launcherUserSurfaceAbsent is true");
pass(!evidence.includes("must be active while its QA manifest and invariants are validated"), "fresh v18 navigation must not assume automatic capsule startup");
pass(evidence.includes("governed") && evidence.includes("activeFeature") && evidence.includes("=== null"), "helper setup must prove fresh inactivity before using a governed visible entry control");
const activeCaptureEntryMap = between(evidence, "function entrySpecForFixture", "async function openGovernedEntryForCapture");
const activeCaptureEntryDriver = between(evidence, "async function openGovernedEntryForCapture", "async function activateNativeNegative");
pass(activeCaptureEntryMap.includes("GLOBAL_ENTRY_SPECS[0]") && activeCaptureEntryMap.includes("GLOBAL_ENTRY_SPECS[1]")
  && activeCaptureEntryDriver.includes("openGlobalOriginSurface") && activeCaptureEntryDriver.includes('matchMedia("(max-width: 960px)").matches')
  && !activeCaptureEntryDriver.includes("1023")
  && activeCaptureEntryDriver.includes("compactSpec"), "active Global/hidden/transient/scenario captures must use the visible responsive native Settings or compact More History origin, never a mismatched canonical origin");
pass(activeCaptureEntryMap.includes('fixture === "day-ready"') && activeCaptureEntryMap.includes("CANONICAL_ENTRY_SPECS[0]")
  && activeCaptureEntryMap.includes('"item-ready", "upstream-revised", "upstream-conflict", "upstream-untagged", "upstream-deleted"') && activeCaptureEntryMap.includes("CANONICAL_ENTRY_SPECS[1]")
  && activeCaptureEntryMap.includes('fixture === "field-ready"') && activeCaptureEntryMap.includes("CANONICAL_ENTRY_SPECS[2]")
  && activeCaptureEntryMap.includes('fixture === "artwork-ready"') && activeCaptureEntryMap.includes("CANONICAL_ENTRY_SPECS[3]"), "active contextual captures must enter through the matching Day, Item, Summary, or Artwork canonical control");
pass(activeCaptureEntryDriver.includes("CDP visible native Settings History pointer activation")
  && activeCaptureEntryDriver.includes("CDP visible native compact More History pointer activation")
  && activeCaptureEntryDriver.includes("CDP visible canonical-entry pointer activation")
  && activeCaptureEntryDriver.includes('kind === "global"'), "active capture metadata must truthfully distinguish responsive native Global entry from canonical contextual entry");
const canonicalArchiveGeometryDriver = between(evidence, "async function inspectCanonicalPanelGeometry", "async function runCanonicalArchiveDiagnostics");
pass(canonicalArchiveGeometryDriver.includes("Math.min(1128, innerWidth - 32)") && canonicalArchiveGeometryDriver.includes("widthDelta") && /Math\.abs\([^)]*widthDelta[^)]*\)\s*>\s*1/.test(canonicalArchiveGeometryDriver), "frame 16 geometry must fail closed unless the panel has the exact 32 px-gutter width within one CSS pixel");
pass(canonicalArchiveGeometryDriver.includes("structure.panelCount !== 1") && canonicalArchiveGeometryDriver.includes("!structure.directBodyChild") && canonicalArchiveGeometryDriver.includes("!structure.afterPrototypeRoot") && canonicalArchiveGeometryDriver.includes("!structure.beforeModalRoot"), "frame 16 must fail closed on wrong canonical panel cardinality or direct body-sibling placement");
pass(canonicalArchiveGeometryDriver.includes("arraysEqual(structure.copy, CANONICAL_ENTRY_COPY)") && canonicalArchiveGeometryDriver.includes("arraysEqual(structure.facts, expectedFacts)") && canonicalArchiveGeometryDriver.includes("describedBy") && canonicalArchiveGeometryDriver.includes("arraysEqual(structure.buttons.map"), "frame 16 must fail closed on wrong canonical copy, fact/button order, IDs, tokens, accessible names, or fact descriptions");
const nativeNegativeActivationDriver = between(evidence, "async function activateNativeNegative", "async function prepareTwoAugustNativeNegatives");
pass(nativeNegativeActivationDriver.includes("before.visible") && nativeNegativeActivationDriver.includes("before.enabled")
  && nativeNegativeActivationDriver.includes("before.centerHitWithinControl") && nativeNegativeActivationDriver.includes("before.text !== spec.expectedText")
  && nativeNegativeActivationDriver.includes("after.connected") && nativeNegativeActivationDriver.includes("after.visible")
  && nativeNegativeActivationDriver.includes("after.enabled") && nativeNegativeActivationDriver.includes("after.centerHitWithinControl")
  && nativeNegativeActivationDriver.includes("attributesUnchanged") && nativeNegativeActivationDriver.includes("observed.activeFeature === null"), "native negative proof must independently require exact connected, visible, enabled, centre-hit controls before and after real v16 activation while v18 stays inactive");
const artworkGenerationDriver = between(evidence, "async function ensureTwoAugustArtworkControl", "async function selectorIsVisiblyActionable");
pass(artworkGenerationDriver.includes('[data-action="view-art-history"]')
  && artworkGenerationDriver.includes('[data-action="trigger-art"][data-date="2026-08-02"]')
  && artworkGenerationDriver.includes('[data-action="confirm-art"][data-date="2026-08-02"]')
  && artworkGenerationDriver.includes("2 Aug native View versions control")
  && artworkGenerationDriver.includes("actual native v16 synthetic browser-memory artwork generation")
  && artworkGenerationDriver.includes("activeFeature !== null"), "frame 16 must generate missing 2 Aug artwork through the actual native v16 flow and reacquire View versions without opening v18");
const nativeNegativeDiagnosticsDriver = between(evidence, "async function runNativeNegativeDiagnostics", "async function openGlobalOriginSurface");
pass(occursInOrder(nativeNegativeDiagnosticsDriver, [
  "await prepareTwoAugustNativeNegatives(client)",
  "const artworkSetup = await ensureTwoAugustArtworkControl(client)",
  'key: "artwork"',
  'expectedText: "View versions"',
  "nativeNegativeAnchors",
]), "frame 16 must generate/reacquire artwork before the exact View versions native-negative proof");
pass(nativeNegativeDiagnosticsDriver.includes("final.nativeNegativeAnchors?.exactWhenRepresented !== true")
  && nativeNegativeDiagnosticsDriver.includes("artworkSetup, records"), "frame 16 must retain independent artwork setup, activation records, and final native-negative truth");
const ineligibleOriginProbeDriver = between(evidence, "async function runIneligibleGlobalOriginProbe", "async function resetOriginBreakpointRegressionPage");
const originBreakpointRegressionDriver = between(evidence, "async function resetOriginBreakpointRegressionPage", "async function inspectCanonicalPanelGeometry");
pass(ineligibleOriginProbeDriver.includes("eligible") || ineligibleOriginProbeDriver.includes("ineligible"), "frame 16 must retain a bounded ineligible-origin probe");
pass(ineligibleOriginProbeDriver.includes("document.addEventListener(\"click\", observeAfterV18DocumentCapture, { capture: true, once: true })")
  && ineligibleOriginProbeDriver.includes("defaultPrevented === false")
  && ineligibleOriginProbeDriver.includes("propagationStopped === false")
  && ineligibleOriginProbeDriver.includes("appSnapshotUnchanged === true")
  && ineligibleOriginProbeDriver.includes("focusUnchanged === true")
  && ineligibleOriginProbeDriver.includes("scrollUnchanged === true")
  && ineligibleOriginProbeDriver.includes("liveRegionsUnchanged === true")
  && ineligibleOriginProbeDriver.includes("viewModalToastUnchanged === true")
  && ineligibleOriginProbeDriver.includes("frozenPassthroughObservedWithoutSuppression"), "hidden Settings and wide-ineligible More must be exact V18 no-ops at document capture without suppressing frozen behavior");
pass(ineligibleOriginProbeDriver.includes('observation.viewport.width === spec.expectedWidth')
  && ineligibleOriginProbeDriver.includes('observation.moreOriginSurface')
  && ineligibleOriginProbeDriver.includes('observation.compactFilterSurface')
  && ineligibleOriginProbeDriver.includes("!observation.triggerBefore.rendered")
  && ineligibleOriginProbeDriver.includes("accessibility.axCount === 0")
  && ineligibleOriginProbeDriver.includes("!observation.launcherBefore.rendered")
  && ineligibleOriginProbeDriver.includes("launcherAccessibility?.axCount === 0"), "origin negatives must bind their exact width, 960/961 origin surface, separate 1023 filter surface, hidden responsive family, and zero AX exposure");
pass(originBreakpointRegressionDriver.includes("[320, 960, 961, 1023]")
  && originBreakpointRegressionDriver.includes('{ width: 960, positive: GLOBAL_ENTRY_SPECS[1], negativeToken: "settings" }')
  && originBreakpointRegressionDriver.includes('{ width: 961, positive: GLOBAL_ENTRY_SPECS[0], negativeToken: "more" }')
  && originBreakpointRegressionDriver.includes('{ width: 1023, positive: GLOBAL_ENTRY_SPECS[0], negativeToken: "more" }')
  && originBreakpointRegressionDriver.includes('moreOriginSurface: matchMedia("(max-width: 960px)").matches')
  && originBreakpointRegressionDriver.includes('compactFilterSurface: matchMedia("(max-width: 1023px)").matches')
  && originBreakpointRegressionDriver.includes('Math.abs(positive.return.independentScrollDelta) > ORIGIN_RETURN_TOLERANCE_PX')
  && originBreakpointRegressionDriver.includes('Math.abs(positive.return.independentTopDelta) > ORIGIN_RETURN_TOLERANCE_PX')
  && originBreakpointRegressionDriver.includes('positive.return.app?.consumed !== true')
  && originBreakpointRegressionDriver.includes('negative.v18DocumentCaptureBoundary?.defaultPrevented !== false')
  && originBreakpointRegressionDriver.includes('negative.v18DocumentCaptureBoundary?.propagationStopped !== false')
  && originBreakpointRegressionDriver.includes('frame16ViewportStagesUnchanged: true'), "helper breakpoint regression must prove 960 More, 961/1023 Settings, opposite-origin V18 no-ops, one-pixel consumed returns, and filter-breakpoint independence");
const governedRoundTripDriver = between(evidence, "async function runEntryRoundTrip", "async function launcherRetirementDiagnostics");
const governedPostBaselineDriver = governedRoundTripDriver.slice(governedRoundTripDriver.indexOf("const before ="));
pass(occursInOrder(governedRoundTripDriver, ["await scrollRemoteIntoView", "const before = await inspectRemoteControl", "await activateRetainedControl", "await closeGovernedHistory", "const after = await inspectRemoteControl"]), "six-origin helper must measure the retained control before activation and after the governed close in exact order");
pass(!/(?:scrollRemoteIntoView|scrollIntoView|window\.scroll|focusRemoteElement|DOM\.focus|setEvidenceViewport|setDeviceMetricsOverride|setVisibleSize)/.test(governedPostBaselineDriver), "six-origin helper must remain passive from baseline through return and never scroll, focus, resize, or compensate");
pass(!/(?:\.style\b|setAttribute\(|classList\.|append\(|prepend\(|insertBefore\(|replaceChildren\(|\.remove\(\))/.test(governedPostBaselineDriver), "six-origin helper must not mutate DOM, CSS, or layout from baseline through return proof");
pass(governedRoundTripDriver.includes("active.laneCounts.source !== spec.expectedSourceCount") && governedRoundTripDriver.includes("active.laneCounts.derived !== spec.expectedDerivedCount") && governedRoundTripDriver.includes("laneCounts: active.laneCounts"), "each frame-16 round trip must validate and record exact Source and Derived lane counts as well as total count");
pass(governedRoundTripDriver.includes("viewportStage") && governedRoundTripDriver.includes("requested")
  && governedRoundTripDriver.includes("before.viewport") && governedRoundTripDriver.includes("active.viewport") && governedRoundTripDriver.includes("after.viewport"), "each frame-16 trip must record its stage and requested/observed before-active-after dimensions");
pass(governedRoundTripDriver.includes("accessibilityForSelector") && governedRoundTripDriver.includes("centerHitWithinControl"), "each frame-16 trip must prove its real origin is visible, enabled, centre-hit-testable, and accessibility-exposed");
pass(governedRoundTripDriver.includes("domain") && governedRoundTripDriver.includes("counters") && governedRoundTripDriver.includes("consumed"), "each frame-16 trip must record unchanged domain, 0/0/0 counters, and consumed return state");

const canonicalArchiveDriver = between(evidence, "async function runCanonicalArchiveDiagnostics", "function pngDimensions");
const frame16EnvironmentPipeline = between(evidence, "async function inspectEvidenceEnvironment", "function pngDimensions");
const finalCompactProofDriver = canonicalArchiveDriver.slice(canonicalArchiveDriver.indexOf("const final"));
pass(canonicalArchiveDriver.includes("const originBreakpointRegression = await runGlobalOriginBreakpointRegression(client)")
  && canonicalArchiveDriver.includes("originBreakpointRegression,")
  && canonicalArchiveDriver.includes("const nativeNegative = await runNativeNegativeDiagnostics(client)")
  && canonicalArchiveDriver.includes("nativeNegative,")
  && canonicalArchiveDriver.includes("ineligibleOriginProbes")
  && canonicalArchiveDriver.includes('map((record) => record.originToken), ["settings", "more"]'), "frame 16 must execute and retain generated-artwork negatives plus exact Settings/More responsive-ineligibility probes independently of six positive trips");
pass(canonicalArchiveDriver.includes('originToken: "settings",\n    expectedWidth: 320')
  && canonicalArchiveDriver.includes('originToken: "more",\n    expectedWidth: 1024'), "frame 16 must retain the 320 Settings-negative and 1024 More-negative regressions alongside the separate 960/961/1023 matrix");
pass(occursInOrder(canonicalArchiveDriver, [
  "setEvidenceViewport(client, 1024, 900)",
  "GLOBAL_ENTRY_SPECS[0]",
  "runEntryRoundTrip(client, settingsSpec",
  "setEvidenceViewport(client, 320, 900)",
  "GLOBAL_ENTRY_SPECS[1]",
  "runEntryRoundTrip(client, moreSpec",
  "for (const spec of CANONICAL_ENTRY_SPECS)",
  "runEntryRoundTrip(client, spec",
]), "frame 16 must execute wide Settings, restore compact, then More and four canonical trips in exact order");
pass(occurrences(canonicalArchiveDriver, "setEvidenceViewport(client,") === 2, "frame 16 must perform exactly two environment resizes between completed trips");
pass(!canonicalArchiveDriver.includes("__LID_QA__.setFixture") && !canonicalArchiveDriver.includes("__LID_QA__.dispatch"), "frame-16 viewport staging must not drive fixture, scenario, or domain state through QA");
pass(frame16EnvironmentPipeline.includes("activeFeature") && frame16EnvironmentPipeline.includes("pending")
  && frame16EnvironmentPipeline.includes("consumed") && frame16EnvironmentPipeline.includes("announcement")
  && frame16EnvironmentPipeline.includes("domain") && frame16EnvironmentPipeline.includes("counters"), "every resize boundary must fail closed unless inactive, no return/announcement is pending, restoration is consumed, domain is unchanged, and counters are 0/0/0");
pass(frame16EnvironmentPipeline.includes("settings-wide") && frame16EnvironmentPipeline.includes("1024")
  && frame16EnvironmentPipeline.includes("restored-compact") && frame16EnvironmentPipeline.includes("320"), "Settings must be wholly measured at 1024x900 and the other five trips wholly at 320x900");
pass(frame16EnvironmentPipeline.includes("devicePixelRatio") && frame16EnvironmentPipeline.includes("matchMedia"), "viewport stages and trips must record exact density and emulated media as well as dimensions");
pass(finalCompactProofDriver.includes("gridTemplateColumns") && finalCompactProofDriver.includes("scrollWidth")
  && finalCompactProofDriver.includes("lid-v18-canonical-entry-artwork"), "final compact proof must re-query one panel column, no horizontal overflow, and visible Artwork focus");
pass(finalCompactProofDriver.includes('data-action="settings-related"') && finalCompactProofDriver.includes("more-management")
  && finalCompactProofDriver.includes("accessibilityForSelector"), "final compact proof must re-query desktop Settings hidden and compact More visible, enabled, hit-testable, and accessibility-reachable");

const scenarioActionManifest = between(evidence, "const CAPTURE_SCENARIO_ACTIONS", "const SOURCE_ORDER");
pass(occursInOrder(scenarioActionManifest, [
  '"compact-filtered-open"',
  '{ type: "open-filter" }',
  '{ type: "draft-lane", payload: { value: "source" } }',
  '{ type: "draft-attention", payload: { value: "needs" } }',
  '{ type: "apply-filters" }',
  '{ type: "open-filter" }',
  '"pagination-both-success"',
  '{ type: "enter-pagination" }',
  '{ type: "load-source" }',
  '{ type: "deliver-source-success" }',
  '{ type: "load-derived" }',
  '{ type: "deliver-derived-success" }',
]), "v18 evidence driver must declare the exact ordered action recipe for both scenarios");

const compactScenarioDriver = between(evidence, "async function runCompactFilteredScenario", "async function runPaginationScenario");
pass((compactScenarioDriver.match(/runActualClickStep/g) || []).length === 2, "compact-filtered-open must pointer-activate the initial native summary and Apply through real controls");
pass((compactScenarioDriver.match(/runActualKeyboardActivationStep/g) || []).length === 1, "compact-filtered-open must reopen the final native summary through real keyboard-visible activation");
pass((compactScenarioDriver.match(/runActualSelectChangeStep/g) || []).length === 2, "compact-filtered-open must change History lane and Attention through their real controls");
pass(occursInOrder(compactScenarioDriver, [
  'type: "open-filter"',
  'type: "draft-lane"',
  'expectedValue: "source"',
  'type: "draft-attention"',
  'expectedValue: "needs"',
  'type: "apply-filters"',
  'applied.focus?.id !== "lid-v18-results-title"',
  'name: "Filter history · 2 active"',
  'final.focus?.focusKey !== "filter-summary"',
]), "compact-filtered-open must prove the exact native-control order, result focus, reopen, and final summary focus");
pass(compactScenarioDriver.includes('Boolean(document.querySelector("[data-lid-v18-filter-details]")?.open)'), "compact-filtered-open must observe the actual native details open state");

const paginationScenarioDriver = between(evidence, "async function runPaginationScenario", "async function runScenario");
for (const type of ["load-source", "load-derived"]) {
  pass(new RegExp(`runActualClickStep\\(client, transcript, \\{\\s*type: "${type}"`).test(paginationScenarioDriver), `${type} must use its actual visible per-lane Load control`);
}
for (const type of ["enter-pagination", "deliver-source-success", "deliver-derived-success"]) {
  pass(new RegExp(`runQaStep\\(client, transcript, \\{\\s*type: "${type}"`).test(paginationScenarioDriver), `${type} must be an allowlisted QA-only synthetic transition`);
}
pass(!paginationScenarioDriver.includes("actual-visible-synthetic-delivery-control"), "synthetic success delivery must not masquerade as a visible user control");
pass(!/runActualClickStep\(client, transcript, \{\s*type:\s*"deliver-(?:source|derived)-success"/.test(paginationScenarioDriver), "synthetic Source/Derived success must not use actual-control activation");
pass(/runQaStep\(client, transcript, \{\s*type:\s*"deliver-source-success"[\s\S]*?anchor:\s*\{\s*selector:\s*"#lid-v18-load-source"/.test(paginationScenarioDriver), "Source synthetic delivery must retain the logical Source visual anchor");
pass(/runQaStep\(client, transcript, \{\s*type:\s*"deliver-derived-success"[\s\S]*?anchor:\s*\{\s*selector:\s*"#lid-v18-load-derived"/.test(paginationScenarioDriver), "Derived synthetic delivery must retain the logical Derived visual anchor");
pass(/type:\s*"deliver-source-success"[\s\S]{0,240}payload:\s*\{\s*lane:\s*"source",\s*requestGeneration:\s*sourcePending\.summary\.pagination\.source\.requestGeneration\s*\}/.test(paginationScenarioDriver)
  && /type:\s*"deliver-derived-success"[\s\S]{0,240}payload:\s*\{\s*lane:\s*"derived",\s*requestGeneration:\s*derivedPending\.summary\.pagination\.derived\.requestGeneration\s*\}/.test(paginationScenarioDriver), "frame-14 QA success deliveries must supply their explicit positive exact same-lane current generation");
pass(paginationScenarioDriver.includes("SOURCE_ORDER") && paginationScenarioDriver.includes("DERIVED_ORDER") && paginationScenarioDriver.includes("totalCount !== 17"), "pagination scenario must finish with exact 10/7/17 ordering");

const strictPaginationNoOpDriver = between(evidence, "async function assertStrictPaginationNoOp", "function exactPaginationTuple");
const terminalGenerationRegressionDriver = between(evidence, "async function runTerminalGenerationRegression", "async function runPaginationActivationRegression");
const paginationActivationRegressionDriver = between(evidence, "async function runPaginationActivationRegression", "async function runFilteredPaginationCompletionRegression");
const filteredCompletionRegressionDriver = between(evidence, "async function runFilteredPaginationCompletionRegression", "async function runQa2PaginationRegression");
const qa2PaginationRegressionDriver = between(evidence, "async function runQa2PaginationRegression", "async function waitForInteractionSettled");
pass(strictPaginationNoOpDriver.includes("before.digestSha256 !== after.digestSha256")
  && strictPaginationNoOpDriver.includes("!arraysEqual(before, after)")
  && strictPaginationNoOpDriver.includes("exactStateFocusAnnouncementAnchorDigestCountersNoOp: true"), "QA2 terminal rejection probes must fail closed on any state, focus, announcement, anchor, digest, counter, DOM, or navigation drift");
for (const rejectionLabel of [
  "omitted payload", "missing generation", "zero generation", "negative generation", "fractional generation", "string generation",
  "future generation", "cross-lane", "conflicting generation aliases", "duplicate while pending", "settle missing outcome",
  "consumed failure generation", "stale generation after retry", "consumed duplicate generation",
]) pass(terminalGenerationRegressionDriver.includes(rejectionLabel), `QA2 terminal matrix is missing strict no-op branch: ${rejectionLabel}`);
for (const acceptedPath of [
  '"pagination-failure", { lane: "source", generation: 1 }',
  '"settle-pagination", { lane: "source", requestGeneration: 2, outcome: "interruption" }',
  '"deliver-source-success", { lane: "source", requestGeneration: 3 }',
  '"pagination-duplicate", { lane: "source", requestGeneration: 4 }',
  '"deliver-derived-interruption", { lane: "derived", requestGeneration: 1 }',
  '"pagination-success", { lane: "derived", requestGeneration: 2 }',
  '"settle-pagination", { lane: "derived", requestGeneration: 3, outcome: "duplicate" }',
]) pass(terminalGenerationRegressionDriver.includes(acceptedPath), `QA2 terminal matrix is missing accepted exact-generation path: ${acceptedPath}`);
pass(paginationActivationRegressionDriver.includes('for (const method of ["pointer", "enter", "space", "click-only"])')
  && paginationActivationRegressionDriver.includes("dispatchVisibleMouseClick")
  && paginationActivationRegressionDriver.includes("dispatchKeyboardEnterActivation")
  && paginationActivationRegressionDriver.includes('dispatchKeyboardKey(client, " ", "Space", 32, " ")')
  && paginationActivationRegressionDriver.includes('.click()`')
  && paginationActivationRegressionDriver.includes("pagePending.anchor.baseline?.input !== method")
  && paginationActivationRegressionDriver.includes("requestGeneration !== 1")
  && paginationActivationRegressionDriver.includes("anchoredStrictNoOps")
  && paginationActivationRegressionDriver.includes("confirmed-anchor future terminal")
  && paginationActivationRegressionDriver.includes("confirmedAnchorNoOpCount")
  && paginationActivationRegressionDriver.includes("Math.abs(restoration?.delta ?? Infinity) > ANCHOR_TOLERANCE_PX")
  && paginationActivationRegressionDriver.includes("postBaselineHelperFocusScrollCompensation: false")
  && paginationActivationRegressionDriver.includes("assistiveTechnologyClaim: false"), "frame 14 must prove pointer, Enter, Space, and click-only app-owned anchors within one pixel, without helper repair or an AT claim");
pass(paginationActivationRegressionDriver.includes('[data-lid-action="deliver-source-success"]')
  && paginationActivationRegressionDriver.includes("sourceOutcomeControls.length !== 3")
  && paginationActivationRegressionDriver.includes('control.generation !== "1"')
  && paginationActivationRegressionDriver.includes('[data-lid-action="duplicate-source"]')
  && paginationActivationRegressionDriver.includes("duplicatePage.requestGeneration !== 2"), "frame 14 must exercise exact visible generation bindings and a click-only duplicate without double capture");
pass(filteredCompletionRegressionDriver.includes('["E14", "E13", "E12"]')
  && filteredCompletionRegressionDriver.includes("filtered.dom.completion.count !== 0")
  && filteredCompletionRegressionDriver.includes("filteredAccessibility.present")
  && filteredCompletionRegressionDriver.includes("cleared.dom.completion.count !== 1")
  && filteredCompletionRegressionDriver.includes("!arraysEqual(paginationAfterClear, paginationBeforeFilter)")
  && filteredCompletionRegressionDriver.includes("noDeliveryResetGenerationDrift: true"), "frame 14 must suppress filtered completion in DOM/AX and restore exact unfiltered 10/7 state without pagination drift");
pass(qa2PaginationRegressionDriver.includes("terminalGenerations") && qa2PaginationRegressionDriver.includes("activations")
  && qa2PaginationRegressionDriver.includes("filteredCompletion") && qa2PaginationRegressionDriver.includes("transcriptRecordCountAdded: 0")
  && evidence.includes('if (options.scenario === "pagination-both-success")')
  && evidence.includes("qa2PaginationRegression = await runQa2PaginationRegression(client)")
  && evidence.includes("qa2PaginationRegression,"), "QA2 regression metadata must run only before frame 14, add no transcript records, and be retained in its sidecar");

const qaStepDriver = between(evidence, "async function runQaStep", "async function dispatchPaginationAuditAction");
const anchorEvidenceDriver = between(evidence, "function buildAnchorEvidence", "async function dispatchVisibleMouseClick");
pass(qaStepDriver.includes("inspectLogicalAnchor") && qaStepDriver.includes("buildAnchorEvidence") && anchorEvidenceDriver.includes("topDelta") && anchorEvidenceDriver.includes("Math.abs(topDelta) <= ANCHOR_TOLERANCE_PX"), "QA synthetic delivery must assert visual-anchor rectangle stability");
pass(evidence.includes("const ANCHOR_TOLERANCE_PX = 1"), "scenario visual-anchor tolerance must be exactly one CSS pixel");
pass(!/window\.scroll(?:By|To)|scrollIntoView/.test(`${qaStepDriver}\n${anchorEvidenceDriver}`), "QA success and anchor comparison must remain passive rather than driver-compensating scroll");
pass(evidence.includes("getBoundingClientRect()") && evidence.includes("beforeTop") && evidence.includes("afterTop") && evidence.includes("topDelta"), "visual-anchor evidence must use bounding-rectangle top deltas");
pass(!/(?:scrollY|scrollX|scroll\.x|scroll\.y)[^\n]*(?:===|!==)|(?:===|!==)[^\n]*(?:scrollY|scrollX|scroll\.x|scroll\.y)/.test(`${qaStepDriver}\n${anchorEvidenceDriver}`), "visual-anchor acceptance must not require scroll-coordinate equality");
const seedScenarioDriver = between(evidence, "async function seedScenario", "async function runCompactFilteredScenario");
const runScenarioDriver = between(evidence, "async function runScenario", "async function inspectItemReadyFrameState");
const actualClickDriver = between(evidence, "async function runActualClickStep", "async function dispatchKeyboardKey");
const actualSelectDriver = between(evidence, "async function runActualSelectChangeStep", "async function seedScenario");
pass(!seedScenarioDriver.includes("transcript") && !evidence.includes('type: "seed"'), "fixture setup must not create a scenario-transcript record");
pass(runScenarioDriver.includes("const expectedTypes = CAPTURE_SCENARIO_ACTIONS[scenario].map") && !runScenarioDriver.includes('["seed"'), "each scenario transcript must contain only its exact five governed transitions");
pass(runScenarioDriver.includes('seedFixture: "global-ready"') && evidence.includes('seedFixture: options.scenario ? "global-ready" : options.fixture'), "scenario fixture setup must be represented in bounded metadata instead of the transcript");
pass(qaStepDriver.includes("actualUserStep: false") && actualClickDriver.includes("actualUserStep: true") && actualSelectDriver.includes("actualUserStep: true"), "QA and real-control transcript methods must expose truthful actualUserStep flags");
pass(runScenarioDriver.includes('["visible-control", "visible-control", "visible-control", "visible-control", "visible-control"]'), "compact transcript flags must be exactly [true,true,true,true,true]");
pass(runScenarioDriver.includes('["qa-transition", "visible-control", "qa-transition", "visible-control", "qa-transition"]'), "pagination transcript flags must be exactly [false,true,false,true,false]");

const paginationCompletionApp = between(app, "function paginationCompletionSummary", "function historyResults");
pass(paginationCompletionApp.includes('["complete-delivered", "complete-duplicate"]')
  && paginationCompletionApp.includes("activeFilterCount(state.appliedFilters) !== 0")
  && paginationCompletionApp.includes('source.added !== 3 || derived.added !== 3')
  && paginationCompletionApp.includes("const sourceEndReached = completeStages.includes(source.stage)")
  && paginationCompletionApp.includes("const derivedEndReached = completeStages.includes(derived.stage)")
  && paginationCompletionApp.includes('!sourceEndReached || !derivedEndReached')
  && paginationCompletionApp.includes('baseLaneKeys(state, "source").length')
  && paginationCompletionApp.includes('baseLaneKeys(state, "derived").length'), "the visible pagination completion summary must be absent under every applied filter and otherwise fail closed unless both lanes added exactly three and reached their beginning");
for (const copy of [
  "Earlier-history completion",
  "Both lanes reached their represented beginning",
  "Source history",
  "Derived history",
  "Exactly 3 earlier added · Beginning reached",
]) pass(paginationCompletionApp.includes(copy), `pagination completion summary is missing exact truthful copy: ${copy}`);
pass(app.includes('${lane(state, "source")}${lane(state, "derived")}${paginationCompletionSummary(state)}'), "the completion summary must follow both ordinary lane lists without replacing them");
const clearFiltersApp = between(app, 'if (action.type === "clear-filters")', 'if (action.type === "set-disclosure"');
pass(clearFiltersApp.includes('next.draftFilters = { ...DEFAULT_FILTERS }')
  && clearFiltersApp.includes('next.appliedFilters = { ...DEFAULT_FILTERS }')
  && !clearFiltersApp.includes("freshPagination") && !clearFiltersApp.includes("clearPaginationAnchorState"), "Clear filters must restore the unfiltered 10/7 completion summary without resetting delivery, generation, or anchor state");
const paginationCompletionStyles = between(styles, ".lid-pagination-completion-v18 {", ".lid-history-lane-v18 > header");
pass(paginationCompletionStyles.includes("display: grid") && paginationCompletionStyles.includes("margin-top: 24px")
  && !/position:\s*(?:fixed|sticky|absolute)/.test(paginationCompletionStyles), "pagination completion must remain a normal-flow compact summary, never an overlay");
pass(styles.includes(".lid-beginning-v18:focus") && styles.includes("outline: 3px solid"), "app-restored pagination beginning focus must remain visibly rendered");

const scopeSummaryApp = between(app, "function scopeSummary(state)", "function sourceContext(state)");
pass(occurrences(scopeSummaryApp, '["Current source context", "Correction 1 · Displayed"]') === 1
  && occurrences(scopeSummaryApp, '["Latest event-time Journal Date", "18 Aug 2026 → 17 Aug 2026"]') === 1
  && occursInOrder(scopeSummaryApp, [
    '["Journal Date", "17 Aug 2026"]',
    '["Current source context", "Correction 1 · Displayed"]',
    '["Latest event-time Journal Date", "18 Aug 2026 → 17 Aug 2026"]',
    '["Ordinary visibility", "Visible"]',
  ]), "Day scope must expose the exact current-context and event-time Journal Date rows directly after the current Journal Date row");
pass(!scopeSummaryApp.includes(sourceProseCorrection)
  && !scopeSummaryApp.includes(sourceProseRevision2)
  && !scopeSummaryApp.includes("SOURCE_CONTEXT_PROSE"), "Day scope summary rows must not duplicate protected source-context prose");
pass(occurrences(scopeSummaryApp, '["Source lane", "2 retained events"]') === 1
  && occurrences(scopeSummaryApp, '["Derived lane", "1 retained event"]') === 1
  && !scopeSummaryApp.includes('["Retained events", "2 Source · 1 Derived"]'), "hidden-day summary must expose separate truthful Source and Derived retained-event rows");

const eventCardApp = between(app, "function eventCard(state, key)", "function paginationControl(state, lane)");
pass(eventCardApp.includes('const revisedRetention = state.fixture === "upstream-revised" && key === "E04"')
  && occurrences(eventCardApp, '<p class="lid-journal-date-v18"><strong>Retained Source Revisions</strong> · Revision 1 · Revision 2</p>') === 1
  && occursInOrder(eventCardApp, ["${revisedRetention}", "Journal Date at this event", "${record.external ?"]), "only upstream-revised E04 may add the exact retained Revision 1 and Revision 2 proof line before the unchanged event facts");

const historyResultsApp = between(app, "function historyResults(state)", "function consolePanel(state)");
const canonicalEmptyBack = '<button type="button" data-lid-action="close-feature">Back to Settings</button>';
pass(historyResultsApp.includes('const canonicalFixture = state.fixture === "empty"')
  && occurrences(historyResultsApp, canonicalEmptyBack) === 1
  && historyResultsApp.includes("const canonicalBack = canonicalFixture")
  && historyResultsApp.includes("${canonicalBack}</section>"), "only the canonical top-level empty fixture may render one in-panel Back to Settings action");
pass(/\.lid-v18-shell button,\s*\n\.lid-v18-shell summary,[\s\S]*?min-height:\s*44px/.test(styles), "the canonical empty in-panel close action must inherit the existing 44 px control floor");

const mediumE12CompactionStyles = between(styles, "@media (min-width: 721px) and (max-width: 1023px)", "@media (max-width: 568px)");
const mediumE12RuleBody = mediumE12CompactionStyles.slice(mediumE12CompactionStyles.indexOf("{") + 1);
const mediumE12Declarations = [...mediumE12RuleBody.matchAll(/([a-z-]+)\s*:\s*[^;{}]+;/g)].map((match) => match[1]);
pass(mediumE12CompactionStyles.includes('[data-lid-v18-event="E12"] .lid-event-details-v18[open]')
  && mediumE12CompactionStyles.includes("margin-top: 12px")
  && mediumE12CompactionStyles.includes('[data-lid-v18-event="E12"] .lid-relations-v18 h4')
  && mediumE12CompactionStyles.includes("margin-block: 12px 2px")
  && mediumE12Declarations.length === 5
  && mediumE12Declarations.every((property) => ["margin-top", "padding-block", "margin-block"].includes(property))
  && !/(?:font|line-height|display|position|overflow|transform|clip|height|width)\s*:/.test(mediumE12RuleBody), "medium E12 compaction must be whitespace-only, preserve at least 12 px section separation, and leave semantics and focus behavior untouched");

const compactCanonicalStyles = between(styles, "@media (max-width: 480px)", "@media (max-height: 420px)");
const compactCanonicalPanelStyles = between(compactCanonicalStyles, ".lid-v18-canonical-entry-panel {", ".lid-main-v18 {");
pass(compactCanonicalPanelStyles.includes("margin-block: 24px max(104px, calc(88px + env(safe-area-inset-bottom)))")
  && compactCanonicalPanelStyles.includes("padding: 14px")
  && compactCanonicalPanelStyles.includes("padding-block: 10px")
  && compactCanonicalPanelStyles.includes("min-height: 44px")
  && !/(?:font-size|line-height|position|overflow|transform|clip-path)\s*:/.test(compactCanonicalPanelStyles), "compact canonical safe-area repair must use only ordinary-flow spacing and must not shrink or clip copy");

const framingSpecDriver = between(evidence, "const CAPTURE_FRAMING_SPECS", "const SOURCE_ORDER");
const framedEvidenceKeys = [
  "v18-02-day-ready-wide-dark",
  "v18-03-item-conflict-medium-light",
  "v18-05-artwork-ready-compact-dark",
  "v18-06-upstream-revised-medium-light",
  "v18-07-upstream-untagged-compact-light",
  "v18-08-upstream-deleted-compact-dark",
  "v18-09-hidden-day-compact-light",
  "v18-10-filter-open-compact-dark",
  "v18-11-loading-landscape-light",
  "v18-12-interrupted-320-forced",
  "v18-13-failure-medium-light",
  "v18-14-load-earlier-wide-dark",
  "v18-15-empty-320-light",
];
pass(framedEvidenceKeys.every((key) => occurrences(framingSpecDriver, `"${key}"`) === 1), "the evidence driver must declare one exact fail-closed framing recipe for every affected Round 1 frame");
const frame03FramingSpec = between(framingSpecDriver, '"v18-03-item-conflict-medium-light"', '"v18-05-artwork-ready-compact-dark"');
pass(frame03FramingSpec.includes("safeTop: 68")
  && frame03FramingSpec.includes("item-conflict")
  && frame03FramingSpec.includes("item-event-sequence-group")
  && frame03FramingSpec.includes("item-record-lineage-group"), "frame 03 must reserve the medium sticky-header boundary and prove the expanded E12 conflict plus both relationship groups");
const frame11FramingSpec = between(framingSpecDriver, '"v18-11-loading-landscape-light"', '"v18-12-interrupted-320-forced"');
pass(frame11FramingSpec.includes('fixture: "loading", scenario: null, width: 568, height: 320')
  && frame11FramingSpec.includes("safeTop: 52, safeBottom: 16, loadingContract: true")
  && !frame11FramingSpec.includes("focusSelector")
  && frame11FramingSpec.includes("loading-source-lane-boundary")
  && frame11FramingSpec.includes('h2#lid-v18-loading-source-title')
  && frame11FramingSpec.includes('h3#lid-v18-loading-title')
  && frame11FramingSpec.includes('.lid-loading-status-v18 > p')
  && frame11FramingSpec.includes("Preparing separate Source and Derived event lists from synthetic browser-memory fixtures."), "frame 11 must have one exact loading/no-scenario 568x320 recipe with its 52/16 safe band and four complete Source loading targets");
for (const exactFramingCopy of [
  "Current source contextCorrection 1 · Displayed",
  "Latest event-time Journal Date18 Aug 2026 → 17 Aug 2026",
  "Retained Source Revisions · Revision 1 · Revision 2",
  "Source lane2 retained events",
  "Derived lane1 retained event",
  "No represented events match this selected synthetic scope. Nothing was deleted.Back to Settings",
]) pass(framingSpecDriver.includes(exactFramingCopy), `the framing matrix is missing exact repaired visible copy: ${exactFramingCopy}`);
for (const unchangedFrame of ["v18-01-global-ready-wide-light", "v18-04-field-ready-medium-dark", "v18-16-canonical-entry-320-forced"]) {
  pass(!framingSpecDriver.includes(`"${unchangedFrame}"`), `${unchangedFrame} must not gain an ordinary active-frame framing recipe`);
}
for (const proofKey of [
  "day-current-source-context",
  "day-latest-event-journal-date",
  "item-event-sequence-group",
  "item-record-lineage-group",
  "artwork-current-facts",
  "revised-r1-r2-retention",
  "revised-external-boundary",
  "untagged-local-retention",
  "deleted-local-item-live",
  "hidden-day-source-lane",
  "hidden-day-derived-lane",
  "loading-source-lane-boundary",
  "loading-source-heading",
  "loading-status-heading",
  "loading-status-body",
  "interrupted-copy-and-retry",
  "failure-copy-and-contextual-retry",
  "both-lane-completion-summary",
  "canonical-empty-copy-and-back",
]) pass(framingSpecDriver.includes(proofKey), `the framing matrix is missing required visible proof target ${proofKey}`);
const passiveFramingDriver = between(evidence, "async function runPassivePreCaptureFraming", "async function retainRemoteElement");
const loadingFramingIntegrityDriver = between(evidence, "async function inspectLoadingFramingIntegrity", "async function runPassivePreCaptureFraming");
pass(passiveFramingDriver.includes('method: "passive pre-capture scroll only"')
  && passiveFramingDriver.includes("window.scrollTo")
  && passiveFramingDriver.includes("fullyVisible")
  && passiveFramingDriver.includes("fixedOrStickyOverlaps")
  && passiveFramingDriver.includes("stateUnchanged"), "pre-capture framing must use a bounded scroll-only union and fail closed on clipping, overlap, or state/focus drift");
pass(!/\.focus\s*\(|dispatchMouseEvent|dispatchKeyEvent|\.style\b|classList\.|setAttribute\(|append|prepend|insertBefore/.test(passiveFramingDriver), "passive pre-capture framing must not focus, activate, mutate DOM/CSS, or synthesize input");
pass(loadingFramingIntegrityDriver.includes("loadingMarkup")
  && loadingFramingIntegrityDriver.includes("integritySha256 = valueSha256(raw.immutable)")
  && !loadingFramingIntegrityDriver.includes("loadingMarkup: raw")
  && loadingFramingIntegrityDriver.includes('sourceLaneBusyCount')
  && loadingFramingIntegrityDriver.includes('derivedLaneBusyCount')
  && loadingFramingIntegrityDriver.includes('allBusyCount')
  && loadingFramingIntegrityDriver.includes('laneLabelledBy')
  && loadingFramingIntegrityDriver.includes('statusLabelledBy')
  && loadingFramingIntegrityDriver.includes('h1FullyOffscreen')
  && !/\.focus\s*\(|window\.scroll|scrollIntoView|setAttribute\(|classList\.|\.style\b/.test(loadingFramingIntegrityDriver), "frame 11 integrity inspection must hash rather than export markup and passively inspect exact busy, heading, ARIA, style, viewport, media, and offscreen-h1 identity");
pass(passiveFramingDriver.includes("loadingBefore.integritySha256 === loadingAfter.integritySha256")
  && passiveFramingDriver.includes("loadingAfter.viewport.width === 568 && loadingAfter.viewport.height === 320")
  && passiveFramingDriver.includes("loadingAfter.identity.sourceLaneBusyCount === 1")
  && passiveFramingDriver.includes("loadingAfter.identity.derivedLaneBusyCount === 0")
  && passiveFramingDriver.includes("loadingAfter.identity.allBusyCount === 1")
  && passiveFramingDriver.includes('loadingAfter.identity.sourceHeading === "Source history"')
  && passiveFramingDriver.includes('loadingAfter.identity.statusHeading === "Loading history"')
  && passiveFramingDriver.includes("loadingBefore.focus.h1Focused && loadingAfter.focus.h1Focused && loadingAfter.focus.h1FullyOffscreen")
  && passiveFramingDriver.includes("loadingBefore.scroll.x === loadingAfter.scroll.x && loadingBefore.scroll.y !== loadingAfter.scroll.y")
  && passiveFramingDriver.includes("Math.abs(loadingAfter.scroll.y - staged.requestedScrollY) <= 1")
  && passiveFramingDriver.includes("integrityDigestPreserved")
  && passiveFramingDriver.includes("h1FocusPreservedOffscreen"), "frame 11 must fail closed on safe-band identity, non-Source busy state, digest/media/viewport drift, non-Y movement, or lost offscreen h1 focus");
pass(occurrences(evidence, "framingEvidence = await runPassivePreCaptureFraming") === 1
  && evidence.indexOf("framingEvidence = await runPassivePreCaptureFraming") < evidence.indexOf('client.send("Page.captureScreenshot"')
  && evidence.includes("framing: framingEvidence"), "every affected sidecar must record framing geometry/assertions before its PNG is captured");

const keyboardActivationDriver = between(evidence, "async function dispatchShiftTab", "async function runActualSelectChangeStep");
pass(keyboardActivationDriver.includes('key: "Shift"') && keyboardActivationDriver.includes('key: "Tab"')
  && keyboardActivationDriver.includes('modifiers: 8')
  && keyboardActivationDriver.includes("async function dispatchKeyboardEnterActivation")
  && keyboardActivationDriver.includes('type: "keyDown"')
  && keyboardActivationDriver.includes('text: "\\r"')
  && keyboardActivationDriver.includes("await dispatchKeyboardEnterActivation(client)")
  && !between(evidence, "async function dispatchKeyboardEnterActivation", "async function runActualKeyboardActivationStep").includes("nativeVirtualKeyCode"), "frame 10 must use real reverse-Tab traversal and a dedicated safe Enter activation packet");
pass(keyboardActivationDriver.includes('target.matches(":focus-visible")')
  && keyboardActivationDriver.includes("visibleIndicator")
  && !/\.focus\s*\(/.test(keyboardActivationDriver), "frame 10 keyboard proof must assert a browser focus-visible indicator without direct focus");

const finalArtworkStageDriver = between(evidence, "async function stageFinalArtworkOriginBaseline", "async function waitForNativeToastExpiry");
const toastSettlementDriver = between(evidence, "async function waitForNativeToastExpiry", "async function inspectFinalCanonicalCaptureSafety");
const finalCanonicalSafetyDriver = between(evidence, "async function inspectFinalCanonicalCaptureSafety", "async function dispatchRemoteMouseClick");
pass(finalArtworkStageDriver.includes('method: "pre-baseline scroll only"')
  && finalArtworkStageDriver.includes("window.scrollTo")
  && finalArtworkStageDriver.includes("focusNavClearance < 12")
  && finalArtworkStageDriver.includes("panelNavClearance < 12")
  && finalArtworkStageDriver.includes("panelBannerClearance < 12")
  && finalArtworkStageDriver.includes("panelRect.height <= 744")
  && finalArtworkStageDriver.includes("eyebrowFullyVisible")
  && finalArtworkStageDriver.includes("panelTopBoundaryVisible")
  && finalArtworkStageDriver.includes("panelBottomBoundaryVisible")
  && !/\.focus\s*\(|dispatchMouseEvent|dispatchKeyEvent|\.style\b|classList\.|setAttribute\(/.test(finalArtworkStageDriver), "frame 16 Artwork staging must be scroll-only before baseline and require 12px focus/panel clearance");
pass(toastSettlementDriver.includes("setTimeout(resolveDone, 4300)")
  && toastSettlementDriver.includes("settlement.elapsedMs < 4200")
  && toastSettlementDriver.includes("childCount !== 0")
  && toastSettlementDriver.includes("stateFocusScrollUnchanged"), "frame 16 must wait passively through the native 4.2-second toast expiry and fail on state/focus/scroll drift");
pass(finalCanonicalSafetyDriver.includes("focusNavClearance >= 12")
  && finalCanonicalSafetyDriver.includes("panelNavClearance >= 12")
  && finalCanonicalSafetyDriver.includes("panelBannerClearance >= 12")
  && finalCanonicalSafetyDriver.includes("heightWithinLimit")
  && finalCanonicalSafetyDriver.includes("panelTopAtLeast78")
  && finalCanonicalSafetyDriver.includes("panelBottomAtMost822")
  && finalCanonicalSafetyDriver.includes("bannerBottom66")
  && finalCanonicalSafetyDriver.includes("navigationTop834")
  && finalCanonicalSafetyDriver.includes("borderTopWidth")
  && finalCanonicalSafetyDriver.includes("borderBottomWidth")
  && finalCanonicalSafetyDriver.includes("contentFitsWithoutNestedScroll")
  && finalCanonicalSafetyDriver.includes("fullyVisibleWithRing")
  && finalCanonicalSafetyDriver.includes("eyebrowFullyVisible")
  && finalCanonicalSafetyDriver.includes("headingBannerClearance >= 12")
  && finalCanonicalSafetyDriver.includes("headingFullyVisible")
  && finalCanonicalSafetyDriver.includes("descriptionFullyVisible")
  && finalCanonicalSafetyDriver.includes("fullyVisibleFactCount === 4")
  && finalCanonicalSafetyDriver.includes("fullyVisibleButtonCount === 4")
  && finalCanonicalSafetyDriver.includes('safety.toast.toastCount === 0'), "frame 16 must fail closed on toast, focus-ring/nav overlap, panel-boundary overlap, or missing canonical content");
pass(styles.includes("margin-block: 24px max(104px, calc(88px + env(safe-area-inset-bottom)))"), "compact canonical panel must provide normal-flow bottom safe-area clearance without an overlay workaround");
pass(!/\.lid-v18-canonical-entry-panel\s*\{[^}]*position:\s*(?:fixed|sticky|absolute)/s.test(styles), "canonical panel must remain in normal flow after the compact safe-area repair");

for (const prose of [sourceProseCorrection, sourceProseRevision2]) {
  pass(occurrences(evidence, prose) === 1, "the v18 driver must keep each protected prose string only in its closed forbidden-value list");
}
pass(evidenceHasQuotedSequence(["revision-2", "correction-1", "none"]), "the v18 driver must accept only the exact safe sourceContextVariant enum");
pass(evidence.includes("sourceContextVariant: snapshot.sourceContextVariant"), "safe evidence summaries must export only sourceContextVariant");
pass(evidence.includes("metadataJson") && evidence.includes("refusing to write sidecar metadata containing protected fictional source prose"), "the driver must scan the complete JSON sidecar for both prose strings before writing");
pass(evidence.includes("navigator.storage.getDirectory") && evidence.includes("for await (const unusedHandle of rootDirectory.values())"), "the driver must enumerate the isolated profile OPFS root");
pass(/if\s*\(\s*!pageState\.opfs\.supported\s*\)\s*\{?\s*fail/.test(evidence), "OPFS inspection must fail closed when the API is unavailable");
pass(/if\s*\(\s*(?:pageState\.opfs\.supported\s*&&\s*)?pageState\.opfs\.accessible\s*!==\s*true\s*\)\s*\{?\s*fail/.test(evidence), "OPFS inspection must fail closed when the root is inaccessible");
pass(!evidence.includes('pass: !pageState.opfs.supported ||'), "the OPFS privacy assertion must not treat unavailable inspection as a pass");
pass(evidence.includes("pageState.opfs.entryCount !== 0") && evidence.includes("opfs: pageState.opfs"), "the driver must reject OPFS residue and record the bounded observation");

for (const guideFact of [
  "Unfrozen implementation candidate",
  "independent QA pending",
  "19/57 prototype-representable rows closed and 38/57 open",
  "node --check capture-phase2-evidence-v18.mjs",
  "node --check check-v18.mjs",
  "node check-v18.mjs",
  "http://127.0.0.1:4317/index-v18.html",
  "loaded versions `[17, 18]`",
  "exact top-level fixture keys",
  "Status unavailable, per-lane pagination, filtered empty/clear",
  "capture-phase2-evidence-v18.mjs",
  "manifest().captureScenarios",
  "exact 16-frame roster",
  "There is exactly one semantic filter form",
  "sourceContextVariant",
  "OPFS inspection fails closed",
  "getBoundingClientRect()",
  "QA only to seed fresh `global-ready`, enter the partial-page branch, and deliver each allowlisted synthetic success",
  "Fresh `item-ready` opens exactly the `E12` provenance disclosure",
  "the other 13 fixtures start with no event disclosure open",
  "merely scrolls that already-open disclosure into view",
  "within 1 CSS pixel",
  "driver does not compensate the page",
  "Fresh load leaves every capsule inactive",
  "Global History has exactly two native origins",
  "lid-v18-canonical-entry-panel",
  "PROTOTYPE V18 · FIXED SYNTHETIC CONTEXTS",
  "Open canonical History contexts",
  "direct `<body>` child immediately after stable `#prototype-root` and immediately before stable `#modal-root`",
  "never floating, fixed, sticky, modal, dialog, popover, or overlay",
  "at least 44×44 CSS pixels",
  "inheritedContextPatchedCount=0",
  "View day history",
  "Before sleep — synthetic fixture",
  "Revisions & provenance",
  "View versions",
  "artwork anchor is presence-based",
  "`artworkRepresented`",
  "`artworkExactWhenRepresented`",
  "`artworkRepresented=false` with `artworkExactWhenRepresented=true` is the valid pre-artwork state",
  "accepts the absent-artwork state",
  "actual native v16 browser-memory flow",
  "connected, visible, enabled, centre-hit-testable",
  "archiveDiagnostics.canonicalEntry",
  "launcherUserSurfaceAbsent:true",
  "C18-22",
  "exactly three ordered evidence-only `viewportStages`",
  "`initial-compact`",
  "`settings-wide`",
  "`restored-compact`",
  "Settings is measured wholly at 1024×900",
  "More and all four canonical trips are measured wholly at 320×900",
  "from baseline through the completed app-owned return proof",
  "desktop Settings hidden",
  "compact More visible and reachable",
  "exactly one canonical-panel column",
  "Required compact More keyboard regression path",
  "At both 320×900 and 390×844",
  "real compact More menu",
  "A helper pointer activation, direct DOM focus, QA dispatch",
  "Fresh History entry focuses `h1` **History & provenance**",
  "native Tab then reaches the **Filter history** summary",
  "Tab from **History lane** to **Record type**",
  "Shift+Tab to traverse back",
  "stops propagation only",
  "never prevents the browser default or moves focus",
  "visible Back and Escape",
  "restore the same compact More **History** invoker",
  "restored native More-modal focus wrap",
  "adds no fixture, capture scenario, or evidence frame",
  "v18-16-canonical-entry-320-forced",
  "same still-connected invoking button",
  "independent QA Round 1 FAIL — C0/H0/M3/L0",
  "exact closed per-frame pre-capture framing map",
  "capture.framing",
  "real reverse-keyboard path",
  "native Shift+Tab traversal",
  "Enter activates it",
  "one normal-flow, read-only completion summary",
  "Source `10 shown · Exactly 3 earlier added · Beginning reached`",
  "Derived `7 shown · Exactly 3 earlier added · Beginning reached`",
  "at least 12 px",
  "native 4.2-second toast timer",
  "waits passively",
  "whitespace-only compaction",
  "`Current source context` → `Correction 1 · Displayed`",
  "`Latest event-time Journal Date` → `18 Aug 2026 → 17 Aug 2026`",
  "`Retained Source Revisions · Revision 1 · Revision 2`",
  "`Source lane` → `2 retained events`",
  "`Derived lane` → `1 retained event`",
  "one in-panel **Back to Settings** action",
  "complete H2 and description remain below the fixed banner",
  "fresh read-only QA agent from zero",
  "Post-QA2 repair contract",
  "explicit positive integer generation for the exact same lane",
  "Missing, zero, negative, fractional, string, conflicting-alias, stale, future, cross-lane, wrong-stage, and already-consumed generations are strict no-ops",
  "click-only Load or Duplicate activation",
  "suppressed whenever any applied filter is active",
  "Source plus Needs attention must render exactly `E14,E13,E12`",
  "post-V18 document-capture boundary",
  "Global More is eligible through 960 px",
  "Global Settings starts at 961 px",
  "filter-layout breakpoint",
  "originBreakpointRegression",
  "Frame 11 binds only the exact `loading` fixture at 568×320 with no scenario",
  "52 px top / 16 px bottom safe band",
  "focus remains on the intentionally offscreen History h1",
  "complete canonical panel must be at most 744 px high",
  "adds zero transcript records",
  "This is input-mechanics evidence only and makes no assistive-technology claim",
  "does not establish durable history",
]) {
  pass(guide.includes(guideFact), `README-v18.md is missing bounded runbook fact: ${guideFact}`);
}
for (const staleRunbookFact of [
  "The v18 index opens **History & provenance** directly",
  "launcher returns to v18",
  "maps the exact inherited History, Journal Day, Source Item, generated-field, and artwork invokers",
  "Direct/global opening returns to the integrated v18 launcher",
  "v18-16-archive-launcher-320-forced",
  "Back to fixture entries",
]) pass(!guide.includes(staleRunbookFact), `README-v18.md retains superseded C18-21 runbook text: ${staleRunbookFact}`);
pass(guide.includes("LID-SCP-003") || app.includes("LID-SCP-003"), "candidate assets must name the first primary closure target");
pass(guide.includes("14-key fixture manifest"), "README must keep transition evidence out of the top-level fixture manifest");
pass(occursInOrder(guide, viewportStageKeys.map((key) => `\`${key}\``))
  && viewportStageKeys.every((key) => occurrences(guide, `\`${key}\``) === 1), "README must name exactly three viewportStages once each in Council order");
const manualBranchPath = between(guide, "## Manual branch path", "## Deliberate limits");
pass(manualBranchPath.includes("At both 320×900 and 390×844")
  && manualBranchPath.includes("real keyboard-only More → History path")
  && manualBranchPath.includes("h1 focus; Tab to Filter history; open it; Tab History lane → Record type; Shift+Tab back")
  && manualBranchPath.includes("Back/Escape runs to restore More History focus and native modal Tab wrap")
  && manualBranchPath.includes("Do not substitute helper pointer activation or direct focus"), "manual checks must exercise real compact More keyboard traversal and restored native wrap at both governed widths");
pass(manualBranchPath.includes("At 960×900 prove More positive and Settings negative")
  && manualBranchPath.includes("at 961×900 and 1023×900 prove Settings positive and More negative")
  && manualBranchPath.includes("Regress Settings positive / More negative at 1024×900 and More positive / Settings negative at 320×900")
  && manualBranchPath.includes("post-V18 capture boundary changes no prevention, propagation, anchor, feature, focus, scroll, state, live region, domain, view, modal, or toast")
  && manualBranchPath.includes("frozen behavior unsuppressed"), "manual checks must distinguish the 960/961 Global-origin boundary from compact filters through 1023 and wide filters from 1024");
pass(manualBranchPath.includes("Start from 2 Aug before artwork generation")
  && manualBranchPath.includes("enter Global through visible Settings **History** and compact More **History**")
  && manualBranchPath.includes("`artworkRepresented=false`") && manualBranchPath.includes("`artworkExactWhenRepresented=true`")
  && manualBranchPath.includes("aggregate `exactWhenRepresented=true`") && manualBranchPath.includes("`runInvariants()` passes")
  && manualBranchPath.includes("Then generate 2 Aug artwork through the actual native v16 browser-memory flow")
  && manualBranchPath.includes("`artworkRepresented=true`")
  && manualBranchPath.includes("connected, visible, enabled, centre-hit-testable")
  && manualBranchPath.includes("Missing artwork is a valid precondition, never a substitute for this post-artwork positive proof"), "manual checks must prove pre-artwork Settings/More invariants and post-generation native Artwork truth");

for (const prose of [sourceProseCorrection, sourceProseRevision2]) {
  pass(occurrences(guide, prose) === 1, "README must state each exact source-context prose value once");
}
for (const loadingFact of [
  "Global initial load",
  "sourceContextVariant=none",
  "**Source history** lane region",
  "programmatically named by its `h2`",
  'aria-busy="true"',
  "Preparing separate Source and Derived event lists from synthetic browser-memory fixtures.",
  "Page, main, filter, and scope nodes are not busy",
]) pass(guide.includes(loadingFact), `README is missing exact loading boundary: ${loadingFact}`);

const captureCommandLines = guide.split("\n").filter((line) => line.startsWith("node capture-phase2-evidence-v18.mjs "));
pass(captureCommandLines.length === 16, "README must provide exactly sixteen v18 evidence commands");
const evidenceRoster = [
  ["v18-01-global-ready-wide-light", "--width 1440 --height 900 --view active --fixture global-ready --theme light --motion no-preference --forced-colors none"],
  ["v18-02-day-ready-wide-dark", "--width 1440 --height 900 --view active --fixture day-ready --theme dark --motion no-preference --forced-colors none"],
  ["v18-03-item-conflict-medium-light", "--width 960 --height 900 --view active --fixture item-ready --theme light --selector '#lid-v18-provenance-E12' --motion no-preference --forced-colors none"],
  ["v18-04-field-ready-medium-dark", "--width 960 --height 900 --view active --fixture field-ready --theme dark --motion no-preference --forced-colors none"],
  ["v18-05-artwork-ready-compact-dark", "--width 390 --height 844 --view active --fixture artwork-ready --theme dark --motion no-preference --forced-colors none"],
  ["v18-06-upstream-revised-medium-light", "--width 960 --height 900 --view active --fixture upstream-revised --theme light --motion no-preference --forced-colors none"],
  ["v18-07-upstream-untagged-compact-light", "--width 390 --height 844 --view active --fixture upstream-untagged --theme light --motion no-preference --forced-colors none"],
  ["v18-08-upstream-deleted-compact-dark", "--width 390 --height 844 --view active --fixture upstream-deleted --theme dark --motion no-preference --forced-colors none"],
  ["v18-09-hidden-day-compact-light", "--width 390 --height 844 --view active --fixture hidden-day --theme light --motion no-preference --forced-colors none"],
  ["v18-10-filter-open-compact-dark", "--width 390 --height 844 --view active --scenario compact-filtered-open --theme dark --motion no-preference --forced-colors none"],
  ["v18-11-loading-landscape-light", "--width 568 --height 320 --view active --fixture loading --theme light --motion reduce --forced-colors none"],
  ["v18-12-interrupted-320-forced", "--width 320 --height 900 --view active --fixture interrupted --theme dark --motion reduce --forced-colors active"],
  ["v18-13-failure-medium-light", "--width 960 --height 900 --view active --fixture failure --theme light --motion no-preference --forced-colors none"],
  ["v18-14-load-earlier-wide-dark", "--width 1440 --height 900 --view active --scenario pagination-both-success --theme dark --motion no-preference --forced-colors none"],
  ["v18-15-empty-320-light", "--width 320 --height 900 --view active --fixture empty --theme light --motion no-preference --forced-colors none"],
  ["v18-16-canonical-entry-320-forced", "--width 320 --height 900 --view archive --fixture global-ready --theme light --motion reduce --forced-colors active"],
];
for (const [basename, exactOptions] of evidenceRoster) {
  const line = captureCommandLines.find((candidate) => candidate.includes(`/${basename}.png"`));
  pass(Boolean(line), `README evidence roster is missing PNG command ${basename}`);
  pass(Boolean(line?.includes(`/${basename}.json"`)), `README evidence roster is missing paired JSON sidecar ${basename}`);
  pass(Boolean(line?.includes(exactOptions)), `README evidence command has wrong fixture/scenario/viewport/media flags: ${basename}`);
  pass(occurrences(guide, `${basename}.png`) === 1 && occurrences(guide, `${basename}.json`) === 1, `README must name the ${basename} PNG/JSON pair exactly once`);
}
const scenarioCommandLines = captureCommandLines.filter((line) => line.includes(" --scenario "));
pass(scenarioCommandLines.length === 2 && scenarioCommandLines[0].includes("v18-10-filter-open-compact-dark") && scenarioCommandLines[1].includes("v18-14-load-earlier-wide-dark"), "only frames 10 and 14 may use --scenario, in roster order");

if (failures.length) {
  process.stderr.write(`check-v18: FAIL (${failures.length})\n${failures.map((failure) => `- ${failure}`).join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`check-v18: PASS (${frozen.size} frozen hashes, ${required.length} additive assets, 17 events, 14 fixtures, read-only privacy/static contract)\n`);
}
