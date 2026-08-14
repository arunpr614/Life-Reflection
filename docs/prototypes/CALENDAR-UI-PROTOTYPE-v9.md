# Life in Days — First-use Readiness prototype v9

Date: 2026-08-14
Branch: `prototype/calendar-ui-v9-first-use-readiness`
Baseline: frozen v8 implementation/evidence `47f5af9`; freeze record `fd910f5`
Status: independent QA passed; freeze-ready

## Stable feature

V9 implements `PVA-004 First-use Readiness`. It represents only the first-use portion of audit gap 3: an empty Calendar plus separate VoiceNotes, Telegram, AI, Backup, and Recovery Ceremony readiness states.

## Behavior represented

| Area | V9 behavior |
| --- | --- |
| Entry | Calendar remains the default. Reload resets to the fictional empty first-use fixture. |
| Empty archive | One calm H1, quiet seven-column August 2026 grid, Upload action, and Review readiness action. |
| VoiceNotes | Exact `life-in-days` prospective boundary; server configuration is never called connected or active. |
| Telegram | One numeric user and one private chat boundary; compression guidance; no identifier or secret displayed. |
| AI | Optional and independently unavailable; authentic capture and browsing remain useful. |
| Backup | `Not configured` or `Never verified`; no successful backup/check/restore representation. |
| Recovery Ceremony | Always `Blocked`; all three prerequisites remain `Not evidenced`; no completion fixture. |
| Privacy | Fixture state stays in live memory and never enters URL, title, browser-history payload, or storage. |
| Regression | Populated Calendar, Almanac, private Search, full Journal Day, Settings, upload, themes, and safe navigation remain inherited. |

## Deliberate limits

V10 owns the resilient application shell. V24 owns System Health. V25 owns qualified AI-provider settings. V32 owns backup, restore, and Recovery Ceremony evidence. V9 includes no live setup mutation, credential input, connection verification, backup success, recovery result, or production claim.

## Files

- [`../../prototypes/calendar-ui/index-v9.html`](../../prototypes/calendar-ui/index-v9.html)
- [`../../prototypes/calendar-ui/app-v9.js`](../../prototypes/calendar-ui/app-v9.js)
- [`../../prototypes/calendar-ui/styles-v9.css`](../../prototypes/calendar-ui/styles-v9.css)
- [`../../prototypes/calendar-ui/styles-v9-almanac.css`](../../prototypes/calendar-ui/styles-v9-almanac.css)
- [`../../prototypes/calendar-ui/styles-v9-readiness.css`](../../prototypes/calendar-ui/styles-v9-readiness.css)
- [`../../prototypes/calendar-ui/README-v9.md`](../../prototypes/calendar-ui/README-v9.md)
- [`v9/COUNCIL-v9.md`](v9/COUNCIL-v9.md)
- [`../../design-qa-v9.md`](../../design-qa-v9.md) — Pass; 0 Critical, 0 High, 0 Medium, 0 Low findings
- [`v9/`](v9/) — current-run evidence

## Evidence boundary

This is a static frontend prototype with fictional fixtures and browser-memory mutations. It does not implement or verify integrations, provider availability, backup, restoration, encryption, persistence, authentication, deployment, accessibility conformance, or production readiness. The only permitted closure after an independent pass is: **First-use readiness is prototype-represented with synthetic fixtures; integrations, recovery, implementation, and operations remain unverified.**
