# P0/R0 Stage 0 test plan

- **Fixture class:** fictional/synthetic/public-safe only
- **External mutation:** prohibited during candidate verification
- **Private access:** prohibited
- **Primary oracle:** stable result codes plus exact normalized evidence

## Required suites

| Suite | Positive proof | Mandatory negative proof |
| --- | --- | --- |
| Preparation Gate A | One exact substantive R0 proposal becomes `Ready to prepare — Gate A` and remains `executionAllowed=false` | Unknown/extra field, historical/out-of-scope task, private access, external mutation, stale publication, missing/duplicate/conflicted seat, veto/blocker, dependency drift, and attestation tamper |
| Stage Gate B | One composite R0 task permits exactly one bound stage pair while direct task-wide approval still fails cardinality; the dedicated transition branch alone permits exact `private-execution/project-workflow-mutation`, code-owned transition module, and complete `P0-OA-001`/`P0-OA-002` evidence without changing ordinary task defaults; standalone accepted-preparation history and later stage history are append-only, registry-only, and one contiguous per-task chain | Task/stage/scope/action/candidate/predecessor/idempotency/definition/module/requirement/QA/rollback/publication drift; generic local authority on a transition suffix; private workflow authority without that suffix; wrong transition module ID/path/mode; missing/pending/mismatched `P0-OA-002`; duplicate/gapped sequence or non-immediate predecessor; persisted transition-stage key; unrelated or multi-parent publication delta; historical/R1-R10 task; Gate A replay; legacy-seat substitution; stale authority |
| Successor control review | Bootstrap-pending is inert; later one exact five-seat add-only review verifies candidate/history/full diff | Historical record edit/delete, pre-candidate record, rewrite, duplicate seat, omitted/extra path, task approval/runtime effect, unsafe evidence |
| Running-log trust | Prior bytes are an exact prefix; append parses, is public-safe, provenance-bound, and has no gate/permission effect | Edit/truncate/insert/rename/mode drift, malformed event, duplicate provenance, secret/private/authentic canary, arbitrary descendant path |
| Staged runner | Short in-process fictional action is fully awaited; closed module fixture produces one durable idempotent receipt; interrupted fixture recovers; terminal reconciliation survives unrelated later source/append-only-registry evolution without replay while immutable review/candidate/dossier/stage/module drift fails; every outcome verifier is followed by fresh deadline/exact-main/Gate B checks and the final check occurs immediately before terminal append | Arbitrary command/shell/env/cwd/path/output/trust hook, unknown module/arg, immutable terminal-receipt binding drift, source/authority/deadline drift during a new action including expiry during a verifier, callback early return, missing final pre-terminal recheck, lock theft, receipt rewrite, symlink/non-directory runtime roots, orphan process, raw-output leak |
| Delivery transition | All three declared edges require a task-bound immutable `-DELIVERY-TRANSITION` Gate B stage with exact private workflow scope/action, code-owned module, and both owner gates; the pure one-task dry-run reconstructs the preimage, exact operations/inverse, protected surfaces, rollback reference/recovery digest, projection digests, and immutable frozen-snapshot digest; mocked exact apply durably persists directory entries/events, holds one unique-owner task lock, verifies frozen-50 parity before/after every mutation and at every success/rollback/replay boundary, and verifies projections immediately/twice-quiescently | Gate A or generic local-synthetic authority on any edge including `Backlog` to `Next`; non-transition/missing/stale Gate B, wrong module binding, or absent `P0-OA-002`; digest-recomputed semantic/authority/rollback/freeze forgery; frozen-50 drift before or after an operation with side-effect bounds; historical/non-delivery target; undeclared edge; multiple/unknown status labels; non-status mutation or forbidden-surface weakening; concurrent same-plan or cross-plan invocation; creation/deletion/reconfiguration; concurrency/automation drift; saga/lock/directory durability tamper; rollback or replay drift/failure |
| Frozen 50 | Exact 50 tasks, 300 artifacts, 40 Backlog + 10 historical Done, zero allowed, exact issue/Project/artifact bytes | Missing/extra/duplicate task; any authored field, issue, Project, artifact, review, owner action, evidence, or permission drift; unknown aggregate exception |
| Wiki trust | `--help` writes nothing; exact source maps N/N once; zero collisions/broken links/fragments; stable Page Audit source binding | Option-like output path, stale source, missing/collision page, missing fragment, Unicode/deduplicated anchor error, README semantic-key drift, self-declared current Wiki hash |
| Workflow integrity | Exact PR/push SHA runs every named suite, double generation/dry-run/Wiki build, workbook safety, generated tracking, frozen prototype check | Missing/renamed/skipped command, `continue-on-error`, false `if`, `|| true`, shallow/stale checkout, absent result, nonzero suite |

## Repository-wide acceptance

1. Parse every changed JavaScript module.
2. Run all legacy readiness, historical review, exact-start, sync, generated-tracking, and structural validators without weakening their existing assertions.
3. Run every new positive/adversarial suite above.
4. Run the frozen v10 prototype syntax check; no product code changes are expected.
5. Run task-artifact and roadmap generators twice and reject any second-pass drift.
6. Render two byte-identical safe GitHub dry-run plans; no `gh` process in dry-run.
7. Verify the 50-task freeze before generation and after every projection; the pure delivery dry-run binds only the immutable snapshot digest, while every future operational transition adapter must prove live exact-50 parity at each declared boundary.
8. Rebuild the workbook through the approved spreadsheet runtime, then inspect all 7 sheets, 58 unique issue links, 78 requirements, 2,009 formulas with zero errors, exact R10 blanks, manifest SHA binding, raw archive safety, and all paginated renders.
9. Build the Wiki twice from the same exact source plus a complete prior clone, compare trees, and require N/N mapping with zero collisions and broken links/fragments.
10. Run the public-safety scan over tracked, staged, unstaged, untracked, generated Markdown/JSON, workflow output schemas, and workbook package text.

## Fail-closed claim

Passing proves only that the Stage 0 controls and factual projections are internally consistent for the reviewed exact candidate. It does not prove product implementation, private-system access, deployment, restore, R0 acceptance, release, or production.
