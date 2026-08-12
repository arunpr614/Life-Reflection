# Product and integration research

Checked: 2026-08-12

Status labels used here:

- **Documented** — stated in a current first-party product or API source.
- **Observed** — read-only inspection of Arun's current environment.
- **Proposed** — a recommendation awaiting Arun's decision.
- **Unknown** — not promised by the available first-party documentation; must be tested or clarified.

## Integration findings

### VoiceNotes

**Documented**

- VoiceNotes lets a user register a public POST webhook and subscribe to note create, update, delete, summary, to-do-list, and main-points events.
- The published create example contains an event timestamp and note ID, title, and transcript fields. The documentation does not promise that this transcript is complete.
- VoiceNotes supports tags and tag automations.
- The official OAuth-based VoiceNotes MCP interface can list notes by tag/date and retrieve a note's creation date, transcript, and tags.

**Unknown and material**

- The webhook example does not include tags or a note creation date.
- VoiceNotes does not document a webhook signature, shared-secret header, source IP list, delivery ID, retry/backoff contract, response deadline, event ordering, or replay behavior.
- Update and delete payload examples are not documented, nor is it documented whether tag changes emit an update.
- It must be proven that the webhook note ID is the same UUID accepted by the MCP interface.
- OAuth refresh behavior for unattended server reconciliation and API rate limits are not documented.

**Proposed**

- Treat webhook events as change notifications, acknowledge them quickly after durable capture, and fetch canonical tag/date/transcript data through VoiceNotes MCP.
- Reconcile tagged notes periodically to recover missed, duplicated, or out-of-order webhook events.
- Run an integration spike using synthetic notes before committing to an event schema.

Sources:

- [Set up webhooks](https://help.voicenotes.com/en/articles/9895482-set-up-webhooks)
- [Organize notes using tags](https://help.voicenotes.com/en/articles/10393499-how-to-organize-your-notes-in-voicenotes-using-tags)
- [Tag automations](https://help.voicenotes.com/en/articles/12272619-tag-automations)
- [VoiceNotes MCP](https://help.voicenotes.com/en/articles/14336494-voicenotes-mcp)

### Telegram

**Documented**

- Telegram can deliver HTTPS webhook updates with a configured secret-token header.
- `update_id` exists to support deduplication and ordering recovery; undelivered updates are retained for no longer than 24 hours.
- Photos arrive as multiple size variants. The bot must call `getFile` and promptly copy the selected bytes into application-controlled storage.
- Default Bot API downloads are limited to 20 MB and generated download URLs are valid for at least one hour.
- Photo albums arrive as separate messages sharing a `media_group_id`; there is no documented album-complete event.
- Telegram does not provide a normal deletion event for ordinary bot-chat messages, so deletion needs an explicit bot command or web action.

**Proposed**

- Require both Telegram's webhook secret and an allowlist of Arun's numeric user and private-chat IDs.
- Accept ordinary photo messages for the first version, acknowledge after durable capture, and identify ingestion by chat/message ID.
- Enforce the product's one-or-two-photo rule in the application rather than assuming Telegram does it.

Sources:

- [Telegram Bot API: receiving updates and webhooks](https://core.telegram.org/bots/api#getting-updates)
- [Telegram Bot API: `setWebhook`](https://core.telegram.org/bots/api#setwebhook)
- [Telegram Bot API: `getFile`](https://core.telegram.org/bots/api#getfile)

## Product inspiration

| Product | Documented strengths worth adapting | What not to copy into the first version |
| --- | --- | --- |
| Day One | Photo-backed calendar cells; chosen representative image; day detail; list/calendar/media views; full-text and tag filters; On This Day; originals, export, Trash, and revision history | Multiple journals, maps, printing, native apps, and platform-specific feature drift |
| Rosebud | Editable AI summaries and key insights; opt-in deeper reflection; weekly themes; journal Q&A; conditional entry-inspired art | Therapy-like claims, uneditable history, fuzzy AI memory for exact dates, or automatic tags that cannot be searched/corrected |
| Five Minute Journal | Low-friction habit loop; relevant reminders; concise reflection; photo timeline; portable export | Duplicating Arun's VoiceNotes writing ritual, proprietary prompt wording, streak guilt, or generic motivational noise |
| Daypix | Photo-first thumbnail calendar; chronological visual timeline; optional writing; multiple moments per day | Device-only storage assumptions or decorative customization before the core memory experience works |

Current product sources:

- [Day One features](https://dayoneapp.com/features/)
- [Day One calendar view](https://dayoneapp.com/guides/tips-and-tutorials/calendar-view-in-day-one/)
- [Day One AI features](https://dayoneapp.com/guides/ai-features/ai-features/)
- [Day One export](https://dayoneapp.com/guides/tips-and-tutorials/exporting-entries/)
- [Rosebud daily journaling](https://help.rosebud.app/daily-journaling)
- [Rosebud entry reflection](https://help.rosebud.app/ai-analysis/entry-reflection)
- [Rosebud personalized content](https://help.rosebud.app/tools-for-growth/personalized-content)
- [Rosebud limitations](https://help.rosebud.app/getting-started/rosebud%27s-limitations)
- [Five Minute Journal features](https://www.intelligentchange.com/blogs/support/basic-plan-features)
- [Five Minute Journal export](https://www.intelligentchange.com/blogs/support/export-your-journal-entries)
- [Daypix Play Store listing (`simple.diary`)](https://play.google.com/store/apps/details?id=simple.diary&hl=en_IN)

## Recommended feature sequence

### Proposed first release

- One private user and one journal.
- Tagged VoiceNotes ingestion with replay-safe reconciliation.
- Allowlisted Telegram photo ingestion with clear acknowledgements.
- One daily record containing separate immutable sources and versioned derived content.
- Image-first month calendar and chronological timeline.
- Day detail with hero/gallery, editable title and summary, complete source transcripts, and visible provenance.
- Conditional generated artwork only for a journaled day with no real photo; visibly labeled as generated.
- Exact date/tag/text search.
- Soft deletion, original-media preservation, portable export, encrypted backup, and a tested restore procedure.
- Responsive web UI; no native application.

### Proposed later releases

- On This Day resurfacing.
- Weekly themes and reflection.
- Journal Q&A with citations to exact days.
- Media-wall/year-mosaic view.
- Optional smart reminders that suppress themselves when the needed content already exists.
- Generated-art style controls.

### Proposed deferrals

- Multiple users or shared journals.
- Native mobile apps or complex offline synchronization.
- Maps and extensive location features.
- Streak gamification.
- Broad goals/coaching/therapy features.
- Printing and book production.

## Hosting facts

**Observed, read-only on 2026-08-12**

- Arun's existing Hetzner host is reachable through the configured SSH alias `brain`.
- It runs Ubuntu 24.04 on x86-64 with 2 CPUs, 3.7 GiB memory, and approximately 27 GiB free on the root disk at inspection time.
- Node.js 22 is present and `cloudflared` is active.
- The existing Cloudflare tunnel already publishes other `arunp.in` applications from loopback-only services.
- Docker and PostgreSQL are not currently active.
- `journal.arunp.in`, `life.arunp.in`, `diary.arunp.in`, and `days.arunp.in` had no A or CNAME record when checked.
- `arunp.in` is currently delegated to Cloudflare nameservers.

**Proposed**

- Reuse the existing tunnel with a new loopback-only service and a narrowly scoped hostname route.
- Protect the human-facing application independently from the two machine webhook paths.
- Keep the VoiceNotes and Telegram receivers externally reachable but authenticate and rate-limit them at the application/edge layers.
- Do not rely only on Hetzner's seven disk backups: journal media needs a separate encrypted off-server backup because Hetzner disk backups are server-bound and attached Volumes are excluded.

Sources:

- [Cloudflare Tunnel routing](https://developers.cloudflare.com/tunnel/routing/)
- [Cloudflare Access application paths](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/)
- [Cloudflare Access common policies](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/common-policies/)
- [Hetzner backup and snapshot FAQ](https://docs.hetzner.com/cloud/servers/backups-snapshots/faq/)

## Research-driven safeguards

- Preserve raw VoiceNotes transcripts and original photos separately from AI-authored summaries, tags, and artwork.
- Never present generated art as a factual photo of the day.
- Never generate imagery for an empty day.
- Do not use webhook receipt time as the day without a deliberate dating policy.
- Do not claim end-to-end encryption while the server or an AI provider can read journal content.
- Document VoiceNotes, Telegram, Cloudflare, Hetzner, and any AI provider as distinct data processors and trust boundaries.
- Make export, deletion, backup, and restoration product requirements rather than operational afterthoughts.
