# Life in Days prototype v13 — Product Council contract

Date: 2026-08-16
Package: **PVA-008 Telegram Duplicate Handling**
Status: **Council Approved**

## 1. Council, authority, and disposition

- Product Manager: **/root/v13_product_manager** — Product gate **A**.
- UI/UX Designer: **/root/v13_ui_designer** — Design gate **A**.
- Project Manager / Council synthesizer: **/root/v13_product_manager/v13_project_manager** — Council gate **A**.
- Implementing agent: **/root** — Implementation gate **IP**.
- Independent QA: a fresh agent is assigned only after a stable v13 candidate fingerprint and current-run evidence exist — QA gate **—**.

Authority order is Arun's direct decisions, the [Product Requirements](../../product/PRODUCT-REQUIREMENTS.md), the [UX Specification](../../design/UX-SPECIFICATION.md), the [v5 feature audit](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md), and the [prototype completeness tracker](../../project/PROTOTYPE-COMPLETENESS-TRACKER.md). The frozen [v12 Council contract](../v12/COUNCIL-v12.md), [Telegram fixture sheet](../v12/TELEGRAM-FIXTURES-v12.md), [handoff](../CALENDAR-UI-PROTOTYPE-v12.md), [independent QA](../../../design-qa-v12.md), and [guide](../../../prototypes/calendar-ui/README-v12.md) are the inherited behavior and regression contract.

The authoritative v13 scenario ledger is [Telegram Duplicate Fixtures v13](./TELEGRAM-DUPLICATE-FIXTURES-v13.md).

Product's exact fixture direction, facts, copy, actions, stages, errors, and terminal outcomes control. Design adds hierarchy, action order, visual treatment, semantics, focus, responsive behavior, and evidence requirements without changing Product outcomes.

Council resolves the prior Product/Design differences as follows:

1. Cross-day direction is an existing reference on **13 August 2026** and a requested addition to **10 August 2026**.
2. Same-day copy says **already in**, not already on.
3. Both decisions retain Product's complete action set.
4. Decision-choice DOM order is **Cancel**, then the permit action. The private View-existing-date action is visually separate and follows those choices.
5. Product's exact decision, cancel, success, failure, and stage strings supersede Design's earlier alternatives.
6. Product's exact stage is **Checking for identical bytes…**. A permit returns to **Waiting for durable capture…**.
7. The exact guide addition in §8 controls.
8. Cross-day permit success exposes both the destination View day action for 10 August and a separate private provenance link to 13 August.

Design explicitly accepted these resolutions. There is no unresolved Product, Design, PRD, or UX contradiction and no Council blocker.

## 2. Prototype question and permitted closure

V13 asks one bounded logic question:

> Can the frozen Telegram Capture Companion truthfully represent a different-message identical-photo decision, preserve independent Daily Photo facts, and expose zero-or-one outcomes without claiming that browser fixtures prove checksum, storage, transaction, or provider behavior?

The sole permitted closure statement is:

> **Telegram duplicate decisions are prototype-represented with deterministic synthetic checksum and Media Asset fixtures; plaintext checksum calculation, encrypted asset reuse, durable reference creation, transactional race prevention, backend idempotency, persistence, Telegram integration, and authenticated links remain unverified.**

The prototype may establish deterministic fictional browser behavior, layout, semantics, focus, privacy surfaces, and live-memory state transitions for its exact static files. It does not establish real checksum calculation, byte equality, encryption, physical object reuse, database uniqueness, transactional reference creation, rollback, server idempotency, persistence, provider behavior, authentication, deployment, operations, formal accessibility conformance, or production readiness.

## 3. Immutable v12 dependency

V13 starts from the frozen v12 implementation/evidence commit **3927b55**, freeze record **689536c**, and final tracker record **1aa3c5f**.

The exact passed v12 UI identity is immutable:

| Artifact | SHA-256 |
| --- | --- |
| prototypes/calendar-ui/index-v12.html | a4ad82b9d68a7ecd736ab63eeebe80c7542063c5b4bbe530351a25a82d16fe7b |
| prototypes/calendar-ui/app-v12.js | 4999e1bd87256cd7d2ee90cb4f3f36cace98503c4e821f8d3f7620bf1f8b5f0d |
| prototypes/calendar-ui/styles-v12.css | 3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869 |
| prototypes/calendar-ui/styles-v12-almanac.css | 7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b |
| prototypes/calendar-ui/styles-v12-readiness.css | e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e |
| prototypes/calendar-ui/styles-v12-resilience.css | d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c |
| prototypes/calendar-ui/styles-v12-date-review.css | 525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5 |
| prototypes/calendar-ui/styles-v12-telegram.css | 7a0ea5404e3292cde147649a6de561b300a987a3c2ed2638ae61d407f141ad7c |

No v6–v12 prototype UI, guide, handoff, Council, fixture, QA, or evidence byte may change. V13 uses newly numbered, additive artifacts.

The pre-v13 package artifact SHA-256 is **e11e52086687cc7ac53083721d9a7321627aac56b9045dc27100da64b76666fa**. Package governance is the sole shared-artifact exception:

- package.json may add only the minimal **check:v13** script;
- **check:v6** through **check:v12** remain textually and functionally unchanged;
- both old and new package hashes are recorded;
- **check:v6** through **check:v13** are rerun;
- the package check addition does not change the frozen v12 UI disposition.

## 4. Exact scope and non-scope

V13 closes only the frontend-prototype observability portion of audit gap 9 and **LID-TG-008** for Telegram-photo duplicate decisions.

A v13 duplicate means:

- the incoming item has a **different synthetic Telegram update/message identity** from every settled operation being compared; and
- its deterministic represented plaintext-image checksum matches the represented checksum of an existing Media Asset.

The same-update replay branch remains a no-op/idempotency scenario and is never presented as checksum duplicate detection. No real checksum is calculated, displayed, copied, transmitted, or placed in a product-facing identifier.

V13 is limited to:

- fixed date **13 August 2026**, **Asia/Kolkata**;
- valid, live, single-match fixtures;
- one same-day incoming fixture;
- one cross-day incoming fixture;
- deterministic no-match, decision, cancel, permit, lookup-failure, commit-failure, replay, interruption, and stale-callback fixtures;
- representation of one matched Media Asset moving from one to two Daily Photo references only after explicit permission.

V13 does not decide or close:

- duplicates routed to Needs Date Review;
- a match that exists only in Trash;
- multiple prior-date matches or which prior date to name;
- Uploaded Journal exact-text duplicate work under **LID-UP-003**, owned by v14;
- actual redating, owned by v17;
- edit history, Trash, restore, purge, and Media Asset reference lifecycle, owned by v18–v19;
- full Photo Caption Search, owned by v21;
- complete gallery, reorder, cover, original, and download controls, owned by v30;
- storage and migration UI, owned by v31;
- authentication enforcement, owned by v34;
- formal conformance, owned by v35.

The inherited Uploaded Journal duplicate surface remains exact:

- **This exact text is already present.**
- **Add duplicate anyway**

It gains no Telegram-photo checksum language, Media Asset relationship, date-only warning, or LID-UP-003 closure.

## 5. Domain and identity contract

The existing 13 August Daily Photo, each permitted incoming Daily Photo, and their Source Items remain distinct facts even when one represented Media Asset backs them.

- Byte equality is global for the represented match and does not depend on date, caption, source form, or provider identity.
- A permit creates one distinct Daily Photo, Source Item, and reference, never a second represented Media Asset.
- Each permitted reference retains its own Journal Date, Photo Caption, Original Timestamp, source form, and provider provenance.
- A new caption or timestamp never overwrites an existing Daily Photo's facts.
- A decision or Cancel creates no incoming caption-bearing Source Item.
- The existing cover never changes on a same-day permit.
- A first Daily Photo on a newly visible day becomes that day's cover.
- Product provenance says **Same media as another day**. It never exposes a checksum or Media Asset ID.
- A fixture-state fact may say **1 represented Media Asset · 2 Daily Photo references** only when clearly scoped to the matched represented byte sequence. It is not a total archive count or a real storage claim.

Photo Captions may appear only where inherited product content requires them. They remain absent from URL, title, history payload, browser storage, request data, logs, toasts, live-region announcements, analytics, telemetry, and every AI path. Full caption Search remains v21.

## 6. Canonical fixture baseline

The full scenario facts and expected state tables are normative in the [v13 fixture sheet](./TELEGRAM-DUPLICATE-FIXTURES-v13.md).

The canonical existing reference is:

- Journal Date: **13 August 2026**;
- existing Daily Photo fixture: **p-rain**, rain-window;
- represented JPEG facts: **1,842,112 bytes · 3024 × 4032**;
- Photo Caption: **The shower arrived all at once**;
- Original Timestamp: **13 August 2026, 4:38 pm**;
- Calendar Cover: this existing Daily Photo;
- day baseline: **2 photos · 2 journals**;
- matched relationship baseline: **1 represented Media Asset · 1 Daily Photo reference**.

The same-day incoming item is a different provider identity with the same represented bytes:

- message **13 August 2026, 9:11 pm**;
- received **9:12 pm**;
- receipt-date target **13 August 2026**;
- Photo Caption **Rain on the glass, sent again**.

The cross-day incoming item is another different provider identity with the same represented bytes:

- message **13 August 2026, 9:31 pm**;
- received **9:32 pm**;
- raw input **2026-08-10 Monsoon light through the window**;
- target **10 August 2026**;
- Photo Caption **Monsoon light through the window**;
- 10 August baseline: absent.

## 7. State machine and exact product outcomes

The frozen v12 authorization, media validation, and date/caption interpretation order remains intact. V13 appends one duplicate-check stage before represented durable capture:

> Received → Authorizing → Validating → Checking for identical bytes… → no-match continuation or duplicate decision

A no-match result continues the exact frozen v12 success path. A match creates no mutation and no Telegram success acknowledgement. Explicit permission returns to:

> Waiting for durable capture…

The represented mutation and its terminal success become visible atomically.

### Same-day decision

- H2: **Already imported**
- Body: **This exact photo is already in 13 August 2026. Nothing new was added.**
- Choice actions in DOM order: **Cancel**; **Add duplicate anyway**
- Separate following action: **View 13 August 2026**
- Cue paired with View: **Private link · authentication required**

Before any action, 13 August remains 2 photos/2 journals, the existing caption and cover are unchanged, and the matched relationship remains one represented Media Asset/one reference.

### Same-day permit

- Terminal: **Duplicate photo added to 13 August 2026.**
- Exactly one new Daily Photo, Source Item, and reference appear.
- Incoming caption and Original Timestamp are retained; the existing caption remains untouched.
- Result: **3 photos · 2 journals**.
- The new 9:11 pm item follows the inherited 7:21 pm item.
- Existing p-rain remains cover.
- Matched relationship: **1 represented Media Asset · 2 Daily Photo references**.
- **View day** opens 13 August.
- No another-day provenance link appears because both references use one date.
- No ordinary Calendar, Almanac, or Timeline tile badge appears.

### Same-day or cross-day Cancel

- H2: **Duplicate not added**
- Body: **Nothing was added. The existing Daily Photo is unchanged.**
- State: **No new Daily Photo · no Journal Day change · no Media Asset change**
- No Telegram success reply is represented.
- The canonical baseline remains exact and focus returns stably.

### Cross-day decision

- H2: **This photo is already used on another day**
- Body: **This exact photo already appears on 13 August 2026. It can also be added to 10 August 2026.**
- Choice actions in DOM order: **Cancel**; **Add to 10 August 2026 anyway**
- Separate following action: **View 13 August 2026**
- Cue paired with View: **Private link · authentication required**

The warning exposes only the existing date. It never exposes that day's title, journal text, summary, tags, Photo Caption, thumbnail description, provider identity, internal ID, checksum, or Media Asset ID.

### Cross-day permit

- Terminal: **Photo added to 10 August 2026.**
- 10 August becomes visible with **1 photo · 0 journals**.
- The new reference is 10 August's cover.
- Incoming caption, Original Timestamp, and provider provenance are retained.
- 13 August remains exactly 2 photos/2 journals with its original cover and captions.
- Matched relationship: **1 represented Media Asset · 2 Daily Photo references**.
- Destination **View day** opens the newly affected 10 August day.
- Separate provenance says **Same media as another day** and links **View 13 August 2026** with **Private link · authentication required**.
- A reciprocal 13 August detail link to 10 August is permitted but not required.
- No ordinary Calendar, Almanac, or Timeline tile badge appears.

## 8. Page hierarchy and experience direction

V13 is additive to the frozen warm-paper/deep-ink Telegram Capture Companion. It remains a quiet explanatory surface, not an ingestion dashboard, Telegram replica, phone mockup, setup form, modal workflow, or new route.

At every viewport, DOM and visual order are:

1. inherited prototype banner;
2. Back;
3. inherited eyebrow, H1, intro, boundary, and fixed prototype date;
4. **Synthetic Telegram message**;
5. Run or Try again anchor;
6. ordered simulated path;
7. **Life in Days outcome**;
8. inline duplicate decision when applicable;
9. **Represented media relationship** only after explicit permission;
10. **Telegram photo guide**;
11. visually separate **Prototype states**.

Wide layouts keep the inherited 7/5 ruled split. At **960 CSS pixels and below**, content stacks in the same DOM order.

Duplicate decisions are amber, inline subsections of the Life in Days outcome. They are never modals, toasts, routes, overlays, or detached cards. Failures use the inherited rose treatment. Text, heading, border, and shape preserve meaning without color.

The guide adds exactly one seventh item:

> **If the same photo is found on the same Journal Date, Life in Days does not add it again unless you choose Add duplicate anyway. If it already appears on another date, Life in Days names only that date and lets you decide.**

After a successful permit only, show:

- title **Represented media relationship**;
- **Two distinct Daily Photos are represented as using one shared Media Asset.**
- **Prototype representation only · checksum matching, encryption, stored bytes, durable references, and physical deduplication are not verified.**

This ruled block is absent during checking, decision, Cancel, lookup failure, commit failure, and same-update replay.

## 9. Failures, retries, races, and stale work

### Duplicate lookup failure

- H2: **Duplicate check could not finish**
- Body: **Nothing was added because Life in Days could not check for an existing photo.**
- Action: **Try again**
- Behavior: fail closed, with no fallback addition, mutation, or acknowledgement.

### Permit commit failure

- H2: **Duplicate photo was not added**
- Body: **Life in Days could not finish saving the new Daily Photo. Nothing changed.**
- Action: **Try again**
- Behavior: zero mutation and zero success acknowledgement.

Retry reuses the same represented operation and identity and yields at most one reference.

The reducer and product surface must also represent:

- rapid repeated permit activation is guarded;
- repeated callbacks for one permit create at most one reference;
- same-update replay returns settled truth without a second warning, acknowledgement, or reference;
- a different message with identical represented bytes receives its own decision;
- concurrent different messages each create one reference only when each has been explicitly permitted;
- every permitted concurrent message reuses the one represented Media Asset;
- navigation, reset, fixture change, date change, or Cancel before commit invalidates stale callbacks;
- abandoned generations cannot update a later fixture or destination;
- a connection interruption leaves content readable but freshness-unknown, disables affected decision/permit/retry controls, queues nothing, and never auto-resumes;
- reconnecting requires an explicit user action;
- session interruption removes private decision, caption, and media state, invalidates pending work, and never resumes after represented reauthentication.

## 10. Handoff, history, and focus

Every View action is visibly paired with **Private link · authentication required**. V34 retains real authentication enforcement.

- Same-day decision View opens the existing 13 August day.
- Same-day permit **View day** opens 13 August.
- Cross-day decision View opens the existing-reference 13 August day.
- Cross-day permit **View day** opens the newly affected 10 August day.
- Cross-day permit provenance separately opens 13 August.

Destination handoffs focus their visible H1. Back restores the exact invoking link or button and scroll position. Forward restores already-settled truth without rerunning duplicate lookup, permitting a duplicate, emitting an acknowledgement, or creating another reference.

If Cancel or permit removes the invoking action, focus moves to the terminal H2. A failure focuses its H2. During an asynchronous transition, a guarded H2 fallback may run only while focus remains on BODY or otherwise unclaimed; it never steals focus after the user moves it.

## 11. Privacy and session contract

- Browser title remains **Life in Days**.
- URL contains structural route state only.
- History payload is an opaque live-memory entry ID only.
- No fixture, date, caption, decision, match, checksum, media identity, reference identity, provider identity, operation, outcome, or focus value enters URL, title, local storage, session storage, cookies, IndexedDB, Cache Storage, a service worker, clipboard, referrer, request data, console, telemetry, analytics, or logs.
- No external asset, Telegram/provider request, AI request, or other external network call is part of v13.
- Product DOM IDs contain no provider, update, message, checksum, media, Source Item, caption, or private-source identity.
- A date-only duplicate warning never reveals another Journal Day's private content.
- Captions never enter a toast or live-region announcement.
- Reload returns to the inherited safe default and cannot recover a private decision or pending operation.
- Session loss replaces the private surface with the inherited session gate and clears live-memory private state.

## 12. Accessibility and interaction contract

- Use native buttons and links; no clickable rows or simulated controls.
- The platform target floor is 24 × 24 CSS pixels; compact/touch actions are at least 44 × 44.
- At 390 CSS pixels and below, decision actions become full-width without changing DOM order.
- Only the active ordered path owns aria-busy.
- One concise polite atomic v13 live region announces state changes.
- It never announces a raw caption, filename, checksum, provider identity, full decision body, or other-day private content.
- A short failure may use alert semantics only when the same content is not duplicated in the polite region or a toast.
- Decision and failure H2s are programmatically associated with their regions.
- Status, warning, failure, and success remain distinguishable in forced colors and without motion.
- Reduced motion removes nonessential transition while preserving immediate state truth.
- Essential text maintains at least the inherited 13px/18px floor.
- Light and dark themes meet the inherited text, border, focus, and control contrast contract.
- Keyboard order follows DOM order and every interactive state has an obvious visible focus indicator.

## 13. Responsive and reflow gate

Required live checks include:

- 1440 × 900;
- 1280 × 720;
- exact 960 × 900 stacked boundary;
- 901 CSS pixels;
- 700 × 900;
- 390 × 844;
- 320 × 568;
- 568 × 320 landscape;
- 640 × 900 at 200% reflow;
- 320 × 900 at 400% reflow.

The 960/961 boundary must preserve the intended 7/5-to-stacked transition. The longer cross-day H2 and **Add to 10 August 2026 anyway** label receive explicit checks at 320px, landscape, and 400% reflow.

No state may introduce horizontal page overflow, clipped copy, covered focus, inaccessible action, overlapping ruled sections, unreachable guide content, or a decision order that differs visually from DOM order.

## 14. Current-run evidence contract

After a stable held v13 UI fingerprint exists, regenerate exactly 22 fresh RGB PNGs:

| # | Viewport and state | Theme |
| --- | --- | --- |
| 01 | 1440 × 900 duplicate guide/default | Light |
| 02 | 1440 × 900 same-day checking | Dark |
| 03 | 1440 × 900 same-day Already imported decision | Light |
| 04 | 1440 × 900 same-day permit success | Dark |
| 05 | 1280 × 720 same-day Cancel | Light |
| 06 | 1280 × 720 cross-day decision | Dark |
| 07 | 1280 × 720 cross-day permit success | Light |
| 08 | 1280 × 720 cross-day Cancel | Dark |
| 09 | 960 × 900 duplicate-check failure | Light |
| 10 | 960 × 900 permit commit failure and retry | Dark |
| 11 | 960 × 900 same-update replay unchanged | Light |
| 12 | 700 × 900 same-day decision | Light |
| 13 | 700 × 900 cross-day warning | Dark |
| 14 | 700 × 900 represented-media provenance | Light |
| 15 | 390 × 844 same-day decision | Dark |
| 16 | 390 × 844 cross-day success and private links | Light |
| 17 | 390 × 844 day provenance and exact return | Dark |
| 18 | 320 × 568 long same-day decision | Light |
| 19 | 320 × 568 long error and retry | Dark |
| 20 | 568 × 320 cross-day landscape | Light |
| 21 | 640 × 900 200% reflow | Light |
| 22 | 320 × 900 400% reflow | Dark |

Evidence is accepted only when:

- every frame is generated after the final candidate UI hashes are held;
- exact pixel dimensions and RGB PNG format are verified;
- every PNG is visually inspected at original resolution;
- hashes are unique where the depicted state differs;
- repository bytes equal the inspected current-run bytes;
- no stale or superseded image is retained as evidence;
- every UI-byte change invalidates and requires regeneration of all 22 frames.

Screenshots are visual evidence only and never substitute for interaction, accessibility, privacy, race, or regression checks.

## 15. Independent QA gate and stop rules

Independent QA is not assigned until the complete candidate fingerprint, current-run evidence, Council, fixture sheet, handoff, guide, and QA brief are ready.

The QA agent must be independent of Product, Design, Council, implementation, and evidence generation. It starts from zero and discards every earlier QA disposition.

The complete gate includes:

- exact Product strings, action sets, fixtures, date direction, stage labels, and before/after states;
- no-match continuation of frozen v12;
- same-day decision, Cancel, permit, chronology, cover, captions, timestamps, counts, and handoff;
- cross-day date-only decision, Cancel, permit, new-day cover, unchanged existing day, both success handoffs, provenance, and no tile badge;
- lookup and commit failures, explicit retry, rapid action, replay, different identity, concurrent permit, and stale callback behavior;
- navigation, reset, fixture/date change, connection, and session interruption;
- Back, Forward, focus, scroll, live-region deduplication, and no rerun;
- DOM, URL, title, history, storage, network, console, referrer, clipboard, telemetry, analytics, and log privacy;
- light, dark, forced colors, reduced motion, contrast, target sizes, keyboard operation, named viewports, landscape, and 200%/400% reflow;
- full frozen v6–v12 byte and functional regression;
- unchanged Uploaded Journal duplicate behavior;
- absence of forbidden v14+ behavior;
- static hashes, served-byte parity, syntax, check scripts, relative links, local-only resources, secrets inspection, and a clean console.

Stop rules are absolute:

1. An unresolved Council contradiction means Council gate B and implementation cannot proceed.
2. The first actionable QA finding is reported immediately and QA pauses. The candidate is Failed; partial execution cannot yield a disposition.
3. Any v13 UI-byte change invalidates every v13 interaction, evidence, and QA result. All 22 frames and the complete gate restart from zero.
4. Any frozen v6–v12 UI, documentation, or evidence byte drift is an immediate blocker.
5. Pass requires zero unresolved Critical, High, Medium, or Low findings.
6. V14 cannot start before v13 Pass, freeze, and final tracker record.

## 16. Static checks and frozen regression

Before QA, record SHA-256 for every v13 runtime, style, documentation, guide, fixture, QA, evidence, and package artifact required by the handoff.

Required static checks include:

- syntax checks for v13 JavaScript and package metadata;
- exact served-byte equality for every v13 local resource;
- all relative Markdown and product links resolve;
- no external runtime resource;
- no secrets, credentials, provider IDs, real photos, or private source data;
- **check:v6** through **check:v13** pass;
- exact frozen v6–v12 hashes remain unchanged;
- full functional regression of inherited v6–v12 screens and flows.

An additive v13 success does not revise or broaden any prior version's closure statement.

## 17. Tracker, commit, and freeze sequence

The required order is:

1. Record explicit authorization and append a v13-started tracker ledger entry without altering earlier entries.
2. Mark v13 Product, Design, and Council **A**; Implementation **IP**; QA **—**.
3. Create only v13-numbered implementation, Council, fixture, handoff, guide, QA, and evidence artifacts, plus the minimal shared package check addition allowed by §3.
4. Hold stable candidate hashes, generate and inspect current-run evidence, then assign fresh independent QA.
5. If QA finds anything, repair the same v13 candidate, issue new hashes, regenerate all evidence, and restart complete QA. Do not start v14.
6. After Pass, create the implementation/evidence commit containing the passed v13 UI, documentation, guide, QA record, and evidence. The later freeze record names this commit.
7. Create a documentation-only freeze-record commit that changes only tracker/handoff status material. It must not change the passed UI, Council, fixture, guide, QA, or evidence bytes.
8. Create a final tracker-only commit recording the freeze-record commit hash.
9. Only then mark every v13 gate complete and release v14, subject to the repository's renewed-authorization rule.

No passed artifact may attempt to contain the hash of the commit that first contains itself.

## 18. Backend concurrency and storage proof boundary

V13 may represent, in one browser's deterministic live memory:

- an equal-checksum match boolean supplied by a synthetic fixture;
- the distinction between same-update replay and a different update with equal represented bytes;
- one represented Media Asset changing from one to two Daily Photo references;
- zero-or-one mutations for an operation;
- guarded race and retry outcomes;
- an atomic-looking product transition from pending to settled truth.

V13 cannot prove:

- a plaintext checksum algorithm or actual byte equality;
- checksum index correctness or uniqueness;
- encrypted object reuse or one physical stored object;
- transaction isolation, atomic database/object commits, rollback, or orphan prevention;
- concurrency across threads, processes, workers, devices, or restarts;
- provider update idempotency;
- durable reference counts;
- live-plus-Trash reference lifecycle or last-reference deletion;
- persistence, restore, backup, export, authentication, integration, deployment, or operations.

Later backend evidence must independently exercise:

- a global checksum index over plaintext input before encryption;
- transactional get-or-create Media Asset plus Daily Photo/Source reference creation;
- same-update uniqueness versus different-update equal-byte behavior;
- concurrent explicitly permitted messages, each producing at most one reference while reusing one physical asset;
- repeated callbacks and retry idempotency;
- failpoint rollback with no orphaned asset, reference, or dangling metadata;
- restart/replay durability;
- live and Trash reference accounting;
- deletion only after the final retained reference is gone;
- reconciliation between database reference counts and stored encrypted objects.

No v13 browser result may be cited as evidence for those backend properties.

## 19. Council completion conditions

Council remains **A** only while implementation preserves:

- every exact string and fixture fact in this contract and the v13 fixture sheet;
- the frozen v12 byte boundary;
- the package exception exactly as limited in §3;
- zero mutation before explicit permission;
- one represented Media Asset with separate per-reference facts after permission;
- date-only cross-day privacy;
- no ordinary duplicate badge;
- the interaction, accessibility, evidence, QA, and freeze gates above;
- the exact permitted closure statement in §2.

Any proposed scope expansion or conflicting implementation behavior returns the package to Council before implementation or QA continues.
