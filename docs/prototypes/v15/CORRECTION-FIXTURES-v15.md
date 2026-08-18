# Life in Days prototype v15 — Correction fixture sheet

Date: 2026-08-17
Package: **PVA-010 Correction Editor**
Status: **Council Approved · implementation/QA executable**

This sheet is subordinate to the [v15 Product Council contract](./COUNCIL-v15.md). It fixes the deterministic fictional data, actions, callbacks, outcomes, and exact 22-frame evidence roster for implementation and independent QA.

## Fixture boundary

All names, journal text, identifiers, revisions, authors, and times in this sheet are synthetic. No real/private journal content, filename, photo, account identity, provider value, or production identifier is permitted.

V15 covers only:

- audit gap 5's Correction-editor portion;
- the frontend-prototype portion of **LID-SRC-001**;
- Source Item-bound text Corrections against one completely visible selected base revision;
- guarded create, update, and removal with zero-or-one represented outcomes;
- author/time, unsaved, failure, Retry, unknown-result reconciliation, rapid/replay/stale/base-race, connection, session, focus/history, privacy, accessibility, and responsive behavior.

V15 does not implement a source-conflict diff, upstream resolution, redating, complete History, export/restore reconstruction, durable storage, backend idempotency, authentication, deployment, or production behavior.

The sole permitted closure is:

> **V15 prototype-represents Source Item-bound text Corrections, immutable base-revision visibility, simulated author/time, guarded create/edit/removal, unsaved-warning, failure/retry/race/session behavior, and retained Correction records using deterministic fictional browser state. Source storage, durable Correction persistence, upstream reconciliation, conflict resolution, redating, complete history/export/restore reconstruction, backend idempotency, encryption, authentication, deployment, and production readiness remain unverified.**

## Shared deterministic environment

| Fact | Exact fixture value |
| --- | --- |
| Locale | `en-IN` |
| Journal Date timezone | `Asia/Kolkata` |
| Page title | **Life in Days** |
| Starting route | August 2026 Calendar unless a case names a Journal Day |
| Starting connection | Connected |
| Starting session | Active |
| Browser stores | Empty; remain empty |
| Service worker | None |
| External requests | None |
| AI/provider requests | None |
| Author | **Archive owner · simulated** |
| Voice create time | **13 August 2026 · 10:06 pm IST** |
| Uploaded create time | **13 August 2026 · 10:07 pm IST** |
| Uploaded update time | **13 August 2026 · 10:08 pm IST** |
| Uploaded removal time | **13 August 2026 · 10:10 pm IST** |

The visible clock values are fixed literals. Browser/device time does not change them.

## Canonical source and Correction inventory

### S-VOICE — eligible Voice Journal

| Fact | Exact value |
| --- | --- |
| Journal Date | 2 August 2026 |
| Fixture handle | `v-02` |
| Source type | **Voice Journal** |
| Visible source title | **Before sleep — synthetic fixture** |
| Selected base | **Voice R1** |
| Current competing revision | None |
| Starting Correction | None |
| Create intent | `intent-v15-voice-create-01` |
| Settled Correction | `C-VOICE-1` |
| Settled author/time | **Archive owner · simulated** · **13 August 2026 · 10:06 pm IST** |

Exact base text `VOICE-R1-TEXT`:

```text
Rain settled against the balcony rail.
I put the blue cup beside the lamp and read until the room felt quiet.
```

Exact valid differing draft `VOICE-C1-TEXT`:

```text
Rain settled against the balcony rail.
I put the blue cup beside the lamp, then read until the room felt quiet.
```

### S-UPLOAD — eligible Uploaded Journal

| Fact | Exact value |
| --- | --- |
| Journal Date | 8 August 2026 |
| Fixture handle | `u-08` |
| Source type | **Uploaded Journal** |
| Visible source title | **quiet-saturday.md** |
| Selected base | **Uploaded R1** |
| Current competing revision | None |
| Starting Correction | None unless a case requests the C1 baseline |
| Create intent | `intent-v15-upload-create-01` |
| Update intent | `intent-v15-upload-update-01` |
| Removal intent | `intent-v15-upload-remove-01` |
| C1 author/time | **Archive owner · simulated** · **13 August 2026 · 10:07 pm IST** |
| C2 author/time | **Archive owner · simulated** · **13 August 2026 · 10:08 pm IST** |
| Removal author/time | **Archive owner · simulated** · **13 August 2026 · 10:10 pm IST** |

Exact base text `UPLOAD-R1-TEXT`:

```text
Saturday stayed quiet.
I sorted the postcard box before dinner.
```

Exact create draft `UPLOAD-C1-TEXT`:

```text
Saturday stayed quiet.
I sorted the postcard box slowly before dinner.
```

Exact update draft `UPLOAD-C2-TEXT`:

```text
Saturday stayed quiet.
I sorted the postcard box slowly, then made tea before dinner.
```

The C1 baseline displays `UPLOAD-C1-TEXT`, remains bound to **Uploaded R1**, and retains its author/time metadata. A successful update appends C2; it does not overwrite C1.

### S-LONG — compact/reflow stress fixture

| Fact | Exact value |
| --- | --- |
| Journal Date | 9 June 2026 |
| Fixture handle | `u-june-09` |
| Source type | **Uploaded Journal** |
| Visible source title | **a-quiet-morning-with-a-deliberately-long-synthetic-filename-for-reflow.md** |
| Selected base | **Uploaded R1** |
| Competing revision | None |

Exact long base text `LONG-R1-TEXT`:

```text
The first synthetic paragraph stays deliberately long so the read-only base must wrap without hiding its label, source facts, or the editor below it. The words describe no real person, place, account, photograph, or private event.

The second synthetic paragraph includes literal inert characters: <article data-fixture="not-markup">& sample</article>. They must remain readable text. They must not become an element, link, request, event handler, style, script, image, or interpreted Markdown.

The third synthetic paragraph repeats the accessibility requirement: complete base text, complete draft text, status, and every action remain reachable at mobile width, 200 percent text zoom, and 400 percent page reflow.
```

Exact long differing draft `LONG-C1-TEXT` is `LONG-R1-TEXT` plus this final paragraph:

```text

This final fictional paragraph is the deliberate Correction difference and remains only in the open page until the represented save settles.
```

Fixture handles and intent identities are ledger-only. The product UI, URL, title, history payload, live region, console, and network must never expose them.

## Exact controlled copy ledger

| Purpose | Exact copy |
| --- | --- |
| Entry/heading | **Correct displayed text** |
| Base label | **Source revision used as base · read only** |
| Editor label | **Displayed Correction** |
| Helper | **This changes only what Life in Days displays. The Source Item and base revision remain unchanged.** |
| Dirty | **Unsaved changes · kept only while this page remains open.** |
| Save | **Save Correction** |
| Saving | **Saving Correction** |
| Active badge | **Correction displayed · prototype only** |
| Update | **Update displayed Correction** |
| Remove launch | **Remove displayed Correction** |
| Save failure | **Correction not saved. Your draft remains in this open page. The Source Item and base revision are unchanged.** |
| Save Retry | **Retry saving** |
| Save success | **Correction displayed in this tab. The Source Item and base revision are unchanged. Nothing was persisted.** |
| Base race | **Source changed before this Correction was saved.** |
| Conflict handoff | **Review source update** |
| Removal success | **Source revision displayed. The earlier Correction remains retained as historical in this tab. Nothing was persisted.** |

Council-frozen additional literals:

| Purpose | Exact copy |
| --- | --- |
| Whitespace | **Enter Correction text before saving.** |
| Unchanged | **Change the displayed text before saving.** |
| Connection | **Connection interrupted. Your draft remains in this open page. Nothing was saved.** |
| Unknown save | **Save result unknown. Check save status before trying again.** |
| Check/save stage | **Check save status** / **Checking save status** |
| Save already complete | **Correction already displayed. No second Correction was created.** |
| Removal progress | **Removing displayed Correction** |
| Removal failure | **Correction not removed. The displayed Correction remains unchanged. Retry.** |
| Removal Retry | **Retry removing** |
| Unknown removal | **Removal result unknown. Check removal status before trying again.** |
| Check/removal stage | **Check removal status** / **Checking removal status** |
| Removal already complete | **Source revision already displayed. No second removal event was created.** |
| Session heading | **Session ended** |
| Session body | **Sign in again to return to Life in Days. Unsaved Correction text was not retained.** |

Exact unsaved dialog:

- **Leave with an unsaved Correction?**
- **This Correction is kept only in this open page. Leaving or reloading will discard it.**
- **Keep editing**
- **Discard Correction and leave**

Exact removal dialog:

- **Remove displayed Correction?**
- **The selected source revision will be displayed again. This Correction remains retained as historical. The Source Item and source revisions are unchanged.**
- **Keep Correction**
- **Remove displayed Correction**

## Baseline archive assertions

Before each isolated case unless the case says otherwise:

| Fact | Expected baseline |
| --- | --- |
| S-VOICE Source Item | Present and unchanged |
| Voice Source Revisions | Exactly Voice R1 |
| Voice Corrections | 0 |
| S-UPLOAD Source Item | Present and unchanged |
| Uploaded Source Revisions | Exactly Uploaded R1 |
| Uploaded Corrections | 0, or exactly C1 for an update/removal case |
| Displayed value | Selected base, or C1 for an update/removal case |
| Historical Corrections | 0 unless an update/removal terminal names one |
| Journal Dates | 2 August, 8 August, and 9 June fixture dates unchanged |
| Other Source Items | Frozen inherited baseline, unchanged |
| Browser stores/network | Empty / zero requests |

Every case resets to its named baseline. A prior case cannot authorize, seed, or satisfy a later case.

## Eligibility and entry fixtures

| ID | Setup and event | Required result |
| --- | --- | --- |
| E1 | S-VOICE clean card; activate **Correct displayed text**. | Editor opens for only S-VOICE; title/type/date/timestamp and complete Voice R1 are visible; draft begins as `VOICE-R1-TEXT`. |
| E2 | S-UPLOAD clean card; activate **Correct displayed text**. | Editor opens for only S-UPLOAD; filename/type/date/timestamp and complete Uploaded R1 are visible; draft begins as `UPLOAD-R1-TEXT`. |
| E3 | Calendar/global shell without a selected Source Item. | No global/blank **Correct displayed text** entry exists. |
| E4 | Daily Photo, Generated Artwork, title, summary, tag, or caption region. | No v15 Correction launch exists. |
| E5 | S-UPLOAD C1 baseline; activate **Update displayed Correction**. | Update editor opens with Uploaded R1 as base and C1 as initial draft; C1 metadata is visible. |
| E6 | S-UPLOAD C1 baseline; activate **Remove displayed Correction**. | Exact removal dialog opens for only C1 and its exact Uploaded R1 base. |
| E7 | Simulate a source with no complete selected base. | No editor opens; no draft/effect/record is created. |
| E8 | Simulate a source already carrying a competing revision. | Successful v15 editor path is unavailable; **Review source update** is the only applicable handoff; no text is auto-inserted. |

Entry focus returns to the exact invoking control when the dialog closes without a settled card change. Where a settled result replaces that control, focus moves to the logical corrected/restored source-card heading.

## Editor anatomy fixtures

| ID | Assertion |
| --- | --- |
| A1 | Reading order is heading, source facts, complete read-only base, editor, state, actions. |
| A2 | Wide editor is bounded at 760 CSS pixels without forcing a narrow text measure. |
| A3 | Base label is exactly **Source revision used as base · read only**. |
| A4 | Base is complete, selectable, inert, and not editable or collapsed. |
| A5 | Editor label is exactly **Displayed Correction**. |
| A6 | Helper is exact and remains adjacent at all viewports. |
| A7 | Pristine editor has no unsaved warning and **Save Correction** is disabled. |
| A8 | First differing input makes **Save Correction** enabled and shows the exact dirty status without moving focus/selection. |
| A9 | Source identity, base identity, and draft remain associated with only the invoking Source Item. |
| A10 | Cancel precedes **Save Correction** in DOM and visual order; compact stacking preserves order. |

## Validation fixtures

| ID | Draft/event | Exact visible result | Mutation |
| --- | --- | --- | --- |
| V1 | Empty string; activate save. | **Enter Correction text before saving.** | Zero |
| V2 | ASCII spaces only. | **Enter Correction text before saving.** | Zero |
| V3 | Tabs/newlines/non-breaking spaces only. | **Enter Correction text before saving.** | Zero |
| V4 | Exactly the currently displayed text. | **Change the displayed text before saving.** | Zero |
| V5 | Current text plus only a reversible input change, then undo to exact current. | Pristine state; save disabled; no error required. | Zero |
| V6 | `VOICE-C1-TEXT`. | Dirty status; save enabled. | Zero until save settles |
| V7 | `UPLOAD-C1-TEXT`. | Dirty status; save enabled. | Zero until save settles |
| V8 | `LONG-C1-TEXT`. | Complete long base/draft remain inert and reachable. | Zero until save settles |
| V9 | Paste literal `<img src=x onerror=fixture()> **not markdown**`. | Literal inert textarea text; zero interpreted DOM/request. | Zero |
| V10 | Valid draft while a new base revision is represented just before save. | **Source changed before this Correction was saved.** plus optional **Review source update** handoff. | Zero |

Validation never trims or silently normalizes a valid differing draft into another value. The whitespace predicate exists only to reject a text with no non-whitespace content. Source text and Source Revision are never changed.

## Create fixtures

### C1 — Voice create success

Setup:

- S-VOICE clean baseline;
- base Voice R1 / `VOICE-R1-TEXT`;
- draft `VOICE-C1-TEXT`;
- intent `intent-v15-voice-create-01`.

Events:

1. **OPEN_CREATE**;
2. input valid draft;
3. **Save Correction**;
4. **SAVE_STARTED**;
5. accept one matching **SAVE_SUCCEEDED** callback.

Required result:

| Fact | Before | After |
| --- | --- | --- |
| Source Item | S-VOICE | Same S-VOICE |
| Source Revisions | Voice R1 | Voice R1, unchanged |
| Corrections | 0 | Exactly C-VOICE-1 |
| Displayed text | `VOICE-R1-TEXT` | `VOICE-C1-TEXT` |
| Author | None | **Archive owner · simulated** |
| Created | None | **13 August 2026 · 10:06 pm IST** |
| Based on | None | **Voice R1** |
| Journal Date | 2 August 2026 | Unchanged |
| Terminal | None | **Correction displayed in this tab. The Source Item and base revision are unchanged. Nothing was persisted.** |

### C2 — Uploaded create success

Use S-UPLOAD clean baseline, Uploaded R1, `UPLOAD-C1-TEXT`, and `intent-v15-upload-create-01`. The same transition settles exactly C1 with **Archive owner · simulated**, **13 August 2026 · 10:07 pm IST**, and **Based on Uploaded R1**. Source bytes, filename, Source Item, Source Revision, Original Timestamp, and Journal Date stay unchanged.

### C3 — Cancel before save

Type a valid draft, activate Cancel, then choose **Discard Correction and leave**. Dialog closes; exact invoker/scroll returns; zero Correction exists; browser Forward cannot restore the draft.

### C4 — Escape/backdrop before dirty input

Open pristine editor, use Escape or backdrop in isolated runs. It closes directly, creates nothing, and restores the exact invoker. No unsaved dialog is needed for a pristine draft.

### C5 — inert-source create

Use a draft containing the V9 literal. Settle success. The Correction text renders as text on the card; there is no generated element, event, style, script, image, or request.

### C6 — no optimistic success

Hold the operation at **Saving Correction**. The source card, current text, author/time, and Correction count remain at baseline. No success announcement occurs before the one matching settled callback.

## Update fixtures

### U1 — existing C1 editor

Start S-UPLOAD with C1 displayed from the create fixture. Activate **Update displayed Correction**.

Required editor facts:

- source title **quiet-saturday.md**;
- complete **Uploaded R1** in the read-only base region;
- `UPLOAD-C1-TEXT` in the editor;
- C1 author **Archive owner · simulated**;
- C1 created **13 August 2026 · 10:07 pm IST**;
- C1 **Based on Uploaded R1**;
- pristine state until text differs.

### U2 — update success appends C2

Input `UPLOAD-C2-TEXT`, save with `intent-v15-upload-update-01`, and accept one matching success.

| Fact | Before | After |
| --- | --- | --- |
| Source/Revisions | S-UPLOAD / Uploaded R1 | Unchanged |
| Displayed Correction | C1 | C2 |
| C1 | Current | Retained historical |
| C2 | Absent | Current displayed |
| C2 author | Absent | **Archive owner · simulated** |
| C2 created | Absent | **13 August 2026 · 10:08 pm IST** |
| C2 based on | Absent | **Uploaded R1** |
| Record count | 1 | Exactly 2 |

U2 does not overwrite or relabel C1. The source card exposes only the currently displayed Correction plus bounded retained-history truth; it is not a complete History screen.

### U3 — unchanged update

Open U1 and activate save without changing `UPLOAD-C1-TEXT`. Save is disabled or yields **Change the displayed text before saving.** No C2 exists.

### U4 — failed update

Use valid `UPLOAD-C2-TEXT`, then return known zero. C1 remains displayed/current, C2 is absent, the draft remains in the page, and exact failure plus **Retry saving** appear.

### U5 — base race during update

After dirty input but before callback, inject represented Uploaded R2. The matching v15 operation fails closed: C1 remains displayed, no C2 exists, R2 text is never inserted, and **Source changed before this Correction was saved.** appears with **Review source update** as a v16 handoff.

## Removal fixtures

### D1 — exact confirmation

Start with S-UPLOAD C1 displayed. Activate **Remove displayed Correction**.

Required 520-pixel-bounded confirmation:

1. **Remove displayed Correction?**
2. **The selected source revision will be displayed again. This Correction remains retained as historical. The Source Item and source revisions are unchanged.**
3. **Keep Correction**
4. **Remove displayed Correction**

The safe action precedes the destructive action in DOM and visual order.

### D2 — Keep Correction

Activate **Keep Correction**. C1 remains current/displayed, Uploaded R1 remains its base, zero removal event exists, and exact invoker focus/scroll returns.

### D3 — removal success

Activate **Remove displayed Correction** with `intent-v15-upload-remove-01`; show **Removing displayed Correction**; accept one matching success.

| Fact | Before | After |
| --- | --- | --- |
| Source Item | S-UPLOAD | Unchanged |
| Source Revisions | Uploaded R1 | Uploaded R1, unchanged |
| Displayed text | `UPLOAD-C1-TEXT` | `UPLOAD-R1-TEXT` |
| C1 | Current/displayed | Retained historical |
| Removal event | Absent | Exactly one represented event |
| Event author | Absent | **Archive owner · simulated** |
| Event time | Absent | **13 August 2026 · 10:10 pm IST** |
| Terminal | Absent | **Source revision displayed. The earlier Correction remains retained as historical in this tab. Nothing was persisted.** |

### D4 — removal known zero

Return known zero. C1 remains displayed/current, Uploaded R1 remains unchanged, no removal event exists, and **Correction not removed. The displayed Correction remains unchanged. Retry.** plus **Retry removing** appear.

### D5 — removal unknown result

Lose the completion result. Keep the pre-operation displayed truth until reconciliation and show **Removal result unknown. Check removal status before trying again.** with **Check removal status**. Do not run a second removal.

### D6 — later revision before removal

Represent Uploaded R2 after confirmation but before effect acceptance. Removal fails closed: C1 stays displayed, neither R1 nor R2 is selected as a new display by v15, no removal event exists, and **Review source update** hands off to v16.

## Known-zero failure and connection matrix

| ID | Operation point | Fixture result | Required truth |
| --- | --- | --- | --- |
| F1 | Create before effect | Local validation failure. | No intent effect and no record. |
| F2 | Create save | Known zero. | Exact save failure; draft retained in page; source/base unchanged; Retry. |
| F3 | Update save | Known zero. | C1 still displayed; C2 absent; draft retained; Retry. |
| F4 | Removal | Known zero. | C1 still displayed; no removal event; exact removal failure; Retry. |
| F5 | Dirty editor, no effect | Connection lost. | Exact connection copy; draft retained in page; no queue or request. |
| F6 | Saving before any commit boundary | Connection fixture explicitly reports known zero. | Save failure semantics; no Correction; Retry uses same intent. |
| F7 | Saving after outcome certainty is lost | Result unknown. | Never claim known zero; expose status check. |
| F8 | Removal after outcome certainty is lost | Result unknown. | Never claim known zero; expose removal status check. |
| F9 | Connection restored | No user retry/status action. | No automatic resume, save, removal, success, or announcement. |
| F10 | Retry while still disconnected | Deterministic known-zero connection failure. | Same intent remains; no new effect or record. |

No failure creates an empty record, author/time row, historical entry, current badge, success terminal, or count change.

## Unknown-result reconciliation fixtures

### Q1 — save unknown reconciles to zero

1. Begin S-VOICE create with `intent-v15-voice-create-01`.
2. Lose the result and show exact unknown-save copy.
3. Activate **Check save status**.
4. Show **Checking save status**.
5. Reconcile zero.
6. Permit one guarded retry through the same intent.

Before the retry settles, Voice Correction count remains zero. A later matching success creates exactly one C-VOICE-1.

### Q2 — save unknown reconciles to one

Same setup, but reconciliation finds one complete C-VOICE-1. Show **Correction already displayed. No second Correction was created.** Adopt the exact author/time/base record. Do not execute another append.

### Q3 — save reconciliation remains unknown

Status check cannot settle. Remain in the unknown state with zero additional effects. Repeated status checks may repeat the read-only reconciliation, never the append.

### Q4 — removal unknown reconciles to zero

Start D5, check removal status, show **Checking removal status**, and reconcile zero. C1 stays displayed. One guarded removal retry may run through `intent-v15-upload-remove-01`.

### Q5 — removal unknown reconciles to one

Reconciliation finds one complete removal event. Display Uploaded R1, retain C1 historical, show **Source revision already displayed. No second removal event was created.**, and do not execute removal again.

### Q6 — removal reconciliation remains unknown

Remain blocked with C1 shown as pre-reconciliation displayed truth and zero additional effects. Do not guess current/newest source display.

## Rapid, replay, stale-callback, and base-race fixtures

| ID | Trigger | Expected result |
| --- | --- | --- |
| R1 | Double-click **Save Correction** in one task. | One intent/effect; at most one Correction. |
| R2 | Enter then click during saving. | Second activation ignored; actions remain locked. |
| R3 | Touch then synthetic click. | One effect. |
| R4 | Double-click **Retry saving**. | Same intent; one status/retry path; at most one result. |
| R5 | Replayed identical save-success callback. | First settles; later callback is a no-op. |
| R6 | Save failure callback arrives after matching success. | Settled one remains one; no regression to failure/zero. |
| R7 | Save success arrives after reset/generation change. | No-op; no Correction. |
| R8 | Save success carries another source/base/intent. | No-op; active source unchanged. |
| R9 | Rapid removal confirmation activation. | One removal intent/effect; at most one event. |
| R10 | Removal success callback replays. | One retained-history transition; no duplicate event. |
| R11 | Removal failure arrives after success. | Restored base/historical Correction remain settled. |
| R12 | Removal success arrives after a new upstream revision/generation. | No-op/fail closed; no revision auto-selected. |
| R13 | Two fresh editor flows are opened sequentially after the first terminal. | Second flow gets a new intent; earlier intent cannot authorize it. |
| R14 | Old editor input callback fires after a different Source Item opens. | No-op; no cross-source draft or record. |
| R15 | Base changes between validation and effect issue. | **Source changed before this Correction was saved.**; zero mutation. |
| R16 | Base changes between effect issue and callback. | Callback rejected; handoff to **Review source update**; no auto-merge. |

## Navigation, Back/Forward, focus, and history fixtures

| ID | Setup/event | Required behavior |
| --- | --- | --- |
| N1 | Open pristine editor; Escape. | Close directly; exact invoker/scroll restored; no record. |
| N2 | Dirty editor; Escape. | Exact unsaved dialog; no discard yet. |
| N3 | Dirty editor; backdrop. | Exact unsaved dialog. |
| N4 | Dirty editor; browser Back. | Exact unsaved dialog; requested history delta held. |
| N5 | N2–N4; **Keep editing**. | Same draft, selection, scroll, source, and base restored; held navigation canceled. |
| N6 | N2–N4; **Discard Correction and leave**. | Draft/intent cleared; requested destination completes; zero record. |
| N7 | Browser Forward after N6. | Discarded draft is not restored; no editor operation reruns. |
| N8 | Saving; Escape/backdrop/Back. | Does not dismiss or imply cancellation; named pending state remains visible. |
| N9 | Settled create; close terminal. | Focus corrected source-card heading/action; card truth already settled. |
| N10 | Back then Forward after settled create. | Restores settled route/card state without another save or announcement. |
| N11 | Removal confirmation; Escape. | Equivalent to **Keep Correction**; exact removal invoker returns. |
| N12 | Settled removal; close terminal. | Focus restored source-card heading; C1 remains represented historical. |
| N13 | Back/Forward after settled removal. | No second removal, no C1 resurrection as current, no repeated live announcement. |
| N14 | Source card disappears before focus return. | Focus nearest logical Journal Day heading, never `body` without explanation. |
| N15 | Validation error. | Error is associated with/focuses editor once; current selection remains usable. |
| N16 | Save/removal failure. | One logical failure/Retry anchor receives focus; no duplicate alert/toast/live message. |

Browser history payload contains only an opaque structural entry identity. It never contains source title/text, base, draft, Correction, fixture handle, intent, author/time, result, or focus selector derived from private data.

## Connection, reset, and session fixtures

| ID | Event | Expected result |
| --- | --- | --- |
| S1 | Connection lost while editor is dirty and no effect began. | Exact connection copy; draft remains only in this open page. |
| S2 | Connection restored after S1. | No automatic save; user must explicitly save. |
| S3 | Reset while dirty. | Generation increments; draft/intent/selection cleared; no record. |
| S4 | Reload while dirty. | No draft recovery from any browser store; source baseline returns. |
| S5 | Session expires while dirty. | Generic **Session ended** destination; exact generic body; no draft/source detail. |
| S6 | Session expires while save is pending. | Pending callback invalidated; generic destination; callback later is a no-op. |
| S7 | Session expires after settled success. | Settled in-memory fixture may reset; no claim of durability; session destination remains generic. |
| S8 | Reauthenticate from session destination. | Return to a generic structural route, not the private editor/draft. |
| S9 | Back/Forward around session destination. | Never recovers draft, source text, intent, or pending outcome. |
| S10 | Connection/session event emits a live message. | Message is generic and contains no source title/text/base/draft/identity. |

## Source-card, retained-history, and metadata assertions

| State | Required card truth |
| --- | --- |
| Clean source | Original source type/title; current base text; **Correct displayed text**. |
| C1 displayed | **Correction displayed · prototype only**; C1 text; **Author**, **Created**, **Based on**; update/remove actions. |
| C2 displayed | Same anatomy for C2; C1 retained historical in the fixture; no source/base mutation. |
| Removal pending | C1 remains displayed until a matching settled result. |
| Removal failed/unknown | C1 remains displayed; no historical transition claimed. |
| Removal succeeded | Uploaded R1 text displayed; C1 marked **Historical** in the bounded terminal/card representation. |
| Source race | Existing displayed truth remains; **Review source update** handoff; no automatic choice. |

**Historical** in v15 proves only the deterministic in-memory fixture's retained-record representation. There is no global/per-day History route, durable audit log, export relationship, restore reconstruction, or search-history proof.

## Privacy and browser-surface assertions

Inspect every applicable case before open, while pristine, dirty, pending, failed, unknown, reconciled, successful, after Back/Forward, after reset/reload, and after session expiry.

| Surface | Required assertion |
| --- | --- |
| Page title | Exactly **Life in Days**; no source/draft/status value. |
| URL/query/hash | Structural route only; no journal date if it encodes private task state, source, base, draft, Correction, intent, result, or focus. |
| History payload | Opaque structural entry identity only. |
| Local/session storage | Empty of every v15 value. |
| Cookies | No v15 value. |
| IndexedDB/Cache Storage | No v15 database/cache. |
| Service workers | None. |
| Clipboard/referrer | No v15 value. |
| Requests | Zero v15/external/provider/AI requests; no request body/query/header containing fixture data. |
| Console/logs | No source/base/draft/Correction/title/date/intent/author/time/result/focus value. |
| Analytics/telemetry/crash reports | None. |
| Product DOM identifiers | No raw fixture handle, intent, source title, base/draft excerpt, or author/time. |
| Live regions/toasts | Generic stage/outcome only; no source title/text, base, draft, identity, or author/time. |
| Browser stores after reload/session | Draft and pending operation unrecoverable. |

The literal hostile markup in S-LONG and V9 creates zero elements and zero requests. No source/base/draft text is sent to AI. Photo bytes, metadata, identifiers, captions, or derived descriptions remain absent from the entire v15 flow.

## Focus and live-region matrix

| State | Focus | Announcement |
| --- | --- | --- |
| Editor open | Heading when unclaimed, then editor available in sequence. | Dialog name only; no source text. |
| Dirty input | Editor and exact selection retained. | No per-keystroke announcement. |
| Whitespace/unchanged | Editor/error association. | Concise validation once. |
| Unsaved dialog | Heading or **Keep editing**; focus trapped. | Exact heading/body available through dialog description. |
| Saving | Deliberate focus retained or one status anchor. | **Saving Correction** once. |
| Save failure | Failure/Retry anchor. | One failure message; no duplicate toast. |
| Save unknown | **Check save status**. | Unknown result once; no success/failure assertion. |
| Save success | Terminal/status. | Generic completion once, without journal text/title. |
| Corrected card | Logical card heading/action after close. | No repeated success. |
| Remove dialog | Heading or **Keep Correction**; focus trapped. | Exact consequences available once. |
| Removing | Status anchor or deliberate focus. | **Removing displayed Correction** once. |
| Remove failure | Failure/**Retry removing** anchor. | One failure message. |
| Remove success | Terminal/restored card heading. | Generic restored-display completion once. |
| Back/Forward | Logical settled focus. | No operation replay announcement. |
| Session ended | Generic H1. | Generic session copy only. |

## Accessibility and responsive interaction matrix

Every applicable fixture is checked in light, dark, system theme, forced colors, and reduced motion.

| Group | Required assertions |
| --- | --- |
| Semantics | Native button/textarea, explicit label/description, ordered headings, dialog/`aria-modal`, busy/disabled state. |
| Keyboard | Tab/Shift+Tab containment, visible focus, Enter/Space one activation, Escape exact dirty/pending behavior. |
| Touch | No duplicate synthetic click; 24 × 24 absolute target floor; 44 × 44 preferred compact primary actions. |
| Contrast | Text, labels, boundaries, focus, error, current, historical, disabled, and busy meet inherited targets in light/dark/forced colors. |
| Color independence | Dirty, invalid, busy, failed, current, and historical have text/semantic cues. |
| Motion | Reduced motion removes nonessential transitions; no motion communicates required state. |
| Wide | 1440 × 900 and 1280 × 720 preserve 760-pixel editor hierarchy and 520-pixel confirmation. |
| Mid | 960 × 900 and 700 × 900 keep source facts, complete base/draft, metadata, errors, and actions reachable. |
| Text zoom | 640 × 900 at 200% preserves complete removal/session tasks without overlap. |
| Mobile | 390 × 844 stacks source, base, editor, status, and full-width actions in logical order. |
| Landscape | 568 × 320 keeps complete removal consequences and actions reachable. |
| Reflow | 320 × 900 at 400% page reflow has no horizontal page overflow, clipping, covered focus, or lost Retry. |
| Long text | Paragraphs wrap; inert literals remain text; editor/base scroll does not hide labels or actions. |
| Background | Inert and scroll-locked while modal opens; restoration does not jump unpredictably. |

## Exact evidence roster

These 22 basenames, dimensions/zoom conditions, themes, and depicted states are exact and Design-approved unchanged. Files belong in **docs/prototypes/v15/**.

| # | Exact file basename | Viewport / zoom | Theme | Required state |
| --- | --- | --- | --- | --- |
| 01 | `v15-01-source-card-launch-light.png` | 1440 × 900 | Light | Clean Voice Journal card with Source Item-bound launch. |
| 02 | `v15-02-new-editor-base-dark.png` | 1440 × 900 | Dark | New Voice Correction, complete read-only base, pristine editor. |
| 03 | `v15-03-uploaded-editor-light.png` | 1440 × 900 | Light | Uploaded identity, complete base, and editor. |
| 04 | `v15-04-dirty-draft-dark.png` | 1440 × 900 | Dark | Changed draft, base, exact unsaved status. |
| 05 | `v15-05-whitespace-validation-light.png` | 1280 × 720 | Light | Whitespace rejected; source unchanged. |
| 06 | `v15-06-unsaved-leave-dark.png` | 1280 × 720 | Dark | Exact unsaved leave and two actions. |
| 07 | `v15-07-saving-correction-light.png` | 1280 × 720 | Light | Saving, locked, and busy. |
| 08 | `v15-08-save-success-metadata-dark.png` | 1280 × 720 | Dark | Terminal success with author/time/base metadata. |
| 09 | `v15-09-corrected-source-card-light.png` | 960 × 900 | Light | Correction displayed with update/removal actions. |
| 10 | `v15-10-save-failure-dark.png` | 960 × 900 | Dark | Known-zero failure, draft retained, **Retry saving**. |
| 11 | `v15-11-connection-interrupted-light.png` | 960 × 900 | Light | Interruption, unsaved draft, nothing saved. |
| 12 | `v15-12-retry-saving-dark.png` | 960 × 900 | Dark | Retry with the same intent. |
| 13 | `v15-13-rapid-repeat-settled-light.png` | 700 × 900 | Light | Rapid-repeat path settled to exactly one Correction. |
| 14 | `v15-14-existing-correction-editor-dark.png` | 700 × 900 | Dark | Existing C1 editor with R1 visible. |
| 15 | `v15-15-remove-confirm-light.png` | 700 × 900 | Light | Exact removal consequences/action order. |
| 16 | `v15-16-remove-failure-dark.png` | 700 × 900 | Dark | Failure, Correction still displayed, **Retry removing**. |
| 17 | `v15-17-remove-success-retained-light.png` | 640 × 900 at 200% text zoom | Light | Source restored; earlier Correction **Historical**. |
| 18 | `v15-18-session-ended-draft-dark.png` | 640 × 900 at 200% text zoom | Dark | Generic session-ended destination; no draft. |
| 19 | `v15-19-long-editor-mobile-light.png` | 390 × 844 | Light | Long stacked sheet with reachable sticky actions. |
| 20 | `v15-20-unsaved-mobile-dark.png` | 390 × 844 | Dark | Compact unsaved dialog; full-width actions. |
| 21 | `v15-21-remove-landscape-light.png` | 568 × 320 landscape | Light | Removal consequences/actions reachable. |
| 22 | `v15-22-long-error-400pct-dark.png` | 320 × 900 at 400% page reflow | Dark | Long save failure and Retry; no clipping. |

Evidence acceptance requires:

- exactly 22 current-run RGB PNG files after final v15 UI hashes are held;
- exact basenames, dimensions/zoom conditions, and themes;
- 22 unique basenames and no stale/extra/superseded v15 PNG;
- repository bytes equal the inspected original-resolution bytes;
- original-resolution inspection of every frame;
- no state/copy/layout mismatch against the required row;
- complete regeneration after any v15 UI-byte change.

Screenshots are visual evidence only. They do not prove state transitions, focus, announcements, privacy, zero requests, storage absence, race guards, idempotency, regression, durability, or backend behavior.

## Independent QA execution matrix

Independent QA starts from zero on the exact held candidate and executes:

| Group | Required coverage |
| --- | --- |
| Shared facts | Locale/timezone/title/author/exact four timestamps and empty browser/network baseline. |
| Inventory | S-VOICE, S-UPLOAD, S-LONG; exact base/draft strings and identities. |
| Entry/eligibility | E1–E8. |
| Anatomy | A1–A10. |
| Validation | V1–V10. |
| Create | C1–C6. |
| Update | U1–U5. |
| Removal | D1–D6. |
| Failure/connection | F1–F10. |
| Unknown reconciliation | Q1–Q6. |
| Rapid/replay/race | R1–R16. |
| Navigation/focus/history | N1–N16. |
| Reset/session | S1–S10. |
| Card/history boundary | Every source-card and retained-history row. |
| Privacy | Every browser-surface assertion at every lifecycle phase. |
| Accessibility/responsive | Full matrix plus all 22 exact frames. |
| Static/package | Syntax and all v15 package checks on exact bytes. |
| Regression | Full inherited functional suite and byte-for-byte frozen v6–v14 artifacts/evidence. |
| Exclusions | No diff/conflict resolution, redating, complete History, durable storage, export/restore, auth, deployment, production, or real/private data. |

Pass means the exact deterministic candidate represents one Source Item-bound text Correction flow whose create, update, and removal outcomes remain zero or one; whose exact base and source never mutate; whose retained-history, author/time, unsaved, retry, race, session, privacy, focus, and responsive truths match this sheet; and whose inherited frozen behavior remains intact.

Pass does not verify source storage, durable Correction persistence, upstream reconciliation, conflict resolution, redating, complete History/export/restore reconstruction, backend idempotency, encryption, authentication, deployment, or production readiness.

Any v15 UI-byte change invalidates all 22 frames and the complete independent disposition. Independent QA must return unresolved **Critical 0, High 0, Medium 0, Low 0** and must not edit, repair, create evidence, stage, commit, freeze, push, or deploy the candidate it judges.
