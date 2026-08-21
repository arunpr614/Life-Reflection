# Handover — continue the M1–M6 UI/UX design work

**Written:** Friday, 21 August 2026, 14:29 IST
**Written by:** the design agent that received `docs/HANDOVER-M1-M6-UI-DESIGN.md`
**For:** the next design agent taking over the same assignment
**Supersedes nothing.** `docs/HANDOVER-M1-M6-UI-DESIGN.md` is still the governing brief. This document is the *state of play* on top of it: what has been built, what has been measured, what was decided, what is still open, and exactly where to pick up.

Read `docs/HANDOVER-M1-M6-UI-DESIGN.md` **first, in full, all 996 lines.** Then read this. Where the two disagree on a fact about the world (a file path, a measurement, a GitHub coordinate), this one is newer and wins. Where they disagree on *what your job is*, the original wins.

---

## 0. The 60-second version

You are the UI/UX designer for milestones M1–M6 of **Life in Days**, a private single-user visual memory archive: journals and daily photos laid out as a calendar. You do not write product code. You produce interactive HTML prototypes, design specifications, and GitHub issue content.

The assignment has a mandatory first deliverable *before any M1 prototype exists*: a **one-page design system**. That page is not finished. What *is* finished is the layer underneath it — a measured, verified colour/type/spacing token layer and a specimen page that proves it. Your first job is to finish the one-pager, present it, and **stop and wait for approval**.

**Do not start building M1's prototype.** There is an approval gate in front of it and it has not been passed.

---

## 1. Which project folder to work on

**Work here, and only here:**

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days-design/
```

This is a **git worktree**, already created for you. It is not a separate clone. Everything you write goes under this path.

### 1.1 The other directories, and what you may do with each

| Path | What it is | Your access |
|---|---|---|
| `.../Life-in-Days-design/` | **your worktree**, branch `design/m1-m6-prototypes` | read + write. This is your home. |
| `.../Life-in-Days/` | the primary clone, branch `plan/post-m6`. Another agent is actively working in it. | **read-only.** Never write, stage, commit, or check out anything here. |
| `.../Life-in-Days-archive/` | branch `archive/generation-0`, the abandoned first generation | read-only, and you will rarely need it |
| `.../AI_Life_reflect/` | **~63 registered worktrees, not backed up anywhere** | **NEVER ENTER.** See §3.3. |

### 1.2 The one directory you must never enter

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect/
```

Never `cd` into it. Never run `git worktree prune`, `git clean`, `git reset --hard`, or `rm -rf` inside it — **or from any directory from which those commands could reach it.** A `git worktree prune` run in the wrong place there destroys work that exists in no backup.

**This is now more dangerous than it was.** `.claude/settings.json` in this worktree contains:

```json
{ "permissions": { "defaultMode": "bypassPermissions" } }
```

Bypass-permissions is active at **project scope** — not as a CLI flag you can forget to pass, but as a committed project setting. Every Bash and MCP call runs without a prompt. **Nothing in the harness will stop a destructive command.** The guardrail is entirely your own discipline. The previous agent's commitment, which you should adopt: run no destructive git or filesystem commands at all, and always name staged paths explicitly.

### 1.3 Four files that live only in the primary clone

These are the owner's uncommitted working files. Read them from where they are; do not copy them into your worktree.

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days/UI-DESIGN-INSTRUCTIONS.md
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days/CLAUDE.md
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days/README.md
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days/HANDOVER-PHASE-1.5.md
```

**Do not commit them. Do not revert them. Do not stage them.** They are the owner's in-progress work in another tree.

`UI-DESIGN-INSTRUCTIONS.md` (195 lines) is **binding on you** even though it is untracked. It is the single most important document for how you work. See §5.

---

## 2. What the git tree should be

### 2.1 Current state, verified 2026-08-21 14:29 IST

```
branch:  design/m1-m6-prototypes
HEAD:    d50706b  Add handover: M1-M6 UI/UX design brief for a parallel design agent
remote:  origin  https://github.com/arunpr614/Life-Reflection.git
status:  ?? prototypes/          ← UNCOMMITTED, and this is the live work
```

```
main
 ├── d85561e  Fresh start: reset main to a clean slate
 ├── 53d2e5a  Add Phase 1.5 handover for the next agent
 ├── 5e0d7ff  Add Phase 1.5 implementation plan
 ├── 6478687  Extend the GitHub identity rule to cover commit authorship
 ├── c302eb8  Record decisions: v10 palette/rail, ingest approved as designed
 ├── b86191d  Fix §5.6: CSS token layer now cites the decided v10 palette
 └── d50706b  Add handover: M1-M6 UI/UX design brief   ← you are here
                                                        (design/m1-m6-prototypes)
```

Other worktrees, for orientation only:

```
/…/Life-in-Days          f1745d2  [plan/post-m6]        ← other agent, active
/…/Life-in-Days-archive  fb59c1f  [archive/generation-0]
/…/Life-in-Days-design   d50706b  [design/m1-m6-prototypes]  ← yours
```

### 2.2 ⚠️ Read this before you do anything else

**`prototypes/` is untracked.** The entire token layer and specimen page — the only real output so far — exists in exactly one working tree and in no commit. If this worktree is lost, the work is lost.

The original brief gates committing a *prototype* on owner approval (§8.4). That gate is about not presenting unapproved design as decided. It is not a reason to leave two files at risk across an agent handover.

**Recommended first action:** ask the owner whether to commit the in-progress token layer now on `design/m1-m6-prototypes` as a work-in-progress commit. It is on your own branch, not `main`, so it costs nothing and it makes the handover durable. If they say yes:

```sh
cd /Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days-design
git add prototypes/_shared/tokens.css prototypes/_shared/tokens-specimen.html
git add docs/HANDOVER-DESIGN-SYSTEM-2026-08-21-1429.md
git commit -m "WIP: measured design token layer and specimen page"
```

Note the explicitly named paths. That is not stylistic — see §2.3.

### 2.3 Git rules, non-negotiable

- **Never** `git add -A`, `git add .`, or `git commit -a`. In either directory. Always name the paths you mean. The four files in §1.3 are one careless `git add .` away from being swept into your commit.
- **Never commit to `main`. Never force-push `main`.** Branch protection blocks it, but do not test that.
- Do not rebase `design/m1-m6-prototypes` onto `main`.
- Your own branch is yours to amend and force-push (prefer `--force-with-lease`).
- **Commit identity is pinned locally and must stay that way:**
  ```sh
  git config --local user.name   # → Arun Prakash N
  git config --local user.email  # → arunpr614@users.noreply.github.com
  ```
  Check `git log -1 --format='%an <%ae>'` before pushing. **No commit in this repo may carry a `toasttab.com` address.** The two fresh-start commits on `main` (`d85561e`, `53d2e5a`) predate this rule and keep the old address — leave them alone, because rewriting `main` is forbidden.
- The other agent is working in `Life-in-Days/` on `plan/post-m6` right now. Do not touch their branch, their files, or their tree.

---

## 3. Every resource file, and what each is for

All paths relative to `Life-in-Days-design/` unless marked otherwise.

### 3.1 Read fully, before designing anything

| File | Lines | Why |
|---|---|---|
| `docs/HANDOVER-M1-M6-UI-DESIGN.md` | 996 | **The governing brief.** Your actual assignment. |
| `../Life-in-Days/UI-DESIGN-INSTRUCTIONS.md` | 195 | **Binding.** How you are required to work. §1 is the verification loop, §2 the design-system rule, §3 the banned aesthetics, §9 the definition of done. |
| `reference/CONTEXT.md` | 126 | **The copy specification.** 25+ domain terms, each with a binding `_Avoid_:` list. Not a glossary — a contract on every string you write. |
| `CLAUDE.md` | — | Project rules: GitHub identity, no meta-tooling, privacy boundary. |
| `docs/IMPLEMENTATION-PLAN.md` §6–§10 | 315 | Milestone contents. §8.1 has the palette decision. §8.7, "The prototype CSS is a trap," is worth internalising. |

### 3.2 Navigate, do not read cover to cover

`reference/UX-SPECIFICATION.md` — **1,335 lines.** Read the sections you need for the milestone you are on. The sections that have already been mined:

| Section | Line ~ | What is in it |
|---|---|---|
| §1–§6.5 | 1–260 | Information architecture, navigation, the calendar. §6.2/§6.5 name the **Museum Margin**. |
| §22–§23 | — | Already read |
| §24–§27 | — | Already read |
| **§28.1** | ~1075 | Colour. **SUPERSEDED** — it specifies a warm-brown palette that has been replaced by v10's green. Do not use it. It is also where the "measure every pair, do not assume" rule lives, and that part still binds. |
| **§28.2** | — | **Type. Authoritative and already implemented in `tokens.css`.** display 36/44 (30/38 compact), h1 28/36 (24/32), h2 22/30, body 16/26, small 14/20, meta 13/18 — *never smaller for provenance or errors*. `font.display` = privacy-safe **system serif**; `font.ui` = system sans; custom fonts must be self-hosted (UX-PRIV-04). |
| **§28.3** | — | **Spacing and shape. Implemented.** 4px base, steps 4/8/12/16/24/32/48/64; radius card 12 / media 10 / control 8; *borders and tonal separation before shadows*; one raised shadow only. |
| **§28.4** | — | **Motion. Implemented.** 120/180/240ms; reduced-motion → 0–1ms. |
| §29–§35 | — | Already read |

Requirement IDs that have already bitten and will bite again:

- **UX-A11Y-10** — normal text ≥ 4.5:1, large text ≥ 3:1, **UI boundaries and focus ≥ 3:1**. *"Every token combination must be measured in the eventual design rather than assumed from this specification."* This is the rule that produced the biggest finding of the session (§6.3).
- **UX-A11Y-11** — state must be carried by label and shape, not colour alone.
- **UX-RESP-03** — stable 4:5 presentation frame for media.
- **UX-RESP-04** — 60–72ch reading measure.
- **UX-PRIV-04** — no third-party font request may receive authenticated page or referrer data.

### 3.3 Read on demand

| File | For |
|---|---|
| `reference/PRODUCT-REQUIREMENTS.md` | requirement IDs to cite in issue **References** sections |
| `reference/PRINCIPLES.md` | the fuller data-handling rules behind the privacy boundary |
| `reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md` | M6 only |
| `RESET-DECISION.md` | why generation-0 was abandoned; context for the no-meta-tooling rule |
| `HANDOVER-PHASE-1.5.md` | the previous phase's handover (also present in the primary clone) |

### 3.4 The visual baseline — `reference/prototype-v10/`

```
reference/prototype-v10/index.html
reference/prototype-v10/app.js
reference/prototype-v10/styles.css              ← 6,277 lines / 122KB
reference/prototype-v10/styles-almanac.css
reference/prototype-v10/styles-readiness.css
reference/prototype-v10/styles-resilience.css
reference/prototype-v10/README.md
```

**Mine it, do not inherit it.** `IMPLEMENTATION-PLAN.md` §8.7 is titled "The prototype CSS is a trap" for a reason: 6,277 lines carrying several abandoned variants at once. Take the decided values; leave the file behind.

Run it:

```sh
cd reference/prototype-v10 && python3 -m http.server 4173 --bind 127.0.0.1
# then http://127.0.0.1:4173/index.html?view=calendar&month=2026-08
```

**Values already extracted from it — you do not need to re-derive these:**

```
LIGHT   paper #f4f0e7 · paper-raised #fffdf8 · ink #1f2a27 · ink-soft #5e6964
        line #d8d0c3 · line-strong #bdb3a4 · forest #255949 · focus #0a7762 · sage #dce7de
DARK    paper #111917 · raised #17221f · ink #edf1eb · ink-soft #b4beb8
        line #34413d · line-strong #53615c · forest #75b9a2 · focus #9fe1ca
FONTS   --serif: Georgia, "Times New Roman", serif
        --sans:  Inter, ui-sans-serif, …        ← see §6.5, Inter was dropped
LAYOUT  --rail-width: 238px
```

### 3.5 The work produced this session

```
prototypes/_shared/tokens.css              148 lines   ← the deliverable for issue #187
prototypes/_shared/tokens-specimen.html    543 lines   ← proves the above, by rendering it
```

Both **untracked**. See §2.2.

Run them:

```sh
cd prototypes/_shared && python3 -m http.server 4173 --bind 127.0.0.1
# then http://127.0.0.1:4173/tokens-specimen.html
```

---

## 4. Standing rules you must not break

### 4.1 GitHub identity — the one that will bite you

**Prefix every single `gh` invocation with `GH_HOST=github.com`. No exceptions, including read-only calls.**

```sh
GH_HOST=github.com gh issue view 187 --repo arunpr614/Life-Reflection
```

Use the `arunpr614` account on `github.com`. **Never** `daydreamer614`, **never** `github.toasttab.com`. This covers commit authorship as well as API calls (§2.3).

### 4.2 Privacy boundary

- Never commit real journal text, real photos, identifiers, credentials, provider responses, or private URLs.
- **Fictional fixtures only.** Every string in every prototype is invented.
- `data/` is gitignored. Do not read from it.
- **Your prototypes must make zero third-party network requests.** No CDN fonts, no CDN CSS, no analytics, no remote images.
- Every prototype page carries `<meta name="robots" content="noindex,nofollow,noarchive">`.

### 4.3 Issue hygiene

- Do not touch `phase1` or `phase2` issues or milestones.
- Do not create, rename, or delete labels. The other agent is filing ~88 issues against the same fixed label list right now.
- Do not create or reconfigure project **views**. View 8 is the owner's.

### 4.4 No meta-tooling

Do not build validators, registries, ledgers, councils, dossiers, readiness states, or any code whose purpose is to govern the project. If a change does not move pixels or data for the single user, do not make it. Generation-0 spent 137 commits and ~5,800 lines on coordination code and rendered zero journal entries.

### 4.5 Every session ends with something visible

Something the owner can open in a browser and point at. Not a plan for one.

---

## 5. How you are required to work — `UI-DESIGN-INSTRUCTIONS.md`

This is the document agents skip. Do not skip it.

### 5.1 §1 — the verification loop, non-negotiable

> 1. Render it in a real browser.
> 2. Screenshot it.
> 3. Compare against the intent.
> 4. **List the differences explicitly, in text.**
> 5. Fix them. Repeat until the list is empty.
>
> Step 4 is the one agents skip… **"Looks good" is not a comparison; it is a refusal to compare.**

Step 4 means writing an actual numbered list of differences into your response. Every time. §9.4 of this document is the current open list — that is what it looks like.

### 5.2 §2 — design system first, one page

> If your design document is growing past a page, you have stopped designing and started governing.

Exactly four things: **Color** (4–6 named values, real hex/OKLCH, each with a stated job), **Type** (2+ roles, real families, a scale), **Layout** (**ASCII wireframes** of the M1–M6 screens), **Signature element** (named in one sentence). Then self-critique against §2's three questions. Then **show the owner before building M1**.

### 5.3 §3 — banned aesthetics

The generated-design clusters. Read the list in the source. The two that matter most here:

- near-black canvas + one saturated green accent
- broadsheet pastiche: hairline rules everywhere, everything a serif rule

The current palette sits deliberately one step from the first (dark is green-tinted deep ink, accent is desaturated sage). The second is why `--line-strong` was **not** darkened — see §6.3.

### 5.4 §4 — quality floor

Includes a specific warning about CSS specificity fights. Also: dead CSS is a defect (this is why the no-op `oldstyle-num` rule was removed rather than left in as decoration — §6.5).

### 5.5 §9 — the 10-item definition of done

Rendered; screenshotted; **differences listed in text**; 375/768/1440; keyboard focus visible and ordered; no console errors; `CONTEXT.md` vocabulary; nothing from the §3 banned list; fictional fixtures; owner approved.

### 5.6 Skills to use

- **`frontend-design`** — for the design work itself
- **`prototype`** — the UI branch, with the three adaptations in the brief's §7.3, including the `?variant=` switcher
- **`chrome-devtools-mcp`** — your eyes. Prefer `take_snapshot` (~2–5KB a11y tree) over `take_screenshot` (500KB+) when you need structure rather than pixels. Use `take_screenshot` when the question is genuinely visual — and figure shape, colour drift, and alignment *are* genuinely visual.
- **`a11y-debugging`** — for the keyboard and contrast passes

---

## 6. What has been done — the full session record

### 6.1 Where the session got to

The mandatory first deliverable is the **one-page design system**. It is not written yet. What was built instead is the thing that has to be true *before* that page can be honest: a measured token layer, plus a specimen page that renders it so the owner can judge pixels rather than prose.

Reason, and it is worth keeping: the one-pager has to state real colour values with real jobs, and asserting a palette is accessible without measuring it is exactly what UX-A11Y-10 forbids. Measuring first turned up a genuine defect that would otherwise have been baked into every M1 variant (§6.3).

### 6.2 `prototypes/_shared/tokens.css` — the token layer

The design input to **issue #187** (CSS token layer). Written to be dropped into the app's single stylesheet.

**Two hue knobs, not one.** The archive is warm paper and cool ink; one hue variable cannot drive both without flattening the thing that makes it look like paper.

```css
--brand-hue: 171;  /* forest: accent, focus, ink, and lines in the dark theme */
--paper-hue: 86;   /* warm paper: canvas, raised surfaces, lines in the light theme */
```

Light theme, current and verified:

```css
--paper:        oklch(0.956 0.013 var(--paper-hue)); /* #f4f0e7 canvas */
--paper-raised: oklch(0.994 0.007 var(--paper-hue)); /* #fffdf8 cards, media frames, dialogs */
--ink:          oklch(0.274 0.016 var(--brand-hue)); /* #1f2a27 the work: journal prose, dates */
--ink-muted:    oklch(0.510 0.016 var(--brand-hue)); /* #5e6964 the margin: provenance, meta */
--line:         oklch(0.860 0.020 var(--paper-hue)); /* #d8d0c3 tonal separation */
--line-strong:  oklch(0.771 0.024 var(--paper-hue)); /* #bdb3a4 a visible edge, not a control */
--line-control: oklch(0.620 0.024 var(--paper-hue)); /* form-control borders only — measures 3:1 */
--accent:       oklch(0.423 0.062 var(--brand-hue)); /* #255949 primary action + selection */
--focus:        oklch(0.509 0.094 calc(var(--brand-hue) + 3)); /* #0a7762 given; +3 keeps it exact */

--ink-on-accent: oklch(0.994 0.007 var(--paper-hue));
--ink-on-media:  oklch(1 0 0);
--scrim-media:   oklch(0.20 0.010 var(--brand-hue) / 0.55);
```

Dark theme (`:root[data-theme="dark"]`):

```css
--paper:        oklch(0.205 0.013 var(--brand-hue)); /* #111917 */
--paper-raised: oklch(0.240 0.017 var(--brand-hue)); /* #17221f */
--ink:          oklch(0.953 0.009 var(--brand-hue)); /* #edf1eb */
--ink-muted:    oklch(0.792 0.014 var(--brand-hue)); /* #b4beb8 */
--line:         oklch(0.362 0.018 var(--brand-hue)); /* #34413d */
--line-strong:  oklch(0.479 0.019 var(--brand-hue)); /* #53615c */
--line-control: oklch(0.530 0.019 var(--brand-hue)); /* measures 3:1 on dark --paper */
--accent:       oklch(0.734 0.077 var(--brand-hue)); /* #75b9a2 */
--focus:        oklch(0.859 0.074 var(--brand-hue)); /* #9fe1ca */
```

Also in the file: the §28.2 type scale verbatim; the §28.3 spacing and shape scales; §28.4 motion with a `prefers-reduced-motion` override to 1ms; `--measure: 66ch`; `--rail-width: 238px`; `--margin-width: 300px`.

**Deliberate omissions, each for a stated reason:**

- **No state colour** (no `--danger`, `--warning`, `--success`) until M4, where the first error state actually appears. Until then states are carried by label and shape, which UX-A11Y-11 requires anyway.
- **Inter is not referenced.** v10 names `Inter` first in its sans stack but does not host it. That means it either silently falls back on every machine that lacks it, or costs a forbidden third-party request. `--font-ui` starts at `ui-sans-serif, system-ui`.
- **One stated exception to the §28.2 scale:** `--text-month: clamp(2.75rem, 5vw, 4.25rem)`. The Calendar's month title is the archive's anchor. Nothing else exceeds the display role.

### 6.3 The biggest finding: `--line-strong` cannot be a control boundary

**Measured, not assumed.** `--line-strong` on `--paper` is **1.70:1** in light and **2.66:1** in dark. UX-A11Y-10 and WCAG 1.4.11 require **3:1** for visual information required to identify a control or its state.

That matters because a calendar tile *is* a control, and the obvious design has its border carry that identity. Two ways out, and they are different designs:

- **(a) Darken `--line-strong` until it passes.** ~0.62 L gets there. But it borders 31 calendar tiles, and a grid of hard rules everywhere is precisely the broadsheet pastiche §3 bans. **Rejected.**
- **(b) Stop asking the resting border to be the affordance.** A tile is identified by its *content* — the date numeral at 13.00:1, the title in the display serif — and by its interactive *states*: hover, focus, and selected, carried by `--accent` (7.09:1) and `--focus` (4.82:1). The border is then decorative tonal separation, and 3:1 does not apply to it. **Chosen.** It also matches v10, whose tile borders are fainter still.

Consequence: real form controls **do** need a 3:1 border, because there the border is the thing that says "type here." That is the new seventh colour, **`--line-control`**, and it is used on nothing else. It has no v10 equivalent; it was derived here by solving for the lightest OKLCH L that clears 3:1 on each canvas.

**This reasoning is recorded as a comment block in `tokens.css` at the token definitions.** Keep it there. It is the kind of decision that gets silently undone by a later agent who sees a "too light" border and "fixes" it.

### 6.4 A measurement harness that was lying, and the fix

The specimen's contrast table initially reported **1.40:1 for every pair** and a drift of "254.0/255". Every number was fiction.

Cause: Chrome computes an `oklch()` value to the string `"oklch(0.423 0.062 171)"`, **not** `"rgb(…)"`. The naive `str.match(/-?[\d.]+/g)` was parsing OKLCH lightness, chroma, and hue as if they were RGB bytes.

Fix — resolve any CSS colour to true sRGB by painting one pixel and reading it back:

```js
const _probeCanvas = document.createElement('canvas');
_probeCanvas.width = _probeCanvas.height = 1;
const _probeCtx = _probeCanvas.getContext('2d', { willReadFrequently: true });

function rgb(cssColor) {
  _probeCtx.clearRect(0, 0, 1, 1);
  _probeCtx.fillStyle = '#000';      // reset, so an invalid colour cannot silently inherit
  _probeCtx.fillStyle = cssColor;
  _probeCtx.fillRect(0, 0, 1, 1);
  const d = _probeCtx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}
function resolveToken(token) { /* set on a real element, read computed, then rgb() */ }
```

**Generalise the lesson:** any colour maths you do on `getComputedStyle` output in this project must go through `rgb()`/`resolveToken()`. The tokens are OKLCH and always will be. A harness that reports plausible-looking numbers is worse than no harness.

### 6.5 Georgia's figures — a property that did nothing

`font-variant-numeric: oldstyle-num` computed to `normal` on every element that carried it, despite the rule being present and matching. Cause: **Georgia's default figures are already old-style.** It ships no `onum` feature to switch on, so the declaration was a no-op.

The `.figures` class and the declaration were **removed** (dead CSS is a defect, §5.4) and replaced with a comment explaining why. The old-style figures were then **confirmed by eye** in both themes — "August 2026" and "1234567890" render with varying digit heights.

This is why Georgia is a positive choice rather than a fallback: date numerals in 31 calendar tiles sit *inside* the line instead of shouting. Keep `--font-display` as it is, and if you ever swap it, check the figures visually — the property will not tell you.

### 6.6 `prototypes/_shared/tokens-specimen.html`

Renders pixels the owner can judge. Sections:

1. **Split swatches** — left half the `oklch()` token, right half the decided hex literal. A visible seam means the conversion drifted. Plus a measured drift readout in sRGB steps. `--line-control` renders unsplit and labelled "derived here, no v10 hex", because there is nothing to compare it to.
2. **Type specimens** for every role, including numerals.
3. **Measured contrast table** — twelve pairs, each with its requirement, its measured ratio, and a verdict. Decorative pairs are marked "n/a — tonal only" rather than being quietly excluded.
4. **Control borders** — a rendered `Journal Date` input, a `Photo Caption` input, a `Needs Date Review` badge, and quiet/primary buttons, so `--line-control` is verified in use and not merely in a table.
5. **The signature element at real size** — a 7-column grid fragment at `aspect-ratio: 4/5` with `.tile--quiet` / `.tile--day` / `.tile--cover` / `.tile--today` / `.tile--selected`, a `.work` card in the display serif, and a `.margin` aside carrying provenance in the UI sans at meta size.

Synthetic covers are painted to a local `<canvas>`. No network.

### 6.7 The v10 navigation rail — a discrepancy the owner should know about

`docs/HANDOVER-M1-M6-UI-DESIGN.md` §6.1 and `IMPLEMENTATION-PLAN.md` §8.1 both record the decision as *"prototype v10 — green palette with the persistent 238px navigation rail."*

But in v10, `.navigation-rail` sits under a `/* Variant A — Archive Desk */` comment, and `grep navigation-rail app.js` **returns zero hits.** It is dead CSS from an earlier variant. The live v10 prototype the owner has been iterating on uses a **top nav**: Calendar | Almanac | Search, with Settings, a theme toggle, and Add journal. `--rail-width` survives only in the Almanac's collapsible month index (`params.get("rail") === "collapsed"`).

So the thing approved as "v10's rail" is dormant in the v10 they were looking at.

**This is one sentence for the owner, not a relitigation.** §6.1 says the rail is in; build it in all three M1 variants. But say it, because it is likely they approved a screenshot that had no rail in it.

### 6.8 The Museum Margin — confirmed behaviour

Driven in a real browser, not inferred. Selecting a day in v10 **does not navigate away.** The grid compresses left (~490px), a large work frame opens centre, and a provenance column opens right, reading:

```
NO COVER IMAGE · JOURNAL ONLY
<title>
Saturday, 8 August 2026
0 photos · 1 journal
```

This is the approved calendar treatment, named in UX §6.2/§6.5, and it grounds the signature element.

---

## 7. What is verified, and what is not

### 7.1 Verified by measurement or by eye

**Contrast — all twelve pairs, both themes, measured in a real browser:**

| Pair | Need | Light | Dark |
|---|---|---|---|
| `--ink` on `--paper` | 4.5:1 | 13.00 ✓ | 15.60 ✓ |
| `--ink` on `--paper-raised` | 4.5:1 | 14.54 ✓ | 14.27 ✓ |
| `--ink-muted` on `--paper` | 4.5:1 | 5.03 ✓ | 9.36 ✓ |
| `--ink-muted` on `--paper-raised` | 4.5:1 | 5.62 ✓ | 8.56 ✓ |
| `--accent` on `--paper` | 4.5:1 | 7.09 ✓ | 7.85 ✓ |
| `--ink-on-accent` on `--accent` | 4.5:1 | 7.93 ✓ | 7.85 ✓ |
| `--focus` on `--paper` | 3.0:1 | 4.82 ✓ | 12.00 ✓ |
| `--accent` outline on `--paper` | 3.0:1 | 7.09 ✓ | 7.85 ✓ |
| **`--line-control` on `--paper`** | 3.0:1 | **3.21 ✓** | **3.43 ✓** |
| **`--line-control` on `--paper-raised`** | 3.0:1 | **3.59 ✓** | **3.14 ✓** |
| `--line-strong` on `--paper` | — | 1.81 (tonal only) | 2.75 (tonal only) |
| `--line` on `--paper` | — | 1.35 (tonal only) | 1.68 (tonal only) |

- **OKLCH fidelity:** largest drift from the decided hex is **2/255 (light, `--line-strong`)** and **4/255 (dark, `--ink`)**. Imperceptible, and visually checkable via the split swatches.
- **Zero third-party requests.** Only `tokens-specimen.html`, `tokens.css`, a `data:` URI (Chrome's own inlined calendar icon for `<input type="date">`), and a browser-initiated `favicon.ico` 404.
- **Console clean.** The earlier "form field should have an id or name" issue is fixed.
- **Accessible names:** all 11 controls have one. Tab order is logical.
- **Light theme at 1440 and dark theme at 1440:** looked at, both render correctly.
- **Old-style figures:** confirmed by eye, both themes.

### 7.2 Not yet done

- **Screenshots at 375 and 768.** Only 1440 has been seen. The responsive pass is genuinely unverified.
- **`lighthouse_audit`.** Never run on the specimen.
- **A real keyboard tab-through.** Tab order was verified programmatically from the DOM; nobody has actually tabbed it and watched the focus ring.
- **`docs/design/DESIGN-SYSTEM.md`.** Not started. This is the gating deliverable.
- **The §14 questions.** Not yet put to the owner.

### 7.3 Two UA-supplied details worth knowing

- `<input type="date">` brings its own calendar icon as a `data:` SVG whose fill is `WindowText` / `#ffffff` — **you do not control its colour.** `color-scheme` on `:root` makes it adapt, which is why `color-scheme: light` / `dark` is set per theme. This is a real constraint for M5's date-correction UI.
- A day tile with a cover but no title gets the accessible name `"11"`. That is too thin. M1 needs a fuller name, e.g. `"11 August 2026, 1 journal, no photos"`.

---

## 8. What you should continue on, in order

### Step 1 — Decide the commit question (§2.2)

Ask the owner whether to commit the untracked token layer as WIP on the design branch. Do not leave the handover resting on one working tree.

### Step 2 — Close the open verification loop on the specimen

- Screenshot at **375** and **768**, both themes. Fix what breaks.
- Run `lighthouse_audit`.
- Tab through it for real; watch the focus ring on every control.
- Fix the items in §9.4 below.
- **Write the difference list out in text.** Not "looks good."

### Step 3 — Write `docs/design/DESIGN-SYSTEM.md`

**One page. Exactly four things.** If it grows past a page you have started governing instead of designing.

1. **Color** — the 7 values from §6.2, each with its one-line job. Include the `--line-control` reasoning in *one* sentence; the full argument stays in the CSS comment.
2. **Type** — Georgia (display) and the system sans (UI), the §28.2 scale, and why Georgia specifically (old-style figures, privacy-safe, self-hosted-free).
3. **Layout** — **ASCII wireframes** of the M1–M6 screens. This is the part that will be tempting to skip and must not be.
4. **Signature element**, one sentence. The proposed wording: *"The **Museum Margin** — the work never shares a column with what the system says about it; provenance is always in the same place, in the UI sans at meta size."*

Then self-critique against §2's three questions.

### Step 4 — Present it, and STOP

Show the owner:

- the one-page design system
- the specimen page, running, with the measured numbers
- the `--line-strong` finding and the design decision it forced (§6.3) — this is the most interesting thing to come out of the session and it changes how tiles work
- the v10 rail discrepancy, in one sentence (§6.7)
- the open questions in §10

**Then stop and wait.** Per the brief's §8.0: *"Show the owner this one page **before** you build M1's prototype."* Do not start M1. Do not "get a head start on M1 while waiting."

### Step 5 — Only after explicit approval

Build M1's three-variant prototype in `prototypes/m1-calendar-shell/`, plus `_shared/fixtures.js`, `_shared/switcher.js`, `_shared/base.css`. File the `type:design` issue. Then the per-milestone loop in the brief's §8.1 for M1 → M6, one at a time, each with its own approval gate.

---

## 9. How to behave with the owner

### 9.1 The stop rule is the whole method

One milestone, one prototype, one conversation, one approval. Then the next. **Never** run ahead to the next milestone because the current one is "probably fine."

Specifically, you stop and wait:

- after the one-page design system, before M1's prototype
- after each milestone's prototype, before its GitHub issue is filed as approved
- before committing any prototype

### 9.2 How to hand work over

Give them, every time:

- a **running URL** they can open, plus the exact command to start the server
- **screenshots** at 375 / 768 / 1440
- the **written difference list** from §1 step 4
- **specific trade-off questions** — not "any feedback?" Name the two options and what each costs.

### 9.3 On GitHub issues — how to behave

This is what the owner asked for when they said the HTML should be *"pushed to GitHub issues so that it's retained and documented."*

**Two lanes, and keep them separate:**

- **The design issue is canonical.** One new issue per milestone, holding the full specification, the prototype, the screenshots, and the build instructions.
- **On each implementation issue the design governs, post a comment — never rewrite the body.** Those 36 existing bodies were written to a fixed six-section register, and the other agent's ~88 new tickets are being written to match it. Do not disturb the register.

**Do not file the design issue before the owner has approved that milestone's prototype.** The issue is the record of an approved design, not a work-in-progress scratchpad.

**Design issue title:** `Design — M<n> — <the surface, in the owner's words>`
e.g. `Design — M1 — Calendar month view and application shell`

**Body — the same six-section register as every other ticket, in this order:**

```markdown
## Outcome
## Scope
## Technical notes
## Acceptance criteria
## References
## Depends on
```

- **Outcome** — what the owner can *see and judge*, in their own vocabulary. One or two sentences. Not "produce design artifacts."
- **Scope** — the screen-and-state inventory. This section does the work; it is the contract for what the prototype covers.
- **Technical notes** — the decided tokens; the server-rendered-HTML constraints; the specific UX rules that bind (`UX-IA-04`, `UX-NAV-02`, `UX-CAL-04`, …); what is deliberately excluded and which milestone owns it.
- **Acceptance criteria** — GitHub checkboxes. Include all ten `UI-DESIGN-INSTRUCTIONS.md` §9 items, plus "owner has reviewed and approved."
- **References** — file paths **with line numbers**, e.g. `reference/UX-SPECIFICATION.md` §6.2 (line 225). Requirement IDs from the PRD. The prototype path.
- **Depends on** — the implementation issues this design governs, and the previous milestone's design issue.

**Read issue #197 first** — it is the best-written ticket in the repo and the one to imitate for tone and density. Aim for **300–700 words**.

```sh
GH_HOST=github.com gh issue view 197 --repo arunpr614/Life-Reflection
```

Creating it:

```sh
GH_HOST=github.com gh issue create \
  --repo arunpr614/Life-Reflection \
  --title "Design — M1 — Calendar month view and application shell" \
  --body-file /tmp/m1-design.md \
  --milestone "Phase 1.5 — M1 — A real month renders in the browser" \
  --label phase1.5 --label type:design --label ui-prototype \
  --label priority:high --label status:backlog
```

**The trap:** `--milestone` takes the **full title string**, not the number. `--milestone 50` fails with `'50' not found`. Copy the title exactly, em dashes and all — the format is `Phase 1.5 — M<n> — <outcome>` with spaces around the em dashes.

**The comment on an implementation issue** is short and specific to *that* ticket:

```markdown
## Design specification

Approved design: #<design-issue> · prototype `prototypes/m1-calendar-shell/` · variant **B (Editorial)**

For this ticket specifically:
- <the two or three design decisions that constrain *this* ticket>
- <exact token names, spacing, and copy strings it must use>
- <the states it must render, and where each appears in the prototype>
```

**Getting HTML into a GitHub issue:** there is an API limitation and a recipe for it in the brief's §11.4. Read that before trying.

**Batching:** finish one milestone's GitHub work completely — issue created, labelled, added to the project, all four fields set, implementation issues commented — before starting the next.

### 9.4 The open difference list (§1 step 4), as it stands

Carry this forward and close it:

1. **The `Needs Date Review` badge is baseline-misaligned** with the buttons beside it in the control-borders row. `align-items: flex-end` on a pill whose line-height differs from the buttons'. Real visual defect. Fix.
2. **375 and 768 unverified.** The `.controls-demo` flex row and the `.stage` two-column grid have not been seen below 900px. The `@media (max-width: 900px)` fallbacks exist but are untested.
3. **A tile with a cover but no title has the accessible name `"11"`** (§7.3). Needs a fuller name; it is an M1 design decision, not just a specimen bug.
4. **Synthetic canvas covers read as placeholder gradients.** Adequate for a token specimen; **not** adequate for judging an image-first calendar. This is exactly open question Q2 (§10).
5. **The specimen's work card sits below the grid**, not centre-stage between grid and margin. Correct for a specimen; note that M1's real stage is grid-left / work-centre / margin-right, per §6.8.
6. **In dark theme the `--paper` and `--paper-raised` swatches are nearly invisible** against the swatch card, which is itself `--paper-raised`. Expected, but it makes those two swatches unjudgeable in dark. Consider a checkerboard or a contrasting swatch frame.

---

## 10. Open questions — surface these, do not decide them

Put these to the owner at the point they become relevant. Do not batch them into an interrogation, and do not answer them yourself by picking whatever unblocks you fastest.

**Ask before M1's build:**

- **Q1 — What goes in the navigation rail at M1?** Most secondary surfaces do not exist until M7+. Design for now and say how it grows. Pair this with the §6.7 discrepancy.
- **Q2 — Synthetic imagery, or the owner's own photos in a gitignored `prototypes/_local-photos/`?** Determines how much of an image-first design they can actually judge. See §9.4 item 4.
- **Q3 — Dark theme in v0.1, or light only?** UX §28 (line ~1075) specifies both; the implementation plan does not commit to shipping both. Two themes roughly doubles the states you design and verify. **This changes the token architecture, so ask it before M1's build.** Note: dark is already built and measured, so the marginal cost is now lower than it was.
- **Q5 — Should `UI-DESIGN-INSTRUCTIONS.md` be committed?** It is binding on every UI agent and currently exists in exactly one working tree. One sentence, then drop it.

**Ask later:**

- **Q4 — Does M6 get a design issue at all?** It is four states and a responsive pass. Reasonable either way.
- **Q6 — Do the AI-derived slots get designed as placeholders now, or left out?** UX §9.4 (line ~363) specifies title, summary, and tags on the Journal Day page; they arrive in M10. Designing the empty slots now avoids a relayout later but shows a page with visible gaps. Recommend the slots; let them decide.

---

## 11. Metadata — what must be set, every time

### 11.1 GitHub coordinates, verified 2026-08-21

| Thing | Value |
|---|---|
| Repository | `arunpr614/Life-Reflection` (private) |
| Project | **user** project number **1**, "Life Reflection" |
| Project node ID | `PVT_kwHOD9kkX84BgUtf` |
| Owner login | `arunpr614` |
| The owner's review board | View **8**, "Phase 1.5 Status", `BOARD_LAYOUT`, filter `label:phase1.5` |
| Milestones | 50 (M1), 51 (M2), 52 (M3), 53 (M4), 54 (M5), 55 (M6) |

It is a **user** project, not an organisation project. `gh project` needs `--owner arunpr614`; GraphQL needs `user(login: "arunpr614") { projectV2(number: 1) }`.

**The visibility rule, and it catches everyone:** an issue appears on view 8 **if and only if** it carries the `phase1.5` label **and** has been added to project 1. **Both.** An issue with the label but not added to the project is invisible to the owner's review, and nothing warns you.

### 11.2 Labels — exactly these, and do not invent any

| Slot | Value | Notes |
|---|---|---|
| Phase | `phase1.5` | **Always.** Without it the issue is invisible on view 8. |
| Type | `type:design` | every design issue |
| Kind | `ui-prototype` | every design issue |
| Priority | `priority:high` \| `priority:medium` \| `priority:low` | M1 and M2 are `high`; M6 is `medium` |
| Status | `status:backlog` | at creation → `status:in-progress` when you start → `status:done` on approval |

**Never apply:** `phase1`, `phase2`, any `version:v*` label, `mvp`, `roadmap`. **Never create, rename, or delete a label.**

There is a bare `accessibility` label but no `type:accessibility`. If you need to flag an accessibility finding, `accessibility` is the one that exists.

### 11.3 Project fields — add the issue, then set four values

```sh
# 1. add to the project; this prints the item ID
GH_HOST=github.com gh project item-add 1 --owner arunpr614 \
  --url https://github.com/arunpr614/Life-Reflection/issues/<N>
```

```graphql
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: "PVT_kwHOD9kkX84BgUtf"
    itemId:    "<ITEM_ID>"
    fieldId:   "PVTSSF_lAHOD9kkX84BgUtfzhahTpA"   # Status
    value:     { singleSelectOptionId: "f75ad846" }  # Backlog
  }) { projectV2Item { id } }
}
```

Repeat for **Priority**, then the two text fields.

**Field IDs, verified 2026-08-21:**

| Field | ID | Type |
|---|---|---|
| Status | `PVTSSF_lAHOD9kkX84BgUtfzhahTpA` | single-select |
| Priority | `PVTSSF_lAHOD9kkX84BgUtfzhah0Eg` | single-select |
| **Design artifact** | `PVTF_lAHOD9kkX84BgUtfzhahz24` | text |
| Requirement IDs | `PVTF_lAHOD9kkX84BgUtfzhahz28` | text |
| Evidence | `PVTF_lAHOD9kkX84BgUtfzhahz3I` | text |
| Task summary | `PVTF_lAHOD9kkX84BgUtfzhahz58` | text |
| PRD / PID | `PVTF_lAHOD9kkX84BgUtfzhahzxM` | text |
| Labels | `PVTF_lAHOD9kkX84BgUtfzhahTpE` | derived, read-only |
| Milestone | `PVTF_lAHOD9kkX84BgUtfzhahTpM` | derived, read-only |
| Title | `PVTF_lAHOD9kkX84BgUtfzhahTo4` | derived |

| Status option | ID | | Priority option | ID |
|---|---|---|---|---|
| Backlog | `f75ad846` | | High | `665e4024` |
| Next | `b753d38d` | | Medium | `20d2f405` |
| In progress | `47fc9ee4` | | Low | `2c5259bb` |
| Done | `98236657` | | | |

**The four values to set on every design issue you create:**

1. **Status** — `Backlog` at creation, `In progress` when you start the milestone, `Done` on approval
2. **Priority** — set it **explicitly**. On the 36 existing issues priority exists only as a *label*; the project field is empty. Filling it is what makes the board sortable for the owner.
3. **Design artifact** — the prototype path, e.g. `prototypes/m1-calendar-shell/`
4. **Requirement IDs** — the `UX-*` and PRD IDs the design satisfies

Two API notes:

- `Labels` and `Milestone` are **derived from the issue.** Set them with `gh issue create` / `gh issue edit`, never with a field mutation.
- Do not create or reconfigure project **views.** View 8 is the owner's. (For reference: when creating a view via GraphQL the response payload field is `projectV2View`, not `view` — a mistake worth not repeating.)

### 11.4 Metadata inside every prototype file

Every prototype HTML file opens with a comment block carrying:

```html
<!--
  Life in Days — <what this is>
  PROTOTYPE ARTIFACT · fictional data · in-memory only · not production.
  Milestone: <M1 | M2 | …>
  Issue: <#NNN>
  Purpose: <one or two sentences>
  Zero third-party requests. System fonts only.
  Run: cd <dir> && python3 -m http.server 4173 --bind 127.0.0.1
-->
```

And in `<head>`:

```html
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="color-scheme" content="light dark">
<html lang="en-IN">
```

`lang="en-IN"` is deliberate — dates render as `8 August 2026`, times as `21:04 IST`.

### 11.5 Vocabulary is not negotiable

`reference/CONTEXT.md` is the copy specification, not a glossary. Every term has a binding `_Avoid_:` list. The ones that come up constantly:

| Use | Never |
|---|---|
| **Journal Day** | diary, daily entry |
| **Journal Date** | upload date |
| **Needs Date Review** | (a status, exact string) |
| **Source Item**, **Uploaded Journal** | file, attachment |
| **Daily Photo**, **Photo Caption** | image, alt text |
| **Media Asset**, **Original Timestamp** | — |
| **Source Revision**, **Correction** | source edit |
| **Derived Artifact** | — |
| **Calendar Cover** | thumbnail, hero image |
| **Trash** | delete, archive |

---

## 12. Definition of done, per milestone

Every one of these, every time:

- [ ] Every screen and state in the milestone's inventory is in the prototype and reachable
- [ ] Rendered in a real browser at **375 / 768 / 1440**
- [ ] Screenshotted at all three
- [ ] **Differences from intent listed explicitly, in text**, and the list is empty
- [ ] Keyboard: every control reachable, focus visible, tab order logical
- [ ] No console errors
- [ ] **Contrast measured**, not eyeballed — and via `resolveToken()`, not naive string parsing (§6.4)
- [ ] Zero third-party network requests
- [ ] All copy matches `reference/CONTEXT.md`
- [ ] Nothing from the §3 banned-aesthetics list
- [ ] Fictional fixtures only
- [ ] Owner has reviewed and **explicitly approved**
- [ ] Design issue filed, labelled, added to project 1, all four fields set
- [ ] `docs/design/M<n>-BUILD-INSTRUCTIONS.md` written and posted to the issue
- [ ] Prototype committed (named paths only)

### 12.1 Verification commands

```sh
cd /Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days-design

# Your design issues, with labels and milestone
GH_HOST=github.com gh issue list --repo arunpr614/Life-Reflection \
  --label type:design --json number,title,labels,milestone

# No third-party requests in any prototype (should print nothing).
# BSD grep on macOS has no -P, so filter in two steps rather than using a lookahead.
grep -rEo 'https?://[^"'"'"' )]+' prototypes/ | grep -v '127.0.0.1\|localhost\|www.w3.org'

# Nothing of the owner's swept up (should show only your own files)
git status --short

# Commit identity
git log -1 --format='%an <%ae>'
```

---

## 13. Three things about how to work here

1. **Measure before you assert.** The single most valuable output of the last session was not the palette — it was discovering, by rendering and measuring, that the obvious design for a calendar tile violates WCAG. That finding was invisible to reasoning and obvious to a measurement. And the first measurement harness was itself wrong (§6.4), which is the sharper lesson: verify your verification.

2. **The written difference list is the job, not paperwork.** "Looks good" is a refusal to compare. Every loop, write the list.

3. **Do not run ahead of the owner.** The approval gates are the method, not friction in front of it. You are one page and one conversation away from being allowed to build M1. Get the page right, present it, and wait.

---

## 14. Immediate first actions for you

1. Read `docs/HANDOVER-M1-M6-UI-DESIGN.md` in full.
2. Read `../Life-in-Days/UI-DESIGN-INSTRUCTIONS.md` in full.
3. Read `reference/CONTEXT.md` in full.
4. Confirm `git status` shows only `?? prototypes/` and nothing of the owner's.
5. Start the server and look at the specimen page yourself:
   ```sh
   cd prototypes/_shared && python3 -m http.server 4173 --bind 127.0.0.1
   # http://127.0.0.1:4173/tokens-specimen.html
   ```
6. Ask the owner the §2.2 commit question.
7. Close §9.4. Then write `docs/design/DESIGN-SYSTEM.md`. Then present, and **stop.**
