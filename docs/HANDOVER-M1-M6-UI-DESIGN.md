# Handover — design the M1–M6 experience, one milestone at a time

**From:** the agent that wrote `docs/IMPLEMENTATION-PLAN.md`, filed the 36 M1–M6 tickets, and settled the palette.
**To:** you — the agent who will act as this project's UI/UX designer.
**Written:** 2026-08-21. Every coordinate, line number, and ID below was verified against the live repo and the GitHub API on that date.
**Owner:** Arun (`arunpr614`). Single user of the product, and the only reviewer of your work.

You are working **in parallel with another agent.** That agent is writing the post-M6 implementation plan and filing ~88 tickets for milestones M7–M19. It is on a different branch, in a different worktree, and touches different files and different milestones. §3.5 is the contract between you. Read it before you touch GitHub.

---

## 1. Your task, in one paragraph

Design the user experience for milestones **M1 through M6** — the six milestones that already exist in GitHub with 36 implementation tickets under them — and prove each design in the browser before the owner sees it. For each milestone, in order, you will: read the tickets and the UX spec sections that govern them; build a **deep, genuinely interactive HTML prototype** covering every screen and every state that milestone introduces; run the verification loop in `UI-DESIGN-INSTRUCTIONS.md` §1 until your written difference list is empty; hand the prototype to the owner with a specific set of questions; **stop and wait**; iterate on their feedback; and only once they say it's approved, commit the prototype, write the design specification and build instructions into GitHub, and move to the next milestone. Six milestones, six approvals, six loops. **You are not writing product code.** Not one line of `src/`. Not one Fastify route. Your entire output is prototypes, design specifications, and GitHub issue content.

---

## 2. The absolute scope boundary

The owner said this twice, in different words, and it is the single most important instruction in this document:

> "I don't want us to get into execution. I'm just trying to get the details very clearly decided."

> "The scope of this is not implementation."

Your assignment is the design half of that. The prototype is the deliverable; the app is not.

| Do | Do not |
|---|---|
| Build static HTML/CSS/JS prototypes under `prototypes/` | Write anything under `src/`, or create it |
| Design every screen and state M1–M6 introduce | Design M7–M19 surfaces (see the banned-sections list in §4.3) |
| Add design detail to the existing 36 issues | Rewrite those issues' six-section bodies |
| File one new `type:design` issue per milestone | File implementation tickets, or create milestones |
| Use the decided palette and rail as given | Re-open the palette question |
| Render, screenshot, compare, list differences in text | Call a design done because it "looks right" in source |
| Stop after each milestone and wait for approval | Run ahead to the next milestone unprompted |
| Commit fictional fixtures | Commit a single real photo or real journal line |

Two more prohibitions worth stating plainly, because they are how this project has failed before:

- **No product code, even "just to see it render."** A Fastify route is not a faster prototype than an HTML file. It is a slower one that also creates merge conflicts with the implementation agent who will do that work later.
- **No meta-tooling.** No design registry, no token linter, no prototype index generator, no review checklist runner, no status dashboard. See §5.5. If a file you are about to create does not either render pixels the owner can look at or tell an implementation agent how to build something, do not create it.

---

## 3. Where you are working

### 3.1 Your worktree — already created for you

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days-design/
```

This is a **git worktree** of the same repository, already created, already on your branch, with your commit identity already configured. Verify and start:

```sh
cd /Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days-design
git status                              # → On branch design/m1-m6-prototypes
git config user.email                   # → arunpr614@users.noreply.github.com
```

Do all your file work here. Never `cd` into the primary clone to edit something.

### 3.2 The primary clone — read-only for you

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days/
```

This is where the owner works and where the other agent is working right now, on branch `plan/post-m6`. You will need to **read** four files from here (§3.4 explains why), and you must not write, stage, commit, or check out anything in it.

### 3.3 A directory you must never enter

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect/
```

A separate, older clone from the abandoned first attempt at this project, containing roughly 63 registered git worktrees. Never `cd` into it. Never run `git worktree prune`, `git clean`, `git reset`, or `rm -rf` anywhere inside it, and never from a directory where those commands could reach it. A `git worktree prune` run in the wrong place there destroys work that is not backed up anywhere.

Note that `git worktree list` in your own repo shows three legitimate worktrees — the primary clone, `Life-in-Days-archive` (the `archive/generation-0` branch), and yours. Leave the other two alone.

### 3.4 Four files that live only in the primary clone

These four are either untracked or modified-uncommitted in the primary clone. Your worktree has the *committed* versions, which are older. For these four, **read the primary clone's copy at its absolute path**:

| File | State | Why you need the primary copy |
|---|---|---|
| `UI-DESIGN-INSTRUCTIONS.md` | **untracked** — exists nowhere in git | This is your binding brief. It does not exist in your worktree at all. |
| `CLAUDE.md` | modified | Project rules; the committed version is close but read the current one |
| `README.md` | modified | Product framing and vocabulary |
| `HANDOVER-PHASE-1.5.md` | modified | Why this project restarted, and the failure modes to avoid |

```sh
# Read them from here, do not copy them into your worktree
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days/UI-DESIGN-INSTRUCTIONS.md
```

These are the owner's uncommitted work. **Do not commit them. Do not revert them. Do not stage them. Do not "helpfully" land them on your branch.** Never run `git add -A`, `git add .`, or `git commit -a` in either directory — always name the paths you mean.

One thing to raise with the owner early, in a sentence, and then drop: `UI-DESIGN-INSTRUCTIONS.md` is the binding specification for all UI work in this repo and it is **not in version control**. If it were committed, every future agent and every worktree would have it automatically. That is the owner's file and their call, not yours to make.

### 3.5 The parallel-work contract

Another agent is running right now with a different brief (`docs/HANDOVER-M7-M19-TICKETING.md`, on branch `plan/post-m6`). Two agents writing to one GitHub repository is the real risk here, not the files. Hold this line:

**Yours:**
- Branch `design/m1-m6-prototypes`, worktree `Life-in-Days-design/`
- Milestones **50–55** only (`Phase 1.5 — M1` … `M6`)
- Issues **#184–#219**, plus the new `type:design` issues you file
- New files under `prototypes/` and `docs/design/`

**Theirs — do not touch:**
- Branch `plan/post-m6`, and the primary clone's working tree
- Any milestone it creates for M7–M19, and every issue under them
- `docs/IMPLEMENTATION-PLAN.md` and `docs/IMPLEMENTATION-PLAN-POST-M6.md`
- `docs/HANDOVER-M7-M19-TICKETING.md`

**Shared, so be careful:** the labels list, project 1 and its view 8, and the milestone list. Adding a label to your own issues is fine. Creating a new label, renaming one, deleting one, or reordering project fields is not — it changes the ground under the other agent mid-run. If you think a new label is genuinely needed, ask the owner.

**Never touch, ever:** `phase1` and `phase2` issues and milestones. Phase 2 in particular holds 20-odd "Prototype Backlog v17–v35" milestones from the abandoned first attempt. They look like design work and are not yours — they are the archaeology of the failure this project restarted to escape. Do not mine them, do not close them, do not reference them as precedent.

### 3.6 Branch and merge topology

```
main  (53d2e5a, protected — never force-push, never commit to directly)
 └── plan/implementation  (b86191d)  — the M1–M6 plan; PR #182 open into main
      ├── plan/post-m6  (f1745d2)    — the other agent
      └── design/m1-m6-prototypes    — YOURS, branched from b86191d
```

Your branch is off `plan/implementation`, not `main`, because that is where `docs/IMPLEMENTATION-PLAN.md` lives — you need it, and it is not on `main` yet. Two consequences:

1. When you open a PR into `main`, the diff will also show `plan/implementation`'s commits, because they are in your history and not yet in `main`. That is expected. Say so in one line in the PR body.
2. **Do not rebase onto `main`** to "clean up" the diff. It drops commits your branch depends on.

The owner has said the design work merges into `main` "at a later point in time." So: open one PR near the end, not six. Push after each approved milestone so nothing lives only on your machine, but hold the PR until the owner asks for it or all six are approved.

---

## 4. Essential artifacts, in the order you should read them

### 4.1 Read fully, before you design anything

Roughly 40 minutes of reading. Do not skip it and do not skim §2 of the first one.

| # | File | Why |
|---|---|---|
| 1 | `UI-DESIGN-INSTRUCTIONS.md` (primary clone, §3.4) | **Binding.** Your process, your verification loop, your banned aesthetics, your definition of done. 195 lines. Where it conflicts with your habits, it wins. |
| 2 | `CLAUDE.md` (primary clone) | Project rules: GitHub identity, privacy boundary, no meta-tooling, every session ends with something visible |
| 3 | `reference/CONTEXT.md` (125 lines) | **This project's copy specification.** 25+ domain terms *and* the wrong word for each, marked `_Avoid_:`. Every label, heading, button, and error string you write comes from here. |
| 4 | `docs/IMPLEMENTATION-PLAN.md` §6 (line 202) | What each of M1–M6 actually ships |
| 5 | `HANDOVER-PHASE-1.5.md` (primary clone) | Why this project restarted. §4 is the failure mode: planning artifacts instead of pixels. |
| 6 | `reference/PRINCIPLES.md` (9 lines) | Data-handling rules |
| 7 | The `frontend-design` skill body, ~55 lines | Invoke it; it is short and it is the source most of `UI-DESIGN-INSTRUCTIONS.md` derives from |

### 4.2 `reference/UX-SPECIFICATION.md` — navigate, don't read cover to cover

1,335 lines. It is your primary design source and it is too long to hold at once. Read the global sections once, then read only the milestone's sections when you start that milestone. Line numbers verified 2026-08-21.

**Global — read once, at the start:**

| Section | Line | What it gives you |
|---|---|---|
| §2 Experience promise | 34 | The one paragraph that says what this product is for |
| §3 Experience principles | 55 | Truth before polish; reflection before administration; calm not coercive; reversible by default; private by construction |
| §4.1 Primary/secondary surfaces | 93 | Which surfaces exist and their rank |
| §4.2 Navigation model | 118 | Wide and compact navigation — **and one rule the owner has overridden; see §6.1** |
| §4.3 Conceptual route map | 144 | URL shapes |
| §5 Global interaction contract | 175 | §5.1 authenticity/labeling, §5.2 save behavior, §5.3 dialogs and destructive actions, §5.4 dates and time |
| §24 Content design system | 943 | §24.1 terminology, §24.2 tone, §24.3 approved copy patterns, §24.4 labels and badges |
| §25 Responsive behavior | 983 | Breakpoint behavior |
| §26 Accessibility contract | 1007 | §26.1 semantics, §26.2 keyboard and focus, §26.3 visual/cognitive, §26.4 diffs |
| §27 Privacy cues | 1053 | What must never appear in a title, URL, or referrer |
| §28.2–28.4 Type, spacing, motion | 1100–1121 | Your token values. §28.1's *colors* are superseded — see §6.1. |
| §29 Component inventory | 1130 | The component set to design against |
| §30 Loading/error/interruption states | 1167 | Every prototype needs these; they are not optional polish |

**Per milestone — read when you get there:**

| Milestone | UX sections (line) |
|---|---|
| M1 Calendar | §6 (213), §6.1 header/controls (217), §6.2 day tile anatomy (225), §6.3 interaction/a11y (243), §6.4 calendar states (251), §6.5 `WF-01`/`WF-02` (259), §22 first-use (818) |
| M2 Journal Day | §9 (323), §9.1 page order (327), §9.2 header (339), §9.4 title/summary/tags (363), §9.5 source journals (377), §9.6 day actions (391), `WF-05`/`WF-06` (399), Flow F (878) |
| M3 Photos | §9.3 gallery and cover (347), §6.2 again for the tile cover, §30 (1167) |
| M4 Upload + review queue | §10 (404), §10.1 entry points (408), §10.2 review step (416), §10.3 errors (432), `WF-07` (443), §11 Needs Date Review (447), `WF-08` (463), Flow E (870) |
| M5 Correct / redate / trash | §12 redating (467), §16 history and provenance (593), `WF-12` (611), §17.1 Trash (619), `WF-13` (639), §5.3 dialogs (195), Flow G (886), Flow L (927) |
| M6 Live on the host | §27 (1053), §30 (1167), §25 (983), §26 (1007) |

Two warnings about this file:

- **`WF-01` … `WF-16` are text annotations, not images.** There are no wireframe pictures anywhere in this repo. Each `WF-nn` is a prose paragraph describing what a future wireframe should show. Do not search for image files; do not conclude the spec is incomplete.
- The spec was written before the current plan and occasionally describes a bigger product than v0.1. When it and `docs/IMPLEMENTATION-PLAN.md` disagree on *scope*, the plan wins. When they disagree on *behavior or copy*, the spec wins.

### 4.3 UX sections that are NOT yours

These govern M7–M19 surfaces. Reading them for context is fine. **Designing them is out of scope** — do not build screens for them, do not include them in a prototype, and do not add navigation entries that lead to them beyond a disabled or "not in this milestone" affordance where §4.2 requires the slot to exist.

§7 Monthly Almanac (264) · §8 Search (286) · §13 Derived-field review and protection (481) · §14 Artwork (504) · §15 Correction conflicts (558) · §17.2 Suppressions (631) · §18 Telegram (643) · §19 Settings (677) · §20 System Health (723) · §21 Export (777)

§13 and §15 are the two that will tempt you during M5, because M5 is about Corrections. They are not M5. §13 needs AI-derived fields, which arrive in M10. §15 needs the upstream-edit conflict machinery, which arrives in M12. M5 covers appending a revision, redating, trashing, restoring, and viewing a day's history — nothing more.

### 4.4 Read on demand

| File | When |
|---|---|
| `reference/PRODUCT-REQUIREMENTS.md` | For requirement IDs to cite. Relevant headings: product boundary (112), uploaded journals and Corrections (148), reflection and browsing (161), privacy and ops (201), user flows (284), technical considerations (309), required state contracts (331) |
| `reference/prototype-v10/` | The owner's tenth iteration. **Visual baseline — mine it, don't inherit it.** See §6.2. |
| `reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md` | Only for M6 |
| Issues #184–#219 | The milestone you are on, in full |

---

## 5. Standing rules you must not break

### 5.1 GitHub identity — the one that will bite you

The owner has two GitHub accounts. One is their employer's. Using it here would push personal journal-archive activity onto a corporate host.

**Prefix every single `gh` invocation with `GH_HOST=github.com`.** No exceptions, including read-only calls.

```sh
GH_HOST=github.com gh issue view 189 --repo arunpr614/Life-Reflection
```

Never use the `daydreamer614` account or the `github.toasttab.com` host for anything in this project. Commits must not carry a `toasttab.com` address; the worktree is already configured with `arunpr614@users.noreply.github.com`. Check before your first push:

```sh
git log -1 --format='%an <%ae>'
```

### 5.2 Privacy boundary

Real journals and real photos live under `data/`, which is gitignored. That directory is not your concern and you should not read from it.

- **Fictional fixtures only** in anything committed. Invented names, invented places, invented text. See §10.3 for the fixture spec.
- Never commit real journal text, real photos, identifiers, credentials, or private URLs.
- **Your prototypes must make zero third-party network requests.** No Google Fonts, no CDN stylesheet, no `placehold.co` or `picsum.photos` image, no analytics, no icon font from a URL. A prototype of a private archive that phones out to three domains on load is the wrong artifact, and it will also break the moment the owner opens it offline. System font stacks or locally-committed font files; locally-generated placeholder imagery.
- Personal content must never appear in a page `<title>`, a URL, a query parameter, or a referrer — UX §27 and `UX-NAV-03`. Your prototypes should honor this so the implementation agent copies the right pattern.

### 5.3 Git safety

- Work on `design/m1-m6-prototypes`. Never commit directly to `main`; never force-push `main` (branch protection blocks it anyway).
- Your own branch is yours to amend and force-push — prefer `--force-with-lease`.
- Always `git add <explicit paths>`. Never `-A`, never `.`, never `commit -a`. §3.4 explains what you would otherwise sweep up.
- Commit after each approved milestone, not in one heap at the end. `data/`, `*.sqlite`, `.env`, `*.pem`, `*.key` are already gitignored — keep it that way.

### 5.4 Issue hygiene

- Never reopen, close, or edit a `phase1` or `phase2` issue.
- Never delete or retitle an existing M1–M6 issue. You may **append** to a body and you may **comment** freely.
- Every issue you create gets exactly the labels in §11.5, gets added to project 1, and gets its `Status`, `Priority`, and `Design artifact` fields set. An issue that is not on the board does not exist as far as the owner's review is concerned.

### 5.5 No meta-tooling

From `CLAUDE.md`, and it is the rule this project exists because of:

> Do not build validators, registries, ledgers, councils, dossiers, readiness states, or any code whose purpose is to govern this project.

The first attempt at this product produced **137 commits and roughly 5,800 lines of coordination code, and rendered zero journal entries.** You can read it on the `archive/generation-0` branch. `reference/prototype-v10/README.md` is a fossil of that era — look at its "Council", "QA disposition", "permitted closure" language. That is what over-governed design work reads like. Your artifacts are prototypes and specifications, and nothing else.

The corollary for you specifically: `UI-DESIGN-INSTRUCTIONS.md` §2 tells you to write a one-page design system document and warns *"if your design document is growing past a page, you have stopped designing and started governing."* Believe it. Six prototypes and six specifications is the right output. A design-system handbook is not.

### 5.6 Every session ends with something visible

Also from `CLAUDE.md`. For you this is not a slogan — it is identical to the verification loop. If a work session ends without something the owner can open in a browser and look at, the session did not produce design work.

---

## 6. Design decisions already made — do not relitigate these

The owner has already iterated ten times on a prototype and spent a session comparing two palettes side by side in the browser. These are settled. Re-opening them is not thoroughness; it is asking the owner to do the same work twice.

### 6.1 Palette and shell — decided 2026-08-20

The owner compared two options as live HTML and chose one. The decision:

| Token | Value |
|---|---|
| Accent | `#255949` (green) |
| Focus ring | `#0a7762` |
| Navigation rail | **persistent, `--rail-width: 238px`** |

Source: `reference/prototype-v10/` (their tenth iteration), not UX §28.1.

**Two overrides you must understand, because you will read the opposite in the spec and try to obey it:**

1. **UX §28.1 (line 1079) defines a warm-brown palette — `#70543D` accent, `#175CD3` focus, `#F7F1E8` canvas. That palette lost.** Do not use it. `docs/IMPLEMENTATION-PLAN.md` §5.6 was corrected on 2026-08-20 to cite v10 instead; if you find any other file still pointing at §28.1 for color, it is stale.
2. **UX §4.2 (line 118) says, verbatim: "do not add a competing Timeline tab or persistent primary-navigation rail." The owner's decision overrides that clause.** The rail is in. `WF-01`'s no-rail annotation is likewise overridden. Everything *else* in §4.2 still binds — the Calendar/Almanac switcher relationship, the compact-viewport model, `UX-NAV-01` through `UX-NAV-04`.

So the open design question is not *whether* there is a rail. It is **what belongs in it at each milestone**, given that most secondary surfaces (Search, Almanac, Settings, History, Trash, Export, System Health) do not exist until M7+. That is a real question and a good one to put to the owner in M1. A rail with two live items and nine dead ones is a worse design than a rail that grows.

What is *not* decided, and is genuinely yours to design: type roles and scale within UX §28.2's constraints, the day-tile composition, information hierarchy on the Journal Day page, the shape of the upload and review flows, empty and error state treatments, and — per `UI-DESIGN-INSTRUCTIONS.md` §2 — **the signature element**: the one thing that makes this *this* app and not a generic web app with the words changed. Name it in a sentence and spend your boldness there.

### 6.2 Start from v10, but do not inherit it

`reference/prototype-v10/` is the owner's tenth iteration and its layout and visual language are the baseline. It is also roughly 380KB of governance-era CSS and JS. **Mine it for ideas; do not copy its code forward.** To look at it:

```sh
cd reference/prototype-v10 && python3 -m http.server 4173 --bind 127.0.0.1
# then http://127.0.0.1:4173/index.html?view=calendar&month=2026-08
```

Its own README is worth reading once as a cautionary artifact — note the "Council", "QA disposition", and "permitted closure" vocabulary, and then write nothing that sounds like it.

### 6.3 Tokens

Take type, spacing, shape, and motion from **UX §28.2 (1100), §28.3 (1112), §28.4 (1121)**: the type scale, 4px spacing base, 12/10/8px radii, and 120/180/240ms motion durations with `prefers-reduced-motion` honored. Colors come from §6.1, not §28.1.

`UI-DESIGN-INSTRUCTIONS.md` §2 recommends OKLCH tokens driven by a single `--brand-hue` variable rather than scattered hex literals, so the owner can shift the whole feel by changing one number. That is a good idea and it does not conflict with the decided palette — express `#255949` and `#0a7762` in OKLCH off a single hue and keep them visually identical. Verify with a screenshot comparison, not by trusting the conversion math.

On motion, from the official `frontend-design` skill, near-verbatim: **extra animation is itself a tell that a design was AI-generated.** Motion must communicate something — a state change, a spatial relationship, continuity. Default to none.

There is already a ticket for this: **#187, "CSS token layer: prototype-v10 palette + UX §28.2–28.4 type/spacing/motion."** Your token work is the design input to that ticket. Your prototype's token file should be close enough to drop in.

### 6.4 The stack your markup has to survive

The app will be **server-rendered HTML from tagged-template functions in TypeScript, with one stylesheet, and no client-side framework.** Node 22 + Fastify + `better-sqlite3`. React, Next.js, ORMs, migration frameworks, job queues, and Docker were all explicitly rejected.

This constrains your design in ways worth internalizing now rather than discovering at implementation:

- **Design for full page loads.** A flow that only works as an optimistic client-side state machine is a flow the implementation agent cannot build. Progressive enhancement is fine; a hard dependency on client JS for a core path is not.
- Your prototype may use plain JS to make states reachable — that is what makes it interactive and reviewable. But **the design must degrade to forms, links, and page transitions.** Say so explicitly in the build instructions where it matters.
- One stylesheet. Design a system that fits in one, and keep selector specificity low. `UI-DESIGN-INSTRUCTIONS.md` §4 has the warning: the most common way generated stylesheets silently fail is a later rule losing to an earlier, more specific one, and it presents as "the instruction was ignored."
- **No dependencies, no build step, no CDN** in the prototype. Static HTML/CSS/JS, served locally, the way v10 works.

### 6.5 Vocabulary is not negotiable

`reference/CONTEXT.md` defines 25+ domain terms and, for each, the wrong words marked `_Avoid_:`. Journal Day, not "diary entry." Daily Photo, not "gallery item." Calendar Cover, not "thumbnail." Correction, not "source edit." Source Item, Source Revision, Journal Date, Original Timestamp, Needs Date Review, Trash.

Use that vocabulary in **every** label, heading, button, badge, dialog, toast, and error string. This is stricter than most projects ever get and it costs you nothing to comply with. UX §24.1 (945) restates the terminology and §24.3 (965) gives approved copy patterns.

Copy rules from `UI-DESIGN-INSTRUCTIONS.md` §5, which is worth more than it looks: active voice ("Save changes," not "Submit"); **an action keeps the same name through the whole flow** — button, confirmation dialog, and resulting toast all say the same word; errors do not apologize, they state what happened and what to do next; an empty screen is an invitation to act, not a dead end.

---

## 7. The skills you must use, and how

### 7.1 `UI-DESIGN-INSTRUCTIONS.md` — binding

Not background reading. Its own header says: *"Where this document conflicts with your default habits, this document wins."* Its §9 is a ten-item definition of done that applies to every UI change, every time. §11 of this handover folds it into the per-milestone checklist so you do not have to hold both.

The rule that matters most is §1, and it is the one agents skip:

> 1. Render it in a real browser. 2. Screenshot it. 3. Compare against the intent. 4. **List the differences explicitly, in text.** 5. Fix them. Repeat until the list is empty.
>
> Step 4 is the one agents skip. Write the differences out. "Looks good" is not a comparison; it is a refusal to compare.

You cannot see what you build. A CSS change you have not rendered is a guess.

### 7.2 `frontend-design`

Anthropic's official skill, installed at user scope. Invoke it before you write markup for a milestone — it should fire automatically when you build pages or components, but invoke it explicitly if it does not. It appears in the available-skills listing as `frontend-design:frontend-design`; use the exact name shown there rather than guessing.

It is about 55 lines. Read it directly at least once:

```
~/.claude/plugins/cache/claude-plugins-official/frontend-design/unknown/skills/frontend-design/SKILL.md
```

Its core demand: commit to a **bold, specific aesthetic direction** and execute it with precision, rather than producing the mean of the training distribution. Its banned-aesthetics list is reproduced and extended in `UI-DESIGN-INSTRUCTIONS.md` §3 — see §7.5 below.

### 7.3 `prototype` — the UI branch, with three adaptations

Invoke the `prototype` skill and follow its **`UI.md`** branch (the question is "what should this look like", not "does this state model hold"). Its shape: several radically different variants on one route, switchable from a floating bottom bar, with `?variant=` in the URL so a variant is shareable and reload-stable. Left arrow, variant label showing key *and* name (`B (Sidebar layout)`), right arrow; `←`/`→` keys also cycle but must not fire when an `<input>`, `<textarea>`, or `[contenteditable]` is focused; visually distinct from the page so it is obviously not part of the design under review.

Three project-specific adaptations, and they matter:

**(a) The number of variants shrinks after M1.** The skill's default is 3 variants. Correct for M1, which sets the whole shell. Wrong for M4, where offering three whole-app redesigns asks the owner to re-decide things they already approved.

| Milestone | Variants | Of what |
|---|---|---|
| M1 | **3** | The shell and the calendar — structurally different layouts, hierarchies, and day-tile compositions |
| M2–M5 | **2** | Only the new surface that milestone introduces, mounted inside the *approved* M1 shell |
| M6 | **1** | The four boundary/error states; there is nothing to choose between |

Once the owner approves M1's shell, it is fixed. Later variants disagree about the new screen, not about the app.

**(b) Variants differ structurally, never by palette.** The skill warns that variants which differ only in color are "wallpaper, not a prototype." Here that is doubly true because **the palette is decided** (§6.1). Vary layout, information hierarchy, primary affordance, density, and what the rail contains. Do not vary accent color, and do not smuggle the rejected brown palette back in as "variant C."

**(c) Prototypes land on `main` eventually, not the bin.** The skill says a throwaway prototype goes to a throwaway branch and only the validated decision reaches main. The owner has overridden that: these prototypes merge into `main` as the design source of truth that implementation agents build against. `UI-DESIGN-INSTRUCTIONS.md` §8 agrees — *"new prototype work goes in `prototypes/` at repo root."* Keep the skill's other rules intact: no tests, no persistence, no error handling beyond runnability, no abstractions, and a clear marking at the top of every file that this is a prototype and not production.

### 7.4 `chrome-devtools-mcp` — your eyes

Already installed and enabled. You have a real browser you can drive. Do not add Playwright MCP, Figma MCP, or any other MCP server — `UI-DESIGN-INSTRUCTIONS.md` §7 costs it out at 3–5k tokens per server per session whether used or not.

| Need | Tool |
|---|---|
| Visual check | `take_screenshot` |
| Structure / semantics / a11y tree | `take_snapshot` |
| Responsive check | `resize_page`, `emulate` |
| Is something erroring | `list_console_messages` |
| Contrast / perf / a11y audit | `lighthouse_audit` |

**Token economics, and it is a real constraint:** `take_snapshot` returns the accessibility tree at roughly 2–5KB. `take_screenshot` is 500KB+. Use snapshots for structural and semantic questions and screenshots only when the question is genuinely visual. Do not screenshot to check whether a heading exists. You will run this loop dozens of times across six milestones; the difference decides whether you finish.

Serving a prototype:

```sh
cd prototypes/<name> && python3 -m http.server 4173 --bind 127.0.0.1
# then navigate_page to http://127.0.0.1:4173/
```

There is also a `chrome-devtools-mcp:a11y-debugging` skill available for the accessibility passes, which is worth invoking for M1's keyboard-navigation work and M6's closeout.

### 7.5 The aesthetics that are banned

From `UI-DESIGN-INSTRUCTIONS.md` §3. These are the clusters models fall into when asked to "make it beautiful," because they are the mean of the distribution. Recognizing them is most of the work.

**The three signature clusters — do not produce any of them:**
1. Cream `#F4F1EA` background + high-contrast serif + terracotta accent.
2. Near-black background + a single acid-green or vermilion accent.
3. "Broadsheet": hairline rules everywhere, zero border-radius, dense justified columns.

Cluster 2 deserves a specific warning: this app's accent **is** a green (`#255949`) and its likely dark theme **is** dark. The distance between "the decided palette, rendered with care" and "AI-slop cluster 2" is smaller than you think. Check yourself against it explicitly when you build the dark theme.

**Also banned without a stated reason:** gradients as decoration; glassmorphism and frosted panels; emoji as iconography; `border-radius: 8px` applied uniformly to everything; scroll-triggered animation, entrance animation, hover lifts on every card; and decorative structural scaffolding — `01 / 02 / 03` section markers, numbered step chrome, section eyebrows that exist because templates have them.

**Two positive constraints that do the most work:**
- **Ground the design in the subject.** This is a private archive of one person's days, spanning fourteen years. It should feel personal and inhabited — not a dashboard, not a product marketing page, not a CMS.
- **Spend your boldness in one place.** One signature move, restraint everywhere else. The skill cites Chanel: remove one accessory before leaving the house.

**Run the adversarial pass.** After each milestone's prototype renders and before you hand it over, point a fresh reviewer — a subagent, or yourself on a clean read — at the rendered screenshots and ask: *"list everything about this page that looks AI-generated."* `UI-DESIGN-INSTRUCTIONS.md` §6 recommends it precisely because it is productive and uncomfortable. Put what it finds, and what you did about it, in the handover to the owner.

---

## 8. How you work: one milestone, one loop, one approval

This is the operating protocol the owner asked for, in order. Do not compress it and do not run two milestones at once.

### 8.0 Before M1 — the one-page design system

`UI-DESIGN-INSTRUCTIONS.md` §2 is explicit: do **not** start with components, because starting with components means the design gets re-improvised in every file, inconsistently, with no single place to change it.

Write `docs/design/DESIGN-SYSTEM.md`. **One page.** Exactly four things:

1. **Color** — 4 to 6 *named* values with real hex/OKLCH, each with a job (surface, ink, muted ink, accent, focus). Accent and focus are given (§6.1); you are choosing the rest and expressing the set coherently.
2. **Type** — at least two roles (display and body) with real font families and a scale, within UX §28.2. Typography carries this interface's personality, not color.
3. **Layout** — **ASCII wireframes** of the M1–M6 screens. Boxes and labels. Faster to review and faster to change than markup, and this is the artifact to argue with the owner over before you build anything.
4. **Signature element** — the one thing that makes this *this* app, named in a sentence.

Then critique your own page before building, against §2's three questions: does this read as *a private journal archive* or as a generic web app with the words changed? Which element is the boldness spent on, and is everything else restrained enough to let it land? Which of the §3 banned defaults did I drift toward?

Show the owner this one page **before** you build M1's prototype. It is cheap to change now and expensive later. If it grows past a page, you have stopped designing and started governing.

### 8.1 The per-milestone cycle

For each milestone M1 → M6, in order:

1. **Read.** The milestone's issues in full (`gh issue list --milestone`), the UX sections from §4.2's per-milestone table, and the milestone's entry in `docs/IMPLEMENTATION-PLAN.md` §6.
2. **Inventory.** Write the screen-and-state list *before designing* — every screen, and for each, every state it can be in (populated, empty, first-use, loading, error, permission-denied, mid-flight, confirmation, success). §9 gives you a starting inventory per milestone; extend it, don't just copy it. UX §30 (1167) is the states contract.
3. **Design requirements into GitHub.** File the milestone's `type:design` issue (§11.2) with the inventory and the requirements, before building. This is the artifact the owner reviews if they want to argue about scope rather than pixels.
4. **Build.** The prototype, with its variants per §7.3(a). Every state in the inventory reachable by clicking. See §9.7 for what "interactive" has to mean here.
5. **Verify.** The §1 loop until your difference list is empty. Then the quality floor: 375 / 768 / 1440, keyboard tab-through with visible focus, `prefers-reduced-motion`, measured contrast via `lighthouse_audit`, zero console errors. Then the adversarial pass (§7.5).
6. **Hand over and stop.** §8.2 gives the format. Then **stop** — §8.4.
7. **Iterate** on the owner's feedback, re-running steps 4–6. Expect two or three rounds. The most useful feedback is usually *"I want the header from B with the sidebar from C"* — that composite is the actual design they want, so build it as a new variant and re-present rather than declaring victory.
8. **Only on explicit approval:** commit the prototype, write the build instructions (§12), post them to the issue (§11.4), set the `Design artifact` field, push, and move to the next milestone.

### 8.2 How to hand a prototype to the owner

Same format every time, so it is skimmable:

1. **How to open it** — the exact `python3 -m http.server` command and the full URL including the starting `?variant=`.
2. **Variant table** — key, name, and the one-line thesis of each. *"A (Dense grid) — maximum days visible, cover art small. B (Editorial) — fewer, larger days, cover art dominant."*
3. **Screen and state inventory** — a table of every screen and state, and how to reach it in the prototype. If a state is not reachable by clicking, say so and say why.
4. **Your difference list, and what you fixed** — the text output of the §1 loop. This is evidence that you looked, and it is the part that earns trust.
5. **The adversarial pass result** — what a fresh reviewer said looked AI-generated, and what you did about it.
6. **Quality floor results** — the three widths, keyboard pass, contrast numbers, console clean.
7. **Two or three specific questions.** Not *"does this look good?"* Questions that name a trade-off and force a choice: *"In A the Calendar Cover fills the tile and the date is an overlay; in B the date sits above a smaller cover. A is more image-first; B is easier to scan when you're looking for a specific date. Which matters more to you on a normal day?"*
8. **What is deliberately not in this prototype**, and which milestone owns it.

`UI-DESIGN-INSTRUCTIONS.md` §6: *"Show options; don't present one answer as settled."* The owner has opinions and has already iterated ten times. Ask for references rather than adjectives — if they say "cleaner," ask which screen or which prototype they mean.

### 8.3 Screenshots in the handover

Include screenshots at 375 / 768 / 1440 for the primary screen of each variant. Commit them under `prototypes/<milestone>/screenshots/` and reference them from the GitHub issue, where they render inline. Keep them few and keep them small — this is a handover, not a gallery, and the owner is going to open the live prototype anyway.

### 8.4 The stop rule

**After handing over a milestone, you stop.** You do not start the next milestone. You do not "get a head start" on the next milestone's inventory. You do not refactor the shared token file while waiting. You do not file the next milestone's design issue.

The owner asked for this explicitly:

> "Pick up one milestone, finish the UI/UX designs, and give the prototype file back to the user to review. Only once the user confirms it's done, move to the next milestone."

There are two reasons beyond obedience. First, M1's approval fixes the shell, and every later milestone's design is conditional on it — work done before that lands is work likely to be thrown away. Second, the owner is the only reviewer and their attention is the bottleneck; six prototypes arriving at once gets a worse review than six arriving in sequence.

Approval means the owner says so. Silence is not approval. "Interesting" is not approval. A comment on one detail is not approval of the whole.

---

## 9. What to design for each milestone

Milestone titles are exact. Issue numbers are the existing implementation tickets — read them in full when you start that milestone. The state lists are a **floor, not a ceiling**: extend them from UX §30 and from the tickets themselves.

### M1 — `Phase 1.5 — M1 — A real month renders in the browser`
**Milestone 50 · issues #184–#190 · 3 variants — this one sets the shell**

The most important milestone you will design, because everything after it inherits the decisions. The owner's experience of M1 is: they open a URL and see a month of their life as pictures.

**Screens:** the application shell (rail + main region); Calendar month view.

**States, minimum:**
- Populated month — a mix of days with covers, days with journal text but no photo, and empty days
- Month with a single populated day
- Completely empty month (archive has data, this month does not)
- **First use** — archive is empty (UX §22, line 818)
- Loading a month; month failed to load (UX §30 and §6.4)
- Today's date marked; future dates within the current month
- Focused day tile, keyboard focus visible; selected/hovered tile
- Dark theme, for every one of the above that differs

**Design questions that are genuinely open here:**
- **Day tile anatomy** (UX §6.2, line 225) — how the Calendar Cover, the date number, the presence of journal text, and the photo count coexist in one tile without becoming a data readout.
- **What is in the rail at M1**, given that Search, Almanac, Settings, History, Trash, Export, and System Health do not exist until M7+. Design what it looks like now *and* say how it grows. Put this to the owner directly.
- **The signature element.** M1 is where you spend it.
- Month header and controls (§6.1, line 217) — how month navigation works at every width.

**Constraints:** 7-column, Monday-first grid, down to 320px (`WF-01`/`WF-02`, §6.5 line 259). Keyboard: arrows move between days, Enter opens a day (#195, and §6.3 line 243). `UX-IA-04` — a Journal Day with no live Source Items must not appear on the Calendar at all, even if historical derived artifacts remain.

**Feeds tickets:** #187 (token layer), #189 (calendar grid), #195 (keyboard navigation).

### M2 — `Phase 1.5 — M2 — Click a day and read a journal`
**Milestone 51 · issues #191–#195 · 2 variants of the Journal Day page, inside the approved M1 shell**

**Screens:** Journal Day detail.

**States, minimum:** one short journal; one very long journal (design for 1,800 words, not 200); multiple Source Items on one day; a day with journal text and no photo; a day reached directly by URL; first and last populated day in the archive (previous/next unavailable); loading; failed to load; a day that no longer has live content.

**Design questions:** page order and hierarchy (§9.1, line 327) — what the eye hits first, given that the point is reflection, not administration; the header (§9.2, line 339); Source Item cards showing **Original Timestamp** with `en-IN` formatting (#193, and §5.4 line 203); how day actions (§9.6, line 391) stay quiet — UX §3.2 is "reflection before administration," so management affordances must not dominate a page whose purpose is reading.

**Constraint you will get wrong if you skim:** `UX-NAV-02` — previous/next inside Journal Day detail moves between **populated, visible** Journal Days, not every calendar date (#194). An adjacent-date picker stays available for direct selection.

§9.4 (line 363) covers title, summary, and tags. Those are **AI-derived and arrive in M10.** Design the slots so they can appear later without relayout, and show them empty/absent in M2. Do not design the AI-generated content itself and do not invent placeholder summaries that imply the feature exists.

**Feeds tickets:** #192, #193, #194.

### M3 — `Phase 1.5 — M3 — Real photos on the calendar and the day`
**Milestone 52 · issues #196–#203 · 2 variants of the gallery**

This is where the calendar stops being a grid of text and becomes the product. Most of M3's tickets are backend (storage, ingest, `sharp`); your surface area is the gallery, the cover, and the states around images.

**Screens:** Journal Day gallery; the Calendar Cover as it appears on the tile; the photo reordering affordance.

**States, minimum:** day with 1 photo; with 3; with 12; photo loading; photo failed to load (the day and its journals **must stay readable** — this is explicit in v10's contract and UX §30); derivative missing but original present; a photo mid-reorder; reorder committed; portrait and landscape and square mixed in one day; a very wide panorama.

**Design questions:** gallery and cover behavior (§9.3, line 347); how the Calendar Cover is chosen and how the owner overrides it — **UX-CAL-04, and the rule that a real Daily Photo always wins** (#201); how reordering works **by keyboard**, not only by drag (#203, and §26.2 line 1021). Keyboard-operable reordering is a hard design problem and it is a stated requirement — do not ship a drag-only design with a note that keyboard support is a follow-up.

**Feeds tickets:** #199, #200, #201, #202, #203.

### M4 — `Phase 1.5 — M4 — Upload a journal from the browser`
**Milestone 53 · issues #204–#208 · 2 variants**

Two surfaces, and they are related: getting a journal in, and resolving items that could not be dated.

**Screens:** Upload Journal (entry points, review step, result); Needs Date Review queue.

**States, minimum:**
- Upload: idle; file chosen; **review step** showing filename, size, the timezone note, and a safe text preview (#205); uploading; success; duplicate detected, with **Cancel / Add anyway** (#206); and the **full error table from UX §10.3 (line 432)** — every row of it, not the two you find easy (#207)
- Needs Date Review: empty; one item; a queue of eight; an item mid-resolution; resolved and leaving the queue

**Design questions:** the two entry points required by `UX-IA-02` — Upload Journal must be available both as a global action and from inside Journal Day detail — without the global one becoming loud; how the review step (§10.2, line 416) shows enough for the owner to trust what they are about to commit; how Needs Date Review appears in navigation **only when it holds items** while staying reachable when empty (`UX-IA-03`, §11 line 447).

**The text preview is a privacy surface.** It renders arbitrary user text. Design it so escaping is obvious and unavoidable, and note that explicitly in the build instructions — #191 exists for the escaping helper and this is the screen that depends on it.

**Feeds tickets:** #204, #205, #206, #207, #208.

### M5 — `Phase 1.5 — M5 — Correct, redate, and trash without losing anything`
**Milestone 54 · issues #209–#214 · 2 variants**

The milestone about reversibility. UX §3.4: *reversible by default, deliberate when permanent.* Every screen here should make the owner feel that nothing they do is unrecoverable, and that the one thing that is permanent is clearly marked.

**Screens:** Correction editor on a Source Item; Change Journal Date; Trash; Restore; Day history.

**States, minimum:** Source Item with no Corrections; with one; with three revisions; a Correction in progress with unsaved changes; navigating away with unsaved changes (v10's contract: confirm, never auto-save); redate confirmation; redate committed; Trash empty; Trash with items at 28, 12, and 1 days remaining; permanent-delete confirmation; restore confirmation and result; day history showing sources, revisions, and the cover-selection record.

**Design questions:** how a Correction reads as an **append**, never an in-place edit (#209) — the history is the product's honesty and the UI should show that nothing was overwritten; how Change Journal Date (#211) communicates that a day is gaining and another losing content; the 30-day Trash window (#212) and how time-remaining is shown without becoming a countdown that nags; "Make calendar cover" inside day history (#214); dialogs and destructive actions per §5.3 (line 195).

**Out of scope, and you will be tempted:** UX §13 (derived-field review and protection, line 481) needs AI-derived fields — that is M10. UX §15 (Correction conflicts, line 558) needs upstream-edit machinery — that is M12. §17.2 (Suppressions, line 631) is M7+. M5 is append, redate, trash, restore, history. Nothing else.

**Feeds tickets:** #209, #211, #212, #213, #214.

### M6 — `Phase 1.5 — M6 — The archive runs on the Hetzner host`
**Milestone 55 · issues #215–#219 · 1 variant**

Be honest about this one: **M6 is almost entirely operational and introduces almost no new UI.** Do not invent screens to make it feel like a design milestone. There are four real states, and one real pass.

**The four states:**
1. **The Cloudflare Access boundary.** The origin sits behind a tunnel with Access in front (#216). When a session expires, the private archive DOM must be gone and the owner returns through Access — not to a half-rendered archive. v10 modelled this deliberately; UX §27 (line 1053) is the privacy-cues contract.
2. **Total server failure.** No content, and explicitly no stale or authoritative-looking emptiness. An empty calendar and a broken calendar must never look the same.
3. **Connection interruption.** Persistent, non-dismissible, honest that settled content may be stale, and reconnection never auto-saves.
4. **Slow first load over mobile network.** #219 is the owner opening this on their phone from outside the house for the first time. That is the moment M6 exists for.

**The one pass:** the full quality floor on **every screen from M1–M5** at 375px, on a real mobile viewport, with the rail in its compact form. UX §25 (983) and §26 (1007). This is the pass that catches what five milestones of desktop-first work missed.

If the owner decides M6 needs no design issue at all, that is a reasonable call — ask them rather than assuming either way.

**Feeds tickets:** #216, #219.

### 9.7 What "interactive" has to mean

The owner asked for a *"deep very detailed interactive HTML prototype."* The bar:

- **Every state in your inventory is reachable by clicking**, from the prototype's start URL. Not described in a comment. Not a second HTML file the owner has to know about. If a state genuinely cannot be reached by interaction, expose it through a small state list in the prototype chrome — clearly part of the prototype furniture, not the design.
- **Navigation works.** Clicking a day opens that day. Previous/next moves between populated days. Back returns to the month you came from, with scroll position — `UX-NAV-01`. No `href="#"` dead ends.
- **Keyboard works for real.** Arrows move between days, Enter opens, Tab reaches everything, focus is always visible. Test it by actually tabbing through, not by reading your own CSS.
- **Forms respond.** Choosing a file shows the review step; submitting shows success; the duplicate path shows the duplicate dialog; each error in the UX §10.3 table is reachable.
- **State is surfaced.** The `prototype` skill's rule 5: render the relevant state so the owner can see what changed. A small, visually-distinct state readout in the prototype chrome is right.
- **No persistence.** In-memory only. Reload returns to the fictional first state. The `prototype` skill's rule 3.
- **No real mutations, no backend.** Read-only against fixtures; stub anything that would write.

---

## 10. Repo layout

### 10.1 Where things go

```
prototypes/
  _shared/
    tokens.css            # the design system from §8.0 — one file, the drop-in for #187
    base.css              # reset, type, layout primitives
    switcher.js           # the ?variant= floating bar from the prototype skill
    prototype-chrome.css  # switcher + state readout — visually distinct from the design
    fixtures.js           # the fictional archive (§10.3)
  m1-calendar-shell/
    index.html            # ?variant=a|b|c
    variants.css
    screenshots/375.png 768.png 1440.png
    README.md             # one paragraph: the question, the variants, how to run
  m2-journal-day/
  m3-photos/
  m4-upload-review/
  m5-corrections-trash/
  m6-boundary-states/

docs/design/
  DESIGN-SYSTEM.md        # §8.0 — one page
  M1-BUILD-INSTRUCTIONS.md ... M6-BUILD-INSTRUCTIONS.md   # §12
```

Rules:

- **`prototypes/` at repo root**, deliberately not inside `reference/`, which is frozen salvage (`UI-DESIGN-INSTRUCTIONS.md` §8).
- Every HTML file opens with a comment block: this is a prototype, fictional data, in-memory only, not production, which milestone and which issue it belongs to.
- Share `_shared/` across milestones. Do **not** share a `variants.css` between two variants of the same prototype — the `prototype` skill is right that a shared layout defeats the point. A shared header is fine; a shared layout is not.
- One command to run, every time: `cd prototypes/<name> && python3 -m http.server 4173 --bind 127.0.0.1`. Put it in the prototype's README and in the handover message. If the owner has to think about how to start it, you have already lost part of the review.
- **Do not touch** `src/`, `docs/IMPLEMENTATION-PLAN.md`, `docs/IMPLEMENTATION-PLAN-POST-M6.md`, `docs/HANDOVER-M7-M19-TICKETING.md`, `reference/`, or the four files in §3.4.

### 10.2 Do not create these

No `prototypes/INDEX.md`. No `docs/design/REVIEW-LOG.md`. No status tracker, no per-milestone checklist file, no token-usage validator, no naming-convention linter, no design-decision registry. §5.5. The GitHub issues are the record.

### 10.3 The fictional archive — one fixture set, used by every prototype

Design quality depends on fixture quality. A calendar of nine identical placeholder days will look fine and teach the owner nothing. Build one fixture set in `_shared/fixtures.js` and make it awkward on purpose.

**Anchor month: August 2026** (v10 used the same, so comparison is easy). Today is the 21st, so the month has a real past/future split.

| Shape | Why it has to exist |
|---|---|
| ~19 of 31 days populated, unevenly clustered | Real archives are lumpy. An evenly-filled month hides the empty-tile design problem. |
| A day with exactly 1 photo | The common case |
| A day with 3 photos, and one with 12 | Gallery layout, and the point where a count badge stops being enough |
| A day with journal text and **no photo** | The tile has no Calendar Cover — this is the case M11 eventually solves, and until then the design must not look broken |
| A day with a photo and **no journal text** | The inverse |
| A day with **2 Source Items** | Multiple journals on one date |
| A journal of ~1,800 words, and one of 3 lines | Long-form reading is the point of the product; short entries are the reality |
| Days after the 21st | Future dates within the current month |
| A day whose photos are all undatable | Sits in **Needs Date Review**, not on the calendar (`journal_date = NULL`) |
| 2 items in Needs Date Review | Enough to show a queue, not enough to hide the empty state |
| 3 items in Trash at 28, 12, and 1 days remaining | The full range of the 30-day window |
| 1 Source Item with 2 Corrections applied | M5's history view needs real depth |
| A gap of several months, then older days | Fourteen years of archive, not one month |
| Mixed portrait / landscape / square / one panorama | Gallery and cover cropping |

**Content rules:** invented people, invented places, invented text. Not the owner's life, not recognizable public figures, not lorem ipsum — lorem ipsum makes it impossible to judge typography and line length, which is half of what you are designing. Write plausible, specific, fictional journal prose.

**Placeholder imagery — and an honest limitation.** You cannot use real photos (privacy) or external placeholder services (§5.2's no-third-party-request rule). So: generate local imagery — small committed synthetic images or inline SVG with varied dominant colors, aspect ratios, and enough tonal range to test cover cropping, text-over-image contrast, and the dark theme.

Be straight with the owner about the consequence: **an image-first calendar judged with synthetic imagery is only partly judgeable.** Abstract tiles will not tell you whether the design sings with real photographs. Offer them the privacy-safe path — a gitignored `prototypes/_local-photos/` that the prototype reads if present and falls back to synthetic if absent. The owner drops a dozen of their own photos in for their own review; nothing ever leaves the machine and nothing is ever committed. Add the directory to `.gitignore` in the same commit that adds the fallback, before there is anything to leak. Raise it as an option in the M1 handover; do not build it unless they want it.

---

## 11. How to operate GitHub

### 11.1 Coordinates — all verified 2026-08-21

| Thing | Value |
|---|---|
| Repository | `arunpr614/Life-Reflection` (private) |
| Project | **user** project number **1**, "Life Reflection" |
| Project node ID | `PVT_kwHOD9kkX84BgUtf` |
| Owner login | `arunpr614` |
| Your review board | View **8**, "Phase 1.5 Status", `BOARD_LAYOUT`, filter `label:phase1.5` |
| Your milestones | 50 (M1), 51 (M2), 52 (M3), 53 (M4), 54 (M5), 55 (M6) |

It is a **user** project, not an organisation project. `gh project` commands need `--owner arunpr614`; GraphQL needs `user(login: "arunpr614") { projectV2(number: 1) }`.

**The visibility rule, and it catches everyone:** an issue appears on view 8 **if and only if** it carries the `phase1.5` label **and** has been added to project 1. Both. An issue with the label but not added to the project is invisible to the owner's review, and nothing warns you.

### 11.2 The design issue — one per milestone

File one new issue per milestone. This is the durable home for the design: the requirements, the prototype, the screenshots, and the build instructions. It is what the owner asked for when they said the HTML should be *"pushed to GitHub issues so that it's retained and documented."*

Title: `Design — M<n> — <the surface, in the owner's words>`, e.g.
`Design — M1 — Calendar month view and application shell`

Body — same six-section register as every other ticket in this repo, in this order:

```markdown
## Outcome
## Scope
## Technical notes
## Acceptance criteria
## References
## Depends on
```

What goes where, for a design ticket:

- **Outcome** — what the owner can *see and judge* when this is done, in their own vocabulary. One or two sentences. Not "produce design artifacts."
- **Scope** — the screen-and-state inventory from §8.1 step 2. This is the section that does the work; it is the contract for what the prototype covers.
- **Technical notes** — the decided tokens; server-rendered-HTML constraints from §6.4; the specific UX rules that bind (`UX-IA-04`, `UX-NAV-02`, `UX-CAL-04`, and so on); what is deliberately excluded and which milestone owns it.
- **Acceptance criteria** — GitHub checkboxes. Include the `UI-DESIGN-INSTRUCTIONS.md` §9 items — rendered, screenshotted, differences listed in text, 375/768/1440, keyboard focus, no console errors, `CONTEXT.md` vocabulary, nothing from the §3 banned list, fictional fixtures — plus "owner has reviewed and approved."
- **References** — file paths with **line numbers**, e.g. `reference/UX-SPECIFICATION.md` §6.2 (line 225). Requirement IDs from the PRD. The prototype path.
- **Depends on** — the implementation issues this design governs, and the previous milestone's design issue.

For the register to match, read **issue #197** first (`GH_HOST=github.com gh issue view 197 --repo arunpr614/Life-Reflection`). It is the best-written ticket in the repo and the one to imitate for tone and density. Aim for 300–700 words.

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

### 11.3 Annotating the existing 36 issues

The owner said to *"create and detail out the design requirements in an existing GitHub issue ticket under the milestone or create a new GitHub issue ticket if required."* Do both, but keep them in their lanes:

- **The design issue (§11.2) is canonical.** Full specification, prototype, build instructions.
- **On each implementation issue the design governs, post a comment** — not a body rewrite. Those 36 bodies were written to a fixed six-section standard and the other agent's ~88 new tickets are being written to match it. Do not disturb the register.

The comment is short and specific to that ticket:

```markdown
## Design specification

Approved design: #<design-issue> · prototype `prototypes/m1-calendar-shell/` · variant **B (Editorial)**

For this ticket specifically:
- <the two or three design decisions that constrain *this* ticket>
- <exact token names, spacing, and copy strings it must use>
- <the states it must render, with where each appears in the prototype>

Build instructions: `docs/design/M1-BUILD-INSTRUCTIONS.md`
Permalink: <blob URL at the commit SHA>
```

```sh
GH_HOST=github.com gh issue comment 189 --repo arunpr614/Life-Reflection --body-file /tmp/c189.md
```

You may **append** a one-line pointer to an existing body (`Design: #<n>`) if the ticket would otherwise be ambiguous. You may not rewrite, retitle, or reorder a body.

If a milestone's design turns up a genuine gap — a screen or state that no existing ticket covers — say so in the design issue under a `## Gaps found` heading and tell the owner. **Do not file the implementation ticket yourself.** §16 explains why that boundary exists.

### 11.4 Getting the HTML into GitHub — the API limitation and the recipe

**You cannot attach files to an issue through the API.** GitHub's file-attachment upload is a web-UI-only path (drag and drop into the comment box). `gh` has no flag for it. So "push the HTML to GitHub issues" resolves to this, which is more durable than an attachment anyway:

1. **Commit the prototype** to `design/m1-m6-prototypes` and push.
2. **Get a permalink at the commit SHA** — not a branch URL, which moves under the reader:
   ```sh
   SHA=$(git rev-parse HEAD)
   echo "https://github.com/arunpr614/Life-Reflection/blob/$SHA/prototypes/m1-calendar-shell/index.html"
   ```
3. **Comment on the design issue** with the permalinks (HTML, CSS, JS, fixtures), the run command, and the screenshots.
4. **Paste the full build instructions as issue text**, via `gh issue comment --body-file docs/design/M1-BUILD-INSTRUCTIONS.md`. One source of truth, two homes, no divergence — the file is the source, the comment is the copy, and they are posted from the same file so they cannot drift.
5. **Set the `Design artifact` project field** (§11.6) to the prototype path.
6. **Screenshots** committed under `prototypes/<name>/screenshots/` render inline in the issue when referenced by permalink.

If the owner later wants the HTML literally attached so it survives without the repo, they can drag the file into the issue themselves in the browser, or you can add it as a release asset — ask, don't assume. Also offer this: for a self-contained artifact, a single-file build with CSS and JS inlined is easy to produce and easy to email or archive.

### 11.5 Labels — exactly what to apply

The vocabulary is fixed. **Do not create, rename, or delete labels** — the other agent is filing ~88 issues against this same list right now (§3.5).

| Slot | Value | Notes |
|---|---|---|
| Phase | `phase1.5` | **Always.** Without it the issue is invisible on view 8. |
| Type | `type:design` | For every design issue |
| Kind | `ui-prototype` | For every design issue — both of these already exist |
| Priority | `priority:high` \| `priority:medium` \| `priority:low` | M1 and M2 are `high`; M6 is `medium` |
| Status | `status:backlog` | At creation. Move to `status:in-progress` when you start the milestone, `status:done` on approval. |

Never apply: `phase1`, `phase2`, any `version:v*` label (those belong to the abandoned generation), `mvp`, or `roadmap`.

Note there is a bare `accessibility` label but no `type:accessibility`. If you need to flag an accessibility-specific finding, `accessibility` is the one that exists.

### 11.6 Project fields — add the issue, then set four values

```sh
# 1. add to the project; this prints the item ID
GH_HOST=github.com gh project item-add 1 --owner arunpr614 \
  --url https://github.com/arunpr614/Life-Reflection/issues/<N>
```

```graphql
# 2. Status
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: "PVT_kwHOD9kkX84BgUtf"
    itemId:    "<ITEM_ID>"
    fieldId:   "PVTSSF_lAHOD9kkX84BgUtfzhahTpA"
    value:     { singleSelectOptionId: "f75ad846" }
  }) { projectV2Item { id } }
}
```

Repeat for **Priority** (`PVTSSF_lAHOD9kkX84BgUtfzhah0Eg`) and then, as a text field:

```graphql
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: "PVT_kwHOD9kkX84BgUtf"
    itemId:    "<ITEM_ID>"
    fieldId:   "PVTF_lAHOD9kkX84BgUtfzhahz24"      # Design artifact
    value:     { text: "prototypes/m1-calendar-shell/" }
  }) { projectV2Item { id } }
}
```

**Field and option IDs, verified 2026-08-21:**

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

| Status option | ID |  | Priority option | ID |
|---|---|---|---|---|
| Backlog | `f75ad846` |  | High | `665e4024` |
| Next | `b753d38d` |  | Medium | `20d2f405` |
| In progress | `47fc9ee4` |  | Low | `2c5259bb` |
| Done | `98236657` |  | | |

**Set `Priority` explicitly.** On the 36 existing issues, priority exists only as a *label* — the project field is empty. Fill it on yours; it is what makes the board sortable for the owner.

Two more API notes:
- `Labels` and `Milestone` are derived from the issue. Set them with `gh issue create`/`gh issue edit`, never with a field mutation.
- Do not create or reconfigure project **views**. View 8 is the owner's. If you want a design-only view, ask them. (For reference, when creating a view via GraphQL the response payload field is `projectV2View`, not `view` — a mistake worth not repeating.)

### 11.7 Batching

Finish one milestone's GitHub work completely — design issue created, labelled, added to the project, all four fields set, implementation issues commented — before starting the next. Half-filed milestones are hard to audit and hard to resume, and the whole point of the loop in §8 is that each milestone reaches a clean stopping point.

---

## 12. The build instructions — what the implementation agent needs

Per approved milestone, write `docs/design/M<n>-BUILD-INSTRUCTIONS.md` and post it to the design issue (§11.4). The reader is a **different agent, with no design context, who will not have seen the prototype conversation and may not run the prototype at all.** Assume it reads only this file and the ticket.

It must contain, in this order:

1. **The approved variant**, named, and one paragraph on why it won. Includes anything grafted from a losing variant, because that is usually where the owner's real preference lives.
2. **The tokens**, verbatim and copy-pasteable — every custom property, its value, and its job. This is the drop-in for #187.
3. **Screen-by-screen build notes.** For each screen: the DOM structure that carries the design (as HTML, not prose), which tokens apply where, spacing in token units not pixels, and the exact copy strings from `CONTEXT.md`. Where markup order matters for semantics or reading order, say so.
4. **State-by-state specification.** Every state from the inventory: what triggers it, what it renders, its exact copy. **Empty, loading, and error states are specified here, not left to the implementer** — that is precisely how a careful design becomes an inconsistent app.
5. **Interaction and keyboard contract.** Tab order, arrow-key behavior, Enter/Escape, focus management after a mutation or dialog dismissal, what receives focus on page load.
6. **Responsive behavior** at 375 / 768 / 1440: what reflows, what the rail becomes, what collapses, and what must never be covered (UX §4.2's compact rules — bottom navigation must not cover save bars, dialogs, gallery controls, or the final lines of journal text).
7. **Accessibility requirements**: heading structure, landmarks, labels, live-region announcements, the measured contrast ratios you verified and where.
8. **Server-rendered translation.** The prototype uses client JS to make states reachable; the app is server-rendered HTML. State plainly which interactions are real page loads or form posts, and which are genuine progressive enhancement. This is the single most useful section for the implementation agent and the easiest to skip.
9. **What the prototype fakes.** Fixtures, stubbed submits, in-memory reordering, synthetic imagery. Be explicit so nobody mistakes a stub for a specification.
10. **What is deliberately absent**, and which milestone owns it.

One page of screenshots at the end, referenced by permalink, is worth a lot here.

---

## 13. Merge strategy

- Commit after each **approved** milestone. Message register: `Design M1: calendar shell and month view prototype` — plain, present-tense, no ceremony.
- Push after every commit so nothing lives only on your machine.
- **Do not open a PR after each milestone.** One PR near the end, or when the owner asks. Six PRs into `main` for a design pass is noise.
- The PR body: what was designed, which variant won per milestone, links to the six design issues, and the one-line note from §3.6 explaining why `plan/implementation`'s commits appear in the diff.
- Do not merge it yourself. The owner reviews and merges.
- Do not rebase onto `main` (§3.6). Do not merge `main` into your branch unless something on `main` actually breaks you.

---

## 14. Open questions — surface these, do not decide them

Put these to the owner at the point they become relevant. Do not batch them into an interrogation at the start, and do not answer them yourself by picking whatever unblocks you fastest.

1. **What goes in the navigation rail at M1?** Most secondary surfaces do not exist until M7+. Design for now and say how it grows. This is an M1 question and it should be in the M1 handover. (§6.1)
2. **Synthetic imagery, or the owner's own photos in a gitignored folder?** Affects how much of an image-first design they can actually judge. M1. (§10.3)
3. **Dark theme in v0.1, or light only?** UX §28 (line 1075) specifies both. The implementation plan does not commit to shipping both in v0.1. Two themes roughly doubles the states you design and verify. Ask before M1's build, because it changes the token architecture.
4. **Does M6 get a design issue at all?** It is four states and a responsive pass. Reasonable either way. (§9, M6)
5. **Should `UI-DESIGN-INSTRUCTIONS.md` be committed?** It is binding for every UI agent and it is currently untracked, so it exists in exactly one working tree. (§3.4)
6. **Do the AI-derived slots get designed as placeholders now, or left out?** UX §9.4 (line 363) specifies title, summary, and tags on the Journal Day page; they arrive in M10. Designing the empty slots now avoids a relayout later, but shows the owner a page with visible gaps. Recommend the slots; let them decide.

---

## 15. Definition of done

### 15.1 Per milestone — all of it, every time

- [ ] Milestone's issues read in full; UX sections from §4.2 read
- [ ] Screen-and-state inventory written **before** designing
- [ ] Design issue filed: six sections, correct labels, on project 1, all four fields set
- [ ] Prototype built, variants per §7.3(a), every inventoried state reachable by clicking
- [ ] Rendered in a real browser; screenshotted
- [ ] Compared against intent with **differences listed in text**; loop re-run until the list is empty
- [ ] Checked at 375 / 768 / 1440
- [ ] Keyboard-tabbed; focus visible on every interactive element
- [ ] `prefers-reduced-motion` honored wherever motion exists
- [ ] Contrast **measured** via `lighthouse_audit`, not eyeballed
- [ ] Zero console errors (`list_console_messages`)
- [ ] Zero third-party network requests
- [ ] Copy uses `reference/CONTEXT.md` vocabulary throughout
- [ ] Nothing from the §7.5 banned list shipped without a stated reason
- [ ] Adversarial "what looks AI-generated here" pass run; findings and fixes reported
- [ ] Fixtures fictional; no real photo or journal line anywhere
- [ ] Handed to the owner in the §8.2 format; **stopped and waited**
- [ ] Owner's feedback incorporated; loop re-run; owner approved explicitly
- [ ] Prototype committed and pushed; permalink and build instructions posted to the issue
- [ ] `Design artifact` field set; implementation issues commented
- [ ] Design issue moved to `status:done` and project Status `Done`

### 15.2 For the whole assignment

- [ ] `docs/design/DESIGN-SYSTEM.md` — one page, reviewed before M1's build
- [ ] Six approved prototypes under `prototypes/`
- [ ] Six design issues, all on view 8, all with `Design artifact` set
- [ ] Six build-instruction documents, each posted to its issue
- [ ] All 36 implementation issues that a design governs have a design comment
- [ ] Any gaps found recorded in the relevant design issue under `## Gaps found` — **not** filed as tickets
- [ ] The six §14 questions asked and answered, or explicitly left open with the owner's knowledge
- [ ] Branch pushed; PR opened only when the owner asks or all six are approved
- [ ] `git status` in the primary clone still shows exactly the four files from §3.4, untouched

### 15.3 Verification commands

```sh
cd /Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days-design

# Your design issues, with labels and milestone
GH_HOST=github.com gh issue list --repo arunpr614/Life-Reflection \
  --label type:design --state all \
  --json number,title,milestone,labels \
  --jq '.[] | "#\(.number) \(.milestone.title) [\(.labels|map(.name)|join(","))] \(.title)"'

# Any design issue missing from the project board? (should print nothing)
for n in $(GH_HOST=github.com gh issue list --repo arunpr614/Life-Reflection \
             --label type:design --state all --json number --jq '.[].number'); do
  in_project=$(GH_HOST=github.com gh issue view "$n" --repo arunpr614/Life-Reflection \
    --json projectItems --jq '.projectItems | length')
  [ "$in_project" -eq 0 ] && echo "NOT ON BOARD: #$n"
done

# No third-party requests in any prototype (should print nothing).
# BSD grep on macOS has no -P, so filter in two steps rather than using a lookahead.
grep -rnoE 'https?://[^"'"'"' )]+' prototypes/ --include='*.html' --include='*.css' --include='*.js' \
  | grep -v '127\.0\.0\.1' | grep -v 'localhost'

# Nothing of the owner's swept up (should show only your own files)
git status --short
git -C ../Life-in-Days status --short   # must be exactly the four files from §3.4
```

---

## 16. Three things about how to work here

**Design for someone's fourteen years, not for a portfolio.** The owner is going to look at this most days, alone, to remember things. The interface that wins is the one that gets out of the way of a photograph and a paragraph. `UI-DESIGN-INSTRUCTIONS.md` §3 puts it as *"personal and inhabited, not a dashboard, not a product marketing page"* — that is the whole brief, and it is easier to state than to hold onto by the fourth milestone.

**Do not flag a gap and then quietly build around it.** If a milestone's tickets do not cover a screen you think is needed, say so in the design issue and tell the owner. Do not file the ticket, do not extend the prototype to cover it, do not decide on their behalf. The agent that wrote this handover did exactly that once — noticed there was no way to get a real photo into the app, then designed a whole ingest path before mentioning it. The owner approved the design, but they should have been asked first. The `## Gaps found` heading exists so you have somewhere to put the observation without acting on it.

**"Looks good" is not a comparison; it is a refusal to compare.** That line is from §1 of your binding instructions and it is the one thing that separates design work from generated markup. You cannot see what you build. Write the differences out, every time, even when — especially when — you are confident.



