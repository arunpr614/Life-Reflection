# Life in Days — Telegram Capture Companion prototype v12

Date: 2026-08-16
Branch: `prototype/calendar-ui-v12-telegram-capture-companion`
Baseline: frozen v11 implementation/evidence `0e4154f`, freeze record `4bb073f`, and final tracker record `3451605`
Status: independently passed and frozen at implementation/evidence commit `3927b55`; freeze record follows

## Stable feature

V12 implements `PVA-007 Telegram Capture Companion`. It closes only audit gap 9's capture-companion portion and the frontend-prototype portions of `LID-TG-001` through `LID-TG-005`.

## Behavior represented

| Area | V12 behavior |
| --- | --- |
| Entry | Settings retains its inherited truthful Telegram status and adds `Open capture companion`; reload returns to the inherited ready/first-use Calendar. |
| Input | Fictional local fixtures expose only Product-authorized source facts; authorization failures are identical and expose no media facts. |
| Path | Received, authorization, validation, durable-capture waiting, and one truthful terminal state render in semantic order. |
| Outcomes | Captured-valid, Needs Date Review, rejection, failure, partial progress, and explicit Retry remain distinct. |
| Archive | Every scenario restores a controlled v11-derived baseline; successful fixtures mutate only their represented in-memory destination once. |
| Handoffs | View day, bounded read-only Change Journal Date, and the exact frozen-v11 Review date target use safe structural routes and opaque history entries. |
| Privacy | Fixture, caption, media, date, operation, outcome, and focus state stay in live memory and out of URL, title, history payload, storage, requests, and logs. |

## Exact independently passed identity

The Pass applies only to these eight UI artifacts:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/index-v12.html` | `a4ad82b9d68a7ecd736ab63eeebe80c7542063c5b4bbe530351a25a82d16fe7b` |
| `prototypes/calendar-ui/app-v12.js` | `4999e1bd87256cd7d2ee90cb4f3f36cace98503c4e821f8d3f7620bf1f8b5f0d` |
| `prototypes/calendar-ui/styles-v12.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `prototypes/calendar-ui/styles-v12-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `prototypes/calendar-ui/styles-v12-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |
| `prototypes/calendar-ui/styles-v12-resilience.css` | `d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c` |
| `prototypes/calendar-ui/styles-v12-date-review.css` | `525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5` |
| `prototypes/calendar-ui/styles-v12-telegram.css` | `7a0ea5404e3292cde147649a6de561b300a987a3c2ed2638ae61d407f141ad7c` |

The separate package/check artifact is `prototypes/calendar-ui/package.json` at SHA-256 `e11e52086687cc7ac53083721d9a7321627aac56b9045dc27100da64b76666fa`.

Any UI-byte change invalidates the independent disposition and requires a fresh complete gate. A package/check-artifact change requires the relevant static check and identity record to be repeated.

## Files in the v12 slice

- [`../../prototypes/calendar-ui/index-v12.html`](../../prototypes/calendar-ui/index-v12.html)
- [`../../prototypes/calendar-ui/app-v12.js`](../../prototypes/calendar-ui/app-v12.js)
- [`../../prototypes/calendar-ui/styles-v12.css`](../../prototypes/calendar-ui/styles-v12.css)
- [`../../prototypes/calendar-ui/styles-v12-almanac.css`](../../prototypes/calendar-ui/styles-v12-almanac.css)
- [`../../prototypes/calendar-ui/styles-v12-readiness.css`](../../prototypes/calendar-ui/styles-v12-readiness.css)
- [`../../prototypes/calendar-ui/styles-v12-resilience.css`](../../prototypes/calendar-ui/styles-v12-resilience.css)
- [`../../prototypes/calendar-ui/styles-v12-date-review.css`](../../prototypes/calendar-ui/styles-v12-date-review.css)
- [`../../prototypes/calendar-ui/styles-v12-telegram.css`](../../prototypes/calendar-ui/styles-v12-telegram.css)
- [`../../prototypes/calendar-ui/package.json`](../../prototypes/calendar-ui/package.json) — package/check artifact, separate from the eight UI artifacts
- [`../../prototypes/calendar-ui/README-v12.md`](../../prototypes/calendar-ui/README-v12.md)
- [`v12/COUNCIL-v12.md`](v12/COUNCIL-v12.md)
- [`v12/TELEGRAM-FIXTURES-v12.md`](v12/TELEGRAM-FIXTURES-v12.md)
- [`../../design-qa-v12.md`](../../design-qa-v12.md) — exact-hash Pass; Critical 0, High 0, Medium 0, Low 0
- [`v12/`](v12/) — 22 current-run PNGs

## Independent QA and evidence

The fresh independent gate passed only the exact identity above. It covered the complete Council §19 matrix: entry/guide/T1–T7; authorization/media/caption cases; ordinary and durable interruption/retry/race branches; private handoffs/history/focus; privacy surfaces; responsive, theme, contrast, motion, forced-colour, and reflow observations; and full frozen v6–v11 regression.

The 22 current-run evidence files have the exact Council roster and dimensions, are 8-bit RGB non-interlaced PNGs, have 22 unique SHA-256 values, were inspected individually at original resolution, and match the accepted set byte-for-byte. Their complete manifest and interaction coverage are recorded in [`../../design-qa-v12.md`](../../design-qa-v12.md).

## Deliberate limits and next-version gate

The implementation is a static frontend prototype with fictional fixtures and browser-memory mutations. It proves no provider, backend, authentication, persistence, deployment, operations, or formal accessibility behavior. The authorized bundled extension-free Chrome direct-CDP fallback was used for the final independent browser gate because the isolated in-app browser was unavailable.

V13 remains `Queued`. Passing and freezing v12 does not authorize v13 work; Arun's explicit confirmation is required before any v13 preparation or implementation begins.

The sole permitted closure is: **Telegram Capture Companion is prototype-represented with deterministic synthetic bot and web fixtures; Telegram connectivity, webhook authorization, media retrieval and validation, exact-byte preservation, metadata removal, encryption, durable backend capture, authenticated handoff, persistence, integration behavior, and idempotency enforcement remain unverified.**
