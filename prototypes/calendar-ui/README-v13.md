# Life in Days prototype v13 — Telegram Duplicate Handling

> **Independently passed · freeze-ready, not frozen at this QA record · P=A · D=A · C=A · I=IP · Q=A · fictional deterministic data · browser-memory mutations · no Telegram connection**

At this QA-record point, V13 is the passed, unfrozen `PVA-008 Telegram Duplicate Handling` frontend-prototype candidate. It adds same-day and cross-day Telegram-photo duplicate decisions while preserving frozen v6–v12 UI, documentation, and evidence bytes unchanged.

Fresh independent QA passed the exact eight-file UI fingerprint and separate package/check artifact below with **0 Critical, 0 High, 0 Medium, and 0 Low findings**. The 22-frame current-run evidence set was also independently verified. At this QA-record point, the implementation/evidence commit and freeze records are still pending; no frozen, backend, Telegram, deployment, or production state is claimed.

## Run

```sh
npm run check:v13
npm run prototype
```

Open [the v13 prototype](http://127.0.0.1:4173/index-v13.html?view=calendar&month=2026-08).

## V13 contract

- A duplicate means a different synthetic Telegram update/message identity whose represented plaintext-image checksum equals an existing Daily Photo's represented checksum. Replaying the same update remains the inherited idempotency case, not a duplicate decision.
- A same-day match presents `Already imported`, leaves the existing Daily Photo unchanged on Cancel, and adds a distinct Daily Photo reference only after `Add duplicate anyway` finishes successfully.
- A cross-day match names only the existing Journal Date, offers a date-specific add-anyway action for the incoming Journal Date, and keeps the existing day unchanged.
- A successful permit represents distinct Daily Photos using one shared Media Asset. The UI does not calculate or display a real checksum and does not claim physical deduplication.
- Lookup failure and reference-commit failure remain separate, retryable, no-change outcomes. Connection restoration does not auto-resume a decision or operation.
- Same-message replay, different-message delivery, two independently permitted messages, rapid action, navigation, reset, fixture change, connection loss, session expiry, and stale callbacks remain distinct deterministic branches.
- Needs Date Review duplicates, Trash-only matches, multiple prior-date matches, production concurrency, and v14+ upload behavior remain outside this slice.
- Fixture, decision, operation, focus, caption, date, and represented media-reference state remain private live-memory state and reset on reload or the defined privacy boundary.

## Exact independently passed identity

The Pass applies only to these exact eight UI files:

| Artifact | SHA-256 |
| --- | --- |
| `index-v13.html` | `8d9e0de6ed59ebeb18eac11eb6cb25df0d6bf3fae7d00f8c8dae6dc3972313a1` |
| `app-v13.js` | `fb08dca71c573c88d6519e748ced8b4099436656394ea7496cfa4d576d19a297` |
| `styles-v13.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `styles-v13-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `styles-v13-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |
| `styles-v13-resilience.css` | `d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c` |
| `styles-v13-date-review.css` | `525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5` |
| `styles-v13-telegram.css` | `11445043ad8d9388ab3398b6c7bb5ce4b5f06edf2a77e93bc9dc871de38f840d` |

The separate package/check artifact is `package.json` at SHA-256 `ae23958c41e355c3235d881f62ddfe414cfd38ca52b63c85e6a79c87c323ee01`.

Any UI-byte change invalidates this disposition and all v13 evidence, requiring a fresh 22-frame capture and complete independent gate. A package-byte change requires a new package fingerprint and repeated static checks.

## Exact current-run evidence manifest

Independent QA personally inspected all 22 repository PNGs at original resolution and verified the exact roster, dimensions, RGB8 non-interlaced format, unique hashes, and current-fingerprint provenance.

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

The evidence files live under [`../../docs/prototypes/v13/`](../../docs/prototypes/v13/). Screenshots supplement, but do not replace, the interaction, accessibility, privacy, race, and frozen-regression checks recorded in [`../../design-qa-v13.md`](../../design-qa-v13.md).

## Repair and complete restart history

An earlier independent run stopped immediately on a Low date-picker focus-return finding and produced no disposition. Opening **Choose from calendar** and returning did not restore focus to that invoker. A v13-only app repair now restores **Choose from calendar** focus for that path while direct date-textbox edits preserve input focus.

Because `app-v13.js` changed, the earlier evidence and partial QA work were discarded. Product/Council and adversarial static re-audits were clean on the repaired fingerprint, all 22 frames were regenerated, and `/root/v13_independent_qa_final5` then completed the full gate from zero. No finding remains open.

## Frozen inheritance and gate state

V13 inherits the frozen v6–v12 interaction and privacy contracts. Earlier version files, Council records, QA reports, and evidence remain immutable; the independent run verified their frozen bytes against baseline `1aa3c5f` and completed the full v6–v12 functional regression.

- Product acceptance: **A**
- Experience contract: **A**
- Council approval: **A**
- Prototype implementation: **IP until the implementation/evidence commit is recorded**
- Evidence: **A — 22/22 independently verified**
- Independent QA: **A — Pass; Critical 0, High 0, Medium 0, Low 0**
- Freeze and handoff record: **pending; v13 is not frozen at this QA record**

V14 remains queued. It cannot begin until the required v13 implementation/evidence, freeze-record, and final tracker commits are complete and renewed authorization is supplied.

## Conservative closure boundary

**Telegram duplicate decisions are prototype-represented with deterministic synthetic checksum and Media Asset fixtures; plaintext checksum calculation, encrypted asset reuse, durable reference creation, transactional race prevention, backend idempotency, persistence, Telegram integration, and authenticated links remain unverified.**

## Review artifacts

- Handoff: [`../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v13.md`](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v13.md)
- Council: [`../../docs/prototypes/v13/COUNCIL-v13.md`](../../docs/prototypes/v13/COUNCIL-v13.md)
- Duplicate fixture sheet: [`../../docs/prototypes/v13/TELEGRAM-DUPLICATE-FIXTURES-v13.md`](../../docs/prototypes/v13/TELEGRAM-DUPLICATE-FIXTURES-v13.md)
- Independent QA: [`../../design-qa-v13.md`](../../design-qa-v13.md)
- Evidence: [`../../docs/prototypes/v13/`](../../docs/prototypes/v13/) — 22 current-run PNGs
