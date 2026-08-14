# Life in Days prototype v8 — Cross-month Almanac

> **Throwaway UI prototype · fictional data · browser-memory mutations · no integrations connected**

V8 preserves the frozen v6 private Search and v7 Calendar behaviors, then adds one stable package: `PVA-003 Cross-month Almanac`. The approved Almanac now browses live Journal Days across month boundaries without introducing a separate Timeline tab.

Independent QA: **Pass**, bound to the exact SHA-256 values recorded in [`design-qa-v8.md`](../../design-qa-v8.md).

## Run

```sh
npm run check:v8
npm run prototype
```

Open [the v8 Almanac](http://127.0.0.1:4173/index-v8.html?view=almanac&month=2026-08).

Useful routes:

- `index-v8.html?view=almanac&month=2026-08` — initial August-only Almanac;
- `index-v8.html?view=almanac&month=2026-08&through=2026-06&date=2026-06-27` — a loaded cross-month range anchored to June;
- `index-v8.html?view=almanac&month=2026-07` — known empty-month state;
- `index-v8.html?view=calendar&month=2026-08` — inherited v7 Calendar;
- `index-v8.html?view=search&month=2026-08` — inherited private Search;
- `index-v8.html?view=settings&month=2026-08&section=overview` — inherited Settings.

## V8 contract

- Almanac is a reverse-chronological reading surface with semantic month volumes and Journal Day articles.
- Initial state loads August 2026 only. Each `Load earlier days` action adds exactly one calendar month: empty July, then June, then May.
- The safe URL uses `month` as newest boundary and optional `through` as oldest boundary. It contains no title, summary, tag, caption, source text, query, focus selector, or scroll offset.
- A collapsible wide index and compact focus-trapped sheet show loaded month groups plus safe live-day links; the inherited duplicate mini-calendar is removed.
- `Jump to month and year` uses exactly twelve textual month buttons and resets the range to the chosen month.
- Each chapter shows one shared Calendar Cover, generated title/summary/tags, counts, external provenance, and `Read full Journal Day`. Raw source-journal text remains in the canonical full-day route.
- Real photos retain cover precedence. AI, source, status, and caption text never overlays image pixels.
- Hidden June 20 Trash-only and May 18 history-only fixtures are never rendered or counted.
- Loading failure is a local synthetic component state. Full connectivity, session, and recovery state coverage remains assigned to v10.

## Inherited regressions

- V7 Calendar chooser, external Today/selected/focus rings, C-01 clean-image cells, real-photo precedence, and Museum Margin.
- V6 Search terms remain in live JavaScript memory only; legacy `q` is removed, reload clears terms, and no personal suggestions appear.
- Journal Day gallery, sources, upload simulation, Settings, themes, and deferred-scope boundaries.

## Prototype boundary

All content and media are fictional fixtures. This package demonstrates frontend interaction intent only. It does not prove backend filtering, ordering, pagination, lifecycle enforcement, persistence, authentication, accessibility conformance, deployment, or production readiness.

## Review artifacts

- Council: [`../../docs/prototypes/v8/COUNCIL-v8.md`](../../docs/prototypes/v8/COUNCIL-v8.md)
- Handoff: [`../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v8.md`](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v8.md)
- QA: [`../../design-qa-v8.md`](../../design-qa-v8.md)
- Evidence: [`../../docs/prototypes/v8/`](../../docs/prototypes/v8/)
