# Life in Days prototype v14 — independent design QA

Date: 2026-08-17
Package: `PVA-009 Durable Manual Upload`
Requirement disposition: the bounded frontend-prototype portion of `LID-UP-001` through `LID-UP-003` is prototype-represented; implementation/evidence commit and freeze remain pending, while backend, persistence, storage, authentication, deployment, and production enforcement remain unverified
Independent QA agent: `/root/v14_independent_qa_final4`
Verdict: **Pass**

The final agent began with zero carried disposition and completed the complete Council v14 §18 and Upload Fixtures gate on the exact held candidate. It returned **Critical 0, High 0, Medium 0, Low 0**. V14 is freeze-ready, but its implementation/evidence commit is pending and it was not frozen, edited, staged, committed, pushed, or deployed by this QA run.

## Final disposition

| Critical | High | Medium | Low |
| ---: | ---: | ---: | ---: |
| 0 | 0 | 0 | 0 |

No finding remains open. The Pass is bounded to branch `prototype/calendar-ui-v14-durable-manual-upload`, frozen baseline `a6c2f782d893c6836ea72f7760fca1d4d54af49d`, the exact static identities below, and the exact 22-frame current-run set. Any byte change follows the invalidation rules recorded below.

## Immutable candidate identity

The UI Pass applies only to these exact SHA-256 values:

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

The separate package/check artifact is:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/package.json` | `53bd721c1396c173a36c44560af8377a6f9828fd54a68303da88b4c0402bb3e9` |

Any UI-byte change invalidates all 22 evidence frames and the complete interaction disposition. A package/check-artifact change requires an updated identity and repeated static checks.

## Exact pre-QA documentation inputs

The independent agent read and verified these exact authority inputs before returning Pass:

| Input | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/README-v14.md` — pre-QA guide | `fdb061a14ebd7637b925f2ae01d81542a26bc8724fe20621f6660a4028dfebc2` |
| `docs/prototypes/CALENDAR-UI-PROTOTYPE-v14.md` — pre-QA handoff | `4589c79058f624f55f15265625afaa9902c76c383a8d09dd96730b0b84d74cb1` |
| `design-qa-v14.md` — pre-QA brief bytes replaced by this final report | `a0cdc2dea98644494848dc46817028381a27f66616b287846068301543e9e88e` |
| `docs/prototypes/v14/COUNCIL-v14.md` | `26f779cdcd89f1307cbd10e2aa38e99d26a6f6b4445377fc5db2f38a0950f6c9` |
| `docs/prototypes/v14/UPLOAD-FIXTURES-v14.md` | `f179d96327b6e9d3f10ec686095b90f85779a24e8b0a0ff4de9e6e94773f49c0` |

The guide, handoff, and this file change during Pass finalization. This table records the exact inputs the agent actually reviewed and deliberately does not claim or embed the final QA report's own hash.

## Current-run candidate evidence manifest

The exact authoritative roster is [Upload Fixtures v14](docs/prototypes/v14/UPLOAD-FIXTURES-v14.md#evidence-roster). The evidence owner captured and inspected these fresh files after the held UI fingerprint and established format, dimensions, hashes, uniqueness, and repository parity. The independent agent then verified every row again from zero and personally opened all 22 PNGs one-by-one, in order, at original resolution before browser testing.

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

All 22 exact files are fresh after the held UI fingerprint, match required state/theme/viewport/zoom, are exact-dimension RGB8 non-interlaced PNGs with unique hashes, were individually inspected at original resolution, equal the accepted repository bytes, and leave no stale or extra frame. Result: **22/22 clean**.

## Coverage completed

### Authority, static checks, and frozen bytes

- Read the complete Council v14 §18 contract, Upload Fixtures v14 matrix, exact pre-QA guide/handoff/brief inputs, and inherited frozen v6–v13 authority before testing.
- Reconfirmed the exact nine UI hashes, separate package hash, and five pre-QA documentation-input hashes recorded above. The shared package delta was additive, and the final canonical reload matched the held runtime files and served bytes.
- Passed syntax, package, relative-link, local-resource, secrets, privacy, and whitespace checks, plus `npm run check:v6` through `npm run check:v14`.
- Completed the final frozen v6–v13 byte comparison against baseline `a6c2f782d893c6836ea72f7760fca1d4d54af49d`: **168/168 exact, 0 mismatches**.
- On the final canonical reload, `check:v14` passed, console warnings/errors were 0, and the network contained exactly nine localhost GETs with no external request or request-body data.

### Current-run visual evidence

- Personally opened and inspected all 22 repository PNGs one-by-one, in manifest order, at original resolution before live browser testing: **22/22 clean**.
- Verified exact roster and order, manifest hashes, required and actual dimensions, RGB8 non-interlaced PNG mechanics, uniqueness, repository-byte equality, and absence of stale or extra evidence.
- Explicitly verified row 04 at 1440 × 900 as the complete `HOSTILE-A` inert review, row 20 at 390 × 844 with the exact long-filename reflow, and row 22 at 320 × 900 with the required 400% error reflow.
- Used screenshots only as supporting visual evidence; live testing established interaction, focus, announcement, privacy, storage/network, race, Back/Forward, session, and inherited-regression behavior.

### Complete Council §18 and fixture matrix

- Completed every Council v14 §18 static, live, accessibility, privacy, history, interruption, race, regression, and excluded-scope check.
- Completed Upload Fixtures E1–E8, V1–V10, the full review and `HOSTILE-A` matrix, P1–P8, Q1–Q5, F1–F6, R1–R10, S1–S14, N1–N3, every provenance row, every focus/history/live-region row, every browser-surface privacy assertion, all 22 responsive evidence states, and the complete frozen v6–v13 regression.
- Verified exact copy and action order, chosen dates, before/after counts, archive-wide zero-or-one live-match behavior, a fresh explicit permit for each duplicate operation, zero mutation on Cancel/failure, one atomic zero-or-one result, Source Item provenance, and truthful derived pending/stale consequences.

### Manual upload, identity, results, and provenance

- Verified global blank-date and Journal Day preselected-date entry, non-future date changes, file-choice gating, accepted `.txt`/`.md` boundaries, exact 1 MiB limit, invalid type/size/UTF-8/empty/date/read states, long content, and hostile Markdown rendered as inert plain text.
- Verified original-byte fixture identity independent of filename, extension, decoded text, and Journal Date; zero/no-match and one/live-match branches; exact **Cancel** then **Upload journal** or **Cancel** then **Add anyway** order; and no mutation from cancellation or any pre-commit dismissal.
- Verified upload/save stages, represented success, exactly one complete Source Item, View-day handoff, Original Timestamp semantics, represented original identity and export/restore membership, and both new-day pending and existing-day stale derived outcomes without upgrading those representations to backend proof.

### Failures, retries, races, history, focus, privacy, and session

- Exercised validation, equality, upload, save, interruption, known-zero failure, unknown-result reconciliation, Retry, already-completed, duplicate callback, concurrent operation, stale callback, reset, connection loss/restoration, and session-interruption branches. One represented operation identity produced at most one settled result, with no optimistic success, automatic duplicate permit, hidden completion, or stale mutation.
- Verified locked Back/rebound after commit, deferred callback ordering, focus epochs, accepted and rejected upload-open boundaries, exact invoker restoration before commit, terminal/failure focus, user-moved-focus preservation, scroll truth, repeat traversal, multi-flow history, and deduplicated live-region announcements.
- Verified structural URL, `Life in Days` title, opaque-only history state, local/session storage, IndexedDB, Cache Storage, service workers, referrer, product DOM identifiers, console, requests, telemetry, analytics, and logs remained free of private fixture/file/date/preview/equality/operation/outcome/focus data.
- Verified session teardown removed private state and represented reauthentication returned to a safe default without restoring or resuming an operation. No external/private data, provider request, credential, forbidden v15+ behavior, or external network action occurred.

### Responsive, theme, semantic, and accessibility observations

- Exercised all named viewports and evidence states, including 1440 × 900, 1280 × 720, the 961/960 split boundary, 960 × 900, 700 × 900, 640 × 900 at 200% text zoom, 390 × 844, 568 × 320 landscape, and 320 × 900 at 400% page reflow.
- Verified light and dark themes, forced colors, reduced motion, measured contrast, visible focus, keyboard and pointer operation, 24 × 24 target floors, 44 × 44 compact/touch actions, semantic names and labels, ARIA relationships, live regions, dialogs, landmarks, one main, one H1, correct DOM/visual order, wrapping, and no horizontal overflow, actionable clipping, covered focus, or unreachable control.
- These are bounded prototype observations, not formal WCAG or assistive-technology conformance evidence.

### Complete inherited v6–v13 live regression

- Regressed frozen v6 Search; v7 Calendar and Museum Margin; v8 Almanac; v9 readiness, Settings, backup, and Recovery Ceremony boundaries; v10 shell, failure, Correction, connection, and session behavior; v11 queue, picker, assignment, races, destinations, history, and focus behavior; v12 Telegram authorization, media, caption, operation, Retry, interruption, partial-group, and handoff behavior; and v13 Telegram duplicate behavior.
- Completed the v12 Telegram scenario/auth/media/caption/operation/handoff matrix and the v13 duplicate D0/NM/SD/XD/LF/CF/ID/ST/CN/SS and handoff matrices. No inherited functional regression or frozen-byte drift was found.

## Disposition and invalidation rules

1. The final gate found no unresolved Product, Design, Council, documentation, or implementation contradiction.
2. The first actionable finding would have stopped and invalidated the run; none occurred in this final run.
3. Any v14 UI-byte repair invalidates all 22 frames and restarts complete QA from zero.
4. Any frozen v6–v13 drift is an immediate blocker.
5. Pass requires zero unresolved Critical, High, Medium, or Low findings.
6. A screenshot or frontend result cannot upgrade checksum, storage, durability, export/restore, authentication, deployment, accessibility conformance, or production status.

## Recovered harness timeout

One bounded six-branch Node automation batch exceeded the 30-second call limit and reset only the Node kernel. The product, exact in-app Browser tab, origin, and server remained healthy. The agent reread the Browser/CDP/viewport guidance, reinitialized runtime bindings, and rebound the same tab id `1`, session, and origin. No duplicate tab, server, or origin was created; every affected assertion was rerun successfully, and there was no product impact or actionable finding.

## Final reset and cleanup

- Reset viewport, media emulation, root state, and theme state.
- Closed in-app Browser tab id `1`; controlled and visible tab lists were empty.
- Stopped server session `48504` and confirmed port `49271` was clear.
- Left no QA-created temporary artifact, evidence file, repository edit, stage, commit, freeze, tracker change, push, deploy, or external network action.
- The QA run remained read-only throughout. It did not inspect or touch `RUNNING_LOG.md` or any `Phase1*` path.
- Finished with no active or hung tool call and no temporary/evidence artifact left behind.

## Evidence boundary

This Pass establishes only deterministic fictional browser behavior, rendering, semantics, focus, transitions, privacy surfaces, and the exact held static bytes. It does not prove actual checksum calculation or byte equality, original-file preservation, encrypted or durable storage, durable transactions, rollback, cross-process concurrency, backend idempotency, persistence, original download, export/restore reproduction, authentication, Telegram/provider/backend integration, deployment, operations, formal accessibility conformance, or production readiness.

## Sole permitted closure statement

**V14 prototype-represents durable manual upload, exact-byte duplicate decisions, idempotent retry, original-file provenance, and derived pending/stale outcomes using deterministic fictional browser state. Checksum computation, encrypted storage, durable transactions, persistence, export/restore reproduction, backend idempotency, deployment, and production readiness remain unverified.**
