# Life in Days — Phase 2 V19 and V20 AI-agent execution handover

Date: 20 August 2026

Audience: a new AI agent responsible for executing V19 and V20 after Arun explicitly authorizes each package

Current status: V18 is complete and published; V19 and V20 are queued; V19 remains under an explicit owner pause; no V19 or V20 implementation, authority package, evidence set, manifest, QA report, or completion artifact exists

Authority boundary: this is a durable cold-start handover. It is not permission to begin V19 or V20, deploy anything, use real personal data, or claim backend, production, security, persistence, or formal accessibility readiness.

## 1. Binding pause and execution order

**Do not start V19 planning, design, implementation, evidence capture, or GitHub status activation until Arun explicitly confirms that V19 may begin.** Creating or publishing this handover does not lift that pause.

The first action in every new session is to read the latest direct owner instruction. If it does not explicitly authorize V19, stop after any requested read-only status report; do not turn the checks below into package planning.

After V19 is independently passed, frozen, pushed, remotely read back, and reconciled in GitHub, stop again. Do not start V20 automatically. Re-read the current owner instruction and obtain explicit confirmation if the successor gate remains paused.

The only permitted package order is:

1. V19 — `PVA-014 Trash`.
2. Independent V19 QA, freeze, publication, and GitHub readback.
3. Explicit successor authorization.
4. V20 — `PVA-015 Suppressions`.
5. Independent V20 QA, freeze, publication, and GitHub readback.

Never build V19 and V20 concurrently. Never fork V20 from an unaccepted or merely local V19 candidate.

## 2. Exact cold-start location and Git boundary

Work only in this linked worktree unless Arun supplies a newer exact path:

```text
/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect-phase2-v17-v35
```

Do not operate from `/Users/arun.prakash/Documents/ChatGPT/Reflect App`, the broader `ArunVault2026-2` directory, or the older primary checkout.

Verified before this handover was drafted:

| Property | Exact value |
| --- | --- |
| Worktree | `/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect-phase2-v17-v35` |
| Branch | `codex/prototype-completeness-v17-v35` |
| V18 publication-receipt tail before this handover | `da745d55b1e22dea5319caa80f41a1828a56c0d1` |
| Remote branch at audit | `origin/codex/prototype-completeness-v17-v35` at the same full SHA |
| Remote | `https://github.com/arunpr614/Life-Reflection.git` |
| Worktree state at audit | clean; zero staged paths |
| Branch tracking configuration | no local upstream configured; compare with `git ls-remote` explicitly |

This handover is a documentation-only successor to `da745d55…`. A new agent must resolve the actual current full SHA rather than assuming the branch stopped there.

Run these read-only checks before any work:

```bash
PROJECT_DIR='/Users/arun.prakash/Documents/ArunVault2026-2/Initiatives/Arun_AI_Projects/AI_Life_reflect-phase2-v17-v35'

git -C "$PROJECT_DIR" rev-parse --show-toplevel
git -C "$PROJECT_DIR" branch --show-current
git -C "$PROJECT_DIR" rev-parse HEAD
git -C "$PROJECT_DIR" status --short --branch
git -C "$PROJECT_DIR" remote get-url origin
git -C "$PROJECT_DIR" ls-remote --heads origin codex/prototype-completeness-v17-v35
gh auth status -h github.com
```

Stop on the wrong path, wrong branch, unexpected dirty or staged paths, remote divergence, missing authentication, or an owner instruction that still says pause.

### Git safety rules

- Preserve every unrelated checkout and change.
- Never use `git reset --hard`, `git clean`, broad restore/checkout commands, or destructive worktree operations.
- Never use `git add .`, `git add -A`, broad globs, or a bare `git push`.
- Stage exact approved paths only and inspect the staged roster before every commit.
- Treat V1–V18 assets as frozen. V19 must be additive; V20 must be additive to the accepted V19 package.
- Do not rewrite failed QA history. Repairs create a new candidate, new evidence, a new manifest, and a fresh QA round.

## 3. Current published authority

### V18 dependency receipt

V18 is complete. The exact published sequence is:

| Record | Commit / identity |
| --- | --- |
| Exact candidate | `a6f463214801275d628c19b94472d4066c8df657` |
| QA/freeze successor | `aa5f2c1ac77e0df37a73dbe9b9b41c8be57efb43` |
| Tracker closure | `eee5da5d8ba9752fbf7cad3cc67aeb54ac6e3194` |
| Publication receipt | `da745d55b1e22dea5319caa80f41a1828a56c0d1` |
| Held 49-record manifest / aggregate | `85bfe3c277dfe3bebdae49312f619c5295e980d29d5c3538c009dcdc7b382578` |
| Evidence aggregate | `11297ee0c6d3ff251e611d0cea1d65da56fe632d807cf12a7c18b4008a0c710f` |
| Independent QA Round 3 | PASS; P=A, D=A, Q=A; C0/H0/M0/L0 |

V18 closed exactly `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` at the bounded frontend-prototype level. Program arithmetic is **22/57 closed and 35/57 open**.

Current V18 records:

- [V18 handoff](../prototypes/CALENDAR-UI-PROTOTYPE-v18.md)
- [V18 Round 3 QA](../prototypes/v18/DESIGN-QA-v18-round3.md)
- [V18 candidate checksum manifest](../prototypes/v18/V18-CANDIDATE-MANIFEST.sha256)
- [Living V17–V35 tracker](../phase2/PROTOTYPE-COMPLETENESS-PROJECT-TRACKER-v17-v35.md)
- [GitHub issue #155](https://github.com/arunpr614/Life-Reflection/issues/155) — closed/completed, `status:done`, Project `Done`
- [GitHub milestone 32](https://github.com/arunpr614/Life-Reflection/milestone/32) — closed, `0 open / 1 closed`

The V18 handoff intentionally preserves earlier “pending” snapshots and failed rounds. The living tracker is also append-only: its header still describes the final receipt commit as pending, while the later receipt commit `da745d55…` completed that action. The latest EOF records, exact Git chain, and live GitHub state supersede those historical paragraphs.

### Source precedence for V19 and V20

Read these before creating package authority:

1. The latest direct owner instruction and this binding pause.
2. [Living prototype-completeness tracker](../phase2/PROTOTYPE-COMPLETENESS-PROJECT-TRACKER-v17-v35.md).
3. The selected live GitHub design issue and matching milestone.
4. [Product requirements](../product/PRODUCT-REQUIREMENTS.md), especially `LID-SCP-004`, `LID-VN-007`, `LID-AIA-009`, `LID-OPS-009`, and `LID-OPS-010`.
5. [UX specification](../design/UX-SPECIFICATION.md), especially Section 17, `UX-TRASH-01`–`05`, and `UX-SUP-01`–`03`.
6. [V5 feature audit](../audits/PROTOTYPE-V5-FEATURE-AUDIT.md).
7. [Canonical vocabulary](../../CONTEXT.md).
8. V18 Product, UX, Council, fixture, implementation, evidence, and QA records as proof-discipline and inherited-regression references.

Issue-body links pinned to the old V16 archive are historical inputs. Rebind V19 to the full published V18 chain above. Rebind V20 to the eventual full published V19 chain; never substitute a guessed SHA.

## 4. Live GitHub map — verified 20 August 2026

The correct Phase 2 tickets already exist. Do not create duplicates.

| Version | Design issue | Milestone | Current state | Dependency |
| --- | --- | --- | --- | --- |
| V19 | [#156 — PVA-014 Trash](https://github.com/arunpr614/Life-Reflection/issues/156) | [#33 — Phase 2 — Prototype Backlog v19 — Trash](https://github.com/arunpr614/Life-Reflection/milestone/33) | open; `status:backlog`; Project `Backlog`; no dates | V18 complete, plus binding owner confirmation |
| V20 | [#157 — PVA-015 Suppressions](https://github.com/arunpr614/Life-Reflection/issues/157) | [#34 — Phase 2 — Prototype Backlog v20 — Suppressions](https://github.com/arunpr614/Life-Reflection/milestone/34) | open; `status:backlog`; Project `Backlog`; no dates | accepted, frozen, pushed, remotely read-back V19 |

Both issues have parent [#115 — Phase 2 program charter](https://github.com/arunpr614/Life-Reflection/issues/115), Priority `High`, and these canonical labels:

- `roadmap`
- `status:backlog`
- `priority:high`
- `type:design`
- `phase2`
- `version:v19` or `version:v20`

The issue dedupe markers are:

```text
P2-PROTOTYPE-V19
P2-PROTOTYPE-V20
```

At the audit boundary, Phase 2 contained 53 issues/Project items: 33 closed/Done, 20 open/Backlog, and zero In progress.

## 5. Required team and decision gates

Use separate accountable roles. One agent may not silently substitute for all gates.

| Role | Required work |
| --- | --- |
| Root/orchestrator | Enforce pause, paths, scope, sequencing, file ownership, and stop conditions; coordinate agents without editing the same file concurrently. |
| Project Manager | Maintain plan, tracker chronology, artifact/evidence roster, hashes, candidate hold, publication sequence, GitHub reconciliation, and closure arithmetic. |
| Product Manager | Produce observable Product acceptance, included/excluded behavior, exact closure rows, failure/recovery/destructive scenarios, and P verdict. |
| Expert UI/UX Designer | Produce information architecture, at least two approaches for the highest-risk interaction, exact copy, state/transition/focus/Back/Escape contracts, responsive/accessibility/privacy rules, evidence framing, and D verdict. |
| Product/Design/Project Council | Reconcile conflicts in one append-only decision record; freeze copy, fixtures, artifact names, evidence roster, and C verdict before implementation. |
| Implementer | Build only additive versioned files, deterministic synthetic browser-memory states, self-checks, and evidence tooling; preserve frozen predecessors. |
| Independent QA agent | Start from zero after exact candidate hold; remain read-only; verify manifest, original-size images, live behavior, inherited regressions, privacy, and severity; issue Q verdict. |

No QA agent may validate bytes it authored. Any candidate-byte change after QA assignment invalidates that run.

The six gates are:

| Gate | Exit condition |
| --- | --- |
| P | Product acceptance is explicit, testable, bounded, and Approved. |
| D | UX contract is explicit, responsive, accessible, privacy-safe, and Approved. |
| C | Product/Design/Project conflicts are resolved; fixtures/copy/evidence roster are frozen. |
| I | Final additive bytes and current-run evidence pass self-checks; exact hashes exist. |
| Q | A fresh independent agent passes the exact held candidate, or records a durable failure. |
| F | The accepted core chain is pushed/read back, GitHub is reconciled, the final publication receipt is then pushed/read back, and the closing GitHub readback matches. |

## 6. V19 package — PVA-014 Trash

### Scope and closure boundary

V19 closes only these two rows after all gates and publication pass:

- `LID-SCP-004` — a Journal Day with no live Source Items disappears from ordinary Calendar/Timeline while retained history stays reachable; restore makes it ordinary-visible again.
- `LID-OPS-010` — exact 30-day Trash lifecycle, ordinary-view exclusion, restore, permanent live deletion confirmation, and truthful backup/suppression consequences.

Do not close `LID-OPS-009`; transactional Media Asset reference counting and physical deletion remain external evidence. Do not close `LID-REF-007`; its complete management-action closure belongs to V33. Do not claim backend scheduling, real deletion, backup erasure, or VoiceNotes mutation.

After an accepted and published V19, arithmetic becomes **24/57 closed and 33/57 open**.

### Product outcome

The owner must be able to understand:

- what is recoverable;
- the exact deletion instant, expiry instant, and time remaining in a fixed `Asia/Kolkata` 30-day window;
- what ordinary Calendar, Almanac, Timeline, Journal Day, and default Search stop showing;
- what History still retains and how an exact hidden date remains reachable;
- what Restore changes for day visibility, real-photo Calendar Cover, photo order, stale/source-bound Derived Artifacts, and Source Suppression;
- what permanent live deletion removes and what it does not prove about encrypted backup retention or shared media;
- why one Voice Journal deletion never mutates VoiceNotes upstream.

Freeze a deterministic fictional clock and exact boundary behavior before implementation. “30 days” cannot be represented by a drifting wall-clock fixture.

Council must freeze the equality and early-deletion rule explicitly. The default requiring acceptance or an expressly approved replacement is: `expiryInstant = deletionInstant + 30 × 24 hours`; an item is recoverable only while `fixtureNow < expiryInstant`; equality is expired/non-restorable; automatic expiry is represented as the governed permanent-live-deletion transition; and an earlier permanent deletion is possible only through the explicit acknowledged confirmation. Do not implement until Product, Design, and fixtures all encode one identical rule.

### Required information architecture and design exploration

Treat Trash as a first-class management surface reached from the inherited wide Settings and compact More management areas. It is not a Settings form and not a toast.

Product and Design must compare at least two viable list/detail approaches before Council chooses one. The approved surface must include:

- recoverable list and item detail;
- item type, source, Journal Date, deletion date/time, expiry, time remaining, and recoverability;
- source/date filters where useful, without merging default Search and Trash;
- an explicit Restore preview;
- an explicit permanent-delete confirmation with the exact item and Journal Date;
- `Delete permanently` and Cancel, never ambiguous `OK`;
- the authority-mandated acknowledgement for irreversible deletion;
- a direct History/audit route where applicable;
- normal-flow content that remains reachable above compact navigation and sticky surfaces.

The destructive dialog must use native semantics, trap focus, return focus to the exact invoker, and never execute on Escape. Council must freeze Escape behavior separately for non-destructive previews and destructive confirmation.

### Required deterministic fixtures

At minimum include fictional examples for:

- Voice Journal;
- Uploaded Journal;
- Daily Photo with a Media Asset also referenced elsewhere;
- Generated Artwork;
- last live Source Item on a Journal Day;
- hidden historical day;
- expiring-soon and exact-boundary items;
- expired/non-restorable item;
- empty Trash;
- loading and read failure.

No real journal text, photo, identifier, timestamp, VoiceNotes record, Telegram record, or storage fact may be used.

### Required executable state family

- populated, empty, filtered, loading, interrupted, known-zero failure/retry, and result-unknown/read-only status check;
- Restore preview, pending, success, stale confirmation, concurrent restore/delete, another-tab winner, duplicate/late terminal no-op, and reset;
- permanent-delete preview, pending, known-zero failure, unknown/reconciliation, terminal success, stale confirmation, duplicate/late terminal no-op, and reset;
- session expiry, Back/Forward/reload, long destructive copy, compact keyboard flow, and return focus;
- hidden-day restore, real-photo cover recalculation, order recalculation, stale Derived Artifact consequence, and Source Suppression removal.

One accepted intent may produce at most one matching terminal effect. Back, reload, duplicate callbacks, stale confirmations, and another tab may not replay an operation.

### Exact V19 truth rules

- Trash content is excluded from ordinary Calendar, Almanac, Timeline, Journal Day, and default Search.
- History can still locate the hidden day by exact date and records typed Trash/restored/permanently-deleted events.
- Moving a Voice Journal to Trash creates Source Suppression; restoring it removes that suppression.
- `Delete permanently` states that live content and export cannot reconstruct the item; encrypted backup copies expire only through normal retention.
- A permanently deleted Voice Journal retains only the opaque identity required for suppression until `Allow re-import` in V20.
- Shared-media copy describes the photo record and consequence, not internal deduplicated storage mechanics.
- Physical Media Asset deletion/reference counting is unverified and never shown as proved.

### V19 acceptance checks

- Exact 30-day boundaries are deterministic and visible.
- Restore hides or reveals the ordinary Journal Day atomically and recalculates cover/stale state truthfully.
- Real Daily Photo always retains cover precedence while any live photo exists.
- Permanent deletion cannot be confirmed accidentally, replayed, or represented only by a toast.
- Focus, announcements, Back, Escape, refresh, and stale/duplicate outcomes are governed.
- The history model remains intact and visibly separate from current content.
- No claim exceeds a deterministic synthetic frontend representation.

## 7. V20 package — PVA-015 Suppressions

### Scope and closure boundary

V20 closes only `LID-VN-007` after all gates and publication pass:

- local Voice Journal deletion never edits VoiceNotes;
- Source Suppression prevents automatic resurrection;
- Trash restore removes the relevant Source Suppression;
- permanent local deletion retains only an opaque upstream identity needed for suppression;
- `Allow re-import` removes the block after explicit confirmation and only makes later reconciliation eligible.

V20 may represent Artwork Suppression and release eligibility to keep management semantics distinct, but it must not claim primary closure of `LID-AIA-009`. V29 owns complete Artwork Sweep and Artwork Suppression closure.

After an accepted and published V20, arithmetic becomes **25/57 closed and 32/57 open**.

### Product outcome

The owner must be able to inspect and deliberately release Source Suppression and Artwork Suppression without exposing deleted content or sensitive upstream identity, while understanding that permission does not equal an immediate successful import or artwork generation.

### Required information architecture and design exploration

Treat Suppressions as a separate first-class management view, not a Settings form and not part of Trash.

Product and Design must compare at least two viable organization approaches before Council chooses one. The approved design must keep two unmistakable semantic sections or lanes:

1. **Source Suppressions** — source type, suppression date, safe masked synthetic identifier suffix, reason/consequence, and `Allow re-import`.
2. **Artwork Suppressions** — Journal Date, creation reason, consequence, and `Allow generation`.

Never merge the two record types under an ambiguous generic suppression row. Show their relationship to Trash without implying they are the same lifecycle object.

### Required deterministic fixtures

At minimum include:

- empty and populated Source Suppression sections;
- empty and populated Artwork Suppression sections;
- masked synthetic source identity;
- upstream missing, untagged, unavailable, and ineligible after release;
- Source Suppression created by Voice Journal deletion;
- Source Suppression removed by Trash restore;
- Artwork Suppression after all Generated Artwork is deliberately removed;
- manual Artwork Request while automatic sweep remains suppressed;
- already removed/stale record;
- loading, interruption, read failure, and recovery.

### Required executable state family

- separate Source and Artwork normal/empty/loading/error states;
- record detail and consequence copy;
- release preview, pending, known-zero failure/retry, result unknown/reconciliation, success, already removed, stale confirmation, another-tab winner, duplicate/late callback no-op, and reset;
- unavailable upstream after `Allow re-import`;
- manual Artwork Request while suppressed;
- `Allow generation` eligibility change without immediate artwork;
- session expiry, Back/Forward/reload, compact keyboard flow, long copy, and return focus.

One accepted release may create at most one matching transition. Back, refresh, stale dialogs, another tab, or duplicate callbacks cannot replay it.

### Exact V20 truth and privacy rules

- A Source Suppression record may show only source type, suppression date, and a masked fictional identifier suffix.
- Never show source text, deleted-content preview, full upstream ID, user ID, chat ID, checksum, provider secret, or credential-shaped value.
- `Allow re-import` removes only the suppression. Later reconciliation can still fail because upstream is missing, untagged, unavailable, or ineligible.
- `Allow generation` removes only Artwork Suppression. It does not generate artwork immediately.
- A manual Artwork Request remains separate, explicit, and normally gated; it never silently clears Artwork Suppression.
- No action mutates VoiceNotes, invokes a provider, persists state, or proves cross-process idempotency.
- The UI may state what becomes allowed next, never that an import or generation already occurred.

### V20 acceptance checks

- Source and Artwork records, labels, reasons, consequences, and controls remain visually and programmatically distinct.
- Full or private identity never appears in visual copy, DOM identifiers, accessible names, live regions, URL, title, history payload, storage, requests, console, telemetry, evidence JSON, or QA transcripts.
- Release confirmation, failure, unknown-result, stale, duplicate, and already-removed paths are deterministic.
- `Allow re-import` and `Allow generation` change eligibility only.
- Trash restore semantics remain consistent with V19.
- V29 ownership of complete artwork-sweep/suppression closure remains explicit.

## 8. Shared experience, privacy, and proof contract

Both versions must preserve the inherited Life in Days visual language: warm paper, deep ink, serif reflective content, sans-serif controls, restrained editorial layout, border-led hierarchy, real-photo cover precedence, wide Settings management, and compact More management. They are additive explorations, not redesigns.

### Responsive and interaction matrix

At minimum freeze and test:

- 1440×900 wide;
- 1024×900 wide boundary;
- 1023×900 compact-feature boundary;
- 961×900 Settings-origin boundary;
- 960×900 More-origin boundary;
- 568×320 compact landscape;
- 390×844 compact portrait;
- 320×900 narrow compact;
- light and dark themes;
- forced colours;
- reduced motion;
- long content;
- 200% text and 400% zoom/reflow where the browser supports them.

If only reflow-equivalent evidence is possible, name that limitation exactly. Never call it native zoom proof.

### Accessibility contract

- One `h1`, logical heading order, named landmarks, semantic lists/facts, and native controls.
- Stable, visible focus through rerender and exact invoker/focus/scroll restoration on Back and Escape.
- Destructive dialogs use native dialog semantics, focus trap, Cancel, and precise return focus.
- Preferred control targets are at least 44×44 CSS pixels; functional metadata is at least 13 CSS pixels.
- Normal text contrast is at least 4.5:1; large text, meaningful boundaries, and focus are at least 3:1.
- Live-region announcements are short, outcome-oriented, and omit private content, internal identity, fixture names, and payload details.
- Sticky/fixed UI cannot cover actions, focused content, panel boundaries, or required evidence.
- No formal accessibility-conformance claim follows from browser-emulated forced colours, reduced motion, or reflow.

### Privacy and prototype-truth boundary

- Use synthetic browser-memory state only.
- Make zero provider calls and add no persistence, telemetry, service worker, cache, IndexedDB, local/session storage, clipboard, or external request path.
- Keep feature state and private-shaped values out of URL, query/hash, title, history state, referrer, console, errors, logs, DOM IDs, unrelated accessible names, and structured evidence.
- Preserve representative zero mutation/provider counters where the inherited harness uses them.
- Evidence sidecars contain bounded safe tokens and booleans, never protected prose, full identifiers, raw DOM, or accessibility-tree dumps.
- No prototype result proves backend transactions, durable state, external reconciliation, physical deletion, encryption, authentication, backup/restore, deployment, production operations, security, or readiness.

## 9. Artifact contract for each version

Freeze the exact roster in Council before implementation. Do not preselect an evidence-frame count merely by copying V18.

Use this version-scoped pattern unless Council records a justified alternative:

### Product, Design, Project, and Council authority

- `docs/prototypes/vNN/PRODUCT-ACCEPTANCE-vNN.md`
- `docs/prototypes/vNN/UX-CONTRACT-vNN.md`
- `docs/prototypes/vNN/PACKAGE-PLAN-vNN.md`
- `docs/prototypes/vNN/COUNCIL-vNN.md`
- `docs/prototypes/v19/TRASH-LIFECYCLE-FIXTURES-v19.md` or `docs/prototypes/v20/SUPPRESSION-LIFECYCLE-FIXTURES-v20.md`

### Additive implementation and tooling

- `prototypes/calendar-ui/index-vNN.html`
- `prototypes/calendar-ui/app-vNN.js`
- `prototypes/calendar-ui/styles-vNN.css`
- `prototypes/calendar-ui/README-vNN.md`
- `prototypes/calendar-ui/check-vNN.mjs`
- `prototypes/calendar-ui/capture-phase2-evidence-vNN.mjs`

### Evidence, QA, and handoff

- complete final-byte PNG/JSON evidence pairs under `docs/prototypes/vNN/`;
- one self-reference-free `VNN-CANDIDATE-MANIFEST.sha256`;
- fresh reports named `docs/prototypes/vNN/DESIGN-QA-vNN-roundN.md`;
- `docs/prototypes/CALENDAR-UI-PROTOTYPE-vNN.md`;
- an append-only version record in the living tracker;
- a final publication receipt after remote and GitHub readback.

The existing issue bodies mention root-level `design-qa-v19.md` and `design-qa-v20.md`, while current accepted practice is version-scoped. Council must settle the exact path before candidate hold and the issue must be reconciled to that decision. Do not create both names.

If Product/Design discovers a material pre-gate failure, preserve it in an append-only versioned record rather than erasing the chronology.

## 10. Per-version execution workflow

### Step 0 — Obtain explicit owner authorization

Read the live user instruction. For V19, the current answer is **pause**. Dependency satisfaction alone is not authorization.

### Step 1 — Rebind every live authority

- Re-run the Git and GitHub checks in Sections 2 and 12.
- Read the selected issue, milestone, Project fields, tracker, requirements, UX specification, audit, context, and predecessor package completely.
- Replace historical predecessor links with exact current immutable SHAs in the new package authority.
- Confirm no existing V19/V20 artifact or concurrent owner exists.

### Step 2 — Produce and reconcile authority before runtime work

1. Product Manager writes Product acceptance and exact closure/non-closure rows.
2. UI/UX Designer writes the experience contract, alternatives, copy, state/focus/responsive/accessibility/privacy rules, and proposed evidence.
3. Project Manager writes the package plan, artifact roster, agent responsibilities, and gates.
4. Council resolves every contradiction and freezes exact copy, fixtures, scenario IDs, state/cardinality effects, focus/announcement rules, artifact paths, and ordered evidence roster.
5. Only after P=A, D=A, and C=A may implementation begin.

### Step 3 — Implement additively

- Fork the exact accepted predecessor behavior into versioned V19 or V20 assets.
- Do not modify a frozen predecessor to make a successor pass.
- Use deterministic synthetic browser-memory state.
- Give every promised control a representative state transition; a toast alone is not a domain outcome.
- Add fail-closed invariants, syntax/static/privacy/frozen-byte checks, and proportional inherited regression.

### Step 4 — Capture final-byte evidence

- Capture only after authority and UI/tool bytes are stable.
- Record exact viewport/theme/media/fixture/scenario, hashes, dimensions, focus, state, privacy, console, network, storage, and overflow results.
- Inspect every PNG at original size.
- Do not let the helper repair app focus, scroll, layout, or state after governed activation.
- If any final byte changes, recapture every affected artifact and recompute all aggregates.

### Step 5 — Hold the exact candidate

- Create a self-reference-free manifest covering the complete approved **pre-QA** roster: frozen Product/UX/Plan/Council/fixture authority; implementation and tooling; definitive evidence; the pre-QA handoff/tracker state; and any preserved earlier same-version failure/QA records named by Council.
- If mutable handoff/tracker paths are in that roster, their held bytes must remain unchanged through QA and must be bound in the exact candidate commit immediately after PASS, before any post-QA successor edits those paths. The manifest continues to identify that immutable candidate commit, not the later branch-tip versions. If the team cannot enforce that sequence, exclude mutable paths from the manifest and use separate immutable candidate-snapshot paths approved by Council.
- Exclude the checksum manifest itself, the not-yet-created current QA report, post-QA freeze/tracker successors, commits, GitHub receipts, and the final publication receipt. Those later records must cite the held manifest hash without pretending they were part of the tested roster.
- Record its SHA-256, record count, evidence aggregate, branch/base, zero staged paths, and full file hashes.
- Stop all candidate mutations.
- Assign a fresh independent QA agent from zero.

### Step 6 — Run independent QA

QA must remain read-only and verify:

- manifest and candidate identity at start and end;
- original-size visual frames;
- the full version-specific fixture and race matrix;
- actual controls, focus, Back/Escape, responsive breakpoints, themes, forced colours, reduced motion, and honest zoom limits;
- URL/title/history/storage/network/console/telemetry privacy;
- frozen predecessor hashes and inherited regressions;
- a severity ledger and explicit PASS or FAIL.

On FAIL, preserve the report, invalidate the candidate, repair within the same version, recapture/reseal, and assign a fresh QA round. A failure does not consume the next version number.

### Step 7 — Freeze and publish only accepted bytes

Use this non-circular, narrowly staged sequence comparable to V18:

1. candidate implementation/evidence commit;
2. post-QA/freeze documentation commit;
3. tracker closure commit;
4. explicit push of that core chain to the named branch;
5. local/fetched-remote/`ls-remote` equality and committed-blob readback;
6. GitHub artifact/status reconciliation while the issue remains open and `F=IP`;
7. a pre-closure tracker receipt commit describing that first GitHub readback, followed by explicit push/readback;
8. with `F` still `IP`, close the issue and milestone, update the successor dependency, and read back every closing write;
9. a final tracker publication/closure receipt recording those successful closing readbacks and `F=A`, followed by explicit push/readback;
10. one final immutable comment on the closed issue linking that receipt and recording `F=A`, followed by comment/issue/milestone/Project/successor readback.

Local QA or a local commit is not publication. Record the exact commit chain and limitations.

## 11. Mandatory post-artifact GitHub reconciliation

This section carries Arun's explicit instruction for the successor agent.

**Once a version's artifacts are complete, find the correct GitHub issue under the correct Phase 2 milestone and check for every existing issue or ticket associated with the requirement. Update the existing canonical ticket. If no matching ticket genuinely exists, create one detailed GitHub issue containing all design artifacts, design requirements, execution requirements, evidence, and acceptance gates so another AI agent can find and execute it without hidden context.**

“Artifacts complete” at the reconciliation boundary means the final Product/Design/Council authority, fixture model, runtime/tooling, current-run evidence, exact manifest, independent QA, handoff, pre-receipt tracker, accepted core commit chain, push, and remote/blob readback all exist. It does not mean the mockup merely renders locally. The pre-closure and final publication receipts are intentionally created after their corresponding GitHub readbacks, as described in Step 7.

### Re-find before every GitHub write

Search open and closed issues by all of these keys:

- dedupe marker `P2-PROTOTYPE-V19` or `P2-PROTOTYPE-V20`;
- exact version label;
- `PVA-014` / `PVA-015` title;
- requirement IDs;
- exact milestone title and number;
- Project item and parent #115.

Useful read-only commands:

```bash
gh issue view 156 --repo arunpr614/Life-Reflection \
  --json number,title,state,stateReason,url,body,labels,milestone,projectItems,updatedAt

gh issue view 157 --repo arunpr614/Life-Reflection \
  --json number,title,state,stateReason,url,body,labels,milestone,projectItems,updatedAt

gh issue list --repo arunpr614/Life-Reflection --state all \
  --search 'PVA-014 in:title'

gh issue list --repo arunpr614/Life-Reflection --state all \
  --search 'PVA-015 in:title'

gh api --paginate --slurp \
  'repos/arunpr614/Life-Reflection/issues?state=all&labels=phase2&per_page=100' \
  | jq '[.[][] | select(has("pull_request") | not) | {number,title,body,labels,milestone,state}]'

gh api repos/arunpr614/Life-Reflection/milestones/33
gh api repos/arunpr614/Life-Reflection/milestones/34
gh project item-list 1 --owner arunpr614 --limit 1000 --format json
```

Do not trust remembered issue numbers without live readback, and never create a duplicate because a ticket is closed or temporarily missing from one Project view.

### If the canonical issue exists

For the current repository, update #156 for V19 and #157 for V20. Prefer an append-only, uniquely marked completion/publication comment unless the maintainer-controlled body update can prove the issue's read timestamp/hash has not changed.

The first update must include immutable links and exact values for:

- Product acceptance, UX contract, package plan, Council decision, and fixture authority;
- implementation/runtime/styles/runbook/checker/capture driver;
- final evidence directory, frame roster, manifest, and evidence hashes;
- independent QA report, verdict, severity ledger, and limitations;
- handoff, tracker record, candidate/freeze/closure commits, and remote branch;
- exact P/D/C/I/Q result and `F=IP` while the final receipt is pending;
- exact requirement rows closed and explicitly not closed;
- predecessor and successor dependency receipt;
- proof boundary and any browser/AT limitation.

Update these live Project fields with current resolved field IDs rather than stale copied IDs: `Status`, `PRD / PID`, `Design artifact`, `Requirement IDs`, `Evidence`, `Owner role`, `Task summary`, `Architecture plan`, `QA plan`, `Delivery control`, `Council decision`, `Task dossier`, `Artifact readiness`, and `Execution scope`. Preserve `Priority=High`, the exact milestone, parent #115, and unset dates unless Arun provides exact dates.

Then, and only after first-pass exact readback:

1. leave the issue open and record `F=IP`;
2. append a pre-closure GitHub-readback receipt to the living tracker, commit it, explicitly push it, and remotely read it back;
3. with `F` still `IP`, replace `status:in-progress` with `status:done` and set Project Status to `Done`;
4. close the issue with `state_reason=completed`;
5. close the matching milestone only after it has `0 open` and all links/fields match;
6. update the successor ticket's dependency with the full published chain;
7. read back the issue, milestone, Project item, labels, fields, successor dependency, remote branch, and committed blobs;
8. append a final tracker publication/closure receipt that records those closing readbacks and `F=A`, then commit, explicitly push, and remotely read it back;
9. add one final immutable comment to the closed issue linking that receipt and recording `F=A`, then read back the comment plus issue/milestone/Project/successor state.

Do not create speculative QA issues. If governance later requires a candidate-bound QA ticket, create it only after an exact candidate hold and link it to the selected version/milestone.

### If no matching issue exists

Absence must be proven by a fresh authenticated, fully paginated search across open and closed Phase 2 issues, raw bodies, milestones, Project items, labels, requirement IDs, exact titles, and dedupe markers. If this absence is discovered at package activation, use this fallback **before Product work or implementation**; do not wait until artifacts exist. Repeat the same search after artifacts are complete before any update. Then create exactly one issue, never multiple partial tickets.

Required identity:

| Version | First-line marker | Exact title | Milestone |
| --- | --- | --- | --- |
| V19 | `<!-- phase2-dedupe-key: P2-PROTOTYPE-V19 -->` | `[PVA-014] Design v19 prototype — Trash` | #33 — `Phase 2 — Prototype Backlog v19 — Trash` |
| V20 | `<!-- phase2-dedupe-key: P2-PROTOTYPE-V20 -->` | `[PVA-015] Design v20 prototype — Suppressions` | #34 — `Phase 2 — Prototype Backlog v20 — Suppressions` |

Apply the six canonical labels from Section 4, add the issue to the Life Reflection Project as `Backlog`, make it a child of #115, and leave Start/Target dates unset unless Arun supplies exact dates.

The issue body must inline—rather than merely link—the relevant V19 or V20 requirements from Sections 6 or 7 and contain all of these headings:

1. Outcome.
2. Authority and current status.
3. Immutable predecessor chain and dependency gate.
4. Requirement IDs and exact closure/non-closure boundary.
5. Product constants and non-goals.
6. Information architecture and design alternatives.
7. Exact design requirements and copy/consequence rules.
8. Executable fixture/state/race matrix.
9. Responsive, keyboard, focus, accessibility, theme, and privacy contract.
10. Complete artifact roster and exact paths.
11. Product/Design/Council/implementation/QA/freeze sequence.
12. Package-specific and common acceptance criteria.
13. Evidence and manifest expectations.
14. Risks and stop conditions.
15. Proof boundary and limitations.
16. Definition of Done and post-publication readback.

After creation, immediately read back issue number, body marker, labels, milestone, Project Status, parent, and URL. If any field is wrong, leave the ticket open/Backlog and repair it before implementation; do not silently continue.

If the exact milestone, Life Reflection Project, required labels, or parent #115 is missing or inaccessible, stop and ask Arun for repair authority. Do not invent a replacement milestone, Project, parent, or date while creating the issue.

If the search finds a legitimate secondary ticket, link it from the canonical design issue and preserve its own scope/status; do not merge its claims into the canonical completion record. If it finds a true duplicate, do not close, transfer, or rewrite it without maintainer direction. Record both URLs, keep the selected canonical issue Backlog, and stop until dedupe ownership is resolved.

## 12. Start-of-package GitHub checks

Ticket existence is not execution authority, but the selected ticket must be read before Product work begins.

For V19, verify:

- #156 is open under milestone 33;
- it remains Backlog until Arun authorizes activation;
- V18 issue #155 and milestone 32 remain complete;
- after explicit activation authority, append/read back one dependency-rebind comment that names the full V18 chain through `da745d55…` or a newer documentation-only successor before Product work begins;
- no other V19 owner, branch, candidate, QA issue, or artifact exists.

For V20, verify:

- #157 is open under milestone 34;
- it remains Backlog until V19 is fully complete and explicitly released;
- after explicit activation authority, append/read back one dependency-rebind comment naming exact V19 Product/Design/Council/runtime/evidence/QA/freeze/publication SHAs before Product work begins;
- V19 issue/milestone/Project state and remote blob readback are complete;
- no other V20 owner, branch, candidate, QA issue, or artifact exists.

To check ownership before activation, read the issue assignees and fully paginated comments, Project Status, linked pull requests, open same-version branches/PRs, `git worktree list --porcelain`, and the active Codex task tree when available. There is no durable lock inferred from silence. If any source suggests another owner/candidate, or the sources disagree, ask Arun rather than taking over.

If activation is authorized and substantive Product work is starting, perform one read-back-guarded activation update:

1. append a uniquely marked start/dependency comment naming the owner instruction, exact baseline, allowed roster, and current gate state;
2. replace label `status:backlog` with `status:in-progress`;
3. change Project Status from `Backlog` to `In progress`;
4. update `Task summary`, `Delivery control`, `Artifact readiness`, `Execution scope`, and other now-current fields without inventing dates;
5. read back the issue, comments, labels, milestone, parent, Project item, and all changed fields before editing artifacts.

Resolve live Project field and option IDs with `gh project field-list 1 --owner arunpr614 --limit 100 --format json`; do not copy IDs from this handover. GitHub has no transactional multi-field update here, so compare the expected old value, change one field at a time, and read it back. Do not replace the entire issue body unless its pre-edit `updatedAt` and body hash still match the value you reviewed; prefer append-only marked comments for status/dependency/evidence receipts.

Detailed issue text or activation metadata alone does not make P, D, C, I, Q, or F pass.

## 13. Closure arithmetic and successor boundary

| Boundary | Closed | Open | Permitted statement |
| --- | ---: | ---: | --- |
| Current, after V18 | 22/57 | 35/57 | V19 queued; owner pause binding |
| After accepted/published V19 | 24/57 | 33/57 | Only `LID-SCP-004` and `LID-OPS-010` newly closed |
| After accepted/published V20 | 25/57 | 32/57 | Only `LID-VN-007` newly closed |

V20 does not close `LID-AIA-009`. V19 does not close `LID-OPS-009` or `LID-REF-007`. Ticket creation, detailed design, local rendering, self-tests, evidence capture, or QA assignment closes no row by itself.

## 14. Stop conditions

Stop and report the exact blocker if any of these occur:

- Arun has not explicitly lifted the V19 pause or the successor gate;
- the worktree, branch, remote, issue, milestone, or predecessor SHA differs unexpectedly;
- a predecessor is not independently passed, frozen, pushed, and read back;
- another active owner or candidate exists;
- Product, Design, Council, fixture, copy, state, or artifact rosters contradict one another;
- the proposed work would modify frozen predecessor or unrelated files;
- real/private/secret-shaped data appears in source, UI, logs, evidence, GitHub, or agent context;
- a required browser/AT behavior cannot be tested without an honest limitation;
- the capture helper would need to repair application behavior;
- candidate bytes change after QA assignment;
- GitHub dedupe, Project, milestone, or remote/blob readback is ambiguous.

Do not broaden authority merely to clear a blocker.

## 15. New-agent first-session checklist

- [ ] Read the latest owner instruction and preserve the pause unless explicitly lifted.
- [ ] If the instruction remains pause, provide only any requested read-only status and stop.
- [ ] After explicit resume, confirm the exact worktree, branch, full HEAD, clean/staged state, remote URL, and remote branch SHA.
- [ ] Read this handover, the living tracker, current #156/#157 bodies, milestones 33/34, PRD, UX specification, V5 audit, context, and V18 final records.
- [ ] Confirm V18's full candidate/freeze/closure/publication chain and live #155/milestone-32 completion.
- [ ] Confirm no V19/V20 artifacts or concurrent owner exist.
- [ ] Select V19 only; do not prepare V20 in parallel.
- [ ] Assign Product, Design, Project/Council, implementation, tooling, and fresh independent QA roles.
- [ ] Freeze exact Product/UX/Council/fixture/artifact/evidence authority before implementation.
- [ ] Preserve all predecessor bytes and use synthetic browser-memory data only.
- [ ] Run final-byte evidence, manifest, independent QA, freeze, explicit push, and remote/blob readback in order.
- [ ] Perform the mandatory post-artifact GitHub reconciliation in Section 11.
- [ ] Stop after V19 and wait for the successor instruction before V20.

## 16. Handover completion statement

This handover records enough Product, Design, Project, implementation, evidence, QA, publication, and GitHub context for a fresh AI agent to execute V19 and V20 without relying on the collapsed conversation history.

At this boundary:

- V18 is complete and published;
- V19 issue #156 and milestone 33 already exist and remain Backlog under an explicit owner pause;
- V20 issue #157 and milestone 34 already exist and remain Backlog behind V19;
- no V19 or V20 artifact exists;
- the next permitted action is to wait for Arun's explicit V19 confirmation.
