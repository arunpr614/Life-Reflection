# Life in Days — proposed shared understanding

Updated: 2026-08-13

Status: the decision frontier is empty. This document awaits Arun's explicit confirmation and is not yet authorization to run paid evaluations, implement, configure providers, collect secrets, or deploy.

## Product promise

Life in Days is a private, single-user visual memory archive at `life.arunp.in`. It effortlessly joins Arun's existing textual VoiceNotes journals and Telegram photos into trustworthy Journal Days for calendar-based revisiting and reflection. MVP is not a writing coach, social product, reminder system, or historical-import tool.

## Authentic record

- One Journal Day represents one date in fixed `Asia/Kolkata` time.
- Voice Journals, Uploaded Journals, and Daily Photos remain separate authentic Source Items with immutable original timestamps.
- Corrections, Journal Date changes, upstream revisions, conflicts, Trash, and suppressions are explicit and auditable. Personal text is never silently merged or overwritten.
- Titles, summaries, tags, Visual Briefs, and Generated Artwork are versioned Derived Artifacts, never source truth.
- Real Daily Photos always control the Calendar Cover when present. Generated Artwork is visibly labeled and can cover only a day without a real photo.

## Capture

- VoiceNotes webhooks wake reconciliation; the official MCP interface is the proposed authority for exact-tag, creation-time, and transcript retrieval. Only exact tag `life-in-days` and notes created at or after Integration Activation are automatically eligible.
- Telegram is the only MVP photo-capture surface. One configured numeric user in one private chat is allowed, with Telegram's webhook secret as a second check.
- Telegram receipt time supplies the default Journal Date; a leading `YYYY-MM-DD` explicitly backdates. Invalid or future dates enter Needs Date Review without losing the photo.
- JPEG, PNG, WebP, HEIC, and HEIF still images are accepted within the approved byte, pixel, and dimension limits. Exact received bytes are preserved; privacy-safe thumbnails are created locally.
- `.txt` and `.md` journal upload is the manual journal path. Blank browser composition, PDF, Word, and OCR import are deferred.

## Reflection experience

- MVP surfaces are an image-first month calendar, chronological timeline, exact lexical search, and Journal Day detail.
- Journal Day detail presents the real-photo gallery, labeled artwork, editable generated title/summary/tags, complete source journals, timestamps, provenance, upload controls, history, and management actions.
- Search covers current displayed journal text, titles, summaries, tags, and Photo Captions. Trash and superseded revisions require **Include history**.
- The experience uses a warm paper-like light theme, deep-ink dark theme, restrained typography and motion, Monday-first `en-IN` dates, responsive layouts, keyboard access, reduced-motion support, and WCAG 2.2 AA contrast targets.

## AI behavior

- Text Provider and Artwork Provider are independent settings; no silent provider or model fallback is allowed.
- Real photos and all photo-derived data never enter AI requests. The Text Provider receives only the approved journal text needed for its task; the Artwork Provider receives only a read-only 150–300-token Visual Brief.
- Automatic title, summary, tags, and Visual Brief generation waits for a 15-minute Source Quiet Period. Untouched fields may refresh; edited or explicitly accepted fields are protected and only receive reviewable replacement suggestions.
- **Generate artwork now** appears as soon as sufficient journal text exists, so Arun need not wait for 01:00. Manual generation requires at least five meaningful words and warns below twenty.
- The 01:00 Artwork Sweep repairs eligible post-activation days with at least twenty meaningful words, no real photo, no current artwork, and no Artwork Suppression.
- Artwork is warm, painterly, symbolic, non-photorealistic, and avoids recognizable likenesses. Every regeneration creates a retained version.
- The monthly production AI ceiling is $5 total, with $0.50 reserved for text and at most $4.50 for artwork. No manual action bypasses it.

## Privacy, recovery, and operations

- The human site uses Cloudflare Access with Arun's exact Cloudflare account membership, MFA, and a seven-day session. Machine callbacks use separate `life-hooks.arunp.in` paths.
- Journal data and media use application-controlled encryption at rest. This is not represented as end-to-end or zero-knowledge encryption.
- Live media starts on the existing Hetzner root disk under the root-resident quota and migrates to private Cloudflare R2 Standard in the EU jurisdiction. Independent encrypted Restic recovery remains in Backblaze B2 EU Central.
- Backup retention is 48 hourly, 30 daily, and 12 monthly snapshots, with monthly sampled restores and quarterly full recovery drills.
- Launch is blocked until the Recovery Ceremony proves two independent off-server key copies and a successful representative restore/decrypt operation.
- The default portable export is a one-time-passphrase AES-256 ZIP containing current content, source files, media, revisions, Trash, suppressions, checksums, and a manifest. Permanently deleted content is not reconstructed.
- There is no third-party product analytics or crash reporting in MVP. Sanitized local operational logs exclude all personal content and secrets.
- MVP is best-effort on one existing Hetzner server; no high-availability or SLA claim is made.

## Deliberately deferred

- Historical automatic VoiceNotes import
- AI coaching, reminders, streaks, weekly reports, and On This Day
- Sharing, public links, and multiple users
- Native apps, offline mode, maps, and media-wall/year-mosaic views
- Semantic or conversational journal search
- Browser journal composition, PDF/Word/OCR ingestion, and PDF books
- Additional VoiceNotes tags, fuzzy matching, and immutable ransomware-resistant exports

## Post-confirmation gates

1. Record the no-additional-cost encryption/key architecture decision.
2. Run the VoiceNotes synthetic integration spike; reopen the affected decision branch if its assumptions fail.
3. Run the approved synthetic AI evaluations within the separate one-time $15 ceiling; no personal journals or photos are used.
4. Present hard-gate failures or required model-choice exceptions to Arun; never ship a failing model to satisfy provider coverage.
5. Only after the applicable design gates pass, begin MVP implementation. Request each fresh runtime-only credential only when an approved evaluation or integration step needs it; never place credentials in documentation or source control.
6. Keep deployment separately authorization-gated, then complete backup/restore, access-control, privacy-boundary, budget, and Recovery Ceremony gates before launch.
