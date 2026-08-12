# Life in Days — AI Artwork Model Evaluation

**Status:** Decision report; the production default remains provisional until the blind bake-off in this document is run  
**Research cut-off:** 2026-08-12  
**Scope:** Hosted, first-party text-to-image APIs for private, single-user journal artwork  
**Production input:** Text only. Real photos, photo bytes, thumbnails, EXIF, Telegram file identifiers, and other photo metadata must never be sent to an AI provider.  
**Target output:** A warm, painterly editorial illustration in a native or exact 4:5 composition, suitable for a calendar tile and a Journal Day detail page

## Executive recommendation

Run the required blind synthetic bake-off with these four currently viable candidates:

1. **OpenAI GPT Image 2** — `gpt-image-2-2026-04-21`, medium quality, exact `1024x1280` JPEG.
2. **Google Gemini 3.1 Flash Lite Image** — `gemini-3.1-flash-lite-image`, 1K, provider 4:5 setting.
3. **Google Gemini 3.1 Flash Image** — `gemini-3.1-flash-image`, 1K, provider 4:5 setting.
4. **Google Gemini 3 Pro Image** — `gemini-3-pro-image`, 1K, provider 4:5 setting.

Do **not** interpret that bake-off set as the production dropdown. The smallest useful MVP dropdown should contain **one OpenAI model and one Google model**, selected after Arun scores the images blind:

| Proposed role | Candidate | Why it could earn the role |
|---|---|---|
| OpenAI option | GPT Image 2 | It is OpenAI's only current non-deprecated image model, has a dated snapshot, supports exact 4:5 output, and has a moderate modeled cost. |
| Google option | Gemini 3.1 Flash Image, or Flash Lite Image if its visual result is close | Flash has the longer published lifecycle and is Google's balanced image model. Lite is cheaper and faster but is designated a short-term model. |

Gemini 3 Pro Image should remain a bake-off quality ceiling, not an automatic dropdown entry. Its token-rate-derived image output plus the assumed prompt is already about **$4.05 for 30 images before billed thinking or other text-output tokens**. Because Pro Image supports only `HIGH` thinking, its all-in cost cannot be represented honestly until measured. Include it only if it produces a material, repeatable visual gain and, if enabled, make it technically ineligible for the automatic sweep rather than relying on a “manual-first” label.

No credible source reviewed establishes a cross-provider winner for Life in Days' desired style. Provider descriptions are positioning claims, not independent evidence. The report therefore makes a **provisional operational recommendation**, while the blind bake-off decides visual taste and fidelity.

### Provisional default before the bake-off

If implementation needs a temporary default solely to build the integration, use **GPT Image 2 pinned to `gpt-image-2-2026-04-21`**. This is an inference based on its snapshot pin, exact 4:5 support, acceptable estimated cost, and low integration complexity—not a claim that it produces better artwork than Google.

## Decision language

This report uses four evidence labels:

- **Documented:** stated in a cited first-party model, API, pricing, privacy, lifecycle, or contract source.
- **Provider positioning:** the vendor's own qualitative description; useful for candidate selection but not cross-provider proof.
- **Inference:** a conclusion drawn from documented facts for this product.
- **Proposed:** an implementation or evaluation rule that Life in Days has not yet validated.

All prices are public list prices observed on the research cut-off date. They exclude tax, currency conversion, failed requests that may still be billed, retries, and negotiated discounts. Availability, account eligibility, prices, and terms must be rechecked before credentials are created and again before production launch.

## Non-negotiable gates

A model can appear in the production artwork dropdown only if all of these gates pass:

1. It is a current stable or GA first-party API model, not preview, deprecated, legacy-with-imminent-retirement, or scheduled for shutdown.
2. Its commercial/API terms permit Life in Days to store generated assets permanently in the private archive.
3. The provider does not use ordinary API prompts or outputs for model training by default, subject only to clearly documented abuse/safety handling.
4. It accepts text-only generation and does not require a real photo or other image input.
5. It can produce a native or exact 4:5 image without a destructive central crop.
6. Its output can be downloaded immediately and retained locally, with provider/model provenance recorded.
7. Its cost fits the $5 monthly application ceiling under a realistic 30-generation scenario with room for text generation and occasional retries.
8. It passes the synthetic safety, reliability, and blind visual-quality protocol below.
9. It can be authenticated server-side without putting credentials in the browser, Git, Telegram, or the application database.

Privacy and contract compliance are pass/fail gates. A beautiful result cannot compensate for failing them.

## Production workload and normalization assumptions

The comparison models artwork generation only. Text title/summary/tag generation is costed separately in the text-model report.

- 10, 20, or 30 successful artwork generations in a month.
- One image per generation.
- Text-only prompt of **300 input tokens**. No image input is ever sent.
- Medium/default quality at approximately 1K portrait resolution.
- Native/exact 4:5 output where supported.
- Standard synchronous pricing without batch, cache, commitment, or volume discounts.
- Cost tables use provider-published per-image figures where available. Token-priced output is converted using the provider's published token count for the selected size.
- Failed or safety-blocked requests, retries, and regenerated versions are excluded from the base scenarios and must be metered separately in production.

At this volume, small price differences are less important than visual fit, truthful restraint, privacy, lifecycle stability, and predictable failure handling.

## Current stable candidate inventory

### OpenAI

OpenAI's current [model catalog](https://developers.openai.com/api/docs/models/all) lists **GPT Image 2** as its active image model and marks GPT Image 1.5, `chatgpt-image-latest`, GPT Image 1 Mini, and GPT Image 1 deprecated. The [GPT Image 2 model page](https://developers.openai.com/api/docs/models/gpt-image-2) publishes a dated snapshot.

| Model | Exact production ID | Version behavior | Output for this product | Provider positioning | Disposition |
|---|---|---|---|---|---|
| GPT Image 2 | `gpt-image-2-2026-04-21` | Dated snapshot is available; `gpt-image-2` is the moving alias | Exact `1024x1280` is valid; use medium-quality JPEG | OpenAI describes it as its current state-of-the-art, fast, high-quality image model | **Bake-off and production candidate** |

The [image generation guide](https://developers.openai.com/api/docs/guides/image-generation) permits arbitrary dimensions when both edges are multiples of 16, neither edge exceeds 3,840 pixels, aspect ratio is at most 3:1, and the total pixel count is within the documented range. `1024x1280` satisfies those conditions and is exact 4:5. JPEG is preferred for this app because OpenAI documents it as faster to encode than PNG and the desired output is painterly rather than transparency-dependent.

OpenAI's [Services Agreement](https://openai.com/policies/services-agreement/) says that, as between the customer and OpenAI and to the extent permitted by law, the customer owns output. Together with immediate API download, that supports permanent storage in Life in Days under the governing commercial account terms. Recheck the exact account agreement before production because an order form or service-specific term can control.

**Versioning recommendation — proposed.** Send the dated snapshot, not the moving alias. Persist both the configured alias family and the exact requested snapshot. If the API returns a distinct resolved identifier, persist that too.

### Google Gemini image models

Google Cloud's current [Agent Platform image-generation guide](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/image-generation), dedicated model pages, [pricing table](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing), [thinking controls](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/thinking), and [lifecycle table](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions) establish the following stable image family. This is the exact paid Google Cloud surface proposed for production; Gemini Developer API examples are not the production contract.

| Model | Exact model ID | Provider portrait output at selected tier | Published lifecycle position | Provider positioning | Disposition |
|---|---|---:|---|---|---|
| Gemini 3.1 Flash Lite Image | `gemini-3.1-flash-lite-image` | 1K; model supports native 4:5 | Released 2026-06-30; designated short-term; no retirement date announced | Fastest and least expensive; provider target below two seconds; not optimized for complex multi-reference or multi-turn editing | **Bake-off candidate; economy option only if quality passes** |
| Gemini 3.1 Flash Image | `gemini-3.1-flash-image` | `928x1152` at 1K | Released 2026-05-28; published retirement no earlier than 2027-05-28 | General-purpose workhorse balancing quality, speed, and price | **Bake-off and likely Google production candidate** |
| Gemini 3 Pro Image | `gemini-3-pro-image` | `928x1152` at 1K; 2K and 4K also available | Released 2026-05-28; published retirement no earlier than 2027-05-28 | Premium, reasoning-driven model for complex, professional-grade work | **Bake-off quality ceiling; not a default dropdown item** |
| Gemini 2.5 Flash Image | `gemini-2.5-flash-image` | Native portrait options documented | Legacy; published retirement 2026-10-02; Google recommends transition | Earlier Flash image generation | **Exclude from new adoption** |

The Cloud model pages for [Flash Lite](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-lite-image), [Flash](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-image), and [Pro](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-pro-image) provide the provider positioning and production model IDs above. The 4:5 size tables specify `928x1152` for 1K Flash and Pro output. That ratio is close to, but not mathematically exact, 4:5; display it inside a 4:5 frame using a tiny letterbox/padded background rather than silently cropping content. Confirm the actual Flash Lite dimensions from the returned file during the bake-off.

Google's lifecycle page says short-term models can be retired on a substantially shorter notice window after a replacement appears. That makes Flash Lite's low price attractive but creates more migration risk than Flash. This is why the model should earn its place through a meaningful speed or cost benefit without a meaningful visual penalty.

**Versioning limitation — documented.** The reviewed Google pages publish stable model IDs and release/lifecycle dates but no dated snapshot suffix equivalent to OpenAI's GPT Image 2 snapshot. Persist the exact requested model ID, API version, returned model identifier when present, project/location, and generation timestamp. Re-run the bake-off after a material alias/model revision or migration notice.

Google Cloud's current [Service Specific Terms](https://cloud.google.com/terms/service-terms) define Generated Output as Customer Data and state that Google does not assert ownership rights in new intellectual property created in that output. They also state that, absent the customer's instruction or permission, Google will not store prompts outside the customer's account longer than reasonably necessary to generate the output or store the output outside that account. Those terms support Life in Days downloading and retaining the generated file in its private archive; they do not remove abuse-monitoring exceptions or guarantee exclusivity, and the exact account agreement must be rechecked before production.

### Google Imagen models

The same current Google image guide states that **all Imagen models are deprecated and will shut down on 2026-08-17**, five days after this report's cut-off. That includes the formerly relevant GA Imagen 4 IDs:

- `imagen-4.0-fast-generate-001`
- `imagen-4.0-generate-001`
- `imagen-4.0-ultra-generate-001`

Their former price and quality tiers are irrelevant to a new trustworthy archive because the service lifetime is measured in days. They must not appear in the dropdown or bake-off, and no implementation should be built against them.

## Normalized cost comparison

### Per-image calculation

| Candidate and setting | Published image-output basis | 300-token text input | Modeled total per success | Confidence note |
|---|---:|---:|---:|---|
| OpenAI GPT Image 2, medium, `1024x1280` | **$0.0453** from the official calculator's 1,510 image-output-token estimate at $30/MTok | $0.0015 at $5/MTok | **$0.0468** | Planning estimate for the exact custom size; record provider-reported usage and invoice cost. |
| Google Gemini 3.1 Flash Lite Image, 1K | $0.0336 from 1,120 image-output tokens at $30/MTok | $0.000075 at $0.25/MTok | **At least $0.033675** | Token-rate-derived floor before billed thinking or other text-output tokens; set `MINIMAL` and measure all-in usage. |
| Google Gemini 3.1 Flash Image, 1K | $0.0672 from 1,120 image-output tokens at $60/MTok | $0.00015 at $0.50/MTok | **At least $0.06735** | Token-rate-derived floor before billed thinking or other text-output tokens; set `MINIMAL` and measure all-in usage. |
| Google Gemini 3 Pro Image, 1K | $0.1344 from 1,120 image-output tokens at $120/MTok | $0.0006 at $2/MTok | **At least $0.135** | Token-rate-derived floor before mandatory `HIGH` thinking or other text-output tokens; 1K and 2K use the same published image tokens. |

OpenAI's image guide links an official calculator for custom output sizes. On the research date it estimated 1,510 output tokens for medium `1024x1280`; at the model page's $30/MTok image-output rate that is $0.0453, plus $0.0015 for the assumed prompt. This supersedes the earlier `1024x1536` proxy and is still an estimate rather than a billing guarantee. The application must prefer provider-reported usage or invoice reconciliation.

Google's pricing table publishes image-output rates of **$30 / $60 / $120 per million tokens** for Lite/Flash/Pro and states that a 1K image is 1,120 image-output tokens. The report calculates from those token rates rather than adding the separately rounded provider display prices to an exact prompt charge. These are not complete request totals: other output modalities and thinking tokens are billable. Cloud's thinking table says Lite and Flash default to `MINIMAL`, which is close to but not zero thinking, while Pro Image supports only `HIGH`. The input prompt is included above; all-in thinking/text output remains unknown until measured.

### Monthly artwork cost

| Candidate | 10 successful images | 20 successful images | 30 successful images | Minimum share of $5 cap at 30 |
|---|---:|---:|---:|---:|
| OpenAI GPT Image 2 medium, estimated | **$0.47** | **$0.94** | **$1.40** | 28.1% |
| Google Gemini 3.1 Flash Lite Image 1K | **At least $0.34** | **At least $0.67** | **At least $1.01** | At least 20.2% |
| Google Gemini 3.1 Flash Image 1K | **At least $0.67** | **At least $1.35** | **At least $2.02** | At least 40.4% |
| Google Gemini 3 Pro Image 1K | **At least $1.35** | **At least $2.70** | **At least $4.05** | At least 81.0% |

**Inference.** GPT Image 2 leaves clear modeled headroom under the $5 ceiling. Flash Lite and Flash likely do too, but that must be confirmed from all-in billed thinking/text-output usage. Pro does not have demonstrated headroom at 30 images and must not drive the automatic sweep unless a measured upper bound fits the ceiling. Since the image-output differences among the first three are about one dollar per month or less, quality and trust should choose the default.

**Required production behavior — proposed.** Meter actual provider usage and estimated USD for every attempt, including failures where usage is returned. Warn at the existing 80% ceiling. At 100%, pause the automatic 01:00 artwork sweep but preserve capture, backup, text processing, and explicit visibility of the skipped job. A manual request should show the budget condition rather than silently switching model or provider.

## Quality and style evidence

### What first-party sources establish

- OpenAI positions GPT Image 2 as its current highest-quality and fast image model.
- Google positions Flash Lite as fastest/cheapest, Flash as the generalist balance, and Pro as the premium complex-work model.
- Every shortlisted model supports text-to-image generation at a portrait ratio close to or exactly 4:5.
- The shortlisted providers apply prompt/output safety systems and can refuse a request.

### What the sources do not establish

- They do not compare the models on Life in Days' warm painterly editorial style.
- They do not measure whether an image invents emotionally loaded or personally specific details.
- They do not measure legibility as a small calendar tile.
- They do not establish Arun's preference.
- They do not prove typical latency from a Hetzner server on the deployment path.

General text-to-image leaderboards are not a decision substitute. They mix versions, prompts, sizes, hidden preference populations, and sometimes photorealism-heavy tasks. The relevant failure mode is not merely an unattractive image; it is a plausible but false visual memory being presented as if it reflected the journal. The synthetic bake-off is therefore the quality evidence for this product.

### Production visual brief — proposed

Send the artwork provider a short, source-grounded **150–300-token visual brief**, not the full raw journal, unless the bake-off demonstrates that the full text is necessary. This minimizes disclosure and makes invented specifics easier to audit. The brief should contain only:

- the dominant setting or symbolic motif explicitly grounded in the text;
- a restrained emotional tone, only when stated or safely represented abstractly;
- a short list of permitted objects or environmental details;
- the fixed Life in Days style contract; and
- explicit exclusions.

Fixed style contract:

> Warm painterly editorial illustration, restrained texture, quiet composition, symbolic rather than literal, non-photorealistic, no recognizable likeness, no words, no logo, no signature, no imitation of a named living artist, composed for a 4:5 calendar cover.

Never include a Daily Photo, a description inferred from a Daily Photo, a person's full name, Telegram identifiers, VoiceNotes identifiers, or other irrelevant account metadata.

## Latency, reliability, and API operation

| Candidate | Documented latency evidence | What must be measured |
|---|---|---|
| GPT Image 2 | OpenAI warns that complex image prompts can take up to two minutes. It makes no ordinary pay-as-you-go per-request latency guarantee. | End-to-end p50/p95 from Hetzner, timeout frequency, rate-limit behavior, safety block rate, and download/decode time. |
| Gemini 3.1 Flash Lite Image | Google gives a provider target below two seconds and positions it as its fastest image model; this is not an application SLA. | The same measures, including whether regional/global endpoint choice changes latency. |
| Gemini 3.1 Flash Image | Google positions it as low-latency/balanced but publishes no standard per-request guarantee. | The same measures. |
| Gemini 3 Pro Image | Google positions it for complex professional work rather than minimum latency; no standard per-request guarantee was found. | The same measures, especially tail latency at 01:00. |

One daily generation is far below ordinary throughput limits, but low volume does not eliminate transient `429`, `5xx`, network, or provider-capacity failures.

**Proposed failure policy:**

1. Give every generation an idempotency key derived from Journal Day, source-revision set, prompt-template version, model configuration, and trigger.
2. Retry only transient transport, rate-limit, or server errors with bounded exponential backoff. Do not retry a safety refusal automatically.
3. Do not silently route to the other provider or another model. That would disclose private text to an unselected processor and corrupt provenance.
4. If an automatic sweep fails, retain a visible failed/skipped artwork job and offer explicit retry after the budget or provider condition is resolved.
5. Download and checksum the returned original immediately. Do not depend on a provider URL as permanent storage.
6. Preserve the raw provider file unchanged. Generate calendar/detail derivatives locally.

## Safety behavior

OpenAI's [image safety documentation](https://developers.openai.com/api/docs/guides/image-generation) states that prompts and outputs are filtered. Its `moderation` setting supports the documented defaults; use `auto`, not the more permissive `low`, for MVP. The API can report whether a refusal occurred at input or output and can expose a coarse category.

Google's image APIs also apply safety filtering and return safety-related blocking information. The exact response shape must be verified for each selected model/endpoint in the spike because it can differ across API surfaces and revisions.

**Proposed product behavior:**

- Record a coarse provider block category and stage when supplied, but never put raw journal text or the full prompt in operational logs.
- Show “Artwork could not be generated under the provider's safety policy” on the Journal Day. Do not imply the journal itself is wrong.
- Allow Arun to inspect and manually edit the derived visual brief, then explicitly retry.
- Never modify, redact, or overwrite the source journal to obtain an image.
- Do not repeatedly auto-retry a refused 01:00 job.
- Treat a missing or blocked image as an ordinary supported state. The archive remains trustworthy without generated artwork.

## Provenance, watermarking, and generated-content labeling

### Provider provenance

OpenAI states that supported API-generated images include **C2PA metadata and SynthID**. Its [provenance help article](https://help.openai.com/en/articles/8912793-c2pa-and-synthid-in-openai-generated-images) also cautions that metadata can be removed and invisible watermarks can be degraded by transforms.

Google states in its image guide that all Gemini-generated images include **SynthID**. The Flash Lite model page additionally documents **C2PA**. Do not assume every returned Google format/model contains readable C2PA until the raw bake-off files are inspected.

These mechanisms supplement but do not replace Life in Days' records. A derivative thumbnail, format conversion, screenshot, or export can lose metadata. The application must:

- retain the untouched provider file;
- display a visible **AI artwork** label wherever generated art appears;
- never present generated artwork as a real Daily Photo;
- prevent generated artwork from becoming Calendar Cover while any real Daily Photo exists; and
- retain internal provenance even if the file's external metadata is absent.

### Required generation record

Persist at least these fields for every attempt and every resulting artifact:

| Area | Required fields |
|---|---|
| Identity | Internal generation ID; Derived Artifact ID and version; Journal Day; trigger (`manual` or `01:00_sweep`); created UTC; completed UTC |
| Source binding | Ordered source-item IDs and exact source-revision IDs; Correction IDs where applicable; stale/current state |
| Provider | Provider code/display name; non-secret provider project/account identifier; endpoint; API version; location/region |
| Model | Requested alias/family; exact requested snapshot/model ID; provider-returned resolved model ID when present; local model-config version |
| Prompt | Visual-brief template version; encrypted exact submitted prompt or encrypted brief; SHA-256 of exact submitted bytes; prompt language; no plaintext prompt in application or infrastructure logs |
| Parameters | Aspect ratio; requested width/height; quality; format; compression; background; safety/moderation configuration; number of outputs; seed if supported/returned, otherwise `null` |
| Result | Attempt number; status; provider request ID; refusal stage/category; error class; retryability; latency milliseconds |
| Usage and cost | Provider-reported input/output tokens; output image count; estimated USD; reconciled/actual USD when available; pricing-table version/date |
| Original asset | Original MIME; actual dimensions; byte length; SHA-256; local object/path ID; downloaded UTC; C2PA presence/validation result; SynthID detection result if a supported detector is available |
| Derivatives | Local transform/version; derivative dimensions/MIME/checksum; whether provider metadata was preserved or lost |
| Selection | Selected artwork version; cover eligibility; visible-label version; deletion/suppression state |

Do not invent a seed when a provider does not expose one. Stochastic output is expected; model ID and prompt alone do not reproduce an identical image.

## Privacy, retention, training, and residency

“Not used for training” does not mean “zero retention,” and a regional storage choice does not necessarily mean regional processing.

| Provider | Training default | Relevant retention/state | Residency boundary | MVP configuration |
|---|---|---|---|---|
| OpenAI API | OpenAI states API/business data is not used to train by default unless the customer opts in | `/v1/images/generations` is listed as having no application-state retention; eligible content may still enter abuse-monitoring logs retained up to 30 days. Zero Data Retention is approval-dependent, not assumed. | OpenAI documents data-residency controls with eligibility and configuration constraints. India supports regional storage, not India-only inference processing; image support can require enhanced controls/approval. | Use the stateless Image API, no uploaded files or image inputs, no provider-side asset store, and the pinned model. Do not claim ZDR unless the account is approved and verified. |
| Google Cloud generative API | Google states it does not train or fine-tune on customer data without permission/instruction | Request-response logging is disabled by default. Project-isolated in-memory caching can persist up to 24 hours by default and should be disabled where the control is available. Suspicious prompts may be logged for up to 90 days for abuse review; an exception requires approval. | Model availability and data location depend on endpoint/region. No India-only image-processing promise is made in the reviewed material. | Use a stateless generation endpoint, request logging disabled, no grounding/tools/files/sessions, `store:false` wherever the selected API surface exposes it, and disable project cache where supported. |

Sources are OpenAI's [data controls matrix](https://developers.openai.com/api/docs/guides/your-data) and Google's [zero-data-retention overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/zero-data-retention), [abuse-monitoring policy](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/abuse-monitoring), and [service-specific terms](https://cloud.google.com/terms/service-terms).

The approved Google surface for this report is the paid Google Cloud Gemini Enterprise Agent Platform API, called with the Google Gen AI SDK configured by `GOOGLE_GENAI_USE_ENTERPRISE=True`, an explicit Cloud project, and the exact supported location (currently `global` for these image models). Do not substitute the Gemini Developer API, a consumer Gemini account, or a free-tier developer key; those are different surfaces with different authentication and data-handling conditions. Stage 0 must verify the model ID, endpoint, project, location, and billing surface on the actual paid account.

### Data-minimization recommendation

The user's approved boundary allows journal text to be sent to an explicitly selected provider. It does not require sending the complete journal. Prefer the short visual brief described above. Keep the canonical source, prompt construction, and generated output in Life in Days. Do not use provider file stores, vector stores, search/grounding, persistent conversation/session APIs, or prompt caches for artwork generation.

Never silently fall back. If Arun changes the Artwork Provider setting, the new choice applies only to future generations. Existing artwork retains the full original provider/model provenance.

## Authentication and operational simplicity

### OpenAI

- Create a dedicated OpenAI API project for Life in Days and a workload-specific project service-account key.
- Keep the key in the Hetzner server's secret environment or root-readable secret file, never in Git, JavaScript, Telegram, the database, screenshots, or exports.
- Restrict permissions to the needed image endpoint where the exact key type supports it, set a small provider budget alert, and rotate the key.
- Server authentication is a single bearer credential. This is the simpler of the two integrations operationally.

Official references: [API key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety), [key permissions](https://help.openai.com/en/articles/8867743-assign-api-key-permissions), and [production practices](https://platform.openai.com/docs/guides/production-best-practices).

### Google Cloud

- Create a dedicated Google Cloud project with billing and the relevant generative API enabled.
- Create one service account for Life in Days with only the permission needed to call the selected model; Google's documented broad caller role is `roles/aiplatform.user`, but a narrower custom role should be evaluated before deployment.
- On Hetzner, Application Default Credentials with a root-readable service-account credential file is the simplest MVP path, but it is a long-lived secret. Workload Identity Federation is the preferred later path if a suitable external identity provider is introduced.
- Do not ship a browser API key. Keep project, location, and credential identity explicit in server configuration.

Google's [Application Default Credentials guide](https://docs.cloud.google.com/docs/authentication/application-default-credentials) warns that service-account keys carry security risk and recommends federation when feasible. Its [service-account overview](https://docs.cloud.google.com/iam/docs/service-account-overview) and [Agent Platform access-control reference](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/general/access-control) document the workload identity and roles.

### Configuration model — proposed

Keep two independent settings as already required:

- `text_provider_model`
- `artwork_provider_model`

Artwork selection stores an approved configuration record, not a free-form model string: provider, display label, exact model/snapshot ID, endpoint/API version, region, default size, quality, format, safety setting, estimated unit cost, lifecycle review date, enabled/disabled state, and a separate `automatic_sweep_eligible` flag. Secrets are referenced from runtime configuration, never stored in that record.

## Other hosted provider families screened

This was a bounded first-party API screen, not an attempt to list every image website or model host. A provider was investigated further when it had a current first-party API, current first-party pricing, and commercial/privacy terms that could plausibly support a permanent private journal archive.

| Provider/family | Current first-party evidence | Screening result |
|---|---|---|
| Recraft V4.1, `recraftv4_1` | Current [API guide](https://www.recraft.ai/docs/api-reference/getting-started), [pricing](https://www.recraft.ai/docs/api-reference/pricing), [size appendix](https://www.recraft.ai/docs/api-reference/appendix), and [developer terms](https://www.recraft.ai/legal/developer-terms). Its provider-designated 4:5 setting returns `896x1152` (mathematically 7:9), costs $0.035/image, uses bearer auth, and provides temporary results. | **Exclude on contract gate.** Terms effective 2026-08-11 allow local caching for no more than 30 days and prohibit building a persistent content database/repository from API assets. That is incompatible with a lifelong archive. Re-evaluate only if Recraft changes or contractually waives this restriction in writing. |
| Black Forest Labs FLUX.2 | Current [first-party pricing](https://docs.bfl.ai/quick_start/pricing) ranges from roughly $0.014 for Klein 4B to $0.07 for Max at the documented output basis. The current [FLUX API terms](https://bfl.ai/legal/flux-api-service-terms) grant BFL broad, perpetual rights over inputs/outputs and expressly permit model training/improvement. | **Exclude on privacy gate** for intimate journal text. An enterprise agreement with materially different data terms would be a separate procurement decision, not a simple MVP option. |
| Stability AI / Stable Image | A current self-serve platform exists, but the static first-party materials reviewed did not establish a sufficiently precise API-specific no-training, prompt-retention, generated-asset retention, and current per-model price contract for this private journal use. The general [privacy policy](https://stability.ai/privacy-policy) is not a substitute for those API-specific commitments. | **Exclude pending contract clarity.** This is not a claim that Stability necessarily trains ordinary API prompts; it is a finding that the required first-party assurances were not clear enough to approve the processor. |
| Ideogram API | The current [API terms](https://ideogram.ai/legal/api-tos) generally restrict model training on ordinary inputs/outputs but permit safety-training use of flagged content, require Ideogram attribution on pages enabling access, and grant broad rights over user data received through the API. The reviewed agreement also lagged the currently marketed model generation. | **Exclude on contract and product-simplicity gates.** Reconsider only under updated terms or a negotiated order that narrows data use and branding requirements. |
| Adobe Firefly Image 5 | Current [Firefly API documentation](https://developer.adobe.com/firefly-services/docs/firefly-api/) and Adobe's [generative-AI approach](https://www.adobe.com/ai/overview/firefly/gen-ai-approach.html) provide strong commercial-safety, no-training-on-customer-content, and Content Credentials positioning. | **Exclude from self-serve MVP.** [Authentication setup](https://developer.adobe.com/firefly-services/docs/guides/get-started) requires Adobe enterprise entitlement/admin setup and OAuth server-to-server credentials; no simple public pay-as-you-go per-image price was found. |
| Amazon Nova Canvas | AWS states in its [Bedrock privacy material](https://aws.amazon.com/bedrock/security-privacy-responsible-ai/) that Bedrock inputs/outputs are not shared with model providers or used to train base models. | **Exclude on lifecycle gate.** The [Nova Canvas model card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-canvas.html) marks `amazon.nova-canvas-v1:0` legacy with end of life on 2026-09-30, and no current successor image model was established for this report. |
| xAI Grok Imagine Image | The current [model page](https://docs.x.ai/developers/models/grok-imagine-image), [generation guide](https://docs.x.ai/developers/model-capabilities/images/generation), and [Enterprise Terms](https://x.ai/legal/terms-of-service-enterprise) establish a self-serve API, $0.02/image list output price, aliases, 30-day standard retention, no foundation-model training on User Content, and customer output ownership. | **Exclude on product and format gates.** The API terms restrict access to business purposes, while Life in Days is strictly personal, and the published generation aspect ratios omit 4:5. A clearly applicable personal API contract plus native/exact 4:5 support would be required before reconsideration. |

### Deliberately omitted surfaces

- **Azure OpenAI:** another cloud/control plane for the same OpenAI model family; it adds an integration without adding a distinct model for this single-user MVP.
- **Replicate, fal, and other aggregators:** they add another processor and retention/terms layer when direct first-party APIs already satisfy the model need.
- **Midjourney:** no generally available first-party self-serve production API was established.
- **Anthropic:** no first-party image-generation API.
- **Local/open-weight generation on the current Hetzner app server:** a useful quality level generally requires GPU capacity and non-trivial model operations. That is not zero-cost merely because weights may be downloadable, and it conflicts with the simplicity objective. Revisit only if offline processing becomes a stronger requirement.

## Required blind ten-prompt bake-off

The bake-off must occur before personal journal text is sent for artwork generation.

### Stage 0: hard-gate and integration checks

Before visual scoring, verify for every candidate:

- exact API model ID resolves on the intended paid account and endpoint;
- returned image can be downloaded and permanently retained under current terms;
- no image input is transmitted;
- output file decodes, has the expected portrait dimensions, and can be stored unchanged;
- provider request ID, usage, latency, block information, and returned model identifier are captured where available;
- C2PA metadata is inspected and recorded; SynthID is recorded as provider-asserted unless a supported detector is available;
- a safety refusal and a transient failure are handled visibly without provider fallback;
- the current list price and lifecycle state are rechecked.

Any contract/privacy/lifecycle failure removes the model before images are scored.

### Stage 1: synthetic prompt set

Create ten prompts before seeing any provider output. Each prompt should be a 150–300-token synthetic visual brief using the same fixed style contract and no real name, location, event, journal text, copyrighted character, brand, or named artist.

1. **Quiet workday:** a sunlit desk, notebook, tea, and one small plant; calm concentration; no person required.
2. **Rainy commute:** an Indian-city street in monsoon rain, umbrellas and reflected light; distant anonymous figures only.
3. **Family meal:** warmth around a dining table represented through generalized silhouettes and objects; no recognizable faces or likenesses.
4. **Difficult day:** weight and uncertainty represented symbolically through weather, space, or objects; no invented accident or dramatic event.
5. **Evening walk:** trees, long shadows, and gradual release after work; one anonymous distant figure at most.
6. **Understated celebration:** a small homemade cake, two candles, flowers, and quiet gratitude; avoid party clichés and text.
7. **Rest and recovery:** a softly lit room, folded blanket, medicine glass, and open window; gentle, non-clinical, not diagnostic.
8. **Train journey:** station platform, window reflections, luggage, and movement; no logos, signs, or readable text.
9. **Object fidelity:** a blue mug, red book, brass key, yellow scarf, and white flower arranged naturally; tests exact object/color adherence.
10. **Mixed emotion:** hope and sadness shown through an abstract shoreline at dawn; balanced rather than melodramatic.

Each candidate receives the semantically identical prompt. Provider-specific wrappers may express only the same fixed parameters and must be versioned. Do not tune a prompt after seeing one model's output unless the changed prompt is then rerun across every candidate as a new test version.

### Stage 1 generation settings

| Provider | Setting |
|---|---|
| OpenAI | `gpt-image-2-2026-04-21`, `1024x1280`, `quality=medium`, JPEG, `moderation=auto`, one image |
| Google Lite | Cloud Agent Platform `gemini-3.1-flash-lite-image`, global, 1K, 4:5, `thinking_level=MINIMAL`, one image |
| Google Flash | Cloud Agent Platform `gemini-3.1-flash-image`, global, 1K, 4:5, `thinking_level=MINIMAL`, one image |
| Google Pro | Cloud Agent Platform `gemini-3-pro-image`, global, 1K, 4:5, mandatory `thinking_level=HIGH`, one image |

This produces 40 stage-one images. The modeled image-output-plus-prompt floor is approximately:

- GPT Image 2: $0.47
- Gemini Flash Lite Image: at least $0.34
- Gemini Flash Image: at least $0.67
- Gemini Pro Image: at least $1.35
- **Total: at least about $2.83**, before Google thinking/text-output tokens, tax, retries, and blocked calls

No evaluation spend is pre-authorized. The existing $5 ceiling remains the only approved monthly AI limit. Before stage one, Arun must either approve a separate one-time evaluation ceiling or accept that text and artwork evaluation will be spread across billing months inside the $5 cap. A proposed combined ceiling appears below; research spend must never be silently exempted from cost controls.

### Blind presentation

1. Preserve every original file and its complete provenance in a restricted evaluation folder.
2. Create a separate local display derivative for the blind review. Scale every image into the same 400×500 CSS frame without cropping; use neutral padding when dimensions are not exact 4:5.
3. Assign a cryptographically random display code for each image within each prompt and conceal provider/model/file metadata from the review UI.
4. Randomize left-to-right order independently for each prompt.
5. Arun scores all four images for a prompt before the provider identities are revealed.
6. Record the blind score before discussion or identity reveal. Preserve the randomization manifest separately for later analysis.

Do not generate multiple images and privately choose the best one. One uncurated result per prompt measures the production experience.

### Blind visual rubric: 100 points

| Criterion | Weight | Scoring question |
|---|---:|---|
| Aesthetic fit and personal appeal | 25 | Does this feel like the warm, quiet, painterly editorial language Arun wants to revisit? |
| Prompt and object fidelity | 20 | Does it accurately include the requested scene, objects, colors, and relationships? |
| Truthful restraint | 15 | Does it avoid invented personal specifics, recognizable likeness, false drama, or literal claims unsupported by the brief? |
| Emotional appropriateness | 15 | Is the tone humane and proportionate without coaching, diagnosis, sentimentality, or melodrama? |
| Calendar-thumbnail legibility | 10 | Does the composition remain understandable and attractive at a small month-tile size? |
| Portrait composition | 5 | Is the important content safe and balanced in the 4:5 frame without requiring a central crop? |
| Technical cleanliness | 10 | Are anatomy, repeated objects, malformed text, logos, signatures, and distracting artifacts absent? |

Scoring anchors should be defined before review: 0% fails, 50% usable with meaningful defects, 80% strong, and 100% exceptional. Comments should identify concrete defects rather than only “like/dislike.”

### Operational scorecard: measured separately

Visual taste must remain blind. After scoring, reveal provider identities and compare:

- success, safety-block, and retry rates;
- p50 and p95 end-to-end latency over the ten calls, explicitly labeled as a tiny sample rather than an SLA;
- actual billed prompt/output usage and cost;
- returned dimensions, format, and byte size;
- exact 4:5 handling and local derivative work required;
- C2PA/SynthID evidence;
- model version pinning and published lifecycle;
- authentication and operational burden.

Recommended final decision weighting after hard gates:

- 80% blind visual score
- 8% successful-call reliability
- 4% measured latency
- 4% actual cost
- 4% versioning and operational simplicity

### Stage 2: reduce stochastic luck

Take the best hard-gate-passing OpenAI model and the best hard-gate-passing Google model intended for the production dropdown, then rerun all ten prompts once, again blind and uncurated. If a third option may ship, it must receive the same second-run consistency test as well. Compare both the new mean and within-model consistency. Do not rely on a seed unless the exact API returns or supports one; record `null` otherwise.

The most expensive required two-model stage under the normalized settings is GPT Image 2 plus Pro at an image-output-plus-prompt floor of about **$1.82** for 20 images, before Pro thinking/text-output tokens. A full two-stage artwork evaluation therefore has a floor near **$4.65**, not a reliable fixed total. Combined with the text report's roughly $5.56 bake-off estimate, the known floor is about **$10.21**. The recommended approval question is a separate **one-time $15 evaluation ceiling** for both reports, with a hard stop and no personal journal text; otherwise spread the work across at least three $5-capped months. This $15 ceiling is proposed, not approved.

Selection rules — proposed:

1. The default is the highest-scoring model after both rounds unless it has materially worse reliability or violates the monthly ceiling.
2. The other provider's best passing model remains available so the MVP genuinely supports OpenAI and Google without silent fallback.
3. Keep an economy entry only if its combined two-stage mean is within **10 points on the 100-point rubric** of the default and it is at least **20% cheaper** on measured all-in cost or at least **20% faster** on measured median latency.
4. Keep a premium entry only if its combined two-stage mean exceeds the best non-premium result by at least **10 points on the 100-point rubric**, remains reliable, and its all-in budget impact is explicitly shown before use. A manual-only premium option must have `automatic_sweep_eligible=false`; a descriptive label is not an enforcement control.
5. Compute a nonparametric 95% bootstrap confidence interval over prompt-level mean score differences, with prompts as the resampling unit and 10,000 resamples. If the interval includes zero and Arun has no clear preference, choose the model with the longer lifecycle/pinnable version and simpler operations. Freeze this method before identities are revealed.

## Proposed post-bake-off dropdown

The settings UI should expose model identity rather than a vague provider-only choice.

### Minimum likely shape

| UI label | Exact configuration | Notes shown in UI |
|---|---|---|
| OpenAI · GPT Image 2 | `gpt-image-2-2026-04-21`, medium, exact 4:5 | Estimated ~$0.047/image; pinned snapshot |
| Google · winning Gemini image model | Either `gemini-3.1-flash-image` or `gemini-3.1-flash-lite-image`, 1K, provider 4:5 setting | Show measured all-in cost, lifecycle class, and no dated pin |

### Conditional third entry

`Google · Gemini 3 Pro Image` may appear as **Premium · manual only** only if it meets the stage-two improvement rule and its configuration enforces `automatic_sweep_eligible=false`. It should never become the automatic default merely because Google markets it as premium.

Changing the dropdown applies only to future generation attempts. Existing artwork is not regenerated and never loses its provider, model, prompt-template, source-revision, usage, safety, or cost provenance. No dropdown option may be enabled without a current credential-health check and a reviewed lifecycle date.

## Launch checklist and revalidation triggers

Before production launch:

- [ ] Re-open every selected model, pricing, lifecycle, privacy, and terms page.
- [ ] Confirm the exact model IDs on the paid production accounts.
- [ ] Run both bake-off stages and store the signed-off score sheet.
- [ ] Confirm that only text visual briefs leave the server and no photo fields appear in request serialization or logs.
- [ ] Verify safety refusal, timeout, rate-limit, invalid credential, budget ceiling, and provider outage states.
- [ ] Inspect raw output dimensions and provenance metadata.
- [ ] Confirm local download/checksum before an artwork job is acknowledged as durable.
- [ ] Confirm generated artwork remains labeled and cannot displace a real-photo cover.
- [ ] Confirm secrets are runtime-only and credential files are excluded from Git and exports.
- [ ] Record the selected dropdown configuration and decision rationale in an architecture decision record.

Re-run the relevant evaluation when:

- a selected provider changes a model alias, snapshot, price, terms, retention, or safety behavior;
- Google publishes a short-term model replacement or retirement notice;
- OpenAI deprecates the pinned snapshot or publishes a successor considered for adoption;
- the visual-brief template or style contract materially changes;
- output size/quality changes;
- a new provider is considered; or
- observed safety blocks, latency, cost, or visual defects materially exceed the bake-off baseline.

## Decision summary

**Documented:** GPT Image 2 and the three current Gemini 3.x image models are the credible stable/GA first-party candidates that pass the initial product screen. They support suitable portrait output, standard server-side authentication, text-only input, and current commercial APIs. GPT Image 2 has the strongest version pin. Google Flash has the stronger published lifecycle among Google's balanced/economy choices. Lite has the lowest published image-output cost and is positioned as fastest but is short-term. Pro has mandatory high thinking and a published image-output floor already close to the $5 ceiling at 30 images.

**Inference:** GPT Image 2 is the best temporary implementation default; Gemini Flash is the safest likely Google production option; Lite can replace it if the blind quality difference is small; Pro belongs only as a measured premium exception.

**Proposed decision:** Bake off all four, then ship two entries—one OpenAI and one Google—with a third premium/economy variant only if the explicit score rule earns it. Never route silently, never send real photos, and preserve raw artwork plus complete provider/model/source provenance.

**Still unknown until tested:** Arun's preferred output, real endpoint latency, actual custom-size GPT Image 2 billed cost, all-in Gemini thinking/text-output cost, exact returned Flash Lite dimensions, safety-block rate for journal-like synthetic themes, and whether either Google economy model is consistent enough to replace Flash.

## Primary source register

All links below were reviewed as first-party sources on 2026-08-12.

### OpenAI

- [Current model catalog](https://developers.openai.com/api/docs/models/all)
- [GPT Image 2 model page and snapshot](https://developers.openai.com/api/docs/models/gpt-image-2)
- [Image generation sizes, formats, pricing, latency, and safety](https://developers.openai.com/api/docs/guides/image-generation)
- [OpenAI Services Agreement, including customer ownership of output](https://openai.com/policies/services-agreement/)
- [API training, retention, endpoint state, ZDR eligibility, and residency controls](https://developers.openai.com/api/docs/guides/your-data)
- [C2PA and SynthID in OpenAI-generated images](https://help.openai.com/en/articles/8912793-c2pa-and-synthid-in-openai-generated-images)
- [API key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
- [API key permissions](https://help.openai.com/en/articles/8867743-assign-api-key-permissions)

### Google

- [Cloud Agent Platform image generation guide and API configuration](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/image-generation)
- [Cloud Gemini 3.1 Flash Lite Image](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-lite-image)
- [Cloud Gemini 3.1 Flash Image](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-image)
- [Cloud Gemini 3 Pro Image](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-pro-image)
- [Cloud thinking levels and defaults](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/thinking)
- [Google Cloud generative AI pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing)
- [Model versions and lifecycle](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions)
- [Zero-data-retention behavior](https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/zero-data-retention)
- [Abuse monitoring](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/abuse-monitoring)
- [Google Cloud service-specific terms](https://cloud.google.com/terms/service-terms)
- [Application Default Credentials](https://docs.cloud.google.com/docs/authentication/application-default-credentials)
- [Service-account overview](https://docs.cloud.google.com/iam/docs/service-account-overview)

### Screened providers

- [Recraft API guide](https://www.recraft.ai/docs/api-reference/getting-started), [pricing](https://www.recraft.ai/docs/api-reference/pricing), [sizes](https://www.recraft.ai/docs/api-reference/appendix), and [developer terms](https://www.recraft.ai/legal/developer-terms)
- [Black Forest Labs pricing](https://docs.bfl.ai/quick_start/pricing) and [FLUX API terms](https://bfl.ai/legal/flux-api-service-terms)
- [Stability AI privacy policy](https://stability.ai/privacy-policy)
- [Ideogram API terms](https://ideogram.ai/legal/api-tos)
- [Adobe Firefly API](https://developer.adobe.com/firefly-services/docs/firefly-api/), [getting started](https://developer.adobe.com/firefly-services/docs/guides/get-started), and [generative-AI approach](https://www.adobe.com/ai/overview/firefly/gen-ai-approach.html)
- [Amazon Bedrock security/privacy](https://aws.amazon.com/bedrock/security-privacy-responsible-ai/) and [Nova Canvas lifecycle](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-canvas.html)
- [xAI Grok Imagine Image](https://docs.x.ai/developers/models/grok-imagine-image), [generation aspect ratios](https://docs.x.ai/developers/model-capabilities/images/generation), and [Enterprise Terms](https://x.ai/legal/terms-of-service-enterprise)
