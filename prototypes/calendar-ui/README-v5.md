# Life in Days Settings prototype v5

> **Throwaway UI prototype · simulated data · no persistence · no integrations connected**

v5 keeps the v4 Museum Margin Calendar and Monthly Almanac intact, replaces the oversized Journal Day privacy banner with a small contextual link, and adds a source-grounded private Settings suite.

## Run the prototype

From this directory:

```sh
npm run check:v5
npm run prototype
```

Open [the v5 prototype](http://127.0.0.1:4173/index-v5.html).

Useful routes:

- `index-v5.html?view=calendar&month=2026-08` — default Living Mosaic Calendar;
- `index-v5.html?view=calendar&month=2026-08&date=2026-08-13` — selected Museum Margin;
- `index-v5.html?view=calendar&month=2026-08&date=2026-08-13&screen=day` — full Journal Day with the compact privacy link;
- `index-v5.html?view=settings&month=2026-08&section=overview` — Settings overview;
- `index-v5.html?view=settings&month=2026-08&section=journal` — fixed Journal rules;
- `index-v5.html?view=settings&month=2026-08&section=integrations` — VoiceNotes and Telegram boundaries;
- `index-v5.html?view=settings&month=2026-08&section=ai` — AI providers, privacy, credentials, and budget boundary;
- `index-v5.html?view=settings&month=2026-08&section=appearance` — theme and deployment context.

## v5 decisions

- The large sage privacy card is removed entirely.
- A quiet `Real photos never go to AI · AI & privacy` link sits beside `Daily Photos`; the detailed disclosure lives in Settings.
- Settings is a configuration summary, not an account center or operational dashboard.
- Journal date rules, exact VoiceNotes tag, Integration Activation, Telegram restrictions, AI budget, and scheduled processing are factual and read-only.
- Text and Artwork providers remain independent. Both selects truthfully read `Model evaluation not completed` until a real bake-off qualifies options.
- Credentials are represented only by state and are never entered, revealed, or edited in browser UI.
- Appearance supports `Use device setting`, `Light`, and `Dark`; the choice applies immediately.
- Hosted providers may retain eligible requests for abuse monitoring; each approved option must disclose current retention terms, region, and privacy policy before selection.
- Storage, backup evidence, export, Trash, Suppressions, History, and integration health remain separate management surfaces.

## Responsive behavior

- Desktop uses a restrained Settings section rail and one reading panel.
- Tablet converts the rail to a compact horizontal section picker.
- Mobile opens an Overview first; choosing a section gives a focused screen with `Back to Settings`.
- Mobile bottom navigation remains four items: Calendar, Almanac, Search, and More.
- More contains Add journal, Settings, System Health, Export, Trash, Suppressions, and History.

## Prototype boundary

All data and media are fictional fixtures. Nothing connects to Telegram, VoiceNotes, an AI provider, authentication, persistence, storage, Hetzner, Cloudflare, backup, or `life.arunp.in`. Disabled provider controls and `Not connected in prototype` labels are intentional truthfulness boundaries; identifiers and secrets are not present.

## Review artifacts

Captured screens and the same-input visual comparison live under `docs/prototypes/v5/`. The design handoff is [`../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v5.md`](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v5.md), and the executed review is [`../../design-qa-v5.md`](../../design-qa-v5.md).
