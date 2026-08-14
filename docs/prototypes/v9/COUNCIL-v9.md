# Life in Days prototype v9 — Product Council contract

- **Feature:** `PVA-004 First-use Readiness`
- **Council date:** 2026-08-14
- **Baseline:** frozen v8 implementation/evidence commit `47f5af9`; freeze record `fd910f5`
- **Branch:** `prototype/calendar-ui-v9-first-use-readiness`
- **Product Manager:** `/root/v9_pm_fast`
- **UI/UX Designer:** `/root/v9_design_fast`
- **Project Manager / Council chair:** `/root/v9_council_manager`
- **Council disposition:** **Approved for implementation**
- **Gates:** Product `A`; Design `A`; Council `A`; Implementation `IP`; independent QA not yet assigned

This contract governs the v9 prototype slice. It represents first-use Calendar and readiness interaction intent with fictional frontend fixtures. It does not prove or configure VoiceNotes, Telegram, AI providers, backup, encryption, recovery, authentication, storage, deployment, accessibility conformance, or production readiness.

## 1. Authority, purpose, and closure

V9 closes only the **first-use portion** of audit gap 3. It adds a calm empty Calendar plus five independent readiness states for VoiceNotes, Telegram, AI, Backup, and Recovery Ceremony. It is not a lifestyle onboarding flow, setup wizard, system-health dashboard, or launch-readiness claim.

Authority used, in descending order:

1. Arun's direct product decisions;
2. approved Council decisions, especially C-01 through C-04;
3. `LID-REF-001`, `LID-VN-001` through `LID-VN-003`, and `LID-OPS-003`, `LID-OPS-011`, `LID-OPS-012`, `LID-OPS-014`, and `LID-OPS-018` in the PRD;
4. `UX-CAL-01`, Calendar first-use state, `UX-FIRST-01` through `UX-FIRST-05`, `UX-SET-01` through `UX-SET-08`, `UX-HEALTH-02`, `UX-HEALTH-03`, `UX-HEALTH-09`, navigation, privacy, responsive, and accessibility contracts;
5. frozen v8, v7, and v6 interaction and privacy invariants.

After an independent QA pass, the only allowed closure statement is:

> First-use readiness is prototype-represented with synthetic fixtures; integrations, recovery, implementation, and operations remain unverified.

Gap 3 is not fully closed: v10 owns the loading, connectivity, interruption, authorization-expiry, and global-error family. V32 owns backup/restore evidence and Recovery Ceremony completion. No frontend prototype can close the external evidence rows named in Section 10.

No further decision from Arun is required for this slice.

## 2. Product and Design reconciliation

Product and Design agree that Calendar remains dominant; the empty state is calm and non-judgmental; readiness has five separate domains; authentic capture remains useful without AI; configuration happens outside the browser; no credential or identifier is collected; and backup/recovery language must remain evidence-bound.

Council resolves the remaining differences as follows:

| Topic | Product contract | Design contract | Council resolution |
| --- | --- | --- | --- |
| Empty-state body/action | `Add your first journal, or review private capture and recovery readiness.` and `Review readiness` | Longer archive explanation and `Review capture readiness` | **Use Product exact copy.** Design controls layout and calm hierarchy. |
| Readiness heading/intro | `Readiness`; `Prototype status only. Configuration happens outside this page.` | `First-use readiness`; `Set up capture when you're ready. Upload remains available now.` | **Use Product exact copy.** The region still has the Design-prescribed supporting `aside` hierarchy. |
| VoiceNotes/Telegram configured state | `Configured on server · Never verified` only | Also permits `Ready to activate`, `Active since`, or evidenced configured states | **Use Product:** v9 never shows `Active`, `Connected`, or a successful verification. |
| AI wording | `Optional · Not configured`; alternate `Unavailable · Authentic capture available` | `Optional · evaluation not completed` | **Use Product exact statuses.** Settings retains the existing separate evaluation-incomplete disclosure. |
| Backup initial state | `Not configured`; alternate `Never verified` | `Never verified` initially | **Use Product:** both states exist as separate fixtures and neither implies a snapshot or restore. |
| Recovery status | Always `Blocked` with three unevidenced prerequisites | `Launch blocked`, with an optional completed synthetic fixture | **Use Product:** every v9 fixture remains Blocked. Remove the Designer's `RECOVERY_COMPLETE_SYNTHETIC`; completion belongs to v32. |
| System Health destinations | Backup and Ceremony may point toward System Health | Full System Health is a later package | **Bounded v9 disclosure:** actions open a read-only first-use requirements disclosure, not a fake health dashboard. They may name System Health as the future evidence surface. |
| VoiceNotes/Telegram/AI actions | Product supplies exact action names but no required destination | Deep-link existing Settings sections and restore exact origin on Back | **Use Design navigation with Product labels:** Integration actions open the existing Integrations section; AI opens the existing AI section. They collect nothing and do not imply setup occurred. |
| Page H1 | First-use copy is the H1 and the page has one H1 | Inherited month heading is the H1 | **Use Product:** `Your archive begins here.` is the sole H1 in first-use mode. The month/year trigger remains a labelled subordinate heading/control associated with the grid. Populated v8 retains its frozen heading hierarchy. |
| Fixture label | `Prototype data` | `Prototype fixture` | **Use Product exact label:** `Prototype data`. |

Design governs editorial rhythm, Calendar dominance, divider-based readiness rows, responsive stacking, focus treatment, external status text, and accessibility details wherever they do not conflict with Product acceptance.

## 3. First-use entry and Calendar contract

### 3.1 Default state

- Reloading `index-v9.html` without an in-memory fixture override opens the first-use Calendar.
- The represented current `Asia/Kolkata` month is August 2026, inherited from frozen v8's synthetic date context. It is fixture time, not an operating-system clock or live-time claim.
- Locale is `en-IN`; weeks begin Monday.
- Preserve Previous, next, Today, and the immediate-commit month/year chooser from frozen v7/v8, including distinct external Today, selected, and keyboard-focus treatments.
- The grid remains seven columns. Every date is a quiet operable empty cell with the accessible name `<long date>, no Journal Day`.
- Empty-cell activation creates nothing. It may only explain or invoke `Upload journal for this date`; it never opens a blank browser editor.
- No cell shows a stock image, fabricated memory, gradient memory, historical artifact, Generated Artwork action, `Missed`, `Incomplete`, streak gap, score, pressure, or coaching.
- The ordinary viewed-month note `No journaled days in this month.` is omitted in the first-use fixture so it does not duplicate the first-use introduction. It remains available for ordinary empty-month browsing outside first use.

### 3.2 Exact introduction and actions

The first-use introduction is:

- eyebrow: `Private archive`;
- sole page H1: `Your archive begins here.`;
- body: `Add your first journal, or review private capture and recovery readiness.`;
- primary action: `Upload journal`;
- secondary action: `Review readiness`.

`Review readiness` moves focus to the readiness H2. It does not open a wizard or change the URL. `Upload journal` reuses the inherited global upload flow and still requires deliberate date review under the existing prototype contract.

### 3.3 Populated regression fixture

`archive/populated` restores the exact frozen v8 dataset and behavior in memory. Calendar, selected Museum Margin, Almanac boundaries, Search privacy, full Journal Day routing/return, Settings, theme, and Upload must remain available. Returning to first-use resets any selected day and does not retain personal or fixture state across reload.

## 4. Readiness hierarchy

- The readiness surface is a compact `<aside>`/region labelled by H2 `Readiness`.
- Intro: `Prototype status only. Configuration happens outside this page.`
- The five domains are independent. Do not compute or display a score, percentage, single `Ready` state, step count, mandatory sequence, progress bar, or celebration.
- Each row is an article/group with an H3, a visible plain-text status, one explanation, and at most one safe action. Icon and color may reinforce but never carry state alone.
- AI is optional and neutral. It does not count against capture readiness and cannot block Upload or Calendar use.
- Backup and Recovery Ceremony are operational/launch gates. They do not block local Upload or ordinary Calendar browsing.
- Initial statuses are not announced wholesale. Only a user-triggered fixture change or disclosure result uses the restrained polite live region.

## 5. Exact readiness rows

### 5.1 VoiceNotes

Default:

- status: `Needs server configuration`;
- copy: `Only notes tagged exactly “life-in-days” and created on or after Integration Activation are eligible. Older notes are never imported automatically.`;
- action: `View private setup instructions`.

Configured-unverified alternate:

- status: `Configured on server · Never verified`;
- copy: `Configuration is represented for this prototype; no VoiceNotes connection has been verified.`;
- action: `View boundary`.

The action opens Settings / Integrations, focuses the VoiceNotes boundary, and exposes no connect/activate mutation. V9 never says `Active`, `Connected`, `Ready to activate`, or `Active since`. It never offers historical import, additional/fuzzy tags, or browser credentials.

### 5.2 Telegram

Default:

- status: `Needs server configuration`;
- copy: `One configured numeric user in one private chat is accepted. Groups and other senders are rejected. Ordinary photo messages may be compressed.`;
- action: `View private setup instructions`.

Configured-unverified alternate:

- status: `Configured on server · Never verified`;
- copy: `Configuration is represented for this prototype; no Telegram connection has been verified.`;
- action: `View boundary`.

The action opens Settings / Integrations, focuses the Telegram boundary, and performs no setup mutation. No user/chat ID, masked identifier, bot name, token, webhook secret, callback path, or copyable value appears.

### 5.3 AI

Default:

- status: `Optional · Not configured`;
- copy: `Journals and photos remain useful without AI. No text or artwork provider is selected in this prototype.`;
- action: `Learn what stays available`.

Unavailable alternate:

- status: `Unavailable · Authentic capture available`;
- supporting copy must state that journal/photo capture, browsing, upload, and authentic source reading remain available;
- action remains `Learn what stays available`.

The action opens Settings / AI and focuses the AI/data-boundary heading. The readiness row shows no vendor/model, credential field, cost or spend claim, selected default, enabled generation, or fallback provider. The inherited Settings surface may retain its read-only evaluation-incomplete controls and fixed application ceiling, but it must not imply a selected model, available credential, live usage, or qualified provider. It states that real photos and photo-derived data never go to AI.

### 5.4 Backup

Default:

- status: `Not configured`;
- copy: `No encrypted backup is represented as configured.`;
- action: `View recovery requirements`.

Configured-unverified alternate:

- status: `Never verified`;
- copy: `A backup upload would not prove that this archive can be restored.`;
- action: `View recovery requirements`.

The action opens a read-only v9 requirements disclosure which distinguishes configuration, upload/snapshot, repository check, and restore evidence. It names System Health as the later evidence surface but renders no health metric or simulated success. V9 never says `Healthy`, `Protected`, `Backed up`, `Recoverable`, or `Restore ready`.

### 5.5 Recovery Ceremony

Every v9 fixture uses:

- status: `Blocked`;
- copy: `Launch remains blocked until two independent off-server recovery-key copies exist and a representative encrypted archive has been restored and decrypted.`;
- checklist:
  - `Password-manager copy — Not evidenced`;
  - `Sealed offline copy — Not evidenced`;
  - `Restore and decrypt sample — Not evidenced`;
- action: `Review ceremony requirements`.

The action opens a read-only v9 requirements disclosure. It explains that v32 will represent evidence and completion states; it provides no checkbox that can advance readiness. No key value, exact custody location, date/result/sign-off, bypass, or completed fixture exists. Backup state never promotes Recovery Ceremony.

## 6. Configuration and evidence boundary

- V9 contains no password, API key, token, webhook secret, recovery key, callback path, account/service identifier, masked-secret placeholder, paste field, copy-secret action, connect button, or activation mutation.
- Allowed integration language is limited to `Needs server configuration`, `Configured on server · Never verified`, and `Needs attention` only when the relevant future package supplies an explicit synthetic failure. V9 fixtures use only the first two.
- The prototype banner remains explicit: fictional data, no persistence, and no integrations connected. Alternate fixtures add the visible label `Prototype data`.
- No row may infer a live server read. `Configured on server` is always immediately qualified as represented and never verified.
- `Never verified` is never green or styled as success.
- The surface must not claim tested, connected, active, backed up, recoverable, encrypted, protected, launch-ready, production-ready, or deployed.
- Authentic capture and browsing remain the useful product when AI is not configured or unavailable.

## 7. Fixture and state contract

All fixtures are deterministic, fictional, and in-memory only:

| Fixture | VoiceNotes | Telegram | AI | Backup | Recovery Ceremony | Calendar |
| --- | --- | --- | --- | --- | --- | --- |
| `first-use/default` | Needs server configuration | Needs server configuration | Optional · Not configured | Not configured | Blocked; three prerequisites Not evidenced | Empty |
| `first-use/configured-unverified` | Configured on server · Never verified | Configured on server · Never verified | Optional · Not configured | Never verified | Blocked; three prerequisites Not evidenced | Empty |
| `first-use/ai-unavailable` | Needs server configuration | Configured on server · Never verified | Unavailable · Authentic capture available | Never verified | Blocked; three prerequisites Not evidenced | Empty |
| `archive/populated` | Inherited v8 regression data | Inherited v8 regression data | Existing evaluation-incomplete disclosure | Existing prototype-only disclosure | No completion claim | Frozen v8 populated archive |

- Developer fixture controls may select only these four allowlisted opaque states. The visible state label is `Prototype data`; implementation-facing keys need not appear in user content.
- The fixture selection is local live memory only. It does not enter query parameters, hash, page title, referrer, browser history payload, local/session storage, cookies, IndexedDB, service-worker cache, network requests, logs, or analytics.
- Invalid, absent, or unrecognized fixture state fails closed to `first-use/default` through replacement/no-history behavior.
- Reload resets to `first-use/default`. Back/Forward never reveals or persists readiness details.
- Fixture switching must not perform a network call, configure a provider/integration, mutate server state, persist a credential, or create a Journal Day.

## 8. Navigation, focus, and browser behavior

- VoiceNotes and Telegram readiness actions create one safe navigation entry to `view=settings&section=integrations`; AI creates one to `view=settings&section=ai`. Only allowlisted structural parameters may appear.
- On arrival, focus the exact relevant Settings subgroup/heading rather than the page top. Any row-target hint remains in memory, not the URL.
- Browser Back restores the empty Calendar month, scroll position, and exact invoking readiness action. Browser Forward restores the safe Settings section and logical focused destination.
- Mobile `Back to Settings` returns from a Settings detail to Settings overview; Browser Back remains the route to the originating Calendar.
- Backup and Recovery Ceremony disclosures are local modal/sheet state, never URL/history state. Opening moves focus to the disclosure heading; close, Cancel, Escape, and backdrop restore the exact invoking action.
- `Review readiness` focuses the Readiness H2. It neither pushes history nor opens a modal.
- Month navigation, chooser, Today, theme, responsive re-render, and reduced-motion changes preserve logical focus. Fixture changes focus the new first-use H1 or the equivalent populated destination and announce one concise state change.
- Browser title remains exactly `Life in Days`; no status or personal content enters it.

## 9. Responsive, visual, and accessibility contract

### 9.1 Layout

- `>=1280 px`: Calendar is the flexible dominant column; readiness is a 300–340 px companion aligned with the Calendar/grid introduction. Use restrained divider rows, not five large dashboard cards.
- `1024–1279 px`: retain two columns only while the Calendar can remain at least 700 px. Otherwise stack readiness below the Calendar; its rows may use a readable two-column internal layout.
- `<=960 px`: preserve v8 compact navigation/bottom bar; use one column with Calendar first and readiness second; reserve safe-area bottom padding.
- `700 px`: row status/copy/action stack; Settings uses the inherited compact section pattern.
- `390 px`: retain seven Calendar columns and associated short weekday labels; readiness actions become full-width only when needed.
- `320 px`: no page horizontal scroll; reduce decorative padding before text or targets; long boundary copy and `life-in-days` wrap safely; bottom navigation cannot cover the final action.
- Landscape mobile retains every action. At 200% text zoom and 400% page zoom, reflow to the compact one-column treatment without clipped copy, hidden actions, or hover-only information.

### 9.2 Semantics and operation

- First-use mode has one H1, `Your archive begins here.`; the month/year control is a labelled subordinate heading/control and labels the accessible grid.
- Readiness is an `aside`/region with H2; each row uses H3 and a programmatic name containing domain, state, explanation, and action without exposing an identifier.
- Preserve the accessible Calendar grid/date-picker pattern, roving focus, Arrow navigation, Home/End week bounds, Page Up/Page Down month navigation, chooser operation, and predictable focus after month changes.
- Enter/Space opens only a populated Journal Day. On empty dates it creates nothing and may invoke only the existing Upload-for-date affordance.
- Every action is keyboard operable. Focus is visibly at least 3:1; targets are at least 24 by 24 CSS px with 44 by 44 preferred; ordinary text targets 4.5:1; state never relies on color alone.
- Initial statuses are ordinary document text, not a live-region flood. User-triggered fixture/disclosure changes use one restrained polite announcement and do not announce all row prose.
- Reduced motion removes entrance, crossfade, scroll, and decorative progress animation. No information or operation depends on motion.
- No screenshots alone may establish WCAG conformance; keyboard and screen-reader checks are required, while formal conformance remains v35.

## 10. Explicit exclusions and inherited regressions

V9 does not include or claim:

- v10 loading, month/partial-media error, connection interruption, unsaved Correction, session expiry/reauthentication, generic server failure, or idempotent retry family;
- v24 first-class System Health, durable job evidence, health history, or operational alert behavior;
- v25 evaluated provider options, provider credentials, budget/spend, region/retention, or real AI configuration;
- v32 successful snapshot/check/sample restore/full drill, 48/30/12 retention, due states, measured four-hour objective, completed Recovery Ceremony, custody/result evidence, or recovery readiness;
- live integration/provider/storage/authentication/encryption/deployment behavior, production accessibility, or formal WCAG conformance;
- lifestyle onboarding, setup funnel, coaching, reminders, streaks, scores, celebration, sharing, public links, multiple users, historical automatic import, blank browser composition, web photo upload, offline mode, semantic/AI search, or a year mosaic.

V9 must regress:

- immutable frozen v8 Cross-month Almanac, canonical full Journal Day, exact return context, safe URL/history state, bounded synthetic ranges, external provenance, hidden/Trash-only exclusions, compact targets, Settings, themes, and populated fixtures;
- immutable frozen v7 Calendar chooser, image-only C-01 tiles, external Today/selected/focus states, compact journal-only paper tile, real-photo cover precedence, and safe year representation;
- immutable frozen v6 private Search: no query in URL, title, history payload, storage, or other persistence;
- exact prospective VoiceNotes tag `life-in-days`, no historical automatic import, no fuzzy/additional tags, and every inherited guardrail in tracker Section 7.

External evidence remains explicitly unverified for `LID-VN-001`, `LID-VN-002`, `LID-VN-005`, `LID-AIT-001`, `LID-AIA-001`, `LID-OPS-002`, `LID-OPS-005`, `LID-OPS-007` through `LID-OPS-009`, and `LID-OPS-016`. A screen cannot advance those rows.

## 11. Implementation deliverables

V9 implementation must create new immutable candidates without editing v8:

- `prototypes/calendar-ui/index-v9.html`;
- `prototypes/calendar-ui/app-v9.js`;
- `prototypes/calendar-ui/styles-v9.css` and any clearly named v9-only additive stylesheet;
- `prototypes/calendar-ui/README-v9.md`;
- `docs/prototypes/CALENDAR-UI-PROTOTYPE-v9.md`;
- `design-qa-v9.md`;
- current-run screenshots and state evidence under `docs/prototypes/v9/` while preserving this Council file.

Every interaction that carries acceptance meaning must change the required fictional state or navigate/focus as contracted. A generic toast cannot substitute for fixture selection, disclosure, Settings arrival, focus restoration, or Calendar behavior.

## 12. Independent QA gate

A fresh independent QA agent must verify at minimum:

1. default reload at wide, compact, light, and dark opens the empty August 2026 Calendar with exact H1/body/actions, seven quiet columns, five rows, and no false connection/recovery claim;
2. Calendar Previous/next/Today/month chooser, roving Arrow/Home/End/Page keys, focus rings, touch activation, and empty-date no-creation behavior remain intact;
3. `Review readiness` focuses the Readiness H2 without URL/history churn; Upload opens the inherited safe review flow;
4. all four fixture states are deterministic and independent; alternates show `Prototype data`; AI unavailable leaves authentic capture/browsing available; `archive/populated` exactly regresses v8;
5. VoiceNotes and Telegram render the exact eligibility/allowlist/compression boundaries, deep-link to the correct Settings subgroup, restore exact origin on Back/Forward, and expose no identifier or credential;
6. AI renders no model/provider/default/cost/fallback claim and its action reaches the existing data-boundary surface;
7. Backup never implies restore; Recovery Ceremony is Blocked in every fixture with exactly three `Not evidenced` prerequisites; requirement disclosures cannot mark either complete;
8. invalid/missing fixture state and reload fail closed to default; fixture selection/status is absent from URL, hash, title, history payload, referrer, storage, cookies, IndexedDB, and outbound request metadata; console/source inspection finds no credential, account identifier, recovery key, or personal content; no external/provider request occurs;
9. safe Settings structural links use only allowed view/month/section state; local disclosures do not churn URL/history; dialog/sheet focus enters, traps where applicable, closes by keyboard, and returns exactly;
10. 1440×900, 1280×720, 960×900, 700×900, 390×844, and 320×568; 200% text zoom; 400% page zoom observation; portrait and landscape; no horizontal page overflow, clipped copy, covered action, or Calendar collapse below seven columns;
11. heading/landmark/grid/row semantics, full accessible names, keyboard-only operation, screen-reader announcements, visible non-color focus/status, measured target sizes and contrast, and reduced-motion equivalence;
12. frozen v8/v7/v6 immutability and regression: populated Calendar/chooser/rings, Calendar–Almanac, Almanac load/jump/day return, Search privacy, Settings, Upload, theme, safe URL/title, and console/syntax behavior;
13. forbidden scope is absent: no lifestyle onboarding, provider/credential collection, completion fixture, reminders/streaks/coaching/sharing, historical import, blank composer, web photo upload, offline/semantic-search promise, or production claim;
14. current-run screenshots, interaction/state matrix, static privacy inspection, syntax/console result, exact artifact hashes, severity counts, and an explicit evidence-boundary verdict are recorded.

Pass means a first-time owner sees a calm empty Calendar, can add an Uploaded Journal immediately, can inspect five truthful independent readiness lanes, and understands that configuration/recovery evidence occurs elsewhere. No fixture suggests that an integration connected, a backup restored, or launch became safe. Only after this pass may v9 be frozen and v10 released.
