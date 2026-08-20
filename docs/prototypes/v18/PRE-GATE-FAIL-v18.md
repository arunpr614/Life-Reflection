# Life in Days v18 — final pre-gate failure record

- **Recorded:** 2026-08-20 (`Asia/Kolkata`)
- **Package:** PVA-013 History and Provenance
- **Inspected state:** uncommitted, unheld v18 implementation/self-check bytes
- **Verdict:** **PRE-GATE FAIL**
- **Severity ledger:** no P0; exactly one P1 / High blocker; one P2 defect; no other blocker
- **Gates at verdict:** `P=F`; `D=F`; `C=F` for the superseded entry contract; `I=IP`; `Q=—`; `F=—`
- **Independent QA:** not started; this record is not an independent-QA report

## 1. Exact inspected-byte identity

The read-only Product/Design pre-gate inspected these exact start/end-identical implementation and self-check bytes:

| Path | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/index-v18.html` | `fc0b2466be93334283aac7338a0c502de8840d2494c5f250489f8190c5aa96ec` |
| `prototypes/calendar-ui/app-v18.js` | `949389d7bb6b2d0071a223e3941a6d831d94c14fa53e78143329e0b444bea2d4` |
| `prototypes/calendar-ui/styles-v18.css` | `c6895e33e0c14656318aa0923798b6641749b820199c0f85141ff810acb5e9c5` |
| `prototypes/calendar-ui/README-v18.md` | `a206d1ded18308030b2f2e8f1a7fc6bdbe8abc91d0f296a58b3c4651a79d387c` |
| `prototypes/calendar-ui/check-v18.mjs` | `894a4b55f231076ea06d38c616a6ca64ac788f125fe818a575c8376448c7dc9f` |
| `prototypes/calendar-ui/capture-phase2-evidence-v18.mjs` | `ee0bb92b500540faaa36cc09f4cf2c05f176df9081a9789657e335e631114825` |

The deterministic six-record aggregate is `cca2b73673b95e454482ccbc1b11564be43ad269136a3b4bf005b19153d3ddf9`, computed as SHA-256 over the six newline-terminated `sha256  repository-relative-path` records sorted by repository-relative path.

The now-superseded pre-amendment authority hashes were Product `a5373fad917df8e18c2485b96e4c4786a8ca72cf3c801c44144144189410047d`, Design `7e04a7e8b8a6e9be5148ae165270544cbca79e796fba01c20880a77673ebd1aa`, Project plan `abcd7c55c9d770f33cf36887810f79274ec1600be3e2e4f8c8854861fa3e2f4d`, Council `48ca06a61a02781e8601cc8599731ae2e30d018ebfe9085d481992099aaf9589`, and fixtures `996fedca99ae4e8fd564f92d495f96c7c0767e89b8c3343faf9ef9d1ac4e32c0`; their historical five-record aggregate is `70952a1f1b717a15ef2662380bf348b8fef9d0ee60d3bf489bdc520baf4e4449`.

No `CANDIDATE-MANIFEST-v18.md` exists. This directory contained zero v18 PNG/JSON evidence files at verdict, so no repository candidate-manifest hash and no 32-file evidence aggregate exist to preserve. Producer-local captures cannot supply those missing identities and are invalidated by this failure.

## 2. P1 / High blocker — false contextual provenance

The candidate decorated, relabelled, intercepted, or injected v18 entry controls across arbitrary inherited v16 Journal Days, Source Items, generated fields, and artwork, but every activation opened the same fixed 17 Aug 2026 / Monsoon walk note browser-memory fixture. Real observed examples were:

- the frozen-v16 2 Aug Journal Day's rewritten **History & provenance** opened **History for 17 August 2026**;
- **Before sleep — synthetic fixture** opened **History for Monsoon walk note**;
- 2 Aug Title/Summary controls opened the fixed Summary fixture; and
- 2 Aug generated-artwork controls opened the fixed Artwork version 2 fixture.

`app-v18.js` lines 1300–1339 patched every matching inherited control and injected generated-field controls; lines 1373–1381 opened only the fixed scope fixture and carried no visible entity identity; lines 1507–1512 and 1534 observed inherited roots and reapplied the contamination. The bubble-phase opener could also run after the frozen v16 handler had toasted, closed, or rerendered, weakening exact trigger retention.

This is a provenance and scope misrepresentation. It blocks truthful `LID-REF-004` representation and `LID-SCP-003` navigability. Frozen C18-02's single preloaded E10/17 Aug fixture never authorized unrelated visible v16 records to impersonate that canonical context. Product and Design therefore both failed the pre-gate.

## 3. P2 defect — return position not exact

The old contextual paths returned focus to the same invoker but did not restore exact measured position. Observed scroll values were `1867→1785`, `1121→1073`, and `1087→1064`. Artwork returned within one CSS pixel; Settings and compact More were exact. The old contextual paths are removed by the binding repair, but every replacement canonical entry must prove the same connected invoker, focus, `window.scrollY`, and invoker viewport top within one CSS pixel after both Back and Escape.

## 4. Passing observations retained as non-QA evidence

No other blocker was found. Read-only inspection observed the exact 17-event corpus, fourteen fixtures, two disjoint scenarios, filters, pagination success/failure/interruption/duplicate handling, lifecycle isolation, hidden day, Current source context amendment, read-only counters, privacy boundary, and supporting/external-evidence boundaries behaving as specified outside the failed entry mapping.

The current static commands passed with exact summaries:

- `check-v18: PASS (20 frozen hashes, 6 additive assets, 17 events, 14 fixtures, read-only privacy/static contract)`; and
- `check-v17: PASS (12 frozen hashes, 7 additive assets, 10 fixtures, privacy/static contract)`.

The separate direct-v17 live regression reported 30 passing checks. Producer-local capture reported all sixteen expected PNG/JSON pairs. These observations narrow the repair but do not accept the candidate, replace an exact held manifest, or constitute independent QA.

## 5. Limits and disposition

This pre-gate did not perform independent QA, original-size independent evidence review, candidate hold, freeze, closure, commit, push, remote readback, deployment, or production verification. Any producer-local evidence made from the six-byte fingerprint above is superseded and must be discarded. The repair must change the same unfrozen v18, rerun all self-checks, regenerate all sixteen pairs after final bytes, create a new exact candidate manifest, and only then assign a fresh independent QA agent.

The binding repair is Council amendment [C18-21](COUNCIL-v18.md). It preserves exactly seventeen events, fourteen fixtures, two capture scenarios, sixteen evidence pairs, three open closure rows, and program arithmetic of 19/57 closed and 38/57 open.
