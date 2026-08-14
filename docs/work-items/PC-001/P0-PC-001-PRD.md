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
- **Evidence boundary:** this packet may authorize only local/public readiness-control hardening after exact-candidate five-seat review. It does not authorize R0 feature work, private access, authentic content, deployment, release, or production use.

## Parent product and control sources

- [Governing product requirements](../../product/PRODUCT-REQUIREMENTS.md)
- [Phase 1 execution authorization](../../council/execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md)
- [Task Definition of Ready](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [Published P0 control review](../../council/execution/releases/P0-P0-EXECUTION-CONTROL-REVIEW.md)

## Context and problem

The P0 control plane correctly holds all 58 tasks today, but its first execution-permitting path has never run. Editable input can currently supply `artifactReadiness`, `executionDecision`, and `executionAllowed`; the validator evaluates the complete gate set only after `executionAllowed` is already true. Reviewer identity is free text, private authority is regex-level metadata, and `--refresh-drafts` can rely on a Markdown state marker after external review evidence exists.

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
| `PC-001-CR-003` | Both permitting paths and each atomic rejection path are executable fixtures. | A positive local-synthetic case, a fictional private-authority case, and one isolated negative mutation per gate run in CI. |
| `PC-001-CR-004` | Candidate approval and runtime activation are separate, non-self-referential phases. | Reviews bind an exact published candidate and artifact digest; actual start and external sync require a clean checkout whose `HEAD` exactly equals fetched `origin/main`. |
| `PC-001-CR-005` | Reviewers are registry-backed and role-bound. | Five distinct seat identities map to exact roles; attestations bind revision and digest; the QA identity is neither implementer nor evidence-producing test author. |
| `PC-001-CR-006` | Private authority and owner actions are structured and scope-specific. | Public-safe records bind task, requested scope/action, verifier identity/role, validity window, pass result, opaque custody reference, and the due Owner Action ID. Regex-only evidence never permits. |
| `PC-001-CR-007` | Draft refresh is protected and mutation-safe. | All targets are preflighted before the first write; any marker, review, candidate, seat, or attestation protection refuses the entire refresh with original hashes unchanged. |
| `PC-001-CR-008` | Human-facing evidence is unambiguous and accessible. | Roadmap status, artifact readiness, execution permission, blockers, next action, exact bindings, and validation outcome remain distinct in CLI, Markdown, issues, Project, workbook, and Wiki. |
| `PC-001-CR-009` | Generation and projections remain deterministic or equivalently verified according to artifact type. | JSON/Markdown control generation and Wiki builds are byte-identical across isolated runs. Canonical and review workbooks from one build have matching hashes; isolated workbook builds have identical sheets, cells, formulas, links, counts, and renders even if the spreadsheet library emits different internal OOXML relationship IDs. The 58-task baseline, seven deferred requirements, issue/Project/workbook/Wiki projections, and two quiescent parity snapshots have zero unexplained semantic drift. |
| `PC-001-CR-010` | Public controls remain private- and authentic-data blind. | Tests reject sensitive sentinels; no private connection or authentic-media processing occurs; deployment stays `Unknown — private read authority pending`. |

## Product acceptance scenarios

1. **`PC-001-P-001` — Derived permission:** valid local-synthetic and fictional-private evidence produce the exact expected derived readiness, decision, and permission; every one-gate mutation fails closed with a stable reason.
2. **`PC-001-P-002` — Trust boundary:** role identity, QA independence, owner-action evidence, private authority, exact-main activation, and public-safety rules reject incomplete, stale, mismatched, expired, or sensitive input.
3. **`PC-001-P-003` — Delivery truth:** all-Hold compatibility, deterministic generation, protected refresh, issue/Project/workbook/Wiki parity, and status semantics remain exact without implying product implementation or deployment.

## Success metrics

- Zero editable derived authorization fields.
- Two positive execution fixtures and at least one isolated negative fixture for every gate predicate.
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
