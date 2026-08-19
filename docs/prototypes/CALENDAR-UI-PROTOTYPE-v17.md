# Life in Days calendar UI prototype v17 — Atomic Redating

> **Round 2 held pre-QA candidate · P=A · D=A · C=A · I=A · Q=Round 2 pending · F=Pending · deterministic fictional data · browser-memory state · no backend, persistence, provider, security, deployment, or production claim**

V17 is the additive `PVA-012 Atomic Redating` prototype candidate built on the exact frozen v16 archive commit `01d1f054a12773e07f91096b8d76b0c5f4064329`. It represents one deliberate Source Item Journal Date change, an immutable Original Timestamp, a complete two-day consequence preview, future/same-day rejection, zero-effect failure and unknown-result handling, one-effect success, and duplicate-result protection.

This is the repaired Round 2 candidate hold. Independent QA Round 1 remains a durable **FAIL — C0/H2/M3/L0** and closes no requirement. Product and Design have accepted the final repaired bytes for a new independent run; they have not supplied a QA verdict. Fresh read-only assignee `/root/qa_v17_round2` must judge the exact 35-file roster in [the replacement candidate manifest](v17/CANDIDATE-MANIFEST-v17.md) from zero. Any held file or manifest-byte change invalidates that run.

## Open locally

From `prototypes/calendar-ui`:

```sh
node check-v17.mjs
LIFE_IN_DAYS_PROTOTYPE_PORT=4317 node serve.mjs
```

Open `http://127.0.0.1:4317/index-v17.html`. The route clears inherited query/hash state before showing the successor workspace. The frozen `index-v16.html` remains directly reachable and unchanged.

## Product and experience contract

- The task starts from one synthetic Source Item and names its current Journal Date, fixed `Asia/Kolkata` interpretation, and immutable Original Timestamp.
- Eligible inherited v16 actions open only with the exact invoking item reference, type, label, Journal Date, Original Timestamp, displayed source state/revision label, and before snapshot. Every opening constructs fresh `ready` state at `0/0/0/0` and focuses the feature `h1`; incomplete context follows original v16 behavior without substituting the fixed fixture.
- The destination field rejects a future day and the current day before an intent exists. Empty input becomes coherent `date-required` / **Destination required**, leaves no named fixture pressed, retains field focus, and fabricates no destination projection. Ordinary valid date changes retain field focus.
- Separate current-day and destination-day cards show before/after membership, visibility, cover, generated-field, artwork, and retained-history consequences. They stack in reading order at the `1020 px` breakpoint and below.
- The represented operation is zero-or-one. Pending has one intent and no effect. Known failure, unknown result, interruption, and a competing revision preserve the exact before projection.
- Success moves one Source Item once, applies both day projections together, retains invalidated artwork in History, preserves real-photo cover precedence, appends one typed event, and queues no provider request.
- A duplicate result leaves cardinality at one intent, one effect, one event, and zero provider requests.
- Success links open both resulting synthetic Journal Days and return to the intact result summary.
- Before an intent, Cancel, Back, and Escape restore the exact invoking archive control, scroll, and view. Pending, unknown, and interrupted intents cannot be silently abandoned.
- The visible Prototype states console exposes all ten deterministic states plus accepted-intent outcome delivery. Reset preserves the current source context; the global QA reset returns to fixed authority without storage.
- The workspace has one visible `h1`, a main landmark, skip link, visible focus, labelled native controls, text-plus-colour states, 44 px primary targets, essential metadata at least 13 px, task-before-console order, responsive reflow, reduced-motion treatment, forced-colour treatment, restrained live regions, and safe archive return focus.
- The inactive Atomic Redating launcher is in normal document flow before the archive. It is not a fixed overlay and must remain fully visible, hit-testable, at least 44×44 CSS pixels, and non-intersecting with inherited controls.
- The v17 runtime is the frozen append-only compatibility kernel for v18–v35. Its generic launcher, prior-feature route, cumulative manifest, and latest-compatible QA dispatcher allow later version capsules without editing v17.

## QA Round 1 — durable rejection

The first held identity was manifest SHA-256 `51f8e49fe588c139d3c542da22833cf9dd2bd840cdac39fe7b6ab1efde570466` with 29-file aggregate `14abca5efb18c2887fb4790a481abe26acafc9674317d6d20a45f093f75e6bbe`. Fresh independent agent `/root/qa_v17` returned **FAIL — Critical 0 · High 2 · Medium 3 · Low 0**:

- **H1:** inherited openings substituted the fixed item, leaked stale completed state into later openings, and missed initial `h1` focus.
- **H2:** the launcher occluded the frozen **Populated archive** control at `1280×720`.
- **M1:** the proof console visually preceded the primary task on medium and compact layouts.
- **M2:** empty date input remained labelled Ready and lost field focus instead of entering coherent `date-required` state.
- **M3:** pre-intent Cancel reset the fixture inside v17 instead of returning to the exact invoker.

All five findings were accepted by Product, Design, and Project; none was deferred. The exact Round 1 bytes are obsolete and cannot be frozen or reused. The durable independent report is [DESIGN-QA-v17-round1.md](v17/DESIGN-QA-v17-round1.md).

## Repair and readiness history

All five Round 1 findings were repaired in the same v17 package. A later Product/Design readiness recheck then correctly withheld acceptance for two additional findings: the inactive launcher was partially covered by the frozen banner at `320 px` and `390 px`, and the two consequence cards remained side by side below the required `1024 px` threshold. Both were repaired.

A subsequent Design review found the light-theme `--lid-faint` normal-text token `#727d76` at only `4.2068:1` against its surface. It was not accepted or deferred. The token is now `#6b766e`, measured at `4.650835:1`, and the entire evidence set was recaptured after the final CSS bytes.

The superseding final readiness decision is **P=A · D=A · C=A · I=A**, with fresh Product and Design severity ledgers **C0/H0/M0/L0**. Historical independent QA remains `Q=F` for Round 1 only; **Round 2 is pending and has no verdict**. The complete failed-recheck and superseding acceptance history is [PRODUCT-DESIGN-RECHECK-v17.md](v17/PRODUCT-DESIGN-RECHECK-v17.md).

## Exact held prototype assets

| Artifact | SHA-256 |
| --- | --- |
| `index-v17.html` | `402c4f6b3f26267411d793a23a11dedc150c7f118532049f47bffab1f6d9afc7` |
| `runtime-v17.js` | `474bd76af246beed53a8ec1c2eae6aa61decf31e2df1400edd1be0fd0674f8ad` |
| `app-v17.js` | `3618222f8a156b52f8cf37fdd2ba6178cb75c7bc5bf89b330ee33997307a9f4a` |
| `styles-v17.css` | `dbebc3b92af0fca95fd1f61fcfbe308c320a30df798ff2e2801210f80dddade2` |
| `README-v17.md` | `4b29f95c8878ca243638022a346c0f1b5aa37253400b5490adb11d7575151851` |
| `check-v17.mjs` | `e3d21faf514b856ce991609147212e23702b2b49df87f028c4d3aa10a37fbcd1` |
| `capture-phase2-evidence-v17.mjs` | `860f01a5ea135d53650552c508a91f2c51ccf306b183e09486a3691e3afa3c37` |

The ordered seven-asset aggregate is `e4bfec90d9a7aa56f8d2a437c23edbd24fa6c229c10c7d7b78250ba82571ed49`. The aggregate is SHA-256 of the seven complete checksum records sorted lexicographically. `node check-v17.mjs` passes twelve frozen v16/package hashes, seven additive assets, ten fixtures, and the privacy/static contract.

## Governing authority

| Artifact | SHA-256 |
| --- | --- |
| `docs/phase2/PRODUCT-ACCEPTANCE-v17-v35.md` | `9833512ed8dc7358630487cda208c31f7867f4fb1f0bf43ca6a7171044351a84` |
| `docs/phase2/UX-CONTRACT-v17-v35.md` | `d6a505ba6ec137af1bc43d5986c1551a8b5c29e85122ae5ba0adbc24c9182cf6` |
| `docs/prototypes/v17/COUNCIL-v17.md` | `632691dce8d7964944374dc821221ffcf63f4e7b207c8573b81ecd9cec868ec7` |
| `docs/prototypes/v17/ATOMIC-REDATING-FIXTURES-v17.md` | `7f4dfe0f80eedcc150d2a4e1a87ea7264d670d92bdff3de0b5eadd0fde3c443f` |

The ordered four-authority aggregate is `5fd6262e41245421b8e2ee8a11e6a7f88175a2ae5a917c0be060326c4e54f32e`. The living project ledger and historical QA/recheck records are held in the Round 2 manifest but intentionally excluded from the governing-authority aggregate because they record gate history rather than change Product, Design, Council, or fixture meaning.

## Exact gate-history records

| Record | SHA-256 |
| --- | --- |
| `docs/phase2/PROTOTYPE-COMPLETENESS-PROJECT-TRACKER-v17-v35.md` | `c713c75ebef1e47e9d9f3a5915e01640731ac3fa53a1b4d74534c30852edd43c` |
| `docs/prototypes/v17/DESIGN-QA-v17-round1.md` | `4977c70ed637864c24b9f6338cbbe7b0dc22f473fe28cb960d86e09e8188ade4` |
| `docs/prototypes/v17/PRODUCT-DESIGN-RECHECK-v17.md` | `f66cb46854372e76aac32035ba11070fa1ba3c8dc5456860e83b43c2f291b0a1` |

These records preserve the failed first independent run, all repair/readiness findings, final Product/Design acceptance, open requirement rows, and the prohibition on v18 work before v17 passes QA and is frozen, pushed, and read back.

## Current-run evidence

Every PNG and JSON sidecar was created after the final seven-asset fingerprint above. The eight active-state pairs and two inactive-archive launcher pairs form the complete Round 2 set.

| Frame | State/view | Viewport | Theme/media | PNG SHA-256 | JSON SHA-256 |
| --- | --- | ---: | --- | --- | --- |
| `v17-01-ready-wide-light` | Ready preview and immutable timestamp | 1440×900 | Light; motion default; forced colours none | `eaca414dbdfd4fa87d8780a22093440cae00dfd7d2453133cd0a9a83fa995ef4` | `82ce413b3b2ea9d0588a9f6c87df1230bb4721ee2ff42d4281b07eb5c7a1ed85` |
| `v17-02-future-rejected-medium-dark` | Future rejection; zero intent/effect | 960×900 | Dark; motion default; forced colours none | `b50b6ec1dd40969b5b0ba8865ea6e29bc0a497ab5385f967eeb096c3a1e3d5e7` | `3f0b9962c42584db32596f5eb096a4e6fcbaddeb199e9cf4181248819516d64c` |
| `v17-03-pending-wide-light` | One intent; visible synthetic outcomes | 1440×900 | Light; motion default; forced colours none | `73364f1e6120cd18e53659b58241071143acbcca0254295e0034d0a67e75b398` | `a4ab398c0a53c3430a1a3a100acec5f5fe0d00df16b3b0a0550dcc61f22693c5` |
| `v17-04-success-wide-dark` | One complete effect, links, one event | 1440×900 | Dark; motion default; forced colours none | `c4cf3b2c363eac0e32b306c81c5e323212aef1232173cb9077fdf990becf2741` | `e8b0888bdb3cb114c53ad1efe1ee177cb2e66324a72c3fd2380de8e5287bcc93` |
| `v17-05-failure-medium-light` | Known-zero failure and same-intent retry | 960×900 | Light; motion default; forced colours none | `32117ff4a90d635cdf2da4e01a456d62aaa58bbc87afc69ee07eae283b4cf5fc` | `2400a95b4dac73964fe0370e7cfa6bfdbdf06f1153570be5c3cf138a8bf984a3` |
| `v17-06-unknown-compact-dark` | Unknown result and status check | 390×844 | Dark; motion default; forced colours none | `f4eeb8ffd5ddaac3002908bc15299264a96971445b722d21a850d36c4de3af4e` | `d752a85ee91893c7d737644841a7b35ac8171a397dc2fc155d7c5a04aa6ca488` |
| `v17-07-pending-landscape-light` | All five accepted-intent outcomes | 568×320 | Light; reduced motion; forced colours none | `005c1dff29ad80882efc1da801a32773d70a027c9c7988521867ba01b5e237f7` | `65a099193ac38f2e58a1a11889221eba86408c1a19bb7ab808f3a4c55b993f61` |
| `v17-08-rapid-repeat-320-forced` | Duplicate ignored; one-effect cardinality | 320×900 | Dark; reduced motion; forced colours active | `a7a54c85b097dcf4ea706f6163ddaad475107d0ae05c2f64c4d26e98ff8476ff` | `5ab4594c7c431d7e4474904f33d7a5b7dd1127f9e44ba36ad178a55caa434dc8` |
| `v17-09-archive-launcher-390-light` | Inactive archive; repaired launcher | 390×844 | Light; motion default; forced colours none | `8a293cef8e848d0244d02d0e41931738b5f8370980a2cedcd01ec7f91d232592` | `2b293c6708bd231f94de8d0c76a7fac515266654b8c4aa3cfd8929ca113d0f59` |
| `v17-10-archive-launcher-320-forced` | Inactive archive; launcher in forced colours | 320×900 | Light preference; reduced motion; forced colours active | `54eec564d5c33025ed961bdbd32020a1abcebdd5ac6c3d52efaa73b6399ba65b` | `4392bd9fee5eeab5fc4bda498b466b7d01e5535049954c0d6e102a119b8bc2a7` |

The ordered twenty-file evidence aggregate is `2b8307f01db583cab9ed324dfc852e6a44a907a28754f3ad4ffc2ac16c5ae296`.

Every sidecar records **20/20 passing current-state invariants**, the exact requested viewport, a query/hash-free generic URL, null history payload, no horizontal page overflow, zero local/session/IndexedDB/cache/service-worker state, fifteen localhost-only resource requests, zero console events, and zero browser exceptions. The active set covers ready, future rejection, pending, success, failure, unknown, reduced-motion landscape, and rapid-repeat forced-colour presentation.

Both archive sidecars additionally record a visible main-document Back control used by CDP mouse input, an inactive empty feature host, launcher focus after return, a fully visible launcher of at least 44×44 CSS pixels, successful center and four inset-corner hit tests, and zero intersections with visible inherited controls. The `390×844` launcher rectangle is `358×89.5` at `x=16–374`, `y=78–167.5`; the `320×900` rectangle is `288×91.5` at `x=16–304`, `y=78–169.5`.

## Pre-QA checks completed

- `node --check` passed for `runtime-v17.js`, `app-v17.js`, `check-v17.mjs`, and `capture-phase2-evidence-v17.mjs`.
- `node check-v17.mjs` passed with all twelve frozen v16/package dependency hashes unchanged.
- All ten JSON sidecars parse and record a passing 20-assertion invariant set, matching viewport/media observations, no horizontal overflow, no retained browser state, localhost-only requests, and zero captured console events or exceptions.
- The two archive sidecars contain the complete launcher geometry, focus, hit-test, inactive-host, and inherited-control-intersection diagnostics described above.
- Exact file rehashes reproduce the seven-asset, four-authority, and twenty-file evidence aggregates in this handoff.
- `git diff --check` passed. No v1–v16 file, `package.json`, `serve.mjs`, `origin/main`, archive branch, or GitHub issue/project state was changed by the v17 work.

These are candidate-owner prechecks, not independent QA Round 2. The new QA agent must independently rehash the sealed roster and repeat the bounded behavioral, responsive, accessibility-oriented, privacy, archive, and inherited-v16 checks.

## Deliberate proof limits

This candidate is a static frontend representation with fictional fixtures and browser-memory transitions. It does not prove actual VoiceNotes or Telegram behavior, server persistence, transactionality, concurrency, idempotency across processes, restart recovery, provider access, Generated Artwork handling, authentication, authorization, encryption, export/restore, deployment, operations, production privacy, production readiness, formal accessibility conformance, native page/text zoom, or a real assistive-technology session. The evidence set is not a substitute for independent behavioral QA, and Product/Design readiness acceptance is not a QA verdict.

## Gate state

- Product acceptance: **A**
- Experience acceptance: **A**
- Council approval: **A**
- Prototype implementation and evidence: **A — exact repaired candidate held**
- Independent QA Round 1: **FAIL — C0/H2/M3/L0**, durable and superseded only by a new independent result
- Independent QA Round 2: **Pending — `/root/qa_v17_round2`; no verdict claimed**
- Requirement closure: **Pending** for `LID-SCP-002`, `LID-SRC-003`, and the redating portion of `LID-SRC-004`
- Freeze, commits, push, and remote readback: **Pending**

The only permitted current statement is: **V17 is a repaired, Product/Design-accepted, sealed synthetic frontend-prototype candidate for Atomic Redating awaiting fresh independent QA Round 2. It is not independently verified, frozen, committed, pushed, or production-ready.**
