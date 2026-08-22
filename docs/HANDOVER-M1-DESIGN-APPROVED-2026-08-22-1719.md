# Handover — close out M1's design (build instructions + GitHub issue), then start M2

**Written:** Saturday, 22 August 2026, 17:19 IST
**Written by:** the design agent that received `docs/HANDOVER-DESIGN-SYSTEM-2026-08-21-1429.md`, which itself picked up from `docs/HANDOVER-M1-M6-UI-DESIGN.md`
**For:** the next agent taking over this same assignment
**Relationship to prior documents:** `docs/HANDOVER-M1-M6-UI-DESIGN.md` (996 lines) is still the governing brief — it is where the assignment, the standing rules, and the per-milestone process come from, and nothing here changes what your job *is*. `docs/HANDOVER-DESIGN-SYSTEM-2026-08-21-1429.md` (865 lines) is superseded on every fact about the world: it left off with the one-page design system unwritten and M1 unbuilt. Both are true now. Read the original brief in full if you have not; skim the design-system handover only if you want the session-by-session history of how the palette got measured the first time.

Where any of these three documents disagree on a fact — a path, a measurement, a GitHub coordinate — **this one is newer and wins.** Where they disagree on what your job is, the original brief wins.

---

## 0. The 60-second version

You are the UI/UX designer for milestones M1–M6 of **Life in Days**, a private single-user visual memory archive. You do not write product code. You produce interactive HTML prototypes, design specifications, and GitHub issue content, one milestone at a time, with an owner-approval gate after each.

**M1's design is now fully decided.** Shell: Editorial (approved 2026-08-21). Colour: Indigo on Fog paper (decided 2026-08-22, from a four-colour × four-paper exploration you can still see live in the prototype's dropdowns). What is **not** done yet is the paperwork that turns that decision into something an implementation agent can build from: `docs/design/M1-BUILD-INSTRUCTIONS.md` does not exist, and no GitHub design issue has been filed for M1 — confirmed by querying the tracker just before this handover was written (§11.1).

**Do not start M2 (Journal Day detail) until M1's GitHub paperwork is filed and the owner has seen it.** That is the immediate next step, and it is detailed in full in §8.

---

## 1. Which folder to work in

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days-design/
```

This is a **git worktree**, not a separate clone. Everything you write goes under this path. Branch: `design/m1-m6-prototypes`.

### 1.1 Other directories, and what you may do with each

Verified via `git worktree list` at the timestamp above — **this list has grown since the last handover; two worktrees below did not exist when it was written.**

| Path | Branch | What it is | Your access |
|---|---|---|---|
| `.../Life-in-Days-design/` | `design/m1-m6-prototypes` | **your worktree** | read + write. Home. |
| `.../Life-in-Days/` | `spike/m0.1-host-inventory` | the primary clone. **Branch changed** since the last handover (was `plan/post-m6`) — another agent is actively working an infra/host-inventory spike here now, not the M7–M19 ticketing work the previous handover described. | **read-only.** Never write, stage, commit, or check out anything here. |
| `.../Life-in-Days-archive/` | `archive/generation-0` | the abandoned first generation | read-only, rarely needed |
| `.../Life-in-Days-impl/` | `impl/local-mac-server` | **new since the last handover.** Another agent's implementation worktree. | read-only, not yours |
| `.../Life-in-Days-m0.1-spike/` | `spike/m0.1-host-limits` | **new since the last handover.** Another agent's spike worktree. | read-only, not yours |
| `.../AI_Life_reflect/` | — | **~63 registered worktrees, not backed up anywhere.** Confirmed still present at this path. | **NEVER ENTER.** See §1.2. |

The pattern across this project is now unmistakable: other agents are actively parallel-working the implementation and infra tracks in their own worktrees while you work the design track in yours. Stay in your lane; do not read their worktrees for "context" — you do not need it, and it is not yours to have opinions about.

### 1.2 The one directory you must never enter

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect/
```

Never `cd` into it. Never run `git worktree prune`, `git clean`, `git reset --hard`, or `rm -rf` inside it — **or from any directory from which those commands could reach it.**

**This worktree runs with `bypassPermissions` at project scope, confirmed just now:**

```json
{ "permissions": { "defaultMode": "bypassPermissions" } }
```
— `.claude/settings.json`, read directly, still present. Every Bash and MCP call in this worktree runs without a prompt. Nothing in the harness will stop a destructive command reaching `AI_Life_reflect`. The guardrail is your own discipline: run no destructive git or filesystem commands at all, and always name staged paths explicitly.

### 1.3 Four files that live only in the primary clone

The owner's uncommitted working files. Read them from where they are; do not copy them into your worktree, do not commit them, do not revert them.

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days/UI-DESIGN-INSTRUCTIONS.md   (195 lines)
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days/CLAUDE.md                    (38 lines)
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days/README.md
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days/HANDOVER-PHASE-1.5.md
```

`UI-DESIGN-INSTRUCTIONS.md` is **binding on you** even though it is untracked. See §5.

---

## 2. What the git tree should be

### 2.1 Current state, verified 2026-08-22 17:19 IST

```
branch:  design/m1-m6-prototypes
HEAD:    0d83bc8  Decision: Indigo on Fog is the M1 colour palette
remote:  origin  https://github.com/arunpr614/Life-Reflection.git
status:  clean — nothing uncommitted
```

```
design/m1-m6-prototypes (12 commits ahead of where the last handover found it)
 d50706b  Add handover: M1-M6 UI/UX design brief for a parallel design agent
 4d94833  WIP: measured design token layer and specimen page
 793d23b  Design system one-pager, plus close the specimen's verification loop
 01f66f1  WIP: M1 calendar shell + month view, three variants, for owner review
 1ee701d  Fix a <br>-joined margin stat reading as one run to assistive tech
 a13a488  Rotate palette to apple green; approve M1 shell as Variant B (Editorial)
 a031b75  Four measured colour themes on the fixed Editorial shell
 1497027  Four measured paper themes — the one hue that never moved until now
 d5faf92  Fix: colour-theme picker was an arrow-bar, not a dropdown — unfindable
 0d83bc8  Decision: Indigo on Fog is the M1 colour palette   ← you are here
```

**Nothing is uncommitted.** Unlike the last handover, there is no durability risk to flag — every artifact this session produced is pushed to `origin/design/m1-m6-prototypes`.

### 2.2 Git rules, non-negotiable

- **Never** `git add -A`, `git add .`, or `git commit -a`. Always name the paths you mean, every time, in both directories.
- **Never commit to `main`. Never force-push `main`.**
- Your own branch (`design/m1-m6-prototypes`) is yours to amend and force-push (prefer `--force-with-lease`), but prefer new commits — this session never amended once.
- **Commit identity is pinned locally, confirmed just now:**
  ```
  user.name  = Arun Prakash N
  user.email = arunpr614@users.noreply.github.com
  ```
  Check `git log -1 --format='%an <%ae>'` before pushing. No commit in this repo may carry a `toasttab.com` address.
- Other agents are working in `Life-in-Days/`, `Life-in-Days-impl/`, and `Life-in-Days-m0.1-spike/` right now. Do not touch their branches, files, or trees.

---

## 3. Every resource file, and what each is for

All paths relative to `Life-in-Days-design/` unless marked otherwise.

### 3.1 Read fully, before doing anything

| File | Lines | Why |
|---|---|---|
| `docs/HANDOVER-M1-M6-UI-DESIGN.md` | 996 | **The governing brief.** Your actual assignment, the per-milestone process, GitHub operating procedure. |
| `../Life-in-Days/UI-DESIGN-INSTRUCTIONS.md` | 195 | **Binding.** §1 the verification loop, §2 design-system rule, §3 banned aesthetics, §9 definition of done. |
| `reference/CONTEXT.md` | 125 | **The copy specification.** 25+ domain terms, each with a binding `_Avoid_:` list. |
| `../Life-in-Days/CLAUDE.md` | 38 | Project rules: GitHub identity, no meta-tooling, privacy boundary. |
| `docs/design/DESIGN-SYSTEM.md` | 126 | **The one-page design system**, now written. Colour/type/layout/signature-element, plus the self-critique. Rotate its palette section mentally to Indigo/Fog when you read it — it was written for the apple-green round and was not rewritten; the token values it names are stale, the structure/wireframes/signature-element are not. |

### 3.2 Navigate, do not read cover to cover

`reference/UX-SPECIFICATION.md` — **1,335 lines.** Sections already mined, per the previous two handovers: §1–§6.5 (IA, nav, the Museum Margin), §22–§23, §24–§27, §28.1 (**superseded** — warm-brown palette, never used), §28.2 (type, implemented), §28.3 (spacing/shape, implemented), §28.4 (motion, implemented), §29–§35.

`docs/HANDOVER-M1-M6-UI-DESIGN.md` §9 — the per-milestone screen/state inventories for M1–M6. You have only fully executed M1. Read M2's entry (line ~522) before starting it.

### 3.3 Read on demand

| File | For |
|---|---|
| `reference/PRODUCT-REQUIREMENTS.md` (380 lines) | requirement IDs for issue References sections |
| `reference/PRINCIPLES.md` (9 lines) | data-handling rules behind the privacy boundary |
| `reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md` | M6 only |
| `docs/IMPLEMENTATION-PLAN.md` (315 lines) | §6–§10 milestone contents; §8.1 palette decision (now stale on the actual hex, current on the rail); §8.7 "the prototype CSS is a trap" |

### 3.4 The visual baseline — `reference/prototype-v10/`

Unchanged since the last handover. Mine it for ideas; do not copy its code. One correction still worth carrying: its `.navigation-rail` CSS is dead code from an earlier variant — the live v10 prototype uses a top nav. The 238px rail is still the owner's decision regardless (`docs/HANDOVER-M1-M6-UI-DESIGN.md` §6.1 explicitly overrides UX §4.2's no-rail clause) — this is just about where "v10's rail" actually lives, not whether it's decided.

### 3.5 Work produced across all sessions — inventory, verified by `find` + `wc -l` just now

```
prototypes/_shared/
  tokens.css              270 lines   the design system — SEE §6.2, READ BEFORE TOUCHING
  tokens-specimen.html    576 lines   proves tokens.css by rendering it; run this first
  fixtures.js              77 lines   the fictional archive, shared by every milestone
  base.css                 58 lines   reset, type defaults, layout primitives
  prototype-chrome.css     64 lines   variant switcher + controls-bar styling
  switcher.js              57 lines   the ?variant= floating-bar mechanism (NOT used by M1 anymore — see §6.3)
  screenshots/             6 files    light/dark × 375/768/1440 of the specimen

prototypes/m1-calendar-shell/
  app.js                  400 lines   the M1 prototype: calendar logic, keyboard nav, states, controls
  variants.css            167 lines   Editorial's structural CSS (A/C variants removed, see §6.3)
  index.html               32 lines
  README.md                13 lines
  screenshots/             12 files   apple/sage/indigo/plum × light/dark, cream/linen/blush/fog

docs/design/
  DESIGN-SYSTEM.md        126 lines   the one-pager — palette section is stale, see §3.1 note above
```

Run the M1 prototype (from `prototypes/`, not from inside `m1-calendar-shell/` — Python's http.server won't follow `..` above wherever it starts):

```sh
cd prototypes && python3 -m http.server 4173 --bind 127.0.0.1
# then open http://127.0.0.1:4173/m1-calendar-shell/
# — defaults to Indigo/Fog. Cycle ?variant= (apple/sage/indigo/plum) and
#   &paper= (cream/linen/blush/fog) to compare against the runners-up.
```

A server on port **4175** may already be running from this session (`lsof -iTCP -sTCP:LISTEN -P | grep 417`) — check before starting a second one on a different port; either works, the prototype has no server-side state.

---

## 4. Standing rules you must not break

### 4.1 GitHub identity — the one that will bite you

**Prefix every single `gh` invocation with `GH_HOST=github.com`. No exceptions, including read-only calls.**

```sh
GH_HOST=github.com gh issue view 187 --repo arunpr614/Life-Reflection
```

Use the `arunpr614` account on `github.com`. Never `daydreamer614`, never `github.toasttab.com`.

### 4.2 Privacy boundary

- Never commit real journal text, real photos, identifiers, credentials, provider responses, or private URLs.
- Fictional fixtures only, everywhere.
- Zero third-party network requests from any prototype. Verified clean for M1 this session (console check, both via `chrome-devtools-mcp` and a second, independent tool — see §6.3).
- Every prototype page carries `<meta name="robots" content="noindex,nofollow,noarchive">`.

### 4.3 Issue hygiene

- Do not touch `phase1` or `phase2` issues or milestones.
- Do not create, rename, or delete labels. The exact current set is in §11.2 — confirmed via `gh label list` just before this handover.
- Do not create or reconfigure project **views**. View 8 is the owner's.
- **Milestone 50 (M1) currently has zero `type:design` issues filed** — confirmed via `gh issue list --milestone` just now. The `type:design`-labeled issues that exist (#156–#172) are legacy "PVA-0xx" generation-0 issues, unrelated to this assignment. Do not confuse them with what you are about to file.

### 4.4 No meta-tooling

Do not build validators, registries, ledgers, councils, dossiers, readiness states, or any code whose purpose is to govern the project. **A live warning, found this session:** the GitHub Project's field list still carries leftover fields named "Architecture plan", "Council decision", and "Task dossier" from generation-0 (confirmed via GraphQL field introspection, §11.3). They exist; do not use them. Setting them would be exactly the kind of governance-over-substance mistake `CLAUDE.md` and the gen0 post-mortem warn about.

### 4.5 Every session ends with something visible

Something the owner can open in a browser and point at.

---

## 5. How you are required to work — `UI-DESIGN-INSTRUCTIONS.md`

Unchanged since the last handover; still 195 lines, still binding. The rule that matters most is still §1's five-step loop (render → screenshot → compare → **list differences in text** → fix, repeat). This session ran that loop dozens of times and it is the reason four real bugs were caught before the owner saw them (§6.4). Do not skip step 4.

---

## 6. What has been done — the session record

### 6.1 Where the session got to, and why it went this way

The previous handover left off with the one-page design system unwritten. This session:

1. Committed the WIP token layer as durability insurance (owner approved).
2. Closed the specimen's open difference list — found and fixed a genuine 375px overflow bug (a `<table>` with `table-layout: auto` refusing to shrink), a toggle/heading collision, a badge/button baseline mismatch, a missing focus ring on a native `<input type="date">`'s shadow-DOM calendar icon, an invisible dark-theme swatch pair, and a thin accessible name.
3. Wrote `docs/design/DESIGN-SYSTEM.md`.
4. **The owner explicitly asked to skip the ASCII-wireframe gate** (`UI-DESIGN-INSTRUCTIONS.md` §2's mandated format for the one-pager's layout section) and go straight to a real interactive M1 prototype. This is a deliberate, owner-directed deviation from the brief's default process, not an oversight — recorded here so it is not "corrected" back.
5. Built M1 as three structurally distinct variants (Contact Sheet / Editorial / Ledger), fully interactive, with a fictional August 2026 archive.
6. **Owner approved Editorial as the shell.** A/C variants' code was then deleted (not archived) — `UI-DESIGN-INSTRUCTIONS.md`'s "dead CSS is a defect" rule, applied to the whole now-unneeded variant axis, not just unused selectors.
7. **Owner asked to experiment with colour**, invoking `frontend-design` and `prototype` skills explicitly. Built and measured four `--brand-hue` themes (apple/sage/indigo/plum).
8. **Owner asked about `#f5f0e7`**, revealing `--paper-hue` had never moved. Built and measured four `--paper-hue` themes (cream/linen/blush/fog) as a second, independent axis.
9. **Owner picked Indigo + Fog.** Promoted both from dropdown options to the actual base tokens, the same treatment apple green got on 2026-08-21.
10. A UX-discoverability bug report ("I can't find the four-colour dropdown") turned out to be real — the colour picker was a floating arrow-bar, inconsistent with the paper picker, which was already a dropdown. Converted it.

Structure and colour are both now owner-decided. What is left is the paperwork (§8).

### 6.2 `prototypes/_shared/tokens.css` — the token layer, current state

**Read this file before changing any colour.** The two-hue-knob architecture (`--brand-hue`, `--paper-hue`) is the whole point of the file — changing one number is supposed to shift a whole family, and it has now done so twice for each knob.

Current decided values, inline for durability:

```css
:root {
  --brand-hue: 255; /* Indigo, decided 2026-08-22. Was 115 (apple), was 171 (v10 forest/teal). */
  --paper-hue: 220; /* Fog, decided 2026-08-22. Was 86 (cream) through both brand-hue rotations. */

  --paper:        oklch(0.956 0.013 var(--paper-hue)); /* #e7f3f7 */
  --paper-raised: oklch(0.994 0.007 var(--paper-hue)); /* #f8feff */
  --ink:          oklch(0.274 0.016 var(--brand-hue));
  --ink-muted:    oklch(0.510 0.016 var(--brand-hue));
  --line:         oklch(0.860 0.020 var(--paper-hue)); /* #c3d4da */
  --line-strong:  oklch(0.771 0.024 var(--paper-hue)); /* #a5b8bf */
  --line-control: oklch(0.620 0.024 var(--paper-hue)); /* #778a90 — measures 3:1 */
  --accent:       oklch(0.50 0.18 var(--brand-hue));   /* #005fc6 — 5.35:1 on paper */
  --focus:        oklch(0.62 0.16 calc(var(--brand-hue) + 3)); /* #4385e5 — 3.23:1 on paper */
}
:root[data-theme="dark"] {
  --paper:        oklch(0.205 0.013 var(--brand-hue)); /* #13181d */
  --paper-raised: oklch(0.240 0.017 var(--brand-hue)); /* #1a2027 */
  --ink:          oklch(0.953 0.009 var(--brand-hue)); /* #ebf0f6 */
  --ink-muted:    oklch(0.792 0.014 var(--brand-hue)); /* #b5bcc4 */
  --line:         oklch(0.362 0.018 var(--brand-hue)); /* #373e47 */
  --line-strong:  oklch(0.479 0.019 var(--brand-hue)); /* #565e68 */
  --line-control: oklch(0.530 0.019 var(--brand-hue)); /* #656d77 — measures 3:1 */
  --accent:       oklch(0.65 0.14 calc(var(--brand-hue) + 7));  /* #5f8de4 — 5.48:1 */
  --focus:        oklch(0.80 0.14 calc(var(--brand-hue) + 10)); /* #91bbff — 9.19:1 */
}
```

Type, spacing, shape, motion tokens are unchanged since first measured (§28.2–28.4 verbatim); not reproduced here, read the file.

**The four-colour and four-paper theme blocks are still in the file**, scoped under `[data-color-theme="X"]` / `[data-paper-theme="X"]`, now redundant with the base for `indigo`/`fog` specifically but left in deliberately so the M1 dropdowns can still switch back to any of the eight options for comparison. Do not delete them without checking whether a future milestone still wants the comparison tool.

### 6.3 Decisions, with the alternatives and why they lost

**Structure — Editorial over Contact Sheet and Ledger.** Owner's direct choice after reviewing all three live. No stated reason recorded beyond the choice itself — if you need the *why*, ask the owner, do not invent one.

**Colour — Indigo over Apple green, Sage, Plum.**
- (a) Apple green — the first rotation off v10. Rejected in favour of Indigo, no reason recorded beyond preference.
- (b) Sage — cooler, lower-chroma green. Same.
- (c) Plum — warm-cool crossover violet. Same.
- (d) Indigo — **chosen.** Notably needed far less chroma correction than apple green did: blue has much more room in the sRGB gamut than yellow-green at the same lightness, so straight hue-rotated values already read as a proper rich blue in both themes, unlike apple green's muddy-olive-until-boosted problem.

**Paper — Fog over Cream, Linen, Blush.**
- (a) Cream (`#f4f0e7`) — the original v10 value, fixed through both colour-hue rotations. Lost once the owner asked what it actually was and opted to open it up.
- (b) Linen — lower-chroma, quieter. Rejected.
- (c) Blush — warm pink undertone. Rejected. Explicitly checked against banned cluster 1 ("cream + terracotta accent") before building — this is the canvas alone, never paired with a terracotta accent, so it does not trip the ban, but the check was made deliberately, not skipped.
- (d) Fog — **chosen.** The one cool paper option; the biggest single departure from "warm paper, cool ink" attempted this session.

**Colour-theme picker mechanism — dropdown over the arrow-bar switcher.**
- (a) The `prototype` skill's floating arrow-bar (`_shared/switcher.js`) — this is what M1 shipped with initially. **Rejected after the owner reported not being able to find it.** Verified first, not assumed: the DOM was correct and the mechanism worked: it was genuinely just the wrong UI pattern for a now-settled four-option choice, inconsistent with the paper picker sitting right next to it as a `<select>`.
- (b) A `<select>` dropdown, same cluster as paper theme — **chosen.** `switcher.js` is untouched and still available in `_shared/` for a future milestone that genuinely needs the "compare radically different live options" pattern; M1 no longer loads it (removed from `index.html`'s script tags).

### 6.4 Bugs found in the session's own work, and the generalised lesson

Four separate rounds of this, each caught by actually rendering the result, not by re-reading the diff:

1. **A `<table>` with default `table-layout: auto` forced ~418px width on a 375px viewport,** because `auto` layout never shrinks a column below its content's minimum width. Found via a from-scratch DOM offender-scan (`getBoundingClientRect().right > innerWidth`), not by eyeballing. Fixed with `table-layout: fixed` under the compact breakpoint. **Lesson: any table in a fixed-width layout needs this checked explicitly; `auto` layout is not "shrinks to fit" by default.**

2. **A CSS cascade-order bug, twice.** First: a `[data-paper-theme="fog"]` rule block didn't exclude `[data-theme="dark"]`, and at equal specificity, source order decided the tie — selecting a paper theme silently broke dark mode's own canvas colours. Confirmed by rendering the combination, not by checking each axis alone. Fixed with `:not([data-theme="dark"])`. **Lesson: a same-specificity rule later in the file wins regardless of what its selector superficially "should" mean — check the actual computed value when two axes can combine, not just each axis independently.**

3. **A hardcoded `padding-top` reservation for a fixed controls bar went stale three times** as the bar's content changed (64px → 100px → 117px, and it was still wrong the third time). Fixed properly on the fourth pass: `app.js` now measures the bar's real `offsetHeight` at runtime into a `--controls-height` CSS custom property, on load and on resize, and the CSS reservation reads that instead of a guessed pixel number. **Lesson: if a magic-number layout reservation has been wrong more than once, the fix is to measure at runtime, not to guess more carefully.**

4. **A native `<select>`'s `scrollWidth`/`clientWidth` do not reveal text truncation** the way they would for a `<div>` — a screenshot showed "Colour: Apple gree…" clipped while the JS properties reported no overflow at all. **Lesson: for native form controls, the screenshot is ground truth; DOM scroll-metrics can mislead.**

5. **A flex item's default automatic minimum width silently caused real horizontal overflow at 320px** — `.month-header .t-month` used `flex: 1` (flex-basis: 0%) but still refused to shrink past its own min-content size, pushing the "Today" button off-screen. Confirmed via `scrollWidth > innerWidth`, the exact same check as bug #1, on a different element. Fixed with the standard `min-width: 0` correction. **Lesson: `flex: 1` alone does not guarantee full shrinkability; test the narrowest width you claim to support, every time a flex row's content changes, even if the row "obviously" isn't the problem.**

### 6.5 A tool evaluation, adopted mid-session

Installed and adopted `playwright-cli` (`npm install -g @playwright/cli@latest`) after a fork researched it against the session's actual pain points (browser-profile locking, screenshot-write sandboxing). Confirmed advantages: independent named sessions (`-s=name`) with zero lock contention, free file writes anywhere Bash can reach, and a `find`/`snapshot` text-query path that is genuinely cheaper than screenshots for structural questions — it is in fact how bug #4 above was caught (a cheap `find` query surfaced malformed text that a screenshot-only pass had missed).

**One workspace-hygiene trap:** `playwright-cli install` and any session command write `.playwright/` and `.playwright-cli/` (logs, snapshots) into whatever directory you run it from. Run it from `Life-in-Days-design/`, not the primary clone — both are gitignored here (`.gitignore` updated this session) but were not always cleaned up promptly; check `git status --short` after any `playwright-cli` session and `rm -rf .playwright-cli .playwright` before committing anything.

**Known gap:** no Lighthouse-equivalent command. Keep `chrome-devtools-isolated` (see below) around for `lighthouse_audit` specifically.

### 6.6 The MCP browser-lock problem, and its permanent fix

Early in this session, `chrome-devtools-mcp`'s default shared browser profile (`~/.cache/chrome-devtools-mcp/chrome-profile`) was locked by other sessions' stale processes. Fixed **permanently, at user scope** (not per-project):

```sh
claude mcp add --scope user chrome-devtools-isolated -- npx chrome-devtools-mcp@1.1.1 --isolated
```

This is saved in `~/.claude.json` and available in every session on this machine going forward, under the tool prefix `mcp__chrome-devtools-isolated__*`. It does **not** override the plugin-provided `mcp__plugin_chrome-devtools-mcp_chrome-devtools__*` tools — they coexist as separate servers; use the isolated one. If you hit the same lock error on the plugin-provided tools, that's expected and not a regression — just use the isolated ones, they were built for exactly this.

---

## 7. What is verified, and what is not

### 7.1 Verified this session, with evidence

- **Every contrast pair for Indigo/Fog**, both themes, measured in `tokens-specimen.html`'s own contrast table after rendering (not calculated by hand): light accent 5.35:1 (need 4.5), light focus 3.23:1 (need 3.0), dark accent 5.48:1, dark focus 9.19:1, `--line-control` 3.19–3.41:1 across both paper/raised and both themes. Largest OKLCH→sRGB drift: 0/255 (the DECIDED hex literals were copied from a live render, not calculated).
- **Lighthouse accessibility / best-practices / agentic-browsing: 100/100/100**, desktop and mobile, on the M1 prototype's default (Indigo/Fog) state, run via `chrome-devtools-isolated` just before this handover.
- **Zero horizontal overflow at 320px, 375px, 1440px** on M1's default state — `scrollWidth === innerWidth` at all three, checked directly, not inferred from a screenshot.
- **Console clean** — only the browser-initiated `favicon.ico` 404 that every page in this project produces; no first-party errors.
- **The dynamic `--controls-height` fix holds across three different widths** with three different wrap counts (47px at 1440, 117px at 375, 152px at 320) — the rail brand clears the fixed bar at all three, confirmed via `getBoundingClientRect()`.
- **The GitHub coordinates in §11 below** — repo, project ID, all field IDs, all option IDs, the label list, view 8 — re-verified via live `gh`/GraphQL calls at this handover's timestamp, not copied from the prior handover.
- **Milestone 50 (M1) has zero filed `type:design` issues** — verified via `gh issue list --milestone`, not assumed from "I don't remember filing one."
- **Issue #195's actual milestone** — verified via `gh issue view`, see §7.3.

### 7.2 Not yet done

- **`docs/design/M1-BUILD-INSTRUCTIONS.md` does not exist.** This is the primary remaining work — see §8.
- **No GitHub design issue for M1.** See §8.
- **No comment posted to #187, #189, or #195** pointing at the approved design.
- A real keyboard tab-through of the *M1 prototype specifically* with a human watching the focus ring has not happened — the keyboard grid navigation (arrows/Home/End/PageUp/PageDown/Enter) was driven programmatically via CDP `Input.dispatchKeyEvent` and confirmed to move focus correctly, which is close but not identical to a human tabbing through and watching the ring render.
- `docs/design/DESIGN-SYSTEM.md`'s palette section was **not** rewritten for Indigo/Fog — it still shows the apple-green values from when it was written. The wireframes and signature-element sections are unaffected by the colour decision and remain current.

### 7.3 A discrepancy worth knowing before you file anything

**Issue #195 ("Calendar grid keyboard navigation: arrows move, Enter opens") is filed under Milestone 51 (M2), not Milestone 50 (M1)** — confirmed via `gh issue view 195 --json milestone` at this handover's timestamp. `docs/HANDOVER-M1-M6-UI-DESIGN.md` §9's M1 section lists it as an M1-feeding ticket ("Feeds tickets: #187 (token layer), #189 (calendar grid), #195 (keyboard nav)"), and the M1 prototype you are about to write build instructions for **does** fully implement that keyboard behaviour. This is carried forward as a fact, not resolved: the M1 prototype's keyboard contract is real and tested regardless of which milestone the ticket is filed under; whether to comment on #195 as part of M1's design handoff despite its M2 milestone tag is a judgement call for you or the owner, not something this handover decides. See open question in §10.

---

## 8. What you should continue on, in order

The owner's own words, verbatim, from immediately before this handover was requested:

> Next step — with Editorial (structure) and Indigo/Fog (colour) both now decided, M1's design is fully specified. Per the process this session has followed throughout, the remaining work to actually close out M1 is:
>
> 1. Write `docs/design/M1-BUILD-INSTRUCTIONS.md` — the handoff doc for whoever implements this for real: the approved variant and why, the tokens verbatim, screen-by-screen DOM/copy notes, state-by-state spec, keyboard contract, responsive behavior, what's server-rendered vs. progressive enhancement, what's faked in the prototype, what's deliberately absent.
> 2. File the GitHub design issue for M1, labeled and added to the project board, referencing tokens.css and this prototype.
> 3. Comment on the implementation issues this design governs (#187 tokens, #189 calendar grid, #195 keyboard nav) pointing at the approved design.
> 4. Only then move on to M2 (Journal Day detail).
>
> Steps 2–3 touch GitHub (visible, shared state), so I'd rather confirm with you before creating anything there.

That confirmation had not yet happened when this handover was written. **Do not create the GitHub issue or post the comments until the owner has explicitly said go**, even though the design decisions themselves (structure, colour) are settled. Treat "the design is decided" and "the paperwork is authorized" as two separate approvals — the brief's own stop rule (§9.1 below) is exactly this distinction.

### Step 1 — Write `docs/design/M1-BUILD-INSTRUCTIONS.md`

Per `docs/HANDOVER-M1-M6-UI-DESIGN.md` §12, in this exact order: (1) the approved variant and why it won, including anything grafted from a losing variant — **note that nothing was grafted this round; Editorial won outright, and Indigo/Fog won outright**, so this section is short, and say so rather than inventing texture; (2) the tokens verbatim, copy-pasteable — use the block in §6.2 above as the current-truth source, not `docs/design/DESIGN-SYSTEM.md`'s stale palette section; (3) screen-by-screen DOM/copy notes; (4) state-by-state spec (the inventory is: populated month, single-populated-day, completely empty month, first-use, loading, failed-to-load, today/future dates, focused/hover/selected tile, dark theme × all of the above); (5) the keyboard contract (arrows, Home/End, PageUp/PageDown, Enter, documented in `app.js`'s `wireEvents()`); (6) responsive behaviour at 375/768/1440, including the `--controls-height` mechanism and why it exists (§6.4 point 3) so the implementer doesn't reintroduce the bug in the real app's own chrome; (7) accessibility requirements and the actual measured contrast numbers from §7.1; (8) server-rendered translation — the app is server-rendered HTML from tagged-template functions, no client framework; say plainly which M1 interactions are real page loads/form posts (month navigation, day selection) versus genuine progressive enhancement (the demo-state and colour/paper dropdowns, which are prototype-only furniture and have no equivalent in the real app at all — say this explicitly so nobody builds a "theme picker" feature that was never real); (9) what the prototype fakes (fixtures, the entire colour/paper dropdown mechanism, synthetic canvas covers); (10) what is deliberately absent and which milestone owns it (Journal Day detail → M2, real photos → M3, upload → M4).

### Step 2 — Ask the owner, explicitly, whether to proceed with GitHub

Not a rhetorical check-in — an actual stop. Show them the build-instructions doc first if you think it helps the decision.

### Step 3 — Only on explicit go: file the M1 design issue

Format, coordinates, and traps are all in §9.3 and §11 below, already verified fresh for this handover. Read §7.3's discrepancy about issue #195 before deciding what to reference.

### Step 4 — Only on explicit go: comment on #187, #189, and (with the owner's input per §7.3) #195

### Step 5 — Only after all of the above: start M2

Read `docs/HANDOVER-M1-M6-UI-DESIGN.md` §9's M2 entry (line ~522) in full before designing anything. M2 gets **2 variants**, not 3 — per §7.3(a) of the brief, the shell is fixed now, later milestones disagree about the new screen, not about the app.

---

## 9. How to behave with the owner

### 9.1 The stop rule is the whole method

This session's own history is the proof: the owner made *five* separate redirect/decision passes after what looked like a finished M1 (variant approval, colour exploration, paper exploration, the colour pick, the paper pick, then a bug report). None of those would have been possible if an earlier agent had ploughed ahead to GitHub issue filing or M2 the moment something looked done. **"Looks complete" is not the same as "the owner has said go" — ask, every time, especially right before an action that touches shared state.**

### 9.2 How to hand work over

Every time: a running URL and the exact command, screenshots, the written difference list, specific trade-off questions (not "thoughts?"). This session's pattern, worth continuing: when the owner reports something as broken or missing, **verify it yourself before either fixing or explaining it away** — twice this session, what looked like it might be "the owner is just missing where the button is" turned out to have a real, previously-unverified bug underneath (§6.4 points 3 and 5). Assume the report is a real defect until you have rendered the counter-evidence yourself.

### 9.3 On GitHub issues

Two lanes, kept separate, per the original brief:

- **The design issue is canonical** — one new issue per milestone, full specification + prototype + screenshots + build instructions.
- **On implementation issues, comment — never rewrite the body.**

**Design issue title format:** `Design — M1 — <the surface, in the owner's words>`, e.g. `Design — M1 — Calendar month view and application shell`.

**Body — the same six-section register as every other ticket:** `## Outcome`, `## Scope`, `## Technical notes`, `## Acceptance criteria`, `## References`, `## Depends on`. Read #197 first as the exemplar (verified still exists, still on-topic, at Milestone 52/M3 — `Ingest: Journal Date inference (filename → EXIF → mtime) with tests`, 4 labels, `status:backlog`/`priority:high`/`phase1.5`/`type:feature`). Aim for 300–700 words.

```sh
GH_HOST=github.com gh issue create \
  --repo arunpr614/Life-Reflection \
  --title "Design — M1 — Calendar month view and application shell" \
  --body-file /tmp/m1-design.md \
  --milestone "Phase 1.5 — M1 — A real month renders in the browser" \
  --label phase1.5 --label type:design --label ui-prototype \
  --label priority:high --label status:backlog
```

**The trap, still live:** `--milestone` takes the full title string, verified exactly above via `gh issue view 187`, not the number.

**The comment on an implementation issue** — short, specific to that ticket, referencing the design issue number, the exact tokens/copy it must use, and which states it governs.

**Getting HTML into a GitHub issue body:** there is an API limitation and a recipe for it in `docs/HANDOVER-M1-M6-UI-DESIGN.md` §11.4 — read that before trying.

### 9.4 The open item list, carried forward

1. `docs/design/M1-BUILD-INSTRUCTIONS.md` does not exist. (§7.2, §8 step 1)
2. No M1 design issue filed; no comments on #187/#189/#195. (§7.2, §8 steps 2–4)
3. `docs/design/DESIGN-SYSTEM.md`'s palette section is stale (apple green, not Indigo/Fog). Low priority — the build-instructions doc is where implementers will actually look for current tokens — but worth a pass if you have a spare cycle, so the one-pager doesn't actively mislead a future reader.
4. Issue #195's milestone mismatch (§7.3) — unresolved, needs the owner's input, not yours to decide.
5. No human-watched keyboard tab-through of M1 specifically (§7.2) — the CDP-driven version is real evidence but not identical to a human watching the ring.

---

## 10. Open questions — surface these, do not decide them

1. **Should the M1 design issue and implementation-issue comments be filed now, or does the owner want to review the build-instructions doc first?** This is §8 Step 2, and it is the most immediate open question — do not resolve it by just filing, and do not sit idle waiting either; ask.
2. **Issue #195's milestone (§7.3).** Comment on it as part of M1's design handoff, leave it for M2's handoff instead, or comment on both — the owner's call.
3. **Does `docs/design/DESIGN-SYSTEM.md` need its palette section rewritten for Indigo/Fog**, or is the build-instructions doc (which will have the current tokens) sufficient, leaving the one-pager as a historical artifact of the apple-green round? Ask rather than guessing which the owner would find more useful.
4. Carried forward from the original brief, still open, still not yours to decide: what the rail should contain from M7 onward as real secondary surfaces arrive (the current rail's "This month" stats + Needs Date Review count is Editorial's answer for now, not a permanent one), and whether the owner wants the gitignored `prototypes/_local-photos/` fallback built so an image-first design can be judged against real photos rather than synthetic canvas gradients.

---

## 11. Metadata — what must be set, every time

### 11.1 GitHub coordinates, re-verified 2026-08-22 17:19 IST (not copied from the prior handover)

| Thing | Value |
|---|---|
| Repository | `arunpr614/Life-Reflection` (private) |
| Project | user project number **1**, "Life Reflection" |
| Project node ID | `PVT_kwHOD9kkX84BgUtf` — confirmed via live GraphQL query |
| Owner login | `arunpr614` |
| The owner's review board | View **8**, "Phase 1.5 Status", `BOARD_LAYOUT`, filter `label:phase1.5` — confirmed via `views` query |
| Milestones | 50 (M1), 51 (M2), 52 (M3), 53 (M4), 54 (M5), 55 (M6) — M1's exact title confirmed via `gh issue view 187` |

It is a **user** project. `gh project` needs `--owner arunpr614`; GraphQL needs `user(login: "arunpr614") { projectV2(number: 1) }`.

**The visibility rule:** an issue appears on view 8 if and only if it carries the `phase1.5` label **and** has been added to project 1. Both.

### 11.2 Labels — the exact current set, verified via `gh label list --limit 100` at this handover's timestamp

```
accessibility, bug, documentation, duplicate, enhancement, good first issue,
help wanted, invalid, mvp, phase1, phase1.5, phase2,
priority:high, priority:low, priority:medium,
question, roadmap,
status:backlog, status:done, status:in-progress, status:next,
type:architecture, type:audit, type:chore, type:design, type:evaluation,
type:feature, type:implementation, type:planning, type:product-definition,
type:quality, type:release-acceptance, type:spike,
ui-prototype,
version:v01 .. version:v35 (missing v17, per the original list),
wontfix
```

**Never apply:** `phase1`, `phase2`, any `version:v*`, `mvp`, `roadmap`. **Never create, rename, or delete a label.** There is `accessibility` but no `type:accessibility` — confirmed still the case.

### 11.3 Project fields — re-verified via live GraphQL introspection, full current list

```
Title, Assignees, Status, Labels, Linked pull requests, Milestone, Repository,
Reviewers, Parent issue, Sub-issues progress, Created, Updated, Closed, Team,
Iteration, Quarter, Start date, Target date, PRD / PID, Design artifact,
Requirement IDs, Evidence, Owner role, Task summary, Priority,
Architecture plan, QA plan, Delivery control, Council decision, Task dossier
```

**The four fields you actually set on a design issue**, with their IDs, confirmed live:

| Field | ID | Type |
|---|---|---|
| Status | `PVTSSF_lAHOD9kkX84BgUtfzhahTpA` | single-select |
| Priority | `PVTSSF_lAHOD9kkX84BgUtfzhah0Eg` | single-select |
| Design artifact | `PVTF_lAHOD9kkX84BgUtfzhahz24` | text |
| Requirement IDs | `PVTF_lAHOD9kkX84BgUtfzhahz28` | text |

| Status option | ID | | Priority option | ID |
|---|---|---|---|---|
| Backlog | `f75ad846` | | High | `665e4024` |
| Next | `b753d38d` | | Medium | `20d2f405` |
| In progress | `47fc9ee4` | | Low | `2c5259bb` |
| Done | `98236657` | | | |

**Ignore** `Architecture plan`, `QA plan`, `Delivery control`, `Council decision`, `Task dossier` — leftover generation-0 fields, confirmed present, not part of this assignment's register. Do not populate them; doing so would be exactly the meta-tooling `CLAUDE.md` bans.

```sh
# add to project (prints the item ID)
GH_HOST=github.com gh project item-add 1 --owner arunpr614 \
  --url https://github.com/arunpr614/Life-Reflection/issues/<N>
```

```graphql
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: "PVT_kwHOD9kkX84BgUtf"
    itemId:    "<ITEM_ID>"
    fieldId:   "PVTSSF_lAHOD9kkX84BgUtfzhahTpA"
    value:     { singleSelectOptionId: "f75ad846" }
  }) { projectV2Item { id } }
}
```

`Labels` and `Milestone` are derived from the issue — set via `gh issue create`/`edit`, never via field mutation.

### 11.4 Metadata inside every prototype file

```html
<!--
  Life in Days — <what this is>
  PROTOTYPE ARTIFACT · fictional data · in-memory only · not production.
  Milestone: <M1 | M2 | …>
  Issue: <#NNN>
  Purpose: <one or two sentences>
  Zero third-party requests. System fonts only.
  Run: cd prototypes && python3 -m http.server 4173 --bind 127.0.0.1
-->
```
```html
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="color-scheme" content="light dark">
<html lang="en-IN">
```

### 11.5 Vocabulary — unchanged, still not negotiable

`reference/CONTEXT.md` (125 lines). The ones that come up constantly: **Journal Day** (not diary entry), **Journal Date** (not upload date), **Needs Date Review** (exact string), **Source Item**/**Uploaded Journal** (not file/attachment), **Daily Photo**/**Photo Caption** (not image/alt text), **Calendar Cover** (not thumbnail), **Trash** (not delete).

---

## 12. Definition of done, per milestone

Every one of these, every time — from `UI-DESIGN-INSTRUCTIONS.md` §9 plus this brief's own additions:

- [ ] Every screen and state in the milestone's inventory is in the prototype and reachable
- [ ] Rendered in a real browser at 375 / 768 / 1440
- [ ] Screenshotted at all three
- [ ] Differences from intent listed explicitly, in text, and the list is empty
- [ ] Keyboard: every control reachable, focus visible, tab order logical
- [ ] No console errors
- [ ] Contrast measured, not eyeballed
- [ ] Zero third-party network requests
- [ ] All copy matches `reference/CONTEXT.md`
- [ ] Nothing from the banned-aesthetics list shipped without a stated reason
- [ ] Fictional fixtures only
- [ ] Owner has reviewed and explicitly approved
- [ ] Design issue filed, labelled, added to project 1, all four fields set
- [ ] `docs/design/M<n>-BUILD-INSTRUCTIONS.md` written and posted to the issue
- [ ] Prototype committed (named paths only)

### 12.1 Verification commands, tested at this handover's timestamp

```sh
cd /Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days-design

# Tested — prints nothing (clean)
git status --short

# Tested — prints the correct identity
git log -1 --format='%an <%ae>'

# Tested — prints "200"
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4175/m1-calendar-shell/
# if that fails (server not running), start one:
#   cd prototypes && python3 -m http.server 4173 --bind 127.0.0.1

# Tested — no third-party requests (prints nothing)
grep -rEo 'https?://[^"'"'"' )]+' prototypes/ | grep -v '127\.0\.0\.1\|localhost'

# Tested — confirms zero type:design issues on milestone 50 (M1) right now
GH_HOST=github.com gh issue list --repo arunpr614/Life-Reflection \
  --milestone "Phase 1.5 — M1 — A real month renders in the browser" \
  --label type:design --json number,title
```

---

## 13. Things about how to work here

1. **The owner will redirect you after "done" looks done, repeatedly, and that is the process working, not a sign you did it wrong.** This session had six distinct redirects after apparent completion (variant pick → colour exploration → paper exploration → colour pick → paper pick → bug report → "is it fixed, what's next" → the colour question that started the paper exploration). Each one produced real, better work. Do not read a redirect as failure; read silence after a hand-off as the only thing that might mean "stop and wait longer."

2. **When the owner reports something as broken, your first move is to verify, not to explain.** Every time this session that happened, there was a real bug underneath — even when the mechanism technically worked (the arrow-bar switcher functioned; it was still the wrong UI). "Technically correct" is not a defense against "the owner can't find it."

3. **A fixed pixel measurement for a dynamic layout element is a bug waiting for the next content change.** This bit the same reservation three times in one session before it was fixed properly (measure at runtime). If you catch yourself writing a second guessed pixel number for something that already needed one guess, that is the signal to stop guessing and measure instead.

---

## 14. Immediate first actions for you

1. Read `docs/HANDOVER-M1-M6-UI-DESIGN.md` in full, if you have not.
2. Confirm `git status --short` in `Life-in-Days-design/` shows nothing (this handover found it clean).
3. Start the server and look at the current M1 prototype yourself:
   ```sh
   cd prototypes && python3 -m http.server 4173 --bind 127.0.0.1
   # http://127.0.0.1:4173/m1-calendar-shell/
   ```
4. Read `prototypes/_shared/tokens.css` in full — it is 270 lines and it is the single source of truth for every colour decision made this session.
5. Write `docs/design/M1-BUILD-INSTRUCTIONS.md` (§8 Step 1).
6. Ask the owner whether to proceed to GitHub (§8 Step 2). **Stop there and wait.**
