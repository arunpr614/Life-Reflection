# Life in Days — private Search prototype v6

> **Throwaway UI prototype · fictional data · browser-memory mutations · no integrations connected**

v6 preserves the accepted v5 Calendar, Almanac, Journal Day, Settings, and privacy patterns. Its one stable feature is `PVA-001`: Search terms stay inside the current JavaScript session and are never written to the address, history state, page title, or persistent browser storage.

## Run the prototype

From this directory:

```sh
npm run check:v6
npm run prototype
```

Open [the v6 Search landing](http://127.0.0.1:4173/index-v6.html?view=search&month=2026-08).

Useful routes:

- `index-v6.html?view=search&month=2026-08` — private Search initial state;
- `index-v6.html?view=calendar&month=2026-08` — inherited Living Mosaic Calendar;
- `index-v6.html?view=calendar&month=2026-08&date=2026-08-13` — inherited selected Museum Margin;
- `index-v6.html?view=calendar&month=2026-08&date=2026-08-13&screen=day` — inherited full Journal Day;
- `index-v6.html?view=almanac&month=2026-08` — inherited Monthly Almanac;
- `index-v6.html?view=settings&month=2026-08&section=overview` — inherited Settings overview.

## v6 Search contract

- A fresh Search screen explains its deterministic scope. It shows no recent memories, personal query suggestions, generated answer, or result list.
- Search terms live only in the running page's JavaScript memory. The input has no form-field name, which also avoids browser form-state serialization by name.
- Submitting, clearing, opening a result, and browser Back/Forward never add the term to the URL or history state.
- A reload intentionally clears the term.
- A legacy `q` parameter is ignored and removed immediately without using its value.
- The document title remains the generic `Life in Days`.
- Inputs disable autocomplete, autocapitalization, and spellcheck.
- Current v6 matching is a case-insensitive literal substring over title, summary, tags, and displayed journal text.
- Photo captions, date and tag filters, current-versus-history match context, index lifecycle states, and exact matched-field snippets are deliberately deferred to the dependency-complete lexical Search slice tracked for v21.

## Responsive and accessibility intent

- The Search heading is restrained so the form and honest scope appear above the fold on common desktop sizes.
- The input and button stack on compact screens; explanatory rows reflow to one column.
- Essential Search metadata is at least 13 px.
- The form has a visible label and `role="search"`; submitting focuses the result count and clearing returns focus to the input.
- All accepted v5 keyboard, modal, reduced-motion, theme, and responsive behavior remains present and must regress successfully.

## Prototype boundary

All journal text and media are fictional fixtures. Nothing connects to Telegram, VoiceNotes, AI providers, authentication, persistence, storage, Hetzner, Cloudflare, backup, or `life.arunp.in`. This version demonstrates frontend privacy behavior; it does not prove server logs, reverse-proxy configuration, database encryption, deployed cache headers, or production telemetry behavior.

## Review artifacts

- Council contract: [`../../docs/prototypes/v6/COUNCIL-v6.md`](../../docs/prototypes/v6/COUNCIL-v6.md)
- Version handoff: [`../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v6.md`](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v6.md)
- Independent QA record: [`../../design-qa-v6.md`](../../design-qa-v6.md)
- Captured evidence: [`../../docs/prototypes/v6/`](../../docs/prototypes/v6/)
