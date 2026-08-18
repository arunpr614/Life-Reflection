# Life in Days prototype v16 — executable Source/Correction conflict fixtures

Status: **FROZEN**

This ledger is the executable oracle for the approved v16 contract in [COUNCIL-v16.md](./COUNCIL-v16.md). It supplies deterministic setup, actions, visible results, model assertions, failure/race behavior, privacy checks, and the required proof roster. Every case is independent unless an explicit sequence says otherwise.

## 1. Execution discipline

Before every case:

1. reload the held local candidate through the approved harness;
2. reset only the v16 simulated model;
3. select the exact fixture baseline named by the case;
4. clear prior synthetic outcomes, callbacks, timers, console capture, history inspection, storage inspection, clipboard inspection, and request capture;
5. record the initial revision, Correction, resolution-event, displayed-value, DOM, history, storage, and request assertions;
6. execute only the named actions;
7. wait for the named deterministic state, never an arbitrary delay;
8. assert visible copy, focus, accessible state, counts, immutable bytes, and forbidden-surface emptiness.

A case fails if it relies on another case's outcome, wall clock, random identifier, network, browser locale, cached storage, or manual correction. A screenshot is supporting visual evidence, not a substitute for DOM, keyboard, state, count, and privacy assertions.

The represented archive model is volatile prototype state. “Append,” “record,” “reviewed,” “Historical,” and “displayed” describe deterministic in-tab fixture facts; they do not claim persistence.

## 2. Fixed environment

| Fact | Required value |
| --- | --- |
| Locale | English |
| Time zone | Asia/Kolkata |
| Current Journal Date | **2 August 2026** |
| Original Timestamp | **2 Aug 2026, 10:18 pm IST** |
| Source type | **Voice Journal** |
| Visible source title | **Before sleep — synthetic fixture** |
| R2 author | **Archive owner · simulated** |
| C1/C2 author | **Archive owner · simulated** |
| Initial URL privacy | No fixture identity, source text, Correction text, draft, choice, or intent |
| Initial document title privacy | No fixture identity, source text, Correction text, draft, choice, or intent |
| Initial storage | Zero new cookies, localStorage, sessionStorage, IndexedDB, Cache Storage, or OPFS records |
| Initial network | Zero post-load requests |
| Initial clipboard | Unchanged |
| Initial console | No private/synthetic fixture values |

All times are visible literals. Device time and time zone changes do not alter them.

## 3. Primary S-VOICE inventory

| Fact | Exact value |
| --- | --- |
| Test-only Source Item handle | v-02 |
| Source Item identity shown to user | No internal identity |
| Current Journal Date | **2 August 2026** |
| Original Timestamp | **2 Aug 2026, 10:18 pm IST** |
| R1 label | **Voice R1** |
| C1 identity | C-VOICE-1 |
| C1 status at baseline | Current and displayed |
| C1 created | **13 August 2026 · 10:06 pm IST** |
| C1 based on | **Voice R1** |
| R2 label | **Voice R2** |
| R2 represented time | **17 August 2026 · 9:42 pm IST** |
| Conflict at baseline | Unresolved C1/R2 generation |
| Keep time | **18 August 2026 · 9:06 am IST** |
| Display-newest time | **18 August 2026 · 9:08 am IST** |
| C2/manual time | **18 August 2026 · 9:10 am IST** |
| R3 represented arrival | **18 August 2026 · 9:12 am IST** |

Exact Voice R1, frozen unchanged from v15:

~~~text
Rain settled against the balcony rail.
I put the blue cup beside the lamp and read until the room felt quiet.
~~~

Exact Correction 1, frozen unchanged from v15:

~~~text
Rain settled against the balcony rail.
I put the blue cup beside the lamp, then read until the room felt quiet.
~~~

Exact newest Voice R2:

~~~text
Rain settled against the balcony rail.
I moved the blue cup beside the lamp and read until the room grew quiet.
Before midnight, I opened the window for a few minutes.
~~~

Exact valid C2:

~~~text
Rain settled against the balcony rail.
I moved the blue cup beside the lamp, then read until the room grew quiet.
Before midnight, I opened the window and listened to the rain for a few minutes.
~~~

Exact R3 race revision:

~~~text
Rain settled against the balcony rail.
I moved the blue cup beside the lamp and read until the room grew quiet.
Before midnight, I opened the window for a few minutes, then closed it when the rain strengthened.
~~~

Exact intent identities, test ledger only:

| Outcome | Intent |
| --- | --- |
| Keep | intent-v16-conflict-keep-01 |
| Display newest | intent-v16-conflict-display-newest-01 |
| Based on both | intent-v16-conflict-based-on-both-01 |

The intent values must be absent from visible and hidden DOM, accessibility tree, URL, title, history state, every storage API, clipboard, network, console, error payload, telemetry, screenshot, and live region.

## 4. Baseline and terminal model assertions

Each outcome suite resets to U0:

| Model fact | U0 unresolved | K terminal | D terminal | B terminal |
| --- | --- | --- | --- | --- |
| Source Revisions | R1, R2 | R1, R2 | R1, R2 | R1, R2 |
| Revision bytes | exact and immutable | unchanged | unchanged | unchanged |
| Corrections | C1 | C1 | C1 | C1, C2 |
| Correction bytes | exact and immutable | C1 unchanged | C1 unchanged | C1 and exact C2 |
| Resolution events | 0 | exactly 1 Keep | exactly 1 Display newest | exactly 1 Based on both |
| Displayed value | C1 | C1 | R2 | C2 |
| C1 presentation status | Current | Current | Historical | Historical |
| R2 reviewed | No | Yes | Through resolution | Through C2 resolution |
| C2 base | none | none | none | R2 |
| C2 lineage | none | none | none | C1 |
| Conflict generation | unresolved | resolved | resolved | resolved |

Cancel, validation errors, loading failure, known-zero failure, session expiry before any accepted effect, and non-confirming navigation must match U0 exactly. Session expiry never creates an effect and never erases an effect that may already have been accepted; post-acceptance result-unknown resumes through read-only reconciliation before any new intent.

R3 arrival is an upstream Source Revision append, not a v16 resolution effect, and therefore does not match U0 revision counts:

| R3 state | Source Revisions | Corrections | Resolution events | Displayed value | Unresolved conflict generation |
| --- | --- | --- | --- | --- | --- |
| R3 before R2 acceptance | R1, R2, R3 | C1 | 0 | C1 | fresh C1/R3; prior R2 intent stale |
| R3 after accepted K | R1, R2, R3 | C1 | exactly 1 Keep | C1 | fresh C1/R3; Keep terminal retained |
| R3 after accepted D | R1, R2, R3 | C1 | exactly 1 Display newest | R2 | fresh R2/R3; Display-newest terminal retained |
| R3 after accepted B | R1, R2, R3 | C1, C2 | exactly 1 Based on both | C2 | fresh C2/R3; Based-on-both terminal retained |

R1, R2, R3, C1, and any accepted C2 remain immutable and retained. Representing R3 never chooses a display outcome, reuses the R2 intent, or adds a resolution event.

One accepted terminal is exclusive. K, D, and B can never coexist for the same conflict generation.

## 5. Complete primary diff oracle

**Complete text** is the initial selected view and exposes both complete documents:

| Paragraph | Displayed Correction C1 | Newest VoiceNotes R2 | Classification |
| ---: | --- | --- | --- |
| 1 | Rain settled against the balcony rail. | Rain settled against the balcony rail. | Unchanged |
| 2 | I put the blue cup beside the lamp, then read until the room felt quiet. | I moved the blue cup beside the lamp and read until the room grew quiet. | Both complete paragraphs changed |
| 3 | absent | Before midnight, I opened the window for a few minutes. | Only in newest VoiceNotes revision |

**Changes only** must:

- label C1 paragraph 2 **Only in displayed Correction**;
- label R2 paragraphs 2 and 3 **Only in newest VoiceNotes revision**;
- show **1 unchanged paragraph hidden** while paragraph 1 is collapsed;
- offer **Show 1 unchanged paragraph**;
- render paragraph 1 verbatim after expansion;
- leave both complete documents available through **Complete text**.

Character highlighting may supplement but never replace full changed paragraphs and text labels. Punctuation, line breaks, capitalization, and spaces must remain inspectable.

## 6. Long and hostile inert fixture

The long fixture exists only to prove complete rendering, wrapping, reflow, and inert content. Its C1 and R2 are synthetic and never become executable markup.

Exact LONG-C1:

~~~text
At 6:10 pm the terrace was cool, the chair was dry, and the notebook lay open beside an empty glass.

I wrote a deliberately long sentence about the left shelf, the brass key, the folded map, the dim hallway, the kettle clicking off, and the slow rain returning against every window in the room so wrapping and reading order can be inspected without a nested scroll region or clipped continuation.

The third paragraph stays exactly the same in both complete documents.

The old note says that the lantern stayed beside the north window until morning.

Literal hostile fixture: <script>document.location='https://invalid.example/leak'</script> <img src=x onerror=alert(1)> [open](javascript:alert(1)) {{constructor.constructor('alert(1)')()}} " autofocus onfocus="alert(1) U+202E must all remain visible inert text.

Unbroken-wrap-token-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-end stayed in Correction 1.
~~~

Exact LONG-R2:

~~~text
At 6:10 pm the terrace was cool, the chair was dry, and the notebook lay open beside an empty glass.

I wrote a deliberately long sentence about the right shelf, the silver key, the unfolded map, the bright hallway, the kettle clicking twice, and the steady rain returning against every window in the room so wrapping and reading order can be inspected without a nested scroll region or clipped continuation.

The third paragraph stays exactly the same in both complete documents.

The newest note says that the lantern moved from the north window before morning.

Literal hostile fixture: <script>document.location='https://invalid.example/leak'</script> <img src=x onerror=alert(1)> [open](javascript:alert(1)) {{constructor.constructor('alert(1)')()}} " autofocus onfocus="alert(1) U+202E must all remain visible inert text.

Unbroken-wrap-token-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-end moved into Voice R2.
~~~

The long Changes-only view has exactly three unchanged paragraphs: 1, 3, and 5. It shows **3 unchanged paragraphs hidden** and **Show 3 unchanged paragraphs**. It never interprets tags, Markdown, URL-like text, template expressions, quotes, event-handler text, or the Unicode-code-point label. There are no image/script/style/link requests or elements derived from the string.

## 7. Exact copy ledger

### Entry and workbench

| Purpose | Exact copy |
| --- | --- |
| Entry heading / h1 | **Review source update** |
| Entry body | **VoiceNotes changed after this Correction was created. Nothing was merged. The displayed Correction remains unchanged until you choose an outcome.** |
| Retention | **Every Source Revision and prior Correction remains retained.** |
| Eyebrow | **Source Item conflict** |
| Cancel action | **Cancel** |
| Cancel explanation | **Cancel closes this review without resolving it. The displayed Correction stays unchanged and Review source update remains visible.** |
| Compare heading | **Compare complete text** |
| Default view | **Complete text** |
| Alternate view | **Changes only** |
| C1 label | **Displayed correction** |
| R2 label | **Newest VoiceNotes revision** |
| C1 status | **Currently displayed** |
| R2 status | **Not displayed** |
| C1 difference | **Only in displayed Correction** |
| R2 difference | **Only in newest VoiceNotes revision** |
| Primary omission | **1 unchanged paragraph hidden** |
| Primary expansion | **Show 1 unchanged paragraph** |
| Long omission | **3 unchanged paragraphs hidden** |
| Long expansion | **Show 3 unchanged paragraphs** |
| Choice heading | **Choose what Life in Days displays** |

### Outcomes and previews

| Order | Exact action | Exact preview consequence |
| ---: | --- | --- |
| 1 | **Keep the Correction** | **The current Correction will stay displayed. Voice R2 will be marked reviewed. Voice R1, Voice R2, and Correction 1 remain retained.** |
| 2 | **Display newest upstream revision** | **Voice R2 will become displayed. Correction 1 will remain retained as Historical; it is not deleted. Voice R1 and Voice R2 remain unchanged.** |
| 3 | **Create a new Correction based on both** | **A manual workspace will open with both versions visible. The editor starts with Correction 1 only. No VoiceNotes text is inserted or merged. The conflict remains unresolved until a new Correction is saved.** |

Every preview visibly includes **Affected Source Item** / **Before sleep — synthetic fixture** and **Journal Date** / **2 August 2026**, followed by **Currently displayed**, **After this choice**, **Retained facts**, and safe action **Back to choices**. The confirming action repeats the selected exact outcome label.

### Manual workspace

| Purpose | Exact copy |
| --- | --- |
| h1 | **Create a new Correction based on both** |
| Intro | **Use both versions as references. The editor starts with the displayed Correction only. Nothing from VoiceNotes is inserted or merged.** |
| Textarea label | **New displayed Correction** |
| Helper | **This changes only what Life in Days displays. Every Source Revision and prior Correction remains retained.** |
| Empty | **Enter Correction text before saving.** |
| Equals C1 | **Change the displayed text before saving.** |
| Equals R2 | **This text matches the newest VoiceNotes revision. Choose Display newest upstream revision instead.** |
| Dirty | **Unsaved changes · kept only while this page remains open.** |
| Safe action | **Cancel new Correction** |
| Save action | **Save new Correction** |
| Leave heading | **Leave with an unsaved Correction?** |
| Leave body | **This Correction is kept only in this open page. Leaving or reloading will discard it.** |
| Stay action | **Keep editing** |
| Discard action | **Discard Correction and leave** |

### Operational states

| State | Exact copy/action |
| --- | --- |
| Loading | **Loading source update** / **Loading the complete displayed Correction and newest VoiceNotes revision.** |
| Load failure | **Source update could not be loaded. The displayed Correction remains unchanged. Retry.** / **Retry loading** |
| Pending | **Resolving source update** |
| Known zero | **Conflict not resolved. The displayed Correction and every Source Revision remain unchanged. Retry.** / **Retry resolution** |
| Unknown | **Resolution result unknown. Check resolution status before trying again.** / **Check resolution status** |
| Reconciling | **Checking resolution status** |
| Reconciled zero | **No resolution was found for the original intent. The source update remains unresolved. Retry.** / **Retry resolution** |
| Reconciled one | **Source update already resolved. No second resolution event was created.** |
| Pre-effect connection | **Connection interrupted. The source update remains unresolved. Nothing changed.** |
| Workspace connection | **Connection interrupted. Your draft remains in this open page. Nothing was saved.** |
| R3 stale | **A newer VoiceNotes revision arrived while this review was open. Nothing changed. Review the latest source update.** / **Review latest source update** |
| Session | **Session ended** / **Sign in again to return to Life in Days. Unsaved Correction text was not retained.** |

### Terminals and boundaries

| State | Exact copy |
| --- | --- |
| Keep success | **Correction kept in this tab. Voice R2 was marked reviewed. Every Source Revision and prior Correction remains retained. Nothing was persisted.** |
| Display success | **Voice R2 displayed in this tab. Correction 1 remains retained as Historical; it was not deleted. Nothing was persisted.** |
| C2 success | **New Correction displayed in this tab. It is based on Voice R2 with Correction 1 lineage. Every Source Revision and prior Correction remains retained. Nothing was persisted.** |
| Prototype | **Prototype data · represented conflict-resolution records only. Nothing is persisted, encrypted, or sent over the network.** |
| Derived fields | **Generated fields and artwork were not refreshed in this prototype. Their lifecycle remains outside v16.** |
| No-Correction handoff | **This source changed before a Correction was saved. It is not a Source/Correction conflict. No conflict outcome was created.** |

## 8. E — entry and eligibility matrix

| ID | Setup and event | Required visible result | Required model result |
| --- | --- | --- | --- |
| E1 | U0 corrected Source Item on day 2. | Persistent **Review source update** entry, exact body and retention copy; C1 remains shown. | 2 revisions, 1 Correction, 0 events, displayed C1. |
| E2 | Activate the entry. | Dedicated page enters loading, then h1-focused ready state with exact Source facts, complete C1/R2, view controls, three cards, separate Cancel, disclosures. | Zero effect. |
| E3 | U0; inspect action order by DOM, keyboard, and pixels. | Keep, Display newest, Based on both; equal hierarchy; Cancel outside outcome region. | Zero effect. |
| E4 | Source R2 exists but no saved/current Correction. | Exact no-Correction handoff; no v16 workbench or three outcomes. | No fabricated C1, conflict, intent, or event. |
| E5 | Daily Photo, Generated Artwork, title, summary, tag, caption, unrelated Source Item, or global shell. | No v16 conflict launch. | Zero effect. |
| E6 | Open U0 from keyboard. | Same complete route as pointer; h1 focused; no document text announced automatically. | Zero effect. |
| E7 | Return after non-resolving Cancel. | Entry remains visible and opens same unresolved generation. | Counts unchanged; displayed C1. |
| E8 | A terminal outcome already exists for this generation. | Success/source-card terminal, not the unresolved launch. | No second intent or event. |

## 9. A — anatomy, complete diff, and preview matrix

| ID | Setup and event | Required result |
| --- | --- | --- |
| A1 | Open U0 at 1440×900. | DOM follows the 13-part Council order; complete C1 article precedes complete R2 article; visual columns begin at 1024px. |
| A2 | Inspect default comparison. | **Complete text** selected; exact entire C1 and R2 visible; line breaks/punctuation preserved. |
| A3 | Select **Changes only**. | Exact text labels on complete changed paragraphs; primary omission says **1 unchanged paragraph hidden**. |
| A4 | Activate **Show 1 unchanged paragraph**. | Exact first paragraph appears; count/control updates accessibly; no scroll reset or model effect. |
| A5 | Return to **Complete text**. | Both exact complete documents return; selected state and focus are exposed. |
| A6 | Open LONG fixture at wide viewport. | Full LONG-C1 then full LONG-R2; one page scroll; no nested/synchronized comparison scroll. |
| A7 | Select long Changes-only. | Exactly three unchanged paragraphs omitted, correct copy and expansion; changed paragraphs untruncated. |
| A8 | Inspect at 390×844. | Accessible full-document tabs **Displayed correction** and **Newest VoiceNotes revision**; one whole document at a time; no cramped columns. |
| A9 | Switch compact tabs repeatedly. | Exact complete document changes; selected tab retains focus; no scroll trap or state mutation. |
| A10 | Activate each outcome separately from reset U0. | Matching modal title, exact affected Source Item/title and Journal Date, exact consequence, three outcome fact labels, safe action, repeated exact confirmation. |
| A11 | Press Escape in every preview. | Preview closes; invoking card regains focus; U0 unchanged. |
| A12 | Activate **Back to choices** in every preview. | Same non-effect and focus restoration as Escape. |
| A13 | Inspect preview DOM/visual order at desktop/mobile/landscape. | Heading; **Affected Source Item** then **Journal Date**; consequence; outcome facts; **Back to choices**; selected confirmation. Safe action always precedes confirmation. |
| A14 | Try Enter/Space outside an outcome control and initial page load. | No card preselected and no outcome starts. |

## 10. V — manual-workspace validation matrix

| ID | Setup and event | Required result |
| --- | --- | --- |
| V1 | Confirm Based-on-both preview. | Workspace opens with complete C1/R2 references; textarea equals C1 byte-for-byte; no R2 character inserted; conflict unresolved. |
| V2 | Inspect editor semantics. | h1, intro, Source facts, C1/R2 references, labeled textarea, helper, **Cancel new Correction**, **Save new Correction** in exact order. |
| V3 | Replace text with empty string and attempt Save. | Exact **Enter Correction text before saving.**; Save disabled/blocked; error associated; zero intent/effect. |
| V4 | Use spaces, tabs, or line breaks only. | Same empty validation; source/draft not normalized into a saved record. |
| V5 | Restore exact C1. | Exact **Change the displayed text before saving.**; Save disabled; zero intent/effect. |
| V6 | Enter exact R2. | Exact R2-match guidance; Save disabled; zero intent/effect. |
| V7 | Enter exact approved C2. | Dirty copy appears; Save enabled; references remain immutable and complete. |
| V8 | Enter text differing from C1/R2 only by deliberate user byte, not whitespace-only. | Valid if non-whitespace and byte-different; no silent trim/autocorrect/reformat. |
| V9 | Edit, then Cancel. | Inherited leave dialog; **Keep editing** first; no effect before choice. |
| V10 | Choose Keep editing. | Exact draft, selection where supported, scroll, and focus context retained in open page. |
| V11 | Choose Discard Correction and leave. | Draft removed; unresolved workbench returns; U0 unchanged. |
| V12 | Open a clean workspace and Cancel. | No leave warning; unresolved workbench returns; U0 unchanged. |

## 11. K — Keep the Correction matrix

| ID | Setup and events | Required result |
| --- | --- | --- |
| K1 | U0 → select Keep. | Preview only; exact Keep consequence; model remains U0. |
| K2 | K1 → confirm once. | Synchronous pending/locked state and one Keep intent; no early success. |
| K3 | Accept one matching complete success. | Exactly one Keep event at 18 August 2026 · 9:06 am IST; C1 displayed; R2 reviewed; exact success copy. |
| K4 | Inspect immutability. | R1, R2, C1 bytes, author, base, created time, Original Timestamp, Current Journal Date, Source type/title unchanged. |
| K5 | Inspect counts. | Revisions 2, Corrections 1, events 1; no C2; one displayed value C1. |
| K6 | Deliver duplicate success callback and rapid repeated confirmation. | No second event, timestamp, announcement, or UI terminal. |
| K7 | Navigate Back/Forward/reopen resolved Source Item. | Accepted Keep terminal remains; unresolved generation not resurrected; no replay. |
| K8 | Inspect bounded history/source-card facts. | Outcome Keep, R2 reviewed, exact time, C1 displayed, all retained; no full History UI invented. |

## 12. D — Display newest upstream revision matrix

| ID | Setup and events | Required result |
| --- | --- | --- |
| D1 | U0 → select Display newest. | Preview only; exact no-deletion consequence; U0 unchanged. |
| D2 | D1 → confirm once. | Pending/locked and one Display-newest intent. |
| D3 | Accept matching complete success. | Exactly one event at 18 August 2026 · 9:08 am IST; exact R2 displayed; exact success copy. |
| D4 | Inspect C1. | C1 retained byte-for-byte with original author/time/base and presented Historical; not deleted. |
| D5 | Inspect R1/R2. | Both immutable; no source rewrite or Correction created from R2. |
| D6 | Inspect counts. | Revisions 2, Corrections 1, events 1; one displayed value R2. |
| D7 | Duplicate callback/rapid repeat/navigation replay. | No additional event, status mutation, or announcement. |
| D8 | Inspect bounded history/source-card facts. | Outcome Display newest, R2 displayed, C1 Historical/retained, exact time. |

## 13. B — Based-on-both matrix

| ID | Setup and events | Required result |
| --- | --- | --- |
| B1 | U0 → select Based on both. | Exact preview; U0 unchanged. |
| B2 | Confirm preview. | Manual workspace only; no intent/event/C2; textarea exact C1 and zero R2 insertion. |
| B3 | Save without changing C1. | Exact C1 validation; no intent/effect. |
| B4 | Replace with exact R2 and Save. | Exact R2-match validation; no intent/effect. |
| B5 | Enter exact approved C2. | Valid dirty state; text differs byte-for-byte from both C1 and R2. |
| B6 | B5 → Save once. | Pending/locked and exactly one Based-on-both intent with expected C1/R2 snapshot. |
| B7 | Accept one matching complete success. | Exactly C-VOICE-2 appended and displayed; exact success copy. |
| B8 | Inspect C2 metadata. | Author Archive owner · simulated; created/resolved 18 August 2026 · 9:10 am IST; base Voice R2; lineage Correction 1. |
| B9 | Inspect immutability. | R1, R2, C1 bytes and original metadata unchanged; C1 Historical, not deleted. |
| B10 | Inspect counts. | Revisions 2, Corrections 2, events 1; one displayed value C2. |
| B11 | Deliver duplicate success/rapid Save. | No C3, second C2, second event, or repeated terminal. |
| B12 | Return via Back/Forward/reopen. | C2 terminal is deterministic; draft/workspace not replayed. |
| B13 | Inspect bounded history/source-card facts. | C2 text, author/time, base R2, C1 lineage, C1 Historical, retained R1/R2/C1. |

## 14. F — loading, known-zero failure, and retry matrix

| ID | Setup and events | Required result |
| --- | --- | --- |
| F1 | Delay fixture load. | Exact loading title/body; no empty comparison/outcomes; focus/status valid; zero effect. |
| F2 | Fail fixture load. | Exact load-failure copy and **Retry loading**; C1 remains displayed on return; zero intent/event. |
| F3 | Retry loading, then succeed. | One ready workbench with exact complete snapshot; no duplicate DOM or effect. |
| F4 | Confirm Keep, return trusted known-zero failure. | Exact known-zero copy; U0; **Retry resolution** available. |
| F5 | F4 → Retry. | Same Keep intent and same C1/R2 snapshot; no new intent identity. |
| F6 | F5 → matching success. | One K terminal only. |
| F7 | Repeat F4–F6 for Display newest. | One D terminal only; never a Keep/B event. |
| F8 | Repeat F4–F6 for exact C2 Save. | Draft remains in open page after known-zero; retry uses same B intent; one C2/event. |
| F9 | Simulate connection loss before effect begins. | Exact pre-effect connection copy; U0; retry may use original intended action only. |
| F10 | Simulate connection loss while editing before Save. | Exact workspace connection copy; exact draft retained in open page; zero intent/event. |
| F11 | Return malformed/mismatched/incomplete success. | Reject as untrusted; do not adopt; transition to failure or unknown per harness signal; no count change. |
| F12 | Return failure after accepted success. | Ignore late failure; accepted terminal unchanged; no contradictory error. |

## 15. Q — unknown-result and reconciliation matrix

| ID | Setup and events | Required result |
| --- | --- | --- |
| Q1 | Confirm any outcome; lose result after submission. | Exact unknown copy and **Check resolution status**; effect not assumed; all choices/dismissal/navigation locked. |
| Q2 | Q1 → check status. | Exact **Checking resolution status**; read-only reconciliation; no second intent. |
| Q3 | Reconcile zero. | Exact reconciled-zero copy; U0; **Retry resolution** reuses original intent/snapshot. |
| Q4 | Q3 → retry → matching success. | Exactly one matching terminal; never two events/C2s. |
| Q5 | Reconcile one matching complete result. | Adopt exact matching terminal; exact already-resolved copy; no write/replay. |
| Q6 | Reconcile still unknown. | Return to exact unknown state; repeated status checks are read-only; alternate actions remain locked. |
| Q7 | Reconcile a mismatched outcome, intent, R2, C1, or incomplete record. | Do not adopt; remain unknown/fail closed; counts and displayed value not locally guessed. |
| Q8 | Deliver delayed original success after Q5 adoption or Q4 retry success. | Idempotent no-op; one terminal announcement and event total. |

## 16. R — concurrency and race matrix

| ID | Setup and events | Required result |
| --- | --- | --- |
| R1 | U0 ready review; R3 arrives at exact race time before preview. | Exact stale copy/action; revisions R1/R2/R3; Corrections C1; resolution events 0; displayed C1; prior R2 intent stale; Review latest opens the fresh complete C1/R3 generation. |
| R2 | Keep preview open; R3 arrives. | Preview becomes non-confirmable; stale state; zero effect. |
| R3 | Display preview open; R3 arrives. | Same fail-closed result. |
| R4 | Dirty Based-on-both workspace; R3 arrives before Save. | Save blocked; stale copy; draft may remain visible only for reference in current page but cannot resolve R2; zero event/C2. |
| R5 | Save begins and the UI shows pre-acceptance pending; R3 arrives before compare-and-accept. | Guard rejects stale R2 snapshot; zero C2/event; Review latest required. |
| R6 | R2 Keep result accepted, then R3 arrives. | Keep remains once; a new C1/R3 conflict may be represented; original event not undone/reused. |
| R7 | R2 Display result accepted, then R3 arrives. | D terminal remains once; no automatic R3 display; any later state is a new generation. |
| R8 | R2 C2 result accepted, then R3 arrives. | C2 remains once; new C2/R3 conflict may be represented; no automatic C3. |
| R9 | R2 compare-and-accept may already have succeeded, but its result is lost/untrusted; then R3 arrives. | This is post-acceptance result-unknown, not R5 pending. Original unknown remains authoritative; reconcile R2 intent before offering any R3 outcome, adopt one matching result if found, then represent R3 as a new generation. |
| R10 | Two tabs confirm different R2 outcomes. | First accepted matching terminal wins; loser becomes stale/reconciles; exactly one event and legal terminal counts. |
| R11 | Duplicate callback, rapid repeat, late success, late failure, restored callback. | Zero additional effect after first accepted result. |
| R12 | Current displayed record changes independently before acceptance. | Snapshot guard rejects; nothing overwritten; no guessed terminal. |

## 17. N — navigation, connection, session, and lifecycle matrix

| ID | Setup and events | Required result |
| --- | --- | --- |
| N1 | Record day scroll/invoker; open review; activate Cancel. | Exact day, scroll, and invoker focus restored; conflict visible; U0. |
| N2 | Browser Back from ready review. | Non-resolving return; conflict persists; U0. |
| N3 | Forward after N2. | Fresh read-only review may appear; no preview/confirmation/effect replay. |
| N4 | Reload ready review. | Re-derived U0; complete view default; no effect. |
| N5 | Back/Forward after K/D/B terminal. | Accepted terminal deterministic; no unresolved-generation resurrection or new callback. |
| N6 | Attempt in-app navigation during pending. | Locked; one pending intent; no destination/effect duplication. |
| N7 | Attempt Cancel, Back-to-choices, alternate outcome, or in-app navigation during unknown/reconciling. | Locked; original intent must reconcile first. |
| N8 | Dirty workspace → in-app route. | Exact leave warning; Keep editing preserves open-page draft; discard loses it with zero effect. |
| N9 | Dirty workspace → reload/Back where warning is supported. | Same warning semantics; leaving discards volatile draft and creates no event. |
| N10 | Simulate session expiry from ready review. | Exact session terminal; zero resolution; source/draft content absent from announcement. |
| N11 | Simulate session expiry from dirty workspace. | Exact session copy; draft removed/not retained; zero event/C2. |
| N12 | Simulate resume/sign-in from N10 or N11. | Recompute represented U0 truth; never restore private draft or replay intent. |
| N13 | Expire the session while an outcome shows pre-acceptance pending, before compare-and-accept. | Generic session route; pending callback invalidated; U0 and zero events on resume; no auto-resume or new intent. |
| N14 | Lose/untrust an outcome result after compare-and-accept may have succeeded, then expire the session. Resume/sign in. | Generic session route contains no outcome detail. Resume preserves the original result-unknown authority and performs read-only reconciliation: zero returns U0; one adopts exactly one matching K/D/B terminal. No new intent is available until reconciliation settles. |
| N15 | Resize/rotate/switch theme/change zoom while ready/preview/workspace. | State, content, selection, draft, and snapshot remain; no outcome/effect. |
| N16 | Let timers/callbacks fire after route destruction. | Unmounted callbacks cannot recreate UI, announce private content, or mutate counts. |

## 18. S — safety, privacy, accessibility, history, and regression matrix

| ID | Setup and inspection | Required result |
| --- | --- | --- |
| S1 | Capture requests from before open through every outcome/failure/race. | Zero post-load requests; hostile fixture creates none. |
| S2 | Inspect cookies, localStorage, sessionStorage, IndexedDB, Cache Storage, OPFS, service workers before/after. | No v16 writes/registrations; no fixture, draft, choice, outcome, or intent. |
| S3 | Inspect URL path/query/hash, title, history length/state through navigation. | No private/synthetic values or intents; history cannot replay effects. |
| S4 | Inspect visible and hidden DOM/accessibility tree after each route. | Only currently visible synthetic content present; inactive documents/drafts removed where required; no internal handles/intents. |
| S5 | Inspect console, errors, logs, telemetry hooks, analytics buffers. | No source, Correction, title, author, date, draft, choice, handle, or intent leakage. |
| S6 | Inspect clipboard before/after all native prototype actions. | Unchanged; no automatic copy. |
| S7 | Render LONG hostile fixture. | Every string inert/verbatim; no script/style/image/link/event handler/Markdown/bidi execution. |
| S8 | Keyboard traverse workbench. | Logical order, visible focus, no trap outside modal, all controls operable, Cancel separate. |
| S9 | Keyboard traverse preview. | Heading focus, modal trap, Escape/safe return to invoker, safe before confirmation. |
| S10 | Inspect live regions. | Loading/pending/error/unknown/stale/success announced once as bounded state; no document/draft text or intent. |
| S11 | Run 390×844 compact comparison. | Full-document switcher accessible; no missing text/control/horizontal page overflow. |
| S12 | Run 568×320 landscape preview. | Full consequence and both ordered actions reachable; dialog not clipped. |
| S13 | Run 640×900 at 200% text zoom. | Unsaved warning and R3 states reflow; controls reachable; no overlap. |
| S14 | Run 320×900 at 400% page reflow with LONG. | No horizontal page overflow, clipping, or inaccessible outcome path; long token wraps safely. |
| S15 | Enable forced colors and reduced motion. | Focus, selected state, difference semantics, errors, dialog bounds remain; nonessential motion removed. |
| S16 | Measure every v16 light/dark text/background, conflict and difference label/surface, error/validation, selected/unselected/disabled control, dialog/input boundary, and focus token combination; inspect targets/metadata. | Normal text ≥4.5:1; large text ≥3:1; UI boundaries and focus ≥3:1; measured ratios recorded rather than assumed; labels carry meaning; inherited token mapping only; controls at least 44×44; metadata at least 13px. This is deterministic prototype evidence, not a formal WCAG conformance claim. |
| S17 | Inspect terminal bounded history facts. | Exact outcome/time/display/base/lineage/retention facts; immutable records; no full History feature invented. |
| S18 | Execute held v6–v15 regression checks and compare frozen artifacts. | No inherited route, copy, fixture, frame, transition, token, focus, privacy, or cardinality drift. |

## 19. Outcome event sequences

### K-success

1. reset U0;
2. OPEN_REVIEW;
3. LOAD_SUCCEEDED with exact C1/R2 snapshot;
4. OPEN_KEEP_PREVIEW;
5. CONFIRM_KEEP, capturing C1/R2 and Keep intent;
6. show pending and lock;
7. accept one matching complete RESOLUTION_SUCCEEDED;
8. assert K terminal and exact time;
9. deliver duplicate callback and assert no-op.

### D-success

Use the same sequence with OPEN_DISPLAY_PREVIEW, CONFIRM_DISPLAY, the Display-newest intent, D terminal, and exact Display time.

### B-success

1. reset U0;
2. open/load review;
3. OPEN_BASED_PREVIEW;
4. OPEN_MANUAL_WORKSPACE;
5. assert textarea exact C1 and zero R2 insertion;
6. REPLACE_DRAFT with exact C2;
7. SAVE_C2, capturing C1/R2, exact draft, and Based-on-both intent;
8. show pending and lock;
9. accept one matching complete RESOLUTION_SUCCEEDED;
10. assert B terminal, C2 base R2, C1 lineage, exact time;
11. deliver duplicate callback and assert no-op.

### Q-zero-then-success

1. begin any named intent;
2. lose the result;
3. show unknown;
4. CHECK_RESOLUTION_STATUS;
5. reconcile zero;
6. show exact zero copy;
7. RETRY with the same intent and snapshot;
8. accept one matching success;
9. assert exactly one legal terminal.

### R3-stale

1. reset U0 and open any review, preview, workspace, or pre-acceptance pending state;
2. inject exact R3 at **18 August 2026 · 9:12 am IST** before compare-and-accept;
3. assert stale copy, immutable R3 retained, revisions R1/R2/R3, and zero resolution mutation/event;
4. activate **Review latest source update**;
5. assert fresh complete C1/R3 snapshot;
6. assert the old R2 action cannot fire.

## 20. Deterministic focus and announcement oracle

| Transition | Focus | Announcement |
| --- | --- | --- |
| Open workbench ready | h1 **Review source update** | No automatic document text |
| Switch compact document | Selected tab | Selected state only; no full document in live region |
| Open preview | Selected outcome heading | No duplicate consequence announcement beyond dialog semantics |
| Escape / Back to choices | Invoking outcome control | None |
| Open manual workspace | h1 **Create a new Correction based on both** | No draft/reference text in live region |
| Invalid save attempt | First invalid textarea/error relationship | Exact validation once |
| Pending | Pending heading/status | **Resolving source update** once |
| Known-zero | Error heading | Bounded exact error once |
| Unknown | Unknown heading | Bounded exact unknown once |
| R3 stale | Stale heading | Bounded exact stale state once |
| Success | Source Item card heading | Exact bounded terminal once |
| Cancel | Original launch control | None |

Announcements never contain full/partial source text, Correction text, draft, hidden handle, conflict generation, or intent identity.

## 21. Privacy surface oracle

| Surface | Permitted | Forbidden |
| --- | --- | --- |
| Visible active content | Exact synthetic C1/R2/R3/C2 and approved copy | Real/private content; hidden IDs/intents |
| Hidden DOM | Structural semantics required for active view | Parked inactive document/draft; handles/intents/private values |
| URL/title | Stable non-private route/title | Text, title, author, date, handle, intent, choice, draft |
| History state | Opaque navigation marker only if required | Any fixture/private value or effect payload |
| Storage/cookies/cache | Nothing new | Any v16 state/content/intent |
| Network | Zero post-load requests | Sync, image/link/script request, telemetry, error beacon |
| Console/log/error | Bounded non-content diagnostics only | Fixture/private values, intents, drafts |
| Clipboard | User-controlled native selection only; no prototype write | Automatic copy/write |
| Live region | Bounded state/copy | Source, Correction, draft, IDs |
| Screenshot roster | Approved synthetic fixture and visible copy | Hidden IDs, debug panels, private data |

## 22. v17+ negative assertions

Independent QA must assert absence of:

- real provider/API/network/persistence/encryption/auth implementation;
- automatic/AI/semantic merge or suggestions;
- Source Revision or Correction byte editing/deletion;
- undo resolution or full History browsing;
- bulk, batch, sharing, collaboration, notification, reminder, or multi-owner behavior;
- conflict outcomes for sources without a current Correction or for non-source derived fields;
- arbitrary version picking/pinning/deletion;
- any fourth/default/recommended outcome;
- Generated Artwork/summary/tag refresh;
- production, deployment, security, privacy, or WCAG conformance claims.

## 23. Frozen 22-frame roster

This table is byte-for-byte identical to the roster in [COUNCIL-v16.md](./COUNCIL-v16.md).

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

## 24. Independent QA completion matrix

| Gate | Required evidence |
| --- | --- |
| Authority | P=A, D=A, C=A and both internally linked frozen documents present. |
| Exact facts | Every primary text, identity, author, label, and five represented times exact. |
| Entry/anatomy | E1–E8 and A1–A14 pass. |
| Validation | V1–V12 pass, including C1/R2 equality rejection. |
| Outcomes | K1–K8, D1–D8, B1–B13 pass with legal cardinalities. |
| Resilience | F1–F12 and Q1–Q8 pass with same-intent retry/read-only reconciliation. |
| Concurrency | R1–R12 pass, including R3 and two-tab first-accepted winner. |
| Lifecycle | N1–N16 pass, including pre-acceptance pending and post-acceptance result-unknown session expiry. |
| Safety | S1–S18 pass, including no requests/storage/leaks and frozen v6–v15 regression. |
| Accessibility | Keyboard, focus, announcements, forced colors, reduced motion, mobile, landscape, 200%, 400% checks pass without a formal conformance claim. |
| Visual proof | All 22 exact basenames exist, are correctly sized/themed, and prove the named state. |
| Scope | Every v17+ negative assertion passes. |
| Provenance | One held candidate identity and fresh command/result evidence recorded by the parent workflow. |

QA must stop on the first contradictory authority, missing fixture, nondeterministic result, privacy leak, duplicate effect, stale-snapshot acceptance, incomplete comparison, inaccessible action, inherited regression, or excluded feature. A partial pass is not approval.
