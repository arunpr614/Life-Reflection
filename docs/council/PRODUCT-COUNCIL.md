# Life in Days Product Council

Updated: 2026-08-16

Status: preserved planning-council record. Its original universal authorization stop is superseded only inside the active bounded P0/R0 Gold Goal's R0 envelope, as clarified by [P0-ED-016](execution/P0-PHASE1-EXECUTION-DECISIONS.md#p0-ed-016--bounded-r0-authority). All R1-R10 work is frozen and out of scope until a new direct Product Owner activation, and all truthful implementation, deployment, recovery, and launch evidence disclaimers remain in force.

## Purpose

The Product Council turns the confirmed Life in Days discovery decisions into a coherent product specification, user-experience specification, executable project tracker, and technical implementation plan. It exists to prevent any one discipline from silently trading away fidelity, privacy, usability, recoverability, delivery realism, or technical safety.

## Product mandate

Life in Days is a private, single-user visual memory archive. It joins eligible VoiceNotes journal text, manually uploaded journal files, and Telegram photos into trustworthy Journal Days for calendar-based revisiting and reflection. Authentic Source Items remain separate from every AI-created Derived Artifact. The MVP is not a coach, social product, reminder system, or historical-import tool.

## Council members

| Council seat | Active agent | Primary accountability | Owned artifact |
| --- | --- | --- | --- |
| Product chair and final integrator | Codex primary agent | Reconcile the council, preserve user decisions, validate the complete artifact set, and escalate decisions only Arun can make | This charter and final integrated set |
| Senior Product Manager | `council_senior_pm` | Product outcomes, scope, requirements, priorities, acceptance criteria, and requirement traceability | [Product Requirements](../product/PRODUCT-REQUIREMENTS.md) |
| UI/UX Design Lead | `council_ux_lead` | Information architecture, end-to-end flows, interaction states, content design, accessibility, and visual hierarchy | [UX Specification](../design/UX-SPECIFICATION.md) |
| Project Manager | `council_project_manager` | Milestones, epics, tasks, dependencies, evidence, risks, change control, and delivery governance | [Project Tracker](../project/PROJECT-TRACKER.md) |
| Technical Architect | `council_technical_architect` | System boundaries, data model, security, integrations, implementation sequence, verification, operations, and recovery design | [Implementation Plan](../architecture/IMPLEMENTATION-PLAN.md) |

The durable role contracts are recorded under [`docs/council/agents`](agents/). The active agents are task-scoped collaborators for this council session; they are not published autonomous services and have no production access.

## Sources of truth

Precedence is explicit:

1. Arun's direct decisions and corrections.
2. [Proposed shared understanding](../discovery/SHARED-UNDERSTANDING.md), after Arun explicitly confirms it.
3. [Detailed discovery requirements](../discovery/REQUIREMENTS.md).
4. [Domain language](../../CONTEXT.md).
5. Evidence and constraints in the research and evaluation reports.
6. Council artifacts created from those sources.

When two sources conflict, the council does not average them. It records the conflict, follows the higher-precedence source, and escalates any unresolved user preference to Arun.

## Council operating principles

- **Authenticity before synthesis:** source journals and photos are never replaced by generated material.
- **Privacy before convenience:** no real photo or photo-derived data enters an AI request.
- **Explicit state before magic:** conflicts, staleness, suppressions, retries, provider changes, and failures remain visible.
- **No silent scope expansion:** deferred capabilities do not enter MVP through implementation convenience.
- **No silent technical assumptions:** model selection, VoiceNotes behavior, encryption design, and credentials stay gated until their approved decision mechanism completes.
- **Evidence before status:** work is complete only when its named acceptance evidence exists.
- **Recoverability before launch:** a backup existing is not the same as a successful restore.
- **Accessibility is product behavior:** keyboard, focus, contrast, motion, and responsive states are acceptance criteria rather than polish.
- **One accountable owner:** each requirement, task, risk, and decision has one accountable council role even when several roles contribute.

## Decision rights

| Decision class | Recommends | Must review | Final authority |
| --- | --- | --- | --- |
| Product promise, MVP scope, privacy boundary, spend ceiling | Senior Product Manager | Full council | Arun |
| Information architecture, interaction behavior, content design | UI/UX Design Lead | Product and Architecture | Arun for material scope changes; Design Lead within confirmed scope |
| Milestone sequence, dependencies, evidence, status | Project Manager | Full council | Product chair within confirmed scope |
| Architecture, data model, integration contract, security controls | Technical Architect | Product, Design, Project | Arun for hard-to-reverse or scope-changing choices; Architect for reversible implementation details after authorization |
| Provider/model dropdown contents | Product and Architecture | Full council | Approved evaluation protocol, then Arun if a hard gate fails or an exception is needed |
| Deployment, DNS, credentials, paid actions, launch | Relevant owner | Full council | Arun |

## Required artifacts and quality bar

### Product Requirements Document

Must state the problem, product promise, goals, measurable outcomes, non-goals, persona, complete functional and non-functional behavior, user stories, acceptance criteria, dependencies, personal-data handling, risks, and deferred scope. Every confirmed discovery decision must be represented or traceably delegated to a linked specification.

### UX Specification

Must define the information architecture, page anatomy, primary and recovery flows, interaction states, responsive rules, visual hierarchy, content language, accessibility behavior, privacy cues, and usability-validation plan. It must include uncomfortable states such as missing dates, stale generations, upstream conflicts, provider refusal, duplicate media, exhausted budget, failed export, Trash, and recovery status.

### Project Tracker

Must break the product into stage-gated milestones, deliverables, epics, and granular tasks. Every task needs a stable ID, accountable role, dependencies, status, completion evidence, and milestone. It must distinguish already-completed discovery from unstarted implementation and must not invent dates or claim progress.

### Implementation Plan

Must define the proposed system architecture, domain/data model, boundaries, security controls, integrations, background jobs, storage lifecycle, APIs, repository structure, testing strategy, observability, backup/restore, deployment sequence, rollback, and launch gates. Gated decisions must be visibly gated rather than disguised as final implementation choices.

## Review workflow

1. Each role reads the complete discovery baseline, not only its own discipline's report.
2. Each role drafts only its owned artifact and records source decisions, dependencies, and unresolved gates.
3. The Technical Architect checks all drafts for feasibility, privacy-boundary integrity, operational completeness, and hidden implementation assumptions.
4. The Product Manager checks that all confirmed and deferred features are represented with unambiguous acceptance behavior.
5. The UI/UX Design Lead checks that every user-visible state has a discoverable, accessible interaction.
6. The Project Manager checks that every promised behavior has build, test, evidence, and launch work with valid dependencies.
7. The product chair reconciles cross-review findings, runs link/Markdown/traceability audits, and commits one coherent planning baseline.
8. Any remaining user decision returns to Arun; the council never resolves personal preference by majority vote.

## Stage gates

| Gate | Entry condition | Required evidence | Exit authority |
| --- | --- | --- | --- |
| G0 — Planning baseline | Discovery evidence exists | Council-reviewed PRD, UX specification, implementation plan, tracker, traceability matrix, and closed cross-review findings | Product Council; Arun acknowledges any recorded gap |
| G1 — Shared understanding | G0 passed and the decision frontier is empty | Arun explicitly confirms the shared-understanding document | Arun |
| G2 — Architecture baseline | G1 passed | Reviewed architecture, threat model, required ADRs, and accepted material trade-offs | Arun for material trade-offs; council for a fully passing baseline |
| G3 — Risk-retiring evaluations | G1 passed | VoiceNotes synthetic spike plus signed text/artwork evaluations, or an explicitly reopened decision branch | Arun for exceptions; council for fully passing evidence |
| G4 — Build readiness | Applicable G2/G3 outcomes passed | Ready backlog, test strategy, development environment, and traceability reviewed | Product chair and Technical Architect |
| G5 — Feature complete | Authorized implementation complete in a non-production environment | Full MVP traceability and no open severity-1/2 defect | Full council |
| G6 — Release candidate | G5 passed | Security/privacy, accessibility/browser, fault, backup/restore, budget, and capacity evidence | Full council and Arun acceptance |
| G7 — Production readiness | G6 passed and deployment is explicitly authorized | Production access, callbacks, origin hardening, monitoring, backup, and rollback checks | Arun |
| G8 — Recovery Ceremony and go/no-go | G7 passed | Two off-server key copies plus representative restore/decrypt | Arun |
| G9 — Private launch accepted | G8 passed | First live prospective journey is captured, backed up, retrieved, and reflected correctly | Arun |

No later gate can compensate for an earlier gate that has not passed.

> **Current execution interpretation (2026-08-16):** The table above remains historical planning provenance. The active bounded P0/R0 Gold Goal replaces G1 as a universal stop only inside its R0 envelope. At present, only the local/public Stage 0 control repair is authorized; no R0 implementation, private-system action, deployment, acceptance, release, or production work is authorized. The five-seat execution council may later decide eligible R0 work only after every named stage gate passes. All R1-R10 work remains frozen and out of scope; broader execution requires a new direct Product Owner activation. Accounts/MFA/secrets, material terms/spend/provider choices, authentic content/UAT, recovery-key custody, and human ceremony steps remain human-only.

## RACI by workstream

| Workstream | Product | Design | Project | Architecture | Arun |
| --- | --- | --- | --- | --- | --- |
| Scope and outcomes | R | C | C | C | A |
| Requirements and acceptance criteria | A/R | C | C | C | I |
| Information architecture and interaction | C | A/R | C | C | I |
| Accessibility and content behavior | C | A/R | C | C | I |
| Architecture and data model | C | C | C | A/R | I or A for gated choices |
| Security and privacy controls | C | C | C | R | A |
| Schedule, dependencies, and status | C | C | A/R | C | I |
| Provider/model evaluation | A | C | C | R | A for exceptions |
| Test and launch readiness | A | R | R | R | A |
| Deployment and production mutation | I | I | C | R | A |

Legend: **A** accountable, **R** responsible, **C** consulted, **I** informed.

## Council cadence during delivery

- **Planning baseline review:** once per artifact revision that changes scope, architecture, or milestone dependencies.
- **Milestone entry review:** confirm Definition of Ready and blockers before work starts.
- **Milestone exit review:** inspect named evidence; never close from a verbal status alone.
- **Risk review:** at every milestone boundary and immediately when a privacy, recoverability, spend, or upstream-contract risk changes.
- **Decision review:** within the pull request or decision record that introduces the choice.
- **Launch review:** one full-council review at G6 and one final owner review at G8 after the Recovery Ceremony.

## Change control

1. Record the proposed change and its reason in the tracker.
2. Identify affected PRD requirements, UX flows, tasks, architecture sections, costs, and risks.
3. Classify it as clarification, reversible implementation detail, hard-to-reverse architecture choice, product-scope change, or privacy-boundary change.
4. Obtain the authority named in the decision-rights table.
5. Update every affected artifact in one coordinated change.
6. Preserve superseded decisions or links so the rationale remains auditable.

## Disagreement and escalation

- A privacy-boundary concern pauses the affected design until resolved.
- A source-fidelity concern blocks any behavior that could overwrite, merge, misdate, or misrepresent authentic material.
- A recovery concern blocks storage migration or launch until restoration evidence exists.
- A usability concern blocks a user-facing flow when the only path depends on hidden state, inaccessible controls, or destructive ambiguity.
- A schedule concern changes sequencing or scope visibility; it never silently weakens acceptance criteria.
- A provider hard-gate failure returns to Arun rather than producing a compromise model choice.

## Current council record

| Date | Session | Result |
| --- | --- | --- |
| 2026-08-13 | Council formation and planning-artifact draft | Four role-agents assigned; independent Product, UX, Architecture, and Project review began. |
| 2026-08-13 | [Planning-baseline review](COUNCIL-REVIEW.md) | All four specialist seats approved after reconciliation. G0 closed with no open P0/P1 planning blocker; G1 remains blocked on Arun's explicit shared-understanding confirmation. |
| 2026-08-14 | [P0 execution-control review](execution/releases/P0-P0-EXECUTION-CONTROL-REVIEW.md) | A five-seat execution council was formed under the directly activated Goal. Local P0 remediation may proceed; private/live R0 remains held. |

## 2026-08-14 execution-council addendum

| Execution seat | Current accountability | Durable charter |
| --- | --- | --- |
| Expert Product Manager | 71-requirement boundary, release outcomes, acceptance, non-goals and product veto | [Execution Council Charter](execution/P0-PHASE1-EXECUTION-COUNCIL-CHARTER.md) |
| Expert UI/UX Designer | Complete journeys/states, content, responsive/accessibility/usability and design veto | [Execution Council Charter](execution/P0-PHASE1-EXECUTION-COUNCIL-CHARTER.md) |
| Technical Architect | Architecture, threats, storage, host admission, migration, recovery, rollback and technical veto | [Execution Council Charter](execution/P0-PHASE1-EXECUTION-COUNCIL-CHARTER.md) |
| Independent QA Lead | Test strategy, evidence integrity, severity, privacy/security, browser/accessibility and QA veto | [QA Lead Charter](agents/P0-QA-LEAD.md) |
| Expert Project Manager | Dependencies, risk/change, status, GitHub, workbook, Wiki and delivery-evidence veto | [Execution Council Charter](execution/P0-PHASE1-EXECUTION-COUNCIL-CHARTER.md) |

The primary agent chairs and integrates but does not replace any seat. Current RACI and non-delegable boundaries are normative in the execution charter and authorization addendum.

## References

- [Proposed shared understanding](../discovery/SHARED-UNDERSTANDING.md)
- [Discovery requirements](../discovery/REQUIREMENTS.md)
- [Product and integration research](../discovery/RESEARCH.md)
- [AI text evaluation protocol](../discovery/AI-TEXT-MODEL-EVALUATION.md)
- [AI artwork evaluation protocol](../discovery/AI-ARTWORK-MODEL-EVALUATION.md)
- [Media storage evaluation](../discovery/MEDIA-STORAGE-EVALUATION.md)
- [Planning-baseline council review](COUNCIL-REVIEW.md)
- [P0 execution authorization](execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md)
- [P0 execution decisions](execution/P0-PHASE1-EXECUTION-DECISIONS.md)
