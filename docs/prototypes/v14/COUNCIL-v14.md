# Life in Days prototype v14 — Product Council contract

Date: 2026-08-17
Package: **PVA-009 Durable Manual Upload**
Status: **Council Approved**

## 1. Council, authority, and disposition

- Product direction: **/root/v14_product_manager** — Product gate **A**.
- UI/UX contract: **/root/v14_ux_contract_final** — Design gate **A**.
- Product Council synthesis: **/root/v14_contract_docs** — Council gate **A**.
- Implementation: **/root** — Implementation gate **IP** until a stable candidate, evidence, and independent QA exist.
- Independent QA: a fresh agent is assigned only after the complete v14 candidate fingerprint and current-run evidence are held — QA gate **—**.

Authority order is Arun's direct decisions, [Product Requirements LID-UP-001–003](../../product/PRODUCT-REQUIREMENTS.md), [UX Specification UX-UPLOAD-01–06](../../design/UX-SPECIFICATION.md), [audit gap 12](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md), and this resolved Council contract.

The frozen [v13 Council contract](../v13/COUNCIL-v13.md), [v13 Telegram duplicate fixture sheet](../v13/TELEGRAM-DUPLICATE-FIXTURES-v13.md), [v13 handoff](../CALENDAR-UI-PROTOTYPE-v13.md), [v13 independent QA](../../../design-qa-v13.md), and [v13 guide](../../../prototypes/calendar-ui/README-v13.md) are inherited regression dependencies. V14 does not revise Telegram-photo duplicate semantics.

The authoritative v14 scenario ledger and exact evidence roster are [Upload Fixtures v14](./UPLOAD-FIXTURES-v14.md).

Product controls the exact facts, scope, strings, stage names, actions, errors, and zero-or-one outcomes. Design controls hierarchy, action order, responsive behavior, focus, announcements, and current-run evidence without changing Product outcomes.

There is no unresolved Product, Design, PRD, UX, or Council blocker.

## 2. Prototype question and permitted closure

V14 asks one bounded prototype question:

> Can the frozen private archive represent deliberate manual journal upload, original-byte duplicate decisions, an atomic zero-or-one result, truthful provenance, and derived pending or stale consequences without claiming that browser fixtures prove checksum, storage, durability, export, or backend behavior?

The sole permitted closure statement is:

> **V14 prototype-represents durable manual upload, exact-byte duplicate decisions, idempotent retry, original-file provenance, and derived pending/stale outcomes using deterministic fictional browser state. Checksum computation, encrypted storage, durable transactions, persistence, export/restore reproduction, backend idempotency, deployment, and production readiness remain unverified.**

The prototype may establish deterministic fictional layout, semantics, focus behavior, privacy surfaces, and live-memory transitions for the exact static candidate. It does not establish actual file retention, checksum calculation, byte-index correctness, encryption, transaction isolation, rollback, cross-process concurrency, restart durability, authentication, private-cache headers, export or restore reproduction, deployment, operations, or formal accessibility conformance.

## 3. Frozen v13 boundary

All passed v6–v13 UI, Council, fixture, handoff, guide, QA, and evidence bytes remain frozen. V14 is additive and uses v14-numbered artifacts only.

In particular, v14 must not:

- change v13 Telegram same-day or cross-day duplicate copy, actions, Media Asset representation, or fixture outcomes;
- relabel an Uploaded Journal as a Telegram Source Item;
- import Telegram's **Add duplicate anyway** action into manual upload;
- treat v13 represented image equality as proof of Uploaded Journal original-byte equality;
- weaken any inherited Search, routing, privacy, session, responsive, theme, or accessibility behavior.

The inherited v5 manual-upload behavior is not authoritative where it conflicts with this contract. Its decoded-text comparison, prefilled global date, in-memory saving claim, and old duplicate copy are specifically superseded for the v14 surface.

## 4. Final Council rulings

| Question | Binding ruling |
| --- | --- |
| Product gate | **A** |
| Design gate | **A** |
| Council gate | **A** |
| Global entry date | Blank and required. It never inherits today, the selected day, or a browsing date. |
| Inline entry date | The invoking Journal Date is visibly preselected and editable before submission. |
| Duplicate search scope | Archive-wide across **live Uploaded Journals** only. Filename and Journal Date do not limit equality. |
| Duplicate equality | Represented original-byte identity only. Decoded text, Markdown rendering, Unicode or whitespace normalization, filename, extension, and Journal Date are not equality inputs. |
| Match cardinality in v14 | Exactly zero or one live match. Trash-only, historical, permanently deleted, and multiple-match policy is deferred. |
| Duplicate choices | **Cancel**, then **Add anyway** in DOM and visual order. |
| Normal review choices | **Cancel**, then **Upload journal** in DOM and visual order. |
| Before commit | Back, Escape, backdrop dismissal, and Cancel may dismiss; they create no archive mutation. |
| After commit begins | Back, Escape, backdrop, date, file, and actions cannot imply cancellation. Inputs are locked and the operation remains visibly trackable until reconciliation. |
| Mutation outcome | One atomic represented commit creates the complete Uploaded Journal result, or creates nothing. No partial Journal Day, Source Item, provenance, or derived-state mutation is permitted. |
| Retry | Reuses the original operation identity and first checks its previous result. An unknown result can reconcile to zero or one, never create a second Source Item. |
| Derived behavior | New-day pending and existing-day stale/protected outcomes are representational only. V14 performs no AI request or generation. |
| Prototype disclosure | The exact no-storage/no-network disclosure remains adjacent to the upload state and persists at represented success. |

## 5. Exact scope

V14 closes only the frontend-prototype observability portion of **LID-UP-001**, **LID-UP-002**, **LID-UP-003**, **UX-UPLOAD-01–06**, and audit gap 12.

V14 includes:

- global and Journal Day inline **Upload journal** entry;
- one UTF-8 **.txt** or **.md** file per submission;
- the exact 1 MiB limit of **1,048,576 bytes**;
- an explicit Journal Date using fixed **Asia/Kolkata** rules;
- historical dates, today, and future-date rejection;
- safe local validation, decoding, and inert preview;
- filename, source type, exact byte size, Journal Date, Original Timestamp semantics, source identity, and privacy/prototype disclosures;
- archive-wide zero-or-one live Uploaded Journal equality;
- no-match, duplicate decision, Cancel, **Add anyway**, named progress, interruption, known failure, unknown result, reconciliation, retry, and already-completed result;
- one represented atomic Source Item outcome per operation identity;
- separate Uploaded Journals when repeated submissions are explicitly completed;
- new-day pending and existing-day stale/protected consequences;
- source-card and provenance representation after success;
- deterministic fictional fixtures and the exact 22-frame evidence roster.

## 6. Excluded and deferred behavior

V14 contains no:

- blank browser journal editor or general writing surface;
- PDF, Word, OCR, photo, audio, video, archive, directory, or multi-file upload;
- required drag-and-drop surface;
- real/private journal text, photo, or identifier;
- Correction, redating, merge, conflict resolution, revision browser, complete History, Trash, restore, purge, or Source Suppression work;
- decision for a Trash-only, historical-only, permanently deleted, or multiple live match;
- VoiceNotes import, Telegram capture change, or historical integration import;
- Search expansion, export wizard, backup or restore workflow, provider setup, sharing, public links, reminders, streaks, coaching, or semantic search;
- actual checksum, original-byte comparison, encrypted storage, persistence, durable transaction, cross-device idempotency, download, export, or restore proof;
- actual AI generation, provider request, title/summary/tag generation, artwork generation, or automatic artwork regeneration;
- authentication, deployment, production storage, operational readiness, or formal accessibility-conformance claim.

Multiple Uploaded Journals may belong to one Journal Day, but they remain separate Source Items and are never concatenated. A later newly initiated flow may create another duplicate only after its own fresh **Add anyway** decision.

## 7. Canonical terms and exact product copy

Use the canonical terms **Journal Day**, **Journal Date**, **Uploaded Journal**, **Source Item**, **Original Timestamp**, and **Derived Artifact**. Do not use “manual note,” “attachment,” “upload date,” “document memory,” or “AI journal” for this flow.

The following strings are Council-controlled and exact:

| Purpose | Exact copy |
| --- | --- |
| Entry action | **Upload journal** |
| Dialog heading | **Upload a journal** |
| Date label | **Journal Date** |
| Date help | **Journal Dates use Asia/Kolkata. Historical dates are allowed; future dates are not.** |
| File chooser | **Choose one .txt or .md file** |
| Constraint | **UTF-8 · up to 1 MiB · no Word, PDF, photo, or OCR files** |
| Review heading | **Review journal** |
| Source label | **Uploaded Journal** |
| Preview label | **Plain-text preview** |
| Privacy note | **This file remains an authentic source. Uploading does not send it to AI. Later derivation may use approved journal text—not the original file—with the configured Text Provider.** |
| Normal actions | **Cancel**; **Upload journal** |
| Duplicate heading | **This exact file is already in your archive.** |
| Duplicate explanation | **Cancel to leave the archive unchanged, or add this as a separate Uploaded Journal.** |
| Duplicate actions | **Cancel**; **Add anyway** |
| Success, canonical new day | **Journal added to 8 August 2026.** |
| Success action | **View day** |
| Duplicate provenance | **Added after exact-file duplicate warning** |
| Reconciliation stage | **Checking previous upload result** |
| Already-completed title | **Upload already completed** |
| Already-completed body | **This upload was already completed. No second Uploaded Journal was created.** |
| New-day derived status | **Waiting for source quiet period** |
| Existing-day derived status | **Source changed · refresh pending** |
| Prototype disclosure | **Prototype data · represented upload only. No file was stored, encrypted, or sent over the network.** |

The success sentence is a date-formatted template. The canonical fixtures use **Journal added to 8 August 2026.** and **Journal added to 13 August 2026.** The date is always the chosen Journal Date, never Original Timestamp or device-local time.

The prototype disclosure is adjacent to the dialog or operation state, not hidden in a footer, tooltip, settings page, or developer console. It remains present beside represented success and provenance.

## 8. Original identity and provenance contract

An Uploaded Journal keeps these facts distinct:

- exact original file bytes, represented but not actually stored;
- original filename as the source title;
- detected allowlisted source type;
- exact original byte size;
- receipt-time **Original Timestamp**;
- explicitly chosen **Journal Date**;
- represented original-byte identity used for equality;
- unique Source Item identity;
- explicit duplicate-override provenance when **Add anyway** was used;
- represented inclusion of the original and metadata in later download, export, and restore.

The prototype never displays a checksum value or claims that one was computed. “Represented original-byte identity” means only that a deterministic fictional equality fact is supplied to the reducer.

Duplicate equality is:

> equal if and only if the represented original byte sequence equals that of one existing live Uploaded Journal anywhere in the archive.

It is independent of:

- filename, extension spelling, chosen date, or Original Timestamp;
- decoded journal text;
- Unicode normalization;
- line-ending or whitespace normalization;
- a removed UTF-8 byte-order mark;
- Markdown rendering or sanitization;
- source title, preview, or derived content.

Same bytes under a different filename warn. Different bytes that produce the same post-decode journal text do not warn. An **Add anyway** success creates a distinct Uploaded Journal and Source Item; it does not overwrite, merge with, relabel, or mutate the existing source.

The v14 duplicate fixture represents at most one live match. The UI does not reveal the matching source's text, filename, date, Original Timestamp, internal identity, or represented equality token.

## 9. Pure transition model

The reference behavior is a pure reducer:

    reduce(uploadState, event) → nextUploadState + zero or one declared effect

The archive is not mutated by rendering, input handling, decoding, review, duplicate lookup, or error presentation. The only archive-writing effect is one atomic represented commit carrying an immutable snapshot of:

- operation identity;
- original-file fixture identity and metadata;
- filename;
- receipt-time Original Timestamp;
- chosen Journal Date;
- represented original-byte identity;
- optional duplicate-override provenance;
- applicable new-day or existing-day derived-state transition.

The state model contains:

| Field | Allowed meaning |
| --- | --- |
| generation | Live-memory generation used to reject stale callbacks |
| operation identity | One opaque live-memory identity reused through retry/reconciliation |
| entry point | global or inline |
| date | blank, valid, invalid, or locked snapshot |
| file | absent, local selected metadata/fixture, or locked snapshot |
| stage | choosing, validating, reviewing, checking, duplicate decision, uploading, saving, reconciling, success, or failure |
| commit phase | not started, pending/unknown, known zero, or settled one |
| override | absent or explicit Add anyway for this operation |
| result | zero or one represented Source Item |
| derived transition | none, new-day pending, or existing-day stale/pending |

Normative events are:

- **OPEN_GLOBAL**
- **OPEN_INLINE(date)**
- **SET_DATE(date)**
- **CHOOSE_FILE(file)**
- **LOCAL_READ_OK**
- **LOCAL_READ_FAILED**
- **VALIDATION_OK**
- **VALIDATION_FAILED(error)**
- **SUBMIT_REVIEW**
- **DUPLICATE_NO_MATCH**
- **DUPLICATE_ONE_LIVE_MATCH**
- **DUPLICATE_CHECK_FAILED**
- **CANCEL**
- **ADD_ANYWAY**
- **COMMIT_STARTED**
- **COMMIT_SUCCEEDED**
- **COMMIT_FAILED_KNOWN_ZERO**
- **COMMIT_RESULT_UNKNOWN**
- **RETRY**
- **RECONCILE_ZERO**
- **RECONCILE_ONE**
- **RECONCILE_FAILED**
- **CONNECTION_LOST**
- **CONNECTION_RESTORED**
- **BACK**
- **ESCAPE**
- **BACKDROP**
- **NAVIGATE**
- **RESET**
- **SESSION_EXPIRED**
- **CALLBACK(generation, operation identity, stage, result)**

### Transition invariants

1. Selecting a date or file, reading, decoding, validating, reviewing, checking, and deciding changes no archive fact.
2. A global operation cannot choose a file until its Journal Date is valid.
3. Changing the date or file before commit increments generation and invalidates every prior validation and duplicate result.
4. **Cancel**, Back, Escape, or backdrop before commit closes the flow, clears live-memory draft state, restores the invoker when available, and creates nothing.
5. **Upload journal** after no match, or **Add anyway** after one live match, may issue exactly one commit effect for the operation identity.
6. Commit atomically produces the complete Source Item, Journal Day relationship, original metadata, represented equality identity, override provenance where applicable, and derived transition, or produces none of them.
7. A failure before complete commit cannot create an empty Journal Day, orphan source, provenance row, stale marker, success announcement, or partial count change.
8. After commit begins, date/file controls and mutation actions are locked. Back, Escape, and backdrop do not dismiss or announce cancellation.
9. A callback is accepted only when generation, operation identity, and expected stage match the active state. Every stale or duplicate callback is a no-op.
10. The represented result count for one operation identity is always zero or one.
11. A result cannot move from settled one back to zero.
12. Retry first enters **Checking previous upload result** with the same operation identity.
13. Reconciliation to one renders already-completed truth and does not commit again.
14. Reconciliation to zero may retry the original atomic commit once through the same guarded operation.
15. A later fresh operation is not authorized by an earlier **Add anyway** decision.
16. A new Journal Day becomes visible only with settled represented success.

## 10. Named stages and visible outcomes

Progress uses words, never a fabricated percentage:

> **Validating file** → review → **Checking for an identical file** → duplicate decision or **Uploading original file** → **Saving Uploaded Journal** → represented success

Retry after a failure or unknown result first uses:

> **Checking previous upload result**

Stage behavior is exact:

| Stage | Required truth |
| --- | --- |
| **Validating file** | Local read, extension, size, strict UTF-8, and non-empty checks only. No archive or network mutation. |
| **Review journal** | Inert preview and complete metadata/privacy disclosure. No duplicate result is implied. |
| **Checking for an identical file** | Archive-wide represented lookup across live Uploaded Journals. No mutation and no success copy. |
| Duplicate decision | Exactly one live match is represented. **Cancel** is first; **Add anyway** is second. |
| **Uploading original file** | Commit has begun. Inputs/actions are locked; dismissal cannot imply cancellation. |
| **Saving Uploaded Journal** | The same atomic commit remains pending. No Source Item or Journal Day result is visible yet. |
| **Checking previous upload result** | Retry/reconciliation uses the original operation identity and cannot create a second source. |
| Represented success | Exactly one complete Source Item is visible with provenance and adjacent prototype disclosure. |

A no-match path proceeds from checking to the normal commit without any duplicate warning. An exact match stops at a zero-mutation decision. **Cancel** ends with zero mutation. **Add anyway** returns to the same commit path with override provenance.

## 11. Exact validation and error contract

| Condition | Exact copy | Required behavior |
| --- | --- | --- |
| Missing global date | **Choose a Journal Date before selecting a file.** | File chooser remains unavailable; nothing is read or changed. |
| Future date | **Future Journal Dates are not supported. Choose today or an earlier date in Asia/Kolkata.** | Keep the date field available for correction; do not choose a file or mutate. |
| Unsupported extension/type | **Choose a UTF-8 .txt or .md file. Word, PDF, photo, and OCR files are not accepted.** | Retain a valid date; reject before review. |
| Oversize | **This file is {actual size}. The maximum is 1 MiB (1,048,576 bytes).** | Show exact actual bytes; retain valid date; create nothing. |
| Invalid UTF-8 | **This file is not valid UTF-8 text. Nothing was changed.** | No replacement characters, truncation, preview, or partial item. Retain valid date. |
| Empty or whitespace-only | **This file has no journal text. Nothing was changed.** | Retain valid date; create nothing. |
| Local read failure | **This file could not be read. Choose it again.** | Clear unusable file state, retain valid date, and create nothing. |
| Duplicate-check failure | **Life in Days could not check for an identical file. Nothing was added. Retry.** | Fail closed. No fallback commit. File/date remain in open-tab memory. |
| Connection interruption | **Upload interrupted. Nothing was added. Your file and Journal Date remain selected in this tab. Retry.** | Use only for the deterministic known-zero interruption fixture. No auto-resume or offline queue. |
| Commit/server failure | **Journal wasn’t added. Your local file is unchanged and no Journal Day item was created. Retry.** | Known-zero failure; no Source Item, day, provenance, or derived change. |

The oversize placeholder is replaced by a locale-neutral exact byte count. The canonical fixture therefore reads:

> **This file is 1,048,577 bytes. The maximum is 1 MiB (1,048,576 bytes).**

Every error states what failed, whether anything changed, and one safe next action. Generic toasts do not replace inline errors. Error copy never includes journal text, a preview excerpt, an internal identity, or a checksum.

## 12. Duplicate, retry, race, and interruption contract

### Duplicate decision

The exact decision is:

- heading: **This exact file is already in your archive.**
- explanation: **Cancel to leave the archive unchanged, or add this as a separate Uploaded Journal.**
- actions in DOM order: **Cancel**; **Add anyway**.

Before either action, the archive is unchanged. **Cancel** dismisses and returns focus to the exact invoker when it still exists. **Add anyway** starts one locked atomic commit and, only after success, records:

> **Added after exact-file duplicate warning**

### Retry and unknown result

A known-zero duplicate-check or commit failure may retry explicitly. A lost completion response at or after the commit boundary is instead an unknown result: the UI must not claim success or failure until reconciliation and must not use the known-zero interruption copy.

Retry always:

1. reuses the original operation identity and immutable date/file snapshot;
2. shows **Checking previous upload result**;
3. reconciles to zero or one;
4. if one, renders **Upload already completed** and **This upload was already completed. No second Uploaded Journal was created.**;
5. if zero and retry remains allowed, re-enters the guarded original commit;
6. never creates a second Source Item from repeated Retry activation or callbacks.

Connection restoration never auto-resumes. The user explicitly selects Retry. Reload or session expiry loses the local-file handle and draft; neither serializes private upload state for later recovery.

### Guarded race outcomes

- Rapid double activation of **Upload journal**, **Add anyway**, or Retry issues one legal effect.
- Repeated validation, lookup, commit, reconciliation, or success callbacks for one generation settle once.
- Two concurrent handlers for the same operation identity still produce at most one Source Item.
- A commit-time archive check prevents two normal no-match paths for the same represented original bytes from silently creating ambiguous duplicates. A later operation must receive its own duplicate decision.
- Changing date or file, pre-commit Cancel, pre-commit Back/Escape/backdrop, navigation, reset, connection invalidation, or session expiry makes abandoned pre-commit callbacks stale.
- Navigation after commit cannot present cancellation. If the shell permits leaving, the operation remains trackable and must reconcile to zero or one; the v14 dialog may instead remain locked until result.
- Settled success survives duplicate callbacks and cannot emit a second success notification.

## 13. New-day and existing-day results

### New Journal Day

The canonical new-day success creates one represented Uploaded Journal on **8 August 2026**. Only after the complete commit callback:

- the Journal Day becomes visible;
- the source card shows authentic source/provenance facts;
- the terminal says **Journal added to 8 August 2026.**;
- **View day** opens the affected Journal Day;
- derived status says **Waiting for source quiet period**;
- title, summary, tags, Visual Brief, and artwork remain absent;
- no placeholder or fabricated generated value appears;
- no provider or AI request occurs.

### Existing Journal Day

The canonical existing-day success adds one separate Uploaded Journal to **13 August 2026**. Only after the complete commit callback:

- every prior authentic source remains unchanged;
- all current generated title, summary, tags, and artwork remain visible;
- affected derived content is labeled **Source changed · refresh pending**;
- protected fields remain protected and are not overwritten;
- current artwork remains unchanged and is not automatically regenerated;
- the new source is ordered by Original Timestamp with a deterministic tie-break;
- the day count increases by exactly one Uploaded Journal;
- no other Journal Day changes.

Both outcomes are browser representations only. They do not prove a scheduler, source-set hash, provider request, derived-version persistence, protected-field enforcement, or artwork job suppression outside the fixture reducer.

## 14. Modal, focus, Back, and history contract

- Opening the upload modal focuses **Upload a journal** or the first required control according to the exact scenario, without reading journal text aloud.
- Global entry begins at the required blank **Journal Date**.
- Inline entry exposes the preselected date and permits editing before file choice.
- Native file selection is fully keyboard and touch operable; drag-and-drop is not required.
- Focus remains visible and is not reset to page top by stage changes.
- Before commit, **Cancel**, Back, Escape, or backdrop dismisses with zero mutation and restores the exact invoking control and scroll position where it still exists.
- After commit begins, those dismissal inputs cannot close the flow in a way that implies cancellation. Date, file, **Cancel**, and submit actions are locked.
- A validation error focuses or associates the invalid control/error without announcing preview content.
- A duplicate decision focuses its heading only when focus is otherwise unclaimed; it never steals focus after the user moved it.
- A failure exposes an inline Retry and places a logical focus anchor on the failure region.
- A settled success focuses its terminal heading; **View day** focuses the destination Journal Day H1.
- Browser Back from **View day** restores the settled terminal and exact action without rerunning validation, duplicate checking, upload, saving, or announcements.
- Forward restores already-settled truth without creating another Source Item.
- History payload contains only an opaque live-memory entry identity. File/date/operation/result/focus values never enter browser history state.

## 15. Privacy, inert content, and browser-surface contract

For every fixture and lifecycle point:

- browser title remains **Life in Days**;
- URL and referrer contain structural route state only;
- original bytes, decoded text, filename, selected Journal Date, preview, represented equality token, duplicate decision, operation identity, result, and focus remain out of URL, hash, title, history payload, local storage, session storage, cookies, IndexedDB, Cache Storage, service workers, clipboard, analytics, telemetry, crash reports, console, logs, and generic toast copy;
- no file or upload state is put into redirect state;
- no external or provider request occurs;
- no journal excerpt is announced through a live region, alert, or success notification;
- product DOM IDs and test hooks contain no filename, date, source identity, equality identity, or text-derived value;
- reload and session expiry clear live-memory draft/operation state and return to a safe generic surface;
- private upload state is never represented as offline-available or queued for later;
- fixtures, screenshots, and QA use only deterministic fictional text.

Markdown review is inert plain text. HTML, scripts, event handlers, remote images, tracking pixels, links, embeds, and CSS never execute, load, navigate, or become focusable. The preview is not a Markdown interpretation and is not proof of production sanitization.

The original file, filename, original-byte identity, and preview are not AI inputs. V14 makes no AI request. The exact privacy note explains that a later approved derivation lane may use decoded journal text with the configured Text Provider.

## 16. Accessibility, responsive, and live-region contract

- Native controls and correct dialog semantics are required.
- The modal has one programmatic heading and an accessible description for date/file constraints and prototype truth.
- Keyboard order follows DOM order.
- Normal actions are **Cancel**, **Upload journal**; duplicate actions are **Cancel**, **Add anyway**.
- Focus is trapped only while the modal is open, without trapping the user indefinitely before commit.
- Primary compact actions prefer 44 × 44 CSS pixels and never fall below the WCAG 2.2 AA 24 × 24 floor.
- At compact widths, actions become full-width without changing DOM order.
- One concise polite atomic live region may announce stage, failure, duplicate-decision availability, and completion.
- It never announces journal text, preview content, filename, checksum/equality identity, operation identity, or the full duplicate body.
- Alert semantics are used only when not duplicated by the polite region or a toast.
- Only the active operation region owns busy semantics.
- Warning, error, pending, success, protected, and stale states use text/shape/icon cues in addition to color.
- Focus, text, and control boundaries meet inherited contrast targets in light, dark, and forced colors.
- Reduced motion removes nonessential transitions; state truth remains immediate.
- 200% text zoom and 400% page reflow preserve complete content and actions.
- Long filenames wrap or are safely truncated with an accessible full value; they never create page overflow.
- No state may clip error copy, preview, metadata, disclosure, action, focus ring, or **View day**.
- Existing frozen shell breakpoints and navigation remain intact.

Required live checks include 1440 × 900, 1280 × 720, 960 × 900, 700 × 900, 390 × 844, 568 × 320 landscape, 640 × 900 at 200% text zoom, and 320 × 900 at 400% page reflow.

## 17. Current-run evidence contract

The exact authoritative 22-frame roster, including basenames, viewport, theme, and state, is frozen in [Upload Fixtures v14](./UPLOAD-FIXTURES-v14.md#evidence-roster).

Evidence is accepted only when:

- every frame is generated after the final v14 UI hashes are held;
- each basename exactly matches the fixture sheet;
- exact pixel dimensions and RGB PNG format are verified;
- zoom/reflow frames are captured under their named zoom conditions;
- every PNG is visually inspected at original resolution;
- hashes are unique wherever the depicted state differs;
- repository bytes equal the inspected current-run bytes;
- no stale or superseded image is retained;
- any v14 UI-byte change invalidates all 22 frames and the entire interaction disposition.

Screenshots are visual evidence only. They do not replace keyboard, focus, live-region, privacy, storage, network, race, interruption, Back/Forward, or regression checks.

## 18. Independent QA, static checks, and stop rules

Independent QA starts from zero after a stable candidate fingerprint and all evidence exist. It covers:

- every exact string, action, stage, error, date, fixture, and before/after count;
- global blank-date and inline editable-date entry;
- valid txt/md/exact-limit, future date, unsupported type, oversize, invalid UTF-8, empty, hostile Markdown, and read failure;
- no match; same bytes/different filename; different bytes/same decoded text;
- duplicate Cancel and **Add anyway**;
- duplicate-check failure, interruption, known-zero commit failure, unknown result, retry, and already-completed reconciliation;
- rapid activation, duplicate callbacks, concurrent handlers, and stale generations;
- date/file change, Back/Escape/backdrop, navigation, reset, connection, reload, and session invalidation;
- new-day pending and existing-day stale/protected/artwork-unchanged results;
- source title, Original Timestamp, Journal Date, original identity representation, duplicate provenance, and export/restore representation without proof claims;
- focus, invoker return, destination handoff, Back/Forward, live-region restraint, keyboard/touch, target sizes, themes, forced colors, reduced motion, named viewports, 200% text zoom, and 400% reflow;
- URL, title, history, all browser storage, referrer, DOM identifiers, network, console, analytics, telemetry, crash-report, log, and generic-notification privacy;
- exact relative links, local-only runtime resources, syntax, served-byte parity, secrets inspection, and clean console;
- complete frozen v6–v13 byte and functional regression;
- absence of every excluded behavior.

Static validation before QA includes:

- syntax checks for every v14 runtime file;
- all Markdown links resolve;
- all local runtime resource references resolve;
- no external runtime resource is introduced;
- no credentials, provider IDs, real photos, private journal text, or personal identifiers exist;
- every available frozen check from v6 through v13 remains passing;
- the new v14 check, when added under separate authorization, passes;
- exact frozen v6–v13 hashes remain unchanged.

Stop rules are absolute:

1. Any unresolved Product/Design/Council contradiction returns Council to B and stops implementation/QA.
2. The first actionable independent-QA finding makes the candidate Failed and pauses the gate.
3. Any v14 UI-byte repair invalidates all 22 frames and restarts complete QA from zero.
4. Any frozen v6–v13 drift is an immediate blocker.
5. Pass requires zero unresolved Critical, High, Medium, or Low findings.
6. No screenshot, browser fixture, or passing frontend test can upgrade checksum, storage, durability, export/restore, authentication, deployment, or production status.

## 19. Proof boundary and later implementation evidence

V14 may represent:

- deterministic original-byte equality facts;
- an archive-wide live-only zero-or-one match;
- one atomic-looking zero-or-one result;
- guarded retry, reconciliation, race, and stale-callback outcomes;
- source provenance and represented export/restore inclusion;
- pending or stale derived consequences.

V14 cannot prove:

- an actual checksum algorithm or original-byte comparison;
- checksum-index correctness, uniqueness, collision handling, or archive coverage;
- encrypted original storage or filename/metadata storage;
- atomic database/object-store commit, rollback, or orphan cleanup;
- concurrency across workers, devices, processes, deploys, or restarts;
- durable idempotency or reconciliation after process failure;
- actual Original download, archive export, restore reproduction, or backup;
- production session, cache, logging, telemetry, network, or AI boundaries.

Later backend evidence must independently test actual bytes at 0, 1, 1,048,576, and 1,048,577 bytes; strict UTF-8; original preservation; checksum indexing; commit failpoints; idempotent retries; cross-process concurrency; restart reconciliation; encrypted storage; download equality; export/restore round trip; Trash/history lifecycle; and audit-safe observability.

## 20. Council completion conditions

Council remains **A** only while implementation preserves:

- every exact string, action order, stage, date, fixture fact, and outcome in this contract and the fixture sheet;
- archive-wide equality across live Uploaded Journals using represented original bytes only;
- the zero-or-one live-match fixture boundary;
- pre-commit dismissal with zero mutation and no post-commit cancellation implication;
- one atomic zero-or-one Source Item outcome per operation identity;
- fresh explicit **Add anyway** authorization for every later duplicate operation;
- adjacent persistent prototype/no-storage/no-network disclosure;
- representational-only derived pending/stale behavior;
- full privacy, focus, responsive, evidence, QA, and frozen-regression gates;
- the sole permitted closure statement in Section 2.

Any proposed scope expansion, copy change, lifecycle interpretation, or conflicting behavior returns the package to Council before implementation or QA continues.
