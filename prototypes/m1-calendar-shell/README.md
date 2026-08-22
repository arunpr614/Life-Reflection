# M1 — Calendar shell + month view

Shell is **Editorial**, approved 2026-08-21 — date sits above an inset cover card with a title beneath it, rail shows a live stats block and the Needs Date Review count. That structure is now fixed; the open question is colour. The switcher cycles four candidate `--brand-hue` themes, each independently measured for contrast and checked against the banned-aesthetics list: **Apple green** (warm, vivid, the first rotation off v10's forest/teal), **Sage** (cooler, more muted — pine rather than fruit), **Indigo** (the one non-green option — calm, cool, archive-like), **Plum** (warm-cool crossover, kept well clear of vermilion/terracotta).

Run (from `prototypes/`, not from inside this folder — the page loads shared files from `_shared/` next door, and Python's http server won't follow `..` above wherever it starts):

```sh
cd prototypes && python3 -m http.server 4173 --bind 127.0.0.1
```

Open <http://127.0.0.1:4173/m1-calendar-shell/?variant=apple> (or `sage` / `indigo` / `plum`). Use the state selector (top-right) to reach Loading, First use, Single-day-populated, and Failed-to-load without navigating; every other state is reachable by clicking or by arrow-key/Enter on a day tile. Toggle dark theme (top-right) for each colour — that's where the banned near-black+acid-green risk actually lives.

**Paper theme** (top-right dropdown, or `&paper=`) is the second, independent axis — `--paper-hue`, which stayed fixed at "cream" through every colour-theme round until the owner asked what `#f4f0e7` actually was. Four options: **Cream** (current/default), **Linen** (quieter, lower-chroma, closer to true warm white), **Blush** (warm pink undertone instead of cream's yellow-green), **Fog** (the one cool option — grey-blue, archive/gallery mood). Light-theme only by design — dark theme's canvas is tied to the colour theme's `--brand-hue`, not to paper, so the dropdown does nothing in dark mode; that's intentional, not a bug.
