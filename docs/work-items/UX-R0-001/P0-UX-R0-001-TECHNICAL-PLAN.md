# UX-R0-001 — task technical plan

- **Task ID:** `UX-R0-001`
- **Artifact kind:** `architecture`
- **Artifact state:** `draft`
- **Roadmap status:** `Next`
- **Milestone:** `R0`
- **Execution allowed:** `false`
- **Evidence boundary:** Creation of this draft does not approve implementation, deployment, testing, restore, release, or production use.

## Parent inputs

- [docs/product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md](../../product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md)
- [docs/architecture/PHASE1-IMPLEMENTATION-PLAN.md](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [docs/council/UX-DESIGN-REVIEW.md](../../council/UX-DESIGN-REVIEW.md)
- [docs/design/UX-SPECIFICATION.md](../../design/UX-SPECIFICATION.md)
- [docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [docs/council/agents/P0-QA-LEAD.md](../../council/agents/P0-QA-LEAD.md)
- [docs/council/execution/P0-OWNER-ACTION-LEDGER.md](../../council/execution/P0-OWNER-ACTION-LEDGER.md)

## Technical objective

Translate **First-use/Access/Health States** into a reversible, bounded implementation or evidence plan for this task only:

> Design first use, access denial/expiry, System Health, synthetic recovery, failure, and rollback states.

## Required task-specific decisions

| Area | Required before approval | Current draft state |
| --- | --- | --- |
| Modules and files | Exact owned packages/files, interfaces, and PR decomposition | Not frozen |
| ADRs | Accepted decisions and explicitly rejected alternatives | Not frozen |
| APIs and integrations | Inputs, outputs, auth, validation, timeouts, retries, pagination, rate/size bounds | Not frozen |
| Data and schema | Shapes, invariants, indexes, migrations, compatibility, inventory | Not frozen |
| Trust boundaries | Threats, secrets, logs, cache, private evidence, AI allowlists/exclusions | Not frozen |
| Concurrency | Transactions, idempotency, replay, leases, crash/restart behavior | Not frozen |
| Operations | Capacity assumptions, dependency failure, observability, alerts | Not frozen |
| Recovery | Backup, separate-path restore, rollback and forward-fix | Not frozen |

## Task contracts

- **Requirements:** `LID-SCP-001`, `LID-OPS-001`, `LID-OPS-012`, `LID-OPS-014`, `LID-OPS-018`
- **Dependencies:** `PRD-R0-001`, `SPK-R0-001`
- **Persistent-state / recovery impact:** Planning evidence only; no production data mutation. Any later implementation still needs its own migration, restore, and rollback proof.
- **Health vocabulary:** durable state is exactly one of `unknown`, `never run`, `success`, `delayed`, `failed`, or `blocked`; `Healthy` is the UX label for `success`. Recovery verification is separate evidence/detail.
- **Authentic-media boundary:** no agent or AI-controlled tool opens, renders, thumbnails, OCRs, screenshots, or inspects authentic photos or photo-derived data.

## Technical verification scenarios

1. **`UX-R0-001-T-001` — Boundary and failure:** invalid, absent, repeated, interrupted, or out-of-order inputs fail safely and leave no partial or falsely successful state.
2. **`UX-R0-001-T-002` — Recovery:** every persistent shape introduced or changed by this task is inventoried, backed up, restored in a separate empty path, compared, and rolled back or forward-fixed.
3. **`UX-R0-001-T-003` — Isolation:** privacy, security, resource, dependency, and co-resident failure cannot broaden access, leak sensitive data, or corrupt an accepted earlier release.

## Proposed sequence

1. Freeze task-owned modules/files, interfaces, schemas, ADRs, threats, and fixtures.
2. Obtain Design and QA concurrence on states, errors, accessibility, scenario IDs, evidence, and stop conditions.
3. Record exact dependency-entry and authority evidence.
4. Implement only the smallest council-approved scope with fictional/synthetic fixtures.
5. Produce immutable build, migration, test, restore, rollback, and no-regression evidence.
6. Submit a stable commit and artifact hashes to independent QA and the full council.

## Stop conditions

- Any required decision above remains unfrozen.
- Private target facts or authority are needed but unavailable.
- A human-only owner action is due.
- A privacy, security, recovery, accessibility, evidence, or specialist veto remains.

## Technical Architect disposition

**Draft / Hold.** The global implementation plan is useful source material but is not this task's approved detailed plan.
