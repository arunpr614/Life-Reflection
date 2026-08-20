# Life in Days v18 product acceptance — History and Provenance

- **Decision date:** 2026-08-19
- **Package:** `PVA-013 History and Provenance`
- **Predecessor:** frozen and remotely read-back v17
- **Product owner:** Product Manager agent
- **Product disposition:** **Approved for Design and Council review**
- **Primary closure targets:** exactly `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004`
- **Evidence boundary:** deterministic fictional frontend behavior in browser memory only

V18 turns History from a placeholder into a read-only, navigable record of how a Journal Day came to look the way it does. It must connect global, Journal Day, Source Item, generated-field, and artwork histories without mixing source truth, owner Corrections, or Derived Artifacts.

This file does not close a requirement. The current program arithmetic remains **19/57 prototype-representable rows closed and 38/57 open** until the complete v18 package passes every gate. V18 targets exactly three of those 38 rows. There is no additional History requirement ID and no fourth primary row.

## 1. Authority and counting boundaries

### Primary v18 rows

| Requirement | Product result v18 must make observable |
| --- | --- |
| `LID-SCP-003` | Source Items, Source Revisions, Corrections, generated-field versions, and artwork versions are separate, navigable records with explicit lineage and source bindings. |
| `LID-VN-006` | Revised, untagged, and deleted-upstream Voice Journal states remain visible without silently deleting the local Source Item or its retained revisions. A later Source Revision and an existing Correction remain independently legible as a conflict. |
| `LID-REF-004` | Journal Day detail has functioning day, item, field, artwork, and provenance entry points; authentic source material stays readable while history is inspected or unavailable. |

### Supporting inherited regression only

The retained-history portion of `LID-SRC-004` is inherited from v17. V18 must display a fictional `Journal Date changed` event and the retained artwork/source binding that resulted from redating, but it must not count `LID-SRC-004` again or broaden the v17 closure claim.

`LID-SCP-004` remains assigned to v19. V18 may inspect one pre-existing hidden historical day, but it does not remove or restore a last live source and does not count day-visibility lifecycle closure.

### Outside-UI boundary

`LID-VN-005` remains **Requires external evidence**. A screen can represent revised, untagged, deleted, interrupted, or never-verified states. It cannot prove VoiceNotes webhook or MCP authority, authoritative enumeration, replay safety, partial-page detection, provider idempotency, durable revision creation, or absence-based deletion protection.

V18 must label the reconciliation evidence for its Voice Journal fixtures as **Synthetic UI fixture · external evidence required**. No v18 state may say that reconciliation ran, completed, is replay-safe, or verified a provider result.

## 2. Product outcome and user promise

The primary user is the archive owner reviewing one private Journal Day. The product promise is:

> I can see what is source truth, what changed upstream, what I corrected, what the product generated, and why the current presentation exists—without changing it merely by looking.

V18 succeeds when the owner can answer all of these questions from visible, linked records:

1. What Source Item and Source Revision does this displayed journal come from?
2. Is the displayed text upstream text or an owner Correction?
3. What preceded and followed the selected revision or version?
4. Which exact ordered source/Correction set did a generated field or artwork version use?
5. Was a Source Item redated, revised, untagged, or deleted upstream?
6. Why is a Journal Day or artifact Current, Historical, Stale, Active, or in Conflict?
7. Can I return to the exact Journal Day, item, field, or artwork control that opened History?

## 3. Fixed fictional authority

All values below are synthetic, deterministic, resettable, and held in browser memory. The prototype clock is `2026-08-19T10:00:00+05:30`; every displayed date and time is interpreted in `Asia/Kolkata`.

### Current Journal Day lineage

- **Current Journal Day:** `17 Aug 2026`
- **Voice Journal:** `Monsoon walk note`
- **Immutable Original Timestamp:** `17 Aug 2026, 11:42 pm IST`
- **Initial represented Journal Date:** `18 Aug 2026`
- **Current represented Journal Date:** `17 Aug 2026`
- **Source revisions:** `Revision 1` → `Revision 2` → `Revision 3`
- **Displayed journal text:** `Correction 1`, based on `Revision 2`
- **Current upstream revision:** `Revision 3`
- **Current upstream status:** `Deleted upstream · local Source Item retained`
- **Conflict:** `Correction 1` versus `Revision 3 · unresolved`
- **Generated Summary:** `Summary version 1` is Historical; `Summary version 2` is Displayed and Stale
- **Generated Artwork:** `Artwork version 1` is Historical; `Artwork version 2` is Active and Stale
- **Reconciliation evidence:** `Synthetic UI fixture · external evidence required`

The source record may show fictional prose in the Journal Day reading region. History event cards and safe provenance detail use only the labels above and bounded state facts. They do not repeat source prose.

### Hidden historical Journal Day

- **Historical Journal Day:** `11 Aug 2026`
- **Former Uploaded Journal:** `Station light note`
- **Current location:** `10 Aug 2026`
- **Historical artwork:** `Station light illustration`
- **Visibility:** no live Source Item remains on `11 Aug 2026`
- **Exact banner:** `Historical day — not shown in Calendar or Timeline`

The hidden day is reachable only through Global History or a linked redating record. It does not appear in ordinary Calendar, Almanac, or current-day navigation.

## 4. Typed event authority

The normal fixture contains exactly **17 events**. Event keys are test-fixture labels and need not be visible. User-visible cards show the event type, safe actor class, synthetic timestamp, record label, Journal Date at the time of the event, and relevant lineage relationship.

| Key | Synthetic timestamp | Typed event | Lane | Actor class | Record and required visible fact |
| --- | --- | --- | --- | --- | --- |
| `E01` | `18 Aug 2026, 12:02 am IST` | Source Item captured | Source record | Source adapter fixture | `Monsoon walk note` · `Revision 1` · Journal Date then `18 Aug 2026` |
| `E02` | `18 Aug 2026, 12:15 am IST` | Generated field created | Derived · Generated field | Synthetic automation | `Summary version 1` · bound to `[Revision 1]` |
| `E03` | `18 Aug 2026, 12:18 am IST` | Artwork generated | Derived · Artwork | Synthetic automation | `Artwork version 1` · bound to `[Revision 1]` |
| `E04` | `18 Aug 2026, 8:15 am IST` | Source Revision received | Source record | Source provider fixture | `Revision 2` follows `Revision 1` · `Revised upstream` |
| `E05` | `18 Aug 2026, 8:24 am IST` | Correction created | Source record | Owner | `Correction 1` branches from `Revision 2` · not upstream text |
| `E06` | `18 Aug 2026, 8:30 am IST` | Generated field created | Derived · Generated field | Synthetic automation | `Summary version 2` · ordered binding `[Revision 2, Correction 1]` |
| `E07` | `18 Aug 2026, 8:31 am IST` | Generated field selected | Derived · Generated field | Owner | `Summary version 2` becomes Displayed |
| `E08` | `18 Aug 2026, 8:35 am IST` | Artwork generated | Derived · Artwork | Synthetic automation | `Artwork version 2` · ordered binding `[Revision 2, Correction 1]` |
| `E09` | `18 Aug 2026, 8:36 am IST` | Artwork selected | Derived · Artwork | Owner | `Artwork version 2` becomes Active |
| `E10` | `19 Aug 2026, 9:05 am IST` | Journal Date changed | Source record | Owner | `18 Aug 2026` → `17 Aug 2026` · Original Timestamp unchanged |
| `E11` | `19 Aug 2026, 9:12 am IST` | Source Revision received | Source record | Source provider fixture | `Revision 3` follows `Revision 2` · `Revised upstream` |
| `E12` | `19 Aug 2026, 9:13 am IST` | Source/Correction conflict detected | Source record | Life in Days fixture | `Correction 1` remains displayed; `Revision 3` remains retained; no auto-merge |
| `E13` | `19 Aug 2026, 9:20 am IST` | Source untagged upstream | Source record | Source provider fixture | Local `Monsoon walk note` remains readable and retained |
| `E14` | `19 Aug 2026, 9:28 am IST` | Source deleted upstream | Source record | Source provider fixture | Local `Monsoon walk note`, revisions, and Correction remain readable and retained |
| `E15` | `11 Aug 2026, 7:10 pm IST` | Source Item captured | Source record | Owner | `Station light note` · Journal Date then `11 Aug 2026` |
| `E16` | `11 Aug 2026, 7:25 pm IST` | Artwork generated | Derived · Artwork | Synthetic automation | `Station light illustration` · Historical |
| `E17` | `12 Aug 2026, 7:30 am IST` | Journal Date changed | Source record | Owner | `11 Aug 2026` → `10 Aug 2026`; `11 Aug 2026` becomes hidden |

### Cardinality and display order

Every event appears at most once within one visible list. Reappearance in a different scoped history is intentional cross-navigation, not a duplicate event.

| History surface | Exact count | Newest-first display order |
| --- | ---: | --- |
| Global History · All events | 17 | `E14` → `E13` → `E12` → `E11` → `E10` → `E09` → `E08` → `E07` → `E06` → `E05` → `E04` → `E03` → `E02` → `E01` → `E17` → `E16` → `E15` |
| Journal Day · `17 Aug 2026` | 14 | `E14` → `E13` → `E12` → `E11` → `E10` → `E09` → `E08` → `E07` → `E06` → `E05` → `E04` → `E03` → `E02` → `E01` |
| Source Item · `Monsoon walk note` | 14 | `E14` → `E13` → `E12` → `E11` → `E10` → `E09` → `E08` → `E07` → `E06` → `E05` → `E04` → `E03` → `E02` → `E01` |
| Field · Generated Summary | 3 | `E07` → `E06` → `E02` |
| Artwork · `Artwork version 2` lineage | 3 | `E09` → `E08` → `E03` |
| Historical day · `11 Aug 2026` | 3 | `E17` → `E16` → `E15` |

Events before `E10` remain part of the Source Item's complete lineage after redating. On the `17 Aug 2026` day history, those cards must say **Journal Date at this event · 18 Aug 2026**. They must not be relabeled as if they occurred on the current day.

If two future fixtures share a visible timestamp, the stable fixture sequence is the tie-breaker, newest sequence first. V18's accepted normal fixture does not depend on that tie-breaker because every timestamp above is unique.

## 5. Required history surfaces

### Global History

- Opens from the normal-flow History destination and the v18 global launcher.
- Begins at `All events · 17` and exposes separate, non-colour-only lanes for `Source records` and `Derived artifacts`.
- Can narrow to Journal Days, Source records, Generated fields, or Artwork without changing the URL, title, browser-history payload, or browser storage.
- Shows the hidden `11 Aug 2026` Journal Day with its exact hidden-day label and a working read-only destination.
- Back returns to the exact invoking History control, scroll position, and inherited archive view.

### Journal Day history

- `View day history` on the synthetic `17 Aug 2026` Journal Day opens the 14-event view.
- The day header keeps the full Journal Date, source count, upstream-attention state, and read-only disclosure visible.
- Source-record and Derived-Artifact lanes remain separate even when their events interleave chronologically.
- The full lineage follows the current Source Item across its former Journal Date. Each event retains its event-time Journal Date.
- Back returns to `View day history` on the same Journal Day without resetting the Journal Day reading position.

### Source Item history

- `History and provenance` on `Monsoon walk note` opens the 14-event item view.
- The header names the Voice Journal, immutable Original Timestamp, current Journal Date, upstream status, current upstream revision, displayed Correction, and conflict independently.
- A selected Source Revision exposes `Preceded by` and `Followed by`. Endpoints display `No earlier revision` or `No later revision`; the relation does not disappear.
- The revision chain is `Revision 1` → `Revision 2` → `Revision 3`. `Correction 1` is a visible branch based on `Revision 2`, not a replacement node in the upstream chain.
- Selecting `Correction 1` shows `Based on Revision 2`, `Still displayed`, and `Conflict with Revision 3`. It never labels the Correction as upstream VoiceNotes text.

### Generated-field history

- The Generated Summary's History control opens a three-event, read-only view.
- `Summary version 1` is Historical and bound to `[Revision 1]`.
- `Summary version 2` is Displayed and Stale, follows `Summary version 1`, and is bound to the exact ordered set `[Revision 2, Correction 1]`.
- Each version shows predecessor and successor facts, generated-field status, a synthetic trigger, and safe fixture provenance.
- V18 contains no edit, protect, accept, resume-automation, or replacement action. Those lifecycle actions remain owned by later packages.

### Artwork history

- The artwork History control opens a three-event, read-only view.
- `Artwork version 1` is Historical and bound to `[Revision 1]`.
- `Artwork version 2` is Active and Stale, follows `Artwork version 1`, and is bound to `[Revision 2, Correction 1]`.
- Both versions retain the visible `AI-generated artwork` label. Provenance uses `Synthetic artwork provider fixture`, `Fixture configuration A`, a synthetic generation timestamp, safe trigger, source binding, and `Synthetic cost · fixture only`.
- V18 contains no Select as Active, regenerate, move-to-Trash, delete, or suppression action. Complete artwork selection and staleness behavior remains owned by v28.

### Hidden historical Journal Day

- Global History can open `11 Aug 2026` even though no live Source Item remains on that date.
- The page begins with the exact banner `Historical day — not shown in Calendar or Timeline`.
- Its three-event list shows the original source, historical artwork, and move-away event without presenting either artifact as current for `11 Aug 2026`.
- `Station light note` links to its current synthetic location on `10 Aug 2026`; the link is navigation only.
- There is no Restore, Delete, or Make current control. Trash and restoration remain v19 work.

## 6. Source, Correction, and Derived Artifact separation

The hierarchy must remain explicit at every history scope:

```text
Source record
├── Source Item: Monsoon walk note
│   ├── Revision 1
│   ├── Revision 2
│   │   └── Correction 1 (owner-authored branch)
│   └── Revision 3
└── Journal Date membership: 18 Aug 2026 → 17 Aug 2026

Derived artifacts
├── Generated Summary
│   ├── Summary version 1 ← [Revision 1]
│   └── Summary version 2 ← [Revision 2, Correction 1]
└── Generated Artwork
    ├── Artwork version 1 ← [Revision 1]
    └── Artwork version 2 ← [Revision 2, Correction 1]
```

The visible UI must not:

- call a Correction a Source Revision;
- call generated text a transcript or journal;
- call Generated Artwork a Daily Photo;
- merge Source and Derived event counts into one unlabeled lineage;
- imply that an upstream deletion removed the local Source Item;
- hide a predecessor, successor, base revision, or ordered source binding when record detail is open.

Status is multi-dimensional. `Artwork version 2` may be both `Active` and `Stale`; `Correction 1` may be both `Displayed` and `In conflict`; `Monsoon walk note` may be both `Retained locally` and `Deleted upstream`. These facts must be separate text labels rather than one ambiguous badge.

## 7. Upstream Voice Journal lifecycle

The lifecycle fixtures must be reachable independently and cumulatively:

| Fixture | Required visible state | Local archive invariant |
| --- | --- | --- |
| `upstream-revised` | `Revision 2` follows `Revision 1`; status `Revised upstream` | Both revisions remain inspectable. |
| `upstream-conflict` | `Revision 3` follows `Revision 2`; `Correction 1` remains displayed; conflict is unresolved | No auto-merge and no revision or Correction disappears. |
| `upstream-untagged` | `Untagged upstream` event follows the revision/conflict events | Source Item, three revisions, Correction, Original Timestamp, and displayed text remain locally readable. |
| `upstream-deleted` | `Deleted upstream · local Source Item retained` follows untagged | The local Source Item remains on `17 Aug 2026`; no Trash, purge, suppression, or provider deletion is implied. |

Absence from an upstream enumeration is never an event in v18. The deleted-upstream fixture is an explicitly represented provider-status event, not an inference from a missing list entry.

The ordinary Journal Day displays `Correction 1` in its source-journal reading region throughout `upstream-conflict`, `upstream-untagged`, and `upstream-deleted`. A compact attention line may link to the exact conflict or upstream event, but it cannot displace or collapse the journal.

## 8. Read-only and navigation contract

History inspection changes no Current, Displayed, Active, Stale, Conflict, Journal Date, upstream, or visibility state. Opening a record, changing a history lane/filter, following a lineage link, using Back, or closing History leaves the complete pre-open snapshot byte-for-byte equivalent in the v18 in-memory model.

V18 History may expose only navigation actions:

- `Open Journal Day`
- `Open Source Item`
- `Open generated field`
- `Open artwork version`
- `View previous record`
- `View next record`
- `Back to …`
- `Retry history`

It must not expose `Restore`, `Make current`, `Select`, `Resolve`, `Delete`, `Allow re-import`, `Allow generation`, or any action that sounds like a mutation. A future version may begin such an action only outside History with a separate consequence review.

Every entry point records its exact invoking control and scroll position in browser memory. Back, Escape where applicable, and the visible Back control restore that context and focus. Direct/global opening returns to the integrated v18 launcher.

## 9. Required fixture and state family

Every state is selectable from a clearly secondary prototype-state console and available through the read-only QA surface. Reset returns to `global-ready` with the full 17-event authority.

| Fixture key | User-visible purpose | Exact acceptance |
| --- | --- | --- |
| `global-ready` | Complete global history | 17 events; two top-level lanes; newest-first order; hidden day reachable. |
| `day-ready` | Current Journal Day history | `17 Aug 2026`; 14 events; earlier events retain `18 Aug 2026` event-time labels. |
| `item-ready` | Source Item history | 14 events; three-revision chain; Correction branch; conflict and upstream status distinct. |
| `field-ready` | Generated Summary history | 3 events; two versions; exact bindings and predecessor/successor facts. |
| `artwork-ready` | Artwork history | 3 events; two versions; persistent AI label; exact bindings and safe fixture provenance. |
| `hidden-day` | Historical day management access | Exact hidden-day banner; 3 events; no current artifact or mutation control. |
| `upstream-revised` | Upstream edit | Revision 1 and Revision 2 retained; Revised upstream visible. |
| `upstream-conflict` | Later revision after Correction | Revision 3 and Correction 1 both retained; no auto-merge. |
| `upstream-untagged` | Tag removed upstream | Local item and full lineage remain readable. |
| `upstream-deleted` | Source deleted upstream | Local item and full lineage remain readable; no local deletion claim. |
| `empty` | No events for the selected scope | `No history matches this view`; no false claim that the archive has no history. |
| `loading` | Initial or scope-change wait | No stale count is presented as final; authentic Journal Day content remains readable. |
| `failure` | Known-zero history retrieval failure | Specific synthetic failure disclosure, zero invented events, and one `Retry history` action. |
| `interrupted` | Freshness uncertain after a complete list was visible | Last complete list remains visible with `May be out of date`; retry does not duplicate events or change current state. |

Retry returns to the exact requested scope. It must not jump to Global History, duplicate an event, reset a selected record, or imply a network/provider call.

## 10. Journal Day continuity and `LID-REF-004`

The v18 Journal Day fixture preserves the existing reflection hierarchy:

1. Journal Date and quiet source counts.
2. Real-photo gallery before visibly labeled Generated Artwork.
3. Generated title, Summary, and Tags in a separate `Generated reflection` region.
4. Full source journals in chronological Original Timestamp order.
5. Day actions and History/provenance entry points.

The Journal Day must expose working entry points for day history, the Voice Journal's Source Item history, Generated Summary history, and artwork history. Source labels, Original Timestamp, upstream status, displayed Correction, field status, artwork status, and safe provenance remain visible at their relevant scopes.

History loading, failure, interruption, or empty-filter states do not hide the authentic journal. An unavailable history state says only that History cannot currently be shown in the selected synthetic fixture; it never says the memory is missing.

No blank composer, unsupported upload, web photo upload, semantic search, coaching, reminder, streak, sharing, or public-link action is introduced.

## 11. Privacy and proof limits

- Fixtures contain no real journal text, photo, caption, filename, timestamp, provider, model, account detail, identifier, credential, recovery material, or personal content.
- The page title remains generic `Life in Days`.
- Scope, filter, selected event, record label, upstream state, and fixture key remain out of URL path parameters, query parameters, hash, browser-history payload, local storage, session storage, IndexedDB, Cache Storage, service workers, requests, referrers, console output, logs, and telemetry-shaped output.
- Reload resets v18 to its fixed fictional authority.
- Safe provenance shows actor class and fictional display labels. It does not show raw upstream IDs, provider request IDs, database keys, checksums, payloads, prompts, source prose, credentials, or error bodies.
- Polite status text may announce `History view updated` or a count. Assertive failure text remains generic and does not repeat source labels or private-looking content.
- All requests made by the static prototype remain its localhost asset requests. V18 creates no provider, reconciliation, analytics, or persistence request.

The prototype does not prove persistence, immutable records, reconciliation, provider status, provider identity, backend ordering, event delivery, transactionality, concurrency, cross-process idempotency, restart recovery, search indexing, Trash, suppression, export/restore, authentication, authorization, encryption, deployment, operations, formal accessibility conformance, or production readiness.

## 12. Inherited v17 regression

V18 is additive. It must not edit any frozen v1–v17 asset, `package.json`, or `serve.mjs`.

On `index-v18.html`:

- the cumulative runtime manifest reports exactly `[17, 18]` in ascending order and targets v18 as the latest compatible QA capsule;
- the v18 launcher opens Global History and returns cleanly to the inherited archive;
- eligible inherited `Change Journal Date` controls still open v17 Atomic Redating with their exact resolved LaunchContext;
- v17 future/same-day rejection, known failure, unknown result, success, rapid-repeat cardinality, Original Timestamp immutability, resulting-day links, focus return, privacy, and zero-provider-request behavior remain unchanged;
- the v18 `E10` record is explicitly a preloaded synthetic history fixture that mirrors the v17 event shape. It does not claim shared durable storage between capsules;
- v17's retained artwork history/source-binding result is inspectable in v18 without counting `LID-SRC-004` again.

## 13. Observable acceptance by requirement

### `LID-SCP-003`

Product accepts the bounded frontend representation only if:

1. Global, day, item, field, artwork, and hidden-day histories are all reachable and return to their exact origins.
2. The 17-event corpus, scoped counts, newest-first order, and cross-scope cardinality match Section 4 exactly.
3. Source Item, three Source Revisions, owner Correction, two Summary versions, and two Artwork versions remain distinct records.
4. Every selected record exposes predecessor and successor facts, branch/base relationship where applicable, and exact ordered source binding for Derived Artifacts.
5. Source-record and Derived-Artifact lanes remain visibly and semantically separate.
6. Browsing History changes no state and exposes no mutating action.

### `LID-VN-006`

Product accepts the bounded frontend representation only if:

1. Revision 1, Revision 2, and Revision 3 remain retained in order.
2. `Revised upstream`, `Untagged upstream`, and `Deleted upstream` are separately reachable, cumulative states with typed events.
3. Correction 1 stays a distinct owner record based on Revision 2 and remains displayed when Revision 3 creates a conflict.
4. Untagging and upstream deletion leave the local Source Item, Original Timestamp, revisions, Correction, and ordinary Journal Day reading intact.
5. The UI never derives deletion from absence or claims that provider reconciliation was executed or verified.
6. `LID-VN-005` stays visibly labeled as an external-evidence boundary and remains unclosed.

### `LID-REF-004`

Product accepts the bounded frontend representation only if:

1. The Journal Day retains authentic/derived separation and working day/item/field/art History entry points.
2. Full source text remains readable while History is loading, failed, interrupted, empty, or open.
3. Original Timestamp, upstream state, displayed Correction, Generated Summary state, artwork state, and safe provenance are available from the relevant record.
4. Back restores the Journal Day, scroll position, and invoking control without losing its state.
5. The hidden historical day is reachable from management History but absent from ordinary browse surfaces.
6. No deferred management, capture, search, artwork-selection, provider, security, or export feature is introduced as working.

## 14. QA and closure gate

Independent QA must verify the exact candidate bytes and, at minimum:

- all 14 named fixtures;
- exact 17/14/14/3/3/3 counts and event order;
- every predecessor, successor, Correction branch, and Derived binding;
- all five active history scopes plus the hidden historical day;
- revised, conflict, untagged, and deleted-upstream retention;
- read-only equivalence before and after every navigation/filter/detail path;
- pointer and keyboard navigation, visible focus, return-focus, one feature `h1`, and task-before-console order;
- light, dark, reduced-motion, and forced-colour meaning;
- no horizontal page scroll at wide, medium, 390 px, 320 px, and relevant compact landscape dimensions;
- generic URL/title/history, zero browser storage/registration, localhost-only assets, zero console events, and zero browser exceptions;
- frozen v1–v17 hashes and the inherited v17 behavioral regression in Section 12.

The only permitted v18 closure statement after Product, Design, Council, Implementation, independent QA, freeze, push, and remote readback all pass is:

> V18 prototype-represents read-only global, Journal Day, Source Item, generated-field, artwork, and hidden-day histories; exact typed-event ordering and lineage; separate source/Correction/Derived records; and revised, untagged, deleted-upstream, and conflict states using deterministic synthetic browser-memory fixtures. It closes only the bounded frontend-prototype portions of `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004`. `LID-VN-005` and all backend, provider, persistence, reconciliation, security, deployment, accessibility-conformance, and production claims remain unverified.

## 15. Append-only pre-hold Current source context and initial-loading amendment

Product approved this narrow contract clarification on 2026-08-19 before candidate hold. It preserves the earlier Product record as decision history and supersedes only any implication that every Day/Item state shows the same displayed-record prose or that the exact top-level `loading` fixture may use an unnamed busy panel. No event, fixture, scope, closure target, count, or proof boundary changes.

### 15.1 Exact source-context mapping

The detached QA export exposes only `sourceContextVariant`, with exactly one of the safe values `revision-2`, `correction-1`, or `none`. The mapping is deterministic:

| Owner and current scope | `sourceContextVariant` | Exact visible Current source context prose |
| --- | --- | --- |
| `upstream-revised` and any in-scope descendant that retains that owner in Day or Source Item scope | `revision-2` | **Fictional Revision 2 — Rain softened the path beneath the paper lanterns; the synthetic narrator counted three quiet puddles before walking home.** |
| Every other Day or Source Item owner and its in-scope descendants | `correction-1` | **Fictional Correction 1 — A rain-washed path curved past paper lanterns; the synthetic narrator paused beside three quiet puddles before heading home.** |
| Global, generated-field, artwork, hidden-day, archive, and any other non-Day/Item scope | `none` | No Current source context region and no source prose. |

An in-scope descendant includes filter, disclosure, relation-focus, status-unavailable, loading, failure, interruption, empty, retry, and pagination transitions that do not reset the owning fixture/scope. A fixture or scope reset recomputes the mapping from the new owner; text matching or current transition name never chooses the variant.

### 15.2 Exact `upstream-revised` product state

`upstream-revised` is a two-event Source-only item history: newest-first `E04,E01`, Revision lineage `Revision 1 → Revision 2`, and no Derived event. `Revision 2` is simultaneously **Displayed**, **Current upstream**, and **Revised upstream**; `Revision 1` remains Historical. The task content contains no Correction, Revision 3, conflict, Untagged, or Deleted fact. The exact revised prose above is the only source prose shown. The external-evidence boundary remains visible, and the accepted global corpus remains exactly `E01`–`E17`.

### 15.3 Exact top-level `loading` fixture

The top-level `loading` fixture is a fresh Global History initial load with `sourceContextVariant=none`. It renders:

1. `h1` **History & provenance**, which retains entry focus;
2. a named **Source history** lane region with `aria-busy="true"`;
3. inside that Source region, the existing safe status heading **Loading history** and exact body **Preparing separate Source and Derived event lists from synthetic browser-memory fixtures.**; and
4. no Derived history region, event card, represented-event count presented as final, or source-prose region until the initial load resolves.

The exact top-level fixture uses the static status only: no animated shimmer and no skeleton that resembles an event, actor, timestamp, record label, or final count. `aria-busy` is not placed on the page, main landmark, filter area, or an absent Derived lane. Earlier-page loading remains lane-local and keeps the other already-rendered lane unaffected. A Day/Item loading descendant continues to show its mapped Current source context before filters while only the affected history lane is busy.

### 15.4 Structured-output privacy and retained gate state

Neither exact prose string may appear in a QA snapshot, snapshot summary, JSON sidecar, capture-scenario transcript, URL, `history.state`, browser storage, request, response-shaped log, console output, exception, or live region. Event cards and provenance also remain prose-free. `sourceContextVariant` is the complete safe exported representation; a PNG may naturally contain the pixels of the visible Current source context region.

Product retains `P=A` for this contract-only clarification. `I=IP`; `Q=—`; `F=—`. All three target rows remain open and program arithmetic remains 19/57 closed and 38/57 open.

## 16. Append-only pre-hold disclosure, async-anchor, and OPFS amendment

Product approved this final narrow amendment before candidate hold. It adds no fixture, capture scenario, CLI surface, event, closure target, or product capability, and it does not change the exact fourteen-fixture order, two-scenario order, `E01`–`E17` corpus, or read-only boundary.

### 16.1 Deterministic item disclosure state

A fresh selection of `item-ready` has `openDisclosureKeys` exactly `['E12']`; each of the other thirteen top-level fixtures has `openDisclosureKeys` exactly `[]`. In fresh `item-ready`, the native **View complete provenance** `<details>` for `E12` is already open. Its complete provenance remains inline and exposes **Event sequence** before **Record lineage**. No script click, synthetic disclosure transition, or announcement is required to create this default.

Fresh entry still scrolls to exact coordinates `scrollX=0`, `scrollY=0`, focuses the `h1` **History for Monsoon walk note**, and emits no live-region announcement. Evidence frame 3 may subsequently use its selector only to scroll that already-open `E12` content into view; the selector does not open the disclosure, move focus from the `h1`, or emit an announcement. Its sidecar records `capture.scenario=null`, final `openDisclosureKeys=['E12']`, exactly `E12` open, and the entry focus/scroll/announcement assertions.

The user may close and reopen `E12`; the current user-selected disclosure state survives an ordinary rerender and a hidden-day round trip. A key may remain in browser-memory state while its event is temporarily not rendered, then regain its prior open state when the owning view returns. A fixture reset or fresh fixture selection discards that transient choice and restores the exact fixture default above.

### 16.2 App-owned asynchronous pagination anchor

Every per-lane pagination generation owns one app-side visual-anchor record. A genuine activation of the visible, enabled **Load earlier Source events** or **Load earlier Derived events** control captures the matching logical target's viewport-top baseline before the lane enters pending. The exact stable logical targets are `#lid-v18-load-source` and `#lid-v18-load-derived`. Direct QA delivery and the evidence helper cannot create, replace, or repair that baseline.

The baseline is keyed by lane and generation, survives the pending render, and is eligible only for the matching terminal success, failure, interruption, or duplicate-delivery outcome. After the matching terminal UI has rendered, the app restores that same logical target to within one CSS pixel of the captured viewport top, moves focus to it, and consumes the record exactly once. A stale generation cannot restore or consume a newer record. A visible prototype outcome and its allowlisted QA-dispatch equivalent enter the same reducer, render, restoration, focus, and consumption path; neither receives a proof-only behavior.

The additive v18 evidence helper may observe and report the baseline, terminal viewport top, absolute delta, generation, and focus. It must never call `scrollTo`, `scrollBy`, `scrollIntoView`, alter layout, or otherwise compensate after a pagination activation. From a fresh `global-ready` setup, frame 14's exact scenario transcript is: one allowlisted partial-page QA seed; actual visible Source Load activation; allowlisted Source-success delivery; actual visible Derived Load activation; allowlisted Derived-success delivery. Fixture setup is metadata, not a second scenario step. Each success still adds exactly three once and reaches its exact beginning marker.

### 16.3 Strict OPFS evidence gate and disposition

Every one of the sixteen v18 evidence pairs must prove that OPFS inspection is supported, the root is accessible, and its root entry count is exactly zero. The sidecar records `browserState.opfs` exactly as `{supported:true, accessible:true, entryCount:0, errorName:null}`. Unsupported inspection, access failure, a nonzero count, or a missing/indeterminate value is a capture failure before PNG or JSON is written.

Product retains `P=A` for this contract-only amendment. `I=IP`; `Q=—`; `F=—`. All three target rows remain open; program arithmetic remains 19/57 closed and 38/57 open.

## 17. Append-only pre-gate failure and canonical-entry repair amendment

The final Product/Design pre-gate failed the implementation bytes recorded in [PRE-GATE-FAIL-v18.md](PRE-GATE-FAIL-v18.md). At that verdict there was no P0, exactly one P1 / High false-provenance blocker, one P2 return-position defect, and no other blocker. Product was `P=F`; Design was `D=F`; the superseded Council entry contract failed; independent QA had not started.

### 17.1 Failed product behavior

The failed candidate made unrelated frozen-v16 content appear to own the fixed 17 Aug 2026 / Monsoon walk note history. The 2 Aug Journal Day opened **History for 17 August 2026**; **Before sleep — synthetic fixture** opened **History for Monsoon walk note**; and unrelated generated fields and artwork opened the fixed Summary and Artwork version 2 fixtures. This was false provenance, not merely imprecise copy.

The same old contextual paths returned focus but missed exact return position at `1867→1785`, `1121→1073`, and `1087→1064`. Settings/More were exact and artwork was within one pixel. Those measurements remain failure evidence; removing the old paths does not waive the exact return criterion for their replacements.

### 17.2 Exact user-visible entry model

Global History has exactly two inherited origins and no third: the native **History** action in Settings and the native **History** action in compact More. They remain native v16 controls with their original text and attributes; v18 may intercept only those two generic, entity-free actions in capture phase. The floating runtime launcher is retired from the v18 user surface, and v18 does not automatically open Global History on page load.

Contextual History has exactly one v18-owned canonical synthetic entry section. Its exact visible copy is:

- eyebrow: **PROTOTYPE V18 · FIXED SYNTHETIC CONTEXTS**;
- heading: **Open canonical History contexts**;
- body: **These controls open the fixed fictional 17 Aug 2026 history for Monsoon walk note. They do not represent the Journal Days, Source Items, generated fields, or artwork shown elsewhere in the frozen v16 archive.**

The section contains exactly four entries in this order:

| Visible safe fact | Button | Fresh scope |
| --- | --- | --- |
| **Journal Day · 17 Aug 2026** | **History & provenance** | `day-ready` |
| **Source Item · Monsoon walk note** | **View source history** | `item-ready` |
| **Generated field · Summary** | **View Summary history** | `field-ready`, Summary only |
| **Generated Artwork · Artwork version 2** | **View artwork history** | `artwork-ready` |

The visible copy above is Product authority. Design may add stable IDs, `aria-labelledby`, `aria-describedby`, list semantics, and other non-visible accessibility wiring, but may not replace, qualify, merge, or reorder the Product strings or facts.

### 17.3 Native inherited-control boundary

Every inherited contextual v16 control remains native and ineligible for v18. V18 removes all contextual decoration, `data-lid-v18-*` eligibility, text rewriting, capture/bubble interception, and generated-field injection from `#prototype-root` and `#modal-root`. In particular, the frozen 2 Aug day action remains **View day history**, the **Before sleep — synthetic fixture** item action remains **Revisions & provenance**, the artwork action remains **View versions**, and Manage Reflection receives no v18 History button. Activating any of them follows unchanged v16 behavior and never activates v18.

No inherited-root or modal-root observer may search for, decorate, inject, or repair v18 contextual entries. The only permitted inherited event match is the exact generic Settings/More selector `[data-action="settings-related"][data-label="History"]` evaluated at activation time.

### 17.4 Return, evidence, and gate disposition

The existing scope-specific Back labels remain exact: **Back to Settings**, **Back to More**, **Back to Journal Day**, **Back to Source Item**, **Back to Summary**, and **Back to Generated Artwork**. Back and Escape each restore the same connected invoking button, DOM focus, `window.scrollY`, and the invoker's viewport-top coordinate with absolute error no greater than one CSS pixel. A generic **Back to fixture entries** label is rejected.

The evidence roster remains sixteen pairs but frame 16 is replaced, without adding a frame, by `v18-16-canonical-entry-320-forced`. The additive v18 helper must inspect and round-trip all four canonical controls; prove Global is reachable only from native Settings/More; prove the runtime launcher is absent from the visible, hit-test, focus, and accessibility surfaces; record `inheritedContextPatchedCount=0`; and prove the exact 2 Aug / Before sleep negative case. All prior corpus, fixture, scenario, privacy, 0/0/0, and proof-boundary requirements remain.

Product accepts this repair contract at `P=A`; this is conditional authority for new implementation bytes, not acceptance of the failed fingerprint or any evidence made from it. `D=A` and `C=A` take effect only with their reconciled amendments. `I=IP`; `Q=—`; `F=—`; all three target rows remain open and arithmetic remains 19/57 closed and 38/57 open.

## 18. Append-only frame-16 viewport-sequence clarification

Product approves one narrow evidence-procedure clarification. Frame 16 remains the same single `v18-16-canonical-entry-320-forced` evidence pair and retains every C18-21 meaning, scope, copy, entry, return, privacy, and negative-control requirement.

The exact user-visible sequence is: inactive archive at 320×900; inactive resize to 1024×900; one complete visible Settings **History** → Global → **Back to Settings** round trip wholly at 1024×900; inactive resize back to 320×900; one complete compact More **History** → Global → Escape round trip; then canonical Day, Source Item, Summary, and Artwork round trips in their existing order and input/close methods; then the final inactive 320×900 PNG.

Every resize is environment setup between fully consumed trips. It never occurs while a feature is active, a return correction is pending, or another interaction is unfinished. Settings baselines, activation, active-state inspection, return, focus, scroll/top measurements, digest, and counters are all measured at 1024×900. More and all four canonical trips are measured wholly at 320×900.

Viewport never selects or changes application/domain state, fixture, scope, event, filter, disclosure, pagination, corpus, or capture scenario. It changes only the responsive environment and which already-governed native navigation control is actually visible. Every activated control must be visibly rendered, enabled, centre-hit-testable, and present in the accessibility tree at that stage. After a trip baseline is recorded, the helper observes only; it never focuses, scrolls, or compensates before the app's return proof is complete.

The final state must re-prove requested and observed 320×900 at the sidecar top level, desktop Settings hidden, compact More reachable, the canonical panel in one column, no active feature or pending return, and final focus on the Artwork canonical button. Product remains `P=A` for this contract only. Core implementation is producer-stable while evidence work remains `I=IP`; `Q=—`; `F=—`; no count, row, or arithmetic changes.
