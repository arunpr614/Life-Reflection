# Life in Days v17 Product Council — Atomic Redating

- **Decision date:** 2026-08-19
- **Baseline:** frozen v16 commit `01d1f054a12773e07f91096b8d76b0c5f4064329`
- **Package:** `PVA-012 Atomic Redating`
- **Requirements:** `LID-SCP-002`, `LID-SRC-003`, redating portion of `LID-SRC-004`
- **Product Manager:** Approved
- **Expert UI/UX Designer:** Approved
- **Project Manager:** Approved
- **Council disposition:** **Approved for additive v17 implementation**

## Product acceptance

V17 must let a person deliberately change exactly one synthetic Source Item's Journal Date while keeping its Original Timestamp immutable. The review must name the Source Item, current day, destination day, and fixed `Asia/Kolkata` interpretation; reject future dates before an intent exists; preview the old- and new-day visibility, cover, source-set, generated-field, artwork-staleness, and retained-history effects; and require an explicit confirmation.

A represented known failure changes nothing. A represented unknown result creates no second intent and offers a status check. A represented success applies exactly once, appends exactly one typed history event, and offers links to both resulting Journal Days. Rapid repeats, navigation, stale callbacks, and a competing source revision must not create a second effect or partial two-day state.

The prototype may demonstrate deterministic browser-memory state only. It does not claim durable persistence, backend atomicity, concurrency control, idempotency across processes, provider access, encryption, authentication, deployment, or production readiness.

## Experience contract

The approved interaction is a focused management workspace, not a transient toast or small confirmation overlay:

1. **Choose item** — a compact Source Item summary names its synthetic source and immutable Original Timestamp.
2. **Choose destination** — a native date field is labelled `New Journal Date`; current and future destinations expose inline, non-colour-only validation.
3. **Review consequences** — two equal day cards show `Current day` and `Destination day`, with before/after membership, visibility, cover, generated-field, and artwork consequences.
4. **Confirm** — `Change Journal Date` creates one pending intent; `Cancel` or `Back to v16 archive` is safe before confirmation.
5. **Resolve** — success, known failure, unknown result, connection interruption, competing revision, and rapid-repeat branches remain visually distinct and preserve the exact consequence context.

The global launcher is a labelled fixed synthetic demo in normal document flow. An inherited v16 opening is permitted only when the invoking item's visible reference, type, label, current Journal Date, Original Timestamp, displayed source state/revision label, and before snapshot resolve into one detached LaunchContext. Uploaded Journals, Voice Journals, Daily Photos, and completed capture outcomes are supported. Incomplete context follows the original v16 action and v17 does not open or substitute the global fixture. Every permitted opening constructs fresh ready state at 0 intents/effects/events/provider requests and focuses the feature `h1`.

Primary task content precedes the prototype state/proof console in DOM, visual, keyboard, and screen-reader order. Wide layouts use a secondary right rail; at 1020 px and below the full task appears before the console. The inactive launcher must not use a fixed overlay or occlude any archive control.

An empty date has the exact ephemeral fixture identity `date-required`, heading `Destination required`, and error `Enter a complete calendar date.` No named fixture button is pressed, the required date field remains enabled and focused with separate help/error semantics, confirmation is disabled, all counts remain zero, and no destination facts are fabricated. A valid date recovers without Reset.

Before an intent, Cancel is a route exit: it discards the draft and restores the exact invoking control, scroll, and archive view without mutation. Back and Escape share that safe-exit path. Pending, unknown, and interrupted intent states cannot be silently abandoned; Back/Escape remain in the task and focus the operation status. Reset is a separate console action and preserves the current Source Item context.

The workspace has one `h1`, a main landmark, a skip target, visible focus, 44 px preferred controls, essential metadata at least 13 px, keyboard-operable native controls, polite status and assertive error regions, and no horizontal page scroll at 320 px, 390 px, medium, wide, or relevant landscape widths. On compact layouts, day cards stack in reading order and actions remain reachable without a nested scroll region. Light, dark, reduced-motion, and forced-colour treatments must preserve meaning.

Private-looking fixture values, selected dates, operation identifiers, and branch choices remain in memory only. They must not enter the URL, title, history payload, local/session storage, IndexedDB, Cache Storage, service workers, network requests, console output, or live-region text. All committed content and evidence is explicitly synthetic.

## Alternatives considered

1. **Small confirmation modal over the v16 day view.** Rejected because the two-day consequences, interruption states, and original-timestamp boundary become cramped and easy to miss.
2. **Dedicated task workspace with consequence cards.** Approved because it supports deliberate review, resilient state transitions, compact reflow, and provenance-on-demand while preserving a clear return to the frozen archive.

## Architecture and freeze decision

V16 remains byte-for-byte immutable. V17 adds a one-time append-only compatibility runtime plus v17-scoped application, style, index, guide, authority, QA, and evidence files. Future versions may register additive capsules through that runtime but may never edit a frozen earlier layer. `package.json`, `serve.mjs`, all v1-v16 assets, `origin/main`, and the separate GitHub v01-v16 refinement program are outside this package's mutation scope.

The v17 candidate may proceed to independent QA only after all named fixtures in [ATOMIC-REDATING-FIXTURES-v17.md](ATOMIC-REDATING-FIXTURES-v17.md) are reachable in the visible prototype-state console and through the read-only QA surface, static checks pass, and exact candidate/evidence hashes are held. Any candidate, Council, fixture-authority, or evidence-byte change after QA starts invalidates that verdict.

## Council closure test

The Council decision remains Approved only if implementation and independent QA show all of the following:

- the Original Timestamp is visible and unchanged in every branch;
- future and same-day destinations cannot create an intent;
- failure and unknown-result branches have zero represented archive effect;
- success changes exactly one Source Item, both day projections, derived state, artwork state, and one history event together;
- repeat and stale results remain single-effect or no-effect as specified;
- both resulting day links work within the synthetic workspace;
- inherited v16 remains directly reachable and its frozen bytes are unchanged;
- the QA verdict records Critical 0 and High 0 and truthfully states the prototype boundary;
- inherited journal/photo/capture actions either show only their exact resolved LaunchContext or continue through original v16 behavior without opening v17;
- every opening is fresh at 0/0/0/0 with `h1` focus, task content precedes the QA console, and the inactive launcher occludes no archive control;
- `date-required` is coherent and recoverable, pre-intent Cancel restores the exact invoker, and unresolved intents cannot be silently abandoned.
