# ENG-R4-002 — task product requirements

- **Task ID:** `ENG-R4-002`
- **Artifact kind:** `product`
- **Artifact state:** `draft`
- **Roadmap status:** `Backlog`
- **Milestone:** `R4`
- **Execution allowed:** `false`
- **Evidence boundary:** Creation of this draft does not approve implementation, deployment, testing, restore, release, or production use.

## Parent product source

- [docs/product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md](../../product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md)
- [docs/product/PRODUCT-REQUIREMENTS.md](../../product/PRODUCT-REQUIREMENTS.md)

## Task outcome

Implement 30-day Trash, restoration/permanent deletion, suppressions, complete encrypted export, cleanup, and import validation.

This artifact narrows the parent release contract to `ENG-R4-002`. It does not expand the release, change source precedence, or make a shared parent document task approval.

## Scope and traceability

- **Task type:** Implementation
- **Owner role:** Engineering
- **Requirement IDs:** `LID-SCP-004`, `LID-REF-007`, `LID-OPS-010`, `LID-OPS-011`, `LID-OPS-013`, `LID-OPS-018`
- **Dependencies:** `ENG-R4-001`
- **Deferred requirements excluded:** `LID-UP-004`, `LID-DEF-001`, `LID-DEF-002`, `LID-DEF-003`, `LID-DEF-004`, `LID-DEF-005`, `LID-DEF-006`

## Product acceptance scenarios

1. **`ENG-R4-002-P-001` — Outcome:** the task produces exactly the outcome above and the result is reviewable without implying a later task or release is complete.
2. **`ENG-R4-002-P-002` — Boundary:** every mapped requirement is addressed, every deferred requirement stays absent, and no authentic/private/human-only act is inferred from synthetic or public evidence.
3. **`ENG-R4-002-P-003` — Evidence:** the task's named acceptance evidence is retrievable, task-bound, independently reviewable, and no broader than the supported claim.

## Required acceptance evidence

Merged implementation for ENG-R4-002 — Trash/Suppressions/Export proves “Implement 30-day Trash, restoration/permanent deletion, suppressions, complete encrypted export, cleanup, and import validation.” with task-specific tests, immutable build/SBOM, migrations, sanitized deployment evidence when authorized, separate-path restore, rollback, and no-regression results.

## Product metric

Primary task metric: all mapped requirement outcomes and the three task scenarios have retrievable pass/fail evidence, with zero unresolved scope or product decision.

## Non-goals

- Do not implement work owned by a dependent or later task.
- Do not admit authentic content without its named owner gate.
- Do not treat a prototype, document, code path, CI result, deployment, or backup upload as release acceptance.
- Do not add the seven deferred requirements.

## Owner actions

- None currently mapped

These are relevant future gates, not a request for secrets or owner action during local task-artifact authoring. Their due/satisfied state is recorded separately in the readiness register.

## Open product decisions

- Five-seat task-level Product approval is pending.
- Acceptance scenarios must be confirmed against the exact stable candidate before this artifact can become `approved`.

## Product Manager disposition

**Draft / Hold.** The parent PRD/PID is a planning input. Substantive execution is not permitted until this exact task artifact and the complete dossier pass council review.
