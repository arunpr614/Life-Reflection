# ARCH-R3-001 — task QA plan

- **Task ID:** `ARCH-R3-001`
- **Artifact kind:** `qa`
- **Artifact state:** `draft`
- **Roadmap status:** `Backlog`
- **Milestone:** `R3`
- **Execution allowed:** `false`
- **Evidence boundary:** Creation of this draft does not approve implementation, deployment, testing, restore, release, or production use.

## QA inputs

- [docs/product/releases/PRD-R3-RETRIEVAL-DATE-INTEGRITY.md](../../product/releases/PRD-R3-RETRIEVAL-DATE-INTEGRITY.md)
- [docs/architecture/PHASE1-IMPLEMENTATION-PLAN.md](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [docs/council/UX-DESIGN-REVIEW.md](../../council/UX-DESIGN-REVIEW.md)
- [docs/design/UX-SPECIFICATION.md](../../design/UX-SPECIFICATION.md)
- [prototypes/calendar-ui/index-v5.html](../../../prototypes/calendar-ui/index-v5.html)
- [docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [docs/council/agents/P0-QA-LEAD.md](../../council/agents/P0-QA-LEAD.md)
- [docs/council/execution/P0-OWNER-ACTION-LEDGER.md](../../council/execution/P0-OWNER-ACTION-LEDGER.md)

## Test objective

Independently determine whether **Search Index & Redating Transaction** satisfies its exact requirements and bounded claim in the named environment, using fictional/synthetic fixtures unless a later explicit human gate authorizes otherwise.

## Scenario matrix

| Scenario | Required coverage | Current state |
| --- | --- | --- |
| `ARCH-R3-001-QA-001` | Happy path and exact task outcome: Define encrypted lexical indexes, query/log privacy, date-review storage, and one-transaction old/new-day redating. | Draft |
| `ARCH-R3-001-QA-002` | Invalid, missing, duplicate, replayed, interrupted, timeout, stale, dependency-failure, and retry behavior | Draft |
| `ARCH-R3-001-QA-003` | Privacy/security/authorization, secret/log/cache/export/backup/evidence scans, and AI exclusions | Draft |
| `ARCH-R3-001-QA-004` | Schema, migration, compatibility, inventory, backup, separate-path restore, rollback/forward-fix | Draft |
| `ARCH-R3-001-QA-005` | Supported browsers, keyboard, focus, screen reader, contrast, 320 px, text/page zoom, landscape, themes, reduced motion | Draft |
| `ARCH-R3-001-QA-006` | Dependencies, co-resident/non-regression scope, performance/capacity bounds, observability and exact health states | Draft |

## Traceability and fixtures

- **Requirement IDs:** `LID-SRC-003`, `LID-REF-002`, `LID-REF-003`, `LID-REF-006`, `LID-OPS-011`, `LID-OPS-018`
- **Dependencies:** `PRD-R3-001`, `REL-R2-001`
- **Fixture class:** fictional/synthetic; fingerprint and authentic-content exclusion required in executed evidence.
- **Deferred negative scope:** `LID-UP-004`, `LID-DEF-001`, `LID-DEF-002`, `LID-DEF-003`, `LID-DEF-004`, `LID-DEF-005`, `LID-DEF-006` must remain absent.

## Evidence bundle

Executed evidence records task/release/requirement/scenario IDs, source SHA, artifact and dependency/SBOM digests, fixture fingerprint, environment class, sanitized configuration digest, exact commands/tool versions, expected/actual results and timestamps, defects/retests, schema/migration state, backup/restore/rollback result, reviewer identity/independence, opaque private evidence reference when authorized, remaining limitations, and exact permitted claim.

## Independence and severity gate

The executing QA reviewer must not be the candidate implementer. Any unresolved Sev-1/Sev-2, critical/high privacy or security finding, authentic-media violation, status/evidence mismatch, missing restore/rollback, optimistic Health behavior, missing authority, or specialist veto produces `Hold` or `Roll back`.

## Independent QA disposition

**Draft / Hold.** QA is always required. Scenario design here is not executed evidence and cannot make the task Ready or Done.
