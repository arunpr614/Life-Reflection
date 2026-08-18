# Life in Days prototype v16 — Source/Correction conflict Council contract

Status: **APPROVED — P=A, D=A, C=A**

This is the frozen product, design, implementation, and independent-QA authority for the v16 Source/Correction conflict-resolution slice. The executable fixture ledger is [SOURCE-CONFLICT-FIXTURES-v16.md](./SOURCE-CONFLICT-FIXTURES-v16.md). When prose and a fixture assertion appear to differ, stop: implementation is not permitted to choose one silently. Council must reconcile the two documents.

## 1. Council disposition

Product approved **A**. Design approved **A**. Council approved **A**.

The approved experience is a dedicated full-page workbench titled **Review source update**. It provides a complete two-document comparison, exactly three materially distinct outcomes in the order frozen below, a consequence preview before every effect, and a separate **Cancel** navigation action that leaves the conflict unresolved.

The Council's sole closure of a previously underspecified semantic was the Product recommendation for the manual outcome: a saved C2 must differ from both C1 and R2. Equality with C1 is the already-available **Keep the Correction** outcome; equality with R2 is the already-available **Display newest upstream revision** outcome. No fourth outcome, implicit alias, or silent normalization is allowed.

This approval does not claim deployment, persistence, real VoiceNotes access, real private data handling, encryption, production readiness, or formal accessibility conformance. It authorizes only the deterministic local prototype and proof package described here.

## 2. Frozen v6–v15 boundary

v16 is additive. The complete accepted v6–v15 surface remains frozen:

- calendar and day navigation;
- journal-day and no-journal-day presentation;
- Source Item attribution and Source Revision facts;
- photo and Generated Artwork representation;
- prior restore/remove and bounded history behavior;
- v15 create, update, remove, draft, validation, pending, failure, unknown-result, retry, reconciliation, session, privacy, and accessibility behavior for Corrections.

No v6–v15 route, frame, fixture, token, copy string, identity, timestamp, state transition, count, focus rule, privacy rule, or artifact may be edited to implement v16. v16 begins from the settled v15 S-VOICE day-2 C1 fixture and appends a simulated Voice R2 plus the conflict states in this contract.

The v15 zero-or-one effect discipline is inherited: one accepted intent may create at most one terminal resolution event and, only for the manual outcome, at most one C2. Duplicate callbacks, retry, refresh, Back/Forward, and another tab cannot create a second effect.

## 3. In-scope product question

Given one Source Item with immutable Voice R1, a displayed Correction C1 based on R1, and a newer immutable Voice R2, let the archive owner review every byte of C1 and R2 and deliberately choose exactly one of:

1. **Keep the Correction**
2. **Display newest upstream revision**
3. **Create a new Correction based on both**

Until one outcome settles, C1 remains deterministically displayed. **Cancel**, Back, Forward, viewport changes, connection loss, session expiry, loading failure, validation failure, a stale preview, or an unknown result never chooses an outcome.

## 4. Canonical v16 fixture

All product examples and final QA use the synthetic S-VOICE Source Item:

| Fact | Exact value |
| --- | --- |
| Current Journal Date | **2 August 2026** |
| Original Timestamp | **2 Aug 2026, 10:18 pm IST** |
| Internal fixture handle | v-02; test ledger only and never exposed |
| Source type | **Voice Journal** |
| Visible source title | **Before sleep — synthetic fixture** |
| R2 author | **Archive owner · simulated** |
| C1/C2 author | **Archive owner · simulated** |
| R1 label | **Voice R1** |
| C1 identity | C-VOICE-1 |
| C1 created | **13 August 2026 · 10:06 pm IST** |
| C1 based on | **Voice R1** |
| R2 label | **Voice R2** |
| R2 represented time | **17 August 2026 · 9:42 pm IST** |
| Keep resolution time | **18 August 2026 · 9:06 am IST** |
| Display-newest resolution time | **18 August 2026 · 9:08 am IST** |
| C2/manual resolution time | **18 August 2026 · 9:10 am IST** |
| R3 race arrival time | **18 August 2026 · 9:12 am IST** |

Voice R1 remains exactly:

~~~text
Rain settled against the balcony rail.
I put the blue cup beside the lamp and read until the room felt quiet.
~~~

Correction 1 remains exactly:

~~~text
Rain settled against the balcony rail.
I put the blue cup beside the lamp, then read until the room felt quiet.
~~~

Newest Voice R2 is exactly:

~~~text
Rain settled against the balcony rail.
I moved the blue cup beside the lamp and read until the room grew quiet.
Before midnight, I opened the window for a few minutes.
~~~

The valid manual C2 is exactly:

~~~text
Rain settled against the balcony rail.
I moved the blue cup beside the lamp, then read until the room grew quiet.
Before midnight, I opened the window and listened to the rain for a few minutes.
~~~

All text, identities, authors, and times above are fixed literals. Browser time, locale, random values, or earlier fixture execution may not change them.

The test-only resolution intent identities are:

- intent-v16-conflict-keep-01
- intent-v16-conflict-display-newest-01
- intent-v16-conflict-based-on-both-01

They may exist only as opaque, volatile harness logic. They must never appear in visible or hidden DOM, accessible names/descriptions, URLs, document titles, history state, web storage, IndexedDB, cookies, clipboard, network payloads, logs, console output, analytics, telemetry, screenshots, or live-region announcements.

## 5. Entry, workbench, and complete diff

The corrected Source Item carries a persistent conflict entry headed **Review source update** with this exact body:

> VoiceNotes changed after this Correction was created. Nothing was merged. The displayed Correction remains unchanged until you choose an outcome.

It also shows:

> Every Source Revision and prior Correction remains retained.

Opening it navigates to a dedicated page. Initial focus moves to the page h1 without automatically announcing either document. DOM order is:

1. eyebrow **Source Item conflict**;
2. h1 **Review source update**;
3. explanation and retention copy;
4. separate **Cancel**;
5. Source Item facts: Source type, visible source title, **Original Timestamp**, **Current Journal Date**, C1 created time, and R2 represented time;
6. h2 **Compare complete text**;
7. view controls **Complete text** then **Changes only**;
8. the entire C1 article;
9. the entire R2 article;
10. the unchanged-section count and expansion control when Changes only is selected;
11. h2 **Choose what Life in Days displays**;
12. three equal outcome cards in the exact approved order;
13. the prototype and derived-field boundary disclosures.

**Complete text** is selected by default. It renders every character and paragraph of both documents. At widths of at least 1024 CSS pixels, the two complete articles appear side by side while preserving DOM order C1 then R2. Below 1024 CSS pixels, an accessible two-tab full-document switcher replaces the visual columns. The tab labels are **Displayed correction** and **Newest VoiceNotes revision**; selecting a tab shows that entire document and keeps focus on the selected tab.

The complete-document headings and statuses are:

- **Displayed correction** — **Currently displayed**
- **Newest VoiceNotes revision** — **Not displayed**

**Changes only** is an optional derived view. It never replaces the complete view and never truncates a changed paragraph. It labels differences with text, not color alone:

- **Only in displayed Correction**
- **Only in newest VoiceNotes revision**

For the primary fixture it reports **1 unchanged paragraph hidden** and offers **Show 1 unchanged paragraph**. For the frozen long fixture it reports **3 unchanged paragraphs hidden** and offers **Show 3 unchanged paragraphs**. Expansion is reversible, neither changes the documents nor resets scroll, and the complete articles remain available through **Complete text**.

There is one page scroll. Complete documents and changes do not introduce nested scrolling or synchronized scroll traps. Whitespace, line breaks, punctuation, and hostile-looking fixture strings render inertly and verbatim.

The exact Cancel explanation is:

> Cancel closes this review without resolving it. The displayed Correction stays unchanged and Review source update remains visible.

Cancel is outside the outcome-card region. It returns to the exact day, invoker, and scroll offset, leaves C1 displayed, creates no event, and leaves the conflict entry visible.

## 6. Exactly three outcome cards

No card is visually or semantically recommended. They have equal hierarchy, complete labels, and distinct consequences, in this fixed order:

### 6.1 Keep the Correction

Preview copy:

> The current Correction will stay displayed. Voice R2 will be marked reviewed. Voice R1, Voice R2, and Correction 1 remain retained.

One settled Keep effect:

- keeps C1 displayed;
- leaves Voice R1, Voice R2, and C1 bytes and metadata immutable;
- records Voice R2 as reviewed through the single resolution event rather than mutating its source bytes;
- resolves only the reviewed R2 conflict generation;
- creates no Correction;
- creates exactly one bounded resolution event at **18 August 2026 · 9:06 am IST**.

Success copy:

> Correction kept in this tab. Voice R2 was marked reviewed. Every Source Revision and prior Correction remains retained. Nothing was persisted.

### 6.2 Display newest upstream revision

Preview copy:

> Voice R2 will become displayed. Correction 1 will remain retained as Historical; it is not deleted. Voice R1 and Voice R2 remain unchanged.

One settled Display-newest effect:

- displays exact Voice R2;
- changes C1's derived display status to Historical without editing or deleting C1;
- leaves R1, R2, and C1 bytes and metadata immutable;
- creates no Correction;
- creates exactly one bounded resolution event at **18 August 2026 · 9:08 am IST**.

Success copy:

> Voice R2 displayed in this tab. Correction 1 remains retained as Historical; it was not deleted. Nothing was persisted.

### 6.3 Create a new Correction based on both

Preview copy:

> A manual workspace will open with both versions visible. The editor starts with Correction 1 only. No VoiceNotes text is inserted or merged. The conflict remains unresolved until a new Correction is saved.

Confirming the preview only opens the manual workspace. It is not a resolution effect.

The workspace h1 is **Create a new Correction based on both** and begins with:

> Use both versions as references. The editor starts with the displayed Correction only. Nothing from VoiceNotes is inserted or merged.

It shows complete, read-only C1 and R2 references and one textarea labeled **New displayed Correction**. The textarea is initialized byte-for-byte to C1 and contains zero characters inserted from R2. The helper is:

> This changes only what Life in Days displays. Every Source Revision and prior Correction remains retained.

The actions are **Cancel new Correction** then **Save new Correction**. The editor must contain non-whitespace text that differs byte-for-byte from both C1 and R2 before Save is enabled. The approved C2 above is the canonical success draft. Save binds C2 directly to immutable R2 and records immutable C1 lineage; it is not an algorithmic merge.

One settled manual effect:

- appends exactly C-VOICE-2 with exact approved text;
- records **Archive owner · simulated** and **18 August 2026 · 9:10 am IST**;
- records base **Voice R2** and lineage **Correction 1**;
- displays C2;
- makes C1 Historical without deletion or mutation;
- leaves Voice R1, Voice R2, and C1 immutable;
- creates exactly one bounded resolution event.

Success copy:

> New Correction displayed in this tab. It is based on Voice R2 with Correction 1 lineage. Every Source Revision and prior Correction remains retained. Nothing was persisted.

## 7. Preview-dialog contract

Activating any outcome opens a modal consequence preview. No data changes on open, close, Escape, outside-click handling, viewport change, or **Back to choices**.

DOM and focus order:

1. selected outcome heading;
2. exact affected facts **Affected Source Item** / **Before sleep — synthetic fixture** and **Journal Date** / **2 August 2026**;
3. the complete exact consequence;
4. facts labeled **Currently displayed**, **After this choice**, and **Retained facts**;
5. safe action **Back to choices**;
6. the same exact selected outcome action.

Initial focus is the heading; the dialog traps focus; Escape behaves as **Back to choices** and restores focus to the invoking card. The safe action precedes confirmation in DOM and visual order at every viewport. Confirmation disables all dialog actions synchronously and starts at most one intent.

The three preview headings and confirming actions are exactly the corresponding card labels. Every preview visibly names the exact affected Source Item and Journal Date above; neither fact is inferred from the background page. There is no generic **Confirm**, ambiguous **Continue**, preselected radio button, default card, or Enter-key effect from the page.

## 8. Validation and workspace exit

The exact validation and dirty-state copy is:

| Condition | Exact copy | Effect |
| --- | --- | --- |
| Empty or whitespace only | **Enter Correction text before saving.** | Save disabled; zero intent/effect |
| Exact C1 | **Change the displayed text before saving.** | Save disabled; use Keep instead |
| Exact R2 | **This text matches the newest VoiceNotes revision. Choose Display newest upstream revision instead.** | Save disabled; use Display newest instead |
| Valid differing text | **Unsaved changes · kept only while this page remains open.** | Save enabled |

Comparison is byte-for-byte after no hidden normalization; line endings are rendered consistently but user content is not silently trimmed, autocorrected, merged, or reformatted. Whitespace-only is the sole normalization used for empty validation.

**Cancel new Correction**, in-app navigation, Back, and reload from a dirty workspace invoke the inherited unsaved-Correction warning:

- heading **Leave with an unsaved Correction?**
- body **This Correction is kept only in this open page. Leaving or reloading will discard it.**
- actions **Keep editing** then **Discard Correction and leave**

Discard returns to the unresolved conflict or the requested safe route as applicable and creates no event. Clean workspace cancellation returns to the unresolved conflict without a warning.

Session expiry never invokes this warning. It immediately clears the volatile draft and shows the generic **Session ended** destination governed by §13.

## 9. Deterministic display and immutable history

For one isolated fixture generation, exactly these cardinalities are legal:

| State | Revisions | Corrections | Resolution events | Displayed |
| --- | ---: | ---: | ---: | --- |
| Unresolved baseline | 2 | 1 | 0 | C1 |
| Cancelled review | 2 | 1 | 0 | C1 |
| Keep settled | 2 | 1 | 1 | C1 |
| Display-newest settled | 2 | 1 | 1 | R2 |
| Manual C2 settled | 2 | 2 | 1 | C2 |

There is never a state with two displayed values. The displayed selector is a pure, total function of the accepted terminal:

1. unresolved or cancelled → C1;
2. Keep → C1;
3. Display newest → R2;
4. based on both saved → C2.

R1 and R2 are immutable Source Revisions. C1 and C2 are immutable Correction records. Current, Historical, reviewed, and displayed are derived presentation facts from the single resolution event; they never authorize byte mutation. The source-card terminal shows bounded author/time/base/lineage/outcome facts. A full history browser, editing history, deletion, or restoration of these v16 events is not introduced in v16.

## 10. State machine and one-effect guard

Named states:

- source-card-conflict;
- review-loading;
- review-load-failed;
- review-ready-complete;
- review-ready-changes;
- preview-keep;
- preview-display-newest;
- preview-based-on-both;
- workspace-clean;
- workspace-invalid;
- workspace-dirty;
- resolution-pending;
- resolution-failed-known-zero;
- resolution-unknown;
- reconciling;
- stale-r3;
- resolution-settled;
- session-ended.

Allowed high-level transitions:

| From | Event | To | Effect |
| --- | --- | --- | --- |
| source-card-conflict | Open review | review-loading → ready or load-failed | none |
| ready | Change view / expand unchanged | ready | none |
| ready | Cancel / Back | source-card-conflict | none |
| ready | Select outcome | matching preview | none |
| preview | Back / Escape | ready | none |
| preview Keep or Display | Confirm | resolution-pending | begin one guarded intent |
| preview based-on-both | Confirm | workspace-clean | none |
| workspace | Edit | clean, invalid, or dirty | none |
| workspace | Save valid differing C2 | resolution-pending | begin one guarded intent |
| pending | Known-zero failure | failed-known-zero | no accepted effect |
| pending | Result lost | resolution-unknown | effect not assumed |
| failed-known-zero | Retry | pending | same intent only |
| unknown | Check resolution status | reconciling | read-only |
| reconciling | zero | failed-known-zero | no accepted effect |
| reconciling | one matching complete result | resolution-settled | adopt; no write |
| reconciling | still unknown | resolution-unknown | no write |
| ready/preview/workspace/pre-acceptance pending | R3 arrives before compare-and-accept | stale-r3 | represent immutable R3 revision; zero resolution effect/event |
| post-acceptance result-unknown/reconciling | R3 is observed | same unknown/reconciling state | reconcile the original intent before representing R3 |
| post-acceptance result-unknown/reconciling | matching accepted result is found | resolution-settled | adopt one effect; only then represent a new R3 conflict |
| settled | duplicate/replay/navigation | settled | none |

Outcome choice, reviewed snapshot, expected displayed C1, expected newest R2, and intent are captured atomically before a resolution effect. The compare-and-accept guard rejects a changed displayed record, changed newest revision, already-settled conflict, mismatched outcome, mismatched intent, or incomplete result.

## 11. Loading, failure, retry, and reconciliation copy

Exact copy:

| State | Exact copy/action |
| --- | --- |
| Loading | **Loading source update** / **Loading the complete displayed Correction and newest VoiceNotes revision.** |
| Load failure | **Source update could not be loaded. The displayed Correction remains unchanged. Retry.** / **Retry loading** |
| Pending | **Resolving source update** |
| Known-zero failure | **Conflict not resolved. The displayed Correction and every Source Revision remain unchanged. Retry.** / **Retry resolution** |
| Unknown result | **Resolution result unknown. Check resolution status before trying again.** / **Check resolution status** |
| Reconciling | **Checking resolution status** |
| Reconciled zero | **No resolution was found for the original intent. The source update remains unresolved. Retry.** / **Retry resolution** |
| Reconciled one | **Source update already resolved. No second resolution event was created.** |
| Connection loss before effect | **Connection interrupted. The source update remains unresolved. Nothing changed.** |
| C2 workspace connection loss | **Connection interrupted. Your draft remains in this open page. Nothing was saved.** |
| R3 stale snapshot | **A newer VoiceNotes revision arrived while this review was open. Nothing changed. Review the latest source update.** / **Review latest source update** |

Pending, unknown, and reconciling lock all outcome controls, dismissal controls, and in-app navigation. The UI never presents a different intent while the original is pending or unknown. Known-zero retry reuses the original intent and snapshot; it never creates a fresh intent. Reconciliation is read-only.

## 12. Concurrency and R3

The frozen R3 race revision is represented at **18 August 2026 · 9:12 am IST** and has exact text:

~~~text
Rain settled against the balcony rail.
I moved the blue cup beside the lamp and read until the room grew quiet.
Before midnight, I opened the window for a few minutes, then closed it when the rain strengthened.
~~~

Rules:

- If R3 arrives before the compare-and-accept guard accepts an R2 outcome—including while the UI shows pre-acceptance **Resolving source update**—the R2 snapshot becomes stale and fails closed with zero R2 resolution mutation/event. The immutable R3 revision remains represented. **Review latest source update** opens a fresh complete C1/R3 snapshot.
- If compare-and-accept may already have succeeded but its result is lost or untrusted, the state is post-acceptance result-unknown rather than pre-acceptance pending. R3 cannot stale or replace that original intent: reconcile it first. A matching accepted R2 result is adopted exactly once; only then may a new conflict against R3 be represented.
- A trusted accepted R2 terminal remains exactly once when R3 arrives afterward. R3 is a new conflict generation and never reuses or reverses the R2 event.
- If two tabs confirm different R2 outcomes, the first accepted result wins. The losing tab becomes stale or reconciles to the winner and creates no effect.
- Duplicate matching success, late failure after success, late success after known-zero retry, rapid repeat, Back/Forward replay, and restored page callbacks are idempotent no-ops after one accepted terminal.
- A source update with no saved/current Correction is not this conflict. It must not fabricate C1 or show the three v16 outcomes.

R3 is itself an immutable upstream Source Revision append, not a v16 resolution effect. Its deterministic cardinality is:

| R3 timing | Revisions | Corrections | Resolution events | Displayed value | New unresolved generation |
| --- | --- | --- | --- | --- | --- |
| Before R2 acceptance | R1, R2, R3 | C1 | 0 | C1 | C1/R3; R2 intent stale |
| After accepted Keep | R1, R2, R3 | C1 | 1 Keep | C1 | C1/R3 |
| After accepted Display newest | R1, R2, R3 | C1 | 1 Display newest | R2 | R2/R3 |
| After accepted Based on both | R1, R2, R3 | C1, C2 | 1 Based on both | C2 | C2/R3 |

Every prior revision, Correction, and accepted R2 terminal remains retained and unchanged. Representing R3 never adds a resolution event, automatically displays R3, or reuses the R2 intent.

## 13. Navigation, connection, and session

- Cancel restores the exact day, launch control, and scroll offset with the conflict still visible.
- Browser Back from ready review is non-resolving navigation. Forward may restore a fresh read-only review but cannot replay a preview or effect.
- Back/Forward after success shows the accepted terminal or recomputed source card; it never resurrects the conflict generation or fires an effect.
- Reload during a ready review re-derives the unresolved fixture. Reload never treats a preview as confirmed.
- A dirty C2 reload uses the inherited warning where the platform permits it; choosing leave discards volatile text and creates no event.
- Simulated connection interruption before acceptance is known zero. Interruption after submission with no trusted result is unknown.
- Exact session terminal is **Session ended** / **Sign in again to return to Life in Days. Unsaved Correction text was not retained.**
- Session expiry creates no resolution event and never erases a resolution that may already have been accepted. Expiry during pre-acceptance pending invalidates the pending callback; returning recomputes U0 with zero events and does not auto-resume or create a new intent.
- Expiry during post-acceptance result-unknown preserves the authority of the original intent without exposing outcome detail on the generic session route. Returning reconciles that intent read-only before any new intent: zero returns U0; one adopts exactly one matching K, D, or B terminal. Private draft text is never restored.
- There are no real requests, accounts, authentication, offline queue, background sync, or durable storage in this prototype.

## 14. Focus, announcements, keyboard, and responsive behavior

- Every interactive element is native or exposes equivalent name, role, state, and keyboard behavior.
- Workbench initial focus is its h1; the complete private documents are not injected into a live region.
- View controls expose selected state and preserve focus.
- Preview dialogs trap focus, support Escape, and restore the invoker.
- Pending is announced once with a short status; known-zero, unknown, stale, and terminal outcomes receive one short assertive/error or polite/success announcement as appropriate. Announcements never repeat private source or draft text.
- After known-zero failure, focus moves to the error heading; after terminal success, focus moves to the Source Item card heading.
- Validation associates exact errors with the textarea and focuses the first invalid control after an attempted save.
- All controls remain reachable in logical DOM order at keyboard-only, 200% text zoom, and 400% page reflow.
- Compact controls have a minimum 44×44 CSS-pixel target; metadata is at least 13 CSS pixels.
- Normal text targets at least 4.5:1 contrast; large text targets at least 3:1; UI boundaries and focus indicators target at least 3:1.
- Final QA measures rather than assumes every v16 light/dark token combination: ordinary text/background, conflict and difference label/surface, error and validation, selected and unselected controls, disabled controls, dialog and input boundaries, and focus indicators. Each applicable combination meets the preceding numeric target and its measured ratio is recorded.
- At 320 CSS pixels and 400% reflow, there is no horizontal page overflow, clipping, overlap, or inaccessible action.
- Wide comparison uses two columns only at 1024 CSS pixels or wider. Compact comparison uses the full-document switcher, never cramped parallel columns.
- Reduced motion removes nonessential animation. Forced-colors mode preserves borders, focus, selected state, dialog bounds, and difference labels.
- Amber indicates conflict, rose indicates Correction-only text, sage/forest indicates revision-only text, paper-soft dashed styling indicates unchanged sections, and the inherited v15 focus treatment remains. Text labels carry meaning without color.
- No new icon, palette, font, illustration language, or token family is introduced.
- These deterministic measurements are prototype evidence, not a formal WCAG conformance claim.

## 15. Privacy and inert-content contract

Only synthetic fixtures are permitted. Real/derived photos, VoiceNotes content, uploaded files, private notes, or user identifiers never enter the prototype.

The prototype makes zero network requests after the approved local load, writes zero cookies/localStorage/sessionStorage/IndexedDB/cache/OPFS/clipboard entries, registers zero service workers, and emits zero analytics or telemetry. Source text, Correction text, titles, dates, author, intent identities, outcome selection, draft text, and conflict identities do not enter URL path/query/hash, document title, history payload, console, exceptions, logs, DOM identifiers, accessible names for unrelated controls, or live regions.

Visible synthetic text may exist only in the currently visible document/workspace DOM. Closing or leaving removes draft and hidden inactive content rather than parking it in visually hidden DOM. Hostile-looking text is rendered as text: no HTML execution, Markdown rendering, link activation, image request, script, style, event handler, bidi control effect, or clipboard side effect.

The exact prototype disclosure is:

> Prototype data · represented conflict-resolution records only. Nothing is persisted, encrypted, or sent over the network.

The exact derived-field disclosure is:

> Generated fields and artwork were not refreshed in this prototype. Their lifecycle remains outside v16.

## 16. Strict v17+ exclusions

v16 does not add or imply:

- real VoiceNotes, Telegram, upload-provider, cloud, background-sync, polling, webhook, or API integration;
- durable persistence, encryption at rest, backup, restore, offline mutation, account/session implementation, deployment, or production monitoring;
- AI, automatic merge, suggested merge, semantic diff, grammar rewrite, summarization, coaching, or generated field/artwork refresh;
- editing or deleting Source Revisions or prior Corrections;
- undoing a resolution, restoring a prior Correction, or a complete History browser;
- conflict batching, bulk resolution, conflict notifications, reminders, collaboration, sharing, public links, roles, multi-owner records, or cross-device concurrency;
- resolutions for sources with no current Correction, generated content, photos, titles, summaries, tags, or captions;
- arbitrary Source Revision selection, version pinning, source-version deletion, or non-conflict revision management;
- a fourth outcome, “accept all,” automatic newest-wins rule, destructive overwrite, or hidden default;
- production privacy, security, accessibility, or data-retention claims.

These are v17-or-later discovery items unless separately governed.

## 17. Executable proof and stop conditions

Independent QA must start from zero on the exact held candidate and execute every E, A, V, K, D, B, F, Q, R, N, and S case in the linked fixture ledger. It must also compare all 22 required frames against the frozen roster below, verify exact copy and fixture literals, inspect keyboard/focus/live-region behavior, run 200% and 400% zoom/reflow checks, and prove the privacy/network/storage baseline.

Stop and return to Council if:

- any outcome or copy differs from this document;
- C1, R1, or R2 bytes or metadata change;
- Cancel or Back resolves the conflict;
- any outcome skips its preview;
- C2 is prefilled with R2 content or equals C1/R2;
- more than one resolution event or C2 can settle;
- unknown result permits a new intent before reconciliation;
- R3 does not invalidate the stale snapshot;
- complete text is unavailable;
- private values enter forbidden surfaces;
- an inherited v6–v15 frame or contract changes;
- a v17+ exclusion appears.

No implementation-complete or QA-approved claim is valid until all executable cases and artifacts pass on one held candidate with provenance recorded by the parent project workflow.

## 18. Frozen 22-frame roster

The same table appears byte-for-byte in [SOURCE-CONFLICT-FIXTURES-v16.md](./SOURCE-CONFLICT-FIXTURES-v16.md).

| # | Exact basename | Viewport | Theme | Required proof |
| ---: | --- | --- | --- | --- |
| 01 | `v16-01-source-update-launch-light.png` | 1440×900 | Light | Persistent conflict entry on the corrected Source Item |
| 02 | `v16-02-complete-conflict-review-dark.png` | 1440×900 | Dark | Complete C1/R2 side-by-side review |
| 03 | `v16-03-changes-only-expanded-light.png` | 1440×900 | Light | Text-labeled changes, omission count, unchanged section expanded |
| 04 | `v16-04-long-complete-comparison-dark.png` | 1440×900 | Dark | Long inert complete documents with no nested-scroll trap |
| 05 | `v16-05-keep-preview-light.png` | 1280×720 | Light | Keep consequence preview |
| 06 | `v16-06-keep-success-dark.png` | 1280×720 | Dark | C1 displayed, R2 reviewed, one bounded event |
| 07 | `v16-07-display-newest-preview-light.png` | 1280×720 | Light | Display-newest consequence and no-deletion copy |
| 08 | `v16-08-display-newest-success-dark.png` | 1280×720 | Dark | R2 displayed, C1 Historical and retained |
| 09 | `v16-09-based-on-both-preview-light.png` | 960×900 | Light | Manual-workspace/no-auto-merge preview |
| 10 | `v16-10-based-on-both-workspace-dark.png` | 960×900 | Dark | Complete C1/R2 references; editor prefilled only with C1 |
| 11 | `v16-11-manual-draft-light.png` | 960×900 | Light | C2 differs from C1/R2; dirty state |
| 12 | `v16-12-new-correction-success-dark.png` | 960×900 | Dark | C2 displayed; R2 base and C1 lineage visible |
| 13 | `v16-13-cancel-unresolved-light.png` | 700×900 | Light | Returned source card; conflict still present; zero event |
| 14 | `v16-14-resolution-pending-dark.png` | 700×900 | Dark | Named pending state with outcomes/dismissal locked |
| 15 | `v16-15-resolution-failure-light.png` | 700×900 | Light | Known-zero failure and same-intent Retry |
| 16 | `v16-16-resolution-unknown-dark.png` | 700×900 | Dark | Unknown result and Check resolution status |
| 17 | `v16-17-unsaved-workspace-200pct-light.png` | 640×900 at 200% text zoom | Light | Unsaved C2 warning and ordered actions |
| 18 | `v16-18-r3-race-200pct-dark.png` | 640×900 at 200% text zoom | Dark | R3 race fails closed; Review latest source update |
| 19 | `v16-19-stacked-diff-mobile-light.png` | 390×844 | Light | Compact full-document switcher and change labels |
| 20 | `v16-20-mobile-outcomes-cancel-dark.png` | 390×844 | Dark | All three outcome activators visible; separate unresolved Cancel asserted in the same mobile state |
| 21 | `v16-21-preview-landscape-light.png` | 568×320 landscape | Light | Complete consequence and safe/confirm actions reachable |
| 22 | `v16-22-long-diff-400pct-dark.png` | 320×900 at 400% page reflow | Dark | Long comparison/action path without clipping or horizontal page overflow |
