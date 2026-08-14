# PRD R4 — Source History and Lifecycle Safety

## Document control

| Field | Value |
| --- | --- |
| Release | R4 — Source History and Lifecycle Safety |
| Document type | Product requirements document |
| Status | Planning draft; not an approval or release record |
| Accountable role | Product owner |
| Proposed start | 2026-11-02 |
| Proposed target | 2026-11-20 |
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

Prototype conflict and management states are incomplete and in-memory. They do not prove immutable history, lifecycle invariants, export completeness, restore, or deletion.

## Problem and intended outcome

A private archive becomes untrustworthy if a correction rewrites evidence, an upstream edit silently wins, a deleted item reappears, or an export omits lifecycle intent. Before automatic source reconciliation is added, the owner needs visible provenance and reversible management.

R4 intends to make source truth manageable: Corrections remain distinct from immutable Source Revisions; conflicts offer exactly three outcomes; source-set binding distinguishes current, stale, and historical derived artifacts; source-empty days disappear from ordinary reflection; Trash is reversible for 30 days; suppressions preserve intent; and a complete encrypted export can be validated and restored.

## Scope and requirement boundary

**Included requirement IDs (9):** LID-SCP-004, LID-SRC-001, LID-SRC-002, LID-SRC-004, LID-REF-007, LID-OPS-010, LID-OPS-011, LID-OPS-013, LID-OPS-018.

**Excluded requirement IDs (69):** LID-SCP-001, LID-SCP-002, LID-SCP-003, LID-TG-001, LID-TG-002, LID-TG-003, LID-TG-004, LID-TG-005, LID-TG-006, LID-TG-007, LID-TG-008, LID-TG-009, LID-TG-010, LID-VN-001, LID-VN-002, LID-VN-003, LID-VN-004, LID-VN-005, LID-VN-006, LID-VN-007, LID-UP-001, LID-UP-002, LID-UP-003, LID-UP-004, LID-SRC-003, LID-REF-001, LID-REF-002, LID-REF-003, LID-REF-004, LID-REF-005, LID-REF-006, LID-AIT-001, LID-AIT-002, LID-AIT-003, LID-AIT-004, LID-AIT-005, LID-AIT-006, LID-AIT-007, LID-AIA-001, LID-AIA-002, LID-AIA-003, LID-AIA-004, LID-AIA-005, LID-AIA-006, LID-AIA-007, LID-AIA-008, LID-AIA-009, LID-AIA-010, LID-AIA-011, LID-OPS-001, LID-OPS-002, LID-OPS-003, LID-OPS-004, LID-OPS-005, LID-OPS-006, LID-OPS-007, LID-OPS-008, LID-OPS-009, LID-OPS-012, LID-OPS-014, LID-OPS-015, LID-OPS-016, LID-OPS-017, LID-DEF-001, LID-DEF-002, LID-DEF-003, LID-DEF-004, LID-DEF-005, LID-DEF-006.

Excluded means not newly owned by R4. R0–R3 remain inherited regression gates, including authentic source fidelity, photo privacy/reference integrity, atomic redating, retrieval scope, accessibility, recovery, and rollback.

## Owner scenarios

1. The owner corrects displayed journal text while retaining the original source and every source revision.
2. A later upstream revision conflicts with a Correction; the owner sees an accessible diff and chooses exactly one of Keep my Correction, Use source update, or Save source update as suggestion.
3. The owner inspects why a generated artifact is current, stale, or historical based on the exact source revisions bound to it.
4. Deleting the last live source hides the Journal Day from Calendar, Timeline, and default Search while exact-date History remains available.
5. The owner restores an item from 30-day Trash and sees day visibility, cover, retrieval, stale state, and suppression relationships recalculate.
6. Permanent deletion requires explicit confirmation and respects shared Media Asset references and upstream suppression intent.
7. The owner requests an encrypted export, receives a one-time passphrase through the approved non-persistent flow, downloads once, and validates a package containing current, history, Trash, suppressions, originals, checksums, and manifest.

## Functional acceptance

- LID-SRC-001: a Correction changes displayed text or Journal Date without changing original source content or revisions; it records author, time, and base revision; removing it restores the selected source display without deleting history.
- LID-SRC-002: conflict view offers an accessible diff and exactly three distinct outcomes—keep Correction, use source update, or retain source update as suggestion—with idempotent result and no silent merge.
- LID-SRC-004: every derived artifact binds to the exact contributing source revisions; the UI and export distinguish current, stale, and historical artifacts after correction, redating, source update, Trash, restore, or source-set change.
- LID-SCP-004: a day with no live Source Item disappears atomically from ordinary Calendar, Timeline, and default Search while remaining reachable by exact date in management/history.
- LID-REF-007: correction, conflict choice, redating, deletion, restore, permanent deletion, suppression changes, export, and other source-changing/destructive actions explain their effect before confirmation and report actual outcome.
- LID-OPS-010: deletion enters 30-day Trash, removes content from ordinary views/search, and supports restore; permanent live deletion follows reference and suppression rules and cannot reconstruct deleted content through normal export/restore.
- LID-OPS-013: export contains JSON, Markdown, browsable HTML, original sources/photos, generated artifacts when present, revisions, Corrections, checksums, manifest, and clearly separated Trash and suppressions; it passes an import/restore validator.
- LID-OPS-013: encrypted export uses a one-time passphrase that is not persisted; unencrypted export requires explicit warning; server artifacts expire after the defined first-successful-download or time boundary; restart/partial cleanup behavior follows an approved lifecycle decision.
- LID-OPS-011: Corrections, revisions, bindings, conflict suggestions, Trash timestamps, reference state, suppressions, export metadata, and hidden-day state are backed up and restored with relationship checks.
- LID-OPS-018: lifecycle scheduler, export, or upstream failure does not make healthy source browsing/correction unavailable; idempotent jobs resume safely.

## Nonfunctional acceptance

- Source bytes, Original Timestamp, revision order, Correction authorship/time, and source-binding identities remain reconstructable across all scenarios.
- Correction/conflict/delete/restore/export operations are authorized, transactional or recoverably queued, idempotent, and auditable without logging private content.
- Export is portable and implementation-independent enough for a separate validator to verify counts, checksums, references, current/history/Trash partitions, and suppressions.
- No one-time export passphrase, plaintext export, source text, caption, photo, diff, or deleted content appears in logs or durable evidence.
- Lifecycle controls, diff, confirmations, History, Trash, export, and hidden-day states satisfy inherited browser/accessibility behavior.
- Backup retention, not selective snapshot rewriting, governs expiry of already-backed-up deleted ciphertext.

## Design contract

R4 design covers Correction editor, base-revision identity, accessible diff, each of the three conflict outcomes, suggestion review, current/stale/historical labeling, History, source-empty day, Trash list/detail/expiry, restore, permanent deletion, reference-aware messages, Source Suppression and Artwork Suppression distinction, export format choice, privacy warning, one-time passphrase handoff, progress, restart, expiration, cleanup, validation, and failure.

The [UX specification](../../design/UX-SPECIFICATION.md) is normative. [Prototype v5](../../../prototypes/calendar-ui/index-v5.html) offers partial conflict and management direction but does not cover complete History, Trash, suppressions, export lifecycle, durable diff state, or recovery.

## Architecture and dependency gates

- R3 has an evidence-backed proceed decision; date/search atomicity and all existing data-shape recovery remain intact.
- Revision, Correction, suggestion, exact source-set binding, stale/historical status, hidden-day, Trash, permanent-deletion, Media Asset reference, and suppression decisions are reviewable.
- Export-lifecycle design proves passphrase non-persistence, restart behavior, partial-file cleanup, first-successful-download semantics, expiry, and validator contract before implementation.
- Retention and deletion behavior explicitly separates live deletion from encrypted backup retention.
- Backup/restore and rollback plans cover every R4 lifecycle and export relationship, including an interrupted destructive action.

## Outcome metrics

| Metric | R4 target | Evidence placeholder |
| --- | --- | --- |
| Source reconstructability | 100% of selected fixtures reconstruct source, revisions, Corrections, and display choice | Not yet provided |
| Conflict outcomes | All three choices produce their specified distinct result with zero silent merge | Not yet provided |
| Lifecycle integrity | 100% of delete/restore/expiry/permanent-delete fixtures preserve visibility, reference, and suppression invariants | Not yet provided |
| Export completeness | Validator matches expected files, records, partitions, relationships, and checksums | Not yet provided |
| Passphrase/content leakage | Zero passphrase, plaintext content, or deleted content in logs and evidence | Not yet provided |
| Restore fidelity | Restored current/history/Trash/suppression/binding state equals the pre-backup fixture | Not yet provided |
| Accessibility | No blocking issue in diff, management, Trash, and export flows | Not yet provided |

## Privacy and security

- Corrections, diffs, history, Trash, filenames, passphrases, exports, and suppressions are private content and must not enter logs, analytics, issue text, public cache, or uncontrolled evidence.
- Export defaults to the approved encrypted package flow. Any unencrypted option requires an explicit, contextual privacy warning.
- The one-time passphrase is never stored in application data, job state, logs, or documentation.
- Download remains authenticated and private/no-store; expiration and partial-file cleanup are enforceable after restart.
- Permanent live deletion is described honestly: retained encrypted backups expire under backup retention rather than immediate selective erasure.

## Accessibility

Correction and conflict flows must expose source and changed text through semantic, screen-reader-compatible diff structure rather than color alone. Confirmation copy names scope and consequence. History/Trash lists, restored/expired state, export options, warnings, progress, errors, and download controls are keyboard operable, focus managed, responsive, zoom-safe, and meet WCAG 2.2 AA contrast and reduced-motion expectations.

## Recovery and rollback

R4 adds Corrections, source revisions, suggestions, binding versions/status, hidden-day management access, Trash/expiry state, suppression records, permanent-deletion audit state, and export lifecycle records. Exit requires encrypted backup and executed restore/import validation across all relationships and byte checksums.

Rollback must preserve lifecycle intent. It cannot resurrect permanently deleted content, drop a suppression, flatten revisions, select the wrong conflict outcome, or expose a plaintext export. The evidence must cover interrupted correction, delete, restore, expiry, and export jobs plus compatibility or controlled snapshot restoration.

## Release entry criteria

- R3 exit criteria and proceed record exist.
- Lifecycle domain and export-lifecycle decisions are reviewable with no unresolved critical ambiguity.
- Synthetic fixtures cover revisions, Corrections, all three conflicts, source binding, hidden day, shared media reference, Trash, restore, expiry, permanent deletion, suppressions, encrypted/unencrypted export, restart, partial cleanup, validation, backup/restore, and rollback.
- Design review covers complete management, diff, confirmation, accessibility, and failure states.
- The rollback plan proves it cannot resurrect or flatten R4 intent.

## Release exit criteria

- Every included requirement has executed requirement-level evidence or an explicit no-go.
- Three conflict choices, binding/staleness, hidden-day, Trash, restore, expiry, permanent-deletion, suppression, export, validator, restart, backup, restore, and rollback fixtures have their specified outcomes.
- Export and restored archive match expected originals, revisions, Corrections, artifacts, history, Trash, suppressions, references, and checksums.
- No passphrase or private content is present in logs/evidence.
- No unresolved severity-1 or severity-2 defect remains, and the decision record says proceed, hold, or roll back.

## No-go criteria

- A Correction or conflict action rewrites or loses original evidence.
- The system silently merges, overwrites, or selects a conflict outcome.
- Deletion, restore, reference counting, hidden-day visibility, suppression, or permanent deletion can resurrect, orphan, or prematurely destroy content.
- Export omits a required relationship, persists a passphrase, leaves an uncontrolled artifact, or fails independent validation.
- Backup/restore or rollback changes lifecycle intent or source reconstruction.

## Explicit non-goals

- Editing or deleting the upstream service.
- Automatic historical VoiceNotes import.
- Blank browser composition, PDF, Word, OCR, semantic search, image recognition, or conversational search.
- AI text or artwork implementation.
- Immediate deletion from retained encrypted backup snapshots.
- Sharing, public export links, reminders, coaching, multi-user support, or object-store cutover.

## Evidence register

| Evidence | Expected artifact | Status |
| --- | --- | --- |
| Requirement traceability | R4 requirement-to-scenario checklist | Not yet provided |
| Design review | Correction, diff, conflict, History, Trash, suppression, export, error, and accessibility review | Not yet provided |
| Architecture decision | Revision, binding, lifecycle, deletion, export, validator, recovery, and rollback records | Not yet provided |
| Functional test report | Correction, conflict, hidden-day, Trash, restore, expiry, suppression, and export results | Not yet provided |
| Privacy/security report | Passphrase, download, cleanup, log, deletion, and evidence review | Not yet provided |
| Accessibility/browser report | Management/diff/export flows across required clients and assistive checks | Not yet provided |
| Backup/restore report | R4 data-shape restore/import validation and checksum/relationship comparison | Not yet provided |
| Rollback report | Interrupted lifecycle/export and compatibility/snapshot evidence | Not yet provided |
| Owner acceptance | Correct-delete-export-restore walkthrough and proceed, hold, or rollback decision | Not yet provided |

## Evidence boundary

This document specifies lifecycle trust. It does not prove correction safety, deletion, export completeness, restore, deployment, or owner acceptance until the named executed evidence exists.
