# Handover — write the post-M6 plan and file M7–M19 tickets

**From:** the agent that wrote `docs/IMPLEMENTATION-PLAN.md` and filed the 36 Phase 1.5 tickets (#184–#219).
**To:** the next agent.
**Date written:** 2026-08-21.
**Owner:** Arun (single user, single developer, this is his personal archive).

Read this document end to end before you touch anything. It is written to be sufficient on its own — you should not need to reconstruct any decision from git history or from a previous conversation.

---

## 1. Your task, in one paragraph

Phase 1.5 currently stops at M6, which delivers a deployed private web app where the owner can browse a calendar, read a journal day, see real photos, upload journals, correct/redate/trash content, and reach it from his phone. **Everything else the product is supposed to be — Telegram photo capture, VoiceNotes journal capture, AI titles/summaries/tags, generated artwork, search, the Monthly Almanac, encryption at rest, cloud storage, proven backups, encrypted export, System Health, and the accessibility contract — is specified in `reference/` and has no plan and no tickets.** Your job is to write the implementation plan for that remaining scope as a Markdown artifact, then break it into **13 new milestones (M7–M19) under the same Phase 1.5**, and file **roughly 88 detailed GitHub issues** across them, correctly labelled, milestoned, and visible in the owner's GitHub Project board.

**You are not writing product code.** Not one line. The output of your session is: one Markdown plan file, 13 GitHub milestones, ~88 GitHub issues, and all of those issues on the project board. If you find yourself scaffolding a module, you have misread this document.

---

## 2. The absolute scope boundary

The owner has said this twice, in these words:

> "I don't want us to get into execution. I'm just trying to get the details very clearly decided."

> "The scope of this is not implementation. The scope of this is to figure out the full implementation detail and create the corresponding GitHub issues or tickets."

So:

| Do | Do not |
|---|---|
| Write `docs/IMPLEMENTATION-PLAN-POST-M6.md` | Write `src/**` anything |
| Create milestones 56–68 | Start a feature branch to implement a ticket |
| File ~88 issues with full detail | Install dependencies, run `npm init`, add a package.json |
| Put every issue on the project board | Build validators, registries, dashboards, or trackers (see §5) |
| Surface open questions to the owner | Silently decide an architecture question the PRD deferred |

A ticket is done when an implementing agent could pick it up cold and finish it without asking a question. That is the bar. It is a high bar and it is the whole point.

---

## 3. Where you are working

### 3.1 Project folder

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days
```

This is the **only** directory you work in. It is a git repository with remote `github.com/arunpr614/Life-Reflection` (private).

### 3.2 A directory you must never enter

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect/
```

That is a separate, older clone of the same project containing roughly 63 registered git worktrees from a previous abandoned effort. **Never `cd` into it. Never run `git worktree prune`, `git clean`, `git reset`, or `rm -rf` anywhere inside it.** It is not your concern and damaging it is not recoverable. If a tool ever resolves a path into it, stop and tell the owner.

### 3.3 Branch / worktree to continue on

You are handed branch **`plan/post-m6`**, created off `plan/implementation` at commit `b86191d`. This document is its first commit.

```sh
cd /Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days
git checkout plan/post-m6      # already there if nothing has moved
git log --oneline -3
```

Branch topology you are joining:

| Branch | What it is | Your relationship to it |
|---|---|---|
| `main` | clean slate; holds `CLAUDE.md`, `README.md`, `HANDOVER-PHASE-1.5.md`, `reference/` | never commit directly, never force-push |
| `plan/implementation` | the M1–M6 plan; **open PR #182 into `main`** | your parent; do not push to it |
| `plan/post-m6` | **yours** | commit your new plan file here, open a second PR into `main` |
| `prototype/palette-comparison` | throwaway palette prototype; deliberately never merged | leave alone |
| `archive/generation-0` | the abandoned first attempt, checked out in a separate worktree | leave alone |

One consequence of branching off `plan/implementation` rather than `main`: a PR from `plan/post-m6` into `main` will show `plan/implementation`'s two commits as well as yours, because PR #182 has not merged yet. That is expected — say so in your PR body. Do not rebase onto `main` to make the diff prettier; you would lose the decisions recorded in `c302eb8` and `b86191d` from your branch's history of the plan file you are extending.

**Do not use a git worktree for this.** Work in place on `plan/post-m6`. A worktree buys you nothing here (you are writing one Markdown file and calling an API) and this repo already has a painful history with stray worktrees.

### 3.4 Four uncommitted files that are not yours

`git status` shows, and will keep showing:

```
 M CLAUDE.md
 M HANDOVER-PHASE-1.5.md
 M README.md
?? UI-DESIGN-INSTRUCTIONS.md
```

These are the owner's own edits, made with a different AI agent, and he has confirmed they are his. **Do not commit them, do not revert them, do not stage them, do not "clean up" the working tree.** Commit only the files you create. When you commit, name paths explicitly:

```sh
git add docs/IMPLEMENTATION-PLAN-POST-M6.md
git commit -m "..."
```

Never `git add -A`, never `git add .`, never `git commit -a`.

---

## 4. Essential artifacts — read these, in this order

All paths relative to the project folder.

### 4.1 Read first, fully (about 25 minutes of reading)

| File | Size | Why it matters |
|---|---|---|
| `CLAUDE.md` | small | Binding project rules: GitHub identity, no force-push, no meta-tooling, privacy boundary. Non-negotiable. |
| `docs/IMPLEMENTATION-PLAN.md` | 24KB | The M1–M6 plan. Your plan is its sequel and must not contradict it. Pay attention to §2 (stack), §5.1 (schema), §7 (what it excludes — that list *is* your scope), §8.1 and §8.2 (the two decisions), §10 (vocabulary). |
| `reference/CONTEXT.md` | 6KB | The domain glossary and **copy specification**. Defines ~25 terms *and the wrong word for each*, marked `_Avoid_:`. Every ticket title, label, and acceptance criterion must use this vocabulary. |
| `reference/PRINCIPLES.md` | 700B | Data-handling rules. |
| `UI-DESIGN-INSTRUCTIONS.md` | 12KB | Binding for any UI work. Relevant to you because UI tickets must carry its verification loop into their acceptance criteria (see §8.4). |
| `HANDOVER-PHASE-1.5.md` | 24KB | Why the project was reset, and what killed it twice. Read §4 in particular. |

### 4.2 Your two primary sources — navigate, don't read cover to cover

**`reference/PRODUCT-REQUIREMENTS.md`** (102KB) is a requirements table. Requirement IDs are what your tickets cite. Line numbers of the section headings, verified 2026-08-21:

| PRD section | Line | Requirement IDs | In your scope? |
|---|---|---|---|
| Product boundary and canonical record | 112 | `LID-SCP-001..004` (4) | context only |
| Telegram photo capture | 121 | `LID-TG-001..010` (10) | **yes — M8** |
| VoiceNotes journal capture | 136 | `LID-VN-001..007` (7) | **yes — M9** |
| Uploaded journals, revisions, Corrections | 148 | `LID-UP-001..004`, `LID-SRC-001..004` (8) | UP done in M4/M5; **SRC → M12** |
| Reflection, browsing, and management | 161 | `LID-REF-001..007` (7) | REF-001 done in M1–M5; **REF-002/003 → M7** |
| AI text derivation and provider control | 173 | `LID-AIT-001..007` (7) | **yes — M10** |
| Generated Artwork | 185 | `LID-AIA-001..011` (11) | **yes — M11** |
| Privacy, security, storage, recovery, operations | 201 | `LID-OPS-001..018` (18) | **yes — M8, M13–M17** |
| Deferred backlog contracts | 224 | `LID-DEF-001..006` (6) | **boundaries only — see §11** |
| Ideal User Experience / User Flows | 282–303 | Flows A–M | cite in tickets |
| Technical Considerations | 309 | — | read; it names the deferred ADRs |
| Required state contracts | 331 | — | **read carefully; these are testable contracts** |
| Risks & Mitigations | 346 | — | useful for ticket "Technical notes" |

Two warnings about this document:

1. Its header asserts that requirements R1–R10 are "frozen and out of scope." That is stale governance framing from the abandoned first attempt. `CLAUDE.md` overrides it: `reference/` is "background reading, not authority." Treat requirement text as *the best statement of intent available*, not as a contract you must satisfy before writing anything.
2. **"SQLCipher" appears nowhere in it.** Encryption at rest is specified generically as application-controlled, versioned encryption. The library and key design are genuinely undecided. Do not put SQLCipher in a ticket as though it were decided — see §10, M13.

**`reference/UX-SPECIFICATION.md`** (89KB) is the interaction spec. Section line numbers, verified 2026-08-21:

| UX section | Line | Feeds milestone |
|---|---|---|
| 7. Monthly Almanac | 264 | M7 |
| 8. Search experience (8.1 query/filters, 8.2 results, 8.3 states) | 286 | M7 |
| 11. Needs Date Review | 447 | done in M4 (#208); extend in M8/M9 |
| 13. Derived-field review and protection | 481 | M10 |
| 14. Artwork experience (14.1–14.5) | 504 | M11 |
| 15. Source revision and Correction conflicts (15.2 = exactly three actions) | 558 | M12 |
| 16. History and provenance | 593 | M12 |
| 17. Trash and suppressions (17.2 suppression management) | 615 | M9, M12 |
| 18. Telegram bot capture and duplicate handling | 643 | M8 |
| 19. Settings (19.1 integrations, 19.2 AI providers, 19.3 appearance) | 677 | M9, M10 |
| 20. System Health + Recovery Ceremony | 723, 759 | M15, M17 |
| 21. Export experience | 777 | M16 |
| 22. First-use and integration-readiness | 818 | M9 |
| 23. End-to-end flows A–M | 830 | all |
| 24. Content design system | 943 | all — copy rules |
| 25. Responsive behavior | 983 | M18 |
| 26. Accessibility contract (26.1–26.4) | 1007 | M18 |
| 27. Privacy cues and browser behavior | 1053 | M13, M17 |
| 28. Light and dark themes | 1075 | **superseded in part — see §6.1** |
| 29. Component inventory | 1130 | all |
| 30. Loading, error, interruption, offline-ish states | 1167 | M18 |
| 31. Usability and accessibility validation plan | 1185 | M18 |
| 32. Unresolved technical gates that constrain UX | 1253 | **read this — it lists the blockers** |
| 33. Explicitly out of scope for MVP UX | 1272 | §11 |
| 34. Traceability matrix | 1293 | use to check coverage |
| 35. UX acceptance summary | 1322 | M19 |

Wireframe annotations `WF-01`..`WF-16` are scattered through it as "Future wireframe annotation" subsections. There are **no actual wireframe images** — those subsections describe what a wireframe would need to show. Cite them; do not expect to find a picture.

### 4.3 Read only when a ticket needs it

| File | Use |
|---|---|
| `reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md` (40KB) | Real research on the target host. **Over-scoped** — it assumes Docker Compose, SQLCipher, three services (`life-web`/`life-hooks`/`life-worker`), R2, and Restic. M6 tickets deliberately cite only three things from it: §5.3 (Cloudflare facts), §5.4 (SQLite Online Backup API — a filesystem copy of a live WAL database is **not** a safe backup), §9.3 (network isolation). For M13–M15 you will legitimately need more of it, because R2/Restic/encryption are now in scope. Still treat its topology as one option, not a decision. |
| `reference/prototype-v10/` | The owner's tenth visual iteration; source of the decided palette. ~380KB of governance-era CSS/JS. Mine it for structure; never copy its code forward. |
| `prototypes/palette-comparison/` (on branch `prototype/palette-comparison`) | The throwaway that settled the palette question. Context only. |

---

## 5. Standing rules you must not break

These are quoted from the owner and from `CLAUDE.md`. They are not suggestions.

### 5.1 GitHub identity — the one that will bite you

> "Always use the `arunpr614` account (`github.com`) for this repository. Never use the `daydreamer614` / `github.toasttab.com` (work) account for anything in this project."

**Prefix every single `gh` invocation with `GH_HOST=github.com`.** The machine is logged into a corporate GitHub Enterprise host and `gh` will silently prefer it. This has already caused failures.

```sh
GH_HOST=github.com gh issue create ...     # correct
gh issue create ...                        # WRONG — may hit the work host
```

The rule extends to commit authorship. Commits must not carry a `toasttab.com` address. The repo pins it locally:

```sh
git config --local user.name  "Arun Prakash N"
git config --local user.email "arunpr614@users.noreply.github.com"
git log -1 --format='%an <%ae>'    # verify before every push
```

The two oldest commits on `main` (`d85561e`, `53d2e5a`) predate this rule and keep the old address. Leave them; rewriting `main` is forbidden.

### 5.2 Privacy boundary

- **Never commit anything under `data/`.** It is gitignored. Real journals and photos live there.
- Never commit real journal text, photos, identifiers, credentials, provider responses, or private URLs.
- **Fictional data only** in anything committed — including in ticket bodies. If you write an example filename or an example journal line into a ticket, invent it.
- **Real photos and photo-derived data must never be sent to AI providers.** This is a product requirement, not just a repo rule, and it constrains the M10/M11 ticket design directly (see §10).

### 5.3 Git safety

- **Never force-push `main`.** Branch protection blocks it anyway.
- Work on a branch, not on `main`. Open a PR into `main` for review rather than pushing directly.
- Do not `git add -A` (see §3.4).

### 5.4 Issue hygiene

- **Do not touch `phase2` issues or milestones.** Milestones 14 and 31–49 are all `Phase 2 — ...` and belong to the abandoned effort's design backlog. They are not yours to close, retitle, or reuse.
- **Do not reopen or resurrect `phase1` issues.**
- Issues #174–#181 were closed as superseded — they predated the finalized schema and the two design decisions. Do not revive them.

### 5.5 No meta-tooling

> "Do not build validators, registries, ledgers, councils, dossiers, readiness states, or any code whose purpose is to govern this project. If a change doesn't move pixels or data for the single user, don't make it."

The first attempt at this project produced 137 commits and ~5,800 lines of coordination code and **zero rendered journal entries**. That is why `main` was reset. Applied to you: your output is a plan and tickets, which is exactly what the owner asked for — but do not invent a ticket-numbering scheme, a traceability database, a coverage tracker, or a script that generates tickets from a YAML file. Write the tickets.

---

## 6. Decisions already made — do not relitigate these

### 6.1 Visual design: prototype v10, green, with a rail (decided 2026-08-20)

`reference/UX-SPECIFICATION.md` §28.1 and `reference/prototype-v10` disagreed about the palette. The owner compared them side by side in a throwaway prototype and chose v10:

- accent `#255949`
- focus ring `#0a7762`
- `--rail-width: 238px`, a **persistent navigation rail**

**This overrides `WF-01`'s prohibition on a persistent primary-navigation rail.** That wireframe rule is superseded for this build, not accidentally ignored — say so if a ticket touches navigation.

Type scale, 4px spacing steps, 12/10/8px radii, and 120/180/240ms motion with a `prefers-reduced-motion` override are undisputed between the two references and come from UX §28.2–28.4.

Recorded in `docs/IMPLEMENTATION-PLAN.md` §8.1 and §5.6, and in ticket #187.

### 6.2 Photo ingest for v0.1: a local command (decided 2026-08-20)

M3 gets photos in via `npm run ingest`: drop files in `data/inbox/photos/`, SHA-256 dedup, date inference filename → EXIF → mtime in Asia/Kolkata, undatable-or-future → `journal_date = NULL` (Needs Date Review), **copies never moves**, leaves the inbox file in place. Date-inference and dedup get tests *before* the command is ever pointed at real photos.

**This does not go away when Telegram arrives in M8.** Telegram is an additional Source Item origin, not a replacement. Your M8 tickets must not delete or deprecate the ingest command.

### 6.3 Stack (from plan §2)

Node 22 LTS, TypeScript, Fastify, `better-sqlite3`, server-rendered HTML from tagged-template functions, `tsx` for dev / `tsc` for build, one stylesheet, `sharp` at M3, `node:test` + `node:assert`.

**Explicitly rejected:** React, Next.js, any ORM, any migration framework, any job queue, Docker.

Two of those rejections come under real pressure in your scope and you must handle it honestly rather than quietly reversing a decision:

- **No job queue** vs. the 01:00 Asia/Kolkata AI text refresh, the 01:00 Artwork Sweep, the 15-minute Source Quiet Period, VoiceNotes reconciliation, and scheduled backups. The PRD defers "durable job/scheduler mechanism" to an ADR. File that ADR as the first ticket of the first milestone that needs it (M10) and let it decide; do not assume a queue and do not assume cron.
- **`better-sqlite3` + no migration framework** vs. adding a lot of new tables across M8–M17. The existing migration runner (#185) is a plain numbered-SQL runner. Your tickets should extend it, not replace it.

### 6.4 Schema

`docs/IMPLEMENTATION-PLAN.md` §5.1 holds the complete v0.1 schema, and ticket #185 carries it verbatim. Four tables built around `source_item`, `source_revision`, `media_asset`, and the day/photo relationship. **Every new table you specify must be additive to this.** Read §5.1 before you write a single schema line into a ticket, and reference existing column names exactly.

### 6.5 Naming conventions

- Milestone titles: `Phase 1.5 — M<n> — <short outcome in plain words>`, using an em dash with spaces. The outcome is written from the owner's point of view, not the implementer's — "Photos arrive from the phone over Telegram," not "Implement Telegram webhook handler."
- Issue titles: concrete and specific, often naming the route, file, or requirement ID. Look at the 36 existing titles in §9.3 and match their register.

---

## 7. How to operate GitHub

### 7.1 Coordinates

| Thing | Value |
|---|---|
| Repo | `arunpr614/Life-Reflection` (private) |
| Project | user project **number 1**, "Life Reflection", node id `PVT_kwHOD9kkX84BgUtf` |
| Project owner login | `arunpr614` (a **user** project, not an org project — use `user(login:)` in GraphQL) |
| The view the owner reviews | **"Phase 1.5 Status"**, view number 8, id `PVTV_lAHOD9kkX84BgUtfzgLX5vA`, board layout, filter `label:phase1.5` |

Because that view filters on `label:phase1.5`, **an issue appears on the owner's board if and only if it carries the `phase1.5` label and has been added to project 1.** Both are required. Label alone is not enough; project membership alone is not enough.

### 7.2 Creating a milestone

```sh
GH_HOST=github.com gh api repos/arunpr614/Life-Reflection/milestones \
  -f title="Phase 1.5 — M7 — Find any day, and browse the archive like a book" \
  -f description="<one or two sentences on the user-visible outcome>" \
  -q '.number'
```

Existing Phase 1.5 milestones are numbers 50–55 for M1–M6. Yours will be assigned sequentially — probably 56 onward, but **read the returned `.number`, do not assume it.**

### 7.3 Creating an issue — and the flag that will trip you

```sh
GH_HOST=github.com gh issue create \
  --title "Search: GET /search with FTS5 over journal text" \
  --body-file /tmp/ticket.md \
  --milestone "Phase 1.5 — M7 — Find any day, and browse the archive like a book" \
  --label phase1.5 --label type:feature --label priority:high --label status:backlog
```

**`--milestone` takes the full title string, not the number.** Passing `--milestone 56` fails with `could not add to milestone '56': '56' not found`. This already wasted time once.

Write each body to a temp file and use `--body-file`. Ticket bodies contain backticks, `#` characters, checkboxes, and sometimes SQL — passing them inline through a shell is how you get mangled markdown.

### 7.4 Adding an issue to the project

```sh
GH_HOST=github.com gh project item-add 1 --owner arunpr614 \
  --url https://github.com/arunpr614/Life-Reflection/issues/<N>
```

This returns the item id, or fetch it later:

```sh
GH_HOST=github.com gh api graphql -f query='
query { repository(owner:"arunpr614",name:"Life-Reflection"){
  issue(number:<N>){ projectItems(first:5){ nodes { id project { number } } } } } }'
```

### 7.5 Setting project field values

`Labels` and `Milestone` are **derived** project fields — they mirror the issue and cannot be set through the project API. Setting them on the issue (§7.3) is all that is needed.

`Status` and `Priority` are real single-select project fields and must be set explicitly:

```sh
GH_HOST=github.com gh api graphql -f query='
mutation {
  s: updateProjectV2ItemFieldValue(input:{
    projectId:"PVT_kwHOD9kkX84BgUtf"
    itemId:"<ITEM_ID>"
    fieldId:"PVTSSF_lAHOD9kkX84BgUtfzhahTpA"
    value:{singleSelectOptionId:"f75ad846"}}) { projectV2Item { id } }
  p: updateProjectV2ItemFieldValue(input:{
    projectId:"PVT_kwHOD9kkX84BgUtf"
    itemId:"<ITEM_ID>"
    fieldId:"PVTSSF_lAHOD9kkX84BgUtfzhah0Eg"
    value:{singleSelectOptionId:"665e4024"}}) { projectV2Item { id } }
}'
```

### 7.6 All the IDs, verified 2026-08-21

**Fields on project 1:**

| Field | Id | Type |
|---|---|---|
| Title | `PVTF_lAHOD9kkX84BgUtfzhahTo4` | TITLE |
| Assignees | `PVTF_lAHOD9kkX84BgUtfzhahTo8` | ASSIGNEES |
| **Status** | `PVTSSF_lAHOD9kkX84BgUtfzhahTpA` | SINGLE_SELECT |
| Labels | `PVTF_lAHOD9kkX84BgUtfzhahTpE` | LABELS (derived) |
| Milestone | `PVTF_lAHOD9kkX84BgUtfzhahTpM` | MILESTONE (derived) |
| Repository | `PVTF_lAHOD9kkX84BgUtfzhahTpQ` | REPOSITORY |
| Parent issue | `PVTF_lAHOD9kkX84BgUtfzhahTpc` | PARENT_ISSUE |
| **Priority** | `PVTSSF_lAHOD9kkX84BgUtfzhah0Eg` | SINGLE_SELECT |
| Team | `PVTSSF_lAHOD9kkX84BgUtfzhahT1c` | SINGLE_SELECT — leave unset |
| Iteration / Quarter | `PVTIF_lAHOD9kkX84BgUtfzhahT1g` / `...T1k` | ITERATION — leave unset |

**Status options:** `Backlog` = `f75ad846`, `Next` = `b753d38d`, `In progress` = `47fc9ee4`, `Done` = `98236657`.

**Priority options:** `High` = `665e4024`, `Medium` = `20d2f405`, `Low` = `2c5259bb`.

**Views:** 4 "Phase 1 Status", 5 "Phase 1 Roadmap", 6 "Phase 2 Status", 7 "Phase 2 Roadmap", **8 "Phase 1.5 Status" (`PVTV_lAHOD9kkX84BgUtfzgLX5vA`) — the one that matters.**

### 7.7 Two known API limitations

1. **You cannot set "group by" on a project view through GraphQL.** `updateProjectV2View` accepts `filter` and `visibleFieldIds` but not grouping. View 8 currently groups by Status; the owner can switch it to group by Milestone in the UI in two clicks. If you think it should group by Milestone, say so in your summary — don't burn twenty tool calls trying.
2. `createProjectV2View`'s payload field is **`projectV2View`**, not `view`. `{ view { ... } }` fails schema validation.

### 7.8 Rate and batching

You are about to make ~88 × 3 = ~264 API calls. Batch the GraphQL mutations (several aliased mutations per request, as in §7.5). Create the milestone, then all its issues, then add that milestone's issues to the project and set their fields — finish one milestone completely before starting the next, so that if you are interrupted the board is never half-populated for a milestone.

---

## 8. What the owner expects a GitHub issue to look like

### 8.1 The six-section structure — mandatory, in this order

```markdown
## Outcome
## Scope
## Technical notes
## Acceptance criteria
## References
## Depends on
```

Never add sections. Never reorder. Never omit one — if a ticket genuinely has no dependencies, write `- None` under `## Depends on`.

### 8.2 What goes in each section

**`## Outcome`** — one or two sentences, in plain language, describing what becomes true for the owner. Written for a person, not a tracker. This is the section the owner actually reads. "Given a photo file, the app can correctly decide which Journal Date it belongs to — or correctly decide that it can't, and say so."

**`## Scope`** — a bulleted list of the concrete work. Name the actual files (`src/domain/ingest-date.ts`), the actual routes (`GET /search`), the actual columns. This is where you spend your detail budget. An implementing agent reads this and knows what to create.

**`## Technical notes`** — the judgement calls, traps, and prior art. Which library, and why the small one. Which spec rule is superseded. Which reference document is over-scoped and what part of it to ignore. Where the specificity trap is. This section is what separates a useful ticket from a title.

**`## Acceptance criteria`** — GitHub checkboxes (`- [ ] `). Each one **observable**: a test that passes, a thing you can see in a browser, a state you can query. Not "works correctly." Not "is well designed." If a criterion can't be checked by looking, rewrite it.

**`## References`** — file paths with section numbers (`docs/IMPLEMENTATION-PLAN.md` §5.1), requirement IDs (`LID-TG-004`), UX IDs (`UX-DUP-03`), flow letters (`Flow D`), and wireframe annotations (`WF-08`). Be specific to the section; "see the PRD" is useless.

**`## Depends on`** — issue numbers with a two-word reason: `- #186 (journal-date.ts)`. Cross-milestone dependencies are expected and important; you have 36 existing issues (§9.3) to point at.

### 8.3 A real example — copy this register

This is issue #197 exactly as filed. Match this level of specificity.

```markdown
## Outcome
Given a photo file, the app can correctly decide which Journal Date it belongs to — or
correctly decide that it can't, and say so — before it is ever pointed at a real photo.

## Scope
- `src/domain/ingest-date.ts`: given a filename and file stats, derive a Journal Date by,
  in order: a leading `YYYY-MM-DD` in the filename; else EXIF `DateTimeOriginal`; else file
  mtime — each interpreted in Asia/Kolkata via #186 (`journal-date.ts`)
- If no date can be derived, or the derived date is in the future (`isFutureJournalDate`),
  the function returns "undated" rather than guessing
- Tests covering all four branches: filename hit, EXIF hit (no filename date), mtime
  fallback (neither), and undated/future

## Technical notes
This is one of the two pieces of ingest logic called out by name in the approval decision
(plan §4) as needing its own tests **before** the ingest command is ever pointed at real
photos — write and pass these tests before the dedup/copy ticket is wired to an actual CLI.
EXIF reading needs a library decision (this ticket should pick the smallest one that reads
`DateTimeOriginal` without pulling in a full image-processing stack — that's `sharp`'s job
later in this milestone, not this ticket's).

## Acceptance criteria
- [ ] `node --test` covers and passes all four derivation branches
- [ ] A filename like `2026-08-03-beach.jpg` derives `2026-08-03` regardless of its EXIF or mtime
- [ ] A file with no filename date and a future EXIF/mtime date returns "undated," never a guessed date

## References
- `docs/IMPLEMENTATION-PLAN.md` §4, §8.2 (decision)
- UX-DATE-03, UX-DATE-04 (undatable items go to the holding queue, not guessed at), UX-GEN-11, UX-GEN-13

## Depends on
- #186 (journal-date.ts)
```

### 8.4 Extra requirements for specific ticket kinds

**Any ticket that renders UI** must carry, in its acceptance criteria, the verification loop from `UI-DESIGN-INSTRUCTIONS.md` §1 and §9 — rendered in a real browser, screenshotted, differences from intent **listed in text**, checked at 375/768/1440, keyboard-tabbed with visible focus, no console errors, copy drawn from `reference/CONTEXT.md`. Do not restate all ten bullets in every ticket; write one line — `- [ ] UI verification loop per UI-DESIGN-INSTRUCTIONS.md §9 completed and differences recorded on this issue` — plus whichever specific checks matter for that screen.

**Any ticket that touches an AI provider** must state the privacy boundary in its scope, not just its notes: what is sent, and the enumerated list of what is never sent. See §10, M10 and M11.

**Any ticket whose requirement the PRD has explicitly deferred to an ADR** must be a decision ticket that produces a written decision, labelled `type:architecture`, and must be the lowest-numbered ticket in its milestone. It does not also implement the thing.

**Any ticket that carries a schema change** should include the SQL verbatim, the way #185 does. An implementing agent should not have to invent column names.

### 8.5 Length

The existing 36 tickets run roughly 250–600 words. Longer where a contract is subtle (#197, #198, #210 carry full transaction and inference contracts); shorter where the work is mechanical. Do not pad to hit a length, and do not compress a real contract to save space.

---

## 9. Metadata

### 9.1 Labels — apply exactly four per issue

| Slot | Values | Rule |
|---|---|---|
| Phase | `phase1.5` | **always, on every issue** — this is what puts it on view 8 |
| Type | `type:feature` · `type:chore` · `type:architecture` · `type:evaluation` · `type:spike` · `type:quality` · `type:product-definition` | exactly one |
| Priority | `priority:high` · `priority:medium` · `priority:low` | exactly one |
| Status | `status:backlog` | exactly one; everything you file is backlog |

All of these already exist in the repo. `type:architecture`, `type:evaluation`, `type:spike`, and `type:quality` are older "work package" labels from the abandoned effort — reusing them here is fine and better than creating near-duplicates. `accessibility` exists as a bare label (not `type:accessibility`); use the bare `accessibility` label alongside `type:quality` for M18 tickets rather than creating a new one.

**Never apply:** `phase1`, `phase2`, any `version:v*`, `roadmap`. Those belong to the abandoned effort's backlogs.

### 9.2 Priority guidance

- `priority:high` — the milestone cannot ship without it; a gate; a data-integrity or privacy contract.
- `priority:medium` — real product value, but the milestone is demonstrable without it.
- `priority:low` — polish, an edge state, or a nicety.

Roughly half the existing tickets are high. Don't make everything high; a board where everything is high has no priority field.

### 9.3 The 36 existing issues — cite these in `## Depends on`

| Milestone (id) | Issues |
|---|---|
| **M1** — A real month renders in the browser (50) | #184 scaffold Node 22 + TS + Fastify · #185 migration runner + four v0.1 tables · #186 `journal-date.ts` Asia/Kolkata + boundary tests · #187 CSS token layer (v10 palette + UX §28.2–28.4) · #188 fictional-data seed script · #189 calendar grid `GET /calendar`, `GET /` · #190 local dev script + README smoke check |
| **M2** — Click a day and read a journal (51) | #191 `html` tagged-template escaping helper · #192 `GET /day/:journalDate` · #193 Source Item cards, Original Timestamp, `en-IN` · #194 adjacent-populated-day navigation · #195 calendar keyboard navigation |
| **M3** — Real photos on the calendar and the day (52) | #196 local filesystem storage backend put/getStream/head · #197 ingest date inference + tests · #198 `npm run ingest` dedup, copy-never-move, Needs Date Review · #199 `sharp` derivatives, metadata stripped · #200 `GET /media/:id/derivative`, `/original` · #201 Calendar Cover selection (UX-CAL-04) · #202 day gallery · #203 keyboard photo reordering (UX-DAY-06) |
| **M4** — Upload a journal from the browser (53) | #204 `GET/POST /upload` · #205 upload review step · #206 upload duplicate detection `content_sha256` · #207 full UX-UPLOAD error table · #208 `GET /review` Needs Date Review queue |
| **M5** — Correct, redate, and trash without losing anything (54) | #209 Correction appends a Source Revision · #210 redate transaction `src/domain/redate.ts` · #211 Change Journal Date UI · #212 Trash 30-day window · #213 restore from Trash · #214 day history + Make calendar cover |
| **M6** — The archive runs on the Hetzner host (55) | #215 production build + process supervision · #216 Cloudflare Tunnel + Access, origin on loopback · #217 backup script (SQLite Online Backup API + originals) · #218 documented, rehearsed restore · #219 first deployment + phone smoke check |

Two of these matter especially for your scope:

- **#216** deliberately does *not* validate the Cloudflare Access assertion in the app — it gates at the edge only, and says app-level JWT validation "is a distinct, later ticket." `LID-OPS-001` requires that validation. **That later ticket is yours** (M13 or M17 — put it wherever you land it, but do not lose it).
- **#217/#218** give a local two-copy backup. `LID-OPS-*` requires Restic to Backblaze B2 EU Central with 48 hourly / 30 daily / 12 monthly retention, monthly `restic check` plus sampled restore, and a quarterly full drill measured against a 4-hour objective. **Your M15 supersedes them in capability without deleting them** — the local script stays as the fast path.

---

## 10. The milestone plan — M7 through M19

This is the shape I recommend and the owner has seen the outline of. You own the details. If you find a better cut of the same scope, take it, and explain the change in your summary — but keep the count at 13 milestones and keep every requirement ID in §4.2 accounted for somewhere.

**Sequencing principle:** each milestone must end with something the owner can see or do that he could not before (`CLAUDE.md`: "every working session should end with something visible in the browser"). That is why the invisible infrastructure (encryption, storage, backups) sits after the visible features, even though some of it would be marginally cheaper earlier. Note that tension in your plan document rather than pretending it doesn't exist.

**Gate principle:** where the PRD requires a spike, an evaluation, or an ADR before implementation, that becomes the **first ticket of the milestone it blocks**, labelled `type:spike` / `type:evaluation` / `type:architecture`, and every implementation ticket in that milestone declares a dependency on it. Do not create a separate "decisions" milestone — it would produce a milestone with nothing visible at the end of it.

---

### M7 — `Phase 1.5 — M7 — Find any day, and browse the archive like a book`
**Target: ~8 tickets.** First because it needs nothing external — no provider, no bot, no cloud — and the tables from M1 already hold everything it reads. It is the cheapest large win available after M6.

- Lexical search only (`LID-REF-003`, UX §8, `UX-SEARCH-01..09`): query, filters, result anatomy, empty/no-match/too-many states. Semantic search is deferred (`LID-DEF-003`) — say so in the ticket so nobody reaches for embeddings.
- Photo Captions are searchable (this is the one place captions surface) but **excluded from all AI input** — that boundary is set here and consumed in M10.
- Monthly Almanac (`LID-REF-002`, UX §7, `UX-TIME-01..06`). **The Almanac *is* the timeline — there is no competing "Timeline" tab.** UX is explicit about this; a ticket that adds one is wrong.
- Search index work extends the migration runner (#185) with FTS5. Include the SQL.
- Navigation rail entries for both surfaces, consistent with §6.1's decided rail.

### M8 — `Phase 1.5 — M8 — Photos arrive from the phone over Telegram`
**Target: ~10 tickets.** `LID-TG-001..010`, `LID-OPS-002`, UX §18, `UX-TG-01..08`, `UX-DUP-01..05`, Flows B, C, D.

The contract detail here is unusually sharp; get it into the tickets verbatim:

- **Authorization** (`LID-TG-001`): webhook secret valid **and** exact numeric sender ID **and** exact numeric private-chat ID. Reject groups and every other sender/chat, **before media download**. IDs and bot token are runtime configuration — never source constants, never logged.
- **Callback boundary** (`LID-OPS-002`): a separate host `life-hooks.arunp.in` serving **no human route**, bounded request sizes, rate protection, no access to human media or session routes, payloads sanitized out of logs. This is new hosting surface beyond #216 — depend on it.
- Accept compressed photos **and** still-image documents; **preserve exact bytes**.
- Accept JPEG/PNG/WebP/HEIC/HEIF. Reject animated images, SVG, TIFF, PDF, RAW, anything >20MB, >100MP, or >20000px on a side. **Determine format from decoded content, not from the filename.**
- **Acknowledge only after a durable commit**, and the acknowledgement includes the assigned Journal Date and a link to change it. **Never auto-delete the Telegram message.**
- A leading `YYYY-MM-DD` in a caption applies to that photo, or to the whole `media_group_id` if it is an album.
- An invalid or future date → Needs Date Review. **Never a silent fallback to the receipt date.**
- No limit on photos per day. The first Daily Photo of a day is the default cover.
- **Global** plaintext checksum dedup, with an explicit **Add duplicate anyway** action producing a distinct Source Item pointing at one Media Asset.
- Originals unchanged; thumbnails generated locally with EXIF/IPTC/XMP stripped.

### M9 — `Phase 1.5 — M9 — Journals arrive by voice, without trusting an unproven integration`
**Target: ~8 tickets.** `LID-VN-001..007`, UX §19.1, §22, §17.2, `UX-SET-01`, `UX-FIRST-02..04`, `UX-SUP-01..03`, Flows A and L.

- **First ticket is the synthetic spike gate** (`LID-VN-001`, `type:spike`, `priority:high`): prove webhook-to-MCP note identity, payload handling, authoritative retrieval, unattended OAuth renewal, tag/date/transcript access, reconciliation, and error/rate behaviour — **using no personal journal**. Its deliverable is a written spike result recording evidence and unresolved gaps. A failed identity/auth/reconciliation gate **blocks** the rest of the milestone. Every other M9 ticket depends on it.
- The webhook is **only a wake signal**; the MCP surface is authoritative. Never assume the webhook transcript is complete.
- Eligibility is the **exact tag `life-in-days`** plus a creation timestamp at or after Integration Activation. Never fuzzy matching. Activation **cannot be backdated** (that's what keeps `LID-DEF-001`, historical import, out).
- Missing or untrusted upstream timestamp → Needs Date Review. **Never the webhook receipt time.**
- Reconciliation is replay-safe and idempotent; duplicate and out-of-order wakeups are harmless.
- An upstream edit creates a **Source Revision**. Untagging or deleting upstream **never silently erases the local item**.
- Source Suppression prevents resurrection; restoring removes the suppression; **Allow re-import** is an explicit action.

### M10 — `Phase 1.5 — M10 — Every day gets a title, a summary, and tags`
**Target: ~10 tickets.** `LID-AIT-001..007`, UX §13, §19.2, `UX-REVIEW-01..05`, `UX-PRIV-01..08`, Flow I.

- **First ticket is the evaluation gate** (`LID-AIT-001`, `type:evaluation`, `priority:high`): the 32-fixture, three-repeat, blinded protocol across the named candidate models, with Claude models as external controls only, **synthetic fixtures**, and a **shared one-time $15 ceiling with the artwork evaluation in M11**. Frozen prompts and schema, randomized grading, recorded cost/latency/provenance. Spend stops before $15. No model is exposed in the product before passing. Note in the ticket that the two evaluations share one budget — whichever runs second inherits the remainder.
- **Second ticket should be the durable job/scheduler ADR** (`type:architecture`) — the 15-minute Source Quiet Period and the 01:00 Asia/Kolkata final refresh are the first things in the whole product that need a scheduler, and plan §2 rejected job queues. Decide it here, once, for M10/M11/M15 to share.
- Output contract: one concise title; one factual **80–140-word** summary; **3–7** short unique tags; a **150–300-token Visual Brief**. The Visual Brief is produced here and consumed in M11.
- **Privacy boundary, stated in scope not just notes:** send **ordered normalized journal text only**. Never photos, never photo derivatives, **never Photo Captions**, never account identifiers, never internal IDs, never credentials. Requests are stateless. No files, no tools, no grounding.
- Per-field protection: a manual edit or an explicit accept protects that field; `Resume automatic updates` removes protection **for that field only**.
- Independent **Text Provider** and **Artwork Provider** dropdowns, with **no silent fallback** between them.
- Retry timeout / 429 / transient 5xx up to 3× with backoff and jitter, honouring `Retry-After`. Retry an invalid schema **once** against the same provider. **Stop** on auth, quota, or billing errors — do not retry, do not switch provider.

### M11 — `Phase 1.5 — M11 — Days without a photo still have a face`
**Target: ~11 tickets.** `LID-AIA-001..011`, UX §14, `UX-ART-01..17`, Flows J and K.

- **First ticket is the artwork evaluation gate** (`LID-AIA-001`, `type:evaluation`): ten-prompt blind stage across the named image models, then a second blind uncurated run for the best passing OpenAI and Google option. Contract, privacy, lifecycle, permanent-retention and 4:5 gates run **before** scoring. Synthetic prompts only. Shares the $15 ceiling with M10. Ship one passing OpenAI and one passing Google option; a hard-gate failure goes back to the owner.
- **The read-only Visual Brief is the sole personal-content input to the Artwork Provider.** Nothing else — no journal text, no photo, no caption. This is the single most important sentence in the milestone.
- `Generate artwork now` is enabled at ≥5 meaningful words, warns between 5 and 19, and is disabled below 5. It does **not** wait for the quiet period.
- The 01:00 Artwork Sweep requires **all** of: ≥20 meaningful words, no live Daily Photo, no existing Generated Artwork, no Artwork Suppression, a sweep-eligible model, and budget/credential/safety clearance.
- Style: warm painterly editorial, 4:5. No photorealism, no likeness, no readable words, no logos, no signatures, no imitation of a named living artist.
- **No auto-retry on a safety refusal. No provider switching.**
- Every success is a retained version; newest is the Active Artwork; earlier versions remain selectable.
- **A real Daily Photo always outranks artwork for the Calendar Cover** — this must not regress #201.
- Artwork Suppression blocks the sweep only; `Allow generation` removes it.
- A late text change marks artwork **stale**; regeneration is manual only.
- Approved model configuration is typed and carries an `automatic_sweep_eligible` flag; premium models are manual-only (`false`).

### M12 — `Phase 1.5 — M12 — Upstream edits and your Corrections stop fighting`
**Target: ~6 tickets.** `LID-SRC-001..004`, UX §15, §16, `UX-REDATE-04..05`, `UX-HIST-02/05/07`, Flow H.

- A Correction leaves original source content and every Source Revision intact, and records author, time, and the revision it was based on.
- Conflict resolution offers **exactly three actions**: **Keep the Correction** · **Display newest upstream revision** · **Create a new Correction based on both**. Not two, not four, and not a free-text merge.
- Atomic redating recalculates, in one transaction: the real-photo cover, artwork cover eligibility, search and day visibility, and stale state on **both** the old and the new day. Extends #210 — depend on it and cite its transaction steps.
- Derived Artifacts bind to an **exact ordered set** of source revisions and Corrections, so history can be reconstructed and export can prove provenance.
- History and provenance view (§16): the UI must never label a Correction as upstream text.

### M13 — `Phase 1.5 — M13 — The archive is unreadable without the key`
**Target: ~6 tickets.** `LID-OPS-003`-adjacent, UX §27, plus the deferred #216 follow-up.

- **First ticket is the encryption and key-design ADR** (`type:architecture`, `priority:high`). The PRD specifies **application-controlled, versioned encryption at rest** and is explicit that this is **not** end-to-end and **not** zero-knowledge. **It never names SQLCipher** — the Hetzner spike does, and the spike is not authority. The ADR chooses the mechanism, the key custody model, the version/rotation scheme, and what the threat model actually is. Every other ticket in the milestone depends on it.
- App-boundary validation of the signed Cloudflare Access assertion (`LID-OPS-001`) — the piece #216 explicitly deferred. Missing or invalid assertion is rejected; only the exact owner identity passes; session expiry reauthenticates; **no journal route is exempt**; and **no second username/password layer is built**. MFA required, 7-day session.
- Secure media staging: ≤20MB, memory-backed, resource-limited decode, **one derivation job at a time** on the 4GB host, and **refuse to start if unencrypted swap is active**.
- Secrets are runtime-only — never committed, never logged, never exported, never sent over Telegram.
- `Cache-Control: private, no-store` on every personal path (verify, don't re-implement — #216 already asserts it).
- Be honest in the tickets about what this does and does not protect against. The PRD is; the tickets should be.

### M14 — `Phase 1.5 — M14 — Storage grows without ever surprising you`
**Target: ~7 tickets.** The `LID-OPS-*` storage and migration requirements.

- Watermarks, exactly as specified — each is a distinct behaviour, not a log line: **7GB media / 18GB free → warn**; **8GB / 15GB → dual-write**; **9GB / 13GB → target writes at the new backend**; **10GB / 12GB → reject new media**. **Never delete and never downsample an Original**, at any watermark.
- R2 Standard EU with **random opaque keys** (no dates, no filenames, nothing inferable from the key).
- Cutover to R2 happens **only after all of**: a complete paginated inventory reconciliation, verified hashes and counts, a fail-closed Restic path, proof of dual-write, and **7 days of observed reads**. Make that a checklist in an acceptance-criteria block, not prose.
- A Media Asset is deleted only when **no** live and **no** Trash Daily Photo still references it.
- Trash remains 30 days (extends #212).

### M15 — `Phase 1.5 — M15 — Recovery you have actually rehearsed`
**Target: ~7 tickets.** The `LID-OPS-*` backup and recovery requirements, UX §20 Recovery Ceremony.

- Restic snapshots to a private Backblaze **B2 EU Central** bucket, retention **48 hourly / 30 daily / 12 monthly**.
- Monthly `restic check` plus a **sampled restore**. Quarterly **full drill measured against a 4-hour objective**.
- **Upload success is never restore evidence.** Put that sentence in the ticket. It is the single most common way backup projects lie to themselves.
- The **Recovery Ceremony** is a launch gate: two independent off-server copies of the key (a password manager and a sealed offline copy) plus a representative restore-and-decrypt. **The gate cannot be bypassed.** It depends on M13's ADR.
- Needs the R2-to-Restic remote-source backup mechanism ADR (`type:architecture`) — backing up a remote object store is a different problem from backing up a local disk, and the PRD defers the mechanism. First ticket of the milestone.
- Supersedes #217/#218 in capability; keep the local fast path.

### M16 — `Phase 1.5 — M16 — Take the whole archive with you`
**Target: ~4 tickets.** UX §21, Flow M.

- Export contents (§21.1) — including the provenance binding from M12, so an export can reconstruct source, revisions, and Corrections.
- **AES-256 ZIP** with a **one-time passphrase that is never stored**. The implementation of that encryption is a deferred ADR — note it in the ticket; it may be small enough to decide inline, but don't pretend it was already decided.
- Download lifecycle: the server-side artifact is deleted **after the first successful download, or after 1 hour**, whichever comes first.

### M17 — `Phase 1.5 — M17 — The archive tells you when it needs attention`
**Target: ~7 tickets.** UX §20, `UX-HEALTH-01..11`, the `LID-OPS-*` observability requirements.

- System Health states are **exactly** `unknown` · `never run` · `success` · `delayed` · `failed` · `blocked`. The UI renders them as Unknown / Never verified / Healthy / Attention — delayed / Failed / Blocked. **`Unknown` and `Never verified` are never green.** `Not configured` is a separate thing, not a health state.
- Telegram alerts **only after repeated failures**. **Never journaling reminders** — the product does not nag its user.
- **No third-party analytics**, ever.
- 30-day sanitized structured logs with an **allowlist-first schema** — fields are permitted in, not redacted out after the fact. This distinction is the requirement; a post-hoc redaction pass does not satisfy it.

### M18 — `Phase 1.5 — M18 — Usable by keyboard, by screen reader, on a phone`
**Target: ~7 tickets.** UX §25, §26, §30, §31, `UX-A11Y-01..17`, gates `UXG-05` and `UXG-10`.

- The accessibility contract: semantics and structure, keyboard and focus, visual and cognitive accessibility, diff and complex content (§26.1–26.4).
- Browser matrix: the current two major versions of Chrome, Edge, Firefox, and Safari, plus iOS Safari and Android Chrome.
- Loading, error, interruption, and offline-ish states (§30) — audited across every surface M7–M17 added, not just the M1–M6 ones.
- Label these `type:quality` plus the bare `accessibility` label.
- This is an audit-and-fix milestone across everything built. Its tickets should be organised by surface, not by WCAG criterion, so each one is completable.

### M19 — `Phase 1.5 — M19 — Ready to trust with fourteen years of days`
**Target: ~4 tickets.** Release acceptance.

- Walk UX §35's acceptance summary and §34's traceability matrix against what was actually built, and record the result.
- Walk the PRD's Provider and Privacy Risk Checklist (line 249) and the Legal / Personal Data Processed section (line 261).
- Verify the M15 Recovery Ceremony gate actually passed, since it is the one gate that cannot be bypassed.
- **One ticket recording the six deferred boundaries** — see §11.

---

## 11. `LID-DEF-*` — hold the boundary, don't build it

`LID-DEF-001..006` are **deferral boundaries, not specifications**:

| ID | Deferred |
|---|---|
| `LID-DEF-001` | historical / bulk VoiceNotes import |
| `LID-DEF-002` | reflection surfaces / "On This Day" |
| `LID-DEF-003` | semantic search |
| `LID-DEF-004` | year mosaic, media wall, native app, offline |
| `LID-DEF-005` | PDF / Word / OCR / printing |
| `LID-DEF-006` | tag vocabulary expansion |

Each says, in effect: *not in this version; a future capability must be separately specified first, with named controls.* The PRD requires a **new product decision** before any of them becomes scope.

**Do not file them as implementation tickets.** File **one** ticket in M19 — `type:product-definition`, `priority:low` — that records all six boundaries and, for each, what a future specification would have to cover (preview, exact selection, privacy, deduplication, spend, rollback, for `LID-DEF-001`). Its purpose is to stop a future agent from drifting into them and to give the owner one place to say "now let's do semantic search."

That is one ticket, not six, and it is a record, not machinery — consistent with §5.5.

---

## 12. Write the plan document first

Before you file anything, write **`docs/IMPLEMENTATION-PLAN-POST-M6.md`** on `plan/post-m6`. It is the artifact the owner asked for and it is also how you catch your own contradictions before they are frozen into 88 tickets. (I caught exactly one that way last session: plan §5.6 still cited the old palette after §8.1 had chosen the new one, which would have contradicted ticket #187.)

Mirror `docs/IMPLEMENTATION-PLAN.md`'s structure so the two read as one plan in two parts:

1. **What "done" means for v1** — the sentence a person would say. M6's app plus: photos arrive by themselves, journals arrive by themselves, days describe themselves, empty days have a face, you can find anything, and you could lose the server without losing the archive.
2. **What changes in the stack** — and what does not. Be explicit about the scheduler and the provider-adapter shape, and explicit that React/ORM/Docker are still out.
3. **Schema additions** — additive to §5.1, with the SQL. New tables for source origins, provider configuration, derived fields and their protection state, artwork versions, suppressions, health events, and the search index.
4. **The privacy architecture** — one section, because it is the constraint that shapes M10 and M11 more than anything else. What crosses the boundary to a provider, and the enumerated list of what never does.
5. **Milestones M7–M19** — one paragraph each: user-visible outcome, requirement IDs covered, what it depends on, and what it deliberately does not do.
6. **What this plan still does not build** — `LID-DEF-*`, plus anything you consciously push past v1.
7. **Real risks** — in the register of the existing plan §8: specific, named, with the trap stated. Candidates: the two evaluations sharing one $15 ceiling; the scheduler decision leaking into four milestones; encryption arriving after the data does; a Visual Brief that is the only thing allowed to reach the artwork provider being derived from text that itself came from a provider; Telegram's format-sniffing requirement being easy to implement wrongly from the filename.
8. **Decisions needed from the owner** — see §13.
9. **Vocabulary** — only if you introduce a term §10 of the existing plan doesn't cover.

Explicitly state, near the top: **plan §7's rule ("if satisfying it requires an AI provider, a cloud storage backend, a cryptographic envelope, or an authentication decision, it is not a Phase 1.5 ticket") applied to M1–M6 and is now superseded.** Phase 1.5 has been expanded by the owner to cover the full v1 product. If you do not write that down, the next reader will think your M10–M15 tickets violate the plan they are filed under.

---

## 13. Open questions — surface these, do not decide them

Put these in your plan's §8 and in your closing summary to the owner. **Do not block on them** — file the tickets with the question named inside the relevant ticket.

1. **Hetzner host access timing** — still unanswered from plan §9 item 4. Needed at M6; now also gates M13–M15.
2. **Provider credentials** — both evaluation gates need test credentials the PRD says will be "supplied later." M10 and M11 cannot start without them.
3. **The $15 ceiling** — shared across two evaluations. Which runs first, and does the owner want a split (e.g. $8/$7) or first-come?
4. **VoiceNotes test account** — `LID-VN-001` requires one, and requires that no personal journal be used.
5. **Milestone ordering** — M13 (encryption) after M8–M11 means real Telegram photos and provider-derived text land on an unencrypted database first. That is a deliberate trade for visible progress, and it is the owner's call to make, not yours. Ask it plainly.
6. **B2 and R2 accounts** — M14 and M15 need real accounts and buckets in the EU regions specified.

---

## 14. Definition of done for your session

- [ ] `docs/IMPLEMENTATION-PLAN-POST-M6.md` written, committed on `plan/post-m6`, pushed
- [ ] 13 milestones created, titled `Phase 1.5 — M<n> — <outcome>`, each with a description
- [ ] ~88 issues created, every one with all six sections and non-trivial content in each
- [ ] Every issue carries exactly four labels including `phase1.5`
- [ ] Every issue is attached to project 1 with `Status = Backlog` and a `Priority` set
- [ ] Every gate ticket (`LID-VN-001`, `LID-AIT-001`, `LID-AIA-001`, encryption ADR, scheduler ADR, backup-mechanism ADR) exists and is depended on by its milestone's implementation tickets
- [ ] Every requirement ID in §4.2's "yes" rows appears in at least one ticket's `## References`
- [ ] The `LID-DEF-*` boundary ticket exists in M19
- [ ] A PR opened from `plan/post-m6` into `main`
- [ ] `git status` still shows the owner's four files untouched and uncommitted
- [ ] `git log -1 --format='%ae'` shows `arunpr614@users.noreply.github.com`
- [ ] A closing summary to the owner: the milestone list with counts, the six open questions from §13, and anything you cut or changed from §10 and why

### Verification commands

```sh
# Count and inspect what you filed
GH_HOST=github.com gh issue list --label phase1.5 --limit 200 --json number -q 'length'
GH_HOST=github.com gh issue list --label phase1.5 --limit 200 \
  --json number,title,milestone,labels \
  --jq 'sort_by(.number)[] | "\(.milestone.title)\t#\(.number)\t\(.labels|map(.name)|join(","))\t\(.title)"'

# Find issues missing from the project board (should print nothing)
GH_HOST=github.com gh issue list --label phase1.5 --limit 200 --json number -q '.[].number' | \
  while read n; do
    c=$(GH_HOST=github.com gh api graphql -f query="query { repository(owner:\"arunpr614\",name:\"Life-Reflection\"){ issue(number:$n){ projectItems(first:5){ nodes { project { number } } } } } }" \
        -q '.data.repository.issue.projectItems.nodes | length')
    [ "$c" = "0" ] && echo "MISSING FROM PROJECT: #$n"
  done

# Milestone tallies
GH_HOST=github.com gh api repos/arunpr614/Life-Reflection/milestones --paginate \
  -q '.[] | select(.title | startswith("Phase 1.5")) | "\(.number)\t\(.title)\topen=\(.open_issues)"'
```

The owner reviews on the **"Phase 1.5 Status"** board, view 8. Before you hand back, load it and confirm the new milestones actually appear there.

---

## 15. Two things about tone that matter here

**The owner reads the `## Outcome` line.** He asked, last session, "in simple words, paint me a picture what each milestone would give me as a user experience." He is the single user of this thing and he is deciding what to build by imagining using it. Write outcomes he can picture. "Days without a photo still have a face" is worth more to him than "implement artwork generation pipeline."

**Do not flag a gap and then quietly build around it.** I did that once last session — I marked photo ingest as needing the owner's confirmation and then designed all of M3 on top of my own proposal anyway, so a rejection would have invalidated the milestone rather than one ticket. He noticed, and asked me to explain it. If a ticket rests on something undecided, say so **inside that ticket**, and make the dependency structural: put the decision in its own ticket that the others depend on. That is the whole reason §10's gate principle exists.
