# Life in Days prototype v18 — History and Provenance package plan

- **Prepared:** 2026-08-19
- **Project Manager:** `/root/project_v18`
- **Package:** v18 `PVA-013 History and Provenance`
- **Current phase:** Additive implementation in progress after three-role Council approval
- **Gate state:** `P=A`; `D=A`; `C=A`; `I=IP`; `Q=—`; `F=—`
- **Frozen source baseline:** v16 archive/tracker commit `01d1f054a12773e07f91096b8d76b0c5f4064329`
- **Immediate predecessor:** v17 completed and remotely read back on `origin/codex/prototype-completeness-v17-v35` at `8d94a61be8a7e7d6114b3a3b5b3963f23421e445`
- **Execution worktree:** `/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect-phase2-v17-v35`
- **Execution branch:** `codex/prototype-completeness-v17-v35`
- **Publication destination:** `origin/codex/prototype-completeness-v17-v35`

This plan began as the Product and Design preparation record for v18. The three-role Council subsequently recorded `P=A`, `D=A`, and `C=A`; implementation is now in progress against the shared fixture-exact contract and the append-only capture-path clarification in Section 10. This plan does not claim implementation acceptance, independent QA, freeze, publication, or requirement closure.

## Governing authority and precedence

The package is planned against the [global Product acceptance contract](../../phase2/PRODUCT-ACCEPTANCE-v17-v35.md), [global UX contract](../../phase2/UX-CONTRACT-v17-v35.md), [living v17–v35 tracker](../../phase2/PROTOTYPE-COMPLETENESS-PROJECT-TRACKER-v17-v35.md), [frozen completeness tracker](../../project/PROTOTYPE-COMPLETENESS-TRACKER.md), [v5 feature audit](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md), [product requirements](../../product/PRODUCT-REQUIREMENTS.md), [v17 architecture runbook](../../../prototypes/calendar-ui/README-v17.md), [immutable v17 compatibility runtime](../../../prototypes/calendar-ui/runtime-v17.js), and [v17 freeze handoff](../CALENDAR-UI-PROTOTYPE-v17.md).

Direct Product decisions and the four approved frozen Council decisions C-01 through C-04 govern stale specification wording. A new conflict is recorded and blocks the affected gate; this plan does not silently amend Product, Design, privacy, security, recovery, or Outside UI meaning.

## 1. Scope and counting reconciliation

V18 has four in-scope requirement obligations, but only three are unique primary closure rows. The fourth is an inherited supporting regression and must not be counted a second time.

| Obligation | Package role | V18 observable outcome | Counting disposition during preparation |
| --- | --- | --- | --- |
| `LID-SCP-003` | **Primary closure** | Global/day/item/field/artwork entry points expose navigable Source, Source Revision, Correction, and Derived Artifact separation with version provenance. | Remains `Open`; eligible for one v18 closure only after P/D/C/I/Q/F all pass and remote readback succeeds. |
| `LID-VN-006` | **Primary closure** | Revised, Untagged, and Deleted upstream states retain local history, show revision timestamps and lineage, and never present absence as local deletion. | Remains `Open`; eligible for one v18 closure only after all gates and readback. |
| `LID-REF-004` | **Primary closure** | Journal Day exposes functioning contextual history/provenance, exceptional lifecycle states, and an exact return path while authentic material stays distinguishable from derived material. | Remains `Open`; eligible for one v18 closure only after all gates and readback. |
| `LID-SRC-004` | **Supporting regression only** | Redated or otherwise source-set-invalid artwork remains inspectable as Historical with its exact synthetic binding; same-day staleness remains distinct from cross-day removal. | Already counted in the bounded v17 redating closure. V18 verifies retained-history/provenance behavior and does **not** add a row or change program arithmetic. |

`LID-VN-005` remains **Outside UI — Requires external evidence**. V18 may truthfully represent a synthetic reconciliation-related lifecycle event or a boundary disclosure, but it cannot prove replay safety, authoritative complete enumeration, partial-page abort behavior, idempotency, scheduler execution, or persistence. Product, Design, Council, implementation, and QA must not close it, count it among v18 rows, or use labels such as **reconciled**, **complete**, or **idempotent** as an unqualified operational claim.

The program therefore remains **19/57 prototype-representable rows closed and 38/57 open** throughout Council preparation. A fully published v18 may close exactly three unique rows and no more.

## 2. Package outcome and explicit exclusions

The package outcome is one reusable, read-only History route in the Archive Management shell. It is available globally and from Journal Day, Source Item, generated field, and artwork contexts. It presents a chronological ordered event list, visible/programmatic **Source history** and **Derived history** lanes, typed event identity, safe synthetic timestamps and actor classes, contextual filters, complete provenance on demand, and exact origin return.

The v18 slice must represent at least:

- Source Item creation and current identity;
- Source Revision and revised-upstream lifecycle;
- Untagged upstream and Deleted upstream lifecycle without local erasure;
- Correction creation, base/branch lineage, and an unresolved Conflict state; the accepted corpus contains no Correction-removal event;
- Journal Date change and the retained-history consequence inherited from v17;
- generated-field version replacement, including protected/current/historical distinctions;
- artwork version selection and retained historical/stale/source-set facts;
- the separate Station light historical day using the exact banner **Historical day — not shown in Calendar or Almanac**, never conflated with upstream deletion;
- load-in-progress, load interruption, load failure/retry, load-earlier success, and empty states without replacing already readable retained events; and
- read-only inspection that produces zero represented current-state mutation.

V18 explicitly excludes restoration, version activation, Correction editing, conflict resolution, redating, Trash mutation, permanent deletion, suppression removal, provider requests, generated-field replacement, artwork activation, search history inclusion, export, and backend reconciliation. Existing actions owned by v15–v17 remain reachable only as inherited regression paths; v18 history inspection does not silently invoke them.

The prototype may prove deterministic synthetic frontend rendering, navigation, filtering, focus, ordering, state labels, and zero-mutation inspection. It does not prove server history, durability, completeness, immutability, transactions, concurrency, reconciliation, VoiceNotes behavior, authentication, encryption, deployment, formal accessibility conformance, production privacy, or production readiness.

## 3. Dependency and guard matrix

| Guard or dependency | Required v18 treatment | Blocking check before candidate hold |
| --- | --- | --- |
| v16 frozen authority | No v1–v16 application, style, guide, Council, QA, evidence, package, or tracker byte may change. | Rehash the frozen dependency set through `check-v18.mjs`; compare maintained checkout and archive provenance. |
| v17 completed predecessor | Preserve every accepted v17 implementation, authority, evidence, QA, and handoff byte. Treat `runtime-v17.js` as the immutable compatibility kernel. | Exact pre/post hashes for all v17 frozen files; `git diff --name-only` contains only the approved v18 roster and living tracker. |
| Frozen v17 capture helper | Preserve `capture-phase2-evidence-v17.mjs` byte-for-byte at SHA-256 `860f01a5ea135d53650552c508a91f2c51ccf306b183e09486a3691e3afa3c37`; it has no scenario-dispatch seam and is not the v18 evidence driver. | `check-v18.mjs` rehashes the frozen helper and rejects any mismatch before capture or hold. |
| Additive runtime chain | `index-v18.html` loads frozen v16 assets, then `runtime-v17.js`, `app-v17.js`, and new `app-v18.js`, with `styles-v17.css` before new `styles-v18.css`. No `runtime-v18.js` is permitted. | Runtime manifest is exactly `[17, 18]`; latest compatible feature is v18; the explicit prior-feature control can open v17. |
| Direct version entries | `index-v17.html` continues to open v17 unchanged; `index-v18.html` opens v18 directly and has a generic title/URL. | Direct route and launcher tests at both versions; no query, hash, or private history payload. |
| History placeholder ownership | Replace only the inherited successor behavior for **History** through the v18 capsule. Trash, Suppressions, Export, and System Health remain owned by v19, v20, v33, and v24. | Opening each non-v18 management action still follows its inherited path; v18 does not claim those features. |
| Inherited Atomic Redating | The retained `Journal Date changed` event, affected-day links, Original Timestamp, source-set binding, and artwork-history facts remain coherent. | Natural v17 success/duplicate regression plus v18 inspection of the resulting synthetic event; zero v17 byte change. |
| Authentic/derived separation | Source, Source Revision, and Correction never share an entity label with generated field or artwork versions. | Lane, heading, event-type, accessible-name, and snapshot assertions across all fixtures. |
| Read-only cardinality | Opening, filtering, disclosing provenance, changing context, and loading earlier events cannot activate/restore/select/edit an entity. | Before/after snapshot hashes and current-state counters remain identical; no provider or mutation intent exists. |
| Calendar and Almanac contract | C-01 keeps provenance chips off Calendar tiles; C-02/C-03 keep **Monthly Almanac** and the existing switcher/index. | No persistent Calendar overlay, no Timeline tab, and no new persistent management rail. |
| Privacy and synthetic data | Only deterministic fictional fixtures; no raw journal text, caption, prompt, payload, credential, internal ID, production request ID, or private identifier. | DOM/source/evidence string scan; generic URL/title/history; zero local/session/IndexedDB/cache/service-worker/OPFS state; localhost/data-only requests; zero console payload leakage. |
| Browser-memory boundary | History data and filters exist only in the open page. | Reload resets v18 fixture/filter/disclosure state; no storage or service worker created. |
| Package isolation | Do not edit `package.json`, `serve.mjs`, `main`, the archive branch, maintained checkout, or GitHub issues/projects #115–#149. | Exact Git status/staged-roster check and remote/ref guard before each commit and push. |
| Successor gate | V19 remains queued until v18 is frozen, explicitly pushed, and read back with zero local/remote mismatch. | Tracker and remote head agree; committed blobs reproduce the accepted manifest. |

## 4. Exact additive artifact roster

No file outside this roster may be added or modified without an append-only Project Manager disposition before QA hold.

### 4.1 Council-preparation authority

| Path | Owner and purpose |
| --- | --- |
| `docs/prototypes/v18/PACKAGE-PLAN-v18.md` | Project Manager scope, guards, roster, evidence, QA, and publication plan. |
| `docs/prototypes/v18/PRODUCT-ACCEPTANCE-v18.md` | Product Manager fixture-exact P-gate contract for the three primary rows, supporting regression, and Outside UI boundary. |
| `docs/prototypes/v18/UX-CONTRACT-v18.md` | Expert UI/UX Designer D-gate contract with hierarchy, exact copy, transitions, focus/return, breakpoints, accessibility, and interaction alternatives. |
| `docs/prototypes/v18/COUNCIL-v18.md` | Three-role reconciliation and explicit Approved/Blocked decision. Created only after Product and Design contracts are reviewable. |
| `docs/prototypes/v18/HISTORY-PROVENANCE-FIXTURES-v18.md` | Frozen event, lineage, context, state, ordering, cardinality, and privacy authority selected by Council. |
| `docs/phase2/PROTOTYPE-COMPLETENESS-PROJECT-TRACKER-v17-v35.md` | Living gate and publication ledger; rows stay open until remote completion. |

### 4.2 Implementation and self-check assets

| Path | Exact role |
| --- | --- |
| `prototypes/calendar-ui/index-v18.html` | Additive entry loading frozen v16, immutable v17 runtime/capsule, and the v18 capsule/style. |
| `prototypes/calendar-ui/app-v18.js` | History domain fixtures, five entry contexts, typed events/lineage, read-only filters/disclosure/load states, snapshot, invariants, and v18 QA manifest. |
| `prototypes/calendar-ui/styles-v18.css` | V18-scoped Archive Management event spine/list, lane, filter, provenance disclosure, responsive, theme, focus, forced-colour, and reduced-motion styles. |
| `prototypes/calendar-ui/README-v18.md` | Runbook, state matrix, manual branches, additive architecture, exact bounded claim, and deliberate limits. |
| `prototypes/calendar-ui/check-v18.mjs` | Narrow syntax/static/privacy/package validator, frozen v16/v17 hash guard, exact v18 asset/fixture assertions, and runtime-chain checks. |
| `prototypes/calendar-ui/capture-phase2-evidence-v18.mjs` | Additive v18-only evidence driver carrying forward the frozen v17 fail-closed capture protections and adding the exact allowlisted capture scenarios required for frames 10 and 14. |

The immutable `prototypes/calendar-ui/capture-phase2-evidence-v17.mjs` remains a frozen dependency and hash guard; it is not edited. All sixteen v18 PNG/JSON pairs use `capture-phase2-evidence-v18.mjs`, which accepts the same fail-closed fixture/theme/media/view controls plus one optional allowlisted `--scenario`. It targets only query/hash-free `index-v18.html`, records target version `18` and loaded versions `[17,18]`, and permits no URL, history, storage, arbitrary-script, or viewport-triggered scenario state.

### 4.3 Held evidence, QA, and handoff assets

The held candidate contains the six implementation/self-check assets, all five package-authority records available by hold time, the current tracker blob, and the following files:

- exactly sixteen PNG/JSON evidence pairs named in Section 6 under `docs/prototypes/v18/`;
- `docs/prototypes/v18/CANDIDATE-MANIFEST-v18.md`, with every held path and SHA-256 plus one deterministic aggregate, excluding only the manifest's own self-hash from the aggregate rule it defines;
- and `docs/prototypes/CALENDAR-UI-PROTOTYPE-v18.md`, in pre-QA form inside the held candidate.

The held candidate explicitly excludes `docs/prototypes/v18/DESIGN-QA-v18-round1.md` and every post-verdict tracker or handoff update. The QA report and verdict-bearing handoff update are created only after the read-only verdict in documentation-only successors that change no tested candidate, authority, package, evidence, or manifest byte.

No shared `latest` file, mutable cross-version application file, new dependency, generated asset, external font, network service, or production-looking data source is permitted.

## 5. Council decision and conflict queue

The following table preserves the alternatives considered during preparation and records the Council-selected disposition. The binding details are the Council decision and fixture authority; no earlier alternative or recommendation overrides them.

| Decision | Alternatives considered | Council-selected disposition and acceptance test |
| --- | --- | --- |
| History information architecture | Separate routes per entity; one reusable route with contextual filters; nested history inside each existing surface. | One reusable read-only route has global/day/item/field/artwork entry contexts, one h1, explicit context, and exact origin return. |
| Chronology and pagination | Oldest-first; newest-first with **Load earlier events**; bidirectional virtual list. | Newest-first in each named lane. Independent **Load earlier Source events** and **Load earlier Derived events** controls each add exactly three once, preserve the logical anchor/focus, and announce only the lane-specific count. |
| Source/Derived lane presentation | Tabs; one interleaved feed with badges; two named sections within one event list. | UX Approach C: separate Source-first and Derived-second ordered lists in one page scroll. Canonical cross-lane order remains data/QA truth, not a third rendered feed. |
| Complete provenance disclosure | Always-expanded dense cards; modal; inline on-demand disclosure. | Prefer inline on-demand disclosure beneath the event. It must preserve one page scroll, disclose predecessor/successor and safe bindings, and never expose raw content or IDs. |
| Context filters on compact layouts | Permanently visible form; modal/sheet; browser select-only row. | Below 1024 px use native inline `<details>` labelled **Filter history** with persistent active summary/Clear. There is no modal, sheet, Cancel, focus trap, or filter-specific Escape behavior. |
| Read-only versus action launch | Inline activate/restore/edit buttons; links to owning actions; inspection only. | V18 is inspection only. At most, separately labelled links may return to an already owned surface; viewing or comparing never activates, restores, edits, resolves, or retries a domain entity. |
| Upstream Deleted versus local Trash | Shared Deleted state; separate lifecycle labels and explanation. | Keep **Deleted upstream** distinct from local **In Trash**. V18 cannot claim complete reconciliation or local deletion by absence; v19 owns Trash behavior. |
| Hidden historical day | Remove all day navigation; show a normal Journal Day; show history-only banner and exact-date management context. | Use the mandated **Historical day — not shown in Calendar or Almanac** banner, retain history-only date context, and provide no ordinary Calendar/Almanac visibility claim. V19 later owns hide/restore mutation. |
| LID-SRC-004 continuity | Recount in v18; omit because v17 counted it; verify retained-history details as regression. | Verify it as a non-counted supporting regression. Candidate manifest and QA name it separately from the three primary rows. |
| LID-VN-005 boundary | Treat synthetic event order as reconciliation proof; omit the topic; show explicit external-evidence boundary. | Show a concise **Requires external evidence** boundary wherever a lifecycle fixture could be mistaken for complete reconciliation. Never close or count the row. |
| Existing roadmap conflicts | Reintroduce Calendar chips/Timeline/rail; defer accessibility to v35; retain C-01/C-03 and per-version accessibility. | C-01, C-02, C-03, and the per-version accessibility gate govern. Record stale specification wording as editorial debt, not an implementation instruction. |

Any unresolved product meaning, ordering rule, privacy boundary, destructive/action scope, or conflict is `C=B` and prevents implementation. Convenience is not a Council disposition.

## 6. Fixture and current-run evidence plan

Council must freeze exact deterministic records, timestamps, stable event tie-breakers, entity labels, context labels, safe actor classes, source/derived bindings, predecessor/successor links, filter results, and unchanged-current-state fingerprints. All values are fictional and use `Asia/Kolkata` only where a Journal Date or displayed instant requires it.

### 6.1 Required fixture states

`window.__LID_QA__.manifest().fixtures` and the visible prototype-state console contain exactly these fourteen keys, in this order:

1. `global-ready`;
2. `day-ready`;
3. `item-ready`;
4. `field-ready`;
5. `artwork-ready`;
6. `hidden-day`;
7. `upstream-revised`;
8. `upstream-conflict`;
9. `upstream-untagged`;
10. `upstream-deleted`;
11. `empty`;
12. `loading`;
13. `failure`; and
14. `interrupted`.

The separate manifest field `captureScenarios` contains exactly `compact-filtered-open`, then `pagination-both-success`. Those names are disjoint from `fixtures`, are not visible prototype-state-console fixture keys, and run only after an explicit v18-driver request from fresh complete `global-ready`. Filters, provenance disclosure, lane navigation, context changes, pagination lifecycle, and Back/Escape remain in-memory interaction branches; none may be selected through URL, history, storage, viewport, theme, or hidden fixture aliases.

### 6.2 Exact evidence roster

Every image is captured after final UI/tool/authority bytes with `capture-phase2-evidence-v18.mjs` and paired with that driver's JSON sidecar. `--scenario` is omitted except for frames 10 and 14.

| Basename | Fixture/view | Viewport | Theme and media |
| --- | --- | ---: | --- |
| `v18-01-global-ready-wide-light` | `global-ready`, active | 1440×900 | Light; default motion; forced colours none |
| `v18-02-day-ready-wide-dark` | `day-ready`, active | 1440×900 | Dark; default motion; forced colours none |
| `v18-03-item-conflict-medium-light` | `item-ready`, active | 960×900 | Light; default motion; forced colours none |
| `v18-04-field-ready-medium-dark` | `field-ready`, active | 960×900 | Dark; default motion; forced colours none |
| `v18-05-artwork-ready-compact-dark` | `artwork-ready`, active | 390×844 | Dark; default motion; forced colours none |
| `v18-06-upstream-revised-medium-light` | `upstream-revised`, active | 960×900 | Light; default motion; forced colours none |
| `v18-07-upstream-untagged-compact-light` | `upstream-untagged`, active | 390×844 | Light; default motion; forced colours none |
| `v18-08-upstream-deleted-compact-dark` | `upstream-deleted`, active | 390×844 | Dark; default motion; forced colours none |
| `v18-09-hidden-day-compact-light` | `hidden-day`, active | 390×844 | Light; default motion; forced colours none |
| `v18-10-filter-open-compact-dark` | `global-ready` + `compact-filtered-open`, active | 390×844 | Dark; default motion; forced colours none |
| `v18-11-loading-landscape-light` | `loading`, active | 568×320 | Light; reduced motion; forced colours none |
| `v18-12-interrupted-320-forced` | `interrupted`, active | 320×900 | Dark preference; reduced motion; forced colours active |
| `v18-13-failure-medium-light` | `failure`, active | 960×900 | Light; default motion; forced colours none |
| `v18-14-load-earlier-wide-dark` | `global-ready` + `pagination-both-success`, active | 1440×900 | Dark; default motion; forced colours none |
| `v18-15-empty-320-light` | `empty`, active | 320×900 | Light; default motion; forced colours none |
| `v18-16-archive-launcher-320-forced` | inactive inherited archive | 320×900 | Light preference; reduced motion; forced colours active |

Each sidecar must record target version `18`, loaded versions `[17,18]`, v18 fixture, optional allowlisted scenario, ordered safe scenario transcript, final snapshot, all invariant results, exact dimensions, generic URL/title/null history, no horizontal overflow, zero forbidden browser storage/registrations, localhost/data-only requests, zero console events, and zero exceptions. Archive frames must additionally pass launcher geometry, focus, hit-test, empty inactive host, and inherited-control non-intersection checks.

Evidence review also includes manual original-size inspection of all sixteen PNGs and a deterministic aggregate over all thirty-two PNG/JSON files.

## 7. Implementation and independent-QA gate

The implementing agent may begin only after `P=A`, `D=A`, and `C=A`. It must:

1. create only the six approved additive implementation/self-check files;
2. expose a v18 `window.__LID_QA__` target through the immutable v17 dispatcher, with manifest version `18`, loaded versions `[17,18]`, all fourteen fixtures, the exact two disjoint capture scenarios, the exact three primary rows, the supporting regression separately labelled, and the Outside UI boundary;
3. implement representative in-memory navigation/filter/disclosure/load transitions rather than a toast-only route;
4. hold zero mutation intents/effects/provider requests for every history interaction;
5. run syntax, `check-v18.mjs`, link, privacy, storage, network, console, responsive, focus, and inherited v17 checks;
6. capture and inspect the complete Section 6 roster with the v18 driver only after final bytes; and
7. seal the exact candidate before a fresh QA agent begins.

Fresh v18 QA is assigned to a new agent who did not implement or repair the candidate. That agent is strictly read-only and must rehash the complete manifest before and after the run. At minimum QA must independently verify:

- all five entry contexts and exact return focus/context;
- all fourteen fixtures, both allowlisted capture scenarios, the event cardinality/order/tie-break matrix, typed identity, predecessor/successor lineage, source/derived lane separation, contextual filters, and safe provenance disclosure;
- Current, Historical, Revised upstream, Untagged upstream, Deleted upstream, Conflict, Correction, and Derived Artifact states using text/programmatic identity beyond colour;
- read-only zero-mutation behavior before/after filtering, disclosure, loading, Back, Escape, and prior-feature navigation;
- hidden historical day behavior without ordinary Calendar/Almanac visibility, Trash mutation, or reconciliation claim;
- load initial/interrupted/failure/retry/success/duplicate-result behavior, retained reading anchor, exact added count, and logical focus;
- inherited v17 Atomic Redating success, duplicate-result cardinality, retained `Journal Date changed` event, Original Timestamp, source-set/artwork-history facts, direct v17 route, and latest-v18 launcher behavior;
- wide, medium, 390 px, 320 px, 568×320, light, dark, reduced-motion, forced-colours, keyboard, headings/landmarks, one h1, 13 px essential metadata, target sizes, contrast, live-region restraint, and horizontal reflow;
- generic URL/title/history, reload reset, zero browser storage/registrations, localhost/data-only requests, zero console/exception output, and forbidden-content scans; and
- exact proof limits, including `LID-VN-005` remaining external.

The verdict must name the exact candidate identity and record Critical/High/Medium/Low counts. Pass requires Critical 0 and High 0, with every Medium/Low finding fixed and retested or explicitly accepted/deferred by its named decision owner. A candidate, authority, fixture, evidence, or package byte change after QA starts invalidates the run. A failure remains v18, is repaired and completely recaptured/resealed, and receives a fresh agent run from zero.

## 8. Commit, push, readback, and successor gate

After independent QA Pass only:

1. **Implementation/evidence commit:** stage the explicit manifest roster only. If QA judged uncommitted bytes, commit exactly those tested bytes and prove every committed blob reproduces the held manifest and aggregate. Never amend the tested candidate.
2. **Documentation-only freeze successor:** add the independent QA record and post-QA handoff update. It must change no tested implementation, authority, fixture, package-plan, evidence, or manifest byte.
3. **Tracker-only successor:** record the exact implementation and freeze commit SHAs, verdict/severity/dispositions, proof limits, three bounded closures, and local freeze state. It must not invent its own future SHA.
4. Inspect `git diff --check`, unstaged/staged exact path lists, links, privacy-sensitive strings, and frozen-file hashes. Use no broad staging.
5. Push explicitly with `git push origin HEAD:refs/heads/codex/prototype-completeness-v17-v35`. Never force-push or use a bare push.
6. Read back `refs/heads/codex/prototype-completeness-v17-v35`; require full local/remote SHA equality and compare every committed candidate blob with the manifest.
7. Confirm `origin/main`, the frozen archive, maintained checkout, v1–v17 bytes, package/server files, unrelated work, and GitHub issues/projects were not mutated.
8. Only then set v18 `P/D/C/I/Q/F=A`, status `Complete`, close exactly `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` at the bounded frontend-prototype level, preserve `LID-SRC-004` as non-counted regression, preserve `LID-VN-005` as `Requires external evidence`, and update arithmetic to 22/57 closed and 35/57 open.
9. Publish and read back the tracker completion successor. Only after zero mismatch may v19 leave `Queued`.

## 9. Council-preparation exit criteria

The current preparation phase ends only when:

- the Product Manager's v18 contract is fixture-exact and records `P=A` or a named blocker;
- the UI/UX Designer's v18 contract is fixture-exact, evaluates at least two highest-risk interaction alternatives, and records `D=A` or a named blocker;
- Product, Design, and Project reconcile one shared scope, exact copy, ordering rule, state/fixture matrix, responsive/focus contract, privacy boundary, evidence roster, and exclusions;
- `COUNCIL-v18.md` records `C=A` or an explicit blocker requiring Arun;
- the living tracker is updated append-only without closing rows; and
- an implementing agent receives the exact approved roster and hashes.

Those conditions are now met. The permitted current package statement is: **V18 History and Provenance has approved Product, Design, and Council contracts and is in additive implementation. No implementation acceptance, independent QA, freeze, publication, or requirement closure is claimed.**

## 10. Append-only pre-hold capture-path clarification

On 2026-08-19, before candidate hold, Product, Design, and Project unanimously clarified the evidence mechanism without changing product meaning, fixture cardinality, event cardinality, closure scope, gate arithmetic, or proof boundaries:

- the implementation/self-check roster is exactly the six files in Section 4.2;
- all sixteen evidence pairs use the additive v18 driver;
- the frozen v17 helper remains unchanged at SHA-256 `860f01a5ea135d53650552c508a91f2c51ccf306b183e09486a3691e3afa3c37`;
- `fixtures` remains the exact ordered fourteen-key list in Section 6.1;
- `captureScenarios` is the exact ordered, disjoint two-key list `compact-filtered-open`, `pagination-both-success`;
- scenario actions are allowlisted in-memory transitions from fresh complete `global-ready`, never fixtures or URL/history/storage/viewport/theme selectors; and
- incompatible inputs, missing controls, transcript divergence, final-state mismatch, privacy/storage/network/console violations, or failed v18 invariants abort capture before evidence is written.

The exact scenario steps, expected keys/counts, focus/anchor observations, safe transcript, metadata, and privacy checks are frozen in the companion fixture authority and Council amendment. `P=A`, `D=A`, and `C=A` remain accepted; `I=IP`; `Q=—`; `F=—`; all three target rows remain open and program arithmetic remains 19/57 closed, 38/57 open.

## 11. Append-only final pre-hold implementation and proof clarification

Product and Design approved, and Project reconciled, the following additive requirements before candidate hold. They do not change the six-file implementation/self-check roster, fourteen fixtures, two capture scenarios, sixteen evidence pairs, exact event corpus, three closure targets, or CLI surface.

1. Fresh `item-ready` alone begins with `openDisclosureKeys=['E12']`; the other thirteen fixtures begin with `[]`. `E12` is a natively open `<details>` whose content orders **Event sequence** before **Record lineage**. Entry scroll is `0,0`, the item `h1` has focus, and the live region is empty. User close/reopen state survives rerender and hidden-day return; reset restores the fixture default.
2. Frame 3 uses fixture `item-ready`, `scenario=null`, and selector `[data-lid-v18-event-details="E12"]`. The driver records the initial state first, then only scrolls the already-open details for framing. It never clicks or dispatches to open it. The sidecar asserts the exact open key and DOM state.
3. `app-v18.js` owns pagination anchoring. A genuine visible lane Load activation captures a lane-and-generation baseline before pending at exact target `#lid-v18-load-source` or `#lid-v18-load-derived`. It preserves that record through pending; after a matching success, failure, interruption, or duplicate terminal render it restores the target within one CSS pixel, focuses it, and consumes the record exactly once. Stale or mismatched generations cannot restore. Visible outcome controls and QA deliveries share one reducer/render/restoration path.
4. `capture-phase2-evidence-v18.mjs` observes anchor geometry and focus but performs no post-activation scroll, focus, layout, DOM, CSS, or compensation. After fresh `global-ready` fixture setup, frame 14's scenario transcript has exactly five records: partial-page QA seed → actual Source Load → QA Source success → actual Derived Load → QA Derived success. Fixture setup is metadata, not a sixth scenario record. `check-v18.mjs` rejects helper-side compensation and proves the app-owned capture, generation match, terminal restoration, one-pixel tolerance, focus, consumption, and visible/QA path equivalence.
5. Every one of the sixteen driver invocations fails before output unless OPFS is supported, `navigator.storage.getDirectory()` is accessible, enumeration succeeds, and the root contains exactly zero entries. Each sidecar records `browserState.opfs={supported:true,accessible:true,entryCount:0,errorName:null}`; `check-v18.mjs` requires that strict fail-closed branch and record.
6. Self-check and independent live QA cover user close/reopen, rerender and hidden-day disclosure retention, reset defaults, frame-3 sidecar semantics, all four matching pagination terminal outcomes, stale-generation rejection, one-time anchor consumption, exact logical targets, helper passivity, and strict OPFS handling.

The accepted status remains `P=A`, `D=A`, `C=A`, `I=IP`, `Q=—`, `F=—`. All three target rows remain open; program arithmetic remains 19/57 closed and 38/57 open. This is authority only and claims no implementation acceptance, evidence completion, QA, freeze, publication, or production behavior.

## 12. Append-only pre-gate failure and repair plan

The final Product/Design pre-gate failed the current working bytes. [PRE-GATE-FAIL-v18.md](PRE-GATE-FAIL-v18.md) is the durable verdict: no P0, exactly one P1 / High false-provenance blocker, one P2 exact-return defect, no other blocker, `P=F`, `D=F`, superseded-contract `C=F`, and no independent QA. Product, Design, and Project then approved the binding replacement in C18-21; current contract gates are again `P=A`, `D=A`, `C=A`, while implementation remains `I=IP`.

### 12.1 Superseded working identity and evidence boundary

The exact six current implementation/self-check hashes and path-sorted aggregate `cca2b73673b95e454482ccbc1b11564be43ad269136a3b4bf005b19153d3ddf9` are recorded in the failure report and are superseded. The six-file roster itself does not change. `index-v18.html` remains in the roster and should remain byte-identical unless an independently recorded necessity arises; the authorized repair is within `app-v18.js`, `styles-v18.css`, `README-v18.md`, `check-v18.mjs`, and `capture-phase2-evidence-v18.mjs`.

No candidate manifest exists and the repository contains zero v18 PNG/JSON evidence files, so there is no candidate-manifest or 32-file evidence hash to carry forward. Any producer-local captures from the failed fingerprint are invalid and must not be copied, renamed, cited as accepted, or included in a future manifest.

### 12.2 Exact repair work

1. Delete inherited contextual patching: no relabelled day/item/artwork control, no injected Title/Summary/Tags control, no `data-lid-v18-*` decoration on inherited contextual nodes, no contextual click interception, and no observer of inherited-root/modal-root descendants. Retain only exact native Settings/More **History** → fresh Global capture-phase interception.
2. Add exactly one v18-owned canonical section with Product's exact copy, facts, button labels, order, fresh scopes, and Design's stable IDs/ARIA/list semantics. Insert it as the guarded direct-body sibling immediately after `#prototype-root` and before `#modal-root`; do not place it in prepended runtime root or mutable `#prototype-main`.
3. The placement observer is limited to direct `document.body` `childList`, queued and idempotent, and may restore only the owned panel's sibling relation. It never observes or changes an inherited descendant. Duplicate/missing/unrestorable placement fails closed.
4. Retire the floating runtime launcher from visible, focus, hit-test, and accessibility surfaces and remove automatic v18 startup. The inactive v18 page shows the native archive and canonical section. Any active v17/v18 capsule hides the section from layout and accessibility.
5. Open only from the four owned buttons or the two native generic Global actions. Preserve the scope-specific Back labels. Back and Escape restore the same connected invoker, focus, `window.scrollY`, and invoker viewport top within one CSS pixel; app-owned correction is post-render and one-shot.
6. Preserve the exact seventeen events, fourteen fixture keys/order, two scenario keys/order, Source/Derived state, default disclosures, filters, pagination, loading, source-context mapping, privacy, domain fingerprint, and 0/0/0 counters.

### 12.3 Static, live, and capture gates

`check-v18.mjs` must reject the old `patchInheritedEntrypoints`, `.lid-injected-history-v18`, inherited contextual `data-lid-v18-*`, inherited-root/modal-root entry observer, contextual v16 interception, visible/eligible launcher, automatic startup, wrong placement, wrong copy/order/scope, duplicate panel, unsafe observer, missing active-state hiding, wrong Back copy, or helper-side return compensation.

Static and live checks must expose `inheritedContextPatchedCount=0`. They snapshot text and attributes before/after for the frozen 2 Aug **View day history**, **Before sleep — synthetic fixture** / **Revisions & provenance**, and **View versions** controls; assert zero injected Manage Reflection History buttons; activate each native control; and prove v18 remains inactive while native v16 behavior continues.

The six positive origin pairs are native Settings History, native compact More History, canonical Day, canonical Source Item, canonical Summary, and canonical Artwork. Live checks exercise pointer, Enter, Space, Back, and Escape; exact fresh scope/count/content; same connected invoker/focus; both scroll measurements within one pixel; panel hidden/non-AX/non-hit while active; launcher user-surface absence; responsive/forced-colour geometry; privacy; zero mutations/providers; and direct-v17 regression.

The sixteen-frame roster is unchanged in cardinality. Frame 16 alone replaces `v18-16-archive-launcher-320-forced` with `v18-16-canonical-entry-320-forced`. The v18 helper is explicitly authorized to inspect and round-trip the two generic Global controls and all four canonical panel controls, record the bounded safe diagnostics in fixture authority Section 16, and capture the final inactive canonical section. It must prove `inheritedContextPatchedCount=0`, exactly two native Global origins and no other inherited v18 origin, launcher absence from every user surface, and exact return without using helper-side focus/scroll compensation.

After repair, run all static and live self-checks, regenerate all sixteen final-byte PNG/JSON pairs, inspect them, and create a wholly new candidate manifest. Only then may a fresh independent QA agent begin from zero. No row closes and no commit/push occurs at this plan stage. Status is `Implementation in progress`; `P=A`; `D=A`; `C=A`; `I=IP`; `Q=—`; `F=—`; arithmetic remains 19/57 closed and 38/57 open.

## 13. Append-only frame-16 evidence-stage plan

Product and Design approved the exact C18-22 environment sequence. Project retains the sixteen-pair roster and authorizes only evidence/check/document alignment within the already-approved six-file package; this authority edit itself changes no README, checker, helper, implementation, or evidence byte.

Frame 16 must start inactive at 320×900, move inactive to 1024×900 for one actual Settings round trip, return inactive to 320×900 for actual compact More and Day/Item/Summary/Artwork round trips, and capture the final PNG there. Each resize occurs only after the preceding trip and app-owned restoration are fully consumed. The helper records environment stages and measurements but cannot make viewport a fixture/scenario/domain input or provide focus/scroll compensation after a baseline.

The exact validation additions are: ordered three-entry `viewportStages`; six trip records in Settings, More, Day, Item, Summary, Artwork order; actual visible/enabled/hit/accessibility controls; Settings measurements entirely at 1024×900; the other five entirely at 320×900; per-trip dimensions, digest, and counters; and final top-level 320×900 with Settings hidden, More reachable, one-column panel, inactive/no-pending state, and Artwork-button focus.

Historical aggregate correction: the failed pre-C18-21 six-file bytes and their individual hashes remain exactly those recorded in the failure chronology. For those exact repository-relative `sha256  path` lines, the controlling aggregate produced by `LC_ALL=C sort` over the complete records is `852fcedaba5e26a4cea7f92de5b9c9baa1fdaf36693a00fcc72523b76acb092b`. The earlier `cca2b73673b95e454482ccbc1b11564be43ad269136a3b4bf005b19153d3ddf9` is a separately path-key-sorted derivative, not the canonical failed-byte aggregate; neither identifies the current repaired core.

No new fixture, event, scenario, frame, CLI option, requirement, closure, or evidence conclusion is introduced. `P=A`; `D=A`; `C=A`; core implementation is producer-stable and evidence remains `I=IP`; `Q=—`; `F=—`; arithmetic remains 19/57 closed and 38/57 open.
