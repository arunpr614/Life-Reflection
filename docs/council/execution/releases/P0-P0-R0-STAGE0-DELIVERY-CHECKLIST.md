# P0/R0 Stage 0 delivery checklist

## Candidate source

- [ ] The final reviewed head preserves this normal first-parent lineage: activation main `2dc4d05cdeca8cb9aeacf393076f6c6f946ff62b`, freeze commit `2dce300376165b78787e232a73713d228f2722fe`, draft-evidence commit `43c5ccb772bd5e4cabc52d73aa40c35ed999dbb7`, Stage 0 implementation commit `0533b6b3904b8c96325ff90b5c363228d0b3d4b9`, then only narrow normal corrective commit(s). No merge, unrelated commit, amend, rebase, history rewrite, or force-push intervenes.
- [ ] The complete activation-base-to-final-head changed-path manifest contains only the reviewed Stage 0 surface; every path is a regular Git blob with exact mode/type/hash. The first successor control review binds the full `2dc4d05cdeca8cb9aeacf393076f6c6f946ff62b..finalHead` set and rejects a parent-only `43c5ccb772bd5e4cabc52d73aa40c35ed999dbb7..finalHead` subset.
- [ ] No product/prototype/private/R1-R10 task artifact or semantic field changed.
- [ ] Historical `controlReviews.PC-001` and `taskApprovals` bytes/history are unchanged.
- [ ] `RUNNING_LOG.md` retains its pre-activation bytes as an exact prefix and contains no post-freeze self-reference.

## Control gates

- [ ] Gate A returns only `preparationAllowed`; its positive path remains `executionAllowed=false` and local/public/fictional/synthetic-only, and it cannot authorize any external delivery mutation, including `Backlog` to `Next`.
- [ ] Stage Gate B binds exactly one substantive task/stage/scope/action/candidate/predecessor/idempotency key, accepted Gate A record, reviewed definition/module, five stage seats, current evidence, and authority; each task's sequences are unique/contiguous from 1 and every later definition points to the immediately prior approved stage/receipt.
- [ ] Direct task-wide approval of every composite contract remains denied.
- [ ] Historical AUD-001, PC-001, and PRD-R0-001 plus every R1-R10 task remain absolutely non-authorizing.
- [ ] `preparationReviews` and `stageApprovals` are empty, and the production action/module/outcome-verifier maps are empty at Stage 0 merge.
- [ ] Ordinary execution cannot reconcile an existing lock; separate reviewed recovery remains disabled at Stage 0.
- [ ] `executeStageFromExactMain` synchronously captures exactly `taskId`, `scopeClass`, `actionClass`, `stageId`, `predecessorReceiptSha256`, `idempotencyKey`, and `execute`; only the exact code-owned callback bound to the reviewed module ID/path/mode/hash, `trusted-public-synthetic-no-native-io-v1` profile, and SHA-256 capability-review evidence is accepted, and the Stage 0 callback allowlist is empty. Static eligibility proves no saved writer, direct/native FD or stream, subprocess/worker, background output, sensitive/private raw material, or other same-realm escape; otherwise the serializable lane is mandatory. The runner holds stage/global locks, durably appends `running`, freshly rechecks predecessor/exact-main Gate B/every deadline, and takes actual start time immediately before invocation. Expiry/movement terminalizes no-mutation with zero callback calls; the primordial timer uses the actual-start remaining window. Ordinary dynamic console/process interception is a guardrail rather than a sandbox. The runner fully awaits settlement, restores bindings, accepts only the closed receipt, and releases the stage lock after an append exception only when a new recovery/terminal append succeeds or explicit event-directory fsync plus full hash-chain validation proves the written tail; otherwise replay stays fail-stuck.
- [ ] `verification-pending` precedes terminal success, whose receipt binds immediate and two timed-quiescent outcome-verification digests; every verifier is followed by fresh deadline/exact-main/Gate B checks and the final recheck immediately precedes terminal append.
- [ ] Terminal reconciliation performs no second execution, tolerates only later source/append-only-registry snapshot evolution, and rejects any drift in immutable preparation, candidate, dossier, stage-approval, definition, or module bindings.
- [ ] Successor control review and running-log trust paths are append-only, exact-candidate, and evidence-only.
- [ ] Every ordinary Project Status/issue-state/canonical-status-label edge requires a full immutable Gate B authorization from a task-bound stage ending in `-DELIVERY-TRANSITION`, exact `delivery-control/delivery-status-transition`, and the regular-blob code-owned `p0.delivery-transition` module; neither `P0-OA-001` nor `P0-OA-002` is due. Actual workflow configuration or another non-delivery mutation cannot use this branch and remains separately gated as `private-execution/project-workflow-mutation` with current private authority and `P0-OA-002`.
- [ ] Delivery plans bind the exact rollback snapshot reference, recovery-plan digest, and immutable frozen-snapshot digest and are reconstructed semantically before apply; each new saga/lock directory entry and every event file/containing directory is fsynced, and one unique-owner per-task lock excludes both same-plan and cross-plan concurrent invocations before any external call.
- [ ] The pure Stage 0 dry-run claims digest binding only. Any future trusted apply adapter proves live exact-50 parity before the first operation, after every forward/rollback operation, at immediate/two-quiescent verification, throughout recovery, and on terminal replay; Stage 0 production apply remains disabled.
- [ ] Rollback and every rolled-back replay each prove the exact preimage at one immediate and two timed-quiescent boundaries before returning a terminal result.
- [ ] Delivery transition is a separate one-task control and no Stage 0 live transition occurs.

## Verification

- [ ] After any post-start append exception, every newly readable tail—including `verification-pending`—releases no lock and becomes no recovery predecessor until the exact tail remains a regular non-symlink file, that file is explicitly fsynced, the complete hash chain and identical tail are reread, and the event directory is then fsynced; file-sync or directory-sync uncertainty remains fail-stuck and replay-denied.

- [ ] All legacy and new positive/adversarial suites pass twice with stable suite manifests bound to the exact head.
- [ ] Generated tracking, structural validation, two-pass generation, two identical dry-runs, public-safety scan, frozen v10 syntax, and workflow-integrity checks pass.
- [ ] Frozen-50 verifier passes before and after every generator, workbook, Wiki, sync plan, and closure check.
- [ ] Workbook preserves 7 sheets, 58 unique task/issue rows, 78 requirements, 2,009 formulas with zero errors, exact R10 blanks, manifest binding, closed archive safety, and complete clean renders.
- [ ] Wiki `--help` is side-effect-free; two exact-source builds match; Page Audit reports derived N/N, source SHA, zero collisions, and zero broken links/fragments.
- [ ] Two previously broken UX review fragments resolve to the stable Monthly Almanac section without changing R3 semantics.

## Exact-candidate Council

- [ ] Product, Design, Architecture, QA, and Project reviewers are active, role-bound, distinct, and independent where required.
- [ ] Each seat reviews the same exact head, full diff manifest, dossier/context digests, test outputs, workbook, Wiki, freeze result, rollback rehearsal, and bounded claim.
- [ ] No unresolved veto remains and normal required CI is current-head successful.
- [ ] PR #70 is changed from draft only after all gates pass; merge uses an expected-head guard and no auto-merge/direct push/force-push.

## Publication sequence

- [ ] Candidate merges normally.
- [ ] A separate add-only successor-review PR publishes the exact five-seat control record without changing task approval, permission, task state, projections, or historical PC-001 review.
- [ ] Exact merged main is fetched cleanly; all source/projection/freeze checks pass again.
- [ ] Authorized local/public projections, workbook, eight issue/Project values, and Wiki are reconciled from exact merged main with no delivery Status/state/label mutation.
- [ ] Immediate and two quiescent read-only verifier snapshots pass; the authenticated Roadmap UI receives a separate visual audit.
- [ ] Final source/Wiki/verifier evidence is recorded in the merged PR/check channel, not a source-only self-reference commit.

## Bounded completion statement

Stage 0 may be called complete only as **P0/R0 control-plane repair published and verified; 58 Incomplete; 45 Hold + 13 Historical non-authorizing; 0 Ready; 0 execution-allowed; no R0 action, private access, authentic content, deployment, release, or R1-R10 work performed.**
