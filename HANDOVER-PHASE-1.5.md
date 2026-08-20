# Handover — Phase 1.5 planning and UI prototyping

**Written:** 2026-08-20 · **For:** the next AI agent · **Repo state at handover:** `main` = `d85561e`

Read this file completely before doing anything. Then read `CLAUDE.md`, `RESET-DECISION.md`, and `reference/CONTEXT.md`. Everything you need to start is either in this file or linked from it.

---

## 1. Your mission

Three deliverables, in this order:

1. **An implementation plan** for the Life in Days MVP — one document, `docs/IMPLEMENTATION-PLAN.md`. How the app gets built, in what order, with what technology, and where the real risks are.
2. **Phase 1.5 execution milestones and work tickets** on GitHub — a set of milestones, each holding tickets that are ready to execute. Correctly labelled, correctly milestoned, each with enough detail that an implementing agent (or the owner) can start without asking questions.
3. **UI prototypes** — establish the actual look and feel of the web app. This is collaborative design work with the owner, not a solo deliverable.

**Note on terminology:** the owner refers to these as "Jira issues." This project has no Jira. All tickets are **GitHub Issues** in `arunpr614/Life-Reflection`. Use GitHub Issues; the existing `phase1`/`phase2` tickets are the precedent.

---

## 2. Ground truth: where things are

| What | Where |
| --- | --- |
| **Project folder (work here)** | `/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days` |
| Archive worktree (read-only reference) | `/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days-archive` |
| GitHub repo | `https://github.com/arunpr614/Life-Reflection` (private) |
| GitHub Project board | `https://github.com/users/arunpr614/projects/1` ("Life Reflection") |
| Live branch | `main` (currently one root commit, `d85561e`) |
| Archived history | branch `archive/generation-0`, tag `gen0-final`, both at `fb59c1f` |

### Do not touch these

`/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect/` is a **separate, older clone** containing ~63 registered git worktrees from the previous effort (`Phase1-r0-gatea-*`, `Phase1-gen0-*`, and similar). It is unrelated to your work. Never `cd` into it, never run `git worktree prune`, `git clean`, `git reset`, or `rm -rf` anywhere inside it. It is a museum, and a previous session nearly damaged it with a careless shell glob.

---

## 3. How to work with git and worktrees

The project uses **one repo, two worktrees**:

```
Life-in-Days/           → branch main            ← you work here
Life-in-Days-archive/   → branch archive/generation-0  ← read-only, look but don't commit
```

Confirm this before starting:

```sh
cd /Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days
git worktree list
git status --short --branch     # expect: ## main...origin/main, clean
```

### Rules

- **Work on a branch, not directly on `main`.** Create one per unit of work: `git worktree add ../Life-in-Days-<topic> -b <topic>`, or just `git checkout -b <topic>` in the main worktree if you aren't running things in parallel. Suggested branch names: `plan/implementation`, `tickets/phase-1.5`, `ui/prototype-shell`.
- **Prefer a new worktree when you need two things checked out at once** (e.g. comparing your prototype against the archived v10). Clean up with `git worktree remove <path>` when done.
- **Never force-push `main`.** Branch protection blocks force-push and deletion. That protection is deliberate — the previous history was reset once, and that was enough.
- **Never commit anything under `data/`.** It is gitignored. Real journals and photos live there.
- **Every commit leaves the repo in a working state.** If you add a `package.json`, the app must still start.
- Open a PR into `main` for review rather than pushing directly, unless the owner says otherwise.

### GitHub identity — this matters

Two GitHub hosts are authenticated on this machine. You must always use the personal one:

```sh
GH_HOST=github.com gh issue list --repo arunpr614/Life-Reflection
```

Prefix **every** `gh` call with `GH_HOST=github.com`. Never use the `daydreamer614` / `github.toasttab.com` (work) account for anything in this project. This is a standing rule in `CLAUDE.md`.

---

## 4. What happened before you (and why it matters)

This project ran from roughly 2026-08-13 to 2026-08-19 and produced **no working software**. Not a partial app — nothing that renders a journal entry.

What it did produce: 137 commits, 466 markdown planning documents, a 58-task governance roadmap, a five-seat "Product Council" review process, per-task "dossiers" with six artifacts each, and finally a ~5,800-line multi-agent coordination "control plane" with a hash-chained event ledger, fencing tokens, and 28 named invariants.

Two independent AI-agent sessions stalled. The second one ended blocked on this: its own self-imposed budget allowed 13 agent assignments, it needed 14, and raising that number required an owner decision that never came. It died waiting on a number it had invented about itself.

### The root cause

The repo's own instructions were the trap. The old `AGENTS.md` (27KB) opened with a non-negotiable rule that every change must update seven projections simultaneously. The old `README.md` said no work was authorized unless its dossier was `Ready` — and all 58 dossiers were `Incomplete`. So the honest reading of that repo was: *writing product code is forbidden.* Every competent agent that read it concluded the only permitted work was governance work, and dutifully built more governance.

**You are being handed a deliberately clean slate so this cannot happen again.** `CLAUDE.md` now contains one hard rule:

> No meta-tooling. Do not build validators, registries, ledgers, councils, dossiers, readiness states, or any code whose purpose is to govern this project. If a change doesn't move pixels or data for the single user, don't make it.

### The tension in your own assignment — read this twice

You have been asked to produce a plan and a pile of tickets. **That is exactly the activity that killed this project twice.** The difference must be discipline about proportion:

- The plan is **one document**, and it should be readable in 15 minutes. Not a document tree.
- Aim for roughly **25–40 tickets total**, not 58, and certainly not 300.
- Every ticket describes **something a person can build in about a day** and see the result of.
- **No ticket may be about process.** No approval gates, no readiness states, no evidence registries, no council reviews, no traceability matrices, no "artifact bundles."
- If you find yourself designing a system to track the work rather than doing the work, stop and re-read this section.

Success looks like: the owner reads your plan, opens the first ticket, and starts writing application code that afternoon.

---

## 5. What the product is

**Life in Days** — a private, single-user visual memory archive. Journals and daily photos, organized on a calendar, for reflection.

Sources of content, eventually: VoiceNotes (text journals, auto-imported), a private Telegram bot (daily photos), and manual `.txt`/`.md` upload. AI later derives titles, summaries, tags, and artwork — always visibly separate from authentic content.

### Vocabulary you must use correctly

`reference/CONTEXT.md` is the canonical glossary (125 lines, read it in full — it is the single most valuable salvaged artifact). The critical distinctions:

- **Journal Day** — everything associated with one calendar date. Not "diary entry."
- **Journal Date** — the *editable* date assigning a Source Item to a Journal Day. Distinct from…
- **Original Timestamp** — the *immutable* capture/delivery time. Changing a Journal Date never changes this.
- **Journal Timezone** — fixed `Asia/Kolkata`. Not device timezone.
- **Source Item** — authentic content from the user. **Derived Artifact** — AI-produced, replaceable, never masquerades as authentic.
- **Needs Date Review** — holding state when a Journal Date can't be determined.

Use these terms in ticket titles, bodies, code identifiers, and UI copy. Getting this vocabulary right is most of what made the old planning work valuable.

### Product principles (from `reference/PRINCIPLES.md`)

- Authentic journals/photos stay distinct from AI-derived titles, summaries, tags, briefs, artwork.
- **Real photos and photo-derived data must never be sent to AI providers.**
- Journal Dates use fixed `Asia/Kolkata`; original timestamps preserved.
- Private, single-user. No sharing, public links, reminders, coaching, or historical import in MVP.
- Backdating is deliberate and visible; receipt time is never silently the Journal Date.

---

## 6. What's in the repo right now

```
Life-in-Days/
├── CLAUDE.md                 ← operating rules. Binding.
├── README.md
├── RESET-DECISION.md         ← why the reset happened, MVP definition of done
├── HANDOVER-PHASE-1.5.md     ← this file
├── .gitignore                ← data/, *.sqlite, node_modules, .env already covered
├── .claude/settings.json     ← bypassPermissions for this project
└── reference/                ← salvaged notes. NOT authority.
    ├── CONTEXT.md                                  (125 l)  domain glossary — read fully
    ├── PRINCIPLES.md                               (9 l)    product principles
    ├── PRODUCT-REQUIREMENTS.md                     (380 l)  the PRD
    ├── UX-SPECIFICATION.md                         (1335 l) 35-section UX spec
    ├── HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md     (418 l)  deployment research
    └── prototype-v10/                              the working static UI prototype
```

There is **no application code yet.** Nothing. You are planning work that starts from an empty `src/`.

### How to treat `reference/`

Background reading that describes *intent*. It is not a contract to satisfy before writing code, and it is not a specification to implement wholesale. The PRD and UX spec describe the **full** product across many releases — far beyond the MVP. Mine them for decisions already made (timezone policy, backdating semantics, what's derived vs authentic) so you don't re-litigate; ignore their scope.

Useful entry points:
- `PRODUCT-REQUIREMENTS.md` §Requirements (line ~104) — the requirement blocks, including `LID-*` requirement IDs you can cite in tickets.
- `UX-SPECIFICATION.md` §6 Calendar (213), §9 Journal Day detail (323), §10 Manual journal upload (404), §28 Light and dark themes (1075), §29 Component inventory (1130). These four map most directly to the MVP.

### The v10 prototype — your UI starting point

`reference/prototype-v10/` is a genuinely designed, working static prototype: calendar, search, almanac, day detail, plus loading/failure/interruption states. Verified working at handover time. Run it:

```sh
cd reference/prototype-v10
python3 -m http.server 4173 --bind 127.0.0.1
# open http://127.0.0.1:4173/index.html?view=calendar&month=2026-08
```

It is browser-memory-only with fictional fixtures — no backend, no persistence. `app.js` is a single 258KB file. Its own README documents the v10 behavioural contract in detail and is worth reading; note its `../../` links point at archived governance files that no longer exist here.

**Do not redraw this from scratch.** It represents real design effort and the owner has already reviewed it through ten iterations. Your prototype work should build on its visual language.

---

## 7. Current GitHub state

### Labels (relevant ones)

| Label | Meaning |
| --- | --- |
| `phase1` | **Retired.** The old governance roadmap. All 45 issues closed as not-planned. Do not reuse. |
| `phase1.5` | **Yours.** Created for you. Apply to every ticket you create. |
| `phase2` | **Do not touch.** 20 open issues, prototype design v17–v35. Future work, owner's explicit instruction. |
| `mvp` | 8 issues (#174–181) created during the reset. See below. |
| `ui-prototype` | Created for you. Apply to UI look-and-feel tickets. |

Also available and worth using: `type:design`, `type:architecture`, `type:implementation`, `type:quality`, `type:spike`, `priority:high|medium|low`, `status:backlog|next|in-progress|done`, `roadmap`, `documentation`, `accessibility`.

### Milestones

All 12 Phase 1 milestones (`P0`, `R0`–`R10`) are **closed**. The Phase 2 milestones (`Phase 2 — …v17–v35`, plus a program/closeout one) are open and **not yours**.

You will create new Phase 1.5 milestones. Naming convention to follow — it keeps the board readable alongside Phase 2:

```
Phase 1.5 — M1 — <short outcome>
Phase 1.5 — M2 — <short outcome>
...
```

Each milestone is an **execution milestone**: a coherent, demoable increment. Not a process stage. "M1 — Calendar renders real journal days" is a milestone; "M1 — Requirements complete" is not.

### Existing `mvp` issues #174–181

These 8 tickets were created during the reset as a first sketch of the vertical slice. They have no milestone and no phase label:

| # | Title |
| --- | --- |
| 174 | Project skeleton: Node + TypeScript + Fastify + better-sqlite3 |
| 175 | SQLite schema: journal_day, source_item, media |
| 176 | Importer: fold of real .txt/.md journal files into journal_day rows |
| 177 | Manual photo upload, assigned to a Journal Date |
| 178 | Wire the v10 prototype calendar markup to real server-rendered data |
| 179 | Day detail view: render one real journal entry with its real photo |
| 180 | Local dev script + smoke check |
| 181 | Post-MVP: decide next increment (Telegram import, VoiceNotes, auth, or deployment) |

**Recommendation:** fold them into Phase 1.5 rather than duplicating them — add the `phase1.5` label, assign each to the right new milestone, and expand the bodies to meet your ticket standard. Close any that your plan supersedes, with a comment saying which ticket replaces it. Confirm this approach with the owner before mass-editing.

### The Project board

Project 1 has 32 fields including `Status` (Backlog/Next/In progress/Done), `Priority`, `Requirement IDs`, `Design artifact`, `Owner role`, `Start date`, `Target date`. Its README still describes the old Phase 1/Phase 2 structure — it will need a Phase 1.5 section once your milestones exist. Ask the owner whether they want a dedicated Phase 1.5 board view before creating one.

---

## 8. The MVP, and the technical direction agreed so far

### Definition of done for v0.1 (from `RESET-DECISION.md`)

> Open the app locally, see a real month as a calendar grid, click a day, read an actual journal entry with an actual photo attached.

Explicitly **out** of v0.1: Telegram, VoiceNotes, any AI, authentication, encryption at rest (SQLCipher), Docker, CI. Each is a later increment on something that already works.

### Agreed stack

Node + TypeScript + Fastify + `better-sqlite3`, server-rendered HTML reusing the v10 CSS. One process. No React, no Next.js, no ORM. Rationale: deploys to a single Hetzner host as one process, no build step to debug, and it keeps the hard problems yours (timezones, photo handling) rather than the framework's.

The owner has agreed to this. You may challenge it **once**, briefly, with concrete reasons, before planning starts — but do not spend a session on stack evaluation.

### Sequencing agreed with the owner

**local → GitHub (from commit #1) → verify locally → production.** Build on the Mac, commit as you go, prove it works with real personal data locally, and only then deploy to the Hetzner host per `reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md`.

### Real risks to surface in your plan

These are genuinely unknown, because the old effort never got close enough to hit them:

1. **VoiceNotes access** — was assumed, never tested. Is there an API? An export? This may need a spike ticket.
2. **Telegram photo export format** — likewise assumed.
3. **Journal Date parsing from real files** — you don't yet know how the owner's actual journal files are named or structured. Ask, or spike against real data early.
4. **Photo volume and storage** — unknown scale, affects storage decisions.
5. **Deployment authority** — the Hetzner host is described in a document; nobody has verified current access.

A short spike ticket for an unknown beats a confident plan built on an assumption.

---

## 9. Ticket standard — "ready to execute"

The owner explicitly asked that each item have "all the required artifacts and details for beginning the execution." Here is the bar. Keep bodies tight — the old project's tickets were 3,000+ characters of governance boilerplate, which is the failure mode, not the standard.

```markdown
## Outcome
One or two sentences: what is true when this is done, from the user's point of view.

## Scope
- Bullet list of what's in.
- Explicitly list what's out, if there's an obvious adjacent temptation.

## Technical notes
Files/modules expected to change. Schema shape if relevant. Named domain terms
from reference/CONTEXT.md. Any decision already made that the implementer
shouldn't re-open.

## Acceptance criteria
- [ ] Concrete, checkable statements.
- [ ] At least one that is verifiable in a browser or a shell command.

## References
- reference/CONTEXT.md — <term> definition
- reference/UX-SPECIFICATION.md §<n> — <section>
- Requirement IDs: LID-XXX-000 (if applicable)

## Depends on
#<issue> (or "nothing")
```

Also required on every ticket:
- Labels: `phase1.5`, one `type:*`, one `priority:*`, `status:backlog`
- A Phase 1.5 milestone
- Added to Project 1

Every ticket must satisfy: **an implementing agent can open this and start, without asking a question.** If it can't, it's not ready. If it needs a decision the owner must make, that's a separate blocking item — say so explicitly rather than burying an assumption.

---

## 10. UI prototype work

The owner wants your help developing "what the look and feel of the UI of the web app will be." This is interactive design work — expect iteration and opinions, and show options rather than presenting one answer as settled.

Guidance:

- **Start from v10.** Run it, study it, and treat its visual language as the baseline. The owner has iterated on it ten times.
- **Scope to MVP screens:** calendar month view, Journal Day detail, manual upload, empty/first-use state. That's it. The v10 prototype covers much more; ignore the rest for now.
- **Where prototypes live:** propose a location, e.g. `prototypes/` at repo root — deliberately *not* inside `reference/`, which is frozen salvage. Keep new prototype work clearly separate from the archived v10 files.
- **Stay dependency-free** if you can — static HTML/CSS/JS served locally, matching how v10 works. It makes review instant and keeps the path open to reusing the markup in the real server-rendered app (that's the point of ticket #178).
- **Light and dark themes** are already specified — `reference/UX-SPECIFICATION.md` §28. Don't invent a palette without reading it.
- **Accessibility** — §26 has a real contract, and there's an `accessibility` label. Don't gold-plate, but don't design something that can't be keyboard-navigated.
- **Do not touch the `phase2` v17–v35 design tickets.** They cover overlapping ground (Trash, suppressions, search, artwork states). If your work overlaps, note it in your ticket and move on; the owner will reconcile later.
- **Use fictional data in anything committed.** Never commit the owner's real journal text or photos into a prototype fixture.

The Chrome DevTools MCP tools are available in this environment, which means you can actually open a prototype, screenshot it, and iterate on the rendering rather than guessing.

---

## 11. Decisions to get from the owner

Don't guess at these. Ask early, in one batch, rather than blocking mid-plan:

1. **Existing `mvp` issues #174–181** — fold into Phase 1.5 (recommended), or close and replace?
2. **Real journal data** — how are the actual VoiceNotes/journal files named and structured? Can you see a sample (kept out of git)?
3. **Milestone count and pacing** — how many increments does the owner want, and is there any date pressure? All old due dates are void.
4. **A Phase 1.5 board view** on Project 1 — wanted, or is milestone grouping enough?
5. **Hetzner host** — does current access exist, and is production still the intended target?
6. **Stack** — confirm Node/TS/Fastify/SQLite, or does the owner want to revisit?

---

## 12. Guardrails — do not do these

- Do not recreate councils, dossiers, gates, readiness states, approval registries, evidence ledgers, or traceability matrices. This is the documented cause of the project's failure.
- Do not write code whose purpose is to govern the project. Write code that shows the owner their memories.
- Do not touch `phase2` issues or milestones.
- Do not reopen or resurrect `phase1` issues; they're closed for a reason. Reference `gen0-final` if you need the history.
- Do not enter `AI_Life_reflect/` or disturb its worktrees.
- Do not use the `daydreamer614` / toasttab GitHub identity.
- Do not commit real personal data, credentials, or private URLs.
- Do not force-push `main`.
- Do not produce a document tree. One implementation plan, one set of tickets.
- Do not let planning consume the whole engagement. If the plan isn't converging, ship a smaller plan.

---

## 13. Suggested first session

1. Verify your environment: `git worktree list`, `git status`, and `GH_HOST=github.com gh issue list --repo arunpr614/Life-Reflection --label phase1.5` (expect empty).
2. Read `CLAUDE.md`, `RESET-DECISION.md`, `reference/CONTEXT.md` (full), `reference/PRINCIPLES.md`.
3. Skim `reference/PRODUCT-REQUIREMENTS.md` §Requirements and `reference/UX-SPECIFICATION.md` §§6, 9, 10, 28, 29.
4. Run the v10 prototype and click through it.
5. Read issues #174–181.
6. Ask the owner the §11 questions.
7. Draft `docs/IMPLEMENTATION-PLAN.md` on a branch; get agreement on the milestone shape **before** creating 30 tickets.
8. Create milestones, then tickets, then update the Project board.

### Command cookbook

```sh
# Always work from the project folder
cd /Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days

# Create a milestone
GH_HOST=github.com gh api -X POST repos/arunpr614/Life-Reflection/milestones \
  -f title="Phase 1.5 — M1 — <outcome>" -f description="<one line>"

# Create a ticket
GH_HOST=github.com gh issue create --repo arunpr614/Life-Reflection \
  --title "<title>" --body-file /tmp/body.md \
  --label "phase1.5,type:implementation,priority:high,status:backlog" \
  --milestone "Phase 1.5 — M1 — <outcome>"

# Add to the project board
GH_HOST=github.com gh project item-add 1 --owner arunpr614 \
  --url https://github.com/arunpr614/Life-Reflection/issues/<n>

# Look something up in the archived history without leaving main
cd ../Life-in-Days-archive && grep -rn "<term>" docs/ | head
```

---

## 14. One-paragraph summary

Life in Days is a private single-user journal-and-photo calendar archive that has been planned exhaustively and never built. The repo was reset to a clean slate on 2026-08-20; all that survives is a domain glossary, a PRD, a UX spec, a working static v10 UI prototype, and Hetzner deployment research, all under `reference/` as non-binding notes. Two prior AI agents failed by building governance machinery instead of the product, so the single hard rule now is: no meta-tooling, and every session ends with something visible in the browser. Your job is a tight implementation plan, ~25–40 genuinely executable Phase 1.5 tickets across demoable milestones, and collaborative UI prototype work that builds on v10 — aiming at one target: the owner opens the app on their Mac, clicks a day, and sees their own journal entry and their own photo.
