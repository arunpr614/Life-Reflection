# PC-001 — readiness-control hardening product requirements

- **Task ID:** `PC-001`
- **Artifact kind:** `product`
- **Artifact state:** `in-review`
- **Roadmap status:** `Done` — historical planning only
- **Milestone:** `P0`
- **Execution allowed:** `false`
- **Scale and stage:** corrective control enhancement; planning candidate in review
- **Team:** Life in Days Phase 1 Product Council
- **Authoring role:** Expert Product Manager
- **Triad partners:** UI/UX Designer and Technical Architect seats
- **Legal contact / applicable countries / market segments:** N/A — internal single-owner governance tooling; no product/data-capture change
- **Evidence boundary:** this packet supports audit-only exact-candidate review and normal merge/reconciliation of local/public readiness-control hardening. It cannot authorize PC-001 task execution: PC-001 remains `historical-non-authorizing`, and `controlReviews.PC-001` is ignored by readiness/runtime evaluation. It does not authorize R0 feature work, private access, authentic content, deployment, release, or production use.

## Parent product and control sources

- [Governing product requirements](../../product/PRODUCT-REQUIREMENTS.md)
- [Phase 1 execution authorization](../../council/execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md)
- [Task Definition of Ready](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [Published P0 control review](../../council/execution/releases/P0-P0-EXECUTION-CONTROL-REVIEW.md)

## Context and problem

At Gate A, the P0 control plane correctly held all 58 tasks, but its first execution-permitting path had never run. Editable input could supply `artifactReadiness`, `executionDecision`, and `executionAllowed`; the validator evaluated the complete gate set only after `executionAllowed` was already true. Reviewer identity was free text, private authority was regex-level metadata, and `--refresh-drafts` could rely on a Markdown state marker after external review evidence existed. The Gate B candidate must prove those defects are removed without turning PC-001 or any R0 task into an executable task.

That asymmetry makes the future first Ready decision vulnerable to stale, optimistic, or weakly bound input. The corrective slice must make authorization a reproducible result of evidence, never an assertion supplied by an override.

## Outcome

Harden the existing 58-task control plane so one shared evaluator derives readiness and execution authorization from exact task artifacts, publication evidence, five role-bound Council attestations, dependency evidence, per-action human gates, scope-compatible authority, and blockers. Prove the permitting and rejecting paths with fictional fixtures before any R0 task may pass the Definition of Ready.

## Goals

1. Preserve the current truthful all-Hold baseline while removing every direct path that can assert derived readiness or permission.
2. Give Product Council and operators one deterministic, public-safe explanation of why a task is or is not permitted to start.
3. Prevent review evidence, candidate bindings, or attestations from being overwritten by draft refresh.
4. Require clean, exact, fetched `origin/main` state at the moment an approved task is activated or externally synchronized.

## Stakeholders

- **Primary operator:** Project Manager maintaining issue, Project, workbook, Wiki, and status parity.
- **Decision makers:** Product Manager, UI/UX Designer, Technical Architect, Independent QA, and Project Manager as five distinct Council seats.
- **Implementer:** the primary Codex integrator for this bounded corrective slice.
- **Human authority:** Product Owner or designated deployment authority only when a later private/human gate becomes due; no owner action is due for this local/public hardening.

## Corrective P0 requirements

| ID | Product requirement | Acceptance boundary |
| --- | --- | --- |
| `PC-001-CR-001` | Artifact readiness is derived from the six effective artifact states. | Product, QA, Delivery, and Council are approved; Architecture and Design are approved or validly not applicable; a stale `Incomplete` or false `Ready` projection fails validation. |
| `PC-001-CR-002` | Execution decision and `executionAllowed` are derived from one fail-closed gate evaluation. | Overrides cannot supply either field; every failed gate yields `executionAllowed=false` and named reasons. |
| `PC-001-CR-003` | Both permitting paths and each atomic rejection path are executable fixtures. | The canonical positives are `UX-R0-001` at `local-synthetic/synthetic-foundation` and `ENG-R1-001` at `release/authentic-text-admission` with fictional public-safe authority evidence; one isolated negative mutation per gate runs in CI. No current private-bearing composite contract permits. |
| `PC-001-CR-004` | Candidate approval and runtime activation are separate, non-self-referential phases. | Reviews bind an exact published candidate and artifact digest; actual start and external sync require a clean checkout whose `HEAD` exactly equals fetched `origin/main`. A bounded runtime callback is deadline/cancellation aware and is acknowledged only after a fresh post-callback main/time/permission check. |
| `PC-001-CR-005` | Reviewers are registry-backed and role-bound. | Five distinct seat identities map to exact roles; attestations bind revision and digest; the QA identity is neither implementer nor evidence-producing test author. |
| `PC-001-CR-006` | Private authority and owner actions are structured, exact-task compatible, and scope/action specific. | All 58 task IDs have an immutable explicit allowlist intersected with the global scope and milestone ceiling. The exact catalog has 51 singleton contracts and seven composite contracts (`SPK-R0-001`, `ARCH-R0-001`, `ENG-R0-001`, `REL-R0-001`, `SPK-R5-001`, `EVAL-R6-001`, `EVAL-R7-001`); every composite fails `TASK_EXECUTION_CONTRACT_CARDINALITY` until Council approves a task split or future staged schema. Thirteen historical records, including PC-001, can never be reactivated by a later task approval. PC-001's current singleton is `local-synthetic/readiness-control-hardening`; its six other options are future-only and denied. The harness checks all 2,204 task/global-pair combinations. Public-safe records bind task, requested pair, verifier identity/role, validity window, pass result, opaque custody reference, and every Owner Action due for that pair. Regex-only evidence never permits. |
| `PC-001-CR-007` | Draft refresh is protected and mutation-safe. | Complete source/target/protection preflight and staging precede mutation. A pre-promotion refusal leaves originals unchanged; after the first promotion the transaction stops without overwriting, retains a verified recovery journal/staging, and cannot authorize because the register is the unique last target. |
| `PC-001-CR-008` | Human-facing evidence is unambiguous and accessible. | Roadmap status, artifact readiness, execution permission, blockers, next action, exact bindings, and validation outcome remain distinct in CLI, Markdown, issues, Project, workbook, and Wiki. |
| `PC-001-CR-009` | Generation and projections remain deterministic or equivalently verified according to artifact type. | JSON/Markdown control generation and Wiki builds are byte-identical across isolated runs. All 352 canonical generated targets remain tracked regular `100644` Git blobs and clean after regeneration. The workbook visibly binds the exact source-manifest SHA-256; canonical and review copies from one build have matching hashes, while isolated builds have identical sheets, cells, formulas, links, counts, and renders even if the spreadsheet library emits different internal OOXML relationship IDs. The 58-task baseline, seven deferred requirements, issue/Project/workbook/Wiki projections, and two quiescent parity snapshots have zero unexplained semantic drift. |
| `PC-001-CR-010` | Public controls remain private- and authentic-data blind. | Tests reject sensitive sentinels; no private connection or authentic-media processing occurs; deployment stays `Unknown — private read authority pending`. |

## Product acceptance scenarios

1. **`PC-001-P-001` — Derived permission:** canonical singleton local and release fixtures produce the exact expected derived readiness, decision, and permission; fictional authority/owner evidence is exercised on the release path, and every one-gate mutation fails closed with a stable reason.
2. **`PC-001-P-002` — Trust boundary:** role identity, QA independence, owner-action evidence, private authority, exact-main activation, and public-safety rules reject incomplete, stale, mismatched, expired, or sensitive input.
3. **`PC-001-P-003` — Delivery truth:** all-Hold compatibility, deterministic generation, protected refresh, issue/Project/workbook/Wiki parity, and status semantics remain exact without implying product implementation or deployment.

## Success metrics

- Zero editable derived authorization fields.
- Two positive singleton execution fixtures, all 2,204 task/global-pair checks, and at least one isolated negative fixture for every gate predicate; the expected harness result is `341 passed, 0 failed`.
- Zero negative fixtures that permit execution; zero partial writes on a refused refresh.
- Two byte-identical isolated control/Wiki generations; matching canonical/review workbook hashes from one build plus cross-build semantic/render equivalence; and two quiescent live verifier snapshots with zero mismatches.
- 58 canonical tasks, 348 task artifacts, 71 active requirements, seven deferred requirements, and status distribution `40/4/1/13` preserved unless a separately approved product change alters them.

## Non-goals

- No Life in Days application UI, prototype, R0 feature, host probe, credential use, private read, deployment, migration, backup, restore, or release work.
- No 59th task or issue, no issue #3 status/state change, and no Project workflow-rule change.
- No approval of any R0 dossier and no inference that historical `Done` means execution-ready.
- No private target/account detail, credential, recovery value, raw response, authentic journal, photo, or photo-derived data in public evidence.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| A bootstrap correction appears to authorize itself. | Keep `executionAllowed=false`; merge this planning packet before code edits; require a fresh five-seat code review afterward. |
| Publication checks become self-referential. | Separate task-candidate review, approval-record publication, and runtime exact-main activation. |
| A broad schema migration disturbs 58 truthful Hold dossiers. | Use backwards-safe defaults and prove the existing 58/348 baseline byte-for-byte or with reviewed deterministic deltas. |
| Public evidence leaks private authority detail. | Store only scope class, verifier role/ID, window, pass/fail, Owner Action link, and opaque reference; scan sensitive sentinels. |

## Required acceptance evidence

The merged planning candidate, five exact-candidate Council dispositions, implementation commit and diff, automated fixture matrix, independent QA rerun, clean-main activation check, deterministic generation evidence, regenerated register/manifest/workbook, issue and Project verification, source-aligned Wiki audit, append-only running-log entry, and two zero-mismatch parity snapshots.

## Product Manager disposition

**In review / Hold.** The corrective requirements are bounded and ready for exact-candidate Council review. Control-code edits may begin only after all five seats approve the committed planning packet; all R0 and private work remain held.
