# ENG-R2-001 — Product Council task readiness

- **Task ID:** `ENG-R2-001`
- **Artifact kind:** `council`
- **Artifact state:** `draft`
- **Roadmap status:** `Backlog`
- **Milestone:** `R2`
- **Execution allowed:** `false`
- **Evidence boundary:** Creation of this draft does not approve implementation, deployment, testing, restore, release, or production use.

## Candidate

- **Task:** Telegram Authorization & Durable Capture
- **Outcome:** Implement secret/sender/chat authorization, media validation, exact dating, review holding, and post-commit acknowledgement.
- **Requested execution scope:** `future-release-gated`
- **Reviewed candidate binding:** Not yet recorded. The exact commit and dossier digest are recorded after review in the central readiness registry; this file must not self-reference the commit that contains itself.
- **Artifact hashes:** Recorded in the central register; all artifacts are initial drafts

## Five-seat verdicts

| Seat | Verdict | Reason |
| --- | --- | --- |
| Product Manager | Hold | Hold pending approved task-bound artifact |
| UI/UX Designer | Hold | Hold pending approved task-bound artifact |
| Technical Architect | Hold | Hold pending approved task-bound artifact |
| Independent QA | Hold | Hold pending approved task-bound artifact |
| Project Manager | Hold | Hold pending approved task-bound artifact |

## Unresolved blockers

- Task-bound Product, Architecture, Design, QA, Delivery, and Council artifacts remain `draft`.
- Acceptance scenario ownership, exact implementation surface, evidence plan, and reviewed commit require specialist approval.
- Dependency entry evidence and any due owner/private gates have not been accepted for execution.

## Council decision

**`hold`** with `executionAllowed=false`.

Only local task-dossier authoring and expressly authorized P0 control remediation may continue. No substantive implementation, private-system action, authentic-content action, or release promotion is authorized.

## Re-review trigger

Re-review all five seats after every required artifact is stable in one candidate commit, open decisions are empty, dependency/authority/human gates are evidenced, and Independent QA can review without implementation conflict. Each external seat attestation binds the candidate commit and dossier digest; a later approval-registry commit records those bindings without modifying the six candidate artifacts.
