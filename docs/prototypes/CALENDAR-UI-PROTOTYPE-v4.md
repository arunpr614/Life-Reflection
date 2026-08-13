# Life in Days — Museum Margin Calendar prototype v4

Date: 2026-08-13  
Branch: `prototype/calendar-ui-v4-museum-margin`  
Starting point: v3 commit `9689e96`  
Status: implemented and locally reviewed as a throwaway, simulated prototype

## Decision represented by v4

v4 preserves Living Mosaic as the default Calendar and Monthly Almanac as the reading lens, while changing how Calendar metadata is disclosed:

- the default Calendar opens with no selected date and uses the full content width;
- real-photo and AI-artwork days show pristine imagery with no source label, title, count, caption, status badge, or gradient over the pixels;
- journal-only days retain the quiet paper treatment represented by Saturday 8;
- selecting a populated day opens the **Museum Margin**, where provenance and descriptive context are disclosed outside the image;
- real Daily Photos continue to outrank generated artwork as Calendar Covers;
- Almanac, Search, and the full Journal Day retain explicit source labels where provenance is part of reading or management.

## Two Calendar states

| State | URL | Behavior |
| --- | --- | --- |
| No selection | `?view=calendar&month=2026-08` | Full-width month; no detail placeholder, reserved rail, or selected outline. |
| Museum Margin | `?view=calendar&month=2026-08&date=2026-08-13` | Calendar narrows; the selected day gains an external keyline; pristine media and a separate right placard appear. |

`screen=day` remains the explicit deeper route. A bare `date` parameter means the Museum Margin, not the full Journal Day.

## Tile contract

| Journal Day state | Calendar content |
| --- | --- |
| Empty date | Day number on paper. |
| Real-photo cover | Cover image and day number only. |
| AI-artwork cover | Cover image and day number only. |
| Journal only | Day number, two-line title, and journal count. |
| Image unavailable | Same paper fallback as journal only; unavailable status and Retry are revealed after selection. |

The accessible name retains date, counts, generated-cover meaning, and attention state even when visual progressive disclosure keeps the tile clean.

## Museum Margin

The desktop Margin is an editorial split, not a dashboard card:

1. selected day control and Close details;
2. large uninterrupted Calendar Cover;
3. one external source label;
4. title, full date, counts, and concise caption/summary;
5. original timestamp or generation context;
6. Open full Journal Day.

At 960 px and below it becomes a responsive reading sheet; at 700 px and below the sheet is full width. No state adds overlays to the image.

## Working interactions reviewed

- select a real-photo day and disclose `Telegram photo` in the Margin;
- select an artwork-only day and disclose `AI-generated artwork` only in the Margin;
- close the Margin and restore focus to the selected tile;
- press Escape to clear selection;
- use browser Back to reconstruct no-selection and selected states from URL history;
- open the full Journal Day and return to the selected Margin;
- retain Calendar keyboard navigation and responsive detail-sheet behavior;
- retain Almanac, Search, upload, reflection management, gallery, and artwork simulations from v3.

## Files

- [`../../prototypes/calendar-ui/index-v4.html`](../../prototypes/calendar-ui/index-v4.html)
- [`../../prototypes/calendar-ui/app-v4.js`](../../prototypes/calendar-ui/app-v4.js)
- [`../../prototypes/calendar-ui/styles-v4.css`](../../prototypes/calendar-ui/styles-v4.css)
- [`../../prototypes/calendar-ui/README-v4.md`](../../prototypes/calendar-ui/README-v4.md)
- [`../../design-qa-v4.md`](../../design-qa-v4.md)
- [`v4/`](v4/) — captured review images and comparison sheets

## Boundary

This is frontend interaction evidence only. It uses fictional data and browser memory. It does not implement or verify Telegram, VoiceNotes, AI provider calls, authentication, persistence, storage, backup, Hetzner, Cloudflare, deployment, recovery, or production privacy enforcement.
