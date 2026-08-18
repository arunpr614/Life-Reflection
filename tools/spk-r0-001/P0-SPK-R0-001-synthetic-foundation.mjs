import { createCipheriv, createDecipheriv, createHash } from "node:crypto";
import { writeFileSync } from "node:fs";

try {
const SCHEMA_VERSION = "1.0.0";
const MODULE_ID = "spk.synthetic";
const ARGUMENT_SET_ID = "synthetic.v1";
const TASK_ID = "SPK-R0-001";
const PREPARATION_REVIEW_ID = "P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION";
const STAGE_ID = "P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION";
const SCOPE_CLASS = "local-synthetic";
const ACTION_CLASS = "synthetic-foundation";
const IDEMPOTENCY_KEY = "P0-IDEMP-SPK-R0-001-SYNTHETIC-001";
const STAGE_BINDING_DIGEST = "sha256:fc172d2f8c1e5f9dccdf7a5c398fe0a2038591f7fb2903e54961879c73041983";
const TASK_CONTRACT_SHA256 = "sha256:f58e65c56e58dc4b1e12deab68f7349822f7f95dd33eee4fcd4872243170fa23";
const FIXTURE_SCHEMA = "spk-r0-001.synthetic-foundation.fixture.v1";
const FIXED_SEED_ID = "spk-r0-001-fixed-seed-v1";
const FIXED_CLOCK_START = "2030-01-01T00:00:00.000Z";
const FIXED_CLOCK_END = "2030-01-01T00:00:01.000Z";
const PERMITTED_CLAIM = "Exact local, public, fictional, synthetic foundation checks passed; live-host fit, private access, deployment, task acceptance, status transition, release, and production readiness remain unproven.";
const LIMITATIONS = Object.freeze([
  "The cipher uses deterministic test-only material and nonce derivation for reproducible synthetic checks; it is not a production cryptography or key-custody selection.",
  "Recovery is an in-memory fictional model with no filesystem path, repository, provider, or private backup access.",
  "Capacity values are fixed fictional assumptions and are not host measurements, an SLA, HA evidence, or coexistence acceptance.",
  "The serializable module has no rendered product UI, so product UI accessibility remains untested.",
  "Source, dependency-closure, runtime-output, and retained-artifact safety require separately bound candidate QA; this governed digest reports only exercised in-memory synthetic observations.",
  "A passing result does not complete SPK-R0-001 or authorize a private follow-on, deployment, acceptance, status change, release, or production use.",
]);
const REQUIREMENT_IDS = Object.freeze([
  "LID-SCP-001",
  "LID-OPS-001",
  "LID-OPS-002",
  "LID-OPS-003",
  "LID-OPS-004",
  "LID-OPS-008",
  "LID-OPS-011",
  "LID-OPS-012",
  "LID-OPS-014",
  "LID-OPS-016",
  "LID-OPS-018",
]);
const SCENARIO_IDS = Object.freeze([
  "SPK-R0-001-P-001",
  "SPK-R0-001-P-002",
  "SPK-R0-001-P-003",
  "SPK-R0-001-T-001",
  "SPK-R0-001-T-002",
  "SPK-R0-001-T-003",
  "SPK-R0-001-D-001",
  "SPK-R0-001-D-002",
  "SPK-R0-001-D-003",
  "SPK-R0-001-QA-001",
  "SPK-R0-001-QA-002",
  "SPK-R0-001-QA-003",
  "SPK-R0-001-QA-004",
  "SPK-R0-001-QA-005",
  "SPK-R0-001-QA-006",
]);
const CONTRACT_IDS = Object.freeze([
  "surface-isolation",
  "capacity-and-collision",
  "authenticated-encryption",
  "backup-restore-rollback",
  "durable-health",
  "sanitized-logging",
  "replay-interruption-crash",
  "receipt-boundary",
]);

function canonicalJson(value) {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("non-finite synthetic value");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map((entry) => canonicalJson(entry)).join(",")}]`;
  if (typeof value !== "object" || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new TypeError("non-canonical synthetic value");
  }
  return `{${Object.keys(value).sort().map((key) => (
    `${JSON.stringify(key)}:${canonicalJson(value[key])}`
  )).join(",")}}`;
}

function sha256Bytes(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

function digest(value) {
  return sha256Bytes(Buffer.from(canonicalJson(value), "utf8"));
}

function rawSha256(value) {
  return createHash("sha256").update(value).digest();
}

function hasExactKeys(value, keys) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype
    && Object.keys(value).sort().join("\0") === [...keys].sort().join("\0");
}

function invariant(condition) {
  if (!condition) throw new Error("synthetic foundation invariant failed");
}

function deepFreeze(value) {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const entry of Object.values(value)) deepFreeze(entry);
  }
  return value;
}

function cloneCanonical(value) {
  return JSON.parse(canonicalJson(value));
}

function compareAscii(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

const CANONICAL_JSON_TEST_VALUE = deepFreeze({
  z: 1,
  a: { b: 2, a: 1 },
  list: [{ b: false, a: true }, "x"],
});
const CANONICAL_JSON_TEST_BYTES = "{\"a\":{\"a\":1,\"b\":2},\"list\":[{\"a\":true,\"b\":false},\"x\"],\"z\":1}";
const CANONICAL_JSON_TEST_SHA256 = "sha256:7258b5acba4c29a70083a9371603683c1e67be5adbe71a563950e865e19b77a9";
invariant(canonicalJson(CANONICAL_JSON_TEST_VALUE) === CANONICAL_JSON_TEST_BYTES
  && sha256Bytes(Buffer.from(CANONICAL_JSON_TEST_BYTES, "utf8")) === CANONICAL_JSON_TEST_SHA256);

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
invariant(canonicalJson(COMPUTED_COMPONENT_OBSERVATION_DIGESTS)
  === canonicalJson(FROZEN_COMPONENT_OBSERVATION_DIGESTS));
const FROZEN_STATE_DIGESTS = deepFreeze({
  beforeSha256: "sha256:1cc4fe59e27e03a351df8edb1627c06b2e188204864428dd10dd2472590cca06",
  afterSha256: "sha256:5e5ca1fe23fdbcc586e726975432bea956c06925af89a9cb8414c865a94a6413",
  backupSha256: "sha256:d2c32688c486281d34e0347c5627ac0485e6afda8654c1f2b564c5e42a406755",
  restoreSha256: "sha256:5e5ca1fe23fdbcc586e726975432bea956c06925af89a9cb8414c865a94a6413",
  comparisonSha256: "sha256:d79c30e6178a72937bb321eeab813fd9a98421632a520f412fe464f688df5458",
  rollbackSha256: "sha256:1cc4fe59e27e03a351df8edb1627c06b2e188204864428dd10dd2472590cca06",
});
invariant(FROZEN_STATE_DIGESTS.beforeSha256 === FROZEN_ORACLE_MODEL.recovery.baselineDigest
  && FROZEN_STATE_DIGESTS.afterSha256 === FROZEN_ORACLE_MODEL.recovery.sourceDigest
  && FROZEN_STATE_DIGESTS.backupSha256 === FROZEN_ORACLE_MODEL.recovery.backupDigest
  && FROZEN_STATE_DIGESTS.restoreSha256 === FROZEN_ORACLE_MODEL.recovery.restoredDigest
  && FROZEN_STATE_DIGESTS.comparisonSha256 === FROZEN_ORACLE_MODEL.recovery.comparisonDigest
  && FROZEN_STATE_DIGESTS.rollbackSha256 === FROZEN_ORACLE_MODEL.recovery.rollbackDigest);

const SYNTHETIC_FOUNDATION_FIXTURE_DIGEST = "sha256:a5b51a5564523396c6c07c4a861de94ca594232af73336f283fa3b53a71e4022";
invariant(digest(FIXTURE) === SYNTHETIC_FOUNDATION_FIXTURE_DIGEST);
const CANONICAL_EVIDENCE_VECTOR_SOURCE_REVISION = "0000000000000000000000000000000000000000";
const CANONICAL_GOVERNED_EVIDENCE_VECTOR = buildSyntheticFoundationEvidence(
  CANONICAL_EVIDENCE_VECTOR_SOURCE_REVISION,
  STAGE_BINDING_DIGEST,
);
const CANONICAL_GOVERNED_EVIDENCE_VECTOR_BYTES = canonicalJson(CANONICAL_GOVERNED_EVIDENCE_VECTOR);
const CANONICAL_GOVERNED_EVIDENCE_VECTOR_BYTE_LENGTH = 7738;
const CANONICAL_GOVERNED_EVIDENCE_VECTOR_SHA256 = "sha256:21a2b56022c4034d8ff6f1eed8c8933cb5980fb39191ed211e30209cbf954608";
invariant(Buffer.byteLength(CANONICAL_GOVERNED_EVIDENCE_VECTOR_BYTES, "utf8")
  === CANONICAL_GOVERNED_EVIDENCE_VECTOR_BYTE_LENGTH
  && sha256Bytes(Buffer.from(CANONICAL_GOVERNED_EVIDENCE_VECTOR_BYTES, "utf8"))
    === CANONICAL_GOVERNED_EVIDENCE_VECTOR_SHA256);
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
const CANONICAL_CHILD_RESULT_VECTOR_BYTES = "{\"evidenceDigest\":\"sha256:21a2b56022c4034d8ff6f1eed8c8933cb5980fb39191ed211e30209cbf954608\",\"idempotencyKey\":\"P0-IDEMP-SPK-R0-001-SYNTHETIC-001\",\"outcome\":\"succeeded\",\"schemaVersion\":\"1.0.0\",\"sourceRevision\":\"0000000000000000000000000000000000000000\",\"stageBindingDigest\":\"sha256:fc172d2f8c1e5f9dccdf7a5c398fe0a2038591f7fb2903e54961879c73041983\",\"stageId\":\"P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION\",\"taskId\":\"SPK-R0-001\"}";
const CANONICAL_CHILD_RESULT_VECTOR_SHA256 = "sha256:35a08e70b9364812bba9c15d701aba2048f2f3c28c147706c6ec06d20d6cf462";
const CANONICAL_CHILD_RESULT_TERMINAL_BYTES_SHA256 = "sha256:5edb9a81d6d75d36bde47f713cd38007e809236a19e54858d3cf3ae087188795";
invariant(canonicalJson(CANONICAL_CHILD_RESULT_VECTOR) === CANONICAL_CHILD_RESULT_VECTOR_BYTES
  && sha256Bytes(Buffer.from(CANONICAL_CHILD_RESULT_VECTOR_BYTES, "utf8"))
    === CANONICAL_CHILD_RESULT_VECTOR_SHA256
  && sha256Bytes(Buffer.from(`${CANONICAL_CHILD_RESULT_VECTOR_BYTES}\n`, "utf8"))
    === CANONICAL_CHILD_RESULT_TERMINAL_BYTES_SHA256);

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

const GOVERNED_EVIDENCE_CONTRACT_SHA256 = "sha256:38c8deeb899e87cfef731cc1932d3594f3cf4b7d6afa1aeff62cb343395931d8";
invariant(GOVERNED_EVIDENCE_CONTRACT.governanceBindings.moduleId === MODULE_ID
  && GOVERNED_EVIDENCE_CONTRACT.governanceBindings.argumentSetId === ARGUMENT_SET_ID
  && GOVERNED_EVIDENCE_CONTRACT.moduleCapabilityProfile.moduleId === MODULE_ID
  && GOVERNED_EVIDENCE_CONTRACT.moduleCapabilityProfile.argumentSetId === ARGUMENT_SET_ID);
invariant(digest(GOVERNED_EVIDENCE_CONTRACT) === GOVERNED_EVIDENCE_CONTRACT_SHA256);

function governedEvidenceFindingCount(evidence) {
  const bytes = Buffer.from(canonicalJson(evidence), "utf8");
  const rawFixtureValues = [
    FIXTURE.human.allowlistedOwner,
    FIXTURE.human.assertion,
    FIXTURE.callback.assertion,
    FIXTURE.syntheticKeySeed,
    ...FIXTURE.fictionalRecords.flatMap((record) => [record.opaqueId, record.relationId, record.value]),
    ...FIXTURE.namespaces.candidate.map((entry) => entry.token),
    ...FIXTURE.namespaces.existing.map((entry) => entry.token),
    ...FORBIDDEN_SENTINELS,
    ...FROZEN_ENCRYPTED_STATE.records.flatMap((record) => [
      record.envelope.authTag,
      record.envelope.ciphertext,
      record.envelope.nonce,
    ]),
    SYNTHETIC_KEY.toString("hex"),
    WRONG_SYNTHETIC_KEY.toString("hex"),
  ];
  const exactFindings = rawFixtureValues.filter((value) => bytes.includes(Buffer.from(value, "utf8"))).length;
  const text = bytes.toString("utf8");
  const patternFindings = [
    /\/Users\//u,
    /\bhttps?:\/\//iu,
    /(?:gh[pousr]_|github_pat_)[A-Za-z0-9_]{16,}/u,
    /\bBearer\s+[A-Za-z0-9._~+/=-]{12,}/iu,
    /\bsk[-_][A-Za-z0-9_-]{12,}(?![A-Za-z0-9_-])/u,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u,
  ].filter((pattern) => pattern.test(text)).length;
  return exactFindings + patternFindings;
}

function buildSyntheticFoundationEvidence(sourceRevision, stageBindingDigest) {
  invariant(/^[0-9a-f]{40}$/.test(sourceRevision));
  invariant(stageBindingDigest === STAGE_BINDING_DIGEST);
  const model = FROZEN_ORACLE_MODEL;
  const componentResults = Object.fromEntries(Object.entries(model).map(([name, value]) => [
    name,
    componentResult(name, value),
  ]));
  invariant(Object.entries(componentResults).every(([name, value]) => (
    value.evidenceDigest === FROZEN_COMPONENT_OBSERVATION_DIGESTS[name]
  )));
  const requirementResults = REQUIREMENT_IDS.map((requirementId) => {
    const components = REQUIREMENT_COMPONENTS[requirementId];
    invariant(Array.isArray(components) && components.length > 0);
    const result = components.every((name) => componentResults[name].result === "pass") ? "pass" : "fail";
    return {
      requirementId,
      result,
      observationDigest: digest({
        requirementId,
        result,
        observations: components.map((name) => ({
          componentId: name,
          observationDigest: componentResults[name].evidenceDigest,
        })),
      }),
    };
  });
  componentResults.requirements = {
    name: "requirements",
    result: requirementResults.every((entry) => entry.result === "pass") ? "pass" : "fail",
    evidenceDigest: digest(requirementResults),
  };
  const scenarioResults = SCENARIO_IDS.map((scenarioId) => {
    const components = SCENARIO_COMPONENTS[scenarioId];
    invariant(Array.isArray(components) && components.length > 0);
    const result = components.every((name) => componentResults[name].result === "pass") ? "pass" : "fail";
    return {
      scenarioId,
      result,
      observationDigest: digest({
        scenarioId,
        result,
        boundedResult: scenarioId === "SPK-R0-001-D-002"
          ? "no-rendered-surface"
          : "synthetic-contract-satisfied",
        observations: components.map((name) => ({
          componentId: name,
          observationDigest: componentResults[name].evidenceDigest,
        })),
      }),
    };
  });
  const contractResults = CONTRACT_IDS.map((contractId) => {
    const components = CONTRACT_MODEL_COMPONENTS[contractId];
    invariant(Array.isArray(components) && components.length > 0);
    const result = components.every((name) => componentResults[name].result === "pass") ? "pass" : "fail";
    return {
      contractId,
      result,
      observationDigest: digest({
        contractId,
        result,
        observations: components.map((name) => ({
          componentId: name,
          observationDigest: componentResults[name].evidenceDigest,
        })),
      }),
    };
  });
  invariant(requirementResults.length === 11
    && new Set(requirementResults.map((entry) => entry.requirementId)).size === 11
    && scenarioResults.length === 15
    && new Set(scenarioResults.map((entry) => entry.scenarioId)).size === 15
    && contractResults.length === 8
    && new Set(contractResults.map((entry) => entry.contractId)).size === 8);
  const allResultsPass = requirementResults.every((entry) => entry.result === "pass")
    && scenarioResults.every((entry) => entry.result === "pass")
    && contractResults.every((entry) => entry.result === "pass");
  const evidence = {
    schemaVersion: SCHEMA_VERSION,
    evidenceKind: "governed-synthetic-foundation-evidence-v1",
    taskId: TASK_ID,
    stageId: STAGE_ID,
    scopeClass: SCOPE_CLASS,
    actionClass: ACTION_CLASS,
    idempotencyKey: IDEMPOTENCY_KEY,
    sourceRevision,
    stageBindingDigest,
    fixture: {
      fixtureId: "spk-r0-001-fictional-foundation-v1",
      schemaVersion: FIXTURE_SCHEMA,
      seedId: FIXED_SEED_ID,
      fixtureSha256: SYNTHETIC_FOUNDATION_FIXTURE_DIGEST,
      fixtureClass: "local-public-fictional-synthetic",
      authenticContentExcluded: true,
    },
    requirementResults,
    scenarioResults,
    contractResults,
    stateDigests: FROZEN_STATE_DIGESTS,
    durableHealth: {
      backup: model.health.backupHealth,
      restoreVerification: model.health.restoreVerificationHealth,
      overall: model.health.overallHealth,
    },
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
    conclusion: allResultsPass ? "synthetic foundation passes" : "synthetic foundation fails",
    limitations: LIMITATIONS,
    permittedClaim: PERMITTED_CLAIM,
  };
  const governedEvidenceFindings = governedEvidenceFindingCount(evidence);
  invariant(Object.keys(evidence).join("\0") === GOVERNED_EVIDENCE_KEYS.join("\0")
    && Object.keys(evidence.fixture).join("\0") === GOVERNED_FIXTURE_KEYS.join("\0")
    && evidence.requirementResults.every((entry) => (
      Object.keys(entry).join("\0") === GOVERNED_ITEM_RESULT_KEYS.join("\0") && entry.result === "pass"
    ))
    && evidence.scenarioResults.every((entry) => entry.result === "pass")
    && evidence.scenarioResults.every((entry) => (
      Object.keys(entry).join("\0") === GOVERNED_SCENARIO_RESULT_KEYS.join("\0")
    ))
    && evidence.contractResults.every((entry) => (
      Object.keys(entry).join("\0") === GOVERNED_CONTRACT_RESULT_KEYS.join("\0") && entry.result === "pass"
    ))
    && Object.keys(evidence.stateDigests).join("\0") === GOVERNED_STATE_DIGEST_KEYS.join("\0")
    && Object.values(evidence.stateDigests).every((value) => /^sha256:[0-9a-f]{64}$/.test(value))
    && Object.keys(evidence.durableHealth).join("\0") === GOVERNED_DURABLE_HEALTH_KEYS.join("\0")
    && Object.values(evidence.durableHealth).every((value) => DURABLE_HEALTH_VALUES.includes(value))
    && Object.keys(evidence.safety).join("\0") === GOVERNED_SAFETY_KEYS.join("\0")
    && evidence.safety.privateNetworkAccessed === false
    && evidence.safety.externalMutationPerformed === false
    && evidence.safety.forbiddenContentFindings === governedEvidenceFindings
    && governedEvidenceFindings === 0
    && evidence.conclusion === "synthetic foundation passes"
    && evidence.limitations.length > 0);
  return deepFreeze(evidence);
}

function recomputeSyntheticFoundationEvidence(binding) {
  invariant(hasExactKeys(binding, ["sourceRevision", "stageBindingDigest"]));
  const evidence = buildSyntheticFoundationEvidence(binding.sourceRevision, binding.stageBindingDigest);
  return deepFreeze({ evidence, evidenceDigest: digest(evidence) });
}

const RUNTIME_BINDING_KEYS = Object.freeze([
  "idempotency-key",
  "source-revision",
  "stage-binding",
  "stage-id",
  "task-id",
]);
function runtimeBindings(argumentsList) {
  const bindingArguments = argumentsList.filter((value) => value.startsWith("--p0-"));
  if (argumentsList.length !== RUNTIME_BINDING_KEYS.length
    || bindingArguments.length !== RUNTIME_BINDING_KEYS.length) return false;
  const bindings = {};
  for (const argument of bindingArguments) {
    const separator = argument.indexOf("=");
    if (separator <= "--p0-".length) return false;
    const key = argument.slice("--p0-".length, separator);
    const value = argument.slice(separator + 1);
    if (!RUNTIME_BINDING_KEYS.includes(key) || Object.hasOwn(bindings, key) || value.length === 0) return false;
    bindings[key] = value;
  }
  if (Object.keys(bindings).sort().join("\0") !== [...RUNTIME_BINDING_KEYS].sort().join("\0")
    || bindings["task-id"] !== TASK_ID
    || bindings["stage-id"] !== STAGE_ID
    || bindings["idempotency-key"] !== IDEMPOTENCY_KEY
    || !/^[0-9a-f]{40}$/.test(bindings["source-revision"])
    || bindings["stage-binding"] !== STAGE_BINDING_DIGEST) return false;
  return bindings;
}

const ACTIVE_RUNTIME_BINDINGS = runtimeBindings(process.argv.slice(2));
  if (ACTIVE_RUNTIME_BINDINGS === false) throw new Error("runtime binding rejected");
  const governedEvidence = recomputeSyntheticFoundationEvidence({
    sourceRevision: ACTIVE_RUNTIME_BINDINGS["source-revision"],
    stageBindingDigest: ACTIVE_RUNTIME_BINDINGS["stage-binding"],
  });
  const childResult = {
    schemaVersion: SCHEMA_VERSION,
    outcome: "succeeded",
    taskId: ACTIVE_RUNTIME_BINDINGS["task-id"],
    stageId: ACTIVE_RUNTIME_BINDINGS["stage-id"],
    idempotencyKey: ACTIVE_RUNTIME_BINDINGS["idempotency-key"],
    sourceRevision: ACTIVE_RUNTIME_BINDINGS["source-revision"],
    stageBindingDigest: ACTIVE_RUNTIME_BINDINGS["stage-binding"],
    evidenceDigest: governedEvidence.evidenceDigest,
  };
  const childResultBytes = Buffer.from(`${canonicalJson(childResult)}\n`, "utf8");
  invariant(Object.keys(childResult).join("\0") === CHILD_RESULT_KEYS.join("\0")
    && childResultBytes.length > 0
    && childResultBytes.length <= 64 * 1024
    && childResultBytes[childResultBytes.length - 1] === 0x0a
    && !childResultBytes.subarray(0, -1).includes(0x0a)
    && !childResultBytes.includes(0x00)
    && governedEvidenceFindingCount(childResult) === 0);
  writeFileSync(3, childResultBytes);
} catch {
  process.exitCode = 75;
}
