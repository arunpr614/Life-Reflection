# Life in Days prototype v18 — History and Provenance UX contract

- **Package:** PVA-013 History and Provenance
- **Version:** v18
- **Authored:** 2026-08-19
- **Owner:** Expert UI/UX Designer agent
- **Status:** Proposed package D-gate contract for Product Council review; no implementation, QA, freeze, persistence, or publication is claimed
- **Inherited executable base:** frozen v17 Atomic Redating
- **Primary closure rows:** `LID-SCP-003`, `LID-VN-006`, `LID-REF-004` — exactly three
- **Experience shell:** Archive Management

This file makes the shared [v17–v35 UX contract](../../phase2/UX-CONTRACT-v17-v35.md) fixture-exact for v18. It is subordinate to the product requirements, frozen completeness tracker, v5 feature audit, shared Product acceptance contract, and the eventual v18 Council decision.

V18 may demonstrate only deterministic fictional frontend rendering and browser-memory interaction. It cannot prove VoiceNotes retrieval or reconciliation, immutable or durable history, trustworthy actor/time evidence, persistence, transactions, export reconstruction, provider behavior, authentication, encryption, deployment, formal accessibility conformance, or production readiness.

## 1. Scope and claim boundary

### 1.1 The three primary outcomes

V18 must make these outcomes observable without double-counting any other requirement:

1. **Source and derived separation — `LID-SCP-003`.** A Source Item, Source Revision, and Correction remain recognizably authentic records. A generated-field version, Visual Brief, and Generated Artwork version remain recognizably Derived Artifacts. Their histories never collapse into one entity type.
2. **Upstream lifecycle — `LID-VN-006`.** A represented upstream revision, untag, or deletion becomes a retained typed status event. A newer revision does not overwrite prior revisions. Untagged or Deleted upstream never silently erases the local Voice Journal.
3. **Reachable Journal Day history — `LID-REF-004`.** Global, Journal Day, Source Item, field, and artwork contexts open a functioning read-only History surface and return to the exact origin. A hidden historical day remains reachable from management History.

### 1.2 Supporting evidence that is not primary closure

- The v17 **Journal Date changed** event appears as inherited redating provenance and regression evidence only. It does not re-close `LID-SRC-003` or `LID-SRC-004`.
- Correction and conflict lineage reuse frozen v15/v16 concepts as read-only history. V18 does not re-close `LID-SRC-001` or `LID-SRC-002`.
- A protected generated-field selection and an artwork-version selection are read-only historical fixtures. They do not close v22 generated-field lifecycle, v25 provider/privacy, or v28 artwork selection/staleness.
- Trash, restore, permanent deletion, Source Suppression, and Artwork Suppression labels are reserved typed-event vocabulary for later versions. V18 does not claim v19 or v20 behavior.
- `LID-VN-005` needs external reconciliation evidence and is not a v18 closure row. V18 may show a neutral **Upstream status unavailable** presentation, but it cannot claim replay-safe reconciliation.
- No invented `LID-HIS-*` requirement is introduced.

### 1.3 Explicit non-goals

V18 does not add mutation controls inside History. It does not activate a historical version, restore an item, select artwork, accept generated text, resolve a conflict, edit a Correction, redate an item, import from VoiceNotes, delete content, export records, or reconstruct a hidden day. Where another accepted surface owns an action, History may offer a navigational return such as **Return to Source Item to review update**; that navigation is not itself the action.

## 2. Highest-risk hierarchy decision

The highest-risk design question is how to preserve event chronology while making Source and Derived history unmistakably separate.

### Approach A — one merged event spine with lane chips

All events appear in one newest-first list. Each card carries a **Source** or **Derived** chip.

- **Benefit:** easiest cross-lane time comparison and smallest page.
- **Risk:** authentic and generated entities become one visual stream; chips become the only separation cue; a Generated Artwork version can be misread as equivalent to a Source Revision. This does not sufficiently satisfy `LID-SCP-003` or the shared requirement for visible and programmatic lanes.

### Approach B — simultaneous side-by-side lane columns

Source history and Derived history appear in parallel columns, each with its own scroll or independent length.

- **Benefit:** strongest visual separation on a large desktop.
- **Risk:** competing vertical time axes imply false alignment, keyboard order becomes hard to predict, one lane may strand large blank regions, and 960/568/390/320 px layouts require a materially different mental model. Independent scroll areas violate the one-page-scroll principle.

### Approach C — stacked named lanes in one page scroll — recommended

Render **Source history** first, followed by **Derived history**, each as its own programmatically named section and newest-first ordered list. Shared scope, filters, count, and boundary copy sit above both. A lane filter may show one section, but **All lanes** preserves Source-first DOM and visual order. No lane is a horizontally scrolling column.

- **Why this wins:** Source truth is encountered first, lane names are structural rather than decorative, each list has an unambiguous chronological axis, and the same DOM/reading order works at 1440, 960, 568×320, 390, and 320 px.
- **Council recommendation:** approve Approach C. Reject a merged spine and independent lane scroll areas for v18.
- **Non-colour rule:** each event repeats its entity type and state in text. Border colour, spine colour, icons, and position are supplementary only.

## 3. Information architecture

### 3.1 Route anatomy and DOM order

The v18 capsule is one focused History route with in-memory scope and inspection state. Its DOM and reading order is fixed:

1. skip link to the v18 main landmark;
2. inherited Life in Days top bar;
3. **Back to _origin_** action, theme action, and **Prototype v18 · synthetic** label;
4. context eyebrow **Management / History & provenance**;
5. one scope-specific `h1` and lede;
6. persistent boundary callout **Read-only prototype history**;
7. scope summary with Journal Date/entity/current-state facts;
8. hidden-day banner when applicable;
9. active-filter summary and filter controls;
10. results heading and represented event count;
11. **Source history** section and newest-first ordered list;
12. **Derived history** section and newest-first ordered list;
13. per-lane **Load earlier … events** control or beginning-of-history message;
14. prototype-state console after the complete task content;
15. prototype boundary footer.

No event card, provenance disclosure, filter group, or fixture console receives an independent scrolling region. The document owns the single page scroll.

### 3.2 Entry and return matrix

| Origin | Exact invoker | Initial scope and h1 | Exact Back label | Return target |
| --- | --- | --- | --- | --- |
| Settings or compact More | **History** | Global / **History & provenance** | **Back to Settings** or **Back to More** | Same History invoker, selected Settings/More state, and useful scroll position |
| Journal Day | **History & provenance** | Day / **History for 17 August 2026** | **Back to Journal Day** | Same day, selected media/source context, invoker, and scroll |
| Source Item | **View source history** | Item / **History for Monsoon walk note** | **Back to Source Item** | Exact Source Item card and invoking action |
| Title, Summary, or Tags | **View _field_ history** | Field / **Summary history** or corresponding field | **Back to Summary** | Exact generated-field card, state, and invoking action |
| Generated Artwork | **View artwork history** | Artwork / **Artwork history** | **Back to Generated Artwork** | Exact artwork card/version and invoking action |
| Global History event | **Open historical day** | Hidden day / **History for 12 August 2026** | **Back to History** | Exact event link, filters, expanded details, and scroll |
| V17 completed-change provenance | **View complete history** | Item or day, as explicitly named by the invoker | **Back to completed change** | V17 completion heading with its in-memory result intact |

Every launch context is passed in live memory. The path remains the generic `index-v18.html`; query, hash, document title, and `history.state` contain no scope, date, item, field, artwork, fixture, event, or filter value.

### 3.3 Scope summary

The summary precedes filters so the owner always knows which history is being viewed. It is a definition list, not a card grid.

| Scope | Required facts |
| --- | --- |
| Global | **Scope — Entire represented archive**; **Order — Newest represented event first**; **Timezone — Asia/Kolkata** |
| Journal Day | Journal Date; ordinary visibility; live Source Item count; selected Calendar Cover state; **Scope — This Journal Day** |
| Source Item | Source type; human-readable item label; immutable Original Timestamp; current Journal Date; displayed record; current upstream status |
| Field | Journal Date; field name; entity type **Derived Artifact**; current version label; Protected/current/stale state; exact source-set label |
| Artwork | Journal Date; entity type **Generated Artwork**; Active/Historical/Stale state; brief label; exact source-set label; Calendar Cover effect |
| Hidden day | Journal Date; **Ordinary visibility — Hidden**; **Live Source Items — 0**; retained Source and Derived event counts |

Fixture handles, database IDs, provider request IDs, reconciliation cursors, checksums, and opaque production identifiers are not summary facts.

## 4. Lane and event model

### 4.1 Lane headings

The two lane headings and helper copy are exact:

- **Source history** — **Source Items, Source Revisions, Corrections, Journal Dates, and upstream lifecycle. Authentic records stay separate and unchanged.**
- **Derived history** — **Generated field, Visual Brief, and Generated Artwork versions linked to exact represented source sets. They never replace Source history.**

Each lane is a `<section aria-labelledby>` containing an `<ol>`. A visible note immediately before each list reads **Newest represented event first**. The lane is named in the heading, each event repeats its entity type, and the accessible event name includes the lane. Lane distinction never depends on green/orange styling or left/right position.

### 4.2 Event card anatomy

Every event uses the same information sequence:

1. visible lane word: **Source history** or **Derived history**;
2. typed event heading (`h3`);
3. explicit state text such as **Current**, **Historical**, **Revised upstream**, **Conflict**, **Protected Field**, **Stale**, or **Active Artwork**;
4. semantic `<time datetime="…">` with an `Asia/Kolkata` visible value and nearby **Synthetic time** label;
5. affected entity type and human-readable fictional label;
6. actor/source class;
7. one-sentence consequence stating what changed and what remained retained;
8. native disclosure summary **View complete provenance**;
9. safe relation links **Preceded by …** and **Followed by …** when those events exist;
10. optional safe navigation back to the owning current surface, never an activation control.

The list card may use a quiet vertical spine, but ordered-list semantics and headings carry the chronology. Icons are `aria-hidden`; state words remain visible.

### 4.3 Complete provenance disclosure

Expanding **View complete provenance** reveals a definition list directly beneath that event. It does not open a nested scroller or modal. Multiple disclosures may remain open for comparison.

Required facts, when applicable:

- event type and current/historical state;
- entity type: Source Item, Source Revision, Correction, Derived Artifact version, Visual Brief version, or Generated Artwork version;
- human-readable version label such as **Voice R2**, **Correction 1**, **Summary V2**, or **Artwork V2**;
- represented event time and actor/source class;
- Journal Date before/after when the event is redating;
- immutable Original Timestamp for Source Item events;
- displayed/current relationship;
- predecessor and successor event labels;
- Correction base and prior-Correction lineage;
- exact fictional source-set labels for a Derived Artifact;
- trigger class, template/brief version, and safe outcome class for generated material;
- safe fictional provider label, requested/returned option when represented, simulated cost, and safety state for a derived record;
- retained facts and explicit non-effect.

Provider labels, if shown, are exactly **Text Provider A — synthetic fixture** and **Artwork Provider A — synthetic fixture**. They are not called qualified, connected, available, healthy, or selected for production. Prompt text, journal text, photo data, raw requests/responses, credentials, tokens, provider request IDs, production model names, and internal record IDs never appear.

### 4.4 Typed event vocabulary

| Lane | Exact event heading | Required visible consequence | State vocabulary |
| --- | --- | --- | --- |
| Source | **Source Item captured** | A fictional local Source Item was represented; no VoiceNotes or upload operation is claimed | Current / Historical |
| Source | **Source Revision received** | A newer represented revision was retained; prior revisions remain retained | Current / Historical / Revised upstream |
| Source | **Upstream status changed** | The VoiceNotes status became Untagged upstream or Deleted upstream; the local Voice Journal remained | Untagged upstream / Deleted upstream |
| Source | **Correction created** | The Correction became displayed against its named base; source revisions were unchanged | Correction displayed / Historical |
| Source | **Correction made historical** | A prior Correction was retained and no source record was deleted | Historical |
| Source | **Source conflict detected** | The displayed Correction stayed displayed; nothing was merged automatically | Conflict |
| Source | **Source conflict resolved** | The exact selected display outcome is named; all Source Revisions and Corrections remain retained | Current / Historical |
| Source | **Journal Date changed** | The Source Item moved from one Journal Date to another in the represented v17 result; Original Timestamp stayed unchanged | Current / Historical |
| Derived | **Generated field version created** | One Title, Summary, or Tags version was linked to its exact represented source set | Current / Historical / Stale |
| Derived | **Protected field version selected** | The selected fictional version became current; the prior version remained Historical and the field remained Protected | Protected Field / Current / Historical |
| Derived | **Visual Brief version created** | A fictional brief version was linked to its source set; no artwork request is claimed | Current / Historical / Stale |
| Derived | **Generated Artwork version created** | One fictional non-photorealistic artwork version was represented; it remains labeled AI-generated artwork | AI-generated artwork / Current / Historical / Stale |
| Derived | **Artwork version selected** | One version became Active Artwork in the represented event; all other versions remained Historical | Active Artwork / Historical |
| Derived | **Artwork became historical** | An invalidated or superseded version remained retained and stopped being active | Historical / Stale |

Later v19/v20 capsules may supply **Item moved to Trash**, **Item restored**, **Item permanently deleted**, **Suppression created**, and **Suppression removed** events to the same renderer. Their presence in the vocabulary does not make those actions executable or complete in v18.

## 5. Upstream lifecycle contract

### 5.1 Revised upstream

The normal represented sequence is explicit:

1. **Voice R1** is retained.
2. **Source Revision received** adds **Voice R2** at **17 August 2026 · 9:42 pm IST · synthetic**.
3. If no Correction competes, **Voice R2** may be labeled displayed/current and **Voice R1** becomes Historical.
4. If **Correction 1** competes, the Correction stays displayed, **Voice R2** is **Revised upstream · not displayed**, and a separate **Source conflict detected** event follows. Nothing is merged.
5. The selected event exposes its predecessor and successor without editing either record.

Exact consequence copy: **A newer VoiceNotes revision was represented. The prior Source Revision remains Historical. Nothing was overwritten.**

### 5.2 Untagged upstream

The local Source Item remains present and its displayed Source Revision or Correction does not change merely because the upstream tag changes.

- event heading: **Upstream status changed**;
- state: **Untagged upstream**;
- actor/source: **VoiceNotes upstream · simulated**;
- exact consequence: **VoiceNotes no longer showed the required tag in this synthetic state. The local Voice Journal and every retained Source Revision remain in Life in Days.**

There is no **Remove**, **Re-import**, or **Delete** action in this event.

### 5.3 Deleted upstream

Upstream deletion is a status, not local deletion.

- event heading: **Upstream status changed**;
- state: **Deleted upstream**;
- actor/source: **VoiceNotes upstream · simulated**;
- exact consequence: **VoiceNotes showed this note as deleted upstream in this synthetic state. The local Voice Journal and every retained Source Revision remain unchanged.**

No card says deleted locally, moved to Trash, permanently deleted, removed from Calendar, or erased. The local Journal Day follows its own live-source rules.

### 5.4 Unknown or incomplete upstream evidence

An unavailable or partial represented result must not create Untagged upstream or Deleted upstream truth.

- heading: **Upstream status unavailable**;
- body: **This prototype does not have a complete upstream result. No upstream-status event was added, and the local Voice Journal remains unchanged.**
- action: **Retry represented status check**;
- boundary: the retry is an in-memory fixture transition and does not prove VoiceNotes reconciliation.

## 6. Scope-specific experience contracts

### 6.1 Global History

Global History is the management index and the only v18 surface that can discover a hidden historical day. It opens from inherited **History** in Settings or compact More.

- `h1`: **History & provenance**.
- lede: **Review represented changes across the archive. Source and Derived histories stay separate, and viewing never changes what is current.**
- default scope: all represented events, all lanes, all states, no date filter, newest first.
- default rendering: Source history section first, Derived history second.
- hidden-day event action: **Open historical day**.
- no recent memories, suggestions, heat map, calendar mosaic, analytics, or activity score.

### 6.2 Journal Day History

Journal Day History is scoped before rendering; filters cannot escape to another day.

- `h1`: **History for 17 August 2026**.
- summary names live/hidden state, live Source Item count, current cover state, and both lane counts.
- Source events cover items, revisions, Corrections, redating, and upstream lifecycle for that day.
- Derived events cover field, brief, and artwork versions bound to source sets on that day.
- the original Journal Day remains available behind **Back to Journal Day**; reading History never changes its cover, sources, or fields.

### 6.3 Source Item History

- `h1`: **History for Monsoon walk note**.
- summary names **Voice Journal**, current Journal Date, immutable Original Timestamp, displayed record, upstream status, and conflict state.
- Source history includes every represented Source Revision, Correction, upstream-status event, conflict event, and redating event for the item.
- Derived history includes only artifacts whose source-set facts contain this Source Item; the UI says **Related through represented source binding**, never that the artifact is a revision of the Source Item.
- current conflicts may offer **Return to Source Item to review update**. The History route itself contains no resolution choice.

### 6.4 Field History

- `h1`: **Summary history** (or **Title history** / **Tags history** from the exact invoker).
- visible entity type: **Derived Artifact · Summary**.
- list facts: version label, Current/Historical/Stale state, Protected Field state, source-set label, represented time, trigger class, and preceding/following version.
- a **Protected field version selected** fixture shows the selected version as current and its predecessor as Historical.
- there is no **Use version**, **Keep**, **Edit**, or **Resume automatic updates** action in v18. Those belong to v22.

### 6.5 Artwork History

- `h1`: **Artwork history**.
- every version repeats **AI-generated artwork** in visible and accessible text.
- list facts: Artwork version, Active/Historical/Stale state, trigger, Visual Brief version, exact fictional source-set labels, safe synthetic provider/configuration, simulated cost, safety state, and Calendar Cover effect.
- an **Artwork version selected** fixture shows one Active Artwork and its predecessor Historical.
- viewing the historical version does not select it. No **Make active**, **Retry**, **Generate**, or **Regenerate brief** action appears in v18; v26–v28 own those decisions.

### 6.6 Hidden historical day

The hidden-day route is reachable only from global management History or another explicit history relationship. It never appears as a live Calendar/Almanac destination.

The first content after the page header is a neutral banner with exact heading:

> **Historical day — not shown in Calendar or Almanac**

Exact body:

> **This Journal Day has no live Source Items in the represented state. Retained Source and Derived history remains available here. Viewing it does not restore the day.**

Required behavior:

- one Journal Date heading and no current Calendar Cover claim;
- Source history and Derived history remain separate;
- retained historical facts are inspectable;
- no ordinary live Source card, gallery, reflection, current-cover tile, or restoration control is fabricated;
- **Back to History** returns to the exact global event, active filters, expanded disclosure, and scroll.

## 7. Filters, ordering, and progressive loading

### 7.1 Exact filters

All filters are explicit form controls applied only after **Apply filters**:

| Control | Values |
| --- | --- |
| **History lane** | All lanes; Source history; Derived history |
| **Event type** | All event types; Source revisions; Corrections and conflicts; Journal Date changes; Upstream lifecycle; Generated fields; Visual Briefs; Generated Artwork |
| **State** | All states; Current; Historical; Needs attention |
| **Journal Date** | Optional native exact-date input; present only in Global History |

The filter form never searches event body text. V21 owns lexical Search and Include history behavior.

Above the results, an always-visible summary follows this pattern:

> **12 represented events · All lanes · All states**

With filters:

> **3 represented events · Source history · Needs attention · 17 August 2026**

**Clear filters** is visible whenever any non-default filter is active. Clearing restores defaults without changing scope.

### 7.2 Responsive filter presentation

- At 1024 px and above, filters occupy a quiet 240–272 px supporting rail beside the single content column. The rail may be sticky within the viewport but never scrolls independently.
- Below 1024 px, a native disclosure summary **Filter history** sits immediately after the active-filter summary. Its fields stack in document flow; it is not a modal and does not trap focus.
- The disclosure summary appends the number of active filters, for example **Filter history · 2 active**.
- Active-filter text and **Clear filters** remain visible even when the disclosure is closed.

### 7.3 Ordering

Events are reverse chronological inside each lane: newest represented event first. Equal timestamps use a stable fictional event-sequence order that is not exposed as an internal ID. The UI does not offer an order toggle in v18.

Predecessor/follower links express lineage rather than relying on list adjacency. Activating a relation link scrolls its target event heading into view and moves focus there without opening or selecting a version.

### 7.4 Load earlier events

Each non-empty lane owns a separate control:

- **Load earlier Source events**;
- **Load earlier Derived events**.

On activation:

1. keep already rendered events readable;
2. set `aria-busy="true"` only on that lane;
3. change the control label to **Loading earlier … events…** and disable only that control;
4. append the next deterministic page before the control;
5. restore focus to the same control and compensate scroll so its visual anchor does not jump;
6. announce only **3 earlier Source events added** or the exact bounded count;
7. preserve filters, open disclosures, other-lane state, and current scope.

At the end, replace the control with static text **Beginning of represented Source history** or **Beginning of represented Derived history**. Loading earlier never changes current state and never places event content in a live region.

## 8. Complete state contract and exact content

| State | Heading and body | Action/focus result |
| --- | --- | --- |
| Initial loading | **Loading history** / **Preparing separate Source and Derived event lists from synthetic browser-memory fixtures.** | Main `h1` receives entry focus; lane region is busy; no animated shimmer is required |
| Loaded | Scope-specific `h1`; represented count; one or both lanes | Entry focus remains on `h1`; no automatic jump to events |
| Global empty | **No represented history yet** / **This synthetic archive scope has no events. Nothing was deleted.** | **Back to Settings** remains available |
| Day empty | **No history for this Journal Day** / **No represented events match this Journal Day.** | **Back to Journal Day** |
| Item empty | **No history for this Source Item** / **No represented events match this Source Item.** | **Back to Source Item** |
| Field empty | **No versions for this field** / **No represented Derived Artifact versions match this field.** | **Back to _field_** |
| Artwork empty | **No Generated Artwork history** / **No represented artwork versions match this scope.** | **Back to Generated Artwork** |
| Filtered empty | **No events match these filters** / **Try clearing one filter. History was not changed.** | **Clear filters**; then focus results heading |
| Initial error | **History could not be loaded** / **The current archive view is unchanged. Try again.** | **Retry loading history**; known failure preserves scope and origin |
| Earlier-page error | **Earlier events could not be loaded** / **The events already shown remain available.** | **Retry loading earlier Source events** or Derived equivalent; focus stays at retry |
| Upstream unknown | **Upstream status unavailable** / exact copy from §5.4 | Retry represented status check; no status event added |
| Hidden day | exact banner from §6.6 | Read-only lane inspection; Back restores global History context |
| Interrupted | **Connection interrupted** / **The history already shown remains readable. Earlier events were not added.** | **Retry loading earlier events** after reconnect; no current/history mutation |

Errors use an assertive region only for the short heading and recovery action. Event text, item labels, dates, version labels, and provenance facts are not repeated in a live region.

## 9. Interaction, focus, and navigation contract

### 9.1 Entry, Back, and Escape

- Opening v18 records the exact invoker and archive scroll, clears prior v18 scope/filter/inspection state, renders the new scope, scrolls to the top without smooth motion, and focuses the v18 `h1`.
- The visible Back action always names its origin. It restores the exact invoker, prior selected context, and useful scroll. Global/automatic opening returns to the integrated v18 launcher.
- Escape closes an open v18 feature only when no nested disclosure action is in progress. A native details disclosure simply remains in document flow; Escape does not unexpectedly collapse it.
- Browser Back/Forward is not used as a private scope store and never replays a mutation. No v18 effect is available to replay.
- Direct links to frozen earlier indexes remain archival exits, not the ordinary return path.

### 9.2 Filters and rerender

- Toggling the compact filter disclosure keeps focus on its summary.
- **Apply filters** rerenders both lanes, closes the compact disclosure, focuses the results heading, and announces only the represented event count.
- **Clear filters** restores defaults, focuses the results heading, and announces the new count.
- Empty results retain the filter summary and put the empty-state heading immediately after the results heading.
- Theme changes, filter changes, disclosure expansion, and fixture changes preserve the equivalent focused control by stable focus key; text-capable controls preserve selection when possible.

### 9.3 Provenance disclosure and relationship links

- The native disclosure summary is keyboard-operable and retains focus when opened/closed.
- Opening provenance announces nothing; the content follows immediately in reading order.
- **Preceded by** / **Followed by** moves focus to the target `h3` with `tabindex="-1"`, scrolls it with `block: nearest`, and does not expand, activate, or make current that event.
- A hidden-day link focuses the hidden-day `h1`; **Back to History** returns to the exact link and restores expanded disclosures.
- Loading, filtering, and theme rerenders do not reset focus to the page or first event.

### 9.4 Read-only guard

History controls may navigate, filter, expand, retry a synthetic load, or load an earlier deterministic page. No control is named **Select**, **Activate**, **Make current**, **Restore**, **Delete**, **Use version**, **Resolve**, **Accept**, **Edit**, or **Regenerate**. A selected/active state in History is a fact, not a button state.

## 10. Responsive contract

The same Source-first DOM order and one-page scroll applies at every viewport. No layout uses a table or horizontal overflow.

### 10.1 1440×900 — wide

- Main container is no wider than 1380 px with comfortable outer gutters.
- Page header and boundary callout may share one row.
- A 240–272 px filter rail sits beside a 720–860 px history reading column; unused space remains calm rather than stretching cards across the screen.
- Source history and Derived history remain stacked, never parallel columns.
- Event header may use two columns: event identity/consequence first, timestamp/state facts second. DOM order remains identity then facts.
- Provenance definition lists may use two columns but labels and values remain paired.

### 10.2 960×900 — medium

- Header, scope summary, filters, and lane lists become one dominant column.
- Filters use the inline **Filter history** disclosure with active summary always visible.
- Event header may retain a compact metadata column only if no value wraps beneath the wrong label; otherwise it stacks.
- Relation links wrap as ordinary links, never a clipped toolbar.

### 10.3 568×320 — compact landscape

- Top bar is static, not sticky, to preserve vertical working space.
- Brand, theme, and Back actions wrap without covering the `h1` or focused content.
- Filter disclosure is closed by default and all operations remain reachable through page scroll.
- Each event is one column; state and synthetic time precede the consequence; provenance facts stack label then value.
- Load earlier and retry controls are at least 44 px high and remain fully visible without a sticky footer.
- No orientation lock, nested scroller, clipped disclosure, or hidden Back action.

### 10.4 390×844 — compact portrait

- One 12–16 px guttered column.
- Back and theme controls form a two-control row when labels fit; otherwise they stack.
- Scope definition rows stack only where values would fall below a useful reading width.
- Every event title, label, safe synthetic version name, and relation link wraps without ellipsis.
- Active-filter summary precedes the filter disclosure; Source lane precedes Derived lane.
- Full-width primary compact controls are preferred.

### 10.5 320×900 — narrow compact

- Top-bar actions, filters, provenance facts, and event relations are one column.
- Headings use fluid sizes but never shrink essential metadata below 13 px.
- No event-card indentation reduces the content column below approximately 272 px; the decorative spine moves to the card border or disappears.
- Long unbroken synthetic tokens use `overflow-wrap: anywhere`; no horizontal page scroll is permitted.
- Touch/click targets are at least 24×24 CSS px and all primary/filter/Back/load controls target 44×44 px.

### 10.6 Zoom and reflow

- At native 200% text zoom and 400% page zoom, if directly reproducible, the UI retains the compact order, all labels, Back, filters, load controls, and disclosures.
- A viewport-only substitute is reported as **reflow-equivalent**, never as native zoom evidence.
- Wide layouts preserve DOM order when columns collapse. No content is duplicated for desktop/mobile presentation.

## 11. Accessibility contract

### 11.1 Structure and semantics

- Exactly one v18 `h1`, one main landmark, logical `h2` lane headings, event `h3`s, a skip link, and a navigation landmark for Back/relationship actions.
- Each lane is a named section with a real ordered list. Events are list items/articles; no ARIA grid, tree, feed, or data table is introduced.
- Every represented timestamp uses `<time>` plus visible **Synthetic time**. `datetime` values may use fictional ISO instants but never private production timestamps.
- Current/Historical, Source/Derived, Conflict, Stale, Untagged upstream, Deleted upstream, Protected Field, and AI-generated artwork are words in visible and accessible content, not colour-only states.
- Definition terms and values retain their relationship at every width.

### 11.2 Keyboard and focus

- All links, buttons, native disclosures, form fields, and select controls are keyboard-operable with native Enter/Space behavior.
- Focus indicators meet the 3:1 non-text target against light, dark, warning, hidden-day, event, and forced-colour surfaces.
- No roving-tabindex event spine is required. Tab order follows document order: filters, Source events, Source load, Derived events, Derived load, console.
- Rerender and load-more restore a stable focus anchor. Return navigation restores the exact invoker.
- Any future modal action reached from History must be a separate owning flow with heading focus, trap, safe Escape, safe action before confirming action, and return to its invoker; v18 itself adds no such modal.

### 11.3 Announcements

- Entry does not announce the event list; the focused `h1` provides context.
- Filter apply announces only **_n_ represented events**.
- Load earlier announces only the number and lane added.
- A known error announces its short heading and named retry once.
- Historical content, journal-like text, timestamps, source labels, version labels, actor labels, provider facts, and relationship details never enter a live region.
- No decorative loading animation or timeline motion is required to understand state.

### 11.4 Text, targets, and contrast

- New/modified essential metadata, filter summaries, timestamps, status labels, errors, and helper text are at least 13 px.
- Normal text targets 4.5:1; large text 3:1; meaningful boundaries, controls, and focus 3:1 in both themes.
- Controls satisfy at least 24×24 px; Back, Apply/Clear, Retry, Filter summary, disclosure summaries, relation links with button styling, and Load earlier prefer 44 px on compact screens.
- Meaning does not depend on hover, colour, animation, the event spine, icon shape, or visual proximity alone.

## 12. Visual, theme, motion, and forced-colour contract

### 12.1 Calm archival treatment

- Inherit v17 warm-paper light tokens, deep-ink dark tokens, restrained serif display headings, sans-serif operating text, quiet boundaries, and minimal chrome.
- Do not use a dashboard tile wall, activity heat map, gamified streak, avatar feed, social timeline, faux scrapbook, or consumer audit-log terminal.
- Source history may use a quiet solid spine and Derived history a quiet dashed or alternate border, but lane headings and text remain authoritative.
- Current state is not automatically green; Historical is not disabled grey; Deleted upstream is not styled as local destructive deletion.
- Only interpretation-changing labels are badge-like. Ordinary actor/time/type metadata remains plain text.

### 12.2 Light and dark

- Cards use surface/background tokens rather than pure white/black.
- Muted metadata remains readable at the required contrast; essential facts never use the faintest token.
- Warning/Conflict/Untagged/Deleted states pair icon or border with exact text.
- Links remain distinguishable by underline or another persistent non-colour cue.
- The page is reviewed in both explicit light/dark prototype themes and device-colour preference where supported.

### 12.3 Reduced motion

- `prefers-reduced-motion: reduce` removes smooth scrolling, crossfades, accordion animation, spine drawing, and loading animation.
- Filter, details, relationship, load-more, theme, and route transitions remain immediate and understandable.
- Focus movement never depends on animation completion.

### 12.4 Forced colours

- Sections, event cards, disclosures, controls, current/historical labels, warning states, and focus use system colours with `forced-color-adjust: auto`.
- The Source/Derived distinction survives through headings and text if every decorative border becomes the same colour.
- Selected/current state uses text and a system-colour boundary; it never relies on filled brand colour.
- Decorative spine/icons may disappear without information loss.

## 13. Privacy and prototype-truth contract

### 13.1 Permitted fixture content

Only deterministic fictional labels and safe facts may appear, including:

- **Monsoon walk note**, **Before sleep — synthetic fixture**, and explicitly fictional Journal Dates/timestamps;
- **Voice R1**, **Voice R2**, **Correction 1**, **Summary V1/V2**, **Brief V1/V2**, **Artwork V1/V2**;
- **Archive owner · simulated**, **VoiceNotes upstream · simulated**, **Life in Days rule · simulated**, **Text generation lane · simulated**, **Artwork generation lane · simulated**;
- **Text Provider A — synthetic fixture** and **Artwork Provider A — synthetic fixture** only when safe derived provenance requires a provider label.

No real journal, caption, photo, accessibility description, timestamp, filename, account identity, provider/model name, prompt, request/response, credential, token, opaque source ID, signed URL, recovery material, or production error is permitted.

### 13.2 Browser and evidence privacy

Scope, filters, event identities, version labels, expanded disclosures, source binding, hidden-day date, and fixture state remain live-memory only and are absent from:

- URL path additions, query, and hash;
- document title;
- browser-history payload;
- localStorage, sessionStorage, IndexedDB, Cache Storage, service-worker cache, and OPFS;
- clipboard;
- requests, referrers, analytics, telemetry, crash reports, console, error payloads, notification-shaped UI, and log-shaped UI;
- unrelated DOM IDs, CSS selectors, accessible names, and live regions.

The generic document title remains **Life in Days**. The route uses localhost assets only during prototype evidence. Reload clears open v18 filter and inspection state.

### 13.3 Required boundary copy

Near the `h1`:

> **Read-only prototype history**  
> **Fictional deterministic events in this open page. Viewing changes no current state.**

Footer:

> **Prototype boundary**  
> **This surface does not verify VoiceNotes retrieval or reconciliation, durable or immutable history, trustworthy actor/time evidence, provider execution, persistence, export reconstruction, authentication, encryption, deployment, formal accessibility conformance, or production readiness.**

Success-like event copy says **represented**, **in this synthetic state**, or **in this open page**. It never says saved, synced, imported, secured, permanently retained, or verified unless immediately scoped as a fictional representation.

## 14. Deterministic UX fixture roster

The implementation/Council fixture matrix may add exact cardinality and hashes, but it must provide at least these named UX states without private data:

1. **global-loaded-all** — both lanes, every required v18 typed-event family, no active filter;
2. **day-loaded** — Journal Day scope with Source and Derived relationships;
3. **item-revised-upstream** — R1→R2, predecessor/follower, no Correction;
4. **item-conflict-lineage** — R1, Correction 1, R2, unresolved conflict, nothing merged;
5. **item-untagged-upstream** — local Voice Journal retained;
6. **item-deleted-upstream** — local Voice Journal and revisions retained;
7. **upstream-status-unavailable** — no inferred lifecycle event;
8. **field-protected-selection** — current and Historical Summary versions with Protected Field state;
9. **artwork-selection** — Artwork V2 Active, Artwork V1 Historical, persistent AI-generated artwork labels;
10. **redating-event** — inherited v17 Journal Date change and unchanged Original Timestamp;
11. **hidden-day** — exact Historical day banner with both retained lanes;
12. **filtered-empty** — active filters preserved, clear action;
13. **initial-loading**;
14. **initial-error-retry**;
15. **load-earlier-pending**;
16. **load-earlier-error-retry**;
17. **load-earlier-success** — exact bounded addition with focus/scroll anchor;
18. **empty-global**, plus scope-specific empty copy reachable through the QA surface;
19. **long-safe-metadata** — wrapping stress with fictional text and one unbroken synthetic token;
20. **all-history-beginning** — both lane end messages and no disabled dead control.

Fixture switching is a prototype-only console after the task in DOM and visual order. It resets v18 state to exact authority, never writes the fixture to the URL/storage, and uses pressed-state text plus `aria-pressed`, not colour alone.

## 15. V18 design acceptance checklist

The Design gate can be approved only if the exact candidate demonstrates all of the following:

- [ ] One functioning reusable v18 History route opens globally and from Journal Day, Source Item, field, and artwork contexts.
- [ ] Back restores the exact origin, invoker, selected context, useful scroll, filters, and disclosure state as applicable.
- [ ] Source history precedes Derived history in DOM, visual, keyboard, and screen-reader order when both are shown.
- [ ] Both lanes are named by headings and repeated in event accessible names; no distinction depends on colour or columns.
- [ ] Events are typed, newest first within each lane, use headings and `<time>`, and expose actor/source, state, retained facts, predecessor, and follower.
- [ ] R1→R2, Correction/conflict lineage, Untagged upstream, Deleted upstream, unknown upstream, redating, protected-field selection, and artwork-version selection are all observable with fictional fixtures.
- [ ] Untagged/Deleted upstream never removes or relabels the local Voice Journal as deleted locally.
- [ ] A historical day is reachable and uses the exact **Historical day — not shown in Calendar or Almanac** banner.
- [ ] Viewing/expanding/navigating history changes no current Source or Derived state and exposes no activation/restoration/mutation control.
- [ ] Filters have explicit Apply/Clear behavior, active summaries, deterministic empty states, and no text search.
- [ ] Load earlier preserves existing content, filter/disclosure state, focus, and visual scroll anchor; announcements contain only bounded counts.
- [ ] Initial loading, loaded, every scope empty, filtered empty, initial failure/retry, interrupted, earlier-page pending/failure/retry/success, unknown upstream, hidden day, and beginning-of-history states are reachable.
- [ ] 1440×900, 960×900, 568×320, 390×844, and 320×900 render without horizontal page scrolling, overlap, clipped controls, or nested scroll traps.
- [ ] Light, dark, reduced-motion, and forced-colour modes preserve meaning; all new essential metadata is at least 13 px.
- [ ] Keyboard, visible focus, one `h1`, logical headings, ordered lists, definition pairs, target sizes, relation-link focus, and restrained live regions satisfy this contract.
- [ ] URL/title/history/storage/clipboard/network/console/live-region inspections contain no private or fixture state and requests remain local-only.
- [ ] The UI repeatedly labels prototype/synthetic truth and makes no backend, provider, persistence, VoiceNotes, security, deployment, accessibility-conformance, or production claim.
- [ ] The closure claim names exactly `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004`.

## 16. Required design evidence

The eventual independent QA roster should include, at minimum:

- 1440 light global loaded with both lanes and wide filter rail;
- 1440 dark item conflict lineage with provenance expanded;
- 960 light revised-upstream or untagged-upstream state;
- 960 dark field protected-selection state;
- 390 dark artwork-selection state;
- 390 light hidden historical day;
- 568×320 light load-earlier pending or error with every action reachable;
- 320 forced-colours global/filtered state;
- 320 reduced-motion upstream Deleted state or long-safe-metadata stress;
- a loaded-to-filtered-empty-to-clear live path;
- a load-earlier success path proving focus and scroll anchoring;
- every entry/Back pair and relation-link focus path;
- exact URL/title/history/storage/network/console privacy inspection;
- inherited v17 Atomic Redating and representative frozen archive regressions.

Evidence captured without native zoom may establish only viewport/reflow-equivalent behavior and must be labeled that way. A screenshot proves appearance at one moment, not persistence, VoiceNotes behavior, immutable history, provider execution, production privacy, or formal accessibility conformance.

## 17. Append-only pre-hold Current source context and loading UX amendment

Design approved this narrow clarification on 2026-08-19 before candidate hold. It preserves the prior UX proposal and Council dispositions as history while making the context-to-prose relationship and the top-level initial-loading accessibility tree deterministic. It adds no new scope, fixture, event, control, or closure claim.

### 17.1 Current source context variants

Only Day and Source Item task content may render the **Current source context** section, before filters and outside every event list. Its safe exported selector is `sourceContextVariant`:

- `revision-2` applies only when `upstream-revised` owns the current Day/Item task, including its in-scope filter, disclosure, relation, status, loading, failure, interruption, empty, retry, and pagination descendants. Its exact visible prose is **Fictional Revision 2 — Rain softened the path beneath the paper lanterns; the synthetic narrator counted three quiet puddles before walking home.**
- `correction-1` applies to every other Day/Item owner and its in-scope descendants. Its exact visible prose remains **Fictional Correction 1 — A rain-washed path curved past paper lanterns; the synthetic narrator paused beside three quiet puddles before heading home.**
- `none` applies to Global, generated-field, artwork, hidden-day, archive, and every non-Day/Item scope. The section is absent.

The owning fixture/scope, not the currently focused event, event text, filter, or transient branch, selects the variant. The section remains at the existing 60–72-character reading measure, stays readable during its in-scope unavailable states, and never moves into a lane, event card, disclosure, modal, tooltip, or live region.

For `upstream-revised`, the Source list is exactly `E04,E01`. Revision 2 is visibly **Displayed**, **Current upstream**, and **Revised upstream**; Revision 1 is Historical. The page contains no Correction, Revision 3, conflict, Untagged, Deleted, or Derived-lane content. This narrower fixture does not alter the complete corpus.

### 17.2 Top-level initial-loading accessibility tree

The exact top-level `loading` fixture is Global and exports `sourceContextVariant=none`. Its task order is:

1. page header with `h1` **History & provenance**, holding entry focus;
2. read-only boundary and Global scope summary;
3. the existing filter presentation; and
4. a named **Source history** lane region whose own node, and only that lane node, has `aria-busy="true"`.

The Source region contains the existing heading **Loading history** and exact body **Preparing separate Source and Derived event lists from synthetic browser-memory fixtures.** It uses a static safe status, not an animated shimmer or event-shaped placeholder. It contains no `<ol>`, event heading, time, actor, record label, provenance, source prose, or final represented count. The Derived history region is absent in this exact fresh-load fixture. It is not rendered as an empty/error lane and is not marked busy.

This does not weaken progressive-loading behavior: during an earlier-page load, the affected existing lane alone is busy and the other rendered lane remains present and unchanged. During a Day/Item initial-load descendant, Current source context remains before filters using the owning variant, while the affected lane follows the same named-region busy rule.

### 17.3 Privacy, export, and Design disposition

The DOM may contain the selected exact prose only inside the visible Current source context paragraph. Structured snapshots, snapshot summaries, evidence JSON, scenario transcripts, URL/history/storage, requests, console/exceptions, and live regions expose only the safe `sourceContextVariant` token and never either prose string. A PNG may naturally show the visible paragraph.

Design retains `D=A` for this contract-only clarification. Implementation remains `I=IP`; independent QA and freeze remain unstarted.

## 18. Append-only pre-hold disclosure and app-owned anchor amendment

Design approved this final narrow amendment before candidate hold. It preserves all prior interaction, responsive, privacy, evidence, fixture, scenario, corpus, closure, and read-only decisions.

### 18.1 Fresh disclosure, entry focus, and preservation

Fresh `item-ready` exports `openDisclosureKeys=['E12']`; all other thirteen top-level fixtures export `openDisclosureKeys=[]`. The `E12` native `<details data-lid-v18-event-details="E12">` is rendered with its `open` attribute already present. Within it, the provenance definition list is followed by the heading **Event sequence** and its relations, then **Record lineage** and its relations. No accordion animation, programmatic click, or live announcement opens it.

The fresh entry sequence remains deterministic: set the document scroll position to `0,0` without smooth motion, render the already-open disclosure, focus `h1` **History for Monsoon walk note**, and leave the live region empty. The frame-3 selector is exactly `[data-lid-v18-event-details="E12"]`; the v18 driver may use it only after recording that entry state and only to scroll the already-open details into the capture viewport. Selector handling neither toggles `open`, moves focus from the `h1`, nor writes to a live region. Frame 3 remains a fixture capture with `scenario=null`.

Native summary activation closes or reopens `E12`, leaves focus on that summary, and emits no announcement. The resulting `openDisclosureKeys` survives theme and ordinary state rerenders, filter hide/show, and entry to and return from the hidden-day route. Temporarily unrendered keys remain in in-memory disclosure state. Reset or selecting a fixture creates fresh state: only `item-ready` restores `['E12']`; every other fixture restores `[]`.

### 18.2 Required app-owned asynchronous visual anchor

The visual anchor is product behavior, not evidence-driver behavior. On a real click or keyboard activation of a visible, enabled lane Load control, the app records, before pending renders, the active lane, new pagination generation, exact stable target selector, and that target's viewport-top coordinate. Source uses `#lid-v18-load-source`; Derived uses `#lid-v18-load-derived`. The same ID stays on the lane's ready control, pending status/focus target, contextual terminal retry or beginning marker as applicable.

The record survives pending. For a matching success, failure, interruption, or duplicate-delivery terminal render, the app waits until the rendered target is measurable, restores its viewport top to the captured baseline with an absolute error no greater than one CSS pixel, focuses that exact logical target, and consumes the matching record once. A missing, stale, other-lane, or already-consumed record cannot move the page. Visible prototype outcome controls and allowlisted QA delivery actions dispatch the same transition and must produce equivalent rendered state, focus, restoration, and consumption.

The v18 driver may make a Load control visible before activating it and may record bounded before/after geometry. From the genuine Load activation through its terminal observation it is strictly passive: it never calls `scrollTo`, `scrollBy`, `scrollIntoView`, focuses a target, mutates the DOM/CSS, or applies a measured compensation. From fresh `global-ready` setup, frame 14 therefore proves the app's behavior through an exact five-record scenario transcript: partial-page QA seed → actual Source Load → QA Source success → actual Derived Load → QA Derived success. Fixture setup is not an additional scenario record. Independent live QA also proves the same app-owned restoration for failure, interruption, and duplicate delivery, including stale-generation rejection and one-time consumption.

### 18.3 Evidence metadata and Design disposition

Frame 3's sidecar records `scenario:null`, exact default/open-key assertions, the pre-selector `h1` focus, `scrollX=0`, `scrollY=0`, and empty announcement, plus a final assertion that only `E12` is open. Frame 14's transcript labels only the two Load activations as visible user actions and the seed/deliveries as QA transitions; its anchor assertion uses the app-produced geometry and the one-pixel tolerance.

For every evidence pair, the driver fails closed unless `browserState.opfs` is exactly `{supported:true, accessible:true, entryCount:0,errorName:null}`. Unsupported OPFS inspection, inaccessible root, nonzero entries, or an indeterminate field is not equivalent to zero.

Design retains `D=A`. `I=IP`; `Q=—`; `F=—`; no row closes and arithmetic remains 19/57 closed and 38/57 open.

## 19. Append-only pre-gate failure and canonical-entry experience amendment

Design failed the prior candidate at `D=F` because inherited v16 controls visually claimed provenance they did not own and because several contextual returns displaced the invoking control by more than one CSS pixel. The exact failure and non-QA limits are recorded in [PRE-GATE-FAIL-v18.md](PRE-GATE-FAIL-v18.md). This section is the binding replacement experience contract and restores `D=A` for repair implementation only.

### 19.1 Reconciled structure, copy, and semantics

There is exactly one v18-owned canonical entry section:

```html
<section id="lid-v18-canonical-entry-panel"
         class="lid-v18-canonical-entry-panel"
         aria-labelledby="lid-v18-canonical-entry-title"
         aria-describedby="lid-v18-canonical-entry-description">
```

It renders Product's exact eyebrow, heading, body, four facts, and four button labels from Product Section 17.2. Its entries form one `<ol>` in the same order. Each visible fact has a stable ID and is the `aria-describedby` target of its adjacent button; the accessible name remains the exact visible button text.

The exact button IDs and owned action tokens are:

| ID | `data-lid-v18-canonical-entry` | Exact accessible name |
| --- | --- | --- |
| `lid-v18-canonical-entry-day` | `day` | **History & provenance** |
| `lid-v18-canonical-entry-item` | `item` | **View source history** |
| `lid-v18-canonical-entry-summary` | `field` | **View Summary history** |
| `lid-v18-canonical-entry-artwork` | `artwork` | **View artwork history** |

These buttons use neither inherited `data-action`, runtime `data-lid-action`, nor the retired broad `data-lid-v18-entry` attribute. Field entry is Summary only. The section is normal flow, never floating, sticky, modal, dialog, popover, or an overlay.

### 19.2 Exact placement and observer-safety decision

Council inspected the frozen runtime: `#lid-runtime-v17` is prepended before `#prototype-root`. Placing the section inside that runtime root before `#lid-feature-host-v17` would put it above the inherited archive rather than after the task. Design's earlier suggestion to append within the current `#prototype-main` is also rejected because v16 replaces that mutable child during ordinary rendering.

The exact placement is therefore one direct `<body>` child immediately after stable `#prototype-root` and immediately before stable `#modal-root`. This places it after the complete inherited archive task, outside all inherited record and modal subtrees, and before the modal and inherited live-region siblings. The feature host/proof console remains inside the earlier prepended runtime root, so DOM order cannot put an after-task panel before that host; instead the exact general-sibling rule `#lid-runtime-v17[data-active-feature] ~ #lid-v18-canonical-entry-panel { display: none !important; }` removes the section from layout, hit testing, and the accessibility tree whenever any capsule is active. The canonical section and an active v17/v18 proof console are never simultaneously exposed.

Creation and placement are idempotent. One cached node is created only when absent. One observer watches only `document.body` with `{childList:true}`: no `subtree`, attributes, or character data. A queued reentrancy guard merely re-establishes `prototypeRoot.nextElementSibling === panel` and `panel.nextElementSibling === modalRoot`; a correct position causes no write. It never observes, reads, decorates, or mutates descendants of `#prototype-root` or `#modal-root`. Missing stable roots, duplicate panel IDs, or a position that cannot be restored fail the invariant rather than creating another panel.

### 19.3 Entry, launcher, and exact return behavior

A document capture-phase handler matches only the four buttons inside the owned section and the exact native generic selector `[data-action="settings-related"][data-label="History"]`. It prevents the frozen v16 Settings/More handler only for that generic History action, determines Settings versus More from the invoking native control, and opens fresh Global state. It never matches a day, item, generated-field, artwork, `view-provenance`, or `view-art-history` control.

The frozen runtime launcher may remain as a compatibility DOM node, but on `index-v18.html` it is permanently retired: hidden, disabled, `aria-hidden="true"`, `tabindex="-1"`, computed `display:none`, non-hit-testable, and absent from the accessibility tree. It cannot receive fallback focus or open v18. Fresh user-visible load shows the inherited archive plus the canonical entry section with no active capsule; active evidence setup must use a governed entry, not the launcher or automatic startup.

Panel entry uses the existing scope-specific Back labels. Before opening, the app records the connected invoker, `window.scrollY`, and `getBoundingClientRect().top`. Back or Escape restores the inactive archive, makes the panel visible, restores the saved scroll without smooth motion, focuses the exact same connected button, then if needed performs one app-owned post-render correction so both scroll and button-top deltas are no greater than one CSS pixel. The correction is consumed once. Settings/More follows the same measured rule while also restoring its exact view/modal state.

### 19.4 Responsive, accessibility, and evidence contract

The panel width is `min(1128px, calc(100% - 32px))`, centred with positive block margins and no negative or fixed positioning. Its entry list may use an auto-fit grid at wider widths and is exactly one column at 390 px and 320 px. At 568×320 every control remains reachable in the one page scroll. Buttons are at least 44×44 CSS pixels, prefer 52–56 px height, preserve visible focus without clipping, and never overlap the archive, modal root, runtime host, or another entry. Dark mode uses the inherited safe theme variables. Forced colours use system `Canvas`, `CanvasText`, `ButtonFace`, `ButtonText`, and `Highlight`; reduced motion adds no animation.

Frame 16 becomes `v18-16-canonical-entry-320-forced`, still 320×900, light preference, reduced motion, forced colours active, and inactive archive. The helper's final screenshot shows the exact normal-flow panel. Its safe transcript round-trips all four controls with real input, proves scope/count/Back copy, hidden/non-AX panel while active, same-button focus and scroll/top within one pixel after return, exact order/copy/geometry/hit tests, launcher user-surface absence, and `inheritedContextPatchedCount=0`. Live QA additionally exercises pointer, Enter, Space, Back, and Escape for all six positive origin pairs and the exact unchanged 2 Aug / Before sleep negative controls.

No new fixture, event, scenario, frame, or closure exists. Design accepts this repair contract at `D=A`; Product and Council are `A` on their matching appendices. Implementation remains `I=IP`; independent QA and freeze remain `Q=—`, `F=—`; arithmetic remains 19/57 closed and 38/57 open.

## 20. Append-only frame-16 responsive-proof clarification

Design approves the single-frame responsive evidence sequence below. It changes no user flow or product state; it makes the two native Global origins provable while each is genuinely rendered in its governed responsive navigation.

The sidecar's ordered `viewportStages` is exactly:

1. `initial-compact` — requested and observed 320×900, inactive archive;
2. `settings-wide` — requested and observed 1024×900, inactive before the Settings trip; and
3. `restored-compact` — requested and observed 320×900, inactive before More and retained through the final PNG.

Only the evidence environment changes between those stages. A stage transition is allowed only after the prior trip has returned to the exact invoker, restored focus and both one-pixel measurements, consumed its app-owned correction, left `activeFeature=null`, and exposed no pending return. No resize is dispatched through the app, QA fixture API, scenario API, URL, history, or storage, and no responsive observation mutates scope/domain state.

The Settings trip begins and ends wholly in `settings-wide`: its native **History** control is visible, enabled, hit-testable, and accessibility-exposed at both baselines. After returning inactive, the environment changes to `restored-compact`. Compact More and the Day/Item/Summary/Artwork controls begin, activate, return, and finish wholly in that compact stage. The helper may navigate or position the next real control before recording its baseline; from baseline through the completed return assertion it cannot call focus, scroll, viewport resize, or compensation.

Each trip record includes its viewport-stage key, requested/observed dimensions, control visibility/hit/accessibility result, before/after focus and scroll/top measurements, before/after domain digest, and before/after 0/0/0 counters. Final frame-level fields remain 320×900 and prove desktop Settings hidden, compact More visible/reachable, the canonical list one column, exact no-overflow geometry, inactive state, and visible focus on `#lid-v18-canonical-entry-artwork`.

Design remains `D=A` for this contract only. Core behavior is producer-stable; evidence implementation remains `I=IP`; `Q=—`; `F=—`; all cardinalities and program arithmetic remain unchanged.
