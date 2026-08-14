# PRD R8 — Operational Scale and Resilience

## Document control

| Field | Value |
| --- | --- |
| Release | R8 — Operational Scale and Resilience |
| Document type | Product requirements document |
| Status | Planning draft; not an approval or release record |
| Accountable role | Product owner |
| Proposed start | 2027-02-01 |
| Proposed target | 2027-02-19 |
| Date confidence | Planning estimate only. Evidence gates, not dates, control entry and exit. |
| Evidence boundary | This document defines intended resilience and integrated regression behavior. It does not establish implementation, testing, deployment, production use, launch readiness, or acceptance. |

## Related artifacts

- [Governing product requirements](../PRODUCT-REQUIREMENTS.md)
- [Product Manager review](../../council/PRODUCT-MANAGER-REVIEW.md)
- [Phase 1 release plan](../../project/PHASE1-RELEASE-PLAN.md)
- [Phase 1 implementation plan](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [Shared-host deployment spike](../../research/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md)
- [UX specification](../../design/UX-SPECIFICATION.md)
- [Prototype v5 feature audit](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md)
- [Prototype v5](../../../prototypes/calendar-ui/index-v5.html)

Neither the shared-host spike nor prototype proves sustained integrated operation. R8 requires executed capacity, fault, recovery, security, browser, and accessibility evidence.

## Problem and intended outcome

An archive can satisfy isolated feature scenarios and still fail as a system under low disk space, restart, partial jobs, failed providers, failed backups, or a changing browser viewport. Before launch acceptance, the integrated R0–R7 product needs to degrade safely and expose truth about capacity, jobs, spend, credentials, backup, and restore.

R8 intends to make the integrated archive operationally understandable and recoverable. It validates storage watermarks and emergency behavior, durable System Health, backup/restore across every existing data shape, cross-dependency fault isolation, and the full supported browser/accessibility matrix. It does not perform the conditional object-store transition.

## Scope and requirement boundary

**Included requirement IDs (5):** LID-OPS-006, LID-OPS-011, LID-OPS-014, LID-OPS-018, LID-REF-006.

**Excluded requirement IDs (73):** LID-SCP-001, LID-SCP-002, LID-SCP-003, LID-SCP-004, LID-TG-001, LID-TG-002, LID-TG-003, LID-TG-004, LID-TG-005, LID-TG-006, LID-TG-007, LID-TG-008, LID-TG-009, LID-TG-010, LID-VN-001, LID-VN-002, LID-VN-003, LID-VN-004, LID-VN-005, LID-VN-006, LID-VN-007, LID-UP-001, LID-UP-002, LID-UP-003, LID-UP-004, LID-SRC-001, LID-SRC-002, LID-SRC-003, LID-SRC-004, LID-REF-001, LID-REF-002, LID-REF-003, LID-REF-004, LID-REF-005, LID-REF-007, LID-AIT-001, LID-AIT-002, LID-AIT-003, LID-AIT-004, LID-AIT-005, LID-AIT-006, LID-AIT-007, LID-AIA-001, LID-AIA-002, LID-AIA-003, LID-AIA-004, LID-AIA-005, LID-AIA-006, LID-AIA-007, LID-AIA-008, LID-AIA-009, LID-AIA-010, LID-AIA-011, LID-OPS-001, LID-OPS-002, LID-OPS-003, LID-OPS-004, LID-OPS-005, LID-OPS-007, LID-OPS-008, LID-OPS-009, LID-OPS-010, LID-OPS-012, LID-OPS-013, LID-OPS-015, LID-OPS-016, LID-OPS-017, LID-DEF-001, LID-DEF-002, LID-DEF-003, LID-DEF-004, LID-DEF-005, LID-DEF-006.

Excluded means not newly owned by R8. R8 has an exact integrated regression scope of 70 previously or currently release-owned P0 IDs:

LID-SCP-001, LID-SCP-002, LID-SCP-003, LID-SCP-004, LID-TG-001, LID-TG-002, LID-TG-003, LID-TG-004, LID-TG-005, LID-TG-006, LID-TG-007, LID-TG-008, LID-TG-009, LID-TG-010, LID-VN-001, LID-VN-002, LID-VN-003, LID-VN-004, LID-VN-005, LID-VN-006, LID-VN-007, LID-UP-001, LID-UP-002, LID-UP-003, LID-SRC-001, LID-SRC-002, LID-SRC-003, LID-SRC-004, LID-REF-001, LID-REF-002, LID-REF-003, LID-REF-004, LID-REF-005, LID-REF-006, LID-REF-007, LID-AIT-001, LID-AIT-002, LID-AIT-003, LID-AIT-004, LID-AIT-005, LID-AIT-006, LID-AIT-007, LID-AIA-001, LID-AIA-002, LID-AIA-003, LID-AIA-004, LID-AIA-005, LID-AIA-006, LID-AIA-007, LID-AIA-008, LID-AIA-009, LID-AIA-010, LID-AIA-011, LID-OPS-001, LID-OPS-002, LID-OPS-003, LID-OPS-004, LID-OPS-005, LID-OPS-006, LID-OPS-008, LID-OPS-009, LID-OPS-010, LID-OPS-011, LID-OPS-012, LID-OPS-013, LID-OPS-014, LID-OPS-015, LID-OPS-016, LID-OPS-017, LID-OPS-018.

LID-OPS-007 remains explicitly outside R8 transition execution. R8 validates storage-neutral readiness, watermarks, emergency behavior, and the R10 entry signal; it does not move live media.

## Owner scenarios

1. The owner views durable System Health for capture, reconciliation, backup, sampled restore, storage capacity, AI spend, credential health, staging, and swap without exposing content.
2. Capacity measurements cross each simulated or controlled watermark and produce the specified warning, migration-readiness, write-routing readiness, and media-admission behavior.
3. At the hard safety boundary, new media is rejected clearly while text capture, reads, deletion recovery, export, and backup continue when their dependencies are healthy.
4. Messaging, voice retrieval, text model, artwork model, object-store readiness, scheduled job, thumbnail, search index, or alert dependency fails independently; authentic local sources remain readable and manageable.
5. The service and each durable job restart mid-operation and converge idempotently without duplicate capture, overwrite, resurrection, double spend, or false health.
6. A full encrypted backup and representative restore covers every R0–R7 data shape and measures actual recovery time.
7. The owner completes every core flow across the supported browser, phone, keyboard, screen-reader, zoom, contrast, theme, and reduced-motion matrix.

## Functional acceptance

- LID-OPS-006: actual filesystem bytes drive capacity state; approved warning/start, preparation/dual-write, target-write/proof, media-rejection, and host-free safety thresholds are visible and exercised with controlled evidence.
- LID-OPS-006: emergency media stop never deletes or downsamples Originals and preserves healthy text journal, read, backup, export, and deletion-recovery behavior; capture gives a clear non-content-bearing failure.
- LID-OPS-014: health distinguishes unknown, never run, success, delayed, failed, and blocked from durable completion evidence for integrations, backups, sampled restore, capacity, spend, credentials, staging, and swap.
- LID-OPS-011: application-consistent encrypted backup includes every current/historical source, file, media, derived artifact, revision, Correction, review item, Trash record, suppression, job, usage, manifest, and minimum rebuild configuration without runtime secrets.
- LID-OPS-011: repository check and sampled database/text/photo/artwork restores succeed; a full disposable-environment drill measures against four hours; upload completion is not labeled recovery.
- LID-OPS-018: restarts resume idempotent jobs; each dependency fault remains visible without cross-provider fallback or loss of healthy authentic-source browsing/correction; copy makes no high-availability promise.
- LID-REF-006: capture management, Calendar, Timeline, Search, Journal Day, Settings, History, Trash, export, health, text generation, and artwork flows meet the full supported browser/responsive/accessibility contract.
- Integrated regression: all 70 IDs named above have representative happy, boundary, failure, privacy, recovery, and rollback coverage proportional to their risk.

## Nonfunctional acceptance

- Resource use, disk/media bytes, host-free space, staging, swap, job age, provider health, backup, restore, and spend measurements have defined source, freshness, units, and failure state.
- Fault injection is bounded and recoverable; it uses synthetic or explicitly authorized fixtures and never endangers an unrelated service or authentic archive.
- Restart, replay, reservation, reference, suppression, lifecycle, and job invariants hold under repeated execution.
- Sanitized logs and evidence contain no journal, photo, caption, prompt, provider response, credential, access assertion, signed URL, or query.
- Browser/accessibility review covers current two major desktop browser versions plus current iOS Safari and Android Chrome at the planned execution time.
- Every R0–R8 data shape has an independently executable backup/restore and release rollback path.

## Design contract

R8 design covers System Health taxonomy, freshness, drill-down, capacity bands, migration-readiness notice, emergency media stop, dependency outage, degraded-but-readable archive, job restart, backup/repository-check/restore evidence, credential expiry, spend state, staging/swap invariant, alert/recovery transition, browser-specific fallback, and every blocking accessibility issue resolution.

The [UX specification](../../design/UX-SPECIFICATION.md) governs these states. [Prototype v5](../../../prototypes/calendar-ui/index-v5.html) contains only a System Health placeholder and cannot be used as operational or accessibility evidence.

## Architecture and dependency gates

- R0–R7 each has an evidence-backed proceed decision, independently usable rollback, and backup/restore evidence for its introduced data shape.
- Capacity measurements and exact watermark actions must be implemented behind a controllable test interface that does not require filling a live disk destructively.
- Health sources, freshness, durable completion semantics, repeated-failure alerts, restart/replay, resource isolation, and fault-test boundaries are reviewable.
- Backup scope and restore runbook enumerate every R0–R7 shape and support a disposable full drill.
- R10 transition plan exists as a conditional PID, but no transition begins without the approved measured trigger.

## Outcome metrics

| Metric | R8 target | Evidence placeholder |
| --- | --- | --- |
| Watermark behavior | 100% of controlled threshold fixtures produce the specified state/action | Not yet provided |
| Health truth | Zero optimistic success; every displayed value has source, freshness, and durable evidence | Not yet provided |
| Fault isolation | 100% of named dependency-fault fixtures preserve healthy authentic-source access | Not yet provided |
| Restart integrity | Zero duplicate/loss/resurrection/double-spend outcome across restart fixtures | Not yet provided |
| Backup coverage | 100% of enumerated R0–R8 data shapes appear in snapshot and manifest | Not yet provided |
| Recovery | Representative restores match checksums/relationships; full drill measured against four hours | Not yet provided |
| Browser/accessibility | No unresolved blocking issue in the complete required matrix | Not yet provided |
| Rollback | One integrated rollback returns application/data/jobs to the recorded pre-change state | Not yet provided |

## Privacy and security

- Capacity, health, fault, backup, restore, and performance evidence uses sanitized values and opaque identities.
- No operational artifact becomes a shadow archive; private content and secrets remain outside logs, alerts, metrics, dashboards, screenshots, and public reports.
- Fault injection cannot weaken human/callback authorization, cache policy, encryption, or secret handling.
- Restore targets are disposable and private; restored authentic data, if explicitly authorized, is removed according to the approved recovery procedure.
- The object-store target, credentials, object keys, network details, and real storage inventory do not appear in public evidence.

## Accessibility

R8 is the integrated accessibility gate. All core flows must be operable by keyboard and touch, expose visible focus and meaningful labels, retain content/actions at zoom, meet WCAG 2.2 AA contrast targets in both themes, honor reduced motion, and remain responsive. Calendar covers and photo controls cannot depend on image description; owner-authored private descriptions remain local. Unknown, delayed, failed, blocked, stale, and emergency states must be textual and screen-reader announced.

## Recovery and rollback

R8 adds capacity samples/state transitions, expanded health facts, fault/drill records, operational alert transitions, and any restart/reconciliation metadata. Exit requires an encrypted backup and executed restore of these shapes plus every prior shape. The full drill records actual elapsed time against the four-hour target and does not expose keys or content.

Rollback is integrated: application, schema, jobs, schedules, health facts, and capacity controls return to the recorded pre-change state while authentic R0–R7 data remains intact. It must not disable a hard storage safety stop. If a safety threshold is active, rollback follows the safer configuration and records the exception.

## Release entry criteria

- R0–R7 exit criteria and proceed records exist.
- Each release has backup/restore and rollback evidence for its new data shape.
- Controlled watermark, fault, restart, browser/accessibility, backup, restore, and rollback plans have safety boundaries and synthetic fixtures.
- The full backup inventory and disposable recovery environment are ready.
- Any current storage warning is assessed; an active R10 trigger is not ignored.

## Release exit criteria

- Every included requirement and the named 70-ID integrated regression scope have executed evidence or an explicit no-go.
- Watermark, emergency stop, health truth, dependency fault, repeated alert, job restart, backup, repository check, sampled restore, full recovery, browser/accessibility, privacy/security, and rollback results meet their stated outcomes.
- Every R0–R8 data shape appears in the recovery inventory and restores with selected checksum/relationship comparisons.
- No unresolved severity-1 or severity-2 defect remains, and the decision record says proceed, hold, or roll back.

## No-go criteria

- Capacity source, threshold state, or hard media-stop behavior is unknown, optimistic, or unsafe.
- A dependency failure, restart, or job replay loses/corrupts authentic source, resurrects deleted content, duplicates spend/capture, or blocks healthy local browsing.
- Health, logs, metrics, alerts, screenshots, or evidence expose private content or secrets.
- Full backup/restore or integrated rollback is unexecuted or fails a checksum/relationship gate.
- A blocking browser/accessibility issue remains.
- An approved R10 watermark has triggered but the transition or emergency response is neither authorized nor safely contained.

## Explicit non-goals

- Net-new capture, reflection, management, AI, social, or integration capability.
- Private launch authority; R9 owns owner acceptance and stabilization.
- Executing, scheduling, or claiming completion of object-store transition.
- High availability, service-level agreement, multi-region recovery, or zero-downtime promise.
- Public dashboards, third-party analytics, public status pages, or personal-content observability.

## Evidence register

| Evidence | Expected artifact | Status |
| --- | --- | --- |
| Requirement traceability | R8 owned and 70-ID integrated regression checklist | Not yet provided |
| Design review | Health, capacity, degraded, recovery, browser, and accessibility states | Not yet provided |
| Architecture decision | Measurements, thresholds, health evidence, faults, restart, recovery, and rollback records | Not yet provided |
| Functional/regression report | Watermark, fault, restart, core journey, and safety results | Not yet provided |
| Privacy/security report | Threat, log/metric/alert/dashboard/evidence, cache, auth, and restore-target review | Not yet provided |
| Accessibility/browser report | Complete required browser, responsive, keyboard, screen-reader, zoom, contrast, theme, and motion matrix | Not yet provided |
| Backup/restore report | Full inventory, repository check, sampled restores, full drill, comparisons, and elapsed time | Not yet provided |
| Rollback report | Integrated application/schema/job/data/safety-state rollback results | Not yet provided |
| Owner review | Resilience walkthrough and proceed, hold, or rollback decision | Not yet provided |

## Evidence boundary

The existence of plans, health designs, or test cases is not operational proof. Only executed sanitized evidence can support a later resilience, recovery, accessibility, deployment, or acceptance claim.
