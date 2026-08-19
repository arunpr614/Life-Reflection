#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { createServer } from "node:net";
import { basename, dirname, extname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

const TOOL_VERSION = 17;
const PROFILE_PREFIX = "life-in-days-v17-evidence-";
const DEFAULT_TIMEOUT_MS = 15_000;
const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
];

const usage = `Usage:
  node capture-phase2-evidence-v17.mjs \\
    --url http://127.0.0.1:4317/index-v17.html \\
    --out /absolute/path/evidence.png \\
    --meta /absolute/path/evidence.json \\
    [--width 1440] [--height 900] \\
    [--view active|archive] \\
    [--fixture ready] [--theme light|dark] [--selector '#operation-controls'] \\
    [--motion reduce|no-preference] [--forced-colors active|none]

The URL must be a query-free localhost index-vN.html route for N=17..35. The
helper uses a fresh Chrome profile, browser-memory QA controls, and a device
scale factor of 1. Its own frozen implementation version remains 17.
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
  const allowed = new Set(["--url", "--out", "--meta", "--width", "--height", "--view", "--fixture", "--theme", "--selector", "--motion", "--forced-colors"]);
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
  const versionMatch = url.pathname.match(/(?:^|\/)index-v(\d+)\.html$/);
  if (!versionMatch) fail("--url must target index-vN.html");
  const targetVersion = Number(versionMatch[1]);
  if (!Number.isSafeInteger(targetVersion) || targetVersion < 17 || targetVersion > 35) {
    fail("--url prototype version must be between 17 and 35");
  }

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
  const selector = values.get("--selector") || null;
  if (values.has("--selector") && !values.get("--selector")) fail("--selector must not be empty");
  if (selector && (selector.length > 512 || /[\u0000-\u001f\u007f]/.test(selector))) {
    fail("--selector must be 1-512 characters without control characters");
  }
  const motion = values.get("--motion") || null;
  if (values.has("--motion") && !values.get("--motion")) fail("--motion must not be empty");
  if (motion && !["reduce", "no-preference"].includes(motion)) fail("--motion must be reduce or no-preference");
  const forcedColors = values.get("--forced-colors") || null;
  if (values.has("--forced-colors") && !values.get("--forced-colors")) fail("--forced-colors must not be empty");
  if (forcedColors && !["active", "none"].includes(forcedColors)) fail("--forced-colors must be active or none");

  return { help: false, url: url.href, out, meta, width, height, view, fixture, theme, selector, motion, forcedColors, targetVersion };
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
  if (!selectorEvidence?.visible) fail("the selected evidence element is not visible after scrolling");
  await waitForRender(client);
  return selectorEvidence;
}

async function closeToArchiveThroughVisibleBackControl(client, targetVersion) {
  const before = await evaluate(client, `(() => {
    const runtime = document.querySelector("#lid-runtime-v17");
    const host = document.querySelector("#lid-feature-host-v17");
    const launcher = document.querySelector(".lid-launcher-v17");
    const control = host?.querySelector('[data-lid-action="close-feature"]');
    const rectangle = control?.getBoundingClientRect();
    const style = control ? getComputedStyle(control) : null;
    const center = rectangle ? { x: rectangle.left + rectangle.width / 2, y: rectangle.top + rectangle.height / 2 } : null;
    const hit = center ? document.elementFromPoint(center.x, center.y) : null;
    const visible = Boolean(control && rectangle && rectangle.width > 0 && rectangle.height > 0
      && rectangle.bottom > 0 && rectangle.right > 0 && rectangle.top < innerHeight && rectangle.left < innerWidth
      && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0);
    return {
      activeFeature: runtime?.dataset.activeFeature || null,
      hostHidden: host?.hidden ?? null,
      launcherHidden: launcher?.hidden ?? null,
      control: control ? {
        selector: '#lid-feature-host-v17 [data-lid-action="close-feature"]',
        text: control.textContent.replace(/\\s+/g, " ").trim(),
        disabled: Boolean(control.disabled),
        visible,
        centerHitWithinControl: Boolean(hit && (hit === control || control.contains(hit))),
        rectangle: {
          left: rectangle.left,
          top: rectangle.top,
          right: rectangle.right,
          bottom: rectangle.bottom,
          width: rectangle.width,
          height: rectangle.height,
        },
        center,
      } : null,
    };
  })()`);

  if (before.activeFeature !== `v${targetVersion}` || before.hostHidden !== false || before.launcherHidden !== true) {
    fail(`v${targetVersion} was not the active main-world feature before archive capture`);
  }
  if (!before.control?.visible || before.control.disabled || !/^Back\b/.test(before.control.text)) {
    fail("the visible active Back control was not available for archive capture");
  }
  if (!before.control.centerHitWithinControl) fail("the active Back control failed its center hit-test");

  await client.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: before.control.center.x,
    y: before.control.center.y,
    button: "left",
    buttons: 1,
    clickCount: 1,
  });
  await client.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: before.control.center.x,
    y: before.control.center.y,
    button: "left",
    buttons: 0,
    clickCount: 1,
  });

  const deadline = Date.now() + DEFAULT_TIMEOUT_MS;
  let after = null;
  while (Date.now() < deadline) {
    after = await evaluate(client, `(() => {
      const runtime = document.querySelector("#lid-runtime-v17");
      const host = document.querySelector("#lid-feature-host-v17");
      const launcher = document.querySelector(".lid-launcher-v17");
      return {
        activeFeature: runtime?.dataset.activeFeature || null,
        hostHidden: host?.hidden ?? null,
        hostChildCount: host?.childElementCount ?? null,
        launcherHidden: launcher?.hidden ?? null,
        launcherFocused: document.activeElement === launcher,
      };
    })()`);
    if (after.activeFeature === null && after.hostHidden === true && after.hostChildCount === 0 && after.launcherHidden === false) break;
    await new Promise((resolveWait) => setTimeout(resolveWait, 50));
  }
  if (after?.activeFeature !== null || after?.hostHidden !== true || after?.hostChildCount !== 0 || after?.launcherHidden !== false) {
    fail("the visible Back control did not return to the inactive archive state");
  }
  await waitForRender(client);
  return {
    method: "CDP mouse input at visible Back control center in the main document",
    before,
    after,
  };
}

async function inspectArchiveLauncher(client, closeEvidence) {
  return evaluate(client, `(() => {
    const runtime = document.querySelector("#lid-runtime-v17");
    const host = document.querySelector("#lid-feature-host-v17");
    const launcher = document.querySelector(".lid-launcher-v17");
    const launcherRectangle = launcher?.getBoundingClientRect();
    const launcherStyle = launcher ? getComputedStyle(launcher) : null;
    const round = (value) => Math.round(value * 1000) / 1000;
    const rectangleRecord = (rectangle) => ({
      left: round(rectangle.left),
      top: round(rectangle.top),
      right: round(rectangle.right),
      bottom: round(rectangle.bottom),
      width: round(rectangle.width),
      height: round(rectangle.height),
    });
    const describe = (element) => element ? {
      tagName: element.tagName.toLowerCase(),
      id: element.id || null,
      className: typeof element.className === "string" ? element.className.trim() || null : null,
      action: element.getAttribute("data-action") || element.getAttribute("data-lid-action") || null,
    } : null;
    const visiblyRendered = (element, rectangle) => {
      if (!element || !rectangle || rectangle.width <= 0 || rectangle.height <= 0 || !element.getClientRects().length) return false;
      const style = getComputedStyle(element);
      return !element.hidden && !element.closest("[hidden], [inert]")
        && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0
        && rectangle.bottom > 0 && rectangle.right > 0 && rectangle.top < innerHeight && rectangle.left < innerWidth;
    };
    const launcherVisible = visiblyRendered(launcher, launcherRectangle);
    const fullyVisible = Boolean(launcherVisible && launcherRectangle.left >= 0 && launcherRectangle.top >= 0
      && launcherRectangle.right <= innerWidth && launcherRectangle.bottom <= innerHeight);
    const minimumTarget = Boolean(launcherRectangle && launcherRectangle.width >= 44 && launcherRectangle.height >= 44);
    const insetX = launcherRectangle ? Math.min(12, Math.max(1, launcherRectangle.width / 4)) : 0;
    const insetY = launcherRectangle ? Math.min(12, Math.max(1, launcherRectangle.height / 4)) : 0;
    const points = launcherRectangle ? [
      { name: "center", x: launcherRectangle.left + launcherRectangle.width / 2, y: launcherRectangle.top + launcherRectangle.height / 2 },
      { name: "top-left-inset", x: launcherRectangle.left + insetX, y: launcherRectangle.top + insetY },
      { name: "top-right-inset", x: launcherRectangle.right - insetX, y: launcherRectangle.top + insetY },
      { name: "bottom-left-inset", x: launcherRectangle.left + insetX, y: launcherRectangle.bottom - insetY },
      { name: "bottom-right-inset", x: launcherRectangle.right - insetX, y: launcherRectangle.bottom - insetY },
    ] : [];
    const hitTests = points.map((point) => {
      const hit = document.elementFromPoint(point.x, point.y);
      return {
        name: point.name,
        x: round(point.x),
        y: round(point.y),
        hit: describe(hit),
        withinLauncher: Boolean(hit && launcher && (hit === launcher || launcher.contains(hit))),
      };
    });
    const interactiveSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const visibleInheritedControls = [...document.querySelectorAll(interactiveSelector)]
      .filter((element) => !runtime?.contains(element))
      .map((element) => ({ element, rectangle: element.getBoundingClientRect() }))
      .filter(({ element, rectangle }) => visiblyRendered(element, rectangle));
    const intersectingInheritedControls = visibleInheritedControls
      .filter(({ rectangle }) => launcherRectangle && rectangle.left < launcherRectangle.right && rectangle.right > launcherRectangle.left
        && rectangle.top < launcherRectangle.bottom && rectangle.bottom > launcherRectangle.top)
      .map(({ element, rectangle }) => ({ element: describe(element), rectangle: rectangleRecord(rectangle) }));
    return {
      state: {
        activeFeature: runtime?.dataset.activeFeature || null,
        hostHidden: host?.hidden ?? null,
        hostChildCount: host?.childElementCount ?? null,
        launcherHidden: launcher?.hidden ?? null,
        launcherFocused: document.activeElement === launcher,
        scrollX,
        scrollY,
      },
      close: ${JSON.stringify(closeEvidence)},
      launcher: launcher ? {
        selector: ".lid-launcher-v17",
        text: launcher.textContent.replace(/\\s+/g, " ").trim(),
        ariaLabel: launcher.getAttribute("aria-label"),
        disabled: Boolean(launcher.disabled),
        visible: launcherVisible,
        fullyVisible,
        minimum44By44: minimumTarget,
        rectangle: rectangleRecord(launcherRectangle),
        cornerInset: { x: round(insetX), y: round(insetY) },
        hitTests,
      } : null,
      inheritedControls: {
        visibleCount: visibleInheritedControls.length,
        intersectingCount: intersectingInheritedControls.length,
        intersections: intersectingInheritedControls,
      },
    };
  })()`);
}

function pngDimensions(buffer) {
  const signature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== signature || buffer.subarray(12, 16).toString("ascii") !== "IHDR") {
    fail("Chrome returned data that is not a valid PNG");
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function snapshotSummary(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return null;
  return {
    version: snapshot.version ?? null,
    feature: snapshot.feature ?? null,
    fixture: snapshot.fixture ?? null,
    phase: snapshot.phase ?? null,
    timezone: snapshot.timezone ?? null,
    selectedDestination: snapshot.selectedDestination ?? null,
    destinationValidation: snapshot.destinationValidation ?? null,
    intentCount: snapshot.intentCount ?? null,
    effectCount: snapshot.effectCount ?? null,
    providerRequests: snapshot.providerRequests ?? null,
    deliveredResults: snapshot.deliveredResults ?? null,
    historyEventCount: Array.isArray(snapshot.historyEvents) ? snapshot.historyEvents.length : null,
    dayView: snapshot.dayView ?? null,
    theme: snapshot.theme ?? null,
  };
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

    const activeFeature = await evaluate(client, `document.querySelector("#lid-runtime-v17")?.dataset.activeFeature || null`);
    const manifest = await evaluate(client, `window.__LID_QA__.manifest()`);
    const expectedLoadedVersions = Array.from({ length: options.targetVersion - 16 }, (_, index) => index + 17);
    if (manifest?.version !== options.targetVersion
      || !Array.isArray(manifest.loadedVersions)
      || JSON.stringify(manifest.loadedVersions) !== JSON.stringify(expectedLoadedVersions)) {
      fail(`the loaded QA manifest is not the exact cumulative v17-v${options.targetVersion} chain`);
    }
    if (activeFeature !== manifest.qaFeature || activeFeature !== `v${options.targetVersion}`) {
      fail(`v${options.targetVersion} must be active while its QA manifest and invariants are validated`);
    }
    if (options.fixture) {
      if (!Array.isArray(manifest.fixtures) || !manifest.fixtures.includes(options.fixture)) {
        fail(`--fixture is not declared by the v17 QA manifest: ${options.fixture}`);
      }
      await evaluate(client, `window.__LID_QA__.setFixture(${JSON.stringify(options.fixture)})`);
    }
    if (options.theme) {
      const selectedTheme = await evaluate(client, `(() => {
        const before = window.__LID_QA__.snapshot();
        if (before.theme !== ${JSON.stringify(options.theme)}) window.__LID_QA__.dispatch("toggle-theme");
        return window.__LID_QA__.snapshot().theme;
      })()`);
      if (selectedTheme !== options.theme) fail(`the QA API could not select the ${options.theme} theme`);
    }
    await waitForRender(client);

    let selectorEvidence = null;
    if (options.selector && options.view === "active") {
      selectorEvidence = await scrollSelectorIntoView(client, options.selector);
    }

    const invariants = await evaluate(client, `window.__LID_QA__.runInvariants()`);
    const snapshot = await evaluate(client, `window.__LID_QA__.snapshot()`);
    if (!invariants?.pass) fail(`v${options.targetVersion} QA invariants did not pass while active`);
    if (snapshot?.version !== options.targetVersion) fail(`v${options.targetVersion} QA snapshot is missing or incompatible`);
    if (options.fixture && snapshot.fixture !== options.fixture) fail("the requested fixture was not selected");
    if (options.theme && snapshot.theme !== options.theme) fail("the requested theme was not selected");

    let archiveDiagnostics = null;
    if (options.view === "archive") {
      const closeEvidence = await closeToArchiveThroughVisibleBackControl(client, options.targetVersion);
      if (options.selector) selectorEvidence = await scrollSelectorIntoView(client, options.selector);
      archiveDiagnostics = await inspectArchiveLauncher(client, closeEvidence);
      const launcher = archiveDiagnostics?.launcher;
      if (archiveDiagnostics?.state?.activeFeature !== null
        || archiveDiagnostics?.state?.hostHidden !== true
        || archiveDiagnostics?.state?.hostChildCount !== 0
        || archiveDiagnostics?.state?.launcherHidden !== false) {
        fail("archive diagnostics do not describe a fully inactive feature host");
      }
      if (!launcher?.visible || !launcher.fullyVisible || !launcher.minimum44By44 || launcher.disabled) {
        fail("archive launcher is not fully visible, enabled, and at least 44 by 44 CSS pixels");
      }
      if (!launcher.text.includes(`Prototype v${options.targetVersion}`)
        || !launcher.ariaLabel?.includes(`prototype v${options.targetVersion}`)) {
        fail(`archive launcher does not identify prototype v${options.targetVersion}`);
      }
      if (!launcher.hitTests?.length || launcher.hitTests.some((hitTest) => !hitTest.withinLauncher)) {
        fail("archive launcher failed one or more center/corner hit-tests");
      }
      if (archiveDiagnostics.inheritedControls?.intersectingCount !== 0) {
        fail("archive launcher intersects a visible inherited archive control");
      }
    }

    const pageState = await evaluate(client, `(async () => {
      const root = document.documentElement;
      const body = document.body;
      const host = document.querySelector("#lid-feature-host-v17");
      const registrations = navigator.serviceWorker ? await navigator.serviceWorker.getRegistrations() : [];
      const databaseList = indexedDB.databases ? await indexedDB.databases() : [];
      const cacheNames = globalThis.caches ? await caches.keys() : [];
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
    if (options.view === "archive" && consoleEvents.length) fail(`captured ${consoleEvents.length} browser console event(s) in archive mode`);
    if (Object.values(pageState.storageCounts).some((count) => count !== 0)) {
      fail("the isolated evidence profile contains browser storage, database, cache, or service-worker state");
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
      tool: "capture-phase2-evidence-v17.mjs",
      toolVersion: TOOL_VERSION,
      targetVersion: options.targetVersion,
      capturedAt: new Date().toISOString(),
      capture: {
        requestedUrl: options.url,
        view: options.view,
        viewport: { width: options.width, height: options.height, scaleFactor: 1 },
        fixture: options.fixture,
        theme: options.theme,
        media: {
          requested: { motion: options.motion, forcedColors: options.forcedColors },
          observed: pageState.media,
        },
        selector: selectorEvidence,
        png: { file: basename(options.out), width: dimensions.width, height: dimensions.height, bytes: png.length, sha256: pngSha256 },
      },
      page: {
        title: pageState.title,
        url: pageState.url,
        history: pageState.history,
      },
      qa: {
        manifest,
        invariants,
        snapshotSummary: snapshotSummary(snapshot),
      },
      archiveDiagnostics,
      viewport: pageState.viewport,
      overflow: pageState.overflow,
      browserState: pageState.storageCounts,
      events: {
        console: consoleEvents,
        exceptions: exceptionEvents,
        networkRequests,
      },
    };

    await mkdir(dirname(options.out), { recursive: true });
    await mkdir(dirname(options.meta), { recursive: true });
    await writeFile(options.out, png);
    await writeFile(options.meta, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
    process.stdout.write(`${JSON.stringify({
      result: "PASS",
      targetVersion: options.targetVersion,
      view: options.view,
      png: options.out,
      meta: options.meta,
      dimensions,
      sha256: pngSha256,
      fixture: snapshot.fixture,
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
  process.stderr.write(`capture-phase2-evidence-v17: FAIL\n${error.message}\n`);
  process.exitCode = 1;
});
