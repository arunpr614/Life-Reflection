# Requirements under discovery

Updated: 2026-08-12 after grilling round 3 and independent research-report QA

Status: partially decided. No implementation is authorized until the interview frontier is empty and Arun confirms shared understanding.

## Decided

### Product and audience

- Working name: **Life in Days**.
- Planned hostname: `life.arunp.in`.
- The first release is a trustworthy visual memory archive, not an AI coach.
- Its core outcome is effortless capture of existing textual voice journals and daily photos, followed by calendar-based revisiting and reflection.
- It is strictly single-user and private: no sharing and no public journal links.

### Daily model and provenance

- One Journal Day represents one calendar date in `Asia/Kolkata`.
- A Journal Day aggregates multiple Source Items while preserving each one separately.
- AI-created titles, summaries, tags, and artwork are separate Derived Artifacts.
- Original source timestamps remain retained even if Arun changes an item's Journal Date.
- Arun can correct content, change the Journal Date of a journal or photo, and delete items through the web experience.
- Every upstream version remains a Source Revision. A web Correction changes the displayed text or Journal Date without rewriting the source or VoiceNotes.
- An upstream VoiceNotes edit creates a Source Revision. If a local Correction also exists, the application flags a conflict rather than silently choosing one.
- Untagging or deleting an imported VoiceNotes source marks its upstream status but never silently erases the local memory.

### Capture surfaces

- Telegram is the initial photo-capture surface.
- Telegram accepts both compressed photo messages and image documents. The application preserves the exact received bytes and must explain that Telegram may compress ordinary photo messages.
- There is no product-level daily photo-count limit. The first Daily Photo is the default Calendar Cover, all Daily Photos appear chronologically, and Arun can reorder them and choose another real-photo cover.
- Original received images remain private and unchanged. Web thumbnails are generated locally with EXIF removed.
- A Telegram photo initially belongs to the Journal Date derived from its receipt time in `Asia/Kolkata`. A caption beginning with `YYYY-MM-DD` explicitly assigns that photo, or its media group, to the supplied Journal Date.
- The bot acknowledges durable capture with the assigned Journal Date and a link to change it.
- The bot does not automatically delete successfully imported Telegram messages in MVP.
- Automatic long-form journals come from VoiceNotes.
- The approved integration hypothesis is: use the VoiceNotes webhook as a wake-up signal, then use the official MCP interface for authoritative tag, date, and transcript retrieval.
- A synthetic integration spike must prove the webhook/MCP identity and unattended authorization assumptions before the integration contract is frozen.
- Only the exact `life-in-days` VoiceNotes tag is eligible in MVP. Matching is exact rather than fuzzy; support for additional configured exact tags is deferred.
- Integration Activation is recorded once the integration is enabled. Automatic import accepts only VoiceNotes notes whose creation timestamp is at or after that instant.
- Editing or tagging a note created before Integration Activation never causes automatic historical import. Individual Uploaded Journals and explicit backdating before activation remain allowed.
- A Voice Journal initially uses its VoiceNotes creation timestamp converted to `Asia/Kolkata`. If that timestamp is unavailable, it enters a Needs Date Review state rather than using webhook receipt time silently.
- The web experience also supports an Uploaded Journal: a UTF-8 `.txt` or `.md` file of at most 1 MiB, assigned to a date either from that Journal Day or through an upload flow that asks for the date.
- Multiple Uploaded Journals may belong to one Journal Day. The application preserves each original file and uses its filename as its source title.
- An exact duplicate upload produces a warning and an explicit Add Anyway option. PDF, Word, and OCR ingestion are deferred.

### AI boundary

- Journal text may be sent to an explicitly configured hosted AI API for summaries and Generated Artwork.
- MVP must support both OpenAI and Google Gemini through private application settings.
- MVP has independent Text Provider and Artwork Provider settings, each presented as a dropdown of approved options.
- Exact dropdown models are deliberately not decided until detailed model evaluations and synthetic quality comparisons are complete.
- A provider change affects only future generation. Existing Derived Artifacts retain their provider, requested and returned model, source-revision, prompt-template, usage, safety, and generation provenance.
- The system never silently routes data to a non-selected fallback provider. Failure is visible and a retry or provider change requires an explicit action.
- Daily Photos must not be sent to any AI system.
- API credentials will be supplied later through a secure secret path, never committed to Git.
- A Derived Artifact retains provider/model provenance after either provider setting changes.
- Each Journal Day receives one concise generated title, one factual 80–140-word summary, and 3–7 editable/searchable tags.
- Generated text is warm but observational: no coaching, diagnosis, invented facts, or inferred emotions unless the journal states them.
- AI output remains visibly labeled and versioned while complete source journals appear separately.
- Generated Artwork uses warm, painterly editorial illustration, symbolic scenes, and restrained texture. It must not attempt photorealistic reconstruction or recognizable likenesses and must be labeled `AI artwork`.
- A ten-prompt synthetic visual evaluation must occur before personal journal text is sent for artwork generation.
- Finalization Time is 01:00 `Asia/Kolkata` on the following day.
- Generated Artwork has only two creation triggers in MVP: an explicit Artwork Request from the Journal Day UI, or the 01:00 Artwork Sweep.
- An Artwork Request can create Generated Artwork when none exists, including on a day that already has Daily Photos; real photos still control the Calendar Cover.
- The Artwork Sweep creates art only for a non-empty Journal Day that has journal text, no Daily Photo, and no existing Generated Artwork. It never creates imagery for an empty day.
- A late journal or Correction marks Derived Artifacts stale. Untouched generated title, summary, and tags may refresh automatically; a manually edited version is preserved and offered a generated replacement for review rather than overwritten.
- Artwork regeneration after late text changes is manual and creates a traceable new version.
- When a Daily Photo arrives after Generated Artwork, the first Daily Photo becomes the Calendar Cover and both authentic photos and visibly labeled Generated Artwork remain available.
- Generated Artwork cannot be selected as the Calendar Cover while any Daily Photo exists.

### MVP and recovery

- MVP begins prospectively from launch day; historical VoiceNotes import is deferred to the backlog.
- MVP has no coaching features and no reminders.
- The system uses encrypted Restic snapshots in a private Backblaze B2 EU Central bucket, without Object Lock on the Restic repository.
- Backup retention is 48 hourly, 30 daily, and 12 monthly snapshots.
- A sampled database/photo restore occurs monthly and a full disaster-recovery drill occurs quarterly, with a four-hour recovery acceptance target to be measured rather than assumed.
- A separate immutable-export flow is deferred unless the threat model expands beyond crash/server loss.

### Reflection experience

- MVP has four primary surfaces: image-first month calendar, chronological timeline, exact text/date/tag search, and Journal Day detail.
- Journal Day detail includes the Calendar Cover and gallery, generated summary and tags, source journals in chronological order, original timestamps and provenance, upload controls, and management controls.
- Manual `.txt` and `.md` journal upload is available both globally and from a Journal Day.
- The visual direction is quiet and photographic: warm paper-like light theme, deep-ink dark theme, restrained typography, and restrained motion.
- The calendar starts on Monday and uses `en-IN` date formatting.
- The web experience is responsive across mobile and desktop, keyboard accessible, compatible with reduced-motion preferences, and targets WCAG 2.2 AA contrast.
- Native applications and offline mode are excluded from MVP.

### Access, lifecycle, and operations

- Cloudflare routes `life.arunp.in` through the existing tunnel to the application on Arun's Hetzner server.
- The human-facing application uses the free Cloudflare Access tier with Cloudflare's first-party identity provider, an exact account-member allow policy, required MFA, and a seven-day session.
- The application has no separate username/password database or second login layer.
- Credentials disclosed through chat or attachments are treated as exposed, are never recorded in Git, and must not be reused. Fresh credentials are provisioned later through a secrets-only path.
- Telegram ingestion accepts only a configured numeric user ID in one configured private chat, rejects groups and all other senders, and also requires Telegram's webhook secret.
- Telegram identity and chat identifiers are private runtime configuration rather than source-code constants. The bot token is always a secret and is never hard-coded, logged, exported, or committed.
- Forwarded photos are eligible when they are sent by the configured Telegram user from the configured private chat.
- Identical Daily Photo bytes are detected by checksum across the archive. A same-day resend is acknowledged as already imported and requires Add Duplicate Anyway to create another item; a different-day duplicate warns but is permitted.
- Deleted content enters Trash for 30 days before permanent live deletion. Encrypted backup copies expire according to backup retention rather than being selectively rewritten immediately.
- Deleting a Voice Journal never changes VoiceNotes. A Source Suppression prevents reconciliation from resurrecting it; restoring from Trash removes that suppression.
- After permanent local deletion, only the opaque upstream identity needed for Source Suppression remains. An explicit Allow Re-import action removes it.
- A portable, restorable ZIP export contains JSON, Markdown, browsable HTML, original source files and photos, Generated Artwork, revisions, checksums, and a manifest. PDF books are deferred.
- Telegram sends operational alerts only after repeated photo-ingestion, VoiceNotes-reconciliation, or backup failure. It sends no journaling or habit reminders.
- A Telegram photo acknowledgement is sent after durable local capture and includes its assigned Journal Date.
- MVP reuses Arun's existing Hetzner server.
- Best-effort single-server availability is accepted; MVP has no high-availability or SLA commitment.
- A private System Health view shows the last successful Telegram capture, VoiceNotes reconciliation, backup, sampled restore, remaining storage, and AI spend.
- A $5 monthly application-enforced AI ceiling warns at 80 percent and pauses automatic artwork at 100 percent while preserving capture, backup, and low-cost text processing.
- The existing-server cost, independent Backblaze storage, and any later live-media storage are tracked separately from the AI ceiling.
- Journal data and media are encrypted at rest using application-controlled encryption with no additional service subscription. Runtime keys are server secrets and recovery material is held outside the server.
- Encryption at rest protects copied storage and backups, not a compromised running server; Life in Days is not represented as end-to-end encrypted or zero-knowledge.
- The 20 MB per-image limit and no application item-count limit are accepted. The currently approved launch boundary is a 10 GB root-resident media budget on the existing disk, migration before host free space falls below 12 GB, and explicit rejection rather than silent data loss at the emergency threshold. The 10 GB limit does not cap the total archive after verified object-store cutover. The initially proposed 50 GB Hetzner Volume is provisional because the completed storage report identifies lower-cost object-store paths.
- The final live-media storage architecture remains open pending Arun's choice between the completed report's safety/price recommendation and its lower-cost-after-break-even alternative.

## Explicitly deferred

- Historical VoiceNotes import.
- AI coaching.
- Reminders.
- Multi-user access, sharing, and public links.
- PDF, Word, and OCR journal ingestion.
- PDF books.
- Year mosaic, media wall, On This Day, and conversational journal search.
- Native mobile applications and offline mode.
- Immutable ransomware-resistant export flow.
- Additional VoiceNotes eligibility tags and fuzzy tag matching.

## Open frontier

- Exact Text Provider and Artwork Provider dropdown models. The detailed reports are complete, but final selection remains gated on the documented synthetic/blind evaluations.
- Whether to approve the reports' proposed one-time $15 combined model-evaluation ceiling or spread evaluation across months under the existing $5 monthly ceiling.
- When textual Derived Artifacts are first generated, how long a source quiet period lasts, and how 01:00 finalization affects them.
- Whether the Artwork Sweep scans only the just-finished Journal Day or repairs all eligible post-activation days, and how a deliberate artwork removal opts out of recreation.
- Minimum journal length and content-safety behavior for automatic or manual Generated Artwork.
- Generated Artwork version visibility, selection, deletion, and regeneration limits.
- Whether to adopt the storage report's recommended existing-disk-to-R2 Standard EU path, or choose the lower-bill but correlated-risk B2-live alternative after the account-specific break-even.
- Physical media deduplication and reference/deletion behavior when one checksum is intentionally used on multiple Journal Days.
- Exact encrypted-at-rest data/key design and recovery ceremony, to be recorded as an architectural decision after shared understanding.
- Accepted image formats when Telegram documents may contain arbitrary file types.
- Telegram caption-text meaning beyond the leading date, direct text-entry scope, machine webhook hostname/path isolation, browser support, search semantics, redating cascades, and remaining interaction edge cases.

## Detailed decision reports

- [AI text model evaluation](AI-TEXT-MODEL-EVALUATION.md)
- [AI artwork model evaluation](AI-ARTWORK-MODEL-EVALUATION.md)
- [Private media storage evaluation](MEDIA-STORAGE-EVALUATION.md)
