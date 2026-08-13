# Life in Days prototype v7 — Calendar contract completion

> **Throwaway UI prototype · fictional data · browser-memory mutations · no integrations connected**

V7 preserves the frozen v6 private Search behavior and adds one stable feature package: `PVA-002 Calendar Contract Completion`. The Living Mosaic now has a compact month/year chooser, independently distinguishable Today/selected/keyboard-focus states, cross-month keyboard navigation, and exact provenance or attention disclosure outside image pixels.

## Run the prototype

From this directory:

```sh
npm run check:v7
npm run prototype
```

Open [the v7 Calendar](http://127.0.0.1:4173/index-v7.html?view=calendar&month=2026-08).

Useful routes:

- `index-v7.html?view=calendar&month=2026-08` — Living Mosaic landing;
- `index-v7.html?view=calendar&month=2026-08&date=2026-08-13` — selected Today with authentic-photo cover and attention;
- `index-v7.html?view=calendar&month=2026-08&date=2026-08-11` — artwork-only day with provenance in the Museum Margin;
- `index-v7.html?view=calendar&month=2026-07` — ordinary empty-month fixture;
- `index-v7.html?view=search&month=2026-08` — inherited private Search;
- `index-v7.html?view=almanac&month=2026-08` — inherited Monthly Almanac;
- `index-v7.html?view=settings&month=2026-08&section=overview` — inherited Settings overview.

## V7 Calendar contract

- The month/year heading opens a modal chooser with Previous/Next year and exactly twelve `Jan`–`Dec` buttons. Year changes remain drafts; choosing a month commits immediately.
- The synthetic chooser represents safe four-digit years `0001`–`9999`; disabled edge controls are a prototype URL boundary, not a product archive limit.
- Safe Calendar navigation persists only `view`, `month`, optional `date`, and optional `screen` in the URL. Browser title stays `Life in Days`.
- Real-photo and artwork-cover cells remain image-only except for the date number. No source, AI, attention, title, caption, count, tag, watermark, or legend overlays image pixels.
- Today uses an external dotted perimeter, selection a solid external perimeter, and keyboard focus a dashed high-contrast outer ring. Their semantic states can coexist.
- Safe accessible names expose date, counts, cover type, exact attention, Today, and selection without private titles, captions, summaries, tags, journal text, or image descriptions.
- Selecting a day reveals source/provenance and any concrete attention reason in the external Museum Margin. A real photo always wins Calendar Cover precedence.
- Arrow, Home/End, and Page Up/Down navigation can cross month boundaries while keeping one roving tab stop.
- Empty dates remain quiet and create nothing. July 2026 shows a complete empty grid plus `No journaled days in this month.`
- Journal-only days retain title/count above 480 px; at narrower widths a quiet paper rule replaces text that could not remain legible, while safe metadata remains in the accessible name and Museum Margin.
- At 960 px and below, selection uses the established drawer/sheet model. At 390/320 px the seven-column Calendar and 3 × 4 chooser fit without page-level horizontal scrolling.

## Frozen v6 regression

- Search terms remain only in the running page's JavaScript memory.
- No term is written to URL, history state, title, local storage, or session storage.
- Incoming legacy `q` is ignored and removed.
- Fresh Search shows no recent memories or personal query suggestions.
- Reload clears the term; Back/Forward within the open page preserves it.

## Prototype boundary

All journal text and media are fictional fixtures. Nothing connects to Telegram, VoiceNotes, AI providers, authentication, persistence, storage, Hetzner, Cloudflare, backup, or `life.arunp.in`. This version represents frontend interaction intent; it does not prove deployed security, accessibility conformance, server behavior, or production readiness.

## Review artifacts

- Council contract: [`../../docs/prototypes/v7/COUNCIL-v7.md`](../../docs/prototypes/v7/COUNCIL-v7.md)
- Version handoff: [`../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v7.md`](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v7.md)
- Independent QA record: [`../../design-qa-v7.md`](../../design-qa-v7.md) — PASS on the recorded exact hashes
- Captured evidence: [`../../docs/prototypes/v7/`](../../docs/prototypes/v7/)
