# Life in Days prototype v18 — History and Provenance fixture authority

- **Frozen by:** v18 Product, Design, and Project Council
- **Decision date:** 2026-08-19
- **Package:** `PVA-013 History and Provenance`
- **Top-level fixture cardinality:** exactly 14
- **Capture-scenario cardinality:** exactly 2, separate from and disjoint with fixtures
- **Accepted event corpus:** exactly Product `E01`–`E17`
- **Prototype clock:** `2026-08-19T10:00:00+05:30`
- **Timezone:** `Asia/Kolkata`
- **State boundary:** deterministic fictional data in browser memory only

This is the fixture-exact implementation and independent-QA authority for v18. It is subordinate to [the v18 Council decision](COUNCIL-v18.md). It changes no frozen v1–v17 artifact and proves no backend, VoiceNotes, reconciliation, persistence, provider, security, deployment, accessibility-conformance, or production behavior.

## 1. Fixed fictional records and current state

### 1.1 Current Journal Day and Source Item

| Fact | Exact value |
| --- | --- |
| Current Journal Day | `17 Aug 2026` |
| Source Item | `Monsoon walk note` |
| Source type | `Voice Journal` |
| Immutable Original Timestamp | `17 Aug 2026, 11:42 pm IST` |
| Initial represented Journal Date | `18 Aug 2026` |
| Current represented Journal Date | `17 Aug 2026` |
| Upstream lineage | `Revision 1 → Revision 2 → Revision 3` |
| Correction branch | `Correction 1` · `Based on Revision 2` |
| Displayed source record | `Correction 1` |
| Current upstream record | `Revision 3` |
| Current upstream state | `Deleted upstream` + `Retained locally` |
| Conflict | `Correction 1` versus `Revision 3` · `Unresolved` |
| Reconciliation boundary | `Synthetic UI fixture · external evidence required` |

Only Day and Source Item contexts show this exact region before filters:

> **Current source context**
> **Fictional Correction 1 — A rain-washed path curved past paper lanterns; the synthetic narrator paused beside three quiet puddles before heading home.**

The region is read-only, measures approximately 60–72 characters on wide screens, and remains visible during loading, failure, interruption, empty, filtering, and inspection. Global, field, artwork, and hidden-day contexts never duplicate the prose. Event cards, provenance, URLs, storage, requests, evidence metadata, console output, and live regions never contain it.

### 1.2 Generated-field state

| Record | Exact current facts | Binding |
| --- | --- | --- |
| `Summary version 1` | `Historical` | `[Revision 1]` |
| `Summary version 2` | `Current` + `Protected Field` + `Stale`; displayed Summary | `[Revision 2, Correction 1]` |

`E07` records the historical selection fact. V18 provides no Use, Keep, Edit, Protect, Resume, or replacement action.

### 1.3 Artwork state

| Record | Exact current facts | Binding |
| --- | --- | --- |
| `Artwork version 1` | `Historical` + `AI-generated artwork` | `[Revision 1]` |
| `Artwork version 2` | `Historical` + `Stale` + `AI-generated artwork` after `E10` | `[Revision 2, Correction 1]` |

`E09` records that Artwork version 2 became **Active Artwork** before redating. `E10` moved its bound Source Item away, so the current state is Historical and Stale. V18 provides no activation, generation, regeneration, retry, Trash, delete, or suppression action.

### 1.4 Separate hidden historical day

| Fact | Exact value |
| --- | --- |
| Historical Journal Day | `11 Aug 2026` |
| `h1` | `History for 11 August 2026` |
| Former Source Item | `Station light note` |
| Source type | `Uploaded Journal` |
| Current synthetic location | `10 Aug 2026` |
| Historical artwork | `Station light illustration` |
| Historical artwork binding | `[Station light note · captured source]` |
| Live Source Items on 11 Aug | `0` |
| Exact banner | `Historical day — not shown in Calendar or Almanac` |
| Exact banner body | `This Journal Day has no live Source Items in the represented state. Retained Source and Derived history remains available here. Viewing it does not restore the day.` |

The hidden day is caused only by `E17` redating Station light note. It is unrelated to upstream deletion, contains no current cover or live Source card, exposes no restore/delete action, and does not close `LID-SCP-004`.

## 2. Exact 17-event corpus

Event keys are fixture labels and need not appear visibly. User-visible cards use the exact heading, actor, state, timestamp, Journal Date-at-event, consequence, and binding below. Every timestamp is visibly marked **Synthetic time**.

| Key | Synthetic time | Lane | Exact heading | Exact actor class | Exact state and retained fact |
| --- | --- | --- | --- | --- | --- |
| `E01` | `18 Aug 2026, 12:02 am IST` | Source | **Source Item captured** | **VoiceNotes upstream · simulated** | `Monsoon walk note` / `Revision 1`; Journal Date at event `18 Aug 2026`; Original Timestamp retained. |
| `E02` | `18 Aug 2026, 12:15 am IST` | Derived | **Generated field version created** | **Text generation lane · simulated** | `Summary version 1`; Historical; exact binding `[Revision 1]`; source unchanged. |
| `E03` | `18 Aug 2026, 12:18 am IST` | Derived | **Generated Artwork version created** | **Artwork generation lane · simulated** | `Artwork version 1`; Historical; AI-generated artwork; exact binding `[Revision 1]`; no real photo claim. |
| `E04` | `18 Aug 2026, 8:15 am IST` | Source | **Source Revision received** | **VoiceNotes upstream · simulated** | `Revision 2` follows `Revision 1`; Revised upstream; Journal Date at event `18 Aug 2026`; prior revision retained. |
| `E05` | `18 Aug 2026, 8:24 am IST` | Source | **Correction created** | **Archive owner · simulated** | `Correction 1`; Based on `Revision 2`; displayed Correction; not upstream text; Journal Date at event `18 Aug 2026`. |
| `E06` | `18 Aug 2026, 8:30 am IST` | Derived | **Generated field version created** | **Text generation lane · simulated** | `Summary version 2`; exact ordered binding `[Revision 2, Correction 1]`; source unchanged. |
| `E07` | `18 Aug 2026, 8:31 am IST` | Derived | **Protected field version selected** | **Archive owner · simulated** | `Summary version 2`; Current + Protected Field + Stale; Summary version 1 retained Historical; Journal Date at event `18 Aug 2026`. |
| `E08` | `18 Aug 2026, 8:35 am IST` | Derived | **Generated Artwork version created** | **Artwork generation lane · simulated** | `Artwork version 2`; AI-generated artwork; exact ordered binding `[Revision 2, Correction 1]`; no provider execution claim. |
| `E09` | `18 Aug 2026, 8:36 am IST` | Derived | **Artwork version selected** | **Archive owner · simulated** | Artwork version 2 became Active Artwork at this event; current status after `E10` is Historical + Stale; Artwork version 1 retained. |
| `E10` | `19 Aug 2026, 10:00 am IST` | Source | **Journal Date changed** | **Archive owner · simulated** | `18 Aug 2026 → 17 Aug 2026`; Original Timestamp unchanged; invalidated Artwork version 2 retained Historical + Stale. |
| `E11` | `19 Aug 2026, 9:12 am IST` | Source | **Source Revision received** | **VoiceNotes upstream · simulated** | `Revision 3` follows `Revision 2`; Revised upstream; Journal Date at event `18 Aug 2026`; prior revisions and Correction retained. |
| `E12` | `19 Aug 2026, 9:13 am IST` | Source | **Source conflict detected** | **Life in Days rule · simulated** | Correction 1 remains displayed; Revision 3 retained; unresolved Conflict; no auto-merge; Journal Date at event `18 Aug 2026`. |
| `E13` | `19 Aug 2026, 9:20 am IST` | Source | **Upstream status changed** | **VoiceNotes upstream · simulated** | Untagged upstream; local Voice Journal and lineage retained; Journal Date at event `18 Aug 2026`; external evidence required. |
| `E14` | `19 Aug 2026, 9:28 am IST` | Source | **Upstream status changed** | **VoiceNotes upstream · simulated** | Deleted upstream + Retained locally; no local deletion; Journal Date at event `18 Aug 2026`; external evidence required. |
| `E15` | `11 Aug 2026, 7:10 pm IST` | Source | **Source Item captured** | **Archive owner · simulated** | `Station light note`; Journal Date at event `11 Aug 2026`; historical Source record retained. |
| `E16` | `11 Aug 2026, 7:25 pm IST` | Derived | **Generated Artwork version created** | **Artwork generation lane · simulated** | `Station light illustration`; Historical + AI-generated artwork; exact binding `[Station light note · captured source]`. |
| `E17` | `12 Aug 2026, 7:30 am IST` | Source | **Journal Date changed** | **Archive owner · simulated** | `11 Aug 2026 → 10 Aug 2026`; 11 Aug becomes hidden; source and artwork history retained. |

There is no eighteenth event. Visual Brief creation may be a safe provenance fact but not an event. Correction made historical, Correction removal, conflict resolution, artwork became historical, Trash, restore, deletion, suppression, provider, and reconciliation events are absent from the accepted corpus.

## 3. Ordering, scopes, and exact counts

### 3.1 Canonical ordering truth

- Canonical total order: `E10,E14,E13,E12,E11,E09,E08,E07,E06,E05,E04,E03,E02,E01,E17,E16,E15`.
- Source order: `E10,E14,E13,E12,E11,E05,E04,E01,E17,E15`.
- Derived order: `E09,E08,E07,E06,E03,E02,E16`.

The total order is snapshot/QA truth only. Approach C renders Source history first and Derived history second, never an interleaved third list.

### 3.2 Scope cardinality

| Scope | Source lane | Derived lane | Total |
| --- | --- | --- | ---: |
| Global | `E10,E14,E13,E12,E11,E05,E04,E01,E17,E15` | `E09,E08,E07,E06,E03,E02,E16` | 17 |
| Journal Day `17 Aug 2026` | `E10,E14,E13,E12,E11,E05,E04,E01` | `E09,E08,E07,E06,E03,E02` | 14 |
| Source Item `Monsoon walk note` | `E10,E14,E13,E12,E11,E05,E04,E01` | `E09,E08,E07,E06,E03,E02` | 14 |
| Generated Summary | none | `E07,E06,E02` | 3 |
| Artwork version 2 lineage | none | `E09,E08,E03` | 3 |
| Historical day `11 Aug 2026` | `E17,E15` | `E16` | 3 |

The global summary is exactly **17 represented events · All lanes · All record types · All event types · All attention**. Day/item pre-redating cards preserve **Journal Date at this event · 18 Aug 2026**; they are not relabelled as if created on the current 17 Aug day.

## 4. Event sequence and record lineage

Complete provenance contains two separately headed groups.

### Event sequence

**Event sequence** uses the exact relationship labels **Later represented event** and **Earlier represented event** within the same lane. “Later” points one position toward the start of the newest-first lane; “Earlier” points one position toward the end. The complete mappings are:

| Lane | Newest-to-oldest mapping |
| --- | --- |
| Source | `E10 → E14 → E13 → E12 → E11 → E05 → E04 → E01 → E17 → E15` |
| Derived | `E09 → E08 → E07 → E06 → E03 → E02 → E16` |

Relation links focus the target event `h3`, preserve disclosures/filter/domain state, and never select or activate a record. If filters hide the adjacent event, provenance shows its safe label as a fact rather than clearing filters. Lane endpoints visibly say **No earlier Source event**, **No later Source event**, **No earlier Derived event**, or **No later Derived event** as applicable.

### Record lineage

| Record type | Exact lineage |
| --- | --- |
| Source Revision | `Revision 1 → Revision 2 → Revision 3` |
| Correction | `Correction 1 ← Based on Revision 2`; `Conflict with Revision 3`; Correction is not an upstream node |
| Generated Summary | `Summary version 1 → Summary version 2` |
| Generated Artwork | `Artwork version 1 → Artwork version 2` |

Each selected record shows prior/next version facts. Endpoints say **No earlier revision/version** or **No later revision/version** rather than hiding the relation. Record-lineage navigation focuses or reveals facts only; it never changes Current, Displayed, Active, Historical, Protected, Stale, Conflict, Journal Date, upstream, or visibility state.

## 5. Safe provenance vocabulary

Derived provenance may show:

- **Text Provider A — synthetic fixture**;
- **Artwork Provider A — synthetic fixture**;
- **Fixture configuration A**;
- **Synthetic cost · fixture only**;
- trigger class, safe outcome class, exact ordered binding, and fictional version/brief label.

It may not say qualified, connected, selected for production, healthy, verified, persisted, encrypted, authenticated, reconciled, backed up, or deployed. It contains no prompt, source prose, photo/caption/description, raw request/response, token, credential, request ID, internal ID, model name, account, signed URL, or production identifier.

Revised, conflict, untagged, deleted, and status-unavailable lifecycle presentations each visibly include **Synthetic UI fixture · external evidence required**. Every upstream-status retry leaves `providerRequests = 0`.

## 6. Exact filter model

Filters change only the visible event subset. They change no domain fact and remain out of URL/title/history/storage/requests/logs.

| Control | Exact values | Event mapping |
| --- | --- | --- |
| **History lane** | All lanes; Source history; Derived history | Source or Derived lane from Section 2 |
| **Record type** | All record types; Journal Days; Source records; Generated fields; Artwork | Journal Days `E10,E17`; Source records `E01,E04,E05,E11,E12,E13,E14,E15`; Generated fields `E02,E06,E07`; Artwork `E03,E08,E09,E16` |
| **Event type** | All event types; Source Items; Source Revisions; Corrections and conflicts; Journal Date changes; Upstream lifecycle; Generated fields; Artwork | Source Items `E01,E15`; Source Revisions `E04,E11`; Corrections/conflicts `E05,E12`; Journal Date changes `E10,E17`; Upstream lifecycle `E13,E14`; Generated fields `E02,E06,E07`; Artwork `E03,E08,E09,E16` |
| **Attention** | All attention; Needs attention | Needs attention `E14,E13,E12,E07,E09` |
| **Journal Date** | Optional native exact date; Global only | Match `Journal Date at this event`; a Journal Date change also matches its from/to endpoint |

**Apply filters** commits the live form, closes the compact disclosure, focuses the results heading, and announces only the represented count. **Clear filters** restores defaults, focuses results, and announces only the new count. There is no text search, state selector, scope selector, automatic apply, filter modal, filter Cancel, or filter-specific Escape behavior.

At `>=1024 px`, filters occupy a non-scrolling 240–272 px rail. Below `1024 px`, they use inline native `<details>` with summary **Filter history** or **Filter history · _n_ active**. The active summary and Clear remain visible when the disclosure is closed.

The filtered-empty branch uses heading **No events match these filters**, body **Try clearing one filter. History was not changed.**, and **Clear filters**. It is not a top-level fixture.

## 7. Exact 14 top-level fixtures

`window.__LID_QA__.manifest().fixtures` and the visible prototype-state console contain exactly these keys in this order:

| # | Key | Initial scope/facts | Exact initial focus |
| ---: | --- | --- | --- |
| 1 | `global-ready` | Complete Global scope; Source 10 + Derived 7; hidden day reachable; all filters default. | `History & provenance` h1 |
| 2 | `day-ready` | Current 17 Aug day; Source 8 + Derived 6; Current source context visible; earlier Journal Date facts retained. | `History for 17 August 2026` h1 |
| 3 | `item-ready` | Monsoon walk note; Source 8 + Derived 6; Current source context visible; revision/Correction/conflict and both lineage groups. | `History for Monsoon walk note` h1 |
| 4 | `field-ready` | Summary history; Derived `E07,E06,E02`; V2 Current + Protected Field + Stale; V1 Historical. | `Summary history` h1 |
| 5 | `artwork-ready` | Artwork history; Derived `E09,E08,E03`; V2 Historical + Stale after E10; V1 Historical. | `Artwork history` h1 |
| 6 | `hidden-day` | 11 Aug hidden day; Source `E17,E15`; Derived `E16`; exact Almanac banner; no mutation control. | `History for 11 August 2026` h1 |
| 7 | `upstream-revised` | Item scope; R1 and R2 retained; Revised upstream; no Correction conflict inferred. | Item h1 |
| 8 | `upstream-conflict` | Item scope; R1→R2→R3; Correction 1 based on R2 and displayed; unresolved conflict; no merge. | Item h1 |
| 9 | `upstream-untagged` | Item scope; Untagged upstream; local item, revisions, Correction, Original Timestamp, and source context retained. | Item h1 |
| 10 | `upstream-deleted` | Item scope; Deleted upstream + Retained locally; Monsoon walk note remains live on 17 Aug; never combined with hidden day. | Item h1 |
| 11 | `empty` | Selected scope has no represented events; heading **No history matches this view**; nothing-deleted disclosure and origin Back remain. | Empty-state heading |
| 12 | `loading` | Initial History load; heading **Loading history**; affected lane region only is busy; source context remains in day/item launch. | Scope h1 |
| 13 | `failure` | Known-zero History failure; heading **History could not be loaded**; body **The current archive view is unchanged. Try again.**; **Retry loading history**. | Failure heading |
| 14 | `interrupted` | Last complete list remains; heading **Connection interrupted**; body **The history already shown remains readable and may be out of date. Earlier events were not added.** | Interruption heading |

Reset returns to `global-ready`. Selecting any fixture creates a fresh deterministic state; no prior filter, disclosure, pagination, scope, focus, or result leaks across fixtures.

`window.__LID_QA__.manifest().captureScenarios` contains exactly `compact-filtered-open`, then `pagination-both-success`. These are capture-only transition recipes from fresh complete `global-ready`; they are not fixtures, do not appear as prototype-state-console fixture controls, and do not change the fourteen-key fixture order above.

## 8. Required transition and QA branches

These are reducer/QA branches beneath the 14 fixtures, never manifest fixture keys.

### 8.1 Upstream status unavailable

From an upstream lifecycle fixture, the represented incomplete/unknown outcome shows:

- heading **Upstream status unavailable**;
- body **This prototype does not have a complete upstream result. No upstream-status event was added, and the local Voice Journal remains unchanged.**;
- boundary **Synthetic UI fixture · external evidence required**; and
- action **Retry represented status check**.

No Untagged/Deleted event is added, no list absence is interpreted, the domain fingerprint stays identical, and provider requests remain zero.

### 8.2 Per-lane pagination lifecycle

The branch begins from complete `global-ready`, then enters an explicit partial-page representation without changing the canonical corpus.

| Lane | Initial visible page | One exact addition | Complete order |
| --- | --- | --- | --- |
| Source | `E10,E14,E13,E12,E11,E05,E04` | `E01,E17,E15` | `E10,E14,E13,E12,E11,E05,E04,E01,E17,E15` |
| Derived | `E09,E08,E07,E06` | `E03,E02,E16` | `E09,E08,E07,E06,E03,E02,E16` |

Each lane independently exercises ready → pending → known failure → retry → success → duplicate delivery → beginning-of-history. Interruption is also reachable from pending. Requirements:

- `aria-busy` scopes only to the affected lane;
- existing events, other-lane state, filters, expanded disclosures, domain fingerprint, focus, and screen offset remain;
- the loading control alone is disabled and says **Loading earlier Source events…** or Derived equivalent;
- success adds exactly three once and returns focus to the logical same control;
- live announcement is exactly **3 earlier Source events added** or **3 earlier Derived events added**;
- duplicate delivery adds zero;
- completion replaces the control with **Beginning of represented Source history** or Derived equivalent; and
- no intent/effect/provider request is created.

### 8.3 Empty and metadata stress

- Filtered empty/clear follows Section 6.
- Scope-specific empty headings may be exercised for day, item, field, artwork, and hidden-day scopes, but `empty` remains the single top-level fixture.
- Long-safe-metadata stress adds one obviously fictional unbroken token, long actor/helper text, and long translated-like labels to wrapping only. It changes no event identity, count, domain fact, URL, storage, or evidence metadata.

## 9. Read-only snapshot and invariant contract

The v18 snapshot exposes detached values only and includes:

- `version: 18`, feature name, current top-level fixture, transition branch, scope, theme, prototype clock, and timezone;
- exact `loadedVersions: [17,18]` through the shared manifest;
- complete corpus keys, visible Source/Derived keys, canonical total order, lane counts, and total count;
- applied filters, open disclosure keys, selected relation target, and per-lane pagination state;
- current Source/Correction/revision, Summary, artwork, hidden-day, and upstream facts;
- a deterministic pre-open/current domain fingerprint;
- `mutationIntents: 0`, `mutationEffects: 0`, and `providerRequests: 0` in every v18 state; and
- origin, expected Back label, and stable focus key without private values in URL/history/storage.

At minimum invariants assert:

1. exact `E01`–`E17` membership with no additional event;
2. exact canonical, Source, Derived, and scope orders/counts;
3. exactly 14 top-level fixture keys;
4. exactly two ordered `captureScenarios`, disjoint with fixtures and unreachable through URL/history/storage/viewport/theme state;
5. Source/Derived records and lanes remain distinct in data, headings, DOM, and accessible names;
6. Revision, Correction base/conflict, Summary, and artwork lineage match Sections 1 and 4;
7. E10 time/date/original-timestamp truth matches frozen v17;
8. Summary V2 is Current + Protected Field + Stale; Artwork V2 is Historical + Stale after E10;
9. Deleted upstream leaves Monsoon walk note live and is never the hidden-day cause;
10. hidden day is 11 Aug, current location 10 Aug, with exact Almanac banner;
11. viewing, filters, provenance, relations, pagination, retry, Back, and Escape leave the domain fingerprint and 0/0/0 counters unchanged;
12. status-unavailable and `LID-VN-005` boundary create no upstream event or provider request;
13. Current source context prose exists only in Day/Item task content and never in event/provenance/live-region text;
14. one active feature h1, task-before-console order, focus contract, and no horizontal page overflow;
15. generic title/path, null private history state, no fixture/private value in URL or live regions, and zero browser storage/registration; and
16. runtime features/versions are exactly v17 then v18, with v18 as latest-compatible QA target and frozen v17 behavior unchanged.

## 10. Exact 16-frame evidence roster

Every PNG/JSON pair is captured after final candidate, authority, and capture-tool bytes with the additive `prototypes/calendar-ui/capture-phase2-evidence-v18.mjs` driver. The frozen v17 helper remains unchanged and is used only as a hash-guarded source dependency. Basenames are exact.

| # | Basename | Fixture/branch | Viewport | Theme/media and required visible proof |
| ---: | --- | --- | ---: | --- |
| 1 | `v18-01-global-ready-wide-light` | `global-ready` | 1440×900 | Light; complete two-lane scope and filter rail |
| 2 | `v18-02-day-ready-wide-dark` | `day-ready` | 1440×900 | Dark; source context, Source/Derived counts, event-time Journal Date |
| 3 | `v18-03-item-conflict-medium-light` | `item-ready` | 960×900 | Light; Correction/R3 conflict, expanded provenance, both lineage groups |
| 4 | `v18-04-field-ready-medium-dark` | `field-ready` | 960×900 | Dark; Summary V2 Current + Protected Field + Stale |
| 5 | `v18-05-artwork-ready-compact-dark` | `artwork-ready` | 390×844 | Dark; V2 Historical + Stale, persistent AI label |
| 6 | `v18-06-upstream-revised-medium-light` | `upstream-revised` | 960×900 | Light; R1/R2 retention and external-evidence boundary |
| 7 | `v18-07-upstream-untagged-compact-light` | `upstream-untagged` | 390×844 | Light; local item retained |
| 8 | `v18-08-upstream-deleted-compact-dark` | `upstream-deleted` | 390×844 | Dark; local item live, no hidden-day claim |
| 9 | `v18-09-hidden-day-compact-light` | `hidden-day` | 390×844 | Light; 11 Aug exact Almanac banner and separate lanes |
| 10 | `v18-10-filter-open-compact-dark` | `global-ready` + `compact-filtered-open` | 390×844 | Dark; inline details open, active summary/Clear visible, no modal |
| 11 | `v18-11-loading-landscape-light` | `loading` | 568×320 | Light; reduced motion; all primary actions reachable |
| 12 | `v18-12-interrupted-320-forced` | `interrupted` | 320×900 | Dark preference; reduced motion; forced colours active; retained list/copy |
| 13 | `v18-13-failure-medium-light` | `failure` | 960×900 | Light; contextual retry and unchanged archive disclosure |
| 14 | `v18-14-load-earlier-wide-dark` | `global-ready` + `pagination-both-success` | 1440×900 | Dark; per-lane exact +3, focus/anchor and beginning state |
| 15 | `v18-15-empty-320-light` | `empty` | 320×900 | Light; normal colours/motion; canonical empty copy and Back |
| 16 | `v18-16-archive-launcher-320-forced` | inactive inherited archive | 320×900 | Light preference; reduced motion; forced colours active; latest-v18 launcher geometry/hit/focus/non-overlap |

Each sidecar must record tool `capture-phase2-evidence-v18.mjs`, target version `18`, loaded versions `[17,18]`, v18 QA target, exact fixture, nullable allowlisted scenario, ordered safe scenario transcript, final branch/snapshot/invariants, requested/observed viewport and media, generic URL/title/null history, no horizontal overflow, zero local/session/IndexedDB/cache/service-worker/OPFS state, localhost/data-only requests, zero console events, and zero exceptions. Archive evidence additionally records an inactive empty host, exact visible Back use, launcher focus, full viewport containment, minimum 44×44 geometry, center/corner hit tests, and zero inherited-control intersections.

Independent QA inspects every PNG at original size and also exercises status unavailable, both full pagination lifecycles, filtered-empty/clear, long metadata, all five entry/Back pairs, hidden-day return restoration, event and record-lineage focus, light/dark/reduced/forced states, keyboard/focus/targets/contrast, URL/storage/network/console privacy, direct v17 entry, and inherited Atomic Redating branches.

## 11. Candidate manifest and temporal boundary

The held `CANDIDATE-MANIFEST-v18.md` records every pre-QA implementation, authority, tracker-at-hold, handoff-at-hold, and evidence byte with exact SHA-256 and one deterministic aggregate. It includes this fixture authority and `COUNCIL-v18.md`.

It explicitly excludes:

- `docs/prototypes/v18/DESIGN-QA-v18-round1.md`;
- every post-verdict handoff update;
- every post-verdict tracker/freeze/publication record; and
- any file that did not exist before independent QA began.

The independent QA report is created only after the read-only verdict in a documentation-only successor. A candidate, authority, fixture, evidence, or manifest byte change after QA begins invalidates that run and requires a fresh v18 agent run from zero.

## 12. Frozen predecessor and proof boundary

V18 may add `index-v18.html`, `app-v18.js`, `styles-v18.css`, `README-v18.md`, `check-v18.mjs`, `capture-phase2-evidence-v18.mjs`, approved v18 docs/evidence, and living-tracker updates only. It does not edit a v17 file or add/require a control in frozen v17. Its five entry contexts are global, day, item, field, and artwork. Inherited v17 Atomic Redating is exercised separately through its existing controls and routes.

The only permitted fixture-level conclusion is that the exact v18 candidate deterministically represents the approved read-only History and Provenance states in an open browser page. It does not establish durable history, VoiceNotes authority or reconciliation, replay safety, complete enumeration, persistence, backend ordering, provider execution, transactionality, authentication, encryption, deployment, formal accessibility conformance, production privacy, or production readiness.

## 13. Append-only pre-hold capture-scenario authority

The v17 helper is frozen at SHA-256 `860f01a5ea135d53650552c508a91f2c51ccf306b183e09486a3691e3afa3c37`. It cannot dispatch the transition branches required by frames 10 and 14, so it must not be edited, wrapped through source transformation, or used to imply those states were captured. The additive v18 driver carries forward its localhost, fresh-profile, query/hash, browser-state, network, console, exception, viewport, media, archive, invariant, PNG, and metadata protections and adds only the two allowlisted recipes below.

### 13.1 `compact-filtered-open`

Preconditions are active view, fixture `global-ready`, all five filters at defaults, complete Source 10 + Derived 7, and a viewport below 1024 px. The exact ordered recipe is:

1. activate the visible native **Filter history** summary and observe the inline `<details>` open;
2. set the visible **History lane** control to **Source history** through its control event;
3. leave **Record type**, **Event type**, and **Journal Date** at their defaults;
4. set the visible **Attention** control to **Needs attention** through its control event;
5. activate the visible **Apply filters** control and observe the disclosure close, the results heading receive focus, and the live region announce only **3 represented events**; and
6. reactivate **Filter history · 2 active** and observe the inline disclosure open with focus remaining on its summary.

The final snapshot must expose fixture `global-ready`, transition branch and capture scenario `compact-filtered-open`, applied filters `Source history / All record types / All event types / Needs attention / no Journal Date`, Source keys `E14,E13,E12`, no Derived key, represented count `3`, exact summary **3 represented events · Source history · All record types · All event types · Needs attention**, open filter disclosure, visible active summary and **Clear filters**, no modal/dialog/focus trap, unchanged corpus/domain fingerprint, and `mutationIntents=0`, `mutationEffects=0`, `providerRequests=0`.

### 13.2 `pagination-both-success`

Preconditions are active view, fresh complete fixture `global-ready`, default filters, no open event disclosure, and no prior pagination state. The exact ordered recipe is:

1. invoke the allowlisted in-memory QA transition that enters the partial-page representation, observing Source `E10,E14,E13,E12,E11,E05,E04` and Derived `E09,E08,E07,E06` without changing the complete corpus;
2. activate the visible **Load earlier Source events** control, observe only Source pending/busy, then invoke the allowlisted synthetic Source-success transition;
3. observe exactly `E01,E17,E15` added once, exact announcement **3 earlier Source events added**, preserved screen anchor, logical Source-load focus restoration, and **Beginning of represented Source history**;
4. activate the visible **Load earlier Derived events** control, observe only Derived pending/busy, then invoke the allowlisted synthetic Derived-success transition; and
5. observe exactly `E03,E02,E16` added once, exact announcement **3 earlier Derived events added**, preserved screen anchor, logical Derived-load focus restoration, and **Beginning of represented Derived history**.

The final snapshot must expose fixture `global-ready`, transition branch and capture scenario `pagination-both-success`, complete Source order `E10,E14,E13,E12,E11,E05,E04,E01,E17,E15`, complete Derived order `E09,E08,E07,E06,E03,E02,E16`, added counts `3` and `3`, both lane states `beginning`, no duplicate key, unchanged default filters/corpus/domain fingerprint, and `mutationIntents=0`, `mutationEffects=0`, `providerRequests=0`. Duplicate, failure, retry, and interruption remain mandatory live-QA branches, not extra steps or fixtures in this evidence recipe.

### 13.3 Transcript, privacy, and fail-closed rules

For either scenario, `capture.scenarioTranscript` contains only an ordered step number, allowlisted step ID, interaction method (`visible-control` or `qa-transition`), stable safe selector/action token, center-hit/visible/enabled result where a control is used, and bounded before/after observations needed to prove focus, disclosure, busy/end state, scroll anchor, event keys, and counts. It must not contain Current source context prose, raw HTML, arbitrary evaluated script, private content, credentials, payloads, or production identifiers.

The v18 driver must fail before writing PNG or JSON when the route is not exact query/hash-free `index-v18.html`; fixture/view/viewport and scenario are incompatible; the manifest arrays are absent, reordered, overlapping, or have the wrong cardinality; an unknown scenario or arbitrary scenario payload is supplied; a required control is absent, hidden, disabled, or fails its center hit test; an expected intermediate/final observation, focus/anchor check, snapshot, or invariant differs; the domain fingerprint or 0/0/0 counters change; storage/history/private-state checks fail; a request escapes localhost/data; or console/exception output exists. Scenario selection is main-world memory only and never derives from URL, history, local/session storage, IndexedDB, cache, service worker, OPFS, viewport, theme, selector side effects, or process/source interception.

## 14. Append-only pre-hold source-context and loading fixture authority

This section is the controlling narrow amendment for Current source context and the exact top-level `loading` fixture. It preserves Sections 1–13 as decision history and supersedes only their single-prose implication and underspecified initial busy-region wording.

### 14.1 Safe exported mapping

The detached snapshot exposes `sourceContextVariant` and never source prose. Its exact mapping is:

| Current owner/scope | Exported value | Current source context |
| --- | --- | --- |
| Owner `upstream-revised`, while its descendant remains Day/Item | `revision-2` | One region before filters; exact Revision 2 prose below. |
| Any other Day/Item owner and its in-scope descendants | `correction-1` | One region before filters; exact Correction 1 prose below. |
| Global, field, artwork, hidden, archive, or any other non-Day/Item scope | `none` | Region absent. |

Exact `revision-2` visible prose:

> **Fictional Revision 2 — Rain softened the path beneath the paper lanterns; the synthetic narrator counted three quiet puddles before walking home.**

Exact retained `correction-1` visible prose:

> **Fictional Correction 1 — A rain-washed path curved past paper lanterns; the synthetic narrator paused beside three quiet puddles before heading home.**

The owner persists through filter, disclosure, relation-focus, status-unavailable, loading, failure, interruption, empty, retry, and pagination branches until a fixture/scope reset. Selection is by owner and scope only; no string inspection, focused event, filter, branch, viewport, URL, history, or storage value may choose it.

### 14.2 Exact `upstream-revised` owner fixture

| Fact | Exact authority |
| --- | --- |
| Scope / origin / Back | Source Item / item / **Back to Source Item** |
| Source order and count | `E04,E01` / 2 |
| Derived order and count | none / 0 |
| Revision lineage | `Revision 1 → Revision 2` |
| Displayed record | `Revision 2` |
| Current upstream | `Revision 2` |
| Revision 2 states | `Displayed`, `Current upstream`, `Revised upstream` |
| Revision 1 state | `Historical` |
| Correction / Revision 3 / conflict | none / none / none |
| Upstream boundary | **Synthetic UI fixture · external evidence required** |
| Source-context export | `revision-2` |

No Correction, R3, Conflict, Untagged, Deleted, or Derived content appears anywhere in this fixture's task subtree. Its two scoped events remain members of the unchanged `E01`–`E17` corpus; no new event or top-level fixture exists.

### 14.3 Exact top-level `loading` fixture

The canonical top-level `loading` fixture is Global, origin launcher, Back **Back to archive**, transition branch `loading`, `sourceContextVariant=none`, scope Source keys empty, scope Derived keys empty, and complete corpus keys still `E01`–`E17` in the detached authority. It presents no final represented count.

Its exact rendered task contract is:

1. `h1` **History & provenance** retains entry focus.
2. A rendered lane region is programmatically named by `h2` **Source history**.
3. That Source lane region, not a generic page/state panel, has `aria-busy="true"`.
4. Inside it, a static status exposes heading **Loading history** and body **Preparing separate Source and Derived event lists from synthetic browser-memory fixtures.**
5. It has no `<ol>`, event card, event-like skeleton, actor, time, record, provenance, source prose, or final count.
6. The Derived lane region is absent, not empty and not busy.
7. Page/main/filter/scope nodes do not receive `aria-busy`.

This exact fresh-load state does not replace the lane-local pagination rule: an earlier-page pending transition marks only its existing affected lane busy and preserves the other rendered lane. A Day/Item initial-load descendant keeps exactly one mapped Current source context before filters and uses the same named-lane busy semantics.

### 14.4 Privacy, evidence, and invariants

The exact prose is task content only. Event cards, provenance, live regions, snapshots, snapshot summaries, capture transcripts, JSON sidecars, URLs, `history.state`, local/session storage, IndexedDB, caches, service workers, OPFS, requests, console output, and exceptions contain neither prose string. Structured exports and evidence may contain only `sourceContextVariant`; evidence PNG pixels may naturally show the visible region.

Invariants additionally assert the exact three-value enum and owner mapping; one context section for Day/Item and zero otherwise; the exact revised-fixture lineage/state/absence/counts; the exact top-level loading h1/lane/status/absence/busy tree; no prose leakage; unchanged corpus and fixture cardinality; unchanged domain fingerprint; and `mutationIntents=0`, `mutationEffects=0`, `providerRequests=0`.

## 15. Append-only final pre-hold fixture and capture authority

This section is the controlling narrow amendment for fresh disclosure state, asynchronous pagination anchoring, and strict OPFS inspection. It preserves Sections 1–14 as decision history and changes no fixture/scenario/event/closure cardinality or CLI surface.

### 15.1 Exact `openDisclosureKeys` defaults and transitions

The ordered fourteen fixture defaults are:

| Fixture | Fresh `openDisclosureKeys` |
| --- | --- |
| `global-ready` | `[]` |
| `day-ready` | `[]` |
| `item-ready` | `['E12']` |
| `field-ready` | `[]` |
| `artwork-ready` | `[]` |
| `hidden-day` | `[]` |
| `upstream-revised` | `[]` |
| `upstream-conflict` | `[]` |
| `upstream-untagged` | `[]` |
| `upstream-deleted` | `[]` |
| `empty` | `[]` |
| `loading` | `[]` |
| `failure` | `[]` |
| `interrupted` | `[]` |

Fresh `item-ready` renders `<details data-lid-v18-event-details="E12" open>` without a disclosure transition. Within it the provenance facts are followed by **Event sequence**, then **Record lineage**. Entry state is `stableFocusKey='#lid-v18-title'`, DOM focus on `h1` **History for Monsoon walk note**, `scrollX=0`, `scrollY=0`, and an empty live region.

User close removes `E12`; user reopen adds it; either result survives rerender, filter hide/show, and hidden-day entry/Back restoration. A temporarily unrendered key remains in the in-memory array. `reset()` or `setFixture()` creates a fresh fixture state and restores only the table default.

Frame 3 runs `--fixture item-ready --selector '[data-lid-v18-event-details="E12"]'` with no `--scenario`. The driver first records the exact entry state, then the selector only scrolls the already-open details into the capture viewport. It neither clicks nor dispatches, never changes `openDisclosureKeys`, leaves h1 focus and the live region unchanged, and records `capture.scenario=null`. The sidecar assertions prove the pre-selector h1/zero-scroll/empty-announcement state, `openDisclosureKeys=['E12']`, exactly one open event disclosure, its key `E12`, its native `open` attribute, and Event-sequence-before-Record-lineage DOM order.

### 15.2 App-owned pagination anchor state machine

The app, not the driver, owns one transient anchor record per lane and pagination generation. A real click or keyboard activation of the visible, enabled **Load earlier Source events** or **Load earlier Derived events** control captures this safe record before pending renders:

`{lane, generation, targetSelector, baselineViewportTop, consumed:false}`

`targetSelector` is exactly `#lid-v18-load-source` for Source or `#lid-v18-load-derived` for Derived. The stable ID represents the lane's logical pagination position across ready, pending, and terminal retry/beginning output. QA delivery and driver observation cannot create or overwrite the record.

Pending preserves the record. After a matching success, failure, interruption, or duplicate terminal state renders, the app measures the stable target, restores `abs(finalViewportTop-baselineViewportTop) <= 1` CSS pixel, focuses that target, then marks/removes the record as consumed exactly once. Lane and generation must both match. A stale, cross-lane, missing, or consumed record causes no scroll or focus restoration. Visible prototype outcome controls and `window.__LID_QA__.dispatch()` terminal equivalents pass through the same reducer, render, post-render restoration, and consumption path.

The driver may scroll a ready Load control into view before the genuine activation and record bounded safe observations. From activation through terminal observation it is passive: no `scrollTo`, `scrollBy`, `scrollIntoView`, focus call, CSS/DOM/layout mutation, or calculated compensation. Its transcript records the app-produced baseline/final tops, delta, lane, generation, target, focus, and consumed result without source prose or raw DOM.

After fresh complete `global-ready` fixture setup, which is sidecar metadata and not a scenario action, frame 14's scenario transcript has exactly these five transitions:

1. QA seed the approved partial representation;
2. actual visible activation of **Load earlier Source events**;
3. QA deliver Source success and observe app restoration/consumption;
4. actual visible activation of **Load earlier Derived events**; and
5. QA deliver Derived success and observe app restoration/consumption.

The final Source and Derived orders, +3/+3 counts, announcements, beginning markers, focus, and corpus remain exactly those in Section 13.2. Failure, interruption, duplicate, generation mismatch, and consumption are mandatory live-QA branches, not additional fixtures, scenarios, or frame-14 steps.

### 15.3 Strict OPFS, sidecar, and invariant rules

Every frame, including inactive archive frame 16, performs OPFS inspection through `navigator.storage.getDirectory()`, enumerates the root, and records `browserState.opfs` exactly:

`{supported:true, accessible:true, entryCount:0, errorName:null}`

Unsupported API, rejected/inaccessible root, failed enumeration, nonzero entry count, null/unknown field, or missing record fails capture before either PNG or JSON is written. Zero other browser-state counters and all existing URL/history/network/console/privacy rules remain mandatory.

The manifest still exposes exactly fourteen fixtures and exactly two disjoint capture scenarios. Frame 3 has a null scenario; frame 14 alone uses `pagination-both-success`. Invariants additionally assert fixture defaults and reset behavior; native E12 order/open state; h1/scroll/announcement entry state; rerender and hidden-day preservation; exact logical anchor targets; app-owned baseline/generation/terminal/focus/consumption behavior; driver passivity; frame-14 sequence; strict OPFS object; unchanged domain fingerprint; and `mutationIntents=0`, `mutationEffects=0`, `providerRequests=0`.

## 16. Append-only canonical-entry and repaired evidence authority

This section supersedes only the old inherited contextual-entry mapping and old frame-16 launcher subject. The P1/P2 failure is recorded in [PRE-GATE-FAIL-v18.md](PRE-GATE-FAIL-v18.md), and the binding repair is C18-21. No fixture, event, capture scenario, evidence-frame count, requirement, or closure is added.

### 16.1 Entry-to-fixture map

| Eligible visible origin | Owned/native status | Fresh fixture/scope | Exact Back label |
| --- | --- | --- | --- |
| Settings **History** | Native v16; exact generic capture-phase interception only | `global-ready` / Global | **Back to Settings** |
| Compact More **History** | Native v16; exact generic capture-phase interception only | `global-ready` / Global | **Back to More** |
| `#lid-v18-canonical-entry-day` / **History & provenance** | V18-owned | `day-ready` / Day | **Back to Journal Day** |
| `#lid-v18-canonical-entry-item` / **View source history** | V18-owned | `item-ready` / Source Item | **Back to Source Item** |
| `#lid-v18-canonical-entry-summary` / **View Summary history** | V18-owned | `field-ready` / Summary | **Back to Summary** |
| `#lid-v18-canonical-entry-artwork` / **View artwork history** | V18-owned | `artwork-ready` / Artwork version 2 | **Back to Generated Artwork** |

The panel renders exactly Product's Section 17.2 copy and four facts in this table's contextual order. It is the direct body child between `#prototype-root` and `#modal-root`, hidden from layout/hit/accessibility while any feature is active. Fresh user page state has no active feature and no usable runtime launcher.

All other inherited controls are negative. The exported safe invariant `inheritedContextPatchedCount` counts inherited contextual nodes with any v18 eligibility/decoration, altered required native text, or injected v18 History control; it is exactly `0`. Settings/More are not counted as patched because their DOM remains native and eligibility is evaluated only from the activation event.

### 16.2 Exact negative fixture-independent regression

Before activation, the checker/driver snapshots bounded safe text and attribute maps for:

1. the frozen 2 Aug Journal Day **View day history** control;
2. the **Before sleep — synthetic fixture** Source Item's **Revisions & provenance** control;
3. the 2 Aug artwork **View versions** control; and
4. every 2 Aug Manage Reflection row, which contains zero v18 History control.

Each real native activation leaves v18 inactive. After native v16 handling and rerender, the same bounded text/attribute snapshot matches, there is still no injected control, and `inheritedContextPatchedCount=0`. Native toast/rerender behavior may occur and is not replaced by a v18 response. The negative test contains no source prose, raw HTML, or arbitrary private value.

### 16.3 Frame-16 replacement and exact round trips

Evidence IDs 1–15 remain unchanged. Evidence ID 16 is replaced exactly:

| ID | Basename | Final state | Viewport/media | Required final subject |
| ---: | --- | --- | --- | --- |
| 16 | `v18-16-canonical-entry-320-forced` | Inactive inherited archive; no active capsule | 320×900; light preference; reduced motion; forced colours active | Exact canonical entry panel in normal flow; final focus visible on Artwork entry; launcher absent from user surface |

Before its final PNG, the v18 driver uses visible controls and records six successful origin round trips. It visits native Settings and compact More through visible v16 navigation, then exercises the four owned panel controls in exact order. The four panel activation/close pairs are:

1. Day: pointer activation → visible **Back to Journal Day**;
2. Source Item: keyboard Enter → Escape;
3. Summary: keyboard Space → visible **Back to Summary**; and
4. Artwork: pointer activation → Escape.

Each panel trip proves the exact fresh fixture, expected scope, existing Source/Derived/total count, item E12 default where applicable, scope-specific Back copy, panel `display:none` and absent AX/hit state while active, then the exact same connected button focused after return with both `abs(scrollYAfter-scrollYBefore) <= 1` and `abs(buttonTopAfter-buttonTopBefore) <= 1`. The helper records only measurements and never scrolls, focuses, rewrites, or compensates after activation.

Settings and More each make one equivalent Global round trip and prove their exact native invoker/view/modal return. Across the visited native surfaces, the only generic v18 origins are those two exact **History** actions. The four panel buttons are owned, not inherited. No launcher, direct startup, URL/history/storage state, hidden selector alias, or arbitrary QA entry substitutes for these proof paths.

### 16.4 Sidecar and fail-closed additions

Frame 16 adds a bounded `archiveDiagnostics.canonicalEntry` object with:

- panel count, exact body sibling order, visible copy/fact/button order, IDs, scopes, geometry, computed style, accessibility exposure, and centre/corner hit results;
- six ordered origin round-trip records with activation/close method, safe origin/scope/fixture tokens, expected count, Back label, before/after scroll and target-top deltas, same-node connectedness, focus, active-state hiding, and pass/fail;
- `inheritedContextPatchedCount:0`, exact two native Global-origin tokens, `otherInheritedV18OriginCount:0`, and the bounded 2 Aug / Before sleep negative snapshot comparison;
- `launcherUserSurfaceAbsent:true`, with visible/focusable/hit/AX counts all zero even if the frozen compatibility DOM node remains; and
- final inactive state, final Artwork-button focus, no panel/archive/modal/host overlap, no horizontal overflow, and unchanged privacy/0/0/0/domain assertions.

All sixteen sidecars retain strict OPFS supported/accessibility/zero-entry proof and every prior privacy field. The driver fails before either output for wrong panel cardinality/placement/copy/order, mutable-main/runtime-root placement, unsafe observer behavior, a patched inherited control, an extra/missing Global origin, native negative activation opening v18, visible/eligible launcher, automatic startup, a hidden/AX/hit failure, wrong fresh fixture/count/Back label, disconnected/different return target, either delta above one pixel, helper compensation, or any prior invariant failure.

Live QA repeats both Back and Escape for all six origins and pointer/Enter/Space across the four panel buttons, then covers the unchanged sixteen-frame and prior regression matrix. The manifest remains exactly fourteen fixtures and two disjoint scenarios; frame 16 is an archive evidence procedure, not a fixture or scenario.

## 17. Append-only frame-16 viewport and transcript authority

C18-22 narrows only how frame 16 proves both responsive native Global origins. The final evidence basename, dimensions, media, fixture/scenario cardinality, six origin meanings, negative controls, and every Section 16 invariant remain unchanged.

### 17.1 Exact environment and trip order

The driver records exactly three ordered `viewportStages`:

| Stage key | Requested and observed viewport | Entry condition | Work completed before next stage |
| --- | --- | --- | --- |
| `initial-compact` | 320×900 | Inactive archive; no pending return | Initial compact visibility/one-column/More assertions only |
| `settings-wide` | 1024×900 | Inactive after environment resize | Settings Global trip fully returned and consumed |
| `restored-compact` | 320×900 | Inactive after environment resize | More, Day, Item, Summary, Artwork trips and final PNG |

The ordered origin transcript is exactly `settings-global`, `more-global`, `canonical-day`, `canonical-item`, `canonical-summary`, `canonical-artwork`. Settings uses its actual visible native **History** control and visible Back at 1024×900. Compact More uses its actual visible native **History** control and Escape at 320×900. The four canonical activation/close methods remain pointer/Back, Enter/Escape, Space/Back, pointer/Escape respectively.

A resize is recorded as environment metadata, not as an origin trip or app transition. It occurs only with `activeFeature=null`, no pending return/correction/announcement, completed exact focus/scroll restoration, unchanged domain digest, and zero counters. No resize occurs between a trip baseline and its completed return assertion.

### 17.2 Per-trip and final sidecar fields

Every one of the six trip records contains:

- the exact origin key and `viewportStage` key;
- requested and observed width/height before activation, while active, and after return;
- actual control visible/enabled/centre-hit/accessibility-exposed results;
- safe expected fixture/scope/count/Back-or-Escape tokens;
- same connected invoker and final focus;
- before/after `scrollY`, invoker-top, and absolute deltas no greater than one CSS pixel;
- before/after domain digest and equality result;
- before/after mutation/provider counters, all 0/0/0; and
- active/pending/return-consumed observations.

The top-level final `viewport` remains requested and observed 320×900 rather than the temporary wide stage. Final assertions re-query the live DOM and prove desktop Settings hidden, compact More visible/enabled/hit/accessibility-reachable, exactly one canonical panel column, no horizontal overflow, no active feature or pending return, and focus on `#lid-v18-canonical-entry-artwork` before PNG capture.

### 17.3 Environment/state separation and fail-closed rules

Viewport and responsive control exposure never select or alter fixture, scope, filters, disclosures, pagination, corpus, domain, scenario, URL, history, storage, or counters. The detached manifest and app snapshot contain no viewport-derived domain/fixture/scenario field. `viewportStages` and per-trip dimensions exist only in safe evidence metadata.

The helper may navigate or scroll to expose the next real origin before recording that origin's baseline. After baseline it never focuses, scrolls, resizes, compensates, mutates DOM/CSS/layout, or substitutes a hidden/non-AX control. Wrong stage order/cardinality, resize while active/pending, Settings measurement outside 1024×900, any other trip outside 320×900, dimension drift, hidden/non-hit/non-AX activation, digest/counter change, helper compensation, wrong final responsive state, or any inherited Section 16 failure aborts before PNG or JSON output.

This procedure adds no fixture, event, scenario, frame, scope, or closure. Core behavior is producer-stable; evidence implementation remains in progress and no independent-QA or acceptance result exists.
