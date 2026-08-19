# Atomic Redating fixtures v17

All fixtures below are fictional, deterministic, local to browser memory, and resettable. No fixture value may be written to a URL, title, browser-history payload, storage surface, service worker, request, log, or telemetry-shaped output.

## Global fixed synthetic authority

The global launcher and direct v17 opening use this authority. An eligible inherited v16 action instead creates a detached LaunchContext from that exact invoking item's visible context. It must contain item reference, type, label, current Journal Date, Original Timestamp, displayed source state/revision label, and a before snapshot. Uploaded Journals (including `evening-rain.txt`), Voice Journals, Daily Photos, and completed Telegram capture outcomes are eligible only when all fields resolve. An incomplete action follows its original v16 behavior and v17 does not open or substitute this fixed item.

- Fixed clock: `2026-08-19T10:00:00+05:30`
- Timezone: `Asia/Kolkata`
- Source Item: `src-journal-monsoon-walk`
- Current Journal Date: `2026-08-18`
- Valid destination: `2026-08-17`
- Immutable Original Timestamp: `17 Aug 2026, 11:42 pm IST`
- Current-day cover before move: `Rain-lit window` (AI artwork)
- Destination-day cover before move: `Tea beside the blue notebook` (real Daily Photo)
- Source fixtures are synthetic prose and abstract illustrations only.

## Required branches

| Key | Visible state | Required invariant |
| --- | --- | --- |
| `ready` | Valid destination and complete two-day consequence preview | No intent and no archive effect |
| `date-required` | Ephemeral manual empty/invalid date; no named fixture button is pressed | `Destination required`; exact inline error; enabled focused field; zero intent/effect/event/provider request; no destination projection |
| `future-rejected` | Future date with inline error | Confirm disabled; zero intent |
| `same-day-rejected` | Current Journal Date with inline error | Confirm disabled; zero intent |
| `pending` | One accepted intent, controls locked | Zero archive effect while pending |
| `failure` | Known-zero failure with Retry | Exact before state; same intent reused |
| `unknown` | Result unknown with Check status | Zero second intent; exact before state |
| `interrupted` | Connection interrupted before result | Exact before state; status check available |
| `competing-revision` | Newer source revision invalidates preview | Zero effect; review/restart required |
| `success` | One source moved with both resulting-day links | Exactly one effect and one typed event |
| `rapid-repeat` | Duplicate/late success delivery after success | Still exactly one effect and one event |

## Successful consequence truth

- `src-journal-monsoon-walk` leaves `2026-08-18` and enters `2026-08-17` exactly once.
- The Original Timestamp remains `17 Aug 2026, 11:42 pm IST`.
- The old day stays visible because a synthetic photo remains; its AI-art cover is removed from active cover state and retained in Artwork History because its bound source set changed.
- The destination day keeps its real Daily Photo cover; real-photo precedence is not displaced.
- The moved source makes destination-day generated fields visibly stale and queues no automatic provider request.
- One typed `Journal Date changed` event links the source and both dates.

For inherited contexts, the clicked item's reference, type, label, current Journal Date, Original Timestamp, and displayed source state replace the global source identity throughout the Source card, projection membership, history event, and resulting-day links. Cover, retained-source, generated-field, and destination-day rows remain explicitly labelled fixed synthetic consequence fixtures; they do not claim to read a v16 day's complete composition.

## Required live checks

1. Open the workspace from the labelled fixed-demo launcher and from eligible uploaded-journal, Voice Journal, Daily Photo, and completed-capture `Change Journal Date` actions. Verify exact invoking context or original-v16 fail-closed continuation.
2. Sequentially complete Source A, exit, then open Source B; verify B's identity, fresh `ready`, 0/0/0/0, no prior day view/destination/fixture/result, and `h1` focus.
3. Traverse every named fixture with pointer and keyboard; Reset preserves the current Source Item context and the QA reset returns global fixed authority.
4. Clear the date: verify `date-required`, heading `Destination required`, exact error `Enter a complete calendar date.`, no pressed named fixture, required/error semantics, preserved field focus, disabled confirmation, neutral preview, and 0/0/0/0. Enter a valid date without Reset.
5. Confirm `future-rejected` and a same-day destination cannot dispatch an intent.
6. Confirm `failure`, `unknown`, `interrupted`, and `competing-revision` keep the complete before snapshot.
7. Settle `pending` to success and then deliver a duplicate; source membership and history-event cardinality remain one.
8. Follow both success links and return without losing the success summary.
9. Before intent, Cancel/Back/Escape must restore exact invoker focus, scroll, and archive view without mutation. Pending/unknown/interrupted Back or Escape must remain in-task and focus status.
10. At 320×900, 390×844, 568×320, 960×900, 1280×720, and 1440×900, verify task-before-console DOM/visual order, no horizontal overflow, complete reachability, and no launcher occlusion.
11. Verify visible focus, native labels/error semantics, privacy-safe status announcements, dark/light, reduced motion, and forced colours.
12. Verify URL/title/history/storage/network/console privacy before and after every branch.
13. Verify direct v16 reachability and frozen dependency hashes.
