# Requirements under discovery

Updated: 2026-08-13 after grilling round 5

Status: the requirements decision frontier is complete and awaits Arun's explicit shared-understanding confirmation. No evaluation execution, implementation, deployment, account mutation, or secret collection is authorized before that confirmation.

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
- A source/Correction conflict shows the differences and offers exactly three actions: keep the Correction, display the newest upstream revision, or create a new Correction based on both. Personal journal text is never auto-merged.
- Untagging or deleting an imported VoiceNotes source marks its upstream status but never silently erases the local memory.
- Moving a Source Item to another Journal Date updates both affected Journal Days atomically while preserving its Original Timestamp.
- Redating recalculates cover eligibility and stale state on both days. Untouched textual Derived Artifacts may refresh; manually edited fields are preserved and marked stale.
- Generated Artwork whose source-revision set no longer belongs to its Journal Day leaves the active gallery and cover but remains in version history until Arun explicitly retains, restores, or deletes it.

### Capture surfaces

- Telegram is the initial photo-capture surface.
- Telegram accepts both compressed photo messages and image documents. The application preserves the exact received bytes and must explain that Telegram may compress ordinary photo messages.
- There is no product-level daily photo-count limit. The first Daily Photo is the default Calendar Cover, all Daily Photos appear chronologically, and Arun can reorder them and choose another real-photo cover.
- Original received images remain private and unchanged. Web thumbnails are generated locally with EXIF removed.
- A Telegram photo initially belongs to the Journal Date derived from its receipt time in `Asia/Kolkata`. A caption beginning with `YYYY-MM-DD` explicitly assigns that photo, or its media group, to the supplied Journal Date.
- An invalid or future leading caption date never causes the photo to be discarded or silently assigned by receipt time. The photo enters Needs Date Review, remains outside the calendar until corrected, and receives a Telegram explanation. Explicit historical backdating remains allowed; future Journal Dates are excluded from MVP.
- Caption text remaining after an optional leading `YYYY-MM-DD` is preserved as a searchable Photo Caption shown with the Daily Photo. Photo Captions are excluded from AI input in MVP.
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
- MVP does not add a blank browser journal editor. VoiceNotes remains the writing surface, while `.txt`/`.md` upload and Corrections provide the manual paths.
- Accepted Telegram image documents are still-image JPEG, PNG, WebP, HEIC, and HEIF, identified from decoded content rather than filename alone.
- Animated images, SVG, TIFF, PDF, RAW, files over 20 MB, images over 100 megapixels, and dimensions over 20,000 pixels are rejected clearly. Every accepted Original retains its exact received bytes.

### AI boundary

- Journal text may be sent to an explicitly configured hosted AI API for summaries and Generated Artwork.
- MVP must support both OpenAI and Google Gemini through private application settings.
- MVP has independent Text Provider and Artwork Provider settings, each presented as a dropdown of approved options.
- The approved text evaluation uses 32 fixtures and three repeats across the six documented OpenAI/Google candidates, with Claude Haiku and Sonnet as benchmark controls. Synthetic fixtures are used initially.
- The approved artwork evaluation uses ten blind synthetic prompts across GPT Image 2 and the three documented Google image candidates, followed by a second blind run for the best passing OpenAI and best passing Google options.
- A separate one-time **$15 hard ceiling** is approved for the combined text and artwork evaluations. Evaluations contain no personal journal text and stop before exceeding the ceiling.
- Exact dropdown models are deliberately not decided until those evaluations are run. The production dropdown contains the best passing OpenAI model and best passing Google model; additional economy or premium entries must satisfy the reports' predeclared thresholds.
- Hard gates take precedence over provider coverage. If either provider has no passing model, no failing model is exposed merely to satisfy the two-provider goal; the result returns to Arun for a new decision.
- A premium artwork option is manual-only and technically ineligible for Artwork Sweep jobs.
- A provider change affects only future generation. Existing Derived Artifacts retain their provider, requested and returned model, source-revision, prompt-template, usage, safety, and generation provenance.
- The system never silently routes data to a non-selected fallback provider. Failure is visible and a retry or provider change requires an explicit action.
- Daily Photos must not be sent to any AI system.
- API credentials will be supplied later through a secure secret path, never committed to Git.
- A Derived Artifact retains provider/model provenance after either provider setting changes.
- Each Journal Day receives one concise generated title, one factual 80–140-word summary, and 3–7 editable/searchable tags.
- Title, summary, and tags are independently editable.
- Manually editing a title, summary, or tag field, or explicitly accepting/selecting one of its generated versions, makes that field a Protected Field. Source changes mark it stale and offer a replacement without overwriting it.
- **Resume automatic updates** removes protection from an individual field; protection or removal on one field does not affect the others.
- Automatic title, summary, tags, and Visual Brief generation begins after a 15-minute Source Quiet Period following the latest journal-source change.
- At 01:00 `Asia/Kolkata`, untouched textual Derived Artifacts receive a final refresh when their source set changed. Manual protection is per field: editing one field does not freeze the other fields.
- Generated text is warm but observational: no coaching, diagnosis, invented facts, or inferred emotions unless the journal states them.
- AI output remains visibly labeled and versioned while complete source journals appear separately.
- Generated Artwork uses warm, painterly editorial illustration, symbolic scenes, and restrained texture. It must not attempt photorealistic reconstruction or recognizable likenesses and must be labeled `AI artwork`.
- A ten-prompt synthetic visual evaluation must occur before personal journal text is sent for artwork generation.
- The Text Provider creates a 150–300-token Visual Brief. Only that brief is sent to the Artwork Provider; the Artwork Provider never receives the raw journal, photos, photo-derived descriptions, names, or account identifiers.
- The Visual Brief is read-only in MVP. Arun may use **Regenerate brief** and then explicitly retry artwork, but cannot add free-form text that could defeat the brief's minimization boundary.
- Finalization Time is 01:00 `Asia/Kolkata` on the following day.
- Generated Artwork has only two creation triggers in MVP: an explicit Artwork Request from the Journal Day UI, or the 01:00 Artwork Sweep.
- As soon as a journal is available, the Journal Day shows an explicit **Generate artwork now** action. Arun can therefore issue an Artwork Request without waiting for the Source Quiet Period or the 01:00 Artwork Sweep, subject to the minimum-text, safety, provider, and budget gates.
- An Artwork Request can create Generated Artwork when none exists or regenerate it, including on a day that already has Daily Photos; real photos still control the Calendar Cover.
- Automatic generation requires at least 20 meaningful journal words. A manual Artwork Request is available from five meaningful words with a sparse-source warning and is unavailable below five words.
- The Artwork Sweep repairs every eligible post-Integration-Activation Journal Day missed because of an outage, not only the immediately preceding day. It creates art only for a day with sufficient journal text, no Daily Photo, no Generated Artwork, and no Artwork Suppression.
- Deliberately removing all Generated Artwork creates an Artwork Suppression. An explicit **Allow generation** action removes it.
- A provider safety refusal is shown as an ordinary unavailable-artwork state. It is not automatically retried, routed to another provider, or used to modify the source journal; any retry is explicit.
- A late journal or Correction marks Derived Artifacts stale. Untouched generated title, summary, and tags may refresh automatically; a manually edited version is preserved and offered a generated replacement for review rather than overwritten.
- Artwork regeneration after late text changes is manual and creates a traceable new version.
- Every successful regeneration creates a retained Generated Artwork version. The newest successful version becomes Active Artwork by default, while Arun may select an earlier version and all prior versions remain in history.
- There is no arbitrary artwork-regeneration count limit beyond the applicable AI budget and safety controls.
- When a Daily Photo arrives after Generated Artwork, the first Daily Photo becomes the Calendar Cover and both authentic photos and visibly labeled Generated Artwork remain available.
- Generated Artwork cannot be selected as the Calendar Cover while any Daily Photo exists.

### MVP and recovery

- MVP begins prospectively from Integration Activation; automatic historical VoiceNotes import is deferred to the backlog.
- MVP has no coaching features and no reminders.
- The system uses encrypted Restic snapshots in a private Backblaze B2 EU Central bucket, without Object Lock on the Restic repository.
- Backup retention is 48 hourly, 30 daily, and 12 monthly snapshots.
- A sampled database/photo restore occurs monthly and a full disaster-recovery drill occurs quarterly, with a four-hour recovery acceptance target to be measured rather than assumed.
- Production launch is blocked until the Recovery Ceremony succeeds: one recovery-key copy is stored in Arun's password manager, a second independent sealed copy is held offline, and a representative encrypted archive sample is restored and decrypted with the recovery material.
- A separate immutable-export flow is deferred unless the threat model expands beyond crash/server loss.

### Reflection experience

- MVP has four primary surfaces: image-first month calendar, chronological timeline, exact text/date/tag search, and Journal Day detail.
- Journal Day detail includes the Calendar Cover and gallery, generated summary and tags, source journals in chronological order, original timestamps and provenance, upload controls, and management controls.
- Manual `.txt` and `.md` journal upload is available both globally and from a Journal Day.
- Exact search indexes currently displayed journal text, titles, summaries, tags, and Photo Captions. Trash and superseded Source Revisions are excluded by default and available through an explicit **Include history** filter.
- MVP search is lexical and deterministic; semantic and conversational journal search remain deferred.
- A Journal Day with no live Source Items is hidden from the ordinary calendar and timeline even if historical Derived Artifacts remain. Its retained history stays available through management/history views for audit or restoration.
- The visual direction is quiet and photographic: warm paper-like light theme, deep-ink dark theme, restrained typography, and restrained motion.
- The calendar starts on Monday and uses `en-IN` date formatting.
- The web experience is responsive across mobile and desktop, keyboard accessible, compatible with reduced-motion preferences, and targets WCAG 2.2 AA contrast.
- Supported browsers are the current two major versions of Chrome, Edge, Firefox, and Safari, plus current iOS Safari and Android Chrome. Legacy-browser support is excluded.
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
- Duplicate Daily Photos reference one encrypted Media Asset rather than storing identical bytes repeatedly. **Add duplicate anyway** creates a distinct Daily Photo, not a second physical copy.
- A Media Asset is deleted from live storage only after no live or Trash Daily Photo references it; backup copies expire through normal backup retention.
- Deleted content enters Trash for 30 days before permanent live deletion. Encrypted backup copies expire according to backup retention rather than being selectively rewritten immediately.
- Deleting a Voice Journal never changes VoiceNotes. A Source Suppression prevents reconciliation from resurrecting it; restoring from Trash removes that suppression.
- After permanent local deletion, only the opaque upstream identity needed for Source Suppression remains. An explicit Allow Re-import action removes it.
- A portable, restorable ZIP export contains JSON, Markdown, browsable HTML, original source files and photos, Generated Artwork, revisions, checksums, and a manifest. PDF books are deferred.
- A complete restorable export also contains clearly separated Trash records and Source/Artwork Suppressions so restoration preserves deletion intent. Permanently deleted content is never reconstructed: only the opaque source identifier required by an enduring Source Suppression is exported.
- Export defaults to AES-256 ZIP encryption under a one-time passphrase that is never stored. The server-side artifact is deleted after the first successful download or one hour, whichever comes first; an unencrypted export requires an explicit privacy warning.
- Telegram sends operational alerts only after repeated photo-ingestion, VoiceNotes-reconciliation, or backup failure. It sends no journaling or habit reminders.
- A Telegram photo acknowledgement is sent after durable local capture and includes its assigned Journal Date.
- MVP reuses Arun's existing Hetzner server.
- Best-effort single-server availability is accepted; MVP has no high-availability or SLA commitment.
- A private System Health view shows the last successful Telegram capture, VoiceNotes reconciliation, backup, sampled restore, remaining storage, and AI spend.
- A $5 monthly application-enforced AI ceiling warns at 80 percent. Automatic artwork stops when the $4.50 artwork allocation or the $5 total is exhausted; capture, browsing, search, export, and backup remain available.
- The $5 ceiling is hard: $0.50 is reserved for text generation and retries, leaving at most $4.50 for artwork. The reserve never permits total AI spend above $5; every predicted over-budget request is blocked, and manual artwork cannot bypass either limit.
- The existing-server cost, independent Backblaze storage, and any later live-media storage are tracked separately from the AI ceiling.
- Journal data and media are encrypted at rest using application-controlled encryption with no additional service subscription. Runtime keys are server secrets and recovery material is held outside the server.
- Encryption at rest protects copied storage and backups, not a compromised running server; Life in Days is not represented as end-to-end encrypted or zero-knowledge.
- The 20 MB per-image limit and no application item-count limit are accepted. The currently approved launch boundary is a 10 GB root-resident media budget on the existing disk, migration before host free space falls below 12 GB, and explicit rejection rather than silent data loss at the emergency threshold. The 10 GB limit does not cap the total archive after verified object-store cutover. The initially proposed 50 GB Hetzner Volume is provisional because the completed storage report identifies lower-cost object-store paths.
- Live media launches encrypted on the existing root disk and migrates to private Cloudflare R2 Standard created in the EU jurisdiction before the root-resident thresholds are exhausted. Encrypted Restic snapshots remain in the independent B2 EU Central recovery store.
- No Hetzner Volume is pre-purchased. Object-store cutover remains gated on complete inventory reconciliation and a tested, fail-closed R2-to-Restic restore path.
- MVP uses no third-party analytics or crash-reporting service. Sanitized local structured logs retain only timestamps, opaque identifiers, and error classes for 30 days; journal text, prompts, captions, images, provider responses, credentials, tokens, and signed URLs are forbidden in logs.
- Machine callbacks use `life-hooks.arunp.in`, separated from the human-facing application. Only opaque Telegram and VoiceNotes callback paths are exposed there; no human journal route is served from that hostname.

## Explicitly deferred

- Historical VoiceNotes import.
- AI coaching.
- Reminders.
- Multi-user access, sharing, and public links.
- PDF, Word, and OCR journal ingestion.
- PDF books.
- Year mosaic, media wall, On This Day, and conversational journal search.
- Native mobile applications and offline mode.
- Blank browser journal composition.
- Immutable ransomware-resistant export flow.
- Additional VoiceNotes eligibility tags and fuzzy tag matching.

## Decision frontier status

- No user/product preference decision is currently unresolved.
- Exact Text Provider and Artwork Provider dropdown models are downstream outcomes of the approved synthetic/blind evaluations, not silently assumed selections. A hard-gate failure returns to Arun for a new decision.
- The exact no-additional-cost encrypted-at-rest data/key design will be recorded in an architectural decision after shared-understanding confirmation.
- The VoiceNotes integration remains conditional on its documented synthetic spike. If webhook-to-MCP identity, unattended authorization, or reconciliation behavior fails, the affected branch reopens rather than being improvised.

## Detailed decision reports

- [AI text model evaluation](AI-TEXT-MODEL-EVALUATION.md)
- [AI artwork model evaluation](AI-ARTWORK-MODEL-EVALUATION.md)
- [Private media storage evaluation](MEDIA-STORAGE-EVALUATION.md)
