# Life in Days Phase 1 — P0 task Definition of Ready

- **Effective:** 2026-08-15
- **Applies to:** All 58 canonical roadmap tasks and their existing GitHub issues
- **Decision:** Product Council `Hold` on substantive execution until the task-bound dossier passes
- **Implementation state at adoption:** No `ENG-*` task is `In progress` or `Done`
- **Private deployment state:** **Unknown — private read authority pending**

## Purpose

Every task must be understandable, reviewable, testable, reversible, and represented truthfully in its GitHub issue and Project fields before substantive work begins. Release PRDs, the global implementation plan, the UX specification, research, and prototypes are parent inputs. They do not by themselves authorize a task.

The existing 58 issues remain canonical. This policy creates no additional delivery issue. Each issue receives one task-bound dossier made of six `P0-` artifacts stored inside the Phase1 project folder.

## Required task dossier

For task `<TASK-ID>`:

```text
docs/work-items/<TASK-ID>/
  P0-<TASK-ID>-PRD.md
  P0-<TASK-ID>-TECHNICAL-PLAN.md
  P0-<TASK-ID>-DESIGN-SPEC.md
  P0-<TASK-ID>-QA-PLAN.md
  P0-<TASK-ID>-DELIVERY-CHECKLIST.md
  P0-<TASK-ID>-COUNCIL-READINESS.md
```

The generated central register is `docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json`. The manifest embeds the same record for each task. Every issue body and the live Project must link the task-bound artifacts rather than presenting shared parent sources as task approval.

The editable machine state is `docs/project/P0-PHASE1-TASK-READINESS-STATE.json`. It contains requested intent and source evidence only; derived readiness, decision, permission, blocker, dependency, owner-action, and authority aggregates are rejected. Stable public-safe identities live in `docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json`, task-candidate approvals in `P0-EXECUTION-APPROVAL-REGISTRY.json`, and structured human-gate state in `P0-OWNER-ACTION-STATE.json`.

The task-artifact generator computes every intended artifact and the register before mutation. Default mode creates missing artifacts and preserves all existing artifacts. `--refresh-drafts` is an explicit remediation action, but complete preflight protects any non-draft marker and any draft carrying a candidate, review, seat, attestation, or evidence binding. Allowed changes are staged and hash-verified before promotion. A failure before the first promotion cleans staging and leaves every target unchanged. After the first promotion the tool never auto-restores or overwrites: it stops non-authorizing, retains staging plus a recovery journal when available, and requires inspected recovery and deterministic rerun. The register is the unique last promotion, so a partial prefix cannot authorize execution. The journal is not claimed durable across abrupt host loss because file/directory `fsync` is not implemented. Generation never converts source evidence into approval.

## Discipline contracts

### Product artifact

The Product Manager owns a task-specific outcome, exclusions, exact requirement IDs, dependencies, acceptance scenarios, metric/evidence contract, product risks, owner actions, and unresolved product decisions. A release PRD/PID is linked as a parent source and remains intact.

Product is always required. `not-applicable` is not permitted for the Product artifact.

### Technical plan

The Technical Architect owns the task-specific modules/files, APIs, schemas, data invariants, ADRs, trust boundaries, threats, secrets/log/cache rules, concurrency/replay/idempotency behavior, capacity assumptions, observability, migration, compatibility, backup, separate-path restore, rollback/forward-fix, implementation sequence, and stop conditions.

Architecture may be `not-applicable` only when the dedicated artifact gives a concrete task-specific rationale and the Architect concurs in the council record. Shared plans are inputs, not approval.

### Design specification

The UI/UX Designer owns all applicable journeys, information architecture, content, normal/empty/loading/error/interruption/destructive states, responsive behavior, keyboard/focus/screen-reader semantics, target sizes, contrast, zoom, theme, reduced motion, privacy cues, and usability evidence.

Design may be `not-applicable` only when the dedicated artifact explains why no human-facing, operator-facing, error, status, accessibility, or content decision exists and the Designer concurs. A prototype is design evidence only, never runtime proof.

### QA plan

Independent QA owns scenario IDs, fixtures, negative/regression scope, functional/privacy/security/browser/accessibility coverage, schema/migration checks, backup versus separate-path restore, rollback, defect severity, evidence bundle fields, reviewer independence, stop conditions, and the permitted claim.

QA is always required. `not-applicable` is not permitted for the QA artifact.

### Delivery checklist

The Project Manager owns dependencies and their entry evidence, issue/Project status, dates, risks, owner actions, branch/PR/check strategy, artifact hashes, evidence links, workbook/Wiki/running-log parity, rollback coordination, and post-change reconciliation.

Delivery is always required. `not-applicable` is not permitted for the Delivery artifact.

### Council readiness

The council artifact records individual Product, Design, Architecture, QA, and Project verdicts, the exact reviewed commit, artifact hashes, unresolved blockers, approved execution scope, human gates, and one overall verdict.

The readiness register also carries a structured record for each of those five seat verdicts: verdict, stable `reviewerId`, registry-bound `reviewerRole`, exact reviewed revision and dossier digest, requested scope/action, overall verdict, Design/contributor digests, rationale, opaque evidence reference, and attestation digest. The five reviewer IDs are distinct and Independent QA is neither implementer nor evidence producer. A prose table or arbitrary reviewer name without the matching structured record cannot authorize execution.

Allowed verdicts are:

- `hold`
- `ready-local-synthetic`
- `ready-private-execution`
- `proceed-release`
- `historical-non-authorizing`
- `not-applicable`

No chair, schedule, status, issue closure, or existing artifact overrides a specialist veto.

## Artifact states

Allowed states are `missing`, `draft`, `in-review`, `approved`, `blocked`, and `not-applicable`.

- `missing`: required file does not exist.
- `draft`: task-bound content exists but has not completed specialist review.
- `in-review`: stable candidate is under specialist/council review.
- `approved`: accountable specialist approved the exact recorded hash and reviewed commit.
- `blocked`: an identified gate prevents approval.
- `not-applicable`: permitted only for Architecture or Design, with a task-specific rationale and council concurrence.

Editing an approved artifact changes its hash, invalidates approval, and returns the task to review.

## Structured approval record

`P0-EXECUTION-APPROVAL-REGISTRY.json` has two disjoint append-only sections. `controlReviews` records non-authorizing exact-candidate reviews of the control plane itself, including PC-001 Gate B; it may authorize a normal merge/reconciliation but is ignored by readiness derivation and runtime activation. Only `taskApprovals` supplies the artifact, Council, publication, and execution evidence described below. A `controlReviews` entry can never substitute for or create a `taskApprovals` record.

The only currently allowlisted future control-review key is `controlReviews.PC-001`; the registry remains empty until exact-candidate review finishes. Its candidate must be the sole child of accepted Gate A merge `2fc31ec905f4c664b86bebdc511a87390a24a4e9`, and the record must be absent at that candidate. Repository-wide history derives the first later canonical publication, requires that publication commit to change only the approval-registry path, and rejects deletion, rewrite, or any current/historical `taskApprovals.PC-001` even when the current control-review section is empty. One `reviewContextSha256` binds the complete non-seat context; five role-bound seat records bind that context and their own attestation digests. Candidate/publication manifest, workbook, historical reviewer registry, and complete task-file snapshots must match. The PC-001 partition is closed: the workflow plus thirteen named tool modules remain current-byte-bound; the reviewer, owner-action, task-readiness, and task-state JSON plus nine named Markdown documents are mutable historical snapshots; the six artifacts and one evidence workbook retain their own purposes. Unknown or missing implementation paths fail. Later normal tracker/state/documentation reconciliation and unrelated R0 projection/evidence evolution therefore do not rewrite the historical review. This is repository-integrity evidence rather than an external cryptographic identity signature.

Each of the six artifact kinds has an `artifactReviews` record containing `decision`, stable `reviewerId`, registry-bound `reviewerRole`, `reviewedRevision`, `artifactSha256`, `dossierDigest`, opaque `evidenceReference`, `attestationDigest`, `notApplicableRationale`, and `specialistConcurrence`. An `approved` decision is valid only when the reviewer has the required role and approved the exact candidate bytes. `not-applicable` is valid only for Architecture or Design and requires a concrete task-specific rationale plus explicit specialist concurrence.

Design also has a fail-closed structured coverage record. `journeyIds` must be nonempty, and every required state dimension (`normal`, `empty`, `loading`, `error`, `interruption`, `destructive`) and accessibility dimension (`keyboard`, `focus`, `screenReader`, `targetSize`, `contrast`, `zoom`, `reducedMotion`) must point to one or more registered task acceptance-scenario IDs. A valid Design `not-applicable` decision uses the rationale/concurrence route instead; it cannot be inferred from a task type or an empty UI section.

The five `council.seatVerdicts` records are Product, Design, Architecture, QA, and Project. Each must carry the role-bound identity and complete context-bound attestation above. The candidate is one commit with exactly one declared parent, `baseRevision`. Its `taskFiles` manifest binds every non-excluded `baseRevision..candidateRevision` changed blob by safe repository path, SHA-256 over raw bytes, purpose, Git mode, and Git type; deletes, renames, type transitions, and omitted changed paths fail closed. The six task artifacts, at least one implementation file, and at least one evidence file are mandatory. The candidate's task contract is recomputed from the manifest at that exact revision.

Only six closed post-candidate paths may change without invalidating the candidate. Five are code-owned publication/projection surfaces: `docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json`, `docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json`, `docs/project/PHASE1-ROADMAP-MANIFEST.json`, `docs/project/PHASE1-RELEASE-PLAN.md`, and `outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx`. The sixth is `docs/council/execution/P0-OWNER-ACTION-STATE.json`, used only to publish candidate-bound non-delegable human evidence that cannot truthfully exist inside the candidate. Approval-time and current task-scoped owner-action digests must match, so a later action-state change forces re-approval. The later approval-record commit binds the earlier candidate and never embeds its own revision; a still-later generated-projection commit is required before a previously false register may truthfully project permission. Volatile observed HEAD and descendant-path arrays are never persisted in the projection; exact activation HEAD remains an ephemeral trusted fact. Candidate, approval publication, and current-main task contracts must match. This candidate → owner evidence/approval publication → generated projection → activation split avoids self-reference and approval replay.

Runtime activation is available only through the narrow exported `executeTaskFromExactMain({taskId, scopeClass, actionClass, execute})` guarded callback API. It rejects extra trust-hook options. The caller supplies the exact approved task ID, scope class, and action class; the verifier holds the execution lock, freshly fetches `origin/main`, reads governed bytes from exact Git blobs, evaluates with current time, fetches/rechecks again, and re-evaluates. The callback receives a frozen task/revision/scope/action/deadline/AbortSignal context. Its deadline is at most five minutes and is capped by a private/release authority window. At deadline the signal aborts, but the verifier remains fail-stuck under the lock until the callback Promise settles; it never returns while in-process callback work is still represented as unsettled. A settled deadline-overrun fails. After an in-time exact `{ok:true}` receipt, the verifier fetches/rechecks main and re-evaluates permission with current time once more; source movement, authority expiry, or revoked permission rejects the acknowledgment. This proves only that the bounded callback acknowledged completion while the guard remained valid through the post-callback check, not that a substantive product/deployment outcome occurred. The caller owns keeping the entire action awaited inside the callback, honoring cancellation, and producing separate task evidence. A force-terminated worker/subprocess would require a future serializable command/module API. The injectable core is private to the module, and the command-line interface is diagnostic and cannot invent a completion receipt.

Every one of the 58 stable task IDs has a literal immutable execution contract. Authorization intersects its exact allowlist with the global scope map and milestone upper bound; no milestone fallback exists. The source builder and pure evaluator reject unknown task IDs, task-ID/milestone mismatches, sibling-task borrowing, cross-milestone actions, and any approval source that does not identify exactly one scope/action pair. The exact catalog contains 51 singleton contracts and seven composite contracts: `SPK-R0-001`, `ARCH-R0-001`, `ENG-R0-001`, `REL-R0-001`, `SPK-R5-001`, `EVAL-R6-001`, and `EVAL-R7-001`. Each composite fails `TASK_EXECUTION_CONTRACT_CARDINALITY` until Product Council approves separately tracked task/issues or a future append-only staged schema. Thirteen records—`AUD-001`, `PRD-R0-001..PRD-R9-001`, `PID-R10-001`, and `PC-001`—always fail `HISTORICAL_TASK_NON_AUTHORIZING`; a later task approval cannot reactivate them. PC-001's current singleton is `local-synthetic/readiness-control-hardening`; its six other options are future-only and denied. The harness checks all 58 tasks against all 38 global pairs, or 2,204 combinations. Owner-action requirements are selected from the immutable catalog for the exact task and are due only when both their scope and action sets contain the permitted pair.

Private execution additionally requires a structured public-safe authority record with `authorityId=P0-AUTH-*`, exact task/scope/action, stable verifier ID/role, bounded validity window, `result=pass`, `ownerActionId=P0-OA-001`, candidate binding, and opaque evidence reference. The matching per-action record must also pass. Neither record contains a host/account identifier, credential, secret, topology, authentic content, or raw private evidence.

## Machine-checkable start rule

`executionAllowed` may become `true` only when all conditions are true:

1. exactly one register record, manifest task, issue-map entry, GitHub issue, and Project issue item share the stable task ID;
2. Product, QA, Delivery, and Council artifacts exist and are `approved`, with named exact-hash/exact-revision artifact reviews;
3. Architecture and Design are `approved` or validly `not-applicable`, with named exact-hash/exact-revision review plus task-specific rationale and specialist concurrence for `not-applicable`;
4. approved Design has complete structured journey, state, and accessibility coverage;
5. all five individual council-seat records have distinct role-bound reviewer IDs, context-bound attestations, rationale/evidence, the same exact task-candidate revision/digest, and a permitting verdict with no specialist veto; Independent QA is not an implementer or evidence producer;
6. every basename begins `P0-`; each artifact contains exactly one canonical Task ID, Artifact kind, and Artifact state marker with no duplicate, conflict, or noncanonical marker-like line; and SHA-256 hashes match;
7. the candidate has exactly one declared parent; its complete non-excluded Git diff equals the task-file manifest byte-for-byte and mode-for-mode, contains the six artifacts plus implementation and evidence, contains no deletion/rename/type transition, and its task contract matches at the candidate; local-synthetic non-XLSX files pass the closed text/media/credential byte policy at candidate and current revisions, and any evidence-only XLSX passes the closed raw-package/XML/relationship/formula policy;
8. the stable task ID matches its manifest milestone, the request contains exactly one scope/action pair present in the literal task allowlist plus global/milestone ceilings, the task's immutable execution contract contains exactly one execution-bearing pair, the task is not in the historical non-authorizing set, task requirement IDs exactly match the manifest, and task acceptance scenario IDs are nonempty;
9. all required dependency entry evidence—not merely dependency status—passes;
10. `openDecisions` and unresolved council blockers are empty;
11. council verdict permits the requested execution scope;
12. private authority is structured, current, candidate-bound, scope/action-compatible, and linked to a passing `P0-OA-001` record when private or release scope requires it;
13. every owner action due for both the requested scope and action has one passing, role-verified, time-stamped, candidate-bound record;
14. no privacy, security, recovery, accessibility, evidence, or specialist veto remains; and
15. the later non-self-referential approval record and still-later generated permission projection are published on fetched `origin/main`; only the six closed descendant paths changed after the candidate; task-scoped owner evidence is frozen between approval and current main; volatile verification HEAD/path observations are not persisted; approval/current contracts and bound authorization context still match; all 352 canonical generated targets are tracked, present, clean regular `100644` Git blobs; and the canonical workbook's resolved Review Guide binds exactly the raw current manifest SHA-256; and
16. the guarded runtime verifier matches the caller's exact task/scope/action, freshly fetches origin, reads exact-main Git blobs, evaluates with actual current time from a clean non-detached checkout tracking `origin/main` with exact `HEAD === origin/main`, fetches/rechecks and re-evaluates before the bounded callback, enforces the capped deadline/cancellation signal and retains the lock until callback settlement, then freshly fetches/rechecks and re-evaluates after an in-time exact completion receipt before acknowledging success.

An `In progress` roadmap status cannot substitute for this rule. The 13 historical records are absolutely non-authorizing: a later `taskApprovals` entry or permitting Council verdict cannot reactivate them.

## Current adoption disposition

- The 13 existing planning `Done` tasks retain their narrow historical status and receive `historical-non-authorizing`; they can never become execution-ready under the current schema and do not make a dependent task Ready.
- `SPK-R0-001` remains historically `In progress`, but its two-pair contract fails cardinality and `executionAllowed` is `false`. Only non-execution documentation remediation may continue; no synthetic spike or private probe is allowed until a Council-approved split or staged schema exists.
- The four `Next` R0 tasks and all 40 Backlog tasks are `hold`.
- Every generated task artifact begins as `draft`; creation is not approval.
- No authentic content or authentic media is used in dossier creation or agent-controlled QA.

## GitHub issue and Project projection

Every issue body includes:

- task outcome, requirements, dependencies, status, and dates;
- task-bound Product, Architecture, Design, QA, Delivery, and Council links with states and hashes;
- parent release PRD/PID, global technical/UX inputs, evidence references, rollback/restore impact, owner actions, execution scope, blockers, and explicit `executionAllowed` state; and
- a warning that shared sources, prototypes, code, CI, deployment, or backup upload do not prove acceptance.

Project fields add `Architecture plan`, `QA plan`, `Delivery control`, `Council decision`, `Artifact readiness`, and `Execution scope`. Every real sync mode first runs structural validation across one captured manifest/issue-map snapshot; failure blocks live modes before fetch or `gh`, while a failed dry-run emits complete review JSON and exits nonzero. Only after that local gate passes does live synchronization perform exact-main preflight and a complete 58-issue/58-item/17-field/view read. It may update only mismatched existing issue bodies and existing field values. It never creates an issue or Project item, changes status/state/labels/milestones, or creates/reconfigures fields, views, or workflows. A read-only verifier runs afterward.

## Owner information boundary

No owner input is needed to create and review local/public task dossiers. Private-system work remains blocked on `P0-OA-001`. No current exact task contract permits a workflow-rule mutation; `P0-OA-002` would be only an additional prerequisite after Council creates or approves a separate task/contract with the exact configuration and rollback. Later authentic-content, credentials/OAuth, provider/privacy/spend, recovery-key/ceremony, final R9, and triggered R10 acts remain just-in-time human gates in the Owner Action Ledger.
