import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const read = (name) => readFileSync(resolve(directory, name));
const text = (name) => read(name).toString("utf8");
const sha256 = (name) => createHash("sha256").update(read(name)).digest("hex");
const failures = [];
const pass = (condition, message) => {
  if (!condition) failures.push(message);
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
]);

for (const [name, expected] of frozen) {
  pass(sha256(name) === expected, `${name} no longer matches the frozen v16 SHA-256`);
}

const required = ["index-v17.html", "runtime-v17.js", "app-v17.js", "styles-v17.css", "README-v17.md", "check-v17.mjs", "capture-phase2-evidence-v17.mjs"];
for (const name of required) pass(read(name).length > 0, `${name} is missing or empty`);

const index = text("index-v17.html");
const runtime = text("runtime-v17.js");
const app = text("app-v17.js");
const styles = text("styles-v17.css");
const guide = text("README-v17.md");
const evidence = text("capture-phase2-evidence-v17.mjs");
const combinedRuntime = `${runtime}\n${app}`;
const renderMarkup = app.slice(app.indexOf("function render(state)"));
const launcherRule = styles.match(/\.lid-launcher-v17\s*\{([\s\S]*?)\n\}/)?.[1] || "";
const runtimeClickHandler = runtime.slice(runtime.indexOf("function handleRuntimeClick"), runtime.indexOf("function handleRuntimeChange"));

pass(index.includes('data-lid-version="17"'), "index-v17.html must declare v17");
pass(index.includes('<script src="app-v16.js" defer></script>'), "index-v17.html must load frozen app-v16.js with classic defer");
pass(index.includes('<script src="runtime-v17.js" defer></script>'), "index-v17.html must load runtime-v17.js with classic defer");
pass(index.includes('<script src="app-v17.js" defer></script>'), "index-v17.html must load app-v17.js with classic defer");
pass(index.indexOf("app-v16.js") < index.indexOf("runtime-v17.js") && index.indexOf("runtime-v17.js") < index.indexOf("app-v17.js"), "v17 script order must be app-v16, runtime-v17, app-v17");
pass(index.includes('<link rel="stylesheet" href="styles-v17.css" />'), "index-v17.html must load styles-v17.css");
pass(!index.includes("type=\"module\""), "browser scripts must remain classic defer scripts");

for (const fixture of ["ready", "future-rejected", "same-day-rejected", "pending", "failure", "unknown", "interrupted", "competing-revision", "success", "rapid-repeat"]) {
  pass(app.includes(`"${fixture}"`), `app-v17.js is missing fixture ${fixture}`);
}

for (const api of ["manifest", "reset", "setFixture", "dispatch", "settle", "snapshot", "runInvariants"]) {
  pass(runtime.includes(`${api}(`) || runtime.includes(`${api}:`), `window.__LID_QA__ is missing ${api}`);
}

pass(runtime.includes('data-lid-action="open-latest"'), "runtime launcher must be version-generic");
pass(runtime.includes("latestCompatibleFeature"), "runtime must choose the highest compatible feature");
pass(runtime.includes("listFeatures") && runtime.includes("loadedVersions"), "runtime must expose feature manifest/list data");
pass(runtime.includes('window.history.replaceState(null, "", window.location.pathname)'), "successor feature opening must clear inherited query/hash and history payload");
pass(runtime.includes("Nothing is merged automatically."), "runtime must carry the exact approved inherited v16 successor copy");
pass(runtime.includes("loadedVersions: registeredFeatures().map"), "generic QA manifest must include cumulative loadedVersions");
pass(runtime.includes('action === "open-feature"'), "runtime must support validated prior-feature routing");
pass(runtime.includes("skipLink.textContent"), "runtime skip-link copy must follow the latest compatible feature");
pass(runtime.includes('Object.defineProperty(window, "__LID_QA__"'), "runtime must own the one-time generic QA API");
pass(!app.includes('Object.defineProperty(window, "__LID_QA__"'), "feature capsules must not freeze a version-specific QA API");
pass(runtime.includes("captureFocusToken") && runtime.includes("restoreFocusToken"), "runtime must preserve an equivalent focused control across renders");
pass(runtime.includes("preserveFocus: true"), "ordinary successor input changes must request focus preservation");
pass(runtime.includes("isEligibleReturnFocus") && runtime.includes("element === document.body"), "runtime must reject body and other non-interactive return-focus targets");
pass(runtime.includes("extractInheritedLaunchContext") && runtime.includes("completeInheritedLaunchContext"), "runtime must resolve complete inherited v16 Source Item launch context or fail closed");
pass(runtimeClickHandler.indexOf("if (!completeInheritedLaunchContext") < runtimeClickHandler.indexOf("event.preventDefault()"), "incomplete inherited context must continue through original v16 behavior without interception");
pass(runtime.includes("prepareOpen") && runtime.includes("validateLaunchContext"), "runtime must support generic fresh/context preparation for every feature opening");
pass(runtime.includes('document.addEventListener("input", handleRuntimeChange, true)'), "native date input must recover without waiting for a separate Reset path");
pass(runtime.includes('closeFeature("cancel")') && runtime.includes('closeFeature("escape")') && runtime.includes('closeFeature("back")'), "Cancel, Escape, and Back must share reasoned safe-exit semantics");
pass(runtime.includes("capsule.descriptor.canClose"), "runtime must let a capsule block unsafe abandonment of an unresolved intent");
pass(runtime.includes("document.body.prepend(runtimeRoot)"), "the inactive launcher must be integrated in normal document flow before the archive");
pass(!/position\s*:\s*fixed/.test(launcherRule), "the inactive launcher must not be a fixed overlay");
pass(app.includes("17 Aug 2026, 11:42 pm IST"), "immutable Original Timestamp fixture is missing");
pass(app.includes("Journal Date changed"), "typed history event is missing");
pass(app.includes("real-photo precedence"), "destination cover precedence consequence is missing");
pass(app.includes("Historical · retained"), "retained artwork-history consequence is missing");
pass(app.includes("No provider request is queued"), "provider-request invariant is missing");
pass(app.includes("Prototype-only outcome delivery"), "pending accepted-intent outcome controls are missing");
for (const outcome of ["success", "failure", "unknown", "interrupted", "competing-revision"]) {
  pass(app.includes(`data-lid-outcome=\\"${outcome}\\"`) || app.includes(`data-lid-outcome="${outcome}"`), `visible pending outcome ${outcome} is missing`);
}
pass(app.includes("Deliver duplicate result"), "visible duplicate-result replay control is missing");
pass(app.includes('launcherTitle: "Atomic Redating · fixed synthetic demo"'), "global launcher must identify the fixed synthetic demo");
pass(app.includes('fixture = state.validation.kind === "invalid" ? "date-required" : null'), "empty/invalid manual input must expose the unpressed date-required fixture identity");
pass(app.includes('["date-required"]') || app.includes('"date-required": ["Destination required"'), "date-required phase and exact heading are missing");
pass(app.includes('message: "Enter a complete calendar date."'), "date-required error copy is missing");
pass(app.includes("aria-errormessage=\"lid-date-validation-v17\"") && app.includes("required aria-describedby=\"lid-date-help-v17\""), "date input must separate help from required inline error semantics");
pass(app.includes("lid-neutral-preview-v17") && app.includes("No destination consequence is represented"), "invalid destination must render a neutral, non-fabricated consequence state");
pass(app.includes('data-lid-action="cancel-feature"'), "pre-intent Cancel must be a route exit");
pass(app.includes("function canClose") && app.includes('["pending", "unknown", "interrupted"]'), "unresolved intents must block silent task exit");
pass(app.includes("beforeSnapshot") && app.includes("sourceRevision"), "launch context must retain a Source revision and before snapshot");
pass(app.includes("beforeSnapshot.sourceId === launchContext.sourceId") && runtime.includes("beforeSnapshot.sourceId === context.sourceId"), "launch context validation must bind its before snapshot to the exact invoking item");
pass(renderMarkup.indexOf('<div class="lid-workspace-v17">') >= 0 && renderMarkup.indexOf('<div class="lid-workspace-v17">') < renderMarkup.indexOf("${fixtureConsole(state)}"), "task workspace must precede the prototype console in DOM order");
pass(styles.includes("grid-template-columns: minmax(0, 1fr) minmax(230px, 270px)"), "wide layout must keep primary task content before the QA rail");
pass(app.includes('"capture-phase2-evidence-v17.mjs"'), "QA manifest must include the reusable evidence helper");
pass((app.match(/<h1/g) || []).length === 1, "app-v17.js must render exactly one feature h1");
pass(styles.includes("@media (forced-colors: active)"), "forced-colour treatment is missing");
pass(styles.includes("@media (prefers-reduced-motion: reduce)"), "reduced-motion treatment is missing");
pass(styles.includes("@media (max-width: 350px)"), "320 px compact treatment is missing");
pass(styles.includes("min-height: 44px"), "44 px control target floor is missing");
pass(guide.includes("no backend, persistence, provider, security, deployment, or production claim"), "README boundary statement is missing");
pass(guide.includes("capture-phase2-evidence-v17.mjs"), "README evidence-helper roster is missing");
pass(guide.includes("Atomic Redating · fixed synthetic demo") && guide.includes("An incomplete context fails closed"), "README must distinguish the global fixed demo from exact inherited context");
pass(guide.includes("Destination required") && guide.includes("Pending, unknown, and interrupted intents cannot be silently abandoned"), "README must record repaired invalid-date and safe-exit behavior");
for (const evidenceContract of [
  "mkdtemp",
  "--headless=new",
  "--remote-debugging-port=",
  "Emulation.setDeviceMetricsOverride",
  "Page.captureScreenshot",
  "window.__LID_QA__",
  "targetVersion",
  "expectedLoadedVersions",
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
]) {
  pass(evidence.includes(evidenceContract), `capture-phase2-evidence-v17.mjs is missing ${evidenceContract}`);
}
pass(!/\bfrom\s+["'](?!node:)/.test(evidence), "evidence helper must import only Node built-ins");
pass(evidence.includes("targetVersion < 17 || targetVersion > 35"), "evidence helper must be reusable only for v17-v35");
pass(evidence.includes("file: basename(options.out)"), "evidence metadata must store only the PNG basename");
pass(!evidence.includes("png: { path: options.out"), "evidence metadata must not store the absolute PNG path");

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
  pass(!forbidden.test(combinedRuntime), `v17 runtime/application contains forbidden API ${forbidden}`);
}

pass(!combinedRuntime.includes("2026-08-17?"), "fixture date must not be assembled into a URL");
pass(!combinedRuntime.includes("pushState("), "v17 must not push fixture history entries");

if (failures.length) {
  process.stderr.write(`check-v17: FAIL (${failures.length})\n${failures.map((failure) => `- ${failure}`).join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`check-v17: PASS (${frozen.size} frozen hashes, ${required.length} additive assets, 10 fixtures, privacy/static contract)\n`);
}
