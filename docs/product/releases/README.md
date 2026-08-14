# Life in Days release documents

This directory decomposes the [governing product requirements](../PRODUCT-REQUIREMENTS.md) into ten proposed release PRDs and one conditional transition PID.

All dates are planning estimates, not commitments. Evidence gates control entry and exit. These documents describe intent; they do not prove approval, implementation, testing, deployment, production use, recovery, or release acceptance.

| Milestone | Proposed planning range | Intended independently usable outcome | Document |
| --- | --- | --- | --- |
| R0 | 2026-08-17 to 2026-08-28 | Synthetic-only private foundation with access, health, recovery, coexistence, and rollback evidence | [Shared-Host Private Foundation](PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md) |
| R1 | 2026-08-31 to 2026-09-18 | First memory-creating release: explicit-date text archive with Calendar and Journal Day | [Manual Journal Archive](PRD-R1-MANUAL-JOURNAL-ARCHIVE.md) |
| R2 | 2026-09-21 to 2026-10-09 | Authorized durable photo capture, review-safe dating, gallery, cover, and derivatives | [Telegram Photo Capture](PRD-R2-TELEGRAM-PHOTO-CAPTURE.md) |
| R3 | 2026-10-12 to 2026-10-30 | Cross-month Timeline, deterministic private Search, review resolution, and atomic redating | [Retrieval and Date Integrity](PRD-R3-RETRIEVAL-DATE-INTEGRITY.md) |
| R4 | 2026-11-02 to 2026-11-20 | Corrections, conflicts, history, Trash, suppressions, and validated restorable export | [Source History and Lifecycle Safety](PRD-R4-SOURCE-HISTORY-LIFECYCLE.md) |
| R5 | 2026-11-23 to 2026-12-11 | Spike-gated prospective VoiceNotes retrieval and replay-safe reconciliation | [Prospective VoiceNotes Sync](PRD-R5-PROSPECTIVE-VOICENOTES-SYNC.md) |
| R6 | 2026-12-14 to 2027-01-08 | Optional evaluated generated text with privacy, protection, provenance, and budget controls | [Generated Text Reflection](PRD-R6-GENERATED-TEXT-REFLECTION.md) |
| R7 | 2027-01-11 to 2027-01-29 | Optional evaluated symbolic artwork with versions, safety, suppression, and real-photo precedence | [Generated Artwork](PRD-R7-GENERATED-ARTWORK.md) |
| R8 | 2027-02-01 to 2027-02-19 | Integrated capacity, health, fault, recovery, browser, accessibility, and rollback evidence | [Operational Scale and Resilience](PRD-R8-OPERATIONAL-SCALE-RESILIENCE.md) |
| R9 | 2027-02-22 to 2027-03-12 | Owner launch acceptance and stabilization without new feature scope | [Private Launch Acceptance and Stabilization](PRD-R9-PRIVATE-LAUNCH-ACCEPTANCE.md) |
| R10 | Blank; approved watermark trigger only | Reversible encrypted-media transition after inventory, recovery, observation, and rollback gates | [Conditional Object-Store Transition](PID-R10-OBJECT-STORE-TRANSITION.md) |

## Release-wide rules

- R0 may use only synthetic fixtures. R1 is the first release allowed to create an authentic owner memory.
- Every release must remain independently rollbackable.
- Every release that introduces a data shape must add encrypted backup and executed restore evidence for that shape.
- No real-photo bytes or photo-derived data may enter an AI request.
- R9 integrates all 71 P0 requirements. The seven deferred requirements remain outside R0–R9.
- LID-OPS-007 transition execution remains conditional. R9 accepts pre-trigger readiness; R10 executes only after an approved measured watermark.
- A blank evidence placeholder means evidence does not yet exist. It never authorizes a Done, deployed, production, or accepted claim.

## Governing links

- [Product Manager review](../../council/PRODUCT-MANAGER-REVIEW.md)
- [Phase 1 release plan](../../project/PHASE1-RELEASE-PLAN.md)
- [Phase 1 roadmap manifest](../../project/PHASE1-ROADMAP-MANIFEST.json)
- [Phase 1 implementation plan](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [UX specification](../../design/UX-SPECIFICATION.md)
- [Prototype v5 feature audit](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md)

The roadmap manifest governs published task status and milestone metadata. Document creation alone does not complete an implementation or release task.
