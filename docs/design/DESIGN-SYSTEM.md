# Design system — Life in Days

One page, per `UI-DESIGN-INSTRUCTIONS.md` §2. Proven in
`prototypes/_shared/tokens.css` + `tokens-specimen.html` — every value below
is measured there, not asserted. Palette and rail per `IMPLEMENTATION-PLAN.md`
§5.6/§8.1 (v10, 2026-08-20); UX §28.1's colours are superseded.

## Color

Six surface/ink/line values, plus the two given, plus one derived under
measurement. Each has one job.

| Token | Light | Dark | Job |
|---|---|---|---|
| `--paper` | `#f4f0e7` | `#111917` | canvas |
| `--paper-raised` | `#fffdf8` | `#17221f` | cards, media frames, dialogs |
| `--ink` | `#1f2a27` | `#edf1eb` | the work: journal prose, dates |
| `--ink-muted` | `#5e6964` | `#b4beb8` | the margin: provenance, meta |
| `--line` | `#d8d0c3` | `#34413d` | tonal separation (decorative) |
| `--line-strong` | `#bdb3a4` | `#53615c` | a visible edge, not a control |
| `--accent` | `#255949` | `#75b9a2` | primary action + selection (given) |
| `--focus` | `#0a7762` | `#9fe1ca` | focus ring (given) |
| `--line-control` | derived | derived | **form-control borders only** |

`--line-control` exists because `--line-strong` measures 1.70:1 (light) /
2.66:1 (dark) — it cannot carry the 3:1 WCAG 1.4.11 control-boundary job.
Rather than darken it into a hairline grid on 31 calendar tiles (broadsheet
pastiche, banned), tiles are identified by *content and state* — the date
numeral, the title, `--accent`/`--focus` on hover/today/selected — not by
their resting border. Real form controls still need a border that *is* the
affordance, so `--line-control` exists for exactly that and nothing else.
Full reasoning: `tokens.css` inline comment at the token definitions.

Dark is deep green-tinted ink, not near-black, and the accent is desaturated
sage, not acid green — one deliberate step away from the banned "near-black +
saturated green" cluster.

## Type

Display: **Georgia** (`Iowan Old Style`, `Palatino` fallback) — chosen for its
old-style figures, so date numerals in 31 tiles sit inside the line instead of
shouting, and because it is system-available (no third-party font request,
UX-PRIV-04). UI: system sans stack. Scale is UX §28.2 verbatim, one stated
exception:

| Role | Size/leading | Use |
|---|---|---|
| `text-month` | `clamp(2.75rem,5vw,4.25rem)` | Calendar's month title — the one thing allowed past display |
| `text-display` | 36/44 | first-use / empty-state headlines |
| `text-h1` | 28/36 | a Journal Day's title |
| `text-h2` | 22/30 | day headers, dialog titles |
| `text-body` | 16/26 | journal prose, at a 66ch measure |
| `text-small` | 14/20 | UI labels, buttons |
| `text-meta` | 13/18 | provenance, errors — the floor, never smaller |

## Layout

The shell is a persistent 238px rail + main region. Selecting a day compresses
the grid left and opens two new columns — this pattern (grid → work → margin)
repeats, with variations, through every later milestone instead of introducing
new page shapes.

```
M1 — populated month, nothing selected
┌────────┬─────────────────────────────────────────┐
│  RAIL  │  ← August 2026 →          Mon…Sun         │
│ 238px  │  [ ][▓][ ][▓●][ ][▓][ ]  (7-col day grid) │
│Calendar│  [ ][ ][▓][ ][ ][ ][ ]   ▓=cover ●=today  │
│(others │  ...                                       │
│ dim —  │                                             │
│ M7+)   │                                             │
└────────┴─────────────────────────────────────────┘

M1/M2 — a day selected: grid compresses, work + margin open
┌────────┬───────────┬────────────────┬──────────────┐
│  RAIL  │ grid ~490 │  WORK (serif)  │ MARGIN 300px │
│        │ [ ][▓][●] │  title, prose  │ Calendar     │
│        │ ...       │  at 66ch       │ Cover · Src  │
│        │           │  [Correction]  │ Items · Orig.│
│        │           │  [Upload]      │ Timestamp    │
└────────┴───────────┴────────────────┴──────────────┘

M3 — gallery adds to WORK, cover choice adds to MARGIN
  WORK: [photo][photo][photo][+9]  keyboard-reorderable
  MARGIN: Calendar Cover — chosen automatically, owner can override

M4 — two new flows, no new page shape
  Upload: [Choose file] → review card (name/size/tz/preview) → [Upload]
  Needs Date Review: rail badge appears only when non-empty
    [ item — Assign date · Trash ]  (queue list)

M5 — history and trash use the same WORK/MARGIN frame
  WORK: Revision 1 (original) → Revision 2 Correction → Revision 3 ● (append,
        never in-place) · [Make calendar cover]
  Trash (separate list surface): item · 28d left · [Restore]

M6 — no new screens; 4 boundary states over the shell above
  Access-expired → DOM gone, back to Cloudflare Access
  Server failure → explicit "broken", never mistaken for an empty month
  Interruption   → persistent, non-dismissible, honest about staleness
  Slow mobile load → the one this milestone exists for
```

## Signature element

**The Museum Margin** — the work never shares a column with what the system
says about it. Left/centre: the work, in the display serif. Right: the
margin, in the UI sans at meta size, always in the same place, always in the
same voice — provenance as a fixed address, not a tooltip.

## Self-critique

- **Archive, not app?** Serif journal prose at a real reading measure, warm
  paper canvas, no dashboard chrome, no card-grid-everywhere — reads as a
  private archive. Risk: the rail itself is a dashboard convention; it earns
  its place by staying nearly empty until M7+ (see open question in the
  handover) rather than filling with placeholder nav items.
- **Where is the boldness spent?** The Margin. Everything else — one accent,
  one serif, near-zero motion, no shadows besides one restrained raised
  elevation — stays quiet so the Margin's separation reads as intentional.
- **Which banned default did this drift toward?** Cluster 2 (near-black +
  saturated green) was the live risk given a green accent and a dark theme —
  answered with green-tinted ink and desaturated sage, not pure black/neon.
  Broadsheet (hairline rules everywhere) was the second risk, from a
  calendar's inherent grid — answered by the `--line-control` decision above:
  tiles are identified by content and state, not by hard rules.
