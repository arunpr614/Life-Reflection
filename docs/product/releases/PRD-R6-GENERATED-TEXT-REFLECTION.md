# PRD R6 — Generated Text Reflection

## Document control

| Field | Value |
| --- | --- |
| Release | R6 — Generated Text Reflection |
| Document type | Product requirements document |
| Status | Council-reviewed planning baseline; not an implementation, deployment, or release-acceptance record |
| Accountable role | Product owner |
| Proposed start | 2026-12-14 |
| Proposed target | 2027-01-08 |
| Date confidence | Planning estimate only. Evidence gates, not dates, control entry and exit. |
| Evidence boundary | This document defines intended behavior. Candidate models are not approved product options until the frozen evaluation and privacy gates pass. No implementation, testing, deployment, production use, or acceptance is established. |

## Related artifacts

- [Governing product requirements](../PRODUCT-REQUIREMENTS.md)
- [Product Manager review](../../council/PRODUCT-MANAGER-REVIEW.md)
- [Phase 1 release plan](../../project/PHASE1-RELEASE-PLAN.md)
- [Phase 1 implementation plan](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [UX specification](../../design/UX-SPECIFICATION.md)
- [Prototype v5 feature audit](../../audits/PROTOTYPE-V5-FEATURE-AUDIT.md)
- [Prototype v5](../../../prototypes/calendar-ui/index-v5.html)

Prototype generated text is simulated interaction direction. It proves neither model quality nor privacy, provenance, budget, source-race, or provider behavior.

## Problem and intended outcome

The owner wants concise reflective navigation without weakening source truth or sending unnecessary personal data. Generated titles, summaries, tags, and Visual Briefs must be factual, optional, visibly derived, provider-evaluated, independently protectable, bounded by cost, and unable to block the archive.

R6 intends to add evaluated text-derived artifacts beside complete sources. Generation waits for a quiet period, performs a final eligible refresh, binds to an exact source revision set, never overwrites protected fields, rejects stale completions, and sends only a typed minimum text allowlist to the explicitly selected approved provider.

## Scope and requirement boundary

**Included requirement IDs (11):** LID-AIT-001, LID-AIT-002, LID-AIT-003, LID-AIT-004, LID-AIT-005, LID-AIT-006, LID-AIT-007, LID-REF-006, LID-OPS-011, LID-OPS-017, LID-OPS-018.

**Excluded requirement IDs (67):** LID-SCP-001, LID-SCP-002, LID-SCP-003, LID-SCP-004, LID-TG-001, LID-TG-002, LID-TG-003, LID-TG-004, LID-TG-005, LID-TG-006, LID-TG-007, LID-TG-008, LID-TG-009, LID-TG-010, LID-VN-001, LID-VN-002, LID-VN-003, LID-VN-004, LID-VN-005, LID-VN-006, LID-VN-007, LID-UP-001, LID-UP-002, LID-UP-003, LID-UP-004, LID-SRC-001, LID-SRC-002, LID-SRC-003, LID-SRC-004, LID-REF-001, LID-REF-002, LID-REF-003, LID-REF-004, LID-REF-005, LID-REF-007, LID-AIA-001, LID-AIA-002, LID-AIA-003, LID-AIA-004, LID-AIA-005, LID-AIA-006, LID-AIA-007, LID-AIA-008, LID-AIA-009, LID-AIA-010, LID-AIA-011, LID-OPS-001, LID-OPS-002, LID-OPS-003, LID-OPS-004, LID-OPS-005, LID-OPS-006, LID-OPS-007, LID-OPS-008, LID-OPS-009, LID-OPS-010, LID-OPS-012, LID-OPS-013, LID-OPS-014, LID-OPS-015, LID-OPS-016, LID-DEF-001, LID-DEF-002, LID-DEF-003, LID-DEF-004, LID-DEF-005, LID-DEF-006.

Excluded means not newly owned by R6. R0–R5 remain inherited regression gates. Real-photo and photo-derived data exclusion, source/revision/Correction truth, lifecycle, search, export, accessibility, recovery, and rollback remain release-blocking.

## Owner scenarios

1. A frozen synthetic evaluation runs blinded, repeated fixtures under the shared one-time evaluation ceiling; no personal journal, photo, caption, or identifier is used.
2. Only a configuration that passes the hard gates appears as a Text Provider/model option; unavailable, unhealthy, or unapproved choices cannot be selected, and there is no silent fallback.
3. After 15 minutes without an eligible journal-source change, one atomic valid set of title, 80–140-word summary, 3–7 unique short tags, and 150–300-token Visual Brief is created beside sources.
4. Repeated source changes coalesce; the following-day 01:00 Asia/Kolkata refresh applies only to eligible unprotected fields whose source set changed.
5. The owner edits or accepts title, summary, or tags independently; that field becomes protected, a later source change offers a replacement, and Resume automatic updates affects only the selected field.
6. A provider timeout, rate limit, transient failure, auth/quota/billing error, refusal, invalid schema, partial output, or source race leaves current source and protected fields untouched with an honest state.
7. AI budget warning or exhaustion blocks predicted over-budget generation while capture, browsing, search, correction, export, backup, and non-AI management remain available.

## Functional acceptance

- LID-AIT-001: the frozen 32-fixture, three-repeat, blinded protocol records prompt/schema versions, fact inventories, randomized grading, quality, cost, latency, provenance, hard-gate outcomes, and shared evaluation spend; no candidate is exposed before passing.
- LID-AIT-002: independent approved Text and Artwork settings exist; only enabled, healthy, evaluated configurations appear; provider changes affect future calls only; failure offers explicit retry/change and never silently falls back.
- LID-AIT-003: provider-native structured output validates atomically as one concise title, factual 80–140-word summary, 3–7 short unique searchable tags, and 150–300-token Visual Brief; invalid/partial output replaces nothing.
- LID-AIT-003: output is visibly AI-generated, warm and observational, and contains no invented fact, coaching, diagnosis, moral judgment, or unstated emotion; complete source text remains available.
- LID-AIT-004: automatic generation waits 15 minutes after the latest eligible journal-source change; schedules coalesce, survive restart, and are idempotent; 01:00 Asia/Kolkata final refresh affects only eligible unprotected fields; completion binds to the observed revision set.
- LID-AIT-005: title, summary, and tags have independent protected state; edit/accept/select protects one field; later source change marks it stale and offers a traceable replacement; Resume automatic updates changes only that field.
- LID-AIT-006: typed serialization contains deterministic ordered normalized journal text, source boundaries, and minimum date/language hints only; it excludes every photo-related field, caption, account identity, application-added name, internal ID, credential, and unrelated context.
- LID-AIT-006: calls are stateless with no files, tools, grounding, or persistent sessions; verified storage/cache controls and honest retention disclosure match the selected surface.
- LID-AIT-007: retry behavior is bounded to the selected provider/model; auth/quota/billing errors stop; schema retry occurs at most once; source-hash race rejection, refusal, partial output, and exhaustion are visible and non-destructive.
- LID-AIT-007: sanitized attempt provenance retains configured/requested/returned model, prompt/schema versions, revision set, opaque request ID, usage, cost, latency, retry/refusal/error state without raw journal or provider response in logs.
- LID-OPS-017: monthly budget is capped at the governing amount, warns at 80%, reserves the text allocation, blocks predicted over-budget calls, and never disables non-AI archive behavior; evaluation spend uses its separate shared ceiling.
- LID-REF-006, LID-OPS-011, and LID-OPS-018: all new states meet required accessibility/browser behavior, all artifact/protection/job/provenance/budget shapes restore, and provider/job failure is isolated from authentic source access.

## Nonfunctional acceptance

- Quality evaluation uses a frozen manifest and blinded randomized scoring; changes to prompts, schemas, candidates, or graders create a new version rather than changing recorded results.
- Request allowlists are compile-time or schema-enforced and inspectable in tests; adding a field fails closed until explicitly reviewed.
- Scheduling, retry, reservation, usage-ledger, and source-hash behavior is idempotent and restart-safe.
- No raw journal, prompt, output, caption, photo, identifier, credential, or provider payload enters operational logs or evidence.
- Settings and disclosures do not claim zero retention, regional processing, provider approval, or quality without exact evidence.
- Text features are optional; all authentic archive flows remain available when disabled, failed, or over budget.

## Design contract

R6 design covers evaluation-unavailable settings, approved/disabled/unhealthy provider options, privacy and retention disclosure, pending quiet period, scheduled final refresh, generating, success, invalid schema, partial output, source race, refusal, rate limit, auth/quota/billing failure, retry, stale fields, replacement review, accept/edit/protect, Resume automatic updates, version/provenance, budget warning/exhaustion, and no-AI archive behavior.

The [UX specification](../../design/UX-SPECIFICATION.md) is normative. [Prototype v5](../../../prototypes/calendar-ui/index-v5.html) provides partial generated-reflection editing direction but not validated provider, privacy, scheduler, replacement, provenance, budget, or failure states.

## Architecture and dependency gates

- R5 has an evidence-backed proceed decision and the full authentic source/revision set remains recoverable.
- The text evaluation has passed every hard gate under the frozen protocol. If no candidate passes, no Text Provider/model is exposed and the decision returns to the owner.
- Architecture decisions define typed request/output contracts, prompt/schema versioning, provider privacy configuration, provenance, source hashing, job idempotency, retries, protected fields, replacement versions, and budget reservation/accounting.
- Real-photo exclusion is mechanically enforced across the full serialized request object, including captions and photo-derived metadata.
- Backup/restore and rollback plans cover all R6 artifacts, jobs, attempts, protection/replacement, provenance, settings, and usage-ledger state.

## Outcome metrics

| Metric | R6 target | Evidence placeholder |
| --- | --- | --- |
| Evaluation hard gates | Every exposed configuration passes; zero unapproved option appears | Not yet provided |
| Factual contract | 100% of accepted evaluation outputs pass schema and frozen fact-grounding gates | Not yet provided |
| Privacy serialization | Zero forbidden field in all typed request-contract fixtures | Not yet provided |
| Protected-field integrity | Zero overwrite of a protected title, summary, or tag field | Not yet provided |
| Source-race safety | Zero stale completion becomes current in race fixtures | Not yet provided |
| Budget enforcement | Zero predicted over-limit call; warning and reservation rules reconcile to usage ledger | Not yet provided |
| Failure isolation | 100% of provider/job failure fixtures leave authentic source flows available | Not yet provided |
| Restore fidelity | Restored artifacts, versions, protections, jobs, provenance, settings, and spend equal the fixture | Not yet provided |

## Privacy and security

- The evaluation uses synthetic text only. Personal journals and all photo-related data are prohibited.
- Production request serialization uses a typed minimum allowlist and treats journal text as untrusted quoted data.
- No raw journal, output, prompt, caption, image, provider payload, credential, internal identifier, or account identifier appears in logs or public artifacts.
- Provider configuration and disclosure must match verified storage, caching, retention, and region facts; do not claim more than evidence supports.
- AI remains optional and selected explicitly; no cross-provider fallback or hidden secondary disclosure exists.

## Accessibility

AI labels, provider settings, privacy disclosures, generation status, field protection, staleness, replacement diff, version selection, provenance, warning, refusal, retry, and budget state must be keyboard operable, screen-reader named, focus managed, responsive, zoom-safe, and understandable without color or motion. Generated text is never the only route to the authentic source.

## Recovery and rollback

R6 adds provider configuration references without credentials, prompt/schema versions, derived field versions, Visual Brief versions, source bindings/hashes, protected-field and replacement state, generation jobs/attempts, sanitized provenance, and usage/budget ledger entries. Exit requires encrypted backup and executed restore across those shapes.

Rollback must leave authentic sources available and prevent an older worker from consuming an incompatible job or overwriting protected state. Evidence must cover queue draining/pausing, reservation reconciliation, schema compatibility or snapshot restoration, stale attempt invalidation, and restored selection/protection/provenance.

## Release entry criteria

- R5 exit criteria and proceed record exist.
- Frozen text evaluation, privacy contract, provider health, cost table, prompt/schema, and grading materials are ready with synthetic fixtures only.
- Every evaluation hard gate passes for any configuration proposed for exposure.
- Design and architecture cover all success, protection, replacement, privacy, budget, degraded, recovery, and rollback states.
- Backup/restore and rollback fixtures name every R6 data shape.

## Release exit criteria

- Every included requirement has executed requirement-level evidence or an explicit no-go.
- Evaluation, schema/factual, quiet/final schedule, source-race, protection/replacement, request privacy, failure/retry, provenance, budget, accessibility/browser, backup, restore, and rollback fixtures have the specified outcomes.
- No forbidden photo or private field appears in serialized requests, logs, or evidence.
- No protected field is overwritten and no failed/stale output becomes current.
- No unresolved severity-1 or severity-2 defect remains, and the decision record says proceed, hold, or roll back.

## No-go criteria

- No candidate passes all evaluation, privacy, lifecycle, cost, and provenance hard gates.
- A personal journal or photo-related value is used in evaluation or appears in a forbidden request/log/evidence field.
- Invalid, partial, stale, refused, failed, or over-budget output changes source or current protected content.
- An unapproved/unhealthy model can be selected or silent provider fallback occurs.
- AI failure prevents authentic capture, browsing, correction, export, backup, or restore.
- Backup/restore or rollback cannot preserve R6 protection, provenance, job, and budget state.

## Explicit non-goals

- Coaching, diagnosis, therapy, moral judgment, inferred emotion, reminders, streaks, or journal question answering.
- Photo analysis, image description, OCR, embeddings, semantic search, tools, grounding, persistent model sessions, or files.
- Generated artwork; R7 owns artwork evaluation and behavior.
- Silent provider fallback, free-form model identifiers, automatic overwrite of protected fields, or provider approval by reputation.
- Sharing, public links, multi-user behavior, or object-store transition.

## Evidence register

| Evidence | Expected artifact | Status |
| --- | --- | --- |
| Requirement traceability | R6 requirement-to-scenario checklist | Not yet provided |
| Model evaluation | Frozen manifest, blinded scorecard, fact inventory, hard gates, cost/latency, and spend record | Not yet provided |
| Design review | Settings, generation, protection, replacement, failure, budget, and accessibility review | Not yet provided |
| Architecture decision | Typed contracts, privacy, provenance, scheduling, source race, protection, budget, recovery, and rollback records | Not yet provided |
| Functional test report | Contract, schedule, race, protection, retry, failure, and budget results | Not yet provided |
| Privacy/security report | Serialized-request allowlist and log/evidence leakage review | Not yet provided |
| Backup/restore report | R6 data-shape restore and relationship/ledger comparison | Not yet provided |
| Rollback report | Queue, reservation, schema/data, attempt, protection, and prior-archive access results | Not yet provided |
| Owner acceptance | Generated-text walkthrough and proceed, hold, or rollback decision | Not yet provided |

## Evidence boundary

Candidate names, scorecard plans, prototype copy, and this PRD are not model approval or runtime evidence. Only the frozen evaluation and dated executed release evidence can support later claims.
