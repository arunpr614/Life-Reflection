# Life in Days prototype v15 — Product Council contract

Date: 2026-08-17
Package: **PVA-010 Correction Editor**
Status: **Council Approved**

## 1. Council, authority, and disposition

- Product direction: **/root/v15_product_manager** — Product gate **A**.
- UI/UX contract: **/root/v15_ux_designer** — Design gate **A**.
- Product Council reconciliation: **/root/v15_council_chair** — Council gate **A**.
- Contract transcription: **/root/v15_contract_docs**.
- Implementation: **/root** — Implementation gate **IP** until one stable candidate, complete current-run evidence, and independent QA exist.
- Independent QA: unassigned until the complete v15 candidate fingerprint and evidence roster are held — QA gate **—**.

Authority order is Arun's direct decisions, [Product Requirement LID-SRC-001](../../product/PRODUCT-REQUIREMENTS.md), the applicable [UX Specification](../../design/UX-SPECIFICATION.md), [audit gap 5](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md), and this resolved Council contract.

The frozen [v14 Council contract](../v14/COUNCIL-v14.md), [v14 fixture sheet](../v14/UPLOAD-FIXTURES-v14.md), and [v14 handoff](../CALENDAR-UI-PROTOTYPE-v14.md) are inherited regression dependencies. V15 is additive. It does not revise frozen v6–v14 behavior or evidence.

The authoritative v15 scenario ledger and exact 22-frame roster are [Correction Fixtures v15](./CORRECTION-FIXTURES-v15.md).

Product controls scope, domain outcomes, stage meaning, source/base integrity, zero-or-one mutation, and exact product strings. Design controls hierarchy, visual states, action order, responsive behavior, focus, announcements, and the evidence roster without changing Product outcomes. Council decision **C-15-01** resolves base binding and removal. There is no unresolved Product, Design, PRD, UX, or Council blocker.

## 2. Prototype question and permitted closure

V15 asks one bounded prototype question:

> Can the frozen private archive represent a Source Item-bound text Correction against one completely visible base revision, guard create, update, and removal as zero-or-one operations, and communicate author/time, unsaved, failure, retry, race, session, and retained-history truth without claiming that browser fixtures prove durable records or upstream reconciliation?

The sole permitted closure statement is:

> **V15 prototype-represents Source Item-bound text Corrections, immutable base-revision visibility, simulated author/time, guarded create/edit/removal, unsaved-warning, failure/retry/race/session behavior, and retained Correction records using deterministic fictional browser state. Source storage, durable Correction persistence, upstream reconciliation, conflict resolution, redating, complete history/export/restore reconstruction, backend idempotency, encryption, authentication, deployment, and production readiness remain unverified.**

The prototype may establish deterministic fictional layout, semantics, focus behavior, privacy surfaces, and live-memory transitions for the exact static candidate. It does not establish source storage, durable Correction persistence, immutable database records, transaction isolation, cross-process idempotency, restart recovery, upstream reconciliation, complete audit history, export/restore reconstruction, authentication, deployment, operations, or formal accessibility conformance.

## 3. Frozen v14 boundary

All passed v6–v14 UI, Council, fixture, handoff, guide, QA, and evidence bytes remain frozen. V15 uses v15-numbered artifacts only.

V15 must not:

- edit frozen v6–v14 runtime, evidence, documentation, or package identities;
- turn **Correct displayed text** into a blank journal composer;
- edit VoiceNotes, an Uploaded Journal original file, a Source Item, or a Source Revision;
- expose a diff, select a competing upstream revision, auto-merge source text, or resolve a conflict;
- change a Journal Date, move a Source Item, recalculate cross-day state, or enter redating scope;
- claim a complete History surface because a retained historical Correction is represented locally;
- claim that an author, timestamp, revision, Correction, save, removal, history record, or transaction is durable;
- weaken inherited routing, privacy, session, responsive, theme, accessibility, manual-upload, Telegram, or Search behavior.

The inherited v10 simulated Correction surface is not authoritative where it conflicts with this contract. V15 supersedes its generic one-shot behavior for the v15 Source Item-bound flow only.

## 4. Final Council rulings

| Question | Binding ruling |
| --- | --- |
| Product gate | **A** |
| Design gate | **A** |
| Council gate | **A** |
| Requirement scope | Audit gap 5's Correction-editor portion and only the frontend-prototype portion of **LID-SRC-001**. |
| Eligible launch | One specific eligible Voice Journal or Uploaded Journal Source Item. No global or blank launch. |
| Base | Exactly one complete, read-only, current Source Revision is visible and bound before editing. |
| Competing upstream revision | None in the successful v15 fixture. If one appears or races, fail closed with zero mutation and hand off to v16. |
| Correction content | Non-whitespace text that differs from the currently displayed value. |
| Create/update | Append exactly one represented Correction record bound to the captured base revision; never overwrite a source or prior Correction. |
| Removal | Restore the exact recorded base revision for display and retain the removed displayed Correction as represented historical. |
| Removal under later upstream revision | Do not choose, rebase, insert, or merge the later revision. Fail closed; v16 owns review. |
| Author | **Archive owner · simulated**. |
| Time model | Four fixed fictional Correction event timestamps, all in Asia/Kolkata on 13 August 2026. |
| Retry/reconciliation | Reuse the same intent identity; reconcile an unknown result to zero or one before another effect. |
| Prototype disclosure | Every success explicitly says it is in this tab and nothing was persisted. |

## 5. Council decision C-15-01 — Correction base and removal

Each v15 source fixture has exactly one eligible current Source Revision and no competing upstream revision at the successful decision point.

A Correction:

1. launches only from its specific Source Item;
2. shows that Source Item's identity and the complete selected Source Revision;
3. captures the selected Source Revision as an immutable represented base snapshot for the operation;
4. requires non-whitespace text different from the currently displayed text;
5. appends one represented Correction record when create or update settles successfully;
6. leaves source bytes, Source Item facts, and every Source Revision unchanged;
7. never changes Journal Date in v15.

Removing the displayed Correction:

1. is a guarded display-state operation, not deletion;
2. restores the exact Source Revision recorded as that Correction's base;
3. retains the prior Correction as represented historical;
4. leaves the Source Item and source revisions unchanged;
5. appends at most one represented removal event for one intent;
6. fails closed if a later/racing upstream revision would require a choice.

The exact removal contract is:

- heading: **Remove displayed Correction?**
- body: **The selected source revision will be displayed again. This Correction remains retained as historical. The Source Item and source revisions are unchanged.**
- actions in DOM and visual order: **Keep Correction**, then **Remove displayed Correction**.

This wording supersedes any draft that could imply deleting the Correction, Source Item, or Source Revision.

## 6. Exact scope

V15 includes:

- Source Item-only launch from one eligible Voice Journal and one eligible Uploaded Journal fixture;
- a complete source identity region and complete read-only selected base revision;
- a text-only Correction editor prefilled from the displayed text;
- pristine, dirty, whitespace, unchanged, saving, success, known-zero failure, connection interruption, unknown-result, reconciliation, rapid-repeat, stale callback, base-race, unsaved-leave, session-ended, update, remove-confirm, remove-failure, and remove-success states;
- create and update as distinct appended represented Correction records;
- author, created time, and **Based on** metadata;
- an active source-card state with a Correction badge and update/removal actions;
- removal that restores the recorded base and retains the Correction as represented historical;
- exact invoker focus return, logical destination focus, Back/Forward settlement, and generic session destination;
- privacy checks across URL, title, history payload, browser storage, requests, console, logs, telemetry, DOM identifiers, and live regions;
- light, dark, system theme, forced colors, reduced motion, keyboard, touch, target-size, contrast, responsive, 200% text zoom, and 400% reflow coverage;
- deterministic fictional fixtures and the exact Design-approved 22-frame roster.

## 7. Excluded and deferred behavior

V15 contains no:

- blank browser journal composer or general writing surface;
- photo, caption, generated-field, tag, title, summary, artwork, or Journal Date Correction;
- source-conflict diff, comparison, auto-merge, or any of the three v16 resolution outcomes;
- automatic selection of a newest upstream revision;
- redating, old/new day preview, cover recalculation, search update, stale-artwork movement, or cross-day transaction;
- complete Source Item, Journal Day, global, Search-history, or export History surface;
- Trash, restore, purge, Source Suppression, Artwork Suppression, or permanent deletion;
- source upload/capture changes, original-file mutation, VoiceNotes mutation, or Telegram mutation;
- actual source storage, durable Correction table, transaction, encryption, persistence, restart recovery, backend reconciliation, or server idempotency;
- export or restore reconstruction proof;
- actual AI/provider request or any photo/derived data sent to AI;
- authentication, deployment, operations, production readiness, or formal accessibility-conformance claim;
- real/private journal text, filenames, identifiers, authors, timestamps, or photos.

V16 owns conflict review and upstream reconciliation. V17 owns redating. V18/later owns complete History and provenance. A locally represented retained historical Correction is not a complete History implementation.

## 8. Canonical terms, fixture identity, and exact timestamps

Use **Journal Day**, **Journal Date**, **Voice Journal**, **Uploaded Journal**, **Source Item**, **Source Revision**, **Correction**, **Displayed Correction**, **Original Timestamp**, **current**, and **historical** according to the existing domain language.

Do not call a Correction an upstream edit, source rewrite, file edit, note replacement, AI rewrite, document, or new journal. Do not call removal deletion.

The designated fictional sources are:

| Fixture | Journal Date | Internal fixture handle | Source type | Visible source title | Base |
| --- | --- | --- | --- | --- | --- |
| Voice | 2 August 2026 | `v-02` | Voice Journal | **Before sleep — synthetic fixture** | Voice R1 |
| Uploaded | 8 August 2026 | `u-08` | Uploaded Journal | **quiet-saturday.md** | Uploaded R1 |
| Long text | 9 June 2026 | `u-june-09` | Uploaded Journal | Fictional long-text fixture | Uploaded R1 |

Fixture handles are test-ledger values only. They never appear in product URLs, titles, history payloads, user-facing DOM identifiers, telemetry, or live regions.

The exact visible author is:

> **Archive owner · simulated**

The exact four represented Correction event timestamps are:

| Event | Exact visible time |
| --- | --- |
| Voice create | **13 August 2026 · 10:06 pm IST** |
| Uploaded create | **13 August 2026 · 10:07 pm IST** |
| Uploaded update | **13 August 2026 · 10:08 pm IST** |
| Uploaded removal | **13 August 2026 · 10:10 pm IST** |

These are deterministic fictional display values. The browser clock does not generate them. They do not prove a durable clock, stored event, audit record, timezone conversion, or backend ordering.

## 9. Exact entry, editor, source-card, removal, and status copy

The following Product/Design literals are exact:

| Purpose | Exact copy |
| --- | --- |
| Source-card entry and editor heading | **Correct displayed text** |
| Base region label | **Source revision used as base · read only** |
| Editor label | **Displayed Correction** |
| Editor helper | **This changes only what Life in Days displays. The Source Item and base revision remain unchanged.** |
| Dirty status | **Unsaved changes · kept only while this page remains open.** |
| Primary save action | **Save Correction** |
| Saving stage | **Saving Correction** |
| Retry action | **Retry saving** |
| Active badge | **Correction displayed · prototype only** |
| Active-card update action | **Update displayed Correction** |
| Active-card removal action | **Remove displayed Correction** |
| Create/update failure | **Correction not saved. Your draft remains in this open page. The Source Item and base revision are unchanged.** |
| Create/update success | **Correction displayed in this tab. The Source Item and base revision are unchanged. Nothing was persisted.** |
| Base-race failure | **Source changed before this Correction was saved.** |
| Unknown-result action | **Check save status** |
| V16 handoff label | **Review source update** |
| Removal success | **Source revision displayed. The earlier Correction remains retained as historical in this tab. Nothing was persisted.** |

The unsaved-leave dialog is exact:

- heading: **Leave with an unsaved Correction?**
- body: **This Correction is kept only in this open page. Leaving or reloading will discard it.**
- actions in DOM and visual order: **Keep editing**, then **Discard Correction and leave**.

Council freezes these additional deterministic literals for implementation and QA:

| Purpose | Exact copy |
| --- | --- |
| Whitespace validation | **Enter Correction text before saving.** |
| Unchanged validation | **Change the displayed text before saving.** |
| Connection interruption | **Connection interrupted. Your draft remains in this open page. Nothing was saved.** |
| Unknown save result | **Save result unknown. Check save status before trying again.** |
| Save reconciliation stage | **Checking save status** |
| Already-settled save | **Correction already displayed. No second Correction was created.** |
| Removal progress | **Removing displayed Correction** |
| Removal known-zero failure | **Correction not removed. The displayed Correction remains unchanged. Retry.** |
| Removal retry action | **Retry removing** |
| Unknown removal result | **Removal result unknown. Check removal status before trying again.** |
| Unknown removal action | **Check removal status** |
| Removal reconciliation stage | **Checking removal status** |
| Already-settled removal | **Source revision already displayed. No second removal event was created.** |
| Generic session heading | **Session ended** |
| Generic session body | **Sign in again to return to Life in Days. Unsaved Correction text was not retained.** |

The implementation must not paraphrase, title-case differently, replace **Correction** with “edit,” or shorten copy in compact layouts. Busy labels may add a single typographic ellipsis visually while retaining the same accessible name.

## 10. Editor and source-card anatomy

The wide editor has a maximum visual width of 760 CSS pixels. Its DOM and reading order is:

1. heading **Correct displayed text**;
2. source facts: source type, visible source title, Journal Date, and Original Timestamp;
3. label **Source revision used as base · read only** and the complete base text;
4. label **Displayed Correction** and the editor;
5. exact helper, validation, dirty, failure, or progress state;
6. actions, with dismissal before the primary save action.

The base text is complete and readable. It is never truncated behind “show more,” hidden behind a diff, editable, or replaced by a summary. On compact layouts, source facts, base, editor, state, and actions stack in the same order. Sticky actions may be used only if they do not cover text or focus targets.

The active source card shows:

- source type and title unchanged;
- badge **Correction displayed · prototype only**;
- the displayed Correction text;
- metadata labels **Author**, **Created**, and **Based on**;
- author **Archive owner · simulated**;
- the applicable exact fictional created time;
- a human-readable base such as **Voice R1** or **Uploaded R1**;
- actions **Update displayed Correction** and **Remove displayed Correction**.

The card never labels the Correction as VoiceNotes text, an original file, upstream content, or a Source Revision. Retained historical state may be represented after removal, but v15 exposes no complete History browser.

The removal confirmation has a maximum visual width of 520 CSS pixels. Its DOM and visual order is heading, exact body, **Keep Correction**, then **Remove displayed Correction**. The destructive action is not moved ahead of the safe action at any viewport.

## 11. Pure transition model

The reference behavior is a pure reducer:

    reduce(correctionState, event) → nextCorrectionState + zero or one declared effect

Rendering, focus, validation, navigation, retry activation, and reconciliation never append a record by themselves. A declared effect carries an immutable operation snapshot.

The state contains:

| Field | Allowed meaning |
| --- | --- |
| generation | Live-memory generation used to reject stale callbacks. |
| intent identity | One opaque create, update, or removal identity reused through retry/reconciliation. |
| mode | create, update, or remove. |
| source | One eligible Voice Journal or Uploaded Journal fixture. |
| base revision | Exact selected represented Source Revision identity plus complete text snapshot. |
| displayed before | Base text or one represented Correction. |
| draft | Open-page text only; pristine, dirty, or invalid. |
| stage | closed, editing, invalid, leave warning, saving/removing, interrupted, failed known zero, unknown, reconciling, success, or race blocked. |
| commit phase | not started, pending/unknown, known zero, or settled one. |
| current Correction | absent or one represented displayed Correction record. |
| historical Corrections | Ordered represented records retained in the current fixture. |
| removal target | Exact displayed Correction and its exact recorded base. |
| focus return | Logical live-memory invoker/destination reference, never private text or a DOM ID derived from private data. |

Normative events are:

- **OPEN_CREATE(source, base)**
- **OPEN_UPDATE(source, current Correction)**
- **INPUT(text, selection)**
- **SAVE**
- **VALIDATION_FAILED(reason)**
- **SAVE_STARTED(intent, snapshot)**
- **SAVE_SUCCEEDED(intent, record)**
- **SAVE_FAILED_KNOWN_ZERO(intent)**
- **SAVE_RESULT_UNKNOWN(intent)**
- **RETRY_SAVE(intent)**
- **CHECK_SAVE_STATUS(intent)**
- **RECONCILE_SAVE_ZERO(intent)**
- **RECONCILE_SAVE_ONE(intent, record)**
- **OPEN_REMOVE(source, Correction)**
- **KEEP_CORRECTION**
- **REMOVE_CONFIRMED(intent, snapshot)**
- **REMOVE_SUCCEEDED(intent, event)**
- **REMOVE_FAILED_KNOWN_ZERO(intent)**
- **REMOVE_RESULT_UNKNOWN(intent)**
- **RETRY_REMOVE(intent)**
- **CHECK_REMOVE_STATUS(intent)**
- **RECONCILE_REMOVE_ZERO(intent)**
- **RECONCILE_REMOVE_ONE(intent, event)**
- **SOURCE_REVISION_CHANGED(source, revision)**
- **CONNECTION_LOST**
- **CONNECTION_RESTORED**
- **BACK**
- **FORWARD**
- **ESCAPE**
- **BACKDROP**
- **NAVIGATE(destination)**
- **RESET**
- **SESSION_EXPIRED**
- **CALLBACK(generation, intent, stage, result)**

### Transition invariants

1. Opening, typing, focusing, validating, warning, dismissing, retry activation, or rendering changes no archive fact.
2. A valid operation has exactly one eligible Source Item and one complete selected base revision.
3. Source bytes, Source Item facts, source title, Original Timestamp, Journal Date, and every Source Revision remain unchanged in every v15 transition.
4. Blank, whitespace-only, or unchanged draft text cannot issue a save effect.
5. Create/update success appends exactly one represented Correction record for one intent and makes that record displayed.
6. Update does not overwrite C1; it appends C2 against the same eligible base and retains C1 as represented historical.
7. Removal does not delete a Correction; it restores that Correction's exact recorded base for display and retains the Correction as historical.
8. Known-zero failure changes no current/historical record and preserves the open-page draft or displayed Correction as stated.
9. After an effect begins, actions are locked and Escape, backdrop, Back, or navigation cannot imply cancellation.
10. A callback is accepted only when generation, intent identity, source, base, and expected stage match the active operation.
11. Duplicate, replayed, late, and stale callbacks are no-ops.
12. The represented outcome count for one create/update/removal intent is always zero or one.
13. A settled-one result never returns to zero and never runs its effect again.
14. Retry and status check reuse the original intent identity.
15. Unknown-result reconciliation runs before another save/removal effect.
16. Reconciliation to one adopts the one settled outcome and creates nothing.
17. Reconciliation to zero may issue one guarded retry through the same intent.
18. A newly observed upstream revision invalidates the successful v15 path; no rebase, selection, insertion, or merge occurs.
19. Dirty drafts live only in the open page and are not recoverable after reload, reset, or session expiry.
20. Browser history restores settled display state only; it never reruns an effect or recovers discarded private draft text.

## 12. Create and update contract

### Create

Create begins on an eligible source card with **Correct displayed text**. The editor preloads the complete displayed base text, while the base region separately shows the same complete read-only Source Revision. The primary action is disabled while pristine.

After a valid differing draft and **Save Correction**:

> **Saving Correction** → represented terminal success or an explicit failure/unknown/race state

Settled success appends C1, shows it as displayed, renders exact author/time/base metadata, and says:

> **Correction displayed in this tab. The Source Item and base revision are unchanged. Nothing was persisted.**

### Update

Update begins from **Update displayed Correction** on a card already displaying C1. The editor shows:

- the same complete selected base revision;
- current C1 as the initial editable displayed value;
- C1 author, created time, and **Based on** metadata;
- the exact helper and dirty-state rules.

Successful update appends C2, displays C2, and retains C1 as represented historical. It never edits C1 or the base. The exact update fixture uses **13 August 2026 · 10:08 pm IST**.

### Validation

| Condition | Exact copy | Required behavior |
| --- | --- | --- |
| Blank or whitespace-only | **Enter Correction text before saving.** | Keep focus in the editor; create no effect or record. |
| Unchanged from displayed value | **Change the displayed text before saving.** | Keep editor and base visible; create no effect or record. |
| Source no longer eligible | **Source changed before this Correction was saved.** | Fail closed; create no Correction; expose **Review source update** only when the fixture represents a new upstream revision. |
| Known-zero save failure | **Correction not saved. Your draft remains in this open page. The Source Item and base revision are unchanged.** | Preserve the draft in this page and expose **Retry saving**. |
| Connection interruption | **Connection interrupted. Your draft remains in this open page. Nothing was saved.** | Preserve the draft in this page; do not queue or auto-resume. |
| Unknown result | **Save result unknown. Check save status before trying again.** | Expose **Check save status**; do not issue a second append. |

No validation state may expose private text in a toast, live region, URL, history payload, console, or log.

## 13. Removal contract

Removal begins only from a card displaying a represented Correction. It captures the exact Correction, exact recorded base revision, and current generation before the confirmation appears.

**Keep Correction** closes the confirmation, restores exact invoker focus and scroll, and changes nothing.

**Remove displayed Correction** begins a guarded display-state operation. While **Removing displayed Correction** is pending, actions are locked and dismissal cannot imply cancellation.

Settled success:

- displays the exact recorded base revision;
- retains the prior Correction as represented historical;
- records **Archive owner · simulated** and **13 August 2026 · 10:10 pm IST** for the represented removal event;
- leaves the Source Item and every Source Revision unchanged;
- says **Source revision displayed. The earlier Correction remains retained as historical in this tab. Nothing was persisted.**

| Condition | Exact copy | Required behavior |
| --- | --- | --- |
| Known-zero removal failure | **Correction not removed. The displayed Correction remains unchanged. Retry.** | Keep the Correction displayed; expose **Retry removing**. |
| Unknown removal result | **Removal result unknown. Check removal status before trying again.** | Expose **Check removal status**; do not issue another removal event. |
| Later/racing upstream revision | **Source changed before this Correction was saved.** | Fail closed; keep displayed truth; hand off to **Review source update**. |
| Reconciled already complete | **Source revision already displayed. No second removal event was created.** | Adopt settled result; do not append another event. |

Removal never chooses “newest upstream,” deletes the Correction, edits a Source Revision, changes Journal Date, or claims complete History.

## 14. Retry, reconciliation, rapid action, and race contract

### Known zero

A known-zero failure preserves the visible pre-operation truth and carries the original intent identity into Retry. Retry first verifies that identity's status. It does not mint a fresh intent from the same button activation.

### Unknown result

An unknown save or removal result never renders a success or a known-zero assertion. The only safe next action is the corresponding status check:

- **Check save status** → **Checking save status**;
- **Check removal status** → **Checking removal status**.

Reconciliation may return:

- zero: one guarded retry may run with the same intent;
- one: adopt the complete settled outcome and show the already-settled copy;
- still unknown: remain blocked without another effect.

### Rapid and replayed input

- double-click, Enter plus click, touch plus click, and repeated Retry produce at most one effect;
- controls become semantically and visually disabled while pending;
- duplicate promise resolution, timer, callback, or history replay is ignored;
- a second fresh intent is possible only after the first terminal is settled and the owner explicitly starts a new update/removal flow.

### Base race

Source/base identity is rechecked immediately before an effect and on callback acceptance. A later or competing upstream revision causes zero mutation and **Source changed before this Correction was saved.** V15 never auto-selects the newer revision and never carries any of its text into the editor. **Review source update** is a v16 handoff, not a v15 resolution.

## 15. Unsaved navigation, Back/Forward, reset, connection, and session

Before save begins, Cancel, Escape, backdrop, browser Back, route navigation, and session transition with a dirty draft enter the exact unsaved-leave dialog. No path silently preserves the draft outside the open page.

**Keep editing** returns to the exact editor selection, scroll, source, and draft. **Discard Correction and leave** clears private draft/base-operation state and completes the requested destination. Browser Forward cannot resurrect the discarded draft.

Once save/removal begins, Back, Escape, backdrop, and route controls cannot close the operation or announce cancellation. The pending operation remains visible until a known terminal or unknown-result reconciliation state is represented.

Connection loss:

- never queues or auto-resumes an operation;
- never turns a pending outcome into known zero without the designated fixture fact;
- keeps an unsaved draft only in live page memory;
- exposes an explicit Retry or status check appropriate to the result certainty;
- sends no browser request in the static prototype.

Reset, reload, or session expiry invalidates generation and every callback. A session-ended route contains no draft, source text, source title, base text, author/time record, intent identity, or outcome detail. It uses only:

- **Session ended**
- **Sign in again to return to Life in Days. Unsaved Correction text was not retained.**

## 16. Focus, keyboard, history, and announcements

| State change | Required focus/announcement |
| --- | --- |
| Open create | Focus editor heading when unclaimed, then permit direct move to **Displayed Correction**; exact invoker is retained logically. |
| Open update | Same rule; base and current Correction metadata precede the editor in reading order. |
| Validation failure | Focus or associate the editor and concise error once; do not duplicate it in toast and live region. |
| Dirty state | Do not steal selection or announce every keystroke. |
| Unsaved leave | Focus heading or **Keep editing**; trap focus; Escape is equivalent to **Keep editing**. |
| Saving/removing | Keep deliberate focus or move once to the named status; lock actions; announce the stage once. |
| Known-zero failure | Focus one logical failure/Retry anchor; one assertive message maximum. |
| Unknown result | Focus the status-check action; do not announce success/failure. |
| Success | Focus terminal/status once; announce generic completion without source title or text. |
| Close success | Restore exact still-live source-card invoker or focus the corrected/restored card heading. |
| Remove confirmation | Focus heading or **Keep Correction**; safe action precedes destructive action. |
| Keep Correction | Restore exact removal invoker and scroll. |
| Back/Forward | Restore settled view/focus without rerunning or repeating announcements. |
| Session ended | Focus generic destination heading; no draft/source announcement. |

All controls use native buttons, textarea, headings, labels, descriptions, dialog semantics, `aria-modal`, and `aria-busy`/disabled state where applicable. Tab and Shift+Tab remain contained in an open modal. Enter and Space activate the focused action once. Escape obeys the dirty/pending rules. A concise live region never contains private source/base/draft text, filename, author metadata, internal identity, or operation identity.

## 17. Privacy and browser-surface contract

All v15 data is synthetic. Inspect every applicable state before, during, after, after Back/Forward, after reset/reload, and after session expiry.

- page title remains **Life in Days**;
- URL and hash contain structural route state only;
- browser history payload contains only an opaque live-memory entry identity and no private/source-derived value;
- local storage, session storage, cookies, IndexedDB, Cache Storage, and service workers contain no source, base, draft, Correction, intent, author/time, result, focus, or fixture value;
- clipboard and referrer contain none of those values;
- no request contains source/base/draft/Correction/intent/result/focus data;
- no external, integration, provider, analytics, telemetry, crash-report, or AI request occurs;
- console and logs contain no journal text, source title, date, identifier, author/time, operation, or outcome;
- product DOM IDs and test hooks contain no private/source-derived values or raw fixture handles;
- toasts and live regions use generic operation copy without source title or excerpt;
- reload/session loss cannot recover a draft or pending operation;
- success states explicitly say **in this tab** and **Nothing was persisted.**

The source/base text is inert escaped text. It cannot create markup, links, scripts, event handlers, image requests, CSS, or interpreted Markdown. V15 sends zero photo, source, base, draft, or derived data to AI.

## 18. Accessibility, responsive, and visual contract

The v15 editor inherits the Life in Days visual system, 760-pixel editor bound, 520-pixel removal-confirmation bound, warm light theme, deep-ink dark theme, visible focus, and semantic source/card patterns.

Required checks:

- light, dark, system theme, forced colors, and reduced motion;
- current desktop and compact browser behavior represented at all named viewports;
- 24 × 24 CSS-pixel absolute target floor and 44 × 44 preferred compact primary actions;
- visible focus with inherited contrast targets against every surface;
- warnings, error, busy, current, and historical states not distinguished by color alone;
- long base and draft text preserve paragraphs and comfortable reading measure;
- source facts, complete base, editor, state, and actions remain in logical DOM order;
- compact actions stack full width without reversing safe/destructive or cancel/primary order;
- the editor and confirmation may scroll internally only when all content and actions remain reachable;
- no horizontal page overflow, clipped copy, covered focus, overlap, or unreachable action;
- background content is inert and scroll-locked while a modal is open;
- 200% text zoom and 400% page reflow preserve the complete task;
- 568 × 320 landscape keeps the complete removal consequences and both actions reachable;
- reduced motion removes nonessential transitions while status remains understandable.

## 19. Exact Design-approved evidence roster

These basenames, viewport/zoom conditions, themes, and depicted states are exact and unchanged from the approved Design output. Files belong in **docs/prototypes/v15/**. No substitute name, reordered row, stale frame, or extra superseded frame is accepted.

| # | Exact file basename | Viewport / zoom | Theme | Required state |
| --- | --- | --- | --- | --- |
| 01 | `v15-01-source-card-launch-light.png` | 1440 × 900 | Light | Clean Voice Journal card with the Source Item-bound **Correct displayed text** launch. |
| 02 | `v15-02-new-editor-base-dark.png` | 1440 × 900 | Dark | New Voice Correction with complete read-only base and pristine editor. |
| 03 | `v15-03-uploaded-editor-light.png` | 1440 × 900 | Light | Uploaded Journal identity, complete base, and editor. |
| 04 | `v15-04-dirty-draft-dark.png` | 1440 × 900 | Dark | Changed draft, complete base, and exact unsaved status. |
| 05 | `v15-05-whitespace-validation-light.png` | 1280 × 720 | Light | Whitespace-only draft rejected; source/base unchanged. |
| 06 | `v15-06-unsaved-leave-dark.png` | 1280 × 720 | Dark | Exact unsaved-leave heading, body, and two actions. |
| 07 | `v15-07-saving-correction-light.png` | 1280 × 720 | Light | **Saving Correction**; operation busy and actions locked. |
| 08 | `v15-08-save-success-metadata-dark.png` | 1280 × 720 | Dark | Terminal success with exact author, created time, and base metadata. |
| 09 | `v15-09-corrected-source-card-light.png` | 960 × 900 | Light | **Correction displayed · prototype only** card with update and removal actions. |
| 10 | `v15-10-save-failure-dark.png` | 960 × 900 | Dark | Known-zero save failure, draft retained in page, and **Retry saving**. |
| 11 | `v15-11-connection-interrupted-light.png` | 960 × 900 | Light | Connection interruption, unsaved draft, and no save claim. |
| 12 | `v15-12-retry-saving-dark.png` | 960 × 900 | Dark | Retry in progress with the same intent identity. |
| 13 | `v15-13-rapid-repeat-settled-light.png` | 700 × 900 | Light | Rapid/replayed activation settled to exactly one Correction. |
| 14 | `v15-14-existing-correction-editor-dark.png` | 700 × 900 | Dark | Existing C1 editor with its R1 base and metadata visible. |
| 15 | `v15-15-remove-confirm-light.png` | 700 × 900 | Light | Exact removal heading/body/action order. |
| 16 | `v15-16-remove-failure-dark.png` | 700 × 900 | Dark | Removal failed; Correction still displayed; **Retry removing**. |
| 17 | `v15-17-remove-success-retained-light.png` | 640 × 900 at 200% text zoom | Light | Source revision restored; earlier Correction visibly **Historical**. |
| 18 | `v15-18-session-ended-draft-dark.png` | 640 × 900 at 200% text zoom | Dark | Generic session-ended destination with no draft recovery. |
| 19 | `v15-19-long-editor-mobile-light.png` | 390 × 844 | Light | Long stacked editor with complete base and reachable sticky actions. |
| 20 | `v15-20-unsaved-mobile-dark.png` | 390 × 844 | Dark | Compact unsaved dialog with full-width actions in exact order. |
| 21 | `v15-21-remove-landscape-light.png` | 568 × 320 landscape | Light | Complete removal consequences and both actions reachable. |
| 22 | `v15-22-long-error-400pct-dark.png` | 320 × 900 at 400% page reflow | Dark | Long save failure and Retry with no clipping or covered focus/action. |

Evidence acceptance requires:

- fresh current-run RGB PNGs captured only after final v15 UI hashes are held;
- exact basenames, pixel dimensions, zoom settings, and themes;
- original-resolution visual inspection of every frame;
- unique basenames and no stale, extra, or superseded v15 evidence frame;
- repository bytes equal inspected bytes;
- readable, unclipped, source-faithful state at the named condition;
- regeneration of all 22 frames after any v15 UI-byte change.

Screenshots do not prove interaction, keyboard behavior, focus, announcements, races, privacy, storage absence, network absence, durability, or regression. Those require live and static checks on the same exact fingerprint.

## 20. Independent QA, regression, and stop rules

Independent QA starts from zero after Product **A**, Design **A**, Council **A**, one stable candidate, exact UI/package/document fingerprints, and all 22 current-run frames exist.

QA must execute every scenario in [Correction Fixtures v15](./CORRECTION-FIXTURES-v15.md), including:

- eligibility, source identity, complete base, editor hierarchy, exact copy, and timestamps;
- whitespace and unchanged validation;
- Voice and Uploaded create, Uploaded update, and guarded removal;
- known-zero failure, connection interruption, explicit Retry, unknown-result reconciliation to zero/one, rapid repeat, duplicate callback, stale callback, base race, and session loss;
- dirty Escape/backdrop/Back/route behavior and pending-operation dismissal guards;
- exact focus, selection, scroll, destination, Back/Forward, and announcement behavior;
- URL/title/history/browser-storage/request/console/log/telemetry/DOM/live-region privacy;
- all 22 frames, original-resolution inspection, dimensions, themes, forced colors, reduced motion, keyboard/touch, target sizes, contrast, 200% zoom, and 400% reflow;
- static syntax, v15 checks, and every inherited v6–v14 check;
- byte-for-byte comparison of every frozen v6–v14 artifact and evidence file against the frozen baseline.

Stop and return **Fail** if:

- any source/base fact mutates;
- blank, whitespace, unchanged, stale-base, or dismissed flow creates a Correction/removal event;
- one intent produces two outcomes;
- removal deletes history, selects a later revision, or implies deletion;
- a private/source-derived value reaches a forbidden browser surface;
- any frame is stale, missing, extra, misnamed, clipped, unreadable, or captured from different UI bytes;
- any frozen v6–v14 byte changes;
- any Critical, High, Medium, or Low defect remains unresolved.

Pass requires unresolved **Critical 0, High 0, Medium 0, Low 0** on the exact held fingerprint. Any UI-byte change invalidates all 22 frames and the complete independent disposition. A package-byte change requires a new package identity and repeated static checks. QA does not edit, repair, create evidence, stage, commit, freeze, push, or deploy the candidate it judges.

## 21. Proof boundary and implementation handoff

This contract, fixture sheet, runtime candidate, and screenshots can represent one deterministic fictional browser state machine. They cannot verify durable Corrections, immutable server records, source storage, actual author attribution, trustworthy time, transactionality, cross-process idempotency, upstream reconciliation, complete History, export/restore reproduction, authentication, deployment, or production readiness.

Implementation handoff is approved with Product **A**, Design **A**, and Council **A**. Implementation must preserve every exact literal, invariant, roster row, exclusion, and proof boundary here. Any contract ambiguity reopens Council before UI/evidence capture.

V15 may close only after:

1. a complete additive candidate exists without frozen-byte changes;
2. all exact artifacts and current-run evidence are fingerprinted;
3. an independent agent returns Pass with zero unresolved findings;
4. implementation/evidence and documentation-only freeze records are committed in the established sequence;
5. tracker metadata accurately records the limited frontend-prototype closure while leaving conflict, redating, complete History, export/restore reconstruction, and production evidence open.

Until then, gates remain **P=A, D=A, C=A, I=IP, Q=—**.
