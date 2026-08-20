# Life in Days prototype v18 — History and Provenance Council decision

- **Decision date:** 2026-08-19
- **Pre-hold capture amendment:** 2026-08-19; unanimously accepted by Product, Design, and Project
- **Package:** v18 `PVA-013 History and Provenance`
- **Council:** Product Manager, Expert UI/UX Designer, Project Manager
- **Product gate:** **A**
- **Design gate:** **A**
- **Council gate:** **A**
- **Implementation gate:** **IP — released to implement the exact contract below; no implementation acceptance is claimed by this record**
- **Independent QA / Freeze gates:** `Q=—`; `F=—`
- **Frozen predecessor:** v17 completed and remotely read back at `8d94a61be8a7e7d6114b3a3b5b3963f23421e445`
- **Proof boundary:** deterministic fictional frontend behavior in browser memory only

## 1. Decision and authority

The three-role Council unanimously approves v18 for additive implementation. Product and Design independently approved the bounded direction, then cross-reviewed each other's contracts and the Project plan. Council found no residual decision requiring Arun after applying the explicit dispositions in this record.

The authority blobs reviewed for the original Council decision were:

| Authority | SHA-256 |
| --- | --- |
| `docs/prototypes/v18/PRODUCT-ACCEPTANCE-v18.md` | `5f61d200c29ce9d7e9a531d5f2f30d1c8e6a6170f9beb41780e7bc4636cfbd70` |
| `docs/prototypes/v18/UX-CONTRACT-v18.md` | `e42c9c4613e9d46389585bca4f6f736dacdcb234980bc4dba4e7de12ac3aaad3` |
| `docs/prototypes/v18/PACKAGE-PLAN-v18.md` | `9da154f0ee0e3bb4ad611d46064d1ebb01044840de8f52b8aee438d3fcacdd21` |

The Product and UX source records remain unedited evidence of the proposals and cross-review conflicts. The Project plan was reconciled before candidate hold under the append-only capture amendment in Section 8, so its table entry above intentionally preserves its initial-Council identity rather than claiming to be the current reconciled hash. Where the source records differ, this Council decision and the companion [History and Provenance fixture authority](HISTORY-PROVENANCE-FIXTURES-v18.md) control v18 implementation and QA. They do not amend the global Product/UX contracts or any frozen v1–v17 artifact.

## 2. Counting and claim boundary

V18 has exactly three primary closure targets:

- `LID-SCP-003` — Source, Source Revision, Correction, generated-field, and artwork records remain separate and navigable with explicit provenance;
- `LID-VN-006` — Revised, Untagged, Deleted upstream, and conflict states retain the local Voice Journal and its lineage; and
- `LID-REF-004` — Global, Journal Day, Source Item, generated-field, artwork, and hidden-day History are functioning read-only contexts with exact return behavior.

`LID-SRC-004` retained-history/source-binding behavior is supporting inherited regression only and is not counted again. `LID-SCP-004` remains assigned to v19. `LID-VN-005` remains **Requires external evidence** and is not closable by v18. No `LID-HIS-*` identifier exists or may be introduced.

All three v18 rows remain `Open` during implementation. Program arithmetic stays **19/57 closed and 38/57 open** until implementation, independent QA, freeze, explicit push, and remote readback all pass. A completed v18 may close exactly three rows and no more.

## 3. Approved experience approach

Council selects UX **Approach C — stacked named lanes in one page scroll**:

1. **Source history** appears first as a named section and newest-first ordered list.
2. **Derived history** follows as a separately named section and newest-first ordered list.
3. Both lanes share one page scroll, scope summary, filter model, result count, and prototype boundary.
4. No merged feed, tabs, side-by-side timeline columns, independent scroll areas, or colour-only lane identity is permitted.
5. The canonical cross-lane order remains data/QA truth for cardinality and timestamp verification, but it is not rendered as an interleaved third list.

This approach preserves authentic-source primacy and programmatic separation at every width while retaining cross-lane causality through exact bindings and relation links.

## 4. Conflict dispositions

The following dispositions are binding. Each resolves a Product, Design, Project, inherited-v17, or cross-review mismatch.

### C18-01 — Hidden day identity and terminology

- The historical day is **11 Aug 2026**, with the former Uploaded Journal at current synthetic location **10 Aug 2026**.
- Its `h1` is **History for 11 August 2026**.
- The exact banner is **Historical day — not shown in Calendar or Almanac**.
- Hidden-day history is not caused by upstream deletion and does not close `LID-SCP-004`.
- **Timeline** and the conflicting 12 Aug date are rejected as stale proposal text.

### C18-02 — Frozen-v17 timestamp and ordering truth

- Frozen v17 controls the preloaded synthetic redating record: `E10` is **19 Aug 2026, 10:00 am IST**.
- `E10` is therefore first in the Source-lane order and first in the canonical total order.
- The exact corpus remains Product `E01`–`E17`; no event is added or removed to repair numbering.
- `E01`–`E09` and `E11`–`E14` retain **Journal Date at this event · 18 Aug 2026**; `E10` records `18 Aug 2026 → 17 Aug 2026` and unchanged Original Timestamp.
- `E10` is a preloaded synthetic v18 fixture matching frozen-v17 truth, not evidence of shared persistence between capsules.

### C18-03 — Corpus and lane order

- Exactly 17 events exist in the accepted normal corpus.
- Global Source order is `E10,E14,E13,E12,E11,E05,E04,E01,E17,E15`.
- Global Derived order is `E09,E08,E07,E06,E03,E02,E16`.
- The canonical total data order is `E10,E14,E13,E12,E11,E09,E08,E07,E06,E05,E04,E03,E02,E01,E17,E16,E15`.
- Current day and item histories contain Source `E10,E14,E13,E12,E11,E05,E04,E01` and Derived `E09,E08,E07,E06,E03,E02`, exactly 14 total.
- Field is `E07,E06,E02`; artwork is `E09,E08,E03`; hidden day is Source `E17,E15` then Derived `E16`.

### C18-04 — Canonical fixture model

The only top-level fixture keys are Product's exact 14:

`global-ready`, `day-ready`, `item-ready`, `field-ready`, `artwork-ready`, `hidden-day`, `upstream-revised`, `upstream-conflict`, `upstream-untagged`, `upstream-deleted`, `empty`, `loading`, `failure`, `interrupted`.

Upstream-status unavailable, pagination ready/pending/failure/retry/interruption/success/duplicate/beginning, filtered empty/clear, scope-specific empties, and long-safe-metadata stress are required transition/QA branches. They are not extra top-level fixtures and must not replace or merge any of the 14.

The separate manifest field `captureScenarios` contains exactly `compact-filtered-open`, then `pagination-both-success`. The two names are disjoint from `fixtures`, do not appear as visible prototype-state-console fixture keys, and cannot alter the default complete `global-ready` state without an explicit v18-driver request.

### C18-05 — Deleted upstream and hidden day stay separate

- `upstream-deleted` keeps **Monsoon walk note** locally retained and live on **17 Aug 2026** after the complete represented state.
- `hidden-day` concerns **Station light note**, moved from 11 Aug to 10 Aug by `E17`.
- Upstream deletion never means local Trash, zero live sources, hidden ordinary day, purge, suppression, or absence-based deletion.

### C18-06 — Source revision, Correction, and conflict lineage

- Record lineage is `Revision 1 → Revision 2 → Revision 3`.
- `Correction 1` branches from and is **Based on Revision 2**.
- `Revision 3` remains the current upstream revision and produces an unresolved conflict with the displayed Correction.
- The accepted 17-event corpus includes Correction creation and conflict detection only. It has no Correction removal, Correction-made-historical, or conflict-resolution event.
- Reserved renderer vocabulary is not accepted-corpus evidence and does not change cardinality.

### C18-07 — Generated-field state

- `E07` is headed **Protected field version selected**.
- `Summary version 2` has simultaneous visible states **Current**, **Protected Field**, and **Stale**; it remains the displayed Summary and is bound to `[Revision 2, Correction 1]`.
- `Summary version 1` is **Historical** and bound to `[Revision 1]`.
- The historical fact of selection is read-only and does not close v22 or expose a selection/edit/resume action.

### C18-08 — Artwork state after redating

- `E09` records that `Artwork version 2` became Active before redating.
- After `E10`, its accepted current state is **Historical** and **Stale**, not Active, because its bound source set left the former day.
- `Artwork version 1` remains Historical.
- Each version keeps **AI-generated artwork** visible; inspecting it never activates it.
- This is supporting v17 regression and does not close v28.

### C18-09 — Exact headings, actors, and safe provider copy

The accepted event headings are the exact labels in the fixture authority, including **Generated field version created**, **Generated Artwork version created**, **Protected field version selected**, **Artwork version selected**, **Source conflict detected**, and **Upstream status changed**.

Permitted actor classes are exactly:

- **Archive owner · simulated**;
- **VoiceNotes upstream · simulated**;
- **Life in Days rule · simulated**;
- **Text generation lane · simulated**; and
- **Artwork generation lane · simulated**.

Safe derived provenance may use **Text Provider A — synthetic fixture**, **Artwork Provider A — synthetic fixture**, **Fixture configuration A**, and **Synthetic cost · fixture only**. It never says qualified, connected, healthy, production-selected, or verified.

### C18-10 — Event sequence versus record lineage

Complete provenance presents two separate groups:

- **Event sequence** — previous/following typed event in the same rendered lane; and
- **Record lineage** — prior/next Source Revision, Summary version, or Artwork version.

Correction detail separately says **Based on Revision 2**. Endpoints remain visible as **No earlier …** or **No later …**. Relation navigation may move focus to a heading but never activates, selects, restores, or makes a record current.

### C18-11 — Exact five-filter model

The filter model is:

1. **History lane** — All lanes / Source history / Derived history;
2. **Record type** — All record types / Journal Days / Source records / Generated fields / Artwork;
3. **Event type** — All event types / Source Items / Source Revisions / Corrections and conflicts / Journal Date changes / Upstream lifecycle / Generated fields / Artwork;
4. **Attention** — All / Needs attention; and
5. **Journal Date** — optional native exact date, Global History only.

Filters apply only through **Apply filters** and reset through **Clear filters**. There is no text search, scope selector, or Current/Historical state filter. At `>=1024 px` they use a non-scrolling 240–272 px rail. Below `1024 px` they use an inline native `<details>` disclosure labelled **Filter history**, with active summary and Clear always visible. No filter modal, focus trap, filter Cancel, or filter-specific Escape behavior is permitted.

### C18-12 — Per-lane pagination

- `global-ready` is the complete 17-event authority.
- The pagination transition starts Source with `E10,E14,E13,E12,E11,E05,E04`; one successful load adds exactly `E01,E17,E15` once.
- It starts Derived with `E09,E08,E07,E06`; one successful load adds exactly `E03,E02,E16` once.
- Separate **Load earlier Source events** and **Load earlier Derived events** controls own independent busy/error/end state.
- Pending, failure, interruption, and retry preserve existing cards, filters, expanded provenance, other-lane state, current domain fingerprint, focus, and visual anchor.
- Duplicate delivery adds zero events. Success announces only **3 earlier Source events added** or **3 earlier Derived events added**. Completion replaces the relevant control with **Beginning of represented … history**.

### C18-13 — Authentic-content continuity

- Only Day and Source Item contexts show a read-only **Current source context** region with the exact fictional prose frozen in the fixture authority.
- It appears before filters, measures approximately 60–72 characters on wide screens, and stays readable during loading, failure, interruption, empty, filtering, and history inspection.
- Global, field, artwork, and hidden-day contexts use safe Source Item navigation/facts rather than duplicating prose.
- Event cards, provenance, URLs, storage, requests, console, evidence metadata, and live regions never contain the prose.

### C18-14 — Exact entries, returns, empty/error copy, and status dimensions

- Invokers are **History**, **History & provenance**, **View source history**, **View Summary history** (or Title/Tags), and **View artwork history**.
- Origin-specific Back labels and exact invoker/scroll restoration from the UX contract govern.
- The canonical `empty` fixture heading is **No history matches this view**. Filtered empty is **No events match these filters**. Scope-specific empty headings are transition branches.
- Contextual retries are **Retry loading history** and **Retry loading earlier Source events** or Derived equivalent.
- Interrupted body is **The history already shown remains readable and may be out of date. Earlier events were not added.**
- State remains multi-dimensional: Source uses Displayed Correction / Current upstream / Historical / Retained locally / Conflict / Deleted upstream; field uses Current / Historical / Protected Field / Stale; artwork uses Active Artwork as event-time fact and Historical / Stale / AI-generated artwork as current facts.

### C18-15 — External-evidence boundary

Revised, conflict, untagged, deleted, and status-unavailable lifecycle presentations each display **Synthetic UI fixture · external evidence required**. A retry is an in-memory transition with `providerRequests = 0`. No state claims reconciliation ran, enumerated completely, detected partial pages, persisted, is replay-safe, or verified VoiceNotes.

### C18-16 — Evidence and manifest chronology

- The exact evidence roster is the 16-frame set in the fixture authority. It independently covers five scopes, revised, untagged, deleted, hidden day, compact filters, landscape loading, narrow forced-colour interruption, failure, pagination, narrow empty, and the forced-colour archive launcher.
- All 16 pairs use the additive `capture-phase2-evidence-v18.mjs` driver; the frozen v17 helper remains byte-identical and hash guarded.
- Live QA additionally covers status unavailable, both per-lane pagination lifecycles, filtered-empty/clear, long metadata, all entry/Back pairs, lineage focus, and inherited v17 regressions.
- The held candidate manifest contains only bytes that exist before independent QA starts. It **excludes** `DESIGN-QA-v18-round1.md` and every post-verdict handoff/tracker update.
- The QA report is added only in a documentation-only post-QA successor. No post-verdict file may be described as held or tested candidate bytes.

### C18-17 — Frozen-v17 and repository guard

- V18 adds only v18-scoped files and the living tracker, including the approved v18-only capture driver.
- It does not edit v1–v17, add a v17 control, mutate the v17 launcher, or require **View complete history** inside frozen v17.
- The five v18 entry contexts are global, day, item, field, and artwork. `E10` is preloaded synthetic history; inherited v17 Atomic Redating is tested separately through its existing routes.
- `runtime-v17.js` remains the compatibility kernel; `index-v18.html` loads v16, v17, then v18 assets and reports loaded versions `[17,18]`.
- `package.json`, `serve.mjs`, `main`, the maintained checkout, frozen archive, and GitHub issues/projects #115–#149 remain outside mutation scope.

## 5. Accessibility, responsive, and privacy acceptance

The package-specific UX contract remains controlling except where Section 4 explicitly overrides it. In particular:

- one feature `h1`, one main landmark, a skip link, logical `h2` lane headings and `h3` event headings, named sections, real ordered lists, semantic `<time>` values, definition pairs, and no fake table/feed/tree;
- logical keyboard order, visible focus, stable focus through filter/load/render transitions, exact return focus, no nested scroll traps, and restrained live regions;
- minimum 13 px essential metadata, minimum 24×24 targets with 44×44 preferred for primary compact controls, measured contrast, non-colour states, light/dark, reduced-motion, and forced-colour equivalence;
- no horizontal page scrolling or covered/unreachable actions at 1440×900, 960×900, 568×320, 390×844, and 320×900;
- generic `Life in Days` title and query/hash-free path, null private history payload, zero local/session/IndexedDB/cache/service-worker/OPFS state, localhost/data-only requests, and zero private console/log/live-region output; and
- fictional deterministic content only, with no real journal, photo, caption, filename, timestamp, identifier, credential, provider response, prompt, secret, recovery material, or production claim.

Native zoom, real assistive technology, mobile operating-system/browser coverage, backend history, persistence, VoiceNotes behavior, transactionality, reconciliation, security, deployment, formal accessibility conformance, production privacy, and production readiness remain unproven unless separately and directly evidenced.

## 6. Implementation release and gate conditions

Implementation is released with `P=A`, `D=A`, `C=A`, and `I=IP`. The implementer must create only the additive roster approved in the package plan, conform exactly to this decision and fixture authority, run candidate-owner checks, capture all 16 final-byte evidence pairs, and seal an exact pre-QA manifest.

The future QA agent must be fresh, independent, and read-only. Any implementation, authority, fixture, evidence, or manifest byte change after QA begins invalidates the verdict and requires a fresh run on v18. A failed run consumes no new version number.

No requirement closes and no `Q` or `F` gate advances through this Council decision. V19 remains queued until v18 passes independent QA, freezes exact accepted bytes, pushes explicitly to `origin/codex/prototype-completeness-v17-v35`, and passes remote-head/blob readback.

## 7. Approved current statement

The only permitted current statement is:

> V18 History and Provenance has approved Product, Design, and Council contracts and is released for additive implementation against deterministic fictional browser-memory fixtures. No v18 implementation, independent QA, freeze, publication, requirement closure, backend history, VoiceNotes reconciliation, persistence, security, deployment, accessibility-conformance, or production-readiness result is yet claimed.

## 8. Append-only pre-hold capture-path amendment

After read-only inspection of the frozen capture CLI, Council found that `capture-phase2-evidence-v17.mjs` can select only manifest fixtures and cannot truthfully drive the applied-filter or pagination-success branches required by evidence frames 10 and 14. It also has no safe import or attachment seam. Product, Design, and Project therefore unanimously accept this narrow evidence-mechanics amendment; no product behavior, fixture, event, closure, status, or proof-boundary decision changes.

### C18-18 — Additive v18 capture driver and exact scenarios

1. The implementation/self-check roster is exactly `index-v18.html`, `app-v18.js`, `styles-v18.css`, `README-v18.md`, `check-v18.mjs`, and `capture-phase2-evidence-v18.mjs`.
2. The original v17 helper remains frozen at SHA-256 `860f01a5ea135d53650552c508a91f2c51ccf306b183e09486a3691e3afa3c37`. It is neither edited nor transformed at runtime; `check-v18.mjs` must fail on any hash mismatch.
3. All 16 v18 evidence pairs use the additive v18 driver. Frames other than 10 and 14 have no scenario. Frame 10 uses `global-ready` plus `compact-filtered-open`; frame 14 uses `global-ready` plus `pagination-both-success`.
4. `manifest().fixtures` remains the exact ordered 14-key list in C18-04. `manifest().captureScenarios` is exactly the ordered two-key list `compact-filtered-open`, `pagination-both-success`; the arrays are disjoint, and scenario names are not visible fixture-console keys.
5. `compact-filtered-open` starts from fresh complete `global-ready` below 1024 px, opens the visible native filter details, selects Source history and Needs attention while leaving the other three filters default, activates **Apply filters**, observes the close/results-focus/**3 represented events** outcome, then reopens **Filter history · 2 active**. Final visible keys are Source `E14,E13,E12`, Derived none; the disclosure and Clear are visible and no modal exists.
6. `pagination-both-success` starts from fresh complete `global-ready`, enters the allowlisted partial-page transition, then uses each visible lane Load control and its allowlisted synthetic success in Source-then-Derived order. Source adds exactly `E01,E17,E15`; Derived adds exactly `E03,E02,E16`; each adds three once, preserves its anchor and logical focus, emits only its exact lane announcement, and ends at **Beginning of represented Source history** or Derived equivalent.
7. Each sidecar records the allowlisted scenario separately from fixture, an ordered safe step transcript, intermediate observations needed for visible/enabled/center-hit, filter/focus/anchor and lane-busy proof, and the exact final snapshot/invariants. The transcript contains only stable safe tokens, fictional event keys, counts, and bounded observations; it excludes prose, raw HTML, arbitrary script, private values, credentials, payloads, and production identifiers.
8. Scenario execution is main-world browser memory only. It never uses query, hash, `history.state`, local/session storage, IndexedDB, caches, service workers, OPFS, viewport/theme auto-branching, selector side effects, process interception, or source transformation.
9. The driver fails before writing either evidence file for an unknown/incompatible scenario, incorrect manifest cardinality/order/disjointness, missing/hidden/disabled/non-hit-testable control, transcript divergence, wrong intermediate/final keys/counts/focus/anchor, failed invariant, changed domain fingerprint or 0/0/0 counters, non-generic URL/history, browser-state residue, non-local request, console event, or exception.
10. Pagination failure/retry/interruption/duplicate delivery and filtered-empty/clear remain mandatory live-QA branches, not extra fixtures or extra frame-14 steps.

This clarification is accepted at `P=A`, `D=A`, and `C=A`. Implementation remains `I=IP`; `Q=—`; `F=—`. The three target rows remain open, arithmetic remains 19/57 closed and 38/57 open, and no v18 implementation acceptance or evidence completion is claimed.

## 9. Append-only pre-hold Current source context and loading amendment

Product and Design separately approved the narrow contracts appended to their source records. This supersedes only Section 1's earlier statement that those two proposal blobs remained unedited; their original hashes and text stay recorded as Council history, while the current appended blobs receive new hashes in the living tracker. On 2026-08-19, before candidate hold, Project reconciled them without changing the prior Council decisions, exact 17-event corpus, 14 fixtures, two capture scenarios, six implementation/self-check assets, 16 evidence pairs, three closure targets, or proof boundary. Council remains unanimously approved.

### C18-19 — Owner-scoped source context and named-lane initial loading

1. The QA snapshot/export exposes only `sourceContextVariant`, exactly `revision-2`, `correction-1`, or `none`.
2. `revision-2` belongs only to `upstream-revised` and any Day/Item descendant that retains that owner. The exact visible prose is **Fictional Revision 2 — Rain softened the path beneath the paper lanterns; the synthetic narrator counted three quiet puddles before walking home.**
3. `correction-1` belongs to every other Day/Item owner and its in-scope descendants. Its exact visible prose remains **Fictional Correction 1 — A rain-washed path curved past paper lanterns; the synthetic narrator paused beside three quiet puddles before heading home.**
4. `none` belongs to Global, field, artwork, hidden-day, archive, and every other non-Day/Item scope; no Current source context region is rendered.
5. Fixture/scope ownership persists through in-scope filter, disclosure, relation, status-unavailable, loading, failure, interruption, empty, retry, and pagination transitions. A fixture/scope reset recomputes the variant. Text, event focus, filter, or transient branch never selects it.
6. `upstream-revised` remains exactly Source `E04,E01`, lineage R1→R2, Derived none. Revision 2 is Displayed + Current upstream + Revised upstream; Revision 1 is Historical. No Correction, R3, conflict, Untagged, or Deleted fact is present, and no event/global cardinality changes.
7. The exact top-level `loading` fixture is Global with `sourceContextVariant=none`. It renders a named **Source history** lane region with `aria-busy="true"`, containing **Loading history** and **Preparing separate Source and Derived event lists from synthetic browser-memory fixtures.** as a static safe status. Derived history is absent; no event/card/list/final count/prose placeholder is rendered; entry focus remains on **History & provenance**.
8. Earlier-page loading continues to busy only its affected rendered lane while preserving the other lane. A Day/Item loading descendant retains its mapped Current source context before filters and applies the named-lane busy rule.
9. Neither exact prose string may enter event/provenance text, snapshot, snapshot summary, structured evidence, scenario transcript, URL/history/storage, network, console/exception output, or live region. Only the safe variant token is exported. A PNG may naturally show the visible Current source context pixels.
10. Implementation and self-checks must fail on an unknown variant, incorrect owner mapping, more or fewer than one context section in Day/Item, any context in non-Day/Item, revised-fixture contamination, prose leakage, unnamed/global busy state, busy Derived lane, rendered Derived lane in top-level loading, or cardinality/0/0/0 drift.

This amendment is accepted at `P=A`, `D=A`, and `C=A`. `I=IP`; `Q=—`; `F=—`; all three rows remain open; arithmetic remains 19/57 closed and 38/57 open. It records contract only and claims no implementation acceptance, evidence completion, QA, freeze, publication, or production behavior.

## 10. Append-only final pre-hold Council amendment

Product and Design separately approved the final disclosure, app-owned pagination-anchor, and strict-OPFS contracts. On 2026-08-19, before candidate hold, Project reconciled them with all prior Council decisions. This section preserves Sections 1–9 as decision history and adds no fixture, capture scenario, CLI option, event, row, closure, or product scope.

### C18-20 — Deterministic disclosure and app-owned proof semantics

1. A fresh `item-ready` state alone exports `openDisclosureKeys=['E12']`; every other top-level fixture exports `[]`. The native `E12` disclosure is already open, with **Event sequence** before **Record lineage**. Fresh entry focuses **History for Monsoon walk note**, starts at `scrollX=0`, `scrollY=0`, and makes no live announcement.
2. User close/reopen state persists across ordinary rerenders, filter hide/show, and a hidden-day round trip. A reset or new fixture selection restores the exact owning fixture default; it does not force `E12` open after every render.
3. Evidence frame 3 remains `item-ready` with `capture.scenario=null`. Selector `[data-lid-v18-event-details="E12"]` only scrolls already-open content after initial-state observation; it never toggles, dispatches, moves focus, or announces. The sidecar asserts initial h1 focus/zero scroll/empty announcement and final `openDisclosureKeys=['E12']` with exactly `E12` open.
4. Pagination anchoring belongs to `app-v18.js`. Genuine activation of a visible, enabled Source or Derived Load control captures its viewport-top baseline before pending, keyed by that lane and pagination generation. Exact stable targets are `#lid-v18-load-source` and `#lid-v18-load-derived`.
5. The record survives pending. A matching success, failure, interruption, or duplicate terminal render restores the matching target within one CSS pixel, focuses it, and consumes the record exactly once. Stale, other-lane, missing, or consumed records cannot move the page. Visible outcome controls and allowlisted QA deliveries use the same reducer/render/restoration path.
6. The v18 evidence driver may observe bounded geometry and focus only. After genuine Load activation it never scrolls, focuses, compensates, changes layout, or mutates DOM/CSS. From fresh complete `global-ready` fixture setup, frame 14's scenario transcript has exactly five records: allowlisted partial-page QA seed; actual visible Source Load; allowlisted Source success; actual visible Derived Load; allowlisted Derived success. Fixture setup is metadata, not a scenario record. Source and Derived each add their exact three once and finish on the exact beginning marker with app-restored anchor/focus.
7. Failure, interruption, duplicate delivery, stale-generation rejection, and one-time consumption remain live-QA branches. They do not become fixtures, capture scenarios, or extra frame-14 steps.
8. Every one of the sixteen evidence invocations must observe `browserState.opfs` exactly `{supported:true,accessible:true,entryCount:0,errorName:null}`. Unsupported inspection, inaccessible root, failed enumeration, nonzero count, or indeterminate state fails before either evidence file is written.
9. The helper CLI remains unchanged; the fixture list remains the exact ordered fourteen, capture scenarios remain the exact ordered disjoint two, the corpus remains `E01`–`E17`, and all counters remain 0/0/0.

Council remains unanimously accepted at `P=A`, `D=A`, and `C=A`. `I=IP`; `Q=—`; `F=—`; all three rows remain open; arithmetic remains 19/57 closed and 38/57 open. This amendment is contract only and makes no implementation, evidence, QA, freeze, publication, or production claim.

## 11. Append-only pre-gate failure and repair Council amendment

The prior entry contract failed the final Product/Design pre-gate. [PRE-GATE-FAIL-v18.md](PRE-GATE-FAIL-v18.md) records the exact failed bytes, one P1 / High blocker, one P2 defect, passing observations, and evidence limits. At verdict: `P=F`, `D=F`, superseded-contract `C=F`, `I=IP`, `Q=—`, `F=—`. No independent QA occurred. Product, Design, and Project then reconciled the following binding replacement; no choice remains for Arun.

### C18-21 — Truthful canonical contexts and native inherited controls

1. **Failure disposition.** The failed implementation made unrelated 2 Aug / Before sleep / generated-field / artwork controls open the fixed 17 Aug 2026 / Monsoon walk note fixture. This false provenance is P1 / High and invalidates those six working bytes and every producer-local capture made from them. The additional P2 return measurements were `1867→1785`, `1121→1073`, and `1087→1064`; Settings/More were exact and artwork was within one pixel. No other blocker was found.
2. **Global origin.** Global History is user-reachable only through the native **History** control in Settings or compact More. Those controls retain native v16 text and attributes. A capture-phase listener may intercept only exact `[data-action="settings-related"][data-label="History"]` activation before the v16 placeholder handler; no decoration or observer is allowed.
3. **Canonical contextual origin.** Contextual scopes are user-reachable only through one v18-owned normal-flow section. Product's exact visible eyebrow, heading, body, four facts, four button labels, and order in Product Section 17.2 control. UX contributes only stable IDs, ARIA description links, `<ol>` semantics, responsive styling, and focus behavior. This resolves the copy conflict in Product's favour without changing accessible names.
4. **Inherited boundary.** All v16 contextual controls remain byte/render native and v18-ineligible: no text rewrite, `data-lid-v18-*`, injection, event interception, or inherited-root/modal-root descendant observer. Exact negative anchors remain 2 Aug **View day history**, **Before sleep — synthetic fixture** / **Revisions & provenance**, **View versions**, and zero Manage Reflection History injection. Their activation never opens v18.
5. **Placement conflict.** The frozen runtime root is prepended before the archive, so putting a panel before its feature host would place the panel above the task. UX's mutable `#prototype-main` child also cannot survive v16 rerender safely. Council selects exactly one direct-body `section#lid-v18-canonical-entry-panel.lid-v18-canonical-entry-panel` immediately after stable `#prototype-root` and before stable `#modal-root`. It is after the full task and outside inherited record/modal subtrees. The earlier feature host and this panel are never exposed together because any runtime `data-active-feature` hides the panel with the exact general-sibling rule.
6. **Observer safety.** One cached-node guard observes only direct `document.body` `childList`. It queues one guarded reconciliation and writes only when the exact `prototypeRoot → panel → modalRoot` sibling relation is absent. No subtree/attribute/character-data observation and no inherited-descendant read/write is permitted. Duplicate ID, missing anchor, or unrestorable order fails closed.
7. **Launcher and initial state.** The frozen launcher may remain in the runtime DOM only as a permanently retired compatibility node. On v18 it is hidden, disabled, `aria-hidden`, removed from sequential focus, computed `display:none`, non-hit-testable, and absent from the accessibility tree. It cannot open v18 or receive fallback focus. Fresh page load leaves every capsule inactive and shows archive plus canonical section; automatic startup is removed.
8. **Owned button map.** `day`, `item`, `field`, `artwork` map only to `day-ready`, `item-ready`, `field-ready` Summary, and `artwork-ready`. Existing Back labels remain **Back to Journal Day**, **Back to Source Item**, **Back to Summary**, and **Back to Generated Artwork**. The generic **Back to fixture entries** proposal is rejected. Settings/More retain **Back to Settings** / **Back to More**.
9. **Exact return.** For all six positive origins, both Back and Escape restore the same still-connected invoker, focus, inherited view/modal state, `window.scrollY`, and invoker viewport top with absolute error no greater than one CSS pixel. The app owns any one-shot post-render correction. Capture/QA helpers may observe but never compensate.
10. **Evidence.** The roster remains exactly sixteen pairs. Frame 16 is now `v18-16-canonical-entry-320-forced`; the old launcher basename/subject is retired. The v18 driver may inspect and round-trip Settings, More, and all four panel controls, ending on the inactive panel at 320×900 in forced colours. It proves exact panel copy/order/placement/geometry/hit/focus, hidden/non-AX active state, scope/count/Back mapping, one-pixel return, `inheritedContextPatchedCount=0`, exactly two native Global origins, zero other inherited v18 origins, negative 2 Aug / Before sleep identity, and launcher user-surface absence.
11. **No cardinality drift.** The implementation/self-check roster remains six; events remain exactly `E01`–`E17`; fixtures remain the ordered fourteen; capture scenarios remain the ordered disjoint two; evidence remains sixteen pairs; target rows remain exactly three and open; 0/0/0 and all privacy/proof limits remain.
12. **Temporal gate.** The current repair contract is accepted at `P=A`, `D=A`, `C=A`, but the failed implementation fingerprint is not. Implementation remains `I=IP`. All evidence must be regenerated after final repaired bytes and a new manifest must be sealed before a fresh independent QA agent; `Q=—`, `F=—`.

C18-21 supersedes only the earlier inherited contextual-entry mechanism, direct/floating launcher return, and frame-16 launcher subject. It preserves all approved history state, copy, fixture, event, filter, pagination, source-context, disclosure, privacy, proof, and external-evidence decisions. Program arithmetic remains 19/57 closed and 38/57 open.

## 12. Append-only frame-16 evidence clarification

Product and Design both approved this narrow evidence-only clarification after C18-21. Project reconciles it as C18-22. The pre-gate failure chronology remains immutable; repaired core meaning remains unchanged; no evidence or QA is accepted by this decision.

### C18-22 — Responsive environment staging for the canonical-entry frame

1. Frame 16 remains exactly one `v18-16-canonical-entry-320-forced` PNG/JSON pair. No fixture, event, capture scenario, frame, CLI option, requirement, scope, or closure is added.
2. Its exact sequence is: inactive 320×900; inactive 1024×900; actual visible Settings round trip; inactive restored 320×900; actual compact More round trip; actual Day, Item, Summary, Artwork round trips; final PNG. The established per-origin fresh fixtures, counts, Back/Escape methods, one-pixel return, and final Artwork focus remain controlling.
3. Resize is an environment-only driver operation between fully consumed trips. Immediately before and after each resize, `activeFeature=null`, no app-owned return correction is pending, focus/scroll restoration is complete, domain digest is unchanged, and 0/0/0 counters remain zero. Resizing during active/pending state fails closed.
4. Settings baseline, activation, active inspection, return, final baseline, digest, and counters are wholly 1024×900. More, Day, Item, Summary, and Artwork equivalents are wholly 320×900. A dimension mismatch at any per-trip observation fails.
5. Every origin/control used is actually rendered, visible, enabled, centre-hit-testable, and accessibility-exposed at that viewport. Hidden desktop Settings at 320 or hidden compact More at 1024 cannot be clicked or counted as a valid proof.
6. Viewport does not select or mutate application/domain state, fixture, scope, corpus, filter, disclosure, pagination, scenario, URL, history, or storage. `viewportStages` is evidence metadata, not app state. No viewport-derived branch exists in the manifest or snapshot.
7. The helper may navigate/scroll to the next real control before that trip's baseline. From baseline until the app's return and measurements are complete, it performs no focus, scroll, resize, DOM/CSS/layout mutation, or compensation. The application owns return restoration.
8. The sidecar records ordered `viewportStages` exactly `initial-compact` 320×900, `settings-wide` 1024×900, `restored-compact` 320×900. Every ordered trip records its stage, requested/observed dimensions, visibility/hit/AX results, before/after focus and one-pixel measurements, domain digest, counters, and consumed-return result.
9. Final top-level requested/observed viewport is 320×900. The final DOM and PNG re-prove desktop Settings hidden, compact More reachable, canonical panel one column, no horizontal overflow, inactive/no-pending state, and focus on the Artwork canonical button.
10. The canonical aggregate for the exact old failed six-file records under complete-record `LC_ALL=C sort` is `852fcedaba5e26a4cea7f92de5b9c9baa1fdaf36693a00fcc72523b76acb092b`. The recorded `cca2b73673b95e454482ccbc1b11564be43ad269136a3b4bf005b19153d3ddf9` is only a path-key-sorted derivative. This correction changes neither the failed individual hashes nor the current repaired core identity.

C18-22 is accepted at `P=A`, `D=A`, `C=A` for contract only. Core implementation is producer-stable while evidence remains `I=IP`; `Q=—`; `F=—`. The three v18 rows remain open and program arithmetic remains 19/57 closed and 38/57 open.
