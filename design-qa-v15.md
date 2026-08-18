# Life in Days prototype v15 — final independent design QA report

Date: 2026-08-18
Package: `PVA-010 Correction Editor`
Requirement scope: audit gap 5's Correction-editor portion and only the frontend-prototype portion of `LID-SRC-001`
Candidate owner: `/root`
Independent QA agent: `/root/v15_independent_qa_final2`
QA status: **Pass — Critical 0, High 0, Medium 0, Low 0**

This report records the final read-only return for the exact held v15 candidate. `/root/v15_independent_qa_final2` restarted from zero after the v14 handoff-status discrepancy was classified append-only as historical pre-freeze prose with no frozen-byte change. At this post-QA/pre-commit snapshot, Product, Design, and Council are **A**; Implementation is **IP**; QA is **A**; the implementation/evidence commit is pending; and v15 is not frozen.

The independent run did not edit or repair runtime, documentation, or evidence; create replacement evidence; stage; commit; freeze; push; deploy; or use real/private journal data. This final report is the candidate owner's transcription of the independent return after the run completed.

## Exact candidate identity

The passed UI candidate comprised these exact ten artifacts:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/index-v15.html` | `0a4fadbf20eff28015cd139e856f8f26abd00db6e58bd99f780c86e15f70aeba` |
| `prototypes/calendar-ui/app-v15.js` | `7931020ab0e52ebbb792ca4d47ba7180b95724ae0293ff430e0e7503f22120aa` |
| `prototypes/calendar-ui/styles-v15.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `prototypes/calendar-ui/styles-v15-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `prototypes/calendar-ui/styles-v15-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |
| `prototypes/calendar-ui/styles-v15-resilience.css` | `d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c` |
| `prototypes/calendar-ui/styles-v15-date-review.css` | `525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5` |
| `prototypes/calendar-ui/styles-v15-telegram.css` | `6489ac5e330af80c0488ed411229a6256d13765535b8cdf2eb9a3e42a21e4992` |
| `prototypes/calendar-ui/styles-v15-upload.css` | `ca45322956ba372850550be860a02bcd6b63735108808d1612033bf327b81b74` |
| `prototypes/calendar-ui/styles-v15-correction.css` | `8a97c0d60b3871ecbdd690f213407cec7388a4890a77a2ae0d9ba6826a654c5e` |

The separate package/check artifact is:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/package.json` | `00b611543b69e43f3b0599db684c0f1cfc48e6fea60637410b73c7238882985a` |

## Exact authority inputs

The run read these files completely before judging the candidate:

| Input | SHA-256 |
| --- | --- |
| `docs/prototypes/v15/COUNCIL-v15.md` | `a690fd5f8d2c5db9fa9c1214ecaec9226949197827dacbb94713831792db609f` |
| `docs/prototypes/v15/CORRECTION-FIXTURES-v15.md` | `fc91a833255ada0c349333721b26b837e27f70129b1cce263cbee2573a502492` |

## Exact tested pre-QA documentation and metadata inputs

These hashes identify the documentation bytes judged by the independent run. This final report and the other post-QA status documents necessarily have new hashes; the values below remain the tested pre-QA identities, not claims about their post-PASS bytes.

| Tested input | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/README-v15.md` | `eda48ebeb86b7042f659ed4dd9fa5b970e84614c6731eeb585a11911eb662b97` |
| `docs/prototypes/CALENDAR-UI-PROTOTYPE-v15.md` | `f41de270b3ab6a56ac1ba89abf4e7949ae693c2f545c549b75ad162a4f7eb430` |
| `design-qa-v15.md` pre-QA brief | `4be88a05f3b4eb0ea22de0e20f25fbb4f25cd4ae98cd98a52cb7b2da5453f843` |
| `docs/INDEX.md` | `3049be8a485e8e84a07c7999a54c854b53d89a144ddf743b3e339d3b79ae5e32` |
| `docs/project/PROTOTYPE-COMPLETENESS-TRACKER.md` | `88039d8e4e3db87c91750672bc04ca925037997736faf12696ba44511f8c5d21` |

The frozen baseline is v14 implementation/evidence `f5e75e303d933cd4eadbf6c2b9db9000e80a9015`, documentation-only freeze record `303ae3c536279da7ca8aed28d138e986df1d0557`, and final tracker record `cf54d3b957b39abcf71137e1e68e6ffa78eb5c70`. Frozen v6–v14 UI, Council, fixture, guide, handoff, QA, and evidence bytes are immutable regression inputs.

Any UI-byte change invalidates all 22 frames and requires capture plus complete independent QA to restart from zero. A package-byte change requires a new package identity and repeated static checks. Any Council or fixture change reopens authority before QA.

## Current-run candidate evidence manifest

The authoritative roster is [Correction Fixtures v15](docs/prototypes/v15/CORRECTION-FIXTURES-v15.md#exact-evidence-roster). The evidence owner captured and inspected these repository files after holding the UI fingerprint. `/root/v15_independent_qa_final2` then verified roster, mechanics, dimensions, unique hashes, repository parity, and ordered aggregate `fb79ec13580e2acb459b3d0a4bf2273cafd25a33115327e338cc191c36ac0b37`, and personally inspected every PNG one-by-one at original size before live testing.

| File | Required capture | Verified dimensions | SHA-256 | Format |
| --- | --- | --- | --- | --- |
| `v15-01-source-card-launch-light.png` | 1440 × 900 | 1440 × 900 | `66ece1bbbbad66a2390fbce22c79475b64b0364dab7d7a50702ad9c1c676fd9b` | PNG · RGB8 · non-interlaced |
| `v15-02-new-editor-base-dark.png` | 1440 × 900 | 1440 × 900 | `4a58c0228408ad1c9381ae4abe4f735356bc8d05adf129236164e2033fb606a6` | PNG · RGB8 · non-interlaced |
| `v15-03-uploaded-editor-light.png` | 1440 × 900 | 1440 × 900 | `52d4d3031d7896c887ed43d8cc726aff4f076491cae034eb3cab77be6c72142d` | PNG · RGB8 · non-interlaced |
| `v15-04-dirty-draft-dark.png` | 1440 × 900 | 1440 × 900 | `dc7d6de9b8a89b715fe206b2c352cc473b1769729bd78931c1b8dbaa9e726947` | PNG · RGB8 · non-interlaced |
| `v15-05-whitespace-validation-light.png` | 1280 × 720 | 1280 × 720 | `0d4f0c280f8dda008e1437c4a18ac0dd82caec16aa6882f8926aad07b8a460e0` | PNG · RGB8 · non-interlaced |
| `v15-06-unsaved-leave-dark.png` | 1280 × 720 | 1280 × 720 | `25ee468291d3c1d3e3d0da8c06cbfe0151cc6f98545ec433aab1d785e7197559` | PNG · RGB8 · non-interlaced |
| `v15-07-saving-correction-light.png` | 1280 × 720 | 1280 × 720 | `c611bdc83ab82405d1d2537c4bda37cf53e22e63c46fc1381d60894fe45bca8b` | PNG · RGB8 · non-interlaced |
| `v15-08-save-success-metadata-dark.png` | 1280 × 720 | 1280 × 720 | `9660ef6038a8a28201de5ee8d4f39239383fd0278d7fd25e1abb49f7a512470f` | PNG · RGB8 · non-interlaced |
| `v15-09-corrected-source-card-light.png` | 960 × 900 | 960 × 900 | `68e82a128e8fdab9c51f636a8933f2113221673570d6d4e341ceed4371ead543` | PNG · RGB8 · non-interlaced |
| `v15-10-save-failure-dark.png` | 960 × 900 | 960 × 900 | `df85c4e7bf00022fd51dc8e91aeee980c8ecae9920924739d33398091162b4f5` | PNG · RGB8 · non-interlaced |
| `v15-11-connection-interrupted-light.png` | 960 × 900 | 960 × 900 | `21702ef524bfa49c8d10a229883d5cb6512794e23ad0d1418fe951caa4f962f0` | PNG · RGB8 · non-interlaced |
| `v15-12-retry-saving-dark.png` | 960 × 900 | 960 × 900 | `d41f2343e5bda91e70badc71f22ad9969eafc1c2b57bc41426410ce479b159f2` | PNG · RGB8 · non-interlaced |
| `v15-13-rapid-repeat-settled-light.png` | 700 × 900 | 700 × 900 | `e780a487860d095f92c13121da1e6740b693a2cec2f91f4f2b639db379345bf7` | PNG · RGB8 · non-interlaced |
| `v15-14-existing-correction-editor-dark.png` | 700 × 900 | 700 × 900 | `d458bb4d90d71055d674869a557b785cf52dab4378795d67a3a1176149d00df1` | PNG · RGB8 · non-interlaced |
| `v15-15-remove-confirm-light.png` | 700 × 900 | 700 × 900 | `a30dd2701ad1c924feed617a9d2dab8c0952f85dc9e08e066c9598ccdb94dfcb` | PNG · RGB8 · non-interlaced |
| `v15-16-remove-failure-dark.png` | 700 × 900 | 700 × 900 | `cd614c82c4983af42b2ba6b1e8c3b4d322596485e917e526fb3876f006683738` | PNG · RGB8 · non-interlaced |
| `v15-17-remove-success-retained-light.png` | 640 × 900 at 200% text zoom | 640 × 900 at 200% text zoom | `0412ec9e2e3dfba74360e4ce5bedde0e96a969b4fcd64fbe7c8853d3c6c7054b` | PNG · RGB8 · non-interlaced |
| `v15-18-session-ended-draft-dark.png` | 640 × 900 at 200% text zoom | 640 × 900 at 200% text zoom | `ee9908d819c824bc2a103e1f006c1382ccfa20792b441f3f7c5841867f1e9fc1` | PNG · RGB8 · non-interlaced |
| `v15-19-long-editor-mobile-light.png` | 390 × 844 | 390 × 844 | `b6387c0078f99222d20939f073356204bcd2134ed6c5f25ebb88043b0c75645a` | PNG · RGB8 · non-interlaced |
| `v15-20-unsaved-mobile-dark.png` | 390 × 844 | 390 × 844 | `8748c84cfe709a7890aec27c6090bc76cc0b6b3dcfee3ba45b8608321a5ad8cf` | PNG · RGB8 · non-interlaced |
| `v15-21-remove-landscape-light.png` | 568 × 320 landscape | 568 × 320 landscape | `828fdc5336719969a89f2261058f5674d59377d0b21852316147dc683ddbe6d2` | PNG · RGB8 · non-interlaced |
| `v15-22-long-error-400pct-dark.png` | 320 × 900 at 400% page reflow | 320 × 900 at 400% page reflow | `27a4992d182614aca1b39fcd226ad30195fdd0369be905022bc1466356af8d37` | PNG · RGB8 · non-interlaced |

Independent evidence status: **22/22 present, byte-matched, and inspected at original size; Pass**.

## Completed independent coverage

The independent agent completed every Council v15 §20 and Correction Fixtures execution row, including:

- shared locale, timezone, title, exact author, exact four timestamps, and the browser/network baseline;
- S-VOICE, S-UPLOAD, and S-LONG inventory plus exact base/draft/source identities;
- E1–E8 eligibility, A1–A10 anatomy, V1–V10 validation, C1–C6 create, U1–U5 update, and D1–D6 removal;
- F1–F10 failure/connection, Q1–Q6 reconciliation, R1–R16 replay/race, N1–N16 navigation/focus/history, and S1–S10 reset/session;
- every source-card/history-boundary, privacy, live-region, keyboard, focus, selection, scroll, target-size, contrast, theme, forced-colors, reduced-motion, responsive, 200% text-zoom, and 400% reflow assertion;
- exact roster, order, dimensions, format, unique hashes, repository parity, no extra/stale v15 PNG, and individual original-size inspection of all 22 frames;
- syntax, package, relative-link, local-resource, secrets, privacy, and whitespace checks plus `check:v6` through `check:v15`;
- complete inherited live v6–v14 regression and frozen comparisons: prototype 89/89, documentation/evidence 153/153, and handoffs 9/9;
- 267 relative links clean;
- exclusions: no diff/conflict resolution, redating, complete History, durable storage, export/restore proof, authentication, deployment, production, or real/private data.

## Final verdict and execution record

- Verdict: **Pass** on the exact held bytes.
- Findings: **Critical 0, High 0, Medium 0, Low 0**.
- Evidence: **22/22** opened individually at original size; exact repository hashes and aggregate `fb79ec13580e2acb459b3d0a4bf2273cafd25a33115327e338cc191c36ac0b37` matched.
- Network and console: **16 localhost GETs only**; no remote request, console error, or page error was reported.
- Browser privacy: only safe local preference state was present; no source, base, draft, Correction, operation, result, or other private fixture value persisted to a forbidden surface.
- Harness recovery: one bounded same-tab/server timeout was recovered within the local harness; candidate and evidence bytes did not change.
- Cleanup: the QA tab, local server, and bound port were cleaned up.
- Static and frozen checks: `check:v6` through `check:v15` passed; prototype 89/89, documentation/evidence 153/153, handoffs 9/9, and 267 relative links were clean.
- Authority discrepancy: the frozen v14 handoff's stale non-Status prose remained unchanged and was judged under the append-only historical disposition; no frozen byte changed.

## Post-QA/pre-commit gate state

- Product acceptance: **A**
- Experience contract: **A**
- Council approval: **A**
- Prototype implementation: **IP at this post-QA/pre-commit snapshot; becomes A only when the implementation/evidence commit exists**
- Evidence: **22/22 current-run frames captured and independently inspected at original size**
- Independent QA: **A — Pass by `/root/v15_independent_qa_final2`; Critical 0, High 0, Medium 0, Low 0**
- Freeze: **not attempted at this post-QA/pre-commit snapshot; implementation/evidence commit pending; v15 is not frozen**

## Evidence boundary

This candidate can establish only deterministic fictional browser behavior, rendering, semantics, focus, transitions, privacy surfaces, and exact held static bytes. It cannot verify source storage, durable Correction persistence, immutable server records, trustworthy author/time, transactionality, rollback, cross-process idempotency, restart recovery, upstream reconciliation, conflict resolution, redating, complete History/export/restore reconstruction, authentication, deployment, operations, formal accessibility conformance, or production readiness.

## Sole permitted closure statement

**V15 prototype-represents Source Item-bound text Corrections, immutable base-revision visibility, simulated author/time, guarded create/edit/removal, unsaved-warning, failure/retry/race/session behavior, and retained Correction records using deterministic fictional browser state. Source storage, durable Correction persistence, upstream reconciliation, conflict resolution, redating, complete history/export/restore reconstruction, backend idempotency, encryption, authentication, deployment, and production readiness remain unverified.**
