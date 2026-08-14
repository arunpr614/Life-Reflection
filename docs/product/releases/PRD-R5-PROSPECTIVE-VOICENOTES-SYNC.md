# PRD R5 — Prospective VoiceNotes Sync

## Document control

| Field | Value |
| --- | --- |
| Release | R5 — Prospective VoiceNotes Sync |
| Document type | Product requirements document |
| Status | Planning draft; not an approval or release record |
| Accountable role | Product owner |
| Proposed start | 2026-11-23 |
| Proposed target | 2026-12-11 |
| Date confidence | Planning estimate only. Evidence gates, not dates, control entry and exit. |
| Evidence boundary | This document defines intended behavior. It does not establish provider access, contract validation, implementation, testing, deployment, production use, or acceptance. |

## Related artifacts

- [Governing product requirements](../PRODUCT-REQUIREMENTS.md)
- [Product Manager review](../../council/PRODUCT-MANAGER-REVIEW.md)
- [Phase 1 release plan](../../project/PHASE1-RELEASE-PLAN.md)
- [Phase 1 implementation plan](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [UX specification](../../design/UX-SPECIFICATION.md)
- [Prototype v5 feature audit](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md)
- [Prototype v5](../../../prototypes/calendar-ui/index-v5.html)

The governing requirements describe an intended external integration. This PRD does not assert that its contract, credentials, provider behavior, or unattended renewal has been validated.

## Problem and intended outcome

The owner wants voice-derived journal text to arrive without a second manual import step, but an undocumented event payload must not become archive truth. The integration must be proven synthetically before personal notes depend on it, and imports must remain prospective, exact-tagged, replay-safe, revision-aware, and respectful of local deletion.

R5 intends to add an independently usable prospective sync. A webhook is only a wake signal; authoritative retrieval supplies tag, creation time, transcript, and revision identity. Only notes created at or after immutable Integration Activation and carrying the exact configured tag are eligible. Missed, duplicate, out-of-order, untagged, edited, or deleted upstream states reconcile without silent local loss or resurrection.

## Scope and requirement boundary

**Included requirement IDs (10):** LID-VN-001, LID-VN-002, LID-VN-003, LID-VN-004, LID-VN-005, LID-VN-006, LID-VN-007, LID-OPS-011, LID-OPS-015, LID-OPS-018.

**Excluded requirement IDs (68):** LID-SCP-001, LID-SCP-002, LID-SCP-003, LID-SCP-004, LID-TG-001, LID-TG-002, LID-TG-003, LID-TG-004, LID-TG-005, LID-TG-006, LID-TG-007, LID-TG-008, LID-TG-009, LID-TG-010, LID-UP-001, LID-UP-002, LID-UP-003, LID-UP-004, LID-SRC-001, LID-SRC-002, LID-SRC-003, LID-SRC-004, LID-REF-001, LID-REF-002, LID-REF-003, LID-REF-004, LID-REF-005, LID-REF-006, LID-REF-007, LID-AIT-001, LID-AIT-002, LID-AIT-003, LID-AIT-004, LID-AIT-005, LID-AIT-006, LID-AIT-007, LID-AIA-001, LID-AIA-002, LID-AIA-003, LID-AIA-004, LID-AIA-005, LID-AIA-006, LID-AIA-007, LID-AIA-008, LID-AIA-009, LID-AIA-010, LID-AIA-011, LID-OPS-001, LID-OPS-002, LID-OPS-003, LID-OPS-004, LID-OPS-005, LID-OPS-006, LID-OPS-007, LID-OPS-008, LID-OPS-009, LID-OPS-010, LID-OPS-012, LID-OPS-013, LID-OPS-014, LID-OPS-016, LID-OPS-017, LID-DEF-001, LID-DEF-002, LID-DEF-003, LID-DEF-004, LID-DEF-005, LID-DEF-006.

Excluded means not newly owned by R5. R0–R4 remain inherited regression gates, especially source/revision/Correction truth, date review, Search, Trash, Source Suppression, export, accessibility, backup/restore, and rollback.

## Owner scenarios

1. Using synthetic data only, the team proves event-to-note identity, authoritative retrieval, tag/date/transcript access, unattended authorization renewal, pagination, reconciliation, and failure/rate behavior.
2. The owner explicitly activates the integration; the activation instant cannot be backdated.
3. A note created before activation never imports automatically, even if tagged later; a note at or after activation with the exact tag imports once.
4. A webhook wakes reconciliation but never directly overwrites the local transcript.
5. Duplicate, missed, and out-of-order wakeups converge to one Source Item and the correct Source Revisions.
6. A missing or untrusted creation timestamp produces a durable Voice Journal in Needs Date Review without a Calendar placement.
7. Upstream edit, untag, or deletion changes retained upstream status/revisions but never silently erases the local Source Item.
8. Local deletion creates Source Suppression, restore removes it, permanent deletion retains only the opaque upstream identity, and explicit Allow re-import permits a future reconciliation.

## Functional acceptance

- LID-VN-001: a synthetic spike records event identity, payload behavior, authoritative retrieval, unattended renewal, exact tags, creation time, transcript, pagination, reconciliation, rate/failure behavior, and unresolved gaps; any failed material gate blocks enablement.
- LID-VN-002: webhook payload is a change notification only; authoritative retrieval supplies content and metadata; duplicate/out-of-order callbacks are idempotent; retrieval failure leaves visible recoverable reconciliation state.
- LID-VN-003: eligibility requires exact tag equality and authoritative creation time greater than or equal to immutable Integration Activation; before/equal/after and late-tag fixtures are deterministic; activation cannot be backdated.
- LID-VN-004: initial Journal Date derives from authoritative creation time in Asia/Kolkata; missing/untrusted time preserves encrypted content and opaque identity in Needs Date Review with no ordinary Calendar placement.
- LID-VN-005: periodic reconciliation uses stable opaque source and revision identities; replay creates no duplicate; one new upstream version creates one Source Revision; partial/failed listing aborts rather than inferring deletion.
- LID-VN-006: upstream edit creates a retained revision; untag/delete updates upstream status but never silently removes the local Source Item; absence alone is not deletion evidence.
- LID-VN-007: local deletion never mutates the upstream service; Source Suppression blocks resurrection; restore clears suppression; permanent local deletion retains only required opaque suppression identity; Allow re-import is explicit and confirmed.
- LID-OPS-011: activation, cursor/page state, opaque identities, Source Items/Revisions, upstream status, review state, suppression, reconciliation attempts, and alert state are backed up and restored.
- LID-OPS-015: repeated reconciliation failure and recovery transitions produce deduplicated operational alerts with no transcript, tag, date, identifier, prompt, secret, or signed URL; no journaling reminder is sent.
- LID-OPS-018: provider, callback, authorization, reconciliation, or scheduler failure does not prevent healthy local source browsing, correction, export, or recovery.

## Nonfunctional acceptance

- The integration remains disabled until every material synthetic spike gate is evidenced; an unproven assumption is reopened, not replaced with invented behavior.
- Reconciliation is idempotent, paginated, fail-closed on incomplete listings, restart-safe, and observable from durable state.
- Callback and retrieval logs contain no transcript, tag, upstream identifier, token, payload body, or private date.
- Eligibility uses authoritative timestamps and exact tag matching; webhook receipt time and fuzzy tags never decide import.
- No integration task mutates or deletes upstream content.
- R5 management, activation, health, review, revision, suppression, alert, and failure states meet inherited browser/accessibility behavior.

## Design contract

R5 design covers disconnected/unproven/ready/active/paused/failed authorization states; activation explanation and confirmation; exact prospective boundary; never-run/running/delayed/partial/failed/blocked reconciliation; Needs Date Review; upstream edit/untag/delete status; revision/history; Source Suppression; restore; permanent deletion; Allow re-import; operational alert/recovery; and provider-unavailable local-archive behavior.

The [UX specification](../../design/UX-SPECIFICATION.md) governs these surfaces. Prototype v5 has no validated external integration and cannot establish these states.

## Architecture and dependency gates

- R4 has an evidence-backed proceed decision and its revision, Correction, Trash, suppression, export, recovery, and rollback behavior remains intact.
- The LID-VN-001 synthetic spike passes every material gate. If it does not, R5 remains no-go and affected product/architecture decisions reopen.
- Callback authenticity, official retrieval surface, authorization lifecycle, exact identity fields, pagination, rate limits, reconciliation cursor, activation immutability, and upstream lifecycle semantics are documented from evidence.
- No personal note, identifier, account data, or credential is used in the spike artifact.
- Backup/restore and rollback plans cover activation, cursors, revisions, review items, suppressions, job/alert state, and an in-flight reconciliation.

## Outcome metrics

| Metric | R5 target | Evidence placeholder |
| --- | --- | --- |
| Synthetic contract gate | 100% of material spike gates pass; otherwise release remains blocked | Not yet provided |
| Prospective eligibility | 100% of before/equal/after, exact-tag, and late-tag fixtures produce the specified result | Not yet provided |
| Replay safety | Zero duplicate Source Item or Source Revision across repeated/out-of-order fixtures | Not yet provided |
| Partial-list safety | Zero deletion or absence inference after interrupted/failed pagination | Not yet provided |
| Suppression integrity | Zero resurrection while Source Suppression exists, including after restart and restore | Not yet provided |
| Alert privacy | Zero private content or identifier in alert/log fixtures | Not yet provided |
| Restore fidelity | Restored activation, cursors, revisions, status, review, and suppression equal the pre-backup fixture | Not yet provided |

## Privacy and security

- Synthetic fixtures are mandatory for the integration spike; no personal journal proves a contract.
- Runtime authorization material and account identifiers never enter source, docs, issues, screenshots, logs, exports, or browser code.
- Callback payloads are untrusted wake signals and are excluded from source truth and logs.
- Retrieved transcript is encrypted and local; no R5 requirement sends it to an AI provider.
- Alerts are operational only and contain no private content or identifying upstream details.

## Accessibility

Integration status, activation boundary, reconciliation state, Needs Date Review, revision/upstream status, suppression, destructive confirmation, alert history, and failure recovery must be keyboard operable, screen-reader labeled, focus managed, responsive, zoom-safe, and understandable without color or motion. Exact dates and statuses must use unambiguous text.

## Recovery and rollback

R5 adds Integration Activation, authorization-health metadata without secrets, reconciliation cursors/pages, opaque source/revision identity, Voice Journal source/revision records, upstream lifecycle status, Needs Date Review state, Source Suppression, and job/alert evidence. Exit requires encrypted backup and executed restore of these relationships.

Rollback must stop callbacks/reconciliation safely, preserve already accepted local sources and suppression intent, and avoid duplicate import when the version changes again. Evidence must cover in-flight reconciliation, cursor compatibility or reset, callback disabling, schema/data restoration, and post-rollback access to R0–R4 data.

## Release entry criteria

- R4 exit criteria and proceed record exist.
- The synthetic integration spike has passed every material gate and records no unresolved critical contract gap.
- Provider access/authorization and privacy boundaries have explicit authority at the moment needed; credentials are not pre-collected into artifacts.
- Design and architecture cover activation, reconciliation, lifecycle, suppression, alerts, failure, recovery, and rollback.
- Synthetic eligibility, replay, pagination, lifecycle, suppression, backup/restore, and rollback fixtures exist.

## Release exit criteria

- Every included requirement has executed requirement-level evidence or an explicit no-go.
- Synthetic contract, activation boundary, exact tag, date/review, wake/retrieval separation, replay, pagination, upstream lifecycle, suppression, alert, restart, backup, restore, and rollback fixtures have the specified outcomes.
- A pre-activation item does not import automatically, and no partial listing creates deletion.
- No unresolved severity-1 or severity-2 defect remains, and the decision record says proceed, hold, or roll back.

## No-go criteria

- Any material synthetic spike gate is failed, ambiguous, or requires personal content to prove.
- Webhook payload is treated as authoritative transcript or an incomplete list as deletion evidence.
- Eligibility can use a fuzzy tag, backdated activation, webhook time, or pre-activation note.
- Reconciliation duplicates, silently deletes, or resurrects a suppressed local item.
- Secrets, transcripts, tags, upstream identifiers, or private dates appear in logs, alerts, docs, or evidence.
- Backup/restore or rollback cannot preserve activation, revisions, cursor, review, and suppression intent.

## Explicit non-goals

- Historical/backfill import, fuzzy tag matching, or automatic import of pre-activation notes.
- Editing, tagging, or deleting content in the upstream service.
- Using webhook payload text as source truth.
- AI text/artwork, semantic search, image recognition, reminders, coaching, streaks, or social behavior.
- Multi-user access, public links, native apps, offline-first behavior, or object-store transition.

## Evidence register

| Evidence | Expected artifact | Status |
| --- | --- | --- |
| Requirement traceability | R5 requirement-to-scenario checklist | Not yet provided |
| Synthetic integration spike | Identity, retrieval, auth renewal, tag/date/transcript, pagination, reconciliation, and failure report | Not yet provided |
| Design review | Activation, health, review, lifecycle, suppression, alert, failure, and accessibility review | Not yet provided |
| Architecture decision | Callback, authorization, retrieval, identity, cursor, activation, lifecycle, recovery, and rollback records | Not yet provided |
| Functional test report | Eligibility, replay, pagination, lifecycle, suppression, and restart results | Not yet provided |
| Privacy/security report | Credential, callback, log, alert, and evidence-data review | Not yet provided |
| Backup/restore report | R5 data-shape snapshot, restore, and relationship comparison | Not yet provided |
| Rollback report | Callback/job stop, cursor compatibility, schema/data, and prior-archive access results | Not yet provided |
| Owner acceptance | Prospective-sync walkthrough and proceed, hold, or rollback decision | Not yet provided |

## Evidence boundary

Naming an integration or describing its intended contract is not provider evidence. R5 remains planning-only until the synthetic contract and every release gate have dated executed evidence.
