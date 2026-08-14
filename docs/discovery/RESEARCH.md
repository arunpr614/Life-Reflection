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

## AI provider and cost research

The following estimates use current public API prices checked on 2026-08-12. They exclude tax and assume 30 Journal Days per month. Provider selection remains **Proposed** until Arun accepts it.

### Text-derived title, summary, tags, and visual brief

**Documented**

- OpenAI positions `gpt-5.6-luna` as its current cost-sensitive model for new workloads. It costs $0.20 per million input tokens and $1.20 per million output tokens and supports a fixed 1.05-million-token context window.
- At 3,000 input plus 500 output tokens per day, the modeled monthly cost is $0.036. At a deliberately generous 10,000 input plus 500 output tokens per day, it is $0.078.
- OpenAI API inputs and outputs are not used to train models by default. Standard abuse-monitoring logs may retain content for up to 30 days. Chat Completions has no application-state retention apart from documented exceptions; Responses retains application state for 30 days by default.
- Anthropic's current alternatives are materially more expensive at this volume: Claude Haiku 4.5 is approximately $0.375/month under the generous workload, and Claude Sonnet 5 is approximately $1.125/month after its introductory price ends. Anthropic does not offer native image generation, so using it would still require a second provider.

**Proposed**

- Use pinned `gpt-5.6-luna` through Chat Completions with reasoning disabled, strict structured output, and no prompt/response logging.
- Do not add Batch, prompt caching, or a Claude fallback to MVP. Their savings or quality benefit cannot justify another retained job surface or secret at one request per day.
- Prove summary quality with synthetic or deliberately redacted journal samples before sending personal content. The cost comparison is documented; relative journal-writing quality is an inference that documentation cannot establish.

Sources:

- [OpenAI GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna)
- [OpenAI API data controls](https://developers.openai.com/api/docs/guides/your-data)
- [Anthropic model overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Anthropic API pricing](https://platform.claude.com/docs/en/about-claude/pricing)

### Generated Artwork

**Documented**

- OpenAI's current `gpt-image-2` supports a pinned `gpt-image-2-2026-04-21` snapshot and text-only generation.
- A 1024 by 1536 medium-quality portrait costs $0.041 in output tokens. A conservative 300-token visual brief brings the modeled total to approximately $0.0425 per image: $0.43 for 10, $0.85 for 20, or $1.28 for 30 images per month.
- Google's Gemini 3.1 Flash Lite Image is approximately $0.0337 per 1K image under the same prompt assumption. At 30 images it saves only about $0.27/month while requiring another provider integration and secret.
- GPT Image API content is not used for training by default. The endpoint has no application-state retention, although standard abuse-monitoring retention can still apply. OpenAI-generated images include provenance signals.

**Proposed**

- Use pinned `gpt-image-2-2026-04-21`, 1024 by 1536, medium quality, with a short text-only visual brief.
- Never transmit a Daily Photo, its metadata, Telegram identifiers, or an image embedding. Preserve the provider-returned generated asset and produce web thumbnails locally.
- Prefer intentionally illustrative editorial artwork over photorealistic reconstruction so the image cannot masquerade as documentary evidence.
- A ten-prompt synthetic visual bake-off can validate aesthetics, but the roughly $0.27/month theoretical Google saving does not justify two providers in MVP.

Sources:

- [OpenAI GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)
- [OpenAI image generation and costs](https://developers.openai.com/api/docs/guides/image-generation#calculating-costs)
- [OpenAI image provenance](https://help.openai.com/en/articles/8912793-c2pa-in-images)
- [Google Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)

### Proposed account and key boundary

- Use one OpenAI API project named `life-in-days-prod` and one project service account named `life-in-days-server`.
- Create only one project-scoped secret for MVP, restricted to write access for `/v1/chat/completions` and `/v1/images/generations`; deny unrelated endpoints.
- Store it only in the Hetzner server's secret environment as `OPENAI_API_KEY`. It must never reach the browser, Telegram, Git, application logs, exports, or backups.
- OpenAI prepaid billing currently starts at $5. A $5 project alert plus an application-enforced monthly generation ceiling is sufficient: even the high text estimate plus 30 generated covers is approximately $1.36/month.
- Do not create an Anthropic key unless a later synthetic evaluation demonstrates a material quality gain.

Sources:

- [OpenAI prepaid billing](https://help.openai.com/en/articles/8264778-what-is-prepaid-billing)
- [OpenAI project and service-account keys](https://help.openai.com/en/articles/9186755-managing-projects-in-the-api-platform)
- [OpenAI key permissions](https://help.openai.com/en/articles/8867743)

### Google Gemini option requested for MVP

**Documented**

- Google's current cost-efficient stable text model is `gemini-3.5-flash-lite`, with structured output, a 1,048,576-token input limit, and paid pricing of $0.30 per million input tokens and $2.50 per million output tokens including thinking.
- At 3,000 input plus 500 billable output tokens per day, the modeled monthly text cost is $0.0645. At 10,000 input plus 500 output tokens per day, it is $0.1275.
- Google's stable `gemini-3.1-flash-lite-image` generates one 1K portrait image for approximately $0.0336 in image-output tokens. Ten, twenty, and thirty images are approximately $0.34, $0.67, and $1.01 respectively, before small prompt/thinking costs.
- Google's higher-quality stable `gemini-3.1-flash-image` is approximately $0.067 per 1K image, or $2.01 for thirty. The price difference is small enough that visual quality should be evaluated rather than inferred from price.
- Paid Gemini API content is not used to improve Google's products. Google may retain content for an unspecified limited period for abuse/legal purposes, and does not promise India-only or other specific regional processing.
- The Interactions API stores state by default; every request must set `store: false`. Developer logging, Files, saved datasets, explicit caching, and Search/Maps grounding create additional retention surfaces and are unnecessary here.
- New Gemini authorization keys are bound to Google Cloud service accounts and limited to the Generative Language API. One such key can call both text and image models; Google does not offer per-model key restrictions. Paid activation can require a $10 prepayment.
- Google's current Gemini API Additional Terms say it is for developers building for professional or business purposes and `not for consumer use`. Applicability to a developer's strictly personal single-user journal is therefore ambiguous and must not be represented as resolved.

**Proposed**

- Use Gemini through Vertex AI under the Google Cloud terms rather than the Gemini Developer API. The published Cloud terms do not contain the Developer API's `not for consumer use` restriction, although Google does not publish an explicit personal-journal use-case guarantee.
- Use `gemini-3.5-flash-lite` with minimal thinking and structured JSON for daily text, and start the synthetic image evaluation with `gemini-3.1-flash-lite-image` versus `gemini-3.1-flash-image` at 1K 4:5.
- Model two independent settings—Text Provider and Artwork Provider—rather than one coarse switch. Each applies only to new generations; manual regeneration creates a new version with its own provider/model provenance.
- Never silently fall back to the non-selected provider. A failure must remain visible so Arun can explicitly retry or select another provider before any journal text crosses that boundary.
- Use only paid Google service, choose single-turn `generateContent` or set `store: false`, disable tools, request logging, grounding, files, and explicit caches, and never send Daily Photos, their metadata, filenames, or image-derived descriptions.
- Use a dedicated Google Cloud project and service account with only `roles/aiplatform.user`. On Hetzner, the simplest MVP credential is a root-readable service-account key; it is a long-lived secret and should be rotated. Workload Identity Federation is preferable only if a suitable external identity provider is introduced.

**Vertex AI qualification**

- Google Cloud's service terms state that Google does not train or fine-tune managed AI models on Customer Data without permission or instruction and treats generated output as Customer Data.
- Vertex request/response logging is disabled by default and must stay disabled. In-memory project-isolated caching can last up to 24 hours and can be disabled.
- Automated abuse monitoring may retain a flagged prompt for up to 90 days and allow authorized review; it is not used for training. An approved abuse-logging exception may be requested but must not be claimed before approval.
- Vertex global pricing matches the Gemini Developer API rates used in the estimates above. `gemini-3.5-flash-lite` can use global, US, or EU endpoints; `gemini-3.1-flash-lite-image` is global-only, so Generated Artwork cannot claim regional processing.
- Vertex has no separate published platform fee or Developer API-style minimum prepayment. One service-account identity can call the selected text and image models.

Sources:

- [Gemini 3.5 Flash-Lite](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite)
- [Gemini 3.1 Flash Lite Image](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite-image)
- [Gemini 3.1 Flash Image](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-image)
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- [Gemini API keys](https://ai.google.dev/gemini-api/docs/api-key)
- [Gemini API billing](https://ai.google.dev/gemini-api/docs/billing)
- [Gemini data logging](https://ai.google.dev/gemini-api/docs/logs-policy)
- [Gemini zero-data-retention controls](https://ai.google.dev/gemini-api/docs/zdr)
- [Google Cloud terms](https://cloud.google.com/terms)
- [Google Cloud AI service terms](https://cloud.google.com/terms/service-terms)
- [Vertex AI zero-data-retention guidance](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/vertex-ai-zero-data-retention)
- [Vertex AI abuse monitoring](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/abuse-monitoring)
- [Vertex AI pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)

## Backup and restoration research

### Provider comparison

These figures describe actual bytes retained in the encrypted backup repository after Restic deduplication and retention, not the size of the current live dataset. Prices exclude tax.

| Retained repository | Backblaze B2 | Cloudflare R2 Standard | Hetzner Object Storage |
| ---: | ---: | ---: | ---: |
| 5 GB | $0/month | $0/month | About EUR 6.49/month minimum |
| 10 GB | $0/month | $0/month | About EUR 6.49/month minimum |
| 25 GB | $0.10425/month | $0.225/month | About EUR 6.49/month minimum |
| 100 GB | $0.62550/month | $1.35/month | About EUR 6.49/month minimum |

**Documented**

- Backblaze B2 includes the first 10 GB, then costs $0.00695 per GB-month. Current ordinary transactions are free, and egress up to three times average monthly storage is free.
- Cloudflare R2 Standard includes the first 10 GB-month, one million Class A operations, ten million Class B operations, and all egress; storage above the free tier costs $0.015 per GB-month.
- Hetzner Object Storage's roughly EUR 6.49 minimum includes 1 TB, but that capacity is unnecessary at launch and shares a provider/control-plane failure domain with the live server.
- Hetzner server Backups retain only seven daily slots, are bound to the server, disappear when it is deleted, and do not cover attached Volumes. They are useful for host recovery but are not the journal's independent data backup.

**Proposed**

- Use Restic with client-side encryption into one private Backblaze B2 EU Central bucket. It is the lowest-cost option at this scale and creates a failure boundary independent of Hetzner and Cloudflare.
- Back up an application-consistent database export, all original photos and Uploaded Journals, Derived Artifacts, a manifest, and the minimal configuration needed to rebuild the service.
- Target an hourly backup after a short ingestion debounce, keeping 48 hourly, 30 daily, and 12 monthly snapshots. Deduplication means unchanged photos are not copied once per retained snapshot.
- Run `restic check` plus a sampled database/photo restore monthly and a complete recovery drill into a fresh disposable host quarterly. Treat four hours as an acceptance target for restoring up to 100 GB, to be validated rather than promised.
- Keep the Restic repository password in Arun's password manager plus an offline recovery copy. Losing it makes the encrypted backup unrecoverable.
- Alert on a missed backup or failed verification. A completed upload alone is not restore evidence.

### Object Lock limitation

Backblaze Object Lock is useful but is not a safe blanket setting for the live Restic repository. Restic's lock cleanup, `forget`, and `prune` operations need mutation and deletion; a default retention lock can make maintenance fail and strand storage. The proposed MVP therefore uses a bucket-scoped non-master Read/Write key, MFA, usage alerts, and tested restores, without Object Lock or a bucket lifecycle rule. This recovers from host/disk loss, but a fully compromised server plus its writer credential could delete the remote repository. If ransomware-resistant immutability becomes a requirement, add a separate lock-aware immutable export flow rather than silently applying Object Lock to Restic.

Sources:

- [Backblaze B2 transaction and storage pricing](https://www.backblaze.com/cloud-storage/transaction-pricing)
- [Backblaze Restic integration](https://www.backblaze.com/docs/cloud-storage-integrate-restic-with-backblaze-b2)
- [Backblaze application keys](https://www.backblaze.com/docs/en/cloud-storage-application-keys)
- [Backblaze Object Lock](https://www.backblaze.com/docs/cloud-storage-object-lock)
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Hetzner Object Storage](https://www.hetzner.com/storage/object-storage/)
- [Hetzner backup and snapshot FAQ](https://docs.hetzner.com/cloud/servers/backups-snapshots/faq/)

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

### Live-storage and processor boundaries

**Documented**

- Hetzner assigns encryption of live data and backups at rest to the customer; it does not promise provider-managed encryption at rest for Cloud Servers or their Backups.
- Hetzner Cloud Volumes are triple-replicated availability storage rather than backups. They grow from 10 GB to 10 TB in one-GB increments, cannot shrink, and are excluded from server Backups and Snapshots.
- Current Volume pricing is EUR 0.044 per GB-month: 50 GB is EUR 2.20/month and 100 GB is EUR 4.40/month.
- Telegram bot conversations are Telegram Cloud Chats, not Secret Chats with end-to-end encryption. Photos and documents necessarily pass through and may remain on Telegram until Arun deletes them.
- Preserving exact bytes means preserving the bytes Telegram supplies. Sending an image as a Telegram document is the original-quality path; an ordinary photo message may be recompressed.
- Cloudflare Tunnel routes the private application's HTTP traffic through Cloudflare. Private responses must disable caching, but `no-store` does not mean Cloudflare was absent from the transport path.

**Proposed**

- Encrypt journal content and source images at rest under an application-held key, with the recovery key stored outside the server in Arun's password manager. This protects copied disks and backups, not a compromised running root account.
- Never describe Life in Days as end-to-end encrypted or zero-knowledge: the running server must decrypt data for thumbnails/search, journal text may go to the selected AI providers, and Telegram, VoiceNotes, Hetzner, and Cloudflare remain infrastructure processors.
- The round-three provisional plan was to start with a 10 GB root-resident Life in Days media budget for zero incremental cost and move to a 50 GB Volume before free space fell below 12 GB. The detailed storage report below supersedes the Volume target: it keeps the same zero-cost launch and safety reserve but recommends an object-store migration path, still awaiting the product-owner choice.
- If free space reaches an emergency boundary, pause nonessential thumbnail/artwork work and reject new media with a clear Telegram failure; never silently delete or downsample originals.

Sources:

- [Cloudflare Tunnel routing](https://developers.cloudflare.com/tunnel/routing/)
- [Cloudflare Access application paths](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/)
- [Cloudflare Access common policies](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/common-policies/)
- [Hetzner backup and snapshot FAQ](https://docs.hetzner.com/cloud/servers/backups-snapshots/faq/)
- [Hetzner technical and organizational measures](https://docs.hetzner.com/general/security-and-identify/technical-and-organizational-measures/)
- [Hetzner Cloud Volumes](https://docs.hetzner.com/cloud/volumes/overview/)
- [Telegram privacy policy](https://www.telegram.org/privacy)
- [Cloudflare Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/)

## Private web authentication research

**Documented**

- Cloudflare Access does not maintain an arbitrary application-specific username/password database. Human authentication is delegated to a configured identity provider.
- Cloudflare's first-party identity provider authenticates with an existing Cloudflare account and can restrict access to members of the current Cloudflare account. Access can then allow one exact account email.
- Other supported low-complexity options are email one-time PIN, whose codes are single-use and expire after ten minutes, or Google as an external identity provider.
- Cloudflare Access service tokens are machine credentials, not a human username/password facility.
- HTTP Basic Authentication would be implemented at the origin application. Placing it behind Access creates a second login layer; using it instead of Access means Access is not the login layer.
- The Zero Trust Free plan currently covers up to 50 users, so one-user Access adds no subscription cost.

**Proposed**

- Use Cloudflare's first-party identity provider, restrict it to the Cloudflare account that owns the zone, allow Arun's exact account identity, require MFA on that account, and use a seven-day Access session.
- Do not build an application password database or request a human password from Arun. Any credential pasted into chat or an attachment is exposed and must not be reused.
- Validate the signed Access assertion at the application boundary and keep the origin bound to loopback behind the existing outbound-only Tunnel.
- Return `Cache-Control: private, no-store` for journal HTML, APIs, media, thumbnails, search, and exports. Only content-hashed application assets containing no personal data may be shared-cacheable.
- Prefer a separate machine-only webhook hostname so no human content route needs an Access bypass. Telegram and VoiceNotes endpoints still require their own application-level authentication and minimization.

Sources:

- [Cloudflare identity provider](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/cloudflare/)
- [Access session management](https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/session-management/)
- [Email one-time PIN](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/)
- [Validating Access assertions](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)
- [Access application paths](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/)
- [Cloudflare cache-control behavior](https://developers.cloudflare.com/cache/concepts/cache-control/)
- [Cloudflare Zero Trust plans](https://www.cloudflare.com/plans/zero-trust-services/)

## Research-driven safeguards

- Preserve raw VoiceNotes transcripts and original photos separately from AI-authored summaries, tags, and artwork.
- Never present generated art as a factual photo of the day.
- Never generate imagery for an empty day.
- Do not use webhook receipt time as the day without a deliberate dating policy.
- Do not claim end-to-end encryption while the server or an AI provider can read journal content.
- Document VoiceNotes, Telegram, Cloudflare, Hetzner, and any AI provider as distinct data processors and trust boundaries.
- Make export, deletion, backup, and restoration product requirements rather than operational afterthoughts.

## Detailed evaluation reports

These reports supersede the earlier preliminary model and live-storage estimates where their assumptions differ. Arun approved their evaluation protocols, the combined one-time evaluation ceiling, and the R2/B2 storage direction on 2026-08-13. Exact AI model adoption remains provisional until the synthetic evaluations are run.

- [AI text model evaluation](AI-TEXT-MODEL-EVALUATION.md): provisional OpenAI and Google candidates, complete cost/privacy/lifecycle comparison, and a journal-fidelity bake-off with critical-invention gates.
- [AI artwork model evaluation](AI-ARTWORK-MODEL-EVALUATION.md): current first-party provider screen, all-in-cost caveats, permanent-retention/privacy gates, and a blind two-stage visual bake-off.
- [Private media storage evaluation](MEDIA-STORAGE-EVALUATION.md): launch on the existing disk at zero incremental cost, then prefer private R2 Standard in the EU jurisdiction over coupling live media and Restic backup to B2; a Hetzner Volume remains a filesystem-simplicity fallback rather than the cost recommendation.
