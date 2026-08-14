# Life in Days prototype v10 — Product Council contract

Date: 2026-08-14
Package: `PVA-005 Resilient Application Shell`
Status: Approved for prototype implementation

## 1. Council and authority

- Product Manager: `/root/v10_product_manager` — Product gate **A**.
- UI/UX Designer: `/root/v9_upload_qa`, reassigned for v10 design — Design gate **A**.
- Project Manager / Council chair: `/root/v9_independent_qa`, reassigned for v10 governance — Council gate **A**; root is the mechanical scribe after the chair's source and conflict review.
- Implementing agent: `/root` — Implementation gate **IP**.
- Independent QA: a fresh agent must be created only after a stable v10 fingerprint exists — QA gate **—**.

Authority order is direct Arun decisions, the PRD, the UX specification, the v5 feature audit, and the prototype tracker. Frozen v6 through v9 behavior is a regression contract. This Council document resolves only the v10 prototype package.

## 2. Outcome and evidence boundary

V10 represents the interruption/failure portion of audit gap 3 through one coordinated application-shell state model. It covers loading, month failure, partial-media failure, connection interruption, a bounded unsaved-Correction exercise, session expiry and generic reauthentication return, total/request server failure, and explicit idempotent retry.

The only permitted closure statement is:

> **The resilient application shell is prototype-represented with synthetic fixtures; connectivity, server behavior, authentication, persistence, and idempotency enforcement remain unverified.**

The prototype may prove deterministic fictional browser behavior, layout, semantics, focus, and state transitions. It does not prove that a network, server, media store, Cloudflare session, persistence layer, job runner, or idempotency boundary exists.

## 3. Ownership boundaries

### 3.1 Correction

V10 may include a bounded `Prototype interruption exercise` with one innocuous synthetic source and Correction draft. It exists only to evaluate connection loss, in-memory retention, Retry, navigation warning, and stale-callback behavior. V15 remains the owner of the real Correction editor, base revision, author/time, provenance, history, removal, and lifecycle. V10 does not close `LID-SRC-001`.

### 3.2 Human access

V10 represents only the in-app session-ended interruption and a generic synthetic return. V34 retains unauthenticated, denied, MFA, Cloudflare Access enforcement/assertion, application-security disclosure, and full `LID-OPS-001` closure. V10 contains no login form, username, password, reset, identity, assertion, hostname, callback path, or MFA imitation.

### 3.3 Offline and durability

MVP has no offline mode. V10 must not claim cached availability, queue writes for later, call a draft synced, or promise continued availability. All shell fixtures, drafts, retry identities, and completions live only in the open JavaScript page and reset on reload.

## 4. Default and fixture console

Reload opens the frozen v9 first-use Calendar in `shell/ready`. The exact compact boundary remains `Simulated data · no persistence · no integrations connected`.

A restrained `Prototype states` disclosure is visually separate from product Settings. It shows readable current state and free-play/guided controls for this allowlisted in-memory fixture set:

| Key | Label | Purpose |
| --- | --- | --- |
| `shell/ready` | Ready | Frozen v9 first use and inherited populated regression |
| `shell/app-loading` | Initial loading | No stale archive content while the first request is unresolved |
| `shell/month-failure` | Month unavailable | Verified month → pending target → failure → explicit retry |
| `shell/media-failure` | Image unavailable | One real-photo item fails without hiding its day or journals |
| `shell/connection-interrupted` | Connection interrupted | Settled content remains readable but freshness is unknown |
| `shell/correction-interrupted` | Unsaved Correction | Bounded dirty/save-failed/retry/leave-warning exercise |
| `shell/session-expired` | Session ended | Private archive removed/inert; generic reauthentication representation |
| `shell/session-expired-with-draft` | Session ended with unsaved Correction | Explicit draft-loss boundary before generic return |
| `shell/server-failure` | Server unavailable | Empty-load and settled-request failure variants |

Scenario controls may select success, repeat-failure, rapid repeat, and navigation-before-completion branches without adding more public fixture keys. Invalid or missing fixture state fails closed to `shell/ready`. Fixture keys never enter URL, title, history payload, storage, cookies, requests, logs, or analytics.

## 5. State priority

One global state hierarchy prevents contradictory calls to action:

1. Session ended or reauthentication boundary.
2. Initial loading or total server failure.
3. Unsaved-Correction leave confirmation.
4. Persistent connection interruption.
5. Pending/failed Calendar or Almanac request.
6. Item-level media failure.
7. Ready UI.

Session expiry removes or makes inaccessible the private archive DOM. A total failure with no settled content replaces content. Connection interruption keeps settled authentic content readable but freshness-unknown. Local state remains visible only when it adds object-specific context; it loses a competing primary action when a higher state already supplies one.

## 6. Required states and exact behavior

### 6.1 Initial loading

- H1: `Loading your archive…`
- Body: `Waiting for the server. No new archive content is shown until this request finishes.`
- Main is `aria-busy=true`; layout-preserving skeletons are `aria-hidden`.
- No prior photos, journals, first-use copy, or fabricated content appears while state is unknown.
- A user-triggered prototype fixture focuses the heading; a natural boot would not steal focus.
- Success atomically renders ready; failure becomes the total server state.

### 6.2 Month request and failure

- A user month request keeps the verified origin month in memory and renders the target heading with a neutral same-size skeleton grid.
- Visible pending status: `Loading September 2026…`.
- Pending state does not change canonical URL/history and never reuses August imagery beneath September.
- Failure restores the verified origin month and says: `September 2026 could not be loaded. August remains shown and unchanged.`
- One action: `Retry loading September`.
- Retry targets the same month. Success commits the target atomically and creates at most one history entry. Navigation cancels the request; stale completion cannot mutate the new destination.

### 6.3 Partial media failure

- Calendar uses a neutral paper treatment and accessible `cover image unavailable` name; no badge, status, provenance, or watermark appears over image pixels.
- Selected Museum Margin and full Journal Day say: `This image could not be loaded. The photo record and authentic journals remain available; this prototype does not verify the Original.`
- Action: `Retry image`.
- Retry updates the same item, never changes photo count/order/identity, never substitutes Generated Artwork/another photo, and is busy/guarded while pending.
- Success announces `Image available.` and restores logical item focus; repeat failure returns to the same recoverable state.

### 6.4 Connection interruption

- Persistent, non-dismissible compact strip title: `Connection interrupted`.
- Body: `What is already visible can be read, but it may be out of date. Changes cannot be saved until the connection returns.`
- Action: `Check connection`.
- Checking is scoped and guarded. Failure remains interrupted. Synthetic success announces `Connection restored. Refresh content before relying on the latest changes.`
- Navigation among already rendered local prototype views remains possible. A failed save is never called saved. Reconnection never auto-submits a draft or failed operation.

### 6.5 Unsaved Correction exercise

- Eyebrow: `Prototype interruption exercise`.
- Heading: `Correct displayed text`.
- Helper: `This draft is kept only in this open page until a save is confirmed. The source journal remains unchanged.`
- Dirty state: `Unsaved changes · kept only while this page remains open.`
- Actions: `Save Correction` and `Cancel`.
- Interrupted result title: `Correction not saved`.
- Body: `The connection was interrupted. Your text remains only in this open page. The source journal is unchanged.`
- Action: `Retry saving`.
- Retry while disconnected says `Still disconnected. Nothing was saved.` and leaves represented-save count at zero.
- Connection restoration never saves automatically. Explicit Retry enters `Saving Correction…`, then says `Correction save simulated. One Correction is displayed in this tab; nothing was persisted.`
- Rapid/repeated activation yields exactly one represented Correction.
- Leaving a dirty draft opens `Leave with an unsaved Correction?` with `Keep editing` and `Discard Correction and leave`. Escape equals Keep. Keep restores exact text, selection, and focus; Discard performs the intended navigation once. Reload/close uses native `beforeunload` and the draft is absent after accepted reload.

### 6.6 Session ended and generic return

- Private app content is omitted or inert and hidden from assistive technology.
- Heading: `Your session has ended`.
- Body: `Life in Days remains private. Your archive has not been deleted. Reauthenticate to continue.`
- If dirty: `An unsaved Correction cannot be carried through reauthentication and will be discarded when you continue.`
- Action: `Reauthenticate`.
- Boundary: `Prototype state · No authentication occurs here.`
- Next heading: `Reauthentication represented`.
- Body: `The production service would return through Cloudflare Access. This prototype has not verified an account, MFA, assertion, or session.`
- Action: `Return to Life in Days`.
- Return uses replacement to a generic Calendar route, with no selected date, screen, draft, search query, or private return target. It announces `Returned to Life in Days in this prototype. No authentication was performed.`
- Back/Forward cannot reveal archived DOM while the session gate is active.

### 6.7 Generic server failure

With no settled content:

- H1: `Life in Days is temporarily unavailable`.
- Body: `Archive data could not be loaded from the server. No change was submitted. The shell remains available, but archive content is not shown as current.`
- Action: `Retry loading archive`.

With settled content, the compact strip says `Life in Days could not complete this request.` and `The result was not confirmed. What is already open remains unchanged in this page.` with action `Try again`.

`Show sanitized details` may expose only `Error class: Temporary server failure`, `Operation: Load archive`, and `Personal content: Not included`. It never exposes hostname, path, stack, request/auth/integration identifier, content, filename, or prompt. Retry passes through loading, is guarded, and resolves once or returns honestly to failure.

## 7. Idempotent state model

V10 uses a small pure shell reducer plus a single in-memory operation registry. An operation token contains a monotonically increasing attempt identity, fixture generation, logical kind, and stable logical key. It is never serialized.

- While one operation is active, the same action is disabled/`aria-disabled` and repeated pointer/keyboard activation is ignored.
- Every delayed completion verifies that its operation token and fixture generation are still current.
- Fixture reset and session expiry cancel all pending operations. Navigation cancels affected month/media/Correction/server operations; connection checks may survive ordinary view changes.
- Retry remains explicit after failure. Reconnection performs no hidden retry.
- Month success creates at most one history entry; media Retry keeps item count unchanged; Correction count remains zero until explicit success and then exactly one; server retry reaches ready once.
- `Add duplicate anyway` remains a separate explicit exception owned by later upload/duplicate work.

## 8. URL, history, storage, and privacy

The inherited URL allowlist remains `view`, `month`, `through`, `date`, `screen`, `section`, and `rail`. V10 never adds shell/fixture/error/connection/auth/retry state, pending month, operation identity, draft, text, caption, title, tag, filename, focus selector, or search query.

`document.title` remains `Life in Days`. Browser history contains only the inherited opaque entry key and a live-memory map. No shell fixture, draft, operation, error/auth state, or result enters localStorage, sessionStorage, cookies, IndexedDB, Cache Storage, a service worker, clipboard, referrer, request, console, analytics, or logs. Existing theme and Almanac-collapse preferences are the only inherited localStorage values.

Search stays live-memory-only. Session expiry replaces to `view=calendar&month=2026-08`; no private redirect state exists. Static v10 makes no external auth, server, integration, or provider request.

## 9. Interaction, accessibility, and motion

- One dedicated polite shell live region announces one concise transition. Session and user-triggered save failure may use assertive semantics. Skeletons and journal bodies are never announced.
- Global loading/connection strips do not steal focus. Month failure may focus Retry after a user-triggered request. Media and generic Retry preserve a logical object/action anchor.
- Session gate is a focus-trapped modal/privacy surface; initial focus is its heading and app content is absent/inert. Generic return focuses the Calendar/first-use H1.
- Leave confirmation traps focus; heading then `Keep editing`; Escape means Keep; exact draft focus/selection returns.
- Real buttons, visible non-color state, at least 24×24 CSS-pixel controls, 44×44 compact primary actions, planned 3:1 UI/focus and 4.5:1 text contrast.
- Reduced motion uses immediate state changes, no shimmer/pulse/translation/scale, and no spinner requirement. Normal local feedback is at most 180 ms.

## 10. Responsive and visual contract

Use the frozen v9 paper/ink type and color system. Status is a compact strip or inline row, not a dashboard card, illustration, giant icon, shadowed warning block, or red-page takeover. One global primary action is visible.

- 1440/1280: full-width strip below topbar; copy one or two lines and action aligned right.
- 960: strip stays in normal flow above main content and compact navigation; it is never an overlay.
- 700: title/copy and action may stack.
- 390: 16 px gutters; full-height session sheet; primary actions stay above safe-area/bottom navigation.
- 320: 8–12 px shell gutters; dialogs `calc(100% - 16px)`; complete copy wraps; seven Calendar columns and no page horizontal overflow.
- 200% text and 400% page zoom reflow to compact. Landscape retains every action.
- Essential state text is at least 13/18; body 16/26; small UI 14/20.

## 11. Frozen regression contract

- V9 first-use default and readiness fixtures, real Uploaded Journal simulation, never-verified Recovery language, Settings focus/Back.
- V8 Almanac load/jump/collapse/canonical day/return, bounded range, hidden/Trash-only exclusion.
- V7 Calendar chooser, seven columns, keyboard/Today/selected/focus rings, quiet days, real-photo precedence, no image overlays.
- V6 private Search query, initial scope, no query in URL/title/history/storage.
- Populated Calendar/Museum Margin/full day, Upload, Search, Settings, theme, Back/Forward/focus/scroll.
- Exact `life-in-days`, prospective-only import, no fuzzy/additional tags, historical import, sharing, reminders, coaching, blank composer, web photo upload, semantic/image search, or offline feature.
- No v6 through v9 artifact may change. V10 uses newly numbered files and an additive resilience stylesheet.

## 12. Explicit exclusions

V10 does not close or implement: v14 durable Upload; v15/16 Correction/conflict lifecycle; v23/27 AI failure/provider attempts; v24/31/32 System Health/storage/backup/recovery evidence; v34 access/security disclosure. It does not add credentials, provider fallback, automatic retries, offline cache/sync, HA/SLA, deployment, durable persistence, security controls, or production readiness. Outside-UI header/log/idempotency evidence remains unverified.

## 13. Independent QA gate

A fresh QA agent must bind to exact final hashes and verify:

1. New v10 artifacts, Council/handoff/evidence, syntax, clean console, and frozen v6–v9 hashes.
2. Default ready first-use and no external requests/false claims.
3. Initial loading geometry/copy/semantics and ready/failure transitions.
4. Month pending/failure/retry success and repeat-failure; no stale imagery, URL churn, duplicate history, or stale callback.
5. Media failure across Calendar/Margin/full day; readable authentic sources; no overlays; same count/order after guarded Retry.
6. Connection strip across all views; navigation/readability/freshness language; checking/restoration; no auto-save.
7. Correction draft storage privacy, caret/focus, disconnected save/retry count zero, explicit post-reconnect Retry count one, repeat activation, Cancel/Escape/navigation/Back/beforeunload and no resurrection.
8. Session from Calendar/full day/dirty draft; no private DOM, safe generic route, focus trap, no auth imitation, no private redirect state.
9. Empty and settled server failures, sanitized details, explicit guarded retry and honest repeat failure.
10. Priority collisions: session+draft, connection+draft, connection+media, connection+month, total error.
11. URL/title/history/storage/cookie/IndexedDB/cache/service-worker/referrer/network/console privacy.
12. Headings/landmarks/live regions/aria-busy/skeleton/dialog/focus/keyboard/target/contrast/non-color state.
13. 1440×900, 1280×720, 960×900, 700×900, 390×844, 320×568, compact landscape, 200% text and 400% page zoom observations, both themes, reduced motion.
14. Full frozen first-use and populated v6–v9 regressions and forbidden-scope scan.

Required current-run captures include: 1440 connection strip light/dark; 1280 loading light/dark; 960 month failure; 700 settled server failure; 390 session and return; 320 connection+draft/leave/media; retry pending/success/failure; zoom/landscape/reduced-motion evidence.

Any UI-byte change invalidates QA. A Pass requires no unresolved Council contradiction and zero Critical/High/Medium/Low findings after repair. V11 is not released until the passed fingerprint and freeze record exist.
