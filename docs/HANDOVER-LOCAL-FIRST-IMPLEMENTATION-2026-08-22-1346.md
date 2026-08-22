# Handover — build M1 onward on the owner's Mac as the server

**Written:** Saturday, 22 August 2026, 13:46 IST
**Written by:** the agent that ran the M0.1 hosting deep-research spike (#322) and created milestone M0.2, working from `docs/HANDOVER-MILESTONE-EXECUTION-2026-08-21-1829.md` and then from a new owner brief given verbally on 2026-08-22.
**For:** the implementation agent that writes the first line of application code in this project.
**Relationship to prior documents:** this one changes *where the app runs* and *which milestones come first*. It does not change what gets built. `docs/IMPLEMENTATION-PLAN.md` still governs the stack, the schema, the routes, and the milestone content. `docs/HANDOVER-M1-M6-UI-DESIGN.md` and `docs/HANDOVER-DESIGN-SYSTEM-2026-08-21-1429.md` still govern how UI work is done and record design decisions you must not undo.

Read `docs/IMPLEMENTATION-PLAN.md` first, then this. Where the two disagree on a fact about the world — a path, a branch, a host, a measured number — this document is newer and wins. Where they disagree on *what the job is*, the implementation plan wins. One exception, stated plainly because it is the whole point of this handover: the plan's M6 says "The archive runs on the Hetzner host." Under the current brief, **the host is the owner's Mac** until the owner decides otherwise. See §6.2.

---

## 0. The 60-second version   [REQUIRED]

**Life in Days** is a private, single-user archive of one person's fourteen years of days — a calendar you click into to read a journal entry and see the photo from that day. After two failed generations that produced ~5,800 lines of coordination machinery and zero rendered journal entries, the project was reset. **There is still no application code.** Your job is to write it: milestone M1 (`#184`–`#190`), then M2–M5, running entirely on the owner's Mac as the server.

**Skip M0.1 and M0.2 entirely.** They are host-evaluation milestones for a cloud server you are not deploying to. **Do not touch the Hetzner host** — it is live production for two other real products.

The single most important thing not to do: **do not rebuild the M1 calendar shell from scratch.** An approved, rendered, screenshotted prototype of it already exists in this very working tree at `prototypes/m1-calendar-shell/`, along with a measured OKLCH token layer at `prototypes/_shared/tokens.css`. Lift them. §6.3 and §7.1 say exactly what is approved and what is still open.

---

## 1. Which folder to work in   [REQUIRED]

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days-impl
```

This worktree was created for you at 13:44 IST on 2026-08-22, on a new branch `impl/local-mac-server`, already pushed. It is deliberately seeded with **both** halves of what you need in one tree:

- from `design/m1-m6-prototypes` — the approved M1 prototype, the token layer, `docs/design/DESIGN-SYSTEM.md`, both design handovers;
- merged from `plan/post-m6` — `docs/IMPLEMENTATION-PLAN.md`, `docs/IMPLEMENTATION-PLAN-POST-M6.md`, and the three prior handovers.

`git log --oneline -1` here is `752ee34` (a merge commit). Nothing else in the tree is application code, because none exists yet.

### 1.1 Other directories and what each permits

| Path | What it is | Your access |
|---|---|---|
| `…/Life-in-Days-impl` | **yours.** Branch `impl/local-mac-server` | read/write/commit/push |
| `…/Life-in-Days` | primary clone, branch `spike/m0.1-host-inventory` at `c452ec9`. Holds the owner's five uncommitted files and the M0.1 host inventory | **read only.** Never commit, revert, stage, stash, or clean anything here |
| `…/Life-in-Days-design` | the design agent's worktree, branch `design/m1-m6-prototypes` at `1497027`, clean. Another agent may still be working here | **read only.** Do not commit here. Your tree already contains everything it has |
| `…/Life-in-Days-m0.1-spike` | a parallel agent's M0.1 worktree, branch `spike/m0.1-host-limits` at `5195a23`. Contains a GCP setup guide that §6.5 explains is built on a false premise | read only, and you have no reason to |
| `…/Life-in-Days-archive` | `archive/generation-0` at `fb59c1f` — the cautionary tale. 137 commits, ~5,800 lines of governance code, zero rendered journal entries | read only, and only if you want the history lesson |
| `…/Life-in-Days-hosting-spike` | a **separate clone** (not a linked worktree — no `objects/info/alternates`), branch `spike/m0.1-hosting-research`. Holds `docs/spikes/m0.1/HOSTING-ALTERNATIVES-DEEP-RESEARCH.md` | read only. M0.1/M0.2 material, out of your scope |

### 1.2 Danger zones

**Never enter, and never run any git command inside:**

```
…/Arun_AI_Projects/AI_Life_reflect/
…/Arun_AI_Projects/AI_Life_reflect-phase2-v17-v35/
…/Arun_AI_Projects/AI_Life_reflect-worktrees/
```

These belong to a different, unrelated project. Never run `git worktree prune`, `git clean`, `git reset`, or `rm -rf` inside them or anywhere near them. A `git worktree prune` run from the wrong directory can unlink live worktrees belonging to another project's agents.

**Permission prompts may be disabled in your session.** If they are, the harness will not stop a destructive command; the only guardrail is your own discipline. Before any `rm`, any `git reset`, any overwrite, look at what you are about to destroy.

**The Hetzner host is off-limits.** It is live production for two other real products (an AI Brain unit and one more). Under the current brief you have no reason to touch it at all. Do not SSH to it, do not deploy to it, do not read its config, do not put load on it.

### 1.3 Files that live outside the working tree

Four files exist **only** in the primary clone and are **untracked there** — they live in exactly one directory on one machine. Read them from that path. Do not copy them into your tree, do not commit them, do not modify them.

```sh
# BINDING for any UI work you do. 195 lines. Read it in full before writing markup or CSS.
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days/UI-DESIGN-INSTRUCTIONS.md

# The measured truth about the Hetzner host. Context only — you are not deploying there.
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days/docs/M0.1-HOST-INVENTORY.md
```

The owner also has uncommitted modifications to `CLAUDE.md`, `HANDOVER-PHASE-1.5.md`, and `README.md` in the primary clone. **`CLAUDE.md` in your tree is therefore the older committed version.** Read the primary clone's working copy of `CLAUDE.md` for the current rules; §4 below quotes what matters from it verbatim.

One file *has* been copied for you: `.mcp.json` (8 lines, no secrets — it configures `chrome-devtools-mcp`, which is your eyes for UI work). It is untracked in your tree, deliberately. **Do not commit it.**

---

## 2. What the git tree should be   [REQUIRED]

### 2.1 Current state, verified 2026-08-22 13:44 IST

```
$ git -C …/Life-in-Days-impl branch --show-current
impl/local-mac-server

$ git -C …/Life-in-Days-impl log --oneline -4
752ee34 Merge plan/post-m6: bring the planning and handover docs into the implementation tree
1497027 Four measured paper themes — the one hue that never moved until now
a031b75 Four measured colour themes on the fixed Editorial shell
a13a488 Rotate palette to apple green; approve M1 shell as Variant B (Editorial)

$ git -C …/Life-in-Days-impl status --short
?? .mcp.json

$ git remote -v
origin  https://github.com/arunpr614/Life-Reflection.git (fetch)
origin  https://github.com/arunpr614/Life-Reflection.git (push)

$ git config user.name && git config user.email
Arun Prakash N
arunpr614@users.noreply.github.com
```

Branch topology — both parents descend from `plan/implementation` at `b86191d`, and `docs/IMPLEMENTATION-PLAN.md` is byte-identical on both (blob `60ee7d9`), so the merge was clean and touched four files only:

```
b86191d plan/implementation ── 1497027 design/m1-m6-prototypes ─┐
                            │                                   ├─ 752ee34 impl/local-mac-server (you)
                            └── 8a85347 plan/post-m6 ───────────┘
```

**`main` is at `53d2e5a` and has no `docs/` directory at all.** Everything — every plan, every handover, every prototype — lives on unmerged branches. `main` is 19 commits behind. Do not try to "fix" this; it is the owner's merge decision.

All worktrees, for orientation:

```
…/Life-in-Days             c452ec9 [spike/m0.1-host-inventory]
…/Life-in-Days-archive     fb59c1f [archive/generation-0]
…/Life-in-Days-design      1497027 [design/m1-m6-prototypes]
…/Life-in-Days-impl        752ee34 [impl/local-mac-server]   ← yours
…/Life-in-Days-m0.1-spike  5195a23 [spike/m0.1-host-limits]
```

Plus the separate clone `…/Life-in-Days-hosting-spike` on `spike/m0.1-hosting-research`, which `git worktree list` will not show because it is not a linked worktree.

### 2.2 Uncommitted work

**Nothing of the deliverable is uncommitted.** Your tree is clean apart from the untracked `.mcp.json` described in §1.3, which must stay untracked.

Two things elsewhere are at risk and are **not yours to rescue**:

1. `UI-DESIGN-INSTRUCTIONS.md` — 195 lines, binding, untracked, exists in exactly one working tree. Whether to commit it is an open owner question (§10, Q4). Until they answer, read it from the primary clone and leave it alone.
2. The owner's modifications to `CLAUDE.md`, `HANDOVER-PHASE-1.5.md`, and `README.md` in the primary clone. Leave them.

### 2.3 Git rules

Quoted from `CLAUDE.md`, which is binding:

> **Always use the `arunpr614` account (`github.com`) for this repository.** Never use the `daydreamer614` / toasttab.com (`github.toasttab.com`) account for any GitHub operation in this project — e.g. pass `GH_HOST=github.com` to `gh`, and use the `github.com` remote/credentials for git operations. This covers the **commit author identity**, not just the API account.

> **Never force-push `main`.** Branch protection blocks force-push and deletion on `main`. Feature branches you own are yours to amend and force-push (prefer `--force-with-lease`).

Concretely:

- Every `gh` invocation gets `GH_HOST=github.com`. Every one. The employer's GitHub Enterprise host is also authenticated on this machine and `gh` will happily pick it.
- Check `git log -1 --format='%an <%ae>'` before pushing. It must read `Arun Prakash N <arunpr614@users.noreply.github.com>`. The two fresh-start commits on `main` (`d85561e`, `53d2e5a`) carry the old address and are deliberately left alone.
- **Never `git add -A`, `git add .`, or `git commit -a`.** Name every path explicitly. Adjacent worktrees share this repository and other agents' untracked files are one careless glob away from your commit.
- Push after every commit, so nothing exists only on this machine.
- Do not open a PR unless the owner asks. Do not merge anything into `main` yourself.
- Do not rebase `impl/local-mac-server` onto `main`, and do not merge `main` into it unless something on `main` actually breaks you. Your branch carries the design branch's commits by design; when a PR is eventually opened, its body should say so in one line.

---

## 3. Every resource file, and what each is for   [REQUIRED]

### 3.1 Read fully before starting

| File | Lines | Why |
|---|---|---|
| `docs/IMPLEMENTATION-PLAN.md` | 315 | **The controlling build document.** Stack (§2), data layout (§3), photo ingest (§4), schema (§5.1), the redate transaction (§5.2), Journal Date derivation (§5.3), routes (§5.4), escaping (§5.5), CSS (§5.6), milestones (§6), the out-of-scope list (§7), real risks (§8) |
| `docs/design/DESIGN-SYSTEM.md` | 126 | The one-page design system. Colour, type, layout wireframes M1–M6, the signature element. **§6.4 records that its colour table is now stale** — read it for structure and type, not for hex values |
| `reference/CONTEXT.md` | — | **The copy specification, not a glossary.** Every domain term with a binding `_Avoid_:` list. Used verbatim in identifiers, labels, headings, buttons, and error strings |
| `…/Life-in-Days/UI-DESIGN-INSTRUCTIONS.md` | 195 | Binding for any markup or CSS you write. §1 is the verification loop; §3 the banned aesthetics; §9 the ten-item definition of done. Path is outside your tree — see §1.3 |
| this file | — | — |

### 3.2 Navigate, do not read cover to cover

**`docs/IMPLEMENTATION-PLAN-POST-M6.md`** (659 lines) — the M7–M19 plan. You are not building any of it. Read exactly two things: **§5** (line 514, one paragraph per milestone) so you know what the schema you are about to write has to survive, and **§7.8** (line 623) on the shared Hetzner host. Everything else is a distraction until M6 is behind you.

**`docs/HANDOVER-M1-M6-UI-DESIGN.md`** (996 lines) — the design agent's brief. Two sections are directly yours:
- **§12** (line 873) — "The build instructions — what the implementation agent needs." This is the ten-point contract for what a design handover owes *you*. **It has not been delivered for M1** (§7.2). Read §12 so you know what to ask for.
- **§6** (line 269) — "Design decisions already made — do not relitigate these."

Sections **§9** (line 491) hold the per-milestone design intent for M1–M6; read the M1 entry (line 495) before building the calendar.

**`docs/HANDOVER-DESIGN-SYSTEM-2026-08-21-1429.md`** (865 lines) — the token layer's session record. Read **§6.2** (line 328, the tokens and why there are two hue knobs), **§6.3** (line 379, the `--line-strong` decision — the single most undo-able decision in the project), **§6.4** (line 392, a measurement harness that was lying), **§7.1** (line 465, twelve measured contrast ratios), and **§7.3** (line 499, two UA-supplied constraints that will bite you at M1 and M5).

**`reference/UX-SPECIFICATION.md`** — the UX contract. Navigate by section: §4.2 compact rules, §9 the Journal Day page, §25 responsive bands (compact 320–599, medium 600–1023, wide ≥1024), §26 accessibility contract, §28.2–28.4 type/spacing/motion scales. **§28.1's palette is SUPERSEDED** by the prototype-v10 decision (implementation plan §8.1) and then again by the apple-green rotation (§6.4 below). **`WF-01`'s ban on a persistent navigation rail is SUPERSEDED** by the same decision.

**`reference/PRODUCT-REQUIREMENTS.md`** — describes the *finished* system. Roughly 80% of its requirement IDs are out of your scope. Implementation plan §8.3 names reading it while writing code as a live risk, because it exerts constant pull toward building the whole thing. Cite requirement IDs from it; do not take scope from it.

### 3.3 Read on demand

- `reference/PRINCIPLES.md` — data-handling rules carried over from the original plan
- `reference/prototype-v10/` — the owner's tenth iteration, ~8,000 lines of CSS across four files. **Mine it, do not inherit it** (implementation plan §8.7). Run it with `python3 -m http.server 4173 --bind 127.0.0.1 --directory reference/prototype-v10`, then `http://127.0.0.1:4173/index.html?view=calendar&month=2026-08`
- `docs/HANDOVER-MILESTONE-EXECUTION-2026-08-21-1829.md` (476) — how the 36 M1–M6 issues were written and what the tracker conventions are
- `docs/HANDOVER-M7-M19-TICKETING.md` (762) — how the M7–M19 issues were written
- `docs/HANDOVER-POST-M6-PLANNING-2026-08-21-1458.md` (681) — how the post-M6 plan was reasoned
- `RESET-DECISION.md` — why this project was reset, and the one-sentence definition of done
- `archive/generation-0` worktree — 137 commits of what not to do

### 3.4 Reference material / prior art — values already extracted

So you do not re-derive them.

**The token layer** — `prototypes/_shared/tokens.css`, 283 lines, in your tree. Two hue knobs, deliberately not one:

```css
--brand-hue: 115; /* apple green: accent, focus, ink, lines in dark theme */
--paper-hue: 86;  /* warm paper: canvas, raised surfaces, light lines */
```

Light theme as committed:

```css
--paper:        oklch(0.956 0.013 var(--paper-hue)); /* #f4f0e7 canvas */
--paper-raised: oklch(0.994 0.007 var(--paper-hue)); /* #fffdf8 cards, media frames, dialogs */
--ink:          oklch(0.274 0.016 var(--brand-hue)); /* #272820 the work: journal prose, dates */
--ink-muted:    oklch(0.510 0.016 var(--brand-hue)); /* #65675d the margin: provenance, meta */
--line:         oklch(0.860 0.020 var(--paper-hue)); /* #d7d0c3 tonal separation, decorative */
--line-strong:  oklch(0.771 0.024 var(--paper-hue)); /* #bbb4a4 a visible edge, not a control */
--line-control: oklch(0.620 0.024 var(--paper-hue)); /* #8d8576 form-control borders ONLY — 3:1 */
--accent:       oklch(0.50 0.16  var(--brand-hue)); /* #596e00 primary action + selection, 5.05:1 */
--focus:        oklch(0.60 0.15  calc(var(--brand-hue) + 8)); /* #708e00, 3.32:1 on paper */
--ink-on-accent: oklch(0.994 0.007 var(--paper-hue));
--scrim-media:   oklch(0.20 0.010 var(--brand-hue) / 0.55);
```

Dark theme (`:root[data-theme="dark"]`) re-derives `--paper`/`--paper-raised`/`--ink`/`--line*` from `--brand-hue`, not from `--paper-hue` — that is why the paper-theme selector is light-only, and it is intentional, not a bug.

Also in the file: the UX §28.2 type scale verbatim, §28.3 spacing and shape scales, §28.4 motion with a `prefers-reduced-motion` override to 1ms, `--measure: 66ch`, `--rail-width: 238px`, `--margin-width: 300px`. **Deliberate omissions:** no `--danger`/`--warning`/`--success` until M4 where the first error state appears; `Inter` deliberately not referenced (v10 names it first but does not host it, so it either silently falls back or costs a forbidden third-party request).

**One stated exception to the §28.2 scale:** `--text-month: clamp(2.75rem, 5vw, 4.25rem)`. The Calendar's month title is the archive's anchor. Nothing else exceeds the display role.

**Type:** display is **Georgia** (`Iowan Old Style`, `Palatino` fallback) — chosen because its default figures are already old-style, so date numerals across 31 tiles sit inside the line instead of shouting, and because it is system-available (no third-party font request). UI font is the system sans stack.

**Layout constants:** persistent 238px rail + main region. Selecting a day compresses the grid left (~490px) and opens two columns — work (centre, display serif, 66ch measure) and margin (right, 300px, UI sans at meta size). That grid → work → margin pattern repeats through every later milestone instead of introducing new page shapes.

### 3.5 Work produced this session

No application code. Three things:

1. **This worktree and branch** — `impl/local-mac-server` at `752ee34`, pushed to `origin`.
2. **GitHub milestone 70 — `Phase 1.5 — M0.2 — Prove the Hetzner + R2 architecture before committing to it`** with 24 issues, `#325`–`#348`. **You are skipping all of it.** It exists so that when the owner decides to migrate to a cloud host, the research is already specified. `#345` is the go/no-go and depends on the other 23.
3. **`docs/spikes/m0.1/HOSTING-ALTERNATIVES-DEEP-RESEARCH.md`** in the separate `…/Life-in-Days-hosting-spike` clone — the #322 deliverable, including the §9.3 GCP comparison summarised in §6.5 below.

To see the approved M1 prototype — **tested, works from this tree**:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 \
  --directory /Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days-impl/prototypes
# then: http://127.0.0.1:4173/m1-calendar-shell/?variant=apple
#       (also sage | indigo | plum; &paper=cream|linen|blush|fog)
#       http://127.0.0.1:4173/_shared/tokens-specimen.html
```

Use `--directory` with an absolute path rather than `cd prototypes && python3 -m http.server`. The prototype loads shared files from `_shared/` one level up, so serving from *inside* `m1-calendar-shell/` 404s everything; and `cd` inside a compound command is unreliable in this harness.

---

## 4. Standing rules that must not be broken   [REQUIRED]

Quoted from `CLAUDE.md` rather than paraphrased. Read the primary clone's working copy too, since the owner has uncommitted edits to it (§1.3).

> ## No meta-tooling
>
> Do not build validators, registries, ledgers, councils, dossiers, readiness states, or any code whose purpose is to govern this project. If a change doesn't move pixels or data for the single user, don't make it. This project's history (see `archive/generation-0` and the `gen0-final` tag) is a cautionary example of what happens when this rule is ignored: 137 commits and ~5,800 lines of coordination code, zero rendered journal entries.

> ## Every session ends with something visible
>
> Every commit must leave the app runnable. Every working session should end with something visible in the browser — a real change you can point at, not a plan for one.

> ## UI and design work
>
> Before writing any markup, CSS, or prototype, read `UI-DESIGN-INSTRUCTIONS.md`. It is binding. The short version: never ship a UI change you haven't rendered, screenshotted, and compared against intent with the differences written out.

> ## Privacy boundary
>
> Never commit real journals, photos, identifiers, credentials, provider responses, or private URLs. Real data lives under `data/`, which is gitignored. See `reference/PRINCIPLES.md` for the fuller data-handling rules carried over from the original plan.

The migration runner in implementation plan §2 is explicitly the **only** infrastructure code this project authorises: "a ~30-line runner that records applied names in a `schema_migration` table. That is a runner, not a framework." Anything beyond that trips the no-meta-tooling rule.

**Secrets that must never appear in a commit, an issue, or a comment**, carried forward from prior handovers: the Cloudflare Tunnel UUID, the contents of `tunnel-creds.json`, the B2 bucket name, the GPG recipient identity, and the Hetzner host's IP address. The IP has been kept out of every committed file to date; keep it that way.

`data/` is gitignored, as are `*.sqlite`, `*.sqlite3`, `*.db`, `node_modules/`, `dist/`, `build/`, `.env*`, `*.pem`, `*.key`. Verified by reading `.gitignore` — implementation plan §3's layout needs no new ignore entries, and issue `#184` says so explicitly ("don't duplicate entries").

**Fixtures are fictional. Always.** The seed script (`#188`) and every prototype use invented journal text and synthetic imagery. The owner's real journals and photos go only under `data/`, never into `fixtures/`.

---

## 5. How you are required to work

### 5.1 The verification loop, for any UI change

`UI-DESIGN-INSTRUCTIONS.md` §1, near-verbatim, and it is the one rule agents skip:

1. Render it in a real browser.
2. Screenshot it.
3. Compare against the intent — a reference image, a prior screenshot, or the written spec.
4. **List the differences explicitly, in text.**
5. Fix them. Repeat until the list is empty.

> Step 4 is the one agents skip. Write the differences out. "Looks good" is not a comparison; it is a refusal to compare.

Your eyes are `chrome-devtools-mcp`, already configured via the `.mcp.json` copied into your tree. **Efficiency rule:** use `take_snapshot` (accessibility tree, ~2–5KB) for structural and semantic questions; use `take_screenshot` (500KB+) only when the question is genuinely visual. Do not screenshot to check whether a heading exists.

The ten-item definition of done from §9 of that document applies to every UI change: rendered, screenshotted, compared with differences listed in text, differences fixed and loop re-run, checked at 375/768/1440, keyboard-tabbed with focus visible, no console errors, copy from `CONTEXT.md`, nothing from the banned list without a stated reason, fixtures fictional.

### 5.2 Banned aesthetics

Three clusters, from `UI-DESIGN-INSTRUCTIONS.md` §3, none of which you may produce:

1. Cream `#F4F1EA` background + high-contrast serif + terracotta accent.
2. Near-black background + a single acid-green or vermilion accent.
3. "Broadsheet": hairline rules everywhere, zero border-radius, dense justified columns.

Note that this project's design sits deliberately *near* clusters 1 and 2 and steps away from each on purpose — warm paper with a green accent, dark theme in deep green-tinted ink rather than near-black, desaturated rather than acid. §6.3's `--line-control` decision is specifically the escape from cluster 3. If you find yourself darkening tile borders "so the grid reads better," you are walking back into it.

Also banned without a stated reason: gradients as decoration, glassmorphism, emoji as iconography, uniform `border-radius: 8px`, scroll-triggered or entrance animation, hover lifts on every card, `01 / 02 / 03` section markers. On motion: **extra animation is itself a tell that a design was AI-generated.** Default to none.

### 5.3 Tests

`node:test` + `node:assert`, zero dependencies. Not everything needs a test; three things do, per implementation plan §5.3, §5.2, and §4:

- `src/domain/journal-date.ts` — the midnight boundary at 23:59 and 00:01 IST, the same instants expressed in UTC and US-Pacific, and future-date exclusion. IST is UTC+05:30 year-round with **no DST**, which removes the whole class of ambiguous-local-time bugs; what remains is reading a `YYYY-MM-DD` from a filename and treating it as an instant, or letting a browser's timezone leak into a Journal Date.
- `src/domain/redate.ts` (M5) — every branch. This is the one piece of domain logic where a bug silently misfiles a memory, which is the failure the whole product exists to prevent.
- The ingest date-inference chain and SHA-256 dedup (M3) — tested **ahead of and independent from** the rest of M3, per the owner's 2026-08-20 decision, because it is the one place the plan invents behaviour rather than implementing it.

---

## 6. What has been done — the session record   [REQUIRED]

### 6.1 Where the session got to, and why it went that way

This session did not write code, and the obvious first step — start M1 — was not the first step, for a reason worth recording. The session began as an M0.1 hosting spike: the owner asked for deep research into alternatives to the Hetzner server, cheapest option, free tiers included, Oracle excluded. That produced `HOSTING-ALTERNATIVES-DEEP-RESEARCH.md`. The owner then asked for the "Hetzner + R2" architecture to be turned into a proper exploration milestone, which produced milestone 70 and issues `#325`–`#348`.

Then the brief changed, and it changed in the right direction: **build it on the Mac first, and defer the entire hosting question.** That is a better plan than what preceded it, because every hosting milestone written so far — M0.1, M0.2, M6 — evaluates a host for an application that does not exist and whose real resource profile nobody has measured. `#325` (measure the real photo corpus) and `#326` (SQLite + FTS5 footprint at full scale) are both blocked on data only a running application produces. Building locally first turns those from research spikes into observations.

So this session's output is: the M0.2 milestone parked for later, this worktree created, and this document.

### 6.2 The brief, and exactly what it changes

**The brief, as given:** skip M0.1 and M0.2; start building from M1; build everything locally using the owner's Mac as the server; when a later milestone is identified as the right point to migrate to a cloud host, pick M0.2 up then and decide how.

What that changes, concretely:

| | Before | Now |
|---|---|---|
| First work | M0.1 (milestone 69, `#316`–`#324`) | **M1 (milestone 50, `#184`–`#190`)** |
| Host | Hetzner shared VPS, Helsinki | **the owner's Mac** |
| M0.2 (milestone 70, `#325`–`#348`) | next after M0.1 | **parked.** Picked up when the owner names the migration milestone |
| M6 (`#215`–`#219`) | "The archive runs on the Hetzner host" | needs reinterpretation — see below |
| Everything else | unchanged | unchanged |

**M1–M5 are host-agnostic and need no reinterpretation at all.** Verified by reading their 31 issues: they are Node, TypeScript, Fastify, `better-sqlite3`, the local filesystem, and `sharp`. Nothing in them names a host, a systemd unit, a tunnel, or a cloud service. This is the single most useful fact in this handover — **you can build M1 through M5 to completion without any hosting decision being made.**

**M6 is the milestone that changes**, and you should not touch its issues without the owner. Its five tickets are:

| # | Title | Under local-first |
|---|---|---|
| 215 | Production build + process supervision | build is unchanged; supervision becomes `launchd` rather than systemd |
| 216 | Cloudflare Tunnel + Access in front of the origin; origin bound to loopback | works from macOS, but only while the Mac is awake and online |
| 217 | Backup script: copy the SQLite file and the originals directory | unchanged, and arguably easier |
| 218 | Documented, rehearsed restore procedure | unchanged, and still mandatory |
| 219 | First deployment + live smoke check from the owner's phone | this is the ticket that actually forces the host question |

Do not rewrite, retitle, or re-milestone any of these. Filing or editing tracker items is an owner decision (§9.3). Raise it as Q1 in §10 when you get there.

**Which milestone is the migration point?** This is the owner's call and §10 Q1 carries it. But the analysis is done, so you do not have to redo it — read `docs/IMPLEMENTATION-PLAN-POST-M6.md` §5 and you get:

- **M7** (Search + Almanac) — "Depends on: nothing outside M1–M6." The last milestone with zero host requirements. Purely local.
- **M8** (Telegram photos) — needs the internet to reach the app. Telegram long-polling works from a Mac behind NAT with no inbound port, so this is *possible* locally, but it needs a machine that does not sleep. **This is the first milestone where a laptop is the wrong shape of computer.**
- **M9** (VoiceNotes) — needs an inbound webhook. Structurally requires always-on reachability.
- **M10/M11** (AI text and artwork) — need a reliable scheduler; a sleeping Mac silently skips runs.
- **M14** (Storage grows without ever surprising you) — this is where **Cloudflare R2 formally enters the plan** (`LID-OPS-006`, `LID-OPS-007`). M0.2's subject matter lands here.

**My recommendation, offered as a recommendation and not a decision: build M1–M7 on the Mac, run M0.2 during M7, and migrate before M8.** Reasoning: M7 is the last milestone that asks nothing of the host, and M8 is the first that starts accumulating *real photos from the owner's phone* — you do not want that corpus growing on a machine you already intend to migrate off. By M7 you will also have the two measurements M0.2's `#325` and `#326` are currently blocked on. M14 is where R2 is *needed*, but M0.2 decides the whole host architecture, not just object storage, and that decision wants to be made before capture goes live rather than after.

### 6.3 Design decisions already made — do not relitigate

Each of these was reasoned once, expensively. A decision recorded without its rejected alternatives gets undone by the next agent who sees the result and "fixes" it, so the alternatives are here.

**(1) Palette and structure — decided 2026-08-20.**
- (a) UX §28.1's palette — warm brown `#70543D` accent, blue `#175CD3` focus, no navigation rail. *Rejected.*
- (b) prototype-v10 — green accent, green focus, persistent 238px rail. **Chosen.** The owner had iterated ten times on v10; a side-by-side prototype (`prototype/palette-comparison`, never merged) was built to compare them as pixels rather than in the abstract.

This **overrides `WF-01`'s explicit ban** on a persistent primary-navigation rail. That wireframe rule is superseded for v0.1 by this decision — superseded deliberately, not silently ignored.

**(2) The M1 shell — Variant B, "Editorial", approved 2026-08-21.** Date numeral above an inset cover card, title beneath it; rail carries a live stats block and the Needs Date Review count. Rendered, screenshotted, and approved by the owner. **That structure is fixed.** Three variants were built; the other two lost. It is running in your tree right now — go look at it before you write any markup.

**(3) `--line-strong` cannot be a control boundary — measured, not assumed.** `--line-strong` on `--paper` measures **1.70:1** light and **2.66:1** dark. WCAG 1.4.11 and `UX-A11Y-10` require **3:1** for anything needed to identify a control or its state. A calendar tile *is* a control, so:
- (a) Darken `--line-strong` until it passes — about 0.62 L gets there. But it borders 31 tiles, and a grid of hard rules everywhere is precisely the broadsheet pastiche the banned list forbids. **Rejected.**
- (b) Stop asking the resting border to be the affordance. A tile is identified by its **content** — the date numeral at 13.00:1, the title in the display serif — and by its interactive **states**: hover, focus, selected, carried by `--accent` (7.09:1) and `--focus` (4.82:1). The border becomes decorative tonal separation, and 3:1 does not apply to it. **Chosen.** It also matches v10, whose tile borders are fainter still.

Consequence: real form controls **do** need a 3:1 border, because there the border is the thing that says "type here." That is what `--line-control` is for, and it is used on nothing else. **The reasoning is a comment block in `tokens.css` at the token definitions. Keep it there.**

**(4) `.md` renders as source text, not interpreted Markdown** (implementation plan §5.5). The spec permits either. Source text removes a Markdown parser and a sanitizer from the dependency list and removes the entire class of sanitizer-bypass bugs. Rendered Markdown is a later, separate increment.

**(5) Photo ingest is a local `npm run ingest` command** — approved as designed 2026-08-20. Not Telegram, not web upload. UX §9.6 says the web product does not upload Daily Photos in MVP, and Telegram is out of v0.1, so the specified photo path is closed and something had to fill the gap. Ingest **copies, never moves**; `data/media/originals/<sha256>` is written once per hash and never modified; Trash marks rows, it does not unlink files; **no `rm` anywhere in the ingest path.** Photo bytes are the only unrecoverable asset in the system — the database can be rebuilt from the originals, the originals cannot be rebuilt from anything.

**(6) Four tables in v0.1, deliberately not three.** The PRD is emphatic: "Do not collapse source text and AI output into one mutable entry row." Even with no AI in v0.1, `journal_day` / `source_item` / `source_revision` / `media_asset` stay separated, because merging them later is a rewrite and separating them now is free. `private_image_description` exists from day one even though nothing sends anything anywhere yet — it is the column that makes "real photos never receive AI-generated descriptions" enforceable later, and it costs one line.

### 6.4 A discrepancy you will hit in the first hour

**`docs/design/DESIGN-SYSTEM.md`'s colour table is stale.** It lists `--accent: #255949` (forest green) and was written against `--brand-hue: 171`. The committed `prototypes/_shared/tokens.css` is `--brand-hue: 115` with `--accent: #596e00` — apple green. Commit `a13a488` is titled "Rotate palette to apple green."

**`tokens.css` is the newer artifact and the one that has been rendered and measured. Trust it over the prose.** The `DESIGN-SYSTEM.md` sections on type, layout, the signature element, and the self-critique are still current; only the colour hex values moved.

And the colour is **not settled** — see §7.2. Four `--brand-hue` candidates (apple, sage, indigo, plum) and four `--paper-hue` candidates (cream, linen, blush, fog) are built, measured, and screenshotted, awaiting the owner. This does **not** block you: the token layer is variable-driven, so the final choice is a one-line change to each of two custom properties. Build against the committed defaults and say so.

### 6.5 One earlier finding worth carrying, so nobody re-argues it

The parallel M0.1 worktree contains a 236-line guide to setting up **GCP's Always Free e2-micro** as the host. It is built on a false premise, and this was verified against Google's own rendered pricing pages rather than the free-tier page:

**GCP's "Always Free" e2-micro is not free.** The instance, the 30 GB standard disk, and 1 GiB of egress are free. **The external IPv4 address it needs to be reachable is not** — `$0.005/hour`, about **$3.65/month**. That charge is documented on the VPC network-pricing page and absent from the free-tier page, which is why two independent surveys both missed it. Costed properly, e2-micro plus R2 for photos comes to **~$3.89–4.28/month** against **$0.24–0.63/month** for staying on the already-paid-for Hetzner host with R2. It is also 1 GB RAM against 3,819 MB measured in use, 0.25 baseline vCPU, HDD-backed disk, US-regions-only (measured 210–240 ms from Bengaluru against today's 177 ms), and revocable on 30 days' notice.

If anyone proposes GCP Always Free as the migration target, that is the number to put in front of them. It loses to a cheap paid VPS on every axis, price included.

---

## 7. What is verified, and what is not   [REQUIRED]

### 7.1 Verified

**The Mac can be the server. Measured on this machine, 2026-08-22:**

| Thing | Value | Verdict for the plan's stack |
|---|---|---|
| `node --version` | **v22.22.3** | matches the Node 22 LTS the plan pins |
| `npm --version` | 10.9.8 | fine |
| Node install path | `/opt/homebrew/opt/node@22/bin/node` (Homebrew `node@22`) | fine |
| Architecture | **arm64** (Apple Silicon) | `better-sqlite3` ships prebuilt darwin-arm64 binaries for Node 22 — expect no compile |
| macOS | **26.6.2** (build 25G83) | fine |
| Xcode Command Line Tools | present, `/Library/Developer/CommandLineTools`, Apple clang 21.0.0 | node-gyp fallback available if a prebuild is missing |
| `sqlite3` CLI | 3.51.0 (system, `/usr/bin/sqlite3`) | useful for inspecting the DB by hand. `better-sqlite3` bundles its own SQLite with FTS5, so the system version does not gate M7 |
| `python3` | present, `http.server` importable | the prototype-serving loop works |
| Disk free | **432 GiB** on the data volume | the plan's 26–52 GB photo estimate is not a constraint locally |
| `git` | `/usr/bin/git` | fine |

**Git state** — every figure in §2.1 came from running the command shown, not from memory.

**The approved M1 prototype renders from this tree.** Served with the `--directory` command in §3.5 and loaded in a real browser at 13:45 IST. All five assets return 200 (`/m1-calendar-shell/?variant=apple`, `_shared/tokens.css`, `_shared/tokens-specimen.html`, `m1-calendar-shell/variants.css`, `m1-calendar-shell/app.js`). Screenshot taken and inspected: rail with "Life in Days", Calendar nav item, `THIS MONTH — 19 journaled days · 31 photos`, `Needs Date Review 2` badge; "August 2026" in Georgia at display size; 7-column Monday-first grid; tiles showing inset cover cards with titles beneath; the 21st outlined in accent green as today. `list_console_messages` returned exactly one error — a 404 on a browser-initiated `favicon.ico`, already documented in the design handover §7.1 as expected.

**Contrast, twelve pairs, both themes, measured in a real browser** by the design agent (their §7.1, reproduced because it is the evidence behind decision 6.3(3)):

| Pair | Need | Light | Dark |
|---|---|---|---|
| `--ink` on `--paper` | 4.5:1 | 13.00 ✓ | 15.60 ✓ |
| `--ink` on `--paper-raised` | 4.5:1 | 14.54 ✓ | 14.27 ✓ |
| `--ink-muted` on `--paper` | 4.5:1 | 5.03 ✓ | 9.36 ✓ |
| `--ink-muted` on `--paper-raised` | 4.5:1 | 5.62 ✓ | 8.56 ✓ |
| `--accent` on `--paper` | 4.5:1 | 7.09 ✓ | 7.85 ✓ |
| `--ink-on-accent` on `--accent` | 4.5:1 | 7.93 ✓ | 7.85 ✓ |
| `--focus` on `--paper` | 3.0:1 | 4.82 ✓ | 12.00 ✓ |
| `--line-control` on `--paper` | 3.0:1 | **3.21 ✓** | **3.43 ✓** |
| `--line-control` on `--paper-raised` | 3.0:1 | **3.59 ✓** | **3.14 ✓** |
| `--line-strong` on `--paper` | — | 1.81 tonal only | 2.75 tonal only |
| `--line` on `--paper` | — | 1.35 tonal only | 1.68 tonal only |

Note these were measured against the **forest** palette (`--brand-hue: 171`). The apple-green rotation carries its own measured values in `tokens.css`'s comments (`--accent` 5.05:1, `--focus` 3.32:1 on paper) but the full twelve-pair table has **not** been re-run for apple. Treat the two `--line-control` rows as still valid — they derive from `--paper-hue`, which did not move.

**Zero third-party network requests** in the prototypes, verified by the design agent. Keep it that way; it is a privacy property (`UX-PRIV-04`), not a performance one.

**Tracker state** — milestones 50–70 and the issue lists in §11.1 were read from the GitHub API this session with `--paginate`, not recalled.

### 7.2 Not yet done

Split honestly. Several of these look fine and were never actually checked.

1. **No application code exists.** No `package.json` on any branch, no `src/`, no `migrations/`, no `fixtures/`, no `data/`. Zero of the 36 M1–M6 issues are closed. You are writing commit one.
2. **The colour theme is not approved.** Shell is approved; `--brand-hue` and `--paper-hue` are not. Eight candidate renders are committed as screenshots. This is §10 Q2 and it is an owner decision.
3. **`docs/design/M1-BUILD-INSTRUCTIONS.md` does not exist.** The design brief's §12 requires one per approved milestone, written *for you*, with the DOM structure, state-by-state copy, the keyboard contract, responsive behaviour, and — most useful and most often skipped — the server-rendered translation of the prototype's client-side interactions. It was never written. You have the prototype and the tokens but not the document that explains them. **Ask for it, or read `prototypes/m1-calendar-shell/app.js` (383 lines) yourself and write down what you infer.** Do not assume a stub is a specification.
4. **The prototype has not been checked at 375 or 768** for the M1 shell. Six responsive screenshots exist for the *token specimen* (`_shared/screenshots/`), not for the shell. The twelve shell screenshots are all colour/paper variants at one width.
5. **`lighthouse_audit` has never been run** on anything in this project.
6. **Nobody has actually tabbed through the prototype** and watched the focus ring. Tab order was verified programmatically from the DOM, which is not the same thing.
7. **`better-sqlite3` has never been installed on this Mac.** The arm64-prebuild claim in §7.1 is inference from the package's release assets, not an observation. It is the first thing `#184` will tell you.
8. **`sharp` has never been installed here either.** Implementation plan §8.8 flags it as a second native dependency that may not be worth its cost; on Apple Silicon it is normally painless, but that is unverified.
9. **No launchd/`Cloudflare Tunnel`/backup work has been attempted on macOS.** Everything in §6.2's M6 table is analysis, not experiment.
10. **The apple-green palette's full contrast table** has not been re-measured (see §7.1's note).
11. **M0.2's 24 issues have had no work done on them at all.** They are specified and parked.
12. **The two conflicting M0.1 branches** (`spike/m0.1-host-inventory` and `spike/m0.1-host-limits`) have never been reconciled. Not yours, and not needed under this brief.
13. **AI Brain's migration 029 divergence** on the Hetzner host was found read-only and never fixed. Not yours.

### 7.3 Constraints discovered along the way

- **`<input type="date">` brings its own calendar icon** as a `data:` SVG whose fill is `WindowText`/`#ffffff`. **You do not control its colour.** `color-scheme` on `:root` makes it adapt, which is why `color-scheme: light`/`dark` is set per theme. This is a real constraint for M5's date-correction UI.
- **A day tile with a cover but no title gets the accessible name `"11"`.** Too thin. M1 needs a fuller name — something like `"11 August 2026, 1 journal, no photos"`.
- **`font-variant-numeric: oldstyle-num` is a no-op with Georgia.** It computed to `normal` on every element that carried it, because Georgia's default figures are *already* old-style and it ships no `onum` feature to switch on. The declaration was removed as dead CSS. If you ever swap `--font-display`, check the figures **visually** — the property will not tell you.
- **Any colour maths on `getComputedStyle` output must resolve through a canvas probe.** Chrome returns `"oklch(0.423 0.062 171)"`, not `"rgb(…)"`, so a naive `str.match(/-?[\d.]+/g)` parses lightness, chroma, and hue as RGB bytes and produces confident fiction — it reported 1.40:1 for *every* pair before it was caught. The working `rgb()` probe is in the design handover §6.4 (line 392). The tokens are OKLCH and always will be.
- **`gh api .../milestones` needs `--paginate`.** Without it you silently get the first page.
- **Issues and PRs share one number sequence** in this repo.
- **`gh issue create --milestone` takes the milestone *title string*, not its number.**
- **BSD `grep` on macOS has no `-P`.** Filter in two steps rather than reaching for a lookahead.
- **`cd x && …` in this harness is unreliable** and can trigger a permission prompt. Prefer absolute paths and tool flags like `python3 -m http.server --directory <abs>` and `git -C <abs>`.

---

## 8. What to continue, in order   [REQUIRED]

Milestone 50 is seven issues and the plan sizes each at about a day. Their dependency order is essentially their number order.

### Step 1 — Look at the thing that already exists
Serve `prototypes/` (§3.5), open the M1 shell, click a day tile, arrow-key around the grid, toggle dark theme, cycle the four colour variants and four paper themes. Read `prototypes/m1-calendar-shell/README.md` (14 lines) and `variants.css` (160 lines). **Ten minutes here saves you from rebuilding an approved design.** Then read `app.js` (383 lines) and note which interactions are real navigation and which are the prototype faking state — that distinction is what §7.2 item 3 is about.

### Step 2 — `#184` Project scaffold: Node 22 + TypeScript + Fastify
`package.json` pinned to Node 22 with TypeScript, Fastify, `better-sqlite3`, `tsx` (dev), `typescript` (build). `tsconfig.json` strict. `src/server.ts` with one Fastify instance and one placeholder `GET /health`. Scripts: `dev` = `tsx watch src/server.ts`, `build` = `tsc`, `start` = `node dist/server.js`. Do **not** add ignore entries — `.gitignore` already covers `data/`, `node_modules/`, `dist/`.

Acceptance, from the issue: `npm install && npm run dev` starts with no errors; `curl localhost:<port>/health` returns 200; `npm run build && npm start` runs the compiled output identically. This is the only route in the whole project that returns JSON or plain text rather than server-rendered HTML.

**This is where `better-sqlite3` either installs cleanly on arm64 or costs you an afternoon** (§7.2 item 7). Find out early rather than at M3.

### Step 3 — `#185` Migration runner + the four v0.1 tables
Numbered `.sql` files in `migrations/`, applied in order by a ~30-line runner recording applied names in a `schema_migration` table. The four tables are in implementation plan §5.1 with their columns, CHECK constraints, and foreign keys — copy them from there rather than paraphrasing. **A runner, not a framework** (§4).

### Step 4 — `#186` `journal-date.ts`
`toJournalDate(instant)`, `todayJournalDate()`, `isFutureJournalDate(d)`. Built on `Intl.DateTimeFormat` with `timeZone: 'Asia/Kolkata'`. **One module derives Journal Dates and nothing else in the codebase calls `Intl` or constructs a date from a string** — that structural rule is the mitigation for implementation plan §8.6, so enforce it. Boundary tests per §5.3.

### Step 5 — `#187` CSS token layer
Lift `prototypes/_shared/tokens.css` into the app's single stylesheet. Keep the comment block that records the `--line-control` reasoning (§6.3 decision 3). Build against the committed `--brand-hue: 115` / `--paper-hue: 86`, and **say in your handover to the owner that the hue is still theirs to choose** (§10 Q2) and that changing it is one line each.

### Step 6 — `#188` Fictional-data seed script
Fictional only. `prototypes/_shared/fixtures.js` (77 lines) already contains a fictional month the owner has been looking at — reuse those days and titles so the seeded app looks like the approved prototype rather than like different software.

### Step 7 — `#189` Calendar grid: `GET /calendar` and `GET /`
`GET /` 302s to the current `Asia/Kolkata` month. `GET /calendar?month=YYYY-MM` renders the month. 7-column Monday-first grid, `grid-template-columns: repeat(7, 1fr)`, and **it never becomes a list, down to 320px** (`WF-02`). Responsive bands: compact 320–599, medium 600–1023, wide ≥1024. Below medium, mine the rail's collapse behaviour from `variants.css` (which already handles `max-width: 768px` by turning the rail into a horizontal strip and hiding `.rail__stats`) rather than inventing new rules.

**This is the milestone's demo and the first real UI.** The §5.1 verification loop applies in full: render, screenshot, compare against `prototypes/m1-calendar-shell/screenshots/apple-light.jpg`, **write the differences out in text**, fix, repeat until the list is empty. Check 375/768/1440. Tab through it.

### Step 8 — `#190` Local dev script + README smoke check
The one command the owner runs, and a README section that tells them what they should see.

### Step 9 — THE GATE. Hand M1 to the owner and stop.
`npm run dev`, open `/calendar`, and the owner sees a real month as a 7-column Monday-first grid with day tiles, today marked, month navigation working. Hand it over in the §9.2 format. **Then stop and wait.**

**Do not get a head start on M2 while waiting.** Do not touch M6's issues. Do not begin M0.2 research. Do not "quickly check" whether Cloudflare Tunnel works on macOS. The reason is not process purity: M1's feedback will change M2's day-detail page, and every hour spent building past an unapproved gate is an hour you may spend unbuilding.

---

## 9. How to behave with the user   [REQUIRED]

### 9.1 The stop rule

Stop and wait for explicit approval:

- **after each milestone**, before starting the next;
- before **filing, editing, closing, or re-milestoning any GitHub issue** (§9.3);
- before **any change to a decision in §6.3**;
- before **anything that touches the Hetzner host** — which under this brief means never;
- before **committing `UI-DESIGN-INSTRUCTIONS.md`** or any of the owner's four uncommitted files;
- before **opening a PR** or merging anything into `main`.

Answering an open question in §10 by picking whatever unblocks you fastest is the failure mode this section exists to prevent.

### 9.2 How to hand work over for review

The owner has iterated ten times on the v10 prototype and has opinions. They need four things, every time:

1. **A runnable URL and the exact command** to get there. Not "run the dev server" — the literal line, and the URL, and what they should click.
2. **The artifacts** — screenshots at 375 / 768 / 1440, and for a UI change, the before/after pair.
3. **The written comparison** — your §5.1 step-4 difference list, and the statement that it is now empty. If something is knowingly unresolved, name it rather than omitting it.
4. **Specific trade-off questions.** Not "any feedback?" — "the rail's stats block is hidden below 768px; the alternative is wrapping it under the nav strip and costing 40px of vertical space. Which?"

And one line on what you did **not** do, so a gap never reads as a claim of completeness.

### 9.3 On the issue tracker

**File nothing without approval.** Comment freely on existing issues; creating, editing, closing, or re-milestoning is an owner decision. This project's history is what makes that rule non-negotiable — the failure mode here has always been producing tracker artifacts instead of software.

If you find a gap — a screen the tickets do not cover, a behaviour nobody specified — **say so in a comment under a `## Gaps found` heading and tell the owner. Do not file the ticket, do not build around it, do not decide on their behalf.** A prior agent noticed there was no way to get a real photo into the app, then designed an entire ingest path before mentioning it. The owner approved it, but they should have been asked first.

**The house body format**, used by all 60 Phase 1.5 issues. Match it exactly:

```markdown
## Outcome
## Scope
## Technical notes
## Acceptance criteria
- [ ] …
## References
## Depends on
```

**Exemplar to imitate: `#184`.** It is short, its Scope is a bulleted list of files, its Technical notes cite the plan by section, its Acceptance criteria are three shell-verifiable checkboxes, and its Depends on says "None — first ticket." That is the register.

**API traps, with the literal commands:**

```sh
# Milestones: --paginate or you silently get page one only
GH_HOST=github.com gh api --paginate \
  'repos/arunpr614/Life-Reflection/milestones?state=all&per_page=100'

# --milestone takes the TITLE STRING, not the number
GH_HOST=github.com gh issue list --repo arunpr614/Life-Reflection \
  --milestone 'Phase 1.5 — M1 — A real month renders in the browser'
```

Issues and PRs share one number sequence, so `#320` may be a PR. Always pass `GH_HOST=github.com`.

**The visibility rule, and it catches everyone:** an issue appears on the owner's review board (view 8) **if and only if** it carries the `phase1.5` label **and** has been added to project 1. Both. An issue with the label but not on the project is invisible to the owner's review and nothing warns you.

### 9.4 The open defect list, as it stands

Carried forward verbatim. Not tidied.

1. `docs/design/DESIGN-SYSTEM.md`'s colour table is stale — says `#255949` forest, `tokens.css` is `#596e00` apple (§6.4).
2. The full twelve-pair contrast table has not been re-measured for the apple-green palette (§7.1).
3. The M1 shell prototype has never been rendered at 375 or 768 (§7.2 item 4).
4. `lighthouse_audit` has never been run on anything in this project (§7.2 item 5).
5. Nobody has physically tabbed through the prototype and watched the focus ring (§7.2 item 6).
6. `docs/design/M1-BUILD-INSTRUCTIONS.md` was required by the design brief §12 and was never written (§7.2 item 3).
7. A day tile with a cover but no title has the accessible name `"11"` — too thin (§7.3).
8. `UI-DESIGN-INSTRUCTIONS.md` is binding and exists untracked in exactly one working tree (§2.2).
9. `main` has no `docs/` directory; every plan and handover lives on unmerged branches (§2.1).
10. The two M0.1 branches conflict and have never been reconciled (§7.2 item 12).
11. AI Brain's migration 029 divergence on the Hetzner host was found and never fixed (§7.2 item 13). Not this project's code.
12. M6's five issues (`#215`–`#219`) name Hetzner and systemd and are now inconsistent with the brief (§6.2).

---

## 10. Open questions — surface, do not decide   [REQUIRED]

Numbered. Each says who must answer. **Do not resolve any of these by picking whatever unblocks you fastest** — several of them change what you build, and one of them changes where it runs.

**Ask when you reach M5's end, not now:**

1. **Which milestone is the migration point, and what happens to M6's five issues?** §6.2 lays out the candidates and recommends M1–M7 local, M0.2 during M7, migrate before M8. **Owner decides.** Until they do, do not edit `#215`–`#219`.

**Ask before you build `#187` — this one is nearly immediate:**

2. **Which `--brand-hue` and `--paper-hue`?** Four colour candidates (apple / sage / indigo / plum) and four papers (cream / linen / blush / fog) are built and screenshotted in `prototypes/m1-calendar-shell/screenshots/`. **Owner decides.** It does not block you — build against the committed defaults and change one line when they answer.
3. **Dark theme in v0.1, or light only?** UX §28 specifies both; the implementation plan never commits to shipping both in v0.1. Two themes roughly doubles the states you design and verify. **Owner decides**, and it wants deciding before `#187` because it changes how much of the token layer is load-bearing.

**Ask at a natural pause:**

4. **Should `UI-DESIGN-INSTRUCTIONS.md` be committed?** It is binding for every UI agent and currently exists untracked in one working tree. **Owner decides.**
5. **What goes in the navigation rail at M1?** Most secondary surfaces do not exist until M7+. The approved prototype shows Calendar plus a stats block plus the Needs Date Review count. Confirm that is the intent and say how it grows. **Owner decides.**
6. **Do the AI-derived slots get designed as placeholders now, or left out?** UX §9.4 specifies title, summary, and tags on the Journal Day page; they arrive at M10. Designing the empty slots now avoids a relayout later but shows the owner a page with visible gaps. The design brief recommends the slots. **Owner decides** — this is an M2 question.
7. **Issues `#174`–`#181`** (labelled `mvp`, no milestone) — fold into the Phase 1.5 milestones, or close and replace? Open since 2026-08-20. **Owner decides.**
8. **Synthetic imagery, or the owner's real photos in a gitignored folder, for judging an image-first design?** Affects how much of M3 they can actually evaluate. **Owner decides.**

---

## 11. Metadata that must be set   [REQUIRED]

### 11.1 Coordinates — verified against the API 2026-08-22

| Thing | Value |
|---|---|
| Repository | `arunpr614/Life-Reflection` (private) |
| Remote | `https://github.com/arunpr614/Life-Reflection.git` |
| Project | **user** project number **1**, "Life Reflection" |
| Project node ID | `PVT_kwHOD9kkX84BgUtf` |
| Owner login | `arunpr614` |
| The owner's review board | View **8**, "Phase 1.5 Status", `BOARD_LAYOUT`, filter `label:phase1.5` |
| Your branch | `impl/local-mac-server` |

It is a **user** project, not an organisation project. `gh project` needs `--owner arunpr614`; GraphQL needs `user(login: "arunpr614") { projectV2(number: 1) }`.

**Milestones**, with open/closed counts as read this session — every one of the 145 Phase 1.5 issues is open:

| # | Title | Issues |
|---|---|---|
| **50** | **Phase 1.5 — M1 — A real month renders in the browser** | **`#184`–`#190`** (7) ← yours |
| 51 | Phase 1.5 — M2 — Click a day and read a journal | `#191`–`#195` (5) |
| 52 | Phase 1.5 — M3 — Real photos on the calendar and the day | `#196`–`#203` (8) |
| 53 | Phase 1.5 — M4 — Upload a journal from the browser | `#204`–`#208` (5) |
| 54 | Phase 1.5 — M5 — Correct, redate, and trash without losing anything | `#209`–`#214` (6) |
| 55 | Phase 1.5 — M6 — The archive runs on the Hetzner host | `#215`–`#219` (5) — needs reinterpretation, §6.2 |
| 56–68 | Phase 1.5 — M7 … M19 | 101 issues. Not yours |
| 69 | Phase 1.5 — M0.1 — Know the host's real limits before anything else gets built on it | `#316`–`#324` (9) — **skipped** |
| 70 | Phase 1.5 — M0.2 — Prove the Hetzner + R2 architecture before committing to it | `#325`–`#348` (24) — **parked**, §6.2 |

**Milestone 50's seven issues, in dependency order** — this is your work queue:

```
#184 Project scaffold: Node 22 + TypeScript + Fastify                       type:chore   priority:high
#185 Migration runner + the four v0.1 tables                                type:chore   priority:high
#186 journal-date.ts: Journal Date derivation, Asia/Kolkata, boundary tests  type:chore   priority:high
#187 CSS token layer: prototype-v10 palette + UX §28.2–28.4                  type:feature priority:high
#188 Fictional-data seed script                                             type:chore   priority:medium
#189 Calendar grid: GET /calendar and GET / — a real month renders           type:feature priority:high
#190 Local dev script + README smoke check                                   type:chore   priority:medium
```

M2's five, so you know what M1 must not paint into a corner: `#191` html tagged-template escaping helper · `#192` `GET /day/:journalDate` · `#193` Source Item cards with Original Timestamp and `en-IN` formatting · `#194` adjacent-populated-day navigation · `#195` calendar keyboard navigation (arrows move, Enter opens).

### 11.2 Labels / taxonomy

| Slot | Allowed values |
|---|---|
| Phase | `phase1.5` — **always.** Without it the issue is invisible on view 8 |
| Type | `type:chore` \| `type:feature` \| `type:design` \| `type:spike` \| `type:architecture` \| `type:audit` \| `type:evaluation` |
| Priority | `priority:high` \| `priority:medium` \| `priority:low` |
| Status | `status:backlog` → `status:in-progress` → `status:done` |
| Kind (design only) | `ui-prototype` |

**Never apply:** `phase1`, `phase2`, any `version:v*`, `mvp`, `roadmap`.
**Never create, rename, or delete a label.**
**Never touch `phase1` or `phase2` issues, or milestones 14 and 31–49.**

There is a bare `accessibility` label but no `type:accessibility`. If you need to flag an accessibility finding, `accessibility` is the one that exists.

### 11.3 Project fields — literal IDs, so you never have to introspect them

Add the issue to the project first; that prints the item ID:

```sh
GH_HOST=github.com gh project item-add 1 --owner arunpr614 \
  --url https://github.com/arunpr614/Life-Reflection/issues/<N>
```

Then set field values by GraphQL mutation:

```graphql
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: "PVT_kwHOD9kkX84BgUtf"
    itemId:    "<ITEM_ID>"
    fieldId:   "PVTSSF_lAHOD9kkX84BgUtfzhahTpA"     # Status
    value:     { singleSelectOptionId: "f75ad846" } # Backlog
  }) { projectV2Item { id } }
}
```

| Field | ID | Type |
|---|---|---|
| Status | `PVTSSF_lAHOD9kkX84BgUtfzhahTpA` | single-select |
| Priority | `PVTSSF_lAHOD9kkX84BgUtfzhah0Eg` | single-select |
| Design artifact | `PVTF_lAHOD9kkX84BgUtfzhahz24` | text |
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

`Labels` and `Milestone` are **derived from the issue** — set them with `gh issue edit`, never with a field mutation. **Do not create or reconfigure project views.** View 8 is the owner's. (If you ever do create one via GraphQL, the response payload field is `projectV2View`, not `view`.)

### 11.4 Metadata inside generated files

Every prototype HTML file — copy-pasteable:

```html
<!--
  Life in Days — <what this is>
  PROTOTYPE ARTIFACT · fictional data · in-memory only · not production.
  Milestone: <M1 | M2 | …>
  Issue: <#NNN>
  Purpose: <one or two sentences>
  Zero third-party requests. System fonts only.
  Run: python3 -m http.server 4173 --bind 127.0.0.1 --directory <abs path to prototypes/>
-->
```

And in `<head>`:

```html
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="color-scheme" content="light dark">
```

with `<html lang="en-IN">`. The `lang` is deliberate — dates render as `8 August 2026`, times as `21:04 IST`. **Application** templates get `lang="en-IN"` and the `robots` meta too; the archive is private and must never be indexed.

### 11.5 Vocabulary constraints

`reference/CONTEXT.md` is the copy specification. Every term carries a binding `_Avoid_:` list. Used verbatim in identifiers, labels, headings, buttons, and error strings.

| Use | Never |
|---|---|
| **Journal Day** | entry, post, memory, diary, daily entry |
| **Journal Date** | upload date |
| **Needs Date Review** | (a status — this exact string) |
| **Source Item**, **Uploaded Journal** | file, attachment |
| **Daily Photo**, **Photo Caption** | image, gallery item, alt text |
| **Media Asset**, **Original Timestamp** | — |
| **Source Revision**, **Correction** | edit, source edit |
| **Derived Artifact** | — |
| **Calendar Cover** | thumbnail, hero image |
| **Trash** | delete, archive |

A Journal Day is an **aggregate**, not a document — which is why `Change date` lives on Source Items, not on the day (`UX-DAY-02`).

---

## 12. Definition of done   [REQUIRED]

For milestone M1:

- [ ] All seven issues `#184`–`#190` implemented
- [ ] `npm install && npm run dev` starts clean; `curl localhost:<port>/health` returns 200
- [ ] `npm run build && npm start` runs the compiled output identically
- [ ] `npm test` passes, including the `journal-date.ts` boundary tests at 23:59 and 00:01 IST and the same instants in UTC and US-Pacific
- [ ] Migrations apply from empty and are idempotent on re-run
- [ ] Seed script produces a fictional month; **no real journal text or photo anywhere**
- [ ] `GET /` 302s to the current `Asia/Kolkata` month; `GET /calendar?month=YYYY-MM` renders
- [ ] 7-column Monday-first grid, today marked, month navigation working, and it stays a grid at 320px
- [ ] Rendered, screenshotted, compared against `prototypes/m1-calendar-shell/screenshots/apple-light.jpg` with **differences listed in text**, loop re-run until the list is empty
- [ ] Checked at 375 / 768 / 1440
- [ ] Keyboard-tabbed, focus visible on every interactive element
- [ ] Day tiles have a fuller accessible name than the bare numeral (§7.3)
- [ ] Zero console errors; zero third-party network requests
- [ ] Copy uses `reference/CONTEXT.md` vocabulary throughout
- [ ] Nothing from the banned-aesthetics list shipped without a stated reason
- [ ] Every commit leaves the app runnable; branch pushed
- [ ] Handed to the owner in the §9.2 format, and **stopped**

### 12.1 Verification commands — all tested 2026-08-22 13:46 IST

```sh
IMPL=/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days-impl

# 1. Toolchain matches what the plan pins. Expect v22.x and arm64.
node --version && uname -m

# 2. Your work queue. Expect seven OPEN issues, #184–#190.
GH_HOST=github.com gh issue list --repo arunpr614/Life-Reflection \
  --milestone 'Phase 1.5 — M1 — A real month renders in the browser' \
  --state all --json number,title,state \
  --jq '.[] | "#\(.number) [\(.state)] \(.title)"' | sort

# 3. Commit identity. Must print: Arun Prakash N <arunpr614@users.noreply.github.com>
git -C "$IMPL" log -1 --format='%an <%ae>'

# 4. Nothing of the owner's swept up. Expect ONLY your own files here.
git -C "$IMPL" status --short
# And the primary clone must still show exactly these five lines, untouched:
#   M CLAUDE.md / M HANDOVER-PHASE-1.5.md / M README.md / ?? .mcp.json / ?? UI-DESIGN-INSTRUCTIONS.md
git -C "$IMPL/../Life-in-Days" status --short

# 5. No third-party network requests anywhere in the prototypes. Prints nothing on pass.
# BSD grep on macOS has no -P, so filter in two steps rather than using a lookahead.
grep -rnoE 'https?://[^"'"'"' )]+' "$IMPL/prototypes/" \
  --include='*.html' --include='*.css' --include='*.js' \
  | grep -v '127\.0\.0\.1' | grep -v 'localhost'

# 6. Serve the approved prototype and confirm every asset resolves. Expect five 200s.
python3 -m http.server 4173 --bind 127.0.0.1 --directory "$IMPL/prototypes" &
sleep 2
for u in "/m1-calendar-shell/?variant=apple" "/_shared/tokens.css" \
         "/_shared/tokens-specimen.html" "/m1-calendar-shell/variants.css" \
         "/m1-calendar-shell/app.js"; do
  printf "%s -> " "$u"; curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:4173$u"
done
pkill -f "http.server 4173"
```

**Deliberately unrun, and why:** nothing here is destructive or outward-facing, so all six were executed. Commands 1–6 above are copied from runs whose output is recorded in §7.1. **`npm install`, `npm run dev`, `npm test`, and `npm run build` are NOT in this list because there is no `package.json` yet** — they become real at `#184`, and `better-sqlite3`'s arm64 install is the first thing they will tell you (§7.2 item 7).

---

## 13. Things about how to work here

**The failure mode of this project is not bad code. It is producing artifacts about code.** Two generations died this way: 137 commits, ~5,800 lines of validators, registries, ledgers, dossiers and readiness states, and zero rendered journal entries. `archive/generation-0` is right there if you want to see it. Every session ends with something visible in a browser. If you find yourself building a thing that checks whether the project is being done correctly, stop — that *is* the disease, and adding governance machinery to prevent a governance-machinery failure is exactly how it happened the first time.

**The PRD exerts gravity, and it will pull you off course quietly.** It is a 380-line description of a finished system with encrypted per-object storage, provider adapters, budget ceilings, artwork sweeps, and a launch-gating Recovery Ceremony. Roughly 80% of it is out of your scope. The rule from implementation plan §7: a Phase 1.5 ticket may cite any requirement ID as context, but **if satisfying it requires an AI provider, a cloud storage backend, a cryptographic envelope, or an authentication decision, it is not a Phase 1.5 ticket.** Search and the Monthly Almanac are the two most tempting — the tables already hold what they need — and they are still M7.

**Do not design blind, and do not trust a harness that agrees with you.** You cannot see what you build. A CSS change you have not rendered is a guess. And when you do measure, check that the measurement is real: the contrast harness in this project confidently reported 1.40:1 for every pair for an hour, because Chrome returns `oklch(…)` strings and the parser was reading lightness as a red byte. A harness that produces plausible-looking numbers is worse than no harness. Both traps have one answer — render it, look at it, and write down what you see.

**Design for someone's fourteen years, not for a portfolio.** The owner will look at this most days, alone, to remember things. The interface that wins is the one that gets out of the way of a photograph and a paragraph.

---

## 14. Immediate first actions   [REQUIRED]

1. **Confirm the state is what this document claims.** Run commands 1–4 in §12.1. If your branch is not `impl/local-mac-server` at `752ee34`, or the primary clone shows more than its five files, stop and ask before doing anything else.
2. **Read, in this order:** `docs/IMPLEMENTATION-PLAN.md` (315 lines, all of it) → `docs/design/DESIGN-SYSTEM.md` (126, remembering §6.4's stale colour table) → `…/Life-in-Days/UI-DESIGN-INSTRUCTIONS.md` (195, from the primary clone, do not copy it) → `reference/CONTEXT.md` → the five sections of the two design handovers named in §3.2.
3. **Look at the approved prototype** (§3.5 and Step 1 of §8). Serve it, click it, arrow-key it, dark-theme it. Read `variants.css` and `app.js`. This is the step that stops you rebuilding an approved design.
4. **Read the seven M1 issues in full** — `#184`–`#190`. `#184` is also your body-format exemplar.
5. **Tell the owner what you are about to do**, in three or four lines: starting M1 on the Mac, skipping M0.1/M0.2, building against the committed apple-green tokens, and that §10 Q2 and Q3 (the hue, and whether dark theme ships in v0.1) are theirs to answer before `#187` lands. Then start `#184` — do not wait on the answers, because they do not block the scaffold.
6. **Work `#184` → `#190` in order** (§8, steps 2–8).
7. **Stop at the gate** (§8, step 9). Hand M1 over in the §9.2 format and wait.




