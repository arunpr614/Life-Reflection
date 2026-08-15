# P0/R0 Stage 0 rollback and recovery plan

- **Scope:** public/local control-plane files and generated projections only
- **Private target rollback:** not applicable; Stage 0 performs no private action
- **Live delivery transition rollback:** not exercised; production apply is disabled, while the persisted hash-chained saga, partial-state reconciliation, timed verification, and rollback paths are tested with fictional/mock adapters only

## Before merge

If a candidate test or review fails before publication, preserve the exact branch and evidence, add only a narrow normal corrective commit on the current exact head, and rerun the full suite. Preserve the first-parent chain from activation main through freeze, draft evidence, `0533b6b3904b8c96325ff90b5c363228d0b3d4b9`, and the corrective commit(s). Do not amend, rebase, merge, reset, clean, stash, force-push, rewrite history, or absorb unrelated worktree changes. Every renewed review binds the full activation-base-to-final-head changed-file set; a parent-only subset is insufficient. The draft PR remains non-mergeable while any veto or stale check exists.

If generated refresh fails before the first promotion, staging is cleaned and original targets remain unchanged. If any promotion has begun, never overwrite possibly concurrent bytes: retain the recovery journal/staging, report `recovery-required`, inspect exact original/intended/current hashes, and recover through a separately reviewed deterministic rerun or normal Git revert.

## After candidate merge

The normal rollback is a new reviewed revert PR against the exact merged Stage 0 candidate. The revert rehearsal must run in a temporary clean worktree and prove:

1. historical PC-001 control-review bytes/history remain intact;
2. the prior `RUNNING_LOG.md` prefix remains intact;
3. the 50-task freeze still passes;
4. all legacy validators return to their prior compatible state;
5. no live issue, Project, Wiki, private system, or delivery status is mutated by the source revert itself; and
6. the Stage 0 draft/successor evidence remains truthful history rather than being rewritten.

The later add-only successor review record is never amended or deleted. If candidate merge is reverted, a new add-only control record identifies the revert and bounded claim; it still creates no task approval or runtime permission.

## Runner recovery

The staged runtime starts with empty production stage/module/callback/outcome-verifier maps. For a short in-process unit, `executeStageFromExactMain` synchronously captures the exact request and accepts only its code-owned callback/module identity plus `trusted-public-synthetic-no-native-io-v1` and bound SHA-256 capability-review evidence. Static review excludes saved writers, direct/native FDs or streams, subprocesses/workers, background output, and sensitive/private raw material; any such need routes to the serializable lane. The runner holds stage/global locks, durably appends `running`, freshly rechecks predecessor/exact-main Gate B/every deadline, and takes actual start time immediately before invocation. Expired/moved authority durably terminalizes no-mutation without calling the callback; the primordial timer uses only the actual-start remaining window. Ordinary dynamic console/process interception is a guardrail, not a sandbox. The runner restores bindings, requests `AbortSignal` cancellation, and retains both locks until Promise settlement. A callback that ignores abort and never settles is fail-stuck; a throw, early/invalid receipt, deadline, guardrail-detected stream attempt, or post-action source/authority failure becomes `recovery-required`. If recovery/terminal append fails after durable start, a readable event permits release only after explicit event-directory fsync and full hash-chain revalidation; otherwise the stage lock remains pinned and replay cannot execute a second effect. For long/process/native-output work, the serializable runner uses closed module/argument identifiers, `shell=false`, fixed working directory/environment, one durable lock, process-tree cancellation, and one append-only receipt. It waits while retaining the lock and reports terminal cancellation only after no-mutation and no-orphan proof. Neither lane returns raw output.

After a post-start append exception, every newly readable tail—including `verification-pending`—is unproven and cannot justify a dependent recovery append or ordinary retry. Reviewed recovery first proves the exact tail is a regular non-symlink file, fsyncs it, rereads the full hash chain and identical tail, and then fsyncs the event directory; uncertainty at either fsync leaves the stage lock pinned and replay denied.

## Delivery-transition recovery

A future authorized ordinary delivery transition binds one dedicated immutable Gate B transition stage, exact `delivery-control/delivery-status-transition`, the code-owned `p0.delivery-transition` module, and neither `P0-OA-001` nor `P0-OA-002`; actual workflow configuration or another non-delivery mutation cannot use this recovery path and remains separately gated as `private-execution/project-workflow-mutation` with `P0-OA-002`. The transition also binds one semantically reconstructed reviewed dry-run, the Gate B rollback snapshot reference, recovery-plan digest, pre-change snapshot, and immutable frozen-50 snapshot digest. Before any external call, every new saga/lock directory entry and event is durably fsynced and a unique-owner task lock excludes every other invocation, including the same plan digest; uncertain recovery keeps that lock pinned, and ordinary execution cannot claim or clear it. A trusted future adapter must prove exact live frozen-50 parity before and after every forward/rollback operation and at every verification/replay boundary. After the first mutation, only separately reviewed reconciliation, recovery, or rollback is permitted. Rollback restores exactly the prior Project Status, issue state, and canonical `status:*` label while preserving all other state, then performs immediate and two timed-quiescent read-only verifications. Any rolled-back replay repeats all three projection and freeze checks. Failure to restore or reverify remains explicit Hold/in-recovery; it never reports success. Stage 0 production apply remains disabled.

## Frozen-scope recovery

Any R1-R10 mismatch is a hard stop. Do not auto-rewrite, skip, normalize, or regenerate the task-specific mismatch. Preserve evidence, identify whether it is unauthorized semantic drift or one of the four explicitly allowed aggregate provenance effects, and obtain independent review before continuing. Unknown or self-whitelisted exceptions fail closed.
