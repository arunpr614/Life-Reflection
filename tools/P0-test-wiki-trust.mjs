#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  assertWikiPublicSafety,
  collectMarkdownAnchors,
  createGithubSlugger,
  extractMarkdownLinks,
  githubHeadingBase,
  validateGeneratedWiki,
  validateSourceMarkdownGraph,
  validateWikiTrust,
} from "./P0-wiki-trust.mjs";

const repoRoot = resolve(import.meta.dirname, "..");
const buildWikiPath = resolve(repoRoot, "tools/build-wiki.mjs");
const wikiTrustPath = resolve(repoRoot, "tools/P0-wiki-trust.mjs");
const repositoryUrl = "https://github.com/arunpr614/Life-Reflection";
const commit = "a".repeat(40);
let cases = 0;

function expectPass(action, label) {
  cases += 1;
  try {
    action();
  } catch (error) {
    throw new Error(`${label} unexpectedly failed: ${error.message}`);
  }
}

function expectFailure(action, pattern, label) {
  cases += 1;
  let error = null;
  try {
    action();
  } catch (caught) {
    error = caught;
  }
  if (!error) throw new Error(`${label} unexpectedly passed`);
  if (!pattern.test(error.message)) throw new Error(`${label} failed for the wrong reason: ${error.message}`);
}

function fixture() {
  const sourceDocuments = new Map([
    ["docs/A.md", "# A\n\n[Unicode destination](B.md#résumé-東京--café)\n"],
    ["docs/B.md", "# Résumé 東京 — Café\n\n## Repeat\n\n## Repeat\n"],
  ]);
  const trackedPaths = new Set(["docs/A.md", "docs/B.md", "assets/example.png"]);
  const pageBySource = new Map([["docs/A.md", "A"], ["docs/B.md", "B"]]);
  const provenance = (source) => `> Canonical source: [\`${source}\`](${repositoryUrl}/blob/${commit}/${source}) · Snapshot commit: [\`${commit.slice(0, 12)}\`](${repositoryUrl}/commit/${commit})\n\n`;
  const pages = new Map([
    ["A", `${provenance("docs/A.md")}# A\n\n[Unicode destination](${repositoryUrl}/wiki/B#résumé-東京--café)\n`],
    ["B", `${provenance("docs/B.md")}# Résumé 東京 — Café\n\n## Repeat\n\n## Repeat\n`],
    ["_Sidebar", `# Navigation\n\n- [A](${repositoryUrl}/wiki/A)\n- [B](${repositoryUrl}/wiki/B)\n`],
    ["Home", "# Home\n"],
    ["Asset-Catalog", "# Asset catalog\n"],
    ["Documentation-Changelog", "# Documentation changelog\n"],
    ["_Footer", "Generated fixture\n"],
    ["Page-Audit", `# Page audit\n\nRepository snapshot: [\`${commit}\`](${repositoryUrl}/commit/${commit})\n\nCoverage: **2 of 2 Markdown sources mapped exactly once**.\n\n| Canonical source | Wiki page | Source SHA-256 | Generated SHA-256 |\n| --- | --- | --- | --- |\n| [\`docs/A.md\`](${repositoryUrl}/blob/${commit}/docs/A.md) | [A](${repositoryUrl}/wiki/A) | \`${"1".repeat(64)}\` | \`${"2".repeat(64)}\` |\n| [\`docs/B.md\`](${repositoryUrl}/blob/${commit}/docs/B.md) | [B](${repositoryUrl}/wiki/B) | \`${"3".repeat(64)}\` | \`${"4".repeat(64)}\` |\n`],
  ]);
  return { sourceDocuments, trackedPaths, pageBySource, pages, commit };
}

expectPass(() => {
  if (githubHeadingBase("7. Monthly Almanac — chronological browsing") !== "7-monthly-almanac--chronological-browsing") {
    throw new Error("Almanac anchor mismatch");
  }
  if (githubHeadingBase("Résumé 東京 — Café") !== "résumé-東京--café") {
    throw new Error("Unicode anchor mismatch");
  }
}, "GitHub-style Unicode and punctuation anchors");

expectPass(() => {
  const slugger = createGithubSlugger();
  const values = [slugger.slug("Repeat"), slugger.slug("Repeat"), slugger.slug("Repeat")];
  if (JSON.stringify(values) !== JSON.stringify(["repeat", "repeat-1", "repeat-2"])) {
    throw new Error(`deduplication mismatch: ${values.join(",")}`);
  }
}, "deduplicated GitHub headings");

expectPass(() => {
  const result = collectMarkdownAnchors("<a id=\"stable-release-r1\"></a>\n# Release R1\n", "fixture");
  if (!result.anchors.has("stable-release-r1") || !result.anchors.has("release-r1")) {
    throw new Error("explicit/heading anchors were not both retained");
  }
}, "valid explicit IDs and heading anchors are retained");

expectFailure(
  () => collectMarkdownAnchors("<a id=\"bad id\"></a>\n# Heading\n", "fixture"),
  /unsupported explicit id/,
  "invalid explicit ID is rejected",
);
expectFailure(
  () => collectMarkdownAnchors("<a id=release-r1></a>\n# Heading\n", "fixture"),
  /malformed explicit id/,
  "unquoted explicit ID is rejected",
);
expectFailure(
  () => collectMarkdownAnchors("<a id=\"same\"></a>\n<a id=\"same\"></a>\n", "fixture"),
  /duplicates explicit\/heading id/,
  "duplicate explicit ID is rejected",
);
expectFailure(
  () => collectMarkdownAnchors("<a id=\"release-r1\"></a>\n# Release R1\n", "fixture"),
  /collides on anchor/,
  "explicit and generated anchor collision is rejected",
);

expectPass(() => {
  const links = extractMarkdownLinks("`[ignored](missing.md)`\n[kept](present.md#ok)\n```md\n[ignored](also-missing.md)\n```\n");
  if (links.length !== 1 || links[0].destination !== "present.md#ok") throw new Error("link extraction boundary mismatch");
}, "fenced and inline-code links are ignored");

expectPass(() => {
  const current = fixture();
  validateSourceMarkdownGraph({ documents: current.sourceDocuments, trackedPaths: current.trackedPaths });
}, "source Markdown paths and Unicode fragment validate");

const missingSourcePath = fixture();
missingSourcePath.sourceDocuments.get("docs/A.md");
missingSourcePath.sourceDocuments.set("docs/A.md", "# A\n\n[Missing](missing.md)\n");
expectFailure(
  () => validateSourceMarkdownGraph({ documents: missingSourcePath.sourceDocuments, trackedPaths: missingSourcePath.trackedPaths }),
  /missing local path/,
  "missing source path is rejected",
);

const missingSourceFragment = fixture();
missingSourceFragment.sourceDocuments.set("docs/A.md", "# A\n\n[Missing](B.md#not-there)\n");
expectFailure(
  () => validateSourceMarkdownGraph({ documents: missingSourceFragment.sourceDocuments, trackedPaths: missingSourceFragment.trackedPaths }),
  /missing fragment/,
  "missing source fragment is rejected",
);

expectPass(() => validateGeneratedWiki(fixture()), "generated Wiki graph and Page Audit validate");
expectPass(() => validateWikiTrust(fixture()), "combined source/generated pure API validates");
expectPass(() => assertWikiPublicSafety(fixture().pages), "public-safe generated fixture validates");

const missingWikiPage = fixture();
missingWikiPage.pages.get("A");
missingWikiPage.pages.set("A", missingWikiPage.pages.get("A").replace("/wiki/B#", "/wiki/Missing#"));
expectFailure(() => validateGeneratedWiki(missingWikiPage), /missing Wiki page/, "missing generated page is rejected");

const missingWikiFragment = fixture();
missingWikiFragment.pages.set("A", missingWikiFragment.pages.get("A").replace("#résumé-東京--café", "#missing"));
expectFailure(() => validateGeneratedWiki(missingWikiFragment), /missing fragment/, "missing generated fragment is rejected");

const normalizedCollision = fixture();
normalizedCollision.pages.set("a", "# collision\n");
expectFailure(() => validateGeneratedWiki(normalizedCollision), /normalized Wiki page collision/, "normalized page collision is rejected");

const staleCoverage = fixture();
staleCoverage.pages.set("Page-Audit", staleCoverage.pages.get("Page-Audit").replace("2 of 2", "1 of 2"));
expectFailure(() => validateGeneratedWiki(staleCoverage), /coverage is not current 2\/2/, "stale N/N coverage is rejected");

const recursiveAudit = fixture();
recursiveAudit.pages.set(
  "Page-Audit",
  `${recursiveAudit.pages.get("Page-Audit")}| Generated self | [Page-Audit](${repositoryUrl}/wiki/Page-Audit) | Generated | \`${"f".repeat(64)}\` |\n`,
);
expectFailure(() => validateGeneratedWiki(recursiveAudit), /recursive hash of itself/, "Page Audit self-hash loop is rejected");

const missingAuditRow = fixture();
missingAuditRow.pages.set(
  "Page-Audit",
  missingAuditRow.pages.get("Page-Audit").split("\n").filter((line) => !line.includes("`docs/B.md`")).join("\n"),
);
expectFailure(() => validateGeneratedWiki(missingAuditRow), /does not map docs\/B.md/, "missing audit source row is rejected");

const unsafeLocalPath = fixture();
const privatePathCanary = ["/", "Users", "/example/private/evidence"].join("");
unsafeLocalPath.pages.set("A", `${unsafeLocalPath.pages.get("A")}\n${privatePathCanary}\n`);
expectFailure(() => validateGeneratedWiki(unsafeLocalPath), /local absolute user path/, "local private path is rejected");

const unsafeToken = fixture();
const githubTokenCanary = [["gh", "p", "_"].join(""), "A".repeat(24)].join("");
unsafeToken.pages.set("A", `${unsafeToken.pages.get("A")}\n${githubTokenCanary}\n`);
expectFailure(() => validateGeneratedWiki(unsafeToken), /GitHub token/, "token-shaped value is rejected");

const unsafeNode = fixture();
const projectNodeCanary = [["PV", "TI", "_"].join(""), "A".repeat(20)].join("");
unsafeNode.pages.set("A", `${unsafeNode.pages.get("A")}\n${projectNodeCanary}\n`);
expectFailure(() => validateGeneratedWiki(unsafeNode), /Project node ID/, "Project node ID is rejected");

const indexSource = readFileSync(resolve(repoRoot, "docs/INDEX.md"), "utf8");
expectPass(() => {
  if (!indexSource.includes("[live Page Audit](https://github.com/arunpr614/Life-Reflection/wiki/Page-Audit)")
    || /Page Audit(?: SHA-256| hash)[^\n]*[0-9a-f]{64}/i.test(indexSource)
    || !indexSource.includes("Those counts and commits are not asserted as current.")) {
    throw new Error("INDEX does not preserve the non-recursive live Page Audit direction");
  }
}, "INDEX directs current Wiki truth to live Page Audit without embedding its hash");
expectPass(() => {
  if (!indexSource.includes("58 Incomplete; 45 Hold + 13 Historical non-authorizing; 0 Ready; 0 execution-allowed")) {
    throw new Error("INDEX readiness wording drifted");
  }
}, "INDEX uses exact current readiness wording");

const designReviewSource = readFileSync(resolve(repoRoot, "docs/council/UX-DESIGN-REVIEW.md"), "utf8");
expectPass(() => {
  const repaired = designReviewSource.match(/\.\.\/design\/UX-SPECIFICATION\.md#7-monthly-almanac--chronological-browsing/g) ?? [];
  const removed = designReviewSource.match(/#7-timeline-experience/g) ?? [];
  if (repaired.length !== 2 || removed.length !== 0) {
    throw new Error(`expected exactly two repaired Almanac fragments; found ${repaired.length}/${removed.length}`);
  }
}, "exactly two removed Timeline fragments point to the canonical Almanac anchor");

const wikiBuilderSource = readFileSync(buildWikiPath, "utf8");
expectPass(() => {
  if (wikiBuilderSource.includes("statusTableValue") || wikiBuilderSource.includes('"P0 execution authority"')
    || !wikiBuilderSource.includes("artifactRegisterAtCommit")) {
    throw new Error("Wiki Home still derives execution truth from README labels");
  }
}, "Wiki Home execution truth is structured manifest/register data");

const helpDirectory = mkdtempSync(join(tmpdir(), "p0-wiki-help-"));
try {
  const before = readdirSync(helpDirectory);
  const buildHelp = spawnSync(process.execPath, [buildWikiPath, "--help"], { cwd: helpDirectory, encoding: "utf8" });
  const after = readdirSync(helpDirectory);
  expectPass(() => {
    if (buildHelp.status !== 0 || !buildHelp.stdout.startsWith("Usage:") || buildHelp.stderr !== ""
      || JSON.stringify(before) !== JSON.stringify(after)) {
      throw new Error(`build help wrote state or failed: ${buildHelp.status} ${buildHelp.stderr}`);
    }
  }, "build-wiki help performs zero writes");

  const trustHelp = spawnSync(process.execPath, [wikiTrustPath, "--help"], { cwd: helpDirectory, encoding: "utf8" });
  const afterTrust = readdirSync(helpDirectory);
  expectPass(() => {
    if (trustHelp.status !== 0 || !trustHelp.stdout.startsWith("Usage:") || trustHelp.stderr !== ""
      || JSON.stringify(before) !== JSON.stringify(afterTrust)) {
      throw new Error(`trust help wrote state or failed: ${trustHelp.status} ${trustHelp.stderr}`);
    }
  }, "wiki-trust help performs zero writes");

  const unknown = spawnSync(process.execPath, [buildWikiPath, "--unknown-output"], { cwd: helpDirectory, encoding: "utf8" });
  const afterUnknown = readdirSync(helpDirectory);
  expectPass(() => {
    if (unknown.status === 0 || !unknown.stderr.includes("Unknown option-like argument")
      || JSON.stringify(before) !== JSON.stringify(afterUnknown)) {
      throw new Error("unknown option-like output argument did not fail before writes");
    }
  }, "option-like output directory is rejected before writes");
} finally {
  rmSync(helpDirectory, { recursive: true, force: true });
}

process.stdout.write(`${JSON.stringify({
  ok: true,
  suite: "P0 Wiki trust",
  cases,
  expectedAlmanacAnchor: "7-monthly-almanac--chronological-browsing",
  helpWrites: 0,
}, null, 2)}\n`);
