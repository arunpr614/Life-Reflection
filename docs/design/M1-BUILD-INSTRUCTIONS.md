# M1 build instructions — Calendar month view and application shell

**For:** the implementation agent building M1 (issues #187 tokens, #189 calendar grid, #195 keyboard nav).
**Source of truth:** `prototypes/m1-calendar-shell/` at the commit this file ships with. This document restates what the prototype does; if the two disagree, re-render the prototype and trust that.
**You do not need to have seen the design conversation.** Everything relevant is below.

---

## 1. The approved variant, and why

M1 went through a **structural** round (three shells: Contact Sheet, Ledger, Editorial) and then two **colour** rounds (four `--brand-hue` options, four `--paper-hue` options), run as two independent decisions, not one.

**Editorial won outright.** No feature was grafted from Contact Sheet or Ledger — there is no "B with a piece of C" in this design. Editorial's shape: a persistent 238px rail on the left (brand, nav, month stats, Needs Date Review count), and a main stage on the right holding the month header + 7-column grid. Selecting a populated day opens a right-hand panel (the "Museum Margin") rather than navigating away — the calendar and the selection stay visible together.

**Indigo (`--brand-hue: 255`) on Fog (`--paper-hue: 220`) won outright** from apple green, sage, plum (colour) and cream, linen, blush (paper). Again, nothing grafted — this is a clean pick, not a composite.

Both decisions are structural/chromatic only. Type, spacing, shape, and motion tokens were never in question — they came from UX §28.2–28.4 unchanged throughout.

---

## 2. Tokens, verbatim

This is the literal content of `prototypes/_shared/tokens.css`'s decided (non-comparison) values — copy these into the real stylesheet for #187. Comments in the source file explain the reasoning behind each; skim them once, they answer questions before you ask them.

```css
:root {
  color-scheme: light;

  --brand-hue: 255; /* Indigo */
  --paper-hue: 220; /* Fog */

  --paper:          oklch(0.956 0.013 var(--paper-hue)); /* #e7f3f7 canvas */
  --paper-raised:   oklch(0.994 0.007 var(--paper-hue)); /* #f8feff cards, media frames, dialogs */
  --ink:            oklch(0.274 0.016 var(--brand-hue));  /* journal prose, dates */
  --ink-muted:      oklch(0.510 0.016 var(--brand-hue));  /* provenance, meta */
  --line:           oklch(0.860 0.020 var(--paper-hue));  /* #c3d4da tonal separation */
  --line-strong:    oklch(0.771 0.024 var(--paper-hue));  /* #a5b8bf a visible edge, not a control */
  --line-control:   oklch(0.620 0.024 var(--paper-hue));  /* #778a90 form-control borders ONLY — 3.19:1 */
  --accent:         oklch(0.50 0.18 var(--brand-hue));    /* #005fc6 primary action + selection — 5.35:1 on paper */
  --focus:          oklch(0.62 0.16 calc(var(--brand-hue) + 3)); /* #4385e5 — 3.23:1 on paper */

  --ink-on-accent:  oklch(0.994 0.007 var(--paper-hue));
  --ink-on-media:   oklch(1 0 0);
  --scrim-media:    oklch(0.20 0.010 var(--brand-hue) / 0.55);

  --font-display: Georgia, "Iowan Old Style", Palatino, "Times New Roman", serif;
  --font-ui: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --text-month:   clamp(2.75rem, 5vw, 4.25rem); --lh-month: 1.02;
  --text-display: 2.25rem;   --lh-display: 2.75rem;   /* 36/44 */
  --text-h1:      1.75rem;   --lh-h1:      2.25rem;   /* 28/36 */
  --text-h2:      1.375rem;  --lh-h2:      1.875rem;  /* 22/30 */
  --text-body:    1rem;      --lh-body:    1.625rem;  /* 16/26 */
  --text-small:   0.875rem;  --lh-small:   1.25rem;   /* 14/20 */
  --text-meta:    0.8125rem; --lh-meta:    1.125rem;  /* 13/18 — floor, never smaller for provenance/errors */
  --tracking-label: 0.09em;
  --measure: 66ch;

  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px;
  --s6: 24px; --s8: 32px; --s12: 48px; --s16: 64px;
  --pad-compact: 16px; --gutter-wide: 32px;

  --radius-card: 12px; --radius-media: 10px; --radius-control: 8px; --radius-pill: 999px;
  --shadow-raised: 0 8px 28px oklch(0.30 0.02 var(--paper-hue) / 0.10);

  --rail-width: 238px;
  --margin-width: 300px;

  --motion-fast: 120ms; --motion-standard: 180ms; --motion-slow: 240ms;
  --ease-enter: cubic-bezier(0.2, 0, 0, 1);
  --ease-exit:  cubic-bezier(0.4, 0, 1, 1);
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --paper:        oklch(0.205 0.013 var(--brand-hue)); /* #13181d */
  --paper-raised: oklch(0.240 0.017 var(--brand-hue)); /* #1a2027 */
  --ink:          oklch(0.953 0.009 var(--brand-hue)); /* #ebf0f6 */
  --ink-muted:    oklch(0.792 0.014 var(--brand-hue)); /* #b5bcc4 */
  --line:         oklch(0.362 0.018 var(--brand-hue)); /* #373e47 */
  --line-strong:  oklch(0.479 0.019 var(--brand-hue)); /* #565e68 */
  --line-control: oklch(0.530 0.019 var(--brand-hue)); /* #656d77 — 3.41:1 on dark paper */
  --accent:       oklch(0.65 0.14 calc(var(--brand-hue) + 7));  /* #5f8de4 — 5.48:1 on dark paper */
  --focus:        oklch(0.80 0.14 calc(var(--brand-hue) + 10)); /* #91bbff — 9.19:1 on dark paper */
  --ink-on-accent: oklch(0.205 0.013 var(--brand-hue));
  --scrim-media:   oklch(0.15 0.010 var(--brand-hue) / 0.62);
  --shadow-raised: 0 8px 28px oklch(0 0 0 / 0.35);
}

@media (prefers-reduced-motion: reduce) {
  :root { --motion-fast: 1ms; --motion-standard: 1ms; --motion-slow: 1ms; }
}
```

**Do not carry over into the app:** the `[data-color-theme="…"]` and `[data-paper-theme="…"]` blocks in `tokens.css` (apple/sage/plum, cream/linen/blush). Those exist only so the prototype's comparison dropdowns work. There is no theme picker in the real product — see §9.

**Why `--line-control` exists as a separate token from `--line-strong`:** `--line-strong` alone is only 1.70:1 on `--paper` (2.66:1 dark) — short of WCAG 1.4.11's 3:1 for a control's identifying border. Two fixes were possible: darken `--line-strong` everywhere (rejected — a grid of hard rules around 31 tiles is the "broadsheet" aesthetic the project bans), or stop asking a resting tile border to carry the affordance and let content + interactive state (`--accent`/`--focus`, 7.09:1/4.82:1) do that job instead, reserving the 3:1 requirement for actual form controls. The second is what shipped. Do not "fix" `--line-strong`'s contrast against `--paper` thinking it's a bug — it's deliberate, and raising it reintroduces the banned look.

---

## 3. Screens, DOM, and copy

Two screens ship in M1: **the application shell** (rail + stage, present on every page) and **Calendar month view** (the stage's content when no day is selected). A third region, the **Museum Margin**, appears inside the stage when a populated day is selected — it is not a separate route.

### 3.1 Shell

```html
<a class="skip-link" href="#lid-main">Skip to calendar</a>
<div class="shell">
  <aside class="rail" aria-label="Application">
    <div class="rail__brand">Life in Days</div>
    <nav class="rail__nav" aria-label="Primary">
      <a class="rail__item rail__item--active" href="#" aria-current="page">Calendar</a>
    </nav>
    <dl class="rail__stats">
      <dt>This month</dt>
      <dd>{journaled} journaled days · {photos} photos</dd>
    </dl>
    <!-- only rendered when the queue is non-empty — see UX-IA-03 -->
    <a class="rail__item rail__item--muted" href="#">Needs Date Review <span class="rail__count">{n}</span></a>
  </aside>
  <div class="stage"> <!-- stage--selected when a day is open -->
    <main class="main" id="lid-main">…month header + grid…</main>
    <aside class="margin">…only when a populated day is selected…</aside>
  </div>
</div>
```

**What's in the rail at M1, and how it grows:** at M1 the rail holds exactly one live nav item ("Calendar", `aria-current="page"`), a stats block, and a conditional Needs Date Review link. Every other rail slot the product will eventually need — Search, Almanac, Settings, History, Trash, Export, System Health — does not exist until M7+. **This design does not reserve empty slots for them.** The rail is meant to grow one real item at a time as each surface ships, not to ship with dead placeholder links now. If the owner wants a different answer (e.g. visually reserving the space), that's a decision for them, not one this prototype made — flag it back rather than inventing placeholder nav items.

**Rail copy is exact:** "Life in Days" (brand), "Calendar" (nav item), "This month" (stats label), "Needs Date Review" (exact string per `reference/CONTEXT.md` — never "undated" or "today's journal").

### 3.2 Calendar month view

```html
<div class="month-header">
  <button aria-label="Previous month">←</button>
  <span class="t-month">{Month Year}</span>
  <button aria-label="Next month">→</button>
  <button class="month-header__today">Today</button>
</div>
<div class="grid-fragment" aria-label="{Month Year}, calendar">
  <div class="weekday">MON</div> … <div class="weekday">SUN</div> <!-- Monday-first, UX §6.5 -->
  <!-- 7-column grid, blank cells for lead/trail padding to a full week -->
  <button class="tile tile--day tile--editorial" data-date="2026-08-01" aria-label="1 August 2026, 1 photo, 1 journal, Two buckets, one leak">
    <span class="tile__date">1</span>
    <span class="tile__coverbox" style="…cover image…"></span>
    <span class="tile__title">Two buckets, one leak</span>
  </button>
</div>
```

**Day tile anatomy**, in DOM order: date numeral (top), Calendar Cover (fills the remaining space — `flex: 1`, `aspect-ratio: 4/5` on the whole tile), title beneath the cover, 2-line clamp. A day with no photo gets an empty dashed-border cover box (`.tile__coverbox--empty`) rather than collapsing the layout — every tile in a row stays the same height regardless of content. A day with **no Journal Day at all** renders as a quiet, borderless button with only the date numeral (`.tile--quiet`) — per `UX-IA-04`, a Journal Day with no live Source Items must not appear as if it had content, and per the same rule must not appear on the calendar at all if it has no live Source Items whatsoever (the prototype's fixtures always give an empty cell *some* representation because "no Journal Day" and "not rendered" look identical from a design standpoint — implement this as: render the cell, do not render a false Calendar Cover).

**Accessible name construction** (see `app.js`'s `accessibleName()`): `"{date}, {N} photo(s), {N} journal(s), {title}"` for a populated day; `"{date}, no Journal Day"` (or `"…, no Journal Day yet"` for future dates) for an empty one. The title is included even though it's also visible text, because WCAG 2.5.3 (Label in Name) requires the accessible name to contain any visible label text on the control — a name built only from the count summary would fail that if a screen-reader/voice-control user tries to activate the tile by its visible title.

### 3.3 The Museum Margin (day selection panel)

```html
<aside class="margin">
  <p class="margin__label">Selected Journal Day</p>
  <p class="margin__date">1<br>August 2026</p>
  <dl>
    <dt>Calendar Cover</dt><dd>{N} Daily Photo(s) / "No cover image · journal only"</dd>
    <dt>Source Items</dt><dd>{N} Uploaded journal(s), {N} Daily Photo(s)</dd>
  </dl>
  <div class="margin__preview">
    <h3>{title or "Untitled Journal Day"}</h3>
    <p>{journal text, truncated to 220 chars + "…"}</p>
    <p class="margin__note">Full Journal Day detail is designed in M2. This preview uses the Calendar's own selection treatment.</p>
  </div>
  <button class="margin__close">Close</button>
</aside>
```

This panel is genuinely part of M1 — it is the calendar's own answer to "what happens when I click a day," not a stand-in for M2's Journal Day page. Clicking a tile does not navigate away; it opens this panel beside the grid, and `history.replaceState` puts `?day=YYYY-MM-DD` in the URL so it's linkable and survives reload. The **explicit note inside the panel** ("Full Journal Day detail is designed in M2…") is prototype-only signage to prevent this being mistaken for the finished detail page — do not carry that sentence into the real app; it exists purely to stop a reviewer confusing M1's preview with M2's actual scope.

---

## 4. States, and what triggers each

| State | Trigger | What renders |
|---|---|---|
| Populated month | default | Mixed grid: covered days, journal-only days (empty cover box), empty days (quiet tiles) |
| Single populated day | month has exactly one entry | Same grid logic; naturally falls out of the data, not a special case |
| Completely empty month | month has zero entries | Grid renders all-quiet tiles + `"No journaled days in this month."` note below the grid |
| First use | archive has zero Journal Days anywhere | Grid is replaced entirely by a full-bleed message: **"Your archive begins here."** / "Nothing has been journaled yet. Upload your first Journal Day to start the archive." / **Upload journal** button |
| Loading | month fetch in flight | Header shows the target month label in muted ink; grid cells render as `.tile--skeleton` (flat tone, no animation — this project defaults motion to none) |
| Failed to load | month fetch failed | `role="alert"` banner above the grid: **"Couldn't load {Month Year}. Settled content below may be stale."** + **Retry** button. The grid below stays visible but dimmed (`opacity: 0.5`) and non-interactive (`pointer-events: none`) — stale data is shown, not hidden, and marked as stale rather than presented as current |
| Today marked | `date === today` | `.tile--today`: `inset 0 0 0 2px var(--accent)` ring, in addition to any selected/focus styling |
| Future dates | `date > today` in current month | `.tile--quiet.tile--future`, muted ink, same "no Journal Day yet" accessible-name suffix |
| Focused tile | keyboard focus | Browser default focus-visible ring via `:focus-visible` — 2px solid `--focus`, 2px offset, `--radius-control` |
| Selected tile | a populated day is open | The Museum Margin renders; the selected tile has no separate visual state beyond what focus/today already give it — selection is communicated by the margin's presence, not a special tile treatment |
| Dark theme | `[data-theme="dark"]` on `<html>` | Every state above, re-themed. Verified this session: first-use and error states re-render correctly in dark (screenshotted), covers keep their synthetic-gradient contrast, error banner remains legible |

---

## 5. Keyboard contract

Verified against `app.js`'s `wireEvents()`, and re-confirmed by driving the live prototype this session (not just read from source):

| Key | Effect | Scope |
|---|---|---|
| `←` `→` `↑` `↓` | Move focus one/seven cells in that direction, skipping blank lead/trail cells, stopping at the grid edge (no wrap) | Any day tile focused |
| `Home` / `End` | Move to the first/last non-blank cell in the focused tile's row | Any day tile focused |
| `Page Up` / `Page Down` | Change month, then restore focus to the same day-of-month (clamped to the new month's length) in the new grid | Any day tile focused |
| `Enter` / `Space` | On a populated tile: browser-native button activation opens the day (no special handling needed — it's a real `<button>`). On a quiet (empty) tile: explicitly prevented, does nothing | Any day tile focused |
| `Tab` | Normal document order: skip link → rail nav → month nav (← / month label is not focusable / → / Today) → grid (as one tab stop, arrow-key roving from there) → margin (Close button) when open | Whole page |

**Roving tabindex, not a separate tabindex per tile:** the grid is a set of real `<button>` elements; arrow keys move DOM focus directly rather than managing a `tabindex="-1"`/`"0"` split, because every tile is natively focusable and reachable by Tab already — the extra roving-tabindex pattern (needed when items *aren't* natively focusable) doesn't apply here and would be unnecessary complexity.

**Not yet done:** a human tab-through with a person watching the focus ring render has not happened for this specific prototype — the pass above was CDP-driven (`Input.dispatchKeyEvent`) plus this session's own manual click/evaluate-script checks. Both are real evidence that the logic works; neither replaces a human confirming the ring is visually obvious at every stop. Flag this to the owner before calling M1 fully closed.

---

## 6. Responsive behaviour

Verified this session at 1440px (default) and via the prototype's own breakpoints (768px, 480px) in source; re-confirmed zero horizontal overflow programmatically.

| Width | What changes |
|---|---|
| **≥769px** | Rail is a persistent left column (`grid-template-columns: var(--rail-width) 1fr`), full height. Margin sits beside the grid (`stage--selected` → two columns) above 900px. |
| **769–900px** | Same as above, but the margin drops below the grid (single column) — there isn't room for three columns (rail + grid + margin). |
| **≤768px** | Rail collapses to a horizontal bar (`display: flex`) across the top; stats block hides (`.rail__stats { display: none }`) to keep the bar shallow; nav + Needs Date Review stay visible. |
| **≤480px** | Stage padding drops to `--pad-compact` (16px). The floating prototype-controls bar (top-right, review-only furniture) can wrap to multiple lines, and the rail reserves space for it via `--controls-height` (see below) instead of the app's own chrome — **the real app has no such bar**, so this specific reservation is prototype-only; a real implementation only needs to worry about its own fixed headers, if any. |

**The `--controls-height` mechanism, and why it's there:** the prototype's review-chrome bar (state/colour/paper selectors, top-right) sits `position: fixed`, and at narrow widths it can wrap to 2–3 lines, changing height. A hardcoded `padding-top` guess for the rail went stale three separate times this session as the bar's content changed (64px → 100px → 117px, still wrong). The fix that held: `app.js` measures the bar's real `offsetHeight` on load and on resize, and writes it into `--controls-height`, which the CSS reservation reads (`calc(var(--controls-height, 64px) + 12px)`). **This mechanism itself is prototype-only** — it exists to keep review furniture from covering the rail. If the real app ever has its own fixed header whose height varies with content (e.g. a wrapping nav bar on narrow screens), reuse the *pattern* — measure at runtime, don't guess a pixel number — but there is nothing here to port literally.

**Flex-shrink trap already fixed, worth knowing about:** `.month-header .t-month` uses `flex: 1`, which does not by itself allow shrinking past the text's own min-content width — at 320px this pushed the Today button off-screen until `min-width: 0` was added. If you rebuild this header from scratch rather than copying the CSS, keep that `min-width: 0`.

---

## 7. Accessibility requirements

- **Landmarks:** `<aside aria-label="Application">` for the rail, `<nav aria-label="Primary">` inside it, `<main id="lid-main">` for the calendar, a skip link (`"Skip to calendar"`) as the very first focusable element.
- **Heading structure:** the month label (`.t-month`) and the first-use title are visually the largest text on the page but are *not* marked up as `<h1>` in the prototype — if the real page needs a semantic heading for that content, add one; don't assume the prototype's DOM order is a complete accessibility spec, only a layout one.
- **Live region:** a `role="status"` node (`#lid-announce`, visually hidden) exists for out-of-scope-action feedback (e.g. clicking "Upload journal" or "Needs Date Review" in M1, both of which are stubs — see §9). Reuse this pattern for any real async feedback the implementation needs.
- **Focus-visible:** `outline: 2px solid var(--focus); outline-offset: 2px; border-radius: var(--radius-control)` on every interactive element via a single `:where(...)` rule in `base.css` — do not re-implement per component.
- **`prefers-reduced-motion`:** honored globally by collapsing all three motion durations to `1ms`. M1 has almost no motion to begin with (the skip-link's `top` transition is the only one) — this matters more from M3 onward but the token-level guard is already in place.
- **Measured contrast** (OKLCH → sRGB, verified against rendered hex in `tokens-specimen.html`, not calculated by hand):

  | Pair | Light | Dark |
  |---|---|---|
  | `--accent` on `--paper` | 5.35:1 | 5.48:1 |
  | `--focus` on `--paper` | 3.23:1 | 9.19:1 |
  | `--line-control` on `--paper`/`--paper-raised` | 3.19:1 / 3.54:1 | 3.41:1 / — |

  All meet or exceed WCAG requirements for their role (4.5:1 text, 3:1 non-text/control-identifying). `--line-strong`'s contrast against `--paper` is *below* 3:1 by design — see §2's note — because it is not the thing identifying an interactive control.
- **Lighthouse accessibility/best-practices:** reported 100/100 on this prototype's default state in the prior session; not re-run this session, but the token values and DOM haven't changed since.

---

## 8. Server-rendered translation

The real app is server-rendered HTML from tagged-template functions, no client framework. Map the prototype's interactions accordingly:

**Real page loads / form posts in the implementation:**
- Month navigation (← / → / Today / Page Up/Down) — each is a real navigation to `?month=YYYY-MM`, not a client-side re-render.
- Opening a day (Enter or click on a populated tile) — a real navigation. In the prototype this opens an in-page panel because M2's actual detail page doesn't exist yet; in the implementation, once M2 ships, this should be a real link to the Journal Day page. Treat the prototype's Museum Margin as this milestone's *design intent* for what that navigation reveals, not as evidence that it should stay an in-page panel — that choice belongs to whoever designs M2's page-vs-panel question, not to this document.
- Arrow-key and Home/End focus movement between tiles — this is just DOM focus, not a navigation, and needs no server round-trip in either version.

**Genuine progressive enhancement — no equivalent in the real app at all:**
- The **"Demo state" selector** (Normal / Single day / First use / Loading / Failed to load) — this is prototype review furniture. There is no "state picker" feature. Do not build a settings toggle that lets a user force the calendar into an error or loading state.
- The **Colour theme** and **Paper theme** dropdowns — likewise pure prototype furniture, left over from the exploration that produced the decided Indigo/Fog tokens. **There is no theme-switching feature in the product.** The tokens are fixed at the values in §2; nothing in the real UI exposes a way to change them. If a future milestone wants a real dark/light toggle, that is a separate, explicitly-designed feature — this prototype's dropdown is not a placeholder for it.
- The **dark/light theme toggle button** is a partial exception: `prefers-reduced-motion`-style OS-level dark mode support is a reasonable real feature (UX §28 specifies both themes), but the *manual toggle button* as drawn here is prototype furniture for reviewing both themes side by side. Whether the real app gets an explicit toggle or follows OS `prefers-color-scheme` only is an open product question (see the original design brief's open-question list) — not decided by this prototype.

---

## 9. What the prototype fakes

- **All data** comes from `prototypes/_shared/fixtures.js` — a fictional August 2026 archive plus a Needs Date Review queue and Trash entries not otherwise surfaced in M1. No real journal or photo content anywhere.
- **Calendar Covers are synthetic CSS gradients** (`coverStyle()` in `app.js`), not real photos — a two-stop diagonal gradient seeded from a fake hue/tone pair per fixture entry. This tells you nothing about how a real photograph will crop or read in the tile; treat the cover-box sizing/positioning as real, the imagery itself as a stand-in.
- **"Upload journal" and "Needs Date Review"** are stubs — clicking either just announces `"Designed in M4 — Upload a journal from the browser."` via the live region. No upload flow exists in M1.
- **The colour/paper dropdowns and demo-state selector** are, again, pure review tooling — see §8.
- **No persistence.** Reloading the page returns to the fixture's default state; `?day=` and `?variant=`/`?paper=` in the URL are the only state that survives a reload, via `history.replaceState`, not an actual backend.
- **No real network requests** beyond the same-origin static files — confirmed this session via a live network-request listing (8 requests, all to `127.0.0.1`, one expected `favicon.ico` 404).

---

## 10. What's deliberately absent, and which milestone owns it

| Missing from M1 | Owned by |
|---|---|
| Journal Day detail (full page: source items, tags, actions) | M2 |
| Real photos, galleries, Calendar Cover selection/override | M3 |
| Upload Journal flow, Needs Date Review resolution | M4 |
| Corrections, redate, Trash, restore, day history | M5 |
| Search, Almanac, Settings, History, Export, System Health (and their rail slots) | M7+ |
| AI-derived title/summary/tags | M10 |
| A real dark/light theme toggle as a shipped feature (vs. this prototype's review furniture) | Open — not yet assigned to a milestone; ask the owner |

---

## Screenshots

Committed under `prototypes/m1-calendar-shell/screenshots/` (12 files: `{apple,sage,indigo,plum}-{light,dark}.jpg`, `paper-{cream,linen,blush,fog}.jpg`) — all against the Editorial shell, comparing the colour/paper options that lost against the one that won. Reference these by commit-SHA permalink once this file is posted to the M1 design issue (§11.4 of the design brief has the exact recipe). This session additionally re-verified, live, in a real browser: the default Indigo/Fog state at 1440px, the First-use state at ~500px width, and the Failed-to-load state in dark theme — screenshots not separately saved, but the states, copy, and dimmed-grid behavior were confirmed to match this document.
