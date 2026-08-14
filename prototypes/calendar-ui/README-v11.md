# Life in Days prototype v11 — Needs Date Review

> **Throwaway UI prototype · fictional data · browser-memory mutations · no integrations connected**

V11 preserves the frozen v6–v10 archive and adds `PVA-006 Needs Date Review`: a conditional management queue for fictional Telegram photos and VoiceNotes journals whose Journal Date is invalid, future, missing, or untrusted.

Independent QA passed the exact seven-file UI fingerprint recorded in [`../../design-qa-v11.md`](../../design-qa-v11.md), with 0 Critical, 0 High, 0 Medium, and 0 Low findings. Any byte change to those UI artifacts invalidates that disposition. No current file should be treated as integration, durable-holding, source-timestamp, persistence, backend-idempotency, or formal accessibility-conformance evidence.

## Run

```sh
npm run check:v11
npm run prototype
```

Open [the v11 prototype](http://127.0.0.1:4173/index-v11.html?view=calendar&month=2026-08).

## V11 contract

- Reload remains the frozen v10 ready shell and first-use Calendar.
- `Needs Date Review` is secondary Management, not a fifth primary archive tab.
- The populated fixture contains four unresolved Source Items in a stable order: invalid and future Telegram dates, then missing and untrusted VoiceNotes creation times.
- Every assignment opens with a blank Journal Date. Receipt, retrieval, device, invalid, future, and prototype dates are never guessed or prefilled.
- Validation uses the fixed fictional boundary `13 August 2026 · Asia/Kolkata`; valid non-future Gregorian dates include that day.
- A valid date shows the exact destination counts, visibility, and Calendar Cover outcome without mutating the item.
- Assignment success is one guarded in-memory transition. Failure, interruption, cancellation, navigation, reload, and stale completion preserve or reset the fixture exactly as the Council contract specifies.
- Source content and Original Timestamp evidence remain unchanged; resolved items enter the existing Calendar/Almanac only after represented success.
- Fixture, item, date, operation, source, and queue state stay out of URL, title, history payload, storage, requests, and logs.

## Deliberate limits

V12 owns the Telegram companion; v13 duplicates; v17 redating; v18 History; v19–v20 Trash and suppression; v21 Search expansion; v22–v24 derived processing and health; v34 access controls; and v35 formal accessibility closeout. This version proves no durable holding record, integration, source-time truth, transaction, encryption, persistence, backend idempotency, deployment, or production readiness.

The only permitted closure after an independent pass is: **Needs Date Review is prototype-represented with deterministic synthetic Telegram and VoiceNotes fixtures; capture, encryption, durable holding records, source timestamps, backend attachment, persistence, integration behavior, and idempotency enforcement remain unverified.**

## Review artifacts

- Council: [`../../docs/prototypes/v11/COUNCIL-v11.md`](../../docs/prototypes/v11/COUNCIL-v11.md)
- Handoff: [`../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v11.md`](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v11.md)
- QA: [`../../design-qa-v11.md`](../../design-qa-v11.md)
- Evidence: [`../../docs/prototypes/v11/`](../../docs/prototypes/v11/) — sixteen current-run PNGs
