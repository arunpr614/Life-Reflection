# Life in Days v17 independent design QA — Round 2

- **Package:** `PVA-012 Atomic Redating`
- **Baseline:** frozen v16 commit `01d1f054a12773e07f91096b8d76b0c5f4064329`
- **Independent QA agent:** fresh read-only `/root/qa_v17_round2`
- **Held candidate manifest SHA-256:** `6405f86c8074d142dc6f2d120549e34db69e7c97b0d92288657f5104717fa471`
- **Held 35-file aggregate SHA-256:** `e7fe4250510958c155726753ba8247be594e8592d03a690282ab4f59da5bc2ec`
- **Held at:** `2026-08-19T15:14:27+05:30`
- **Final unchanged rehash:** `2026-08-19T15:41:16+0530`
- **Round 2 verdict:** **PASS**
- **Severity counts:** **Critical 0 · High 0 · Medium 0 · Low 0**

This is the durable record of the fresh independent run against the repaired and resealed v17 candidate. The manifest and all 35 held files remained byte-identical from assignment through the final rehash. Independent QA found no Critical, High, Medium, or Low defects within the bounded synthetic frontend-prototype scope, so the Round 2 QA gate is accepted.

Round 1 remains a durable **FAIL — C0/H2/M3/L0** in [DESIGN-QA-v17-round1.md](DESIGN-QA-v17-round1.md). Its five findings and the later Product/Design readiness findings were repaired rather than waived or erased. The replacement manifest, complete recapture, Product/Design reacceptance, and fresh-from-zero Round 2 run supersede the rejected bytes for the freeze decision; they do not rewrite Round 1 history.

## Exact identity and local freeze

The accepted Round 2 identity is:

- manifest SHA-256: `6405f86c8074d142dc6f2d120549e34db69e7c97b0d92288657f5104717fa471`;
- complete 35-file aggregate: `e7fe4250510958c155726753ba8247be594e8592d03a690282ab4f59da5bc2ec`;
- seven UI/tool asset aggregate: `e4bfec90d9a7aa56f8d2a437c23edbd24fa6c229c10c7d7b78250ba82571ed49`;
- four governing-authority record aggregate: `5fd6262e41245421b8e2ee8a11e6a7f88175a2ae5a917c0be060326c4e54f32e`; and
- twenty current-run evidence file aggregate: `2b8307f01db583cab9ed324dfc852e6a44a907a28754f3ad4ffc2ac16c5ae296`.

The exact independently tested roster and its manifest were subsequently committed locally as candidate implementation commit `571308f678ba92a159b95b5093c68ee4b283fe4a`. A post-verdict committed-blob comparison reproduced every manifest-listed path hash, the complete 35-file aggregate, and the manifest's own SHA-256. The candidate handoff blob tested by QA remains preserved in that commit; the current handoff is a clearly labelled documentation-only successor that records this verdict and local freeze without changing the tested candidate.

The QA agent edited, staged, committed, and pushed nothing. Remote push and remote readback were not part of this QA run and remain separate gates.

## Independent checks passed

### Sealed roster, chronology, and frozen base

- The manifest self-hash, all 35 listed file hashes, and the complete aggregate matched at assignment and at the exact final rehash time above.
- All ten PNG/JSON pairs were created after the final UI/tool bytes. Their chronology, checksums, requested viewport/media observations, and recorded **20/20** invariant sets reconciled with the sealed roster.
- JavaScript syntax, the v17 static verifier, and the exact frozen-v16/package guard passed. The frozen base remained `01d1f054a12773e07f91096b8d76b0c5f4064329`.
- The evidence recorded no horizontal page overflow, retained local/session/IndexedDB/cache/service-worker state, console events, or browser exceptions. Network requests remained confined to the local prototype server; no external request was observed.

### Atomic-redating behavior and cardinality

- All ten approved deterministic states were reachable, including coherent `date-required`, future rejection, same-day rejection, pending, known failure, unknown result, interrupted, competing revision, success, and rapid repeat.
- All five accepted-intent outcomes were exercised through their natural controls. Zero-effect outcomes preserved the exact before projection; success applied one effect once; retry, status check, competing-revision handling, and duplicate-result suppression preserved zero-or-one cardinality.
- Both resulting-day links opened the intended synthetic Journal Days and returned to the intact result summary. The immutable Original Timestamp and the represented two-day consequences remained coherent.
- Exact inherited launch context was exercised for uploaded-journal, Voice Journal, Daily Photo, and completed-capture sources. Each eligible opening began fresh; the incomplete **Market morning** path failed closed through its original v16 behavior rather than substituting the fixed fixture.

### Exit safety, focus, and inherited behavior

- Pre-intent Cancel, Back, and Escape returned to the exact invoking archive control and view after scroll settlement.
- Pending, unknown, and interrupted intents blocked silent abandonment and retained the represented recovery/status path.
- Direct frozen-v16 access and v16 stale-copy correction passed without changing the frozen assets.
- The inactive launcher remained fully visible, focusable, hit-testable, and non-overlapping with inherited controls. Exact archive-return focus and point hit tests passed across the tested `320`, `390`, `568`, `960`, `1000`, `1020`, `1021`, `1280`, and `1440` viewport widths.

### Responsive and accessibility-oriented behavior

- The task preceded the proof console at reflow widths, and the consequence cards stacked at and below the approved `1020 px` breakpoint while remaining side by side above it.
- The tested states retained one visible `h1`, a main landmark, a working skip link, visible focus, labelled controls, text-plus-colour status communication, minimum `44 px` primary targets, and essential metadata at least `13 px`.
- The bounded contrast scan returned zero failures. Reduced-motion and forced-colour presentations passed the exercised states.
- The tested pages retained a generic query/hash-free URL, null history payload, and zero retained browser storage.

## Verdict and closure boundary

Round 2 is **PASS — C0/H0/M0/L0** for the exact held frontend-prototype candidate. This accepts the independent-QA gate for `LID-SCP-002`, `LID-SRC-003`, and the redating portion of `LID-SRC-004`; formal tracker closure and remote publication/readback remain Project Manager actions outside this report.

This verdict is bounded to the exact manifest identity. Any change to a manifest-listed asset requires a new candidate identity and fresh QA. The documentation-only successor handoff and this report may record the immutable result without changing the tested implementation/evidence bytes preserved in the candidate commit.

## Explicit limitations

Round 2 did not verify native browser or page zoom, a real screen-reader or other assistive-technology session, mobile operating systems or mobile browsers, or formal accessibility conformance. It does not prove backend or durable atomicity, persistence, rollback, restart recovery, concurrency, cross-process idempotency, provider or VoiceNotes behavior, authentication, authorization, encryption, production privacy or security controls, deployment, operations, production readiness, or fitness for real personal data.

The result is evidence for deterministic fictional browser-memory behavior only. It is not a backend, provider, security, deployment, accessibility-conformance, or production-readiness claim.

## Repository and publication boundary

The accepted candidate is locally frozen at implementation commit `571308f678ba92a159b95b5093c68ee4b283fe4a`. At the time of this record, no Round 2 remote push or remote readback has been claimed. V18 remains blocked until the Project Manager records the documentation-only freeze successor, pushes all v17 assets to the explicit prototype branch, and verifies the remote branch tip and committed blobs.
