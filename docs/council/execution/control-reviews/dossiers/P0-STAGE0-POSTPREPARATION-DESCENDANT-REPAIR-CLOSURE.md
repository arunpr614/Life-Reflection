# P0 Stage 0 post-preparation descendant-repair closure dossier

- **Prepared:** 2026-08-17
- **Existing control task:** `PC-001`
- **Required candidate parent:** `2ed36b1a6bd298747d6c7ce8d29b16ea86d92fcf`
- **Aggregate review base:** `5de18606d04b05ea8eab537dd31a3e020030594e`
- **Prior review:** `P0-STAGE0-FINAL-FE33A449`
- **Prior review record:** `docs/council/execution/control-reviews/P0-CONTROL-REVIEW-P0-STAGE0-FINAL-FE33A449.json`
- **Prior canonical record SHA-256:** `d2093caa2e93b3951c2faf3c1ede7bf7ec7e82523283e05cf1ee22ff87d114e4`
- **Candidate revision:** assigned only after this dossier is committed as the sole candidate-path addition
- **Candidate authority:** five-seat review may accept only normal publication of the exact public/local control closure candidate
- **Runtime authority:** none
- **Task-approval effect:** none
- **Execution-permission effect:** none

## Purpose and boundary

This dossier closes the control, proposal, projection, preparation, and post-preparation repair history published after the first successor-review record. The prior review record was added at `5de18606d04b05ea8eab537dd31a3e020030594e`; its normal PR #71 merge, `b9df7479add1017160ffe29144a7411e18f234c1`, has the same tree `5bab88b0c2ceb1d08ec68509cf222c1e476c5e54`. The aggregate review therefore begins at the verifier's actual prior record-publication revision while excluding the already reviewed record itself.

The required candidate is a single-parent direct child of exact live main `2ed36b1a6bd298747d6c7ce8d29b16ea86d92fcf` and adds only this dossier. Its commit revision, raw dossier SHA-256, reviewer-registry SHA-256, complete changed-file objects, check evidence, review-context digest, and seat attestations do not exist yet and must not be guessed or embedded here. They are derived only after the candidate commit freezes.

This is closure evidence, not an implementation/evidence candidate for `SPK-R0-001`. No runtime seed, production definition, module binding, outcome verifier, stage approval, owner-action evidence, private authority, delivery transition, task status, or external mutation is included.

## Publication history covered

The closure context comprises the reviewed first-parent merges plus these held alternatives:

1. **PRs #72-#73 — Index/Wiki provenance ratchet.** PR #72 armed the exact protected Index correction and merged as `f99182811d2e3ec49e92f7ac5cf91a14b4125dbd`; PR #73 consumed it and merged as `6b8b70b72148241a22afc97f517c6bf180610893`.
2. **PRs #74-#79 — Gate A replay repair.** PR #74 was closed without merge. PR #75 published the factual Stage 0 closure/Gate A entry hold as `9eb923475421fe566a8d24d89fe09c42f26d2158`. PR #76 armed the replay repair, PR #77 normally cancelled the held arm, PR #78 re-armed the corrected hashes, and PR #79 normally consumed them as `338014c129ac2d64317aeb31ec6017ba3473ec36`.
3. **PRs #80-#84 — proposal-projection controls and recap.** PRs #80-#81 armed and consumed the proposal-projection topology repair. PRs #82-#83 armed and normally consumed the phase-aware projection-count repair, preserving the then-current 342 Draft / 6 In-review state while making a later complete six-artifact proposal packet's 336 Draft / 12 In-review state valid, ending at `8f9f4bac91d681d28a5d224d786364bfc0dc0b8b`. PR #84 published the one-path factual recap as `15b5e566eafd65add681f2fc3c36b7016f59360a`.
4. **PRs #85-#89 — proposal and preparation-publication topology.** PR #85 published an SPK proposal, but draft PR #86 was held and not merged when the base-owned guard exposed the registry-publication topology defect. PRs #87-#88 armed and consumed the five-path topology repair. A fresh six-artifact C1 plus three-projection C2 was then published normally by PR #89 as `6e724bfb51eff076d5762e584eedd09ede0aa09f`.
5. **PRs #90-#91 — accepted Gate A preparation ratchet.** PR #90 merged the manifest-only arm as `4c67ccf4e720f729855a5564fb614e1e38155b02`. PR #91 consumed exactly the stage-approval registry plus integrity manifest as `556dad91f80076ceecffce06e4d7d0f7b5fdef7d`. The accepted record returned `preparationAllowed=true`, `executionAllowed=false`, and retained local/public/fictional/synthetic bounds; the registry contained one preparation review and zero stage approvals.
6. **PR #92 — one authorized bootstrap exception, not precedent.** The old exact-head verifier could not validate its own manifest-only repair arm after the first nonempty preparation record. The Product Owner authorized one exception for exact arm head `b85bff5108948eb5fc9f597def2750aa8735be3b`. The immutable base-owned guard passed. Only the exact-head required context was temporarily removed; strict mode, admin enforcement, conversation resolution, and force/delete protections remained. PR #92 merged normally, without direct `main` push, force-push, or admin merge, as `8688a193bb3c5e03ff6988090d6f48629a918378`. Both required contexts were restored before the consume branch was pushed. This exception is exhausted and supplies no reusable bypass authority.
7. **PR #93 — normal protected consume.** Exact head `0bda74a05befc72b2fc33c5d7f325eb30db37271` changed the seven armed protected targets plus the integrity manifest, all as regular `100644` blobs. Both normal required checks passed under restored protection. The normal merge `7ceecf403a0ac9efda899725e80cfb5eea16830a` has parents `[8688a193bb3c5e03ff6988090d6f48629a918378, 0bda74a05befc72b2fc33c5d7f325eb30db37271]` and the reviewed head tree. The consumed manifest has 55 current entries, `next:null`, and raw SHA-256 `d24c4c12244292a093b4f30b85b7436c8d2a5f293beeb6a5c2236274ebcd601d`.
8. **PR #94 — append-only factual recap.** Recap head `d5fe6623e79e50fd234a430ecb4689161eff6873` added only the trusted running-log event. The base-owned guard and exact-head suite both passed, and PR #94 merged normally as current main `2ed36b1a6bd298747d6c7ce8d29b16ea86d92fcf`.

## Aggregate candidate changed-file derivation

At dossier preparation, the exact net diff from review base `5de18606d04b05ea8eab537dd31a3e020030594e` to required parent `2ed36b1a6bd298747d6c7ce8d29b16ea86d92fcf` contains 25 unique modifications. `deriveSuccessorChangedFiles` reports all 25 as regular `100644` blob-to-blob modifications and gives the pre-dossier canonical changed-files SHA-256 `039a3231703127815cacc02cb6dacf2c805f5492d0ad6b74bc04455a18837128`.

The frozen candidate must derive its review manifest from the aggregate review base to the candidate revision, not from the candidate's direct parent. The complete expected path and raw-diff shape is:

| Change | Mode | Path |
| --- | --- | --- |
| `M` | `100644 -> 100644` | `RUNNING_LOG.md` |
| `M` | `100644 -> 100644` | `docs/INDEX.md` |
| `M` | `100644 -> 100644` | `docs/council/execution/P0-PHASE1-EXECUTION-COUNCIL-CHARTER.md` |
| `M` | `100644 -> 100644` | `docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md` |
| `M` | `100644 -> 100644` | `docs/council/execution/P0-R0-STAGE-APPROVAL-REGISTRY.json` |
| `M` | `100644 -> 100644` | `docs/council/execution/P0-STAGE0-CONTROL-INTEGRITY.json` |
| `A` | `000000 -> 100644` | `docs/council/execution/control-reviews/dossiers/P0-STAGE0-POSTPREPARATION-DESCENDANT-REPAIR-CLOSURE.md` |
| `M` | `100644 -> 100644` | `docs/council/execution/releases/P0-P0-R0-STAGE0-STATE-CONTRACT.md` |
| `M` | `100644 -> 100644` | `docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json` |
| `M` | `100644 -> 100644` | `docs/project/PHASE1-GITHUB-PROJECT-SYNC.md` |
| `M` | `100644 -> 100644` | `docs/project/PHASE1-ROADMAP-MANIFEST.json` |
| `M` | `100644 -> 100644` | `docs/project/PROJECT-TRACKER.md` |
| `M` | `100644 -> 100644` | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-COUNCIL-READINESS.md` |
| `M` | `100644 -> 100644` | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-DELIVERY-CHECKLIST.md` |
| `M` | `100644 -> 100644` | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-DESIGN-SPEC.md` |
| `M` | `100644 -> 100644` | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-PRD.md` |
| `M` | `100644 -> 100644` | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-QA-PLAN.md` |
| `M` | `100644 -> 100644` | `docs/work-items/SPK-R0-001/P0-SPK-R0-001-TECHNICAL-PLAN.md` |
| `M` | `100644 -> 100644` | `outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx` |
| `M` | `100644 -> 100644` | `tools/P0-readiness-gates.mjs` |
| `M` | `100644 -> 100644` | `tools/P0-stage0-ci.mjs` |
| `M` | `100644 -> 100644` | `tools/P0-staged-actions.mjs` |
| `M` | `100644 -> 100644` | `tools/P0-test-execution-controls.mjs` |
| `M` | `100644 -> 100644` | `tools/P0-test-staged-actions.mjs` |
| `M` | `100644 -> 100644` | `tools/P0-validate-execution-controls.mjs` |
| `M` | `100644 -> 100644` | `tools/P0-verify-execution-start.mjs` |

After the dossier-only candidate commit exists, the successor record must independently execute the equivalent of:

```sh
git diff --raw --no-abbrev --no-ext-diff --no-renames -z \
  5de18606d04b05ea8eab537dd31a3e020030594e \
  "$candidate_revision" --
```

It must obtain exactly 26 unique records: the 25 listed `M 100644 -> 100644` records plus this one `A 000000 -> 100644` dossier record. It must bind every base/candidate raw-byte SHA-256, Git mode, and Git type; recompute the post-commit `changedFilesSha256`; bind this dossier's candidate bytes as `dossierSha256`; and reject any extra path, omission, deletion, rename, type change, mode change, unsafe content, or non-`P0-` added basename.

## Verified control evidence

The terminal PR #93 evidence recorded these exact local results at consume head `0bda74a05befc72b2fc33c5d7f325eb30db37271`:

- staged-action fixtures: 245 cases;
- exact-start fixtures: 85 cases;
- readiness controls: 403 passed and zero failed;
- Stage 0 CI self-test: 214 cases;
- generated tracking: 352 tracked clean targets;
- structural validation: 78 requirements, 58 tasks, 348 artifacts, zero Ready, and zero execution-allowed;
- clean full Stage 0 suite: two deterministic passes with suite digest `sha256:4dc3d525b9404b5bcd068fb22deb73fd7fa9cd1647155a561f32e49fe705390f`.

PR #93's immutable base-owned guard and exact-head P0/R0 control-suite checks both concluded `SUCCESS`. Post-merge exact-main run `31993826735` passed two deterministic passes with result digest `sha256:2c4939ae11f15c31c84c5af38644bbea183f9496ae53aaea2cb202ea851e79a7`. PR #94's base-owned guard and exact-head suite also concluded `SUCCESS` for recap head `d5fe6623e79e50fd234a430ecb4689161eff6873` before the normal merge to `2ed36b1a6bd298747d6c7ce8d29b16ea86d92fcf`.

These are control and publication results only. They do not prove product behavior, private-host qualification, deployment, restore, rollback, acceptance, release, or production readiness.

## Successor-review and publication topology

The later record must use:

- predecessor kind `review`, ID `P0-STAGE0-FINAL-FE33A449`, the prior record path above, and canonical record SHA-256 `d2093caa2e93b3951c2faf3c1ede7bf7ec7e82523283e05cf1ee22ff87d114e4`;
- candidate `baseRevision=5de18606d04b05ea8eab537dd31a3e020030594e` and `revision=<this dossier-only candidate commit>`;
- the exact candidate reviewer-registry bytes and registered implementation/evidence-producer identities;
- the derived 26-record changed-file manifest and this dossier's derived candidate digest;
- passing named checks and five distinct active Product, Design, Architecture, QA, and Project seat attestations, with QA independent of the implementer and evidence producer;
- zero unresolved vetoes and only the fixed non-authorizing successor-review claim.

The candidate commit must first merge normally with parents `[2ed36b1a6bd298747d6c7ce8d29b16ea86d92fcf, candidate]` and a tree exactly equal to the candidate. Only afterward may a fresh branch from that merge add exactly one record at `docs/council/execution/control-reviews/P0-CONTROL-REVIEW-P0-STAGE0-POSTPREPARATION-DESCENDANT-REPAIR.json`. The record commit must be single-parent, must add only that regular `100644` file, and must have the reviewed dossier candidate as an ancestor of its parent. Its own normal merge must retain the record commit's exact tree.

Both this nested dossier path and the later nested record path are outside the base-owned guard's direct protected-addition namespaces. They therefore require normal required-check PRs with the integrity manifest unchanged; no manifest arm, required-check removal, protection change, direct `main` push, force-push, history rewrite, or admin merge is authorized.

## Non-authority and current truth

This dossier and any accepted successor record have these fixed effects:

- `taskApprovalCreated=false`;
- `runtimeAuthority=false`;
- `executionAllowed=false`;
- `privateActionAllowed=false`;
- `statusTransitionAllowed=false`;
- `r1R10Effect=none`.

The current registry has one accepted preparation review and zero stage approvals. The accepted Gate A result permits only preparation of the named local/public/fictional/synthetic candidate. All 58 tasks remain Incomplete; 45 remain Hold and 13 Historical non-authorizing; zero are Ready and zero are execution-allowed. All 50 R1-R10 tasks and 300 artifacts remain frozen. Production action, module, callback, and outcome-verifier maps remain empty, delivery apply remains disabled, and deployment remains **Unknown — private read authority pending**.

Nothing in this closure authorizes an R0 stage invocation, private system or credential use, authentic content, issue/Project mutation, provider or spend decision, deployment, restore, rollback, acceptance, release, or production claim. Runtime activation and the later `SPK-R0-001` implementation/evidence candidate remain separate future candidates subject to their own exact protected ratchet, successor review where applicable, Gate B record, required checks, and exact-main runtime decision.

## Closure acceptance

Hold this candidate unless all of the following are true:

1. its sole parent is exact `2ed36b1a6bd298747d6c7ce8d29b16ea86d92fcf` and its sole diff is this added regular `100644` dossier;
2. the aggregate `5de18606d04b05ea8eab537dd31a3e020030594e..candidate` raw diff is exactly the 26-record set and safe shape above;
3. the prior record, reviewer registry, dossier bytes, candidate ancestry, named checks, five seats, review context, and all canonical digests independently verify;
4. public-text safety, whitespace, exact-head required checks, immutable-history checks, and frozen-scope checks pass without exception;
5. the candidate and later record publish only through the two normal PRs described above; and
6. the permitted conclusion remains limited to: accepted only for normal publication of the exact public/local control closure candidate, with no task approval, execution permission, private access, R0 action, deployment, acceptance, status transition, or R1-R10 effect.
