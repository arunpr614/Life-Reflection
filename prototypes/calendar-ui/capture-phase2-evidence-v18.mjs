#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { createServer } from "node:net";
import { basename, dirname, extname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

const TOOL_VERSION = 18;
const DRIVER_BASENAME = "capture-phase2-evidence-v18.mjs";
const PROFILE_PREFIX = "life-in-days-v18-evidence-";
const DEFAULT_TIMEOUT_MS = 15_000;
const TARGET_VERSION = 18;
const ANCHOR_TOLERANCE_PX = 1;
const ORIGIN_RETURN_TOLERANCE_PX = 1;
const ITEM_READY_FRAME_SELECTOR = '[data-lid-v18-event-details="E12"]';
const ITEM_READY_FRAME_SUMMARY_SELECTOR = "#lid-v18-provenance-E12";
const CANONICAL_PANEL_SELECTOR = "#lid-v18-canonical-entry-panel";
const CANONICAL_ENTRY_COPY = Object.freeze({
  eyebrow: "PROTOTYPE V18 · FIXED SYNTHETIC CONTEXTS",
  heading: "Open canonical History contexts",
  body: "These controls open the fixed fictional 17 Aug 2026 history for Monsoon walk note. They do not represent the Journal Days, Source Items, generated fields, or artwork shown elsewhere in the frozen v16 archive.",
});
const CANONICAL_ENTRY_SPECS = Object.freeze([
  Object.freeze({
    originToken: "day",
    selector: "#lid-v18-canonical-entry-day",
    id: "lid-v18-canonical-entry-day",
    describedBy: "lid-v18-canonical-entry-fact-day",
    token: "day",
    fact: "Journal Day · 17 Aug 2026",
    name: "History & provenance",
    fixture: "day-ready",
    scope: "day",
    h1: "History for 17 August 2026",
    backLabel: "Back to Journal Day",
    expectedSourceCount: 8,
    expectedDerivedCount: 6,
    expectedCount: 14,
    activationMethod: "pointer",
    closeMethod: "back",
  }),
  Object.freeze({
    originToken: "item",
    selector: "#lid-v18-canonical-entry-item",
    id: "lid-v18-canonical-entry-item",
    describedBy: "lid-v18-canonical-entry-fact-item",
    token: "item",
    fact: "Source Item · Monsoon walk note",
    name: "View source history",
    fixture: "item-ready",
    scope: "item",
    h1: "History for Monsoon walk note",
    backLabel: "Back to Source Item",
    expectedSourceCount: 8,
    expectedDerivedCount: 6,
    expectedCount: 14,
    activationMethod: "enter",
    closeMethod: "escape",
  }),
  Object.freeze({
    originToken: "summary",
    selector: "#lid-v18-canonical-entry-summary",
    id: "lid-v18-canonical-entry-summary",
    describedBy: "lid-v18-canonical-entry-fact-summary",
    token: "field",
    fact: "Generated field · Summary",
    name: "View Summary history",
    fixture: "field-ready",
    scope: "field",
    h1: "Summary history",
    backLabel: "Back to Summary",
    expectedSourceCount: 0,
    expectedDerivedCount: 3,
    expectedCount: 3,
    activationMethod: "space",
    closeMethod: "back",
  }),
  Object.freeze({
    originToken: "artwork",
    selector: "#lid-v18-canonical-entry-artwork",
    id: "lid-v18-canonical-entry-artwork",
    describedBy: "lid-v18-canonical-entry-fact-artwork",
    token: "artwork",
    fact: "Generated Artwork · Artwork version 2",
    name: "View artwork history",
    fixture: "artwork-ready",
    scope: "artwork",
    h1: "Artwork history",
    backLabel: "Back to Generated Artwork",
    expectedSourceCount: 0,
    expectedDerivedCount: 3,
    expectedCount: 3,
    activationMethod: "pointer",
    closeMethod: "escape",
  }),
]);
const GLOBAL_ENTRY_SPECS = Object.freeze([
  Object.freeze({
    originToken: "settings",
    selector: '#prototype-root [data-action="settings-related"][data-label="History"]',
    fixture: "global-ready",
    scope: "global",
    h1: "History & provenance",
    backLabel: "Back to Settings",
    expectedSourceCount: 10,
    expectedDerivedCount: 7,
    expectedCount: 17,
    activationMethod: "pointer",
    closeMethod: "back",
  }),
  Object.freeze({
    originToken: "more",
    selector: '#modal-root .more-management [data-action="settings-related"][data-label="History"]',
    fixture: "global-ready",
    scope: "global",
    h1: "History & provenance",
    backLabel: "Back to More",
    expectedSourceCount: 10,
    expectedDerivedCount: 7,
    expectedCount: 17,
    activationMethod: "pointer",
    closeMethod: "escape",
  }),
]);
const GLOBAL_ORIGIN_TOKENS = Object.freeze(["settings", "more"]);
const VIEWPORT_STAGE_KEYS = Object.freeze(["initial-compact", "settings-wide", "restored-compact"]);
const ARCHIVE_ORIGIN_TRANSCRIPT = Object.freeze([
  "settings-global",
  "more-global",
  "canonical-day",
  "canonical-item",
  "canonical-summary",
  "canonical-artwork",
]);
const SAFE_SOURCE_CONTEXT_VARIANTS = Object.freeze(["revision-2", "correction-1", "none"]);
const FORBIDDEN_SOURCE_CONTEXT_PROSE = Object.freeze([
  "Fictional Correction 1 — A rain-washed path curved past paper lanterns; the synthetic narrator paused beside three quiet puddles before heading home.",
  "Fictional Revision 2 — Rain softened the path beneath the paper lanterns; the synthetic narrator counted three quiet puddles before walking home.",
]);
const REQUIRED_FIXTURES = Object.freeze([
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
]);
const CAPTURE_SCENARIOS = Object.freeze(["compact-filtered-open", "pagination-both-success"]);
const CAPTURE_SCENARIO_ACTIONS = Object.freeze({
  "compact-filtered-open": Object.freeze([
    { type: "open-filter" },
    { type: "draft-lane", payload: { value: "source" } },
    { type: "draft-attention", payload: { value: "needs" } },
    { type: "apply-filters" },
    { type: "open-filter" },
  ]),
  "pagination-both-success": Object.freeze([
    { type: "enter-pagination" },
    { type: "load-source" },
    { type: "deliver-source-success" },
    { type: "load-derived" },
    { type: "deliver-derived-success" },
  ]),
});
const CAPTURE_FRAMING_SPECS = Object.freeze({
  "v18-02-day-ready-wide-dark": Object.freeze({
    fixture: "day-ready", scenario: null, width: 1440, height: 900,
    targets: Object.freeze([
      Object.freeze({ key: "day-current-source-context", selector: ".lid-scope-summary-v18 dl > div:nth-child(2)", text: "Current source contextCorrection 1 · Displayed" }),
      Object.freeze({ key: "day-latest-event-journal-date", selector: ".lid-scope-summary-v18 dl > div:nth-child(3)", text: "Latest event-time Journal Date18 Aug 2026 → 17 Aug 2026" }),
      Object.freeze({ key: "day-lane-counts", selector: ".lid-scope-summary-v18 dl > div:last-child", text: "Lane counts8 Source · 6 Derived" }),
    ]),
  }),
  "v18-03-item-conflict-medium-light": Object.freeze({
    fixture: "item-ready", scenario: null, width: 960, height: 900,
    safeTop: 68,
    targets: Object.freeze([
      Object.freeze({ key: "item-conflict", selector: '[data-lid-v18-event="E12"] > header', text: "Source conflict detected" }),
      Object.freeze({ key: "item-conflict-states", selector: '[data-lid-v18-event="E12"] .lid-state-list-v18', text: "ConflictDisplayed Correction" }),
      Object.freeze({ key: "item-event-sequence-group", selector: '[data-lid-v18-event="E12"] .lid-relations-v18', text: "Event sequence" }),
      Object.freeze({ key: "item-record-lineage-group", selector: '[data-lid-v18-event="E12"] .lid-relations-v18', text: "Record lineage" }),
    ]),
  }),
  "v18-05-artwork-ready-compact-dark": Object.freeze({
    fixture: "artwork-ready", scenario: null, width: 390, height: 844,
    targets: Object.freeze([
      Object.freeze({ key: "artwork-current-facts", selector: ".lid-scope-summary-v18", text: "Artwork version 2 · Historical · StaleLabelAI-generated artwork" }),
    ]),
  }),
  "v18-06-upstream-revised-medium-light": Object.freeze({
    fixture: "upstream-revised", scenario: null, width: 960, height: 900,
    targets: Object.freeze([
      Object.freeze({ key: "revised-r1-r2-retention", selector: '[data-lid-v18-event="E04"] .lid-journal-date-v18:first-of-type', text: "Retained Source Revisions · Revision 1 · Revision 2" }),
      Object.freeze({ key: "revised-external-boundary", selector: '[data-lid-v18-event="E04"] .lid-external-v18', text: "Synthetic UI fixture · external evidence required" }),
    ]),
  }),
  "v18-07-upstream-untagged-compact-light": Object.freeze({
    fixture: "upstream-untagged", scenario: null, width: 390, height: 844,
    targets: Object.freeze([
      Object.freeze({ key: "untagged-local-retention", selector: '[data-lid-v18-event="E13"]', text: "Untagged upstreamRetained locally" }),
    ]),
  }),
  "v18-08-upstream-deleted-compact-dark": Object.freeze({
    fixture: "upstream-deleted", scenario: null, width: 390, height: 844,
    targets: Object.freeze([
      Object.freeze({ key: "deleted-local-item-live", selector: '[data-lid-v18-event="E14"]', text: "Deleted upstream" }),
    ]),
  }),
  "v18-09-hidden-day-compact-light": Object.freeze({
    fixture: "hidden-day", scenario: null, width: 390, height: 844,
    safeTop: 6, safeBottom: 6,
    targets: Object.freeze([
      Object.freeze({ key: "hidden-day-banner", selector: ".lid-hidden-banner-v18", text: "Historical day — not shown in Calendar or Almanac" }),
      Object.freeze({ key: "hidden-day-source-lane", selector: ".lid-scope-summary-v18 dl > div:nth-child(5)", text: "Source lane2 retained events" }),
      Object.freeze({ key: "hidden-day-derived-lane", selector: ".lid-scope-summary-v18 dl > div:nth-child(6)", text: "Derived lane1 retained event" }),
    ]),
  }),
  "v18-10-filter-open-compact-dark": Object.freeze({
    fixture: null, scenario: "compact-filtered-open", width: 390, height: 844,
    focusSelector: "[data-lid-v18-filter-details] > summary",
    targets: Object.freeze([
      Object.freeze({ key: "active-filter-summary", selector: ".lid-filter-summary-v18 strong", text: "3 represented events · Source history · All record types · All event types · Needs attention" }),
      Object.freeze({ key: "active-filter-clear", selector: ".lid-filter-summary-v18 > button", text: "Clear filters" }),
      Object.freeze({ key: "keyboard-focused-filter-summary", selector: "[data-lid-v18-filter-details] > summary", text: "Filter history · 2 active" }),
      Object.freeze({ key: "filter-lane", selector: '.lid-filter-fields-v18 select[data-lid-action="draft-lane"]', text: "Source history" }),
      Object.freeze({ key: "filter-attention", selector: '.lid-filter-fields-v18 select[data-lid-action="draft-attention"]', text: "Needs attention" }),
    ]),
  }),
  "v18-11-loading-landscape-light": Object.freeze({
    fixture: "loading", scenario: null, width: 568, height: 320,
    safeTop: 52, safeBottom: 16, loadingContract: true,
    targets: Object.freeze([
      Object.freeze({ key: "loading-source-lane-boundary", selector: ".lid-loading-results-v18 > .lid-history-lane-v18.is-source", text: "Source laneSource historyLoading historyPreparing separate Source and Derived event lists from synthetic browser-memory fixtures." }),
      Object.freeze({ key: "loading-source-heading", selector: "h2#lid-v18-loading-source-title", text: "Source history" }),
      Object.freeze({ key: "loading-status-heading", selector: "h3#lid-v18-loading-title", text: "Loading history" }),
      Object.freeze({ key: "loading-status-body", selector: ".lid-loading-status-v18 > p", text: "Preparing separate Source and Derived event lists from synthetic browser-memory fixtures." }),
    ]),
  }),
  "v18-12-interrupted-320-forced": Object.freeze({
    fixture: "interrupted", scenario: null, width: 320, height: 900,
    safeTop: 6, safeBottom: 6,
    targets: Object.freeze([
      Object.freeze({ key: "interrupted-copy-and-retry", selector: ".lid-state-panel-v18", text: "Connection interruptedThe history already shown remains readable and may be out of date. Earlier events were not added.Retry loading history" }),
      Object.freeze({ key: "interrupted-retained-source-list", selector: '[data-lid-v18-event="E10"] > header', text: "Source historyJournal Date changed" }),
    ]),
  }),
  "v18-13-failure-medium-light": Object.freeze({
    fixture: "failure", scenario: null, width: 960, height: 900,
    targets: Object.freeze([
      Object.freeze({ key: "failure-copy-and-contextual-retry", selector: ".lid-state-panel-v18", text: "History could not be loadedThe current archive view is unchanged. Try again.Retry loading history" }),
    ]),
  }),
  "v18-14-load-earlier-wide-dark": Object.freeze({
    fixture: null, scenario: "pagination-both-success", width: 1440, height: 900,
    focusSelector: "#lid-v18-load-derived",
    targets: Object.freeze([
      Object.freeze({ key: "focused-derived-beginning", selector: "#lid-v18-load-derived", text: "Beginning of represented Derived history" }),
      Object.freeze({ key: "both-lane-completion-summary", selector: ".lid-pagination-completion-v18", text: "Source history10 shown · Exactly 3 earlier added · Beginning reachedDerived history7 shown · Exactly 3 earlier added · Beginning reached" }),
    ]),
  }),
  "v18-15-empty-320-light": Object.freeze({
    fixture: "empty", scenario: null, width: 320, height: 900,
    targets: Object.freeze([
      Object.freeze({ key: "canonical-empty-copy-and-back", selector: ".lid-empty-v18", text: "No history matches this viewNo represented events match this selected synthetic scope. Nothing was deleted.Back to Settings" }),
    ]),
  }),
});
const SOURCE_ORDER = Object.freeze(["E10", "E14", "E13", "E12", "E11", "E05", "E04", "E01", "E17", "E15"]);
const DERIVED_ORDER = Object.freeze(["E09", "E08", "E07", "E06", "E03", "E02", "E16"]);
const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
];

const usage = `Usage:
  node capture-phase2-evidence-v18.mjs \\
    --url http://127.0.0.1:4317/index-v18.html \\
    --out /absolute/path/evidence.png \\
    --meta /absolute/path/evidence.json \\
    [--width 1440] [--height 900] \\
    [--view active|archive] \\
    (--fixture global-ready | --scenario compact-filtered-open|pagination-both-success) \\
    [--theme light|dark] [--selector '#lid-v18-results-title'] \\
    [--motion reduce|no-preference] [--forced-colors active|none]

The URL must be the query-free localhost /index-v18.html route. Exactly one of
--fixture or --scenario is required. Scenario capture is active-only, rejects
--selector, and uses a fresh global-ready seed. The compact-filtered-open
scenario also requires a viewport narrower than 1024 CSS pixels. The driver
uses a fresh Chrome profile, governed visible entry controls, public
browser-memory QA transitions, and a device scale factor of 1. Archive capture
is the exact frame-16 procedure and requires the paired basename
v18-16-canonical-entry-320-forced at 320x900 with light preference, reduced
motion, and forced colours active.
`;

function fail(message) {
  throw new Error(message);
}

function parseInteger(value, name, minimum, maximum) {
  if (!/^\d+$/.test(value || "")) fail(`${name} must be an integer`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    fail(`${name} must be between ${minimum} and ${maximum}`);
  }
  return parsed;
}

function parseArguments(argv) {
  if (argv.includes("--help")) return { help: true };
  const allowed = new Set(["--url", "--out", "--meta", "--width", "--height", "--view", "--fixture", "--scenario", "--theme", "--selector", "--motion", "--forced-colors"]);
  const values = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!allowed.has(flag)) fail(`unknown argument: ${flag || "<empty>"}`);
    if (values.has(flag)) fail(`duplicate argument: ${flag}`);
    if (value === undefined || value.startsWith("--")) fail(`missing value for ${flag}`);
    values.set(flag, value);
  }

  for (const required of ["--url", "--out", "--meta"]) {
    if (!values.has(required)) fail(`${required} is required`);
  }

  let url;
  try {
    url = new URL(values.get("--url"));
  } catch {
    fail("--url must be a valid absolute URL");
  }
  if (url.protocol !== "http:") fail("--url must use http://");
  if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) fail("--url must use a localhost host");
  if (url.username || url.password) fail("--url must not contain credentials");
  if (url.search || url.hash) fail("--url must not contain query or hash state");
  if (url.pathname !== "/index-v18.html") fail("--url must target exactly /index-v18.html");
  const targetVersion = TARGET_VERSION;

  const out = resolve(values.get("--out"));
  const meta = resolve(values.get("--meta"));
  if (extname(out).toLowerCase() !== ".png") fail("--out must end in .png");
  if (extname(meta).toLowerCase() !== ".json") fail("--meta must end in .json");
  if (out === meta) fail("--out and --meta must be different files");

  const width = parseInteger(values.get("--width") || "1440", "--width", 240, 4096);
  const height = parseInteger(values.get("--height") || "900", "--height", 240, 4096);
  const view = values.get("--view") || "active";
  if (!["active", "archive"].includes(view)) fail("--view must be active or archive");
  const theme = values.get("--theme") || null;
  if (values.has("--theme") && !values.get("--theme")) fail("--theme must not be empty");
  if (theme && !["light", "dark"].includes(theme)) fail("--theme must be light or dark");
  const fixture = values.get("--fixture") || null;
  if (values.has("--fixture") && !values.get("--fixture")) fail("--fixture must not be empty");
  if (fixture && !/^[a-z][a-z0-9-]{0,63}$/.test(fixture)) fail("--fixture is not a safe synthetic fixture name");
  const scenario = values.get("--scenario") || null;
  if (values.has("--scenario") && !values.get("--scenario")) fail("--scenario must not be empty");
  if (values.has("--fixture") && values.has("--scenario")) fail("--fixture and --scenario are mutually exclusive");
  if (!values.has("--fixture") && !values.has("--scenario")) fail("exactly one of --fixture or --scenario is required");
  if (fixture && !REQUIRED_FIXTURES.includes(fixture)) fail(`unknown v18 fixture: ${fixture}`);
  if (scenario && !CAPTURE_SCENARIOS.includes(scenario)) fail(`unknown v18 capture scenario: ${scenario}`);
  const selector = values.get("--selector") || null;
  if (values.has("--selector") && !values.get("--selector")) fail("--selector must not be empty");
  if (selector && (selector.length > 512 || /[\u0000-\u001f\u007f]/.test(selector))) {
    fail("--selector must be 1-512 characters without control characters");
  }
  if (scenario && view === "archive") fail("--scenario is incompatible with --view archive");
  if (scenario && selector) fail("--scenario is incompatible with --selector");
  if (scenario === "compact-filtered-open" && width >= 1024) fail("compact-filtered-open requires --width below 1024");
  const motion = values.get("--motion") || null;
  if (values.has("--motion") && !values.get("--motion")) fail("--motion must not be empty");
  if (motion && !["reduce", "no-preference"].includes(motion)) fail("--motion must be reduce or no-preference");
  const forcedColors = values.get("--forced-colors") || null;
  if (values.has("--forced-colors") && !values.get("--forced-colors")) fail("--forced-colors must not be empty");
  if (forcedColors && !["active", "none"].includes(forcedColors)) fail("--forced-colors must be active or none");

  if (view === "archive") {
    if (fixture !== "global-ready" || scenario || selector) {
      fail("archive capture requires --fixture global-ready and rejects scenario/selector state");
    }
    if (width !== 320 || height !== 900 || theme !== "light" || motion !== "reduce" || forcedColors !== "active") {
      fail("archive capture is exactly v18 frame 16 at 320x900, light, reduced motion, and forced colours active");
    }
    if (basename(out) !== "v18-16-canonical-entry-320-forced.png"
      || basename(meta) !== "v18-16-canonical-entry-320-forced.json") {
      fail("archive capture requires the exact v18-16-canonical-entry-320-forced PNG/JSON basenames");
    }
  }

  return { help: false, url: url.href, out, meta, width, height, view, fixture, scenario, theme, selector, motion, forcedColors, targetVersion };
}

function timeoutPromise(milliseconds, message) {
  return new Promise((_, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), milliseconds);
    timer.unref?.();
  });
}

async function reservePort() {
  const server = createServer();
  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  const address = server.address();
  if (!address || typeof address === "string") fail("could not reserve a Chrome debugging port");
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()));
  return address.port;
}

async function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      await access(candidate, fsConstants.X_OK);
      return candidate;
    } catch {
      // Keep looking through the fixed local Chrome candidates.
    }
  }
  fail(`Google Chrome was not found at: ${CHROME_CANDIDATES.join(", ")}`);
}

async function waitForJson(url, child, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastError = null;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) fail(`Google Chrome exited before DevTools became ready (exit ${child.exitCode})`);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1_000) });
      if (response.ok) return await response.json();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  fail(`DevTools endpoint did not become ready: ${lastError?.message || "timeout"}`);
}

class CdpClient {
  constructor(webSocketUrl) {
    this.url = webSocketUrl;
    this.socket = null;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener("message", (event) => this.handleMessage(event));
    this.socket.addEventListener("close", () => this.rejectPending(new Error("DevTools WebSocket closed")));
    this.socket.addEventListener("error", () => this.rejectPending(new Error("DevTools WebSocket error")));
    await Promise.race([
      new Promise((resolveOpen, rejectOpen) => {
        this.socket.addEventListener("open", resolveOpen, { once: true });
        this.socket.addEventListener("error", () => rejectOpen(new Error("could not connect to DevTools WebSocket")), { once: true });
      }),
      timeoutPromise(DEFAULT_TIMEOUT_MS, "timed out connecting to DevTools WebSocket"),
    ]);
  }

  handleMessage(event) {
    let message;
    try {
      const payload = typeof event.data === "string" ? event.data : Buffer.from(event.data).toString("utf8");
      message = JSON.parse(payload);
    } catch {
      return;
    }
    if (message.id) {
      const request = this.pending.get(message.id);
      if (!request) return;
      this.pending.delete(message.id);
      if (message.error) request.reject(new Error(`${request.method}: ${message.error.message}`));
      else request.resolve(message.result || {});
      return;
    }
    if (!message.method) return;
    for (const listener of this.listeners.get(message.method) || []) listener(message.params || {});
  }

  rejectPending(error) {
    for (const pendingRequest of this.pending.values()) pendingRequest.reject(error);
    this.pending.clear();
  }

  on(method, listener) {
    const current = this.listeners.get(method) || [];
    current.push(listener);
    this.listeners.set(method, current);
    return () => this.listeners.set(method, (this.listeners.get(method) || []).filter((item) => item !== listener));
  }

  waitForEvent(method, predicate = () => true, timeoutMs = DEFAULT_TIMEOUT_MS) {
    return new Promise((resolveEvent, rejectEvent) => {
      const timer = setTimeout(() => {
        remove();
        rejectEvent(new Error(`timed out waiting for ${method}`));
      }, timeoutMs);
      const remove = this.on(method, (params) => {
        if (!predicate(params)) return;
        clearTimeout(timer);
        remove();
        resolveEvent(params);
      });
    });
  }

  send(method, params = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) fail("DevTools WebSocket is not open");
    const id = this.nextId++;
    return new Promise((resolveRequest, rejectRequest) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        rejectRequest(new Error(`${method} timed out`));
      }, timeoutMs);
      this.pending.set(id, {
        method,
        resolve: (value) => {
          clearTimeout(timer);
          resolveRequest(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          rejectRequest(error);
        },
      });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.socket && this.socket.readyState < WebSocket.CLOSING) this.socket.close();
  }
}

function scalarConsoleValue(argument) {
  if (["string", "number", "boolean", "bigint"].includes(argument.type)) return String(argument.value).slice(0, 1_000);
  if (argument.subtype === "null") return "null";
  return String(argument.description || `[${argument.type}]`).slice(0, 1_000);
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: false,
  });
  if (result.exceptionDetails) {
    const description = result.exceptionDetails.exception?.description || result.exceptionDetails.text || "evaluation failed";
    fail(description);
  }
  return result.result?.value;
}

async function evaluateRemote(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: false,
    userGesture: false,
  });
  if (result.exceptionDetails) {
    const description = result.exceptionDetails.exception?.description || result.exceptionDetails.text || "evaluation failed";
    fail(description);
  }
  if (!result.result?.objectId) fail("evaluation did not retain a remote DOM object");
  return result.result.objectId;
}

async function callRemote(client, objectId, functionDeclaration) {
  const result = await client.send("Runtime.callFunctionOn", {
    objectId,
    functionDeclaration,
    awaitPromise: true,
    returnByValue: true,
    userGesture: false,
  });
  if (result.exceptionDetails) {
    const description = result.exceptionDetails.exception?.description || result.exceptionDetails.text || "remote call failed";
    fail(description);
  }
  return result.result?.value;
}

async function releaseRemote(client, objectId) {
  if (!objectId) return;
  await client.send("Runtime.releaseObject", { objectId }).catch(() => {});
}

async function waitForCondition(client, expression, label, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  let lastValue = null;
  while (Date.now() < deadline) {
    lastValue = await evaluate(client, expression);
    if (lastValue) return lastValue;
    await new Promise((resolveWait) => setTimeout(resolveWait, 50));
  }
  fail(`${label} did not settle before timeout: ${JSON.stringify(lastValue)}`);
}

async function focusRemoteElement(client, objectId) {
  const requested = await client.send("DOM.requestNode", { objectId });
  if (!requested.nodeId) fail("could not resolve the retained origin control for keyboard input");
  await client.send("DOM.focus", { nodeId: requested.nodeId });
  const focused = await callRemote(client, objectId, `function () { return document.activeElement === this && this.isConnected; }`);
  if (!focused) fail("keyboard origin control did not receive focus before activation");
}

async function accessibilityForSelector(client, selector) {
  const documentNode = await client.send("DOM.getDocument", { depth: 1, pierce: true });
  const queried = await client.send("DOM.querySelector", { nodeId: documentNode.root.nodeId, selector });
  if (!queried.nodeId) return { present: false, axCount: 0, accessibilityCount: 0, names: [], roles: [] };
  const resolved = await client.send("DOM.resolveNode", { nodeId: queried.nodeId });
  const objectId = resolved.object?.objectId;
  if (!objectId) fail(`could not resolve accessibility target: ${selector}`);
  try {
    const tree = await client.send("Accessibility.queryAXTree", { objectId });
    const exposed = (tree.nodes || []).filter((node) => node.ignored !== true);
    return {
      present: true,
      axCount: exposed.length,
      accessibilityCount: exposed.length,
      names: exposed.map((node) => String(node.name?.value || "").replace(/\s+/g, " ").trim()).filter(Boolean).slice(0, 16),
      roles: exposed.map((node) => String(node.role?.value || "")).filter(Boolean).slice(0, 16),
    };
  } finally {
    await releaseRemote(client, objectId);
  }
}

async function waitForQa(client) {
  const deadline = Date.now() + DEFAULT_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const ready = await evaluate(client, `Boolean(window.__LID_QA__ && typeof window.__LID_QA__.manifest === "function")`);
    if (ready) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  fail("window.__LID_QA__ did not become ready");
}

async function waitForRender(client) {
  await evaluate(client, `(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await Promise.all(Array.from(document.images).map((image) => image.complete
      ? Promise.resolve()
      : new Promise((resolveImage) => {
          image.addEventListener("load", resolveImage, { once: true });
          image.addEventListener("error", resolveImage, { once: true });
        })));
    await new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)));
    return true;
  })()`);
}

function arraysEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function valueSha256(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function assertSafeSourceContextExport(snapshot) {
  if (!snapshot || !SAFE_SOURCE_CONTEXT_VARIANTS.includes(snapshot.sourceContextVariant)) {
    fail("the QA snapshot is missing its exact safe sourceContextVariant token");
  }
  const queue = [snapshot];
  while (queue.length) {
    const current = queue.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      if (/sourcecontext/i.test(key) && key !== "sourceContextVariant") {
        fail("the QA snapshot exposes a forbidden structured source-context field");
      }
      if (value && typeof value === "object") queue.push(value);
    }
  }
}

function safeSnapshotSummary(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return null;
  assertSafeSourceContextExport(snapshot);
  const page = (lane) => {
    const record = snapshot.pagination?.[lane] || {};
    const baseline = record.anchor?.baseline || null;
    const restoration = record.anchor?.lastRestoration || null;
    return {
      stage: record.stage ?? null,
      added: record.added ?? null,
      duplicateIgnored: record.duplicateIgnored ?? null,
      requestGeneration: record.requestGeneration ?? null,
      terminalGeneration: record.terminalGeneration ?? null,
      initialCount: record.initialCount ?? null,
      currentCount: record.currentCount ?? null,
      endReached: record.endReached ?? null,
      anchor: {
        baseline: baseline ? {
          generation: baseline.generation ?? null,
          kind: baseline.kind ?? null,
          input: baseline.input ?? null,
          top: baseline.top ?? null,
          confirmed: baseline.confirmed ?? null,
          restoring: baseline.restoring ?? null,
        } : null,
        lastRestoration: restoration ? {
          generation: restoration.generation ?? null,
          input: restoration.input ?? null,
          beforeTop: restoration.beforeTop ?? null,
          finalTop: restoration.finalTop ?? null,
          delta: restoration.delta ?? null,
          targetId: restoration.targetId ?? null,
          terminalStage: restoration.terminalStage ?? null,
          focused: restoration.focused ?? null,
          consumed: restoration.consumed ?? null,
        } : null,
      },
    };
  };
  return {
    version: snapshot.version ?? null,
    feature: snapshot.feature ?? null,
    fixture: snapshot.fixture ?? null,
    transitionBranch: snapshot.transitionBranch ?? null,
    scope: snapshot.scope ?? null,
    theme: snapshot.theme ?? null,
    loadedVersions: Array.isArray(snapshot.loadedVersions) ? [...snapshot.loadedVersions] : null,
    visibleSourceKeys: Array.isArray(snapshot.visibleSourceKeys) ? [...snapshot.visibleSourceKeys] : null,
    visibleDerivedKeys: Array.isArray(snapshot.visibleDerivedKeys) ? [...snapshot.visibleDerivedKeys] : null,
    laneCounts: snapshot.laneCounts ? { ...snapshot.laneCounts } : null,
    totalCount: snapshot.totalCount ?? null,
    appliedFilters: snapshot.appliedFilters ? { ...snapshot.appliedFilters } : null,
    draftFilters: snapshot.draftFilters ? { ...snapshot.draftFilters } : null,
    activeFilterCount: snapshot.activeFilterCount ?? null,
    filterOpen: snapshot.filterOpen ?? null,
    consoleOpen: snapshot.consoleOpen ?? null,
    disclosureDefaultIntact: snapshot.disclosureDefaultIntact ?? null,
    initialPresentation: snapshot.initialPresentation ?? null,
    sourceContextVariant: snapshot.sourceContextVariant,
    openDisclosureKeys: Array.isArray(snapshot.openDisclosureKeys) ? [...snapshot.openDisclosureKeys] : null,
    pagination: { source: page("source"), derived: page("derived") },
    domain: {
      beforeEqualsCurrent: snapshot.preOpenDomainFingerprint === snapshot.currentDomainFingerprint,
      beforeSha256: typeof snapshot.preOpenDomainFingerprint === "string" ? valueSha256(snapshot.preOpenDomainFingerprint) : null,
      currentSha256: typeof snapshot.currentDomainFingerprint === "string" ? valueSha256(snapshot.currentDomainFingerprint) : null,
    },
    counters: {
      mutationIntents: snapshot.mutationIntents ?? null,
      mutationEffects: snapshot.mutationEffects ?? null,
      providerRequests: snapshot.providerRequests ?? null,
    },
    announcementMatches: {
      empty: snapshot.announcement === "",
      representedCount3: snapshot.announcement === "3 represented events",
      sourceAdded3: snapshot.announcement === "3 earlier Source events added",
      derivedAdded3: snapshot.announcement === "3 earlier Derived events added",
    },
    stableFocusKey: snapshot.stableFocusKey ?? null,
  };
}

async function safeInteractionState(client) {
  const observed = await evaluate(client, `(() => {
    const active = document.activeElement;
    const safeAction = active?.getAttribute?.("data-lid-action")
      || active?.getAttribute?.("data-lid-v18-action")
      || null;
    const safeEventKey = active?.closest?.("[data-lid-v18-event]")?.getAttribute("data-lid-v18-event") || null;
    return {
      snapshot: window.__LID_QA__.snapshot(),
      focus: active ? {
        tagName: active.tagName.toLowerCase(),
        id: active.id || null,
        role: active.getAttribute("role") || null,
        action: safeAction,
        eventKey: safeEventKey,
        focusKey: active.getAttribute("data-lid-focus-key") || null,
      } : null,
      scroll: { x: scrollX, y: scrollY },
    };
  })()`);
  const summary = safeSnapshotSummary(observed.snapshot);
  return {
    snapshotSha256: valueSha256(summary),
    summary,
    focus: observed.focus,
    scroll: observed.scroll,
  };
}

async function inspectVisibleControl(client, spec) {
  const record = await evaluate(client, `(() => {
    const selector = ${JSON.stringify(spec.selector)};
    let control;
    try {
      control = document.querySelector(selector);
    } catch (error) {
      throw new Error("Invalid scenario control selector: " + error.message);
    }
    if (!control) throw new Error("Scenario control was not found: " + selector);
    const rectangle = control.getBoundingClientRect();
    const style = getComputedStyle(control);
    const center = { x: rectangle.left + rectangle.width / 2, y: rectangle.top + rectangle.height / 2 };
    const hit = document.elementFromPoint(center.x, center.y);
    const visible = Boolean(rectangle.width > 0 && rectangle.height > 0 && control.getClientRects().length
      && !control.hidden && !control.closest("[hidden], [inert]")
      && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0
      && rectangle.bottom > 0 && rectangle.right > 0 && rectangle.top < innerHeight && rectangle.left < innerWidth);
    const implicitRole = control.matches("button, summary") ? "button"
      : control.matches("select") ? "combobox"
        : control.matches("input") ? "textbox"
          : null;
    const labelText = control.closest("label")?.querySelector("span")?.textContent;
    const name = (control.getAttribute("aria-label") || labelText || control.textContent || "").replace(/\\s+/g, " ").trim();
    return {
      selector,
      role: control.getAttribute("role") || implicitRole,
      name,
      key: control.id || control.getAttribute("data-lid-action") || control.getAttribute("data-lid-v18-action")
        || control.closest("[data-lid-v18-event]")?.getAttribute("data-lid-v18-event") || null,
      visible,
      enabled: !Boolean(control.disabled) && control.getAttribute("aria-disabled") !== "true",
      centerHitWithinControl: Boolean(hit && (hit === control || control.contains(hit))),
      value: control instanceof HTMLInputElement || control instanceof HTMLSelectElement ? control.value : null,
    };
  })()`);
  if (!record.visible || !record.centerHitWithinControl) fail(`scenario control is not visibly actionable: ${spec.key}`);
  if (spec.enabled !== false && !record.enabled) fail(`scenario control is disabled: ${spec.key}`);
  if (spec.role && record.role !== spec.role) fail(`scenario control role mismatch for ${spec.key}: ${record.role}`);
  if (spec.name && record.name !== spec.name) fail(`scenario control name mismatch for ${spec.key}: ${record.name}`);
  if (spec.namePrefix && !record.name.startsWith(spec.namePrefix)) fail(`scenario control name mismatch for ${spec.key}: ${record.name}`);
  if (spec.value !== undefined && record.value !== spec.value) fail(`scenario control value mismatch for ${spec.key}: ${record.value}`);
  return {
    role: record.role,
    name: record.name,
    key: spec.key,
    visible: record.visible,
    enabled: record.enabled,
    centerHitWithinControl: record.centerHitWithinControl,
    value: record.value,
  };
}

async function runQaStep(client, transcript, step) {
  const before = await safeInteractionState(client);
  const anchorBefore = step.anchor
    ? await inspectLogicalAnchor(client, step.anchor.selector, step.anchor.key)
    : null;
  const transitioned = await evaluate(client, `(() => {
    window.__LID_QA__.dispatch(${JSON.stringify(step.type)}, ${JSON.stringify(step.payload || {})});
    return true;
  })()`);
  if (!transitioned) fail(`public QA transition failed: ${step.type}`);
  await waitForInteractionSettled(client);
  const after = await safeInteractionState(client);
  if (!after.summary?.domain?.beforeEqualsCurrent
    || after.summary.counters.mutationIntents !== 0
    || after.summary.counters.mutationEffects !== 0
    || after.summary.counters.providerRequests !== 0) {
    fail(`scenario transition changed the read-only domain: ${step.type}`);
  }
  const anchor = step.anchor
    ? buildAnchorEvidence(
      anchorBefore,
      await inspectLogicalAnchor(client, step.anchor.selector, step.anchor.key),
      step.type,
      step.anchor.lane,
      after.summary.pagination[step.anchor.lane],
    )
    : null;
  transcript.push({
    ordinal: transcript.length + 1,
    transition: {
      channel: "window.__LID_QA__.dispatch",
      kind: "qa-transition",
      actualUserStep: false,
      type: step.type,
    },
    control: null,
    before,
    after,
    presentation: {
      filterOpenChanged: before.summary.filterOpen !== after.summary.filterOpen,
      consoleOpenChanged: before.summary.consoleOpen !== after.summary.consoleOpen,
    },
    anchor,
    result: "PASS",
  });
  return after;
}

async function dispatchPaginationAuditAction(client, type, payload) {
  const payloadArgument = payload === undefined ? "undefined" : JSON.stringify(payload);
  await evaluate(client, `(() => {
    window.__LID_QA__.dispatch(${JSON.stringify(type)}, ${payloadArgument});
    return true;
  })()`);
  await waitForInteractionSettled(client);
  return safeInteractionState(client);
}

async function observePaginationAuditState(client) {
  const interaction = await safeInteractionState(client);
  const dom = await evaluate(client, `(() => {
    const completion = document.querySelector(".lid-pagination-completion-v18");
    const controls = [...document.querySelectorAll("[data-lid-action][data-lid-request-generation]")]
      .map((control) => ({
        action: control.getAttribute("data-lid-action"),
        generation: control.getAttribute("data-lid-request-generation"),
        text: (control.textContent || "").replace(/\\s+/g, " ").trim(),
        disabled: Boolean(control.disabled),
      }));
    return {
      completion: {
        count: document.querySelectorAll(".lid-pagination-completion-v18").length,
        text: (completion?.textContent || "").replace(/\\s+/g, " ").trim(),
      },
      controls,
      live: {
        polite: (document.querySelector("#lid-status-v17")?.textContent || "").replace(/\\s+/g, " ").trim(),
        assertive: (document.querySelector("#lid-alert-v17")?.textContent || "").replace(/\\s+/g, " ").trim(),
      },
      activeFeature: document.querySelector("#lid-runtime-v17")?.dataset.activeFeature || null,
      navigation: { pathname: location.pathname, search: location.search, hash: location.hash, historyStateNull: history.state === null },
    };
  })()`);
  const value = { interaction, dom };
  return { ...value, digestSha256: valueSha256(value) };
}

async function assertStrictPaginationNoOp(client, records, spec) {
  const before = await observePaginationAuditState(client);
  await dispatchPaginationAuditAction(client, spec.type, spec.payload);
  const after = await observePaginationAuditState(client);
  if (before.digestSha256 !== after.digestSha256 || !arraysEqual(before, after)) {
    fail(`pagination terminal was not a strict no-op for ${spec.label}: ${JSON.stringify({ before, after, spec })}`);
  }
  records.push({
    label: spec.label,
    type: spec.type,
    payload: spec.payload === undefined ? { omitted: true } : spec.payload,
    beforeSha256: before.digestSha256,
    afterSha256: after.digestSha256,
    exactStateFocusAnnouncementAnchorDigestCountersNoOp: true,
  });
}

function exactPaginationTuple(state) {
  return {
    source: state.summary.pagination.source,
    derived: state.summary.pagination.derived,
  };
}

async function runTerminalGenerationRegression(client) {
  const strictNoOps = [];
  await evaluate(client, `window.__LID_QA__.setFixture("global-ready")`);
  await dispatchPaginationAuditAction(client, "enter-pagination");
  const sourcePending = await dispatchPaginationAuditAction(client, "load-source");
  if (sourcePending.summary.pagination.source.stage !== "pending"
    || sourcePending.summary.pagination.source.requestGeneration !== 1
    || sourcePending.summary.pagination.source.terminalGeneration !== null) {
    fail(`generation regression did not seed Source request 1: ${JSON.stringify(sourcePending.summary.pagination.source)}`);
  }

  for (const spec of [
    { label: "direct success omitted payload", type: "deliver-source-success" },
    { label: "direct failure missing generation", type: "deliver-source-failure", payload: { lane: "source" } },
    { label: "direct interruption missing lane", type: "deliver-source-interruption", payload: { requestGeneration: 1 } },
    { label: "missing generation", type: "pagination-success", payload: { lane: "source" } },
    { label: "zero generation", type: "pagination-failure", payload: { lane: "source", requestGeneration: 0 } },
    { label: "negative generation", type: "pagination-interrupted", payload: { lane: "source", requestGeneration: -1 } },
    { label: "fractional generation", type: "pagination-success", payload: { lane: "source", requestGeneration: 1.5 } },
    { label: "string generation", type: "pagination-success", payload: { lane: "source", requestGeneration: "1" } },
    { label: "future generation", type: "pagination-success", payload: { lane: "source", requestGeneration: 2 } },
    { label: "cross-lane direct terminal", type: "deliver-source-success", payload: { lane: "derived", requestGeneration: 1 } },
    { label: "conflicting generation aliases", type: "pagination-success", payload: { lane: "source", requestGeneration: 1, generation: 2 } },
    { label: "duplicate while pending", type: "pagination-duplicate", payload: { lane: "source", requestGeneration: 1 } },
    { label: "settle missing outcome", type: "settle-pagination", payload: { lane: "source", requestGeneration: 1 } },
  ]) await assertStrictPaginationNoOp(client, strictNoOps, spec);

  const failed = await dispatchPaginationAuditAction(client, "pagination-failure", { lane: "source", generation: 1 });
  if (failed.summary.pagination.source.stage !== "failed"
    || failed.summary.pagination.source.requestGeneration !== 1
    || failed.summary.pagination.source.terminalGeneration !== 1) {
    fail(`exact alias failure generation 1 was not accepted: ${JSON.stringify(failed.summary.pagination.source)}`);
  }
  await assertStrictPaginationNoOp(client, strictNoOps, {
    label: "consumed failure generation",
    type: "deliver-source-failure",
    payload: { lane: "source", requestGeneration: 1 },
  });

  const retryTwo = await dispatchPaginationAuditAction(client, "retry-source");
  if (retryTwo.summary.pagination.source.stage !== "pending" || retryTwo.summary.pagination.source.requestGeneration !== 2) {
    fail(`Source retry did not create exact request generation 2: ${JSON.stringify(retryTwo.summary.pagination.source)}`);
  }
  await assertStrictPaginationNoOp(client, strictNoOps, {
    label: "stale generation after retry",
    type: "pagination-interrupted",
    payload: { lane: "source", requestGeneration: 1 },
  });
  await assertStrictPaginationNoOp(client, strictNoOps, {
    label: "future generation after retry",
    type: "settle-pagination",
    payload: { lane: "source", requestGeneration: 3, outcome: "interruption" },
  });
  const interrupted = await dispatchPaginationAuditAction(client, "settle-pagination", { lane: "source", requestGeneration: 2, outcome: "interruption" });
  if (interrupted.summary.pagination.source.stage !== "interrupted"
    || interrupted.summary.pagination.source.terminalGeneration !== 2) {
    fail(`exact settle interruption generation 2 was not accepted: ${JSON.stringify(interrupted.summary.pagination.source)}`);
  }

  const retryThree = await dispatchPaginationAuditAction(client, "retry-source");
  if (retryThree.summary.pagination.source.stage !== "pending" || retryThree.summary.pagination.source.requestGeneration !== 3) {
    fail(`Source retry did not create exact request generation 3: ${JSON.stringify(retryThree.summary.pagination.source)}`);
  }
  const delivered = await dispatchPaginationAuditAction(client, "deliver-source-success", { lane: "source", requestGeneration: 3 });
  if (delivered.summary.pagination.source.stage !== "complete-delivered"
    || delivered.summary.pagination.source.requestGeneration !== 3
    || delivered.summary.pagination.source.terminalGeneration !== 3
    || delivered.summary.pagination.source.added !== 3) {
    fail(`exact direct Source success generation 3 was not accepted once: ${JSON.stringify(delivered.summary.pagination.source)}`);
  }
  for (const spec of [
    { label: "duplicate missing generation", type: "duplicate-source", payload: { lane: "source" } },
    { label: "duplicate stale generation", type: "pagination-duplicate", payload: { lane: "source", requestGeneration: 3 } },
    { label: "duplicate future generation", type: "pagination-duplicate", payload: { lane: "source", requestGeneration: 5 } },
    { label: "duplicate cross-lane", type: "duplicate-source", payload: { lane: "derived", requestGeneration: 4 } },
  ]) await assertStrictPaginationNoOp(client, strictNoOps, spec);
  const duplicate = await dispatchPaginationAuditAction(client, "pagination-duplicate", { lane: "source", requestGeneration: 4 });
  if (duplicate.summary.pagination.source.stage !== "complete-duplicate"
    || duplicate.summary.pagination.source.requestGeneration !== 4
    || duplicate.summary.pagination.source.terminalGeneration !== 4
    || duplicate.summary.pagination.source.added !== 3
    || duplicate.summary.pagination.source.duplicateIgnored !== true) {
    fail(`exact Source duplicate generation 4 was not consumed once: ${JSON.stringify(duplicate.summary.pagination.source)}`);
  }
  await assertStrictPaginationNoOp(client, strictNoOps, {
    label: "consumed duplicate generation",
    type: "duplicate-source",
    payload: { lane: "source", requestGeneration: 4 },
  });

  await evaluate(client, `window.__LID_QA__.setFixture("global-ready")`);
  await dispatchPaginationAuditAction(client, "enter-pagination");
  const derivedPending = await dispatchPaginationAuditAction(client, "load-derived");
  if (derivedPending.summary.pagination.derived.stage !== "pending" || derivedPending.summary.pagination.derived.requestGeneration !== 1) {
    fail(`generation regression did not seed Derived request 1: ${JSON.stringify(derivedPending.summary.pagination.derived)}`);
  }
  await assertStrictPaginationNoOp(client, strictNoOps, {
    label: "same-number cross-lane alias",
    type: "pagination-success",
    payload: { lane: "source", requestGeneration: 1 },
  });
  const derivedInterrupted = await dispatchPaginationAuditAction(client, "deliver-derived-interruption", { lane: "derived", requestGeneration: 1 });
  if (derivedInterrupted.summary.pagination.derived.stage !== "interrupted"
    || derivedInterrupted.summary.pagination.derived.terminalGeneration !== 1) {
    fail(`exact direct Derived interruption was not accepted: ${JSON.stringify(derivedInterrupted.summary.pagination.derived)}`);
  }
  const derivedRetry = await dispatchPaginationAuditAction(client, "retry-derived");
  if (derivedRetry.summary.pagination.derived.stage !== "pending" || derivedRetry.summary.pagination.derived.requestGeneration !== 2) {
    fail(`Derived retry did not create exact generation 2: ${JSON.stringify(derivedRetry.summary.pagination.derived)}`);
  }
  const derivedSuccess = await dispatchPaginationAuditAction(client, "pagination-success", { lane: "derived", requestGeneration: 2 });
  if (derivedSuccess.summary.pagination.derived.stage !== "complete-delivered"
    || derivedSuccess.summary.pagination.derived.terminalGeneration !== 2
    || derivedSuccess.summary.pagination.derived.added !== 3) {
    fail(`exact alias Derived success was not accepted: ${JSON.stringify(derivedSuccess.summary.pagination.derived)}`);
  }
  const derivedDuplicate = await dispatchPaginationAuditAction(client, "settle-pagination", { lane: "derived", requestGeneration: 3, outcome: "duplicate" });
  if (derivedDuplicate.summary.pagination.derived.stage !== "complete-duplicate"
    || derivedDuplicate.summary.pagination.derived.requestGeneration !== 3
    || derivedDuplicate.summary.pagination.derived.terminalGeneration !== 3
    || derivedDuplicate.summary.pagination.derived.duplicateIgnored !== true) {
    fail(`exact settle Derived duplicate was not accepted: ${JSON.stringify(derivedDuplicate.summary.pagination.derived)}`);
  }

  return {
    strictNoOpCount: strictNoOps.length,
    strictNoOps,
    acceptedTerminalPath: [
      "Source alias failure g1", "Source settle interruption g2", "Source direct success g3", "Source alias duplicate g4",
      "Derived direct interruption g1", "Derived alias success g2", "Derived settle duplicate g3",
    ],
    explicitPositiveExactSameLaneGenerationRequired: true,
    result: "PASS",
  };
}

async function runPaginationActivationRegression(client) {
  const records = [];
  const anchoredStrictNoOps = [];
  for (const method of ["pointer", "enter", "space", "click-only"]) {
    await evaluate(client, `window.__LID_QA__.setFixture("global-ready")`);
    await dispatchPaginationAuditAction(client, "enter-pagination");
    await scrollSelectorIntoView(client, "#lid-v18-load-source");
    if (method !== "pointer") {
      await evaluate(client, `(() => {
        const control = document.querySelector("#lid-v18-load-source");
        if (!(control instanceof HTMLButtonElement)) throw new Error("Source pagination control missing");
        control.focus({ preventScroll: true });
        return document.activeElement === control;
      })()`);
    }
    const anchorBefore = await inspectLogicalAnchor(client, "#lid-v18-load-source", "source-page");
    if (method === "pointer") await dispatchVisibleMouseClick(client, "#lid-v18-load-source");
    else if (method === "enter") await dispatchKeyboardEnterActivation(client);
    else if (method === "space") await dispatchKeyboardKey(client, " ", "Space", 32, " ");
    else await evaluate(client, `document.querySelector("#lid-v18-load-source").click()`);
    await waitForInteractionSettled(client);
    const pending = await observePaginationAuditState(client);
    const pagePending = pending.interaction.summary.pagination.source;
    const sourceOutcomeControls = pending.dom.controls.filter((control) => control.action?.startsWith("deliver-source-"));
    if (pagePending.stage !== "pending" || pagePending.requestGeneration !== 1 || pagePending.terminalGeneration !== null
      || pagePending.anchor.baseline?.generation !== 1 || pagePending.anchor.baseline?.kind !== "load"
      || pagePending.anchor.baseline?.input !== method || pagePending.anchor.baseline?.confirmed !== true
      || Math.abs(pagePending.anchor.baseline.top - anchorBefore.top) > ANCHOR_TOLERANCE_PX
      || sourceOutcomeControls.length !== 3 || sourceOutcomeControls.some((control) => control.generation !== "1" || control.disabled)) {
      fail(`pagination ${method} activation did not retain exactly one bound request baseline: ${JSON.stringify({ anchorBefore, pagePending, sourceOutcomeControls })}`);
    }
    await assertStrictPaginationNoOp(client, anchoredStrictNoOps, {
      label: `${method} confirmed-anchor future terminal`,
      type: "deliver-source-success",
      payload: { lane: "source", requestGeneration: 2 },
    });

    let terminalMethod = "explicit QA success with exact generation";
    if (method === "pointer") {
      const outcomeSpec = {
        selector: '[data-lid-action="deliver-source-success"]',
        role: "button",
        name: "Deliver 3 earlier events",
        key: "deliver-source-success",
      };
      await inspectVisibleControl(client, outcomeSpec);
      await dispatchVisibleMouseClick(client, outcomeSpec.selector);
      await waitForInteractionSettled(client);
      terminalMethod = "visible bound success control";
    } else {
      await dispatchPaginationAuditAction(client, "deliver-source-success", { lane: "source", requestGeneration: 1 });
    }
    const delivered = await observePaginationAuditState(client);
    const pageDelivered = delivered.interaction.summary.pagination.source;
    const restoration = pageDelivered.anchor.lastRestoration;
    if (pageDelivered.stage !== "complete-delivered" || pageDelivered.requestGeneration !== 1
      || pageDelivered.terminalGeneration !== 1 || pageDelivered.added !== 3 || pageDelivered.duplicateIgnored
      || pageDelivered.anchor.baseline !== null || restoration?.generation !== 1 || restoration?.input !== method
      || restoration?.targetId !== "lid-v18-load-source" || restoration?.terminalStage !== "complete-delivered"
      || restoration?.focused !== true || restoration?.consumed !== true || Math.abs(restoration?.delta ?? Infinity) > ANCHOR_TOLERANCE_PX
      || delivered.interaction.focus?.id !== "lid-v18-load-source") {
      fail(`pagination ${method} terminal restoration was not app-owned and exact: ${JSON.stringify(pageDelivered)}`);
    }

    let duplicate = null;
    if (method === "click-only") {
      const duplicateBefore = await inspectLogicalAnchor(client, "#lid-v18-load-source", "source-page");
      const duplicateControl = await inspectVisibleControl(client, {
        selector: '[data-lid-action="duplicate-source"]',
        role: "button",
        name: "Deliver duplicate result",
        key: "duplicate-source",
      });
      if (duplicateControl.generation !== undefined) fail("safe duplicate control export unexpectedly exposed a generation field");
      await evaluate(client, `document.querySelector('[data-lid-action="duplicate-source"]').click()`);
      await waitForInteractionSettled(client);
      const duplicateState = await observePaginationAuditState(client);
      const duplicatePage = duplicateState.interaction.summary.pagination.source;
      const duplicateRestoration = duplicatePage.anchor.lastRestoration;
      if (duplicatePage.stage !== "complete-duplicate" || duplicatePage.requestGeneration !== 2
        || duplicatePage.terminalGeneration !== 2 || duplicatePage.added !== 3 || duplicatePage.duplicateIgnored !== true
        || duplicateRestoration?.generation !== 2 || duplicateRestoration?.input !== "click-only"
        || duplicateRestoration?.targetId !== "lid-v18-load-source" || duplicateRestoration?.terminalStage !== "complete-duplicate"
        || duplicateRestoration?.focused !== true || duplicateRestoration?.consumed !== true
        || Math.abs(duplicateRestoration?.delta ?? Infinity) > ANCHOR_TOLERANCE_PX) {
        fail(`click-only duplicate did not consume exactly bound generation 2: ${JSON.stringify(duplicatePage)}`);
      }
      duplicate = {
        beforeTop: duplicateBefore.top,
        generation: duplicatePage.requestGeneration,
        restoration: duplicateRestoration,
        result: "PASS",
      };
    }
    records.push({
      input: method,
      baselineTop: anchorBefore.top,
      requestGeneration: pageDelivered.requestGeneration,
      terminalGeneration: pageDelivered.terminalGeneration,
      terminalMethod,
      restoration,
      duplicate,
      postBaselineHelperFocusScrollCompensation: false,
      assistiveTechnologyClaim: false,
      result: "PASS",
    });
  }
  return {
    inputs: ["pointer", "enter", "space", "click-only"],
    records,
    anchoredStrictNoOps,
    confirmedAnchorNoOpCount: anchoredStrictNoOps.length,
    result: "PASS",
  };
}

async function runFilteredPaginationCompletionRegression(client) {
  await evaluate(client, `window.__LID_QA__.setFixture("global-ready")`);
  await dispatchPaginationAuditAction(client, "enter-pagination");
  await dispatchPaginationAuditAction(client, "load-source");
  await dispatchPaginationAuditAction(client, "deliver-source-success", { lane: "source", requestGeneration: 1 });
  await dispatchPaginationAuditAction(client, "load-derived");
  await dispatchPaginationAuditAction(client, "deliver-derived-success", { lane: "derived", requestGeneration: 1 });
  const unfiltered = await observePaginationAuditState(client);
  const unfilteredAccessibility = await accessibilityForSelector(client, ".lid-pagination-completion-v18");
  const paginationBeforeFilter = exactPaginationTuple(unfiltered.interaction);
  if (unfiltered.interaction.summary.totalCount !== 17
    || unfiltered.interaction.summary.pagination.source.currentCount !== 10
    || unfiltered.interaction.summary.pagination.derived.currentCount !== 7
    || unfiltered.dom.completion.count !== 1
    || !unfiltered.dom.completion.text.includes("Source history10 shown · Exactly 3 earlier added · Beginning reached")
    || !unfiltered.dom.completion.text.includes("Derived history7 shown · Exactly 3 earlier added · Beginning reached")
    || unfilteredAccessibility.axCount === 0) {
    fail(`unfiltered pagination completion is not exact: ${JSON.stringify({ unfiltered, unfilteredAccessibility })}`);
  }

  await dispatchPaginationAuditAction(client, "draft-lane", { value: "source" });
  await dispatchPaginationAuditAction(client, "draft-attention", { value: "needs" });
  await dispatchPaginationAuditAction(client, "apply-filters");
  const filtered = await observePaginationAuditState(client);
  const filteredAccessibility = await accessibilityForSelector(client, ".lid-pagination-completion-v18");
  const paginationWhileFiltered = exactPaginationTuple(filtered.interaction);
  if (!arraysEqual(filtered.interaction.summary.visibleSourceKeys, ["E14", "E13", "E12"])
    || !arraysEqual(filtered.interaction.summary.visibleDerivedKeys, [])
    || filtered.interaction.summary.totalCount !== 3 || filtered.interaction.summary.activeFilterCount !== 2
    || filtered.dom.completion.count !== 0 || filtered.dom.completion.text !== ""
    || filteredAccessibility.present || filteredAccessibility.axCount !== 0
    || !arraysEqual(paginationWhileFiltered, paginationBeforeFilter)) {
    fail(`filtered completion suppression or pagination retention is not exact: ${JSON.stringify({ filtered, filteredAccessibility, paginationBeforeFilter, paginationWhileFiltered })}`);
  }

  await dispatchPaginationAuditAction(client, "clear-filters");
  const cleared = await observePaginationAuditState(client);
  const clearedAccessibility = await accessibilityForSelector(client, ".lid-pagination-completion-v18");
  const paginationAfterClear = exactPaginationTuple(cleared.interaction);
  if (cleared.interaction.summary.activeFilterCount !== 0 || cleared.interaction.summary.totalCount !== 17
    || cleared.interaction.summary.pagination.source.currentCount !== 10
    || cleared.interaction.summary.pagination.derived.currentCount !== 7
    || cleared.dom.completion.count !== 1
    || !cleared.dom.completion.text.includes("Source history10 shown · Exactly 3 earlier added · Beginning reached")
    || !cleared.dom.completion.text.includes("Derived history7 shown · Exactly 3 earlier added · Beginning reached")
    || clearedAccessibility.axCount === 0
    || !arraysEqual(paginationAfterClear, paginationBeforeFilter)) {
    fail(`clearing filters did not restore the truthful 10/7 summary without pagination drift: ${JSON.stringify({ cleared, clearedAccessibility, paginationBeforeFilter, paginationAfterClear })}`);
  }
  return {
    unfiltered: { totalCount: 17, sourceCount: 10, derivedCount: 7, completionDomCount: 1, completionAxCount: unfilteredAccessibility.axCount },
    filtered: { keys: ["E14", "E13", "E12"], totalCount: 3, completionDomCount: 0, completionAxCount: 0 },
    cleared: { totalCount: 17, sourceCount: 10, derivedCount: 7, completionDomCount: 1, completionAxCount: clearedAccessibility.axCount },
    paginationBeforeSha256: valueSha256(paginationBeforeFilter),
    paginationFilteredSha256: valueSha256(paginationWhileFiltered),
    paginationClearedSha256: valueSha256(paginationAfterClear),
    noDeliveryResetGenerationDrift: true,
    result: "PASS",
  };
}

async function runQa2PaginationRegression(client) {
  const terminalGenerations = await runTerminalGenerationRegression(client);
  const activations = await runPaginationActivationRegression(client);
  const filteredCompletion = await runFilteredPaginationCompletionRegression(client);
  await evaluate(client, `window.__LID_QA__.setFixture("global-ready")`);
  await waitForInteractionSettled(client);
  return {
    scope: "bounded frame-14 pre-scenario regression; safe metadata only",
    transcriptRecordCountAdded: 0,
    terminalGenerations,
    activations,
    filteredCompletion,
    result: "PASS",
  };
}

async function waitForInteractionSettled(client) {
  try {
    await evaluate(client, `new Promise((resolveDone) => {
      let remaining = 5;
      const next = () => {
        remaining -= 1;
        if (remaining <= 0) resolveDone(true);
        else requestAnimationFrame(next);
      };
      requestAnimationFrame(next);
    })`);
  } catch (error) {
    throw new Error(`interaction animation frames did not settle: ${error.message}`);
  }
  try {
    await waitForRender(client);
  } catch (error) {
    throw new Error(`interaction render assets did not settle: ${error.message}`);
  }
}

async function controlCenter(client, selector) {
  return evaluate(client, `(() => {
    const control = document.querySelector(${JSON.stringify(selector)});
    if (!control) throw new Error("Actual-step control is missing");
    const rectangle = control.getBoundingClientRect();
    return { x: rectangle.left + rectangle.width / 2, y: rectangle.top + rectangle.height / 2 };
  })()`);
}

async function inspectLogicalAnchor(client, selector, key) {
  const observation = await evaluate(client, `(() => {
    const anchor = document.querySelector(${JSON.stringify(selector)});
    if (!(anchor instanceof HTMLElement)) throw new Error("Logical pagination anchor is missing");
    const rectangle = anchor.getBoundingClientRect();
    return {
      top: Math.round(rectangle.top * 1000) / 1000,
      bottom: Math.round(rectangle.bottom * 1000) / 1000,
      scrollY: Math.round(scrollY * 1000) / 1000,
      focused: document.activeElement === anchor,
      visible: rectangle.bottom > 0 && rectangle.right > 0 && rectangle.top < innerHeight && rectangle.left < innerWidth,
    };
  })()`);
  return { key, ...observation };
}

function buildAnchorEvidence(anchorBefore, anchorAfter, type, lane, page) {
  const topDelta = Math.round((anchorAfter.top - anchorBefore.top) * 1000) / 1000;
  const baseline = page?.anchor?.baseline || null;
  const restoration = page?.anchor?.lastRestoration || null;
  const targetId = `lid-v18-load-${lane}`;
  const loadPass = type === `load-${lane}`
    && page?.stage === "pending"
    && Number.isInteger(page.requestGeneration) && page.requestGeneration > 0
    && page.terminalGeneration === null
    && baseline?.generation === page.requestGeneration
    && baseline?.kind === "load"
    && baseline?.input === "pointer"
    && baseline?.confirmed === true
    && baseline?.restoring === false
    && Math.abs(baseline.top - anchorBefore.top) <= ANCHOR_TOLERANCE_PX
    && restoration === null;
  const deliveryPass = type === `deliver-${lane}-success`
    && page?.stage === "complete-delivered"
    && Number.isInteger(page.requestGeneration) && page.requestGeneration > 0
    && page.terminalGeneration === page.requestGeneration
    && baseline === null
    && restoration?.generation === page.requestGeneration
    && restoration?.input === "pointer"
    && restoration?.targetId === targetId
    && restoration?.terminalStage === "complete-delivered"
    && restoration?.focused === true
    && restoration?.consumed === true
    && Math.abs(restoration.beforeTop - anchorBefore.top) <= ANCHOR_TOLERANCE_PX
    && Math.abs(restoration.finalTop - anchorAfter.top) <= ANCHOR_TOLERANCE_PX
    && Math.abs(restoration.delta) <= ANCHOR_TOLERANCE_PX;
  const appPass = loadPass || deliveryPass;
  const anchor = {
    lane,
    key: anchorBefore.key,
    targetId,
    beforeTop: anchorBefore.top,
    afterTop: anchorAfter.top,
    topDelta,
    tolerancePx: ANCHOR_TOLERANCE_PX,
    scrollYBefore: anchorBefore.scrollY,
    scrollYAfter: anchorAfter.scrollY,
    scrollYCompensation: Math.round((anchorAfter.scrollY - anchorBefore.scrollY) * 1000) / 1000,
    visibleBefore: anchorBefore.visible,
    visibleAfter: anchorAfter.visible,
    focusedAfter: anchorAfter.focused,
    app: {
      requestGeneration: page?.requestGeneration ?? null,
      terminalGeneration: page?.terminalGeneration ?? null,
      baseline,
      restoration,
      pass: appPass,
    },
    pass: anchorBefore.visible && anchorAfter.visible && anchorAfter.focused
      && Math.abs(topDelta) <= ANCHOR_TOLERANCE_PX && appPass,
  };
  if (!anchor.pass) fail(`logical pagination anchor did not remain visible and stable during ${type}: ${JSON.stringify(anchor)}`);
  return anchor;
}

async function dispatchVisibleMouseClick(client, selector) {
  const point = await controlCenter(client, selector);
  await client.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: point.x,
    y: point.y,
    button: "left",
    buttons: 1,
    clickCount: 1,
  });
  await client.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: point.x,
    y: point.y,
    button: "left",
    buttons: 0,
    clickCount: 1,
  });
}

function assertReadOnlyStep(after, type) {
  if (!after.summary?.domain?.beforeEqualsCurrent
    || after.summary.counters.mutationIntents !== 0
    || after.summary.counters.mutationEffects !== 0
    || after.summary.counters.providerRequests !== 0) {
    fail(`actual scenario step changed the read-only domain: ${type}`);
  }
}

async function runActualClickStep(client, transcript, step) {
  await scrollSelectorIntoView(client, step.control.selector);
  const control = await inspectVisibleControl(client, step.control);
  const before = await safeInteractionState(client);
  const anchorBefore = step.anchor
    ? await inspectLogicalAnchor(client, step.anchor.selector, step.anchor.key)
    : null;
  await dispatchVisibleMouseClick(client, step.control.selector);
  await waitForInteractionSettled(client);
  const after = await safeInteractionState(client);
  assertReadOnlyStep(after, step.type);
  let anchor = null;
  if (step.anchor) {
    const anchorAfter = await inspectLogicalAnchor(client, step.anchor.selector, step.anchor.key);
    anchor = buildAnchorEvidence(anchorBefore, anchorAfter, step.type, step.anchor.lane, after.summary.pagination[step.anchor.lane]);
  }
  transcript.push({
    ordinal: transcript.length + 1,
    transition: {
      channel: "CDP visible-control pointer activation",
      kind: "visible-control",
      actualUserStep: true,
      type: step.type,
    },
    control,
    before,
    after,
    presentation: {
      filterOpenChanged: before.summary.filterOpen !== after.summary.filterOpen,
      consoleOpenChanged: before.summary.consoleOpen !== after.summary.consoleOpen,
    },
    anchor,
    result: "PASS",
  });
  return after;
}

async function dispatchKeyboardKey(client, key, code, windowsVirtualKeyCode, text = null) {
  const textFields = text === null ? {} : { text, unmodifiedText: text };
  await client.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key,
    code,
    windowsVirtualKeyCode,
    nativeVirtualKeyCode: windowsVirtualKeyCode,
    ...textFields,
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key,
    code,
    windowsVirtualKeyCode,
    nativeVirtualKeyCode: windowsVirtualKeyCode,
  });
}

async function dispatchShiftTab(client) {
  await client.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Shift",
    code: "ShiftLeft",
    windowsVirtualKeyCode: 16,
    nativeVirtualKeyCode: 16,
    modifiers: 8,
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Tab",
    code: "Tab",
    windowsVirtualKeyCode: 9,
    nativeVirtualKeyCode: 9,
    modifiers: 8,
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Tab",
    code: "Tab",
    windowsVirtualKeyCode: 9,
    nativeVirtualKeyCode: 9,
    modifiers: 8,
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Shift",
    code: "ShiftLeft",
    windowsVirtualKeyCode: 16,
    nativeVirtualKeyCode: 16,
  });
}

async function dispatchKeyboardEnterActivation(client) {
  await client.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
    text: "\r",
    unmodifiedText: "\r",
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
  });
}

async function runActualKeyboardActivationStep(client, transcript, step) {
  let phase = "pre-activation framing";
  try {
  await scrollSelectorIntoView(client, step.control.selector);
  phase = "initial keyboard-focus observation";
  let traversalCount = 0;
  let focused = await evaluate(client, `document.activeElement === document.querySelector(${JSON.stringify(step.control.selector)})`);
  while (!focused && traversalCount < step.maxShiftTabs) {
    phase = `native Shift+Tab traversal ${traversalCount + 1}`;
    await dispatchShiftTab(client);
    traversalCount += 1;
    phase = `keyboard-focus observation ${traversalCount}`;
    focused = await evaluate(client, `document.activeElement === document.querySelector(${JSON.stringify(step.control.selector)})`);
  }
  if (!focused || traversalCount === 0) {
    fail(`real reverse-keyboard traversal did not reach ${step.control.key}: ${JSON.stringify((await safeInteractionState(client)).focus)}`);
  }
  phase = "focused-control inspection";
  const control = await inspectVisibleControl(client, step.control);
  phase = "pre-activation state observation";
  const before = await safeInteractionState(client);
  phase = "native Enter activation";
  await dispatchKeyboardEnterActivation(client);
  phase = "post-activation rendering";
  await waitForInteractionSettled(client);
  phase = "post-activation state observation";
  const after = await safeInteractionState(client);
  assertReadOnlyStep(after, step.type);
  phase = "keyboard-visible indicator observation";
  const keyboardFocus = await evaluate(client, `(() => {
    const target = document.querySelector(${JSON.stringify(step.control.selector)});
    if (!(target instanceof HTMLElement)) throw new Error("keyboard activation target disappeared");
    const style = getComputedStyle(target);
    const rectangle = target.getBoundingClientRect();
    const outlineWidth = Number.parseFloat(style.outlineWidth) || 0;
    const hasOutline = style.outlineStyle !== "none" && outlineWidth > 0;
    const hasShadow = style.boxShadow !== "none";
    return {
      focused: document.activeElement === target,
      focusVisible: target.matches(":focus-visible"),
      visibleIndicator: target.matches(":focus-visible") && (hasOutline || hasShadow),
      outline: { style: style.outlineStyle, width: outlineWidth, offset: Number.parseFloat(style.outlineOffset) || 0 },
      boxShadow: style.boxShadow === "none" ? "none" : "present",
      rectangle: { left: rectangle.left, top: rectangle.top, right: rectangle.right, bottom: rectangle.bottom, width: rectangle.width, height: rectangle.height },
    };
  })()`);
  if (!keyboardFocus.focused || !keyboardFocus.focusVisible || !keyboardFocus.visibleIndicator) {
    fail(`keyboard-visible activation did not retain a visible focus indicator: ${JSON.stringify(keyboardFocus)}`);
  }
  transcript.push({
    ordinal: transcript.length + 1,
    transition: {
      channel: "CDP native Shift+Tab traversal and keyboard Enter activation",
      kind: "visible-control",
      actualUserStep: true,
      type: step.type,
      keyboardTraversalCount: traversalCount,
      activationKey: "Enter",
    },
    control,
    before,
    after,
    keyboardFocus,
    presentation: {
      filterOpenChanged: before.summary.filterOpen !== after.summary.filterOpen,
      consoleOpenChanged: before.summary.consoleOpen !== after.summary.consoleOpen,
    },
    anchor: null,
    result: "PASS",
  });
  return { state: after, keyboardFocus };
  } catch (error) {
    throw new Error(`actual keyboard activation failed during ${phase}: ${error.message}`);
  }
}

async function runActualSelectChangeStep(client, transcript, step) {
  await scrollSelectorIntoView(client, step.control.selector);
  const control = await inspectVisibleControl(client, step.control);
  const before = await safeInteractionState(client);
  let tabCount = 0;
  let focusedBeforeChange = await evaluate(client, `document.activeElement === document.querySelector(${JSON.stringify(step.control.selector)})`);
  while (!focusedBeforeChange && tabCount < step.maxTabs) {
    await dispatchKeyboardKey(client, "Tab", "Tab", 9);
    tabCount += 1;
    focusedBeforeChange = await evaluate(client, `document.activeElement === document.querySelector(${JSON.stringify(step.control.selector)})`);
  }
  if (!focusedBeforeChange) {
    const focus = (await safeInteractionState(client)).focus;
    fail(`actual keyboard traversal did not focus the expected select for ${step.type}: ${JSON.stringify(focus)}`);
  }
  await client.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: step.character,
    code: step.code,
    text: step.character,
    unmodifiedText: step.character,
    windowsVirtualKeyCode: step.windowsVirtualKeyCode,
    nativeVirtualKeyCode: step.windowsVirtualKeyCode,
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: step.character,
    code: step.code,
    windowsVirtualKeyCode: step.windowsVirtualKeyCode,
    nativeVirtualKeyCode: step.windowsVirtualKeyCode,
  });
  await waitForInteractionSettled(client);
  const after = await safeInteractionState(client);
  assertReadOnlyStep(after, step.type);
  const selected = await evaluate(client, `(() => {
    const control = document.querySelector(${JSON.stringify(step.control.selector)});
    return {
      value: control instanceof HTMLSelectElement ? control.value : null,
      focused: document.activeElement === control,
    };
  })()`);
  if (selected.value !== step.expectedValue) {
    fail(`actual select interaction did not choose the expected safe value for ${step.type}: ${JSON.stringify({ selected: selected.value, draftFilters: after.summary.draftFilters, focus: after.focus })}`);
  }
  transcript.push({
    ordinal: transcript.length + 1,
    transition: {
      channel: "CDP keyboard focus traversal and visible-select change",
      kind: "visible-control",
      actualUserStep: true,
      type: step.type,
      keyboardTraversalCount: tabCount,
    },
    control,
    before,
    after,
    presentation: {
      filterOpenChanged: before.summary.filterOpen !== after.summary.filterOpen,
      consoleOpenChanged: before.summary.consoleOpen !== after.summary.consoleOpen,
    },
    anchor: null,
    result: "PASS",
  });
  return { state: after, selected };
}

async function seedScenario(client) {
  await evaluate(client, `window.__LID_QA__.setFixture("global-ready")`);
  await waitForRender(client);
  const after = await safeInteractionState(client);
  if (after.summary?.fixture !== "global-ready"
    || after.summary?.transitionBranch !== "ready"
    || after.summary?.totalCount !== 17
    || after.summary?.activeFilterCount !== 0) {
    fail("scenario seed did not produce a fresh global-ready state");
  }
}

async function runCompactFilteredScenario(client, transcript) {
  const filterSummary = {
    selector: "[data-lid-v18-filter-details] > summary",
    role: "button",
    name: "Filter history",
    key: "filter-history",
  };
  const opened = await runActualClickStep(client, transcript, {
    type: "open-filter",
    control: filterSummary,
  });
  const initialFilterDetailsOpen = await evaluate(client, `Boolean(document.querySelector("[data-lid-v18-filter-details]")?.open)`);
  if (!opened.summary.filterOpen
    || !initialFilterDetailsOpen
    || opened.focus?.focusKey !== "filter-summary") {
    fail("the actual compact Filter history summary did not open with summary focus");
  }
  await runActualSelectChangeStep(client, transcript, {
    type: "draft-lane",
    expectedValue: "source",
    maxTabs: 8,
    character: "s",
    code: "KeyS",
    windowsVirtualKeyCode: 83,
    control: { selector: 'select[data-lid-action="draft-lane"]', role: "combobox", name: "History lane", key: "lane", value: "all" },
  });
  await runActualSelectChangeStep(client, transcript, {
    type: "draft-attention",
    expectedValue: "needs",
    maxTabs: 8,
    character: "n",
    code: "KeyN",
    windowsVirtualKeyCode: 78,
    control: { selector: 'select[data-lid-action="draft-attention"]', role: "combobox", name: "Attention", key: "attention", value: "all" },
  });
  const applied = await runActualClickStep(client, transcript, {
    type: "apply-filters",
    control: { selector: 'button[data-lid-action="apply-filters"]', role: "button", name: "Apply filters", key: "apply-filters" },
  });
  if (!arraysEqual(applied.summary.visibleSourceKeys, ["E14", "E13", "E12"])
    || !arraysEqual(applied.summary.visibleDerivedKeys, [])
    || applied.summary.totalCount !== 3
    || applied.summary.activeFilterCount !== 2
    || applied.summary.filterOpen !== false
    || applied.summary.announcementMatches.representedCount3 !== true
    || applied.focus?.id !== "lid-v18-results-title") {
    fail("compact-filtered-open did not apply the exact two-filter three-event result with results focus");
  }
  const finalActivation = await runActualKeyboardActivationStep(client, transcript, {
    type: "open-filter",
    maxShiftTabs: 8,
    control: { ...filterSummary, name: "Filter history · 2 active" },
  });
  const final = finalActivation.state;
  const finalFilterDetailsOpen = await evaluate(client, `Boolean(document.querySelector("[data-lid-v18-filter-details]")?.open)`);
  if (!final.summary.filterOpen
    || !arraysEqual(final.summary.openDisclosureKeys, [])
    || final.focus?.focusKey !== "filter-summary"
    || !finalFilterDetailsOpen
    || !finalActivation.keyboardFocus.focusVisible
    || !finalActivation.keyboardFocus.visibleIndicator) {
    fail(`compact-filtered-open did not finish with the native Filter history summary reopened and focused: ${JSON.stringify({
      filterOpen: final.summary.filterOpen,
      openDisclosureKeys: final.summary.openDisclosureKeys,
      focus: final.focus,
      nativeDetailsOpen: finalFilterDetailsOpen,
      keyboardFocus: finalActivation.keyboardFocus,
    })}`);
  }
  return [
    { name: "Exact filtered Source order", pass: arraysEqual(final.summary.visibleSourceKeys, ["E14", "E13", "E12"]) },
    { name: "Source and Needs attention filters are exact", pass: final.summary.appliedFilters.lane === "source" && final.summary.appliedFilters.attention === "needs" },
    { name: "Exactly three results and two active filters", pass: final.summary.totalCount === 3 && final.summary.activeFilterCount === 2 },
    {
      name: "Exact bounded represented-count announcement observed",
      pass: transcript.find((step) => step.transition.type === "apply-filters")?.after.summary.announcementMatches.representedCount3 === true,
    },
    { name: "Only the compact Filter history disclosure is open", pass: final.summary.filterOpen && arraysEqual(final.summary.openDisclosureKeys, []) },
    { name: "Final focus is the reopened Filter history summary", pass: final.focus?.focusKey === "filter-summary" },
    { name: "Final summary was keyboard-activated with a visible focus indicator", pass: finalActivation.keyboardFocus.focusVisible && finalActivation.keyboardFocus.visibleIndicator },
  ];
}

async function runPaginationScenario(client, transcript) {
  const baseline = await safeInteractionState(client);
  await runQaStep(client, transcript, {
    type: "enter-pagination",
  });
  const sourcePending = await runActualClickStep(client, transcript, {
    type: "load-source",
    control: { selector: "#lid-v18-load-source", role: "button", name: "Load earlier Source events", key: "source-page" },
    anchor: { selector: "#lid-v18-load-source", key: "source-page", lane: "source" },
  });
  if (sourcePending.summary.pagination.source.stage !== "pending"
    || sourcePending.summary.pagination.source.currentCount !== 7
    || sourcePending.summary.pagination.derived.currentCount !== 4
    || sourcePending.focus?.id !== "lid-v18-load-source") {
    fail(`Source pagination did not reach the exact pending partial-page state: ${JSON.stringify({
      source: sourcePending.summary.pagination.source,
      derived: sourcePending.summary.pagination.derived,
      focus: sourcePending.focus,
    })}`);
  }
  const sourceSuccess = await runQaStep(client, transcript, {
    type: "deliver-source-success",
    payload: { lane: "source", requestGeneration: sourcePending.summary.pagination.source.requestGeneration },
    anchor: { selector: "#lid-v18-load-source", key: "source-page", lane: "source" },
  });
  if (sourceSuccess.summary.pagination.source.added !== 3
    || sourceSuccess.summary.pagination.source.currentCount !== 10
    || !sourceSuccess.summary.pagination.source.endReached
    || !arraysEqual(sourceSuccess.summary.visibleSourceKeys, SOURCE_ORDER)
    || sourceSuccess.summary.pagination.derived.currentCount !== 4
    || sourceSuccess.summary.announcementMatches.sourceAdded3 !== true
    || sourceSuccess.focus?.id !== "lid-v18-load-source") {
    fail("Source pagination did not add exactly three events and retain Derived partial state");
  }
  const derivedPending = await runActualClickStep(client, transcript, {
    type: "load-derived",
    control: { selector: "#lid-v18-load-derived", role: "button", name: "Load earlier Derived events", key: "derived-page" },
    anchor: { selector: "#lid-v18-load-derived", key: "derived-page", lane: "derived" },
  });
  if (derivedPending.summary.pagination.derived.stage !== "pending"
    || derivedPending.summary.pagination.derived.currentCount !== 4
    || derivedPending.summary.pagination.source.currentCount !== 10
    || derivedPending.focus?.id !== "lid-v18-load-derived") {
    fail("Derived pagination did not reach the exact pending partial-page state");
  }
  const final = await runQaStep(client, transcript, {
    type: "deliver-derived-success",
    payload: { lane: "derived", requestGeneration: derivedPending.summary.pagination.derived.requestGeneration },
    anchor: { selector: "#lid-v18-load-derived", key: "derived-page", lane: "derived" },
  });
  if (!arraysEqual(final.summary.visibleSourceKeys, SOURCE_ORDER)
    || !arraysEqual(final.summary.visibleDerivedKeys, DERIVED_ORDER)
    || final.summary.pagination.source.currentCount !== 10
    || final.summary.pagination.derived.currentCount !== 7
    || final.summary.pagination.source.added !== 3
    || final.summary.pagination.derived.added !== 3
    || !final.summary.pagination.source.endReached
    || !final.summary.pagination.derived.endReached
    || final.summary.totalCount !== 17
    || final.summary.announcementMatches.derivedAdded3 !== true
    || final.focus?.id !== "lid-v18-load-derived") {
    fail("pagination-both-success did not finish with the exact 10/7/17 order and Derived focus");
  }
  return [
    { name: "Exact complete Source order", pass: arraysEqual(final.summary.visibleSourceKeys, SOURCE_ORDER) },
    { name: "Exact complete Derived order", pass: arraysEqual(final.summary.visibleDerivedKeys, DERIVED_ORDER) },
    { name: "Exactly three events added once to each lane", pass: final.summary.pagination.source.added === 3 && final.summary.pagination.derived.added === 3 },
    { name: "Both beginnings reached with 10/7/17 counts", pass: final.summary.pagination.source.endReached && final.summary.pagination.derived.endReached && final.summary.totalCount === 17 },
    {
      name: "Exact bounded Source and Derived success announcements observed",
      pass: transcript.find((step) => step.transition.type === "deliver-source-success")?.after.summary.announcementMatches.sourceAdded3 === true
        && transcript.find((step) => step.transition.type === "deliver-derived-success")?.after.summary.announcementMatches.derivedAdded3 === true,
    },
    {
      name: "Lane load and delivery transitions retained logical visual anchors",
      pass: transcript
        .filter((step) => ["load-source", "deliver-source-success", "load-derived", "deliver-derived-success"].includes(step.transition.type))
        .every((step) => step.anchor?.pass && Math.abs(step.anchor.topDelta) <= ANCHOR_TOLERANCE_PX),
    },
    {
      name: "Lane focus remained on its stable page target",
      pass: transcript
        .filter((step) => ["load-source", "deliver-source-success"].includes(step.transition.type))
        .every((step) => step.after.focus?.id === "lid-v18-load-source")
        && transcript
          .filter((step) => ["load-derived", "deliver-derived-success"].includes(step.transition.type))
          .every((step) => step.after.focus?.id === "lid-v18-load-derived"),
    },
    { name: "Read-only domain and counters remained stable", pass: final.summary.domain.beforeEqualsCurrent && Object.values(final.summary.counters).every((value) => value === 0) },
    {
      name: "Only partial-page entry and synthetic deliveries used QA dispatch after seed",
      pass: arraysEqual(
        transcript
          .filter((step) => step.transition.channel === "window.__LID_QA__.dispatch")
          .map((step) => step.transition.type),
        ["enter-pagination", "deliver-source-success", "deliver-derived-success"],
      ),
    },
    { name: "Final focus is the Derived beginning marker", pass: final.focus?.id === "lid-v18-load-derived" },
    { name: "Initial and final domain digests match", pass: baseline.summary.domain.currentSha256 === final.summary.domain.currentSha256 },
  ];
}

async function runScenario(client, scenario) {
  const transcript = [];
  await seedScenario(client);
  const finalAssertions = scenario === "compact-filtered-open"
    ? await runCompactFilteredScenario(client, transcript)
    : await runPaginationScenario(client, transcript);
  const expectedTypes = CAPTURE_SCENARIO_ACTIONS[scenario].map((step) => step.type);
  // The leading false proves fixture setup is not a user step; only the five scenario actions enter the transcript.
  const fixtureSetupAndActualUserSteps=scenario==="compact-filtered-open"?[false,true,true,true,true,true]:[false,false,true,false,true,false];
  const expectedActualUserSteps = fixtureSetupAndActualUserSteps.slice(1);
  const expectedKinds = scenario === "compact-filtered-open"
    ? ["visible-control", "visible-control", "visible-control", "visible-control", "visible-control"]
    : ["qa-transition", "visible-control", "qa-transition", "visible-control", "qa-transition"];
  if (fixtureSetupAndActualUserSteps[0] !== false
    || !arraysEqual(transcript.map((step) => step.transition.type), expectedTypes)
    || !arraysEqual(transcript.map((step) => step.transition.actualUserStep), expectedActualUserSteps)
    || !arraysEqual(transcript.map((step) => step.transition.kind), expectedKinds)) {
    fail(`${scenario} did not produce its exact ordered truthful interaction transcript`);
  }
  if (transcript.some((step) => step.transition.actualUserStep
    && (!step.control?.role || !step.control?.name || !step.control?.key
      || step.control.visible !== true || step.control.enabled !== true || step.control.centerHitWithinControl !== true))) {
    fail(`${scenario} did not record a complete pre-action visible-control check`);
  }
  if (transcript.some((step) => step.transition.kind === "qa-transition" && step.control !== null)) {
    fail(`${scenario} mislabeled a QA transition as a visible-control interaction`);
  }
  if (finalAssertions.some((assertion) => !assertion.pass)) {
    fail(`${scenario} failed one or more final assertions`);
  }
  return {
    scenario,
    seedFixture: "global-ready",
    transcript,
    finalAssertions,
  };
}

async function inspectItemReadyFrameState(client) {
  const state = await safeInteractionState(client);
  const dom = await evaluate(client, `(() => {
    const target = document.querySelector(${JSON.stringify(ITEM_READY_FRAME_SELECTOR)});
    const openEventDisclosureKeys = [...document.querySelectorAll("[data-lid-v18-event-details][open]")]
      .map((details) => details.getAttribute("data-lid-v18-event-details"));
    const relationshipOrder = [...(target?.querySelectorAll(".lid-relations-v18 > h4") || [])]
      .map((heading) => heading.textContent === "Event sequence" ? "event-sequence"
        : heading.textContent === "Record lineage" ? "record-lineage" : "unknown");
    const polite = document.querySelector("#lid-status-v17")?.textContent?.trim() || "";
    const assertive = document.querySelector("#lid-alert-v17")?.textContent?.trim() || "";
    return {
      targetKey: target?.getAttribute("data-lid-v18-event-details") || null,
      targetNativeOpen: target instanceof HTMLDetailsElement && target.open,
      openEventDisclosureCount: openEventDisclosureKeys.length,
      openEventDisclosureKeys,
      relationshipOrder,
      titleFocus: document.activeElement?.id === "lid-v18-title" && document.activeElement?.tagName === "H1",
      titleMatches: document.querySelector("#lid-v18-title")?.textContent === "History for Monsoon walk note",
      liveRegionsEmpty: polite === "" && assertive === "",
    };
  })()`);
  return { state, dom };
}

function assertExactItemReadyFrameState(observation, phase) {
  const { state, dom } = observation;
  if (state.summary?.fixture !== "item-ready"
    || state.summary?.stableFocusKey !== "#lid-v18-title"
    || state.summary?.announcementMatches?.empty !== true
    || !arraysEqual(state.summary?.openDisclosureKeys, ["E12"])
    || state.summary?.disclosureDefaultIntact !== true
    || state.focus?.tagName !== "h1"
    || state.focus?.id !== "lid-v18-title"
    || Boolean(state.scroll?.x)
    || dom.targetKey !== "E12"
    || dom.targetNativeOpen !== true
    || dom.openEventDisclosureCount !== 1
    || !arraysEqual(dom.openEventDisclosureKeys, ["E12"])
    || !arraysEqual(dom.relationshipOrder, ["event-sequence", "record-lineage"])
    || dom.titleFocus !== true
    || dom.titleMatches !== true
    || dom.liveRegionsEmpty !== true) {
    fail(`item-ready frame 3 ${phase} state is not exact: ${JSON.stringify(observation)}`);
  }
}

async function finishItemReadySelectorEvidence(client, before, selectorEvidence) {
  assertExactItemReadyFrameState(before, "pre-selector");
  if (Boolean(before.state.scroll.y)) fail("item-ready frame 3 must begin at scrollY 0 before selector-only scrolling");
  const after = await inspectItemReadyFrameState(client);
  assertExactItemReadyFrameState(after, "post-selector");
  const assertions = [
    { name: "Fresh item-ready entry has exact h1 focus and zero scroll", pass: before.dom.titleFocus && !before.state.scroll.x && !before.state.scroll.y },
    { name: "Fresh item-ready entry has no announcement", pass: before.state.summary.announcementMatches.empty && before.dom.liveRegionsEmpty },
    { name: "E12 is the one native open event disclosure", pass: after.dom.targetNativeOpen && after.dom.openEventDisclosureCount === 1 && arraysEqual(after.dom.openEventDisclosureKeys, ["E12"]) },
    { name: "E12 Event sequence precedes Record lineage", pass: arraysEqual(after.dom.relationshipOrder, ["event-sequence", "record-lineage"]) },
    {
      name: "Selector changed only scroll position",
      pass: before.state.snapshotSha256 === after.state.snapshotSha256
        && before.state.focus?.id === after.state.focus?.id
        && Math.abs(before.state.scroll.y - after.state.scroll.y) > 0,
    },
    { name: "Selector target is visible without disclosure or announcement change", pass: selectorEvidence.visible && arraysEqual(before.state.summary.openDisclosureKeys, after.state.summary.openDisclosureKeys) && after.dom.liveRegionsEmpty },
  ];
  if (assertions.some((assertion) => !assertion.pass)) fail("item-ready frame 3 selector-only contract failed");
  return {
    method: "selector-only-scroll",
    before,
    after,
    assertions,
  };
}

async function scrollSelectorIntoView(client, selector) {
  const selectorEvidence = await evaluate(client, `(() => {
    let element;
    try {
      element = document.querySelector(${JSON.stringify(selector)});
    } catch (error) {
      throw new Error("Invalid evidence selector: " + error.message);
    }
    if (!element) throw new Error("Evidence selector did not match an element");
    element.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
    const rectangle = element.getBoundingClientRect();
    return {
      selector: ${JSON.stringify(selector)},
      tagName: element.tagName.toLowerCase(),
      id: element.id || null,
      visible: rectangle.bottom > 0 && rectangle.right > 0 && rectangle.top < innerHeight && rectangle.left < innerWidth,
    };
  })()`);
  if (!selectorEvidence?.visible) fail(`the selected evidence element is not visible after scrolling: ${selector}`);
  await waitForRender(client);
  return selectorEvidence;
}

function captureFramingSpec(options) {
  const frameKey = basename(options.out, extname(options.out));
  const spec = CAPTURE_FRAMING_SPECS[frameKey] || null;
  if (!spec) return { frameKey, spec: null };
  if (options.view !== "active"
    || options.fixture !== spec.fixture
    || options.scenario !== spec.scenario
    || options.width !== spec.width
    || options.height !== spec.height) {
    fail(`capture framing identity does not match the governed frame: ${frameKey}`);
  }
  return { frameKey, spec };
}

async function inspectLoadingFramingIntegrity(client) {
  const raw = await evaluate(client, `(() => {
    const lane = document.querySelector(".lid-loading-results-v18 > .lid-history-lane-v18.is-source");
    const h1 = document.querySelector("h1#lid-v18-title");
    const sourceHeading = lane?.querySelector(":scope > header h2#lid-v18-loading-source-title");
    const status = lane?.querySelector(':scope > .lid-loading-status-v18[aria-labelledby="lid-v18-loading-title"]');
    const statusHeading = status?.querySelector(":scope > h3#lid-v18-loading-title");
    const statusBody = status?.querySelector(":scope > p");
    if (!(lane instanceof HTMLElement) || !(h1 instanceof HTMLElement)
      || !(sourceHeading instanceof HTMLElement) || !(status instanceof HTMLElement)
      || !(statusHeading instanceof HTMLElement) || !(statusBody instanceof HTMLElement)) {
      throw new Error("frame 11 loading contract is missing its exact Source lane, headings, body, or h1");
    }
    const h1Rectangle = h1.getBoundingClientRect();
    const styleRecord = (element) => {
      const style = getComputedStyle(element);
      return {
        display: style.display,
        position: style.position,
        visibility: style.visibility,
        opacity: style.opacity,
        overflowX: style.overflowX,
        overflowY: style.overflowY,
      };
    };
    return {
      immutable: {
        loadingMarkup: document.querySelector(".lid-loading-results-v18")?.outerHTML || null,
        bodyClass: document.body.className,
        rootStyleAttribute: document.documentElement.getAttribute("style"),
        viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
        media: {
          reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
          motionNoPreference: matchMedia("(prefers-reduced-motion: no-preference)").matches,
          forcedColorsActive: matchMedia("(forced-colors: active)").matches,
          forcedColorsNone: matchMedia("(forced-colors: none)").matches,
          colorSchemeLight: matchMedia("(prefers-color-scheme: light)").matches,
          colorSchemeDark: matchMedia("(prefers-color-scheme: dark)").matches,
        },
        styles: {
          lane: styleRecord(lane),
          sourceHeading: styleRecord(sourceHeading),
          status: styleRecord(status),
          statusHeading: styleRecord(statusHeading),
          statusBody: styleRecord(statusBody),
        },
        identity: {
          laneCount: document.querySelectorAll(".lid-loading-results-v18 > .lid-history-lane-v18").length,
          sourceLaneCount: document.querySelectorAll(".lid-loading-results-v18 > .lid-history-lane-v18.is-source").length,
          sourceLaneBusyCount: document.querySelectorAll('.lid-loading-results-v18 > .lid-history-lane-v18.is-source[aria-busy="true"]').length,
          derivedLaneBusyCount: document.querySelectorAll('.lid-loading-results-v18 > .lid-history-lane-v18.is-derived[aria-busy="true"]').length,
          allBusyCount: document.querySelectorAll('[aria-busy="true"]').length,
          laneLabelledBy: lane.getAttribute("aria-labelledby"),
          sourceHeading: sourceHeading.textContent,
          statusLabelledBy: status.getAttribute("aria-labelledby"),
          statusHeading: statusHeading.textContent,
          statusBody: statusBody.textContent,
        },
      },
      focus: {
        id: document.activeElement?.id || null,
        tagName: document.activeElement?.tagName?.toLowerCase() || null,
        h1Focused: document.activeElement === h1,
        h1Rectangle: {
          left: h1Rectangle.left,
          top: h1Rectangle.top,
          right: h1Rectangle.right,
          bottom: h1Rectangle.bottom,
          width: h1Rectangle.width,
          height: h1Rectangle.height,
        },
        h1FullyOffscreen: h1Rectangle.bottom <= 0 || h1Rectangle.top >= innerHeight,
      },
      scroll: { x: scrollX, y: scrollY },
      activeFeature: document.querySelector("#lid-runtime-v17")?.dataset.activeFeature || null,
    };
  })()`);
  const integritySha256 = valueSha256(raw.immutable);
  return {
    integritySha256,
    viewport: raw.immutable.viewport,
    media: raw.immutable.media,
    identity: raw.immutable.identity,
    focus: raw.focus,
    scroll: raw.scroll,
    activeFeature: raw.activeFeature,
  };
}

async function runPassivePreCaptureFraming(client, options) {
  const { frameKey, spec } = captureFramingSpec(options);
  if (!spec) return null;
  const before = await safeInteractionState(client);
  const loadingBefore = spec.loadingContract ? await inspectLoadingFramingIntegrity(client) : null;
  const safeTop = spec.safeTop ?? (options.width >= 1024 ? 84 : 12);
  const safeBottom = spec.safeBottom ?? 16;
  const staged = await evaluate(client, `(() => {
    const specs = ${JSON.stringify(spec.targets)};
    const normalize = (value) => String(value || "").replace(/\\s+/g, "");
    const readTargets = () => specs.map((targetSpec) => {
      const element = document.querySelector(targetSpec.selector);
      if (!(element instanceof HTMLElement)) throw new Error("Framing target is missing: " + targetSpec.key);
      const rectangle = element.getBoundingClientRect();
      return {
        key: targetSpec.key,
        selector: targetSpec.selector,
        textMatch: normalize(element.textContent).includes(normalize(targetSpec.text)),
        document: {
          top: rectangle.top + scrollY,
          bottom: rectangle.bottom + scrollY,
          left: rectangle.left + scrollX,
          right: rectangle.right + scrollX,
        },
      };
    });
    const targets = readTargets();
    if (targets.some((target) => !target.textMatch)) {
      throw new Error("One or more governed framing targets lost their required visible copy");
    }
    const unionTop = Math.min(...targets.map((target) => target.document.top));
    const unionBottom = Math.max(...targets.map((target) => target.document.bottom));
    const availableHeight = innerHeight - ${safeTop} - ${safeBottom};
    const unionHeight = unionBottom - unionTop;
    if (!(unionHeight > 0) || unionHeight > availableHeight) {
      throw new Error("Governed framing targets cannot fit in the requested viewport: " + JSON.stringify({ unionHeight, availableHeight }));
    }
    const desiredTop = ${safeTop} + (availableHeight - unionHeight) / 2;
    const maximumScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const requestedScrollY = Math.min(maximumScroll, Math.max(0, unionTop - desiredTop));
    window.scrollTo({ left: 0, top: requestedScrollY, behavior: "instant" });
    return {
      method: "passive pre-capture scroll only",
      safeViewport: { top: ${safeTop}, bottom: innerHeight - ${safeBottom}, left: 0, right: innerWidth },
      unionDocument: { top: unionTop, bottom: unionBottom, height: unionHeight },
      requestedScrollY,
      maximumScroll,
    };
  })()`);
  await waitForInteractionSettled(client);
  const observed = await evaluate(client, `(() => {
    const specs = ${JSON.stringify(spec.targets)};
    const targets = specs.map((targetSpec) => {
      const element = document.querySelector(targetSpec.selector);
      if (!(element instanceof HTMLElement)) throw new Error("Framing target disappeared: " + targetSpec.key);
      const rectangle = element.getBoundingClientRect();
      const overlaps = [...document.querySelectorAll("body *")].filter((candidate) => {
        if (!(candidate instanceof HTMLElement) || candidate === element || element.contains(candidate) || candidate.contains(element)) return false;
        const style = getComputedStyle(candidate);
        if (!["fixed", "sticky"].includes(style.position) || style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
        const other = candidate.getBoundingClientRect();
        return other.width > 0 && other.height > 0
          && rectangle.left < other.right && rectangle.right > other.left
          && rectangle.top < other.bottom && rectangle.bottom > other.top;
      }).map((candidate) => candidate.id || candidate.className || candidate.tagName).slice(0, 10);
      return {
        key: targetSpec.key,
        selector: targetSpec.selector,
        rectangle: {
          left: Math.round(rectangle.left * 1000) / 1000,
          top: Math.round(rectangle.top * 1000) / 1000,
          right: Math.round(rectangle.right * 1000) / 1000,
          bottom: Math.round(rectangle.bottom * 1000) / 1000,
          width: Math.round(rectangle.width * 1000) / 1000,
          height: Math.round(rectangle.height * 1000) / 1000,
        },
        fullyVisible: rectangle.left >= 0 && rectangle.right <= innerWidth
          && rectangle.top >= ${safeTop} && rectangle.bottom <= innerHeight - ${safeBottom},
        fixedOrStickyOverlaps: overlaps,
      };
    });
    let focus = null;
    const focusSelector = ${JSON.stringify(spec.focusSelector || null)};
    if (focusSelector) {
      const element = document.querySelector(focusSelector);
      if (!(element instanceof HTMLElement)) throw new Error("Framing focus target is missing");
      const style = getComputedStyle(element);
      const rectangle = element.getBoundingClientRect();
      const outlineWidth = Number.parseFloat(style.outlineWidth) || 0;
      const hasOutline = style.outlineStyle !== "none" && outlineWidth > 0;
      const hasShadow = style.boxShadow !== "none";
      focus = {
        selector: focusSelector,
        focused: document.activeElement === element,
        focusVisible: element.matches(":focus-visible"),
        visibleIndicator: (hasOutline || hasShadow),
        outline: { style: style.outlineStyle, width: outlineWidth, offset: Number.parseFloat(style.outlineOffset) || 0 },
        boxShadow: style.boxShadow === "none" ? "none" : "present",
        fullyVisible: rectangle.left >= 0 && rectangle.right <= innerWidth
          && rectangle.top >= ${safeTop} && rectangle.bottom <= innerHeight - ${safeBottom},
      };
    }
    return { scroll: { x: scrollX, y: scrollY }, targets, focus };
  })()`);
  const after = await safeInteractionState(client);
  const loadingAfter = spec.loadingContract ? await inspectLoadingFramingIntegrity(client) : null;
  const stateUnchanged = before.snapshotSha256 === after.snapshotSha256
    && arraysEqual(before.focus, after.focus)
    && before.scroll.x === after.scroll.x;
  const targetsPass = observed.targets.every((target) => target.fullyVisible && target.fixedOrStickyOverlaps.length === 0);
  const focusPass = !observed.focus || (observed.focus.focused && observed.focus.visibleIndicator && observed.focus.fullyVisible
    && (frameKey !== "v18-10-filter-open-compact-dark" || observed.focus.focusVisible));
  const loadingIdentityPass = !spec.loadingContract || (loadingBefore && loadingAfter
    && loadingBefore.activeFeature === "v18" && loadingAfter.activeFeature === "v18"
    && loadingBefore.integritySha256 === loadingAfter.integritySha256
    && loadingAfter.viewport.width === 568 && loadingAfter.viewport.height === 320
    && loadingAfter.media.reducedMotion && !loadingAfter.media.motionNoPreference
    && !loadingAfter.media.forcedColorsActive && loadingAfter.media.forcedColorsNone
    && loadingAfter.identity.laneCount === 1 && loadingAfter.identity.sourceLaneCount === 1
    && loadingAfter.identity.sourceLaneBusyCount === 1 && loadingAfter.identity.derivedLaneBusyCount === 0
    && loadingAfter.identity.allBusyCount === 1
    && loadingAfter.identity.laneLabelledBy === "lid-v18-loading-source-title"
    && loadingAfter.identity.sourceHeading === "Source history"
    && loadingAfter.identity.statusLabelledBy === "lid-v18-loading-title"
    && loadingAfter.identity.statusHeading === "Loading history"
    && loadingAfter.identity.statusBody === "Preparing separate Source and Derived event lists from synthetic browser-memory fixtures."
    && loadingBefore.focus.h1Focused && loadingAfter.focus.h1Focused && loadingAfter.focus.h1FullyOffscreen
    && loadingBefore.scroll.x === loadingAfter.scroll.x && loadingBefore.scroll.y !== loadingAfter.scroll.y
    && Math.abs(loadingAfter.scroll.y - staged.requestedScrollY) <= 1);
  const assertions = [
    { name: "Every authority-required framing target is fully visible", pass: targetsPass },
    { name: "No fixed or sticky surface overlaps a framing target", pass: observed.targets.every((target) => target.fixedOrStickyOverlaps.length === 0) },
    { name: "Framing changed scroll only and preserved state and focus", pass: stateUnchanged },
    { name: "Required final focus indicator is visible", pass: focusPass },
    ...(spec.loadingContract ? [
      { name: "Frame 11 exact Source loading identity and sole busy boundary are preserved", pass: loadingIdentityPass },
      { name: "Frame 11 final movement is scrollY-only with h1 focus preserved offscreen", pass: loadingIdentityPass },
      { name: "Frame 11 DOM, CSS, ARIA, viewport, media, and action digest is unchanged", pass: loadingIdentityPass },
    ] : []),
  ];
  if (assertions.some((assertion) => !assertion.pass)) {
    fail(`governed pre-capture framing failed: ${JSON.stringify({ frameKey, staged, observed, before, after, assertions })}`);
  }
  return {
    frameKey,
    ...staged,
    observed,
    stateUnchanged,
    loadingContract: spec.loadingContract ? {
      before: loadingBefore,
      after: loadingAfter,
      integrityDigestPreserved: loadingBefore?.integritySha256 === loadingAfter?.integritySha256,
      scrollYOnly: loadingBefore?.scroll.x === loadingAfter?.scroll.x && loadingBefore?.scroll.y !== loadingAfter?.scroll.y,
      h1FocusPreservedOffscreen: Boolean(loadingBefore?.focus.h1Focused && loadingAfter?.focus.h1Focused && loadingAfter?.focus.h1FullyOffscreen),
      exactIdentity: loadingIdentityPass,
    } : null,
    assertions,
    result: "PASS",
  };
}

async function retainRemoteElement(client, expression, label) {
  return evaluateRemote(client, `(() => {
    const element = (${expression});
    if (!(element instanceof HTMLElement)) throw new Error(${JSON.stringify(label)} + " was not found");
    return element;
  })()`);
}

async function scrollRemoteIntoView(client, objectId) {
  await callRemote(client, objectId, `function () {
    if (!this.isConnected) throw new Error("cannot reveal a disconnected evidence control");
    this.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
    return true;
  }`);
  await waitForRender(client);
}

async function inspectRemoteControl(client, objectId) {
  return callRemote(client, objectId, `function () {
    const round = (value) => Math.round(value * 1000) / 1000;
    const rectangle = this.getBoundingClientRect();
    const viewportTop = this.getBoundingClientRect().top;
    const style = getComputedStyle(this);
    const center = { x: rectangle.left + rectangle.width / 2, y: rectangle.top + rectangle.height / 2 };
    const insetX = Math.min(10, Math.max(1, rectangle.width / 4));
    const insetY = Math.min(10, Math.max(1, rectangle.height / 4));
    const points = [
      ["center", center.x, center.y],
      ["top-left-inset", rectangle.left + insetX, rectangle.top + insetY],
      ["top-right-inset", rectangle.right - insetX, rectangle.top + insetY],
      ["bottom-left-inset", rectangle.left + insetX, rectangle.bottom - insetY],
      ["bottom-right-inset", rectangle.right - insetX, rectangle.bottom - insetY],
    ];
    const rendered = Boolean(this.getClientRects().length && !this.hidden && !this.closest("[hidden], [inert]")
      && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0);
    const visible = rendered && rectangle.bottom > 0 && rectangle.right > 0
      && rectangle.top < innerHeight && rectangle.left < innerWidth;
    const hitTests = points.map(([name, x, y]) => {
      const hit = visible ? document.elementFromPoint(x, y) : null;
      return { name, x: round(x), y: round(y), withinControl: Boolean(hit && (hit === this || this.contains(hit))) };
    });
    const attributeMap = Object.fromEntries([...this.attributes]
      .map((attribute) => [attribute.name, attribute.value])
      .sort(([left], [right]) => left.localeCompare(right)));
    return {
      connected: this.isConnected,
      sameNode: document.activeElement instanceof Node && document.activeElement.isSameNode(this),
      focused: document.activeElement === this,
      tagName: this.tagName.toLowerCase(),
      id: this.id || null,
      text: (this.getAttribute("aria-label") || this.textContent || "").replace(/\\s+/g, " ").trim(),
      attributeMap,
      v18AttributeMap: Object.fromEntries(Object.entries(attributeMap).filter(([name]) => name.startsWith("data-lid-v18"))),
      rendered,
      visible,
      fullyVisible: visible && rectangle.left >= 0 && rectangle.top >= 0 && rectangle.right <= innerWidth && rectangle.bottom <= innerHeight,
      enabled: !(this instanceof HTMLButtonElement && this.disabled) && this.getAttribute("aria-disabled") !== "true",
      focusable: this.tabIndex >= 0 && !(this instanceof HTMLButtonElement && this.disabled),
      minimum44By44: rectangle.width >= 44 && rectangle.height >= 44,
      centerHitWithinControl: hitTests[0].withinControl,
      allHitTestsWithinControl: hitTests.every((record) => record.withinControl),
      hitTests,
      viewport: { width: innerWidth, height: innerHeight },
      scrollY: round(window.scrollY),
      top: round(viewportTop),
      rectangle: {
        left: round(rectangle.left), top: round(rectangle.top), right: round(rectangle.right), bottom: round(rectangle.bottom),
        width: round(rectangle.width), height: round(rectangle.height),
        documentTop: round(rectangle.top + window.scrollY), documentBottom: round(rectangle.bottom + window.scrollY),
      },
      center: { x: round(center.x), y: round(center.y) },
    };
  }`);
}

async function stageFinalArtworkOriginBaseline(client) {
  const before = await safeInteractionState(client);
  const staged = await evaluate(client, `(() => {
    const button = document.querySelector("#lid-v18-canonical-entry-artwork");
    const panel = document.querySelector(${JSON.stringify(CANONICAL_PANEL_SELECTOR)});
    const nav = document.querySelector(".compact-navigation");
    const banner = document.querySelector(".prototype-banner");
    const eyebrow = document.querySelector(".lid-v18-canonical-entry-eyebrow");
    const heading = document.querySelector("#lid-v18-canonical-entry-title");
    if (!(button instanceof HTMLElement) || !(panel instanceof HTMLElement) || !(nav instanceof HTMLElement)
      || !(banner instanceof HTMLElement) || !(eyebrow instanceof HTMLElement) || !(heading instanceof HTMLElement)) {
      throw new Error("final Artwork baseline surfaces are missing");
    }
    const buttonBefore = button.getBoundingClientRect();
    const panelBefore = panel.getBoundingClientRect();
    const navBefore = nav.getBoundingClientRect();
    const bannerBefore = banner.getBoundingClientRect();
    const eyebrowBefore = eyebrow.getBoundingClientRect();
    const headingBefore = heading.getBoundingClientRect();
    const requiredFocusExtent = 6;
    const minimumScrollY = scrollY + Math.max(
      buttonBefore.bottom + requiredFocusExtent - (navBefore.top - 12),
      panelBefore.bottom - (navBefore.top - 12),
    );
    const maximumScrollY = scrollY + panelBefore.top - (bannerBefore.bottom + 12);
    if (minimumScrollY > maximumScrollY) {
      throw new Error("complete canonical panel cannot fit between fixed banner and navigation: "
        + JSON.stringify({ minimumScrollY, maximumScrollY, bannerBottom: bannerBefore.bottom, navTop: navBefore.top,
          panelTop: panelBefore.top, panelBottom: panelBefore.bottom, panelHeight: panelBefore.height, eyebrowTop: eyebrowBefore.top }));
    }
    const requestedScrollY = Math.max(0, Math.ceil(minimumScrollY));
    if (requestedScrollY > maximumScrollY) {
      throw new Error("integer CSS-pixel framing cannot satisfy the canonical safe band");
    }
    window.scrollTo({ left: 0, top: requestedScrollY, behavior: "instant" });
    return {
      method: "pre-baseline scroll only",
      requiredClearancePx: 12,
      requiredFocusExtentPx: requiredFocusExtent,
      requestedScrollY,
      feasibleScrollBand: { minimumScrollY, maximumScrollY },
      before: {
        button: { top: buttonBefore.top, bottom: buttonBefore.bottom },
        panel: { top: panelBefore.top, bottom: panelBefore.bottom },
        nav: { top: navBefore.top, bottom: navBefore.bottom },
        banner: { top: bannerBefore.top, bottom: bannerBefore.bottom },
        eyebrow: { top: eyebrowBefore.top, bottom: eyebrowBefore.bottom },
        heading: { top: headingBefore.top, bottom: headingBefore.bottom },
      },
    };
  })()`);
  await waitForInteractionSettled(client);
  const geometry = await evaluate(client, `(() => {
    const button = document.querySelector("#lid-v18-canonical-entry-artwork");
    const panel = document.querySelector(${JSON.stringify(CANONICAL_PANEL_SELECTOR)});
    const nav = document.querySelector(".compact-navigation");
    const banner = document.querySelector(".prototype-banner");
    const eyebrow = document.querySelector(".lid-v18-canonical-entry-eyebrow");
    const heading = document.querySelector("#lid-v18-canonical-entry-title");
    const description = document.querySelector("#lid-v18-canonical-entry-description");
    if (!(button instanceof HTMLElement) || !(panel instanceof HTMLElement) || !(nav instanceof HTMLElement)
      || !(banner instanceof HTMLElement) || !(eyebrow instanceof HTMLElement)
      || !(heading instanceof HTMLElement) || !(description instanceof HTMLElement)) {
      throw new Error("final Artwork baseline geometry is incomplete");
    }
    const rectangle = (element) => {
      const value = element.getBoundingClientRect();
      return { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height };
    };
    const buttonRect = rectangle(button);
    const panelRect = rectangle(panel);
    const navRect = rectangle(nav);
    const bannerRect = rectangle(banner);
    const eyebrowRect = rectangle(eyebrow);
    const headingRect = rectangle(heading);
    const descriptionRect = rectangle(description);
    const requiredFocusExtent = 6;
    const safeTop = bannerRect.bottom + 12;
    const safeBottom = navRect.top - 12;
    return {
      scrollY,
      button: buttonRect,
      panel: panelRect,
      nav: navRect,
      banner: bannerRect,
      eyebrow: eyebrowRect,
      heading: headingRect,
      description: descriptionRect,
      focusNavClearance: navRect.top - (buttonRect.bottom + requiredFocusExtent),
      panelNavClearance: navRect.top - panelRect.bottom,
      panelBannerClearance: panelRect.top - bannerRect.bottom,
      headingBannerClearance: headingRect.top - bannerRect.bottom,
      panelHeightWithinLimit: panelRect.height <= 744,
      panelTopBoundaryVisible: panelRect.top >= safeTop,
      eyebrowFullyVisible: eyebrowRect.left >= 0 && eyebrowRect.right <= innerWidth
        && eyebrowRect.top >= safeTop && eyebrowRect.bottom <= safeBottom,
      headingFullyVisible: headingRect.left >= 0 && headingRect.right <= innerWidth
        && headingRect.top >= safeTop && headingRect.bottom <= safeBottom,
      descriptionFullyVisible: descriptionRect.left >= 0 && descriptionRect.right <= innerWidth
        && descriptionRect.top >= safeTop && descriptionRect.bottom <= safeBottom,
      buttonFullyVisible: buttonRect.left - requiredFocusExtent >= 0 && buttonRect.right + requiredFocusExtent <= innerWidth
        && buttonRect.top - requiredFocusExtent >= safeTop && buttonRect.bottom + requiredFocusExtent <= safeBottom,
      panelBottomBoundaryVisible: panelRect.bottom > 0 && panelRect.bottom <= safeBottom,
    };
  })()`);
  const after = await safeInteractionState(client);
  const stateUnchanged = before.snapshotSha256 === after.snapshotSha256
    && arraysEqual(before.focus, after.focus)
    && before.scroll.x === after.scroll.x;
  if (!stateUnchanged
    || geometry.focusNavClearance < 12
    || geometry.panelNavClearance < 12
    || geometry.panelBannerClearance < 12
    || geometry.headingBannerClearance < 12
    || !geometry.panelHeightWithinLimit || !geometry.panelTopBoundaryVisible || !geometry.eyebrowFullyVisible
    || !geometry.headingFullyVisible || !geometry.descriptionFullyVisible
    || !geometry.buttonFullyVisible || !geometry.panelBottomBoundaryVisible) {
    fail(`final Artwork pre-baseline staging is unsafe: ${JSON.stringify({ before, staged, geometry, after, stateUnchanged })}`);
  }
  return { ...staged, geometry, stateUnchanged, result: "PASS" };
}

async function waitForNativeToastExpiry(client) {
  const before = await safeInteractionState(client);
  const settlement = await evaluate(client, `(async () => {
    const observe = () => {
      const region = document.querySelector("#toast-region");
      return {
        regionPresent: region instanceof HTMLElement,
        childCount: region?.childElementCount ?? null,
        toastCount: region?.querySelectorAll(".toast").length ?? null,
        textEmpty: (region?.textContent || "").trim() === "",
      };
    };
    const before = observe();
    const startedAt = performance.now();
    await new Promise((resolveDone) => setTimeout(resolveDone, 4300));
    const elapsedMs = performance.now() - startedAt;
    return { waitKind: "passive native 4.2-second toast expiry", requestedMs: 4300, elapsedMs, before, after: observe() };
  })()`);
  const after = await safeInteractionState(client);
  const unchanged = before.snapshotSha256 === after.snapshotSha256
    && arraysEqual(before.focus, after.focus)
    && arraysEqual(before.scroll, after.scroll);
  if (settlement.elapsedMs < 4200
    || settlement.after.regionPresent !== true
    || settlement.after.childCount !== 0
    || settlement.after.toastCount !== 0
    || settlement.after.textEmpty !== true
    || !unchanged) {
    fail(`native toast did not expire passively without state/focus/scroll drift: ${JSON.stringify({ settlement, before, after, unchanged })}`);
  }
  return { ...settlement, stateFocusScrollUnchanged: true, result: "PASS" };
}

async function inspectFinalCanonicalCaptureSafety(client) {
  const safety = await evaluate(client, `(() => {
    const panel = document.querySelector(${JSON.stringify(CANONICAL_PANEL_SELECTOR)});
    const button = document.querySelector("#lid-v18-canonical-entry-artwork");
    const nav = document.querySelector(".compact-navigation");
    const banner = document.querySelector(".prototype-banner");
    const eyebrow = document.querySelector(".lid-v18-canonical-entry-eyebrow");
    const heading = document.querySelector("#lid-v18-canonical-entry-title");
    const description = document.querySelector("#lid-v18-canonical-entry-description");
    const region = document.querySelector("#toast-region");
    if (!(panel instanceof HTMLElement) || !(button instanceof HTMLElement) || !(nav instanceof HTMLElement)
      || !(banner instanceof HTMLElement) || !(eyebrow instanceof HTMLElement)
      || !(heading instanceof HTMLElement) || !(description instanceof HTMLElement)) {
      throw new Error("final canonical capture safety surfaces are missing");
    }
    const rectangle = (element) => {
      const value = element.getBoundingClientRect();
      return { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height };
    };
    const panelRect = rectangle(panel);
    const buttonRect = rectangle(button);
    const navRect = rectangle(nav);
    const bannerRect = rectangle(banner);
    const style = getComputedStyle(button);
    const panelStyle = getComputedStyle(panel);
    const outlineWidth = Number.parseFloat(style.outlineWidth) || 0;
    const outlineOffset = Number.parseFloat(style.outlineOffset) || 0;
    const focusExtent = outlineWidth + outlineOffset;
    const safeTop = bannerRect.bottom + 12;
    const safeBottom = navRect.top - 12;
    const fullyVisibleInSafeBand = (element) => {
      const value = element.getBoundingClientRect();
      return value.width > 0 && value.height > 0 && value.left >= 0 && value.right <= innerWidth
        && value.top >= safeTop && value.bottom <= safeBottom;
    };
    const facts = [...panel.querySelectorAll("[data-lid-v18-canonical-fact]")];
    const buttons = [...panel.querySelectorAll("button[data-lid-v18-canonical-entry]")];
    return {
      toast: {
        childCount: region?.childElementCount ?? null,
        toastCount: region?.querySelectorAll(".toast").length ?? null,
        textEmpty: (region?.textContent || "").trim() === "",
      },
      focus: {
        id: document.activeElement?.id || null,
        focusVisible: button.matches(":focus-visible"),
        outline: { style: style.outlineStyle, width: outlineWidth, offset: outlineOffset, extent: focusExtent },
        rectangle: buttonRect,
        fullyVisibleWithRing: buttonRect.left - focusExtent >= 0 && buttonRect.right + focusExtent <= innerWidth
          && buttonRect.top - focusExtent >= safeTop && buttonRect.bottom + focusExtent <= safeBottom,
      },
      panel: {
        rectangle: panelRect,
        heightWithinLimit: panelRect.height <= 744,
        topBoundaryVisible: panelRect.top >= safeTop,
        bottomBoundaryVisible: panelRect.bottom > 0 && panelRect.bottom <= safeBottom,
        horizontallyContained: panelRect.left >= 0 && panelRect.right <= innerWidth,
        borderTopWidth: Number.parseFloat(panelStyle.borderTopWidth) || 0,
        borderBottomWidth: Number.parseFloat(panelStyle.borderBottomWidth) || 0,
        overflowY: panelStyle.overflowY,
        contentFitsWithoutNestedScroll: panel.scrollHeight <= panel.clientHeight + 1,
      },
      nav: { rectangle: navRect },
      banner: { rectangle: bannerRect },
      focusNavClearance: navRect.top - (buttonRect.bottom + focusExtent),
      panelNavClearance: navRect.top - panelRect.bottom,
      panelBannerClearance: panelRect.top - bannerRect.bottom,
      exactForcedBand: {
        bannerBottom66: Math.abs(bannerRect.bottom - 66) <= 0.01,
        navigationTop834: Math.abs(navRect.top - 834) <= 0.01,
        panelTopAtLeast78: panelRect.top >= 78,
        panelBottomAtMost822: panelRect.bottom <= 822,
      },
      canonicalContent: {
        eyebrowFullyVisible: fullyVisibleInSafeBand(eyebrow),
        headingBannerClearance: heading.getBoundingClientRect().top - bannerRect.bottom,
        headingFullyVisible: fullyVisibleInSafeBand(heading),
        descriptionFullyVisible: fullyVisibleInSafeBand(description),
        fullyVisibleFactCount: facts.filter(fullyVisibleInSafeBand).length,
        fullyVisibleButtonCount: buttons.filter(fullyVisibleInSafeBand).length,
      },
    };
  })()`);
  const pass = safety.toast.childCount === 0 && safety.toast.toastCount === 0 && safety.toast.textEmpty
    && safety.focus.id === "lid-v18-canonical-entry-artwork"
    && safety.focus.focusVisible && safety.focus.outline.style !== "none" && safety.focus.outline.width > 0
    && safety.focus.fullyVisibleWithRing
    && safety.panel.heightWithinLimit && safety.panel.topBoundaryVisible && safety.panel.bottomBoundaryVisible
    && safety.panel.horizontallyContained && safety.panel.borderTopWidth > 0 && safety.panel.borderBottomWidth > 0
    && !["auto", "scroll", "hidden", "clip"].includes(safety.panel.overflowY) && safety.panel.contentFitsWithoutNestedScroll
    && safety.focusNavClearance >= 12 && safety.panelNavClearance >= 12 && safety.panelBannerClearance >= 12
    && Object.values(safety.exactForcedBand).every(Boolean)
    && safety.canonicalContent.eyebrowFullyVisible
    && safety.canonicalContent.headingBannerClearance >= 12
    && safety.canonicalContent.headingFullyVisible && safety.canonicalContent.descriptionFullyVisible
    && safety.canonicalContent.fullyVisibleFactCount === 4 && safety.canonicalContent.fullyVisibleButtonCount === 4;
  if (!pass) fail(`final canonical capture has toast, focus, panel, navigation, or content overlap: ${JSON.stringify(safety)}`);
  return { requiredClearancePx: 12, ...safety, result: "PASS" };
}

async function dispatchRemoteMouseClick(client, objectId) {
  const observation = await inspectRemoteControl(client, objectId);
  if (!observation.visible || !observation.enabled || !observation.centerHitWithinControl) {
    fail(`retained control is not pointer-actionable: ${JSON.stringify(observation)}`);
  }
  await client.send("Input.dispatchMouseEvent", {
    type: "mousePressed", x: observation.center.x, y: observation.center.y,
    button: "left", buttons: 1, clickCount: 1,
  });
  await client.send("Input.dispatchMouseEvent", {
    type: "mouseReleased", x: observation.center.x, y: observation.center.y,
    button: "left", buttons: 0, clickCount: 1,
  });
}

async function activateRetainedControl(client, objectId, activationMethod) {
  if (activationMethod === "pointer") {
    await dispatchRemoteMouseClick(client, objectId);
    return;
  }
  const alreadyFocused = await callRemote(client, objectId, `function () {
    return this.isConnected && document.activeElement === this;
  }`);
  if (!alreadyFocused) fail(`keyboard activation baseline was not already focused: ${activationMethod}`);
  if (activationMethod === "enter") {
    await dispatchKeyboardKey(client, "Enter", "Enter", 13, "\r");
    return;
  }
  if (activationMethod === "space") {
    await dispatchKeyboardKey(client, " ", "Space", 32, " ");
    return;
  }
  fail(`unsupported governed entry activation method: ${activationMethod}`);
}

function digestDomainPair(pair) {
  const beforeSha256 = typeof pair?.before === "string"
    ? createHash("sha256").update(pair.before).digest("hex")
    : null;
  const currentSha256 = typeof pair?.current === "string"
    ? createHash("sha256").update(pair.current).digest("hex")
    : null;
  return { beforeEqualsCurrent: pair?.before === pair?.current, beforeSha256, currentSha256 };
}

async function inspectActiveHistory(client) {
  const observation = await evaluate(client, `(() => {
    const runtime = document.querySelector("#lid-runtime-v17");
    const host = document.querySelector("#lid-feature-host-v17");
    const panel = document.querySelector(${JSON.stringify(CANONICAL_PANEL_SELECTOR)});
    const back = host?.querySelector('[data-lid-action="close-feature"]');
    const backRectangle = back?.getBoundingClientRect();
    const backHit = backRectangle ? document.elementFromPoint(backRectangle.left + backRectangle.width / 2, backRectangle.top + backRectangle.height / 2) : null;
    const panelStyle = panel ? getComputedStyle(panel) : null;
    const snapshot = window.__LID_QA__.snapshot();
    return {
      activeFeature: runtime?.dataset.activeFeature || null,
      navigation: {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        historyStateNull: history.state === null,
      },
      viewport: {
        width: innerWidth,
        height: innerHeight,
        devicePixelRatio,
        deviceScaleFactor: devicePixelRatio,
      },
      emulatedMedia: {
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
        motionNoPreference: matchMedia("(prefers-reduced-motion: no-preference)").matches,
        forcedColorsActive: matchMedia("(forced-colors: active)").matches,
        forcedColorsNone: matchMedia("(forced-colors: none)").matches,
        colorSchemeLight: matchMedia("(prefers-color-scheme: light)").matches,
        colorSchemeDark: matchMedia("(prefers-color-scheme: dark)").matches,
      },
      fixture: snapshot.fixture,
      scope: snapshot.scope,
      origin: snapshot.origin,
      canonicalContextToken: snapshot.canonicalContextToken ?? null,
      expectedBackLabel: snapshot.expectedBackLabel,
      laneCounts: { source: snapshot.laneCounts.source, derived: snapshot.laneCounts.derived },
      totalCount: snapshot.totalCount,
      h1: host?.querySelector("h1")?.textContent.replace(/\\s+/g, " ").trim() || null,
      back: back ? {
        text: back.textContent.replace(/\\s+/g, " ").trim(),
        visible: Boolean(backRectangle && backRectangle.width > 0 && backRectangle.height > 0
          && backRectangle.bottom > 0 && backRectangle.right > 0 && backRectangle.top < innerHeight && backRectangle.left < innerWidth),
        enabled: !back.disabled,
        centerHitWithinControl: Boolean(backHit && (backHit === back || back.contains(backHit))),
      } : null,
      panelWhileActive: panel ? {
        display: panelStyle.display,
        rendered: Boolean(panel.getClientRects().length),
        ariaHidden: panel.getAttribute("aria-hidden"),
        hitTestable: (() => {
          const rectangle = panel.getBoundingClientRect();
          if (!rectangle.width || !rectangle.height || rectangle.bottom <= 0 || rectangle.right <= 0 || rectangle.top >= innerHeight || rectangle.left >= innerWidth) return false;
          const hit = document.elementFromPoint(Math.max(0, Math.min(innerWidth - 1, rectangle.left + rectangle.width / 2)), Math.max(0, Math.min(innerHeight - 1, rectangle.top + rectangle.height / 2)));
          return Boolean(hit && (hit === panel || panel.contains(hit)));
        })(),
      } : null,
      itemDefault: {
        openDisclosureKeys: [...snapshot.openDisclosureKeys],
        disclosureDefaultIntact: snapshot.disclosureDefaultIntact,
        e12Open: Boolean(host?.querySelector('[data-lid-v18-event-details="E12"]')?.open),
      },
      entryReturn: {
        pending: snapshot.entryReturn?.pending ? "present" : null,
        lastRestorationConsumed: snapshot.entryReturn?.lastRestoration?.consumed ?? null,
      },
      announcementEmpty: snapshot.announcement === "",
      counters: {
        mutationIntents: snapshot.mutationIntents,
        mutationEffects: snapshot.mutationEffects,
        providerRequests: snapshot.providerRequests,
      },
      domainPair: {
        before: snapshot.preOpenDomainFingerprint,
        current: snapshot.currentDomainFingerprint,
      },
    };
  })()`);
  const domain = digestDomainPair(observation.domainPair);
  delete observation.domainPair;
  return { ...observation, domain };
}

async function closeGovernedHistory(client, closeMethod, expectedBackLabel) {
  if (closeMethod === "back") {
    const backSelector = '#lid-feature-host-v17 [data-lid-action="close-feature"]';
    const back = await inspectVisibleControl(client, {
      key: expectedBackLabel,
      selector: backSelector,
      role: "button",
      name: expectedBackLabel,
    });
    if (!back.enabled || !back.centerHitWithinControl) fail(`Back control is not actionable: ${expectedBackLabel}`);
    await dispatchVisibleMouseClick(client, backSelector);
  } else if (closeMethod === "escape") {
    await dispatchKeyboardKey(client, "Escape", "Escape", 27);
  } else fail(`unsupported governed close method: ${closeMethod}`);

  await waitForCondition(client, `(() => {
    const runtime = document.querySelector("#lid-runtime-v17");
    const snapshot = window.__LID_QA__.snapshot();
    return (runtime?.dataset.activeFeature || null) === null
      && snapshot.entryReturn?.pending === null
      && snapshot.entryReturn?.lastRestoration?.consumed === true;
  })()`, `${expectedBackLabel} return restoration`);
  await waitForInteractionSettled(client);
}

async function inspectReturnEvidence(client) {
  return evaluate(client, `(() => {
    const snapshot = window.__LID_QA__.snapshot();
    const restoration = snapshot.entryReturn?.lastRestoration || null;
    return {
      activeFeature: document.querySelector("#lid-runtime-v17")?.dataset.activeFeature || null,
      hostHidden: document.querySelector("#lid-feature-host-v17")?.hidden ?? null,
      hostChildCount: document.querySelector("#lid-feature-host-v17")?.childElementCount ?? null,
      fixture: snapshot.fixture,
      scope: snapshot.scope,
      counters: {
        mutationIntents: snapshot.mutationIntents,
        mutationEffects: snapshot.mutationEffects,
        providerRequests: snapshot.providerRequests,
      },
      restoration: restoration ? {
        origin: restoration.origin,
        scope: restoration.scope,
        canonicalContextToken: restoration.canonicalContextToken,
        closeMethod: restoration.closeMethod,
        sameConnectedInvoker: restoration.sameConnectedInvoker,
        focused: restoration.focused,
        usedFallback: restoration.usedFallback,
        scrollDelta: restoration.scrollDelta,
        targetTopDelta: restoration.targetTopDelta,
        consumed: restoration.consumed,
      } : null,
      inheritedContextPatchedCount: snapshot.inheritedContextPatchedCount,
      launcherUserSurfaceAbsent: snapshot.launcherUserSurfaceAbsent,
    };
  })()`);
}

async function inspectEvidenceEnvironment(client, label) {
  const observed = await evaluate(client, `(() => {
    const current = window.__LID_QA__.snapshot();
    const focused = document.activeElement;
    const opaqueDigest = (value) => {
      let serialized;
      try { serialized = JSON.stringify(value); } catch { serialized = '[unserializable]'; }
      serialized ??= '[undefined]';
      let hash = 2166136261;
      for (let index = 0; index < serialized.length; index += 1) {
        hash ^= serialized.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
      }
      return (hash >>> 0).toString(16).padStart(8, '0');
    };
    return {
      label: ${JSON.stringify(label)},
      activeFeature: document.querySelector("#lid-runtime-v17")?.dataset.activeFeature || null,
      viewport: {
        width: innerWidth,
        height: innerHeight,
        devicePixelRatio,
        deviceScaleFactor: devicePixelRatio,
      },
      emulatedMedia: {
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
        motionNoPreference: matchMedia("(prefers-reduced-motion: no-preference)").matches,
        forcedColorsActive: matchMedia("(forced-colors: active)").matches,
        forcedColorsNone: matchMedia("(forced-colors: none)").matches,
        colorSchemeLight: matchMedia("(prefers-color-scheme: light)").matches,
        colorSchemeDark: matchMedia("(prefers-color-scheme: dark)").matches,
      },
      fixture: current.fixture,
      scope: current.scope,
      appState: {
        fixture: current.fixture,
        scope: current.scope,
        transitionBranch: current.transitionBranch ?? null,
        theme: current.theme,
        visibleSourceKeys: [...current.visibleSourceKeys],
        visibleDerivedKeys: [...current.visibleDerivedKeys],
        laneCounts: { ...current.laneCounts },
        totalCount: current.totalCount,
        appliedFilters: { ...current.appliedFilters },
        draftFilters: { ...current.draftFilters },
        activeFilterCount: current.activeFilterCount,
        filterOpen: current.filterOpen,
        consoleOpen: current.consoleOpen,
        openDisclosureKeys: [...current.openDisclosureKeys],
        sourceContextVariant: current.sourceContextVariant,
        pagination: {
          source: {
            stage: current.pagination.source.stage,
            currentCount: current.pagination.source.currentCount,
            endReached: current.pagination.source.endReached,
          },
          derived: {
            stage: current.pagination.derived.stage,
            currentCount: current.pagination.derived.currentCount,
            endReached: current.pagination.derived.endReached,
          },
        },
      },
      entryReturn: {
        pending: current.entryReturn?.pending ? "present" : null,
        lastRestorationConsumed: current.entryReturn?.lastRestoration?.consumed ?? null,
      },
      announcementEmpty: current.announcement === "",
      focus: {
        id: focused?.id || null,
        tagName: focused?.tagName?.toLowerCase() || null,
      },
      scroll: { x: scrollX, y: scrollY },
      navigation: {
        url: location.pathname + location.search + location.hash,
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        historyLength: history.length,
        historyStateNull: history.state === null,
        historyStateType: history.state === null ? "null" : (Array.isArray(history.state) ? "array" : typeof history.state),
        historyStateDigest: opaqueDigest(history.state),
      },
      storageCounts: {
        localStorage: localStorage.length,
        sessionStorage: sessionStorage.length,
      },
      counters: {
        mutationIntents: current.mutationIntents,
        mutationEffects: current.mutationEffects,
        providerRequests: current.providerRequests,
      },
      domainPair: { before: current.preOpenDomainFingerprint, current: current.currentDomainFingerprint },
    };
  })()`);
  observed.domain = digestDomainPair(observed.domainPair);
  delete observed.domainPair;
  observed.appStateSha256 = valueSha256(observed.appState);
  const media = observed.emulatedMedia;
  if (observed.activeFeature !== null || observed.entryReturn.pending !== null
    || observed.viewport.devicePixelRatio !== 1 || observed.viewport.deviceScaleFactor !== 1
    || !media.reducedMotion || media.motionNoPreference || !media.forcedColorsActive || media.forcedColorsNone
    || !media.colorSchemeLight || media.colorSchemeDark
    || !observed.announcementEmpty
    || observed.navigation.pathname !== "/index-v18.html" || observed.navigation.hash
    || Object.values(observed.storageCounts).some((count) => count !== 0)
    || Object.values(observed.counters).some((count) => count !== 0) || !observed.domain.beforeEqualsCurrent) {
    fail(`evidence environment is not exact and inactive: ${JSON.stringify(observed)}`);
  }
  return observed;
}

async function runEntryRoundTrip(client, spec, expression, kind, viewportStage, requested, stagedBaseline = null, breakpointRegression = false) {
  const objectId = await retainRemoteElement(client, expression, `${spec.originToken} governed History origin`);
  try {
    if (!stagedBaseline) await scrollRemoteIntoView(client, objectId);
    if (spec.activationMethod === "enter" || spec.activationMethod === "space") {
      await focusRemoteElement(client, objectId);
    }
    const before = await inspectRemoteControl(client, objectId);
    if (stagedBaseline && (Math.abs(before.scrollY - stagedBaseline.geometry.scrollY) > ORIGIN_RETURN_TOLERANCE_PX
      || Math.abs(before.top - stagedBaseline.geometry.button.top) > ORIGIN_RETURN_TOLERANCE_PX)) {
      fail(`governed ${spec.originToken} baseline drifted after safe-area staging`);
    }
    const expectedName = kind === "canonical" ? spec.name : "History";
    const expectedAppOrigin = kind === "canonical" ? spec.token : spec.originToken;
    const originKey = kind === "global" ? `${spec.originToken}-global` : `canonical-${spec.originToken}`;
    const exactStage = breakpointRegression
      ? `origin-breakpoint-${requested.width}-${spec.originToken}`
      : spec.originToken === "settings" ? "settings-wide" : "restored-compact";
    const exactWidth = breakpointRegression ? requested.width : spec.originToken === "settings" ? 1024 : 320;
    const exactHeight = 900;
    const breakpointPositiveExact = !breakpointRegression || (kind === "global"
      && [960, 961, 1023].includes(exactWidth)
      && (exactWidth <= 960 ? spec.originToken === "more" : spec.originToken === "settings"));
    const targetGeometryExact = kind === "canonical"
      ? before.minimum44By44 && before.allHitTestsWithinControl
      : before.centerHitWithinControl;
    const accessibilityBefore = await accessibilityForSelector(client, spec.selector);
    if (!before.connected || !before.visible || !before.enabled || !before.focusable
      || !targetGeometryExact || before.text !== expectedName
      || accessibilityBefore.axCount === 0 || !accessibilityBefore.names.includes(expectedName)
      || !breakpointPositiveExact || viewportStage !== exactStage || requested.width !== exactWidth || requested.height !== exactHeight
      || requested.deviceScaleFactor !== 1 || before.viewport.width !== exactWidth || before.viewport.height !== exactHeight) {
      fail(`governed ${spec.originToken} origin failed pre-activation acceptance: ${JSON.stringify({ before, accessibilityBefore, viewportStage, requested })}`);
    }
    if (kind === "canonical" && (before.id !== spec.id || Object.keys(before.v18AttributeMap).length !== 1)) {
      fail(`canonical ${spec.originToken} origin identity is not exact`);
    }
    if (kind === "global" && Object.keys(before.v18AttributeMap).length !== 0) {
      fail(`native ${spec.originToken} History origin contains v18 decoration`);
    }
    const environmentBefore = await inspectEvidenceEnvironment(client, `${spec.originToken}-before-activation`);

    await activateRetainedControl(client, objectId, spec.activationMethod);
    await waitForCondition(client, `document.querySelector("#lid-runtime-v17")?.dataset.activeFeature === "v18"`, `${spec.originToken} governed entry activation`);
    await waitForInteractionSettled(client);
    const active = await inspectActiveHistory(client);
    const panelAccessibility = await accessibilityForSelector(client, CANONICAL_PANEL_SELECTOR);
    const media = active.emulatedMedia;
    const itemDefaultPass = spec.scope !== "item" || (
      arraysEqual(active.itemDefault.openDisclosureKeys, ["E12"])
      && active.itemDefault.disclosureDefaultIntact === true
      && active.itemDefault.e12Open === true
    );
    if (active.activeFeature !== "v18" || active.fixture !== spec.fixture || active.scope !== spec.scope
      || active.navigation.pathname !== "/index-v18.html" || active.navigation.search !== ""
      || active.navigation.hash !== "" || active.navigation.historyStateNull !== true
      || active.origin !== expectedAppOrigin || active.h1 !== spec.h1 || active.expectedBackLabel !== spec.backLabel
      || active.back?.text !== spec.backLabel || !active.back.visible || !active.back.enabled || !active.back.centerHitWithinControl
      || active.laneCounts.source !== spec.expectedSourceCount || active.laneCounts.derived !== spec.expectedDerivedCount
      || active.totalCount !== spec.expectedCount || !active.domain.beforeEqualsCurrent
      || active.viewport.width !== exactWidth || active.viewport.height !== exactHeight
      || active.viewport.devicePixelRatio !== 1 || active.viewport.deviceScaleFactor !== 1
      || !media.reducedMotion || media.motionNoPreference || !media.forcedColorsActive || media.forcedColorsNone
      || !media.colorSchemeLight || media.colorSchemeDark
      || active.entryReturn.pending !== "present"
      || Object.values(active.counters).some((count) => count !== 0)
      || active.panelWhileActive?.display !== "none" || active.panelWhileActive.rendered || active.panelWhileActive.hitTestable
      || panelAccessibility.axCount !== 0 || !itemDefaultPass
      || (kind === "canonical" && active.canonicalContextToken !== spec.token)
      || (kind === "global" && active.canonicalContextToken !== null)) {
      fail(`governed ${spec.originToken} active state is not exact: ${JSON.stringify({ active, panelAccessibility })}`);
    }

    await closeGovernedHistory(client, spec.closeMethod, spec.backLabel);
    const after = await inspectRemoteControl(client, objectId);
    const accessibilityAfter = await accessibilityForSelector(client, spec.selector);
    const returned = await inspectReturnEvidence(client);
    const environmentAfter = await inspectEvidenceEnvironment(client, `${spec.originToken}-after-return`);
    const independentScrollDelta = Math.round((after.scrollY - before.scrollY) * 1000) / 1000;
    const independentTopDelta = Math.round((after.top - before.top) * 1000) / 1000;
    const attributesUnchanged = arraysEqual(before.attributeMap, after.attributeMap);
    const restoration = returned.restoration;
    const pass = returned.activeFeature === null && returned.hostHidden === true && returned.hostChildCount === 0
      && returned.inheritedContextPatchedCount === 0 && returned.launcherUserSurfaceAbsent === true
      && after.connected && after.sameNode && after.focused && after.visible && after.enabled && after.centerHitWithinControl
      && accessibilityAfter.axCount > 0 && accessibilityAfter.names.includes(expectedName)
      && attributesUnchanged
      && Math.abs(independentScrollDelta) <= ORIGIN_RETURN_TOLERANCE_PX
      && Math.abs(independentTopDelta) <= ORIGIN_RETURN_TOLERANCE_PX
      && restoration?.origin === expectedAppOrigin && restoration.scope === spec.scope
      && restoration.closeMethod === spec.closeMethod && restoration.sameConnectedInvoker === true
      && restoration.focused === true && restoration.usedFallback === false && restoration.consumed === true
      && Math.abs(restoration.scrollDelta) <= ORIGIN_RETURN_TOLERANCE_PX
      && Math.abs(restoration.targetTopDelta) <= ORIGIN_RETURN_TOLERANCE_PX
      && (kind !== "canonical" || restoration.canonicalContextToken === spec.token)
      && (kind !== "global" || restoration.canonicalContextToken === null)
      && Object.values(returned.counters).every((count) => count === 0);
    const environmentPass = arraysEqual(environmentBefore.viewport, environmentAfter.viewport)
      && arraysEqual(environmentBefore.emulatedMedia, environmentAfter.emulatedMedia)
      && environmentBefore.domain.beforeSha256 === environmentAfter.domain.beforeSha256
      && environmentBefore.domain.currentSha256 === environmentAfter.domain.currentSha256
      && arraysEqual(environmentBefore.storageCounts, environmentAfter.storageCounts)
      && environmentAfter.navigation.pathname === "/index-v18.html"
      && environmentAfter.navigation.search === "" && environmentAfter.navigation.hash === ""
      && environmentAfter.navigation.historyStateNull === true
      && environmentBefore.viewport.width === exactWidth && environmentBefore.viewport.height === exactHeight
      && active.viewport.width === exactWidth && active.viewport.height === exactHeight
      && environmentAfter.viewport.width === exactWidth && environmentAfter.viewport.height === exactHeight
      && environmentAfter.entryReturn.lastRestorationConsumed === true;
    if (!pass || !environmentPass) fail(`governed ${spec.originToken} return is not exact: ${JSON.stringify({ before, after, accessibilityBefore, accessibilityAfter, returned, environmentBefore, active, environmentAfter, independentScrollDelta, independentTopDelta })}`);
    return {
      originKey,
      originToken: spec.originToken,
      appOrigin: expectedAppOrigin,
      kind,
      breakpointRegression,
      viewportStage,
      requested,
      observed: {
        before: before.viewport,
        active: active.viewport,
        after: after.viewport,
      },
      controlId: before.id,
      activationMethod: spec.activationMethod,
      closeMethod: spec.closeMethod,
      fixture: active.fixture,
      scope: active.scope,
      h1: active.h1,
      backLabel: active.back.text,
      laneCounts: active.laneCounts,
      representedCount: active.totalCount,
      canonicalContextToken: active.canonicalContextToken,
      itemE12Default: spec.scope === "item" ? active.itemDefault : null,
      activePanel: { ...active.panelWhileActive, axCount: panelAccessibility.axCount, accessibilityCount: panelAccessibility.accessibilityCount },
      readOnly: { counters: active.counters, domain: active.domain },
      environmentBefore,
      environmentAfter,
      accessibility: {
        before: accessibilityBefore,
        after: accessibilityAfter,
      },
      originBefore: {
        id: before.id, text: before.text, attributeMap: before.attributeMap,
        viewport: before.viewport, scrollY: before.scrollY, top: before.top, connected: before.connected,
        focused: before.focused, visible: before.visible, enabled: before.enabled,
        centerHitWithinControl: before.centerHitWithinControl,
      },
      originAfter: {
        id: after.id, text: after.text, attributeMap: after.attributeMap,
        viewport: after.viewport, scrollY: after.scrollY, top: after.top, connected: after.connected,
        sameNode: after.sameNode, focused: after.focused, visible: after.visible, enabled: after.enabled,
        centerHitWithinControl: after.centerHitWithinControl,
      },
      return: {
        tolerancePx: ORIGIN_RETURN_TOLERANCE_PX,
        attributesUnchanged,
        independentScrollDelta,
        independentTopDelta,
        app: restoration,
      },
      stagedBaseline,
      result: "PASS",
    };
  } finally {
    await releaseRemote(client, objectId);
  }
}

async function launcherRetirementDiagnostics(client) {
  const dom = await evaluate(client, `(() => {
    const launchers = [...document.querySelectorAll(".lid-launcher-v17")];
    const rendered = (element) => {
      const rectangle = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return Boolean(rectangle.width > 0 && rectangle.height > 0 && element.getClientRects().length
        && !element.hidden && !element.closest("[hidden], [inert]")
        && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0);
    };
    const visible = (element) => {
      const rectangle = element.getBoundingClientRect();
      return rendered(element) && rectangle.bottom > 0 && rectangle.right > 0 && rectangle.top < innerHeight && rectangle.left < innerWidth;
    };
    const hit = (element) => {
      if (!visible(element)) return false;
      const rectangle = element.getBoundingClientRect();
      const target = document.elementFromPoint(rectangle.left + rectangle.width / 2, rectangle.top + rectangle.height / 2);
      return Boolean(target && (target === element || element.contains(target)));
    };
    return {
      presentCount: launchers.length,
      visibleCount: launchers.filter(visible).length,
      focusableCount: launchers.filter((element) => rendered(element) && !element.disabled && element.tabIndex >= 0).length,
      hitCount: launchers.filter(hit).length,
      focusedCount: launchers.filter((element) => document.activeElement === element).length,
    };
  })()`);
  const accessibility = await accessibilityForSelector(client, ".lid-launcher-v17");
  const snapshot = await evaluate(client, `(() => {
    const current = window.__LID_QA__.snapshot();
    return {
      launcherUserSurfaceAbsent: current.launcherUserSurfaceAbsent,
      compatibilityLauncher: current.compatibilityLauncher,
    };
  })()`);
  const result = {
    ...dom,
    axCount: accessibility.axCount,
    accessibilityCount: accessibility.accessibilityCount,
    launcherUserSurfaceAbsent: snapshot.launcherUserSurfaceAbsent,
    compatibility: snapshot.compatibilityLauncher,
  };
  if (result.visibleCount !== 0 || result.focusableCount !== 0 || result.hitCount !== 0
    || result.focusedCount !== 0 || result.axCount !== 0 || result.accessibilityCount !== 0
    || result.launcherUserSurfaceAbsent !== true) {
    fail(`retired launcher leaked into the v18 user surface: ${JSON.stringify(result)}`);
  }
  return result;
}

async function inspectFreshInactiveState(client) {
  const state = await evaluate(client, `(() => {
    const runtime = document.querySelector("#lid-runtime-v17");
    const host = document.querySelector("#lid-feature-host-v17");
    const current = window.__LID_QA__.snapshot();
    return {
      activeFeature: runtime?.dataset.activeFeature || null,
      hostHidden: host?.hidden ?? null,
      hostChildCount: host?.childElementCount ?? null,
      canonicalEntry: current.canonicalEntry,
      inheritedContextPatchedCount: current.inheritedContextPatchedCount,
      launcherUserSurfaceAbsent: current.launcherUserSurfaceAbsent,
      counters: {
        mutationIntents: current.mutationIntents,
        mutationEffects: current.mutationEffects,
        providerRequests: current.providerRequests,
      },
    };
  })()`);
  const launcher = await launcherRetirementDiagnostics(client);
  const panelAccessibility = await accessibilityForSelector(client, CANONICAL_PANEL_SELECTOR);
  const panel = state.canonicalEntry;
  if (state.activeFeature !== null || state.hostHidden !== true || state.hostChildCount !== 0
    || state.inheritedContextPatchedCount !== 0 || state.launcherUserSurfaceAbsent !== true
    || Object.values(state.counters).some((count) => count !== 0)
    || panel?.count !== 1 || panel.placementFailed || !panel.directBodyChild || !panel.afterPrototypeRoot || !panel.beforeModalRoot
    || !panel.visibleInLayout || !panel.accessibilityExposed || panelAccessibility.axCount === 0
    || panel.eyebrow !== CANONICAL_ENTRY_COPY.eyebrow || panel.heading !== CANONICAL_ENTRY_COPY.heading || panel.body !== CANONICAL_ENTRY_COPY.body) {
    fail(`fresh v18 route is not exact and inactive: ${JSON.stringify({ state, launcher, panelAccessibility })}`);
  }
  return { ...state, launcher, panelAccessibility };
}

function entrySpecForFixture(fixture) {
  if (["item-ready", "upstream-revised", "upstream-conflict", "upstream-untagged", "upstream-deleted"].includes(fixture)) {
    return { kind: "canonical", spec: CANONICAL_ENTRY_SPECS[1] };
  }
  if (fixture === "day-ready") return { kind: "canonical", spec: CANONICAL_ENTRY_SPECS[0] };
  if (fixture === "field-ready") return { kind: "canonical", spec: CANONICAL_ENTRY_SPECS[2] };
  if (fixture === "artwork-ready") return { kind: "canonical", spec: CANONICAL_ENTRY_SPECS[3] };
  return { kind: "global", spec: GLOBAL_ENTRY_SPECS[0], compactSpec: GLOBAL_ENTRY_SPECS[1] };
}

async function openGovernedEntryForCapture(client, fixture) {
  const mapping = entrySpecForFixture(fixture);
  const kind = mapping.kind;
  const moreOriginSurface = await evaluate(client, `matchMedia("(max-width: 960px)").matches`);
  const spec = kind === "global" && moreOriginSurface ? mapping.compactSpec : mapping.spec;
  if (kind === "global") await openGlobalOriginSurface(client, spec.originToken);
  const objectId = await retainRemoteElement(client, `document.querySelector(${JSON.stringify(spec.selector)})`, `${spec.originToken} canonical capture entry`);
  try {
    await scrollRemoteIntoView(client, objectId);
    const before = await inspectRemoteControl(client, objectId);
    const expectedName = kind === "global" ? "History" : spec.name;
    if (!before.visible || !before.enabled || !before.centerHitWithinControl
      || (kind === "canonical" && !before.minimum44By44) || before.text !== expectedName) {
      fail(`governed active-capture entry is not actionable: ${JSON.stringify(before)}`);
    }
    await activateRetainedControl(client, objectId, "pointer");
    await waitForCondition(client, `document.querySelector("#lid-runtime-v17")?.dataset.activeFeature === "v18"`, "governed active capture entry");
    await waitForInteractionSettled(client);
    const channel = kind === "global"
      ? spec.originToken === "settings"
        ? "CDP visible native Settings History pointer activation"
        : "CDP visible native compact More History pointer activation"
      : "CDP visible canonical-entry pointer activation";
    return {
      channel,
      actualUserStep: true,
      kind,
      originToken: spec.originToken,
      controlId: before.id,
      initialFixture: spec.fixture,
    };
  } finally {
    await releaseRemote(client, objectId);
  }
}

async function activateNativeNegative(client, spec) {
  const objectId = await retainRemoteElement(client, spec.expression, spec.label);
  try {
    await scrollRemoteIntoView(client, objectId);
    const before = await inspectRemoteControl(client, objectId);
    if (!before.visible || !before.enabled || !before.centerHitWithinControl || before.text !== spec.expectedText
      || Object.keys(before.v18AttributeMap).length !== 0) {
      fail(`native negative control is not exact before activation: ${JSON.stringify(before)}`);
    }
    const patchedBefore = await evaluate(client, `window.__LID_QA__.snapshot().inheritedContextPatchedCount`);
    await dispatchRemoteMouseClick(client, objectId);
    await waitForInteractionSettled(client);
    const retainedAfterActivation = await inspectRemoteControl(client, objectId);
    if (spec.restoreSelector) {
      await scrollSelectorIntoView(client, spec.restoreSelector);
      await dispatchVisibleMouseClick(client, spec.restoreSelector);
      await waitForCondition(client, `Boolean((${spec.expression}))`, `${spec.label} current rendered control`);
      await waitForInteractionSettled(client);
    }
    const currentObjectId = await retainRemoteElement(client, spec.expression, `${spec.label} current rendered control`);
    let after;
    try {
      await scrollRemoteIntoView(client, currentObjectId);
      after = await inspectRemoteControl(client, currentObjectId);
    } finally {
      await releaseRemote(client, currentObjectId);
    }
    const observed = await evaluate(client, `(() => {
      const current = window.__LID_QA__.snapshot();
      return {
        activeFeature: document.querySelector("#lid-runtime-v17")?.dataset.activeFeature || null,
        inheritedContextPatchedCount: current.inheritedContextPatchedCount,
        launcherUserSurfaceAbsent: current.launcherUserSurfaceAbsent,
        counters: {
          mutationIntents: current.mutationIntents,
          mutationEffects: current.mutationEffects,
          providerRequests: current.providerRequests,
        },
      };
    })()`);
    const textUnchanged = before.text === after.text;
    const attributesUnchanged = arraysEqual(before.attributeMap, after.attributeMap);
    const pass = patchedBefore === 0 && observed.activeFeature === null && observed.inheritedContextPatchedCount === 0
      && observed.launcherUserSurfaceAbsent === true && textUnchanged && attributesUnchanged
      && after.connected && after.visible && after.enabled && after.centerHitWithinControl
      && Object.keys(after.v18AttributeMap).length === 0 && Object.values(observed.counters).every((count) => count === 0);
    if (!pass) fail(`native negative activation changed v18 eligibility or opened History: ${JSON.stringify({ before, retainedAfterActivation, after, observed })}`);
    return {
      key: spec.key,
      label: spec.label,
      activationMethod: "pointer",
      expectedText: spec.expectedText,
      before: { text: before.text, attributeMap: before.attributeMap, connected: before.connected },
      retainedAfterActivation: {
        text: retainedAfterActivation.text,
        attributeMap: retainedAfterActivation.attributeMap,
        connected: retainedAfterActivation.connected,
      },
      currentAfter: {
        text: after.text, attributeMap: after.attributeMap, connected: after.connected,
        visible: after.visible, enabled: after.enabled, centerHitWithinControl: after.centerHitWithinControl,
      },
      textUnchanged,
      attributesUnchanged,
      activeFeatureAfter: observed.activeFeature,
      inheritedContextPatchedCount: observed.inheritedContextPatchedCount,
      result: "PASS",
    };
  } finally {
    await releaseRemote(client, objectId);
  }
}

async function prepareTwoAugustNativeNegatives(client) {
  const populatedSelector = '#prototype-root [data-action="set-readiness-fixture"][data-fixture="archive/populated"]';
  await waitForCondition(client, `Boolean(document.querySelector(${JSON.stringify(populatedSelector)}))`, "Populated archive fixture control");
  await scrollSelectorIntoView(client, populatedSelector);
  await dispatchVisibleMouseClick(client, populatedSelector);
  await waitForCondition(client, `Boolean(document.querySelector('[data-action="select-day"][data-date="2026-08-02"]'))`, "2 August 2026 calendar day");
  await scrollSelectorIntoView(client, '[data-action="select-day"][data-date="2026-08-02"]');
  await inspectVisibleControl(client, {
    key: "2 August 2026 calendar day",
    selector: '[data-action="select-day"][data-date="2026-08-02"]',
    role: "gridcell",
  });
  await dispatchVisibleMouseClick(client, '[data-action="select-day"][data-date="2026-08-02"]');
  await waitForInteractionSettled(client);
  const selectedDay = await evaluate(client, `(() => ({
    tileExpanded: document.querySelector('[data-action="select-day"][data-date="2026-08-02"]')?.getAttribute("aria-expanded") || null,
    tileLabel: document.querySelector('[data-action="select-day"][data-date="2026-08-02"]')?.getAttribute("aria-label") || null,
    selectionPresent: Boolean(document.querySelector("#prototype-root .calendar-selection")),
    selectionDate: document.querySelector("#prototype-root .calendar-selection .museum-date")?.textContent.replace(/\\s+/g, " ").trim() || null,
  }))()`);
  if (selectedDay.tileExpanded !== "true" || !selectedDay.selectionPresent
    || !selectedDay.tileLabel?.includes("2 August 2026") || !selectedDay.selectionDate?.includes("2 August 2026")) {
    fail(`2 August 2026 day details did not open through the native calendar control: ${JSON.stringify(selectedDay)}`);
  }
  const fullDaySelector = '#prototype-root .calendar-selection [data-action="open-full-day"]';
  await scrollSelectorIntoView(client, fullDaySelector);
  await dispatchVisibleMouseClick(client, fullDaySelector);
  await waitForCondition(client, `document.querySelector("#journal-day-title-v14")?.textContent.includes("2 August 2026")`, "2 August 2026 full Journal Day");
  await waitForInteractionSettled(client);
}

async function ensureTwoAugustArtworkControl(client) {
  const historySelector = '#prototype-root [data-action="view-art-history"]';
  if (await evaluate(client, `Boolean(document.querySelector(${JSON.stringify(historySelector)}))`)) {
    return { generatedForDiagnostic: false, method: "existing frozen-v16 browser-memory artwork" };
  }
  const triggerSelector = '#prototype-root [data-action="trigger-art"][data-date="2026-08-02"]';
  await waitForCondition(client, `Boolean(document.querySelector(${JSON.stringify(triggerSelector)}))`, "2 Aug native artwork generation control");
  await scrollSelectorIntoView(client, triggerSelector);
  await dispatchVisibleMouseClick(client, triggerSelector);
  await waitForInteractionSettled(client);
  const sparseConfirmSelector = '#modal-root [data-action="confirm-art"][data-date="2026-08-02"]';
  if (await evaluate(client, `Boolean(document.querySelector(${JSON.stringify(sparseConfirmSelector)}))`)) {
    await scrollSelectorIntoView(client, sparseConfirmSelector);
    await dispatchVisibleMouseClick(client, sparseConfirmSelector);
  }
  await waitForCondition(client, `Boolean(document.querySelector(${JSON.stringify(historySelector)}))`, "2 Aug native View versions control");
  await waitForInteractionSettled(client);
  const activeFeature = await evaluate(client, `document.querySelector("#lid-runtime-v17")?.dataset.activeFeature || null`);
  if (activeFeature !== null) fail("native v16 artwork setup unexpectedly opened v18");
  return { generatedForDiagnostic: true, method: "actual native v16 synthetic browser-memory artwork generation" };
}

async function selectorIsVisiblyActionable(client, selector) {
  return evaluate(client, `(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!(element instanceof HTMLElement)) return false;
    const rectangle = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return Boolean(rectangle.width > 0 && rectangle.height > 0 && element.getClientRects().length
      && !element.hidden && !element.closest("[hidden], [inert]")
      && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0
      && rectangle.bottom > 0 && rectangle.right > 0 && rectangle.top < innerHeight && rectangle.left < innerWidth);
  })()`);
}

async function openSettingsSurface(client) {
  const directSelector = '#prototype-root .settings-quiet[data-action="open-settings"]';
  if (await selectorIsVisiblyActionable(client, directSelector)) {
    await dispatchVisibleMouseClick(client, directSelector);
  } else {
    const moreSelector = '#prototype-root [data-action="open-more"]';
    await scrollSelectorIntoView(client, moreSelector);
    await dispatchVisibleMouseClick(client, moreSelector);
    const modalSettingsSelector = '#modal-root [data-modal-card] [data-action="open-settings"]';
    await waitForCondition(client, `Boolean(document.querySelector(${JSON.stringify(modalSettingsSelector)}))`, "compact More Settings control");
    await scrollSelectorIntoView(client, modalSettingsSelector);
    await dispatchVisibleMouseClick(client, modalSettingsSelector);
  }
  await waitForCondition(client, `Boolean(document.querySelector('#prototype-root [data-action="settings-related"][data-label="History"]'))`, "Settings History surface");
  await waitForInteractionSettled(client);
}

async function runNativeNegativeDiagnostics(client) {
  await prepareTwoAugustNativeNegatives(client);
  const records = [];
  records.push(await activateNativeNegative(client, {
    key: "day",
    label: "2 Aug native day History control",
    expectedText: "View day history",
    expression: `document.querySelector('#prototype-root .day-actions-section [data-action="view-provenance"]')`,
  }));
  records.push(await activateNativeNegative(client, {
    key: "item",
    label: "Before sleep native Source Item provenance control",
    expectedText: "Revisions & provenance",
    expression: `[...document.querySelectorAll("#prototype-root .journal-card")]
      .find((card) => card.querySelector("h3")?.textContent.replace(/\\s+/g, " ").trim() === "Before sleep — synthetic fixture")
      ?.querySelector('[data-action="view-provenance"]')`,
  }));
  const artworkSetup = await ensureTwoAugustArtworkControl(client);
  records.push(await activateNativeNegative(client, {
    key: "artwork",
    label: "2 Aug native Artwork versions control",
    expectedText: "View versions",
    expression: `document.querySelector('#prototype-root [data-action="view-art-history"]')`,
  }));

  const manageSelector = '#prototype-root [data-action="open-manage-reflection"]';
  await scrollSelectorIntoView(client, manageSelector);
  await dispatchVisibleMouseClick(client, manageSelector);
  await waitForCondition(client, `Boolean(document.querySelector("#modal-root .reflection-manage-row"))`, "Manage Reflection rows");
  const manageBefore = await evaluate(client, `(() => {
    const rows = [...document.querySelectorAll("#modal-root .reflection-manage-row")];
    const controls = rows.flatMap((row) => [...row.querySelectorAll("button")]);
    return {
      rowCount: rows.length,
      historyControlCount: controls.filter((control) => /history/i.test(control.textContent)).length,
      v18AttributeCount: controls.reduce((count, control) => count + [...control.attributes].filter((attribute) => attribute.name.startsWith("data-lid-v18")).length, 0),
    };
  })()`);
  records.push(await activateNativeNegative(client, {
    key: "field",
    label: "2 Aug native Summary edit control",
    expectedText: "Edit summary",
    expression: `document.querySelector('#modal-root .reflection-manage-row[data-field-row="summary"] [data-action="edit-generated"][data-field="summary"]')`,
    restoreSelector: '#modal-root [data-action="manage-back"]',
  }));
  if (manageBefore.rowCount !== 3 || manageBefore.historyControlCount !== 0 || manageBefore.v18AttributeCount !== 0) {
    fail(`Manage Reflection contains a v18 contextual injection: ${JSON.stringify(manageBefore)}`);
  }
  await waitForCondition(client, `Boolean(document.querySelector('#modal-root [data-action="close-modal"][aria-label="Close Manage reflection"]'))`, "Manage Reflection close control");
  await dispatchVisibleMouseClick(client, '#modal-root [data-action="close-modal"][aria-label="Close Manage reflection"]');
  await waitForInteractionSettled(client);

  const final = await evaluate(client, `(() => {
    const current = window.__LID_QA__.snapshot();
    const roots = [document.querySelector("#prototype-root"), document.querySelector("#modal-root")].filter(Boolean);
    return {
      activeFeature: document.querySelector("#lid-runtime-v17")?.dataset.activeFeature || null,
      inheritedContextPatchedCount: current.inheritedContextPatchedCount,
      nativeNegativeAnchors: current.nativeNegativeAnchors,
      otherInheritedV18OriginCount: roots.reduce((count, root) => count + root.querySelectorAll('[data-lid-v18-entry], [data-lid-v18-origin], [data-lid-v18-field], [data-lid-v18-canonical-entry], .lid-injected-history-v18').length, 0),
    };
  })()`);
  if (final.activeFeature !== null || final.inheritedContextPatchedCount !== 0 || final.otherInheritedV18OriginCount !== 0
    || final.nativeNegativeAnchors?.exactWhenRepresented !== true || final.nativeNegativeAnchors.manageReflectionHistoryCount !== 0) {
    fail(`native negative anchors are not exact after actual activation: ${JSON.stringify(final)}`);
  }
  return { identity: "2 August 2026 / Before sleep — synthetic fixture", artworkSetup, records, manageReflection: manageBefore, final };
}

async function openGlobalOriginSurface(client, originToken) {
  if (originToken === "settings") {
    await openSettingsSurface(client);
    return;
  }
  if (originToken === "more") {
    await scrollSelectorIntoView(client, '[data-action="open-more"]');
    await dispatchVisibleMouseClick(client, '[data-action="open-more"]');
    await waitForCondition(client, `Boolean(document.querySelector('#modal-root .more-management [data-action="settings-related"][data-label="History"]'))`, "compact More History origin");
    return;
  }
  fail(`unknown native Global origin: ${originToken}`);
}

async function runIneligibleGlobalOriginProbe(client, spec) {
  const before = await safeInteractionState(client);
  const accessibility = await accessibilityForSelector(client, spec.selector);
  const launcherAccessibility = spec.launcherSelector
    ? await accessibilityForSelector(client, spec.launcherSelector)
    : null;
  const observation = await evaluate(client, `(() => {
    const selector = ${JSON.stringify(spec.selector)};
    const trigger = document.querySelector(selector);
    if (!(trigger instanceof HTMLButtonElement)) throw new Error("ineligible origin probe control is missing");
    const launcher = ${spec.launcherSelector ? `document.querySelector(${JSON.stringify(spec.launcherSelector)})` : "null"};
    const snapshotBefore = window.__LID_QA__.snapshot();
    const focusBefore = document.activeElement;
    const scrollBefore = { x: scrollX, y: scrollY };
    const liveBefore = {
      polite: document.querySelector("#lid-status-v17")?.textContent || "",
      assertive: document.querySelector("#lid-alert-v17")?.textContent || "",
    };
    const shellBefore = {
      mainIdentity: document.querySelector("#prototype-main")?.className || null,
      modalChildCount: document.querySelector("#modal-root")?.childElementCount ?? null,
      nativeToastCount: document.querySelector("#toast-region")?.querySelectorAll(".toast").length ?? null,
    };
    const surface = (element) => {
      if (!(element instanceof HTMLElement)) return { present: false };
      const rectangle = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const center = { x: rectangle.left + rectangle.width / 2, y: rectangle.top + rectangle.height / 2 };
      const hit = rectangle.width > 0 && rectangle.height > 0 ? document.elementFromPoint(center.x, center.y) : null;
      return {
        present: true,
        connected: element.isConnected,
        enabled: !(element instanceof HTMLButtonElement && element.disabled) && element.getAttribute("aria-disabled") !== "true",
        rendered: Boolean(element.getClientRects().length && !element.hidden && !element.closest('[hidden], [inert], [aria-hidden="true"]')
          && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0),
        rectangle: { left: rectangle.left, top: rectangle.top, right: rectangle.right, bottom: rectangle.bottom, width: rectangle.width, height: rectangle.height },
        viewportVisible: rectangle.bottom > 0 && rectangle.right > 0 && rectangle.top < innerHeight && rectangle.left < innerWidth,
        centerHitWithinControl: Boolean(hit && (hit === element || element.contains(hit))),
        accessibleNameProxy: (element.getAttribute("aria-label") || element.textContent || "").replace(/\\s+/g, " ").trim(),
      };
    };
    const triggerBefore = surface(trigger);
    const launcherBefore = surface(launcher);
    let appBoundary = null;
    const observeAfterV18DocumentCapture = (eventObject) => {
      if (eventObject.target !== trigger) return;
      appBoundary = {
        defaultPrevented: eventObject.defaultPrevented,
        propagationStopped: eventObject.cancelBubble,
        activeFeature: document.querySelector("#lid-runtime-v17")?.dataset.activeFeature || null,
        appSnapshotUnchanged: JSON.stringify(window.__LID_QA__.snapshot()) === JSON.stringify(snapshotBefore),
        focusUnchanged: document.activeElement === focusBefore,
        scrollUnchanged: scrollX === scrollBefore.x && scrollY === scrollBefore.y,
        liveRegionsUnchanged: (document.querySelector("#lid-status-v17")?.textContent || "") === liveBefore.polite
          && (document.querySelector("#lid-alert-v17")?.textContent || "") === liveBefore.assertive,
        viewModalToastUnchanged: (document.querySelector("#prototype-main")?.className || null) === shellBefore.mainIdentity
          && (document.querySelector("#modal-root")?.childElementCount ?? null) === shellBefore.modalChildCount
          && (document.querySelector("#toast-region")?.querySelectorAll(".toast").length ?? null) === shellBefore.nativeToastCount,
        modalChildCount: document.querySelector("#modal-root")?.childElementCount ?? null,
        nativeToastCount: document.querySelector("#toast-region")?.querySelectorAll(".toast").length ?? null,
      };
    };
    document.addEventListener("click", observeAfterV18DocumentCapture, { capture: true, once: true });
    trigger.click();
    return {
      viewport: { width: innerWidth, height: innerHeight },
      moreOriginSurface: matchMedia("(max-width: 960px)").matches,
      compactFilterSurface: matchMedia("(max-width: 1023px)").matches,
      triggerBefore,
      launcherBefore,
      appBoundary,
      afterFrozenPassthrough: {
        activeFeature: document.querySelector("#lid-runtime-v17")?.dataset.activeFeature || null,
        appSnapshotUnchanged: JSON.stringify(window.__LID_QA__.snapshot()) === JSON.stringify(snapshotBefore),
        toastCount: document.querySelector("#toast-region")?.querySelectorAll(".toast").length ?? null,
        modalChildCount: document.querySelector("#modal-root")?.childElementCount ?? null,
      },
    };
  })()`);
  await waitForInteractionSettled(client);
  const after = await safeInteractionState(client);
  const exactAppBoundary = observation.appBoundary
    && observation.appBoundary.defaultPrevented === false
    && observation.appBoundary.propagationStopped === false
    && observation.appBoundary.activeFeature === null
    && observation.appBoundary.appSnapshotUnchanged === true
    && observation.appBoundary.focusUnchanged === true
    && observation.appBoundary.scrollUnchanged === true
    && observation.appBoundary.liveRegionsUnchanged === true
    && observation.appBoundary.viewModalToastUnchanged === true;
  const responsiveIneligible = spec.originToken === "settings"
    ? observation.viewport.width === spec.expectedWidth && observation.moreOriginSurface
      && observation.triggerBefore.connected && observation.triggerBefore.enabled && !observation.triggerBefore.rendered
      && !observation.triggerBefore.centerHitWithinControl && accessibility.axCount === 0
    : observation.viewport.width === spec.expectedWidth && !observation.moreOriginSurface
      && observation.launcherBefore.present && !observation.launcherBefore.rendered
      && !observation.launcherBefore.centerHitWithinControl && launcherAccessibility?.axCount === 0;
  if (!exactAppBoundary || !responsiveIneligible
    || observation.afterFrozenPassthrough.activeFeature !== null
    || observation.afterFrozenPassthrough.appSnapshotUnchanged !== true
    || before.snapshotSha256 !== after.snapshotSha256
    || before.summary.domain.currentSha256 !== after.summary.domain.currentSha256
    || Object.values(after.summary.counters).some((count) => count !== 0)) {
    fail(`ineligible ${spec.originToken} origin was not an exact V18 no-op before frozen passthrough: ${JSON.stringify({ spec, before, accessibility, launcherAccessibility, observation, after, exactAppBoundary, responsiveIneligible })}`);
  }
  const toastSettlement = observation.afterFrozenPassthrough.toastCount > 0
    ? await waitForNativeToastExpiry(client)
    : null;
  return {
    originToken: spec.originToken,
    viewport: observation.viewport,
    expectedWidth: spec.expectedWidth,
    moreOriginSurface: observation.moreOriginSurface,
    compactFilterSurface: observation.compactFilterSurface,
    responsiveIneligible,
    triggerBefore: observation.triggerBefore,
    launcherBefore: observation.launcherBefore,
    accessibility,
    launcherAccessibility,
    v18DocumentCaptureBoundary: observation.appBoundary,
    frozenPassthroughObservedWithoutSuppression: observation.afterFrozenPassthrough,
    nativeToastSettlement: toastSettlement,
    stateFocusScrollViewModalToastClaim: "V18 boundary only; frozen v16 passthrough is separately recorded and not suppressed",
    result: "PASS",
  };
}

async function resetOriginBreakpointRegressionPage(client, width) {
  if (![320, 960, 961, 1023].includes(width)) fail(`unsupported origin-breakpoint regression width: ${width}`);
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: width,
    screenHeight: 900,
    positionX: 0,
    positionY: 0,
    dontSetVisibleSize: false,
  });
  await client.send("Emulation.setVisibleSize", { width, height: 900 });
  const loaded = client.waitForEvent("Page.loadEventFired");
  await client.send("Page.reload", { ignoreCache: true });
  await loaded;
  await waitForQa(client);
  await waitForInteractionSettled(client);
  const environment = await inspectEvidenceEnvironment(client, `origin-breakpoint-${width}-fresh`);
  const responsive = await evaluate(client, `({
    moreOriginSurface: matchMedia("(max-width: 960px)").matches,
    compactFilterSurface: matchMedia("(max-width: 1023px)").matches,
  })`);
  const invariants = await evaluate(client, `window.__LID_QA__.runInvariants()`);
  if (environment.viewport.width !== width || environment.viewport.height !== 900
    || responsive.moreOriginSurface !== (width <= 960)
    || responsive.compactFilterSurface !== (width <= 1023)
    || !invariants?.pass) {
    fail(`origin-breakpoint regression reset is not exact: ${JSON.stringify({ width, environment, responsive, invariants })}`);
  }
  return {
    width,
    viewport: environment.viewport,
    moreOriginSurface: responsive.moreOriginSurface,
    compactFilterSurface: responsive.compactFilterSurface,
    appStateSha256: environment.appStateSha256,
    domain: environment.domain,
    counters: environment.counters,
    result: "PASS",
  };
}

async function stageBreakpointNegativeOrigin(client, originToken) {
  if (originToken === "settings") {
    await openSettingsSurface(client);
    return;
  }
  if (originToken === "more") {
    await evaluate(client, `document.querySelector('#prototype-root [data-action="open-more"]')?.click()`);
    await waitForCondition(client, `Boolean(document.querySelector('#modal-root .more-management [data-action="settings-related"][data-label="History"]'))`, "breakpoint-ineligible More History staging");
    await waitForInteractionSettled(client);
    return;
  }
  fail(`unknown breakpoint-negative origin: ${originToken}`);
}

async function runGlobalOriginBreakpointRegression(client) {
  const matrix = [
    { width: 960, positive: GLOBAL_ENTRY_SPECS[1], negativeToken: "settings" },
    { width: 961, positive: GLOBAL_ENTRY_SPECS[0], negativeToken: "more" },
    { width: 1023, positive: GLOBAL_ENTRY_SPECS[0], negativeToken: "more" },
  ];
  const records = [];
  for (const row of matrix) {
    const positiveSetup = await resetOriginBreakpointRegressionPage(client, row.width);
    await openGlobalOriginSurface(client, row.positive.originToken);
    const positiveStage = `origin-breakpoint-${row.width}-${row.positive.originToken}`;
    const positive = await runEntryRoundTrip(client, row.positive,
      `document.querySelector(${JSON.stringify(row.positive.selector)})`,
      "global",
      positiveStage,
      { width: row.width, height: 900, deviceScaleFactor: 1 },
      null,
      true,
    );

    const negativeSetup = await resetOriginBreakpointRegressionPage(client, row.width);
    await stageBreakpointNegativeOrigin(client, row.negativeToken);
    const negative = await runIneligibleGlobalOriginProbe(client, {
      originToken: row.negativeToken,
      expectedWidth: row.width,
      selector: row.negativeToken === "settings"
        ? '#prototype-root [data-action="settings-related"][data-label="History"]'
        : '#modal-root .more-management [data-action="settings-related"][data-label="History"]',
      ...(row.negativeToken === "more" ? { launcherSelector: '#prototype-root [data-action="open-more"]' } : {}),
    });
    const expectedPositive = row.width <= 960 ? "more" : "settings";
    const expectedNegative = row.width <= 960 ? "settings" : "more";
    if (row.positive.originToken !== expectedPositive || row.negativeToken !== expectedNegative
      || positive.originToken !== expectedPositive || positive.result !== "PASS"
      || Math.abs(positive.return.independentScrollDelta) > ORIGIN_RETURN_TOLERANCE_PX
      || Math.abs(positive.return.independentTopDelta) > ORIGIN_RETURN_TOLERANCE_PX
      || positive.return.app?.consumed !== true || negative.responsiveIneligible !== true
      || negative.v18DocumentCaptureBoundary?.defaultPrevented !== false
      || negative.v18DocumentCaptureBoundary?.propagationStopped !== false
      || negative.moreOriginSurface !== (row.width <= 960)
      || negative.compactFilterSurface !== true) {
      fail(`global origin breakpoint row failed: ${JSON.stringify({ row, positiveSetup, positive, negativeSetup, negative })}`);
    }
    records.push({
      width: row.width,
      globalOrigin: { positive: expectedPositive, negative: expectedNegative },
      filterPresentation: "compact",
      positiveSetup,
      positive,
      negativeSetup,
      negative,
      result: "PASS",
    });
  }
  const finalReset = await resetOriginBreakpointRegressionPage(client, 320);
  if (records.length !== 3 || !arraysEqual(records.map((record) => record.width), [960, 961, 1023])
    || !finalReset.moreOriginSurface || !finalReset.compactFilterSurface) {
    fail(`global origin breakpoint regression is incomplete: ${JSON.stringify({ records, finalReset })}`);
  }
  return {
    globalOriginBreakpoint: { moreMaxWidth: 960, settingsMinWidth: 961 },
    filterBreakpoint: { compactMaxWidth: 1023, wideMinWidth: 1024 },
    records,
    finalReset,
    frame16ViewportStagesUnchanged: true,
    result: "PASS",
  };
}

async function inspectCanonicalPanelGeometry(client) {
  const structure = await evaluate(client, `(() => {
    const panel = document.querySelector(${JSON.stringify(CANONICAL_PANEL_SELECTOR)});
    const prototypeRoot = document.querySelector("#prototype-root");
    const modalRoot = document.querySelector("#modal-root");
    const runtime = document.querySelector("#lid-runtime-v17");
    if (!(panel instanceof HTMLElement)) throw new Error("canonical entry panel is missing");
    const style = getComputedStyle(panel);
    const list = panel.querySelector(".lid-v18-canonical-entry-list");
    const listStyle = list ? getComputedStyle(list) : null;
    const rect = panel.getBoundingClientRect();
    const documentRect = (element) => {
      const value = element.getBoundingClientRect();
      return { left: value.left, right: value.right, top: value.top + scrollY, bottom: value.bottom + scrollY };
    };
    const panelDocumentRect = documentRect(panel);
    const overlaps = (left, right) => left.left < right.right && left.right > right.left && left.top < right.bottom && left.bottom > right.top;
    const buttonNodes = [...panel.querySelectorAll("button[data-lid-v18-canonical-entry]")];
    const buttonDocumentRects = buttonNodes.map(documentRect);
    return {
      panelCount: document.querySelectorAll(${JSON.stringify(CANONICAL_PANEL_SELECTOR)}).length,
      directBodyChild: panel.parentElement === document.body,
      afterPrototypeRoot: prototypeRoot?.nextElementSibling === panel,
      beforeModalRoot: panel.nextElementSibling === modalRoot,
      copy: {
        eyebrow: panel.querySelector(".lid-v18-canonical-entry-eyebrow")?.textContent.replace(/\\s+/g, " ").trim() || null,
        heading: panel.querySelector("#lid-v18-canonical-entry-title")?.textContent.replace(/\\s+/g, " ").trim() || null,
        body: panel.querySelector("#lid-v18-canonical-entry-description")?.textContent.replace(/\\s+/g, " ").trim() || null,
      },
      facts: [...panel.querySelectorAll("[data-lid-v18-canonical-fact]")].map((fact) => fact.textContent.replace(/\\s+/g, " ").trim()),
      buttons: buttonNodes.map((button) => ({
        id: button.id,
        token: button.dataset.lidV18CanonicalEntry,
        name: button.textContent.replace(/\\s+/g, " ").trim(),
        describedBy: button.getAttribute("aria-describedby"),
      })),
      geometry: {
        expectedWidth: Math.min(1128, innerWidth - 32),
        width: Math.round(rect.width * 1000) / 1000,
        widthDelta: Math.round((rect.width - Math.min(1128, innerWidth - 32)) * 1000) / 1000,
        documentTop: Math.round(panelDocumentRect.top * 1000) / 1000,
        documentBottom: Math.round(panelDocumentRect.bottom * 1000) / 1000,
        buttonOverlapCount: buttonDocumentRects.reduce((count, rectangle, index) => count + buttonDocumentRects.slice(index + 1).filter((other) => overlaps(rectangle, other)).length, 0),
        runtimeOverlap: runtime?.querySelector("#lid-feature-host-v17")?.getClientRects().length ? overlaps(panelDocumentRect, documentRect(runtime.querySelector("#lid-feature-host-v17"))) : false,
        prototypeRootOverlap: overlaps(panelDocumentRect, documentRect(prototypeRoot)),
        modalRootOverlap: modalRoot?.getClientRects().length ? overlaps(panelDocumentRect, documentRect(modalRoot)) : false,
        documentClientWidth: document.documentElement.clientWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        documentHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        panelClientWidth: panel.clientWidth,
        panelScrollWidth: panel.scrollWidth,
        panelHorizontalOverflow: panel.scrollWidth > panel.clientWidth + 1,
      },
      computedStyle: {
        display: style.display,
        position: style.position,
        width: style.width,
        maxWidth: style.maxWidth,
        marginBlockStart: style.marginBlockStart,
        marginBlockEnd: style.marginBlockEnd,
        gridTemplateColumns: listStyle?.gridTemplateColumns || null,
        gridColumnCount: (listStyle?.gridTemplateColumns || "").split(/\\s+/).filter(Boolean).length,
        forcedColorsActive: matchMedia("(forced-colors: active)").matches,
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      },
    };
  })()`);
  const expectedFacts = CANONICAL_ENTRY_SPECS.map((spec) => spec.fact);
  const expectedButtons = CANONICAL_ENTRY_SPECS.map((spec) => ({
    id: spec.id, token: spec.token, name: spec.name, describedBy: spec.describedBy,
  }));
  if (structure.panelCount !== 1 || !structure.directBodyChild || !structure.afterPrototypeRoot || !structure.beforeModalRoot
    || !arraysEqual(structure.copy, CANONICAL_ENTRY_COPY) || !arraysEqual(structure.facts, expectedFacts)
    || !arraysEqual(structure.buttons.map(({ id, token, name, describedBy }) => ({ id, token, name, describedBy })), expectedButtons)
    || Math.abs(structure.geometry.widthDelta) > 1
    || structure.geometry.buttonOverlapCount !== 0 || structure.geometry.runtimeOverlap || structure.geometry.prototypeRootOverlap
    || structure.geometry.modalRootOverlap || structure.geometry.documentHorizontalOverflow || structure.geometry.panelHorizontalOverflow
    || structure.computedStyle.position !== "static" || structure.computedStyle.gridColumnCount !== 1
    || !structure.computedStyle.forcedColorsActive || !structure.computedStyle.reducedMotion) {
    fail(`canonical panel structure, copy, or geometry is not exact: ${JSON.stringify(structure)}`);
  }

  const hitTests = [];
  for (const spec of CANONICAL_ENTRY_SPECS) {
    const objectId = await retainRemoteElement(client, `document.querySelector(${JSON.stringify(spec.selector)})`, `${spec.originToken} canonical geometry control`);
    try {
      await scrollRemoteIntoView(client, objectId);
      const observed = await inspectRemoteControl(client, objectId);
      const accessibility = await accessibilityForSelector(client, spec.selector);
      if (!observed.visible || !observed.enabled || !observed.minimum44By44 || !observed.allHitTestsWithinControl
        || observed.text !== spec.name || !accessibility.names.includes(spec.name)) {
        fail(`canonical ${spec.originToken} geometry/hit/AX acceptance failed: ${JSON.stringify({ observed, accessibility })}`);
      }
      hitTests.push({
        id: spec.id,
        name: spec.name,
        visible: observed.visible,
        enabled: observed.enabled,
        minimum44By44: observed.minimum44By44,
        rectangle: observed.rectangle,
        hitTests: observed.hitTests,
        axCount: accessibility.axCount,
        accessibleNames: accessibility.names,
      });
    } finally {
      await releaseRemote(client, objectId);
    }
  }
  const panelAccessibility = await accessibilityForSelector(client, CANONICAL_PANEL_SELECTOR);
  if (panelAccessibility.axCount === 0) fail("inactive canonical panel is absent from the accessibility tree");
  return { ...structure, accessibilityExposed: true, accessibility: panelAccessibility, hitTests };
}

async function setEvidenceViewport(client, width, height) {
  const transitionLabel = width === 1024 ? "initial-compact-to-settings-wide" : "settings-wide-to-restored-compact";
  if (height !== 900 || ![320, 1024].includes(width)) fail(`unsupported frame-16 evidence viewport: ${width}x${height}`);
  const before = await inspectEvidenceEnvironment(client, `${transitionLabel}-before-resize`);
  const expectedBeforeWidth = width === 1024 ? 320 : 1024;
  const priorRestorationRequired = width === 320;
  if (before.viewport.width !== expectedBeforeWidth || before.viewport.height !== 900
    || before.activeFeature !== null || before.entryReturn.pending !== null || !before.announcementEmpty
    || (priorRestorationRequired && before.entryReturn.lastRestorationConsumed !== true)
    || !before.domain.beforeEqualsCurrent || Object.values(before.counters).some((count) => count !== 0)) {
    fail(`evidence viewport resize boundary is not inactive and consumed: ${JSON.stringify(before)}`);
  }
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: width,
    screenHeight: height,
    positionX: 0,
    positionY: 0,
    dontSetVisibleSize: false,
  });
  await client.send("Emulation.setVisibleSize", { width, height });
  await waitForInteractionSettled(client);
  const after = await inspectEvidenceEnvironment(client, `${transitionLabel}-after-resize`);
  const stateUnchanged = before.appStateSha256 === after.appStateSha256
    && before.domain.beforeSha256 === after.domain.beforeSha256
    && before.domain.currentSha256 === after.domain.currentSha256
    && arraysEqual(before.emulatedMedia, after.emulatedMedia)
    && arraysEqual(before.entryReturn, after.entryReturn)
    && arraysEqual(before.navigation, after.navigation)
    && arraysEqual(before.storageCounts, after.storageCounts)
    && arraysEqual(before.counters, after.counters);
  if (after.viewport.width !== width || after.viewport.height !== height
    || after.viewport.devicePixelRatio !== 1 || after.viewport.deviceScaleFactor !== 1
    || after.activeFeature !== null || after.entryReturn.pending !== null || !after.announcementEmpty
    || (priorRestorationRequired && after.entryReturn.lastRestorationConsumed !== true)
    || !after.domain.beforeEqualsCurrent || Object.values(after.counters).some((count) => count !== 0)
    || !stateUnchanged) {
    fail(`evidence viewport did not settle as an environment-only transition: ${JSON.stringify({ before, after, stateUnchanged })}`);
  }
  return {
    transition: transitionLabel,
    kind: "environment-only CDP viewport change",
    requested: { width, height, deviceScaleFactor: 1 },
    before,
    after,
    responsiveGeometryEffect: {
      focusChanged: !arraysEqual(before.focus, after.focus),
      scrollXDelta: after.scroll.x - before.scroll.x,
      scrollYDelta: after.scroll.y - before.scroll.y,
    },
    appStateUnchanged: stateUnchanged,
    result: "PASS",
  };
}

async function observeArchiveViewport(client, label, width, height = 900) {
  const observed = await inspectEvidenceEnvironment(client, label);
  if (observed.viewport.width !== width || observed.viewport.height !== height
    || observed.viewport.devicePixelRatio !== 1 || observed.viewport.deviceScaleFactor !== 1) {
    fail(`archive viewport observation does not match ${width}x${height}: ${JSON.stringify(observed)}`);
  }
  return observed;
}

async function runCanonicalArchiveDiagnostics(client, freshInactive) {
  const originBreakpointRegression = await runGlobalOriginBreakpointRegression(client);
  const nativeNegative = await runNativeNegativeDiagnostics(client);
  const roundTrips = [];
  const resizeTransitions = [];
  const ineligibleOriginProbes = [];
  const compactProof = async (label, requireSettingsHistory) => {
    const dom = await evaluate(client, `(() => {
      const settingsHistory = document.querySelector('#prototype-root [data-action="settings-related"][data-label="History"]');
      const more = document.querySelector('#prototype-root [data-action="open-more"]');
      const panel = document.querySelector(${JSON.stringify(CANONICAL_PANEL_SELECTOR)});
      const list = panel?.querySelector('.lid-v18-canonical-entry-list');
      const focused = document.activeElement;
      const control = (element) => {
        if (!(element instanceof HTMLElement)) return { present: false, rendered: false, visible: false, enabled: false, centerHitWithinControl: false };
        const rectangle = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const rendered = Boolean(element.getClientRects().length && !element.hidden && !element.closest('[hidden], [inert]')
          && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0);
        const visible = rendered && rectangle.width > 0 && rectangle.height > 0
          && rectangle.bottom > 0 && rectangle.right > 0 && rectangle.top < innerHeight && rectangle.left < innerWidth;
        const hit = visible ? document.elementFromPoint(rectangle.left + rectangle.width / 2, rectangle.top + rectangle.height / 2) : null;
        return {
          present: true,
          rendered,
          visible,
          enabled: !(element instanceof HTMLButtonElement && element.disabled) && element.getAttribute('aria-disabled') !== 'true',
          centerHitWithinControl: Boolean(hit && (hit === element || element.contains(hit))),
          id: element.id || null,
          name: (element.getAttribute('aria-label') || element.textContent || '').replace(/\\s+/g, ' ').trim(),
        };
      };
      const gridTemplateColumns = list ? getComputedStyle(list).gridTemplateColumns : '';
      const focusRectangle = focused?.getBoundingClientRect?.();
      return {
        label: ${JSON.stringify(label)},
        viewport: { width: innerWidth, height: innerHeight, devicePixelRatio, deviceScaleFactor: devicePixelRatio },
        media: {
          reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
          forcedColorsActive: matchMedia('(forced-colors: active)').matches,
          colorSchemeLight: matchMedia('(prefers-color-scheme: light)').matches,
        },
        settingsHistory: control(settingsHistory),
        compactMore: control(more),
        panel: {
          present: panel instanceof HTMLElement,
          rendered: Boolean(panel?.getClientRects().length),
          gridTemplateColumns,
          gridColumnCount: gridTemplateColumns.split(/\\s+/).filter(Boolean).length,
          clientWidth: panel?.clientWidth ?? null,
          scrollWidth: panel?.scrollWidth ?? null,
          horizontalOverflow: panel ? panel.scrollWidth > panel.clientWidth + 1 : null,
        },
        documentOverflow: {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          horizontal: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        },
        finalFocus: focused?.id || null,
        focusVisible: Boolean(focusRectangle && focusRectangle.width > 0 && focusRectangle.height > 0
          && focusRectangle.bottom > 0 && focusRectangle.right > 0 && focusRectangle.top < innerHeight && focusRectangle.left < innerWidth),
      };
    })()`);
    const settingsAccessibility = await accessibilityForSelector(client, '#prototype-root [data-action="settings-related"][data-label="History"]');
    const moreAccessibility = await accessibilityForSelector(client, '#prototype-root [data-action="open-more"]');
    const pass = dom.viewport.width === 320 && dom.viewport.height === 900
      && dom.viewport.devicePixelRatio === 1 && dom.viewport.deviceScaleFactor === 1
      && dom.media.reducedMotion && dom.media.forcedColorsActive && dom.media.colorSchemeLight
      && dom.compactMore.present && dom.compactMore.visible && dom.compactMore.enabled && dom.compactMore.centerHitWithinControl
      && dom.compactMore.name === "More" && moreAccessibility.axCount > 0 && moreAccessibility.names.includes("More")
      && dom.panel.present && dom.panel.rendered && dom.panel.gridColumnCount === 1 && !dom.panel.horizontalOverflow
      && !dom.documentOverflow.horizontal
      && (!requireSettingsHistory || (dom.settingsHistory.present && !dom.settingsHistory.rendered && !dom.settingsHistory.visible
        && !dom.settingsHistory.centerHitWithinControl && settingsAccessibility.axCount === 0));
    if (!pass) fail(`compact responsive proof is not exact: ${JSON.stringify({ dom, settingsAccessibility, moreAccessibility, requireSettingsHistory })}`);
    return { ...dom, settingsAccessibility, moreAccessibility, result: "PASS" };
  };

  await openSettingsSurface(client);
  ineligibleOriginProbes.push(await runIneligibleGlobalOriginProbe(client, {
    originToken: "settings",
    expectedWidth: 320,
    selector: '#prototype-root [data-action="settings-related"][data-label="History"]',
  }));
  const initialObservation = await observeArchiveViewport(client, "initial-compact-before-wide-transition", 320);
  const initialResponsiveProof = await compactProof("initial-compact", true);
  resizeTransitions.push(await setEvidenceViewport(client, 1024, 900));
  await evaluate(client, `document.querySelector('#prototype-root [data-action="open-more"]').click()`);
  await waitForCondition(client, `Boolean(document.querySelector('#modal-root .more-management [data-action="settings-related"][data-label="History"]'))`, "wide ineligible More History staging");
  await waitForInteractionSettled(client);
  ineligibleOriginProbes.push(await runIneligibleGlobalOriginProbe(client, {
    originToken: "more",
    expectedWidth: 1024,
    selector: '#modal-root .more-management [data-action="settings-related"][data-label="History"]',
    launcherSelector: '#prototype-root [data-action="open-more"]',
  }));
  if (ineligibleOriginProbes.length !== 2
    || !arraysEqual(ineligibleOriginProbes.map((record) => record.originToken), ["settings", "more"])) {
    fail("frame 16 did not complete the exact hidden Settings and wide-ineligible More negative probes");
  }
  const settingsBefore = await observeArchiveViewport(client, "settings-wide-before-settings-trip", 1024);
  const settingsSpec = GLOBAL_ENTRY_SPECS[0];
  await openGlobalOriginSurface(client, settingsSpec.originToken);
  roundTrips.push(await runEntryRoundTrip(client, settingsSpec,
    `document.querySelector(${JSON.stringify(settingsSpec.selector)})`,
    "global",
    "settings-wide",
    { width: 1024, height: 900, deviceScaleFactor: 1 },
  ));
  const settingsAfter = await observeArchiveViewport(client, "settings-wide-after-settings-trip", 1024);

  resizeTransitions.push(await setEvidenceViewport(client, 320, 900));
  const restoredBefore = await observeArchiveViewport(client, "restored-compact-before-more-trip", 320);
  const moreSpec = GLOBAL_ENTRY_SPECS[1];
  await openGlobalOriginSurface(client, moreSpec.originToken);
  roundTrips.push(await runEntryRoundTrip(client, moreSpec,
    `document.querySelector(${JSON.stringify(moreSpec.selector)})`,
    "global",
    "restored-compact",
    { width: 320, height: 900, deviceScaleFactor: 1 },
  ));
  await scrollSelectorIntoView(client, '#modal-root [data-action="close-modal"]');
  await dispatchVisibleMouseClick(client, '#modal-root [data-action="close-modal"]');
  await waitForInteractionSettled(client);

  const surface = await inspectCanonicalPanelGeometry(client);
  let finalArtworkBaseline = null;
  for (const spec of CANONICAL_ENTRY_SPECS) {
    const stagedBaseline = spec.originToken === "artwork"
      ? await stageFinalArtworkOriginBaseline(client)
      : null;
    if (stagedBaseline) finalArtworkBaseline = stagedBaseline;
    roundTrips.push(await runEntryRoundTrip(client, spec,
      `document.querySelector(${JSON.stringify(spec.selector)})`,
      "canonical",
      "restored-compact",
      { width: 320, height: 900, deviceScaleFactor: 1 },
      stagedBaseline,
    ));
  }
  if (roundTrips.length !== 6 || !arraysEqual(roundTrips.map((record) => record.originKey), ARCHIVE_ORIGIN_TRANSCRIPT)) {
    fail("archive diagnostics did not execute the exact six governed origin round trips");
  }

  if (!finalArtworkBaseline) fail("frame 16 did not stage the final Artwork baseline");
  const nativeToastSettlement = await waitForNativeToastExpiry(client);

  const finalObservation = await observeArchiveViewport(client, "restored-compact-after-all-trips", 320);
  const finalResponsiveProof = await compactProof("restored-compact-final", true);
  const viewportStages = [
    {
      key: "initial-compact",
      requested: { width: 320, height: 900, deviceScaleFactor: 1 },
      observed: initialObservation.viewport,
      entryCondition: initialObservation,
      responsiveProof: initialResponsiveProof,
      completedOrigins: [],
    },
    {
      key: "settings-wide",
      requested: { width: 1024, height: 900, deviceScaleFactor: 1 },
      observed: settingsBefore.viewport,
      observations: { beforeSettingsTrip: settingsBefore, afterSettingsTrip: settingsAfter },
      completedOrigins: ["settings-global"],
    },
    {
      key: "restored-compact",
      requested: { width: 320, height: 900, deviceScaleFactor: 1 },
      observed: restoredBefore.viewport,
      observations: { beforeMoreTrip: restoredBefore, finalAfterAllTrips: finalObservation },
      responsiveProof: finalResponsiveProof,
      completedOrigins: ARCHIVE_ORIGIN_TRANSCRIPT.slice(1),
    },
  ];
  if (viewportStages.length !== VIEWPORT_STAGE_KEYS.length
    || !arraysEqual(viewportStages.map((stage) => stage.key), VIEWPORT_STAGE_KEYS)) {
    fail(`frame-16 viewportStages are not the exact closed Council sequence: ${JSON.stringify(viewportStages.map((stage) => stage.key))}`);
  }
  const allStageObservations = [initialObservation, settingsBefore, settingsAfter, restoredBefore, finalObservation];
  const stageDomainSha256 = allStageObservations[0].domain.currentSha256;
  if (allStageObservations.some((record) => !record.domain.beforeEqualsCurrent
    || record.domain.beforeSha256 !== stageDomainSha256 || record.domain.currentSha256 !== stageDomainSha256
    || record.activeFeature !== null || record.entryReturn.pending !== null || !record.announcementEmpty
    || record.viewport.devicePixelRatio !== 1 || record.viewport.deviceScaleFactor !== 1
    || !record.emulatedMedia.reducedMotion || !record.emulatedMedia.forcedColorsActive || !record.emulatedMedia.colorSchemeLight
    || Object.values(record.counters).some((count) => count !== 0))) {
    fail(`viewportStages changed state, media, density, domain, or counters: ${JSON.stringify(allStageObservations)}`);
  }
  if (settingsAfter.entryReturn.lastRestorationConsumed !== true
    || restoredBefore.entryReturn.lastRestorationConsumed !== true
    || finalObservation.entryReturn.lastRestorationConsumed !== true
    || resizeTransitions.length !== 2 || resizeTransitions.some((transition) => transition.result !== "PASS" || !transition.appStateUnchanged)) {
    fail(`viewport stage transitions were not inactive, fully consumed, and state-neutral: ${JSON.stringify(resizeTransitions)}`);
  }

  const finalState = await evaluate(client, `(() => {
    const current = window.__LID_QA__.snapshot();
    const focused = document.activeElement;
    const panel = document.querySelector(${JSON.stringify(CANONICAL_PANEL_SELECTOR)});
    const list = panel?.querySelector('.lid-v18-canonical-entry-list');
    const gridTemplateColumns = list ? getComputedStyle(list).gridTemplateColumns : '';
    const settingsHistory = document.querySelector('#prototype-root [data-action="settings-related"][data-label="History"]');
    const compactMoreHistorySelector = '#modal-root .more-management [data-action="settings-related"][data-label="History"]';
    const rectangle = focused?.getBoundingClientRect?.();
    const roots = [document.querySelector("#prototype-root"), document.querySelector("#modal-root")].filter(Boolean);
    return {
      activeFeature: document.querySelector("#lid-runtime-v17")?.dataset.activeFeature || null,
      viewport: { width: innerWidth, height: innerHeight, devicePixelRatio, deviceScaleFactor: devicePixelRatio },
      media: {
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        forcedColorsActive: matchMedia('(forced-colors: active)').matches,
        colorSchemeLight: matchMedia('(prefers-color-scheme: light)').matches,
      },
      fixture: current.fixture,
      scope: current.scope,
      pending: current.entryReturn?.pending ? "present" : null,
      consumed: current.entryReturn?.lastRestoration?.consumed ?? null,
      announcementEmpty: current.announcement === "",
      finalFocus: focused?.id || null,
      focusVisible: Boolean(rectangle && rectangle.width > 0 && rectangle.height > 0 && rectangle.bottom > 0 && rectangle.top < innerHeight),
      panelVisible: Boolean(panel?.getClientRects().length),
      gridTemplateColumns,
      gridColumnCount: gridTemplateColumns.split(/\\s+/).filter(Boolean).length,
      horizontalOverflow: {
        document: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        panel: panel ? panel.scrollWidth > panel.clientWidth + 1 : null,
      },
      settingsHistoryPresent: settingsHistory instanceof HTMLElement,
      settingsHistoryRendered: Boolean(settingsHistory?.getClientRects().length),
      compactMoreHistorySelector,
      inheritedContextPatchedCount: current.inheritedContextPatchedCount,
      otherInheritedV18OriginCount: roots.reduce((count, root) => count + root.querySelectorAll('[data-lid-v18-entry], [data-lid-v18-origin], [data-lid-v18-field], [data-lid-v18-canonical-entry], .lid-injected-history-v18').length, 0),
      launcherUserSurfaceAbsent: current.launcherUserSurfaceAbsent,
      nativeGlobalOriginTokens: ${JSON.stringify(GLOBAL_ORIGIN_TOKENS)},
      counters: {
        mutationIntents: current.mutationIntents,
        mutationEffects: current.mutationEffects,
        providerRequests: current.providerRequests,
      },
      domainPair: { before: current.preOpenDomainFingerprint, current: current.currentDomainFingerprint },
    };
  })()`);
  finalState.domain = digestDomainPair(finalState.domainPair);
  delete finalState.domainPair;
  const finalSettingsAccessibility = await accessibilityForSelector(client, '#prototype-root [data-action="settings-related"][data-label="History"]');
  const finalMoreAccessibility = await accessibilityForSelector(client, '#prototype-root [data-action="open-more"]');
  const moreRoundTrip = roundTrips.find((record) => record.originKey === "more-global");
  const launcher = await launcherRetirementDiagnostics(client);
  const finalCaptureSafety = await inspectFinalCanonicalCaptureSafety(client);
  if (finalState.activeFeature !== null
    || finalState.viewport.width !== 320 || finalState.viewport.height !== 900
    || finalState.viewport.devicePixelRatio !== 1 || finalState.viewport.deviceScaleFactor !== 1
    || !finalState.media.reducedMotion || !finalState.media.forcedColorsActive || !finalState.media.colorSchemeLight
    || finalState.fixture !== "artwork-ready" || finalState.scope !== "artwork"
    || finalState.pending !== null || finalState.consumed !== true || !finalState.announcementEmpty
    || finalState.finalFocus !== "lid-v18-canonical-entry-artwork" || !finalState.focusVisible || !finalState.panelVisible
    || finalState.gridColumnCount !== 1 || finalState.horizontalOverflow.document || finalState.horizontalOverflow.panel
    || !finalState.settingsHistoryPresent || finalState.settingsHistoryRendered || finalSettingsAccessibility.axCount !== 0
    || !finalResponsiveProof.compactMore.visible || !finalResponsiveProof.compactMore.enabled
    || !finalResponsiveProof.compactMore.centerHitWithinControl || finalMoreAccessibility.axCount === 0
    || !moreRoundTrip || moreRoundTrip.viewportStage !== "restored-compact"
    || moreRoundTrip.originBefore.viewport.width !== 320 || moreRoundTrip.accessibility.before.axCount === 0
    || finalState.inheritedContextPatchedCount !== 0 || finalState.otherInheritedV18OriginCount !== 0
    || finalState.launcherUserSurfaceAbsent !== true || !arraysEqual(finalState.nativeGlobalOriginTokens, GLOBAL_ORIGIN_TOKENS)
    || Object.values(finalState.counters).some((count) => count !== 0) || !finalState.domain.beforeEqualsCurrent) {
    fail(`final canonical archive state is not exact: ${JSON.stringify(finalState)}`);
  }
  return {
    canonicalEntry: {
      ...surface,
      roundTrips,
      viewportStages,
      viewportProcedure: {
        kind: "environment-only responsive exposure; never fixture/scenario state",
        settingsProofViewport: { width: 1024, height: 900, scaleFactor: 1 },
        restoredCaptureViewport: { width: 320, height: 900, scaleFactor: 1 },
        resizeTransitions,
      },
      inheritedContextPatchedCount: finalState.inheritedContextPatchedCount,
      nativeGlobalOriginTokens: finalState.nativeGlobalOriginTokens,
      otherInheritedV18OriginCount: finalState.otherInheritedV18OriginCount,
      originBreakpointRegression,
      nativeNegative,
      ineligibleOriginProbes,
      finalArtworkBaseline,
      nativeToastSettlement,
      finalCaptureSafety,
      launcherUserSurfaceAbsent: true,
      launcher,
      freshInactive,
      finalState,
      finalFocus: finalState.finalFocus,
      result: "PASS",
    },
  };
}

function pngDimensions(buffer) {
  const signature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== signature || buffer.subarray(12, 16).toString("ascii") !== "IHDR") {
    fail("Chrome returned data that is not a valid PNG");
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

async function stopChrome(child) {
  if (!child || child.exitCode !== null) return;
  child.kill("SIGTERM");
  try {
    await Promise.race([
      new Promise((resolveExit) => child.once("exit", resolveExit)),
      timeoutPromise(3_000, "Chrome shutdown timeout"),
    ]);
  } catch {
    child.kill("SIGKILL");
    await Promise.race([
      new Promise((resolveExit) => child.once("exit", resolveExit)),
      timeoutPromise(3_000, "Chrome kill timeout"),
    ]).catch(() => {});
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage);
    return;
  }
  const driverBytes = await readFile(new URL(import.meta.url));
  const driverSha256 = createHash("sha256").update(driverBytes).digest("hex");

  const chromePath = await findChrome();
  const debugPort = await reservePort();
  const profile = await mkdtemp(resolve(tmpdir(), PROFILE_PREFIX));
  let chrome = null;
  let client = null;
  let captureError = null;

  try {
    const chromeArguments = [
      "--headless=new",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-domain-reliability",
      "--disable-features=OptimizationHints,MediaRouter",
      "--disable-sync",
      "--metrics-recording-only",
      "--no-default-browser-check",
      "--no-first-run",
      "--password-store=basic",
      `--remote-debugging-address=127.0.0.1`,
      `--remote-debugging-port=${debugPort}`,
      "--remote-allow-origins=*",
      `--user-data-dir=${profile}`,
      "about:blank",
    ];
    chrome = spawn(chromePath, chromeArguments, { stdio: ["ignore", "ignore", "pipe"] });
    let chromeStderr = "";
    chrome.stderr.on("data", (chunk) => {
      if (chromeStderr.length < 8_000) chromeStderr += chunk.toString("utf8").slice(0, 8_000 - chromeStderr.length);
    });

    await waitForJson(`http://127.0.0.1:${debugPort}/json/version`, chrome, DEFAULT_TIMEOUT_MS);
    const targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`, chrome, DEFAULT_TIMEOUT_MS);
    const pageTarget = targets.find((target) => target.type === "page" && target.webSocketDebuggerUrl);
    if (!pageTarget) fail("Chrome did not expose a page target");

    client = new CdpClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    const consoleEvents = [];
    const exceptionEvents = [];
    const networkRequests = [];
    client.on("Runtime.consoleAPICalled", (event) => {
      consoleEvents.push({
        type: event.type,
        timestamp: event.timestamp,
        executionContextId: event.executionContextId,
        text: (event.args || []).map(scalarConsoleValue).join(" ").slice(0, 2_000),
      });
    });
    client.on("Runtime.exceptionThrown", (event) => {
      const details = event.exceptionDetails || {};
      exceptionEvents.push({
        timestamp: event.timestamp,
        text: String(details.text || "Uncaught exception").slice(0, 1_000),
        url: String(details.url || "").slice(0, 2_000),
        lineNumber: details.lineNumber ?? null,
        columnNumber: details.columnNumber ?? null,
        description: String(details.exception?.description || "").slice(0, 4_000),
      });
    });
    client.on("Network.requestWillBeSent", (event) => {
      networkRequests.push({
        requestId: event.requestId,
        url: event.request?.url || "",
        method: event.request?.method || "",
        type: event.type || null,
      });
    });

    await Promise.all([
      client.send("Page.enable"),
      client.send("Runtime.enable"),
      client.send("Network.enable"),
      client.send("Log.enable"),
      client.send("DOM.enable"),
      client.send("Accessibility.enable"),
    ]);
    await client.send("Network.setCacheDisabled", { cacheDisabled: true });
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: options.width,
      height: options.height,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: options.width,
      screenHeight: options.height,
      positionX: 0,
      positionY: 0,
      dontSetVisibleSize: false,
    });
    await client.send("Emulation.setVisibleSize", { width: options.width, height: options.height });
    const emulatedMediaFeatures = [];
    if (options.motion) emulatedMediaFeatures.push({ name: "prefers-reduced-motion", value: options.motion });
    if (options.forcedColors) emulatedMediaFeatures.push({ name: "forced-colors", value: options.forcedColors });
    if (options.view === "archive" && options.theme) emulatedMediaFeatures.push({ name: "prefers-color-scheme", value: options.theme });
    if (emulatedMediaFeatures.length) {
      await client.send("Emulation.setEmulatedMedia", { media: "screen", features: emulatedMediaFeatures });
    }
    await client.send("Page.bringToFront");

    const loaded = client.waitForEvent("Page.loadEventFired");
    const navigation = await client.send("Page.navigate", { url: options.url });
    if (navigation.errorText) fail(`navigation failed: ${navigation.errorText}`);
    await loaded;
    await waitForQa(client);

    const freshInactive = await inspectFreshInactiveState(client);
    const manifest = await evaluate(client, `window.__LID_QA__.manifest()`);
    const expectedLoadedVersions = [17, 18];
    if (manifest?.version !== options.targetVersion
      || !Array.isArray(manifest.loadedVersions)
      || JSON.stringify(manifest.loadedVersions) !== JSON.stringify(expectedLoadedVersions)) {
      fail("the loaded QA manifest is not the exact cumulative v17-v18 chain");
    }
    if (!arraysEqual(manifest.fixtures, REQUIRED_FIXTURES)) {
      fail("manifest.fixtures is not the exact ordered fourteen-fixture v18 allowlist");
    }
    if (!arraysEqual(manifest.captureScenarios, CAPTURE_SCENARIOS)) {
      fail("manifest.captureScenarios is not the exact ordered v18 scenario allowlist");
    }
    if (manifest.captureScenarios.some((scenario) => manifest.fixtures.includes(scenario))) {
      fail("manifest.captureScenarios must remain disjoint from manifest.fixtures");
    }
    if (!arraysEqual(manifest.captureScenarioActions, CAPTURE_SCENARIO_ACTIONS)) {
      fail("manifest.captureScenarioActions is not the exact visible-control-equivalent v18 transition contract");
    }

    let entrySetup = null;
    let scenarioEvidence = null;
    let qa2PaginationRegression = null;
    let selectorEvidence = null;
    let archiveDiagnostics = null;
    let framingEvidence = null;
    let invariants = null;
    let snapshot = null;

    if (options.view === "active") {
      const requestedFixture = options.scenario ? "global-ready" : options.fixture;
      entrySetup = await openGovernedEntryForCapture(client, requestedFixture);
      const activeFeature = await evaluate(client, `document.querySelector("#lid-runtime-v17")?.dataset.activeFeature || null`);
      if (activeFeature !== manifest.qaFeature || activeFeature !== `v${options.targetVersion}`) {
        fail(`v${options.targetVersion} did not activate through its governed visible entry`);
      }
      await evaluate(client, `window.__LID_QA__.setFixture(${JSON.stringify(requestedFixture)})`);
      if (options.theme) {
        const selectedTheme = await evaluate(client, `(() => {
          const before = window.__LID_QA__.snapshot();
          if (before.theme !== ${JSON.stringify(options.theme)}) window.__LID_QA__.dispatch("toggle-theme");
          return window.__LID_QA__.snapshot().theme;
        })()`);
        if (selectedTheme !== options.theme) fail(`the QA API could not select the ${options.theme} theme`);
      }
      if (options.scenario === "pagination-both-success") {
        qa2PaginationRegression = await runQa2PaginationRegression(client);
      }
      if (options.scenario) scenarioEvidence = await runScenario(client, options.scenario);
      await waitForRender(client);

      const itemReadySelectorBefore = options.fixture === "item-ready"
        && [ITEM_READY_FRAME_SELECTOR, ITEM_READY_FRAME_SUMMARY_SELECTOR].includes(options.selector)
        ? await inspectItemReadyFrameState(client)
        : null;
      if (options.selector) {
        selectorEvidence = await scrollSelectorIntoView(client, options.selector);
        if (itemReadySelectorBefore) {
          selectorEvidence.entryContract = await finishItemReadySelectorEvidence(client, itemReadySelectorBefore, selectorEvidence);
        }
      }

      invariants = await evaluate(client, `window.__LID_QA__.runInvariants()`);
      snapshot = await evaluate(client, `window.__LID_QA__.snapshot()`);
      if (!invariants?.pass) fail(`v${options.targetVersion} QA invariants did not pass while active`);
      if (snapshot?.version !== options.targetVersion) fail(`v${options.targetVersion} QA snapshot is missing or incompatible`);
      if (options.fixture && snapshot.fixture !== options.fixture) fail("the requested fixture was not selected");
      if (options.scenario && snapshot.fixture !== "global-ready") fail("the scenario did not retain its exact global-ready seed identity");
      if (options.theme && snapshot.theme !== options.theme) fail("the requested theme was not selected");
      framingEvidence = await runPassivePreCaptureFraming(client, options);
    } else {
      const freshInvariants = await evaluate(client, `window.__LID_QA__.runInvariants()`);
      if (!freshInvariants?.pass) {
        const failures = (freshInvariants?.assertions || []).filter((assertion) => !assertion.pass).map((assertion) => assertion.name);
        fail(`v${options.targetVersion} fresh inactive invariants did not pass: ${JSON.stringify(failures)}`);
      }
      archiveDiagnostics = await runCanonicalArchiveDiagnostics(client, freshInactive);
      invariants = await evaluate(client, `window.__LID_QA__.runInvariants()`);
      snapshot = await evaluate(client, `window.__LID_QA__.snapshot()`);
      if (!invariants?.pass) {
        const failures = (invariants?.assertions || []).filter((assertion) => !assertion.pass).map((assertion) => assertion.name);
        fail(`v${options.targetVersion} final inactive canonical-entry invariants did not pass: ${JSON.stringify(failures)}`);
      }
      if (snapshot?.version !== options.targetVersion || snapshot.fixture !== "artwork-ready" || snapshot.scope !== "artwork") {
        fail(`v${options.targetVersion} final inactive archive snapshot is not exact`);
      }
      if (options.theme && snapshot.theme !== options.theme) fail("the archive snapshot does not match the requested inherited theme");
    }

    const pageState = await evaluate(client, `(async () => {
      const root = document.documentElement;
      const body = document.body;
      const host = document.querySelector("#lid-feature-host-v17");
      const registrations = navigator.serviceWorker ? await navigator.serviceWorker.getRegistrations() : [];
      const databaseList = indexedDB.databases ? await indexedDB.databases() : [];
      const cacheNames = globalThis.caches ? await caches.keys() : [];
      const opfs = {
        supported: Boolean(navigator.storage && typeof navigator.storage.getDirectory === "function"),
        accessible: null,
        entryCount: null,
        errorName: null,
      };
      if (opfs.supported) {
        try {
          const rootDirectory = await navigator.storage.getDirectory();
          let entryCount = 0;
          for await (const unusedHandle of rootDirectory.values()) {
            void unusedHandle;
            entryCount += 1;
          }
          opfs.accessible = true;
          opfs.entryCount = entryCount;
        } catch (error) {
          opfs.accessible = false;
          opfs.errorName = String(error?.name || "Error").slice(0, 100);
        }
      }
      return {
        title: document.title,
        url: {
          generic: location.origin + location.pathname,
          origin: location.origin,
          pathname: location.pathname,
          hasQuery: Boolean(location.search),
          hasHash: Boolean(location.hash),
        },
        history: {
          length: history.length,
          state: history.state === null ? null : "[non-null state redacted]",
          stateType: history.state === null ? "null" : (Array.isArray(history.state) ? "array" : typeof history.state),
        },
        viewport: {
          innerWidth,
          innerHeight,
          devicePixelRatio,
          visualWidth: visualViewport ? visualViewport.width : null,
          visualHeight: visualViewport ? visualViewport.height : null,
          scrollX,
          scrollY,
        },
        media: {
          reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
          motionNoPreference: matchMedia("(prefers-reduced-motion: no-preference)").matches,
          forcedColorsActive: matchMedia("(forced-colors: active)").matches,
          forcedColorsNone: matchMedia("(forced-colors: none)").matches,
          colorSchemeLight: matchMedia("(prefers-color-scheme: light)").matches,
          colorSchemeDark: matchMedia("(prefers-color-scheme: dark)").matches,
        },
        overflow: {
          documentClientWidth: root.clientWidth,
          documentScrollWidth: root.scrollWidth,
          documentDelta: root.scrollWidth - root.clientWidth,
          documentHorizontal: root.scrollWidth > root.clientWidth + 1,
          bodyClientWidth: body ? body.clientWidth : null,
          bodyScrollWidth: body ? body.scrollWidth : null,
          bodyHorizontal: body ? body.scrollWidth > body.clientWidth + 1 : null,
          featureClientWidth: host ? host.clientWidth : null,
          featureScrollWidth: host ? host.scrollWidth : null,
          featureHorizontal: host ? host.scrollWidth > host.clientWidth + 1 : null,
        },
        storageCounts: {
          localStorage: localStorage.length,
          sessionStorage: sessionStorage.length,
          indexedDB: databaseList.length,
          caches: cacheNames.length,
          serviceWorkers: registrations.length,
        },
        opfs,
      };
    })()`);

    if (pageState.title !== "Life in Days" || pageState.url.hasQuery || pageState.url.hasHash || pageState.history.state !== null) {
      fail("page title, URL, or history state is not generic");
    }
    if (pageState.viewport.innerWidth !== options.width || pageState.viewport.innerHeight !== options.height) {
      fail(`Chrome viewport is ${pageState.viewport.innerWidth}x${pageState.viewport.innerHeight}, expected ${options.width}x${options.height}`);
    }
    if (options.motion === "reduce" && (!pageState.media.reducedMotion || pageState.media.motionNoPreference)) {
      fail("observed prefers-reduced-motion does not match --motion reduce");
    }
    if (options.motion === "no-preference" && (pageState.media.reducedMotion || !pageState.media.motionNoPreference)) {
      fail("observed prefers-reduced-motion does not match --motion no-preference");
    }
    if (options.forcedColors === "active" && (!pageState.media.forcedColorsActive || pageState.media.forcedColorsNone)) {
      fail("observed forced-colors does not match --forced-colors active");
    }
    if (options.forcedColors === "none" && (pageState.media.forcedColorsActive || !pageState.media.forcedColorsNone)) {
      fail("observed forced-colors does not match --forced-colors none");
    }
    if (options.view === "archive" && options.theme === "light" && (!pageState.media.colorSchemeLight || pageState.media.colorSchemeDark)) {
      fail("observed inherited-archive color scheme does not match --theme light");
    }
    if (options.view === "archive" && options.theme === "dark" && (pageState.media.colorSchemeLight || !pageState.media.colorSchemeDark)) {
      fail("observed inherited-archive color scheme does not match --theme dark");
    }
    if (pageState.overflow.documentHorizontal || pageState.overflow.bodyHorizontal || pageState.overflow.featureHorizontal) fail("horizontal overflow detected");
    if (exceptionEvents.length) fail(`captured ${exceptionEvents.length} browser exception event(s)`);
    if (consoleEvents.length) fail(`captured ${consoleEvents.length} browser console event(s)`);
    const diagnosticsText = JSON.stringify({ consoleEvents, exceptionEvents });
    if (FORBIDDEN_SOURCE_CONTEXT_PROSE.some((prose) => diagnosticsText.includes(prose))) {
      fail("captured diagnostics contain protected fictional source prose");
    }
    if (Object.values(pageState.storageCounts).some((count) => count !== 0)) {
      fail("the isolated evidence profile contains browser storage, database, cache, or service-worker state");
    }
    if (!pageState.opfs.supported) {
      fail("OPFS inspection is unavailable in the evidence browser");
    }
    if (pageState.opfs.accessible !== true) {
      fail(`OPFS inspection failed unexpectedly: ${pageState.opfs.errorName || "unknown error"}`);
    }
    if (pageState.opfs.entryCount !== 0) {
      fail(`the isolated evidence profile contains ${pageState.opfs.entryCount} OPFS root entr${pageState.opfs.entryCount === 1 ? "y" : "ies"}`);
    }
    const disallowedRequests = networkRequests.filter((request) => {
      try {
        const requestUrl = new URL(request.url);
        return requestUrl.protocol !== "data:"
          && !(requestUrl.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(requestUrl.hostname));
      } catch {
        return true;
      }
    });
    if (disallowedRequests.length) fail(`captured ${disallowedRequests.length} request(s) outside localhost/data`);

    const privacyAssertions = [
      {
        name: "Generic title, query-free path, and null private history payload",
        pass: pageState.title === "Life in Days" && !pageState.url.hasQuery && !pageState.url.hasHash && pageState.history.state === null,
      },
      {
        name: "Zero local, session, IndexedDB, Cache Storage, and service-worker state",
        pass: Object.values(pageState.storageCounts).every((count) => count === 0),
      },
      {
        name: "OPFS inspection is supported, accessible, and has zero root entries",
        pass: pageState.opfs.supported === true && pageState.opfs.accessible === true && pageState.opfs.entryCount === 0,
        observation: { ...pageState.opfs },
      },
      {
        name: "All captured requests remain on localhost or data URLs",
        pass: disallowedRequests.length === 0,
      },
      {
        name: "Zero console and browser exception events",
        pass: consoleEvents.length === 0 && exceptionEvents.length === 0,
      },
      {
        name: "Protected fictional source prose is absent from diagnostics",
        pass: FORBIDDEN_SOURCE_CONTEXT_PROSE.every((prose) => !diagnosticsText.includes(prose)),
      },
    ];
    if (privacyAssertions.some((assertion) => !assertion.pass)) fail("one or more evidence privacy assertions failed");

    const screenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    if (!screenshot.data) fail("Chrome did not return screenshot data");
    const png = Buffer.from(screenshot.data, "base64");
    const dimensions = pngDimensions(png);
    if (dimensions.width !== options.width || dimensions.height !== options.height) {
      fail(`PNG is ${dimensions.width}x${dimensions.height}, expected ${options.width}x${options.height}`);
    }
    const pngSha256 = createHash("sha256").update(png).digest("hex");

    const metadata = {
      schemaVersion: 1,
      tool: DRIVER_BASENAME,
      toolVersion: TOOL_VERSION,
      driver: {
        file: DRIVER_BASENAME,
        sha256: driverSha256,
        toolVersion: TOOL_VERSION,
      },
      targetVersion: options.targetVersion,
      capturedAt: new Date().toISOString(),
      capture: {
        requestedUrl: options.url,
        view: options.view,
        viewport: { width: options.width, height: options.height, scaleFactor: 1 },
        fixture: options.fixture,
        scenario: options.scenario,
        seedFixture: options.scenario ? "global-ready" : options.fixture,
        theme: options.theme,
        media: {
          requested: { motion: options.motion, forcedColors: options.forcedColors },
          observed: pageState.media,
        },
        governedEntrySetup: entrySetup,
        selector: selectorEvidence,
        framing: framingEvidence,
        png: { file: basename(options.out), width: dimensions.width, height: dimensions.height, bytes: png.length, sha256: pngSha256 },
      },
      page: {
        title: pageState.title,
        url: pageState.url,
        history: pageState.history,
      },
      qa: {
        manifest,
        freshInactive,
        invariants,
        snapshotSha256: valueSha256(safeSnapshotSummary(snapshot)),
        snapshotSummary: safeSnapshotSummary(snapshot),
        qa2PaginationRegression,
      },
      scenario: scenarioEvidence,
      archiveDiagnostics,
      viewport: pageState.viewport,
      overflow: pageState.overflow,
      browserState: {
        ...pageState.storageCounts,
        opfs: pageState.opfs,
      },
      privacyAssertions,
      events: {
        console: consoleEvents,
        exceptions: exceptionEvents,
        networkRequests,
      },
    };

    const metadataJson = `${JSON.stringify(metadata, null, 2)}\n`;
    if (FORBIDDEN_SOURCE_CONTEXT_PROSE.some((prose) => metadataJson.includes(prose))) {
      fail("refusing to write sidecar metadata containing protected fictional source prose");
    }
    await mkdir(dirname(options.out), { recursive: true });
    await mkdir(dirname(options.meta), { recursive: true });
    await writeFile(options.out, png);
    await writeFile(options.meta, metadataJson, "utf8");
    process.stdout.write(`${JSON.stringify({
      result: "PASS",
      targetVersion: options.targetVersion,
      view: options.view,
      png: basename(options.out),
      meta: basename(options.meta),
      dimensions,
      sha256: pngSha256,
      fixture: snapshot.fixture,
      scenario: options.scenario,
      theme: snapshot.theme,
      selector: selectorEvidence?.selector || null,
      invariants: invariants.assertions?.length || 0,
      requests: networkRequests.length,
      consoleEvents: consoleEvents.length,
      exceptionEvents: exceptionEvents.length,
    })}\n`);
  } catch (error) {
    captureError = error;
  } finally {
    client?.close();
    await stopChrome(chrome).catch((error) => {
      captureError ||= error;
    });
    const expectedPrefix = resolve(tmpdir(), PROFILE_PREFIX);
    if (!resolve(profile).startsWith(expectedPrefix) || !basename(profile).startsWith(PROFILE_PREFIX)) {
      captureError ||= new Error("refusing to clean an unexpected Chrome profile path");
    } else {
      await rm(profile, { recursive: true, force: true }).catch((error) => {
        captureError ||= new Error(`could not clean the exact temporary Chrome profile: ${error.message}`);
      });
    }
  }

  if (captureError) throw captureError;
}

main().catch((error) => {
  process.stderr.write(`capture-phase2-evidence-v18: FAIL\n${error.message}\n`);
  process.exitCode = 1;
});
