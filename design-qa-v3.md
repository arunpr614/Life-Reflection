# Life in Days unified prototype v3 — design QA

Date: 2026-08-13
Prototype: `prototypes/calendar-ui/index-v3.html`
Branch: `prototype/calendar-ui-v3-unified`

## Review target

This review verifies the selected v3 direction: Living Mosaic as the default Calendar, Monthly Almanac as the alternate reading lens, one shared Calendar/Almanac switcher, and a collapsible Almanac month navigator.

The visual references were:

- the user's written v3 direction;
- `docs/prototypes/v2/living-mosaic-v2.png`;
- `docs/prototypes/v2/monthly-almanac-v2.png`;
- the selected Margin Companion hierarchy already established in v2.

The reference and implementation captures were combined in `docs/prototypes/v3/unified-calendar-almanac-v3-design-qa-comparison.png` and inspected together. v3 intentionally preserves the image-led Living Mosaic, the book typography and continuous chapters of Monthly Almanac, and the quiet reflection treatment. It intentionally changes the duplicated shells, Timeline destination, fixed Almanac index, and AI-first mobile order.

## Viewports and states reviewed

| Viewport | States |
| --- | --- |
| 1440 × 1024 | Calendar landing, full Journal Day, Almanac expanded, Almanac collapsed, Search results, Manage reflection, Add journal. |
| 390 × 844 | Calendar landing, Almanac reading, Almanac drawer, bottom navigation, Add journal access. |

## Visual QA

- Shared header reads as one product and exposes only Calendar, Almanac, Search, theme, and Add journal.
- Calendar remains the dominant default and retains the spacious image-led month composition.
- Almanac retains book-like typography and continuous chapters without repeating a second brand or top navigation.
- Expanded month navigation measured approximately 331 px at 1440 px.
- Collapsed Almanac grid measured `0px 1440px`; the reading column receives the full viewport width.
- Mobile Almanac orders date/title/summary before generated provenance and update status.
- Mobile month drawer fits 390 × 844 without horizontal overflow and keeps Upload journal visible.
- Search, management, and upload surfaces use the same paper, ink, border, type, and focus system.
- No Archive Desk, Timeline, A/B/C direction switcher, or prototype-choice pill appears in the live DOM.
- Small light-theme metadata and review-action colors were darkened after contrast review.

## Interaction QA

- Calendar is the default with no query parameters.
- Calendar and Almanac switch in both desktop and mobile navigation.
- Calendar full day to Almanac scrolls to the matching chapter.
- Search result opened from Almanac returns to the matching Almanac chapter.
- Search form, suggested searches, clear, recent, results, and no-results states render.
- Search accessible names contain date/title; the longer summary is a description rather than part of the name.
- Expanded/collapsed Almanac state survives navigation and URL changes.
- Month and selected date persist in URLs; July 2026 remained July after reload and Almanac rendered `Volume 07 · 2026`.
- Browser Back/Forward reconstructs the correct Calendar, Almanac, or Search state and places useful focus.
- Manage reflection opens, contains focus, closes with Escape/button, and restores focus.
- Add journal opens from desktop and mobile, closes with Escape/button, and restores focus.
- Sparse-source artwork generation shows a warning, requires Generate anyway, renders a waiting state, and completes with separately labeled simulated artwork.
- Mobile month drawer traps focus, closes with Escape/button/backdrop, and restores focus to Open month index.
- Calendar exposes one Tab stop; End from Saturday 1 August moved to Sunday 2 August; arrow navigation updates the roving Tab stop.
- `Cmd/Ctrl+K` routes to Search.
- No duplicate DOM IDs, unnamed buttons, or images without `alt` were found in the reviewed live states.
- Browser console review returned no warnings or errors.

## Automated/static checks

```text
npm run check:v3
  node --check app-v3.js
  node --check serve.mjs
  passed

git diff --check
  passed
```

All `.png` review artifacts were re-encoded and verified as PNG image data.

## Fixes made during QA

1. Corrected a scroll-restoration race when Calendar day handed off to Almanac.
2. Moved suggested-search focus assignment before render.
3. Reordered mobile reflection prose before AI status/provenance.
4. Replaced the mobile More placeholder with a working Add journal action.
5. Added durable `month` URL state and dynamic Almanac volume labels.
6. Made Search archive-wide and shortened result accessible names.
7. Added Calendar roving focus and corrected Home/End for leading month cells.
8. Darkened low-contrast light-theme metadata colors.
9. Removed rejected Archive Desk, Timeline, A/B/C, and prototype-switcher JavaScript.
10. Replaced broken full-page Almanac captures with viewport captures.

## Bounded limitations

- This is a fictional browser-memory prototype, not production implementation evidence.
- Placeholder management actions deliberately stop at an explanatory toast.
- Accessibility review covered keyboard, DOM semantics, responsive layout, color contrast, and reduced motion; it did not include a real screen reader or forced-colors session.
- No integration, persistence, authentication, provider, infrastructure, deployment, privacy control, or recovery behavior was exercised.

final result: passed
