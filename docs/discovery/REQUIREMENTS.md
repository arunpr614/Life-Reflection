# Requirements under discovery

Updated: 2026-08-12 after grilling round 2

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
- A Voice Journal initially uses its VoiceNotes creation timestamp converted to `Asia/Kolkata`. If that timestamp is unavailable, it enters a Needs Date Review state rather than using webhook receipt time silently.
- The exact eligible VoiceNotes tag configuration is still open because Arun named `life-in-days`, `Journal`, and `Daily Journal` without specifying whether they are alternatives or one accepted set.
- The web experience also supports an Uploaded Journal: a UTF-8 `.txt` or `.md` file of at most 1 MiB, assigned to a date either from that Journal Day or through an upload flow that asks for the date.
- Multiple Uploaded Journals may belong to one Journal Day. The application preserves each original file and uses its filename as its source title.
- An exact duplicate upload produces a warning and an explicit Add Anyway option. PDF, Word, and OCR ingestion are deferred.

### AI boundary

- Journal text may be sent to an explicitly configured hosted AI API for summaries and Generated Artwork.
- MVP must support both OpenAI and Google Gemini, with an Active AI Provider selected through a private application setting.
- Provider/model selection granularity, switching behavior, fallback policy, and Google model/key selection await the next decision round and current research.
- Daily Photos must not be sent to any AI system.
- API credentials will be supplied later through a secure secret path, never committed to Git.
- A Derived Artifact retains provider/model provenance even after the Active AI Provider changes.
- Each Journal Day receives one concise generated title, one factual 80–140-word summary, and 3–7 editable/searchable tags.
- Generated text is warm but observational: no coaching, diagnosis, invented facts, or inferred emotions unless the journal states them.
- AI output remains visibly labeled and versioned while complete source journals appear separately.
- Generated Artwork uses warm, painterly editorial illustration, symbolic scenes, and restrained texture. It must not attempt photorealistic reconstruction or recognizable likenesses and must be labeled `AI artwork`.
- A ten-prompt synthetic visual evaluation must occur before personal journal text is sent for artwork generation.
- Finalization Time is 01:00 `Asia/Kolkata` on the following day.
- A late journal or Correction marks Derived Artifacts stale. Title, summary, and tags refresh automatically after a quiet period; artwork regeneration is manual after late text changes.
- When a Daily Photo arrives after Generated Artwork, the first Daily Photo becomes the Calendar Cover and both authentic photos and visibly labeled Generated Artwork remain available.

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
- The human-facing application requires a simple private login. Whether that is Cloudflare Access or application-level username/password remains open because those are different mechanisms.
- Credentials disclosed through chat or attachments are treated as exposed, are never recorded in Git, and must not be reused. Fresh credentials are provisioned later through a secrets-only path.
- Deleted content enters Trash for 30 days before permanent live deletion. Encrypted backup copies expire according to backup retention rather than being selectively rewritten immediately.
- A portable, restorable ZIP export contains JSON, Markdown, browsable HTML, original source files and photos, Generated Artwork, revisions, checksums, and a manifest. PDF books are deferred.
- Telegram sends operational alerts only after repeated photo-ingestion, VoiceNotes-reconciliation, or backup failure. It sends no journaling or habit reminders.
- A Telegram photo acknowledgement is sent after durable local capture and includes its assigned Journal Date.
- MVP reuses Arun's existing Hetzner server.

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

## Open frontier

- Whether all three named VoiceNotes tags are eligible, or which single canonical tag is required; matching and rename behavior then follow from that choice.
- Whether Generated Artwork is created immediately after the first journal quiet period or only at 01:00 finalization, including minimum meaningful-text rules.
- Whether Generated Artwork may be manually selected as Calendar Cover after a Daily Photo exists.
- How a user resolves an upstream Source Revision versus local Correction conflict.
- Exact OpenAI and Google text/image models, one-setting versus per-function provider selection, switching and regeneration semantics, failure fallback, secret provisioning, and cost guardrails.
- Authentication mechanism and session policy: Cloudflare identity login versus application-level username/password.
- Duplicate Daily Photos resent in different Telegram messages.
- Monitoring status presentation, availability expectations, and the approved monthly operating-cost ceiling.
