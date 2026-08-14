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

## Current workbook evidence

Pre-candidate workbook QA established the layout, pagination, semantic-count, R10, formula, and closed-archive checks used by R02/S01. It is deliberately not the final Gate B evidence. The final candidate workbook hash and independent disposition belong in the later audit-only `controlReviews.PC-001` entry of `P0-EXECUTION-APPROVAL-REGISTRY.json`, not this source artifact: embedding the output hash here would change this artifact hash, the manifest, the workbook's visible manifest digest, and therefore the output hash again. `controlReviews` is disjoint from execution-permitting `taskApprovals`, is ignored by readiness/runtime evaluation, and cannot approve execution or deployment.

## Required executable harness

`tools/P0-test-execution-controls.mjs` must run as a P0-prefixed, dependency-light test entrypoint with real assertions and a nonzero exit on any failure. It must exercise the shared pure evaluator, protected-refresh planner/transaction, validator integration, and start preflight. Aggregate-only negative coverage is insufficient: each predicate has its own isolated mutation and stable expected gate code.

## Positive paths

| ID | Fixture | Expected result |
| --- | --- | --- |
| `PC-001-CTL-P01` | `UX-R0-001` singleton `local-synthetic/synthetic-foundation`, six valid reviews, applicable Design coverage, five unique role-bound seats, independent QA, exact published candidate bytes, dependencies satisfied, and no open decisions/blockers. | Derives `Artifact readiness: Ready`, local-synthetic decision, `executionAllowed=true`, and zero failed gates. |
| `PC-001-CTL-P02` | Reserved/absent as a permitting case. Private read/workflow routing remains fictional negative evidence because every current private-bearing contract is composite or outside PC-001's current singleton. | N05/N06 prove exact owner-action intersection and authority rejection without claiming a private permit. |
| `PC-001-CTL-P03` | `ENG-R1-001` singleton `release/authentic-text-admission` with fictional accountable-human authority, `P0-OA-001` and `R1-OA-001`, release evidence, and exact `proceed-release` verdict. | Release permission derives only when every private, human, lifecycle, and release gate passes. No real provider, deployment, spend, or authentic-media evidence is used. |

## One-gate-at-a-time negative matrix

| ID | Independent mutations | Required oracle |
| --- | --- | --- |
| `PC-001-CTL-N01` | Missing artifact; duplicate/conflicting/noncanonical task-kind-state marker; wrong content/effective state; review Hold; hash, revision, dossier, or candidate-byte mismatch; unpublished candidate; unsupported/disguised local file type; invalid UTF-8/NUL/binary magic/encoded-media/credential bytes; unsafe XLSX package, relationship, formula, content type, comment, extra field, or XML payload; invalid Architecture/Design N/A; missing specialist concurrence; supplied readiness/decision/permission. | Each mutation returns its named artifact/content/derivation gate, `executionAllowed=false`, and no trusted derived override. |
| `PC-001-CTL-N02` | Remove each Design journey, each normal/empty/loading/error/interruption/destructive dimension, and each keyboard/focus/screen-reader/target-size/contrast/zoom/reduced-motion dimension separately. | Each required coverage mutation fails; Design N/A passes only with concrete rationale and Designer concurrence. |
| `PC-001-CTL-N03` | Missing reviewer ID; unknown ID; wrong role; duplicate seat ID; unresolved or tampered attestation; revision/digest mismatch; QA equals implementer; QA equals evidence-producing test author; any specialist veto. | Each denies with its identity/independence/attestation gate. |
| `PC-001-CTL-N04` | Candidate absent from fetched main; wrong/multiple parent; incomplete full-diff manifest; raw-byte or mode drift; deletion/rename/type transition; candidate task-contract drift; forbidden descendant path; approval record unmerged; stale/moving remote before, during, or after the callback; dirty checkout; detached/wrong branch relationship; `HEAD != origin/main`; wrong caller scope/action; missing guarded callback; callback deadline/authority expiry; abort-ignoring delayed settlement or cleanup; external sync source not exact clean main. Audit-only control-review negatives include wrong Gate A base, record at candidate, non-registry publication delta, missing/deleted/rewritten record, any PC-001 task approval, context/seat/contributor/reviewer-registry/hash/count drift, and changed reviewed control bytes. | Structural candidate review, audit-only control publication, execution approval publication, generated projection, and guarded runtime execution are distinguished. The shorter control/authority deadline aborts cooperatively; the verifier remains fail-stuck under the lock until callback settlement, every overrun fails, and a fresh post-callback Git/time/evaluator check is mandatory before acknowledgment. No control-review case activates or publishes task permission. |
| `PC-001-CTL-N05` | Missing dependency evidence; unknown/mismatched requirement or scenario; incompatible scope/verdict; unknown task; sibling-task or cross-milestone action request; multiple execution actions in one approval; open decision; unresolved blocker; no canonical action intersecting the requested pair; due intersecting action pending/failed; specialist veto. | Each independently denies and names the corrective action. The harness performs all 2,204 task/global-pair checks, proves 51 singleton contracts, denies all seven composites, denies all 13 historical records even with later approvals, denies unknowns, denies all six PC future options, and proves exact R0 owner-action routing. |
| `PC-001-CTL-N06` | Private authority missing; regex-only; expired/not-yet-valid; failed; wrong task/scope/action/verifier/Owner Action/candidate; missing opaque custody reference; unmatched per-action record. | Every case denies private execution; local scope is unaffected only when no private action is requested. |
| `PC-001-CTL-N07` | Non-draft marker; missing protected artifact; non-Hold artifact review; candidate binding; non-Hold seat; attestation/evidence binding; concurrent source/target/protection drift before each promotion; injected handled failure at every stage/promote boundary. | Before promotion, refresh exits nonzero, cleans staging, and leaves originals unchanged. After promotion begins it stops without overwriting, retains staging plus a verified recovery journal, and remains non-authorizing; register-last validation detects every partial prefix. |

## Regression, parity, and safety matrix

| ID | Coverage | Required oracle |
| --- | --- | --- |
| `PC-001-CTL-R01` | Two isolated JSON/Markdown control generations; second run; changed cwd, locale, and wall clock; current 58 dossiers. | Byte-identical control outputs and zero second-run diff. For this planning phase, the exact live oracle is 58 Incomplete/0 Ready/0 allowed with `342 draft / 6 in-review / 0 approved / 0 blocked / 0 not-applicable`; statuses `40/4/1/13`, seven deferred IDs, deployment Unknown, and authentic-media access false. Each later phase records and reviews its expected representation before comparison; no test may silently reset all 348 artifacts to Draft. |
| `PC-001-CTL-R02` | Register, manifest, issue bodies, the existing 17 managed Project values, all 352 generated targets, two isolated seven-sheet workbook builds, two Wiki builds, Page Audit, closed stable/mutable task-file partition, and two live verify snapshots after final merge. | Every generated target is a tracked, present, clean regular `100644` Git blob. The sync oracle is 48/48: captured manifest/issue-map bytes remain unchanged across validator/projection/output; missing, blank, malformed, or partial bindings normalize to `Not yet recorded`; two Failed dry-runs emit identical complete 58-task review JSON and exit 1; verify/apply stop before fetch or `gh`. Candidate/publication bytes bind all 34 task files. The current partition must resolve exactly to one workflow plus thirteen stable tool modules and thirteen mutable documentation/state snapshots; unknown, missing, or reclassified implementation paths fail. The resolved Review Guide contains exactly one labeled SHA-256 equal to the raw current manifest bytes. There are 58 issue links/tasks, R10 dates blank, and zero formula/layout errors. Canonical and review workbook copies from one export have matching hashes; isolated exports have identical sheets, used ranges, cells, formulas, links, counts, and 20 rendered ranges even if internal OOXML relationship IDs differ. Wiki staging trees are byte-identical with zero live-only loss. Two quiescent issue/Project snapshots have zero mismatch. |
| `PC-001-CTL-S01` | Inject GitHub/Slack/Bearer/generic/API/Telegram/AWS/Google/credentialed-URL secrets, private key, private URL/host/account/topology, Project node ID, recovery value, raw response, authentic journal/photo, binary media renamed as text, Base64/data-URI/SVG media, and photo-derived sentinels. Exercise the closed XLSX part/content-type relationship and eight-function formula allowlists. | Candidate/current byte verification, repository validation, and workbook archive validation reject every payload. No image decode/render/OCR/thumbnail/screenshot, AI call, or private network access occurs. |

## Task-level QA scenarios

1. **`PC-001-QA-001` — Happy paths:** P01 and P03 pass with exact derived results; no current private-bearing composite contract permits.
2. **`PC-001-QA-002` — Fail-closed behavior:** N01–N07 each reject every isolated mutation with stable gate code and no partial state.
3. **`PC-001-QA-003` — Privacy/security/authorization:** identity, attestation, scope, authority, action, sensitive-sentinel, and authentic-media exclusions pass.
4. **`PC-001-QA-004` — Compatibility/recovery:** schema version handling, deterministic regeneration, pre-promotion no-write cleanup, post-promotion journal/staging retention without automatic overwrite, and normal Git revert evidence preserve a fail-closed recovery path.
5. **`PC-001-QA-005` — Operator accessibility:** exact labels, semantic Markdown/table structure, non-color cues, linear reading order, wrapping/zoom behavior, keyboard/focus, and full identifier retrieval are reviewed on rendered outputs where applicable.
6. **`PC-001-QA-006` — Delivery parity:** R01/R02 prove status, requirements, issue, Project, workbook, Wiki, source, and deployment-state truth.

## Required commands and evidence

The implementation candidate must record exact Node and Git versions plus commands equivalent to:

```sh
node tools/P0-test-execution-controls.mjs
node tools/P0-test-control-review-trust.mjs
node tools/P0-verify-execution-start.mjs --self-test
node tools/sync_phase1_github.mjs --self-test
node tools/P0-generate-task-artifacts.mjs
node tools/generate_phase1_roadmap_manifest.mjs
node tools/P0-validate-execution-controls.mjs
node tools/P0-verify-generated-tracking.mjs
node tools/sync_phase1_github.mjs
git diff --check
```

Current expected local oracles are `341 passed, 0 failed` for readiness controls, `62/62` for execution-start, `48/48` for GitHub sync, and `35/35` for audit-only control-review trust. A failed sync validator must still produce deterministic review JSON and exit nonzero, while verify/apply must stop before network access.

Start verification is tested with fictional task inputs and run for a real task only after its merged approval record exists. GitHub/Project apply, workbook publication, and Wiki publication occur only after implementation review and merge under their existing dry-run-first contracts.

Evidence records scenario ID, source revision, fixture fingerprint, expected/actual result, stable gate codes, artifact hashes, tool versions, reviewer ID/role/independence, timestamps, defects/retests, public-safety result, remaining limitations, and exact permitted claim.

## Independence and severity gate

The Independent QA reviewer must not implement the controls or author the evidence-producing test result it certifies. Any negative fixture permitting execution, unresolved Sev-1/Sev-2, critical/high privacy or security finding, identity/authority weakness, partial write, protected overwrite, nondeterminism, generated drift, parity mismatch, authentic-media interaction, private access, or specialist veto is release-blocking.

## Independent QA disposition

**In review / Hold.** The matrix is complete for exact-candidate Council review. Code may start only after five-seat approval of this planning packet; the exact implementation candidate requires a fresh independent rerun and Council decision.
