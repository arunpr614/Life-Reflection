# Life in Days — Resilient Application Shell prototype v10

Date: 2026-08-14
Branch: `prototype/calendar-ui-v10-resilient-shell`
Baseline: frozen v9 implementation/evidence `ae34415`; freeze record `5a12fb2`
Status: independent QA passed; freeze-ready

## Stable feature

V10 implements `PVA-005 Resilient Application Shell`. It represents only the interruption/failure portion of audit gap 3 through one coordinated fictional frontend state machine.

## Behavior represented

| Area | V10 behavior |
| --- | --- |
| Default | Frozen v9 first-use Calendar remains the reload/default ready state. |
| Loading | Archive loading uses neutral geometry-preserving skeletons with no stale personal content. |
| Month request | Pending target is separate from the verified month; failure restores the verified month; explicit Retry alone can commit the target. |
| Media | One real-photo failure keeps its Journal Day and authentic journals readable; Retry operates on the same item. |
| Connection | A persistent non-dismissible strip marks readable content as potentially stale and blocks save claims until explicit restoration. |
| Correction | A bounded synthetic draft exercises interruption, Retry, unsaved navigation confirmation, native reload warning, and single-result behavior. |
| Session | Expiry removes private archive DOM; synthetic reauthentication returns only to a generic Calendar and proves no account, MFA, assertion, or session. |
| Server | Empty-load and settled-request failure states provide one guarded recovery action and sanitized details only. |
| Idempotency | In-memory operation identities suppress rapid repeat actions and stale delayed completions. |
| Privacy | Fixture, failure, retry, draft, and auth state stay out of URL, title, history payload, storage, requests, and logs. |

## State priority

1. Session ended / reauthentication boundary.
2. Initial loading / total server failure.
3. Unsaved-Correction leave confirmation.
4. Connection interruption.
5. View request state.
6. Item media state.
7. Ready UI.

## Deliberate limits

This prototype does not establish a real Correction lifecycle, durable upload, provider failure policy, System Health, backup/restore evidence, Cloudflare enforcement, offline support, persistence, connectivity, server behavior, deployment, security control, accessibility conformance, or production readiness. Frozen v6–v9 artifacts are unchanged.

## Files

- [`../../prototypes/calendar-ui/index-v10.html`](../../prototypes/calendar-ui/index-v10.html)
- [`../../prototypes/calendar-ui/app-v10.js`](../../prototypes/calendar-ui/app-v10.js)
- [`../../prototypes/calendar-ui/styles-v10.css`](../../prototypes/calendar-ui/styles-v10.css)
- [`../../prototypes/calendar-ui/styles-v10-almanac.css`](../../prototypes/calendar-ui/styles-v10-almanac.css)
- [`../../prototypes/calendar-ui/styles-v10-readiness.css`](../../prototypes/calendar-ui/styles-v10-readiness.css)
- [`../../prototypes/calendar-ui/styles-v10-resilience.css`](../../prototypes/calendar-ui/styles-v10-resilience.css)
- [`../../prototypes/calendar-ui/README-v10.md`](../../prototypes/calendar-ui/README-v10.md)
- [`v10/COUNCIL-v10.md`](v10/COUNCIL-v10.md)
- [`../../design-qa-v10.md`](../../design-qa-v10.md) — Pass; 0 Critical, 0 High, 0 Medium, 0 Low findings
- [`v10/`](v10/) — current-run evidence

## Evidence boundary

The implementation is a static frontend prototype with fictional fixtures and browser-memory mutations. The permitted closure is: **The resilient application shell is prototype-represented with synthetic fixtures; connectivity, server behavior, authentication, persistence, and idempotency enforcement remain unverified.**
