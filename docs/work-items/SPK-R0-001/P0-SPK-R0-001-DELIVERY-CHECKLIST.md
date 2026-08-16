# SPK-R0-001 — task delivery checklist

- **Task ID:** `SPK-R0-001`
- **Artifact kind:** `delivery`
- **Artifact state:** `in-review`
- **Roadmap status:** `In progress`
- **Milestone:** `R0`
- **Execution allowed:** `false`
- **Evidence boundary:** This file itself authorizes no candidate authoring, test run, task-stage execution, private or external access, deployment, acceptance, task-status change, release, or production use. Only a later accepted Gate A record may permit bounded implementation-candidate authoring and independent local-synthetic candidate QA as preparation evidence; task-stage invocation still requires Gate B.
- **Immutable snapshot rule:** These proposal bytes remain `in-review` and `executionAllowed=false` after publication. Current Gate A state, if it later changes, exists only in the append-only preparation registry plus exact-main immutable-history replay and must never be inferred from this frozen file.

## Exact proposal binding

- **Preparation review:** `P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION`
- **Intended later stage:** `P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION`
- **Scope/action pair:** `local-synthetic` / `synthetic-foundation`
- **Task-contract SHA-256:** `f58e65c56e58dc4b1e12deab68f7349822f7f95dd33eee4fcd4872243170fa23`
- **Dependency:** `PC-001`; the Gate A input must carry exactly one passing evidence record with reference `github-pr:pull-70`.
- **Requirement IDs:** `LID-SCP-001`, `LID-OPS-001`, `LID-OPS-002`, `LID-OPS-003`, `LID-OPS-004`, `LID-OPS-008`, `LID-OPS-011`, `LID-OPS-012`, `LID-OPS-014`, `LID-OPS-016`, `LID-OPS-018`
- **Scenario IDs:** `SPK-R0-001-P-001`, `SPK-R0-001-P-002`, `SPK-R0-001-P-003`, `SPK-R0-001-T-001`, `SPK-R0-001-T-002`, `SPK-R0-001-T-003`, `SPK-R0-001-D-001`, `SPK-R0-001-D-002`, `SPK-R0-001-D-003`, `SPK-R0-001-QA-001`, `SPK-R0-001-QA-002`, `SPK-R0-001-QA-003`, `SPK-R0-001-QA-004`, `SPK-R0-001-QA-005`, `SPK-R0-001-QA-006`

The proposal does not persist a stage sequence or predecessor receipt. Those are Gate B-only bindings for a later implementation-and-evidence candidate.

## Canonical tracking held stable

- **GitHub issue:** [#4](https://github.com/arunpr614/Life-Reflection/issues/4)
- **GitHub Project:** [Phase 1 Delivery Project](https://github.com/users/arunpr614/projects/1)
- **Manifest task:** [SPK-R0-001](../../project/PHASE1-ROADMAP-MANIFEST.json)
- **Artifact register:** [P0 task artifact register](../../project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json)
- **Status:** remains `In progress`; issue state, Project Status, labels, milestone, dates, and all other task semantics remain unchanged.
- **Live synchronization:** none in the proposal sequence. No issue, Project, Wiki, private system, provider, or deployment mutation is authorized.

## Exact proposal publication sequence

1. **C1 — immutable proposal candidate.** Its parent is the exact selected current `main`. It modifies only the six existing `SPK-R0-001` Product, Architecture, Design, QA, Delivery, and Council artifacts, each as an ordinary regular `100644` blob. The diff contains no add, delete, rename, type change, or mode change. The commit ends with exactly one final `P0-Proposal-Author-Id: codex-primary-integrator-01` trailer paragraph.
2. **C2 — canonical projection child.** It directly parents C1, preserves all six C1 blobs byte-for-byte, and modifies only `docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json`, `docs/project/PHASE1-ROADMAP-MANIFEST.json`, and `outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx` through the deterministic generators and reviewed workbook builder. `docs/project/PHASE1-RELEASE-PLAN.md` must also be regenerated and remain byte-identical, so it is not a C2 diff path.
3. **M — normal proposal publication.** Merge C2 normally with exactly two parents: the still-current selected `main` first and C2 second. Its tree must equal C2 and its first-parent delta must be exactly the six proposal artifacts plus three projections. No squash, rebase, update-branch, conflict-resolution delta, octopus merge, or intervening main commit is compatible.
4. **External review.** After M is exact current main, obtain six artifact reviews—using five reviewer identities because the registered Project reviewer covers both Delivery and Council—and five distinct Council-seat reviews. Each artifact or seat attestation directly binds only its canonical payload fields described in the Council artifact; the complete stored and replayed Gate A proof separately binds C1, all exact artifact bytes/reviews, the raw dossier digest, task contract, dependency and author evidence, safety input, decision/veto/blocker arrays, reviewer registry, and all five seats.
5. **P and PM — preparation record publication.** Only after every exact-candidate review passes may one registry-only P commit directly parent M and append `P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION`. PM must be a normal merge with exactly two parents: still-current M first and P second; its tree must equal P, its first-parent delta must be only the registry append, and no intervening main commit, squash, rebase, update-branch, conflict delta, or octopus merge is compatible. The registry record must replay to `Ready to prepare — Gate A`, `preparationAllowed=true`, and `executionAllowed=false` from exact main.

`RUNNING_LOG.md` is not part of C1 or C2. A later evidence-only append may record the published result without changing Gate A, task status, authority, or permission.

The deterministic generators, workbook build, review, CI, and guarded Git publication named above are control-plane governance operations authorized, if at all, by the active bounded Goal and repository controls. They are not the `SPK-R0-001` task-stage action represented by `executionAllowed`, and they do not satisfy Gate A safety evidence or imply that candidate QA or the stage ran.

## C1 closed path set

- `docs/work-items/SPK-R0-001/P0-SPK-R0-001-PRD.md`
- `docs/work-items/SPK-R0-001/P0-SPK-R0-001-TECHNICAL-PLAN.md`
- `docs/work-items/SPK-R0-001/P0-SPK-R0-001-DESIGN-SPEC.md`
- `docs/work-items/SPK-R0-001/P0-SPK-R0-001-QA-PLAN.md`
- `docs/work-items/SPK-R0-001/P0-SPK-R0-001-DELIVERY-CHECKLIST.md`
- `docs/work-items/SPK-R0-001/P0-SPK-R0-001-COUNCIL-READINESS.md`

C1 adds no implementation, test-result, executed-evidence, migration, infrastructure, configuration, module-map, action-map, callback-map, verifier-map, credential, private-host, or deployment file.

## Review and generation checks

- [ ] C1 is exactly six modified regular `100644` blobs and its final author trailer is canonical and unambiguous.
- [ ] All six artifacts have one canonical `in-review` marker and contain only fictional, public, local proposal material.
- [ ] C2 is the direct child of C1 and changes exactly the three canonical projections; the regenerated Markdown release plan is byte-identical.
- [ ] Both generators are run twice and produce byte-stable projections without `--refresh-drafts`.
- [ ] Workbook review covers all seven sheets, 58 issue URLs, 12 releases, 78 requirements, all R10 date blanks, formula safety, visible manifest binding, copy-hash equality, and full paginated renders.
- [ ] The resulting projection remains 58 `Incomplete`, 0 `Ready`, 0 execution-allowed, with production action/module/callback/outcome-verifier maps empty and delivery apply disabled.
- [ ] All six C1 blobs are unchanged in C2, M, P, and PM.
- [ ] Exact candidate, dependency, author, reviewer-registry, task-contract, and attestation bindings replay through the immutable-history verifier before Gate A is accepted.

## Stop conditions

Stop without publication if selected `main` moves; any path falls outside the exact C1 or C2 set; an artifact is added/deleted/renamed or changes type/mode; a generator rewrites a C1 file; a claim relies on private or authentic evidence; any proposal decision, specialist veto, dependency failure, privacy/safety concern, or reviewer conflict remains; or any check requires broadening the stage, task, milestone, or R1–R10 scope.

## Owner-action boundary

No owner action is due for this `local-synthetic/synthetic-foundation` Gate A proposal. `P0-OA-001`, `R0-OA-001`, and `R0-OA-002` remain pending future gates and cannot be inferred, requested, or satisfied here. Private authority is not required and is not granted.

## Project Manager disposition

**In review / Hold for exact-candidate attestations.** The publication sequence is frozen for a preparation-only proposal. No delivery transition, substantive work, or execution may begin unless the later immutable preparation record passes Gate A from exact current main.
