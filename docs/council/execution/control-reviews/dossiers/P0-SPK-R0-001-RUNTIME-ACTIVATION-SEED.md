# P0 SPK-R0-001 inert runtime-activation seed dossier

- **Prepared:** 2026-08-17
- **Required dossier-candidate parent:** `b90e7c8f6721b6e25436a04a56b04f58fe8b86d3`
- **Task:** `SPK-R0-001`
- **Accepted preparation review:** `P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION`
- **Accepted preparation-record SHA-256:** `70168f46a379bcbccd7b2afee15bfdbaa957247b30ca87ee671fcd3ca2d8164b`
- **Intended stage:** `P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION`
- **Scope/action pair:** `local-synthetic` / `synthetic-foundation`
- **Task-contract SHA-256:** `f58e65c56e58dc4b1e12deab68f7349822f7f95dd33eee4fcd4872243170fa23`
- **Seed effect:** inert code-owned runtime identity only
- **Task-approval effect:** none
- **Execution-permission effect:** none
- **Private, external, delivery, acceptance, status, release, or production effect:** none

## Purpose and authority boundary

This dossier freezes the smallest code-owned runtime seed needed to make one later `SPK-R0-001` implementation-and-evidence candidate reviewable without making it executable. Exact current main contains one accepted Gate A preparation record, zero stage approvals, zero production stage definitions, zero production module metadata records, zero production callbacks, zero production outcome verifiers, and zero executable stages. The accepted preparation record evaluates to `preparationAllowed=true` and `executionAllowed=false` within exactly `local`, `public`, `fictional`, and `synthetic` bounds.

The seed changes only the control-plane representation of the intended stage. Its consumed state must contain exactly one code-owned staged-action definition, one serializable module metadata record, and one code-owned outcome-verifier registration. The production callback map remains exactly empty. The stage-approval registry remains byte-identical with one accepted preparation review and zero stage approvals, so the lifecycle evaluator must report one preparation review, one definition, zero stage approvals, and zero executable stages.

This dossier is not the future module, a candidate-QA run, a Gate B review, a stage approval, a stage receipt, an invocation request, an owner-action record, or evidence that any task behavior ran. No file at the future module path is added by the dossier or seed. No seed code may import, evaluate, spawn, or probe that future module. A matching production request must stop at `STAGE_GATE_B_DENIED` while the registry has no accepted stage approval; the callback surface must stop at `STAGE_CALLBACK_NOT_ALLOWLISTED` because its map stays empty.

## Exact accepted preparation baseline

The governing registry is `docs/council/execution/P0-R0-STAGE-APPROVAL-REGISTRY.json`. Its sole preparation record binds the six published `SPK-R0-001` proposal artifacts and the exact 11-requirement/15-scenario task contract. The following is the complete permission-result excerpt from that larger accepted record, not a substitute for the stored proof, trusted context, publication history, or artifact and reviewer bindings:

```json
{
  "preparationAllowed": true,
  "executionAllowed": false,
  "decision": "Ready to prepare — Gate A",
  "blockers": [],
  "preparationBounds": [
    "local",
    "public",
    "fictional",
    "synthetic"
  ],
  "privateActionsAllowed": false,
  "externalMutationsAllowed": false,
  "taskContractSha256": "f58e65c56e58dc4b1e12deab68f7349822f7f95dd33eee4fcd4872243170fa23",
  "sourceFingerprint": "sha256:4dcf5fa35dc251a8db15c7ba34a7d0416db11677e2f1e1c0fea7815719b79206"
}
```

The control-integrity manifest has 55 protected current entries and `next:null`. The production action, module, callback, and outcome-verifier maps are empty at the dossier base. All 58 task records remain `Incomplete`, zero tasks are `Ready`, zero are execution-allowed, and all R1-R10 work remains frozen.

## Exact inert seed identity

The seed definition is frozen in the following schema/display construction order:

```json
{
  "schemaVersion": "1.0.0",
  "taskId": "SPK-R0-001",
  "scopeClass": "local-synthetic",
  "actionClass": "synthetic-foundation",
  "stageId": "P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION",
  "predecessor": null,
  "idempotencyKey": "P0-IDEMP-SPK-R0-001-SYNTHETIC-001",
  "moduleId": "spk.synthetic",
  "argumentSetId": "synthetic.v1",
  "deadlineMs": 60000
}
```

Construction order is not canonical byte order. The frozen `canonicalJson` routine preserves array order but emits object keys in ascending lexical code-unit order at every depth. It must serialize the definition above to this exact UTF-8 byte vector, with no BOM, whitespace, or terminal LF:

```text
{"actionClass":"synthetic-foundation","argumentSetId":"synthetic.v1","deadlineMs":60000,"idempotencyKey":"P0-IDEMP-SPK-R0-001-SYNTHETIC-001","moduleId":"spk.synthetic","predecessor":null,"schemaVersion":"1.0.0","scopeClass":"local-synthetic","stageId":"P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION","taskId":"SPK-R0-001"}
```

The SHA-256 of exactly that vector is:

```text
sha256:fc172d2f8c1e5f9dccdf7a5c398fe0a2038591f7fb2903e54961879c73041983
```

The later stage approval bound to this definition is sequence 1 and therefore must carry `predecessorReceiptSha256=null`, matching the definition's `predecessor:null`. The later gate kind is `execute`; no delivery transition or acceptance stage is created here.

The one serializable module entry is frozen to this identity and shape:

```json
{
  "moduleId": "spk.synthetic",
  "moduleRelativePath": "tools/spk-r0-001/P0-SPK-R0-001-synthetic-foundation.mjs",
  "moduleSha256": "sha256:e60d8e6398441a61812dd467ffcbdd292e01fb1198723e667e480d2cf453e47f",
  "gitMode": "100644",
  "argumentSets": {
    "synthetic.v1": []
  }
}
```

`sha256:e60d8e6398441a61812dd467ffcbdd292e01fb1198723e667e480d2cf453e47f` is the reviewed SHA-256 of the exact 135,119-byte future module. It is computed from raw file bytes, not normalized text or a design document. Any byte change requires a new module review and protected seed ratchet.

The exported lifecycle metadata projection is exactly one record with schema/display keys `moduleId`, `moduleRelativePath`, `moduleSha256`, `gitMode`, `argumentSetIds`, and `argumentSets`. `argumentSetIds` is exactly `["synthetic.v1"]`; `argumentSets` is exactly `{"synthetic.v1":[]}`; and validation requires those two representations to agree in both directions. The internal serial argument array is therefore exactly empty, not merely an empty-looking ID projection. No caller-controlled argument, cwd, environment, module path, module bytes, verifier, clock, authorization evaluator, journal, output location, or process launcher becomes injectable.

## Inert topology and reverse equality

The consumed seed must satisfy all of these cardinalities simultaneously:

| Surface | Required consumed-seed state |
| --- | ---: |
| Accepted preparation reviews | 1 |
| Production stage definitions | 1 |
| Serializable module metadata records | 1 |
| Code-owned outcome verifiers | 1 |
| Production callbacks | 0 |
| Stage approvals | 0 |
| Executable stages | 0 |

The lifecycle relationship is closed in both directions:

1. the sole definition references the sole module metadata record by `moduleId=spk.synthetic` and its sole `argumentSetId=synthetic.v1`;
2. the sole module metadata record is referenced by exactly that definition and has exactly that one argument-set ID;
3. the sole verifier-map key is `spk.synthetic`, is referenced by exactly that definition, and has no orphan verifier;
4. no second definition, metadata record, argument set, verifier, callback, task, stage, or module ID is present;
5. every stage approval must have a matching definition, module hash, and verifier, but the registry has no stage approval; and
6. `executableStageCount` remains derived from accepted stage approvals, not from definition or metadata presence, so its exact value is zero.

Validation must reject an orphan module or verifier, a definition without either binding, an extra argument set, duplicate identities, a metadata/definition mismatch, a nonempty callback map, an unexpected registry change, or any result other than the exact cardinalities above.

The lifecycle API itself is part of the seed contract. `validateStageRuntimeLifecycle` must accept an object with exactly the five own data keys `registry`, `definitions`, `moduleBindings`, `outcomeVerificationModuleIds`, and `callbackModuleIds`; missing, extra, inherited, accessor, proxy-derived, or post-capture values fail closed. Each `moduleBindings` entry must carry the exact metadata and complete code-owned argument-set map above, not only a list of IDs. Its successful result must expose, in deterministic sorted order, `preparationReviewIds`, `definitionStageIds`, `moduleIds`, `outcomeVerificationModuleIds`, `callbackModuleIds`, and the exact module/argument-set/argument-array bindings, plus `preparationReviewCount`, `definitionCount`, `moduleCount`, `outcomeVerifierCount`, `callbackCount`, `stageApprovalCount`, and `executableStageCount`. For this seed those values are respectively `["P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION"]`, `["P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION"]`, `["spk.synthetic"]`, `["spk.synthetic"]`, `[]`, one binding to `synthetic.v1` with arguments `[]`, and counts `1/1/1/1/0/0/0`.

Validation is bidirectional wherever code is bound: every definition matches exactly one accepted preparation review by equal `taskId`, `stageId`, `scopeClass`, and `actionClass`, and names one module record, one exact argument set, and one verifier; each preparation review is matched by at most one definition; every module and verifier is referenced by exactly one definition; every callback ID is referenced by an in-process definition and vice versa; and every stage approval, when present later, closes back to those same identities and hashes. Gate A meaning is unchanged: an accepted preparation review is not required to have a definition and remains non-executable when it does not; this seed's sole preparation and sole definition happen to close one-to-one through those four equalities. Because this seed's sole definition is serializable, the callback set is exactly empty. The validator and all callers, including `P0-validate-execution-controls.mjs`, must pass the exact five-key object and assert both the ID arrays and counts, so omitting the empty callback set or validating only the forward definition-to-module direction is invalid.

## Future module boundary

The future module path is frozen as `tools/spk-r0-001/P0-SPK-R0-001-synthetic-foundation.mjs`, but that regular `100644` file is introduced only in the later immutable implementation candidate `I`. The seed must neither add the path nor make existence of the path a startup prerequisite. Gate evaluation may perform its existing freshly fetched exact-main and immutable-history Git reads. Those control-plane reads are required and must not be misreported as prohibited module access. `P0-stage-runner.mjs` keeps the allowlist entry as inert data and, before an exact-main Gate B authorization succeeds, must not target the future-module worktree path with an import, existence/stat check, realpath, file read, byte copy, or other probe; create the launcher or child; append a runtime journal event; or send `LAUNCH_SIGNAL`.

After `I` is published but before Gate B is published, the same rule remains: the file's presence and matching raw digest do not authorize execution. `runSerializableStageFromExactMain` must first obtain a current exact-main `STAGE_GATE_B_READY` result whose task, stage, pair, idempotency key, definition digest, candidate, preparation, module, registry, authority deadline, and rollback bindings all match. Only then may it resolve the reviewed regular file, copy its exact bytes into the private runtime directory, start the trusted launcher, re-evaluate Gate B at the runner's protected boundaries, and signal the child.

No code path may use `executeStageFromExactMain` for this module. `PRODUCTION_CALLBACK_ALLOWLIST` remains `{}`; there is no reviewed callback function or capability attestation. The only future invocation surface is the serializable process lane.

## Closed static capability policy

The later module must be a self-contained single ESM file whose complete transitive dependency closure is itself plus the exact closed static import set `node:crypto` and `node:fs`. `node:fs` may be used solely to write the single canonical child-result record to already-open file descriptor 3. Relative imports, package imports, additional built-ins, dynamic `import()`, `require`, module loaders, native addons, WebAssembly, `eval`, `Function`, `vm`, child processes, shells, workers, inspector/debug channels, signals to other processes, environment reads, stdin reads, ordinary path reads or writes, and stdout/stderr output are prohibited.

Network capability is prohibited in source and behavior. The module may not use or reference `fetch`, `WebSocket`, `EventSource`, `net`, `tls`, `dns`, `http`, `https`, `http2`, `dgram`, QUIC, sockets, URLs that identify a target, or any provider/client SDK. The runner's current Node permission arguments constrain filesystem and native process capabilities but are not a network sandbox and must never be described as one. Network non-use therefore requires all three of: the closed source/import scan, exact byte review, and independent candidate QA with egress/private targets absent. Any newly reachable network primitive, ambiguous import, environment dependency, native I/O, or unsupported source construct is a hard Hold and requires a fresh seed/module review.

The production source validator must first require exactly `135119` public-safe UTF-8 bytes and raw SHA-256 `e60d8e6398441a61812dd467ffcbdd292e01fb1198723e667e480d2cf453e47f`; that exact length/hash pair is the sole source-admission boundary, and every alternate byte string is rejected before any secondary analysis. Only for those exact reviewed bytes, a non-authorizing defense-in-depth check records the resolved static imports and decoded-token invariants: the source has exactly the reviewed `node:crypto` names, exactly the reviewed `node:fs` `writeFileSync` name, and the one literal descriptor-`3` child-result write, with no reviewed forbidden literal or statically resolved loader/global/filesystem pattern. This secondary check is not a general JavaScript classifier, cannot authorize alternate bytes, and cannot replace the raw hash, the independent exact-byte module review, the closed dependency/builtin review, or later candidate QA. While the module is absent at the inert seed, candidate-safe tests prove the exact length/hash gate rejects alternate, mutated, and truncated bytes; the sole production positive is required only after the exact reviewed module bytes enter `I`.

All computation is in memory over embedded public fictional fixtures. The module may read only the five runner-owned `--p0-*` binding arguments already supplied by the serializable lane and the exact empty `synthetic.v1` argument set. It may emit exactly one duplicate-key-free canonical JSON child result followed by one LF to file descriptor 3, then terminate with status 0. It emits zero stdout bytes and zero stderr bytes. A missing/extra argument, duplicate binding, unknown option, unsafe character, changed binding, failed contract, or inability to establish the exact evidence must terminate nonzero without a success child result.

The implementation must use only frozen test-only fictional material. It must never contain or accept an authentic, private, or live memory, photo, photo-derived value, account, assertion, credential, key, recovery value, hostname, listener, provider, path, capacity, topology, or external response. Frozen fictional assertion cases and test-only synthetic key material required by the six proposals are permitted only inside the public fixture/oracle; they are not credentials, authentic assertions, production keys, or key-custody evidence and may not appear in the child result, logs, cache, export, backup manifest, or retained evidence. The deterministic synthetic nonce schedule may reset only when a fresh isolated deterministic test run begins and must prove per-key nonce uniqueness and non-reuse throughout that entire run, including failed, retried, replayed, backup, restore, and rollback cases. Cross-run deterministic reproduction is test-vector behavior, not production cryptographic evidence.

## Exact governed-evidence reconstruction contract

Candidate-QA evidence and governed runtime evidence remain different records. Candidate QA retains `receiptKind=candidate-qa-evidence-v1`, `lifecycle=gate-a-preparation`, `taskStageInvoked=false`, and `gateBStageReceiptSha256=null`. It cannot mint or imitate runtime-owned authority fields. The governed runtime module produces only the child result required by `P0-stage-runner.mjs`; the runner alone creates the append-only stage journal and terminal Gate B receipt.

The module's `evidenceDigest` is the SHA-256 of `canonicalJson` over one closed normalized governed-evidence object. The following is its exact schema/display construction order:

1. `schemaVersion`
2. `evidenceKind`
3. `taskId`
4. `stageId`
5. `scopeClass`
6. `actionClass`
7. `idempotencyKey`
8. `sourceRevision`
9. `stageBindingDigest`
10. `fixture`
11. `requirementResults`
12. `scenarioResults`
13. `contractResults`
14. `stateDigests`
15. `durableHealth`
16. `safety`
17. `conclusion`
18. `limitations`
19. `permittedClaim`

The nested schema/display shapes are closed as follows:

- `fixture`: ordered keys `fixtureId`, `schemaVersion`, `seedId`, `fixtureSha256`, `fixtureClass`, and `authenticContentExcluded`;
- each `requirementResults` entry: ordered keys `requirementId`, `result`, and `observationDigest`;
- each `scenarioResults` entry: ordered keys `scenarioId`, `result`, and `observationDigest`;
- each `contractResults` entry: ordered keys `contractId`, `result`, and `observationDigest`;
- `stateDigests`: ordered keys `beforeSha256`, `afterSha256`, `backupSha256`, `restoreSha256`, `comparisonSha256`, and `rollbackSha256`;
- `durableHealth`: ordered keys `backup`, `restoreVerification`, and `overall`, with values only from `unknown`, `never run`, `success`, `delayed`, `failed`, and `blocked`;
- `safety`: ordered keys `local`, `public`, `fictional`, `synthetic`, `authenticMediaAccessed`, `privateNetworkAccessed`, `externalMutationPerformed`, `aiContentPathUsed`, and `forbiddenContentFindings`; and
- `limitations`: a nonempty ordered array of fixed public-safe strings that retains the outstanding live-host acceptance boundary.

Object construction/display order and canonical serialization order are separate contracts. `canonicalJson` sorts every object key lexically by code unit, including the top-level and all nested objects above; it preserves only array order, including the exact requirement, scenario, contract, limitation, and observation arrays. All 11 requirement records and all 15 scenario records must be present once each in the frozen array order below, each with an explicit result and independently derived observation digest. The contract-result array covers exactly the eight proposal behavior families: `surface-isolation`, `capacity-and-collision`, `authenticated-encryption`, `backup-restore-rollback`, `durable-health`, `sanitized-logging`, `replay-interruption-crash`, and `receipt-boundary`.

The governed-evidence contract and seed tests must contain literal expected UTF-8 canonical byte vectors and independent SHA-256 expectations for at least the definition, one fixed-binding governed-evidence object, its child result with and without the single terminal LF as applicable, and each verifier boundary observation. Recomputing both expected and actual values through the same helper is not an oracle. Tests must compare exact bytes first and the independently frozen hash second; key insertion order permutations must produce identical canonical bytes, while any array-order, value, key-set, UTF-8, newline, or normalization change must fail. Successful governed evidence has exactly one conclusion, `synthetic foundation passes`. A failed assertion, missing evidence, or private-evidence-required condition produces no `outcome=succeeded` child result and cannot serialize either `synthetic foundation fails` or `blocked — private evidence required` inside success evidence. Pre-launch denial remains `blocked-no-mutation` or `expired-before-mutation` as applicable; a post-launch child/result/verifier failure follows the runner's existing `recovery-required` path. No new optimistic terminal state is introduced.

The complete normalized schema, fixture constants, oracle constants, result semantics, canonical ordering, fixed limitations, and exact permitted claim are frozen into a 58,639-byte canonical contract payload before local payload `C` is finalized or its manifest arm is created. Its reviewed digest is:

```text
sha256:38c8deeb899e87cfef731cc1932d3594f3cf4b7d6afa1aeff62cb343395931d8
```

The contract binds fixture digest `sha256:a5b51a5564523396c6c07c4a861de94ca594232af73336f283fa3b53a71e4022`. For the frozen all-zero source-revision vector, the normalized evidence is 7,738 canonical bytes with digest `sha256:21a2b56022c4034d8ff6f1eed8c8933cb5980fb39191ed211e30209cbf954608`. Its exact child result is 421 canonical bytes without the terminal LF and hashes to `sha256:35a08e70b9364812bba9c15d701aba2048f2f3c28c147706c6ec06d20d6cf462`; the required 422-byte LF-terminated fd3 record hashes to `sha256:5edb9a81d6d75d36bde47f713cd38007e809236a19e54858d3cf3ae087188795`. The committed seed and its review dossier contain zero placeholder tokens; any change to these vectors requires a new exact-byte review.

### Child-result reconstruction

The future module constructs the child result in exactly this schema/display order; the frozen canonical JSON routine then serializes its object keys in lexical order and appends exactly one LF:

```text
schemaVersion
outcome
taskId
stageId
idempotencyKey
sourceRevision
stageBindingDigest
evidenceDigest
```

`schemaVersion` is `1.0.0`; `outcome` is `succeeded`; the task, stage, idempotency, revision, and stage-binding values must equal the captured runner arguments; and `evidenceDigest` must equal the digest of the independently reproducible normalized evidence object. No raw fixture, ciphertext, key, nonce, route, body, path, private value, or module-authored Gate B authority field is included. A non-success conclusion cannot be represented by this child schema: the module instead exits nonzero without writing a success child result.

### Code-owned verifier reconstruction

The sole `PRODUCTION_OUTCOME_VERIFICATION_ALLOWLIST` entry is keyed by `spk.synthetic`. Its verifier is code-owned by `P0-stage-runner.mjs`; it must not import the future module, call module code, accept a caller-supplied oracle, or return an echo of its request. It maintains an independently expressed copy of the frozen public fixture, oracle, schema, ordering, limitations, and permitted claim and reconstructs:

1. the complete normalized governed-evidence object and expected `evidenceDigest`;
2. the exact canonical child-result bytes, including the terminal LF, and expected `childResultSha256`; and
3. a boundary-specific observation object and digest for each of `immediate`, `quiescent-1`, and `quiescent-2`.

It returns a value only when the request has exactly the runner-owned verification keys; every task, stage, source revision, stage-binding, module, child-result, evidence, and boundary value matches; and the verifier's internally frozen governed-evidence contract has the reviewed contract digest. The returned object has schema/display keys `schemaVersion`, `outcome`, `boundary`, `taskId`, `stageId`, `sourceRevision`, `stageBindingDigest`, `moduleSha256`, `childResultSha256`, `evidenceDigest`, and `observationDigest`; canonical serialization still sorts those keys lexically. `outcome` is `pass`. Any mismatch, unknown field, noncanonical value, exception, or reconstruction failure returns no verification and forces the runner into its existing fail-closed recovery path.

For retrievability, `P0-stage-runner.mjs` must also export one deterministic public-safe code-owned API, `reconstructProductionGovernedEvidence`. Its request has exactly the own data keys `moduleId`, `taskId`, `stageId`, `sourceRevision`, `stageBindingDigest`, `moduleSha256`, and `evidenceDigest`; it accepts no function, oracle, bytes, path, environment, clock, authorization, or I/O hook. The API selects the same code-owned `spk.synthetic` reconstruction used by the verifier, independently rebuilds the complete normalized governed-evidence object, canonicalizes it, and returns a deep-frozen value only when both the recomputed digest and every identity equal the request. A missing/extra/accessor/proxy field, wrong digest, unsafe value, failed assertion, or private-required state returns `null`. The export performs no module import, module call, filesystem/network access, journal write, authorization decision, or receipt minting and grants no execution authority. Tests must prove that the exported evidence canonicalizes to the child-bound `evidenceDigest`, that callers can retrieve every requirement/scenario/contract record from that value, and that digest or semantic drift fails closed.

## Exact requirement and scenario closure

The seed cannot add, remove, rename, reorder, or satisfy a requirement. The exact requirement order is:

1. `LID-SCP-001`
2. `LID-OPS-001`
3. `LID-OPS-002`
4. `LID-OPS-003`
5. `LID-OPS-004`
6. `LID-OPS-008`
7. `LID-OPS-011`
8. `LID-OPS-012`
9. `LID-OPS-014`
10. `LID-OPS-016`
11. `LID-OPS-018`

The exact scenario order is:

1. `SPK-R0-001-P-001`
2. `SPK-R0-001-P-002`
3. `SPK-R0-001-P-003`
4. `SPK-R0-001-T-001`
5. `SPK-R0-001-T-002`
6. `SPK-R0-001-T-003`
7. `SPK-R0-001-D-001`
8. `SPK-R0-001-D-002`
9. `SPK-R0-001-D-003`
10. `SPK-R0-001-QA-001`
11. `SPK-R0-001-QA-002`
12. `SPK-R0-001-QA-003`
13. `SPK-R0-001-QA-004`
14. `SPK-R0-001-QA-005`
15. `SPK-R0-001-QA-006`

The future implementation and candidate QA must cover the frozen proposal families: disjoint fictional human/callback surfaces; safe capacity arithmetic and collision refusal; authenticated synthetic ciphertext with wrong/missing-key and tamper failure; separate-empty-destination backup/restore/comparison and exact rollback; the six-value durable health vocabulary; closed sanitized local logs and synthetic retention; replay/idempotency/interruption/crash/dependency isolation; complete evidence-state and accessibility truth; public-safety and AI exclusion; and explicit live-host limitations. Candidate QA must preserve per-requirement and per-scenario records; an aggregate pass count cannot substitute for any item.

## Protected seed payload

The reviewed seed payload changes exactly these seven existing protected regular `100644` files:

| Path | Frozen responsibility |
| --- | --- |
| `docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md` | Correct the closed post-candidate registry path in line 116 from the nonexistent `docs/council/execution/releases/P0-R0-STAGE-APPROVAL-REGISTRY.json` to `docs/council/execution/P0-R0-STAGE-APPROVAL-REGISTRY.json`; update both authoritative runtime-state locations to the exact current boundary: the proposal and local-synthetic/synthetic-foundation Gate A preparation are accepted, the inert seed installs one SPK definition, one module-metadata entry, and one code-owned outcome verifier, callbacks/stage approvals/executable stages remain zero, and the module, candidate QA, Gate B, invocation, private probe, deployment, release, and task-status authority remain absent. |
| `tools/P0-staged-actions.mjs` | Install the one exact definition; strengthen bidirectional lifecycle identity, exact argument-set, callback, and cardinality reporting without changing Gate A/Gate B meaning. |
| `tools/P0-stage-runner.mjs` | Install the one inert serial metadata record, exact argument set, independent verifier, and public-safe reconstruction export; keep the callback map empty and preserve Gate B-before-future-module-path access. |
| `tools/P0-test-staged-actions.mjs` | Prove exact definition identity/vector/digest, bidirectional lifecycle closure, exact IDs/arguments/counts, zero approvals/executable stages, and rejection of every orphan/extra/mismatch. |
| `tools/P0-test-stage-runner.mjs` | Prove exact production request denial before future-module path access/copy, launcher/child creation, journal, or launch signal; callback denial; exact source length/hash rejection for every alternate byte vector and the bounded exact-source secondary invariant; exact canonical vectors; reconstruction/digest mismatch rejection; and unchanged fail-closed runtime behavior. |
| `tools/P0-validate-execution-controls.mjs` | Call the exact five-key lifecycle API and assert the accepted preparation, seed identity arrays/counts/argument set, empty callback surface, unchanged registry, no task readiness/execution/status effect, and R1-R10 freeze. |
| `tools/P0-stage0-ci.mjs` | Pin the updated deterministic fixture contracts, expected production counts, and complete exact-head checks. |

No other tool, workflow, authority source, registry, task record, projection, workbook, runtime module, fixture, evidence output, journal, or running-log path is part of the seven-blob seed payload. The consume commit necessarily also changes `docs/council/execution/P0-STAGE0-CONTROL-INTEGRITY.json` to install those exact seven reviewed hashes and clear `next`; that manifest is the eighth consume path, not an eighth seed target.

The seed must preserve all existing receipt keys, authorization keys, Gate B exact-main rechecks, source/candidate/module/registry bindings, lock and journal durability, deadline behavior, process-tree containment, three outcome-verification boundaries, public-result safety, terminal-state vocabulary, and recovery-required semantics. It must not weaken or bypass any test merely to change the expected production counts from zero to one.

## Required no-effect verification

Before the seed is eligible to arm, its exact frozen blobs must prove at least:

1. `validateStagedActionDefinition` accepts only the exact definition above and produces stage-binding digest `sha256:fc172d2f8c1e5f9dccdf7a5c398fe0a2038591f7fb2903e54961879c73041983`;
2. `validateStageRuntimeLifecycle` receives exactly `registry`, `definitions`, `moduleBindings`, `outcomeVerificationModuleIds`, and `callbackModuleIds`, closes every relationship in both directions, and returns the exact preparation/definition/module/verifier/callback ID arrays, exact `synthetic.v1:[]` argument binding, and counts `1/1/1/1/0/0/0` for preparation/definition/module/verifier/callback/stage-approval/executable;
3. metadata and verifier IDs are exactly `["spk.synthetic"]`, argument-set IDs are exactly `["synthetic.v1"]`, the sole argument array is exactly `[]`, callback IDs are exactly `[]`, and any omitted or extra API input or output identity fails closed;
4. after the allowed exact-main/history Git reads, an exact serial production request is denied by current exact-main Gate B before any operation targets the future-module path for stat, realpath, read, import, or copy; before a launcher or child is created; and before a runtime journal event or `LAUNCH_SIGNAL`;
5. the same identity on the callback surface is rejected without calling a supplied function;
6. missing/extra request fields, mutated-after-yield objects, accessors/proxies, wrong IDs, wrong predecessor, wrong pair, wrong module hash, wrong definition digest, and stale/revoked/expired authority remain fail-closed;
7. the production validator rejects every alternate length or raw hash before secondary analysis; the secondary import/token check is non-authorizing and runs only on the exact reviewed bytes, while the sole production positive is deferred until those bytes enter `I` and the independent source/dependency/builtin review remains mandatory;
8. verifier request echoing, wrong contract/evidence/child-result/module/boundary digests, reordered or missing requirements/scenarios, extra keys, unsafe text, and noncanonical bytes are rejected; literal canonical byte vectors and independently frozen hashes agree for the definition, fixed governed evidence, LF-terminated child result, and all three verifier boundaries;
9. the current registry bytes, six frozen proposal artifacts, accepted preparation digest, task contract, 11 IDs, 15 IDs, Roadmap projections, issue/Project state, and all R1-R10 files remain unchanged;
10. the future module path is absent from the seed tree and no module or candidate-QA scenario is executed; and
11. candidate `C` passes only candidate-safe focused, structural, public-safety, exact source-hash-gate, bounded secondary-invariant, and adversarial validation over its seven frozen local blobs, without claiming an on-tree production source positive or a general JavaScript-classification result; after the ratchet is consumed, two complete clean Stage 0 CI passes are byte-stable at exact consume `S`, and two more complete passes are byte-stable at exact post-merge `SM`.

These are control tests, not the 15 task scenarios. Passing them proves only that the inert runtime identity is closed and non-authorizing.

## Normal protected publication sequence

The seed uses only ordinary protected PRs and the existing add/modify ratchet. No direct `main` push, force-push, history rewrite, update-branch merge, squash, rebase, octopus merge, admin merge, required-check removal, branch-protection change, or exception is permitted.

1. **Dossier candidate `D`.** Directly parent exact `b90e7c8f6721b6e25436a04a56b04f58fe8b86d3`, add only this regular `100644` dossier, pass dossier-scoped structural/public-safety checks and independent review, then merge normally as `M=[b90e7c8,D]` with tree exactly `D`.
2. **Local frozen seed payload `C`.** From exact `M`, construct and review the seven target blobs above in an isolated local worktree. `C` is only the byte-for-byte payload plus its seven raw blob hashes: it is not a commit, branch, ref, PR head, merge candidate, or runnable exact-main tree and is never pushed or merged. It does not change the integrity manifest or registry. Run only candidate-safe focused, structural, exact source-hash-gate, bounded secondary-invariant, public-safety, and adversarial checks that do not claim an on-tree production source positive, a general JavaScript-classification result, manifest consumption, or exact-main completeness. Freeze all seven raw hashes only after the bytes, tests, placeholders, module digest, and governed-evidence contract are final.
3. **Manifest-only arm `A`.** Directly parent unchanged exact `M`. Change only `docs/council/execution/P0-STAGE0-CONTROL-INTEGRITY.json`; keep the 55-entry `current` array byte-for-byte and set `next.changes` to exactly seven sorted `modify` records binding the reviewed `100644` blob hashes for the seven targets. Merge normally as `AM=[M,A]` with tree exactly `A`. `A` and `AM` remain non-authorizing and non-executable.
4. **Exact seed consume `S` and merge `SM`.** Directly parent exact `AM`. Change exactly the seven protected targets to the reviewed `C` blobs plus the integrity manifest—eight paths total. Apply exactly the seven armed changes to `current`, preserve cardinality 55, and clear `next` to null. Every consumed target hash must equal its reviewed `C` hash. No registry or future-module path changes. Run two complete clean Stage 0 CI passes only now, against exact `S`; then merge normally as `SM=[AM,S]` with tree exactly `S` and run two complete clean Stage 0 CI passes again against exact `SM`.
5. **Exact-main audit and successor review.** At exact `SM`, verify immutable history and the exact preparation/definition/module/verifier/callback ID arrays, `synthetic.v1:[]` argument binding, and `1/1/1/1/0/0/0` counts. Publish the required non-authorizing successor-control dossier and record through their own normal PRs before relying on the seed as reviewed control state.
6. **Later implementation candidate `I` and merge `IM`.** Only after the seed and successor review are exact-main may `I` directly parent a freshly selected exact current `candidateBase`. Its `taskFiles` manifest is exactly the eight-path closure frozen below: the six accepted proposal blobs remain byte-identical, the module is the sole `implementation` entry and must match the precommitted raw module digest, and the candidate-QA contract is the sole `evidence` entry added by `I`. No executed-QA artifact is in `I`. `IM` must be the exact normal merge with parents `[candidateBase,I]`, tree equal to `I`, and no stale, side, interleaved, octopus, or content-losing history.
7. **Local candidate QA after `IM`.** A registered evidence producer runs all 15 local/public/fictional/synthetic scenarios only after exact `IM` under the accepted Gate A boundary; distinct Independent QA reviews or reproduces them. The three public-safe, non-main artifacts use the exact frozen paths below, where `<I12>` is the first 12 lowercase hexadecimal characters of `I`. They are never added to or used to alter exact main before Gate B; their raw hashes and reviewer bindings are inputs to the later stage review.
8. **Later Gate B `SA/SAM/S/SM`.** Five distinct current Council seats review the exact immutable `I` closure and the bound local evidence. Manifest-only `SA` directly parents exact `IM` and arms exactly the reviewed stage-registry `modify`; `SAM` is the exact normal merge `[IM,SA]` with tree equal to `SA`; stage publication `S` directly parents `SAM`, changes exactly the append-only stage registry plus integrity manifest, installs the armed registry hash, and clears `next`; and `SM` is the exact normal merge `[SAM,S]` with tree equal to `S`. The published ref remains `S` against separately fetched `SAM`. Only exact-main replay after that later `SM` can make `executableStageCount=1` and permit the guarded runtime to return `executionAllowed=true` for this exact request. Cancellation, stale or extra parents, wrong target hash, extra path, wrong tree, or any changed proposal/module/evidence binding fails closed.

The later `I.taskFiles` closure is exactly:

| Purpose | Path |
| --- | --- |
| unchanged proposal | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-PRD.md` |
| unchanged proposal | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-TECHNICAL-PLAN.md` |
| unchanged proposal | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-DESIGN-SPEC.md` |
| unchanged proposal | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-QA-PLAN.md` |
| unchanged proposal | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-DELIVERY-CHECKLIST.md` |
| unchanged proposal | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-COUNCIL-READINESS.md` |
| `implementation` | `tools/spk-r0-001/P0-SPK-R0-001-synthetic-foundation.mjs` |
| `evidence` | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-CANDIDATE-QA-CONTRACT.json` |

The post-`IM` local evidence paths are exactly:

```text
outputs/P0-SPK-R0-001-CANDIDATE-QA-<I12>/P0-SPK-R0-001-CANDIDATE-QA-RECEIPT.json
outputs/P0-SPK-R0-001-CANDIDATE-QA-<I12>/P0-SPK-R0-001-CANDIDATE-QA-EVIDENCE-INDEX.json
outputs/P0-SPK-R0-001-CANDIDATE-QA-<I12>/P0-SPK-R0-001-INDEPENDENT-QA-ATTESTATION.json
```

At every step, a moved base, unexpected path, stale arm, wrong blob hash, unresolved placeholder, failed check, review veto, topology mismatch, or non-normal merge stops publication. A cancellation clears only `next` through its own normal manifest-only PR and changes no protected bytes.

## Security, evidence, and claim boundaries

The seed and its tests may use only public repository bytes and fictional/local fixtures. They may not authenticate to a private target, inspect a host, read an account, use a credential, contact a provider, send an external request, use authentic memory or photo data, deploy, restart a service, perform a real backup or restore, spend money, or mutate a GitHub issue/Project item. No owner action is due or satisfiable for this stage. Deployment remains **Unknown — private read authority pending**.

The only conclusion permitted inside a successful governed-evidence object is `synthetic foundation passes`. `synthetic foundation fails` and `blocked — private evidence required` remain truthful candidate-QA or review dispositions, but they produce no successful child result and no `verified-complete` stage receipt. A private-required condition must remain pre-launch and use the existing `blocked-no-mutation` path; expiry uses `expired-before-mutation`; a failure after module launch or during result/verifier reconstruction uses the existing `recovery-required` path. Even a verified-complete governed synthetic stage would not establish live-host capacity/topology, real isolation, deployed encryption, provider behavior, off-server backup, real restore/rollback, owner Recovery Ceremony, task acceptance, release readiness, production health, or task `Done`. It would not authorize the later `private-execution/private-system-read` pair.

The dossier, seed review, arm, consume, CI, successor record, implementation publication, candidate QA, Gate B review, and runtime receipt are distinct evidence objects. None may stand in for another. Repository status, a green check, merged code, a module file, a matching digest, a Gate A record, or a stage definition cannot substitute for exact current Gate B authorization at the protected invocation boundary.

## Seed acceptance gate

Hold this seed unless all of the following are true:

1. both explicit placeholders have been replaced with exact reviewed digests and a repository-wide scan reports no remaining occurrence;
2. the exact IDs, 60-second deadline, null predecessor, empty argument array, future path, module hash, definition digest, schema/contract digest, and one-to-one topology are frozen and independently reproduced;
3. the seven protected target blobs are the sole seed payload, the future module is absent, the callback map is empty, and the stage registry remains exactly one preparation plus zero approvals;
4. candidate-safe structural, public-safety, frozen-scope, no-effect, exact source-hash-gate, bounded secondary-invariant, and adversarial checks pass over local payload `C` without an on-tree production source positive or a general JavaScript-classification claim; full Stage 0 CI is not claimed there, and two clean complete passes succeed separately at exact consumed `S` and exact post-merge `SM`;
5. Product, Design, Architecture, Independent QA, and Project reviewers all accept only the non-authorizing inert seed and report no unresolved veto;
6. the manifest arm and eight-path consume (seven targets plus manifest) publish through exact normal parent/tree topology with no exception or intervening main change;
7. exact post-consume main still reports zero executable stages, zero Ready tasks, zero execution-allowed tasks, unchanged R1-R10 scope, and `executionAllowed=false` for `SPK-R0-001`; and
8. the only permitted seed claim remains: **the exact code-owned identity and independent verification contract for one future local/public/fictional/synthetic stage are installed inertly; no module, candidate QA, Gate B approval, invocation, private action, delivery transition, acceptance, deployment, release, production state, or task-status effect exists.**
