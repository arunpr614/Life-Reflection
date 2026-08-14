# Life in Days prototype v10 — independent design QA

Date: 2026-08-14
Package: `PVA-005 Resilient Application Shell`
Requirement disposition: audit gap 3 interruption/failure portion prototype-represented; connectivity, persistence, authentication, operations, and later lifecycle packages remain open
Independent QA agent: `/root/v10_independent_qa`
Verdict: **Pass**

## Immutable artifact identity

The Pass applies only to these exact SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/index-v10.html` | `9a8a1da6fc00ff4f694cb00dba3f5784168ab1a9d45b16ca680c410d6d330428` |
| `prototypes/calendar-ui/app-v10.js` | `5e0876d7e5ce91040b7b921a1a1fe10746304ae85f39c66f001166e56b8793ca` |
| `prototypes/calendar-ui/styles-v10.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `prototypes/calendar-ui/styles-v10-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `prototypes/calendar-ui/styles-v10-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |
| `prototypes/calendar-ui/styles-v10-resilience.css` | `d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c` |

Any UI-byte change invalidates this disposition and requires a fresh complete independent gate.

## Severity summary

| Critical | High | Medium | Low |
| ---: | ---: | ---: | ---: |
| 0 | 0 | 0 | 0 |

## Coverage completed

### Shell state and recovery truth

- Verified reload opens the frozen v9 first-use Calendar in the ready shell with the exact prototype privacy boundary, canonical title, no failure/authentication claim, and no external request.
- Verified initial loading in light/dark and reduced motion: one loading H1, `aria-busy`, hidden geometry-preserving skeletons, no stale photo/journal/first-use content, and deterministic success/failure transitions.
- Verified Calendar month loading keeps the verified August snapshot out of the pending September surface and out of URL/history until success; failure restores August with exact copy; Retry, rapid repeat, Back, Forward, and navigation-before-completion create at most one committed destination.
- Verified partial-photo failure preserves the same Journal Day, date, photo record, Museum Margin, full-day journals, order, and counts. Retry success/failure, rapid repeat, and navigation cancellation operate on one item without substitution or duplication.
- Verified persistent connection interruption across Calendar, Almanac, Search, Settings, and full Journal Day. Existing content remains readable but explicitly uncertain; Check is scoped; reconnection never submits a pending change; failure and restored messages never contradict the current connection state.
- Verified empty-load and settled-content server failures follow the priority contract, expose one primary recovery action, keep sanitized details free of private identifiers, and guard success, repeated failure, rapid activation, and stale completion.

### Correction, session, and idempotency

- Verified the bounded Correction exercise keeps its synthetic draft, selection, and caret only in the open page. Disconnected Save and repeated Retry remain at zero represented saves; reconnection does not auto-save; one explicit post-reconnect Retry produces exactly one in-tab represented Correction.
- Verified the draft, DOM value, and caret remain byte-for-byte stable through Saving and a forced connection-loss failure while the failure group receives focus. Close/reopen retains the one represented result without creating another.
- Verified Cancel, Escape, app navigation, browser Back, and a pending save use the unsaved-leave guard without stale completion. Keep editing preserves exact text/selection/focus; Discard executes its intended destination once; reload does not resurrect a draft.
- Verified native `beforeunload` is requested for a dirty draft. The automation backend auto-handled the browser-owned dialog, while independent reload/reset evidence confirmed intentional draft loss and no recovery promise.
- Verified session expiry from ordinary content and a dirty draft removes private archive DOM and inherited live/toast text, makes Back/Forward unable to reveal it, presents no login/MFA imitation, and returns only to a generic Calendar with no selected date, private destination, or draft.
- Verified operation identities coalesce repeat activation and reject stale callbacks after navigation, fixture reset, modal transition, session expiry, or a newer attempt. Month history, media count, Correction count, and server-ready transitions each remain single-result.

### Privacy, accessibility, and responsive behavior

- Verified URL/title/history/storage/privacy boundaries: only inherited structural query keys, an opaque `entryId`, and inherited theme/rail preferences appear. No fixture, failure, retry token, draft, source text, query, focus selector, authentication state, or redirect target enters URL, title, history payload, local/session storage, requests, or console.
- A clean reload made six same-origin static requests, with zero external requests, failed requests, console warnings, or errors. Ambient origin cookie/service-worker/cache/IndexedDB objects were pre-existing, unchanged, and unused by this prototype.
- Verified headings, landmarks, named regions, restrained live announcements, busy/skeleton semantics, dialog traps/returns, keyboard paths, focus visibility, and non-color state. The smallest visible control exceeded 24 px; compact primary actions were 44 px. Representative minimum measured text contrast was 4.68:1 light and 7.12:1 dark.
- Verified 1440, 1280, 960, 700, 390, and 320 px, 568×320 landscape, light/dark, and reduced motion without horizontal page overflow, clipped copy, covered recovery actions, or Calendar-column degradation. The 700 px boundary retains readable two-line journal titles/counts inside every tile.
- The in-app backend capped requested page scale at 3×. Independent 640 px and 320 px reflow-equivalent observations covered the 200%/400% compact layouts; this is not formal browser-zoom or accessibility-conformance evidence.

### Frozen behavior and scope regression

- Verified frozen v9 first-use/readiness truth, a real Uploaded Journal, never-verified recovery language, Settings focus/Back, and the complete prototype privacy banner.
- Verified frozen v8 Almanac loading, failure/Retry, jump, collapse, bounded range, hidden/Trash-only exclusions, canonical full-day route, and exact return context.
- Verified frozen v7 Calendar chooser, keyboard navigation, Today/selected/focus treatments, quiet days, seven columns, and real-photo precedence.
- Verified frozen v6 Search scope and live-memory query privacy across reload/Back/Forward.
- Verified Upload, theme, full Journal Day, focus/scroll restoration, and forbidden-scope scans. `npm run check:v10`, JavaScript syntax, `git diff --check`, and frozen v6–v9 byte comparisons passed.

## Findings repaired before the final Pass

The candidate remained v10 while every finding was repaired, and independent QA restarted after each changed fingerprint. Repairs included:

1. Coordinating deep-link/history/view/resize/theme focus and reading-position restoration through opaque in-memory state rather than private history payloads.
2. Making pending/retry controls focus-safe and canceling stale month, media, server, upload, artwork, and Correction callbacks.
3. Preserving the exact media object and logical focus through compact selection and full-day Retry success/failure.
4. Making Correction dirty/clean/failure copy truthful, retaining represented results across reopen, preventing Save/Cancel/Escape/Back races, and preserving draft caret through failure.
5. Clearing inherited live/toast content and guarded announcements at loading, total-failure, session, and reauthentication privacy boundaries.
6. Enforcing state priority so restored notices, connection interruption, request failures, total server failure, and unsaved confirmation never expose competing or contradictory recovery claims.
7. Keeping all fixture-console outcomes visible and keyboard-continuous, with truthful current-state labels after guided transitions.
8. Repairing compact Correction/session/server/media geometry, fixed-navigation clearance, action sizes, orientation focus visibility, and light/dark primary-action contrast.
9. Restoring deterministic media/Correction source fixtures after the inherited first-upload flow and guarding stale asynchronous file reads from crossing modal/date boundaries.
10. Repairing the exact 700 px Calendar boundary so journal titles and counts remain readable within their tiles in both themes.

No finding remains open in this v10 package.

## Current-run visual evidence

- [`01-1440x900-populated-calendar-connection-light.png`](docs/prototypes/v10/01-1440x900-populated-calendar-connection-light.png)
- [`02-1440x900-populated-calendar-connection-dark.png`](docs/prototypes/v10/02-1440x900-populated-calendar-connection-dark.png)
- [`03-1280x720-total-loading-skeleton-light.png`](docs/prototypes/v10/03-1280x720-total-loading-skeleton-light.png)
- [`04-1280x720-total-loading-skeleton-dark.png`](docs/prototypes/v10/04-1280x720-total-loading-skeleton-dark.png)
- [`05-960x900-month-error-august-settled.png`](docs/prototypes/v10/05-960x900-month-error-august-settled.png)
- [`06-700x900-settled-content-server-failure.png`](docs/prototypes/v10/06-700x900-settled-content-server-failure.png)
- [`07-390x844-session-ended-gate.png`](docs/prototypes/v10/07-390x844-session-ended-gate.png)
- [`08-390x844-reauth-boundary.png`](docs/prototypes/v10/08-390x844-reauth-boundary.png)
- [`08b-390x844-post-return-first-use-calendar.png`](docs/prototypes/v10/08b-390x844-post-return-first-use-calendar.png)
- [`09-320x568-connection-unsaved-correction.png`](docs/prototypes/v10/09-320x568-connection-unsaved-correction.png)
- [`09b-320x568-unsaved-correction-editor-top.png`](docs/prototypes/v10/09b-320x568-unsaved-correction-editor-top.png)
- [`10-320x568-unsaved-correction-leave-confirm.png`](docs/prototypes/v10/10-320x568-unsaved-correction-leave-confirm.png)
- [`11-320x568-media-failure-museum-margin.png`](docs/prototypes/v10/11-320x568-media-failure-museum-margin.png)
- [`12-568x320-correction-save-failure.png`](docs/prototypes/v10/12-568x320-correction-save-failure.png)
- [`13-700x900-media-retry-pending.png`](docs/prototypes/v10/13-700x900-media-retry-pending.png)
- [`14-700x900-media-retry-success.png`](docs/prototypes/v10/14-700x900-media-retry-success.png)
- [`15-700x900-media-retry-failure.png`](docs/prototypes/v10/15-700x900-media-retry-failure.png)

## Evidence boundary

This QA verifies fictional frontend interaction intent, deterministic browser-memory transitions, visual layout, semantics, and the exact static files above. It does not prove connectivity, server behavior, persistence, authentication, Cloudflare enforcement, idempotency beyond the prototype page, deployment, formal accessibility conformance, or production readiness.

The only permitted closure statement is: **The resilient application shell is prototype-represented with synthetic fixtures; connectivity, server behavior, authentication, persistence, and idempotency enforcement remain unverified.**
