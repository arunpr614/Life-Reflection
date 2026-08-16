# Life in Days prototype v12 — Product Council contract

Date: 2026-08-15
Package: **PVA-007 Telegram Capture Companion**
Status: **Approved for prototype implementation**

## 1. Council, authority, and disposition

- Product Manager: **/root/v12_product_manager** — Product gate **A**.
- UI/UX Designer: **/root/v12_ui_designer** — Design gate **A**.
- Project Manager / Council chair: **/root/v12_council_manager** — Council gate **A**.
- Implementing agent: **/root** — Implementation gate **IP**.
- Independent QA: a fresh agent is assigned only after a stable v12 UI fingerprint exists — QA gate **—**.

Authority order is Arun's direct decisions, the [PRD](../../product/PRODUCT-REQUIREMENTS.md), the [UX specification](../../design/UX-SPECIFICATION.md), the [v5 feature audit](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md), and the [prototype completeness tracker](../../project/PROTOTYPE-COMPLETENESS-TRACKER.md). The frozen [v11 Council contract](../v11/COUNCIL-v11.md), [handoff](../CALENDAR-UI-PROTOTYPE-v11.md), [independent QA](../../../design-qa-v11.md), and [guide](../../../prototypes/calendar-ui/README-v11.md) are the inherited behavior and regression contract.

Product and Design agree on the package; no decision is required from Arun. Product's exact T1–T7 values, strings, state semantics, outcome rules, and exclusions control. Design adds hierarchy, layout, semantics, focus, responsive behavior, visual language, fixture-console organization, and evidence requirements without changing Product outcomes.

One Council interpretation is recorded rather than invented:

- Product leaves T7 destination counts and cover copy unstated.
- T7 scenario reset uses the frozen v11-derived 10 August baseline, and the generic successful captured-valid transition attaches exactly one Daily Photo.
- V12 must not add a T7-specific before/after count, cover sentence, or terminal action. T7 acceptance is the exact failure, zero mutation, explicit Retry, and exactly one terminal success specified below.

## 2. Outcome and evidence boundary

V12 closes only audit gap 9's Telegram capture-companion portion and the frontend-prototype portions of **LID-TG-001** through **LID-TG-005** after an exact-hash independent Pass.

- **LID-TG-006** remains the frozen v11 frontend closure. V12 represents only the capture acknowledgement and safe handoff into that exact item.
- **LID-TG-007** remains owned by v30.
- **LID-TG-008** duplicate handling is wholly owned by v13.
- **LID-TG-009** complete caption search and match identification remain owned by v21.
- **LID-TG-010** and **LID-OPS-005** remain external-evidence requirements.

Every “safe” or “saved” message appears only after the represented terminal durable outcome. The persistent prototype boundary states that real durability is unverified.

The sole permitted closure statement is:

> **Telegram Capture Companion is prototype-represented with deterministic synthetic bot and web fixtures; Telegram connectivity, webhook authorization, media retrieval and validation, exact-byte preservation, metadata removal, encryption, durable backend capture, authenticated handoff, persistence, integration behavior, and idempotency enforcement remain unverified.**

The prototype may establish deterministic fictional browser behavior, layout, semantics, focus, and live-memory transitions for its exact static files. It does not establish a real Telegram bot, webhook, secret or allowlist enforcement, provider receipt or source time, media retrieval, album completion, decoder safety, HEIC/HEIF support, hostile-image containment, exact received bytes, metadata-free derivatives, checksums, encryption, durable database or object commit, capacity, persistence, authentication, server idempotency, networking, deployment, operations, formal accessibility conformance, or production readiness.

## 3. Immutable dependency

V12 starts from:

- frozen v11 implementation and evidence commit **0e4154f**;
- freeze record **4bb073f**;
- final tracker record **3451605**.

The exact passed v11 UI identity is immutable:

| Artifact | SHA-256 |
| --- | --- |
| prototypes/calendar-ui/index-v11.html | 4c31a55c486ce0290c1b88a7114d059dc8961d4fc888c05c277a7cedfc1631f8 |
| prototypes/calendar-ui/app-v11.js | e07edeae0a7fc16d9bcb7105231d9ba9a84cc0185c709c0e9ddc9718aedf53ac |
| prototypes/calendar-ui/styles-v11.css | 3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869 |
| prototypes/calendar-ui/styles-v11-almanac.css | 7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b |
| prototypes/calendar-ui/styles-v11-readiness.css | e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e |
| prototypes/calendar-ui/styles-v11-resilience.css | d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c |
| prototypes/calendar-ui/styles-v11-date-review.css | 525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5 |

No v6–v11 prototype, guide, handoff, Council, QA, or evidence byte may change. V12 uses newly numbered and additive files only.

## 4. Experience direction

The companion is a quiet explanatory layer inside Life in Days, not a Telegram replica, phone mockup, setup wizard, inbox, or ingestion dashboard.

- Retain the frozen warm-paper light theme, deep-ink dark theme, Georgia editorial headings, sans-serif controls, forest actions, amber review state, rose rejection/failure, divider-first grouping, restrained elevation, and visible prototype banner.
- Use the page surface rather than a centred application card. Wide layouts use one ruled conversation surface and one outcome/guide column.
- Conversation rows may use restrained alignment and pale paper/sage surfaces to distinguish sender and Life in Days, without Telegram brand chrome, a logo, phone bezel, status bar, chat wallpaper, typing theatre, emoji persona, or external asset.
- Reuse only the existing synthetic rain-window, flower-market, and balcony-cups local assets. No real photo, remote image, provider asset, or AI/image call is allowed.
- Media previews use a non-destructive 4:5 frame. Metadata and captions stay outside image pixels.
- Pending is neutral, represented capture is forest, review is amber, and rejection/failure is rose. Every state also uses explicit text and shape.

## 5. Entry, route, Back, and truthful shell

The sole new structural route is **view=telegram-capture**.

Entry is:

> **Settings → Integrations → Telegram → Open capture companion**

First-use Telegram continues to open the inherited Settings boundary first. It never bypasses configuration truth.

There is no primary Calendar/Almanac/Search destination, fifth compact-navigation item, conditional badge, connection action, setup form, QR code, bot-token field, webhook field, sender/chat field, or credential collection.

Opening the companion:

- pushes only the safe structural view;
- focuses its H1;
- records the exact invoking control and scroll behind an opaque live-memory history entry;
- lets wide and compact Back restore that invoker and scroll.

Browser title remains **Life in Days**.

Reload clears every v12 fixture, operation, terminal result, handoff, and live-memory history detail, then returns to the inherited v11 ready/first-use Calendar default.

The inherited Telegram status stays exactly **Configured on server · Never verified** or **Needs server configuration**. The guide works in either state; running a fixture never changes configuration.

## 6. Page hierarchy and default guide

Product DOM and visual order are identical:

1. inherited prototype banner;
2. Back;
3. eyebrow **Private photo capture**;
4. one H1 **Telegram Capture Companion**;
5. intro **See what Life in Days accepts and how each Telegram outcome reaches your private archive.**;
6. boundary **Prototype data · no Telegram connection · no messages sent · no persistence**;
7. default no-activity copy or selected synthetic-message summary;
8. conversation path;
9. Life in Days outcome and handoff;
10. expanded **Telegram photo guide** in the outcome/guide region;
11. visually separate inherited **Prototype states** disclosure.

**Default guide** names the initial fixture state, not a pre-conversation placement. The numbered guide follows conversation and outcome in DOM and visual order at every viewport, matching the responsive contract in §16.

Default simulator copy is:

> **No Telegram activity is being read. Choose a synthetic message to inspect its path.**

The guide is expanded by default and remains reachable from every fixture through **Telegram photo guide**. It is one numbered ruled list:

1. **Send photos only in your configured private Telegram chat. Groups and other senders are rejected.**
2. **Ordinary photo messages may be compressed by Telegram. Send an image as a document to preserve the exact image bytes Telegram supplies.**
3. **Accepted still images: JPEG, PNG, WebP, HEIC, and HEIF. Each file may be up to 20 MB, 100 megapixels, and 20,000 pixels on either side.**
4. **Life in Days sets no product-level item-count limit. Each accepted image becomes a separate Daily Photo.**
5. **Start a caption with YYYY-MM-DD to choose a Journal Date. Historical dates are allowed; future dates are not. Without a leading date, Telegram receipt time in Asia/Kolkata supplies the Journal Date.**
6. **Text after the leading date becomes the Photo Caption. Real photos, their metadata and identifiers, and Photo Captions are never sent to AI.**

The default screen also shows:

> **Prototype date · 13 August 2026 · Asia/Kolkata**

There is no fake Send control. Scenario selection belongs only to the separated prototype console.

## 7. Screen and component inventory

### S0 — Telegram Settings entry

The inherited Telegram Settings section gains only **Open capture companion** beneath its truthful status and boundary copy. It does not become setup. Returning focuses this exact action.

### S1 — Default guide

Shows the full hierarchy, initial copy, guide, fixed boundary, and no synthetic message or result.

### S2 — Selected synthetic input

Heading: **Synthetic Telegram message**.

One semantic article shows:

- an existing synthetic asset or neutral document treatment;
- source form;
- decoded format;
- exact bytes and dimensions;
- Telegram message time;
- represented receipt time;
- raw caption;
- forwarded flag when applicable;
- media-group member position when applicable.

It never shows sender, chat, update, message, media-group, or checksum values.

### S3 — Conversation path

Heading: **Simulated Telegram path**.

Use an ordered list of semantic stage articles:

> Received → Authorizing → Validating → Waiting for durable capture → one terminal outcome

Only the active asynchronous region is busy. There is no bot acknowledgement before terminal state and no animated typing indicator.

### S4 — Life in Days outcome

Heading: **Life in Days outcome**.

Before terminal completion it states that no archive outcome has been represented. At terminal completion it shows a concise status and description list:

- source form;
- Journal Date source;
- Journal Date or Needs Date Review;
- Photo Caption state;
- Original Timestamp;
- Product-defined destination effect;
- represented archive result.

It never exposes internal IDs, encryption claims, checksum data, or another day's private content.

### S5 — Generic authorization rejection

No media preview or metadata renders because rejection occurs before represented download. All four controlled branches render exactly:

- **Request not accepted**
- **This request was not accepted. No photo was downloaded or added.**
- **Rejected before media download · no Source Item**
- **No Telegram reply is represented.**

Only the fixture console may name the synthetic branch. There is no bypass Retry.

### S6 — Media validation outcome

Accepted media shows its decoded type and threshold statement. Rejected media shows one primary rejection, the common no-Source line, no Calendar/review/handoff action, and no safe/saved/imported language. Other failed synthetic gates may appear only in prototype details.

### S7 — Captured-valid terminal

Show only the Product terminal sentence, then **View day** and **Change Journal Date** where Product defines them. Each action visibly carries **Private link · authentication required**. Show only Product-defined before/after effects. Success never auto-navigates or steals focus.

### S8 — Captured-in-review terminal

Show the exact two Product sentences and **Review date**, labeled **Private link · authentication required**. Do not show a Calendar date, receipt-time suggestion, View day, or date input. Review opens the exact matching frozen v11 item with a blank field and unchanged provenance.

### S9 — Capture failure and explicit Retry

Show T7's exact failure and state line, then **Try again**. Date instruction and caption remain visible. Retry is guarded and returns to **Waiting for durable capture…**. There is no automatic retry, background queue, optimistic destination, or duplicate branch.

### S10 — Change-date handoff

A focused read-only page contains:

- H1 **Change Journal Date**;
- source type;
- current Journal Date;
- immutable Original Timestamp;
- private-link cue;
- **Date change action is not part of this prototype.**

It has no date editor, picker, mutation, preview, or enabled save. V17 owns redating. Back restores the exact bot action and simulator scroll.

### S11 — Canonical inherited handoffs

- **View day** opens the inherited canonical Journal Day with the represented photo/count/cover result.
- **Review date** opens the exact frozen v11 unresolved item through the safe structural route and opaque in-memory item entry.
- Returning cannot resurrect a resolved item; the simulator reflects its already-resolved terminal outcome.

### S12 — Prototype fixture console

Add one full-width ruled group titled **Telegram Capture Companion · synthetic states** to inherited Prototype states. Use real labelled fieldsets and wrapping button groups:

- Scenario: Guide, T1–T7, Authorization, Media validation, Caption grammar.
- Authorization: group, other sender, other private chat, invalid/missing secret, forwarded authorized.
- Media: five accepted formats, filename-mismatch PNG, equality HEIF, animated, SVG, TIFF, PDF, RAW, disguised TIFF, malformed, over bytes, over pixels, over side.
- Caption: every required Product match, non-match, and review token.
- Operation: success, failure, rapid repeat, replay, navigate before completion, reset before completion, connection interruption, session interruption, partial media-group progress.

Fixture controls live only in memory, remain visually separate from product controls, and never call Telegram, a server, AI, or the network.

## 8. Fixed date, exact caption grammar, and media groups

The fixed prototype date is **13 August 2026** in **Asia/Kolkata**. Device clock, locale, and timezone never determine an outcome.

A date instruction exists only when the caption matches from its first character:

    ^(\d{4}-\d{2}-\d{2})(?:$|[ \t\r\n]+([\s\S]*))$

The exact-shaped token is parsed as a real Gregorian date.

- Valid dates through 2026-08-13 are accepted.
- Impossible, year-0000, or future exact-shaped tokens enter Needs Date Review.
- Remove the token and separator whitespace only.
- Preserve the Photo Caption remainder without punctuation, case, line-break, or internal-whitespace normalization.
- Retain the raw Telegram caption as provenance.
- Token-only input yields **No Photo Caption**.

These do not match the instruction grammar, remain the entire Photo Caption, and use Telegram receipt time:

- “ 2026-08-10 Market morning”
- “2026/08/10 Market morning”
- “2026-8-10 Market morning”
- “2026-08-10Market morning”

These exact-shaped tokens enter review:

- “2026-13-08 …”
- “2026-02-30 …”
- “0000-01-01 …”
- “2026-08-20 …”

For a media group:

- one caption-bearing fixture message supplies the date instruction to every received member sharing the opaque group identity;
- only the caption-bearing message receives the remainder;
- siblings show **No Photo Caption**;
- each message is authorized, validated, and represented durably and independently;
- rows remain in received order with an independent status;
- roll-up always says **received photos**, never complete album;
- no group identifier is shown;
- a partial state names only the members represented so far;
- the three-photo acknowledgement waits for all three independent successes;
- conflicting or multiple group-date captions are not invented in v12 and remain an unverified integration edge.

## 9. Authorization contract

Authorization is represented before any download.

Authorized means the synthetic fixture represents all of:

- valid webhook secret;
- configured numeric sender;
- configured private chat;
- group is false.

Product-visible status is:

> **Authorized private chat represented**

A forwarded photo remains eligible when the current sender and private chat match. Its original forward source is neither displayed nor used as authorization.

The four rejection fixtures are group chat, other sender, other private chat, and missing/invalid webhook secret. Their product surface is identical. It never reveals the failed check, allowlisted identity, chat ID, token, secret state, callback path, or media metadata. Rejection cannot advance to validation, capture, review, Calendar, Almanac, or a Retry that bypasses authorization.

## 10. Canonical capture fixtures

Every scenario reset restores its declared canonical v11-derived archive baseline and unique synthetic provider/checksum identity. Scenarios never accumulate one another's changes.

### T1 — ordinary compressed photo, receipt-date success

- Asset: existing synthetic rain-window.
- Source form: **Telegram photo message**.
- Decoded media: JPEG, 1,842,112 bytes, 3024 × 4032, still image.
- Telegram message time: 13 Aug 2026 7:58 am IST.
- Received by Life in Days: 13 Aug 2026 8:00 am IST.
- Raw caption and Photo Caption: **Morning rain on the balcony**.
- Journal Date: 13 August 2026 from receipt time.
- Before: visible day, 2 photos, 2 journals, existing real-photo Calendar Cover.
- After: 3 photos, 2 journals; appended chronologically; existing first real-photo cover remains.
- Bot: **Photo saved to 13 August 2026.**
- Actions: **View day** and **Change Journal Date**.

### T2 — image document, explicit historical date success

- Asset: existing synthetic flower-market.
- Source form: **Telegram image document**.
- Decoded media: HEIC, 6,482,944 bytes, 3024 × 4032, still image.
- Telegram message time: 13 Aug 2026 9:02 am IST.
- Received: 13 Aug 2026 9:03 am IST.
- Raw caption: **2026-08-10 Monsoon light through the window**.
- Photo Caption: **Monsoon light through the window**.
- Journal Date: 10 August 2026 from the explicit instruction.
- Before: no current day, 0 photos, 0 journals.
- After: visible day, 1 photo, 0 journals; this real Daily Photo becomes Calendar Cover.
- Bot: **Photo saved to 10 August 2026.**
- Actions: **View day** and **Change Journal Date**.

### T3 — three received media-group messages

- Assets in received order: flower-market, balcony-cups, rain-window.
- Each is a distinct synthetic JPEG photo-message rendition within every limit.
- Message times: 13 Aug 2026 9:20:00, 9:20:01, and 9:20:02 am IST.
- Represented receipt times: 9:21:00, 9:21:01, and 9:21:02 am IST.
- First raw caption: **2026-08-09** followed by a line break and **Sunday market flowers**.
- Journal Date: 9 August 2026 for all three.
- First Photo Caption: **Sunday market flowers**.
- Siblings: **No Photo Caption**.
- Before: no current day, 0 photos, 0 journals.
- After all three independent commits: visible day, 3 photos, 0 journals, received order, first Daily Photo as Calendar Cover.
- Roll-up: **3 received photos**.
- Bot: **3 received photos saved to 9 August 2026.**
- Actions: **View day** and **Change Journal Date**.

### T4 — forwarded authorized photo

- Uses T1's valid media/date path with a distinct synthetic identity.
- Forwarded is true; current sender and private chat match.
- Visible note: **Forwarded photo · current private chat authorization represented**.
- Original forward source is not displayed.
- The result uses T1 date/capture semantics.

### T5 — invalid leading date into the exact frozen v11 item

- Raw caption: **2026-13-08 Monsoon light through the window**.
- Entered date: 2026-13-08.
- Photo Caption: **Monsoon light through the window**.
- Telegram message: 12 Aug 2026 7:40 pm IST.
- Received and Added to review: 12 Aug 2026 7:41 pm IST.
- All handoff provenance is the exact frozen v11 invalid Telegram fixture.
- Only after represented media plus holding-record completion:

> **The photo is safe, but 2026-13-08 is not a valid Journal Date. Choose a date to add it to the calendar.**

> **It is in Needs Date Review and is not on the Calendar or Almanac.**

- Action: **Review date**.
- The handoff opens the same frozen v11 unresolved item/detail with blank Journal Date and no receipt-time suggestion.

### T6 — future leading date into the exact frozen v11 item

- Raw caption: **2026-08-20 A quiet street after rain**.
- Entered date: 2026-08-20.
- Photo Caption: **A quiet street after rain**.
- Telegram message: 12 Aug 2026 8:16 pm IST.
- Received and Added to review: 12 Aug 2026 8:17 pm IST.
- All handoff provenance is the exact frozen v11 future Telegram fixture.
- Only after represented media plus holding-record completion:

> **The photo is safe, but future Journal Dates are not supported in this version. Choose 13 August 2026 or earlier.**

> **It is in Needs Date Review and is not on the Calendar or Almanac.**

- Action: **Review date** with the same frozen handoff semantics.

### T7 — failure before durable commit, then explicit Retry

- Input: unique HEIF document, 4,104,192 bytes, 3024 × 4032.
- Raw caption: **2026-08-10 Station light before dawn**.
- Received: 13 Aug 2026 10:12 am IST.
- First attempt passes authorization and validation, then fails before represented media, thumbnail, or metadata commit.
- Failure:

> **Photo was not saved because Life in Days could not finish storing it. Nothing was added. The Telegram message remains in this chat.**

- State:

> **No Source Item · no Journal Day change · safe to retry**

- Action: **Try again**.
- Date instruction and caption remain intact.
- Retry reuses the same synthetic update/message identity, returns to pending, and ends exactly once with:

> **Photo saved to 10 August 2026.**

- There is no automatic retry and no duplicate item.
- The scenario reset uses the canonical v11-derived 10 August baseline, but the UI adds no Product-unspecified T7 counts, cover sentence, or extra action.

## 11. Media validation matrix

Prototype thresholds are inclusive synthetic arithmetic:

- at most 20,000,000 bytes;
- at most 100,000,000 pixels;
- neither dimension above 20,000 pixels.

This is a UI contract, not backend or Telegram proof.

Accepted decoded still formats are JPEG, PNG, WebP, HEIC, and HEIF. Required accepted controls include:

- each format;
- an extension-mismatch document that decodes as PNG;
- one HEIF exactly 20,000,000 bytes and 20,000 × 5,000 pixels.

Accepted copy:

> **Accepted for represented capture. This file decodes as <FORMAT> and is within every per-file limit.**

Every rejection creates no Source Item, holding record, Calendar change, or Almanac change and never says safe, saved, or imported. It adds:

> **No Source Item was created. The Telegram message remains in this chat.**

Exact first-line rejection copy is:

| Fixture | Exact copy |
| --- | --- |
| Animated WebP | **Photo not added. Animated images are not supported. Send a still JPEG, PNG, WebP, HEIC, or HEIF image.** |
| SVG, TIFF, PDF, RAW | **Photo not added. <TYPE> is not supported. Send a still JPEG, PNG, WebP, HEIC, or HEIF image.** |
| Filename says JPEG, decodes TIFF | **Photo not added. This file decodes as TIFF, which is not supported. The filename was not used to accept it.** |
| Malformed/decode failure | **Photo not added. Life in Days could not decode this file as a supported still image.** |
| 20,000,001 bytes | **Photo not added. This file is 20,000,001 bytes. The limit is 20,000,000 bytes (20 MB).** |
| 12,000 × 9,000 | **Photo not added. This image is 108 megapixels. The limit is 100 megapixels.** |
| 20,001 × 800 | **Photo not added. This image is 20,001 × 800 pixels. Neither side may exceed 20,000 pixels.** |

When several gates fail, one primary rejection appears in this order:

1. authorization;
2. decode;
3. animated or unsupported type;
4. byte size;
5. total pixels;
6. side length.

Other synthetic failures may appear only in prototype details and may not compete as primary product errors.

## 12. State machine and represented durable truth

Per image:

> idle/guide → received → authorizing → authorization-rejected

or:

> idle/guide → received → authorizing → validating → media-rejected

or:

> idle/guide → received → authorizing → validating → waiting-for-durable-capture → captured-valid / captured-in-review / capture-failed

Visible vocabulary is **Received**, **In progress**, **Complete**, **Needs attention**, or **Unavailable**.

Scoped pending copy is:

> **Waiting for durable capture…**

No outgoing bot acknowledgement exists in any intermediate state.

- Captured-valid atomically represents one Daily Photo attachment, destination count/visibility/cover recalculation, and one terminal acknowledgement.
- Captured-in-review atomically represents media plus one undated holding item and only then the safe/review acknowledgement.
- Capture-failed mutates nothing.
- Album members have independent identities and counts; a roll-up cannot turn partial success into total success.

Every active operation is bound to an opaque live-memory identity including fixture generation, scenario, represented message/update identity, album member when applicable, attempt, and intended terminal result.

Rapid activation, same-update replay, Retry, delayed completion, navigation, fixture/date change, reset, session change, connection interruption, or a newer attempt invalidates stale completion. At most one Source Item or holding item and one terminal acknowledgement result for the same synthetic identity. Reconnection never auto-resumes; explicit **Try again** is required.

This is same-update idempotency representation only. The v12 Telegram capture companion contains no Telegram-photo checksum match, **Already imported**, **Add duplicate anyway**, cross-day warning, shared Media Asset decision, or photo-duplicate cancel/permit branch. Those are exclusively v13. All v12 Telegram-photo fixtures have distinct synthetic checksums.

## 13. Private handoffs

Every bot action is visibly paired with:

> **Private link · authentication required**

This represents intent only. V34 owns actual human-access enforcement.

### View day

Opens the inherited canonical Journal Day for the represented destination and its exact Product-defined photo/count/cover result.

### Review date

Opens the exact matching frozen v11 unresolved item through its safe structural route and opaque live-memory entry. Item, date, and caption never enter the URL. A successful frozen v11 assignment keeps its one-time attach/remove/count behavior. Browser Back cannot resurrect the item, and the v12 simulator reflects the already-resolved terminal result.

### Change Journal Date

Opens only the read-only handoff specified in S10. It does not edit or mutate. V17 owns the real action.

Every handoff focuses its H1. Back restores the exact bot action and simulator scroll.

## 14. Privacy, history, interruption, and priority

No fixture, authorization branch, sender/chat/message/update/media-group/file identity, caption, chosen or derived date, operation token, result, Retry state, or focus selector may enter:

- URL;
- history payload;
- localStorage or sessionStorage;
- cookies;
- IndexedDB;
- Cache Storage or a service worker;
- clipboard;
- referrer or request;
- console;
- telemetry, analytics, or logs.

Only opaque live-memory entry IDs are allowed. There is no external request, Telegram call, provider call, AI call, or external asset. Synthetic captions may be visible in static page content but never in live announcements, transient success, toast, or the tab title. No source/provider identity appears in product DOM IDs.

The browser receives no numeric ID, bot token, secret state, webhook path, checksum, encryption key, storage location, or authenticated-link token. Rejected authorization shows no media fact. Telegram replies contain no journal excerpt, Generated Artwork, health/provider identifier, secret, or another date's title/text.

Inherited state priority is:

1. session ended or reauthentication;
2. initial loading or total server failure;
3. unsaved-Correction leave confirmation;
4. connection interruption;
5. v12 capture operation or handoff;
6. v11 date-review operation;
7. inherited month/request state;
8. item media state;
9. ready UI.

Higher states own recovery. Session interruption removes simulated private content. Connection interruption keeps rendered content readable but freshness-unknown, disables run/Retry, queues nothing, and never resumes work automatically.

Malformed direct fixture state fails closed to the inherited v11 ready/first-use Calendar default.

## 15. Semantics, focus, and live regions

- One H1 per page, logical headings, inherited landmarks, and skip link.
- Scenario controls are a labelled fieldset in the prototype console.
- Conversation is an ordered list; each stage or message is an article.
- Facts and outcomes use description lists.
- Do not use role=chat, a live log, or a fake application region.
- One polite v12 live region announces concise state only: received, authorization represented, validation outcome, waiting, saved date/count, entered review, or not saved.
- The live region never announces raw captions, filenames, IDs, the full conversation, or long rejection copy.
- Pending scopes busy state to the active path.
- One short rejection/failure may use alert semantics. Do not duplicate it in a toast or second live region.
- Opening the companion or a handoff focuses its H1.
- Starting a fixture retains the initiating control as a visible anchor while guarded.
- Failure/rejection focuses the short outcome heading.
- Success does not steal focus; its handoff actions follow next in DOM order.
- Frozen v11 owns Review-date focus.
- Back restores exact invoker and scroll.
- Fixture reset focuses the selected scenario heading.
- Back/Forward, album progress, Retry, rapid repeat, stale navigation/reset/date/fixture/connection/session callbacks, and review resolution always leave a visible logical focus target.
- Every action is keyboard and touch operable.
- All targets are at least 24 × 24 CSS pixels; compact primary actions are at least 44 × 44.
- Essential source, status, provenance, and error text uses at least the inherited 13/18 token.
- Focus, text, boundaries, accepted/review/rejected states, and disabled controls receive measured light/dark and forced-colour checks.
- Status never relies on colour.
- Reduced motion removes shimmer, pulse, translation, scale, chat-bubble entrance, and animated progress decoration. State remains understandable without a spinner.

V12 makes no formal accessibility or browser-conformance claim. V35 retains that closure.

## 16. Responsive contract

- **1440 × 900:** content max about 1180 px; 48–58 px gutters; header spans full width; conversation and outcome/guide use approximately 7/5 columns with one divider; conversation is first in DOM.
- **1280 × 720:** 32–40 px gutters; retain two columns only when each region keeps a comfortable measure; guide may continue below the fold.
- **960 × 900:** stack conversation, outcome, and guide in DOM order under inherited compact navigation.
- **700 × 900:** 20 px gutters; input facts may use two columns only when readable; actions wrap or take their own row.
- **390 × 844:** 16 px gutters; one-column flow; message surfaces max 100%; 4:5 preview about 112–144 px; terminal actions may become full width; safe area/bottom nav cannot cover them.
- **320 × 568:** 8–12 px gutters; facts, exact values, captions, byte/pixel counts, rejection copy, and media-group rows wrap; no min-content trap or horizontal page scroll.
- **568 × 320 landscape:** normal document scroll; header, guide, every group member, terminal action, and Back remain reachable without a clipped full-height panel.
- **200% text and 400% reflow-equivalent:** use compact order with no covered action or horizontal page scroll. V12 has no contained horizontal-scroll exception.

Both themes preserve hierarchy and state meaning. Sticky shell controls respect safe-area insets and never cover content or focus.

## 17. Required current-run visual evidence

The final exact fingerprint should include at least:

1. 01-1440x900-default-guide-light.png
2. 02-1440x900-t1-waiting-dark.png
3. 03-1440x900-t1-success-outcome-light.png
4. 04-1440x900-t2-document-backdate-dark.png
5. 05-1280x720-t3-three-received-photos-light.png
6. 06-1280x720-t4-forwarded-authorized-dark.png
7. 07-1280x720-generic-authorization-rejection-light.png
8. 08-960x900-media-accepted-boundaries-dark.png
9. 09-960x900-unsupported-or-decode-rejection-light.png
10. 10-960x900-limit-rejection-dark.png
11. 11-700x900-t5-invalid-review-light.png
12. 12-700x900-t6-future-review-dark.png
13. 13-700x900-t7-capture-failure-light.png
14. 14-700x900-t7-retry-success-dark.png
15. 15-390x844-settings-entry-and-return-light.png
16. 16-390x844-change-date-read-only-handoff-dark.png
17. 17-390x844-review-date-v11-handoff-light.png
18. 18-320x568-default-guide-light.png
19. 19-320x568-long-rejection-dark.png
20. 20-568x320-media-group-landscape-light.png
21. 21-640x900-200-percent-reflow-light.png
22. 22-320x900-400-percent-reflow-dark.png

Screenshots supplement but never replace live checks. The QA record also needs a full text matrix for accepted formats/equality, every rejection/precedence, every caption case, all operation branches, Back/focus/history, privacy surfaces, and frozen regressions.

## 18. Explicit exclusions and remaining owners

Relative to the frozen v11 product surface, the v12 Telegram capture companion adds no:

- v13 Telegram-photo checksum duplicate decision or duplicate-review control;
- v14 durable manual upload;
- v15–v16 Correction/conflict lifecycle;
- v17 actual redating or closure of LID-SCP-002;
- v18–v20 History, Trash, or Suppressions;
- v21 complete Photo Caption search;
- v22–v29 derived, AI, health, provider, or artwork lifecycle;
- v30 complete Daily Photo original/download/reorder/cover/Trash/private-description controls;
- v31–v33 storage, backup, recovery, or export;
- v34 real access/security or authenticated-link enforcement;
- v35 formal responsive/accessibility closeout.

It adds no sharing, public links, multi-user UI, web photo upload, AI photo/caption input, coaching, reminders, streaks, offline mode, blank journal editor, analytics, or external asset.

## 19. Independent exact-hash QA gate

A fresh independent agent is assigned only after every v12 UI byte is stable. QA binds its verdict to SHA-256 values for every UI artifact. Any v12 UI-byte change invalidates the verdict and restarts the complete gate.

A Pass requires zero unresolved Critical, High, Medium, and Low findings and verifies:

1. New v12 artifact inventory, package/syntax checks, links, console, and frozen v6–v11 byte comparison.
2. Settings entry, truthful inherited status, default guide, exact page hierarchy, Back/scroll/focus, reload reset, and no setup/connection claim.
3. Exact T1–T7 assets, values, timestamps, captions, dates, outcomes, bot copy, destination effects where Product defined them, and handoffs.
4. All four identical authorization rejections, rejection-before-download privacy, and forwarded authorized acceptance.
5. Every accepted format, extension-mismatch PNG, equality HEIF, every exact rejection, common no-Source line, and multi-failure precedence.
6. Anchored caption grammar, token-only behavior, every required non-match/review token, receipt-date behavior, historical explicit date, and no silent normalization.
7. Three independently processed received photos, one caption carrier, sibling no-caption state, received order, first-photo cover, partial-state truth, and no album-complete claim.
8. Pending, capture failure, explicit Retry, rapid repeat/replay, stale navigation/reset/date/fixture/connection/session paths, and at-most-one result/acknowledgement.
9. View day, bounded Change Journal Date, exact v11 Review date, Back/Forward/focus/no resurrection, and resolved simulator truth.
10. URL/title/history/storage/cookies/IndexedDB/cache/service-worker/clipboard/referrer/network/console/telemetry/log/DOM privacy boundaries.
11. Semantics, restrained live regions, busy/alert behavior, targets, focus, measured themes/forced colours, reduced motion, every named viewport, and reflow observation.
12. Inherited v6 Search, v7 Calendar, v8 Almanac, v9 readiness, v10 shell, v11 date review, populated archive, Settings, theme, history/focus, and forbidden-scope regressions.
13. Complete absence of Telegram-photo checksum or duplicate handling in the v12 companion, plus every later-owned or forbidden capability.

Implementation may begin under P/D/C = **A**, I = **IP**, Q = **—**. V12 becomes Complete only after the stable exact-hash independent Pass and recorded freeze. V13 remains queued until that freeze and, even after the dependency is satisfied, no v13 preparation or implementation may begin without Arun's explicit confirmation.
