#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, posix, resolve } from "node:path";

const REPOSITORY = "arunpr614/Life-Reflection";
const GITHUB = `https://github.com/${REPOSITORY}`;
const outputArgument = process.argv[2];
const revision = process.argv[3] ?? "HEAD";
const priorWikiArgument = process.argv[4] ?? null;

if (!outputArgument) {
  throw new Error("Usage: node tools/build-wiki.mjs <empty-output-directory> [revision] [prior-wiki-directory]");
}

function git(args, options = {}) {
  return execFileSync("git", args, {
    cwd: repositoryRoot,
    encoding: Object.hasOwn(options, "encoding") ? options.encoding : "utf8",
    maxBuffer: 128 * 1024 * 1024,
  });
}

const repositoryRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();
const outputDirectory = isAbsolute(outputArgument)
  ? outputArgument
  : resolve(process.cwd(), outputArgument);
const priorWikiDirectory = priorWikiArgument
  ? (isAbsolute(priorWikiArgument) ? priorWikiArgument : resolve(process.cwd(), priorWikiArgument))
  : null;

if (existsSync(outputDirectory) && readdirSync(outputDirectory).length > 0) {
  throw new Error(`Output directory must be empty: ${outputDirectory}`);
}
mkdirSync(outputDirectory, { recursive: true });
if (priorWikiDirectory && (!existsSync(priorWikiDirectory) || readdirSync(priorWikiDirectory).length === 0)) {
  throw new Error(`Prior Wiki directory must exist and be non-empty: ${priorWikiDirectory}`);
}

const commit = git(["rev-parse", `${revision}^{commit}`]).trim();
const commitDate = git(["show", "-s", "--format=%cI", commit]).trim();
const trackedFiles = git(["ls-tree", "-r", "-z", "--name-only", commit])
  .split("\0")
  .filter(Boolean)
  .sort(naturalCompare);
const trackedFileSet = new Set(trackedFiles);
const markdownFiles = trackedFiles.filter((file) => file.toLowerCase().endsWith(".md"));

function naturalCompare(left, right) {
  return left.localeCompare(right, "en", { numeric: true, sensitivity: "base" });
}

function readAtCommit(file, encoding = "utf8") {
  return git(["show", `${commit}:${file}`], { encoding });
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function encodePath(file) {
  return file.split("/").map(encodeURIComponent).join("/");
}

function words(value) {
  return value
    .replace(/\.md$/i, "")
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => {
      if (/^(AI|API|MVP|PRD|QA|UI|UX)$/i.test(word)) return word.toUpperCase();
      if (/^v\d+$/i.test(word)) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("-");
}

function wikiSlug(source) {
  const exact = new Map([
    ["README.md", "Repository-README"],
    ["CONTEXT.md", "Domain-Language"],
    ["RUNNING_LOG.md", "Project-Running-Log"],
    ["PUBLICATION.md", "Publication-Provenance"],
    ["CONTRIBUTING.md", "Contributing"],
    ["SECURITY.md", "Security"],
    [".github/pull_request_template.md", "Pull-Request-Template"],
    ["docs/INDEX.md", "Documentation-Index"],
    ["docs/architecture/IMPLEMENTATION-PLAN.md", "Implementation-Plan"],
    ["docs/audits/PROTOTYPE-V5-FEATURE-AUDIT.md", "Prototype-v5-Feature-Audit"],
    ["docs/council/COUNCIL-REVIEW.md", "Council-Review"],
    ["docs/council/PRODUCT-COUNCIL.md", "Product-Council"],
    ["docs/design/UX-SPECIFICATION.md", "UX-Specification"],
    ["docs/discovery/REQUIREMENTS.md", "Discovery-Requirements"],
    ["docs/discovery/RESEARCH.md", "Discovery-Research"],
    ["docs/discovery/SHARED-UNDERSTANDING.md", "Shared-Understanding"],
    ["docs/product/PRODUCT-REQUIREMENTS.md", "Product-Requirements"],
    ["docs/project/PROJECT-TRACKER.md", "Project-Tracker"],
    ["docs/project/PROTOTYPE-COMPLETENESS-TRACKER.md", "Prototype-Completeness-Tracker"],
    ["docs/project/REQUIREMENTS-TRACEABILITY.md", "Requirements-Traceability"],
  ]);
  if (exact.has(source)) return exact.get(source);

  if (source === "design-qa.md") return "Prototype-Design-QA-v5-Legacy";

  let match = source.match(/^design-qa-v(\d+)\.md$/);
  if (match) return `Prototype-Design-QA-v${match[1]}`;

  match = source.match(/^docs\/prototypes\/CALENDAR-UI-PROTOTYPE(?:-v(\d+))?\.md$/);
  if (match) return `Prototype-Handoff-v${match[1] ?? "1"}`;

  match = source.match(/^docs\/prototypes\/v(\d+)\/COUNCIL-v\d+\.md$/);
  if (match) return `Prototype-Council-v${match[1]}`;

  match = source.match(/^prototypes\/calendar-ui\/README(?:-v(\d+))?\.md$/);
  if (match) return `Prototype-Run-Guide-v${match[1] ?? "1"}`;

  match = source.match(/^docs\/council\/agents\/(.+)\.md$/);
  if (match) return `Council-Role-${words(match[1])}`;

  match = source.match(/^docs\/discovery\/(.+)\.md$/);
  if (match) return `Discovery-${words(match[1])}`;

  return words(source.replaceAll("/", "-"));
}

function titleFrom(content, source) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading || words(source.split("/").at(-1));
}

const pageBySource = new Map();
const sourceByPage = new Map();
const sourceByNormalizedPage = new Map();
for (const source of markdownFiles) {
  const slug = wikiSlug(source);
  if (!/^[A-Za-z0-9_-]+$/.test(slug)) {
    throw new Error(`Unsupported Wiki page name: ${source} -> ${slug}`);
  }
  if (sourceByPage.has(slug)) {
    throw new Error(`Wiki page collision: ${sourceByPage.get(slug)} and ${source} -> ${slug}`);
  }
  const normalizedSlug = slug.normalize("NFKC").toLocaleLowerCase("en-US");
  if (sourceByNormalizedPage.has(normalizedSlug)) {
    throw new Error(
      `Case-insensitive Wiki page collision: ${sourceByNormalizedPage.get(normalizedSlug)} and ${source} -> ${slug}`,
    );
  }
  pageBySource.set(source, slug);
  sourceByPage.set(slug, source);
  sourceByNormalizedPage.set(normalizedSlug, source);
}

const unresolvedLinks = [];

function splitDestination(destination) {
  const trimmed = destination.trim();
  const angleWrapped = trimmed.startsWith("<") && trimmed.endsWith(">");
  const value = angleWrapped ? trimmed.slice(1, -1) : trimmed;
  const match = value.match(/^(\S+?)(\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?$/);
  return {
    url: match?.[1] ?? value,
    suffix: match?.[2] ?? "",
    angleWrapped,
  };
}

function rewriteDestination(source, destination, image) {
  const { url, suffix } = splitDestination(destination);
  if (
    !url ||
    url.startsWith("#") ||
    url.startsWith("/") ||
    url.startsWith("//") ||
    /^[a-z][a-z0-9+.-]*:/i.test(url)
  ) {
    return destination;
  }

  const pieces = url.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  if (!pieces) return destination;
  const [, rawPath, query = "", fragment = ""] = pieces;
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(rawPath);
  } catch {
    decodedPath = rawPath;
  }
  const target = posix.normalize(posix.join(posix.dirname(source), decodedPath));

  if (pageBySource.has(target)) {
    return `${GITHUB}/wiki/${pageBySource.get(target)}${fragment}${suffix}`;
  }

  const encodedTarget = encodePath(target);
  if (trackedFileSet.has(target)) {
    const base = image
      ? `https://raw.githubusercontent.com/${REPOSITORY}/${commit}/${encodedTarget}`
      : `${GITHUB}/blob/${commit}/${encodedTarget}`;
    return `${base}${query}${fragment}${suffix}`;
  }

  const directoryPrefix = target.endsWith("/") ? target : `${target}/`;
  if (trackedFiles.some((file) => file.startsWith(directoryPrefix))) {
    return `${GITHUB}/tree/${commit}/${encodePath(target)}${fragment}${suffix}`;
  }

  unresolvedLinks.push(`${source} -> ${url}`);
  return destination;
}

function rewriteMarkdown(source, content) {
  let fence = null;
  const lines = content.split("\n");
  return lines
    .map((line) => {
      const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
      if (fenceMatch) {
        const marker = fenceMatch[1];
        if (!fence) {
          fence = { character: marker[0], length: marker.length };
        } else if (marker[0] === fence.character && marker.length >= fence.length) {
          fence = null;
        }
        return line;
      }
      if (fence) return line;

      let rewritten = line.replace(
        /(!?\[[^\]]*\])\((<[^>]+>|[^)\s]+)(\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\)/g,
        (whole, label, destination, title = "") => {
          const isImage = label.startsWith("!");
          return `${label}(${rewriteDestination(source, `${destination}${title}`, isImage)})`;
        },
      );

      rewritten = rewritten.replace(
        /^(\s*\[[^\]]+\]:\s*)(\S+)(.*)$/,
        (whole, prefix, destination, rest) =>
          `${prefix}${rewriteDestination(source, destination, false)}${rest}`,
      );

      rewritten = rewritten.replace(
        /\b(src|href)=("|')([^"']+)\2/g,
        (whole, attribute, quote, destination) =>
          `${attribute}=${quote}${rewriteDestination(source, destination, attribute === "src")}${quote}`,
      );

      return rewritten;
    })
    .join("\n");
}

function sourceLink(source) {
  return `${GITHUB}/blob/${commit}/${encodePath(source)}`;
}

function wikiLink(slug, label) {
  return `[${label}](${GITHUB}/wiki/${slug})`;
}

const sourcePages = [];
for (const source of markdownFiles) {
  const sourceContent = readAtCommit(source);
  const slug = pageBySource.get(source);
  const title = titleFrom(sourceContent, source);
  const provenance = `> Canonical source: [\`${source}\`](${sourceLink(source)}) · Snapshot commit: [\`${commit.slice(0, 12)}\`](${GITHUB}/commit/${commit})\n\n`;
  const content = `${provenance}${rewriteMarkdown(source, sourceContent).trimEnd()}\n`;
  writeFileSync(join(outputDirectory, `${slug}.md`), content);
  sourcePages.push({ source, slug, title, content, sourceDigest: sha256(sourceContent) });
}

if (unresolvedLinks.length > 0) {
  throw new Error(`Unresolved local links:\n${unresolvedLinks.join("\n")}`);
}

const generatedPageSlugs = new Set([
  ...sourcePages.map((page) => page.slug),
  "_Sidebar",
  "Home",
  "Asset-Catalog",
  "Documentation-Changelog",
  "_Footer",
  "Page-Audit",
]);
const preservedLivePages = [];
let priorChangelog = null;

if (priorWikiDirectory) {
  const priorAuditPath = join(priorWikiDirectory, "Page-Audit.md");
  if (!existsSync(priorAuditPath)) {
    throw new Error("Prior Wiki has no Page-Audit.md; generator ownership cannot be proven safely");
  }
  const priorAudit = readFileSync(priorAuditPath, "utf8");
  const priorGeneratorOwnedAudit = priorAudit
    .split("\n")
    .filter((line) => line.startsWith("| ") && !line.startsWith("| Preserved live-only page:"))
    .join("\n");
  const priorOwnedSlugs = new Set(
    [...priorGeneratorOwnedAudit.matchAll(new RegExp(`${GITHUB.replaceAll("/", "\\/")}\\/wiki\\/([A-Za-z0-9_-]+)`, "g"))]
      .map((match) => decodeURIComponent(match[1])),
  );
  priorOwnedSlugs.add("Page-Audit");

  const removedOwnedSlugs = [...priorOwnedSlugs].filter((slug) => !generatedPageSlugs.has(slug));
  if (removedOwnedSlugs.length) {
    throw new Error(
      `Refusing to remove prior generator-owned Wiki pages without an explicit recoverable removal decision: ${removedOwnedSlugs.join(", ")}`,
    );
  }

  const priorMarkdownFiles = readdirSync(priorWikiDirectory)
    .filter((file) => file.endsWith(".md"))
    .sort(naturalCompare);
  for (const file of priorMarkdownFiles) {
    const slug = file.slice(0, -3);
    if (priorOwnedSlugs.has(slug)) continue;
    if (generatedPageSlugs.has(slug)) {
      throw new Error(`Prior live-only Wiki page collides with a generated page: ${file}`);
    }
    const content = readFileSync(join(priorWikiDirectory, file), "utf8");
    preservedLivePages.push({ file, slug, content });
  }

  const priorChangelogPath = join(priorWikiDirectory, "Documentation-Changelog.md");
  if (existsSync(priorChangelogPath)) {
    priorChangelog = readFileSync(priorChangelogPath, "utf8");
  }
}

function groupFor(source) {
  if (source.startsWith("docs/discovery/")) return "Discovery and research";
  if (/^docs\/(product|design|architecture|project)\//.test(source)) {
    return "Product, experience, architecture, and delivery";
  }
  if (source.startsWith("docs/council/agents/") || source.startsWith("docs/council/")) {
    return "Governance and council";
  }
  if (/^docs\/prototypes\/v\d+\/COUNCIL/.test(source)) return "Prototype councils";
  if (/^docs\/prototypes\/CALENDAR-UI-PROTOTYPE/.test(source)) return "Prototype handoffs";
  if (/^prototypes\/calendar-ui\/README/.test(source)) return "Prototype run guides";
  if (/^design-qa/.test(source) || source.startsWith("docs/audits/")) return "QA and audits";
  return "Repository and project record";
}

const groups = [
  "Product, experience, architecture, and delivery",
  "Discovery and research",
  "Governance and council",
  "Prototype handoffs",
  "Prototype run guides",
  "Prototype councils",
  "QA and audits",
  "Repository and project record",
];

const sidebar = ["# Life in Days", "", wikiLink("Home", "Home"), ""];
for (const group of groups) {
  sidebar.push(`## ${group}`, "");
  const pages = sourcePages
    .filter((page) => groupFor(page.source) === group)
    .sort((left, right) => naturalCompare(left.slug, right.slug));
  for (const page of pages) sidebar.push(`- ${wikiLink(page.slug, page.title)}`);
  sidebar.push("");
}
if (preservedLivePages.length) {
  sidebar.push("## Preserved live-only pages", "");
  for (const page of preservedLivePages) {
    sidebar.push(`- ${wikiLink(page.slug, titleFrom(page.content, page.file))}`);
  }
  sidebar.push("");
}
sidebar.push(
  "## Evidence and maintenance",
  "",
  `- ${wikiLink("Asset-Catalog", "Asset catalog")}`,
  `- ${wikiLink("Page-Audit", "Page audit")}`,
  `- ${wikiLink("Documentation-Changelog", "Documentation changelog")}`,
  "",
);
const sidebarContent = `${sidebar.join("\n").trimEnd()}\n`;
writeFileSync(join(outputDirectory, "_Sidebar.md"), sidebarContent);

function statusTableValue(markdown, label) {
  const row = markdown
    .split("\n")
    .find((line) => line.startsWith(`| ${label} |`));
  if (!row) throw new Error(`README current-state row is missing: ${label}`);
  const cells = row.split("|").map((cell) => cell.trim());
  if (!cells[2]) throw new Error(`README current-state row has no value: ${label}`);
  return cells[2];
}

const readmeAtCommit = readAtCommit("README.md");
const manifestAtCommit = JSON.parse(readAtCommit("docs/project/PHASE1-ROADMAP-MANIFEST.json"));
const executionAuthorizationSource = "docs/council/execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md";
if (!trackedFileSet.has(executionAuthorizationSource)) {
  throw new Error(`Committed execution authorization is missing: ${executionAuthorizationSource}`);
}
const executionAuthorizationAtCommit = readAtCommit(executionAuthorizationSource);
const deploymentState = "Unknown — private read authority pending";
if (
  manifestAtCommit.project?.deploymentState !== deploymentState ||
  !executionAuthorizationAtCommit.includes(deploymentState)
) {
  throw new Error("Manifest and execution authorization do not agree on the deployment state");
}

const roadmapState = `${manifestAtCommit.summary.taskCount} tasks: ${manifestAtCommit.summary.statusCounts.Backlog} Backlog, ${manifestAtCommit.summary.statusCounts.Next} Next, ${manifestAtCommit.summary.statusCounts["In progress"]} In progress, ${manifestAtCommit.summary.statusCounts.Done} planning-scoped Done`;
const executionState = statusTableValue(readmeAtCommit, "P0 execution authority");
const r0State = statusTableValue(readmeAtCommit, "R0 shared-host coexistence spike");
const prototypeState = statusTableValue(readmeAtCommit, "Latest frozen UI prototype");
const implementationState = statusTableValue(readmeAtCommit, "Product implementation and deployment");
const r10State = statusTableValue(readmeAtCommit, "Conditional storage transition");
if (!implementationState.includes(deploymentState)) {
  throw new Error("README implementation/deployment state does not include the required unknown-live-state phrase");
}

const hero = `https://raw.githubusercontent.com/${REPOSITORY}/${commit}/docs/prototypes/v7/calendar-landing-light-1280-v7.png`;
const homeContent = `# Life in Days\n\n> **Planning baseline and fictional static prototypes—not a working or deployed application.** No live integration, persistence, authentication, backup, recovery, accessibility-conformance, or production-readiness claim is made.\n\n![Life in Days fictional calendar prototype](${hero})\n\nLife in Days is a proposed private, single-user visual memory archive for textual VoiceNotes journals, Telegram photos, and manually uploaded text journals. It organizes source material into calendar-based **Journal Days** while keeping authentic content distinct from AI-derived titles, summaries, tags, briefs, and artwork.\n\n## Current state\n\n| Area | State |\n| --- | --- |\n| Roadmap | ${roadmapState} |\n| Execution authority | ${executionState} |\n| R0 spike | ${r0State} |\n| Static prototype | ${prototypeState} |\n| Implementation and deployment | ${implementationState} |\n| Conditional transition | ${r10State} |\n\n## Read the project\n\n| Need | Page |\n| --- | --- |\n| Product promise and boundaries | ${wikiLink("Shared-Understanding", "Shared Understanding")} |\n| Complete product contract | ${wikiLink("Product-Requirements", "Product Requirements")} |\n| Current execution authority | ${wikiLink(pageBySource.get(executionAuthorizationSource), "P0 Execution Authorization")} |\n| Screen, flow, and accessibility specification | ${wikiLink("UX-Specification", "UX Specification")} |\n| Proposed technical shape | ${wikiLink("Implementation-Plan", "Implementation Plan")} |\n| Gates, tasks, risks, and decisions | ${wikiLink("Project-Tracker", "Project Tracker")} |\n| Requirement-by-requirement coverage | ${wikiLink("Requirements-Traceability", "Requirements Traceability")} |\n| Versioned prototype roadmap | ${wikiLink("Prototype-Completeness-Tracker", "Prototype Completeness Tracker")} |\n| Every canonical document | ${wikiLink("Documentation-Index", "Documentation Index")} |\n| Code, screenshots, and non-document files | ${wikiLink("Asset-Catalog", "Asset Catalog")} |\n\n## Non-negotiable privacy boundary\n\n- Real photos and data derived from real photos never go to AI providers.\n- Authentic sources remain separate from Corrections, revisions, and derived artifacts.\n- Journal Dates use fixed \`Asia/Kolkata\` time and preserve immutable original timestamps.\n- The MVP has no sharing, public links, reminders, AI coaching, or historical import.\n- Repository examples and media remain fictional.\n\n## About this Wiki\n\nThis Wiki contains a full page for every Markdown artifact in repository commit [\`${commit.slice(0, 12)}\`](${GITHUB}/commit/${commit}). Relative document links are translated to Wiki pages; source code and media links are pinned to that commit. The Git-tracked documents remain authoritative. Current state is parsed from committed README/manifest/authorization evidence and validated during generation. See the ${wikiLink("Page-Audit", "page audit")} for the one-to-one source mapping.\n`;
writeFileSync(join(outputDirectory, "Home.md"), homeContent);

const nonMarkdownFiles = trackedFiles.filter((file) => !file.toLowerCase().endsWith(".md"));

function assetCategory(file) {
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(file)) return "Prototype screenshots and visual evidence";
  if (file.startsWith("prototypes/calendar-ui/")) return "Prototype implementation";
  if (file.startsWith(".github/")) return "GitHub repository configuration";
  if (file.startsWith("tools/")) return "Repository tooling";
  return "Repository support files";
}

const assetRows = nonMarkdownFiles.map((file) => {
  const content = readAtCommit(file, null);
  return {
    file,
    category: assetCategory(file),
    bytes: content.length,
    digest: sha256(content),
  };
});
const categoryCounts = new Map();
for (const row of assetRows) {
  categoryCounts.set(row.category, (categoryCounts.get(row.category) ?? 0) + 1);
}
const assetCatalog = [
  "# Asset catalog",
  "",
  `This catalog covers every non-Markdown file in repository commit [\`${commit.slice(0, 12)}\`](${GITHUB}/commit/${commit}). It records ${assetRows.length} files; Markdown artifacts are covered separately by the ${wikiLink("Page-Audit", "page audit")}.`,
  "",
  "> Images and UI content are fictional prototype fixtures. Catalog presence is not evidence of implementation, integration, deployment, or production readiness.",
  "",
  "## Inventory summary",
  "",
  "| Category | Files |",
  "| --- | ---: |",
  ...[...categoryCounts.entries()]
    .sort(([left], [right]) => naturalCompare(left, right))
    .map(([category, count]) => `| ${category} | ${count} |`),
  "",
  "## Complete file inventory",
  "",
  "| Source artifact | Category | Bytes | SHA-256 |",
  "| --- | --- | ---: | --- |",
  ...assetRows.map(
    ({ file, category, bytes, digest }) =>
      `| [\`${file}\`](${GITHUB}/blob/${commit}/${encodePath(file)}) | ${category} | ${bytes} | \`${digest}\` |`,
  ),
  "",
].join("\n");
writeFileSync(join(outputDirectory, "Asset-Catalog.md"), assetCatalog);

const publicationEntry = `## ${commitDate.slice(0, 10)} — source snapshot ${commit.slice(0, 12)}\n\n- Generated a one-to-one publication candidate for all ${sourcePages.length} Markdown artifacts at repository commit [\`${commit.slice(0, 12)}\`](${GITHUB}/commit/${commit}).\n- Rewrote relative document links, pinned code/media to the exact commit, and cataloged ${assetRows.length} non-Markdown artifacts.\n- Preserved ${preservedLivePages.length} proven live-only page(s) from the supplied prior Wiki snapshot.\n- This entry records generated source identity; remote publication is verified separately after normal Wiki push.\n`;
const priorChangelogBody = priorChangelog
  ? priorChangelog
    .replace(/^# Documentation changelog\s*/i, "")
    .replace(/\n*Future Wiki refreshes[^\n]*(?:\n|$)/g, "\n")
    .trim()
  : "";
const commitAlreadyRecorded = priorChangelog?.includes(commit) === true;
const changelogSections = commitAlreadyRecorded
  ? priorChangelogBody
  : [publicationEntry.trim(), priorChangelogBody].filter(Boolean).join("\n\n");
const changelogContent = `# Documentation changelog\n\n${changelogSections}\n\nFuture Wiki refreshes must be generated from a committed repository revision using [\`tools/build-wiki.mjs\`](${GITHUB}/blob/${commit}/tools/build-wiki.mjs) and the complete prior Wiki clone.\n`;
writeFileSync(join(outputDirectory, "Documentation-Changelog.md"), changelogContent);

const footerContent = `Generated from [${REPOSITORY}@${commit.slice(0, 12)}](${GITHUB}/commit/${commit}) · Canonical content lives in Git · Fictional prototype data only\n`;
writeFileSync(join(outputDirectory, "_Footer.md"), footerContent);

for (const page of preservedLivePages) {
  copyFileSync(join(priorWikiDirectory, page.file), join(outputDirectory, page.file));
}

const auditCandidates = [
  ...sourcePages.map((page) => ({
    source: page.source,
    page: page.slug,
    content: page.content,
    sourceDigest: page.sourceDigest,
  })),
  { source: "Generated Wiki navigation", page: "_Sidebar", content: sidebarContent },
  { source: "Generated Wiki landing page", page: "Home", content: homeContent },
  { source: "Generated non-Markdown inventory", page: "Asset-Catalog", content: assetCatalog },
  { source: "Generated publication record", page: "Documentation-Changelog", content: changelogContent },
  { source: "Generated Wiki footer", page: "_Footer", content: footerContent },
  ...preservedLivePages.map((page) => ({
    source: `Preserved live-only page: ${page.file}`,
    page: page.slug,
    content: page.content,
  })),
];
const pageAuditContent = [
  "# Page audit",
  "",
  `Repository snapshot: [\`${commit}\`](${GITHUB}/commit/${commit})`,
  "",
  `Coverage: **${sourcePages.length} of ${markdownFiles.length} Markdown sources mapped exactly once**. The table also fingerprints generated navigation/catalog pages and ${preservedLivePages.length} preserved live-only page(s). This audit page omits its own hash to avoid a recursive fingerprint.`,
  "",
  "| Canonical source | Wiki page | Source SHA-256 | Generated SHA-256 |",
  "| --- | --- | --- | --- |",
  ...auditCandidates.map(({ source, page, content, sourceDigest }) => {
    const sourceCell = pageBySource.has(source)
      ? `[\`${source}\`](${sourceLink(source)})`
      : source;
    return `| ${sourceCell} | ${wikiLink(page, page)} | ${sourceDigest ? `\`${sourceDigest}\`` : "Generated"} | \`${sha256(content)}\` |`;
  }),
  "",
  "## Validation contract",
  "",
  "- Every Markdown file in the snapshot maps to one collision-free Wiki filename.",
  "- Every mapped page carries a canonical source link and snapshot commit.",
  "- Relative Markdown links point to mapped Wiki pages.",
  "- Relative code, directory, and media links point to the exact repository commit.",
  "- Every source page appears in the generated sidebar.",
  "- A supplied prior Wiki must have a valid Page Audit; unexpected live-only pages are preserved and indexed.",
  "- Prior generator-owned pages are never removed silently; an explicit recoverable removal decision is required.",
  "",
].join("\n");
writeFileSync(join(outputDirectory, "Page-Audit.md"), pageAuditContent);

const expectedFiles = sourcePages.length + 6 + preservedLivePages.length;
const generatedFiles = readdirSync(outputDirectory).filter((file) => file.endsWith(".md"));
if (generatedFiles.length !== expectedFiles) {
  throw new Error(`Expected ${expectedFiles} Wiki files, generated ${generatedFiles.length}`);
}
for (const page of sourcePages) {
  if (!sidebarContent.includes(`${GITHUB}/wiki/${page.slug}`)) {
    throw new Error(`Sidebar is missing ${page.slug}`);
  }
}

process.stdout.write(
  `${JSON.stringify(
    {
      repository: REPOSITORY,
      commit,
      markdownSources: markdownFiles.length,
      nonMarkdownAssets: assetRows.length,
      wikiFiles: generatedFiles.length,
      priorWikiSupplied: Boolean(priorWikiDirectory),
      preservedLiveOnlyPages: preservedLivePages.map((page) => page.file),
      outputDirectory,
    },
    null,
    2,
  )}\n`,
);
