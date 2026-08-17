# Life in Days prototype v13 — independent design QA

Date: 2026-08-17
Package: `PVA-008 Telegram Duplicate Handling`
Requirement disposition: the bounded frontend-prototype portion of `LID-TG-008` is prototype-represented; backend, Telegram, persistence, authenticated-link, and production enforcement remain unverified
Independent QA agent: `/root/v13_independent_qa_final5`
Verdict: **Pass**

The final agent began with zero carried disposition, completed the full Council §15 gate on the repaired candidate, encountered no actionable finding, and returned **Critical 0, High 0, Medium 0, Low 0**. V13 is freeze-ready but was not frozen, staged, or committed by this QA run.

## Immutable artifact identity

The UI Pass applies only to these exact SHA-256 values:

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

The separate package/check artifact was also held and rechecked:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/package.json` | `ae23958c41e355c3235d881f62ddfe414cfd38ca52b63c85e6a79c87c323ee01` |

Any byte change to a UI artifact invalidates this disposition and all 22 evidence frames, requiring a fresh capture and complete independent gate. A package/check-artifact change requires an updated identity and repeated static checks.

## Exact pre-QA documentation inputs

The independent agent read and verified these exact documentation bytes before PASS finalization:

| Input | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/README-v13.md` — pre-QA guide | `1485b2b05258201095f75d4857b2467f512fd1ce488c29200ca8cf9509b76727` |
| `docs/prototypes/CALENDAR-UI-PROTOTYPE-v13.md` — pre-QA handoff | `531863f01c27f4e21aedc651cf00a468e4ac2f4038edc2f9685b62b8a1c04775` |
| `design-qa-v13.md` — pre-QA brief bytes replaced by this final report | `8f96d2d627fafe5ec192132d6aef1497bfaf2e68e85a15e3023d86d6516cbb7b` |
| `docs/prototypes/v13/COUNCIL-v13.md` | `42c9570e199724fbc767df4771d5123c3a9bdf3e59610e8d11bfd72eab1297a7` |
| `docs/prototypes/v13/TELEGRAM-DUPLICATE-FIXTURES-v13.md` | `de3729b189b3bac955f2d781d328d426c95f62ad7fca9d06532cb52374ee59eb` |

The guide, handoff, and this file change during PASS finalization. The table records the inputs the agent actually reviewed; it deliberately does not claim or embed the final QA report's own hash.

## Severity summary

| Critical | High | Medium | Low |
| ---: | ---: | ---: | ---: |
| 0 | 0 | 0 | 0 |

No finding remains open in the final run.

## Coverage completed

### Authority, static checks, and frozen bytes

- Read the required Browser and Product Design guidance, the complete v13 authority set, and referenced frozen v6–v12 Council, fixture, guide, handoff, and QA records before testing.
- Reconfirmed all eight runtime hashes, the package hash, the five pre-QA documentation-input hashes above, and exact served-byte parity for every v13 runtime resource from a fresh unique in-app Browser origin, session, and tab.
- Passed JavaScript syntax, package metadata, `npm run check:v6` through `npm run check:v13`, `git diff --check`, relative-link resolution, secrets inspection, local-only-resource inspection, and forbidden-v14 checks.
- Byte-compared frozen v6–v12 UI, documentation, and evidence against baseline `1aa3c5f`. No drift was found. The shared package change from frozen v12 is limited to the additive `check:v13` script.

### Current-run visual evidence

- Personally inspected all 22 repository PNGs individually at original resolution.
- Verified exact Council filenames and dimensions, 8-bit RGB non-interlaced PNG structure, 22 unique SHA-256 values, repository-byte equality, and provenance after the repaired UI fingerprint was held.
- Used the frames as supporting visual evidence only; all interaction, focus, privacy, race, accessibility, and regression assertions were exercised live.

### V13 duplicate decisions and state truth

- Verified the exact default guide and the frozen-v12 no-match continuation through **Checking for identical bytes…** into the inherited waiting and success path.
- Verified same-day checking, `Already imported`, exact Cancel and `Add duplicate anyway` actions/order, zero default mutation, Cancel terminal, permitted success, chronology, cover, captions, Original Timestamp, before/after counts, one represented shared Media Asset, two distinct references, one acknowledgement, View-day handoff, Back, and Forward.
- Verified cross-day checking, the date-only warning, exact Cancel and date-specific permit actions/order, absent-to-visible 10 August transition, unchanged 13 August day, new-day cover, caption and Original Timestamp, both success handoffs, date-only provenance, exact return focus/scroll, and no ordinary tile duplicate badge.
- Verified duplicate-check and reference-commit failures fail closed, preserve zero-change truth, expose explicit Retry, and never transform retry into automatic permission.

### Identity, race, stale work, and interruptions

- Exercised pending and settled same-message replay, a different equal-byte message, rapid permit activation, repeated completion callbacks, two-message concurrency, two separately permitted messages, and one-of-two permits. Each permit identity produced at most one represented Daily Photo, Source Item, reference, and acknowledgement.
- Exercised navigation away during lookup and commit, reset, fixture change, represented-date change, Cancel before completion, stale callbacks, connection loss and restoration, session interruption, and represented reauthentication.
- Verified no hidden completion, reconnect auto-resume, decision resurrection, lookup rerun, duplicate reference, or stale mutation occurred; settled archive truth never regressed.

### Handoffs, history, focus, and the repaired path

- Verified every decision, destination, existing-day, affected-day, and same-media provenance handoff, including structural URL, opaque history entry, destination H1 focus, Back/Forward truth, exact invoker focus, and scroll restoration without rerun.
- Explicitly reproduced the repaired inherited path: **Four preserved items** → Telegram invalid date → **Choose from calendar** → 10 August. Return focus landed on **Choose from calendar**.
- Verified direct date-textbox editing retained input focus, so the v13-only repair did not regress the distinct direct-edit contract.
- Verified terminal H2 focus, failure H2 focus, guarded decision fallback, user-moved-focus preservation, keyboard arrow/Escape behavior, live-region deduplication, and absence of delayed focus theft.

### Captions, references, privacy, and scope

- Verified incoming captions, source forms, and Original Timestamps remain attached to their own represented references; existing caption/day/cover truth stays unchanged; relationship counts remain scoped and truthful.
- Verified the title is `Life in Days`; URLs are structural; history state is opaque-only; and private fixture, date, caption, decision, match, checksum, media/reference identity, operation, outcome, and focus values stay out of product DOM identities, local/session storage, cookies, IndexedDB, Cache Storage, service workers, clipboard, referrer, requests, console, telemetry, analytics, and logs.
- Verified all runtime requests were local and that no external resource, Telegram/provider/AI request, credential, provider ID, real photo, private source data, or forbidden v14+ behavior was present.
- Verified session interruption removes private state and represented reauthentication returns to a safe default without restoring or resuming the operation.

### Responsive, theme, semantic, and accessibility observations

- Exercised 11 named desktop, mobile, boundary, landscape, and reflow sizes: 1440 × 900, 1280 × 720, 961 px, 960 × 900, 901 px, 700 × 900, 390 × 844, 320 × 568, 568 × 320, 640 × 900 at 200%, and 320 × 900 at 400%.
- Verified the exact split/stack boundary, DOM/visual order, full-width compact decision actions, long cross-day copy/action wrapping, and no horizontal overflow, actionable clipping, covered focus, or unreachable control.
- Verified light and dark themes, forced colors, reduced motion, measured contrast, visible focus, 24 × 24 target floors, 44 × 44 compact/touch actions, keyboard and pointer operation, semantic names, labels, ARIA references, live regions, dialogs, landmarks, one main, and one H1.
- These are bounded prototype observations, not formal WCAG or assistive-technology conformance evidence.

### Complete frozen v6–v12 functional regression

- Regressed frozen v6 Search; v7 Calendar and Museum Margin; v8 Almanac; v9 readiness, Settings, backup, and Recovery Ceremony boundaries; v10 shell, failure, Correction, connection, and session behavior; v11 queue, picker, assignment, races, guided destinations, history, and focus behavior; and v12 Telegram authorization, media, caption, operation, Retry, interruption, and partial-group branches.
- Verified the inherited Uploaded Journal exact-text duplicate behavior remains unchanged.
- Verified v13 introduces no Needs Date Review duplicate, Trash-only duplicate decision, multiple-match decision, upload behavior, or other v14+ scope.

## Stopped-run finding, repair, and complete restart

An earlier independent run stopped at its first actionable finding and returned no disposition:

- Finding: **Low — date-picker focus return.** Returning from **Choose from calendar** failed to restore focus to that invoker.
- Repair: v13-only `app-v13.js` logic distinguishes the calendar chooser from direct date-textbox edits, restoring chooser focus for the former while retaining input focus for the latter.
- Invalidation: the app-byte change discarded the stopped run and all earlier v13 evidence. Product/Council and adversarial static re-audits were clean on the new fingerprint; all 22 frames were regenerated.
- Restart: `/root/v13_independent_qa_final5` began with zero carried disposition and completed the entire static, evidence, live, accessibility, privacy, and frozen-regression gate from zero.

The stopped run contributes repair history only. Its partial work does not contribute to the final Pass.

## Exact current-run evidence manifest

| File | Dimensions | SHA-256 | Format |
| --- | ---: | --- | --- |
| `01-1440x900-duplicate-guide-default-light.png` | 1440 × 900 | `74a5547d4846d93f3d7c1ec11be3d76f9e45115b78ac320bb437c2f89df9c64a` | PNG RGB8, non-interlaced |
| `02-1440x900-same-day-checking-dark.png` | 1440 × 900 | `1056267ac6fd230b8ec89aeef779dd4736b9162d2b4a58f16f35881f48b632df` | PNG RGB8, non-interlaced |
| `03-1440x900-same-day-already-imported-light.png` | 1440 × 900 | `a88a36f4b347a190543baf281c5b88dc431dbf1732decc46ff8e5d7ecfd33f6f` | PNG RGB8, non-interlaced |
| `04-1440x900-same-day-add-success-dark.png` | 1440 × 900 | `01e4f7c14344faf029b750bd4ecf30ed67944ea032914b7cc56c6996472dde83` | PNG RGB8, non-interlaced |
| `05-1280x720-same-day-cancel-light.png` | 1280 × 720 | `9b9d9aeea4934a2c79c7a5b4fb287ba302ff1be63fcc4289c00f608c13039a5a` | PNG RGB8, non-interlaced |
| `06-1280x720-cross-day-decision-dark.png` | 1280 × 720 | `570ab30de67585cb3a4cfc82109b0e2314f37873ad06106c4a826442aa7d83e2` | PNG RGB8, non-interlaced |
| `07-1280x720-cross-day-permit-success-light.png` | 1280 × 720 | `f2c564d535cc410cd34b9b092269defa90755f2d22d713cb1a6ac7648503b033` | PNG RGB8, non-interlaced |
| `08-1280x720-cross-day-cancel-dark.png` | 1280 × 720 | `ebcf7c86955c20773efde2b2265c6ed9c92396862953721935f431e5310f102c` | PNG RGB8, non-interlaced |
| `09-960x900-duplicate-check-failure-light.png` | 960 × 900 | `9164ee9591d54169c523d18f53d59a97918bc005221adff90b7abfc84589ba44` | PNG RGB8, non-interlaced |
| `10-960x900-add-failure-retry-dark.png` | 960 × 900 | `242b926f6e0dc820ca99ed5360aeb890b17451cb7ea5d8c9fe223308ad48f6cc` | PNG RGB8, non-interlaced |
| `11-960x900-replay-unchanged-light.png` | 960 × 900 | `b70cd6a35c09405708392c777612cc72497b072a48f859fd3c0eed19a238005e` | PNG RGB8, non-interlaced |
| `12-700x900-same-day-decision-light.png` | 700 × 900 | `e4ebdb676866593680c452c5eac0d165cf13d87128c5a7a19687a25bc8c0350c` | PNG RGB8, non-interlaced |
| `13-700x900-cross-day-warning-dark.png` | 700 × 900 | `74f3840667269c035bc50caf1d4232893741d1c869d66e440aeffe8fc15d03c7` | PNG RGB8, non-interlaced |
| `14-700x900-shared-media-provenance-light.png` | 700 × 900 | `275e2fda4f272cb897be44b3fb20eaff922d78d02daa995b935f87533e35c47b` | PNG RGB8, non-interlaced |
| `15-390x844-same-day-decision-dark.png` | 390 × 844 | `7f80cfc684cfb775f751626d1e804337b8d05fd34d9ee030896590ae30174082` | PNG RGB8, non-interlaced |
| `16-390x844-cross-day-success-private-link-light.png` | 390 × 844 | `2e56b1234713c14531f9a12e39ec623d074fe2247a7adbb289dd3493f0799d0f` | PNG RGB8, non-interlaced |
| `17-390x844-day-provenance-return-dark.png` | 390 × 844 | `5715d34cc3c212ab8a808a762fd409b62334dfd969b3ef7f708195213caf44e3` | PNG RGB8, non-interlaced |
| `18-320x568-long-same-day-decision-light.png` | 320 × 568 | `b07d8ff02f94489c205f09a79f979c622cbd472133c48319cf060919b72dbf34` | PNG RGB8, non-interlaced |
| `19-320x568-long-error-retry-dark.png` | 320 × 568 | `596aa21eed4fcadabeed58ff978e8d36568eaac98d3d88256797776f4a3b4bda` | PNG RGB8, non-interlaced |
| `20-568x320-cross-day-landscape-light.png` | 568 × 320 | `16227e63ca588ab607e0cb85e3b8b6b1d5666a716419e92bf0ba7e446a823804` | PNG RGB8, non-interlaced |
| `21-640x900-200-percent-reflow-light.png` | 640 × 900 | `eeaedfadde408f5d12bb940ae5486f60ffabf791a0a6dfd2908fc7c744861e13` | PNG RGB8, non-interlaced |
| `22-320x900-400-percent-reflow-dark.png` | 320 × 900 | `8bfc1235a4ced918171850ca00ced5d6498d679396675dce4da4c4d088d2eab3` | PNG RGB8, non-interlaced |

All 22 files have the exact Council roster and dimensions, are 8-bit RGB non-interlaced PNGs, have unique SHA-256 values, were independently inspected at original resolution, and match the accepted repository set byte-for-byte.

## Final reset and cleanup

- Removed the theme preference created during testing and cleared session storage.
- Reset viewport and media emulation.
- Closed the sole QA tab; the in-app Browser tab list was empty.
- Stopped the unique local server and confirmed port `43173` was closed.
- Left no QA-created screenshot, temporary artifact, repository edit, staging, commit, or tracker change.
- Recovered transient Browser-kernel and selector-harness errors, then repeated every affected assertion successfully in the same unique session. No active or hung tool call remained.
- Finished on the canonical structural Calendar URL with private duplicate/caption state absent, theme-only preference storage removed, and a clean console.

## Evidence boundary

This QA verifies deterministic fictional frontend interaction intent, browser-memory transitions, visual layout, semantics, privacy surfaces, and the exact static files above. It does not prove actual plaintext checksum calculation or byte equality, encryption, physical asset reuse, database constraints, durable or transactional reference creation, cross-process concurrency, backend idempotency, persistence, restore, backup, authentication, Telegram/provider integration, deployment, operations, formal accessibility conformance, or production readiness.

The sole permitted closure is: **Telegram duplicate decisions are prototype-represented with deterministic synthetic checksum and Media Asset fixtures; plaintext checksum calculation, encrypted asset reuse, durable reference creation, transactional race prevention, backend idempotency, persistence, Telegram integration, and authenticated links remain unverified.**
