# Independent QA — prototype v18 — Round 3

> **PASS · Product A · Design A · QA A · Critical 0 · High 0 · Medium 0 · Low 0 · exact 49-record candidate unchanged during QA**

## Candidate identity and immutability

- Controlling manifest: [V18-CANDIDATE-MANIFEST.sha256](V18-CANDIDATE-MANIFEST.sha256)
- Manifest SHA-256 and exact 49-record aggregate: `85bfe3c277dfe3bebdae49312f619c5295e980d29d5c3538c009dcdc7b382578`
- Listed files: 49/49 exact at independent-QA start and end
- Manifest continuity: end bytes matched the QA-start snapshot byte for byte
- Staged paths: zero at independent-QA start and end
- Candidate drift: zero
- Evidence aggregate: `11297ee0c6d3ff251e611d0cea1d65da56fe632d807cf12a7c18b4008a0c710f`
- Independent QA agent: `/root/qa_v18_round3`, fresh and read-only
- Post-verdict candidate commit: `a6f463214801275d628c19b94472d4066c8df657`
- Commit readback: all 49/49 held records match their exact committed Git blobs; the committed checksum manifest remains `85bfe3c277dfe3bebdae49312f619c5295e980d29d5c3538c009dcdc7b382578`

The QA agent changed no file, staged path, commit, remote, or GitHub state. The candidate commit was created by the parent after the PASS verdict and binds the exact tested 49-record roster. This report is a documentation-only post-QA successor and is intentionally outside that self-reference-free candidate aggregate.

## Verdict and severity accounting

The formal independent Round 3 verdict is **PASS — Critical 0 / High 0 / Medium 0 / Low 0**.

- Product dimension: **A**
- Design dimension: **A**
- Independent QA gate: **A**
- Lower-severity disposition: no finding exists to accept or defer
- Recommendation: freeze this exact candidate; any candidate-byte change requires a new hold and independent run

## Identity, evidence, and static checks

- All 49 manifest records passed checksum validation at QA start and end.
- All 16 PNG hashes and native dimensions matched their sidecars.
- Original-size visual inspection passed **16/16** with no required-content cropping, overlap, horizontal overflow, or visible accessibility risk, including repaired frames 10, 11, and 16.
- All 16 sidecars passed **400/400 invariant assertions** and **96/96 privacy assertions** with exact capture chronology.
- Recorded console events, browser exceptions, external requests, local/session storage, IndexedDB, Cache Storage, service workers, OPFS residue, and horizontal overflow were all zero.
- Fresh JavaScript syntax checks, the v18 checker, the frozen v17 checker, and `git diff --check` passed.

## Fresh live coverage

### Fixtures, corpus, states, and lineage

All 14 v18 fixtures passed with **350/350 live invariant assertions**. QA verified the exact E01–E17 corpus, Source/Derived membership and order, represented counts, event sequence, record lineage, revised/conflict/untagged/deleted lifecycle facts, Current source context mapping, hidden-day history, loading, failure, interruption, retry, and read-only behavior.

### Filtering and pagination

- Source plus Needs attention produced exact visible events `E14,E13,E12`; Clear restored truthful Source 10 / Derived 7 without changing pagination state.
- The terminal-generation rejection matrix passed **128/128** invalid cases as exact state, DOM, focus, and scroll no-ops.
- All **21/21** valid terminal and duplicate paths passed with the required matching generation.
- Pointer and click-only pagination anchors restored within `0.1875` CSS pixels; click-only duplicate generation 2 restored at `0` pixels.

### Entry, return, responsive, and inherited-v17 controls

- All six governed origins passed Back and Escape: **12/12** returned to the same connected invoker, restored focus, and had `0`-pixel scroll/top drift.
- The responsive origin matrix passed at 320, 960, 961, 1023, and 1024 pixels, including hidden-origin rejection, More/Settings ownership, and the independent 1023/1024 filter breakpoint.
- Native 2 August Day, **Before sleep**, and represented artwork **View versions** controls remained unpatched v18 negatives.
- Compact More-origin Tab shielding and the restored nine-control v16 modal wrap passed at 320 and 390 pixels.
- Responsive layouts, light and dark themes, forced colours, reduced motion, and zero horizontal overflow passed.

### Privacy and direct v17 regression

- Live privacy remained query/hash-free with null history state, 0/0/0 mutation counters, zero browser storage/registrations/OPFS entries, localhost-only resources, and empty console/exception logs.
- Direct v17 regression passed all 10 fixtures, outcome/retry/status/duplicate/resulting-day paths, archive return/reopen, invariants, and privacy checks.

## Preserved rejection history

[Round 1](DESIGN-QA-v18-round1.md) remains **FAIL — C0/H0/M3/L0** on obsolete manifest `c1b938e59b8db0904bd6899eb852af263a58f718d06c55b7b3e7770fd552c127` and obsolete aggregate `8b08849523b49cbe06a9b915b6aa577ee171799acd3ea52517e1ed6bc1c6d962`.

[Round 2](DESIGN-QA-v18-round2.md) remains formal **FAIL — C0/H0/M1/L0**, with the supplemental repair ledger **C0/H0/M3/L2**, on obsolete manifest `8746079b78e361e3402e1487f1561a87532dd3b0240fe7d8e90ad95a4856a5ab` and obsolete aggregate `eb27347306389ca69168b5e6eb0b229159f57dd63fac50e2c4d3105ecaec03ca`.

Round 3 does not erase, reclassify, accept, defer, or retroactively pass either rejected candidate. It accepts only the repaired 49-record candidate identified above.

## Keyboard and proof limitations

The in-app browser keyboard API emitted Enter, Space, and Tab key events but did not itself perform browser-default activation or focus traversal. QA independently exercised keyboard-specific application branches by pairing recorded key precursors with the click event, verified the More shield and restored modal trap with cancellable key events, and validated the held native-keyboard evidence and static contracts. No assistive-technology-equivalence claim follows from this workaround.

This PASS proves only the governed deterministic synthetic frontend representation, interaction state, rendering, semantics, focus/return behavior, responsive behavior, privacy-shaped UI behavior, exact static bytes, and direct v17 regression tested above. It does not prove backend or durable history, persistence, VoiceNotes authority or reconciliation, transactionality, concurrency, idempotency, recovery, provider behavior, authentication, authorization, encryption, deployment, production privacy/security, browser zoom, mobile-OS behavior, assistive-technology behavior, usability validation, formal accessibility conformance, or production readiness.

## Freeze and closure disposition

The parent accepted the exact committed candidate for local freeze after this PASS. Local gates are `P=A`, `D=A`, `C=A`, `I=A`, `Q=A`, and `F=A`. Exactly `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` close at the bounded frontend-prototype level, moving program arithmetic to **22/57 closed and 35/57 open**. `LID-SRC-004` remains a supporting inherited regression already counted in v17; `LID-VN-005` still requires external evidence.

Push, remote readback, GitHub publication, and the documentation-only publication receipt remain pending. V19 remains Backlog and additionally user-gated; no v19 work has started.
