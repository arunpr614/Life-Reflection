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
| Permission | Derived from artifacts, coverage, exact candidate, role-bound attestations, dependencies, actions, scope, blockers, and verdict. | A mutable Boolean or optimistic default. |
| Publication | Candidate review, approval-record publication, and runtime start are three explicit phases. | A self-referential approval-registry SHA. |
| Identity | Stable reviewer IDs resolve through a P0 reviewer registry to one required role; Council seats are distinct and QA is independent. | Arbitrary nonempty reviewer names. |
| Human/private evidence | Per-action and authority records are structured, public-safe, scoped, time-bounded, and opaque-reference backed. | Aggregate `ownerActionsSatisfied` or `verified` plus a regex string. |
| Refresh | Complete protection/preflight and staging occur before any target mutation; refusal leaves original hashes unchanged. | Sequential marker-only overwrites. |
| Compatibility | Existing 58 all-Hold dossiers remain valid under fail-closed defaults. | Bulk promotion or hand-written exceptions. |

## Owned implementation surface

### Existing files to modify

- `tools/P0-generate-task-artifacts.mjs` — reject derived override keys, preflight/stage refresh, project evaluator output.
- `tools/P0-validate-execution-controls.mjs` — recompute derived values unconditionally and validate role, attestation, authority, action, and exact-main contracts.
- `docs/project/P0-PHASE1-TASK-READINESS-STATE.json` — versioned input schema containing only source evidence and requested scope, never derived authorization.
- `docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json` — generated projection.
- `docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md` and `P0-PHASE1-EXECUTION-DECISIONS.md` — executable control semantics.
- `.github/workflows/prototype-syntax.yml` — run the P0 fixture harness in addition to the baseline validator.
- Generated manifest, release plan, issue projection, workbook inputs, Wiki projection, and documentation index only when their source fields change.

### New P0-prefixed files planned

- `tools/P0-readiness-gates.mjs` — pure normalization, digest, gate evaluation, and stable reason codes.
- `tools/P0-test-execution-controls.mjs` — table-driven positive, negative, determinism, refresh-protection, and safety fixtures.
- `tools/P0-verify-execution-start.mjs` — task start/runtime preflight requiring clean `HEAD === fetched origin/main` and derived permission.
- `docs/council/execution/P0-EXECUTION-REVIEWER-REGISTRY.json` — stable public-safe reviewer IDs and allowed roles.
- `docs/council/execution/P0-OWNER-ACTION-STATE.json` — machine-readable, public-safe per-action status/evidence projection aligned to the Markdown ledger.

No new unprefixed document, artifact, tool, fixture, or output basename may be introduced. Existing canonical/generated names remain grandfathered.

## Data contracts

### Reviewer and attestation

Each approved artifact review and permitting Council seat contains `reviewerId`, `reviewedRevision`, `artifactSha256` where applicable, `dossierDigest`, `evidenceReference`, and `attestationDigest`. The registry resolves `reviewerId` to exactly one required seat role. The five Council reviewer IDs must be unique. The QA reviewer ID must not appear in the candidate's `implementerIds` or evidence-producer IDs.

`attestationDigest` is the SHA-256 of a canonical payload containing task ID, artifact kind or seat, verdict/decision, reviewer ID/role, reviewed revision, dossier digest, artifact hash where applicable, and evidence reference. A changed field invalidates the attestation.

### Owner action

Each action record contains `actionId`, `status`, `requiredForScopeClasses`, `result`, `verifierId`, `verifierRole`, `verifiedAt`, and `evidenceReference`. The evaluator derives satisfaction only for actions due for the requested scope. Pending future actions do not block a local scope; a due action without passing evidence does.

### Private authority

A private-permitting record contains `authorityId`, `taskId`, `scopeClass`, `allowedActionClass`, `verifierId`, `verifierRole`, `windowStart`, `windowEnd`, `result=pass`, `ownerActionId=P0-OA-001`, `evidenceReference`, and candidate binding. It must be current and compatible with the requested action. No target/account/topology/credential/raw evidence is stored publicly.

### Derived result

The evaluator returns:

- `artifactReadiness`: `Incomplete` or `Ready`;
- `executionDecision`: one canonical human-readable decision;
- `executionAllowed`: Boolean;
- `gateResults`: ordered `{code, passed, reason}` records; and
- normalized evidence used to compute the result.

Unknown, malformed, missing, stale, duplicate, expired, or mismatched evidence fails closed. Stable gate codes are public-safe and include the task ID and corrective action in CLI output.

## Existing Project projection contract

Gate B does not add, rename, delete, or reconfigure a Project field or workflow. It changes only `projectValues(task)` in `tools/sync_phase1_github.mjs` so the existing 17 managed values expose the Design hierarchy:

- `Status` remains the canonical Roadmap status; `Task summary` starts with `Roadmap status: Planning Done — historical` for PC-001, followed by stable blockers and one next action.
- `Artifact readiness` receives only the derived `Incomplete|Ready` value.
- `Execution scope` becomes a two-line value: derived `Execution allowed: No|Yes`, then canonical `Scope: ...`.
- `Evidence` becomes ordered public-safe lines for structural validation, candidate revision, dossier digest, required evidence, references, and remaining limitation.
- the six artifact fields plus `Task dossier` retain exact merged URLs; detailed review/coverage/authority/action records remain in the generated issue body and linked Council artifact.
- `Requirement IDs`, `Owner role`, dates, and priority retain their current meanings; R10 date blanks remain untouched.

The sync dry-run and `PC-001-CTL-R02` compare all 17 values. This value-only change requires no `P0-OA-002`; any future field/view/workflow mutation is outside this plan and remains gated.

## Evaluation phases

1. **Candidate:** six task artifacts are committed; reviews bind exact candidate bytes and dossier digest.
2. **Approval record:** a later normal PR records structured reviews/attestations. Structural CI proves candidate publication and internal consistency; it does not claim runtime activation.
3. **Activation:** after merge, `P0-verify-execution-start.mjs --task <ID>` fetches `origin`, requires a clean worktree, current branch/main relationship, exact `HEAD === origin/main`, a published approval record, and derived permission. External synchronization may consume permission only from this state.

## Refresh transaction

1. Read every target artifact and the entire readiness input before writing.
2. Compute all intended outputs and protection reasons in memory.
3. Protect any non-draft marker or any artifact/task carrying a non-Hold review, candidate binding, non-Hold seat, attestation, or evidence binding.
4. If any protected target would change, exit nonzero before the first write and report only public-safe paths/reasons.
5. Stage every new file, verify staged hashes, then promote the complete planned set; on a handled failure restore original bytes and verify original hashes.
6. Recompute the register only after successful promotion; report created/refreshed/preserved counts.

The test harness injects failures at every handled write boundary and requires original artifact/register hashes and filenames to remain unchanged.

## Determinism boundary

- JSON and Markdown control outputs, sync payloads, and staged Wiki trees must be byte-identical across isolated runs with equivalent inputs.
- The workbook builder must copy one exported workbook to the canonical and task-review paths; those two published files must have an identical SHA-256.
- A second isolated workbook export is compared semantically and visually: exact sheet names/order, used ranges, every nonempty cell and formula, all 58 issue URLs and six task links, readiness counts, R10 blanks, formula errors, and all 20 rendered ranges. Different internal OOXML relationship IDs or ZIP packaging bytes are permitted only when those comparisons are identical and no public value changes.
- A packaging-only difference is recorded, never called byte determinism, and never used to excuse a cell, formula, link, count, render, or layout difference.

## Verification matrix

- `PC-001-CTL-P01`: valid local-synthetic permitting path.
- `PC-001-CTL-P02`: fictional structured private-authority path.
- `PC-001-CTL-N01`: derived fields and every artifact/review/candidate byte gate.
- `PC-001-CTL-N02`: every Design journey/state/accessibility dimension and valid N/A route.
- `PC-001-CTL-N03`: reviewer identity, role, uniqueness, attestation, and QA independence.
- `PC-001-CTL-N04`: candidate/approval publication plus dirty, stale, wrong-HEAD, and unmerged activation denial.
- `PC-001-CTL-N05`: dependency, requirement/scenario, scope/verdict, decision, blocker, action, and veto gates.
- `PC-001-CTL-N06`: missing, expired, failed, wrong-scope/action/verifier/custody private authority.
- `PC-001-CTL-N07`: protected and injected-failure refresh with zero partial mutation.
- `PC-001-CTL-R01`: byte-deterministic control generation and backwards-safe 58/348 all-Hold baseline.
- `PC-001-CTL-R02`: post-merge issue, Project, workbook semantic/render equivalence and same-build copy hashes, byte-deterministic Wiki, and two-snapshot parity.
- `PC-001-CTL-S01`: sensitive/public-safety and authentic-media exclusion sentinels.

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
- Refresh can partially mutate protected files, generation is nondeterministic, or baseline/parity drifts.
- A private target fact, credential, authentic content, Project workflow change, or new issue becomes necessary.
- Any Sev-1/Sev-2, critical/high privacy/security issue, or specialist veto remains.

## Technical Architect disposition

**In review / Hold.** The implementation design is complete enough for exact-candidate Council review. No control-code edit starts until the merged planning packet is approved; no R0 or private work is included.
