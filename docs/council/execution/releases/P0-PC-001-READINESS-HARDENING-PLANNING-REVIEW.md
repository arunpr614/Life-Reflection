# PC-001 readiness-control hardening — planning review

- **Task:** `PC-001` / issue #3
- **Review date:** 2026-08-15 IST
- **Reviewed revision:** `d44dbfbc8d040baddf46b7288476d4dc53c81e8c`
- **Canonical dossier digest:** `sha256:32deebe971b1321a7ccd4203d4c861d93c4ec3d45ba3bf4c9fab2ea048b9eaed`
- **Disposition:** **Accepted planning scope; merge Gate A before any control-code edit**
- **Execution allowed:** `false`
- **Evidence boundary:** this is candidate-bound planning approval, not executed test evidence or task Ready status. It authorizes only later local/public control hardening after the planning PR merges.

## Reviewed packet

| Discipline | Path | SHA-256 |
| --- | --- | --- |
| Product | `docs/work-items/PC-001/P0-PC-001-PRD.md` | `68ab74c94226a4ee650d1cb89929abe85941bdef3acabac50fa846e048f23f27` |
| Architecture | `docs/work-items/PC-001/P0-PC-001-TECHNICAL-PLAN.md` | `43367fff28fa07042de795c6a90af7cbe4c9a3721d1e797c20fbbf257ffacfcf` |
| Design | `docs/work-items/PC-001/P0-PC-001-DESIGN-SPEC.md` | `5f5343a528313f000b0b22ea9c02aa3d17e449b84ad7c5fed3e84999debb09e2` |
| QA | `docs/work-items/PC-001/P0-PC-001-QA-PLAN.md` | `c7a8f4c346e3715f8ea015fcb9f96a07b3327d68b38e7e9b18115e3c167e5bfb` |
| Delivery | `docs/work-items/PC-001/P0-PC-001-DELIVERY-CHECKLIST.md` | `ddd11117218c3c65428e4743b62d7677c1f90d024b3b7817f5bbc6788f4c5b8d` |
| Council | `docs/work-items/PC-001/P0-PC-001-COUNCIL-READINESS.md` | `b01136fe1979d079157a8cedfbfcdb4d361a18016e9d7b2b9bbeedc1c726a1ff` |

The digest is `sha256(JSON.stringify({taskId, revision, artifacts}))`, where `taskId` is `PC-001` and artifact keys are inserted in canonical order: `product`, `architecture`, `design`, `qa`, `delivery`, `council`. Each artifact value contains `path` followed by `sha256`.

## Five-seat attestations

| Seat | Verdict | Candidate-bound evidence reference | Decisive rationale |
| --- | --- | --- | --- |
| Product Manager | Approve planning scope | `codex-agent:pc001-plan-product-r3-20260815` | Ten corrective requirements remain measurable, and the revised determinism boundary distinguishes byte-stable controls from semantically/render-equivalent workbook packaging. |
| UI/UX Designer | Approve planning scope | `codex-agent:pc001-plan-design-r3-20260815` | Operator evidence, three journeys, exact labels/states, accessibility, the existing 17-field mapping, and all 20 workbook render checks remain coherent. |
| Technical Architect | Approve planning scope | `codex-agent:pc001-plan-architecture-r3-20260815` | Fail-closed derivation, candidate/publication/activation split, identity/action/authority schemas, protected refresh, rollback, and the artifact-specific determinism boundary are implementable and bounded. |
| Independent QA | Approve planning scope | `codex-agent:pc001-plan-qa-r3-20260815` | Same-build workbook hash equality and cross-build semantic/render equivalence are independently testable; the current workbook remains on a separate visual HOLD until repaired. No test execution is claimed. |
| Project Manager | Approve planning scope | `codex-agent:pc001-plan-project-r3-20260815` | Existing issue #3 remains the sole tracker; the two-PR gate, exact-main sync, 17-value parity, workbook/Wiki/log reconciliation, and two-snapshot verification preserve status truth. |

All five reviewers independently matched the six artifact hashes and canonical digest. No planning-scope veto remains. The primary implementation integrator did not substitute for a specialist seat; the QA reviewer did not author the packet or implementation-test evidence.

## Review history and repairs

The first candidate, `7d64fa1a54a37e056c1e0f9f34dba0c48cc0f4d1`, was not accepted. Design held it because machine Design coverage remained pending/unmapped, QA named an obsolete `348 Draft` live oracle although the packet contained six In-review artifacts, and the existing 17 Project values lacked an exact evidence-to-field mapping. Candidate `8bbd52d…` resolved those findings and received five-seat approval, but a subsequent independent workbook build showed that packaging-only OOXML relationship IDs can change while the workbook remains semantically identical. That finding invalidated R2. Candidate `d44dbfb…` replaced the overbroad byte-determinism claim with exact same-build published-copy hashes plus exhaustive cross-build semantic and 20-render equivalence; every earlier disposition was superseded and all five seats re-reviewed the R3 hashes.

Before the first review completed, the integrator also reported a noncanonical provisional digest created with filenames rather than artifact-kind keys. Reviewers rejected that value, the canonical serialization was made explicit, and no approval bound the discarded digest. This record contains only the independently recomputed canonical digest for the accepted candidate.

The planning packet defines how the workbook defect must be verified; it does not accept the current workbook. Independent visual QA still holds the generated workbook for clipped Requirement Map rows, unreadably small task-detail continuation renders, missing repeated title/header context, and an unexplained title-less Review Guide preview. Those defects must be repaired and the full `PC-001-CTL-R02` workbook matrix must pass before evidence handoff.

## Verified candidate state

- Static execution-control validation passed at the reviewed commit.
- Requirements remain 78 total, 71 active, and the exact seven deferred.
- Tasks remain 58 total, 55 P0/R0–R9 and three R10; statuses remain 40 Backlog / 4 Next / 1 In progress / 13 Done.
- All 58 dossiers remain Incomplete, zero are Ready, and zero have `executionAllowed=true`.
- Artifact states are exactly 342 Draft, six In-review, and zero Approved/Blocked/Not-applicable.
- Proposed PC-001 Design coverage is mapped while all central artifact reviews and seat verdicts remain Hold.
- Deployment remains `Unknown — private read authority pending`; authentic-media access remains false.

## Accepted code-start gate

Local/public readiness-control implementation may begin only after:

1. this review record and the unchanged six reviewed artifacts merge through a normal planning PR;
2. issue #3 resolves to the merged six artifacts and this evidence record;
3. the merged exact-main checkout passes structural validation with `executionAllowed=false`;
4. no status, issue-count, Project field/view/workflow, private, authentic, R0, deployment, or release mutation is needed; and
5. the implementation starts from the exact merged planning source on a separate branch/PR.

The implementation candidate must receive fresh Independent QA execution of `PC-001-CTL-P01`, `P02`, `N01..N07`, `R01`, `R02`, and `S01`, followed by all five exact-candidate Council seats. Any changed reviewed artifact invalidates this planning approval.

## Excluded authority

This record does not make `PC-001` or any R0 task Ready, does not change issue #3's historical `Done` meaning, and does not authorize private-system access, credentials, authentic content/media, application/prototype work, deployment, restore, release, production, a 59th issue, or a Project workflow mutation. `P0-OA-001` remains mandatory before every private R0 read.
