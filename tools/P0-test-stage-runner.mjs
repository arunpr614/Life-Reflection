import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  executeStageFromExactMain,
  runSerializableStageFromExactMain,
} from "./P0-stage-runner.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let directCallbackExecutions = 0;
const directRequest = {
  taskId: "ENG-R0-001",
  scopeClass: "local-synthetic",
  actionClass: "synthetic-foundation",
  stageId: "P0-STAGE-ENG-R0-001-FOCUSED-PUBLIC-SURFACE",
  predecessorReceiptSha256: null,
  idempotencyKey: "P0-IDEMP-ENG-R0-001-FOCUSED-PUBLIC-SURFACE-001",
  execute: async () => {
    directCallbackExecutions += 1;
    return null;
  },
};
const directAbsent = await executeStageFromExactMain(directRequest);
assert.equal(directAbsent.code, "STAGE_ACTION_NOT_REVIEWED");
assert.equal(directCallbackExecutions, 0);
const directExtra = await executeStageFromExactMain({ ...directRequest, trust: true });
assert.equal(directExtra.code, "STAGE_CALLBACK_REQUEST_SHAPE_INVALID");
assert.equal(directCallbackExecutions, 0);

let mutatedCallbackExecutions = 0;
const mutableRequest = { ...directRequest };
const capturedRequestResult = executeStageFromExactMain(mutableRequest);
mutableRequest.taskId = "REL-R0-001";
mutableRequest.stageId = "P0-STAGE-REL-R0-001-MUTATED-AFTER-YIELD";
mutableRequest.execute = async () => {
  mutatedCallbackExecutions += 1;
  return null;
};
const capturedRequest = await capturedRequestResult;
assert.equal(capturedRequest.code, "STAGE_ACTION_NOT_REVIEWED");
assert.equal(capturedRequest.taskId, directRequest.taskId);
assert.equal(capturedRequest.stageId, directRequest.stageId);
assert.equal(directCallbackExecutions, 0);
assert.equal(mutatedCallbackExecutions, 0);

let accessorReads = 0;
const accessorRequest = { ...directRequest };
Object.defineProperty(accessorRequest, "taskId", {
  enumerable: true,
  get() {
    accessorReads += 1;
    return directRequest.taskId;
  },
});
const accessorResult = await executeStageFromExactMain(accessorRequest);
assert.equal(accessorResult.code, "STAGE_CALLBACK_REQUEST_SHAPE_INVALID");
assert.equal(accessorReads, 0);

const serialRequest = {
  taskId: "ENG-R0-001",
  scopeClass: "local-synthetic",
  actionClass: "synthetic-foundation",
  stageId: "P0-STAGE-ENG-R0-001-FOCUSED-SERIAL-SURFACE",
  predecessorReceiptSha256: null,
  idempotencyKey: "P0-IDEMP-ENG-R0-001-FOCUSED-SERIAL-SURFACE-001",
};
const mutableSerialRequest = { ...serialRequest };
const capturedSerialResult = runSerializableStageFromExactMain(mutableSerialRequest);
mutableSerialRequest.taskId = "REL-R0-001";
mutableSerialRequest.stageId = "P0-STAGE-REL-R0-001-MUTATED-AFTER-YIELD";
const capturedSerial = await capturedSerialResult;
assert.equal(capturedSerial.code, "STAGE_ACTION_NOT_REVIEWED");
assert.equal(capturedSerial.taskId, serialRequest.taskId);
assert.equal(capturedSerial.stageId, serialRequest.stageId);

let serialAccessorReads = 0;
const serialAccessorRequest = { ...serialRequest };
Object.defineProperty(serialAccessorRequest, "stageId", {
  enumerable: true,
  get() {
    serialAccessorReads += 1;
    return serialRequest.stageId;
  },
});
const serialAccessorResult = await runSerializableStageFromExactMain(serialAccessorRequest);
assert.equal(serialAccessorResult.code, "STAGE_REQUEST_SHAPE_INVALID");
assert.equal(serialAccessorReads, 0);

const result = spawnSync(process.execPath, ["tools/P0-stage-runner.mjs", "--self-test"], {
  cwd: repoRoot,
  encoding: "utf8",
  maxBuffer: 8 * 1024 * 1024,
});
assert.equal(result.status, 0, result.stderr);
const report = JSON.parse(result.stdout);
assert.equal(report.ok, true);
assert.equal(report.code, "SELF_TEST_OK");
assert.equal(report.cases, 86);
assert.equal(report.productionModules, 0);
console.log(JSON.stringify(report));
