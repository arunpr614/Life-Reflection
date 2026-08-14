# Life in Days prototype v11 — Product Council contract

Date: 2026-08-14
Package: `PVA-006 Needs Date Review`
Status: Approved for prototype implementation

## 1. Council and authority

- Product Manager: `/root/v11_product_manager` — Product gate **A**.
- UI/UX Designer: `/root/v11_ui_designer` — Design gate **A**.
- Project Manager / Council chair: `/root/v11_council_manager` — Council gate **A**.
- Implementing agent: `/root` — Implementation gate **IP**.
- Independent QA: a fresh agent must be created only after a stable v11 fingerprint exists — QA gate **—**.

Authority order is direct Arun decisions, the [PRD](../../product/PRODUCT-REQUIREMENTS.md), the [UX specification](../../design/UX-SPECIFICATION.md), the [v5 feature audit](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md), and the [prototype tracker](../../project/PROTOTYPE-COMPLETENESS-TRACKER.md). The frozen [v10 Council contract](../v10/COUNCIL-v10.md), [handoff](../CALENDAR-UI-PROTOTYPE-v10.md), and [independent QA](../../../design-qa-v10.md) are the inherited shell and regression contract.

The Product and Design gates agree on the package. Product's exact fixtures, user-facing copy, validation behavior, completion semantics, and closure statement control the few differing Design examples. Design's calm hierarchy, focused detail page, calendar picker, responsive rules, accessibility mechanics, privacy treatment, and visual language are retained.

## 2. Outcome and evidence boundary

V11 closes only audit gap 1 at the frontend-prototype level and represents the browser-facing portions of `LID-TG-006` and `LID-VN-004`. It adds a Needs Date Review holding queue, conditional unresolved count, four deterministic synthetic source cases, deliberate non-future date assignment, destination-effect preview, failure and retry, atomic in-memory success, and the final empty state.

The only permitted closure statement is:

> **Needs Date Review is prototype-represented with deterministic synthetic Telegram and VoiceNotes fixtures; capture, encryption, durable holding records, source timestamps, backend attachment, persistence, integration behavior, and idempotency enforcement remain unverified.**

The prototype may prove deterministic fictional browser behavior, layout, semantics, focus, and live-memory state transitions. It does not prove Telegram or VoiceNotes connectivity, receipt or retrieval behavior, source timestamps, encrypted preservation, a durable holding record, server-side date validation, database transactions, persistence, source attachment, integration behavior, or idempotency beyond the open prototype page.

`LID-SCP-002` remains open for v17 Atomic Redating. V11 assigns an unresolved held item for the first time; it does not represent moving an already dated Source Item.

## 3. Frozen dependency

V11 depends on the exact frozen v10 chain:

- implementation and evidence commit `ffabe0d`;
- documentation-only freeze record `497c98d`;
- final append-only tracker record `d3ef43a`.

The inherited v10 UI identity is immutable:

| Artifact | SHA-256 |
| --- | --- |
| `index-v10.html` | `9a8a1da6fc00ff4f694cb00dba3f5784168ab1a9d45b16ca680c410d6d330428` |
| `app-v10.js` | `5e0876d7e5ce91040b7b921a1a1fe10746304ae85f39c66f001166e56b8793ca` |
| `styles-v10.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `styles-v10-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `styles-v10-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |
| `styles-v10-resilience.css` | `d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c` |

No v6 through v10 prototype, Council, guide, handoff, QA, or evidence artifact may change. V11 must use newly numbered files and an additive date-review stylesheet where needed. Frozen behavior is inherited, not reimplemented as a replacement.

## 4. Domain and assignment invariants

1. Needs Date Review is a holding queue, not a Journal Day, Calendar, Almanac, Trash, inbox, warning centre, or source editor.
2. One unresolved Source Item equals one queue row, one card/article, and one count unit. The displayed count is always derived from the unresolved in-memory set.
3. A held item is absent from Calendar and Almanac until simulated assignment completes successfully.
4. The Journal Date field always opens blank. The prototype never preselects or suggests the invalid/future token, Telegram receipt time, VoiceNotes retrieval time, raw untrusted value, device date, or the prototype date.
5. A valid non-future date includes the prototype date itself. “Past-only” shorthand means 13 August 2026 or earlier.
6. Choosing a Journal Date changes only where the same Source Item appears. It never changes Original Timestamp, raw provenance, source content, Photo Caption, Voice Journal title, or source identity.
7. Cancel, Escape, Back, navigation, assignment failure, connection interruption, fixture reset, and session interruption never discard the unresolved item.
8. No optimistic resolution is permitted. Attaching the same Source Item, creating or reusing the destination Journal Day, recalculating counts/visibility/cover, removing the held item, and decrementing the queue count happen together only on simulated completion.
9. Rapid activation, replay, or a stale delayed completion can yield at most one represented result.
10. Reliable VoiceNotes creation timestamps, Telegram photos without an explicit leading date, and valid leading Telegram dates do not enter this queue.

## 5. Fixed clock and date validation

The prototype clock is fixed and deterministic:

- Prototype date: **13 August 2026**
- Journal timezone: **Asia/Kolkata**
- Required visible boundary: **Prototype date · 13 August 2026 · Asia/Kolkata**
- Accepted input grammar: exact Gregorian `YYYY-MM-DD`
- Accepted range: `0001-01-01` through `2026-08-13`, inclusive
- Device time, `Date.now`, browser locale, and device timezone must not determine validation or selection.

The validation contract is:

| Case | Result |
| --- | --- |
| Blank | `Choose a Journal Date.` |
| Malformed or impossible | ``<value> is not a valid Journal Date.`` |
| Later than 2026-08-13 | `Future Journal Dates are not supported. Choose 13 August 2026 or earlier.` |

Required passing boundaries are `2026-08-13`, `2026-08-10`, and leap date `2024-02-29`. Required failures are `2026-08-14`, `2026-02-29`, `2026-02-30`, and any year `0000` value.

The malformed/impossible message substitutes the exact entered value for `<value>`. The error is visibly and programmatically associated with the input.

## 6. Route, navigation, count, and privacy

The only new structural route value is `view=date-review`. No item identity, fixture, reason, source type, raw value, date choice, operation identity, focus target, count, or state is added to the URL.

### Wide navigation

- A quiet topbar action appears before Add journal only when the queue is settled and its derived count is greater than zero.
- Its visible label is **Needs date · N**.
- Its accessible name is **N items need a Journal Date**. An equally clear name such as “Needs Date Review, 4 unresolved items” is acceptable when N is also present visually.
- Loading or unknown state never renders an optimistic zero.
- Management or Settings retains an always-available Needs Date Review entry, including when the queue is empty or unknown.

### Compact navigation

- The four inherited bottom actions remain unchanged.
- More contains a conditional Needs Date Review shortcut after Add journal and before Settings only when the settled unresolved count is greater than zero.
- That shortcut carries the same derived count. Loading, unknown, and zero-item states do not render it.
- The always-available Needs Date Review destination remains reachable through Management or Settings even when the queue is empty or unknown.
- Removing the final item removes conditional count/shortcut UI without moving focus away from the resulting empty-state heading.

Browser title remains **Life in Days**. Browser history contains only the safe structural view and an opaque `entryId` whose details live in an in-memory map. The item identity is never stored in history payload.

No fixture, item, reason, source value, caption, title, chosen date, operation, focus selector, success, or failure state enters localStorage, sessionStorage, cookies, IndexedDB, Cache Storage, a service worker, clipboard, referrer, request, console, telemetry, analytics, or logs. V11 makes no integration, provider, server, or AI call. Existing theme and inherited safe preferences remain the only permitted inherited storage.

The global visible boundary is:

> **Prototype data · no persistence · no integrations connected**

## 7. Queue hierarchy and visual language

V11 retains the v10 warm-paper/deep-ink system, Georgia editorial headings, sans-serif UI, forest primary actions, amber attention, rose failure, divider-first hierarchy, and minimal elevation.

The queue is calm management, not a dashboard. Rows share one grouped surface and dividers rather than becoming a grid of warning cards.

Hierarchy is:

1. inherited prototype boundary and topbar;
2. eyebrow **Management**;
3. one H1 **Needs Date Review**;
4. exact intro and derived summary;
5. semantic list of unresolved Source Item articles.

The populated intro is:

> **These preserved items are not on the Calendar or Almanac until you choose a Journal Date.**

The initial summary is:

> **4 items need a Journal Date.**

Rows are sorted by oldest Added-to-review time and then by an opaque in-memory key. Each row presents, in order:

1. safe synthetic thumbnail or source title;
2. source type;
3. reason heading and exact reason;
4. Added-to-review time;
5. compact provenance;
6. **Preserved · not on the calendar**;
7. an action whose visible label is **Assign Journal Date** and whose accessible name adds only source type and reason, never title or caption.

Telegram thumbnails use only existing synthetic local assets and empty alternative text because adjacent text names the source type. VoiceNotes rows use their synthetic title without a journal-body excerpt.

## 8. Exact Product fixtures

These four fixtures and their order are controlling. Design alternatives must not replace their token, caption, title, provenance, reason, or outcome.

### 8.1 Telegram — invalid leading date

- Entered date: **2026-13-08**
- Original Timestamp — Telegram message: **12 Aug 2026 7:40 pm IST**
- Received by Life in Days: **12 Aug 2026 7:41 pm IST**
- Added to review: **12 Aug 2026 7:41 pm IST**
- Retained Photo Caption/raw remainder: **Monsoon light through the window**
- Exact reason: **The entered date 2026-13-08 is not a valid Journal Date. Telegram receipt time is shown only as provenance and has not been used.**
- Guided valid date: **2026-08-10**
- Destination before: no current Journal Day, 0 photos, 0 journals
- Destination after: visible Journal Day, 1 photo, 0 journals
- Cover result: the real Daily Photo becomes Calendar Cover.

### 8.2 Telegram — future leading date

- Entered date: **2026-08-20**
- Original Timestamp — Telegram message: **12 Aug 2026 8:16 pm IST**
- Received by Life in Days: **12 Aug 2026 8:17 pm IST**
- Added to review: **12 Aug 2026 8:17 pm IST**
- Retained Photo Caption/raw remainder: **A quiet street after rain**
- Exact reason: **The entered date 2026-08-20 is after the prototype date. Telegram receipt time has not been used.**
- Guided valid date: **2026-08-11**
- Destination before: visible Journal Day, 0 photos, 1 journal, labeled AI artwork
- Destination after: visible Journal Day, 1 photo, 1 journal
- Cover result: the real Daily Photo becomes Calendar Cover; existing AI artwork remains labeled in the gallery.

### 8.3 VoiceNotes — missing creation timestamp

- Source title: **Late train notes — synthetic fixture**
- Original Timestamp: **Unavailable from VoiceNotes**
- Retrieved and preserved: **12 Aug 2026 9:05 pm IST**
- Added to review: **12 Aug 2026 9:05 pm IST**
- Exact reason: **VoiceNotes did not provide a creation timestamp that can assign a Journal Date. The operational retrieval time is not a Journal Date suggestion.**
- Guided valid date: **2026-08-08**
- Destination before: visible journal-only day, 0 photos, 1 journal
- Destination after: visible journal-only day, 0 photos, 2 journals
- Cover result: unchanged; no cover is invented.

### 8.4 VoiceNotes — untrusted creation value

- Source title: **Morning walk — synthetic fixture**
- Source-reported raw value: **2026-08-12 07:25**
- Provenance status: **Timezone absent · untrusted · retained without parsing**
- Original Timestamp: **Not established**
- Retrieved and preserved: **13 Aug 2026 9:14 am IST**
- Added to review: **13 Aug 2026 9:14 am IST**
- Exact reason: **VoiceNotes returned a creation value without a timezone. It is preserved as untrusted provenance and has not been converted into a Journal Date.**
- Guided valid date: **2026-08-02**
- Destination before: visible journal-only day, 0 photos, 1 journal
- Destination after: visible journal-only day, 0 photos, 2 journals
- Cover result: unchanged; no cover is invented.

Every Telegram detail says:

> **Telegram notice represented · no message was sent.**

Telegram receipt is always operational provenance, never a suggested Journal Date. VoiceNotes retrieval/preservation time is always operational provenance, never a suggested Journal Date.

## 9. Queue state family

### Populated

The populated state uses the hierarchy, exact intro, count, four fixtures, order, provenance, reasons, preserved state, and actions above.

### Empty

- H1 remains **Needs Date Review**.
- Empty-state heading: **No items need a Journal Date.**
- Copy: **Items with missing, invalid, or future dates will stay here until you choose one.**
- There is no celebration, guilt, illustration that implies a memory, create/import prompt, or unrelated call to action.

### Local loading

- H1 remains **Needs Date Review**.
- Visible status: **Loading items that need a Journal Date…**
- The queue region is `aria-busy`.
- Neutral geometry-preserving skeleton rows are hidden from assistive technology.
- No stale rows or count are shown.
- A higher v10 initial-loading or total-server state owns the page when active.

### Local load failure

- H1 remains **Needs Date Review**.
- Exact copy: **Needs Date Review could not be loaded. No item has been changed.**
- One action retries loading the queue.
- Retry is guarded, enters local loading, and ignores rapid or stale completion.
- No stale items or optimistic count appear.

## 10. Assignment detail page

Assignment is a focused detail page, not an alert dialog. It uses the same safe `view=date-review` URL and an opaque in-memory history entry.

Opening behavior:

- top Back action;
- one H1 **Assign a Journal Date**;
- initial focus on the H1, followed by the Journal Date field in logical order;
- exact context: **This item is preserved, but it is not on the Calendar or Almanac.**
- exact instruction: **No Journal Date has been suggested. Choose the date you know is correct.**

Wide layout uses two columns, approximately 5/7, separated by one divider. The source/provenance column is read-only; the date/preview column contains the only editable field. Medium and compact layouts stack the same regions without changing reading order.

The read-only region includes Why this needs review, preserved state, source type, and provenance. It does not provide Original download/view or expose source identifiers.

Telegram provenance labels are:

- **Original Timestamp · Telegram message** and **Immutable**
- **Received by Life in Days** and **Operational provenance · not a suggested Journal Date**
- **Entered date** with **Invalid** or **Future**
- **Raw Telegram caption** and **Retained unchanged**

VoiceNotes missing-timestamp provenance includes:

- **Original Timestamp · Unavailable**
- retrieval/preservation time labeled operational only;
- **Source identity · Opaque reference retained · not displayed**
- **No Original Timestamp will be invented.**

VoiceNotes untrusted provenance includes:

- **Original Timestamp · Not established**
- exact raw source-reported value;
- **Timezone absent · untrusted · retained without parsing**
- retrieval/preservation time labeled operational only;
- **Source identity · Opaque reference retained · not displayed**
- **No Original Timestamp will be invented.**

A fictional read-only Voice Journal preview may appear only in a collapsed disclosure on the detail page. Queue rows contain no excerpt. Raw caption or journal body is never placed in a live announcement.

The detail ends with:

> **Original Timestamp and source content will not change.**

Actions are **Cancel** and **Assign Journal Date**. Pending copy is **Assigning…**.

## 11. Date input and calendar picker

The labeled text input:

- starts blank on every first open;
- uses placeholder **YYYY-MM-DD**;
- states the fixed prototype date and Asia/Kolkata boundary;
- disables browser autocomplete;
- disables spellcheck;
- may use numeric input mode without changing text grammar;
- exposes `aria-invalid` and associated help/error text;
- never chooses, completes, or suggests a date.

An adjacent **Choose from calendar** action opens an accessible dialog on wide screens and a full-height sheet on compact screens.

The picker contract is:

- H2 **Choose Journal Date**;
- visible prototype-date and Asia/Kolkata boundary;
- Monday-first grid with Mon through Sun headings;
- month/year controls and historical navigation;
- no selected cell while the input is blank;
- initial roving focus on day 1, not on the prototype date;
- 13 August may be marked **Prototype date** but is never automatically selected;
- 14 August 2026 and later are disabled and not focusable;
- Next is disabled in August 2026;
- previous months remain available;
- Arrow keys move by day or week;
- Home and End move within the week;
- Page Up and Page Down move by month within the allowed range;
- Enter or Space chooses the focused day;
- Escape cancels without choosing and returns focus to the invoking control.

Choosing a calendar cell writes the input and updates the preview only. It does not assign the item.

## 12. Destination preview

Before a valid date, the preview says:

> **Choose a Journal Date to preview its destination.**

After validation, the preview shows the full en-IN destination date, before and after photo/journal counts, visibility, exact cover effect, and the invariant boundary. The four required preview outcomes are:

| Fixture | Before | After | Visibility and cover |
| --- | --- | --- | --- |
| Telegram invalid → 10 August 2026 | 0 photos · 0 journals · no current day | 1 photo · 0 journals | Day becomes visible; real Daily Photo becomes Calendar Cover |
| Telegram future → 11 August 2026 | 0 photos · 1 journal · AI artwork | 1 photo · 1 journal | Day stays visible; real photo becomes Calendar Cover; AI artwork remains labeled in gallery |
| VoiceNotes missing → 8 August 2026 | 0 photos · 1 journal | 0 photos · 2 journals | Day stays visible; cover unchanged |
| VoiceNotes untrusted → 2 August 2026 | 0 photos · 1 journal | 0 photos · 2 journals | Day stays visible; cover unchanged |

The primary action remains disabled until a valid date and a current preview exist.

## 13. Assignment operation and failure

The local state machine is:

> unresolved → editor blank or invalid → preview-ready → assigning → resolved

or:

> assigning → assignment-failed → explicit Retry assigning

While assigning:

- the item remains in the queue;
- the derived count is unchanged;
- only the assignment region is busy;
- affected form actions are guarded;
- reading and global navigation remain available unless a higher v10 state prevents them;
- no success, destination mutation, or conditional-nav decrement appears.

The exact failure is:

> **Journal Date was not assigned. The preserved item remains in Needs Date Review.**

Failure focuses one short error status, preserves the chosen date and preview, leaves the input editable, and presents **Retry assigning** plus **Cancel**.

If the global connection is interrupted, the v10 **Check connection** action owns the primary recovery path and local Retry assigning is disabled. Connection restoration never assigns automatically. The user must explicitly retry.

Each operation has a live-memory identity composed of opaque item identity, chosen date, and fixture generation. An active action is guarded. Completion checks the active operation, current item, date, generation, view, fixture, session, and newer attempt. A mismatch is a no-op. Navigation, reset, session change, newer operation, date change, or connection interruption cancels or invalidates delayed completion. There is no automatic retry, fallback date, duplicate attachment, or partial mutation.

## 14. Success, focus, history, and reload

Visible success is source-kind-specific and uses the assigned en-IN date:

| Fixture | Exact visible success |
| --- | --- |
| Telegram invalid | **Photo added to 10 August 2026.** |
| Telegram future | **Photo added to 11 August 2026.** |
| VoiceNotes missing | **Voice Journal added to 8 August 2026.** |
| VoiceNotes untrusted | **Voice Journal added to 2 August 2026.** |

Success never contains a caption, title, or source excerpt. It offers **View day**, which opens the inherited canonical safe Journal Day route. The one polite live announcement may append the new derived remaining count after the exact visible success; it must not repeat the source content.

After success:

- the same Source Item is attached exactly once;
- its source content, caption/title, Original Timestamp, and provenance are unchanged;
- the destination counts, visibility, and cover are recalculated exactly once;
- the item is removed once;
- the count decreases once;
- focus moves to the next row at the removed index, otherwise the previous row;
- when the final item resolves, focus moves to **No items need a Journal Date** and conditional navigation disappears without focus theft.

Entering the queue pushes only the safe structural view and preserves prior browse context in an opaque live-memory map. Opening detail may push an opaque entry on the same URL. Back, Cancel, and Escape close the current layer and restore the exact invoking control plus list scroll. Picker Escape closes only the picker. No source, item, date, reason, or focus selector enters history payload.

Same-tab draft restoration is allowed only in live memory. Reload clears v11 fixture selection, draft dates, previews, operations, resolutions, success, and live-memory history details, then returns to the inherited v10 shell/ready first-use default. Browser Back after a successful View day must not resurrect a resolved item.

## 15. State priority and inherited shell behavior

V11 extends, but does not weaken, the v10 state hierarchy:

1. session ended or reauthentication boundary;
2. initial loading or total server failure;
3. unsaved-Correction leave confirmation;
4. connection interruption;
5. Needs Date Review load or assignment state;
6. inherited month/request state;
7. item-level media state;
8. ready UI.

Higher-priority shell states remove or disable competing lower-level primary recovery actions. Session expiry removes private date-review content. Initial/total loading replaces it. Connection interruption keeps already rendered synthetic content readable but freshness-unknown and prevents assignment claims.

No v11 action queues work for later, survives reload, claims offline support, or auto-resumes after connection/session return.

## 16. Prototype fixture console

The inherited restrained **Prototype states** disclosure remains visually separate from product Settings. V11 adds only these public live-memory fixture keys:

| Key | Label | Purpose |
| --- | --- | --- |
| `date-review/empty` | Empty | Settled queue with no unresolved items |
| `date-review/populated` | Four preserved items | Exact four-fixture queue |
| `date-review/final-item` | Final item | One-item queue for the 1 → 0 focus/count transition |
| `date-review/loading` | Loading | Local queue loading without stale content |
| `date-review/load-failure` | Load failure | Local queue failure and guarded Retry |

Guided branch controls may exercise assignment success, repeat failure, rapid repeat, navigate-before-completion, date-change-before-completion, and connection interruption. They may select each of the exact four Product items for QA without creating additional public fixture keys.

Every control is visibly labeled as a prototype-only synthetic state and stored in live memory only. Missing or invalid fixture state fails closed to the inherited v10 shell/ready first-use default. Fixture state never enters URL, title, history payload, storage, network, console, or logs.

## 17. Accessibility and content contract

- One H1 per page state, logical headings, inherited landmarks, skip link, semantic list/list item/article structure, description lists for provenance, and a real form with labels and buttons.
- One dedicated polite date-review live region announces concise load completion, preview summary, success, and remaining count. It never announces raw caption, journal body, or the whole source card.
- One short assignment/load failure may use assertive alert semantics. Do not duplicate the same message in a toast and live region.
- Queue action accessible names add source type and reason only; they never expose title, caption, or source content.
- Loading uses `aria-busy` and `aria-hidden` skeleton geometry.
- Picker traps focus and returns it to **Choose from calendar**. The assignment page itself is not a modal trap.
- Back, Cancel, Escape, failure, Retry, success, final-item removal, View day, browser Back/Forward, and fixture reset preserve a logical and visible focus target.
- All actions are keyboard and touch operable. Focus is visible in both themes and never relies on colour alone.
- Controls are at least 24 by 24 CSS pixels; compact primary actions are at least 44 by 44 CSS pixels.
- Essential provenance and errors use at least the inherited 13/18 token.
- Text, UI components, focus, disabled state, attention, and failure contrast must be measured. V11 makes no formal WCAG or accessibility-conformance claim.
- Reduced motion makes state changes immediate, removes shimmer/pulse/translation/scale, and requires no spinner.

## 18. Responsive and visual contract

- **1440 × 900:** content max-width about 1180 px; 48–58 px gutters; rows use an approximately 104 × 130 px preview, flexible content, and right-aligned action.
- **1280 × 720:** 32–40 px gutters; approximately 96 × 120 px preview; full hierarchy remains visible.
- **960 × 900:** inherited compact navigation; one grouped queue surface; assignment detail stacks without a side-by-side squeeze.
- **700 × 900:** 20 px gutters; approximately 80 × 100 px preview; action may occupy its own full row.
- **390 × 844:** 16 px gutters; approximately 72 × 90 px preview; detail replaces list; all primary actions at least 44 px; picker becomes a scrollable full-height sheet above safe area and bottom navigation.
- **320 × 568:** 8–12 px gutters; approximately 64 × 80 px preview; all content can stack; long tokens and copy wrap; picker uses seven roughly 40–43 px columns; dialogs fit `calc(100% - 16px)`; no horizontal page overflow.
- **568 × 320 landscape:** normal document scroll; full-height picker retains every action without clipping.
- **200% text and 400% page zoom:** content reflows to compact without covered actions or horizontal page overflow, except no contained exception is expected in this package.
- Both themes retain the same hierarchy and non-colour states.

No warning-dashboard treatment, giant icon, decorative memory, deep shadow grid, clipped copy, covered action, or horizontal page scroll is acceptable.

## 19. Explicit exclusions and remaining ownership

V11 does not implement or close:

- v12 Telegram companion, authorization, media types/limits, albums, caption grammar, durable acknowledgement, or private change-date handoff;
- v13 checksum duplicate handling;
- v14 durable manual upload;
- v15 Correction lifecycle;
- v16 source conflict resolution;
- v17 redating an already dated Source Item and full `LID-SCP-002`;
- v18 History and provenance surfaces;
- v19 Trash and permanent deletion;
- v20 Source or Artwork Suppression;
- v21 complete lexical Search;
- v22 and v23 generated-field lifecycle or AI processing;
- v24 System Health;
- v25 through v29 provider, artwork request/failure/version/sweep behavior;
- v30 complete Daily Photo management;
- v31 through v33 storage, backup/recovery, and export;
- v34 full access and security boundary;
- v35 formal responsive/accessibility closeout.

V11 does not claim real bot notification, capture, encryption, media preservation, source retrieval, source timestamp authority, webhook behavior, backend validation, holding-record durability, database transactions, source attachment, persistence, network behavior, integration behavior, server idempotency, deployment, security controls, accessibility conformance, operations, or production readiness.

## 20. Independent QA gate

A new independent QA agent must be assigned only after every v11 UI artifact is stable. QA binds to SHA-256 values for every UI byte; any UI-byte change invalidates the verdict and restarts the complete gate.

A Pass requires zero unresolved Critical, High, Medium, and Low findings and must verify:

1. Exact v11 artifact inventory, syntax/package checks, clean console, links, and frozen v6–v10 byte comparison.
2. Inherited v10 shell/ready default, global prototype boundary, no external request, and truthful closure language.
3. Populated queue count, exact four-item order, every source label, safe preview/title, provenance field, Added time, entered/raw value, exact reason, preserved state, and action.
4. Conditional wide and compact navigation/count behavior for unknown, loading, 4, 3, 1, and 0; Management reachability when empty; accessible names; no focus theft.
5. Empty, local loading, local load failure, guarded Retry success/repeat-failure/rapid-repeat/stale completion, and v10 higher-state precedence.
6. First-open blank input and no receipt/retrieval/device/prototype-date guessing; fixed date/timezone boundary; exact Gregorian grammar and all named pass/fail edges.
7. Calendar picker Monday-first structure, blank initial selection, initial day-1 focus, historical navigation, August maximum, disabled/unfocusable future dates, keyboard model, Escape, and focus return.
8. Every fixture's assignment provenance, immutable boundary, exact guided date, before/after counts, visibility, cover outcome, and real-photo precedence.
9. Assignment pending, exact failure, retained date/preview, Retry, repeat failure, rapid repeat, date-change-before-completion, navigate-before-completion, connection interruption, reconnection without auto-assignment, stale callback, and single-result success.
10. Success copy for both source kinds, no excerpt, View day, canonical route, queue removal/count decrement once, next/previous focus, final empty focus, and no Back resurrection.
11. Cancel, Escape, Back, Forward, exact invoker/scroll restoration, picker trap/return, queue/detail same-URL history, opaque `entryId` only, session interruption, fixture reset, and reload reset.
12. URL, title, history payload, local/session storage, cookies, IndexedDB, cache, service worker, clipboard/referrer, network, console, telemetry/log boundary, and absence of source identifiers from the DOM.
13. Heading/landmark/list/article/description-list/form semantics, input associations, busy/skeleton behavior, restrained live regions, non-colour state, keyboard/touch operation, focus visibility, target sizes, and measured representative contrast.
14. 1440 × 900, 1280 × 720, 960 × 900, 700 × 900, 390 × 844, 320 × 568, and 568 × 320; light/dark; reduced motion; 200% text and 400% page-zoom or truthful reflow-equivalent observations without a conformance claim.
15. Frozen v6 private Search, v7 Calendar, v8 cross-month Almanac, v9 first-use readiness, v10 resilient shell, populated Calendar/Museum Margin/full day, Upload, Settings, theme, focus/history, and forbidden-scope regressions.

Recommended current-run visual evidence includes:

- 1440 populated queue in light theme;
- Telegram invalid-date preview in light theme;
- Telegram future art-to-real-cover preview in dark theme;
- 1280 VoiceNotes missing-timestamp blank editor in light theme;
- VoiceNotes untrusted preview in dark theme;
- 960 assignment failure;
- 700 assignment pending in dark theme and three-item success in light theme;
- 390 compact More count, picker maximum, and final empty state;
- 320 four-item queue and future-date validation;
- 568 × 320 picker;
- truthful 200% text and 400% reflow observations.

Visual captures supplement, but do not replace, live checks for focus, history, operation identity, privacy surfaces, target sizes, contrast, reduced motion, and regressions.

Implementation may begin under gates P/D/C = A, I = IP, Q = —. V11 becomes Complete only after the exact-hash independent Pass and documentation-only freeze. V12 remains queued until that freeze.
