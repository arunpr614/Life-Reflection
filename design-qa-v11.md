# Life in Days prototype v11 — independent design QA

Date: 2026-08-15
Package: `PVA-006 Needs Date Review`
Requirement disposition: audit gap 1 and the frontend-prototype portions of `LID-TG-006` and `LID-VN-004` prototype-represented; capture, durable holding, source-time truth, integration, persistence, and backend enforcement remain unverified
Independent QA agent: `/root/v10_freeze_prep`
Supporting visual/accessibility reviewer: `/root/v11_ui_designer`
Verdict: **Pass**

## Immutable artifact identity

The Pass applies only to these exact SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/index-v11.html` | `4c31a55c486ce0290c1b88a7114d059dc8961d4fc888c05c277a7cedfc1631f8` |
| `prototypes/calendar-ui/app-v11.js` | `e07edeae0a7fc16d9bcb7105231d9ba9a84cc0185c709c0e9ddc9718aedf53ac` |
| `prototypes/calendar-ui/styles-v11.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `prototypes/calendar-ui/styles-v11-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `prototypes/calendar-ui/styles-v11-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |
| `prototypes/calendar-ui/styles-v11-resilience.css` | `d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c` |
| `prototypes/calendar-ui/styles-v11-date-review.css` | `525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5` |

Any UI-byte change invalidates this disposition and requires a fresh complete independent gate.

## Severity summary

| Critical | High | Medium | Low |
| ---: | ---: | ---: | ---: |
| 0 | 0 | 0 | 0 |

## Coverage completed

### Queue, provenance, and date truth

- Verified the inherited ready/first-use Calendar remains the reload default. Needs Date Review is always reachable through Management, while the conditional wide/More shortcut appears only for a verified positive count.
- Verified the empty, unknown/loading, load-failure, Retry-success, repeat-failure, rapid-repeat, and stale-navigation branches. Unknown state never implies zero or exposes stale queue content.
- Verified the populated fixture contains exactly four unresolved Source Items in the controlled order, with exact Telegram invalid/future and VoiceNotes missing/untrusted reasons, Added-to-review ordering, immutable or unavailable Original Timestamp evidence, operational provenance, preserved status, and semantic list/article/description-list structure.
- Verified every ordinary assignment opens with a blank date. No invalid token, message/receipt time, retrieval time, raw untrusted value, device date, or prototype date is suggested or prefilled.
- Verified the fixed `13 August 2026 · Asia/Kolkata` boundary and the required blank, malformed, impossible, year-zero, leap-day, historical, today, and future validation cases. Errors are associated through `aria-invalid` and `aria-errormessage` without silently normalizing another date.
- Verified the Monday-first picker starts with no selected day and day 1 as its roving focus; historical month/year navigation, arrows, week Home/End, Page Up/Down, Enter/Space, Escape, focus trap/return, the 13 August maximum, and disabled future dates all behave as contracted.

### Preview, assignment, and history

- Verified all four exact before/after previews against the same canonical populated Calendar: 10 August creates a 1-photo day and real cover; 11 August becomes 1 photo/1 journal with the real photo replacing the displayed artwork cover while retaining the artwork; 8 and 2 August each become two-journal days without inventing a cover.
- Exercised additional arbitrary valid destinations to ensure inherited generated summaries remain neutral and cannot contradict current photo counts or Calendar-cover state.
- Verified pending assignment keeps the item unresolved and count unchanged with scoped busy state. Repeat failure retains the chosen date/preview; explicit Retry, rapid repeat, date change, navigation-before-completion, fixture reset, connection interruption/restoration, and session expiry reject stale callbacks and never auto-assign.
- Verified one successful completion attaches the same represented Source Item once, decrements the queue once, derives destination counts/visibility/cover once, and cannot be replayed by a stale callback. Telegram and VoiceNotes paths both passed.
- Verified next-row/previous-row and final 1-to-0 focus, conditional-navigation removal, exact success copy, canonical View day, Browser Back/Forward, reused history positions, abandoned-forward entries, and no resolved-item resurrection.
- Verified Cancel, Escape, Back, cross-view navigation, compact More origin/return, same-URL detail history, reload reset, and session/connection state priority preserve a logical visible focus target and only opaque `entryId` history payloads.

### Privacy, accessibility, and responsive behavior

- Verified the URL contains only safe structural state, `document.title` remains `Life in Days`, and no fixture, item identity, reason, count, source content, chosen date, operation token, result, or focus selector enters history payload, local/session storage, cookies, IndexedDB, Cache Storage, service workers, clipboard, referrer, requests, console, telemetry, or logs.
- Static/runtime checks found no v11 `fetch`, XHR, WebSocket, or `sendBeacon` path and no external asset or request. Local synthetic assets only were used; opaque held-item keys do not appear in product DOM identifiers.
- Verified one H1, landmarks, queue/list/article/form/description-list semantics, concise live regions, scoped busy state, failure alert, date help/error associations, picker trap/return, keyboard operation, visible non-colour focus, and no duplicated source-content announcement.
- All visible controls met the 24 px floor; compact primary controls met 44 px. Essential source, provenance, error, and destination-effect text measured at least 13 px/18 px. Representative light/dark/selected/focus contrast checks passed, including forced-colours behavior.
- Verified 1440, 1280, 960, 700, 390, and 320 px; 568x320 landscape; light/dark; reduced motion; and 640/320 compact reflow equivalents for 200%/400% observations. No page horizontal overflow, clipped source/reason/provenance copy, covered action, bottom-navigation collision, picker-column failure, or fixture-console collapse remained.

### Frozen behavior and scope regression

- Byte-compared frozen v6-v10 artifacts and reverified the exact frozen v10 six-file fingerprint.
- Regressed v6 Search query privacy and deterministic displayed-journal-text scope; v7 Calendar chooser/keyboard/Today/selection/seven columns/real-photo precedence; v8 Almanac load/failure/jump/collapse/canonical return/bounds/exclusions; v9 first-use/readiness/Upload/Settings/recovery truth; and v10 loading/media/connection/Correction/session/server/retry priority and privacy.
- Verified populated Calendar, Museum Margin, full Journal Day, Upload, theme, Settings, Back/Forward, Search, Almanac, and forbidden-scope boundaries. `npm run check:v11`, JavaScript syntax, `git diff --check`, link validation, final hash checks, and console warning/error checks passed.

## Findings repaired before the final Pass

The candidate remained v11 while every finding was repaired, and the complete gate restarted after every UI fingerprint change. Repairs included:

1. Removing the redundant zero-count summary and restoring the exact Empty hierarchy.
2. Correcting cross-view and compact-More history/focus restoration, same-URL detail snapshots, and post-success Back/Forward safety.
3. Expanding the five-control picker header correctly and preserving picker reachability at every compact and landscape width.
4. Associating validation errors, preserving H1-to-input order, and making invalid focus visible in light, dark, and forced-colour modes.
5. Clearing stale live announcements and private boundary content across failure, navigation, loading, session, and reset paths.
6. Replacing held-item-derived DOM identifiers with neutral fixture-owned identities and keeping all review state in live memory.
7. Establishing a coherent populated destination archive before preview and restoring deterministic baselines after Upload or fixture reset.
8. Ordering Added-to-review metadata before provenance and revealing pending, failure, success, next-row, and final-empty focus above fixed shell chrome.
9. Neutralizing inherited generated summaries that could contradict arbitrary new-photo destinations without claiming derived-content regeneration.
10. Repairing the wide fixture-console grid, the 24 px Back target, and the final 13 px/18 px essential provenance/source/preview typography floor.
11. Correcting the handoff's documentation-only eight-level state-priority list before final disposition.

No finding remains open in this v11 package.

## Current-run visual evidence

- [`01-1440x900-date-review-queue-light.png`](docs/prototypes/v11/01-1440x900-date-review-queue-light.png)
- [`02-1440x900-telegram-invalid-preview-light.png`](docs/prototypes/v11/02-1440x900-telegram-invalid-preview-light.png)
- [`03-1440x900-telegram-future-real-cover-preview-dark.png`](docs/prototypes/v11/03-1440x900-telegram-future-real-cover-preview-dark.png)
- [`04-1280x720-voice-missing-blank-light.png`](docs/prototypes/v11/04-1280x720-voice-missing-blank-light.png)
- [`05-1280x720-voice-untrusted-preview-dark.png`](docs/prototypes/v11/05-1280x720-voice-untrusted-preview-dark.png)
- [`06-960x900-assignment-failure-light.png`](docs/prototypes/v11/06-960x900-assignment-failure-light.png)
- [`07-700x900-assignment-pending-dark.png`](docs/prototypes/v11/07-700x900-assignment-pending-dark.png)
- [`08-700x900-success-three-remaining-light.png`](docs/prototypes/v11/08-700x900-success-three-remaining-light.png)
- [`09-390x844-more-sheet-count-light.png`](docs/prototypes/v11/09-390x844-more-sheet-count-light.png)
- [`10-390x844-date-picker-max-date-dark.png`](docs/prototypes/v11/10-390x844-date-picker-max-date-dark.png)
- [`11-390x844-final-success-empty-light.png`](docs/prototypes/v11/11-390x844-final-success-empty-light.png)
- [`12-320x568-four-item-queue-light.png`](docs/prototypes/v11/12-320x568-four-item-queue-light.png)
- [`13-320x568-future-validation-dark.png`](docs/prototypes/v11/13-320x568-future-validation-dark.png)
- [`14-568x320-date-picker-landscape-light.png`](docs/prototypes/v11/14-568x320-date-picker-landscape-light.png)
- [`15-640x900-200-percent-reflow-light.png`](docs/prototypes/v11/15-640x900-200-percent-reflow-light.png)
- [`16-320x900-400-percent-reflow-dark.png`](docs/prototypes/v11/16-320x900-400-percent-reflow-dark.png)

The final files are clean, exact-dimension RGB PNGs captured on the held fingerprint with synthetic content only. Interaction, privacy, focus, and stale-callback assertions come from the written live checks above rather than screenshots alone.

## Evidence boundary

This QA verifies fictional frontend interaction intent, deterministic browser-memory transitions, visual layout, semantics, and the exact static files above. It does not prove Telegram or VoiceNotes capture/retrieval, source-timestamp truth, encryption, durable holding records, server-side validation, backend attachment, persistence, integration behavior, backend idempotency, deployment, formal accessibility conformance, or production readiness.

The supporting visual review's final log-only in-app-browser reconnect was unavailable; it stopped without substituting contaminated evidence. The independent full browser gate completed in an authorized local Chrome surface, and the sixteen final screenshots were separately regenerated and inspected in a clean in-app-browser surface. The 200%/400% evidence uses proportional compact reflow observations and is not formal browser-zoom or WCAG-conformance proof.

The sole permitted closure is: **Needs Date Review is prototype-represented with deterministic synthetic Telegram and VoiceNotes fixtures; capture, encryption, durable holding records, source timestamps, backend attachment, persistence, integration behavior, and idempotency enforcement remain unverified.**
