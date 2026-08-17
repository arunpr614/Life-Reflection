# Life in Days prototype v13 — Telegram duplicate fixture sheet

Date: 2026-08-16
Package: **PVA-008 Telegram Duplicate Handling**
Status: **Council Approved**

This sheet is the authoritative scenario ledger for the [v13 Product Council contract](./COUNCIL-v13.md). It extends the frozen [v12 Telegram fixture sheet](../v12/TELEGRAM-FIXTURES-v12.md) only for Telegram-photo duplicate decisions.

Product, Design, and Council gates are **A**. Implementation is **IP**. Independent QA is **—** until a stable candidate fingerprint and current-run evidence exist.

## Fixture boundary

All fixtures are deterministic, fictional, local, and fixed to **13 August 2026 · Asia/Kolkata**.

The fixture reducer may receive an opaque deterministic synthetic equality token or a precomputed represented-match boolean. It never calculates a checksum from image bytes. No checksum value may enter product copy, DOM IDs, URL, title, history, browser storage, request data, console, telemetry, analytics, or logs. A represented match means that a different synthetic Telegram update/message identity has the same represented plaintext-image bytes as the existing Media Asset.

Documentation keys in this sheet are scenario labels only. They are never placed in product DOM IDs, URL, title, history payload, browser storage, request data, console, telemetry, analytics, or logs.

The fixture sheet covers valid, live, single-match cases only. It deliberately contains no decision for:

- a duplicate in Needs Date Review;
- a match found only in Trash;
- multiple prior-date matches;
- Uploaded Journal duplicate behavior;
- actual redating, caption Search, full photo controls, storage lifecycle, authentication, or formal conformance.

The inherited Uploaded Journal surface remains unchanged:

- **This exact text is already present.**
- **Add duplicate anyway**

That surface is not a checksum/Media Asset fixture and does not close LID-UP-003.

## Shared baseline

Every scenario resets to one canonical archive before it runs unless its row explicitly begins from a settled result.

| Fact | Canonical value |
| --- | --- |
| Prototype time | 13 August 2026 · Asia/Kolkata |
| Existing Journal Date | 13 August 2026 |
| Existing Daily Photo | p-rain · rain-window |
| Represented format | JPEG |
| Represented bytes | 1,842,112 bytes |
| Represented dimensions | 3024 × 4032 |
| Existing Photo Caption | The shower arrived all at once |
| Existing Original Timestamp | 13 August 2026 · 4:38 pm |
| Existing cover | p-rain remains Calendar Cover |
| Existing 13 August counts | 2 photos · 2 journals |
| Latest inherited Daily Photo time | 7:21 pm |
| Existing 10 August state | No Journal Day |
| Matched relationship | 1 represented Media Asset · 1 Daily Photo reference |

The relationship count is scoped only to the matched represented byte sequence. It is not a total archive inventory and is not a claim about physical or encrypted storage.

## Incoming message fixtures

### SD — different message, same represented bytes, same Journal Date

| Fact | Value |
| --- | --- |
| Provider identity | Different from the existing settled source and every replay identity |
| Represented match | true |
| Source form | Telegram photo message |
| Message time | 13 August 2026 · 9:11 pm |
| Received time | 13 August 2026 · 9:12 pm |
| Raw caption | Rain on the glass, sent again |
| Date instruction | None |
| Journal Date source | Telegram receipt date |
| Target Journal Date | 13 August 2026 |
| Photo Caption | Rain on the glass, sent again |

### XD — different message, same represented bytes, another Journal Date

| Fact | Value |
| --- | --- |
| Provider identity | Different from the existing settled source, SD, and every replay identity |
| Represented match | true |
| Source form | Telegram image document |
| Message time | 13 August 2026 · 9:31 pm |
| Received time | 13 August 2026 · 9:32 pm |
| Raw caption | 2026-08-10 Monsoon light through the window |
| Leading instruction | 2026-08-10 |
| Target Journal Date | 10 August 2026 |
| Photo Caption | Monsoon light through the window |

SD and XD deliberately differ in provider identity, target date, and caption while matching the same represented bytes. These differences cannot suppress the match or overwrite the existing Daily Photo's facts.

## Ordered path fixtures

The inherited authorization, media validation, and date/caption interpretation order remains exact. The v13 branch adds:

> **Checking for identical bytes…**

The canonical path is:

> Received → Authorizing → Validating → Checking for identical bytes… → no-match continuation or duplicate decision

Rules:

- Rejected authorization or media validation never reaches duplicate checking.
- No-match continues the frozen v12 **Waiting for durable capture…** and success path.
- Match stops at a zero-mutation decision.
- Cancel never enters durable capture.
- Explicit permit alone returns to **Waiting for durable capture…**.
- The represented mutation and success terminal appear together.
- Only the active ordered path owns busy semantics.
- No intermediate state creates a Telegram success acknowledgement.

## Default and no-match fixtures

| Key | Setup | Required result |
| --- | --- | --- |
| D0 | Default companion, no selected synthetic activity | Frozen v12 default guide plus the exact seventh guide item. No duplicate decision or represented-media block. |
| NM1 | Frozen v12 T1 valid message with represented match false | Runs **Checking for identical bytes…**, then continues the exact frozen v12 waiting and success path. No duplicate copy or shared-media relationship. |
| NM2 | Any inherited authorization or validation rejection | Stops at the inherited rejection. Duplicate checking is not shown and no archive state changes. |

Exact seventh guide item:

> **If the same photo is found on the same Journal Date, Life in Days does not add it again unless you choose Add duplicate anyway. If it already appears on another date, Life in Days names only that date and lets you decide.**

## Same-day fixture matrix

### SD1 — checking

Starting state is the shared baseline. SD is authorized, validated, and interpreted as 13 August before showing:

> **Checking for identical bytes…**

While pending:

- no decision is visible;
- no Daily Photo or Source Item exists for SD;
- no success acknowledgement is visible;
- 13 August remains 2 photos/2 journals;
- p-rain remains cover;
- the represented-media relationship block is absent.

### SD2 — Already imported decision

Exact product result:

- H2: **Already imported**
- Body: **This exact photo is already in 13 August 2026. Nothing new was added.**
- Decision choices in DOM order: **Cancel**; **Add duplicate anyway**
- Visually separate following action: **View 13 August 2026**
- Cue: **Private link · authentication required**

Decision-state truth:

| Field | Expected value |
| --- | --- |
| 13 August counts | 2 photos · 2 journals |
| New Daily Photo | None |
| New Source Item | None |
| Existing Photo Caption | Unchanged |
| Incoming caption-bearing source | None |
| Cover | p-rain, unchanged |
| Matched relationship | 1 represented Media Asset · 1 Daily Photo reference |
| Telegram success acknowledgement | None |

### SD3 — Cancel

Exact terminal:

- H2: **Duplicate not added**
- Body: **Nothing was added. The existing Daily Photo is unchanged.**
- State: **No new Daily Photo · no Journal Day change · no Media Asset change**

Expected truth:

- the entire SD2 baseline remains exact;
- no incoming caption-bearing Source Item exists;
- no Telegram success reply is represented;
- decision actions are removed;
- focus moves stably to the terminal H2;
- replay, Back, and Forward cannot recreate the decision as a new operation.

### SD4 — permit

The only legal transition is explicit **Add duplicate anyway**. It returns to:

> **Waiting for durable capture…**

Exact terminal:

> **Duplicate photo added to 13 August 2026.**

Expected truth:

| Field | Before | After |
| --- | --- | --- |
| 13 August photos | 2 | 3 |
| 13 August journals | 2 | 2 |
| Matched represented Media Assets | 1 | 1 |
| Matched Daily Photo references | 1 | 2 |
| New Daily Photo | None | Exactly one |
| New Source Item | None | Exactly one |
| New Photo Caption | None | Rain on the glass, sent again |
| New Original Timestamp | None | 13 August 2026 · 9:11 pm |
| Existing Photo Caption | The shower arrived all at once | Unchanged |
| Cover | p-rain | p-rain |
| Success acknowledgements for SD | 0 | 1 |

The new 9:11 pm item follows the inherited 7:21 pm item. **View day** opens 13 August. There is no another-day provenance link and no ordinary Calendar, Almanac, or Timeline duplicate badge.

After terminal success only, the ruled relationship block contains:

- **Represented media relationship**
- **Two distinct Daily Photos are represented as using one shared Media Asset.**
- **Prototype representation only · checksum matching, encryption, stored bytes, durable references, and physical deduplication are not verified.**

## Cross-day fixture matrix

### XD1 — checking

Starting state is the shared baseline. XD is authorized, validated, and interpreted as 10 August before showing:

> **Checking for identical bytes…**

While pending:

- 10 August remains absent;
- 13 August remains 2 photos/2 journals;
- no incoming Source Item, decision, acknowledgement, or relationship block exists.

### XD2 — another-day decision

Exact product result:

- H2: **This photo is already used on another day**
- Body: **This exact photo already appears on 13 August 2026. It can also be added to 10 August 2026.**
- Decision choices in DOM order: **Cancel**; **Add to 10 August 2026 anyway**
- Visually separate following action: **View 13 August 2026**
- Cue: **Private link · authentication required**

The warning may expose only **13 August 2026**. It never exposes that day's title, journal text, summary, tags, caption, thumbnail description, provider identity, internal ID, checksum, or Media Asset ID.

Decision-state truth:

| Field | Expected value |
| --- | --- |
| 10 August | Absent |
| 13 August | 2 photos · 2 journals |
| New Daily Photo | None |
| New Source Item | None |
| Incoming caption-bearing source | None |
| Existing cover/captions | Unchanged |
| Matched relationship | 1 represented Media Asset · 1 Daily Photo reference |
| Telegram success acknowledgement | None |

### XD3 — Cancel

Exact terminal:

- H2: **Duplicate not added**
- Body: **Nothing was added. The existing Daily Photo is unchanged.**
- State: **No new Daily Photo · no Journal Day change · no Media Asset change**

Expected truth:

- 10 August remains absent;
- 13 August remains 2 photos/2 journals with unchanged cover and captions;
- one represented Media Asset/one matched reference remains;
- no incoming caption-bearing Source Item exists;
- no Telegram success reply is represented;
- focus moves to the terminal H2.

### XD4 — permit

The only legal transition is explicit **Add to 10 August 2026 anyway**. It returns to:

> **Waiting for durable capture…**

Exact terminal:

> **Photo added to 10 August 2026.**

Expected truth:

| Field | Before | After |
| --- | --- | --- |
| 10 August visibility | Absent | Visible |
| 10 August photos | 0 | 1 |
| 10 August journals | 0 | 0 |
| 10 August cover | None | New Daily Photo |
| 13 August photos/journals | 2 / 2 | 2 / 2 |
| 13 August cover/captions | Canonical baseline | Unchanged |
| Matched represented Media Assets | 1 | 1 |
| Matched Daily Photo references | 1 | 2 |
| New Source Item | None | Exactly one |
| New Photo Caption | None | Monsoon light through the window |
| New Original Timestamp | None | 13 August 2026 · 9:31 pm |
| Success acknowledgements for XD | 0 | 1 |

Terminal actions and provenance are distinct:

1. Destination **View day** opens the newly affected **10 August 2026** day.
2. **Same media as another day** is followed by **View 13 August 2026** and **Private link · authentication required**.

A reciprocal 13 August detail link to 10 August is allowed but not required. No ordinary Calendar, Almanac, or Timeline tile badge appears.

The same ruled **Represented media relationship** block and prototype-unverified boundary from SD4 appear only after terminal success.

## Failure and retry fixtures

### LF1 — duplicate lookup failure

The operation passes inherited authorization, validation, and date/caption interpretation but cannot settle the represented match.

Exact product result:

- H2: **Duplicate check could not finish**
- Body: **Nothing was added because Life in Days could not check for an existing photo.**
- Action: **Try again**

Required truth:

- fail closed;
- no fallback addition;
- no Daily Photo, Source Item, Media Asset relationship change, or success acknowledgement;
- canonical day counts, cover, and captions remain exact;
- failure H2 receives focus;
- Try again repeats lookup for the same represented identity;
- a successful retry reaches the applicable decision, never an automatic permit.

### CF1 — permit commit failure

The fixture reaches SD2 or XD2, receives explicit permission, enters **Waiting for durable capture…**, then fails before the represented terminal mutation.

Exact product result:

- H2: **Duplicate photo was not added**
- Body: **Life in Days could not finish saving the new Daily Photo. Nothing changed.**
- Action: **Try again**

Required truth:

- zero new Daily Photos, Source Items, references, days, covers, captions, and success acknowledgements;
- no represented-media relationship block;
- failure H2 receives focus;
- Try again reuses the same permitted operation;
- repeated retry/callback delivery yields at most one terminal reference and acknowledgement.

## Identity, replay, and concurrency fixtures

| Key | Setup | Required invariant |
| --- | --- | --- |
| ID1 | Replay the same provider update/message identity while its operation is pending | Guarded no-op; no second lookup, decision, permit, mutation, or acknowledgement. |
| ID2 | Replay the same identity after Cancel | Restores settled Cancel truth without a new warning or action. |
| ID3 | Replay the same identity after permit success | Restores settled success truth; no second warning, acknowledgement, Daily Photo, Source Item, or reference. |
| ID4 | Deliver a different message identity with the same represented bytes | It receives its own duplicate decision. Prior permission does not authorize it. |
| ID5 | Rapidly activate one permit control | Only the first legal activation enters pending; at most one reference and acknowledgement result. |
| ID6 | Deliver repeated completion callbacks for one permitted operation | At most one Daily Photo, Source Item, reference, and terminal acknowledgement. |
| ID7 | Two different message identities with the same represented bytes settle concurrently | Each creates one reference only if each is separately permitted. Both reuse one represented Media Asset. |
| ID8 | Permit only one of two concurrent different identities | Exactly one incoming reference is added; the unpermitted identity remains zero-mutation. |

For two separately permitted different identities, the represented relationship is one matched Media Asset with the original reference plus one reference per settled permit. This is deterministic fixture arithmetic, not proof of a global checksum index, transaction, reference count, or physical object reuse.

## Stale work, connection, and session fixtures

| Key | Interruption | Required result |
| --- | --- | --- |
| ST1 | Navigate away during checking | Pending callback is a stale no-op. Return shows only already-settled archive truth. |
| ST2 | Navigate away after permit but before commit | No background mutation or acknowledgement. Explicit action is required after a valid return state. |
| ST3 | Reset during checking or commit | Increment generation, restore canonical baseline, and ignore abandoned callbacks. |
| ST4 | Change selected fixture during checking or commit | New fixture begins from its own canonical reset; prior callback cannot alter it. |
| ST5 | Change represented date before completion | Prior callback cannot create a result on either old or new date. |
| ST6 | Cancel before a permit commit settles | Cancel invalidates the pending generation; the stale commit cannot add a reference. |
| CN1 | Connection interruption at a decision | Content stays readable/freshness-unknown; Cancel, permit, View, Run, and Retry controls affected by freshness are disabled; nothing queues. |
| CN2 | Connection returns | No automatic lookup, permit, retry, mutation, or acknowledgement; the user explicitly resumes an allowed action. |
| CN3 | Connection interruption during pending work | No hidden completion or reconnect auto-resume. Settled durable fixture truth, if any, never regresses. |
| SS1 | Session interruption at any private state | Session gate replaces the private surface and removes message, caption, decision, match, relationship, and operation state. |
| SS2 | Represented reauthentication | Returns to a safe inherited default; never restores or resumes the private operation automatically. |

## Private handoff fixtures

All View actions display **Private link · authentication required**. V34 owns real enforcement.

| Source state | Action | Destination | Return contract |
| --- | --- | --- | --- |
| SD2 | View 13 August 2026 | Existing 13 August Journal Day | Focus destination H1; Back restores exact link and scroll; no lookup rerun. |
| SD4 | View day | Updated 13 August Journal Day | Shows 3 photos/2 journals and unchanged cover; Back restores exact action and scroll. |
| XD2 | View 13 August 2026 | Existing 13 August Journal Day | Shows canonical existing-day truth only; Back restores decision link and scroll. |
| XD4 | View day | Newly visible 10 August Journal Day | Shows 1 photo/0 journals, new cover, incoming caption/timestamp; Back restores destination action and scroll. |
| XD4 | View 13 August 2026 provenance | Existing-reference 13 August Journal Day | Shows existing day unchanged and quiet date-only provenance where implemented; Back restores exact provenance link and scroll. |

Forward restores already-settled truth without rerunning lookup, recreating a decision, adding another reference, or emitting another acknowledgement. The captured date, fixture identity, match, operation, outcome, and focus remain outside URL and history payload.

## Focus and live-region fixtures

| State change | Required focus/announcement |
| --- | --- |
| Checking begins | Do not steal moved focus. Only the active ordered path is busy. |
| Decision settles while focus is unclaimed/BODY | Guarded fallback may focus the decision H2. |
| Decision settles after the user moved focus | Preserve user focus. |
| Cancel or permit removes its controls | Focus the terminal H2. |
| Lookup or commit failure | Focus the failure H2. |
| View handoff | Focus destination H1. |
| Back | Restore exact invoker and scroll. |
| Forward | Restore truth without rerun. |

One concise polite atomic v13 live region is allowed. It never includes raw caption, filename, checksum, provider identity, full decision copy, or another day's private content. A short alert must not be repeated by the polite region or a toast.

## Privacy assertions

For every fixture, inspect before, during, after, after Back/Forward, after reload, and after session interruption:

- title is **Life in Days**;
- URL is structural only;
- history payload contains only an opaque live-memory entry ID;
- local storage, session storage, cookies, IndexedDB, Cache Storage, and service workers contain no v13 state;
- clipboard and referrer contain no v13 state;
- requests contain no fixture, date, caption, decision, match, checksum, media/reference identity, operation, outcome, or focus data;
- console, telemetry, analytics, and logs contain none of those values;
- no external request occurs;
- DOM IDs contain no provider, update, message, checksum, Media Asset, Source Item, caption, or private-source identity;
- a cross-day decision names only 13 August 2026;
- captions never enter toasts, live announcements, or AI paths;
- no checksum value or internal Media Asset ID is product-visible.

## Visual, responsive, and interaction assertions

Every applicable fixture is exercised in light, dark, system theme, forced colors, and reduced motion.

Required checks:

- native buttons and links;
- keyboard order follows DOM order;
- visible focus survives theme and forced colors;
- 24 × 24 CSS-pixel target floor and 44 × 44 compact/touch actions;
- full-width decision actions at 390px and below;
- essential type remains at least 13px/18px;
- warning, failure, and success remain distinguishable without color;
- no horizontal page overflow, clipping, overlap, covered focus, unreachable action, or unreachable guide;
- ≤960px stacks banner-to-console in the exact inherited order;
- long cross-day heading and permit action fit at 320px, 568 × 320 landscape, and 400% reflow.

Named live sizes are 1440 × 900, 1280 × 720, 960 × 900, 901px, 700 × 900, 390 × 844, 320 × 568, 568 × 320, 640 × 900 at 200%, and 320 × 900 at 400%. The 960/961 boundary receives an explicit stack/split check.

## Evidence roster

All frames are fresh current-run RGB PNGs generated only after the final v13 UI hashes are held.

| File | Required state |
| --- | --- |
| 01-1440x900-duplicate-guide-default-light.png | Default guide, including exact seventh item |
| 02-1440x900-same-day-checking-dark.png | SD1 checking |
| 03-1440x900-same-day-already-imported-light.png | SD2 decision |
| 04-1440x900-same-day-add-success-dark.png | SD4 success |
| 05-1280x720-same-day-cancel-light.png | SD3 Cancel |
| 06-1280x720-cross-day-decision-dark.png | XD2 decision |
| 07-1280x720-cross-day-permit-success-light.png | XD4 success |
| 08-1280x720-cross-day-cancel-dark.png | XD3 Cancel |
| 09-960x900-duplicate-check-failure-light.png | LF1 |
| 10-960x900-add-failure-retry-dark.png | CF1 |
| 11-960x900-replay-unchanged-light.png | ID3 |
| 12-700x900-same-day-decision-light.png | SD2 stacked |
| 13-700x900-cross-day-warning-dark.png | XD2 stacked |
| 14-700x900-shared-media-provenance-light.png | XD4 relationship/provenance |
| 15-390x844-same-day-decision-dark.png | SD2 compact |
| 16-390x844-cross-day-success-private-link-light.png | XD4 both private handoffs |
| 17-390x844-day-provenance-return-dark.png | Destination provenance and exact Back return |
| 18-320x568-long-same-day-decision-light.png | SD2 narrow copy/actions |
| 19-320x568-long-error-retry-dark.png | LF1 or CF1 narrow retry |
| 20-568x320-cross-day-landscape-light.png | XD2 landscape |
| 21-640x900-200-percent-reflow-light.png | Decision reflow at 200% |
| 22-320x900-400-percent-reflow-dark.png | Long decision/retry at 400% |

Acceptance requires exact dimensions, RGB format, original-resolution visual inspection, current-fingerprint provenance, unique hashes for different depicted states, and repository-byte equality. A v13 UI-byte change invalidates every frame and requires all 22 to be regenerated.

## Independent QA scenario matrix

Independent QA starts from zero and covers:

| Group | Required fixtures |
| --- | --- |
| Default/no match | D0, NM1, NM2 |
| Same day | SD1, SD2, SD3, SD4 |
| Cross day | XD1, XD2, XD3, XD4 |
| Failures | LF1, CF1, successful explicit retries |
| Identity/race | ID1–ID8 |
| Stale/interruption | ST1–ST6, CN1–CN3, SS1–SS2 |
| Handoffs | Every decision, destination, provenance, Back, and Forward row |
| Accessibility | Focus/live-region table, keyboard, busy, alert deduplication, targets |
| Responsive | Every named viewport, theme, forced colors, reduced motion, 200%/400% |
| Privacy | Every privacy assertion across all relevant lifecycle points |
| Regression | Frozen v6–v12 byte and functional suites; inherited Uploaded Journal duplicate behavior |
| Exclusions | No Needs Date Review duplicate, Trash-only decision, multi-match decision, or v14+ behavior |

At the first actionable finding, QA reports immediately and pauses. Any UI-byte repair invalidates all evidence and QA results. Pass requires zero unresolved Critical, High, Medium, or Low findings.

## Represented versus backend proof

These fixtures may show:

- a supplied equal-checksum match boolean;
- same-update replay versus different-message equal-byte behavior;
- one represented Media Asset with one or two references;
- zero-or-one browser mutations;
- guarded retry and race outcomes.

They cannot prove:

- plaintext checksum calculation or actual byte equality;
- encrypted or physical object reuse;
- uniqueness constraints or checksum indexes;
- transactional atomicity, rollback, or orphan prevention;
- concurrency across processes or restarts;
- provider idempotency;
- durable reference counts, Trash lifecycle, or last-reference deletion;
- persistence, restore, backup, export, authentication, integration, deployment, or operations.

Backend closure requires separate transactional, concurrent, failpoint, restart, reference-lifecycle, and stored-object reconciliation evidence.

The sole permitted closure statement is:

> **Telegram duplicate decisions are prototype-represented with deterministic synthetic checksum and Media Asset fixtures; plaintext checksum calculation, encrypted asset reuse, durable reference creation, transactional race prevention, backend idempotency, persistence, Telegram integration, and authenticated links remain unverified.**
