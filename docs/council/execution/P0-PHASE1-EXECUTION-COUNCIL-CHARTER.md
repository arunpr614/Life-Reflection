# Life in Days Phase 1 — P0 execution council charter

- **Effective:** 2026-08-14
- **Authority updated:** 2026-08-16
- **Status:** Active for the bounded Goal's P0 control work and gated R0 envelope only; R1-R10 is frozen
- **Historical relationship:** Additive to, and not a rewrite of, the four-seat planning council
- **Chair/integrator:** Primary Codex agent; sole final editor

## Mandate

The execution council converts the accepted planning baseline into small, reversible, evidence-backed work only inside the active bounded Goal and [P0-ED-016](P0-PHASE1-EXECUTION-DECISIONS.md#p0-ed-016--bounded-r0-authority). It may own routine R0 readiness and promotion when every named stage gate passes. It has no R1-R10 execution authority; those releases remain frozen and out of scope until a new direct Product Owner activation. It cannot manufacture authority, accept a missing human act, weaken a gate, or broaden a claim beyond evidence.

The council does not treat documentation, prototype behavior, code existence, CI, an uploaded backup, a deployment, or elapsed time as release acceptance.

## Membership and decision rights

| Seat | Accountable decisions and vetoes | Required outputs |
| --- | --- | --- |
| Expert Product Manager | 71-requirement boundary, outcomes, acceptance, non-goals, value/trust and product vetoes | PRD/change decisions, traceability, readiness/exit findings |
| Expert UI/UX Designer | Journeys, complete state families, content, responsive/accessibility/usability and design vetoes | Release-specific design contracts and design review |
| Technical Architect | Architecture, threats, storage, migrations, host admission, capacity, deployment, observability, recovery, rollback and technical vetoes | ADRs, runbooks, technical evidence and readiness/exit findings |
| Independent QA Lead | Test strategy, regression, privacy/security, browser/accessibility, severity, evidence integrity and QA vetoes | Independent verdicts and linked release evidence |
| Expert Project Manager | Dependencies, forecast, risk/change control, status truth, GitHub/Project/workbook/Wiki parity and delivery vetoes | Release controls, RAID, parity and publication evidence |

The chair coordinates, integrates, and records decisions. The chair does not replace a specialist seat and cannot override an unresolved launch-blocking veto.

## RACI

| Workstream | Product | UX | Architecture | QA | Project | Owner |
| --- | :---: | :---: | :---: | :---: | :---: | :---: |
| Requirement boundary and outcomes | A/R | C | C | C | C | I; A for scope change |
| Interaction/content/accessibility contract | C | A/R | C | C | C | I; A for material preference |
| Architecture, privacy/security and data model | C | C | A/R | C | C | A for hard-to-reverse/material choice |
| Test strategy, severity and acceptance evidence | C | C | C | A/R | C | I; A for named UAT act |
| Dependencies, status, roadmap, workbook and Wiki | C | C | C | C | A/R | I |
| Reversible local/synthetic implementation | C | C | A | C | I | I |
| Scoped R0 action after all current gates | C | C | A/R | A for QA gate | A for evidence gate | I except named human act |
| Accounts, MFA, secrets, terms and material spend | C | I | R for plan | I | C | A/R |
| Authentic-content consent and authentic-photo UAT | C | C | I | I | I | A/R |
| Recovery-key custody and human ceremony steps | I | I | R for procedure | C | C | A/R |
| Final R9 proceed/hold/rollback | C | C | C | C | C | A/R |
| Triggered R10 irreversible stage/last-copy retirement | C | I | R | C | C | A/R |

Legend: **A** accountable, **R** responsible, **C** consulted, **I** informed.

## Council cadence

1. Product, UX, and Architecture run the readiness wave against the same sources.
2. The primary writer implements the smallest authorized slice with fictional fixtures.
3. A fresh Independent QA Lead reviews the stable candidate; the Project Manager audits evidence and control-surface parity.
4. Relevant specialists re-review repaired or changed areas.
5. The full council records `Proceed`, `Hold`, or `Roll back` in a `P0-` release record.

If concurrency limits require waves, all five seats remain mandatory.

## Release gate

A release can proceed only when:

- every task entering substantive work has its six P0-prefixed task-bound artifacts approved, hashes and reviewed revision recorded, council verdict in scope, and manifest `executionAllowed=true`;
- exact task and requirement scopes and every entry dependency are satisfied;
- complete normal, empty, loading, error, interruption, destructive, responsive, and accessibility behavior is specified where applicable;
- architecture, threats, data shapes, migration, inventory, export/lifecycle, backup, separate-path restore, rollback/forward-fix, observability, and operations are reviewable;
- implementation and immutable build evidence exists for implementation claims;
- fresh independent QA passes the full affected matrix with no unresolved release-blocking finding;
- private actions have a complete authority record and use only sanitized/opaque public evidence;
- every named non-delegable human act is complete; and
- manifest, issues, Project, workbook, Wiki, and running log reconcile before closure.

R0 is synthetic-only. R1 is the earliest release that may admit an explicitly authorized authentic text fixture. Authentic photos remain outside every agent/AI-controlled inspection path.

## Evidence and naming controls

- Every newly created document or evidence/build artifact has a basename beginning `P0-`.
- Existing canonical files, stable task/requirement IDs, generated projections, runtime/config conventions, frozen v6–v10 artifacts, and `RUNNING_LOG.md` are grandfathered and are not duplicated or mass-renamed.
- Raw private evidence stays outside the public repository. Public records contain only opaque reference, scope class, reviewer, authorized window, and pass/fail.
- Within current authority, R0 QA evidence attaches to `REL-R0-001`. The R1–R7 attachment convention remains planning metadata only while those releases are frozen. Governance review creates no new roadmap task.

## Current release posture

Stage 0 control remediation is complete. Within the bounded Goal, the council may review only a named substantive R0 task's local/public/fictional/synthetic Gate A proposal after its exact publication topology passes. Candidate authoring remains held until that task's exact Gate A passes, and governed task-stage invocation remains held until its separate exact Gate B passes. Private access, deployment, authentic-content admission, acceptance, release, and production claims remain held. Deployment is **Unknown — private read authority pending**. R1-R10 remains frozen; broader execution requires a new direct Product Owner activation.

Current structured truth is exactly **58 Incomplete; 45 Hold + 13 Historical non-authorizing; 0 Ready; 0 execution-allowed**. The Stage 0 activation artifact baseline was 342 Draft plus six PC-001 artifacts In review; exact current artifact counts and hashes derive from the canonical task-artifact register after each reviewed publication. A homogeneous six-artifact In-review proposal packet remains non-authorizing: candidate work requires accepted Gate A and governed task-stage invocation requires a separate exact Gate B.
