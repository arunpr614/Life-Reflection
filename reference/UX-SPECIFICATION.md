# Life in Days — UX specification

- **Document owner:** Product Council — UI/UX Design Lead
- **Updated:** 2026-08-14
- **Status:** Comprehensive planning contract with fictional v1–v10 prototype inputs; no working application interface has been implemented, tested, or deployed
- **Product boundary:** Private, single-user responsive web application
- **Primary user:** Arun
- **Journal timezone:** Fixed `Asia/Kolkata`
- **Locale conventions:** `en-IN`, Monday-first calendar

This specification translates the confirmed discovery decisions into an interaction and presentation contract. The dated [P0 execution authorization](../council/execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md), not this document by itself, governs implementation, evaluation, credentials, and deployment. Task-specific Product, Architecture, Design, QA, dependency, authority, and council gates must still pass before implementation begins. If this document conflicts with the governing PRD or a higher-precedence direct Product Owner decision, this document must be corrected.

## 1. Source references and requirement notation

The following short references are used throughout this document:

| Reference | Canonical source |
| --- | --- |
| `REQ-PRODUCT` | `REQUIREMENTS.md` — Product and audience |
| `REQ-PROVENANCE` | `REQUIREMENTS.md` — Daily model and provenance |
| `REQ-CAPTURE` | `REQUIREMENTS.md` — Capture surfaces |
| `REQ-AI` | `REQUIREMENTS.md` — AI boundary |
| `REQ-RECOVERY` | `REQUIREMENTS.md` — MVP and recovery |
| `REQ-REFLECTION` | `REQUIREMENTS.md` — Reflection experience |
| `REQ-OPS` | `REQUIREMENTS.md` — Access, lifecycle, and operations |
| `REQ-DEFERRED` | `REQUIREMENTS.md` — Explicitly deferred |
| `LANG` | `CONTEXT.md` — canonical domain language |
| `TEXT-EVAL` | `AI-TEXT-MODEL-EVALUATION.md` |
| `ART-EVAL` | `AI-ARTWORK-MODEL-EVALUATION.md` |
| `MEDIA-EVAL` | `MEDIA-STORAGE-EVALUATION.md` |

Normative UX requirements use an identifier such as `UX-CAL-01`. “Must” is required for MVP, “should” is a strong design recommendation, and “may” is optional only when implementation capacity permits without displacing a must.

## 2. Experience promise

Life in Days should feel like opening a carefully kept private archive, not operating an ingestion dashboard and not speaking to an AI coach. The experience should make authentic memories easy to trust, daily photographs pleasant to revisit, and corrections safe to make without hiding history. `REQ-PRODUCT`, `REQ-REFLECTION`

The core experience loop is:

1. Arun continues journaling in VoiceNotes and sending photographs through Telegram.
2. Life in Days quietly assembles those authentic Source Items into a Journal Day.
3. The application may add clearly labeled Derived Artifacts without replacing the sources.
4. Arun revisits days through an image-first Calendar, Monthly Almanac, deterministic Search, and Journal Day detail.
5. When an import, date, derivation, backup, or provider needs attention, the application explains the specific condition without implying that the authentic memory was lost.

### 2.1 Jobs to be done

- **Recall:** “When I look at a month, help me recognize the texture of my life through its real photos and clearly labeled artwork.”
- **Revisit:** “When I open a day, let me see the photographs, concise interpretation, and full authentic journals without confusing one for another.”
- **Trust:** “When upstream text changes or I correct something, show me exactly what changed and preserve the evidence.”
- **Manage:** “When an item has the wrong date, is duplicated, or should be removed, let me fix it without silent loss.”
- **Recover:** “When the system has a problem, show whether capture, backup, restore evidence, storage, and AI budgets are healthy in factual language.”
- **Leave safely:** “When I want a portable copy, let me create a complete, encrypted, restorable export.”

## 3. Experience principles

### 3.1 Truth before polish

`UX-PRIN-01` Authentic Source Items and AI-created Derived Artifacts must never share labels, visual treatment, or provenance language that could make them seem equivalent. `REQ-PROVENANCE`, `REQ-AI`

`UX-PRIN-02` A real Daily Photo must always outrank Generated Artwork in Calendar Cover selection. Generated Artwork must be disclosed as `AI artwork` in its accessible name and wherever the artwork is selected, opened, or inspected; the Calendar tile itself uses progressive disclosure and no persistent source-type overlay chip. `REQ-AI`

`UX-PRIN-03` The UI must distinguish “captured,” “processed,” “generated,” “backed up,” and “restore verified.” One state must never be used as evidence for another.

### 3.2 Reflection before administration

`UX-PRIN-04` The signed-in landing surface must be the current month calendar, not a health dashboard, task list, streak, prompt, or setup checklist. `REQ-REFLECTION`, `REQ-DEFERRED`

`UX-PRIN-05` Operational conditions should remain quiet when healthy and become specific, actionable, and easy to find when attention is required.

### 3.3 Calm, not coercive

`UX-PRIN-06` Copy must be warm and observational. It must not coach, diagnose, praise consistency, shame gaps, count streaks, or treat an empty day as failure. `REQ-PRODUCT`, `REQ-AI`, `REQ-DEFERRED`

`UX-PRIN-07` Motion, color, and notifications must be restrained. No celebratory confetti, urgency animation, or red error state is appropriate for an ordinary day without a photo or artwork.

### 3.4 Reversible by default, deliberate when permanent

`UX-PRIN-08` Routine edits, redating, active-version selection, and Trash restoration should be easy to reverse. Permanent deletion, unencrypted export, source re-import, and removal of every artwork version require explicit consequence copy. `REQ-PROVENANCE`, `REQ-OPS`

### 3.5 Private by construction and honest about limits

`UX-PRIN-09` The interface must not claim end-to-end encryption, zero knowledge, India-local AI processing, high availability, or a recovery result that has not been measured. `REQ-OPS`

`UX-PRIN-10` Real photos, their bytes, metadata, identifiers, thumbnails, and photo-derived descriptions must never be presented as AI inputs. Provider settings must state that only approved journal text or a minimized Visual Brief crosses the selected boundary. `REQ-AI`

### 3.6 Single-user efficiency

`UX-PRIN-11` The product may optimize navigation and management for one known user. It must not introduce teams, roles, invitations, sharing permissions, public links, social reactions, or generic account-profile complexity. `REQ-PRODUCT`, `REQ-DEFERRED`

## 4. Information architecture

### 4.1 Primary and secondary surfaces

| Level | Surface | Purpose |
| --- | --- | --- |
| Primary | Calendar | Image-first month overview and entry point to a Journal Day |
| Primary | Monthly Almanac | Chronological visual browsing across months |
| Primary | Search | Deterministic date, text, and tag retrieval |
| Primary/contextual | Journal Day detail | Full reflection and item-level management for one date |
| Secondary | Upload Journal | Global manual `.txt`/`.md` capture |
| Secondary/conditional | Needs Date Review | Resolve items that cannot safely enter the calendar |
| Secondary | History | Inspect sources, revisions, Corrections, and derived versions |
| Secondary | Trash | Restore or permanently delete recoverable content |
| Secondary | Suppressions | Inspect Source and Artwork Suppressions and allow re-import/generation |
| Secondary | Export | Create a complete portable archive |
| Secondary | System Health | Inspect capture, reconciliation, storage, AI, backup, and restore signals |
| Secondary | Settings | Inspect fixed journal rules and choose approved AI providers/theme |

`UX-IA-01` Journal Day detail is reached from a day result; it is not a separate empty dashboard destination.

`UX-IA-02` Upload Journal must be available both as a global action and inside Journal Day detail. `REQ-CAPTURE`, `REQ-REFLECTION`

`UX-IA-03` Needs Date Review must appear in navigation only when it contains items, while remaining reachable through Management when empty.

`UX-IA-04` A Journal Day with no live Source Items must not appear in Calendar or Monthly Almanac, even if historical Derived Artifacts remain. Its history remains reachable through History/management. `REQ-REFLECTION`

### 4.2 Navigation model

#### Wide viewport

- The approved Calendar/Almanac switcher sits near Search; do not add a competing Timeline tab or persistent primary-navigation rail.
- Monthly Almanac may expose a collapsible local month/year index. It is contextual to Almanac and does not become global navigation.
- Upload Journal remains a prominent but quiet global action.
- Needs Date Review appears with a count only when unresolved items exist and remains reachable through Settings/More when empty.
- History, Trash, Suppressions, Export, System Health, and other management surfaces live under Settings/More.
- The current Calendar/Almanac selection uses shape/background, text weight, and an accessible current-state announcement; color alone is insufficient.

#### Compact viewport

- Compact navigation exposes Calendar, Monthly Almanac, Search, and More while preserving the same Calendar/Almanac relationship.
- More opens a full-height sheet or page with Upload Journal, Needs Date Review, History, Trash, Export, System Health, and Settings.
- Journal Day detail replaces the browse surface in the navigation stack and has a clear back action that restores month, query, filters, and scroll position.
- Bottom navigation must not cover save bars, dialogs, gallery controls, or the final lines of journal text.

`UX-NAV-01` Browser Back must return to the exact prior browsing context where practical: selected month, search query, Include history state, loaded Almanac boundary, and scroll position.

`UX-NAV-02` Previous/next navigation inside Journal Day detail moves between populated, visible Journal Days, not every calendar date. An adjacent-date calendar picker remains available for direct selection.

`UX-NAV-03` The browser tab title should remain generic (`Life in Days`) and must not include journal titles or source text. Personal content must not be encoded into URLs, query parameters, analytics events, or referrers.

`UX-NAV-04` No surface may show Share, Publish, Invite, Copy public link, or social actions. `REQ-PRODUCT`

### 4.3 Conceptual route map

Route names below are wireframe anchors, not an implementation routing contract.

```text
Life in Days
├── Calendar
│   └── Journal Day
│       ├── Gallery and cover management
│       ├── Derived title, summary, and tags
│       ├── Source Items
│       ├── Upload Journal
│       ├── Artwork and Visual Brief
│       └── Day history
├── Monthly Almanac (chronological browsing)
│   └── Journal Day
├── Search
│   ├── Current results
│   └── Include history results
├── Needs Date Review
│   └── Assign Journal Date
├── Management
│   ├── History
│   ├── Trash
│   ├── Suppressions
│   ├── Export
│   ├── System Health
│   └── Settings
└── Upload Journal
```

## 5. Global interaction contract

### 5.1 Authenticity and labeling

`UX-GEN-01` Authentic items use source labels: `VoiceNotes journal`, `Uploaded journal`, and `Telegram photo`. Generated content uses `AI-generated title`, `AI-generated summary`, `AI-generated tags`, `Visual Brief`, or `AI artwork` as appropriate.

`UX-GEN-02` When a generated field is manually edited, its state becomes `Edited`. Provenance may say it began as AI-generated, but the active value must not be labeled as untouched AI output.

`UX-GEN-03` Original Timestamp, Journal Date, source, current displayed version, and revision state must be distinguishable. The UI must never relabel Journal Date as “uploaded on.” `LANG`

### 5.2 Save behavior and feedback

`UX-GEN-04` Durable actions show success only after the server confirms the complete operation. The interface must not optimistically claim that a file was uploaded, a date was changed, a deletion completed, or an artwork was saved.

`UX-GEN-05` In-progress controls become disabled only within the affected action scope. Reading authentic Source Items and navigating elsewhere should remain available while Derived Artifacts generate.

`UX-GEN-06` Every asynchronous operation has a state vocabulary: `Waiting`, `In progress`, `Complete`, `Needs attention`, `Blocked`, or `Unavailable`. Avoid indefinite unlabeled spinners.

`UX-GEN-07` Success messages state the durable outcome and destination, for example: “Journal added to 13 August 2026. View day.” They must not include journal excerpts in transient notifications.

### 5.3 Dialogs and destructive actions

`UX-GEN-08` A dialog contains one clearly named primary action, a cancel action, consequence copy, and the exact affected item/date. Destructive confirmation buttons use verbs such as `Move to Trash` or `Delete permanently`, never ambiguous `OK`.

`UX-GEN-09` Closing a dialog with unsaved edits requires confirmation. Escape closes only non-destructive dialogs; Escape must not confirm or execute an action.

`UX-GEN-10` Permanent deletion requires a confirmation checkbox acknowledging that live content will not be reconstructed and that encrypted backup copies expire only through normal retention. It must never imply immediate removal from every backup. `REQ-OPS`

### 5.4 Dates and time

`UX-GEN-11` All Journal Dates and day boundaries use fixed `Asia/Kolkata`, even when the browser or device is elsewhere. The UI should state this near date-changing controls.

`UX-GEN-12` User-facing dates follow `en-IN`; months begin Monday. Original Timestamp may additionally show its timezone and UTC value in provenance details.

`UX-GEN-13` MVP date pickers disable future Journal Dates. Historical dates remain selectable for uploads, corrections, and explicit backdating. `REQ-CAPTURE`

`UX-GEN-14` “Today” always means the current date in `Asia/Kolkata`, not device-local time.

## 6. Calendar experience

**Source:** `REQ-REFLECTION`, `REQ-AI`, `REQ-PROVENANCE`

### 6.1 Month header and controls

`UX-CAL-01` Calendar is the default signed-in page and opens to the current `Asia/Kolkata` month.

`UX-CAL-02` The month header includes previous month, next month, current month/year, and `Today`. Selecting the month/year opens a compact month/year chooser; it must not become a year mosaic.

`UX-CAL-03` The seven-column header starts Monday and uses localized short weekday names. Weekday labels remain visible or programmatically associated on narrow layouts.

### 6.2 Day tile anatomy

Every tile contains, in priority order:

1. Journal Date number.
2. Calendar Cover, when eligible.
3. No persistent source-type, `AI artwork`, or attention overlay chip. The accessible name conveys generated/source/attention context, and the selected Museum Margin/detail exposes it visibly.

`UX-CAL-04` When at least one Daily Photo exists, the selected real photo is the Calendar Cover. Generated Artwork cannot be shown as the cover in that state. `REQ-AI`

`UX-CAL-05` When no Daily Photo exists and Active Artwork exists, Active Artwork may be the Calendar Cover. The Calendar tile uses no persistent overlay chip; its accessible name identifies `AI artwork`, and the selected Museum Margin/detail carries the persistent visible label.

`UX-CAL-06` When a visible Journal Day has neither a Daily Photo nor Active Artwork, its tile uses a neutral paper/ink treatment with the date and optional concise title. It must not fabricate a stock image, gradient “memory,” or generated description.

`UX-CAL-07` A date without a visible Journal Day is a quiet empty cell. It must not say `Missed`, `Incomplete`, show a streak gap, or expose an artwork-generation action.

`UX-CAL-08` Today, selected day, and keyboard focus use distinct non-overlay cell outlines and do not rely on color alone. Attention is conveyed in the accessible name and selected detail rather than a Calendar overlay chip.

### 6.3 Interaction and accessibility

`UX-CAL-09` Selecting a populated tile opens Journal Day detail. Selecting an empty cell does not create a blank journal; it may expose only the existing `Upload journal for this date` action if the global upload flow is intentionally invoked. Blank browser composition remains excluded.

`UX-CAL-10` Arrow keys move day-by-day within the calendar grid; Home/End move to the start/end of a week; Page Up/Page Down change month; Enter/Space opens a populated day. Focus moves predictably when a new month loads.

`UX-CAL-11` Each tile has an accessible name such as “13 August 2026, 2 photos, 1 journal” and adds “AI artwork cover” when applicable. It must not expose source text in the accessible name.

### 6.4 Calendar states

- **First-use empty month:** “Your archive begins here.” Offer `Upload journal` and brief private Telegram/VoiceNotes setup status; do not imply historical notes will import.
- **No Journal Days in viewed month:** Show the clean grid and a small “No journaled days in this month” note outside it.
- **Loading:** Preserve grid dimensions with neutral skeleton tiles; never substitute last month's photos under a new month heading.
- **Partial media failure:** Keep the date/title and show “Image unavailable” with Retry. Do not hide the Journal Day.
- **Month load error:** Keep current context and show Retry; do not navigate to an empty month that looks authoritative.

### 6.5 Future wireframe annotation — `WF-01` and `WF-02`

- `WF-01 Calendar / wide`: validate the balance between photo-led tiles and legible dates at a 12-column desktop content width; annotate accessible source/AI cover disclosure, empty Journal Day, attention state, and the approved Calendar/Almanac switcher near Search. Do not add overlay badges or a persistent primary-navigation rail.
- `WF-02 Calendar / compact`: validate a seven-column layout at 320 CSS pixels without horizontal scrolling. Dates must remain operable even when images are visually cropped inside the tile; no content is centrally cropped at the source level.

## 7. Monthly Almanac — chronological browsing

**Source:** `REQ-REFLECTION`

`UX-TIME-01` Monthly Almanac shows visible Journal Days in reverse chronological order by default, grouped by month and year. The stable `UX-TIME-*` IDs retain traceability; `Timeline` is not a separate user-facing destination.

`UX-TIME-02` Each card includes Journal Date, Calendar Cover or neutral no-image treatment, title, summary preview, selected tags, source counts, and explicit `AI artwork` labeling where relevant.

`UX-TIME-03` Real-photo cover rules are identical to Calendar. Monthly Almanac must not independently choose a generated or second photo.

`UX-TIME-04` Long summaries truncate visually with `Read day`; source journals never appear as a feed excerpt unless the user opens the Journal Day.

`UX-TIME-05` Use deterministic `Load earlier days` pagination instead of a focus-hostile endless stream. Loading more preserves keyboard position and existing cards.

`UX-TIME-06` A month/year jump control may move to the first visible Journal Day in that period. It must not become an On This Day or year-mosaic experience.

Monthly Almanac empty/loading/error states follow Calendar language. A stale derived field may show a subtle `Review update` badge; an AI failure must not suppress the authentic day card.

### Future wireframe annotation — `WF-03`

Show cards with a consistent image ratio, a neutral no-image card, a generated-cover label, and long/short summary stress cases. Validate that the layout feels reflective rather than like a social feed.

## 8. Search experience

**Source:** `REQ-REFLECTION`, `REQ-PROVENANCE`

### 8.1 Query and filters

`UX-SEARCH-01` Search is lexical and deterministic. It searches currently displayed journal text, titles, summaries, tags, and Photo Captions. It must not use semantic similarity, conversational answers, image recognition, OCR, or photo descriptions. `REQ-REFLECTION`, `REQ-DEFERRED`

`UX-SEARCH-02` Date search uses an explicit date or date-range control so the result does not depend on natural-language date interpretation.

`UX-SEARCH-03` Tag filtering uses exact stored tags. Fuzzy tag matching and hidden tag expansion are not permitted.

`UX-SEARCH-04` `Include history` is off by default. Turning it on adds Trash and superseded Source Revisions, clearly labeled by state, without making them appear current.

`UX-SEARCH-05` Search terms and returned snippets remain inside the authenticated page. They must not enter the URL, page title, telemetry, or logs.

### 8.2 Results

`UX-SEARCH-06` Results group by Journal Day, then show the matching item/field and a short highlighted snippet. The source label and current/history state accompany every match.

`UX-SEARCH-07` Matching text uses typographic emphasis plus a programmatic label; it must not rely on highlight color alone.

`UX-SEARCH-08` Selecting a current result opens the relevant Journal Day and focuses the matching section. Selecting a historical result opens a history context with an explicit `Historical version` banner.

`UX-SEARCH-09` Search must explain its scope beside the filter control: “Literal text, dates, tags, and photo captions. No AI or image search.”

### 8.3 States

- **Initial:** Plain explanation of searchable fields; no trending, recent-person, or suggested-memory content.
- **No result:** Repeat active query/filter scope and offer Clear filters. Do not generate an inferred answer.
- **Index updating:** Show that recent content may still be processing while keeping exact source browsing available.
- **Error:** Preserve query locally in the open page and offer Retry; do not write query text to persistent browser storage.

### Future wireframe annotation — `WF-04`

Include current-only results, an Include history result, a tag-only search, a Photo Caption match, no-result copy, and compact filter behavior.

## 9. Journal Day detail

**Source:** `REQ-PROVENANCE`, `REQ-CAPTURE`, `REQ-AI`, `REQ-REFLECTION`

### 9.1 Page order

The default reading order is:

1. Journal Date header and adjacent populated-day navigation.
2. Calendar Cover and media gallery.
3. Generated title, summary, and tags.
4. Source journals in chronological order.
5. Day-level actions and provenance/history entry points.

On compact screens, actions that affect a specific section remain in that section rather than moving into one overloaded page menu.

### 9.2 Header

`UX-DAY-01` Display the full Journal Date and a quiet count such as “2 photos · 2 journals.” Do not display streaks, completion percentage, or day score.

`UX-DAY-02` `Change date` exists on individual Source Items, not as an ambiguous whole-day move. A Journal Day is an aggregate and may contain differently sourced items.

`UX-DAY-03` A day-level attention banner may summarize conflicts, stale fields, or failed generation, with links to exact sections. It must not displace the authentic content.

### 9.3 Gallery and cover

`UX-DAY-04` Daily Photos appear first in their current user-defined order. Generated Artwork appears in a visibly separate labeled section after real photos whenever both exist.

`UX-DAY-05` Each Daily Photo exposes: view original, Photo Caption, Original Timestamp, source label, Change Journal Date, reorder, Make calendar cover, download original, and Move to Trash.

`UX-DAY-06` Reordering supports pointer drag and explicit keyboard-operable `Move earlier`/`Move later` actions. Dragging is never the only method.

`UX-DAY-07` `Make calendar cover` is available only on real Daily Photos when any exist. The first Daily Photo is the default until another real photo is selected.

`UX-DAY-08` Generated Artwork exposes the `AI artwork` label, active/version state, provider/model provenance, source-staleness state, select earlier version, regenerate, and Move to Trash. It never exposes `Make calendar cover` while a Daily Photo exists.

`UX-DAY-09` Real images never receive AI-generated descriptions. Each Daily Photo offers an optional owner-authored **Private image description** stored locally and excluded from every AI request. When supplied, it is the image's text alternative and is included as local accessibility metadata in export/restore. When absent, the image uses the functional fallback “Daily Photo 1 of 3 for 13 August 2026,” while adjacent Photo Caption remains visible but is not assumed to describe the image. Generated art uses “AI artwork for 13 August 2026.”

`UX-DAY-10` The original opens only on explicit request; the normal page uses a locally generated metadata-stripped derivative. The interface explains that Telegram ordinary photo messages may be compressed and that sending as a document preserves Telegram-supplied original quality. `REQ-CAPTURE`

### 9.4 Title, summary, and tags

`UX-DAY-11` Title, summary, and tags live in a `Generated reflection` region distinct from `Source journals`. Each field shows its own status: `AI-generated`, `Edited`, `Accepted`, `Stale`, `Generating`, `Unavailable`, or `Failed`.

`UX-DAY-12` Each field is independently editable. Saving an edit protects only that field from automatic overwrite.

`UX-DAY-13` Explicitly selecting or accepting a generated version also protects that field. Merely viewing it does not.

`UX-DAY-14` When sources change, a protected field remains visible, receives a `Stale` status, and may offer `Review suggested update`. The suggestion never silently replaces the protected value.

`UX-DAY-15` `Resume automatic updates` removes protection only for the named field and explains that future source changes may refresh it. It does not immediately alter unrelated fields.

`UX-DAY-16` The saved tag set contains 3–7 short, unique, searchable tags. The editor gives clear inline guidance and lets Arun choose every value; it never silently replaces a manual tag with an AI suggestion.

### 9.5 Source journals

`UX-DAY-17` Source Items appear chronologically using Original Timestamp, while the section makes clear that every item belongs to the displayed Journal Date.

`UX-DAY-18` A Voice Journal card shows source, source title if available, displayed text, Original Timestamp, upstream status, and links to revisions/provenance.

`UX-DAY-19` An Uploaded Journal card shows filename as source title, displayed text, Original Timestamp/upload time, original-file download, checksum/duplicate state in provenance, and history.

`UX-DAY-20` `Correct displayed text` creates a Correction; it must not say `Edit VoiceNotes` or imply upstream content changes. The editor is permitted only as a correction path and does not become a blank browser journal composer.

`UX-DAY-21` Long source text has a comfortable reading measure, preserves paragraphs, and offers in-page find through the browser. It must not be collapsed behind an AI summary by default.

`UX-DAY-22` Successful generated output contains one concise title, one factual 80–140-word summary, and 3–7 tags. Output that fails those rules must not be shown as a successful current artifact.

### 9.6 Day actions

- `Upload journal` — prefilled to the current Journal Date.
- `Generate artwork now` or `Regenerate artwork` — available under the rules in Section 14.
- `View day history` — source, Correction, and Derived Artifact versions.
- `Export archive` — navigates to complete archive export; there is no MVP per-day PDF/book.
- `Send a photo through Telegram` — instruction only; the web product does not upload Daily Photos in MVP.

### Future wireframes — `WF-05` and `WF-06`

- `WF-05 Journal Day / wide`: two-column gallery and reading layout, with authentic/derived regions visibly distinct and no dashboard feel.
- `WF-06 Journal Day / compact`: one-column order, sticky section-local save bar, long journal stress case, multiple photos, real plus generated art, and visible provenance without crowding.

## 10. Manual journal upload

**Source:** `REQ-CAPTURE`, `REQ-REFLECTION`

### 10.1 Global and inline entry points

`UX-UPLOAD-01` Global Upload Journal asks for a Journal Date. Inline upload from Journal Day preselects that date while allowing an explicit change before submission.

`UX-UPLOAD-02` The picker accepts one UTF-8 `.txt` or `.md` file up to 1 MiB per submission. Multiple Uploaded Journals on one Journal Day are supported through repeated submissions.

`UX-UPLOAD-03` Drag-and-drop is optional enhancement; the file chooser must provide complete keyboard and touch support.

### 10.2 Review step

Before upload, show:

- filename, detected type, and size;
- chosen Journal Date with `Asia/Kolkata` note;
- a text preview sufficient to catch the wrong file, rendered as text rather than interpreted Markdown HTML;
- privacy note: the source remains authentic and is not sent to AI until the configured derivation process runs;
- `Upload journal` and `Cancel`.

`UX-UPLOAD-04` Markdown must be displayed safely as source text or sanitized presentation; embedded HTML, scripts, remote images, and tracking content must never execute or load.

`UX-UPLOAD-05` An exact duplicate warns before creation. Actions are `Cancel` and `Add anyway`; the latter creates a distinct Uploaded Journal while preserving duplicate provenance.

`UX-UPLOAD-06` On success, the original filename becomes the Uploaded Journal's source title. Repeating the flow can add any number of separate Uploaded Journals to the same Journal Day.

### 10.3 Errors

| Condition | Required copy/behavior |
| --- | --- |
| Unsupported file | State that MVP accepts UTF-8 `.txt` and `.md`; do not imply PDF/Word/OCR is processing |
| Over 1 MiB | Show actual and allowed size; preserve date selection for retry |
| Invalid UTF-8 or malformed text | Reject visibly; never silently replace characters or truncate |
| Empty file | Reject as having no journal text |
| Network interrupted | Do not claim upload; keep date and selected-file metadata while the page remains open and offer Retry |
| Server failure | Preserve authentic local file; show no partial Journal Day item |

### Future wireframe annotation — `WF-07`

Show global date selection, inline prefilled date, safe preview, duplicate warning, invalid encoding, and compact-screen file chooser.

## 11. Needs Date Review

**Source:** `REQ-CAPTURE`, `REQ-PROVENANCE`, `LANG`

`UX-DATE-01` Needs Date Review is a holding queue, not a Journal Day and not an error trash bin. Every item is preserved but absent from Calendar and Monthly Almanac until resolved.

`UX-DATE-02` A queue card shows source type, safe thumbnail or source title, Original Timestamp when available, the rejected/missing date reason, and `Assign Journal Date`.

`UX-DATE-03` For a Telegram photo with an invalid or future leading date, display the entered date, Telegram receipt timestamp in `Asia/Kolkata`, and the fact that the bot was notified. Do not silently preselect receipt date as the correction.

`UX-DATE-04` For a Voice Journal without a reliable creation timestamp, do not use webhook receipt time as a suggested truth. It may be shown separately as operational provenance.

`UX-DATE-05` Date assignment disables future dates, permits historical dates, and displays the fixed timezone. Save creates/updates the destination Journal Day atomically and removes the item from the queue only on success.

`UX-DATE-06` Queue count badges must announce changes accessibly. Resolving the final item removes the conditional nav badge without stealing focus.

### Future wireframe annotation — `WF-08`

Include a photo with invalid `YYYY-MM-DD`, a Voice Journal with missing creation time, a failed save, and the empty queue. Test whether “preserved but not yet on the calendar” is understood without alarming language.

## 12. Redating Source Items

**Source:** `REQ-PROVENANCE`, `REQ-CAPTURE`

`UX-REDATE-01` `Change Journal Date` begins from an individual Source Item and shows current Journal Date, Original Timestamp, and destination date selector.

`UX-REDATE-02` A pre-save impact note states that both days may receive new cover and stale-derived states, while the Original Timestamp remains unchanged.

`UX-REDATE-03` The move is all-or-nothing. Until the server confirms, the item remains visibly on its current day; failure leaves both days unchanged.

`UX-REDATE-04` After success, show links to the source and destination Journal Days. If the source day has no remaining live Source Items, it disappears from Calendar/Monthly Almanac but stays available through History.

`UX-REDATE-05` Generated Artwork that no longer belongs to the resulting source-revision set must leave the active gallery/cover and remain in history with a clear reason. It must not silently follow the moved source.

## 13. Derived-field review and protection

**Source:** `REQ-AI`, `REQ-PROVENANCE`

`UX-REVIEW-01` Review is field-specific. Title, summary, and tags each show Current value and Suggested replacement with generated provenance.

`UX-REVIEW-02` Differences are textual and accessible: character/word-level emphasis for short title, block-level changes for summary, and Added/Removed labels for tags. Color alone is insufficient.

`UX-REVIEW-03` Available actions are:

- `Use suggested version` — replaces the active field with the selected generated version and protects it because it was explicitly accepted.
- `Keep current version` — retains protection and marks the suggestion declined/currently reviewed.
- `Edit current version` — saves a user-authored protected value.
- `Resume automatic updates` — removes protection for future refreshes without silently accepting the visible suggestion.

`UX-REVIEW-04` Suggestions are never described as “more accurate” unless a human has established that. Use “new generated suggestion based on updated sources.”

`UX-REVIEW-05` If generation finishes against an obsolete source-content hash, the UI must show it as historical/stale and must not present it as the current suggestion.

### Future wireframe annotation — `WF-09`

Show a protected summary with a source change, tag additions/removals, a selected older generated title, and Resume automatic updates confirmation.

## 14. Artwork experience

**Source:** `REQ-AI`, `ART-EVAL`

### 14.1 Manual generation

`UX-ART-01` `Generate artwork now` appears as soon as a Journal Day has at least five meaningful journal words and the selected Artwork Provider, safety, and budget gates permit a request. It does not wait for the 15-minute Source Quiet Period or 01:00 sweep.

`UX-ART-02` With 5–19 meaningful words, the action shows a sparse-source warning before generation. Below five words it is disabled with the explanation “At least 5 meaningful journal words are needed.”

`UX-ART-03` The action remains available when Daily Photos exist. Its explanation must say that generated artwork will remain labeled and will not replace the real-photo Calendar Cover.

`UX-ART-04` If provider configuration or budget blocks generation, show the exact category and a Settings/System Health link. Manual actions never bypass the $4.50 artwork allocation or $5 total ceiling and never switch providers silently.

### 14.2 Visual Brief

`UX-ART-05` Visual Brief is a read-only 150–300-token Derived Artifact. The UI may show it with its source/provenance and stale state, but no free-form edit field is permitted in MVP. `REQ-AI`

`UX-ART-06` `Regenerate brief` creates a new brief version. It does not automatically send anything to the Artwork Provider. After it completes, Arun may explicitly choose `Retry artwork`.

`UX-ART-07` Copy must state the boundary: the selected Artwork Provider receives the Visual Brief, not the raw journal or any Daily Photo.

### 14.3 Generation and failure states

`UX-ART-08` During generation, authentic day content remains usable. Show non-blocking progress and warn that image generation may take time without promising a duration.

`UX-ART-09` A safety refusal appears as: “Artwork could not be generated under the selected provider's safety policy.” It must not imply the journal is unsafe, change the journal, route to another provider, or retry automatically.

`UX-ART-10` Timeout, rate-limit, credential, quota, invalid-response, and budget conditions are distinct. After bounded automatic handling ends, retry is explicit.

`UX-ART-11` Every successful regeneration creates a version. The newest successful version becomes Active Artwork by default, but Arun may select an earlier version; explicit selection is recorded.

`UX-ART-12` Late text changes mark applicable artwork stale. Existing artwork may remain visible with “Based on an earlier journal version” unless its source-revision set no longer belongs to the day; regeneration is manual.

### 14.4 Sweep and suppression

`UX-ART-13` The 01:00 `Asia/Kolkata` Artwork Sweep is described as a fallback fill, never a reminder. It considers every eligible post-Integration-Activation day and acts only when journal text has at least 20 meaningful words, no Daily Photo, no Generated Artwork, and no Artwork Suppression.

`UX-ART-14` A failed/skipped sweep must be visible in day history/System Health but must not create repeated user-facing habit alerts.

`UX-ART-15` Moving all Generated Artwork to Trash creates an Artwork Suppression after explicit consequence copy. Suppression prevents the sweep from recreating it; `Allow generation` removes suppression.

`UX-ART-16` Artwork direction is warm, painterly editorial illustration with symbolic scenes, restrained texture, and quiet 4:5 composition. It must avoid photorealistic reconstruction, recognizable likenesses, readable words, logos, signatures, and imitation of a named living artist.

`UX-ART-17` The UI imposes no arbitrary regeneration-count limit. Availability is governed only by source, provider, safety, and approved budget controls, and every successful version remains in history.

### 14.5 Version history

Each version shows created time, active/historical state, trigger (`Manual` or `01:00 sweep`), provider/model, Visual Brief version, source revision set, cost when available, and refusal/failure metadata without raw prompts in logs.

### Future wireframe annotation — `WF-10`

Show no-art eligible state, sparse-source warning, real-photo-plus-art hierarchy, safety refusal, budget block, stale artwork, version selection, and suppression confirmation.

## 15. Source revision and Correction conflicts

**Source:** `REQ-PROVENANCE`

`UX-CONFLICT-01` An upstream VoiceNotes edit always creates a Source Revision. If no local Correction competes, the newest eligible upstream revision may become displayed according to the source rules while prior versions stay in history.

`UX-CONFLICT-02` If a local Correction competes with a newest upstream revision, show a persistent but non-blocking `Review source update` state. Never auto-merge personal journal text.

### 15.1 Conflict review anatomy

- Source identity, Original Timestamp, current Journal Date, and revision times.
- Side-by-side on wide screens; stacked switcher on compact screens.
- Current Correction labeled `Displayed correction`.
- Upstream text labeled `Newest VoiceNotes revision`.
- Insertions/deletions labeled in text and announced, not only colored.
- Controls to expand unchanged sections without hiding the existence of omitted text.

### 15.2 Exactly three resolution actions

`UX-CONFLICT-03` The conflict view offers exactly these substantive actions:

1. `Keep the Correction` — retain the current displayed Correction and mark the upstream revision reviewed.
2. `Display newest upstream revision` — make the newest source revision displayed; retain the Correction in history.
3. `Create a new Correction based on both` — open a manual Correction workspace with both versions visible. It may start from the current Correction but must not auto-merge or insert unreviewed upstream text.

Cancel/close is permitted as navigation, but no fourth automatic resolution is allowed.

`UX-CONFLICT-04` The new-Correction workspace warns before navigation with unsaved text. It must not persist journal text to local/session storage and must not become a general blank journal editor.

`UX-CONFLICT-05` Resolution creates an auditable event and never deletes either source revision.

### Future wireframe annotation — `WF-11`

Stress-test long text, screen-reader diff labels, compact stacked comparison, unresolved exit, and the exact three actions. Verify that “Display newest” does not sound like deletion.

## 16. History and provenance

**Source:** `REQ-PROVENANCE`, `REQ-AI`, `REQ-REFLECTION`

`UX-HIST-01` History is available per Source Item, per Derived Artifact, per Journal Day, and through a global management view for hidden historical days.

`UX-HIST-02` History uses a chronological event list with typed entries: Source Revision received, Correction created, Journal Date changed, generated field created/selected/edited, artwork generated/selected, item moved to Trash/restored/permanently deleted, suppression created/removed.

`UX-HIST-03` Source and derived histories remain visually separate. A Generated Artwork version must not appear as a Source Revision.

`UX-HIST-04` Selecting a historical version never makes it current until an explicit action is confirmed. Viewing history is read-only.

`UX-HIST-05` A Journal Day hidden because it has no live Source Items opens with `Historical day — not shown in Calendar or Monthly Almanac` and management/restoration options only.

`UX-HIST-06` Provider provenance includes provider, requested and returned model where available, generation date, prompt/template version, source revision set, and cost/safety state. Credentials, raw request payloads, and internal identifiers are never displayed.

`UX-HIST-07` An upstream VoiceNotes untag or deletion appears as a retained upstream-status event. It never silently removes the local Voice Journal or its historical day.

### Future wireframe annotation — `WF-12`

Include an upstream revision, Correction, redating event, protected summary replacement, artwork version selection, and a hidden historical day.

## 17. Trash and suppressions

**Source:** `REQ-OPS`, `REQ-PROVENANCE`

### 17.1 Trash

`UX-TRASH-01` Trash lists recoverable items with type, source, Journal Date, deletion date, and exact time remaining in the 30-day live retention window.

`UX-TRASH-02` Filters may narrow by source type/date; search history remains separate and Include history can discover Trash text. Trash must not expose thumbnails before authentication or in notifications.

`UX-TRASH-03` `Restore` returns the item to its Journal Day and recalculates cover/stale state. Restoring a Voice Journal removes the Source Suppression that deletion created.

`UX-TRASH-04` `Delete permanently` explains that live content will be removed, no export will reconstruct it, and backup copies expire through ordinary retention. For a Voice Journal, the opaque Source Suppression identifier remains until `Allow re-import`.

`UX-TRASH-05` When no live/Trash Daily Photo references a Media Asset, live media can be removed; UI copy should describe the photo item, not internal deduplicated storage mechanics.

### 17.2 Suppression management

`UX-SUP-01` A separate management view lists Source Suppressions and Artwork Suppressions without revealing permanently deleted content.

`UX-SUP-02` Source Suppression shows source type, opaque identifier suffix, suppression date, and `Allow re-import`. It must not claim that re-import will succeed if the upstream item is unavailable, untagged, or ineligible.

`UX-SUP-03` Artwork Suppression shows Journal Date, creation reason, and `Allow generation`. Removing it does not immediately generate art unless Arun separately requests generation or a later sweep finds the day eligible.

### Future wireframe annotation — `WF-13`

Show recoverable Voice Journal, photo with shared Media Asset, expiring item, permanent-delete consequences, Source Suppression, Artwork Suppression, and empty states.

## 18. Telegram bot capture and duplicate handling

**Source:** `REQ-OPS`, `REQ-CAPTURE`

### 18.1 Conversation contract

`UX-TG-01` The bot accepts compressed photo messages and still-image documents decoded as JPEG, PNG, WebP, HEIC, or HEIF. It has no product-level item-count limit and accepts media groups. Forwarded photos are eligible when sent by the configured user in the configured private chat.

`UX-TG-02` The bot rejects groups, every sender other than the configured numeric user, every chat other than the configured private chat, and requests that fail the Telegram webhook-secret check. Rejection copy must be generic and must not reveal the allowlisted identity, chat identifier, or secret state.

`UX-TG-03` Accepted files must be no larger than 20 MB, 100 megapixels, or 20,000 pixels on either dimension. Animated images, SVG, TIFF, PDF, RAW, and content that does not decode as an accepted still image receive a clear rejection. Rejection states never claim the item was imported.

`UX-TG-04` A valid leading `YYYY-MM-DD` applies to the photo or complete media group. Remaining caption text becomes the Photo Caption, stays visible/searchable, and is excluded from all AI input. With no leading date, receipt time in `Asia/Kolkata` determines Journal Date.

`UX-TG-05` A successful acknowledgement is sent only after durable local capture. It states the assigned Journal Date and provides a private action/link to change it. The bot does not delete the Telegram message after import.

`UX-TG-06` An invalid/future leading date receives an acknowledgement that the photo is safe in Needs Date Review and absent from the calendar until corrected. It never falls back silently to receipt date.

`UX-TG-07` The bot may explain once, in capture/help copy, that ordinary Telegram photo messages can be compressed and image documents are the original-quality path. It must not nag after every successful capture.

`UX-TG-08` Telegram messages contain no journal excerpts, Generated Artwork, health identifiers, provider responses, or secrets. Operational alerts occur only after repeated ingestion/reconciliation/backup failures and are never habit reminders.

### 18.2 Duplicate handling

`UX-DUP-01` Telegram identical-byte detection is global and uses checksum without describing photos to AI.

`UX-DUP-02` Same Journal Date: acknowledge `Already imported` and do not create another Daily Photo. Offer explicit `Add duplicate anyway`; accepting creates a distinct Daily Photo referencing the existing encrypted Media Asset.

`UX-DUP-03` Different Journal Date: warn that identical bytes already appear on another date but permit addition because the same photograph may represent multiple days.

`UX-DUP-04` Web provenance may show `Same media as another day` with a private link to that date, but ordinary Calendar/Monthly Almanac cards do not need duplicate badges.

`UX-DUP-05` Duplicate warnings must never expose another Journal Day's title or journal text in Telegram. Date alone is sufficient.

## 19. Settings

**Source:** `REQ-AI`, `REQ-OPS`, `REQ-REFLECTION`

Settings is a private configuration summary, not a consumer account center.

### 19.1 Journal and integrations

- Product name and planned hostname.
- Journal Timezone `Asia/Kolkata` — read-only in MVP.
- Locale `en-IN`, Monday-first calendar — read-only in MVP.
- VoiceNotes exact eligibility tag `life-in-days` — read-only in MVP.
- Integration Activation instant and last reconciliation.
- Telegram status: configured/not configured, private-chat restriction, and masked identifiers only.
- No secrets, tokens, service-account keys, or webhook paths are viewable or editable in the browser.

`UX-SET-01` VoiceNotes settings must explain that notes created before Integration Activation are never automatically imported, even if later edited/tagged. Historical automatic import is not offered.

### 19.2 AI providers

`UX-SET-02` Text Provider and Artwork Provider are independent dropdowns. Each shows only models that passed the approved hard gates; arbitrary model IDs and failing placeholders are not selectable.

`UX-SET-03` Until evaluations pass, controls show `Model evaluation not completed` rather than selecting a speculative default. `TEXT-EVAL`, `ART-EVAL`

`UX-SET-04` Each option displays provider, model, role such as Economy/Premium, measured cost guidance, privacy/retention link, region when applicable, and whether automatic sweep is allowed.

`UX-SET-05` Changing a provider/model requires a concise confirmation: only future generations change; existing artifacts retain provenance; no silent fallback occurs.

`UX-SET-06` Premium artwork options, if a model earns inclusion, are marked `Manual only` and cannot be selected for automatic sweep behavior.

`UX-SET-07` Credential state is `Available`, `Missing`, or `Needs attention`; the UI never displays the credential value. Credential provisioning remains a server-side secrets workflow.

`UX-SET-08` Show the fixed application ceilings: $5 total/month, $0.50 text reserve, at most $4.50 artwork, 80% warning. MVP does not offer a browser control to bypass them.

### 19.3 Appearance

`UX-SET-09` Theme choices are `Use device setting`, `Light`, and `Dark`. Changing theme updates immediately and does not alter content.

`UX-SET-10` Reduced-motion follows the operating-system preference. No override is required for MVP, but no essential operation depends on motion.

`UX-SET-11` Deployment context may show `life.arunp.in` as the human site and `life-hooks.arunp.in` as machine callbacks. It must state that the callback host serves no human journal route and must not reveal opaque callback paths.

### Future wireframe annotation — `WF-14`

Show fixed journal rules, integration activation warning, independent provider dropdowns before/after evaluation, missing credential state, manual-only model, budget summary, and appearance controls.

## 20. System Health

**Source:** `REQ-OPS`, `REQ-RECOVERY`, `MEDIA-EVAL`

`UX-HEALTH-01` System Health is private and factual. It shows at minimum:

- last successful Telegram capture;
- last VoiceNotes reconciliation;
- last successful backup snapshot;
- last backup integrity check;
- last successful sampled restore;
- last full disaster-recovery drill and measured duration;
- active backup retention policy: 48 hourly, 30 daily, and 12 monthly snapshots;
- root-resident media use, host free space, and storage backend;
- AI total/text/artwork spend for the current month;
- Text Provider and Artwork Provider credential/configuration state.

`UX-HEALTH-02` Durable operational evidence uses exactly `unknown`, `never run`, `success`, `delayed`, `failed`, or `blocked`, matching `LID-OPS-014`. The UI renders those states respectively as `Unknown`, `Never verified`, `Healthy`, `Attention — delayed`, `Failed`, and `Blocked`. `Unknown` and `Never verified` never appear green. `Not configured` is a separate prerequisite/configuration state; it must not be substituted for job evidence or treated as success.

`UX-HEALTH-03` Backup success and restore evidence are separate cards. The UI must never infer recoverability from backup upload alone.

`UX-HEALTH-04` Storage shows current values and the approved thresholds:

- plan migration at 7 GB root media or 18 GB host free;
- begin verified copy/dual-write by 8 GB or 15 GB free;
- new writes use object storage by 9 GB or 13 GB free when gates pass;
- reject new media at 10 GB root media while migration is incomplete or 12 GB host free.

`UX-HEALTH-05` Emergency storage state explains that new media is rejected to prevent loss while journal text, reading, search, export, backup, and recovery remain available. It must not suggest deleting or downsampling originals automatically.

`UX-HEALTH-06` AI budget shows predicted request cost before a blocked manual action and actual/reconciled usage when available. It must not imply provider billing is exact when only an estimate exists.

`UX-HEALTH-07` Telegram operational alerts occur only after repeated ingestion, reconciliation, or backup failures. System Health may show a single current failure immediately but must not send journaling reminders.

`UX-HEALTH-08` Logs or error detail exposed in UI must contain only timestamps, opaque identifiers, and error classes—never journal text, captions, prompts, images, provider responses, tokens, signed URLs, or credentials.

### Recovery Ceremony

`UX-HEALTH-09` Pre-launch status includes a Recovery Ceremony checklist:

1. recovery key copy in Arun's password manager;
2. independent sealed offline copy;
3. representative encrypted archive restored and decrypted successfully.

The launch status remains `Blocked` until all three are evidenced. The UI must record date/result, not the key or its location details.

`UX-HEALTH-10` Sampled restore is due monthly and a full disaster-recovery drill quarterly. The four-hour recovery objective is displayed as a target beside the last measured result, never as an achieved guarantee without evidence.

`UX-HEALTH-11` Sanitized local operational logs have a 30-day retention statement. The view may expose retention and aggregate error classes, but never a browser-accessible raw log stream containing personal data.

### Future wireframe annotation — `WF-15`

Show healthy, never-verified, threshold warning, emergency media stop, AI 80% warning, backup-success/restore-failure split, and Recovery Ceremony blocked/complete states.

## 21. Export experience

**Source:** `REQ-OPS`

### 21.1 Export contents

`UX-EXPORT-01` The primary export is `Complete restorable archive`. Its review screen lists, without optional omission:

- JSON, Markdown, and browsable HTML;
- original Uploaded Journal files and Daily Photos;
- Generated Artwork;
- Source Revisions and Corrections;
- checksums and manifest;
- clearly separated Trash records;
- Source Suppressions and Artwork Suppressions;
- opaque suppression identity only for permanently deleted upstream content.

It must state that permanently deleted content is not reconstructed and PDF books are not included.

### 21.2 Encryption and creation

`UX-EXPORT-02` AES-256 ZIP with a one-time passphrase is the default. The UI asks for and confirms a passphrase, explains that Life in Days does not store it, and warns that a forgotten passphrase makes the export unusable.

`UX-EXPORT-03` Passphrase fields support password-manager paste, reveal/hide, and accessible strength guidance. They must not block paste or write the passphrase to browser storage, logs, or analytics.

`UX-EXPORT-04` Unencrypted export is a secondary option behind a privacy warning and explicit acknowledgement. It must never become the remembered default.

`UX-EXPORT-05` Creation progress uses named stages rather than a fabricated percentage when total work is unknown: Preparing manifest, Packaging files, Encrypting archive, Ready to download.

### 21.3 Download lifecycle

`UX-EXPORT-06` When ready, show creation time, size, checksum, encrypted/unencrypted state, and expiry: first successful download or one hour, whichever comes first.

`UX-EXPORT-07` After successful download, the server artifact is deleted and the UI shows `Downloaded and removed from server`. If confirmation of success is not technically reliable, the implementation must resolve Gate `G-06` before promising this state.

`UX-EXPORT-08` Failure never exposes a partial archive as complete. Retry must create or resume only under a verified implementation contract; no stale passphrase is retained.

### Future wireframe annotation — `WF-16`

Show the complete content manifest, encrypted default, unencrypted warning, passphrase-loss warning, long-running state, ready state, expired state, failed packaging, and post-download deletion confirmation.

## 22. First-use and integration-readiness experience

`UX-FIRST-01` First use opens Calendar with an empty, non-judgmental state and a compact readiness panel—not a multi-step lifestyle onboarding flow.

`UX-FIRST-02` The panel shows VoiceNotes, Telegram, AI, Backup, and Recovery Ceremony as separate states. Authentic capture can remain useful when optional AI is unavailable; launch cannot be represented as recovery-ready before the Recovery Ceremony.

`UX-FIRST-03` Enabling VoiceNotes must disclose the prospective boundary before activation: only exact tag `life-in-days`; creation time at/after Integration Activation; older notes never auto-import.

`UX-FIRST-04` Telegram guidance says one configured numeric user in one private chat is accepted, groups/other senders are rejected, and ordinary photo messages may be compressed. It must not reveal identifiers after setup.

`UX-FIRST-05` Credentials are never collected in this web onboarding. The page may say `Configured on server` or `Needs server configuration` and link to private setup instructions.

## 23. End-to-end flows

### Flow A — eligible VoiceNotes journal arrives

1. Webhook acts as a wake signal; UI need not show a webhook event as a journal.
2. Reconciliation retrieves authoritative tag, creation date, and transcript through the approved integration hypothesis.
3. Exact `life-in-days` and creation at/after Integration Activation are checked.
4. Reliable creation timestamp derives Journal Date in `Asia/Kolkata`; missing timestamp routes to Needs Date Review.
5. A Voice Journal Source Item becomes visible and preserves Original Timestamp/revision provenance.
6. After the 15-minute Source Quiet Period, eligible text derivation begins.
7. Calendar/Monthly Almanac display the Journal Day even if AI is pending/failed.
8. Late upstream changes create revisions and may trigger stale/conflict review.

**UX invariants:** no historical auto-import, no fuzzy tags, no webhook receipt-time dating fallback, no silent merge, no source deletion upstream. `REQ-CAPTURE`, `REQ-PROVENANCE`

### Flow B — Telegram photo arrives with no explicit date

1. Bot accepts only configured user/private chat and valid webhook secret.
2. Accepted image type/size/dimensions are validated from content.
3. Receipt time converted to `Asia/Kolkata` supplies Journal Date.
4. Exact bytes and local privacy-safe thumbnail commit durably.
5. Bot acknowledges assigned date and provides a change-date link.
6. The first real photo becomes Calendar Cover; later photos join the same day chronologically.

**UX invariants:** no acknowledgement before durable capture; no message deletion; no AI transfer; no item-count limit; clear rejection for unsupported/oversized files.

### Flow C — Telegram photo has leading date/caption

1. A valid leading `YYYY-MM-DD` applies to the photo/media group; remaining text becomes searchable Photo Caption.
2. A historical date is accepted; a future/invalid date routes every affected photo to Needs Date Review.
3. Bot explains the state without discarding or silently assigning receipt date.
4. Photo Caption remains excluded from AI.

### Flow D — duplicate Telegram photo

1. Global checksum match is found.
2. Same day: `Already imported`; Add duplicate anyway is explicit.
3. Different day: warn and permit.
4. A permitted duplicate creates a distinct Daily Photo while reusing one Media Asset.

### Flow E — manual journal upload

1. Start globally or from a Journal Day.
2. Select valid file and date; review plain-text preview.
3. Resolve exact duplicate warning if present.
4. On durable success, show Journal Day link.
5. Derivation follows normal quiet-period and protection rules.

### Flow F — revisit a day

1. Enter through Calendar, Monthly Almanac, or Search.
2. Recognize real versus AI cover before opening.
3. Read gallery, generated reflection, and full sources in that order.
4. Inspect provenance/history only when desired.
5. Return to exact browsing context.

### Flow G — correct or redate content

1. Choose the individual Source Item.
2. Correction preserves source; redating preserves Original Timestamp.
3. Save atomically.
4. Both days recalculate visibility, covers, and stale states.
5. Generated art invalidated by the moved source leaves active presentation but remains historical.

### Flow H — upstream edit conflicts with Correction

1. New Source Revision arrives.
2. Current Correction remains displayed with Review source update.
3. Compare complete texts accessibly.
4. Choose exactly one of three resolution actions.
5. Preserve every source revision and Correction regardless of choice.

### Flow I — automatic text refresh

1. Wait 15 minutes after latest journal-source change.
2. Generate title, summary, tags, and Visual Brief from eligible text.
3. Save valid artifacts with provenance.
4. Refresh untouched fields; preserve protected fields and offer suggestions.
5. At 01:00, refresh changed untouched fields once more.

### Flow J — manual artwork request

1. Check meaningful-word, provider, safety, and budget gates.
2. Show sparse warning for 5–19 words.
3. Create/use read-only Visual Brief; never attach photos.
4. Generate through selected provider only.
5. Download/store durably and label `AI artwork`.
6. Make newest version active; keep all older versions.
7. Preserve real-photo Calendar Cover when present.

### Flow K — 01:00 artwork fallback

1. Scan all eligible post-activation Journal Days.
2. Skip any day with real photo, Generated Artwork, insufficient text, or Artwork Suppression.
3. Generate only with an automatic-sweep-eligible selected model and budget.
4. Record skipped/failed state; do not send a habit reminder or switch provider.

### Flow L — delete, restore, or allow re-import

1. Move content to Trash with 30-day expiry.
2. Create Source Suppression for deleted Voice Journal or Artwork Suppression when all artwork is deliberately removed.
3. Restore reverses the relevant suppression.
4. Permanent delete removes live content but leaves only required opaque Source Suppression identity.
5. Allow re-import removes suppression but does not promise upstream eligibility/availability.

### Flow M — create restorable export

1. Review complete contents.
2. Accept encrypted default and provide one-time passphrase, or explicitly acknowledge unencrypted risk.
3. Wait through truthful stages.
4. Download once within one hour.
5. Confirm artifact removal without implying removal of journal data itself.

## 24. Content design system

### 24.1 Terminology

Use canonical terms from `CONTEXT.md` in product copy and help:

- Journal Day, Journal Date, Original Timestamp
- Source Item, Voice Journal, Uploaded Journal, Daily Photo, Photo Caption
- Source Revision, Correction, Derived Artifact, Protected Field
- Visual Brief, Generated Artwork, Active Artwork, Calendar Cover
- Trash, Source Suppression, Artwork Suppression, Needs Date Review

Avoid `AI entry`, `generated photo`, `daily entry`, `upload date`, `edit VoiceNotes`, `smart memory`, or `deleted forever everywhere`.

### 24.2 Tone

- Calm, specific, and plain.
- First person only when reflecting a user action (“Your correction”); do not give the system a companion persona.
- Avoid exclamation marks in ordinary success and error messages.
- State what happened, what remained safe, and what action is available.
- Never infer emotions in system copy from journal text.

### 24.3 Approved copy patterns

| Situation | Pattern |
| --- | --- |
| Capture success | “Photo saved to 13 August 2026.” |
| Invalid date | “The photo is safe, but `2026-13-08` is not a valid Journal Date. Choose a date to add it to the calendar.” |
| Future date | “The photo is safe, but future Journal Dates are not supported in this version.” |
| AI pending | “Creating a generated summary from the current journal sources.” |
| AI safety refusal | “Artwork could not be generated under the selected provider's safety policy. Your journal is unchanged.” |
| Budget block | “Artwork generation is paused because this month's artwork allocation has been reached.” |
| Stale field | “Sources changed after this summary was accepted. Review a new generated suggestion.” |
| Backup distinction | “Backup completed 2 hours ago. Last sampled restore verified 18 days ago.” |
| Offline-ish | “Connection interrupted. This change has not been saved.” |

### 24.4 Labels and badges

Badges should be limited to states that change interpretation: `AI artwork`, `Edited`, `Accepted`, `Stale`, `Historical`, `In Trash`, `Conflict`, `Needs date`, and `Manual only`. Do not badge healthy ordinary content.

## 25. Responsive behavior

`UX-RESP-01` The experience must reflow without horizontal page scrolling at 320 CSS pixels and up to 200% zoom, except contained comparisons/tables that provide an accessible stacked alternative.

Recommended layout bands:

| Band | Width | Behavior |
| --- | ---: | --- |
| Compact | 320–599 px | Bottom navigation, one-column detail, stacked diff, full-width dialogs/sheets |
| Medium | 600–1023 px | Adaptive management drawer, wider calendar, two-column management where readable |
| Wide | 1024 px and above | Calendar/Almanac switcher near Search, gallery/reading columns, side-by-side diff |

`UX-RESP-02` Calendar must remain a seven-column month grid on compact screens; labels may shorten but dates and focus targets remain usable. Do not replace it with a list unless the user selects Monthly Almanac.

`UX-RESP-03` Media uses a stable 4:5 presentation frame with non-destructive fit behavior. Original assets are never recropped or rewritten to satisfy layout.

`UX-RESP-04` Source text reading width should remain approximately 60–72 characters on wide screens and use the full comfortable width on compact screens.

`UX-RESP-05` Sticky controls must account for safe-area insets and must never cover captions, dialog actions, focused inputs, or bottom navigation.

`UX-RESP-06` Orientation is not locked. Landscape mobile keeps all operations available.

`UX-RESP-07` Supported-browser validation covers the current two major versions of Chrome, Edge, Firefox, and Safari, plus current iOS Safari and Android Chrome. The UX makes no legacy-browser compatibility promise.

## 26. Accessibility contract

**Target:** WCAG 2.2 AA for supported desktop and mobile browsers. `REQ-REFLECTION`

### 26.1 Semantics and structure

`UX-A11Y-01` Pages use one clear `h1`, logical nested headings, landmarks, and a skip link to main content.

`UX-A11Y-02` Calendar uses an accessible grid/date-picker pattern with explicit month label and predictable focus; Monthly Almanac/Search remain lists/articles, not fake grids.

`UX-A11Y-03` Source and generated regions have programmatic headings. The `AI artwork` distinction is included in accessible names, not only overlaid visually.

`UX-A11Y-04` Status changes such as upload complete, date resolved, generation failed, and duplicate warning use appropriately restrained live regions. Long generated text is not announced automatically.

### 26.2 Keyboard and focus

`UX-A11Y-05` Every action is keyboard operable. Pointer drag always has button/menu alternatives.

`UX-A11Y-06` Focus indicators meet non-text contrast requirements and remain visible against images, light theme, and dark theme.

`UX-A11Y-07` Opening a modal moves focus to its heading or first relevant control; closing returns focus to the invoking control. Destructive dialogs trap focus until closed but never trap the user indefinitely.

`UX-A11Y-08` Loading/re-rendering does not reset focus to the page top. Adding Monthly Almanac results, resolving a queue item, or saving a field keeps a logical focus anchor.

`UX-A11Y-09` Touch targets meet at least the WCAG 2.2 AA 24-by-24 CSS-pixel minimum, with 44-by-44 preferred for primary mobile controls and calendar tiles where layout permits.

### 26.3 Visual and cognitive accessibility

`UX-A11Y-10` Normal text targets at least 4.5:1 contrast, large text 3:1, and UI boundaries/focus 3:1. Every token combination must be measured in the eventual design rather than assumed from this specification.

`UX-A11Y-11` Error, conflict, stale, selected, and AI-generated states use labels/icons/patterns in addition to color.

`UX-A11Y-12` At 200% text zoom and 400% page zoom, core tasks remain usable without loss of content or action.

`UX-A11Y-13` Animations respect `prefers-reduced-motion`. Reduced mode removes crossfades, parallax, zooming gallery transitions, and animated progress decoration while retaining immediate state changes.

`UX-A11Y-14` No animation flashes more than allowed thresholds; autoplay media and sound do not exist in MVP.

`UX-A11Y-15` Plain-language explanations accompany technical states. Error recovery must not require interpreting an opaque code.

### 26.4 Diff and complex content

`UX-A11Y-16` Diffs expose full text in document order and label additions/removals. A screen-reader user can switch between Correction and newest Source Revision without traversing interleaved fragments.

`UX-A11Y-17` Charts are not required. If AI/storage meters use graphics, equivalent numbers, thresholds, and status text are mandatory.

## 27. Privacy cues and browser behavior

`UX-PRIV-01` The app shell may show a quiet `Private archive` cue and authenticated identity; it must not imply that infrastructure providers cannot process data.

`UX-PRIV-02` Provider settings state what leaves the server:

- Text Provider: approved journal text and minimal date/language hints.
- Artwork Provider: Visual Brief only.
- No provider: real photos or photo-derived data.

`UX-PRIV-03` Authenticated pages, media, APIs, and exports must be designed for `private, no-store`. The UX must not rely on browser/offline caches for availability.

`UX-PRIV-04` Sensitive content does not appear in browser titles, URLs, push notifications, Telegram operational alerts, third-party analytics, crash reports, or general logs.

`UX-PRIV-05` There is no “Remember journal text on this device” feature in MVP. Unsaved Corrections may remain only in the open page's memory during a transient interruption and are lost on reload/close after a warning.

`UX-PRIV-06` Downloading an Original or export requires explicit action and privacy copy appropriate to leaving the protected web surface.

`UX-PRIV-07` Cloudflare Access is the only human login layer. The UI must not add password change, forgot-password, recovery-email, or session-management screens for a nonexistent application account.

`UX-PRIV-08` Human access is restricted to Arun's exact Cloudflare account membership with MFA and a seven-day Access session. Expiry returns to Cloudflare authentication and must not imply that journal data was deleted or the application password changed.

## 28. Light and dark themes

The visual language is quiet, photographic, and archival: warm paper in light mode, deep ink in dark mode, restrained typography, minimal chrome, and no faux leather/scrapbook decoration. `REQ-REFLECTION`

### 28.1 Semantic color tokens

Values are a starting palette for prototyping, not a claim of measured final contrast.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `color.canvas` | `#F7F1E8` | `#11130F` | App background |
| `color.surface` | `#FFFDF8` | `#1A1E18` | Cards/dialogs |
| `color.surfaceRaised` | `#FFFFFF` | `#22271F` | Raised controls |
| `color.text` | `#211F1B` | `#F4EFE5` | Primary text |
| `color.textMuted` | `#665F55` | `#C0B7A8` | Secondary text |
| `color.border` | `#D8CEBF` | `#3C4438` | Dividers/boundaries |
| `color.accent` | `#70543D` | `#D7B98A` | Primary action/selection |
| `color.focus` | `#175CD3` | `#84ADFF` | Focus ring |
| `color.success` | `#276749` | `#75E0A7` | Verified success |
| `color.warning` | `#8A4B08` | `#FEC84B` | Attention/budget/storage |
| `color.danger` | `#B42318` | `#FDA29B` | Destructive/failure |
| `color.aiLabel` | `#5E3A78` | `#D6BBFB` | AI label only, always with text |

Every text/background pair and interactive state must be validated against WCAG targets during visual design. Images require a solid or scrim-backed label/focus treatment rather than assuming image contrast.

### 28.2 Typography tokens

- `font.display`: privacy-safe system serif stack for dates and reflective headings.
- `font.ui`: system sans-serif stack for navigation, controls, labels, and provenance.
- Custom fonts, if later chosen, must be self-hosted; no third-party font request should receive authenticated page/referrer data.
- `text.display`: 36/44 wide, 30/38 compact.
- `text.h1`: 28/36 wide, 24/32 compact.
- `text.h2`: 22/30.
- `text.body`: 16/26.
- `text.small`: 14/20.
- `text.meta`: 13/18; never use smaller type for essential provenance or errors.

### 28.3 Spacing, shape, and depth

- Base spacing unit: 4 px.
- Key steps: 4, 8, 12, 16, 24, 32, 48, 64.
- Compact side padding: 16 px; wide content gutter: 24–32 px.
- Card radius: 12 px; media radius: 10 px; control radius: 8 px; pill only for tags/status.
- Borders and tonal separation should carry hierarchy before shadows.
- One restrained raised-surface shadow token is sufficient; dark mode uses borders/tonal shift rather than heavy glow.

### 28.4 Motion tokens

- `motion.fast`: 120 ms for local control feedback.
- `motion.standard`: 180 ms for sheets/dialog opacity and small layout changes.
- `motion.slow`: 240 ms maximum for gallery crossfade.
- Easing: standard ease-out for entrance, ease-in for exit.
- Reduced-motion value: 0–1 ms with no spatial translation or scale.
- Progress states use static label plus subtle spinner only when motion is allowed.

## 29. Component inventory

| Component | Responsibility | Essential states/accessibility |
| --- | --- | --- |
| App Shell | Global navigation, private context, content landmark | Calendar/Almanac switcher near Search, Settings/More management, compact navigation, skip link |
| Month Navigator | Month/year movement | Previous/next/today, announced month change |
| Calendar Grid | Month overview | Populated/empty/today/selected/focus/attention |
| Journal Day Tile | Cover and date summary | Real cover, AI cover label, no-image day |
| Almanac Card | Chronological preview | Real/AI/no image, stale indicator, source counts |
| Search Box | Literal query entry | Label, clear, submit, no URL leakage |
| Search Filters | Date/tag/history scope | Exact tags, Include history state |
| Search Result | Match with provenance | Current/history/trash labels, highlighted snippet |
| Media Gallery | Real-photo-first viewing | Keyboard navigation, stable focus, no auto-play |
| Media Item Menu | Item actions | Cover, reorder, redating, original, Trash |
| AI Artwork Card | Generated visual and provenance | AI label, active/stale/failed/suppressed/version |
| Derived Field | Title/summary/tags | Generated/edited/accepted/protected/stale/review |
| Source Journal Card | Authentic text | Source label, timestamp, Correction/history |
| Provenance Disclosure | Trace data | Summary first, detailed fields on demand |
| Upload Journal Panel | File/date/review | Safe preview, duplicate, validation, progress |
| Date Review Card | Undated item resolution | Reason, safe preview, date assignment |
| Date Picker | Historical Journal Date selection | Monday-first, no future, timezone note |
| Conflict Diff | Correction/upstream comparison | Side-by-side/stacked, additions/deletions labels |
| Version history | Source/derived history | Read-only view, explicit selection actions |
| Stale Review Panel | Current/suggested field comparison | Use/keep/edit/resume actions |
| Provider Select | Approved AI configuration | Evaluated options only, privacy/cost/lifecycle |
| Budget Meter | AI usage and gates | Text equivalent, 80%/100% states |
| Health Status Card | Operational evidence | `Unknown`, `Never verified`, `Healthy`, `Attention — delayed`, `Failed`, or `Blocked`; `Not configured` is a separate prerequisite/configuration state |
| Storage Meter | Root/object status | Threshold numbers and emergency copy |
| Trash Item | Recoverable deletion | Expiry, restore, permanent delete |
| Suppression Item | Reconciliation/generation intent | Allow re-import/Allow generation |
| Export Wizard | Complete archive creation | Manifest, passphrase, progress, expiry |
| Inline Status | Local async outcome | Live region, no content excerpt |
| Banner | Cross-page attention | Dismiss only when state permits; focusable action |
| Confirmation Dialog | Consequence and action | Focus trap/return, explicit verbs, checkbox where required |
| Skeleton | Layout-preserving loading | `aria-hidden`; adjacent status text |
| Empty State | Honest absence | No guilt, no decorative false memory |

## 30. Loading, error, interruption, and offline-ish states

`UX-STATE-01` MVP has no offline mode. The application must not show an “Available offline” badge, cache authentic content for offline browsing as a feature, or queue mutations for later without explicit design approval. `REQ-DEFERRED`

`UX-STATE-02` When connectivity is lost, show a persistent `Connection interrupted` banner. Existing visible content may remain readable in the open page, but its freshness is unknown and the UI must not promise continued availability.

`UX-STATE-03` A save attempted while disconnected remains unsaved, keeps the user's current input in memory while the page stays open, and offers Retry. No journal text is written to local/session storage.

`UX-STATE-04` Before reload/navigation would discard an unsaved Correction, use the browser/page unsaved-changes warning.

`UX-STATE-05` If session authorization expires, preserve no sensitive draft outside memory. Reauthentication returns to a generic route where possible; never put source text in redirect state.

`UX-STATE-06` A single failed thumbnail does not fail the day; a single failed Derived Artifact does not fail authentic capture; a failed health signal does not hide browsing.

`UX-STATE-07` Error messages include: what failed, whether authentic content is safe, what remains available, and one next action. Technical identifiers are hidden behind copyable sanitized details.

`UX-STATE-08` Retry must be idempotent from the user's perspective: repeated clicks cannot create duplicate uploads, art versions, or Corrections unless Add duplicate anyway is explicit.

## 31. Usability and accessibility validation plan

No personal journal text or real Daily Photos should be used in design review, prototypes, screenshots, recordings, or third-party usability tooling. Use synthetic fixture content and synthetic/generated non-personal imagery.

### 31.1 Validation rounds

#### Round 1 — structure and terminology

- Low-fidelity annotated wireframes for `WF-01` through `WF-16`.
- Cognitive walkthrough with Arun using synthetic days.
- Validate recognition of Source Item versus Derived Artifact, Journal Date versus Original Timestamp, and real photo versus AI artwork.
- Exit: Arun can correctly explain every boundary without facilitator correction.

#### Round 2 — primary journeys

Interactive prototype covering Calendar, Journal Day, Upload, Search, Date Review, manual artwork, and Back behavior.

Tasks:

1. Find a day from a known month and identify whether its cover is real or generated.
2. Upload a `.md` journal to a historical Journal Date.
3. Resolve an invalid future Telegram date without losing the photo.
4. Find a phrase and then include a historical revision.
5. Generate artwork on a day with a real photo and predict what remains Calendar Cover.
6. Return to the same calendar/search position.

Exit: all tasks complete without critical error; no participant mistakes AI artwork for a Daily Photo; no task implies historical auto-import.

#### Round 3 — trust and management

Prototype conflict, stale-field review, redating, Trash, suppressions, System Health, and Export.

Tasks:

1. Resolve a source/Correction conflict using each of the three actions.
2. Keep an edited summary while accepting a new title.
3. Resume automatic updates for tags only.
4. Redate a photo and predict cover changes on both days.
5. Restore a Voice Journal, then explain Source Suppression behavior after permanent deletion.
6. Distinguish backup success from sampled restore evidence.
7. Create an encrypted export and explain its expiry/deletion behavior.

Exit: no silent-merge expectation; field protection is understood independently; permanent-delete and export consequences are accurately restated.

### 31.2 Accessibility verification

- Automated WCAG scan on every primary surface and dialog state.
- Full keyboard-only pass, including calendar navigation, gallery reorder, diff resolution, date picker, provider dropdowns, and export.
- Screen-reader pass using VoiceOver/Safari and NVDA/Firefox or equivalent supported combinations.
- 200% text zoom, 400% browser zoom, 320 px reflow, light/dark, Windows High Contrast/forced colors where supported.
- Reduced-motion pass confirming no information or operation is lost.
- Contrast measurement for every semantic token pair, image-overlay label, focus ring, disabled state, and diff state.

### 31.3 Measures

- Task completion without facilitator help.
- Critical errors: data loss expectation, wrong date, wrong conflict action, AI/photo confusion, destructive-action misunderstanding.
- Backtracking count and time-to-recover, interpreted qualitatively for one user rather than as population statistics.
- Boundary comprehension: what leaves the server, what backups prove, what is permanently deleted, and why a day may be hidden.
- Emotional fit interview: calm, trustworthy, beautiful, and non-coaching—not “engaging” or habit-forming.

### 31.4 Privacy of research artifacts

- Synthetic content only.
- Local screen recordings only when Arun explicitly approves; otherwise written observations.
- No third-party analytics/session replay.
- Delete disposable prototype data after review; preserve only decisions and sanitized findings in project documentation.

## 32. Unresolved technical gates that constrain UX

No product-preference decision remains open in the discovery requirements. The following implementation/validation gates remain open and must not be disguised as finished behavior:

| Gate | Open evidence | UX consequence |
| --- | --- | --- |
| `UXG-01 VoiceNotes identity/auth` | Synthetic spike must prove webhook-to-MCP identity, unattended OAuth, update/tag/delete behavior, reconciliation, and limits | Final integration-status labels, reconnect controls, and event timing remain provisional |
| `UXG-02 AI model selection` | Approved text/art evaluations have not run | Provider dropdown model names/defaults are not final; show no failing model to satisfy coverage |
| `UXG-03 Encryption/key architecture` | Exact no-additional-cost application encryption and key design needs an architectural decision | Recovery/key setup copy cannot claim a chosen mechanism beyond approved boundary |
| `UXG-04 R2-to-Restic recovery` | Complete inventory, fail-closed backup path, and restore proof required before object-store cutover | System Health must show migration/recovery as unverified until evidence exists |
| `UXG-05 Access/callback verification` | Cloudflare Access assertion validation, machine-host separation, and origin binding must be proven | No application account UI; access/session error states require runtime validation |
| `UXG-06 Export lifecycle` | AES-256 ZIP library/interoperability, secure passphrase handling, and reliable first-successful-download confirmation need architectural proof | Export copy may not promise deletion confirmation until verified |
| `UXG-07 Image pipeline` | HEIC/HEIF decode, hostile-image limits, local EXIF removal, and 4 GB host resource bounds need testing | Unsupported/preview failure states must remain explicit; never claim an accepted Original was transformed |
| `UXG-08 Exact search behavior` | Indexing/tokenization/highlighting and Include history performance need implementation tests | Keep UX lexical and explainable; do not add fuzzy, semantic, or natural-language claims |
| `UXG-09 Artwork API behavior` | Actual refusal shapes, returned dimensions/metadata, cost, latency, and provider versions need bake-off/spike evidence | Artwork status component must accommodate unavailable fields and measured rather than promised timing |
| `UXG-10 Recovery Ceremony` | Two independent key copies and representative restore/decrypt have not been evidenced | Launch readiness remains blocked; no “recoverable” success claim |

If a gate fails, the affected requirement branch returns to Arun/Product Council. The UX must not invent a fallback provider, eligibility rule, privacy claim, or historical-import path.

## 33. Explicitly out of scope for MVP UX

The following experiences must not appear in navigation, empty states, settings, upsells, or “coming soon” prompts unless the product scope is deliberately reopened:

- AI coaching, therapy, diagnosis, advice, reflection prompts, weekly themes, or journal Q&A.
- Habit reminders, photo reminders, streaks, scores, badges, gamification, or guilt-producing gap states.
- Historical automatic VoiceNotes import.
- Multiple users, profiles, household journals, sharing, public links, comments, reactions, or collaboration.
- Native iOS/Android apps, install prompts that imply native behavior, or offline mode/synchronization.
- Blank browser journal composition.
- Web photo upload; Telegram remains the MVP photo capture surface.
- PDF, Word, OCR, audio, or video ingestion.
- PDF books, printing, year mosaics, media wall, maps, location browsing, or On This Day.
- Semantic/vector search, image recognition, conversational search, generated photo captions, or photo-derived AI input.
- Additional VoiceNotes tags, fuzzy tag matching, or browser-editable tag eligibility.
- Real-photo editing, filters, automatic downsampling of Originals, face recognition, or AI visual description.
- High-availability/SLA dashboards or claims.
- Third-party analytics, crash reporting, session replay, ad tracking, or growth instrumentation.
- Immutable ransomware-resistant export workflow.
- Human username/password, password reset, invitations, role administration, or a second login layer.

## 34. Traceability matrix

| UX area | UX IDs | Primary sources |
| --- | --- | --- |
| Principles and boundaries | `UX-PRIN-01`–`11` | `REQ-PRODUCT`, `REQ-PROVENANCE`, `REQ-AI`, `REQ-DEFERRED` |
| Information architecture/navigation | `UX-IA-01`–`04`, `UX-NAV-01`–`04` | `REQ-REFLECTION`, `REQ-PRODUCT` |
| Global behavior | `UX-GEN-01`–`14` | `REQ-PROVENANCE`, `REQ-CAPTURE`, `REQ-OPS`, `LANG` |
| Calendar | `UX-CAL-01`–`11` | `REQ-REFLECTION`, `REQ-AI`, `REQ-PROVENANCE` |
| Monthly Almanac | `UX-TIME-01`–`06` | `REQ-REFLECTION`, `REQ-AI` |
| Search | `UX-SEARCH-01`–`09` | `REQ-REFLECTION`, `REQ-PROVENANCE`, `REQ-DEFERRED` |
| Journal Day | `UX-DAY-01`–`22` | `REQ-PROVENANCE`, `REQ-CAPTURE`, `REQ-AI`, `REQ-REFLECTION` |
| Manual upload | `UX-UPLOAD-01`–`06` | `REQ-CAPTURE`, `REQ-REFLECTION` |
| Date review | `UX-DATE-01`–`06` | `REQ-CAPTURE`, `REQ-PROVENANCE`, `LANG` |
| Redating | `UX-REDATE-01`–`05` | `REQ-PROVENANCE`, `REQ-CAPTURE` |
| Derived review | `UX-REVIEW-01`–`05` | `REQ-AI`, `REQ-PROVENANCE` |
| Artwork | `UX-ART-01`–`17` | `REQ-AI`, `ART-EVAL` |
| Source conflicts | `UX-CONFLICT-01`–`05` | `REQ-PROVENANCE` |
| History | `UX-HIST-01`–`07` | `REQ-PROVENANCE`, `REQ-AI`, `REQ-REFLECTION` |
| Trash/suppressions | `UX-TRASH-01`–`05`, `UX-SUP-01`–`03` | `REQ-OPS`, `REQ-PROVENANCE` |
| Telegram capture | `UX-TG-01`–`08` | `REQ-CAPTURE`, `REQ-OPS` |
| Duplicates | `UX-DUP-01`–`05` | `REQ-OPS`, `REQ-CAPTURE` |
| Settings | `UX-SET-01`–`11` | `REQ-AI`, `REQ-OPS`, `TEXT-EVAL`, `ART-EVAL` |
| System Health | `UX-HEALTH-01`–`11` | `REQ-OPS`, `REQ-RECOVERY`, `MEDIA-EVAL` |
| Export | `UX-EXPORT-01`–`08` | `REQ-OPS` |
| First use | `UX-FIRST-01`–`05` | `REQ-CAPTURE`, `REQ-RECOVERY`, `REQ-OPS` |
| Responsive/accessibility | `UX-RESP-01`–`07`, `UX-A11Y-01`–`17` | `REQ-REFLECTION` |
| Privacy | `UX-PRIV-01`–`08` | `REQ-AI`, `REQ-OPS` |
| Interruption/offline-ish | `UX-STATE-01`–`08` | `REQ-DEFERRED`, `REQ-OPS` |

## 35. UX acceptance summary

The MVP UX is ready to move from specification into wireframing only when the Product Council confirms that:

1. every authentic/derived boundary is visible and accessible;
2. real photos always outrank Generated Artwork as Calendar Cover;
3. no primary flow depends on AI success;
4. dates are explicit, fixed to `Asia/Kolkata`, and never silently guessed in the documented exception states;
5. sources, revisions, Corrections, protection, conflict, Trash, and suppressions remain understandable without data-loss implications;
6. capture acknowledgements and health claims represent only proven durable states;
7. the UI contains no coaching, reminders, sharing, historical auto-import, offline promise, or blank browser journal;
8. privacy language accurately names the selected processor boundary without claiming zero retention or end-to-end encryption;
9. every core action is keyboard accessible, reflows at 320 px, supports reduced motion, and has a tested WCAG 2.2 AA path; and
10. unresolved technical gates remain labeled as gates rather than being silently converted into interface assumptions.
