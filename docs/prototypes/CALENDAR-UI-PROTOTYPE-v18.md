# Life in Days calendar UI prototype v18 — History and Provenance

> **QA Round 3 held-candidate handoff · P=A · D=A · C=A · I=A locally · C0/H0/M0/L0 · historical Rounds 1–2 remain F · Round 3 pending · F=—**

V18 is the additive `PVA-013 History and Provenance` capsule built on frozen V16 and the immutable V17 compatibility runtime. It renders separate Source and Derived history lanes; complete event and record lineage; revised, conflict, untagged, and deleted-upstream states; hidden-day history; filters; bounded pagination; exact focus/return behavior; and a read-only provenance model without changing the archive.

This handoff preserves both rejected candidate rounds. [Independent QA Round 1](v18/DESIGN-QA-v18-round1.md) failed the original held manifest with three Medium visual-evidence findings. [Independent QA Round 2](v18/DESIGN-QA-v18-round2.md) failed the unchanged 48-record replacement with one formal Medium blocker; supplemental adversarial review expanded the repair ledger to three Medium and two Low defects. All findings are repaired, definitive repository evidence is recaptured, and the 49-record [Round 3 checksum manifest](v18/V18-CANDIDATE-MANIFEST.sha256) is held. Independent Round 3, freeze, commit, push, readback, GitHub closure, and V19 remain pending.

## Open locally

From `prototypes/calendar-ui`:

```sh
node check-v18.mjs
LIFE_IN_DAYS_PROTOTYPE_PORT=4317 node serve.mjs
```

Open `http://127.0.0.1:4317/index-v18.html`. V18 clears inherited query/hash state while active. Direct `index-v17.html` remains separately reachable and unchanged.

## What to review

- Global **History** opens only from the exact native Settings and compact More controls.
- A clearly labelled, normal-flow **Open canonical History contexts** panel exposes four fixed fictional entry points for the governed 17 August / Monsoon fixture. It is outside inherited archive records and explains that it does not describe the selected frozen-V16 content.
- Unrelated frozen-V16 day, Source Item, generated-field, and artwork actions remain native, undecorated, and unable to open V18.
- Global, day, Source Item, Summary, and artwork scopes use exact headings, scope facts, Back labels, and Source/Derived counts.
- Item scope starts with native E12 provenance open; **Event sequence** precedes **Record lineage**. Relation links only focus/reveal represented events.
- Source lifecycle fixtures distinguish revised, conflict, untagged, and deleted-upstream truth. The separate hidden-day fixture is 11 August 2026 and never implies restoration or deletion.
- Four explicit filters apply only on command. Compact filters use one native `<details>`; wide layout presents the same single semantic form as a non-scrolling rail.
- Source and Derived pagination are independent. Genuine Load activation owns a generation-bound anchor; success, failure, interruption, and duplicate outcomes restore the logical target within one CSS pixel.
- The feature stays read-only: `mutationIntents=0`, `mutationEffects=0`, and `providerRequests=0` across every fixture, transition, and evidence scenario.

## Exact state and evidence cardinality

- **17** represented typed events: `E01`–`E17`.
- **14** ordered top-level fixtures.
- **2** disjoint capture-only scenarios: `compact-filtered-open`, `pagination-both-success`.
- **16** final PNG/JSON evidence pairs.
- **6** additive implementation/self-check assets.

The package targets exactly `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004`. `LID-SRC-004` is supporting regression only. `LID-VN-005` remains **Requires external evidence**.

## Round 1 implementation/tool identity — rejected historical candidate

| Artifact | SHA-256 |
| --- | --- |
| `index-v18.html` | `fc0b2466be93334283aac7338a0c502de8840d2494c5f250489f8190c5aa96ec` |
| `app-v18.js` | `7eb6c2f45eb53fb428bb620618c56f6d5262b3eb762e049af75c17d873980e74` |
| `styles-v18.css` | `bfb3757a0fa1b6b7848060d799460e899dd7c6c0b7b8b304180f88e97a5b0f41` |
| `README-v18.md` | `69fe36d008f90248ab4190f00d66bd0d36a8773797d122e45c02979a5d308ccb` |
| `check-v18.mjs` | `d1c49f696b9bbb5462f6587f9a72e2896e13f2269918b90c48a1c7f0d63723f9` |
| `capture-phase2-evidence-v18.mjs` | `765639709496db6b10b8eba5a14c18f3c70bc7e265086b2f499f99fb89072498` |

Six-record aggregate: `41b5a6ff8761d00808e58713ae1aacf6f287c2a152a0f7f60473a79bd520df58`.

## Round 1 repository evidence — rejected historical set

The sixteen final pairs in `docs/prototypes/v18/` were captured from `2026-08-20T04:58:37.757Z` through `2026-08-20T04:59:00.687Z`. The 32-file aggregate is:

`2e30a2af078271f07d005cc04d06fae3b9573a54adab386fda5c442df1e63f2e`

The producer-side independent inspection reproduced 32/32 hashes/dimensions, 400/400 invariant assertions, 96/96 privacy assertions, strict empty OPFS, zero other browser storage/registrations, localhost/data-only requests, zero console events/exceptions, zero horizontal overflow, and chronology after the final tool/UI bytes. Every PNG was inspected at its original size.

Frames 3, 10, 14, and 16 additionally prove the already-open E12 provenance body, compact real-control filtering, app-owned two-lane pagination success, and the staged 320→1024→320 six-origin canonical/global archive procedure respectively.

## Pre–Round 1 failure and repair history

The original contextual-entry candidate failed because arbitrary inherited records opened unrelated fixed history and return geometry exceeded tolerance. C18-21 replaced that mapping with truthful Global/canonical origins. Subsequent gates repaired the compact More hidden-modal Tab interception and the valid pre-artwork optional-control invariant. No failed byte set or capture was reused.

The final fresh gates returned:

- Product: **A — Critical 0 / High 0 / Medium 0 / Low 0**;
- Design: **A — Critical 0 / High 0 / Medium 0 / Low 0**;
- Council: **A**;
- Implementation/evidence: **A locally**; and
- Independent QA / freeze: **Pending**.

## Governing records

- [Product acceptance](v18/PRODUCT-ACCEPTANCE-v18.md)
- [UX contract](v18/UX-CONTRACT-v18.md)
- [Package plan](v18/PACKAGE-PLAN-v18.md)
- [Council decision](v18/COUNCIL-v18.md)
- [Fixture authority](v18/HISTORY-PROVENANCE-FIXTURES-v18.md)
- [Durable pre-gate failure](v18/PRE-GATE-FAIL-v18.md)
- [Final Product/Design recheck](v18/PRODUCT-DESIGN-RECHECK-v18.md)
- [Independent QA Round 1](v18/DESIGN-QA-v18-round1.md)
- [Independent QA Round 2](v18/DESIGN-QA-v18-round2.md)
- [Living tracker](../phase2/PROTOTYPE-COMPLETENESS-PROJECT-TRACKER-v17-v35.md)

## Explicit limits

This package does not prove backend/durable history, persistence, VoiceNotes authority or reconciliation, complete enumeration, transactionality, concurrency, idempotency, retry/restart/rollback recovery, provider execution, authentication, authorization, encryption, production privacy/security, deployment, operations, or production readiness. It is not a formal accessibility conformance audit; no real screen-reader/assistive-technology, hardware-touch, mobile-OS, or native-zoom matrix is claimed. Forced colours and reduced motion were browser-emulated.

## Round 1 hold boundary — rejected history

All three V18 target rows remain open. Program arithmetic remains **19/57 closed / 38/57 open**. The next permitted action is candidate-manifest sealing followed by a fresh independent read-only QA run. Any candidate or manifest byte change after assignment invalidates the run. V19 remains queued until V18 passes QA, freeze, push, and remote readback.

## Post–Round 1 repaired-local checkpoint — preserved pre-recapture status

Round 1 remains a durable **FAIL — Critical 0 / High 0 / Medium 3 / Low 0** on manifest SHA-256 `c1b938e59b8db0904bd6899eb852af263a58f718d06c55b7b3e7770fd552c127` and exact 47-file aggregate `8b08849523b49cbe06a9b915b6aa577ee171799acd3ea52517e1ed6bc1c6d962`. Its repository evidence remains rejected and cannot be reused for a replacement candidate.

### Exact repaired local implementation/tool identity

| Artifact | SHA-256 |
| --- | --- |
| `index-v18.html` | `fc0b2466be93334283aac7338a0c502de8840d2494c5f250489f8190c5aa96ec` |
| `app-v18.js` | `33c1cef97a8a9b5e0249efe790cdaf5758d2288508207fe3f5538672b88cec2f` |
| `styles-v18.css` | `b3a0ef2f1da0df143cb5f4c7800942722a4a11ccce76d57fb4bc7e5105315551` |
| `README-v18.md` | `52b1d21016a61655edd283062abda652642c5e15edebe44cb6a17eef9ff5a50a` |
| `check-v18.mjs` | `c8b8cba69557a866b2bbce95c064edbbba3325662f29668b242d03458105a50b` |
| `capture-phase2-evidence-v18.mjs` | `72c5d82c5bb6a4daec8f3105d232f9befe1263aa3171bb097d0a75dd1a275337` |

Six-record complete-record `LC_ALL=C sort` aggregate: `1ec09b3320b655278895d4d31dbc5f2e6d9b10c77c776b782e2a1dffdb85767a`.

### Round 1 finding repairs

- **M1:** the exact closed framing map now uses one bounded passive pre-capture scroll for frames 02, 03, 05–09, 12, 13, and 15, proving named visible targets, fit, rectangles, no fixed/sticky overlap, and unchanged state/focus; medium E12 compacts whitespace only. Frame 14 retains its exact five-record scenario and adds the truthful normal-flow two-lane completion summary with the focused Derived beginning marker visibly outlined.
- **M2:** frame 10 reaches and reopens **Filter history · 2 active** through real Shift+Tab then Enter, retains summary focus, and requires a rendered `:focus-visible` outline or shadow; direct focus and pointer reopening are rejected.
- **M3:** compact safe-area spacing plus the sole permitted pre-baseline Artwork scroll establishes 12-pixel navigation clearance. The driver then passively waits for the native 4.2-second Settings toast expiry and requires unchanged state/focus/scroll, no toast, full canonical content and panel boundary, visible Artwork focus, and both clearances at least 12 pixels.

The repair owner's full temporary sixteen-pair rehearsal reported **400/400 invariant assertions** and **96/96 privacy assertions**. It is temporary producer evidence only: it is not the repository recapture, a replacement manifest or hold, independent QA, or freeze. Fresh Product and Design repair rechecks both returned **A — C0/H0/M0/L0** on the repaired local bytes; those owner checks are not Round 2 QA.

Current gates are `P=A`, `D=A`, `C=A`, `I=A` repaired locally, `Q=F` for historical Round 1 with fresh Round 2 pending, and `F=—`. The next work is complete repository recapture and inspection, replacement manifest preparation, then a fresh independent Round 2 run. No such step is claimed here. All three V18 rows remain open, arithmetic remains **19/57 closed / 38/57 open**, and V19–V35 remain queued.

## QA Round 2 held-candidate handoff — preserved rejected identity

The replacement repository evidence contains exactly sixteen PNG/JSON pairs captured from `2026-08-20T06:49:33.313Z` through `2026-08-20T06:50:01.378Z`. The 32 complete evidence checksum records produce aggregate:

`fcd9e2160f9dc624f671c9769acb16732a35504bceb999ff1f9ebe9120d645e4`

The recapture reports **400/400 invariant assertions**, **96/96 privacy assertions**, zero console events or browser exceptions, zero browser storage/registrations including OPFS entries, zero external requests, and zero horizontal overflow. Root-agent original-size inspection passed all **16/16 PNGs**, including the exact Round 1 M1 framing repairs, M2 visible keyboard focus, and M3 toast/navigation clearance.

The held implementation/tool identity remains exactly the repaired six hashes in the preceding checkpoint, with complete-record aggregate `1ec09b3320b655278895d4d31dbc5f2e6d9b10c77c776b782e2a1dffdb85767a`. Fresh Product and Design repair rechecks both returned **A — C0/H0/M0/L0** on these held bytes. These owner gates are not independent Round 2 QA.

The self-reference-free replacement manifest lists exactly 48 records: five authority documents; the durable pre-gate failure; Product/Design recheck; living tracker; this handoff; the preserved Round 1 QA report; all 32 replacement evidence files; and six implementation/tool assets. The manifest itself is outside its aggregate and own hash. Worktree HEAD at hold remains `8d94a61be8a7e7d6114b3a3b5b3963f23421e445`; the frozen merge base remains `01d1f054a12773e07f91096b8d76b0c5f4064329`.

Round 1 remains **FAIL — C0/H0/M3/L0** on obsolete manifest `c1b938e59b8db0904bd6899eb852af263a58f718d06c55b7b3e7770fd552c127` and obsolete aggregate `8b08849523b49cbe06a9b915b6aa577ee171799acd3ea52517e1ed6bc1c6d962`. Current gates are `P=A`, `D=A`, `C=A`, `I=A`, historical Round 1 `Q=F` with fresh Round 2 pending, and `F=—`. All three V18 rows remain open, arithmetic remains **19/57 closed / 38/57 open**, and V19–V35 remain queued. No Round 2 verdict, freeze, commit, push, readback, GitHub mutation, or closure is claimed.

## QA Round 2 rejection handoff — preserved history

Formal independent `/root/qa_v18_round2` returned **FAIL — C0/H0/M1/L0** against the unchanged Round 2 manifest SHA-256 `8746079b78e361e3402e1487f1561a87532dd3b0240fe7d8e90ad95a4856a5ab` and exact 48-file aggregate `eb27347306389ca69168b5e6eb0b229159f57dd63fac50e2c4d3105ecaec03ca`. All 48 records and the manifest matched at start and end, staged paths remained zero, and the root recorded the end state at `2026-08-20T12:43:57+05:30`.

Frame 16 still places the canonical panel beneath the inherited banner: banner bottom `66`, panel top `18.5625`, exact overlap `47.4375` CSS pixels. The overlap clips the top border and most of **PROTOTYPE V18 · FIXED SYNTHETIC CONTEXTS**. An exact helper rerun reproduced it. Round 1 M1 framing and M2 focus passed; Round 1 M3 remains failed.

Supplemental `/root/qa_v18_adversarial` added:

- Medium: filtered post-pagination visible `E14,E13,E12` still reports unfiltered Source `10 shown` and Derived `7 shown`;
- Medium: generationless success aliases bypass matching-generation settlement;
- Low: click-only pagination bypasses the anchor baseline and jumps `1767.1875` CSS pixels; assistive-technology behavior is untested; and
- Low: hidden 0×0 Settings **History** can activate programmatically at 320 px although ordinary users cannot reach it.

The consolidated repair ledger is **C0/H0/M3/L2**, with no acceptance or deferral. Broad live expansion stopped fail-fast after the formal blocker; unrun branches are not passed by implication.

Current gates are `P=F`, `D=F`, `C=A`, `I=IP`, `Q=F`, `F=—`. The rejected Round 2 manifest remains historical evidence only. Repair all five findings in the same v18, rerun Product and Design, completely recapture and inspect evidence, seal a new manifest, then start a fresh independent run from zero. All three target rows remain open, arithmetic remains **19/57 closed / 38/57 open**, and V19–V35 remain queued.

## Final pre–Round 3 repaired-local handoff — preserved pre-recapture status

Both failure records remain controlling history: Round 1 **FAIL — C0/H0/M3/L0** on manifest `c1b938e59b8db0904bd6899eb852af263a58f718d06c55b7b3e7770fd552c127` / aggregate `8b08849523b49cbe06a9b915b6aa577ee171799acd3ea52517e1ed6bc1c6d962`; Round 2 formal **FAIL — C0/H0/M1/L0**, consolidated **C0/H0/M3/L2**, on manifest `8746079b78e361e3402e1487f1561a87532dd3b0240fe7d8e90ad95a4856a5ab` / aggregate `eb27347306389ca69168b5e6eb0b229159f57dd63fac50e2c4d3105ecaec03ca`. No finding was erased or deferred.

### Exact final repaired local identity

| Artifact | SHA-256 |
| --- | --- |
| `index-v18.html` | `fc0b2466be93334283aac7338a0c502de8840d2494c5f250489f8190c5aa96ec` |
| `app-v18.js` | `db445d881cb48f873896b7e52a3bbafc59cbcfcdfc78ffb31caaa5f56b8207ca` |
| `styles-v18.css` | `dcd32125a176943f9c059d4f3344c331fed5e627d5ea2f2dd7cc167501593451` |
| `README-v18.md` | `a2859496b9082ced29deab69f53c8853c7aa6553157f43ddfa31f99975bd74da` |
| `check-v18.mjs` | `ec035b3b28a815b8dab8713d355f48e84186d1e86620d0ab6251399d6888f21a` |
| `capture-phase2-evidence-v18.mjs` | `f3b66d390d3e8c1a814507376c82a893af52f812c592b30dfbdab9f315d2ba78` |

Six-record complete-record aggregate: `36486ecad780f3b83a56768d3710b1f1d87c6b75eea9bf84dfe486e8ab6cf17c`.

The final repair set now proves:

- the complete frame-16 canonical panel, exact eyebrow and borders, all four entries, Artwork focus, and at least 12-pixel clearance within the 66–834 fixed-surface band;
- suppression of the pagination completion summary whenever filters are active, exact filtered `E14,E13,E12`, and truthful 10/7 restoration on Clear without pagination drift;
- explicit positive matching generations for every terminal outcome/alias, with all missing, invalid, stale, future, cross-lane, wrong-stage, or consumed deliveries strict no-ops;
- pointer, Enter, Space, and click-only app-owned pagination anchors with one generation and focus/top restoration within one pixel, while making no assistive-technology claim;
- hidden/non-rendered/zero-size origins as side-effect-free v18 no-ops before event suppression, while eligible origins retain exact return;
- Global More through 960 px and Settings from 961 px, independently of compact filters through 1023 px and wide filters from 1024 px; and
- frame 11's passive 568×320 exact Source-loading proof: sole busy named Source lane, both loading headings/body in the safe band, unchanged integrity digest, and intentionally offscreen h1 focus preserved.

Fresh Product and Design rechecks both returned **A — C0/H0/M0/L0**. A full temporary sixteen-pair rehearsal returned **400/400 invariants**, **96/96 privacy**, and zero console, exception, browser-state/OPFS, external-request, or overflow issue. Those owner checks do not replace definitive repository recapture or independent QA.

Repository evidence and both prior manifests remain obsolete. Current gates are `P=A`, `D=A`, `C=A`, `I=A` locally, historical Rounds 1–2 `Q=F` with fresh Round 3 pending, and `F=—`. The next actions are definitive recapture and inspection, a wholly new manifest, and fresh independent Round 3 from zero. All three target rows remain open, arithmetic remains **19/57 closed / 38/57 open**, and V19–V35 remain queued.

## QA Round 3 held-candidate handoff — current status

The definitive repository recapture contains exactly 16 PNG and 16 JSON files generated from the final six-byte identity above. Its sidecar chronology runs from `2026-08-20T08:55:31.442Z` through `2026-08-20T08:56:28.255Z`, and its 32-record aggregate is:

`11297ee0c6d3ff251e611d0cea1d65da56fe632d807cf12a7c18b4008a0c710f`

All **400/400 invariant assertions** and **96/96 privacy assertions** pass. Recorded console events, browser exceptions, browser storage/registrations including OPFS entries, external requests, and horizontal overflow are all zero. Product and Design remain freshly accepted at **A — C0/H0/M0/L0**; Council and local implementation are `A` on the exact held bytes.

`V18-CANDIDATE-MANIFEST.sha256` lists exactly 49 held records and no self-record: five authority documents; pre-gate failure; Product/Design recheck; tracker; this handoff; both prior QA reports; 32 definitive evidence files; and six final assets. The manifest's held aggregate and self-hash are external assignment identities, avoiding circularity.

Round 1 and Round 2 reports, manifests, aggregates, findings, and limits remain rejected history. Current gates are `P=A`, `D=A`, `C=A`, `I=A` locally, fresh Round 3 `Q=—` pending with historical Rounds 1–2 `F`, and `F=—`. All three target rows remain open, arithmetic remains **19/57 closed / 38/57 open**, and V19–V35 remain queued. V19 is additionally user-gated. No QA3 report, verdict, freeze, stage, commit, push, remote readback, GitHub mutation, or closure exists.
