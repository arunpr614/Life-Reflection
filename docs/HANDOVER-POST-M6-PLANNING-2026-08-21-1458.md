# Handover — finish the post-M6 plan and file the M7–M19 tickets

**Written:** Friday, 21 August 2026, 14:58 IST
**Written by:** the agent working from `docs/HANDOVER-M7-M19-TICKETING.md`, one session in
**For:** the next AI agent picking this up
**Relationship to prior documents:** `docs/HANDOVER-M7-M19-TICKETING.md` is the controlling brief and still governs the *job* — what to build, in what register, under what rules. This document does not replace it and does not repeat all of it. Read that file in full; this one tells you exactly how far its instructions have been carried out, what was decided or discovered along the way, and where to pick up. Where the two disagree about a fact of the world (a line number, an ID, a file's existence), **this document is newer and wins.** Where they disagree about what the job *is*, the original brief wins — nothing here changes the scope, the six-section ticket structure, or the "no product code" boundary.

---

## 0. The 60-second version

Life in Days is a private, single-user journal archive. `docs/IMPLEMENTATION-PLAN.md` took it from nothing to a deployed app (M1–M6, 36 GitHub issues, all filed). The owner then expanded Phase 1.5 to cover the full v1 product — Telegram capture, voice-journal capture, AI titles/summaries/tags, generated artwork, search, encryption, backups, System Health, accessibility — and `docs/HANDOVER-M7-M19-TICKETING.md` is the brief for that expansion: write a sequel plan document, then create 13 new milestones (M7–M19) and roughly 88 GitHub issues for them, all on the owner's project board.

**Your job is definition only. Not one line of product code.** The deliverable is a Markdown plan document plus GitHub milestones/issues plus a PR containing the plan document. Nothing else.

**Where things stand:** the sequel plan document exists but is only **~15% written** (through §2.4 of a planned 9-section document) and **is not committed** — it is untracked on disk right now. **Zero of the 13 milestones and zero of the ~88 issues have been created.** The most important thing not to do yet: do not file a single milestone or issue until the plan document is finished, internally consistent, and committed. The controlling brief's own reasoning for this order (§12): writing the plan first is how you catch your own contradictions before they get frozen into 88 tickets.

---

## 1. Which folder to work in

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days
```

That is the repository root. It is a git worktree (see §2) checked out on branch `plan/post-m6`, remote `origin` = `https://github.com/arunpr614/Life-Reflection.git`.

### 1.1 Other directories and what each permits

| Path | What it is | Your access |
|---|---|---|
| `Life-in-Days-archive` (sibling dir, one level up) | A registered git worktree of the **same repo**, checked out on `archive/generation-0` (the frozen salvage from the failed pre-reset effort — `AGENTS.md`, `RUNNING_LOG.md`, ~85 files) | Read-only reference if genuinely curious about prior art. Do not modify, do not check out that branch in the main tree. |
| `Life-in-Days-design` (sibling dir, one level up) | A registered git worktree of the **same repo**, checked out on `design/m1-m6-prototypes` (12 entries: `prototypes/`, `docs/`, etc.) | Unrelated to this task. Do not touch. |
| `reference/prototype-v10/` (inside the main tree) | The owner's tenth design iteration — ~380KB of CSS/JS, source of the decided visual-design tokens (§6.3 below) | Mine specific token values on citation only; this task does not write CSS. |

### 1.2 Danger zones

The controlling brief names one forbidden sibling clone:

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect/
```

**This still exists — confirmed by directory listing today, 2026-08-21.** It is a separate, older clone of the same project from the abandoned pre-reset effort, containing roughly 63 registered git worktrees. **Never `cd` into it. Never run `git worktree prune`, `git clean`, `git reset`, or `rm -rf` anywhere inside it.** It is not your concern and damaging it is not recoverable. If a tool ever resolves a path into it, stop and tell the owner.

**New finding, not in the original brief:** two more siblings from the same lineage are present — `AI_Life_reflect-phase2-v17-v35` and `AI_Life_reflect-worktrees`. I confirmed their existence via `ls` only; I did not enter either. Treat them with the same caution as `AI_Life_reflect/` until told otherwise — they are almost certainly part of the same abandoned effort's worktree sprawl, not something you were asked to touch.

On tool permissions: I could not determine from inside the session whether `--dangerously-skip-permissions` (or an equivalent auto-approve setting) is active. Every tool call I made this session — reads, `git`, `gh` — executed without a visible permission prompt returning to me, which is consistent with some auto-approve mode being on, but I have no way to confirm it. **Do not assume a permission prompt will stop a destructive command.** The guardrail is your own discipline against §1.2 and §2.3, not the harness.

### 1.3 Files that live outside the working tree

None. Everything this task needs is inside the repo root above — no other clone, drive, or external store is involved.

---

## 2. What the git tree should be

### 2.1 Current state, verified 2026-08-21 14:58 IST

```
$ git branch --show-current
plan/post-m6

$ git status --short
 M CLAUDE.md
 M HANDOVER-PHASE-1.5.md
 M README.md
?? .mcp.json
?? UI-DESIGN-INSTRUCTIONS.md
?? docs/IMPLEMENTATION-PLAN-POST-M6.md

$ git log --oneline -8
f1745d2 Add handover: post-M6 plan and M7-M19 ticketing brief
b86191d Fix §5.6: CSS token layer now correctly cites the decided v10 palette, not UX §28.1
c302eb8 Record decisions: v10 palette/rail, ingest approved as designed
6478687 Extend the GitHub identity rule to cover commit authorship
5e0d7ff Add Phase 1.5 implementation plan
53d2e5a Add Phase 1.5 handover for the next agent
d85561e Fresh start: reset main to a clean slate

$ git worktree list
.../Life-in-Days          f1745d2 [plan/post-m6]
.../Life-in-Days-archive  fb59c1f [archive/generation-0]
.../Life-in-Days-design   4d94833 [design/m1-m6-prototypes]

$ git remote -v
origin  https://github.com/arunpr614/Life-Reflection.git (fetch)
origin  https://github.com/arunpr614/Life-Reflection.git (push)

$ git log -1 --format='%an <%ae>'
Arun Prakash N <arunpr614@users.noreply.github.com>
```

`plan/post-m6` sits on top of the M1–M6 work (`5e0d7ff`, `6478687`, `c302eb8`, `b86191d`) plus its own commit `f1745d2` adding the controlling brief. **No PR has been opened yet** — `gh pr list --head plan/post-m6 --state all` returns empty. `gh pr list` for `plan/implementation` also has not merged into `main` as of this writing (per the controlling brief §7.8's note); expect the eventual PR diff to carry both branches' commits.

### 2.2 Uncommitted work — the most important fact in this document

Five files are uncommitted. **Four of them are not yours and one of them is the entire deliverable so far.**

- ` M CLAUDE.md`, ` M HANDOVER-PHASE-1.5.md`, ` M README.md`, `?? UI-DESIGN-INSTRUCTIONS.md` — **the owner's own edits**, made with a different AI agent, confirmed by the owner as his. Per the controlling brief §3.4: do not commit them, do not revert them, do not stage them, do not "clean up" the working tree.
- `?? .mcp.json` — appeared during this session (a local MCP server config for `chrome-devtools-mcp`, unrelated to this ticketing task). I did not create it and don't know who or what did. Leave it alone; it is not part of this deliverable either way.
- **`?? docs/IMPLEMENTATION-PLAN-POST-M6.md` — this is your work in progress, and it exists only on this local disk.** It is 133 lines, written through §2.4 of a planned nine-section document (see §3.5 and §6.2 below for the full inlined content). It is not committed. If this working tree is lost — a different agent starts fresh elsewhere, a worktree is pruned, a disk fails — this content is gone and has to be rewritten from this handover's §6.2, which is the only other place it exists in full.

**Recommended first action, before any other work: commit this file, by itself, with an explicit path.**

```sh
git add docs/IMPLEMENTATION-PLAN-POST-M6.md
git commit -m "WIP: post-M6 plan through §2.4 (stack and data-layout additions)"
```

Do this even though the document is incomplete — an incomplete committed draft survives; an incomplete uncommitted draft does not. Continue writing after the commit; make further commits as you extend it, or one commit when it's finished — either is fine, but get the current 133 lines off the working tree first.

### 2.3 Git rules

From `CLAUDE.md` and the controlling brief §5.1/§5.3, unchanged and still binding:

- **Always `GH_HOST=github.com` on every `gh` invocation.** The machine is also logged into `github.toasttab.com` (account `daydreamer614`) and `gh` will silently prefer the corporate host if you omit this. Verified today: both hosts are authenticated (`gh auth status`), so the failure mode is real, not hypothetical.
- **Commit identity is pinned locally** to `Arun Prakash N <arunpr614@users.noreply.github.com>` (`git config --local user.name/user.email` — verified today, matches). Check `git log -1 --format='%an <%ae>'` before every push.
- **Never force-push `main`.** Branch protection blocks it. Work on `plan/post-m6`; open a PR into `main`, don't push directly to it.
- **Never `git add -A`, `git add .`, or `git commit -a`.** Name paths explicitly, every time — the owner's four files sit in the same tree as your work and a broad add will catch them.
- **Do not use a git worktree for this task.** Work in place on `plan/post-m6`. Do not rebase onto `main` to make the diff prettier — you would lose the decisions recorded in `c302eb8` and `b86191d`.

---

## 3. Every resource file, and what each is for

### 3.1 Read fully before starting

| File | Lines (verified 2026-08-21) | Why |
|---|---|---|
| `docs/HANDOVER-M7-M19-TICKETING.md` | 762 | **The controlling brief. Read this in full before anything else in this list.** Everything below assumes you have. |
| `docs/IMPLEMENTATION-PLAN.md` | 315 | The M1–M6 plan. Your document is its sequel and must not contradict it — §5.1's schema, §5.3's date module, and §8's decisions are load-bearing. |
| `reference/CONTEXT.md` | 125 | Domain glossary *and* copy specification — ~25 terms, each with an `_Avoid_:` alias list that is as binding as the definition. Every ticket title and acceptance criterion uses this vocabulary. |
| `reference/PRINCIPLES.md` | 9 | Short. Contains: "Real photos and photo-derived data must never be sent to AI providers." This one line constrains M10/M11 ticket design directly. |
| `HANDOVER-PHASE-1.5.md` | 390 | §4 is the root-cause account of why this project failed twice (137 commits, 466 planning docs, zero rendered journal entries) and the size ceiling it prescribes (~25–40 tickets). Read §0.2 of your own plan draft (§6.2 below) for how I've reconciled that ceiling with a ~90-ticket ask — the reconciliation is written, not just asserted, and you should read it rather than re-litigate it. |
| `UI-DESIGN-INSTRUCTIONS.md` | 195 | Binding for UI work. Not directly triggered by this task (you are writing a plan and filing tickets, not rendering anything), but any ticket that specifies UI acceptance criteria must cite its §9 definition-of-done line — see the controlling brief §8.4 and the worked example in §8.3. |
| `CLAUDE.md` | 38 | Project rules: GitHub identity, no force-push on `main`, **no meta-tooling**, "every session ends with something visible," UI rule pointer, privacy boundary. |

### 3.2 Navigate, do not read cover to cover

**`reference/PRODUCT-REQUIREMENTS.md`** (380 lines) — requirement table, IDs used throughout the ticket plan. Section map, verified today by `grep -n '^#\{1,3\} '`:

```
112  Product boundary and canonical record         (LID-SCP-*)
121  Telegram photo capture                        (LID-TG-*)      → M8
136  VoiceNotes journal capture                     (LID-VN-*)      → M9
148  Uploaded journals, revisions, and Corrections  (LID-UP-*, LID-SRC-*) → M4 (done), M12
161  Reflection, browsing, and management            (LID-REF-*)    → M7
173  AI text derivation and provider control          (LID-AIT-*)   → M10
185  Generated Artwork                                (LID-AIA-*)   → M11
201  Privacy, security, storage, recovery, operations (LID-OPS-*)   → M13, M14, M15, M17
224  Deferred backlog contracts                       (LID-DEF-*)   → one boundary ticket in M19, §11 of the controlling brief
249  Provider and Privacy Risk Checklist              → walked in M19
261  Legal: Personal Data Processed                   → walked in M19
282  Ideal User Experience / User Flows (284)          → Flows A–M, cited throughout
309  Technical Considerations
331  Required state contracts
346  Risks & Mitigations
```

Two warnings, both already established, still true: (1) its header's "R1–R10 frozen and out of scope" is stale governance framing from before the reset — `CLAUDE.md` overrides it, `reference/` is "background reading, not authority." (2) **"SQLCipher" appears nowhere in this document.** Encryption at rest is specified generically as application-controlled, versioned encryption; the library is genuinely undecided (see §6.2's §2.3, the ADR requirement for M13).

**`reference/UX-SPECIFICATION.md`** (1335 lines) — UX IDs, flows, wireframe annotations. Section map, verified today:

```
264  §7  Monthly Almanac                                  → M7
286  §8  Search                                            → M7
447  §11 Needs Date Review                                 → M4 (done)
481  §13 Derived-field review and protection                → M10
504  §14 Artwork experience                                 → M11
558  §15 Source revision and Correction conflicts (exactly three actions at 575) → M12
593  §16 History and provenance                             → M12
615  §17 Trash and suppressions                              → M5 (done), M9
643  §18 Telegram bot capture and duplicate handling         → M8
677  §19 Settings                                            → M9, M10
723  §20 System Health (Recovery Ceremony at 759)            → M17, M15
777  §21 Export experience                                   → M16
818  §22 First-use and integration-readiness experience      → M9
830  §23 End-to-end flows A–M
943  §24 Content design system
983  §25 Responsive behavior                                 → M18
1007 §26 Accessibility contract                              → M18
1053 §27 Privacy cues and browser behavior
1075 §28 Light and dark themes (superseded in part — see below)
1130 §29 Component inventory
1167 §30 Loading/error/interruption/offline-ish states        → M18
1185 §31 Usability and accessibility validation plan
1253 §32 Unresolved technical gates that constrain UX
1272 §33 Explicitly out of scope for MVP UX
1293 §34 Traceability matrix                                 → walked in M19
1322 §35 UX acceptance summary                                → walked in M19
```

**§28.1's palette is superseded** by the v10-prototype decision (existing plan §8.1) — say so in any ticket that touches navigation or color, per the controlling brief §6.1.

**`reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md`** (418 lines) — **over-scoped reference research, not a decision.** It assumes Docker Compose, SQLCipher, three services (`life-web`/`life-hooks`/`life-worker`), Cloudflare R2, and Restic as though settled. Sections I read directly this session and their actual content (not the spike's framing) are folded into your plan draft §2.3/§2.4 already. If you need more: §5.1 Hetzner facts (127), §5.2 Docker Compose facts (134), §5.3 Cloudflare facts (142), §5.4 SQLCipher/SQLite/PostgreSQL facts (150), §5.5 Recovery and object-storage facts (159), §6 Proposed topology (166), §7 SQLCipher vs. PostgreSQL (207), §8 Deployment option matrix (251), §9 Coexistence controls (261, with §9.3 Network/tunnel isolation at 281), §10 Capacity-admission design (297). I have not read §11 onward (Deployment/rollback, Security analysis, Remaining gates, Milestone recommendations, Assumptions, Council decision request) — read those only if M13–M15 ticket-writing genuinely needs them, and treat every fact in this document as one option, never as a decision already made.

### 3.3 Read on demand

Nothing else needs reading before you start. `RESET-DECISION.md` (29 lines, repo root) is the one-paragraph origin statement behind existing plan §1 — worth a glance if the "what does v0.1 done mean" framing ever feels unmotivated, but not required.

### 3.4 Reference material / prior art

`reference/prototype-v10/` — mine for the decided visual tokens only if a ticket touches the navigation rail or palette: accent `#255949`, focus ring `#0a7762`, `--rail-width: 238px`, persistent rail (overrides UX §4.2 and `WF-01`'s ban on a persistent rail — superseded for this build, say so explicitly per existing plan §8.1). Do not import its ~8,000 lines of CSS/JS; existing plan §8.7 already made that call for M1–M6 and nothing in M7–M19 reopens it, since none of these tickets touch product code regardless.

### 3.5 Work produced this session

**`docs/IMPLEMENTATION-PLAN-POST-M6.md`** — 133 lines, **uncommitted** (see §2.2). Covers §0 (the two things that changed) and §1–§2.4 (what "done" means for v1; stack additions; the scheduler non-decision; the provider-adapter shape; encryption non-decision; data-layout extension). **Does not yet cover:** §3 schema additions (SQL), §4 privacy architecture, §5 per-milestone paragraphs for M7–M19, §6 what this plan still doesn't build (`LID-DEF-*`), §7 real risks, §8 decisions needed from the owner, §9 vocabulary. Full content is inlined verbatim in §6.2 below so it survives even if this file is somehow lost before you commit it.

---

## 4. Standing rules that must not be broken

Quoted, not paraphrased, from the controlling brief and `CLAUDE.md`. All remain in force.

**Security boundary (brief §3.2):** never enter `AI_Life_reflect/`; never run destructive git commands anywhere inside it or its newly-noticed siblings (§1.2).

**Owner's uncommitted files (brief §3.4):** "These are the owner's own edits, made with a different AI agent, and he has confirmed they are his. Do not commit them, do not revert them, do not stage them, do not 'clean up' the working tree."

**GitHub identity (brief §5.1):** "Always use the `arunpr614` account (`github.com`) for this repository. Never use the `daydreamer614` / `github.toasttab.com` (work) account for anything in this project." Prefix every `gh` call with `GH_HOST=github.com`. Extends to commit authorship — no `toasttab.com` address in any commit you make.

**Privacy boundary (brief §5.2):** never commit anything under `data/` (gitignored). Never commit real journal text, photos, identifiers, credentials, provider responses, or private URLs. **Fictional data only** in anything committed, including ticket bodies — invent example filenames and journal lines. Real photos and photo-derived data must never be sent to AI providers — this constrains M10/M11 ticket design directly, not just repo hygiene.

**Git safety (brief §5.3):** never force-push `main`; work on a branch and PR into `main`; never `git add -A`.

**Issue hygiene (brief §5.4):** do not touch `phase2` issues or milestones (14, 31–49 — verified still present today, all titled `Phase 2 — Prototype Backlog v…`, not yours to close, retitle, or reuse). Do not reopen or resurrect `phase1` issues. Issues #174–#181 were closed as superseded (predated the finalized schema and two design decisions) — do not revive them.

**No meta-tooling (`CLAUDE.md`, brief §5.5, the owner's own words):** "Do not build validators, registries, ledgers, councils, dossiers, readiness states, or any code whose purpose is to govern this project. If a change doesn't move pixels or data for the single user, don't make it." Do not invent a ticket-numbering scheme, a traceability database, a coverage tracker, or a script that generates tickets from a YAML file. Write the tickets.

**Never apply these labels (brief §9.1):** `phase1`, `phase2`, any `version:v*`, `roadmap`. Verified today — all of these exist as real labels in the repo (there are 35 `version:v*` labels alone) and are easy to reach for by habit. They are not yours.

---

## 5. How you are required to work

This task produces a Markdown plan document and GitHub metadata, not code, so `UI-DESIGN-INSTRUCTIONS.md`'s rendering/screenshot loop does not apply to your own work. It still governs the *content* of any ticket whose acceptance criteria describe a UI change — that ticket must carry the line `- [ ] UI verification loop per UI-DESIGN-INSTRUCTIONS.md §9 completed and differences recorded on this issue` (brief §8.4).

`CLAUDE.md`'s "every session ends with something visible" is satisfied here differently than for a coding session: for you, "visible" means a **committed** plan document and, once milestones start going up, a **populated project board the owner can load and see**. An uncommitted draft or a half-filed milestone does not satisfy it — see §2.2 and the batching rule in §8 below.

---

## 6. What has been done — the session record

### 6.1 Where the session got to, and why it went that way

The session's first phase was entirely verification, not production: read the controlling brief in full, read the M1–M6 plan in full, read `reference/CONTEXT.md`, `reference/PRINCIPLES.md`, `UI-DESIGN-INSTRUCTIONS.md`, `HANDOVER-PHASE-1.5.md`, all of `reference/PRODUCT-REQUIREMENTS.md`, all of `reference/UX-SPECIFICATION.md` (four passes, given its length), and the targeted sections of the Hetzner spike. Every fact the controlling brief asserted about git state, `gh auth`, milestone numbers, existing issue counts, labels, and project field/option IDs was independently re-checked against the live repo and GitHub API before any writing started — all of it matched, with one exception discovered only in *this* handover-writing pass (§6.4).

Writing began with `docs/IMPLEMENTATION-PLAN-POST-M6.md` per the brief's own ordering instruction (§12: write the plan before filing anything, because writing it is how you catch contradictions before they're frozen into 88 tickets). The first `Write` call produced §0 through §2.4 successfully. The user then reported "API Error: The operation timed out" on the *next* turn — the file itself was already written correctly and nothing was lost, but it indicated that generating the rest of a ~9-section, likely 500+ line document in one more giant call was risky. The plan was to switch to writing in smaller chunks (one `Write` then several `Edit` appends) rather than one more huge generation — **that switch had not yet happened when the user redirected to ask for this handover instead.** So the plan document stopped at §2.4, mid-task, for a process reason (avoiding a second timeout) rather than a content reason.

### 6.2 The plan document so far — inlined verbatim

This is the complete, current content of `docs/IMPLEMENTATION-PLAN-POST-M6.md` as of this handover. It is uncommitted (§2.2) — treat this block as the source of truth if the file on disk is ever missing or different.

<details>
<summary>Full text of docs/IMPLEMENTATION-PLAN-POST-M6.md (133 lines, click to expand)</summary>

```markdown
# Implementation plan — Phase 1.5, post-M6 (M7–M19)

_Written 2026-08-21 on branch `plan/post-m6`. Sequel to `docs/IMPLEMENTATION-PLAN.md`, which covers M1–M6 and is not superseded by this document. Sources: `reference/PRODUCT-REQUIREMENTS.md`, `reference/UX-SPECIFICATION.md`, `reference/CONTEXT.md`, `reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md`._

The existing plan takes the archive from nothing to a deployed private web app: browse a calendar, read a Journal Day, see real photos, upload a journal, correct and redate and trash, reach it from a phone. This document covers everything the product is supposed to be after that, and it is the second half of one plan, not a new one. Read them together. Where this document and the existing plan disagree, the disagreement is called out explicitly and the reason is given — there is no silent override anywhere in here.

Like the existing plan, this is not a contract or a governance artifact. The tickets are on GitHub and the code is the deliverable.

---

## 0. Two things that changed, before anything else

### 0.1 The scope rule in existing plan §7 is superseded

The M1–M6 plan closes §7 with a rule that decided what was and was not a Phase 1.5 ticket:

> **Rule for ticket writing:** a Phase 1.5 ticket may cite any requirement ID as context, but if satisfying it requires an AI provider, a cloud storage backend, a cryptographic envelope, or an authentication decision, it is not a Phase 1.5 ticket.

That rule was correct for M1–M6 and it is **no longer in force.** The owner has expanded Phase 1.5 to cover the full v1 product, so AI providers (M10, M11), a cloud storage backend (M14), a cryptographic envelope (M13, M16), and an authentication decision (M13) are all now in scope and each has its own milestone. Existing plan §7's *list* of unbuilt things is therefore not a boundary any more — it is this document's table of contents. The only part of §7 that survives is `LID-DEF-*`, which stays out (see §6).

Nothing else in the existing plan is superseded. In particular §5.1's schema, §5.3's Journal Date module, §8.1's palette decision, and §8.2's ingest decision all still hold, and §3's directory layout is extended rather than replaced.

### 0.2 This plan is much bigger than the reset intended, and that is worth saying out loud

`HANDOVER-PHASE-1.5.md` §4 diagnoses why this project failed twice — 137 commits, 466 planning documents, a 58-task governance roadmap, a five-seat "Product Council," ~5,800 lines of coordination code, and zero rendered journal entries — and prescribes a size limit in response:

> Aim for roughly 25–40 tickets total, not 58, and certainly not 300.

M1–M6 came in at 36 tickets and honoured that. This document adds roughly ninety more, which is more than double the prescribed ceiling. I am not going to pretend that is consistent.

Here is the honest version. The 25–40 figure was a limit on **planning for a product whose first screen did not exist yet.** That constraint has done its job: the calendar renders, a day opens, a photo displays. What follows is not speculative planning — every milestone below extends something already running. The failure mode §4 describes was tickets *about the project* (readiness states, dossiers, councils, coverage trackers). Ninety tickets about capturing photos, deriving titles, and proving a restore is a different thing from ninety tickets about governing the work.

The limit that actually still binds, and that I have applied instead, is the one in `CLAUDE.md`: **no meta-tooling, and every milestone ends with something the owner can see or do that he could not before.** Every ticket in M7–M19 moves pixels or data. There is no validator, no registry, no traceability database, no ticket-generation script, and no "decisions" milestone. If the count is the wrong trade, the right response is to cut whole milestones from the end of the list — not to compress ninety real contracts into forty vague ones.

---

## 1. What "done" means for v1

M6 leaves the owner with an archive he can read. v1 leaves him with an archive that **maintains itself and cannot be lost.** Six things have to become true:

1. **Photos arrive by themselves.** He takes a photo on his phone, sends it to a Telegram bot, and it is on the right Journal Day a moment later with an acknowledgement telling him which day it landed on. No filesystem, no laptop. (M8)
2. **Journals arrive by themselves.** He speaks into VoiceNotes, tags it `life-in-days`, and the transcript appears on the right day. Editing it upstream later updates the archive without destroying what was already there. (M9)
3. **Days describe themselves.** Each Journal Day carries a title, a short factual summary, and a few tags he did not have to write — and any field he edits himself stops being overwritten, permanently, until he says otherwise. (M10)
4. **Empty days have a face.** A day with words but no photo gets a piece of generated artwork, in one consistent style, so the calendar has no blank tiles. A real Daily Photo always outranks it. (M11)
5. **He can find anything.** Type a phrase and get the days that contain it. Read a month as a Monthly Almanac instead of a grid. (M7)
6. **He could lose the server without losing the archive.** The database is unreadable without a key he holds in two places off the server, media has somewhere to grow to, and a restore has been rehearsed against a four-hour objective rather than assumed. (M13, M14, M15, M16)

Underneath those, two things have to be true that he will mostly not notice until they matter: the archive tells him when a backup has stopped running or an integration has gone quiet (M17), and every surface works by keyboard, by screen reader, and on a phone (M18). M19 is the day he checks the whole thing over and decides it is good enough to trust with fourteen years of days.

**What v1 is still not:** a public product, a multi-user system, a mobile app, a semantic search engine, or a reflection surface. See §6.

---

## 2. What changes in the stack, and what does not

Nothing in existing plan §2 is reversed. Node 22 LTS, TypeScript, Fastify, `better-sqlite3`, server-rendered HTML from tagged-template functions, one hand-written stylesheet, `sharp`, `node:test` + `node:assert`. **React, Next.js, an ORM, and a migration framework stay rejected**, and the reasons still hold: one user, one host, one process, and transaction boundaries (existing plan §5.2, extended in M12) that the domain makes load-bearing and an ORM would hide.

What is genuinely new:

| Layer | Addition | Milestone | Note |
| --- | --- | --- | --- |
| Search | SQLite **FTS5**, in the same database file | M7 | Not a new dependency — a compile-time SQLite feature. It must be *proven present* in the pinned build, not assumed (spike §5.4). |
| Inbound webhooks | A second Fastify listener on a separate hostname with no human routes | M8 | Not a second framework. Same process tree, different bound port and route table. |
| Outbound HTTP | One provider-adapter module per role, `fetch` only | M10, M11 | No SDK. See below. |
| Object storage | Cloudflare **R2** via the S3-compatible API | M14 | A second implementation behind the storage interface #196 already defines. |
| Backups | **Restic** to Backblaze **B2 EU Central** | M15 | An external binary invoked by a script, not a library. |
| Encryption at rest | Undecided — M13's ADR chooses | M13 | See §2.3. |
| Archives | AES-256 ZIP for export | M16 | Library choice deferred to a small ADR inside M16. |

### 2.1 The scheduler: not decided here, and deliberately not assumed

Five things in this plan need to happen without the owner asking: the 01:00 AI text refresh, the 01:00 Artwork Sweep, the 15-minute Source Quiet Period, VoiceNotes reconciliation, and scheduled backups. Existing plan §2 says **no job queue**, and the PRD defers "durable job/scheduler mechanism" to an ADR that has never been written.

I am not resolving that here, and I am not designing around it either. **The scheduler ADR is the second ticket of M10** — the first milestone that genuinely needs it — and every scheduled behaviour in M10, M11, M15 and M17 declares a dependency on it. The ADR decides between the two honest options and one hybrid:

- **`cron` plus idempotent commands.** Each scheduled behaviour is a command safe to run twice. No new tables, no leases, no worker process. Fails badly if a run needs to survive a crash mid-way or retry with backoff.
- **A `job` table in the same SQLite file, polled by one in-process worker.** Durable, leasable, retryable, and observable from the System Health surface in M17. Costs a table, a lease protocol, and the "one writer" reasoning that SQLite WAL forces (spike §5.4).
- **Hybrid:** `cron` triggers, `job` rows only for work that must survive a crash (provider calls with spend attached, R2 dual-write, Restic runs).

The `job` table sketched in §3.9 exists in this document **only to show what the second option would cost.** It is not a decision and no ticket outside the ADR references it as though it were.

### 2.2 The provider-adapter shape

Two roles, **Text Provider** and **Artwork Provider**, configured independently, with **no silent fallback** between them or between models. One module each, one interface, `fetch` and nothing else:

```ts
// src/providers/types.ts
export interface TextProviderRequest {
  readonly journalText: string;      // ordered, normalized. The ONLY personal content.
  readonly modelId: string;
}
export interface TextProviderResult {
  readonly title: string;
  readonly summary: string;          // 80–140 words
  readonly tags: readonly string[];  // 3–7, short, unique
  readonly visualBrief: string;      // 150–300 tokens, consumed by the Artwork Provider
}
export interface ArtworkProviderRequest {
  readonly visualBrief: string;      // read-only. The ONLY personal content.
  readonly modelId: string;
}
```

Three properties are structural, not stylistic, and each has a ticket that proves it:

- **The request types cannot carry a photo, a caption, or an identifier.** There is no field for one. That is the privacy boundary expressed as a type signature rather than as a comment, and it is why the interface is worth writing down in a plan.
- **Requests are stateless.** No conversation, no files, no tools, no grounding, no retrieval. Every call is complete in itself.
- **No SDK.** An official client library adds telemetry surface, transitive dependencies, and its own retry policy competing with the one the PRD specifies. Two POSTs and a JSON schema check do not need one.

Retry policy, identical in both adapters: timeouts, 429s and transient 5xx retry up to **3 times** with backoff and jitter, honouring `Retry-After`; an invalid response schema retries **once** against the same provider and model; **auth, quota and billing errors stop immediately** and surface to the owner. A refusal is not an error to retry — see M11.

### 2.3 Encryption is undecided, and the spike is not authority

The PRD requires **application-controlled, versioned encryption at rest** and is explicit that this is **not** end-to-end and **not** zero-knowledge. It never names a library. `reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md` names SQLCipher throughout, and that document is over-scoped reference research — it assumes Docker Compose, three services, R2 and Restic as settled facts — so its choice is one option, not a decision.

**M13's first ticket is the encryption and key-design ADR** and every other M13 ticket depends on it. The one fact from the spike worth carrying forward as input rather than conclusion: SQLCipher is a *specialized SQLite build, not a loadable extension* (spike §5.4), so choosing it means pinning and proving a custom `better-sqlite3` build with FTS5 enabled — which collides directly with M7's search index and with existing plan §8.4's warning about native ABI pain on the Hetzner host. The ADR has to price that in, not discover it.

### 2.4 Where the data lives — extending existing plan §3

```
data/                          # gitignored. Never committed.
  archive.sqlite               # the database; encryption per M13's ADR
  media/
    originals/<sha256>         # exact received bytes, never modified, never deleted
    derivatives/<sha256>       # metadata-stripped display copies
    artwork/<sha256>           # Generated Artwork bytes (M11) — derived, not captured
  inbox/photos/                # M3 ingest drop zone. Still supported. Not deprecated by M8.
  staging/                     # M8/M13: memory-backed, bounded, cleared on completion
  export/                      # M16: encrypted archives, deleted on download or after 1 hour
  backup/                      # M15: Restic cache and the local fast-path snapshot
```

`data/media/artwork/` is separate from `originals/` on purpose. Originals are the one unrecoverable asset in the system (existing plan §8.5); artwork is regenerable and must never be mistaken for a captured photo by a backup policy, a storage watermark, or a person reading a directory listing.
```

</details>

### 6.3 Decisions and design choices made this session, with rejected alternatives

(a) **The M1–M6 scope rule (existing plan §7) is explicitly superseded, not silently dropped.** Considered leaving it unstated and letting the new milestones just contradict it — rejected because a future reader hitting the old rule in existing plan §7 would reasonably conclude M10/M11/M13 shouldn't exist. **Chosen:** state the supersession explicitly in the new plan's §0.1, and note precisely what still survives from the old §7 (the `LID-DEF-*` exclusion only).

(b) **The ~90-ticket count vs. `HANDOVER-PHASE-1.5.md`'s 25–40 ceiling.** Considered quietly complying with the ceiling by compressing the owner's 13-milestone ask into fewer, vaguer tickets — rejected, because the brief's own definition of done ("a ticket is done when an implementing agent could pick it up cold") is incompatible with vague tickets, and compressing contracts to hit a number is exactly the kind of process-over-substance move `CLAUDE.md` warns against. Considered refusing the ~88 number outright and asking the owner to re-scope — rejected as premature; the brief already anticipated this tension and explicitly permits taking "a better cut of the same scope" while keeping the count near 13 milestones, so the honest move is to name the tension in the plan (§0.2) and proceed, not to relitigate scope on the successor's behalf. **Chosen:** name the tension explicitly, reframe the real governing constraint as `CLAUDE.md`'s no-meta-tooling rule rather than the raw ticket count, and leave the option open (stated, not exercised) for whoever writes the milestones to cut from the end of the list if the count still feels wrong once concrete.

(c) **Scheduler and encryption are ADRs, not decisions made in the plan document.** Both the PRD and the M1–M6 plan defer these; considered picking `cron` and SQLCipher outright in the plan document to save the successor a step — rejected, because the brief is explicit that ADR-shaped requirements become the first ticket of the milestone that needs them, decided by whoever implements, not pre-decided in planning. Also rejected because the Hetzner spike's SQLCipher framing is reference research assuming a topology (Docker Compose, three services) that hasn't been chosen either — deciding the database engine before the deployment topology would be deciding things in the wrong order. **Chosen:** leave both open, write the ADR requirement into the plan with the one load-bearing fact each ADR must account for (SQLCipher's custom-build/FTS5 collision; the `cron`-vs-job-table tradeoff), and make every dependent ticket declare the ADR as a dependency rather than assuming an answer.

(d) **Provider adapters get no SDK and a hand-written interface, shown as TypeScript in the plan.** Considered leaving the interface as prose ("requests must not carry photos") — rejected, because a type signature that has no field for a photo is a stronger, more checkable guarantee than a sentence saying not to send one, and the brief's privacy-boundary rule (§10.4 extra requirements) asks for the boundary to live in ticket *scope*, not just notes. **Chosen:** show the interface in the plan itself so the M10/M11 tickets can cite it directly rather than re-deriving it.

### 6.4 A discrepancy found in the controlling brief's own metadata table — read before setting any field

The controlling brief (§7.6, and the earlier session's verification pass) asserts a **Priority** single-select project field exists on project 1, with a field ID (`PVTSSF_lAHOD9kkX84BgUtfzhah0Eg`) and three option IDs (High/Medium/Low). **I re-queried the live project schema today and this field does not exist.**

```sh
$ GH_HOST=github.com gh api graphql -f query='
query { user(login:"arunpr614"){ projectV2(number:1){ fields(first:20){ nodes {
  ... on ProjectV2FieldCommon { id name }
  ... on ProjectV2SingleSelectField { id name options { id name } }
} } } } }'
```

The full field list returned is: `Title`, `Assignees`, **`Status`** (Backlog/Next/In progress/Done — IDs match the brief exactly), `Labels`, `Linked pull requests`, `Milestone`, `Repository`, `Reviewers`, `Parent issue`, `Sub-issues progress`, `Created`, `Updated`, `Closed`, `Team` (Squad 1/2/3), `Iteration`, `Quarter`, `Start date`, `Target date`, `PRD / PID`, `Design artifact`. **There is no field named `Priority` anywhere in that list.**

What actually carries priority on this board is the **label**, not a project field: `priority:high` / `priority:medium` / `priority:low` exist as real repo labels (verified via `gh label list`) and that is the only place priority information lives. I don't know whether the brief's Priority-field claim was ever true and the field was since deleted, or whether it was wrong from the start (possibly conflated with the `Team` single-select, which has the same shape). Either way: **do not attempt to call `updateProjectV2ItemFieldValue` against `PVTSSF_lAHOD9kkX84BgUtfzhah0Eg` — that field ID does not resolve on this project and the mutation will fail.** Set priority by applying the label at issue-creation time (`--label priority:high` etc. on `gh issue create`), exactly as you already do for `phase1.5` and the `type:*` label — there is no separate field-value mutation for priority at all. §11.3 below has the corrected field table.

### 6.5 Discrepancies between documentation and reality

Beyond §6.4, none found this session. Milestone numbers (50–55 for M1–M6), issue count (36), all seven required labels, the `phase1.5` label, and project view 8 ("Phase 1.5 Status", `PVTV_lAHOD9kkX84BgUtfzgLX5vA`, board layout, filter `label:phase1.5`) all matched the controlling brief's claims exactly when re-checked today. Existing plan §9's open question about issues #174–#181 remains genuinely open — I did not resolve it and neither should you (see §10).

---

## 7. What is verified, and what is not

### 7.1 Verified — with evidence, today, 2026-08-21

| Claim | Evidence |
|---|---|
| Branch is `plan/post-m6`, HEAD `f1745d2` | `git branch --show-current`, `git log --oneline -8` |
| `plan/post-m6` has no open PR yet | `gh pr list --head plan/post-m6 --state all` → empty |
| Owner's 4 files still uncommitted, untouched by me | `git status --short` matches §2.1 exactly |
| `.mcp.json` is new and unexplained | `git status --short` shows it `??`; not created by me this session |
| My plan doc is uncommitted, 133 lines | `git status --short` shows `??`; `wc -l docs/IMPLEMENTATION-PLAN-POST-M6.md` = 133 |
| Commit identity correct | `git config --local user.name/user.email` = `Arun Prakash N` / `arunpr614@users.noreply.github.com`; `git log -1 --format='%an <%ae>'` matches |
| Both `gh` hosts authenticated, so `GH_HOST=github.com` is load-bearing not paranoid | `gh auth status` shows both `github.com` (arunpr614) and `github.toasttab.com` (daydreamer614) active |
| 36 `phase1.5` issues exist, unchanged | `gh issue list --label phase1.5 --limit 200 --json number -q 'length'` = 36 |
| Milestones 50–55 are M1–M6, open counts 7/5/8/5/6/5 | `gh api .../milestones --paginate` |
| Milestones 14, 31–49 are Phase 2, untouched | same call, titles all `Phase 2 — Prototype Backlog v…` or `Phase 2 — Program, Artifact & Closeout Backlog` |
| **No milestone 56+ exists yet** — nothing from M7–M19 has been created | same call — highest milestone number present is 55 |
| All required labels exist with matching descriptions | `gh label list --repo arunpr614/Life-Reflection --limit 100` |
| Banned labels (`phase1`, `phase2`, 35× `version:v*`, `roadmap`) really exist and are reachable by habit | same call |
| Project 1 ("Life Reflection") node ID `PVT_kwHOD9kkX84BgUtf` | GraphQL `user(login:"arunpr614"){ projectV2(number:1) }` |
| `Status` field ID and all 4 option IDs match the brief exactly | GraphQL field-list query, §6.4 |
| **`Priority` project field does not exist** — corrects the brief | same query — see §6.4, §11.3 |
| View 8 = "Phase 1.5 Status", `PVTV_lAHOD9kkX84BgUtfzgLX5vA`, `BOARD_LAYOUT`, filter `label:phase1.5` | GraphQL `projectV2(number:1){ views }` |
| `AI_Life_reflect/` still exists as a sibling directory | `ls` of the parent directory |
| Two more related siblings exist: `AI_Life_reflect-phase2-v17-v35`, `AI_Life_reflect-worktrees` | same `ls` — not in the original brief, noted as new |
| Section line numbers for `HANDOVER-M7-M19-TICKETING.md`, `PRODUCT-REQUIREMENTS.md`, `UX-SPECIFICATION.md` in §3.2 above | fresh `grep -n '^#\{1,3\} '` run today, not carried over from an earlier pass |

### 7.2 Not yet done

- **§3–§9 of `docs/IMPLEMENTATION-PLAN-POST-M6.md` are not written.** This is the largest remaining item — see §8, Step 1.
- **Zero of the 13 milestones (M7–M19) exist.** Not started.
- **Zero of the ~88 issues exist.** Not started.
- **No issue has been added to project 1.** Not started (nothing to add yet).
- **No PR from `plan/post-m6` into `main` exists.** Not started.
- I have **not** read `reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md` §11 onward (Deployment/rollback, Security analysis, Remaining gates, Milestone recommendations, Assumptions, Council decision request). Flagged in §3.2 — read only if M13–M15 ticket-writing needs it.
- I have **not** re-verified the "36 existing issues" list in the controlling brief's §9.3 (the `#184`–`#219` table) against live issue titles/numbers one-by-one — I trusted the count (36) and the milestone open-issue tallies, which matched, but did not diff every individual issue number and title. Treat that table as *probably* accurate but not independently re-confirmed this session.
- I have **not** attempted any `gh project item-add` or `updateProjectV2ItemFieldValue` call this session — the field-ID correction in §6.4 is from a read-only schema query, not from a failed write. It is plausible but unconfirmed that the mutation would in fact fail the way I predict; I inferred it from the field not existing, I did not run the mutation and watch it error.

### 7.3 Constraints discovered along the way

- `gh api graphql` here is sensitive to trailing braces — a query with one extra `}` fails with a GraphQL parse error rather than a `gh` usage error. Not a project-specific quirk, just worth knowing before you assume a bad ID when it's actually a bad brace count.
- macOS `cat` (BSD) has no `-A` flag (unlike GNU `cat`) — if you want to inspect trailing whitespace/newlines in a file, this will fail; use `Read` with an offset near the end instead, which is exactly how I resolved an `Edit` match failure this session (see below).
- One `Edit` call this session failed with "String to replace not found" against text that looked identical by eye — the actual file was 208 lines and my mental line-count estimate was off by ~50 lines, so I was anchoring near the wrong location and hand-transcribing the target string from memory instead of a fresh `Read`. **Lesson for you: before any `Edit` on a large file you just wrote, `Read` the exact tail/region first and copy the `old_string` from that output, don't retype it from what you remember writing.**

---

## 8. What to continue, in order

### Step 1 — commit the WIP plan document, exactly as in §2.2

```sh
git add docs/IMPLEMENTATION-PLAN-POST-M6.md
git commit -m "WIP: post-M6 plan through §2.4 (stack and data-layout additions)"
```

Do this before writing another line. It costs nothing and removes the single largest risk in this handover.

### Step 2 — finish `docs/IMPLEMENTATION-PLAN-POST-M6.md`

Write §3 through §9, per the controlling brief §12's required structure (schema additions with SQL; the privacy architecture — one section, what crosses the boundary and what never does; one paragraph per milestone M7–M19 covering user-visible outcome, requirement IDs, dependencies, and what it deliberately does not do; the `LID-DEF-*` boundary; real risks in the register style of existing plan §8; the six open questions from §10 below; vocabulary, only if you introduce a term existing plan §10 doesn't cover). **Write in chunks** — one `Write` or `Edit` per section or two, not one call for the remaining ~400+ lines — both to avoid another timeout and because each `Edit` needs a fresh `Read` of the target region per the lesson in §7.3. Commit as you go, or once at the end; either is fine, but do not let more than one section's worth of work sit uncommitted at a time.

**Before moving to Step 3, re-read the finished document once, end to end, specifically checking:** every milestone's requirement IDs actually appear somewhere; the scheduler and encryption ADRs are each the first ticket of their milestone in your own description (don't just say so in §2, make sure §5's milestone paragraphs agree); the six open questions from §10 are stated as questions, not resolved.

### Step 3 — milestone-by-milestone ticket filing (the gate: do not start this until Step 2's document is committed)

Follow the controlling brief §7.8's batching rule exactly: **for each milestone in order M7→M19 — create the milestone, then all its issues, then add every one of that milestone's issues to project 1 and set `Status=Backlog` plus the `priority:*` label (see §11.3's correction) — before starting the next milestone.** This means an interruption never leaves a milestone half-populated. Use the exact commands in the controlling brief §7 (milestone creation, issue creation via `--body-file`, `gh project item-add`, the `Status`-only field mutation). Every issue needs exactly four labels (`phase1.5`, one `type:*`, one `priority:*`, `status:backlog`) plus `accessibility` for M18 tickets — see §11.2.

Each ticket needs all six sections from the controlling brief §8.1 (`## Outcome` / `## Scope` / `## Technical notes` / `## Acceptance criteria` / `## References` / `## Depends on`), in that order, matching the register of issue #197 (quoted in brief §8.3). Write every ticket body to a temp file first — bodies contain backticks, `#`, checkboxes, and SQL that will fight with inline `-f`/`-b` shell quoting.

### Step 4 — the PR

Open a PR from `plan/post-m6` into `main`. Note in the PR body (per brief §7.8) that the diff will include `plan/implementation`'s commits too, because that branch hasn't merged yet — expected, not a mistake.

### Step 5 — the closing summary (the final gate)

Per brief §14: a summary with the milestone list and per-milestone issue counts, the six open questions (§10 below, unresolved), and anything cut or changed from the brief's §10 recommended plan and why. Run the brief's §14 verification commands first and quote their actual output in the summary, not an assumption of what they'd show.

**Do not get a head start on Step 3 while still writing Step 2's document.** A half-written plan document that already has tickets filed against it is exactly the "plausible but wrong" failure mode this whole task exists to avoid (brief §15, on not flagging a gap and quietly building around it anyway).

---

## 9. How to behave with the user

### 9.1 The stop rule

The controlling brief's scope is definition-only and that has not changed: **no product code, no `src/**`, no feature branch, no `npm init`, no dependency install, no validator/registry/dashboard.** If at any point finishing a ticket seems to require writing code to verify a claim, don't — describe the claim and let an implementing agent verify it later. The six open questions (§10) are for the owner, not for you to answer by picking whichever unblocks fastest.

### 9.2 How to hand work over for review

This is a planning/ticketing task, not a UI task, so there's no browser loop to run. What the owner actually reviews is the plan document and the board. When you report progress, give: the exact milestone numbers assigned (read from the API response, never assumed — brief §7.2 warns about this explicitly), the issue count per milestone, and a link or number to spot-check (e.g., "M8's gate ticket is #231, cite it as I did"). Do not say "tickets look good" — name what's checkable.

### 9.3 On the issue tracker

- File tickets in the exact six-section structure, no more, no less, no reordering (brief §8.1).
- Match the register of issue #197 — plain-language `## Outcome` first (the owner reads this line and imagines using the feature, per brief §15), concrete file/route/column names in `## Scope`, judgment calls and traps in `## Technical notes`.
- **Known API trap #1:** `gh issue create --milestone` takes the full title string, not the milestone number. `--milestone 56` fails with `could not add to milestone '56': '56' not found`.
- **Known API trap #2, corrected this session:** there is no `Priority` project field to set via `updateProjectV2ItemFieldValue` (§6.4). Priority is the `priority:high|medium|low` **label only**, applied at `gh issue create` time.
- **Known API trap #3:** `createProjectV2View`'s payload field is `projectV2View`, not `view`, and "group by" cannot be set on a project view through GraphQL at all (`updateProjectV2View` accepts `filter` and `visibleFieldIds`, not grouping). Don't burn calls trying; if the owner wants grouping by milestone, say so in the closing summary as a manual step for him, don't attempt it programmatically.
- Never comment on or reopen `phase1`/`phase2` issues (§4).

### 9.4 The open defect list, as it stands

1. `docs/IMPLEMENTATION-PLAN-POST-M6.md` is 6 of 9 sections short and uncommitted (§2.2, §6.1, §7.2).
2. All 13 milestones and ~88 issues remain to be created (§7.2).
3. The controlling brief's Priority-field claim is wrong for the live project as of today; §6.4 and §11.3 are the correction, but the *root cause* (was it ever true?) is unresolved and doesn't need to be — just don't call the mutation.
4. The `#184`–`#219` existing-issue table in the controlling brief §9.3 has not been independently re-verified issue-by-issue this session (§7.2) — low risk, since the aggregate counts matched, but worth a spot-check before citing a specific issue number in a `## Depends on` line.

---

## 10. Open questions — surface, do not decide

Carried forward verbatim from the controlling brief §13. These are the owner's to answer. Do not resolve any of them by guessing whichever answer unblocks you fastest — write the plan and the tickets so the question is visible, and name it again in the closing summary (brief §14, Step 5 above).

1. **Hetzner host access timing** — unanswered since existing plan §9 item 4; needed at M6 (already shipped without it being resolved), now also gates M13–M15.
2. **Provider credentials** — both M10's and M11's evaluation gates need test credentials the PRD says will be "supplied later." Neither milestone's gate ticket can actually be *worked* without them, though it can still be *written*.
3. **The $15 evaluation ceiling** — shared across M10's text-evaluation gate and M11's artwork-evaluation gate. Which runs first, and does the owner want a split (e.g. $8/$7) or first-come?
4. **VoiceNotes test account** — M9's spike ticket (`LID-VN-001`) requires one, and requires that no personal journal be used in it.
5. **Milestone ordering** — M13 (encryption) comes after M8–M11 in the brief's sequencing, meaning real Telegram photos and provider-derived text land on an unencrypted database first. That's a deliberate trade for visible progress per milestone, and it's the owner's call, not yours. Ask it plainly in the closing summary if you haven't already surfaced it in the plan document's risk register.
6. **B2 and R2 accounts** — M14 and M15 need real Backblaze B2 and Cloudflare R2 accounts and buckets in the EU regions specified; nobody has created them yet as far as either agent has verified.

---

## 11. Metadata that must be set

### 11.1 Coordinates

| Thing | Value | Verified |
|---|---|---|
| Repo | `arunpr614/Life-Reflection` (private) | 2026-08-21 |
| Project | user project **number 1**, "Life Reflection", node ID `PVT_kwHOD9kkX84BgUtf` | 2026-08-21 |
| Project owner login | `arunpr614` — a **user** project, use `user(login:)` in GraphQL, not `organization(login:)` | 2026-08-21 |
| The view the owner reviews | **"Phase 1.5 Status"**, view number **8**, ID `PVTV_lAHOD9kkX84BgUtfzgLX5vA`, `BOARD_LAYOUT`, filter `label:phase1.5` | 2026-08-21 |
| Existing Phase 1.5 milestones | 50–55 (M1–M6). Your new ones start at **56**, but *read the returned `.number` from each `gh api .../milestones` create call* — do not assume | 2026-08-21 |

An issue appears on the owner's board if and only if it carries the `phase1.5` label **and** has been added to project 1. Both required, neither alone is sufficient.

### 11.2 Labels / taxonomy — exactly four per issue, plus one conditional

| Slot | Values | Rule |
|---|---|---|
| Phase | `phase1.5` | always, every issue — this is what makes it appear on view 8 |
| Type | `type:feature` · `type:chore` · `type:architecture` · `type:evaluation` · `type:spike` · `type:quality` · `type:product-definition` | exactly one |
| Priority | `priority:high` · `priority:medium` · `priority:low` | exactly one — **this is the only place priority lives; there is no project field for it (§6.4)** |
| Status | `status:backlog` | exactly one |
| Accessibility (conditional) | bare `accessibility` | alongside `type:quality`, only for M18 tickets |

All of these exist in the repo today, verified 2026-08-21. **Never apply:** `phase1`, `phase2`, any `version:v*` (35 exist), `roadmap`.

**Priority guidance:** `high` = the milestone cannot ship without it, a gate, a data-integrity or privacy contract. `medium` = real product value but the milestone is demonstrable without it. `low` = polish, an edge state, a nicety. Roughly half of a healthy ticket set should be high — a board where everything is high has no priority field (doubly true now that there is, in fact, no priority *field* at all — see §6.4).

### 11.3 Fields — corrected from the controlling brief

| Field | ID | Options | Status |
|---|---|---|---|
| `Status` | `PVTSSF_lAHOD9kkX84BgUtfzhahTpA` | Backlog=`f75ad846`, Next=`b753d38d`, In progress=`47fc9ee4`, Done=`98236657` | **Confirmed live, matches the brief exactly.** Set every new issue to `Backlog`. |
| ~~`Priority`~~ | ~~`PVTSSF_lAHOD9kkX84BgUtfzhah0Eg`~~ | ~~High=`665e4024`, Medium=`20d2f405`, Low=`2c5259bb`~~ | **Does not exist on this project as of 2026-08-21 (§6.4). Do not call `updateProjectV2ItemFieldValue` with this field ID.** Priority is the label only (§11.2). |
| `Team` | `PVTSSF_lAHOD9kkX84BgUtfzhahT1c` | Squad 1/2/3 | Leave unset, as the brief said — still correct. |
| `Iteration` / `Quarter` | `PVTIF_lAHOD9kkX84BgUtfzhahT1g` / `...T1k` | — | Leave unset. |
| `PRD / PID`, `Design artifact` | `PVTF_lAHOD9kkX84BgUtfzhahzxM`, `PVTF_lAHOD9kkX84BgUtfzhahz24` | text fields | Not mentioned by the brief; found today during the field re-query. No instruction to set these — leave unset unless the owner asks. |

Sample mutation, corrected (Status only — there is no second aliased mutation for priority):

```sh
GH_HOST=github.com gh api graphql -f query='
mutation {
  s: updateProjectV2ItemFieldValue(input:{
    projectId:"PVT_kwHOD9kkX84BgUtf"
    itemId:"<ITEM_ID>"
    fieldId:"PVTSSF_lAHOD9kkX84BgUtfzhahTpA"
    value:{singleSelectOptionId:"f75ad846"}}) { projectV2Item { id } }
}'
```

### 11.4 Metadata inside generated files

Every ticket body, verbatim section order, no additions, no reordering:

```markdown
## Outcome
## Scope
## Technical notes
## Acceptance criteria
## References
## Depends on
```

If a ticket genuinely has no dependencies: `## Depends on` → `- None`. Length target 250–600 words per ticket (brief §8.5) — longer where a contract is subtle, shorter where mechanical, never padded to hit the range.

Milestone titles: `Phase 1.5 — M<n> — <short outcome in plain words>`, em dash surrounded by spaces, outcome phrased from the owner's point of view (brief §10, and see the thirteen titles already drafted there — e.g. `Phase 1.5 — M8 — Photos arrive from the phone over Telegram`).

### 11.5 Vocabulary constraints

`reference/CONTEXT.md`'s ~25 terms and their `_Avoid_:` alias lists are binding in every ticket title, label, and acceptance criterion — e.g. "Journal Day" not "entry," "Correction" not "edit," "Calendar Cover" not "thumbnail." Existing plan §10 lists the terms already established for M1–M6; if M7–M19 tickets introduce a genuinely new term not covered there, define it once in the new plan document's §9, don't invent it silently inside a ticket body.

---

## 12. Definition of done

- [ ] `docs/IMPLEMENTATION-PLAN-POST-M6.md` finished (§0–§9 per brief §12), committed, pushed
- [ ] 13 milestones created, titled `Phase 1.5 — M<n> — <outcome>`, each with a description
- [ ] ~88 issues created, every one with all six sections and non-trivial content in each
- [ ] Every issue carries exactly four labels including `phase1.5` (plus `accessibility` where M18 applies)
- [ ] Every issue attached to project 1 with `Status = Backlog` (there is no Priority *field* to set — priority is the label, already applied at creation)
- [ ] Every gate ticket (`LID-VN-001`, `LID-AIT-001`, `LID-AIA-001`, the encryption ADR, the scheduler ADR, the backup-mechanism ADR) exists and is depended on by its milestone's implementation tickets
- [ ] Every requirement ID cited in the brief's §4.2 "yes" rows appears in at least one ticket's `## References`
- [ ] The `LID-DEF-*` boundary ticket exists in M19 (one ticket, not six)
- [ ] A PR opened from `plan/post-m6` into `main`
- [ ] `git status` still shows the owner's four files untouched and uncommitted, and `.mcp.json` still untouched
- [ ] `git log -1 --format='%ae'` shows `arunpr614@users.noreply.github.com`
- [ ] A closing summary: milestone list with counts, the six open questions (§10), anything cut or changed from the brief's §10 and why

Verification commands (copy from the controlling brief §14, re-tested in spirit today against the pre-filing state):

```sh
# Total phase1.5 issue count — should read 36 + however many you filed
GH_HOST=github.com gh issue list --label phase1.5 --limit 200 --json number -q 'length'

# Full listing with milestone/labels — eyeball for anything mis-labeled
GH_HOST=github.com gh issue list --label phase1.5 --limit 200 \
  --json number,title,milestone,labels \
  --jq 'sort_by(.number)[] | "\(.milestone.title)\t#\(.number)\t\(.labels|map(.name)|join(","))\t\(.title)"'

# Find issues missing from the project board — should print nothing
GH_HOST=github.com gh issue list --label phase1.5 --limit 200 --json number -q '.[].number' | \
  while read n; do
    c=$(GH_HOST=github.com gh api graphql -f query="query { repository(owner:\"arunpr614\",name:\"Life-Reflection\"){ issue(number:$n){ projectItems(first:5){ nodes { project { number } } } } } }" \
        -q '.data.repository.issue.projectItems.nodes | length')
    [ "$c" = "0" ] && echo "MISSING FROM PROJECT: #$n"
  done

# Milestone tallies, Phase 1.5 only
GH_HOST=github.com gh api repos/arunpr614/Life-Reflection/milestones --paginate \
  -q '.[] | select(.title | startswith("Phase 1.5")) | "\(.number)\t\(.title)\topen=\(.open_issues)"'
```

Before handing back, load project view 8 "Phase 1.5 Status" in a browser and confirm the new milestones' issues actually appear there.

---

## 13. Things about how to work here

- **The owner reads the `## Outcome` line and imagines using the feature.** He said, in his own words, "in simple words, paint me a picture what each milestone would give me as a user experience." "Days without a photo still have a face" carries more weight for him than "implement artwork generation pipeline." Write outcomes for a person, every time.
- **Do not flag a gap and then quietly build around it.** A prior agent on this project once marked photo ingest as needing confirmation and then designed an entire milestone on top of its own unconfirmed proposal anyway — a rejection would have invalidated the whole milestone instead of one ticket. If a ticket rests on something undecided, say so *inside that ticket*, and make the dependency structural: put the decision in its own ticket (an ADR, a spike, an evaluation) that the others depend on. This project has already been burned by the alternative once.
- **A large single-call generation is a real timeout risk here** — not a general Claude Code limitation, just an observed fact this session with a ~130-line Markdown write. Chunk large documents across multiple `Write`/`Edit` calls, and re-`Read` before every `Edit` on a file you didn't just create in the same tool call (§7.3).

---

## 14. Immediate first actions

1. Read `docs/HANDOVER-M7-M19-TICKETING.md` in full (762 lines) — it is still the controlling brief and this document assumes you have it fresh.
2. Read this document's §6.2 (the inlined plan draft) so you know exactly where the plan document currently stands before you open the file on disk.
3. Run `git status --short` and confirm it matches §2.1 above. If it doesn't — if the owner's four files have changed, or the plan doc is gone, or something new has appeared — stop and reconcile the difference before writing anything; don't assume this document is still accurate.
4. Execute Step 1 of §8 (commit the WIP plan document) immediately. This is not optional and not sequenced after anything else.
5. Proceed to Step 2 of §8: finish the plan document, in chunks, committing as you go.
6. **Stop at the gate before Step 3.** Do not create a single milestone or issue until the plan document is complete, internally consistent (the self-check listed at the end of Step 2), and committed.
