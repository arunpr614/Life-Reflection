# Life in Days prototype v14 — Durable Manual Upload

> **Independent QA Pass · current-run evidence complete · freeze-ready · not frozen · implementation/evidence commit pending · P=A · D=A · C=A · I=IP · Q=A · fictional deterministic data · browser-memory mutations · no file storage or network**

V14 is the open `PVA-009 Durable Manual Upload` frontend-prototype candidate. It represents deliberate upload of one fictional UTF-8 `.txt` or `.md` journal, archive-wide original-byte duplicate decisions, guarded retry/reconciliation, source provenance, and bounded derived pending/stale consequences while preserving frozen v6–v13 behavior.

The exact nine-file UI fingerprint and separate package/check artifact below passed independent QA. The 22-frame current-run evidence set was captured by the evidence owner and then independently verified from zero against these bytes. V14 is freeze-ready, but the implementation/evidence commit is pending and v14 is not frozen; no backend behavior, storage, deployment, or production state is claimed.

## Run

```sh
npm run check:v14
npm run prototype
```

Open [the v14 prototype](http://127.0.0.1:4173/index-v14.html?view=calendar&month=2026-08).

## V14 contract

- Global **Upload a journal** requires an explicit valid, non-future Journal Date before file choice. Journal Day entry preselects its date but permits deliberate change.
- The bounded fixture accepts one fictional UTF-8 `.txt` or `.md` file up to and including 1 MiB / 1,048,576 bytes. Unsupported type, oversize, invalid UTF-8, empty, missing/future date, read failure, and hostile Markdown review remain explicit safe states.
- Review is inert plain text with filename, source type, exact represented byte size, chosen Journal Date, Original Timestamp semantics, privacy copy, and the adjacent prototype disclosure.
- Duplicate equality is represented archive-wide across live Uploaded Journals using original-byte identity only, independent of filename, extension, decoded text, or Journal Date. V14 fixtures expose zero or one live match.
- The no-match action order is **Cancel**, **Upload journal**. The duplicate-decision order is **Cancel**, **Add anyway**. Cancel and every pre-commit dismissal create nothing.
- Named validation, equality, upload, save, interruption, known-zero failure, unknown-result reconciliation, Retry, and already-completed outcomes remain guarded by one represented operation identity.
- Represented success exposes exactly one complete Source Item, provenance, **View day**, and either a new-day pending or existing-day stale derived consequence without claiming actual storage or generation.
- Private file, preview, date, equality, operation, result, provenance, and focus state stays in live memory and out of URL, title, history payload, storage, requests, console, analytics, telemetry, and product DOM identifiers.
- Back/Escape/backdrop may dismiss only before commit with zero mutation and exact invoker focus restoration. Once commit begins, those controls cannot imply cancellation.
- No PDF, Word, OCR, image upload, blank browser editor, offline queue, real private journal data, full Correction/conflict/redating/history/export behavior, or production integration is included.

## Exact passed candidate identity

The independent Pass disposition applies only to these exact nine UI artifacts:

| Artifact | SHA-256 |
| --- | --- |
| `index-v14.html` | `1b0b32482ae4223f743e028696a1401962da12f0b89befd042789c98bf8b2e82` |
| `app-v14.js` | `d7180fc3ba478974f7fd459b755f6e0db986414726dc812cf89aad854ae5331e` |
| `styles-v14.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `styles-v14-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `styles-v14-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |
| `styles-v14-resilience.css` | `d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c` |
| `styles-v14-date-review.css` | `525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5` |
| `styles-v14-telegram.css` | `6489ac5e330af80c0488ed411229a6256d13765535b8cdf2eb9a3e42a21e4992` |
| `styles-v14-upload.css` | `ca45322956ba372850550be860a02bcd6b63735108808d1612033bf327b81b74` |

The separate package/check artifact is `package.json` at SHA-256 `53bd721c1396c173a36c44560af8377a6f9828fd54a68303da88b4c0402bb3e9`.

Any UI-byte change invalidates the complete evidence set and requires all 22 frames plus independent QA to restart from zero. A package-byte change requires an updated package identity and repeated static checks.

## Current-run evidence manifest

The exact roster comes from [Upload Fixtures v14](../../docs/prototypes/v14/UPLOAD-FIXTURES-v14.md#evidence-roster). These fresh files were captured after the held UI fingerprint, inspected at original resolution by the evidence owner, and matched byte-for-byte to the repository. Independent agent `/root/v14_independent_qa_final4` then inspected all 22 files individually at original resolution, verified their mechanics and repository-byte equality, and passed the complete gate from zero.

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

All 22 exact files are fresh after the held UI bytes, match the fixture-prescribed state/theme/viewport/zoom, are verified RGB8 non-interlaced PNGs at exact dimensions, were individually inspected, match repository bytes, and leave no stale or extra frame. Any later UI-byte change invalidates this evidence and Pass disposition.

## Frozen inheritance and gate state

V14 inherits frozen v6–v13 UI, documentation, evidence, interaction, and privacy contracts. No earlier version artifact may change.

- Product acceptance: **A**
- Experience contract: **A**
- Council approval: **A**
- Prototype implementation: **IP until the implementation/evidence commit**
- Evidence: **22/22 current-run frames captured and independently verified at original resolution against repository bytes**
- Independent QA: **A — Pass by `/root/v14_independent_qa_final4`; Critical 0, High 0, Medium 0, Low 0**
- Freeze and handoff record: **freeze-ready; implementation/evidence commit pending; v14 is not frozen**

V15 remains queued until the independently passed v14 completes its implementation/evidence commit, documentation-only freeze record, and final tracker record.

## Deliberate limits and QA gate

This is a static frontend prototype with fictional fixtures and browser-memory transitions. It does not prove checksum computation, actual byte equality, encrypted storage, transactionality, rollback, cross-process concurrency, durable idempotency, persistence, original download, export/restore reproduction, authentication, deployment, operations, production readiness, or formal accessibility conformance.

The independent QA report records the exact pre-QA inputs, complete Council §18 and fixture coverage, all 22 frame inspections, final 168/168 frozen v6–v13 byte comparison, `check:v6` through `check:v14`, live regressions, cleanup, and conservative proof boundary. Any candidate-byte change invalidates the Pass and requires the applicable evidence and independent checks to restart.

## Review artifacts

- Handoff: [CALENDAR-UI-PROTOTYPE-v14.md](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v14.md)
- Council: [COUNCIL-v14.md](../../docs/prototypes/v14/COUNCIL-v14.md)
- Upload fixture sheet: [UPLOAD-FIXTURES-v14.md](../../docs/prototypes/v14/UPLOAD-FIXTURES-v14.md)
- Independent QA report: [design-qa-v14.md](../../design-qa-v14.md) — **Pass** on the exact held inputs; 0/0/0/0 unresolved findings
- Evidence directory: [docs/prototypes/v14/](../../docs/prototypes/v14/) — exact 22-frame current-run roster; 22/22 independently verified

## Sole permitted closure statement

**V14 prototype-represents durable manual upload, exact-byte duplicate decisions, idempotent retry, original-file provenance, and derived pending/stale outcomes using deterministic fictional browser state. Checksum computation, encrypted storage, durable transactions, persistence, export/restore reproduction, backend idempotency, deployment, and production readiness remain unverified.**
