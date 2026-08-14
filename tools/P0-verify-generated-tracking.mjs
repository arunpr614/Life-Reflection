import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ARTIFACT_KINDS } from "./P0-readiness-gates.mjs";
import { parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registerPath = "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json";
const fixedGeneratedPaths = Object.freeze([
  registerPath,
  "docs/project/PHASE1-ROADMAP-MANIFEST.json",
  "docs/project/PHASE1-RELEASE-PLAN.md",
  "outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx",
]);

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

const register = parseJsonWithoutDuplicateKeys(
  fs.readFileSync(path.join(repoRoot, registerPath), "utf8"),
  registerPath,
);
if (!Array.isArray(register.tasks) || register.tasks.length !== 58) {
  fail("P0 generated-tracking verification failed: artifact register does not contain exactly 58 tasks.");
} else {
  const artifactPaths = register.tasks.flatMap((task) => ARTIFACT_KINDS.map((kind) => task?.artifacts?.[kind]?.path));
  const generatedPaths = [...new Set([...fixedGeneratedPaths, ...artifactPaths])].sort();
  const invalidPaths = generatedPaths.filter((filePath) => typeof filePath !== "string"
    || filePath.length === 0
    || path.posix.isAbsolute(filePath)
    || filePath.split("/").includes("..")
    || path.posix.normalize(filePath) !== filePath);
  if (invalidPaths.length > 0 || generatedPaths.length !== fixedGeneratedPaths.length + (58 * ARTIFACT_KINDS.length)) {
    fail("P0 generated-tracking verification failed: canonical generated paths are missing, duplicated, or unsafe.");
  } else {
    const trackedStageEntries = execFileSync("git", ["ls-files", "--stage", "-z", "--", ...generatedPaths], {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    }).split("\0").filter(Boolean).map((entry) => {
      const match = /^(\d{6}) ([0-9a-f]{40,64}) (\d+)\t(.+)$/.exec(entry);
      return match ? {
        mode: match[1],
        objectId: match[2],
        stage: Number(match[3]),
        path: match[4],
      } : { malformed: entry };
    });
    const trackedByPath = new Map(trackedStageEntries
      .filter((entry) => entry.path)
      .map((entry) => [entry.path, entry]));
    const missingTrackedPaths = generatedPaths.filter((filePath) => !trackedByPath.has(filePath));
    const missingFilesystemPaths = generatedPaths.filter((filePath) => {
      const absolutePath = path.join(repoRoot, filePath);
      return !fs.existsSync(absolutePath) || !fs.lstatSync(absolutePath).isFile();
    });
    const invalidStageEntries = trackedStageEntries.filter((entry) => entry.malformed
      || entry.stage !== 0
      || entry.mode !== "100644");
    const objectIds = [...new Set(trackedStageEntries
      .filter((entry) => entry.objectId)
      .map((entry) => entry.objectId))];
    const objectTypeLines = objectIds.length === 0 ? [] : execFileSync("git", ["cat-file", "--batch-check=%(objectname) %(objecttype)"], {
      cwd: repoRoot,
      encoding: "utf8",
      input: `${objectIds.join("\n")}\n`,
      maxBuffer: 16 * 1024 * 1024,
    }).trim().split("\n").filter(Boolean);
    const objectTypes = new Map(objectTypeLines.map((line) => {
      const [objectId, objectType] = line.split(" ");
      return [objectId, objectType];
    }));
    const nonBlobStageEntries = trackedStageEntries.filter((entry) => entry.objectId
      && objectTypes.get(entry.objectId) !== "blob");
    const status = execFileSync("git", [
      "status",
      "--porcelain=v1",
      "-z",
      "--untracked-files=all",
      "--",
      ...generatedPaths,
    ], {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    }).split("\0").filter(Boolean);
    if (missingTrackedPaths.length > 0
      || missingFilesystemPaths.length > 0
      || invalidStageEntries.length > 0
      || nonBlobStageEntries.length > 0
      || status.length > 0) {
      fail(JSON.stringify({
        ok: false,
        code: "P0_GENERATED_TRACKING_DRIFT",
        generatedPathCount: generatedPaths.length,
        missingTrackedPaths,
        missingFilesystemPaths,
        invalidStageEntries,
        nonBlobStageEntries,
        status,
      }, null, 2));
    } else {
      process.stdout.write(`${JSON.stringify({
        ok: true,
        code: "P0_GENERATED_TRACKING_OK",
        generatedPathCount: generatedPaths.length,
      }, null, 2)}\n`);
    }
  }
}
