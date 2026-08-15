# PC-001 — readiness-control hardening Council record

- **Task ID:** `PC-001`
- **Artifact kind:** `council`
- **Artifact state:** `in-review`
- **Roadmap status:** `Done` — historical planning only
- **Milestone:** `P0`
- **Execution allowed:** `false`
- **Evidence boundary:** this record coordinates a planning-first bootstrap correction. It does not approve itself, any R0 task, private access, deployment, release, or production use.

## Candidate scope

- **Corrective outcome:** make artifact readiness and execution permission fail-closed, derived, role-bound, scope-aware, protected from unsafe refresh, tested on permitting and rejecting paths, and activatable only from clean exact main.
- **Requested post-review scope:** audit-only exact-candidate control review and normal merge/reconciliation of local/public readiness-control hardening under existing `PC-001` / issue #3; never PC-001 task execution.
- **Explicit exclusions:** Life in Days application/prototype/R0 feature changes; private or authentic data; host/provider access; deployment/release; new task/issue; issue status/state change; Project workflow mutation.
- **Planning candidate revision:** `d44dbfbc8d040baddf46b7288476d4dc53c81e8c`.
- **Planning dossier digest:** `sha256:32deebe971b1321a7ccd4203d4c861d93c4ec3d45ba3bf4c9fab2ea048b9eaed`.
- **Planning publication:** PR #66 merged as `2fc31ec905f4c664b86bebdc511a87390a24a4e9`; this is planning authorization only.
- **Five-seat planning evidence:** [P0 PC-001 readiness-hardening planning review](../../council/execution/releases/P0-PC-001-READINESS-HARDENING-PLANNING-REVIEW.md).
- **Central readiness registry:** remains all-Hold with `executionAllowed=false`; this file does not self-reference its containing commit.

## Shared requirements and tests

The five seats review the same ten corrective requirements `PC-001-CR-001..010` in the [task PRD](./P0-PC-001-PRD.md), frozen implementation decisions in the [Technical Plan](./P0-PC-001-TECHNICAL-PLAN.md), operator contract in the [Design Spec](./P0-PC-001-DESIGN-SPEC.md), permitting cases P01/P03 plus fail-closed N01..N07, R01, R02, and S01 in the [QA Plan](./P0-PC-001-QA-PLAN.md), and the candidate → audit-review publication → reconciliation sequence in the [Delivery Plan](./P0-PC-001-DELIVERY-CHECKLIST.md). The exact local oracle is readiness `341/341`, including 2,204 task/global-pair checks; no P02/private composite permit exists.

## Pre-authoring Council direction

These findings defined the packet but are not exact-candidate approval:

| Seat | Direction | Required before code starts |
| --- | --- | --- |
| Product Manager | Go to author the bounded corrective packet; Hold R0 and current generic PRD. | Exact invariants, measures, scope, and non-goals in one committed Product artifact. |
| UI/UX Designer | Go to author; Design is applicable to operator evidence; Hold code/current generic spec. | Three journeys, frozen labels/states, accessibility, failure content, and no app UI change. |
| Technical Architect | Go to author under PC-001 only; Hold code. | Shared derivation, fixtures, publication/activation split, identity, authority/actions, and refresh transaction. |
| Independent QA | Go to remediate the dossier; Hold code/current packet. | P01/P03 singleton positives, private/composite denial, isolated negative per gate, atomicity, determinism, parity, and public-safety matrix. |
| Project Manager | Go under issue #3; no 59th issue; Hold all R0 tasks. | Staged publication gates, exact-main sync, workbook/Wiki/parity, no status or workflow mutation. |

## Exact-candidate five-seat gate

After these six artifacts are committed and their hashes produce one dossier digest, every seat must return a public-safe attestation naming:

- reviewer ID and required role;
- exact planning candidate revision and dossier digest;
- reviewed artifact paths/hashes;
- `approve planning scope` or `hold`;
- rationale and unresolved vetoes; and
- opaque evidence reference.

All five approvals are required. Any later artifact edit changes its hash and triggers affected-seat re-review. The primary implementer cannot substitute for a specialist, and the Independent QA identity must remain distinct.

## Code-start decision rule

Control-code edits may start only when:

1. all six planning artifacts are complete and internally consistent;
2. one exact candidate commit and dossier digest exist;
3. all five seats approve that exact candidate with no veto;
4. the planning PR is merged and the six issue #3 links resolve to those artifacts on `main`;
5. structural validation passes and `executionAllowed` remains false; and
6. no private, authentic, status, issue-count, or Project-workflow mutation is needed.

This is a bounded non-runtime bootstrap approval under the activated Goal and `P0-ED-011`; it permits only the reviewed control-edit workflow and later audit-only merge/reconciliation. It is not a task Ready transition or PC-001 execution authorization and does not exploit the control weakness being repaired.

## Implementation exit gate

The implementation candidate remains Hold until fresh Independent QA executes the full matrix and Product, Design, Architecture, QA, and Project seats review the exact code/evidence revision. Merge, sync, Wiki publication, or later task promotion is prohibited while a required check, parity comparison, Sev-1/Sev-2, critical/high privacy/security finding, or specialist veto remains.

## Current blockers

- Gate A planning review and merge are complete; they do not approve the implementation candidate.
- The exact control-implementation candidate revision, complete task-file manifest, and candidate dossier digest are not yet recorded.
- Fresh Independent QA and five-seat implementation attestations are not yet complete.
- Exact-main merge, generated reconciliation, Wiki/log publication, and two quiescent live parity snapshots remain pending.
- All 58 task readiness records remain Incomplete/Hold and execution-disallowed.
- `P0-OA-001` remains necessary for every private read, but cannot overcome the cardinality denial on the seven composite task contracts. No private lane is requested here.

## Council decision

**`historical-non-authorizing`** with `executionAllowed=false` while the control implementation is in review.

The next permitted action is to finish local/public validation, commit one exact implementation candidate over the merged planning base, and obtain fresh Independent QA plus five-seat exact-candidate review. No R0, private, authentic-content, deployment, or release work begins under this record.

## Re-review trigger

Re-review after any scope, requirement, test ID, artifact hash, stable workflow/tool set, stable-versus-mutable partition, identity/authority schema, refresh transaction, tracker plan, or public-safety boundary changes. For PC-001 Gate B, a later registry-only commit appends the non-authorizing `controlReviews.PC-001` record for the exact sole child of accepted Gate A. Repository history derives its first publication and rejects deletion, rewrite, context/seat/hash drift, or any current/historical `taskApprovals.PC-001`. The exact workflow plus thirteen tool modules remain current-byte-bound; thirteen named documentation/state snapshots may evolve through later normal reviewed reconciliation; unknown or missing implementation paths fail. Unrelated R0 projections/evidence likewise do not rewrite this historical review. The evaluator/runtime ignore the section, so it cannot make PC-001 or any R0 task Ready.
