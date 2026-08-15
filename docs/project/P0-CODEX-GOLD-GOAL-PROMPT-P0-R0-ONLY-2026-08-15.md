# P0 Codex Gold Goal prompt — complete P0 and R0 only

- **Created:** 2026-08-15
- **Purpose:** copy-ready, hard-bounded Goal for a new Codex agent to finish manifest milestones P0 and R0 only
- **Starting point:** the public-safe P0 governance and readiness-control checkpoint is published; product implementation has not started
- **Important:** storing this file does not authorize P0/R0 implementation or a live/private action. The Product Owner activates the narrow **Activation Bootstrap** by submitting the prompt below while the existing Phase 1 worktree is selected. The worktree may contain the pending three-file Goal package named below. Codex must inspect and preserve all pre-existing changes, publish only the approved Goal package through a normal pull request, and re-establish a clean, non-detached checkout at exact merged `origin/main` before the P0/R0 execution Goal activates. If this file is already merged and the worktree is clean, skip the publication bootstrap and proceed directly to the clean exact-main gate.

Copy from the next heading through the end of this file into the new Goal.

---

# Goal: complete Life in Days milestones P0 and R0 only

## Mission

Continue the existing Life in Days Phase 1 Goal in the same worktree. Do not restart discovery, create another worktree, clone a replacement repository, or treat the published governance package as product completion. This Goal has two ordered phases: a documentation-only Activation Bootstrap that may inspect and publish the pending Goal package, followed by P0/R0 execution only after the clean exact-main gate passes.

Complete only the eight canonical roadmap items whose manifest milestone is exactly `P0` or `R0`:

| Milestone | In-scope task IDs |
| --- | --- |
| P0 | `AUD-001`, `PC-001` |
| R0 | `SPK-R0-001`, `PRD-R0-001`, `UX-R0-001`, `ARCH-R0-001`, `ENG-R0-001`, `REL-R0-001` |

For this Goal, **P0 means the manifest milestone `P0`**, not every product requirement whose priority is P0. R0 owns exactly 11 requirement IDs: `LID-SCP-001`, `LID-OPS-001`, `LID-OPS-002`, `LID-OPS-003`, `LID-OPS-004`, `LID-OPS-008`, `LID-OPS-011`, `LID-OPS-012`, `LID-OPS-014`, `LID-OPS-016`, and `LID-OPS-018`.

Finish the P0 planning/control baseline and the R0 synthetic-only private foundation completely. The successful terminal has all eight in-scope tasks honestly `Done`, all 11 R0 requirements backed by executed R0 evidence, and every living projection reconciled. Then mark this bounded Codex Goal **complete** and stop. Do not select the next roadmap item.

This terminal means **P0/R0 foundation complete**. It does not mean that Life in Days is feature-complete, ready for authentic memories, launched, or production-complete. R1 is the first memory-creating release and is outside this Goal.

Do not mark this Goal complete until the Definition of Done below is satisfied. If a non-delegable human action is the only remaining P0/R0 blocker, report **P0/R0 candidate ready; owner gate outstanding**, keep the Goal incomplete, provide one minimum-action checklist, and continue every other safe in-scope workstream before waiting.

## Hard scope boundary — R1 through R10 are prohibited

The 50 canonical tasks assigned to R1–R10 are outside this Goal. Do not start, prepare, approve, implement, test, deploy, close, reprioritize, reschedule, redocument, or change execution/readiness state for any of them. Specifically:

- do not implement manual journal capture, Telegram, VoiceNotes, calendar/almanac/search, corrections/history/trash/export, generated text, generated artwork, resilience launch work, authentic-memory admission, or object-store transition work;
- do not run R1–R10 spikes, evaluations, migrations, deployments, provider actions, UAT, observation, Recovery Ceremony, or owner-action requests;
- do not create issues, sub-issues, milestones, branches, PRs, dossiers, designs, ADRs, prototypes, code, tests, credentials, schedules, or evidence for R1–R10;
- do not move an R1–R10 issue or Project item between Backlog, Next, In progress, or Done, and do not open or close it;
- do not alter an R1–R10 task's milestone, dates, dependencies, priority, owner, description, requirement mapping, acceptance evidence, artifact/readiness/execution state, or status label; and
- do not infer permission from a dependency, a priority-P0 requirement, available credentials, spare time, an existing queued prototype package, or the completion of R0.

Snapshot all 50 out-of-scope task semantics only after the strict clean exact-main **P0/R0 execution activation gate** passes; the documentation-only Activation Bootstrap does not take or alter this snapshot. Generators may mechanically re-render whole-project projections only when required to publish an in-scope P0/R0 change, but the authored and user-visible values for every R1-R10 task—and the bytes and states of their task artifacts—must remain unchanged. Any proposed out-of-scope semantic delta is a hard failure. Unavoidable deterministic provenance churn may occur only in a shared aggregate projection or freeze-control record, never inside an R1-R10 task artifact, issue/Project value, approval, readiness state, evidence, or permission; independently prove and record the exact nonsemantic aggregate delta. Never refresh, edit, or approve an out-of-scope task dossier.

## Current verified checkpoint — refresh before relying on it

This is orientation, not an invariant. Re-read the live repository and GitHub surfaces at startup.

- Repository: `https://github.com/arunpr614/Life-Reflection`
- Private Project: `https://github.com/users/arunpr614/projects/1`
- Wiki: `https://github.com/arunpr614/Life-Reflection/wiki`
- Wiki Git remote: `https://github.com/arunpr614/Life-Reflection.wiki.git`
- Verified source `main` on 2026-08-15: `e8130729d005fe6fd8731860963ab5ffa5ed1682`
- Verified Wiki `master` on 2026-08-15: `1927a91529b6df7918a353876fdf9d64a0fbbe78`
- Canonical roadmap: 58 issue-backed tasks; this Goal owns eight P0/R0 tasks and freezes 50 R1–R10 tasks
- In-scope baseline: three Done (`AUD-001`, `PC-001`, `PRD-R0-001`), one In progress (`SPK-R0-001`), four Next (`UX-R0-001`, `ARCH-R0-001`, `ENG-R0-001`, `REL-R0-001`)
- Out-of-scope baseline: 50 R1–R10 tasks, currently 40 Backlog and ten historical planning Done; refresh this snapshot before relying on it
- R0 requirement boundary: 11 included and 67 excluded; excluded requirements remain traceable but receive no implementation or acceptance work under this Goal
- Readiness baseline: 58 Incomplete, zero Ready, zero `executionAllowed=true`
- Artifact baseline: 348 task-bound artifacts, six per task; 342 Draft and six PC-001 artifacts In review
- Owner-action baseline: 14 pending actions in `docs/council/execution/P0-OWNER-ACTION-STATE.json`
- Product runtime baseline: no production application implementation exists in this repository; static prototypes and readiness-control tools are not product implementation
- Deployment baseline: `Unknown — private read authority pending`

The published checkpoint includes PRs #66–#68, issue/Project reconciliation, the r14 workbook, and the 450-source Wiki projection. It does not authorize R0 implementation or prove private access, deployment, restore, rollback, or R0 acceptance.

## Known defects that must be repaired before R0 task execution

Treat these as the first bounded reconciliation work package. Repair them through a normal branch, review, PR, merge, final Wiki publication, and read-only verification.

1. `docs/INDEX.md` embeds the earlier Wiki commit `25f438...` and earlier Page Audit hash as current. Replace self-referential “current Wiki commit/hash” prose with a stable statement directing readers to the live Page Audit. Do not create an infinite source/Wiki hash loop.
2. `docs/council/UX-DESIGN-REVIEW.md` has two links to the removed fragment `docs/design/UX-SPECIFICATION.md#7-timeline-experience`. Add or select one stable canonical Almanac/chronological-browsing anchor and update both links.
3. The latest `RUNNING_LOG.md` entry still describes PR #68 merge, final Wiki publication, and final parity verification as future work. Append a correction and continuation-start entry; never alter the prior bytes.
4. Preserve 456 Wiki files and 450/450 Markdown-source mappings only as dated provenance for Wiki commit `1927a915...`. Adding this document changes the source set: derive the new counts and require current `N/N` one-to-one coverage, zero collisions, and zero broken internal links/fragments.
5. The historical two verifier reports are attested by hash but their raw sanitized JSON was not retained publicly. For future publication waves, retain a durable sanitized PR comment or check summary containing result metadata and hashes, without Project node IDs, private data, or secrets. A CI artifact may supplement that record but may not be the only durable evidence.
6. Use precise issue wording: there are 58 repository issues numbered #2–#59. Issue #59 exists as the 58th canonical task. Say “no additional task/control issue was created,” never “issue #59 does not exist.”
7. Use precise readiness wording: all 58 are `Incomplete`; the current execution-decision distribution is 45 `Hold` plus 13 `Historical non-authorizing`. Correct the README's “58 Incomplete/Hold” shorthand when updating current status. Never turn planning Done into implementation Done.
8. `docs/project/P0-PHASE1-TASK-READINESS-STATE.json` still says the PC-001 exact-candidate QA/five-seat review and Gate B publication did not complete. Those factual blockers are stale after PRs #67–#68 and currently propagate to generated controls and issue #3. Remove only the stale factual blockers and regenerate projections; preserve PC-001 as `Historical non-authorizing`, its six artifacts as In review until deliberately changed, and zero task approval/execution authority.

Completion of this repair package is a checkpoint, not completion of the Goal.

## Authority order

Resolve conflicts in this order:

1. Direct Product Owner instructions issued after this Goal is activated.
2. This bounded P0/R0 Goal.
3. Root `AGENTS.md`.
4. `docs/council/execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md`, the execution-council charter, owner-action ledger/state, reviewer registry, approval registry, and task Definition of Ready.
5. Governing product requirements, UX specification, release PRDs/PID, architecture plan, manifest, and release plan.
6. Research, spikes, historical trackers, static prototypes, and prior running-log entries.

Later evidence may supersede an earlier factual snapshot, but never silently rewrite history. Append corrections and dated decisions. No document may delegate a human-only act, weaken a safety gate, or turn access into authority.

## Activation Bootstrap — publish the pending Goal package safely

A direct Product Owner submission of this prompt immediately authorizes one narrow `bootstrap-publication` action in the existing Phase 1 worktree. This exception exists only to resolve the expected unpublished Goal package that would otherwise fail the clean-worktree gate. It does **not** activate Stage 0 or P0/R0 execution and does not authorize application/design/test work, a Product Council decision, a `RUNNING_LOG.md` append, Wiki/workbook/issue/Project mutation, private access, deployment, or any R1-R10 action. Use the bootstrap PR/check record as the interim durable evidence channel.

The Product Owner explicitly authorizes Codex to inspect, hash, classify, and preserve all pre-existing worktree changes for this bootstrap. Inspection authority is not modification or publication authority. Do not print an unexpected filename, diff line, file content, remote value, or sensitive match into tool/chat output; retain only sanitized counts, allowlist results, and fingerprints.

The only bootstrap publication allowlist is:

1. `README.md`
2. `docs/INDEX.md`
3. `docs/project/P0-CODEX-GOLD-GOAL-PROMPT-P0-R0-ONLY-2026-08-15.md`

The bootstrap may maintain exactly one Goal-owned private state record in the resolved per-worktree Git administrative directory, outside the repository worktree/index—for example, the private path resolved by `git rev-parse --git-path codex-p0-r0-bootstrap-state.json`. It must be a regular mode-`0600` file written atomically and must never be staged, committed, copied to shared Git configuration, printed, attached to a PR, or cited in chat/log/Wiki. Its closed schema is limited to version, Goal ID, state, allowlist, base/parent SHA, submitted-region and wrapper/blob fingerprints, generated bootstrap local/remote branch name, generated fresh execution-branch name, local/remote commit SHA, PR number/head/base/state, ignored-path inventory digest and protected local inventory, timestamps, and last successful transition. It must contain no credential, raw file content, private target data, or authentic content. Unexpected-path identities and fingerprints may exist only inside this private record and may never enter tool/chat/PR/log output. Update the record after every completed transition. Preserve it on ambiguity or failure; after the fresh execution branch passes the strict gate and the first running-log entry records sanitized bootstrap provenance, this prompt authorizes deletion of only that exact Goal-owned state file.

Before classification, run protected no-echo checks for the owner-pinned worktree identity, canonical single fetch/push target, attached branch, and local source state. Perform a prompt-free targeted `--no-prune --no-tags --no-recurse-submodules` refresh of only `refs/heads/main:refs/remotes/origin/main` plus a read-only lookup of the recorded bootstrap ref/PR when one exists. Do not apply the generic clean-state failure or require `HEAD == origin/main` until the partial state is classified.

Then classify the local and remote state into exactly one mutually exclusive state without emitting raw paths or content:

- **already-merged-clean** — refreshed `origin/main` contains the reviewed blobs and this same worktree is already clean on the recorded fresh no-upstream `codex/*` execution branch at exact `origin/main`;
- **merged-local-not-reconciled** — refreshed `origin/main` contains the reviewed blobs, but the worktree has not yet reached the exact `already-merged-clean` execution-branch state; retained bootstrap refs or merged PRs do not select a pre-merge state;
- **exact-remote-or-open-PR** — refreshed `origin/main` does not contain the reviewed blobs, the explicit remote bootstrap ref binds the exact reviewed local commit/base/paths/blobs, and the single PR is absent or `OPEN` with those same bindings;
- **exact-local-commit** — refreshed `origin/main` does not contain the reviewed blobs, the recorded remote ref is absent, and the attached Goal-owned bootstrap branch's current commit has the recorded base parent, exact three-path reviewed diff, and clean index/worktree;
- **goal-branch-with-reviewed-index** — refreshed `origin/main` does not contain the reviewed blobs, the attached branch is exactly the recorded Goal-owned bootstrap branch at the recorded base, no matching local commit/remote ref/PR exists, the cached set/blobs equal the reviewed candidate, and no unstaged/untracked state exists;
- **goal-branch-with-reviewed-worktree** — refreshed `origin/main` does not contain the reviewed blobs, the attached branch is exactly the recorded Goal-owned bootstrap branch at the recorded base, no matching commit/remote ref/PR exists, the index is empty, and the dirty set/fingerprints equal the reviewed three-file candidate; or
- **pending-unpublished** — refreshed `origin/main` does not contain the reviewed blobs, no recorded existing bootstrap branch/ref/PR exists and the current branch is not the recorded Goal-owned branch, `HEAD == origin/main`, the index is empty, and the dirty set is exactly the expected two tracked navigation modifications plus the ordinary untracked Gold Goal. A recorded but not-yet-created planned branch name remains part of this state and must be reused.

Evaluate those states in the listed precedence order. The `origin/main` reviewed-blob test decides merged versus pre-merge routing before retained bootstrap refs/PRs are considered. Require the applicable private state record, base/parent, bootstrap or execution branch identity, reviewed fingerprints, exact path/blob set, and remote/PR SHA to remain provable. Any unrelated/staged drift, ambiguous or multiple state match after applying the explicit exclusions, missing provenance, or byte mismatch must preserve state and stop. Classify before applying the initial dirty-shape rules and before creating a branch or PR; resume only the next uncompleted transition and never duplicate a completed one.

Apply the following transitions as appropriate to the classified state:

1. For `pending-unpublished` only, require the protected checks to confirm the `Phase1` marker and physical root, and require the starting `HEAD` to equal the freshly fetched `origin/main`. Do not run the later generic clean-state failure yet.
2. For `pending-unpublished` only, inventory staged, unstaged, and untracked entries with NUL-safe parsing. The automatic bootstrap may continue only when the index contains no staged entry and the complete dirty set is exactly the three allowlisted paths. Require `README.md` and `docs/INDEX.md` to be ordinary tracked-file modifications, and the Gold Goal to be one ordinary untracked file. Reject a delete, rename/copy, conflict, type or mode change, symlink, submodule, unsafe size, NUL-containing or unreadable text, or fourth dirty path. Never emit a rejected path or its content.
3. Any fourth path or any staged entry outside the exact recognized `goal-branch-with-reviewed-index` state blocks publication after sanitized fingerprinting, even when it is non-overlapping. Inspect only enough to establish ownership, overlap, mode, fingerprint, and preservation requirements. Do not stage, modify, commit, stash, reset, clean, restore, rename, delete, reformat, or absorb it. Report **Activation Bootstrap blocked by preserved pre-existing changes; P0/R0 not activated** and stop. This prompt is the requested authority to inspect and preserve those changes; it is not authority to dispose of them.
4. Before any allowed-file bytes or diff can reach tool/chat output, run local non-echoing regular-file/mode/size/NUL/suspicion and privacy scans that explicitly include the untracked Gold Goal. Snapshot repository-contained ignored paths, modes, and fingerprints locally without emitting their names or values; validators and hooks must be non-mutating, and every later comparison must show no changed or new ignored path. If the scans pass, review all three files completely without publishing sensitive scan matches. `README.md` and `docs/INDEX.md` may only add the bounded Goal navigation and identify the prior broad Goal as historical/superseded. Hash and compare the local file region from the `# Goal:` heading through EOF byte-for-byte with the Goal directly submitted by the Product Owner; review and hash the artifact wrapper above that heading, README, and INDEX separately. Require P0/R0-only scope and no secret, private target/account/topology detail, Project node ID, raw response, local absolute path, authentic content, or unsupported claim. Then run non-mutating whitespace/diff checks including the untracked Goal, Markdown/link/anchor checks, shell-block parse, exact 8-task/11-requirement/50-task-freeze assertions, and independent cold-reader/adversarial review before changing Git state.
5. Recheck `HEAD == origin/main`, the three reviewed fingerprints, and the ignored-path snapshot immediately before publication in `pending-unpublished`. In this same registered worktree, generate and record one fresh unique `codex/*` bootstrap branch name bound to this candidate and base. Prove its remote ref is absent; if it already exists, continue only under the exact resumable-provenance state above. Create the local branch at the recorded base with no inherited upstream; never reuse the current branch's upstream or an unrelated remote ref. A verified `goal-branch-with-reviewed-worktree` restart must reuse its exact recorded branch and fingerprints rather than create another. Stage only the three explicit pathspecs—never `git add .`, `git add -A`, or a broad directory. Require the cached path set to equal the allowlist exactly, the working tree to have no remaining unstaged/untracked entry, the ignored-path snapshot to be unchanged, and the staged blobs to match the reviewed fingerprints. A verified `goal-branch-with-reviewed-index` restart resumes after these checks without creating another branch or restaging.
6. Commit with an explicit exact three-path `--only` pathspec for `README.md`, `docs/INDEX.md`, and the Gold Goal; do not use a pathless commit. Do not amend, bypass hooks, leak signing output, or rewrite history. Prove the commit has the expected parent and exact three-path diff, then rerun the NUL-safe worktree/index and ignored-path inventories and require no drift. If a hook or tool touched another path or left drift, do not push and do not attempt destructive recovery; preserve the state and report the blocker. Otherwise push non-force to the same recorded branch name with an explicit non-`main` refspec `HEAD:refs/heads/<recorded-codex-bootstrap-branch>`; never use bare `git push` or change the target name mid-flow. Query the remote branch afterward and require its SHA to equal the reviewed local commit. A verified `exact-local-commit` restart resumes at the explicit push; do not recommit.
7. Open or reuse one normal PR to `main` only after proving its head SHA and three-file diff match the reviewed commit. Require current-candidate CI, independent review, public-safety checks, and a durable sanitized verification summary. Follow-up commits may touch only the same three paths and must repeat the checks. Immediately before merge, requery the live PR and require the base branch, expected head and base SHAs, complete commit set, exact three paths and blobs, current-head approvals/checks, automation/bot state, and ignored-path snapshot to match the reviewed candidate with no drift. Merge normally using an expected-head-SHA guard; prohibit unpinned auto-merge. Do not push directly to `main`, bypass protection/review, force-push, or mutate any other GitHub/Wiki/Project surface.
8. After merge, perform the same targeted prompt-free `--no-prune --no-tags --no-recurse-submodules` refresh of `origin/main` and verify it contains the exact reviewed Gold Goal and navigation blobs. Require the local worktree, index, and ignored-path snapshot to be fully clean/unchanged before any fast-forward, switch, or branch creation regardless of merge strategy. Verify byte-equivalent merged content, then generate and atomically persist one unique fresh `codex/*` execution-branch name in the private state record **before** switching/creating it. Always switch or create that recorded branch directly at exact `origin/main` with no upstream inherited from the bootstrap or `main` branch; on restart, reuse the recorded name after proving its exact branch state rather than generating another. Do not retain the bootstrap branch as the execution branch, reset, or rewrite history.
9. Rerun the strict clean exact-main preflight below from its first check. Only when it passes may P0/R0 activation begin: read mandatory context, create the Council, append the first running-log entry with the bootstrap PR provenance, snapshot the 50 frozen tasks, and enter Stage 0. If it fails, report **Activation Bootstrap published; P0/R0 not activated**, preserve the exact state, and stop.
10. Make the flow idempotent. If the exact package is already merged, route through `merged-local-not-reconciled` until the same worktree reaches the fresh no-upstream execution-branch state; only `already-merged-clean` may skip publication/reconciliation and run the strict gate. If a bootstrap branch or PR exists, resume it only after proving exact SHA, content, path scope, and review state; never create a duplicate. Do not auto-delete the branch. Before merge, rollback is limited to closing the Goal-owned PR and preserving its branch unless exact deletion authority is later given. After merge, correction requires a separately reviewed normal revert or forward-fix PR; destructive local cleanup is forbidden.

## Same-worktree and Git contract

The Product Owner will launch this Goal with the existing Phase 1 worktree selected. Continue that exact worktree. The following is the strict **P0/R0 execution activation gate**; run it only after the Activation Bootstrap has either been skipped as already merged or completed successfully.

Before Stage 0, run this protected no-echo local identity/state preflight. Do not enable shell tracing. Do not print the repository root, raw remote URL, branch name, changed filenames, or diff lines; an unexpected value may itself be sensitive.

```sh
(
  set +x
  repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
    echo 'Selected directory is not a readable Git worktree.' >&2
    exit 1
  }
  physical_pwd="$(pwd -P 2>/dev/null)" || exit 1
  git_dir="$(git rev-parse --git-dir 2>/dev/null)" || exit 1
  common_dir="$(git rev-parse --git-common-dir 2>/dev/null)" || exit 1
  worktree_marker="${git_dir##*/}"
  if [ "$physical_pwd" != "$repo_root" ] || [ "$git_dir" = "$common_dir" ] || [ "$worktree_marker" != 'Phase1' ]; then
    echo 'Selected checkout is not the owner-pinned existing Phase 1 worktree; paths suppressed.' >&2
    exit 1
  fi
  fetch_urls="$(git remote get-url --all origin 2>/dev/null)" || exit 1
  push_urls="$(git remote get-url --push --all origin 2>/dev/null)" || exit 1
  canonical_url='https://github.com/arunpr614/Life-Reflection.git'
  if [ "$fetch_urls" != "$canonical_url" ] || [ "$push_urls" != "$canonical_url" ]; then
    echo 'Origin fetch/push targets do not uniquely match the canonical repository; raw values suppressed.' >&2
    exit 1
  fi
  branch_name="$(git branch --show-current 2>/dev/null)" || exit 1
  if [ -z "$branch_name" ]; then
    echo 'Detached HEAD is not permitted.' >&2
    exit 1
  fi
  case "$branch_name" in
    codex/*) ;;
    *)
      echo 'Execution activation requires the fresh codex execution branch; name suppressed.' >&2
      exit 1
      ;;
  esac
  if git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' >/dev/null 2>&1; then
    echo 'Execution activation branch must not inherit an upstream.' >&2
    exit 1
  fi
  worktree_state="$(git status --porcelain=v1 2>/dev/null)" || exit 1
  if [ -n "$worktree_state" ]; then
    echo 'Worktree has pre-existing changes; details suppressed. Preserve them and stop activation.' >&2
    exit 1
  fi
  git diff --check >/dev/null 2>&1 || {
    echo 'Unstaged diff check failed; details suppressed.' >&2
    exit 1
  }
  git diff --cached --check >/dev/null 2>&1 || {
    echo 'Staged diff check failed; details suppressed.' >&2
    exit 1
  }
  echo 'Owner-pinned worktree, canonical fetch/push targets, fresh no-upstream codex execution branch, clean state, and diff checks verified.'
)
```

Require the canonical remote `https://github.com/arunpr614/Life-Reflection.git`. The existing registered Git worktree administration name `Phase1` is the public-safe continuity marker; do not create, copy, or rename a worktree to manufacture that marker. If identity, marker, or remote checks fail, stop before writing and ask for the correct existing worktree without echoing the suppressed value. If cleanliness or exact-main checks fail after the bootstrap, report **Activation Bootstrap published; P0/R0 not activated**, preserve the inspected state, and request only the minimum owner disposition needed; do not start another worktree or repeat publication.

Only after repository root and remote identity pass, refresh and record provenance:

```sh
(
  set +x
  GIT_TERMINAL_PROMPT=0 git fetch --no-prune --no-tags --no-recurse-submodules origin refs/heads/main:refs/remotes/origin/main >/dev/null 2>&1 || {
    echo 'Origin refresh failed; details suppressed.' >&2
    exit 1
  }
  head_sha="$(git rev-parse HEAD 2>/dev/null)" || exit 1
  main_sha="$(git rev-parse origin/main 2>/dev/null)" || exit 1
  if [ "$head_sha" != "$main_sha" ]; then
    echo 'HEAD is not exact origin/main; stop before activation.' >&2
    exit 1
  fi
  printf 'Verified exact source SHA: %s\n' "$head_sha"
)
```

Preserve all user changes and existing commits. Never reset, clean, rewrite history, force-push, bypass checks, or overwrite unrelated work. Use sequential `codex/*` branches in this worktree and normal pull requests. A missing branch-protection rule is not permission to skip independent review or CI.

Use one primary writer. Specialist agents return findings unless assigned an exact non-overlapping file set. Serialize edits to shared generators, manifests, approval records, roadmap projections, workbook sources, Wiki tooling, and `RUNNING_LOG.md`.

If the Product Owner says **pause**, stop starting new work immediately, disarm only Goal-owned scheduled monitors/automations so no future probe can fire, and bring an already-running non-atomic or destructive operation to its nearest safe boundary. After that, do not run another probe, edit, validation, commit, external mutation, deployment, or log append. Preserve unrelated schedules, report the exact preserved state, and wait. This Goal does not authorize resumption after a pause; only a later direct Product Owner instruction does.

## Mandatory context bootstrap

Only after the strict clean exact-main activation gate passes, read the execution context below. Do not ask the Product Owner to summarize the repository. Paths are repository-root-relative.

Read in this order before changing authority, readiness, task state, or code:

1. `AGENTS.md`
2. `README.md`
3. `docs/INDEX.md`
4. This bounded Goal and the superseded `docs/project/CODEX-GOAL-PROMPT-P0-TO-PRODUCTION.md`; read the older Goal only for inherited control history, never as execution scope
5. The latest entry and header of `RUNNING_LOG.md`
6. `docs/product/PRODUCT-REQUIREMENTS.md`, `CONTEXT.md`, and `docs/project/REQUIREMENTS-TRACEABILITY.md`
7. `docs/design/UX-SPECIFICATION.md` and `docs/council/UX-DESIGN-REVIEW.md`
8. All execution-governance records under `docs/council/execution/` and role charters under `docs/council/agents/`
9. `docs/project/PHASE1-ROADMAP-MANIFEST.json`, `docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json`, `docs/project/P0-PHASE1-TASK-READINESS-STATE.json`, `docs/project/P0-PHASE1-TASK-STATE.json`, `docs/project/PHASE1-RELEASE-PLAN.md`, `docs/project/PHASE1-GITHUB-ISSUES.json`, and `docs/project/PHASE1-GITHUB-PROJECT-SYNC.md`
10. Inspect `outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx` with the installed Spreadsheets skill and read `tools/build_phase1_release_plan.mjs`; the workbook is a living projection, not authority
11. `docs/product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md`; do not open later-release PRD/PIDs to discover or prepare work
12. `docs/architecture/PHASE1-IMPLEMENTATION-PLAN.md`, `docs/research/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md`, and `docs/architecture/HETZNER-SHARED-HOST-RUNBOOK.md`
13. `docs/project/PROTOTYPE-COMPLETENESS-TRACKER.md` only to preserve its boundaries: never modify frozen v6-v10 evidence and do not begin queued v11-v35 packages under this Goal
14. `SECURITY.md`, `CONTRIBUTING.md`, and `PUBLICATION.md`
15. `docs/research/WAYFINDER-PHASE1-GITHUB-INTEGRATION-RESEARCH.md` only to understand containment; do not create a Wayfinder map, issue, or child task unless an unresolved P0/R0 decision strictly requires it and it can be represented without expanding the 58-task roadmap

Follow links needed for the active task. Refresh all time-sensitive facts. Treat `docs/project/PROJECT-TRACKER.md` and timestamped resource indexes as historical orientation when they conflict with current manifest, authority, or live evidence.

## Product Council

Create and maintain a five-seat Product Council for execution. Bind five distinct active reviewer identities/agents to the five roles in the approved reviewer registry. They may run in sequential waves when concurrency is limited, but one identity or repeated review pass cannot satisfy multiple seats, and the primary integrator cannot impersonate a seat:

1. **Technical Architect** — architecture, data model, security/privacy boundaries, deployment admission, migrations, capacity, observability, backup/restore, rollback, and coexistence veto.
2. **Expert Product Manager** — requirement interpretation, scope, user value, acceptance criteria, deferred-boundary protection, and product-truth veto.
3. **Independent QA Agent** — test strategy and execution evidence; privacy/security/accessibility/restore/rollback verification; independent veto. The QA reviewer must not be the candidate implementer or sole author of the evidence under review.
4. **Expert UI/UX Designer** — journeys, all states, responsive and accessible behavior, safe destructive flows, prototype/design traceability, and usability-truth veto.
5. **Expert Project Manager** — dependencies, evidence sequencing, roadmap/issue/workbook/Wiki/log reconciliation, release coordination, rollback readiness, and status-truth veto.

The primary Codex agent is the orchestrator and implementation owner. Spawn additional bounded engineering or research agents only when useful. Work within available concurrency; council seats may run in dependency-aware waves.

Every substantive task requires its six task-bound Product, Architecture, Design, QA, Delivery, and Council artifacts to describe the exact proposed action. Five seats review the same immutable candidate revision and dossier digest. Any veto, stale binding, missing evidence, unresolved dependency, or failed gate means Hold.

Do not add a roadmap task solely for a council review. Attach R0 release-level QA evidence to `REL-R0-001`; do not touch later-release QA tasks or artifacts. The 58-task baseline is fixed for this Goal. If completing P0/R0 genuinely requires a new canonical task or a semantic change to any R1-R10 task, stop and report that the requested change is outside this Goal; do not expand scope autonomously.

## Standing authorization

Within this Goal and after the applicable gates pass, Codex may act only for the eight P0/R0 tasks and the narrowly necessary shared controls/projections:

- edit P0/R0 application-shell code, tests, migrations, deployment configuration, documentation, generators, council records, and public-safe evidence in the current worktree;
- use fictional/synthetic fixtures for R0 implementation, accessibility, migration, restore, rollback, and release rehearsal;
- create P0/R0- or Stage-0-scoped branches, commits, pull requests, review updates, and normal merges;
- reconcile only the eight in-scope managed issue bodies and their 16 currently mutable existing Project field values using the current dry-run-first contract; delivery Status, issue state, and the single canonical status-label assignment remain verification-only until the separately reviewed Stage 0 transition control exists, while every other label, milestone, saved-view definition, workflow, and every R1-R10 task remains separately gated and out of scope;
- build and publish the Wiki from exact merged `origin/main` using a recoverable clone and one-to-one audit;
- regenerate the canonical Excel release plan with the installed Spreadsheets skill and validate every sheet and formula;
- deploy, migrate, back up, restore, verify, and roll back only the synthetic R0 private-shell target covered by valid P0/R0 private authority; and
- append directly to `RUNNING_LOG.md` under the standing exception below.

This authority does not permit:

- direct push to `main`, force-push, destructive reset/clean, history rewrite, review/check bypass, or direct deletion of unrelated data or resources;
- guessing a host, account, target, path, port, credential, secret, provider, cost ceiling, or rollback target;
- searching keychains, browser stores, shell history, unrelated repositories, backups, or other applications for credentials;
- accepting legal/provider terms, creating a paid account, increasing recurring cost, or choosing a material processor/privacy posture without the named human approval;
- Project workflow or non-delivery-item mutation without `P0-OA-002` and an exact rollback capture;
- private host/provider/tunnel/DNS/backup read or mutation without `P0-OA-001`, the applicable release action, and exact target-specific authority;
- any authentic journal, photo, audio, transcript, or other personal-memory admission or processing;
- any R1-R10 implementation, research, design, prototype, test, deployment, release, owner-action request, or semantic projection change;
- weakening privacy, security, accessibility, integrity, recovery, rollback, evidence, or release gates to preserve a date; or
- declaring implementation, deployment, release, production, or Goal completion from documents, prototypes, CI, a backup upload, or a merged PR.

## Authority matrix

Use the least authority that covers the exact surface:

| Surface/action | Required authority before action |
| --- | --- |
| One-time three-file Activation Bootstrap | This direct Product Owner submission plus the exact bootstrap protocol above; inspect and preserve pre-existing changes, publish only the allowlisted Goal/README/INDEX package through one reviewed PR, atomically maintain the one exact private per-worktree Git-admin bootstrap-state record and delete only that Goal-owned record after its stated cleanup gate, and keep all execution/private/projection authority dormant until the strict clean exact-main gate passes |
| Read public repository/Wiki metadata and private Project delivery metadata | This activated Goal and current authenticated read access; no private-host authority is implied |
| Push a scoped `codex/*` branch and open/update its draft PR to obtain CI/review | Exact local commit, correct remote, public-safety/privacy scan, reviewed diff scope, recoverable normal push, and no direct `main` mutation. Freeze and sanitize the candidate before marking it ready and requesting required review; final dossier, seat approvals, and passing current-candidate CI are mandatory before merge, not before reviewers can be asked |
| Stage 0 public control-plane repair | This Goal's one-time bootstrap authority, one named `P0-` control-review dossier, five distinct seat attestations bound to the exact candidate, passing CI/adversarial review, normal PR/merge, and no product/private action |
| Current GitHub delivery apply | Exact merged-main candidate, complete dry-run/rollback snapshot, and current sync contract; mutate only the eight P0/R0 issue bodies and their 16 mutable field values, while proving the 50 R1-R10 task semantics unchanged |
| Future P0/R0 delivery Status/issue-state/status-label transition | The separately reviewed evidence-gated Stage 0 transition mechanism, exact rollback snapshot, automation-side-effect checks, and quiescent verification; it may act only on the eight in-scope items, replace only their existing canonical status-label assignment, and may not create, delete, or redefine labels |
| Label, milestone, field definition, saved view, workflow, or non-delivery Project mutation | A separately scoped reviewed control change, exact recovery plan, and `P0-OA-002` whenever its Project workflow/non-delivery boundary applies. When an API does not expose a UI-managed view setting, only an explicitly authorized owner/admin procedure with before-state capture, exact steps, rollback, and sanitized after-evidence may change it; never use an ad-hoc UI or raw-API workaround |
| Private host/provider/tunnel/DNS/backup read or synthetic R0 write | `P0-OA-001`, `R0-OA-001`, `R0-OA-002` when a material provider/terms/spend choice is actually implicated, exact target authority, private evidence custody, and all R0 task gates |
| Authentic fixture, later-release provider action, Recovery Ceremony, launch, or R10 act | Prohibited by this Goal; do not request or perform it |

## Private authority, credentials, and authentic content

An authenticated session proves access, not authority. Before any private host/provider/tunnel/DNS/backup/R0-target read or mutation, require the structured, access-controlled authority evidence defined by the owner-action ledger. Read-only access to private Project delivery metadata follows the narrower authority-matrix row and grants no private-system authority. Keep raw target, account, topology, secret, credential, recovery, and provider evidence outside the public repository, issues, Project, Wiki, workbook, screenshots, chat, and running log. Public records may contain only approved opaque references and sanitized pass/fail metadata.

Never run a private command through a generic execution path that streams raw stdout or stderr to Codex, tool output, terminal history, or chat. Use the reviewed private runner to capture both streams directly into the approved access-controlled raw-evidence location, evaluate them with a closed-schema local sanitizer/verifier, and return only fixed-schema sanitized pass/fail, counts/ranges, timing, and opaque evidence IDs. This applies to success and failure. If capture or sanitization fails, emit no raw tail, path, target, or value; stop that lane privately. Inject credentials only through the approved private mechanism, never command arguments or public environment output.

At startup, derive the current owner-action counts and states from the ledger/state file and compare them with the dated baseline; never hard-code that baseline as current truth. This Goal may request only `P0-OA-001`, `P0-OA-002` when its exact Project-control boundary is implicated, `R0-OA-001`, and `R0-OA-002` when a material provider/terms/spend choice is actually implicated. Do not request, prepare, satisfy, or change any R1-R10 owner action. Never request a candidate-, time-, environment-, or verifier-bound attestation before its exact evidence exists. Consolidate due P0/R0 actions into one private-safe minimum-action request. Do not ask for secrets in chat. Continue all unaffected local, public, fictional, synthetic, documentation, design, and test-harness work while an owner action is pending.

Operate in **synthetic-only memory mode**. No authentic journal, photo, audio, transcript, or other personal-memory content may enter an agent, tool, application test, R0 target, artifact, or evidence path. Use fictional memory fixtures only. The one narrow exception is the minimum live authentication assertion needed to prove owner access and denial at the authorized R0 target under valid `P0-OA-001` and `R0-OA-001`; Codex, AI tools, test fixtures, public evidence, and command output must never receive its value, and the target must not log, persist, or expose it beyond the bounded authentication transaction. Retain only sanitized pass/fail and an approved opaque evidence reference. Authentic-memory admission and UAT begin no earlier than a separately activated later-release Goal.

## Mandatory live-mutation preflight

Before every P0/R0 GitHub apply, Wiki push, private read/write, migration, deployment, backup, restore, rollback, acceptance action, provider change, or other external mutation, require all of the following. There are two narrow publication exceptions:

1. The one-time three-file Activation Bootstrap is governed exclusively by its ten-step protocol and authority-matrix row above. It may inspect/preserve the pending files, atomically create/update the one exact private per-worktree Git-admin bootstrap-state record, create the exact branch/commit, push the explicit non-`main` ref, open/review the exact PR, merge that exact PR normally, and delete only that Goal-owned state record after its stated cleanup gate, without a Product Council, task dossier, or running-log append. It may mutate no other repository/worktree file, local-control file, or external surface.
2. After P0/R0 activation, a scoped branch/draft-PR action may use its narrower authority-matrix preflight so CI and independent review can exist, but it cannot merge or mutate another surface until the full applicable preflight below passes.

- the exact target and permitted action are resolved without guessing;
- the authority-matrix entry for that surface is satisfied; when it requires private authority, the action-specific record is valid, unexpired, and represented publicly only by its approved opaque reference;
- the candidate revision, dossier digest, and independent reviews match the bytes being acted on;
- dry-run or preview output has been inspected, unrelated drift is absent, and the mutation is idempotent or has an exact recovery plan;
- a pre-change snapshot or inventory exists where applicable, rollback inputs are present, and rollback has been rehearsed at the risk-appropriate layer;
- secrets and private evidence remain in approved channels, and the synthetic-only content rule is structurally enforced;
- required CI, QA, council, dependency, capacity, maintenance-window, and co-resident safety gates pass; and
- the required pre-mutation running-log entry contains sanitized intent, scope, evidence, rollback, and expected outcome.

If any condition is false, stale, ambiguous, or unverifiable, do not mutate that surface. Continue unaffected work and raise the smallest precise blocker. Never convert a partial apply into success; reconcile or roll it back before proceeding.

## Running-log standing instruction

Invoke the installed `codex-project-running-log` skill throughout this Goal. The Product Owner explicitly authorizes direct append without presenting each entry for approval. This exception applies only to confirmation before append; all append-only and privacy rules remain mandatory.

Before each append, read the log header and latest entry. Append only. Never rewrite, truncate, reformat, reorder, replace, rename, archive, or delete any previous byte. Use Asia/Kolkata local time in `YYYY-MM-DD HH:MM`.

Append a substantive entry at the following cadence, subject to the immutable-candidate and terminal-projection exceptions below:

1. at bootstrap after the preflight, context digest, and council formation;
2. after every council decision, scope/evidence change, task-readiness result, or roadmap status transition;
3. immediately before and after every live GitHub, private-system, migration, R0 deployment, acceptance, rollback, or recovery mutation, subject to the post-merge projection exception below;
4. after every implementation candidate and independent QA pass/failure/repair/retest cycle;
5. at the R0 entry, exit, hold, proceed/hold/rollback decision, incident, and recovery event;
6. at least every 45 minutes when material state changed and no event-driven entry occurred;
7. before context compaction or handoff; and
8. at the bounded P0/R0 completion or precise blocked terminal, or use the designated durable terminal PR/check evidence channel when source has already locked.

Each entry must state branch/commit/PR, changed files, exact checks, evidence, council disposition, R0 runtime/deployment state, roadmap/workbook/Wiki state, blockers, next action, and honest self-critique. The terminal entry/equivalent must explicitly say that P0/R0 completed and R1-R10 were not started by this Goal. Never log secrets, authentic content, private URLs/topology, private Project node IDs, recovery material, or raw provider responses.

The current approval model does not permit `RUNNING_LOG.md` to change after an immutable task candidate freezes. Stage 0 must add a separately reviewed append-only descendant contract with prior-byte-prefix, path, privacy, and provenance validation, or an equivalent non-source evidence mechanism. Until that repair is merged, append the intent before freezing the Stage 0 candidate; the frozen dossier contains only review context and deterministic digest inputs, while later bootstrap attestations live only in durable exact-commit PR/check records. Do not alter the closed current approval registry. After the successor path is merged, ordinary task Council, QA, approval, runtime, and publication events use the new registry/evidence mechanism plus the durable PR/check channel, with a recap appended before the next ordinary candidate. Never invalidate a candidate or leave a dirty exact-main checkout merely to satisfy cadence.

Avoid a source/GitHub/Wiki self-reference loop. For each publication wave, append the pre-mutation intent and expected verification before merging the exact source candidate, and name that PR as the post-merge evidence channel. Do not dirty the just-merged source solely to append the outcome of its GitHub apply, Wiki push, or final quiescent reconciliation. Record those sanitized outcomes—source SHA, Wiki SHA, Page Audit result, verifier reports/hashes, and remaining limitation—as comments on that already-merged PR. At the next ordinary source change, append a recap before its merge. At the terminal, the durable merged-PR comment/check summary is the final append-equivalent; do not create a source-only log commit that restarts the source/Wiki loop. The source documentation must direct readers to the live Page Audit or terminal-evidence PR, not claim an embedded Wiki hash is eternally current.

## Living roadmap, issues, workbook, Wiki, and evidence

Governing source documents, source ledgers, and reviewed evidence are authority. The manifest is the canonical machine-readable delivery projection. The generated Markdown plan, GitHub, Excel, Wiki, and dashboards are synchronized projections. Evidence precedes status. All 58 tasks remain visible in those projections, but this Goal may intentionally change only the eight P0/R0 tasks.

Before the first edit, store a sanitized deterministic freeze snapshot for the 50 R1-R10 tasks covering task ID/title, milestone, dates, status, issue state, canonical labels, priority, owner, description, dependencies, requirement mapping, Project field values, task-artifact bytes and states, readiness/approval/execution decisions, and `executionAllowed`. At every generation/apply and at terminal, require those values and bytes to match the snapshot and require `executionAllowed=false`. Only a deterministic provenance change in a shared aggregate projection or freeze-control record may differ; no per-task artifact or user-visible task value may change. Record and independently verify the exact aggregate-only exception.

After every material task, date, dependency, status, requirement, evidence, or artifact change:

1. update only the authoritative P0/R0 source and task-bound evidence, plus narrowly required shared controls;
2. obtain the applicable exact-candidate council decision;
3. regenerate the manifest and Markdown release plan using current tools;
4. regenerate the Excel plan with the installed Spreadsheets skill;
5. validate all 58 rows, counts, formulas, unique issue links, R10 blank dates, complete rendered coverage, the eight in-scope deltas, and the 50-task freeze snapshot;
6. run the GitHub sync dry-run and inspect the complete proposed delta;
7. merge the source change normally before any exact-main apply;
8. apply only then-permitted P0/R0 issue bodies, Project values, and evidence-gated delivery Status/state transitions from a clean `HEAD == origin/main` checkout using the reviewed current tools;
9. run an immediate live verifier and a second verifier after workflows settle; require byte-identical sanitized reports or explain every difference;
10. perform a separate read-only GitHub UI review because the verifier cannot attest UI-managed settings; retain sanitized evidence that the Status view has the expected visible fields and Status columns, the Roadmap is grouped by Milestone with Start/Target fields driving bars, both views contain exactly the 58 `phase1` delivery issues, and R10 has no timeline bars. If drift exists, hold the visualization claim and use only the authority-matrix repair path;
11. build the Wiki from that exact merged source while preserving unowned live-only pages;
12. validate one-to-one Page Audit coverage, all internal links/fragments, pinned source/assets, sidebar/navigation, and public safety;
13. push Wiki `master` normally and verify it from a fresh clone; and
14. ensure the pre-merge running-log entry is present, then publish post-merge GitHub/Wiki outcomes to the merged PR evidence channel; defer any source-log recap to the next ordinary source change.

Before using a sync command, re-read `AGENTS.md`, `docs/project/PHASE1-GITHUB-PROJECT-SYNC.md`, and `node tools/sync_phase1_github.mjs --help`. Do not reuse historical flags or assume a prior mutation allowlist. Dry-run is the default. The apply path must prove it will not touch any R1-R10 task before mutation. Never let a partial sync reopen Done issues, overwrite unrelated items, change Project definitions/workflows, or create an additional task implicitly.

Keep issue #3 as the existing PC-001 control tracker. Do not create a ninth in-scope task or any new roadmap issue. Issue #59 remains the untouched canonical `REL-R10-001` issue. The Project may contain pull-request records; the two canonical views must contain exactly the current 58 `phase1` issues, not every raw Project item.

## Execution sequence

### Stage 0 — repair the P0/R0 bootstrap control plane and re-establish trustworthy surfaces

The current readiness model is internally circular: it requires implementation and evidence inside an approved candidate before it authorizes the work that would produce them. Its closed PC-001 control-review partition also has no successor path, its five-minute callback cannot represent long-running work, and post-candidate running-log appends invalidate the candidate. Do not work around these defects. This activated Goal grants one-time bootstrap authority for the complete numbered Stage 0 public/local control-plane and factual-repair bundle under existing issue #3 only. That authority cannot implement product behavior, access a private system, create a task approval, authorize R1-R10, or change any out-of-scope task state. It ends only after every Stage 0 repair is merged, exact-main tests/projections/UI audit and the 50-task freeze check pass, and the five-seat/adversarial final closure review accepts the complete bundle. If verification fails, the same narrow authority permits only repair or normal revert within the named Stage 0 surface until a safe reviewed state is restored.

1. Complete startup preflight and full context bootstrap. Inventory `.github/workflows/`, control tools and tests, package manifests, implementation roots, infrastructure/deployment configuration, current GitHub automation, and every file in the approval/readiness chain before designing the repair.
2. Create the five-seat council and append the startup running-log entry before freezing the control candidate.
3. Create one named `P0-` control-review dossier for each exact Stage 0 candidate/PR plus one final post-merge durable PR/check closure record binding all merged SHAs; the closure record is not another repository file or merge. Preserve the historical PC-001 record. Candidate content may contain the dossier and its deterministic digest inputs, but never claim its own not-yet-existing commit SHA; later durable PR/check attestations bind the exact candidate SHA non-self-referentially. Five distinct registry-bound seats, independent QA, adversarial tests, CI, and normal PR review must approve each candidate. These bootstrap reviews permit only their normal merges and are never `taskApprovals` or runtime authorization records.
4. Replace the circular rule with two explicit phases while preserving fail-closed boundaries:
   - **Gate A — ready to prepare:** approved P0/R0 task-bound Product, Architecture, Design, QA-plan, Delivery, and Council proposal artifacts, dependency evidence, scope/action, and five-seat verdict authorize only local/public/fictional/synthetic implementation-and-test candidate preparation. Gate A must not require implementation or outcome evidence that it is intended to produce, and it permits no private/external action.
   - **Gate B — ready to execute or accept:** a later immutable P0/R0 implementation-and-evidence candidate, independent executed QA, current dependencies/owner actions, exact environment/authority, rollback, and five-seat verdict authorize only the named bounded R0 private read, migration, synthetic deployment, restore, rollback, or acceptance decision. Gate B does not retroactively authorize how the candidate was prepared.
   - Project status, implementation state, deployment state, and acceptance state remain separate; neither gate fabricates evidence or turns a planning Done task into implementation Done.
5. Establish an append-only, exact-candidate successor control-review path beyond the closed historical PC-001 partition. Require five distinct seat attestations, complete changed-path binding, negative tests, normal PR/CI, and an explicit statement that a control review cannot create a task approval.
6. Add the verified append-only `RUNNING_LOG.md` descendant/evidence mechanism described above so required cadence cannot invalidate an immutable candidate. Validate the prior-byte prefix, path/mode, privacy scan, event provenance, and final projection exception. Prove in evaluator/runtime tests that even a valid append is evidence-only and cannot change a task contract, dossier digest, Gate A/B state, authority, owner-action satisfaction, status, or permission; malformed, non-prefix, path/mode-drifted, or private appends fail closed.
7. Add an append-only staged-action schema without creating another roadmap task. Under this Goal it may authorize stages only for the five substantive R0 tasks. For private units, retain the five-minute in-process callback only for fully awaited actions that can actually complete within it; otherwise implement and review a serializable runner with closed module and argument allowlists, immutable `stageId`, idempotency key and predecessor binding, durable stage receipts, recovery, lock ownership, continuous authority/deadline/source revalidation, and process-tree cancellation with no orphan. The private path must capture stdout/stderr straight to approved raw-evidence custody and expose only closed-schema sanitized results, including on failure. It must reject arbitrary shell, environment, path, command, callback, output passthrough, or trust hooks. Never treat a detached or long-lived subprocess as guarded.
8. Add a separately reviewed, evidence-gated transition mechanism for Status, issue open/closed state, and replacement of the single existing canonical status-label assignment before the first new transition. Under this Goal its mutation allowlist must contain only the eight P0/R0 task IDs. It must use stable task IDs, exact source state, a complete dry-run, pre-change snapshots, automation-side-effect checks, idempotent recovery, rollback, and immediate plus quiescent verification. It must not create/delete/redefine labels or mutate any non-status label, milestone definition/assignment, field definition, view, workflow, non-delivery item, or R1-R10 item; those remain separately gated or prohibited. No manual UI or raw-API workaround may substitute for this delivery-state mechanism; UI-managed view repair follows the authority matrix.
9. Update the DoR, authorization, AGENTS contract, registries, generators, runtime verifier, tests, sync/runbook, required `.github/workflows`, and relevant projections atomically. Required PR workflows must actually run the control validators, adversarial/negative suites, generated-tracking checks, link/safety checks, applicable build tests, and the 50-task freeze check; a missing, skipped, neutralized, or stale-revision check is a failure even when branch protection would permit merge. Add positive transition tests and adversarial tests proving neither Gate A nor a control review can authorize private execution, acceptance, historical tasks, or any R1-R10 task.
10. Repair every known INDEX, Wiki self-reference, fragment, running-log, verifier-retention, and stale PC-001 readiness-state defect above. Add regression validation so it cannot recur.
11. Publish the control repair and factual repairs through one or more normal, independently reviewed PRs. Refresh the workbook, existing GitHub projections within the then-current allowlist, and Wiki only from exact merged source.
12. Run all control suites twice, verify the new two-phase and runtime paths from clean exact `origin/main`, retain durable sanitized evidence, conduct the separate Roadmap UI review, and obtain a final five-seat/adversarial no-veto result.
13. Record a dated decision that the P0/R0 control plane is executable and trustworthy, while R0 implementation, private access, synthetic deployment, and acceptance remain unproven until their later gates pass and R1-R10 remain out of scope.

### Stage 1 — preserve the P0 baseline and make R0 legitimately executable

1. Reverify the named historical evidence for `AUD-001`, `PC-001`, and `PRD-R0-001`. Keep all three `Done` and `Historical non-authorizing`; do not make them Ready, create execution permission for them, or treat their planning evidence as implementation evidence.
2. Select `SPK-R0-001` stage `local-synthetic/synthetic-foundation` as the first substantive action while private-read authority is pending. Use evidence rather than planned dates.
3. Keep every action inside one of the existing five substantive R0 tasks. If the work genuinely requires a new canonical task or an R1-R10 change, stop and report that the request is outside this Goal; do not revise the scope autonomously.
4. Refresh only the active R0 task's six protected proposal artifacts through the governed flow. Pass Gate A on the exact proposal candidate, then prepare local fictional/synthetic implementation and test evidence; never use private access under Gate A.
5. Freeze the later implementation/evidence candidate, run independent QA, and bind five distinct seat decisions to its exact revision and dossier digest for Gate B.
6. Execute a private or acceptance action only through the repaired staged runtime. For a five-minute in-process unit, use the reviewed exported entry point with `taskId`, `scopeClass`, `actionClass`, immutable `stageId`, predecessor binding, idempotency key, and the complete awaited action inside its callback. If the API derives one of those fields, prove exactly one active stage and bind all values in the frozen callback context and durable receipt. The CLI remains diagnostic; a projected permission boolean is not an authorization token.
7. For a longer unit, use only the reviewed serializable runner and its durable stage/recovery contract. Do not launch an unguarded worker or subprocess and call it protected.
8. Proceed only when the real entry point or runner repeats current Gate B evaluations from clean exact `origin/main`, every applicable P0/R0 owner action is satisfied, and it returns the documented accepted completion receipt for that exact unit. If private access is not yet authorized, continue Gate-A local/public/synthetic preparation and stop only the private lane.

### Stage 2 — complete the R0 synthetic private foundation

Execute the remaining R0 work in dependency and evidence order:

1. `SPK-R0-001` — complete the shared-host admission and rollback spike with current sanitized target evidence for capacity, topology, collisions, routing, restart, backup/restore, rollback, and co-resident non-regression.
2. `UX-R0-001` and `ARCH-R0-001` — after the spike and R0 PRD evidence are current, complete the R0 first-use/access/health/error designs, explicit prototype dispositions, and the exact private-shell architecture, threat/data-flow model, interfaces, data shapes, capacity limits, migration, secrets, logging/cache, backup, separate-path restore, and rollback plan. Obtain the distinct Designer and Architect signoffs plus all five council verdicts.
3. `ENG-R0-001` — implement and merge only the synthetic private shell. Produce task tests, immutable build and dependency inventory/SBOM, reversible migrations, denial behavior, truthful health, evidence-safe observability, authorized sanitized synthetic deployment evidence, restart, encrypted backup, separate-path restore, rollback, and co-resident non-regression evidence.
4. `REL-R0-001` — run independent QA and five-seat release review against the exact deployed candidate. Verify access and denial, callback isolation, secret scanning, authenticated ciphertext and wrong-key behavior, cache safety, truthful health, restart, capacity/coexistence, encrypted backup, separate-path restore, two independent off-server synthetic key-location classes described without secret locations, an actual representative synthetic decrypt, measured recovery against the four-hour R0 target, rollback, R0 accessibility coverage, and zero unresolved severity-1/2 or critical/high security/privacy findings.

Every one of the 11 R0 requirements must have requirement-level executed R0 evidence or the release is No-Go. A backup upload alone is never restore evidence. Synthetic recovery/key-custody mechanics may use ephemeral fictional material; they do not satisfy or attempt the later human Recovery Ceremony.

Do not infer host readiness. `P0-OA-001` and `R0-OA-001` must be valid before their corresponding private R0 action. Require `R0-OA-002` only if a material provider, terms, paid-account, or recurring-cost decision is actually necessary. When it is not implicated by the exact task stage, leave its global ledger status unchanged and record only that it was not due for that stage; never invent an unsupported `not applicable` owner-action status or count it as satisfied. Do not request `P0-OA-002` unless an otherwise prohibited Project workflow/non-delivery mutation becomes demonstrably necessary, in which case stop and request that separately scoped authority before acting. If SQLCipher/SQLite target-runtime gates fail, use the documented evidence-triggered PostgreSQL fallback only through an exact R0 council ADR.

The R0 council records `Proceed`, `Hold`, or `Rollback`. Only `Proceed` with all evidence permits R0 acceptance and Goal completion. `Hold` or `Rollback` keeps this Goal incomplete. This is an R0 foundation decision, not the later Product Owner launch decision.

### Stage 3 — reconcile, mark this bounded Goal complete, and stop

After `REL-R0-001` records `Proceed`:

1. Mark the five substantive R0 tasks `Done` only from their executed evidence. Preserve `AUD-001`, `PC-001`, and `PRD-R0-001` as historical non-authorizing planning/audit `Done`.
2. Reconcile the authoritative files, manifest, Markdown plan, eight in-scope issues and Project values, workbook, Wiki, Page Audit, and running-log/terminal evidence through the governed publication flow.
3. Re-run the 50-task freeze comparison and prove that every R1-R10 task remains unstarted by this Goal, `executionAllowed=false`, and matches its activation artifact bytes, states, issue/Project values, and user-visible semantics exactly. Permit only an independently verified deterministic provenance change in a shared aggregate projection or freeze-control record.
4. Close every completed R0 stage as non-replayable, consume or expire its execution authorization, and require `executionAllowed=false` for all eight in-scope tasks; retained approvals are evidence only. Disarm and verify removal of every Goal-owned temporary runner, lock, session, schedule, and temporary credential, and leave no Goal-scoped live mutation permission. Do not create a continuing production monitor.
5. Publish the exact terminal statement: **“Bounded Codex Goal COMPLETE: P0 control baseline and R0 synthetic private foundation accepted. Phase 1 remains incomplete; R1-R10 are out of scope and were not started by this Goal.”**
6. Mark the Codex Goal complete and stop immediately. Do not select, prepare, or recommend an R1 task as the next action within this Goal.

## Verification expectations

Use proportionate automated and independent evidence. At minimum:

- run all repository control suites, adversarial/negative tests, generated-tracking validation, and the 50-task freeze check after every control or projection change;
- run the R0 shell's actual lint, type, unit, integration, end-to-end, migration, security, privacy, and accessibility suites;
- prove every R0 persistent shape through encrypted backup, executed separate-path restore, migration, lifecycle/deletion, restart, and rollback or rehearsed forward-fix;
- inspect access/denial, headers, callback isolation, logs, caches, secrets, wrong-key behavior, error paths, health, and observability for content leakage or false success;
- prove structurally that R0 has no authentic-content admission path and run every test with fictional/synthetic fixtures only;
- test R0 normal, empty, loading, error, interruption, retry, stale, destructive, unavailable, and recovery states that its UX and architecture claim;
- verify keyboard, focus, screen-reader semantics, contrast, target size, zoom, responsive layouts, themes, and reduced motion for every R0 surface;
- prove target capacity, routing/port/name collision avoidance, failure isolation, co-resident non-regression, restart, measured recovery against the four-hour target, and rollback;
- retain exact source, build/SBOM, environment, sanitized configuration, and evidence identifiers without publishing private values; and
- use independent QA and five distinct council seats for the R0 acceptance claim.

Treat the existing `341/341`, `35/35`, `62/62`, `48/48`, and `352/352` results as readiness-control regression baselines only. They are not product-test, deployment, or release evidence.

## Failure, rollback, and escalation

Fail closed. Stop the affected mutation when target, authority, credential, rollback input, evidence, or ownership is ambiguous. Preserve evidence without secrets. Roll back when the predetermined threshold requires it. Continue all unaffected work.

Never lower a gate after a failure. A backup upload is not restore evidence. A passing health endpoint is not the complete R0 journey. A merged PR is not deployment. A synthetic R0 deployment is not product launch or production acceptance. An AI council cannot impersonate MFA/account authentication, scoped-credential provisioning, private-target authority, provider-terms acceptance, or material spend approval.

When human action is required, request only the minimum consolidated action through the approved channel. State the exact action, why it is human-only, required-by gate, safe input mechanism, deadline/impact, and what work continued. Never request or echo a secret in a public surface.

## Definition of Done

Do not mark this Goal complete until all of the following are true:

- all eight P0/R0 roadmap items are honestly `Done` and their existing issues are closed through the reviewed evidence-gated transition path;
- `AUD-001`, `PC-001`, and `PRD-R0-001` retain their narrow historical planning/audit evidence and `Historical non-authorizing` execution decision; they are never portrayed as executed implementation;
- `SPK-R0-001`, `UX-R0-001`, `ARCH-R0-001`, `ENG-R0-001`, and `REL-R0-001` each have the named exact-candidate executed evidence, independent QA, five-seat no-veto review, and honest terminal state;
- all 11 R0 requirement IDs have requirement-level executed R0 acceptance evidence, while the 67 excluded requirements remain explicitly visible and traceable but absent from implementation and acceptance under this Goal;
- `REL-R0-001` records `Proceed`; `Hold` or `Rollback` is not completion;
- the R0 synthetic private shell is tied to merged `main`, an immutable build digest, dependency inventory/SBOM, reviewed reversible migrations, and a reproducible sanitized deployment record;
- CI covers the actual R0 shell and control risk surface, not only prototypes and governance tools;
- zero unresolved severity-1/2 defects and zero unresolved critical/high security or privacy findings remain;
- R0 access/denial, callback isolation, secret scan, authenticated ciphertext/wrong-key behavior, logs/caches, data integrity, capacity, health, failure isolation, restart, and co-resident non-regression pass;
- the complete R0 accessibility/browser/responsive matrix passes;
- every R0 persistent shape has inventory, encrypted backup, executed separate-path restore, lifecycle/deletion, migration, restart, and rollback evidence, with measured recovery compared to the four-hour R0 target;
- no authentic journal, photo, audio, transcript, or other personal-memory content was admitted or processed; the only real authentication assertion was handled solely by the authorized R0 target under the narrow rule above and left only sanitized evidence;
- every P0/R0 owner action due for an executed stage was satisfied at its exact gate; a conditional action that was not due retains its valid global ledger state and is not counted as satisfied, and no R1-R10 owner action was requested, changed, or satisfied;
- all 50 R1-R10 tasks match the activation freeze exactly on task-artifact bytes/states, issue/Project values, approvals, readiness, evidence, and authored/user-visible semantics, remain unstarted by this Goal, and have `executionAllowed=false`; only a deterministic provenance change in a shared aggregate projection or freeze-control record may differ;
- every completed R0 stage is closed and non-replayable, all eight in-scope tasks end with `executionAllowed=false`, retained approvals are evidence only, and no Goal-scoped private mutation authority remains active;
- manifest, Markdown plan, 58 issues, milestones, 17 managed Project fields, views, issue map, workbook, Wiki, Page Audit, running-log mechanism, and terminal-evidence PR reconcile with zero unexplained mismatch, including the separately evidenced UI-managed Status/Roadmap settings;
- all released links resolve on remote `main`, all Wiki links/fragments resolve, and the Wiki Page Audit names the exact source SHA;
- final immediate and quiescent live verifiers pass and their sanitized evidence is retained;
- no Goal-owned temporary runner, lock, session, schedule, or credential remains active, and no continuing monitor was created;
- README, INDEX, SECURITY, PUBLICATION, R0 architecture/release evidence, Project summary, and Wiki Home use only directly evidenced P0/R0 language and do not claim Phase 1, authentic-memory, launch, or production completion;
- the durable terminal evidence contains the exact bounded completion statement, the Codex Goal is marked complete, and no R1-R10 successor task was selected, prepared, or proposed within this Goal; and
- no Goal-owned or unexplained worktree diff remains, source and Wiki are normally published, and no secret, private artifact, authentic content, or unexplained state remains in the public repository, worktree, tool/chat output, or another unapproved channel. Approved raw private evidence remains only in its named access-controlled custody under the recorded owner, retention, and disposal policy; do not delete, move, or expose it without exact authority. Pre-existing user changes must remain untouched and be reported explicitly; never clean, stash, absorb, or discard them to satisfy this condition.

If any item is missing, the Goal is not complete.

## First actions

Begin immediately without asking for routine approval:

1. run the protected identity/remote/attached-branch checks and classify the worktree without emitting paths or diffs;
2. if the exact pending three-file package exists, execute only the Activation Bootstrap protocol, publish it through one normal reviewed PR, and keep Stage 0, the Council, the running log, projections, private access, and P0/R0 work dormant;
3. after merge—or immediately if the package was already merged—require the same worktree to be fully clean, fetch `origin`, switch or create a fresh attached `codex/*` execution branch at exact `origin/main`, and rerun the strict clean activation gate from its first check;
4. if that gate fails, preserve state and report **Activation Bootstrap published; P0/R0 not activated**; if it passes, confirm the merged prompt/navigation and perform read-only live GitHub/Wiki checks;
5. read the mandatory context in full and record a source precedence/current-state digest;
6. create the five-seat Product Council and obtain independent review of the repair plan;
7. invoke `codex-project-running-log`, read the latest entry, and append the continuation-start correction with the bootstrap PR provenance after the context digest and council are established;
8. derive the current owner-action inventory, then consider only `P0-OA-001`, `P0-OA-002` if its exact boundary is encountered, `R0-OA-001`, and `R0-OA-002` if actually applicable; request only a due minimum action and do not request or alter a later-release action;
9. use the one-time Stage 0 bootstrap authority to design, review, test, and normally merge the two-phase readiness model, successor control-review path, running-log descendant/evidence mechanism, staged runtime, and evidence-gated delivery-status transition control;
10. repair and regression-test the stale INDEX/Wiki self-reference, two broken anchors, stale PC-001 readiness blockers, missing terminal log state, and durable verifier-retention mechanism;
11. publish and verify the complete Stage 0 repair through normal source, projection, and Wiki flows without creating a self-reference loop;
12. pass Gate A for `SPK-R0-001` stage `local-synthetic/synthetic-foundation`, prepare its local synthetic candidate/evidence, and use Gate B only for the exact later R0 action;
13. complete `SPK-R0-001`, then `UX-R0-001` and `ARCH-R0-001`, then `ENG-R0-001`, then `REL-R0-001`, using dependency evidence rather than status labels alone; and
14. after `REL-R0-001` records `Proceed`, perform the bounded reconciliation, publish the exact terminal statement, mark this Goal complete, and stop before any R1 action.
