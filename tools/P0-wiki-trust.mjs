#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { basename, isAbsolute, join, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPOSITORY = "arunpr614/Life-Reflection";
const GITHUB = `https://github.com/${REPOSITORY}`;
const SAFE_EXPLICIT_ID = /^[A-Za-z][A-Za-z0-9_.:-]*$/;
const SENSITIVE_PATTERNS = Object.freeze([
  { name: "local absolute user path", pattern: /\/(?:Users|home)\/[A-Za-z0-9._-]+\// },
  { name: "file URL", pattern: /file:\/\//i },
  { name: "GitHub token", pattern: /(?:github_pat_|gh[pousr]_)[A-Za-z0-9_]{20,}/ },
  { name: "bearer credential", pattern: /Bearer\s+[A-Za-z0-9._-]{12,}/i },
  { name: "AWS access key", pattern: /AKIA[0-9A-Z]{16}/ },
  { name: "Slack token", pattern: /xox[baprs]-[A-Za-z0-9-]{10,}/ },
  { name: "private key", pattern: /BEGIN\s+[^\n]*PRIVATE\s+KEY/i },
  { name: "Project node ID", pattern: /(?:(?:PVT|PVTI|PVTF|PVTSSF|PVTSI|PVTV|PVTL)_[A-Za-z0-9_-]{8,}|I_kw[A-Za-z0-9_-]{6,}|MDQ6[A-Za-z0-9+/=_-]{8,})/ },
]);

function fail(message) {
  throw new Error(`P0_WIKI_TRUST_FAILED: ${message}`);
}

function normalizePageName(value) {
  return value.normalize("NFKC").toLocaleLowerCase("en-US");
}

function decodeEntities(value) {
  const entities = new Map([
    ["amp", "&"],
    ["lt", "<"],
    ["gt", ">"],
    ["quot", '"'],
    ["apos", "'"],
    ["nbsp", " "],
  ]);
  return value.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (whole, decimal, hexadecimal, named) => {
    if (decimal) return String.fromCodePoint(Number.parseInt(decimal, 10));
    if (hexadecimal) return String.fromCodePoint(Number.parseInt(hexadecimal, 16));
    return entities.get(named.toLowerCase()) ?? whole;
  });
}

function renderedHeadingText(value) {
  return decodeEntities(value)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/`+/g, "")
    .trim();
}

export function githubHeadingBase(value) {
  const text = renderedHeadingText(value).toLocaleLowerCase("en-US");
  let result = "";
  for (const character of text) {
    if (/\s/u.test(character)) {
      result += "-";
    } else if (character === "-" || character === "_" || /[\p{Letter}\p{Number}\p{Mark}]/u.test(character)) {
      result += character;
    }
  }
  return result;
}

export function createGithubSlugger() {
  const used = new Set();
  return Object.freeze({
    slug(heading) {
      const base = githubHeadingBase(heading);
      if (!base) fail(`heading has no GitHub-compatible anchor: ${heading}`);
      let candidate = base;
      let suffix = 0;
      while (used.has(candidate)) {
        suffix += 1;
        candidate = `${base}-${suffix}`;
      }
      used.add(candidate);
      return candidate;
    },
    used,
  });
}

function unfencedLines(markdown) {
  let fence = null;
  return markdown.split("\n").map((line, index) => {
    const match = line.match(/^\s*(`{3,}|~{3,})/);
    if (match) {
      const marker = match[1];
      if (!fence) fence = { character: marker[0], length: marker.length };
      else if (marker[0] === fence.character && marker.length >= fence.length) fence = null;
      return { line, lineNumber: index + 1, fenced: true };
    }
    return { line, lineNumber: index + 1, fenced: Boolean(fence) };
  });
}

export function collectMarkdownAnchors(markdown, label = "Markdown") {
  if (typeof markdown !== "string") fail(`${label} is not text`);
  const slugger = createGithubSlugger();
  const anchors = new Set();
  const explicit = new Set();
  for (const { line, lineNumber, fenced } of unfencedLines(markdown)) {
    if (fenced) continue;
    const heading = line.match(/^ {0,3}(#{1,6})(?:[ \t]+|$)(.*?)(?:[ \t]+#+[ \t]*)?$/);
    if (heading) {
      const anchor = slugger.slug(heading[2]);
      if (anchors.has(anchor)) fail(`${label}:${lineNumber} collides on anchor #${anchor}`);
      anchors.add(anchor);
    }
    const idLikeTags = line.match(/<[^>]+\bid\s*=\s*[^>]+>/gi) ?? [];
    const validIds = [...line.matchAll(/<[^>]+\bid\s*=\s*(["'])([^"']+)\1[^>]*>/gi)];
    if (idLikeTags.length !== validIds.length) fail(`${label}:${lineNumber} has a malformed explicit id`);
    for (const match of validIds) {
      const id = decodeEntities(match[2]);
      if (!SAFE_EXPLICIT_ID.test(id)) fail(`${label}:${lineNumber} has unsupported explicit id ${id}`);
      if (anchors.has(id) || explicit.has(id)) fail(`${label}:${lineNumber} duplicates explicit/heading id #${id}`);
      explicit.add(id);
      anchors.add(id);
    }
  }
  return Object.freeze({ anchors, explicit, headingCount: slugger.used.size });
}

function splitDestination(destination) {
  const trimmed = destination.trim();
  const angleWrapped = trimmed.startsWith("<") && trimmed.endsWith(">");
  const value = angleWrapped ? trimmed.slice(1, -1) : trimmed;
  const match = value.match(/^(\S+?)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?$/);
  return match?.[1] ?? value;
}

export function extractMarkdownLinks(markdown) {
  const links = [];
  for (const { line, lineNumber, fenced } of unfencedLines(markdown)) {
    if (fenced) continue;
    const withoutInlineCode = line.replace(/(`+)(.*?)\1/g, (whole) => " ".repeat(whole.length));
    for (const match of withoutInlineCode.matchAll(/(!?\[[^\]]*\])\((<[^>]+>|[^)\s]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\)/g)) {
      links.push({ destination: splitDestination(match[2]), image: match[1].startsWith("!"), lineNumber });
    }
    const definition = withoutInlineCode.match(/^\s*\[[^\]]+\]:\s*(\S+)/);
    if (definition) links.push({ destination: splitDestination(definition[1]), image: false, lineNumber });
    for (const match of withoutInlineCode.matchAll(/\b(src|href)=(["'])([^"']+)\2/g)) {
      links.push({ destination: match[3], image: match[1] === "src", lineNumber });
    }
  }
  return links;
}

function decodedFragment(value, label) {
  if (!value) return null;
  try {
    return decodeURIComponent(value.replace(/^#/, ""));
  } catch {
    fail(`${label} contains an invalid percent-encoded fragment`);
  }
}

function parseDestination(destination) {
  const match = destination.match(/^([^?#]*)(?:\?[^#]*)?(#.*)?$/);
  return match ? { rawPath: match[1], fragment: match[2] ?? "" } : null;
}

function isExternal(destination) {
  return destination.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(destination);
}

function assertFragment(anchorIndex, fragment, label) {
  if (!fragment) return;
  const decoded = decodedFragment(fragment, label);
  if (!anchorIndex?.anchors.has(decoded)) fail(`${label} targets missing fragment #${decoded}`);
}

export function validateSourceMarkdownGraph({ documents, trackedPaths }) {
  const entries = documents instanceof Map ? [...documents.entries()] : Object.entries(documents ?? {});
  const tracked = trackedPaths instanceof Set ? trackedPaths : new Set(trackedPaths ?? entries.map(([path]) => path));
  const markdownPaths = new Set(entries.map(([path]) => path));
  const anchors = new Map(entries.map(([path, content]) => [path, collectMarkdownAnchors(content, path)]));
  let checkedLinks = 0;
  let checkedFragments = 0;
  for (const [source, content] of entries) {
    for (const link of extractMarkdownLinks(content)) {
      const destination = link.destination;
      if (!destination || isExternal(destination) || destination.startsWith("/")) continue;
      const parsed = parseDestination(destination);
      if (!parsed) continue;
      let decodedPath;
      try {
        decodedPath = decodeURIComponent(parsed.rawPath);
      } catch {
        fail(`${source}:${link.lineNumber} contains an invalid percent-encoded path`);
      }
      const target = decodedPath
        ? posix.normalize(posix.join(posix.dirname(source), decodedPath))
        : source;
      const directoryPrefix = target.endsWith("/") ? target : `${target}/`;
      if (!tracked.has(target) && ![...tracked].some((path) => path.startsWith(directoryPrefix))) {
        fail(`${source}:${link.lineNumber} targets missing local path ${destination}`);
      }
      checkedLinks += 1;
      if (parsed.fragment && markdownPaths.has(target)) {
        assertFragment(anchors.get(target), parsed.fragment, `${source}:${link.lineNumber} -> ${target}`);
        checkedFragments += 1;
      }
    }
  }
  return Object.freeze({ markdownSources: entries.length, checkedLinks, checkedFragments, anchors });
}

function generatedTarget(destination, currentPage, pageNames) {
  if (!destination) return null;
  const parsed = parseDestination(destination);
  if (!parsed) return null;
  if (destination.startsWith(`${GITHUB}/wiki/`)) {
    const suffix = destination.slice(`${GITHUB}/wiki/`.length);
    const wikiParsed = parseDestination(suffix);
    if (!wikiParsed) return null;
    return { page: decodeURIComponent(wikiParsed.rawPath), fragment: wikiParsed.fragment };
  }
  if (isExternal(destination) || destination.startsWith("/")) return null;
  if (!parsed.rawPath) return { page: currentPage, fragment: parsed.fragment };
  let page = decodeURIComponent(parsed.rawPath).replace(/\.md$/i, "");
  if (!pageNames.has(page)) return { page, fragment: parsed.fragment, missingCandidate: true };
  return { page, fragment: parsed.fragment };
}

export function assertWikiPublicSafety(pages) {
  const entries = pages instanceof Map ? [...pages.entries()] : Object.entries(pages ?? {});
  for (const [page, content] of entries) {
    for (const check of SENSITIVE_PATTERNS) {
      if (check.pattern.test(content)) fail(`${page}.md contains prohibited public ${check.name}`);
    }
  }
  return Object.freeze({ pagesScanned: entries.length, sensitiveMatches: 0 });
}

export function validateGeneratedWiki({
  pages,
  sourceDocuments,
  pageBySource,
  commit,
}) {
  const pageEntries = pages instanceof Map ? [...pages.entries()] : Object.entries(pages ?? {});
  const pageNames = new Set();
  const normalizedNames = new Map();
  for (const [page, content] of pageEntries) {
    if (!/^[A-Za-z0-9_-]+$/.test(page) || typeof content !== "string") fail(`invalid generated Wiki page ${page}`);
    if (pageNames.has(page)) fail(`duplicate generated Wiki page ${page}`);
    const normalized = normalizePageName(page);
    if (normalizedNames.has(normalized)) fail(`normalized Wiki page collision: ${normalizedNames.get(normalized)} and ${page}`);
    normalizedNames.set(normalized, page);
    pageNames.add(page);
  }
  const requiredGeneratedPages = ["_Sidebar", "Home", "Asset-Catalog", "Documentation-Changelog", "_Footer", "Page-Audit"];
  for (const page of requiredGeneratedPages) {
    if (!pageNames.has(page)) fail(`required generated Wiki page is missing: ${page}`);
  }
  const anchorIndex = new Map(pageEntries.map(([page, content]) => [page, collectMarkdownAnchors(content, `${page}.md`)]));
  let checkedLinks = 0;
  let checkedFragments = 0;
  for (const [page, content] of pageEntries) {
    for (const link of extractMarkdownLinks(content)) {
      const target = generatedTarget(link.destination, page, pageNames);
      if (!target) continue;
      if (!pageNames.has(target.page)) fail(`${page}.md:${link.lineNumber} targets missing Wiki page ${target.page}`);
      checkedLinks += 1;
      if (target.fragment) {
        assertFragment(anchorIndex.get(target.page), target.fragment, `${page}.md:${link.lineNumber} -> ${target.page}`);
        checkedFragments += 1;
      }
    }
  }
  const sourceEntries = sourceDocuments instanceof Map ? [...sourceDocuments.entries()] : Object.entries(sourceDocuments ?? {});
  const mapping = pageBySource instanceof Map ? pageBySource : new Map(Object.entries(pageBySource ?? {}));
  if (mapping.size !== sourceEntries.length) fail("source-to-Wiki mapping is not one-to-one");
  const mappedPages = [...mapping.values()];
  if (new Set(mappedPages).size !== mappedPages.length) fail("source-to-Wiki mapping contains a page collision");
  for (const [source] of sourceEntries) {
    const page = mapping.get(source);
    const content = pages instanceof Map ? pages.get(page) : pages?.[page];
    if (!page || typeof content !== "string") fail(`missing generated source page for ${source}`);
    const sourceUrl = `${GITHUB}/blob/${commit}/${source.split("/").map(encodeURIComponent).join("/")}`;
    if (!content.includes(sourceUrl) || !content.includes(`${GITHUB}/commit/${commit}`)) {
      fail(`${page}.md lacks exact source/commit provenance for ${source}`);
    }
  }
  const sidebar = pages instanceof Map ? pages.get("_Sidebar") : pages?.["_Sidebar"];
  for (const page of mapping.values()) {
    if (!sidebar.includes(`${GITHUB}/wiki/${page}`)) fail(`generated sidebar is missing source page ${page}`);
  }
  const audit = pages instanceof Map ? pages.get("Page-Audit") : pages?.["Page-Audit"];
  if (typeof audit !== "string") fail("generated Wiki has no Page-Audit page");
  const coverage = audit.match(/Coverage: \*\*(\d+) of (\d+) Markdown sources mapped exactly once\*\*/);
  if (!coverage || Number(coverage[1]) !== sourceEntries.length || Number(coverage[2]) !== sourceEntries.length) {
    fail(`Page Audit coverage is not current ${sourceEntries.length}/${sourceEntries.length}`);
  }
  const auditTableLines = audit.split("\n").filter((line) => line.startsWith("| "));
  if (auditTableLines.some((line) => line.includes(`${GITHUB}/wiki/Page-Audit`) && /`[0-9a-f]{64}`/.test(line))) {
    fail("Page Audit contains a recursive hash of itself");
  }
  for (const [source, page] of mapping) {
    const sourceToken = `\`${source}\``;
    const pageToken = `${GITHUB}/wiki/${page}`;
    const matches = auditTableLines.filter((line) => line.includes(sourceToken) && line.includes(pageToken));
    if (matches.length !== 1) fail(`Page Audit does not map ${source} to ${page} exactly once`);
  }
  const publicSafety = assertWikiPublicSafety(pages);
  return Object.freeze({
    wikiFiles: pageEntries.length,
    markdownSources: sourceEntries.length,
    sourceCoverage: `${sourceEntries.length}/${sourceEntries.length}`,
    checkedLinks,
    checkedFragments,
    normalizedCollisions: 0,
    recursiveAuditHashes: 0,
    ...publicSafety,
  });
}

export function validateWikiTrust(input) {
  const source = validateSourceMarkdownGraph({
    documents: input.sourceDocuments,
    trackedPaths: input.trackedPaths,
  });
  const generated = validateGeneratedWiki(input);
  return Object.freeze({ passed: true, source, generated });
}

function usage() {
  return `Usage: node tools/P0-wiki-trust.mjs --wiki-directory <directory> [--revision <commit>]

Validates source and generated Wiki links, fragments, anchors, coverage, collisions, provenance, and public safety.

Options:
  --wiki-directory <path>  Complete generated Wiki directory to validate.
  --revision <commit>       Exact repository revision represented by the Wiki (default: HEAD).
  --help                    Show this help without reading or writing repository state.
`;
}

function parseCli(argv) {
  if (argv.length === 1 && ["--help", "-h"].includes(argv[0])) return { help: true };
  if (argv.some((arg) => ["--help", "-h"].includes(arg))) fail("--help cannot be combined with other options");
  const parsed = { revision: "HEAD", wikiDirectory: null };
  const options = new Map([["--revision", "revision"], ["--wiki-directory", "wikiDirectory"]]);
  const seen = new Set();
  for (let index = 0; index < argv.length; index += 1) {
    const option = argv[index];
    if (!options.has(option)) fail(`unknown option: ${option}`);
    if (seen.has(option)) fail(`duplicate option: ${option}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("-")) fail(`${option} requires one non-option value`);
    parsed[options.get(option)] = value;
    seen.add(option);
    index += 1;
  }
  if (!parsed.wikiDirectory) fail("--wiki-directory is required");
  return parsed;
}

function git(repoRoot, args, options = {}) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: Object.hasOwn(options, "encoding") ? options.encoding : "utf8",
    maxBuffer: 128 * 1024 * 1024,
  });
}

function wikiSlugFromPage(content, file) {
  const canonical = content.match(/^> Canonical source: \[`([^`]+)`\]/m)?.[1];
  return canonical ? [canonical, basename(file, ".md")] : null;
}

async function main() {
  const options = parseCli(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }
  const repoRoot = git(process.cwd(), ["rev-parse", "--show-toplevel"]).trim();
  const commit = git(repoRoot, ["rev-parse", `${options.revision}^{commit}`]).trim();
  const trackedPaths = git(repoRoot, ["ls-tree", "-r", "-z", "--name-only", commit]).split("\0").filter(Boolean);
  const markdownPaths = trackedPaths.filter((path) => path.toLowerCase().endsWith(".md"));
  const sourceDocuments = new Map(markdownPaths.map((path) => [
    path,
    git(repoRoot, ["show", `${commit}:${path}`]),
  ]));
  const wikiDirectory = isAbsolute(options.wikiDirectory)
    ? options.wikiDirectory
    : resolve(process.cwd(), options.wikiDirectory);
  const wikiFiles = readdirSync(wikiDirectory).filter((file) => file.endsWith(".md"));
  const pages = new Map(wikiFiles.map((file) => [basename(file, ".md"), readFileSync(join(wikiDirectory, file), "utf8")]));
  const pageBySource = new Map(
    wikiFiles
      .map((file) => wikiSlugFromPage(pages.get(basename(file, ".md")), file))
      .filter(Boolean),
  );
  process.stdout.write(`${JSON.stringify(validateWikiTrust({
    sourceDocuments,
    trackedPaths,
    pages,
    pageBySource,
    commit,
  }), null, 2)}\n`);
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
