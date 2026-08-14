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
- **Requested post-review scope:** local/public readiness-control hardening under existing `PC-001` / issue #3.
- **Explicit exclusions:** Life in Days application/prototype/R0 feature changes; private or authentic data; host/provider access; deployment/release; new task/issue; issue status/state change; Project workflow mutation.
- **Planning candidate revision:** not yet recorded.
- **Planning dossier digest:** not yet recorded.
- **Central readiness registry:** remains all-Hold with `executionAllowed=false`; this file does not self-reference its containing commit.

## Shared requirements and tests

The five seats review the same ten corrective requirements `PC-001-CR-001..010` in the [task PRD](./P0-PC-001-PRD.md), frozen implementation decisions in the [Technical Plan](./P0-PC-001-TECHNICAL-PLAN.md), operator contract in the [Design Spec](./P0-PC-001-DESIGN-SPEC.md), QA cases `PC-001-CTL-P01`, `P02`, `N01..N07`, `R01`, `R02`, and `S01` in the [QA Plan](./P0-PC-001-QA-PLAN.md), and the two-PR publication/reconciliation path in the [Delivery Plan](./P0-PC-001-DELIVERY-CHECKLIST.md).

## Pre-authoring Council direction

These findings defined the packet but are not exact-candidate approval:

| Seat | Direction | Required before code starts |
| --- | --- | --- |
| Product Manager | Go to author the bounded corrective packet; Hold R0 and current generic PRD. | Exact invariants, measures, scope, and non-goals in one committed Product artifact. |
| UI/UX Designer | Go to author; Design is applicable to operator evidence; Hold code/current generic spec. | Three journeys, frozen labels/states, accessibility, failure content, and no app UI change. |
| Technical Architect | Go to author under PC-001 only; Hold code. | Shared derivation, fixtures, publication/activation split, identity, authority/actions, and refresh transaction. |
| Independent QA | Go to remediate the dossier; Hold code/current packet. | Two positive paths, isolated negative per gate, atomicity, determinism, parity, and public-safety matrix. |
| Project Manager | Go under issue #3; no 59th issue; Hold all R0 tasks. | Two-PR gate, exact-main sync, workbook/Wiki/parity, no status or workflow mutation. |

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

This is a bounded bootstrap authorization under the activated Goal and `P0-ED-011`; it is not a task Ready transition and does not exploit the control weakness being repaired.

## Implementation exit gate

The implementation candidate remains Hold until fresh Independent QA executes the full matrix and Product, Design, Architecture, QA, and Project seats review the exact code/evidence revision. Merge, sync, Wiki publication, or later task promotion is prohibited while a required check, parity comparison, Sev-1/Sev-2, critical/high privacy/security finding, or specialist veto remains.

## Current blockers

- Planning candidate revision and dossier digest are not yet recorded.
- Exact-candidate five-seat attestations are not yet complete.
- No fixture harness or hardening implementation has been executed.
- All 58 task readiness records remain Incomplete/Hold and execution-disallowed.
- `P0-OA-001` still blocks every private read; no private lane is requested here.

## Council decision

**`historical-non-authorizing`** with `executionAllowed=false` while this planning candidate is in review.

The next permitted action is to validate and commit only these six artifacts, then obtain five-seat exact-candidate review. No control-code or R0 implementation begins before that gate.

## Re-review trigger

Re-review after any scope, requirement, test ID, artifact hash, implementation file set, identity/authority schema, refresh transaction, tracker plan, or public-safety boundary changes. A later approval-registry commit records candidate-bound attestations without rewriting the reviewed six-artifact candidate.
