# Held candidate manifest — prototype v17 — QA Round 2

- **Held at:** `2026-08-19T15:14:27+05:30`
- **Baseline full SHA:** `01d1f054a12773e07f91096b8d76b0c5f4064329`
- **Branch:** `codex/prototype-completeness-v17-v35`
- **Candidate form:** exact uncommitted worktree roster; nothing staged at hold
- **Files in aggregate:** 35
- **Roster composition:** 3 Phase 2 program records; 1 v17 handoff; 4 v17 authority/history records; 20 current-run evidence files; 7 v17 UI/tool assets
- **Aggregate algorithm:** SHA-256 of the 35 lines below, sorted lexicographically as complete `<sha256><two spaces><relative path><newline>` records
- **Held aggregate:** `e7fe4250510958c155726753ba8247be594e8592d03a690282ab4f59da5bc2ec`
- **Independent QA assignee:** fresh read-only `/root/qa_v17_round2`

## Gate and rejection provenance

- Product readiness: **A**, fresh final `C0/H0/M0/L0`
- Design readiness: **A**, fresh final `C0/H0/M0/L0`
- Product Council: **A**
- Implementation/evidence: **A — exact repaired bytes held**
- Independent QA Round 1: **FAIL — C0/H2/M3/L0** by `/root/qa_v17`
- Independent QA Round 2: **Pending; no verdict claimed**
- Freeze, commit, push, remote readback, and requirement closure: **Pending**

Round 1 remains preserved in `docs/prototypes/v17/DESIGN-QA-v17-round1.md` at SHA-256 `4977c70ed637864c24b9f6338cbbe7b0dc22f473fe28cb960d86e09e8188ade4`. Its obsolete manifest SHA-256 was `51f8e49fe588c139d3c542da22833cf9dd2bd840cdac39fe7b6ab1efde570466`, and its obsolete 29-file aggregate was `14abca5efb18c2887fb4790a481abe26acafc9674317d6d20a45f093f75e6bbe`. No Round 1 requirement closure or freeze claim carries forward.

The repaired candidate has Product/Design acceptance in `docs/prototypes/v17/PRODUCT-DESIGN-RECHECK-v17.md` at SHA-256 `f66cb46854372e76aac32035ba11070fa1ba3c8dc5456860e83b43c2f291b0a1`. Its exact sub-aggregates are:

- seven UI/tool assets: `e4bfec90d9a7aa56f8d2a437c23edbd24fa6c229c10c7d7b78250ba82571ed49`;
- four governing authority records: `5fd6262e41245421b8e2ee8a11e6a7f88175a2ae5a917c0be060326c4e54f32e`; and
- twenty current-run evidence files: `2b8307f01db583cab9ed324dfc852e6a44a907a28754f3ad4ffc2ac16c5ae296`.

The manifest file itself is deliberately outside the held aggregate to avoid self-reference. Its own SHA-256 must be recorded at QA assignment and rechecked unchanged at the end of the run. Any change to a listed file or this manifest invalidates Round 2 and requires a fresh candidate hold.

```text
005c1dff29ad80882efc1da801a32773d70a027c9c7988521867ba01b5e237f7  docs/prototypes/v17/v17-07-pending-landscape-light.png
2400a95b4dac73964fe0370e7cfa6bfdbdf06f1153570be5c3cf138a8bf984a3  docs/prototypes/v17/v17-05-failure-medium-light.json
2b293c6708bd231f94de8d0c76a7fac515266654b8c4aa3cfd8929ca113d0f59  docs/prototypes/v17/v17-09-archive-launcher-390-light.json
32117ff4a90d635cdf2da4e01a456d62aaa58bbc87afc69ee07eae283b4cf5fc  docs/prototypes/v17/v17-05-failure-medium-light.png
3618222f8a156b52f8cf37fdd2ba6178cb75c7bc5bf89b330ee33997307a9f4a  prototypes/calendar-ui/app-v17.js
3f0b9962c42584db32596f5eb096a4e6fcbaddeb199e9cf4181248819516d64c  docs/prototypes/v17/v17-02-future-rejected-medium-dark.json
402c4f6b3f26267411d793a23a11dedc150c7f118532049f47bffab1f6d9afc7  prototypes/calendar-ui/index-v17.html
4392bd9fee5eeab5fc4bda498b466b7d01e5535049954c0d6e102a119b8bc2a7  docs/prototypes/v17/v17-10-archive-launcher-320-forced.json
474bd76af246beed53a8ec1c2eae6aa61decf31e2df1400edd1be0fd0674f8ad  prototypes/calendar-ui/runtime-v17.js
4977c70ed637864c24b9f6338cbbe7b0dc22f473fe28cb960d86e09e8188ade4  docs/prototypes/v17/DESIGN-QA-v17-round1.md
4b29f95c8878ca243638022a346c0f1b5aa37253400b5490adb11d7575151851  prototypes/calendar-ui/README-v17.md
54eec564d5c33025ed961bdbd32020a1abcebdd5ac6c3d52efaa73b6399ba65b  docs/prototypes/v17/v17-10-archive-launcher-320-forced.png
5ab4594c7c431d7e4474904f33d7a5b7dd1127f9e44ba36ad178a55caa434dc8  docs/prototypes/v17/v17-08-rapid-repeat-320-forced.json
632691dce8d7964944374dc821221ffcf63f4e7b207c8573b81ecd9cec868ec7  docs/prototypes/v17/COUNCIL-v17.md
65a099193ac38f2e58a1a11889221eba86408c1a19bb7ab808f3a4c55b993f61  docs/prototypes/v17/v17-07-pending-landscape-light.json
73364f1e6120cd18e53659b58241071143acbcca0254295e0034d0a67e75b398  docs/prototypes/v17/v17-03-pending-wide-light.png
7f4dfe0f80eedcc150d2a4e1a87ea7264d670d92bdff3de0b5eadd0fde3c443f  docs/prototypes/v17/ATOMIC-REDATING-FIXTURES-v17.md
82ce413b3b2ea9d0588a9f6c87df1230bb4721ee2ff42d4281b07eb5c7a1ed85  docs/prototypes/v17/v17-01-ready-wide-light.json
860f01a5ea135d53650552c508a91f2c51ccf306b183e09486a3691e3afa3c37  prototypes/calendar-ui/capture-phase2-evidence-v17.mjs
8a293cef8e848d0244d02d0e41931738b5f8370980a2cedcd01ec7f91d232592  docs/prototypes/v17/v17-09-archive-launcher-390-light.png
9833512ed8dc7358630487cda208c31f7867f4fb1f0bf43ca6a7171044351a84  docs/phase2/PRODUCT-ACCEPTANCE-v17-v35.md
a4ab398c0a53c3430a1a3a100acec5f5fe0d00df16b3b0a0550dcc61f22693c5  docs/prototypes/v17/v17-03-pending-wide-light.json
a7a54c85b097dcf4ea706f6163ddaad475107d0ae05c2f64c4d26e98ff8476ff  docs/prototypes/v17/v17-08-rapid-repeat-320-forced.png
b50b6ec1dd40969b5b0ba8865ea6e29bc0a497ab5385f967eeb096c3a1e3d5e7  docs/prototypes/v17/v17-02-future-rejected-medium-dark.png
c4cf3b2c363eac0e32b306c81c5e323212aef1232173cb9077fdf990becf2741  docs/prototypes/v17/v17-04-success-wide-dark.png
c713c75ebef1e47e9d9f3a5915e01640731ac3fa53a1b4d74534c30852edd43c  docs/phase2/PROTOTYPE-COMPLETENESS-PROJECT-TRACKER-v17-v35.md
d6a505ba6ec137af1bc43d5986c1551a8b5c29e85122ae5ba0adbc24c9182cf6  docs/phase2/UX-CONTRACT-v17-v35.md
d752a85ee91893c7d737644841a7b35ac8171a397dc2fc155d7c5a04aa6ca488  docs/prototypes/v17/v17-06-unknown-compact-dark.json
dbebc3b92af0fca95fd1f61fcfbe308c320a30df798ff2e2801210f80dddade2  prototypes/calendar-ui/styles-v17.css
e3d21faf514b856ce991609147212e23702b2b49df87f028c4d3aa10a37fbcd1  prototypes/calendar-ui/check-v17.mjs
e8b0888bdb3cb114c53ad1efe1ee177cb2e66324a72c3fd2380de8e5287bcc93  docs/prototypes/v17/v17-04-success-wide-dark.json
eaca414dbdfd4fa87d8780a22093440cae00dfd7d2453133cd0a9a83fa995ef4  docs/prototypes/v17/v17-01-ready-wide-light.png
f4eeb8ffd5ddaac3002908bc15299264a96971445b722d21a850d36c4de3af4e  docs/prototypes/v17/v17-06-unknown-compact-dark.png
f66cb46854372e76aac32035ba11070fa1ba3c8dc5456860e83b43c2f291b0a1  docs/prototypes/v17/PRODUCT-DESIGN-RECHECK-v17.md
f7a5c4c1bd4e99462a80a2813d075282d525fd8f1a03fa323ec0c9ba52fc0c00  docs/prototypes/CALENDAR-UI-PROTOTYPE-v17.md
```

## Frozen-baseline guard

`node prototypes/calendar-ui/check-v17.mjs` verifies exact frozen hashes for `index-v16.html`, `app-v16.js`, all nine inherited v16 style assets, and `package.json`. At Round 2 hold it returned:

```text
check-v17: PASS (12 frozen hashes, 7 additive assets, 10 fixtures, privacy/static contract)
```

The maintained checkout's untracked Phase 2 handover, `origin/main`, the frozen archive branch, live GitHub issues/project fields, and every v1–v16 file are outside this candidate roster and were not mutated by this hold.
