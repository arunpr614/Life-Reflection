# Life in Days prototype v14 — Upload fixture sheet

Date: 2026-08-17
Package: **PVA-009 Durable Manual Upload**
Status: **Council Approved**

This sheet is the authoritative deterministic scenario ledger and evidence roster for the [v14 Product Council contract](./COUNCIL-v14.md). It covers only the manual Uploaded Journal slice required by [LID-UP-001–003](../../product/PRODUCT-REQUIREMENTS.md), [UX-UPLOAD-01–06](../../design/UX-SPECIFICATION.md), and [audit gap 12](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md).

Product, Design, and Council gates are **A**. Implementation is **IP**. Independent QA is **—** until a stable candidate fingerprint and fresh current-run evidence exist.

## Fixture boundary

All content in this sheet is deterministic, fictional, local, and fixed to **13 August 2026 · Asia/Kolkata**. It contains no real/private journal text, photo, filename, identifier, provider data, or credential.

The reducer receives:

- fictional file metadata and represented bytes;
- a deterministic represented original-byte identity;
- a represented archive lookup result of exactly zero or one live Uploaded Journal;
- deterministic pending, failure, unknown-result, and settled callbacks.

The reducer does not calculate a real checksum, write a file, encrypt bytes, call a server, persist state, generate derived content, or reproduce an export/restore. No represented equality token or internal operation identity is product-visible.

V14 duplicate lookup is archive-wide across **live Uploaded Journals**, independent of filename and Journal Date. Equality uses represented original bytes only. The fixture sheet deliberately contains no:

- Trash-only or historical-only match;
- permanently deleted match;
- multiple-match result;
- merge or overwrite outcome;
- actual checksum value;
- actual storage, download, export, restore, or durability proof.

Those lifecycle questions remain deferred. A valid duplicate fixture has zero or one live match only.

## Shared clock and archive baseline

Every scenario resets to this baseline unless the row explicitly begins from a settled result.

| Fact | Canonical value |
| --- | --- |
| Prototype clock | 13 August 2026 · 9:40 pm · Asia/Kolkata |
| Today boundary | 13 August 2026 |
| New-day target | 8 August 2026 |
| New-day baseline | No Journal Day |
| Existing-day target | 13 August 2026 |
| Existing-day baseline | 2 journals · 2 photos |
| Existing live Uploaded Journal | evening-rain.txt |
| Existing Uploaded Journal size | 126 bytes |
| Existing Uploaded Journal Original Timestamp | 13 August 2026 · 4:42 pm |
| Existing Uploaded Journal Journal Date | 13 August 2026 |
| Existing represented original identity | OBI-A, documentation key only |
| Existing other journal | One fictional Voice Journal; never a duplicate candidate |
| Existing generated fields | Fictional current title, summary, and tags remain visible |
| Existing protected state | Title protected; no field may be overwritten by v14 |
| Existing artwork | One fictional current artwork remains unchanged; no new request |
| Match cardinality | Zero or one live Uploaded Journal |
| Browser persistence | None; reload resets to safe inherited state |

**OBI-A** and all other documentation keys are test-ledger labels only. They may exist in source-level fixture definitions, but never in product copy, product DOM IDs, URL, title, history payload, browser storage, network data, console, analytics, telemetry, crash reports, or logs.

## Canonical fictional file inventory

| Key | Filename | Represented bytes/type | Decoded-content purpose | Equality |
| --- | --- | --- | --- | --- |
| TXT-A | museum-margin.txt | 312 bytes · valid UTF-8 txt | Ordinary valid text | Unique |
| MD-A | museum-margin.md | 428 bytes · valid UTF-8 md | Ordinary valid Markdown source | Unique |
| LIMIT-A | exact-limit.txt | 1,048,576 bytes · valid UTF-8 txt | Exact accepted limit; begins with non-whitespace fictional text | Unique |
| OVER-A | one-byte-too-large.txt | 1,048,577 bytes · valid UTF-8 txt | Oversize rejection | Unique |
| UTF8-BAD | broken-sequence.txt | 94 bytes · invalid UTF-8 | Strict-decode rejection | Not checked |
| EMPTY-A | blank-page.md | 8 bytes · UTF-8 whitespace only | Empty rejection | Not checked |
| TYPE-A | notebook.pdf | 640 bytes · unsupported | Unsupported-format rejection | Not checked |
| READ-A | unreadable-fixture.txt | Metadata only; local read rejects | Read-failure recovery | Not checked |
| HOSTILE-A | fictional-archive-note-from-the-long-rainy-evening-train-platform.md | 354 bytes · valid UTF-8 md | Inert hostile-Markdown review | Unique |
| MATCH-A | copied-evening-rain.md | Exactly the same represented bytes as evening-rain.txt | Different filename and date, same original bytes | OBI-A live match |
| TEXT-A | same-words.txt | 83 bytes · valid UTF-8 without BOM | Same post-decode text pair | OBI-B unique |
| TEXT-B | same-words-with-bom.txt | 86 bytes · UTF-8 BOM plus TEXT-A bytes | Same text after allowed leading-BOM handling | OBI-C unique |
| EXISTING-A | market-awning.txt | 241 bytes · valid UTF-8 txt | No-match addition to existing day | OBI-D unique |

TXT-A and MD-A are separate valid-file fixtures. LIMIT-A proves the inclusive limit. OVER-A differs by exactly one byte. MATCH-A proves that filename and Journal Date do not limit equality. TEXT-A and TEXT-B prove that the same post-decode text does not imply original-byte equality.

All successful source titles use the exact original filename from this table.

## Hostile Markdown fixture

HOSTILE-A's complete fictional decoded text includes inert examples equivalent to:

    # Fictional archive note
    <script>document.body.textContent = "changed"</script>
    <img src="https://example.invalid/pixel" onerror="document.body.textContent='changed'">
    [external fixture](https://example.invalid/path)
    <style>body { display: none; }</style>

Required result:

- the **Plain-text preview** displays the characters as text;
- no heading, script, HTML element, style, image, link, event handler, or navigation is created from them;
- no remote request occurs;
- none of the rendered-looking content becomes focusable;
- preview text never enters a live-region announcement;
- review remains usable at every named viewport and zoom.

The fixture is a browser safety representation, not proof of production sanitization.

## Entry and Journal Date fixtures

| Key | Setup | Required result |
| --- | --- | --- |
| E1 | Open global **Upload journal** | Heading **Upload a journal**. **Journal Date** is blank and required. File chooser is unavailable. |
| E2 | Attempt file selection while E1 date is blank | **Choose a Journal Date before selecting a file.** No file read or archive mutation. |
| E3 | Set global date to 14 August 2026 | **Future Journal Dates are not supported. Choose today or an earlier date in Asia/Kolkata.** File chooser remains unavailable. |
| E4 | Set global date to 8 August 2026 | Date is valid under the fixed Asia/Kolkata boundary; file chooser becomes available. |
| E5 | Open inline from 13 August 2026 Journal Day | 13 August 2026 is visibly preselected and editable. |
| E6 | Change E5 to 8 August 2026 before selecting a file | New valid date controls the eventual result. Nothing is mutated. |
| E7 | Change date after validation, review, or duplicate decision but before commit | Prior validation/duplicate result becomes stale. The file may remain selected in memory, but validation and duplicate checking must settle again for the new snapshot. |
| E8 | Attempt to change date after commit begins | Input is locked. No date change or cancellation is represented. |

The exact date help is always available:

> **Journal Dates use Asia/Kolkata. Historical dates are allowed; future dates are not.**

No global flow inherits today, a selected calendar day, an Almanac chapter, a prior upload, or device-local time.

## File validation fixtures

All valid flows show:

- **Choose one .txt or .md file**
- **UTF-8 · up to 1 MiB · no Word, PDF, photo, or OCR files**

| Key | File | Required result |
| --- | --- | --- |
| V1 | TXT-A | Enter **Validating file**, pass strict validation, then show **Review journal**. |
| V2 | MD-A | Enter **Validating file**, pass, retain Markdown as authentic source text, and show inert preview. |
| V3 | LIMIT-A | Accept exactly 1,048,576 bytes and reach review. No arbitrary lower limit or truncation. |
| V4 | OVER-A | **This file is 1,048,577 bytes. The maximum is 1 MiB (1,048,576 bytes).** Retain valid date; create nothing. |
| V5 | UTF8-BAD | **This file is not valid UTF-8 text. Nothing was changed.** Retain valid date; create nothing. |
| V6 | EMPTY-A | **This file has no journal text. Nothing was changed.** Retain valid date; create nothing. |
| V7 | TYPE-A | **Choose a UTF-8 .txt or .md file. Word, PDF, photo, and OCR files are not accepted.** Retain valid date; create nothing. |
| V8 | READ-A | **This file could not be read. Choose it again.** Clear unusable file state, retain valid date, create nothing. |
| V9 | HOSTILE-A | Pass strict validation and show every character as inert plain text. No interpreted content or request. |
| V10 | Choose another file after any settled validation, review, or duplicate decision | Increment generation; discard prior decoded preview and match result; validate the new file. |

Invalid UTF-8 is rejected rather than decoded with replacement characters. Whitespace-only content is empty. No fixture silently truncates, normalizes, repairs, or re-encodes original bytes.

## Review fixture contract

The canonical review heading is:

> **Review journal**

Every valid review shows, in this order or an accessibility-equivalent order:

1. **Uploaded Journal**
2. exact filename as proposed source title;
3. detected source type;
4. exact byte size;
5. chosen **Journal Date**;
6. the **Asia/Kolkata** date cue;
7. receipt-time **Original Timestamp** semantics;
8. **Plain-text preview**;
9. source/original identity explanation without a checksum value;
10. exact privacy note;
11. adjacent exact prototype disclosure;
12. **Cancel**, then **Upload journal**.

Exact privacy note:

> **This file remains an authentic source. Uploading does not send it to AI. Later derivation may use approved journal text—not the original file—with the configured Text Provider.**

Exact adjacent disclosure:

> **Prototype data · represented upload only. No file was stored, encrypted, or sent over the network.**

Review creates no Journal Day, Source Item, provenance, equality record, count change, derived-state change, success announcement, storage entry, or request.

Long filenames wrap or truncate safely while retaining an accessible full value. The preview has a bounded visual reading area without hiding the complete fixture from keyboard access. Actions remain reachable and ordered.

## Ordered stage fixtures

The named path is:

> **Validating file** → **Review journal** → **Checking for an identical file** → no-match or duplicate decision → **Uploading original file** → **Saving Uploaded Journal** → represented success

Retry/reconciliation uses:

> **Checking previous upload result**

| Key | Stage | Required archive truth |
| --- | --- | --- |
| P1 | **Validating file** | Zero mutation |
| P2 | **Review journal** | Zero mutation |
| P3 | **Checking for an identical file** | Zero mutation |
| P4 | Duplicate decision | Zero mutation |
| P5 | **Uploading original file** | Atomic commit pending; no visible partial result |
| P6 | **Saving Uploaded Journal** | Same atomic commit pending; no visible partial result |
| P7 | **Checking previous upload result** | Reconciliation only; zero or prior one, never a second result |
| P8 | Represented success callback | Exactly one complete Source Item becomes visible atomically |

No percentage, byte-progress meter, “almost done,” background queue, or offline promise appears.

## Equality and duplicate fixtures

### Q1 — no match

Setup:

- target Journal Date: 8 August 2026;
- file: MD-A;
- represented archive result: zero live matches.

Required path:

> **Checking for an identical file** → **Uploading original file** → **Saving Uploaded Journal**

Required result:

- no duplicate decision;
- one atomic represented success only after the complete callback;
- exactly one new Uploaded Journal and Source Item;
- 8 August becomes visible only at success;
- no other day changes.

### Q2 — same bytes, different filename and date

Setup:

- existing live source: evening-rain.txt on 13 August 2026;
- incoming file: MATCH-A, named copied-evening-rain.md;
- target Journal Date: 8 August 2026;
- represented bytes: equal to OBI-A.

Filename, extension, and Journal Date differ, but the result is one live match. Exact decision:

- heading: **This exact file is already in your archive.**
- explanation: **Cancel to leave the archive unchanged, or add this as a separate Uploaded Journal.**
- actions in DOM order: **Cancel**; **Add anyway**.

The decision does not expose the matching source's filename, Journal Date, text, timestamp, internal identity, or equality token.

### Q3 — different bytes, same post-decode text

Setup:

- first live source uses TEXT-A;
- incoming file uses TEXT-B;
- the leading UTF-8 BOM is removed for displayed journal text;
- OBI-B and OBI-C are different original-byte identities.

Required result:

- represented lookup returns no match;
- no duplicate warning appears;
- normal commit may proceed;
- the two Uploaded Journals remain separate authentic originals.

Decoded-text equality, displayed-text equality, and visual equality are never used as duplicate equality.

### Q4 — duplicate Cancel

From Q2, choose **Cancel**.

Required result:

- dialog closes;
- exact invoker focus and scroll are restored when the invoker still exists;
- 8 August remains absent;
- 13 August remains at its baseline;
- no Source Item, provenance, derived transition, or success announcement is created;
- Back/Forward cannot revive the decision as a new operation.

### Q5 — duplicate Add anyway

From Q2, choose **Add anyway** once.

Required path:

> **Uploading original file** → **Saving Uploaded Journal** → represented success

Required result:

- exactly one distinct Uploaded Journal is added to 8 August;
- the existing 13 August Uploaded Journal is unchanged;
- original filename is copied-evening-rain.md;
- duplicate provenance says **Added after exact-file duplicate warning**;
- the two Source Items remain distinct;
- a later duplicate requires a new flow and fresh explicit **Add anyway**;
- no checksum value is displayed.

## Failure and recovery fixtures

### F1 — duplicate-check failure

The operation reaches **Checking for an identical file** but cannot settle a zero-or-one live result.

Exact result:

> **Life in Days could not check for an identical file. Nothing was added. Retry.**

Required truth:

- fail closed;
- no fallback upload;
- no Journal Day, Source Item, provenance, or derived mutation;
- file and valid date remain in the open tab's memory;
- Retry reuses the original operation identity;
- a successful Retry still reaches no-match or duplicate decision normally.

### F2 — connection interruption before complete commit

Exact result:

> **Upload interrupted. Nothing was added. Your file and Journal Date remain selected in this tab. Retry.**

Required truth:

- no success claim;
- no background or offline queue;
- no automatic resume when connection returns;
- the visible local selection remains only in open-page memory;
- Retry first enters **Checking previous upload result**;
- reload or session expiry loses the draft.

F2 deterministically represents an abort before the atomic commit boundary, so its zero statement is internally consistent. It is not the unknown-result fixture. When a completion response is lost at or after the boundary, use F4/F5 instead and do not present a known-zero assertion.

### F3 — known-zero commit failure

Exact result:

> **Journal wasn’t added. Your local file is unchanged and no Journal Day item was created. Retry.**

Required truth:

- atomic commit is represented as known zero;
- no source, day, original identity, provenance, count, stale marker, or pending derivation exists;
- Retry uses the same operation identity and first reconciles.

### F4 — unknown result reconciles to zero

Setup:

- commit result was lost;
- archive reconciliation finds no Source Item for the operation identity.

Required result:

- show **Checking previous upload result**;
- do not create anything during reconciliation;
- one guarded retry may re-enter commit;
- repeated Retry activation remains at most one outcome.

### F5 — unknown result reconciles to one

Setup:

- commit succeeded, but its response was lost;
- reconciliation finds exactly one complete Source Item for the operation identity.

Exact terminal:

- title: **Upload already completed**
- body: **This upload was already completed. No second Uploaded Journal was created.**

Required truth:

- normal success facts and **View day** are available;
- exactly one Source Item exists;
- no second commit, duplicate warning, or success mutation occurs;
- the adjacent prototype disclosure remains visible.

### F6 — reconciliation failure

If the previous result still cannot be established:

- remain fail closed;
- create nothing new;
- do not claim zero or success;
- keep one explicit Retry path while the page and session remain valid;
- never loop or auto-resume.

## Rapid action, callback, and concurrent-intent fixtures

| Key | Setup | Required invariant |
| --- | --- | --- |
| R1 | Rapidly activate **Upload journal** twice for one review | One lookup/commit path; at most one Source Item. |
| R2 | Rapidly activate **Add anyway** twice | First legal activation locks controls; at most one override commit and one Source Item. |
| R3 | Rapidly activate Retry twice | One reconciliation effect; no duplicate commit. |
| R4 | Deliver duplicate validation callbacks | Only the callback matching active generation/stage can settle. |
| R5 | Deliver duplicate no-match or live-match callbacks | One branch settles; the other is a stale no-op. |
| R6 | Deliver duplicate commit-success callbacks | Exactly one Source Item, count increment, derived transition, and terminal. |
| R7 | Deliver failure after a settled success callback | Settled one cannot regress to failure or zero. |
| R8 | Two handlers submit the same operation identity concurrently | Atomic guard settles zero or one; never two. |
| R9 | Two fresh normal flows race with the same represented original bytes | At most one may commit without override; the other must reconcile to the live duplicate decision. |
| R10 | Start a later fresh duplicate flow after prior success | It requires a new explicit **Add anyway** decision; prior permission is not reused. |

Every effect carries the active generation and opaque operation identity. Neither value is product-visible or persisted.

## Date, file, navigation, reset, connection, and session invalidation

| Key | Interruption | Required result |
| --- | --- | --- |
| S1 | Change Journal Date during validation, review, checking, or duplicate decision | Increment generation; invalidate old callbacks and match result; revalidate/recheck for the new snapshot. |
| S2 | Choose another file during validation, review, checking, or duplicate decision | Increment generation; clear old preview/match; old callbacks cannot mutate. |
| S3 | **Cancel**, Back, Escape, or backdrop before commit | Dismiss with zero mutation and restore invoker focus/scroll where possible. |
| S4 | Back, Escape, or backdrop after commit begins | Do not dismiss or announce cancellation; keep operation locked and trackable. |
| S5 | Navigate away before commit | Invalidate draft generation; no later callback may create a result. |
| S6 | Navigate after commit begins | Cannot imply cancellation. Preserve a trackable operation or prevent leaving; reconcile to zero or one. |
| S7 | Reset before commit | Restore baseline, increment generation, and ignore abandoned work. |
| S8 | Reset request after commit begins | Cannot erase or imply cancellation of pending work; settle/reconcile first. |
| S9 | Connection lost before commit | Show interruption, retain local date/file in this tab only, queue nothing. |
| S10 | Connection lost during commit | If the fixture confirms abort before the atomic boundary, settle through known-zero F2. If the completion response is lost at or after the boundary, mark unknown and reconcile through F4/F5. Never choose a result optimistically. |
| S11 | Connection restored | No automatic validation, lookup, upload, commit, or Retry. |
| S12 | Reload before or during an operation | Do not serialize file/text/date/identity; return to safe inherited state. |
| S13 | Session expires | Clear file/text/date/preview/decision/operation from memory; show inherited session gate. |
| S14 | Represented reauthentication | Return to a generic safe route; never restore or auto-resume upload state. |

## Success fixtures

### N1 — new Journal Day

Setup:

- global Journal Date: 8 August 2026;
- file: MD-A;
- receipt-time Original Timestamp: 13 August 2026 · 9:42 pm;
- represented match: none.

Before success:

| Fact | Value |
| --- | --- |
| 8 August visibility | Absent |
| Uploaded Journals on 8 August | 0 |
| Generated title/summary/tags/artwork | None |

After the complete atomic callback:

| Fact | Value |
| --- | --- |
| Terminal | **Journal added to 8 August 2026.** |
| Action | **View day** |
| 8 August visibility | Visible |
| New Uploaded Journals | Exactly 1 |
| Source title | museum-margin.md |
| Journal Date | 8 August 2026 |
| Original Timestamp | 13 August 2026 · 9:42 pm |
| Derived status | **Waiting for source quiet period** |
| Generated title/summary/tags/artwork | Absent; nothing fabricated |
| AI/provider request | None |

### N2 — existing Journal Day

Setup:

- inline preselected Journal Date: 13 August 2026;
- file: EXISTING-A;
- receipt-time Original Timestamp: 13 August 2026 · 9:44 pm;
- represented match: none.

Before/after:

| Fact | Before | After |
| --- | --- | --- |
| 13 August visibility | Visible | Visible |
| Journal count | 2 | 3 |
| New Uploaded Journal | None | Exactly 1 |
| Source title | None | market-awning.txt |
| Existing authentic sources | Baseline | Unchanged |
| Existing generated title/summary/tags | Current | Preserved |
| Protected title | Protected | Protected and unchanged |
| Current artwork | Current | Unchanged |
| Artwork request | None | None |
| Derived status | Current | **Source changed · refresh pending** |
| Other Journal Days | Baseline | Unchanged |

Source ordering uses Original Timestamp with a deterministic fixture tie-break. Journal Date does not overwrite Original Timestamp.

### N3 — duplicate override success

Setup is Q5. Required source card includes all N1 provenance plus:

> **Added after exact-file duplicate warning**

The existing source remains unchanged. No source merge or overwrite occurs.

## Source-card and provenance fixtures

After represented success only, the Uploaded Journal card and provenance representation expose:

| Field | Required truth |
| --- | --- |
| Source label | **Uploaded Journal** |
| Source title | Exact original filename |
| Journal Date | Exact chosen date in Asia/Kolkata |
| Original Timestamp | Receipt time, distinct from Journal Date |
| Source type | Validated txt or md type |
| Size | Exact original byte count |
| Original identity | Represented as exact-file identity without displaying a checksum/token |
| Separate-source semantics | This Uploaded Journal is not concatenated with another source |
| Duplicate provenance | **Added after exact-file duplicate warning** only after explicit override |
| Original lifecycle | Represented as belonging in explicit original download and complete archive export/restore |
| Proof boundary | Actual stored bytes, checksum, encryption, download equality, durability, export, and restore remain unverified |

The exact adjacent disclosure remains:

> **Prototype data · represented upload only. No file was stored, encrypted, or sent over the network.**

A source card never claims that an original can actually be downloaded from this static fixture. Representation of future download/export/restore membership is not round-trip evidence.

## Focus, Back, and live-region fixtures

| State change | Required focus/announcement |
| --- | --- |
| Open global flow | Focus dialog heading or required blank **Journal Date**; accessible name identifies **Upload a journal**. |
| Open inline flow | Focus heading or visible preselected date; invoking date remains clear. |
| Validation begins | Preserve deliberate user focus; only active operation is busy. |
| Validation error | Associate/focus error or invalid control; retain valid date where required. |
| Review | Focus review heading only when focus is unclaimed; do not announce preview. |
| Duplicate decision | Guarded heading focus only when unclaimed; concise decision-available announcement without file/date/text. |
| Duplicate Cancel | Close and restore exact invoker/scroll; no mutation announcement. |
| Commit begins | Lock inputs/actions; Back/Escape/backdrop cannot imply cancellation. |
| Failure | Logical focus anchor on inline failure and Retry; no duplicate alert/live announcement. |
| Reconciliation | Announce only the named stage; no filename, text, or operation identity. |
| Success | Focus terminal; concise completion announcement without excerpt or filename. |
| **View day** | Focus destination Journal Day H1. |
| Browser Back | Restore settled terminal and exact action/scroll without rerun. |
| Browser Forward | Restore settled truth without another lookup, commit, or announcement. |

One concise polite atomic live region is permitted. It never contains original bytes, journal text, preview, filename, checksum/equality token, internal identity, or complete error/decision prose. A short alert must not duplicate the polite region or a toast.

## Privacy and browser-surface assertions

Inspect every applicable fixture before, during, after, after Back/Forward, after reload, and after session interruption:

- title is **Life in Days**;
- URL and hash contain structural route state only;
- history payload contains only an opaque live-memory entry identity;
- local storage, session storage, cookies, IndexedDB, Cache Storage, and service workers contain no upload state;
- clipboard and referrer contain no upload state;
- no request contains file/date/text/preview/equality/decision/operation/result/focus state;
- no external or provider request occurs;
- console, analytics, telemetry, crash reports, and logs contain none of those values;
- product DOM IDs and test hooks contain no private or source-derived values;
- generic toasts and live regions contain no filename or journal excerpt;
- reload and session loss cannot recover a draft or pending operation;
- the prototype disclosure remains adjacent and truthful;
- only fictional fixture text is present.

HOSTILE-A produces zero requests and no interpreted DOM. V14 produces zero AI requests for every file.

## Visual, responsive, and interaction assertions

Every applicable fixture is checked in light, dark, system theme, forced colors, and reduced motion.

Required assertions:

- native dialog, input, button, and link semantics;
- visible keyboard focus and logical DOM order;
- 24 × 24 CSS-pixel target floor and 44 × 44 preferred compact primary actions;
- full-width stacked actions at compact widths without order reversal;
- long filename, preview, metadata, privacy note, disclosure, error, and Retry remain reachable;
- warning, error, pending, success, protected, and stale states do not rely on color;
- no horizontal page overflow, clipped copy, overlap, covered focus, or unreachable action;
- background content is inert while the modal is open;
- scroll lock does not hide content or actions;
- reduced motion removes nonessential transitions;
- 200% text zoom and 400% page reflow preserve the complete task;
- 568 × 320 landscape keeps the duplicate decision and both actions readable and reachable.

## Evidence roster

These 22 basenames, viewports, themes, and depicted states are exact and authoritative. Files belong in **docs/prototypes/v14/**. Do not substitute v13 naming or retain extra superseded frames.

| # | Exact file basename | Viewport / zoom | Theme | Required state |
| --- | --- | --- | --- | --- |
| 01 | v14-01-global-blank-date-light.png | 1440 × 900 | Light | Global **Upload a journal**: Journal Date blank and required; file chooser unavailable. |
| 02 | v14-02-inline-date-preselected-dark.png | 1440 × 900 | Dark | Inline entry: invoking Journal Date visibly preselected and editable. |
| 03 | v14-03-validating-file-light.png | 1440 × 900 | Light | Named local stage **Validating file**. |
| 04 | v14-04-hostile-markdown-review-dark.png | 1440 × 900 | Dark | **Review journal**: complete metadata/privacy and hostile Markdown shown as inert plain text. |
| 05 | v14-05-oversize-error-light.png | 1280 × 720 | Light | Oversize rejection shows actual bytes and 1 MiB/1,048,576-byte limit; valid date retained. |
| 06 | v14-06-invalid-utf8-error-dark.png | 1280 × 720 | Dark | Invalid UTF-8 rejection; nothing changed; valid date retained. |
| 07 | v14-07-identical-file-check-light.png | 1280 × 720 | Light | Named stage **Checking for an identical file**. |
| 08 | v14-08-duplicate-decision-dark.png | 1280 × 720 | Dark | Exact-file duplicate decision with DOM/action order **Cancel**, **Add anyway**. |
| 09 | v14-09-duplicate-cancel-return-light.png | 960 × 900 | Light | Duplicate Cancel settled: dialog closed, exact invoker focus restored, archive unchanged. |
| 10 | v14-10-uploading-after-override-dark.png | 960 × 900 | Dark | **Uploading original file** after explicit **Add anyway**; inputs/actions locked. |
| 11 | v14-11-saving-no-match-light.png | 960 × 900 | Light | No-match path at **Saving Uploaded Journal**; atomic commit still pending. |
| 12 | v14-12-duplicate-check-failure-dark.png | 960 × 900 | Dark | Duplicate-check failure; nothing added; explicit Retry. |
| 13 | v14-13-connection-interruption-light.png | 700 × 900 | Light | Upload interrupted; file/date retained in tab; nothing added; Retry. |
| 14 | v14-14-commit-failure-dark.png | 700 × 900 | Dark | Commit/server failure; local file unchanged; no Journal Day item; Retry. |
| 15 | v14-15-retry-reconciliation-light.png | 700 × 900 | Light | Retry/reconciliation in progress using the original operation identity. |
| 16 | v14-16-idempotent-completed-result-dark.png | 700 × 900 | Dark | Unknown-result replay reconciled to already-completed success; exactly one Source Item. |
| 17 | v14-17-represented-success-200pct-light.png | 640 × 900 at 200% text zoom | Light | Represented success, **View day**, and persistent no-storage/no-network prototype disclosure. |
| 18 | v14-18-new-day-pending-200pct-dark.png | 640 × 900 at 200% text zoom | Dark | New Journal Day source/provenance plus **Waiting for source quiet period**; no fabricated derived fields. |
| 19 | v14-19-existing-day-stale-mobile-light.png | 390 × 844 | Light | Existing-day source card; prior generated values preserved; **Source changed · refresh pending**; protected/artwork state unchanged. |
| 20 | v14-20-long-review-mobile-dark.png | 390 × 844 | Dark | HOSTILE-A's long exact filename and inert plain-text preview reflow; metadata and full-width actions remain reachable in DOM order. |
| 21 | v14-21-duplicate-landscape-light.png | 568 × 320 landscape | Light | Long duplicate decision and **Cancel**/**Add anyway** remain readable, ordered, and reachable. |
| 22 | v14-22-long-error-400pct-dark.png | 320 × 900 at 400% page reflow | Dark | Long failure copy plus Retry; no horizontal page overflow or covered focus/action. |

Evidence acceptance requires:

- fresh current-run RGB PNGs generated only after final v14 UI hashes are held;
- exact basenames, pixel dimensions, zoom settings, and themes;
- original-resolution visual inspection of every frame;
- unique hashes wherever depicted states differ;
- repository bytes equal inspected bytes;
- no stale, extra, or superseded evidence frame;
- regeneration of all 22 frames after any v14 UI-byte change.

Screenshots do not prove interaction, focus, announcements, races, privacy, storage, network, durability, or regression.

## Independent QA scenario matrix

Independent QA starts from zero and covers:

| Group | Required fixtures |
| --- | --- |
| Entry/date | E1–E8 |
| Validation | V1–V10 |
| Review/security | Complete review contract and HOSTILE-A |
| Ordered stages | P1–P8 |
| Equality/duplicate | Q1–Q5 |
| Failures/recovery | F1–F6 |
| Rapid/race | R1–R10 |
| Invalidation | S1–S14 |
| Success/derived | N1–N3 |
| Provenance | Every source-card field and proof-boundary assertion |
| Focus/history/live | Every focus, Back/Forward, and announcement row |
| Privacy | Every browser-surface assertion at all lifecycle points |
| Responsive | All 22 frames plus forced colors, reduced motion, keyboard/touch, target sizes, and overflow checks |
| Regression | Frozen v6–v13 bytes and complete functional behavior |
| Exclusions | No deferred lifecycle, format, AI, integration, storage, export, or production behavior |

Pass means the deterministic browser candidate represents a deliberate one-file upload that ends in an atomic zero-or-one Uploaded Journal, protects against represented exact-original duplicates, preserves authentic-source provenance, and truthfully shows derived pending/stale consequences.

It still does not verify actual checksum calculation, file storage, encryption, durability, transactionality, idempotency outside the browser fixture, original download, export/restore reproduction, backend behavior, deployment, or production readiness.
