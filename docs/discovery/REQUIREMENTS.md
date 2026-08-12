# Requirements under discovery

Updated: 2026-08-12 after grilling round 1

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

### Capture surfaces

- Telegram is the initial photo-capture surface.
- A Telegram photo initially belongs to the Journal Date derived from its receipt time in `Asia/Kolkata`.
- Multiple photos received on the same Journal Date belong to the same Journal Day; the final product limit and presentation are still open.
- Automatic long-form journals come from VoiceNotes.
- The approved integration hypothesis is: use the VoiceNotes webhook as a wake-up signal, then use the official MCP interface for authoritative tag, date, and transcript retrieval.
- A synthetic integration spike must prove the webhook/MCP identity and unattended authorization assumptions before the integration contract is frozen.
- The web experience also supports an Uploaded Journal: a text file assigned to a date either from that Journal Day or through an upload flow that asks for the date.

### AI boundary

- Journal text may be sent to an explicitly configured hosted AI API for summaries and Generated Artwork.
- Claude and OpenAI are acceptable candidates; provider/model selection awaits current cost-quality research.
- Daily Photos must not be sent to any AI system.
- API credentials will be supplied later through a secure secret path, never committed to Git.

### MVP and recovery

- MVP begins prospectively from launch day; historical VoiceNotes import is deferred to the backlog.
- MVP has no coaching features and no reminders.
- The system must have a restorable backup covering journal data and original photos.
- A low-cost backup design and restoration contract await current research and a user decision.

## Explicitly deferred

- Historical VoiceNotes import.
- AI coaching.
- Reminders.
- Multi-user access, sharing, and public links.

## Open frontier

- Photo quantity, calendar cover selection, ordering, and gallery behavior.
- Text-upload types, size/encoding rules, duplicates, and correction/version semantics.
- VoiceNotes eligibility tag and what happens when a source is edited, untagged, or deleted.
- Journal Day finalization, AI generation timing, staleness, and regeneration.
- Summary/title/tag shape and editing behavior.
- Generated-art visual policy and late-real-photo behavior.
- Authentication and session policy for the private web application.
- Search, calendar, timeline, day-detail, accessibility, and responsive UX requirements.
- Data deletion, Trash retention, export formats, backup destination, retention, and restore verification.
- Operational budget, monitoring, failure notification, and availability expectations.
