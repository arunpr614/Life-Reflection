# Life in Days — Needs Date Review prototype v11

Date: 2026-08-15
Branch: `prototype/calendar-ui-v11-needs-date-review`
Baseline: frozen v10 implementation/evidence `ffabe0d`; freeze record `497c98d`; final tracker record `d3ef43a`
Status: independent QA passed; freeze-ready

## Stable feature

V11 implements `PVA-006 Needs Date Review`. It represents only audit gap 1 and the frontend-prototype portions of `LID-TG-006` and `LID-VN-004`.

## Behavior represented

| Area | V11 behavior |
| --- | --- |
| Entry | A conditional positive-count shortcut appears in the wide topbar or compact More menu; Management retains an entry when empty. |
| Queue | Four fictional unresolved Source Items remain outside Calendar and Almanac, with explicit invalid, future, missing, or untrusted reasons. |
| Date | Every assignment starts blank and accepts only a real Gregorian date on or before the fixed 13 August 2026 Asia/Kolkata boundary. |
| Provenance | Original Timestamp evidence, raw Telegram input, VoiceNotes source state, and operational receipt/retrieval times remain distinct. |
| Preview | Valid input shows before/after source counts, day visibility, and real-photo Calendar Cover precedence without mutating the archive. |
| Assignment | A guarded in-memory operation represents exactly one attach/remove/count transition or one non-destructive failure. |
| Navigation | Same-URL detail state and focus live only behind opaque history entry IDs; Cancel, Escape, Back, View day, and reload remain safe. |
| Privacy | Fixture, count, item, reason, source, chosen date, operation, and result state stay out of URL, title, history payload, storage, requests, and logs. |

## State priority

1. Frozen v10 session ended / reauthentication.
2. Frozen v10 initial loading / total server failure.
3. Frozen v10 unsaved-Correction leave confirmation.
4. Frozen v10 connection interruption.
5. Needs Date Review load or assignment state.
6. Frozen month/request state.
7. Frozen item-media state.
8. Ready UI.

## Deliberate limits

This prototype does not establish source timestamps, durable holding, Telegram or VoiceNotes behavior, encryption, persistence, backend transactions, production idempotency, deployment, formal accessibility conformance, or production readiness. V12–v35 retain the later interaction, lifecycle, operations, security, and conformance packages recorded by Council. Frozen v6–v10 artifacts remain unchanged.

## Files

- [`../../prototypes/calendar-ui/index-v11.html`](../../prototypes/calendar-ui/index-v11.html)
- [`../../prototypes/calendar-ui/app-v11.js`](../../prototypes/calendar-ui/app-v11.js)
- [`../../prototypes/calendar-ui/styles-v11.css`](../../prototypes/calendar-ui/styles-v11.css)
- [`../../prototypes/calendar-ui/styles-v11-almanac.css`](../../prototypes/calendar-ui/styles-v11-almanac.css)
- [`../../prototypes/calendar-ui/styles-v11-readiness.css`](../../prototypes/calendar-ui/styles-v11-readiness.css)
- [`../../prototypes/calendar-ui/styles-v11-resilience.css`](../../prototypes/calendar-ui/styles-v11-resilience.css)
- [`../../prototypes/calendar-ui/styles-v11-date-review.css`](../../prototypes/calendar-ui/styles-v11-date-review.css)
- [`../../prototypes/calendar-ui/README-v11.md`](../../prototypes/calendar-ui/README-v11.md)
- [`v11/COUNCIL-v11.md`](v11/COUNCIL-v11.md)
- [`../../design-qa-v11.md`](../../design-qa-v11.md) — exact seven-file Pass; Critical 0, High 0, Medium 0, Low 0
- [`v11/`](v11/) — sixteen current-run PNGs

## Independent QA identity

The fresh independent gate passed only the seven SHA-256 values recorded in [`../../design-qa-v11.md`](../../design-qa-v11.md). It covered the complete queue/date/preview/assignment/history/privacy matrix, required responsive and theme states, and frozen v6-v10 regressions. Any UI-byte change invalidates that disposition and requires a new complete gate.

## Evidence boundary

The implementation is a static frontend prototype with fictional fixtures and browser-memory mutations. After a fresh independent Pass, the only permitted closure is: **Needs Date Review is prototype-represented with deterministic synthetic Telegram and VoiceNotes fixtures; capture, encryption, durable holding records, source timestamps, backend attachment, persistence, integration behavior, and idempotency enforcement remain unverified.**
