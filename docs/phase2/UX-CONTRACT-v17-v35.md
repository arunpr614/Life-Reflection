# Life in Days — additive UX contract v17–v35

- **Authored:** 2026-08-19
- **Owner:** Expert UI/UX Designer agent
- **Status:** Cross-version D-gate baseline; each package still requires its own Product acceptance, Council approval, implementation, independent QA, freeze, push, and readback
- **Frozen source baseline:** v16 at commit 01d1f054a12773e07f91096b8d76b0c5f4064329
- **Execution scope:** PVA-012 through PVA-030, v17 through v35
- **Execution worktree:** /Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect-phase2-v17-v35

This document is the durable, additive experience contract for the remaining 19 prototype packages. It translates the open feature-audit gaps into a reusable interaction system while preserving the accepted visual language and behavior through v16.

It does not amend, replace, or pre-approve the [product requirements](../product/PRODUCT-REQUIREMENTS.md), [UX specification](../design/UX-SPECIFICATION.md), [frozen completeness tracker](../project/PROTOTYPE-COMPLETENESS-TRACKER.md), or [v17–v35 project tracker](./PROTOTYPE-COMPLETENESS-PROJECT-TRACKER-v17-v35.md). Each version must freeze exact fixtures, labels, state transitions, evidence, and residual decisions in its own Council contract before implementation. If this contract conflicts with a higher-authority source or a direct product decision, the affected package stops for Council disposition.

## 1. Additive and truth boundaries

### 1.1 Frozen-version discipline

1. V16 and every earlier prototype, authority, QA, and evidence file remain byte-immutable.
2. A v17 defect correction is made only in new v17-scoped files. No v16 file is edited, overwritten, or relabeled.
3. Each version inherits the complete accepted behavior of its predecessor and adds one stable package only.
4. A failed candidate remains the same unfrozen version. It is repaired and independently rechecked; it does not consume another version number.
5. Reusable shells in this contract are design patterns, not shared mutable evidence. Every version still produces new immutable vN files and current-run evidence.

### 1.2 Synthetic, in-memory, and non-production boundary

Every v17–v35 prototype must use deterministic fictional fixtures and browser-memory state only. The UI may represent a decision, an event, a provider result, a backup record, an export lifecycle, a storage transition, or an access outcome, but it must not imply that the underlying service performed that action.

The prototype does not prove or perform:

- Telegram or VoiceNotes integration;
- server persistence, transactions, concurrency, idempotency, restart recovery, or immutable server history;
- AI-provider qualification, a provider request, safety enforcement, credential validation, billing, or budget enforcement;
- real storage measurement, migration, backup, restore, export creation, encryption, deletion, or recovery;
- authentication, authorization, Cloudflare Access configuration, secret handling, no-store enforcement, deployment, monitoring, or production privacy;
- native-browser behavior that was not directly reproduced, formal WCAG conformance, or usability validation.

Synthetic operational surfaces must pair the represented state with plain boundary copy such as **Prototype data**, **Simulated result**, **Nothing was persisted**, **No provider request was sent**, or **Not verified against a backup system**, as appropriate. They must never use a healthy color, successful icon, completed checklist, or production-sounding timestamp as the only clue that evidence is fictional.

No real journal text, photo, caption, timestamp, account identifier, EXIF, credential, provider response, signed URL, opaque production ID, recovery material, or secret may appear in fixtures, DOM attributes, accessible names, screenshots, logs, commits, or GitHub.

### 1.3 Experience principles inherited by every package

- **Authentic first.** Source Items and Daily Photos remain primary. Derived fields and Generated Artwork are visibly and programmatically distinct.
- **Decision first, provenance on demand.** Show the current state, consequence, and next safe action before long evidence. Reveal complete provenance without burying the decision or creating nested scroll traps.
- **Calm archival visual language.** Continue warm paper in light mode, deep ink in dark mode, restrained typography, photographic emphasis, quiet boundaries, and minimal chrome. Do not introduce consumer-dashboard gloss, gamification, faux scrapbook decoration, or a companion persona.
- **One task per route or sheet.** High-consequence actions receive a focused page, modal, or full-height sheet with an explicit heading, exact affected item/date, safe exit, and named confirming verb.
- **Truth before reassurance.** State what changed, what remained safe, what was not changed, and what action is available. Never claim that a backup is recoverable, an export is encrypted, a provider is qualified, or access is secure from a simulated frontend result.
- **State labels beyond color.** Error, stale, historical, conflict, AI-generated, blocked, selected, and destructive states use visible text and programmatic names in addition to color, icon, or position.
- **No routine badge noise.** Reserve badges for states that change interpretation: AI artwork, Edited, Accepted, Stale, Historical, In Trash, Conflict, Needs date, and Manual only.
- **One page scroll by default.** Long management, history, comparison, and operations routes use progressive disclosure rather than independently scrolling cards.

## 2. Six reusable experience shells

These shells reduce drift across the 19 additive versions. A package may use a focused modal inside a shell, but it must preserve the shell's hierarchy, Back behavior, responsive order, and privacy rules.

### Shell 1 — Archive Management

**Versions:** v17–v20

**Purpose:** focused redating plus global/day/item management for History, Trash, and Suppressions.

**Structure:**

1. context eyebrow and one h1;
2. current state and exact affected Source Item or management scope;
3. primary task or decision;
4. before/after or consequence preview;
5. retained-history and boundary disclosure;
6. secondary provenance/details;
7. safe exit and named confirmation.

Wide layouts may use a task column and a supporting evidence column. Medium layouts use one dominant column with adjacent facts only when readable. Compact layouts stack the decision first, then consequence, then provenance; destructive actions remain after the safe action in DOM and visual order.

Back returns to the exact Journal Day, Source Item, filter, invoker, and useful scroll position. Viewing history never mutates current state. A modal moves focus to its heading, traps focus while open, closes with Escape when safe, and returns focus to its invoker.

### Shell 2 — Private Search

**Version:** v21

**Purpose:** deterministic lexical retrieval without leaking the query or presenting search as AI.

**Structure:**

1. search landmark with a persistently visible label;
2. scope explanation;
3. query and clear/submit controls;
4. date, range, exact-tag, and Include history filters;
5. restrained result count/status;
6. results grouped by Journal Day;
7. result provenance and exact destination action.

Wide layouts may place filters beside results. Medium and compact layouts move filters into an accessible sheet or disclosure without hiding active-filter summaries. Results remain articles/lists, never a fake grid. Long result text wraps, match context remains bounded, and the page never scrolls horizontally.

### Shell 3 — Generated Reflection Review

**Versions:** v22–v23

**Purpose:** independently review Title, Summary, and Tags while keeping generation attempts non-blocking and Source Items readable.

**Structure:**

1. Journal Day context and generated-reflection heading;
2. separate Title, Summary, and Tags cards;
3. Current and Suggested regions within the affected field only;
4. field-specific action row;
5. attempt status and safe provenance;
6. complete authentic-source access outside the generated region.

Wide layouts may compare current and suggested values side by side. Compact layouts stack Current before Suggested and keep the action adjacent to the field it changes. Processing states never replace, blur, or disable authentic journal reading.

### Shell 4 — Health, Provider, and Artwork Control

**Versions:** v24–v29

**Purpose:** show factual-looking but explicitly synthetic health evidence, configure independent provider lanes, confirm artwork requests, represent attempt outcomes, and manage artwork versions/sweep behavior.

**Structure:**

1. attention-first summary;
2. independent Text and Artwork lanes where relevant;
3. evidence or configuration cards with status, timestamp, proof type, and action;
4. selected-day artwork context;
5. read-only Visual Brief and request consequence;
6. attempt/version history and safe provenance;
7. prototype boundary disclosure.

Cards must stack into a readable list; the experience may not depend on a dashboard grid. Provider settings and System Health are separate tasks even when they link to each other. Manual request, automatic sweep, Regenerate brief, Retry artwork, version activation, and Allow generation remain distinct actions.

### Shell 5 — Journal Day Media

**Version:** v30

**Purpose:** make every Daily Photo action complete without weakening the Journal Day's reading hierarchy.

**Structure:**

1. Journal Date and populated-day navigation;
2. 4:5 non-destructive media frame;
3. caption and essential source/timestamp facts;
4. accessible media action menu;
5. private image description;
6. cover, ordering, redating, original/download, and Trash consequences;
7. return to the same media item after modal work.

Wide layouts may use gallery plus Museum Margin/detail. Compact layouts are one column with media, caption, then actions. Pointer reordering is optional; Up/Down or Move before/after controls are mandatory.

### Shell 6 — Archive Operations and Access

**Versions:** v31–v34

**Purpose:** represent storage thresholds, backup/restore/recovery evidence, export lifecycle, and the external access boundary without pretending the prototype operates infrastructure.

**Structure:**

1. current attention state or access outcome;
2. exact measured or fixture values with units and thresholds;
3. evidence type and freshness;
4. next safe action or blocked reason;
5. detailed stage/checklist only after the summary;
6. explicit unverified/non-production boundary.

Storage, recovery, and export use one-column stage progression on compact screens. The v34 access boundary is a full-page single task rather than an in-app account center. It contains no application password, recovery email, credential field, or secret-management control.

### V35 use of the shells

V35 introduces no seventh shell and no new product feature. It repairs inherited cross-shell type, target, contrast, semantics, focus, reflow, zoom, forced-colors, and reduced-motion defects, then verifies all six shells as one coherent system.

## 3. V16 carry-forward defects and evidence limits

The following findings are successor requirements, not authorization to edit v16:

1. **Stale source-conflict copy.** [app-v16.js line 8529](../../prototypes/calendar-ui/app-v16.js#L8529) says that v15 does not compare, select, or merge source text even though v16 does compare and select without auto-merge. The inherited v17 copy must instead say: **A newer upstream revision is represented. Open Review source update to compare complete text and choose one deliberate outcome. Nothing is merged automatically.**
2. **Placeholder management actions.** [app-v16.js lines 13855–13858](../../prototypes/calendar-ui/app-v16.js#L13855) ends History, Trash, Suppressions, Export, and System Health in a generic toast. Each owning version must replace only its inherited successor placeholder with a functioning route and representative domain-state interaction: History v18, Trash v19, Suppressions v20, System Health v24, and Export v33.
3. **Essential metadata below the 13 px floor.** Examples include the Today marker at [styles-v16.css line 1369](../../prototypes/calendar-ui/styles-v16.css#L1369), provenance terms/values at [styles-v16.css lines 2588–2599](../../prototypes/calendar-ui/styles-v16.css#L2588), and Museum Margin provenance at [styles-v16.css lines 5414–5424](../../prototypes/calendar-ui/styles-v16.css#L5414). New or modified surfaces must use at least 13 px essential metadata immediately. V35 owns the complete inherited sweep.
4. **Long compact administration risk.** The v16 conflict workbench reflows without horizontal overflow but becomes a long compact page. V17 onward must keep the decision and current state before provenance, collapse optional evidence without hiding its existence, and avoid stacked card grids that make the primary action difficult to find.
5. **Native evidence limits.** The [v16 QA report](../../design-qa-v16.md) passed prescribed reflow-equivalent observations, but native page zoom was unavailable and native default Enter/Space and beforeunload UI were not fully synthesized. V35 may claim only the native behaviors it directly reproduces. A missing native check is a named evidence limitation or blocker, never a simulated pass.

## 4. Package experience contracts

Every section below is the minimum D-gate treatment. The package Council contract must make it fixture-exact before implementation.

### 4.1 V17 — PVA-012 Atomic Redating

**Shell:** Archive Management, entered only from an individual Source Item through **Change Journal Date**.

**Interaction and state:** Open a focused page or full-height sheet showing Current Journal Date, immutable Original Timestamp, and a non-future destination date picker with an Asia/Kolkata note. Before confirmation, show separate **Current day after change** and **Destination day after change** impact cards covering day visibility, cover, derived-field staleness, and Generated Artwork history. Pending keeps the item visibly on its current day and locks duplicate intent. Failure changes neither day. Success shows links to both Journal Days and states that Original Timestamp did not change.

**Visual and responsive treatment:** Use a side-by-side before/after comparison at wide widths and the same two cards stacked in current-then-destination order below 1024 px. The date picker and impact note precede the confirm action. Historical artwork that loses source-set eligibility is shown as leaving active presentation and remaining in History; do not visually imply deletion or that art follows the item.

**Accessibility and privacy acceptance:** Invalid and future dates have programmatic field errors and a heading-focused error summary when submission is attempted. Pending status uses a restrained live region. On success, focus moves to the result heading; Back and Cancel return to the invoking Source Item. Journal/source/fixture values stay out of URL, title, storage, log-shaped UI, and unrelated accessible names.

### 4.2 V18 — PVA-013 History and Provenance

**Shell:** Archive Management, available globally and from Journal Day, Source Item, field, and artwork contexts.

**Interaction and state:** Provide one reusable read-only chronological event list with typed events, filters, and contextual entry points. Separate **Source history** and **Derived history** into visible, programmatic lanes. Include upstream revision, untagged, and deleted statuses; Correction lineage; redating; protected-field replacement; artwork version selection; and a hidden-day banner reading **Historical day — not shown in Calendar or Almanac**. Viewing a version never activates it. Load earlier events preserves the current reading and focus anchor.

**Visual and responsive treatment:** Use an event spine or ordered card list, not a data table. Wide layouts may pair filters with the event list; compact layouts put filters in a sheet and preserve an active-filter summary. Event type, timestamp, actor/source, current/historical status, and retained facts use consistent positions. Complete provenance opens on demand beneath its event.

**Accessibility and privacy acceptance:** Use an ordered list with real headings and time elements. Lanes are named in headings, not color alone. Loading more events announces only the number added and moves focus only when the user requested the load. Raw prompts, credentials, request payloads, internal IDs, and private text never appear in operational provenance.

### 4.3 V19 — PVA-014 Trash

**Shell:** Archive Management.

**Interaction and state:** Trash cards show item type, source, Journal Date, deletion date, exact time remaining, and current effect on day visibility/cover/staleness. **Restore** uses a reversible consequence preview and returns the item to its Journal Day. **Delete permanently** requires an explicit confirmation naming the item, live-content consequence, export limitation, ordinary backup-retention caveat, and retained opaque Source Suppression where applicable. Cancel produces no change.

**Visual and responsive treatment:** Use cards rather than a desktop-only table. The recoverable action is visually primary; permanent delete is visually distinct but not louder than the item identity. Compact cards keep identity and expiry before actions. Empty, loading, expired-boundary, pending, failure, restored, and permanently deleted outcomes each have a clear stable state.

**Accessibility and privacy acceptance:** Destructive dialogs focus the heading, trap focus, put Cancel before Delete permanently, and return focus to the item or logical next card. Expiry is text, not a color-only meter. Restoring or deleting the last visible item retains a meaningful focus anchor. No thumbnail is exposed outside the authenticated prototype surface or in notifications.

### 4.4 V20 — PVA-015 Suppressions

**Shell:** Archive Management.

**Interaction and state:** Present distinct **Source Suppressions** and **Artwork Suppressions** views. Source records expose source type, safe opaque suffix, suppression date, and **Allow re-import**. Artwork records expose Journal Date, creation reason, and **Allow generation**. Confirmation copy states the exact effect and non-guarantee: allowing re-import does not promise upstream availability or eligibility; allowing generation does not make an immediate artwork request.

**Visual and responsive treatment:** Use two labeled tabs or a segmented navigation pattern with independent empty states. Compact layouts stack records and retain both the view label and active state in text. Avoid thumbnails or reconstructive clues for permanently deleted content. Show manual artwork generation and automatic sweep eligibility as separate consequences.

**Accessibility and privacy acceptance:** Tabs use native tab semantics and predictable arrow-key behavior, or use ordinary links/buttons if the full tab pattern cannot be implemented. Focus returns to the affected record after Cancel and to the next logical heading after a record is removed. Opaque suffixes are synthetic, short, and never copied into URL, title, browser history payload, storage, logs, or live announcements.

### 4.5 V21 — PVA-016 Complete Lexical Search

**Shell:** Private Search.

**Interaction and state:** Search exact current journal text, titles, summaries, exact tags, dates/ranges, and Photo Captions. State beside the filters: **Literal text, dates, tags, and photo captions. No AI or image search.** Include history is off by default; enabling it adds superseded revisions and Trash results with explicit state labels. Group results by Journal Day and show why each matched: field, source type, state, date, and a safe bounded snippet. Opening a result focuses the exact field/source/media destination and preserves a return path to the search state.

**Visual and responsive treatment:** The query remains the strongest control. Wide layouts may use a filter column and result column. Compact layouts use an accessible filter sheet plus an always-visible summary and clear-all action. Highlight matching text with mark styling plus a textual match reason. Provide initial, updating, results, no-results, partial/error, retry, and history-inclusive states without recent-memory suggestions.

**Accessibility and privacy acceptance:** Use a search landmark, persistent input label, accessible filter names, and a restrained live result count. Do not announce result snippets or long private text automatically. Query and result values remain live-memory only and absent from URL, document title, history payload, local/session storage, IndexedDB, cache, clipboard, requests, console, analytics, telemetry, and log-shaped UI.

### 4.6 V22 — PVA-017 Generated-field Lifecycle Parity

**Shell:** Generated Reflection Review.

**Interaction and state:** Give Title, Summary, and Tags independent Current/Suggested review cards. Each field supports **Use suggested version**, **Keep current version**, **Edit current version**, and **Resume automatic updates** only when applicable. Accepting or editing protects that field without changing the others. Resume removes protection for future refreshes and does not accept the visible suggestion. Summary validation requires 80–140 words; tags require 3–7 unique tags after documented comparison rules.

**Visual and responsive treatment:** Short title differences may use character/word emphasis; summary differences use block-level comparison; tags use explicit Added and Removed groups. Wide layouts compare Current and Suggested side by side. Compact layouts stack them and keep the field action row immediately after the comparison. Partial or invalid generation identifies only the affected field.

**Accessibility and privacy acceptance:** Current and Suggested regions have programmatic headings. Additions/removals have text labels beyond color. Save errors are bound to the field; focus returns to the changed field heading after success. No long generated value is placed in a live region. Each field's state can be understood independently by keyboard and screen-reader users.

### 4.7 V23 — PVA-018 AI Text Processing States

**Shell:** Generated Reflection Review.

**Interaction and state:** Add non-blocking attempt panels for source quiet period waiting, 01:00 final refresh, generating, late-source reset, source race, stale completion, schema/invalid response, neutral refusal, timeout, rate limit, provider unavailable, credential/auth issue, quota, bounded retry, retry available, and exhausted handling. Authentic content remains readable. A completion against obsolete sources is Historical/Stale and never offered as the current suggestion.

**Visual and responsive treatment:** Status panels sit inside or adjacent to the affected generated field, not over the whole Journal Day. Waiting and generating are quiet; failure states use plain-language category, what remained safe, and the next action. Compact layouts stack attempt facts in label/value rows. Do not use animated progress decoration as the only sign of work or invent a completion percentage.

**Accessibility and privacy acceptance:** Scope aria-busy to the affected generated region, never the page. Announce short state changes once; never announce generated text automatically. Status, retry availability, and stale state use words/icons as well as color. Provenance exposes only safe synthetic provider/model labels, represented time, source-set label, and outcome class—never journal text, prompts, responses, credentials, tokens, or production identifiers.

### 4.8 V24 — PVA-019 System Health Foundation

**Shell:** Health, Provider, and Artwork Control.

**Interaction and state:** Replace the System Health placeholder with a first-class route divided into **Capture**, **Providers and jobs**, **Backup and recovery**, **Storage**, and **Alerts**. Each evidence card shows approved status vocabulary, represented timestamp/freshness, evidence type, concise proof, and one next action. Include healthy, attention, failed, blocked, not configured, and never verified fixtures. Show a single current failure in the UI, but represent Telegram operational alerts only after repeated qualifying failures and recovery; never represent journaling reminders.

**Visual and responsive treatment:** Lead with items needing attention, then stable summaries. Do not reduce the route to a dashboard of colored tiles. Backup success and restore evidence remain separate cards. Wide layouts may use two columns only where reading order stays clear; compact and zoom layouts are a single ordered list.

**Accessibility and privacy acceptance:** Never verified is neutral, not green. Metrics include exact text and numbers rather than graphic-only meters. Card headings name the subsystem and status. Evidence detail contains only fictional timestamps, safe opaque suffixes, and error classes—never journal content, captions, prompts, images, provider responses, tokens, URLs, or credentials.

### 4.9 V25 — PVA-020 Provider Settings and Privacy

**Shell:** Health, Provider, and Artwork Control.

**Interaction and state:** Provide independent Text Provider and Artwork Provider cards. The default unqualified state is **Model evaluation not completed**. If the package includes selectable fixtures, every option must be unmistakably fictional and typed, with provider/model label, Economy/Premium role, measured-or-estimated cost language, privacy/retention reference, region, credential state, lifecycle health, and automatic-sweep eligibility. Provider changes require confirmation that only future generations change, existing provenance remains, and no fallback occurs. Show fixed $5 total, $0.50 text reserve, $4.50 artwork allocation, 80% warning, hard-block, prediction, actual/reconciled, and rollover fixtures.

**Visual and responsive treatment:** Use native select controls or an equivalently complete accessible listbox only when justified. Text and Artwork lanes stay visually separate. Compact cards put selected option, credential state, payload boundary, budget impact, then action in that order. Manual-only options carry a text label and cannot imply sweep eligibility.

**Accessibility and privacy acceptance:** Option name and metadata are available before confirmation; state is not communicated by disabled styling alone. The lane disclosure is exact: approved journal text plus minimal date/language hints may go to Text Provider; Visual Brief only may go to Artwork Provider; no real photo or photo-derived data goes to either lane. No credential value, real model qualification, free-form model ID, request, billing result, or production provider status is represented.

### 4.10 V26 — PVA-021 Artwork Request Confirmation

**Shell:** Health, Provider, and Artwork Control, launched from a Journal Day.

**Interaction and state:** Every manual request opens a modal or full-height sheet showing the read-only Visual Brief, source binding/version, selected provider/configuration, credential state, predicted cost, current/remaining allocation, and request consequence. With 5–19 meaningful words, show a sparse-source warning. Below five words, disable the launcher with the reason **At least 5 meaningful journal words are needed.** When a Daily Photo exists, state that generated artwork remains labeled and does not replace the real-photo Calendar Cover. **Regenerate brief** is separate and creates no artwork attempt.

**Visual and responsive treatment:** The request facts use one scroll region. On compact and 568×320 landscape layouts, heading, consequence, Cancel, and the named request action remain reachable without covered focus. Keep Cancel before the confirming action. Do not abbreviate the provider, cost, or budget consequence into an icon or tooltip.

**Accessibility and privacy acceptance:** Opening focuses the heading; the modal traps focus and returns it to **Generate artwork now**. Escape and Cancel create no attempt. The request action is named, not generic Confirm. Visual Brief text is not announced automatically. The prototype states **No provider request was sent** until the simulated accepted action, and after simulation states that no real provider or spend was involved.

### 4.11 V27 — PVA-022 Artwork Failure and Budget States

**Shell:** Health, Provider, and Artwork Control.

**Interaction and state:** Use a reusable artwork-attempt card for Requested, Generating, Success, safety refusal, timeout, rate limit, credential, quota, invalid response, provider failure, budget warning, budget block, retry available, and exhausted outcomes. No failure switches provider, changes the journal, hides authentic content, or retries indefinitely. Safety refusal uses the approved neutral copy and offers **Regenerate brief** before a later explicit **Retry artwork**.

**Visual and responsive treatment:** Place attempt state below the active media/reflection context so the day remains usable. Use distinct status heading, what happened, what remained unchanged, attempt facts, and next action. Compact layouts preserve that order. Motion is optional and removed under reduced-motion; no spinner is the sole state label.

**Accessibility and privacy acceptance:** Announce the short outcome once; do not announce the brief, journal, or error payload. Retry remains a normal button with visible focus. Failure categories are text labels beyond color. Provenance is sanitized and fictional, with no raw prompt, provider response, credential, token, signed URL, or production request ID.

### 4.12 V28 — PVA-023 Artwork Version and Staleness

**Shell:** Health, Provider, and Artwork Control with History integration.

**Interaction and state:** Present retained artwork versions in an accessible list showing Active, Historical, and Stale status; created time; Manual or 01:00 sweep trigger; provider/model fixture; Visual Brief version; source-revision set; represented cost; and safe failure/refusal facts. Let the owner select two versions for comparison, preview one version, and explicitly confirm **Make active**. Viewing or comparing never activates. Redating that invalidates the source set moves art out of active presentation and into History with a clear reason.

**Visual and responsive treatment:** Do not use a carousel as the only version control. Wide layouts may show a selected preview beside the version list. Compact layouts stack the selected preview above a labeled list or two-select comparison. AI artwork remains explicitly labeled in the Journal Day, History, and accessible name where context permits; no Calendar tile overlay is introduced.

**Accessibility and privacy acceptance:** Version controls expose name, state, and position without relying on thumbnails or color. Generated-image alternative text identifies it as generated and conveys functional state, not invented scene details. Focus returns to the activated version heading after confirmation. Source bindings are safe synthetic labels, never raw journal text or internal identifiers.

### 4.13 V29 — PVA-024 Artwork Sweep and Suppression

**Shell:** Health, Provider, and Artwork Control.

**Interaction and state:** Represent 01:00 Asia/Kolkata sweep evidence in System Health and History with eligibility, skip reason, failed attempt, missed-run repair, and one bounded represented result. Distinguish automatic sweep, manual generation, **Regenerate brief**, **Retry artwork**, and **Allow generation**. Deleting all artwork previews creation of Artwork Suppression. Allow generation removes suppression but creates no immediate request; a later sweep must independently find the day eligible.

**Visual and responsive treatment:** Use an accessible event/list treatment, not a calendar of nag states. Eligibility facts appear as a concise checklist with explicit Eligible/Not eligible labels; optional evidence expands beneath. Compact layouts keep outcome and reason before technical facts.

**Accessibility and privacy acceptance:** Status does not depend on green/red. Sweep repair and failure announcements are restrained and never framed as habit reminders. No browser notification, streak, prompt to journal, or repeated alert is represented. The package uses synthetic times and events only and does not imply a scheduler, provider request, or persistent suppression exists.

### 4.14 V30 — PVA-025 Daily Photo Completeness

**Shell:** Journal Day Media.

**Interaction and state:** Each Daily Photo exposes view original, Photo Caption, Original Timestamp, source label, **Change Journal Date**, reorder, **Make calendar cover**, download original, private image description, and **Move to Trash**. Cover selection, order, redating, Trash, restore, and duplicate representations produce deterministic real-photo cover outcomes. Pointer drag may exist only alongside button/menu alternatives.

**Visual and responsive treatment:** Keep a stable 4:5, non-destructive fit frame. Wide layouts may use gallery plus Museum Margin; compact is a single column with media, caption, essential metadata, then actions. Modal/fullscreen viewing preserves the original aspect and returns to the same media item. Compression disclosure belongs near source/original facts, not as a warning badge on the image.

**Accessibility and privacy acceptance:** Media controls meet the target-size gate and have unique names including position or safe fixture caption. Reorder buttons announce the new position without moving focus unpredictably. Modal focus is trapped and returned. Photo Caption is not used as image alternative text; use the owner's private description when provided or a concise functional fallback. Descriptions, captions, EXIF-like facts, and download values remain synthetic and absent from URL/title/storage/logs/live regions.

### 4.15 V31 — PVA-026 Storage Capacity and Migration

**Shell:** Archive Operations and Access.

**Interaction and state:** Show the exact threshold ladder: plan at 7 GB root media or 18 GB free; verified copy/dual-write by 8 GB or 15 GB free; object-storage writes by 9 GB or 13 GB free when gates pass; reject new media at 10 GB while incomplete or 12 GB free. Represent root, copy, dual-write, target, copy-failure, cutover-blocked, and emergency-media-stop fixtures. The emergency state says that journal text, reading, search, export, backup, and recovery remain available and that originals are neither deleted nor downsampled automatically.

**Visual and responsive treatment:** Use semantic text and a vertical stage ladder; any graphical meter has exact numbers and threshold labels. Wide layouts may pair current capacity with migration stage. Compact layouts show current state, next threshold, next action, then full ladder. Avoid a red wall of alarms or a misleading single percent.

**Accessibility and privacy acceptance:** Units, comparisons, and threshold direction are in text. Each boundary fixture is keyboard reachable and screen-reader understandable. No state is color-only. Values are explicitly synthetic and do not imply disk measurement, object-storage connection, verified copy, dual-write, or migration.

### 4.16 V32 — PVA-027 Backup, Restore, and Recovery Ceremony

**Shell:** Archive Operations and Access.

**Interaction and state:** Keep **Backup snapshot**, **Repository integrity check**, **Sample restore**, and **Full recovery drill** as separate evidence cards with represented date, result, freshness/due state, and proof type. Add the three-step Recovery Ceremony: recovery key copied to password manager, sealed offline copy, and representative encrypted archive restored/decrypted. The overall launch state remains Blocked until all three are represented as evidenced. Show four-hour recovery objective beside a separately labeled measured fixture, never as a guarantee.

**Visual and responsive treatment:** Do not collapse recoverability into one Healthy badge. Lead with the oldest, failed, due, or never-verified evidence. Compact layouts use one ordered column; the ceremony is a real checklist only for interaction semantics, while each check clearly says prototype fixture. Retention is visible as 48 hourly, 30 daily, and 12 monthly snapshots.

**Accessibility and privacy acceptance:** Evidence types have distinct headings and status text. Dates use time semantics; due/failed/blocked is not color-only. Never show a recovery key, key fragment, password-manager location, offline-copy location, archive passphrase, or real storage identifier. Fixture completion cannot look like proof of a real backup, restore, or recovery capability.

### 4.17 V33 — PVA-028 Restorable Export

**Shell:** Archive Operations and Access.

**Interaction and state:** Use a multi-step route: complete manifest review; encrypted default with one-time passphrase; named creation stages; ready; download; downloaded/removed or explicit unverified removal; expired; failure. The manifest includes JSON, Markdown, browsable HTML, original uploads/photos, Generated Artwork, revisions, Corrections, checksums, current/history separation, Trash, and suppressions. It states that permanently deleted content is not reconstructed and PDF books are not included. Unencrypted export is secondary behind a privacy warning and explicit acknowledgement.

**Visual and responsive treatment:** Keep the workflow one column at every width, with a clear stage heading and progress list. Use named stages—Preparing manifest, Packaging files, Encrypting archive, Ready to download—rather than a fabricated percent. On ready, show represented creation time, size, checksum, encryption state, and first-download-or-one-hour expiry.

**Accessibility and privacy acceptance:** Focus moves to each new stage heading. Passphrase inputs permit paste, reveal/hide, password-manager use, and accessible guidance; they never persist to local/session storage, logs, analytics, history payload, or later steps. A failure never exposes a partial archive as ready. The package must not state **Downloaded and removed from server** unless the synthetic fixture explicitly represents reliable confirmation; otherwise say that first-download/removal confirmation remains unverified. No real archive, encryption, download, deletion, or round-trip restore is claimed.

### 4.18 V34 — PVA-029 Access and Security Boundary

**Shell:** Archive Operations and Access, using a full-page external-boundary state.

**Interaction and state:** Represent unauthenticated, denied, MFA required, seven-day session expired, successful reauthentication return, and access-unavailable states. The experience explains that Cloudflare Access is the only human login layer and that reauthentication does not change or delete journal data. Provide concise disclosure for application-controlled at-rest encryption intent, off-server recovery material, server-compromise limits, and **not end-to-end encrypted**.

**Visual and responsive treatment:** Each boundary page is a single task with product identity, outcome, plain explanation, next action, and support/setup direction. It is not styled as an in-app account center. Compact and landscape layouts keep the entire primary action and explanation reachable without sticky overlap.

**Accessibility and privacy acceptance:** Pages have generic document titles and routes that expose no email, membership, journal, return query, or secret. There are no app-password, password-reset, forgot-password, recovery-email, session-list, credential, or recovery-key fields. Focus begins at the h1, errors are plain language, and returning from the represented external boundary restores the safe prior destination without private URL state. The prototype does not claim production authentication, MFA enforcement, encryption, no-store headers, or secret rotation.

### 4.19 V35 — PVA-030 Responsive and Accessibility Closeout

**Shell:** all six shells; no new product behavior.

**Interaction and state:** Repair inherited typography, target size, semantic structure, focus order/visibility, modal focus/return, non-color state cues, contrast, reflow, safe-area, forced-colors, and reduced-motion defects. Reconcile all 41 v17–v35 closure rows plus inherited v6–v16 critical journeys without altering product meaning.

**Visual and responsive treatment:** Verify true 320 and 390 px widths, relevant medium and at least 1024 px wide layouts, 568×320 landscape, 200% text zoom, and 400% page zoom. Core tasks remain available without horizontal page scroll, clipped content, covered focus, inaccessible sticky actions, or orientation lock. Essential metadata and errors use at least 13 px; normal text, large text, UI boundaries, and focus indicators meet measured contrast targets.

**Accessibility and privacy acceptance:** Verify keyboard operation, native Enter/Space where tools allow, logical headings/landmarks, skip link, screen-reader names/states/order, restrained live regions, target sizes, modal trap/escape/return, re-render focus, forced-colors, reduced-motion, light/dark themes, hostile/long text, and supported-browser coverage. Record unsupported native checks as evidence limitations. V35 may not convert a reflow-equivalent observation into a native zoom pass or claim formal WCAG conformance from prototype evidence.

## 5. Mandatory accessibility, responsive, and privacy gate for every version

The following gate applies to the new package and every inherited surface it changes. V35 repeats it across the complete v6–v35 system.

### 5.1 Responsive and visual gate

- Observe the package at 320 px, 390 px, a relevant 600–1023 px layout, and at least 1024 px. Include 568×320 landscape when a modal, sheet, media viewer, picker, or high-consequence action exists.
- No horizontal page scroll, clipped content, covered focus, unreachable action, unsafe sticky overlap, or orientation lock.
- Test 200% text and 400% page zoom when the browser can reproduce them natively. If only a reflow-equivalent viewport is available, label it exactly and do not claim native zoom.
- One-column compact order follows task, consequence, provenance. Wide two-column layouts preserve the same DOM and reading order.
- Media remains in a stable 4:5 frame with non-destructive fitting. Source reading width remains approximately 60–72 characters on wide layouts.
- New or modified essential metadata and errors are at least 13 px. Normal text targets 4.5:1; large text 3:1; controls, focus, and meaningful boundaries 3:1.
- Light, dark, forced-colors, and prefers-reduced-motion states remain understandable. No required meaning depends on image contrast, color, hover, or motion.

### 5.2 Semantic, keyboard, and focus gate

- One clear h1, logical headings, landmarks, and a skip link.
- Every action is keyboard operable. Pointer drag has buttons or menu alternatives.
- Touch/click targets are at least 24×24 CSS px, with 44×44 preferred for primary mobile controls, calendar tiles, dialog actions, and media controls where layout permits.
- Focus is visible against light, dark, image, warning, and destructive surfaces.
- Opening a dialog moves focus to its heading or first relevant control, traps focus, supports a safe Escape path, and returns focus to the invoker. Safe action precedes destructive/confirming action.
- Rerender, load more, save, remove, restore, reorder, and route return preserve a logical focus anchor rather than resetting to the page top.
- Status changes use restrained live regions. Long journal, generated, caption, brief, or result text is never announced automatically.
- Errors identify the field and recovery action in plain language. Stale, historical, selected, conflict, AI-generated, blocked, and failure states have text beyond color.

### 5.3 Privacy and prototype-truth gate

- Only deterministic synthetic fixtures appear in UI, source, screenshots, manifests, logs, and commits.
- Journal-like content, captions, descriptions, query text, provider payloads, passphrases, fixture handles, decision identities, and synthetic account details stay out of URL, document title, browser history payload, local/session storage, IndexedDB, Cache Storage, service-worker cache, OPFS, clipboard, requests, console, analytics, telemetry, notifications, and log-shaped UI unless a higher-authority contract explicitly permits a non-sensitive preference such as theme.
- Search query, unsaved text, and passphrase remain only in the open page's live memory for the bounded task and are cleared on the documented exit.
- Evidence cards, provider options, timestamps, costs, checksums, capacity values, backup results, access results, and export results are labeled as simulated/prototype fixtures.
- No visible or accessible copy claims persistence, authentication, encryption, provider qualification, billing accuracy, scheduler execution, backup, restore, export, deletion, migration, deployment, or production readiness.
- No sharing, public link, reminder, streak, coaching, semantic search, photo analysis, OCR, editable Visual Brief, app account center, or silent provider fallback is introduced.

### 5.4 Evidence gate

- Capture evidence only after final UI bytes are held.
- Include normal, empty, loading, error, interruption, destructive/cancel, and recovery outcomes in proportion to the slice.
- Inspect every accepted image at original size and record state, viewport, theme, dimensions, and hash.
- Run syntax/static checks, console/network/storage/privacy checks, keyboard/focus checks, responsive checks, and affected inherited regressions.
- A newly assigned read-only QA agent judges the exact candidate. Developer self-check is not independent QA.
- Any candidate, authority, package, or evidence byte change after QA starts invalidates the verdict and requires a fresh independent run.

## 6. Council conflicts and recommended dispositions

These eight conflicts must be carried into package Council review. The recommendations below are explicit design dispositions, not silent amendments to Product or technical policy.

### Conflict 1 — Live GitHub v01–v16 program versus v17–v35 closure sequence

**Conflict:** Live issues #115–#149, including P2-DR-V01 through P2-DR-V16, refine historical v01–v16 baselines. PVA-012 through PVA-030 are the separate audit-gap closure sequence from frozen v16.

**Recommended disposition:** **Keep separate.** Do not repurpose, relabel, close, comment on, or claim progress against #115–#149. V17–v35 uses its isolated branch and additive local tracker. Any future GitHub roadmap requires new dedupe keys and separate authorization.

### Conflict 2 — Calendar provenance overlays versus C-01

**Conflict:** Older UX-CAL-05, UX-CAL-08, and contextual LID-AIA-005 wording can be read as requiring persistent source/AI chips on Calendar image tiles. Approved C-01 forbids those overlays.

**Recommended disposition:** **C-01 governs.** Calendar tiles show the image and distinct Today/selected/focus outlines only. Source, AI, stale, and attention detail appears after selection in the Museum Margin/right-side detail and in the accessible name. V28 and v30 must not reintroduce tile chips. Record the remaining specification wording as editorial debt.

### Conflict 3 — Timeline terminology and persistent left rail versus C-02/C-03

**Conflict:** Older specification language names Timeline and a persistent left navigation rail, while approved C-02/C-03 establish Monthly Almanac and the Calendar/Almanac switcher with a collapsible local index.

**Recommended disposition:** **Keep Almanac.** Treat **Almanac, the chronological timeline experience** as the canonical product meaning. Preserve the switcher near Search and the collapsible Almanac index. Do not add a competing Timeline tab or persistent desktop management rail solely to satisfy stale wording. Record terminology/navigation cleanup as editorial debt.

### Conflict 4 — Cross-cutting accessibility deferred to v35

**Conflict:** The roadmap assigns full closeout to v35, which could be misread as permission for v17–v34 to introduce inaccessible surfaces.

**Recommended disposition:** **Accessibility is a per-version gate.** Every new or modified slice meets Section 5 immediately. V35 closes inherited debt and performs complete regression; it is not the first accessibility pass. A new package with sub-13 px essential metadata, missing keyboard operation, broken focus, or horizontal overflow cannot pass D/Q.

### Conflict 5 — Exact fictional provider options in v25

**Conflict:** Product requires only models that passed hard gates, while C-04 prohibits selecting or implying a real qualified provider before evaluation evidence exists. A provider picker with real names would overclaim qualification; an empty picker may under-demonstrate the interaction.

**Recommended disposition:** **Default to Model evaluation not completed.** If Council needs selection behavior for QA, use clearly fictional options named **Text Provider A — synthetic qualified fixture** and **Artwork Provider A — synthetic qualified fixture**, with fictional cost/region/retention/sweep metadata and persistent prototype disclosure. Do not use a real provider/model name or a speculative default.

### Conflict 6 — Artwork Suppression removal versus manual generation and sweep

**Conflict:** **Allow generation** can be mistaken for an immediate request or permission for all generation paths, while suppression specifically prevents automatic recreation after all artwork was moved to Trash.

**Recommended disposition:** **Make effects explicit and separate.** Artwork Suppression blocks the 01:00 sweep. **Allow generation** removes that block only; it neither generates art nor proves later eligibility. Manual **Generate artwork now** remains a separate deliberate action subject to provider, safety, source, and budget gates. Removing suppression must not silently clear unrelated failure or budget states.

### Conflict 7 — Export first-download deletion language and Gate G-06

**Conflict:** UX-EXPORT-07 prescribes **Downloaded and removed from server**, but reliable confirmation is explicitly gated. A frontend fixture could falsely imply that a real artifact was deleted.

**Recommended disposition:** **Fail closed in v33.** The default synthetic result reads: **Download represented. Reliable first-download and server-removal confirmation is not verified in this prototype.** Show the stronger prescribed sentence only in a clearly labeled fixture whose purpose is to demonstrate the future confirmed state, never as evidence that removal occurred. Production implementation must resolve G-06 before adopting that copy as truth.

### Conflict 8 — Cloudflare Access boundary versus an in-app login/account experience

**Conflict:** Access-state coverage can invite a conventional app login, password reset, recovery email, session manager, or secret-entry UI even though Cloudflare Access is the only human login layer.

**Recommended disposition:** **Keep the boundary external and minimal.** V34 represents full-page unauthenticated, denied, MFA, expired, and return states without any app credential fields or account-management routes. Use generic titles/routes, no identifiers, and plain reauthentication copy. Provider secrets and recovery material remain server/offline workflows, not browser settings.

## 7. Per-package D-gate checklist

Before a version can move to Council review, its package contract must record:

- governing requirement IDs and UX clauses;
- owning shell and every entry/return path;
- one h1, heading order, landmarks, and DOM/reading order;
- exact labels, helper copy, warning copy, success/failure copy, and prototype disclosure;
- normal, empty, loading, pending, success, failure, interruption, stale, destructive/cancel, unknown, and recovery states as applicable;
- exact zero-or-one effect and what remains unchanged for each decision;
- focus on entry, focus after each result, Back/Escape behavior, modal trap, and return target;
- wide, medium, 390 px, 320 px, and relevant landscape behavior;
- keyboard, target, live-region, non-color, contrast, forced-colors, reduced-motion, text-zoom, and page-zoom expectations;
- synthetic fixture roster and a forbidden-data/privacy checklist;
- highest-risk interaction alternatives and the Council rationale for the selected treatment;
- explicit exclusions and non-production claims;
- current-run evidence roster required for independent QA.

This contract is complete as a design baseline only. It does not mark any v17–v35 P, D, C, I, Q, or F gate approved.
