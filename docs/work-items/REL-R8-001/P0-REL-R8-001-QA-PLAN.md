# REL-R8-001 — task QA plan

- **Task ID:** `REL-R8-001`
- **Artifact kind:** `qa`
- **Artifact state:** `draft`
- **Roadmap status:** `Backlog`
- **Milestone:** `R8`
- **Execution allowed:** `false`
- **Evidence boundary:** Creation of this draft does not approve implementation, deployment, testing, restore, release, or production use.

## QA inputs

- [docs/product/releases/PRD-R8-OPERATIONAL-SCALE-RESILIENCE.md](../../product/releases/PRD-R8-OPERATIONAL-SCALE-RESILIENCE.md)
- [docs/architecture/PHASE1-IMPLEMENTATION-PLAN.md](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [docs/council/UX-DESIGN-REVIEW.md](../../council/UX-DESIGN-REVIEW.md)
- [docs/design/UX-SPECIFICATION.md](../../design/UX-SPECIFICATION.md)
- [docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [docs/council/agents/P0-QA-LEAD.md](../../council/agents/P0-QA-LEAD.md)
- [docs/council/execution/P0-OWNER-ACTION-LEDGER.md](../../council/execution/P0-OWNER-ACTION-LEDGER.md)

## Test objective

Independently determine whether **Resilience Release Acceptance** satisfies its exact requirements and bounded claim in the named environment, using fictional/synthetic fixtures unless a later explicit human gate authorizes otherwise.

## Scenario matrix

| Scenario | Required coverage | Current state |
| --- | --- | --- |
| `REL-R8-001-QA-001` | Happy path and exact task outcome: Accept the integrated operating envelope only after faults, alerts, capacity, backup/restore, rollback, and regressions pass. | Draft |
| `REL-R8-001-QA-002` | Invalid, missing, duplicate, replayed, interrupted, timeout, stale, dependency-failure, and retry behavior | Draft |
| `REL-R8-001-QA-003` | Privacy/security/authorization, secret/log/cache/export/backup/evidence scans, and AI exclusions | Draft |
| `REL-R8-001-QA-004` | Schema, migration, compatibility, inventory, backup, separate-path restore, rollback/forward-fix | Draft |
| `REL-R8-001-QA-005` | Supported browsers, keyboard, focus, screen reader, contrast, 320 px, text/page zoom, landscape, themes, reduced motion | Draft |
| `REL-R8-001-QA-006` | Dependencies, co-resident/non-regression scope, performance/capacity bounds, observability and exact health states | Draft |

## Traceability and fixtures

- **Requirement IDs:** `LID-SCP-001`, `LID-SCP-002`, `LID-SCP-003`, `LID-SCP-004`, `LID-TG-001`, `LID-TG-002`, `LID-TG-003`, `LID-TG-004`, `LID-TG-005`, `LID-TG-006`, `LID-TG-007`, `LID-TG-008`, `LID-TG-009`, `LID-TG-010`, `LID-VN-001`, `LID-VN-002`, `LID-VN-003`, `LID-VN-004`, `LID-VN-005`, `LID-VN-006`, `LID-VN-007`, `LID-UP-001`, `LID-UP-002`, `LID-UP-003`, `LID-SRC-001`, `LID-SRC-002`, `LID-SRC-003`, `LID-SRC-004`, `LID-REF-001`, `LID-REF-002`, `LID-REF-003`, `LID-REF-004`, `LID-REF-005`, `LID-REF-006`, `LID-REF-007`, `LID-AIT-001`, `LID-AIT-002`, `LID-AIT-003`, `LID-AIT-004`, `LID-AIT-005`, `LID-AIT-006`, `LID-AIT-007`, `LID-AIA-001`, `LID-AIA-002`, `LID-AIA-003`, `LID-AIA-004`, `LID-AIA-005`, `LID-AIA-006`, `LID-AIA-007`, `LID-AIA-008`, `LID-AIA-009`, `LID-AIA-010`, `LID-AIA-011`, `LID-OPS-001`, `LID-OPS-002`, `LID-OPS-003`, `LID-OPS-004`, `LID-OPS-005`, `LID-OPS-006`, `LID-OPS-007`, `LID-OPS-008`, `LID-OPS-009`, `LID-OPS-010`, `LID-OPS-011`, `LID-OPS-012`, `LID-OPS-013`, `LID-OPS-014`, `LID-OPS-015`, `LID-OPS-016`, `LID-OPS-017`, `LID-OPS-018`
- **Dependencies:** `QA-R8-001`
- **Fixture class:** fictional/synthetic; fingerprint and authentic-content exclusion required in executed evidence.
- **Deferred negative scope:** `LID-UP-004`, `LID-DEF-001`, `LID-DEF-002`, `LID-DEF-003`, `LID-DEF-004`, `LID-DEF-005`, `LID-DEF-006` must remain absent.

## Evidence bundle

Executed evidence records task/release/requirement/scenario IDs, source SHA, artifact and dependency/SBOM digests, fixture fingerprint, environment class, sanitized configuration digest, exact commands/tool versions, expected/actual results and timestamps, defects/retests, schema/migration state, backup/restore/rollback result, reviewer identity/independence, opaque private evidence reference when authorized, remaining limitations, and exact permitted claim.

## Independence and severity gate

The executing QA reviewer must not be the candidate implementer. Any unresolved Sev-1/Sev-2, critical/high privacy or security finding, authentic-media violation, status/evidence mismatch, missing restore/rollback, optimistic Health behavior, missing authority, or specialist veto produces `Hold` or `Roll back`.

## Independent QA disposition

**Draft / Hold.** QA is always required. Scenario design here is not executed evidence and cannot make the task Ready or Done.
