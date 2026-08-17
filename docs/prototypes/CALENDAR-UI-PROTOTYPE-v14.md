# Life in Days — Durable Manual Upload prototype v14

Date: 2026-08-17
Branch: `prototype/calendar-ui-v14-durable-manual-upload`
Baseline: frozen v13 implementation/evidence `9e2e588`, documentation-only freeze record `e97b6f5`, and final tracker record `a6c2f78`
Status: **Independent QA Pass; current-run evidence complete; freeze-ready; not frozen; implementation/evidence commit pending; P=A; D=A; C=A; I=IP; Q=A**

## Stable feature candidate

V14 implements the bounded frontend-prototype slice of `PVA-009 Durable Manual Upload` and `LID-UP-001` through `LID-UP-003`. Product, Design, Council, and independent QA gates are **A**. Implementation remains **IP** until the implementation/evidence commit; the exact current-run evidence passed independent review and v14 is freeze-ready, but it is not frozen and no backend, deployment, or production closure is claimed.

## Behavior represented

| Area | Passed v14 prototype behavior |
| --- | --- |
| Entry/date | Global upload starts with a required blank Journal Date; Journal Day entry preselects but permits changing its non-future date. |
| Validation/review | One fictional UTF-8 txt/md file up to 1 MiB is validated and reviewed as inert plain text with complete metadata/privacy/prototype disclosure. |
| Identity | The fixture represents original-byte/checksum identity without computing, displaying, storing, or proving a checksum or original file. |
| Duplicate decision | Archive-wide live Uploaded Journal equality produces zero or one match. Exact action order is **Cancel** then **Add anyway**; a fresh explicit permit is required per duplicate operation. |
| Stages/failures | Named validation, equality, upload, save, interruption, known-zero failure, unknown-result reconciliation, Retry, and already-completed branches never use optimistic success. |
| Atomic result | One represented operation identity ends with zero or one complete Source Item. Cancel/failure creates nothing; repeated callbacks and Retry cannot create a second result. |
| Provenance/derived | Success shows source title, date, timestamp semantics, represented original identity and export/restore membership, plus bounded new-day pending or existing-day stale derived feedback. |
| Focus/history | Pre-commit dismissal restores the exact invoker; commit locks dismissal; destination, Back/Forward, focus, scroll, and announcements preserve settled truth without rerun. |
| Privacy | Private fixture/file/date/preview/equality/operation/outcome/focus state stays out of URL, title, history payload, storage, requests, console, telemetry, and product DOM identifiers. |
| Inheritance | Frozen v6–v13 behavior, documentation, and evidence remain immutable regression dependencies. |

## Exact held candidate identity

The independent Pass applies only to these nine UI artifacts:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/index-v14.html` | `1b0b32482ae4223f743e028696a1401962da12f0b89befd042789c98bf8b2e82` |
| `prototypes/calendar-ui/app-v14.js` | `d7180fc3ba478974f7fd459b755f6e0db986414726dc812cf89aad854ae5331e` |
| `prototypes/calendar-ui/styles-v14.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `prototypes/calendar-ui/styles-v14-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `prototypes/calendar-ui/styles-v14-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |
| `prototypes/calendar-ui/styles-v14-resilience.css` | `d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c` |
| `prototypes/calendar-ui/styles-v14-date-review.css` | `525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5` |
| `prototypes/calendar-ui/styles-v14-telegram.css` | `6489ac5e330af80c0488ed411229a6256d13765535b8cdf2eb9a3e42a21e4992` |
| `prototypes/calendar-ui/styles-v14-upload.css` | `ca45322956ba372850550be860a02bcd6b63735108808d1612033bf327b81b74` |

The separate package/check artifact is `prototypes/calendar-ui/package.json` at SHA-256 `53bd721c1396c173a36c44560af8377a6f9828fd54a68303da88b4c0402bb3e9`.

Any UI-byte change invalidates the entire v14 evidence set and requires all 22 frames plus complete independent QA to restart from zero. A package-byte change requires a new package identity and repeated static checks.

## Current-run evidence manifest

The authoritative filenames and capture conditions come from [Upload Fixtures v14](v14/UPLOAD-FIXTURES-v14.md#evidence-roster). These fresh files were measured, hashed, inspected at original resolution by the evidence owner, and matched byte-for-byte to the repository. Independent agent `/root/v14_independent_qa_final4` then verified the complete set from zero and inspected all 22 files individually at original resolution before returning Pass.

| File | Required capture | Verified dimensions | SHA-256 | Format |
| --- | --- | --- | --- | --- |
| `v14-01-global-blank-date-light.png` | 1440 × 900 | 1440 × 900 | `3859811e30fe52f19a8274e7747ddabfa8871434edc957a88dd403374a4e2400` | PNG · RGB8 · non-interlaced |
| `v14-02-inline-date-preselected-dark.png` | 1440 × 900 | 1440 × 900 | `b1b7c38343418eebcbe0a56d2951f44ccc097f805b43584621db2235829da90a` | PNG · RGB8 · non-interlaced |
| `v14-03-validating-file-light.png` | 1440 × 900 | 1440 × 900 | `d8288d15872f0dfe44d9a68ae89788d5f88b689f26629dd4b81c9301f5dafebb` | PNG · RGB8 · non-interlaced |
| `v14-04-hostile-markdown-review-dark.png` | 1440 × 900 | 1440 × 900 | `03023ebb1a8fdb423f86e89032c37157e1f0d809db7f4282a68ba04d0ec79000` | PNG · RGB8 · non-interlaced |
| `v14-05-oversize-error-light.png` | 1280 × 720 | 1280 × 720 | `92fd1eacd9e8b124472f7f0fcfaa68f8a4f134bb94674fe01febfb900036ab10` | PNG · RGB8 · non-interlaced |
| `v14-06-invalid-utf8-error-dark.png` | 1280 × 720 | 1280 × 720 | `5cc29b0e5facb73d81b5e4cb83779d4219de5399f64161123e6a0306463fa6d5` | PNG · RGB8 · non-interlaced |
| `v14-07-identical-file-check-light.png` | 1280 × 720 | 1280 × 720 | `1ba5d29adbd0b4a02869efcda4f3ee1251f73c5833c96ff09aa8e70cec5e5c1d` | PNG · RGB8 · non-interlaced |
| `v14-08-duplicate-decision-dark.png` | 1280 × 720 | 1280 × 720 | `f6ccdc4c35753fed53ee24c3ee369985b2fd2026f7845dd39f523ed763369a14` | PNG · RGB8 · non-interlaced |
| `v14-09-duplicate-cancel-return-light.png` | 960 × 900 | 960 × 900 | `c14ab21af7cfec96c8ab8ee065609f4336b0b313a48240ef6ed9f12dbe2f5ca9` | PNG · RGB8 · non-interlaced |
| `v14-10-uploading-after-override-dark.png` | 960 × 900 | 960 × 900 | `74eac6e1dea465656826705eee217cb2ca073f3709cdb630071ac04119d14125` | PNG · RGB8 · non-interlaced |
| `v14-11-saving-no-match-light.png` | 960 × 900 | 960 × 900 | `abc601981845d43c47db54cc387dff6c874fb10f10404c59e3f7594acfdf5f31` | PNG · RGB8 · non-interlaced |
| `v14-12-duplicate-check-failure-dark.png` | 960 × 900 | 960 × 900 | `f5eb35308004b6d85f603e7bc8e4315bd5f10f2f375ae4263a8ce1ec8fb66e2a` | PNG · RGB8 · non-interlaced |
| `v14-13-connection-interruption-light.png` | 700 × 900 | 700 × 900 | `1bc8f836e935593d7e4f6bfeaf89929c4e1fec01f72a6c127ce7965cc293bac6` | PNG · RGB8 · non-interlaced |
| `v14-14-commit-failure-dark.png` | 700 × 900 | 700 × 900 | `154257ece5a5812643e2bf67ba3da2b7e7be67ddcfbb03891a4b366e2e03d78e` | PNG · RGB8 · non-interlaced |
| `v14-15-retry-reconciliation-light.png` | 700 × 900 | 700 × 900 | `eaf84cde15f181338f1e61d9c1084220345dc648317bda8177ea1e19e4c8ed30` | PNG · RGB8 · non-interlaced |
| `v14-16-idempotent-completed-result-dark.png` | 700 × 900 | 700 × 900 | `436b59adb64bf1a386b44ba918c184bd62132d47d2f5e4117e8064ff655f9584` | PNG · RGB8 · non-interlaced |
| `v14-17-represented-success-200pct-light.png` | 640 × 900 at 200% text zoom | 640 × 900 at 200% text zoom | `f5357a56c515055a8d1e9d3e4982dbf6b58358ef3161feff9a90e280ae08ba47` | PNG · RGB8 · non-interlaced |
| `v14-18-new-day-pending-200pct-dark.png` | 640 × 900 at 200% text zoom | 640 × 900 at 200% text zoom | `346cdcb22f837378d112dc9e3c60b80768ae681fdc25659a88432807b7d61e95` | PNG · RGB8 · non-interlaced |
| `v14-19-existing-day-stale-mobile-light.png` | 390 × 844 | 390 × 844 | `7f4d846d82956c34a40a7347984df61c3a288f2455243f3c6405bc3f682e70c2` | PNG · RGB8 · non-interlaced |
| `v14-20-long-review-mobile-dark.png` | 390 × 844 | 390 × 844 | `3ff78c8bc0876323e80ec2214c4fcc8f930daf6faf5268c8cf7d5fe0558f6c5e` | PNG · RGB8 · non-interlaced |
| `v14-21-duplicate-landscape-light.png` | 568 × 320 landscape | 568 × 320 landscape | `c3dce373775b7ceb8a6de3a1ff22e1a099425d4b8a7ad3abe12a922cf0e898ec` | PNG · RGB8 · non-interlaced |
| `v14-22-long-error-400pct-dark.png` | 320 × 900 at 400% page reflow | 320 × 900 at 400% page reflow | `476da8827f9206f0cf51e4131dfb98dc652ff0e3be9b030fd2462ed7a7745fa6` | PNG · RGB8 · non-interlaced |

All 22 rows were filled atomically from fresh current-run RGB8 non-interlaced PNGs for the held UI fingerprint. Exact dimensions/zoom/theme, individual original-resolution inspection, repository-byte equality, recorded hashes, uniqueness, and absence of stale or extra evidence were independently verified. Any later UI-byte change invalidates the evidence and Pass disposition.

## Files in the v14 slice

- [`index-v14.html`](../../prototypes/calendar-ui/index-v14.html)
- [`app-v14.js`](../../prototypes/calendar-ui/app-v14.js)
- [`styles-v14.css`](../../prototypes/calendar-ui/styles-v14.css)
- [`styles-v14-almanac.css`](../../prototypes/calendar-ui/styles-v14-almanac.css)
- [`styles-v14-readiness.css`](../../prototypes/calendar-ui/styles-v14-readiness.css)
- [`styles-v14-resilience.css`](../../prototypes/calendar-ui/styles-v14-resilience.css)
- [`styles-v14-date-review.css`](../../prototypes/calendar-ui/styles-v14-date-review.css)
- [`styles-v14-telegram.css`](../../prototypes/calendar-ui/styles-v14-telegram.css)
- [`styles-v14-upload.css`](../../prototypes/calendar-ui/styles-v14-upload.css)
- [`package.json`](../../prototypes/calendar-ui/package.json) — separate package/check artifact
- [`README-v14.md`](../../prototypes/calendar-ui/README-v14.md)
- [`COUNCIL-v14.md`](v14/COUNCIL-v14.md)
- [`UPLOAD-FIXTURES-v14.md`](v14/UPLOAD-FIXTURES-v14.md)
- [`design-qa-v14.md`](../../design-qa-v14.md) — final independent QA report; **Pass**, 0/0/0/0 unresolved findings
- [`v14/`](v14/) — exact 22-frame current-run evidence roster; 22/22 independently verified

## Independent QA Pass and evidence gate

Fresh zero-disposition agent `/root/v14_independent_qa_final4` completed the entire gate on the exact held candidate and returned **Pass**, with **Critical 0, High 0, Medium 0, Low 0**. The final report records the five pre-QA documentation inputs, exact UI and package hashes, 22/22 original-resolution inspections and mechanics, complete Council §18 and Upload Fixtures coverage, responsive/theme/forced-colors/reduced-motion/keyboard/target/contrast checks, privacy/history/race/session behavior, full inherited v6–v13 live regression, a final 168/168 frozen-byte comparison, and `check:v6` through `check:v14`.

The QA run was read-only and did not edit, create evidence, stage, commit, freeze, push, or deploy. Any UI-byte change invalidates every frame and the Pass, requiring a fresh capture and complete independent gate from zero. A package-byte change requires an updated identity and repeated static checks.

## Frozen inheritance and gate state

- Product acceptance: **A**
- Experience contract: **A**
- Council approval: **A**
- Prototype implementation: **IP until the implementation/evidence commit**
- Evidence: **22/22 current-run frames captured and independently verified at original resolution against repository bytes**
- Independent QA: **A — Pass by `/root/v14_independent_qa_final4`; Critical 0, High 0, Medium 0, Low 0**
- Freeze and handoff record: **freeze-ready; implementation/evidence commit pending; v14 is not frozen**

Frozen v6–v13 UI, Council, fixture, guide, handoff, QA, and evidence bytes remain immutable. V15 cannot leave queued status until this independent Pass is followed by the v14 implementation/evidence commit, the handoff Status line is frozen by a documentation-only commit, and the final tracker-only record names that freeze commit.

## Deliberate limits and commit gate

The candidate is a static frontend prototype using deterministic fictional data and browser-memory mutations. It proves no checksum computation, exact-byte equality, original-file preservation, encryption, durable storage, transactionality, rollback, cross-process concurrency, backend idempotency, persistence, original download, export/restore reproduction, authentication, deployment, operations, production readiness, or formal accessibility conformance.

Following this complete independent Pass, the passed UI, package, guide, handoff, final QA report, Council, fixture sheet, index metadata, and all 22 evidence frames may enter the pending implementation/evidence commit. A later documentation-only freeze-record commit may change only tracker/handoff status material; a final tracker-only commit records that freeze hash. No artifact may contain the hash of the commit that first contains itself.

## Sole permitted closure statement

**V14 prototype-represents durable manual upload, exact-byte duplicate decisions, idempotent retry, original-file provenance, and derived pending/stale outcomes using deterministic fictional browser state. Checksum computation, encrypted storage, durable transactions, persistence, export/restore reproduction, backend idempotency, deployment, and production readiness remain unverified.**
