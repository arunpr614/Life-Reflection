# Handover — pick up milestone execution, starting with M0.1

**Written:** Friday, 21 August 2026, 18:29 IST
**Written by:** the agent that finished `docs/IMPLEMENTATION-PLAN-POST-M6.md`, filed all of M7–M19 plus a new M0.1 milestone (104 issues total this session), merged PR #315 into `main`, and ran the shared-host spike that produced M0.1 — working from `docs/HANDOVER-M7-M19-TICKETING.md`'s original brief and its own predecessor handover.
**For:** the next AI agent — most likely to execute M0.1's spikes, or (once M0.1 clears) to begin M1's actual implementation.
**Relationship to prior documents:** `docs/HANDOVER-M7-M19-TICKETING.md` (762 lines) was the controlling brief for writing the M7–M19 plan and filing its tickets. That job is now **finished** — read it for the six-section ticket standard, the label/metadata rules, and the register to match, but its own "what's left to do" framing no longer applies. `docs/HANDOVER-POST-M6-PLANNING-2026-08-21-1458.md` (681 lines) was written mid-task, before the plan document was finished — this document supersedes its status sections entirely (that handover's "not yet done" list is now done, plus two of its own claims turned out to be wrong and are corrected below). Where any of these disagree with this document on a fact of the world — a line number, an issue number, a milestone count — **this document is newer and wins.** Where they disagree on what the job *is*, the older, more authoritative brief wins; nothing here changes scope on its own.

---

## 0. The 60-second version

Life in Days is a private, single-user journal archive. The M7–M19 plan document is finished, committed, and merged into `main` (PR #315). 140 GitHub issues now exist across 20 milestones (M1–M19 plus a new M0.1) — **but zero application code exists anywhere in this repository, on any branch.** M1–M6 (36 issues, milestones 50–55) are fully open; nothing has been built or deployed, despite an earlier draft of this plan wrongly claiming M6 was closed (corrected — see §6.4).

**The single most important thing not to do yet:** M0.1 (milestone 69, issues #316–#324) is a new, higher-priority-than-M1 milestone the owner asked for this session, investigating whether the shared Hetzner host can safely run three services and whether a cheaper/better hosting option exists. Its first ticket (#316) is safe to start immediately — read-only reconnaissance. Everything from #317 onward actively generates load against, or deploys something temporary to, a **shared production host that two other real products depend on** — get the owner's explicit go-ahead before running any of those, even though they're designed to be reversible.

---

## 1. Which folder to work in

```
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/Life-in-Days
```

That is the repository root, a git worktree checked out on `plan/post-m6`, remote `origin` = `https://github.com/arunpr614/Life-Reflection.git`.

### 1.1 Other directories and what each permits

| Path | What it is | Your access |
|---|---|---|
| `Life-in-Days-archive` (sibling, one level up) | Git worktree of the same repo, `archive/generation-0` — the frozen salvage from the abandoned pre-reset effort | Read-only reference if curious about prior art. Do not modify, do not check out that branch here. |
| `Life-in-Days-design` (sibling, one level up) | Git worktree of the same repo, `design/m1-m6-prototypes` | **Someone or something else is actively working here right now** — its HEAD moved from `4d94833` to `01f66f1` during this session, with a new commit titled "Design system one-pager, plus close the specimen's verification loop." Not investigated. Leave it alone; if you need to know what it's doing, ask the owner rather than opening it. |
| `AI_Life_reflect/` (sibling directory, same parent) | A separate, older clone of this project from the abandoned pre-reset effort, ~63 registered git worktrees | **Never `cd` into it. Never run `git worktree prune`, `git clean`, `git reset`, or `rm -rf` anywhere inside it.** Confirmed still present as of this session. Not your concern; damaging it is not recoverable. |
| `AI_Life_reflect-phase2-v17-v35`, `AI_Life_reflect-worktrees` (same parent) | Two more siblings from the same lineage, noted by a prior session, not entered | Treat with the same caution as `AI_Life_reflect/` until told otherwise. |
| The shared Hetzner host (`ssh brain`, `204.168.155.44`) | **Not a directory in this tree at all** — a live production server two other real products (`brain.service` "AI Brain", `hackathon-review.service`) already run on. See §1.3. | Read-only reconnaissance is fine (M0.1's #316). Anything that generates load, deploys a temporary service, or edits a config file needs the owner's go-ahead first — see §9.1. |

### 1.2 Danger zones

Every tool call this session executed without a visible permission prompt returning control — consistent with an auto-approve mode being active, though this could not be confirmed from inside the session. **Do not assume a permission prompt will stop a destructive command.** The guardrail is your own discipline against the table above and against §2.3's git rules, not the harness.

The Hetzner host deserves the same caution as `AI_Life_reflect/`, for a different reason: it isn't abandoned, it's live and shared. A command that's harmless on a disposable dev box (killing a process to free memory, restarting a service to test something, deleting a file to see what breaks) could take down AI Brain or the hackathon-review service for the owner or whoever else uses them. M0.1's tickets are written with this in mind (read-only first, temporary and fully cleaned-up experiments second) — don't improvise beyond what they describe.

### 1.3 Files/resources that live outside the working tree

- **SSH access to the shared host:** alias `brain` in `~/.ssh/config` on the development machine (`HostName 204.168.155.44`, `User brain`, `IdentityFile ~/.ssh/hetzner_new`). Passwordless `sudo ALL:ALL` for that user — effectively root. Do not paste the private key path's contents anywhere; the alias name is fine to reference, the key material is not.
- **`.mcp.json`** (repo root, untracked) — a local `chrome-devtools-mcp` MCP server config with `--isolated`, created during an earlier, unrelated part of this session (a browser-control capability check). Not part of any deliverable. Leave it alone.
- **`.playwright/`** (repo root, untracked, currently empty) — appeared during this session, cause not identified (most likely some tool/MCP server initializing a cache directory). Empty and inert as of this writing; mentioned for completeness, not a concern.

---

## 2. What the git tree should be

### 2.1 Current state, verified 2026-08-21 18:29 IST

```
$ git branch --show-current
plan/post-m6

$ git status --short
 M CLAUDE.md
 M HANDOVER-PHASE-1.5.md
 M README.md
?? .mcp.json
?? UI-DESIGN-INSTRUCTIONS.md

$ git log --oneline -8
c0e938a post-M6 plan: cross-reference M0.1 (milestone 69) from §7.8's coexistence risk
5054002 post-M6 plan: correct false claim that M6 is closed — none of M1-M6 is implemented
1732a17 post-M6 plan: fix §2.1 — VoiceNotes reconciliation (M9) doesn't wait on M10's scheduler ADR
78b0b11 post-M6 plan: add §7.8 shared-host coexistence risk; resolve 5 of 6 owner decisions in §8
fbeb86e post-M6 plan: self-check pass — cite the five LID-OPS-* IDs missed in §5's first draft
3604cb3 post-M6 plan: add §8 open decisions and §9 vocabulary — plan document complete
bba5344 post-M6 plan: add §7 real risks
a2e8385 post-M6 plan: add §6 what this plan still does not build (LID-DEF-*)

$ git log origin/main --oneline -3
f5d3301 Merge post-M6 plan (M7-M19) into main
c0e938a post-M6 plan: cross-reference M0.1 (milestone 69) from §7.8's coexistence risk
5054002 post-M6 plan: correct false claim that M6 is closed — none of M1-M6 is implemented

$ git worktree list
.../Life-in-Days          c0e938a [plan/post-m6]
.../Life-in-Days-archive  fb59c1f [archive/generation-0]
.../Life-in-Days-design   01f66f1 [design/m1-m6-prototypes]

$ git remote -v
origin  https://github.com/arunpr614/Life-Reflection.git (fetch)
origin  https://github.com/arunpr614/Life-Reflection.git (push)

$ git config --local user.name && git config --local user.email
Arun Prakash N
arunpr614@users.noreply.github.com

$ git log -1 --format='%an <%ae>'
Arun Prakash N <arunpr614@users.noreply.github.com>
```

**`plan/post-m6` was merged into `main` this session** (PR #315, merge commit `f5d3301`, merged 2026-08-21T12:14:06Z, merge method `--merge` — full commit history preserved, not squashed). The branch still exists on `origin` (not auto-deleted) and locally, sitting one merge behind `main`'s current tip. `main` now contains the complete post-M6 plan document, both handover docs, the M1–M6 plan, and the git-identity-rule commit — everything that was on `plan/implementation` plus this session's work.

**A separate branch, `codex/prototype-completeness-v17-v35`, received a new commit during this session** (observed via `git fetch --prune`: `da745d5..f87dd0c`). Not investigated — it's part of the abandoned pre-reset `codex/*` lineage per `CLAUDE.md`'s own framing, and not something this task touches. Mentioned only so you don't mistake unrelated fetch output for something you did.

### 2.2 Uncommitted work

The five items in `git status` above are **not new** — they were already present at the start of this session and remain exactly as they were:

- `M CLAUDE.md`, `M HANDOVER-PHASE-1.5.md`, `M README.md`, `?? UI-DESIGN-INSTRUCTIONS.md` — the owner's own edits, made with a different AI agent, confirmed by the owner as his. **Do not commit, revert, stage, or "clean up" any of these.**
- `?? .mcp.json` — mine, from an unrelated earlier part of this session (§1.3). Not part of any deliverable either way.

**Nothing from this session's actual work is uncommitted.** Every plan-document edit was committed immediately (12 commits, `0bf14aa` through `c0e938a`), and every milestone/issue lives on GitHub's servers, not in the working tree — there is no local-only deliverable state to lose here.

### 2.3 Git rules

Unchanged, still binding, from `CLAUDE.md` and the original controlling brief:

- **Always `GH_HOST=github.com` on every `gh` invocation.** The machine is also logged into `github.toasttab.com` (`daydreamer614`); `gh` prefers the corporate host if you omit this.
- **Commit identity is pinned locally** to `Arun Prakash N <arunpr614@users.noreply.github.com>`. Verified correct throughout this session (§2.1).
- **Never force-push `main`.** Branch protection blocks it. `main` now has everything through M7–M19's plan; work on a new branch for anything further.
- **Never `git add -A`, `git add .`, or `git commit -a`.** Name paths explicitly — the owner's files sit in the same tree.
- **Do not rebase or squash** any branch that recorded a decision — `plan/post-m6`'s 17 preserved commits are the point of writing it incrementally; a future PR should do the same.

---

## 3. Every resource file, and what each is for

### 3.1 Read fully before starting

| File | Lines (verified 2026-08-21) | Why |
|---|---|---|
| `docs/IMPLEMENTATION-PLAN-POST-M6.md` | 659 | **The plan for M7–M19 and the M0.1 finding — read this in full.** Schema (§3), privacy architecture (§4), one paragraph per milestone (§5), real risks including the shared-host finding (§7.8), and the (now mostly resolved) open questions (§8). |
| `docs/IMPLEMENTATION-PLAN.md` | 315 | The M1–M6 plan. Nothing has been built against it yet (§6.4) — it's still the authoritative spec for what M1–M6's 36 already-filed issues should produce. |
| `reference/CONTEXT.md` | ~180 | Domain glossary and copy specification, binding in every ticket and (once code starts) every UI string. |
| `reference/PRINCIPLES.md` | ~25 | Short. "Real photos and photo-derived data must never be sent to AI providers" — the one line that shapes M10/M11 most. |
| `CLAUDE.md` | 38 | Project rules, quoted in full in §4 below. |
| `UI-DESIGN-INSTRUCTIONS.md` | 195 (uncommitted, owner's own file — read it, don't edit it) | Binding once any UI work starts (M1 onward). |

### 3.2 Navigate, do not read cover to cover

**`reference/PRODUCT-REQUIREMENTS.md`** (~381 lines) — the requirement table, `LID-*` IDs. Section line numbers verified this session (grep the file fresh if line numbers may have drifted — they haven't moved since the last two sessions checked them, but don't assume). Two standing warnings, unchanged: its header's "R1–R10 frozen" language is stale pre-reset governance framing that `CLAUDE.md` overrides; and "SQLCipher" appears nowhere in it — encryption's library choice is still genuinely undecided, deferred to M13's ADR (issue #273).

**`reference/UX-SPECIFICATION.md`** (~1335 lines) — UX IDs, flows, wireframe annotations. §28.1's palette is **superseded** by the v10-prototype decision (existing plan §8.1, `docs/IMPLEMENTATION-PLAN.md` line ~264) — say so in any ticket touching navigation or color.

**`reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md`** (~418 lines) — over-scoped reference research, not a decision; assumes Docker Compose, SQLCipher, and a three-service topology as though settled. Treat every fact in it as one option. **Now partially superseded by this session's live host findings** (§3.5 below, §7.8 of the plan doc) — the spike's topology assumptions were never verified against the actual host until this session, and the actual host runs no Docker, has zero swap, and already hosts two unrelated products the spike never anticipated.

### 3.3 Read on demand

`RESET-DECISION.md` (repo root, ~29 lines) — the one-paragraph origin statement. Not required unless the "what does v0.1 done mean" framing feels unmotivated.

### 3.4 Reference material / prior art

`reference/prototype-v10/` — the decided visual tokens: accent `#255949`, focus ring `#0a7762`, `--rail-width: 238px`, persistent rail. Mine token values only; do not import its ~8,000 lines of CSS/JS (existing plan §8.7 already made that call).

### 3.5 Work produced this session

- **`docs/IMPLEMENTATION-PLAN-POST-M6.md`** — finished, 659 lines, committed across 12 commits (`0bf14aa`..`c0e938a`), merged into `main`. Covers §0–§9 in full: schema additions (§3, 15 subsections of SQL, additive to existing plan §5.1), the AI privacy architecture (§4), one paragraph per milestone M7–M19 (§5), what's still not built (§6, `LID-DEF-*`), eight named real risks including the shared-host finding (§7, especially §7.8), the six original open questions — five now resolved, one new one added (§8), and vocabulary (§9).
- **13 milestones, 95 issues (#220–#314)** for M7–M19 — table in §11.1 below.
- **1 milestone, 9 issues (#316–#324)** for M0.1 — the shared-host/hosting-cost spike, described in full in §6.2 and §8 below.
- **PR #315**, merged into `main` (§2.1).
- **Two issue corrections**: #277 (memory ceiling — replaced a guessed number with a measured `MemoryHigh`/`MemoryMax` pair) and #322 (hosting survey — added the real $10/month Hetzner cost the owner supplied).

---

## 4. Standing rules that must not be broken

Quoted verbatim from `CLAUDE.md` (read fresh this session, unchanged):

> **GitHub identity:** Always use the `arunpr614` account (`github.com`) for this repository. Never use the `daydreamer614` / toasttab.com (`github.toasttab.com`) account for any GitHub operation in this project... This covers the commit author identity, not just the API account.

> **Never force-push `main`.** Branch protection blocks force-push and deletion on `main`. Feature branches you own are yours to amend and force-push (prefer `--force-with-lease`).

> **No meta-tooling.** Do not build validators, registries, ledgers, councils, dossiers, readiness states, or any code whose purpose is to govern this project. If a change doesn't move pixels or data for the single user, don't make it. This project's history... is a cautionary example of what happens when this rule is ignored: 137 commits and ~5,800 lines of coordination code, zero rendered journal entries.

> **Every session ends with something visible.** Every commit must leave the app runnable. Every working session should end with something visible in the browser — a real change you can point at, not a plan for one.

> **UI and design work.** Before writing any markup, CSS, or prototype, read `UI-DESIGN-INSTRUCTIONS.md`. It is binding. The short version: never ship a UI change you haven't rendered, screenshotted, and compared against intent with the differences written out.

> **Privacy boundary.** Never commit real journals, photos, identifiers, credentials, provider responses, or private URLs. Real data lives under `data/`, which is gitignored.

**A tension worth naming plainly:** the no-meta-tooling rule is the reason M0.1 (a spike-and-decision-only milestone with nothing user-visible at the end) is a genuine departure from how M1–M19 were designed — every one of *those* milestones deliberately ends with something the owner can see or do. M0.1 doesn't, and can't; it's answering "is it safe and affordable to build on this host at all" before anything gets built. The owner asked for it explicitly this session, with clear reasoning (cost-effectiveness, not breaking two other live products) — it isn't governance-about-the-project in the sense `CLAUDE.md` warns against, but it is the one milestone in the whole plan that doesn't move pixels or data. Don't use it as precedent for adding a second "decisions" milestone later.

---

## 5. How you are required to work

**Ticket structure** (from the original controlling brief, still binding for any new ticket you file): exactly six sections, in this order, no more, no fewer — `## Outcome`, `## Scope`, `## Technical notes`, `## Acceptance criteria`, `## References`, `## Depends on`. Match the register of any M7–M19 ticket filed this session (e.g. issue #234 or #319) — plain-language outcome first, concrete file/route/table names in Scope, judgment calls in Technical notes.

**UI verification loop** (`UI-DESIGN-INSTRUCTIONS.md` §9, once any UI ticket is worked): rendered in a real browser, screenshotted, differences from intent listed in text, checked at 375/768/1440px, keyboard-tabbed with visible focus, no console errors. Every M7–M19 ticket that renders UI already carries the line `- [ ] UI verification loop per UI-DESIGN-INSTRUCTIONS.md §9 completed and differences recorded on this issue` in its acceptance criteria — honor it when the ticket is actually worked, don't treat the line as decorative.

**Chrome DevTools MCP** is installed and working (`chrome-devtools-mcp@claude-plugins-official`) — a project-level `.mcp.json` (§1.3) gives this repo its own isolated browser profile so it doesn't collide with other concurrent Claude Code sessions on this machine. Takes effect on session restart, not mid-conversation.

---

## 6. What has been done — the session record

### 6.1 Where the session got to, and why it went that way

This was a long session picking up from `docs/HANDOVER-POST-M6-PLANNING-2026-08-21-1458.md`, which had stopped with the plan document at §2.4 of 9 planned sections. The session: (1) finished §3–§9 of the plan document in nine incremental commits, self-checking against the controlling brief's own review criteria after; (2) ran a live SSH spike against the Hetzner host that surfaced the shared-tenant finding in §7.8 — not originally scoped, but directly load-bearing for M6/M13/M14's tickets, so it went into the plan rather than staying a side note; (3) walked through the six open questions with the owner, resolving five and surfacing a sixth; (4) filed all 13 milestones and 95 issues for M7–M19, pausing once (after M7) for the owner to spot-check the register before continuing through M19; (5) the owner asked follow-up questions about the memory-ceiling proposal and M6's status, which surfaced **two real errors in the plan document itself** (§6.4) — both corrected in-place and re-pushed; (6) the owner asked for a new, higher-priority M0.1 milestone covering the shared-host and hosting-cost questions properly, which got the same nine-issue, dependency-chained treatment as any other milestone; (7) the owner asked to merge the PR, which happened cleanly; (8) this handover.

### 6.2 Each artifact built

**`docs/IMPLEMENTATION-PLAN-POST-M6.md`** (659 lines) — see §3.5 above for the section map. Two pieces of its content are load-bearing enough to inline here rather than only reference:

The **schema additions** (§3) are additive to existing plan §5.1's four tables (`journal_day`, `source_item`, `source_revision`, `media_asset`) and introduce, across 15 subsections: a widened `source_item.kind` CHECK (voice journals), `telegram_origin`/`voicenotes_origin` (capture provenance), `derived_field`/`derived_field_version` (current value vs. full generation history, kept apart deliberately), `visual_brief`, `artwork_asset`/`artwork_version` (deliberately **not** `media_asset` — derived content stays structurally separate from captured content), `source_suppression`/`artwork_suppression` (two tables, not one — different retention rules), `source_conflict` (ephemeral, deleted on resolution), a `job` table sketch (not authorized, priced for an ADR only), `provider_config`/`provider_selection`, `ai_usage_ledger`, `health_event`, `storage_migration_state`, `export_request`, and an illustrative FTS5 `search_index`.

The **privacy architecture** (§4) enumerates exactly two payload shapes that ever leave the server for an AI provider (a text-generation request, an artwork-generation request) and an explicit "never crosses it" list (real photo bytes/EXIF, Photo Captions, the private accessibility description, every integration's opaque IDs, internal IDs, credentials, and — critically — a real Daily Photo as artwork input under any circumstance). Enforcement is three-layered: type signatures first, an allowlisted serializer second, a contract test third.

**95 issues, M7–M19** (milestones 56–68, issues #220–#314) — one paragraph each in the plan doc's §5, full six-section tickets on GitHub. Counts: M7=8, M8=10, M9=8, M10=10, M11=11, M12=6, M13=6, M14=7, M15=7, M16=4, M17=7, M18=7, M19=4.

**9 issues, M0.1** (milestone 69, issues #316–#324) — described in full in §8 below; this is the milestone you're most likely to actually execute next.

### 6.3 Each significant finding or decision, with rejected alternatives

**(a) M9's VoiceNotes reconciliation vs. M10's scheduler ADR.** While writing M9's tickets, noticed the plan's own §2.1 named M10/M11/M15/M17 as depending on the scheduler ADR but never mentioned M9 — yet M9 ships *before* M10 exists.
  (i) Have M9's reconciliation ticket forward-reference an ADR that doesn't exist yet — rejected, ties a real ticket to an issue number that can't be known until M10 is filed.
  (ii) Give M9 its own bespoke scheduling mechanism, decided independently — rejected, duplicates the ADR's job.
  (iii) Note that `LID-VN-005` already requires reconciliation to be idempotent and replay-safe, which is exactly what makes a bare `cron`-triggered command safe **regardless** of what the ADR later decides for other consumers. **Chosen.** Fixed in the plan doc (§2.1) and reflected in issue #243.

**(b) The memory-ceiling number for M13's staging ticket.**
  (i) A flat `MemoryMax` sized as a fraction of total RAM (the original proposal, `896M`, roughly ¼ of 3.7GB) — rejected on two grounds: it was a guess, not a measurement, and a flat `MemoryMax` is a hard kill on any burst, not graceful degradation.
  (ii) `MemoryLow`/`MemoryMin` reservations on the *existing* two services (`brain.service`, `hackathon-review.service`) to structurally protect them — rejected for now: editing another product's live systemd units from a Life in Days ticket is cross-product scope and higher blast radius; left as an option for whoever maintains those services, not decided here.
  (iii) A `MemoryHigh` (soft throttle) + `MemoryMax` (hard backstop) pair on Life in Days' own unit only, sized from real measured host numbers (2 vCPUs; `brain.service` 239–240MB RSS; `hackathon-review.service` 21MB RSS; ~3.3GB genuinely free; neither existing service has any cgroup limit today). **Chosen**, as a starting default pending real validation — which is exactly what M0.1 now exists to do empirically rather than by further guessing. Issue #277 updated; full reasoning also in the plan doc §7.8.

**(c) Creating M0.1 as a new milestone, numbered ahead of M1.** The owner asked for this directly. Alternative considered: fold the two spikes into existing tickets (#277 for the memory question, a new subsection of §7.8 for hosting cost) rather than a whole milestone — rejected because the owner explicitly asked for milestone-level tracking ("the very first thing we need to work on") and because the hosting-alternatives question is large enough (four+ candidate platforms, an architecture-compatibility check) to need its own ticket chain, not a bullet point. **Chosen:** a full milestone, numbered `M0.1` specifically so it doesn't collide with the already-existing `M1` milestone (50) or its numbering, with a near-term due date (2026-08-27) as the closest GitHub-native signal of priority available (milestones have no separate priority field).

**(d) Merging PR #315 with `--merge`, not `--squash`.** Rejected squash: the whole point of writing the plan document in 17 separate, individually-reviewable commits was to preserve that trail — squashing would throw it away at the exact moment it becomes part of `main`'s permanent history. **Chosen:** `--merge`, full history preserved (merge commit `f5d3301`).

### 6.4 Cases where I was wrong, and the generalized lesson

**This is the section a successor should read most carefully.** Two real errors, both self-corrected within this session, both instructive:

**(i) "M6 is closed in GitHub."** Written into an earlier draft of the plan doc's §7.8, stated as fact, without checking. It was false — `gh issue list --milestone ... --state all` shows all 36 M1–M6 issues open, zero closed, and (the bigger finding underneath it) no application code exists on any branch of this repository at all. Both prior handover documents actually had this right (they listed "open counts," not closed counts) — I introduced this specific error myself, later, by writing a claim into the risk section without re-checking it against information already sitting in the conversation. **Lesson: a claim about tracker state is not safe to write down from inference or memory, even mid-session, even about something you think you already established — re-run the check at the point you're about to assert it as fact, especially in a document meant to outlive the conversation.** Corrected in commit `5054002`.

**(ii) The `MemoryMax=896M` guess.** Proposed before pulling any real host numbers — a plausible-sounding fraction of total RAM, not a measurement. Once actual SSH access was used to pull `brain.service`'s and `hackathon-review.service`'s real RSS, vCPU count, and existing (absent) cgroup configuration, the number was revised to a measured `MemoryHigh`/`MemoryMax` pair. **Lesson: when you have live access to the actual system a number describes, use it before proposing the number, not after being asked to justify it.** This is also the direct origin of M0.1 — the owner's follow-up question turned a guessed constant in one ticket into its own two-spike milestone.

Neither error was caught by any tool or test — both were caught by the owner asking a direct question. There is no automated check in this repo that would have caught either; that's worth knowing before trusting any other unverified-sounding claim in the plan document that hasn't been specifically re-checked.

### 6.5 Discrepancies between documentation and reality

- **M1–M6 is unimplemented**, not just undeployed (§6.4(i)). Every M7–M19 ticket that cites an M1–M6 table, route, or ticket number (e.g. `existing plan §5.1`, `#185`, `#196`, `#210`) is citing something that exists as a *specification*, not as running code. This doesn't make those citations wrong — it's exactly what M1–M6's own 36 tickets are supposed to build — but a successor should not read "extends #210's transaction" as "extends a function that exists," only as "extends a function #210 specifies."
- **The Hetzner host has two other resident products, not one, and hosts nothing of Life in Days' yet** — `brain.service` (AI Brain) and `hackathon-review.service` (a Toast Hackathon Project Review), sharing one Cloudflare Tunnel with one ingress list. Neither prior handover document mentioned the hackathon service; it was found only by walking `systemctl list-units` directly, not by reading any document. `docs/IMPLEMENTATION-PLAN-POST-M6.md` §7.8 has the full finding.
- **The real Hetzner cost is $10/month, owner-confirmed** — every prior document described reuse as "zero incremental cost" without ever stating the absolute number. Both figures now matter and are recorded in issue #322.

---

## 7. What is verified, and what is not

### 7.1 Verified — with evidence, 2026-08-21

| Claim | Evidence |
|---|---|
| `plan/post-m6` merged into `main` | `gh pr view 315 --json state,mergedAt,mergeCommit` → `MERGED`, `f5d3301`, `2026-08-21T12:14:06Z` |
| Plan doc is 659 lines, complete §0–§9 | `wc -l docs/IMPLEMENTATION-PLAN-POST-M6.md`; `grep -n '^## '` shows all nine sections present |
| 140 total `phase1.5` issues (36 existing + 95 M7–M19 + 9 M0.1) | `gh issue list --label phase1.5 --state all --limit 300 --json number -q 'length'` → `140` |
| All 20 milestones (50–69) exist with correct titles and tallies | `gh api .../milestones --paginate` (must paginate — the default single-page call misses milestones beyond the first page; caught this exact gotcha earlier in the session) |
| Zero M1–M6 issues closed | `gh issue list --milestone "...M1..." --state all --json state` and equivalent for M2–M6, all show `open`, `closedAt: null` |
| No application code exists on any branch | `git ls-tree -r main/plan/implementation/plan/post-m6 --name-only` — no `src/`, no `package.json`, on any of the three |
| Every M7–M19 and M0.1 issue is on project 1 with `Status = Backlog` | Per-issue GraphQL `projectItems` check across #220–#324, zero missing |
| Host: 2 vCPUs, `brain.service` ≈239–240MB RSS, `hackathon-review.service` ≈21MB RSS, zero swap, 22GB/38GB disk free | Re-verified live via SSH at 18:31 IST — see §6.2/§7.8 of the plan doc for the first measurement, this handover's Phase 1 for the re-check |
| SSH access to the host still works | `ssh brain 'echo ok; hostname'` → `ok`, `ubuntu-4gb-hel1-1` |
| Real Hetzner cost: $10/month | Owner's direct statement this session, recorded in issue #322 |
| Neither `brain.service` nor `hackathon-review.service` has any cgroup limit set | `systemctl show <unit> -p MemoryMax -p MemoryHigh -p MemoryLow -p MemoryMin -p CPUWeight` → all unset/infinity on both |

### 7.2 Not yet done

- **None of M0.1's actual spike work has been executed.** Every one of #316–#324 is a written ticket, not a completed investigation — no load test has been run, no synthetic harness built, no cgroup limits actually applied and tested, no hosting alternative actually priced beyond the Hetzner baseline itself.
- **None of M1–M6's implementation exists.** All 36 tickets remain to be built from scratch.
- **The `MemoryHigh=512M`/`MemoryMax=1G` pair in issue #277 is still an unvalidated starting default** — M0.1's #319/#321 exist specifically to validate or revise it. Do not treat it as settled.
- **The `Life-in-Days-design` worktree's recent activity was not investigated** — noted in §1.1/§2.1, not understood, not this task's concern unless the owner says otherwise.
- **The swap-add-or-not question (issue #320) has not been answered** — it's a spike ticket, not yet worked.

### 7.3 Constraints discovered along the way

- `gh api repos/.../milestones` **requires `--paginate`** — without it, the call silently returns only the first page and can make it look like a milestone doesn't exist when it does. This caused one false "milestone missing" moment this session before the flag was added.
- **Issues and PRs share one numbering sequence** in this repo. Before predicting sequential issue numbers for a batch of tickets, check the highest number across *both* — `gh api repos/.../issues -f state=all -f per_page=1 -f sort=created -f direction=desc -q '.[0].number'` returns the true highest regardless of type. Missing this once would have produced wrong "Depends on" references across an entire milestone's tickets.
- A `sed 's/pattern/repl/g'` with a pattern that can match an empty string (e.g. `[^ ]*`) inserts spurious extra matches at boundaries — caused a confusing but ultimately harmless false alarm mid-session (issue numbers looked shifted in a diagnostic echo; the actual `gh issue create` calls had all succeeded correctly). When a loop's own print statements look wrong, verify against the real GitHub state before assuming the underlying operation failed — in this case it hadn't.
- SQLite (relevant once M1 starts): dropping and recreating a table with `PRAGMA foreign_keys = ON` while other tables hold `REFERENCES` into it needs the documented disable-rebuild-recheck procedure, not a naive four-statement rebuild — see `docs/IMPLEMENTATION-PLAN-POST-M6.md` §3.1/§7.7 for the specific case (widening `source_item.kind` in M9).

---

## 8. What to continue, in order

### Step 1 — Read before doing anything

Read this document fully, then `docs/IMPLEMENTATION-PLAN-POST-M6.md` fully (659 lines), then re-run at least the git and milestone-tally commands in §2.1/§7.1 to confirm nothing has drifted since this was written.

### Step 2 — M0.1, ticket #316 (safe to start now)

Full host inventory audit — read-only, no risk. See the issue body for the complete scope (all systemd units including stopped ones, cron/timers, TCP+UDP ports, every `cloudflared` config file, Docker's real absence, swap/cgroup/kernel versions). This is reconnaissance the rest of the milestone depends on.

### Step 3 — M0.1, tickets #317 through #320 — **STOP before starting any of these without the owner's explicit go-ahead**

- **#317** generates real load against `brain.service` and `hackathon-review.service` to measure peak (not idle) resource usage.
- **#318** builds a synthetic Life-in-Days-shaped load harness (safe on its own — it's standalone code, not yet deployed to the shared host).
- **#319** deploys that harness *to the shared host* under candidate cgroup limits and stress-tests it while polling the other two services live. This is the highest-risk ticket in the milestone — it is designed to be safe and fully reversible, but it is still active experimentation on a production box two other real products depend on.
- **#320** investigates the host's zero-swap configuration; read-only/analysis, low risk, but depends on #316.

Even though every one of these is written to be careful and reversible, **ask the owner before running #317 onward** — this is exactly the class of action (generating load against, or deploying something to, shared infrastructure) that warrants a check-in even when the ticket itself says it's safe.

### Step 4 — M0.1, decision tickets #321 and #324 — the gate

#321 (resource-ceiling decision) and #324 (final hosting decision) are where investigation becomes something the owner can approve. **Do not start any M1 implementation ticket, and do not implement issue #277's memory ceiling for real, before #321 closes.** Do not make any hosting-migration move before #324 closes.

### Step 5 — Only after M0.1 clears (or the owner explicitly waives it): begin M1

M1 (`#184` onward, milestone 50) is the first ticket that is actually supposed to produce running code — `CLAUDE.md`'s "no product code" instruction earlier in this project's life was specific to the *definition-only* brief that produced M7–M19's tickets, which is now finished. Building the app is exactly what M1 onward is for. **Do not get a head start on any M7–M19 ticket before the M1–M6 code and tables it depends on actually exist** — every M7–M19 ticket cites M1–M6 tables/routes/tickets as its foundation, and none of that foundation is real yet (§6.5).

---

## 9. How to behave with the user

### 9.1 The stop rule

Confirm before: running load against the shared Hetzner host (#317 onward), deploying or modifying anything on that host, touching `AI_Life_reflect/` or its siblings in any way, entering the `Life-in-Days-design` worktree's current work, or merging/force-pushing anything into `main`. The owner has been actively directing this work turn by turn (spot-checking a milestone, answering open questions, approving the merge) — match that cadence rather than batching several risky steps into one unreviewed pass.

### 9.2 How to hand work over for review

Cite exact issue/commit/PR numbers, not "the tickets" or "the plan." Run the verification commands in §12 and quote their actual output — the owner has already caught two unverified claims this session (§6.4); a third would cost more trust than the first two combined.

### 9.3 On the issue tracker

- Six-section structure, no more, no fewer (§5).
- **Known trap:** `gh issue create --milestone` takes the full title string, not the milestone number.
- **Known trap:** milestone listing needs `--paginate` (§7.3).
- **Known trap:** issue numbers share a sequence with PR numbers — check the true highest before predicting a batch's numbers.
- Never touch `phase1`/`phase2` issues or milestones (14, 31–49), never apply `phase1`, `phase2`, `version:v*` (35 exist), or `roadmap` labels.
- Exemplar tickets to imitate: #234 (Telegram durable-capture, a good example of a mid-complexity implementation ticket) or #319 (the cgroup experiment, a good example of a spike ticket with concrete falsifiable acceptance criteria).

### 9.4 The open defect list, as it stands

1. M1–M6: zero implementation exists (36 tickets, all open, milestone 50–55).
2. M0.1: written but not executed — all 9 tickets (#316–#324) are still just tickets.
3. Issue #277's `MemoryHigh=512M`/`MemoryMax=1G` is an unvalidated starting default pending #319/#321.
4. Issue #322's hosting-alternatives survey has the Hetzner baseline ($10/mo, $0/mo incremental) but zero alternative candidates priced yet.
5. The `Life-in-Days-design` worktree's current activity is unexplained (not investigated, not blocking).
6. `.playwright/` (empty, untracked, repo root) is unexplained (not investigated, not blocking).
7. Issue #320 (swap decision) is unanswered.

---

## 10. Open questions — surface, do not decide

From the plan doc's own §8, current status:

1. ~~Hetzner host access~~ — resolved, verified.
2. ~~Provider credentials (OpenAI/Google, for M10/M11's evaluation gates)~~ — **still not obtained** as of this session; still a real blocker on issues #246/#256 specifically, not resolved by anything in this session.
3. ~~$15 evaluation ceiling split~~ — resolved, even $7.50/$7.50.
4. ~~VoiceNotes test account~~ — resolved, ready.
5. ~~Encryption-after-capture ordering~~ — resolved, keep current milestone order.
6. ~~B2/R2 accounts~~ — resolved, already created.
7. **Shared-host resource ceiling** — in progress via M0.1; not the successor's to decide by picking a number, that's exactly what #319/#321 exist to determine empirically.

**New, from this session, not yet answered by anyone:**

8. **Swap or no swap on the shared host** (#320) — add encrypted swap for a softer OOM landing zone, or leave it absent. Needs the spike's own findings first, then the owner's call.
9. **Stay on shared Hetzner or move** (#324) — genuinely open until #322/#323's survey and compatibility check produce real numbers to compare against the $10/$0 baseline.

---

## 11. Metadata that must be set

### 11.1 Coordinates

| Thing | Value |
|---|---|
| Repo | `arunpr614/Life-Reflection` (private) |
| Project | user project number **1**, "Life Reflection", node ID `PVT_kwHOD9kkX84BgUtf` — a **user** project (`user(login:)` in GraphQL, not `organization`) |
| The view the owner reviews | "Phase 1.5 Status", view number 8, ID `PVTV_lAHOD9kkX84BgUtfzgLX5vA`, board layout, filter `label:phase1.5` |
| All 20 milestones | 50–69, table below |

| # | Title | Open issues |
|---|---|---|
| 50–55 | M1–M6 (existing, unimplemented) | 7,5,8,5,6,5 |
| 56 | M7 — Find any day, browse like a book | 8 |
| 57 | M8 — Telegram capture | 10 |
| 58 | M9 — VoiceNotes capture | 8 |
| 59 | M10 — AI text derivation | 10 |
| 60 | M11 — Generated Artwork | 11 |
| 61 | M12 — Corrections & conflicts | 6 |
| 62 | M13 — Encryption at rest | 6 |
| 63 | M14 — Storage & R2 migration | 7 |
| 64 | M15 — Backup & Recovery Ceremony | 7 |
| 65 | M16 — Export | 4 |
| 66 | M17 — System Health | 7 |
| 67 | M18 — Accessibility | 7 |
| 68 | M19 — Release acceptance | 4 |
| **69** | **M0.1 — Shared-host & hosting-cost spike (due 2026-08-27)** | **9** |

### 11.2 Labels / taxonomy — exactly four per issue, plus one conditional

| Slot | Values | Rule |
|---|---|---|
| Phase | `phase1.5` | always, every issue |
| Type | `type:feature` · `type:chore` · `type:architecture` · `type:evaluation` · `type:spike` · `type:quality` · `type:product-definition` · `type:release-acceptance` | exactly one |
| Priority | `priority:high` · `priority:medium` · `priority:low` | exactly one — the only place priority lives, there is no project field for it |
| Status | `status:backlog` | exactly one |
| Accessibility (conditional) | bare `accessibility` | alongside `type:quality`, M18 tickets only |

**Never apply:** `phase1`, `phase2`, any `version:v*` (35 exist, `v01`–`v35`), `roadmap`. Also present but unused by this plan, legacy from GitHub defaults or earlier phases — don't reach for these either: `bug`, `documentation`, `duplicate`, `enhancement`, `good first issue`, `help wanted`, `invalid`, `mvp`, `question`, `status:done`/`status:in-progress`/`status:next` (only `status:backlog` is used by this plan today), `ui-prototype`, `wontfix`.

### 11.3 Fields

| Field | ID | Options |
|---|---|---|
| `Status` | `PVTSSF_lAHOD9kkX84BgUtfzhahTpA` | Backlog=`f75ad846`, Next=`b753d38d`, In progress=`47fc9ee4`, Done=`98236657` |
| `Team` | `PVTSSF_lAHOD9kkX84BgUtfzhahT1c` | Squad 1/2/3 — leave unset |
| `Iteration`/`Quarter` | `PVTIF_lAHOD9kkX84BgUtfzhahT1g` / `...T1k` | leave unset |

**There is no `Priority` project field.** Confirmed absent again this session via a fresh field-list query. Do not call `updateProjectV2ItemFieldValue` against any Priority field ID from an older document — it will fail.

### 11.4 Metadata inside generated files

```markdown
## Outcome
## Scope
## Technical notes
## Acceptance criteria
## References
## Depends on
```

Milestone titles: `Phase 1.5 — M<n> — <short outcome in plain words>`, em dash with spaces, outcome from the owner's point of view.

### 11.5 Vocabulary constraints

`reference/CONTEXT.md`'s ~25 terms and `_Avoid_` alias lists are binding in every ticket title, label, and (once code exists) UI string.

---

## 12. Definition of done

For **M0.1** specifically:

- [ ] #316's host inventory is written and complete
- [ ] #317's real peak-load numbers for both existing services are recorded
- [ ] #318's synthetic harness exists and is tunable
- [ ] #319's cgroup experiment ran at least 3 candidate configurations and proved (or disproved) that the other two services never degrade
- [ ] #320's swap question has a stated recommendation
- [ ] #321 updates issue #277 with validated numbers
- [ ] #322 has at least 4 real, priced alternatives
- [ ] #323 has an explicit compatibility verdict for every non-VPS candidate
- [ ] #324 states a clear stay-or-move recommendation with real cost numbers
- [ ] The owner has reviewed and approved #321 and #324

Verification commands, tested this session:

```sh
# Confirm current milestone/issue state hasn't drifted from §7.1 above
GH_HOST=github.com gh api repos/arunpr614/Life-Reflection/milestones --paginate \
  -q '.[] | select(.title | startswith("Phase 1.5")) | "\(.number)\t\(.title)\topen=\(.open_issues)"'

# Total phase1.5 issue count — should still read 140 until new work closes issues
GH_HOST=github.com gh issue list --label phase1.5 --state all --limit 300 --json number -q 'length'

# Confirm SSH access to the shared host still works before any M0.1 ticket needs it
ssh -o ConnectTimeout=10 -o BatchMode=yes brain 'echo ok; hostname'

# Confirm no application code has appeared unexpectedly (sanity check before assuming M1 started)
git ls-tree -r main --name-only | grep -E '^src/|package\.json' || echo "still no code, as expected"
```

---

## 13. Things about how to work here

- **Verify claims about tracker/host state at the point you're about to write them down, not from earlier in the same conversation.** Both real errors this session (§6.4) came from asserting something as fact without a fresh check, even though the check itself was cheap and available.
- **When you have live SSH access to the actual system a number describes, use it before proposing the number.** A plausible-sounding guess dressed as a default (the original `896M`) cost more total effort to correct than measuring would have cost to begin with.
- **This host is not disposable.** Every other project this agent might work on assumes a dev box it can break and rebuild. This one has two other real products' uptime riding on it. Treat every command as if someone else is watching it run, because functionally, they are.

---

## 14. Immediate first actions

1. Read this document fully.
2. Read `docs/IMPLEMENTATION-PLAN-POST-M6.md` fully (659 lines) — do not skip §7.8 or §8.
3. Run the four commands in §12 and confirm they match this document's claims. If they don't, stop and reconcile the difference before doing anything else — this document may be stale.
4. Ask the owner directly: start M0.1 now (beginning with the safe #316), or do something else first?
5. If starting M0.1: do #316, report findings, then **stop and ask before #317** — do not chain straight through to load-testing the shared host without that check-in, even though the milestone's own tickets are written to make that step safe.

