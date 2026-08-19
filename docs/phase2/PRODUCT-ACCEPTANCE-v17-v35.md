# Life in Days — product acceptance contract v17–v35

- **Created:** 2026-08-19
- **Owner:** Product Manager agent
- **Status:** Acceptance baseline for Product Council review; no implementation, QA, freeze, or publication is claimed by this file
- **Frozen source baseline:** v16 at `01d1f054a12773e07f91096b8d76b0c5f4064329`
- **Execution range:** 19 additive prototype packages, v17 through v35
- **Primary closure scope:** 41 still-open prototype-representable rows from the v5 feature audit

This document turns the remaining feature-audit gaps into observable product acceptance. It is additive to, and does not modify, the [frozen completeness tracker](../project/PROTOTYPE-COMPLETENESS-TRACKER.md), [v5 feature audit](../audits/PROTOTYPE-V5-FEATURE-AUDIT.md), or [v17–v35 project tracker](PROTOTYPE-COMPLETENESS-PROJECT-TRACKER-v17-v35.md).

The prototype may establish only a deterministic, synthetic frontend representation: what the owner can see, choose, cancel, retry, compare, and understand. It cannot establish backend execution, persistence, integration correctness, provider qualification, security controls, backup or restore validity, deployment, formal accessibility conformance, production privacy, or production readiness.

## 1. Audit reconciliation and counting rule

The v5 audit is a historical baseline, not a current-state report. Its 78-row inventory was:

| V5 classification | Rows | Current interpretation |
| --- | ---: | --- |
| Full or correctly excluded | 9 | Inherited guardrails; regress in every applicable version |
| Partial | 38 | Prototype-representable gap at v5 |
| Placeholder | 7 | Prototype-representable gap at v5 |
| Missing | 12 | Prototype-representable gap at v5 |
| Outside UI | 12 | Requires separately governed external evidence |
| **Total** | **78** | **57 prototype-representable gaps + 9 inherited guardrails + 12 Outside UI** |

V6–v16 subsequently closed 16 primary rows at the bounded frontend-prototype level:

- `LID-TG-001`, `LID-TG-002`, `LID-TG-003`, `LID-TG-004`, `LID-TG-005`, `LID-TG-006`, and `LID-TG-008`;
- `LID-VN-004`;
- `LID-UP-001`, `LID-UP-002`, and `LID-UP-003`;
- `LID-SRC-001` and `LID-SRC-002`;
- `LID-REF-001` and `LID-REF-002`; and
- `LID-OPS-018`.

The arithmetic is therefore `57 - 16 = 41` open prototype-representable rows. Those 41 rows have exactly one primary closure package in v17–v35:

| Version | Primary requirements | Row count |
| --- | --- | ---: |
| v17 | `LID-SCP-002`, `LID-SRC-003`, `LID-SRC-004` | 3 |
| v18 | `LID-SCP-003`, `LID-VN-006`, `LID-REF-004` | 3 |
| v19 | `LID-SCP-004`, `LID-OPS-010` | 2 |
| v20 | `LID-VN-007` | 1 |
| v21 | `LID-TG-009`, `LID-REF-003` | 2 |
| v22 | `LID-AIT-003`, `LID-AIT-005` | 2 |
| v23 | `LID-AIT-004`, `LID-AIT-007` | 2 |
| v24 | `LID-OPS-014`, `LID-OPS-015` | 2 |
| v25 | `LID-AIT-002`, `LID-AIT-006`, `LID-AIA-011`, `LID-OPS-017` | 4 |
| v26 | `LID-AIA-002`, `LID-AIA-003` | 2 |
| v27 | `LID-AIA-006` | 1 |
| v28 | `LID-AIA-005`, `LID-AIA-007`, `LID-AIA-010` | 3 |
| v29 | `LID-AIA-004`, `LID-AIA-009` | 2 |
| v30 | `LID-TG-007` | 1 |
| v31 | `LID-OPS-006` | 1 |
| v32 | `LID-OPS-011`, `LID-OPS-012` | 2 |
| v33 | `LID-REF-007`, `LID-OPS-013` | 2 |
| v34 | `LID-SCP-001`, `LID-OPS-001`, `LID-OPS-003`, `LID-OPS-004` | 4 |
| v35 | `LID-REF-005`, `LID-REF-006` | 2 |
| **Total** | **41 unique primary rows** | **41** |

Search privacy was materially repaired in v6, Calendar contract completion in v7, cross-month Almanac in v8, readiness and application-shell states in v9–v10, Needs Date Review in v11, Telegram companion and duplicate handling in v12–v13, durable-looking manual upload in v14, Correction editing in v15, and source-conflict resolution in v16. Those features are inherited regression scope. They must not be rebuilt, renumbered, or counted again as v17–v35 primary closures.

## 2. Acceptance language and universal invariants

The words **must**, **does not**, and **only** below are observable acceptance conditions. A version passes Product acceptance only when every condition in its section can be demonstrated with fictional fixtures and a user-visible state transition or disclosure.

Every v17–v35 package must also satisfy these invariants:

1. Use fictional/synthetic content only. No real journal, photo, caption, timestamp, identifier, credential, recovery material, provider secret, or account detail may appear in the browser, evidence, URL, title, storage, console-shaped output, commit, or GitHub.
2. Keep authentic source content distinct from Corrections, revisions, generated text, generated artwork, and operational evidence.
3. Preserve fixed `Asia/Kolkata` Journal Dates and immutable Original Timestamps. Never use receipt time to invent a source time.
4. Keep a real Daily Photo ahead of Generated Artwork for Calendar Cover precedence.
5. Do not expose private terms or content through URL/query state, page title, browser history, storage, referrer, telemetry-shaped output, logs, or assertive live-region repetition.
6. Provide normal, empty, loading or in-progress, error, retry, cancel, Back, and interrupted states where the feature can encounter them. A generic toast is not a completed domain action.
7. Preserve readable authentic material when a derived or operational dependency fails. Do not imply hidden fallback, silent provider switching, unbounded retry, or successful work that the fixture does not show.
8. All destructive actions require an explicit consequence preview and a safe Cancel path. Focus returns to the control that opened a modal or sheet.
9. New essential text is at least 13 px. New controls have at least a 24 px target and prefer 44 px. Meaning is not conveyed by color alone; keyboard, visible focus, forced-colors, and reduced-motion equivalents are required.
10. At minimum, verify each package at wide, medium, 390 px, and 320 px effective widths without horizontal page scrolling; use the relevant compact landscape case when a dialog, table, diff, or media viewer could overflow.
11. Preserve the nine inherited v5 guardrails: exact prospective `life-in-days`; no unsupported journal/file/photo ingestion or blank composer; real-photo cover precedence; no historical auto-import, coaching/reminders/streaks/reports, semantic/AI search, year mosaic/media wall/maps/native/offline-first scope, PDF/Word/OCR/RAW/print-book scope, or fuzzy/additional VoiceNotes tags.
12. Never describe a synthetic result as implemented, persisted, encrypted, authenticated, backed up, restored, deployed, accessible, production-safe, or production-ready.

## 3. Exact per-version user-visible acceptance

### V17 — PVA-012 Atomic Redating

**Primary rows:** `LID-SCP-002`, `LID-SRC-003`, `LID-SRC-004`.

- **Entry and identity:** **Change Journal Date** opens an item-level flow that names the Source Item, current Journal Date, proposed destination date, and immutable Original Timestamp. It never presents redating as editing Original Timestamp.
- **Validation:** the date uses fixed `Asia/Kolkata`; a future date is rejected before confirmation with a specific explanation and no represented mutation.
- **Preview:** before commitment, the owner can compare both old and new Journal Days, whether either day becomes visible or hidden, cover changes, exact generated-field staleness, source-set membership, artwork eligibility, and artwork moved to history.
- **Atomic outcome:** Cancel and represented failure leave every displayed old/new-day fact unchanged. Success applies exactly once: the source leaves the old day, enters the new day, Original Timestamp remains unchanged, derived effects update together, and links to both affected days appear.
- **Interruption:** a pending confirmation cannot be submitted twice; an interrupted or failed attempt returns to a retryable preview without displaying a partial move.

### V18 — PVA-013 History and Provenance

**Primary rows:** `LID-SCP-003`, `LID-VN-006`, `LID-REF-004`.

- **Reachable histories:** the owner can open global, Journal Day, item, field, and artwork history from the relevant surface and return to the exact origin.
- **Typed timeline:** chronological events identify Source Item, Source Revision, Correction, generated-field version, artwork version, redating, lifecycle action, actor class, and synthetic timestamp without merging authentic and derived entities.
- **Lineage:** Current, Historical, Revised upstream, Untagged upstream, Deleted upstream, Conflict, Correction, and Derived Artifact states are visibly distinct; a selected record exposes what preceded and followed it.
- **Read-only by default:** browsing history changes no current state. Any permitted selection or restoration begins with a separate explicit action and consequence review.
- **Hidden-day access:** history remains reachable when the current Journal Day has no live sources. Provenance uses safe labels and never exposes credential values, raw internal identifiers, or private payloads in log-shaped detail.

### V19 — PVA-014 Trash

**Primary rows:** `LID-SCP-004`, `LID-OPS-010`.

- **Trash list:** each recoverable item shows type, source, Journal Date, deletion time, and the exact remaining portion of the 30-day recovery window.
- **Ordinary-view effect:** trashed items are absent from Calendar, Almanac, ordinary Search, and live Journal Day content; history remains reachable. Removing the final live source hides the ordinary day.
- **Restore:** Restore previews the destination day, visibility, cover, and stale-derived effects, then recalculates those effects on success and returns a link to the restored item/day.
- **Permanent deletion:** **Delete permanently** requires a focused confirmation that names the affected record and visible consequences. Cancel changes nothing. Copy says only what the prototype can show and does not promise physical media deletion, backup erasure, or shared-media deletion.
- **Shared-media safety:** a fixture with another live reference explicitly shows that the shared media remains available after one reference is deleted.

### V20 — PVA-015 Suppressions

**Primary row:** `LID-VN-007`.

- **Separate registers:** Source Suppressions and Artwork Suppressions are separate views and never imply that one record controls the other.
- **Opaque identity:** a Source Suppression shows only a safe opaque identity and lifecycle metadata; it does not show raw upstream IDs, credentials, or journal text.
- **Lifecycle:** normal, empty, loading, failure, and retry states are available. **Allow re-import** removes only the Source Suppression and explicitly says re-import may occur only if a future eligible source is encountered; it does not promise or simulate an immediate import.
- **Artwork boundary:** **Allow generation** removes only the Artwork Suppression and does not immediately generate artwork. Manual generation remains a separate deliberate action.
- **Cancel and history:** every removal has a consequence review and Cancel path; suppression creation/removal remains visible in history.

### V21 — PVA-016 Complete Lexical Search

**Primary rows:** `LID-TG-009`, `LID-REF-003`.

- **Deterministic scope:** Search covers current journal text, title, summary, exact tags, exact dates/date ranges, and Photo Captions. It explicitly says **No AI or image search**.
- **History control:** **Include history** is off by default. When enabled, matched revisions and Trash items are labeled as historical and never appear as current.
- **Results:** every result shows why it matched, a bounded snippet, source/field identity, Journal Date, and a destination that focuses the matching context. Photo Caption matches are identified as captions.
- **State family:** honest initial scope, index updating, results, no results, failure, preserved in-page query, and retry are all exercisable. A retry does not duplicate results or lose the current in-memory query.
- **Privacy:** the query never appears in URL parameters, path, title, browser history state, local/session storage, network-shaped output, telemetry-shaped output, or logs. Reload clears it. Photo Captions and private image descriptions are never shown as AI inputs.

### V22 — PVA-017 Generated-field Lifecycle Parity

**Primary rows:** `LID-AIT-003`, `LID-AIT-005`.

- **Independent fields:** Title, Summary, and Tags each display their own Absent, Current, Stale suggestion, Edited, Protected, Invalid, and Partial state without silently changing the other fields.
- **Valid output:** a current synthetic Summary contains 80–140 words; Tags contain 3–7 unique values; Title, Summary, Tags, and Visual Brief remain factual to the displayed synthetic sources.
- **Replacement review:** Current and Suggested values are compared without replacement. **Use suggestion**, **Keep current**, **Edit**, and **Resume automatic updates** have distinct represented outcomes.
- **Protection:** editing protects only that field; resuming automation requires explicit confirmation and does not immediately overwrite the current value.
- **Validation/history:** invalid or partial output cannot become Current. Inline validation explains the correction, while prior and rejected values remain in generated-field history with safe provenance.

### V23 — PVA-018 AI Text Processing States

**Primary rows:** `LID-AIT-004`, `LID-AIT-007`.

- **Schedule:** the owner can inspect 15-minute quiet-period waiting, late-source timer reset, and the 01:00 `Asia/Kolkata` final refresh as distinct synthetic states.
- **Attempt states:** Waiting, Generating, Current, Stale, Refusal, Schema invalid, Partial, Timeout, Rate limited, Provider unavailable, Credential attention, Quota blocked, Source race, Retry available, and Exhausted are separately selectable and described neutrally.
- **Race safety:** a completion bound to an older source set becomes historical/stale and cannot attach to the newer source set or replace Current content.
- **Recovery:** retries are explicit and bounded; no state claims silent fallback or switches providers. A late retry cannot create two Current results.
- **Continuity/provenance:** authentic journals remain readable throughout. Attempt provenance shows safe status, attempt time, trigger, and source-version labels without journal text, credentials, or internal identifiers.

### V24 — PVA-019 System Health Foundation

**Primary rows:** `LID-OPS-014`, `LID-OPS-015`.

- **Factual cards:** System Health has distinct Integration, Job, Provider, Backup, Restore, Capacity, and Spend cards with freshness and a single safe next action where attention is required.
- **Exact vocabulary:** only **Healthy**, **Attention**, **Failed**, **Blocked**, **Not configured**, and **Never verified** are used for top-level health; decorative color is supplemented by icon/text.
- **Evidence separation:** snapshot creation, repository check, sample restore, and full recovery are not collapsed into one “backup healthy” claim. Synthetic or unverified evidence is labeled as such.
- **Safe detail:** cards expose no secret, token, upstream ID, account identifier, recovery location, private query, or payload. Failure does not hide authentic content.
- **Alerts:** immediate private UI health, repeated-failure Telegram alert, and recovery Telegram alert are distinct. No habit reminder, engagement nudge, daily prompt, or success notification is introduced.

### V25 — PVA-020 Provider Settings and Privacy

**Primary rows:** `LID-AIT-002`, `LID-AIT-006`, `LID-AIA-011`, `LID-OPS-017`.

- **Independent lanes:** Text AI and Artwork AI have independent provider/configuration cards. Choices are typed; no free-form provider/model entry exists.
- **Qualification truth:** the default state is **Evaluation incomplete**. Only explicitly fictional **Synthetic qualified option** fixtures are selectable; no real provider is presented as qualified.
- **Metadata:** each option shows role, cost basis, region, retention boundary, lifecycle state, sweep eligibility, and health. Credential state is only **Available**, **Missing**, or **Needs attention** and never reveals a value.
- **Change contract:** selecting a different future provider requires confirmation, is future-only, and has no hidden fallback. It does not rewrite current or historical outputs.
- **Data lanes:** Text AI may receive only the displayed permitted journal-derived text fields; Artwork AI may receive only the displayed Visual Brief. Real photos, thumbnails, metadata, identifiers, captions, and private photo descriptions never enter either lane.
- **Budget:** show a `$5.00` total monthly ceiling, `$0.50` Text allocation, `$4.50` Artwork allocation, current/predicted/reconciled spend, an 80% warning, hard block, and rollover. A blocked request remains blocked rather than silently using another lane or provider.
- **Lifecycle:** configuration is manual-only; health, retry, and future eligibility are visible without implying automatic qualification or production connectivity.

### V26 — PVA-021 Artwork Request Confirmation

**Primary rows:** `LID-AIA-002`, `LID-AIA-003`.

- **Eligibility:** fewer than 5 journal words disables the request with a reason; 5–19 words allows a deliberate sparse-text path only after a visible warning; 20 or more words uses the standard path.
- **Required preflight:** every manual request shows a read-only Visual Brief, bound source set, provider/configuration, credential state, predicted cost, remaining Artwork allocation, and the actual Calendar Cover effect before any represented request starts.
- **Privacy:** preflight states explicitly that raw journal text, real photos, thumbnails, captions, identifiers, and photo-derived descriptions are not sent in the artwork lane.
- **Controls:** **Cancel** sends nothing and returns focus. **Regenerate Visual Brief** creates a new brief version only and starts no artwork attempt. **Generate artwork** is disabled whenever credential, budget, eligibility, or brief validity blocks it.
- **History:** prior briefs remain inspectable and the selected brief/source binding is unambiguous.

### V27 — PVA-022 Artwork Failure and Budget States

**Primary row:** `LID-AIA-006`.

- **Attempt family:** Requested, Generating, Success, Safety refusal, Timeout, Rate limited, Credential attention, Provider unavailable, Quota blocked, Invalid result, and Budget blocked are distinct and exercisable.
- **Refusal:** safety-refusal copy is neutral, does not expose private text, and provides **Regenerate Visual Brief** before a new **Retry artwork** action.
- **Recovery:** Retry is explicit and bounded; it never silently changes providers, bypasses a budget/credential block, or loops indefinitely.
- **Continuity:** authentic journals and the current reflection remain readable in every failure state.
- **Cardinality:** one successful attempt creates exactly one retained artwork version; an interrupted or failed attempt creates no false Current artwork.

### V28 — PVA-023 Artwork Version and Staleness

**Primary rows:** `LID-AIA-005`, `LID-AIA-007`, `LID-AIA-010`.

- **Versions:** the owner can compare retained artwork versions and explicitly select one as Active; all others remain Historical. Selection creates a visible history event.
- **Provenance:** each permitted-context version view shows the persistent non-photorealistic **AI-generated artwork** label plus trigger, provider/configuration, brief version, source binding, status, and synthetic cost.
- **Staleness:** a same-day source change immediately leaves the artwork visible but marks it Stale. It is never silently described as current.
- **Redating:** if a bound source is redated away, invalid Active artwork moves to History rather than disappearing; the affected source binding remains inspectable.
- **Cover:** a real Daily Photo wins Calendar Cover precedence even when a generated version is Active.

### V29 — PVA-024 Artwork Sweep and Suppression

**Primary rows:** `LID-AIA-004`, `LID-AIA-009`.

- **01:00 eligibility:** the synthetic sweep shows why each Journal Day was Eligible, Skipped, Failed, Missed, Repaired after restart, Suppressed, or Budget blocked at 01:00 `Asia/Kolkata`.
- **Cardinality:** one eligible successful day receives exactly one retained sweep result; retry/repair does not duplicate it.
- **No reminder behavior:** the sweep and its status never create a habit reminder, prompt, nudge, or routine-success message.
- **Delete-all consequence:** moving the final artwork version to Trash previews that an Artwork Suppression will be created and what cover/history effects follow.
- **Allow generation:** removing the suppression changes future eligibility only; it does not generate artwork immediately. Manual request and scheduled sweep remain separate actions.

### V30 — PVA-025 Daily Photo Completeness

**Primary row:** `LID-TG-007`. `LID-TG-009` and `LID-REF-006` are inherited/supporting regression scope and are not counted twice.

- **Photo detail:** each Daily Photo supports View, Original-quality disclosure, Download representation, Caption, Original Timestamp, source, Journal Date, duplicate provenance, and private accessibility description.
- **Manipulation:** pointer and button alternatives support reorder; explicit actions support Set as cover, Change Journal Date, Move to Trash, and Restore with consequence previews.
- **Determinism:** cover behavior stays correct after reorder, duplicate-add, redating, Trash, and restore. A real photo always wins over Generated Artwork.
- **Privacy and quality:** the private description is local accessibility text and explicitly never an AI input. Compression versus original-quality handling is disclosed without claiming exact stored bytes.
- **Viewer accessibility:** the lightbox/modal has sensible initial focus, keyboard operation, Escape/Close, and exact return focus; 320 px, 390 px, and relevant landscape layouts do not clip actions or media metadata.

### V31 — PVA-026 Storage Capacity and Migration

**Primary row:** `LID-OPS-006`.

- **Exact boundary fixtures:** media usage states exist at 7, 8, 9, and 10 GB, paired with host-free states at 18, 15, 13, and 12 GB respectively.
- **State progression:** the owner can inspect Root storage, Provision copy target, Dual-write, Target proof, Failed migration, and Emergency media stop as distinct states.
- **Emergency behavior:** at the hard boundary, new media is rejected with a specific explanation while non-media journal operations remain available. Existing media is neither deleted nor silently downsampled.
- **Truthfulness:** migration, reconciliation, rollback, and storage durability are explicitly **Never verified** or synthetic; the screen does not claim that files moved or that an R2 target works.
- **Recovery:** each failure state offers one safe next action without exposing paths, credentials, bucket names, or identifiers.

### V32 — PVA-027 Backup, Restore, and Recovery Ceremony

**Primary rows:** `LID-OPS-011`, `LID-OPS-012`.

- **Evidence types:** Snapshot, Repository check, Sample restore, and Full recovery drill have separate cards, results, timestamps, freshness/due states, and failure states. One cannot substitute for another.
- **Retention:** the represented policy is 48 hourly, 30 daily, and 12 monthly restore points; current evidence is labeled synthetic and does not claim those points exist.
- **Recovery objective:** measured synthetic drill duration is compared with a 4-hour target without converting a sample restore into a full recovery claim.
- **Three-part ceremony:** Password-manager record, Offline recovery material, and Decrypt-and-restore exercise are individually required. Launch remains **Blocked** until all three are complete.
- **Privacy:** the ceremony never shows an actual password, key, recovery phrase, storage location, or secret identifier. Cancel/back leaves completion state unchanged.

### V33 — PVA-028 Restorable Export

**Primary rows:** `LID-REF-007`, `LID-OPS-013`.

- **Manifest:** review separates current sources, source revisions, Corrections, redating events, current/historical generated fields, current/historical artwork, Trash, Source Suppressions, Artwork Suppressions, originals, browsable representation, and checksums.
- **Encryption choice:** **AES-256 encrypted** is the default represented option. A one-time passphrase can be pasted/revealed only by deliberate action and is not retained in represented storage. Choosing Unencrypted requires a fresh warning that is never remembered.
- **Progress:** named stages show Preparing manifest, Collecting originals, Building archive, Encrypting, Checksumming, and Ready; failure or partial output never appears Complete.
- **Lifecycle:** Ready, Failed, Expired, Downloaded, and Removed are distinct. Retry and cleanup are explicit; the first-download/one-hour removal contract is labeled a synthetic, technically unverified lifecycle.
- **Truthfulness:** download and checksum interactions demonstrate UI behavior only and do not claim a real encrypted archive, restorable content, server removal, or round-trip recovery.

### V34 — PVA-029 Access and Security Boundary

**Primary rows:** `LID-SCP-001`, `LID-OPS-001`, `LID-OPS-003`, `LID-OPS-004`.

- **Access states:** Unauthenticated, Access denied, MFA required, Seven-day session expired, Reauthentication in progress, and Return to intended private location are distinct and keyboard-operable.
- **Complete coverage:** Calendar, Almanac, Search, Journal Day, history, media, Settings, health, recovery, and export all enter an access state rather than rendering private content when the fixture denies access.
- **Privacy on redirect:** denied or expired redirects use generic title/URL state and contain no Journal Date, query, source, photo, caption, or private route detail. Reauthentication return restores only a safe intended location, never an unsafely serialized private payload.
- **Boundary:** no application account, password-reset, sharing, invite, public link, or multi-user UI is introduced; the screen explains that access is external to the app prototype.
- **Security disclosure:** copy distinguishes application-controlled encryption at rest, off-server recovery material, and the risk of a compromised running server, and says plainly that the design is not end-to-end encrypted or zero knowledge.
- **Secrets:** credential health and rotation disclosures are generic and never reveal a secret value, account identifier, recovery identifier, or production configuration. Every control is labeled synthetic/unverified.

### V35 — PVA-030 Responsive and Accessibility Closeout

**Primary rows:** `LID-REF-005`, `LID-REF-006`.

- **Responsive evidence:** exercise 320 px, 390 px, compact landscape, 200% text, and 400% page-zoom/reflow equivalents across every v17–v35 feature family. No essential content or action is lost and no horizontal page scrolling is required.
- **Input and semantics:** Calendar, Almanac, Search, management tables, diffs, provider cards, health, recovery, export, media reorder, dialogs, and lightboxes work by keyboard with visible focus, sensible initial focus, focus trap where modal, Escape/Close, and exact return focus.
- **Visual accessibility:** essential metadata is at least 13 px; targets are at least 24 px and prefer 44 px; text contrast is at least 4.5:1 and large/non-text UI at least 3:1 where applicable; state never relies on color alone.
- **Preferences:** forced-colors and reduced-motion retain equivalent meaning and operation; light/dark themes, long text, and browser variations remain usable.
- **Assistive boundary:** screen-reader/browser/native-zoom evidence names the tools actually exercised and plainly lists untested native behavior. The result is not described as formal WCAG conformance.
- **Final regression:** all 41 primary rows, 16 inherited v6–v16 closures, 9 inherited v5 guardrails, all privacy boundaries, and every state family pass with zero unresolved Critical or High findings.

## 4. Twelve Outside UI rows — never closable by prototype

These rows remain `Requires external evidence` even if a related prototype screen is excellent. A Product, Design, Council, or QA pass must not count them among the 41 closures.

| # | Requirement | External evidence required | Truthful related UI |
| ---: | --- | --- | --- |
| 1 | `LID-TG-010` | Exact Original preservation and local metadata-free derivative tests | v30 |
| 2 | `LID-VN-001` | Synthetic VoiceNotes integration-spike result | v24 |
| 3 | `LID-VN-002` | Webhook/MCP authority, retrieval, authentication, and idempotency evidence | v24 |
| 4 | `LID-VN-005` | Replay-safe complete reconciliation and partial-enumeration tests | v18, v24 |
| 5 | `LID-AIT-001` | Approved text-model evaluation and signed qualification | v25 |
| 6 | `LID-AIA-001` | Blind artwork evaluation and signed qualification | v25 |
| 7 | `LID-OPS-002` | Callback host/path isolation, rate limiting, and sanitized logging tests | v34 |
| 8 | `LID-OPS-005` | Bounded memory staging, constrained decoder, swap refusal, and cleanup tests | v31 |
| 9 | `LID-OPS-007` | Storage abstraction plus R2 migration, reconciliation, and rollback proof | v31 |
| 10 | `LID-OPS-008` | Authenticated decrypt/private-cache deployment evidence | v21, v30, v34 |
| 11 | `LID-OPS-009` | Media-reference counting and last-reference physical-deletion tests | v19, v31 |
| 12 | `LID-OPS-016` | Allowlists, log retention, and forbidden-content tests | v21, v24, v34 |

Permitted prototype language includes **Synthetic**, **Not configured**, **Never verified**, **Failed**, **Blocked**, and **Requires external evidence**. Prohibited conclusions include “integration works,” “encrypted,” “authenticated,” “backed up,” “restored,” “secure,” “deployed,” “production private,” or “ready” unless the separately governed external evidence exists.

## 5. Product Council, QA, freeze, push, and readback gates

Every version must pass the following sequence independently. Approval of one package does not approve its successor.

### P — Product acceptance

- The Product Manager records the primary IDs, supporting regressions, included states, explicit exclusions, privacy boundary, destructive/recovery behavior, and every observable condition from the relevant section above.
- Acceptance must include normal, empty, in-progress, failure, retry, cancel, interruption, historical, destructive, and compact behavior where applicable.
- The P gate is `A` only when there is no unresolved product meaning, qualification, security, recovery, privacy, or scope ambiguity.

### D — Experience contract

- The expert UI/UX Designer records information hierarchy, state inventory, exact labels, transitions, focus entry/return, Back/Escape behavior, responsive rules, accessibility annotations, and synthetic-fixture rules.
- At least two viable approaches are evaluated for the package's highest-risk interaction, with the chosen rationale recorded.
- Accessibility is a per-package gate; v35 is a cross-version closeout, not permission to defer basic keyboard, focus, target-size, type-size, contrast, reduced-motion, or compact-layout requirements.

### C — Three-role council

- Product Manager, UI/UX Designer, and Project Manager review one shared candidate contract before implementation.
- Council records **Approved** or a named blocker. It may not silently resolve a PRD conflict, change an Outside UI row into prototype scope, weaken a privacy boundary, or invent provider/security/recovery truth.
- Implementation begins only with P=`A`, D=`A`, and C=`A`.

### I — Held prototype candidate

- The implementation is additive and vN-scoped; frozen v1–v16 bytes and earlier v17–vN-1 package bytes remain unchanged.
- The candidate has an exact file roster, full SHA-256 manifest or aggregate fingerprint, authority-file hashes, and evidence captured after the final UI bytes.
- Interactions change representative domain state when the requirement demands a decision; generic placeholder toasts do not satisfy acceptance.
- Syntax/static checks, live route checks, privacy string checks, console checks, and the required viewport/state evidence must pass before QA is assigned.

### Q — Fresh independent QA

- A newly assigned QA agent, different from the implementing agent and fresh for that version, judges the exact held candidate read-only. The agent must not repair what it judges.
- QA exercises every package criterion, applicable v6–vN-1 regression, wide/medium/390/320 layouts, keyboard/focus, relevant forced-colors/reduced-motion behavior, privacy, storage, URL/title, console, and synthetic-scope boundaries.
- The record includes exact candidate identity, agent identity, start/end time, evidence roster and hashes, limitations, and Critical/High/Medium/Low counts.
- Pass requires Critical 0 and High 0. Every Medium/Low finding must be fixed and fully retested, or explicitly accepted/deferred by a named decision owner with rationale and residual risk.
- Any candidate, authority, package, or evidence byte change after QA starts invalidates the verdict and requires a fresh QA agent run from zero on the same version number.

### F — Freeze, push, and immutable readback

After QA Pass, and before any vN+1 work begins:

1. Commit the exact QA-tested implementation/evidence bytes; verify every committed blob against the QA manifest.
2. Add a documentation-only freeze/handoff successor without changing tested UI, authority, package, evidence, or QA bytes.
3. Add a tracker-only successor that records the freeze commit's full SHA without inventing its own future SHA.
4. Stage only an explicit reviewed path roster; staged names must equal that roster. Inspect whitespace, privacy-sensitive strings, links, staged and unstaged diffs.
5. Push with an explicit refspec only to `origin/codex/prototype-completeness-v17-v35`. Do not force-push and do not mutate `main`, the frozen archive branch, or the separate GitHub v01–v16 issue/project program.
6. Read back the remote branch and prove remote HEAD equals local HEAD. Resolve immutable commit links and compare committed artifact blobs with the recorded manifest.
7. Mark F=`A` and the package `Complete` only when readback has zero mismatch. Only then release vN+1 from `Queued`.

A failed QA or publication attempt consumes no new version. Repair and re-evaluate the same unfrozen vN candidate until it passes or is explicitly blocked.

## 6. Final product acceptance

The v17–v35 prototype-completeness objective is accepted only when:

- all 19 packages have P/D/C/I/Q/F=`A` and are marked `Complete` in the project tracker;
- all 41 unique primary rows are closed at the bounded synthetic frontend-prototype level, with no double counting;
- every version has a fresh independent QA identity, exact tested fingerprint, evidence manifest, zero unresolved Critical/High findings, and dispositions for all lower-severity findings;
- every version was committed, pushed, and read back before successor work began;
- the final remote head contains the complete consecutive immutable v17–v35 chain and matches the recorded local head and artifact blobs;
- all 12 Outside UI rows still read `Requires external evidence`;
- all 16 inherited v6–v16 closures and 9 inherited v5 guardrails remain intact; and
- final language says only that the complete synthetic frontend prototype represents the audited product contract. It does not claim backend implementation, integration, persistence, security, recovery, deployment, formal accessibility conformance, production privacy, or production readiness.

## 7. Product-manager count self-check

| Check | Expected | Recorded here |
| --- | ---: | ---: |
| V5 total requirement rows | 78 | 78 |
| Prototype-representable gaps at v5 | 57 | 57 |
| Primary rows closed by v6–v16 | 16 | 16 |
| Primary rows remaining for v17–v35 | 41 | 41 |
| Consecutive packages v17–v35 | 19 | 19 |
| Outside UI rows | 12 | 12 |
| Inherited v5 Full guardrails | 9 | 9 |

The reconciliation identity is `9 + 16 + 41 + 12 = 78`. The execution identity is `41 rows / 19 packages`, with every remaining row assigned exactly once in Section 1.
