# Life in Days Museum Margin prototype v4

> **Throwaway UI prototype · simulated data · no persistence · no integrations connected**

v4 applies the approved **Museum Margin** treatment to the v3 Living Mosaic while preserving the complete v3 prototype as a comparison point. The question it answers is: can the Calendar remain a calm image archive while moving source labels and descriptive copy into an intentional detail reveal?

## Run the prototype

From this directory:

```sh
npm run check:v4
npm run prototype
```

Open [the v4 prototype](http://127.0.0.1:4173/index-v4.html).

Useful routes:

- `index-v4.html?view=calendar&month=2026-08` — default no-selection Calendar landing;
- `index-v4.html?view=calendar&month=2026-08&date=2026-08-13` — selected real-photo Museum Margin;
- `index-v4.html?view=calendar&month=2026-08&date=2026-08-11` — selected AI-artwork Museum Margin;
- `index-v4.html?view=calendar&month=2026-08&date=2026-08-13&screen=day` — deeper full Journal Day;
- `index-v4.html?view=almanac&month=2026-08&date=2026-08-13` — preserved Monthly Almanac;
- `index-v4.html?view=search&month=2026-08&q=rain` — preserved archive Search.

## v4 design choices

- The default Calendar has no selected day and reserves no blank detail column.
- A day with a real Telegram photo or AI-generated artwork shows only the cover image and day number in its Calendar tile.
- Titles, source labels, photo/journal counts, summaries, captions, status badges, and scrims do not appear over Calendar imagery.
- Journal-only and unavailable-image days keep the quiet paper treatment: date, title, and journal count.
- Selecting a populated day keeps the Calendar visible and opens the right-side Museum Margin.
- The Margin reveals exactly one source label: `Telegram photo`, `AI-generated artwork`, `Journal day`, or `Image unavailable`.
- A selected real Daily Photo remains the cover even when generated artwork also exists.
- Close details, Escape, or browser Back clears the selection, removes the `date` URL parameter, and restores Calendar focus.
- Open full Journal Day moves into the existing v3 gallery, reflection, source, and management experience.

## Responsive behavior

- Above 960 px, the selected view is a split Calendar and Museum Margin.
- At 960 px and below, the Margin becomes a right-side reading sheet over the full Calendar.
- At 700 px and below, the reading sheet uses the full viewport width and keeps the existing mobile bottom navigation.
- Image pixels remain clean in every responsive state.

## Accessibility included

- one roving Tab stop in the Calendar grid;
- arrow, Home/End, and Page Up/Page Down navigation;
- `aria-selected`, `aria-expanded`, and `aria-controls` only when details are open;
- provenance exposed in the selected region for nonvisual users;
- Escape close and focus restoration;
- visible external selection and focus outlines;
- no source meaning communicated through color alone;
- reduced-motion support.

This remains a prototype review, not an executed screen-reader or forced-colors certification.

## v4 review artifacts

Captured screens are under `docs/prototypes/v4/`:

- `living-mosaic-landing-v4.png`
- `living-mosaic-museum-margin-v4.png`
- `living-mosaic-detail-tablet-v4.png`
- `living-mosaic-detail-mobile-v4.png`
- `living-mosaic-landing-v4-design-qa-comparison.png`
- `living-mosaic-museum-margin-v4-design-qa-comparison.png`

The executed review record is [`../../design-qa-v4.md`](../../design-qa-v4.md). The design handoff is [`../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v4.md`](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v4.md).

## Prototype boundary

All data and media are fictional fixtures. Nothing connects to Telegram, VoiceNotes, an AI provider, authentication, persistence, storage, Hetzner, Cloudflare, backup, or `life.arunp.in`. The prototype demonstrates frontend information hierarchy and interactions only.
