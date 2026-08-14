# PC-001 — readiness-control hardening technical plan

- **Task ID:** `PC-001`
- **Artifact kind:** `architecture`
- **Artifact state:** `in-review`
- **Roadmap status:** `Done` — historical planning only
- **Milestone:** `P0`
- **Execution allowed:** `false`
- **Evidence boundary:** this plan covers local/public control tooling and generated public-safe evidence only. It does not authorize application, private-host, deployment, or release work.

## Inputs

- [Task product requirements](./P0-PC-001-PRD.md)
- [Task Definition of Ready](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [Execution authorization](../../council/execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md)
- [Owner Action Ledger](../../council/execution/P0-OWNER-ACTION-LEDGER.md)
- [Published P0 control review](../../council/execution/releases/P0-P0-EXECUTION-CONTROL-REVIEW.md)

## Technical objective

Replace assertion-based readiness with one pure, fail-closed evaluation contract. The generator projects derived state, the validator independently recomputes it, the fixture harness exercises both positive and negative paths, and a separate start verifier enforces clean exact-main activation without embedding a commit's own SHA in itself.

## Frozen decisions

| Area | Decision | Rejected alternative |
| --- | --- | --- |
| Derivation | One shared pure evaluator returns artifact readiness, decision, permission, and stable gate reasons. Validator recomputes and compares every projection. | Trusting an override or checking gates only after permission is asserted. |
| Artifact readiness | Derived only from six effective artifact states. | Coupling artifact completeness to dependency, authority, or runtime gates. |
| Markdown identity | One shared parser requires exactly one canonical Task ID, Artifact kind, and Artifact state line and rejects duplicate, conflicting, or marker-like variants. | First-regex-wins or substring inclusion. |
| Permission | Derived from artifacts, coverage, exact candidate, role-bound attestations, dependencies, actions, scope, blockers, and verdict. | A mutable Boolean or optimistic default. |
| Publication | Candidate review, append-only per-task approval publication, later generated projection, and guarded runtime execution are explicit phases. The candidate is one commit over one declared parent; its complete non-excluded diff is bound by raw-byte SHA, purpose, Git mode, and type. Trusted publication/activation facts are adapter inputs, never source assertions. | A self-referential approval-registry SHA, mutable publication Boolean, partial changed-file list, or unguarded preflight token. |
| Public content | Local-synthetic task files use a closed path/purpose/content-class policy. Non-XLSX bytes must be fatal-UTF-8 text without NUL, binary/encoded media, SVG/data-media carriers, credentials, or private targets; XLSX is evidence-only and uses a closed package/content-type/relationship/formula/archive policy. | Trusting an extension, skipping NUL files, formula/relationship blacklists alone, or treating visual review as byte safety. |
| Identity | Stable reviewer IDs resolve through a P0 reviewer registry to one required role; Council seats are distinct and QA is independent. A non-delegable owner act additionally requires an active human `owner-authority` identity. | Arbitrary nonempty reviewer names or an agent attesting a human act. |
| Human/private evidence | Immutable code defines which owner actions are due; state records contribute only candidate-bound evidence. Due action and authority records require an opaque human attestation plus an eligible independent verifier. | Mutable scope/action arrays, aggregate `ownerActionsSatisfied`, or `verified` plus a regex string. |
| Refresh | Complete protection/source preflight and staging occur before any target mutation; every source and target is rechecked immediately before the first promotion, and the register is uniquely last. | Sequential marker-only overwrites or stale-input promotion. |
| Compatibility | Existing 58 all-Hold dossiers remain valid under fail-closed defaults. | Bulk promotion or hand-written exceptions. |

## Owned implementation surface

### Existing files to modify

- `tools/P0-generate-task-artifacts.mjs` — reject derived override keys, preflight/stage refresh, project evaluator output.
- `tools/P0-validate-execution-controls.mjs` — recompute derived values unconditionally and validate role, attestation, authority, action, and exact-main contracts.
- `tools/sync_phase1_github.mjs` — bind structural validation to the exact manifest/issue-map projection snapshot, normalize missing or malformed evidence, and retain the existing-only mutation boundary.
- `docs/project/P0-PHASE1-TASK-READINESS-STATE.json` — versioned input schema containing only source evidence and requested scope, never derived authorization.
- `docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json` — generated projection.
- `docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md` and `P0-PHASE1-EXECUTION-DECISIONS.md` — executable control semantics.
- `.github/workflows/prototype-syntax.yml` — run the P0 fixture harness in addition to the baseline validator.
- Generated manifest, release plan, issue projection, workbook inputs, Wiki projection, and documentation index only when their source fields change.

### New P0-prefixed files planned

- `tools/P0-readiness-gates.mjs` — pure normalization, digest, gate evaluation, and stable reason codes.
- `tools/P0-build-task-readiness-input.mjs` — one source-only adapter shared by generation, independent validation, and runtime start verification.
- `tools/P0-test-execution-controls.mjs` — table-driven positive, negative, determinism, refresh-protection, and safety fixtures.
- `tools/P0-control-review-trust.mjs` and `tools/P0-test-control-review-trust.mjs` — audit-only PC-001 Gate B history, exact-context, seat, candidate, publication, and immutable-record verification; these controls cannot project task permission.
- `tools/P0-verify-execution-start.mjs` — shared Git-publication adapters plus the narrow `executeTaskFromExactMain({taskId, scopeClass, actionClass, execute})` production API. It rejects extra trust hooks and requires clean `HEAD === freshly fetched origin/main`, final refetch/re-evaluation, and a bounded callback under the execution lock; the injectable core is private and its CLI is diagnostic only.
- `tools/P0-json-trust.mjs` — duplicate-key-rejecting parser for governed JSON review inputs.
- `tools/P0-verify-generated-tracking.mjs` — CI proof that all 348 generated task artifacts plus four canonical projections are tracked, present regular `100644` Git blobs and drift-free, including untracked-file detection.
- `docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json` — stable public-safe reviewer IDs and allowed roles.
- `docs/council/execution/P0-EXECUTION-APPROVAL-REGISTRY.json` — two disjoint append-only sections: audit-only `controlReviews` for exact control-plane candidate review, and execution-permitting `taskApprovals` that bind exact earlier task candidates and attestations without self-reference. The evaluator consumes only `taskApprovals`.
- `docs/council/execution/P0-OWNER-ACTION-STATE.json` — machine-readable, public-safe per-action status/evidence projection aligned to the Markdown ledger.

No new unprefixed document, artifact, tool, fixture, or output basename may be introduced. Existing canonical/generated names remain grandfathered.

## Data contracts

### Reviewer and attestation

Each approved artifact review and permitting Council seat contains `reviewerId`, `reviewerRole`, `reviewedRevision`, `artifactSha256` where applicable, `dossierDigest`, `evidenceReference`, and `attestationDigest`. The registry resolves `reviewerId` to exactly one required seat role. The five Council reviewer IDs must be unique. The QA reviewer ID must not appear in the candidate's nonempty `implementerIds` or evidence-producer IDs. The inactive human placeholder in the registry is deliberately non-authorizing until explicit owner confirmation activates a stable `owner-authority` identity.

`attestationDigest` is the SHA-256 of a canonical payload containing task ID, artifact kind or seat, verdict/decision, reviewer ID/role, reviewed revision, dossier digest, artifact hash where applicable, evidence reference, and applicable rationale/concurrence. Seat attestations also bind requested scope/action, overall verdict, Design coverage, contributor identities, decisions, blockers, vetoes, task contract, reviewer registry, task-relevant owner-action state, dependency evidence, private authority, and the complete artifact-review set. A changed field invalidates the attestation.

### Owner action

The immutable catalogs and literal 58-entry task execution contract in `P0-readiness-gates.mjs` are the intersection of the global scope map, milestone upper bound, and exact task allowlist; there is no milestone fallback. The catalog contains 51 singleton contracts and seven composite contracts: `SPK-R0-001`, `ARCH-R0-001`, `ENG-R0-001`, `REL-R0-001`, `SPK-R5-001`, `EVAL-R6-001`, and `EVAL-R7-001`. Every composite fails `TASK_EXECUTION_CONTRACT_CARDINALITY` until Council approves a separately tracked split or future staged schema. Thirteen historical records—`AUD-001`, `PRD-R0-001..PRD-R9-001`, `PID-R10-001`, and `PC-001`—always fail `HISTORICAL_TASK_NON_AUTHORIZING`, even if a later task approval claims a permitting verdict. PC-001's only current pair is `local-synthetic/readiness-control-hardening`; six private/workflow/release options are future-only and denied before owner-action evaluation. The harness checks all 58 tasks against all 38 global pairs, or 2,204 combinations. An action is due only when both its scope set and action set contain the exact permitted pair. `P0-OA-001` covers the closed private/release union. `P0-OA-002` would be necessary, but not sufficient, for a future separately approved Project-workflow/non-delivery task; it cannot make the current PC contract permissible. R0 private read, mutation, and deployment intersect `R0-OA-001`; `R0-OA-002` remains conditional on a separately tracked provider/spend action. Each state record contains `actionId`, accountable human ID/role, opaque owner attestation, `status`, `result`, eligible `verifierId`/`verifierRole`, `verifiedAt`, candidate binding, and `evidenceReference`.

### Private authority

A private-permitting record contains `authorityId`, `taskId`, `scopeClass`, `allowedActionClass`, active human owner ID/role, opaque owner attestation, eligible `verifierId`/`verifierRole`, `windowStart`, `windowEnd`, `result=pass`, `ownerActionId=P0-OA-001`, `evidenceReference`, and candidate binding. It must remain current through the final immediately-before-return reevaluation. No target/account/topology/credential/raw evidence is stored publicly.

### Derived result

The evaluator returns:

- `artifactReadiness`: `Incomplete` or `Ready`;
- `executionDecision`: one canonical human-readable decision;
- `executionAllowed`: Boolean;
- `gateResults`: ordered `{code, passed, reason}` records; and
- `blockers` and one corrective `nextAction`; and
- normalized evidence used to compute the result.

Unknown, malformed, missing, stale, duplicate, expired, or mismatched evidence fails closed. Evaluator/start/refresh gate output is public-safe and includes the task ID and corrective action. Sync structural failure instead emits the complete projection labeled `Control validation: Failed`, exits nonzero, and leaves detailed gate findings to the validator output.

### Local/public content

`classifyLocalSyntheticTaskFile` derives content class only from canonical path and purpose. Text extensions require fatal UTF-8, no NUL, no raw or leading-whitespace binary magic, no known encoded document/archive/media signature, no SVG/data-media carrier, and no expanded credential/private-target pattern at both candidate and current revisions. Compound media suffixes are rejected. `.xlsx` is the only binary class, is allowed only as evidence, and is verified from raw ZIP bytes with zero comments/extras, a closed part and content-type set, internal single-target relationships, text-safety scanning of every XML part, and a closed formula-function set (`AND`, `COUNTA`, `COUNTIF`, `COUNTIFS`, `IF`, `LEN`, `OR`, `SUBSTITUTE`). External references, network/XLM functions, and every `_xlnm.Auto_*` name fail closed.

## Existing Project projection contract

Gate B does not add, rename, delete, or reconfigure a Project field or workflow. It changes only `projectValues(task)` in `tools/sync_phase1_github.mjs` so the existing 17 managed values expose the Design hierarchy:

- `Status` remains the canonical Roadmap status and is immutable to this sync; any mismatch fails preflight. `Task summary` contains roadmap status, description, blocker count/first-eight code preview, and one next action.
- `Artifact readiness` receives only the derived `Incomplete|Ready` value.
- `Execution scope` becomes a two-line value: derived `Execution allowed: No|Yes`, then canonical `Scope: ...`.
- `Evidence` becomes ordered public-safe lines for structural validation, candidate revision, dossier digest, required evidence, references, and remaining limitation. Missing, blank, malformed, or partial candidate/digest/reference values normalize to the exact `Not yet recorded` copy; complete valid values are preserved.
- the six artifact fields plus `Task dossier` retain exact merged URLs; detailed review/coverage/authority/action records remain in the generated issue body and linked Council artifact.
- `Requirement IDs`, `Owner role`, dates, and priority retain their current meanings; R10 date blanks remain untouched.

Every Project Text value is asserted at 1,000 characters or fewer; the tool refuses rather than truncates. Before any real dry-run projection, the tool snapshots manifest/issue-map bytes, guards them before and after structural validation and immediately before projection/output, and raises `P0_CONTROL_SNAPSHOT_DRIFT` on movement. A failed validator still produces the complete 58-task review JSON with `Control validation: Failed`, exits nonzero, and blocks verify/apply before fetch or `gh`. Live apply is allowlisted to existing issue-body patches and existing non-Status Project field-value mutations only.

The 48-case sync self-test covers 30 existing-only/mutation/source-main cases and 16 projection-contract cases, including ten malformed/missing normalization cases and two snapshot-binding cases. The dry-run and `PC-001-CTL-R02` compare all 17 values. This value-only change requires no `P0-OA-002`; Project workflow/non-delivery changes are outside PC-001's current contract and denied. A future separately approved task/contract would still require the applicable owner action.

## Evaluation phases

1. **Candidate:** one commit over the exact sole-parent `baseRevision` contains the six task artifacts, canonical task contract, implementation, and evidence. `taskFiles` equals the complete non-excluded Git diff and binds every raw blob's path, SHA-256, purpose, mode, and type. Deletes, renames, type transitions, omitted paths, unsupported/compound file types, unsafe text/media/credential bytes, and unsafe XLSX packages fail closed at both candidate and current revisions.
2. **Approval/control-review record:** for a future execution-bearing task, a later normal PR adds the task's only append-only `taskApprovals` record. Git-history verification rejects a record at the candidate, any earlier/different record, or any later mutation/revert. PC-001 Gate B instead appends a non-authorizing `controlReviews.PC-001` record whose candidate is the sole child of exact Gate A base `2fc31ec905f4c664b86bebdc511a87390a24a4e9`. The record is absent at the candidate; its first later publication changes only the registry path; repository-wide history rejects deletion/rewrite and any PC-001 task approval even if the current section is empty. A complete context digest plus five seat-attestation digests bind candidate/publication manifest, workbook, historical reviewer registry, full task files, contributor roles, verification counts, vetoes, and the closed permitted claim. The current-byte partition is exact: the workflow and thirteen named tool modules are stable, while the reviewer/owner-action/task-readiness/task-state JSON and nine named Markdown documents are mutable snapshots; the six artifacts and evidence workbook keep their distinct purposes. Any unknown or missing implementation path fails. This permits later normal tracker/state/documentation reconciliation and unrelated R0 projections/evidence without rewriting the historical audit. The evaluator/runtime ignore `controlReviews`.
3. **Owner evidence and published projection:** candidate-bound human action evidence may be added only through `P0-OWNER-ACTION-STATE.json`; its task-scoped digest is frozen between approval and current main. After the approval record is on fetched main, a normal generated projection records the trusted candidate/publication result. This later projection avoids self-reference; pre-merge approval-record CI remains non-authorizing. Candidate descendants may change only six closed paths: owner-action state plus the five code-owned approval/projection surfaces (approval registry, task-artifact register, roadmap manifest, release-plan Markdown, and canonical workbook). The persisted projection omits the observed current HEAD and observed descendant-path array; exact HEAD is checked only as ephemeral activation evidence.
4. **Activation:** an importer calls `executeTaskFromExactMain` with exact task ID, scope, action, and a bounded execution callback; unknown keys and injected runners/readers/evaluators/clocks/locks are rejected. The verifier reads controls/artifacts from exact-main Git blobs, requires a clean non-detached branch tracking `origin/main` with exact `HEAD === origin/main`, verifies candidate/approval/current bytes, modes, task contract, reviewer/action context and closed descendant deltas, evaluates with fresh time, refetches/rechecks main, and evaluates again. It then passes a frozen task/revision/scope/action/deadline/AbortSignal context and awaits the callback under the lock. The deadline is at most five minutes and is capped by a private/release authority window. At deadline it aborts cooperatively but never returns or releases the lock while the callback Promise remains unsettled; an abort-ignoring callback is deliberately fail-stuck. Once the callback settles, any deadline overrun fails. Only an exact `{ok:true}` receipt that completed in time proceeds to a fresh main fetch and current-time evaluation; source movement, authority expiry, or revoked permission rejects the acknowledgment. The result means only that the bounded callback acknowledged completion while the guard remained valid through the post-callback check; it is not evidence of a substantive product, deployment, or release outcome. The caller must keep the complete action awaited inside the callback, honor cancellation, and separately prove its outcome. An enforceable worker/subprocess kill boundary would require a future API based on a serializable command/module descriptor; arbitrary in-process closures cannot supply that guarantee. The CLI is non-executing diagnostic surface and supplies no receipt.

## Refresh transaction

1. Read every target artifact plus manifest, issue map, readiness state, reviewer registry, approval registry, owner-action state, and frozen fetched-main revision before writing.
2. Compute all intended outputs and protection reasons in memory.
3. Protect any non-draft marker or any artifact/task carrying a non-Hold review, candidate binding, non-Hold seat, attestation, or evidence binding.
4. If any protected target would change, exit nonzero before the first write and report only public-safe paths/reasons.
5. Compute the register from the complete intended artifact byte set, stage every changed artifact plus the register, then recheck every source guard, target hash, and protection fact before the first promotion and again for the specific target immediately before each promotion.
6. Write and re-read a full public recovery journal, then promote only unprotected drafts and make the register the unique last promotion.
7. Before the first promotion, failure cleans staging and leaves targets unchanged. After promotion begins, failure stops immediately and never auto-restores or overwrites any target; retain staging/journal evidence for inspected recovery and deterministic rerun.
8. Refuse startup when a prior interrupted `P0-readiness-refresh-*` staging directory remains until it is inspected and recovered. The journal is not claimed durable across abrupt host loss because file and directory `fsync` are not implemented.
9. Report the transaction/source-guard/recovery result and created/refreshed/preserved counts.

The test harness injects failures and concurrent source/target/protection drift at handled boundaries. A non-cooperating writer can still act in the micro-window between a per-target recheck and rename. Cross-file promotion cannot be atomic across `SIGKILL` or host loss: a crash may leave a partial prefix of unprotected draft outputs and may occur before journal bytes are durable. The register-last invariant keeps that prefix non-authorizing because the old/stale register hashes fail validation; any surviving staging/journal marker forces inspection and deterministic rerun before further generation.

## Determinism boundary

- JSON and Markdown control outputs, sync payloads, and staged Wiki trees must be byte-identical across isolated runs with equivalent inputs.
- The canonical workbook's resolved Review Guide contains exactly one visible `Source manifest SHA-256` binding whose value equals the raw current roadmap-manifest bytes; CI rejects a clean but stale workbook.
- The workbook builder must copy one exported workbook to the canonical and task-review paths; those two published files must have an identical SHA-256.
- A second isolated workbook export is compared semantically and visually: exact sheet names/order, used ranges, every nonempty cell and formula, all 58 issue URLs and six task links, readiness counts, R10 blanks, formula errors, and all 20 rendered ranges. Different internal OOXML relationship IDs or ZIP packaging bytes are permitted only when those comparisons are identical and no public value changes.
- A packaging-only difference is recorded, never called byte determinism, and never used to excuse a cell, formula, link, count, render, or layout difference.

## Verification matrix

- `PC-001-CTL-P01`: valid `UX-R0-001` singleton `local-synthetic/synthetic-foundation` permitting path.
- `PC-001-CTL-P02`: reserved/absent as a permitting scenario; private routing is exercised only as fail-closed composite and authority evidence under N05/N06.
- `PC-001-CTL-P03`: valid `ENG-R1-001` singleton `release/authentic-text-admission` path with fictional public-safe authority/owner evidence.
- `PC-001-CTL-N01`: derived fields and every artifact/review/candidate byte gate.
- `PC-001-CTL-N02`: every Design journey/state/accessibility dimension and valid N/A route.
- `PC-001-CTL-N03`: reviewer identity, role, uniqueness, attestation, and QA independence.
- `PC-001-CTL-N04`: candidate/approval publication history/context plus dirty, stale, wrong-HEAD, unmerged, and time-window activation denial.
- `PC-001-CTL-N05`: dependency, requirement/scenario, scope/verdict, decision, blocker, action, and veto gates, including all 2,204 task/global-pair checks, 51 singleton contracts, seven composite denials, 13 historical denials, and all six denied PC future options.
- `PC-001-CTL-N06`: missing, expired, failed, wrong-scope/action/verifier/custody private authority.
- `PC-001-CTL-N07`: protected/missing-bound artifacts, source guards, concurrent drift, register-last, and injected handled-failure refresh behavior.
- `PC-001-CTL-R01`: byte-deterministic control generation and backwards-safe 58/348 all-Hold baseline.
- `PC-001-CTL-R02`: post-merge issue, Project, workbook semantic/render equivalence and same-build copy hashes, byte-deterministic Wiki, and two-snapshot parity.
- `PC-001-CTL-S01`: sensitive/public-safety and authentic-media exclusion sentinels.
- Current exact harness oracle: `341 passed, 0 failed`; execution-start self-test `62/62`; GitHub sync self-test `48/48`; audit-only control-review trust `35/35`.
- CI tracking: strict-register enumeration requires all 352 canonical generated paths to be tracked stage-zero regular `100644` Git blobs, present via `lstat`, and clean after regeneration; untracked regeneration output, symlink/non-regular replacement, wrong mode/type, or stale workbook manifest binding is a failure.

## Implementation sequence

1. Merge this planning-only six-artifact packet after five-seat exact-candidate review.
2. Add pure evaluator and its complete fixture harness; run it before integrating generator/validator.
3. Migrate the readiness schema with fail-closed defaults and reviewer/action registries.
4. Integrate generator derivation and protected refresh; prove deterministic output.
5. Integrate independent validator recomputation and runtime start verification.
6. Update CI and governing control documentation.
7. Regenerate projections/workbook and perform local QA/security/public-safety checks.
8. Obtain fresh Independent QA plus full Council review on the exact implementation candidate.
9. Merge normally, synchronize from exact main, rebuild Wiki, and obtain two zero-mismatch verifier snapshots.

## Recovery and rollback

This slice changes no product database or runtime service. Rollback is a normal revert of the merged control commit followed by deterministic regeneration from the previous schema, register, manifest, workbook, and Wiki source. Before schema adoption, capture exact hashes and validate a backwards-read path or explicit version rejection; never silently interpret a future schema with older code.

## Stop conditions

- The six planning artifacts do not receive five-seat approval at one exact candidate revision.
- Any derived field remains user-settable or any negative fixture permits execution.
- Reviewer roles/uniqueness/QA independence, per-action evidence, or authority scope cannot be proven.
- A protected file can enter the promotable set, the register is not uniquely last, any post-promotion failure lacks retained recovery evidence, generation is nondeterministic, or baseline/parity drifts.
- A private target fact, credential, authentic content, Project workflow change, or new issue becomes necessary.
- Any Sev-1/Sev-2, critical/high privacy/security issue, or specialist veto remains.

## Technical Architect disposition

**In review / Hold.** The implementation design is complete enough for exact-candidate Council review. No control-code edit starts until the merged planning packet is approved; no R0 or private work is included.
