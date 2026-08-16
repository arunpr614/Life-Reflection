# P0/R0 Stage 0 control-repair candidate review dossier

- **Prepared:** 2026-08-15
- **Revised:** 2026-08-16
- **Existing delivery task:** `PC-001`
- **Candidate authority:** normal merge of the exact Stage 0 public/local control candidate only
- **Runtime authority:** none
- **Task-approval effect:** none
- **Execution permission effect:** none
- **Durable evidence channel:** draft PR #70; exact candidate SHA and five seat attestations are recorded only after freeze

## Outcome

Repair the bounded P0/R0 control plane so future work can distinguish proposal preparation from execution, approve one immutable R0 stage at a time, retain append-only evidence without invalidating reviewed candidates, transition delivery state recoverably, prove all 50 R1-R10 records remain frozen, and rebuild the Wiki from exact source without self-reference or broken fragments.

## Included control surfaces

1. Pure Gate A and stage-scoped Gate B evaluators with explicit `preparationAllowed` and `executionAllowed` separation.
2. An inert, append-only R0 stage-approval registry whose production executor allowlist starts empty.
3. A successor control-review registry that preserves historical `controlReviews.PC-001` bytes/history and never feeds task/runtime permission.
4. An append-only `RUNNING_LOG.md` descendant trust contract that is evidence-only.
5. Closed staged-action schemas plus two reviewed runtime lanes: `executeStageFromExactMain` synchronously captures its exact seven data fields and permits only the code-owned callback identity bound to the reviewed module ID/path/mode/hash, `trusted-public-synthetic-no-native-io-v1` profile, and SHA-256 capability-review evidence; its Stage 0 callback allowlist is empty. Static eligibility excludes saved writers, direct/native FDs or streams, subprocesses/workers, background output, and sensitive/private raw material; those belong to the serializable lane. The callback runner holds stage/global locks, persists `running`, then freshly rechecks predecessor/exact-main Gate B/deadlines and derives its at-most-five-minute timer from actual start immediately before invocation. `runSerializableStageFromExactMain` independently captures its exact six own identity data descriptors before yielding, never rereads caller state, and supports reviewed definition-bound Gate B deadlines through four hours. It checks before inert-launcher spawn, arms settlement/cancellation immediately after spawn and before any await, durably fsyncs child identity into the lock, and repeats predecessor/exact-main Gate B/all initial/fresh/current deadlines immediately before `LAUNCH_SIGNAL`, the module-effect boundary. Expiry or movement terminates the waiting launcher with zero module calls and durable non-executing replay. Either lane retains the stage lock after an unproven post-start append: readable bytes require exact regular-file/non-symlink and inode proof, explicit tail-file fsync, full hash-chain/same-tail reread, then directory fsync before they can anchor recovery or permit release. Both bind predecessor, preparation, definition, module, registry, outcome evidence, deadline/recovery behavior, and sanitized public receipts; neither returns raw output.
6. A separate one-task delivery transition tool that requires a dedicated immutable Gate B transition stage and exact `delivery-control/delivery-status-transition` plus `p0.delivery-transition` for ordinary Project Status/issue-state/canonical-status-label edges, with neither `P0-OA-001` nor `P0-OA-002` due; binds exact rollback and frozen-snapshot facts; durably persists directory/event entries; excludes every concurrent same-plan or cross-plan invocation with one unique-owner task lock; and requires frozen-50 plus projection verification around apply, rollback, and replay. Actual workflow configuration/non-delivery mutation remains separately gated as `private-execution/project-workflow-mutation` with `P0-OA-002`. Gate A never authorizes a delivery mutation, and Stage 0 production apply remains disabled.
7. A permanent 50-task freeze verifier and adversarial fixtures.
8. Wiki build/help/link/fragment/current-source repairs and deterministic Page Audit validation.
9. Exact-current documentation, readiness-state, generated projection, workbook, and CI reconciliation.

Post-start append recovery treats every newly readable tail, including `verification-pending`, as insufficient and not yet eligible to anchor a recovery append: the exact regular non-symlink tail must be explicitly file-fsynced, the full hash chain and same tail reread, and the event directory fsynced in that order. File or directory durability uncertainty pins the stage lock and denies replay.

## Exclusions

- No product behavior or frozen prototype change.
- No new task, issue, milestone, field, view, workflow, label definition, or Project item.
- No R1-R10 semantic or artifact change.
- No task approval, stage approval, or runtime module is populated in Stage 0.
- No private host/provider/tunnel/DNS/backup access, credential use, authentic content, deployment, restore, acceptance, release, or production claim.
- No live delivery-state mutation during Stage 0.

## Non-self-referential review rule

This file defines the candidate context but does not claim its own not-yet-existing final commit SHA. The normal first-parent history preserves activation main `2dc4d05cdeca8cb9aeacf393076f6c6f946ff62b`, freeze `2dce300376165b78787e232a73713d228f2722fe`, draft evidence `43c5ccb772bd5e4cabc52d73aa40c35ed999dbb7`, Stage 0 implementation `0533b6b3904b8c96325ff90b5c363228d0b3d4b9`, and only narrow normal corrective commit(s); amend, rebase, merge, unrelated commits, history rewrite, and force-push are prohibited. After the repaired candidate freezes, five distinct active registry-bound seats independently recompute the full `2dc4d05cdeca8cb9aeacf393076f6c6f946ff62b..finalHead` changed-path/hash/mode/type manifest, reject a parent-only `43c5ccb772bd5e4cabc52d73aa40c35ed999dbb7..finalHead` subset, review the same exact final head, and publish sanitized attestations in the PR/check channel. The later successor-review publication is an add-only record in a separate normal PR and cannot alter task approvals or runtime permission.

## Current factual repair

The four obsolete PC-001 source blockers that said independent exact-candidate/five-seat review and later review publication were pending are removed. That correction does not reactivate PC-001: it remains Historical non-authorizing, its six artifacts remain In review, `taskApprovals` remains empty, and every task remains execution-disallowed.

## Candidate acceptance

The candidate is acceptable only if the delivery checklist and test plan in this dossier pass twice from a clean exact source revision, the 50-task freeze comparison passes before and after every generated surface, independent QA and adversarial review report no veto, the workbook and Wiki pass complete semantic/safety/render/link inspection, and normal exact-head CI is successful. A missing, skipped, stale, neutralized, or nonzero check is a Hold.
