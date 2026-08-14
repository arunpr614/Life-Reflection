# ENG-R7-001 — task product requirements

- **Task ID:** `ENG-R7-001`
- **Artifact kind:** `product`
- **Artifact state:** `draft`
- **Roadmap status:** `Backlog`
- **Milestone:** `R7`
- **Execution allowed:** `false`
- **Evidence boundary:** Creation of this draft does not approve implementation, deployment, testing, restore, release, or production use.

## Parent product source

- [docs/product/releases/PRD-R7-GENERATED-ARTWORK.md](../../product/releases/PRD-R7-GENERATED-ARTWORK.md)
- [docs/product/PRODUCT-REQUIREMENTS.md](../../product/PRODUCT-REQUIREMENTS.md)

## Task outcome

Implement evaluated explicit/sweep generation, versions, labeling, stale state, suppression, cover precedence, failures, and spend control.

This artifact narrows the parent release contract to `ENG-R7-001`. It does not expand the release, change source precedence, or make a shared parent document task approval.

## Scope and traceability

- **Task type:** Implementation
- **Owner role:** Engineering
- **Requirement IDs:** `LID-AIA-001`, `LID-AIA-002`, `LID-AIA-003`, `LID-AIA-004`, `LID-AIA-005`, `LID-AIA-006`, `LID-AIA-007`, `LID-AIA-008`, `LID-AIA-009`, `LID-AIA-010`, `LID-AIA-011`, `LID-REF-006`, `LID-OPS-011`, `LID-OPS-017`, `LID-OPS-018`
- **Dependencies:** `UX-R7-001`, `ARCH-R7-001`, `REL-R6-001`
- **Deferred requirements excluded:** `LID-UP-004`, `LID-DEF-001`, `LID-DEF-002`, `LID-DEF-003`, `LID-DEF-004`, `LID-DEF-005`, `LID-DEF-006`

## Product acceptance scenarios

1. **`ENG-R7-001-P-001` — Outcome:** the task produces exactly the outcome above and the result is reviewable without implying a later task or release is complete.
2. **`ENG-R7-001-P-002` — Boundary:** every mapped requirement is addressed, every deferred requirement stays absent, and no authentic/private/human-only act is inferred from synthetic or public evidence.
3. **`ENG-R7-001-P-003` — Evidence:** the task's named acceptance evidence is retrievable, task-bound, independently reviewable, and no broader than the supported claim.

## Required acceptance evidence

Merged implementation for ENG-R7-001 — Manual & Sweep Artwork Lifecycle proves “Implement evaluated explicit/sweep generation, versions, labeling, stale state, suppression, cover precedence, failures, and spend control.” with task-specific tests, immutable build/SBOM, migrations, sanitized deployment evidence when authorized, separate-path restore, rollback, and no-regression results.

## Product metric

Primary task metric: all mapped requirement outcomes and the three task scenarios have retrievable pass/fail evidence, with zero unresolved scope or product decision.

## Non-goals

- Do not implement work owned by a dependent or later task.
- Do not admit authentic content without its named owner gate.
- Do not treat a prototype, document, code path, CI result, deployment, or backup upload as release acceptance.
- Do not add the seven deferred requirements.

## Owner actions

- `R7-OA-001` — see the Owner Action Ledger

These are relevant future gates, not a request for secrets or owner action during local task-artifact authoring. Their due/satisfied state is recorded separately in the readiness register.

## Open product decisions

- Five-seat task-level Product approval is pending.
- Acceptance scenarios must be confirmed against the exact stable candidate before this artifact can become `approved`.

## Product Manager disposition

**Draft / Hold.** The parent PRD/PID is a planning input. Substantive execution is not permitted until this exact task artifact and the complete dossier pass council review.
