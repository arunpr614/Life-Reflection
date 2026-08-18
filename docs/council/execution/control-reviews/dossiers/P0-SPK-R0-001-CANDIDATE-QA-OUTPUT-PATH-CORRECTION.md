# P0 SPK-R0-001 candidate-QA output-path correction dossier

- **Prepared:** 2026-08-18
- **Required dossier-candidate parent:** `dfe2f0f6f6229092acb85dabc603cd62ea2becb1`
- **Task:** `SPK-R0-001`
- **Correction review:** `P0-SPK-R0-001-CANDIDATE-QA-OUTPUT-PATH-CORRECTION`
- **Historical source dossier:** `docs/council/execution/control-reviews/dossiers/P0-SPK-R0-001-RUNTIME-ACTIVATION-SEED.md`
- **Corrected contract:** `docs/work-items/SPK-R0-001/P0-SPK-R0-001-CANDIDATE-QA-CONTRACT.json`
- **Required predecessor review:** `P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR`
- **Required predecessor-record publication:** `73c1b6bad0e2fac742da3f7bf8decf710116fc38`
- **Required predecessor canonical record SHA-256:** `c63736b6663f45b545ea91f303837e9ccb1553b9c012a368e9fbe1201b85c605`
- **Task-approval effect:** none
- **Runtime-authority effect:** none
- **Execution-permission effect:** none
- **Private, external, status, delivery, deployment, release, production, or R1-R10 effect:** none

## Purpose and authority boundary

This additive public/local dossier corrects exactly one historical filename conflict before a fresh `SPK-R0-001` implementation candidate may be selected. The published inert runtime-activation seed names the third post-implementation candidate-QA artifact `P0-SPK-R0-001-INDEPENDENT-QA-ATTESTATION.json`. The exact frozen candidate-QA contract names that third artifact `P0-SPK-R0-001-CANDIDATE-QA-INDEPENDENT-QA-ATTESTATION.json`, closes the output set at exactly three files, and sets `additionalFilesAllowed=false`. Both names therefore cannot be emitted, treated as equivalent, or bridged by an alias.

This dossier supersedes only the historical seed dossier's third exact output filename. It preserves the first two filenames and every other seed clause, byte commitment, lifecycle boundary, safety rule, review requirement, and non-authorizing effect. The historical dossier remains immutable evidence and is not edited. Any later reader applying the seed must read its three-path clause with the single substitution frozen here; no broader amendment or inference is permitted.

This correction is not an implementation candidate, candidate-QA run, Independent-QA attestation, Gate B review, stage approval, stage receipt, invocation request, owner-action record, delivery transition, status transition, deployment, release, or production evidence. It authorizes no process launch, module import, private or authentic-content access, provider contact, external mutation, credential use, spend, backup, restore, rollback, GitHub issue or Project mutation, or R1-R10 action.

The symbols `D`, `DM`, `R`, `RM`, `I'`, and `I'M` below are topology roles, not unresolved commit placeholders. Candidate-derived commits, trees, blobs, and digests are derived only after their immutable objects exist and must not be guessed or self-embedded in this dossier.

## Exact historical source and conflict

The source dossier was added as regular `100644` blob by candidate `2b34fa93c3fb7d28cf0ae7ea886e1f1028900312`, whose sole parent is `b90e7c8f6721b6e25436a04a56b04f58fe8b86d3`. Normal merge `a9272e98ad8416627c3286e8a6f45ff219c3d4ea` has ordered parents `[b90e7c8f6721b6e25436a04a56b04f58fe8b86d3,2b34fa93c3fb7d28cf0ae7ea886e1f1028900312]` and tree `aa1a245b296252940c277bed909bc4a11c10312f`, exactly equal to the source candidate tree.

The immutable historical source dossier is exactly:

| Property | Exact value |
| --- | --- |
| Path | `docs/council/execution/control-reviews/dossiers/P0-SPK-R0-001-RUNTIME-ACTIVATION-SEED.md` |
| Git mode and type | `100644 blob` |
| Byte length | `43470` |
| Line count | `354` |
| Raw SHA-256 | `4c39f01849727c48eba9175277fe682c204495b400927c7ec6a94b457db3dcae` |
| Git blob | `9a2cf16893140a6c7019834e9328124f55aa85f9` |

Its post-`IM` path block preserves the correct directory template and first two filenames but gives the third filename without the `CANDIDATE-QA-` segment:

```text
outputs/P0-SPK-R0-001-CANDIDATE-QA-<I12>/P0-SPK-R0-001-CANDIDATE-QA-RECEIPT.json
outputs/P0-SPK-R0-001-CANDIDATE-QA-<I12>/P0-SPK-R0-001-CANDIDATE-QA-EVIDENCE-INDEX.json
outputs/P0-SPK-R0-001-CANDIDATE-QA-<I12>/P0-SPK-R0-001-INDEPENDENT-QA-ATTESTATION.json
```

The exact frozen candidate-QA contract instead sets `requiredCardinality.outputFileCount=3`; its `outputPathRule.exactFileNames` contains the following three names in order and sets `additionalFilesAllowed=false`:

```text
P0-SPK-R0-001-CANDIDATE-QA-RECEIPT.json
P0-SPK-R0-001-CANDIDATE-QA-EVIDENCE-INDEX.json
P0-SPK-R0-001-CANDIDATE-QA-INDEPENDENT-QA-ATTESTATION.json
```

The first two names are identical across the two sources. The third name is not. Exact string equality, exact file cardinality, and the closed output-set rule make this a binding conflict rather than a cosmetic naming difference.

## Corrected closed output set

For every later `SPK-R0-001` candidate-QA bundle governed by these exact frozen inputs, the output directory is exactly:

```text
outputs/P0-SPK-R0-001-CANDIDATE-QA-<I12>
```

`I12` is the first 12 lowercase hexadecimal characters of the later exact implementation candidate revision. The directory contains exactly these three regular files, once each and in no other location offered as part of the bundle:

```text
P0-SPK-R0-001-CANDIDATE-QA-RECEIPT.json
P0-SPK-R0-001-CANDIDATE-QA-EVIDENCE-INDEX.json
P0-SPK-R0-001-CANDIDATE-QA-INDEPENDENT-QA-ATTESTATION.json
```

The closed-set interpretation is exact:

| Rule | Required value |
| --- | --- |
| Exact output-file count | `3` |
| First receipt filename preserved | `true` |
| Second evidence-index filename preserved | `true` |
| Corrected third filename required exactly once | `true` |
| Additional files allowed | `false` |
| Alternate filenames or aliases allowed | `false` |
| Duplicate outputs allowed | `false` |
| Extra copies allowed | `false` |
| Compatibility or fallback filenames allowed | `false` |
| Symlinks or other filesystem aliases allowed | `false` |
| Absolute output paths allowed | `false` |
| Historical third filename allowed | `false` |

`P0-SPK-R0-001-INDEPENDENT-QA-ATTESTATION.json` is therefore superseded and prohibited as an output filename. It may not be emitted as an alias, duplicate, copy, fallback, compatibility name, symlink target or link name, hard-link name, fourth artifact, secondary-directory artifact, or substitute for the corrected third file. Absence of the corrected filename, presence of the historical filename, any fourth output, or any duplicate or alternate representation forces Hold.

The three retained files remain regular `100644` UTF-8 strict JSON blobs with no duplicate keys and exactly one terminal LF, as frozen by the candidate-QA contract. This dossier changes no receipt, evidence-index, or attestation schema; no binding, participant, result, safety, limitation, digest, canonicalization, or permitted-claim rule changes.

## Frozen implementation inputs remain byte-identical and inert

The correction changes neither member of the later implementation pair. Their exact frozen identities are:

| Purpose | Path | Bytes | Raw SHA-256 | Git blob |
| --- | --- | ---: | --- | --- |
| Candidate-QA contract | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-CANDIDATE-QA-CONTRACT.json` | `52147` | `0467b716d1952b59fd07acf5337c6a105d44cfc926c104635829027751cdfb7f` | `a445372f2b1c49d63607bd1d7a5e7ae05c23c00f` |
| Synthetic foundation module | `tools/spk-r0-001/P0-SPK-R0-001-synthetic-foundation.mjs` | `135119` | `e60d8e6398441a61812dd467ffcbdd292e01fb1198723e667e480d2cf453e47f` | `9f1885bd4a0d8b4b85fe759da56641ec7e25b356` |

Both are regular `100644` blobs. They are absent from exact current main. They appeared together in local commit `2c766088f74e0d0b2ce05f83bf5afce6735688a5`, whose sole parent is `5f869eaaf2a86752817f9bd2d9ba9440f103b679` and whose tree is `b85325d28bab982a30a167bb6f11f5bd6141e53d`. The exact trusted recap records that commit as unpublished, **HOLD / abandoned**, with no upstream or repository publication. It must not be pushed, amended, rebased, merged, or reused; none of its revision-derived `I12` or evidence is valid. Only the two exact blobs above may be reused byte-for-byte in a fresh later `I'` after this correction sequence and the required later recap complete.

The mechanical exact-head Stage 0 result previously recorded for `2c766088...` is not candidate QA, Independent QA, Gate B review, module execution, or runtime evidence and cannot cure the filename conflict. During exact-`2c766088...` preparation and Stage 0 CI the module was not imported or run. This dossier neither re-executes nor newly validates the module.

## Exact L1 recap boundary and current inert state

The required pre-correction recap was published as candidate `c13645ddd2f0a22b620783526b8411491fec03c6`, a single-parent child of `5f869eaaf2a86752817f9bd2d9ba9440f103b679`. It modifies only regular `100644` `RUNNING_LOG.md`. Normal merge `dfe2f0f6f6229092acb85dabc603cd62ea2becb1` has ordered parents `[5f869eaaf2a86752817f9bd2d9ba9440f103b679,c13645ddd2f0a22b620783526b8411491fec03c6]` and tree `650728e5049c41919513982f10a2d2b27debcbbe`, exactly equal to the recap candidate tree.

At exact `dfe2f0f6f6229092acb85dabc603cd62ea2becb1`:

- `RUNNING_LOG.md` is 161154 bytes, raw SHA-256 `100068729d5a386b571f42a2024efe47af01b4a69cad9077d975683da0bbe4c8`, Git blob `b6bd957b9b9acdff0fbb6a2d3ec10e79897920d5`, and contains the append-only hold/correction plan;
- the integrity manifest remains regular `100644`, raw SHA-256 `0eaddfd36358b296ab45676e7b6283c2cf4ea2abaf2a1e1fa8fde7e04f576943`, Git blob `b803a8f4237047ed7caa5c905c710a3a08583998`, with 55 `current` records and `next:null`;
- the stage-approval registry remains regular `100644`, raw SHA-256 `e64a24b863816027930e0926be7e7e58216d638c661b82c8774c0c6dfd4647b7`, Git blob `ebd859282a38db95b2858ca1715fa0051bed034e`, with one accepted Gate A preparation and zero Gate B stage approvals;
- the candidate-QA contract and synthetic module paths are absent;
- the lifecycle tuple remains exactly `1/1/1/1/0/0/0` in preparation/definition/module-metadata/outcome-verifier/callback/stage-approval/executable order;
- the canonical generated work-item inventory remains exactly 348 files across 58 tasks, with 336 Draft, 12 In-review, zero Ready, zero execution-allowed, and all 58 tasks Incomplete; and
- all 50 R1-R10 tasks and 300 R1-R10 artifacts remain frozen with zero execution allowed.

No executable R0 stage, candidate-QA bundle, Independent-QA result, Gate B authority, governed task-stage receipt, private or authentic-content access, external mutation, deployment, acceptance, release, production state, or task-status effect exists.

## Predecessor review and aggregate endpoint

The predecessor record is `docs/council/execution/control-reviews/P0-CONTROL-REVIEW-P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR.json`. It was added alone as regular `100644` by publication candidate `73c1b6bad0e2fac742da3f7bf8decf710116fc38`, whose sole parent is `4cb4bd8bd4830f4451778f070d6e437fbc6be645`. The record is 16017 bytes, raw SHA-256 `60b21243320802e119a994e65a550ec141f50a9701958451de38cf30eb011e4a`, Git blob `3162d6c861a3212ecb911ce478e1df4f3dc623d4`, and canonical record SHA-256 `c63736b6663f45b545ea91f303837e9ccb1553b9c012a368e9fbe1201b85c605`.

Normal predecessor merge `5f869eaaf2a86752817f9bd2d9ba9440f103b679` has ordered parents `[4cb4bd8bd4830f4451778f070d6e437fbc6be645,73c1b6bad0e2fac742da3f7bf8decf710116fc38]` and tree `0f93a7d2f8e953374f65e172552f6cd86a5cec06`, exactly equal to the predecessor candidate tree. The correction successor record must use predecessor kind `review`, predecessor ID `P0-SPK-R0-001-PRE-I-VALIDATOR-REPAIR`, the record path above, and canonical digest `c63736b...`; neither the raw file digest nor tree-equivalent merge `5f869ea...` substitutes for those predecessor fields.

The exact endpoint diff from aggregate base `73c1b6bad0e2fac742da3f7bf8decf710116fc38` to required dossier parent `dfe2f0f6f6229092acb85dabc603cd62ea2becb1` contains exactly one code-point-sorted record:

| Change | Path | Base raw SHA-256 | Required-parent raw SHA-256 | Base/candidate mode and type |
| --- | --- | --- | --- | --- |
| `modify` | `RUNNING_LOG.md` | `22ab3008fd3be9a7283ff3cfcc82eea619215e8e85d7e478db1d0ca4c97a1533` | `100068729d5a386b571f42a2024efe47af01b4a69cad9077d975683da0bbe4c8` | `100644 blob` / `100644 blob` |

The canonical changed-files SHA-256 of exactly that one-record parent interval is `96af9c307be78d735a727f9913d92155c2728937bb4f0d9879eab089e2856eb9`.

Candidate `D` adds this dossier as the second aggregate record with a null base side and a regular `100644` candidate blob. Because embedding this dossier's own final raw hash would be circular, this dossier does not predict `D`, its tree, its blob, its raw SHA-256, or the final two-record `changedFilesSha256`. Only after the dossier bytes and `D` freeze may the successor record independently derive the complete `73c1b6b...D` endpoint, bind both records' exact modes, types, and raw hashes, and compute the final two-record digest. The one-record digest above is an interval checkpoint, not the successor record's final aggregate digest.

The reviewer registry at the required parent is regular `100644`, raw SHA-256 `71c3eaf517da4bec7048fa53617410160032def15ded247bdfbfd11dcb83a30e`, and Git blob `11d6cee42303051e003f72134091202192cc4e6f`. It must be recomputed at exact `D`; copied or semantic-only equality is not sufficient.

## Required successor review

After `D` is normally merged, the add-only successor record path is:

```text
docs/council/execution/control-reviews/P0-CONTROL-REVIEW-P0-SPK-R0-001-CANDIDATE-QA-OUTPUT-PATH-CORRECTION.json
```

The record must use review ID `P0-SPK-R0-001-CANDIDATE-QA-OUTPUT-PATH-CORRECTION`, `candidate.baseRevision=73c1b6bad0e2fac742da3f7bf8decf710116fc38`, and `candidate.revision=D`. It must bind the exact correction-dossier digest, candidate reviewer-registry bytes, complete two-record aggregate and digest, contributors, five same-head passing named checks, one common review context, five distinct active-seat attestations, zero vetoes, and the fixed non-authorizing conclusion.

Contributor arrays remain exactly implementer `codex-primary-integrator-01` and evidence producer `codex-evidence-producer-01`. Named checks remain exactly these code-point-sorted passing entries:

1. `P0-CHECK-ADVERSARIAL`
2. `P0-CHECK-FROZEN-SCOPE`
3. `P0-CHECK-GITHUB-CI`
4. `P0-CHECK-INDEPENDENT-QA`
5. `P0-CHECK-LOCAL-CI`

The five distinct active seats remain Product `codex-product-manager-01`, Design `codex-ui-ux-designer-01`, Architecture `codex-technical-architect-01`, Independent QA `codex-independent-qa-01`, and Project `codex-project-manager-01`. Every seat must review exact `D`, bind the same final review context, supply its own evidence reference, digest, rationale, and attestation digest, and return only `approve-normal-merge-only`. Independent QA remains distinct from every other seat and absent from both contributor arrays. All candidate-specific check, context, and attestation values remain unfrozen until exact `D` and its terminal evidence exist.

The record's fixed authority fields are `taskApprovalCreated=false`, `runtimeAuthority=false`, `executionAllowed=false`, `privateActionAllowed=false`, `statusTransitionAllowed=false`, `r1R10Effect=none`, `unresolvedVetoes=[]`, and `disposition=accepted-normal-merge-only`.

The only permitted successor-review claim is:

> Accepted only for normal publication of the exact public/local control candidate; this review is non-authorizing and creates no task approval, execution permission, private access, R0 action, deployment, acceptance, status transition, or R1-R10 effect.

## Mandatory normal publication topology

1. **Correction dossier candidate `D`.** `D` is a single-parent direct child of exact `dfe2f0f6f6229092acb85dabc603cd62ea2becb1`. It adds only this dossier as a regular `100644` file. It does not edit the historical seed, running log, integrity manifest, reviewer or stage registry, candidate-QA contract, module, proposal, task, workflow, output, or any other path.
2. **Correction dossier merge `DM`.** Publish `D` through a normal required-check PR. `DM` has exactly ordered parents `[dfe2f0f6f6229092acb85dabc603cd62ea2becb1,D]` and a tree exactly equal to `D`.
3. **Successor record candidate `R`.** Only after exact `DM`, `R` is a fresh single-parent direct child of `DM`. It adds only the successor record path above as a regular `100644` file; that path was absent at `D`; and the record binds `D`, not `DM`.
4. **Successor record merge `RM`.** Publish `R` through a second normal required-check PR. `RM` has exactly ordered parents `[DM,R]` and a tree exactly equal to `R`. At exact `RM`, the immutable successor-review verifier must pass for `P0-SPK-R0-001-CANDIDATE-QA-OUTPUT-PATH-CORRECTION` with zero findings.

No running-log recap or other path may interleave between `dfe2f0f...` and `D`, between `DM` and `R`, or before `RM`. After exact `RM`, a separately reviewed and normally merged `L2` running-log recap must close this correction sequence before any fresh ordinary implementation candidate `I'` is selected. Only after exact `L2` merge may `I'` directly parent freshly selected exact main and add exactly the frozen contract and module blobs above; its normal merge `I'M` must preserve the exact candidate tree.

No direct-main push, force-push, history rewrite, amend, rebase, squash, update-branch merge, octopus merge, admin merge, required-check removal, branch-protection change, or exception is permitted. A moved base, extra path, wrong parent order, wrong tree, failed check, unresolved veto, stale reviewer registry, changed frozen blob, or non-normal merge invalidates the affected candidate. Stop and rebuild from freshly selected exact main rather than rewriting a reviewed object.

## Correction acceptance gate

Hold publication unless all of the following are true:

1. `D` directly parents freshly verified exact `dfe2f0f6f6229092acb85dabc603cd62ea2becb1`, adds only this regular `100644` dossier, and leaves the source dossier and every protected file byte-identical;
2. the source dossier's 43470-byte raw hash and Git blob, its historical three-path text, and the exact one-filename conflict are independently reproduced;
3. the corrected set is exactly the preserved receipt name, preserved evidence-index name, and corrected `P0-SPK-R0-001-CANDIDATE-QA-INDEPENDENT-QA-ATTESTATION.json`, with exactly three outputs and no old-name alias, duplicate, copy, fallback, link, fourth file, absolute path, or substitute;
4. the candidate-QA contract and module remain absent from `D`, and their exact frozen `100644` byte lengths, raw SHA-256 values, and Git blobs remain unchanged for later `I'` reuse;
5. `2c766088...` remains unpublished, held, and abandoned, and none of its commit, tree, `I12`, or revision-derived evidence is reused;
6. exact `D` still has the 55-entry `next:null` integrity manifest, one accepted preparation, zero stage approvals, lifecycle `1/1/1/1/0/0/0`, 348 generated artifacts, 58 Incomplete tasks, zero Ready and execution-allowed tasks, and the complete 50-task/300-artifact R1-R10 freeze;
7. the predecessor publication commit, canonical predecessor digest, exact one-record parent interval, final two-record aggregate, dossier bytes, reviewer registry, contributors, five named checks, common review context, five distinct seat attestations, zero vetoes, and all canonical digests independently verify without circular prediction;
8. public-text safety, whitespace, immutable-history, frozen-scope, exact-head required checks, and normal-merge protection pass without exception;
9. `D`, `DM`, `R`, and `RM` follow exactly the two-PR topology above with no interleaving path or moved main, and exact `RM` reports zero successor-review findings; and
10. the only effect remains the single exact third-filename supersession, with no task approval, runtime authority, execution, private access, external mutation, status or delivery transition, deployment, acceptance, release, production claim, or R1-R10 effect.
