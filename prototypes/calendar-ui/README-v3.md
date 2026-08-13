# Life in Days unified calendar prototype v3

> **Throwaway UI prototype · simulated data · no persistence · no integrations connected**

v3 is one product experience rather than three competing directions. It combines the image-led **Living Mosaic** with the book-like **Monthly Almanac** and removes Archive Desk, Timeline, and the prototype-direction switcher.

The default landing is **Calendar**, which is the Living Mosaic month. **Almanac** is the continuous monthly reading experience. The shared header switcher preserves the selected month and Journal Date between the two views.

## Run the prototype

From this directory:

```sh
npm run check:v3
npm run prototype
```

Open [the v3 prototype](http://127.0.0.1:4173/index-v3.html).

The default URL opens Calendar. Useful review routes are:

- `index-v3.html` — Living Mosaic landing;
- `index-v3.html?view=almanac&month=2026-08&date=2026-08-13` — Monthly Almanac;
- `index-v3.html?view=almanac&month=2026-08&date=2026-08-13&rail=collapsed` — immersive Almanac;
- `index-v3.html?view=search&month=2026-08&date=2026-08-13&q=rain` — archive search;
- `index-v3.html?view=calendar&month=2026-08&date=2026-08-13&screen=day` — full Journal Day.

`view`, `month`, `date`, `screen`, `rail`, and `q` are kept in the URL so browser Back/Forward, reloads, and review links retain useful context. The Almanac rail preference is also retained in local storage.

## Screens and working interactions

| Area | What is implemented for review |
| --- | --- |
| Shared shell | Calendar/Almanac switcher, Search, theme control, Add journal, responsive primary navigation, active-state and focus treatment. |
| Living Mosaic | Default image-led month, month navigation, Today, quiet empty dates, real-photo and AI-artwork labels, journal-only and failed-image states, selected day, keyboard grid navigation. |
| Journal Day | Gallery navigation, real-photo cover selection and reordering, source journals, generated reflection, artwork states, privacy boundary, adjacent populated days, management actions. |
| Monthly Almanac | Continuous monthly chapters, authentic journals, real photos, separately labeled artwork, selected-date handoff, month index, Today, empty-month state, expandable sources. |
| Almanac navigation | Expanded 331 px desktop rail, zero-width collapsed rail for immersive reading, persistent Show month control, responsive modal month drawer, focus trap, Escape/backdrop close, focus restoration. |
| Search | Archive-wide local search over title, summary, topics, and complete fictional journal text; suggestions, recent days, results, no-results, clear, and return to the originating Calendar day or Almanac chapter. |
| Reflection management | One quiet Manage reflection action opens a sheet for Title, Summary, and Tags; edit/protect, review a generated suggestion, keep/use/edit choices, resume updates, and regeneration placeholders. |
| Manual journal capture | Add journal from desktop and mobile; date selection, `.txt`/`.md` constraints, simulated file review, duplicate warning, and browser-memory confirmation. |
| Artwork | Manual Generate artwork action, sparse-journal warning, simulated progress/failure/success, retry, and rule that a real Daily Photo remains the Calendar Cover. |

Controls whose deeper workflows are outside this UI prototype display a clear prototype toast rather than silently failing. This includes export, deletion, full provenance history, source correction, and provider generation details.

## Responsive behavior

- Above 960 px, Almanac uses the collapsible left month navigator.
- At 960 px and below, that navigator becomes a modal drawer and the reading column uses the full width.
- At 700 px and below, the desktop view controls move into a persistent bottom navigation with Calendar, Almanac, Search, and Add journal.
- On narrow Almanac screens, the date, title, and summary come before generated provenance/status so reflection stays memory-first.
- Dialogs and sheets become full-width where needed without changing their semantic labels or dismissal behavior.

## Accessibility included in the prototype

- skip link and semantic landmarks;
- visible keyboard focus;
- Calendar grid with one Tab stop, arrow-key movement, Home/End by visual week, and Page Up/Page Down month movement;
- labeled dialogs with `aria-modal`, background `inert`, contained Tab sequence, Escape close, and focus restoration;
- useful active-page and selected-date states;
- short search-result accessible names with summaries provided as descriptions;
- decorative search thumbnails excluded from accessible names;
- real photos and AI artwork labeled separately;
- reduced-motion support;
- light-theme metadata colors adjusted for normal-text contrast.

This is not a screen-reader, forced-colors, or production accessibility certification.

## Privacy and prototype boundary

All content is fictional fixture data. Nothing connects to Telegram, VoiceNotes, an AI provider, storage, a database, authentication, Hetzner, Cloudflare, or `life.arunp.in`. Refreshing resets simulated data changes.

The prototype preserves the product boundary in its information design: authentic source journals remain separate from generated Title, Summary, Tags, Visual Briefs, and Artwork; real photos are never represented as AI inputs; a real Daily Photo always wins Calendar Cover priority.

## v3 review artifacts

Captured screens are under `docs/prototypes/v3/`:

- `living-mosaic-landing-v3.png`
- `living-mosaic-day-v3.png`
- `living-mosaic-mobile-v3.png`
- `monthly-almanac-expanded-v3.png`
- `monthly-almanac-collapsed-v3.png`
- `monthly-almanac-mobile-v3.png`
- `monthly-almanac-mobile-drawer-v3.png`
- `search-results-v3.png`
- `manage-reflection-v3.png`
- `reflection-update-v3.png`
- `upload-journal-v3.png`
- `artwork-warning-v3.png`
- `generated-artwork-v3.png`
- `unified-calendar-almanac-v3-design-qa-comparison.png`

The executed review record is [`../../design-qa-v3.md`](../../design-qa-v3.md). The design handoff is [`../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v3.md`](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v3.md).
