# Life in Days — Source Conflict Resolution prototype v16

Date: 2026-08-19
Branch: `prototype/calendar-ui-v16-source-conflict-resolution`
Baseline: frozen v15 implementation/evidence `14a490d5ac835efc9bae6508ec9a15ebfba38cba`, documentation-only freeze record `d51c2c66fdeb32071392135cc808076e14fc51fa`, and final tracker record `e51dfc6d7c47f48ad3623210609ed89e6fa4161c`
Status: **independently passed and frozen at implementation/evidence commit `75dc994c95a3e368f1663eba81dc9549fd85b024`; package Complete; this documentation-only commit is the freeze record; P=A; D=A; C=A; I=A; Q=A**

## Stable feature candidate

At this post-QA/pre-commit snapshot, v16 implements the bounded frontend-prototype slice of `PVA-011 Source Conflict Resolution`, audit gap 5's source-conflict portion, and `LID-SRC-002`. Product, Design, and Council gates are **A**. `/root/v16_independent_qa_final` independently passed the exact held bytes and all 22 current-run frames with unresolved Critical 0, High 0, Medium 0, Low 0. Implementation remains **IP** until the implementation/evidence commit, and v16 is not frozen.

## Behavior represented

| Area | Independently passed v16 candidate behavior |
| --- | --- |
| Entry | A corrected Voice Journal Source Item keeps a persistent **Review source update** entry until one outcome settles. Cancel and navigation do not choose an outcome. |
| Complete comparison | A dedicated h1-focused workbench presents complete C1 then complete immutable R2, with side-by-side wide presentation, a compact full-document switcher, optional labeled Changes-only view, expandable unchanged content, and one page scroll. |
| Outcome choice | Exactly three equal outcomes appear in fixed order: Keep C1, display R2 while retaining C1 as Historical, or manually create C2 based on R2 with C1 lineage. A separate Cancel leaves U0 unchanged. |
| Preview/workspace | Every outcome has a consequence preview. The manual workspace exposes complete C1/R2 references, starts only from C1, inserts no R2 text, and requires a non-whitespace draft distinct from both C1 and R2. |
| Guarded result | One accepted intent creates at most one matching terminal event and at most one C2. Known-zero Retry reuses the same intent; unknown results reconcile read-only; duplicate, late, restored, foreign, and replayed callbacks cannot add another result. |
| R3/concurrency | A pre-acceptance R3 stales the R2 snapshot with zero resolution event. Post-acceptance result-unknown retains its original authority until reconciliation. A trusted R2 terminal remains once before a later R3 generation is represented. |
| Navigation/session | Cancel restores day, invoker, and scroll; Back/Forward cannot replay effects; dirty workspace exit warns; pending/unknown navigation locks; session expiry clears private draft and does not invent or erase a terminal. |
| Accessibility/responsive | Deterministic keyboard, focus, announcement, target, contrast, forced-colors, reduced-motion, wide, compact, landscape, and prescribed 640/320 px reflow-equivalent contracts independently passed under the disclosed in-app-browser limits. |
| Privacy | Synthetic source, Correction, draft, intent, choice, result, conflict, focus, and fixture values remain out of URL, title, history payload, storage, requests, console, telemetry, unrelated accessible names, and live-region content. |
| Boundary | Frozen v6–v15 behavior and bytes remain inherited. V17 owns redating; v18/later owns complete History. No real provider, durable storage, backend, encryption, authentication, deployment, production, or formal conformance claim is made. |

## Exact held candidate identity

The current evidence is bound to these exact eleven UI artifacts:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/index-v16.html` | `c6df9d7c05d506efe39d1df7f311930f097e3ab8fcd9401517170d78f41fe413` |
| `prototypes/calendar-ui/app-v16.js` | `cca04c3db1938331479af6c63423ec7874b9ea0a3dd808b15e22cb0e7b13968f` |
| `prototypes/calendar-ui/styles-v16.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `prototypes/calendar-ui/styles-v16-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `prototypes/calendar-ui/styles-v16-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |
| `prototypes/calendar-ui/styles-v16-resilience.css` | `d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c` |
| `prototypes/calendar-ui/styles-v16-date-review.css` | `525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5` |
| `prototypes/calendar-ui/styles-v16-telegram.css` | `6489ac5e330af80c0488ed411229a6256d13765535b8cdf2eb9a3e42a21e4992` |
| `prototypes/calendar-ui/styles-v16-upload.css` | `ca45322956ba372850550be860a02bcd6b63735108808d1612033bf327b81b74` |
| `prototypes/calendar-ui/styles-v16-correction.css` | `8a97c0d60b3871ecbdd690f213407cec7388a4890a77a2ae0d9ba6826a654c5e` |
| `prototypes/calendar-ui/styles-v16-conflict.css` | `2b9d8b7de6c5e5f24b5d7b1b3e428573783ffae1d895ccb7b9e4d4266fe6bfce` |

The separate package/check artifact is:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/package.json` | `81719c71b307e1c5724e69625cdc015912bbfd3b0aa0ff1209ad7cdbddb39a5d` |

The exact governing inputs are:

| Input | SHA-256 |
| --- | --- |
| `docs/prototypes/v16/COUNCIL-v16.md` | `822931df91eaee568887f642a76243f84c4a41bc4bb90ebd3f70c0db44b1e6d5` |
| `docs/prototypes/v16/SOURCE-CONFLICT-FIXTURES-v16.md` | `7e933a6bfcd9f5f30c20a50f1c606e5c1130129af16da6e6b4e675f57df012ca` |

The byte-identical authority roster is SHA-256 `2859f9192d0c2f5cbecaea29fe84cb11efc018d73fc8061c27a3a85f037b59d0`. Any UI-byte change invalidates all 22 frames and restarts independent QA from zero. A package-byte change requires a new package identity and repeated static checks. An authority-input change reopens Council before QA.

## Current-run evidence manifest

The authoritative filenames and capture conditions come from [Source Conflict Fixtures v16](v16/SOURCE-CONFLICT-FIXTURES-v16.md#23-frozen-22-frame-roster). The evidence owner captured the files after holding the UI fingerprint, and `/root/v16_independent_qa_final` independently inspected all 22 at original size. Exact roster and order, dimensions, RGB8 non-interlaced mechanics, unique hashes, repository-byte parity, and ordered aggregate `4926b79c07bc37d48cbce9f28ce891c04b12da42c4ba16204a98b89f773b8731` passed.

| File | Required capture | Theme | Required proof | Verified dimensions | SHA-256 | Format |
| --- | --- | --- | --- | --- | --- | --- |
| `v16-01-source-update-launch-light.png` | 1440×900 | Light | Persistent conflict entry on the corrected Source Item | 1440×900 | `ee2a66710fd2c6cf7901294dbfa9224c6f5337238450fd9223ed77daf695f9df` | PNG · RGB8 · non-interlaced |
| `v16-02-complete-conflict-review-dark.png` | 1440×900 | Dark | Complete C1/R2 side-by-side review | 1440×900 | `c605afc5490fd762427229da245fc90e42f2377f34183adb109bf46c360b499f` | PNG · RGB8 · non-interlaced |
| `v16-03-changes-only-expanded-light.png` | 1440×900 | Light | Text-labeled changes, omission count, unchanged section expanded | 1440×900 | `62e07704e88394b04fec73efd0b98e703f80685e14046168396f80420b86e55f` | PNG · RGB8 · non-interlaced |
| `v16-04-long-complete-comparison-dark.png` | 1440×900 | Dark | Long inert complete documents with no nested-scroll trap | 1440×900 | `fecbcca70587173c19ee1a15dd5bb9548f2afbb3309f6c2870e5190550136940` | PNG · RGB8 · non-interlaced |
| `v16-05-keep-preview-light.png` | 1280×720 | Light | Keep consequence preview | 1280×720 | `f045db0bb9164fd38f10063b6ebd8c556b37dd61cff9274f717b7c2fe7ee984a` | PNG · RGB8 · non-interlaced |
| `v16-06-keep-success-dark.png` | 1280×720 | Dark | C1 displayed, R2 reviewed, one bounded event | 1280×720 | `b26fee867c07034e72f9296335cafd0da5e7fb82ce758f0e3d221ecb3ddc69c5` | PNG · RGB8 · non-interlaced |
| `v16-07-display-newest-preview-light.png` | 1280×720 | Light | Display-newest consequence and no-deletion copy | 1280×720 | `11873b98c02b54f2ddabade3924d68d1f4fc9aff492c01b55f707ee5fd879ff9` | PNG · RGB8 · non-interlaced |
| `v16-08-display-newest-success-dark.png` | 1280×720 | Dark | R2 displayed, C1 Historical and retained | 1280×720 | `c5db1bd54ce3600a28026abdea48e7fea76f62b554e9a97c1c065edc4dc5a466` | PNG · RGB8 · non-interlaced |
| `v16-09-based-on-both-preview-light.png` | 960×900 | Light | Manual-workspace/no-auto-merge preview | 960×900 | `643168bef7b80f7c4117633b02ab101d3736a03d26a8e5001606f901c5c6fee9` | PNG · RGB8 · non-interlaced |
| `v16-10-based-on-both-workspace-dark.png` | 960×900 | Dark | Complete C1/R2 references; editor prefilled only with C1 | 960×900 | `a3038520911b10b4a4a83474b1d2a44461ca7166b52243a1b854f579b17a11d4` | PNG · RGB8 · non-interlaced |
| `v16-11-manual-draft-light.png` | 960×900 | Light | C2 differs from C1/R2; dirty state | 960×900 | `8e0036ad49440597b44c819710620796c8723405e29a659a975eb988ba273bbf` | PNG · RGB8 · non-interlaced |
| `v16-12-new-correction-success-dark.png` | 960×900 | Dark | C2 displayed; R2 base and C1 lineage visible | 960×900 | `5ae09a4276d8c085839b4cd387ef912fa8b1bc5a7a3109f726f941651244a071` | PNG · RGB8 · non-interlaced |
| `v16-13-cancel-unresolved-light.png` | 700×900 | Light | Returned source card; conflict still present; zero event | 700×900 | `d726bde6ab888905f34a78eb2b4958ccecf25a50a9cee7ad412acccf9fdb9729` | PNG · RGB8 · non-interlaced |
| `v16-14-resolution-pending-dark.png` | 700×900 | Dark | Named pending state with outcomes/dismissal locked | 700×900 | `a5a8de6a3c15a5185fd3e3988872b46458b10330a45ec4e8ea772165105c028a` | PNG · RGB8 · non-interlaced |
| `v16-15-resolution-failure-light.png` | 700×900 | Light | Known-zero failure and same-intent Retry | 700×900 | `ac5b9e49c5056b1556acaf32809e8eeb4254b49af988dc8dd7ca0ef438c934d1` | PNG · RGB8 · non-interlaced |
| `v16-16-resolution-unknown-dark.png` | 700×900 | Dark | Unknown result and Check resolution status | 700×900 | `1114785a8d88c4ad87e4d9802f95aadf5ad2efa7ad4966f4ddef81e627904ae6` | PNG · RGB8 · non-interlaced |
| `v16-17-unsaved-workspace-200pct-light.png` | 640×900 at 200% text zoom | Light | Unsaved C2 warning and ordered actions | 640×900 | `46c69a1edba76fe80f670c922ec5710b804e0db24823f5080fec5ab9dac586e7` | PNG · RGB8 · non-interlaced |
| `v16-18-r3-race-200pct-dark.png` | 640×900 at 200% text zoom | Dark | R3 race fails closed; Review latest source update | 640×900 | `f6cb8e54c4651692a1fd735113a9ae55420fd123b594b31ea0bc93ffcbc7dfc0` | PNG · RGB8 · non-interlaced |
| `v16-19-stacked-diff-mobile-light.png` | 390×844 | Light | Compact full-document switcher and change labels | 390×844 | `b358007d44ba7420ba1940538441219699dde901b70d2a380990c6d79bf619ef` | PNG · RGB8 · non-interlaced |
| `v16-20-mobile-outcomes-cancel-dark.png` | 390×844 | Dark | All three outcome activators visible; separate unresolved Cancel asserted in the same mobile state | 390×844 | `0b0a0a6dcb291d4f41414a3af0a62216eb26ba4934209940e95e243093330317` | PNG · RGB8 · non-interlaced |
| `v16-21-preview-landscape-light.png` | 568×320 landscape | Light | Complete consequence and safe/confirm actions reachable | 568×320 | `28e2c4f2454db7082d8de1f5c824aae8073aa0730de95a3317d413a83379cb57` | PNG · RGB8 · non-interlaced |
| `v16-22-long-diff-400pct-dark.png` | 320×900 at 400% page reflow | Dark | Long comparison/action path without clipping or horizontal page overflow | 320×900 | `c951c57f623aedd0b6279ff2fcd93597f6f8ac7e27bb94598ff21301ba96cd6f` | PNG · RGB8 · non-interlaced |

Frames 17, 18, and 22 passed as prescribed 640 px and 320 px reflow-equivalent observations only. Native page zoom was unavailable in the in-app browser, so they do not establish native-browser zoom behavior. Frame 20 independently proved all three ordered outcomes simultaneously visible at 390×844; separate live same-state Cancel returned exact unresolved U0 with two revisions, one Correction, zero events, and displayed C1. Frame 21 independently proved complete facts and actions reachable at 568×320 with 44 px targets.

## Files in the v16 slice

- [`index-v16.html`](../../prototypes/calendar-ui/index-v16.html)
- [`app-v16.js`](../../prototypes/calendar-ui/app-v16.js)
- [`styles-v16.css`](../../prototypes/calendar-ui/styles-v16.css)
- [`styles-v16-almanac.css`](../../prototypes/calendar-ui/styles-v16-almanac.css)
- [`styles-v16-readiness.css`](../../prototypes/calendar-ui/styles-v16-readiness.css)
- [`styles-v16-resilience.css`](../../prototypes/calendar-ui/styles-v16-resilience.css)
- [`styles-v16-date-review.css`](../../prototypes/calendar-ui/styles-v16-date-review.css)
- [`styles-v16-telegram.css`](../../prototypes/calendar-ui/styles-v16-telegram.css)
- [`styles-v16-upload.css`](../../prototypes/calendar-ui/styles-v16-upload.css)
- [`styles-v16-correction.css`](../../prototypes/calendar-ui/styles-v16-correction.css)
- [`styles-v16-conflict.css`](../../prototypes/calendar-ui/styles-v16-conflict.css)
- [`package.json`](../../prototypes/calendar-ui/package.json) — separate package/check artifact
- [`README-v16.md`](../../prototypes/calendar-ui/README-v16.md)
- [`COUNCIL-v16.md`](v16/COUNCIL-v16.md)
- [`SOURCE-CONFLICT-FIXTURES-v16.md`](v16/SOURCE-CONFLICT-FIXTURES-v16.md)
- [`design-qa-v16.md`](../../design-qa-v16.md) — final independent report; **Pass, Critical 0, High 0, Medium 0, Low 0**
- [`v16/`](v16/) — exact 22-frame current-run evidence roster; 22/22 independently inspected at original size

## Completed independent QA

The read-only independent agent started from zero and passed every `E1–E8`, `A1–A14`, `V1–V12`, `K1–K8`, `D1–D8`, `B1–B13`, `F1–F12`, `Q1–Q8`, `R1–R12`, `N1–N16`, and `S1–S18` case: **129/129**, represented by 36 branch families and 80 live assertions with 0 failed. The run also passed original-size inspection of all 22 PNGs, `check:v6` through `check:v16`, frozen v6–v15 byte identity, named live inherited representatives, responsive and target checks, forced colors, reduced motion, focus, announcements, measured contrast, hostile text, history, session, storage, clipboard, privacy, and all exclusion boundaries.

The final browser state had empty local/session storage, IndexedDB, Cache Storage, OPFS, and service-worker registrations; unchanged clipboard; empty console; and ten expected localhost resources only. A fresh untruncated interval covering the core outcomes, failures, reconciliation, races, two-tab, session, and hostile paths recorded zero post-load request, failure, exception, or log. An earlier long buffer truncated and was not relied on. The sole tab closed, port 63241 stopped, and no listener remained.

The in-app-browser limitations remain disclosed: native page zoom was unavailable, so the 640/320 px observations are reflow-equivalent only; native default Enter/Space activation and native `beforeunload` UI were not synthesizable. Native button semantics/source handlers were traced; custom Escape, arrow/tab, focus, and modal wrap ran live; dirty reload remained pending with its draft intact; cancelable `beforeunload` prevention was independently observed; and clean reload passed. These results are prototype evidence, not formal accessibility conformance.

## Post-QA/pre-commit gate state

- Product acceptance: **A**
- Experience contract: **A**
- Council approval: **A**
- Prototype implementation: **IP at this post-QA/pre-commit snapshot; becomes A only when the implementation/evidence commit exists**
- Evidence: **22/22 current-run frames captured and independently inspected at original size**
- Independent QA: **A — Pass by `/root/v16_independent_qa_final`; Critical 0, High 0, Medium 0, Low 0**
- Freeze: **not attempted at this post-QA/pre-commit snapshot; implementation/evidence commit pending; v16 is not frozen**

Frozen v6–v15 UI, Council, fixture, guide, handoff, QA, and evidence bytes remain immutable. `LID-SRC-002` remains **Open** and v17 remains queued until the implementation/evidence commit, documentation-only freeze record, and final tracker record exist.

## Deliberate limits and commit gate

The candidate is a static frontend prototype using deterministic fictional data and browser-memory mutations. It proves no real VoiceNotes retrieval or reconciliation, durable Source Revision or Correction storage, immutable server history, transactionality, rollback, cross-process concurrency or idempotency, restart recovery, export/restore reconstruction, encryption, authentication, deployment, operations, production readiness, or formal accessibility conformance.

No v16 completion or freeze claim is permitted from this post-QA snapshot. The exact UI, package, guide, handoff, final QA report, Council, fixture sheet, index metadata, tracker metadata, and 22 evidence frames may now enter the pending implementation/evidence commit. Later freeze records must preserve the tested bytes and follow the append-only tracker sequence.

## Sole permitted closure statement

The following statement is permitted only after independent QA approval, the implementation/evidence commit, the documentation-only freeze record, and the final tracker record:

**V16 prototype-represents an accessible complete Source/Correction comparison, persistent unresolved conflict, and exactly three distinct no-auto-merge resolutions with deterministic displayed-version and retained revision/Correction records using synthetic browser-memory state. Actual VoiceNotes retrieval or reconciliation, durable source/Correction storage, redating, complete History/export/restore, backend concurrency or idempotency, encryption, authentication, deployment, and production readiness remain unverified.**
