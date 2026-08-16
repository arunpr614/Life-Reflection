# SPK-R0-001 — Product Council task readiness

- **Task ID:** `SPK-R0-001`
- **Artifact kind:** `council`
- **Artifact state:** `in-review`
- **Roadmap status:** `In progress`
- **Milestone:** `R0`
- **Execution allowed:** `false`
- **Evidence boundary:** This document requests exact-candidate Gate A review for preparation only. It is not an attestation, approval record, candidate-authoring or test permission, task-stage execution permission, private authority, delivery transition, acceptance decision, release, or production claim. Only a later accepted Gate A record may permit bounded candidate authoring and independent local-synthetic candidate QA; task-stage invocation still requires Gate B.
- **Immutable snapshot rule:** These proposal bytes remain `in-review` and `executionAllowed=false` after publication. Current Gate A state, if it later changes, exists only in the append-only preparation registry plus exact-main immutable-history replay and must never be inferred from this frozen file.

## Candidate request

- **Task:** Shared-host Coexistence & Rollback Spike
- **Preparation review:** `P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION`
- **Intended later stage:** `P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION`
- **Requested pair:** `local-synthetic` / `synthetic-foundation`
- **Requested Council verdict:** `ready-to-prepare`
- **Task-contract SHA-256:** `f58e65c56e58dc4b1e12deab68f7349822f7f95dd33eee4fcd4872243170fa23`
- **Proposal author:** `codex-primary-integrator-01`
- **Dependency:** `PC-001` with one later Gate A evidence record `{dependencyId: PC-001, result: pass, evidenceReference: github-pr:pull-70}`
- **Authority result if accepted:** `preparationAllowed=true`, `executionAllowed=false`, private action allowed `false`, external action allowed `false`

The candidate revision, base revision, six artifact SHA-256 values, raw dossier digest, source fingerprint, author attestation, specialist attestations, five seat attestations, and Git publication facts are computed after C1 exists and are persisted only in the later append-only preparation record. This file does not self-reference its future commit or hashes.

## Exact contract coverage

- **Requirement IDs:** `LID-SCP-001`, `LID-OPS-001`, `LID-OPS-002`, `LID-OPS-003`, `LID-OPS-004`, `LID-OPS-008`, `LID-OPS-011`, `LID-OPS-012`, `LID-OPS-014`, `LID-OPS-016`, `LID-OPS-018`
- **Product scenarios:** `SPK-R0-001-P-001`, `SPK-R0-001-P-002`, `SPK-R0-001-P-003`
- **Technical scenarios:** `SPK-R0-001-T-001`, `SPK-R0-001-T-002`, `SPK-R0-001-T-003`
- **Design scenarios:** `SPK-R0-001-D-001`, `SPK-R0-001-D-002`, `SPK-R0-001-D-003`
- **QA scenarios:** `SPK-R0-001-QA-001`, `SPK-R0-001-QA-002`, `SPK-R0-001-QA-003`, `SPK-R0-001-QA-004`, `SPK-R0-001-QA-005`, `SPK-R0-001-QA-006`

The six proposal artifacts must address this complete set without adding a requirement, task, stage, scenario, implementation surface, or acceptance claim.

## Proposal decision closure

The proposal makes these preparation-level decisions:

- Gate A may prepare only a deterministic local fictional/synthetic foundation for later review.
- Human and callback surfaces remain disjoint; synthetic capacity, collision, encrypted-state, restore, rollback, health, logging, privacy, and accessibility behavior are specified as contracts rather than claimed as executed results.
- Authentic content, private target facts, credentials, provider access, account action, live topology, deployment, restart, real backup/restore, task acceptance, and status mutation are prohibited at Gate A.
- Concrete implementation filenames, service manager, real ports, provider configuration, database/encryption library selection, production capacity, and private-host conclusions are deferred to a later Gate B candidate and are not unresolved decisions for this preparation proposal.
- The task-wide second `private-execution/private-system-read` pair remains a later separately reviewed stage; it is not collapsed into or authorized by this proposal.

Accordingly the later Gate A input may contain `openDecisions=[]`, `unresolvedBlockers=[]`, and `specialistVetoes=[]` only after every external exact-candidate reviewer independently confirms that these boundaries and artifacts are complete. The absence of proposal-level blockers does not remove later Gate B prerequisites.

## Required exact-candidate artifact reviews

| Artifact | Reviewer ID | Registry role | Required decision |
| --- | --- | --- | --- |
| Product | `codex-product-manager-01` | `product` | `approved` |
| Architecture | `codex-technical-architect-01` | `architecture` | `approved` |
| Design | `codex-ui-ux-designer-01` | `design` | `approved` |
| QA | `codex-independent-qa-01` | `qa` | `approved` |
| Delivery | `codex-project-manager-01` | `project` | `approved` |
| Council | `codex-project-manager-01` | `project` | `approved` |

Each artifact-review attestation directly binds the Gate A kind, preparation review, task, intended stage, artifact subject and decision, reviewer identity and role, C1 revision, raw dossier digest, exact artifact SHA-256, scope/action pair, and evidence reference. The complete Gate A proof separately binds the canonical reviewer registry, task contract, all six review records, and the remaining source inputs; immutable-history verification stores and re-evaluates that record-bound proof. The Delivery and Council artifact reviews may share the registered Project reviewer, but the five Council seat IDs remain distinct.

## Required five-seat Council review

| Seat | Reviewer ID | Required verdict | Current file state |
| --- | --- | --- | --- |
| Product | `codex-product-manager-01` | `approve-preparation-candidate` | External exact-candidate attestation not yet recorded |
| Design | `codex-ui-ux-designer-01` | `approve-preparation-candidate` | External exact-candidate attestation not yet recorded |
| Architecture | `codex-technical-architect-01` | `approve-preparation-candidate` | External exact-candidate attestation not yet recorded |
| QA | `codex-independent-qa-01` | `approve-preparation-candidate` | External exact-candidate attestation not yet recorded |
| Project | `codex-project-manager-01` | `approve-preparation-candidate` | External exact-candidate attestation not yet recorded |

All five reviewers must be active in the exact reviewer-registry bytes, distinct from one another, and different from proposal author `codex-primary-integrator-01`. Each seat attestation directly binds the Gate A kind, preparation review, task, intended stage, Council-seat subject and approval decision, reviewer identity and role, C1 revision, raw dossier digest, scope/action pair, and evidence reference. The complete Gate A proof—not the individual seat digest—separately retains and binds the canonical reviewer registry, task contract, proposal-author evidence, dependency evidence, six artifact reviews, safety input, decision/veto/blocker arrays, and all five seat records, and immutable-history verification re-evaluates that complete proof.

## Safety and authority boundary

The exact persisted Gate A safety-input keys are `authenticMediaAccessed=false`, `privateNetworkAccessed=false`, and `externalMutationPerformed=false`. The normalized Gate A result also remains preparation-only, with private actions, external mutation, and execution disallowed. Authentic text or photos, deployment, acceptance, and task-status mutation are additional policy non-claims of this proposal, not extra fields in the canonical safety-input object. Only fictional/public/local/synthetic preparation is within bounds.

No owner action is due for this pair, and no private authority is required. Pending `P0-OA-001`, `R0-OA-001`, and `R0-OA-002` records remain untouched and cannot be inferred as satisfied. Gate A creates no credential, account, provider, network, host, backup, recovery-key, publication, or production authority.

## Publication and replay requirement

The six-file C1 proposal must be published first through its exact three-projection child—the task-artifact register JSON, roadmap-manifest JSON, and canonical workbook—and normal two-parent proposal merge M. The Markdown release plan must be regenerated in that child and remain byte-identical. Only afterward may manifest-only A directly parent M and arm the exact reviewed registry hash; AM must be the exact normal merge `[M,A]` with tree A. P then directly parents AM, appends the preparation record, changes exactly registry plus manifest, consumes the armed hash into protected `current`, and clears `next`; PM must be the exact normal merge `[AM,P]` with tree P. Because this is the first nonempty registry record, the arm operation is `add` and PM activates protected path 55. Exact-main immutable-history verification must derive the task, proposal bytes, author trailer, reviewer registry, dependency, complete M/A/AM/P/PM topology, task contract, and all attestations and must replay `evaluateTaskPreparationGateA` successfully. M, A, AM, and unmerged P remain non-authorizing.

Pure document language, a branch, CI, a prototype, a Project status, or an unmerged/fabricated record cannot substitute for that proof.

## Council disposition

**In review / Hold pending external exact-candidate attestations.** The Council request is `ready-to-prepare`, but this file does not grant it. Until the later preparation record is normally published and replays from exact current main, `preparationAllowed=false` in durable state and `executionAllowed=false` everywhere. Even an accepted Gate A record would authorize only authoring the local fictional/synthetic candidate and producing its bounded independent candidate-QA evidence; it would not authorize task-stage invocation or make `SPK-R0-001` Ready, Done, accepted, deployed, or privately executable.
