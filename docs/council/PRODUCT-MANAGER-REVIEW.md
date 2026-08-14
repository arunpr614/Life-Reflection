# Life in Days — Product Manager Council Review

- **Council seat:** Expert Product Manager
- **Review date:** 2026-08-14
- **Status:** Council release-boundary recommendation
- **Product scale:** New private product / major personal launch
- **Primary user:** One owner
- **Evidence boundary:** Product planning and prototype inspection only. This review does not claim that application behavior, persistence, integrations, security, recovery, deployment, or production use has been implemented or verified.

## 1. Decision summary

The global Product Requirements Document is suitable as the governing product contract, but its 78 requirements are too broad to serve as one buildable release packet. The Product Council should preserve the stable `LID-*` requirements and split delivery into small release PRDs whose acceptance criteria can be demonstrated by the owner after every production deployment.

The recommended sequence is:

1. **R0 — Shared-Host Private Foundation:** prove safe co-existence on the existing host and deploy only a synthetic/private shell.
2. **R1 — Manual Journal Archive:** first release permitted to create real memories; upload, browse, and recover authentic journal files.
3. **R2 — Telegram Photo Capture:** add private daily-photo capture, validation, gallery, cover, and duplicate behavior.
4. **R3 — Retrieval and Date Integrity:** add cross-month browsing, deterministic search, date review, and atomic redating.
5. **R4 — Source History and Lifecycle Safety:** add Corrections, conflicts, history, Trash, suppressions, and complete export.
6. **R5 — Prospective VoiceNotes Sync:** add spike-proven prospective journal capture and replay-safe reconciliation.
7. **R6 — Generated Text Reflection:** add evaluated text derivation, field protection, provenance, and budget enforcement.
8. **R7 — Generated Artwork:** add evaluated artwork, explicit generation, versioning, suppression, and cover rules.
9. **R8 — Operational Scale and Resilience:** harden capacity, failure isolation, alerts, recovery evidence, and integrated operations.
10. **R9 — Private Launch Acceptance and Stabilization:** prove the complete private product with owner scenarios and a stabilization window.
11. **R10 — Object-store Transition:** a conditional, date-free milestone opened only when approved storage watermarks require it.

R0 is not a usable memory archive and must contain synthetic fixtures only. R1 is the first memory-creating user release. Every release from R1 onward must be independently rollbackable and must add backup/restore evidence for every new persistent data shape before it is accepted.

No implementation milestone is `Done` on the evidence reviewed here. The v5 prototype is interaction evidence, not implementation evidence.

## 2. Reviewed evidence and source integrity

The supplied sources were reviewed directly. Repository-relative references below point to the Phase1 publication copies.

| Artifact | Repository reference | Supplied-source SHA-256 | What it establishes |
| --- | --- | --- | --- |
| Global Product Requirements | [Product Requirements](../product/PRODUCT-REQUIREMENTS.md) | `513a5bc62cdccc0112d8876f6b75915782ce9a4c118f9a8207b1ef588f8edf5c` | Product promise, goals, 78 stable requirements, acceptance behavior, risks, and deferrals |
| UX Specification | [UX Specification](../design/UX-SPECIFICATION.md) | `1076228160f253cf8d291c8c5884dfecb7bf8883e82b208f181776cf94c68b8e` | Information architecture, interaction contracts, responsive/accessibility behavior, and unresolved UX gates |
| v5 prototype entry | [Prototype v5](../../prototypes/calendar-ui/index-v5.html) | `ced79f43c0e3b8916f029898a6469a8290aa90e9e45c28be7b612c177d4ca17d` | The reviewed prototype entry point and its explicit non-production boundary |
| v5 prototype behavior | [Prototype v5 application](../../prototypes/calendar-ui/app-v5.js) | `3e99414a1c3f6cd71047dee6964a26fb502250e1b0061f153f935c397714383d` | Simulated Calendar, Almanac, Search, Settings, Journal Day, upload, reflection, and artwork interactions |
| v5 prototype presentation | [Prototype v5 styles](../../prototypes/calendar-ui/styles-v5.css) | `64858881f2189d0e919da66e8d17687e17e06dcb8c2e5a4325f65420195b6cd1` | Responsive layout, themes, focus treatment, reduced motion, and visual hierarchy |

The Phase1 PRD publication copy has SHA-256 `9f8ad449a8e3c8f5387a8deb32b1b51b5d8bd0252fd1e1647137e9b981d0aa35` because it contains publication-oriented editorial cleanup. Stable requirement IDs and product behavior used in this review match the supplied governing source.

## 3. Product framing

### Problem

The owner's authentic journals and daily photographs are split across existing capture habits. Recalling an ordinary day requires manually reconstructing context across tools, while any new archive must avoid turning generated summaries or artwork into false source truth.

### Product promise

Life in Days is a private, single-user visual memory archive. It assembles authentic source material into trustworthy Journal Days, makes those days pleasant to revisit, and preserves a clear, inspectable boundary between original evidence, owner Corrections, and AI-derived presentation.

### Core value pillars

| Pillar | Product meaning |
| --- | --- |
| Effortless capture | Continue using VoiceNotes, Telegram, and explicit text-file upload instead of creating a second writing ritual |
| Reflective recall | Recognize and revisit days through Calendar, Timeline, deterministic Search, and Journal Day detail |
| Truth and provenance | Preserve source bytes, timestamps, revisions, Corrections, and generated-artifact provenance without silent overwrite or merge |
| Privacy | Keep the archive private and keep all real-photo data outside AI requests |
| Recoverability | Treat tested restore and portable export as product behavior, not only operations |
| Low incremental cost | Reuse the existing host, avoid a second compute instance, and retain explicit provider budget limits |

### Product outcome

The owner should be able to create, revisit, correct, export, back up, and restore a private Journal Day with confidence about what is authentic, what is generated, what left the server, and what would happen during a failure.

## 4. Governing PRD readiness

The global PRD is **ready as a governing source, with release decomposition required**.

| Review dimension | Assessment | Product Manager finding |
| --- | --- | --- |
| Opportunity and problem | Ready | The source habits, recall problem, trust risk, and integration uncertainty are explicit and evidence-backed. |
| Goals and scope | Ready | Operational, user, trust, privacy, and cost goals are paired with strong non-goals. |
| User experience | Ready | The sole persona and detailed UX flows are clear; no speculative secondary persona is invented. |
| Requirements | Ready | All 78 `LID-*` requirements have behavioral acceptance criteria and dependencies. |
| Metrics | Ready | Source fidelity, recovery, privacy, AI quality, spend, accessibility, storage safety, and owner validation are measurable. |
| Scope-appropriate completeness | Ready | Personal-data, architecture, provider, recovery, export, and risk sections are present. |

The highest-leverage next product action is to author the individual release PRDs recommended in Section 11. Each release PRD should copy only the requirements in its row of the traceability matrix, add the release-specific owner walkthrough, and link back to the global PRD instead of restating the entire product.

## 5. Scope guardrails

These constraints apply to every release and may not be weakened to meet a date:

1. One private human user; no sharing, invitations, public links, anonymous access, or multi-user records.
2. Fixed `Asia/Kolkata` Journal Dates with immutable Original Timestamps and explicit historical redating.
3. Original sources, Source Revisions, Corrections, and Derived Artifacts remain separate and reconstructable.
4. No real-photo bytes, thumbnails, metadata, identifiers, captions, or photo-derived descriptions may enter an AI request.
5. No coaching, diagnosis, prompts, streaks, reminders, social behavior, or habit pressure.
6. No automatic historical VoiceNotes import; only exact prospective eligibility after Integration Activation.
7. No blank browser journal composer and no unsupported PDF, Word, OCR, RAW, audio, or video ingestion.
8. No semantic/conversational search, image recognition, OCR search, or journal question answering in MVP.
9. No silent provider fallback, automatic source merge, destructive cleanup, date fallback, or generated-field overwrite.
10. No second application password system; human access uses the approved external access boundary.
11. No new compute instance for this product. Shared-host fit, resource isolation, port/routing compatibility, rollback, and existing-service non-regression must be proven before R0 exits.
12. No claim of high availability, zero knowledge, end-to-end encryption, zero retention, or recovery until the exact evidence exists.
13. The application AI ceiling remains fixed at the approved monthly amount; metered requests are optional to the archive and cannot block capture, browsing, correction, backup, or export.
14. Every production release is independently rollbackable and records backup/restore evidence for its new database, media, job, suppression, or artifact shape.
15. R10 cannot be scheduled merely for convenience. It opens only when the approved storage thresholds and migration gates say the transition is needed.

## 6. What prototype v5 does and does not establish

| Evidence class | Current v5 evidence | Release-planning implication |
| --- | --- | --- |
| Strong interaction direction | Image-first Calendar, selected-day Museum Margin, full Journal Day, real-photo cover precedence, separated Generated Artwork, manual journal upload review, generated-reflection editing, Settings/privacy copy, light/dark themes, keyboard calendar movement, focus treatment, responsive layouts, and reduced motion | Preserve these interaction ideas as design inputs for R1, R2, R6, and R7. |
| Partial representation | Search, Almanac, source conflict choices, artwork generation, provenance disclosures, responsive behavior, and accessibility scaffolding | Convert placeholders and simulated state into release-specific acceptance flows; do not count them as completed requirements. |
| Missing product surfaces | Needs Date Review, cross-month Timeline, complete History, Trash, Suppressions, Export, System Health, Recovery Ceremony, real Correction/diff, atomic redating, complete AI failure states, and Telegram conversation outcomes | Design these before the release that depends on them; do not wait for a final visual-polish phase. |
| Explicitly outside evidence | Persistence, integrations, authorization enforcement, encryption, shared-host co-existence, backup/restore, provider contracts, deployment, and production behavior | These require architecture spikes, implementation, executed tests, and owner verification. |

The v5 implementation stores all mutations in browser memory and labels itself as a throwaway prototype with no integrations. Its current `Almanac` is a useful monthly reading mode, but it does not satisfy the PRD's cross-month Timeline requirement. Its Search prototype also writes the query into the URL and therefore must not be adopted unchanged.

See the [v5 feature audit](../audits/PROTOTYPE-V5-FEATURE-AUDIT.md) for the complete prototype-to-requirement inspection.

## 7. Release principles and dependency logic

1. **Prove co-existence before personal data.** R0 performs the shared-host spike, deploys only synthetic fixtures, and proves rollback/recovery without introducing real memories.
2. **Start with the simplest authentic source.** R1 establishes the domain, encryption, backup, Calendar, Journal Day, and owner verification using manual text files before any webhook dependency.
3. **Add photos before advanced retrieval.** R2 introduces the first media data shape and therefore must close validation, encryption, derivative, duplicate, cover, and media-restore behavior together.
4. **Make content findable and date-correctable before adding more automatic sources.** R3 reduces the cost of correcting capture mistakes and proves search privacy.
5. **Close lifecycle trust before automated reconciliation.** R4 implements Corrections, history, Trash, suppressions, and export so future upstream changes cannot silently damage truth.
6. **Retire integration uncertainty before enabling VoiceNotes.** R5 cannot enter implementation until the synthetic VoiceNotes contract spike passes or the affected product decision is reopened.
7. **Keep AI optional and late.** R6 and R7 follow authentic capture, retrieval, lifecycle, recovery, and privacy boundaries. Model evaluation is an entry gate, not a release task that may be waived.
8. **Stabilize the integrated operating model before launch acceptance.** R8 proves capacity and failure behavior; R9 proves the full private journey and absorbs defects without adding scope.
9. **Scale storage only when evidence triggers it.** R10 has no proposed calendar dates; it depends on measured watermarks and the object-store recovery proof.

## 8. Proposed production release plan

Dates are proposed planning ranges in `Asia/Kolkata`, not delivery commitments. A release moves only when its entry evidence exists.

| Milestone | Proposed range | Initial roadmap status | Independently usable outcome | Owner verification / exit evidence | Primary dependency |
| --- | --- | --- | --- | --- | --- |
| **R0 — Shared-Host Private Foundation** | 2026-08-17 to 2026-08-28 | Next | Synthetic/private shell can be authenticated, observed, backed up, restored, upgraded, and rolled back without disrupting co-resident systems | Owner can sign in to a synthetic shell; access denial works; existing services show no material regression; representative encrypted synthetic data restores; rollback returns both products to their prior state | Approved host/co-existence spike and foundational ADRs |
| **R1 — Manual Journal Archive** | 2026-08-31 to 2026-09-18 | Backlog | First memory-creating release: add `.txt`/`.md` journals to an explicit date and revisit them in Calendar and Journal Day | One real owner-approved text fixture survives upload, restart, backup, restore, and export/checksum verification; no future or implicit global date is accepted | R0 accepted |
| **R2 — Telegram Photo Capture** | 2026-09-21 to 2026-10-09 | Backlog | Send a private Telegram photo/document and revisit it in a real-photo-first gallery and Calendar | Authorized capture, invalid media, explicit date, invalid/future date, album, duplicate, cover, thumbnail, Original download, backup, and restore fixtures pass; AI serialization contains no photo data | R1 domain/storage foundation |
| **R3 — Retrieval and Date Integrity** | 2026-10-12 to 2026-10-30 | Backlog | Browse across months, find exact content, resolve Needs Date Review, and move a Source Item safely | Known phrase/date/tag/caption fixtures are found without query leakage; history is opt-in; redating proves both days and derived-state effects atomically; new search/date state restores | R2 capture data shapes |
| **R4 — Source History and Lifecycle Safety** | 2026-11-02 to 2026-11-20 | Backlog | Correct displayed text, resolve upstream conflict, inspect history, restore Trash, manage suppressions, and create a complete restorable export | All three conflict choices produce distinct outcomes; delete/restore/permanent-delete invariants pass; exported archive validates and restores current/history/Trash/suppression relationships | R3 date/search integrity |
| **R5 — Prospective VoiceNotes Sync** | 2026-11-23 to 2026-12-11 | Backlog | Eligible post-activation VoiceNotes arrive automatically and remain revision-safe | Synthetic contract spike passes; exact tag/activation/date rules pass; replay/reconciliation recovers missed/duplicate/out-of-order events; pre-activation note does not import; new source/revision state restores | R4 lifecycle plus passing VoiceNotes spike |
| **R6 — Generated Text Reflection** | 2026-12-14 to 2027-01-08 | Backlog | Optional evaluated title, summary, tags, and Visual Brief improve navigation without replacing sources | Text hard gates pass; title/summary/tags protect independently; stale replacements require choice; no photo/caption data serializes; budget and provider failures leave archive usable; derived versions restore | R5 authentic source set plus approved text evaluation |
| **R7 — Generated Artwork** | 2027-01-11 to 2027-01-29 | Backlog | Owner can generate and manage labeled symbolic artwork without displacing a real-photo cover | Artwork hard gates pass; preflight shows brief/provider/cost; safety/budget/failure states are explicit; versions and suppression restore; real photo always retains cover precedence | R6 Visual Brief/provenance plus approved artwork evaluation |
| **R8 — Operational Scale and Resilience** | 2027-02-01 to 2027-02-19 | Backlog | Integrated archive degrades safely under dependency, capacity, restart, and job failures | Capacity watermarks, repeated-failure alerts, job restart, provider isolation, backup checks, sampled restores, browser/accessibility matrix, and rollback drills pass across all live data shapes | R0–R7 integrated |
| **R9 — Private Launch Acceptance and Stabilization** | 2027-02-22 to 2027-03-12 | Backlog | Complete private product is accepted for routine personal use and stabilized without new scope | Owner completes capture, review, search, correction, redating, deletion/restoration, export, backup/restore, budget, and failure scenarios; Recovery Ceremony passes; no unresolved severity-1/2 defect; observation window and rollback evidence complete | R8 accepted and explicit production/launch authority |
| **R10 — Object-store Transition** | **No date — conditional** | Backlog | Move live media to the approved object-store target only when local capacity requires it | Approved watermarks trigger entry; complete inventory, dual-write, reconciliation, backup/restore, reversible pointer migration, observed target reads, and rollback pass before local authoritative copies can be retired | Measured threshold trigger plus migration/recovery gates |

## 9. Requirement-to-milestone matrix

The primary milestone is where the requirement first becomes release-blocking. Cross-cutting requirements remain regression gates in all later releases.

The supplied PRD contains **71 P0 requirements**, **3 P3 requirements**, and **4 P4 requirements**. All 71 P0 IDs are assigned below to an R0–R10 delivery or regression gate; all seven P3/P4 IDs remain explicitly date-free and outside R0–R9 scope.

### Product boundary and capture

| Requirement | Primary milestone | Release acceptance focus |
| --- | --- | --- |
| `LID-SCP-001` | R0 | One private user, complete access boundary, no public/share surface |
| `LID-SCP-002` | R1 | Fixed Journal Date semantics and immutable Original Timestamp |
| `LID-SCP-003` | R1 | Separate source and derived records from the first persistent schema |
| `LID-SCP-004` | R4 | Hide source-empty days while retaining manageable history |
| `LID-TG-001` | R2 | Webhook secret plus exact user/private-chat authorization |
| `LID-TG-002` | R2 | Compressed photo and still-image document behavior |
| `LID-TG-003` | R2 | Content-based validation, limits, and clear rejection |
| `LID-TG-004` | R2 | Acknowledge only after durable encrypted capture |
| `LID-TG-005` | R2 | Receipt-date and exact caption-date behavior across media groups |
| `LID-TG-006` | R2 | Durable Needs Date Review rather than silent fallback |
| `LID-TG-007` | R2 | Persistent gallery order and real-photo cover |
| `LID-TG-008` | R2 | Global checksum deduplication with explicit Add Anyway |
| `LID-TG-009` | R2 | Searchable local Photo Caption excluded from AI |
| `LID-TG-010` | R2 | Byte-preserved Original and local metadata-free derivative |
| `LID-VN-001` | R5 | Synthetic integration gate before contract freeze |
| `LID-VN-002` | R5 | Webhook as wake signal; authoritative retrieval only |
| `LID-VN-003` | R5 | Exact tag and immutable Integration Activation boundary |
| `LID-VN-004` | R5 | Creation-time dating or Needs Date Review |
| `LID-VN-005` | R5 | Replay-safe, fail-closed reconciliation |
| `LID-VN-006` | R5 | Retained upstream edits, untag, and deletion state |
| `LID-VN-007` | R5 | Source Suppression and explicit re-import control |
| `LID-UP-001` | R1 | Explicit-date UTF-8 `.txt`/`.md` upload |
| `LID-UP-002` | R1 | Separate original file, metadata, checksum, and source title |
| `LID-UP-003` | R1 | Duplicate warning with explicit non-overwriting override |
| `LID-SRC-001` | R4 | Corrections and immutable source revisions |
| `LID-SRC-002` | R4 | Accessible diff and exactly three conflict outcomes |
| `LID-SRC-003` | R3 | Atomic redating across both days and affected derived state |
| `LID-SRC-004` | R4 | Exact source-set binding and distinct stale/historical behavior |
| `LID-UP-004` | Deferred backlog | No blank composition, PDF, Word, or OCR scope in R0–R9 |

### Reflection and AI

| Requirement | Primary milestone | Release acceptance focus |
| --- | --- | --- |
| `LID-REF-001` | R1 | Monday-first image-led Calendar with accessible cover identity |
| `LID-REF-002` | R3 | Cross-month chronological Timeline; Almanac alone is insufficient |
| `LID-REF-003` | R3 | Exact lexical/date/tag/caption search with opt-in history |
| `LID-REF-004` | R1 | Authentic Journal Day detail; later releases extend sections |
| `LID-REF-005` | R1 | Light/dark visual system and reduced-motion behavior |
| `LID-REF-006` | R1 and every later gate | Responsive, browser, keyboard, screen-reader, zoom, and private image-description support |
| `LID-REF-007` | R4 | Contextual confirmations for lifecycle, provider, and spend-bearing actions |
| `LID-AIT-001` | R6 | Signed text-model evaluation gate |
| `LID-AIT-002` | R6 | Independent approved provider/model settings only |
| `LID-AIT-003` | R6 | Contract-valid title, summary, tags, and Visual Brief |
| `LID-AIT-004` | R6 | Quiet period and final refresh with source-race protection |
| `LID-AIT-005` | R6 | Independent field protection, suggestions, and resume behavior |
| `LID-AIT-006` | R6 | Typed text-request allowlist and photo-data exclusion |
| `LID-AIT-007` | R6 | Failure isolation, safe provenance, and no hidden fallback |
| `LID-AIA-001` | R7 | Signed artwork-model evaluation gate |
| `LID-AIA-002` | R7 | Read-only, versioned Visual Brief |
| `LID-AIA-003` | R7 | Explicit manual request preflight and meaningful-word gates |
| `LID-AIA-004` | R7 | Idempotent 01:00 fallback sweep |
| `LID-AIA-005` | R7 | Non-photorealistic direction and persistent AI labeling |
| `LID-AIA-006` | R7 | Neutral safety/failure behavior without retry/fallback loops |
| `LID-AIA-007` | R7 | Complete artwork version lifecycle |
| `LID-AIA-008` | R7 | Real-photo Calendar Cover always wins |
| `LID-AIA-009` | R7 | Artwork Suppression and explicit Allow generation |
| `LID-AIA-010` | R7 | Stale artwork after text changes without silent removal |
| `LID-AIA-011` | R7 | Approved exact model configurations and automatic-sweep eligibility |

### Operations, recovery, and scale

| Requirement | Primary milestone | Release acceptance focus |
| --- | --- | --- |
| `LID-OPS-001` | R0 | External human access assertion, exact owner policy, and session expiry |
| `LID-OPS-002` | R0 | Separate callback host/path boundary with no human route |
| `LID-OPS-003` | R0 | Runtime-only secrets and verified absence from source/log/export/client |
| `LID-OPS-004` | R0 | Application-controlled authenticated encryption and honest limitations |
| `LID-OPS-005` | R2 | Bounded secure media staging and constrained decoding |
| `LID-OPS-006` | R8 | Measured live-storage watermarks and safe emergency stop |
| `LID-OPS-007` | R2 foundation; R10 transition | Storage-neutral media abstraction starts in R2; conditional verified cutover occurs only after the R10 trigger |
| `LID-OPS-008` | R0 | Authenticated same-origin private/no-store delivery |
| `LID-OPS-009` | R2 | Transactional Media Asset reference lifecycle |
| `LID-OPS-010` | R4 | 30-day Trash, restore, and explicit permanent deletion |
| `LID-OPS-011` | R0 and every later gate | Independent encrypted backup plus executed restore evidence for every new data shape |
| `LID-OPS-012` | R0, repeated at R9 | Recovery Ceremony boundary; R0 synthetic proof and R9 launch proof |
| `LID-OPS-013` | R4 | Complete restorable export with safe passphrase/download lifecycle |
| `LID-OPS-014` | R0, expanded each release | Durable System Health evidence, never optimistic job-start status |
| `LID-OPS-015` | R2, expanded at R5 | Deduplicated operational alerts only, without private content |
| `LID-OPS-016` | R0 | Allowlisted local logs, 30-day retention, no third-party analytics |
| `LID-OPS-017` | R6 | Predictive AI budget enforcement without disabling the archive |
| `LID-OPS-018` | R0 and every later gate | Shared-host best effort, restart safety, and dependency failure isolation |

### Explicitly deferred requirements

| Requirement | Milestone | Release acceptance focus |
| --- | --- | --- |
| `LID-DEF-001` | Deferred backlog | No historical VoiceNotes import in R0–R9 |
| `LID-DEF-002` | Deferred backlog | No coaching, themes, streaks, or resurfacing in R0–R9 |
| `LID-DEF-003` | Deferred backlog | No semantic/conversational retrieval in R0–R9 |
| `LID-DEF-004` | Deferred backlog | No year mosaic, media wall, maps, or native/offline app |
| `LID-DEF-005` | Deferred backlog | No PDF/Word/OCR ingestion, books, printing, or immutable export claim |
| `LID-DEF-006` | Deferred backlog | No additional/fuzzy VoiceNotes tag eligibility |

R9 has no net-new feature requirement. It is the integrated acceptance gate for every applicable P0 requirement above. R10 owns only the conditional transition in `LID-OPS-007`; the storage abstraction and watermarks are planned and gated in earlier releases.

## 10. Acceptance and outcome metrics

### Release-level universal gates

Every production release must meet all of the following:

- **Traceability:** every included `LID-*` requirement links to implementation, tests, design evidence, and owner walkthrough evidence.
- **Rollback:** deployment rollback is executed in a representative environment; any data migration has a tested forward and backward or compatibility path.
- **Recovery:** backup, restore, and integrity validation cover every data shape added in the release.
- **Privacy:** serialization/log/export tests show that forbidden content and secrets are absent.
- **Accessibility:** affected flows pass keyboard, focus, labels, contrast, reduced motion, and the supported responsive/browser matrix.
- **Failure truthfulness:** the UI distinguishes waiting, succeeded, failed, blocked, unknown, and never verified without claiming a stronger state.
- **Owner acceptance:** the owner completes the release's named scenario with no critical misunderstanding or data-loss expectation.

### Product outcome metrics

| Outcome | Acceptance signal |
| --- | --- |
| Trustworthy capture | Every accepted fixture creates a durable, provenance-bound Source Item or an explicit preserved review/failure state; zero silent loss, overwrite, misdate, or misrepresentation |
| Correct dates | Midnight, explicit historical date, invalid/future date, Needs Date Review, and redating fixtures behave deterministically in `Asia/Kolkata` |
| Private AI boundary | Zero photo bytes, derivatives, metadata, identifiers, captions, or descriptions occur in any AI request, log, fixture, or telemetry |
| Recoverability | Representative restore succeeds before R1 real use; each later release restores its new shapes; R9 Recovery Ceremony succeeds with owner sign-off |
| Retrieval | Exact phrase/date/tag/caption fixtures return explainable current results; history remains off by default; no query enters URL or operational logs |
| Source fidelity | Source bytes, Original Timestamp, revisions, Corrections, active display choice, and provenance survive redating, Trash, export, and restore |
| Optional AI quality | Only models passing the approved hard gates appear; generation failure never hides or damages authentic content |
| Cost control | A predicted over-ceiling AI request does not execute; exhaustion leaves non-AI archive functions available |
| Accessibility | All owner-critical tasks remain usable at compact widths, zoom, keyboard-only, screen-reader, light/dark, and reduced-motion conditions |
| Shared-host safety | Co-resident services show no material regression during deploy, steady state, restart, backup, restore, and rollback scenarios |

## 11. Individual release PRD/PID set

All eleven planning documents now exist and are indexed in the [release-document index](../product/releases/README.md). The Product Manager owns their content; the roadmap links each task to its release document. Their completion is product-definition evidence only and does not approve or complete implementation or a release.

| PRD ID | Published planning artifact | Required product decision content |
| --- | --- | --- |
| `PRD-R0` | `docs/product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md` | Synthetic-only boundary, private access, co-existence outcomes, recovery/rollback acceptance, and R1 entry gate |
| `PRD-R1` | `docs/product/releases/PRD-R1-MANUAL-JOURNAL-ARCHIVE.md` | Manual upload, date semantics, source preservation, Calendar, Journal Day, themes, accessibility, and first-memory acceptance |
| `PRD-R2` | `docs/product/releases/PRD-R2-TELEGRAM-PHOTO-CAPTURE.md` | Bot authorization, accepted media, date/caption/album behavior, Needs Date Review, gallery/cover, duplicates, and photo privacy |
| `PRD-R3` | `docs/product/releases/PRD-R3-RETRIEVAL-DATE-INTEGRITY.md` | Timeline, deterministic Search, query privacy, date review, redating, and explainable results |
| `PRD-R4` | `docs/product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md` | Corrections, conflict choices, source binding, History, Trash, suppressions, management safety, and complete export |
| `PRD-R5` | `docs/product/releases/PRD-R5-PROSPECTIVE-VOICENOTES-SYNC.md` | Synthetic-spike gate, exact eligibility, activation, dating, reconciliation, upstream lifecycle, and suppression |
| `PRD-R6` | `docs/product/releases/PRD-R6-GENERATED-TEXT-REFLECTION.md` | Evaluation gate, output contract, privacy allowlist, quiet/final refresh, protected fields, provenance, failures, and budget |
| `PRD-R7` | `docs/product/releases/PRD-R7-GENERATED-ARTWORK.md` | Evaluation gate, Visual Brief, manual/sweep flows, style, labeling, failures, versions, cover precedence, suppression, and configuration |
| `PRD-R8` | `docs/product/releases/PRD-R8-OPERATIONAL-SCALE-RESILIENCE.md` | Watermarks, safe degradation, alerts, capacity/restart/fault behavior, integrated recovery evidence, and release hardening |
| `PRD-R9` | `docs/product/releases/PRD-R9-PRIVATE-LAUNCH-ACCEPTANCE.md` | Complete owner-acceptance script, severity gate, Recovery Ceremony, observation window, rollback decision, and launch/stabilization exit |
| `PID-R10` | `docs/product/releases/PID-R10-OBJECT-STORE-TRANSITION.md` | Trigger evidence, no-date entry rule, transition outcomes, user-visible capacity states, rollback, and owner acceptance; implementation detail remains in architecture/runbook artifacts |

Every release PRD should contain: problem slice, user outcome, included and excluded `LID-*` IDs, owner scenario, functional acceptance, privacy/recovery/accessibility gates, release/rollback decision, evidence links, and explicit non-goals.

## 12. Roadmap metadata contract and recommended seed tasks

### Required GitHub Project fields

| Field | Type / values | Rule |
| --- | --- | --- |
| Status | Single select: `Backlog`, `Next`, `In progress`, `Done` | `Done` requires the item's named evidence. A release cannot be `Done` from prototype or document intent alone. |
| Milestone | Single select or text: `P0`, `R0`–`R10` | Every task belongs to exactly one milestone. Council planning uses `P0`; deferred requirements use `Deferred`, not a release milestone. |
| Start date | Date | Proposed planning date; blank for R10 until its trigger is met. |
| Target date | Date | Proposed planning date; blank for R10 until its trigger is met. |
| Description | Long text | Outcome, scope, requirement IDs, dependencies, acceptance evidence, and rollback/recovery impact. |
| PRD/PID link | URL/text | Repository-relative link to the release PRD/PID; global PRD is temporary fallback only. |
| Design artifact link | URL/text | Release-specific UX artifact, prototype, flow, or explicit `N/A — non-visual` with reason. |
| Requirement IDs | Text | Exact stable `LID-*` IDs; no family shorthand when a task changes behavior. |
| Evidence link | URL/text | Test report, spike result, owner walkthrough, restore report, or release record required before `Done`. |
| Rollback / restore impact | Text | State whether the task adds a data shape, migration, job, provider call, or no persistent change. |

### Status segmentation at council handoff

This review snapshot is reconciled to the canonical [PHASE1-ROADMAP-MANIFEST.json](../project/PHASE1-ROADMAP-MANIFEST.json). The manifest governs final publication status and milestone values; documentation completion never implies feature implementation, deployment, production readiness, or release acceptance.

| Status | Recommended items |
| --- | --- |
| Done | AUD-001, PC-001, PRD-R0-001 through PRD-R9-001, and PID-R10-001: 13 planning artifacts with their named documentation evidence. |
| In progress | SPK-R0-001 shared-host coexistence and rollback spike: one evidence-producing technical spike, not an implementation or deployment claim. |
| Next | UX-R0-001, ARCH-R0-001, ENG-R0-001, and REL-R0-001: four R0 tasks whose own exit evidence does not yet exist. |
| Backlog | The remaining 40 R1–R10 implementation, design, evaluation, validation, release, and conditional-transition tasks. R10 execution remains date-free and trigger-blocked. |

### Task-level roadmap seed

This 58-row seed is rendered from the canonical roadmap manifest after the release PRD/PID artifacts were generated. Use the manifest for machine publication and [PHASE1-RELEASE-PLAN.md](../project/PHASE1-RELEASE-PLAN.md) for the richer requirement, dependency, evidence, and rollback fields.

| Task ID | Title | Status | Milestone | Proposed dates | Description | PRD/PID | Design artifact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `AUD-001` | v5 Feature Audit | Done | P0 | 2026-08-14 | Classify every v5 interaction as strong, partial, missing, or outside implementation evidence. | [PRODUCT-REQUIREMENTS](../product/PRODUCT-REQUIREMENTS.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `PC-001` | Integrated Council Planning Package | Done | P0 | 2026-08-14 to 2026-08-16 | Reconcile Product, Design, Architecture, and Project Management decisions into one delivery baseline. | [PRODUCT-REQUIREMENTS](../product/PRODUCT-REQUIREMENTS.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `SPK-R0-001` | Shared-host Coexistence & Rollback Spike | In progress | R0 | 2026-08-17 to 2026-08-19 | Prove namespaced shared-host fit with synthetic data, explicit capacity assumptions, non-regression, restore, and rollback. | [PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION](../product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `PRD-R0-001` | Private Foundation PRD | Done | R0 | 2026-08-17 to 2026-08-20 | Define the synthetic-only private foundation outcome and prohibit authentic memory ingestion before R0 acceptance. | [PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION](../product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `UX-R0-001` | First-use/Access/Health States | Next | R0 | 2026-08-18 to 2026-08-21 | Design first use, access denial/expiry, System Health, synthetic recovery, failure, and rollback states. | [PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION](../product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `ARCH-R0-001` | Private Shell Architecture & Threat Baseline | Next | R0 | 2026-08-17 to 2026-08-21 | Freeze namespaced processes, loopback ingress, callback isolation, encryption, secrets, logging, backup, and recovery architecture. | [PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION](../product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `ENG-R0-001` | Deploy Synthetic Private Shell | Next | R0 | 2026-08-21 to 2026-08-26 | Build and deploy an authenticated synthetic shell with health evidence and no route or data path for real memories. | [PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION](../product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `REL-R0-001` | Restore/Rollback/Non-regression Acceptance | Next | R0 | 2026-08-27 to 2026-08-28 | Execute access, coexistence, encrypted synthetic restore, restart, rollback, and co-resident non-regression gates. | [PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION](../product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `PRD-R1-001` | Manual Archive PRD | Done | R1 | 2026-08-31 to 2026-09-02 | Define the first memory-creating release with explicit-date text upload and authentic Calendar/Journal Day recall. | [PRD-R1-MANUAL-JOURNAL-ARCHIVE](../product/releases/PRD-R1-MANUAL-JOURNAL-ARCHIVE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `UX-R1-001` | Calendar/Day/Upload Designs | Backlog | R1 | 2026-08-31 to 2026-09-04 | Finalize Calendar, Journal Day, upload, empty/loading/error, responsive, theme, and accessibility states. | [PRD-R1-MANUAL-JOURNAL-ARCHIVE](../product/releases/PRD-R1-MANUAL-JOURNAL-ARCHIVE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `ARCH-R1-001` | Journal/Source/Encryption Schema | Backlog | R1 | 2026-08-31 to 2026-09-04 | Define Journal Day, immutable source file, checksum, encryption, index, backup, restore, and migration contracts. | [PRD-R1-MANUAL-JOURNAL-ARCHIVE](../product/releases/PRD-R1-MANUAL-JOURNAL-ARCHIVE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `ENG-R1-001` | Manual Upload & Reflection Core | Backlog | R1 | 2026-09-03 to 2026-09-15 | Implement durable explicit-date text upload, duplicate override, Calendar, and authentic Journal Day display. | [PRD-R1-MANUAL-JOURNAL-ARCHIVE](../product/releases/PRD-R1-MANUAL-JOURNAL-ARCHIVE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `REL-R1-001` | First-memory Restore/Rollback Acceptance | Backlog | R1 | 2026-09-16 to 2026-09-18 | Verify one owner-approved source survives upload, restart, export, backup, restore, and rollback without time/date drift. | [PRD-R1-MANUAL-JOURNAL-ARCHIVE](../product/releases/PRD-R1-MANUAL-JOURNAL-ARCHIVE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `PRD-R2-001` | Telegram Capture PRD | Done | R2 | 2026-09-21 to 2026-09-23 | Define authorized media forms, dating/review, durable acknowledgement, gallery, duplicate, caption, and privacy behavior. | [PRD-R2-TELEGRAM-PHOTO-CAPTURE](../product/releases/PRD-R2-TELEGRAM-PHOTO-CAPTURE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `UX-R2-001` | Telegram/Date Review/Gallery Designs | Backlog | R2 | 2026-09-21 to 2026-09-25 | Design companion messages, media/date failures, Needs Date Review, gallery, cover, duplicates, and media management. | [PRD-R2-TELEGRAM-PHOTO-CAPTURE](../product/releases/PRD-R2-TELEGRAM-PHOTO-CAPTURE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `ARCH-R2-001` | Media Pipeline & Asset Lifecycle | Backlog | R2 | 2026-09-21 to 2026-09-25 | Define callback authorization, bounded staging/decoding, ciphertext/derivative flow, media references, deduplication, and restore. | [PRD-R2-TELEGRAM-PHOTO-CAPTURE](../product/releases/PRD-R2-TELEGRAM-PHOTO-CAPTURE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `ENG-R2-001` | Telegram Authorization & Durable Capture | Backlog | R2 | 2026-09-24 to 2026-10-02 | Implement secret/sender/chat authorization, media validation, exact dating, review holding, and post-commit acknowledgement. | [PRD-R2-TELEGRAM-PHOTO-CAPTURE](../product/releases/PRD-R2-TELEGRAM-PHOTO-CAPTURE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `ENG-R2-002` | Gallery/Cover/Dedup/Derivatives | Backlog | R2 | 2026-09-28 to 2026-10-06 | Implement durable gallery order, real-photo cover, global checksum references, captions, byte-preserved Originals, and local metadata-free thumbnails. | [PRD-R2-TELEGRAM-PHOTO-CAPTURE](../product/releases/PRD-R2-TELEGRAM-PHOTO-CAPTURE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `REL-R2-001` | Media Privacy/Restore Acceptance | Backlog | R2 | 2026-10-07 to 2026-10-09 | Execute capture, invalid input/date, album, duplicate, cover, Original, AI-exclusion, media restore, and rollback fixtures. | [PRD-R2-TELEGRAM-PHOTO-CAPTURE](../product/releases/PRD-R2-TELEGRAM-PHOTO-CAPTURE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `PRD-R3-001` | Retrieval & Date Integrity PRD | Done | R3 | 2026-10-12 to 2026-10-14 | Define cross-month Timeline, exact retrieval, query privacy, Date Review, and atomic redating invariants. | [PRD-R3-RETRIEVAL-DATE-INTEGRITY](../product/releases/PRD-R3-RETRIEVAL-DATE-INTEGRITY.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `UX-R3-001` | Timeline/Search/Date Review Designs | Backlog | R3 | 2026-10-12 to 2026-10-16 | Design Timeline, search scope/results/history, Date Review, redating preview, interruption, and failure states. | [PRD-R3-RETRIEVAL-DATE-INTEGRITY](../product/releases/PRD-R3-RETRIEVAL-DATE-INTEGRITY.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `ARCH-R3-001` | Search Index & Redating Transaction | Backlog | R3 | 2026-10-12 to 2026-10-16 | Define encrypted lexical indexes, query/log privacy, date-review storage, and one-transaction old/new-day redating. | [PRD-R3-RETRIEVAL-DATE-INTEGRITY](../product/releases/PRD-R3-RETRIEVAL-DATE-INTEGRITY.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `ENG-R3-001` | Timeline/Search/Date Review/Redating | Backlog | R3 | 2026-10-15 to 2026-10-28 | Implement cross-month browsing, deterministic lexical/date/tag/caption retrieval, review resolution, and atomic redating. | [PRD-R3-RETRIEVAL-DATE-INTEGRITY](../product/releases/PRD-R3-RETRIEVAL-DATE-INTEGRITY.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `REL-R3-001` | Query Privacy & Date Atomicity Acceptance | Backlog | R3 | 2026-10-29 to 2026-10-30 | Verify exact results, opt-in history, zero query leakage, two-day atomicity, index recovery, restore, and rollback. | [PRD-R3-RETRIEVAL-DATE-INTEGRITY](../product/releases/PRD-R3-RETRIEVAL-DATE-INTEGRITY.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `PRD-R4-001` | Lifecycle PRD | Done | R4 | 2026-11-02 to 2026-11-04 | Define Corrections, conflict choices, source binding, History, Trash, suppressions, confirmations, and complete export. | [PRD-R4-SOURCE-HISTORY-LIFECYCLE](../product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `UX-R4-001` | Diff/History/Trash/Export Designs | Backlog | R4 | 2026-11-02 to 2026-11-06 | Design accessible diff, Correction, History, Trash, suppression, confirmation, and encrypted-export workflows. | [PRD-R4-SOURCE-HISTORY-LIFECYCLE](../product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `ARCH-R4-001` | Revision/Suppression/Export Lifecycle | Backlog | R4 | 2026-11-02 to 2026-11-06 | Define immutable revisions/Corrections, active display binding, Trash/suppression state machine, passphrase handoff, export cleanup, and restore. | [PRD-R4-SOURCE-HISTORY-LIFECYCLE](../product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `ENG-R4-001` | Corrections/Conflict/History | Backlog | R4 | 2026-11-05 to 2026-11-13 | Implement immutable Corrections, retained revisions, exactly three conflict outcomes, exact source-set binding, and inspectable History. | [PRD-R4-SOURCE-HISTORY-LIFECYCLE](../product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `ENG-R4-002` | Trash/Suppressions/Export | Backlog | R4 | 2026-11-09 to 2026-11-18 | Implement 30-day Trash, restoration/permanent deletion, suppressions, complete encrypted export, cleanup, and import validation. | [PRD-R4-SOURCE-HISTORY-LIFECYCLE](../product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `REL-R4-001` | Lifecycle/Export Restore Acceptance | Backlog | R4 | 2026-11-19 to 2026-11-20 | Verify conflict outcomes, deletion/restoration, day visibility, suppression, export completeness, import/restore, and rollback. | [PRD-R4-SOURCE-HISTORY-LIFECYCLE](../product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `SPK-R5-001` | VoiceNotes Synthetic Contract Spike | Backlog | R5 | 2026-11-23 to 2026-11-25 | Prove exact note/revision identity, unattended authorization, authoritative retrieval, tag/date/transcript, wakeups, reconciliation, and failure behavior using synthetic data. | [PRD-R5-PROSPECTIVE-VOICENOTES-SYNC](../product/releases/PRD-R5-PROSPECTIVE-VOICENOTES-SYNC.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `PRD-R5-001` | VoiceNotes PRD | Done | R5 | 2026-11-23 to 2026-11-27 | Define spike-gated prospective eligibility, activation, dating, reconciliation, revisions, suppression, and lifecycle behavior. | [PRD-R5-PROSPECTIVE-VOICENOTES-SYNC](../product/releases/PRD-R5-PROSPECTIVE-VOICENOTES-SYNC.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `UX-R5-001` | Integration/Reconciliation/Lifecycle Designs | Backlog | R5 | 2026-11-24 to 2026-11-27 | Design activation, integration health, Date Review, reconciliation, upstream revision/conflict, suppression, and re-import states. | [PRD-R5-PROSPECTIVE-VOICENOTES-SYNC](../product/releases/PRD-R5-PROSPECTIVE-VOICENOTES-SYNC.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `ARCH-R5-001` | VoiceNotes Adapter & Reconciliation Contract | Backlog | R5 | 2026-11-24 to 2026-11-27 | Freeze the spike-proven adapter, opaque identities, authorization renewal, fail-closed paging, durable jobs, reconciliation, and restore design. | [PRD-R5-PROSPECTIVE-VOICENOTES-SYNC](../product/releases/PRD-R5-PROSPECTIVE-VOICENOTES-SYNC.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `ENG-R5-001` | Prospective Import & Revisions | Backlog | R5 | 2026-11-26 to 2026-12-09 | Implement exact post-activation import, creation-time dating/review, replay-safe reconciliation, revisions, upstream status, suppression, and alerts. | [PRD-R5-PROSPECTIVE-VOICENOTES-SYNC](../product/releases/PRD-R5-PROSPECTIVE-VOICENOTES-SYNC.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `REL-R5-001` | Replay/Suppression/Restore Acceptance | Backlog | R5 | 2026-12-10 to 2026-12-11 | Verify activation boundaries, missed/duplicate/out-of-order replay, revisions, suppression/re-import, integration failure isolation, restore, and rollback. | [PRD-R5-PROSPECTIVE-VOICENOTES-SYNC](../product/releases/PRD-R5-PROSPECTIVE-VOICENOTES-SYNC.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `EVAL-R6-001` | Text Model Evaluation | Backlog | R6 | 2026-12-14 to 2026-12-18 | Evaluate exact text provider/model snapshots against privacy, fidelity, schema, language, latency, and measured-cost hard gates. | [PRD-R6-GENERATED-TEXT-REFLECTION](../product/releases/PRD-R6-GENERATED-TEXT-REFLECTION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `PRD-R6-001` | Generated Text PRD | Done | R6 | 2026-12-14 to 2026-12-18 | Define evaluated optional text derivation, typed inputs, quiet/final refresh, protection, provenance, failures, and budgets. | [PRD-R6-GENERATED-TEXT-REFLECTION](../product/releases/PRD-R6-GENERATED-TEXT-REFLECTION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `UX-R6-001` | Text/Provider/Budget States | Backlog | R6 | 2026-12-16 to 2026-12-22 | Design title/summary/tag/brief review, field protection, stale suggestions, provenance, provider health, budget, and failure states. | [PRD-R6-GENERATED-TEXT-REFLECTION](../product/releases/PRD-R6-GENERATED-TEXT-REFLECTION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `ARCH-R6-001` | Text Adapter/Jobs/Budget/Provenance | Backlog | R6 | 2026-12-16 to 2026-12-22 | Define typed allowlist serialization, exact adapter configuration, source-race-safe jobs, independent protection, provenance, usage ledger, and restore. | [PRD-R6-GENERATED-TEXT-REFLECTION](../product/releases/PRD-R6-GENERATED-TEXT-REFLECTION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `ENG-R6-001` | Text Derivation & Protected Fields | Backlog | R6 | 2026-12-21 to 2027-01-06 | Implement evaluated title/summary/tag/Visual Brief derivation, quiet/final refresh, field protection, version choice, provenance, and budget enforcement. | [PRD-R6-GENERATED-TEXT-REFLECTION](../product/releases/PRD-R6-GENERATED-TEXT-REFLECTION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `REL-R6-001` | Text Privacy/Quality/Restore Acceptance | Backlog | R6 | 2027-01-07 to 2027-01-08 | Verify hard-gate model quality, photo/caption exclusion, source races, protected fields, failures, monthly ceiling, derived restore, and rollback. | [PRD-R6-GENERATED-TEXT-REFLECTION](../product/releases/PRD-R6-GENERATED-TEXT-REFLECTION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `EVAL-R7-001` | Artwork Model Evaluation | Backlog | R7 | 2027-01-11 to 2027-01-13 | Evaluate exact artwork provider/model configurations against non-photorealism, safety, quality, latency, cost, and automatic-sweep eligibility gates. | [PRD-R7-GENERATED-ARTWORK](../product/releases/PRD-R7-GENERATED-ARTWORK.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `PRD-R7-001` | Artwork PRD | Done | R7 | 2027-01-11 to 2027-01-13 | Define evaluated Visual Brief, manual/sweep generation, safety/failure, labeling, versions, cover precedence, suppression, and configuration. | [PRD-R7-GENERATED-ARTWORK](../product/releases/PRD-R7-GENERATED-ARTWORK.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `UX-R7-001` | Artwork/Version/Suppression Designs | Backlog | R7 | 2027-01-12 to 2027-01-15 | Design preflight, meaningful-word, safety/failure, persistent label, versions, stale, suppression, and real-photo-cover states. | [PRD-R7-GENERATED-ARTWORK](../product/releases/PRD-R7-GENERATED-ARTWORK.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `ARCH-R7-001` | Artwork Adapter/Sweep/Budget/Provenance | Backlog | R7 | 2027-01-12 to 2027-01-15 | Define exact adapter/configuration, preflight, idempotent sweep, artifact lifecycle, provenance, budget reservation, suppression, and restore. | [PRD-R7-GENERATED-ARTWORK](../product/releases/PRD-R7-GENERATED-ARTWORK.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `ENG-R7-001` | Manual & Sweep Artwork Lifecycle | Backlog | R7 | 2027-01-14 to 2027-01-27 | Implement evaluated explicit/sweep generation, versions, labeling, stale state, suppression, cover precedence, failures, and spend control. | [PRD-R7-GENERATED-ARTWORK](../product/releases/PRD-R7-GENERATED-ARTWORK.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `REL-R7-001` | Artwork Privacy/Cover/Restore Acceptance | Backlog | R7 | 2027-01-28 to 2027-01-29 | Verify privacy, evaluation gates, preflight, failures, versions, suppression, real-photo cover, budget, artifact restore, and rollback. | [PRD-R7-GENERATED-ARTWORK](../product/releases/PRD-R7-GENERATED-ARTWORK.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md); [v5 prototype](../../prototypes/calendar-ui/index-v5.html) |
| `PRD-R8-001` | Resilience PRD | Done | R8 | 2027-02-01 to 2027-02-03 | Define measured capacity, safe degradation, health, alerts, failure isolation, integrated recovery, and hardening outcomes. | [PRD-R8-OPERATIONAL-SCALE-RESILIENCE](../product/releases/PRD-R8-OPERATIONAL-SCALE-RESILIENCE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `ARCH-R8-001` | Capacity/Health/Alert/Fault Hardening | Backlog | R8 | 2027-02-01 to 2027-02-05 | Harden measured watermarks, process/job supervision, durable health, alert transitions, dependency isolation, and recovery operations. | [PRD-R8-OPERATIONAL-SCALE-RESILIENCE](../product/releases/PRD-R8-OPERATIONAL-SCALE-RESILIENCE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `QA-R8-001` | Integrated Fault/Security/Browser/Accessibility Suite | Backlog | R8 | 2027-02-04 to 2027-02-17 | Execute integrated capacity, restart, dependency, privacy, security, browser, keyboard, screen-reader, zoom, theme, and restore tests. | [PRD-R8-OPERATIONAL-SCALE-RESILIENCE](../product/releases/PRD-R8-OPERATIONAL-SCALE-RESILIENCE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `REL-R8-001` | Resilience Release Acceptance | Backlog | R8 | 2027-02-18 to 2027-02-19 | Accept the integrated operating envelope only after faults, alerts, capacity, backup/restore, rollback, and regressions pass. | [PRD-R8-OPERATIONAL-SCALE-RESILIENCE](../product/releases/PRD-R8-OPERATIONAL-SCALE-RESILIENCE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `PRD-R9-001` | Launch Acceptance Plan | Done | R9 | 2027-02-22 to 2027-02-24 | Define the owner UAT, Recovery Ceremony, severity gate, observation window, explicit authority, go/no-go, and rollback plan with no feature growth. | [PRD-R9-PRIVATE-LAUNCH-ACCEPTANCE](../product/releases/PRD-R9-PRIVATE-LAUNCH-ACCEPTANCE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `QA-R9-001` | Owner UAT/Recovery Ceremony/Stabilization | Backlog | R9 | 2027-02-22 to 2027-03-10 | Execute complete owner journeys, full representative recovery, defect stabilization, accessibility, privacy, spend, capacity, and failure scenarios. | [PRD-R9-PRIVATE-LAUNCH-ACCEPTANCE](../product/releases/PRD-R9-PRIVATE-LAUNCH-ACCEPTANCE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `REL-R9-001` | Private Launch Go/No-go & Observation | Backlog | R9 | 2027-03-11 to 2027-03-12 | Record explicit owner authority, severity status, Recovery Ceremony, observation evidence, and go/no-go or rollback decision. | [PRD-R9-PRIVATE-LAUNCH-ACCEPTANCE](../product/releases/PRD-R9-PRIVATE-LAUNCH-ACCEPTANCE.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `PID-R10-001` | Object-store Transition PID | Done | R10 | No date — trigger required | Define the date-free capacity trigger, user-visible states, outcomes, non-goals, cutover, recovery, rollback, and owner acceptance boundary. | [PID-R10-OBJECT-STORE-TRANSITION](../product/releases/PID-R10-OBJECT-STORE-TRANSITION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `ARCH-R10-001` | Migration/Inventory/Backup/Rollback Runbook | Backlog | R10 | No date — trigger required | Define complete pagination/inventory, encrypted keys, dual-write/copy, reconciliation, remote backup/restore, reversible pointers, observation, and rollback. | [PID-R10-OBJECT-STORE-TRANSITION](../product/releases/PID-R10-OBJECT-STORE-TRANSITION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |
| `REL-R10-001` | Conditional Transition Acceptance | Backlog | R10 | No date — trigger required | After an approved trigger, execute and verify reversible object-store transition before retiring any local authoritative copy. | [PID-R10-OBJECT-STORE-TRANSITION](../product/releases/PID-R10-OBJECT-STORE-TRANSITION.md) | [UX-DESIGN-REVIEW](UX-DESIGN-REVIEW.md); [UX-SPECIFICATION](../design/UX-SPECIFICATION.md) |

## 13. Key risks and Product Council challenges

| Risk / challenge | Product impact | Council response |
| --- | --- | --- |
| Shared-host contention or routing conflict | Could harm this archive or an existing service | R0 synthetic-only co-existence spike, measured resource envelopes, independent process/routing design, restart test, and rollback before real data |
| Global PRD is too large for one release | Encourages hidden dependencies and all-or-nothing delivery | Release PRDs with bounded owner outcomes and exact `LID-*` subsets |
| Prototype can be mistaken for product progress | Creates false Done status and hides missing states | Treat v5 only as design evidence; require implementation/test/restore/deployment evidence for Done |
| VoiceNotes behavior remains partly undocumented | Could misidentify, miss, duplicate, or misdate journals | Spike gate before implementation; fail closed and reopen product decisions if a material assumption fails |
| Photo processing on a small host | Malformed media or bursts could exhaust resources | R2 constrained decode, bounded staging, backpressure, exact limits, one-heavy-job policy, and capacity evidence |
| Wrong dates damage trust silently | A memory can look plausible on the wrong day | Fixed timezone, exact parsing, durable review state, atomic redating, and midnight/future fixtures |
| Source/Correction/upstream conflicts | Silent merge could rewrite personal meaning | Immutable revisions and exactly three explicit conflict outcomes |
| AI invention or privacy leakage | Generated content could be mistaken for truth or disclose private data | Late optional releases, evaluation gates, typed allowlists, persistent labels, field protection, no photo inputs, and no fallback |
| Recovery claim exceeds evidence | Owner may trust backups that cannot restore | R0 synthetic restore, per-release new-shape restore, R9 Recovery Ceremony, and separate backup versus restore status |
| Storage growth forces a rushed migration | Migration could omit or strand media | R8 watermarks and date-free R10 with inventory, reconciliation, dual-write, restore, observation, and rollback gates |
| Accessibility is deferred as polish | Image-heavy and complex lifecycle flows become unusable | Accessibility is a release gate on every affected slice and uses synthetic/private-safe evidence |
| Proposed dates become implicit commitments | Teams may weaken acceptance to keep schedule | Dates remain planning ranges; evidence gates control entry and exit; blocked work remains visible rather than re-labeled Done |

## 14. Explicit non-goals for R0–R9

- Multiple users, collaboration, sharing, publication, social features, profiles, or public links.
- Coaching, advice, therapy-like guidance, prompts, streaks, reminders, scores, themes, or habit gamification.
- Automatic historical VoiceNotes import or expanded/fuzzy tag eligibility.
- Blank browser journal composition or web photo upload.
- PDF, Word, OCR, RAW, audio, or video ingestion; books or printing.
- Semantic/vector/conversational search, journal Q&A, image recognition, OCR search, or AI photo descriptions.
- Year mosaic, media wall, maps, location browsing, On This Day, native applications, or offline sync.
- High availability, zero-downtime deployment, commercial SLA, end-to-end encryption, or zero-knowledge claims.
- A second compute instance or pre-purchased storage expansion for this project.
- Pre-scheduling R10 before approved storage watermarks trigger it.

## 15. Council recommendation

Approve the R0–R10 sequence as the release-planning baseline. The Project Manager should turn the task seed into GitHub Project items, the Product Manager should author the individual release PRDs just in time before each milestone, the UI/UX Designer should close the named prototype gaps before implementation in that slice, and the Technical Architect should attach exact implementation, rollback, security, and restore evidence.

The first execution decision is R0: complete the shared-host co-existence and deployment spike with synthetic data, then decide whether the private shell can safely deploy on the existing instance. The first user-value decision is R1: do not admit real memory content until R0 recovery and rollback evidence passes.
