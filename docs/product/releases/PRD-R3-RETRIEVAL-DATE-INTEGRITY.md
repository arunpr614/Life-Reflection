# PRD R3 — Retrieval and Date Integrity

## Document control

| Field | Value |
| --- | --- |
| Release | R3 — Retrieval and Date Integrity |
| Document type | Product requirements document |
| Status | Council-reviewed planning baseline; not an implementation, deployment, or release-acceptance record |
| Accountable role | Product owner |
| Proposed start | 2026-10-12 |
| Proposed target | 2026-10-30 |
| Date confidence | Planning estimate only. Evidence gates, not dates, control entry and exit. |
| Evidence boundary | This document defines intended behavior. It does not establish implementation, testing, deployment, production use, or acceptance. |

## Related artifacts

- [Governing product requirements](../PRODUCT-REQUIREMENTS.md)
- [Product Manager review](../../council/PRODUCT-MANAGER-REVIEW.md)
- [Phase 1 release plan](../../project/PHASE1-RELEASE-PLAN.md)
- [Phase 1 implementation plan](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [UX specification](../../design/UX-SPECIFICATION.md)
- [Prototype v5 feature audit](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md)
- [Prototype v5](../../../prototypes/calendar-ui/index-v5.html)

Prototype Search and Almanac are partial interaction examples. The approved Monthly Almanac must be extended into the required cross-month chronological experience, and the prototype query-in-URL behavior must not be carried into the private product.

## Problem and intended outcome

As text and photos accumulate, a month Calendar alone is insufficient. The owner needs chronological browsing and deterministic local retrieval, and must be able to resolve an incorrect Journal Date without splitting or duplicating a Source Item across old and new days.

R3 intends to make the archive findable and date-correctable: a cross-month Monthly Almanac, exact lexical/date/tag/caption retrieval with deliberate history scope, durable Needs Date Review resolution, and atomic redating. Search privacy and restoration of retrieval/date state are release gates.

## Scope and requirement boundary

**Included requirement IDs (6):** LID-SRC-003, LID-REF-002, LID-REF-003, LID-REF-006, LID-OPS-011, LID-OPS-018.

**Excluded requirement IDs (72):** LID-SCP-001, LID-SCP-002, LID-SCP-003, LID-SCP-004, LID-TG-001, LID-TG-002, LID-TG-003, LID-TG-004, LID-TG-005, LID-TG-006, LID-TG-007, LID-TG-008, LID-TG-009, LID-TG-010, LID-VN-001, LID-VN-002, LID-VN-003, LID-VN-004, LID-VN-005, LID-VN-006, LID-VN-007, LID-UP-001, LID-UP-002, LID-UP-003, LID-UP-004, LID-SRC-001, LID-SRC-002, LID-SRC-004, LID-REF-001, LID-REF-004, LID-REF-005, LID-REF-007, LID-AIT-001, LID-AIT-002, LID-AIT-003, LID-AIT-004, LID-AIT-005, LID-AIT-006, LID-AIT-007, LID-AIA-001, LID-AIA-002, LID-AIA-003, LID-AIA-004, LID-AIA-005, LID-AIA-006, LID-AIA-007, LID-AIA-008, LID-AIA-009, LID-AIA-010, LID-AIA-011, LID-OPS-001, LID-OPS-002, LID-OPS-003, LID-OPS-004, LID-OPS-005, LID-OPS-006, LID-OPS-007, LID-OPS-008, LID-OPS-009, LID-OPS-010, LID-OPS-012, LID-OPS-013, LID-OPS-014, LID-OPS-015, LID-OPS-016, LID-OPS-017, LID-DEF-001, LID-DEF-002, LID-DEF-003, LID-DEF-004, LID-DEF-005, LID-DEF-006.

Excluded means not newly owned by R3. R0–R2 remain inherited regression gates, including source/date truth, photo privacy, Calendar/Journal Day behavior, media references, accessibility, backup/restore, and failure isolation.

## Owner scenarios

1. The owner scrolls the cross-month Monthly Almanac and opens the same Journal Day detail used by Calendar.
2. The owner searches an exact phrase, Journal Date, source title, generated tag when present, or Photo Caption and receives deterministic local results.
3. History is excluded by default; the owner deliberately includes history and sees its scope clearly before and after the query.
4. Search text remains in private request state and never appears in a URL, browser history, log, analytics event, or support artifact.
5. The owner resolves a Needs Date Review item by choosing a valid historical date.
6. The owner redates a Source Item and sees the old day, new day, Monthly Almanac, Calendar, cover, and retrieval indexes update atomically, with affected derived state marked according to its source binding.

## Functional acceptance

- LID-REF-002: Monthly Almanac spans month boundaries, is chronological, distinguishes dates and source types, supports pagination or continuation without duplicates/gaps, and opens authoritative Journal Day detail.
- LID-REF-003: deterministic local search covers displayed journal text, source title, Journal Date, tags, and Photo Captions; filters are explicit; current/live scope is default; history inclusion is a deliberate separate control.
- LID-REF-003 privacy: query text is absent from URL, browser history, logs, analytics, metrics labels, and third-party requests; result access still uses the private human boundary.
- LID-SRC-003: redating preserves immutable Original Timestamp and source origin, moves one source reference in one transaction, recalculates both days, cover eligibility, visibility, Almanac order, search/index state, and affected derived-artifact staleness.
- LID-SRC-003: interruption before commit leaves the old state; interruption after commit converges to the new state without duplicate live placement; retry is idempotent.
- LID-REF-006: Monthly Almanac, Search, Needs Date Review, redating preview/confirmation/result, empty/loading/error states, and Journal Day transitions meet the required browser, responsive, keyboard, focus, label, zoom, and reduced-motion contract.
- LID-OPS-011: query/index schema, review queue, redating audit relationship, and affected-day state are backed up; restore either reproduces or deterministically rebuilds indexes and validates exact results.
- LID-OPS-018: an index, rebuild, or optional dependency failure does not corrupt source truth or make healthy source detail unavailable; degraded state is explicit.

## Nonfunctional acceptance

- Known query fixtures return exactly the expected current and opt-in history sets with no leakage across scope.
- Almanac pagination/continuation produces no duplicate, skipped, or unstable item for a fixed data snapshot.
- Redating uses one authoritative transaction boundary; async index work is transactional or recoverably queued and observable.
- Query content is treated as private journal content and excluded from logs, URLs, telemetry, and external services.
- Retrieval results retain source/derived labels and never present a generated field as authentic source text.
- Restored or rebuilt indexes return the same fixture result sets as the pre-backup archive.

## Design contract

R3 design covers the cross-month Monthly Almanac, chronological grouping, continuation, empty/loading/error states, Search input, result snippets, filters, deliberate history scope, zero results, private-query behavior, Needs Date Review queue/detail, date selection, redating impact preview, confirmation, interruption, success, failure, and affected-day navigation.

The [UX specification](../../design/UX-SPECIFICATION.md) governs the intended experience. [Prototype v5](../../../prototypes/calendar-ui/index-v5.html) provides partial Search and reading-mode direction only. It lacks the required cross-month Almanac, complete review/redating flow, durable state, and safe private-query transport.

## Architecture and dependency gates

- R2 has an evidence-backed proceed decision and all accepted text/photo data shapes remain recoverable.
- Search field allowlists, normalization, filters, index encryption/location, query transport, query-log exclusion, rebuild, and transaction/retry behavior are decided.
- Almanac continuation order and stable cursor behavior are specified for a fixed archive snapshot.
- Redating transaction boundaries enumerate old/new Journal Day visibility, Calendar Cover, gallery order, derived binding/staleness, review state, and index effects.
- Backup/restore and rollback plans cover index/version compatibility and an interrupted redating operation.

## Outcome metrics

| Metric | R3 target | Evidence placeholder |
| --- | --- | --- |
| Search determinism | 100% of known current/history fixtures return the exact expected set | Not yet provided |
| Query privacy | Zero query values in URL, browser history, logs, telemetry, or external requests | Not yet provided |
| Almanac integrity | Zero duplicate or skipped fixture across cross-month continuation | Not yet provided |
| Redating atomicity | 100% of interruption/retry fixtures converge to exactly one valid old/new state | Not yet provided |
| Index recovery | Restored or rebuilt result sets equal the pre-backup fixture sets | Not yet provided |
| Accessibility/browser | No blocking issue in Almanac, Search, review, or redating across the required matrix | Not yet provided |

## Privacy and security

- Search and filter values are as sensitive as journal content and remain local to authenticated request processing.
- No query, result snippet, caption, journal text, date association, or identifier is sent to analytics, crash reporting, model providers, or public cache.
- Result authorization is enforced on every request; an opaque result identifier does not bypass owner access.
- Evidence uses synthetic phrases and dates. Screenshots and reports must not expose authentic content.
- Redating preserves immutable provenance and never rewrites Original Timestamp to hide prior capture evidence.

## Accessibility

Almanac landmarks, date headings, result counts, scope filters, snippets, review status, impact summaries, and redating errors must be semantically connected and keyboard operable. Focus moves predictably after search and redating. Screen-reader output distinguishes current source, history, and derived content. Mobile layout, 200% zoom, visible focus, contrast, reduced motion, and no-color-only status are acceptance checks.

## Recovery and rollback

R3 adds Almanac continuation state if persisted, search schema/index metadata, history-scope settings if retained, Needs Date Review state, redating audit/transaction state, and affected derived/index queues. Exit requires backup and executed restore or deterministic rebuild, plus exact query-result and old/new-day comparisons.

Rollback must preserve the authoritative source/date state. A rollback during redating must resolve to the fully old or fully new state, never both. If an older version cannot read the new index, it may rebuild from source truth; the evidence must show that source access remains available and query data is not leaked during recovery.

## Release entry criteria

- R2 exit criteria and proceed record exist.
- Search privacy, index, Almanac ordering, review-state, and atomic-redating decisions are reviewable.
- Synthetic exact-result, history-scope, query-leakage, cross-month, midnight/date, interruption, retry, backup/restore, and rollback fixtures exist.
- Design review covers every Almanac, Search, review, redating, degraded, responsive, and accessibility state.
- The R3 rollback plan identifies the authoritative source/date record and index rebuild path.

## Release exit criteria

- Every included requirement has executed requirement-level evidence or an explicit no-go.
- Known queries, deliberate history scope, cross-month Almanac, Needs Date Review, redating, interruption, retry, query-privacy, index-rebuild, backup, restore, and rollback fixtures pass their specified outcomes.
- Old and new Journal Days, Calendar, cover, Almanac, and index agree after redating and after restore.
- No unresolved severity-1 or severity-2 defect remains, and the decision record says proceed, hold, or roll back.

## No-go criteria

- Query text appears in a URL, history, log, telemetry record, third-party request, or uncontrolled evidence.
- Almanac or Search silently omits, duplicates, or mis-scopes a known live item.
- Redating produces two live placements, no live placement, a changed Original Timestamp, or inconsistent old/new derived/index state.
- Restore/rebuild changes known result sets or loses review/redating state.
- Source browsing becomes unavailable because an index or optional dependency is unhealthy.

## Explicit non-goals

- Semantic search, embeddings, conversational search, image recognition, OCR search, or question answering.
- Corrections, upstream conflict resolution, complete History management, Trash, suppressions, or restorable export.
- VoiceNotes, generated text, generated artwork, or image analysis.
- Shareable results, public links, third-party analytics, offline-first behavior, or legacy-browser support.
- Object-store transition.

## Evidence register

| Evidence | Expected artifact | Status |
| --- | --- | --- |
| Requirement traceability | R3 requirement-to-scenario checklist | Not yet provided |
| Design review | Almanac, Search, history scope, review, redating, error, responsive, and accessibility review | Not yet provided |
| Architecture decision | Query privacy, indexes, continuation, redating transaction, rebuild, backup, and rollback records | Not yet provided |
| Functional test report | Known-query, scope, Almanac, review, redating, interruption, and retry results | Not yet provided |
| Privacy/security report | URL/history/log/telemetry/external-request leakage checks | Not yet provided |
| Accessibility/browser report | Retrieval/date flows across required clients and assistive checks | Not yet provided |
| Backup/restore report | R3 state restore/rebuild and exact result/day comparisons | Not yet provided |
| Rollback report | Interrupted redating and index-version rollback evidence | Not yet provided |
| Owner acceptance | Find-and-redate walkthrough and proceed, hold, or rollback decision | Not yet provided |

## Evidence boundary

Designs and prototype interactions do not establish retrieval correctness, privacy, atomicity, recovery, or release acceptance. Those claims require the dated executed evidence listed above.
