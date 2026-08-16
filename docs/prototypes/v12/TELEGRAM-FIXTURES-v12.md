# Life in Days prototype v12 — Telegram message and state fixture sheet

Date: 2026-08-15
Package: `PVA-007 Telegram Capture Companion`
Authority: [`COUNCIL-v12.md`](COUNCIL-v12.md)
Status: deterministic frontend fixture inventory for the independently passed held implementation; exact QA and freeze disposition are recorded separately

## Evidence boundary

Every entry below is fictional, local, and deterministic. It represents browser-memory behavior only. No fixture contacts Telegram, downloads provider media, calls AI, writes durable storage, authenticates a private link, or proves backend idempotency.

Fixed prototype boundary: **13 August 2026 · Asia/Kolkata**. Device time, locale, and timezone do not decide an outcome. Selecting a scenario restores its declared v11-derived archive baseline and unique synthetic identity; scenarios never accumulate one another's changes.

The sole permitted closure statement remains:

> **Telegram Capture Companion is prototype-represented with deterministic synthetic bot and web fixtures; Telegram connectivity, webhook authorization, media retrieval and validation, exact-byte preservation, metadata removal, encryption, durable backend capture, authenticated handoff, persistence, integration behavior, and idempotency enforcement remain unverified.**

## Settings entry and default guide fixture

- Entry is Settings → Integrations → Telegram → **Open capture companion**.
- The inherited Telegram truth remains either **Configured on server · Never verified** or **Needs server configuration**. Opening or running the companion never changes configuration.
- First-use Telegram continues to open the inherited Settings boundary before the companion.
- The companion is not a primary archive tab and adds no compact-navigation item.
- Eyebrow: **Private photo capture**
- H1: **Telegram Capture Companion**
- Intro: **See what Life in Days accepts and how each Telegram outcome reaches your private archive.**
- Boundary: **Prototype data · no Telegram connection · no messages sent · no persistence**
- Prototype date: **Prototype date · 13 August 2026 · Asia/Kolkata**
- Initial state: **No Telegram activity is being read. Choose a synthetic message to inspect its path.**

The numbered **Telegram photo guide** remains available from every fixture:

In DOM and visual order, the guide follows the conversation and outcome at every viewport. **Default guide** names the initial no-activity fixture state; it does not place the numbered guide before the conversation.

1. **Send photos only in your configured private Telegram chat. Groups and other senders are rejected.**
2. **Ordinary photo messages may be compressed by Telegram. Send an image as a document to preserve the exact image bytes Telegram supplies.**
3. **Accepted still images: JPEG, PNG, WebP, HEIC, and HEIF. Each file may be up to 20 MB, 100 megapixels, and 20,000 pixels on either side.**
4. **Life in Days sets no product-level item-count limit. Each accepted image becomes a separate Daily Photo.**
5. **Start a caption with YYYY-MM-DD to choose a Journal Date. Historical dates are allowed; future dates are not. Without a leading date, Telegram receipt time in Asia/Kolkata supplies the Journal Date.**
6. **Text after the leading date becomes the Photo Caption. Real photos, their metadata and identifiers, and Photo Captions are never sent to AI.**

There is no setup form, Send control, token, webhook path, sender/chat value, credential, QR code, or connection claim. Opening focuses the companion H1; Back restores the exact Settings invoker and scroll. Reload clears v12 live memory and returns to the inherited ready/first-use Calendar default.

## Canonical capture messages

| Key | Synthetic input | Date and caption interpretation | Represented terminal outcome |
| --- | --- | --- | --- |
| **T1** | Telegram photo message; rain-window asset; JPEG; 1,842,112 bytes; 3024 × 4032; message 13 Aug 2026 7:58 am IST; received 8:00 am; raw caption `Morning rain on the balcony` | Receipt supplies 13 August 2026; Photo Caption remains `Morning rain on the balcony` | Before 2 photos / 2 journals / existing real cover. Chronologically insert the 7:58 am photo before the inherited 4:38 pm and 7:21 pm photos; keep the inherited rain photo as cover. After 3 photos / 2 journals. Bot: **Photo saved to 13 August 2026.** Actions: View day and Change Journal Date. |
| **T2** | Telegram image document; flower-market asset; HEIC; 6,482,944 bytes; 3024 × 4032; message 13 Aug 2026 9:02 am IST; received 9:03 am; raw caption `2026-08-10 Monsoon light through the window` | Leading instruction supplies 10 August 2026; Photo Caption is `Monsoon light through the window` | Before no day / 0 photos / 0 journals. After visible day / 1 photo / 0 journals; new real photo is Calendar Cover. Bot: **Photo saved to 10 August 2026.** Actions: View day and Change Journal Date. |
| **T3** | Three distinct Telegram JPEG photo messages in received order: flower-market, balcony-cups, rain-window. Message times 9:20:00 / :01 / :02 am; receipt times 9:21:00 / :01 / :02 am. First raw caption is `2026-08-09\nSunday market flowers`. | The first member's leading instruction supplies 9 August 2026 to all three received members. Only member 1 receives Photo Caption `Sunday market flowers`; members 2 and 3 show **No Photo Caption**. | Before no day / 0 photos / 0 journals. Members authorize, validate, and commit independently in received order. After all three: visible day / 3 photos / 0 journals; first member is cover. Roll-up: **3 received photos**. Bot: **3 received photos saved to 9 August 2026.** Actions: View day and Change Journal Date. Never claim an album-complete event. |
| **T4** | Forwarded photo using T1's media/date facts but a distinct opaque synthetic identity | Current configured sender and private chat govern authorization; original forward source is neither displayed nor used | Status: **Forwarded photo · current private chat authorization represented**. Same date/archive semantics and terminal sentence as T1. |
| **T5** | Exact frozen-v11 invalid Telegram item; raw caption `2026-13-08 Monsoon light through the window`; message 12 Aug 2026 7:40 pm IST; received and Added to review 7:41 pm | Exact-shaped impossible date enters Needs Date Review; Photo Caption is `Monsoon light through the window` | After represented media plus one holding item: **The photo is safe, but 2026-13-08 is not a valid Journal Date. Choose a date to add it to the calendar.** Then **It is in Needs Date Review and is not on the Calendar or Almanac.** Review date opens the exact frozen-v11 item with a blank field. |
| **T6** | Exact frozen-v11 future Telegram item; raw caption `2026-08-20 A quiet street after rain`; message 12 Aug 2026 8:16 pm IST; received and Added to review 8:17 pm | Exact-shaped future date enters Needs Date Review; Photo Caption is `A quiet street after rain` | After represented media plus one holding item: **The photo is safe, but future Journal Dates are not supported in this version. Choose 13 August 2026 or earlier.** Then the same not-on-Calendar/Almanac line. Review date opens the exact frozen-v11 item with a blank field. |
| **T7** | Unique neutral HEIF document; 4,104,192 bytes; 3024 × 4032; received 13 Aug 2026 10:12 am IST; raw caption `2026-08-10 Station light before dawn`; source message time is not specified in this fixture | Leading instruction supplies 10 August 2026; caption remainder stays intact | First attempt passes authorization and validation, then fails before any represented media, thumbnail, or metadata commit: **Photo was not saved because Life in Days could not finish storing it. Nothing was added. The Telegram message remains in this chat.** State: **No Source Item · no Journal Day change · safe to retry**. Explicit Try again reuses the identity and ends once with **Photo saved to 10 August 2026.** There is no automatic retry or duplicate item, and no invented count, cover, or extra action copy. |

All valid paths expose **Authorized private chat represented** only after the represented authorization check. Scoped pending copy is **Waiting for durable capture…**. No intermediate state produces a bot acknowledgement.

## Authorization fixtures

The product surface for every rejected branch is identical. Only the separated Prototype states console may name the synthetic branch.

| Console fixture | Represented check | Product result |
| --- | --- | --- |
| Group chat | `group=true` | Generic rejection below; no media facts or Retry |
| Other sender | Current numeric sender does not match | Generic rejection below; no media facts or Retry |
| Other private chat | Current private chat does not match | Generic rejection below; no media facts or Retry |
| Missing or invalid secret | Webhook secret check is not represented as valid | Generic rejection below; no media facts or Retry |
| Forwarded authorized | Current sender/private chat match and `group=false` | **Authorized private chat represented**; original forward source remains undisclosed |

Exact generic product result:

- Heading: **Request not accepted**
- Copy: **This request was not accepted. No photo was downloaded or added.**
- Provenance: **Rejected before media download · no Source Item**
- Reply state: **No Telegram reply is represented.**

Authorization precedes represented decode/download. A rejected request cannot reach validation, capture, Needs Date Review, Calendar, Almanac, or a Retry that bypasses authorization.

## Caption grammar fixtures

The only date-instruction grammar is:

```text
^(\d{4}-\d{2}-\d{2})(?:$|[ \t\r\n]+([\s\S]*))$
```

The parser removes only a validly shaped token and its separator whitespace. It preserves the remainder's punctuation, case, line breaks, and internal whitespace. Raw Telegram input remains provenance.

| Case | Raw caption | Journal Date source | Photo Caption result |
| --- | --- | --- | --- |
| Exact historical | `2026-08-10 Market morning` | Instruction: 10 August 2026 | `Market morning` |
| Exact today | `2026-08-13 Market morning` | Instruction: 13 August 2026 | `Market morning` |
| Token only | `2026-08-10` | Instruction: 10 August 2026 | **No Photo Caption** |
| Multiline | `2026-08-09\nSunday market flowers` | Instruction: 9 August 2026 | `Sunday market flowers` |
| No instruction | `Morning rain on the balcony` | Telegram receipt time | Entire raw caption |
| Leading whitespace | ` 2026-08-10 Market morning` | Telegram receipt time | Entire raw caption |
| Slash date | `2026/08/10 Market morning` | Telegram receipt time | Entire raw caption |
| One-digit month/day | `2026-8-10 Market morning` | Telegram receipt time | Entire raw caption |
| Joined text | `2026-08-10Market morning` | Telegram receipt time | Entire raw caption |
| Invalid month | `2026-13-08 …` | Needs Date Review | Remainder after the token/separator |
| Impossible day | `2026-02-30 …` | Needs Date Review | Remainder after the token/separator |
| Year zero | `0000-01-01 …` | Needs Date Review | Remainder after the token/separator |
| Future | `2026-08-20 …` | Needs Date Review | Remainder after the token/separator |

## Media validation fixtures

Inclusive prototype limits are 20,000,000 bytes, 100,000,000 pixels, and 20,000 pixels on either side. They are deterministic UI arithmetic, not proof of provider/backend decoding or hostile-image safety.

### Accepted

| Fixture | Decoded facts | Exact result pattern |
| --- | --- | --- |
| JPEG still | JPEG within every limit | **Accepted for represented capture. This file decodes as JPEG and is within every per-file limit.** |
| PNG still | PNG within every limit | Same sentence with `PNG` |
| WebP still | WebP within every limit | Same sentence with `WebP` |
| HEIC still | HEIC within every limit | Same sentence with `HEIC` |
| HEIF still | HEIF within every limit | Same sentence with `HEIF` |
| Extension mismatch | Filename differs; content decodes as PNG | **Accepted for represented capture. This file decodes as PNG and is within every per-file limit.** |
| Equality boundary | HEIF; exactly 20,000,000 bytes; 20,000 × 5,000 = 100,000,000 pixels | **Accepted for represented capture. This file decodes as HEIF and is within every per-file limit.** |

### Rejected

Every rejection adds: **No Source Item was created. The Telegram message remains in this chat.** It creates no holding item or Calendar/Almanac change and never says safe, saved, or imported.

| Fixture | Exact primary rejection |
| --- | --- |
| Animated WebP | **Photo not added. Animated images are not supported. Send a still JPEG, PNG, WebP, HEIC, or HEIF image.** |
| SVG | **Photo not added. SVG is not supported. Send a still JPEG, PNG, WebP, HEIC, or HEIF image.** |
| TIFF | **Photo not added. TIFF is not supported. Send a still JPEG, PNG, WebP, HEIC, or HEIF image.** |
| PDF | **Photo not added. PDF is not supported. Send a still JPEG, PNG, WebP, HEIC, or HEIF image.** |
| RAW | **Photo not added. RAW is not supported. Send a still JPEG, PNG, WebP, HEIC, or HEIF image.** |
| Filename says JPEG; content decodes TIFF | **Photo not added. This file decodes as TIFF, which is not supported. The filename was not used to accept it.** |
| Malformed/decode failure | **Photo not added. Life in Days could not decode this file as a supported still image.** |
| 20,000,001 bytes | **Photo not added. This file is 20,000,001 bytes. The limit is 20,000,000 bytes (20 MB).** |
| 12,000 × 9,000 | **Photo not added. This image is 108 megapixels. The limit is 100 megapixels.** |
| 20,001 × 800 | **Photo not added. This image is 20,001 × 800 pixels. Neither side may exceed 20,000 pixels.** |

When more than one gate fails, the single primary result follows: authorization; decode; animated/unsupported; bytes; pixels; side.

## Operation and interruption fixtures

| Branch | Required represented behavior |
| --- | --- |
| Success | Received → Authorizing → Validating → Waiting for durable capture → one captured-valid or captured-in-review terminal. Archive/holding mutation and one acknowledgement appear together. |
| Failure | Passes authorization/validation, then changes nothing and exposes one failure plus explicit Retry only where defined. |
| Rapid repeat | A guarded active control cannot create a second item, holding record, terminal, or acknowledgement. |
| Same-update replay | Existing represented result remains unchanged; replay proof is fixture-console-only and does not create another product acknowledgement. This is idempotency representation, not duplicate detection. |
| Navigate before completion | Pending callbacks become stale no-ops; return shows only already-durable truth. No background resume. |
| Reset or fixture change | Cancels pending work, restores the selected canonical baseline, and leaves no result from the abandoned generation. |
| Connection interruption | Content stays readable/freshness-unknown; Run/Retry is disabled; no queued or automatic resume. Any already-durable T3 members remain truthfully represented. |
| Session interruption | Session gate owns the page, removes simulated private content, invalidates operations, and restores no private operation on reauthentication. |
| T3 partial progress | Member rows remain ordered and independent. Roll-up names only represented received photos; no three-photo acknowledgement until all three commits exist. A continuation never regresses a completed member or count. |
| Explicit Retry | Uses the same identity, starts pending again, and yields at most one represented item and one terminal acknowledgement. Reconnection alone never triggers it. |

## Private handoff fixtures

| Action | Handoff | Return rule |
| --- | --- | --- |
| View day | Inherited canonical Journal Day with the represented count/cover result; captured date remains out of URL/history payload | Handoff focuses its visible H1. Back restores exact View day action and simulator scroll. |
| Review date | Exact frozen-v11 T5 or T6 unresolved item, blank date field, safe structural route, opaque live-memory item entry | A successful assignment removes the held item once. Back cannot resurrect it; the companion shows resolved truth and focuses a logical outcome when the original action is gone. |
| Change Journal Date | Read-only H1 **Change Journal Date** with source, current date, immutable timestamp, private cue, and **Date change action is not part of this prototype.** | No editor, picker, mutation, preview, or save. Back restores exact action and scroll. |

Every bot action is visibly paired with **Private link · authentication required**. V34 retains actual access enforcement.

## Privacy and exclusion assertions

- Browser title remains **Life in Days**.
- URL contains structural route state only. Capture-derived date, fixture, caption, auth branch, outcome, retry, and focus remain outside it.
- Browser history payload is only an opaque live-memory entry ID.
- Capture state does not enter local/session storage, cookies, IndexedDB, Cache Storage, service workers, clipboard, referrer, requests, console, telemetry, analytics, or logs.
- Synthetic captions may be visible static content but are never transient toast/live-announcement/title content.
- Product DOM identifiers contain no sender, chat, message, update, group, file, checksum, caption, or private source identity.
- No external asset, Telegram/provider call, AI call, or network request is part of the fixture set.
- The v12 Telegram capture fixtures have no Telegram-photo checksum match, **Already imported**, **Add duplicate anyway**, cross-day duplicate warning, shared Media Asset decision, or photo-duplicate cancel/permit path. V13 owns every Telegram-photo duplicate decision.
- Later versions retain actual redating, caption Search expansion, full photo controls, storage/recovery/export, access/security, and formal accessibility closeout.
