# Life in Days — AI Text Model Evaluation

- **Status:** Decision report; model choice remains provisional until the bake-off in this document is run
- **Research cut-off:** 2026-08-12
- **Scope:** Hosted text inference for one private, single-user journal application
- **Data boundary:** Journal text may be sent to the selected text provider. Real photos, photo bytes, thumbnails, EXIF, Telegram file identifiers, and other photo metadata must never be sent to a text model.

## Executive decision

The best cost-to-capability starting point is **OpenAI GPT-5.6 Luna (`gpt-5.6-luna`)**, subject to the journal-specific bake-off below. At the expected workload it costs approximately **$0.04–$0.08 per month** for one generation per day. It supports strict structured output and can run without reasoning, and it costs essentially the same as the older GPT-5.4 Nano while being the current OpenAI economy model. GPT-4o Mini is slightly cheaper at **$0.02–$0.05 per month**, but the absolute saving is only a few cents and its published snapshot is from 2024; it belongs in the bake-off as a cost floor, not as an automatic default.

The strongest low-cost alternative is **Google Cloud Gemini 3.5 Flash-Lite (`gemini-3.5-flash-lite`)**. Its modeled global-endpoint cost is approximately **$0.06–$0.13 per month**, or about 10% more on a supported regional endpoint. Its published GA lifecycle extends to at least 2027-07-21, it supports structured output, and its thinking level can be kept at `minimal`.

Cost is not the deciding variable here: every sensible economy candidate is well below $1/month. The deciding variable is whether a model can summarize intimate source text faithfully without inventing events, turning the entry into advice, or flattening the author's voice. No provider publishes a benchmark that measures this. Therefore:

1. Put six release candidates through the same local synthetic/redacted evaluation: GPT-4o Mini, GPT-5.6 Luna, GPT-5.6 Terra, Gemini 3.1 Flash-Lite, Gemini 3.5 Flash-Lite, and Gemini 3.5 Flash.
2. Use Claude Haiku 4.5 and Claude Sonnet 5 only as external quality controls in that evaluation.
3. Ship a small text-model dropdown only after the hard gates pass. Do not expose every model in the provider catalogs.

### Proposed MVP dropdown

| UI label | API model ID | Role | Initial disposition |
|---|---|---|---|
| OpenAI · GPT-5.6 Luna | `gpt-5.6-luna` | Economy candidate | **Provisional default** |
| Google Cloud · Gemini 3.5 Flash-Lite | `gemini-3.5-flash-lite` | Economy alternative | Include if it passes hard gates |
| OpenAI · GPT-5.6 Terra | `gpt-5.6-terra` | Higher-cost challenger | Include only if it materially improves fidelity |
| Google Cloud · Gemini 3.5 Flash | `gemini-3.5-flash` | Higher-cost challenger | Include only if it materially improves fidelity |

Anthropic should not be in the MVP dropdown unless its result is materially better. Adding it otherwise creates a third production integration and credential for a workload where its least expensive suitable model is already more costly than the economy candidates. That is an implementation-complexity judgment, not a claim that Anthropic quality is worse.

## What the model must do

One daily request should transform, without modifying the source journal:

- a concise title;
- an 80–140 word factual summary;
- 3–7 short, reusable tags; and
- a short, source-grounded visual brief that can later be reviewed or sent to the separately selected artwork provider.

The source journal remains canonical. All four fields are derived artifacts, independently editable in Life in Days, with the existing product rule that a manual edit is never silently overwritten.

### Workload used for cost modeling

- One combined generation request per day.
- **Lower scenario:** 3,000 input tokens + 500 output tokens per day.
- **Upper scenario:** 10,000 input tokens + 500 output tokens per day.
- 30-day month.
- Standard synchronous, uncached list prices; no batch discounts, caching discounts, committed spend, taxes, or currency conversion.
- At this tiny volume, prompt caching and batch processing save pennies at most and add scheduling or retention complexity. They are not MVP requirements.

The monthly formula is `0.09 × input $/MTok + 0.015 × output $/MTok` for the lower scenario and `0.30 × input $/MTok + 0.015 × output $/MTok` for the upper scenario.

## Market scan: stable candidates

All prices below are official list prices observed on the research cut-off date. A model appearing in this table does not mean it should appear in the product dropdown.

### OpenAI

OpenAI's current catalog positions Luna for cost-sensitive/high-volume work, Terra as the balanced model, and Sol as the flagship. The model pages document model-specific price, context, output limits, reasoning levels, supported endpoints, structured outputs, rate limits, and snapshots: [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna), [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra), [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol), [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4), [GPT-5.4 Mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini), [GPT-5.4 Nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano), [GPT-5 Mini](https://developers.openai.com/api/docs/models/gpt-5-mini), [GPT-4.1 Mini](https://developers.openai.com/api/docs/models/gpt-4.1-mini), and [GPT-4o Mini](https://developers.openai.com/api/docs/models/gpt-4o-mini).

| Model | Stable ID / snapshot situation | Input / output $ per MTok | Context / max output | Structured output | Thinking control | Modeled monthly cost | Assessment |
|---|---|---:|---:|---|---|---:|---|
| GPT-4o Mini | Pin `gpt-4o-mini-2024-07-18` | $0.15 / $0.60 | 128K / 16K | Yes | No reasoning step | **$0.0225–$0.054** | Cheapest non-deprecated OpenAI candidate; cost-floor test only |
| GPT-5.6 Luna | `gpt-5.6-luna`; no separate dated snapshot is published on its current page | $0.20 / $1.20 | 1.05M / 128K | Yes | `none`, `low`, `medium`, `high`, `xhigh`, `max` | **$0.036–$0.078** | Best OpenAI economy candidate |
| GPT-5.4 Nano | `gpt-5.4-nano-2026-03-17` | $0.20 / $1.25 | 400K / 128K | Yes | `none`, `low`, `medium`, `high`, `xhigh` | $0.0368–$0.0788 | Stable snapshot, but superseded economically by Luna |
| GPT-5 Mini | `gpt-5-mini-2025-08-07` | $0.25 / $2.00 | 400K / 128K | Yes | Model-specific reasoning controls | $0.0525–$0.105 | Older viable model; no cost or lifecycle reason to prefer it |
| GPT-4.1 Mini | Pin `gpt-4.1-mini-2025-04-14` | $0.40 / $1.60 | 1,047,576 / 32K | Yes | No reasoning step | $0.060–$0.144 | Stable, but Luna is newer and less expensive at both token rates |
| GPT-5.4 Mini | `gpt-5.4-mini-2026-03-17` | $0.75 / $4.50 | 400K / 128K | Yes | `none`, `low`, `medium`, `high`, `xhigh` | $0.135–$0.2925 | Useful fallback, but not a distinct MVP need |
| GPT-5.6 Terra | `gpt-5.6-terra`; no separate dated snapshot is published on its current page | $2.00 / $12.00 | 1.05M / 128K | Yes | `none` through `max` | **$0.36–$0.78** | Quality challenger; still inexpensive in absolute terms |
| GPT-5.4 | `gpt-5.4-2026-03-05` | $2.50 / $15.00 | 1.05M / 128K | Yes | Model-specific reasoning controls | $0.45–$0.975 | Superseded for this selection by the 5.6 family |
| GPT-5.6 Sol | `gpt-5.6-sol`; no separate dated snapshot is published on its current page | $5.00 / $30.00 | 1.05M / 128K | Yes | `none` through `max` | $0.90–$1.95 | Flagship overkill unless the bake-off proves a unique fidelity gain |

**Version-stability implication.** The dated GPT-4o Mini, GPT-4.1 Mini, GPT-5.4, and GPT-5 Mini snapshots can be pinned. The reviewed GPT-5.6 pages expose canonical IDs but no dated snapshots. If a 5.6 model is selected, persist the API-returned model identifier, prompt version, schema version, and evaluation version with each derived artifact. Never change the configured model without an explicit re-evaluation and settings migration.

**Rate-limit implication.** The Luna and GPT-5.4 model pages currently show entry-tier limits in the hundreds of requests per minute and hundreds of thousands of tokens per minute. One daily request is several orders of magnitude below them. Limits remain account/tier dependent, so the application must still handle `429` and `Retry-After`; it must not encode a catalog number as an availability guarantee. OpenAI documents its tier model in its [rate-limit guide](https://platform.openai.com/docs/guides/rate-limits).

### Google Cloud

The evaluated surface is the paid Google Cloud generative API, documented under Gemini Enterprise Agent Platform/Vertex AI—not the consumer Gemini app and not a consumer Google AI subscription. Google's [model lifecycle page](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions) identifies GA status and published retirement dates. Model pages document context, output, thinking, structured output, and supported regions: [Gemini 3.5 Flash-Lite](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-flash-lite), [Gemini 3.5 Flash](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-flash), and [Gemini 3.1 Flash-Lite](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-lite).

| Model | Lifecycle as of cut-off | Input / output $ per MTok | Context / max output | Structured output | Thinking control | Modeled global monthly cost | Assessment |
|---|---|---:|---:|---|---|---:|---|
| Gemini 3.1 Flash-Lite | GA; retirement 2027-05-07 or later | $0.25 / $1.50 | 1,048,576 / 65,536 | Yes | `minimal`, `low`, `medium`, `high`; default `minimal` | $0.045–$0.0975 | Cheapest stable Google candidate; newer 3.5 is only pennies more |
| Gemini 3.5 Flash-Lite | GA; retirement 2027-07-21 or later | $0.30 / $2.50 | 1,048,576 / 65,536 | Yes | `minimal`, `low`, `medium`, `high`; default `minimal` | **$0.0645–$0.1275** | Best Google economy candidate |
| Gemini 3.5 Flash | GA; retirement 2027-05-19 or later | $1.50 / $9.00 | 1,048,576 / 65,536 | Yes | `minimal`, `low`, `medium`, `high`; default `medium` | **$0.27–$0.585** | Quality challenger; force `minimal` for the baseline test |
| Gemini 3.6 Flash | GA, short-term availability | $1.50 / $7.50 | 1,048,576 / 65,536 | Yes | `minimal`, `low`, `medium`, `high`; default `high` | $0.2475–$0.5625 | Exclude from MVP because short-term models may retire quickly |

Pricing is from Google's current [generative AI pricing table](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing). It states that supported non-global endpoints are priced 10% higher. For example, the Gemini 3.5 Flash-Lite range becomes about **$0.071–$0.140/month** on such an endpoint. The exact endpoint availability must be checked at deployment because model-region matrices change.

Google's [thinking documentation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/thinking) establishes the defaults above. Thinking tokens are billable output. The bake-off should explicitly set `minimal` rather than compare a default-medium Flash run against minimal-thinking economy models.

Google's standard pay-as-you-go service is best effort and uses spend/tier-based throughput. The official [standard pay-as-you-go documentation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/standard-paygo) does not make a per-request latency guarantee. One daily request will not stress throughput, but `429`, transient `5xx`, and capacity failures remain normal cases to handle.

### Anthropic external benchmark

Anthropic is included to keep the evaluation honest, not because it is already approved for the dropdown. Official model and price sources are the [current models overview](https://platform.claude.com/docs/en/about-claude/models/overview), [model ID/versioning guide](https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions), and [pricing page](https://platform.claude.com/docs/en/about-claude/pricing).

| Model | Stable ID behavior | Input / output $ per MTok | Context / max output | Structured output | Thinking control | Modeled monthly cost | Assessment |
|---|---|---:|---:|---|---|---:|---|
| Claude Haiku 4.5 | Pin `claude-haiku-4-5-20251001`; short alias is movable | $1.00 / $5.00 | 200K / 64K | Yes | Manual extended thinking; can run without it | $0.165–$0.375 | Low-cost external control |
| Claude Sonnet 5 | `claude-sonnet-5` is a pinned, dateless snapshot under Anthropic's 4.6+ policy | $2.00 / $10.00 | 1M / 128K | Yes | Adaptive by default; can be disabled | $0.33–$0.75 | Primary quality control |
| Claude Opus 5 | `claude-opus-5`, pinned | $5.00 / $25.00 | 1M / 128K | Yes | Adaptive | $0.825–$1.875 | Overkill; optional ceiling test only |
| Claude Fable 5 | `claude-fable-5`, pinned | $10.00 / $50.00 | 1M / 128K | Yes | Adaptive, always on | $1.65–$3.75 | Exclude; no credible ROI case at this workload |

The fixed-token scenario makes providers mathematically comparable, but not tokenizers. Anthropic states that Sonnet 5 uses a new tokenizer and may count materially more tokens than earlier Claude models. The bake-off must record each provider's actual billed input/output token counts rather than extrapolating from a single local tokenizer.

Anthropic's [structured outputs documentation](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) covers JSON schema enforcement for these current families. Its [Sonnet 5 notes](https://platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5) explain adaptive thinking and how to disable it. The fair baseline is thinking disabled; a second quality-ceiling run may use its recommended adaptive setting, with reasoning tokens included in cost and latency.

Anthropic's current pricing page says Sonnet 5's introductory $2/$10 rates are now standard and the formerly announced 2026-09-01 increase will not occur. This report therefore does not model the canceled increase. Anthropic also documents organization-level spend limits plus request/token limits that depend on usage tier in its [rate-limit guide](https://platform.claude.com/docs/en/api/rate-limits). At one request per day, correct handling of `429` matters more than catalog throughput.

### Latency evidence boundary

The official sources do not provide comparable end-to-end latency SLAs for ordinary pay-as-you-go calls. Anthropic labels Haiku “fastest” and Sonnet “fast”; OpenAI and Google publish relative positioning and throughput controls, not a number that predicts a call from the Hetzner server. Those labels are facts about provider positioning, not a cross-provider benchmark. Measure end-to-end p50/p95 and failure rate from the actual Hetzner region during the bake-off. Since generation is an asynchronous derived-artifact job, completion latency matters more than streaming time-to-first-token; streaming is unnecessary for MVP.

## Models intentionally excluded from the recommended dropdown

| Model/surface | Reason |
|---|---|
| [OpenAI GPT-5 Nano](https://developers.openai.com/api/docs/models/gpt-5-nano) | Its current official page marks it deprecated. A slightly lower list price does not justify new dependence on a deprecated model. |
| [OpenAI GPT-4.1 Nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) | Its dated snapshot is marked deprecated on the current official page. |
| Other older OpenAI general/reasoning families | Stable GPT-4.1, GPT-4o, and dedicated reasoning variants were screened. GPT-4o Mini and GPT-4.1 Mini bound the relevant older cost/capability range; larger or reasoning-first predecessors add cost without a distinct journal requirement. They can be reintroduced only if the selected candidates fail fidelity gates. |
| OpenAI or Google preview models | Preview behavior, price, IDs, and retirement can change before a trustworthy archive's MVP stabilizes. |
| Google Gemini 3.6 Flash | GA but listed under short-term availability; Google says a short-term model can retire on a much shorter replacement window. |
| Google Gemini 2.5 Pro/Flash/Flash-Lite | Still serviceable, but the lifecycle page publishes 2026-10-20 retirement; adopting it in August would create avoidable migration work. |
| Google Gemini 3.1 Pro | Preview on the reviewed lifecycle page. |
| Anthropic Claude Sonnet 4.6 and older stable families | Still callable, but superseded by current candidates; they add test surface without a distinct price/stability advantage. |
| Anthropic Mythos / limited-access models | Not a generally available, self-serve production dependency. |
| Consumer ChatGPT, Gemini, or Claude subscriptions | Consumer subscriptions do not fund API usage and have different product/data terms. Life in Days requires a server-side commercial API account. |
| Self-hosted open-weight model on the Hetzner application server | A capable summarization model would compete with the app for RAM/CPU or require GPU infrastructure. That is not free operationally and is less simple than sub-dollar hosted inference. Revisit only for a stronger offline/privacy requirement. |

## Privacy, retention, residency, and endpoint behavior

“Not used for training” does not mean “zero retention.” These must remain separate claims in product documentation and settings.

| Provider | Training default | Provider retention relevant to this design | Residency | Lowest-state endpoint pattern |
|---|---|---|---|---|
| OpenAI API | API/business data is not used to train by default | Eligible API content may be retained in abuse-monitoring logs for up to 30 days. `/v1/responses` can retain application state by default; other tools/files have their own retention. Approved Zero Data Retention or Modified Abuse Monitoring changes the eligible-endpoint behavior. | OpenAI lists India storage residency, but not India processing; India residency requires eligible endpoints and approved Modified Abuse Monitoring or Zero Data Retention. Do not claim India-local processing. | Server-side `/v1/chat/completions`, no files/tools, no conversation history, and no provider-side storage requested. If Responses is used, set `store:false` and verify current model/endpoint eligibility. |
| Google Cloud generative API | Google states it does not train/fine-tune on customer data without permission or instruction | Request-response logging is disabled by default. Abuse monitoring may retain suspicious prompts for up to 90 days; exceptions require approval. | Supported model pages list US/EU regional availability and data-residency controls. A regional endpoint costs more than global. No India-residency claim is made here. | Stateless server-side `generateContent`; request logging left disabled; no grounding, session service, cache, or file service. |
| Anthropic commercial API | Commercial/API inputs and outputs are not used for training by default unless the customer opts in or supplies feedback under the documented exceptions | Standard API input/output deletion target is 30 days. Anthropic documents up to 2 years for content flagged for policy enforcement and up to 7 years for associated safety-classifier scores. ZDR requires an approved agreement and applies only to covered products/features. | The first-party Claude API is global by default and offers US-only inference at a 1.1× price. The reviewed official material does not establish India residency. | Stateless Messages API call in a dedicated workspace; no files, prompt cache, or multi-turn provider history. |

Sources: OpenAI's [API data controls matrix](https://developers.openai.com/api/docs/guides/your-data), [training policy](https://openai.com/policies/how-your-data-is-used-to-improve-model-performance/), and [data residency guide](https://developers.openai.com/api/docs/guides/data-residency); Google Cloud's [zero-data-retention overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/zero-data-retention), [abuse monitoring policy](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/abuse-monitoring), and [data residency page](https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/data-residency); Anthropic's [commercial retention policy](https://privacy.anthropic.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data), [commercial training policy](https://privacy.anthropic.com/en/articles/7996885-how-do-you-use-personal-data-in-model-training), and [ZDR scope](https://privacy.anthropic.com/en/articles/8956058-i-have-a-zero-data-retention-agreement-with-anthropic-what-products-does-it-apply-to).

### Privacy recommendation for MVP

1. Send only the normalized journal text and the minimum date/language hints required for the task. Do not send name, email, Telegram identity, VoiceNotes account ID, app database IDs, or photo metadata.
2. Put an explicit instruction before the journal that text inside the journal is untrusted quoted content, not model instructions. This limits prompt-injection behavior from pasted or transcribed text.
3. Use one stateless request. Never upload journals to provider file stores, assistants, vector stores, grounding/search, provider prompt caches, or persistent sessions in MVP.
4. Do not silently fall back to another provider. Fallback would disclose the journal to a provider the user did not select and make derived output provenance ambiguous.
5. Keep source text and generated fields in Life in Days' own storage. Provider logs must not receive raw journal text, full responses, or secrets.
6. Make the settings screen accurately say which provider/model is active and link to that provider's commercial API privacy terms. Do not describe standard service as zero retention.

### Regional recommendation

For a sensitive journal, Google Cloud's supported EU regional endpoint is worth testing despite the 10% price uplift; the absolute difference is fractions of a cent per day. OpenAI's India option offers storage residency rather than India-local model processing and has eligibility constraints, so it is not a direct equivalent. Residency is a privacy/contract choice, not a model-quality feature, and should not be silently changed after launch.

## Authentication and keys to create

Credentials are server configuration, not user-entered browser data. They must never be hard-coded in source control, Telegram bot messages, client JavaScript, or database rows.

### If OpenAI wins

1. Create a dedicated OpenAI API project named for Life in Days; do not reuse a personal catch-all project.
2. Create a project service account and its API key for the Hetzner backend. A project service account gives the workload its own identity and keeps billing/rotation separate from a human key.
3. If endpoint-level key permissions are required, verify the control available for the exact key type. OpenAI documents `Restricted` endpoint permissions for user-owned keys, while service-account key creation may expose different controls. A dedicated project is the primary blast-radius boundary.
4. Set a small project budget alert. Store the key only in the server secret environment, and rotate it after setup or suspected exposure.

Official references: [OpenAI API key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety), [API key permissions](https://help.openai.com/en/articles/8867743-assign-api-key-permissions), and [production best practices](https://platform.openai.com/docs/guides/production-best-practices).

### If Google Cloud wins

1. Create a dedicated Google Cloud project with billing and the generative API enabled.
2. Create a dedicated service account with only the permission/role needed to call the selected generative endpoint.
3. On Hetzner, use Application Default Credentials with that workload identity. A service-account credential file is simpler for MVP but is a long-lived secret; keep it outside the repository with restrictive filesystem permissions and rotate it. Workload Identity Federation is the stronger later option because it avoids a static Google key.
4. Do not use a browser/API key in production merely because it is quicker in a test. Google's documentation recommends API keys for testing and ADC for production authentication.

Official references: [Google model API-key quickstart and ADC recommendation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/start/api-keys) and [Google generative API authentication](https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/authentication).

### Anthropic benchmark credential

Create a dedicated Anthropic workspace and workspace-scoped API key only for the bake-off. Give it a low spend limit, store it server-side, and revoke it after the evaluation unless Anthropic is selected. Anthropic documents workspace-scoped keys and expiration/rotation in its [authentication guide](https://platform.claude.com/docs/en/manage-claude/authentication).

### Terms boundary

Use the commercial API terms for the selected service, not its consumer-app terms. The user must have rights to submit the journal text. AI output can be inaccurate and must remain labeled as generated. Current first-party references are the [OpenAI Services Agreement](https://openai.com/policies/services-agreement/), [Google Cloud Service Specific Terms](https://cloud.google.com/terms/service-terms), and [Anthropic Commercial Terms](https://www.anthropic.com/legal/commercial-terms).

## Quality evidence: what is known and what is not

### Facts established by provider documentation

- Every release candidate has far more context capacity than the expected 10,000-token daily input.
- Every release candidate advertises schema-constrained structured output.
- No release candidate requires a high-thinking configuration for this task: GPT-4o Mini has no reasoning step, GPT-5.6 can use `none`, and the Gemini candidates can use `minimal`.
- Stable Google releases have published minimum lifecycle dates. OpenAI and Anthropic use different snapshot/ID policies, so model provenance must be recorded rather than normalized away.
- No provider offers a hard latency promise for an ordinary pay-as-you-go call, and rate limits remain tier/account dependent.

### Inferences that require a local test

- Luna is the best ROI **if** it meets the fidelity gates; its price and capability surface make it the rational first candidate, but do not prove summary quality.
- Gemini 3.5 Flash-Lite is preferable to the marginally cheaper 3.1 Flash-Lite **if** its newer release performs at least as well; the monthly price difference is too small to justify choosing on price alone.
- Terra or Gemini 3.5 Flash belongs in the user dropdown only if it improves the blinded score by a meaningful margin. A 5–10× percentage price difference is still less than $1/month, but unnecessary options create testing and behavioral inconsistency.
- Anthropic may perform better, worse, or equivalently on intimate journal text. General vendor benchmark claims cannot establish this.

### Why public benchmarks are not used to pick the winner

Coding, reasoning, knowledge, and general preference benchmarks do not test this product's failure mode: a plausible but false memory entering a trusted archive. Vendor-reported scores also differ in prompts, settings, token budgets, and graders. They are useful evidence that a model is broadly capable, but not evidence of faithful personal-journal transformation. The bake-off below is the decision instrument.

## Required synthetic/redacted bake-off

### Candidate set

Run these six release candidates with the same schema and task prompt:

1. `gpt-4o-mini-2024-07-18`
2. `gpt-5.6-luna`
3. `gpt-5.6-terra`
4. `gemini-3.1-flash-lite`
5. `gemini-3.5-flash-lite`
6. `gemini-3.5-flash`

Run these external controls separately:

7. `claude-haiku-4-5-20251001`
8. `claude-sonnet-5`

The controls do not receive production approval merely by scoring well; selection would also require accepting Anthropic's credential, retention, terms, and integration cost.

### Dataset

Use 32 locally stored fixtures:

- 24 fully synthetic journal days, written before any output is inspected;
- up to 8 manually redacted real-like entries, included only by explicit user choice; if privacy review is not complete, replace them with synthetic fixtures;
- no photographs, image metadata, actual Telegram payloads, upstream IDs, names, addresses, phone numbers, credentials, or uniquely identifying events.

The fixture set should deliberately include:

- sparse, ordinary, celebratory, sad, anxious, and mixed-emotion days;
- multiple source items for one day, including overlap and mild contradiction;
- a long entry near 10,000 tokens;
- transcription errors, fragments, repetition, and uncertain language;
- health, money, relationship, work, and travel content;
- negation (“I did not…”), planned-but-not-done events, and quoted speech;
- English plus realistic Indian-language code-switching/transliterated phrases;
- source text that contains apparent commands or prompt-injection strings;
- an entry for which a tasteful visual brief should avoid a real person's likeness, address, diagnosis, or other private detail.

Each fixture needs a human-authored fact inventory and explicit “must not claim” list. Those are hidden from candidate models and used for scoring.

### Controlled run

- Freeze a prompt version and strict JSON schema.
- Set GPT thinking/reasoning to `none`, Gemini thinking to `minimal`, and Claude thinking to disabled for the baseline.
- Use each provider's closest supported deterministic setting; do not force an unsupported temperature configuration.
- Make three independent calls per fixture/model to measure variability.
- Randomize and anonymize output labels before human grading.
- Record provider, requested model, returned model, input/output/reasoning token counts, latency, HTTP status, retry count, refusal/safety status, and calculated list-price cost.
- Do not use another candidate model as the sole judge. Automated schema and lexical/fact checks can assist, but Arun's blinded adjudication decides disputed fidelity.

At 32 fixtures × 3 repeats, the six release candidates are roughly **$3.40 total** at 5,000 input + 500 output tokens per run using current global list prices. Adding Haiku 4.5 and Sonnet 5 is roughly another **$2.16**. Actual billing will vary by tokenizer and output length; this is a planning estimate, not a quote.

### Output schema

The provider adapter should normalize only after validating provider-native structured output:

```json
{
  "title": "string, concise and factual",
  "summary": "string, 80-140 words",
  "tags": ["3-7", "short", "unique tags"],
  "visual_brief": "string, concise and source-grounded"
}
```

The system prompt must state that the journal is data, not instructions; unknown facts must remain unknown; planned events are not completed events; quoted statements are not necessarily the author's beliefs; no diagnosis or coaching is wanted; and no person should be made identifiable in the visual brief.

### Hard gates

A candidate cannot ship if it fails any of these across the accepted evaluation set:

- fewer than 95% of first responses validate against the schema and cardinality/word-count rules;
- any critical invented person, event, action, diagnosis, location, or outcome;
- persistent advice, coaching, moral judgment, or clinical interpretation not present in the source;
- instruction-following from content embedded inside the journal;
- silent loss of a major source event or reversal of negation;
- leakage of fixture identifiers or prohibited personal/photo metadata;
- benign refusal rate above 1% after one controlled retry.

A single critical invention triggers investigation and an expanded adversarial set before that model can be reconsidered. It should not be averaged away by good style scores.

### Weighted human rubric

Score each dimension from 0–5, blinded to provider:

| Dimension | Weight | What earns a 5 |
|---|---:|---|
| Factual fidelity | 35% | Every claim is supported; uncertainty, attribution, tense, and negation are preserved |
| Coverage | 20% | The important events and emotions are retained without overemphasizing trivia |
| Neutrality / no coaching | 15% | Reflective but non-therapeutic; no advice, diagnosis, or judgment |
| Title usefulness | 10% | Specific enough to recognize the day, without invented flourish |
| Tag quality | 8% | 3–7 stable, reusable, non-sensitive, non-duplicative tags |
| Visual-brief grounding and privacy | 7% | Evocative but faithful; excludes identifying/private details and unsupported imagery |
| Style and readability | 5% | Natural, concise, and respectful of the source voice |

Track median and worst-case score, not just the mean. Separately report schema-pass rate, critical-error count, benign-refusal rate, p50/p95 latency, variability across repeats, and actual cost.

### Selection rule

The provisional default wins only if it passes every hard gate and reaches a weighted mean of at least 4.0/5 with no serious worst-case pattern. A challenger that costs or operationally complicates more should replace/add to the dropdown only if it improves the blinded weighted score by at least 0.2/5 or materially reduces the worst-case factual-error rate. If results are statistically or practically indistinguishable, choose the simpler integration and lower-retention configuration.

## Production inference contract

### Request

- Join the day's eligible journal source items in a deterministic order with clear source boundaries and timestamps.
- Normalize encoding and reject malformed text; never silently drop an item.
- Enforce an application input ceiling. The expected 10K tokens is far below every candidate context window, so truncation is unnecessary; if a future day exceeds the ceiling, segment visibly or require review rather than silently cutting the end.
- Send one stateless request with the frozen system prompt and strict schema.
- Add no photo, Telegram, VoiceNotes-account, or internal database metadata.
- Use a content hash plus generation purpose, model, and prompt version as the idempotency key inside Life in Days.

### Response and provenance

Persist:

- provider and requested model ID;
- exact returned model ID/version when supplied;
- prompt and schema versions;
- source-content hash and source revision set;
- generated fields, generation timestamp, and whether each field was manually edited;
- provider request ID, token counts, calculated cost, latency, and retry count;
- safety/refusal/error state.

Do not put raw source text, raw provider payloads, API keys, or full generated responses in ordinary application logs. Keep only sanitized operational metadata there. The generated artifact belongs in the protected application database because it is part of the journal experience, not debugging exhaust.

### Failure and safety behavior

| Failure | Required behavior |
|---|---|
| Timeout, `429`, or transient `5xx` | Retry the selected provider up to three times with exponential backoff, jitter, and `Retry-After`; then leave the generation visibly pending/failed |
| Authentication, quota, or billing failure | Stop retries, show an actionable private admin error, and preserve the source unchanged |
| Invalid schema | Retry once with the same provider/model and a schema-repair instruction; if still invalid, fail visibly rather than guess |
| Safety refusal | Store a refusal status and safe provider metadata; keep the source fully available and offer manual retry/review |
| Partial/empty output | Reject atomically; never save a blank title/summary as a successful refresh |
| Source revision arrives during generation | Discard or mark stale by comparing the content hash; never attach output to the wrong revision |
| Selected provider unavailable | Do not silently send the journal to another provider. Let the user choose and explicitly retry with a different configured provider |
| Manual derived-field edit exists | Generate a replacement candidate for review, but never overwrite the manual value |

An async job with a 30-second request timeout is a reasonable starting implementation parameter, not a provider SLA. Measure it in the bake-off and tune it from observed p95 latency. The original journal and any user corrections must stay usable while generation is pending or failed.

## Final recommendation and next action

1. Implement provider adapters for OpenAI and Google Cloud behind the same typed schema; keep provider/model selection as server-controlled settings.
2. Provision only test credentials with low budgets and run the 32-fixture bake-off.
3. If GPT-5.6 Luna passes, make it the default because it has the lowest combined integration/cost case, especially if the artwork report also selects OpenAI. This is provisional—not a quality conclusion made from a catalog page.
4. Offer Gemini 3.5 Flash-Lite as the alternative if it passes. Prefer a supported EU regional endpoint for privacy if its measured latency is acceptable; accept the negligible 10% price uplift.
5. Expose Terra and Gemini 3.5 Flash only when their measured fidelity improvement meets the selection rule. Keep Anthropic external unless it wins by enough to justify another provider.
6. Re-run a smaller regression suite before any model ID, provider endpoint, prompt, reasoning level, or schema change. Review Google's published retirement dates quarterly and all provider pricing/retention pages before deployment.

The practical conclusion is intentionally narrow: **start the evaluation with GPT-5.6 Luna, but let journal fidelity—not general AI reputation—decide the production default.**
