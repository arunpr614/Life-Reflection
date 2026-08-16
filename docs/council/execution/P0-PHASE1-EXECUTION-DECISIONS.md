# Life in Days Phase 1 — P0 execution decision ledger

- **Opened:** 2026-08-14
- **Current authority interpretation:** 2026-08-16
- **Owner:** Five-role execution council; primary agent is mechanical editor
- **Change rule:** Append dated decisions; do not erase historical planning records

Earlier accepted entries remain visible as historical provenance. When scope interpretations conflict, the latest accepted superseding entry controls; `P0-ED-016` controls current execution scope.

| ID | Decision | Status | Affected scope |
| --- | --- | --- | --- |
| `P0-ED-001` | Recognize the directly activated P0-to-production Goal as current execution authority. | Accepted | P0, R0–R10 governance |
| `P0-ED-002` | Apply the later owner instruction: every new document/artifact basename begins `P0-`; grandfather existing canonical/frozen names. | Accepted | New files and evidence |
| `P0-ED-003` | Preserve the historical four-seat planning council and add a persistent five-seat execution council with an independent QA Lead. | Accepted | Council, RACI, release reviews |
| `P0-ED-004` | Revalidate the baseline as 78 requirements, 71 active, seven deferred, 58 tasks, 55 P0/R0–R9, and three date-free R10 tasks. | Accepted | Manifest and projections |
| `P0-ED-005` | Treat deployment as `Unknown — private read authority pending`; perform no private-system read or mutation without the complete private authority record. | Accepted | R0 and all live lanes |
| `P0-ED-006` | Correct R4 to exactly keep the Correction, display newest upstream revision, or create a new Correction based on both. | Accepted | `LID-SRC-002`, R4, v16 |
| `P0-ED-007` | Reconcile System Health's durable evidence states with user-facing labels; `Not configured` is a prerequisite state, not job success/history. | Accepted | `LID-OPS-014`, R0/R8 UX |
| `P0-ED-008` | Use release-specific R0 UX evidence for the R0 subset of later queued prototype packages; keep v11–v35 queued for their full scopes and keep v6–v10 immutable. | Accepted | `UX-R0-001`, prototype tracker |
| `P0-ED-009` | Narrow sync-owned views to canonical `phase1` issues one view at a time; do not mutate workflows whose complete configuration/rollback cannot be captured. | Accepted | GitHub Project containment |
| `P0-ED-010` | Make Wiki state commit-derived, generation deterministic, history cumulative, and live-only/removed-page handling fail closed before publication. | Accepted | Wiki generator/publication |
| `P0-ED-011` | Keep governance work attached to `PC-001`; create no 59th task or governance issue. | Accepted | Roadmap identity |
| `P0-ED-012` | After P0 passes, begin `UX-R0-001` with fictional fixtures and continue safe synthetic `SPK-R0-001` preparation; hold host-specific and implementation/release lanes. | Accepted | Next execution sequence |
| `P0-ED-013` | Require a six-artifact, P0-prefixed, task-bound dossier and five-seat council readiness decision for each of the existing 58 issues before substantive execution; generation never equals approval. | Accepted; supersedes the scheduling portion of `P0-ED-012` until each named R0 task passes | All task entry and GitHub/Project projection |
| `P0-ED-014` | Use Monthly Almanac as the sole user-facing chronological destination, keep the Calendar/Almanac switcher near Search, and show no Calendar source/AI overlay beyond accessible/selected-detail disclosure. | Accepted | `LID-REF-002`, `LID-AIA-005`, R1/R3/R8/R9 and UX |
| `P0-ED-015` | Accept the six-artifact PC-001 readiness-hardening planning packet at `d44dbfbc8d040baddf46b7288476d4dc53c81e8c` / `sha256:32deebe971b1321a7ccd4203d4c861d93c4ec3d45ba3bf4c9fab2ea048b9eaed`; require its normal merge before any bounded local/public control-code edit. | Accepted planning scope; execution remains false | `PC-001`, readiness-control Gate A |
| `P0-ED-016` | Supersede only the current-authority effect of `P0-ED-001` and its routine R0–R8 delegation: the active bounded P0/R0 Gold Goal reaches the eight named P0/R0 tasks only; freeze R1-R10 until a new direct Product Owner activation. | Accepted; controls current authority scope | `AUD-001`, `PC-001`, `PRD-R0-001`, `SPK-R0-001`, `UX-R0-001`, `ARCH-R0-001`, `ENG-R0-001`, `REL-R0-001`; 50 R1-R10 tasks and 300 artifacts frozen |

## Decision details

### P0-ED-001 — Activated authority

> Historical authority record. `P0-ED-016` supersedes only its current-authority effect; the original decision text remains below unchanged.

The direct Goal supersedes only stale authorization stops. It does not turn planned, proposed, or prototype behavior into implementation or evidence. Routine R0–R8 decisions are delegated only after every named gate passes. Human-only acts remain human.

### P0-ED-002 — Naming interpretation

New execution records use names such as `P0-QA-LEAD.md` and `P0-PHASE1-EXECUTION-AUTHORIZATION.md`. Existing files including `README.md`, `AGENTS.md`, `docs/INDEX.md`, manifest, generated plan, issue map, workbook, frozen prototypes, and `RUNNING_LOG.md` remain at their canonical paths. Renaming or duplicating them would break provenance and deterministic consumers.

### P0-ED-006 — R4 semantic correction

The governing PRD and UX specification control. The third outcome creates a manual Correction workspace with both versions visible and no automatic merge. A “suggestion” is not a permitted substitute. Cancel/close is navigation, not a fourth substantive outcome.

### P0-ED-007 — System Health mapping

| Durable evidence state | User-facing label | Rule |
| --- | --- | --- |
| `unknown` | `Unknown` | No sufficient evidence exists; never green. |
| `never run` | `Never verified` | The operation has not completed; never green. |
| `success` | `Healthy` | Only from completed, current durable evidence. |
| `delayed` | `Attention — delayed` | Evidence is stale or beyond its approved interval. |
| `failed` | `Failed` | The last completed result failed. |
| `blocked` | `Blocked` | A named prerequisite prevents execution. |

`Not configured` remains available only for a missing prerequisite/configuration and never implies `never run`, `blocked`, or success without the underlying evidence.

### P0-ED-008 — Prototype queue disposition

Frozen v9/v10 are inputs for first-use and resilience language only. The R0 design contract may cover the R0 portions of future Health, capacity, recovery, access, and accessibility packages. This does not mark v24, v31, v32, v34, or v35 complete and does not release v11. The full packages remain queued until their complete scopes run through their own gates.

### P0-ED-009 — Project containment

The view filter becomes `repo:arunpr614/Life-Reflection is:issue label:phase1`. View filtering alone is not workflow containment. No non-delivery issue may be created until auto-add/sub-issue/status/closure/PR workflow boundaries are completely readable, restorable, and proven safe, or the issue is kept outside Project #1.

### P0-ED-013 — Per-task Product Council gate

Every canonical task uses the existing stable-ID issue and owns a task-specific Product PRD, Technical Plan, Design Spec, QA Plan, Delivery Checklist, and Council Readiness record under `docs/work-items/<TASK-ID>/`. The [P0 task Definition of Ready](P0-PHASE1-TASK-DEFINITION-OF-READY.md) and [task artifact register](../../project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json) govern the machine-checkable start rule. All 58 initial bundles are drafts, Incomplete/Hold, and `executionAllowed=false`; the council must review content and exact hashes at a committed revision before any one task can start.

### P0-ED-015 — PC-001 hardening plan accepted before implementation

All five seats independently matched the six artifact hashes and canonical dossier digest recorded in the [PC-001 planning review](releases/P0-PC-001-READINESS-HARDENING-PLANNING-REVIEW.md). R3 supersedes R2 because an isolated workbook build proved that semantically identical OOXML packages can have different internal relationship IDs; same-build published copies still require equal hashes, while independent builds require exhaustive semantic and render equivalence. The planning PR was required to merge with the R3-reviewed bytes unchanged; PR #66 subsequently satisfied that condition at merge commit `2fc31ec905f4c664b86bebdc511a87390a24a4e9`. The separate local/public hardening slice may therefore proceed, but its implementation candidate still requires executable fixtures, fresh Independent QA, five-seat review, normal merge, exact-main synchronization, workbook/Wiki reconciliation, and two quiescent parity snapshots. This bootstrap decision does not set `executionAllowed=true`, promote PC-001, authorize R0/private work, or create a 59th issue.

### P0-ED-016 — Bounded R0 authority

Effective 2026-08-16, the directly activated bounded P0/R0 Gold Goal supersedes only the current-authority effect of `P0-ED-001` and its routine R0–R8 delegation. It does not erase or revise their historical provenance, the accepted P0/R0–R10 release sequence, requirements, data shapes, or evidence gates. Those remain the planning baseline; they are not current execution authority.

Current execution scope is R0 only under this bounded Goal.

The bounded Goal covers exactly `AUD-001`, `PC-001`, `PRD-R0-001`, `SPK-R0-001`, `UX-R0-001`, `ARCH-R0-001`, `ENG-R0-001`, and `REL-R0-001`. Its current authorization reaches only the one-time local/public Stage 0 control repair. After Stage 0 closes, the five-seat council may authorize one of the five substantive R0 tasks (`SPK-R0-001`, `UX-R0-001`, `ARCH-R0-001`, `ENG-R0-001`, or `REL-R0-001`) only through its separate exact Gate A and Gate B controls. All 50 R1-R10 tasks and their 300 task artifacts remain frozen and out of scope. A planning document, historical Goal, prior council decision, code path, artifact, or passed gate cannot unfreeze them. Any broader execution requires a new direct Product Owner activation. Nothing in this decision presently authorizes R0 implementation, private-system access, deployment, authentic-content admission, acceptance, release, or production; every named human-only act retains its separate authority gate.

## Open decision frontier

- Exact private deployment target, authority, and rollback inputs: human/private record required.
- SQLCipher/SQLite versus PostgreSQL: R0 hard-gate evidence required.
- Project workflow rule changes: complete private configuration/rollback capture required.
- Task entry: the five substantive R0 dossiers require task-specific specialist review within the bounded Goal; the remaining R1-R10 dossiers stay frozen planning records until new direct Product Owner activation.
- Provider/model/secret/spend choices: release-specific evidence and named human act required.
- R10 trigger: no measured approved trigger; keep date-free and Backlog.
