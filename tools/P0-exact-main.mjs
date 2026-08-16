import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const CANONICAL_ORIGIN_URL = "https://github.com/arunpr614/Life-Reflection.git";
export const FULL_GIT_REVISION_PATTERN = /^[0-9a-f]{40}$/;

const DEFAULT_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const messages = Object.freeze({
  PREFLIGHT_ORIGIN_URL: [
    "The origin remote is not the canonical public repository URL.",
    "Set origin to the canonical HTTPS URL and retry.",
  ],
  PREFLIGHT_WORKTREE_IDENTITY: [
    "The checkout is not the owner-pinned Phase1 linked worktree.",
    "Select the existing registered Phase1 worktree and retry.",
  ],
  PREFLIGHT_FETCH: [
    "The fresh origin/main fetch did not complete.",
    "Restore public Git access and retry the exact-main preflight.",
  ],
  PREFLIGHT_DETACHED: [
    "The checkout is detached.",
    "Use a non-detached branch whose upstream is origin/main.",
  ],
  PREFLIGHT_UPSTREAM: [
    "The current branch does not track origin/main.",
    "Set the current branch upstream to origin/main and retry.",
  ],
  PREFLIGHT_DIRTY: [
    "The checkout contains staged, unstaged, or untracked changes.",
    "Use a clean isolated checkout and retry.",
  ],
  PREFLIGHT_REVISION: [
    "The local or fetched main revision is unavailable or malformed.",
    "Refresh the repository references and retry.",
  ],
  PREFLIGHT_EXACT_MAIN: [
    "HEAD is not the freshly fetched origin/main revision.",
    "Update the tracking checkout to exact origin/main and retry.",
  ],
  PREFLIGHT_STRUCTURAL_VALIDATION: [
    "The structural execution-control validator did not pass.",
    "Resolve the public control validation findings before synchronization or task start.",
  ],
});

function pass(code, scope, details = {}) {
  return { ok: true, scope, code, ...details };
}

function fail(code, scope) {
  const [message, correctiveAction] = messages[code] ?? [
    "The exact-main preflight failed closed.",
    "Inspect the public control state and retry.",
  ];
  return { ok: false, scope, code, message, correctiveAction };
}

function defaultRun(command, args, { cwd, encoding = "utf8" } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    ...(encoding === null ? {} : { encoding }),
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    maxBuffer: 8 * 1024 * 1024,
  });
  return {
    ok: !result.error && result.status === 0,
    stdout: typeof result.stdout === "string" || Buffer.isBuffer(result.stdout)
      ? result.stdout
      : encoding === null ? Buffer.alloc(0) : "",
  };
}

async function invoke(run, command, args, options) {
  try {
    const result = await run(command, args, options);
    const rawStdout = result?.stdout;
    const stdout = options?.encoding === null
      ? Buffer.isBuffer(rawStdout)
        ? rawStdout
        : typeof rawStdout === "string" ? Buffer.from(rawStdout, "utf8") : Buffer.alloc(0)
      : typeof rawStdout === "string"
        ? rawStdout
        : Buffer.isBuffer(rawStdout) ? rawStdout.toString("utf8") : "";
    return {
      ok: result?.ok === true || result?.status === 0,
      stdout,
    };
  } catch {
    return { ok: false, stdout: options?.encoding === null ? Buffer.alloc(0) : "" };
  }
}

async function git(run, repoRoot, args, options = {}) {
  return invoke(run, "git", args, { cwd: repoRoot, ...options });
}

function oneLine(result) {
  return result.stdout.trim().split(/\r?\n/, 1)[0] ?? "";
}

async function inspectCheckout({ repoRoot, run, expectedRevision = null, scope }) {
  const topLevelResult = await git(run, repoRoot, ["rev-parse", "--show-toplevel"]);
  const gitDirResult = await git(run, repoRoot, ["rev-parse", "--path-format=absolute", "--git-dir"]);
  const commonDirResult = await git(run, repoRoot, ["rev-parse", "--path-format=absolute", "--git-common-dir"]);
  const topLevel = oneLine(topLevelResult);
  const gitDir = oneLine(gitDirResult);
  const commonDir = oneLine(commonDirResult);
  if (!topLevelResult.ok || !gitDirResult.ok || !commonDirResult.ok
    || path.resolve(topLevel) !== path.resolve(repoRoot)
    || !path.isAbsolute(gitDir)
    || !path.isAbsolute(commonDir)
    || gitDir === commonDir
    || path.basename(gitDir) !== "Phase1") {
    return fail("PREFLIGHT_WORKTREE_IDENTITY", scope);
  }
  const branchResult = await git(run, repoRoot, ["symbolic-ref", "--quiet", "--short", "HEAD"]);
  const branch = oneLine(branchResult);
  if (!branchResult.ok || branch.length === 0) return fail("PREFLIGHT_DETACHED", scope);

  const upstreamResult = await git(run, repoRoot, [
    "rev-parse",
    "--abbrev-ref",
    "--symbolic-full-name",
    "@{upstream}",
  ]);
  const upstream = oneLine(upstreamResult);
  if (!upstreamResult.ok || upstream !== "origin/main") return fail("PREFLIGHT_UPSTREAM", scope);

  const status = await git(run, repoRoot, ["status", "--porcelain=v1", "--untracked-files=all"]);
  if (!status.ok || status.stdout.length !== 0) return fail("PREFLIGHT_DIRTY", scope);

  const headResult = await git(run, repoRoot, ["rev-parse", "--verify", "HEAD^{commit}"]);
  const originMainResult = await git(run, repoRoot, [
    "rev-parse",
    "--verify",
    "refs/remotes/origin/main^{commit}",
  ]);
  const head = oneLine(headResult);
  const originMain = oneLine(originMainResult);
  if (!headResult.ok || !originMainResult.ok
    || !FULL_GIT_REVISION_PATTERN.test(head)
    || !FULL_GIT_REVISION_PATTERN.test(originMain)) {
    return fail("PREFLIGHT_REVISION", scope);
  }
  if (head !== originMain || (expectedRevision !== null && head !== expectedRevision)) {
    return fail("PREFLIGHT_EXACT_MAIN", scope);
  }

  return pass(scope === "exact-main" ? "PREFLIGHT_EXACT_MAIN_OK" : "PREFLIGHT_EXACT_MAIN_RECHECK_OK", scope, {
    revision: head,
    branch,
    upstream,
    gitFacts: {
      fetchSucceeded: true,
      checkoutClean: true,
      worktreeClean: true,
      head,
      headRevision: head,
      originMain,
      originMainRevision: originMain,
      branch,
      upstream,
      detached: false,
      externalSyncSourceRevision: head,
    },
  });
}

/**
 * Fetch and verify a clean, attached checkout tracking exact origin/main.
 * Dependency injection is retained for deterministic control tests; production
 * callers must call this function without overrides.
 */
export async function verifyExactMainPreflight(options = {}) {
  const repoRoot = path.resolve(options.repoRoot ?? DEFAULT_REPO_ROOT);
  const run = options.run ?? defaultRun;
  const canonicalOriginUrl = options.canonicalOriginUrl ?? CANONICAL_ORIGIN_URL;

  const fetchOrigins = await git(run, repoRoot, ["remote", "get-url", "--all", "origin"]);
  const pushOrigins = await git(run, repoRoot, ["remote", "get-url", "--push", "--all", "origin"]);
  if (!fetchOrigins.ok || !pushOrigins.ok
    || fetchOrigins.stdout.trim() !== canonicalOriginUrl
    || pushOrigins.stdout.trim() !== canonicalOriginUrl) {
    return fail("PREFLIGHT_ORIGIN_URL", "exact-main");
  }

  const fetch = await git(run, repoRoot, [
    "fetch",
    "--quiet",
    "--no-tags",
    "origin",
    "+refs/heads/main:refs/remotes/origin/main",
  ]);
  if (!fetch.ok) return fail("PREFLIGHT_FETCH", "exact-main");

  const checkout = await inspectCheckout({ repoRoot, run, scope: "exact-main" });
  if (!checkout.ok) return checkout;

  const validateStructure = options.validateStructure ?? (async ({ repoRoot: validatorRoot, run: validatorRun }) => (
    invoke(validatorRun, process.execPath, ["tools/P0-validate-execution-controls.mjs"], { cwd: validatorRoot })
  ));
  let structuralResult;
  try {
    structuralResult = await validateStructure({ repoRoot, run, revision: checkout.revision });
  } catch {
    structuralResult = { ok: false };
  }
  if (structuralResult?.ok !== true) return fail("PREFLIGHT_STRUCTURAL_VALIDATION", "exact-main");
  return checkout;
}

/** Re-fetch and prove that the same guarded revision is still exact main. */
export async function verifyExactMainStillCurrent({
  repoRoot = DEFAULT_REPO_ROOT,
  run = defaultRun,
  expectedRevision,
} = {}) {
  const resolvedRoot = path.resolve(repoRoot);
  if (!FULL_GIT_REVISION_PATTERN.test(expectedRevision ?? "")) {
    return fail("PREFLIGHT_REVISION", "exact-main-recheck");
  }
  const fetchOrigins = await git(run, resolvedRoot, ["remote", "get-url", "--all", "origin"]);
  const pushOrigins = await git(run, resolvedRoot, ["remote", "get-url", "--push", "--all", "origin"]);
  if (!fetchOrigins.ok || !pushOrigins.ok
    || fetchOrigins.stdout.trim() !== CANONICAL_ORIGIN_URL
    || pushOrigins.stdout.trim() !== CANONICAL_ORIGIN_URL) {
    return fail("PREFLIGHT_ORIGIN_URL", "exact-main-recheck");
  }
  const fetch = await git(run, resolvedRoot, [
    "fetch",
    "--quiet",
    "--no-tags",
    "--prune",
    "origin",
    "+refs/heads/main:refs/remotes/origin/main",
  ]);
  if (!fetch.ok) return fail("PREFLIGHT_FETCH", "exact-main-recheck");
  return inspectCheckout({
    repoRoot: resolvedRoot,
    run,
    expectedRevision,
    scope: "exact-main-recheck",
  });
}
