# Life in Days — Phase 1 Product Council Decision Record

- **Decision date:** 2026-08-14
- **Current authority overlay:** [P0-ED-016 — bounded R0 authority](execution/P0-PHASE1-EXECUTION-DECISIONS.md#p0-ed-016--bounded-r0-authority), 2026-08-16
- **Status:** Accepted as the planning baseline; not an implementation, deployment, or production approval
- **Council:** Product Manager, UI/UX Designer, Technical Architect, Project Manager
- **Authoritative task source:** [Phase 1 Roadmap Manifest](../project/PHASE1-ROADMAP-MANIFEST.json)

## Decision

The Product Council adopts P0 plus R0–R10 as the Phase 1 delivery baseline for Life in Days. The plan uses 58 durable task IDs, 78-requirement traceability, small owner-verifiable releases, per-release rollback and restore evidence, and one live GitHub Project segmented into `Backlog`, `Next`, `In progress`, and `Done`.

## Accepted release sequence

1. P0 — Council Planning Baseline
2. R0 — Shared-Host Private Foundation, synthetic fixtures only
3. R1 — Manual Journal Archive, first release allowed to create an authentic owner memory
4. R2 — Telegram Photo Capture
5. R3 — Retrieval and Date Integrity
6. R4 — Source History and Lifecycle Safety
7. R5 — Prospective VoiceNotes Sync, gated by a synthetic contract spike
8. R6 — Generated Text Reflection, gated by exact model evaluation
9. R7 — Generated Artwork, gated by exact model evaluation
10. R8 — Operational Scale and Resilience
11. R9 — Private Launch Acceptance and Stabilization
12. R10 — Conditional Object-store Transition, date-free until a measured trigger is approved

Proposed dates are planning estimates in `Asia/Kolkata`. Evidence gates move dates; dates do not weaken gates.

## Accepted product boundary

- One private owner; no sharing, invitations, public links, anonymous journal routes, or multi-user records.
- Fixed `Asia/Kolkata` Journal Dates with immutable Original Timestamps and explicit backdating/redating.
- Authentic sources, Source Revisions, Corrections, and AI-derived artifacts remain distinct and reconstructable.
- VoiceNotes is prospective-only after Integration Activation; no historical bulk import.
- Telegram is the only photo-capture surface in MVP; manual browser upload accepts `.txt`/`.md` journal files only.
- Search is lexical/date/tag/caption based; no semantic search, journal Q&A, OCR, image recognition, or AI photo description.
- AI is optional, late, evaluated, budget-gated, provenance-labeled, and unable to block authentic archive functions.
- No real-photo bytes, thumbnails, metadata, identifiers, captions, or photo-derived descriptions may enter an AI request.

The 71 active requirements are planned; `LID-UP-004` and `LID-DEF-001` through `LID-DEF-006` remain explicitly deferred.

## Accepted UX position

Prototype v5 is retained as interaction intent for the Calendar, Journal Day, upload, reflection, artwork, Settings, responsive behavior, themes, keyboard direction, focus, and reduced motion. It is not persistence, integration, authorization, encryption, recovery, deployment, or production evidence.

Release-specific design must close missing Timeline, Needs Date Review, complete History, Trash, suppressions, export, System Health, Recovery Ceremony, diff/Correction, redating, failure, compact-width, and accessibility states before the corresponding implementation becomes Ready.

## Accepted architecture baseline

1. Reuse the existing Hetzner host only if the sanitized live R0 preflight proves safe coexistence.
2. Use a dedicated namespaced Docker Compose stack with independently controlled app processes, volumes, network, health checks, limits, and lifecycle.
3. Prefer SQLCipher/SQLite for the single-user, low-footprint launch only after the target runtime proves SQLCipher/FTS5 availability, one-web/one-worker WAL behavior, online backup, migration/restore, and crash recovery.
4. Use PostgreSQL as an evidence-triggered fallback if those gates fail; do not choose it from assumption or deploy both.
5. Bind human and callback listeners to distinct loopback ports. Route them through the existing tunnel without adding a public origin port.
6. Apply the external human access gate only to human routes; enforce callback-specific authentication, authorization, bounded input, rate protection, and isolated routing at the callback boundary.
7. Use application-controlled authenticated encryption for journal/media content, runtime-only secrets, off-server recovery material, encrypted independent Restic backup, and no plaintext ordinary-disk staging.
8. Launch live media on the existing encrypted root allocation only when capacity gates pass. Keep R10 conditional and reversible.
9. Isolate provider, callback, worker, job, backup, and object-store failures so authentic local browsing/correction remains available when local data is healthy.
10. Publish no private IP, account identifier, secret, credential, personal content, raw topology, or unsanitized live evidence.

This baseline is a design decision. It does not authorize provider, DNS, host, credential, or deployment mutations.

## Accepted delivery controls

- The [detailed release plan](../project/PHASE1-RELEASE-PLAN.md) and manifest define 58 task IDs and exact metadata.
- Release PRDs/PID define outcomes and gates; the [implementation plan](../architecture/PHASE1-IMPLEMENTATION-PLAN.md) defines technical execution.
- Every task links a PRD/PID and design artifact. Delivery tasks additionally link architecture, dependencies, acceptance evidence, and rollback/restore impact.
- A planning artifact may be Done without implying feature or release completion.
- An implementation or release item is Done only from executed, linked evidence in its named environment.
- No close/merge automation may set Done without evidence reconciliation.
- Each new persistent shape must be backed up, restored, and covered by rollback before its release-acceptance item closes.
- R9 contains stabilization and acceptance only; feature growth returns to Backlog.
- R10 Start and Target dates remain blank until the approved capacity trigger exists.

## Current status at publication baseline

| Status | Interpretation |
| --- | --- |
| Done | Completed planning artifacts: v5 audit, council package, release PRDs, and conditional transition PID |
| In progress | R0 shared-host coexistence/rollback spike: research and runbook exist; sanitized live-host proof remains outstanding |
| Next | R0 first-use/access/health design, architecture baseline, synthetic-shell implementation, and release acceptance |
| Backlog | Later release design, architecture, implementation, evaluation, QA, and acceptance work |

No implementation release is Done.

## Decisions deliberately left evidence-gated

| Decision | Evidence required | Failure response |
| --- | --- | --- |
| Existing host is safe for this stack | Sanitized capacity, filesystem, swap, namespace, port, tunnel, restart, backup, restore, rollback, and co-resident non-regression checks | Do not deploy or admit real data; revise topology within the no-new-instance constraint |
| SQLCipher/SQLite is suitable | Target image build, FTS5, encryption, WAL concurrency, online backup, migration/restore, and crash recovery | Document failure and select PostgreSQL fallback |
| VoiceNotes contract is implementable | Synthetic identity, authorization renewal, authoritative retrieval, tag/date/transcript, wakeup, replay, reconciliation, error/rate evidence | Block R5 and reopen affected Product/Architecture decisions |
| Text model/configuration may be enabled | Approved synthetic/blind hard-gate evaluation and exact configuration | Leave generated text disabled |
| Artwork model/configuration may be enabled | Approved synthetic/blind safety/quality/cost evaluation and exact sweep eligibility | Leave generated artwork disabled |
| Private launch may proceed | R8 acceptance, full owner UAT, Recovery Ceremony, severity gate, rollback readiness, explicit authority | No-go or rollback; continue stabilization without new scope |
| R10 may start | Measured storage watermark and approved transition entry record | Keep the milestone date-free and unstarted |

## Artifact ownership

| Artifact | Accountable council seat |
| --- | --- |
| Global and release PRDs/PID | Product Manager |
| UX specification, release designs, accessibility evidence | UI/UX Designer |
| Architecture, ADRs, deployment spike/runbook, threat/data flows, recovery design | Technical Architect |
| Release plan, workbook, GitHub milestones/issues/Project, RAID, schedule and status reconciliation | Project Manager |
| Implementation/test/deployment evidence | Assigned implementer with council review |
| Release go/no-go and authentic-memory authority | Owner, supported by the full council |

## Supersession and change control

This record supersedes earlier coarse milestone proposals for Phase 1 planning. It does not rewrite the governing PRD or UX Specification. Any change to product boundary, requirement disposition, release sequence, authentication, storage authority, AI/media boundary, recovery standard, or R10 trigger requires a dated addendum with affected task IDs and requirement IDs.

Task status, dates, and links are regenerated from the canonical manifest and synchronized to the workbook, repository issues, and live Project. A spreadsheet or Project-only edit is not a decision source.

## Council references

- [Product Manager Review](PRODUCT-MANAGER-REVIEW.md)
- [UX Design Review](UX-DESIGN-REVIEW.md)
- [Project Manager Review](PROJECT-MANAGER-REVIEW.md)
- [Product Council Charter](PRODUCT-COUNCIL-CHARTER.md)
- [Phase 1 Source Baseline](PHASE1-SOURCE-BASELINE.md)
- [Shared-host Deployment Spike](../research/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md)
- [Phase 1 Implementation Plan](../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [Phase 1 Release Plan](../project/PHASE1-RELEASE-PLAN.md)

## Final planning conclusion

The council accepts the package as a coherent plan for frequent, meaningful, owner-verifiable delivery on the existing-host constraint. Under the current bounded Goal, execution authority reaches R0 only and begins no further than the remaining R0 evidence gates. This planning decision does not claim those gates have passed and does not authorize authentic memories before R0 acceptance. R1-R10 remains frozen and requires a new direct Product Owner activation before execution.

## 2026-08-14 historical execution-authorization addendum

The then-directly activated Phase 1 Goal was the highest execution authority at the time. It preserved this planning decision and its evidence boundaries while superseding historical universal G1/“implementation not authorized” stops. The [P0 execution authorization](execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md) delegated routine R0–R8 decisions to a persistent five-seat execution council when every named gate passed and preserved all named human-only acts. This paragraph is retained as historical authority provenance; [P0-ED-016](execution/P0-PHASE1-EXECUTION-DECISIONS.md#p0-ed-016--bounded-r0-authority) and the 2026-08-16 bounded-authority addendum below control current scope.

The independent QA seat, current RACI, veto rules, Owner Action Ledger, and decisions are recorded in:

- [P0 execution council charter](execution/P0-PHASE1-EXECUTION-COUNCIL-CHARTER.md)
- [Independent QA Lead charter](agents/P0-QA-LEAD.md)
- [P0 execution decisions](execution/P0-PHASE1-EXECUTION-DECISIONS.md)
- [P0 Owner Action Ledger](execution/P0-OWNER-ACTION-LEDGER.md)
- [P0 execution-control review](execution/releases/P0-P0-EXECUTION-CONTROL-REVIEW.md)

This addendum also records two source corrections before delivery reliance: R4 uses exactly keep the Correction, display newest upstream revision, or create a new Correction based on both; System Health derives the six PRD evidence states and maps them to explicit UX labels. Deployment remains **Unknown — private read authority pending**.

## 2026-08-16 bounded-authority addendum

The directly activated bounded P0/R0 Gold Goal, as recorded by [P0-ED-016](execution/P0-PHASE1-EXECUTION-DECISIONS.md#p0-ed-016--bounded-r0-authority), is the highest current execution authority. It preserves the complete P0/R0–R10 release sequence, requirements, and evidence gates as the planning baseline but limits release-execution authority to the R0 envelope, subject to the exact stage controls. At present, only the local/public Stage 0 control repair is authorized; no R0 implementation, private-system action, deployment, authentic-content admission, acceptance, release, or production work is authorized. All 50 R1-R10 tasks and their 300 task artifacts are frozen and out of scope. Historical broader Goals and delegations do not authorize those releases; any broader execution requires a new direct Product Owner activation.
