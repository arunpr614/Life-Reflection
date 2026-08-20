# Independent QA — prototype v18 — Round 2

> **FAIL · formal Round 2 C0/H0/M1/L0 · consolidated repair ledger C0/H0/M3/L2 · exact held candidate unchanged during formal run · no finding accepted or deferred**

## Candidate identity and immutability

- Held manifest: [CANDIDATE-MANIFEST-v18.md](CANDIDATE-MANIFEST-v18.md)
- Manifest SHA-256: `8746079b78e361e3402e1487f1561a87532dd3b0240fe7d8e90ad95a4856a5ab`
- Listed files: 48/48 exact at formal QA start and end
- Held aggregate: `eb27347306389ca69168b5e6eb0b229159f57dd63fac50e2c4d3105ecaec03ca`
- Staged paths: zero at formal QA start and end
- Worktree HEAD: `8d94a61be8a7e7d6114b3a3b5b3963f23421e445`
- Frozen merge base: `01d1f054a12773e07f91096b8d76b0c5f4064329`
- Formal independent QA agent: `/root/qa_v18_round2`, read-only and not an implementation, repair, recapture, Product, Design, or manifest owner
- Supplemental adversarial agent: `/root/qa_v18_adversarial`, read-only
- End state recorded by the root agent: `2026-08-20T12:43:57+05:30`

All 48 held records, the manifest, HEAD, and the zero-staged-path state were unchanged across the formal Round 2 run. Nothing was staged, committed, pushed, or changed on GitHub. This report is a documentation-only post-verdict successor and is not part of the tested manifest.

## Verdict and severity accounting

The formal independent Round 2 verdict is **FAIL — Critical 0 / High 0 / Medium 1 / Low 0**.

The supplemental adversarial review found two additional Medium and two additional Low defects on the same held bytes. The consolidated repair ledger is therefore **Critical 0 / High 0 / Medium 3 / Low 2**. The supplemental ledger does not rewrite the formal agent's severity count; it expands the required same-version repair set. No finding is accepted or deferred.

## Formal Round 2 finding

### R2-M1 — frame 16 still clips the governed canonical panel beneath the inherited banner

At the required 320×900 forced-colour frame, the inherited banner's bottom edge was `66` CSS pixels while the canonical panel's top edge was `18.5625` CSS pixels. The resulting overlap was exactly `47.4375` CSS pixels. It clipped the panel's top border and most of the exact eyebrow **PROTOTYPE V18 · FIXED SYNTHETIC CONTEXTS**.

The exact held evidence helper was rerun against the unchanged candidate and reproduced the same geometry. The Round 1 M1 required-visible-proof framing repairs passed, and the Round 1 M2 keyboard focus treatment passed. The Round 1 M3 inherited-overlap finding therefore remains failed: the toast/navigation repair did not eliminate the separate fixed-banner overlap at the panel top.

This violates the authority-required complete canonical content, normal-flow non-overlap, and visible frame-16 proof. Sidecar assertions and lower-panel clearance cannot substitute for the clipped visible pixels.

## Supplemental adversarial findings

### R2-M2 — filtered post-pagination summary reports unfiltered totals

After pagination completes and a filter leaves only visible events `E14,E13,E12`, the normal-flow completion summary still reports Source `10 shown` and Derived `7 shown`. Those values describe the complete unfiltered corpus rather than the currently visible filtered result, so the summary presents false visible-state provenance.

### R2-M3 — generationless success aliases bypass the matching-generation contract

The QA delivery surface accepts generationless success aliases that settle pagination without proving the response belongs to the matching pending lane generation. This bypasses the approved stale/cross-generation rejection contract and weakens the evidence that only the matching request may add earlier events.

### R2-L1 — click-only pagination activation bypasses the anchor baseline

A programmatic click-only pagination activation bypassed the genuine activation anchor baseline and produced a `1767.1875` CSS-pixel jump. Assistive-technology activation was not tested, so no AT-equivalence claim is available. This is Low rather than Medium only because the reproduced path was programmatic and ordinary pointer/keyboard behavior was not shown to fail.

### R2-L2 — hidden desktop Settings History remains programmatically activatable at compact width

At 320 px, the desktop Settings **History** control is hidden at 0×0 and unreachable to ordinary users, but programmatic activation still opens v18. The visible/hit/accessibility contract prevents ordinary-user reachability, yet the hidden origin remains an unnecessary off-surface activation path and must be rejected fail closed.

## Checks completed and fail-fast boundary

- All 48 held records and the manifest matched at formal-run start and end; staged paths remained zero.
- The exact helper rerun reproduced the frame-16 overlap.
- Round 1 M1 framing and M2 visible-focus repairs passed their targeted rechecks.
- Supplemental adversarial checks reproduced the two Medium and two Low behaviors above.

Formal QA stopped broad live expansion after the deterministic frame-16 blocker. It did not complete the remaining exhaustive live fixture, pagination, origin/return, responsive/media, keyboard, assistive-technology, or direct-v17 matrix. Those unrun branches are not claimed. Passing identity, structured assertions, privacy checks, or repaired Round 1 subsets do not override any open finding.

## Disposition and proof boundary

The Round 2 manifest and held aggregate are rejected for freeze. The same v18 must repair all five consolidated findings, rerun Product and Design readiness, regenerate and inspect all governed evidence from final bytes, create a wholly new manifest, and receive a fresh independent run from zero. No finding is waived.

Prior Product and Design readiness is invalidated pending recheck: `P=F`, `D=F`. Council authority remains `C=A`; implementation returns to `I=IP`; independent QA is `Q=F`; freeze is `F=—`. `LID-SCP-003`, `LID-VN-006`, and `LID-REF-004` remain open. Program arithmetic remains **19/57 closed and 38/57 open**; V19–V35 remain queued.

This rejection concerns deterministic frontend behavior and evidence only. It proves no backend or durable history, persistence, VoiceNotes authority or reconciliation, transactionality, concurrency, idempotency, recovery, provider behavior, authentication, encryption, deployment, production privacy/security, formal accessibility conformance, or production readiness.
