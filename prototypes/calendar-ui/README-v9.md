# Life in Days prototype v9 — First-use Readiness

> **Throwaway UI prototype · fictional data · browser-memory mutations · no integrations connected**

V9 preserves the frozen v6 private Search, v7 Calendar, and v8 Cross-month Almanac. It adds one stable package: `PVA-004 First-use Readiness`—a calm empty Calendar and five independent, truthful readiness lanes.

Independent QA passed the exact five-file UI fingerprint recorded in [`design-qa-v9.md`](../../design-qa-v9.md), with 0 Critical, 0 High, 0 Medium, and 0 Low findings. Any byte change to those UI artifacts invalidates that disposition.

## Run

```sh
npm run check:v9
npm run prototype
```

Open [the v9 prototype](http://127.0.0.1:4173/index-v9.html?view=calendar&month=2026-08).

## V9 contract

- Reload defaults to the fictional first-use state: an empty August 2026 Calendar in fixed `Asia/Kolkata` context.
- `Your archive begins here.` remains calm, preserves the seven-column Calendar, and offers only `Upload journal` and `Review readiness`.
- Readiness shows VoiceNotes, Telegram, AI, Backup, and Recovery Ceremony separately—never an aggregate score or onboarding funnel.
- VoiceNotes and Telegram may be represented as needing server configuration or configured-but-never-verified. No identifier, callback path, secret, or live connection appears.
- AI is optional. Authentic capture and reading stay available when no provider is configured or AI is unavailable.
- Backup is `Not configured` or `Never verified`; a backup upload is never equated with restoration.
- Recovery Ceremony remains `Blocked` in every v9 fixture with three unevidenced prerequisites. V9 has no success fixture or bypass.
- Fixture changes are allowlisted, fictional, in memory only, and absent from URL, title, browser history payload, and storage.
- `archive/populated` restores the v8 fictional dataset for regression review without modifying v8 artifacts.

## Deliberate limits

V10 owns global loading, connectivity, interruption, session, error, and retry states. V24 owns first-class System Health; v25 owns qualified provider settings; v32 owns backup/restore evidence and Recovery Ceremony completion. This prototype does not configure or verify integrations, credentials, encryption, storage, authentication, deployment, recovery, accessibility conformance, or production readiness.

The permitted closure is: **First-use readiness is prototype-represented with synthetic fixtures; integrations, recovery, implementation, and operations remain unverified.**

## Review artifacts

- Council: [`../../docs/prototypes/v9/COUNCIL-v9.md`](../../docs/prototypes/v9/COUNCIL-v9.md)
- Handoff: [`../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v9.md`](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v9.md)
- QA: [`../../design-qa-v9.md`](../../design-qa-v9.md)
- Evidence: [`../../docs/prototypes/v9/`](../../docs/prototypes/v9/)
