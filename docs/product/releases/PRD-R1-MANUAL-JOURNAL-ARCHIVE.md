# PRD R1 — Manual Journal Archive

## Document control

| Field | Value |
| --- | --- |
| Release | R1 — Manual Journal Archive |
| Document type | Product requirements document |
| Status | Council-reviewed planning baseline; not an implementation, deployment, or release-acceptance record |
| Accountable role | Product owner |
| Proposed start | 2026-08-31 |
| Proposed target | 2026-09-18 |
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

Prototype v5 demonstrates interaction intent with in-memory samples. It is not persistence, privacy, recovery, or release evidence.

## Problem and intended outcome

The owner needs the smallest trustworthy way to create and revisit an authentic memory without depending on an external integration. R1 is the first release allowed to create real memory content. It establishes explicit Journal Date semantics, source/derived separation, durable text-file preservation, duplicate choice, an image-first Calendar, and a readable Journal Day.

The intended outcome is independently useful: the owner can upload one or more UTF-8 text or Markdown files to an explicit date, preserve each original separately, and revisit that date after restart, backup, restore, and export validation.

## Scope and requirement boundary

**Included requirement IDs (11):** LID-SCP-002, LID-SCP-003, LID-UP-001, LID-UP-002, LID-UP-003, LID-REF-001, LID-REF-004, LID-REF-005, LID-REF-006, LID-OPS-011, LID-OPS-018.

**Excluded requirement IDs (67):** LID-SCP-001, LID-SCP-004, LID-TG-001, LID-TG-002, LID-TG-003, LID-TG-004, LID-TG-005, LID-TG-006, LID-TG-007, LID-TG-008, LID-TG-009, LID-TG-010, LID-VN-001, LID-VN-002, LID-VN-003, LID-VN-004, LID-VN-005, LID-VN-006, LID-VN-007, LID-UP-004, LID-SRC-001, LID-SRC-002, LID-SRC-003, LID-SRC-004, LID-REF-002, LID-REF-003, LID-REF-007, LID-AIT-001, LID-AIT-002, LID-AIT-003, LID-AIT-004, LID-AIT-005, LID-AIT-006, LID-AIT-007, LID-AIA-001, LID-AIA-002, LID-AIA-003, LID-AIA-004, LID-AIA-005, LID-AIA-006, LID-AIA-007, LID-AIA-008, LID-AIA-009, LID-AIA-010, LID-AIA-011, LID-OPS-001, LID-OPS-002, LID-OPS-003, LID-OPS-004, LID-OPS-005, LID-OPS-006, LID-OPS-007, LID-OPS-008, LID-OPS-009, LID-OPS-010, LID-OPS-012, LID-OPS-013, LID-OPS-014, LID-OPS-015, LID-OPS-016, LID-OPS-017, LID-DEF-001, LID-DEF-002, LID-DEF-003, LID-DEF-004, LID-DEF-005, LID-DEF-006.

Excluded means not newly owned by R1. The accepted R0 boundary remains an inherited regression gate, including LID-SCP-001, LID-OPS-001, LID-OPS-003, LID-OPS-004, LID-OPS-008, LID-OPS-014, LID-OPS-016, and LID-OPS-018.

## Owner scenarios

1. From a Journal Day, the owner uploads a valid text or Markdown file and the date is inherited from the selected day.
2. From the global upload action, the owner must choose an explicit valid Journal Date before submission.
3. A second file for the same day remains a separate source with its own filename, bytes, timestamp, and checksum.
4. An exact duplicate presents a warning; dismissing creates nothing, while Add Anyway creates a distinct reference without overwriting either source.
5. The owner moves between months, selects a populated Calendar date, and reads authentic source content with clear origin and timestamp labels.
6. The owner repeats the flow on supported desktop and phone browsers using keyboard, touch, zoom, light/dark themes, and reduced motion.

## Functional acceptance

- LID-SCP-002: Journal Dates are fixed to Asia/Kolkata; boundary fixtures around local midnight are unambiguous; Original Timestamp remains immutable; future Journal Dates are rejected.
- LID-SCP-003: Uploaded Journals are Source Items; future titles, summaries, tags, briefs, or artwork use separate derived records and cannot overwrite or masquerade as source content.
- LID-UP-001: global and day-specific entry points accept only UTF-8 .txt and .md files up to 1 MiB; invalid encoding, extension, size, missing date, or future date fails without partial data.
- LID-UP-002: every accepted file preserves its original bytes, filename, receipt timestamp, checksum, chosen Journal Date, and separate source identity through display, export fixture, and restore.
- LID-UP-003: duplicate detection is checksum based; dismissing the warning writes nothing; Add Anyway creates a distinct idempotent reference; concurrent submission never overwrites an existing source.
- LID-REF-001: the Calendar is Monday-first with en-IN dates, supports cross-month keyboard and touch navigation, and leaves dates without live sources visually empty.
- LID-REF-004: Journal Day shows authentic sources chronologically, labels origin and timestamps, preserves readable source content during optional derived-feature absence, and exposes available upload/status controls.
- LID-REF-005: warm light and deep-ink dark themes meet contrast targets; state never depends on motion; browser zoom and large text do not hide content or actions.
- LID-REF-006: core R1 flows work in the current two major versions of Chrome, Edge, Firefox, and Safari plus current iOS Safari and Android Chrome, with semantic labels, visible focus, responsive layout, and keyboard access.
- LID-OPS-011: the new text-source, checksum, date, and index shape is included in encrypted backup and an executed restore with byte/checksum comparison.
- LID-OPS-018: restart and dependency failure do not silently lose an accepted upload; the archive states its best-effort single-host availability honestly.

## Nonfunctional acceptance

- Accepted-file source bytes are byte-identical after ingestion, export fixture generation, backup, and restore.
- Date storage and display use one documented timezone contract with repeatable midnight-boundary tests.
- Submission is atomic: a rejected or interrupted upload leaves no partial source, checksum reference, calendar cell, or search/index residue.
- Personal HTML, API, file, and download responses inherit the R0 private, no-store boundary.
- No journal text or filename appears in logs, metrics, third-party analytics, or test reports.
- Theme, responsive, browser, keyboard, screen-reader, focus, contrast, zoom, and reduced-motion checks are release-blocking for the R1 surfaces.

## Design contract

R1 design covers empty and populated Calendar states, month navigation, date selection, full Journal Day, source chronology, origin/timestamp labeling, global and day-level upload, validation, upload progress, duplicate warning, Add Anyway, interrupted upload, restart recovery, and responsive/theme/accessibility variants.

The [UX specification](../../design/UX-SPECIFICATION.md) is normative. [Prototype v5](../../../prototypes/calendar-ui/index-v5.html) is a starting interaction reference for Calendar, Journal Day, upload, themes, and responsive behavior; its sample data, in-memory mutation, and incomplete exceptional states must not be treated as accepted design or implementation.

## Architecture and dependency gates

- R0 has an evidence-backed proceed decision; its access, encryption, delivery, logging, health, backup, restore, coexistence, and rollback controls remain intact.
- Domain decisions define Journal Day, Source Item, Original Timestamp, Journal Date, uploaded-file identity, checksum duplicate semantics, and source/derived separation.
- Storage and transaction decisions cover original bytes, metadata, checksum uniqueness, explicit Add Anyway, interrupted uploads, migrations, indexes, backup manifests, and restores.
- Design review covers all R1 empty, loading, validation, duplicate, error, responsive, theme, and accessibility states.
- Authentic owner content is admitted only after R1 entry is explicitly authorized; synthetic fixtures remain the default for engineering and validation.

## Outcome metrics

| Metric | R1 target | Evidence placeholder |
| --- | --- | --- |
| Accepted capture fidelity | 100% of accepted fixtures preserve exact bytes, filename, checksum, date, timestamp, and source identity | Not yet provided |
| Rejection atomicity | 100% of invalid/interrupted fixtures leave no partial source or visible day | Not yet provided |
| Date correctness | 100% of timezone, midnight, explicit-date, and future-date fixtures produce the specified result | Not yet provided |
| Duplicate handling | Zero silent overwrite; each Add Anyway fixture creates one distinct reference | Not yet provided |
| Recall | Owner can reopen each accepted fixture from Calendar and Journal Day after restart | Not yet provided |
| Restore fidelity | 100% of selected R1 source bytes and relationships match after restore | Not yet provided |
| Accessibility/browser | No blocking issue across the required R1 browser and assistive-flow matrix | Not yet provided |

## Privacy and security

- R1 remains a one-user private archive with no share, public link, anonymous route, or second password store.
- Authentic files are application-encrypted at rest and delivered only through authenticated private, no-store responses.
- Source text, filenames, dates, checksums, and timestamps are personal data. They must not appear in logs, analytics, public caches, issue text, or evidence samples.
- Only owner-approved sanitized or synthetic fixtures may be retained in release evidence.
- R1 introduces no AI request and sends no journal content to a model provider.

## Accessibility

Upload controls, date controls, validation, duplicate choice, Calendar navigation, date identity, source headings, and status messages must be keyboard operable and screen-reader named. The Calendar must expose date and populated/empty identity without relying on imagery. Both themes must meet WCAG 2.2 AA contrast targets; layout remains usable at zoom and on supported phone widths; reduced motion removes nonessential animation.

## Recovery and rollback

R1 introduces real-memory data shapes: Uploaded Journal source bytes, source metadata, checksums, explicit Journal Dates, Journal Day relationships, and any derived indexes needed for Calendar/detail. Exit requires an encrypted backup and executed restore that compares original bytes, metadata, checksums, dates, and display relationships.

Rollback must restore the prior application version without losing accepted R1 source truth. If the prior version cannot read the new schema safely, the release must provide a verified forward-compatible rollback path or a pre-change snapshot restore with a documented write freeze and reconciliation. A successful code rollback without data-shape evidence is insufficient.

## Release entry criteria

- R0 exit criteria and proceed record exist.
- The owner has explicitly authorized the first authentic-memory release and approved any authentic acceptance fixture.
- Journal Date, Original Timestamp, source/derived, file preservation, duplicate, and transaction decisions are reviewable.
- R1 design and accessibility states have no unresolved critical ambiguity.
- Backup/restore and rollback plans name every R1 data shape.

## Release exit criteria

- Every included requirement has executed requirement-level evidence or an explicit no-go.
- A single owner-approved text fixture completes upload, restart, Calendar/detail recall, encrypted backup, restore, and export/checksum validation.
- Invalid encoding, extension, size, missing/future date, duplicate dismissal, Add Anyway, concurrency, and interruption fixtures produce the specified atomic result.
- Supported-browser and accessibility checks have no unresolved release-blocking issue.
- No unresolved severity-1 or severity-2 defect remains, and the decision record says proceed, hold, or roll back.

## No-go criteria

- R0 privacy, access, encryption, backup, restore, or rollback evidence has regressed.
- An accepted file is changed, merged, overwritten, misdated, partially persisted, or not recoverable.
- A future or implicit global date is accepted.
- Authentic content appears in logs, analytics, public cache, screenshots, or uncontrolled evidence.
- Rollback cannot preserve or recover the R1 data shape.
- The owner has not authorized authentic-memory use.

## Explicit non-goals

- Blank browser composition, PDF, Word, OCR, or formats other than UTF-8 .txt and .md.
- Telegram photos, VoiceNotes, Monthly Almanac, Search, Corrections, redating, History, Trash, suppressions, or complete export.
- AI-generated text, Visual Briefs, or artwork.
- Sharing, reminders, coaching, social behavior, public access, native apps, offline-first behavior, or legacy-browser support.
- Object-store transition.

## Evidence register

| Evidence | Expected artifact | Status |
| --- | --- | --- |
| Requirement traceability | R1 requirement-to-scenario checklist | Not yet provided |
| Design review | Calendar, Journal Day, upload, duplicate, error, responsive, theme, and accessibility review | Not yet provided |
| Architecture decision | Domain, date, file identity, checksum, transaction, index, migration, and recovery records | Not yet provided |
| Functional test report | Valid, invalid, duplicate, concurrent, interrupted, restart, and recall results | Not yet provided |
| Privacy/security report | Storage, delivery, cache, log, and evidence-data review | Not yet provided |
| Accessibility/browser report | Required desktop/mobile browser and assistive-flow results | Not yet provided |
| Backup/restore report | R1 data-shape snapshot, restore, byte/checksum/date comparison, and elapsed time | Not yet provided |
| Rollback report | Application/schema rollback or snapshot-restore evidence | Not yet provided |
| Owner acceptance | First-memory walkthrough and proceed, hold, or rollback decision | Not yet provided |

## Evidence boundary

This PRD, its links, prototype examples, and planned dates are not proof of a working archive. Only dated executed evidence can support later statements about implementation, testing, deployment, recovery, or acceptance.
