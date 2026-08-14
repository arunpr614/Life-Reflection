# UX-R7-001 — task design specification

- **Task ID:** `UX-R7-001`
- **Artifact kind:** `design`
- **Artifact state:** `draft`
- **Roadmap status:** `Backlog`
- **Milestone:** `R7`
- **Execution allowed:** `false`
- **Evidence boundary:** Creation of this draft does not approve implementation, deployment, testing, restore, release, or production use.

## Design inputs

- [docs/product/releases/PRD-R7-GENERATED-ARTWORK.md](../../product/releases/PRD-R7-GENERATED-ARTWORK.md)
- [docs/council/UX-DESIGN-REVIEW.md](../../council/UX-DESIGN-REVIEW.md)
- [docs/design/UX-SPECIFICATION.md](../../design/UX-SPECIFICATION.md)
- [prototypes/calendar-ui/index-v5.html](../../../prototypes/calendar-ui/index-v5.html)
- [docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)

## Experience objective

Specify every human-facing, operator-facing, status, error, privacy, recovery, and accessibility consequence of **Artwork/Version/Suppression Designs** without treating shared specifications or prototypes as task approval.

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

- **Outcome:** Design preflight, meaningful-word, safety/failure, persistent label, versions, stale, suppression, and real-photo-cover states.
- **Requirement IDs:** `LID-AIA-002`, `LID-AIA-003`, `LID-AIA-005`, `LID-AIA-006`, `LID-AIA-007`, `LID-AIA-008`, `LID-AIA-009`, `LID-AIA-010`, `LID-REF-006`, `LID-OPS-017`
- **Parent design sources:** `docs/council/UX-DESIGN-REVIEW.md`, `docs/design/UX-SPECIFICATION.md`, `prototypes/calendar-ui/index-v5.html`
- **Prototype boundary:** frozen prototypes are interaction inputs only; they do not prove runtime auth, persistence, privacy, recovery, accessibility conformance, or production behavior.

## Design verification scenarios

1. **`UX-R7-001-D-001` — Complete states:** the applicable state family above is specified with exact content and permitted actions.
2. **`UX-R7-001-D-002` — Responsive/accessibility:** the task remains understandable and operable across the named responsive, keyboard, focus, screen-reader, contrast, zoom, theme, and motion conditions.
3. **`UX-R7-001-D-003` — Truth/privacy:** copy never claims success before durable evidence, never confuses backup with restore, and never exposes authentic/private data in review artifacts.

## Open design decisions

- Exact task-specific journeys, layouts, components, content, and state applicability require Designer review.
- Architecture-dependent timing, evidence sources, recovery, failure, and maintenance facts remain provisional until the technical plan is approved.
- Any `not-applicable` decision requires a concrete rationale and explicit Designer/council concurrence; this draft does not assert it.

## UI/UX Designer disposition

**Draft / Hold.** Shared UX and prototype sources are inputs. Substantive implementation cannot start until the task-specific design contract is approved or validly marked not applicable.
