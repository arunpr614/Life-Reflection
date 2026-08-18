# Life in Days prototype v15 — Correction Editor

> **Post-QA/pre-commit snapshot · independent QA Pass · 22/22 independently verified · implementation/evidence commit pending · not frozen · P=A · D=A · C=A · I=IP · Q=A · fictional deterministic data · browser-memory mutations · no durable storage or production claim**

At this post-QA/pre-commit snapshot, v15 is the independently passed `PVA-010 Correction Editor` frontend-prototype candidate. It represents Source Item-bound text Corrections against one completely visible selected base revision, guarded create/update/removal, simulated author/time, unsaved-leave handling, failure and reconciliation, and bounded retained-history truth while preserving frozen v6–v14 behavior.

At this post-QA/pre-commit snapshot, the evidence owner captured and inspected the exact 22-frame current-run set after the held ten-file UI fingerprint below, and `/root/v15_independent_qa_final2` independently returned **Pass** with unresolved Critical 0, High 0, Medium 0, Low 0. The implementation/evidence commit, freeze record, and final tracker record remain pending; no backend behavior, durable persistence, deployment, or production state is claimed.

## Run

```sh
npm run check:v15
npm run prototype
```

Open [the v15 prototype](http://127.0.0.1:4173/index-v15.html?view=calendar&month=2026-08).

## V15 contract

- **Correct displayed text** launches only from one eligible Voice Journal or Uploaded Journal Source Item; there is no global or blank composer.
- The editor exposes the Source Item identity and one complete read-only selected Source Revision before the prefilled **Displayed Correction** editor.
- A valid create or update appends exactly one represented Correction bound to its captured base. It does not overwrite source bytes, a Source Item, a Source Revision, or a prior Correction.
- The exact visible author is **Archive owner · simulated**. The four fixed fictional event times are 13 August 2026 at 10:06, 10:07, 10:08, and 10:10 pm IST.
- Known-zero failure preserves the open-page draft or displayed Correction. Unknown results require status reconciliation before another effect. Rapid, replayed, stale, and racing callbacks cannot create a second result.
- Removing a displayed Correction restores its exact recorded base for display, retains the Correction as represented historical, and never means deletion.
- Dirty navigation uses the exact unsaved-leave dialog. Pending save/removal cannot be dismissed as though cancelled. Session loss discards the private draft and returns only generic copy.
- Source, base, draft, Correction, intent, result, focus, and fixture values remain in live memory and out of URL, title, history payload, browser storage, requests, console, telemetry, product identifiers, and live-region copy.
- V16 owns source-conflict review, v17 owns redating, and v18/later owns complete History. V15 does not claim any of them.

## Exact held candidate identity

Independent QA judged only this exact ten-file UI fingerprint:

| Artifact | SHA-256 |
| --- | --- |
| `index-v15.html` | `0a4fadbf20eff28015cd139e856f8f26abd00db6e58bd99f780c86e15f70aeba` |
| `app-v15.js` | `7931020ab0e52ebbb792ca4d47ba7180b95724ae0293ff430e0e7503f22120aa` |
| `styles-v15.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `styles-v15-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `styles-v15-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |
| `styles-v15-resilience.css` | `d69e52e73bfb2f72c378fbed3b60e1268790cdc91c642dbae347be01b642201c` |
| `styles-v15-date-review.css` | `525fcd5fe79e20ccb498b3d5dc6e323eb424cb5df3f8ad73ab4701ddc860bad5` |
| `styles-v15-telegram.css` | `6489ac5e330af80c0488ed411229a6256d13765535b8cdf2eb9a3e42a21e4992` |
| `styles-v15-upload.css` | `ca45322956ba372850550be860a02bcd6b63735108808d1612033bf327b81b74` |
| `styles-v15-correction.css` | `8a97c0d60b3871ecbdd690f213407cec7388a4890a77a2ae0d9ba6826a654c5e` |

The separate package/check artifact is `package.json` at SHA-256 `00b611543b69e43f3b0599db684c0f1cfc48e6fea60637410b73c7238882985a`.

The exact governing inputs are:

| Input | SHA-256 |
| --- | --- |
| `docs/prototypes/v15/COUNCIL-v15.md` | `a690fd5f8d2c5db9fa9c1214ecaec9226949197827dacbb94713831792db609f` |
| `docs/prototypes/v15/CORRECTION-FIXTURES-v15.md` | `fc91a833255ada0c349333721b26b837e27f70129b1cce263cbee2573a502492` |

Any UI-byte change invalidates the complete evidence set and requires all 22 frames plus independent QA to restart from zero. A package-byte change requires an updated package identity and repeated static checks. A Council or fixture change reopens the authority gate before QA.

## Current-run evidence manifest

The exact roster comes from [Correction Fixtures v15](../../docs/prototypes/v15/CORRECTION-FIXTURES-v15.md#exact-evidence-roster). These fresh repository files were captured after the held UI fingerprint, inspected at original resolution by the evidence owner, and independently inspected 22/22 at original size by `/root/v15_independent_qa_final2`. Roster, dimensions, RGB8 non-interlaced PNG format, unique hashes, repository-byte identity, and ordered aggregate `fb79ec13580e2acb459b3d0a4bf2273cafd25a33115327e338cc191c36ac0b37` passed.

| File | Required capture | Verified dimensions | SHA-256 | Format |
| --- | --- | --- | --- | --- |
| `v15-01-source-card-launch-light.png` | 1440 × 900 | 1440 × 900 | `66ece1bbbbad66a2390fbce22c79475b64b0364dab7d7a50702ad9c1c676fd9b` | PNG · RGB8 · non-interlaced |
| `v15-02-new-editor-base-dark.png` | 1440 × 900 | 1440 × 900 | `4a58c0228408ad1c9381ae4abe4f735356bc8d05adf129236164e2033fb606a6` | PNG · RGB8 · non-interlaced |
| `v15-03-uploaded-editor-light.png` | 1440 × 900 | 1440 × 900 | `52d4d3031d7896c887ed43d8cc726aff4f076491cae034eb3cab77be6c72142d` | PNG · RGB8 · non-interlaced |
| `v15-04-dirty-draft-dark.png` | 1440 × 900 | 1440 × 900 | `dc7d6de9b8a89b715fe206b2c352cc473b1769729bd78931c1b8dbaa9e726947` | PNG · RGB8 · non-interlaced |
| `v15-05-whitespace-validation-light.png` | 1280 × 720 | 1280 × 720 | `0d4f0c280f8dda008e1437c4a18ac0dd82caec16aa6882f8926aad07b8a460e0` | PNG · RGB8 · non-interlaced |
| `v15-06-unsaved-leave-dark.png` | 1280 × 720 | 1280 × 720 | `25ee468291d3c1d3e3d0da8c06cbfe0151cc6f98545ec433aab1d785e7197559` | PNG · RGB8 · non-interlaced |
| `v15-07-saving-correction-light.png` | 1280 × 720 | 1280 × 720 | `c611bdc83ab82405d1d2537c4bda37cf53e22e63c46fc1381d60894fe45bca8b` | PNG · RGB8 · non-interlaced |
| `v15-08-save-success-metadata-dark.png` | 1280 × 720 | 1280 × 720 | `9660ef6038a8a28201de5ee8d4f39239383fd0278d7fd25e1abb49f7a512470f` | PNG · RGB8 · non-interlaced |
| `v15-09-corrected-source-card-light.png` | 960 × 900 | 960 × 900 | `68e82a128e8fdab9c51f636a8933f2113221673570d6d4e341ceed4371ead543` | PNG · RGB8 · non-interlaced |
| `v15-10-save-failure-dark.png` | 960 × 900 | 960 × 900 | `df85c4e7bf00022fd51dc8e91aeee980c8ecae9920924739d33398091162b4f5` | PNG · RGB8 · non-interlaced |
| `v15-11-connection-interrupted-light.png` | 960 × 900 | 960 × 900 | `21702ef524bfa49c8d10a229883d5cb6512794e23ad0d1418fe951caa4f962f0` | PNG · RGB8 · non-interlaced |
| `v15-12-retry-saving-dark.png` | 960 × 900 | 960 × 900 | `d41f2343e5bda91e70badc71f22ad9969eafc1c2b57bc41426410ce479b159f2` | PNG · RGB8 · non-interlaced |
| `v15-13-rapid-repeat-settled-light.png` | 700 × 900 | 700 × 900 | `e780a487860d095f92c13121da1e6740b693a2cec2f91f4f2b639db379345bf7` | PNG · RGB8 · non-interlaced |
| `v15-14-existing-correction-editor-dark.png` | 700 × 900 | 700 × 900 | `d458bb4d90d71055d674869a557b785cf52dab4378795d67a3a1176149d00df1` | PNG · RGB8 · non-interlaced |
| `v15-15-remove-confirm-light.png` | 700 × 900 | 700 × 900 | `a30dd2701ad1c924feed617a9d2dab8c0952f85dc9e08e066c9598ccdb94dfcb` | PNG · RGB8 · non-interlaced |
| `v15-16-remove-failure-dark.png` | 700 × 900 | 700 × 900 | `cd614c82c4983af42b2ba6b1e8c3b4d322596485e917e526fb3876f006683738` | PNG · RGB8 · non-interlaced |
| `v15-17-remove-success-retained-light.png` | 640 × 900 at 200% text zoom | 640 × 900 at 200% text zoom | `0412ec9e2e3dfba74360e4ce5bedde0e96a969b4fcd64fbe7c8853d3c6c7054b` | PNG · RGB8 · non-interlaced |
| `v15-18-session-ended-draft-dark.png` | 640 × 900 at 200% text zoom | 640 × 900 at 200% text zoom | `ee9908d819c824bc2a103e1f006c1382ccfa20792b441f3f7c5841867f1e9fc1` | PNG · RGB8 · non-interlaced |
| `v15-19-long-editor-mobile-light.png` | 390 × 844 | 390 × 844 | `b6387c0078f99222d20939f073356204bcd2134ed6c5f25ebb88043b0c75645a` | PNG · RGB8 · non-interlaced |
| `v15-20-unsaved-mobile-dark.png` | 390 × 844 | 390 × 844 | `8748c84cfe709a7890aec27c6090bc76cc0b6b3dcfee3ba45b8608321a5ad8cf` | PNG · RGB8 · non-interlaced |
| `v15-21-remove-landscape-light.png` | 568 × 320 landscape | 568 × 320 landscape | `828fdc5336719969a89f2261058f5674d59377d0b21852316147dc683ddbe6d2` | PNG · RGB8 · non-interlaced |
| `v15-22-long-error-400pct-dark.png` | 320 × 900 at 400% page reflow | 320 × 900 at 400% page reflow | `27a4992d182614aca1b39fcd226ad30195fdd0369be905022bc1466356af8d37` | PNG · RGB8 · non-interlaced |

At this post-QA/pre-commit snapshot, all 22 exact repository files are present with no extra v15 PNG, have unique hashes, match the fixture-prescribed dimensions and image mechanics, and passed independent original-size inspection.

## Post-QA/pre-commit gate state

V15 inherits frozen v6–v14 UI, documentation, evidence, interaction, and privacy contracts. No earlier-version artifact may change.

- Product acceptance: **A**
- Experience contract: **A**
- Council approval: **A**
- Prototype implementation: **IP at this post-QA/pre-commit snapshot; becomes A only when the implementation/evidence commit exists**
- Evidence: **22/22 current-run frames captured and independently inspected at original size**
- Independent QA: **A — Pass by `/root/v15_independent_qa_final2`; Critical 0, High 0, Medium 0, Low 0**
- Freeze and handoff record: **not attempted at this post-QA/pre-commit snapshot; implementation/evidence commit pending; v15 is not frozen**

At this post-QA/pre-commit snapshot, v16 remains queued until v15 completes its implementation/evidence commit, records a documentation-only freeze, and receives its final tracker record.

## Deliberate limits and QA gate

This is a static frontend prototype with fictional fixtures and browser-memory transitions. It does not prove source storage, durable Correction persistence, immutable server records, trustworthy author/time, transactionality, rollback, cross-process concurrency, backend idempotency, restart recovery, upstream reconciliation, complete History, export/restore reconstruction, authentication, deployment, operations, production readiness, or formal accessibility conformance.

Independent QA began from zero on these exact candidate, authority, and evidence bytes; completed the Council and fixture matrices plus full live v6–v14 regression; inspected all 22 frames individually at original size; and returned unresolved Critical 0, High 0, Medium 0, Low 0. The final report records the bounded timeout recovery, localhost-only request audit, static/frozen checks, and cleanup.

## Review artifacts

- Handoff: [CALENDAR-UI-PROTOTYPE-v15.md](../../docs/prototypes/CALENDAR-UI-PROTOTYPE-v15.md)
- Council: [COUNCIL-v15.md](../../docs/prototypes/v15/COUNCIL-v15.md)
- Correction fixture sheet: [CORRECTION-FIXTURES-v15.md](../../docs/prototypes/v15/CORRECTION-FIXTURES-v15.md)
- Final independent QA report: [design-qa-v15.md](../../design-qa-v15.md) — **Pass; Critical 0, High 0, Medium 0, Low 0**
- Evidence directory: [docs/prototypes/v15/](../../docs/prototypes/v15/) — exact 22-frame current-run roster; 22/22 independently inspected at original size

## Sole permitted closure statement

**V15 prototype-represents Source Item-bound text Corrections, immutable base-revision visibility, simulated author/time, guarded create/edit/removal, unsaved-warning, failure/retry/race/session behavior, and retained Correction records using deterministic fictional browser state. Source storage, durable Correction persistence, upstream reconciliation, conflict resolution, redating, complete history/export/restore reconstruction, backend idempotency, encryption, authentication, deployment, and production readiness remain unverified.**
