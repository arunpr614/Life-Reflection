# Life in Days prototype v12 — Telegram Capture Companion

> **Independently passed throwaway UI prototype · fictional data · browser-memory mutations · no Telegram connection**

V12 preserves the frozen v6–v11 archive and adds `PVA-007 Telegram Capture Companion`: deterministic synthetic authorization, media validation, caption parsing, durable-progress boundaries, terminal outcomes, and private handoffs.

Independent QA passed the exact eight-file UI fingerprint and separate package/check artifact recorded in [`../../design-qa-v12.md`](../../design-qa-v12.md), with 0 Critical, 0 High, 0 Medium, and 0 Low findings. Any UI-byte change invalidates that disposition and requires a fresh complete gate.

## Run

```sh
npm run check:v12
npm run prototype
```

Open [the v12 prototype](http://127.0.0.1:4173/index-v12.html?view=calendar&month=2026-08).

## V12 contract

- The inherited truthful Telegram status remains unchanged; entry is Settings → Integrations → Telegram → Open capture companion.
- All fixtures are fictional, deterministic, local, and reset on reload. No fixture reads Telegram activity or sends a Telegram reply.
- Authorization rejection is generic on the product surface and precedes represented media download.
- Accepted still-image types, inclusive size/dimension limits, validation precedence, anchored caption grammar, receipt-date fallback, and Needs Date Review routing are represented exactly as the fixture sheet specifies.
- T3 members progress independently in received order. Partial progress remains truthful; connection restoration never auto-resumes; explicit Retry preserves the represented identity and completes only missing work.
- Captured-valid, Needs Date Review, rejection, failure, Retry, View day, read-only Change Journal Date, and exact frozen-v11 Review date handoffs remain separate.
- Fixture, caption, media, date, operation, result, and focus state stay out of URL, title, browser-history payload, storage, requests, and logs.
- Frozen v6–v11 artifacts and evidence remain outside the v12 implementation slice and were fully regressed.

## Deliberate limits

This prototype does not establish a bot, webhook, allowlist, provider receipt, media retrieval, decoder safety, HEIC/HEIF support, exact received bytes, metadata removal, durable storage, encryption, authentication, backend idempotency, persistence, deployment, operations, production readiness, or formal accessibility conformance. V13 retains Telegram-photo duplicate handling and remains queued pending Arun's explicit confirmation after the v12 freeze.

The sole permitted closure is: **Telegram Capture Companion is prototype-represented with deterministic synthetic bot and web fixtures; Telegram connectivity, webhook authorization, media retrieval and validation, exact-byte preservation, metadata removal, encryption, durable backend capture, authenticated handoff, persistence, integration behavior, and idempotency enforcement remain unverified.**

## Review artifacts

- Council: [`../../docs/prototypes/v12/COUNCIL-v12.md`](../../docs/prototypes/v12/COUNCIL-v12.md)
- Fixture sheet: [`../../docs/prototypes/v12/TELEGRAM-FIXTURES-v12.md`](../../docs/prototypes/v12/TELEGRAM-FIXTURES-v12.md)
- Handoff: [`../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v12.md`](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v12.md)
- Independent QA: [`../../design-qa-v12.md`](../../design-qa-v12.md)
- Evidence: [`../../docs/prototypes/v12/`](../../docs/prototypes/v12/) — 22 current-run PNGs
