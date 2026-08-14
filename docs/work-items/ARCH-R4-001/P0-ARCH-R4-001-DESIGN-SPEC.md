# ARCH-R4-001 — task design specification

- **Task ID:** `ARCH-R4-001`
- **Artifact kind:** `design`
- **Artifact state:** `draft`
- **Roadmap status:** `Backlog`
- **Milestone:** `R4`
- **Execution allowed:** `false`
- **Evidence boundary:** Creation of this draft does not approve implementation, deployment, testing, restore, release, or production use.

## Design inputs

- [docs/product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md](../../product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md)
- [docs/council/UX-DESIGN-REVIEW.md](../../council/UX-DESIGN-REVIEW.md)
- [docs/design/UX-SPECIFICATION.md](../../design/UX-SPECIFICATION.md)
- [docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)

## Experience objective

Specify every human-facing, operator-facing, status, error, privacy, recovery, and accessibility consequence of **Revision/Suppression/Export Lifecycle** without treating shared specifications or prototypes as task approval.

## Required state family

- normal and success;
- empty and never-run;
- loading and long-running;
- validation and dependency error;
- interruption, timeout, retry, and stale result;
- denied, expired, blocked, unavailable, and not-configured prerequisite;
- destructive, spend-bearing, migration, recovery, and rollback states where applicable;
- wide, compact, 320 px, 200% text, 400% page zoom, landscape, light/dark theme, and reduced-motion behavior; and
- keyboard order, focus entry/return, semantic names, live-region behavior, non-color cues, target size, contrast, and screen-reader reading order.

## Task traceability

- **Outcome:** Define immutable revisions/Corrections, active display binding, Trash/suppression state machine, passphrase handoff, export cleanup, and restore.
- **Requirement IDs:** `LID-SCP-004`, `LID-SRC-001`, `LID-SRC-002`, `LID-SRC-004`, `LID-REF-007`, `LID-OPS-010`, `LID-OPS-011`, `LID-OPS-013`, `LID-OPS-018`
- **Parent design sources:** `docs/council/UX-DESIGN-REVIEW.md`, `docs/design/UX-SPECIFICATION.md`
- **Prototype boundary:** frozen prototypes are interaction inputs only; they do not prove runtime auth, persistence, privacy, recovery, accessibility conformance, or production behavior.

## Design verification scenarios

1. **`ARCH-R4-001-D-001` — Complete states:** the applicable state family above is specified with exact content and permitted actions.
2. **`ARCH-R4-001-D-002` — Responsive/accessibility:** the task remains understandable and operable across the named responsive, keyboard, focus, screen-reader, contrast, zoom, theme, and motion conditions.
3. **`ARCH-R4-001-D-003` — Truth/privacy:** copy never claims success before durable evidence, never confuses backup with restore, and never exposes authentic/private data in review artifacts.

## Open design decisions

- Exact task-specific journeys, layouts, components, content, and state applicability require Designer review.
- Architecture-dependent timing, evidence sources, recovery, failure, and maintenance facts remain provisional until the technical plan is approved.
- Any `not-applicable` decision requires a concrete rationale and explicit Designer/council concurrence; this draft does not assert it.

## UI/UX Designer disposition

**Draft / Hold.** Shared UX and prototype sources are inputs. Substantive implementation cannot start until the task-specific design contract is approved or validly marked not applicable.
