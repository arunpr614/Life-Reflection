# Life in Days — prototype completeness project tracker v17–v35

- **Created:** 2026-08-19
- **Tracker owner:** Project Manager agent
- **Product owner and final product decision-maker:** Arun
- **Program state at initialization:** `Queued`
- **Current program state:** v17 `Complete`; its self-reference-free completion-status successor was externally pushed/read back at `8d94a61be8a7e7d6114b3a3b5b3963f23421e445`; v18 preserves two failed QA rounds and now has a definitive 49-record Round 3 held candidate with fresh Product/Design acceptance; Round 3 is pending; 17 packages, v19–v35, remain `Queued`, with v19 additionally user-gated
- **Frozen source baseline:** v16 archive/tracker commit `01d1f054a12773e07f91096b8d76b0c5f4064329`
- **Execution worktree:** `/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect-phase2-v17-v35`
- **Execution branch:** `codex/prototype-completeness-v17-v35`
- **Intended remote destination:** `origin/codex/prototype-completeness-v17-v35`
- **Remote state at initialization:** branch absent; local branch has no upstream
- **Current remote readback:** `origin/codex/prototype-completeness-v17-v35` equals local `HEAD` at `8d94a61be8a7e7d6114b3a3b5b3963f23421e445`; the root agent externally verified this self-reference-free v17 completion-status successor before opening v18. The earlier publication receipt at `626f7aedd636d2291d009de654a7ac00b21cb085` remains recorded in the v17 ledger.
- **Scope:** 19 consecutive additive prototype packages, v17 through v35, closing 41 still-open prototype-representable rows from the v5 audit
- **Current audit progress:** 19/57 prototype-representable rows closed; 38/57 remain open
- **Current package progress:** v17 is `Complete` with P/D/C/I/Q/F all `A`; v18 is `Held candidate preparation` with `P=A`, `D=A`, `C=A`, `I=A` locally, fresh Round 3 `Q=—` pending while historical Rounds 1–2 remain `F`, and `F=—`; definitive evidence and the self-reference-free 49-record manifest are held; 17 packages (v19–v35) remain queued and v19 is user-gated

This is the living, additive execution tracker for the v17–v35 prototype-completeness loop. It does not replace or edit the frozen [prototype completeness tracker](../project/PROTOTYPE-COMPLETENESS-TRACKER.md), the frozen v1–v16 prototype files, or their historical ledger. The frozen tracker remains the authority for work through v16 and for the original audit-to-version mapping. This file records only work after that frozen boundary.

The governing sources are:

- Operational handover in the maintained checkout, intentionally absent from this branch at initialization: `/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect/docs/project/PHASE2-AI-AGENT-HANDOVER-2026-08-19.md`
- [Frozen prototype completeness tracker](../project/PROTOTYPE-COMPLETENESS-TRACKER.md)
- [Prototype v5 feature audit](../audits/PROTOTYPE-V5-FEATURE-AUDIT.md)
- [Frozen v16 prototype handoff](../prototypes/CALENDAR-UI-PROTOTYPE-v16.md)
- [Product requirements](../product/PRODUCT-REQUIREMENTS.md)
- [UX specification](../design/UX-SPECIFICATION.md)

If a direct product decision conflicts with a written source, stop the affected package, record the conflict, and obtain a Product Council disposition. Do not silently resolve a product, privacy, security, recovery, or scope conflict for convenience.

## 1. Goal and success boundary

The program goal is achieved only after every package v17–v35 has completed the Product, Design, Council, Implementation, Independent QA, and Freeze/handoff gates in order; every one of the 41 rows in Section 6 is closed at the bounded frontend-prototype level; every completed version is committed and pushed with remote readback before the next version starts; and the final v35 cross-version closure criteria in Section 11 pass.

This program may prove deterministic synthetic frontend representation, interaction state, rendering, semantics, focus behavior, responsive behavior, privacy-shaped UI behavior, and exact static bytes. It does **not** prove:

- backend or provider integration;
- persistence, transactionality, concurrency, idempotency, restart recovery, or server history;
- authentication, authorization, encryption, secret handling, or production privacy enforcement;
- actual Telegram or VoiceNotes behavior;
- actual AI-model qualification, spend enforcement, backup, restore, export round-trip, storage migration, deployment, operations, or production readiness;
- formal accessibility conformance, native-browser zoom behavior not directly reproduced, or usability validation by Arun.

Only fictional/synthetic fixtures may enter implementation, screenshots, QA evidence, logs, commits, or GitHub. Real journals, photos, captions, timestamps, identifiers, EXIF, account details, credentials, and recovery material are prohibited.

## 2. Repository and worktree controls

1. All v17–v35 work occurs only in the execution worktree and branch named above.
2. The maintained v16 checkout remains untouched. Do not reuse its index or switch its branch.
3. The exact v16 baseline is the full SHA `01d1f054a12773e07f91096b8d76b0c5f4064329`; abbreviated SHAs are descriptive only.
4. Frozen v1–v16 application, style, guide, handoff, Council, fixture, QA, and evidence files are immutable. Every new package uses new vN-scoped files.
5. Do not use `git reset`, `git clean`, `git stash`, destructive checkout/restore, broad staging, force-push, or branch deletion.
6. Stage only an explicit reviewed path roster. The complete staged-name list must equal that roster.
7. `main` and the archive lineage have no reported common ancestor. This tracker does not authorize a pull request or merge into `main`.
8. The only intended publication destination for this loop is the exact named branch `origin/codex/prototype-completeness-v17-v35`. Use an explicit refspec and verify remote-head parity after every version.
9. A failed QA run consumes no new version number. Repair the same unfrozen vN candidate and rerun independent QA from zero.
10. No vN+1 Product or implementation work starts until vN has passed QA, completed its freeze/tracker records, been pushed, and passed remote readback.

## 3. Live GitHub v01–v16 program reconciliation

The existing live GitHub Phase 2 program is a separate additive re-refinement program for the **historical v01–v16 baselines**:

- milestone 13: `Phase 2 — Design Refinement (v1–v16)`;
- issues #115–#149: 35 open issues consisting of a charter, artifact index, 16 historical-version design refinements, 16 paired QA gates, and one closeout;
- live initialization state: 35 `Backlog`, 35 `Artifact readiness: Incomplete`, and 35 `Execution allowed: No`;
- issue #117 begins from the historical v1 baseline `7324edce89d35c272cc78944f8afe88c8d31b1aa`, not from frozen v16.

Therefore:

1. This v17–v35 tracker does not repurpose, relabel, renumber, close, or claim progress against #115–#149.
2. A local v17–v35 result is not evidence that a live v01–v16 ticket is complete.
3. No GitHub issue, Project field, view, milestone, relationship, status update, or comment may be mutated under this tracker without a separately authorized, recorded reconciliation and fresh readback.
4. If a durable GitHub v17–v35 roadmap is later requested, it must use new dedupe keys and preserve all current v01–v16 objects. It must not rewrite the historical program into a different scope.
5. The branch push and immutable artifact publication required by this tracker remain distinct from GitHub Project or issue mutation.

## 4. Status and gate contract

### Package status

| Status | Meaning |
| --- | --- |
| `Queued` | Mapped but no package gate has started. |
| `PM in progress` | Product acceptance scenarios are being prepared. |
| `Design in progress` | The state, interaction, responsive, content, and accessibility contract is being prepared. |
| `Council review` | Product, Design, and Project are reconciling the package before implementation. |
| `Implementation in progress` | New additive vN files are being created and self-checked. |
| `QA in progress` | A fresh independent agent is judging held candidate bytes read-only. |
| `QA failed` | The same vN remains open for repair and a complete new QA run. |
| `Repair in progress` | QA failed; the same unfrozen vN is being repaired before complete recapture, reseal, and fresh independent QA. |
| `Held candidate preparation` | Product, Design, Council, and implementation gates pass for repaired working bytes; an exact replacement manifest is being prepared before a fresh independent QA run. |
| `Freeze/publish in progress` | QA passed; exact tested bytes and records are being committed, pushed, and read back. |
| `Completed locally` | P/D/C/I/Q/F are `A` for the exact local commit chain, but publication and remote readback remain pending. This is not remote `Complete` and does not open the successor-version gate. |
| `Complete` | All six gates passed and the remote branch contains the exact recorded chain. |
| `Blocked` | A named dependency, conflict, authority issue, or evidence failure prevents safe progress. |

### Gate notation

`—` = not started; `IP` = in progress; `A` = approved/passed; `A (local)` = locally passed but awaiting the publication/readback portion of the gate; `F` = failed; `B` = blocked.

| Gate | Accountable role | Required exit evidence |
| --- | --- | --- |
| `P — Product acceptance` | Product Manager | Requirement IDs and source citations; included/excluded behavior; normal, empty, loading, error, interruption, destructive, history, privacy, and recovery scenarios as applicable; observable pass criteria. |
| `D — Experience contract` | Expert UI/UX Designer | Screen/state inventory; hierarchy; exact labels; transitions; focus/Back/Escape behavior; responsive rules; accessibility annotations; synthetic fixture rules; at least two viable approaches for the highest-risk interaction and a rationale. |
| `C — Council approval` | Product Manager + UI/UX Designer + Project Manager | One recorded Approved decision or an explicit blocker requiring Arun. Product meaning and privacy boundaries may not be inferred silently. |
| `I — Prototype implementation` | Implementing agent | New additive vN assets; representative domain-state changes; complete current-run evidence after final UI bytes; exact hashes; static/live self-checks; no frozen-byte mutation. |
| `Q — Independent QA` | Newly assigned QA agent | Read-only exact-candidate run; original-size image inspection; version scenarios and inherited regression; responsive/a11y/privacy/network/storage/console checks; severity ledger; exact Pass/Fail verdict and limitations. |
| `F — Freeze, push, readback` | Project Manager | Exact tested bytes committed; freeze and tracker commits recorded; explicit push succeeds; remote SHA and committed blobs match; only then status `Complete`. |

## 5. Version execution register

All packages are initially queued. Gate values must change only when their named evidence exists.

| Version | Stable feature package | Primary audit gap(s) | Dependency | Status | P | D | C | I | Q | F |
| --- | --- | --- | --- | --- | :---: | :---: | :---: | :---: | :---: | :---: |
| **v17** | **PVA-012 Atomic Redating** | 5, redating portion | frozen v16 `01d1f054…` | `Complete` | A | A | A | A | A | A |
| **v18** | **PVA-013 History and Provenance** | 4 History; 5 provenance | v17 | `Held candidate preparation` | A | A | A | A (local) | — | — |
| **v19** | **PVA-014 Trash** | 4 Trash | v18 | `Queued` | — | — | — | — | — | — |
| **v20** | **PVA-015 Suppressions** | 4 Suppressions | v19 | `Queued` | — | — | — | — | — | — |
| **v21** | **PVA-016 Complete Lexical Search** | 2 capability; 9 caption search | v6 and v18–v20 | `Queued` | — | — | — | — | — | — |
| **v22** | **PVA-017 Generated-field Lifecycle Parity** | 7 field lifecycle | v21 | `Queued` | — | — | — | — | — | — |
| **v23** | **PVA-018 AI Text Processing States** | 7 processing/failure | v22 | `Queued` | — | — | — | — | — | — |
| **v24** | **PVA-019 System Health Foundation** | 4 Health; 6 truthful operations | v23; Council decision C-04 | `Queued` | — | — | — | — | — | — |
| **v25** | **PVA-020 Provider Settings and Privacy** | 7, 8, 10 provider/privacy/cost | v24; Council decision C-04 | `Queued` | — | — | — | — | — | — |
| **v26** | **PVA-021 Artwork Request Confirmation** | 8 confirmation | v25 | `Queued` | — | — | — | — | — | — |
| **v27** | **PVA-022 Artwork Failure and Budget States** | 8 failure/budget | v26 | `Queued` | — | — | — | — | — | — |
| **v28** | **PVA-023 Artwork Version and Staleness** | 8 versions/staleness | v27 and v18 | `Queued` | — | — | — | — | — | — |
| **v29** | **PVA-024 Artwork Sweep and Suppression** | 8 sweep; 4 suppression | v28 and v20 | `Queued` | — | — | — | — | — | — |
| **v30** | **PVA-025 Daily Photo Completeness** | 9 photo detail; 13 accessibility | v29 | `Queued` | — | — | — | — | — | — |
| **v31** | **PVA-026 Storage Capacity and Migration** | 6 storage/capacity | v30; Council decision C-04 | `Queued` | — | — | — | — | — | — |
| **v32** | **PVA-027 Backup, Restore, and Recovery Ceremony** | 4 recovery; 6 recovery safety | v31; Council decision C-04 | `Queued` | — | — | — | — | — | — |
| **v33** | **PVA-028 Restorable Export** | 4 Export | v32 | `Queued` | — | — | — | — | — | — |
| **v34** | **PVA-029 Access and Security Boundary** | 10 access/encryption | v33; Council decision C-04 | `Queued` | — | — | — | — | — | — |
| **v35** | **PVA-030 Responsive and Accessibility Closeout** | 13 plus all-version regression | v34 and all prior QA | `Queued` | — | — | — | — | — | — |

## 6. Exhaustive 41-row closure inventory

`Open` means the v5 audit gap has not yet passed its assigned v17–v35 package. Closure is bounded to frontend-prototype representation and inherits every proof limitation in Section 1.

Current arithmetic after completed v17: the frozen v1–v16 program had closed 16/57 prototype-representable audit rows; v17 closes exactly three more, yielding **19/57 closed and 38/57 open**. V18's exact implementation/evidence candidate is accepted locally and being sealed for fresh independent QA, and **17 packages v19–v35 remain queued**. No v18 row closes before QA, freeze, push, and remote readback.

| # | Version | Requirement | V5 state | Observable closure required | State |
| ---: | --- | --- | --- | --- | --- |
| 1 | v17 | `LID-SCP-002` | Partial | Item-level redating with immutable Original Timestamp and correct two-day effects | Closed (v17 published/read back) |
| 2 | v17 | `LID-SRC-003` | Placeholder | Atomic preview, failure/success, old/new day links, unchanged Original Timestamp | Closed (v17 published/read back) |
| 3 | v17 | `LID-SRC-004` | Partial | Exact source-set binding, stale/invalidated derived results, retained art/history after redating | Closed (redating portion; v17 published/read back) |
| 4 | v18 | `LID-SCP-003` | Partial | Navigable source, Correction, revision, and Derived Artifact separation and provenance | Open |
| 5 | v18 | `LID-VN-006` | Partial | Revised, untagged, and deleted upstream lifecycle with retained revisions and conflict state | Open |
| 6 | v18 | `LID-REF-004` | Partial | Journal Day exposes functioning history/provenance and exceptional management states | Open |
| 7 | v19 | `LID-SCP-004` | Partial | Removing/restoring the final live source hides/restores ordinary day visibility while history remains reachable | Open |
| 8 | v19 | `LID-OPS-010` | Placeholder | Trash expiry, restore, permanent-delete confirmation, and visibility/cover consequence preview | Open |
| 9 | v20 | `LID-VN-007` | Placeholder | Source Suppression lifecycle, restore behavior, opaque identity, and Allow re-import | Open |
| 10 | v21 | `LID-TG-009` | Partial | Photo Caption is visible, searchable, match-identified, and explicitly excluded from AI | Open |
| 11 | v21 | `LID-REF-003` | Partial | Private lexical/date/exact-tag/caption search, match reasons, Include History, and complete state family | Open |
| 12 | v22 | `LID-AIT-003` | Partial | Valid title, factual 80–140-word summary, 3–7 unique tags, Visual Brief, partial/invalid handling | Open |
| 13 | v22 | `LID-AIT-005` | Partial | Independent title/summary/tag protect, stale suggestion, Use/Keep/Edit/Resume behavior | Open |
| 14 | v23 | `LID-AIT-004` | Partial | Quiet-period waiting, late-source reset, 01:00 final refresh, race and stale-completion outcomes | Open |
| 15 | v23 | `LID-AIT-007` | Missing | Pending, timeout, rate, provider, quota, refusal, source-race, retry, exhaustion, and safe attempt provenance | Open |
| 16 | v24 | `LID-OPS-014` | Placeholder | First-class System Health with approved status vocabulary and durable-looking synthetic evidence cards | Open |
| 17 | v24 | `LID-OPS-015` | Partial | Immediate private health state and repeated-failure/recovery Telegram alerts without habit reminders | Open |
| 18 | v25 | `LID-AIT-002` | Partial | Approved-option metadata shape, confirmation, future-only change, health/retry, and no fallback | Open |
| 19 | v25 | `LID-AIT-006` | Partial | Exact lane/provider/retention/configuration boundary with no photo/caption input or fallback claim | Open |
| 20 | v25 | `LID-AIA-011` | Partial | Typed approved option, health/cost/lifecycle/sweep eligibility, and no free-form model entry | Open |
| 21 | v25 | `LID-OPS-017` | Partial | Current/predicted/reconciled spend, 80% warning, hard block, allocation, and rollover | Open |
| 22 | v26 | `LID-AIA-002` | Partial | Read-only brief history/source binding and separate Regenerate Brief versus Retry Artwork | Open |
| 23 | v26 | `LID-AIA-003` | Partial | Every request preflight shows brief, provider/model, cost/budget, credential state, and sparse warning | Open |
| 24 | v27 | `LID-AIA-006` | Missing | Neutral safety refusal with explicit Regenerate Brief then Retry and no silent provider switch | Open |
| 25 | v28 | `LID-AIA-005` | Partial | Persistent non-photorealistic AI label and provenance across day/history/export representations | Open |
| 26 | v28 | `LID-AIA-007` | Partial | Version compare/select, active/history state, trigger/provider/brief/source/cost provenance | Open |
| 27 | v28 | `LID-AIA-010` | Partial | Stale art stays labeled; source bindings visible; redating moves invalid active art to history | Open |
| 28 | v29 | `LID-AIA-004` | Partial | 01:00 eligibility, skips, failure and restart-repair evidence without reminder behavior | Open |
| 29 | v29 | `LID-AIA-009` | Placeholder | Move-all-art consequence, Artwork Suppression, Allow Generation, and separate regeneration | Open |
| 30 | v30 | `LID-TG-007` | Partial | Gallery and deterministic real-photo cover after duplicate, redating, Trash, and restore transitions | Open |
| 31 | v31 | `LID-OPS-006` | Missing | Exact media/free-space thresholds, migration states, and emergency media rejection without deletion/downsampling | Open |
| 32 | v32 | `LID-OPS-011` | Placeholder | Snapshot, repository check, sample restore, full recovery, retention, and truthful evidence separation | Open |
| 33 | v32 | `LID-OPS-012` | Missing | Three-part Recovery Ceremony and launch-blocked/completed result without exposing key details | Open |
| 34 | v33 | `LID-REF-007` | Partial | Functioning Correction, redating, deletion/restoration, suppression, export, and provider actions | Open |
| 35 | v33 | `LID-OPS-013` | Placeholder | Complete manifest, encryption/passphrase choice, progress/failure, checksum, expiry, and removal | Open |
| 36 | v34 | `LID-SCP-001` | Partial | Private single-user access, denied/session states, and no sharing/public routes | Open |
| 37 | v34 | `LID-OPS-001` | Missing | Unauthenticated, denied, MFA, seven-day expiry, and reauthentication-return states | Open |
| 38 | v34 | `LID-OPS-003` | Partial | Accurate secret/rotation/credential disclosure with no identifier or value in browser fixtures | Open |
| 39 | v34 | `LID-OPS-004` | Missing | Application-controlled at-rest encryption, off-server recovery material, server-compromise, and not-E2EE limits | Open |
| 40 | v35 | `LID-REF-005` | Partial | Measured theme/contrast/type/motion behavior with no essential metadata below the token floor | Open |
| 41 | v35 | `LID-REF-006` | Partial | Private image descriptions, focus contract, compact/zoom/keyboard/screen-reader/contrast evidence | Open |

### Outside UI register — explicitly non-closable by prototype

These 12 v5-audit rows require separately governed implementation, integration, evaluation, security, storage, or operational evidence. A truthful pending, unavailable, failed, blocked, or synthetic screen may be included in the related prototype package, but no prototype version or QA verdict may change their state from `Requires external evidence`.

| Requirement | Required evidence outside this prototype program | Related truthful UI package(s) | State |
| --- | --- | --- | --- |
| `LID-TG-010` | Exact Original preservation and local metadata-free derivative tests | v30 | Requires external evidence |
| `LID-VN-001` | Synthetic VoiceNotes integration-spike result | v24 | Requires external evidence |
| `LID-VN-002` | Webhook/MCP authority, retrieval, authentication, and idempotency evidence | v24 | Requires external evidence |
| `LID-VN-005` | Replay-safe complete reconciliation and partial-enumeration tests | v18, v24 | Requires external evidence |
| `LID-AIT-001` | Approved text-model evaluation and signed qualification | v25 | Requires external evidence |
| `LID-AIA-001` | Blind artwork evaluation and signed qualification | v25 | Requires external evidence |
| `LID-OPS-002` | Callback host/path isolation, rate limiting, and sanitized logging tests | v34 | Requires external evidence |
| `LID-OPS-005` | Bounded memory staging, constrained decoder, swap refusal, and cleanup tests | v31 | Requires external evidence |
| `LID-OPS-007` | Storage abstraction plus R2 migration, reconciliation, and rollback proof | v31 | Requires external evidence |
| `LID-OPS-008` | Authenticated decrypt/private-cache deployment evidence | v21, v30, v34 | Requires external evidence |
| `LID-OPS-009` | Media-reference counting and last-reference physical-deletion tests | v19, v31 | Requires external evidence |
| `LID-OPS-016` | Allowlists, log retention, and forbidden-content tests | v21, v24, v34 | Requires external evidence |

## 7. Product acceptance and independent-QA sequence

The following is the minimum package-specific sequence. Product and Design may make it more exact before Council approval, but may not weaken it.

| Version | Product acceptance focus | Independent-QA focus |
| --- | --- | --- |
| v17 | Deliberate item-level Journal Date change; immutable Original Timestamp; explicit future-date rejection; old/new Journal Days, covers, visibility, derived staleness, art history, success/failure and return links | Atomic zero-or-one represented outcome; future date cannot commit; no partial effect on failure; correct old/new state; focus/history/privacy; full inherited v6–v16 regression affected by dates |
| v18 | Global/day/item/field/art histories; typed events; source/derived lanes; upstream revised/untagged/deleted lifecycle; hidden historical day | Cardinality/order/lineage matrix; read-only history; no invented backend durability; Journal Day/history navigation and inherited redating checks |
| v19 | Recoverable item list and exact 30-day expiry; ordinary-view exclusion; restore; permanent delete; shared-media-safe and backup-language truth; visibility/cover/stale preview | Destructive confirmation and cancel; exact expiry boundaries; last-source hide/restore; shared-media reference remains safe; history preservation; no false physical-deletion claim |
| v20 | Separate Source and Artwork suppression; opaque identity; Allow re-import/Allow generation; manual-art distinction; allow actions do not promise immediate re-import or generation | Suppression lifecycle transitions and cancel paths; allow actions change eligibility only; no upstream mutation or immediate-result claim; opaque identity privacy; search/history/Trash interaction |
| v21 | Exact current text/date/tag/caption search; Include History off; why-matched provenance; revision/Trash labels; initial/updating/empty/error/retry/destination states | Query stays out of URL/title/history/storage/network/log-shaped output; full fixture matrix; deterministic focus; captions excluded from AI |
| v22 | Independent Title/Summary/Tags lifecycle; Use/Keep/Edit/Resume; 80–140 words; 3–7 unique tags | Cross-field independence; validation/error/partial states; no silent overwrite; exact version/protection state and inherited search behavior |
| v23 | Quiet-period and final refresh; generation/source race; refusal/schema/timeout/rate/provider/auth/quota/retry/exhaustion | Attempt-state transition and bounded-retry matrix; source content remains available; safe provenance; no sensitive log payload or fallback |
| v24 | Factual System Health for integrations/providers/jobs/backup; approved vocabulary; repeated-failure/recovery alerts | Truthful synthetic/unverified status; sanitized evidence; freshness; alert thresholds; no reminders or readiness overclaim |
| v25 | Independent provider controls; evaluation-incomplete and synthetic-qualified fixtures; credentials; future-only confirmation; no fallback; cost/region/lifecycle/privacy lanes | Exact lane/payload disclosure; no free-form model; warning/block/rollover matrix; no real credential/provider or qualification claim |
| v26 | Every artwork request confirms brief, provider/configuration, credential state, predicted cost and budget; sparse/disabled rules | No request before confirmation; Cancel safe; Regenerate Brief creates no artwork attempt; threshold and budget matrix |
| v27 | Requested/generating/success/refusal/timeout/rate/credential/quota/invalid/budget states and explicit Retry | Distinct results and retry bounds; no fallback; refusal recovery requires new brief; source/reflection remains readable |
| v28 | Compare/select retained art versions; active/history/stale; source/brief/provider/cost provenance; redated-source history; real-photo cover precedence | Version cardinality, active selection, stale/redated behavior, persistent permitted-context labels, and real-photo cover winning every applicable transition |
| v29 | Exact 01:00 eligibility, missed-run repair, skip/failure reasons, delete-all consequence, manual/sweep distinction, Allow Generation with no immediate-art promise | Eligibility matrix and one-result cardinality; suppression interactions; no reminders; Allow Generation changes eligibility only; no automatic or immediate request when prohibited |
| v30 | Original/view/download; caption/time/source; redating/reorder/cover/Trash; private description explicitly excluded from AI; compression disclosure; pointer/buttons; focus return | Cover/reorder/Trash/redating combinations; description is private and absent from AI-shaped inputs; modal initial/return focus; 320/390/landscape; real-photo cover precedence |
| v31 | Exact 7/8/9/10 GB media and 18/15/13/12 GB host-free thresholds; root/copy/target/failure/emergency states | Boundary-value matrix; no silent deletion/downsampling; non-media continuity; truthful unverified migration/storage language |
| v32 | Snapshot/check/sample/full-drill separation; retention/due state; blocked three-step ceremony; measured duration versus target | Evidence-type distinction and stale/failed/due states; ceremony remains blocking; no real backup/restore or recovery claim |
| v33 | Complete current/history/Trash/suppression manifest; AES-256 encrypted default; explicit unencrypted warning; one-time passphrase; named stages; ready/failed/expired/downloaded lifecycle | Content/state matrix; passphrase not retained in represented state; retry/cleanup/expiry; no actual encrypted-export or round-trip claim |
| v34 | Unauthenticated/denied/MFA/session/reauth; no application-account/password UI; encryption/server-compromise/not-E2EE disclosure; generic URLs/title and no-store intent | Access-state routes and return behavior; no secret/identifier; privacy wording; query/URL/title/storage/network regression; no production-auth claim |
| v35 | 320/390, 200% text, 400% page zoom/reflow, browser/keyboard/screen reader, modal focus, target sizes, 13 px metadata, contrast, non-color state and reduced motion | Complete v6–v35 closure regression; disclose native-tool limits; all 41 rows and nine inherited v5 guardrails reconcile; zero unresolved Critical/High |

## 8. Candidate, QA, and severity record contract

Before QA starts for each version, append a version record containing:

- exact baseline full SHA;
- exact candidate commit **or** exact uncommitted worktree fingerprint, never an ambiguous mixture;
- exact changed-file roster and aggregate hash;
- exact authority-file hashes;
- evidence roster, dimensions, state/theme/viewport mapping, format, individual hashes, and aggregate hash;
- confirmation that every image was captured after the final candidate bytes;
- Product, Design, and Council identities and dispositions;
- independent QA agent identity, which must differ from the implementing agent;
- held-candidate start time and QA completion time;
- QA verdict and counts for Critical, High, Medium, and Low;
- each Medium/Low finding's owner, disposition (`Fixed`, `Accepted`, or `Deferred by named decision`), rationale, and retest evidence;
- browser, native zoom, input synthesis, provider, network, and environment limitations;
- cleanup result for browser tabs, local server/listener, storage, and temporary evidence processes.

QA passes only when all required version scenarios and proportional inherited regressions have named evidence, Critical is 0, High is 0, and every Medium/Low finding is fixed or explicitly accepted/deferred by the named decision owner. An unowned or undispositioned lower-severity finding blocks `F`.

The QA agent is read-only. It must not repair the candidate it judges. Any candidate, package, authority, or evidence byte change after QA begins invalidates the entire verdict and requires a fresh agent run from zero.

## 9. Per-version commit, push, and readback contract

After exact-candidate QA Pass:

1. If QA judged uncommitted bytes, create one implementation/evidence commit containing exactly those tested bytes. Compare each committed blob with the QA manifest. If QA judged a pre-QA candidate commit, reuse it unchanged and do not amend it.
2. Create a direct documentation-only freeze successor if the package follows the established freeze pattern. It must not change tested UI, authority, package, evidence, or QA bytes.
3. Create a direct tracker-only successor recording the freeze commit's full SHA. It must not invent its own SHA.
4. Inspect unstaged and staged exact-path diffs, privacy-sensitive strings, links, and whitespace. Stage and commit only the approved roster.
5. Push explicitly to `origin/codex/prototype-completeness-v17-v35`; never use a bare or force push.
6. Read back the remote branch and prove its full SHA equals local HEAD.
7. Resolve immutable commit links and verify each recorded artifact's committed blob against the manifest, not merely HTTP success.
8. Confirm the maintained v16 archive head, `origin/main`, frozen v1–v16 bytes, and unrelated/protected local material were not changed.
9. Mark `F=A` and the version `Complete` only after readback has zero mismatch. Only then may the next version move from `Queued`.

The minimum additive vN package normally includes:

- `prototypes/calendar-ui/index-vN.html`;
- `prototypes/calendar-ui/app-vN.js`;
- vN-scoped style assets;
- `prototypes/calendar-ui/README-vN.md`;
- `docs/prototypes/CALENDAR-UI-PROTOTYPE-vN.md`;
- vN Council and feature-fixture authority under `docs/prototypes/vN/`;
- current-run original evidence plus manifest under `docs/prototypes/vN/`;
- `design-qa-vN.md`;
- only the narrowly required package-check, documentation-index, and living-tracker updates.

Extra files require an explicit roster and rationale. Missing required files block candidate hold.

## 10. Commit, push, readback, and QA ledger

Populate each row append-only as the version progresses. `Pending` is not evidence of failure; it means the gate has not yet produced the named record.

| Version | Candidate identity / aggregate | QA agent | Verdict and C/H/M/L | Lower-severity disposition | Implementation/evidence commit | Freeze commit | Tracker commit | Remote head/readback | Completion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v17 | Round 1 manifest `51f8e49fe588c139d3c542da22833cf9dd2bd840cdac39fe7b6ab1efde570466` / aggregate `14abca5efb18c2887fb4790a481abe26acafc9674317d6d20a45f093f75e6bbe` remain rejected history. Accepted Round 2 manifest `6405f86c8074d142dc6f2d120549e34db69e7c97b0d92288657f5104717fa471`; 35-file aggregate `e7fe4250510958c155726753ba8247be594e8592d03a690282ab4f59da5bc2ec`. | Round 1 `/root/qa_v17`; Round 2 `/root/qa_v17_round2` | Round 1 **FAIL — C0/H2/M3/L0**; Round 2 **PASS — C0/H0/M0/L0** | Every Round 1 and later readiness finding was fixed; none accepted or deferred; Round 2 found no lower-severity defect | `571308f678ba92a159b95b5093c68ee4b283fe4a` | `6c6fe10b2fa575447704ca94f319c258f480999c` | Local-close record `812697246203dcfdaf10f022621b70a84ed30b8c`; publication receipt `626f7aedd636d2291d009de654a7ac00b21cb085` | Second push/readback: local `HEAD` = remote branch = `626f7aedd636d2291d009de654a7ac00b21cb085` at `2026-08-19T15:52:15+05:30`; zero mismatch | `Complete`; P/D/C/I/Q/F all `A`; v18 gate may open after root externally verifies publication of this completion-status update |
| v18 | Round 3 checksum manifest pending external QA identity readback | Fresh Round 3 read-only QA pending | Fresh Round 3 pending; historical Rounds 1–2 `F` | No finding accepted or deferred; every Round 1/Round 2 finding repaired and rechecked locally | Pending | Pending | Pending | Pending | `Held candidate preparation`; P/D/C/I=`A` locally; fresh Round 3 Q=`—` pending; F=`—` |
| v19 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v20 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v21 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v22 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v23 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v24 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v25 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v26 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v27 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v28 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v29 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v30 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v31 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v32 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v33 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v34 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| v35 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |

## 11. Final v35 success criteria

The v17–v35 goal is complete only when a fresh final readback proves all of the following:

- [ ] All 19 packages are `Complete` with P/D/C/I/Q/F all `A`.
- [ ] All 41 rows in Section 6 are closed at the explicitly bounded frontend-prototype level.
- [ ] Every package has a unique, consecutive version number; no frozen version was overwritten and no failed attempt consumed an extra version.
- [ ] Every version has a named fresh independent QA agent, an exact tested candidate, an evidence manifest, and a verdict with Critical 0 and High 0.
- [ ] Every Medium/Low finding across all versions is fixed or has a named accepted/deferred disposition and residual-risk owner.
- [ ] All per-version implementation/evidence, freeze, and tracker commits are recorded and reachable from `origin/codex/prototype-completeness-v17-v35`.
- [ ] Every version was pushed and read back before its successor started.
- [ ] Remote HEAD equals the final local tracker commit, and immutable artifact links resolve to matching committed blobs.
- [ ] The nine inherited v5 Full guardrails remain intact: exact prospective VoiceNotes tag; no unsupported upload/editor scope; real-photo cover precedence; and all six deliberate deferrals.
- [ ] Cross-version terminology, source/derived separation, Calendar/Almanac navigation, privacy, search, history, redating, lifecycle, AI, health, recovery, export, access, responsive, focus, keyboard, contrast, forced-colors, reduced-motion, and failure-state checks pass.
- [ ] No real personal data, credential, secret, account identifier, recovery material, or unsupported production claim appears in candidate or evidence bytes.
- [ ] The maintained v16 checkout, frozen archive head, `origin/main`, frozen v1–v16 files, protected Phase 1 material, and the separate GitHub v01–v16 program remain unmodified unless separately authorized and evidenced.
- [ ] Final language says only that the complete synthetic frontend prototype represents the audited contract. It does not claim implementation, integration, persistence, security, recovery, deployment, accessibility conformance, production privacy, or production readiness.

## 12. Append-only project-manager update template

Append one start record and one or more disposition records per version. Never rewrite an earlier historical state to make the current result appear cleaner.

```text
### YYYY-MM-DD — vN — <package> — <state>

- Baseline full SHA:
- Worktree and branch identity:
- Product Manager / P gate:
- UI/UX Designer / D gate:
- Project Manager / Council / C gate:
- Implementing agent / I gate:
- Candidate identity and exact roster:
- Evidence roster and aggregate:
- Independent QA agent / Q gate:
- Verdict and Critical/High/Medium/Low counts:
- Lower-severity finding dispositions:
- Limitations and proof boundary:
- Implementation/evidence commit:
- Freeze commit:
- Tracker commit:
- Explicit push destination and result:
- Remote head and blob readback:
- Frozen/archive/main/unrelated-work guards:
- Requirement rows closed:
- Remaining blockers:
- Next action:
- Package status / F gate:
```

## 13. Initialization record

### 2026-08-19 — v17–v35 program — tracker initialized

- Frozen authority preserved: [the existing completeness tracker](../project/PROTOTYPE-COMPLETENESS-TRACKER.md) and all v1–v16 artifacts remain unchanged by this additive tracker.
- Execution topology bound to the isolated worktree and branch recorded in the header at exact v16 SHA `01d1f054a12773e07f91096b8d76b0c5f4064329`.
- The intended destination `origin/codex/prototype-completeness-v17-v35` is recorded, but the remote branch does not yet exist and no push is claimed.
- The separate live GitHub v01–v16 program is explicitly non-repurposed and no GitHub mutation is authorized or claimed by this record.
- The 19-package register and exhaustive 41-row inventory are initialized `Queued`/`Open`; all P/D/C/I/Q/F gates are `—`.
- V17 is the first package. It may move to `PM in progress` only when active Product acceptance work begins; it may move to implementation only after P, D, and C are `A`.
- No implementation, QA, commit, push, GitHub mutation, deployment, or production result is claimed by tracker initialization.

### 2026-08-19 — v17 — PVA-012 Atomic Redating — implementation started

- Baseline full SHA: `01d1f054a12773e07f91096b8d76b0c5f4064329`.
- Worktree and branch identity: the isolated execution worktree and `codex/prototype-completeness-v17-v35` branch recorded in the tracker header.
- Product Manager / P gate: **A** — exact item/date/original-timestamp, two-day consequence, failure/unknown/success, privacy, and proof-boundary acceptance recorded in [the v17 Council decision](../prototypes/v17/COUNCIL-v17.md).
- UI/UX Designer / D gate: **A** — dedicated task workspace, two equal consequence cards, responsive stack, focus/status/target/type/theme rules, and the rejected modal alternative recorded in the same decision.
- Project Manager / Council / C gate: **A** — additive implementation approved; frozen v16 and the separate live GitHub v01–v16 program remain outside mutation scope.
- Implementing agent / I gate: **A** — exact additive runtime/application/style/index/guide/check/evidence-helper bytes and eight current-run PNG/JSON pairs are held; no frozen byte changed.
- Candidate identity and exact roster: UI/tool aggregate `8c415a7b17d4d1bed286a54c2f6b34fb109c484acf96ffe927695d98a3e5dd1b`; Product/Design/Council/fixture authority aggregate `ef88df173aa213f3573ebb0da065c382bb19b7761af175437c1b1865a5a6bdaa`; complete roster and hashes in `docs/prototypes/v17/CANDIDATE-MANIFEST-v17.md`.
- Evidence roster and aggregate: eight final PNGs plus eight JSON sidecars, all captured after final UI bytes and inspected at original size; ordered aggregate `e30e9fe46e0a947c482b4ce963f0e5b9b663f7b5bff56acdc59fed68cf98b8ee`.
- Independent QA agent / Q gate: fresh read-only `/root/qa_v17`; **IP** only after the exact candidate manifest is sealed and assigned.
- Verdict and Critical/High/Medium/Low counts: Pending.
- Lower-severity finding dispositions: Pending.
- Limitations and proof boundary: deterministic synthetic browser-memory representation only; no backend atomicity, persistence, provider, security, deployment, native zoom, formal accessibility conformance, or production claim.
- Implementation/evidence commit: Pending.
- Freeze commit: Pending.
- Tracker commit: Pending.
- Explicit push destination and result: Pending; no v17 push claimed.
- Remote head and blob readback: Pending.
- Frozen/archive/main/unrelated-work guards: all twelve v16/package hashes pass at candidate hold; archive/main/maintained-checkout/remote parity remains a freeze-gate check.
- Requirement rows closed: None until QA Pass, freeze, push, and readback.
- Remaining blockers: independent QA Pass, lower-severity disposition if any, three-commit freeze sequence, explicit push, and remote readback.
- Next action: assign `/root/qa_v17` read-only to the exact sealed manifest and evidence.
- Package status / F gate: `QA in progress`; `Q=IP`; `F=—`.

### 2026-08-19 — v17 — PVA-012 Atomic Redating — QA Round 1 failed; repair in progress

- Baseline full SHA: `01d1f054a12773e07f91096b8d76b0c5f4064329`.
- Worktree and branch identity: the isolated execution worktree and `codex/prototype-completeness-v17-v35` branch recorded in the tracker header.
- Product Manager / P gate: **A** remains the acceptance authority. Product accepted all five QA findings and requires all five to be fixed in v17; no deferral was approved.
- UI/UX Designer / D gate: **A** remains the experience authority. Design accepted all five QA findings and requires all five to be fixed in v17; no deferral was approved.
- Project Manager / Council / C gate: **A** remains the approved contract; it does not waive failed implementation behavior. Project disposition is repair the same v17 package, recapture affected evidence, reseal, and rerun fresh independent QA from zero.
- Implementing agent / I gate: returned to **IP**. Round 1 exposed two High and three Medium contract failures; the held candidate is invalidated for freeze/publication and repair is in progress.
- Candidate identity and exact roster: Round 1 held manifest SHA-256 `51f8e49fe588c139d3c542da22833cf9dd2bd840cdac39fe7b6ab1efde570466`; 29-file held aggregate SHA-256 `14abca5efb18c2887fb4790a481abe26acafc9674317d6d20a45f093f75e6bbe`. Final unchanged rehash completed at `2026-08-19T13:28:50+05:30`.
- Evidence roster and aggregate: the eight held PNGs plus eight JSON sidecars were internally consistent and their chronology/hash checks passed, but they do not cure the failed live behaviors. Affected evidence must be recaptured after repair and represented by the next exact manifest.
- Independent QA agent / Q gate: fresh read-only `/root/qa_v17`; Round 1 **F**.
- Verdict and Critical/High/Medium/Low counts: **FAIL — C0/H2/M3/L0**. Full record: [v17 independent design QA Round 1](../prototypes/v17/DESIGN-QA-v17-round1.md).
- Findings: **H1**, inherited actions opened the fixed Monsoon fixture rather than exact `evening-rain.txt`, `Market morning`, and Daily Photo context, later openings retained stale `1 effect / 1 event` success state, and initial focus missed the `h1`; **H2**, the fixed launcher occluded the frozen **Populated archive** control at `1280×720`; **M1**, the proof console visually preceded the task at `960`, `568×320`, `390`, and `320`; **M2**, an empty date left the operation/fixture state as Ready and lost date-field focus; **M3**, pre-intent Cancel from the inherited `2026-08-16` item reset to the fixed `2026-08-17` fixture and stayed in v17 instead of returning to the exact invoker.
- Lower-severity finding dispositions: all three Medium findings are `Fixed required`; Product and Design accepted none and deferred none. Both High findings are also mandatory repair blockers.
- Passing checks: exact held hashes and eight-image chronology; syntax, package check, frozen guards, and diff inspection; ten fixtures and five natural zero-or-one outcomes; retry/status/competing/duplicate/day-link/timestamp/two-day paths; no horizontal overflow at `1440`, `960`, `568`, `390`, and `320`; sampled target/type/contrast/forced-colors/reduced-motion checks; URL/title/history/storage/IndexedDB/cache/service-worker/network/console privacy; direct v16 and stale-copy correction; and tested Escape/focus-return paths outside the failed Cancel case.
- Limitations and proof boundary: no native zoom, real assistive-technology session, or reliable browser-default Enter/Space synthesis; no backend, persistence, provider, security, deployment, production-privacy, accessibility-conformance, or production-readiness proof.
- Implementation/evidence commit: Pending; the failed candidate is not eligible for commit as a passing implementation/evidence freeze.
- Freeze commit: Pending; blocked by repair, reseal, and fresh QA Pass.
- Tracker commit: Pending.
- Explicit push destination and result: Pending; no v17 push claimed and no push is permitted from this failed round.
- Remote head and blob readback: Pending.
- Frozen/archive/main/unrelated-work guards: frozen archive/base remains `01d1f054a12773e07f91096b8d76b0c5f4064329`. The observed `origin/main` reference is now `9cfa841257363c28cb76c0d7feed2ae3a37a5023`, external drift from the initialization snapshot with no attribution made here; it remains outside v17 mutation scope.
- Requirement rows closed: None. `LID-SCP-002`, `LID-SRC-003`, and the redating portion of `LID-SRC-004` remain `Open`.
- Remaining blockers: repair all five findings; regenerate affected evidence after final bytes; create a new exact candidate manifest; obtain a fresh independent QA Pass with `C=0` and `H=0`; then complete the implementation/evidence, freeze, tracker, explicit push, and remote-readback gates.
- Next action: finish the same-version v17 repair and reseal. Do not begin v18.
- Package status / F gate: `Repair in progress`; `I=IP`; `Q=F` for Round 1; `F=—`.

### 2026-08-19 — v17 — PVA-012 Atomic Redating — pre-QA Product and Design recheck failed

- Baseline full SHA: `01d1f054a12773e07f91096b8d76b0c5f4064329`.
- Worktree and branch identity: the isolated execution worktree and `codex/prototype-completeness-v17-v35` branch recorded in the tracker header.
- Product Manager / P gate: **F for current readiness**. All five Round 1 repairs passed, but Product cannot accept the compact inactive launcher because the frozen `.prototype-banner` covers its center at both `320 px` and `390 px`; only `43.5 px` remains exposed below the banner.
- UI/UX Designer / D gate: **F for current readiness**. In addition to the compact launcher failure, the Current day and Destination day cards remain side by side at `960 px` and `1000 px`, contrary to the required below-`1024 px` stacked reading order.
- Project Manager / Council / C gate: **A** remains the approved contract, not an implementation waiver. Project disposition is repair both newly found blockers in the same v17 package, recapture affected evidence, recheck Product and Design, reseal, and obtain fresh independent QA from zero.
- Implementing agent / I gate: **IP**. The repaired working bytes are not eligible for hold while either current readiness finding remains.
- Candidate identity and exact roster: no current candidate manifest exists. The Round 1 manifest SHA-256 `51f8e49fe588c139d3c542da22833cf9dd2bd840cdac39fe7b6ab1efde570466` and held aggregate `14abca5efb18c2887fb4790a481abe26acafc9674317d6d20a45f093f75e6bbe` are obsolete pre-repair identities and must not be reused.
- Evidence roster and aggregate: eight post-repair PNGs and eight JSON sidecars were recaptured with ordered aggregate SHA-256 `ff76d4442c2f1b66c5633904976e59d4219f6c20fecd22deffbd94a0f42b7ef5`. Their recorded checks passed, but the set does not cover the inactive launcher in the frozen archive and predates the additional required repairs.
- Independent QA agent / Q gate: no Round 2 agent run or verdict exists. `Q=F` continues to denote the historical Round 1 result only.
- Verdict and Critical/High/Medium/Low counts: Product/Design pre-QA recheck **FAIL** with one High compact inactive-launcher occlusion and one Medium responsive card-layout finding. These are readiness findings, not an independent-QA Round 2 severity ledger.
- Lower-severity finding dispositions: the five Round 1 findings passed repair recheck. The new Medium responsive finding requires repair; Product and Design accepted or deferred nothing.
- Finding geometry: at `320 px` and `390 px`, the launcher is approximately `y=20–109.5`; the frozen `.prototype-banner` is `y=0–66` at `z-index: 700`; a launcher-center hit test resolves to the banner. At `960 px` and `1000 px`, both consequence cards remain in parallel columns.
- Durable recheck record: [v17 Product and Design pre-QA recheck](../prototypes/v17/PRODUCT-DESIGN-RECHECK-v17.md).
- Limitations and proof boundary: this recheck establishes only deterministic synthetic frontend observations at the named viewports. It is not independent QA and proves no backend atomicity, persistence, provider, security, deployment, native zoom, assistive-technology, accessibility-conformance, or production behavior.
- Implementation/evidence commit: Pending; current bytes are not sealed or eligible for a passing implementation/evidence commit.
- Freeze commit: Pending; blocked by repair, complete recapture, reseal, and fresh QA Pass.
- Tracker commit: Pending.
- Explicit push destination and result: Pending; no v17 push claimed or permitted from this state.
- Remote head and blob readback: Pending.
- Frozen/archive/main/unrelated-work guards: no change to the frozen v16 authority is claimed by this recheck; full guard validation remains required at reseal and freeze.
- Requirement rows closed: None. `LID-SCP-002`, `LID-SRC-003`, and the redating portion of `LID-SRC-004` remain `Open`.
- Remaining blockers: repair compact launcher occlusion and below-`1024 px` consequence-card layout; recapture affected evidence after final bytes; obtain `P=A` and `D=A`; create a new exact manifest; obtain fresh independent QA Pass; then complete freeze, explicit push, and remote readback.
- Next action: repair and recheck the same v17 package. Do not start v18.
- Package status / F gate: `Repair in progress`; `P=F`; `D=F`; `I=IP`; `Q=F` for Round 1 only; `F=—`.

### 2026-08-19 — v17 — PVA-012 Atomic Redating — final pre-QA Product and Design acceptance

- Baseline full SHA: `01d1f054a12773e07f91096b8d76b0c5f4064329`.
- Worktree and branch identity: the isolated execution worktree and `codex/prototype-completeness-v17-v35` branch recorded in the tracker header.
- Product Manager / P gate: **A** after a fresh final readiness review with **C0/H0/M0/L0**. Product accepted the repaired compact launcher and responsive consequence order without changing Atomic Redating meaning or its proof boundary.
- UI/UX Designer / D gate: **A** after a fresh final readiness review with **C0/H0/M0/L0**. Design accepted launcher visibility/hit testing, below-`1024 px` day-card order, target/focus behavior, and the final contrast repair.
- Project Manager / Council / C gate: **A** remains the approved contract. Project disposition advances only to replacement-manifest preparation and fresh independent QA Round 2; no freeze or successor-version work is authorized.
- Implementing agent / I gate: **A** for the final repaired working bytes. The compact launcher and consequence-card blockers are repaired; the later light-theme contrast finding was repaired before the final recapture.
- Candidate identity and exact roster: the current seven-asset UI/tool aggregate is `e4bfec90d9a7aa56f8d2a437c23edbd24fa6c229c10c7d7b78250ba82571ed49`. The final `styles-v17.css` SHA-256 is `dbebc3b92af0fca95fd1f61fcfbe308c320a30df798ff2e2801210f80dddade2`. The Round 1 manifest `51f8e49fe588c139d3c542da22833cf9dd2bd840cdac39fe7b6ab1efde570466` and 29-file held aggregate `14abca5efb18c2887fb4790a481abe26acafc9674317d6d20a45f093f75e6bbe` are obsolete historical identities and will be replaced before Round 2.
- Evidence roster and aggregate: ten final PNG/JSON pairs — eight active feature states plus archive-launcher frames at `390×844` and `320×900` — were captured after the final CSS bytes. The ordered 20-file aggregate is `2b8307f01db583cab9ed324dfc852e6a44a907a28754f3ad4ffc2ac16c5ae296`.
- Exact authority identity: Product Acceptance `9833512ed8dc7358630487cda208c31f7867f4fb1f0bf43ca6a7171044351a84`; UX Contract `d6a505ba6ec137af1bc43d5986c1551a8b5c29e85122ae5ba0adbc24c9182cf6`; v17 Council `632691dce8d7964944374dc821221ffcf63f4e7b207c8573b81ecd9cec868ec7`; Atomic Redating fixtures `7f4dfe0f80eedcc150d2a4e1a87ea7264d670d92bdff3de0b5eadd0fde3c443f`; sorted-record authority aggregate `5fd6262e41245421b8e2ee8a11e6a7f88175a2ae5a917c0be060326c4e54f32e`.
- Repair sequence: first, launcher placement was moved clear of the compact frozen banner and consequence cards were stacked at the `1020 px` breakpoint. A fresh Design review then found one new Medium contrast failure: `#727d76` measured `4.2068:1`. The token was repaired to `#6b766e`, measured `4.650835:1`, and the complete ten-pair evidence set was recaptured.
- Independent QA agent / Q gate: `Q=F` denotes independent QA Round 1 only. A fresh Round 2 assignee and run are pending; no Round 2 verdict exists.
- Verdict and Critical/High/Medium/Low counts: historical Round 1 **FAIL — C0/H2/M3/L0**; final Product readiness **PASS — C0/H0/M0/L0**; final Design readiness **PASS — C0/H0/M0/L0**. Product/Design readiness is not independent QA.
- Lower-severity finding dispositions: every Round 1 Medium and each later pre-QA readiness finding is fixed in the current working bytes; none was accepted or deferred. Fresh independent QA may still identify findings and owns its own ledger.
- Durable recheck record: [v17 Product and Design pre-QA recheck](../prototypes/v17/PRODUCT-DESIGN-RECHECK-v17.md), including the preserved failed recheck and superseding final acceptance.
- Limitations and proof boundary: deterministic synthetic frontend observations only. No backend atomicity, persistence, transactionality, concurrency, idempotency, restart recovery, provider behavior, authentication, authorization, encryption, deployment, native zoom, real assistive-technology behavior, formal accessibility conformance, production privacy, or production readiness is established.
- Implementation/evidence commit: Pending; current bytes are not yet sealed by a replacement exact manifest or judged by Round 2.
- Freeze commit: Pending; blocked by replacement-manifest seal and fresh independent QA Pass.
- Tracker commit: Pending.
- Explicit push destination and result: Pending; no v17 push is claimed or permitted yet.
- Remote head and blob readback: Pending.
- Frozen/archive/main/unrelated-work guards: `node prototypes/calendar-ui/check-v17.mjs` passes twelve frozen hashes, seven additive assets, ten fixtures, and the privacy/static contract. Full archive/main/maintained-checkout/remote guards remain required at freeze.
- Requirement rows closed: None. `LID-SCP-002`, `LID-SRC-003`, and the redating portion of `LID-SRC-004` remain `Open` until independent QA Pass, freeze, explicit push, and remote readback.
- Remaining blockers: create and validate the replacement exact candidate manifest; assign a fresh read-only QA agent; obtain Round 2 Pass and disposition any lower-severity findings; complete the required commit, push, and readback sequence.
- Next action: replace the obsolete Round 1 manifest with the exact final candidate identity, then begin fresh independent QA Round 2. Do not start v18.
- Package status / F gate: `Held candidate preparation`; `P=A`; `D=A`; `C=A`; `I=A`; `Q=F` for Round 1 with fresh Round 2 pending; `F=—`.

### 2026-08-19 — v17 — PVA-012 Atomic Redating — completed locally; publication pending

- Baseline full SHA: `01d1f054a12773e07f91096b8d76b0c5f4064329`.
- Worktree and branch identity: the isolated execution worktree and `codex/prototype-completeness-v17-v35` branch recorded in the tracker header.
- Product Manager / P gate: **A locally** — the final accepted Atomic Redating meaning and bounded closure remain unchanged.
- UI/UX Designer / D gate: **A locally** — the repaired experience contract passed final readiness review and Round 2 found no design defect.
- Project Manager / Council / C gate: **A locally** — the exact local commit chain is accepted for publication; no v18 start is authorized before remote push/readback.
- Implementing agent / I gate: **A locally** — the exact independently tested candidate is committed at `571308f678ba92a159b95b5093c68ee4b283fe4a`.
- Candidate identity and exact roster: replacement candidate manifest SHA-256 `6405f86c8074d142dc6f2d120549e34db69e7c97b0d92288657f5104717fa471`; exact 35-file aggregate SHA-256 `e7fe4250510958c155726753ba8247be594e8592d03a690282ab4f59da5bc2ec`. The implementation commit reproduces every manifest-listed blob, the aggregate, and the manifest self-hash.
- Evidence roster and aggregate: ten final PNG/JSON pairs remain the accepted Round 2 set; ordered 20-file aggregate SHA-256 `2b8307f01db583cab9ed324dfc852e6a44a907a28754f3ad4ffc2ac16c5ae296`.
- Independent QA agent / Q gate: fresh read-only `/root/qa_v17_round2`; **A locally**.
- Verdict and Critical/High/Medium/Low counts: Round 2 **PASS — C0/H0/M0/L0**. Historical Round 1 remains **FAIL — C0/H2/M3/L0** and is not erased or reclassified.
- Lower-severity finding dispositions: every Round 1 and later readiness finding was fixed before reseal; none was accepted or deferred. Round 2 reported no Medium or Low finding requiring disposition.
- Durable QA and handoff identities: Round 2 QA record SHA-256 `aa6a07778f0e686742d2d8526ca6bba72a7a076d7be1406a5cf36605d4f5108a`; current documentation-only handoff SHA-256 `5a7f58e1470a6f81e29b264b21750910d17b0337324a6e90dae7a37dd88def31`.
- Limitations and proof boundary: deterministic synthetic frontend representation only. Round 2 did not verify native browser/page zoom, a real screen-reader or assistive-technology session, mobile operating systems/browsers, or formal accessibility conformance, and it proves no backend atomicity or durability, persistence, rollback, restart recovery, concurrency, cross-process idempotency, provider/VoiceNotes behavior, authentication, authorization, encryption, production privacy/security, deployment, operations, or production readiness.
- Implementation/evidence commit: `571308f678ba92a159b95b5093c68ee4b283fe4a`.
- Freeze commit: documentation-only QA/handoff successor `6c6fe10b2fa575447704ca94f319c258f480999c`; it changes no tested candidate byte.
- Tracker commit: Pending; this append-only local-completion record is the tracker-only successor awaiting commit.
- Explicit push destination and result: `origin/codex/prototype-completeness-v17-v35`; **Pending**. No remote publication is claimed.
- Remote head and blob readback: **Pending**. `F=A locally` records only the completed local freeze chain; it is not remote `Complete`.
- Frozen/archive/main/unrelated-work guards: the accepted manifest and committed-blob comparison preserve the exact v16 baseline and tested candidate identity. Remote/archive/main/unrelated-work checks remain mandatory at publication readback.
- Requirement rows closed: exactly `LID-SCP-002`, `LID-SRC-003`, and the redating portion of `LID-SRC-004`, bounded to the synthetic frontend prototype. Program arithmetic is now 19/57 prototype-representable rows closed locally and 38/57 open.
- Remaining blockers: tracker-only successor commit, explicit branch push, remote-head parity, immutable committed-blob readback, and final v17 publication disposition.
- Next action: commit this tracker-only successor, push the complete v17 chain explicitly, and verify remote head/blob parity. Do not start v18 until that readback passes.
- Package status / F gate: `Completed locally`; `P=A`; `D=A`; `C=A`; `I=A`; `Q=A`; `F=A (local)`; remote publication/readback pending. Eighteen packages, v18–v35, remain `Queued`.

### 2026-08-19 — v17 — PVA-012 Atomic Redating — first publication/readback passed; tracker successor pending

- Readback timestamp: `2026-08-19T15:49:30+05:30` (`Asia/Kolkata`).
- Publication branch: local `codex/prototype-completeness-v17-v35` pushed explicitly to `origin/codex/prototype-completeness-v17-v35`.
- First pushed chain: exact independently tested candidate/evidence commit `571308f678ba92a159b95b5093c68ee4b283fe4a`; documentation-only Round 2 QA/handoff commit `6c6fe10b2fa575447704ca94f319c258f480999c`; local-close tracker commit `812697246203dcfdaf10f022621b70a84ed30b8c`.
- Remote equality: local `HEAD` resolved to `812697246203dcfdaf10f022621b70a84ed30b8c`, and `git ls-remote --heads origin refs/heads/codex/prototype-completeness-v17-v35` returned the same full SHA with zero mismatch.
- Published evidence disposition: the remote branch now contains the exact v17 candidate at `571308f…`, the QA/freeze documentation successor at `6c6fe10…`, and the local-close tracker record at `8126972…`. This is branch publication only; no `main` merge or mutation is performed or claimed.
- GitHub governance disposition: no issue, Project field, view, milestone, relationship, status, label, or comment mutation is performed or claimed by this publication/readback record.
- Requirement arithmetic: exactly **19/57 closed and 38/57 open** remains unchanged; exactly **18 packages, v18–v35, remain `Queued`**.
- Final publication condition: this new tracker-only successor must itself be committed, pushed to the exact branch, and read back with local/remote SHA equality. Until that succeeds, `F=IP`, v17 remains `Freeze/publish in progress`, and the v18 Product, Design, Council, and implementation gates may not open.
- Next action: commit only this tracker successor, push it explicitly to `origin/codex/prototype-completeness-v17-v35`, and verify exact remote-head readback before changing v17 to `Complete` or starting v18.

### 2026-08-19 — v17 — PVA-012 Atomic Redating — Complete

- Completion timestamp: `2026-08-19T15:52:15+05:30` (`Asia/Kolkata`).
- Baseline full SHA: `01d1f054a12773e07f91096b8d76b0c5f4064329`.
- Worktree and branch identity: the isolated execution worktree and `codex/prototype-completeness-v17-v35` branch recorded in the tracker header.
- Product Manager / P gate: **A** — the final accepted Atomic Redating meaning and bounded closure remain unchanged.
- UI/UX Designer / D gate: **A** — the repaired experience contract passed final readiness review and independent QA Round 2.
- Project Manager / Council / C gate: **A** — the exact accepted chain is published on the intended remote branch; v17 does not authorize or claim any mutation outside that branch.
- Implementing agent / I gate: **A** — exact independently tested candidate/evidence commit `571308f678ba92a159b95b5093c68ee4b283fe4a` is present in the published chain.
- Candidate identity and exact roster: accepted Round 2 manifest SHA-256 `6405f86c8074d142dc6f2d120549e34db69e7c97b0d92288657f5104717fa471`; exact 35-file aggregate SHA-256 `e7fe4250510958c155726753ba8247be594e8592d03a690282ab4f59da5bc2ec`.
- Evidence roster and aggregate: ten final PNG/JSON pairs; ordered 20-file aggregate SHA-256 `2b8307f01db583cab9ed324dfc852e6a44a907a28754f3ad4ffc2ac16c5ae296`.
- Independent QA agent / Q gate: fresh read-only `/root/qa_v17_round2`; **A**.
- Verdict and Critical/High/Medium/Low counts: Round 2 **PASS — C0/H0/M0/L0**. Historical Round 1 remains **FAIL — C0/H2/M3/L0** and is preserved as rejected history.
- Lower-severity finding dispositions: every Round 1 and later readiness finding was fixed before reseal; none was accepted or deferred; Round 2 reported no Medium or Low finding.
- Limitations and proof boundary: deterministic synthetic frontend representation only. This result does not prove backend atomicity or durability, persistence, rollback, restart recovery, concurrency, cross-process idempotency, provider or VoiceNotes behavior, authentication, authorization, encryption, deployment, operations, native zoom, real assistive-technology behavior, formal accessibility conformance, production privacy/security, or production readiness.
- Implementation/evidence commit: `571308f678ba92a159b95b5093c68ee4b283fe4a`.
- Freeze commit: documentation-only QA/handoff successor `6c6fe10b2fa575447704ca94f319c258f480999c`; it changes no tested candidate byte.
- Tracker commits already published: local-close record `812697246203dcfdaf10f022621b70a84ed30b8c`; publication-receipt successor `626f7aedd636d2291d009de654a7ac00b21cb085`.
- Explicit push destination and result: `origin/codex/prototype-completeness-v17-v35`; the four-commit v17 chain was pushed successfully.
- Remote head and blob readback: second publication/readback passed with local `HEAD` and `refs/heads/codex/prototype-completeness-v17-v35` both equal to `626f7aedd636d2291d009de654a7ac00b21cb085`, with the candidate, QA/freeze documentation, local-close record, and publication receipt reachable in order.
- Frozen/archive/main/unrelated-work guards: no maintained-checkout, frozen v1–v16, `main`, GitHub issue, Project field, view, milestone, relationship, status, label, or comment mutation was performed or claimed.
- Requirement rows closed: exactly `LID-SCP-002`, `LID-SRC-003`, and the redating portion of `LID-SRC-004`, bounded to the synthetic frontend prototype. Program arithmetic is **19/57 closed and 38/57 open**.
- Remaining package queue: exactly **18 packages, v18–v35, remain `Queued`**.
- Completion-update publication handling: this append-only completion-status update will be committed and pushed by the root agent. The root agent will verify the resulting local/remote SHA equality externally before beginning v18 work; that final operational verification does not require another recursively self-referential tracker receipt.
- Next action: after that external equality check passes, v18 may move from `Queued` to its Product gate. No v18 work begins before the check.
- Package status / F gate: `Complete`; `P=A`; `D=A`; `C=A`; `I=A`; `Q=A`; `F=A`.

### 2026-08-19 — v18 — PVA-013 History and Provenance — Product and Design preparation opened

- Predecessor gate: the root agent externally verified local `HEAD` and `origin/codex/prototype-completeness-v17-v35` equality at v17's self-reference-free completion-status successor `8d94a61be8a7e7d6114b3a3b5b3963f23421e445` before opening v18.
- Baseline and immutable predecessor: v16 remains frozen at `01d1f054a12773e07f91096b8d76b0c5f4064329`; every accepted v17 implementation, authority, fixture, evidence, QA, handoff, and tracker-history byte remains immutable.
- Project Manager preparation: **IP**. The exact additive roster, guard matrix, Council decision queue, fixture/evidence plan, independent-QA requirements, and per-version commit/push/readback gates are recorded in [the v18 package plan](../prototypes/v18/PACKAGE-PLAN-v18.md).
- Product Manager / P gate: **IP**. Product must freeze exact observable acceptance for `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004`; treat `LID-SRC-004` retained-history/source-binding behavior as supporting regression only; and preserve `LID-VN-005` as Outside UI.
- UI/UX Designer / D gate: **IP**. Design must freeze the reusable History route, five context entry/return paths, Source/Derived lanes, chronology/load behavior, exact copy, focus, responsive, accessibility, privacy, and evidence contracts, including at least two viable approaches for the highest-risk interaction.
- Project Manager / Council / C gate: **—**. Council has not reviewed or approved a shared fixture-exact contract. Implementation is prohibited until Product and Design are `A` and the three-role Council records `C=A`.
- Implementing agent / I gate: **—**. No v18 prototype, implementation self-check, capture, held manifest, or implementation claim exists.
- Independent QA / Q gate: **—**. No v18 candidate is held and no QA agent is assigned; the future QA agent must be fresh and read-only.
- Freeze, push, and readback / F gate: **—**. No v18 commit, push, remote readback, or successor release is claimed.
- Counting boundary: exactly three unique primary rows belong to v18 — `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004`. All remain `Open`. `LID-SRC-004` is a non-counted supporting regression already counted in v17's bounded redating closure. `LID-VN-005` remains `Requires external evidence` and is not closable by prototype.
- Program arithmetic: **19/57 closed and 38/57 open** remains unchanged. V18 is active in preparation; exactly **17 packages, v19–v35, remain `Queued`**.
- GitHub and repository boundary: this preparation changes no frozen prototype, `main`, maintained checkout, GitHub issue, Project field, view, milestone, relationship, status, label, or comment. Publication remains limited to the exact branch after all gates pass.
- Next action: Product and Design complete their v18 contracts; Project reconciles them into `COUNCIL-v18.md` and `HISTORY-PROVENANCE-FIXTURES-v18.md`; only an approved `P=A`, `D=A`, `C=A` contract may release implementation.
- Package status / gates: `PM in progress`; `P=IP`; `D=IP`; `C=—`; `I=—`; `Q=—`; `F=—`.

### 2026-08-19 — v18 — PVA-013 History and Provenance — Council approved; implementation released

- Predecessor and repository gate: v17 remains `Complete` and externally read back at `8d94a61be8a7e7d6114b3a3b5b3963f23421e445`; v16 remains frozen at `01d1f054a12773e07f91096b8d76b0c5f4064329`. No v1–v17, package/server, maintained-checkout, `main`, GitHub issue, or Project object mutation is approved.
- Product Manager / P gate: **A**. Product accepts exactly `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` as the three v18 primary rows; read-only five-context History, the exact E01–E17 corpus, authentic/derived separation, retained upstream lifecycle, and proof boundaries are fixed.
- UI/UX Designer / D gate: **A**. Design accepts Approach C — Source-first then Derived stacked ordered lists in one page scroll — with the exact entry/return, filter, pagination, content-continuity, responsive, accessibility, privacy, and 16-frame evidence contracts.
- Project Manager / Council / C gate: **A**. All Product/Design/Project and cross-review conflicts are explicitly resolved in [the v18 Council decision](../prototypes/v18/COUNCIL-v18.md); no residual choice requires Arun.
- Exact reviewed authority hashes: Product `5f61d200c29ce9d7e9a531d5f2f30d1c8e6a6170f9beb41780e7bc4636cfbd70`; Design `e42c9c4613e9d46389585bca4f6f736dacdcb234980bc4dba4e7de12ac3aaad3`; Project plan `9da154f0ee0e3bb4ad611d46064d1ebb01044840de8f52b8aee438d3fcacdd21`; Council `1b980cc030a70b3222f6d68747df03a56cbe691a809d932ac285da24e626a859`; fixtures `6290dab8a806a69e955c6df09f5d2cda5f0696fff587159389441bc5f58562ec`.
- Fixture authority: exactly 14 top-level Product fixtures and exactly 17 accepted events. Frozen v17 controls `E10` at `19 Aug 2026, 10:00 am IST`; Source order begins `E10`; hidden day is separately `11 Aug 2026` with the exact Calendar/Almanac banner; upstream deletion leaves the local 17 Aug Source Item live.
- Reconciled state meaning: E07 is Current + Protected Field + Stale; Artwork version 2 is Historical + Stale after E10 while E09 retains the earlier Active-selection fact; Correction removal is absent; event sequence and record lineage are distinct; external VoiceNotes evidence remains required.
- Interaction authority: exact five-filter model with inline compact `<details>`; no filter modal; independent Source/Derived load-earlier transitions add exactly three once; source prose appears only in Day/Item Current source context; all History interactions remain zero-mutation.
- Evidence and QA authority: exactly 16 current-run PNG/JSON pairs after final bytes, plus live status-unavailable, pagination, filtered-empty, long-metadata, entry/Back, lineage, privacy, and inherited-v17 branches. The pre-QA candidate manifest excludes the future independent-QA report and all post-verdict records.
- Implementing agent / I gate: **IP**. Implementation is released against the exact approved Council and fixture records; no implementation acceptance, held manifest, evidence completion, or candidate fingerprint is claimed by this Council transition.
- Independent QA / Q gate: **—**. A fresh read-only agent is assigned only after exact candidate hold; any held-byte change invalidates the run.
- Freeze, push, and readback / F gate: **—**. No v18 commit, push, remote readback, or completion is claimed.
- Counting boundary: `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` remain `Open`; `LID-SRC-004` is non-counted inherited regression; `LID-SCP-004` remains v19; `LID-VN-005` remains `Requires external evidence`; no `LID-HIS-*` exists.
- Program arithmetic: **19/57 closed and 38/57 open** remains unchanged. Exactly **17 packages, v19–v35, remain `Queued`**.
- Next action: implement only the approved additive roster; run exact self-checks; capture and inspect all 16 final-byte evidence pairs; seal an exact pre-QA manifest that excludes post-QA records; then assign a fresh independent v18 QA agent.
- Package status / gates: `Implementation in progress`; `P=A`; `D=A`; `C=A`; `I=IP`; `Q=—`; `F=—`.

### 2026-08-19 — v18 — PVA-013 History and Provenance — append-only pre-hold capture-path clarification

- Trigger and timing: before candidate hold, read-only inspection proved the frozen v17 capture CLI could select only manifest fixtures and could not truthfully drive the applied-filter or pagination-success branches required by frames 10 and 14. No QA run or evidence hold had started.
- Product Manager / P gate: **A retained**. Product accepts a separate two-scenario capture mechanism from fresh complete `global-ready`; product behavior, exact 17-event corpus, exact 14 fixtures, three closure targets, and proof boundary do not change.
- UI/UX Designer / D gate: **A retained**. Design accepts the exact visible-control filter recipe and Source-then-Derived pagination-success recipe, including disclosure, focus, anchor, announcements, beginning states, safe transcript, and fail-closed checks. No modal or hidden viewport-selected product state is introduced.
- Project Manager / Council / C gate: **A retained**. [Council amendment C18-18](../prototypes/v18/COUNCIL-v18.md) and [fixture-authority Section 13](../prototypes/v18/HISTORY-PROVENANCE-FIXTURES-v18.md) explicitly supersede only the earlier capture-tool mechanics; no residual choice requires Arun.
- Exact implementation/self-check roster: six additive files — `index-v18.html`, `app-v18.js`, `styles-v18.css`, `README-v18.md`, `check-v18.mjs`, and `capture-phase2-evidence-v18.mjs`.
- Capture authority: all 16 PNG/JSON pairs use the additive v18 driver. The frozen `capture-phase2-evidence-v17.mjs` remains unchanged and hash guarded at `860f01a5ea135d53650552c508a91f2c51ccf306b183e09486a3691e3afa3c37`.
- Manifest authority: `fixtures` remains exactly the ordered 14-key Product list; separate `captureScenarios` is exactly ordered `compact-filtered-open`, `pagination-both-success`; the arrays are disjoint and scenarios are not visible fixture-console keys.
- Privacy and truthfulness: scenarios are explicit allowlisted in-memory transition recipes, not URL/history/storage/viewport/theme state, arbitrary scripts, fixture aliases, source transformation, or selector side effects. Missing controls, transcript/state divergence, privacy residue, non-local requests, console/exception output, changed domain fingerprint or 0/0/0 counters, or failed invariants abort before evidence is written.
- Current reconciled authority hashes: Product `5f61d200c29ce9d7e9a531d5f2f30d1c8e6a6170f9beb41780e7bc4636cfbd70`; Design `e42c9c4613e9d46389585bca4f6f736dacdcb234980bc4dba4e7de12ac3aaad3`; Project plan `124f88d16f40f4deb7414ef7d0e3b48a15f99b166bb2e343bd8deae46cb816fd`; Council `0a9d09b75f647a2a9e9ed356957886e2b6a794c813fb425c73ffd82af83ef1c3`; fixtures `ab6d369930921d38f6a8d562c6f9e25f96a9f0980812d8402a6833252f126c79`.
- Deterministic five-authority aggregate: `ed35f464dadc182c10cec707425af4afe788d101b056debcc42edd4852dc6d17`, computed as SHA-256 over the five current `sha256  path` records sorted by repository-relative path.
- Change boundary: this clarification updates v18 authority and this living ledger before hold. It does not touch implementation/evidence/handoff bytes, stage, commit, push, mutate GitHub, close a row, or advance independent QA/freeze.
- Program arithmetic and queue: **19/57 closed and 38/57 open**; `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` remain `Open`; exactly **17 packages, v19–v35, remain `Queued`**.
- Next action: implementation reconciles the exact six-file roster and two capture scenarios, then runs self-checks and captures all 16 final-byte pairs before sealing the pre-QA manifest.
- Package status / gates: `Implementation in progress`; `P=A`; `D=A`; `C=A`; `I=IP`; `Q=—`; `F=—`.

### 2026-08-19 — v18 — PVA-013 History and Provenance — append-only Current source context and loading clarification

- Trigger and timing: before candidate hold, Product and Design separately approved an owner-scoped Current source context mapping and a deterministic accessibility tree for the canonical top-level `loading` fixture. No v18 evidence or independent-QA run had started.
- Product Manager / P gate: **A retained, contract only**. [Product amendment Section 15](../prototypes/v18/PRODUCT-ACCEPTANCE-v18.md) freezes exact revised-versus-Correction prose ownership, revised-fixture truth, safe export, and initial-loading semantics without changing corpus, fixtures, rows, or claims.
- UI/UX Designer / D gate: **A retained, contract only**. [Design amendment Section 17](../prototypes/v18/UX-CONTRACT-v18.md) freezes placement, focus, named-lane busy semantics, Derived absence in the fresh top-level load, descendant continuity, and structured-output privacy.
- Project Manager / Council / C gate: **A retained**. [Council amendment C18-19](../prototypes/v18/COUNCIL-v18.md) and [fixture-authority Section 14](../prototypes/v18/HISTORY-PROVENANCE-FIXTURES-v18.md) reconcile the same exact mapping and loading tree; no choice remains for Arun.
- Safe export mapping: `sourceContextVariant` is exactly `revision-2`, `correction-1`, or `none`. `upstream-revised` and its in-scope Day/Item descendants use `revision-2`; every other Day/Item owner/descendant uses `correction-1`; every non-Day/Item scope uses `none` and renders no context region.
- Revised-fixture truth: Source `E04,E01`; R1→R2; Revision 2 is Displayed + Current upstream + Revised upstream; Revision 1 is Historical; Derived count 0; no Correction, R3, conflict, Untagged, or Deleted content. The global corpus remains exactly E01–E17.
- Exact revised visible prose: **Fictional Revision 2 — Rain softened the path beneath the paper lanterns; the synthetic narrator counted three quiet puddles before walking home.** Every other Day/Item state retains the exact approved Correction 1 prose.
- Top-level loading truth: Global `loading` uses `sourceContextVariant=none`; **History & provenance** retains entry focus; the named **Source history** lane region alone has `aria-busy=true` and contains the static **Loading history** status with the existing exact body; Derived history is absent; no event/list/final count/prose placeholder is rendered. Earlier-page loading still leaves the other rendered lane unaffected.
- Privacy boundary: snapshots, summaries, JSON evidence, scenario transcripts, URL/history/storage, network, console/exceptions, and live regions expose only the safe variant token and never either prose string. PNG pixels may naturally show the visible Current source context.
- Package-plan disposition: `PACKAGE-PLAN-v18.md` required no edit because its current amended plan contains no conflicting source-prose mapping or generic-page busy requirement. Its approved six-file implementation/self-check and sixteen-pair evidence rosters remain unchanged.
- Current reconciled authority hashes: Product `1af1ff77e48a946f790f2353f9f9c999d115cd67c38e750f8a044bb5876a7cf4`; Design `fd7731c4cf4d0bc4c28d0078cbed7f305adc6bef51c1a0261d84c41f62bb2fb9`; Project plan `124f88d16f40f4deb7414ef7d0e3b48a15f99b166bb2e343bd8deae46cb816fd`; Council `28696807b365182e831a884b1cdd726287388f2bf2b4a1f149b308e08757a7ae`; fixtures `14085081ad6654476170725ac4d76ce2bd8311a3b5e1108ae0b67f28ec30c994`.
- Deterministic five-authority aggregate: `6e8ee014ac067eed40abc8cd70a48a063b1927871deb2b1645a39b9e998bf9f7`, computed as SHA-256 over the five current `sha256  path` records sorted by repository-relative path.
- Change boundary: this record covers authority and the living ledger only. It does not accept or edit implementation, evidence, handoff, manifest, package/server, frozen v1–v17, maintained-checkout, `main`, GitHub issue, Project, stage, commit, push, or remote state.
- Program arithmetic and queue: **19/57 closed and 38/57 open**; `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` remain `Open`; exactly **17 packages, v19–v35, remain `Queued`**.
- Next action: the active implementer reconciles the exact mapping, revised fixture, named Source-lane loading tree, checks, and post-final-byte evidence before any candidate hold or independent QA assignment.
- Package status / gates: `Implementation in progress`; `P=A`; `D=A`; `C=A`; `I=IP`; `Q=—`; `F=—`.

### 2026-08-19 — v18 — PVA-013 History and Provenance — final pre-hold disclosure, app-owned anchor, and OPFS clarification

- Trigger and timing: before candidate hold, Product and Design approved one final narrow authority amendment for deterministic frame-3 disclosure state, product-owned asynchronous pagination anchoring, and fail-closed OPFS proof. No v18 evidence or independent-QA run had started.
- Product Manager / P gate: **A retained, contract only**. [Product amendment Section 16](../prototypes/v18/PRODUCT-ACCEPTANCE-v18.md) freezes fresh fixture defaults, user-state preservation/reset, genuine-load anchor ownership, helper passivity, the exact frame-14 sequence, and strict OPFS evidence.
- UI/UX Designer / D gate: **A retained, contract only**. [Design amendment Section 18](../prototypes/v18/UX-CONTRACT-v18.md) freezes the native E12 disclosure order, initial h1/scroll/announcement state, exact selector behavior, stable logical targets, post-render one-pixel restoration, focus, generation matching, and one-time consumption.
- Project Manager / Council / C gate: **A retained**. [Project-plan Section 11](../prototypes/v18/PACKAGE-PLAN-v18.md), [Council amendment C18-20](../prototypes/v18/COUNCIL-v18.md), and [fixture-authority Section 15](../prototypes/v18/HISTORY-PROVENANCE-FIXTURES-v18.md) reconcile the same exact contract; no choice remains for Arun.
- Disclosure defaults: fresh `item-ready` has `openDisclosureKeys=['E12']`; each other top-level fixture has `[]`. E12 is a natively open `<details>` with **Event sequence** before **Record lineage**. Fresh item entry focuses **History for Monsoon walk note**, starts at `scrollX=0`, `scrollY=0`, and leaves the live region empty. User close/reopen state survives rerender and hidden-day return; reset restores the owning fixture default.
- Frame-3 proof: fixture `item-ready`, selector `[data-lid-v18-event-details="E12"]`, and `capture.scenario=null`. The helper first records entry state, then only scrolls already-open content; it never opens, dispatches, moves focus, or announces. The sidecar asserts only E12 is open and verifies native order plus entry focus/scroll/announcement.
- App-owned anchor: genuine visible Load activation captures the matching lane/generation baseline before pending at exact logical target `#lid-v18-load-source` or `#lid-v18-load-derived`. The baseline survives pending; a matching success/failure/interruption/duplicate terminal render restores within one CSS pixel, focuses the target, and consumes once. Stale, cross-lane, missing, or consumed records cannot move the page. Visible outcome controls and QA deliveries use one reducer/render/restoration path.
- Frame-14 proof: after fresh `global-ready` fixture setup, the scenario transcript has exactly five records: partial-page QA seed → actual Source Load → QA Source success → actual Derived Load → QA Derived success. Fixture setup is metadata, not a sixth scenario record. The helper only observes app-produced geometry/focus and performs no post-activation scrolling, focusing, DOM/CSS/layout change, or compensation.
- Strict OPFS proof: every one of the sixteen evidence invocations must record `browserState.opfs={supported:true,accessible:true,entryCount:0,errorName:null}`. Unsupported inspection, inaccessible root, failed enumeration, nonzero entries, or indeterminate values fail before PNG or JSON output.
- Cardinality and scope: exactly six implementation/self-check assets, fourteen ordered fixtures, two ordered disjoint capture scenarios, sixteen evidence pairs, seventeen represented events, and three open v18 closure rows remain unchanged. There is no new fixture, scenario, CLI option, corpus event, requirement ID, or closure.
- Current reconciled authority hashes: Product `a5373fad917df8e18c2485b96e4c4786a8ca72cf3c801c44144144189410047d`; Design `7e04a7e8b8a6e9be5148ae165270544cbca79e796fba01c20880a77673ebd1aa`; Project plan `abcd7c55c9d770f33cf36887810f79274ec1600be3e2e4f8c8854861fa3e2f4d`; Council `48ca06a61a02781e8601cc8599731ae2e30d018ebfe9085d481992099aaf9589`; fixtures `996fedca99ae4e8fd564f92d495f96c7c0767e89b8c3343faf9ef9d1ac4e32c0`.
- Deterministic five-authority aggregate: `70952a1f1b717a15ef2662380bf348b8fef9d0ee60d3bf489bdc520baf4e4449`, computed as SHA-256 over the five current `sha256  path` records sorted by repository-relative path.
- Change boundary: this record covers v18 authority and the living ledger only. It does not accept or edit implementation, evidence, handoff, manifest, package/server, frozen v1–v17, maintained checkout, `main`, GitHub issue or Project, stage, commit, push, or remote state.
- Program arithmetic and queue: **19/57 closed and 38/57 open**; `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` remain `Open`; exactly **17 packages, v19–v35, remain `Queued`**.
- Next action: the active implementer reconciles the disclosure defaults/preservation, app-owned anchor state machine, passive helper, exact five-record frame-14 transcript, strict OPFS proof, self-checks, and final-byte evidence before candidate hold or independent QA assignment.
- Package status / gates: `Implementation in progress`; `P=A`; `D=A`; `C=A`; `I=IP`; `Q=—`; `F=—`.

### 2026-08-20 — v18 — PVA-013 History and Provenance — final Product/Design pre-gate FAIL

- Durable verdict: [PRE-GATE-FAIL-v18.md](../prototypes/v18/PRE-GATE-FAIL-v18.md), SHA-256 `d24ca69d0130c9dc50543e693e110cb041921956e2369e4c5f5b6e3fd5416673`, records **PRE-GATE FAIL**. No P0; exactly one P1 / High blocker; one P2 defect; no other blocker.
- Gate chronology at verdict: `P=F`; `D=F`; the superseded entry contract was `C=F`; implementation remained unfrozen `I=IP`; independent QA and freeze had not started, `Q=—`, `F=—`.
- P1 / High — false contextual provenance: unrelated frozen-v16 2 Aug Journal Day, **Before sleep — synthetic fixture**, generated-field, and artwork controls were decorated/rewritten/injected and opened the fixed fictional 17 Aug 2026 / Monsoon walk note / Summary / Artwork version 2 fixtures. The visible inherited record did not own the presented history, invalidating `LID-REF-004` and `LID-SCP-003` truth.
- P2 — exact return: same-control focus returned, but measured old contextual scroll values were `1867→1785`, `1121→1073`, and `1087→1064`; artwork was within one CSS pixel and Settings/More were exact. The replacement must prove both `window.scrollY` and invoker viewport top within one pixel.
- Superseded working-byte hashes: index `fc0b2466be93334283aac7338a0c502de8840d2494c5f250489f8190c5aa96ec`; app `949389d7bb6b2d0071a223e3941a6d831d94c14fa53e78143329e0b444bea2d4`; CSS `c6895e33e0c14656318aa0923798b6641749b820199c0f85141ff810acb5e9c5`; README `a206d1ded18308030b2f2e8f1a7fc6bdbe8abc91d0f296a58b3c4651a79d387c`; checker `894a4b55f231076ea06d38c616a6ca64ac788f125fe818a575c8376448c7dc9f`; helper `ee0bb92b500540faaa36cc09f4cf2c05f176df9081a9789657e335e631114825`; path-sorted six-record aggregate `cca2b73673b95e454482ccbc1b11564be43ad269136a3b4bf005b19153d3ddf9`.
- Superseded authority hashes: Product `a5373fad917df8e18c2485b96e4c4786a8ca72cf3c801c44144144189410047d`; Design `7e04a7e8b8a6e9be5148ae165270544cbca79e796fba01c20880a77673ebd1aa`; Project plan `abcd7c55c9d770f33cf36887810f79274ec1600be3e2e4f8c8854861fa3e2f4d`; Council `48ca06a61a02781e8601cc8599731ae2e30d018ebfe9085d481992099aaf9589`; fixtures `996fedca99ae4e8fd564f92d495f96c7c0767e89b8c3343faf9ef9d1ac4e32c0`; historical aggregate `70952a1f1b717a15ef2662380bf348b8fef9d0ee60d3bf489bdc520baf4e4449`.
- Passing observations and limits: the exact 17-event/14-fixture/two-scenario state, filters, pagination branches, lifecycle isolation, hidden day, source context, privacy, 0/0/0, supporting/external boundaries, static v18/v17 checks, and a 30-check direct-v17 live regression otherwise passed. Producer-local capture reported sixteen pairs, but it was not independent QA.
- Candidate/evidence identity: no `CANDIDATE-MANIFEST-v18.md` and no repository v18 PNG/JSON evidence set existed. Therefore no candidate-manifest hash or 32-file evidence aggregate exists. Every producer-local capture from the failed fingerprint is invalidated and must be discarded rather than reused.
- Counting boundary: no row closed. Program arithmetic remained **19/57 closed and 38/57 open**; the same three v18 rows remained `Open`; v19–v35 remained queued.

### 2026-08-20 — v18 — PVA-013 History and Provenance — C18-21 repair authority approved

- Product Manager / P gate: **A restored for repair contract only**. [Product Section 17](../prototypes/v18/PRODUCT-ACCEPTANCE-v18.md) freezes native Global-only Settings/More, Product's exact canonical-section copy/facts/buttons, native inherited negatives, scope-specific Back labels, and one-pixel return. It does not accept failed implementation bytes.
- UI/UX Designer / D gate: **A restored for repair contract only**. [Design Section 19](../prototypes/v18/UX-CONTRACT-v18.md) freezes IDs/ARIA/list semantics, after-task body-sibling placement, guarded observer, capture-phase ownership, active-state hiding, launcher retirement, responsive/forced-colour behavior, and exact focus/scroll restoration.
- Project Manager / Council / C gate: **A restored**. [Project-plan Section 12](../prototypes/v18/PACKAGE-PLAN-v18.md), [Council C18-21](../prototypes/v18/COUNCIL-v18.md), and [fixture-authority Section 16](../prototypes/v18/HISTORY-PROVENANCE-FIXTURES-v18.md) reconcile all Product/Design/implementation conflicts; no choice remains for Arun.
- Exact placement: the runtime-root proposal is rejected because the frozen runtime is prepended before the archive, and UX's mutable `#prototype-main` proposal is rejected because v16 rerenders it. Exactly one v18-owned section is the direct body child after stable `#prototype-root` and before stable `#modal-root`. A direct-body `childList`-only queued guard restores only that sibling relation and never observes/mutates inherited descendants.
- Exact visible panel: Product's eyebrow **PROTOTYPE V18 · FIXED SYNTHETIC CONTEXTS**, heading **Open canonical History contexts**, exact explanatory body, then four ordered facts/buttons for 17 Aug Journal Day, Monsoon walk note, Summary, and Artwork version 2. UX adds only stable IDs and accessibility semantics.
- Native boundary and launcher: all inherited contextual v16 controls retain native text/attributes/behavior and never open v18; the exact 2 Aug / Before sleep / View versions / zero-injection regression must remain unchanged. Only native Settings/More **History** opens Global. The floating runtime launcher and automatic startup are retired from visible/focus/hit/accessibility user surfaces.
- Return contract: existing Back labels remain **Back to Settings**, **Back to More**, **Back to Journal Day**, **Back to Source Item**, **Back to Summary**, and **Back to Generated Artwork**. Back and Escape restore the exact connected invoker, focus, view/modal state, scroll, and invoker top within one CSS pixel; helper compensation is prohibited.
- Evidence repair: roster cardinality remains sixteen, but frame 16 becomes `v18-16-canonical-entry-320-forced`. The updated helper round-trips both native Global origins and all four owned controls, proves exact panel/placement/hiding/geometry/return, `inheritedContextPatchedCount=0`, exactly two native Global origins, launcher user-surface absence, and native negative behavior. All sixteen pairs must be regenerated after final repaired bytes.
- Cardinality and arithmetic: six implementation/self-check assets, seventeen events, fourteen fixtures, two disjoint scenarios, sixteen frames, three target rows, 0/0/0, and all privacy/proof boundaries remain exact. No new fixture, event, scenario, frame, requirement, or closure was introduced. Program arithmetic remains **19/57 closed and 38/57 open**; v19–v35 remain queued.
- Current authority hashes: Product `c5d20778cab6bdb31d2c562455d6c9ed95a7a18ee2a55b09d9eaacd67b866fa4`; Design `137c36c410f15b3f02a345abcc76fbdba19964df7c7bdcc029297d7cb72588ca`; Project plan `a97dc4c97b31141470ef78dfb65c63c29fe921fd31069e53ac91bb3f24541c45`; Council `7d9e008d09677d2f26d14baaaea61dd1521cc059e108e9b8bbb9cf629eb998aa`; fixtures `5a7148c4e6152668ce9435a2755ab47ef3e228b48f285a17b5f18337e0b05ae5`.
- Deterministic five-authority aggregate: `5e00dffbb00e8800c37ecc99d664945ca4dbf5df157561fd254c82aab0442602`, computed as SHA-256 over the five current newline-terminated `sha256  path` records sorted lexicographically as complete records, matching this tracker's established aggregate procedure.
- Change boundary: this amendment and ledger edit touch authority/failure-record/tracker bytes only. They do not accept or edit implementation, evidence, handoff, manifest, package/server, frozen v1–v17, maintained checkout, `main`, GitHub issue/Project, stage, commit, push, or remote state.
- Next action: repair the same unfrozen v18 within the existing six-file roster; rerun static/live checks; discard and regenerate all sixteen evidence pairs; seal a new exact manifest; then assign a fresh independent QA agent from zero.
- Current package status / gates: `Implementation in progress`; `P=A`; `D=A`; `C=A`; `I=IP`; `Q=—`; `F=—`.

### 2026-08-20 — v18 — PVA-013 History and Provenance — C18-22 frame-16 responsive evidence clarification

- Product Manager / P gate: **A retained for contract only**. [Product Section 18](../prototypes/v18/PRODUCT-ACCEPTANCE-v18.md) freezes the exact inactive compact → inactive wide Settings trip → inactive restored compact More/canonical trips → final compact PNG sequence without changing product state.
- UI/UX Designer / D gate: **A retained for contract only**. [Design Section 20](../prototypes/v18/UX-CONTRACT-v18.md) freezes three ordered `viewportStages`, genuine visible/hit/accessibility-exposed controls, whole-trip viewport consistency, passive post-baseline observation, and the final responsive/focus proof.
- Project Manager / Council / C gate: **A retained**. [Project-plan Section 13](../prototypes/v18/PACKAGE-PLAN-v18.md), [Council C18-22](../prototypes/v18/COUNCIL-v18.md), and [fixture-authority Section 17](../prototypes/v18/HISTORY-PROVENANCE-FIXTURES-v18.md) reconcile the same evidence-only contract. No Product/Design conflict or choice remains for Arun.
- Exact sequence: frame 16 starts inactive at 320×900, resizes inactive to 1024×900, completes the actual visible Settings **History** → Global → **Back to Settings** trip wholly at 1024×900, resizes inactive to 320×900, completes compact More → Global → Escape and canonical Day/Item/Summary/Artwork trips wholly at 320×900, then captures the final inactive PNG.
- Environment boundary: each resize happens only between fully consumed trips, never while a feature or return correction is active/pending. Viewport is evidence environment only and never selects or mutates fixture, scope, scenario, corpus, domain, URL, history, or storage. The helper may position the next real control before baseline but performs no focus, scroll, resize, DOM/CSS/layout mutation, or compensation from baseline through the app-owned completed return proof.
- Safe sidecar: `viewportStages` is exactly ordered `initial-compact`, `settings-wide`, `restored-compact`. Each of the six ordered trip records includes its stage, requested/observed viewport, visible/enabled/centre-hit/accessibility result, focus and one-pixel scroll/top measurements, unchanged domain digest, 0/0/0 counters, and consumed return. Final top-level 320×900 re-proves desktop Settings hidden, compact More reachable, one-column canonical panel, inactive/no-pending state, and Artwork-button focus.
- Historical aggregate correction: for the exact failed pre-C18-21 six-file `sha256  path` records, complete-record `LC_ALL=C sort` yields canonical aggregate `852fcedaba5e26a4cea7f92de5b9c9baa1fdaf36693a00fcc72523b76acb092b`. The earlier `cca2b73673b95e454482ccbc1b11564be43ad269136a3b4bf005b19153d3ddf9` is only a path-key-sorted derivative; neither identifies current repaired core bytes.
- Current reconciled authority hashes: Product `af7aaba334a5129f133401e126cc80b1d5c6b72a90ec6d9e2420d9d8ddbebcca`; Design `0202c870eee09e8f550e09ca53b7055e52ca3cdb655e8294316cc3866053d7b6`; Project plan `29a1ffbe13c4fde1dd1e3cfd8cfd8c2898cdbbd2fcbea94cfd5e02d139e7ad6c`; Council `085b296f026186e50ae6d94ad1038d4dd76d715c6e8ad92cc381e74c3c28a895`; fixtures `5bae152da7bbdd067745d5c8be6dadcf6cf9e4e9e1eb2023878297d6994b8543`.
- Deterministic five-authority aggregate: `47f111b909f561e4d9ff4451c436f41e3374fe8a73b802ba7d07d1dc12b2005c`, computed as SHA-256 over the five newline-terminated `sha256  path` records after complete-record `LC_ALL=C sort`.
- Counting boundary: no fixture, event, scenario, frame, CLI option, scope, requirement, row, or closure was added. Exactly six implementation/self-check assets, seventeen events, fourteen fixtures, two disjoint scenarios, sixteen evidence pairs, and three open v18 rows remain. Program arithmetic remains **19/57 closed and 38/57 open**; v19–v35 remain queued.
- Change boundary and next gate: this clarification changes authority and this living ledger only. It does not accept or edit README, checker, helper, core implementation, evidence, manifest, handoff, frozen v1–v17, stage, commit, push, or GitHub. Core implementation is producer-stable while evidence remains in progress; no independent QA or freeze has begun.
- Current package status / gates: `Implementation in progress`; `P=A`; `D=A`; `C=A`; `I=IP` (core producer-stable; evidence in progress); `Q=—`; `F=—`.

### 2026-08-20 — v18 — PVA-013 History and Provenance — final repaired candidate and evidence accepted locally

- Durable chronology: [PRE-GATE-FAIL-v18.md](../prototypes/v18/PRE-GATE-FAIL-v18.md) remains the preserved rejection of the false-provenance/return candidate. The repaired candidate also corrected the inherited More-modal Tab trap and the optional pre-artwork native-negative invariant; neither failure is erased or deferred.
- Product and Design final gates: fresh read-only final runs returned **P=A** and **D=A**, each with `Critical 0 / High 0 / Medium 0 / Low 0`. [PRODUCT-DESIGN-RECHECK-v18.md](../prototypes/v18/PRODUCT-DESIGN-RECHECK-v18.md) records the exact findings, repairs, final identity, and limits.
- Implementation/evidence gate: **I=A locally**. Exact six-file SHA-256 values are index `fc0b2466be93334283aac7338a0c502de8840d2494c5f250489f8190c5aa96ec`; app `7eb6c2f45eb53fb428bb620618c56f6d5262b3eb762e049af75c17d873980e74`; CSS `bfb3757a0fa1b6b7848060d799460e899dd7c6c0b7b8b304180f88e97a5b0f41`; README `69fe36d008f90248ab4190f00d66bd0d36a8773797d122e45c02979a5d308ccb`; checker `d1c49f696b9bbb5462f6587f9a72e2896e13f2269918b90c48a1c7f0d63723f9`; helper `765639709496db6b10b8eba5a14c18f3c70bc7e265086b2f499f99fb89072498`. Complete-record aggregate: `41b5a6ff8761d00808e58713ae1aacf6f287c2a152a0f7f60473a79bd520df58`.
- Evidence gate: all sixteen final-byte PNG/JSON pairs were captured from `2026-08-20T04:58:37.757Z` through `2026-08-20T04:59:00.687Z`. Independent producer-side inspection reproduced all PNG hashes/dimensions, **400/400** invariant assertions, **96/96** privacy assertions, zero local/session/IndexedDB/Cache/service-worker/OPFS residue, zero non-local requests, zero console events/exceptions, zero horizontal overflow, and chronological capture after the six tool/UI assets. The 32-file evidence aggregate is `2e30a2af078271f07d005cc04d06fae3b9573a54adab386fda5c442df1e63f2e`.
- Exact bounded acceptance: seventeen typed events; fourteen ordered fixtures; two disjoint evidence scenarios; Source-first and Derived-second read-only lanes; exact lineage, hidden-day, lifecycle, filter, pagination, focus/return, canonical-entry, optional-artwork, privacy, forced-colour, reduced-motion, and frozen-v17 regression behavior; mutation/provider counters remain `0/0/0`.
- Candidate boundary: the pre-QA handoff is [CALENDAR-UI-PROTOTYPE-v18.md](../prototypes/CALENDAR-UI-PROTOTYPE-v18.md). A new self-contained `CANDIDATE-MANIFEST-v18.md` must seal the current tracker, handoff, authority/history, implementation/tool, and evidence bytes before QA starts. Any listed-byte or manifest change after assignment invalidates the run.
- Current proof limits: no backend history, persistence, VoiceNotes authority/reconciliation, concurrency, rollback/restart recovery, authentication, encryption, deployment, production privacy/security/readiness, real screen-reader/assistive-technology session, hardware-touch matrix, or formal accessibility conformance is claimed.
- Counting and successor gate: **19/57 closed and 38/57 open**; `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` remain `Open`; `LID-SRC-004` remains non-counted supporting regression; `LID-VN-005` remains external; all v19–v35 packages remain queued.
- Current package status / gates: `Held candidate preparation`; `P=A`; `D=A`; `C=A`; `I=A`; `Q=—`; `F=—`.
- Next action: seal the exact manifest, assign a fresh independent read-only QA run from zero, and only after a clean verdict create documentation-only QA/freeze successors, commit, push, and perform remote readback. V19 remains blocked.

### 2026-08-20 — v18 — PVA-013 History and Provenance — independent QA Round 1 FAIL

- Independent report: [DESIGN-QA-v18-round1.md](../prototypes/v18/DESIGN-QA-v18-round1.md) records **FAIL — Critical 0 / High 0 / Medium 3 / Low 0** on manifest SHA-256 `c1b938e59b8db0904bd6899eb852af263a58f718d06c55b7b3e7770fd552c127` and exact 47-file aggregate `8b08849523b49cbe06a9b915b6aa577ee171799acd3ea52517e1ed6bc1c6d962`.
- Identity guard: all 47 records and the manifest matched at start `2026-08-20T10:44:35+05:30` and end `2026-08-20T10:54:53+05:30`; HEAD remained `8d94a61be8a7e7d6114b3a3b5b3963f23421e445`; no candidate, stage, commit, push, or GitHub mutation occurred.
- M1: eleven original-size PNGs failed to place every authority-required visible proof in-frame. Sidecar assertions cannot replace the required visual evidence.
- M2: frame 10 recorded focus on the reopened compact filter summary but showed no discernible focus indicator.
- M3: frame 16 showed the inherited Settings toast over canonical content and the fixed bottom navigation clipping the lower panel/focused Artwork treatment.
- Passing evidence retained only as diagnostic history: 16/16 stored hashes/dimensions, 400/400 invariants, 96/96 privacy assertions, strict empty storage/OPFS, zero non-local requests, zero console/exceptions, and static/frozen checks passed. The evidence and manifest remain rejected for freeze.
- Repair rule: the same V18 must repair all three findings, recapture all sixteen pairs from final bytes, inspect every replacement PNG/JSON, create a wholly new manifest, and receive a fresh independent QA run from zero. No finding is deferred.
- Counting/successor boundary: no row closes; arithmetic remains **19/57 closed and 38/57 open**; all V19–V35 packages remain queued.
- Current package status / gates: `QA failed`; `P=A`; `D=A`; `C=A`; obsolete Round-1 `I=A`; `Q=F`; `F=—`.

### 2026-08-20 — v18 — PVA-013 History and Provenance — repaired-local documentation checkpoint; repository evidence still obsolete

- Preserved QA history: [independent QA Round 1](../prototypes/v18/DESIGN-QA-v18-round1.md) remains **FAIL — Critical 0 / High 0 / Medium 3 / Low 0**. The rejected manifest SHA-256 remains `c1b938e59b8db0904bd6899eb852af263a58f718d06c55b7b3e7770fd552c127`; its exact 47-file aggregate remains `8b08849523b49cbe06a9b915b6aa577ee171799acd3ea52517e1ed6bc1c6d962`. Neither identity, the report, nor any finding is erased, reclassified, accepted, deferred, or reused for freeze.
- Exact repaired six-file local identity: index `fc0b2466be93334283aac7338a0c502de8840d2494c5f250489f8190c5aa96ec`; app `33c1cef97a8a9b5e0249efe790cdaf5758d2288508207fe3f5538672b88cec2f`; CSS `b3a0ef2f1da0df143cb5f4c7800942722a4a11ccce76d57fb4bc7e5105315551`; README `52b1d21016a61655edd283062abda652642c5e15edebe44cb6a17eef9ff5a50a`; checker `c8b8cba69557a866b2bbce95c064edbbba3325662f29668b242d03458105a50b`; helper `72c5d82c5bb6a4daec8f3105d232f9befe1263aa3171bb097d0a75dd1a275337`. The six complete records produce `LC_ALL=C sort` aggregate `1ec09b3320b655278895d4d31dbc5f2e6d9b10c77c776b782e2a1dffdb85767a`.
- **M1 repaired locally:** the exact closed pre-capture framing map now uses one bounded passive scroll for frames 02, 03, 05–09, 12, 13, and 15; it verifies named proof targets, safe copy, viewport fit, rectangles, no fixed/sticky overlap, and unchanged snapshot/focus. Medium E12 compacts whitespace only. Frame 14 retains the exact five-record scenario and adds the truthful normal-flow Source/Derived completion summary with the focused Derived beginning marker visibly outlined.
- **M2 repaired locally:** frame 10 uses real Shift+Tab then Enter to reopen **Filter history · 2 active**, retains native-summary focus, and fails unless `:focus-visible` plus a rendered outline or shadow is present. Direct focus and pointer reopening are not accepted for the final proof.
- **M3 repaired locally:** compact safe-area spacing and the one permitted pre-baseline Artwork scroll establish at least 12 CSS pixels of focus-ring and panel-boundary clearance from the fixed navigation. The helper then waits passively through the native 4.2-second toast expiry and requires unchanged state/focus/scroll, no toast, complete canonical content, visible Artwork focus, complete panel boundary, and both clearances at least 12 pixels.
- Repair-owner rehearsal: one full temporary sixteen-pair run against the repaired six bytes reported **400/400 invariant assertions** and **96/96 privacy assertions**. This is temporary producer output only; it is not the repository recapture, replacement candidate, manifest, hold, independent QA, freeze, or closure.
- Product and Design recheck: fresh owner rechecks in [PRODUCT-DESIGN-RECHECK-v18.md](../prototypes/v18/PRODUCT-DESIGN-RECHECK-v18.md) both returned **A — C0/H0/M0/L0** on the repaired local bytes. The updated [v18 handoff](../prototypes/CALENDAR-UI-PROTOTYPE-v18.md) records the same bounded checkpoint. These are not an independent Round 2 verdict.
- Evidence and candidate boundary: the repository's sixteen PNG/JSON pairs and `CANDIDATE-MANIFEST-v18.md` remain obsolete Round 1 bytes. No replacement repository recapture, original-size inspection, manifest, held candidate, Round 2 assignment/run, QA pass, freeze, commit, push, remote readback, or GitHub mutation is claimed.
- Counting and successor boundary: `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` remain `Open`; `LID-SRC-004` remains supporting regression only; `LID-VN-005` remains external evidence. Program arithmetic remains **19/57 closed and 38/57 open**; all V19–V35 packages remain queued.
- Documentation boundary: this checkpoint edits only the Product/Design recheck, v18 handoff, and this tracker. It does not edit authority, implementation, evidence, manifest, QA report, frozen v1–v17, stage, commit, push, GitHub, or remote state.
- Current package status / gates: `Repair in progress`; `P=A`; `D=A`; `C=A`; `I=A` repaired locally; `Q=F` for historical Round 1 with fresh Round 2 pending; `F=—`.
- Next action: perform a complete final-byte repository recapture and inspection, create a wholly new manifest, then assign a fresh independent Round 2 agent from zero. None of those future gates is complete at this checkpoint.

### 2026-08-20 — v18 — PVA-013 History and Provenance — replacement recapture complete; QA Round 2 candidate held

- Round 1 remains rejected history: [DESIGN-QA-v18-round1.md](../prototypes/v18/DESIGN-QA-v18-round1.md) remains **FAIL — C0/H0/M3/L0**. Its obsolete manifest SHA-256 is `c1b938e59b8db0904bd6899eb852af263a58f718d06c55b7b3e7770fd552c127`; its obsolete exact 47-file aggregate is `8b08849523b49cbe06a9b915b6aa577ee171799acd3ea52517e1ed6bc1c6d962`. Neither the report nor any finding was erased, reclassified, accepted, deferred, or reused.
- Repaired implementation/tool identity: index `fc0b2466be93334283aac7338a0c502de8840d2494c5f250489f8190c5aa96ec`; app `33c1cef97a8a9b5e0249efe790cdaf5758d2288508207fe3f5538672b88cec2f`; CSS `b3a0ef2f1da0df143cb5f4c7800942722a4a11ccce76d57fb4bc7e5105315551`; README `52b1d21016a61655edd283062abda652642c5e15edebe44cb6a17eef9ff5a50a`; checker `c8b8cba69557a866b2bbce95c064edbbba3325662f29668b242d03458105a50b`; helper `72c5d82c5bb6a4daec8f3105d232f9befe1263aa3171bb097d0a75dd1a275337`; six-record complete-record aggregate `1ec09b3320b655278895d4d31dbc5f2e6d9b10c77c776b782e2a1dffdb85767a`.
- Repository recapture: exactly sixteen governed PNG/JSON pairs were regenerated from the repaired bytes. The first sidecar timestamp is `2026-08-20T06:49:33.313Z`; the last is `2026-08-20T06:50:01.378Z`. The exact 32-file evidence aggregate is `fcd9e2160f9dc624f671c9769acb16732a35504bceb999ff1f9ebe9120d645e4`.
- Recapture checks: **400/400 invariant assertions** and **96/96 privacy assertions** passed; console events, browser exceptions, browser storage/registrations including OPFS entries, external requests, and horizontal overflow were all zero. Root-agent original-size visual inspection returned **PASS for all 16/16 PNGs**.
- Repair dispositions: M1's eleven required-visible-proof frames now use the governed framing/summary repairs; M2's compact filter ends through real Shift+Tab/Enter with visible native focus treatment; M3's compact canonical frame passively clears the native toast and preserves at least 12-pixel focus/panel clearance from fixed navigation. Fresh Product and Design repair rechecks both returned **A — C0/H0/M0/L0**; no finding was accepted or deferred. [Product/Design recheck](../prototypes/v18/PRODUCT-DESIGN-RECHECK-v18.md) and [v18 handoff](../prototypes/CALENDAR-UI-PROTOTYPE-v18.md) record the full bounded evidence.
- Round 2 hold: [CANDIDATE-MANIFEST-v18.md](../prototypes/v18/CANDIDATE-MANIFEST-v18.md) is replaced as a self-reference-free QA Round 2 manifest with exactly 48 held records: five authority documents; `PRE-GATE-FAIL-v18.md`; Product/Design recheck; this tracker; v18 handoff; preserved Round 1 QA report; 32 evidence files; and six implementation/tool assets. The manifest itself is outside its aggregate and self-hash.
- Baseline and mutation boundary: worktree HEAD at hold remains `8d94a61be8a7e7d6114b3a3b5b3963f23421e445`; frozen merge base remains `01d1f054a12773e07f91096b8d76b0c5f4064329`. This documentation/manifest step edits no authority, implementation, evidence, QA report, stage, commit, push, GitHub object, or remote state.
- Counting and successor boundary: `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` remain `Open`; `LID-SRC-004` remains supporting regression only; `LID-VN-005` remains external evidence. Program arithmetic remains **19/57 closed and 38/57 open**; all V19–V35 packages remain queued.
- Current package status / gates: `Held candidate preparation`; `P=A`; `D=A`; `C=A`; `I=A`; `Q=F` for historical Round 1 with fresh Round 2 pending; `F=—`.
- Next action: assign a fresh read-only independent Round 2 agent to the exact manifest and require start/end self-hash plus all 48-record rehashes. No Round 2 verdict, freeze, commit, push, readback, GitHub mutation, or closure is claimed.

### 2026-08-20 — v18 — PVA-013 History and Provenance — independent QA Round 2 FAIL; supplemental repair ledger expanded

- Formal report and identity: [DESIGN-QA-v18-round2.md](../prototypes/v18/DESIGN-QA-v18-round2.md) records formal independent `/root/qa_v18_round2` **FAIL — C0/H0/M1/L0** on obsolete manifest SHA-256 `8746079b78e361e3402e1487f1561a87532dd3b0240fe7d8e90ad95a4856a5ab` and exact 48-file aggregate `eb27347306389ca69168b5e6eb0b229159f57dd63fac50e2c4d3105ecaec03ca`.
- Identity guard: all 48 records, the manifest, HEAD `8d94a61be8a7e7d6114b3a3b5b3963f23421e445`, and zero staged paths matched at formal-run start and end. The root recorded the end state at `2026-08-20T12:43:57+05:30`. No candidate, manifest, stage, commit, push, GitHub, or remote mutation occurred during QA.
- Formal Medium: frame 16 measured inherited-banner bottom `66`, canonical-panel top `18.5625`, and exact overlap `47.4375` CSS pixels. The banner clipped the panel's top border and most of the required eyebrow. An exact held-helper rerun reproduced it. Round 1 M1 framing and M2 visible focus passed; Round 1 M3 remains failed.
- Supplemental Medium 1: with filtered post-pagination visible events `E14,E13,E12`, the completion summary falsely retained unfiltered totals Source `10 shown` and Derived `7 shown`.
- Supplemental Medium 2: generationless success aliases bypassed the matching pending-generation settlement contract.
- Supplemental Low 1: click-only pagination activation bypassed the anchor baseline and jumped `1767.1875` CSS pixels. Assistive-technology activation was not tested and carries no pass claim.
- Supplemental Low 2: at 320 px the hidden 0×0 desktop Settings **History** control remained programmatically activatable even though ordinary users could not reach it.
- Consolidated disposition: formal Round 2 remains **C0/H0/M1/L0**; supplemental `/root/qa_v18_adversarial` expands the same-version repair ledger to **C0/H0/M3/L2**. No finding is accepted or deferred. Formal QA stopped broad live expansion fail-fast after the deterministic frame-16 blocker; unrun branches are not passed.
- Preserved prior history: Round 1 report, obsolete manifest `c1b938e59b8db0904bd6899eb852af263a58f718d06c55b7b3e7770fd552c127`, and obsolete aggregate `8b08849523b49cbe06a9b915b6aa577ee171799acd3ea52517e1ed6bc1c6d962` remain rejected history. Round 2 does not erase or supersede that failure.
- Gate reset: prior Product/Design readiness is invalidated pending fresh recheck, `P=F`, `D=F`. Council authority remains `C=A`; implementation returns to `I=IP`; independent QA is `Q=F`; freeze remains `F=—`. The rejected Round 2 manifest cannot be reused.
- Counting and successor boundary: `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` remain `Open`; `LID-SRC-004` remains supporting regression only; `LID-VN-005` remains external evidence. Program arithmetic remains **19/57 closed and 38/57 open**; all V19–V35 packages remain queued.
- Next action: repair all five consolidated findings in the same v18; rerun Product and Design readiness; recapture and inspect every governed evidence pair from final bytes; seal a wholly new manifest; then assign a fresh independent agent from zero. No freeze, commit, push, readback, GitHub mutation, or closure is authorized.

### 2026-08-20 — v18 — PVA-013 History and Provenance — final repaired-local readiness before definitive Round 3 recapture

- Preserved failure chronology: Round 1 remains **FAIL — C0/H0/M3/L0** on obsolete manifest `c1b938e59b8db0904bd6899eb852af263a58f718d06c55b7b3e7770fd552c127` / aggregate `8b08849523b49cbe06a9b915b6aa577ee171799acd3ea52517e1ed6bc1c6d962`. Round 2 remains formal **FAIL — C0/H0/M1/L0**, consolidated **C0/H0/M3/L2**, on obsolete manifest `8746079b78e361e3402e1487f1561a87532dd3b0240fe7d8e90ad95a4856a5ab` / aggregate `eb27347306389ca69168b5e6eb0b229159f57dd63fac50e2c4d3105ecaec03ca`. Both QA reports and every finding remain intact; none is accepted or deferred.
- Exact final six-file identity: index `fc0b2466be93334283aac7338a0c502de8840d2494c5f250489f8190c5aa96ec`; app `db445d881cb48f873896b7e52a3bbafc59cbcfcdfc78ffb31caaa5f56b8207ca`; CSS `dcd32125a176943f9c059d4f3344c331fed5e627d5ea2f2dd7cc167501593451`; README `a2859496b9082ced29deab69f53c8853c7aa6553157f43ddfa31f99975bd74da`; checker `ec035b3b28a815b8dab8713d355f48e84186d1e86620d0ab6251399d6888f21a`; helper `f3b66d390d3e8c1a814507376c82a893af52f812c592b30dfbdab9f315d2ba78`; six-record complete-record aggregate `36486ecad780f3b83a56768d3710b1f1d87c6b75eea9bf84dfe486e8ab6cf17c`.
- Frame-16 repair: the full canonical panel now fits between banner bottom `66` and navigation top `834`: height ≤744, top ≥78, bottom ≤822, both borders and exact eyebrow/h2/body/four facts/four buttons/Artwork focus visible, normal-flow 32-pixel gutter, ≥44-pixel targets, and ≥12-pixel clearance without truncation, nested scroll, overlay, shrinkage, or helper compensation.
- Filter and generation repairs: any active filter removes the completion summary from DOM/AX; Source + Needs attention is exactly `E14,E13,E12`, total 3; Clear restores truthful 10/7 without pagination drift. Every terminal direct/generic/settle outcome requires the explicit positive matching lane generation; missing, invalid, conflicting, stale, future, cross-lane, wrong-stage, or consumed generations are strict no-ops.
- Activation/anchor repair: pointer, Enter, Space, and click-only Load/Duplicate each create one app-owned generation/baseline and restore logical focus/top within one CSS pixel. Click-only fallback exists only without pointer/key precursor and duplicate consumes the exact next generation. No assistive-technology claim is inferred.
- Origin/breakpoint repair: ineligible hidden, inert, aria-hidden, zero-size, off-viewport, non-hit, unnamed, disconnected, disabled, or wrong-root origins are v18 no-ops before prevention/suppression or state effect. More owns Global through 960 px; Settings from 961 px; filters remain compact through 1023 px and wide from 1024 px. Positive/negative proofs cover 320, 960, 961, 1023, and 1024 with exact return and frozen-handler passthrough.
- Frame-11 repair: exact `loading` at 568×320 with no scenario uses one passive final Y-scroll to show the complete named Source boundary, **Source history**, **Loading history**, and exact body inside the 52/16-pixel safe band. Source alone is busy; DOM/CSS/ARIA/viewport/media/action digest is unchanged; h1 focus remains intentionally offscreen and no visible-focus claim is made.
- Fresh readiness: Product and Design rechecks both returned **A — C0/H0/M0/L0** on the exact final bytes. The repair owner's full temporary sixteen-pair run returned **400/400 invariants**, **96/96 privacy**, and zero console, exception, browser-state/OPFS, external-request, or overflow issues. [Product/Design recheck](../prototypes/v18/PRODUCT-DESIGN-RECHECK-v18.md) and [v18 handoff](../prototypes/CALENDAR-UI-PROTOTYPE-v18.md) contain the detailed bounded record.
- Evidence and gate boundary: temporary owner output is not definitive repository evidence or independent QA. Existing repository evidence and both prior manifests remain obsolete. Required next steps are final-byte repository recapture, original-size inspection, a wholly new self-reference-free manifest, and fresh independent Round 3 from zero.
- Current package status / gates: `Held candidate preparation`; `P=A`; `D=A`; `C=A`; `I=A` locally; `Q=F` for historical Rounds 1–2 with Round 3 pending; `F=—`.
- Counting and successor boundary: `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` remain `Open`; `LID-SRC-004` remains supporting regression; `LID-VN-005` remains external evidence. Program arithmetic remains **19/57 closed and 38/57 open**; V19–V35 remain queued. No freeze, commit, push, readback, GitHub mutation, or closure is claimed.

### 2026-08-20 — v18 — PVA-013 History and Provenance — definitive recapture complete; QA Round 3 candidate held

- Preserved rejected history: Round 1 remains **FAIL — C0/H0/M3/L0** on obsolete manifest `c1b938e59b8db0904bd6899eb852af263a58f718d06c55b7b3e7770fd552c127` / aggregate `8b08849523b49cbe06a9b915b6aa577ee171799acd3ea52517e1ed6bc1c6d962`. Round 2 remains formal **FAIL — C0/H0/M1/L0**, consolidated **C0/H0/M3/L2**, on obsolete manifest `8746079b78e361e3402e1487f1561a87532dd3b0240fe7d8e90ad95a4856a5ab` / aggregate `eb27347306389ca69168b5e6eb0b229159f57dd63fac50e2c4d3105ecaec03ca`. Both reports and every finding remain preserved; none is accepted or deferred.
- Final implementation/tool identity: index `fc0b2466be93334283aac7338a0c502de8840d2494c5f250489f8190c5aa96ec`; app `db445d881cb48f873896b7e52a3bbafc59cbcfcdfc78ffb31caaa5f56b8207ca`; CSS `dcd32125a176943f9c059d4f3344c331fed5e627d5ea2f2dd7cc167501593451`; README `a2859496b9082ced29deab69f53c8853c7aa6553157f43ddfa31f99975bd74da`; checker `ec035b3b28a815b8dab8713d355f48e84186d1e86620d0ab6251399d6888f21a`; helper `f3b66d390d3e8c1a814507376c82a893af52f812c592b30dfbdab9f315d2ba78`; six-record aggregate `36486ecad780f3b83a56768d3710b1f1d87c6b75eea9bf84dfe486e8ab6cf17c`.
- Definitive evidence: exactly 16 PNG plus 16 JSON files were recaptured from the final bytes. Sidecar chronology is `2026-08-20T08:55:31.442Z` through `2026-08-20T08:56:28.255Z`; exact 32-record aggregate is `11297ee0c6d3ff251e611d0cea1d65da56fe632d807cf12a7c18b4008a0c710f`.
- Evidence checks: **400/400 invariant assertions**, **96/96 privacy assertions**, zero console events/exceptions, zero local/session/IndexedDB/Cache/service-worker/OPFS state, zero external requests, and zero horizontal overflow.
- Product/Design readiness: fresh final rechecks remain **P=A** and **D=A**, each **C0/H0/M0/L0**. Council is `C=A`; implementation/evidence is `I=A` locally. [Product/Design recheck](../prototypes/v18/PRODUCT-DESIGN-RECHECK-v18.md) and [v18 handoff](../prototypes/CALENDAR-UI-PROTOTYPE-v18.md) record the complete chronology and bounded claims.
- Round 3 hold: [V18-CANDIDATE-MANIFEST.sha256](../prototypes/v18/V18-CANDIDATE-MANIFEST.sha256) contains exactly 49 complete held records: five authority documents; pre-gate failure; Product/Design recheck; this tracker; v18 handoff; QA Round 1 and Round 2 reports; 32 definitive evidence files; and six final assets. The checksum manifest is self-reference-free and outside the roster; its held aggregate/self-hash is the external assignment identity.
- Current package status / gates: `Held candidate preparation`; `P=A`; `D=A`; `C=A`; `I=A` locally; fresh Round 3 `Q=—` pending while historical Rounds 1–2 remain `F`; `F=—`.
- Counting and successor boundary: `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` remain `Open`; `LID-SRC-004` remains supporting regression; `LID-VN-005` remains external evidence. Program arithmetic remains **19/57 closed and 38/57 open**. V19–V35 remain queued, and V19 is additionally user-gated.
- Mutation boundary and next action: this hold edits only the recheck, handoff, tracker, and checksum manifest. It does not create QA3, edit authority/implementation/evidence/QA reports, stage, commit, push, read back remote state, or touch GitHub. Next action is a fresh read-only Round 3 run over the exact 49-record roster; no verdict or freeze is claimed.
