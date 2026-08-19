# P0/R0 supervisor-agent operating model and completion strategy

Created: 2026-08-18 23:48 IST

Revised: 2026-08-19 IST — added the mandatory four-hour assignment lease and successor-agent handoff protocol

Status: **strategy and retrospective only; this document does not resume the paused P0/R0 Goal, authorize Jira mutation, grant private access, or authorize deployment**

Reviewed boundary: Life in Days Phase 1 at repository main revision **a37627db87cae23c7d89503d26fb06d77c21efb0**, merged through [PR #114](https://github.com/arunpr614/Life-Reflection/pull/114), plus read-only GitHub, Project, Wiki, and workbook checks performed on 2026-08-18.

Audience: the Product Owner and the next persistent supervisor agent responsible for finishing the bounded P0/R0 Goal without starting R1-R10.

## Executive summary

The proposed supervisor, worker, verifier, and Jira-manager model is the right direction, with important changes.

The previous agent did not fail because it was careless. It preserved privacy, scope, history, and evidence boundaries unusually well. It failed at delivery efficiency: it built and repeatedly repaired a large control system before proving that the candidate-QA protocol had a complete, acyclic, executable path. After 41 first-parent merges beyond the Gold Goal, candidate QA still could not start truthfully.

The project is now paused at a precise and safe boundary:

- the public repository is on current main **a37627d...**;
- all 58 GitHub issue-backed roadmap items reconcile with the manifest;
- **SPK-R0-001** remains open, In progress, Incomplete, Hold, and execution-disallowed;
- no candidate-QA bundle, Gate B approval, governed task execution, private-host proof, deployment, restore, rollback, release, or production evidence exists;
- all 50 R1-R10 tasks remain frozen; and
- the merged v1 candidate-QA contract is semantically unsatisfiable and must not be run as if it could pass.

The recommended model is a **persistent supervisor plus ephemeral task cell**:

1. One supervisor owns integration, task selection, authority checks, evidence reconciliation, and the clean integration worktree.
2. One fresh worker implements one bounded task in a separate worktree.
3. One fresh independent verifier defines the oracle before implementation is frozen, then verifies the exact candidate and post-deployment state.
4. One short-lived Jira manager creates or reconciles the task ticket idempotently only after a project-specific Jira connector, schema, identity map, and authority have been accepted.
5. Five distinct Council reviewers are created in bounded review waves when the governing task gate requires them.
6. The supervisor parks completed agent turns without consuming an active slot, preserves their durable receipts, and formally closes the worker, verifier, and Jira-manager sessions only after the task is fully reconciled.
7. Every supervisor, worker, verifier, Jira-manager, Council, release-operator, or research-helper assignment has a nonrenewable four-hour wall-clock lease. If its bounded slice will not finish safely inside that lease, the supervisor must package a handoff and create a fresh successor agent.

The supervisor should be in charge of the main integration tree, but should not develop directly on main. Routine direct pushes to main remain prohibited because they can bypass the frozen-candidate, independent-QA, required-check, rollback, and reconciliation sequence. Main ownership means integration authority, not unrestricted editing authority.

Jira should not become a second source of truth. The canonical Task ID and repository manifest remain authoritative; GitHub, Excel, Wiki, and Jira **after adoption** are synchronized projections. No Jira site, project key, workflow, field mapping, or mutation authority currently exists in this repository, so Jira adoption needs a one-time bootstrap before any issue is created.

### Executive verdict

**Conditional GO for the operating model. NO-GO for immediate execution.** Before the new supervisor starts implementation, the Product Owner must explicitly resume the paused Goal and choose **simplify before salvage**. The supervisor must first repair and authorize the currently disabled delivery-transition apply path, and the first task cell must prove a minimal producer-to-independent-verifier vertical slice in disposable fixtures before another evidence contract is frozen or published.

## 1. Evidence inspected

### Repository and governance

- [AI agent operating contract](../../AGENTS.md)
- [Document index](../INDEX.md)
- [Bounded P0/R0 Gold Goal](P0-CODEX-GOLD-GOAL-PROMPT-P0-R0-ONLY-2026-08-15.md)
- [Paused-work handover](P0-R0-PAUSED-WORK-HANDOVER-2026-08-18.md)
- [Execution retrospective](P0-R0-EXECUTION-RETROSPECTIVE-2026-08-18.md)
- [Task Definition of Ready](../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [Owner action ledger](../council/execution/P0-OWNER-ACTION-LEDGER.md)
- [Canonical roadmap manifest](PHASE1-ROADMAP-MANIFEST.json)
- [GitHub Project sync contract](PHASE1-GITHUB-PROJECT-SYNC.md)
- [Append-only running log](../../RUNNING_LOG.md)

### Live and generated surfaces

- [Life-Reflection repository](https://github.com/arunpr614/Life-Reflection)
- [PR #114](https://github.com/arunpr614/Life-Reflection/pull/114)
- [SPK-R0-001 issue #4](https://github.com/arunpr614/Life-Reflection/issues/4)
- [Life Reflection Project #1](https://github.com/users/arunpr614/projects/1)
- [Wiki Page Audit](https://github.com/arunpr614/Life-Reflection/wiki/Page-Audit)
- [Canonical Excel release plan](../../outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx)

### Verification performed for this strategy

- Pre-authoring local snapshot was clean at **HEAD == origin/main == a37627d...**; this report and its index edit intentionally make the current checkout dirty until separately reviewed and published.
- Read-only GitHub verifier: 58 issue items, 56 PR items, status distribution 40 Backlog / 4 Next / 1 In progress / 13 Done, zero mismatches, and 50/50 frozen-scope parity.
- Current repository: 58 Phase 1 issues, 45 open and 13 closed.
- Current private Project: 114 raw items, including the 58 canonical issues, and 32 total fields; the managed delivery contract uses 17 fields.
- Pre-authoring worktree registry: 59 entries, 47 clean, 11 dirty, and one missing/prunable registration. Recount at resume/publication; authoring this report adds one dirty worktree to that snapshot.
- Branch protection: admin enforcement and two required checks are enabled; required pull-request review is not configured.
- Workbook: seven sheets, no detected formula-error tokens, and embedded source-manifest digest **e312399a...**, matching the raw current manifest.
- Wiki: master **10c2350...** represents repository source **6b8b70b...**, which is 82 commits behind current main; current main has 464 Markdown files while the Wiki audit maps 456.
- Jira: no site, project key, issue map, workflow mapping, field IDs, or Jira mutation contract exists in the repository.

These checks prove control-surface state only. They do not prove implementation, deployment, restore, release, or production readiness.

## 2. Where the previous agent left the project

### 2.1 Published work

The previous agent published the bounded Goal, repaired the Stage 0 control plane, established Gate A preparation controls, published six SPK task artifacts, created a non-authorizing runtime seed, repaired validators and output-path contracts, and finally merged a candidate-QA contract plus synthetic module through PR #113.

PR #114 then published the handover, retrospective, and append-only pause record. Current main is therefore a truthful, durable pause state rather than an abandoned private checkout.

### 2.2 Exact stopping point

Candidate QA was stopped **before invocation**. The module was not run for candidate QA and no three-file QA bundle exists. The reasons are semantic:

1. **Current-evidence/no-egress conflict.** The contract requires a fresh external GitHub dependency check during the QA interval while also claiming a singular no-egress environment. It defines neither separate acquisition/execution environments nor a sealed offline freshness capsule.
2. **Circular finalization.** The retained-artifact scan must include a final attestation whose bytes depend on already-final receipt and index hashes. The contract has no acyclic projection or finalization order.
3. **Unfrozen orchestration.** It does not freeze one complete harness, ordered command plan, repetition count, isolation mechanism, or every digest domain.

Running the v1 procedure would either fail or require false evidence. The prior agent correctly chose Hold.

### 2.3 Current task truth

| Task group | Current truth |
| --- | --- |
| Historical P0/planning | AUD-001, PC-001, and PRD-R0-001 are roadmap Done only for their named planning artifacts; all remain Historical non-authorizing. |
| Active spike | SPK-R0-001 is In progress, Incomplete, Hold, open, and execution-disallowed. |
| Remaining R0 | UX-R0-001, ARCH-R0-001, ENG-R0-001, and REL-R0-001 are Next, Incomplete, Hold, and execution-disallowed. |
| Later releases | All 50 R1-R10 tasks and 300 artifacts remain frozen. |
| Private/runtime | Unknown — private read authority pending. |
| Authentic data | No authentic journal, photo, or photo-derived data is authorized. |

### 2.4 Projection truth and drift

The GitHub projection is byte/field consistent with the generated manifest, but the canonical projection itself is semantically behind the real blocker. Issue #4 still presents generic task-review blockers instead of clearly naming candidate-QA protocol satisfiability.

Other current drift:

- AGENTS.md still describes the bounded Goal/Stage 0 as currently active; that mandatory contract must be reconciled atomically with the pause/resume decision before task work;
- README still frames Gate A as a future lane;
- before this strategy change, the document index still contained stale stage-registry wording and omitted the pause handover and retrospective; this local change corrects those entries but is not merged or published;
- the Wiki is 82 commits behind current main and omits the pause package and newer control records; and
- the workbook matches the current manifest digest, but therefore inherits the manifest's conservative semantic lag.

The next supervisor must distinguish **projection parity** from **projection usefulness**. Zero GitHub mismatches does not mean the task summary communicates the latest substantive blocker.

### 2.5 Preserved local state

The pre-authoring registry contained 59 worktrees: 47 clean, 11 dirty, and one missing/prunable. This report/index edit makes the reviewed current checkout the twelfth dirty entry until publication. Preserved local items include an interrupted recap, two incomplete candidate-QA tool prototypes, and an incomplete v2 contract draft. None is an approved continuation candidate; recount at resume.

The sole open GitHub pull request is obsolete draft [PR #86](https://github.com/arunpr614/Life-Reflection/pull/86), with a failed immutable-workflow guard. It must be classified and handled deliberately; it must not be merged as the continuation path.

## 3. Retrospective: what the previous agent did well

### 3.1 Truth preservation

- It did not turn a retry into a rewritten success history.
- It separated planning, code publication, candidate QA, Gate B, governed execution, deployment, acceptance, and production.
- It did not claim private-host, restore, rollback, or production evidence that did not exist.
- It recorded the pause as a durable handover rather than silently abandoning state.

### 3.2 Privacy and scope containment

- No authentic memory, photo, photo-derived data, secret, or raw private response entered public artifacts.
- R1-R10 remained frozen.
- Human-only authority was left pending rather than simulated by agent-generated attestations.

### 3.3 Independent review caught real defects

Independent reviewers found projection drift, topology errors, missing byte bindings, output-path conflicts, evidence-schema mismatches, and the final unsatisfiable protocol. The correct conclusion is not to remove independent review; it is to invoke it earlier and against the full protocol rather than use it as a late serial checksum service.

### 3.4 Recoverability

Normal merge commits, candidate identities, append-only corrections, and preserved worktrees make forensic reconstruction possible. That is valuable for a private data product where false deployment or recovery claims would be dangerous.

## 4. Retrospective: what must change

### P0 — the protocol lacked a demonstrably satisfiable success path

**Evidence:** the merged v1 contract has the three semantic blockers above, and candidate QA never ran.

**Impact:** no amount of additional publication ceremony can complete SPK-R0-001 while the evidence graph is contradictory.

**Required change:** model the entire writers/readers/finalization graph, build one disposable producer, and have an independently implemented verifier accept the same fictional bundle before freezing another contract.

### P1 — the control plane became the product

The retrospective measured 41 first-parent merges, 93 commits, 86 touched files, approximately 52,027 added lines, and no candidate-QA execution. Controls were repeatedly expanded to prove other controls.

**Required change:** impose hard PR, time, worktree, artifact, and repeated-repair budgets. Every task wave must demonstrate executable or acceptance evidence, not merely more governance.

### P1 — independent verification occurred too late

Reviewers often checked exact payloads only after interfaces were frozen. This caught defects but forced expensive protected repair waves.

**Required change:** the verifier writes the test oracle and protocol-DAG challenge before the worker freezes a candidate. The verifier then evaluates the exact frozen SHA independently.

### P1 — worktree proliferation created integration risk

The current registry has 59 worktrees. The integration cost of finding a clean, current, correctly authorized branch became a major task.

**Required change:** cap active worktrees at five. Preserve existing evidence, but classify every worktree as Active, Evidence-preserved, Superseded, or Removable-with-owner-approval.

### P1 — living documentation was not closed with each wave

GitHub is currently reconciled, but Wiki and human-facing navigation lag. The Wiki source is 82 commits behind main.

**Required change:** make living-surface reconciliation a terminal task-cell gate, not a later cleanup. A task is not closed while GitHub, Excel, Wiki, and the running log disagree or omit the latest accepted blocker/evidence; Jira joins that invariant only after explicit adoption.

### P1 — branch protection does not enforce independent approval

Main requires two checks and enforces them for admins, but no required pull-request review rule is configured.

**Required change:** the supervisor operating contract must treat an exact-candidate verifier receipt as mandatory even when GitHub technically permits merge. Optionally add a repository rule after separate authorization; do not assume current protection enforces QA independence.

### P2 — Jira is currently undefined

No Jira target or mapping exists. Creating tickets now would invent a second, ungoverned task system.

**Required change:** bootstrap Jira deliberately as a downstream projection, pilot only SPK-R0-001, and add it to the repository's living-document contract only after idempotence and reconciliation are proven.

## 5. Evaluation of the proposed idea

| Proposed idea | Keep | Improve |
| --- | --- | --- |
| One highly capable supervisor | Yes | Make it an integration and evidence controller, not the primary coder or self-approver. |
| Supervisor owns the main Git tree | Yes | Interpret ownership as maintaining a clean exact-main integration worktree and serializing merges; workers never code there. |
| Fresh worker for each task | Yes | Give it a bounded TaskRun package, separate worktree, explicit allowed actions, and no merge authority. |
| Four-hour maximum per agent assignment | Yes | Scope a complete, independently verifiable TaskRun slice to at most four wall-clock hours; use a fresh successor assignment rather than extending or silently resuming the same agent. |
| Fresh verifier/QA for each task | Yes | Start it before freeze to define the oracle; prohibit it from fixing the candidate it judges. |
| Jira-management sub-agent | Yes, after bootstrap | Keep it short-lived and idempotent; Jira mirrors canonical Task IDs and never decides status or scope. |
| Worker performs end-to-end development and production deployment | Partially | Development can be end to end; deployment needs a later, separately authorized privilege envelope and is not applicable to every task. R0 deployment is synthetic-only, not product launch. |
| Close worker and verifier when task completes | Yes | Close only after durable receipts, projection reconciliation, credential revocation, and worktree disposition are recorded. |
| Create new worker/verifier for next task | Yes | Recompute context from current merged main; never inherit stale candidate assumptions. |
| Supervisor creates tasks | Yes for TaskRuns | Do not create a new canonical roadmap task or 59th GitHub issue. Select one of the existing eight P0/R0 tasks unless the Product Owner explicitly approves a scope change. |

## 6. Recommended authority and source-of-truth order

| Rank | Surface | Role |
| ---: | --- | --- |
| 1 | Direct Product Owner instruction and human-only evidence | Scope, pause/resume, private authority, spend/terms, authentic data, final human actions. |
| 2 | Governing PRD, design, architecture, Council decisions, owner-action ledger | Product and execution authority. |
| 3 | Task evidence, approval records, exact Git candidates, and non-authorizing TaskRun receipts | What was actually proposed, tested, verified, merged, deployed, restored, or rolled back. TaskRun state never grants authority and remains subordinate to governing sources and approval records. |
| 4 | PHASE1-ROADMAP-MANIFEST.json | Canonical machine-readable delivery projection. |
| 5 | GitHub issues and Project | Primary public delivery visualization. |
| 6 | Jira | Internal orchestration projection after bootstrap; never independent authority. |
| 7 | Excel release plan | Review and planning projection. |
| 8 | Wiki | Published documentation projection from exact merged main. |
| 9 | RUNNING_LOG.md | Append-only chronology and handoff, not an authorization source. |

When projections conflict, repair the authoritative source and regenerate. Never resolve a Jira/GitHub/Excel/Wiki mismatch by editing only the projection.

## 7. Operating-model topology

~~~mermaid
flowchart TD
    PO["Product Owner and human-only gates"] --> S["Persistent Supervisor Agent"]
    S --> L["Immutable TaskRun context plus append-only event ledger"]
    L --> J["Ephemeral Jira Manager"]
    L --> W["Fresh Worker Agent"]
    L --> V["Fresh Independent Verifier"]
    L --> C["Distinct Council reviewer waves"]
    W --> B["Task branch and worker worktree"]
    V --> F["Frozen candidate verification worktree"]
    J --> JP["Jira projection"]
    B --> PR["Reviewed pull request"]
    F --> PR
    C --> PR
    PR --> S
    S --> M["Protected main integration"]
    M --> G["Gate B approval and exact-main runtime permission"]
    G --> D["Separately authorized deployment envelope"]
    D --> PV["Independent post-deployment verification"]
    PV --> R["GitHub, Excel, Wiki, log, and adopted-Jira reconciliation"]
    R --> X["Close task cell and revoke temporary access"]
    X --> N["Select next dependency-valid P0/R0 task"]
~~~

Only one task cell may be in merge or deployment at a time.

## 8. Agent role contracts

### 8.1 Persistent supervisor

Responsible for:

- refreshing live state and selecting the next dependency-valid task;
- maintaining the single clean integration worktree;
- creating the immutable TaskRun package and role overlays;
- creating and closing task agents;
- scoping, timing, forecasting, and enforcing every four-hour assignment lease and successor handoff;
- enforcing scope, authority, privacy, complexity budgets, and stop conditions;
- freezing candidates and preventing further worker mutation;
- obtaining independent QA and required Council decisions;
- normal PR merge and postmerge validation;
- enabling and using only a separately reviewed delivery-transition mechanism;
- requiring exact-stage Gate B approval and exact-main runtime permission before any governed private action;
- granting a separate deployment envelope only when authorized;
- reconciling GitHub, Excel, Wiki, RUNNING_LOG, and Jira when adopted; and
- producing the final P0/R0 handoff and stopping before R1.

Must not:

- implement feature code in the integration worktree;
- approve its own candidate;
- override a verifier Hold;
- create a new canonical task to bypass a hard problem;
- fabricate Product Owner, private-host, MFA, credential, terms, spend, or authentic-data authority; or
- start R1-R10.

### 8.2 Worker

Responsible for:

- implementing its bounded assignment slice end to end in the task worktree;
- running focused tests and producing public-safe evidence;
- updating governing sources and generated local projections required by the task;
- preparing migration, backup, restore, rollback, and deployment evidence where applicable;
- fixing verifier findings in a new candidate; and
- returning a structured completion or blocker receipt.

Must not:

- merge to main;
- declare its own work verified or Done;
- edit Jira independently;
- use production/private credentials before a separate authority envelope;
- use authentic memories or photos; or
- retain access after task-cell closure.

### 8.3 Independent verifier / QA

Responsible for:

- challenging the task contract before implementation freeze;
- defining an objective verification matrix and falsification cases;
- checking that every required claim can be true simultaneously;
- verifying the exact frozen candidate in a separate clean worktree;
- reproducing tests rather than trusting worker summaries;
- validating deployed identity and post-deployment behavior when applicable; and
- issuing only Pass or Hold with evidence and limitations.

Must not:

- fix the candidate it judges;
- accept a moving SHA;
- rely solely on worker-created evidence;
- weaken acceptance criteria after seeing a failure; or
- let a green CI run substitute for missing task evidence.

### 8.4 Jira manager

Responsible for:

- discovering the approved Jira schema and permissions;
- create-or-update by exact Task ID;
- producing a field-level dry-run;
- read-after-write verification;
- linking GitHub, requirements, artifacts, PRs, QA, deployment, and rollback evidence; and
- returning a sanitized Jira reconciliation receipt.

Must not:

- choose scope or status;
- create an ad-hoc delivery task without a canonical Task ID;
- close a ticket because a worker or PR says complete;
- store secrets, private topology, authentic content, raw private evidence, or private/signed evidence URLs;
- delete or silently repair duplicates; or
- touch R1-R10 under the bounded Goal.

### 8.5 Council reviewers

Use five distinct registry-bound reviewer identities for Product, UI/UX, Architecture, Independent QA, and Project/Delivery decisions when required. The task verifier is the Independent-QA Council identity by default; if it cannot satisfy that registry-bound role, close it after its receipt and create a distinct Independent-QA reviewer. They may execute in sequential waves because concurrency is limited, but the supervisor may not impersonate a seat or reuse a stale exact-candidate attestation.

## 9. Four-slot scheduling model

The current agent runtime has four concurrent slots including the supervisor. Do not attempt to keep every role alive at once.

| Wave | Active agents | Result |
| --- | --- | --- |
| Registration | Supervisor + Jira manager | Jira mapping/create-or-update receipt when adopted or for the exact pilot when pilot-authorized; close or park Jira manager. |
| Oracle | Supervisor + verifier | Verifier-authored oracle v1 and pre-implementation protocol challenge. |
| Proposal | Supervisor + proposal-only worker + verifier | Worker prepares only the task's Product/Design/Architecture/QA/Delivery/Council proposal artifacts; no substantive implementation. |
| Gate A wave 1 | Supervisor + verifier/Independent-QA seat + two distinct reviewers; proposal worker parked | First three of five proposal verdicts. |
| Gate A wave 2 | Supervisor + verifier/Independent-QA seat + the remaining two distinct reviewers; proposal worker parked | All five proposal verdicts; Hold returns to proposal remediation, Pass unlocks Build. |
| Build | Supervisor + worker + verifier | Worker implements; verifier checks only contract drift and does not co-author the solution. |
| Frozen QA | Supervisor + verifier; worker parked after immutable handoff | Exact-candidate Pass or Hold. A Hold creates a fresh worker iteration and candidate identity. |
| Council wave 1 | Supervisor + verifier/Independent-QA seat + two distinct reviewers | Three of five identities captured, including Independent QA. |
| Council wave 2 | Supervisor + verifier/Independent-QA seat + the remaining two distinct reviewers | All five exact-candidate verdicts captured. |
| Integration | Supervisor | PR/check/merge serialization and postmerge verification. |
| Deployment | Supervisor + worker or fresh release operator + verifier | Separate authority envelope, deploy/rollback, independent verification. |
| Closure | Supervisor + Jira manager when adopted or resolving a pilot | Reconcile adopted Jira, or require the owner to resolve `pilot-authorized` to `adopted` or `not-adopted`; then close Jira manager and task cell. |

The proposal-only worker becomes the implementation worker after Gate A Pass because it is not a reviewer; if Gate A returns Hold, it may repair only the proposal under the same iteration. Substantive code before Gate A Pass invalidates the run. An agent that has returned a durable receipt is parked and must not run tools; it does not occupy an active concurrency turn. If the runtime counts parked sessions against capacity, terminate the session and rehydrate only from the immutable context and receipts. The Jira manager is a durable **function**, not a permanently occupied slot. Its state comes from the approved Jira mapping and append-only TaskRun events, never from agent memory. Jira participation is governed by an owner-controlled, validator-backed decision record such as `docs/project/P0-PHASE1-JIRA-PROJECTION-DECISION.json`, with exactly three states: `not-adopted`, `pilot-authorized`, and `adopted`. Only a direct Product Owner decision published through a reviewed PR may change it; a TaskRun event, Jira receipt, worker, or supervisor inference cannot. `pilot-authorized` is transient: after independent pilot verification, the Product Owner must publish either `adopted` or `not-adopted` before the canonical task may close.

Supervisor succession has priority over a full review wave. At the T+180 supervisor forecast, do not begin a wave that would consume all four slots past the handoff reserve. If succession is required, park at least one non-supervisor agent after its durable receipt, create the successor supervisor, complete the fenced writer transfer, then rehydrate the parked role. No Council or QA verdict may be issued while supervisor ownership is ambiguous.

### 9.1 Mandatory four-hour assignment lease

This is a hard execution rule for every supervisor epoch and every worker, verifier, Jira-manager, Council-reviewer, release-operator, or research-helper assignment.

For this rule, a **task picked up by an agent** means the exact assignment slice dispatched to that agent, not the larger canonical GitHub/Jira roadmap item. The supervisor must never hand an agent an undivided canonical task that cannot be completed safely within four hours. A larger canonical item may advance through several independently complete, pre-chartered slices, but its finite slice count and cumulative wall-clock budget are fixed before dispatch and cannot be reset by a handoff or TaskRun iteration.

- The supervisor must define one **assignment slice** before dispatch. Its setup, context read, work, tests, evidence, cleanup, and handoff must all fit inside four wall-clock hours. The slice has an immutable slice ID, predecessors, exact output/acceptance boundary, allowed paths and effects, rollback boundary, and distinct planned next-slice ID if applicable. A planned next slice is not a successor continuation of the same slice.
- A canonical roadmap task may require several sequential assignment slices, but the complete finite slice plan and dependency order must be chartered before the first dispatch. Those slices remain under the same Task ID and TaskRun. They do not create a new GitHub issue, Jira delivery ticket, milestone, or roadmap item, and adding an unplanned slice requires a new reviewed TaskRun iteration rather than an informal extension.
- Assignment creation is three-phase. Before spawning an agent, the fenced supervisor writes `AssignmentReserved` with assignment/slice IDs, intended role, complete context/prompt digests, authority ceiling, reservation time, derived deadlines, and a short activation-expiry time. The agent is created with `fork_turns=none` or a proven equivalent and an inert wait-for-activation instruction only; it receives no parent conversation, task context, or effect authority. The platform-attested instance ID, creation time, fork mode, complete initial-context digest, and extra-context inventory are then compare-and-set into `AssignmentActivated`. The separately digest-bound real task context is delivered next, but the agent remains read-only until a platform delivery receipt plus the agent's exact digest acknowledgement are compare-and-set into `AssignmentContextAccepted`. Any inherited, unlisted, rejected, or unacknowledged context is Hold. The four-hour clock uses the earliest trusted reservation, platform-creation, activation, delivery, or dispatch timestamp and includes context reading, tool runtime, CI waiting, external waiting, retries, pauses, and blocked time. Failed activation or context acceptance expires the reservation; restarting, renaming, reconnecting, or respawning never resets the original chain's cumulative time.
- At **T+180 minutes**, the supervisor and assigned agent must make a completion forecast. If safe settlement or rollback by T+210 is not highly credible, new work stops and handoff preparation begins immediately.
- **T+210 minutes is the settlement cutoff, not the runner timeout.** Before dispatch, derive a pessimistic action duration plus cancellation/rollback reserve, an earlier `latestEffectStartAt`, and an earlier `runnerHardDeadlineAt`. No new external mutation, deployment effect, migration, or irreversible operation may begin after `latestEffectStartAt`; `runnerHardDeadlineAt` must be no later than T+210 minus the reserved cancellation/rollback duration; and by T+210 every process must be quiescent with the result verified as settled, rolled back, or formally fail-stuck behind a retained fencing lock. A fail-stuck boundary is a classified recovery state, not success; it prohibits successor effects until read-only reconciliation and recovery admission pass.
- The reducer enforces the ordering `assignmentStartedAt < latestEffectStartAt <= runnerHardDeadlineAt < settlementCutoffAt < assignmentDeadlineAt`. Any missing, equal-to-or-later invalid boundary, clock rollback, or untrusted timestamp is No-go.
- **T+210 to T+240 is reserved for validation, durable receipts, credential/lease release, and successor handoff.** At T+240 the old assignment ends. Neither the supervisor nor the agent may extend or renew the same assignment identity.
- The supervisor must not dispatch a slice or start a guarded action unless its pessimistic implementation, verification, rollback/recovery, and handoff duration fits within the remaining lease. Time pressure can never justify bypassing Gate A, Gate B, independent QA, rollback, or privacy controls.
- The project-long supervisor role may persist, but its active work is divided into four-hour supervisor epochs. If the current supervisory slice is unfinished, a fresh supervisor agent accepts the integration state and lease before the prior supervisor closes.
- A handoff does not change scope, weaken acceptance, or count as completion. The successor gets a new lease, while cumulative task/slice elapsed time and the full predecessor chain remain visible.
- One assignment slice may have at most one successor assignment, whether labeled planned, emergency, or otherwise. If that successor also cannot finish safely, the supervisor records `AssignmentRescopeRequired`, stops the slice, and creates a smaller reviewed slice plan with new slice IDs in a new TaskRun iteration. A relay chain must never be used to disguise bad scoping or bypass the four-hour rule.

Required handoff sequence:

1. Stop new effects and bring any active operation to a verified settled, rolled-back, or fail-stuck/recovery-required boundary through its governed mechanism.
2. Freeze and fingerprint the exact worktree, branch, base/current/candidate SHAs, changed paths, artifacts, and external state without exposing secrets or private values.
3. Emit an append-only `AssignmentHandoffPrepared` receipt containing TaskRun/assignment IDs, role, start/deadline/elapsed time, completed acceptance items, commands and results, evidence, open findings, external mutations, sanitized recovery-latch key/generation/state, leases/credentials disposition, rollback/recovery state, and exactly one next permitted action. A Jira-manager handoff also carries only the approved opaque/public mapping reference, immutable Jira identity, desired/observed managed-payload digests, Jira version/update timestamp, last mutation idempotency key and classified outcome, create-attempted/uncertain/partial-state flags, and fenced-lease ID/token/expiry/disposition.
4. The supervisor—or the trusted assignment coordinator during supervisor-loss recovery—writes `AssignmentReserved`, creates a **fresh agent identity** with only an inert activation instruction, binds its platform-attested identity through `AssignmentActivated`, delivers the exact context, and records `AssignmentContextAccepted` only after platform delivery plus agent digest acknowledgement. The new assignment ID and four-hour deadline retain `supersedesAssignmentId` pointing to the old assignment.
5. The successor, still read-only, independently reads the accepted immutable context and receipts, verifies the worktree and external-state fingerprints, reruns the required preflight, and returns a signed `AssignmentHandoffAccepted` receipt before changing anything. For ordinary role handoffs the active supervisor records that event; for a supervisor handoff the fenced assignment coordinator records it while atomically transferring the writer lease.
6. Only after acceptance does the supervisor close the old agent. Once `AssignmentHandoffPrepared` is emitted, the old agent is read-only and may not race the successor. For a supervisor handoff, the integration lock and sole TaskRun event-writer lease transfer atomically with acceptance; they are never held by both identities.
7. If no successor is ready by T+240, park the worktree, revoke or expire temporary authority, retain any fail-stuck lock, and permit no further mutation. Even after handoff acceptance, a fail-stuck or uncertain external state remains read-only until the successor completes reconciliation and separately passes recovery admission.

A handoff transfers verified state, not private reasoning. Raw credentials, private topology, authentic content, and raw private output remain only in approved custody; the receipt contains opaque references and sanitized results.

Every external effect also acquires an **assignment-independent recovery latch** in the approved atomic store. Its conflict-domain key is system + target + operation class; idempotency key, task/stage/assignment IDs, and attempted payload digest are attributes of that record, so choosing a different idempotency key cannot evade an existing conflict. A normal effect may compare-and-set a new latch only when its conflict domain has no active record. The latch is not released merely because an assignment, stage, Jira lease, or credential expires. A settled outcome or verified rollback may clear it through the runner. An uncertain or fail-stuck outcome retains it across supervisor/worker handoff and rejects every conflicting writer.

Recovery uses a distinct `RecoveryAdmitted` compare-and-set transition: after signed read-only reconciliation and separate recovery Gate B admission, it must expect the exact retained latch ID/generation, advance its fencing generation, and bind the new recovery stage/assignment without clearing the latch. The recovery runner accepts only that exact `RecoveryAdmitted` latch; it clears the record only after a settled recovery result or verified rollback. Missing, ambiguous, mismatched, or prematurely cleared latches are Recovery-required.

## 10. Immutable TaskRun context and append-only run ledger

Before dispatching a worker, the supervisor creates one public-safe, digest-bound **immutable context envelope**. Every agent receives the same core envelope plus a role overlay. The envelope does not change when Jira registration, candidate freeze, verification, integration, deployment, or closure occurs.

Before relying on this model, implement and independently test one durable TaskRun schema at a reviewed location such as `docs/project/task-runs/<taskRunId>/`, with P0-prefixed basenames:

- `P0-CONTEXT.json` — immutable context envelope;
- `P0-EVENTS.jsonl` — append-only, monotonically sequenced, hash-chained events with idempotency keys; and
- `P0-STATE.json` — deterministic, replaceable current-state projection rebuilt only from the context and valid events.

The active fenced supervisor is the sole TaskRun event writer. It must use atomic append, reject duplicate sequence/idempotency keys, validate the previous-event hash, and rebuild state after every append. The ledger is **non-authorizing**: it cannot change acceptance requirements, owner actions, Gate A/B approval, `executionAllowed`, or scope. Governing sources and signed approval records remain controlling. Any ambiguity, broken chain, competing writer, or unrecognized event fails closed.

The sole-writer rule requires a separately reviewed, independently tested **project-level assignment coordinator** before this model can run. It is a small trusted service/control, not an agent and not one of the four concurrency slots. Its closed atomic-store schema binds project ID, coordinator generation, active supervisor agent/assignment IDs, monotonically increasing fencing token, acquired/expiry timestamps, state, and prepared/accepted receipt digests. Genesis is allowed only after direct Product Owner resume plus exact-main preflight; compare-and-set acquisition creates the first token. A normal supervisor handoff records `HandoffPrepared`, lets the successor perform read-only verification, then compare-and-set transfers the writer lease to a higher token and records `HandoffAccepted`; the old token becomes unusable immediately. If the old supervisor is lost, only hard expiry plus read-only repository/external-state reconciliation permits recovery takeover with a higher token. Worker, verifier, Jira-manager, Council, release, and research agents return signed receipts; only the active fenced supervisor records their TaskRun events. This coordinator also governs supervisor epochs before a per-task TaskRun exists and grants no task, Gate A/B, Jira, deployment, or delivery-status authority. Any unavailable, ambiguous, multiply owned, or non-monotonic coordinator state is No-go.

Coordinator creation uses one explicit **generation-0 bootstrap lease**, the only exception to coordinator-backed assignment recording. A direct Product Owner resume activates the trusted platform/root orchestrator as bootstrap lease authority. Generation 0 uses a namespaced compare-and-set bootstrap record in the approved atomic store, with platform/root ownership, fencing token, reservations, activations, deadlines, receipt digests, and an irreversible tombstone; if that store or CAS is unavailable, bootstrap is No-go. A pre-existing platform watchdog/tool broker—not the bootstrap agent—must consume those records, permit only delivery of the exact digest-bound context before context acceptance, reject every task-work, tool, or external-effect request until `AssignmentContextAccepted`, enforce `latestEffectStartAt`, `runnerHardDeadlineAt`, T+210 settlement, and T+240 assignment expiry, interrupt/disable the identity at the applicable boundary, and reject every request from an expired or mismatched identity. For the narrowly allowed generation-0 GitHub branch/PR/merge effects, that broker must also acquire the assignment-independent operation recovery latch, perform read-after-write settlement classification, and clear it only on a verified result or rollback; an uncertain response retains the latch. Generation 0 cannot begin if the watchdog/broker or these controls are unavailable or unproved; the bootstrap agent is not allowed to supervise its own expiry or external effects.

Before the first spawn, an immutable bootstrap contract fixes the exact source scope, finite supervisor/worker/verifier/Council/adversarial assignment plan, maximum assignment count, summed agent-minute budget, calendar-elapsed budget, source-PR ceiling, checks, rollback, and genesis conditions, all within the project-level maxima in Section 16. Generation 0 uses the same three-phase reservation/activation/context-acceptance protocol against platform-attested task/session IDs, context digests, and timestamps, and covers every required role—not only implementers. The still-controlling Gold Goal ratchets, including five distinct Council seats, independent/adversarial review, required CI, and normal PR topology, remain mandatory until a reviewed successor control merges; generation 0 cannot simplify them by assertion.

The bootstrap is limited to coordinator/runner source, local tests, a scoped branch and normal reviewed PR/merge, and exact-main genesis verification. It cannot read or mutate private systems, create Jira work, change delivery status, deploy, execute an ordinary TaskRun, or start R1-R10. Every bootstrap assignment still ends within 240 minutes with the T+180 forecast, earlier effect/deadline reserve, durable PR/check receipt, and fresh-agent handoff rules; each immutable bootstrap slice permits at most one successor assignment under any label before the owner must rebaseline. An independent fresh verifier must pass fencing, expiry, crash takeover, stale-token rejection, clock/deadline, atomic genesis, and no-dual-writer tests on the exact merged candidate. The bootstrap then compare-and-set creates coordinator generation 1, verifies the first fenced supervisor lease, records a non-self-referential closure receipt in the durable PR/check record, and irrevocably expires and tombstones generation 0 before any ordinary task or governed effect. Any assignment-count, summed-agent-minute, calendar, or PR ceiling breach; ambiguity; or failure leaves all ordinary execution blocked.

Minimum schema:

~~~json
{
  "taskRunId": "P0-RUN-SPK-R0-001-<unique-id>",
  "iteration": 1,
  "supersedesTaskRunId": null,
  "supersedesContextSha256": null,
  "taskId": "SPK-R0-001",
  "phase": "Phase 1",
  "milestone": "R0",
  "sourceRevision": "<exact-main-sha>",
  "manifestSha256": "sha256:<digest>",
  "githubIssue": 4,
  "roleIdentityRequirements": {
    "supervisor": "<registry-or-session-identity>",
    "worker": "fresh-and-not-a-reviewer",
    "verifier": "fresh-independent-QA"
  },
  "scope": ["<allowed outcome>"],
  "outOfScope": ["R1-R10", "authentic content", "unapproved private action"],
  "dependencies": ["PC-001"],
  "requirements": ["<all exact requirement IDs mapped to this task>"],
  "authorityCeiling": {
    "local": "maximum-allowed-or-blocked",
    "github": "maximum-allowed-or-blocked",
    "privateRead": "blocked-until-stage-approval",
    "privateMutation": "blocked-until-stage-approval",
    "deployment": "blocked-until-stage-approval"
  },
  "acceptanceEvidence": ["<named evidence>"],
  "verificationRequirements": ["<source acceptance requirement>"],
  "rollback": ["<required recovery evidence>"],
  "budgets": {
    "sourcePullRequests": "set-by-accepted-Stage-A-topology",
    "activeWorktrees": 5,
    "repeatedRepairClasses": 1,
    "maxPlannedWorkSlices": 6,
    "maxPlannedAgentAssignments": 24,
    "taskCumulativeAgentMinutesBudget": 5760,
    "taskCalendarElapsedMinutesBudget": 10080,
    "assignmentMaxWallClockMinutes": 240,
    "assignmentForecastMinutes": 180,
    "assignmentSettlementCutoffMinutes": 210,
    "latestEffectStartAt": "<derived-per-slice>",
    "runnerHardDeadlineAt": "<derived-before-settlement-cutoff>",
    "cancellationRollbackReserveMinutes": "<pessimistic-positive-integer>",
    "maxSuccessorAssignmentsPerSlice": 1
  },
  "forbiddenClaims": ["production complete", "Gate B without approval"],
  "projectionTargets": ["GitHub", "Jira", "Excel", "Wiki", "RUNNING_LOG"]
}
~~~

Jira keys, agent assignments, verifier-authored oracle versions, candidate/PR/merge/deployed identities, Gate B receipts, and closure receipts are append-only events referencing this envelope; they never rewrite it. A Gate A proposal Hold may be remediated within the same pre-candidate iteration. A verification, exact-candidate, Gate B, execution, or deployment Hold creates a new immutable context iteration linked to the superseded one; no candidate-stage Hold may silently reuse its authority.

`AssignmentReserved` binds assignment/slice IDs, intended role, complete inert/real context and prompt digests, TaskRun iteration, `supersedesAssignmentId`, reservation time, derived deadlines, allowed slice, worktree, authority ceiling, and activation expiry before spawn. `AssignmentActivated` compare-and-set binds the platform-attested fresh agent-instance identity, creation timestamp, `fork_turns=none` or equivalent mode, complete initial-context digest, and extra-context inventory. `AssignmentContextAccepted` then binds the platform delivery receipt, dispatched-context digest, agent acknowledgement digest/time, and zero-extra-context assertion. `AssignmentActivationExpired`, `AssignmentActivationFailed`, `AssignmentContextRejected`, `AssignmentForecastRecorded`, `AssignmentHandoffPrepared`, `AssignmentHandoffAccepted`, `AssignmentCompleted`, `AssignmentLeaseExpired`, and `AssignmentRescopeRequired` are also closed-schema and reducer-validated. The T+180 forecast event is mandatory for both `on-track` and `handoff-required` decisions and records forecast time, predicted settlement time, remaining verification/recovery/handoff work, and decision. No event can extend a deadline, hide cumulative elapsed time, assign the same identity a second lease for unfinished work, or exceed one successor assignment for the same slice under any label. An initial assignment becomes active only after context acceptance. A successor remains read-only after context acceptance until `AssignmentHandoffAccepted`; acceptance enables its effects but never changes its reserved start, cutoff, or deadline.

“Fresh” and “independent” are machine-checked against an immutable role-history registry keyed by the platform's actual agent/session instance ID, not a self-selected display name or shared GitHub account. They also require no inherited parent turns and exact parity with the attested inert plus dispatched context digests; extra conversation, memory, or unlisted context is Hold. For an exact candidate, any proposal/implementation author identity is forever ineligible as verifier, Independent-QA seat, or other supposedly independent reviewer. Distinct Council seats require distinct eligible platform IDs. A successor verifier receives the source oracle and predecessor receipts but inherits no verdict: it must rerun the complete required oracle or produce an explicitly signed coverage matrix proving every required check it independently reproduced. Ambiguous identity or incomplete coverage is Hold.

The coordinator supplies a trusted monotonic `asOf` observation at every reservation, activation, forecast, admission, effect boundary, handoff, and closure. At any observation, a completed assignment's elapsed minutes run from its earliest trusted reservation/platform-creation timestamp to trusted completion, handoff acceptance, or expiry; an active assignment uses `asOf` as its provisional end. Activity after the hard deadline is both counted and a violation. `taskCumulativeAgentMinutes(asOf)` is the arithmetic sum across every completed and active supervisor, worker, verifier, Jira, Council, release, and research assignment, so overlapping agents count separately. `taskCalendarElapsedMinutes(asOf)` is `asOf - earliestTaskReservationAt` until final closure, so idle and wait time remain visible.

Before every new reservation, the reducer performs a worst-case check: current cumulative agent-minutes plus the proposed assignment's full 240-minute lease must fit the chartered agent-minute budget; proposed assignment count and slice count must fit their maxima; and the proposed hard deadline must fit the calendar budget. Both metrics and counts accumulate across every successor and linked TaskRun iteration for the same canonical task. A handoff, Hold, restart, or re-charter never resets them. Exceeding any chartered count or time budget stops automatic continuation and requires an owner-visible reviewed rebaseline; it cannot be cured by generating another agent.

Do not place secrets, private URLs, credentials, authentic content, raw private responses, or signed evidence in this package.

The verifier receives the task contract and frozen candidate, not the worker's private reasoning. This prevents shared-reasoning contamination and encourages genuine reproduction.

## 11. Keep three state machines separate

### Delivery state

~~~text
Backlog -> Next -> In progress -> Done
~~~

Evidence must precede movement. This is the status projected to GitHub, Excel, Wiki, and—only after adoption—a dedicated Jira **Roadmap Status** field. Jira workflow state/resolution remains separate and cannot authorize or redefine delivery status.

### Agent-run state

~~~text
Chartered
  -> Jira disposition recorded
  -> Oracle ready
  -> Proposal authoring
  -> Gate A review pending
  -> Gate A accepted | Gate A hold
  -> Worker active
  -> Candidate frozen
  -> Verification pending
  -> Verified pass | Rework required | Blocked
  -> Exact-candidate Council pending
  -> Exact-candidate Council accepted
  -> Integration pending
  -> Candidate merged
  -> Gate B publication pending
  -> Gate B published
  -> Exact-main admission eligible
  -> Guarded runner executing | Governed execution not applicable
  -> Runner settled and verified | Governed execution not applicable
  -> Acceptance publication pending
  -> Acceptance merged
  -> DeliveryTransition(edge) settled | No status edge due
  -> Projection sync pending
  -> Run closed
~~~

Recovery terminals and transitions are also required: `Cancelled before work`, `Superseded candidate`, `Agent lost`, `Lease expired`, `Owner paused`, `External mutation uncertain`, `Rollback required`, and `Recovery required`. Every transition records its cause, permitted successor, and whether a new TaskRun iteration is mandatory. Agent-run state never changes delivery status by itself.

`Jira disposition recorded` branches to `Registered`, `Pilot registered`, `Not adopted`, or `Bootstrap pending`; all four may proceed to `Oracle ready` under their exact authority. Only `Registered` participates in normal Jira parity, and only the exact SPK-R0-001 pilot may use `Pilot registered`. `Pilot registered` cannot reach `Run closed` until the owner resolves the decision to `adopted` or `not-adopted`.

`DeliveryTransition(edge)` is a mandatory reusable subflow whenever evidence permits a status edge: `Transition proposal -> Transition Gate A accepted -> Transition Gate B published -> Transition admission eligible -> Transition runner executing -> Transition settled and verified`. No event may skip a state. Gate A Hold returns only to proposal remediation; verification Hold creates a new linked iteration; Gate B denial or admission failure enters Blocked without an effect.

Every nonclosed state is also governed by the assignment-lease overlay. Initial startup follows `Assignment reserved -> Assignment activated (inert) -> Context accepted -> Assignment active`; an expired, failed, rejected, or unacknowledged context cannot dispatch effect authority. An on-track forecast follows `Assignment active -> Forecast safe -> Assignment active -> Assignment completed`. An at-risk forecast follows `Assignment active -> Forecast at risk -> Handoff required -> Handoff prepared -> Successor reserved -> Successor activated (inert) -> Context accepted (read-only) -> Successor accepted/active -> Prior assignment closed`. If the one permitted successor also forecasts an overrun, the only transition is `AssignmentRescopeRequired -> new TaskRun iteration`; a third continuation on the same slice is invalid. `AssignmentLeaseExpired` without a completed or accepted-handoff receipt forces Blocked/Recovery and prohibits further effects by that identity.

The independently tested reducer must use a closed event/transition table—no wildcard transition. Minimum recovery paths are:

| Event | Allowed predecessor | Result | Required successor |
| --- | --- | --- | --- |
| OwnerPause | Any nonclosed state | Owner paused | Revoke leases; direct resume creates a new iteration. |
| AgentLost | Worker active or Verification pending | Agent lost | Rehydrate from receipts only or create a new iteration. |
| CandidateSuperseded | Candidate frozen or Rework required | Superseded candidate | New context linked by prior TaskRun ID and digest. |
| LeaseExpired | Gate B or deployment states | Lease expired | Fresh authority/Gate B evaluation; never resume the old lease. |
| ExternalMutationUncertain | Jira, GitHub, Wiki, or deployment mutation pending | External mutation uncertain | Read-only reconcile, then recover, roll back, or Hold before retry. |
| RecoveryAdmitted | External mutation uncertain or Recovery required, plus exact retained latch and recovery Gate B | Recovery execution authorized | Advance the latch generation and run only the bound recovery action; do not clear before settlement. |
| RollbackRequested | Deploying or post-deployment verification | Rollback required | Verified rolled back or Recovery required. |
| CancelBeforeWork | Chartered through Gate A Hold | Cancelled before work | Revoke resources and close without delivery-status change. |
| AssignmentReserved | Valid dispatch state and fenced writer | Assignment reserved | Spawn only the inert activation agent before activation expiry. |
| AssignmentActivated | Assignment reserved plus platform attestation | Assignment inert; context pending | Deliver only the digest-bound context; the original reservation clock remains controlling and no effects are allowed. |
| AssignmentContextAccepted | Assignment activated plus delivery receipt and exact agent digest acknowledgement | Initial assignment active, or successor read-only | Initial work may start; a successor still has no effects before handoff acceptance. |
| AssignmentActivationExpired | Assignment reserved but not activated by its short expiry | Activation expired | Revoke reservation; no context/effect; any retry uses a new linked assignment ID without resetting cumulative time. |
| AssignmentActivationFailed | Agent created but identity/timestamp CAS or attestation failed | Activation failed | Keep the spawned agent inert, close or park it, revoke the reservation, and use a new linked ID only after reconciliation. |
| AssignmentContextRejected | Assignment activated but context delivery/acknowledgement mismatched or expired | Context rejected | Keep the agent inert, close or park it, and use a new linked ID only after reconciliation. |
| AssignmentForecastRecorded (`on-track`) | Any active assignment at T+180 | Assignment remains active | Preserve the original deadline and continue only while safe settlement remains credible. |
| AssignmentForecastRecorded (`handoff-required`) | Any active assignment at or before T+180 when risk becomes known | Handoff required | Stop new work; prepare a successor before T+240. |
| AssignmentHandoffPrepared | Handoff required | Handoff prepared | Fresh identity verifies and accepts exact state. |
| AssignmentHandoffAccepted | Handoff prepared plus successor context accepted read-only | Successor accepted/active | Close prior assignment; successor continues under its already-started four-hour lease without a clock reset. |
| AssignmentRescopeRequired | Successor accepted and successor forecasts overrun | Rescope required | Stop the slice; charter smaller reviewed slices in a new TaskRun iteration. |
| AssignmentLeaseExpired | Any active assignment at T+240 | Assignment expired | Prohibit effects, preserve locks/custody, and enter Blocked or Recovery. |

### Deployment state

~~~text
Not applicable | Prepared
  -> Authority pending
  -> Authorized
  -> Deploying
  -> Verification pending
  -> Verified complete | Rolling back | Verified rolled back | Recovery required
~~~

A Jira transition, PR merge, or verifier pass cannot silently imply production deployment.

## 12. Jira operating model

### 12.1 Current limitation

The repository contains no Jira configuration. The installed Toast Jira skill is hard-coded around a corporate Toast Jira instance and instance-specific custom fields. **Do not invoke its setup, create, or update flow for this project.** Personal-project authentication and connector selection are a separate owner-led bootstrap; credentials must use an approved private broker and must never enter the repository, TaskRun package, Jira description, or agent transcript.

Before any Jira write, discover and approve:

- Jira site and project key;
- company-managed, team-managed, software, business, or JPD project type;
- authenticated account and mutation permissions;
- approved OAuth/API-token custody;
- issue types and hierarchy;
- workflow statuses and transition IDs;
- Phase 1 parent Epic or Initiative;
- Fix Version or milestone field mapping;
- start/target/due-date fields;
- priority, component, label, and automation behavior;
- custom field and option IDs;
- account-ID mapping for assignee;
- whether Jira keys/URLs may appear in the public repository/Wiki or must remain behind a private mapping broker; and
- duplicate, archive, cancellation, and retention policy.

The bootstrap deliverables are: an owner-approved target/configuration record; the three-state owner decision record and validator; an approved connector or purpose-built adapter; a closed schema/option/transition map; an approved public mapping file or private mapping broker; a dry-run/apply/verify tool; an atomic lease service; privacy and security review; duplicate/partial-write recovery tests; and an independently verified SPK-R0-001 pilot receipt. No ticket creation promise is valid before those deliverables pass.

If Jira is not configured when the supervisor resumes, record **Jira projection pending — bootstrap authority/configuration absent**. Do not block safe local protocol proof, and do not claim Jira is synchronized.

### 12.2 Identity and hierarchy

After adoption, default to one Jira issue per canonical manifest Task ID. Do not create separate delivery tickets for worker, verifier, or Council agents. Those are TaskRun roles, not new backlog scope.

Use deterministic identity through an approved, queryable, immutable custom field or Jira issue property:

~~~text
life-reflection:phase1:<TASK-ID>
~~~

A summary prefix is only a human aid and is never sufficient identity. Before the pilot, define the field/property ID, exact query contract, uniqueness check, durable `Task ID -> Jira key` mapping mode, and one supervisor-controlled single-writer lease. The mapping has two permitted modes: (1) an owner-approved public-safe repository map, or (2) an access-controlled private broker whose repository representation contains only an opaque reference and digest, never the Jira key or URL. TaskRun events follow the same policy. If the selected connector cannot read and write that identity safely, Jira adoption remains blocked.

The lease must live in an approved atomic store, not an ordinary repository file. Its schema binds lease ID, TaskRun ID, active assignment ID/state digest, owner identity, fencing token, acquisition/expiry/renewal timestamps, target Jira project, and release state. Compare-and-set acquisition returns a monotonically increasing fencing token carried through every Jira mutation; the adapter rejects stale tokens. Jira-lease expiry must be no later than the assignment runner hard deadline, and renewal may never cross that boundary. After an accepted handoff, the successor must acquire a strictly higher fencing token bound to its active-assignment digest before any Jira effect; the old token is rejected. An uncertain Jira mutation keeps the assignment-independent operation recovery latch set even after this Jira lease expires; no successor or retry may write until read-only reconciliation and recovery admission resolve that latch. Expiry, crash takeover, renewal, release, and uncertain-write rules are part of the independently tested bootstrap. Without enforceable fencing, ticket creation remains disabled.

Recommended hierarchy after discovery and separate creation authority:

- one existing or separately authorized Phase 1 parent Epic;
- one Jira issue for each canonical task in the currently authorized scope;
- optional TaskRun comments or an Agent Run State field; and
- no R1-R10 Jira issues under the bounded P0/R0 Goal.

### 12.3 Canonical Jira field mapping

| Canonical source | Jira projection | Rule |
| --- | --- | --- |
| Task ID | Life Reflection Task ID | Unique immutable field plus summary prefix. |
| Title | Summary | [TASK-ID] outcome-oriented title. |
| Phase | Phase field | Phase 1. |
| Milestone | Fix Version or approved milestone field | Exact P0/R0 value; do not invent versions. |
| Task type | Issue type plus source-type field | Deterministic approved mapping; retain original type. |
| Status | Roadmap Status custom field | Exact canonical Backlog/Next/In progress/Done value. Historical planning Done remains explicitly non-authorizing. |
| Jira workflow | Jira workflow state and resolution | Operational Jira state only. It never determines canonical delivery status; exact transition and resolution mappings must be approved before use. |
| Priority | Jira priority | Exact approved High/Medium/Low mapping. |
| Planned dates | Start and target/due fields | Estimates only; preserve nulls. |
| Owner role | Owner Role field | Do not equate a role with an assignee. |
| Human assignee | Assignee | Set only from approved Jira account mapping. |
| Description | Description | Generated from canonical task source. |
| Requirements | Requirement IDs | Exact stable IDs. |
| Dependencies | Blocks/is blocked by links | Add only after exact Jira mapping exists. |
| GitHub issue | Remote link/custom field | Required canonical backlink. |
| PRD/PID/design/architecture | Durable links | Public-safe repository links only. Signed URLs are categorically prohibited because they are credentials; private nonsigned links require a separately approved target/audience policy. |
| Acceptance evidence requirement | Evidence Required | Requirement, not a claim of completion. |
| Artifact readiness | Artifact Readiness | Exact projection. |
| Execution decision | Execution Decision | Exact projection. |
| Execution permission | Execution Allowed | Boolean, never inferred. |
| Execution scope | Execution Scope | Exact allowed scope/action pairs; no credentials or private topology. |
| QA and delivery controls | Structured description fields | QA plan, delivery control, Council decision, remaining limitation, and next permitted action. |
| Task dossier | Public-safe artifact register links | Complete Product/Architecture/Design/QA/Delivery/Council references without private URLs. |
| Recovery impact | Rollback and Restore Impact | Required rollback/restore consequence and evidence reference. |
| Source revision | Source Revision | Exact merged main SHA. |
| Manifest digest | Manifest SHA-256 | Raw manifest digest. |
| Desired Jira payload | Projection Payload SHA-256 | Idempotent no-op detection. |
| TaskRun | Agent Run State / last run ID | Separate from delivery status. |
| Current assignment | Agent assignment ID / lease deadline | Operational projection only. A handoff updates this field or idempotent comment on the same ticket; it never creates another ticket or changes Roadmap Status. |

Define a closed normalized payload schema for every managed field, including null handling and ordering. Preserve all unmanaged human fields/comments. Exact parity means parity for that closed managed schema, not destructive replacement of the Jira issue.

### 12.4 Jira create-or-update algorithm

1. Require `adopted` for normal synchronization, or separately approved `pilot-authorized` for the exact SPK-R0-001 pilot only; also require explicit Jira mutation authority, the approved connector, and the supervisor-held fenced single-writer lease.
2. Recompute the desired managed payload from exact merged main.
3. Search through the approved immutable Task ID field/property and verify the durable map.
4. Refuse zero-or-more-than-one matches when an existing mapping claims a ticket; refuse more than one match in every case.
5. Produce a field-level dry-run that excludes unmanaged fields.
6. If the connector proves compare-and-set/version semantics, use them. Otherwise pre-read, make one bounded mutation call, post-read, classify any partial state, and stop; do not promise atomicity the connector lacks.
7. Create only if no match and no prior mapping exists; otherwise update only managed mismatches.
8. Re-read after each write and confirm normalized managed-field parity.
9. Add links/comments only after a read-before-add check using deterministic TaskRun correlation IDs; comments are append-only receipts, not regenerated source fields.
10. Persist the mapping in the approved public or private mode plus the desired-payload digest, then emit only a sanitized receipt. A private-mode receipt exposes only its opaque mapping reference/digest.

After timeout or uncertain response, release no second writer and search/re-read before any retry. Never create a second issue to recover from uncertainty. Never automatically reverse a workflow transition, set a resolution, delete a duplicate, or remove a human field. If partial-state reconciliation is not safely supported, Hold and request a reviewed adapter repair.

### 12.5 Jira adoption sequence

1. Decide that Jira is a projection, not authority, and publish the owner-controlled decision record as `not-adopted` initially.
2. Owner-select the personal Jira site, approved connector, credential broker, and public/private link policy; do not run the Toast setup skill.
3. Create or select the Phase 1 parent and P0/R0 milestone/Fix Version objects under separate authority before child ticket creation.
4. Discover the real schema, workflow/resolution semantics, custom identity field/property, and permissions without exposing secrets.
5. Build a dry-run-only projector, an approved public map or private broker with only an opaque repository reference/digest, and a cross-system invariant check.
6. After separate owner approval, set `pilot-authorized` and pilot SPK-R0-001 only.
7. Test create, update, no-op, comment/link deduplication, timeout recovery, duplicate refusal, partial-state classification, and concurrent-edit refusal.
8. Obtain independent verification and a direct owner adoption decision; only then publish `adopted`.
9. Add Jira to AGENTS.md and the task Definition of Done only after the pilot is accepted.
10. Mirror the remaining P0/R0 tasks; do not bulk-create frozen R1-R10 work.

## 13. Per-task lifecycle

### Step 0 — resume and refresh

Require a direct Product Owner instruction that resumes the paused P0/R0 Goal. Refresh remote main, open PRs, branch protection, issues, Project, Wiki, workbook, owner actions, processes, and worktrees. Atomically correct stale pause/authority language in AGENTS.md, README, and navigation before task work. Do not rely on this dated snapshot.

Before the first delivery-status change, run a bounded successor-control TaskRun anchored to existing issue #3/PC-001—never a new canonical issue and never a rewrite of the closed historical PC-001 review—to test and enable the currently disabled delivery-transition apply path. This enables only the mechanism; it grants no task or edge authority. It must prove dry-run/apply/verify/rollback behavior, idempotence, exact status-label/issue-state/Project-field boundaries, settled verification, and fail-closed recovery. Manual UI/raw-API workarounds remain prohibited. Every later edge still needs its own task-bound Gate A preparation, immutable Gate B authorization, and guarded runner invocation. Until both mechanism and edge stage pass, accepted evidence may be recorded but no task can lawfully change status.

Stage 0 must also implement and independently test the project-level assignment coordinator and assignment-aware admission path. The current runner/authorization contract does not yet bind assignment identity or lease deadlines. Before any ordinary TaskRun or governed private/deployment action, extend the reviewed request, authorization, admission, process-tree cancellation, and receipt schemas to bind the active assignment ID, immutable slice ID, assignment-state digest, fencing token, latest effect-start time, runner hard deadline, settlement cutoff, and hard assignment deadline. Test stale identity/token refusal, expiry during each boundary, successor takeover, cancellation reserve, quiescence, and no-orphan behavior. Until this successor control is merged and verified from exact main, the four-hour policy remains documentary and every ordinary TaskRun, private action, deployment, or delivery-status mutation remains No-go. The sole exception is the generation-0 coordinator/runner source, branch, PR, normal merge, and exact-main genesis work executed through the pre-existing watchdog/tool broker under the immutable bootstrap contract above; that exception grants no ordinary-task, private-system, deployment, Jira, or delivery-status authority.

### Step 1 — select

Select the next dependency-valid existing P0/R0 task from the manifest. Do not create a 59th GitHub issue or expand into R1-R10.

### Step 2 — charter

Create the TaskRun ID, immutable context envelope, frozen source acceptance requirements, authority ceiling, complexity budget, exact Definition of Done, and finite ordered plan of four-hour assignment slices. Prove pessimistically that each slice's setup, work, verification, rollback/recovery, and handoff fit before dispatch. Give each slice an immutable ID and acceptance boundary; one successor assignment is allowed for the same slice regardless of label, but a second overrun requires a new reviewed TaskRun iteration and smaller slices. The supervisor does not author the verifier's oracle.

### Step 3 — register Jira

Create or reconcile the Jira ticket only if the decision record is `adopted`, or if it is `pilot-authorized` and this is exactly the SPK-R0-001 pilot, with the approved connector configured and authorized. Verify phase, milestone, Task ID, GitHub mapping, Roadmap Status field, and separate Jira workflow state. Otherwise record `Not adopted by Product Owner` or `Bootstrap pending` and make no Jira call. Close or park the Jira-manager session after its receipt is durable.

### Step 4 — verifier-first protocol review

The independent verifier authors and signs oracle v1 against the supervisor-frozen source requirements before the worker starts. It answers:

- Can every acceptance claim be true simultaneously?
- Is the artifact/digest dependency graph acyclic?
- Are writers, readers, finalization order, and command order explicit?
- Can a second implementation reproduce the result from the contract alone?
- Are privacy, no-egress, rollback, and negative cases actually testable?

The oracle is an append-only TaskRun event with its own digest. The worker may clarify it only through a reviewed requirement/oracle revision; it may not weaken the oracle during implementation.

### Step 5 — Gate A proposal review

Before substantive candidate authoring, obtain five distinct registry-bound proposal verdicts: Product owns Product coverage, UI/UX owns Design, Architecture owns Architecture, Independent QA owns QA/oracle, and Project/Delivery owns Delivery. The Council artifact is the aggregate five-seat decision record, not a sixth reviewer. Publish the non-executing Gate A `preparationReviews` record and verify the current Definition-of-Ready evaluator. Gate A authorizes only the named proposal scope; it does not create a `stageApprovals` record or grant private access, deployment, or Gate B execution.

### Step 6 — implement

The worker implements the bounded assignment slice in a fresh task worktree, runs focused tests, and prepares evidence within its four-hour lease. It does not merge or change canonical delivery status. A planned next slice has a distinct immutable slice ID and starts with a fresh worker identity under the same Task ID. An at-risk slice may use one successor assignment; if that successor cannot finish, the worker stops and the supervisor re-charters smaller slice IDs instead of creating a third relay.

### Step 7 — freeze

The supervisor verifies changed paths, base lineage, source and artifact digests, then freezes one candidate SHA. Worker mutation stops.

### Step 8 — independent verification

The verifier uses a separate clean worktree and returns:

- **Pass** with exact evidence and limitations; or
- **Hold** with reproducible findings.

A Hold closes or parks the current worker receipt and creates a fresh worker TaskRun iteration and candidate identity. The supervisor cannot override it.

### Step 9 — exact-candidate Council and required checks

Obtain five distinct exact-candidate role verdicts and required CI on the frozen candidate. This is Gate B preparation evidence, not yet runtime permission. Run full CI on the frozen candidate and required postmerge boundary, not after every draft edit.

### Step 10 — integrate

The supervisor opens or updates a scoped PR, verifies exact head/base/files/checks/verifier receipt, and normally merges. It never uses an unreviewed direct main push.

### Step 11 — Gate B publication and exact-main admission

Before any governed private read, private mutation, or deployment, publish and verify the current immutable Gate B stage record bound to:

- exact task ID, TaskRun iteration, stage ID, merged-main SHA, candidate SHA, scope/action pair, and idempotency key;
- exact active assignment ID, immutable slice ID, assignment-state digest, fencing token, latest effect-start time, runner hard deadline, settlement cutoff, and hard assignment deadline;
- current dependency and owner-action evidence;
- five exact-candidate seats including independent QA;
- explicit `executionAllowed=true` for only that stage/action;
- expiry/deadline, least-privilege credential envelope, and rollback binding; and
- the reviewed serializable module/definition identity required by repository governance.

Run the exact-main diagnostic/admission evaluator and require the stage to be presently eligible. This is not an authorization token and produces no post-action receipt. Owner actions are necessary but never sufficient. A PR merge, Council verdict, projected permission boolean, or TaskRun event cannot substitute for guarded execution.

### Step 12 — execute or deploy only inside the guarded runner

Deployment is a separate privilege escalation:

1. local build/test authority;
2. staging or synthetic-target authority;
3. private read authority;
4. bounded private mutation/deployment authority; and
5. rollback/recovery authority.

After Step 11, invoke the reviewed assignment-aware `runSerializableStageFromExactMain` path for the exact stage/action. The governed read, mutation, or deployment occurs **inside** that runner—not before it and not in a separate shell command. The runner must refuse to start after `latestEffectStartAt`. Its cancellation/hard deadline is the earliest of the stage authority deadline and the assignment's `runnerHardDeadlineAt`, which is earlier than T+210 by the pessimistic cancellation/rollback reserve; T+210 remains the required settlement boundary. Immediately before a normal effect it revalidates exact main, Gate B, predecessor, active assignment ID/state digest/fencing token, lease, authority, all deadlines, and absence of an active latch in the conflict domain, then compare-and-set acquires the exact operation latch. A recovery effect instead requires the exact higher-generation `RecoveryAdmitted` latch bound to that recovery stage/assignment. The runner captures raw streams only to approved custody; cancels the complete process tree on drift/expiry; verifies quiescence and outcome; and clears the latch only for a settled result or verified rollback before emitting the closed post-action receipt. A failed, absent, uncertain, or fail-stuck receipt retains the latch and is Hold/Recovery, never evidence of completion. For high-risk work, a fresh Release Operator supplies the reviewed module/arguments, but still cannot bypass the runner or four-hour assignment lease.

### Step 13 — post-deployment verification

The verifier checks exact deployed digest, health, security/privacy boundaries, migrations, restart, backup, separate-path restore, rollback readiness, non-regression, and acceptance evidence.

### Step 14 — reconcile through the accepted publication topology

The following four-phase topology is the **target after Stage A control rebaseline**, not a description of current validators. Current main still mandates proposal C1/C2 plus merge, preparation arm/consume merges, and stage arm/consume merges. Those ratchets remain controlling until a separately reviewed successor control change, validators, AGENTS.md, rollback proof, and exact-main checks accept the simpler topology and its task-bound delivery-transition substage. If that change does not pass, stop and rebaseline; do not pretend a lean publication ceiling is executable.

After acceptance, use four explicit source/publication phases:

1. **Proposal/Gate A phase:** one proposal-only PR contains the exact task artifacts, immutable context, verifier oracle, and no substantive implementation. Five seats bind the exact proposal. The accepted Gate A record is published before worker implementation begins. If repository rules require a second successor PR rather than accepting a durable exact-head PR/check record, stop and rebaseline the PR budget before implementation rather than silently adding ceremony.
2. **Candidate phase:** the implementation PR contains governing source, code, tests, prospective evidence, events that reference only earlier commits, and deterministic tracked projections affected by those inputs. Independent QA and Council bind its exact candidate SHA in the durable PR/check record before merge. No file in the candidate may contain its own commit SHA or a digest that recursively depends on itself.
3. **Approval/stage phase:** a separate reviewed postmerge PR adds the immutable Gate B stage/approval record and TaskRun events that refer to the already-merged candidate SHA. Its own head/merge identity lives in its PR/check record or a later phase, never inside bytes that would self-reference. After merge, the guarded exact-main runtime verifies that exact approval/stage main SHA before any governed action.
4. **Acceptance phase:** after Gate B execution or deployment, a separately reviewed evidence PR records only sanitized executed evidence, authoritative status inputs, the prospective final manifest, and the Excel workbook generated from that exact prospective manifest. Same-build workbook copies must be byte-identical. A postmerge isolated rebuild is verification-only and may differ in OOXML package/relationship bytes; compare it with the governing whole-workbook oracle across every sheet, cell, formula, link, count, R10 blank, and full rendered review. Any semantic/render difference requires another reviewed PR. Then charter one task-bound delivery-transition stage for the exact from/to edge: its stage ID ends `-DELIVERY-TRANSITION`, scope/action is exactly `delivery-control/delivery-status-transition`, module is `p0.delivery-transition`, Gate A preparation and full immutable Gate B authorization both pass, and one guarded runner invocation mutates only Project Status, issue state, and the canonical status label. `In progress -> Done` uses the qualified accept decision. A global tool enablement, task acceptance, or ordinary sync never authorizes this edge. After settled edge verification, the Jira projector runs only if adopted and the Wiki is generated from the exact final main SHA.

Bind every external projection to the exact final merged source SHA. Put terminal postmerge/external verification in the existing durable PR/check record when another source edit would create a recursive publication loop.

Update from authoritative sources and verify:

- governing documents;
- manifest and Markdown release plan;
- GitHub issue and Project;
- Jira if adopted; otherwise the explicit not-adopted/bootstrap-pending disposition;
- public issue map where applicable;
- Excel workbook;
- Wiki generated from exact merged main; and
- append-only RUNNING_LOG.

Perform immediate and settled read-only verification because external writes are not transactional.

### Step 15 — close the task cell

The worker and verifier each return a structured receipt containing TaskRun ID, every assignment ID/start/effect-cutoff/deadline/elapsed time, all handoff predecessor/successor IDs, base/candidate/merge/deployed identities, commands, terminal results, changed paths, evidence, external mutations, limitations, rollback state, and worktree disposition.

The supervisor then:

- revokes temporary credentials and authorities;
- stops Goal-owned schedules;
- classifies worktrees without deleting them automatically;
- verifies every assignment is `Completed` or has an accepted successor handoff, with no identity exceeding 240 minutes;
- reconciles Jira one last time if adopted, or verifies the explicit non-adoption disposition;
- closes worker, verifier, and Jira-manager sessions; and
- selects the next dependency-valid task only after current-task closure.

## 14. Production and human-only gates

The user's desired end-to-end worker responsibility is achievable only with capability separation.

The supervisor and worker may not simulate:

- account creation or MFA;
- secret delivery;
- private host, tunnel, DNS, backup, or provider authority;
- terms, spend, recurring cost, or irreversible commitments;
- authentic-content or authentic-photo UAT;
- recovery-key custody or a human Recovery Ceremony; or
- final owner acceptance outside the bounded R0 delegation.

For this Goal, R0 is synthetic-only. A successful synthetic private-shell deployment is not an authentic-memory launch or product production completion.

If a human gate blocks one task, first write the durable Blocked receipt, revoke its active lease, and park/close that TaskRun. Only then may the single-task supervisor select another dependency-valid, already-authorized P0/R0 task. It must not run two delivery cells concurrently or start R1 to stay busy.

## 15. Completion strategy from the current pause

### Stage A — explicit resume and strategic rebaseline

1. Obtain an explicit Product Owner resume instruction.
2. Record the choice **simplify before salvage**.
3. Refresh every current-state claim in this document.
4. Keep all preserved worktrees untouched until classified.
5. Treat PR #86 as obsolete/held; do not merge it.
6. Establish one clean supervisor integration worktree and independently validate the TaskRun context/event/state implementation.
7. Through the append-only successor-control path anchored to existing issue #3/PC-001, rebaseline the current C1/C2/merge, preparation arm/consume, and stage arm/consume topology into the independently proven four logical phases in Step 14. Update validators, AGENTS.md, rollback proof, and exact-main tests together; do not rewrite the closed historical PC-001 record. If this simplification is rejected, stop for owner-visible rebaseline rather than restart the publication ratchet.
8. Repair and authorize the delivery-transition apply path under the same reviewed control program before any task is expected to reach Done.
9. Decide whether Jira bootstrap is authorized now or remains pending. The requested target model should reach `adopted` before the first task closes; if the owner defers it, retain `not-adopted`, keep the Jira-manager role dormant, and do not block safe local protocol proof or claim Jira synchronization.

### Stage B — repair SPK-R0-001 vertically

The first task cell uses existing issue #4 and must not run the v1 candidate-QA contract.

The worker and verifier must:

1. reduce the protocol to the smallest truthful evidence set that proves the required synthetic scenarios;
2. draw the complete directed acyclic writer/reader/hash graph;
3. separate public dependency acquisition from no-egress local execution and attestation;
4. define every command, order, repetition count, isolation mechanism, artifact, and digest subject;
5. build one disposable reference producer;
6. have a separately implemented black-box verifier reproduce and accept the bundle;
7. run both complete paths twice before protected publication;
8. publish at most one focused repair wave where current controls permit; and
9. rebaseline if candidate QA has not run after three additional source PRs.

### Stage C — close SPK-R0-001

Freeze the repaired contract and exact candidate, run candidate QA, obtain Independent QA and all five exact-candidate seats, then satisfy Gate B plus exact-main runtime requirements for every governed private stage/action. Link the exact evidence. Move the task only through the separately reviewed delivery-transition apply path.

Private shared-host capacity, collision, restart, backup/restore, rollback, and co-resident non-regression evidence still requires the applicable owner/private authority. If that authority is absent, finish all local proof and report the precise blocked lane without claiming task completion.

### Stage D — complete UX and architecture

After SPK and PRD entry evidence:

1. create a fresh UX-R0-001 task cell;
2. close it with normal/empty/loading/error/interruption/destructive states, responsive behavior, accessibility evidence, prototype dispositions, and independent verification;
3. create a fresh ARCH-R0-001 task cell;
4. close it with threat model, interfaces, data shapes, secrets/log/cache boundaries, capacity, migration, backup/restore, and rollback evidence.

Version 1 of this operating model permits only one task cell at a time. Complete UX-R0-001 before opening the ARCH-R0-001 cell; research helpers may run only inside the active cell and may not create a second delivery candidate.

### Stage E — implement and deploy the synthetic shell

Create a fresh ENG-R0-001 worker and verifier only after UX and Architecture evidence passes. Merge the exact implementation, publish and verify the exact Gate B stage, require current diagnostic admission with `executionAllowed=true`, and—if P0-OA-001 and R0-OA-001 are satisfied—run the synthetic deployment only inside the reviewed serializable exact-main runner. Accept the deployment receipt only after process settlement and outcome verification. Verify immutable artifact identity, migration, security, restart, backup, separate-path restore, rollback, and coexistence.

### Stage F — R0 release acceptance

REL-R0-001 requires independent QA and the named access/denial, callback isolation, secret, ciphertext/wrong-key/cache, health, capacity, restart, backup/restore, rollback, accessibility, privacy, and non-regression evidence. Hold or Rollback is not Goal completion.

### Stage G — bounded terminal

When all eight P0/R0 roadmap tasks meet their own named evidence and all five substantive tasks are verified:

- reconcile GitHub, Excel, Wiki, and RUNNING_LOG, plus Jira only if adopted; otherwise preserve the explicit not-adopted/bootstrap-pending disposition;
- close all task agents and temporary authorities;
- ensure every in-scope execution permission is closed/non-replayable;
- prove all 50 R1-R10 tasks remain frozen and execution-disallowed;
- publish the bounded R0 acceptance statement; and
- stop without selecting R1.

## 16. Complexity and progress budgets

| Control | Hard limit or trigger |
| --- | --- |
| Integration/deployment concurrency | One task cell at a time. |
| Agent assignment lease | 240 wall-clock minutes maximum, including waiting and retries. Forecast at T+180, compute an earlier `latestEffectStartAt` and `runnerHardDeadlineAt`, settle every effect/rollback by T+210, reserve T+210–T+240 for verification/handoff, and never extend the same identity. |
| Project-level TaskRun maxima | At most 6 planned work slices, 24 total agent assignments, 5,760 summed agent-minutes, and 10,080 calendar minutes (7 days) per canonical task, including successors and linked iterations. Charter lower values when sufficient. Any increase requires a direct Product Owner decision plus distinct Product and Project/Delivery Council approval before dispatch; the supervisor cannot self-expand it. |
| Oversized work | Decompose before dispatch into a finite, ordered set of sequential, independently verifiable TaskRun slices under the same canonical Task ID. No extra GitHub/Jira delivery item. |
| Successor handoff | At most one successor assignment per immutable slice, regardless of label. Use a fresh agent and assignment ID, exact state fingerprints, append-only prepared/accepted receipts, new preflight, and old-agent closure. A second forecast overrun forces re-scope with new slice IDs in a new TaskRun iteration. |
| Canonical-task effort | Bind a finite maximum slice count and cumulative wall-clock budget at charter. Successors and linked iterations remain cumulative; budget exhaustion is an owner-visible rebaseline, not another automatic handoff. |
| Active worktrees | Maximum five; existing preserved worktrees are classified, not automatically deleted. |
| Source publication budget | Stage A must publish a machine-countable ceiling for four logical task phases plus the task-bound delivery-transition substage before implementation begins. Every proposal, control, integrity, arm/consume, implementation, evidence, approval, or transition source PR counts; splitting does not reset it. Until current ratchets are safely simplified, no numeric ceiling is claimed executable and task implementation remains No-go. Any extra successor wave triggers owner-visible rebaseline. Wiki pushes and external Jira/GitHub syncs are external mutation waves, not source PRs. |
| Repeated semantic repair | One repeated class triggers architecture reset, not another incremental patch. |
| Outcome ratio | At least 50% of effort must produce executable or acceptance evidence. |
| Protocol freeze | Two independent disposable end-to-end passes first. |
| CI silence | No long command may be silent for more than 60 seconds without progress telemetry. |
| Hosted full-suite target | p95 below ten minutes; recurring flakes are quarantined. |
| Jira retries | No blind retry; search/re-read after any uncertain response. |
| Projection drift at closure | Zero unresolved GitHub, Excel, Wiki, or log drift; zero Jira drift only when the owner decision is `adopted`, otherwise an explicit `not-adopted` or bootstrap-pending disposition. `pilot-authorized` is not terminal. |
| R1-R10 freeze | Zero semantic, authored-task, artifact-state, approval, status, date, requirement, or permission mutation. Deterministic aggregate provenance/render churn is allowed only when the existing 50-task freeze verifier proves no permissive or user-visible delta. |

## 17. Definition of Done

### Per task

A task is Done only when:

- its named acceptance evidence exists;
- the exact candidate passed independent verification;
- Gate A preceded candidate authoring; exact-candidate Council, CI, Gate B, and guarded runtime gates passed wherever required;
- required implementation is merged;
- deployment, restore, rollback, and production/synthetic-target evidence exists where the task actually requires it;
- no unresolved Sev-1/Sev-2 or critical/high privacy/security finding remains;
- the exact task/edge delivery-transition Gate A, Gate B, guarded runner, and settled verification applied the evidence-backed status;
- GitHub, manifest, Excel, Wiki, and RUNNING_LOG agree, plus Jira when adopted or the explicit Jira non-adoption disposition when not adopted;
- immediate and settled verification show no relevant drift;
- every assignment lease, planned-slice count, successor limit, and cumulative TaskRun effort budget is satisfied; and
- the task cell is closed with credentials revoked and worktrees classified.

A PR merge, Jira transition, green CI check, code artifact, prototype, or planning document cannot by itself satisfy this definition.

### Bounded P0/R0 Goal

The Goal is complete only when:

- AUD-001, PC-001, and PRD-R0-001 retain truthful historical-planning meaning;
- SPK-R0-001, UX-R0-001, ARCH-R0-001, ENG-R0-001, and REL-R0-001 have their named executed evidence;
- all 11 R0 requirements have requirement-level R0 acceptance evidence;
- no authentic memory or photo entered the R0 path;
- every due P0/R0 owner gate was satisfied at its exact stage;
- all 50 R1-R10 tasks retain their activation-snapshot semantics and remain execution-disallowed under the existing freeze verifier;
- no temporary agent, credential, lease, schedule, or replayable execution permission remains;
- every assignment completed within 240 minutes or transferred through an accepted fresh-agent handoff, with no expired identity continuing work and no slice exceeding its one-successor limit; and
- the exact terminal statement is published:

> **Bounded Codex Goal COMPLETE: P0 control baseline and R0 synthetic private foundation accepted. Phase 1 remains incomplete; R1-R10 are out of scope and were not started by this Goal.**

## 18. Go/no-go gates for the next supervisor

### No-go before task work

- no direct Product Owner resume instruction;
- no simplify-versus-salvage decision;
- stale AGENTS.md/README pause or authority language has not been reconciled;
- dirty, detached, stale, or ambiguous integration worktree;
- inability to preserve existing worktrees;
- project-level assignment coordinator is absent, ambiguous, unfenced, multiply owned, or untested;
- generation-0 atomic store or independent platform watchdog/tool broker is unavailable, unproved, or controlled by the bootstrap agent itself;
- admission/runner/receipt schemas do not bind and enforce the active assignment identity, state digest, fencing token, and derived deadlines;
- task outside P0/R0;
- assignment slice cannot pessimistically finish, verify, recover/roll back, and hand off inside four hours;
- no fresh successor/handoff plan exists for a forecast overrun;
- the same immutable slice already used its one successor assignment and has not been re-scoped with new slice IDs in a reviewed TaskRun iteration;
- planned-slice count or cumulative task-effort budget is absent, exhausted, or reset by a handoff/iteration;
- a charter exceeds the project-level TaskRun maxima without the required prior Product Owner, Product, and Project/Delivery approvals;
- moving or ambiguous source identity; or
- no objective verifier oracle.

### No-go before merge

- verifier Hold;
- moving candidate SHA;
- missing required Council identity/verdict;
- failed, skipped, stale, or wrong-head check;
- unreviewed extra paths;
- exceeded complexity budget without rebaseline; or
- projection/source conflict.

### No-go before deployment

- task does not require deployment;
- no current immutable Gate B record for the exact task/stage/scope/action;
- `executionAllowed` is not true for that exact stage/action;
- exact-main diagnostic admission is not currently eligible;
- the governed effect would occur outside the reviewed serializable runner, or its module/arguments are not exact;
- the exact operation recovery latch is missing, conflicting, ambiguous, or not atomically acquirable;
- the derived latest effect-start or runner hard deadline has passed, or insufficient time remains to settle or roll back by T+210 and preserve the 30-minute handoff reserve;
- private authority or owner action absent;
- secrets delivered through an unapproved channel;
- rollback, backup, restore, or non-regression plan unverified;
- deployed digest cannot be bound to merged source;
- independent verifier unavailable; or
- authentic content would enter the synthetic R0 path.

### No-go before task closure

- required evidence missing;
- GitHub/Excel/Wiki/log drift, or Jira drift when adopted;
- unresolved high-severity defect;
- Jira decision remains `pilot-authorized` rather than owner-resolved to `adopted` or `not-adopted`;
- temporary credentials or schedules still active;
- an unresolved or fail-stuck recovery latch remains for the task;
- an assignment exceeded 240 minutes, was silently renewed, or lacks a completed/accepted-handoff receipt;
- worktree disposition unknown;
- worker/verifier receipt missing; or
- required task/edge delivery-transition receipt missing.

## 19. Copy-ready supervisor charter

The compact charter below is **not standalone**. The eventual activation Goal must pin the exact merged path and SHA-256 of this full report, require the supervisor to read and attest the **entire report** before any spawn or mutation, and fail closed on a missing/different digest. That binding imports the generation-0 CAS/watchdog exception, context-isolated reservation/activation/acceptance sequence, four-slot park-and-transfer sequence, atomic supervisor fencing, deterministic budgets, assignment-independent recovery latch, human-only gates, and bounded P0/R0 completion sequence; none may be omitted for brevity. Expand the Goal with the current Jira configuration and exact live revision:

> You are the persistent P0/R0 Supervisor Agent for Life in Days. Own integration and evidence reconciliation, not feature implementation. Resume only from a direct Product Owner instruction. Work from one clean exact-main integration worktree. Select only existing P0/R0 Task IDs and keep all 50 R1-R10 tasks semantically frozen. Before task work, reconcile stale pause text, validate the non-authorizing TaskRun context/event/state ledger, safely rebaseline the current arm/consume topology, implement the fenced assignment coordinator and assignment-aware runner, and enable—but do not globally authorize—the delivery-transition mechanism through the successor-control path anchored to issue #3/PC-001. Scope every supervisor, worker, verifier, Jira, Council, release, or research assignment so setup, work, verification, recovery/rollback, and handoff finish inside a nonrenewable four-hour wall-clock lease. Reserve an assignment before spawning with no inherited parent turns, bind the platform-attested identity after creation, deliver the digest-bound real context, and allow work only after platform delivery plus exact agent digest acknowledgement are recorded; the clock starts at the earliest trusted reservation/creation time. Charter a finite planned-slice count, total assignment count, summed agent-minute budget, and calendar budget that no handoff or TaskRun iteration can reset. Forecast at T+180, derive an earlier latest-effect-start and runner hard deadline, settle every effect or rollback—or formally fence a fail-stuck recovery state—by T+210, reserve T+210–T+240 for receipts and handoff, and replace any overrunning identity with a fresh agent and assignment ID under the same canonical Task ID. Never reset the clock by pausing, renaming, reconnecting, or restarting. Permit at most one successor assignment for the same immutable slice regardless of label; a second forecast overrun stops work and requires smaller reviewed slice IDs in a new TaskRun iteration without resetting cumulative task effort. For each task, freeze source requirements in an immutable context, have a fresh verifier author oracle v1, pass five-seat Gate A before candidate authoring, and create a fresh worker. Use a short-lived Jira manager only under the owner-controlled `pilot-authorized` or `adopted` decision; otherwise record the explicit non-adoption state. A pilot is transient and the Product Owner must resolve it to `adopted` or `not-adopted` before task closure. Freeze one exact candidate and never override Hold. Merge only through a reviewed PR with current required checks. Before any governed action, require exact Gate B, `executionAllowed=true`, current owner/dependency evidence, and current exact-main diagnostic admission; then perform the effect only inside the reviewed assignment-aware serializable runner whose deadline, fencing token, and recovery latch bind the active assignment, and accept its receipt only after settlement. Move delivery status only through a separate task-bound `-DELIVERY-TRANSITION` Gate A/Gate B stage and guarded runner. Reconcile GitHub, Excel, Wiki, RUNNING_LOG, and Jira when adopted before closing the task cell. Capture durable receipts, revoke access, classify worktrees, close the worker/verifier/Jira agents, and only then create fresh agents for the next dependency-valid task. Stop after bounded P0/R0 acceptance and do not start R1.

## 20. Final recommendation

Adopt the supervisor model, but start lean:

- one persistent supervisor;
- one task at a time;
- one nonrenewable four-hour wall-clock lease per agent assignment, with a fresh-agent handoff on overrun;
- one fresh worker;
- one independent verifier that challenges the protocol before freeze;
- one ephemeral Jira manager backed by a deterministic projection contract;
- Council reviewers in short, distinct waves;
- one clean integration worktree;
- a four-logical-phase, task-bound transition, Stage-A-counted publication ceiling and five-active-worktree budget; and
- an immediate strategic reset when the same semantic problem recurs.

This preserves the best parts of the previous agent's work—truth, privacy, evidence, and recovery—while correcting the central failure: governance must enable a bounded path to verified task outcomes rather than become the dominant deliverable.

## 21. Residual risks

- Jira cannot be operationalized until the missing site/project/schema/authority facts are supplied.
- The current control system may still resist a lean protocol repair; the supervisor must prefer an explicit rebaseline over recursive ceremony.
- Existing worktree debt remains and cannot be removed without separate ownership and deletion authority.
- Wiki and human-facing projections are already stale and need a controlled refresh after resume.
- Private-host and production evidence remain unavailable until owner authority exists.
- A sophisticated supervisor can still become a bottleneck; budgets and durable TaskRun receipts must be enforced mechanically, not treated as advice.
- Handoffs can accumulate context loss or become a way to hide poor scoping; finite slice plans, one successor assignment per immutable slice regardless of label, independent state verification, and forced re-scope after a second forecast overrun must be enforced mechanically.
