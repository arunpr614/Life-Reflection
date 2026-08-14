# REL-R1-001 — task product requirements

- **Task ID:** `REL-R1-001`
- **Artifact kind:** `product`
- **Artifact state:** `draft`
- **Roadmap status:** `Backlog`
- **Milestone:** `R1`
- **Execution allowed:** `false`
- **Evidence boundary:** Creation of this draft does not approve implementation, deployment, testing, restore, release, or production use.

## Parent product source

- [docs/product/releases/PRD-R1-MANUAL-JOURNAL-ARCHIVE.md](../../product/releases/PRD-R1-MANUAL-JOURNAL-ARCHIVE.md)
- [docs/product/PRODUCT-REQUIREMENTS.md](../../product/PRODUCT-REQUIREMENTS.md)

## Task outcome

Verify one owner-approved source survives upload, restart, export, backup, restore, and rollback without time/date drift.

This artifact narrows the parent release contract to `REL-R1-001`. It does not expand the release, change source precedence, or make a shared parent document task approval.

## Scope and traceability

- **Task type:** Release acceptance
- **Owner role:** Project Manager + Independent QA
- **Requirement IDs:** `LID-SCP-002`, `LID-SCP-003`, `LID-UP-001`, `LID-UP-002`, `LID-UP-003`, `LID-REF-001`, `LID-REF-004`, `LID-REF-005`, `LID-REF-006`, `LID-OPS-011`, `LID-OPS-018`
- **Dependencies:** `ENG-R1-001`
- **Deferred requirements excluded:** `LID-UP-004`, `LID-DEF-001`, `LID-DEF-002`, `LID-DEF-003`, `LID-DEF-004`, `LID-DEF-005`, `LID-DEF-006`

## Product acceptance scenarios

1. **`REL-R1-001-P-001` — Outcome:** the task produces exactly the outcome above and the result is reviewable without implying a later task or release is complete.
2. **`REL-R1-001-P-002` — Boundary:** every mapped requirement is addressed, every deferred requirement stays absent, and no authentic/private/human-only act is inferred from synthetic or public evidence.
3. **`REL-R1-001-P-003` — Evidence:** the task's named acceptance evidence is retrievable, task-bound, independently reviewable, and no broader than the supported claim.

## Required acceptance evidence

Release acceptance for REL-R1-001 — First-memory Restore/Rollback Acceptance links independent QA, five-seat review, every task-specific dossier, backup/separate-path restore for each new shape, rollback, defect gate, and proceed/hold/rollback record; a human attestation is included only for a named non-delegable act.

## Product metric

Primary task metric: all mapped requirement outcomes and the three task scenarios have retrievable pass/fail evidence, with zero unresolved scope or product decision.

## Non-goals

- Do not implement work owned by a dependent or later task.
- Do not admit authentic content without its named owner gate.
- Do not treat a prototype, document, code path, CI result, deployment, or backup upload as release acceptance.
- Do not add the seven deferred requirements.

## Owner actions

- `R1-OA-001` — see the Owner Action Ledger

These are relevant future gates, not a request for secrets or owner action during local task-artifact authoring. Their due/satisfied state is recorded separately in the readiness register.

## Open product decisions

- Five-seat task-level Product approval is pending.
- Acceptance scenarios must be confirmed against the exact stable candidate before this artifact can become `approved`.

## Product Manager disposition

**Draft / Hold.** The parent PRD/PID is a planning input. Substantive execution is not permitted until this exact task artifact and the complete dossier pass council review.
