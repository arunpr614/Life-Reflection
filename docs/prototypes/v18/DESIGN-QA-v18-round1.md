# Independent QA — prototype v18 — Round 1

> **FAIL · Critical 0 · High 0 · Medium 3 · Low 0 · exact held candidate unchanged during run**

## Candidate identity

- QA start: `2026-08-20T10:44:35+05:30`
- QA end: `2026-08-20T10:54:53+05:30`
- Manifest: [CANDIDATE-MANIFEST-v18.md](CANDIDATE-MANIFEST-v18.md)
- Manifest SHA-256: `c1b938e59b8db0904bd6899eb852af263a58f718d06c55b7b3e7770fd552c127`
- Listed files: 47/47 exact at start and end
- Held aggregate: `8b08849523b49cbe06a9b915b6aa577ee171799acd3ea52517e1ed6bc1c6d962`
- Worktree HEAD: `8d94a61be8a7e7d6114b3a3b5b3963f23421e445`
- Frozen merge-base: `01d1f054a12773e07f91096b8d76b0c5f4064329`
- QA agent: `/root/design_final_v18`, read-only and not an implementation/repair owner

No candidate or manifest byte changed during the run. Nothing was staged, committed, pushed, or changed on GitHub.

## Verdict

**FAIL — Critical 0 / High 0 / Medium 3 / Low 0.**

All three Medium findings are deterministic and must be fixed and retested. None is accepted or deferred. This manifest and evidence set are obsolete for freeze; a replacement requires complete recapture, a new manifest, and a fresh independent run from zero.

## Findings

### M1 — required-visible-proof framing gap across eleven PNGs

Original-size inspection found that frames 02, 03, 05–09, and 12–15 omit portions of the authority-defined visible proof. Missing pixels include combinations of event-time Journal Date, lineage values, lifecycle retention/live facts, separated Source/Derived lanes, interrupted-state copy, contextual retry, both pagination completion/focus states, and canonical empty-state copy.

Sidecar assertions are not a substitute for the fixture authority's **required visible proof** column. The replacement capture must frame the required evidence in each original-size PNG without changing fixture/scenario identity or fabricating state.

### M2 — frame 10 lacks a visible keyboard focus indicator

The frame-10 sidecar records final focus on the reopened **Filter history · 2 active** summary, but the original-size PNG has no discernible focus treatment. The repaired scenario must end with the same native disclosure open and focused through a real keyboard-visible path, with a clearly visible focus ring in the PNG.

### M3 — frame 16 has unsafe inherited overlap

At the required 320×900 forced-colour state, the inherited **Settings opened.** toast covers the canonical heading/upper content. The fixed bottom navigation covers the lower panel boundary and clips the focused Artwork action's outer focus treatment.

This violates the V18 UX §19.4 visible-focus/non-overlap rule, Council's 320×900 no-covered-action gate, and the global no-covered-focus/unsafe-sticky-overlap contract. The repair must rely on truthful app/browser settling and pre-baseline framing only; it may not activate hidden controls or use post-return helper focus/scroll compensation.

## Checks completed before fail-fast

- All 16 PNGs inspected at original size; all stored hashes and dimensions matched their sidecars.
- All 16 JSONs parsed.
- 400/400 application invariant assertions passed.
- 96/96 privacy assertions passed.
- Zero recorded console errors, browser exceptions, storage/registration/OPFS residue, horizontal overflow, or non-local/data requests.
- `node --check` passed for V18 app, checker, and capture helper.
- `check-v18.mjs`, `check-v17.mjs`, and `git diff --check` passed.
- Product-design audit guidance drove the hierarchy, focus, responsive, and overlap inspection.

## Not completed or claimed

QA stopped after deterministic visual blockers. It did not complete the exhaustive native live matrix for all fourteen fixtures, pagination failure/interruption/stale-generation branches, all six Back/Escape origins, compact More Tab/Shift+Tab plus restored V16 trap, all responsive/media combinations, or direct live V17 replay. None of those is claimed by this report.

## Proof boundary

This failure is about the exact frontend evidence and visual/focus contract. It makes no backend, persistence, provider, VoiceNotes, security, deployment, formal accessibility-conformance, or production claim.
