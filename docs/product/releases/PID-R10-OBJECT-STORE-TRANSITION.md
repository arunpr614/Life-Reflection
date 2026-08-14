# PID R10 — Conditional Object-Store Transition

## Document control

| Field | Value |
| --- | --- |
| Release | R10 — Conditional Object-Store Transition |
| Document type | Product implementation decision |
| Status | Conditional planning draft; not approved, scheduled, started, tested, deployed, cut over, or accepted |
| Accountable role | Product owner |
| Proposed start | Blank — trigger only |
| Proposed target | Blank — trigger only |
| Trigger | An approved measured storage watermark from LID-OPS-006 |
| Date confidence | No calendar estimate applies before the trigger. After authorization, dates must be estimated from current inventory and rehearsal evidence. |
| Evidence boundary | This PID defines a reversible transition decision. It does not establish that a trigger exists, a target is provisioned, media moved, reads observed, local copies retired, or recovery proven. |

## Related artifacts

- [Governing product requirements](../PRODUCT-REQUIREMENTS.md)
- [Product Manager review](../../council/PRODUCT-MANAGER-REVIEW.md)
- [Phase 1 release plan](../../project/PHASE1-RELEASE-PLAN.md)
- [Phase 1 implementation plan](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [UX specification](../../design/UX-SPECIFICATION.md)
- [Shared-host deployment spike](../../research/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md)

No live hostname, network address, account identifier, credential, bucket name, object key, or private inventory belongs in this public-safe PID.

## Problem and intended outcome

The initial private archive uses encrypted root-resident media to avoid premature infrastructure cost and complexity. As the archive grows, local capacity can become a source-integrity risk. Moving too early adds an unnecessary dependency; moving too late risks a full disk. The decision must therefore be triggered by measured approved watermarks and executed as a reversible, inventory-complete, independently recoverable transition.

R10 intends to move authoritative encrypted media to the approved private object-store target only when evidence requires it. The sequence is inventory, provision, dual-write, copy, complete reconciliation, remote-to-backup restore proof, reversible pointer migration, observed target reads, cutover, and only then retirement of local authoritative copies. The private same-origin read boundary does not change.

## Scope and requirement boundary

**Included requirement IDs (6):** LID-OPS-006, LID-OPS-007, LID-OPS-008, LID-OPS-011, LID-OPS-014, LID-OPS-018.

**Excluded requirement IDs (72):** LID-SCP-001, LID-SCP-002, LID-SCP-003, LID-SCP-004, LID-TG-001, LID-TG-002, LID-TG-003, LID-TG-004, LID-TG-005, LID-TG-006, LID-TG-007, LID-TG-008, LID-TG-009, LID-TG-010, LID-VN-001, LID-VN-002, LID-VN-003, LID-VN-004, LID-VN-005, LID-VN-006, LID-VN-007, LID-UP-001, LID-UP-002, LID-UP-003, LID-UP-004, LID-SRC-001, LID-SRC-002, LID-SRC-003, LID-SRC-004, LID-REF-001, LID-REF-002, LID-REF-003, LID-REF-004, LID-REF-005, LID-REF-006, LID-REF-007, LID-AIT-001, LID-AIT-002, LID-AIT-003, LID-AIT-004, LID-AIT-005, LID-AIT-006, LID-AIT-007, LID-AIA-001, LID-AIA-002, LID-AIA-003, LID-AIA-004, LID-AIA-005, LID-AIA-006, LID-AIA-007, LID-AIA-008, LID-AIA-009, LID-AIA-010, LID-AIA-011, LID-OPS-001, LID-OPS-002, LID-OPS-003, LID-OPS-004, LID-OPS-005, LID-OPS-009, LID-OPS-010, LID-OPS-012, LID-OPS-013, LID-OPS-015, LID-OPS-016, LID-OPS-017, LID-DEF-001, LID-DEF-002, LID-DEF-003, LID-DEF-004, LID-DEF-005, LID-DEF-006.

Excluded means not newly owned by R10. All accepted R0–R9 behavior remains a regression gate. R10 changes storage location and recovery paths only; it does not change source truth, product scope, privacy, cover, lifecycle, export, or AI behavior.

## Trigger and decision stages

The exact governing watermark policy remains:

1. Warn and permit transition start at 7 GB authoritative media or 18 GB host-free space.
2. Provision, copy, and dual-write no later than 8 GB media or 15 GB host-free space.
3. Direct new writes to the target and finish proof no later than 9 GB media or 13 GB host-free space.
4. Reject new media while migration is incomplete at 10 GB media or 12 GB host-free space; never delete or downsample Originals to recover space.

Actual filesystem bytes, not database estimates, decide the state. A measured threshold is necessary but does not itself authorize destructive cutover or local eviction. Each stage needs its own recorded entry decision.

## Owner scenarios

1. The owner sees the measured watermark, current capacity, trigger reason, safe actions, and media-admission effect in private System Health.
2. New media writes to both old and target stores during the controlled dual-write stage, and a failure leaves a visible retry/reconciliation state without false acknowledgement.
3. A complete paginated inventory and copy ledger account for every current, historical, and Trash-referenced media object without relying on a partial listing.
4. The owner accesses thumbnails and Originals through the same authenticated application routes; no target URL, object key, or credential reaches the browser.
5. The recovery process snapshots from the remote authoritative target into the independent encrypted backup and restores selected objects without depending on the live target.
6. Pointer migration is reversible; reads are observed from the target for seven consecutive days with zero unexplained fallback or mismatch.
7. A fault at inventory, copy, dual-write, backup, restore, read, or pointer stage rolls back to the last safe authoritative state without losing an acknowledged object.

## Functional acceptance

- LID-OPS-006: the measured trigger and each subsequent threshold/action are durable, visible, and based on actual bytes; the hard media stop preserves healthy text, reads, backup, export, and deletion recovery.
- LID-OPS-007: media metadata/API is storage-neutral; the approved private target stores application-layer ciphertext under random opaque keys with no dates, names, text, messaging IDs, filenames, or plaintext checksums in provider-visible names/metadata.
- LID-OPS-007: inventory traversal is complete and paginated; interrupted/partial listing cannot be marked complete; count, size, identity, and encrypted-object hash reconciliation match the authoritative ledger.
- LID-OPS-007: dual-write/copy is idempotent, records per-object outcome, and never acknowledges a new capture unless its current authoritative-write policy is satisfied.
- LID-OPS-007: remote-authoritative content can enter the independent encrypted backup and be restored without relying on the live target; every object has both verified live and recovery copies before local authority can retire.
- LID-OPS-007: pointer migration is reversible; seven consecutive days of observed target reads show expected counts/checksums and zero unexplained local fallback before local authoritative copies are eligible for retirement.
- LID-OPS-008: all reads remain authenticated same-origin private/no-store application responses; public target access is disabled; no provider URL, signed URL, object key, credential, or decryption key reaches browser/logs.
- LID-OPS-011: backup inventory, remote-source snapshot, restore, manifest, encryption version, and recovery procedure include the transitioned shape; target storage and backup remain independent.
- LID-OPS-014: System Health shows current bytes/free space, migration stage, inventory/copy/dual-write/reconciliation/read-observation progress, backup/restore state, and blocked/failure reason from durable evidence.
- LID-OPS-018: target, copy, backup, inventory, or migration failure does not corrupt authentic source relationships or block healthy non-media archive behavior; fallback is explicit and never cross-provider AI behavior.

## Nonfunctional acceptance

- Every migration action is idempotent, restart-safe, paginated, rate bounded, resumable, and auditable through opaque identifiers only.
- Completeness requires reconciled inventory count, total bytes, per-object identity/hash, reference coverage, and no unresolved ledger item; a list request completing is insufficient.
- At least one interruption and one target-unavailable rehearsal prove rollback before authoritative pointer cutover.
- Target and backup credentials are separate least-privilege runtime secrets; neither target nor backup is a substitute for the other.
- No plaintext Original persists in ordinary staging, migration scratch space, target storage, swap, logs, or evidence.
- Read performance is measured before and during observation, but no ungrounded availability or latency promise is introduced by this PID.

## Design contract

R10 has no new browsing interaction. Design covers private System Health and media-capture states for warning, transition authorized, inventory, copying, dual-write, reconciling, target-write, observing, blocked, rollback, hard media stop, completed transition, and post-transition capacity. Messages explain whether text/read/export/delete recovery remains available and never reveal storage identifiers.

The [UX specification](../../design/UX-SPECIFICATION.md) governs status, error, accessibility, and private wording. Prototype v5 has no transition evidence or complete operational design.

## Architecture and dependency gates

- R9 has an evidence-backed proceed decision, unless an earlier active hard watermark makes R10 a prerequisite to R9 proceed.
- An approved measured LID-OPS-006 threshold is recorded; no convenience date or speculative forecast opens R10.
- Current inventory, growth, host-free space, target capability, cost, region, privacy, lifecycle, consistency, pagination, API limits, and credential boundaries are freshly validated.
- Migration and recovery decisions define ledger, object identity/hash, copy, dual-write, write authority, pointer versioning, fallback, remote-to-backup snapshot, restore, observation, retirement, and rollback.
- A synthetic or cloned rehearsal passes before any authentic authoritative pointer changes.
- The owner separately authorizes each irreversible stage. Local eviction is the final stage and is never implied by successful copy.

## Outcome metrics

| Metric | R10 target | Evidence placeholder |
| --- | --- | --- |
| Trigger validity | One approved measured watermark and authority record; no calendar-only start | Not yet provided |
| Inventory completeness | 100% reconciled count, bytes, identities/hashes, and live/Trash references | Not yet provided |
| Dual-write integrity | Zero acknowledged object missing from the current authoritative policy | Not yet provided |
| Copy integrity | 100% of ledger objects verified at target; zero unresolved mismatch | Not yet provided |
| Recovery independence | Selected remote objects restore from independent encrypted backup with matching checksum | Not yet provided |
| Read observation | Seven consecutive days with expected reads and zero unexplained fallback/mismatch | Not yet provided |
| Privacy | Zero public target route, provider URL/key/credential exposure, plaintext object, or content-bearing log | Not yet provided |
| Rollback | Every pre-retirement stage returns to the recorded safe authority without object loss | Not yet provided |

## Privacy and security

- Object keys and provider-visible metadata are random and opaque; they contain no date, name, journal text, filename, messaging identifier, or plaintext checksum.
- Application-controlled authenticated ciphertext remains the only media representation at rest in the target.
- Target, backup, and application credentials are separate least-privilege runtime secrets and never enter repository, client, docs, logs, screenshots, or evidence.
- The browser receives only authenticated same-origin private/no-store responses and no target or signed URL.
- Public evidence uses synthetic identifiers and sanitized aggregate counts; detailed inventories and infrastructure coordinates remain private.

## Accessibility

Transition and media-stop states must be keyboard reachable, screen-reader announced, focus visible, responsive, zoom-safe, and understandable without color or motion. Health progress includes textual stage, counts, freshness, failure, and safe action. A media rejection explains that existing memories and non-media functions remain available when true, without exposing infrastructure detail.

## Recovery and rollback

Recovery is a first-class transition gate. Before pointer cutover, the approved remote authoritative source must produce an independent encrypted backup and an executed restore with matching checksums. The target must never be the only copy. Backup retention remains independent from live-object lifecycle.

Rollback is permitted at inventory, copy, dual-write, pointer, and observation stages. The ledger records authority per object and supports reversal without guessing. Local authoritative copies cannot be retired until inventory, target verification, backup/restore, pointer reversibility, and seven-day observed reads all pass. After retirement, a separate documented disaster-recovery path remains required.

## Release entry criteria

- An approved measured watermark from LID-OPS-006 exists.
- Current sanitized measurements, inventory estimate, growth, target capability, pricing, privacy, lifecycle, and limits are reviewed.
- The migration/recovery architecture and stage-specific owner authorities are recorded.
- Rehearsal fixtures cover partial pagination, interruption, duplicate copy, dual-write split result, target outage, checksum mismatch, backup/restore, pointer reversal, and hard media stop.
- A complete pre-change encrypted backup and rollback checkpoint exist.

## Release exit criteria

- Every included requirement has executed requirement-level evidence or an explicit no-go.
- Complete inventory, copy, dual-write, reconciliation, target-write, independent backup/restore, reversible pointer migration, authenticated reads, health, privacy, and rollback gates pass.
- Seven consecutive days of target-read observation have zero unexplained mismatch or fallback.
- Every retained live object has verified target and recovery copies before local authoritative retirement.
- The owner records proceed, hold, rollback, or remain-dual-write; only proceed authorizes the next irreversible stage.

## No-go criteria

- No approved measured trigger exists.
- Inventory pagination, counts, bytes, identities/hashes, or reference coverage is incomplete or ambiguous.
- Any acknowledged object lacks a verified authoritative copy or independent recovery copy.
- Target storage exposes plaintext, public access, identifying object metadata, credentials, URLs, or keys.
- Remote-to-backup restore, pointer rollback, or target-unavailable rehearsal is unexecuted or fails.
- The seven-day observation has a mismatch, unexplained fallback, or unresolved severity-1/2 defect.
- Local authoritative deletion is proposed before every exit gate and explicit owner authority.

## Explicit non-goals

- Starting because of a roadmap date, preference, or unapproved forecast.
- Changing product behavior, source identity, Journal Date, Calendar Cover, Trash, suppression, export, AI, or access semantics.
- Deleting, recompressing, downsampling, or modifying Originals to reclaim space.
- Treating the object store as backup, or backup as the live object store.
- Public bucket access, direct browser storage URLs, public delivery, or provider-specific product coupling.
- High availability, multi-region replication, a service-level agreement, or automatic local eviction.

## Evidence register

| Evidence | Expected artifact | Status |
| --- | --- | --- |
| Trigger decision | Sanitized measured threshold and owner authority | Not yet provided |
| Requirement traceability | R10 requirement-to-stage/scenario checklist | Not yet provided |
| Design review | Health, warning, transition, hard-stop, failure, rollback, and accessibility review | Not yet provided |
| Architecture decision | Inventory, keying, copy, dual-write, authority, pointer, delivery, backup, restore, retirement, and rollback records | Not yet provided |
| Rehearsal report | Synthetic/cloned partial-list, interruption, mismatch, outage, restore, and reversal results | Not yet provided |
| Migration report | Private ledger plus public-safe counts/bytes/checksum summary | Not yet provided |
| Privacy/security report | Target access, ciphertext, metadata, credential, delivery, log, and evidence review | Not yet provided |
| Backup/restore report | Remote-source snapshot and selected/full restore comparisons | Not yet provided |
| Observation record | Seven-day target-read, fallback, mismatch, health, and incident summary | Not yet provided |
| Rollback report | Stage-by-stage authority reversal results | Not yet provided |
| Owner decision | Proceed, hold, rollback, or remain-dual-write record | Not yet provided |

## Evidence boundary

R10 is date-free and trigger-only. Until a measured trigger, explicit authority, and every stage’s executed evidence exist, no transition, cutover, retirement, recovery, or production claim is valid.
