# Life in Days — prototype completeness tracker

- **Created:** 2026-08-14
- **Owner:** Project Manager agent
- **Product owner:** Arun
- **Baseline:** Prototype v5 at commit `00e5689`; feature audit at commit `f74455f`
- **Current state:** v6 Private Search State passed independent QA with no open findings and is the newest frozen prototype; v7 Calendar Contract Completion is next
- **Goal:** Close every prototype-representable gap in the [v5 feature audit](../audits/PROTOTYPE-V5-FEATURE-AUDIT.md) through immutable, consecutively numbered prototype versions, with Product, UX, council, implementation, and independent QA evidence for every version.

This tracker governs the prototype-completeness loop only. It does not authorize or prove backend implementation, provider qualification, integration behavior, security controls, persistence, deployment, backup, restoration, or production readiness. The [PRD](../product/PRODUCT-REQUIREMENTS.md) and [UX specification](../design/UX-SPECIFICATION.md) remain authoritative for behavior. When this tracker differs from those sources or a direct decision from Arun, the higher-authority source wins and the discrepancy must be recorded in the iteration ledger.

## 1. Definition of success

The prototype-completeness goal is complete only when all of the following are true:

1. All **57 prototype-representable requirements** classified `Partial`, `Placeholder`, or `Missing` in the v5 audit have passed the package gate assigned below.
2. Each stable feature has produced one new immutable prototype version, in order from v6 through v35. No version number is skipped, reused, or overwritten. A failed QA result is repaired within the same unfrozen candidate; it does not consume another version.
3. For every version, Product has translated the cited PRD and UX contracts into explicit acceptance scenarios; UX has supplied the required state and interaction contract; the three-role council has approved the slice before it is frozen; implementation evidence exists; and a newly assigned independent QA agent has recorded a pass.
4. All **12 Outside UI requirements** remain clearly separated from prototype evidence. The prototype may represent honest unverified, unavailable, failed, or blocked states, but no QA result may claim that the underlying integration, security, storage, or operational control works.
5. The nine v5 requirements already classified `Full` remain intact, including all six deliberate MVP exclusions.
6. The last prototype passes a complete cross-version regression covering desktop and compact layouts, keyboard operation, focus, reduced motion, light/dark themes, URL/privacy invariants, no forbidden scope, and all required state families.
7. The iteration ledger contains the evidence and disposition for every package, with no unresolved Critical or High prototype gap.

## 2. Status and gate vocabulary

### Package status

| Status | Meaning |
| --- | --- |
| `Queued` | Scope is mapped, but feature work has not started. |
| `PM in progress` | Product acceptance scenarios are being prepared. |
| `Design in progress` | UX states/interactions are being specified or reviewed. |
| `Council review` | PM, UX, and Project Manager are resolving the slice before implementation/freeze. |
| `Implementation in progress` | The new immutable prototype files are being created. |
| `QA in progress` | A fresh QA agent is verifying the built version. |
| `QA failed` | Evidence contradicts one or more acceptance scenarios; the same version remains open until repaired and rechecked. |
| `Complete` | Every gate below passed, evidence is linked, and the immutable version is frozen. |
| `Blocked` | A named product decision or dependency prevents safe progress. |

### Mandatory gate sequence for every version

| Gate | Accountable role | Exit evidence |
| --- | --- | --- |
| `P — Product acceptance` | Product Manager agent | Requirement IDs, PRD/UX citations, included/excluded behaviors, normal/empty/loading/error/interruption/destructive scenarios, and observable pass criteria are written before implementation. |
| `D — Experience contract` | Expert UI/UX Designer agent | Screen inventory, hierarchy, responsive behavior, accessibility annotations, exact labels, focus/Back behavior, and state transitions are agreed. Synthetic content only. |
| `C — Council approval` | Product Manager + UI/UX Designer + Project Manager | Three-role review records `Approved`, or records an explicit decision needed from Arun. Convenience is never used to silently resolve a PRD conflict. |
| `I — Prototype implementation` | Implementing agent | New `index-vN.html`, `app-vN.js`, `styles-vN.css`, `README-vN.md`, prototype note, and current-run screenshots exist. Earlier version files remain unchanged. Interactions change representative domain state rather than ending in a generic toast where the requirement demands a decision. |
| `Q — Independent QA` | Newly assigned QA agent | Current-run route/interaction checks, visual inspection, console/syntax checks, responsive/a11y checks proportional to the slice, regression of inherited behavior, scope-boundary check, and a written verdict. A developer self-check is insufficient. |
| `F — Freeze and handoff` | Project Manager agent | QA is `Pass`, evidence paths and commit are recorded, this tracker is updated, and only then does the next version move from `Queued`. |

Gate notation in the registers is `—` (not started), `IP` (in progress), `A` (approved/passed), `F` (failed), or `B` (blocked).

## 3. Product Council decisions governing the roadmap

These decisions reconcile older written specification language with Arun's later direct prototype decisions. They govern prototype work while the PRD and UX specification await corresponding editorial amendments.

| Decision | Disposition | Consequence for prototype work |
| --- | --- | --- |
| **C-01 — Calendar labels** | **Approved** | Follow Arun's later approved direction: Calendar image tiles contain the image without source-type or AI chips. Source, AI, and attention details appear after selection in the Museum Margin/right-side detail and in the accessible name. Today, selected, and keyboard focus use distinct non-overlay cell outlines. This supersedes the persistent-overlay portions of `UX-CAL-05`, `UX-CAL-08`, and contextual wording in `LID-AIA-005`; it does not weaken provenance or accessibility. |
| **C-02 — Timeline versus Almanac** | **Approved** | Keep the user-facing name and visual direction **Monthly Almanac**, and extend it into cross-month chronological browsing that fulfills `LID-REF-002`. Do not add a competing Timeline tab. The intended terminology amendment is “Almanac, the chronological timeline experience.” |
| **C-03 — Navigation** | **Approved** | Preserve the approved Calendar/Almanac switcher near Search and the collapsible local Almanac index. Treat the older persistent-left-rail wording as superseded. Management remains under Settings/More. |
| **C-04 — Unresolved technical gates** | **Approved** | Represent future, unavailable, failed, and unverified states using synthetic fixtures labeled as prototype data. Do not select a real AI model or claim a connected VoiceNotes/Telegram integration, successful backup or restore, encryption implementation, storage migration, production authentication, deployment, or operational readiness. |

## 4. Version execution register

Each package contains one stable feature that can be designed, implemented, and independently verified as a coherent increment. Cross-cutting behavior may be touched again by later versions, but every audit-gap requirement has one primary closure version in Section 5.

| Version | Feature package and audit outcome | Primary audit gaps | Depends on | Status | P | D | C | I | Q | Required evidence when complete |
| --- | --- | --- | --- | --- | --- | :---: | :---: | :---: | :---: | :---: | --- |
| **v6** | **PVA-001 Private Search State** — remove query reads/writes from URLs, browser history, title, and persistent storage; keep query only in live memory; replace suggested/recent memories with an honest deterministic-scope initial state. Full lexical coverage is deliberately not claimed here. | Audit gap 2, privacy defect only | v5 baseline | **Complete** | A | A | A | A | A | `prototypes/calendar-ui/index-v6.html`; `app-v6.js`; `styles-v6.css`; `README-v6.md`; `docs/prototypes/CALENDAR-UI-PROTOTYPE-v6.md`; `design-qa-v6.md`; `docs/prototypes/v6/` |
| **v7** | **PVA-002 Calendar Contract Completion** — month/year chooser and distinct Today/selected/focus treatments without image overlays; quiet empty days and progressive-disclosure provenance remain. | Audit gap 14 | v6; C-01 | Queued | — | — | — | — | — | Standard v7 artifact set; decision C-01 regression; `docs/prototypes/v7/` |
| **v8** | **PVA-003 Cross-month Almanac** — reverse-chronological month groups, deterministic Load earlier, month/year jump, same Journal Day route, stable focus, and hidden/Trash-only exclusion under the approved Almanac direction. | Audit gap 11 | v7; C-02, C-03 | Queued | — | — | — | — | — | Standard v8 artifact set; cross-month walkthrough; `docs/prototypes/v8/` |
| **v9** | **PVA-004 First-use Readiness** — empty Calendar and separate VoiceNotes, Telegram, AI, Backup, and Recovery Ceremony readiness without credential collection or false recovery claims. | Audit gap 3, first-use portion | v8; C-04 | Queued | — | — | — | — | — | Standard v9 artifact set; readiness-state matrix; `docs/prototypes/v9/` |
| **v10** | **PVA-005 Resilient Application Shell** — loading, month/partial-media failure, connection interruption, unsaved Correction, session expiry, reauthentication, generic server failure, and idempotent safe retry. | Audit gap 3, interruption/failure portion | v9 | Queued | — | — | — | — | — | Standard v10 artifact set; shell-state matrix; `docs/prototypes/v10/` |
| **v11** | **PVA-006 Needs Date Review** — conditional queue/count, Telegram and VoiceNotes reasons, preserved input, immutable timestamp, no receipt-time guessing, past-only assignment preview, failure/success, and empty state. | Audit gap 1 | v10 | Queued | — | — | — | — | — | Standard v11 artifact set; date-review scenario matrix; `docs/prototypes/v11/` |
| **v12** | **PVA-007 Telegram Capture Companion** — clearly simulated bot/web states for guidance, authorization, formats/limits, albums/date captions, rejection, durable success/failure, review acknowledgement, and private handoff. | Audit gap 9, capture portion | v11; C-04 | Queued | — | — | — | — | — | Standard v12 artifact set; Telegram message/state fixture sheet; `docs/prototypes/v12/` |
| **v13** | **PVA-008 Telegram Duplicate Handling** — same-day Already imported/Add duplicate anyway, cross-day date-only warning/permit, shared Media Asset representation, caption retention, and cancel-without-creation. | Audit gap 9, duplicate portion | v12 | Queued | — | — | — | — | — | Standard v13 artifact set; duplicate outcome matrix; `docs/prototypes/v13/` |
| **v14** | **PVA-009 Durable Manual Upload** — deliberate global date choice, safe review, original/checksum identity, duplicate provenance, progress/interruption/failure/retry, durable success, and derived pending/stale result. | Audit gap 12 | v13 | Queued | — | — | — | — | — | Standard v14 artifact set; upload validation matrix; `docs/prototypes/v14/` |
| **v15** | **PVA-010 Correction Editor** — Source Item-only launch, read-only source/base revision, simulated author/time, unsaved warning, explicit Correction, removal without deleted history. | Audit gap 5, Correction portion | v14 | Queued | — | — | — | — | — | Standard v15 artifact set; Correction lifecycle evidence; `docs/prototypes/v15/` |
| **v16** | **PVA-011 Source Conflict Resolution** — accessible wide/stacked diff; exactly three substantive, distinct outcomes; unresolved Cancel; manual based-on-both workspace without auto-merge. | Audit gap 5, conflict portion | v15 | Queued | — | — | — | — | — | Standard v16 artifact set; three-action outcome evidence; `docs/prototypes/v16/` |
| **v17** | **PVA-012 Atomic Redating** — item-level current/destination dates and timestamp; old/new day, cover, visibility, stale/art-history preview; atomic failure/success and links. | Audit gap 5, redating portion | v16 | Queued | — | — | — | — | — | Standard v17 artifact set; redating before/after fixtures; `docs/prototypes/v17/` |
| **v18** | **PVA-013 History and Provenance** — global/day/item/field/art histories, typed events, separate source/derived lanes, upstream lifecycle, hidden historical day, and read-only inspection. | Audit gap 4, History portion | v17 | Queued | — | — | — | — | — | Standard v18 artifact set; history-event matrix; `docs/prototypes/v18/` |
| **v19** | **PVA-014 Trash** — recoverable item list/expiry, ordinary-view exclusion, restore, permanent delete, accurate backup language, and visibility/cover/stale preview. | Audit gap 4, Trash portion | v18 | Queued | — | — | — | — | — | Standard v19 artifact set; destructive-action QA; `docs/prototypes/v19/` |
| **v20** | **PVA-015 Suppressions** — separate Source/Artwork records, opaque identity, Allow re-import/Allow generation, restore behavior, and manual-art distinction. | Audit gap 4, Suppressions portion | v19 | Queued | — | — | — | — | — | Standard v20 artifact set; suppression lifecycle QA; `docs/prototypes/v20/` |
| **v21** | **PVA-016 Complete Lexical Search** — exact current text/date/tag/caption search, Include history off by default, why-matched provenance, current/revision/Trash labels, all search states, and destination focus. | Audit gap 2, capability portion; search part of gap 9 | v6, v18–v20 | Queued | — | — | — | — | — | Standard v21 artifact set; query/fixture matrix; `docs/prototypes/v21/` |
| **v22** | **PVA-017 Generated-field Lifecycle Parity** — independent title/summary/tags protection, stale suggestions, Use/Keep/Edit/Resume, 80–140-word summary, and 3–7 unique-tag validation. | Audit gap 7, field-lifecycle portion | v21 | Queued | — | — | — | — | — | Standard v22 artifact set; field-state matrix; `docs/prototypes/v22/` |
| **v23** | **PVA-018 AI Text Processing States** — quiet/final refresh, generating/source race/current/stale, refusal/schema/timeout/rate/provider/auth/quota/retry/exhausted states, and safe provenance. | Audit gap 7, processing portion | v22 | Queued | — | — | — | — | — | Standard v23 artifact set; text-attempt matrix; `docs/prototypes/v23/` |
| **v24** | **PVA-019 System Health Foundation** — factual integration/provider/job/backup placeholders and sanitized evidence using the approved health vocabulary; repeated-failure/recovery alerts without reminders. | Audit gap 4, Health foundation | v23; C-04 | Queued | — | — | — | — | — | Standard v24 artifact set; health vocabulary QA; `docs/prototypes/v24/` |
| **v25** | **PVA-020 Provider Settings and Privacy** — independent controls, evaluation-incomplete/synthetic-qualified fixtures, credentials, manual-only options, future-only confirmation, no fallback, cost/region/lifecycle/privacy metadata, and exact lanes. | Audit gaps 7, 8, and 10, provider/privacy portions | v24; C-04 | Queued | — | — | — | — | — | Standard v25 artifact set; provider/privacy matrix; `docs/prototypes/v25/` |
| **v26** | **PVA-021 Artwork Request Confirmation** — every request shows read-only brief, provider/configuration, credential, predicted cost and budget; sparse/disabled rules; brief regeneration sends no art request. | Audit gap 8, confirmation portion | v25 | Queued | — | — | — | — | — | Standard v26 artifact set; preflight walkthrough; `docs/prototypes/v26/` |
| **v27** | **PVA-022 Artwork Failure and Budget States** — distinct requested/generating/success/refusal/timeout/rate/credential/quota/invalid/budget states, no silent fallback, bounded handling, explicit Retry. | Audit gap 8, failure portion | v26 | Queued | — | — | — | — | — | Standard v27 artifact set; artwork-attempt matrix; `docs/prototypes/v27/` |
| **v28** | **PVA-023 Artwork Version and Staleness** — compare/select retained versions, active/historical/stale states, safe provenance, redated-source history, and labeled AI status in permitted contexts. | Audit gap 8, version portion | v27, v18 | Queued | — | — | — | — | — | Standard v28 artifact set; art-history QA; `docs/prototypes/v28/` |
| **v29** | **PVA-024 Artwork Sweep and Suppression** — 01:00 eligibility, missed-run repair, skip/failure reasons, no reminders, delete-all consequence, manual generation distinction, and Allow generation effect. | Audit gaps 8 and 4, sweep/suppression portion | v28, v20 | Queued | — | — | — | — | — | Standard v29 artifact set; sweep eligibility matrix; `docs/prototypes/v29/` |
| **v30** | **PVA-025 Daily Photo Completeness** — original/view/download, caption/timestamp/source, redating/reorder/cover/Trash, private image description, compression disclosure, pointer/button reorder, and modal focus return. | Audit gaps 9 and 13, photo-detail portion | v29 | Queued | — | — | — | — | — | Standard v30 artifact set; photo-control QA; `docs/prototypes/v30/` |
| **v31** | **PVA-026 Storage Capacity and Migration** — exact 7/8/9/10 GB media and 18/15/13/12 GB free thresholds, root/copy/target/failure/emergency states, and non-media continuity. | Audit gap 6, storage portion | v30; C-04 | Queued | — | — | — | — | — | Standard v31 artifact set; storage-threshold matrix; `docs/prototypes/v31/` |
| **v32** | **PVA-027 Backup, Restore, and Recovery Ceremony** — snapshot/check/sample/full-drill distinction, retention/due states, blocked three-step ceremony, and measured duration versus target. | Audit gaps 4 and 6, recovery portion | v31; C-04 | Queued | — | — | — | — | — | Standard v32 artifact set; recovery evidence-state QA; `docs/prototypes/v32/` |
| **v33** | **PVA-028 Restorable Export** — complete manifest, current/history/Trash/suppression separation, encrypted one-time-passphrase default, unencrypted warning, stages, ready/failed/expired/downloaded states, and lifecycle caveat. | Audit gap 4, Export portion | v32 | Queued | — | — | — | — | — | Standard v33 artifact set; export-state walkthrough; `docs/prototypes/v33/` |
| **v34** | **PVA-029 Access and Security Boundary** — unauthenticated/denied/MFA/session-expired/reauth states, no app password UI, accurate encryption/server-compromise/not-E2EE boundary, generic title and private/no-store intent. | Audit gap 10 | v33; C-04 | Queued | — | — | — | — | — | Standard v34 artifact set; access/security disclosure QA; `docs/prototypes/v34/` |
| **v35** | **PVA-030 Responsive and Accessibility Closeout** — 320/390 px, 200% text, 400% page zoom, browser/keyboard/screen-reader, modal focus, target sizes, 13 px metadata, contrast, non-color states, reduced motion, and final regression. | Audit gap 13 and cross-cutting acceptance | v34 and all prior QA | Queued | — | — | — | — | — | Standard v35 artifact set; complete closure audit; `docs/prototypes/v35/` |

“Standard vN artifact set” means a new immutable `index-vN.html`, `app-vN.js`, `styles-vN.css`, `README-vN.md`, `docs/prototypes/CALENDAR-UI-PROTOTYPE-vN.md`, `design-qa-vN.md`, and current-run evidence in `docs/prototypes/vN/`.

## 5. Prototype-representable requirement closure register

This is the exhaustive closure inventory derived from the audit's 38 `Partial`, seven `Placeholder`, and 12 `Missing` requirement rows. There are **57 rows**; each has exactly one primary closure version. `Open` means the v5 audit gap remains unproved until that version passes all gates.

### Product boundary and canonical record

| Requirement | V5 status | Prototype gap that must be observable | Primary version | Status |
| --- | --- | --- | --- | --- |
| `LID-SCP-001` | Partial | Private single-user access, denied/session states, and no sharing/public routes | v34 | Open |
| `LID-SCP-002` | Partial | Item-level redating with immutable Original Timestamp and correct day effects | v17 | Open |
| `LID-SCP-003` | Partial | Navigable source/Correction/revision/derived separation and version provenance | v18 | Open |
| `LID-SCP-004` | Partial | Removing/restoring the last live source hides/restores the day while history remains reachable | v19 | Open |

### Telegram photo capture

| Requirement | V5 status | Prototype gap that must be observable | Primary version | Status |
| --- | --- | --- | --- | --- |
| `LID-TG-001` | Partial | Valid/invalid private-chat authorization outcomes without exposing IDs/secrets | v12 | Open |
| `LID-TG-002` | Missing | Compressed-photo versus original-quality image-document guidance | v12 | Open |
| `LID-TG-003` | Missing | Accepted types/limits and specific rejection states with no false-import claim | v12 | Open |
| `LID-TG-004` | Missing | Waiting/failure/durable acknowledgement and private change-date link states | v12 | Open |
| `LID-TG-005` | Partial | Exact leading-date/caption grammar, albums, invalid formats, and backdating outcomes | v12 | Open |
| `LID-TG-006` | Missing | Preserved invalid/future-date item entering and leaving Needs Date Review | v11 | Open |
| `LID-TG-007` | Partial | Gallery and deterministic real-cover results after duplicate, redating, Trash, and restore transitions | v30 | Open |
| `LID-TG-008` | Missing | Global checksum: same-day Already imported/Add duplicate anyway and cross-day warn/permit | v13 | Open |
| `LID-TG-009` | Partial | Photo Caption is visible, searchable, match-identified, and explicitly excluded from AI | v21 | Open |

### VoiceNotes journal capture

| Requirement | V5 status | Prototype gap that must be observable | Primary version | Status |
| --- | --- | --- | --- | --- |
| `LID-VN-004` | Missing | Missing/untrusted creation timestamp goes to Needs Date Review without receipt-time invention | v11 | Open |
| `LID-VN-006` | Partial | Upstream revised/untagged/deleted lifecycle, retained revisions, and conflict state | v18 | Open |
| `LID-VN-007` | Placeholder | Source Suppression lifecycle, restore behavior, permanent opaque identity, and Allow re-import | v20 | Open |

### Manual upload and source management

| Requirement | V5 status | Prototype gap that must be observable | Primary version | Status |
| --- | --- | --- | --- | --- |
| `LID-UP-001` | Partial | Explicit global date choice, metadata/review, progress, interruption, retry, and durable success | v14 | Open |
| `LID-UP-002` | Partial | Original bytes/checksum identity, source title/provenance, and restoration/export representation | v14 | Open |
| `LID-UP-003` | Partial | Checksum-based duplicate decision, distinct Add anyway result, concurrency/idempotency explanation | v14 | Open |
| `LID-SRC-001` | Partial | Correction editor bound to immutable source revision with author/time/history/removal | v15 | Open |
| `LID-SRC-002` | Partial | Accessible complete diff and three materially different no-auto-merge resolutions | v16 | Open |
| `LID-SRC-003` | Placeholder | Atomic item redating preview, success/failure, old/new day links, unchanged Original Timestamp | v17 | Open |
| `LID-SRC-004` | Partial | Exact source-set binding, stale/invalidated results, and historical preservation after redating | v17 | Open |

### Reflection, browsing, and management

| Requirement | V5 status | Prototype gap that must be observable | Primary version | Status |
| --- | --- | --- | --- | --- |
| `LID-REF-001` | Partial | Month/year chooser plus council-resolved Today/attention/AI-cover status equivalence | v7 | Open |
| `LID-REF-002` | Partial | Approved cross-month chronological browsing, jump/load controls, and same Journal Day routing | v8 | Open |
| `LID-REF-003` | Partial | Private lexical/date/exact-tag/caption search, match reasons, Include history, and full state family | v21 | Open |
| `LID-REF-004` | Partial | Journal Day exposes functioning history/provenance and exceptional management states | v18 | Open |
| `LID-REF-005` | Partial | Measured theme/contrast/type/motion behavior without essential metadata below token floor | v35 | Open |
| `LID-REF-006` | Partial | Private image descriptions, focus contract, compact/zoom/keyboard/screen-reader/contrast evidence | v35 | Open |
| `LID-REF-007` | Partial | Functioning Correction, redating, deletion/restoration, suppression, export, and provider actions | v33 | Open |

### AI-derived text

| Requirement | V5 status | Prototype gap that must be observable | Primary version | Status |
| --- | --- | --- | --- | --- |
| `LID-AIT-002` | Partial | Qualified-option metadata shape, confirmation, future-only change, health/retry, and no silent fallback | v25 | Open |
| `LID-AIT-003` | Partial | Valid title, factual 80–140-word summary, 3–7 unique tags, Visual Brief, partial/invalid handling | v22 | Open |
| `LID-AIT-004` | Partial | Quiet-period waiting, late-source reset, 01:00 final refresh, race/stale completion outcomes | v23 | Open |
| `LID-AIT-005` | Partial | Independent title/summary/tag protect, stale suggestion, accept/keep/edit/resume behaviors | v22 | Open |
| `LID-AIT-006` | Partial | Clear lane/provider/retention/configuration boundary with no photo/caption input or fallback claim | v25 | Open |
| `LID-AIT-007` | Missing | Pending/timeout/rate-limit/provider/quota/refusal/source-race/retry/exhausted and safe attempt provenance | v23 | Open |

### Generated artwork

| Requirement | V5 status | Prototype gap that must be observable | Primary version | Status |
| --- | --- | --- | --- | --- |
| `LID-AIA-002` | Partial | Read-only brief history, source binding, Regenerate brief separated from Retry artwork | v26 | Open |
| `LID-AIA-003` | Partial | Manual preflight shows brief, provider/model, cost/budget, credential state, sparse warning | v26 | Open |
| `LID-AIA-004` | Partial | 01:00 eligibility/skips/failures/restart-repair evidence and no reminder behavior | v29 | Open |
| `LID-AIA-005` | Partial | Persistent non-photorealistic AI label and provenance across day/history/export representations | v28 | Open |
| `LID-AIA-006` | Missing | Neutral safety-refusal state with explicit Regenerate brief then Retry and no silent provider switch | v27 | Open |
| `LID-AIA-007` | Partial | Version compare/select, active/historical state, trigger/provider/brief/source/cost provenance | v28 | Open |
| `LID-AIA-009` | Placeholder | Move-all-art consequence, Artwork Suppression, Allow generation, and separate regeneration action | v29 | Open |
| `LID-AIA-010` | Partial | Stale artwork remains labeled, source bindings visible, redating removes invalid active art to history | v28 | Open |
| `LID-AIA-011` | Partial | Typed approved-option shape, health/cost/lifecycle/sweep eligibility and no free-form model entry | v25 | Open |

### Operations, privacy, recovery, and cost

| Requirement | V5 status | Prototype gap that must be observable | Primary version | Status |
| --- | --- | --- | --- | --- |
| `LID-OPS-001` | Missing | Unauthenticated, denied, MFA, seven-day session expiry, and reauthentication return states | v34 | Open |
| `LID-OPS-003` | Partial | Accurate secret/rotation/credential-state disclosure with no identifiers or values in browser fixtures | v34 | Open |
| `LID-OPS-004` | Missing | Application-controlled at-rest encryption, off-server recovery material, server-compromise, not-E2EE limits | v34 | Open |
| `LID-OPS-006` | Missing | Exact media/free-space watermarks, migration states, and emergency media rejection without deletion/downsampling | v31 | Open |
| `LID-OPS-010` | Placeholder | Trash expiry, restore, permanent-delete confirmation, and visibility/cover consequence preview | v19 | Open |
| `LID-OPS-011` | Placeholder | Snapshot, repository check, sample restore, full recovery, retention, and truthful evidence separation | v32 | Open |
| `LID-OPS-012` | Missing | Three-part Recovery Ceremony and launch-blocked/completed result without exposing key details | v32 | Open |
| `LID-OPS-013` | Placeholder | Complete export manifest, encryption choice/passphrase, progress/failure, checksum, expiry, removal | v33 | Open |
| `LID-OPS-014` | Placeholder | First-class System Health with required status vocabulary and durable evidence cards | v24 | Open |
| `LID-OPS-015` | Partial | Immediate private health state versus repeated-failure/recovery Telegram alerts; no habit reminders | v24 | Open |
| `LID-OPS-017` | Partial | Current/predicted/reconciled spend, 80% warning, hard block, allocation, and rollover states | v25 | Open |
| `LID-OPS-018` | Partial | Dependency-scoped safe outage actions and authentic-content availability across failures | v10 | Open |

## 6. Non-frontend evidence register

These 12 audit rows are **not prototype-completeness items**. Prototype versions may display truthful pending/failed/never-verified states, but their status here remains `Requires external evidence` until the separately governed implementation/evaluation work is executed. They must never be counted as passed because a screen exists.

| Requirement | Evidence needed outside the prototype | Related truthful UI package |
| --- | --- | --- |
| `LID-TG-010` | Exact Original preservation and local metadata-free derivative tests | v12, v30 |
| `LID-VN-001` | Synthetic VoiceNotes integration-spike result | v9, v24 |
| `LID-VN-002` | Webhook/MCP authority, retrieval, authentication, and idempotency evidence | v9, v24 |
| `LID-VN-005` | Replay-safe complete reconciliation and partial-enumeration tests | v18, v24 |
| `LID-AIT-001` | Approved text-model evaluation and signed qualification | v25 |
| `LID-AIA-001` | Blind artwork evaluation and signed qualification | v25 |
| `LID-OPS-002` | Callback host/path isolation, rate limiting, and sanitized logging tests | v34 |
| `LID-OPS-005` | Bounded memory staging, constrained decoder, swap refusal, and cleanup tests | v12, v31 |
| `LID-OPS-007` | Storage abstraction plus R2 migration/reconciliation/rollback proof | v31 |
| `LID-OPS-008` | Authenticated decrypt/private-cache deployment evidence | v6, v30, v34 |
| `LID-OPS-009` | Media-reference counting and last-reference physical deletion tests | v13, v19, v31 |
| `LID-OPS-016` | Allowlists, log retention, and forbidden-content tests | v6, v24, v34 |

## 7. Inherited guardrails

These nine rows were `Full` in the v5 audit. Every QA pass must regress the applicable guardrails; no later completeness work may reopen them accidentally.

| Requirement | Invariant to preserve |
| --- | --- |
| `LID-VN-003` | Only exact `life-in-days`, prospective Integration Activation, and no historical auto-import |
| `LID-UP-004` | No Word/PDF/photo journal ingestion and no blank browser journal composer |
| `LID-AIA-008` | A real Daily Photo always wins Calendar Cover precedence |
| `LID-DEF-001` | No automatic historic import |
| `LID-DEF-002` | No coaching, reminders, prompts, streaks, reports, or habit mechanics |
| `LID-DEF-003` | No semantic/conversational/AI search |
| `LID-DEF-004` | No year mosaic, media wall, maps, native app, or offline-first feature |
| `LID-DEF-005` | No PDF/Word/OCR/RAW ingestion or print-book claim |
| `LID-DEF-006` | No fuzzy/additional VoiceNotes tag configuration |

Also regress: no sharing/public links/multi-user UI; no web photo upload; no AI access to real-photo bytes, thumbnails, metadata, identifiers, captions, or photo-derived descriptions; no hidden provider fallback; no unsupported production/deployment/recovery claim.

## 8. Per-version council worksheet

Copy this worksheet into the end of the iteration ledger when a version starts; complete it without removing older entries.

```markdown
### YYYY-MM-DD — vN — <feature package> — started

- Product Manager: <agent>; P gate: IP
- UI/UX Designer: <agent>; D gate: IP
- Project Manager: <agent>; tracker owner
- Implementing agent: <agent>
- Independent QA agent: not assigned until implementation is ready
- PRD requirements: <IDs>
- UX contracts: <IDs/sections>
- Included scenarios: <normal, empty, loading, error, interruption, destructive, responsive>
- Explicit exclusions: <outside-UI evidence and deferred scope>
- Council decision: pending
- Prototype files: pending
- QA evidence: pending
- Commit: pending
- Disposition: open
```

```markdown
### YYYY-MM-DD — vN — <feature package> — QA disposition

- Council approval: <A/B plus decision link>
- Implementation evidence: <paths>
- QA agent: <new agent identity>
- Checks performed: <routes/interactions/viewports/a11y/regression>
- Findings: <none or issue IDs>
- QA verdict: <Pass/Fail>
- Commit: <hash, only when frozen>
- Next version released from queue: <vN+1 or none>
```

## 9. Append-only iteration ledger

Entries below are chronological evidence. **Never edit, reorder, or delete an existing entry.** Corrections are new entries that name what they supersede. Package status and gate cells in Sections 4 and 5 may be updated to summarize the latest ledger evidence.

### 2026-08-14 — v5 — audited baseline frozen

- Baseline prototype: `prototypes/calendar-ui/index-v5.html`, `app-v5.js`, `styles-v5.css`, and `README-v5.md`.
- Baseline prototype commit: `00e5689` (`prototype: add private settings suite v5`).
- Audit: [Prototype v5 feature audit](../audits/PROTOTYPE-V5-FEATURE-AUDIT.md) at commit `f74455f`.
- Audit inventory: 78 PRD requirements = 9 Full, 38 Partial, 7 Placeholder, 12 Missing, and 12 Outside UI. The audit summary's early “10 missing” value is a numerical typo; the requirement matrix and arithmetic establish 12 Missing and therefore 57 prototype-representable gaps.
- Decision: v5 remains immutable. Completeness iterations begin at v6; no baseline behavior is called implemented, deployed, secure, persistent, or production-ready.

### 2026-08-14 — tracker initialized

- Project Manager created this authoritative prototype-completeness tracker from the v5 audit, PRD, UX specification, existing prototype documentation, document index, and Git history.
- Version sequence established: v6 through v20, one immutable version per feature package.
- Every prototype-representable audit requirement has exactly one primary closure version; non-frontend evidence and inherited/deferred guardrails are tracked separately.
- First releasable package: v6 Private deterministic Search, pending Product, Design, and Council gates.

### 2026-08-14 — roadmap reconciliation supersedes the initial v6–v20 sequence

- Supersedes only the version sequence and first-package scope in the preceding `tracker initialized` entry; the v5 baseline, 57-row closure inventory, evidence boundary, and mandatory gates remain in force.
- Product Manager decomposed the audit into 30 stable features, one immutable version each, v6 through v35. This prevents broad packages from receiving narrow QA and makes dependencies explicit.
- Product Council adopted decisions C-01 through C-04: progressive-disclosure Calendar labels, cross-month Monthly Almanac as the chronological Timeline experience, approved switcher/navigation, and synthetic truthful states for unresolved technical gates.
- Complete lexical Search moved to v21 because current/history/Trash/Suppression semantics depend on v18 through v20. V6 is now strictly Private Search State.
- All 57 prototype-representable audit rows retain exactly one primary closure version under the reconciled roadmap. The 12 Outside UI requirements remain outside prototype proof.

### 2026-08-14 — v6 — PVA-001 Private Search State — started

- Product Manager agent: `/root/prototype_product_manager`; **P gate: A**.
- UI/UX Designer agent: `/root/prototype_ui_designer`; **D gate: A**.
- Project Manager agent: `/root/prototype_project_manager`; tracker owner.
- Implementing agent: root prototype agent; **I gate: IP**.
- Independent QA agent: to be newly assigned only after the v6 candidate and implementation evidence are ready; **Q gate: —**.
- Council review: **C gate: A**. The scope is dependency-safe, materially closes the urgent privacy defect, and does not falsely claim complete `LID-REF-003` coverage.
- Requirement slice: prototype portion of `LID-REF-003`, with truthful UI states related to `LID-OPS-008` and `LID-OPS-016`. Deployment cache/log enforcement remains externally unverified.
- Included acceptance: remove legacy `q` from the current URL without preserving it in browser history; never serialize a new query into URL, page title, local/session storage, telemetry, or referrers; hold query only in live page memory; submit and clear in place; Back/Forward must not resurrect query text; reload returns to the honest initial state; initial Search explains “Literal text, dates, exact tags, and photo captions. No AI or image search.” and contains no suggested/recent-memory content.
- Explicit exclusion: exact date/tag/caption execution, match reasons, Include history, revision/Trash labels, and complete updating/error semantics are **not** accepted in v6; they are v21 after v18–v20.
- Experience acceptance: wide and compact layouts preserve the approved shell; the search field has an explicit label; status changes use a live region; submit, clear, Back/Forward, and restored focus are keyboard operable; personal query text is not copied into a toast or page heading.
- Prototype files: pending v6 implementation.
- QA evidence: pending fresh QA agent.
- Commit: pending.
- Disposition: implementation in progress; do not increment to v7 unless independent QA records `Pass` and v6 is frozen.

### 2026-08-14 — v6 acceptance clarification

- This entry corrects two phrases in the preceding v6-started ledger entry without rewriting it.
- The v6 initial state explains the **current** literal scope—title, summary, stored topics, and displayed journal text—and explicitly identifies Photo Captions, date/exact-tag filtering, and history as v21 work. It does not claim those fields are executable in v6.
- Back/Forward never resurrects a term from URL or history state. While the same page instance remains open, the term intentionally remains in live JavaScript memory through internal navigation and is restored when returning to Search. Reload clears it.
- This clarification aligns the ledger with the approved v6 council contract and does not change the package boundary.

### 2026-08-14 — v6 — PVA-001 Private Search State — QA disposition

- Council approval: **A**; [`../prototypes/v6/COUNCIL-v6.md`](../prototypes/v6/COUNCIL-v6.md).
- Implementation evidence: `prototypes/calendar-ui/index-v6.html`, `app-v6.js`, `styles-v6.css`, `README-v6.md`, [`../prototypes/CALENDAR-UI-PROTOTYPE-v6.md`](../prototypes/CALENDAR-UI-PROTOTYPE-v6.md), and current-run captures under `docs/prototypes/v6/`.
- Independent QA agent: `/root/v6_independent_qa`.
- Checks performed: syntax/diff, fresh initial state, button and Enter submission, no-result, Clear, URL/title/history/storage privacy, legacy-query stripping, Back/Forward, reload, 1280/390/320 layouts, semantics/focus, console, inherited Calendar/Almanac/Settings, and scope boundary.
- Finding resolved in candidate: Enter on the labelled Search input initially failed to submit; the shared keyboard/form path was added and fully retested without incrementing the version.
- Open findings: Critical 0; High 0; Medium 0; Low 0.
- QA verdict: **Pass**; [`../../design-qa-v6.md`](../../design-qa-v6.md).
- Commit: recorded in the following freeze entry after Git creates the immutable identifier.
- Next version released from queue: v7 `PVA-002 Calendar Contract Completion`.
