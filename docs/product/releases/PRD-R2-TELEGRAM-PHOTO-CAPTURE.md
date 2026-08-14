# PRD R2 — Telegram Photo Capture

## Document control

| Field | Value |
| --- | --- |
| Release | R2 — Telegram Photo Capture |
| Document type | Product requirements document |
| Status | Planning draft; not an approval or release record |
| Accountable role | Product owner |
| Proposed start | 2026-09-21 |
| Proposed target | 2026-10-09 |
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

Prototype photo states are interaction evidence only. They do not prove messaging authorization, durable capture, byte fidelity, media privacy, or recovery.

## Problem and intended outcome

The owner already uses a private messaging habit for photos. The archive needs to accept authorized still images without creating a second capture ritual, while avoiding false acknowledgement, silent misdating, duplicate loss, metadata leakage, premature deletion, or AI exposure.

R2 intends to make private photo capture independently useful: an authorized compressed photo or still-image document becomes a durable Daily Photo, receives an explicit or rule-derived Journal Date, appears in an ordered real-photo gallery, becomes Calendar Cover under the real-photo precedence rule, and survives backup and restore. Invalid or future dates remain recoverable in Needs Date Review rather than silently joining a day.

## Scope and requirement boundary

**Included requirement IDs (15):** LID-TG-001, LID-TG-002, LID-TG-003, LID-TG-004, LID-TG-005, LID-TG-006, LID-TG-007, LID-TG-008, LID-TG-009, LID-TG-010, LID-OPS-005, LID-OPS-009, LID-OPS-011, LID-OPS-015, LID-OPS-018.

**Excluded requirement IDs (63):** LID-SCP-001, LID-SCP-002, LID-SCP-003, LID-SCP-004, LID-VN-001, LID-VN-002, LID-VN-003, LID-VN-004, LID-VN-005, LID-VN-006, LID-VN-007, LID-UP-001, LID-UP-002, LID-UP-003, LID-UP-004, LID-SRC-001, LID-SRC-002, LID-SRC-003, LID-SRC-004, LID-REF-001, LID-REF-002, LID-REF-003, LID-REF-004, LID-REF-005, LID-REF-006, LID-REF-007, LID-AIT-001, LID-AIT-002, LID-AIT-003, LID-AIT-004, LID-AIT-005, LID-AIT-006, LID-AIT-007, LID-AIA-001, LID-AIA-002, LID-AIA-003, LID-AIA-004, LID-AIA-005, LID-AIA-006, LID-AIA-007, LID-AIA-008, LID-AIA-009, LID-AIA-010, LID-AIA-011, LID-OPS-001, LID-OPS-002, LID-OPS-003, LID-OPS-004, LID-OPS-006, LID-OPS-007, LID-OPS-008, LID-OPS-010, LID-OPS-012, LID-OPS-013, LID-OPS-014, LID-OPS-016, LID-OPS-017, LID-DEF-001, LID-DEF-002, LID-DEF-003, LID-DEF-004, LID-DEF-005, LID-DEF-006.

Excluded means not newly owned by R2. Accepted R0–R1 behavior remains an inherited regression gate, especially the private boundary, fixed Journal Date semantics, source separation, Calendar/Journal Day behavior, authenticated delivery, encryption, accessibility, logging, backup/restore, and failure isolation.

## Owner scenarios

1. The owner sends an authorized compressed photo with no date caption and receives success only after encrypted durable capture using the receipt date in Asia/Kolkata.
2. The owner sends an authorized still-image document with an exact supported caption date; original bytes and filename behavior follow the document contract.
3. A media group with one exact caption date becomes one ordered group on that Journal Day.
4. An invalid or future caption date creates a durable Needs Date Review item, gives clear private feedback, and does not place the image into an ordinary day until resolution.
5. Unauthorized sender/chat, unsupported media, oversized content, decompression risk, and interrupted staging fail without durable partial data or private detail leakage.
6. A global checksum duplicate warns; dismissal creates nothing, while Add Anyway creates a distinct Daily Photo reference without duplicating the underlying Media Asset.
7. The owner views, reorders, captions, downloads the byte-preserved Original, and optionally adds a private accessibility description; the real photo is the Calendar Cover.

## Functional acceptance

- LID-TG-001: callback secret, exact sender identity, and exact private-chat identity are all required; channel, group, non-owner, invalid-secret, and missing-secret fixtures fail closed.
- LID-TG-002: compressed-photo and supported still-image-document forms are distinguished and preserve the specified original semantics; unsupported message forms receive clear operational feedback.
- LID-TG-003: content-based type validation, byte/pixel/decode limits, request limits, and safe failure occur before durable admission; extension or declared type alone is insufficient.
- LID-TG-004: success acknowledgement occurs only after encrypted source bytes, metadata, Media Asset, Daily Photo reference, Journal Date or review state, and commit evidence are durable.
- LID-TG-005: absent explicit date uses authorized receipt time in Asia/Kolkata; exact caption date overrides it; a media group applies one valid explicit date consistently and retains original message timestamps.
- LID-TG-006: invalid, ambiguous, or future explicit dates enter durable Needs Date Review with recoverable media; there is no silent fallback; resolution is idempotent.
- LID-TG-007: gallery ordering persists; owner selection persists; while a live Daily Photo exists, a real photo is Calendar Cover.
- LID-TG-008: checksum deduplication is global; duplicate warning identifies the decision without exposing another day; Add Anyway creates one new reference and no ambiguous overwrite.
- LID-TG-009: Photo Caption remains local metadata, is readable with the photo, and can be found by an exact local retrieval fixture; the general Search surface is introduced in R3. Caption data never enters an AI request.
- LID-TG-010: Original bytes remain byte-identical; locally generated derivatives render orientation correctly and contain no EXIF, IPTC, or XMP; derivative failure never substitutes for or changes the Original.
- LID-OPS-005: staging is bounded and non-authoritative, with constrained decoding, interruption cleanup, and no plaintext residue after the documented cleanup window.
- LID-OPS-009: Media Asset reference changes are transactional for duplicates, Add Anyway, failure cleanup, and day relationships; a live or recoverable reference prevents physical deletion.
- LID-OPS-011: Originals, derivatives or reproducible derivative metadata, Daily Photo references, gallery order, captions, review state, and Media Assets are included in backup and executed restore evidence.
- LID-OPS-015: only repeated ingestion failures and recovery transitions produce deduplicated operational alerts; messages contain no caption, photo, date detail, secret, or signed URL.
- LID-OPS-018: messaging, decoding, thumbnail, or alert failure cannot make healthy journals unreadable or silently lose an acknowledged capture.

## Nonfunctional acceptance

- Every accepted acknowledgement maps to one durable, provenance-bound capture result or to an explicit review state; no acknowledged input is silently lost, overwritten, or misdated.
- Original checksums remain stable through capture, download, backup, restore, and rollback.
- Callback requests and staging have explicit size, rate, time, pixel, memory, and concurrency bounds documented by architecture evidence.
- Media, captions, identifiers, and derived image data are absent from AI serialization, logs, analytics, alerts, public caches, and evidence fixtures.
- Gallery, review, duplicate, caption, download, failure, and cover controls meet inherited responsive/browser/accessibility behavior, including owner-authored private alternative text.
- Photo writes and references are storage-neutral even though R2 does not execute an object-store cutover.

## Design contract

R2 design covers authorized success, delayed commit, invalid secret/sender/chat, unsupported form, oversize/type/decode failure, media-group date handling, Needs Date Review, review resolution, duplicate warning, Add Anyway, gallery ordering, real-photo cover, Original download, caption, private accessibility description, thumbnail failure, repeated-failure alert, restart, and restore states.

The [UX specification](../../design/UX-SPECIFICATION.md) governs these states. [Prototype v5](../../../prototypes/calendar-ui/index-v5.html) provides gallery and cover direction but not messaging conversation states, Needs Date Review, durable failure behavior, media management completeness, or privacy proof.

## Architecture and dependency gates

- R1 has an evidence-backed proceed decision and its authentic source, date, Calendar/detail, backup/restore, and rollback contracts remain intact.
- Callback authorization, safe decoding, bounded staging, encrypted media, storage-neutral Media Asset identity, duplicate references, gallery/cover invariants, and derivative pipelines have reviewable decisions.
- The object-store transition remains conditional and out of R2; storage abstraction must not require that transition.
- Privacy-contract tests can prove that all photo bytes, thumbnails, metadata, identifiers, captions, accessibility descriptions, and derived descriptions are excluded from AI request types.
- Backup, restore, and rollback plans name each R2 media and reference shape before authentic capture is enabled.

## Outcome metrics

| Metric | R2 target | Evidence placeholder |
| --- | --- | --- |
| Durable acknowledgement | 100% of success acknowledgements map to a committed encrypted capture or review item | Not yet provided |
| Authorization | 100% of unauthorized secret/sender/chat fixtures fail closed | Not yet provided |
| Date integrity | 100% of receipt, exact-date, media-group, invalid, and future fixtures follow the specified state | Not yet provided |
| Original fidelity | 100% of selected Originals retain byte-identical checksums after restore | Not yet provided |
| Derivative privacy | Zero forbidden metadata fields in inspected derivatives | Not yet provided |
| AI exclusion | Zero photo, caption, identifier, accessibility-description, or photo-derived fields in typed AI serialization fixtures | Not yet provided |
| Reference integrity | Zero dangling reference, duplicate asset write, or premature physical deletion in concurrency fixtures | Not yet provided |

## Privacy and security

- Real photos and every derivative of them are categorically excluded from AI requests. The exclusion also covers metadata, identifiers, captions, filenames, checksums, and owner-authored accessibility descriptions.
- Callback authentication is independent from human access and validates the exact secret, sender, and private chat.
- Originals, derivatives, captions, and references are application-encrypted at rest and delivered only through authenticated private, no-store routes.
- Staging and decoding are bounded; plaintext residue, decompression abuse, malformed input, and interrupted cleanup have explicit tests.
- Operational alerts, logs, issue text, screenshots, and release evidence use synthetic or redacted data only.

## Accessibility

Photo tiles and controls need stable accessible names independent of visual recognition. Owner-authored private descriptions, when present, become the image alternative and remain local/exported; they are never AI-generated. Gallery order, cover state, duplicate decision, review state, caption, download, and error feedback must be keyboard operable, screen-reader announced, focus visible, touch accessible, and understandable without color or motion.

## Recovery and rollback

R2 adds encrypted Originals, derivative records, Media Assets, Daily Photo references, gallery order, cover state, Photo Captions, private accessibility descriptions, Needs Date Review entries, ingestion evidence, and alert state. Exit requires an encrypted backup and executed restore that validates bytes, checksums, relationships, order, cover, captions, review items, and duplicate references.

Rollback must be independently executable. It must not strand an acknowledged capture or cause an older version to delete an unknown media shape. The rollback evidence must cover write freeze or compatibility behavior, staged-file cleanup, schema/data restoration, media reference reconciliation, and post-rollback access to the R1 archive.

## Release entry criteria

- R1 exit criteria and proceed record exist.
- Callback, staging, decoder, encryption, Media Asset/reference, derivative, duplicate, cover, and storage-neutral interface decisions are reviewable.
- All photo/review/duplicate/error/accessibility design states are specified.
- Synthetic authorization, date, album, duplicate, invalid-media, privacy, backup/restore, and rollback fixtures exist.
- Authentic messaging credentials or owner photos are not required for pre-entry validation.

## Release exit criteria

- Every included requirement has executed requirement-level evidence or an explicit no-go.
- Authorization, compressed/document forms, invalid media, receipt/exact/future date, album, duplicate, gallery, cover, caption, Original, derivative, alert, restart, backup, restore, and rollback fixtures have the specified results.
- Typed AI request tests contain no real-photo or derived photo data.
- The selected restored media checksums and all reference relationships match.
- No unresolved severity-1 or severity-2 defect remains, and the decision record says proceed, hold, or roll back.

## No-go criteria

- Success is acknowledged before durable encrypted commit.
- Unauthorized input creates data or reveals a private fact.
- Invalid/future dates silently fall back to another day.
- An Original changes, a derivative retains source metadata, or photo-related data enters AI, logs, alerts, public cache, or uncontrolled evidence.
- Duplicate/reference behavior can overwrite, dangle, or prematurely delete media.
- Backup/restore or rollback cannot preserve the R2 media shape and the prior text archive.

## Explicit non-goals

- VoiceNotes.
- Cross-month Timeline, general Search UI, Corrections, redating, History, Trash, suppressions, and complete export.
- AI text analysis, image analysis, photo description, generated artwork, or provider fallback.
- Video, audio, RAW, OCR, PDF, Word, or unsupported image formats.
- Sharing, reminders, coaching, public media URLs, direct bucket access, or object-store cutover.

## Evidence register

| Evidence | Expected artifact | Status |
| --- | --- | --- |
| Requirement traceability | R2 requirement-to-scenario checklist | Not yet provided |
| Design review | Messaging, review, duplicate, gallery, media management, error, and accessibility review | Not yet provided |
| Architecture decision | Callback, staging, decoder, media identity, encryption, derivative, reference, and storage-interface records | Not yet provided |
| Functional test report | Authorization, form, validation, date, album, duplicate, gallery, cover, caption, and Original results | Not yet provided |
| Privacy/security report | Threat review, staged-residue check, derivative metadata check, cache/log/alert review, and typed AI exclusion | Not yet provided |
| Accessibility/browser report | Photo/review/management flows across required clients and assistive checks | Not yet provided |
| Backup/restore report | Media-shape snapshot, restore, checksums, references, order, cover, and review state | Not yet provided |
| Rollback report | Compatibility/write-freeze, schema/media reconciliation, cleanup, and R1 access results | Not yet provided |
| Owner acceptance | Capture-to-recall walkthrough and proceed, hold, or rollback decision | Not yet provided |

## Evidence boundary

This PRD and its designs are specifications. No photo-capture, privacy, durability, recovery, deployment, or acceptance claim is valid until the named executed evidence exists.
