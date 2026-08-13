# Life in Days — document index

Updated: 2026-08-13

This is the single navigation point for the Life in Days product, design, architecture, delivery, research, and governance documents.

Current status: **G0 planning baseline complete. G1 is blocked on Arun's explicit confirmation of the proposed shared understanding.** No implementation, credential collection, paid evaluation, provider configuration, infrastructure mutation, deployment, recovery exercise, or production verification is implied by these documents.

## Start here

| Document | Purpose | Current role |
| --- | --- | --- |
| [Proposed Shared Understanding](discovery/SHARED-UNDERSTANDING.md) | Concise statement of the product promise, MVP boundary, capture model, AI/privacy rules, recovery direction, and deferrals. | **Next owner action:** Arun's explicit confirmation closes G1. |
| [Product Requirements Document](product/PRODUCT-REQUIREMENTS.md) | Complete product contract with 78 prioritized requirements, acceptance behavior, data handling, risks, and non-goals. | Council-approved G0 planning baseline. |
| [UX Specification](design/UX-SPECIFICATION.md) | Information architecture, screens, flows, states, content language, responsive behavior, accessibility, and validation plan. | Council-approved G0 planning baseline; no usability testing claimed. |
| [Project Tracker](project/PROJECT-TRACKER.md) | G0–G9 gates, 12 milestones, 23 epics, 211 executable tasks, dependencies, evidence, risks, decisions, and 24 backlog items. | Authoritative planning/status tracker. G1 is the current blocker. |
| [Implementation Plan](architecture/IMPLEMENTATION-PLAN.md) | Proposed architecture, domain model, integrations, jobs, security, storage, backup, testing, deployment, rollback, and technical gates. | Council-approved planning recommendation; implementation is not authorized. |
| [Requirements Traceability](project/REQUIREMENTS-TRACEABILITY.md) | Maps each of the 78 PRD requirements to UX coverage, tracker tasks, architecture sections, and planned evidence. | Planning coverage is complete; code and executed evidence remain future work. |
| [Product Council Review](council/COUNCIL-REVIEW.md) | Records specialist reviews, resolved findings, validation results, approvals, and G0 disposition. | Evidence that the integrated planning baseline passed council review. |

## Product governance and council

| Document | What it contains |
| --- | --- |
| [Product Council Charter](council/PRODUCT-COUNCIL.md) | Council mandate, membership, source precedence, decision rights, review workflow, G0–G9 gates, RACI, and change control. |
| [Council Review](council/COUNCIL-REVIEW.md) | Final G0 review record and the material contradictions resolved during reconciliation. |
| [Senior Product Manager Charter](council/agents/SENIOR-PRODUCT-MANAGER.md) | Product role mission, owned outputs, responsibilities, decision rights, review checklist, and guardrails. |
| [UI/UX Design Lead Charter](council/agents/UI-UX-DESIGN-LEAD.md) | Design role mission, owned outputs, responsibilities, decision rights, review checklist, and guardrails. |
| [Project Manager Charter](council/agents/PROJECT-MANAGER.md) | Delivery-governance role mission, owned outputs, responsibilities, decision rights, review checklist, and guardrails. |
| [Technical Architect Charter](council/agents/TECHNICAL-ARCHITECT.md) | Architecture role mission, owned outputs, responsibilities, decision rights, review checklist, and guardrails. |

## Product, experience, architecture, and delivery

| Discipline | Primary document | Use it for |
| --- | --- | --- |
| Product | [Product Requirements Document](product/PRODUCT-REQUIREMENTS.md) | Product scope, user stories, exact behavior, acceptance criteria, priorities, non-goals, data handling, and risks. |
| Experience | [UX Specification](design/UX-SPECIFICATION.md) | Navigation, page anatomy, interaction rules, empty/error/conflict states, responsive design, accessibility, and content language. |
| Architecture | [Implementation Plan](architecture/IMPLEMENTATION-PLAN.md) | Proposed technical shape, persistence, integrations, security/privacy enforcement, AI orchestration, storage, operations, tests, and phased implementation. |
| Delivery | [Project Tracker](project/PROJECT-TRACKER.md) | Gates, milestones, epics, tasks, dependencies, statuses, evidence requirements, critical path, registers, and backlog. |
| Coverage | [Requirements Traceability](project/REQUIREMENTS-TRACEABILITY.md) | Requirement-by-requirement navigation across Product, UX, Architecture, Delivery, and planned verification. |

## Discovery and research record

These documents preserve how the current planning baseline was reached. Later confirmed decisions take precedence over earlier proposals.

| Document | What it contains | Interpretation |
| --- | --- | --- |
| [Initial Brief](discovery/INITIAL-BRIEF.md) | Original product request and inspiration links. | Historical input; later decisions supersede conflicts. |
| [Detailed Discovery Requirements](discovery/REQUIREMENTS.md) | The requirements interview record and decisions 1–65. | Canonical detailed discovery decisions beneath Arun's direct corrections. |
| [Product and Integration Research](discovery/RESEARCH.md) | Research on inspiration products, VoiceNotes, Telegram, hosting, authentication, privacy, backup, and integrations. | Evidence base; distinguishes documented facts, observations, proposals, and unknowns. |
| [Proposed Shared Understanding](discovery/SHARED-UNDERSTANDING.md) | Concise synthesis of the intended MVP. | Awaiting Arun's explicit G1 confirmation. |
| [AI Text Model Evaluation](discovery/AI-TEXT-MODEL-EVALUATION.md) | Candidate comparison, privacy/cost analysis, synthetic test protocol, hard gates, and production contract for text AI. | Evaluation design only; no model is selected or qualified yet. |
| [AI Artwork Model Evaluation](discovery/AI-ARTWORK-MODEL-EVALUATION.md) | Candidate comparison, blind visual evaluation, privacy/cost controls, hard gates, and artwork configuration contract. | Evaluation design only; no model is selected or qualified yet. |
| [Media Storage Evaluation](discovery/MEDIA-STORAGE-EVALUATION.md) | Cost, privacy, operational, backup, and migration comparison for local disk, R2, B2, and Hetzner alternatives. | Planning recommendation; provisioning and migration remain gated. |
| [Worktree Provenance](discovery/WORKTREE.md) | Repository, branch, base, worktree, and isolation provenance for discovery work. | Historical Git provenance. |

## Domain language and repository entry points

| Document | What it contains |
| --- | --- |
| [Domain Language](../CONTEXT.md) | Canonical terms such as Journal Day, Journal Date, Source Item, Daily Photo, Original Timestamp, Correction, and Derived Artifact. |
| [Repository README](../README.md) | Short project status, primary artifact links, and discovery entry points. |

## Recommended reading paths

### To approve the product understanding

1. [Proposed Shared Understanding](discovery/SHARED-UNDERSTANDING.md)
2. [Detailed Discovery Requirements](discovery/REQUIREMENTS.md), when a statement needs its full decision history
3. [Product Requirements Document](product/PRODUCT-REQUIREMENTS.md), for the complete product contract

### To design or review the experience

1. [Product Requirements Document](product/PRODUCT-REQUIREMENTS.md)
2. [Domain Language](../CONTEXT.md)
3. [UX Specification](design/UX-SPECIFICATION.md)
4. [Requirements Traceability](project/REQUIREMENTS-TRACEABILITY.md)

### To prepare implementation after authorization

1. [Proposed Shared Understanding](discovery/SHARED-UNDERSTANDING.md) and the recorded G1 decision
2. [Product Requirements Document](product/PRODUCT-REQUIREMENTS.md)
3. [Implementation Plan](architecture/IMPLEMENTATION-PLAN.md)
4. [Project Tracker](project/PROJECT-TRACKER.md)
5. [Requirements Traceability](project/REQUIREMENTS-TRACEABILITY.md)

### To understand evidence and governance

1. [Product Council Charter](council/PRODUCT-COUNCIL.md)
2. [Council Review](council/COUNCIL-REVIEW.md)
3. [Project Tracker](project/PROJECT-TRACKER.md)
4. [Requirements Traceability](project/REQUIREMENTS-TRACEABILITY.md)

## Source precedence

When documents disagree, use this order:

1. Arun's direct decisions and corrections.
2. The [Proposed Shared Understanding](discovery/SHARED-UNDERSTANDING.md) after Arun explicitly confirms it.
3. The [Detailed Discovery Requirements](discovery/REQUIREMENTS.md).
4. The [Domain Language](../CONTEXT.md).
5. Discovery research and evaluation evidence.
6. The council-created PRD, UX specification, implementation plan, tracker, and traceability matrix.

Do not silently resolve a remaining conflict by choosing the more convenient document. Record it through the [Project Tracker change-control process](project/PROJECT-TRACKER.md).
