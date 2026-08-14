# PRD R7 — Generated Artwork

## Document control

| Field | Value |
| --- | --- |
| Release | R7 — Generated Artwork |
| Document type | Product requirements document |
| Status | Planning draft; not an approval or release record |
| Accountable role | Product owner |
| Proposed start | 2027-01-11 |
| Proposed target | 2027-01-29 |
| Date confidence | Planning estimate only. Evidence gates, not dates, control entry and exit. |
| Evidence boundary | This document defines intended behavior. Candidate models are not approved product options until the frozen evaluation and privacy/lifecycle gates pass. No implementation, testing, deployment, production use, or acceptance is established. |

## Related artifacts

- [Governing product requirements](../PRODUCT-REQUIREMENTS.md)
- [Product Manager review](../../council/PRODUCT-MANAGER-REVIEW.md)
- [Phase 1 release plan](../../project/PHASE1-RELEASE-PLAN.md)
- [Phase 1 implementation plan](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [UX specification](../../design/UX-SPECIFICATION.md)
- [Prototype v5 feature audit](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md)
- [Prototype v5](../../../prototypes/calendar-ui/index-v5.html)

Prototype artwork states are simulated interaction direction. They do not prove model quality, safety, privacy, storage, provenance, cost, cover invariants, or recovery.

## Problem and intended outcome

Symbolic artwork may make text-only days more evocative, but it creates material trust risks: a generated image can be mistaken for a real photo, expose more text than needed, consume uncontrolled spend, recur after deletion, or lose provenance after provider URLs expire.

R7 intends to add optional evaluated, labeled, versioned symbolic artwork based only on a read-only Visual Brief. Manual requests show source sufficiency, provider/model, and budget effect before spend. A restart-safe 01:00 sweep fills only strictly eligible photo-less days. Real photos always retain Calendar Cover precedence, safety refusals remain neutral, and versions/suppression/staleness survive export, backup, restore, and rollback.

## Scope and requirement boundary

**Included requirement IDs (15):** LID-AIA-001, LID-AIA-002, LID-AIA-003, LID-AIA-004, LID-AIA-005, LID-AIA-006, LID-AIA-007, LID-AIA-008, LID-AIA-009, LID-AIA-010, LID-AIA-011, LID-REF-006, LID-OPS-011, LID-OPS-017, LID-OPS-018.

**Excluded requirement IDs (63):** LID-SCP-001, LID-SCP-002, LID-SCP-003, LID-SCP-004, LID-TG-001, LID-TG-002, LID-TG-003, LID-TG-004, LID-TG-005, LID-TG-006, LID-TG-007, LID-TG-008, LID-TG-009, LID-TG-010, LID-VN-001, LID-VN-002, LID-VN-003, LID-VN-004, LID-VN-005, LID-VN-006, LID-VN-007, LID-UP-001, LID-UP-002, LID-UP-003, LID-UP-004, LID-SRC-001, LID-SRC-002, LID-SRC-003, LID-SRC-004, LID-REF-001, LID-REF-002, LID-REF-003, LID-REF-004, LID-REF-005, LID-REF-007, LID-AIT-001, LID-AIT-002, LID-AIT-003, LID-AIT-004, LID-AIT-005, LID-AIT-006, LID-AIT-007, LID-OPS-001, LID-OPS-002, LID-OPS-003, LID-OPS-004, LID-OPS-005, LID-OPS-006, LID-OPS-007, LID-OPS-008, LID-OPS-009, LID-OPS-010, LID-OPS-012, LID-OPS-013, LID-OPS-014, LID-OPS-015, LID-OPS-016, LID-DEF-001, LID-DEF-002, LID-DEF-003, LID-DEF-004, LID-DEF-005, LID-DEF-006.

Excluded means not newly owned by R7. R0–R6 remain inherited regression gates, including typed text privacy, source/derived truth, real-photo exclusion, cover behavior, Corrections, lifecycle, export, accessibility, backup/restore, budget, and failure isolation.

## Owner scenarios

1. A frozen synthetic blind artwork evaluation runs within the shared one-time ceiling; no personal journal, Visual Brief, photo, caption, identity, or private date is used.
2. The owner reads the versioned Visual Brief, cannot free-form edit it, and may explicitly regenerate the brief through the approved Text Provider.
3. Generate artwork now is disabled below five meaningful words, warns from 5–19, and proceeds without sparse warning at 20 or more, subject to provider, safety, credential, and budget gates.
4. Preflight names the approved provider/model, brief version, source sufficiency, and estimated budget effect before a manual request.
5. At 01:00 Asia/Kolkata, the restart-safe sweep considers missed post-activation days but generates only for a day with at least 20 meaningful words, no live photo, no art, no suppression, eligible approved configuration, and available budget.
6. A successful symbolic image is downloaded immediately, checksummed, labeled AI artwork, versioned, and selectable; a failed attempt is not a version.
7. A real photo arriving, being redated, entering Trash, or being restored always enforces real-photo Calendar Cover precedence.
8. Removing all artwork creates Artwork Suppression that blocks only automatic sweep; manual request remains explicit; Allow generation clears the suppression.
9. Later text change marks artwork stale without automatic regeneration; redating removes source-inapplicable art from active view but retains history.

## Functional acceptance

- LID-AIA-001: the frozen two-stage blind evaluation records hard-gate contract/privacy/lifecycle/retention/aspect results, originals, provenance, randomized manifests, uncurated finalist results, quality, cost, latency, and shared evaluation spend; no candidate is exposed before passing.
- LID-AIA-002: Visual Brief is read-only, versioned, source-bound, and the sole personal-content input; artwork serialization contains only the brief plus fixed approved style/configuration and excludes raw journal, names, photos, captions, identifiers, and photo-derived data.
- LID-AIA-003: manual eligibility and sparse warning follow the exact below-5, 5–19, and 20-plus meaningful-word rules; preflight shows configuration and estimated budget effect; photos or prior art do not remove manual availability.
- LID-AIA-004: 01:00 Asia/Kolkata sweep is idempotent, restart-safe, catches missed eligible days, and skips pre-activation, low-word, photo-backed, art-present, suppressed, ineligible, unhealthy, unsafe, or over-budget days with a visible reason and no reminder.
- LID-AIA-005: fixed versioned style is painterly editorial, non-photorealistic, symbolic, free of recognizable likeness, readable words, logos, signatures, and imitation of a named living artist; 4:5 presentation is non-destructive; every context labels AI artwork.
- LID-AIA-006: safety refusal is not auto-retried, weakened, rewritten, or routed to another provider; neutral unavailable state permits explicit brief regeneration and retry; transient retry is bounded and idempotent; source and cover remain correct.
- LID-AIA-007: each success preserves the downloaded/checksummed provider original, derivative, source/brief binding, exact configuration, usage, safety, cost, ordering, active selection, and history; failed attempts are not versions.
- LID-AIA-008: any live Daily Photo forces a real-photo Calendar Cover under upload, redating, Trash, restore, reorder, and artwork selection concurrency; artwork is cover-eligible only without a live photo.
- LID-AIA-009: removing all art creates Artwork Suppression; automatic sweep remains blocked across restart/export/restore; manual request does not silently clear it; Allow generation is explicit and confirmed.
- LID-AIA-010: late source/Correction change marks related art stale without automatic regeneration; regeneration is manual and versioned; redating removes inapplicable art from active gallery/cover while retaining history.
- LID-AIA-011: options are typed evaluated configurations with exact model/snapshot and reviewed endpoint, region, size, quality, format, safety, cost, lifecycle, enabled, and automatic-sweep eligibility fields; aliases/free-form values are rejected; premium remains manual-only.
- LID-OPS-017: evaluation and monthly runtime ceilings, warning, reserve, artwork allocation, predictive block, usage metering, rollover, and non-AI continuity follow the governing budget rules.
- LID-REF-006, LID-OPS-011, and LID-OPS-018: all new states meet required accessibility/browser behavior, all artwork shapes restore, and provider/sweep failure cannot block authentic source use.

## Nonfunctional acceptance

- Evaluation manifests, style/configuration versions, originals, checksums, and provenance are immutable and independently inspectable without personal content.
- Artwork request schemas are closed and fail when any non-brief personal field is added.
- Provider URLs are never treated as durable storage; successful originals are downloaded and checksummed immediately.
- Scheduling, eligibility, retries, suppression, selection, cost reservation, and cover calculations are idempotent and restart-safe.
- No raw journal, brief, prompt, image, caption, provider payload, credential, or private identifier enters operational logs or public evidence.
- Artwork is optional; source access and all non-AI archive functions remain available under refusal, outage, lifecycle disablement, or budget exhaustion.

## Design contract

R7 design covers read-only Brief and regeneration, word-count eligibility, sparse warning, preflight, configuration/cost disclosure, manual pending/success/failure/refusal, sweep eligibility/skips, AI artwork label, non-destructive aspect presentation, version history, active selection, download, real-photo cover precedence, Artwork Suppression, Allow generation, manual generation while suppressed, staleness, redating/history, provider lifecycle, budget warning/exhaustion, and no-art fallback.

The [UX specification](../../design/UX-SPECIFICATION.md) is normative. [Prototype v5](../../../prototypes/calendar-ui/index-v5.html) offers partial generation and cover direction but not validated evaluation, privacy, sweep, failure, lifecycle, suppression, staleness, budget, or recovery behavior.

## Architecture and dependency gates

- R6 has an evidence-backed proceed decision, including a passing Text Provider configuration capable of producing versioned Visual Briefs.
- The frozen artwork evaluation passes contract, privacy, lifecycle, permanent-retention, aspect, quality, cost, latency, safety, provenance, and shared-spend gates. If no candidate passes, no artwork configuration is exposed.
- Typed configuration, request, result, attempt, original/derivative, version, suppression, selection, staleness, cover, sweep, and usage-ledger decisions are reviewable.
- Request serialization mechanically permits only the Visual Brief plus fixed approved configuration.
- Backup/restore and rollback plans cover every R7 data shape and an in-flight request/sweep without losing budget or cover integrity.

## Outcome metrics

| Metric | R7 target | Evidence placeholder |
| --- | --- | --- |
| Evaluation hard gates | Every exposed configuration passes; zero unapproved option appears | Not yet provided |
| Request privacy | Zero raw journal, photo-related, caption, name, or identifier field in request fixtures | Not yet provided |
| Eligibility | 100% of manual and sweep boundary fixtures produce the specified allow/warn/skip result | Not yet provided |
| Cover integrity | Zero generated cover while any live Daily Photo exists | Not yet provided |
| Version fidelity | Every success has retained original/checksum/provenance; zero failed attempt appears as a version | Not yet provided |
| Suppression/staleness | Zero automatic recreation while suppressed and zero silent stale-to-current relabel | Not yet provided |
| Budget enforcement | Zero predicted over-limit request; usage/reservations reconcile | Not yet provided |
| Restore fidelity | Restored originals, versions, selection, cover, suppression, staleness, jobs, and spend equal the fixture | Not yet provided |

## Privacy and security

- Evaluation uses synthetic prompts only. Personal Visual Briefs, journals, photos, captions, and identifiers are prohibited.
- Runtime artwork requests contain only the selected read-only Visual Brief and fixed reviewed configuration.
- Real-photo bytes and every photo-derived field remain outside AI by construction.
- Provider lifecycle, retention, region, safety, and credential health disclosures match verified evidence and do not promise more.
- Generated originals and derivatives are encrypted locally and served through the same authenticated private, no-store boundary as other media.

## Accessibility

AI artwork labels must remain available to assistive technology in Calendar, gallery, detail, history, export, and download contexts. Brief, eligibility, warning, preflight, status, refusal, retry, version, active selection, cover, suppression, staleness, and budget controls must be keyboard operable, screen-reader named, focus managed, responsive, zoom-safe, and not depend on the image, color, or motion for meaning.

## Recovery and rollback

R7 adds artwork configurations, Brief bindings, request/attempt records, provider originals, derivatives, checksums, provenance, versions/order/active selection, suppression, staleness, sweep jobs/reasons, cover relationships, and usage reservations/entries. Exit requires encrypted backup and executed restore/export validation of all shapes.

Rollback must pause new artwork jobs, reconcile in-flight cost reservations, retain already downloaded originals and provenance, preserve suppression/staleness/cover intent, and prevent an older worker from issuing incompatible calls. Compatibility or controlled snapshot restoration plus post-rollback authentic archive access must be evidenced.

## Release entry criteria

- R6 exit criteria and proceed record exist.
- Frozen artwork evaluation and synthetic prompts are ready, and every proposed configuration passes all hard gates.
- Style, configuration, request, lifecycle, cover, suppression, staleness, budget, recovery, and rollback decisions are reviewable.
- Design covers every manual/sweep/safety/failure/version/cover/suppression/accessibility state.
- Backup/restore and rollback fixtures name every R7 data shape.

## Release exit criteria

- Every included requirement has executed requirement-level evidence or an explicit no-go.
- Evaluation, request privacy, word-count, preflight, sweep eligibility, style/label, refusal/retry, version, cover, suppression, staleness, configuration, budget, accessibility/browser, backup, restore, and rollback fixtures have specified outcomes.
- No forbidden field enters a request or log; no generated image is presented as real; no provider URL is relied on for durability.
- No unresolved severity-1 or severity-2 defect remains, and the decision record says proceed, hold, or roll back.

## No-go criteria

- No model configuration passes every evaluation and lifecycle hard gate.
- Personal data is used in evaluation, or raw journal/photo-related data enters an artwork request, log, or public evidence.
- A generated image can displace a live real photo as Calendar Cover or lacks an accessible AI label.
- Safety refusal triggers automatic retry, prompt weakening, source change, or provider fallback.
- Suppression, staleness, versions, originals, provenance, cost, backup/restore, or rollback cannot be preserved.
- Artwork failure or budget state blocks authentic archive use.

## Explicit non-goals

- Photorealistic reconstruction, recognizable likeness, image analysis, photo description, OCR, named living-artist imitation, readable text/logo/signature generation, or destructive central cropping.
- Free-form Visual Brief editing, arbitrary model strings, silent fallback, or automatic safety relaxation.
- Habit reminders, coaching, social sharing, public gallery, or generated art as documentary truth.
- Automatic regeneration after every source change; only the defined no-art sweep is automatic.
- Object-store transition.

## Evidence register

| Evidence | Expected artifact | Status |
| --- | --- | --- |
| Requirement traceability | R7 requirement-to-scenario checklist | Not yet provided |
| Model evaluation | Frozen blind manifests, hard gates, originals, provenance, scorecard, cost/latency, and spend record | Not yet provided |
| Design review | Brief, request, sweep, safety, versions, cover, suppression, staleness, budget, and accessibility review | Not yet provided |
| Architecture decision | Typed config/request, lifecycle, media, provenance, sweep, cover, budget, recovery, and rollback records | Not yet provided |
| Functional test report | Eligibility, safety, version, cover, suppression, staleness, and restart results | Not yet provided |
| Privacy/security report | Serialized-request, log, provider-lifecycle, labeling, and evidence review | Not yet provided |
| Backup/restore report | R7 data-shape restore/export and checksum/relationship comparison | Not yet provided |
| Rollback report | Queue/reservation, compatibility/data, cover/suppression/provenance, and prior-archive access results | Not yet provided |
| Owner acceptance | Artwork walkthrough and proceed, hold, or rollback decision | Not yet provided |

## Evidence boundary

Artwork examples, candidate names, prototype states, and planned evaluations are not model approval or production evidence. Only frozen evaluation results and dated executed release evidence can support later claims.
