import crypto from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import {
  access,
  lstat,
  mkdir,
  mkdtemp,
  open,
  readdir,
  readFile,
  realpath,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { types as utilTypes } from "node:util";
import {
  canonicalJson,
  hasExactKeys,
  publicTextBytesAreSafe,
  sanitizedResultIsSafe,
} from "./P0-content-safety.mjs";
import { parseJsonWithoutDuplicateKeys } from "./P0-json-trust.mjs";
import {
  resolveProductionStagedAction,
  stageBindingDigest,
  TERMINAL_STAGE_STATES,
  validateHistoricalStageReceipt,
  validateStageReceipt,
  validateStagedActionDefinition,
} from "./P0-staged-actions.mjs";
import {
  verifyStageGateBAtExactMain,
  verifyStageTerminalHistoryAtExactMain,
} from "./P0-verify-execution-start.mjs";

// Callback code runs in-process, so deadline and restoration logic must not
// look up mutable globals after the reviewed function starts.
const PRIMORDIAL_DATE = Date;
const PRIMORDIAL_DATE_NOW = Date.now.bind(Date);
const PRIMORDIAL_DATE_PARSE = Date.parse.bind(Date);
const PRIMORDIAL_DATE_GET_TIME = Date.prototype.getTime.call.bind(Date.prototype.getTime);
const PRIMORDIAL_DATE_TO_ISO_STRING = Date.prototype.toISOString.call.bind(Date.prototype.toISOString);
const PRIMORDIAL_HRTIME_BIGINT = process.hrtime.bigint.bind(process.hrtime);
const PRIMORDIAL_SET_TIMEOUT = globalThis.setTimeout.bind(globalThis);
const PRIMORDIAL_CLEAR_TIMEOUT = globalThis.clearTimeout.bind(globalThis);
const PRIMORDIAL_QUEUE_MICROTASK = globalThis.queueMicrotask.bind(globalThis);
const PRIMORDIAL_OBJECT_DEFINE_PROPERTY = Object.defineProperty.bind(Object);
const PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTOR = Object.getOwnPropertyDescriptor.bind(Object);
const PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTORS = Object.getOwnPropertyDescriptors.bind(Object);
const PRIMORDIAL_OBJECT_GET_PROTOTYPE_OF = Object.getPrototypeOf.bind(Object);
const PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_SYMBOLS = Object.getOwnPropertySymbols.bind(Object);
const PRIMORDIAL_OBJECT_FREEZE = Object.freeze.bind(Object);
const PRIMORDIAL_REFLECT_DELETE_PROPERTY = Reflect.deleteProperty.bind(Reflect);
const PRIMORDIAL_BUFFER_FROM = Buffer.from.bind(Buffer);
const PRIMORDIAL_BUFFER_IS_BUFFER = Buffer.isBuffer.bind(Buffer);
const PRIMORDIAL_ARRAY_BUFFER_IS_VIEW = ArrayBuffer.isView.bind(ArrayBuffer);
const PRIMORDIAL_STDOUT = process.stdout;
const PRIMORDIAL_STDERR = process.stderr;
const primordialClock = () => new PRIMORDIAL_DATE(PRIMORDIAL_DATE_NOW());

const DEFAULT_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTION_REQUEST_KEYS = Object.freeze([
  "taskId",
  "scopeClass",
  "actionClass",
  "stageId",
  "predecessorReceiptSha256",
  "idempotencyKey",
]);
const CALLBACK_PRODUCTION_REQUEST_KEYS = Object.freeze([
  ...PRODUCTION_REQUEST_KEYS,
  "execute",
]);
const MODULE_ENTRY_KEYS = Object.freeze([
  "moduleId",
  "moduleRelativePath",
  "moduleSha256",
  "gitMode",
  "argumentSets",
]);
const CALLBACK_ALLOWLIST_ENTRY_KEYS = Object.freeze([
  "moduleId",
  "moduleRelativePath",
  "moduleSha256",
  "gitMode",
  "execute",
  "capabilityProfile",
  "capabilityReviewSha256",
]);
const CALLBACK_CAPABILITY_PROFILE = "trusted-public-synthetic-no-native-io-v1";
const MODULE_ID = /^[a-z][a-z0-9.-]{2,63}$/;
const RELATIVE_MODULE_PATH = /^tools\/[A-Za-z0-9._/-]+\.mjs$/;
const RECEIPT_DIGEST = /^sha256:[0-9a-f]{64}$/;
const FULL_REVISION = /^[0-9a-f]{40}$/;
const EVENT_FILE = /^\d{4}-(?:running|verification-pending|recovery-required|rolling-back|verified-complete|verified-rolled-back|cancelled-before-mutation|blocked-no-mutation|expired-before-mutation)\.json$/;
const TERMINATION_GRACE_MS = 500;
const QUIESCENCE_INTERVAL_MS = 1_000;
const MAX_CHILD_RESULT_BYTES = 64 * 1024;
const AUTHORIZATION_KEYS = Object.freeze([
  "ok", "scope", "code", "taskId", "stageId", "scopeClass", "actionClass", "sourceRevision",
  "candidateRevision", "dossierDigest", "preparationReviewId", "gateKind", "predecessorReceiptSha256",
  "gateDecision", "independentQaResult", "preparationReviewSha256", "idempotencyKey", "stageApprovalSha256",
  "stageDefinitionSha256", "moduleId", "moduleSha256", "registrySha256", "gateSourceFingerprint", "deadlineAt",
  "rollbackSnapshotReference",
]);
const TERMINAL_HISTORY_KEYS = Object.freeze([
  "ok", "scope", "code", "taskId", "stageId", "scopeClass", "actionClass", "sourceRevision",
  "candidateRevision", "dossierDigest", "preparationReviewId", "preparationReviewSha256", "gateKind",
  "predecessorReceiptSha256", "idempotencyKey", "stageDefinitionSha256", "moduleId", "moduleSha256",
  "rollbackSnapshotReference", "stageApprovalSha256", "registrySha256",
]);
const CHILD_RESULT_KEYS = Object.freeze([
  "schemaVersion", "outcome", "taskId", "stageId", "idempotencyKey", "sourceRevision",
  "stageBindingDigest", "evidenceDigest",
]);
const CALLBACK_COMPLETION_KEYS = Object.freeze([
  "schemaVersion", "outcome", "taskId", "scopeClass", "actionClass", "stageId",
  "predecessorReceiptSha256", "idempotencyKey", "sourceRevision", "candidateRevision",
  "stageBindingDigest", "evidenceDigest",
]);
const OUTCOME_VERIFICATION_KEYS = Object.freeze([
  "schemaVersion", "outcome", "boundary", "taskId", "stageId", "sourceRevision",
  "stageBindingDigest", "moduleSha256", "childResultSha256", "evidenceDigest", "observationDigest",
]);
const RECOVERY_REVIEW_KEYS = Object.freeze([
  "schemaVersion", "decision", "taskId", "stageId", "sourceRevision", "stageBindingDigest",
  "ownerNonce", "ownerClaimDigest", "recoveryReviewDigest",
]);
const PUBLIC_RECOVERY_REQUEST_KEYS = Object.freeze([
  "taskId", "stageId", "idempotencyKey", "sourceRevision", "stageBindingDigest", "recoveryReviewDigest",
]);
const LOCK_RECORD_KEYS = Object.freeze([
  "schemaVersion", "runtimeKey", "taskId", "stageId", "sourceRevision", "stageBindingDigest",
  "ownerNonce", "supervisorPid", "supervisorStartIdentity", "childPid", "childStartIdentity",
  "childProcessGroupId", "pendingReceiptSha256", "heartbeatAt",
]);
const LAUNCH_SIGNAL = "P0_STAGE_START\n";
const TRUSTED_LAUNCHER_BYTES = Buffer.from([
  "import { readFileSync } from 'node:fs';",
  `const signal = readFileSync(4, 'utf8');`,
  `if (signal !== ${JSON.stringify(LAUNCH_SIGNAL)}) process.exit(75);`,
  "await import('./executor.mjs');",
  "",
].join("\n"), "utf8");
const MAX_CALLBACK_DEADLINE_MS = 5 * 60 * 1_000;
const EMPTY_EVIDENCE_SHA256 = `sha256:${crypto.createHash("sha256").update(Buffer.alloc(0)).digest("hex")}`;

// Exact final-audited module and governed-contract bindings. These values do
// not authorize execution; exact-main Gate B remains mandatory before the
// future path is accessed.
export const SPK_SYNTHETIC_MODULE_SHA256 =
  "sha256:e60d8e6398441a61812dd467ffcbdd292e01fb1198723e667e480d2cf453e47f";
export const SPK_GOVERNED_EVIDENCE_CONTRACT_SHA256 =
  "sha256:38c8deeb899e87cfef731cc1932d3594f3cf4b7d6afa1aeff62cb343395931d8";
const SPK_SYNTHETIC_MODULE_ID = "spk.synthetic";
const SPK_SYNTHETIC_MODULE_PATH = "tools/spk-r0-001/P0-SPK-R0-001-synthetic-foundation.mjs";
const SPK_SYNTHETIC_ARGUMENT_SET_ID = "synthetic.v1";
const SPK_SYNTHETIC_ARGUMENT_SETS = Object.freeze({
  [SPK_SYNTHETIC_ARGUMENT_SET_ID]: Object.freeze([]),
});

// The metadata is inert until the append-only registry contains a matching
// accepted Gate B approval. The future module path need not exist in this seed.
const PRODUCTION_MODULE_ALLOWLIST = Object.freeze({
  [SPK_SYNTHETIC_MODULE_ID]: Object.freeze({
    moduleId: SPK_SYNTHETIC_MODULE_ID,
    moduleRelativePath: SPK_SYNTHETIC_MODULE_PATH,
    moduleSha256: SPK_SYNTHETIC_MODULE_SHA256,
    gitMode: "100644",
    argumentSets: SPK_SYNTHETIC_ARGUMENT_SETS,
  }),
});
const PRODUCTION_CALLBACK_ALLOWLIST = Object.freeze({});
const PRODUCTION_OUTCOME_VERIFICATION_ALLOWLIST = Object.freeze({
  [SPK_SYNTHETIC_MODULE_ID]: verifySpkSyntheticFoundationOutcome,
});
export const PRODUCTION_MODULE_METADATA = Object.freeze(Object.values(PRODUCTION_MODULE_ALLOWLIST).map((entry) => Object.freeze({
  moduleId: entry.moduleId,
  moduleRelativePath: entry.moduleRelativePath,
  moduleSha256: entry.moduleSha256,
  gitMode: entry.gitMode,
  argumentSetIds: Object.freeze(Object.keys(entry.argumentSets).sort()),
  argumentSets: Object.freeze(Object.fromEntries(Object.entries(entry.argumentSets)
    .map(([argumentSetId, args]) => [argumentSetId, Object.freeze([...args])]))),
})));
export const PRODUCTION_OUTCOME_VERIFICATION_MODULE_IDS = Object.freeze(
  Object.keys(PRODUCTION_OUTCOME_VERIFICATION_ALLOWLIST).sort(),
);
export const PRODUCTION_CALLBACK_MODULE_IDS = Object.freeze(
  Object.keys(PRODUCTION_CALLBACK_ALLOWLIST).sort(),
);

function result(ok, code, details = {}) {
  const value = Object.freeze({ ok, code, ...details });
  if (!sanitizedResultIsSafe(value)) {
    return Object.freeze({ ok: false, code: "STAGE_PUBLIC_RESULT_REJECTED" });
  }
  return value;
}

function publicOperatorResult({
  ok,
  code,
  definition,
  authorization,
  state,
  receiptDigest,
  attempt,
  authorityStatus,
  mutationStatement,
  immediateVerification,
  quiescentVerification,
  consequence,
  nextAction,
}) {
  return result(ok, code, {
    taskId: definition.taskId,
    stageId: definition.stageId,
    gateKind: authorization.gateKind,
    scopeClass: definition.scopeClass,
    actionClass: definition.actionClass,
    sourceRevision: authorization.sourceRevision,
    dossierDigest: authorization.dossierDigest,
    predecessorReceiptDigest: definition.predecessor?.receiptDigest ?? null,
    idempotencyKey: definition.idempotencyKey,
    authorityDeadline: authorization.deadlineAt,
    authorityStatus,
    state,
    mutationStatement,
    rollbackSnapshotReference: authorization.rollbackSnapshotReference,
    immediateVerification,
    quiescentVerification,
    receiptDigest,
    attempt,
    consequence,
    nextAction,
  });
}

function sha256(value) {
  return `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
}

const SPK_SYNTHETIC_TASK_ID = "SPK-R0-001";
const SPK_SYNTHETIC_STAGE_ID = "P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION";
const SPK_SYNTHETIC_IDEMPOTENCY_KEY = "P0-IDEMP-SPK-R0-001-SYNTHETIC-001";
const SPK_SYNTHETIC_STAGE_BINDING_DIGEST =
  "sha256:fc172d2f8c1e5f9dccdf7a5c398fe0a2038591f7fb2903e54961879c73041983";
const SPK_SYNTHETIC_FIXTURE_SHA256 =
  "sha256:a5b51a5564523396c6c07c4a861de94ca594232af73336f283fa3b53a71e4022";
const SPK_CANONICAL_JSON_VECTOR = "{\"a\":{\"a\":1,\"b\":2},\"list\":[{\"a\":true,\"b\":false},\"x\"],\"z\":1}";
const SPK_CANONICAL_JSON_VECTOR_SHA256 =
  "sha256:7258b5acba4c29a70083a9371603683c1e67be5adbe71a563950e865e19b77a9";
const SPK_ZERO_REVISION = "0000000000000000000000000000000000000000";
const SPK_ZERO_REVISION_EVIDENCE_SHA256 =
  "sha256:21a2b56022c4034d8ff6f1eed8c8933cb5980fb39191ed211e30209cbf954608";
const SPK_ZERO_REVISION_EVIDENCE_BYTE_LENGTH = 7_738;
const SPK_ZERO_REVISION_EVIDENCE_CANONICAL_BYTES = "{\"actionClass\":\"synthetic-foundation\",\"conclusion\":\"synthetic foundation passes\",\"contractResults\":[{\"contractId\":\"surface-isolation\",\"observationDigest\":\"sha256:1588f2311869c44611c81190377b11da7cb7b86d9c458d40d6e7262a86f59115\",\"result\":\"pass\"},{\"contractId\":\"capacity-and-collision\",\"observationDigest\":\"sha256:83b551ebea9d79c73ef8594ce26544d85c1a6b94f7d47b034a95c49d81722671\",\"result\":\"pass\"},{\"contractId\":\"authenticated-encryption\",\"observationDigest\":\"sha256:af12a86001bcf607c418c594585618494a6e0f9d1f81978287852f1ee8fba485\",\"result\":\"pass\"},{\"contractId\":\"backup-restore-rollback\",\"observationDigest\":\"sha256:257299a873607970fcd335195fc5d8b984346e197fe290b6e359af282c037b9f\",\"result\":\"pass\"},{\"contractId\":\"durable-health\",\"observationDigest\":\"sha256:5e3398343fdd4f822a4593018e0bf72e897999bc3cc81d3f2ca4533c98087cd8\",\"result\":\"pass\"},{\"contractId\":\"sanitized-logging\",\"observationDigest\":\"sha256:9d888fc50b56f0ee1333b23d8093893b8ec6b2bc40ec2af7c8b80445a7a12c10\",\"result\":\"pass\"},{\"contractId\":\"replay-interruption-crash\",\"observationDigest\":\"sha256:d78e15fdba7f1a8faee447a2a1c9f589a97db41feebd3a0aec0ea73963e5a067\",\"result\":\"pass\"},{\"contractId\":\"receipt-boundary\",\"observationDigest\":\"sha256:5559e77285b6fbf03c24e845d77cef37a8d4a662d5b8f1747339e75e46797d15\",\"result\":\"pass\"}],\"durableHealth\":{\"backup\":\"success\",\"overall\":\"success\",\"restoreVerification\":\"success\"},\"evidenceKind\":\"governed-synthetic-foundation-evidence-v1\",\"fixture\":{\"authenticContentExcluded\":true,\"fixtureClass\":\"local-public-fictional-synthetic\",\"fixtureId\":\"spk-r0-001-fictional-foundation-v1\",\"fixtureSha256\":\"sha256:a5b51a5564523396c6c07c4a861de94ca594232af73336f283fa3b53a71e4022\",\"schemaVersion\":\"spk-r0-001.synthetic-foundation.fixture.v1\",\"seedId\":\"spk-r0-001-fixed-seed-v1\"},\"idempotencyKey\":\"P0-IDEMP-SPK-R0-001-SYNTHETIC-001\",\"limitations\":[\"The cipher uses deterministic test-only material and nonce derivation for reproducible synthetic checks; it is not a production cryptography or key-custody selection.\",\"Recovery is an in-memory fictional model with no filesystem path, repository, provider, or private backup access.\",\"Capacity values are fixed fictional assumptions and are not host measurements, an SLA, HA evidence, or coexistence acceptance.\",\"The serializable module has no rendered product UI, so product UI accessibility remains untested.\",\"Source, dependency-closure, runtime-output, and retained-artifact safety require separately bound candidate QA; this governed digest reports only exercised in-memory synthetic observations.\",\"A passing result does not complete SPK-R0-001 or authorize a private follow-on, deployment, acceptance, status change, release, or production use.\"],\"permittedClaim\":\"Exact local, public, fictional, synthetic foundation checks passed; live-host fit, private access, deployment, task acceptance, status transition, release, and production readiness remain unproven.\",\"requirementResults\":[{\"observationDigest\":\"sha256:3894ee62753d45eca482364d2131ae857a6acb0472e8172a207ffed8e71c860a\",\"requirementId\":\"LID-SCP-001\",\"result\":\"pass\"},{\"observationDigest\":\"sha256:566927a0caf887c995d0b9f37e9abeca48750f8a53c27ce61368a8e1e01531f3\",\"requirementId\":\"LID-OPS-001\",\"result\":\"pass\"},{\"observationDigest\":\"sha256:9d1b7c3090041f88e90a6e0d3de2311caa848bc4ca26f8a40416a4916b257d5e\",\"requirementId\":\"LID-OPS-002\",\"result\":\"pass\"},{\"observationDigest\":\"sha256:8b1c6d833492de0b2c2d831a4ecaa5fbb16e45b68175451c672fbf940dccfa83\",\"requirementId\":\"LID-OPS-003\",\"result\":\"pass\"},{\"observationDigest\":\"sha256:42a30f8a0a235d0de5c76329506e3cdff2926fac376d29667faaba748d7a573d\",\"requirementId\":\"LID-OPS-004\",\"result\":\"pass\"},{\"observationDigest\":\"sha256:0b2f35ace9b2e95b7103131c80874c810c7dd764a874179c51d6d751fe583950\",\"requirementId\":\"LID-OPS-008\",\"result\":\"pass\"},{\"observationDigest\":\"sha256:8d4abb7cfe91b612f6f73806dbbb27840cd863f60f978ab8290d387ebad5a59f\",\"requirementId\":\"LID-OPS-011\",\"result\":\"pass\"},{\"observationDigest\":\"sha256:e135f153b826f0f113c637bb9b587952431c71a7ce3eee0513044f76a1238d4b\",\"requirementId\":\"LID-OPS-012\",\"result\":\"pass\"},{\"observationDigest\":\"sha256:e2043fdc920ac7721b68560d3896a48e03e1911e075b7c97ef8b962f60fe0424\",\"requirementId\":\"LID-OPS-014\",\"result\":\"pass\"},{\"observationDigest\":\"sha256:5d7171d6fbac20e65ee706f93f9a8044ede52cab4ac7869e3bdefe0af8cd727d\",\"requirementId\":\"LID-OPS-016\",\"result\":\"pass\"},{\"observationDigest\":\"sha256:238f6ad4be9ca8d03c2b6375a3f18e6d86813d59978b81f4632658139f1b362d\",\"requirementId\":\"LID-OPS-018\",\"result\":\"pass\"}],\"safety\":{\"aiContentPathUsed\":false,\"authenticMediaAccessed\":false,\"externalMutationPerformed\":false,\"fictional\":true,\"forbiddenContentFindings\":0,\"local\":true,\"privateNetworkAccessed\":false,\"public\":true,\"synthetic\":true},\"scenarioResults\":[{\"observationDigest\":\"sha256:352e8963be0412a9bbe3954abbd388a9e461ed55511b1f824930e1c7dca41459\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-P-001\"},{\"observationDigest\":\"sha256:242a488f3955ab6a4a51f813252b2fe8838cd82d821e5ec76ce903e6e074d434\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-P-002\"},{\"observationDigest\":\"sha256:c6b1fae7a7f3b10b17fbf7d529b7df1c833d0659f72a2ab0c1f7b4c95ede361b\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-P-003\"},{\"observationDigest\":\"sha256:56a736e8d7f7d8aa09e120668c1cb28630871d65968a2ce23865de0f42c08adf\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-T-001\"},{\"observationDigest\":\"sha256:82f42acb32879b05dd4ccb63a1f1e7431b04cbd40c8075571754bfaddbfdfebb\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-T-002\"},{\"observationDigest\":\"sha256:70e291d1b2239c1515eca65e68ae31acd9d84fb7187e0c7dddd7da05e30d762d\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-T-003\"},{\"observationDigest\":\"sha256:6174df6b402caaea4a3be34de804a69fe442e5f61218234d41afdf04ff2bbbac\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-D-001\"},{\"observationDigest\":\"sha256:ad3003a1fb42b2ff45eae49b8d709ef1daa539bc94e37dcb304915b26f1049db\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-D-002\"},{\"observationDigest\":\"sha256:6de960c5915afc8550794c5ff7d2946c082eb0c98f2df5c9bdd094de71b27fd5\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-D-003\"},{\"observationDigest\":\"sha256:4d1d25ced2fffb60ec2894e020370ed3450a4c7dab65881c7d686038c2a4a54c\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-QA-001\"},{\"observationDigest\":\"sha256:f9e0e1a361a3df12d2efbcb2b79dd2f67f1302da7081dacdc539341426a24a89\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-QA-002\"},{\"observationDigest\":\"sha256:8ceb9e656314eabc2aab076c495ab58fe2f19afb0e47f32f758bfbf12778539c\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-QA-003\"},{\"observationDigest\":\"sha256:68c23b61a205e861b736636629092c8c47bf4a9c179f757f4e555972e9409567\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-QA-004\"},{\"observationDigest\":\"sha256:492104bce949402ccce57dba8d542173a710251b4c5d3abc39374b0b530c5eda\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-QA-005\"},{\"observationDigest\":\"sha256:2769ee48fac288c67dbf4bedfc7bb91be5fcfa3f0d73cc0d85caa0eae54c70e7\",\"result\":\"pass\",\"scenarioId\":\"SPK-R0-001-QA-006\"}],\"schemaVersion\":\"1.0.0\",\"scopeClass\":\"local-synthetic\",\"sourceRevision\":\"0000000000000000000000000000000000000000\",\"stageBindingDigest\":\"sha256:fc172d2f8c1e5f9dccdf7a5c398fe0a2038591f7fb2903e54961879c73041983\",\"stageId\":\"P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION\",\"stateDigests\":{\"afterSha256\":\"sha256:5e5ca1fe23fdbcc586e726975432bea956c06925af89a9cb8414c865a94a6413\",\"backupSha256\":\"sha256:d2c32688c486281d34e0347c5627ac0485e6afda8654c1f2b564c5e42a406755\",\"beforeSha256\":\"sha256:1cc4fe59e27e03a351df8edb1627c06b2e188204864428dd10dd2472590cca06\",\"comparisonSha256\":\"sha256:d79c30e6178a72937bb321eeab813fd9a98421632a520f412fe464f688df5458\",\"restoreSha256\":\"sha256:5e5ca1fe23fdbcc586e726975432bea956c06925af89a9cb8414c865a94a6413\",\"rollbackSha256\":\"sha256:1cc4fe59e27e03a351df8edb1627c06b2e188204864428dd10dd2472590cca06\"},\"taskId\":\"SPK-R0-001\"}";
const SPK_ZERO_REVISION_CHILD_CANONICAL_SHA256 =
  "sha256:35a08e70b9364812bba9c15d701aba2048f2f3c28c147706c6ec06d20d6cf462";
const SPK_ZERO_REVISION_CHILD_CANONICAL_BYTES = "{\"evidenceDigest\":\"sha256:21a2b56022c4034d8ff6f1eed8c8933cb5980fb39191ed211e30209cbf954608\",\"idempotencyKey\":\"P0-IDEMP-SPK-R0-001-SYNTHETIC-001\",\"outcome\":\"succeeded\",\"schemaVersion\":\"1.0.0\",\"sourceRevision\":\"0000000000000000000000000000000000000000\",\"stageBindingDigest\":\"sha256:fc172d2f8c1e5f9dccdf7a5c398fe0a2038591f7fb2903e54961879c73041983\",\"stageId\":\"P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION\",\"taskId\":\"SPK-R0-001\"}";
const SPK_ZERO_REVISION_CHILD_TERMINAL_SHA256 =
  "sha256:5edb9a81d6d75d36bde47f713cd38007e809236a19e54858d3cf3ae087188795";
const SPK_ZERO_REVISION_CHILD_TERMINAL_BYTE_LENGTH = 422;
const SPK_REQUIREMENT_IDS = Object.freeze([
  "LID-SCP-001", "LID-OPS-001", "LID-OPS-002", "LID-OPS-003", "LID-OPS-004",
  "LID-OPS-008", "LID-OPS-011", "LID-OPS-012", "LID-OPS-014", "LID-OPS-016",
  "LID-OPS-018",
]);
const SPK_SCENARIO_IDS = Object.freeze([
  "SPK-R0-001-P-001", "SPK-R0-001-P-002", "SPK-R0-001-P-003",
  "SPK-R0-001-T-001", "SPK-R0-001-T-002", "SPK-R0-001-T-003",
  "SPK-R0-001-D-001", "SPK-R0-001-D-002", "SPK-R0-001-D-003",
  "SPK-R0-001-QA-001", "SPK-R0-001-QA-002", "SPK-R0-001-QA-003",
  "SPK-R0-001-QA-004", "SPK-R0-001-QA-005", "SPK-R0-001-QA-006",
]);
const SPK_CONTRACT_IDS = Object.freeze([
  "surface-isolation", "capacity-and-collision", "authenticated-encryption",
  "backup-restore-rollback", "durable-health", "sanitized-logging",
  "replay-interruption-crash", "receipt-boundary",
]);
const SPK_REQUIREMENT_COMPONENTS = Object.freeze({
  "LID-SCP-001": Object.freeze(["access", "privateBoundary"]),
  "LID-OPS-001": Object.freeze(["access", "replay"]),
  "LID-OPS-002": Object.freeze(["access", "replay"]),
  "LID-OPS-003": Object.freeze(["logging", "privateBoundary"]),
  "LID-OPS-004": Object.freeze(["encryption", "recovery"]),
  "LID-OPS-008": Object.freeze(["access", "logging"]),
  "LID-OPS-011": Object.freeze(["recovery"]),
  "LID-OPS-012": Object.freeze(["encryption", "recovery", "privateBoundary"]),
  "LID-OPS-014": Object.freeze(["health", "replay"]),
  "LID-OPS-016": Object.freeze(["logging", "privateBoundary"]),
  "LID-OPS-018": Object.freeze(["capacity", "recovery", "replay"]),
});
const SPK_SCENARIO_COMPONENTS = Object.freeze({
  "SPK-R0-001-P-001": Object.freeze(["access", "capacity", "encryption", "health", "recovery", "replay"]),
  "SPK-R0-001-P-002": Object.freeze(["privateBoundary", "requirements"]),
  "SPK-R0-001-P-003": Object.freeze(["logging", "requirements"]),
  "SPK-R0-001-T-001": Object.freeze(["access", "encryption", "replay"]),
  "SPK-R0-001-T-002": Object.freeze(["encryption", "recovery"]),
  "SPK-R0-001-T-003": Object.freeze(["access", "capacity", "logging", "privateBoundary", "replay"]),
  "SPK-R0-001-D-001": Object.freeze(["health", "statePresentation"]),
  "SPK-R0-001-D-002": Object.freeze(["accessibility"]),
  "SPK-R0-001-D-003": Object.freeze(["logging", "privateBoundary", "recovery", "statePresentation"]),
  "SPK-R0-001-QA-001": Object.freeze(["access", "capacity", "encryption", "health", "recovery", "replay"]),
  "SPK-R0-001-QA-002": Object.freeze(["access", "capacity", "encryption", "recovery", "replay"]),
  "SPK-R0-001-QA-003": Object.freeze(["access", "encryption", "logging", "privateBoundary"]),
  "SPK-R0-001-QA-004": Object.freeze(["encryption", "recovery"]),
  "SPK-R0-001-QA-005": Object.freeze(["accessibility"]),
  "SPK-R0-001-QA-006": Object.freeze(["capacity", "health", "replay"]),
});
const SPK_CONTRACT_COMPONENTS = Object.freeze({
  "surface-isolation": Object.freeze(["access"]),
  "capacity-and-collision": Object.freeze(["capacity"]),
  "authenticated-encryption": Object.freeze(["encryption"]),
  "backup-restore-rollback": Object.freeze(["recovery"]),
  "durable-health": Object.freeze(["health"]),
  "sanitized-logging": Object.freeze(["logging"]),
  "replay-interruption-crash": Object.freeze(["replay"]),
  "receipt-boundary": Object.freeze(["accessibility", "privateBoundary", "statePresentation"]),
});
const SPK_COMPONENT_OBSERVATION_DIGESTS = Object.freeze({
  access: "sha256:c210f12d67c7717a6d2a167ea7f783b78ba818fbc91616c0fea1be76564544c8",
  accessibility: "sha256:0e3962d9e6c37946e74560e04e66817d18735dd084bc86d0b238bd9762f256b6",
  capacity: "sha256:4d1df99a2d40699a1e0765ab65c7e160f0b6a2dbffdb5396cd49c91d2304f53a",
  encryption: "sha256:26e1852c8b6d591a1ed311ca062967053ae1922f6edc1d02fb75cb79e592e299",
  health: "sha256:c6ff947d3e7f775534869c1fee1cecab1af5a69f66fd7a73500d8e7021a33191",
  logging: "sha256:ec226a4eabae72b5e3319489beebbb983a65e4799234d9aa06484d59892a5e67",
  privateBoundary: "sha256:219e239b97226d5b4f83d679c9e3140d18c16fe9be6b44c0bf5a36149e9985b3",
  recovery: "sha256:71fb6fa83a3471779d8f52ed1ff6009b7a5e847782455813760d4cabc31c9c07",
  replay: "sha256:7c193bb11dd08b7a74bc360b6d2677b00787dd65e0b8a7d9b6bd78e259d33412",
  statePresentation: "sha256:a84e3f0851d3862377ca1a361600a6948bbe8f5f2ace4b837ef9d2b9ec20197b",
});
const SPK_STATE_DIGESTS = Object.freeze({
  beforeSha256: "sha256:1cc4fe59e27e03a351df8edb1627c06b2e188204864428dd10dd2472590cca06",
  afterSha256: "sha256:5e5ca1fe23fdbcc586e726975432bea956c06925af89a9cb8414c865a94a6413",
  backupSha256: "sha256:d2c32688c486281d34e0347c5627ac0485e6afda8654c1f2b564c5e42a406755",
  restoreSha256: "sha256:5e5ca1fe23fdbcc586e726975432bea956c06925af89a9cb8414c865a94a6413",
  comparisonSha256: "sha256:d79c30e6178a72937bb321eeab813fd9a98421632a520f412fe464f688df5458",
  rollbackSha256: "sha256:1cc4fe59e27e03a351df8edb1627c06b2e188204864428dd10dd2472590cca06",
});
const SPK_LIMITATIONS = Object.freeze([
  "The cipher uses deterministic test-only material and nonce derivation for reproducible synthetic checks; it is not a production cryptography or key-custody selection.",
  "Recovery is an in-memory fictional model with no filesystem path, repository, provider, or private backup access.",
  "Capacity values are fixed fictional assumptions and are not host measurements, an SLA, HA evidence, or coexistence acceptance.",
  "The serializable module has no rendered product UI, so product UI accessibility remains untested.",
  "Source, dependency-closure, runtime-output, and retained-artifact safety require separately bound candidate QA; this governed digest reports only exercised in-memory synthetic observations.",
  "A passing result does not complete SPK-R0-001 or authorize a private follow-on, deployment, acceptance, status change, release, or production use.",
]);
const SPK_PERMITTED_CLAIM = "Exact local, public, fictional, synthetic foundation checks passed; live-host fit, private access, deployment, task acceptance, status transition, release, and production readiness remain unproven.";
const SPK_RECONSTRUCTION_REQUEST_KEYS = Object.freeze([
  "moduleId", "taskId", "stageId", "sourceRevision", "stageBindingDigest",
  "moduleSha256", "evidenceDigest",
]);
const SPK_VERIFICATION_REQUEST_KEYS = Object.freeze([
  "schemaVersion", "boundary", "moduleId", "taskId", "stageId", "sourceRevision",
  "stageBindingDigest", "moduleSha256", "childResultSha256", "evidenceDigest",
]);
const SPK_VERIFICATION_BOUNDARIES = Object.freeze(["immediate", "quiescent-1", "quiescent-2"]);
const SPK_ZERO_REVISION_BOUNDARY_OBSERVATION_SHA256 = Object.freeze({
  immediate: "sha256:8c6ae28e2a8623ea542fe344e4bafe8e21a04bcafebc41de6ec249e87ca57bc2",
  "quiescent-1": "sha256:076a3b0d6cc62c2515791e2225492deb4562ad19c065e20271a4803d037569a7",
  "quiescent-2": "sha256:8bb23a25fe2334a34af49396a9fe796ad7900adb06934c788f11c5ba3c9e505e",
});
function reconstructSpkIndependentContract() {
  // Independent code-owned reconstruction: this duplicates the reviewed public
  // semantic recipes, but imports or calls no task-module code.
  const createCipheriv = crypto.createCipheriv;
  const createDecipheriv = crypto.createDecipheriv;
  const createHash = crypto.createHash;
  const SCHEMA_VERSION = "1.0.0";
  const MODULE_ID = SPK_SYNTHETIC_MODULE_ID;
  const ARGUMENT_SET_ID = SPK_SYNTHETIC_ARGUMENT_SET_ID;
  const TASK_ID = SPK_SYNTHETIC_TASK_ID;
  const PREPARATION_REVIEW_ID = "P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION";
  const STAGE_ID = SPK_SYNTHETIC_STAGE_ID;
  const SCOPE_CLASS = "local-synthetic";
  const ACTION_CLASS = "synthetic-foundation";
  const IDEMPOTENCY_KEY = SPK_SYNTHETIC_IDEMPOTENCY_KEY;
  const STAGE_BINDING_DIGEST = SPK_SYNTHETIC_STAGE_BINDING_DIGEST;
  const TASK_CONTRACT_SHA256 = "sha256:f58e65c56e58dc4b1e12deab68f7349822f7f95dd33eee4fcd4872243170fa23";
  const FIXTURE_SCHEMA = "spk-r0-001.synthetic-foundation.fixture.v1";
  const FIXED_SEED_ID = "spk-r0-001-fixed-seed-v1";
  const FIXED_CLOCK_START = "2030-01-01T00:00:00.000Z";
  const FIXED_CLOCK_END = "2030-01-01T00:00:01.000Z";
  const PERMITTED_CLAIM = SPK_PERMITTED_CLAIM;
  const LIMITATIONS = SPK_LIMITATIONS;
  const REQUIREMENT_IDS = SPK_REQUIREMENT_IDS;
  const SCENARIO_IDS = SPK_SCENARIO_IDS;
  const CONTRACT_IDS = SPK_CONTRACT_IDS;
  const sha256Bytes = (value) => sha256(value);
  const digest = (value) => spkDigest(value);
  const rawSha256 = (value) => createHash("sha256").update(value).digest();
  const invariant = (condition) => {
    if (!condition) throw new Error("independent SPK reconstruction invariant failed");
  };
  const deepFreeze = (value) => deepFreezeSpk(value);
  const cloneCanonical = (value) => JSON.parse(canonicalJson(value));
  const compareAscii = (left, right) => left < right ? -1 : left > right ? 1 : 0;
  const CANONICAL_JSON_TEST_VALUE = deepFreeze({
    z: 1,
    a: { b: 2, a: 1 },
    list: [{ b: false, a: true }, "x"],
  });
  const CANONICAL_JSON_TEST_BYTES = SPK_CANONICAL_JSON_VECTOR;
  const CANONICAL_JSON_TEST_SHA256 = SPK_CANONICAL_JSON_VECTOR_SHA256;

  const FIXTURE = deepFreeze({
    schemaVersion: FIXTURE_SCHEMA,
    fixtureClass: {
      local: true,
      public: true,
      fictional: true,
      synthetic: true,
      authenticContentIncluded: false,
      privateTargetIncluded: false,
      externalDependencyIncluded: false,
    },
    seedId: FIXED_SEED_ID,
    clock: {
      start: FIXED_CLOCK_START,
      end: FIXED_CLOCK_END,
    },
    human: {
      allowlistedOwner: "fictional-human-01",
      assertion: "fictional-human-assertion-01",
      expiresAt: "2030-01-02T00:00:00.000Z",
    },
    callback: {
      assertion: "fictional-callback-assertion-01",
      maximumBodyBytes: 4096,
    },
    capacity: [
      { dimension: "compute", available: 120, reserve: 20, peak: 100 },
      { dimension: "memory", available: 240, reserve: 40, peak: 200 },
      { dimension: "storage", available: 360, reserve: 60, peak: 300 },
      { dimension: "workers", available: 12, reserve: 2, peak: 10 },
    ],
    namespaces: {
      candidate: [
        { namespaceClass: "data", token: "candidate-data-01" },
        { namespaceClass: "job", token: "candidate-job-01" },
        { namespaceClass: "service", token: "candidate-service-01" },
      ],
      existing: [
        { namespaceClass: "data", token: "existing-data-01" },
        { namespaceClass: "job", token: "existing-job-01" },
        { namespaceClass: "service", token: "existing-service-01" },
      ],
    },
    fictionalRecords: [
      { opaqueId: "record-01", relationId: "relation-01", value: "fictional-canary-alpha" },
      { opaqueId: "record-02", relationId: "relation-01", value: "fictional-canary-beta" },
    ],
    recovery: {
      custodyLocations: ["fictional-custody-location-a", "fictional-custody-location-b"],
      materialClass: "disposable-synthetic-test-material",
    },
    syntheticKeySeed: "fictional-independent-test-material-v1",
  });

  function humanAccessDecision(input) {
    if (!hasExactKeys(input, [
      "assertion", "expiresAt", "hostClass", "method", "owner", "routeClass",
    ])) return "deny";
    if (input.hostClass !== "fictional-human-origin"
      || input.routeClass !== "human-archive"
      || input.method !== "GET"
      || input.assertion !== FIXTURE.human.assertion
      || input.owner !== FIXTURE.human.allowlistedOwner
      || input.expiresAt !== FIXTURE.human.expiresAt
      || Date.parse(input.expiresAt) <= Date.parse(FIXED_CLOCK_START)) return "deny";
    return "allow";
  }

  function callbackAccessDecision(input) {
    if (!hasExactKeys(input, [
      "assertion", "authorizationClass", "bodyBytes", "hostClass", "method", "routeClass",
    ])) return "deny";
    if (input.authorizationClass !== "callback-assertion"
      || input.assertion !== FIXTURE.callback.assertion
      || input.hostClass !== "fictional-callback-origin"
      || input.routeClass !== "machine-callback"
      || input.method !== "POST") return "deny";
    if (!Number.isSafeInteger(input.bodyBytes)
      || input.bodyBytes < 0
      || input.bodyBytes > FIXTURE.callback.maximumBodyBytes) return "deny";
    return "allow";
  }

  function newSurfaceState() {
    return { bodyProcessCount: 0, durableEffectCount: 0, callbackReceipts: {} };
  }

  function applyHumanSurface(state, authorization, action) {
    const decision = humanAccessDecision(authorization);
    if (decision !== "allow" || action !== "archive-read") {
      return {
        decision: "deny",
        bodyProcessCount: state.bodyProcessCount,
        durableEffectCount: state.durableEffectCount,
        successReceiptCreated: false,
      };
    }
    return {
      decision: "allow",
      bodyProcessCount: state.bodyProcessCount,
      durableEffectCount: state.durableEffectCount,
      successReceiptCreated: true,
    };
  }

  function applyCallbackSurface(state, authorization, action, idempotencyKey) {
    const decision = callbackAccessDecision(authorization);
    if (decision !== "allow"
      || action !== "callback-ingest"
      || !/^callback-idempotency-[0-9]{4}$/.test(idempotencyKey)) {
      return {
        decision: "deny",
        bodyProcessCount: state.bodyProcessCount,
        durableEffectCount: state.durableEffectCount,
        receiptIdentity: null,
        successReceiptCreated: false,
      };
    }
    const requestIdentity = digest({ action, authorization, idempotencyKey });
    const existing = state.callbackReceipts[idempotencyKey];
    if (existing !== undefined) {
      return {
        decision: existing.requestIdentity === requestIdentity ? "allow" : "deny",
        bodyProcessCount: state.bodyProcessCount,
        durableEffectCount: state.durableEffectCount,
        receiptIdentity: existing.requestIdentity === requestIdentity ? existing.receiptIdentity : null,
        successReceiptCreated: existing.requestIdentity === requestIdentity,
      };
    }
    state.bodyProcessCount += 1;
    state.durableEffectCount += 1;
    const receiptIdentity = digest({ idempotencyKey, requestIdentity });
    state.callbackReceipts[idempotencyKey] = { receiptIdentity, requestIdentity };
    return {
      decision: "allow",
      bodyProcessCount: state.bodyProcessCount,
      durableEffectCount: state.durableEffectCount,
      receiptIdentity,
      successReceiptCreated: true,
    };
  }

  function buildAccessResult() {
    const humanHappy = {
      assertion: FIXTURE.human.assertion,
      expiresAt: FIXTURE.human.expiresAt,
      hostClass: "fictional-human-origin",
      method: "GET",
      owner: FIXTURE.human.allowlistedOwner,
      routeClass: "human-archive",
    };
    const callbackHappy = {
      assertion: FIXTURE.callback.assertion,
      authorizationClass: "callback-assertion",
      bodyBytes: FIXTURE.callback.maximumBodyBytes,
      hostClass: "fictional-callback-origin",
      method: "POST",
      routeClass: "machine-callback",
    };
    const humanWithoutAssertion = {
      expiresAt: humanHappy.expiresAt,
      hostClass: humanHappy.hostClass,
      method: humanHappy.method,
      owner: humanHappy.owner,
      routeClass: humanHappy.routeClass,
    };
    const humanCases = [
      { id: "allowlisted-owner", expected: "allow", input: humanHappy },
      { id: "missing-assertion", expected: "deny", input: humanWithoutAssertion },
      { id: "empty-assertion", expected: "deny", input: { ...humanHappy, assertion: "" } },
      { id: "malformed-assertion", expected: "deny", input: { ...humanHappy, assertion: "malformed" } },
      { id: "expired-assertion", expected: "deny", input: { ...humanHappy, expiresAt: "2029-12-31T23:59:59.000Z" } },
      { id: "second-human", expected: "deny", input: { ...humanHappy, owner: "fictional-human-02" } },
      { id: "anonymous", expected: "deny", input: { ...humanHappy, owner: "anonymous" } },
      { id: "sharing", expected: "deny", input: { ...humanHappy, routeClass: "sharing" } },
      { id: "invitation", expected: "deny", input: { ...humanHappy, routeClass: "invitation" } },
      { id: "public-route", expected: "deny", input: { ...humanHappy, hostClass: "fictional-public-origin" } },
      { id: "callback-cross-surface", expected: "deny", input: { ...humanHappy, assertion: FIXTURE.callback.assertion } },
    ];
    const callbackCases = [
      { id: "callback-allow", expected: "allow", input: callbackHappy },
      { id: "wrong-authorization-class", expected: "deny", input: { ...callbackHappy, authorizationClass: "human-assertion" } },
      { id: "wrong-host-class", expected: "deny", input: { ...callbackHappy, hostClass: "fictional-human-origin" } },
      { id: "human-route", expected: "deny", input: { ...callbackHappy, routeClass: "human-archive" } },
      { id: "wrong-method", expected: "deny", input: { ...callbackHappy, method: "GET" } },
      { id: "oversized-body", expected: "deny", input: { ...callbackHappy, bodyBytes: FIXTURE.callback.maximumBodyBytes + 1 } },
      { id: "human-cross-surface", expected: "deny", input: { ...callbackHappy, assertion: FIXTURE.human.assertion } },
    ];
    const humanResults = humanCases.map(({ id, expected, input }) => ({
      id,
      result: humanAccessDecision(input),
      pass: humanAccessDecision(input) === expected,
    }));
    const callbackResults = callbackCases.map(({ id, expected, input }) => ({
      id,
      result: callbackAccessDecision(input),
      pass: callbackAccessDecision(input) === expected,
    }));
    const deniedCallbackState = newSurfaceState();
    const deniedCallbackStateBefore = digest(deniedCallbackState);
    const deniedBeforeBody = applyCallbackSurface(
      deniedCallbackState,
      { ...callbackHappy, authorizationClass: "wrong-authorization-class" },
      "callback-ingest",
      "callback-idempotency-0001",
    );
    const deniedCallbackStateAfter = digest(deniedCallbackState);
    const callbackReplayState = newSurfaceState();
    const callbackFirst = applyCallbackSurface(
      callbackReplayState,
      callbackHappy,
      "callback-ingest",
      "callback-idempotency-0001",
    );
    const callbackReplay = applyCallbackSurface(
      callbackReplayState,
      callbackHappy,
      "callback-ingest",
      "callback-idempotency-0001",
    );
    const callbackConflict = applyCallbackSurface(
      callbackReplayState,
      { ...callbackHappy, bodyBytes: callbackHappy.bodyBytes - 1 },
      "callback-ingest",
      "callback-idempotency-0001",
    );
    const callbackForbiddenActions = ["archive-read", "session-read", "search", "media-read", "export"]
      .map((action) => {
        const state = newSurfaceState();
        const beforeDigest = digest(state);
        const actual = applyCallbackSurface(
          state,
          callbackHappy,
          action,
          "callback-idempotency-0002",
        );
        return {
          action,
          expected: "deny",
          actual: actual.decision,
          statePreserved: beforeDigest === digest(state),
          successReceiptCreated: actual.successReceiptCreated,
        };
      });
    const humanForbiddenActions = ["callback-ingest", "callback-replay"]
      .map((action) => {
        const state = newSurfaceState();
        const beforeDigest = digest(state);
        const actual = applyHumanSurface(state, humanHappy, action);
        return {
          action,
          expected: "deny",
          actual: actual.decision,
          statePreserved: beforeDigest === digest(state),
          successReceiptCreated: actual.successReceiptCreated,
        };
      });
    const humanAllowedOwners = humanCases
      .filter(({ input }) => humanAccessDecision(input) === "allow")
      .map(({ input }) => input.owner);
    const authorizationBeforeBodyProcessing = deniedBeforeBody.decision === "deny"
      && deniedBeforeBody.bodyProcessCount === 0
      && deniedBeforeBody.durableEffectCount === 0;
    const durableStateChangedOnDenial = deniedCallbackStateBefore !== deniedCallbackStateAfter;
    const callbackReplayStable = callbackFirst.successReceiptCreated
      && callbackReplay.successReceiptCreated
      && callbackReplay.receiptIdentity === callbackFirst.receiptIdentity
      && callbackFirst.bodyProcessCount === 1
      && callbackFirst.durableEffectCount === 1
      && callbackReplay.bodyProcessCount === 1
      && callbackReplay.durableEffectCount === 1
      && callbackReplayState.bodyProcessCount === 1
      && callbackReplayState.durableEffectCount === 1
      && callbackConflict.decision === "deny"
      && !callbackConflict.successReceiptCreated
      && callbackReplayState.bodyProcessCount === 1
      && callbackReplayState.durableEffectCount === 1;
    const humanAndCallbackSurfacesDisjoint = callbackForbiddenActions.every((entry) => (
      entry.actual === entry.expected && entry.statePreserved && !entry.successReceiptCreated
    )) && humanForbiddenActions.every((entry) => (
      entry.actual === entry.expected && entry.statePreserved && !entry.successReceiptCreated
    ));
    const syntheticResponse = {
      originClass: "fictional-same-origin",
      cacheControl: "private, no-store",
      sharedCacheDirective: "denied",
      browserVisibleFields: ["opaque-result-class", "durable-state"],
    };
    const browserFields = new Set(syntheticResponse.browserVisibleFields);
    const responseContract = {
      sameOrigin: syntheticResponse.originClass === "fictional-same-origin",
      privateCache: syntheticResponse.cacheControl.split(",").map((value) => value.trim()).includes("private"),
      noStore: syntheticResponse.cacheControl.split(",").map((value) => value.trim()).includes("no-store"),
      sharedCacheAllowed: syntheticResponse.sharedCacheDirective !== "denied",
      storageLocatorExposed: browserFields.has("storage-locator"),
      decryptionMaterialExposed: browserFields.has("decryption-material"),
    };
    const pass = humanResults.every((entry) => entry.pass)
      && callbackResults.every((entry) => entry.pass)
      && new Set(humanAllowedOwners).size === 1
      && humanAllowedOwners[0] === FIXTURE.human.allowlistedOwner
      && authorizationBeforeBodyProcessing
      && !durableStateChangedOnDenial
      && callbackReplayStable
      && humanAndCallbackSurfacesDisjoint
      && responseContract.sameOrigin
      && responseContract.privateCache
      && responseContract.noStore
      && !responseContract.sharedCacheAllowed
      && !responseContract.storageLocatorExposed
      && !responseContract.decryptionMaterialExposed;
    return {
      pass,
      oneFictionalHuman: new Set(humanAllowedOwners).size === 1,
      allowedHumanCount: new Set(humanAllowedOwners).size,
      humanCases: humanResults,
      callbackCases: callbackResults,
      authorizationBeforeBodyProcessing,
      durableStateChangedOnDenial,
      callbackReplay: {
        firstEffectCount: callbackFirst.durableEffectCount,
        replayEffectCount: callbackReplay.durableEffectCount,
        receiptStable: callbackReplay.receiptIdentity === callbackFirst.receiptIdentity,
        conflictRejected: callbackConflict.decision === "deny",
        pass: callbackReplayStable,
      },
      callbackForbiddenActions,
      humanForbiddenActions,
      humanAndCallbackSurfacesDisjoint,
      responseContract,
    };
  }

  const CAPACITY_DIMENSIONS = Object.freeze(["compute", "memory", "storage", "workers"]);
  const NAMESPACE_CLASSES = Object.freeze(["data", "job", "service"]);

  function capacityDecision(entries, candidateNamespaces, existingNamespaces) {
    if (!Array.isArray(entries)
      || !Array.isArray(candidateNamespaces)
      || !Array.isArray(existingNamespaces)) return { admitted: false, code: "schema-invalid" };
    const seenDimensions = new Set();
    const normalizedEntries = [];
    for (const entry of entries) {
      if (!hasExactKeys(entry, ["available", "dimension", "peak", "reserve"])
        || !CAPACITY_DIMENSIONS.includes(entry.dimension)
        || seenDimensions.has(entry.dimension)
        || ![entry.available, entry.reserve, entry.peak].every((value) => (
          Number.isSafeInteger(value) && value >= 0
        ))
        || entry.reserve > entry.available) return { admitted: false, code: "capacity-invalid" };
      seenDimensions.add(entry.dimension);
      normalizedEntries.push({
        dimension: entry.dimension,
        passes: entry.peak <= entry.available - entry.reserve,
      });
    }
    if (seenDimensions.size !== CAPACITY_DIMENSIONS.length
      || CAPACITY_DIMENSIONS.some((dimension) => !seenDimensions.has(dimension))) {
      return { admitted: false, code: "dimension-set-invalid" };
    }
    const normalizeNamespaces = (values) => {
      const seen = new Set();
      const output = [];
      for (const entry of values) {
        if (!hasExactKeys(entry, ["namespaceClass", "token"])
          || !NAMESPACE_CLASSES.includes(entry.namespaceClass)
          || !/^[a-z][a-z0-9-]{7,63}$/.test(entry.token)) return null;
        const key = `${entry.namespaceClass}\0${entry.token}`;
        if (seen.has(key)) return null;
        seen.add(key);
        output.push({ namespaceClass: entry.namespaceClass, token: entry.token });
      }
      return output.sort((left, right) => (
        compareAscii(left.namespaceClass, right.namespaceClass) || compareAscii(left.token, right.token)
      ));
    };
    const candidate = normalizeNamespaces(candidateNamespaces);
    const existing = normalizeNamespaces(existingNamespaces);
    if (candidate === null || existing === null
      || candidate.length !== NAMESPACE_CLASSES.length
      || NAMESPACE_CLASSES.some((namespaceClass) => (
        candidate.filter((entry) => entry.namespaceClass === namespaceClass).length !== 1
      ))) return { admitted: false, code: "namespace-set-invalid" };
    const existingKeys = new Set(existing.map((entry) => `${entry.namespaceClass}\0${entry.token}`));
    const collisionClasses = candidate
      .filter((entry) => existingKeys.has(`${entry.namespaceClass}\0${entry.token}`))
      .map((entry) => entry.namespaceClass)
      .sort();
    const dimensions = normalizedEntries.sort((left, right) => compareAscii(left.dimension, right.dimension));
    const admitted = dimensions.every((entry) => entry.passes) && collisionClasses.length === 0;
    return {
      admitted,
      code: admitted ? "admitted" : collisionClasses.length > 0 ? "collision" : "capacity-exceeded",
      dimensions,
      collisionClasses,
      canonicalInputDigest: digest({
        candidate,
        entries: [...entries].sort((left, right) => compareAscii(left.dimension, right.dimension)),
        existing,
      }),
    };
  }

  function buildCapacityResult() {
    const candidate = FIXTURE.namespaces.candidate;
    const existing = FIXTURE.namespaces.existing;
    const existingBeforeDigest = digest(existing);
    const happy = capacityDecision(FIXTURE.capacity, candidate, existing);
    const permuted = capacityDecision(
      [...FIXTURE.capacity].reverse(),
      [...candidate].reverse(),
      [...existing].reverse(),
    );
    const boundaryVectors = CAPACITY_DIMENSIONS.flatMap((dimension) => {
      const base = FIXTURE.capacity.map((entry) => ({ ...entry }));
      const index = base.findIndex((entry) => entry.dimension === dimension);
      const usable = base[index].available - base[index].reserve;
      const run = (offset) => {
        const vector = base.map((entry) => ({ ...entry }));
        vector[index].peak = usable + offset;
        return capacityDecision(vector, candidate, existing).admitted;
      };
      return [
        { dimension, vector: "one-below", result: run(-1), expected: true },
        { dimension, vector: "equal", result: run(0), expected: true },
        { dimension, vector: "one-over", result: run(1), expected: false },
      ];
    });
    const mutationVectors = [
      {
        id: "missing-dimension",
        rejected: capacityDecision(FIXTURE.capacity.slice(1), candidate, existing).admitted === false,
      },
      {
        id: "unknown-dimension",
        rejected: capacityDecision([
          ...FIXTURE.capacity.slice(1),
          { dimension: "unknown", available: 1, reserve: 0, peak: 0 },
        ], candidate, existing).admitted === false,
      },
      {
        id: "negative",
        rejected: capacityDecision([
          { ...FIXTURE.capacity[0], peak: -1 }, ...FIXTURE.capacity.slice(1),
        ], candidate, existing).admitted === false,
      },
      {
        id: "non-integer",
        rejected: capacityDecision([
          { ...FIXTURE.capacity[0], peak: 1.5 }, ...FIXTURE.capacity.slice(1),
        ], candidate, existing).admitted === false,
      },
      {
        id: "duplicate-dimension",
        rejected: capacityDecision([
          ...FIXTURE.capacity.slice(0, -1), { ...FIXTURE.capacity[0] },
        ], candidate, existing).admitted === false,
      },
      {
        id: "unsafe-integer",
        rejected: capacityDecision([
          { ...FIXTURE.capacity[0], available: Number.MAX_SAFE_INTEGER + 1 }, ...FIXTURE.capacity.slice(1),
        ], candidate, existing).admitted === false,
      },
      {
        id: "unknown-namespace-class",
        rejected: capacityDecision(FIXTURE.capacity, [
          ...candidate.slice(1), { namespaceClass: "unknown", token: "candidate-unknown-01" },
        ], existing).admitted === false,
      },
      {
        id: "missing-namespace-class",
        rejected: capacityDecision(FIXTURE.capacity, candidate.slice(1), existing).admitted === false,
      },
      {
        id: "duplicate-namespace-key",
        rejected: capacityDecision(FIXTURE.capacity, [...candidate, { ...candidate[0] }], existing).admitted === false,
      },
      {
        id: "malformed-namespace-token",
        rejected: capacityDecision(FIXTURE.capacity, [
          { ...candidate[0], token: "INVALID" }, ...candidate.slice(1),
        ], existing).admitted === false,
      },
    ];
    const collisionVectors = NAMESPACE_CLASSES.map((namespaceClass) => {
      const existingEntry = existing.find((entry) => entry.namespaceClass === namespaceClass);
      const colliding = candidate.map((entry) => (
        entry.namespaceClass === namespaceClass ? { ...existingEntry } : entry
      ));
      const decision = capacityDecision(FIXTURE.capacity, colliding, existing);
      return { namespaceClass, collisionReported: decision.code === "collision", admitted: decision.admitted };
    });
    const canonicalDecisionEqual = canonicalJson(happy) === canonicalJson(permuted);
    const pass = happy.admitted
      && canonicalDecisionEqual
      && boundaryVectors.every((entry) => entry.result === entry.expected)
      && mutationVectors.every((entry) => entry.rejected)
      && collisionVectors.every((entry) => entry.collisionReported && !entry.admitted)
      && digest(existing) === existingBeforeDigest;
    return {
      pass,
      dimensionClasses: CAPACITY_DIMENSIONS,
      happyDecision: happy.admitted ? "pass" : "fail",
      happyDecisionDigest: digest(happy),
      canonicalPermutationEqual: canonicalDecisionEqual,
      boundaryVectors,
      invalidInputVectors: mutationVectors,
      collisionVectors,
      collisionMutationPerformed: digest(existing) !== existingBeforeDigest,
      resourceEnvelopeSchemaVersion: "fictional-resource-envelope-v1",
      liveCapacityMeasured: false,
      liveCoResidentWorkloadMeasured: false,
      highAvailabilityClaimed: false,
      serviceLevelClaimed: false,
    };
  }

  const CIPHER_ALGORITHM = "aes-256-gcm";
  const CIPHER_VERSION = "synthetic-envelope-v1";
  const CIPHER_AAD = Buffer.from(`${TASK_ID}\0${FIXTURE_SCHEMA}`, "utf8");
  const SYNTHETIC_KEY = rawSha256(Buffer.from(`${FIXED_SEED_ID}\0${FIXTURE.syntheticKeySeed}`, "utf8"));
  const WRONG_SYNTHETIC_KEY = rawSha256(Buffer.from(`${FIXED_SEED_ID}\0wrong-fictional-material`, "utf8"));

  function syntheticNonce(label) {
    return rawSha256(Buffer.from(`${FIXED_SEED_ID}\0nonce\0${label}`, "utf8")).subarray(0, 12);
  }

  function newNonceSchedule() {
    return { usedLabels: new Set(), usedNonces: new Set() };
  }

  function encryptSynthetic(plaintext, label, schedule) {
    if (!Buffer.isBuffer(plaintext)
      || typeof label !== "string"
      || !/^record-[0-9]+$/.test(label)
      || schedule === null
      || typeof schedule !== "object"
      || !(schedule.usedLabels instanceof Set)
      || !(schedule.usedNonces instanceof Set)
      || schedule.usedLabels.has(label)) throw new Error("synthetic nonce schedule rejected");
    const nonce = syntheticNonce(label);
    const nonceHex = nonce.toString("hex");
    if (schedule.usedNonces.has(nonceHex)) throw new Error("synthetic nonce reuse rejected");
    schedule.usedLabels.add(label);
    schedule.usedNonces.add(nonceHex);
    const cipher = createCipheriv(CIPHER_ALGORITHM, SYNTHETIC_KEY, nonce);
    cipher.setAAD(CIPHER_AAD);
    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    return {
      algorithm: CIPHER_ALGORITHM,
      authTag: cipher.getAuthTag().toString("hex"),
      ciphertext: ciphertext.toString("hex"),
      nonce: nonceHex,
      version: CIPHER_VERSION,
    };
  }

  function decryptSynthetic(envelope, key) {
    try {
      if (!hasExactKeys(envelope, ["algorithm", "authTag", "ciphertext", "nonce", "version"])
        || envelope.algorithm !== CIPHER_ALGORITHM
        || envelope.version !== CIPHER_VERSION
        || !Buffer.isBuffer(key)
        || key.length !== 32
        || !/^[0-9a-f]{24}$/.test(envelope.nonce)
        || !/^[0-9a-f]{32}$/.test(envelope.authTag)
        || !/^(?:[0-9a-f]{2})+$/.test(envelope.ciphertext)) return null;
      const decipher = createDecipheriv(CIPHER_ALGORITHM, key, Buffer.from(envelope.nonce, "hex"));
      decipher.setAAD(CIPHER_AAD);
      decipher.setAuthTag(Buffer.from(envelope.authTag, "hex"));
      return Buffer.concat([
        decipher.update(Buffer.from(envelope.ciphertext, "hex")),
        decipher.final(),
      ]);
    } catch {
      return null;
    }
  }

  function alterHex(value) {
    return `${value[0] === "0" ? "1" : "0"}${value.slice(1)}`;
  }

  function buildEncryptedFixtureRun() {
    const schedule = newNonceSchedule();
    const state = {
      schemaVersion: "synthetic-state-v1",
      records: FIXTURE.fictionalRecords.map((record, index) => ({
        opaqueId: record.opaqueId,
        envelope: encryptSynthetic(
          Buffer.from(canonicalJson(record), "utf8"),
          `record-${index + 1}`,
          schedule,
        ),
      })),
      relationships: [{ opaqueId: "relation-01", recordCount: 2 }],
    };
    let duplicateLabelRejected = false;
    try {
      encryptSynthetic(
        Buffer.from(canonicalJson(FIXTURE.fictionalRecords[0]), "utf8"),
        "record-1",
        schedule,
      );
    } catch {
      duplicateLabelRejected = true;
    }
    return {
      state,
      nonceScheduleEvidence: {
        duplicateLabelRejected,
        scheduledEncryptionCount: schedule.usedLabels.size,
        uniqueNonceCount: schedule.usedNonces.size,
      },
    };
  }

  function buildEncryptionResult(state, nonceScheduleEvidence) {
    invariant(state !== null && typeof state === "object");
    invariant(hasExactKeys(nonceScheduleEvidence, [
      "duplicateLabelRejected", "scheduledEncryptionCount", "uniqueNonceCount",
    ]));
    const expectedPlaintexts = FIXTURE.fictionalRecords.map((record) => Buffer.from(canonicalJson(record), "utf8"));
    const correctKeyResults = state.records.map((record, index) => (
      decryptSynthetic(record.envelope, SYNTHETIC_KEY)?.equals(expectedPlaintexts[index]) === true
    ));
    const wrongKeyResults = state.records.map((record) => decryptSynthetic(record.envelope, WRONG_SYNTHETIC_KEY) === null);
    const missingKeyResults = state.records.map((record) => decryptSynthetic(record.envelope, null) === null);
    const unknownVersionResults = state.records.map((record) => decryptSynthetic({
      ...record.envelope,
      version: "synthetic-envelope-unknown",
    }, SYNTHETIC_KEY) === null);
    const truncatedResults = state.records.map((record) => decryptSynthetic({
      ...record.envelope,
      ciphertext: record.envelope.ciphertext.slice(0, -2),
    }, SYNTHETIC_KEY) === null);
    const tamperResults = state.records.map((record) => decryptSynthetic({
      ...record.envelope,
      ciphertext: alterHex(record.envelope.ciphertext),
    }, SYNTHETIC_KEY) === null);
    const authTagTamperResults = state.records.map((record) => decryptSynthetic({
      ...record.envelope,
      authTag: alterHex(record.envelope.authTag),
    }, SYNTHETIC_KEY) === null);
    const unknownAlgorithmResults = state.records.map((record) => decryptSynthetic({
      ...record.envelope,
      algorithm: "synthetic-unknown",
    }, SYNTHETIC_KEY) === null);
    const retainedBytes = Buffer.from(canonicalJson(state), "utf8");
    const nonceSet = new Set(state.records.map((record) => record.envelope.nonce));
    const plaintextFragments = ["fictional-canary", "canary-alpha", "canary-beta"]
      .map((value) => Buffer.from(value, "utf8"));
    const plaintextAbsent = expectedPlaintexts.every((plaintext) => !retainedBytes.includes(plaintext))
      && plaintextFragments.every((fragment) => !retainedBytes.includes(fragment));
    const keyAbsent = !retainedBytes.includes(SYNTHETIC_KEY) && !retainedBytes.includes(WRONG_SYNTHETIC_KEY);
    const nonceOnlyInEnvelope = state.records.every((record) => (
      Object.keys(record).sort().join("\0") === ["envelope", "opaqueId"].sort().join("\0")
        && Object.hasOwn(record.envelope, "nonce")
    ));
    const pass = correctKeyResults.every(Boolean)
      && wrongKeyResults.every(Boolean)
      && missingKeyResults.every(Boolean)
      && unknownVersionResults.every(Boolean)
      && truncatedResults.every(Boolean)
      && tamperResults.every(Boolean)
      && authTagTamperResults.every(Boolean)
      && unknownAlgorithmResults.every(Boolean)
      && nonceSet.size === state.records.length
      && nonceScheduleEvidence.duplicateLabelRejected
      && nonceScheduleEvidence.scheduledEncryptionCount === state.records.length
      && nonceScheduleEvidence.uniqueNonceCount === state.records.length
      && plaintextAbsent
      && keyAbsent
      && nonceOnlyInEnvelope;
    return {
      pass,
      algorithmClass: "versioned-authenticated-synthetic-cipher",
      envelopeVersion: CIPHER_VERSION,
      encryptedRecordCount: state.records.length,
      ciphertextDigests: state.records.map((record) => digest(record.envelope)),
      exactRecovery: correctKeyResults.every(Boolean),
      missingKeyRejected: missingKeyResults.every(Boolean),
      wrongKeyRejected: wrongKeyResults.every(Boolean),
      unknownVersionRejected: unknownVersionResults.every(Boolean),
      truncationRejected: truncatedResults.every(Boolean),
      tamperRejected: tamperResults.every(Boolean),
      authenticationTagTamperRejected: authTagTamperResults.every(Boolean),
      unknownAlgorithmRejected: unknownAlgorithmResults.every(Boolean),
      uniqueNonceWithinDeterministicRun: nonceSet.size === state.records.length,
      duplicateEncryptionLabelRejected: nonceScheduleEvidence.duplicateLabelRejected,
      scheduledEncryptionCount: nonceScheduleEvidence.scheduledEncryptionCount,
      plaintextAbsentFromRetainedState: plaintextAbsent,
      testMaterialAbsentFromRetainedState: keyAbsent,
      nonceRetainedOnlyInsideEnvelope: nonceOnlyInEnvelope,
      productionCipherSelectionClaimed: false,
      productionKeyCustodyClaimed: false,
    };
  }

  function buildBaselineState() {
    return {
      schemaVersion: "synthetic-baseline-v1",
      existingNamespaces: cloneCanonical(FIXTURE.namespaces.existing),
      candidateNamespaces: [],
      encryptedRecords: [],
      relationships: [],
    };
  }

  const BACKUP_KEYS = Object.freeze(["manifest", "manifestDigest", "payload", "payloadDigest", "schemaVersion"]);
  const BACKUP_PAYLOAD_KEYS = Object.freeze([
    "candidateNamespaces", "encryptedRecords", "existingNamespaces", "relationships", "schemaVersion",
  ]);
  const BACKUP_MANIFEST_KEYS = Object.freeze([
    "candidateNamespaceCount",
    "ciphertextDigests",
    "expectedAbsentClasses",
    "existingNamespaceCount",
    "namespaceInventoryDigest",
    "recordCount",
    "relationshipCount",
    "schemaVersions",
    "stateSchemaVersion",
  ]);
  const RESTORE_DESTINATION_KEYS = Object.freeze([
    "destinationClass", "empty", "state",
  ]);

  function backupManifestForPayload(payload) {
    return {
      candidateNamespaceCount: payload.candidateNamespaces.length,
      ciphertextDigests: payload.encryptedRecords.map((record) => digest(record.envelope)),
      expectedAbsentClasses: ["decryption-material", "plaintext", "storage-locator"],
      existingNamespaceCount: payload.existingNamespaces.length,
      namespaceInventoryDigest: digest({
        candidateNamespaces: payload.candidateNamespaces,
        existingNamespaces: payload.existingNamespaces,
      }),
      recordCount: payload.encryptedRecords.length,
      relationshipCount: payload.relationships.length,
      schemaVersions: [...new Set(payload.encryptedRecords.map((record) => record.envelope.version))].sort(compareAscii),
      stateSchemaVersion: payload.schemaVersion,
    };
  }

  function backupFromState(state) {
    const payload = {
      candidateNamespaces: cloneCanonical(state.candidateNamespaces),
      encryptedRecords: cloneCanonical(state.encryptedRecords),
      existingNamespaces: cloneCanonical(state.existingNamespaces),
      relationships: cloneCanonical(state.relationships),
      schemaVersion: state.schemaVersion,
    };
    const manifest = backupManifestForPayload(payload);
    return {
      schemaVersion: "synthetic-backup-v1",
      manifest,
      manifestDigest: digest(manifest),
      payload,
      payloadDigest: digest(payload),
    };
  }

  function backupInspectionCode(backup) {
    if (backup === null || !hasExactKeys(backup, BACKUP_KEYS)) return "backup-shape-invalid";
    if (backup.schemaVersion !== "synthetic-backup-v1") return "backup-schema-unsupported";
    if (!hasExactKeys(backup.payload, BACKUP_PAYLOAD_KEYS)) return "payload-shape-invalid";
    if (backup.payload.schemaVersion !== "synthetic-baseline-v1") return "payload-schema-unsupported";
    if (!Array.isArray(backup.payload.candidateNamespaces)
      || !Array.isArray(backup.payload.existingNamespaces)
      || !Array.isArray(backup.payload.encryptedRecords)
      || !Array.isArray(backup.payload.relationships)
      || !backup.payload.candidateNamespaces.every((entry) => (
        hasExactKeys(entry, ["namespaceClass", "token"])
          && NAMESPACE_CLASSES.includes(entry.namespaceClass)
          && /^[a-z][a-z0-9-]{7,63}$/.test(entry.token)
      ))
      || !backup.payload.existingNamespaces.every((entry) => (
        hasExactKeys(entry, ["namespaceClass", "token"])
          && NAMESPACE_CLASSES.includes(entry.namespaceClass)
          && /^[a-z][a-z0-9-]{7,63}$/.test(entry.token)
      ))
      || !backup.payload.encryptedRecords.every((record) => (
        hasExactKeys(record, ["envelope", "opaqueId"])
          && /^record-[0-9]{2}$/.test(record.opaqueId)
          && hasExactKeys(record.envelope, ["algorithm", "authTag", "ciphertext", "nonce", "version"])
          && record.envelope.algorithm === CIPHER_ALGORITHM
          && record.envelope.version === CIPHER_VERSION
          && /^[0-9a-f]{24}$/.test(record.envelope.nonce)
          && /^[0-9a-f]{32}$/.test(record.envelope.authTag)
          && /^(?:[0-9a-f]{2})+$/.test(record.envelope.ciphertext)
      ))
      || !backup.payload.relationships.every((relationship) => (
        hasExactKeys(relationship, ["opaqueId", "recordCount"])
          && /^relation-[0-9]{2}$/.test(relationship.opaqueId)
          && Number.isSafeInteger(relationship.recordCount)
          && relationship.recordCount >= 0
      ))) return "payload-content-invalid";
    if (!hasExactKeys(backup.manifest, BACKUP_MANIFEST_KEYS)) return "manifest-shape-invalid";
    if (digest(backup.payload) !== backup.payloadDigest) return "payload-integrity-failed";
    const expectedManifest = backupManifestForPayload(backup.payload);
    if (canonicalJson(expectedManifest) !== canonicalJson(backup.manifest)
      || digest(backup.manifest) !== backup.manifestDigest) return "manifest-integrity-failed";
    return "accepted";
  }

  function newRestoreDestination() {
    return {
      destinationClass: "distinct-empty-synthetic",
      empty: true,
      state: null,
    };
  }

  function restoreBackup(backup, destination, source) {
    if (backupInspectionCode(backup) !== "accepted"
      || !hasExactKeys(destination, RESTORE_DESTINATION_KEYS)
      || destination.destinationClass !== "distinct-empty-synthetic"
      || destination.empty !== true
      || destination.state !== null
      || destination === source) return null;
    const restoredState = {
      candidateNamespaces: cloneCanonical(backup.payload.candidateNamespaces),
      encryptedRecords: cloneCanonical(backup.payload.encryptedRecords),
      existingNamespaces: cloneCanonical(backup.payload.existingNamespaces),
      relationships: cloneCanonical(backup.payload.relationships),
      schemaVersion: backup.payload.schemaVersion,
    };
    destination.state = restoredState;
    destination.empty = false;
    return destination.state;
  }

  function rollbackCandidateState(candidateOwnedState, baseline, injectFailure) {
    const beforeDigest = digest(candidateOwnedState);
    const replacement = cloneCanonical(baseline);
    for (const key of Object.keys(candidateOwnedState)) delete candidateOwnedState[key];
    for (const [key, value] of Object.entries(replacement)) candidateOwnedState[key] = value;
    if (injectFailure) {
      candidateOwnedState.candidateNamespaces = cloneCanonical(FIXTURE.namespaces.candidate);
    }
    const afterDigest = digest(candidateOwnedState);
    return {
      beforeDigest,
      afterDigest,
      changed: beforeDigest !== afterDigest,
      completed: afterDigest === digest(baseline),
    };
  }

  function exerciseRecoveryFault({ faultId, baseline, source, backup }) {
    let candidateBackup = cloneCanonical(backup);
    const candidateDestination = newRestoreDestination();
    if (faultId === "before-backup-complete") {
      candidateBackup.payloadDigest = `sha256:${"0".repeat(64)}`;
    }
    if (faultId === "during-restore") {
      candidateDestination.empty = false;
      candidateDestination.state = cloneCanonical(baseline);
    }
    let candidateRestore = restoreBackup(candidateBackup, candidateDestination, source);
    if (faultId === "during-comparison" && candidateRestore !== null) {
      candidateRestore.relationships = candidateRestore.relationships.map((entry, index) => (
        index === 0 ? { ...entry, recordCount: entry.recordCount + 1 } : entry
      ));
    }
    const comparison = restoreComparison(source, candidateRestore, backup.manifest);
    const comparisonCompleted = comparison.pass;
    const candidateOwnedState = cloneCanonical(source);
    const rollback = rollbackCandidateState(
      candidateOwnedState,
      baseline,
      faultId === "during-rollback",
    );
    const rollbackCompleted = rollback.completed;
    const successReceiptCreated = backupInspectionCode(candidateBackup) === "accepted"
      && candidateRestore !== null
      && comparisonCompleted
      && rollbackCompleted;
    return {
      id: faultId,
      expected: "failed",
      actual: successReceiptCreated ? "success" : "failed",
      backupInspection: backupInspectionCode(candidateBackup),
      restoreCompleted: candidateRestore !== null,
      comparisonCompleted,
      failedComparisonClasses: Object.entries(comparison.checks)
        .filter(([, result]) => !result)
        .map(([name]) => name),
      rollbackCompleted,
      rollbackTransitionChangedState: rollback.changed,
      durableState: successReceiptCreated ? "success" : "failed",
      successReceiptCreated,
    };
  }

  function restoreComparison(source, restored, manifest) {
    if (restored === null) {
      return {
        pass: false,
        checks: {
          ciphertextDigestsMatch: false,
          expectedAbsenceRulesMatch: false,
          inventoryMatches: false,
          relationshipCountsMatch: false,
          schemaVersionsMatch: false,
        },
      };
    }
    const restoredCiphertextDigests = restored.encryptedRecords.map((record) => digest(record.envelope));
    const inventoryMatches = canonicalJson(source.candidateNamespaces) === canonicalJson(restored.candidateNamespaces)
      && canonicalJson(source.existingNamespaces) === canonicalJson(restored.existingNamespaces)
      && source.encryptedRecords.length === restored.encryptedRecords.length
      && canonicalJson(source.encryptedRecords) === canonicalJson(restored.encryptedRecords);
    const relationshipCountsMatch = source.relationships.length === restored.relationships.length
      && canonicalJson(source.relationships) === canonicalJson(restored.relationships)
      && manifest.relationshipCount === restored.relationships.length
      && manifest.recordCount === restored.encryptedRecords.length;
    const ciphertextDigestsMatch = canonicalJson(restoredCiphertextDigests) === canonicalJson(manifest.ciphertextDigests);
    const expectedAbsenceRulesMatch = canonicalJson(manifest.expectedAbsentClasses)
      === canonicalJson(["decryption-material", "plaintext", "storage-locator"]);
    const schemaVersionsMatch = source.schemaVersion === restored.schemaVersion
      && manifest.stateSchemaVersion === restored.schemaVersion
      && manifest.schemaVersions.length === 1
      && manifest.schemaVersions[0] === CIPHER_VERSION;
    const manifestInventoryMatches = manifest.candidateNamespaceCount === source.candidateNamespaces.length
      && manifest.existingNamespaceCount === source.existingNamespaces.length
      && manifest.namespaceInventoryDigest === digest({
        candidateNamespaces: restored.candidateNamespaces,
        existingNamespaces: restored.existingNamespaces,
      });
    const checks = {
      ciphertextDigestsMatch,
      expectedAbsenceRulesMatch,
      inventoryMatches: inventoryMatches && manifestInventoryMatches,
      relationshipCountsMatch,
      schemaVersionsMatch,
    };
    return { pass: Object.values(checks).every(Boolean), checks };
  }

  function buildRecoveryResult(encryptedState) {
    invariant(encryptedState !== null && typeof encryptedState === "object");
    const baseline = buildBaselineState();
    const baselineDigest = digest(baseline);
    const source = {
      schemaVersion: "synthetic-baseline-v1",
      existingNamespaces: cloneCanonical(FIXTURE.namespaces.existing),
      candidateNamespaces: cloneCanonical(FIXTURE.namespaces.candidate),
      encryptedRecords: cloneCanonical(encryptedState.records),
      relationships: cloneCanonical(encryptedState.relationships),
    };
    const sourceDigest = digest(source);
    const backup = backupFromState(source);
    const backupDigest = digest(backup);
    const destination = newRestoreDestination();
    const destinationInitiallyEmpty = destination.empty && destination.state === null;
    const restored = restoreBackup(backup, destination, source);
    const destinationTransitioned = destination.empty === false
      && destination.state === restored
      && restored !== source;
    const restoredDigest = restored === null ? null : digest(restored);
    const comparison = restoreComparison(source, restored, backup.manifest);
    const comparisonPass = comparison.pass;
    const comparisonDigest = digest(comparison.checks);
    const candidateOwnedState = cloneCanonical(source);
    const rollback = rollbackCandidateState(candidateOwnedState, baseline, false);
    const rollbackDigest = digest(candidateOwnedState);
    const corruptedBackup = { ...cloneCanonical(backup), payloadDigest: `sha256:${"0".repeat(64)}` };
    const incompatiblePayload = { ...cloneCanonical(backup.payload), schemaVersion: "synthetic-baseline-unknown" };
    const incompatibleBackup = {
      ...cloneCanonical(backup),
      payload: incompatiblePayload,
      payloadDigest: digest(incompatiblePayload),
    };
    const restoreFailureCase = (id, expectedCode, candidateBackup, candidateDestination, candidateSource) => {
      const inspectionCode = backupInspectionCode(candidateBackup);
      const candidateRestored = restoreBackup(candidateBackup, candidateDestination, candidateSource);
      const actualCode = inspectionCode !== "accepted"
        ? inspectionCode
        : candidateRestored === null ? "destination-rejected" : "accepted";
      return { id, expectedCode, actualCode, rejected: candidateRestored === null };
    };
    const nonEmptyDestination = newRestoreDestination();
    nonEmptyDestination.empty = false;
    nonEmptyDestination.state = cloneCanonical(baseline);
    const aliasingDestination = newRestoreDestination();
    aliasingDestination.state = source;
    const restoreFailures = [
      restoreFailureCase("missing-backup", "backup-shape-invalid", null, newRestoreDestination(), source),
      restoreFailureCase("corrupt-backup", "payload-integrity-failed", corruptedBackup, newRestoreDestination(), source),
      restoreFailureCase("unknown-backup-version", "backup-schema-unsupported", { ...backup, schemaVersion: "synthetic-backup-unknown" }, newRestoreDestination(), source),
      restoreFailureCase("incompatible-payload-version", "payload-schema-unsupported", incompatibleBackup, newRestoreDestination(), source),
      restoreFailureCase("non-empty-destination", "destination-rejected", backup, nonEmptyDestination, source),
      restoreFailureCase("source-alias", "destination-rejected", backup, source, source),
      restoreFailureCase("unproven-separation", "destination-rejected", backup, aliasingDestination, source),
    ];
    const interruptionStates = ["before-backup-complete", "during-restore", "during-comparison", "during-rollback"]
      .map((faultId) => exerciseRecoveryFault({ faultId, baseline, source, backup }));
    const aliasProbeDestination = newRestoreDestination();
    const aliasProbe = restoreBackup(backup, aliasProbeDestination, source);
    const aliasProbeSourceDigestBefore = digest(source);
    const aliasProbeBackupDigestBefore = digest(backup);
    if (aliasProbe !== null) aliasProbe.candidateNamespaces[0].token = "probe-data-01";
    const aliasIsolationVerified = aliasProbe !== null
      && aliasProbe.candidateNamespaces !== source.candidateNamespaces
      && aliasProbe.encryptedRecords !== source.encryptedRecords
      && aliasProbe.existingNamespaces !== source.existingNamespaces
      && aliasProbe.relationships !== source.relationships
      && digest(source) === aliasProbeSourceDigestBefore
      && digest(backup) === aliasProbeBackupDigestBefore;
    const retainedRecoveryBytes = [backup, restored].map((value) => Buffer.from(canonicalJson(value), "utf8"));
    const forbiddenRecoveryValues = [
      ...FIXTURE.fictionalRecords.map((record) => Buffer.from(record.value, "utf8")),
      Buffer.from(FIXTURE.syntheticKeySeed, "utf8"),
      SYNTHETIC_KEY,
      WRONG_SYNTHETIC_KEY,
    ];
    const retainedRecoveryFindingCount = retainedRecoveryBytes.reduce((count, bytes) => (
      count + forbiddenRecoveryValues.filter((value) => bytes.includes(value)).length
    ), 0);
    const rollbackPreservedSource = digest(source) === sourceDigest;
    const rollbackPreservedBackup = digest(backup) === backupDigest;
    const postRollbackCapacity = capacityDecision(FIXTURE.capacity, FIXTURE.namespaces.candidate, FIXTURE.namespaces.existing);
    const fictionalCustodyLocationCount = new Set(FIXTURE.recovery.custodyLocations).size;
    const disposableTestMaterialOnly = FIXTURE.recovery.materialClass === "disposable-synthetic-test-material";
    const migrationRequired = source.schemaVersion !== "synthetic-baseline-v1";
    const forwardFixDecision = rollbackDigest === baselineDigest
      ? "not-required-after-verified-rollback"
      : "required-after-rollback-failure";
    const pass = comparisonPass
      && rollbackDigest === baselineDigest
      && rollback.beforeDigest === sourceDigest
      && rollback.changed
      && rollback.completed
      && destinationInitiallyEmpty
      && destinationTransitioned
      && aliasIsolationVerified
      && rollbackPreservedSource
      && rollbackPreservedBackup
      && restoreFailures.every((entry) => entry.rejected && entry.actualCode === entry.expectedCode)
      && interruptionStates.every((entry) => (
        entry.actual === entry.expected && entry.durableState === "failed" && !entry.successReceiptCreated
      ))
      && retainedRecoveryFindingCount === 0
      && postRollbackCapacity.admitted
      && fictionalCustodyLocationCount === 2
      && disposableTestMaterialOnly;
    return {
      pass,
      baselineDigest,
      sourceDigest,
      backupDigest,
      backupManifestDigest: backup.manifestDigest,
      restoredDigest,
      comparisonDigest,
      comparisonChecks: comparison.checks,
      rollbackDigest,
      destinationClass: destination.destinationClass,
      destinationInitiallyEmpty,
      destinationTransitioned,
      destinationDistinctFromSource: destination.state !== source,
      restoredStateAliasIsolationVerified: aliasIsolationVerified,
      backupCreated: backup !== null,
      packageIntegrityVerified: backupInspectionCode(backup) === "accepted",
      restoreCompleted: restored !== null,
      comparisonCompleted: comparisonPass,
      rollbackCompleted: rollback.completed,
      rollbackTransitionChangedState: rollback.changed,
      sourcePreservedAfterRollback: rollbackPreservedSource,
      backupPreservedAfterRollback: rollbackPreservedBackup,
      invariantChecksRepeated: postRollbackCapacity.admitted,
      forwardFixDecision,
      migrationRequired,
      fictionalCustodyLocationCount,
      disposableTestMaterialOnly,
      ownerRecoveryCeremonyClaimed: false,
      retainedRecoveryFindingCount,
      restoreFailures,
      interruptionStates,
    };
  }

  const DURABLE_HEALTH_VALUES = Object.freeze(["unknown", "never run", "success", "delayed", "failed", "blocked"]);

  function durableHealth(input) {
    if (input.prerequisiteBlocked) return "blocked";
    if (!input.evidenceTrusted) return "unknown";
    if (!input.attempted) return "never run";
    if (input.completed && input.succeeded) return "success";
    if (input.completed) return "failed";
    if (input.overdue) return "delayed";
    return "unknown";
  }

  function reconstructHealthFromDurableEvents(events) {
    if (!Array.isArray(events)) return { accepted: false, health: "unknown" };
    const state = {
      evidenceTrusted: true,
      attempted: false,
      completed: false,
      succeeded: false,
      overdue: false,
      prerequisiteBlocked: false,
    };
    for (const event of events) {
      if (!hasExactKeys(event, ["eventClass"])) return { accepted: false, health: "unknown" };
      if (event.eventClass === "enqueued") continue;
      if (["started", "attempted", "upload-completed", "backup-created"].includes(event.eventClass)) {
        state.attempted = true;
        continue;
      }
      if (event.eventClass === "deadline-reached") {
        state.attempted = true;
        state.overdue = true;
        continue;
      }
      if (event.eventClass === "completed-success") {
        state.attempted = true;
        state.completed = true;
        state.succeeded = true;
        continue;
      }
      if (event.eventClass === "completed-failure") {
        state.attempted = true;
        state.completed = true;
        state.succeeded = false;
        continue;
      }
      if (event.eventClass === "prerequisite-blocked") {
        state.prerequisiteBlocked = true;
        continue;
      }
      return { accepted: false, health: "unknown" };
    }
    return { accepted: true, health: durableHealth(state) };
  }

  function buildHealthResult(recovery) {
    invariant(recovery !== null && typeof recovery === "object");
    const classifications = [
      { id: "missing-evidence", input: { evidenceTrusted: false }, expected: "unknown" },
      { id: "not-attempted", input: { evidenceTrusted: true, attempted: false }, expected: "never run" },
      { id: "completed-success", input: { evidenceTrusted: true, attempted: true, completed: true, succeeded: true }, expected: "success" },
      { id: "overdue-incomplete", input: { evidenceTrusted: true, attempted: true, completed: false, overdue: true }, expected: "delayed" },
      { id: "completed-failure", input: { evidenceTrusted: true, attempted: true, completed: true, succeeded: false }, expected: "failed" },
      { id: "known-prerequisite", input: { prerequisiteBlocked: true }, expected: "blocked" },
    ].map(({ id, input, expected }) => ({ id, expected, actual: durableHealth(input) }));
    const incompleteEventVectors = ["enqueued", "started", "attempted", "upload-completed", "backup-created"]
      .map((eventClass) => {
        const reconstruction = reconstructHealthFromDurableEvents([{ eventClass }]);
        return {
          eventClass,
          expectedSuccess: false,
          actualHealth: reconstruction.health,
          accepted: reconstruction.accepted,
          producedSuccess: reconstruction.health === "success",
        };
      });
    const startOnly = incompleteEventVectors.find((entry) => entry.eventClass === "started").actualHealth;
    const durableSuccessEvents = [{ eventClass: "started" }, { eventClass: "completed-success" }];
    const optimisticInMemoryOnly = reconstructHealthFromDurableEvents([{ eventClass: "started" }]);
    const reconstructedAfterRestart = reconstructHealthFromDurableEvents(durableSuccessEvents).health;
    const unknownEventRejected = reconstructHealthFromDurableEvents([{ eventClass: "unknown" }]);
    const presentationLabels = DURABLE_HEALTH_VALUES.map((value) => ({
      value,
      label: value === "success" ? "Healthy" : value,
    }));
    const backupHealth = durableHealth({
      evidenceTrusted: recovery.packageIntegrityVerified,
      attempted: recovery.backupCreated,
      completed: recovery.packageIntegrityVerified,
      succeeded: recovery.packageIntegrityVerified,
    });
    const restoreVerificationHealth = durableHealth({
      evidenceTrusted: recovery.packageIntegrityVerified,
      attempted: recovery.restoreCompleted,
      completed: recovery.comparisonCompleted,
      succeeded: recovery.comparisonCompleted,
    });
    const overallHealth = durableHealth({
      evidenceTrusted: recovery.pass,
      attempted: true,
      completed: recovery.pass,
      succeeded: recovery.pass,
    });
    const pass = classifications.every((entry) => entry.actual === entry.expected)
      && new Set(classifications.map((entry) => entry.actual)).size === DURABLE_HEALTH_VALUES.length
      && incompleteEventVectors.every((entry) => entry.accepted && !entry.producedSuccess)
      && optimisticInMemoryOnly.health !== "success"
      && reconstructedAfterRestart === "success"
      && !unknownEventRejected.accepted
      && unknownEventRejected.health === "unknown"
      && presentationLabels.filter((entry) => entry.label === "Healthy").length === 1
      && backupHealth === "success"
      && restoreVerificationHealth === "success"
      && overallHealth === "success";
    return {
      pass,
      durableVocabulary: DURABLE_HEALTH_VALUES,
      classifications,
      incompleteEventVectors,
      startOnlyState: startOnly,
      optimisticInMemoryOnlyState: optimisticInMemoryOnly.health,
      reconstructedAfterRestart,
      unknownEventRejected: !unknownEventRejected.accepted,
      backupHealth,
      restoreVerificationHealth,
      overallHealth,
      presentationLabels,
    };
  }

  const LOG_FIELDS = Object.freeze([
    "errorClass",
    "eventClass",
    "opaqueId",
    "requirementId",
    "scenarioId",
    "stageId",
    "taskId",
    "timestamp",
  ]);
  const LOG_EVENT_CLASSES = Object.freeze(["check-completed", "check-denied", "recovery-completed"]);
  const LOG_ERROR_CLASSES = Object.freeze(["none", "authorization-denied", "synthetic-validation"]);
  const FORBIDDEN_LOG_FIELDS = Object.freeze([
    "accountId",
    "assertion",
    "body",
    "caption",
    "ciphertext",
    "credential",
    "filename",
    "hostname",
    "journalText",
    "keyMaterial",
    "message",
    "prompt",
    "providerResponse",
    "recoveryMaterial",
    "route",
    "signedLocator",
    "stack",
    "targetId",
  ]);
  const FORBIDDEN_SENTINELS = Object.freeze([
    "fictional-journal-sentinel",
    "fictional-caption-sentinel",
    "fictional-recovery-material-sentinel",
    "fictional-storage-locator-sentinel",
  ]);

  function logRecordAccepted(record) {
    return hasExactKeys(record, LOG_FIELDS)
      && Number.isFinite(Date.parse(record.timestamp))
      && /^evt-[0-9]{4}$/.test(record.opaqueId)
      && LOG_EVENT_CLASSES.includes(record.eventClass)
      && LOG_ERROR_CLASSES.includes(record.errorClass)
      && record.taskId === TASK_ID
      && record.stageId === STAGE_ID
      && REQUIREMENT_IDS.includes(record.requirementId)
      && SCENARIO_IDS.includes(record.scenarioId);
  }

  function retainedAt(records, now) {
    const boundaryMs = 30 * 24 * 60 * 60 * 1000;
    const nowMs = Date.parse(now);
    return records.filter((record) => nowMs - Date.parse(record.timestamp) < boundaryMs);
  }

  function rotateLogWriterMaterial(writerState, nextVersion) {
    if (!hasExactKeys(writerState, ["activeMaterialReference", "archiveRecords"])
      || !Number.isSafeInteger(nextVersion)
      || nextVersion < 1) return null;
    const archiveDigestBefore = digest(writerState.archiveRecords);
    const priorMaterialReference = writerState.activeMaterialReference;
    writerState.activeMaterialReference = digest({ materialClass: "synthetic-log-sentinel", version: nextVersion });
    return {
      archiveDigestBefore,
      archiveDigestAfter: digest(writerState.archiveRecords),
      priorMaterialReference,
      activeMaterialReference: writerState.activeMaterialReference,
    };
  }

  function buildLoggingResult() {
    const logs = [
      {
        timestamp: FIXED_CLOCK_START,
        opaqueId: "evt-0001",
        eventClass: "check-completed",
        errorClass: "none",
        taskId: TASK_ID,
        stageId: STAGE_ID,
        requirementId: "LID-OPS-016",
        scenarioId: "SPK-R0-001-QA-003",
      },
    ];
    const bytes = Buffer.from(canonicalJson(logs), "utf8");
    const beforeBoundary = retainedAt(logs, "2030-01-30T23:59:59.999Z");
    const atBoundary = retainedAt(logs, "2030-01-31T00:00:00.000Z");
    const forbiddenFindings = FORBIDDEN_SENTINELS.filter((sentinel) => bytes.includes(Buffer.from(sentinel, "utf8")));
    const forbiddenFieldVectors = FORBIDDEN_LOG_FIELDS.map((field) => ({
      field,
      rejected: !logRecordAccepted({ ...logs[0], [field]: "synthetic-forbidden-field-value" }),
    }));
    const extraFieldRejected = forbiddenFieldVectors.every((entry) => entry.rejected);
    const writerState = {
      activeMaterialReference: digest({ materialClass: "synthetic-log-sentinel", version: 1 }),
      archiveRecords: cloneCanonical(logs),
    };
    const writerStateDigestBeforeRotation = digest(writerState);
    const futureWriteBindingBefore = digest({
      eventClass: "future-check",
      materialReference: writerState.activeMaterialReference,
    });
    const rotation = rotateLogWriterMaterial(writerState, 2);
    const futureWriteBindingAfter = digest({
      eventClass: "future-check",
      materialReference: writerState.activeMaterialReference,
    });
    const writerStateDigestAfterRotation = digest(writerState);
    const rotationChangedOnlyFutureMaterial = rotation !== null
      && writerStateDigestBeforeRotation !== writerStateDigestAfterRotation
      && rotation.priorMaterialReference !== rotation.activeMaterialReference
      && rotation.archiveDigestBefore === rotation.archiveDigestAfter
      && futureWriteBindingBefore !== futureWriteBindingAfter;
    const pass = logs.every(logRecordAccepted)
      && forbiddenFindings.length === 0
      && extraFieldRejected
      && beforeBoundary.length === 1
      && atBoundary.length === 0
      && rotationChangedOnlyFutureMaterial;
    return {
      pass,
      allowedFields: LOG_FIELDS,
      eventClasses: LOG_EVENT_CLASSES,
      errorClasses: LOG_ERROR_CLASSES,
      forbiddenFieldVectors,
      recordCount: logs.length,
      logDigest: digest(logs),
      forbiddenSentinelFindingCount: forbiddenFindings.length,
      inspectedArtifactClasses: ["local-log"],
      inspectedArtifactFindingCount: forbiddenFindings.length,
      candidateQaScanStillRequiredFor: [
        "module-source",
        "dependency-closure",
        "child-result",
        "backup-representation",
        "restored-state",
        "governed-evidence",
      ],
      unknownFieldRejected: extraFieldRejected,
      retainedImmediatelyBeforeThirtyDays: beforeBoundary.length,
      retainedAtThirtyDayBoundary: atBoundary.length,
      analyticsSinkUsed: false,
      externalSinkUsed: false,
      rotationPolicy: "new-synthetic-material-only",
      rotationChangedOnlyFutureMaterial,
      archiveDigestBeforeRotation: rotation.archiveDigestBefore,
      archiveDigestAfterRotation: rotation.archiveDigestAfter,
      writerStateDigestBeforeRotation,
      writerStateDigestAfterRotation,
      futureWriteBindingChanged: futureWriteBindingBefore !== futureWriteBindingAfter,
    };
  }

  function newReplayState() {
    return { durableRecords: {}, effectCount: 0, terminalFailures: {} };
  }

  function requestDigest(request) {
    return digest({ operation: request.operation, payloadClass: request.payloadClass });
  }

  function applySyntheticRequest(state, request, interruption = "none") {
    const exactShape = hasExactKeys(request, ["idempotencyKey", "operation", "payloadClass"]);
    const durableFailureEligible = exactShape
      && /^synthetic-idempotency-[0-9]{4}$/.test(request.idempotencyKey);
    const requestAccepted = durableFailureEligible
      && request.operation === "install-fictional-namespace"
      && request.payloadClass === "synthetic-foundation";
    if (!requestAccepted) {
      let failureIdentity = null;
      if (durableFailureEligible) {
        const failedRequestDigest = digest(request);
        const existingSuccess = state.durableRecords[request.idempotencyKey];
        if (existingSuccess !== undefined) {
          return {
            state: "failed",
            effectCount: state.effectCount,
            receiptIdentity: null,
            failureIdentity: digest({
              acceptedRequestDigest: existingSuccess.requestDigest,
              failedRequestDigest,
              idempotencyKey: request.idempotencyKey,
            }),
          };
        }
        const existingFailure = state.terminalFailures[request.idempotencyKey];
        failureIdentity = existingFailure?.failureIdentity
          ?? digest({ failedRequestDigest, idempotencyKey: request.idempotencyKey });
        if (existingFailure === undefined) {
          state.terminalFailures[request.idempotencyKey] = { failedRequestDigest, failureIdentity };
        }
      }
      return {
        state: "failed",
        effectCount: state.effectCount,
        receiptIdentity: null,
        failureIdentity,
      };
    }
    const nextRequestDigest = requestDigest(request);
    const terminalFailure = state.terminalFailures[request.idempotencyKey];
    if (terminalFailure !== undefined) {
      return {
        state: "failed",
        effectCount: state.effectCount,
        receiptIdentity: null,
        failureIdentity: terminalFailure.failureIdentity,
      };
    }
    const existing = state.durableRecords[request.idempotencyKey];
    if (existing) {
      if (existing.requestDigest !== nextRequestDigest) {
        return { state: "failed", effectCount: state.effectCount, receiptIdentity: null };
      }
      return { state: "success", effectCount: state.effectCount, receiptIdentity: existing.receiptIdentity };
    }
    if (interruption === "before-durability") {
      return { state: "delayed", effectCount: state.effectCount, receiptIdentity: null };
    }
    const receiptIdentity = digest({ idempotencyKey: request.idempotencyKey, requestDigest: nextRequestDigest });
    state.durableRecords[request.idempotencyKey] = { receiptIdentity, requestDigest: nextRequestDigest };
    state.effectCount += 1;
    if (interruption === "after-durability-before-acknowledgement") {
      return { state: "delayed", effectCount: state.effectCount, receiptIdentity: null };
    }
    return { state: "success", effectCount: state.effectCount, receiptIdentity };
  }

  function restartReplayState(durableRecords, terminalFailures) {
    const state = newReplayState();
    state.durableRecords = cloneCanonical(durableRecords);
    state.terminalFailures = cloneCanonical(terminalFailures);
    state.effectCount = Object.keys(state.durableRecords).length;
    return state;
  }

  function timedAttemptOutcome(input) {
    if (!hasExactKeys(input, ["attempted", "completed", "deadlineReached", "successReceiptCreated"])) {
      return { durableState: "failed", successReceiptCreated: false };
    }
    if (input.deadlineReached && input.attempted && !input.completed && !input.successReceiptCreated) {
      return { durableState: "delayed", successReceiptCreated: false };
    }
    return {
      durableState: input.completed && input.successReceiptCreated ? "success" : "failed",
      successReceiptCreated: input.completed && input.successReceiptCreated,
    };
  }

  function dependencyOutcome(input) {
    if (!hasExactKeys(input, ["available", "evidenceTrusted", "stale"])) return "failed";
    if (input.stale) return "blocked";
    if (!input.evidenceTrusted) return "unknown";
    return input.available ? "success" : "failed";
  }

  function newLocalShellState(baseline, durableRecords) {
    return {
      acceptedBaselineState: cloneCanonical(baseline),
      accessPolicyClass: "one-fictional-human",
      dependencyStates: { "PC-001": "success" },
      durableRecords: cloneCanonical(durableRecords),
      localShellAvailable: true,
    };
  }

  function localShellAccessDecision(shellState, authorization) {
    if (!hasExactKeys(shellState, [
      "acceptedBaselineState",
      "accessPolicyClass",
      "dependencyStates",
      "durableRecords",
      "localShellAvailable",
    ])
      || shellState.accessPolicyClass !== "one-fictional-human"
      || shellState.localShellAvailable !== true) return "deny";
    return humanAccessDecision(authorization);
  }

  function applyDependencyFailure(shellState, dependencyId) {
    if (!hasExactKeys(shellState, [
      "acceptedBaselineState",
      "accessPolicyClass",
      "dependencyStates",
      "durableRecords",
      "localShellAvailable",
    ])
      || dependencyId !== "PC-001"
      || shellState.dependencyStates[dependencyId] !== "success") return false;
    shellState.dependencyStates[dependencyId] = "failed";
    return true;
  }

  function buildReplayResult() {
    const request = {
      idempotencyKey: "synthetic-idempotency-0001",
      operation: "install-fictional-namespace",
      payloadClass: "synthetic-foundation",
    };
    const firstState = newReplayState();
    const first = applySyntheticRequest(firstState, request);
    const replay = applySyntheticRequest(firstState, request);
    const firstStateBeforeConflict = digest(firstState);
    const conflict = applySyntheticRequest(firstState, { ...request, payloadClass: "conflicting-synthetic" });
    const conflictStatePreserved = digest(firstState) === firstStateBeforeConflict;
    const beforeState = newReplayState();
    const before = applySyntheticRequest(beforeState, request, "before-durability");
    const beforeRetry = applySyntheticRequest(beforeState, request);
    const afterState = newReplayState();
    const after = applySyntheticRequest(afterState, request, "after-durability-before-acknowledgement");
    const afterRetry = applySyntheticRequest(afterState, request);
    const restartedState = restartReplayState(afterState.durableRecords, afterState.terminalFailures);
    const restartRetry = applySyntheticRequest(restartedState, request);
    const outOfOrderRequest = {
      idempotencyKey: "synthetic-idempotency-0002",
      operation: "finalize-before-install",
      payloadClass: "synthetic-foundation",
    };
    const outOfOrderState = newReplayState();
    const outOfOrder = applySyntheticRequest(outOfOrderState, outOfOrderRequest);
    const restartedOutOfOrderState = restartReplayState(
      outOfOrderState.durableRecords,
      outOfOrderState.terminalFailures,
    );
    const outOfOrderAfterRestart = applySyntheticRequest(restartedOutOfOrderState, outOfOrderRequest);
    const requestMutationVectors = [
      { id: "missing-idempotency-key", request: { operation: request.operation, payloadClass: request.payloadClass } },
      { id: "extra-field", request: { ...request, extra: "rejected" } },
      { id: "malformed-idempotency-key", request: { ...request, idempotencyKey: "malformed" } },
      { id: "wrong-operation", request: { ...request, idempotencyKey: "synthetic-idempotency-0004", operation: "unknown" } },
      { id: "wrong-payload-class", request: { ...request, idempotencyKey: "synthetic-idempotency-0005", payloadClass: "unknown" } },
    ].map((vector) => {
      const state = newReplayState();
      const result = applySyntheticRequest(state, vector.request);
      return {
        id: vector.id,
        expected: "failed",
        actual: result.state,
        effectCount: result.effectCount,
        successReceiptCreated: result.receiptIdentity !== null,
      };
    });
    const timeout = timedAttemptOutcome({
      attempted: true,
      completed: false,
      deadlineReached: true,
      successReceiptCreated: false,
    });
    const staleDependencyState = dependencyOutcome({ available: true, evidenceTrusted: true, stale: true });
    const deniedDependencyAssertion = {
      assertion: "dependency-failure-assertion",
      expiresAt: FIXTURE.human.expiresAt,
      hostClass: "fictional-human-origin",
      method: "GET",
      owner: FIXTURE.human.allowlistedOwner,
      routeClass: "human-archive",
    };
    const dependencyFailureState = dependencyOutcome({ available: false, evidenceTrusted: true, stale: false });
    const dependencyRequestState = newReplayState();
    const dependencyRequest = applySyntheticRequest(dependencyRequestState, {
      ...request,
      idempotencyKey: "synthetic-idempotency-0003",
    });
    const localShellState = newLocalShellState(buildBaselineState(), dependencyRequestState.durableRecords);
    const shellStateDigestBeforeFailure = digest(localShellState);
    const acceptedBaselineDigestBefore = digest(localShellState.acceptedBaselineState);
    const durableRequestIdentityBefore = digest(localShellState.durableRecords);
    const accessBeforeDependencyFailure = localShellAccessDecision(
      localShellState,
      deniedDependencyAssertion,
    );
    const dependencyFailureApplied = applyDependencyFailure(localShellState, "PC-001");
    const accessAfterDependencyFailure = localShellAccessDecision(
      localShellState,
      deniedDependencyAssertion,
    );
    const shellStateDigestAfterFailure = digest(localShellState);
    const acceptedBaselineDigestAfter = digest(localShellState.acceptedBaselineState);
    const durableRequestIdentityAfter = digest(localShellState.durableRecords);
    const dependencyStateAfterFailure = localShellState.dependencyStates["PC-001"];
    const dependencyFailure = {
      dependencyId: "PC-001",
      evidenceReference: "github-pr:pull-70",
      gateBBindingRequired: true,
      durableState: dependencyFailureState,
      accessBroadened: accessBeforeDependencyFailure !== "allow" && accessAfterDependencyFailure === "allow",
      localShellAvailableAfterFailure: localShellState.localShellAvailable,
      failureTransitionApplied: dependencyFailureApplied,
      failureTransitionChangedState: shellStateDigestBeforeFailure !== shellStateDigestAfterFailure,
      acceptedBaselineDigestBefore,
      acceptedBaselineDigestAfter,
      requestEstablishedBeforeFailure: dependencyRequest.state === "success",
      durableRequestIdentityBefore,
      durableRequestIdentityAfter,
    };
    const pass = first.state === "success"
      && first.effectCount === 1
      && replay.receiptIdentity === first.receiptIdentity
      && replay.effectCount === 1
      && conflict.state === "failed"
      && conflict.effectCount === 1
      && conflictStatePreserved
      && before.state === "delayed"
      && before.effectCount === 0
      && before.receiptIdentity === null
      && beforeRetry.state === "success"
      && beforeRetry.effectCount === 1
      && after.state === "delayed"
      && after.effectCount === 1
      && afterRetry.receiptIdentity === restartRetry.receiptIdentity
      && afterRetry.effectCount === 1
      && restartRetry.effectCount === 1
      && outOfOrder.state === "failed"
      && outOfOrder.effectCount === 0
      && outOfOrder.failureIdentity !== null
      && outOfOrderAfterRestart.state === "failed"
      && outOfOrderAfterRestart.failureIdentity === outOfOrder.failureIdentity
      && outOfOrderAfterRestart.effectCount === 0
      && requestMutationVectors.every((entry) => (
        entry.actual === entry.expected && entry.effectCount === 0 && !entry.successReceiptCreated
      ))
      && timeout.durableState === "delayed"
      && timeout.successReceiptCreated === false
      && staleDependencyState === "blocked"
      && dependencyFailureState === "failed"
      && dependencyStateAfterFailure === "failed"
      && dependencyFailure.acceptedBaselineDigestBefore === dependencyFailure.acceptedBaselineDigestAfter
      && dependencyFailure.requestEstablishedBeforeFailure
      && dependencyFailure.durableRequestIdentityBefore === dependencyFailure.durableRequestIdentityAfter
      && !dependencyFailure.accessBroadened
      && dependencyFailure.localShellAvailableAfterFailure
      && dependencyFailure.failureTransitionApplied
      && dependencyFailure.failureTransitionChangedState;
    return {
      pass,
      firstEffectCount: first.effectCount,
      exactReplayEffectCount: replay.effectCount,
      exactReplayReceiptStable: replay.receiptIdentity === first.receiptIdentity,
      conflictingDigestRejected: conflict.state === "failed",
      conflictingDigestPreservedState: conflictStatePreserved,
      requestMutationVectors,
      interruptionBeforeDurability: {
        durableState: before.state,
        effectCount: before.effectCount,
        successReceiptCreated: before.receiptIdentity !== null,
        retryEffectCount: beforeRetry.effectCount,
      },
      interruptionAfterDurability: {
        durableState: after.state,
        effectCount: after.effectCount,
        acknowledgementCreated: after.receiptIdentity !== null,
        retryReceiptStable: afterRetry.receiptIdentity === restartRetry.receiptIdentity,
      },
      restartEffectCount: restartRetry.effectCount,
      timeout,
      staleDependencyState,
      outOfOrderRejected: outOfOrder.state === "failed",
      terminalFailurePreservedAcrossRestart: outOfOrderAfterRestart.failureIdentity === outOfOrder.failureIdentity,
      dependencyFailure,
    };
  }

  const PRIVATE_REQUIRED_INPUT_CLASSES = Object.freeze([
    "authentic-content",
    "credential",
    "human-recovery-ceremony",
    "private-target",
    "provider-action",
  ]);

  function privateBoundaryDecision(inputClass) {
    if (!PRIVATE_REQUIRED_INPUT_CLASSES.includes(inputClass)) return null;
    return {
      inputClass,
      conclusion: "blocked — private evidence required",
      privateOrExternalAccessAttempted: false,
    };
  }

  function buildPrivateBoundaryResult() {
    const blockedClasses = PRIVATE_REQUIRED_INPUT_CLASSES.map(privateBoundaryDecision);
    const unknownClassRejected = privateBoundaryDecision("unknown-input-class") === null;
    return {
      pass: blockedClasses.every((entry) => (
        entry.conclusion === "blocked — private evidence required"
          && entry.privateOrExternalAccessAttempted === false
      )) && unknownClassRejected,
      blockedClasses,
      unknownClassRejected,
    };
  }

  function evidenceStatePresentation(state) {
    switch (state) {
      case "normal-proposal":
        return {
          label: "Preparation proposal — execution not allowed",
          terminalResultEstablished: false,
          terminalConclusion: null,
          durableHealth: "never run",
          safeNextAction: "review-or-return-hold",
          requiredEvidenceFields: ["exact-bindings", "proposed-coverage", "live-host-remainder"],
        };
      case "normal-accepted-preparation":
        return {
          label: "Gate A preparation accepted — task-stage execution not allowed",
          terminalResultEstablished: false,
          terminalConclusion: null,
          durableHealth: "never run",
          safeNextAction: "author-and-test-exact-local-synthetic-candidate",
          requiredEvidenceFields: ["pm-history-binding", "accepted-preparation-binding", "live-host-remainder"],
        };
      case "normal-candidate-qa-result":
        return {
          label: "Candidate QA evidence — not a stage receipt",
          terminalResultEstablished: true,
          terminalConclusion: "synthetic foundation passes",
          durableHealth: "success",
          safeNextAction: "submit-for-independent-qa-and-gate-b-review",
          requiredEvidenceFields: [
            "terminal-synthetic-conclusion",
            "requirement-results",
            "scenario-results",
            "determinism-comparison",
            "digests",
            "live-host-remainder",
          ],
        };
      case "normal-governed-stage-result":
        return {
          label: "Gate B stage receipt",
          terminalResultEstablished: true,
          terminalConclusion: "synthetic foundation passes",
          durableHealth: "success",
          safeNextAction: "submit-for-separately-governed-next-decision",
          requiredEvidenceFields: [
            "bound-stage-receipt",
            "terminal-synthetic-conclusion",
            "requirement-results",
            "scenario-results",
            "digests",
            "live-host-remainder",
          ],
        };
      case "empty-never-run":
        return {
          label: "not run",
          terminalResultEstablished: false,
          terminalConclusion: null,
          durableHealth: "never run",
          safeNextAction: "review-missing-preparation-evidence-or-stage-gate",
          requiredEvidenceFields: ["candidate-qa-absence", "stage-receipt-absence", "zero-results", "expected-fixture-version"],
        };
      case "loading-long-running":
        return {
          label: "running",
          terminalResultEstablished: false,
          terminalConclusion: null,
          durableHealth: "unknown",
          safeNextAction: "observe-or-cancel-authorized-attempt",
          requiredEvidenceFields: [
            "lifecycle",
            "phase",
            "bounded-item-count",
            "elapsed-observation",
            "cancellation-consequence",
            "authorization-unchanged",
          ],
        };
      case "validation-error":
        return {
          label: "synthetic foundation fails",
          terminalResultEstablished: false,
          terminalConclusion: "synthetic foundation fails",
          durableHealth: "failed",
          safeNextAction: "correct-fictional-input-and-refresh-binding-review",
          requiredEvidenceFields: ["stable-error-class", "affected-requirement-scenario", "expected-sanitized-actual", "no-partial-success"],
        };
      case "dependency-error":
        return {
          label: "synthetic foundation fails",
          terminalResultEstablished: false,
          terminalConclusion: "synthetic foundation fails",
          durableHealth: "failed",
          safeNextAction: "review-public-dependency-and-refresh-binding-review",
          requiredEvidenceFields: ["stable-error-class", "affected-requirement-scenario", "expected-sanitized-actual", "no-partial-success"],
        };
      case "interruption":
        return {
          label: "interrupted — terminal result not established",
          terminalResultEstablished: false,
          terminalConclusion: null,
          durableHealth: "failed",
          safeNextAction: "start-fresh-separately-authorized-attempt",
          requiredEvidenceFields: ["last-durable-local-phase", "stale-binding-if-any", "prior-accepted-evidence-distinct"],
        };
      case "timeout":
        return {
          label: "interrupted — terminal result not established",
          terminalResultEstablished: false,
          terminalConclusion: null,
          durableHealth: "delayed",
          safeNextAction: "start-fresh-separately-authorized-attempt",
          requiredEvidenceFields: ["last-durable-local-phase", "deadline-observation", "prior-accepted-evidence-distinct"],
        };
      case "stale-result":
        return {
          label: "interrupted — terminal result not established",
          terminalResultEstablished: false,
          terminalConclusion: null,
          durableHealth: "unknown",
          safeNextAction: "review-stale-binding-and-start-fresh-authorized-attempt",
          requiredEvidenceFields: ["last-durable-local-phase", "stale-binding", "prior-accepted-evidence-distinct"],
        };
      case "destructive-synthetic-rehearsal":
        return {
          label: "disposable synthetic target only",
          terminalResultEstablished: false,
          terminalConclusion: null,
          durableHealth: "never run",
          safeNextAction: "review-gate-a-and-exact-disposable-candidate-binding",
          requiredEvidenceFields: [
            "fictional-target-identifier",
            "deletion-replacement-boundary",
            "pre-state-digest",
            "recovery-path-class",
            "consequence",
          ],
        };
      case "blocked-private":
        return {
          label: "blocked — private evidence required",
          terminalResultEstablished: false,
          terminalConclusion: "blocked — private evidence required",
          durableHealth: "blocked",
          safeNextAction: "stop-and-seek-separate-authorized-stage",
          requiredEvidenceFields: ["missing-public-safe-class", "no-private-or-external-access-attempted", "local-results-preserved", "later-authority-category"],
        };
      case "unavailable-not-configured":
        return {
          label: "unavailable — not configured",
          terminalResultEstablished: false,
          terminalConclusion: null,
          durableHealth: "blocked",
          safeNextAction: "repair-fictional-local-dependency-or-stop",
          requiredEvidenceFields: ["local-dependency-class", "private-prerequisite-distinction", "durable-job-evidence-distinction"],
        };
      default:
        return null;
    }
  }

  function buildStatePresentationResult() {
    const expectedCases = [
      { state: "normal-proposal", label: "Preparation proposal — execution not allowed", terminal: false, health: "never run", fieldCount: 3 },
      { state: "normal-accepted-preparation", label: "Gate A preparation accepted — task-stage execution not allowed", terminal: false, health: "never run", fieldCount: 3 },
      { state: "normal-candidate-qa-result", label: "Candidate QA evidence — not a stage receipt", terminal: true, health: "success", fieldCount: 6 },
      { state: "normal-governed-stage-result", label: "Gate B stage receipt", terminal: true, health: "success", fieldCount: 6 },
      { state: "empty-never-run", label: "not run", terminal: false, health: "never run", fieldCount: 4 },
      { state: "loading-long-running", label: "running", terminal: false, health: "unknown", fieldCount: 6 },
      { state: "validation-error", label: "synthetic foundation fails", terminal: false, health: "failed", fieldCount: 4 },
      { state: "dependency-error", label: "synthetic foundation fails", terminal: false, health: "failed", fieldCount: 4 },
      { state: "interruption", label: "interrupted — terminal result not established", terminal: false, health: "failed", fieldCount: 3 },
      { state: "timeout", label: "interrupted — terminal result not established", terminal: false, health: "delayed", fieldCount: 3 },
      { state: "stale-result", label: "interrupted — terminal result not established", terminal: false, health: "unknown", fieldCount: 3 },
      { state: "destructive-synthetic-rehearsal", label: "disposable synthetic target only", terminal: false, health: "never run", fieldCount: 5 },
      { state: "blocked-private", label: "blocked — private evidence required", terminal: false, health: "blocked", fieldCount: 4 },
      { state: "unavailable-not-configured", label: "unavailable — not configured", terminal: false, health: "blocked", fieldCount: 3 },
    ];
    const cases = expectedCases.map((expected) => {
      const actual = evidenceStatePresentation(expected.state);
      return {
        state: expected.state,
        expectedLabel: expected.label,
        actualLabel: actual?.label ?? null,
        expectedTerminal: expected.terminal,
        actualTerminal: actual?.terminalResultEstablished ?? null,
        expectedHealth: expected.health,
        actualHealth: actual?.durableHealth ?? null,
        safeNextAction: actual?.safeNextAction ?? null,
        expectedEvidenceFieldCount: expected.fieldCount,
        actualEvidenceFieldCount: actual?.requiredEvidenceFields?.length ?? null,
        evidenceFieldsUnique: actual === null
          ? false
          : new Set(actual.requiredEvidenceFields).size === actual.requiredEvidenceFields.length,
        terminalConclusion: actual?.terminalConclusion ?? null,
      };
    });
    const unknownStateRejected = evidenceStatePresentation("unknown-state") === null;
    const priorSuccessCannotMaskCurrentFailure = evidenceStatePresentation("validation-error")?.terminalResultEstablished === false
      && evidenceStatePresentation("validation-error")?.durableHealth === "failed";
    const successConclusionRestricted = cases.every((entry) => (
      entry.terminalConclusion !== "synthetic foundation passes"
        || (entry.actualTerminal === true && entry.actualHealth === "success")
    ));
    const pass = cases.every((entry) => (
      entry.actualLabel === entry.expectedLabel
        && entry.actualTerminal === entry.expectedTerminal
        && entry.actualHealth === entry.expectedHealth
        && entry.actualEvidenceFieldCount === entry.expectedEvidenceFieldCount
        && entry.evidenceFieldsUnique
        && typeof entry.safeNextAction === "string"
        && entry.safeNextAction.length > 0
    )) && unknownStateRejected && priorSuccessCannotMaskCurrentFailure && successConclusionRestricted;
    return {
      pass,
      cases,
      unknownStateRejected,
      priorSuccessCannotMaskCurrentFailure,
      successConclusionRestricted,
    };
  }

  function buildAccessibilityResult() {
    const surface = {
      surfaceKind: "canonical-json-only",
      rendered: false,
      interactive: false,
      taskId: TASK_ID,
      stageId: STAGE_ID,
      scenarioIds: SCENARIO_IDS,
    };
    const boundedNoSurface = surface.surfaceKind === "canonical-json-only"
      && surface.rendered === false
      && surface.interactive === false
      && surface.taskId === TASK_ID
      && surface.stageId === STAGE_ID
      && canonicalJson(surface.scenarioIds) === canonicalJson(SCENARIO_IDS);
    return {
      pass: boundedNoSurface,
      renderedSurfacePresent: surface.rendered,
      boundedResult: "no-rendered-surface",
      machineSurfaceDigest: digest(surface),
      fullIdentifiersAvailable: surface.taskId.length > 0 && surface.stageId.length > 0,
      interactiveAccessibilityClaimed: false,
      browserMatrixClaimed: false,
      r0ProductUiCoverageClaimed: false,
      candidateQaStaticSurfaceReviewRequired: true,
      limitation: "This serializable module has no rendered or interactive product surface; product UI accessibility remains untested.",
    };
  }

  function componentResult(name, value) {
    return { name, result: value.pass === true ? "pass" : "fail", evidenceDigest: digest(value) };
  }

  const REQUIREMENT_COMPONENTS = Object.freeze({
    "LID-SCP-001": ["access", "privateBoundary"],
    "LID-OPS-001": ["access", "replay"],
    "LID-OPS-002": ["access", "replay"],
    "LID-OPS-003": ["logging", "privateBoundary"],
    "LID-OPS-004": ["encryption", "recovery"],
    "LID-OPS-008": ["access", "logging"],
    "LID-OPS-011": ["recovery"],
    "LID-OPS-012": ["encryption", "recovery", "privateBoundary"],
    "LID-OPS-014": ["health", "replay"],
    "LID-OPS-016": ["logging", "privateBoundary"],
    "LID-OPS-018": ["capacity", "recovery", "replay"],
  });

  const SCENARIO_COMPONENTS = Object.freeze({
    "SPK-R0-001-P-001": ["access", "capacity", "encryption", "health", "recovery", "replay"],
    "SPK-R0-001-P-002": ["privateBoundary", "requirements"],
    "SPK-R0-001-P-003": ["logging", "requirements"],
    "SPK-R0-001-T-001": ["access", "encryption", "replay"],
    "SPK-R0-001-T-002": ["encryption", "recovery"],
    "SPK-R0-001-T-003": ["access", "capacity", "logging", "privateBoundary", "replay"],
    "SPK-R0-001-D-001": ["health", "statePresentation"],
    "SPK-R0-001-D-002": ["accessibility"],
    "SPK-R0-001-D-003": ["logging", "privateBoundary", "recovery", "statePresentation"],
    "SPK-R0-001-QA-001": ["access", "capacity", "encryption", "health", "recovery", "replay"],
    "SPK-R0-001-QA-002": ["access", "capacity", "encryption", "recovery", "replay"],
    "SPK-R0-001-QA-003": ["access", "encryption", "logging", "privateBoundary"],
    "SPK-R0-001-QA-004": ["encryption", "recovery"],
    "SPK-R0-001-QA-005": ["accessibility"],
    "SPK-R0-001-QA-006": ["capacity", "health", "replay"],
  });

  const GOVERNED_EVIDENCE_KEYS = Object.freeze([
    "schemaVersion",
    "evidenceKind",
    "taskId",
    "stageId",
    "scopeClass",
    "actionClass",
    "idempotencyKey",
    "sourceRevision",
    "stageBindingDigest",
    "fixture",
    "requirementResults",
    "scenarioResults",
    "contractResults",
    "stateDigests",
    "durableHealth",
    "safety",
    "conclusion",
    "limitations",
    "permittedClaim",
  ]);
  const GOVERNED_FIXTURE_KEYS = Object.freeze([
    "fixtureId",
    "schemaVersion",
    "seedId",
    "fixtureSha256",
    "fixtureClass",
    "authenticContentExcluded",
  ]);
  const GOVERNED_ITEM_RESULT_KEYS = Object.freeze(["requirementId", "result", "observationDigest"]);
  const GOVERNED_SCENARIO_RESULT_KEYS = Object.freeze(["scenarioId", "result", "observationDigest"]);
  const GOVERNED_CONTRACT_RESULT_KEYS = Object.freeze(["contractId", "result", "observationDigest"]);
  const GOVERNED_STATE_DIGEST_KEYS = Object.freeze([
    "beforeSha256",
    "afterSha256",
    "backupSha256",
    "restoreSha256",
    "comparisonSha256",
    "rollbackSha256",
  ]);
  const GOVERNED_DURABLE_HEALTH_KEYS = Object.freeze(["backup", "restoreVerification", "overall"]);
  const GOVERNED_SAFETY_KEYS = Object.freeze([
    "local",
    "public",
    "fictional",
    "synthetic",
    "authenticMediaAccessed",
    "privateNetworkAccessed",
    "externalMutationPerformed",
    "aiContentPathUsed",
    "forbiddenContentFindings",
  ]);
  const CHILD_RESULT_KEYS = Object.freeze([
    "schemaVersion",
    "outcome",
    "taskId",
    "stageId",
    "idempotencyKey",
    "sourceRevision",
    "stageBindingDigest",
    "evidenceDigest",
  ]);

  const CONTRACT_MODEL_COMPONENTS = Object.freeze({
    "surface-isolation": ["access"],
    "capacity-and-collision": ["capacity"],
    "authenticated-encryption": ["encryption"],
    "backup-restore-rollback": ["recovery"],
    "durable-health": ["health"],
    "sanitized-logging": ["logging"],
    "replay-interruption-crash": ["replay"],
    "receipt-boundary": ["accessibility", "privateBoundary", "statePresentation"],
  });

  function buildOracleModel(encryptedState, nonceScheduleEvidence) {
    invariant(encryptedState !== null && typeof encryptedState === "object");
    const recovery = buildRecoveryResult(encryptedState);
    const health = buildHealthResult(recovery);
    const model = {
      access: buildAccessResult(),
      accessibility: buildAccessibilityResult(),
      capacity: buildCapacityResult(),
      encryption: buildEncryptionResult(encryptedState, nonceScheduleEvidence),
      health,
      logging: buildLoggingResult(),
      privateBoundary: buildPrivateBoundaryResult(),
      recovery,
      replay: buildReplayResult(),
      statePresentation: buildStatePresentationResult(),
    };
    for (const value of Object.values(model)) invariant(value.pass === true);
    return model;
  }

  const FROZEN_ENCRYPTED_FIXTURE_RUN = deepFreeze(buildEncryptedFixtureRun());
  const FROZEN_ENCRYPTED_STATE = FROZEN_ENCRYPTED_FIXTURE_RUN.state;
  const FROZEN_ORACLE_MODEL = deepFreeze(buildOracleModel(
    FROZEN_ENCRYPTED_STATE,
    FROZEN_ENCRYPTED_FIXTURE_RUN.nonceScheduleEvidence,
  ));

  const COMPUTED_COMPONENT_OBSERVATION_DIGESTS = Object.fromEntries(
    Object.entries(FROZEN_ORACLE_MODEL).map(([name, value]) => [name, digest(value)]),
  );
  const FROZEN_COMPONENT_OBSERVATION_DIGESTS = deepFreeze({
    ...COMPUTED_COMPONENT_OBSERVATION_DIGESTS,
  });
  const FROZEN_STATE_DIGESTS = deepFreeze({
    beforeSha256: FROZEN_ORACLE_MODEL.recovery.baselineDigest,
    afterSha256: FROZEN_ORACLE_MODEL.recovery.sourceDigest,
    backupSha256: FROZEN_ORACLE_MODEL.recovery.backupDigest,
    restoreSha256: FROZEN_ORACLE_MODEL.recovery.restoredDigest,
    comparisonSha256: FROZEN_ORACLE_MODEL.recovery.comparisonDigest,
    rollbackSha256: FROZEN_ORACLE_MODEL.recovery.rollbackDigest,
  });
  const SYNTHETIC_FOUNDATION_FIXTURE_DIGEST = digest(FIXTURE);
  const CANONICAL_EVIDENCE_VECTOR_SOURCE_REVISION = SPK_ZERO_REVISION;
  const CANONICAL_GOVERNED_EVIDENCE_VECTOR_BYTE_LENGTH = SPK_ZERO_REVISION_EVIDENCE_BYTE_LENGTH;
  const CANONICAL_GOVERNED_EVIDENCE_VECTOR_SHA256 = SPK_ZERO_REVISION_EVIDENCE_SHA256;
  const CANONICAL_CHILD_RESULT_VECTOR = deepFreeze({
    schemaVersion: SCHEMA_VERSION,
    outcome: "succeeded",
    taskId: TASK_ID,
    stageId: STAGE_ID,
    idempotencyKey: IDEMPOTENCY_KEY,
    sourceRevision: CANONICAL_EVIDENCE_VECTOR_SOURCE_REVISION,
    stageBindingDigest: STAGE_BINDING_DIGEST,
    evidenceDigest: CANONICAL_GOVERNED_EVIDENCE_VECTOR_SHA256,
  });
  const CANONICAL_CHILD_RESULT_VECTOR_BYTES = SPK_ZERO_REVISION_CHILD_CANONICAL_BYTES;
  const CANONICAL_CHILD_RESULT_VECTOR_SHA256 = SPK_ZERO_REVISION_CHILD_CANONICAL_SHA256;
  const CANONICAL_CHILD_RESULT_TERMINAL_BYTES_SHA256 = SPK_ZERO_REVISION_CHILD_TERMINAL_SHA256;

  const GOVERNED_EVIDENCE_CONTRACT = deepFreeze({
    schemaVersion: SCHEMA_VERSION,
    contractId: "spk-r0-001-governed-evidence-contract-v1",
    governanceBindings: {
      moduleId: MODULE_ID,
      argumentSetId: ARGUMENT_SET_ID,
      taskId: TASK_ID,
      preparationReviewId: PREPARATION_REVIEW_ID,
      stageId: STAGE_ID,
      scopeClass: SCOPE_CLASS,
      actionClass: ACTION_CLASS,
      idempotencyKey: IDEMPOTENCY_KEY,
      stageBindingDigest: STAGE_BINDING_DIGEST,
      taskContractSha256: TASK_CONTRACT_SHA256,
    },
    normalizedEvidenceKeys: GOVERNED_EVIDENCE_KEYS,
    childResultKeys: CHILD_RESULT_KEYS,
    nestedShapeKeys: {
      fixture: GOVERNED_FIXTURE_KEYS,
      requirementResult: GOVERNED_ITEM_RESULT_KEYS,
      scenarioResult: GOVERNED_SCENARIO_RESULT_KEYS,
      contractResult: GOVERNED_CONTRACT_RESULT_KEYS,
      stateDigests: GOVERNED_STATE_DIGEST_KEYS,
      durableHealth: GOVERNED_DURABLE_HEALTH_KEYS,
      safety: GOVERNED_SAFETY_KEYS,
    },
    canonicalOrdering: {
      requirementIds: REQUIREMENT_IDS,
      scenarioIds: SCENARIO_IDS,
      contractIds: CONTRACT_IDS,
    },
    fixtureConstants: FIXTURE,
    fixtureSha256: SYNTHETIC_FOUNDATION_FIXTURE_DIGEST,
    materialBoundary: {
      fixtureMaterialClass: "public-fictional-test-only",
      authenticMaterialAccepted: false,
      privateMaterialAccepted: false,
      liveMaterialAccepted: false,
    },
    oracleConstants: {
      canonicalization: "recursive-sorted-key-json-v1",
      cipherAlgorithm: CIPHER_ALGORITHM,
      cipherVersion: CIPHER_VERSION,
      capacityDimensions: CAPACITY_DIMENSIONS,
      namespaceClasses: NAMESPACE_CLASSES,
      durableHealthValues: DURABLE_HEALTH_VALUES,
      logFields: LOG_FIELDS,
      logEventClasses: LOG_EVENT_CLASSES,
      logErrorClasses: LOG_ERROR_CLASSES,
      retentionDays: 30,
      fixedClockStart: FIXED_CLOCK_START,
      fixedClockEnd: FIXED_CLOCK_END,
      deterministicNonceSchedule: "sha256-seed-and-encryption-label-v1",
      deterministicNonceScope: "unique-per-encryption-label-within-one-isolated-reset-run; the schedule resets only between independent deterministic runs",
      destinationClass: "distinct-empty-synthetic",
    },
    primitiveOracleRecipes: {
      access: {
        humanExactKeys: ["assertion", "expiresAt", "hostClass", "method", "owner", "routeClass"],
        humanAllowedTuple: {
          assertion: FIXTURE.human.assertion,
          expiresAt: FIXTURE.human.expiresAt,
          hostClass: "fictional-human-origin",
          method: "GET",
          owner: FIXTURE.human.allowlistedOwner,
          routeClass: "human-archive",
        },
        callbackExactKeys: ["assertion", "authorizationClass", "bodyBytes", "hostClass", "method", "routeClass"],
        callbackAllowedTuple: {
          assertion: FIXTURE.callback.assertion,
          authorizationClass: "callback-assertion",
          bodyBytesMaximum: FIXTURE.callback.maximumBodyBytes,
          hostClass: "fictional-callback-origin",
          method: "POST",
          routeClass: "machine-callback",
        },
        humanAllowedActions: ["archive-read"],
        callbackAllowedActions: ["callback-ingest"],
        callbackIdempotencyPattern: "^callback-idempotency-[0-9]{4}$",
        humanDecisionOrder: [
          "reject-non-exact-key-set",
          "reject-host-route-method-assertion-owner-or-expiry-mismatch",
          "reject-expiry-at-or-before-fixed-clock-start",
          "allow",
        ],
        humanMutationVectors: [
          ["missing-assertion", "omit", "assertion"],
          ["empty-assertion", "set", "assertion", ""],
          ["malformed-assertion", "set", "assertion", "malformed"],
          ["expired-assertion", "set", "expiresAt", "2029-12-31T23:59:59.000Z"],
          ["second-human", "set", "owner", "fictional-human-02"],
          ["anonymous", "set", "owner", "anonymous"],
          ["sharing", "set", "routeClass", "sharing"],
          ["invitation", "set", "routeClass", "invitation"],
          ["public-route", "set", "hostClass", "fictional-public-origin"],
          ["callback-cross-surface", "set", "assertion", FIXTURE.callback.assertion],
        ],
        callbackDecisionOrder: [
          "reject-non-exact-key-set",
          "reject-authorization-assertion-host-route-or-method-mismatch",
          "reject-bodyBytes-unless-nonnegative-safe-integer-at-or-below-maximum",
          "allow",
        ],
        callbackMutationVectors: [
          ["wrong-authorization-class", "authorizationClass", "human-assertion"],
          ["wrong-host-class", "hostClass", "fictional-human-origin"],
          ["human-route", "routeClass", "human-archive"],
          ["wrong-method", "method", "GET"],
          ["oversized-body", "bodyBytes", FIXTURE.callback.maximumBodyBytes + 1],
          ["human-cross-surface", "assertion", FIXTURE.human.assertion],
        ],
        callbackForbiddenActions: ["archive-read", "session-read", "search", "media-read", "export"],
        humanForbiddenActions: ["callback-ingest", "callback-replay"],
        responseVector: {
          originClass: "fictional-same-origin",
          cacheControl: "private, no-store",
          sharedCacheDirective: "denied",
          browserVisibleFields: ["opaque-result-class", "durable-state"],
        },
        callbackReplayRule: "A first exact callback increments body and durable effect counts once; exact replay returns the same receipt without increments; same key with a different canonical request identity is denied without mutation.",
      },
      accessibility: {
        surfaceExactKeys: ["surfaceKind", "rendered", "interactive", "taskId", "stageId", "scenarioIds"],
        surfaceVector: {
          surfaceKind: "canonical-json-only",
          rendered: false,
          interactive: false,
          taskId: TASK_ID,
          stageId: STAGE_ID,
          scenarioIds: SCENARIO_IDS,
        },
        boundedCheck: "Pass only when surfaceKind is canonical-json-only, rendered and interactive are false, task/stage equal the frozen IDs, and scenarioIds canonical bytes equal the frozen ordered scenario list.",
        resultConstruction: {
          renderedSurfacePresent: "surface rendered value",
          boundedResult: "no-rendered-surface",
          machineSurfaceDigest: "canonical digest of the exact surfaceVector",
          fullIdentifiersAvailable: "taskId and stageId are both non-empty",
          interactiveAccessibilityClaimed: false,
          browserMatrixClaimed: false,
          r0ProductUiCoverageClaimed: false,
          candidateQaStaticSurfaceReviewRequired: true,
          limitation: "This serializable module has no rendered or interactive product surface; product UI accessibility remains untested.",
        },
      },
      capacity: {
        formula: "peak <= available - reserve for every exact dimension, with all values non-negative safe integers and reserve <= available",
        collisionRule: "reject an exact token match within the same namespace class; never mutate, remap, or remove existing state",
        namespaceTokenPattern: "^[a-z][a-z0-9-]{7,63}$",
        capacityEntryExactKeys: ["available", "dimension", "peak", "reserve"],
        namespaceEntryExactKeys: ["namespaceClass", "token"],
        decisionCodePrecedence: [
          "schema-invalid",
          "capacity-invalid",
          "dimension-set-invalid",
          "namespace-set-invalid",
          "collision",
          "capacity-exceeded",
          "admitted",
        ],
        canonicalSort: ["capacity-by-dimension", "namespaces-by-class-then-token"],
        boundaryOffsetsForEveryDimension: [-1, 0, 1],
        invalidVectorIds: [
          "missing-dimension",
          "unknown-dimension",
          "negative",
          "non-integer",
          "duplicate-dimension",
          "unsafe-integer",
          "unknown-namespace-class",
          "missing-namespace-class",
          "duplicate-namespace-key",
          "malformed-namespace-token",
        ],
        collisionVectorClasses: NAMESPACE_CLASSES,
      },
      encryption: {
        keyDerivation: "sha256(utf8(seedId + NUL + syntheticKeySeed))",
        wrongKeyDerivation: "sha256(utf8(seedId + NUL + wrong-fictional-material))",
        aadDerivation: "utf8(taskId + NUL + fixtureSchemaVersion)",
        nonceDerivation: "first 12 bytes of sha256(utf8(seedId + NUL + nonce + NUL + encryptionLabel))",
        encryptionLabels: ["record-1", "record-2"],
        envelopeKeys: ["algorithm", "authTag", "ciphertext", "nonce", "version"],
        plaintextEncoding: "canonical JSON of each fictional record encoded as UTF-8",
        encryptionOperation: "AES-256-GCM with 32-byte derived key, 12-byte nonce, fixed AAD, ciphertext and 16-byte authentication tag encoded as lower-case hex",
        decryptionValidationOrder: [
          "exact-envelope-key-set",
          "algorithm-and-version-match",
          "key-is-32-byte-buffer",
          "nonce-is-24-lower-hex",
          "authTag-is-32-lower-hex",
          "ciphertext-is-positive-even-lower-hex",
          "authenticated-decrypt-or-null",
        ],
        negativeVectors: [
          "wrong-key",
          "missing-key",
          "unknown-version",
          "truncate-final-ciphertext-byte",
          "alter-first-ciphertext-nibble",
          "alter-first-authTag-nibble",
          "unknown-algorithm",
        ],
        nonceEnforcement: "A reset-scoped used-label and used-nonce registry rejects a duplicate label or nonce before encryption; exactly two labels execute and a repeated record-1 attempt is rejected.",
        retainedStateScanFragments: ["fictional-canary", "canary-alpha", "canary-beta"],
      },
      recovery: {
        baselineSchemaVersion: "synthetic-baseline-v1",
        backupSchemaVersion: "synthetic-backup-v1",
        backupKeys: BACKUP_KEYS,
        payloadKeys: BACKUP_PAYLOAD_KEYS,
        manifestKeys: BACKUP_MANIFEST_KEYS,
        destinationKeys: RESTORE_DESTINATION_KEYS,
        comparisonClasses: [
          "ciphertextDigestsMatch",
          "expectedAbsenceRulesMatch",
          "inventoryMatches",
          "relationshipCountsMatch",
          "schemaVersionsMatch",
        ],
        injectedFaults: ["before-backup-complete", "during-restore", "during-comparison", "during-rollback"],
        baselineConstruction: {
          existingNamespaces: "deep clone fixture existing namespaces",
          candidateNamespaces: [],
          encryptedRecords: [],
          relationships: [],
        },
        sourceConstruction: "baseline schema plus deep-cloned existing and candidate fixture namespaces and the encrypted fixture records and relationships",
        payloadConstruction: "exact deep clone of source candidateNamespaces, encryptedRecords, existingNamespaces, relationships, and schemaVersion",
        manifestConstruction: {
          candidateNamespaceCount: "payload candidateNamespaces length",
          ciphertextDigests: "canonical digest of every encrypted record envelope in payload order",
          expectedAbsentClasses: ["decryption-material", "plaintext", "storage-locator"],
          existingNamespaceCount: "payload existingNamespaces length",
          namespaceInventoryDigest: "canonical digest of payload candidateNamespaces and existingNamespaces",
          recordCount: "payload encryptedRecords length",
          relationshipCount: "payload relationships length",
          schemaVersions: "unique encrypted envelope versions sorted lexically",
          stateSchemaVersion: "payload schemaVersion",
        },
        inspectionOrder: [
          "exact-backup-shape",
          "supported-backup-schema",
          "exact-payload-shape",
          "supported-payload-schema",
          "payload-content-validation",
          "exact-manifest-shape",
          "payload-digest-match",
          "recomputed-manifest-byte-and-digest-match",
        ],
        restoreTransition: "Accept only a distinct destination object with the exact destination keys, class distinct-empty-synthetic, empty true, and state null; deep-clone payload into destination.state, set empty false, and return that state.",
        comparisonRules: {
          ciphertextDigestsMatch: "restored envelope digests equal manifest ciphertextDigests",
          expectedAbsenceRulesMatch: "manifest expectedAbsentClasses equals the frozen three-value array",
          inventoryMatches: "source/restored namespace and encrypted-record canonical bytes match and manifest inventory counts/digest match restored state",
          relationshipCountsMatch: "source/restored relationship canonical bytes and manifest relationship and record counts match",
          schemaVersionsMatch: "source/restored/manifest state schema match and manifest has only the frozen cipher version",
        },
        rollbackTransition: "Delete every candidate-owned state key, assign a deep clone of the baseline, and require before digest equal source, after digest equal baseline, and a changed state; the injected failure restores candidate namespaces after replacement.",
        restoreFailureVectors: [
          "missing-backup",
          "corrupt-backup",
          "unknown-backup-version",
          "incompatible-payload-version",
          "non-empty-destination",
          "source-alias",
          "unproven-separation",
        ],
        incompatiblePayloadVector: "Set payload schemaVersion to synthetic-baseline-unknown and recompute payloadDigest before inspection; expected payload-schema-unsupported.",
        aliasProbe: "Restore a second destination, mutate its first candidate namespace token, and require source and backup digests unchanged plus all restored top-level collection references distinct from source.",
        faultExpectedResult: "Every injected fault must yield durable failed, no success receipt, and a causal restore/comparison/rollback result.",
      },
      health: {
        incompleteEventClasses: ["enqueued", "started", "attempted", "upload-completed", "backup-created"],
        terminalEventClasses: ["completed-success", "completed-failure", "deadline-reached", "prerequisite-blocked"],
        healthyPresentationSource: "success",
        decisionPrecedence: [
          ["prerequisiteBlocked", "blocked"],
          ["evidenceTrusted-is-not-true", "unknown"],
          ["attempted-is-not-true", "never run"],
          ["completed-and-succeeded", "success"],
          ["completed", "failed"],
          ["overdue", "delayed"],
          ["otherwise", "unknown"],
        ],
        eventTransitions: [
          ["enqueued", "no-state-change"],
          ["started", "attempted-true"],
          ["attempted", "attempted-true"],
          ["upload-completed", "attempted-true-only"],
          ["backup-created", "attempted-true-only"],
          ["deadline-reached", "attempted-and-overdue-true"],
          ["completed-success", "attempted-completed-succeeded-true"],
          ["completed-failure", "attempted-completed-true-succeeded-false"],
          ["prerequisite-blocked", "prerequisiteBlocked-true"],
        ],
        classificationVectors: [
          ["missing-evidence", "unknown"],
          ["not-attempted", "never run"],
          ["completed-success", "success"],
          ["overdue-incomplete", "delayed"],
          ["completed-failure", "failed"],
          ["known-prerequisite", "blocked"],
        ],
      },
      logging: {
        forbiddenFields: FORBIDDEN_LOG_FIELDS,
        retentionBeforeBoundary: "2030-01-30T23:59:59.999Z",
        retentionAtBoundary: "2030-01-31T00:00:00.000Z",
        exactRecord: {
          timestamp: FIXED_CLOCK_START,
          opaqueId: "evt-0001",
          eventClass: "check-completed",
          errorClass: "none",
          taskId: TASK_ID,
          stageId: STAGE_ID,
          requirementId: "LID-OPS-016",
          scenarioId: "SPK-R0-001-QA-003",
        },
        validation: "Exact allowlisted keys, parseable timestamp, evt-four-digit opaque ID, frozen event/error classes, exact task/stage, and known requirement/scenario IDs.",
        forbiddenSentinels: FORBIDDEN_SENTINELS,
        retentionRule: "retain only when fixed now minus timestamp is strictly less than 30 times 24 times 60 times 60 times 1000 milliseconds",
        rotationInitialMaterial: "canonical digest of materialClass synthetic-log-sentinel and version 1",
        rotationOperation: "Change active writer material reference to the canonical digest for version 2 while preserving archiveRecords canonical digest; require writer state and future-write binding to change.",
        scannedArtifactClasses: ["local-log"],
      },
      replay: {
        requestExactKeys: ["idempotencyKey", "operation", "payloadClass"],
        idempotencyPattern: "^synthetic-idempotency-[0-9]{4}$",
        operation: "install-fictional-namespace",
        payloadClass: "synthetic-foundation",
        interruptionClasses: ["before-durability", "after-durability-before-acknowledgement"],
        requestDigest: "canonical digest of operation and payloadClass only",
        receiptIdentity: "canonical digest of idempotencyKey and requestDigest",
        stateKeys: ["durableRecords", "effectCount", "terminalFailures"],
        firstUse: "Store receiptIdentity and requestDigest under the idempotency key and increment effectCount exactly once before acknowledgement.",
        exactReplay: "Return stored success receipt without changing effectCount.",
        conflict: "If a success exists for the key and the new request is invalid or differs, return failed with a conflict failureIdentity and preserve the entire replay state.",
        terminalFailure: "For an exact-shaped syntactically valid but invalid request without prior success, store the canonical failed-request digest and failureIdentity; restart deep-clones it and returns the same failureIdentity.",
        interruptionBeforeDurability: "Return delayed with zero effect and no receipt; a later exact retry performs one effect.",
        interruptionAfterDurability: "Persist one effect and receipt, return delayed without acknowledgement, and return the existing receipt on retry and restart.",
        mutationVectorIds: [
          "missing-idempotency-key",
          "extra-field",
          "malformed-idempotency-key",
          "wrong-operation",
          "wrong-payload-class",
          "out-of-order",
          "timeout",
          "stale-dependency",
        ],
        timeoutRule: "attempted true, completed false, deadlineReached true, and successReceiptCreated false yields delayed and no success receipt",
        dependencyPrecedence: ["stale-to-blocked", "untrusted-to-unknown", "available-to-success", "otherwise-failed"],
        dependencyFailureTransition: "In a local shell containing baseline state, policy class, PC-001 success, durable records, and localShellAvailable true, change only PC-001 to failed and require baseline, durable request identity, access denial, and shell availability preserved.",
      },
      privateBoundary: {
        privateRequiredInputClasses: PRIVATE_REQUIRED_INPUT_CLASSES,
        stopConclusion: "blocked — private evidence required",
        decisionRule: "Return null for any class outside the frozen list; otherwise return the input class, exact stop conclusion, and privateOrExternalAccessAttempted false.",
      },
      statePresentation: {
        stateIds: [
          "normal-proposal",
          "normal-accepted-preparation",
          "normal-candidate-qa-result",
          "normal-governed-stage-result",
          "empty-never-run",
          "loading-long-running",
          "validation-error",
          "dependency-error",
          "interruption",
          "timeout",
          "stale-result",
          "destructive-synthetic-rehearsal",
          "blocked-private",
          "unavailable-not-configured",
        ],
        cases: [
          "normal-proposal",
          "normal-accepted-preparation",
          "normal-candidate-qa-result",
          "normal-governed-stage-result",
          "empty-never-run",
          "loading-long-running",
          "validation-error",
          "dependency-error",
          "interruption",
          "timeout",
          "stale-result",
          "destructive-synthetic-rehearsal",
          "blocked-private",
          "unavailable-not-configured",
        ].map((stateId) => ({ stateId, ...evidenceStatePresentation(stateId) })),
        unknownStateResult: null,
        successConclusionRule: "synthetic foundation passes occurs only with terminalResultEstablished true and durableHealth success",
      },
    },
    independentVerifierProtocol: {
      contractCustody: "The accepted dossier and runner verifier freeze this public contract separately; the child fd3 remains the exact eight-key result only.",
      moduleImportAllowed: false,
      moduleFunctionCallAllowed: false,
      expectedDigestCopyAloneAllowed: false,
      reconstructionOrder: [
        "recreate fixture constants",
        "independently implement canonical JSON",
        "independently execute every primitive recipe and vector",
        "compare independently reconstructed component objects with primitiveOracleExpectedResults",
        "recompute component observation digests",
        "derive requirement, scenario, and contract observations from frozen bindings",
        "build normalized governed evidence for the runtime source revision",
        "compare evidence digest with the child result",
      ],
      deliberateSemanticDriftNegative: {
        mutationId: "capacity-one-over-forced-pass",
        mutation: "Change the compute one-over boundary actual result from false to true after independent reconstruction.",
        expectedVerificationResult: "reject",
      },
      externalCandidateQaPreconditions: [
        "module-source-and-obfuscated-loader-scan",
        "closed-dependency-and-builtin-scan",
        "child-result-and-retained-artifact-scan",
      ],
    },
    resultSemantics: {
      pass: "Every exact local synthetic oracle assertion completed with its expected result.",
      fail: "At least one exact local synthetic oracle assertion did not establish its expected result.",
      blocked: "A private, authentic, external, or human-only prerequisite was identified and no access was attempted.",
      observationDigest: "SHA-256 of canonical JSON over the named independently reconstructed observation set.",
      evidenceDigest: "SHA-256 of canonical JSON over the complete normalized governed-evidence object.",
      successChildBoundary: "Only the exact synthetic foundation passes conclusion may produce outcome succeeded; failure or private-required states terminate without a success child result.",
    },
    normalizationRecipes: {
      schemaDisplayOrder: "The declared evidence and child-result key arrays define review and display order only.",
      canonicalJson: "Serialize object keys in default JavaScript code-unit lexical order, preserve array order, reject non-finite numbers and non-plain objects, and encode UTF-8 JSON without whitespace.",
      componentObservation: "Hash the closed deterministic model result for the named component.",
      requirementObservation: "Derive result from every bound component result, then hash result, requirementId, and the ordered componentId and component observationDigest pairs.",
      scenarioObservation: "Derive result from every bound component result, then hash result, scenarioId, its boundedResult, and the ordered componentId and component observationDigest pairs.",
      contractObservation: "Derive result from every bound component result, then hash result, contractId, and the ordered componentId and component observationDigest pairs.",
      childResult: "Hashing is not applied here; canonical child-result bytes contain the normalized evidence digest and one terminal LF.",
    },
    observationBindings: {
      requirementComponents: REQUIREMENT_COMPONENTS,
      scenarioComponents: SCENARIO_COMPONENTS,
      contractComponents: CONTRACT_MODEL_COMPONENTS,
    },
    expectedComponentObservationDigests: FROZEN_COMPONENT_OBSERVATION_DIGESTS,
    primitiveOracleExpectedResults: FROZEN_ORACLE_MODEL,
    expectedStateDigests: FROZEN_STATE_DIGESTS,
    expectedDurableHealth: {
      backup: "success",
      restoreVerification: "success",
      overall: "success",
    },
    expectedSafety: {
      local: true,
      public: true,
      fictional: true,
      synthetic: true,
      authenticMediaAccessed: false,
      privateNetworkAccessed: false,
      externalMutationPerformed: false,
      aiContentPathUsed: false,
      forbiddenContentFindings: 0,
    },
    moduleCapabilityProfile: {
      moduleId: MODULE_ID,
      moduleClass: "serializable-child",
      argumentSetId: ARGUMENT_SET_ID,
      argumentSet: [],
      nodeBuiltins: ["node:crypto", "node:fs"],
      descriptorWrite: 3,
      ordinaryFilesystemAccess: false,
      stdoutBytes: 0,
      stderrBytes: 0,
      ambientEnvironmentRead: false,
      externalIo: false,
      dynamicCodeLoading: false,
    },
    canonicalVectors: {
      genericCanonicalJson: {
        value: CANONICAL_JSON_TEST_VALUE,
        canonicalBytes: CANONICAL_JSON_TEST_BYTES,
        canonicalSha256: CANONICAL_JSON_TEST_SHA256,
      },
      governedEvidence: {
        sourceRevision: CANONICAL_EVIDENCE_VECTOR_SOURCE_REVISION,
        displayKeyOrder: GOVERNED_EVIDENCE_KEYS,
        canonicalObjectKeyOrder: "recursive-code-unit-lexical",
        canonicalByteLength: CANONICAL_GOVERNED_EVIDENCE_VECTOR_BYTE_LENGTH,
        canonicalSha256: CANONICAL_GOVERNED_EVIDENCE_VECTOR_SHA256,
      },
      childResult: {
        sourceRevision: CANONICAL_EVIDENCE_VECTOR_SOURCE_REVISION,
        displayKeyOrder: CHILD_RESULT_KEYS,
        canonicalObjectKeyOrder: "recursive-code-unit-lexical",
        value: CANONICAL_CHILD_RESULT_VECTOR,
        canonicalBytes: CANONICAL_CHILD_RESULT_VECTOR_BYTES,
        canonicalSha256: CANONICAL_CHILD_RESULT_VECTOR_SHA256,
        terminalLfBytesSha256: CANONICAL_CHILD_RESULT_TERMINAL_BYTES_SHA256,
      },
    },
    candidateQaRemainder: [
      "module-source-and-obfuscated-loader-scan",
      "closed-dependency-and-builtin-scan",
      "child-result-and-retained-artifact-scan",
      "independent-primitive-oracle-reconstruction",
    ],
    conclusionValues: [
      "synthetic foundation passes",
      "synthetic foundation fails",
      "blocked — private evidence required",
    ],
    limitations: LIMITATIONS,
    permittedClaim: PERMITTED_CLAIM,
  });

  return deepFreeze({
    fixture: FIXTURE,
    fixtureSha256: SYNTHETIC_FOUNDATION_FIXTURE_DIGEST,
    oracleModel: FROZEN_ORACLE_MODEL,
    componentObservationDigests: FROZEN_COMPONENT_OBSERVATION_DIGESTS,
    stateDigests: FROZEN_STATE_DIGESTS,
    contract: GOVERNED_EVIDENCE_CONTRACT,
    contractSha256: digest(GOVERNED_EVIDENCE_CONTRACT),
  });
}

function spkComponentObservationDigests(oracleModel) {
  return Object.fromEntries(Object.entries(oracleModel)
    .map(([name, value]) => [name, spkDigest(value)]));
}

function spkStateDigestsFromOracle(oracleModel) {
  const recovery = oracleModel?.recovery;
  return {
    beforeSha256: recovery?.baselineDigest,
    afterSha256: recovery?.sourceDigest,
    backupSha256: recovery?.backupDigest,
    restoreSha256: recovery?.restoredDigest,
    comparisonSha256: recovery?.comparisonDigest,
    rollbackSha256: recovery?.rollbackDigest,
  };
}

function spkIndependentReconstructionPasses(candidate) {
  try {
    if (!hasExactKeys(candidate, [
      "fixture", "fixtureSha256", "oracleModel", "componentObservationDigests",
      "stateDigests", "contract", "contractSha256",
    ])) return false;
    const componentDigests = spkComponentObservationDigests(candidate.oracleModel);
    const stateDigests = spkStateDigestsFromOracle(candidate.oracleModel);
    const contractBytes = Buffer.from(canonicalJson(candidate.contract), "utf8");
    return Object.values(candidate.oracleModel).every((value) => value?.pass === true)
      && canonicalJson(Object.keys(candidate.oracleModel).sort())
        === canonicalJson(Object.keys(SPK_COMPONENT_OBSERVATION_DIGESTS).sort())
      && spkDigest(candidate.fixture) === candidate.fixtureSha256
      && candidate.fixtureSha256 === SPK_SYNTHETIC_FIXTURE_SHA256
      && canonicalJson(componentDigests) === canonicalJson(candidate.componentObservationDigests)
      && canonicalJson(componentDigests) === canonicalJson(SPK_COMPONENT_OBSERVATION_DIGESTS)
      && canonicalJson(stateDigests) === canonicalJson(candidate.stateDigests)
      && canonicalJson(stateDigests) === canonicalJson(SPK_STATE_DIGESTS)
      && canonicalJson(candidate.contract.fixtureConstants) === canonicalJson(candidate.fixture)
      && candidate.contract.fixtureSha256 === candidate.fixtureSha256
      && canonicalJson(candidate.contract.primitiveOracleExpectedResults)
        === canonicalJson(candidate.oracleModel)
      && canonicalJson(candidate.contract.expectedComponentObservationDigests)
        === canonicalJson(componentDigests)
      && canonicalJson(candidate.contract.expectedStateDigests) === canonicalJson(stateDigests)
      && contractBytes.length === 58_639
      && publicTextBytesAreSafe(contractBytes)
      && spkDigest(candidate.contract) === candidate.contractSha256
      && candidate.contractSha256 === SPK_GOVERNED_EVIDENCE_CONTRACT_SHA256;
  } catch {
    return false;
  }
}

const SPK_INDEPENDENT_RECONSTRUCTION = reconstructSpkIndependentContract();

function deepFreezeSpk(value) {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const entry of Object.values(value)) deepFreezeSpk(entry);
  }
  return value;
}

function spkDigest(value) {
  return sha256(Buffer.from(canonicalJson(value), "utf8"));
}

function spkIndependentOraclePasses(candidate = SPK_INDEPENDENT_RECONSTRUCTION) {
  return spkIndependentReconstructionPasses(candidate);
}

function buildSpkSyntheticGovernedEvidence(sourceRevision, stageBindingDigest) {
  if (!FULL_REVISION.test(sourceRevision)
    || stageBindingDigest !== SPK_SYNTHETIC_STAGE_BINDING_DIGEST
    || !spkIndependentOraclePasses()
    || canonicalJson({ z: 1, a: { b: 2, a: 1 }, list: [{ b: false, a: true }, "x"] })
      !== SPK_CANONICAL_JSON_VECTOR
    || sha256(Buffer.from(SPK_CANONICAL_JSON_VECTOR, "utf8")) !== SPK_CANONICAL_JSON_VECTOR_SHA256
    || !RECEIPT_DIGEST.test(SPK_GOVERNED_EVIDENCE_CONTRACT_SHA256)) return null;
  const componentResults = Object.fromEntries(Object.entries(
    SPK_INDEPENDENT_RECONSTRUCTION.componentObservationDigests,
  )
    .map(([name, evidenceDigest]) => [name, { name, result: "pass", evidenceDigest }]));
  const requirementResults = SPK_REQUIREMENT_IDS.map((requirementId) => {
    const result = "pass";
    const observations = SPK_REQUIREMENT_COMPONENTS[requirementId].map((componentId) => ({
      componentId,
      observationDigest: componentResults[componentId].evidenceDigest,
    }));
    return {
      requirementId,
      result,
      observationDigest: spkDigest({ requirementId, result, observations }),
    };
  });
  componentResults.requirements = {
    name: "requirements",
    result: "pass",
    evidenceDigest: spkDigest(requirementResults),
  };
  const scenarioResults = SPK_SCENARIO_IDS.map((scenarioId) => {
    const result = "pass";
    const observations = SPK_SCENARIO_COMPONENTS[scenarioId].map((componentId) => ({
      componentId,
      observationDigest: componentResults[componentId].evidenceDigest,
    }));
    return {
      scenarioId,
      result,
      observationDigest: spkDigest({
        scenarioId,
        result,
        boundedResult: scenarioId === "SPK-R0-001-D-002"
          ? "no-rendered-surface"
          : "synthetic-contract-satisfied",
        observations,
      }),
    };
  });
  const contractResults = SPK_CONTRACT_IDS.map((contractId) => {
    const result = "pass";
    const observations = SPK_CONTRACT_COMPONENTS[contractId].map((componentId) => ({
      componentId,
      observationDigest: componentResults[componentId].evidenceDigest,
    }));
    return {
      contractId,
      result,
      observationDigest: spkDigest({ contractId, result, observations }),
    };
  });
  const evidence = {
    schemaVersion: "1.0.0",
    evidenceKind: "governed-synthetic-foundation-evidence-v1",
    taskId: SPK_SYNTHETIC_TASK_ID,
    stageId: SPK_SYNTHETIC_STAGE_ID,
    scopeClass: "local-synthetic",
    actionClass: "synthetic-foundation",
    idempotencyKey: SPK_SYNTHETIC_IDEMPOTENCY_KEY,
    sourceRevision,
    stageBindingDigest,
    fixture: {
      fixtureId: "spk-r0-001-fictional-foundation-v1",
      schemaVersion: "spk-r0-001.synthetic-foundation.fixture.v1",
      seedId: "spk-r0-001-fixed-seed-v1",
      fixtureSha256: SPK_INDEPENDENT_RECONSTRUCTION.fixtureSha256,
      fixtureClass: "local-public-fictional-synthetic",
      authenticContentExcluded: true,
    },
    requirementResults,
    scenarioResults,
    contractResults,
    stateDigests: { ...SPK_INDEPENDENT_RECONSTRUCTION.stateDigests },
    durableHealth: { backup: "success", restoreVerification: "success", overall: "success" },
    safety: {
      local: true,
      public: true,
      fictional: true,
      synthetic: true,
      authenticMediaAccessed: false,
      privateNetworkAccessed: false,
      externalMutationPerformed: false,
      aiContentPathUsed: false,
      forbiddenContentFindings: 0,
    },
    conclusion: "synthetic foundation passes",
    limitations: [...SPK_LIMITATIONS],
    permittedClaim: SPK_PERMITTED_CLAIM,
  };
  try {
    const bytes = Buffer.from(canonicalJson(evidence), "utf8");
    if (!publicTextBytesAreSafe(bytes)
      || requirementResults.length !== 11
      || scenarioResults.length !== 15
      || contractResults.length !== 8
      || (sourceRevision === SPK_ZERO_REVISION
        && (bytes.length !== SPK_ZERO_REVISION_EVIDENCE_BYTE_LENGTH
          || bytes.toString("utf8") !== SPK_ZERO_REVISION_EVIDENCE_CANONICAL_BYTES
          || sha256(bytes) !== SPK_ZERO_REVISION_EVIDENCE_SHA256))) return null;
  } catch {
    return null;
  }
  return deepFreezeSpk(evidence);
}

function spkSyntheticChildResult(sourceRevision, evidenceDigest) {
  return {
    schemaVersion: "1.0.0",
    outcome: "succeeded",
    taskId: SPK_SYNTHETIC_TASK_ID,
    stageId: SPK_SYNTHETIC_STAGE_ID,
    idempotencyKey: SPK_SYNTHETIC_IDEMPOTENCY_KEY,
    sourceRevision,
    stageBindingDigest: SPK_SYNTHETIC_STAGE_BINDING_DIGEST,
    evidenceDigest,
  };
}

/**
 * Deterministic, public-safe evidence retrieval. This function performs no I/O,
 * imports no task module, evaluates no authority, and mints no receipt.
 */
export function reconstructProductionGovernedEvidence(request = {}) {
  try {
    if (!hasExactKeys(request, SPK_RECONSTRUCTION_REQUEST_KEYS)
      || request.moduleId !== SPK_SYNTHETIC_MODULE_ID
      || request.taskId !== SPK_SYNTHETIC_TASK_ID
      || request.stageId !== SPK_SYNTHETIC_STAGE_ID
      || !FULL_REVISION.test(request.sourceRevision ?? "")
      || request.stageBindingDigest !== SPK_SYNTHETIC_STAGE_BINDING_DIGEST
      || request.moduleSha256 !== SPK_SYNTHETIC_MODULE_SHA256
      || !RECEIPT_DIGEST.test(request.evidenceDigest ?? "")) return null;
    const evidence = buildSpkSyntheticGovernedEvidence(request.sourceRevision, request.stageBindingDigest);
    return evidence !== null && spkDigest(evidence) === request.evidenceDigest ? evidence : null;
  } catch {
    return null;
  }
}

function verifySpkSyntheticFoundationOutcome(request = {}) {
  try {
    if (!hasExactKeys(request, SPK_VERIFICATION_REQUEST_KEYS)
      || request.schemaVersion !== "1.0.0"
      || !SPK_VERIFICATION_BOUNDARIES.includes(request.boundary)
      || request.moduleId !== SPK_SYNTHETIC_MODULE_ID
      || request.taskId !== SPK_SYNTHETIC_TASK_ID
      || request.stageId !== SPK_SYNTHETIC_STAGE_ID
      || !FULL_REVISION.test(request.sourceRevision ?? "")
      || request.stageBindingDigest !== SPK_SYNTHETIC_STAGE_BINDING_DIGEST
      || request.moduleSha256 !== SPK_SYNTHETIC_MODULE_SHA256
      || !RECEIPT_DIGEST.test(request.childResultSha256 ?? "")
      || !RECEIPT_DIGEST.test(request.evidenceDigest ?? "")) return null;
    const evidence = reconstructProductionGovernedEvidence({
      moduleId: request.moduleId,
      taskId: request.taskId,
      stageId: request.stageId,
      sourceRevision: request.sourceRevision,
      stageBindingDigest: request.stageBindingDigest,
      moduleSha256: request.moduleSha256,
      evidenceDigest: request.evidenceDigest,
    });
    if (evidence === null) return null;
    const childResult = spkSyntheticChildResult(request.sourceRevision, request.evidenceDigest);
    const childResultBytes = Buffer.from(`${canonicalJson(childResult)}\n`, "utf8");
    if (sha256(childResultBytes) !== request.childResultSha256
      || (request.sourceRevision === SPK_ZERO_REVISION
        && (canonicalJson(childResult) !== SPK_ZERO_REVISION_CHILD_CANONICAL_BYTES
          || sha256(Buffer.from(SPK_ZERO_REVISION_CHILD_CANONICAL_BYTES, "utf8"))
            !== SPK_ZERO_REVISION_CHILD_CANONICAL_SHA256
          || childResultBytes.length !== SPK_ZERO_REVISION_CHILD_TERMINAL_BYTE_LENGTH
          || sha256(childResultBytes) !== SPK_ZERO_REVISION_CHILD_TERMINAL_SHA256))) return null;
    const observationDigest = spkDigest({
      boundary: request.boundary,
      childResultSha256: request.childResultSha256,
      evidenceDigest: request.evidenceDigest,
      governedEvidenceContractSha256: SPK_GOVERNED_EVIDENCE_CONTRACT_SHA256,
      moduleSha256: request.moduleSha256,
      sourceRevision: request.sourceRevision,
      stageBindingDigest: request.stageBindingDigest,
      stageId: request.stageId,
      taskId: request.taskId,
    });
    return deepFreezeSpk({
      schemaVersion: "1.0.0",
      outcome: "pass",
      boundary: request.boundary,
      taskId: request.taskId,
      stageId: request.stageId,
      sourceRevision: request.sourceRevision,
      stageBindingDigest: request.stageBindingDigest,
      moduleSha256: request.moduleSha256,
      childResultSha256: request.childResultSha256,
      evidenceDigest: request.evidenceDigest,
      observationDigest,
    });
  } catch {
    return null;
  }
}

function safeRuntimeSegment(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function processStartIdentity(pid) {
  if (!Number.isSafeInteger(pid) || pid <= 0) return null;
  const observed = spawnSync("ps", ["-o", "lstart=", "-p", String(pid)], {
    encoding: "utf8",
    env: { LANG: "C", LC_ALL: "C", PATH: process.env.PATH ?? "/usr/bin:/bin" },
    timeout: 2_000,
  });
  const identity = observed.status === 0 ? observed.stdout.trim().replace(/\s+/g, " ") : "";
  return identity.length > 0 ? identity : null;
}

function processIdentityMatches(pid, expectedIdentity) {
  return typeof expectedIdentity === "string"
    && expectedIdentity.length > 0
    && processStartIdentity(pid) === expectedIdentity;
}

function validateAuthorization(authorization, request, definition) {
  if (!hasExactKeys(authorization, AUTHORIZATION_KEYS)
    || authorization.ok !== true
    || authorization.scope !== "stage-gate-b"
    || authorization.code !== "STAGE_GATE_B_READY"
    || authorization.taskId !== request.taskId
    || authorization.stageId !== request.stageId
    || authorization.scopeClass !== request.scopeClass
    || authorization.actionClass !== request.actionClass
    || authorization.idempotencyKey !== request.idempotencyKey
    || authorization.predecessorReceiptSha256 !== request.predecessorReceiptSha256
    || !FULL_REVISION.test(authorization.sourceRevision ?? "")
    || !FULL_REVISION.test(authorization.candidateRevision ?? "")
    || !/^[0-9a-f]{64}$/.test(authorization.dossierDigest ?? "")
    || !/^P0-PREP-[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(authorization.preparationReviewId ?? "")
    || !/^[0-9a-f]{64}$/.test(authorization.preparationReviewSha256 ?? "")
    || !["execute", "accept"].includes(authorization.gateKind)
    || authorization.gateDecision !== (authorization.gateKind === "accept"
      ? "Ready to accept — Gate B"
      : "Ready to execute — Gate B")
    || authorization.independentQaResult !== "pass"
    || !/^[0-9a-f]{64}$/.test(authorization.stageApprovalSha256 ?? "")
    || !RECEIPT_DIGEST.test(authorization.stageDefinitionSha256 ?? "")
    || !MODULE_ID.test(authorization.moduleId ?? "")
    || !RECEIPT_DIGEST.test(authorization.moduleSha256 ?? "")
    || !/^[0-9a-f]{64}$/.test(authorization.registrySha256 ?? "")
    || !RECEIPT_DIGEST.test(authorization.gateSourceFingerprint ?? "")
    || typeof authorization.rollbackSnapshotReference !== "string"
    || !/^[a-z][a-z0-9-]*:[A-Za-z0-9._/-]{4,160}$/.test(authorization.rollbackSnapshotReference)
    || !publicTextBytesAreSafe(authorization.rollbackSnapshotReference)
    || !Number.isFinite(PRIMORDIAL_DATE_PARSE(authorization.deadlineAt ?? ""))) return false;
  return definition.taskId === authorization.taskId
    && definition.stageId === authorization.stageId
    && definition.scopeClass === authorization.scopeClass
    && definition.actionClass === authorization.actionClass
    && definition.idempotencyKey === authorization.idempotencyKey
    && stageBindingDigest(definition) === authorization.stageDefinitionSha256
    && definition.moduleId === authorization.moduleId
    && (definition.predecessor?.receiptDigest ?? null) === authorization.predecessorReceiptSha256;
}

function sameAuthorization(left, right) {
  const stableKeys = AUTHORIZATION_KEYS.filter((key) => key !== "deadlineAt");
  return stableKeys.every((key) => left[key] === right[key]);
}

function bindingRequest(definition) {
  return Object.freeze({
    taskId: definition.taskId,
    scopeClass: definition.scopeClass,
    actionClass: definition.actionClass,
    stageId: definition.stageId,
    predecessorReceiptSha256: definition.predecessor?.receiptDigest ?? null,
    idempotencyKey: definition.idempotencyKey,
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => PRIMORDIAL_SET_TIMEOUT(resolve, milliseconds));
}

async function syncDirectory(directory) {
  const handle = await open(directory, "r");
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function syncRegularFile(filePath) {
  const before = await lstat(filePath);
  if (!before.isFile() || before.isSymbolicLink()) {
    throw new Error("journal tail is not a regular file");
  }
  const handle = await open(filePath, "r");
  try {
    const opened = await handle.stat();
    const current = await lstat(filePath);
    if (!current.isFile()
      || current.isSymbolicLink()
      || opened.dev !== current.dev
      || opened.ino !== current.ino
      || before.dev !== current.dev
      || before.ino !== current.ino) {
      throw new Error("journal tail identity changed before fsync");
    }
    await handle.sync();
    return Object.freeze({ dev: current.dev, ino: current.ino });
  } finally {
    await handle.close();
  }
}

async function ensureDurableDirectory(directory) {
  let created = false;
  try {
    await mkdir(directory, { mode: 0o700 });
    created = true;
  } catch (error) {
    if (error?.code !== "EEXIST") throw error;
  }
  const stat = await lstat(directory);
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw new Error("runtime directory is not a plain directory");
  }
  // Every contender syncs the owning directory. If another process created
  // this entry but has not yet fsynced its parent, observing EEXIST alone is
  // not sufficient durability before an external effect.
  await syncDirectory(path.dirname(directory));
  await syncDirectory(directory);
}

function isWithin(parent, child) {
  const relative = path.relative(parent, child);
  return relative.length > 0 && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}

function validateProductionRequest(request) {
  if (!hasExactKeys(request, PRODUCTION_REQUEST_KEYS)) return result(false, "STAGE_REQUEST_SHAPE_INVALID");
  if (typeof request.taskId !== "string"
    || typeof request.scopeClass !== "string"
    || typeof request.actionClass !== "string"
    || typeof request.stageId !== "string"
    || typeof request.idempotencyKey !== "string"
    || request.predecessorReceiptSha256 !== null
      && (typeof request.predecessorReceiptSha256 !== "string"
        || !RECEIPT_DIGEST.test(request.predecessorReceiptSha256))) {
    return result(false, "STAGE_REQUEST_SHAPE_INVALID");
  }
  return result(true, "STAGE_REQUEST_VALID", { taskId: request.taskId, stageId: request.stageId });
}

function captureSerializableProductionRequest(request) {
  try {
    if (request === null
      || typeof request !== "object"
      || Array.isArray(request)
      || utilTypes.isProxy(request)
      || PRIMORDIAL_OBJECT_GET_PROTOTYPE_OF(request) !== Object.prototype
      || PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_SYMBOLS(request).length !== 0) {
      return null;
    }
    const descriptors = PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTORS(request);
    if (Object.keys(descriptors).sort().join("\0") !== [...PRODUCTION_REQUEST_KEYS].sort().join("\0")
      || !Object.values(descriptors).every((descriptor) => Object.hasOwn(descriptor, "value")
        && descriptor.get === undefined
        && descriptor.set === undefined
        && descriptor.enumerable === true)) {
      return null;
    }
    const identity = PRIMORDIAL_OBJECT_FREEZE(Object.fromEntries(
      PRODUCTION_REQUEST_KEYS.map((key) => [key, descriptors[key].value]),
    ));
    return validateProductionRequest(identity).ok ? identity : null;
  } catch {
    return null;
  }
}

function captureCallbackProductionRequest(request) {
  try {
    if (request === null
      || typeof request !== "object"
      || Array.isArray(request)
      || utilTypes.isProxy(request)
      || PRIMORDIAL_OBJECT_GET_PROTOTYPE_OF(request) !== Object.prototype
      || PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_SYMBOLS(request).length !== 0) {
      return null;
    }
    const descriptors = PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTORS(request);
    if (Object.keys(descriptors).sort().join("\0") !== [...CALLBACK_PRODUCTION_REQUEST_KEYS].sort().join("\0")
      || !Object.values(descriptors).every((descriptor) => Object.hasOwn(descriptor, "value")
        && descriptor.get === undefined
        && descriptor.set === undefined
        && descriptor.enumerable === true)
      || typeof descriptors.execute.value !== "function") {
      return null;
    }
    const identity = PRIMORDIAL_OBJECT_FREEZE(Object.fromEntries(
      PRODUCTION_REQUEST_KEYS.map((key) => [key, descriptors[key].value]),
    ));
    const validation = validateProductionRequest(identity);
    return validation.ok
      ? PRIMORDIAL_OBJECT_FREEZE({ identity, execute: descriptors.execute.value })
      : null;
  } catch {
    return null;
  }
}

function reviewedCallbackMatches(entry, moduleEntry, execute) {
  try {
    if (entry === null
      || typeof entry !== "object"
      || Array.isArray(entry)
      || utilTypes.isProxy(entry)
      || PRIMORDIAL_OBJECT_GET_PROTOTYPE_OF(entry) !== Object.prototype
      || PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_SYMBOLS(entry).length !== 0) return false;
    const descriptors = PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTORS(entry);
    return Object.keys(descriptors).sort().join("\0") === [...CALLBACK_ALLOWLIST_ENTRY_KEYS].sort().join("\0")
      && Object.values(descriptors).every((descriptor) => Object.hasOwn(descriptor, "value")
        && descriptor.get === undefined
        && descriptor.set === undefined
        && descriptor.enumerable === true)
      && descriptors.execute.value === execute
      && descriptors.moduleId.value === moduleEntry.moduleId
      && descriptors.moduleRelativePath.value === moduleEntry.moduleRelativePath
      && descriptors.moduleSha256.value === moduleEntry.moduleSha256
      && descriptors.gitMode.value === moduleEntry.gitMode
      && descriptors.capabilityProfile.value === CALLBACK_CAPABILITY_PROFILE
      && RECEIPT_DIGEST.test(descriptors.capabilityReviewSha256.value ?? "");
  } catch {
    return false;
  }
}

function validateCallbackCompletion(value, expected) {
  if (!hasExactKeys(value, CALLBACK_COMPLETION_KEYS)
    || value.schemaVersion !== "1.0.0"
    || value.outcome !== "succeeded"
    || value.taskId !== expected.taskId
    || value.scopeClass !== expected.scopeClass
    || value.actionClass !== expected.actionClass
    || value.stageId !== expected.stageId
    || value.predecessorReceiptSha256 !== expected.predecessorReceiptSha256
    || value.idempotencyKey !== expected.idempotencyKey
    || value.sourceRevision !== expected.sourceRevision
    || value.candidateRevision !== expected.candidateRevision
    || value.stageBindingDigest !== expected.stageBindingDigest
    || !RECEIPT_DIGEST.test(value.evidenceDigest ?? "")) return null;
  try {
    const bytes = Buffer.from(canonicalJson(value), "utf8");
    if (bytes.length === 0 || bytes.length > MAX_CHILD_RESULT_BYTES || !publicTextBytesAreSafe(bytes)) return null;
    return Object.freeze({ value: Object.freeze({ ...value }), digest: sha256(bytes) });
  } catch {
    return null;
  }
}

function frozenCallbackContext({ definition, authorization, deadlineAt }) {
  const signalController = new AbortController();
  // Freeze the complete caller-owned context and every ordinary data value.
  // AbortSignal is the intentional native exception: its reference is frozen
  // into the context while its internal aborted/reason state must remain able
  // to change when the runner requests cancellation.
  return Object.freeze({
    controller: signalController,
    value: Object.freeze({
      taskId: definition.taskId,
      scopeClass: definition.scopeClass,
      actionClass: definition.actionClass,
      stageId: definition.stageId,
      predecessorReceiptSha256: definition.predecessor?.receiptDigest ?? null,
      idempotencyKey: definition.idempotencyKey,
      revision: authorization.sourceRevision,
      candidateRevision: authorization.candidateRevision,
      deadlineAt: PRIMORDIAL_DATE_TO_ISO_STRING(new PRIMORDIAL_DATE(deadlineAt)),
      signal: signalController.signal,
    }),
  });
}

function installCallbackStreamCapture() {
  const install = (stream, channel) => {
    const originalDescriptor = PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTOR(stream, "write");
    const hash = crypto.createHash("sha256");
    const updateHash = hash.update.bind(hash);
    const digestHash = hash.digest.bind(hash);
    let writeCount = 0;
    let byteCount = 0;
    const interceptedWrite = function interceptedCallbackStreamWrite(chunk, encoding, callback) {
      let completion = callback;
      let selectedEncoding = encoding;
      if (typeof encoding === "function") {
        completion = encoding;
        selectedEncoding = undefined;
      }
      let bytes;
      try {
        if (typeof chunk === "string") {
          bytes = PRIMORDIAL_BUFFER_FROM(chunk, typeof selectedEncoding === "string" ? selectedEncoding : "utf8");
        } else if (PRIMORDIAL_BUFFER_IS_BUFFER(chunk)) {
          bytes = chunk;
        } else if (PRIMORDIAL_ARRAY_BUFFER_IS_VIEW(chunk)) {
          bytes = PRIMORDIAL_BUFFER_FROM(chunk.buffer, chunk.byteOffset, chunk.byteLength);
        } else {
          bytes = PRIMORDIAL_BUFFER_FROM("P0_CALLBACK_INVALID_STREAM_CHUNK", "utf8");
        }
      } catch {
        bytes = PRIMORDIAL_BUFFER_FROM("P0_CALLBACK_INVALID_STREAM_ENCODING", "utf8");
      }
      writeCount += 1;
      byteCount += bytes.length;
      // Preserve a non-empty digest even for an attempted zero-byte write.
      updateHash(bytes.length === 0 ? PRIMORDIAL_BUFFER_FROM([0]) : bytes);
      if (typeof completion === "function") PRIMORDIAL_QUEUE_MICROTASK(() => completion());
      return true;
    };
    PRIMORDIAL_OBJECT_DEFINE_PROPERTY(stream, "write", {
      configurable: true,
      enumerable: originalDescriptor?.enumerable ?? false,
      value: interceptedWrite,
      writable: true,
    });
    return {
      channel,
      stream,
      originalDescriptor,
      interceptedWrite,
      writeCount: () => writeCount,
      byteCount: () => byteCount,
      digest: () => `sha256:${digestHash("hex")}`,
    };
  };

  const captures = [];
  try {
    captures.push(install(PRIMORDIAL_STDOUT, "stdout"));
    captures.push(install(PRIMORDIAL_STDERR, "stderr"));
  } catch (error) {
    for (const capture of captures) {
      try {
        if (capture.originalDescriptor === undefined) {
          PRIMORDIAL_REFLECT_DELETE_PROPERTY(capture.stream, "write");
        } else {
          PRIMORDIAL_OBJECT_DEFINE_PROPERTY(capture.stream, "write", capture.originalDescriptor);
        }
      } catch {
        // The caller treats installation failure as fail-closed before action.
      }
    }
    throw error;
  }
  let finished = false;
  return () => {
    if (finished) throw new Error("callback stream capture already finished");
    finished = true;
    let tampered = false;
    let restored = true;
    for (const capture of captures) {
      try {
        const current = PRIMORDIAL_OBJECT_GET_OWN_PROPERTY_DESCRIPTOR(capture.stream, "write");
        if (current?.value !== capture.interceptedWrite) tampered = true;
        if (capture.originalDescriptor === undefined) {
          if (!PRIMORDIAL_REFLECT_DELETE_PROPERTY(capture.stream, "write")) restored = false;
        } else {
          PRIMORDIAL_OBJECT_DEFINE_PROPERTY(capture.stream, "write", capture.originalDescriptor);
        }
      } catch {
        restored = false;
      }
    }
    const stdout = captures[0];
    const stderr = captures[1];
    return PRIMORDIAL_OBJECT_FREEZE({
      stdoutSha256: stdout.digest(),
      stderrSha256: stderr.digest(),
      stdoutWriteCount: stdout.writeCount(),
      stderrWriteCount: stderr.writeCount(),
      stdoutByteCount: stdout.byteCount(),
      stderrByteCount: stderr.byteCount(),
      rawStreamAttempted: stdout.writeCount() + stderr.writeCount() > 0,
      streamBindingTampered: tampered,
      streamsRestored: restored,
    });
  };
}

function validateModuleEntry(entry, definition) {
  if (!hasExactKeys(entry, MODULE_ENTRY_KEYS)
    || entry.moduleId !== definition.moduleId
    || !MODULE_ID.test(entry.moduleId)
    || !RELATIVE_MODULE_PATH.test(entry.moduleRelativePath)
    || !RECEIPT_DIGEST.test(entry.moduleSha256 ?? "")
    || !["100644", "100755"].includes(entry.gitMode)
    || entry.moduleRelativePath.includes("..")
    || entry.moduleRelativePath.includes("//")
    || entry.argumentSets === null
    || typeof entry.argumentSets !== "object"
    || Array.isArray(entry.argumentSets)
    || Object.getPrototypeOf(entry.argumentSets) !== Object.prototype) {
    return false;
  }
  const args = entry.argumentSets[definition.argumentSetId];
  return Array.isArray(args)
    && args.every((arg) => typeof arg === "string" && /^[A-Za-z0-9._:=/-]{1,160}$/.test(arg)
      && !arg.includes("..") && !arg.startsWith("/"));
}

const SPK_SCANNER_FORBIDDEN_IDENTIFIERS = Object.freeze(new Set([
  "AsyncFunction", "Bun", "Deno", "EventSource", "Function", "GeneratorFunction",
  "Proxy", "Reflect", "SharedWorker", "WebAssembly", "WebSocket", "Worker",
  "XMLHttpRequest", "__proto__", "constructor", "createRequire", "eval", "fetch",
  "getBuiltinModule", "global", "globalThis", "import", "module", "navigator",
  "require", "super", "this",
]));
const SPK_SCANNER_FORBIDDEN_STATIC_STRINGS = Object.freeze(new Set([
  "AsyncFunction", "Function", "GeneratorFunction", "__proto__", "constructor",
  "createRequire", "eval", "getBuiltinModule", "global", "globalThis", "process",
  "require", "appendFile", "chmod", "chown", "close", "copyFile",
  "createReadStream", "createWriteStream", "existsSync", "fstat", "lstat", "mkdir",
  "open", "opendir", "read", "readdir", "readFile", "readFileSync", "readlink",
  "realpath", "rename", "rm", "rmdir", "stat", "symlink", "truncate", "unlink",
  "watch", "write", "writeFile",
]));
const SPK_SCANNER_FORBIDDEN_CALL_IDENTIFIERS = Object.freeze(new Set([
  "access", "appendFile", "chmod", "chown", "close", "copyFile", "createReadStream",
  "createWriteStream", "existsSync", "fstat", "lstat", "mkdir", "open", "opendir",
  "read", "readdir", "readFile", "readFileSync", "readlink", "realpath", "rename",
  "rm", "rmdir", "stat", "symlink", "truncate", "unlink", "watch", "write",
  "writeFile", "net", "tls", "dns", "http", "https", "http2", "dgram", "quic",
  "socket",
]));
const SPK_SCANNER_OBJECT_MEMBERS = Object.freeze(new Set([
  "entries", "freeze", "fromEntries", "getPrototypeOf", "hasOwn", "isFrozen",
  "keys", "prototype", "values",
]));
const SPK_SCANNER_DYNAMIC_MEMBER_ALLOWLIST = Object.freeze(new Set([
  "CONTRACT_MODEL_COMPONENTS:contractId",
  "FROZEN_COMPONENT_OBSERVATION_DIGESTS:name",
  "REQUIREMENT_COMPONENTS:requirementId",
  "SCENARIO_COMPONENTS:scenarioId",
  "base:index",
  "bindings:key",
  "callbackReceipts:idempotencyKey",
  "candidateOwnedState:key",
  "childResultBytes:childResultBytes.length-1",
  "componentResults:name",
  "dependencyStates:dependencyId",
  "durableRecords:request.idempotencyKey",
  "expectedPlaintexts:index",
  "terminalFailures:request.idempotencyKey",
  "value:key",
  "vector:index",
]));
const SPK_SCANNER_NON_MEMBER_PREFIXES = Object.freeze(new Set([
  "await", "case", "const", "delete", "else", "for", "if", "in", "let",
  "new", "of", "return", "switch", "throw", "typeof", "var", "void",
  "while", "yield",
]));
const SPK_SCANNER_PUNCTUATORS = Object.freeze([
  ">>>=", "===", "!==", "**=", "&&=", "||=", "??=", ">>>", "<<=", ">>=",
  "=>", "==", "!=", "<=", ">=", "++", "--", "**", "&&", "||", "??", "?.",
  "<<", ">>", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "...",
]);

function tokenizeSpkJavaScript(text) {
  const tokens = [];
  let index = 0;
  const push = (type, value) => tokens.push({ type, value });
  const previous = () => tokens.at(-1) ?? null;
  const regexCanStart = () => {
    const token = previous();
    if (token === null) return true;
    if (token.type === "identifier") {
      return new Set([
        "await", "case", "delete", "do", "else", "in", "instanceof", "new",
        "of", "return", "throw", "typeof", "void", "yield",
      ]).has(token.value);
    }
    return token.type === "punctuator" && new Set([
      "(", "{", "[", ",", ";", ":", "=", "!", "?", "=>", "==", "===",
      "!=", "!==", "&&", "||", "??", "+", "-", "*", "%", "&", "|", "^",
      "~", "<", ">", "<=", ">=",
    ]).has(token.value);
  };
  const escapeValue = () => {
    if (index >= text.length) return null;
    const escaped = text[index++];
    const simple = {
      "0": "\0", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t", v: "\v",
      "\\": "\\", "'": "'", '"': '"', "`": "`",
    };
    if (Object.hasOwn(simple, escaped)) return simple[escaped];
    if (escaped === "x") {
      const hex = text.slice(index, index + 2);
      if (!/^[0-9a-fA-F]{2}$/.test(hex)) return null;
      index += 2;
      return String.fromCharCode(Number.parseInt(hex, 16));
    }
    if (escaped === "\n") return "";
    if (escaped === "\r") {
      if (text[index] === "\n") index += 1;
      return "";
    }
    return escaped;
  };
  const scanQuoted = (quote) => {
    index += 1;
    let value = "";
    while (index < text.length) {
      const char = text[index++];
      if (char === quote) {
        push("string", value);
        return true;
      }
      if (char === "\n" || char === "\r") return false;
      if (char === "\\") {
        const escaped = escapeValue();
        if (escaped === null) return false;
        value += escaped;
      } else {
        value += char;
      }
    }
    return false;
  };
  const scanRegex = () => {
    index += 1;
    let inClass = false;
    while (index < text.length) {
      const char = text[index++];
      if (char === "\n" || char === "\r") return false;
      if (char === "\\") {
        if (index >= text.length) return false;
        index += 1;
        continue;
      }
      if (char === "[") inClass = true;
      else if (char === "]") inClass = false;
      else if (char === "/" && !inClass) {
        while (/[A-Za-z]/.test(text[index] ?? "")) index += 1;
        push("regex", "/");
        return true;
      }
    }
    return false;
  };
  const scanCode = (templateExpression = false) => {
    let templateBraceDepth = 0;
    while (index < text.length) {
      const char = text[index];
      if (/\s/u.test(char)) {
        index += 1;
        continue;
      }
      if (char === "/" && text[index + 1] === "/") {
        index += 2;
        while (index < text.length && !["\n", "\r"].includes(text[index])) index += 1;
        continue;
      }
      if (char === "/" && text[index + 1] === "*") {
        const end = text.indexOf("*/", index + 2);
        if (end < 0) return false;
        index = end + 2;
        continue;
      }
      if (templateExpression && char === "}" && templateBraceDepth === 0) {
        index += 1;
        return true;
      }
      if (char === "'" || char === '"') {
        if (!scanQuoted(char)) return false;
        continue;
      }
      if (char === "`") {
        index += 1;
        let value = "";
        let interpolated = false;
        while (index < text.length) {
          const templateChar = text[index++];
          if (templateChar === "\\") {
            const escaped = escapeValue();
            if (escaped === null) return false;
            value += escaped;
          } else if (templateChar === "`") {
            push(interpolated ? "template" : "string", value);
            break;
          } else if (templateChar === "$" && text[index] === "{") {
            interpolated = true;
            index += 1;
            push("template", value);
            value = "";
            if (!scanCode(true)) return false;
          } else {
            value += templateChar;
          }
        }
        if (text[index - 1] !== "`") return false;
        continue;
      }
      if (/[A-Za-z_$]/.test(char)) {
        const start = index++;
        while (/[A-Za-z0-9_$]/.test(text[index] ?? "")) index += 1;
        push("identifier", text.slice(start, index));
        continue;
      }
      if (/[0-9]/.test(char) || char === "." && /[0-9]/.test(text[index + 1] ?? "")) {
        const match = /^(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|(?:[0-9][0-9_]*\.?[0-9_]*|\.[0-9][0-9_]*)(?:[eE][+-]?[0-9][0-9_]*)?n?)/u
          .exec(text.slice(index));
        if (!match) return false;
        index += match[0].length;
        push("number", match[0]);
        continue;
      }
      if (char === "/" && regexCanStart()) {
        if (!scanRegex()) return false;
        continue;
      }
      const punctuator = SPK_SCANNER_PUNCTUATORS.find((candidate) => (
        text.startsWith(candidate, index)
      ));
      if (punctuator) {
        index += punctuator.length;
        push("punctuator", punctuator);
        continue;
      }
      if ("(){}[];:,.?~+-*/%<>=!&|^".includes(char)) {
        index += 1;
        if (templateExpression && char === "{") templateBraceDepth += 1;
        if (templateExpression && char === "}") templateBraceDepth -= 1;
        push("punctuator", char);
        continue;
      }
      return false;
    }
    return !templateExpression;
  };
  return scanCode() ? tokens : null;
}

function staticSpkString(tokens, start, end) {
  if (start >= end || tokens[start]?.type !== "string") return null;
  let value = tokens[start].value;
  for (let index = start + 1; index < end; index += 2) {
    if (tokens[index]?.value !== "+" || tokens[index + 1]?.type !== "string") return null;
    value += tokens[index + 1].value;
  }
  return value;
}

function staticSpkStringExpression(tokens, start, end, bindings, depth = 0) {
  if (depth > 32 || start >= end) return null;
  while (tokens[start]?.value === "(" && tokens[end - 1]?.value === ")") {
    let balance = 0;
    let closesAtEnd = false;
    for (let index = start; index < end; index += 1) {
      if (tokens[index].value === "(") balance += 1;
      if (tokens[index].value === ")") balance -= 1;
      if (balance === 0) {
        closesAtEnd = index === end - 1;
        break;
      }
    }
    if (!closesAtEnd) break;
    start += 1;
    end -= 1;
  }
  if (end === start + 1) {
    if (tokens[start].type === "string") return tokens[start].value;
    if (tokens[start].type === "identifier" && bindings.has(tokens[start].value)) {
      return bindings.get(tokens[start].value);
    }
    return null;
  }
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;
  const pluses = [];
  for (let index = start; index < end; index += 1) {
    const value = tokens[index].value;
    if (value === "(") parenDepth += 1;
    else if (value === ")") parenDepth -= 1;
    else if (value === "[") bracketDepth += 1;
    else if (value === "]") bracketDepth -= 1;
    else if (value === "{") braceDepth += 1;
    else if (value === "}") braceDepth -= 1;
    else if (value === "+" && parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
      pluses.push(index);
    }
    if (parenDepth < 0 || bracketDepth < 0 || braceDepth < 0) return null;
  }
  if (parenDepth !== 0 || bracketDepth !== 0 || braceDepth !== 0) return null;
  if (pluses.length > 0) {
    const parts = [];
    let partStart = start;
    for (const plus of pluses) {
      const part = staticSpkStringExpression(tokens, partStart, plus, bindings, depth + 1);
      if (part === null) return null;
      parts.push(part);
      partStart = plus + 1;
    }
    const finalPart = staticSpkStringExpression(tokens, partStart, end, bindings, depth + 1);
    return finalPart === null ? null : parts.concat(finalPart).join("");
  }
  if (tokens[start]?.value !== "[") return null;
  let arrayDepth = 1;
  let close = start + 1;
  for (; close < end && arrayDepth > 0; close += 1) {
    if (tokens[close].value === "[") arrayDepth += 1;
    if (tokens[close].value === "]") arrayDepth -= 1;
  }
  if (arrayDepth !== 0
    || tokens[close]?.value !== "."
    || tokens[close + 1]?.value !== "join"
    || tokens[close + 2]?.value !== "("
    || tokens[end - 1]?.value !== ")") return null;
  const separator = staticSpkStringExpression(tokens, close + 3, end - 1, bindings, depth + 1);
  if (separator === null) return null;
  const parts = [];
  let partStart = start + 1;
  parenDepth = 0;
  bracketDepth = 0;
  braceDepth = 0;
  for (let index = partStart; index < close - 1; index += 1) {
    const value = tokens[index].value;
    if (value === "(") parenDepth += 1;
    else if (value === ")") parenDepth -= 1;
    else if (value === "[") bracketDepth += 1;
    else if (value === "]") bracketDepth -= 1;
    else if (value === "{") braceDepth += 1;
    else if (value === "}") braceDepth -= 1;
    else if (value === "," && parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
      const part = staticSpkStringExpression(tokens, partStart, index, bindings, depth + 1);
      if (part === null) return null;
      parts.push(part);
      partStart = index + 1;
    }
  }
  if (partStart < close - 1) {
    const part = staticSpkStringExpression(tokens, partStart, close - 1, bindings, depth + 1);
    if (part === null) return null;
    parts.push(part);
  } else if (parts.length === 0) {
    return "";
  }
  return parts.join(separator);
}

function spkStaticStringBindings(tokens) {
  const bindings = new Map();
  for (let index = 0; index < tokens.length - 3; index += 1) {
    if (!["const", "let", "var"].includes(tokens[index].value)
      || tokens[index + 1]?.type !== "identifier"
      || tokens[index + 2]?.value !== "=") continue;
    let end = index + 3;
    let parenDepth = 0;
    let bracketDepth = 0;
    let braceDepth = 0;
    for (; end < tokens.length; end += 1) {
      const value = tokens[end].value;
      if (value === "(" || value === "[" || value === "{") {
        if (value === "(") parenDepth += 1;
        if (value === "[") bracketDepth += 1;
        if (value === "{") braceDepth += 1;
      } else if (value === ")" || value === "]" || value === "}") {
        if (value === ")") parenDepth -= 1;
        if (value === "]") bracketDepth -= 1;
        if (value === "}") braceDepth -= 1;
      } else if (value === ";" && parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
        break;
      }
    }
    const value = staticSpkStringExpression(tokens, index + 3, end, bindings);
    if (value !== null) bindings.set(tokens[index + 1].value, value);
  }
  return bindings;
}

function spkFrozenSourceTokensMatchExpectedPolicy(tokens) {
  const staticBindings = spkStaticStringBindings(tokens);
  if ([...staticBindings.values()].some((value) => (
    SPK_SCANNER_FORBIDDEN_STATIC_STRINGS.has(value)
  ))) return false;
  const identifiers = tokens.filter((token) => token.type === "identifier");
  if (identifiers.some((token) => SPK_SCANNER_FORBIDDEN_IDENTIFIERS.has(token.value))) return false;
  for (const [index, token] of tokens.entries()) {
    if (token.type === "string" && SPK_SCANNER_FORBIDDEN_STATIC_STRINGS.has(token.value)) return false;
    if (token.type === "string") {
      let end = index + 1;
      while (tokens[end]?.value === "+" && tokens[end + 1]?.type === "string") end += 2;
      if (end > index + 1
        && SPK_SCANNER_FORBIDDEN_STATIC_STRINGS.has(staticSpkString(tokens, index, end))) return false;
    }
    if (token.value === "[") {
      let depth = 1;
      let end = index + 1;
      for (; end < tokens.length && depth > 0; end += 1) {
        if (tokens[end].value === "[") depth += 1;
        if (tokens[end].value === "]") depth -= 1;
      }
      if (depth !== 0) return false;
      const computed = staticSpkStringExpression(tokens, index + 1, end - 1, staticBindings);
      if (computed !== null && SPK_SCANNER_FORBIDDEN_STATIC_STRINGS.has(computed)) return false;
      const previous = tokens[index - 1];
      const isMemberAccess = previous !== undefined && (
        previous.type === "identifier" && !SPK_SCANNER_NON_MEMBER_PREFIXES.has(previous.value)
          || previous.type === "string"
          || previous.type === "number"
          || previous.value === ")"
          || previous.value === "]"
          || previous.value === "?."
      );
      if (isMemberAccess && computed === null) {
        if (end === index + 3 && tokens[index + 1]?.type === "number") continue;
        if (previous.value === ")" || previous.value === "]" || previous.value === "?.") return false;
        const expression = tokens.slice(index + 1, end - 1).map(({ value }) => value).join("");
        if (!SPK_SCANNER_DYNAMIC_MEMBER_ALLOWLIST.has(`${previous.value}:${expression}`)) return false;
      }
    }
    if (token.type === "identifier"
      && SPK_SCANNER_FORBIDDEN_CALL_IDENTIFIERS.has(token.value)
      && (tokens[index + 1]?.value === "(" || tokens[index + 1]?.value === "." || tokens[index + 1]?.value === "[")) {
      return false;
    }
    if (token.value === "Object") {
      if (tokens[index + 1]?.value === "["
        || tokens[index + 1]?.value === "."
          && !SPK_SCANNER_OBJECT_MEMBERS.has(tokens[index + 2]?.value)) return false;
    }
    if (token.value === "Array"
      && (tokens[index + 1]?.value !== "." || tokens[index + 2]?.value !== "isArray")) return false;
  }
  const processTokens = tokens.map((token, index) => ({ token, index }))
    .filter(({ token }) => token.type === "identifier" && token.value === "process");
  if (processTokens.length !== 2) return false;
  const processMembers = [];
  for (const { index } of processTokens) {
    if (tokens[index + 1]?.value !== "." || tokens[index + 2]?.type !== "identifier") return false;
    processMembers.push(tokens[index + 2].value);
  }
  if (canonicalJson(processMembers.sort()) !== canonicalJson(["argv", "exitCode"])) return false;
  const writes = tokens.map((token, index) => ({ token, index }))
    .filter(({ token }) => token.type === "identifier" && token.value === "writeFileSync");
  return writes.length === 1 && (() => {
    const index = writes[0].index;
    return tokens[index + 1]?.value === "("
      && tokens[index + 2]?.type === "number"
      && tokens[index + 2]?.value === "3"
      && tokens[index + 3]?.value === ","
      && tokens[index + 4]?.type === "identifier"
      && tokens[index + 4]?.value === "childResultBytes"
      && tokens[index + 5]?.value === ")"
      && tokens[index + 6]?.value === ";";
  })();
}

/** Non-authorizing consistency audit over the sole exact frozen source. */
function auditSpkSyntheticModuleSourcePolicy(source) {
  try {
    if (!(typeof source === "string" || Buffer.isBuffer(source))) return false;
    const bytes = Buffer.isBuffer(source) ? Buffer.from(source) : Buffer.from(source, "utf8");
    if (bytes.length !== 135_119
      || sha256(bytes) !== SPK_SYNTHETIC_MODULE_SHA256
      || !publicTextBytesAreSafe(bytes)) return false;
    const text = bytes.toString("utf8");
    const allowedImports = [
      "import { createCipheriv, createDecipheriv, createHash } from \"node:crypto\";",
      "import { writeFileSync } from \"node:fs\";",
    ];
    if (!text.startsWith(`${allowedImports.join("\n")}\n`)
      || text.normalize("NFC") !== text
      || /\\u(?:[0-9a-fA-F]{4}|\{[0-9a-fA-F]{1,6}\})/u.test(text)) return false;
    const afterImports = text.slice(allowedImports.join("\n").length + 1);
    const tokens = tokenizeSpkJavaScript(afterImports);
    return tokens !== null && spkFrozenSourceTokensMatchExpectedPolicy(tokens);
  } catch {
    return false;
  }
}

/** Sole exact-byte admission gate; token checks only cross-check that exact source. */
export function validateSpkSyntheticModuleSource(source) {
  try {
    if (!(typeof source === "string" || Buffer.isBuffer(source))) return false;
    const bytes = Buffer.isBuffer(source) ? Buffer.from(source) : Buffer.from(source, "utf8");
    return bytes.length === 135_119
      && sha256(bytes) === SPK_SYNTHETIC_MODULE_SHA256
      && auditSpkSyntheticModuleSourcePolicy(bytes);
  } catch {
    return false;
  }
}

async function resolveReviewedModule({ repoRoot, definition, moduleEntry }) {
  if (!validateModuleEntry(moduleEntry, definition)) return null;
  const modulePath = path.resolve(repoRoot, moduleEntry.moduleRelativePath);
  if (!isWithin(repoRoot, modulePath)) return null;
  let moduleStat;
  let resolvedModule;
  let moduleBytes;
  try {
    moduleStat = await lstat(modulePath);
    resolvedModule = await realpath(modulePath);
    moduleBytes = await readFile(modulePath);
    await access(modulePath, fsConstants.R_OK);
  } catch {
    return null;
  }
  const resolvedRoot = await realpath(repoRoot);
  const expectedResolvedModule = path.resolve(resolvedRoot, moduleEntry.moduleRelativePath);
  if (!moduleStat.isFile()
    || moduleStat.isSymbolicLink()
    || resolvedModule !== expectedResolvedModule
    || !isWithin(resolvedRoot, resolvedModule)
    || sha256(moduleBytes) !== moduleEntry.moduleSha256
    || (definition.moduleId === SPK_SYNTHETIC_MODULE_ID
      && !validateSpkSyntheticModuleSource(moduleBytes))
    || (moduleStat.mode & 0o111 ? "100755" : "100644") !== moduleEntry.gitMode) return null;
  return Object.freeze({
    modulePath,
    moduleBytes,
    moduleSha256: moduleEntry.moduleSha256,
    gitMode: moduleEntry.gitMode,
    args: Object.freeze([...moduleEntry.argumentSets[definition.argumentSetId]]),
  });
}

async function appendEvent(eventDir, sequence, event) {
  const eventName = `${String(sequence).padStart(4, "0")}-${event.state}.json`;
  if (!EVENT_FILE.test(eventName)) throw new Error("event state invalid");
  const existingNames = (await readdir(eventDir)).filter((name) => EVENT_FILE.test(name)).sort();
  if (sequence !== existingNames.length + 1) throw new Error("event sequence invalid");
  let previousEventSha256 = null;
  if (existingNames.length > 0) {
    const previousBytes = await readFile(path.join(eventDir, existingNames.at(-1)));
    const previous = JSON.parse(previousBytes.toString("utf8"));
    previousEventSha256 = previous.eventSha256;
    if (!RECEIPT_DIGEST.test(previousEventSha256 ?? "")) throw new Error("prior event digest invalid");
  }
  const eventPayload = { ...event, previousEventSha256 };
  const eventEnvelope = {
    ...eventPayload,
    eventSha256: sha256(canonicalJson(eventPayload)),
  };
  const eventPath = path.join(eventDir, eventName);
  const handle = await open(eventPath, "wx", 0o600);
  try {
    await handle.writeFile(`${canonicalJson(eventEnvelope)}\n`, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
  // The event is not durable until its directory entry is durable too.
  await syncDirectory(eventDir);
  return eventPath;
}

async function readEvents(eventDir) {
  let names;
  try {
    names = await readdir(eventDir);
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  const sorted = names.filter((name) => EVENT_FILE.test(name)).sort();
  const events = [];
  let previousEventSha256 = null;
  for (const [index, name] of sorted.entries()) {
    if (!name.startsWith(`${String(index + 1).padStart(4, "0")}-`)) throw new Error("event sequence invalid");
    const bytes = await readFile(path.join(eventDir, name));
    if (bytes.length === 0 || bytes.length > MAX_CHILD_RESULT_BYTES || !publicTextBytesAreSafe(bytes)) {
      throw new Error("event bytes invalid");
    }
    const parsed = parseJsonWithoutDuplicateKeys(bytes.toString("utf8"), `stage-event:${name}`);
    const { eventSha256, ...payload } = parsed;
    if (!RECEIPT_DIGEST.test(eventSha256 ?? "")
      || payload.previousEventSha256 !== previousEventSha256
      || eventSha256 !== sha256(canonicalJson(payload))) {
      throw new Error("event hash chain invalid");
    }
    events.push(parsed);
    previousEventSha256 = eventSha256;
  }
  return events;
}

async function proveReadableEventTailDurable({
  eventDir,
  events,
  syncEventFile,
  syncEventDirectory,
}) {
  const lastObserved = events.at(-1);
  if (!lastObserved) throw new Error("post-action journal tail missing");
  const eventNames = (await readdir(eventDir)).filter((name) => EVENT_FILE.test(name)).sort();
  const tailName = eventNames.at(-1);
  const expectedTailName = `${String(events.length).padStart(4, "0")}-${lastObserved.state}.json`;
  if (eventNames.length !== events.length || tailName !== expectedTailName) {
    throw new Error("post-action journal tail identity not proven");
  }
  const tailPath = path.join(eventDir, tailName);
  const syncedTailIdentity = await syncEventFile(tailPath);
  const revalidatedEvents = await readEvents(eventDir);
  const revalidatedLast = revalidatedEvents.at(-1);
  const tailAfterRead = await lstat(tailPath);
  if (revalidatedEvents.length !== events.length
    || revalidatedLast?.eventSha256 !== lastObserved.eventSha256
    || revalidatedLast?.state !== lastObserved.state
    || !tailAfterRead.isFile()
    || tailAfterRead.isSymbolicLink()
    || tailAfterRead.dev !== syncedTailIdentity?.dev
    || tailAfterRead.ino !== syncedTailIdentity?.ino) {
    throw new Error("post-action journal durability not proven");
  }
  await syncEventDirectory(eventDir);
  return revalidatedLast;
}

function terminalEvent(events) {
  return [...events].reverse().find((event) => TERMINAL_STAGE_STATES.includes(event?.state)) ?? null;
}

async function predecessorReceiptExists(runtimeRoot, definition) {
  if (definition.predecessor === null) return true;
  let entries;
  try {
    entries = await readdir(runtimeRoot, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
  let matches = 0;
  for (const entry of entries) {
    if (!entry.isDirectory() || !/^[0-9a-f]{64}$/.test(entry.name)) continue;
    const events = await readEvents(path.join(runtimeRoot, entry.name, "events"));
    const receipt = terminalEvent(events)?.receipt;
    if (!receipt || receipt.taskId !== definition.taskId
      || receipt.stageId !== definition.predecessor.stageId
      || receipt.state !== "verified-complete") continue;
    if (sha256(canonicalJson(receipt)) === definition.predecessor.receiptDigest) matches += 1;
  }
  return matches === 1;
}

function processTreeAlive(child) {
  if (!child || !Number.isInteger(child.pid) || child.pid <= 0) return false;
  try {
    if (process.platform === "win32") return child.exitCode === null && child.signalCode === null;
    process.kill(-child.pid, 0);
    return true;
  } catch (error) {
    return error?.code !== "ESRCH";
  }
}

async function terminateProcessTree(child, graceMs = TERMINATION_GRACE_MS) {
  if (!child || !Number.isInteger(child.pid) || child.pid <= 0) return true;
  const killGroup = (signal) => {
    try {
      if (process.platform === "win32") child.kill(signal);
      else process.kill(-child.pid, signal);
    } catch (error) {
      if (error?.code !== "ESRCH") throw error;
    }
  };
  killGroup("SIGTERM");
  await new Promise((resolve) => setTimeout(resolve, graceMs));
  if (processTreeAlive(child)) {
    killGroup("SIGKILL");
    await new Promise((resolve) => setTimeout(resolve, graceMs));
  }
  return !processTreeAlive(child);
}

function validateLockRecord(lockRecord, expected) {
  return hasExactKeys(lockRecord, LOCK_RECORD_KEYS)
    && lockRecord.schemaVersion === expected.schemaVersion
    && lockRecord.runtimeKey === expected.runtimeKey
    && lockRecord.taskId === expected.taskId
    && lockRecord.stageId === expected.stageId
    && lockRecord.sourceRevision === expected.sourceRevision
    && lockRecord.stageBindingDigest === expected.stageBindingDigest
    && typeof lockRecord.ownerNonce === "string"
    && /^[0-9a-f]{64}$/.test(lockRecord.ownerNonce)
    && Number.isSafeInteger(lockRecord.supervisorPid)
    && typeof lockRecord.supervisorStartIdentity === "string"
    && (lockRecord.childPid === null || Number.isSafeInteger(lockRecord.childPid))
    && (lockRecord.childStartIdentity === null || typeof lockRecord.childStartIdentity === "string")
    && (lockRecord.childProcessGroupId === null || Number.isSafeInteger(lockRecord.childProcessGroupId))
    && (lockRecord.pendingReceiptSha256 === null || RECEIPT_DIGEST.test(lockRecord.pendingReceiptSha256 ?? ""))
    && (lockRecord.childPid === null
      ? lockRecord.childStartIdentity === null && lockRecord.childProcessGroupId === null
      : lockRecord.childPid > 0
        && lockRecord.childProcessGroupId === lockRecord.childPid
        && typeof lockRecord.childStartIdentity === "string"
        && lockRecord.childStartIdentity.length > 0)
    && Number.isFinite(Date.parse(lockRecord.heartbeatAt ?? ""));
}

async function readLockRecord(lockPath) {
  try {
    const bytes = await readFile(lockPath);
    if (bytes.length > 16 * 1024 || !publicTextBytesAreSafe(bytes)) return null;
    return parseJsonWithoutDuplicateKeys(bytes.toString("utf8"), "stage-runtime-lock");
  } catch {
    return null;
  }
}

function validateRecoveryReview(review, lockRecord, expected) {
  if (!hasExactKeys(review, RECOVERY_REVIEW_KEYS)
    || review.schemaVersion !== expected.schemaVersion
    || review.decision !== "recover-stale-stage-lock"
    || review.taskId !== expected.taskId
    || review.stageId !== expected.stageId
    || review.sourceRevision !== expected.sourceRevision
    || review.stageBindingDigest !== expected.stageBindingDigest
    || review.ownerNonce !== lockRecord.ownerNonce) return false;
  const expectedOwnerClaimDigest = sha256(canonicalJson(lockRecord));
  const { recoveryReviewDigest, ...reviewedClaim } = review;
  return review.ownerClaimDigest === expectedOwnerClaimDigest
    && recoveryReviewDigest === sha256(canonicalJson(reviewedClaim));
}

async function reconcileStaleLock(lockPath, expected, recoveryReview) {
  const lockRecord = await readLockRecord(lockPath);
  if (!validateLockRecord(lockRecord, expected)
    || !validateRecoveryReview(recoveryReview, lockRecord, expected)) return false;
  if (lockRecord.pendingReceiptSha256 !== null) {
    let events;
    try {
      events = await readEvents(expected.eventDir);
    } catch {
      return false;
    }
    const pendingMatches = events.filter((event) => event.state === "verification-pending"
      && event.receipt
      && sha256(canonicalJson(event.receipt)) === lockRecord.pendingReceiptSha256);
    if (pendingMatches.length !== 1) return false;
  }
  if (processIdentityMatches(lockRecord.supervisorPid, lockRecord.supervisorStartIdentity)) return false;
  if (lockRecord.childPid !== null) {
    if (processIdentityMatches(lockRecord.childPid, lockRecord.childStartIdentity)) {
      const child = { pid: lockRecord.childPid };
      if (!await terminateProcessTree(child)) return false;
    } else if (processTreeAlive({ pid: lockRecord.childProcessGroupId })) {
      // A surviving group without its exact leader identity cannot be killed
      // safely because the numeric ID may have been reused.
      return false;
    }
  }
  const claimPath = `${lockPath}.reconciled-${lockRecord.ownerNonce}`;
  try {
    await rename(lockPath, claimPath);
    await syncDirectory(path.dirname(lockPath));
  } catch {
    return false;
  }
  const claimed = await readLockRecord(claimPath);
  return claimed?.ownerNonce === lockRecord.ownerNonce
    && canonicalJson(claimed) === canonicalJson(lockRecord);
}

async function acquireOwnedLock(lockPath, expected) {
  try {
    return await open(lockPath, "wx", 0o600);
  } catch {
    return null;
  }
}

async function releaseOwnedLock(lockHandle, lockPath, ownerNonce) {
  try {
    const [handleStat, pathStat, lockRecord] = await Promise.all([
      lockHandle.stat(),
      lstat(lockPath),
      readLockRecord(lockPath),
    ]);
    if (handleStat.dev !== pathStat.dev || handleStat.ino !== pathStat.ino || lockRecord?.ownerNonce !== ownerNonce) {
      return false;
    }
    await rm(lockPath, { force: false });
    await syncDirectory(path.dirname(lockPath));
    return true;
  } catch {
    return false;
  }
}

async function releaseOwnedEmptyLock(lockHandle, lockPath) {
  try {
    const [handleStat, pathStat] = await Promise.all([lockHandle.stat(), lstat(lockPath)]);
    if (handleStat.dev !== pathStat.dev || handleStat.ino !== pathStat.ino || handleStat.size !== 0) return false;
    await rm(lockPath, { force: false });
    await syncDirectory(path.dirname(lockPath));
    return true;
  } catch {
    return false;
  }
}

async function readChildResult(resultPath, expected) {
  try {
    const resultStat = await lstat(resultPath);
    if (!resultStat.isFile() || resultStat.isSymbolicLink() || resultStat.size <= 0
      || resultStat.size > MAX_CHILD_RESULT_BYTES) return null;
    const bytes = await readFile(resultPath);
    if (!publicTextBytesAreSafe(bytes)) return null;
    const parsed = parseJsonWithoutDuplicateKeys(bytes.toString("utf8"), "stage-child-result");
    if (!hasExactKeys(parsed, CHILD_RESULT_KEYS)
      || parsed.schemaVersion !== "1.0.0"
      || parsed.outcome !== "succeeded"
      || parsed.taskId !== expected.taskId
      || parsed.stageId !== expected.stageId
      || parsed.idempotencyKey !== expected.idempotencyKey
      || parsed.sourceRevision !== expected.sourceRevision
      || parsed.stageBindingDigest !== expected.stageBindingDigest
      || !RECEIPT_DIGEST.test(parsed.evidenceDigest ?? "")) return null;
    return { value: parsed, digest: sha256(bytes) };
  } catch {
    return null;
  }
}

function validateOutcomeVerification(value, expected) {
  if (!hasExactKeys(value, OUTCOME_VERIFICATION_KEYS)
    || value.schemaVersion !== "1.0.0"
    || value.outcome !== "pass"
    || value.boundary !== expected.boundary
    || value.taskId !== expected.taskId
    || value.stageId !== expected.stageId
    || value.sourceRevision !== expected.sourceRevision
    || value.stageBindingDigest !== expected.stageBindingDigest
    || value.moduleSha256 !== expected.moduleSha256
    || value.childResultSha256 !== expected.childResultSha256
    || value.evidenceDigest !== expected.evidenceDigest
    || !RECEIPT_DIGEST.test(value.observationDigest ?? "")) return null;
  return Object.freeze({ value, digest: sha256(canonicalJson(value)) });
}

async function verifyReviewedStageOutcome(request) {
  const verifier = PRODUCTION_OUTCOME_VERIFICATION_ALLOWLIST[request?.moduleId];
  if (typeof verifier !== "function") return null;
  try {
    return await verifier(Object.freeze({ ...request }));
  } catch {
    return null;
  }
}

function closedReceipt({ definition, authorization, state, attempt, evidence = {} }) {
  return Object.freeze({
    schemaVersion: definition.schemaVersion,
    taskId: definition.taskId,
    scopeClass: definition.scopeClass,
    actionClass: definition.actionClass,
    stageId: definition.stageId,
    idempotencyKey: definition.idempotencyKey,
    sourceRevision: authorization.sourceRevision,
    gateKind: authorization.gateKind,
    authorityDeadline: authorization.deadlineAt,
    rollbackSnapshotReference: authorization.rollbackSnapshotReference,
    stageBindingDigest: stageBindingDigest(definition),
    predecessorReceiptSha256: definition.predecessor?.receiptDigest ?? null,
    preparationReviewId: authorization.preparationReviewId,
    preparationReviewSha256: authorization.preparationReviewSha256,
    candidateRevision: authorization.candidateRevision,
    dossierDigest: authorization.dossierDigest,
    stageApprovalSha256: authorization.stageApprovalSha256,
    registrySha256: authorization.registrySha256,
    gateSourceFingerprint: authorization.gateSourceFingerprint,
    moduleSha256: evidence.moduleSha256 ?? null,
    childResultSha256: evidence.childResultSha256 ?? null,
    evidenceDigest: evidence.evidenceDigest ?? null,
    stdoutSha256: evidence.stdoutSha256 ?? null,
    stderrSha256: evidence.stderrSha256 ?? null,
    immediateVerificationSha256: evidence.immediateVerificationSha256 ?? null,
    immediateVerificationResult: evidence.immediateVerificationResult ?? null,
    quiescent1VerificationSha256: evidence.quiescent1VerificationSha256 ?? null,
    quiescent1VerificationResult: evidence.quiescent1VerificationResult ?? null,
    quiescent2VerificationSha256: evidence.quiescent2VerificationSha256 ?? null,
    quiescent2VerificationResult: evidence.quiescent2VerificationResult ?? null,
    state,
    attempt,
  });
}

function historicalBindingFromAuthorization(authorization) {
  return {
    taskId: authorization.taskId,
    stageId: authorization.stageId,
    scopeClass: authorization.scopeClass,
    actionClass: authorization.actionClass,
    idempotencyKey: authorization.idempotencyKey,
    predecessorReceiptSha256: authorization.predecessorReceiptSha256,
    preparationReviewId: authorization.preparationReviewId,
    preparationReviewSha256: authorization.preparationReviewSha256,
    candidateRevision: authorization.candidateRevision,
    dossierDigest: authorization.dossierDigest,
    stageApprovalSha256: authorization.stageApprovalSha256,
    stageDefinitionSha256: authorization.stageDefinitionSha256,
    moduleSha256: authorization.moduleSha256,
    gateKind: authorization.gateKind,
    rollbackSnapshotReference: authorization.rollbackSnapshotReference,
  };
}

function validateTerminalHistory(history, request) {
  return hasExactKeys(history, TERMINAL_HISTORY_KEYS)
    && history.ok === true
    && history.scope === "stage-terminal-history"
    && history.code === "STAGE_TERMINAL_HISTORY_VALID"
    && history.taskId === request.taskId
    && history.stageId === request.stageId
    && history.scopeClass === request.scopeClass
    && history.actionClass === request.actionClass
    && history.idempotencyKey === request.idempotencyKey
    && history.predecessorReceiptSha256 === request.predecessorReceiptSha256
    && FULL_REVISION.test(history.sourceRevision ?? "")
    && FULL_REVISION.test(history.candidateRevision ?? "")
    && /^[0-9a-f]{64}$/.test(history.dossierDigest ?? "")
    && /^P0-PREP-[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(history.preparationReviewId ?? "")
    && /^[0-9a-f]{64}$/.test(history.preparationReviewSha256 ?? "")
    && ["execute", "accept"].includes(history.gateKind)
    && RECEIPT_DIGEST.test(history.stageDefinitionSha256 ?? "")
    && MODULE_ID.test(history.moduleId ?? "")
    && RECEIPT_DIGEST.test(history.moduleSha256 ?? "")
    && typeof history.rollbackSnapshotReference === "string"
    && publicTextBytesAreSafe(history.rollbackSnapshotReference)
    && /^[0-9a-f]{64}$/.test(history.stageApprovalSha256 ?? "")
    && /^[0-9a-f]{64}$/.test(history.registrySha256 ?? "");
}

function terminalPublicResult(receipt) {
  const alreadySucceeded = receipt.state === "verified-complete";
  return result(alreadySucceeded, alreadySucceeded ? "STAGE_ALREADY_SUCCEEDED" : "STAGE_ALREADY_TERMINAL", {
    taskId: receipt.taskId,
    stageId: receipt.stageId,
    gateKind: receipt.gateKind,
    scopeClass: receipt.scopeClass,
    actionClass: receipt.actionClass,
    sourceRevision: receipt.sourceRevision,
    dossierDigest: receipt.dossierDigest,
    predecessorReceiptDigest: receipt.predecessorReceiptSha256,
    idempotencyKey: receipt.idempotencyKey,
    authorityDeadline: receipt.authorityDeadline,
    authorityStatus: "historical-terminal",
    state: receipt.state,
    mutationStatement: alreadySucceeded
      ? "Mutation verified complete"
      : receipt.state === "verified-rolled-back"
        ? "Rollback verified complete"
        : "No mutation performed",
    rollbackSnapshotReference: receipt.rollbackSnapshotReference,
    immediateVerification: receipt.immediateVerificationResult === "pass" ? "pass" : "not-run",
    quiescentVerification: receipt.quiescent1VerificationResult === "pass"
      && receipt.quiescent2VerificationResult === "pass" ? "pass" : "not-run",
    receiptDigest: sha256(canonicalJson(receipt)),
    attempt: receipt.attempt,
    consequence: "Stage was already terminal; no second execution occurred.",
    nextAction: "Preserve the terminal receipt; no replay is permitted.",
  });
}

async function reconcileTerminalStage({
  request,
  runtimeRoot,
  verifyHistory = verifyStageTerminalHistoryAtExactMain,
}) {
  try {
    const runtimeMetadata = await lstat(runtimeRoot);
    if (!runtimeMetadata.isDirectory() || runtimeMetadata.isSymbolicLink()) {
      return result(false, "STAGE_RECEIPT_INVALID", { taskId: request.taskId, stageId: request.stageId });
    }
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    return result(false, "STAGE_RECEIPT_INVALID", { taskId: request.taskId, stageId: request.stageId });
  }
  const runtimeKey = safeRuntimeSegment(`${request.taskId}\0${request.stageId}\0${request.idempotencyKey}`);
  let events;
  try {
    events = await readEvents(path.join(runtimeRoot, runtimeKey, "events"));
  } catch {
    return result(false, "STAGE_RECEIPT_INVALID", { taskId: request.taskId, stageId: request.stageId });
  }
  const terminal = terminalEvent(events);
  if (!terminal) return null;
  let history;
  try {
    history = await verifyHistory(request);
  } catch {
    history = null;
  }
  if (!validateTerminalHistory(history, request)) {
    return result(false, "STAGE_TERMINAL_HISTORY_INVALID", { taskId: request.taskId, stageId: request.stageId });
  }
  const receiptValidation = validateHistoricalStageReceipt(
    terminal.receipt,
    historicalBindingFromAuthorization(history),
  );
  if (!receiptValidation.ok) {
    return result(false, "STAGE_RECEIPT_INVALID", { taskId: request.taskId, stageId: request.stageId });
  }
  return terminalPublicResult(terminal.receipt);
}

async function executeResolvedStage({
  definition,
  moduleEntry,
  repoRoot,
  runtimeRoot,
  authorize = verifyStageGateBAtExactMain,
  verifyOutcome = verifyReviewedStageOutcome,
  spawnProcess = spawn,
  clock = primordialClock,
  quiescenceIntervalMs = QUIESCENCE_INTERVAL_MS,
  appendJournalEvent = appendEvent,
  syncEventFile = syncRegularFile,
  syncEventDirectory = syncDirectory,
  childLockRecordPersistBarrier = async () => {},
}) {
  const definitionValidation = validateStagedActionDefinition(definition);
  if (!definitionValidation.ok) return result(false, definitionValidation.code);
  const request = bindingRequest(definition);
  let authorization;
  try {
    authorization = await authorize(request);
  } catch {
    authorization = null;
  }
  if (!validateAuthorization(authorization, request, definition)) {
    return result(false, "STAGE_GATE_B_DENIED", { taskId: definition.taskId, stageId: definition.stageId });
  }
  const reviewedModule = await resolveReviewedModule({ repoRoot, definition, moduleEntry });
  if (!reviewedModule || reviewedModule.moduleSha256 !== authorization.moduleSha256) {
    return result(false, "STAGE_MODULE_NOT_ALLOWLISTED", { taskId: definition.taskId, stageId: definition.stageId });
  }
  if (!await predecessorReceiptExists(runtimeRoot, definition)) {
    return result(false, "STAGE_PREDECESSOR_RECEIPT_MISSING", {
      taskId: definition.taskId,
      stageId: definition.stageId,
    });
  }

  const runtimeKey = safeRuntimeSegment(`${definition.taskId}\0${definition.stageId}\0${definition.idempotencyKey}`);
  const stageRoot = path.join(runtimeRoot, runtimeKey);
  const eventDir = path.join(stageRoot, "events");
  const rawDir = path.join(stageRoot, "raw-evidence");
  const lockDir = path.join(runtimeRoot, "locks");
  const lockPath = path.join(lockDir, `${runtimeKey}.lock`);
  // Create each level separately and fsync the directory that owns the new
  // entry. In particular, the Git common directory must durably contain the
  // first P0-stage-runtime entry before a reviewed external action can begin.
  await ensureDurableDirectory(runtimeRoot);
  await ensureDurableDirectory(stageRoot);
  await ensureDurableDirectory(eventDir);
  await ensureDurableDirectory(rawDir);
  await ensureDurableDirectory(lockDir);

  const expectedLock = {
    schemaVersion: definition.schemaVersion,
    runtimeKey,
    taskId: definition.taskId,
    stageId: definition.stageId,
    sourceRevision: authorization.sourceRevision,
    stageBindingDigest: definitionValidation.stageBindingDigest,
    eventDir,
  };
  const lockHandle = await acquireOwnedLock(lockPath, expectedLock);
  if (!lockHandle) {
    return result(false, "STAGE_LOCK_UNAVAILABLE", { taskId: definition.taskId, stageId: definition.stageId });
  }
  await syncDirectory(lockDir);

  let stdoutHandle;
  let stderrHandle;
  let childResultHandle;
  let retainLock = false;
  let child = null;
  let ownerNonce = null;
  let deadlineAt = Number.NaN;
  let deadlineHandle;
  let cancellationReason = null;
  let terminationPromise = null;
  let outcomePromise = null;
  let actionMayHaveStarted = false;
  let durableRecoveryOrTerminal = false;
  let provenEventCount = 0;
  let latestEvidence = {
    moduleSha256: reviewedModule.moduleSha256,
    childResultSha256: null,
    evidenceDigest: null,
    stdoutSha256: null,
    stderrSha256: null,
  };
  let latestVerification = {};
  try {
    const supervisorStartIdentity = processStartIdentity(process.pid);
    if (supervisorStartIdentity === null) {
      return result(false, "STAGE_SUPERVISOR_IDENTITY_UNAVAILABLE", {
        taskId: definition.taskId,
        stageId: definition.stageId,
      });
    }
    ownerNonce = crypto.randomBytes(32).toString("hex");
    const lockRecord = {
      schemaVersion: definition.schemaVersion,
      runtimeKey,
      taskId: definition.taskId,
      stageId: definition.stageId,
      sourceRevision: authorization.sourceRevision,
      stageBindingDigest: definitionValidation.stageBindingDigest,
      ownerNonce,
      supervisorPid: process.pid,
      supervisorStartIdentity,
      childPid: null,
      childStartIdentity: null,
      childProcessGroupId: null,
      pendingReceiptSha256: null,
      heartbeatAt: clock().toISOString(),
    };
    let childLockRecordBarrierUsed = false;
    const persistLockRecord = async () => {
      lockRecord.heartbeatAt = clock().toISOString();
      const bytes = Buffer.from(`${canonicalJson(lockRecord)}\n`, "utf8");
      await lockHandle.truncate(0);
      await lockHandle.write(bytes, 0, bytes.length, 0);
      if (lockRecord.childPid !== null && !childLockRecordBarrierUsed) {
        childLockRecordBarrierUsed = true;
        await childLockRecordPersistBarrier(Object.freeze({
          childPid: lockRecord.childPid,
          childStartIdentity: lockRecord.childStartIdentity,
          stageId: definition.stageId,
        }));
      }
      await lockHandle.sync();
    };
    await persistLockRecord();
    const existingEvents = await readEvents(eventDir);
    const existingTerminal = terminalEvent(existingEvents);
    if (existingTerminal) {
      const receipt = existingTerminal.receipt;
      const receiptValidation = validateHistoricalStageReceipt(
        receipt,
        historicalBindingFromAuthorization(authorization),
      );
      if (!receiptValidation.ok) return result(false, "STAGE_RECEIPT_INVALID", { taskId: definition.taskId, stageId: definition.stageId });
      return terminalPublicResult(receipt);
    }
    if (existingEvents.length > 0) {
      const recoveredReceipt = closedReceipt({
        definition,
        authorization,
        state: "recovery-required",
        attempt: 1,
      });
      await appendJournalEvent(eventDir, existingEvents.length + 1, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: clock().toISOString(),
        receipt: recoveredReceipt,
      });
      durableRecoveryOrTerminal = true;
      return publicOperatorResult({
        ok: false,
        code: "STAGE_RECOVERY_REQUIRED",
        definition,
        authorization,
        state: "recovery-required",
        receiptDigest: sha256(canonicalJson(recoveredReceipt)),
        attempt: 1,
        authorityStatus: "current",
        mutationStatement: "Mutation may have occurred",
        immediateVerification: "not-run",
        quiescentVerification: "not-run",
        consequence: "Stage state requires reviewed recovery before replay.",
        nextAction: "Perform reviewed recovery or rollback.",
      });
    }

    const stdoutPath = path.join(rawDir, "stdout.raw");
    const stderrPath = path.join(rawDir, "stderr.raw");
    const childResultPath = path.join(rawDir, "child-result.json");
    const executorPath = path.join(stageRoot, "executor.mjs");
    const launcherPath = path.join(stageRoot, "launcher.mjs");
    const executorHandle = await open(executorPath, "wx", reviewedModule.gitMode === "100755" ? 0o500 : 0o400);
    try {
      await executorHandle.writeFile(reviewedModule.moduleBytes);
      await executorHandle.sync();
    } finally {
      await executorHandle.close();
    }
    const launcherHandle = await open(launcherPath, "wx", 0o400);
    try {
      await launcherHandle.writeFile(TRUSTED_LAUNCHER_BYTES);
      await launcherHandle.sync();
    } finally {
      await launcherHandle.close();
    }
    stdoutHandle = await open(stdoutPath, "wx", 0o600);
    stderrHandle = await open(stderrPath, "wx", 0o600);
    childResultHandle = await open(childResultPath, "wx", 0o600);
    await syncDirectory(stageRoot);
    await syncDirectory(rawDir);

    const runningAt = clock();
    const initialDeadline = PRIMORDIAL_DATE_PARSE(authorization.deadlineAt);
    if (!Number.isFinite(initialDeadline)
      || initialDeadline <= PRIMORDIAL_DATE_GET_TIME(runningAt)) {
      return result(false, "STAGE_DEADLINE_INVALID", { taskId: definition.taskId, stageId: definition.stageId });
    }

    await appendJournalEvent(eventDir, 1, {
      schemaVersion: definition.schemaVersion,
      state: "running",
      occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(runningAt),
      processGroupId: null,
      sourceRevision: authorization.sourceRevision,
      stageBindingDigest: definitionValidation.stageBindingDigest,
      executorSha256: reviewedModule.moduleSha256,
    });
    provenEventCount = 1;
    const appendNoMutationTerminal = async ({ expired, occurredAt }) => {
      const terminalState = expired ? "expired-before-mutation" : "blocked-no-mutation";
      const terminalReceipt = closedReceipt({
        definition,
        authorization,
        state: terminalState,
        attempt: 1,
        evidence: { moduleSha256: reviewedModule.moduleSha256 },
      });
      const terminalValidation = validateStageReceipt(terminalReceipt, definition, authorization);
      if (!terminalValidation.ok) throw new Error(terminalValidation.code);
      await appendJournalEvent(eventDir, 2, {
        schemaVersion: definition.schemaVersion,
        state: terminalState,
        occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(occurredAt),
        receipt: terminalReceipt,
      });
      provenEventCount = 2;
      durableRecoveryOrTerminal = true;
      return result(false, expired ? "STAGE_EXPIRED_BEFORE_MUTATION" : "STAGE_BLOCKED_NO_MUTATION", {
        taskId: definition.taskId,
        stageId: definition.stageId,
        state: terminalState,
        receiptDigest: sha256(canonicalJson(terminalReceipt)),
      });
    };
    const bindingArgs = [
      `--p0-task-id=${definition.taskId}`,
      `--p0-stage-id=${definition.stageId}`,
      `--p0-idempotency-key=${definition.idempotencyKey}`,
      `--p0-source-revision=${authorization.sourceRevision}`,
      `--p0-stage-binding=${definitionValidation.stageBindingDigest}`,
    ];
    const resolvedLauncherPath = await realpath(launcherPath);
    const resolvedStageRoot = path.dirname(resolvedLauncherPath);

    // The durable running event is only intent. Re-fetch the predecessor and
    // exact-main Gate B after every awaited setup/journal operation, then take
    // the actual spawn time. No await or caller-controlled work is allowed
    // between this boundary and child creation.
    const predecessorStillCurrent = await predecessorReceiptExists(runtimeRoot, definition);
    let spawnAuthorization;
    try {
      spawnAuthorization = await authorize(request);
    } catch {
      spawnAuthorization = null;
    }
    const spawnAt = clock();
    const spawnAtMs = PRIMORDIAL_DATE_GET_TIME(spawnAt);
    const authorityDeadlines = [
      PRIMORDIAL_DATE_PARSE(authorization.deadlineAt),
      PRIMORDIAL_DATE_PARSE(spawnAuthorization?.deadlineAt ?? ""),
    ];
    const authorityExpired = authorityDeadlines.some((value) => Number.isFinite(value) && value <= spawnAtMs);
    const spawnAuthorizationValid = predecessorStillCurrent
      && validateAuthorization(spawnAuthorization, request, definition)
      && sameAuthorization(authorization, spawnAuthorization)
      && authorityDeadlines.every((value) => Number.isFinite(value) && value > spawnAtMs);
    deadlineAt = spawnAuthorizationValid
      ? Math.min(spawnAtMs + definition.deadlineMs, ...authorityDeadlines)
      : Number.NaN;
    if (!spawnAuthorizationValid || !Number.isFinite(deadlineAt) || deadlineAt <= spawnAtMs) {
      return await appendNoMutationTerminal({ expired: authorityExpired, occurredAt: spawnAt });
    }

    child = spawnProcess(process.execPath, [
      "--permission",
      `--allow-fs-read=${resolvedStageRoot}`,
      resolvedLauncherPath,
      ...reviewedModule.args,
      ...bindingArgs,
    ], {
      cwd: repoRoot,
      env: Object.freeze({ LANG: "C.UTF-8", LC_ALL: "C.UTF-8", NODE_ENV: "production" }),
      shell: false,
      detached: process.platform !== "win32",
      windowsHide: true,
      stdio: ["ignore", stdoutHandle.fd, stderrHandle.fd, childResultHandle.fd, "pipe"],
    });
    const requestCancellation = (reason) => {
      cancellationReason ??= reason;
      terminationPromise ??= terminateProcessTree(child);
    };
    // The child exists but the trusted launcher is still blocked on fd 4.
    // Observe settlement and arm cancellation before any await or identity/
    // lock-record work can consume the remaining authority window.
    outcomePromise = new Promise((resolve) => {
      child.once("error", () => resolve({ exitCode: null, signal: null, spawnFailed: true }));
      child.once("close", (exitCode, signal) => resolve({ exitCode, signal, spawnFailed: false }));
    });
    deadlineHandle = PRIMORDIAL_SET_TIMEOUT(
      () => requestCancellation("deadline-before-or-during-action"),
      Math.max(1, deadlineAt - PRIMORDIAL_DATE_NOW()),
    );
    const childStartIdentity = processStartIdentity(child.pid);
    if (childStartIdentity === null) {
      requestCancellation("child-identity-unavailable");
      retainLock = !await terminationPromise.catch(() => false);
      return result(false, "STAGE_CHILD_IDENTITY_UNAVAILABLE", {
        taskId: definition.taskId,
        stageId: definition.stageId,
      });
    }
    lockRecord.childPid = child.pid;
    lockRecord.childStartIdentity = childStartIdentity;
    lockRecord.childProcessGroupId = child.pid;
    await persistLockRecord();

    // LAUNCH_SIGNAL, not launcher creation, is the possible module-effect
    // boundary. Re-fetch every mutable authorization fact after the durable
    // child lock-record fsync, then allow no await before the first signal byte.
    const predecessorStillCurrentAtSignal = await predecessorReceiptExists(runtimeRoot, definition);
    let signalAuthorization;
    try {
      signalAuthorization = await authorize(request);
    } catch {
      signalAuthorization = null;
    }
    const signalAt = clock();
    const signalAtMs = PRIMORDIAL_DATE_GET_TIME(signalAt);
    const signalAuthorityDeadlines = [
      ...authorityDeadlines,
      PRIMORDIAL_DATE_PARSE(signalAuthorization?.deadlineAt ?? ""),
    ];
    const signalDeadlineAt = Math.min(deadlineAt, ...signalAuthorityDeadlines);
    const signalAuthorityExpired = cancellationReason !== null
      || signalAuthorityDeadlines.some((value) => Number.isFinite(value) && value <= signalAtMs)
      || deadlineAt <= signalAtMs;
    const launcherStillWaiting = child.exitCode === null && child.signalCode === null;
    const signalAuthorizationValid = cancellationReason === null
      && launcherStillWaiting
      && predecessorStillCurrentAtSignal
      && validateAuthorization(signalAuthorization, request, definition)
      && sameAuthorization(authorization, signalAuthorization)
      && sameAuthorization(spawnAuthorization, signalAuthorization)
      && signalAuthorityDeadlines.every((value) => Number.isFinite(value) && value > signalAtMs)
      && Number.isFinite(signalDeadlineAt)
      && signalDeadlineAt > signalAtMs;
    if (!signalAuthorizationValid) {
      requestCancellation(signalAuthorityExpired ? "expired-before-signal" : "blocked-before-signal");
      const launcherQuiescent = await terminationPromise.catch(() => false);
      if (!launcherQuiescent) {
        retainLock = true;
        try {
          const recoveryReceipt = closedReceipt({
            definition,
            authorization,
            state: "recovery-required",
            attempt: 1,
            evidence: latestEvidence,
          });
          await appendJournalEvent(eventDir, 2, {
            schemaVersion: definition.schemaVersion,
            state: "recovery-required",
            occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(signalAt),
            receipt: recoveryReceipt,
          });
          provenEventCount = 2;
          durableRecoveryOrTerminal = true;
        } catch {
          // Keep the lock pinned when neither launcher settlement nor durable
          // recovery can be proven.
        }
        return result(false, "STAGE_RECOVERY_REQUIRED", {
          taskId: definition.taskId,
          stageId: definition.stageId,
        });
      }
      return await appendNoMutationTerminal({
        expired: signalAuthorityExpired,
        occurredAt: signalAt,
      });
    }

    deadlineAt = signalDeadlineAt;
    PRIMORDIAL_CLEAR_TIMEOUT(deadlineHandle);
    deadlineHandle = PRIMORDIAL_SET_TIMEOUT(
      () => requestCancellation("deadline-during-action"),
      Math.max(1, deadlineAt - PRIMORDIAL_DATE_NOW()),
    );
    // Set this before .end(): signal bytes may escape even if .end() throws.
    actionMayHaveStarted = true;
    child.stdio[4].end(LAUNCH_SIGNAL);

    const outcome = await outcomePromise;
    PRIMORDIAL_CLEAR_TIMEOUT(deadlineHandle);
    deadlineHandle = undefined;
    let processTreeQuiescent = true;
    if (terminationPromise) processTreeQuiescent = await terminationPromise;
    if (processTreeAlive(child)) processTreeQuiescent = await terminateProcessTree(child);
    if (!processTreeQuiescent) retainLock = true;
    await Promise.all([
      stdoutHandle.sync(),
      stderrHandle.sync(),
      childResultHandle.sync(),
    ]);
    await Promise.all([stdoutHandle.close(), stderrHandle.close(), childResultHandle.close()]);
    stdoutHandle = null;
    stderrHandle = null;
    childResultHandle = null;
    const childResult = await readChildResult(childResultPath, {
      taskId: definition.taskId,
      stageId: definition.stageId,
      idempotencyKey: definition.idempotencyKey,
      sourceRevision: authorization.sourceRevision,
      stageBindingDigest: definitionValidation.stageBindingDigest,
    });
    latestEvidence = {
      moduleSha256: reviewedModule.moduleSha256,
      childResultSha256: childResult?.digest ?? null,
      evidenceDigest: childResult?.value?.evidenceDigest ?? null,
      stdoutSha256: sha256(await readFile(stdoutPath)),
      stderrSha256: sha256(await readFile(stderrPath)),
    };
    if (cancellationReason !== null || outcome.spawnFailed || outcome.exitCode !== 0
      || !processTreeQuiescent || childResult === null) {
      const failedReceipt = closedReceipt({
        definition,
        authorization,
        state: "recovery-required",
        attempt: 1,
        evidence: latestEvidence,
      });
      await appendJournalEvent(eventDir, 2, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
        receipt: failedReceipt,
      });
      provenEventCount = 2;
      durableRecoveryOrTerminal = true;
      return publicOperatorResult({
        ok: false,
        code: "STAGE_RECOVERY_REQUIRED",
        definition,
        authorization,
        state: "recovery-required",
        receiptDigest: sha256(canonicalJson(failedReceipt)),
        attempt: 1,
        authorityStatus: "not-rechecked",
        mutationStatement: "Mutation may have occurred",
        immediateVerification: "not-run",
        quiescentVerification: "not-run",
        consequence: "Stage state requires reviewed recovery before replay.",
        nextAction: "Perform reviewed recovery or rollback.",
      });
    }

    const pendingReceipt = closedReceipt({
      definition,
      authorization,
      state: "verification-pending",
      attempt: 1,
      evidence: latestEvidence,
    });
    const pendingReceiptSha256 = sha256(canonicalJson(pendingReceipt));
    await appendJournalEvent(eventDir, 2, {
      schemaVersion: definition.schemaVersion,
      state: "verification-pending",
      occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
      receipt: pendingReceipt,
    });
    provenEventCount = 2;
    lockRecord.pendingReceiptSha256 = pendingReceiptSha256;
    await persistLockRecord();

    const authorizationStillValid = async () => {
      let preNowMs;
      try {
        preNowMs = PRIMORDIAL_DATE_GET_TIME(clock());
      } catch {
        return false;
      }
      if (!Number.isFinite(preNowMs) || preNowMs >= deadlineAt) return false;
      let refreshed;
      try {
        refreshed = await authorize(request);
      } catch {
        return false;
      }
      let postNowMs;
      try {
        postNowMs = PRIMORDIAL_DATE_GET_TIME(clock());
      } catch {
        return false;
      }
      return validateAuthorization(refreshed, request, definition)
        && sameAuthorization(authorization, refreshed)
        && Number.isFinite(postNowMs)
        && postNowMs < deadlineAt
        && PRIMORDIAL_DATE_PARSE(refreshed.deadlineAt) > postNowMs;
    };
    const verificationDigests = {
      immediateVerificationSha256: null,
      immediateVerificationResult: null,
      quiescent1VerificationSha256: null,
      quiescent1VerificationResult: null,
      quiescent2VerificationSha256: null,
      quiescent2VerificationResult: null,
    };
    const verifyBoundary = async (boundary, receiptKey) => {
      if (!await authorizationStillValid()) return false;
      let supplied;
      try {
        supplied = await verifyOutcome(Object.freeze({
          schemaVersion: definition.schemaVersion,
          boundary,
          moduleId: definition.moduleId,
          taskId: definition.taskId,
          stageId: definition.stageId,
          sourceRevision: authorization.sourceRevision,
          stageBindingDigest: definitionValidation.stageBindingDigest,
          moduleSha256: latestEvidence.moduleSha256,
          childResultSha256: latestEvidence.childResultSha256,
          evidenceDigest: latestEvidence.evidenceDigest,
        }));
      } catch {
        return false;
      }
      const verified = validateOutcomeVerification(supplied, {
        boundary,
        taskId: definition.taskId,
        stageId: definition.stageId,
        sourceRevision: authorization.sourceRevision,
        stageBindingDigest: definitionValidation.stageBindingDigest,
        moduleSha256: latestEvidence.moduleSha256,
        childResultSha256: latestEvidence.childResultSha256,
        evidenceDigest: latestEvidence.evidenceDigest,
      });
      if (verified === null) return false;
      // Outcome verification may itself be slow. Re-fetch exact main and
      // re-evaluate the immutable Gate B authorization after the verifier
      // settles so an expired or revoked stage cannot become durable success.
      if (!await authorizationStillValid()) return false;
      verificationDigests[receiptKey] = verified.digest;
      verificationDigests[receiptKey.replace("Sha256", "Result")] = verified.value.outcome;
      return true;
    };
    let postActionAuthorized = await verifyBoundary("immediate", "immediateVerificationSha256");
    if (postActionAuthorized) {
      await delay(quiescenceIntervalMs);
      postActionAuthorized = await verifyBoundary("quiescent-1", "quiescent1VerificationSha256");
    }
    if (postActionAuthorized) {
      await delay(quiescenceIntervalMs);
      postActionAuthorized = await verifyBoundary("quiescent-2", "quiescent2VerificationSha256");
    }
    // Keep the final append boundary fail-closed as well. This deliberately
    // incurs one more exact-main/authority check immediately before the
    // terminal receipt is constructed and persisted.
    if (postActionAuthorized) postActionAuthorized = await authorizationStillValid();
    latestVerification = verificationDigests;
    const verifiedEvidence = { ...latestEvidence, ...verificationDigests };
    if (!postActionAuthorized) {
      const recoveryReceipt = closedReceipt({
        definition,
        authorization,
        state: "recovery-required",
        attempt: 1,
        evidence: verifiedEvidence,
      });
      await appendJournalEvent(eventDir, 3, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
        receipt: recoveryReceipt,
      });
      provenEventCount = 3;
      durableRecoveryOrTerminal = true;
      return publicOperatorResult({
        ok: false,
        code: "STAGE_POST_ACTION_VERIFICATION_INVALID",
        definition,
        authorization,
        state: "recovery-required",
        receiptDigest: sha256(canonicalJson(recoveryReceipt)),
        attempt: 1,
        authorityStatus: "not-rechecked",
        mutationStatement: "Mutation may have occurred",
        immediateVerification: verificationDigests.immediateVerificationResult === "pass" ? "pass" : "fail",
        quiescentVerification: verificationDigests.quiescent1VerificationResult === "pass"
          && verificationDigests.quiescent2VerificationResult === "pass" ? "pass" : "fail",
        consequence: "Stage state requires reviewed recovery before replay.",
        nextAction: "Perform reviewed recovery or rollback.",
      });
    }

    const completedReceipt = closedReceipt({
      definition,
      authorization,
      state: "verified-complete",
      attempt: 1,
      evidence: verifiedEvidence,
    });
    const completedValidation = validateStageReceipt(completedReceipt, definition, authorization);
    if (!completedValidation.ok) throw new Error(completedValidation.code);
    await appendJournalEvent(eventDir, 3, {
      schemaVersion: definition.schemaVersion,
      state: "verified-complete",
      occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
      receipt: completedReceipt,
      pendingReceiptSha256,
    });
    provenEventCount = 3;
    durableRecoveryOrTerminal = true;
    return publicOperatorResult({
      ok: true,
      code: "STAGE_SUCCEEDED",
      definition,
      authorization,
      state: "verified-complete",
      receiptDigest: sha256(canonicalJson(completedReceipt)),
      attempt: 1,
      authorityStatus: "current",
      mutationStatement: "Mutation verified complete",
      immediateVerification: "pass",
      quiescentVerification: "pass",
      consequence: "Stage effect is verified; task delivery status is unchanged.",
      nextAction: "Run a separately reviewed delivery transition.",
    });
  } catch {
    if (child && !(await terminateProcessTree(child).catch(() => false))) retainLock = true;
    if (actionMayHaveStarted && !durableRecoveryOrTerminal) {
      try {
        const events = await readEvents(eventDir);
        if (events.length < provenEventCount || events.length > provenEventCount + 1) {
          throw new Error("post-action journal event count is not provable");
        }
        let provenTail = events.at(-1);
        if (events.length === provenEventCount + 1) {
          // A later recovery event must never depend on a merely readable,
          // fsync-uncertain predecessor created by the failed append.
          provenTail = await proveReadableEventTailDurable({
            eventDir,
            events,
            syncEventFile,
            syncEventDirectory,
          });
          provenEventCount = events.length;
        }
        const alreadyWritten = provenTail?.state === "recovery-required"
          || TERMINAL_STAGE_STATES.includes(provenTail?.state);
        if (!alreadyWritten) {
          const recoveryReceipt = closedReceipt({
            definition,
            authorization,
            state: "recovery-required",
            attempt: 1,
            evidence: { ...latestEvidence, ...latestVerification },
          });
          await appendJournalEvent(eventDir, events.length + 1, {
            schemaVersion: definition.schemaVersion,
            state: "recovery-required",
            occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
            receipt: recoveryReceipt,
          });
          provenEventCount = events.length + 1;
        }
        durableRecoveryOrTerminal = true;
      } catch {
        // A possible child effect without a proven durable recovery/terminal
        // tail remains fail-stuck for reviewed recovery.
        retainLock = true;
      }
      return result(false, "STAGE_RECOVERY_REQUIRED", {
        taskId: definition.taskId,
        stageId: definition.stageId,
      });
    }
    return result(false, "STAGE_RUNNER_FAILED", { taskId: definition.taskId, stageId: definition.stageId });
  } finally {
    if (deadlineHandle !== undefined) {
      PRIMORDIAL_CLEAR_TIMEOUT(deadlineHandle);
      deadlineHandle = undefined;
    }
    if (stdoutHandle) await stdoutHandle.close().catch(() => {});
    if (stderrHandle) await stderrHandle.close().catch(() => {});
    if (childResultHandle) await childResultHandle.close().catch(() => {});
    if (!retainLock && ownerNonce !== null) {
      if (!await releaseOwnedLock(lockHandle, lockPath, ownerNonce)) retainLock = true;
    } else if (!retainLock && ownerNonce === null) {
      if (!await releaseOwnedEmptyLock(lockHandle, lockPath)) retainLock = true;
    }
    await lockHandle.close().catch(() => {});
  }
}

async function executeResolvedCallbackStage({
  definition,
  moduleEntry,
  execute,
  repoRoot,
  runtimeRoot,
  authorize = verifyStageGateBAtExactMain,
  verifyOutcome = verifyReviewedStageOutcome,
  clock = primordialClock,
  quiescenceIntervalMs = QUIESCENCE_INTERVAL_MS,
  appendJournalEvent = appendEvent,
  syncEventFile = syncRegularFile,
  syncEventDirectory = syncDirectory,
  installStreamCapture = installCallbackStreamCapture,
}) {
  const definitionValidation = validateStagedActionDefinition(definition);
  if (!definitionValidation.ok) return result(false, definitionValidation.code);
  if (typeof execute !== "function") return result(false, "STAGE_CALLBACK_REQUIRED");
  const request = bindingRequest(definition);
  let authorization;
  try {
    authorization = await authorize(request);
  } catch {
    authorization = null;
  }
  if (!validateAuthorization(authorization, request, definition)) {
    return result(false, "STAGE_GATE_B_DENIED", { taskId: definition.taskId, stageId: definition.stageId });
  }
  const reviewedModule = await resolveReviewedModule({ repoRoot, definition, moduleEntry });
  if (!reviewedModule || reviewedModule.moduleSha256 !== authorization.moduleSha256) {
    return result(false, "STAGE_MODULE_NOT_ALLOWLISTED", { taskId: definition.taskId, stageId: definition.stageId });
  }
  if (!await predecessorReceiptExists(runtimeRoot, definition)) {
    return result(false, "STAGE_PREDECESSOR_RECEIPT_MISSING", {
      taskId: definition.taskId,
      stageId: definition.stageId,
    });
  }

  const runtimeKey = safeRuntimeSegment(`${definition.taskId}\0${definition.stageId}\0${definition.idempotencyKey}`);
  const stageRoot = path.join(runtimeRoot, runtimeKey);
  const eventDir = path.join(stageRoot, "events");
  const rawDir = path.join(stageRoot, "raw-evidence");
  const lockDir = path.join(runtimeRoot, "locks");
  const lockPath = path.join(lockDir, `${runtimeKey}.lock`);
  const callbackLockPath = path.join(lockDir, "in-process-callback-global.lock");
  await ensureDurableDirectory(runtimeRoot);
  await ensureDurableDirectory(stageRoot);
  await ensureDurableDirectory(eventDir);
  await ensureDurableDirectory(rawDir);
  await ensureDurableDirectory(lockDir);

  const expectedLock = {
    schemaVersion: definition.schemaVersion,
    runtimeKey,
    taskId: definition.taskId,
    stageId: definition.stageId,
    sourceRevision: authorization.sourceRevision,
    stageBindingDigest: definitionValidation.stageBindingDigest,
    eventDir,
  };
  const lockHandle = await acquireOwnedLock(lockPath, expectedLock);
  if (!lockHandle) {
    return result(false, "STAGE_LOCK_UNAVAILABLE", { taskId: definition.taskId, stageId: definition.stageId });
  }
  await syncDirectory(lockDir);

  let ownerNonce = null;
  let retainLock = false;
  let callbackLockHandle = null;
  let callbackLockOwnerNonce = null;
  let retainCallbackLock = false;
  let finishStreamCapture = null;
  let actionStartDurable = false;
  let durableRecoveryOrTerminal = false;
  let provenEventCount = 0;
  let latestEvidence = {
    moduleSha256: reviewedModule.moduleSha256,
    childResultSha256: null,
    evidenceDigest: null,
    stdoutSha256: null,
    stderrSha256: null,
  };
  let latestVerification = {};
  try {
    const supervisorStartIdentity = processStartIdentity(process.pid);
    if (supervisorStartIdentity === null) {
      return result(false, "STAGE_SUPERVISOR_IDENTITY_UNAVAILABLE", {
        taskId: definition.taskId,
        stageId: definition.stageId,
      });
    }
    ownerNonce = crypto.randomBytes(32).toString("hex");
    const lockRecord = {
      schemaVersion: definition.schemaVersion,
      runtimeKey,
      taskId: definition.taskId,
      stageId: definition.stageId,
      sourceRevision: authorization.sourceRevision,
      stageBindingDigest: definitionValidation.stageBindingDigest,
      ownerNonce,
      supervisorPid: process.pid,
      supervisorStartIdentity,
      childPid: null,
      childStartIdentity: null,
      childProcessGroupId: null,
      pendingReceiptSha256: null,
      heartbeatAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
    };
    const persistLockRecord = async () => {
      lockRecord.heartbeatAt = PRIMORDIAL_DATE_TO_ISO_STRING(clock());
      const bytes = Buffer.from(`${canonicalJson(lockRecord)}\n`, "utf8");
      await lockHandle.truncate(0);
      await lockHandle.write(bytes, 0, bytes.length, 0);
      await lockHandle.sync();
    };
    await persistLockRecord();

    const existingEvents = await readEvents(eventDir);
    const existingTerminal = terminalEvent(existingEvents);
    if (existingTerminal) {
      const receiptValidation = validateHistoricalStageReceipt(
        existingTerminal.receipt,
        historicalBindingFromAuthorization(authorization),
      );
      if (!receiptValidation.ok) {
        return result(false, "STAGE_RECEIPT_INVALID", { taskId: definition.taskId, stageId: definition.stageId });
      }
      return terminalPublicResult(existingTerminal.receipt);
    }
    if (existingEvents.length > 0) {
      const recoveredReceipt = closedReceipt({
        definition,
        authorization,
        state: "recovery-required",
        attempt: 1,
      });
      await appendJournalEvent(eventDir, existingEvents.length + 1, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
        receipt: recoveredReceipt,
      });
      durableRecoveryOrTerminal = true;
      return publicOperatorResult({
        ok: false,
        code: "STAGE_RECOVERY_REQUIRED",
        definition,
        authorization,
        state: "recovery-required",
        receiptDigest: sha256(canonicalJson(recoveredReceipt)),
        attempt: 1,
        authorityStatus: "not-rechecked",
        mutationStatement: "Mutation may have occurred",
        immediateVerification: "not-run",
        quiescentVerification: "not-run",
        consequence: "Stage state requires reviewed recovery before replay.",
        nextAction: "Perform reviewed recovery or rollback.",
      });
    }

    let lockedAuthorization;
    try {
      lockedAuthorization = await authorize(request);
    } catch {
      lockedAuthorization = null;
    }
    const lockedNow = clock();
    const lockedNowMs = PRIMORDIAL_DATE_GET_TIME(lockedNow);
    if (!validateAuthorization(lockedAuthorization, request, definition)
      || !sameAuthorization(authorization, lockedAuthorization)
      || PRIMORDIAL_DATE_PARSE(authorization.deadlineAt) <= lockedNowMs
      || PRIMORDIAL_DATE_PARSE(lockedAuthorization.deadlineAt) <= lockedNowMs
      || !await predecessorReceiptExists(runtimeRoot, definition)) {
      return result(false, "STAGE_GATE_B_DENIED", { taskId: definition.taskId, stageId: definition.stageId });
    }

    callbackLockHandle = await acquireOwnedLock(callbackLockPath, {});
    if (!callbackLockHandle) {
      return result(false, "STAGE_CALLBACK_LOCK_UNAVAILABLE", {
        taskId: definition.taskId,
        stageId: definition.stageId,
      });
    }
    await syncDirectory(lockDir);
    callbackLockOwnerNonce = crypto.randomBytes(32).toString("hex");
    const callbackLockRecord = {
      schemaVersion: definition.schemaVersion,
      runtimeKey: "in-process-callback-global",
      taskId: definition.taskId,
      stageId: definition.stageId,
      sourceRevision: authorization.sourceRevision,
      stageBindingDigest: definitionValidation.stageBindingDigest,
      ownerNonce: callbackLockOwnerNonce,
      supervisorPid: process.pid,
      supervisorStartIdentity,
      childPid: null,
      childStartIdentity: null,
      childProcessGroupId: null,
      pendingReceiptSha256: null,
      heartbeatAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
    };
    const callbackLockBytes = PRIMORDIAL_BUFFER_FROM(`${canonicalJson(callbackLockRecord)}\n`, "utf8");
    await callbackLockHandle.write(callbackLockBytes, 0, callbackLockBytes.length, 0);
    await callbackLockHandle.sync();
    finishStreamCapture = installStreamCapture();

    await appendJournalEvent(eventDir, 1, {
      schemaVersion: definition.schemaVersion,
      state: "running",
      occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
      processGroupId: null,
      actionKind: "in-process-reviewed-callback",
      actionStartAuthorized: true,
      sourceRevision: authorization.sourceRevision,
      stageBindingDigest: definitionValidation.stageBindingDigest,
      executorSha256: reviewedModule.moduleSha256,
    });
    provenEventCount = 1;
    actionStartDurable = true;

    // Durable running is only an intent marker. Fetch and evaluate Gate B once
    // more after every lock/fsync/journal delay, then take the actual action
    // start time. No await or caller-controlled operation occurs between this
    // boundary and invocation of the exact reviewed function.
    const predecessorStillCurrent = await predecessorReceiptExists(runtimeRoot, definition);
    let invocationAuthorization;
    try {
      invocationAuthorization = await authorize(request);
    } catch {
      invocationAuthorization = null;
    }
    const callbackStart = clock();
    const callbackStartMs = PRIMORDIAL_DATE_GET_TIME(callbackStart);
    const authorityDeadlines = [
      PRIMORDIAL_DATE_PARSE(authorization.deadlineAt),
      PRIMORDIAL_DATE_PARSE(lockedAuthorization.deadlineAt),
      PRIMORDIAL_DATE_PARSE(invocationAuthorization?.deadlineAt ?? ""),
    ];
    const authorityExpired = authorityDeadlines.some((value) => Number.isFinite(value) && value <= callbackStartMs);
    const invocationAuthorizationValid = predecessorStillCurrent
      && validateAuthorization(invocationAuthorization, request, definition)
      && sameAuthorization(authorization, invocationAuthorization)
      && authorityDeadlines.every((value) => Number.isFinite(value) && value > callbackStartMs);
    const deadlineAt = invocationAuthorizationValid
      ? Math.min(
        callbackStartMs + Math.min(definition.deadlineMs, MAX_CALLBACK_DEADLINE_MS),
        ...authorityDeadlines,
      )
      : Number.NaN;
    if (!invocationAuthorizationValid || !Number.isFinite(deadlineAt) || deadlineAt <= callbackStartMs) {
      const terminalState = authorityExpired ? "expired-before-mutation" : "blocked-no-mutation";
      const terminalReceipt = closedReceipt({
        definition,
        authorization,
        state: terminalState,
        attempt: 1,
        evidence: { moduleSha256: reviewedModule.moduleSha256 },
      });
      const terminalValidation = validateStageReceipt(terminalReceipt, definition, authorization);
      if (!terminalValidation.ok) throw new Error(terminalValidation.code);
      await appendJournalEvent(eventDir, 2, {
        schemaVersion: definition.schemaVersion,
        state: terminalState,
        occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(callbackStart),
        receipt: terminalReceipt,
      });
      provenEventCount = 2;
      durableRecoveryOrTerminal = true;
      return result(false, authorityExpired ? "STAGE_EXPIRED_BEFORE_MUTATION" : "STAGE_BLOCKED_NO_MUTATION", {
        taskId: definition.taskId,
        stageId: definition.stageId,
        state: terminalState,
        receiptDigest: sha256(canonicalJson(terminalReceipt)),
      });
    }

    const callbackContext = frozenCallbackContext({ definition, authorization, deadlineAt });
    const callbackStartedAt = PRIMORDIAL_HRTIME_BIGINT();
    const callbackDeadlineNanoseconds = BigInt(Math.max(1, deadlineAt - callbackStartMs)) * 1_000_000n;
    let deadlineReached = false;
    let deadlineHandle;
    const deadlinePromise = new Promise((resolve) => {
      deadlineHandle = PRIMORDIAL_SET_TIMEOUT(() => {
        deadlineReached = true;
        callbackContext.controller.abort("callback-deadline-exceeded");
        resolve(PRIMORDIAL_OBJECT_FREEZE({ status: "deadline", value: null }));
      }, Math.max(1, deadlineAt - callbackStartMs));
    });
    let actionValue;
    let actionThrew = false;
    try {
      actionValue = execute(callbackContext.value);
    } catch {
      actionThrew = true;
    }
    const actionPromise = actionThrew
      ? Promise.resolve(PRIMORDIAL_OBJECT_FREEZE({ status: "rejected", value: null }))
      : Promise.resolve(actionValue).then(
        (value) => PRIMORDIAL_OBJECT_FREEZE({ status: "fulfilled", value }),
        () => PRIMORDIAL_OBJECT_FREEZE({ status: "rejected", value: null }),
      );
    let firstOutcome;
    let settledOutcome;
    let callbackDeadlineExceeded;
    let streamObservation;
    try {
      firstOutcome = await Promise.race([actionPromise, deadlinePromise]);
      PRIMORDIAL_CLEAR_TIMEOUT(deadlineHandle);
      const callbackElapsedNanoseconds = PRIMORDIAL_HRTIME_BIGINT() - callbackStartedAt;
      callbackDeadlineExceeded = deadlineReached
        || firstOutcome.status === "deadline"
        || callbackElapsedNanoseconds >= callbackDeadlineNanoseconds
        || PRIMORDIAL_DATE_GET_TIME(clock()) >= deadlineAt;
      if (callbackDeadlineExceeded && !callbackContext.value.signal.aborted) {
        callbackContext.controller.abort("callback-deadline-exceeded");
      }
      // An in-process callback cannot be terminated safely. If the deadline
      // wins, await the original Promise while retaining both locks and stream
      // interception. Non-settlement therefore remains durably fail-stuck.
      settledOutcome = firstOutcome.status === "deadline" ? await actionPromise : firstOutcome;
    } finally {
      if (deadlineHandle !== undefined) PRIMORDIAL_CLEAR_TIMEOUT(deadlineHandle);
      if (finishStreamCapture !== null) {
        const finish = finishStreamCapture;
        finishStreamCapture = null;
        try {
          streamObservation = finish();
          if (streamObservation.streamsRestored !== true) retainCallbackLock = true;
        } catch (error) {
          retainCallbackLock = true;
          throw error;
        }
      }
      if (callbackLockHandle !== null && callbackLockOwnerNonce !== null) {
        if (!retainCallbackLock
          && !await releaseOwnedLock(callbackLockHandle, callbackLockPath, callbackLockOwnerNonce)) {
          retainCallbackLock = true;
        }
        await callbackLockHandle.close().catch(() => {});
        callbackLockHandle = null;
      }
    }
    const callbackCompletion = settledOutcome.status === "fulfilled"
      ? validateCallbackCompletion(settledOutcome.value, {
        ...request,
        sourceRevision: authorization.sourceRevision,
        candidateRevision: authorization.candidateRevision,
        stageBindingDigest: definitionValidation.stageBindingDigest,
      })
      : null;
    latestEvidence = {
      moduleSha256: reviewedModule.moduleSha256,
      childResultSha256: callbackCompletion?.digest ?? null,
      evidenceDigest: callbackCompletion?.value.evidenceDigest ?? null,
      stdoutSha256: streamObservation?.stdoutSha256 ?? null,
      stderrSha256: streamObservation?.stderrSha256 ?? null,
    };
    const appendRecovery = async ({ code, sequence, evidenceValue = latestEvidence, verification = {} }) => {
      const receipt = closedReceipt({
        definition,
        authorization,
        state: "recovery-required",
        attempt: 1,
        evidence: { ...evidenceValue, ...verification },
      });
      await appendJournalEvent(eventDir, sequence, {
        schemaVersion: definition.schemaVersion,
        state: "recovery-required",
        occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
        receipt,
      });
      provenEventCount = sequence;
      durableRecoveryOrTerminal = true;
      return publicOperatorResult({
        ok: false,
        code,
        definition,
        authorization,
        state: "recovery-required",
        receiptDigest: sha256(canonicalJson(receipt)),
        attempt: 1,
        authorityStatus: "not-rechecked",
        mutationStatement: "Mutation may have occurred",
        immediateVerification: verification.immediateVerificationResult === "pass" ? "pass" : "not-run",
        quiescentVerification: verification.quiescent1VerificationResult === "pass"
          && verification.quiescent2VerificationResult === "pass" ? "pass" : "not-run",
        consequence: "Stage state requires reviewed recovery before replay.",
        nextAction: "Perform reviewed recovery or rollback.",
      });
    };
    if (streamObservation === undefined
      || streamObservation.streamsRestored !== true
      || retainCallbackLock) {
      callbackContext.controller.abort("callback-stream-containment-failed");
      return await appendRecovery({ code: "STAGE_CALLBACK_CONTAINMENT_FAILED", sequence: 2 });
    }
    if (streamObservation.rawStreamAttempted || streamObservation.streamBindingTampered) {
      callbackContext.controller.abort("callback-raw-stream-rejected");
      return await appendRecovery({ code: "STAGE_CALLBACK_RAW_STREAM_REJECTED", sequence: 2 });
    }
    if (callbackDeadlineExceeded) {
      return await appendRecovery({ code: "STAGE_CALLBACK_DEADLINE_EXCEEDED", sequence: 2 });
    }
    if (settledOutcome.status !== "fulfilled") {
      callbackContext.controller.abort("callback-failed");
      return await appendRecovery({ code: "STAGE_CALLBACK_FAILED", sequence: 2 });
    }
    if (callbackCompletion === null) {
      callbackContext.controller.abort("callback-receipt-rejected");
      return await appendRecovery({ code: "STAGE_CALLBACK_RECEIPT_REJECTED", sequence: 2 });
    }

    const authorizationStillValid = async () => {
      let preNowMs;
      try {
        preNowMs = PRIMORDIAL_DATE_GET_TIME(clock());
      } catch {
        return false;
      }
      if (!Number.isFinite(preNowMs) || preNowMs >= deadlineAt) return false;
      let refreshed;
      try {
        refreshed = await authorize(request);
      } catch {
        return false;
      }
      let postNowMs;
      try {
        postNowMs = PRIMORDIAL_DATE_GET_TIME(clock());
      } catch {
        return false;
      }
      return validateAuthorization(refreshed, request, definition)
        && sameAuthorization(authorization, refreshed)
        && Number.isFinite(postNowMs)
        && postNowMs < deadlineAt
        && PRIMORDIAL_DATE_PARSE(refreshed.deadlineAt) > postNowMs;
    };
    if (!await authorizationStillValid()) {
      callbackContext.controller.abort("callback-authority-invalidated");
      return await appendRecovery({ code: "STAGE_POST_ACTION_VERIFICATION_INVALID", sequence: 2 });
    }

    const pendingReceipt = closedReceipt({
      definition,
      authorization,
      state: "verification-pending",
      attempt: 1,
      evidence: latestEvidence,
    });
    const pendingReceiptSha256 = sha256(canonicalJson(pendingReceipt));
    await appendJournalEvent(eventDir, 2, {
      schemaVersion: definition.schemaVersion,
      state: "verification-pending",
      occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
      receipt: pendingReceipt,
    });
    provenEventCount = 2;
    lockRecord.pendingReceiptSha256 = pendingReceiptSha256;
    await persistLockRecord();

    const verificationDigests = {
      immediateVerificationSha256: null,
      immediateVerificationResult: null,
      quiescent1VerificationSha256: null,
      quiescent1VerificationResult: null,
      quiescent2VerificationSha256: null,
      quiescent2VerificationResult: null,
    };
    const verifyBoundary = async (boundary, receiptKey) => {
      if (!await authorizationStillValid()) return false;
      let supplied;
      try {
        supplied = await verifyOutcome(PRIMORDIAL_OBJECT_FREEZE({
          schemaVersion: definition.schemaVersion,
          boundary,
          moduleId: definition.moduleId,
          taskId: definition.taskId,
          stageId: definition.stageId,
          sourceRevision: authorization.sourceRevision,
          stageBindingDigest: definitionValidation.stageBindingDigest,
          moduleSha256: latestEvidence.moduleSha256,
          childResultSha256: latestEvidence.childResultSha256,
          evidenceDigest: latestEvidence.evidenceDigest,
        }));
      } catch {
        return false;
      }
      const verified = validateOutcomeVerification(supplied, {
        boundary,
        taskId: definition.taskId,
        stageId: definition.stageId,
        sourceRevision: authorization.sourceRevision,
        stageBindingDigest: definitionValidation.stageBindingDigest,
        moduleSha256: latestEvidence.moduleSha256,
        childResultSha256: latestEvidence.childResultSha256,
        evidenceDigest: latestEvidence.evidenceDigest,
      });
      if (verified === null || !await authorizationStillValid()) return false;
      verificationDigests[receiptKey] = verified.digest;
      verificationDigests[receiptKey.replace("Sha256", "Result")] = verified.value.outcome;
      return true;
    };
    let postActionAuthorized = await verifyBoundary("immediate", "immediateVerificationSha256");
    if (postActionAuthorized) {
      await delay(quiescenceIntervalMs);
      postActionAuthorized = await verifyBoundary("quiescent-1", "quiescent1VerificationSha256");
    }
    if (postActionAuthorized) {
      await delay(quiescenceIntervalMs);
      postActionAuthorized = await verifyBoundary("quiescent-2", "quiescent2VerificationSha256");
    }
    // This is intentionally a separate fresh exact-main/Gate B evaluation at
    // the final success boundary rather than relying on the verifier's check.
    if (postActionAuthorized) postActionAuthorized = await authorizationStillValid();
    if (!postActionAuthorized) {
      callbackContext.controller.abort("callback-authority-invalidated");
      latestVerification = verificationDigests;
      return await appendRecovery({
        code: "STAGE_POST_ACTION_VERIFICATION_INVALID",
        sequence: 3,
        verification: verificationDigests,
      });
    }

    const completedReceipt = closedReceipt({
      definition,
      authorization,
      state: "verified-complete",
      attempt: 1,
      evidence: { ...latestEvidence, ...verificationDigests },
    });
    const completedValidation = validateStageReceipt(completedReceipt, definition, authorization);
    if (!completedValidation.ok) throw new Error(completedValidation.code);
    await appendJournalEvent(eventDir, 3, {
      schemaVersion: definition.schemaVersion,
      state: "verified-complete",
      occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
      receipt: completedReceipt,
      pendingReceiptSha256,
    });
    provenEventCount = 3;
    durableRecoveryOrTerminal = true;
    return publicOperatorResult({
      ok: true,
      code: "STAGE_SUCCEEDED",
      definition,
      authorization,
      state: "verified-complete",
      receiptDigest: sha256(canonicalJson(completedReceipt)),
      attempt: 1,
      authorityStatus: "current",
      mutationStatement: "Mutation verified complete",
      immediateVerification: "pass",
      quiescentVerification: "pass",
      consequence: "Stage effect is verified; task delivery status is unchanged.",
      nextAction: "Run a separately reviewed delivery transition.",
    });
  } catch {
    if (actionStartDurable && !durableRecoveryOrTerminal) {
      try {
        const events = await readEvents(eventDir);
        if (events.length < provenEventCount || events.length > provenEventCount + 1) {
          throw new Error("post-action journal event count is not provable");
        }
        let provenTail = events.at(-1);
        if (events.length === provenEventCount + 1) {
          // Any newly readable tail—not only a recovery/terminal tail—must be
          // independently proven before a later recovery event may depend on it.
          provenTail = await proveReadableEventTailDurable({
            eventDir,
            events,
            syncEventFile,
            syncEventDirectory,
          });
          provenEventCount = events.length;
        }
        const alreadyWritten = provenTail?.state === "recovery-required"
          || TERMINAL_STAGE_STATES.includes(provenTail?.state);
        if (!alreadyWritten) {
          const recoveryReceipt = closedReceipt({
            definition,
            authorization,
            state: "recovery-required",
            attempt: 1,
            evidence: { ...latestEvidence, ...latestVerification },
          });
          await appendJournalEvent(eventDir, events.length + 1, {
            schemaVersion: definition.schemaVersion,
            state: "recovery-required",
            occurredAt: PRIMORDIAL_DATE_TO_ISO_STRING(clock()),
            receipt: recoveryReceipt,
          });
          provenEventCount = events.length + 1;
        }
        durableRecoveryOrTerminal = true;
      } catch {
        // A possible effect without a durable recovery/terminal event must not
        // release the stage lock. Reviewed recovery owns this fail-stuck state.
        retainLock = true;
      }
      return result(false, "STAGE_RECOVERY_REQUIRED", {
        taskId: definition.taskId,
        stageId: definition.stageId,
      });
    }
    return result(false, "STAGE_RUNNER_FAILED", { taskId: definition.taskId, stageId: definition.stageId });
  } finally {
    if (finishStreamCapture !== null) {
      try {
        const finish = finishStreamCapture;
        finishStreamCapture = null;
        const finalObservation = finish();
        if (finalObservation.streamsRestored !== true) {
          retainCallbackLock = true;
          if (actionStartDurable && !durableRecoveryOrTerminal) retainLock = true;
        }
      } catch {
        retainCallbackLock = true;
        if (actionStartDurable && !durableRecoveryOrTerminal) retainLock = true;
      }
    }
    if (callbackLockHandle !== null) {
      if (!retainCallbackLock && callbackLockOwnerNonce !== null) {
        if (!await releaseOwnedLock(callbackLockHandle, callbackLockPath, callbackLockOwnerNonce)) {
          retainCallbackLock = true;
        }
      } else if (!retainCallbackLock && callbackLockOwnerNonce === null) {
        if (!await releaseOwnedEmptyLock(callbackLockHandle, callbackLockPath)) retainCallbackLock = true;
      }
      await callbackLockHandle.close().catch(() => {});
    }
    if (!retainLock && ownerNonce !== null) {
      if (!await releaseOwnedLock(lockHandle, lockPath, ownerNonce)) retainLock = true;
    } else if (!retainLock && ownerNonce === null) {
      if (!await releaseOwnedEmptyLock(lockHandle, lockPath)) retainLock = true;
    }
    await lockHandle.close().catch(() => {});
  }
}

async function defaultRuntimeRoot(repoRoot) {
  const { spawnSync } = await import("node:child_process");
  const resultValue = spawnSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  if (resultValue.status !== 0) throw new Error("git common directory unavailable");
  const commonDir = resultValue.stdout.trim();
  if (!path.isAbsolute(commonDir)) throw new Error("git common directory is not absolute");
  return path.join(commonDir, "P0-stage-runtime");
}

/**
 * Bounded in-process production surface. The caller must supply the exact
 * code-owned reviewed function for the complete short action; an arbitrary or
 * module-mismatched closure is rejected. Git facts, Gate B evaluation,
 * immutable stage resolution, module/evidence bindings, clock, deadline, lock,
 * journal, receipt, and verification policy remain internal and non-injectable.
 */
export async function executeStageFromExactMain(request = {}) {
  // Capture exact own data-descriptor values synchronously. The caller may
  // mutate its object as soon as this async function first yields; no property
  // on `request` is read again after this point.
  const capturedRequest = captureCallbackProductionRequest(request);
  if (capturedRequest === null) return result(false, "STAGE_CALLBACK_REQUEST_SHAPE_INVALID");
  const { identity, execute } = capturedRequest;
  const repoRoot = DEFAULT_REPO_ROOT;
  const runtimeRoot = await defaultRuntimeRoot(repoRoot);
  const reconciled = await reconcileTerminalStage({ request: identity, runtimeRoot });
  if (reconciled !== null) return reconciled;
  const definition = resolveProductionStagedAction(identity);
  if (!definition
    || definition.scopeClass !== identity.scopeClass
    || definition.actionClass !== identity.actionClass
    || (definition.predecessor?.receiptDigest ?? null) !== identity.predecessorReceiptSha256) {
    return result(false, "STAGE_ACTION_NOT_REVIEWED", { taskId: identity.taskId, stageId: identity.stageId });
  }
  const moduleEntry = PRODUCTION_MODULE_ALLOWLIST[definition.moduleId];
  if (!moduleEntry) {
    return result(false, "STAGE_MODULE_NOT_ALLOWLISTED", { taskId: identity.taskId, stageId: identity.stageId });
  }
  const callbackEntry = PRODUCTION_CALLBACK_ALLOWLIST[definition.moduleId];
  if (!reviewedCallbackMatches(callbackEntry, moduleEntry, execute)) {
    return result(false, "STAGE_CALLBACK_NOT_ALLOWLISTED", {
      taskId: identity.taskId,
      stageId: identity.stageId,
    });
  }
  return executeResolvedCallbackStage({
    definition,
    moduleEntry,
    execute,
    repoRoot,
    runtimeRoot,
    authorize: verifyStageGateBAtExactMain,
    verifyOutcome: verifyReviewedStageOutcome,
  });
}

/**
 * Serializable production surface. The caller supplies only the immutable
 * stage identity and binding. Module, arguments, cwd, environment, output
 * custody, process model, clock, Git facts, evaluator, and callback are not
 * injectable.
 */
export async function runSerializableStageFromExactMain(request = {}) {
  // Capture the closed identity from own data descriptors before this async
  // function can yield. Caller mutation/accessors can never influence a later
  // reconciliation, definition lookup, or execution boundary.
  const identity = captureSerializableProductionRequest(request);
  if (identity === null) return result(false, "STAGE_REQUEST_SHAPE_INVALID");
  const repoRoot = DEFAULT_REPO_ROOT;
  const runtimeRoot = await defaultRuntimeRoot(repoRoot);
  const reconciled = await reconcileTerminalStage({ request: identity, runtimeRoot });
  if (reconciled !== null) return reconciled;
  const definition = resolveProductionStagedAction(identity);
  if (!definition
    || definition.scopeClass !== identity.scopeClass
    || definition.actionClass !== identity.actionClass
    || (definition.predecessor?.receiptDigest ?? null) !== identity.predecessorReceiptSha256) {
    return result(false, "STAGE_ACTION_NOT_REVIEWED", { taskId: identity.taskId, stageId: identity.stageId });
  }
  const moduleEntry = PRODUCTION_MODULE_ALLOWLIST[definition.moduleId];
  if (!moduleEntry) return result(false, "STAGE_MODULE_NOT_ALLOWLISTED", { taskId: identity.taskId, stageId: identity.stageId });

  return executeResolvedStage({
    definition,
    moduleEntry,
    repoRoot,
    runtimeRoot,
    authorize: verifyStageGateBAtExactMain,
    verifyOutcome: verifyReviewedStageOutcome,
  });
}

/** Stage 0 recovery is fail-stuck; a later reviewed recovery registry must resolve this digest internally. */
export async function recoverReviewedStageLock(request = {}) {
  if (!hasExactKeys(request, PUBLIC_RECOVERY_REQUEST_KEYS)
    || typeof request.taskId !== "string"
    || typeof request.stageId !== "string"
    || typeof request.idempotencyKey !== "string"
    || !FULL_REVISION.test(request.sourceRevision ?? "")
    || !RECEIPT_DIGEST.test(request.stageBindingDigest ?? "")
    || !RECEIPT_DIGEST.test(request.recoveryReviewDigest ?? "")) {
    return result(false, "STAGE_LOCK_RECOVERY_REQUEST_INVALID");
  }
  return result(false, "STAGE_LOCK_RECOVERY_DISABLED_STAGE0", {
    taskId: request.taskId,
    stageId: request.stageId,
  });
}

async function selfTest() {
  const root = await mkdtemp(path.join(os.tmpdir(), "P0-stage-runner-"));
  let cases = 0;
  try {
    if (canonicalJson({ z: 1, list: [{ b: false, a: true }, "x"], a: { b: 2, a: 1 } })
      !== SPK_CANONICAL_JSON_VECTOR
      || sha256(Buffer.from(SPK_CANONICAL_JSON_VECTOR, "utf8")) !== SPK_CANONICAL_JSON_VECTOR_SHA256) {
      throw new Error("SPK canonical lexical-key vector case failed");
    }
    cases += 1;
    if (!spkIndependentOraclePasses()) {
      throw new Error("SPK independent primitive reconstruction case failed");
    }
    cases += 1;
    for (const componentName of Object.keys(SPK_INDEPENDENT_RECONSTRUCTION.oracleModel)) {
      const componentDrift = structuredClone(SPK_INDEPENDENT_RECONSTRUCTION);
      componentDrift.oracleModel[componentName].semanticDriftCanary = true;
      if (spkIndependentOraclePasses(componentDrift)) {
        throw new Error(`SPK independent ${componentName} semantic-drift case failed`);
      }
      cases += 1;
    }
    const fixtureDrift = structuredClone(SPK_INDEPENDENT_RECONSTRUCTION);
    fixtureDrift.fixture.capacity[0].peak += 1;
    const stateDrift = structuredClone(SPK_INDEPENDENT_RECONSTRUCTION);
    stateDrift.oracleModel.recovery.sourceDigest = `sha256:${"0".repeat(64)}`;
    const contractDrift = structuredClone(SPK_INDEPENDENT_RECONSTRUCTION);
    contractDrift.contract.moduleCapabilityProfile.externalIo = true;
    if (spkIndependentOraclePasses(fixtureDrift)
      || spkIndependentOraclePasses(stateDrift)
      || spkIndependentOraclePasses(contractDrift)) {
      throw new Error("SPK independent fixture/state/contract semantic-drift case failed");
    }
    cases += 3;
    const zeroEvidenceRequest = {
      moduleId: SPK_SYNTHETIC_MODULE_ID,
      taskId: SPK_SYNTHETIC_TASK_ID,
      stageId: SPK_SYNTHETIC_STAGE_ID,
      sourceRevision: SPK_ZERO_REVISION,
      stageBindingDigest: SPK_SYNTHETIC_STAGE_BINDING_DIGEST,
      moduleSha256: SPK_SYNTHETIC_MODULE_SHA256,
      evidenceDigest: SPK_ZERO_REVISION_EVIDENCE_SHA256,
    };
    const zeroEvidence = reconstructProductionGovernedEvidence(zeroEvidenceRequest);
    const zeroEvidenceBytes = zeroEvidence === null ? null : Buffer.from(canonicalJson(zeroEvidence), "utf8");
    if (zeroEvidence === null
      || zeroEvidenceBytes.length !== SPK_ZERO_REVISION_EVIDENCE_BYTE_LENGTH
      || zeroEvidenceBytes.toString("utf8") !== SPK_ZERO_REVISION_EVIDENCE_CANONICAL_BYTES
      || sha256(zeroEvidenceBytes) !== SPK_ZERO_REVISION_EVIDENCE_SHA256
      || zeroEvidence.requirementResults.length !== 11
      || zeroEvidence.scenarioResults.length !== 15
      || zeroEvidence.contractResults.length !== 8
      || zeroEvidence.conclusion !== "synthetic foundation passes"
      || !Object.isFrozen(zeroEvidence)
      || !Object.isFrozen(zeroEvidence.requirementResults)
      || !Object.isFrozen(zeroEvidence.safety)) {
      throw new Error("SPK governed evidence reconstruction/vector case failed");
    }
    cases += 1;
    const reorderedEvidence = JSON.parse(canonicalJson(zeroEvidence));
    reorderedEvidence.requirementResults.reverse();
    const missingScenarioEvidence = JSON.parse(canonicalJson(zeroEvidence));
    missingScenarioEvidence.scenarioResults.pop();
    const extraKeyEvidence = JSON.parse(canonicalJson(zeroEvidence));
    extraKeyEvidence.unreviewed = true;
    if (spkDigest(reorderedEvidence) === SPK_ZERO_REVISION_EVIDENCE_SHA256
      || spkDigest(missingScenarioEvidence) === SPK_ZERO_REVISION_EVIDENCE_SHA256
      || spkDigest(extraKeyEvidence) === SPK_ZERO_REVISION_EVIDENCE_SHA256) {
      throw new Error("SPK array-order/missing-record/extra-key semantic drift case failed");
    }
    cases += 1;
    if (reconstructProductionGovernedEvidence({
      ...zeroEvidenceRequest,
      evidenceDigest: `sha256:${"0".repeat(64)}`,
    }) !== null
      || reconstructProductionGovernedEvidence({ ...zeroEvidenceRequest, extra: true }) !== null
      || reconstructProductionGovernedEvidence(new Proxy({}, {})) !== null) {
      throw new Error("SPK governed evidence digest/shape/proxy fail-closed case failed");
    }
    cases += 1;
    let reconstructionAccessorReads = 0;
    const reconstructionAccessorRequest = { ...zeroEvidenceRequest };
    Object.defineProperty(reconstructionAccessorRequest, "evidenceDigest", {
      enumerable: true,
      get() {
        reconstructionAccessorReads += 1;
        return SPK_ZERO_REVISION_EVIDENCE_SHA256;
      },
    });
    if (reconstructProductionGovernedEvidence(reconstructionAccessorRequest) !== null
      || reconstructionAccessorReads !== 0) {
      throw new Error("SPK governed evidence accessor fail-closed case failed");
    }
    cases += 1;
    const zeroChild = spkSyntheticChildResult(SPK_ZERO_REVISION, SPK_ZERO_REVISION_EVIDENCE_SHA256);
    const zeroChildCanonicalBytes = canonicalJson(zeroChild);
    const zeroChildTerminalBytes = Buffer.from(`${zeroChildCanonicalBytes}\n`, "utf8");
    if (zeroChildCanonicalBytes !== SPK_ZERO_REVISION_CHILD_CANONICAL_BYTES
      || sha256(Buffer.from(zeroChildCanonicalBytes, "utf8")) !== SPK_ZERO_REVISION_CHILD_CANONICAL_SHA256
      || zeroChildTerminalBytes.length !== SPK_ZERO_REVISION_CHILD_TERMINAL_BYTE_LENGTH
      || sha256(zeroChildTerminalBytes) !== SPK_ZERO_REVISION_CHILD_TERMINAL_SHA256) {
      throw new Error("SPK child canonical/LF vector case failed");
    }
    cases += 1;
    const zeroVerificationRequest = {
      schemaVersion: "1.0.0",
      boundary: "immediate",
      moduleId: SPK_SYNTHETIC_MODULE_ID,
      taskId: SPK_SYNTHETIC_TASK_ID,
      stageId: SPK_SYNTHETIC_STAGE_ID,
      sourceRevision: SPK_ZERO_REVISION,
      stageBindingDigest: SPK_SYNTHETIC_STAGE_BINDING_DIGEST,
      moduleSha256: SPK_SYNTHETIC_MODULE_SHA256,
      childResultSha256: SPK_ZERO_REVISION_CHILD_TERMINAL_SHA256,
      evidenceDigest: SPK_ZERO_REVISION_EVIDENCE_SHA256,
    };
    for (const boundary of SPK_VERIFICATION_BOUNDARIES) {
      const verified = verifySpkSyntheticFoundationOutcome({ ...zeroVerificationRequest, boundary });
      if (verified?.outcome !== "pass"
        || verified.boundary !== boundary
        || verified.observationDigest !== SPK_ZERO_REVISION_BOUNDARY_OBSERVATION_SHA256[boundary]) {
        throw new Error(`SPK ${boundary} verifier reconstruction/vector case failed`);
      }
      cases += 1;
    }
    if (verifySpkSyntheticFoundationOutcome({ ...zeroVerificationRequest, boundary: "later" }) !== null
      || verifySpkSyntheticFoundationOutcome({
        ...zeroVerificationRequest,
        childResultSha256: `sha256:${"0".repeat(64)}`,
      }) !== null
      || verifySpkSyntheticFoundationOutcome({
        ...zeroVerificationRequest,
        evidenceDigest: `sha256:${"0".repeat(64)}`,
      }) !== null
      || verifySpkSyntheticFoundationOutcome({
        ...zeroVerificationRequest,
        moduleSha256: `sha256:${"0".repeat(64)}`,
      }) !== null
      || verifySpkSyntheticFoundationOutcome({ ...zeroVerificationRequest, echo: true }) !== null) {
      throw new Error("SPK verifier boundary/child/evidence/shape fail-closed case failed");
    }
    cases += 1;
    const scannerPositive = [
      "import { createCipheriv, createDecipheriv, createHash } from \"node:crypto\";",
      "import { writeFileSync } from \"node:fs\";",
      "const args = process.argv;",
      "const childResultBytes = Buffer.from(\"{}\\n\", \"utf8\");",
      "writeFileSync(3, childResultBytes);",
      "process.exitCode = args.length === 0 ? 0 : 75;",
      "",
    ].join("\n");
    if (validateSpkSyntheticModuleSource(scannerPositive)) {
      throw new Error("SPK production source gate accepted non-frozen bytes");
    }
    cases += 1;
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
    const scannerNegativeSources = [
      scannerCommentSpoofBypass,
      `${scannerPositive}\nimport(\"node:fs\");`,
      `${scannerPositive}\nconst loader = globalThis[\"im\" + \"port\"];`,
      `${scannerPositive}\nprocess.getBuiltinModule(\"node:fs\");`,
      `${scannerPositive}\nconst processAlias = process; processAlias[\"get\" + \"BuiltinModule\"](\"node:fs\");`,
      `${scannerPositive}\nconst { getBuiltinModule } = process; getBuiltinModule(\"node:fs\");`,
      `${scannerPositive}\nconst recovered = (() => {}).constructor(\"return globalThis\")();`,
      `${scannerPositive}\nconst property = \`con\${\"structor\"}\`; const recovered = (() => {})[property];`,
      `${scannerPositive}\nconst builtin = \"node:\" + \"fs\"; const readName = \"read\" + \"FileSync\";`,
      `${scannerPositive}\nconst writerAlias = writeFileSync; void writerAlias;`,
      `${scannerPositive}\nconst descriptor = Object[\"get\" + \"OwnPropertyDescriptor\"];`,
      `${scannerPositive}\nconst indirectLoader = (0, eval);`,
      `${scannerPositive}\nconst index = [\"con\", \"structor\"].join(\"\"); const base = () => {}; const recovered = base[index];`,
      `${scannerPositive}\nconst index = [\"con\", \"structor\"].join(\"\"); const { [index]: recovered } = createHash;`,
      `${scannerPositive}\nconst escaped = \\u0065val;`,
      `${scannerPositive}\nconst escapedGlobal = gl\\u006fbalThis;`,
      `${scannerPositive}\nconst indirect = global[\"process\"];`,
      `${scannerPositive}\nreadFileSync(\"fictional\");`,
      scannerPositive.replace("writeFileSync(3, childResultBytes);", "writeFileSync(4, childResultBytes);"),
      scannerPositive.replace("import { writeFileSync } from \"node:fs\";", "import * as fs from \"node:fs\";"),
      `${scannerPositive}\nconst decomposed = \"é\";`,
    ];
    for (const [index, source] of scannerNegativeSources.entries()) {
      if (validateSpkSyntheticModuleSource(source)) {
        throw new Error(`SPK alternate-source byte-gate negative case ${index + 1} failed`);
      }
      cases += 1;
    }
    const repoRoot = path.join(root, "repo");
    const runtimeRoot = path.join(root, "runtime");
    await mkdir(path.join(repoRoot, "tools"), { recursive: true });
    const tokenCanary = `${["g", "h", "p", "_"].join("")}ABCDEFGHIJKLMNOPQRSTUV`;
    const definitionFor = ({
      suffix = "SYNTHETIC-SHELL",
      moduleId = "eng.synthetic",
      argumentSetId = "synthetic.v1",
      deadlineMs = 5_000,
      scopeClass = "local-synthetic",
      actionClass = "synthetic-foundation",
      predecessor = null,
    } = {}) => ({
      schemaVersion: "1.0.0",
      taskId: "ENG-R0-001",
      scopeClass,
      actionClass,
      stageId: `P0-STAGE-ENG-R0-001-${suffix}`,
      predecessor,
      idempotencyKey: `P0-IDEMP-ENG-R0-001-${suffix}-001`,
      moduleId,
      argumentSetId,
      deadlineMs,
    });
    const childResultSource = ({ rawOutput = "", taskIdExpression = "binding('task-id')", prelude = "" } = {}) => [
      "import { writeFileSync } from 'node:fs';",
      prelude,
      "const binding = (name) => process.argv.find((value) => value.startsWith(`--p0-${name}=`))?.split('=', 2)[1];",
      rawOutput.length > 0 ? `process.stdout.write(${JSON.stringify(rawOutput)});` : "",
      "const childResult = {",
      "  schemaVersion: '1.0.0',",
      "  outcome: 'succeeded',",
      `  taskId: ${taskIdExpression},`,
      "  stageId: binding('stage-id'),",
      "  idempotencyKey: binding('idempotency-key'),",
      "  sourceRevision: binding('source-revision'),",
      "  stageBindingDigest: binding('stage-binding'),",
      `  evidenceDigest: ${JSON.stringify(`sha256:${"e".repeat(64)}`)},`,
      "};",
      "writeFileSync(3, `${JSON.stringify(childResult)}\\n`);",
      "",
    ].filter(Boolean).join("\n");
    const writeModule = async (name, source) => {
      const modulePath = path.join(repoRoot, "tools", name);
      await writeFile(modulePath, source, { mode: 0o600 });
      return modulePath;
    };
    const entryFor = async (definition, relativeName) => ({
      moduleId: definition.moduleId,
      moduleRelativePath: `tools/${relativeName}`,
      moduleSha256: sha256(await readFile(path.join(repoRoot, "tools", relativeName))),
      gitMode: "100644",
      argumentSets: { [definition.argumentSetId]: [] },
    });
    const authorizationFor = (definition, overrides = {}) => ({
      ok: true,
      scope: "stage-gate-b",
      code: "STAGE_GATE_B_READY",
      taskId: definition.taskId,
      stageId: definition.stageId,
      scopeClass: definition.scopeClass,
      actionClass: definition.actionClass,
      sourceRevision: "a".repeat(40),
      candidateRevision: "b".repeat(40),
      dossierDigest: "c".repeat(64),
      preparationReviewId: `P0-PREP-ENG-R0-001-${definition.stageId.split("-").slice(5).join("-")}`,
      gateKind: "execute",
      gateDecision: "Ready to execute — Gate B",
      independentQaResult: "pass",
      predecessorReceiptSha256: definition.predecessor?.receiptDigest ?? null,
      preparationReviewSha256: "d".repeat(64),
      idempotencyKey: definition.idempotencyKey,
      stageDefinitionSha256: stageBindingDigest(definition),
      moduleId: definition.moduleId,
      moduleSha256: null,
      stageApprovalSha256: "e".repeat(64),
      registrySha256: "f".repeat(64),
      gateSourceFingerprint: `sha256:${"1".repeat(64)}`,
      deadlineAt: new Date(Date.now() + 30_000).toISOString(),
      rollbackSnapshotReference: "rollback:synthetic-snapshot",
      ...overrides,
    });
    const terminalHistoryFor = (definition, authorization, overrides = {}) => ({
      ok: true,
      scope: "stage-terminal-history",
      code: "STAGE_TERMINAL_HISTORY_VALID",
      taskId: definition.taskId,
      stageId: definition.stageId,
      scopeClass: definition.scopeClass,
      actionClass: definition.actionClass,
      sourceRevision: authorization.sourceRevision,
      candidateRevision: authorization.candidateRevision,
      dossierDigest: authorization.dossierDigest,
      preparationReviewId: authorization.preparationReviewId,
      preparationReviewSha256: authorization.preparationReviewSha256,
      gateKind: authorization.gateKind,
      predecessorReceiptSha256: definition.predecessor?.receiptDigest ?? null,
      idempotencyKey: definition.idempotencyKey,
      stageDefinitionSha256: authorization.stageDefinitionSha256,
      moduleId: definition.moduleId,
      moduleSha256: authorization.moduleSha256,
      rollbackSnapshotReference: authorization.rollbackSnapshotReference,
      stageApprovalSha256: authorization.stageApprovalSha256,
      registrySha256: authorization.registrySha256,
      ...overrides,
    });
    const executeFixture = async (definition, moduleEntry, overrides = {}) => {
      const authorization = overrides.authorization ?? authorizationFor(definition, {
        moduleSha256: moduleEntry.moduleSha256,
      });
      return executeResolvedStage({
        definition,
        moduleEntry,
        repoRoot,
        runtimeRoot: overrides.runtimeRoot ?? runtimeRoot,
        authorize: overrides.authorize ?? (async () => authorization),
        verifyOutcome: overrides.verifyOutcome ?? (async (request) => ({
          schemaVersion: request.schemaVersion,
          outcome: "pass",
          boundary: request.boundary,
          taskId: request.taskId,
          stageId: request.stageId,
          sourceRevision: request.sourceRevision,
          stageBindingDigest: request.stageBindingDigest,
          moduleSha256: request.moduleSha256,
          childResultSha256: request.childResultSha256,
          evidenceDigest: request.evidenceDigest,
          observationDigest: sha256(`synthetic observation:${request.boundary}`),
        })),
        quiescenceIntervalMs: overrides.quiescenceIntervalMs ?? 5,
        clock: overrides.clock ?? (() => new Date()),
        spawnProcess: overrides.spawnProcess ?? spawn,
        appendJournalEvent: overrides.appendJournalEvent ?? appendEvent,
        syncEventFile: overrides.syncEventFile ?? syncRegularFile,
        syncEventDirectory: overrides.syncEventDirectory ?? syncDirectory,
        childLockRecordPersistBarrier: overrides.childLockRecordPersistBarrier ?? (async () => {}),
      });
    };
    const callbackCompletionFor = (definition, context, overrides = {}) => ({
      schemaVersion: definition.schemaVersion,
      outcome: "succeeded",
      taskId: context.taskId,
      scopeClass: context.scopeClass,
      actionClass: context.actionClass,
      stageId: context.stageId,
      predecessorReceiptSha256: context.predecessorReceiptSha256,
      idempotencyKey: context.idempotencyKey,
      sourceRevision: context.revision,
      candidateRevision: context.candidateRevision,
      stageBindingDigest: stageBindingDigest(definition),
      evidenceDigest: `sha256:${"9".repeat(64)}`,
      ...overrides,
    });
    const executeCallbackFixture = async (definition, moduleEntry, execute, overrides = {}) => {
      const authorization = overrides.authorization ?? authorizationFor(definition, {
        moduleSha256: moduleEntry.moduleSha256,
      });
      return executeResolvedCallbackStage({
        definition,
        moduleEntry,
        execute,
        repoRoot,
        runtimeRoot: overrides.runtimeRoot ?? runtimeRoot,
        authorize: overrides.authorize ?? (async () => authorization),
        verifyOutcome: overrides.verifyOutcome ?? (async (request) => ({
          schemaVersion: request.schemaVersion,
          outcome: "pass",
          boundary: request.boundary,
          taskId: request.taskId,
          stageId: request.stageId,
          sourceRevision: request.sourceRevision,
          stageBindingDigest: request.stageBindingDigest,
          moduleSha256: request.moduleSha256,
          childResultSha256: request.childResultSha256,
          evidenceDigest: request.evidenceDigest,
          observationDigest: sha256(`synthetic callback observation:${request.boundary}`),
        })),
        quiescenceIntervalMs: overrides.quiescenceIntervalMs ?? 5,
        clock: overrides.clock ?? primordialClock,
        appendJournalEvent: overrides.appendJournalEvent ?? appendEvent,
        syncEventFile: overrides.syncEventFile ?? syncRegularFile,
        syncEventDirectory: overrides.syncEventDirectory ?? syncDirectory,
        installStreamCapture: overrides.installStreamCapture ?? installCallbackStreamCapture,
      });
    };

    const definition = definitionFor();
    const successName = "P0-runner-fixture.mjs";
    await writeModule(successName, childResultSource({ rawOutput: `synthetic raw token: ${tokenCanary}\n` }));
    const moduleEntry = await entryFor(definition, successName);
    let authorizationCalls = 0;
    const stableAuthorization = authorizationFor(definition, { moduleSha256: moduleEntry.moduleSha256 });
    const succeeded = await executeFixture(definition, moduleEntry, {
      authorize: async () => {
        authorizationCalls += 1;
        return { ...stableAuthorization, deadlineAt: new Date(Date.now() + 30_000).toISOString() };
      },
    });
    if (succeeded.code !== "STAGE_SUCCEEDED" || JSON.stringify(succeeded).includes(tokenCanary)) {
      throw new Error("successful closed-output case failed");
    }
    cases += 1;
    const expectedPublicReceiptKeys = [
      "ok", "code", "taskId", "stageId", "gateKind", "scopeClass", "actionClass", "sourceRevision",
      "dossierDigest", "predecessorReceiptDigest", "idempotencyKey", "authorityDeadline", "authorityStatus",
      "state", "mutationStatement", "rollbackSnapshotReference", "immediateVerification",
      "quiescentVerification", "receiptDigest", "attempt", "consequence", "nextAction",
    ];
    if (canonicalJson(Object.keys(succeeded)) !== canonicalJson(expectedPublicReceiptKeys)
      || succeeded.gateKind !== "execute"
      || succeeded.authorityStatus !== "current"
      || succeeded.mutationStatement !== "Mutation verified complete"
      || succeeded.immediateVerification !== "pass"
      || succeeded.quiescentVerification !== "pass"
      || succeeded.nextAction !== "Run a separately reviewed delivery transition.") {
      throw new Error("ordered public operator receipt contract case failed");
    }
    cases += 1;
    const privatePathCanary = ["", "Users", "private", "raw-output"].join("/");
    if (sanitizedResultIsSafe({ ...succeeded, nextAction: privatePathCanary })) {
      throw new Error("public operator receipt private-path rejection case failed");
    }
    cases += 1;
    if (authorizationCalls !== 10) throw new Error("post-action authorization count case failed");
    cases += 1;
    const successKey = safeRuntimeSegment(`${definition.taskId}\0${definition.stageId}\0${definition.idempotencyKey}`);
    const successEvents = await readEvents(path.join(runtimeRoot, successKey, "events"));
    if (successEvents.map((event) => event.state).join(",") !== "running,verification-pending,verified-complete") {
      throw new Error("verification-pending ordering case failed");
    }
    cases += 1;
    const terminalVerificationDigests = [
      successEvents.at(-1).receipt.immediateVerificationSha256,
      successEvents.at(-1).receipt.quiescent1VerificationSha256,
      successEvents.at(-1).receipt.quiescent2VerificationSha256,
    ];
    const terminalVerificationResults = [
      successEvents.at(-1).receipt.immediateVerificationResult,
      successEvents.at(-1).receipt.quiescent1VerificationResult,
      successEvents.at(-1).receipt.quiescent2VerificationResult,
    ];
    if (!terminalVerificationDigests.every((digest) => RECEIPT_DIGEST.test(digest ?? ""))
      || new Set(terminalVerificationDigests).size !== 3
      || !terminalVerificationResults.every((outcome) => outcome === "pass")) {
      throw new Error("terminal outcome-verification binding case failed");
    }
    cases += 1;

    const preSpawnExpiryDefinition = definitionFor({ suffix: "PRESPAWN-DELAYED-EXPIRY" });
    const preSpawnExpiryEntry = await entryFor(preSpawnExpiryDefinition, successName);
    let preSpawnNowMs = Date.now();
    const preSpawnExpiryAuthorization = authorizationFor(preSpawnExpiryDefinition, {
      moduleSha256: preSpawnExpiryEntry.moduleSha256,
      deadlineAt: new Date(preSpawnNowMs + 1_000).toISOString(),
    });
    let expiredSpawnCount = 0;
    const delayedRunningJournal = async (directory, sequence, event) => {
      const eventPath = await appendEvent(directory, sequence, event);
      if (sequence === 1 && event.state === "running") preSpawnNowMs += 2_000;
      return eventPath;
    };
    const preSpawnExpired = await executeFixture(preSpawnExpiryDefinition, preSpawnExpiryEntry, {
      authorization: preSpawnExpiryAuthorization,
      clock: () => new Date(preSpawnNowMs),
      appendJournalEvent: delayedRunningJournal,
      spawnProcess: (...args) => {
        expiredSpawnCount += 1;
        return spawn(...args);
      },
    });
    const preSpawnExpiryKey = safeRuntimeSegment(`${preSpawnExpiryDefinition.taskId}\0${preSpawnExpiryDefinition.stageId}\0${preSpawnExpiryDefinition.idempotencyKey}`);
    const preSpawnExpiryEvents = await readEvents(path.join(runtimeRoot, preSpawnExpiryKey, "events"));
    if (preSpawnExpired.code !== "STAGE_EXPIRED_BEFORE_MUTATION"
      || expiredSpawnCount !== 0
      || preSpawnExpiryEvents.map((event) => event.state).join(",") !== "running,expired-before-mutation") {
      throw new Error("serializable delayed pre-spawn expiry zero-child case failed");
    }
    cases += 1;

    const preSpawnDriftDefinition = definitionFor({ suffix: "PRESPAWN-AUTHORITY-DRIFT" });
    const preSpawnDriftEntry = await entryFor(preSpawnDriftDefinition, successName);
    const preSpawnStableAuthorization = authorizationFor(preSpawnDriftDefinition, {
      moduleSha256: preSpawnDriftEntry.moduleSha256,
    });
    let preSpawnAuthorizationCalls = 0;
    let driftSpawnCount = 0;
    let runningJournalPersisted = false;
    const driftAfterRunningJournal = async (directory, sequence, event) => {
      const eventPath = await appendEvent(directory, sequence, event);
      if (sequence === 1 && event.state === "running") runningJournalPersisted = true;
      return eventPath;
    };
    const preSpawnDrift = await executeFixture(preSpawnDriftDefinition, preSpawnDriftEntry, {
      authorize: async () => {
        preSpawnAuthorizationCalls += 1;
        return !runningJournalPersisted
          ? preSpawnStableAuthorization
          : { ...preSpawnStableAuthorization, stageApprovalSha256: "0".repeat(64) };
      },
      appendJournalEvent: driftAfterRunningJournal,
      spawnProcess: (...args) => {
        driftSpawnCount += 1;
        return spawn(...args);
      },
    });
    const preSpawnDriftKey = safeRuntimeSegment(`${preSpawnDriftDefinition.taskId}\0${preSpawnDriftDefinition.stageId}\0${preSpawnDriftDefinition.idempotencyKey}`);
    const preSpawnDriftEvents = await readEvents(path.join(runtimeRoot, preSpawnDriftKey, "events"));
    if (preSpawnDrift.code !== "STAGE_BLOCKED_NO_MUTATION"
      || preSpawnAuthorizationCalls !== 2
      || !runningJournalPersisted
      || driftSpawnCount !== 0
      || preSpawnDriftEvents.map((event) => event.state).join(",") !== "running,blocked-no-mutation") {
      throw new Error("serializable pre-spawn authority drift zero-child case failed");
    }
    cases += 1;

    const preSignalDriftDefinition = definitionFor({ suffix: "PRESIGNAL-AUTHORITY-DRIFT" });
    const preSignalDriftEntry = await entryFor(preSignalDriftDefinition, successName);
    const preSignalDriftRuntimeRoot = path.join(root, "pre-signal-authority-drift-runtime");
    const preSignalStableAuthorization = authorizationFor(preSignalDriftDefinition, {
      moduleSha256: preSignalDriftEntry.moduleSha256,
    });
    let preSignalBarrierReached = false;
    let preSignalAuthorizationCalls = 0;
    let preSignalSpawnCount = 0;
    let preSignalChild = null;
    const preSignalDrift = await executeFixture(preSignalDriftDefinition, preSignalDriftEntry, {
      runtimeRoot: preSignalDriftRuntimeRoot,
      authorize: async () => {
        preSignalAuthorizationCalls += 1;
        return preSignalBarrierReached
          ? { ...preSignalStableAuthorization, stageApprovalSha256: "0".repeat(64) }
          : preSignalStableAuthorization;
      },
      childLockRecordPersistBarrier: async () => {
        preSignalBarrierReached = true;
        await Promise.resolve();
      },
      spawnProcess: (...args) => {
        preSignalSpawnCount += 1;
        preSignalChild = spawn(...args);
        return preSignalChild;
      },
    });
    const preSignalDriftKey = safeRuntimeSegment(`${preSignalDriftDefinition.taskId}\0${preSignalDriftDefinition.stageId}\0${preSignalDriftDefinition.idempotencyKey}`);
    const preSignalDriftEvents = await readEvents(path.join(preSignalDriftRuntimeRoot, preSignalDriftKey, "events"));
    const preSignalChildResultBytes = await readFile(path.join(
      preSignalDriftRuntimeRoot,
      preSignalDriftKey,
      "raw-evidence",
      "child-result.json",
    ));
    if (preSignalDrift.code !== "STAGE_BLOCKED_NO_MUTATION"
      || preSignalSpawnCount !== 1
      || preSignalAuthorizationCalls !== 3
      || !preSignalBarrierReached
      || preSignalChildResultBytes.length !== 0
      || processTreeAlive(preSignalChild)
      || preSignalDriftEvents.map((event) => event.state).join(",") !== "running,blocked-no-mutation") {
      throw new Error("serializable post-lock pre-signal authority drift case failed");
    }
    cases += 1;

    const preSignalDriftReplay = await executeFixture(preSignalDriftDefinition, preSignalDriftEntry, {
      runtimeRoot: preSignalDriftRuntimeRoot,
      spawnProcess: (...args) => {
        preSignalSpawnCount += 1;
        return spawn(...args);
      },
    });
    if (preSignalDriftReplay.code !== "STAGE_ALREADY_TERMINAL"
      || preSignalSpawnCount !== 1
      || preSignalChildResultBytes.length !== 0) {
      throw new Error("serializable post-lock pre-signal authority drift replay case failed");
    }
    cases += 1;

    const preSignalExpiryDefinition = definitionFor({ suffix: "PRESIGNAL-DEADLINE-EXPIRY" });
    const preSignalExpiryEntry = await entryFor(preSignalExpiryDefinition, successName);
    const preSignalExpiryRuntimeRoot = path.join(root, "pre-signal-deadline-expiry-runtime");
    const preSignalExpiryAuthorization = authorizationFor(preSignalExpiryDefinition, {
      moduleSha256: preSignalExpiryEntry.moduleSha256,
      deadlineAt: new Date(Date.now() + 4_000).toISOString(),
    });
    let preSignalExpirySpawnCount = 0;
    let preSignalExpiryChild = null;
    let preSignalExpiryBarrierCount = 0;
    const preSignalExpired = await executeFixture(preSignalExpiryDefinition, preSignalExpiryEntry, {
      runtimeRoot: preSignalExpiryRuntimeRoot,
      authorization: preSignalExpiryAuthorization,
      childLockRecordPersistBarrier: async () => {
        preSignalExpiryBarrierCount += 1;
        await delay(4_200);
      },
      spawnProcess: (...args) => {
        preSignalExpirySpawnCount += 1;
        preSignalExpiryChild = spawn(...args);
        return preSignalExpiryChild;
      },
    });
    const preSignalExpiryKey = safeRuntimeSegment(`${preSignalExpiryDefinition.taskId}\0${preSignalExpiryDefinition.stageId}\0${preSignalExpiryDefinition.idempotencyKey}`);
    const preSignalExpiryEvents = await readEvents(path.join(preSignalExpiryRuntimeRoot, preSignalExpiryKey, "events"));
    const preSignalExpiryChildResultBytes = await readFile(path.join(
      preSignalExpiryRuntimeRoot,
      preSignalExpiryKey,
      "raw-evidence",
      "child-result.json",
    ));
    if (preSignalExpired.code !== "STAGE_EXPIRED_BEFORE_MUTATION"
      || preSignalExpirySpawnCount !== 1
      || preSignalExpiryBarrierCount !== 1
      || preSignalExpiryChildResultBytes.length !== 0
      || processTreeAlive(preSignalExpiryChild)
      || preSignalExpiryEvents.map((event) => event.state).join(",") !== "running,expired-before-mutation") {
      throw new Error("serializable post-lock pre-signal deadline termination case failed");
    }
    cases += 1;

    const preSignalExpiryReplay = await executeFixture(preSignalExpiryDefinition, preSignalExpiryEntry, {
      runtimeRoot: preSignalExpiryRuntimeRoot,
      authorization: preSignalExpiryAuthorization,
      spawnProcess: (...args) => {
        preSignalExpirySpawnCount += 1;
        return spawn(...args);
      },
    });
    if (preSignalExpiryReplay.code !== "STAGE_ALREADY_TERMINAL"
      || preSignalExpirySpawnCount !== 1
      || preSignalExpiryChildResultBytes.length !== 0) {
      throw new Error("serializable post-lock pre-signal deadline replay case failed");
    }
    cases += 1;

    const replay = await executeFixture(definition, moduleEntry);
    if (replay.code !== "STAGE_ALREADY_SUCCEEDED" || replay.receiptDigest !== succeeded.receiptDigest) {
      throw new Error("idempotent replay case failed");
    }
    cases += 1;
    const crossRevisionReplay = await executeFixture(definition, moduleEntry, {
      authorization: authorizationFor(definition, {
        moduleSha256: moduleEntry.moduleSha256,
        sourceRevision: "2".repeat(40),
        registrySha256: "3".repeat(64),
        gateSourceFingerprint: `sha256:${"4".repeat(64)}`,
      }),
    });
    const changedImmutableBindingReplay = await executeFixture(definition, moduleEntry, {
      authorization: authorizationFor(definition, {
        moduleSha256: moduleEntry.moduleSha256,
        sourceRevision: "2".repeat(40),
        registrySha256: "3".repeat(64),
        gateSourceFingerprint: `sha256:${"4".repeat(64)}`,
        dossierDigest: "5".repeat(64),
      }),
    });
    const laterHistoryAuthorization = authorizationFor(definition, {
      moduleSha256: moduleEntry.moduleSha256,
      sourceRevision: "6".repeat(40),
      registrySha256: "7".repeat(64),
      gateSourceFingerprint: `sha256:${"8".repeat(64)}`,
    });
    const readOnlyHistoryReplay = await reconcileTerminalStage({
      request: bindingRequest(definition),
      runtimeRoot,
      verifyHistory: async () => terminalHistoryFor(definition, laterHistoryAuthorization),
    });
    const readOnlyHistoryBindingDrift = await reconcileTerminalStage({
      request: bindingRequest(definition),
      runtimeRoot,
      verifyHistory: async () => terminalHistoryFor(definition, laterHistoryAuthorization, {
        dossierDigest: "9".repeat(64),
      }),
    });
    if (crossRevisionReplay.code !== "STAGE_ALREADY_SUCCEEDED"
      || crossRevisionReplay.receiptDigest !== succeeded.receiptDigest
      || changedImmutableBindingReplay.code !== "STAGE_RECEIPT_INVALID"
      || readOnlyHistoryReplay.code !== "STAGE_ALREADY_SUCCEEDED"
      || readOnlyHistoryReplay.receiptDigest !== succeeded.receiptDigest
      || readOnlyHistoryBindingDrift.code !== "STAGE_RECEIPT_INVALID") {
      throw new Error("cross-revision idempotency case failed");
    }
    cases += 1;

    const rawOutput = await readFile(path.join(runtimeRoot, successKey, "raw-evidence", "stdout.raw"), "utf8");
    if (!rawOutput.includes(tokenCanary)) throw new Error("raw evidence direct-custody case failed");
    cases += 1;

    for (const injected of [
      { command: "sh" },
      { path: "/tmp/evil" },
      { env: { TOKEN: "x" } },
      { callback: "evil" },
      { output: "raw" },
      { trust: true },
    ]) {
      const denied = await runSerializableStageFromExactMain({
        taskId: definition.taskId,
        scopeClass: definition.scopeClass,
        actionClass: definition.actionClass,
        stageId: definition.stageId,
        predecessorReceiptSha256: null,
        idempotencyKey: definition.idempotencyKey,
        ...injected,
      });
      if (denied.code !== "STAGE_REQUEST_SHAPE_INVALID") throw new Error("injection case failed");
      cases += 1;
    }
    const unreviewed = await runSerializableStageFromExactMain({
      taskId: definition.taskId,
      scopeClass: definition.scopeClass,
      actionClass: definition.actionClass,
      stageId: definition.stageId,
      predecessorReceiptSha256: null,
      idempotencyKey: definition.idempotencyKey,
    });
    if (unreviewed.code !== "STAGE_ACTION_NOT_REVIEWED") throw new Error("empty production allowlist case failed");
    cases += 1;

    const deniedDefinition = definitionFor({ suffix: "INVALID-AUTHORIZATION" });
    const deniedEntry = { ...moduleEntry, moduleId: deniedDefinition.moduleId };
    const invalidContext = await executeFixture(deniedDefinition, deniedEntry, {
      authorization: authorizationFor(deniedDefinition, {
        moduleSha256: deniedEntry.moduleSha256,
        taskId: "REL-R0-001",
      }),
    });
    if (invalidContext.code !== "STAGE_GATE_B_DENIED") throw new Error("Gate B context binding case failed");
    cases += 1;

    const missingPredecessorDefinition = definitionFor({
      suffix: "PRIVATE-DEPLOY",
      scopeClass: "private-execution",
      actionClass: "deployment",
      predecessor: {
        stageId: definition.stageId,
        receiptDigest: `sha256:${"f".repeat(64)}`,
      },
    });
    const missingPredecessor = await executeFixture(missingPredecessorDefinition, moduleEntry);
    if (missingPredecessor.code !== "STAGE_PREDECESSOR_RECEIPT_MISSING") {
      throw new Error("predecessor receipt existence case failed");
    }
    cases += 1;

    const tamperedDefinition = definitionFor({ suffix: "TAMPERED-MODULE" });
    const tamperedModule = await executeFixture(tamperedDefinition, {
      ...moduleEntry,
      moduleSha256: `sha256:${"0".repeat(64)}`,
    });
    if (tamperedModule.code !== "STAGE_MODULE_NOT_ALLOWLISTED") {
      throw new Error("tampered module digest case failed");
    }
    cases += 1;

    const interruptedDefinition = definitionFor({ suffix: "INTERRUPTED" });
    const interruptedKey = safeRuntimeSegment(`${interruptedDefinition.taskId}\0${interruptedDefinition.stageId}\0${interruptedDefinition.idempotencyKey}`);
    const interruptedEvents = path.join(runtimeRoot, interruptedKey, "events");
    await mkdir(interruptedEvents, { recursive: true });
    await appendEvent(interruptedEvents, 1, {
      schemaVersion: interruptedDefinition.schemaVersion,
      state: "running",
      occurredAt: new Date().toISOString(),
      processGroupId: null,
      sourceRevision: stableAuthorization.sourceRevision,
      stageBindingDigest: stageBindingDigest(interruptedDefinition),
      executorSha256: moduleEntry.moduleSha256,
    });
    const interrupted = await executeFixture(interruptedDefinition, moduleEntry);
    if (interrupted.code !== "STAGE_RECOVERY_REQUIRED" || interrupted.state !== "recovery-required") {
      throw new Error("interrupted journal recovery case failed");
    }
    cases += 1;

    const noResultName = "P0-runner-no-result-fixture.mjs";
    await writeModule(noResultName, "process.stdout.write('exit zero without a result receipt\\n');\n");
    const noResultDefinition = definitionFor({ suffix: "NO-CHILD-RESULT", moduleId: "eng.no-result", argumentSetId: "no-result.v1" });
    const noResult = await executeFixture(noResultDefinition, await entryFor(noResultDefinition, noResultName));
    if (noResult.code !== "STAGE_RECOVERY_REQUIRED") throw new Error("exit-zero child-result requirement case failed");
    cases += 1;

    const wrongResultName = "P0-runner-wrong-result-fixture.mjs";
    await writeModule(wrongResultName, childResultSource({ taskIdExpression: "'REL-R0-001'" }));
    const wrongResultDefinition = definitionFor({ suffix: "WRONG-CHILD-RESULT", moduleId: "eng.wrong-result", argumentSetId: "wrong-result.v1" });
    const wrongResult = await executeFixture(wrongResultDefinition, await entryFor(wrongResultDefinition, wrongResultName));
    if (wrongResult.code !== "STAGE_RECOVERY_REQUIRED") throw new Error("child-result binding case failed");
    cases += 1;

    const serialPendingFileSyncDefinition = definitionFor({ suffix: "SERIAL-PENDING-FILESYNC-FAIL-STUCK" });
    const serialPendingFileSyncEntry = await entryFor(serialPendingFileSyncDefinition, successName);
    const serialPendingFileSyncRuntimeRoot = path.join(root, "serial-pending-filesync-fail-stuck-runtime");
    let serialPendingSpawnCount = 0;
    let serialPendingFileSyncAttempts = 0;
    let serialPendingRecoveryAppendAttempts = 0;
    const appendSerialPendingThenThrow = async (directory, sequence, event) => {
      if (event.state === "recovery-required") serialPendingRecoveryAppendAttempts += 1;
      const eventPath = await appendEvent(directory, sequence, event);
      if (sequence === 2 && event.state === "verification-pending") {
        throw new Error("synthetic serializable verification-pending file fsync uncertainty");
      }
      return eventPath;
    };
    const serialPendingFileSyncFailure = await executeFixture(
      serialPendingFileSyncDefinition,
      serialPendingFileSyncEntry,
      {
        runtimeRoot: serialPendingFileSyncRuntimeRoot,
        appendJournalEvent: appendSerialPendingThenThrow,
        syncEventFile: async () => {
          serialPendingFileSyncAttempts += 1;
          throw new Error("synthetic serializable tail file fsync failure");
        },
        spawnProcess: (...args) => {
          serialPendingSpawnCount += 1;
          return spawn(...args);
        },
      },
    );
    const serialPendingFileSyncKey = safeRuntimeSegment(`${serialPendingFileSyncDefinition.taskId}\0${serialPendingFileSyncDefinition.stageId}\0${serialPendingFileSyncDefinition.idempotencyKey}`);
    const serialPendingFileSyncLockPath = path.join(
      serialPendingFileSyncRuntimeRoot,
      "locks",
      `${serialPendingFileSyncKey}.lock`,
    );
    const serialPendingFileSyncEvents = await readEvents(path.join(
      serialPendingFileSyncRuntimeRoot,
      serialPendingFileSyncKey,
      "events",
    ));
    let serialPendingFileSyncLockRetained = true;
    try {
      await access(serialPendingFileSyncLockPath, fsConstants.F_OK);
    } catch {
      serialPendingFileSyncLockRetained = false;
    }
    if (serialPendingFileSyncFailure.code !== "STAGE_RECOVERY_REQUIRED"
      || serialPendingSpawnCount !== 1
      || serialPendingFileSyncAttempts !== 1
      || serialPendingRecoveryAppendAttempts !== 0
      || serialPendingFileSyncEvents.map((event) => event.state).join(",") !== "running,verification-pending"
      || !serialPendingFileSyncLockRetained) {
      throw new Error("serializable verification-pending predecessor durability case failed");
    }
    cases += 1;

    const serialPendingFileSyncReplay = await executeFixture(
      serialPendingFileSyncDefinition,
      serialPendingFileSyncEntry,
      {
        runtimeRoot: serialPendingFileSyncRuntimeRoot,
        spawnProcess: (...args) => {
          serialPendingSpawnCount += 1;
          return spawn(...args);
        },
      },
    );
    if (serialPendingFileSyncReplay.code !== "STAGE_LOCK_UNAVAILABLE"
      || serialPendingSpawnCount !== 1) {
      throw new Error("serializable file-fsync-unproven replay lock case failed");
    }
    cases += 1;

    const escapedMarker = path.join(root, "escaped-descendant.txt");
    const detachedName = "P0-runner-detached-fixture.mjs";
    const detachedPrelude = [
      "import { spawn } from 'node:child_process';",
      "let detachedDenied = false;",
      "try {",
      `  const escaped = spawn(process.execPath, ['-e', ${JSON.stringify(`require('node:fs').writeFileSync(${JSON.stringify(escapedMarker)}, 'escaped')`)}], { detached: true, stdio: 'ignore' });`,
      "  escaped.unref();",
      "} catch (error) { detachedDenied = error?.code === 'ERR_ACCESS_DENIED'; }",
      "if (!detachedDenied) process.exit(74);",
    ].join("\n");
    await writeModule(detachedName, childResultSource({ prelude: detachedPrelude }));
    const detachedDefinition = definitionFor({ suffix: "DETACHED-DESCENDANT", moduleId: "eng.detached", argumentSetId: "detached.v1" });
    const detachedResult = await executeFixture(detachedDefinition, await entryFor(detachedDefinition, detachedName));
    if (detachedResult.code !== "STAGE_SUCCEEDED") throw new Error("detached descendant denial case failed");
    cases += 1;
    await delay(100);
    let markerExists = true;
    try { await access(escapedMarker); } catch { markerExists = false; }
    if (markerExists) throw new Error("detached descendant escaped containment");
    cases += 1;

    const revokedDefinition = definitionFor({ suffix: "POST-ACTION-REVOKED" });
    let revokeCalls = 0;
    const revokedAuthorization = authorizationFor(revokedDefinition, { moduleSha256: moduleEntry.moduleSha256 });
    const revoked = await executeFixture(revokedDefinition, moduleEntry, {
      authorize: async () => {
        revokeCalls += 1;
        return revokeCalls <= 3
          ? revokedAuthorization
          : { ...revokedAuthorization, stageApprovalSha256: "0".repeat(64) };
      },
    });
    if (revoked.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID" || revoked.state !== "recovery-required") {
      throw new Error("post-action authority revocation case failed");
    }
    cases += 1;

    const expiredDuringVerificationDefinition = definitionFor({ suffix: "EXPIRED-DURING-VERIFICATION" });
    let verifierNowMs = Date.now();
    const expiredDuringVerificationAuthorization = authorizationFor(expiredDuringVerificationDefinition, {
      moduleSha256: moduleEntry.moduleSha256,
      deadlineAt: new Date(verifierNowMs + 30_000).toISOString(),
    });
    const expiredDuringVerification = await executeFixture(expiredDuringVerificationDefinition, moduleEntry, {
      authorization: expiredDuringVerificationAuthorization,
      clock: () => new Date(verifierNowMs),
      verifyOutcome: async (request) => {
        if (request.boundary === "quiescent-2") verifierNowMs += 31_000;
        return {
          schemaVersion: request.schemaVersion,
          outcome: "pass",
          boundary: request.boundary,
          taskId: request.taskId,
          stageId: request.stageId,
          sourceRevision: request.sourceRevision,
          stageBindingDigest: request.stageBindingDigest,
          moduleSha256: request.moduleSha256,
          childResultSha256: request.childResultSha256,
          evidenceDigest: request.evidenceDigest,
          observationDigest: sha256(`synthetic slow observation:${request.boundary}`),
        };
      },
    });
    if (expiredDuringVerification.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID"
      || expiredDuringVerification.state !== "recovery-required") {
      throw new Error("authority expiry during outcome verification case failed");
    }
    cases += 1;
    const expiredDuringVerificationKey = safeRuntimeSegment(`${expiredDuringVerificationDefinition.taskId}\0${expiredDuringVerificationDefinition.stageId}\0${expiredDuringVerificationDefinition.idempotencyKey}`);
    const expiredDuringVerificationEvents = await readEvents(path.join(runtimeRoot, expiredDuringVerificationKey, "events"));
    if (expiredDuringVerificationEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("expired outcome verification became replayable success");
    }
    cases += 1;

    const serialRefreshStraddleDefinition = definitionFor({ suffix: "REFRESH-DEADLINE-STRADDLE" });
    const serialRefreshStraddleEntry = await entryFor(serialRefreshStraddleDefinition, successName);
    const serialRefreshStraddleRuntimeRoot = path.join(root, "serial-refresh-deadline-straddle-runtime");
    let serialRefreshNowMs = Date.now();
    const serialRefreshAuthorization = authorizationFor(serialRefreshStraddleDefinition, {
      moduleSha256: serialRefreshStraddleEntry.moduleSha256,
      deadlineAt: new Date(serialRefreshNowMs + 30_000).toISOString(),
    });
    let serialRefreshAuthorizationCalls = 0;
    let serialRefreshSpawnCount = 0;
    const serialRefreshStraddle = await executeFixture(
      serialRefreshStraddleDefinition,
      serialRefreshStraddleEntry,
      {
        runtimeRoot: serialRefreshStraddleRuntimeRoot,
        clock: () => new Date(serialRefreshNowMs),
        authorize: async () => {
          serialRefreshAuthorizationCalls += 1;
          if (serialRefreshAuthorizationCalls === 4) {
            await Promise.resolve();
            serialRefreshNowMs += 6_000;
            return {
              ...serialRefreshAuthorization,
              deadlineAt: new Date(serialRefreshNowMs + 60_000).toISOString(),
            };
          }
          return serialRefreshAuthorization;
        },
        spawnProcess: (...args) => {
          serialRefreshSpawnCount += 1;
          return spawn(...args);
        },
      },
    );
    const serialRefreshStraddleKey = safeRuntimeSegment(`${serialRefreshStraddleDefinition.taskId}\0${serialRefreshStraddleDefinition.stageId}\0${serialRefreshStraddleDefinition.idempotencyKey}`);
    const serialRefreshStraddleEvents = await readEvents(path.join(
      serialRefreshStraddleRuntimeRoot,
      serialRefreshStraddleKey,
      "events",
    ));
    if (serialRefreshStraddle.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID"
      || serialRefreshAuthorizationCalls !== 4
      || serialRefreshSpawnCount !== 1
      || serialRefreshStraddleEvents.map((event) => event.state).join(",") !== "running,verification-pending,recovery-required"
      || serialRefreshStraddleEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("serializable post-refresh fixed-deadline straddle case failed");
    }
    cases += 1;

    const serialRefreshStraddleReplay = await executeFixture(
      serialRefreshStraddleDefinition,
      serialRefreshStraddleEntry,
      {
        runtimeRoot: serialRefreshStraddleRuntimeRoot,
        authorization: serialRefreshAuthorization,
        clock: () => new Date(serialRefreshNowMs),
        spawnProcess: (...args) => {
          serialRefreshSpawnCount += 1;
          return spawn(...args);
        },
      },
    );
    const serialRefreshReplayEvents = await readEvents(path.join(
      serialRefreshStraddleRuntimeRoot,
      serialRefreshStraddleKey,
      "events",
    ));
    if (serialRefreshStraddleReplay.code !== "STAGE_RECOVERY_REQUIRED"
      || serialRefreshSpawnCount !== 1
      || serialRefreshReplayEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("serializable post-refresh fixed-deadline replay case failed");
    }
    cases += 1;

    const verificationDriftDefinition = definitionFor({ suffix: "QUIESCENT-OUTCOME-DRIFT" });
    const verificationDrift = await executeFixture(verificationDriftDefinition, moduleEntry, {
      verifyOutcome: async (request) => ({
        schemaVersion: request.schemaVersion,
        outcome: request.boundary === "quiescent-1" ? "hold" : "pass",
        boundary: request.boundary,
        taskId: request.taskId,
        stageId: request.stageId,
        sourceRevision: request.sourceRevision,
        stageBindingDigest: request.stageBindingDigest,
        moduleSha256: request.moduleSha256,
        childResultSha256: request.childResultSha256,
        evidenceDigest: request.evidenceDigest,
        observationDigest: sha256(`synthetic drift observation:${request.boundary}`),
      }),
    });
    if (verificationDrift.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID") {
      throw new Error("quiescent outcome drift case failed");
    }
    cases += 1;
    const verificationDriftKey = safeRuntimeSegment(`${verificationDriftDefinition.taskId}\0${verificationDriftDefinition.stageId}\0${verificationDriftDefinition.idempotencyKey}`);
    const verificationDriftEvents = await readEvents(path.join(runtimeRoot, verificationDriftKey, "events"));
    if (verificationDriftEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("quiescent outcome drift became replayable success");
    }
    cases += 1;
    const revokedKey = safeRuntimeSegment(`${revokedDefinition.taskId}\0${revokedDefinition.stageId}\0${revokedDefinition.idempotencyKey}`);
    const revokedEvents = await readEvents(path.join(runtimeRoot, revokedKey, "events"));
    if (revokedEvents.some((event) => event.state === "verified-complete")
      || revokedEvents.map((event) => event.state).join(",") !== "running,verification-pending,recovery-required") {
      throw new Error("pending receipt replay safety case failed");
    }
    cases += 1;

    const staleDefinition = definitionFor({ suffix: "STALE-LOCK-RECOVERY" });
    const staleAuthorization = authorizationFor(staleDefinition, { moduleSha256: moduleEntry.moduleSha256 });
    const staleRuntimeKey = safeRuntimeSegment(`${staleDefinition.taskId}\0${staleDefinition.stageId}\0${staleDefinition.idempotencyKey}`);
    const staleEventDir = path.join(runtimeRoot, staleRuntimeKey, "events");
    const staleLockDir = path.join(runtimeRoot, "locks");
    const staleLockPath = path.join(staleLockDir, `${staleRuntimeKey}.lock`);
    await mkdir(staleEventDir, { recursive: true });
    await mkdir(staleLockDir, { recursive: true });
    const staleNonce = "3".repeat(64);
    const staleLockRecord = {
      schemaVersion: staleDefinition.schemaVersion,
      runtimeKey: staleRuntimeKey,
      taskId: staleDefinition.taskId,
      stageId: staleDefinition.stageId,
      sourceRevision: staleAuthorization.sourceRevision,
      stageBindingDigest: stageBindingDigest(staleDefinition),
      ownerNonce: staleNonce,
      supervisorPid: 2_147_483_000,
      supervisorStartIdentity: "synthetic stale supervisor identity",
      childPid: null,
      childStartIdentity: null,
      childProcessGroupId: null,
      pendingReceiptSha256: null,
      heartbeatAt: new Date().toISOString(),
    };
    await writeFile(staleLockPath, `${canonicalJson(staleLockRecord)}\n`, { mode: 0o600 });
    const ordinaryStaleAttempt = await executeFixture(staleDefinition, moduleEntry, { authorization: staleAuthorization });
    if (ordinaryStaleAttempt.code !== "STAGE_LOCK_UNAVAILABLE") throw new Error("ordinary stale-lock fail-stuck case failed");
    cases += 1;
    const staleLockStillPresent = await readLockRecord(staleLockPath);
    if (staleLockStillPresent?.ownerNonce !== staleNonce) throw new Error("ordinary execution altered stale lock");
    cases += 1;
    const expectedStaleLock = {
      schemaVersion: staleDefinition.schemaVersion,
      runtimeKey: staleRuntimeKey,
      taskId: staleDefinition.taskId,
      stageId: staleDefinition.stageId,
      sourceRevision: staleAuthorization.sourceRevision,
      stageBindingDigest: stageBindingDigest(staleDefinition),
      eventDir: staleEventDir,
    };
    const reviewedRecoveryClaim = {
      schemaVersion: staleDefinition.schemaVersion,
      decision: "recover-stale-stage-lock",
      taskId: staleDefinition.taskId,
      stageId: staleDefinition.stageId,
      sourceRevision: staleAuthorization.sourceRevision,
      stageBindingDigest: stageBindingDigest(staleDefinition),
      ownerNonce: staleNonce,
      ownerClaimDigest: sha256(canonicalJson(staleLockRecord)),
    };
    const reviewedRecovery = {
      ...reviewedRecoveryClaim,
      recoveryReviewDigest: sha256(canonicalJson(reviewedRecoveryClaim)),
    };
    const forgedRecoveryClaim = {
      ...reviewedRecoveryClaim,
      ownerClaimDigest: sha256(canonicalJson({
        ...staleLockRecord,
        pendingReceiptSha256: sha256("forged pending receipt"),
      })),
    };
    if (await reconcileStaleLock(staleLockPath, expectedStaleLock, {
      ...forgedRecoveryClaim,
      recoveryReviewDigest: sha256(canonicalJson(forgedRecoveryClaim)),
    })) throw new Error("unbound stale-lock owner claim case failed");
    if (!await reconcileStaleLock(staleLockPath, expectedStaleLock, reviewedRecovery)) {
      throw new Error("reviewed stale-lock reconciliation case failed");
    }
    cases += 1;
    const staleRecovered = await executeFixture(staleDefinition, moduleEntry, { authorization: staleAuthorization });
    if (staleRecovered.code !== "STAGE_SUCCEEDED") throw new Error("post-recovery stage execution case failed");
    cases += 1;
    const reconciledNames = await readdir(staleLockDir);
    if (!reconciledNames.includes(`${staleRuntimeKey}.lock.reconciled-${staleNonce}`)) {
      throw new Error("stale-lock owner claim case failed");
    }
    cases += 1;

    const malformedLockDefinition = definitionFor({ suffix: "MALFORMED-LOCK" });
    const malformedKey = safeRuntimeSegment(`${malformedLockDefinition.taskId}\0${malformedLockDefinition.stageId}\0${malformedLockDefinition.idempotencyKey}`);
    const malformedLockPath = path.join(staleLockDir, `${malformedKey}.lock`);
    await writeFile(malformedLockPath, "{}\n", { mode: 0o600 });
    const malformedLock = await executeFixture(malformedLockDefinition, moduleEntry);
    if (malformedLock.code !== "STAGE_LOCK_UNAVAILABLE") throw new Error("malformed stale-lock denial case failed");
    cases += 1;

    const disabledRecovery = await recoverReviewedStageLock({
      taskId: staleDefinition.taskId,
      stageId: staleDefinition.stageId,
      idempotencyKey: staleDefinition.idempotencyKey,
      sourceRevision: staleAuthorization.sourceRevision,
      stageBindingDigest: stageBindingDigest(staleDefinition),
      recoveryReviewDigest: reviewedRecovery.recoveryReviewDigest,
    });
    if (disabledRecovery.code !== "STAGE_LOCK_RECOVERY_DISABLED_STAGE0") {
      throw new Error("Stage 0 lock recovery disable case failed");
    }
    cases += 1;

    const hangName = "P0-runner-hang-fixture.mjs";
    await writeModule(hangName, "setInterval(() => {}, 1000);\n");
    const hangDefinition = definitionFor({
      suffix: "PROCESS-TREE-TIMEOUT",
      moduleId: "eng.hang",
      argumentSetId: "hang.v1",
      deadlineMs: 1_000,
    });
    const hangEntry = await entryFor(hangDefinition, hangName);
    const hangResult = await executeFixture(hangDefinition, hangEntry);
    if (hangResult.code !== "STAGE_RECOVERY_REQUIRED" || hangResult.state !== "recovery-required") {
      throw new Error("process-tree timeout case failed");
    }
    cases += 1;

    const hangKey = safeRuntimeSegment(`${hangDefinition.taskId}\0${hangDefinition.stageId}\0${hangDefinition.idempotencyKey}`);
    const hangEventDir = path.join(runtimeRoot, hangKey, "events");
    const hangEventNames = (await readdir(hangEventDir)).filter((name) => EVENT_FILE.test(name)).sort();
    await writeFile(path.join(hangEventDir, hangEventNames.at(-1)), "{}\n", { mode: 0o600 });
    const tamperedJournal = await executeFixture(hangDefinition, hangEntry);
    if (tamperedJournal.code !== "STAGE_RUNNER_FAILED") throw new Error("receipt journal tamper case failed");
    cases += 1;

    const productionCallbackRequest = {
      ...bindingRequest(definition),
      execute: async () => {
        throw new Error("Stage 0 must not invoke an unreviewed callback");
      },
    };
    const absentCallbackStage = await executeStageFromExactMain(productionCallbackRequest);
    if (absentCallbackStage.code !== "STAGE_ACTION_NOT_REVIEWED") {
      throw new Error("callback production stage-absence case failed");
    }
    cases += 1;

    for (const invalidCallbackRequest of [
      { ...productionCallbackRequest, trust: true },
      { ...bindingRequest(definition) },
      { ...productionCallbackRequest, execute: "not-a-function" },
    ]) {
      const rejected = await executeStageFromExactMain(invalidCallbackRequest);
      if (rejected.code !== "STAGE_CALLBACK_REQUEST_SHAPE_INVALID") {
        throw new Error("callback exact production schema case failed");
      }
    }
    cases += 1;

    const capturedExecute = productionCallbackRequest.execute;
    const mutableCallbackRequest = { ...productionCallbackRequest };
    const synchronouslyCaptured = captureCallbackProductionRequest(mutableCallbackRequest);
    mutableCallbackRequest.taskId = "REL-R0-001";
    mutableCallbackRequest.stageId = "P0-STAGE-REL-R0-001-MUTATED-AFTER-CAPTURE";
    mutableCallbackRequest.execute = async () => null;
    if (synchronouslyCaptured?.identity.taskId !== definition.taskId
      || synchronouslyCaptured?.identity.stageId !== definition.stageId
      || synchronouslyCaptured?.execute !== capturedExecute) {
      throw new Error("callback synchronous descriptor capture case failed");
    }
    cases += 1;

    const callbackModuleName = "P0-runner-callback-binding-fixture.mjs";
    await writeModule(callbackModuleName, "export const reviewedCallbackBinding = true;\n");
    const callbackEntryFor = (callbackDefinition) => entryFor(callbackDefinition, callbackModuleName);
    const callbackSuccessDefinition = definitionFor({
      suffix: "CALLBACK-SUCCESS",
      moduleId: "eng.callback-success",
      argumentSetId: "callback-success.v1",
    });
    const callbackSuccessEntry = await callbackEntryFor(callbackSuccessDefinition);
    const reviewedCallbackIdentity = async () => null;
    const wrongCallbackIdentity = async () => null;
    const reviewedCallbackEntry = Object.freeze({
      moduleId: callbackSuccessEntry.moduleId,
      moduleRelativePath: callbackSuccessEntry.moduleRelativePath,
      moduleSha256: callbackSuccessEntry.moduleSha256,
      gitMode: callbackSuccessEntry.gitMode,
      execute: reviewedCallbackIdentity,
      capabilityProfile: CALLBACK_CAPABILITY_PROFILE,
      capabilityReviewSha256: `sha256:${"6".repeat(64)}`,
    });
    if (!reviewedCallbackMatches(reviewedCallbackEntry, callbackSuccessEntry, reviewedCallbackIdentity)
      || reviewedCallbackMatches(reviewedCallbackEntry, callbackSuccessEntry, wrongCallbackIdentity)
      || reviewedCallbackMatches(
        { ...reviewedCallbackEntry, capabilityProfile: "native-io-permitted" },
        callbackSuccessEntry,
        reviewedCallbackIdentity,
      )
      || reviewedCallbackMatches(
        { ...reviewedCallbackEntry, capabilityReviewSha256: "unbound-review" },
        callbackSuccessEntry,
        reviewedCallbackIdentity,
      )
      || Object.keys(PRODUCTION_CALLBACK_ALLOWLIST).length !== 0) {
      throw new Error("callback code-owned function identity case failed");
    }
    cases += 1;
    const callbackSuccessAuthorization = authorizationFor(callbackSuccessDefinition, {
      moduleSha256: callbackSuccessEntry.moduleSha256,
    });
    let callbackContextObserved = null;
    let callbackRunningObserved = false;
    let callbackExecutions = 0;
    const callbackSucceeded = await executeCallbackFixture(
      callbackSuccessDefinition,
      callbackSuccessEntry,
      async (context) => {
        callbackExecutions += 1;
        callbackContextObserved = context;
        const runtimeKeyValue = safeRuntimeSegment(`${context.taskId}\0${context.stageId}\0${context.idempotencyKey}`);
        const events = await readEvents(path.join(runtimeRoot, runtimeKeyValue, "events"));
        callbackRunningObserved = events.length === 1 && events[0].state === "running";
        return callbackCompletionFor(callbackSuccessDefinition, context);
      },
      { authorization: callbackSuccessAuthorization },
    );
    const callbackContextKeys = [
      "actionClass", "candidateRevision", "deadlineAt", "idempotencyKey", "predecessorReceiptSha256",
      "revision", "scopeClass", "signal", "stageId", "taskId",
    ];
    if (callbackSucceeded.code !== "STAGE_SUCCEEDED"
      || callbackExecutions !== 1
      || !callbackRunningObserved
      || !Object.isFrozen(callbackContextObserved)
      || Object.keys(callbackContextObserved).sort().join("\0") !== callbackContextKeys.join("\0")
      || callbackContextObserved.taskId !== callbackSuccessDefinition.taskId
      || callbackContextObserved.scopeClass !== callbackSuccessDefinition.scopeClass
      || callbackContextObserved.actionClass !== callbackSuccessDefinition.actionClass
      || callbackContextObserved.stageId !== callbackSuccessDefinition.stageId
      || callbackContextObserved.predecessorReceiptSha256 !== null
      || callbackContextObserved.idempotencyKey !== callbackSuccessDefinition.idempotencyKey
      || callbackContextObserved.revision !== callbackSuccessAuthorization.sourceRevision
      || callbackContextObserved.candidateRevision !== callbackSuccessAuthorization.candidateRevision
      || Date.parse(callbackContextObserved.deadlineAt) - Date.now() > MAX_CALLBACK_DEADLINE_MS) {
      throw new Error("bounded frozen callback context/running-before-action case failed");
    }
    cases += 1;

    const callbackSuccessKey = safeRuntimeSegment(`${callbackSuccessDefinition.taskId}\0${callbackSuccessDefinition.stageId}\0${callbackSuccessDefinition.idempotencyKey}`);
    const callbackSuccessEvents = await readEvents(path.join(runtimeRoot, callbackSuccessKey, "events"));
    const callbackTerminalReceipt = callbackSuccessEvents.at(-1)?.receipt;
    if (callbackSuccessEvents.map((event) => event.state).join(",") !== "running,verification-pending,verified-complete"
      || callbackTerminalReceipt.preparationReviewSha256 !== callbackSuccessAuthorization.preparationReviewSha256
      || callbackTerminalReceipt.stageBindingDigest !== callbackSuccessAuthorization.stageDefinitionSha256
      || callbackTerminalReceipt.moduleSha256 !== callbackSuccessAuthorization.moduleSha256
      || callbackTerminalReceipt.registrySha256 !== callbackSuccessAuthorization.registrySha256
      || callbackTerminalReceipt.predecessorReceiptSha256 !== null
      || callbackTerminalReceipt.childResultSha256 === null
      || callbackTerminalReceipt.stdoutSha256 !== EMPTY_EVIDENCE_SHA256
      || callbackTerminalReceipt.stderrSha256 !== EMPTY_EVIDENCE_SHA256) {
      throw new Error("callback durable receipt binding case failed");
    }
    cases += 1;

    const callbackReplay = await executeCallbackFixture(
      callbackSuccessDefinition,
      callbackSuccessEntry,
      async () => {
        callbackExecutions += 1;
        return null;
      },
      { authorization: callbackSuccessAuthorization },
    );
    if (callbackReplay.code !== "STAGE_ALREADY_SUCCEEDED"
      || callbackReplay.receiptDigest !== callbackSucceeded.receiptDigest
      || callbackExecutions !== 1) {
      throw new Error("callback replay/no-second-execution case failed");
    }
    cases += 1;

    const callbackIdentityMutations = [
      ["taskId", "REL-R0-001"],
      ["scopeClass", "private-execution"],
      ["actionClass", "deployment"],
      ["stageId", "P0-STAGE-ENG-R0-001-WRONG-STAGE"],
      ["predecessorReceiptSha256", `sha256:${"7".repeat(64)}`],
      ["idempotencyKey", "P0-IDEMP-ENG-R0-001-WRONG-CALLBACK-001"],
    ];
    for (const [index, [key, value]] of callbackIdentityMutations.entries()) {
      const mismatchDefinition = definitionFor({
        suffix: `CALLBACK-IDENTITY-${index + 1}`,
        moduleId: `eng.callback-identity-${index + 1}`,
        argumentSetId: `callback-identity-${index + 1}.v1`,
      });
      const mismatchEntry = await callbackEntryFor(mismatchDefinition);
      const mismatch = await executeCallbackFixture(mismatchDefinition, mismatchEntry, async (context) => (
        callbackCompletionFor(mismatchDefinition, context, { [key]: value })
      ));
      if (mismatch.code !== "STAGE_CALLBACK_RECEIPT_REJECTED") {
        throw new Error(`callback completion identity mismatch case failed: ${key}`);
      }
      cases += 1;
    }

    const callbackThrowDefinition = definitionFor({
      suffix: "CALLBACK-THROW",
      moduleId: "eng.callback-throw",
      argumentSetId: "callback-throw.v1",
    });
    const callbackThrowEntry = await callbackEntryFor(callbackThrowDefinition);
    const callbackThrew = await executeCallbackFixture(callbackThrowDefinition, callbackThrowEntry, async () => {
      throw new Error("synthetic callback failure detail must not escape");
    });
    if (callbackThrew.code !== "STAGE_CALLBACK_FAILED"
      || JSON.stringify(callbackThrew).includes("synthetic callback failure detail")) {
      throw new Error("callback throw sanitization case failed");
    }
    cases += 1;

    const callbackEarlyDefinition = definitionFor({
      suffix: "CALLBACK-EARLY-RETURN",
      moduleId: "eng.callback-early",
      argumentSetId: "callback-early.v1",
    });
    const callbackEarlyEntry = await callbackEntryFor(callbackEarlyDefinition);
    const callbackEarly = await executeCallbackFixture(callbackEarlyDefinition, callbackEarlyEntry, async () => undefined);
    if (callbackEarly.code !== "STAGE_CALLBACK_RECEIPT_REJECTED") {
      throw new Error("callback early-return rejection case failed");
    }
    cases += 1;

    const callbackOutputDefinition = definitionFor({
      suffix: "CALLBACK-RAW-OUTPUT",
      moduleId: "eng.callback-output",
      argumentSetId: "callback-output.v1",
    });
    const callbackOutputEntry = await callbackEntryFor(callbackOutputDefinition);
    const callbackRawCanary = "synthetic-private-callback-output-canary";
    const callbackOutput = await executeCallbackFixture(callbackOutputDefinition, callbackOutputEntry, async (context) => ({
      ...callbackCompletionFor(callbackOutputDefinition, context),
      output: callbackRawCanary,
    }));
    if (callbackOutput.code !== "STAGE_CALLBACK_RECEIPT_REJECTED"
      || JSON.stringify(callbackOutput).includes(callbackRawCanary)) {
      throw new Error("callback raw-output rejection case failed");
    }
    cases += 1;

    const callbackStreamDefinition = definitionFor({
      suffix: "CALLBACK-RAW-STREAM",
      moduleId: "eng.callback-stream",
      argumentSetId: "callback-stream.v1",
    });
    const callbackStreamEntry = await callbackEntryFor(callbackStreamDefinition);
    const callbackStreamCanary = "synthetic-callback-stream-canary";
    const originalStdoutWrite = process.stdout.write;
    const originalStderrWrite = process.stderr.write;
    const callbackStreamResult = await executeCallbackFixture(
      callbackStreamDefinition,
      callbackStreamEntry,
      async (context) => {
        console.log(callbackStreamCanary);
        process.stderr.write(callbackStreamCanary);
        return callbackCompletionFor(callbackStreamDefinition, context);
      },
    );
    const callbackStreamKey = safeRuntimeSegment(`${callbackStreamDefinition.taskId}\0${callbackStreamDefinition.stageId}\0${callbackStreamDefinition.idempotencyKey}`);
    const callbackStreamRoot = path.join(runtimeRoot, callbackStreamKey);
    const callbackStreamEvents = await readEvents(path.join(callbackStreamRoot, "events"));
    const callbackStreamReceipt = callbackStreamEvents.at(-1)?.receipt;
    if (callbackStreamResult.code !== "STAGE_CALLBACK_RAW_STREAM_REJECTED"
      || JSON.stringify(callbackStreamResult).includes(callbackStreamCanary)
      || process.stdout.write !== originalStdoutWrite
      || process.stderr.write !== originalStderrWrite
      || callbackStreamEvents.map((event) => event.state).join(",") !== "running,recovery-required"
      || callbackStreamReceipt?.stdoutSha256 === null
      || callbackStreamReceipt?.stderrSha256 === null
      || callbackStreamReceipt?.stdoutSha256 === EMPTY_EVIDENCE_SHA256
      || callbackStreamReceipt?.stderrSha256 === EMPTY_EVIDENCE_SHA256
      || (await readdir(path.join(callbackStreamRoot, "raw-evidence"))).length !== 0) {
      throw new Error("callback raw-stream containment case failed");
    }
    cases += 1;

    const callbackInitialGateDefinition = definitionFor({
      suffix: "CALLBACK-INITIAL-GATE-DRIFT",
      moduleId: "eng.callback-initial-gate",
      argumentSetId: "callback-initial-gate.v1",
    });
    const callbackInitialGateEntry = await callbackEntryFor(callbackInitialGateDefinition);
    let callbackInitialGateRan = false;
    const callbackInitialGate = await executeCallbackFixture(
      callbackInitialGateDefinition,
      callbackInitialGateEntry,
      async () => {
        callbackInitialGateRan = true;
        return null;
      },
      {
        authorization: authorizationFor(callbackInitialGateDefinition, {
          moduleSha256: callbackInitialGateEntry.moduleSha256,
          taskId: "REL-R0-001",
        }),
      },
    );
    if (callbackInitialGate.code !== "STAGE_GATE_B_DENIED" || callbackInitialGateRan) {
      throw new Error("callback initial Gate B identity case failed");
    }
    cases += 1;

    const callbackModuleDriftDefinition = definitionFor({
      suffix: "CALLBACK-MODULE-DRIFT",
      moduleId: "eng.callback-module-drift",
      argumentSetId: "callback-module-drift.v1",
    });
    const callbackModuleDriftEntry = await callbackEntryFor(callbackModuleDriftDefinition);
    let callbackModuleDriftRan = false;
    const callbackModuleDrift = await executeCallbackFixture(
      callbackModuleDriftDefinition,
      { ...callbackModuleDriftEntry, moduleSha256: `sha256:${"0".repeat(64)}` },
      async () => {
        callbackModuleDriftRan = true;
        return null;
      },
      {
        authorization: authorizationFor(callbackModuleDriftDefinition, {
          moduleSha256: `sha256:${"0".repeat(64)}`,
        }),
      },
    );
    if (callbackModuleDrift.code !== "STAGE_MODULE_NOT_ALLOWLISTED" || callbackModuleDriftRan) {
      throw new Error("callback reviewed-module binding case failed");
    }
    cases += 1;

    const callbackLockedGateDefinition = definitionFor({
      suffix: "CALLBACK-LOCKED-GATE-DRIFT",
      moduleId: "eng.callback-locked-gate",
      argumentSetId: "callback-locked-gate.v1",
    });
    const callbackLockedGateEntry = await callbackEntryFor(callbackLockedGateDefinition);
    const callbackLockedAuthorization = authorizationFor(callbackLockedGateDefinition, {
      moduleSha256: callbackLockedGateEntry.moduleSha256,
    });
    let callbackLockedCalls = 0;
    let callbackLockedGateRan = false;
    const callbackLockedGate = await executeCallbackFixture(
      callbackLockedGateDefinition,
      callbackLockedGateEntry,
      async () => {
        callbackLockedGateRan = true;
        return null;
      },
      {
        authorize: async () => {
          callbackLockedCalls += 1;
          return callbackLockedCalls === 1
            ? callbackLockedAuthorization
            : { ...callbackLockedAuthorization, stageApprovalSha256: "0".repeat(64) };
        },
      },
    );
    if (callbackLockedGate.code !== "STAGE_GATE_B_DENIED" || callbackLockedGateRan) {
      throw new Error("callback under-lock Gate B recheck case failed");
    }
    cases += 1;

    const callbackSourceDriftDefinition = definitionFor({
      suffix: "CALLBACK-SOURCE-DRIFT",
      moduleId: "eng.callback-source-drift",
      argumentSetId: "callback-source-drift.v1",
    });
    const callbackSourceDriftEntry = await callbackEntryFor(callbackSourceDriftDefinition);
    const callbackSourceAuthorization = authorizationFor(callbackSourceDriftDefinition, {
      moduleSha256: callbackSourceDriftEntry.moduleSha256,
    });
    let callbackSourceCalls = 0;
    let sourceDriftSignal = null;
    const callbackSourceDrift = await executeCallbackFixture(
      callbackSourceDriftDefinition,
      callbackSourceDriftEntry,
      async (context) => {
        sourceDriftSignal = context.signal;
        return callbackCompletionFor(callbackSourceDriftDefinition, context);
      },
      {
        authorize: async () => {
          callbackSourceCalls += 1;
          return callbackSourceCalls <= 3
            ? callbackSourceAuthorization
            : { ...callbackSourceAuthorization, sourceRevision: "2".repeat(40) };
        },
      },
    );
    if (callbackSourceDrift.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID"
      || sourceDriftSignal?.aborted !== true
      || sourceDriftSignal?.reason !== "callback-authority-invalidated") {
      throw new Error("callback post-settlement source movement case failed");
    }
    cases += 1;

    const callbackRefreshStraddleDefinition = definitionFor({
      suffix: "CALLBACK-REFRESH-DEADLINE-STRADDLE",
      moduleId: "eng.callback-refresh-straddle",
      argumentSetId: "callback-refresh-straddle.v1",
    });
    const callbackRefreshStraddleEntry = await callbackEntryFor(callbackRefreshStraddleDefinition);
    const callbackRefreshStraddleRuntimeRoot = path.join(root, "callback-refresh-deadline-straddle-runtime");
    let callbackRefreshNowMs = Date.now();
    const callbackRefreshAuthorization = authorizationFor(callbackRefreshStraddleDefinition, {
      moduleSha256: callbackRefreshStraddleEntry.moduleSha256,
      deadlineAt: new Date(callbackRefreshNowMs + 30_000).toISOString(),
    });
    let callbackRefreshAuthorizationCalls = 0;
    let callbackRefreshExecutions = 0;
    const callbackRefreshStraddle = await executeCallbackFixture(
      callbackRefreshStraddleDefinition,
      callbackRefreshStraddleEntry,
      async (context) => {
        callbackRefreshExecutions += 1;
        return callbackCompletionFor(callbackRefreshStraddleDefinition, context);
      },
      {
        runtimeRoot: callbackRefreshStraddleRuntimeRoot,
        clock: () => new Date(callbackRefreshNowMs),
        authorize: async () => {
          callbackRefreshAuthorizationCalls += 1;
          if (callbackRefreshAuthorizationCalls === 4) {
            await Promise.resolve();
            callbackRefreshNowMs += 6_000;
            return {
              ...callbackRefreshAuthorization,
              deadlineAt: new Date(callbackRefreshNowMs + 60_000).toISOString(),
            };
          }
          return callbackRefreshAuthorization;
        },
      },
    );
    const callbackRefreshStraddleKey = safeRuntimeSegment(`${callbackRefreshStraddleDefinition.taskId}\0${callbackRefreshStraddleDefinition.stageId}\0${callbackRefreshStraddleDefinition.idempotencyKey}`);
    const callbackRefreshStraddleEvents = await readEvents(path.join(
      callbackRefreshStraddleRuntimeRoot,
      callbackRefreshStraddleKey,
      "events",
    ));
    if (callbackRefreshStraddle.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID"
      || callbackRefreshAuthorizationCalls !== 4
      || callbackRefreshExecutions !== 1
      || callbackRefreshStraddleEvents.map((event) => event.state).join(",") !== "running,recovery-required"
      || callbackRefreshStraddleEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("callback post-refresh fixed-deadline straddle case failed");
    }
    cases += 1;

    const callbackRefreshStraddleReplay = await executeCallbackFixture(
      callbackRefreshStraddleDefinition,
      callbackRefreshStraddleEntry,
      async () => {
        callbackRefreshExecutions += 1;
        return null;
      },
      {
        runtimeRoot: callbackRefreshStraddleRuntimeRoot,
        authorization: callbackRefreshAuthorization,
        clock: () => new Date(callbackRefreshNowMs),
      },
    );
    const callbackRefreshReplayEvents = await readEvents(path.join(
      callbackRefreshStraddleRuntimeRoot,
      callbackRefreshStraddleKey,
      "events",
    ));
    if (callbackRefreshStraddleReplay.code !== "STAGE_RECOVERY_REQUIRED"
      || callbackRefreshExecutions !== 1
      || callbackRefreshReplayEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("callback post-refresh fixed-deadline replay case failed");
    }
    cases += 1;

    const callbackFinalGateDefinition = definitionFor({
      suffix: "CALLBACK-FINAL-GATE-DRIFT",
      moduleId: "eng.callback-final-gate",
      argumentSetId: "callback-final-gate.v1",
    });
    const callbackFinalGateEntry = await callbackEntryFor(callbackFinalGateDefinition);
    const callbackFinalAuthorization = authorizationFor(callbackFinalGateDefinition, {
      moduleSha256: callbackFinalGateEntry.moduleSha256,
    });
    let callbackFinalGateCalls = 0;
    const callbackFinalGate = await executeCallbackFixture(
      callbackFinalGateDefinition,
      callbackFinalGateEntry,
      async (context) => callbackCompletionFor(callbackFinalGateDefinition, context),
      {
        authorize: async () => {
          callbackFinalGateCalls += 1;
          return callbackFinalGateCalls < 11
            ? callbackFinalAuthorization
            : { ...callbackFinalAuthorization, registrySha256: "0".repeat(64) };
        },
      },
    );
    const callbackFinalKey = safeRuntimeSegment(`${callbackFinalGateDefinition.taskId}\0${callbackFinalGateDefinition.stageId}\0${callbackFinalGateDefinition.idempotencyKey}`);
    const callbackFinalEvents = await readEvents(path.join(runtimeRoot, callbackFinalKey, "events"));
    if (callbackFinalGate.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID"
      || callbackFinalGateCalls !== 11
      || callbackFinalEvents.some((event) => event.state === "verified-complete")) {
      throw new Error("callback final pre-terminal Gate B recheck case failed");
    }
    cases += 1;

    const callbackVerifierDefinition = definitionFor({
      suffix: "CALLBACK-VERIFIER-REJECTS",
      moduleId: "eng.callback-verifier",
      argumentSetId: "callback-verifier.v1",
    });
    const callbackVerifierEntry = await callbackEntryFor(callbackVerifierDefinition);
    const callbackVerifier = await executeCallbackFixture(
      callbackVerifierDefinition,
      callbackVerifierEntry,
      async (context) => callbackCompletionFor(callbackVerifierDefinition, context),
      { verifyOutcome: async () => null },
    );
    if (callbackVerifier.code !== "STAGE_POST_ACTION_VERIFICATION_INVALID") {
      throw new Error("callback outcome-verifier rejection case failed");
    }
    cases += 1;

    const callbackPrestartExpiryDefinition = definitionFor({
      suffix: "CALLBACK-PRESTART-AUTHORITY-EXPIRY",
      moduleId: "eng.callback-prestart-expiry",
      argumentSetId: "callback-prestart-expiry.v1",
    });
    const callbackPrestartExpiryEntry = await callbackEntryFor(callbackPrestartExpiryDefinition);
    const callbackPrestartExpiryAuthorization = authorizationFor(callbackPrestartExpiryDefinition, {
      moduleSha256: callbackPrestartExpiryEntry.moduleSha256,
      deadlineAt: new Date(Date.now() + 1_000).toISOString(),
    });
    let callbackPrestartExpiryExecutions = 0;
    let callbackPrestartExpiryAuthorizationCalls = 0;
    const delayedRunningAppend = async (directory, sequence, event) => {
      if (sequence === 1) await delay(1_200);
      return appendEvent(directory, sequence, event);
    };
    const callbackPrestartExpiry = await executeCallbackFixture(
      callbackPrestartExpiryDefinition,
      callbackPrestartExpiryEntry,
      async () => {
        callbackPrestartExpiryExecutions += 1;
        return null;
      },
      {
        authorization: callbackPrestartExpiryAuthorization,
        authorize: async () => {
          callbackPrestartExpiryAuthorizationCalls += 1;
          return callbackPrestartExpiryAuthorization;
        },
        appendJournalEvent: delayedRunningAppend,
      },
    );
    const callbackPrestartExpiryKey = safeRuntimeSegment(`${callbackPrestartExpiryDefinition.taskId}\0${callbackPrestartExpiryDefinition.stageId}\0${callbackPrestartExpiryDefinition.idempotencyKey}`);
    const callbackPrestartExpiryEvents = await readEvents(path.join(runtimeRoot, callbackPrestartExpiryKey, "events"));
    if (callbackPrestartExpiry.code !== "STAGE_EXPIRED_BEFORE_MUTATION"
      || callbackPrestartExpiry.state !== "expired-before-mutation"
      || callbackPrestartExpiryExecutions !== 0
      || callbackPrestartExpiryAuthorizationCalls !== 3
      || callbackPrestartExpiryEvents.map((event) => event.state).join(",") !== "running,expired-before-mutation"
      || callbackPrestartExpiryEvents.at(-1)?.receipt?.childResultSha256 !== null) {
      throw new Error("callback post-running pre-invocation authority expiry case failed");
    }
    cases += 1;

    const callbackDeadlineDefinition = definitionFor({
      suffix: "CALLBACK-DEADLINE",
      moduleId: "eng.callback-deadline",
      argumentSetId: "callback-deadline.v1",
      deadlineMs: 1_000,
    });
    const callbackDeadlineEntry = await callbackEntryFor(callbackDeadlineDefinition);
    const callbackDeadlineAuthorization = authorizationFor(callbackDeadlineDefinition, {
      moduleSha256: callbackDeadlineEntry.moduleSha256,
      deadlineAt: new Date(Date.now() + 150).toISOString(),
    });
    let callbackDeadlineSignal = null;
    let callbackDeadlineSettled = false;
    const callbackDeadline = await executeCallbackFixture(
      callbackDeadlineDefinition,
      callbackDeadlineEntry,
      async (context) => new Promise((resolve) => {
        callbackDeadlineSignal = context.signal;
        context.signal.addEventListener("abort", () => {
          setTimeout(() => {
            callbackDeadlineSettled = true;
            resolve(callbackCompletionFor(callbackDeadlineDefinition, context));
          }, 15);
        }, { once: true });
      }),
      { authorization: callbackDeadlineAuthorization },
    );
    if (callbackDeadline.code !== "STAGE_CALLBACK_DEADLINE_EXCEEDED"
      || callbackDeadlineSignal?.aborted !== true
      || callbackDeadlineSignal?.reason !== "callback-deadline-exceeded"
      || !callbackDeadlineSettled) {
      throw new Error("callback deadline/abort/settlement case failed");
    }
    cases += 1;

    const callbackPrimordialDefinition = definitionFor({
      suffix: "CALLBACK-PRIMORDIAL-DEADLINE",
      moduleId: "eng.callback-primordial",
      argumentSetId: "callback-primordial.v1",
      deadlineMs: 1_000,
    });
    const callbackPrimordialEntry = await callbackEntryFor(callbackPrimordialDefinition);
    const callbackPrimordialAuthorization = authorizationFor(callbackPrimordialDefinition, {
      moduleSha256: callbackPrimordialEntry.moduleSha256,
      deadlineAt: new Date(Date.now() + 150).toISOString(),
    });
    const originalDateNow = Date.now;
    const originalDateParse = Date.parse;
    const originalDateGetTime = Date.prototype.getTime;
    const originalDateToISOString = Date.prototype.toISOString;
    const originalHrtimeBigint = process.hrtime.bigint;
    const originalGlobalSetTimeout = globalThis.setTimeout;
    const originalGlobalClearTimeout = globalThis.clearTimeout;
    const restoreTimeGlobals = () => {
      Date.now = originalDateNow;
      Date.parse = originalDateParse;
      Date.prototype.getTime = originalDateGetTime;
      Date.prototype.toISOString = originalDateToISOString;
      process.hrtime.bigint = originalHrtimeBigint;
      globalThis.setTimeout = originalGlobalSetTimeout;
      globalThis.clearTimeout = originalGlobalClearTimeout;
    };
    let callbackPrimordialSignal = null;
    const callbackPrimordial = await executeCallbackFixture(
      callbackPrimordialDefinition,
      callbackPrimordialEntry,
      async (context) => new Promise((resolve, reject) => {
        callbackPrimordialSignal = context.signal;
        try {
          Date.now = () => 0;
          Date.parse = () => Number.POSITIVE_INFINITY;
          Date.prototype.getTime = () => 0;
          Date.prototype.toISOString = () => "1970-01-01T00:00:00.000Z";
          process.hrtime.bigint = () => 0n;
          globalThis.setTimeout = () => ({ synthetic: true });
          globalThis.clearTimeout = () => {};
          originalGlobalSetTimeout(() => {
            restoreTimeGlobals();
            resolve(callbackCompletionFor(callbackPrimordialDefinition, context));
          }, 180);
        } catch (error) {
          restoreTimeGlobals();
          reject(error);
        }
      }),
      { authorization: callbackPrimordialAuthorization },
    );
    restoreTimeGlobals();
    if (callbackPrimordial.code !== "STAGE_CALLBACK_DEADLINE_EXCEEDED"
      || callbackPrimordialSignal?.aborted !== true
      || callbackPrimordialSignal?.reason !== "callback-deadline-exceeded") {
      throw new Error("callback primordial deadline containment case failed");
    }
    cases += 1;

    const callbackFailStuckDefinition = definitionFor({
      suffix: "CALLBACK-FAIL-STUCK",
      moduleId: "eng.callback-fail-stuck",
      argumentSetId: "callback-fail-stuck.v1",
      deadlineMs: 1_000,
    });
    const callbackFailStuckEntry = await callbackEntryFor(callbackFailStuckDefinition);
    const callbackFailStuckAuthorization = authorizationFor(callbackFailStuckDefinition, {
      moduleSha256: callbackFailStuckEntry.moduleSha256,
      deadlineAt: new Date(Date.now() + 150).toISOString(),
    });
    let settleIgnoredAbort;
    let ignoredAbortContext;
    const ignoredAbortPromise = executeCallbackFixture(
      callbackFailStuckDefinition,
      callbackFailStuckEntry,
      async (context) => new Promise((resolve) => {
        ignoredAbortContext = context;
        settleIgnoredAbort = () => resolve(callbackCompletionFor(callbackFailStuckDefinition, context));
      }),
      { authorization: callbackFailStuckAuthorization },
    );
    while (typeof settleIgnoredAbort !== "function") await delay(1);
    await delay(170);
    const blockedWhileUnsettled = await executeCallbackFixture(
      callbackFailStuckDefinition,
      callbackFailStuckEntry,
      async () => null,
      { authorization: callbackFailStuckAuthorization },
    );
    if (blockedWhileUnsettled.code !== "STAGE_LOCK_UNAVAILABLE"
      || ignoredAbortContext.signal.aborted !== true) {
      throw new Error("callback ignored-abort lock retention case failed");
    }
    settleIgnoredAbort();
    const ignoredAbortResult = await ignoredAbortPromise;
    if (ignoredAbortResult.code !== "STAGE_CALLBACK_DEADLINE_EXCEEDED") {
      throw new Error("callback ignored-abort settlement case failed");
    }
    cases += 1;

    const callbackConcurrencyDefinition = definitionFor({
      suffix: "CALLBACK-CONCURRENT-LOCK",
      moduleId: "eng.callback-concurrent",
      argumentSetId: "callback-concurrent.v1",
    });
    const callbackConcurrencyEntry = await callbackEntryFor(callbackConcurrencyDefinition);
    let releaseConcurrentCallback;
    let concurrentContext;
    const concurrentFirst = executeCallbackFixture(
      callbackConcurrencyDefinition,
      callbackConcurrencyEntry,
      async (context) => new Promise((resolve) => {
        concurrentContext = context;
        releaseConcurrentCallback = () => resolve(callbackCompletionFor(callbackConcurrencyDefinition, context));
      }),
    );
    while (typeof releaseConcurrentCallback !== "function") await delay(1);
    const concurrentSecond = await executeCallbackFixture(
      callbackConcurrencyDefinition,
      callbackConcurrencyEntry,
      async () => null,
    );
    releaseConcurrentCallback();
    const concurrentFirstResult = await concurrentFirst;
    if (concurrentSecond.code !== "STAGE_LOCK_UNAVAILABLE"
      || concurrentFirstResult.code !== "STAGE_SUCCEEDED"
      || concurrentContext.signal.aborted) {
      throw new Error("callback unique-owner lock case failed");
    }
    cases += 1;

    const callbackGlobalLockDefinitionA = definitionFor({
      suffix: "CALLBACK-GLOBAL-LOCK-A",
      moduleId: "eng.callback-global-a",
      argumentSetId: "callback-global-a.v1",
    });
    const callbackGlobalLockDefinitionB = definitionFor({
      suffix: "CALLBACK-GLOBAL-LOCK-B",
      moduleId: "eng.callback-global-b",
      argumentSetId: "callback-global-b.v1",
    });
    const callbackGlobalLockEntryA = await callbackEntryFor(callbackGlobalLockDefinitionA);
    const callbackGlobalLockEntryB = await callbackEntryFor(callbackGlobalLockDefinitionB);
    let releaseGlobalCallback;
    let globalCallbackBExecutions = 0;
    const globalCallbackA = executeCallbackFixture(
      callbackGlobalLockDefinitionA,
      callbackGlobalLockEntryA,
      async (context) => new Promise((resolve) => {
        releaseGlobalCallback = () => resolve(callbackCompletionFor(callbackGlobalLockDefinitionA, context));
      }),
    );
    while (typeof releaseGlobalCallback !== "function") await delay(1);
    const globalCallbackB = await executeCallbackFixture(
      callbackGlobalLockDefinitionB,
      callbackGlobalLockEntryB,
      async (context) => {
        globalCallbackBExecutions += 1;
        return callbackCompletionFor(callbackGlobalLockDefinitionB, context);
      },
    );
    releaseGlobalCallback();
    const globalCallbackAResult = await globalCallbackA;
    if (globalCallbackB.code !== "STAGE_CALLBACK_LOCK_UNAVAILABLE"
      || globalCallbackBExecutions !== 0
      || globalCallbackAResult.code !== "STAGE_SUCCEEDED") {
      throw new Error("callback global stream-interception lock case failed");
    }
    cases += 1;

    const callbackPredecessorDefinition = definitionFor({
      suffix: "CALLBACK-MISSING-PREDECESSOR",
      moduleId: "eng.callback-predecessor",
      argumentSetId: "callback-predecessor.v1",
      predecessor: {
        stageId: callbackSuccessDefinition.stageId,
        receiptDigest: `sha256:${"8".repeat(64)}`,
      },
    });
    const callbackPredecessorEntry = await callbackEntryFor(callbackPredecessorDefinition);
    const callbackPredecessorRuntimeRoot = path.join(root, "callback-predecessor-runtime");
    let callbackPredecessorRan = false;
    const callbackPredecessor = await executeCallbackFixture(
      callbackPredecessorDefinition,
      callbackPredecessorEntry,
      async () => {
        callbackPredecessorRan = true;
        return null;
      },
      { runtimeRoot: callbackPredecessorRuntimeRoot },
    );
    if (callbackPredecessor.code !== "STAGE_PREDECESSOR_RECEIPT_MISSING" || callbackPredecessorRan) {
      throw new Error("callback predecessor receipt case failed");
    }
    cases += 1;

    const callbackJournalDefinition = definitionFor({
      suffix: "CALLBACK-JOURNAL-FAIL-STUCK",
      moduleId: "eng.callback-journal-fail-stuck",
      argumentSetId: "callback-journal-fail-stuck.v1",
    });
    const callbackJournalEntry = await callbackEntryFor(callbackJournalDefinition);
    const callbackJournalRuntimeRoot = path.join(root, "callback-journal-fail-stuck-runtime");
    let callbackJournalExecutions = 0;
    let callbackJournalAppends = 0;
    const appendRunningThenFail = async (directory, sequence, event) => {
      callbackJournalAppends += 1;
      if (sequence === 1) return appendEvent(directory, sequence, event);
      throw new Error("synthetic post-action journal failure");
    };
    const callbackJournalFailure = await executeCallbackFixture(
      callbackJournalDefinition,
      callbackJournalEntry,
      async (context) => {
        callbackJournalExecutions += 1;
        return callbackCompletionFor(callbackJournalDefinition, context);
      },
      {
        runtimeRoot: callbackJournalRuntimeRoot,
        appendJournalEvent: appendRunningThenFail,
      },
    );
    const callbackJournalKey = safeRuntimeSegment(`${callbackJournalDefinition.taskId}\0${callbackJournalDefinition.stageId}\0${callbackJournalDefinition.idempotencyKey}`);
    const callbackJournalLockPath = path.join(callbackJournalRuntimeRoot, "locks", `${callbackJournalKey}.lock`);
    const callbackJournalEvents = await readEvents(path.join(callbackJournalRuntimeRoot, callbackJournalKey, "events"));
    let callbackJournalLockRetained = true;
    try {
      await access(callbackJournalLockPath, fsConstants.F_OK);
    } catch {
      callbackJournalLockRetained = false;
    }
    if (callbackJournalFailure.code !== "STAGE_RECOVERY_REQUIRED"
      || callbackJournalExecutions !== 1
      || callbackJournalAppends !== 3
      || callbackJournalEvents.length !== 1
      || callbackJournalEvents[0].state !== "running"
      || callbackJournalEvents[0].actionStartAuthorized !== true
      || !callbackJournalLockRetained) {
      throw new Error("callback post-action journal fail-stuck case failed");
    }
    cases += 1;

    const callbackJournalReplay = await executeCallbackFixture(
      callbackJournalDefinition,
      callbackJournalEntry,
      async () => {
        callbackJournalExecutions += 1;
        return null;
      },
      { runtimeRoot: callbackJournalRuntimeRoot },
    );
    if (callbackJournalReplay.code !== "STAGE_LOCK_UNAVAILABLE" || callbackJournalExecutions !== 1) {
      throw new Error("callback fail-stuck replay lock case failed");
    }
    cases += 1;

    const callbackJournalDurabilityDefinition = definitionFor({
      suffix: "CALLBACK-JOURNAL-DIRSYNC-FAIL-STUCK",
      moduleId: "eng.callback-journal-dirsync-fail-stuck",
      argumentSetId: "callback-journal-dirsync-fail-stuck.v1",
    });
    const callbackJournalDurabilityEntry = await callbackEntryFor(callbackJournalDurabilityDefinition);
    const callbackJournalDurabilityRuntimeRoot = path.join(root, "callback-journal-dirsync-fail-stuck-runtime");
    let callbackJournalDurabilityExecutions = 0;
    let callbackJournalDurabilitySyncAttempts = 0;
    const appendRecoveryThenReportFailure = async (directory, sequence, event) => {
      const eventPath = await appendEvent(directory, sequence, event);
      if (sequence === 2 && event.state === "recovery-required") {
        throw new Error("synthetic final event-directory fsync uncertainty");
      }
      return eventPath;
    };
    const callbackJournalDurabilityFailure = await executeCallbackFixture(
      callbackJournalDurabilityDefinition,
      callbackJournalDurabilityEntry,
      async () => {
        callbackJournalDurabilityExecutions += 1;
        return undefined;
      },
      {
        runtimeRoot: callbackJournalDurabilityRuntimeRoot,
        appendJournalEvent: appendRecoveryThenReportFailure,
        syncEventDirectory: async () => {
          callbackJournalDurabilitySyncAttempts += 1;
          throw new Error("synthetic event-directory fsync failure");
        },
      },
    );
    const callbackJournalDurabilityKey = safeRuntimeSegment(`${callbackJournalDurabilityDefinition.taskId}\0${callbackJournalDurabilityDefinition.stageId}\0${callbackJournalDurabilityDefinition.idempotencyKey}`);
    const callbackJournalDurabilityLockPath = path.join(
      callbackJournalDurabilityRuntimeRoot,
      "locks",
      `${callbackJournalDurabilityKey}.lock`,
    );
    const callbackJournalDurabilityEvents = await readEvents(path.join(
      callbackJournalDurabilityRuntimeRoot,
      callbackJournalDurabilityKey,
      "events",
    ));
    let callbackJournalDurabilityLockRetained = true;
    try {
      await access(callbackJournalDurabilityLockPath, fsConstants.F_OK);
    } catch {
      callbackJournalDurabilityLockRetained = false;
    }
    if (callbackJournalDurabilityFailure.code !== "STAGE_RECOVERY_REQUIRED"
      || callbackJournalDurabilityExecutions !== 1
      || callbackJournalDurabilitySyncAttempts !== 1
      || callbackJournalDurabilityEvents.map((event) => event.state).join(",") !== "running,recovery-required"
      || !callbackJournalDurabilityLockRetained) {
      throw new Error("callback written-but-unproven journal durability case failed");
    }
    cases += 1;

    const callbackJournalDurabilityReplay = await executeCallbackFixture(
      callbackJournalDurabilityDefinition,
      callbackJournalDurabilityEntry,
      async () => {
        callbackJournalDurabilityExecutions += 1;
        return null;
      },
      { runtimeRoot: callbackJournalDurabilityRuntimeRoot },
    );
    if (callbackJournalDurabilityReplay.code !== "STAGE_LOCK_UNAVAILABLE"
      || callbackJournalDurabilityExecutions !== 1) {
      throw new Error("callback unproven-durability replay lock case failed");
    }
    cases += 1;

    const callbackJournalFileSyncDefinition = definitionFor({
      suffix: "CALLBACK-JOURNAL-FILESYNC-FAIL-STUCK",
      moduleId: "eng.callback-journal-filesync-fail-stuck",
      argumentSetId: "callback-journal-filesync-fail-stuck.v1",
    });
    const callbackJournalFileSyncEntry = await callbackEntryFor(callbackJournalFileSyncDefinition);
    const callbackJournalFileSyncRuntimeRoot = path.join(root, "callback-journal-filesync-fail-stuck-runtime");
    let callbackJournalFileSyncExecutions = 0;
    let callbackJournalFileSyncAttempts = 0;
    let callbackJournalFileSyncDirectoryAttempts = 0;
    const appendCompleteRecoveryThenThrow = async (directory, sequence, event) => {
      const eventPath = await appendEvent(directory, sequence, event);
      if (sequence === 2 && event.state === "recovery-required") {
        throw new Error("synthetic complete write with uncertain file fsync");
      }
      return eventPath;
    };
    const callbackJournalFileSyncFailure = await executeCallbackFixture(
      callbackJournalFileSyncDefinition,
      callbackJournalFileSyncEntry,
      async () => {
        callbackJournalFileSyncExecutions += 1;
        return undefined;
      },
      {
        runtimeRoot: callbackJournalFileSyncRuntimeRoot,
        appendJournalEvent: appendCompleteRecoveryThenThrow,
        syncEventFile: async () => {
          callbackJournalFileSyncAttempts += 1;
          throw new Error("synthetic journal tail file fsync failure");
        },
        syncEventDirectory: async (directory) => {
          callbackJournalFileSyncDirectoryAttempts += 1;
          return syncDirectory(directory);
        },
      },
    );
    const callbackJournalFileSyncKey = safeRuntimeSegment(`${callbackJournalFileSyncDefinition.taskId}\0${callbackJournalFileSyncDefinition.stageId}\0${callbackJournalFileSyncDefinition.idempotencyKey}`);
    const callbackJournalFileSyncLockPath = path.join(
      callbackJournalFileSyncRuntimeRoot,
      "locks",
      `${callbackJournalFileSyncKey}.lock`,
    );
    const callbackJournalFileSyncEvents = await readEvents(path.join(
      callbackJournalFileSyncRuntimeRoot,
      callbackJournalFileSyncKey,
      "events",
    ));
    let callbackJournalFileSyncLockRetained = true;
    try {
      await access(callbackJournalFileSyncLockPath, fsConstants.F_OK);
    } catch {
      callbackJournalFileSyncLockRetained = false;
    }
    if (callbackJournalFileSyncFailure.code !== "STAGE_RECOVERY_REQUIRED"
      || callbackJournalFileSyncExecutions !== 1
      || callbackJournalFileSyncAttempts !== 1
      || callbackJournalFileSyncDirectoryAttempts !== 0
      || callbackJournalFileSyncEvents.map((event) => event.state).join(",") !== "running,recovery-required"
      || !callbackJournalFileSyncLockRetained) {
      throw new Error("callback readable-but-file-fsync-unproven journal case failed");
    }
    cases += 1;

    const callbackJournalFileSyncReplay = await executeCallbackFixture(
      callbackJournalFileSyncDefinition,
      callbackJournalFileSyncEntry,
      async () => {
        callbackJournalFileSyncExecutions += 1;
        return null;
      },
      { runtimeRoot: callbackJournalFileSyncRuntimeRoot },
    );
    if (callbackJournalFileSyncReplay.code !== "STAGE_LOCK_UNAVAILABLE"
      || callbackJournalFileSyncExecutions !== 1) {
      throw new Error("callback file-fsync-unproven replay lock case failed");
    }
    cases += 1;

    const callbackPendingFileSyncDefinition = definitionFor({
      suffix: "CALLBACK-PENDING-FILESYNC-FAIL-STUCK",
      moduleId: "eng.callback-pending-filesync-fail-stuck",
      argumentSetId: "callback-pending-filesync-fail-stuck.v1",
    });
    const callbackPendingFileSyncEntry = await callbackEntryFor(callbackPendingFileSyncDefinition);
    const callbackPendingFileSyncRuntimeRoot = path.join(root, "callback-pending-filesync-fail-stuck-runtime");
    let callbackPendingFileSyncExecutions = 0;
    let callbackPendingFileSyncAttempts = 0;
    let callbackPendingRecoveryAppendAttempts = 0;
    const appendPendingThenThrow = async (directory, sequence, event) => {
      if (event.state === "recovery-required") callbackPendingRecoveryAppendAttempts += 1;
      const eventPath = await appendEvent(directory, sequence, event);
      if (sequence === 2 && event.state === "verification-pending") {
        throw new Error("synthetic readable verification-pending file fsync uncertainty");
      }
      return eventPath;
    };
    const callbackPendingFileSyncFailure = await executeCallbackFixture(
      callbackPendingFileSyncDefinition,
      callbackPendingFileSyncEntry,
      async (context) => {
        callbackPendingFileSyncExecutions += 1;
        return callbackCompletionFor(callbackPendingFileSyncDefinition, context);
      },
      {
        runtimeRoot: callbackPendingFileSyncRuntimeRoot,
        appendJournalEvent: appendPendingThenThrow,
        syncEventFile: async () => {
          callbackPendingFileSyncAttempts += 1;
          throw new Error("synthetic verification-pending tail file fsync failure");
        },
      },
    );
    const callbackPendingFileSyncKey = safeRuntimeSegment(`${callbackPendingFileSyncDefinition.taskId}\0${callbackPendingFileSyncDefinition.stageId}\0${callbackPendingFileSyncDefinition.idempotencyKey}`);
    const callbackPendingFileSyncLockPath = path.join(
      callbackPendingFileSyncRuntimeRoot,
      "locks",
      `${callbackPendingFileSyncKey}.lock`,
    );
    const callbackPendingFileSyncEvents = await readEvents(path.join(
      callbackPendingFileSyncRuntimeRoot,
      callbackPendingFileSyncKey,
      "events",
    ));
    let callbackPendingFileSyncLockRetained = true;
    try {
      await access(callbackPendingFileSyncLockPath, fsConstants.F_OK);
    } catch {
      callbackPendingFileSyncLockRetained = false;
    }
    if (callbackPendingFileSyncFailure.code !== "STAGE_RECOVERY_REQUIRED"
      || callbackPendingFileSyncExecutions !== 1
      || callbackPendingFileSyncAttempts !== 1
      || callbackPendingRecoveryAppendAttempts !== 0
      || callbackPendingFileSyncEvents.map((event) => event.state).join(",") !== "running,verification-pending"
      || !callbackPendingFileSyncLockRetained) {
      throw new Error("callback verification-pending predecessor durability case failed");
    }
    cases += 1;

    const callbackPendingFileSyncReplay = await executeCallbackFixture(
      callbackPendingFileSyncDefinition,
      callbackPendingFileSyncEntry,
      async () => {
        callbackPendingFileSyncExecutions += 1;
        return null;
      },
      { runtimeRoot: callbackPendingFileSyncRuntimeRoot },
    );
    if (callbackPendingFileSyncReplay.code !== "STAGE_LOCK_UNAVAILABLE"
      || callbackPendingFileSyncExecutions !== 1) {
      throw new Error("callback verification-pending predecessor replay lock case failed");
    }
    cases += 1;

    const callbackInterruptedDefinition = definitionFor({
      suffix: "CALLBACK-INTERRUPTED",
      moduleId: "eng.callback-interrupted",
      argumentSetId: "callback-interrupted.v1",
    });
    const callbackInterruptedEntry = await callbackEntryFor(callbackInterruptedDefinition);
    const callbackInterruptedAuthorization = authorizationFor(callbackInterruptedDefinition, {
      moduleSha256: callbackInterruptedEntry.moduleSha256,
    });
    const callbackInterruptedKey = safeRuntimeSegment(`${callbackInterruptedDefinition.taskId}\0${callbackInterruptedDefinition.stageId}\0${callbackInterruptedDefinition.idempotencyKey}`);
    const callbackInterruptedEvents = path.join(runtimeRoot, callbackInterruptedKey, "events");
    await mkdir(callbackInterruptedEvents, { recursive: true });
    await appendEvent(callbackInterruptedEvents, 1, {
      schemaVersion: callbackInterruptedDefinition.schemaVersion,
      state: "running",
      occurredAt: new Date().toISOString(),
      processGroupId: null,
      sourceRevision: callbackInterruptedAuthorization.sourceRevision,
      stageBindingDigest: stageBindingDigest(callbackInterruptedDefinition),
      executorSha256: callbackInterruptedEntry.moduleSha256,
    });
    let callbackInterruptedRan = false;
    const callbackInterrupted = await executeCallbackFixture(
      callbackInterruptedDefinition,
      callbackInterruptedEntry,
      async () => {
        callbackInterruptedRan = true;
        return null;
      },
      { authorization: callbackInterruptedAuthorization },
    );
    if (callbackInterrupted.code !== "STAGE_RECOVERY_REQUIRED" || callbackInterruptedRan) {
      throw new Error("callback interrupted-journal recovery case failed");
    }
    cases += 1;

    return {
      ok: true,
      code: "SELF_TEST_OK",
      cases,
      productionModules: Object.keys(PRODUCTION_MODULE_ALLOWLIST).length,
    };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function usage() {
  return "Usage: node tools/P0-stage-runner.mjs --self-test\nProduction execution is available only through the exported closed API.";
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  if (process.argv.length === 3 && process.argv[2] === "--self-test") {
    console.log(JSON.stringify(await selfTest()));
  } else if (process.argv.length === 3 && process.argv[2] === "--help") {
    console.log(usage());
  } else {
    console.log(JSON.stringify(result(false, "STAGE_CLI_DIAGNOSTIC_ONLY")));
    process.exitCode = 1;
  }
}
