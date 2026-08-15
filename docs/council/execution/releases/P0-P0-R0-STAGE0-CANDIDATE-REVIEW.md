# P0/R0 Stage 0 control-repair candidate review dossier

- **Prepared:** 2026-08-15
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
5. Closed staged-action and serializable-runner schemas, durable lock/receipt/recovery behavior, deadline and process-tree cancellation controls, and sanitized public receipts.
6. A separate one-task delivery transition tool that requires a dedicated immutable Gate B transition stage, exact private workflow scope/action/module, and both `P0-OA-001`/`P0-OA-002` for every edge; binds exact rollback and frozen-snapshot facts; durably persists directory/event entries; excludes every concurrent same-plan or cross-plan invocation with one unique-owner task lock; and requires frozen-50 plus projection verification around apply, rollback, and replay. Gate A never authorizes a delivery mutation, and Stage 0 production apply remains disabled.
7. A permanent 50-task freeze verifier and adversarial fixtures.
8. Wiki build/help/link/fragment/current-source repairs and deterministic Page Audit validation.
9. Exact-current documentation, readiness-state, generated projection, workbook, and CI reconciliation.

## Exclusions

- No product behavior or frozen prototype change.
- No new task, issue, milestone, field, view, workflow, label definition, or Project item.
- No R1-R10 semantic or artifact change.
- No task approval, stage approval, or runtime module is populated in Stage 0.
- No private host/provider/tunnel/DNS/backup access, credential use, authentic content, deployment, restore, acceptance, release, or production claim.
- No live delivery-state mutation during Stage 0.

## Non-self-referential review rule

This file defines the candidate context but does not claim its own not-yet-existing commit SHA. After the complete candidate freezes, five distinct active registry-bound seats independently recompute the full changed-path/hash/mode/type manifest, review the exact head, and publish sanitized attestations in the PR/check channel. The later successor-review publication is an add-only record in a separate normal PR and cannot alter task approvals or runtime permission.

## Current factual repair

The four obsolete PC-001 source blockers that said independent exact-candidate/five-seat review and later review publication were pending are removed. That correction does not reactivate PC-001: it remains Historical non-authorizing, its six artifacts remain In review, `taskApprovals` remains empty, and every task remains execution-disallowed.

## Candidate acceptance

The candidate is acceptable only if the delivery checklist and test plan in this dossier pass twice from a clean exact source revision, the 50-task freeze comparison passes before and after every generated surface, independent QA and adversarial review report no veto, the workbook and Wiki pass complete semantic/safety/render/link inspection, and normal exact-head CI is successful. A missing, skipped, stale, neutralized, or nonzero check is a Hold.
