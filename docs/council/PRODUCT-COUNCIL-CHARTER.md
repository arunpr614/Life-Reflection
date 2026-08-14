# Life in Days Phase 1 — Product Council charter

- **Status:** active
- **Council formed:** 2026-08-14
- **Product owner and final decision authority:** Product Owner
- **Release-plan owner:** Project Manager

## Mandate

The Product Council converts the frozen product requirements, UX specification, and v5 prototype into a release system that can deliver the complete private product through small, meaningful, independently verifiable production increments on the existing shared Hetzner host.

The council owns planning and evidence design. It does not claim that implementation, provider qualification, live-host capacity, deployment, recovery, accessibility, or production readiness has passed until the named evidence exists.

## Membership and decision rights

| Role | Accountable decisions | Required outputs |
| --- | --- | --- |
| Product Owner | Product boundary, material trade-offs, production go/no-go, spend-bearing provider choices | Review decisions and final launch acceptance |
| Expert Product Manager | Outcome scope, milestone boundaries, individual release requirements, non-goals and success measures | Product review and one PRD per release |
| Expert UI/UX Designer | User flows, design-state coverage, accessibility, content, responsive behavior and prototype gaps | UX review and release-level design traceability |
| Expert Technical Architect | Architecture, data/privacy boundaries, shared-host coexistence, implementation sequence, testing, deployment and rollback | Hetzner spike, implementation plan and runbook |
| Expert Project Manager | Integrated schedule, dependencies, task ownership, risk/change control, workbook, GitHub milestones and roadmap truth | Release plan, Excel workbook, roadmap manifest and completion audit |

The Product Council scopes releases together. No single discipline may trade away another discipline's launch-blocking acceptance contract.

## Release design principles

1. **A release must create a verifiable outcome.** R0 may expose only a synthetic private shell; R1 must be the first release that creates and revisits a real user-authored Journal Day.
2. **Every release is rollbackable.** Schema, data, callbacks, jobs, and infrastructure changes need a forward path, rollback or forward-fix boundary, and restored-data proof.
3. **Recovery grows with the data shape.** A release cannot add a new durable record without updating export, backup, restore, and deletion behavior for that record.
4. **Trust precedes generative polish.** Source truth, dates, provenance, lifecycle, private media, and recovery ship before hosted text or artwork generation.
5. **External behavior is proven synthetically first.** VoiceNotes and AI model contracts remain gated until their approved synthetic evaluations pass.
6. **The shared host is a constraint, not an assumption.** No coexistence or capacity claim passes without a sanitized live preflight and collision/resource checks.
7. **No dates are hidden commitments.** Workbook and GitHub dates are proposed ranges. Gate failure moves downstream dates.

## Roadmap truth contract

GitHub Project #1 uses exactly four work segments:

| Segment | Meaning |
| --- | --- |
| **Backlog** | Approved planning item that is not yet the next authorized work. Conditional items remain here until their trigger occurs. |
| **Next** | The next executable item after its listed entry gates are satisfied. It may still require Product Owner authorization or credentials. |
| **In progress** | Work is actively underway with a named owner and current evidence location. |
| **Done** | The outcome and every named acceptance/evidence requirement exist. Documentation or prototype intent alone is insufficient. |

Every roadmap task must contain:

- stable task ID and concise outcome title;
- milestone and proposed start/target dates when schedulable;
- owner role, priority and dependencies;
- description and acceptance evidence;
- links to its release PRD/PID and relevant design artifacts;
- mapped `LID-*` requirement IDs; and
- an evidence-based status.

## Council workflow

1. Each discipline reviews the same frozen [source baseline](PHASE1-SOURCE-BASELINE.md).
2. The Product Manager proposes milestone outcomes and requirement allocation.
3. The UI/UX Designer tests each slice for coherent user value and names missing design work.
4. The Technical Architect tests each slice for a deployable vertical path and names technical gates.
5. The Project Manager reconciles dependencies, dates, risks, staffing assumptions and evidence into one release plan.
6. The council records disagreements and the selected option in the decision record.
7. The Project Manager publishes the workbook, repository artifacts, GitHub milestones/issues and Project fields from one validated roadmap manifest.

## Release-ready gate

A release may move from Backlog to Next only when:

- its PRD is internally consistent and requirement-complete for the slice;
- required UX states and acceptance procedures exist;
- architecture, data migration, privacy, test, deployment and rollback paths are named;
- external spikes/ADRs required for the slice have passed or are explicit first tasks;
- no predecessor evidence is missing; and
- the owner has authorized any credential, spend or live mutation needed next.

## Release-done gate

A release is Done only when:

- every release task meets its acceptance evidence;
- mapped requirements have passing evidence, not only a plan;
- new persistent data is included in verified backup, restore and export paths;
- privacy, security, accessibility, browser and failure checks appropriate to the slice pass;
- the production deployment and rollback evidence exists for that version; and
- the Product Owner has completed the milestone walkthrough.

## Publication and privacy boundary

Council artifacts are suitable for the public repository. They use placeholders for hosts, ports, identities, account details, credentials and recovery material. Live evidence may record sanitized counts, thresholds and pass/fail results; secrets, personal content, exact private topology and unique host identifiers never enter GitHub or the workbook.

## Working cadence

- Council planning review: at every release boundary or requirement change.
- Delivery status: update GitHub Project when work starts, evidence lands, a gate blocks, or dates move.
- Risk review: weekly while a release is active.
- Release decision: Product Owner walkthrough before each production promotion.
- Recovery review: after every new durable data type, then on the cadence defined by the implementation plan.
