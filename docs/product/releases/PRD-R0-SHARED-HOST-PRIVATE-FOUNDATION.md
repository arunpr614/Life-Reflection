# PRD R0 — Shared-Host Private Foundation

## Document control

| Field | Value |
| --- | --- |
| Release | R0 — Shared-Host Private Foundation |
| Document type | Product requirements document |
| Status | Council-reviewed planning baseline; not an implementation, deployment, or release-acceptance record |
| Accountable role | Product owner |
| Proposed start | 2026-08-17 |
| Proposed target | 2026-08-28 |
| Date confidence | Planning estimate only. Evidence gates, not dates, control entry and exit. |
| Evidence boundary | This document defines intended behavior. It does not establish implementation, testing, deployment, production use, or acceptance. |

## Related artifacts

- [Governing product requirements](../PRODUCT-REQUIREMENTS.md)
- [Product Manager review](../../council/PRODUCT-MANAGER-REVIEW.md)
- [Phase 1 release plan](../../project/PHASE1-RELEASE-PLAN.md)
- [Phase 1 implementation plan](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [Shared-host deployment spike](../../research/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md)
- [UX specification](../../design/UX-SPECIFICATION.md)
- [Prototype v5 feature audit](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md)
- [Prototype v5](../../../prototypes/calendar-ui/index-v5.html)

The deployment spike and prototype are planning evidence only. Neither proves a live environment, a secure configuration, or a working product.

## Problem and intended outcome

Life in Days needs a private, recoverable operating foundation before authentic memories are permitted. The first risk is not feature desirability; it is whether a one-user archive can coexist with other services, enforce one human boundary, protect synthetic data, expose honest health, and return to its prior state after an unsuccessful change.

R0 intends to make a synthetic-only private shell usable by the owner for access, denial, health, recovery, restart, upgrade, and rollback walkthroughs. It must contain no authentic memory and no route that can create one. R1, not R0, is the first memory-creating release.

## Scope and requirement boundary

**Included requirement IDs (11):** LID-SCP-001, LID-OPS-001, LID-OPS-002, LID-OPS-003, LID-OPS-004, LID-OPS-008, LID-OPS-011, LID-OPS-012, LID-OPS-014, LID-OPS-016, LID-OPS-018.

**Excluded requirement IDs (67):** LID-SCP-002, LID-SCP-003, LID-SCP-004, LID-TG-001, LID-TG-002, LID-TG-003, LID-TG-004, LID-TG-005, LID-TG-006, LID-TG-007, LID-TG-008, LID-TG-009, LID-TG-010, LID-VN-001, LID-VN-002, LID-VN-003, LID-VN-004, LID-VN-005, LID-VN-006, LID-VN-007, LID-UP-001, LID-UP-002, LID-UP-003, LID-UP-004, LID-SRC-001, LID-SRC-002, LID-SRC-003, LID-SRC-004, LID-REF-001, LID-REF-002, LID-REF-003, LID-REF-004, LID-REF-005, LID-REF-006, LID-REF-007, LID-AIT-001, LID-AIT-002, LID-AIT-003, LID-AIT-004, LID-AIT-005, LID-AIT-006, LID-AIT-007, LID-AIA-001, LID-AIA-002, LID-AIA-003, LID-AIA-004, LID-AIA-005, LID-AIA-006, LID-AIA-007, LID-AIA-008, LID-AIA-009, LID-AIA-010, LID-AIA-011, LID-OPS-005, LID-OPS-006, LID-OPS-007, LID-OPS-009, LID-OPS-010, LID-OPS-013, LID-OPS-015, LID-OPS-017, LID-DEF-001, LID-DEF-002, LID-DEF-003, LID-DEF-004, LID-DEF-005, LID-DEF-006.

Excluded means not owned by R0. It does not change the governing backlog or authorize implementation of a later requirement.

## Owner scenarios

1. The owner reaches the private shell through the approved human access boundary, while an unauthenticated, expired, or non-owner request sees no HTML, API, media, search, or export content.
2. A callback request reaches only an opaque machine path; unknown hosts, paths, methods, or oversized requests fail without entering a human route.
3. The owner views System Health and can distinguish durable `unknown`, `never run`, `success`, `delayed`, `failed`, and `blocked` synthetic states; `success` is labeled `Healthy` in the UI.
4. An operator creates an encrypted synthetic backup, restores it into a disposable environment, and records elapsed recovery time without exposing recovery material.
5. A synthetic upgrade is rolled back and the shell returns to the pre-change state without material regression to co-resident services.

## Functional acceptance

- LID-SCP-001 and LID-OPS-001: exactly one allowlisted human identity is admitted; missing, invalid, non-owner, and expired access assertions are rejected at the application boundary; no sharing or public route exists.
- LID-OPS-002: the callback surface is separate from human routes, accepts only approved methods and bounded payloads, and cannot retrieve human-session or media responses.
- LID-OPS-003: fixtures, repository history, client assets, exports, and sanitized logs contain no credentials, access assertions, recovery material, or account identifiers; secrets can rotate without rewriting archive history.
- LID-OPS-004: representative synthetic database and object bytes are authenticated ciphertext at rest, carry encryption-version metadata, and decrypt only with separately supplied recovery material.
- LID-OPS-008: personal-shaped synthetic responses use authenticated same-origin delivery and private, no-store cache behavior; no storage URL or decryption key reaches the browser.
- LID-OPS-011: an application-consistent encrypted synthetic snapshot, repository check, sampled restore, and integrity comparison are recorded; upload completion alone does not count as restore evidence.
- LID-OPS-012: a rehearsal records two independent off-server recovery-key locations by non-secret description and uses recovery material to decrypt the synthetic sample.
- LID-OPS-014: System Health reads durable evidence and never reports a job as successful merely because it started.
- LID-OPS-016: local structured logs contain only allowlisted timestamps, opaque identifiers, and error classes and expire on the documented retention path.
- LID-OPS-018: restart resumes idempotent synthetic jobs; a failed dependency remains visible without making the healthy shell unavailable; no high-availability or service-level promise appears.

## Nonfunctional acceptance

- The shared-host capacity, process namespace, route namespace, port allocation, resource limits, restart policy, and coexistence checks have sanitized recorded evidence.
- Human and machine boundaries fail closed. Personal-shaped responses are non-cacheable by shared intermediaries.
- The recovery rehearsal is measured against the four-hour recovery target; the actual result is recorded rather than assumed.
- Logs, diagnostic bundles, screenshots, and evidence artifacts contain no secret or authentic private content.
- The shell exposes semantic headings, labeled controls, visible focus, keyboard access, responsive layout, readable zoom behavior, and reduced-motion behavior for its available states.
- The release can be removed or reverted without changing co-resident route and process behavior.

## Design contract

R0 design must cover first access, access denial, session expiry, empty synthetic home, System Health state taxonomy, recovery-in-progress, recovery failure, dependency failure, restart, maintenance, and rollback messaging. It must not imitate a populated personal archive or imply that the prototype is connected to real data.

The [UX specification](../../design/UX-SPECIFICATION.md) governs tone, visual hierarchy, themes, focus, motion, and responsive behavior. [Prototype v5](../../../prototypes/calendar-ui/index-v5.html) is interaction direction only; its in-memory sample content is not an R0 implementation reference.

## Architecture and dependency gates

- P0 planning baseline is published and unresolved council decisions that affect access, encryption, recovery, routing, or rollback are either closed or explicitly block entry.
- The shared-host spike records sanitized capacity assumptions, route/process isolation, coexistence tests, restart behavior, backup/restore mechanics, and a reversible removal path.
- Architecture decisions define human access assertion validation, callback isolation, runtime secret injection, authenticated encryption, private delivery/cache rules, structured-log allowlists, health evidence, and recovery.
- No authentic memory fixture, production credential, real callback, or public route is needed or permitted to prove R0.
- R0 exit is a dependency for every later release. Its backup, restore, health, privacy, and rollback contracts remain regression gates thereafter.

## Outcome metrics

| Metric | R0 target | Evidence placeholder |
| --- | --- | --- |
| Owner access and denial scenarios | 100% of approved synthetic fixtures produce the expected allow or deny result | Not yet provided |
| Secret/content leakage | Zero forbidden values in repository, client bundle, export, logs, and evidence scans | Not yet provided |
| Synthetic backup integrity | 100% of selected records and objects match after restore | Not yet provided |
| Recovery timing | Measured and compared with the four-hour target | Not yet provided |
| Coexistence regression | Zero material regression in the agreed co-resident checks | Not yet provided |
| Rollback | One recorded return to the exact pre-change synthetic state | Not yet provided |
| Accessibility | No blocking issue in keyboard, focus, labels, contrast, zoom, or reduced-motion checks for R0 surfaces | Not yet provided |

## Privacy and security

- Only synthetic, non-personal fixtures may be used.
- The product remains one-user and private, with no sharing, invitation, public link, or anonymous route.
- Runtime secrets and recovery values must never enter source, issue text, documentation, screenshots, logs, exports, or browser code.
- Encryption-at-rest claims must state their limit: a compromised running application can access data. R0 must not claim end-to-end or zero-knowledge encryption.
- The callback boundary is machine-only; the human access boundary does not substitute for callback authorization.

## Accessibility

All R0 surfaces must be keyboard operable, focus visible, screen-reader named, usable at browser zoom, and understandable without motion. Light and dark presentations must meet WCAG 2.2 AA contrast targets. Denial, unknown, blocked, failure, and recovery states must be conveyed in text, not color alone.

## Recovery and rollback

R0 introduces the foundation data shape: encrypted synthetic database/object content, operational evidence, configuration metadata without secrets, and backup manifests. Exit requires an encrypted backup and executed restore of that shape. Recovery evidence records the sample, checksums, elapsed time, and result without recording keys.

Rollback must remove or revert the R0 application, routes, processes, schedules, schema, and synthetic data while preserving the prior state of co-resident services. The pre-change snapshot, rollback command plan, post-rollback checks, and decision owner are evidence, not assumptions.

## Release entry criteria

- P0 planning artifacts and requirement traceability are available.
- The synthetic-only boundary and prohibited authentic-data paths are reviewable.
- Required architecture decisions and the shared-host spike have no unresolved critical blocker.
- A disposable restore target and rollback rehearsal path are defined.
- Test fixtures contain no real memory, credential, or private account data.

## Release exit criteria

- Every included requirement has requirement-level acceptance evidence or an explicit no-go.
- Owner access/denial, callback isolation, secret scanning, ciphertext inspection, cache behavior, health state, backup, restore, restart, coexistence, and rollback scenarios have executed evidence.
- The encrypted synthetic restore result is recorded and readable without exposing key material.
- No unresolved severity-1 or severity-2 defect remains in an R0 boundary.
- The release decision record says proceed, hold, or roll back and names the evidence reviewed.

## No-go criteria

- Any authentic memory or real-photo data is needed, captured, logged, or displayed.
- Any human route bypasses the access boundary, or any callback can reach a human/media route.
- Plaintext content, a credential, or recovery material appears in persistent storage, client code, logs, exports, or evidence.
- Restore or rollback is unexecuted, fails integrity checks, or cannot return co-resident services to their prior state.
- Health status is optimistic, capacity is unknown, or the shared-host spike has an unresolved critical coexistence finding.

## Explicit non-goals

- Authentic journal or photo ingestion.
- Telegram or VoiceNotes integration.
- Calendar, Monthly Almanac, Search, Journal Day management, Corrections, Trash, or export.
- AI text or artwork.
- Public access, sharing, multi-user records, native apps, offline-first behavior, or a high-availability promise.
- A live object-store transition.

## Evidence register

| Evidence | Expected artifact | Status |
| --- | --- | --- |
| Requirement traceability | R0 requirement checklist with scenario IDs | Not yet provided |
| Design review | R0 access, health, failure, recovery, and rollback state review | Not yet provided |
| Architecture decision | Access, callback, secrets, encryption, delivery, logging, health, recovery, and rollback records | Not yet provided |
| Functional test report | Sanitized owner/callback/system scenario results | Not yet provided |
| Privacy/security report | Threat review, secret scan, ciphertext and cache checks | Not yet provided |
| Accessibility report | Keyboard, labels, focus, contrast, zoom, responsive, and motion checks | Not yet provided |
| Backup/restore report | Synthetic snapshot, repository check, restore, checksums, and elapsed time | Not yet provided |
| Rollback report | Pre-state, actions, post-state, and coexistence comparison | Not yet provided |
| Owner acceptance | Proceed, hold, or rollback record | Not yet provided |

## Evidence boundary

Requirements, designs, prototypes, spikes, plans, and blank evidence rows are intent. Only dated executed evidence can support a later claim about implementation, testing, deployment, recovery, or release acceptance.
