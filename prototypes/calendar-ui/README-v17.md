# Life in Days prototype v17 — Atomic Redating

> **Unfrozen implementation candidate · P=A · D=A · C=A · I=IP · independent QA pending · fictional deterministic data · browser memory only · no backend, persistence, provider, security, deployment, or production claim**

V17 is an additive prototype capsule over the frozen v16 archive. It represents one deliberate item-level Journal Date change with a complete two-day consequence preview, an immutable Original Timestamp, zero-or-one result cardinality, and deterministic failure, uncertainty, interruption, competing-revision, success, and replay states.

No v1–v16 file is changed. `app-v16.js` still renders the inherited archive. `runtime-v17.js` then registers a version-aware feature host, and `app-v17.js` adds the Atomic Redating capsule. The v17 runtime is intentionally reusable: later additive capsules can register a higher compatible version without changing this file.

## Run

From this directory:

```sh
node check-v17.mjs
LIFE_IN_DAYS_PROTOTYPE_PORT=4317 node serve.mjs
```

Open `http://127.0.0.1:4317/index-v17.html`.

Capture a fail-closed, exact-viewport Chrome evidence pair without putting
fixture state in the URL:

```sh
node capture-phase2-evidence-v17.mjs \
  --url http://127.0.0.1:4317/index-v17.html \
  --out /tmp/lid-v17-ready-390x844.png \
  --meta /tmp/lid-v17-ready-390x844.json \
  --width 390 --height 844 --fixture ready --theme light
```

The default `--view active` captures the active successor workspace. Use
`--view archive` to validate that same active QA manifest, fixture, snapshot,
and invariant set, then return through the visible **Back** control and capture
the inactive inherited archive with its integrated launcher:

```sh
node capture-phase2-evidence-v17.mjs \
  --url http://127.0.0.1:4317/index-v17.html \
  --out /tmp/lid-v17-archive-390x844.png \
  --meta /tmp/lid-v17-archive-390x844.json \
  --width 390 --height 844 --view archive --fixture ready --theme light \
  --motion no-preference --forced-colors none
```

Add `--selector '<CSS selector>'` to scroll a matched element into view before
the two-frame render wait and capture. The helper uses Node 22 built-ins, an
isolated temporary Google Chrome profile, and Chrome DevTools Protocol. It
records the PNG dimensions and SHA-256, generic page URL/title/history state,
QA manifest/invariants/snapshot summary, overflow, console and exception
events, request URLs, and storage/database/cache/service-worker counts. It
removes only the exact temporary Chrome profile it created. Optional
`--motion reduce|no-preference` and `--forced-colors active|none` arguments use
DevTools media emulation; requested and observed `matchMedia` values are
recorded and must agree. The frozen v17 helper also accepts query-free
`index-v18.html` through `index-v35.html`; it derives the target version from
the path and refuses capture unless the QA manifest and snapshot match that
target and expose the exact cumulative `[17..N]` loaded-version chain. Evidence
JSON records the target version separately from the helper's frozen tool
version and stores only the PNG basename, never an absolute output,
temporary-profile, or user-home path. Standard output may report the explicit
absolute output paths supplied by the operator.

Archive mode fails closed unless the feature is closed by main-document mouse
input on the visible Back control; the inactive host is empty; the launcher is
enabled, fully inside the viewport, at least 44 by 44 CSS pixels, and wins its
center plus four inset-corner hit-tests; and no visible inherited archive
control intersects it. Deterministic launcher geometry, hit-test, focus,
inactive-host, and inherited-control intersection diagnostics are stored in the
JSON. Both views reject horizontal overflow, non-generic URL/history state,
browser storage or registrations, and requests outside localhost/data. Archive
mode additionally requires zero captured console events; both modes require
zero exceptions. In archive mode, `--theme light|dark` also emulates the same
device colour-scheme preference before navigation so the inherited v16 device
setting is deterministic without writing its theme preference to storage.

The v17 index opens Atomic Redating directly. Use **Back to v16 archive** to reveal the inherited archive, then use the normal-flow **Atomic Redating · fixed synthetic demo · Prototype v17** launcher to return. It is inserted before the archive and never floats over archive controls. Eligible v16 **Change Journal Date** actions open the same workspace only when their visible item reference, type, label, current Journal Date, Original Timestamp, source state/revision label, and before snapshot can all be resolved. Journal cards (including uploaded journals), Daily Photos, and represented Telegram capture outcomes are mapped from their invoking v16 DOM context into detached browser-memory state. An incomplete context fails closed to the original v16 action; v17 never substitutes a different clicked item. `index-v16.html` remains a direct, frozen archive entry.

## V17 contract

- The fixed synthetic Source Item is **Monsoon walk note** on **18 Aug 2026**, interpreted in `Asia/Kolkata`. Its **Original Timestamp — 17 Aug 2026, 11:42 pm IST — is immutable** in every branch.
- A global/automatic opening uses that labelled fixed fixture. An inherited v16 opening instead identifies the exact clicked journal or Daily Photo from visible v16 context and shows its read-only source reference, type, label, current Journal Date, Original Timestamp, and displayed source state. The consequence model explicitly labels its cover, retained-source, generated-field, and destination-day rows as fixed synthetic fixtures rather than claiming to read the archive's complete day composition.
- Every opening constructs a fresh ready state for its launch context, clears prior destination/fixture/day-view/result state, focuses the feature `h1`, and begins at 0 intents, 0 effects, 0 history events, and 0 provider requests.
- A native **New Journal Date** input rejects same-day and future dates before an intent exists. The fixed prototype clock is `2026-08-19T10:00:00+05:30`.
- Clearing the native field enters the recoverable `date-required` state with heading **Destination required**, exact inline error **Enter a complete calendar date.**, no pressed named fixture, no destination projection, a disabled confirmation, and focus retained on the enabled required field. Entering a valid date recovers without Reset.
- Two equal consequence cards preview current- and destination-day Source sets, visibility, cover precedence, generated-field staleness, active/historical artwork, and exact source binding.
- Confirm creates one represented pending intent and locks the date control. A clearly labelled **Prototype-only outcome delivery** group can deliver success, known failure, result unknown, interruption, or a competing revision through the same accepted-intent reducer path. Known failure retries the same intent. Unknown and interrupted results offer a status check without creating another intent. A competing revision invalidates the preview with zero archive effect.
- Success moves the Source Item exactly once, retains the old AI cover in Artwork History, lets the old day remain visible through a synthetic Daily Photo, preserves the destination real-photo cover, marks both affected generated-field sets stale, queues no provider request, and adds one typed `Journal Date changed` event.
- A visible **Deliver duplicate result** replay check after success leaves one effect and one event. Both resulting Journal Day links open working in-memory projections and return to the intact completion summary.
- **Prototype states** makes `ready`, `future-rejected`, `same-day-rejected`, `pending`, `failure`, `unknown`, `interrupted`, `competing-revision`, `success`, and `rapid-repeat` directly reachable. Reset restores the exact current Source Item context; the global QA `reset()` restores fixed authority.
- Opening a successor feature clears inherited query/hash state and installs a null browser-history payload. Source, date, fixture, branch, and operation state are never encoded in the URL or title and are never written to storage, requests, logs, service workers, or telemetry-shaped output by the v17 layer.
- The workspace has one feature `h1`, a skip target, labelled native controls, visible focus, non-colour state labels, polite status and assertive error regions, 44 px preferred controls, 13 px essential metadata, compact single-column consequences, a 568 px landscape path, dark/light themes, reduced-motion handling, and forced-colour handling. Primary task content precedes the prototype-state/proof console in DOM, visual, keyboard, and screen-reader order at every width; wide screens place the console in a secondary right rail. Ordinary input changes restore the equivalent focused control after the additive runtime rerenders it; text-capable future controls may also retain their selection.
- Pre-intent **Cancel**, Escape, and **Back to v16 archive** exit without changing state and restore the exact invoking control, archive scroll, and view. A global/automatic opening returns to the integrated launcher. Pending, unknown, and interrupted intents cannot be silently abandoned; attempted Back/Escape remains in the task, focuses the operation status, and announces the required resolution/status path.
- The inherited stale v15 source-conflict sentence is corrected at runtime to the Council-approved v16 successor copy. The frozen `app-v16.js` byte is not edited.

## Deterministic QA surface

`window.__LID_QA__` is a frozen test interface. Returned values are detached snapshots; the interface exposes no live state object.

```js
window.__LID_QA__.manifest();
window.__LID_QA__.reset();
window.__LID_QA__.setFixture("pending");
window.__LID_QA__.dispatch("confirm");
window.__LID_QA__.settle("success");
window.__LID_QA__.snapshot();
window.__LID_QA__.runInvariants();
```

`manifest()` reports `loadedVersions: [17]` on `index-v17.html`. `runInvariants()` checks complete Source launch context, Original Timestamp immutability, coherent `date-required` state, zero-or-one intent/effect/event cardinality, exact no-effect and success projections, real-photo precedence, retained art history, absence of provider requests, generic URL/title/live-region privacy, task-before-console DOM order, one active feature heading, and horizontal overflow.

The underlying runtime also exposes a frozen `window.__LID_RUNTIME__` registry with `registerFeature`, `openFeature`, `openLatest`, `listFeatures`, and `manifest` surfaces for later append-only capsules.

## Additive file roster

| File | Purpose |
| --- | --- |
| `index-v17.html` | Frozen v16 dependencies plus classic-defer v17 runtime/application/style loading |
| `runtime-v17.js` | Version-aware additive registry, feature host, launcher, capture-phase integration, privacy route reset, focus/announcement shell, and detached QA plumbing |
| `app-v17.js` | Atomic Redating domain state, fixtures, transitions, two-day projections, render contract, invariant checks, and `window.__LID_QA__` |
| `styles-v17.css` | V17-scoped responsive, focus, theme, reduced-motion, and forced-colour presentation |
| `README-v17.md` | Candidate runbook and bounded claim |
| `check-v17.mjs` | Narrow static/package/frozen-byte validator without changing `package.json` |
| `capture-phase2-evidence-v17.mjs` | Fail-closed, exact-viewport local Chrome/DevTools PNG and JSON evidence capture using only Node built-ins |

Product Council authority is in `docs/prototypes/v17/COUNCIL-v17.md`; fixture authority is in `docs/prototypes/v17/ATOMIC-REDATING-FIXTURES-v17.md`.

## Manual branch path

1. Reset the fixed authority and change the native field to `2026-08-18`; verify same-day rejection, a disabled confirm action, zero intents, and zero effects.
2. Change it to `2026-08-20`; verify future rejection and the same zero state.
3. Return to `2026-08-17`, confirm, and verify one pending intent with zero effects. Exercise each visible **Prototype-only outcome delivery** control from a fresh pending intent.
4. Verify failure, unknown, interrupted, and competing-revision outcomes preserve the before projection; verify Retry and Check status reuse the accepted intent.
5. Deliver success, follow both resulting-day links, return, and verify one effect, one event, unchanged Original Timestamp, retained art history, and no provider request.
6. Choose **Deliver duplicate result** and verify delivered results may exceed one while effect and event cardinality remain one.
7. Return to v16 and activate inherited **Change Journal Date** controls from an uploaded journal (including `evening-rain.txt`), a Voice Journal, a Daily Photo, and a completed capture outcome. Verify each fresh opening names only its exact item context, begins at 0/0/0/0 with `h1` focus, and changes neither URL nor storage. The caption-grammar-only **Market morning** fixture represents no Source Item and renders no eligible date-change action, so it remains in v16. Any other incomplete context must continue through its original v16 path without opening v17.
8. Before confirming, change the destination, then Cancel; verify the exact invoking action regains focus at the same archive scroll position and no draft carries into the next opening. Verify Back and Escape do the same. From pending, unknown, and interrupted, verify Back/Escape remain in the task and focus its operation status.
9. Repeat pointer and keyboard paths at 320×900, 390×844, 568×320, 960×900, 1280×720, and 1440×900 in light/dark as applicable; inspect reduced-motion and forced-colour treatments and confirm the integrated launcher never occludes an archive control.

## Deliberate limits

This static prototype does not prove durable Source Item or Journal Day persistence, backend atomicity, rollback, concurrency control, cross-process idempotency, restart recovery, VoiceNotes integration, actual cover selection, generated-field or artwork processing, provider behavior, authenticated access, encryption, private-cache behavior, deployment, operations, production privacy, formal accessibility conformance, or production readiness. The UI is evidence only of deterministic synthetic frontend representation.
