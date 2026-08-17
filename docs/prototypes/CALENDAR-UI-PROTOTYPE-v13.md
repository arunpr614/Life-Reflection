# Life in Days — Telegram Duplicate Handling prototype v13

Date: 2026-08-17
Branch: `prototype/calendar-ui-v13-telegram-duplicate-handling`
Baseline: frozen v12 implementation/evidence `3927b55`, freeze record `689536c`, and final tracker record `1aa3c5f`
Status: **independently passed and frozen at implementation/evidence commit `9e2e588`; this documentation-only commit is the freeze record**

## Stable feature candidate

V13 implements the bounded frontend-prototype slice of `PVA-008 Telegram Duplicate Handling` and `LID-TG-008`. Fresh independent QA passed the exact candidate recorded below with Critical 0, High 0, Medium 0, and Low 0. At this PASS-record point, the candidate is freeze-ready but not yet frozen; Council §17 requires the complete three-commit record.

## Behavior represented

| Area | Passed v13 behavior |
| --- | --- |
| Match boundary | Only a different synthetic Telegram message with equal represented bytes enters the duplicate decision. Same-update replay remains a no-op. |
| Same day | `Already imported` defaults to no mutation; explicit `Add duplicate anyway` may add one distinct Daily Photo reference while retaining the incoming caption and Original Timestamp. |
| Cross day | The warning exposes only the existing Journal Date; explicit permit may create the requested Journal Day while preserving the existing day. |
| Shared media | A successful deterministic fixture may represent multiple Daily Photos using one shared Media Asset, with an immediate prototype-only boundary. No checksum value or internal identity appears. |
| Failures | Duplicate lookup and reference commit fail closed as separate zero-change outcomes with explicit Retry. |
| Identity/races | Same-message replay, different-message delivery, rapid activation, two explicit permits, repeated callbacks, navigation/reset/fixture change, connection loss, and session expiry remain distinct and guarded. |
| Handoffs | Existing-day, affected-day, and same-media provenance links use structural URLs plus opaque live-memory history targets and exact Back/Forward focus/scroll restoration. |
| Privacy | Caption, dates, fixture, decision, match, operation, reference identity, outcome, and focus stay out of URL, title, history payload, storage, requests, console, telemetry, and product DOM identifiers. |
| Inheritance | Frozen v6 Search through v12 Capture Companion and Uploaded Journal exact-text duplicate behavior passed complete byte and functional regression. |

## Exact independently passed identity

The Pass applies only to these eight UI artifacts:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/index-v13.html` | `8d9e0de6ed59ebeb18eac11eb6cb25df0d6bf3fae7d00f8c8dae6dc3972313a1` |
| `prototypes/calendar-ui/app-v13.js` | `fb08dca71c573c88d6519e748ced8b4099436656394ea7496cfa4d576d19a297` |
| `prototypes/calendar-ui/styles-v13.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `prototypes/calendar-ui/styles-v13-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `prototypes/calendar-ui/styles-v13-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |
| `prototypes/calendar-ui/styles-v13-resilience.css` | `d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c` |
| `prototypes/calendar-ui/styles-v13-date-review.css` | `525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5` |
| `prototypes/calendar-ui/styles-v13-telegram.css` | `11445043ad8d9388ab3398b6c7bb5ce4b5f06edf2a77e93bc9dc871de38f840d` |

The separate package/check artifact is `prototypes/calendar-ui/package.json` at SHA-256 `ae23958c41e355c3235d881f62ddfe414cfd38ca52b63c85e6a79c87c323ee01`. Frozen v12 recorded package SHA-256 was `e11e52086687cc7ac53083721d9a7321627aac56b9045dc27100da64b76666fa`; the shared-package difference is limited to the additive `check:v13` script.

Any UI-byte change invalidates this disposition and all v13 evidence. A package change requires a new fingerprint and repeated static checks.

## Exact current-run evidence manifest

Independent QA personally inspected all 22 evidence files at original resolution and verified exact filenames, dimensions, RGB8 non-interlaced format, unique hashes, and repository-byte equality.

| File | Dimensions | SHA-256 |
| --- | ---: | --- |
| `01-1440x900-duplicate-guide-default-light.png` | 1440 × 900 | `74a5547d4846d93f3d7c1ec11be3d76f9e45115b78ac320bb437c2f89df9c64a` |
| `02-1440x900-same-day-checking-dark.png` | 1440 × 900 | `1056267ac6fd230b8ec89aeef779dd4736b9162d2b4a58f16f35881f48b632df` |
| `03-1440x900-same-day-already-imported-light.png` | 1440 × 900 | `a88a36f4b347a190543baf281c5b88dc431dbf1732decc46ff8e5d7ecfd33f6f` |
| `04-1440x900-same-day-add-success-dark.png` | 1440 × 900 | `01e4f7c14344faf029b750bd4ecf30ed67944ea032914b7cc56c6996472dde83` |
| `05-1280x720-same-day-cancel-light.png` | 1280 × 720 | `9b9d9aeea4934a2c79c7a5b4fb287ba302ff1be63fcc4289c00f608c13039a5a` |
| `06-1280x720-cross-day-decision-dark.png` | 1280 × 720 | `570ab30de67585cb3a4cfc82109b0e2314f37873ad06106c4a826442aa7d83e2` |
| `07-1280x720-cross-day-permit-success-light.png` | 1280 × 720 | `f2c564d535cc410cd34b9b092269defa90755f2d22d713cb1a6ac7648503b033` |
| `08-1280x720-cross-day-cancel-dark.png` | 1280 × 720 | `ebcf7c86955c20773efde2b2265c6ed9c92396862953721935f431e5310f102c` |
| `09-960x900-duplicate-check-failure-light.png` | 960 × 900 | `9164ee9591d54169c523d18f53d59a97918bc005221adff90b7abfc84589ba44` |
| `10-960x900-add-failure-retry-dark.png` | 960 × 900 | `242b926f6e0dc820ca99ed5360aeb890b17451cb7ea5d8c9fe223308ad48f6cc` |
| `11-960x900-replay-unchanged-light.png` | 960 × 900 | `b70cd6a35c09405708392c777612cc72497b072a48f859fd3c0eed19a238005e` |
| `12-700x900-same-day-decision-light.png` | 700 × 900 | `e4ebdb676866593680c452c5eac0d165cf13d87128c5a7a19687a25bc8c0350c` |
| `13-700x900-cross-day-warning-dark.png` | 700 × 900 | `74f3840667269c035bc50caf1d4232893741d1c869d66e440aeffe8fc15d03c7` |
| `14-700x900-shared-media-provenance-light.png` | 700 × 900 | `275e2fda4f272cb897be44b3fb20eaff922d78d02daa995b935f87533e35c47b` |
| `15-390x844-same-day-decision-dark.png` | 390 × 844 | `7f80cfc684cfb775f751626d1e804337b8d05fd34d9ee030896590ae30174082` |
| `16-390x844-cross-day-success-private-link-light.png` | 390 × 844 | `2e56b1234713c14531f9a12e39ec623d074fe2247a7adbb289dd3493f0799d0f` |
| `17-390x844-day-provenance-return-dark.png` | 390 × 844 | `5715d34cc3c212ab8a808a762fd409b62334dfd969b3ef7f708195213caf44e3` |
| `18-320x568-long-same-day-decision-light.png` | 320 × 568 | `b07d8ff02f94489c205f09a79f979c622cbd472133c48319cf060919b72dbf34` |
| `19-320x568-long-error-retry-dark.png` | 320 × 568 | `596aa21eed4fcadabeed58ff978e8d36568eaac98d3d88256797776f4a3b4bda` |
| `20-568x320-cross-day-landscape-light.png` | 568 × 320 | `16227e63ca588ab607e0cb85e3b8b6b1d5666a716419e92bf0ba7e446a823804` |
| `21-640x900-200-percent-reflow-light.png` | 640 × 900 | `eeaedfadde408f5d12bb940ae5486f60ffabf791a0a6dfd2908fc7c744861e13` |
| `22-320x900-400-percent-reflow-dark.png` | 320 × 900 | `8bfc1235a4ced918171850ca00ced5d6498d679396675dce4da4c4d088d2eab3` |

## Files in the v13 slice

- [`../../prototypes/calendar-ui/index-v13.html`](../../prototypes/calendar-ui/index-v13.html)
- [`../../prototypes/calendar-ui/app-v13.js`](../../prototypes/calendar-ui/app-v13.js)
- [`../../prototypes/calendar-ui/styles-v13.css`](../../prototypes/calendar-ui/styles-v13.css)
- [`../../prototypes/calendar-ui/styles-v13-almanac.css`](../../prototypes/calendar-ui/styles-v13-almanac.css)
- [`../../prototypes/calendar-ui/styles-v13-readiness.css`](../../prototypes/calendar-ui/styles-v13-readiness.css)
- [`../../prototypes/calendar-ui/styles-v13-resilience.css`](../../prototypes/calendar-ui/styles-v13-resilience.css)
- [`../../prototypes/calendar-ui/styles-v13-date-review.css`](../../prototypes/calendar-ui/styles-v13-date-review.css)
- [`../../prototypes/calendar-ui/styles-v13-telegram.css`](../../prototypes/calendar-ui/styles-v13-telegram.css)
- [`../../prototypes/calendar-ui/package.json`](../../prototypes/calendar-ui/package.json) — separate package/check artifact
- [`../../prototypes/calendar-ui/README-v13.md`](../../prototypes/calendar-ui/README-v13.md)
- [`v13/COUNCIL-v13.md`](v13/COUNCIL-v13.md)
- [`v13/TELEGRAM-DUPLICATE-FIXTURES-v13.md`](v13/TELEGRAM-DUPLICATE-FIXTURES-v13.md)
- [`../../design-qa-v13.md`](../../design-qa-v13.md) — exact-fingerprint Pass; Critical 0, High 0, Medium 0, Low 0
- [`v13/`](v13/) — 22 current-run evidence PNGs

## Independent QA and evidence

`/root/v13_independent_qa_final5` completed a fresh, zero-disposition independent gate in a unique in-app Browser origin. The run verified exact local and served bytes, every v13 fixture/state/race/stale/private-handoff path, the repaired calendar-picker and direct-input focus paths, privacy surfaces, 11 responsive/reflow sizes, themes and accessibility observations, and the full v6–v12 byte and functional regression. It passed with **0/0/0/0** unresolved severities and no actionable finding.

All 22 current-run evidence files match the Council roster and exact manifest above. Screenshots supplement, but do not replace, the complete interaction, privacy, focus, race, responsive, and frozen-regression checks in [`../../design-qa-v13.md`](../../design-qa-v13.md).

## Repair and restart history

The first independent run stopped at its first actionable finding: Low date-picker focus return. Returning from **Choose from calendar** did not restore that invoker's focus. A v13-only `app-v13.js` repair now restores **Choose from calendar** focus for that path while preserving date-textbox focus for direct edits.

The app-byte change invalidated the stopped run and every earlier v13 frame. That run has no disposition. All 22 frames were regenerated against the repaired fingerprint, and the final independent agent restarted and completed the entire gate from zero.

## Deliberate limits and commit gate

The candidate is a static frontend prototype with fictional fixtures and browser-memory mutations. It proves no checksum computation, exact-byte identity, encryption, durable or transactional reference creation, physical deduplication, persistence, Telegram/provider integration, authenticated links, deployment, operations, production readiness, or formal accessibility conformance.

At this PASS-record point, the implementation/evidence commit had not yet been created. Per Council §17, these passed bytes are next recorded in that commit; a later documentation-only freeze-record commit changes only the `Status:` line above, and a final tracker-only commit records that freeze. V14 remains queued and requires both complete v13 closure and renewed authorization.

## Conservative closure

**Telegram duplicate decisions are prototype-represented with deterministic synthetic checksum and Media Asset fixtures; plaintext checksum calculation, encrypted asset reuse, durable reference creation, transactional race prevention, backend idempotency, persistence, Telegram integration, and authenticated links remain unverified.**
