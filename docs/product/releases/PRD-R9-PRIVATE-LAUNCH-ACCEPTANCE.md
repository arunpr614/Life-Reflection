# PRD R9 — Private Launch Acceptance and Stabilization

## Document control

| Field | Value |
| --- | --- |
| Release | R9 — Private Launch Acceptance and Stabilization |
| Document type | Product requirements document |
| Status | Council-reviewed planning baseline; not an implementation, deployment, launch, or release-acceptance record |
| Accountable role | Product owner |
| Proposed start | 2027-02-22 |
| Proposed target | 2027-03-12 |
| Date confidence | Planning estimate only. Evidence gates, not dates, control entry and exit. |
| Evidence boundary | R9 defines integrated owner acceptance and stabilization. It does not establish that any earlier release exists or that the private archive is deployed, production-ready, launched, or accepted. |

## Related artifacts

- [Governing product requirements](../PRODUCT-REQUIREMENTS.md)
- [Product Manager review](../../council/PRODUCT-MANAGER-REVIEW.md)
- [Phase 1 release plan](../../project/PHASE1-RELEASE-PLAN.md)
- [Phase 1 implementation plan](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [UX specification](../../design/UX-SPECIFICATION.md)
- [Prototype v5 feature audit](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md)
- [Prototype v5](../../../prototypes/calendar-ui/index-v5.html)

Prototype completeness and planning-task completion do not count as private-launch acceptance.

## Problem and intended outcome

Feature-level evidence does not prove that one owner can rely on the complete archive in routine use. Before any private launch decision, the owner must walk through authentic capture and recall, understand AI/provider boundaries, recover data with off-server key material, observe the system over time, and see all severe defects resolved or explicitly trigger a no-go.

R9 intends to stabilize without adding scope. It integrates all 71 P0 requirements, performs owner UAT and the launch Recovery Ceremony, completes a proposed minimum seven-consecutive-day observation window, validates rollback, and produces an explicit proceed, hold, or rollback decision. Only the owner or separately recorded launch authority may authorize launch.

## Scope and requirement boundary

**Included requirement IDs (71):** LID-SCP-001, LID-SCP-002, LID-SCP-003, LID-SCP-004, LID-TG-001, LID-TG-002, LID-TG-003, LID-TG-004, LID-TG-005, LID-TG-006, LID-TG-007, LID-TG-008, LID-TG-009, LID-TG-010, LID-VN-001, LID-VN-002, LID-VN-003, LID-VN-004, LID-VN-005, LID-VN-006, LID-VN-007, LID-UP-001, LID-UP-002, LID-UP-003, LID-SRC-001, LID-SRC-002, LID-SRC-003, LID-SRC-004, LID-REF-001, LID-REF-002, LID-REF-003, LID-REF-004, LID-REF-005, LID-REF-006, LID-REF-007, LID-AIT-001, LID-AIT-002, LID-AIT-003, LID-AIT-004, LID-AIT-005, LID-AIT-006, LID-AIT-007, LID-AIA-001, LID-AIA-002, LID-AIA-003, LID-AIA-004, LID-AIA-005, LID-AIA-006, LID-AIA-007, LID-AIA-008, LID-AIA-009, LID-AIA-010, LID-AIA-011, LID-OPS-001, LID-OPS-002, LID-OPS-003, LID-OPS-004, LID-OPS-005, LID-OPS-006, LID-OPS-007, LID-OPS-008, LID-OPS-009, LID-OPS-010, LID-OPS-011, LID-OPS-012, LID-OPS-013, LID-OPS-014, LID-OPS-015, LID-OPS-016, LID-OPS-017, LID-OPS-018.

**Excluded requirement IDs (7):** LID-UP-004, LID-DEF-001, LID-DEF-002, LID-DEF-003, LID-DEF-004, LID-DEF-005, LID-DEF-006.

R9 adds no net-new feature behavior. Every included ID is an integrated acceptance or regression gate. For LID-OPS-007, R9 accepts the storage-neutral contract, measured watermark state, conditional R10 plan, and readiness to transition. Actual media cutover is not required while no approved watermark trigger exists. If a trigger exists, R10 becomes a launch dependency and cannot be bypassed for the R9 date.

## Owner scenarios

1. The owner confirms one-user access/denial and completes manual text, authorized photo, prospective voice, explicit date, review, Calendar, Monthly Almanac, Search, and Journal Day journeys.
2. The owner corrects, resolves a source conflict, redates, reviews history, deletes/restores, permanently deletes a synthetic fixture, manages Source and Artwork Suppression, and validates ordinary-day visibility.
3. The owner uses only configurations that passed their frozen evaluations, reviews text/art privacy disclosures, protects/replaces generated fields, handles refusal/failure/budget states, and confirms real-photo cover precedence.
4. The owner creates and independently validates an encrypted export containing current, history, Trash, suppressions, originals, generated artifacts, relationships, and checksums.
5. The owner reviews System Health, alerts, capacity watermarks, provider degradation, restart behavior, browser/accessibility results, and the absence of content in logs/metrics.
6. The owner completes the Recovery Ceremony using two independently held off-server recovery-key copies to restore and decrypt a representative archive sample.
7. The archive completes the proposed minimum seven-day stabilization window without unresolved severity-1 or severity-2 defect, unexplained data-integrity divergence, privacy breach, failed required backup/restore, or uncontrolled capacity condition.
8. The owner reviews rollback evidence and records proceed, hold, or rollback. Proceed is not implied by finishing the checklist.

## Functional acceptance

- Scope and source truth: LID-SCP-001 through LID-SCP-004 pass owner/private boundary, Journal Date, Original Timestamp, source/derived, and source-empty-day scenarios.
- Capture: LID-TG-001 through LID-TG-010, LID-VN-001 through LID-VN-007, and LID-UP-001 through LID-UP-003 pass authorization, validation, durable capture, dating/review, duplicate, original/derivative, prospective/replay/lifecycle/suppression, and file-preservation scenarios.
- Source lifecycle: LID-SRC-001 through LID-SRC-004 pass immutable revision, Correction, three-way conflict choice, atomic redating, and exact source-set binding scenarios.
- Reflection: LID-REF-001 through LID-REF-007 pass Calendar, Monthly Almanac, deterministic Search, Journal Day, visual/theme/motion, browser/accessibility, and management-safety scenarios.
- Generated text: LID-AIT-001 through LID-AIT-007 pass evaluation, configuration, output, scheduling, protection/replacement, typed privacy, failure, source-race, and provenance scenarios.
- Artwork: LID-AIA-001 through LID-AIA-011 pass evaluation, Brief, manual/sweep eligibility, style/label, refusal, versions, cover, suppression, staleness, and typed configuration scenarios.
- Operations: LID-OPS-001 through LID-OPS-018 pass access, callback, secrets, encryption, staging, watermarks, transition-readiness, private delivery, references, Trash, backup/restore, Recovery Ceremony, export, health, alerts, logs, budget, and failure-isolation scenarios.
- LID-OPS-007 boundary: if no approved watermark has triggered, R9 evidence is conditional readiness only and must say transition not executed. If a trigger is active, the R10 entry/exit gates become mandatory before R9 proceed.

## Nonfunctional acceptance

- The end-to-end trustworthy archive acceptance rate is 100%: each accepted capture becomes a durable provenance-bound Source Item or explicit recoverable review/rejection/failure state, with no silent loss, overwrite, misdate, or misrepresentation.
- Original source bytes, timestamps, revisions, Corrections, derived bindings, references, suppressions, lifecycle partitions, and checksums remain reconstructable after export, backup, restore, and rollback.
- No secret, private content, query, caption, prompt, model response, photo data, or identifier appears in prohibited logs, alerts, metrics, caches, screenshots, docs, or evidence.
- All core flows pass the current required browser, phone, keyboard, screen-reader, focus, contrast, zoom, theme, and reduced-motion matrix.
- A full recovery drill is measured against four hours; backup upload alone is not recovery evidence.
- The observation window has durable health evidence and no hidden data-fix, manual patch, or provider fallback that would invalidate repeatability.

## Design contract

R9 design is a complete-state audit, not a redesign phase. It must reconcile the [UX specification](../../design/UX-SPECIFICATION.md) against every primary, empty, loading, error, denial, review, stale, history, Trash, suppression, export, health, budget, provider, recovery, and rollback state. Any design gap that prevents trustworthy owner UAT is release-blocking.

[Prototype v5](../../../prototypes/calendar-ui/index-v5.html) remains only one historical interaction reference. Its in-memory behavior, missing states, and sample content cannot count toward R9 acceptance.

## Architecture and dependency gates

- R8 has an evidence-backed proceed decision and R0–R8 each has independently usable rollback plus backup/restore evidence for every introduced data shape.
- All material external integration and model evaluation gates have passing evidence for each enabled configuration; unavailable or failed candidates are not exposed.
- The data/recovery inventory enumerates every source, media, revision, Correction, derived artifact, job, attempt, protection, budget, lifecycle, suppression, export, health, and capacity shape.
- Recovery Ceremony procedure and two off-server key-copy locations are privately ready; no secret value is placed in repository evidence.
- Launch authority is explicit and separate from document completion.
- Current measured capacity is below all hard safety conditions or an active trigger is handled through R10 before proceed.

## Outcome metrics

| Metric | R9 target | Evidence placeholder |
| --- | --- | --- |
| P0 scenario coverage | 71 of 71 included IDs have executed acceptance or explicit no-go evidence | Not yet provided |
| Owner journey | 100% of the agreed owner UAT scenarios complete with expected outcome | Not yet provided |
| Source fidelity | Zero unexplained byte, checksum, timestamp, revision, date, reference, or binding divergence | Not yet provided |
| Privacy/security | Zero unresolved critical/high finding and zero forbidden data in reviewed boundaries | Not yet provided |
| Recovery | Recovery Ceremony succeeds; full drill measured against four hours | Not yet provided |
| Stabilization | Proposed minimum seven consecutive days with zero unresolved severity-1/2 defect or integrity/privacy incident | Not yet provided |
| Accessibility/browser | No unresolved release-blocking issue in the complete required matrix | Not yet provided |
| Budget/capacity | No unbounded AI spend and no uncontrolled active storage watermark | Not yet provided |
| Decision | One explicit proceed, hold, or rollback record from authorized owner | Not yet provided |

## Privacy and security

- R9 evidence is public-safe by default: synthetic IDs, sanitized counts, redacted screenshots, and no hostnames, addresses, account details, credentials, recovery material, or authentic content.
- Authentic owner UAT is private and minimized. The public evidence records scenario result and non-secret checksum/count metadata, not content.
- The Recovery Ceremony records key locations only by non-secret description and never records key values.
- Real photos and every photo-related field remain categorically outside AI requests.
- Provider, access, storage, backup, and object-store claims are limited to exact executed evidence.

## Accessibility

R9 requires the integrated browser/accessibility matrix for all core flows. Keyboard, touch, focus, screen-reader names/states, semantic structure, contrast, 200% zoom, responsive layouts, reduced motion, and text alternatives are release gates. Generated versus authentic content, current versus history, live versus Trash, warning versus blocked, and real photo versus AI artwork must be distinguishable without color, image recognition, or motion.

## Recovery and rollback

R9 introduces only stabilization defects/fixes and acceptance evidence, not a planned new domain shape. Any approved fix that changes data nevertheless requires an updated inventory, encrypted backup, executed restore, migration evidence, and independently executable rollback before acceptance.

The Recovery Ceremony must use the independent off-server recovery material to restore and decrypt a representative archive sample. The rollback drill must return the complete integrated product to a recorded prior state without losing accepted memories, lifecycle intent, provider provenance, budget state, or hard capacity safety.

## Release entry criteria

- R8 exit criteria and proceed record exist.
- R0–R8 requirement, privacy/security, browser/accessibility, backup/restore, and rollback evidence is reviewable.
- No unresolved severity-1 or severity-2 defect is carried into owner UAT.
- Owner UAT fixtures and any authentic sample are explicitly authorized and privacy-minimized.
- Recovery Ceremony material and disposable restore environment are ready privately.
- Launch authority and the observation-window rule are recorded.

## Release exit criteria

- All 71 included IDs have executed integrated evidence or an explicit no-go; all seven excluded IDs remain absent.
- Owner UAT covers capture, review, recall, search, correction, redating, lifecycle, export, AI labeling/privacy/budget, health, failure, backup, restore, and rollback.
- Recovery Ceremony and full recovery comparison succeed with measured elapsed time.
- Proposed minimum seven-day observation completes without unresolved severity-1/2 defect, integrity/privacy incident, required backup/restore failure, or uncontrolled capacity state.
- There is a signed/recorded proceed, hold, or rollback decision from authorized launch owner. A proceed record is required to claim acceptance.

## No-go criteria

- Any included requirement lacks evidence and is not explicitly recorded as a no-go.
- Any unresolved severity-1/2 defect, critical/high privacy/security finding, source-integrity divergence, access bypass, AI photo-data leak, uncontrolled spend, or failed required restore exists.
- Recovery Ceremony is incomplete, key independence is unproven, or the archive cannot be decrypted from backup within the measured target.
- A blocking browser/accessibility issue remains.
- An active storage trigger requires R10 and is ignored.
- Launch authority is absent or the owner selects hold/rollback.

## Explicit non-goals

- Any of the seven excluded IDs: blank browser composition/PDF/Word/OCR, historical import, prompts/reminders/reflection extras, semantic/advanced search, additional views, format extensions, or tag expansion.
- Net-new scope, growth metrics, multiple users, sharing, social behavior, public links, native apps, or offline-first behavior.
- A high-availability or service-level promise.
- Object-store transition without its approved trigger and R10 gates.
- Claiming launch, production, deployment, or acceptance merely because planning, testing, or the observation window was attempted.

## Evidence register

| Evidence | Expected artifact | Status |
| --- | --- | --- |
| Requirement traceability | 71-ID integrated acceptance ledger and seven-ID exclusion check | Not yet provided |
| Owner UAT | Private scenario results with public-safe summary | Not yet provided |
| Design review | Complete-state UX conformance and resolved gap record | Not yet provided |
| Architecture review | Final data, integration, provider, job, capacity, recovery, and rollback conformance | Not yet provided |
| Functional/regression report | Complete journey, boundary, failure, and cross-release results | Not yet provided |
| Privacy/security report | Final threat, secret, request, cache, log, alert, evidence, and access review | Not yet provided |
| Accessibility/browser report | Complete required matrix | Not yet provided |
| Backup/restore report | Full inventory, repository check, selected comparisons, full drill, and elapsed time | Not yet provided |
| Recovery Ceremony | Private record with non-secret public-safe attestation | Not yet provided |
| Stabilization record | Proposed seven-day health/defect/integrity summary | Not yet provided |
| Rollback report | Integrated rollback result | Not yet provided |
| Launch decision | Authorized proceed, hold, or rollback record | Not yet provided |

## Evidence boundary

R9 is not self-approving. Until the owner decision and all named evidence exist, the only accurate status is planned private launch acceptance and stabilization.
