# Life in Days prototype v12 — independent design QA

Date: 2026-08-16
Package: `PVA-007 Telegram Capture Companion`
Requirement disposition: audit gap 9's capture-companion portion and the frontend-prototype portions of `LID-TG-001` through `LID-TG-005` are prototype-represented; Telegram connectivity, media processing, durable capture, authenticated handoff, persistence, and backend enforcement remain unverified
Independent QA agent: `/root/v12_independent_qa_final`
Evidence agent: `/root/v12_evidence_final_abb`
Verdict: **Pass**

## Immutable artifact identity

The UI Pass applies only to these exact SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/index-v12.html` | `a4ad82b9d68a7ecd736ab63eeebe80c7542063c5b4bbe530351a25a82d16fe7b` |
| `prototypes/calendar-ui/app-v12.js` | `4999e1bd87256cd7d2ee90cb4f3f36cace98503c4e821f8d3f7620bf1f8b5f0d` |
| `prototypes/calendar-ui/styles-v12.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `prototypes/calendar-ui/styles-v12-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `prototypes/calendar-ui/styles-v12-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |
| `prototypes/calendar-ui/styles-v12-resilience.css` | `d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c` |
| `prototypes/calendar-ui/styles-v12-date-review.css` | `525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5` |
| `prototypes/calendar-ui/styles-v12-telegram.css` | `7a0ea5404e3292cde147649a6de561b300a987a3c2ed2638ae61d407f141ad7c` |

The separate package/check artifact was also held and rechecked:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/package.json` | `e11e52086687cc7ac53083721d9a7321627aac56b9045dc27100da64b76666fa` |

Any byte change to a UI artifact invalidates this disposition and requires a fresh complete independent gate. A package/check-artifact change requires the relevant static check and identity record to be repeated before the package can remain frozen.

## Severity summary

| Critical | High | Medium | Low |
| ---: | ---: | ---: | ---: |
| 0 | 0 | 0 | 0 |

## Coverage completed

### Entry, guide, and canonical scenarios

- Verified the truthful inherited Settings status and the Settings → Integrations → Telegram → Open capture companion entry at wide, exact 960/901, and 320 px layouts. Reload fails closed to the inherited ready/first-use Calendar.
- Verified the default no-activity state, one H1, structural page hierarchy, and identical DOM/visual order: synthetic input summary, conversation, outcome, then the numbered guide. The order remained intact at 1440, 1280, 960, 901, 640, and 320 px and 568 × 320 landscape.
- Verified every canonical T1–T7 scenario against the Council and fixture sheet: exact timestamps, receipt or explicit Journal Date, caption results, archive baselines, count and cover effects where Product defined them, review outcomes, failure, Retry, bot copy, actions, and restrained live announcements.
- Verified T3 as three independently represented received photos in stable order, one caption carrier and two `No Photo Caption` siblings, first-photo cover, truthful partial counts, and no album-complete claim.

### Authorization, media, and caption rules

- Verified four authorization failures produce byte-identical generic product outcome DOM, disclose no sender/chat identity or media facts, offer no unsafe success language, and stop before represented download. The forwarded-authorized fixture succeeds without exposing the original forward source.
- Verified all seven accepted media fixtures: JPEG, PNG, WebP, HEIC, HEIF, decoded-PNG filename mismatch, and the inclusive HEIF equality boundary at exactly 20,000,000 bytes and 100,000,000 pixels.
- Verified all ten rejection fixtures and exact primary messages: Animated WebP, SVG, TIFF, PDF, RAW, disguised TIFF, malformed/decode failure, 20,000,001 bytes, 108 megapixels, and 20,001-pixel side. Multi-failure precedence remained authorization → decode → animated/unsupported → bytes → pixels → side.
- Verified all listed caption fixtures plus case, punctuation, multiline, token-only, leading-space, internal-whitespace, and carriage-return/tab probes. Anchored matches, intentional non-matches, invalid/impossible/year-zero/future review cases, receipt-date behavior, and raw-caption preservation were exact.

### Operations, interruptions, and idempotency representation

- Verified normal success, generic failure plus explicit Retry, T7 failure plus explicit Retry, rapid repeat, same-update replay, navigation/reset/fixture-change/session cancellation, and stale-callback suppression. Each branch produced at most one represented item and one terminal acknowledgement.
- Verified ordinary T3 interruption during Received, Authorizing, Validating, and Waiting. Only stages strictly before the interrupted in-progress stage render Complete; the current and future stages render Unavailable. Retry is disabled while disconnected, reconnection never resumes work, and explicit Retry completes once.
- Verified durable T3 continuation interruption at all four stages while two members remained committed. The same represented identity and two rows persisted; stage truth stayed origin-aware; explicit Retry added only the missing member and produced one final acknowledgement.
- Verified active and idle partial-progress collisions, member-commit/final-ack timing, the 1 → 2 → 3 monotonic identity path, reconnect-without-auto-resume, and the requirement that recovery expose `Try again` rather than an ordinary Run path.
- Verified connection and session priority, disabled/busy controls, private-content removal at the session gate, represented reauthentication return, and no background continuation after a terminal handoff.

### Handoffs, history, focus, and privacy

- Verified View day, read-only Change Journal Date, and exact frozen-v11 Review date handoffs. Browser Back/Forward restored the exact logical invoker, focus, scroll, destination counts, cover truth, and resolved-review state without resurrecting removed items.
- Verified same-route deep-state activation, BODY-to-H1 fallback, immediate trusted Tab at several frame timings, stale callback invalidation, keyboard entry, skip-link behavior, and exact Back/Forward focus. Delayed navigation focus never stole a user's later focus.
- Verified Search Clear retained the frozen-v6 contract: result and no-match Clear return focus to an empty input, history/view memory cannot resurrect the query, result history restores exact focus/scroll, and incoming or popstate legacy `q` is stripped.
- Verified the title remains `Life in Days`; URLs contain structural routes only; history payloads contain only opaque `{entryId}` values; and capture/search/review state stays out of local/session storage, cookies, IndexedDB, Cache Storage, service workers, clipboard, referrer, requests, console, telemetry, logs, and product DOM identifiers.
- Verified all page requests were local, with no Telegram/provider/AI call, external asset, iframe, extension injection, Speechify content, favicon request, failed request, HTTP error, console error, exception, or log error.

### Responsive, semantic, and accessibility observations

- Verified light and dark themes at 1440, 1280, exact 960/901, 700, 390, and 320 px; 568 × 320 landscape; 640 × 900 200%-equivalent reflow; and 320 × 900 400%-equivalent reflow. No horizontal page overflow, clipped essential copy, covered action, or bottom-navigation collision remained.
- Measured reachable light unavailable/rejected/failure status pills and numbered counters at at least 4.852:1; dark equivalents measured at least 5.565:1. Forced-colour observations used system colours and preserved state/focus distinction.
- Verified one main and one H1, semantic message/list/article/description structures, one concise atomic polite v12 live region, scoped busy state, alerts, visible non-colour focus, keyboard operation, reduced motion, no target below the 24 px floor, and compact primary actions at least 44 px.
- These checks are bounded prototype observations, not formal WCAG or assistive-technology conformance evidence.

### Frozen behavior and scope regression

- Byte-compared frozen v6–v11 artifacts and reverified their exact recorded fingerprints.
- Regressed complete frozen v6 Search; v7 Calendar and Museum Margin; v8 Almanac; v9 readiness, Settings, backup, and recovery boundaries; v10 shell, failures, Correction, connection, and session behavior; and v11 queue, picker, assignment, race, guided-destination, history, and focus behavior.
- Verified the inherited Uploaded Journal exact-text duplicate branch remains intact. The scoped v12 Telegram-photo companion contains no checksum match, Already imported, Add duplicate anyway, cross-day duplicate decision, shared Media Asset decision, or other v13 Telegram-photo duplicate handling.
- `npm run check:v6` through `npm run check:v12`, JavaScript syntax, local-link checks, `git diff --check`, evidence roster/format checks, final local/served hashes, and clean reload checks passed.

## Findings repaired before the final Pass

The candidate remained v12 while every finding was repaired, and the complete evidence and independent gates restarted after each UI fingerprint change. Repairs included:

1. Making retry-success connection interruptions and repeated operation branches reject stale completions.
2. Correcting exact caption fixtures, token-only parsing, raw whitespace preservation, and review routing.
3. Requiring explicit Retry after both zero-durable and durable T3 interruption, with no reconnect auto-resume and only missing members scheduled.
4. Restoring same-route pointer H1 focus while using a guarded focus epoch so an immediate trusted Tab is never stolen.
5. Clearing the frozen-v6 Search input before snapshot synchronization and refreshing view memory so Clear cannot resurrect a stale draft.
6. Using the exact `data:,` favicon to avoid a stray request and 404.
7. Raising light rose status-pill and numbered-stage-counter contrast while preserving dark and forced-colour behavior.
8. Reconciling and implementing conversation → outcome → guide DOM and visual order at every viewport.
9. Converting idle T3 partial recovery from generic Run to explicit `Try again`, preserving identity, and targeting only the missing member.
10. Rendering truthful early interruption stage states rather than marking stages that never ran Complete.
11. Preserving the interruption origin on durable Partial terminals so continuation interruptions also render truthful stage states.
12. Scoping duplicate exclusions to Telegram-photo handling while retaining the inherited Uploaded Journal exact-text duplicate behavior.
13. Repairing Back/Forward snapshots, same-route scroll, private handoff focus, stale delayed callbacks, and resolved-review no-resurrection behavior.
14. Reconciling Council wording where default-state naming and guide placement had created contradictory order requirements.

No finding remains open in this v12 package.

## Current-run visual evidence

- [`01-1440x900-default-guide-light.png`](docs/prototypes/v12/01-1440x900-default-guide-light.png)
- [`02-1440x900-t1-waiting-dark.png`](docs/prototypes/v12/02-1440x900-t1-waiting-dark.png)
- [`03-1440x900-t1-success-outcome-light.png`](docs/prototypes/v12/03-1440x900-t1-success-outcome-light.png)
- [`04-1440x900-t2-document-backdate-dark.png`](docs/prototypes/v12/04-1440x900-t2-document-backdate-dark.png)
- [`05-1280x720-t3-three-received-photos-light.png`](docs/prototypes/v12/05-1280x720-t3-three-received-photos-light.png)
- [`06-1280x720-t4-forwarded-authorized-dark.png`](docs/prototypes/v12/06-1280x720-t4-forwarded-authorized-dark.png)
- [`07-1280x720-generic-authorization-rejection-light.png`](docs/prototypes/v12/07-1280x720-generic-authorization-rejection-light.png)
- [`08-960x900-media-accepted-boundaries-dark.png`](docs/prototypes/v12/08-960x900-media-accepted-boundaries-dark.png)
- [`09-960x900-unsupported-or-decode-rejection-light.png`](docs/prototypes/v12/09-960x900-unsupported-or-decode-rejection-light.png)
- [`10-960x900-limit-rejection-dark.png`](docs/prototypes/v12/10-960x900-limit-rejection-dark.png)
- [`11-700x900-t5-invalid-review-light.png`](docs/prototypes/v12/11-700x900-t5-invalid-review-light.png)
- [`12-700x900-t6-future-review-dark.png`](docs/prototypes/v12/12-700x900-t6-future-review-dark.png)
- [`13-700x900-t7-capture-failure-light.png`](docs/prototypes/v12/13-700x900-t7-capture-failure-light.png)
- [`14-700x900-t7-retry-success-dark.png`](docs/prototypes/v12/14-700x900-t7-retry-success-dark.png)
- [`15-390x844-settings-entry-and-return-light.png`](docs/prototypes/v12/15-390x844-settings-entry-and-return-light.png)
- [`16-390x844-change-date-read-only-handoff-dark.png`](docs/prototypes/v12/16-390x844-change-date-read-only-handoff-dark.png)
- [`17-390x844-review-date-v11-handoff-light.png`](docs/prototypes/v12/17-390x844-review-date-v11-handoff-light.png)
- [`18-320x568-default-guide-light.png`](docs/prototypes/v12/18-320x568-default-guide-light.png)
- [`19-320x568-long-rejection-dark.png`](docs/prototypes/v12/19-320x568-long-rejection-dark.png)
- [`20-568x320-media-group-landscape-light.png`](docs/prototypes/v12/20-568x320-media-group-landscape-light.png)
- [`21-640x900-200-percent-reflow-light.png`](docs/prototypes/v12/21-640x900-200-percent-reflow-light.png)
- [`22-320x900-400-percent-reflow-dark.png`](docs/prototypes/v12/22-320x900-400-percent-reflow-dark.png)

| File | Dimensions | SHA-256 |
| --- | ---: | --- |
| `01-1440x900-default-guide-light.png` | 1440 × 900 | `b8ed612802a153492f631765aa7a27d4531ba2670a2e3ca53041f472b1001d48` |
| `02-1440x900-t1-waiting-dark.png` | 1440 × 900 | `0ed64fc7d51cbb3fb464744e9b7ded9803a95f6a361a6464d54ae98ca4fed50f` |
| `03-1440x900-t1-success-outcome-light.png` | 1440 × 900 | `8bc9866ed0ff6752e3ad7a7b1b5fcae557c3dabca7eaf0f099fb21492bf63cde` |
| `04-1440x900-t2-document-backdate-dark.png` | 1440 × 900 | `f325e9d1339a7fb5c79b2fc48ac946ec0da07134ed891135327048bbe9d9fd16` |
| `05-1280x720-t3-three-received-photos-light.png` | 1280 × 720 | `780891ae0e63d6862fec1a692a750de85e1e2fd012356da9d3090a0a9df3a75f` |
| `06-1280x720-t4-forwarded-authorized-dark.png` | 1280 × 720 | `d3e12bc2f0f5137bd1cf929a4aabd2c560f9cc666f4d92af4a2d9448448e6772` |
| `07-1280x720-generic-authorization-rejection-light.png` | 1280 × 720 | `ea09eebde7432dbb51f29950942edb024dc968722f3ac31e9b57033f8c065055` |
| `08-960x900-media-accepted-boundaries-dark.png` | 960 × 900 | `beaff84502e4f4cbd05dbb46883d7d75aff1daaac8723f1130692f154d274064` |
| `09-960x900-unsupported-or-decode-rejection-light.png` | 960 × 900 | `897ecb5122a6f637d02447fbea97288941c2d9e378c88c234d24461f53f5563e` |
| `10-960x900-limit-rejection-dark.png` | 960 × 900 | `cdf243e76b76dfe67b7faf071def560a32bda2ea345b442ec0bd79c2c4e25541` |
| `11-700x900-t5-invalid-review-light.png` | 700 × 900 | `5529e25c6301086449961f1a4610a1acf4f5efa80abb6082752886d8f3836295` |
| `12-700x900-t6-future-review-dark.png` | 700 × 900 | `29b146a8a9cf2a69b7a4758e5e63faf4de018c92981c2ef8c65de0644d513265` |
| `13-700x900-t7-capture-failure-light.png` | 700 × 900 | `13f530d752703c306f3a8b4fe4bbc3873695a2eb01f09dba67a428310f129f61` |
| `14-700x900-t7-retry-success-dark.png` | 700 × 900 | `6b9b3f0336da61960846b6829bd90da8576f12f9f3aca8f4f52ebedee8214576` |
| `15-390x844-settings-entry-and-return-light.png` | 390 × 844 | `a1ee1471ec2998529a278a5aad13a079e83baa2b3103b284b6450dd9dda99242` |
| `16-390x844-change-date-read-only-handoff-dark.png` | 390 × 844 | `e9eccb64f7712a4d3d9b542d6abb0238dd8ea0b286181fce2e41aca2136323de` |
| `17-390x844-review-date-v11-handoff-light.png` | 390 × 844 | `acae2999a8ef3abccea12c907df8d02393d884d105163a92e4ce867cd6f2e06c` |
| `18-320x568-default-guide-light.png` | 320 × 568 | `305a713516e75c6484f91efc1627f64935bcf1c61fd393b77a2992c0e12bf37b` |
| `19-320x568-long-rejection-dark.png` | 320 × 568 | `f057876087e846999c1ae1e7c334fb07c1e0e853b5e46b572fe67ccb16074b05` |
| `20-568x320-media-group-landscape-light.png` | 568 × 320 | `c07b7bf97a1d70cfea291d2cb287a19919a00f948f02692ee60d254db6657839` |
| `21-640x900-200-percent-reflow-light.png` | 640 × 900 | `c0cfa57ebe432c5f1f8d3d4ef29f3805ef37ce3e526cb11f0bd4c17954ee9357` |
| `22-320x900-400-percent-reflow-dark.png` | 320 × 900 | `6bb283cf4bb29a9fcc21727d080d2ab190b398fb3e12f7785b6efccece14d3f7` |

All 22 files were captured fresh on the held fingerprint and inspected individually at original resolution. They have the exact Council roster and dimensions, are 8-bit RGB non-interlaced PNGs, have 22 unique SHA-256 values, and the repository copies matched the independently accepted capture set byte-for-byte. Screenshots supplement, but do not replace, the live interaction, privacy, focus, race, and frozen-regression checks above.

## Evidence boundary

This QA verifies deterministic fictional frontend interaction intent, browser-memory transitions, visual layout, semantics, and the exact static files above. The isolated in-app browser was unavailable for the final independent run, so the already-authorized bundled extension-free Chrome direct-CDP fallback was used. That browser limitation does not change the exact-file result, but this remains synthetic prototype evidence only.

It does not prove a Telegram bot or webhook, authorization or allowlist enforcement, provider receipt or time, media retrieval or decoding, hostile-image containment, exact received bytes, metadata-free derivatives, checksums, encryption, durable database/object commit, authentication, persistence, backend idempotency, networking, deployment, operations, formal accessibility conformance, or production readiness.

The sole permitted closure is: **Telegram Capture Companion is prototype-represented with deterministic synthetic bot and web fixtures; Telegram connectivity, webhook authorization, media retrieval and validation, exact-byte preservation, metadata removal, encryption, durable backend capture, authenticated handoff, persistence, integration behavior, and idempotency enforcement remain unverified.**
