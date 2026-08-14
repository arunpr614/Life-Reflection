# Life in Days calendar UI prototype

> **Throwaway UI prototype · simulated data · no integrations connected**

This prototype answers one design question:

> Which calendar and Journal Day hierarchy makes Life in Days feel most beautiful to revisit while keeping authentic sources and AI-generated material unmistakably separate?

It contains three structurally different directions on one route:

- `?variant=A` — **Archive Desk:** month calendar with a persistent day preview.
- `?variant=B` — **Living Mosaic:** an image-led month that opens into an immersive memory.
- `?variant=C` — **Monthly Almanac:** a calendar index beside a continuous editorial reading view.

Every direction uses the same fictional fixture data. No personal journal, real photo, provider, webhook, account, database, AI call, persistence, or deployment is connected.

## Run

From this directory:

```sh
npm run prototype
```

Then open [http://127.0.0.1:4173/?variant=A](http://127.0.0.1:4173/?variant=A).

Use the floating bottom switcher or the left and right arrow keys to compare variants. Arrow keys retain their native behavior while a form, gallery control, dialog, or calendar day has focus.

## What to evaluate

1. Which direction makes a month easiest to recognize at a glance?
2. Which direction makes opening and reading a day feel calm rather than administrative?
3. Where is the distinction between real photos, source journals, and generated material clearest?
4. Which elements should be combined into the eventual production design?

This is deliberately low-dependency, in-memory prototype code. A selected direction must be reimplemented against the production architecture; this prototype is not a production foundation.
