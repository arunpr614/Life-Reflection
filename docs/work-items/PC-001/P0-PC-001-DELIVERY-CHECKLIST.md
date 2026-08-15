# PC-001 — readiness-control hardening delivery plan

- **Task ID:** `PC-001`
- **Artifact kind:** `delivery`
- **Artifact state:** `in-review`
- **Roadmap status:** `Done` — historical planning only
- **Milestone:** `P0`
- **Execution allowed:** `false`
- **Delivery boundary:** existing issue #3 is the sole tracker. No 59th task/issue, status change, reopen/close churn, Project workflow mutation, R0 execution, or private access is included.

## Canonical tracking

- **GitHub issue:** [PC-001 issue #3](https://github.com/arunpr614/Life-Reflection/issues/3)
- **GitHub Project:** [Phase 1 Delivery Project](https://github.com/users/arunpr614/projects/1)
- **Manifest task:** [PC-001 in the roadmap manifest](../../project/PHASE1-ROADMAP-MANIFEST.json)
- **Task artifact register:** [P0 task artifact register](../../project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json)
- **Current allowed scope:** planning dossier authoring plus audit-only exact-candidate control review and normal merge/reconciliation of local/public control hardening; never PC-001 task execution

## Status truth

- Issue #3 remains closed and Project Status remains `Done` only for its historical planning outcome.
- The corrective slice is tracked through these six artifacts, commits, PR evidence, and running-log entries; it does not relabel historical `Done` as implementation completion.
- `Artifact readiness` and `Execution allowed` remain independently derived. Throughout the planning PR, `executionAllowed=false` and all R0 tasks remain Hold.
- `P0-OA-002` is not needed to update the existing delivery issue/fields. PC-001's workflow/non-delivery options are outside its current singleton contract and denied; `P0-OA-002` alone cannot make them permissible. A future separately approved task/contract would still require it.

## Dependency and authority decision

- `AUD-001` historical evidence remains the task dependency; its status alone is not used as permission.
- The activated Goal and accepted `P0-ED-011` authorize control remediation under `PC-001` without a new task.
- No owner action is due for local/public hardening.
- `P0-OA-001` remains mandatory before any private R0 read; `R0-OA-001` and `R0-OA-002` remain due only at their named future gates. The four private-bearing R0 contracts are composite and fail cardinality even if owner-action evidence exists; they require a Council-approved task split or future staged schema first.

## Publication sequence

PC-001 itself uses a planning PR and a control-implementation PR. Any future task that receives an execution-permitting approval record also requires a third, later projection PR after that approval record is already on `origin/main`; a pre-merge approval commit cannot truthfully project its own publication.

### Gate A — planning-only packet

1. Update only the six existing `P0-PC-001-*` artifacts with one shared scope and test-ID set.
2. Keep all artifacts `in-review`, all central structured reviews Hold, and `executionAllowed=false`.
3. Regenerate only hash-dependent projections needed to make the packet internally consistent.
4. Commit the exact candidate; obtain all five Council seat reviews against that revision and dossier digest.
5. Resolve every veto, rerun validation, publish a normal draft PR, pass checks, make it ready, and merge.
6. Verify issue #3 still links the six merged artifacts. Apply only an exact generated issue/Project delta if the dry-run shows one; do not mutate workflows.

No readiness-control code edit begins before Gate A is merged and five-seat-approved.

### Gate B — control implementation

1. Branch from the exact merged planning commit.
2. Implement only the files and contracts named in the Technical Plan.
3. Run the complete P0 fixture matrix, deterministic generation, validator, security/public-safety checks, workbook validation, and dry-run projections. The exact local oracles are readiness `341/341`, start `62/62`, sync `48/48`, and control-review trust `35/35`; two Failed dry-runs must emit identical complete 58-task review JSON and exit 1, with malformed/missing evidence normalized to `Not yet recorded`, while verify/apply stop before fetch or `gh`.
4. Use fresh Independent QA that did not implement the candidate; recall Product, Design, Architecture, and Project seats for exact-candidate review.
5. Resolve every blocking finding and rerun the affected and regression matrices.
6. After fresh QA and all five exact-candidate seats concur, append one audit-only `controlReviews.PC-001` entry to `P0-EXECUTION-APPROVAL-REGISTRY.json`. It must bind the exact Gate A base, reviewed candidate/full task files, manifest/workbook/historical reviewer-registry snapshots, exact verification counts, complete non-seat context digest, and five role-bound seat attestation digests. The first publication commit changes only this registry; repository history must prove candidate absence, first canonical publication, immutability, and unconditional PC-001 absence from `taskApprovals`. Do not add a separate post-candidate Markdown review file.
7. Publish through a normal PR and merge only after checks and the recorded five-seat exit concurrence.
8. Keep PC-001 `executionAllowed=false`: `controlReviews` is ignored by readiness/runtime evaluation, so exact-candidate review of this control implementation cannot convert historical planning completion into execution authorization.

### Gate C — published projection and reconciliation

1. For an execution-permitting task, publish any due candidate-bound human evidence through the closed owner-action-state path, obtain the five context-bound seats, and wait until the non-self-referential approval-record commit is merged; then fetch and verify exact clean `origin/main`.
2. Confirm the task approval binds exactly one execution-bearing scope/action pair. If the work package contains another material execution stage, stop and obtain a Council-approved separately tracked task/issue (or a future reviewed stage schema); never reuse or widen the immutable record.
3. Regenerate the static register/manifest from those now-published facts and publish the changed projection through a separate normal PR. Runtime start remains denied while the committed register is stale or false.
4. After the projection PR merges, invoke the narrow guarded exact-main API for the exact approved task/scope/action; it independently reads Git blobs and re-evaluates the source evidence before and after the callback with fresh time. Persisted projections never embed their own containing HEAD or observed descendant-path array.
5. Run the local structural validator against one captured manifest/issue-map snapshot before any fetch. Only after it passes may synchronization fetch exact clean main and use the least expansive existing-only mode; do not change workflows.
6. Reconcile the Markdown document index and Project tracker through a normal reviewed documentation update, rebuild/publish Wiki from exact merged main, append the running log, and obtain two quiescent zero-mismatch verifier snapshots. The historical control-review record continues to bind the exact candidate/publication snapshots while current stable workflow/tool controls remain byte-bound.

For PC-001 control hardening, Gate C is reconciliation only: it publishes truthful all-Hold projections and does not create a permitting task approval.

## Required control surfaces

| Surface | Planning packet | Implementation completion |
| --- | --- | --- |
| Six PC-001 artifacts | Exact shared scope, `in-review`, linked in issue #3 | Remain byte-identical to the exact candidate; the later registry `controlReviews.PC-001` entry carries final review evidence without rewriting them |
| Readiness register/manifest | Recomputed hashes; 58 tasks, zero allowed | New schema/derived fields validated; truthful counts include 51 singleton contracts, seven composite-cardinality Holds, and 13 historical non-authorizing records |
| Issue #3 | Existing six links remain live; closed/Done historical | Exact merged evidence links/fields; no reopen churn |
| Other 57 issues | No mutation unless generated payload changes | Synchronize only reviewed generated deltas |
| Private Project | No workflow mutation | Existing 17 managed values only: Status plus historical label in Task summary; derived readiness in Artifact readiness; derived permission plus scope in Execution scope; blockers/next action in Task summary; candidate/digest/validation in Evidence; six links in dedicated fields/Task dossier. Snapshot-bound structural validation precedes projection; missing, blank, malformed, or partial candidate/digest/authority/reference values use `Not yet recorded`. Views/containment unchanged. |
| Workbook | Rebuild both copies if a projected value changes | The resolved Review Guide visibly binds the raw current manifest SHA-256. Canonical/review copies from one export have matching hashes; two isolated builds have equivalent seven sheets, used cells/formulas, 58 issue URLs, six task links, counts, R10 blanks, and 20 renders. Packaging-only OOXML relationship-ID differences are recorded, not mislabeled deterministic. |
| Wiki | Publish only after merged material source change | Deterministic exact-main Page Audit; no live-only loss |
| Running log | Append planning decision and exact branch/commit state | Append implementation, QA, merge, sync, Wiki, parity, and limitations |

## Promotion checklist

- [x] Six planning artifacts contain identical bounded scope, requirement IDs, test IDs, non-goals, and owner gates.
- [x] Product PRD passes the project-specific readiness review; Technical, Design, QA, and Delivery plans are complete.
- [x] All five seats approve planning candidate `d44dbfbc8d040baddf46b7288476d4dc53c81e8c` and dossier digest `sha256:32deebe971b1321a7ccd4203d4c861d93c4ec3d45ba3bf4c9fab2ea048b9eaed` before code edits.
- [x] Planning PR #66 is merged as `2fc31ec905f4c664b86bebdc511a87390a24a4e9`; issue #3 remains the sole tracker and no status/workflow/private mutation occurred.
- [ ] Implementation fixture matrix passes P01 and P03 plus one-gate negatives: `341 passed, 0 failed`, including all 2,204 task/global-pair checks.
- [ ] Derived readiness/permission, registry-backed identities, structured actions/authority, exact-main start, and protected refresh are independently verified.
- [ ] Fresh QA and all affected seats approve the exact implementation candidate.
- [ ] All 352 generated targets are tracked regular `100644` blobs and clean; register, manifest, release plan, issue payloads, Project fields, workbook source-manifest binding/same-build hashes/cross-build semantic-render equivalence, byte-deterministic Wiki, and log reconcile from exact merged main.
- [ ] Two quiescent live verify snapshots have zero mismatch; deployment remains Unknown and authentic-media access remains false.

## Rollback and stop rules

- A failed planning review changes only documentation; amend the candidate and re-review all affected hashes.
- A failed implementation review blocks merge. If a merged control regression is found, revert the exact control commit through a normal PR, regenerate from the prior schema, and republish reconciled projections.
- Stop immediately for a partial write, protected overwrite, nondeterminism, parity drift, sensitive-data finding, private/authentic access, unresolved Sev-1/Sev-2, or specialist veto.
- Continue unrelated safe documentation work, but do not schedule around a failed gate.

## Project Manager disposition

**In review / Hold.** The planning, implementation, and post-publication projection/reconciliation path is defined for exact-candidate Council review. All task statuses, issue states, R0 work, private lanes, and Project workflows remain unchanged.
