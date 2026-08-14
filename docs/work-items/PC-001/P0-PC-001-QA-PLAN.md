# PC-001 — readiness-control hardening QA plan

- **Task ID:** `PC-001`
- **Artifact kind:** `qa`
- **Artifact state:** `in-review`
- **Roadmap status:** `Done` — historical planning only
- **Milestone:** `P0`
- **Execution allowed:** `false`
- **Fixture class:** fictional/synthetic only
- **Evidence boundary:** scenario design is not executed evidence. No R0, private-system, authentic-content, deployment, or release claim is permitted.

## Inputs

- [Task product requirements](./P0-PC-001-PRD.md)
- [Task technical plan](./P0-PC-001-TECHNICAL-PLAN.md)
- [Task design specification](./P0-PC-001-DESIGN-SPEC.md)
- [Task Definition of Ready](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [Independent QA charter](../../council/agents/P0-QA-LEAD.md)

## Test objective

Prove that the first future execution-permitting decision can be reached only from complete, published, role-bound, scope-compatible evidence, and that every atomic missing or contradictory input independently fails closed. Preserve the current all-Hold baseline and public/privacy boundaries.

## Required executable harness

`tools/P0-test-execution-controls.mjs` must run as a P0-prefixed, dependency-light test entrypoint with real assertions and a nonzero exit on any failure. It must exercise the shared pure evaluator, protected-refresh planner/transaction, validator integration, and start preflight. Aggregate-only negative coverage is insufficient: each predicate has its own isolated mutation and stable expected gate code.

## Positive paths

| ID | Fixture | Expected result |
| --- | --- | --- |
| `PC-001-CTL-P01` | Six valid reviews, applicable Design coverage, five unique role-bound seats, independent QA, exact published candidate bytes, dependencies satisfied, no open decisions/blockers, due actions satisfied, and `ready-local-synthetic`. | Derives `Artifact readiness: Ready`, local-synthetic decision, `executionAllowed=true`, and zero failed gates. |
| `PC-001-CTL-P02` | P01 plus fictional structured authority and per-action evidence binding task, private scope/action, verifier, current window, pass, candidate, and opaque reference. | Matching private verdict permits; no private target detail is present. |

## One-gate-at-a-time negative matrix

| ID | Independent mutations | Required oracle |
| --- | --- | --- |
| `PC-001-CTL-N01` | Missing artifact; wrong content/effective state; review Hold; hash, revision, dossier, or candidate-byte mismatch; unpublished candidate; invalid Architecture/Design N/A; missing specialist concurrence; supplied readiness/decision/permission. | Each mutation returns its named artifact/derivation gate, `executionAllowed=false`, and no trusted derived override. |
| `PC-001-CTL-N02` | Remove each Design journey, each normal/empty/loading/error/interruption/destructive dimension, and each keyboard/focus/screen-reader/target-size/contrast/zoom/reduced-motion dimension separately. | Each required coverage mutation fails; Design N/A passes only with concrete rationale and Designer concurrence. |
| `PC-001-CTL-N03` | Missing reviewer ID; unknown ID; wrong role; duplicate seat ID; unresolved or tampered attestation; revision/digest mismatch; QA equals implementer; QA equals evidence-producing test author; any specialist veto. | Each denies with its identity/independence/attestation gate. |
| `PC-001-CTL-N04` | Candidate absent from fetched main; approval record unmerged; stale remote; dirty checkout; detached/wrong branch relationship; `HEAD != origin/main`; external sync source not exact clean main. | Structural candidate review and runtime activation are distinguished; no case activates or publishes permission. |
| `PC-001-CTL-N05` | Missing dependency evidence; unknown/mismatched requirement or scenario; incompatible scope/verdict; open decision; unresolved blocker; due action pending/failed; specialist veto. | Each independently denies and names the corrective action. |
| `PC-001-CTL-N06` | Private authority missing; regex-only; expired/not-yet-valid; failed; wrong task/scope/action/verifier/Owner Action/candidate; missing opaque custody reference; unmatched per-action record. | Every case denies private execution; local scope is unaffected only when no private action is requested. |
| `PC-001-CTL-N07` | Non-draft marker; non-Hold artifact review; candidate binding; non-Hold seat; attestation/evidence binding; injected handled failure at every staged/promote boundary. | Refresh exits nonzero and all original artifact/register paths and hashes remain unchanged; no partial or temporary public output remains. |

## Regression, parity, and safety matrix

| ID | Coverage | Required oracle |
| --- | --- | --- |
| `PC-001-CTL-R01` | Two isolated runs; second run; changed cwd, locale, and wall clock; current 58 dossiers. | Byte-identical deterministic outputs, zero second-run diff, 58 Incomplete/0 Ready/0 allowed and 348 Draft unless the reviewed schema migration intentionally changes only representation; statuses `40/4/1/13`, seven deferred IDs, deployment Unknown, and authentic-media access false. |
| `PC-001-CTL-R02` | Register, manifest, issue bodies, 17 Project fields, seven-sheet workbook, Wiki build, Page Audit, and two live verify snapshots after final merge. | Exact source SHA, 58 issue links/tasks, R10 dates blank, formulas/renders valid, deterministic Wiki, zero live-only loss, and two quiescent zero-mismatch snapshots. |
| `PC-001-CTL-S01` | Inject credential, private key, private URL/host/account/topology, Project node ID, recovery value, raw response, authentic journal/photo, and photo-derived sentinels. | Every public generation/validation path rejects the sentinel. No image decode/render/OCR/thumbnail/screenshot, AI call, or private network access occurs. |

## Task-level QA scenarios

1. **`PC-001-QA-001` — Happy paths:** P01 and P02 pass with exact derived results.
2. **`PC-001-QA-002` — Fail-closed behavior:** N01–N07 each reject every isolated mutation with stable gate code and no partial state.
3. **`PC-001-QA-003` — Privacy/security/authorization:** identity, attestation, scope, authority, action, sensitive-sentinel, and authentic-media exclusions pass.
4. **`PC-001-QA-004` — Compatibility/recovery:** schema version handling, deterministic regeneration, refresh rollback, and normal Git revert evidence preserve prior accepted state.
5. **`PC-001-QA-005` — Operator accessibility:** exact labels, semantic Markdown/table structure, non-color cues, linear reading order, wrapping/zoom behavior, keyboard/focus, and full identifier retrieval are reviewed on rendered outputs where applicable.
6. **`PC-001-QA-006` — Delivery parity:** R01/R02 prove status, requirements, issue, Project, workbook, Wiki, source, and deployment-state truth.

## Required commands and evidence

The implementation candidate must record exact Node and Git versions plus commands equivalent to:

```sh
node tools/P0-test-execution-controls.mjs
node tools/P0-generate-task-artifacts.mjs
node tools/generate_phase1_roadmap_manifest.mjs
node tools/P0-validate-execution-controls.mjs
node tools/sync_phase1_github.mjs
git diff --check
```

Start verification is tested with fictional task inputs and run for a real task only after its merged approval record exists. GitHub/Project apply, workbook publication, and Wiki publication occur only after implementation review and merge under their existing dry-run-first contracts.

Evidence records scenario ID, source revision, fixture fingerprint, expected/actual result, stable gate codes, artifact hashes, tool versions, reviewer ID/role/independence, timestamps, defects/retests, public-safety result, remaining limitations, and exact permitted claim.

## Independence and severity gate

The Independent QA reviewer must not implement the controls or author the evidence-producing test result it certifies. Any negative fixture permitting execution, unresolved Sev-1/Sev-2, critical/high privacy or security finding, identity/authority weakness, partial write, protected overwrite, nondeterminism, generated drift, parity mismatch, authentic-media interaction, private access, or specialist veto is release-blocking.

## Independent QA disposition

**In review / Hold.** The matrix is complete for exact-candidate Council review. Code may start only after five-seat approval of this planning packet; the exact implementation candidate requires a fresh independent rerun and Council decision.
