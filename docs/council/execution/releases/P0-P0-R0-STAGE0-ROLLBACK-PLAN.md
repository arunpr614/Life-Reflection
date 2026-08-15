# P0/R0 Stage 0 rollback and recovery plan

- **Scope:** public/local control-plane files and generated projections only
- **Private target rollback:** not applicable; Stage 0 performs no private action
- **Live delivery transition rollback:** not exercised; production apply is disabled, while the persisted hash-chained saga, partial-state reconciliation, timed verification, and rollback paths are tested with fictional/mock adapters only

## Before merge

If a candidate test or review fails before any publication, preserve the exact branch and evidence, repair only the Stage 0 allowlist, and rerun the full suite. Do not reset, clean, stash, rewrite history, or absorb unrelated worktree changes. The draft PR remains non-mergeable while any veto or stale check exists.

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

The staged runner starts with an empty production module allowlist. Fictional test modules use closed identifiers and arguments, `shell=false`, fixed working directory/environment, one durable lock, and one append-only receipt. On deadline it signals the complete process group, waits while retaining the lock, and reports terminal cancellation only after no-mutation and no-orphan proof. Possible mutation without a settled verified receipt becomes `recovery-required`; replay cannot execute a second effect.

## Delivery-transition recovery

A future authorized transition binds one dedicated immutable Gate B transition stage, exact private workflow authority plus `P0-OA-001`/`P0-OA-002`, one semantically reconstructed reviewed dry-run, the Gate B rollback snapshot reference, recovery-plan digest, pre-change snapshot, and immutable frozen-50 snapshot digest. Before any external call, every new saga/lock directory entry and event is durably fsynced and a unique-owner task lock excludes every other invocation, including the same plan digest; uncertain recovery keeps that lock pinned, and ordinary execution cannot claim or clear it. A trusted future adapter must prove exact live frozen-50 parity before and after every forward/rollback operation and at every verification/replay boundary. After the first mutation, only separately reviewed reconciliation, recovery, or rollback is permitted. Rollback restores exactly the prior Project Status, issue state, and canonical `status:*` label while preserving all other state, then performs immediate and two timed-quiescent read-only verifications. Any rolled-back replay repeats all three projection and freeze checks. Failure to restore or reverify remains explicit Hold/in-recovery; it never reports success. Stage 0 production apply remains disabled.

## Frozen-scope recovery

Any R1-R10 mismatch is a hard stop. Do not auto-rewrite, skip, normalize, or regenerate the task-specific mismatch. Preserve evidence, identify whether it is unauthorized semantic drift or one of the four explicitly allowed aggregate provenance effects, and obtain independent review before continuing. Unknown or self-whitelisted exceptions fail closed.
