import assert from "node:assert/strict";
import crypto from "node:crypto";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  executeStageFromExactMain,
  PRODUCTION_CALLBACK_MODULE_IDS,
  PRODUCTION_MODULE_METADATA,
  PRODUCTION_OUTCOME_VERIFICATION_MODULE_IDS,
  reconstructProductionGovernedEvidence,
  runSerializableStageFromExactMain,
  SPK_GOVERNED_EVIDENCE_CONTRACT_SHA256,
  SPK_SYNTHETIC_MODULE_SHA256,
  validateSpkSyntheticModuleSource,
} from "./P0-stage-runner.mjs";
import { canonicalJson } from "./P0-content-safety.mjs";

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

const spkIdentity = {
  taskId: "SPK-R0-001",
  scopeClass: "local-synthetic",
  actionClass: "synthetic-foundation",
  stageId: "P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION",
  predecessorReceiptSha256: null,
  idempotencyKey: "P0-IDEMP-SPK-R0-001-SYNTHETIC-001",
};
let spkCallbackExecutions = 0;
const spkCallbackDenied = await executeStageFromExactMain({
  ...spkIdentity,
  execute: async () => {
    spkCallbackExecutions += 1;
    return null;
  },
});
assert.equal(spkCallbackDenied.code, "STAGE_CALLBACK_NOT_ALLOWLISTED");
assert.equal(spkCallbackExecutions, 0);

// The future module is absent in this seed. Reaching Gate B denial proves the
// code-owned definition/metadata resolved without probing, copying, importing,
// launching, journaling, or signalling that path first.
const spkSerialDenied = await runSerializableStageFromExactMain(spkIdentity);
assert.equal(spkSerialDenied.code, "STAGE_GATE_B_DENIED");

assert.deepEqual(PRODUCTION_MODULE_METADATA, [{
  moduleId: "spk.synthetic",
  moduleRelativePath: "tools/spk-r0-001/P0-SPK-R0-001-synthetic-foundation.mjs",
  moduleSha256: SPK_SYNTHETIC_MODULE_SHA256,
  gitMode: "100644",
  argumentSetIds: ["synthetic.v1"],
  argumentSets: { "synthetic.v1": [] },
}]);
assert.deepEqual(PRODUCTION_OUTCOME_VERIFICATION_MODULE_IDS, ["spk.synthetic"]);
assert.deepEqual(PRODUCTION_CALLBACK_MODULE_IDS, []);
assert.equal(SPK_SYNTHETIC_MODULE_SHA256,
  "sha256:e60d8e6398441a61812dd467ffcbdd292e01fb1198723e667e480d2cf453e47f");
assert.equal(SPK_GOVERNED_EVIDENCE_CONTRACT_SHA256,
  "sha256:38c8deeb899e87cfef731cc1932d3594f3cf4b7d6afa1aeff62cb343395931d8");

const zeroEvidenceDigest = "sha256:21a2b56022c4034d8ff6f1eed8c8933cb5980fb39191ed211e30209cbf954608";
const zeroEvidenceRequest = {
  moduleId: "spk.synthetic",
  taskId: "SPK-R0-001",
  stageId: "P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION",
  sourceRevision: "0".repeat(40),
  stageBindingDigest: "sha256:fc172d2f8c1e5f9dccdf7a5c398fe0a2038591f7fb2903e54961879c73041983",
  moduleSha256: SPK_SYNTHETIC_MODULE_SHA256,
  evidenceDigest: zeroEvidenceDigest,
};
const zeroEvidence = reconstructProductionGovernedEvidence(zeroEvidenceRequest);
assert.notEqual(zeroEvidence, null);
const zeroEvidenceBytes = Buffer.from(canonicalJson(zeroEvidence), "utf8");
assert.equal(zeroEvidenceBytes.length, 7_738);
assert.equal(`sha256:${crypto.createHash("sha256").update(zeroEvidenceBytes).digest("hex")}`, zeroEvidenceDigest);
assert.equal(Object.isFrozen(zeroEvidence), true);
assert.equal(Object.isFrozen(zeroEvidence.requirementResults), true);
assert.deepEqual(zeroEvidence.requirementResults.map((entry) => entry.requirementId), [
  "LID-SCP-001", "LID-OPS-001", "LID-OPS-002", "LID-OPS-003", "LID-OPS-004",
  "LID-OPS-008", "LID-OPS-011", "LID-OPS-012", "LID-OPS-014", "LID-OPS-016",
  "LID-OPS-018",
]);
assert.deepEqual(zeroEvidence.scenarioResults.map((entry) => entry.scenarioId), [
  "SPK-R0-001-P-001", "SPK-R0-001-P-002", "SPK-R0-001-P-003",
  "SPK-R0-001-T-001", "SPK-R0-001-T-002", "SPK-R0-001-T-003",
  "SPK-R0-001-D-001", "SPK-R0-001-D-002", "SPK-R0-001-D-003",
  "SPK-R0-001-QA-001", "SPK-R0-001-QA-002", "SPK-R0-001-QA-003",
  "SPK-R0-001-QA-004", "SPK-R0-001-QA-005", "SPK-R0-001-QA-006",
]);
assert.deepEqual(zeroEvidence.contractResults.map((entry) => entry.contractId), [
  "surface-isolation", "capacity-and-collision", "authenticated-encryption",
  "backup-restore-rollback", "durable-health", "sanitized-logging",
  "replay-interruption-crash", "receipt-boundary",
]);
assert.equal(reconstructProductionGovernedEvidence({
  ...zeroEvidenceRequest,
  evidenceDigest: `sha256:${"0".repeat(64)}`,
}), null);
assert.equal(reconstructProductionGovernedEvidence({
  ...zeroEvidenceRequest,
  moduleSha256: `sha256:${"0".repeat(64)}`,
}), null);
assert.equal(reconstructProductionGovernedEvidence({ ...zeroEvidenceRequest, extra: true }), null);
let evidenceAccessorReads = 0;
const evidenceAccessorRequest = { ...zeroEvidenceRequest };
Object.defineProperty(evidenceAccessorRequest, "evidenceDigest", {
  enumerable: true,
  get() {
    evidenceAccessorReads += 1;
    return zeroEvidenceDigest;
  },
});
assert.equal(reconstructProductionGovernedEvidence(evidenceAccessorRequest), null);
assert.equal(evidenceAccessorReads, 0);
assert.equal(reconstructProductionGovernedEvidence(new Proxy({}, {})), null);

const scannerPositive = [
  "import { createCipheriv, createDecipheriv, createHash } from \"node:crypto\";",
  "import { writeFileSync } from \"node:fs\";",
  "const args = process.argv;",
  "const childResultBytes = Buffer.from(\"{}\\n\", \"utf8\");",
  "writeFileSync(3, childResultBytes);",
  "process.exitCode = args.length === 0 ? 0 : 75;",
  "",
].join("\n");
assert.equal(validateSpkSyntheticModuleSource(scannerPositive), false);
const scannerCommentSpoofBypass = [
  "import { createCipheriv, createDecipheriv, createHash } from \"node:crypto\";",
  "import { writeFileSync } from \"node:fs\";",
  "const p = (() => {}).constructor(\"return pro\" + \"cess\")();",
  "const f = p[\"get\" + \"Builtin\" + \"Module\"](\"node:\" + \"fs\");",
  "const stolen = f[\"read\" + \"FileSync\"](\"/etc/passwd\");",
  "void stolen;",
  "// process.argv",
  "// process.exitCode",
  "// writeFileSync(3, childResultBytes);",
  "",
].join("\n");
const scannerAdversarialNegatives = [
  scannerCommentSpoofBypass,
  `${scannerPositive}\nconst recovered = (() => {}).constructor("return globalThis")();`,
  `${scannerPositive}\nconst property = \`con\${"structor"}\`; const recovered = (() => {})[property];`,
  `${scannerPositive}\nconst builtin = "node:" + "fs"; const readName = "read" + "FileSync";`,
  `${scannerPositive}\nconst writerAlias = writeFileSync; void writerAlias;`,
  `${scannerPositive}\nconst descriptor = Object["get" + "OwnPropertyDescriptor"];`,
  `${scannerPositive}\nconst indirectLoader = (0, eval);`,
  `${scannerPositive}\nconst index = ["con", "structor"].join(""); const base = () => {}; const recovered = base[index];`,
  `${scannerPositive}\nconst index = ["con", "structor"].join(""); const { [index]: recovered } = createHash;`,
  `${scannerPositive}\nconst escapedGlobal = gl\\u006fbalThis;`,
];
for (const source of scannerAdversarialNegatives) {
  assert.equal(validateSpkSyntheticModuleSource(source), false);
}
assert.equal(validateSpkSyntheticModuleSource(`${scannerPositive}\nprocess.getBuiltinModule(\"node:fs\");`), false);
assert.equal(validateSpkSyntheticModuleSource(
  `${scannerPositive}\nconst processAlias = process; processAlias[\"get\" + \"BuiltinModule\"](\"node:fs\");`,
), false);
assert.equal(validateSpkSyntheticModuleSource(
  `${scannerPositive}\nconst { getBuiltinModule } = process; getBuiltinModule(\"node:fs\");`,
), false);
assert.equal(validateSpkSyntheticModuleSource(`${scannerPositive}\nconst loader = globalThis[\"im\" + \"port\"];`), false);
assert.equal(validateSpkSyntheticModuleSource(`${scannerPositive}\nreadFileSync(\"fictional\");`), false);
assert.equal(validateSpkSyntheticModuleSource(
  scannerPositive.replace("writeFileSync(3, childResultBytes);", "writeFileSync(4, childResultBytes);"),
), false);

const result = spawnSync(process.execPath, ["tools/P0-stage-runner.mjs", "--self-test"], {
  cwd: repoRoot,
  encoding: "utf8",
  maxBuffer: 8 * 1024 * 1024,
});
assert.equal(result.status, 0, result.stderr);
const report = JSON.parse(result.stdout);
assert.equal(report.ok, true);
assert.equal(report.code, "SELF_TEST_OK");
assert.equal(report.cases, 136);
assert.equal(report.productionModules, 1);
console.log(JSON.stringify(report));
