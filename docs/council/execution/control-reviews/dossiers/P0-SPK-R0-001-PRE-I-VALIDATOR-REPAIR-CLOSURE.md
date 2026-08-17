# P0 SPK-R0-001 pre-I validator repair successor closure dossier

- **Prepared:** 2026-08-18
- **Task:** `SPK-R0-001`
- **Required dossier-candidate parent:** `549240615b8a6aa46256c21a0ce6e5f369560b40`
- **Aggregate review base:** `c35eed4691413adf3442ed412535a56d55f39cd6`
- **Predecessor review:** `P0-SPK-R0-001-RUNTIME-ACTIVATION-SEED`
- **Predecessor record:** `docs/council/execution/control-reviews/P0-CONTROL-REVIEW-P0-SPK-R0-001-RUNTIME-ACTIVATION-SEED.json`
- **Predecessor canonical record SHA-256:** `8d2d38ddf54e2dc0a9e40a7f2d4d7af2e5b0db378aa9080b53b3d9e1a3d8f1a5`
- **Required successor review:** `P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR`
- **Required successor record:** `docs/council/execution/control-reviews/P0-CONTROL-REVIEW-P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR.json`
- **Task-approval effect:** none
- **Runtime-authority effect:** none
- **Execution-permission effect:** none
- **Private, external, status, delivery, deployment, release, production, or R1-R10 effect:** none

## Purpose and authority boundary

This dossier closes only the public/local publication interval for the pre-implementation validator repair required before the frozen `SPK-R0-001` implementation candidate can exist. It records the already completed dossier, arm, consume, normal-merge topology, exact-head checks, exact-main checks, and resulting inert repository-control state. It does not create or approve the implementation candidate, execute candidate QA, publish Gate B, invoke a stage, access a private system or authentic content, mutate an external system, change task status, or establish deployment, acceptance, release, or production state.

The earlier pre-I repair dossier predicted the repair and required this distinct post-consume closure and successor record. It cannot attest to the later commit identities, merge trees, check outcomes, or exact-main result and must not be reused as closure evidence. This closure dossier, its normal merge, the later successor record, and that record's normal merge are separate evidence objects. None substitutes for the later implementation, candidate-QA, Gate-B, or runtime evidence.

The symbols `D2`, `D2M`, `R`, `RM`, and `I` below are topology roles, not unresolved commit placeholders. Candidate-derived hashes and object IDs are deliberately derived only after their immutable objects exist; they must not be guessed or self-embedded in this document.

## Predecessor review boundary

The predecessor record was published by commit `c35eed4691413adf3442ed412535a56d55f39cd6`, whose sole parent is `b94938bdd6b14a402e7189d54e17a85505f9b8bb`. Its sole change is the regular `100644` addition of the predecessor record above, Git blob `4e50e507e33d5447d4bb71ba9e3ff273eb12189b`, raw SHA-256 `ec9efd2c36c20f14710329e0fd28fb7fc999f8ac0990636847681e1cf3f65bc1`, and canonical record SHA-256 `8d2d38ddf54e2dc0a9e40a7f2d4d7af2e5b0db378aa9080b53b3d9e1a3d8f1a5`.

Normal merge `499059a2aabd8bac6aecf5d6ce96fa3ff27e35e4` has ordered parents `[b94938bdd6b14a402e7189d54e17a85505f9b8bb,c35eed4691413adf3442ed412535a56d55f39cd6]` and tree `ca3efb3f288c65334256c99c97a9392c0d408454`, exactly equal to the predecessor record candidate tree. The next record must use `c35eed4691413adf3442ed412535a56d55f39cd6` as its aggregate base and the canonical record SHA-256 above; the raw predecessor-file digest is not the canonical predecessor digest.

## Publication history closed by this dossier

Every successful Stage 0 suite cited below reported `P0_STAGE0_CI_OK`, `passCount=2`, and suite-definition digest `sha256:4dc3d525b9404b5bcd068fb22deb73fd7fa9cd1647155a561f32e49fe705390f`.

### PR #104 - initial repair dossier

- Candidate `d0a67a885938a10c8625fa245b83c2e02f14fb26` has sole parent `dbab302694a28f40ef82146c88eb7068540711f1`, tree `06632e78f86ee4b42e31c9cc787dac8cfa852d2f`, and adds only `docs/council/execution/control-reviews/dossiers/P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR.md` as a regular `100644` file.
- The initial dossier is 23,145 bytes and 200 lines, raw SHA-256 `ec0b5a924bc4abfc92d4c263d739bba5f408791c4e7f63fbd0780e6acc0ed427`, Git blob `d2c505bd7fb47e4ce89e150e0bb9727d0ce54314`.
- Local exact-head result: `sha256:5e6954ffb33c70d79b771e2d520ecae653609995245657889b7a310faf5ba5a3`.
- Push run `32061840421` and PR run `32061891509` succeeded with result `sha256:6ab4d943e065df7c4570a56d0a37e511c08d782cd18d557fb9d20a8a02692c64`.
- Guard runs `32061891441` and `32062503030` succeeded with the integrity state clear.
- Normal merge `4d74a5707fe3f9e3aedcc152c2707dc5304bf814` has ordered parents `[dbab302694a28f40ef82146c88eb7068540711f1,d0a67a885938a10c8625fa245b83c2e02f14fb26]` and tree exactly equal to the candidate tree.
- Exact-main run `32062575488` succeeded with result `sha256:12a0d8512def5003fbbbdc3c97ffcdaecfeabede4c336ee8093d99b6936ce368`.

### PR #105 - manifest-only arm

- Arm candidate `c6fed5b3a0c428c015a087faea03182be3309fbb` has sole parent `4d74a5707fe3f9e3aedcc152c2707dc5304bf814`, tree `461cbc833f37163d98c3638cfec03d7eb243a258`, and modifies only `docs/council/execution/P0-STAGE0-CONTROL-INTEGRITY.json`.
- The armed manifest is 12,723 bytes, preserves all 55 `current` records, and contains exactly eight code-point-sorted `modify` records in `next`; raw SHA-256 `07f75bd14de261b0d79991b076a33f3bdc3e64627da267c4cd6f80df1702478a`, Git blob `378ab5a81330da7fa5f30fe971b3ec2385d86bfc`.
- Local exact-head result: `sha256:9c2c921219c58dac4f12ffa9d059be8add10c147431ad8b8e7650b5e5db1926e`.
- Push run `32065832873` and PR run `32065888261` succeeded with result `sha256:9424a41802ea30b9d669cc90cd9b6fc5c15c7d843878e9843d4f8458a22ec532`.
- Guard runs `32065888399` and `32066480588` succeeded with transition `armed`.
- Normal arm merge `2101fdbbba4c495347d218093fbbc2605949a5aa` has ordered parents `[4d74a5707fe3f9e3aedcc152c2707dc5304bf814,c6fed5b3a0c428c015a087faea03182be3309fbb]` and tree exactly equal to the arm candidate tree.
- Exact-main run `32066611440` succeeded with result `sha256:878efd740cb0738a2f3c095ff80b876c4c372f36b57b2aa2e3be281774d65b01`.

### PR #106 - exact consume

- Consume candidate `14359c1b5ce5a47ad6cbd943d8badd1acf983900` has sole parent `2101fdbbba4c495347d218093fbbc2605949a5aa`, tree `7a32b34d4b9c635d50b128454fe7724ec96a8eb4`, and modifies exactly the eight frozen targets plus the integrity manifest as regular `100644` blobs.
- The consumed manifest is 10,766 bytes, has 55 `current` records and `next:null`, raw SHA-256 `0eaddfd36358b296ab45676e7b6283c2cf4ea2abaf2a1e1fa8fde7e04f576943`, Git blob `b803a8f4237047ed7caa5c905c710a3a08583998`.
- Local exact-head result: `sha256:04f5a17cc0f1366fc4c52f9776bdc37fefa4406df8f5721751b44c3f60cdd57d`.
- Push run `32070527805` and PR run `32070590838` succeeded with result `sha256:e2dbd07fbeb6aaf80c849bfdbc4e5ae6fb4a900863400027022a5463c4f42988`.
- Guard runs `32070590250` and `32071245814` succeeded with transition `consumed`.
- Normal consume merge `549240615b8a6aa46256c21a0ce6e5f369560b40` has ordered parents `[2101fdbbba4c495347d218093fbbc2605949a5aa,14359c1b5ce5a47ad6cbd943d8badd1acf983900]`, tree `7a32b34d4b9c635d50b128454fe7724ec96a8eb4` exactly equal to the consume candidate tree, and exactly the nine reviewed regular `100644` first-parent modifications.
- Exact-main run `32071342859`, attempt 1, succeeded with result `sha256:3965d066884a3ad06c20b6e0fb768a47767e6774085e9f192c02c34aee998e5c`.

No failed or superseded attempt is omitted from PR #104-#106 evidence. Live main remains the exact consume merge at dossier preparation, and required branch protection remains strict with admin enforcement, conversation resolution, the immutable guard and exact-head suite required, and force push and deletion disabled.

## Frozen eight-target repair payload

Every row is a `modify` from a regular `100644` blob to a regular `100644` blob. The raw SHA-256 below is the exact consumed side.

| Path | Consumed raw SHA-256 |
| --- | --- |
| `docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md` | `7095ca0ec166fada945ba0caacbdd20ea6137484e97d2b4605edc53e3426c1c5` |
| `docs/council/execution/releases/P0-P0-R0-STAGE0-STATE-CONTRACT.md` | `8deba1d7bd662002c81d6f6e971a9f17a96f979d6ef39450c04065a162545a22` |
| `tools/P0-readiness-gates.mjs` | `30d805120f3d8f4972cf6792d5dbdafbdba2c5ed307503be530345f3e70bfd3a` |
| `tools/P0-stage0-ci.mjs` | `88f2f7f02cb37108861c8e5b106275e5cb286157747c4cce6ccdd59cfbeb3259` |
| `tools/P0-staged-actions.mjs` | `c64914808c275c633a451d3a1a228d0e4194c331226ac6844ad67eaf204e57b9` |
| `tools/P0-test-execution-controls.mjs` | `6345dc2334252f380e093efd81598c2b19f59879f1c10cda9b9db96414f95666` |
| `tools/P0-test-staged-actions.mjs` | `10d14bd85fce6ac9f420d720ba6747dcb79969231b13c8e092720ba5d776136a` |
| `tools/P0-validate-execution-controls.mjs` | `f3947d8ab05baba093eb70b99b4a0fe195070c912869c713355b7708ce93f342` |

No workflow, reviewer or approval registry, module, candidate-QA contract, proposal, projection, workbook, output, journal, running log, environment, or dependency path belongs to the eight-target payload. The integrity manifest is the ninth consume path and only applies the exact arm before clearing `next`; it is not a ninth repair target.

## Exact post-consume state

At exact consume merge `549240615b8a6aa46256c21a0ce6e5f369560b40`:

- the integrity manifest is regular `100644`, has 55 `current` entries and `next:null`, and matches the consumed hash above;
- the canonical generated work-item inventory remains exactly 348 files;
- `docs/work-items/SPK-R0-001/P0-SPK-R0-001-CANDIDATE-QA-CONTRACT.json` and `tools/spk-r0-001/P0-SPK-R0-001-synthetic-foundation.mjs` are both absent;
- the production lifecycle tuple, in preparation/definition/module-metadata/outcome-verifier/callback/stage-approval/executable order, is exactly `1/1/1/1/0/0/0`;
- the stage registry has one accepted Gate-A preparation and zero Gate-B stage approvals, so `executionAllowed=false`;
- structural validation reports 78 requirements, 58 tasks, 348 task artifacts, 336 Draft, 12 In-review, zero Ready, zero execution-allowed, and 58 incomplete artifact-readiness results; and
- all 50 R1-R10 tasks and 300 R1-R10 artifacts remain frozen with zero execution allowed.

The repaired validators now recognize exactly the 348-file pre-`I` state and, only from exact `I`, the paired 349-file state containing the exact candidate-QA contract and exact module. They accept only lifecycle tuples `1/1/1/1/0/0/0` and `1/1/1/1/0/1/1`. This is validation capability, not activation or execution authority.

## Aggregate endpoint derivation

The exact endpoint diff from aggregate base `c35eed4691413adf3442ed412535a56d55f39cd6` to required parent `549240615b8a6aa46256c21a0ce6e5f369560b40` has exactly 11 code-point-sorted records. Every non-null side is a regular `100644` blob. Its canonical changed-files SHA-256 is `ce3d70998fa0f49d735171d3920a8cddb697b845e2e9146a558a6e51b2b91791`.

| Change | Path | Base raw SHA-256 | Required-parent raw SHA-256 |
| --- | --- | --- | --- |
| `modify` | `RUNNING_LOG.md` | `88324f428acb0254a82ad921a6cb73e92705363538b6c7501bacb4951548de9d` | `22ab3008fd3be9a7283ff3cfcc82eea619215e8e85d7e478db1d0ca4c97a1533` |
| `modify` | `docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md` | `a21cef249066a851bfe89f3fb42d9f108d89f30097e883dcaa47c05c05054869` | `7095ca0ec166fada945ba0caacbdd20ea6137484e97d2b4605edc53e3426c1c5` |
| `modify` | `docs/council/execution/P0-STAGE0-CONTROL-INTEGRITY.json` | `628949d77f6f92d9ad88875bb069dcf887ca233e4463a9087f78da5859901260` | `0eaddfd36358b296ab45676e7b6283c2cf4ea2abaf2a1e1fa8fde7e04f576943` |
| `add` | `docs/council/execution/control-reviews/dossiers/P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR.md` | `null` | `ec0b5a924bc4abfc92d4c263d739bba5f408791c4e7f63fbd0780e6acc0ed427` |
| `modify` | `docs/council/execution/releases/P0-P0-R0-STAGE0-STATE-CONTRACT.md` | `06d15713d63469bacaf25857b483f7ba7cfc3bfa8178ff856c10b1e5733f25f4` | `8deba1d7bd662002c81d6f6e971a9f17a96f979d6ef39450c04065a162545a22` |
| `modify` | `tools/P0-readiness-gates.mjs` | `b95a2ff9b31e3693302b26572220b1b49fbf263d17b13ee670873594b8340f00` | `30d805120f3d8f4972cf6792d5dbdafbdba2c5ed307503be530345f3e70bfd3a` |
| `modify` | `tools/P0-stage0-ci.mjs` | `5bce57ae12b2977a70c3336ae855c799e2c65858ad07de21bd856c5187cb0f14` | `88f2f7f02cb37108861c8e5b106275e5cb286157747c4cce6ccdd59cfbeb3259` |
| `modify` | `tools/P0-staged-actions.mjs` | `b499ed76cddee1a654dfdec1517ec61adb80ef8b8cc627029edf6a129828018e` | `c64914808c275c633a451d3a1a228d0e4194c331226ac6844ad67eaf204e57b9` |
| `modify` | `tools/P0-test-execution-controls.mjs` | `bfa5718431d30886ea784eb7e9b92953ffe3e2a8a31d4b98cde26e4ccc2aa79a` | `6345dc2334252f380e093efd81598c2b19f59879f1c10cda9b9db96414f95666` |
| `modify` | `tools/P0-test-staged-actions.mjs` | `21a351d24d289f64202dec36a581bb87b5726a465b09f73e9c4571f0fc01de38` | `10d14bd85fce6ac9f420d720ba6747dcb79969231b13c8e092720ba5d776136a` |
| `modify` | `tools/P0-validate-execution-controls.mjs` | `860d0c894be92b777ddefb8eead94b1ee0a676c3e876c76cbe54e4f93d23867a` | `f3947d8ab05baba093eb70b99b4a0fe195070c912869c713355b7708ce93f342` |

The dossier-only candidate `D2` adds this closure dossier as the twelfth record with a null base side and a regular `100644` candidate blob. The successor record must independently derive the complete `c35eed4691413adf3442ed412535a56d55f39cd6..D2` endpoint diff, bind all raw hashes, modes, and types, and recompute the final 12-record `changedFilesSha256` only after the dossier bytes and `D2` freeze. The 11-record digest above is not the final successor-record digest.

## Successor review contract

The successor record must use predecessor kind `review`, predecessor ID `P0-SPK-R0-001-RUNTIME-ACTIVATION-SEED`, the predecessor path and canonical digest frozen above, `candidate.baseRevision=c35eed4691413adf3442ed412535a56d55f39cd6`, and `candidate.revision=D2`. It must bind the exact closure-dossier digest, candidate reviewer-registry bytes, the complete 12-record manifest and digest, contributors, passing checks, common review context, five seat attestations, zero vetoes, and the fixed non-authorizing conclusion.

The candidate reviewer registry at the required parent has raw SHA-256 `71c3eaf517da4bec7048fa53617410160032def15ded247bdfbfd11dcb83a30e`. It must be recomputed at exact `D2`; a copied value or semantic-only JSON comparison cannot substitute for exact candidate bytes.

Contributor arrays are exactly:

- implementer: `codex-primary-integrator-01`;
- evidence producer: `codex-evidence-producer-01`.

Named checks are exactly these code-point-sorted passing entries:

1. `P0-CHECK-ADVERSARIAL`
2. `P0-CHECK-FROZEN-SCOPE`
3. `P0-CHECK-GITHUB-CI`
4. `P0-CHECK-INDEPENDENT-QA`
5. `P0-CHECK-LOCAL-CI`

The five distinct active seats are:

| Seat | Reviewer ID |
| --- | --- |
| Product | `codex-product-manager-01` |
| Design | `codex-ui-ux-designer-01` |
| Architecture | `codex-technical-architect-01` |
| Independent QA | `codex-independent-qa-01` |
| Project | `codex-project-manager-01` |

Every seat must bind the same exact review context and `D2`, supply its own evidence reference, evidence digest, rationale, and attestation digest, and return only `approve-normal-merge-only`. Reviewer identities must be unique. Independent QA must be distinct from every other seat and absent from both contributor arrays. All candidate-specific check and seat values remain unfrozen until `D2` and its terminal evidence exist.

The record's fixed authority fields are `taskApprovalCreated=false`, `runtimeAuthority=false`, `executionAllowed=false`, `privateActionAllowed=false`, `statusTransitionAllowed=false`, `r1R10Effect=none`, `unresolvedVetoes=[]`, and `disposition=accepted-normal-merge-only`.

The only permitted claim is:

> Accepted only for normal publication of the exact public/local control candidate; this review is non-authorizing and creates no task approval, execution permission, private access, R0 action, deployment, acceptance, status transition, or R1-R10 effect.

## Mandatory remaining topology

1. **Closure dossier candidate `D2`.** `D2` is a single-parent direct child of exact `549240615b8a6aa46256c21a0ce6e5f369560b40`. It adds only this dossier as a regular `100644` file and changes neither the integrity manifest nor any repaired target.
2. **Closure dossier merge `D2M`.** Publish `D2` through a normal required-check PR. `D2M` has exactly ordered parents `[549240615b8a6aa46256c21a0ce6e5f369560b40,D2]` and a tree exactly equal to `D2`.
3. **Successor record candidate `R`.** Only after exact `D2M`, `R` is a fresh single-parent direct child of `D2M`. It adds only `docs/council/execution/control-reviews/P0-CONTROL-REVIEW-P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR.json` as a regular `100644` file, that path was absent at `D2`, and the record binds `D2`, not `D2M`.
4. **Successor record merge `RM`.** Publish `R` through a second normal required-check PR. `RM` has exactly ordered parents `[D2M,R]` and a tree exactly equal to `R`. At exact `RM`, the immutable successor-review verifier must pass for `P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR` with zero findings.

Do not publish a running-log recap or any other path between `SM` and `D2`, between `D2M` and `R`, or before `RM`. No direct-main push, force-push, history rewrite, squash, rebase, update-branch merge, octopus merge, admin merge, required-check removal, branch-protection change, or exception is permitted. A moved base or any extra path invalidates the affected candidate; stop and rebuild from the new exact main rather than rewriting the reviewed object.

## Later implementation boundary

Only after exact `RM` and a zero-finding successor-review verification may a later implementation candidate `I` directly parent freshly selected exact main. `I` must add exactly the frozen module and candidate-QA contract while retaining the six unchanged proposal files as its eight-path `taskFiles` closure:

- module: `tools/spk-r0-001/P0-SPK-R0-001-synthetic-foundation.mjs`, regular `100644`, 135,119 bytes, raw SHA-256 `e60d8e6398441a61812dd467ffcbdd292e01fb1198723e667e480d2cf453e47f`;
- candidate-QA contract: `docs/work-items/SPK-R0-001/P0-SPK-R0-001-CANDIDATE-QA-CONTRACT.json`, regular `100644`, 52,147 bytes, raw SHA-256 `0467b716d1952b59fd07acf5337c6a105d44cfc926c104635829027751cdfb7f`.

The six proposal blobs remain unchanged. Only after exact normal merge `IM` may the registered evidence producer execute the 15 local/public/fictional/synthetic candidate-QA scenarios. Candidate QA, Independent QA, five-seat Gate B review, Gate-B publication, runtime invocation, and any governed receipt remain separate later steps.

## Non-authority and closure acceptance

This dossier and any accepted successor record grant no task approval, runtime authority, execution permission, private action, status or delivery transition, deployment, acceptance, release, production claim, or R1-R10 effect. They authorize no credential use, authentic-content access, private host or provider contact, external mutation, GitHub issue or Project mutation, spend, backup, restore, rollback, process launch, or owner action. Deployment remains **Unknown — private read authority pending**.

Hold publication unless all of the following are true:

1. the candidate's sole parent is freshly verified exact `549240615b8a6aa46256c21a0ce6e5f369560b40`, and its sole diff is this added regular `100644` dossier;
2. the aggregate `c35eed4691413adf3442ed412535a56d55f39cd6..D2` derivation is exactly 12 safe records, with every raw hash, mode, type, and the final canonical digest independently reproduced;
3. PR #104-#106 candidate, merge, check, arm/consume, and exact-main evidence remains exact and complete;
4. exact `D2` still reports the consumed 55-entry `next:null` manifest, all eight repaired hashes, canonical 348-file inventory, paired future files absent, lifecycle `1/1/1/1/0/0/0`, one preparation, zero approvals, zero Ready and execution-allowed tasks, and no R1-R10 change;
5. the predecessor, dossier bytes, candidate reviewer registry, contributors, five named checks, common review context, five distinct seat attestations, zero vetoes, and all canonical digests independently verify;
6. public-text safety, whitespace, exact-head required checks, immutable-history checks, and frozen-scope checks pass without exception;
7. `D2`, `D2M`, `R`, and `RM` publish only through the exact two-PR normal-merge topology above, with the integrity manifest unchanged; and
8. the only accepted conclusion remains the fixed non-authorizing permitted claim above.
