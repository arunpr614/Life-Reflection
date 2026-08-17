# P0 SPK-R0-001 pre-I validator repair dossier

- **Prepared:** 2026-08-18
- **Task:** `SPK-R0-001`
- **Required dossier-candidate parent:** `dbab302694a28f40ef82146c88eb7068540711f1`
- **Predecessor review:** `P0-SPK-R0-001-RUNTIME-ACTIVATION-SEED`
- **Predecessor record:** `docs/council/execution/control-reviews/P0-CONTROL-REVIEW-P0-SPK-R0-001-RUNTIME-ACTIVATION-SEED.json`
- **Predecessor canonical record SHA-256:** `8d2d38ddf54e2dc0a9e40a7f2d4d7af2e5b0db378aa9080b53b3d9e1a3d8f1a5`
- **Later successor aggregate base:** `c35eed4691413adf3442ed412535a56d55f39cd6`
- **Repair payload:** eight existing protected regular `100644` blobs
- **Task-approval effect:** none
- **Runtime-authority effect:** none
- **Execution-permission effect:** none
- **Private, external, status, delivery, deployment, release, production, or R1-R10 effect:** none

## Purpose and authority boundary

This dossier freezes a pre-implementation validator repair for the already reviewed `SPK-R0-001` plan. The current controls accept the exact 348-file generated proposal baseline and only the inert zero-approval production snapshot. They must also be able to validate the already frozen implementation design when a later candidate `I` introduces exactly one registered candidate-QA contract with its exact paired module, and when a still-later Gate-B publication moves the same closed lifecycle from zero approvals to one exact approval.

The repair widens neither task scope nor authority. It registers one exact supplemental evidence path, requires it to be absent or present only with one exact paired module, and closes production lifecycle validation to two exact tuples. It does not add either frozen implementation file, create `I`, run candidate QA, publish Gate B, approve a task, invoke a stage, access private systems or authentic content, mutate an external system, change task status, or establish deployment, release, acceptance, or production state.

The required dossier candidate adds only this document. The eight repair targets remain local frozen bytes until an exact manifest-only arm is normally published and consumed. Candidate, arm, consume, post-consume closure, successor record, implementation, candidate QA, Gate B, and any runtime receipt are separate evidence and publication objects. None substitutes for another.

## Exact base state

The required parent is normal merge `dbab302694a28f40ef82146c88eb7068540711f1`, with ordered parents `[499059a2aabd8bac6aecf5d6ce96fa3ff27e35e4,842b57642ad03121692ffb3a1d620dcd0e0bd61a]` and tree `c2fcfc9ceba01b462e42311f54b274be5326e3f5`. Its first-parent change is the trusted non-authorizing running-log recap; it does not change any repair target.

At this exact base:

- the integrity manifest is regular `100644`, has 55 `current` entries and `next:null`, raw SHA-256 `628949d77f6f92d9ad88875bb069dcf887ca233e4463a9087f78da5859901260`, and Git blob `515b8e607d5f405d2b2837a95ee83ae3384e8980`;
- the canonical generated work-item inventory is exactly 58 tasks times six artifacts, or 348 regular `100644` files;
- the frozen module path and the registered candidate-QA contract path are both absent from HEAD and the worktree;
- the production lifecycle tuple, in preparation/definition/module-metadata/outcome-verifier/callback/stage-approval/executable order, is exactly `1/1/1/1/0/0/0`;
- the stage registry has one accepted Gate-A preparation and zero Gate-B stage approvals, so `executionAllowed=false`;
- structural validation reports 78 requirements, 58 tasks, 348 task artifacts, 336 Draft, 12 In-review, zero Ready, zero execution-allowed, and 58 incomplete artifact-readiness results; and
- all 50 R1-R10 tasks and 300 R1-R10 artifacts remain frozen with zero execution allowed.

These are repository-control facts, not product, deployment, restore, rollback, acceptance, release, or production evidence.

## Frozen eight-target payload

Every row below is `changeType=modify`. Both the base and repair sides are Git type `blob` and mode `100644`; a deletion, addition, rename, symlink, submodule, executable-mode change, type transition, different byte count, different raw SHA-256, or different Git blob ID is not this repair.

| Path | Base bytes / raw SHA-256 / Git blob | Repair bytes / raw SHA-256 / Git blob |
| --- | --- | --- |
| `docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md` | `39163` / `a21cef249066a851bfe89f3fb42d9f108d89f30097e883dcaa47c05c05054869` / `9b81be0989672e0c6d2d2d5061b2a79bf7a25b2d` | `41800` / `7095ca0ec166fada945ba0caacbdd20ea6137484e97d2b4605edc53e3426c1c5` / `53c55012c87f5a7070bbf5c6f66a74dd52389884` |
| `docs/council/execution/releases/P0-P0-R0-STAGE0-STATE-CONTRACT.md` | `16871` / `06d15713d63469bacaf25857b483f7ba7cfc3bfa8178ff856c10b1e5733f25f4` / `25cd4044ea990104802fc6fb3d18d270f8c3529f` | `18690` / `8deba1d7bd662002c81d6f6e971a9f17a96f979d6ef39450c04065a162545a22` / `531ef7f9c31dfdcc0313bbdc1fcef0e4e7ef934c` |
| `tools/P0-readiness-gates.mjs` | `160124` / `b95a2ff9b31e3693302b26572220b1b49fbf263d17b13ee670873594b8340f00` / `9019a20f4cadf935edba6ba8c39bb4330e60ca2e` | `170537` / `30d805120f3d8f4972cf6792d5dbdafbdba2c5ed307503be530345f3e70bfd3a` / `7fd267531f69a735a8d394878cf1386c8b8ee5ff` |
| `tools/P0-stage0-ci.mjs` | `73736` / `5bce57ae12b2977a70c3336ae855c799e2c65858ad07de21bd856c5187cb0f14` / `7f660a5ce9ff5bd938bda145a49b34c79f33fb96` | `73736` / `88f2f7f02cb37108861c8e5b106275e5cb286157747c4cce6ccdd59cfbeb3259` / `4076501e1847a1d92be8a1206f9921c04a57fcd8` |
| `tools/P0-staged-actions.mjs` | `113021` / `b499ed76cddee1a654dfdec1517ec61adb80ef8b8cc627029edf6a129828018e` / `c9675a2423487dae37461097f221415057d98324` | `116689` / `c64914808c275c633a451d3a1a228d0e4194c331226ac6844ad67eaf204e57b9` / `38d971c420ad4b11d23f50e09ed5adba7e2d5253` |
| `tools/P0-test-execution-controls.mjs` | `175717` / `bfa5718431d30886ea784eb7e9b92953ffe3e2a8a31d4b98cde26e4ccc2aa79a` / `02500eaf7a872fc5e55756efabbe8a9511e631f9` | `186440` / `6345dc2334252f380e093efd81598c2b19f59879f1c10cda9b9db96414f95666` / `dc860b9514fe4b2ddf2bf524f2afd0f0ebc63df4` |
| `tools/P0-test-staged-actions.mjs` | `146443` / `21a351d24d289f64202dec36a581bb87b5726a465b09f73e9c4571f0fc01de38` / `62eec982c88971e547877a5378ea7ad909935882` | `150288` / `10d14bd85fce6ac9f420d720ba6747dcb79969231b13c8e092720ba5d776136a` / `e0eb29f10b44972808e018e7714b429287fec767` |
| `tools/P0-validate-execution-controls.mjs` | `115983` / `860d0c894be92b777ddefb8eead94b1ee0a676c3e876c76cbe54e4f93d23867a` / `ef1f4b5ae202a42425cc58a6a7d517f48755044a` | `124723` / `f3947d8ab05baba093eb70b99b4a0fe195070c912869c713355b7708ce93f342` / `1823c804cbc2701c64e074b9b5acb3cc9812efcc` |

The frozen responsibilities are:

| Path | Repair responsibility |
| --- | --- |
| `docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md` | State the exact 348-before-`I` / 349-from-`I` inventory, exact paired-path rule, exact hashes, HEAD/worktree parity, and two lifecycle tuples without granting authority. |
| `docs/council/execution/releases/P0-P0-R0-STAGE0-STATE-CONTRACT.md` | Mirror the same closed inventory and inert/one-approval production-state contract. |
| `tools/P0-readiness-gates.mjs` | Register the sole supplemental contract and its paired module; validate the canonical inventory separately from exact paired HEAD/worktree presence. |
| `tools/P0-stage0-ci.mjs` | Pin the increased readiness and staged-action fixture counts in the complete deterministic suite. |
| `tools/P0-staged-actions.mjs` | Close production lifecycle validation to the exact code-owned definition/module binding and zero-or-one exact approval states. |
| `tools/P0-test-execution-controls.mjs` | Prove 348 and 349 positives and fail closed on substitution, duplicates, unregistered paths, partial pairs, untracked paths, hash/mode/type drift, and malformed or byte-drifted contract data. |
| `tools/P0-test-staged-actions.mjs` | Prove the exact inert and Gate-B-published lifecycle identities and tuples, plus rejection of extra or mismatched production state. |
| `tools/P0-validate-execution-controls.mjs` | Inspect the physical and HEAD inventories, enforce exact paired bytes and modes, parse the contract safely when present, and require zero approvals while the module is absent. |

No workflow, approval registry, preparation record, task record, proposal artifact, projection, workbook, module, candidate-QA contract, output, journal, running log, or environment/dependency path belongs to the eight-target payload. The consume changes the integrity manifest only to apply the exact arm and clear it; that manifest is the ninth consume path, not a ninth repair target.

## Exact 348/349 inventory contract

The canonical generated proposal inventory remains exactly 58 tasks times six artifact kinds, or 348 paths. It cannot be reduced, substituted, or reclassified. The sole supplemental registration is exactly:

```json
{
  "taskId": "SPK-R0-001",
  "stageId": "P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION",
  "scopeClass": "local-synthetic",
  "actionClass": "synthetic-foundation",
  "purpose": "evidence",
  "path": "docs/work-items/SPK-R0-001/P0-SPK-R0-001-CANDIDATE-QA-CONTRACT.json",
  "sha256": "sha256:0467b716d1952b59fd07acf5337c6a105d44cfc926c104635829027751cdfb7f",
  "gitMode": "100644",
  "gitType": "blob",
  "pairedImplementationPath": "tools/spk-r0-001/P0-SPK-R0-001-synthetic-foundation.mjs",
  "pairedImplementationSha256": "sha256:e60d8e6398441a61812dd467ffcbdd292e01fb1198723e667e480d2cf453e47f",
  "pairedImplementationGitMode": "100644",
  "pairedImplementationGitType": "blob"
}
```

Only these two physical states are valid:

| State | Canonical work-item files | Supplemental contract files | Total work-item files | Paired module and contract |
| --- | ---: | ---: | ---: | --- |
| Before implementation candidate `I`, including after this repair | 348 | 0 | 348 | both absent at HEAD and in the worktree |
| At exact `I/IM` and accepted descendants before or after Gate B | 348 | 1 | 349 | both exact, tracked, and present at HEAD and in the worktree |

The 349th work-item file is candidate evidence, not a seventh generated proposal artifact. Generated tracking remains exactly 352 clean targets, and proposal artifact-state counts remain over the 348 canonical generated artifacts. No unregistered leaf, count-only substitution, missing canonical path, duplicate, symlink, untracked path, partial pair, HEAD/worktree disagreement, or mode, type, or byte drift is accepted. When present, the candidate-QA contract must also parse as duplicate-key-safe JSON object data. Its presence is not an executed-QA result, Gate-B decision, stage receipt, or permission source.

## Frozen implementation and evidence bindings

The repair binds but does not add these later `I` candidate bytes:

| Role | Path | Bytes | Raw SHA-256 | Prospective Git blob | Required mode/type |
| --- | --- | ---: | --- | --- | --- |
| implementation | `tools/spk-r0-001/P0-SPK-R0-001-synthetic-foundation.mjs` | `135119` | `e60d8e6398441a61812dd467ffcbdd292e01fb1198723e667e480d2cf453e47f` | `9f1885bd4a0d8b4b85fe759da56641ec7e25b356` | `100644` / `blob` |
| evidence contract | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-CANDIDATE-QA-CONTRACT.json` | `52147` | `0467b716d1952b59fd07acf5337c6a105d44cfc926c104635829027751cdfb7f` | `a445372f2b1c49d63607bd1d7a5e7ae05c23c00f` | `100644` / `blob` |

These hashes are raw-file digests; the listed Git blob IDs are the prospective IDs for exactly those bytes. Any change requires a fresh implementation/evidence review and corresponding validator repair rather than a manifest substitution. Neither path may enter the repair arm or consume.

## Closed production lifecycle contract

The production prefix is always exactly one accepted preparation, one code-owned definition, one serializable module-metadata binding, one code-owned outcome verifier, and zero callbacks. Only the approval/executable suffix may change:

| Repository state | Required lifecycle tuple | Activation state |
| --- | --- | --- |
| Repair `S/SM`, with module and contract absent | `1/1/1/1/0/0/0` | inert |
| Later exact `I/IM`, with module and contract present but Gate B unpublished | `1/1/1/1/0/0/0` | inert |
| Later exact Gate-B `S/SM` with one valid approval | `1/1/1/1/0/1/1` | gate-b-published |

The activation count is exactly the stage-approval count and may be only zero or one. Both `stageApprovalCount` and `executableStageCount` must equal it. The one-state record, if later published through its own reviewed ratchet, must be the sequence-one `execute` / `ready` approval for task `SPK-R0-001`, stage `P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION`, preparation review `P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION`, scope/action `local-synthetic` / `synthetic-foundation`, idempotency key `P0-IDEMP-SPK-R0-001-SYNTHETIC-001`, definition digest `sha256:fc172d2f8c1e5f9dccdf7a5c398fe0a2038591f7fb2903e54961879c73041983`, module ID `spk.synthetic`, module SHA-256 `sha256:e60d8e6398441a61812dd467ffcbdd292e01fb1198723e667e480d2cf453e47f`, and no predecessor. A second approval, a different identity, an absent module with an approval, any callback, or any other tuple fails closed.

The `1/1` suffix means only that a fresh exact-main guarded runtime evaluation may determine eligibility. It is not evidence that the stage was requested, invoked, completed, accepted, deployed, or released.

## Candidate-safe repair evidence

The exact eight frozen repair blobs have been independently ported onto the `dbab302694a28f40ef82146c88eb7068540711f1` endpoint without byte drift. Candidate-safe validation reports:

- syntax and whitespace/diff checks pass;
- readiness fixtures pass `433/433`;
- staged-action fixtures pass `269/269`;
- Stage 0 CI self-test passes `214/214`;
- generated tracking reports 352 clean targets;
- R1-R10 freeze verification reports 50 tasks, 300 artifacts, and zero execution allowed; and
- structural validation passes with the exact 348-file pre-`I` state.

This local payload evidence is not exact-head consume evidence and is not authority. A complete two-pass Stage 0 CI result is mandatory separately at exact `S` and exact `SM`; focused tests or a run at any other revision cannot substitute.

## Mandatory protected publication topology

The symbols below are topology roles, not commit IDs. Their hashes and trees are derived only after each immutable object exists.

1. **Initial dossier candidate `D`.** `D` is a single-parent direct child of exact `dbab302694a28f40ef82146c88eb7068540711f1`. It adds only this regular `100644` dossier. It changes no integrity manifest or repair target.
2. **Initial dossier merge `DM`.** Publish `D` through a normal required-check PR. `DM` has exactly ordered parents `[dbab302694a28f40ef82146c88eb7068540711f1,D]` and a tree exactly equal to `D`.
3. **Manifest-only arm `A`.** `A` is a single-parent direct child of exact `DM`. It changes only `docs/council/execution/P0-STAGE0-CONTROL-INTEGRITY.json`, preserves all 55 `current` entries byte-for-byte, and sets `next.changes` to exactly the eight code-point-sorted `modify` records in the frozen payload table. Each arm record binds the listed repair raw SHA-256, mode `100644`, and type `blob`. The eight targets remain byte-identical to their base side.
4. **Arm merge `AM`.** Publish `A` through a normal required-check PR. `AM` has exactly ordered parents `[DM,A]` and a tree exactly equal to `A`.
5. **Exact consume `S`.** `S` is a single-parent direct child of exact `AM`. It changes exactly nine paths: the eight armed targets to their exact repair bytes plus the integrity manifest. The manifest applies those eight replacements to `current`, retains cardinality 55, and clears `next` to null. No other path changes. From a clean exact `S`, the complete Stage 0 CI suite must pass two deterministic passes and bind the actual `S` revision, suite-definition digest, and result-manifest digest.
6. **Consume merge `SM`.** Publish `S` through a normal required-check PR. `SM` has exactly ordered parents `[AM,S]` and a tree exactly equal to `S`. From a clean exact `SM`, the complete Stage 0 CI suite must again pass two deterministic passes and bind the actual `SM` revision, suite-definition digest, and result-manifest digest.

A moved base, stale branch, extra parent, update-branch merge, squash, rebase, octopus merge, content-losing merge, direct-main push, force-push, admin merge, required-check removal, branch-protection change, or exception invalidates this sequence. If main moves away from the exact expected tip before any dependent step or merge, stop and abandon the affected branches; do not reparent, rebase, merge main into a branch, or rewrite a reviewed candidate. If `next` has already been armed, first publish a separately reviewed normal manifest-only cancellation that clears only `next`. Any restart then requires a fresh superseding dossier that rebinds the exact current base and every target byte through a wholly new topology. Cancellation grants no permission to consume.

## Distinct post-consume closure and successor review

This initial dossier predicts the repair contract; it cannot attest to future commits, check results, merge trees, or exact-main outcomes. It must never be rewritten or reused as post-consume closure evidence.

After exact `SM` and its complete post-merge evidence exist, publish a distinct closure dossier at:

```text
docs/council/execution/control-reviews/dossiers/P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR-CLOSURE.md
```

The closure role `D2` must be a single-parent direct child of exact `SM` and add only that new regular `100644` dossier. Its normal merge `D2M` must have exactly ordered parents `[SM,D2]` and tree exactly equal to `D2`. Only after exact `D2M` may a fresh record role `R` add exactly one regular `100644` successor record at:

```text
docs/council/execution/control-reviews/P0-CONTROL-REVIEW-P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR.json
```

The record must use review ID `P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR`, predecessor kind `review`, predecessor ID `P0-SPK-R0-001-RUNTIME-ACTIVATION-SEED`, the predecessor path and canonical record SHA-256 frozen above, and candidate `revision=D2`. Its candidate `baseRevision` is exactly the predecessor record-publication commit `c35eed4691413adf3442ed412535a56d55f39cd6`—not tree-equivalent merge `499059a2aabd8bac6aecf5d6ce96fa3ff27e35e4`, not recap merge `dbab302694a28f40ef82146c88eb7068540711f1`, not `SM`, and not `D2M`.

The record must independently derive the complete endpoint-tree diff from `c35eed4691413adf3442ed412535a56d55f39cd6` through exact `D2`. With no intervening drift, that interval has exactly 12 code-point-sorted safe records: the `RUNNING_LOG.md` endpoint modification containing the recap append; this initial-dossier addition; the eight repair-target modifications; the consumed integrity-manifest modification; and the distinct closure-dossier addition. Every non-null side is a regular `100644` blob. The actual `D`, `DM`, `A`, `AM`, `S`, `SM`, `D2`, `D2M`, final path hashes, changed-files digest, reviewer-registry digest, check evidence, review-context digest, attestations, `R`, and `RM` are derived only after their objects freeze and must not be guessed here.

`R` is a single-parent direct child of exact `D2M`, adds only the successor record, and binds `D2`, not `D2M`. Its normal merge `RM` has exactly ordered parents `[D2M,R]` and a tree exactly equal to `R`. At exact `RM`, the repository successor-review verifier must pass for `P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR` with zero findings. Five distinct current Product, Design, Architecture, Independent QA, and Project seats must bind the common exact candidate context, all required named checks, zero vetoes, and `approve-normal-merge-only`; Independent QA remains distinct from the implementer and evidence producer.

Only after this distinct closure and successor record are exact main—and after any separately required factual recap is normally published—may a later implementation candidate select a fresh exact current-main base. `I` must not retain `dbab302694a28f40ef82146c88eb7068540711f1`, `SM`, or `RM` as a permanently assumed base after main advances.

## Non-authority, freeze, and acceptance gate

This dossier, its eight-target repair, the arm, consume, closure, and successor record have these fixed effects:

- `taskApprovalCreated=false`;
- `runtimeAuthority=false`;
- `executionAllowed=false`;
- `privateActionAllowed=false`;
- `statusTransitionAllowed=false`; and
- `r1R10Effect=none`.

They authorize no task action, stage invocation, candidate QA, credential use, private host or provider contact, authentic memory or photo access, network or external mutation, GitHub issue/Project mutation, owner action, spend, backup, restore, rollback, delivery transition, acceptance, deployment, release, production claim, or task-status change. Deployment remains **Unknown — private read authority pending**. All 50 R1-R10 tasks and 300 artifacts remain frozen.

Hold publication unless all of the following are true:

1. `D` has exact parent `dbab302694a28f40ef82146c88eb7068540711f1`, adds only this dossier as regular `100644`, and passes dossier-scoped structural, public-safety, whitespace, and independent review;
2. all eight base and repair bytes, raw SHA-256 hashes, Git blob IDs, modes, types, paths, operations, and cardinalities exactly match the frozen table, with no target drift at `DM`;
3. the repair preserves the canonical 348-file baseline, accepts only the exact registered 349-file state with its exact paired module, rejects every partial or drifted state, and preserves generated tracking and proposal projections;
4. lifecycle validation accepts only exact tuples `1/1/1/1/0/0/0` and `1/1/1/1/0/1/1`, with approval/executable counts both equal to activation count zero or one and the one state bound to the exact sequence-one Gate-B identity;
5. `D/DM`, `A/AM`, and `S/SM` satisfy the exact single-parent, ordered-parent, tree-equality, sole-path, eight-arm, and nine-consume topology without an exception or intervening drift;
6. two complete deterministic Stage 0 passes succeed independently at clean exact `S` and clean exact `SM`, and focused or earlier results are not substituted;
7. the distinct `D2/D2M` closure and `R/RM` successor publications bind the full `c35eed4691413adf3442ed412535a56d55f39cd6..D2` interval and pass five-seat non-authorizing review with zero findings and zero vetoes;
8. exact post-consume and post-review main retain 348 work-item files before `I`, absent module and contract, lifecycle `1/1/1/1/0/0/0`, zero Ready, zero execution-allowed, and the exact 50-task/300-artifact R1-R10 freeze; and
9. the only permitted repair conclusion remains: **the exact validators can distinguish the 348-file pre-`I` state from the sole registered 349-file implementation state and can validate only the exact zero- or one-approval production lifecycle; no implementation, candidate QA, Gate B publication, invocation, private action, status transition, deployment, acceptance, release, production state, or R1-R10 effect exists.**
