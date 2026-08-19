# Life in Days v17 Product and Design pre-QA recheck

> **Current superseding disposition:** the final repaired working candidate is **Product accepted (`P=A`)** and **Design accepted (`D=A`)** for reseal and fresh independent QA Round 2. The failed readiness recheck below is preserved as historical evidence; the superseding acceptance record follows it.

- **Package:** `PVA-012 Atomic Redating`
- **Baseline:** frozen v16 commit `01d1f054a12773e07f91096b8d76b0c5f4064329`
- **Recheck stage:** repaired working candidate before reseal and before any fresh independent QA run
- **Product readiness verdict:** **FAIL (`P=F`)**
- **Design readiness verdict:** **FAIL (`D=F`)**
- **Package disposition:** **Repair in progress**

This is a Product Manager and Expert UI/UX Designer readiness recheck of the repaired, still-unsealed v17 working candidate. It is not independent QA Round 2, does not supersede the failed Round 1 QA record, and does not authorize candidate hold, freeze, commit, or push. The approved Council contract remains the authority; the current implementation does not yet satisfy it.

## Round 1 repair recheck

All five repairs required by [independent QA Round 1](DESIGN-QA-v17-round1.md) passed this pre-QA recheck:

1. inherited openings preserve the exact invoking Source Item context, start fresh at `0/0/0/0`, and move initial focus to the feature `h1`;
2. the Round 1 `1280×720` launcher/archive-control collision is repaired;
3. the primary task precedes the proof console on the Round 1 medium and compact layouts;
4. the empty-date state is coherent as `date-required` / **Destination required**, with no fixture pressed and focus retained on **New Journal Date**; and
5. pre-intent Cancel returns to the exact inherited invoker instead of resetting to the fixed fixture.

Eight PNG/JSON pairs were recaptured after those repairs. Their ordered 16-file evidence aggregate is SHA-256 `ff76d4442c2f1b66c5633904976e59d4219f6c20fecd22deffbd94a0f42b7ef5`, and the recapture set passed its recorded static/privacy checks. Those captures do not exercise the inactive launcher in the frozen archive, so they cannot establish launcher non-occlusion. Passing repairs and recaptures do not override the readiness failures below.

## Blocking findings before reseal

### High — inactive launcher remains occluded at compact widths

At both `320 px` and `390 px` widths, the inactive v17 launcher is partially covered by the frozen `.prototype-banner`. The launcher occupies approximately `y=20–109.5`; the banner occupies `y=0–66` with `z-index: 700`. A center-point hit test resolves to the banner, and only `43.5 px` of the launcher remains exposed below it.

This fails the Council requirement that the inactive launcher remain in normal flow and occlude no archive control. It also prevents Product from accepting the launcher as reliably available and Design from accepting its compact visibility and target behavior.

- **Owner:** v17 runtime/layout implementation
- **Disposition:** mandatory same-version repair; no acceptance or deferral

### Medium — consequence day cards do not stack below 1024 px

At `960 px` and `1000 px`, the Current day and Destination day consequence cards remain side by side. The approved UX contract requires the same two cards to stack in reading order below `1024 px`.

This fails the explicit responsive contract even though the cards remain visible and the recaptured pages have no reported horizontal overflow.

- **Owner:** v17 responsive style implementation
- **Disposition:** mandatory same-version repair; no acceptance or deferral

## Gate and evidence disposition

- Product readiness is `P=F` and Design readiness is `D=F` for the current unsealed working candidate.
- The three v17 requirement rows — `LID-SCP-002`, `LID-SRC-003`, and the redating portion of `LID-SRC-004` — remain `Open`.
- The Round 1 candidate manifest SHA-256 `51f8e49fe588c139d3c542da22833cf9dd2bd840cdac39fe7b6ab1efde570466` and its held aggregate describe obsolete pre-repair bytes. They must not be reused for the repaired candidate.
- The `ff76d444…` evidence set is useful repair evidence but is not a complete candidate hold because it does not cover the newly identified inactive-launcher failure and precedes the required additional repairs.
- There is no QA Round 2 verdict, severity count, candidate manifest, freeze eligibility, commit, push, remote readback, or requirement closure from this recheck.

## Required next action

Repair both blocking findings in v17, recapture every affected state and viewport after the final bytes, recheck Product and Design readiness, create a new exact candidate manifest, and then assign a fresh read-only independent QA agent from zero. V18 must not start.

## Superseding final pre-QA acceptance

- **Recheck stage:** final repaired working candidate before replacement-manifest seal and before fresh independent QA Round 2
- **Product readiness verdict:** **ACCEPT (`P=A`)**
- **Design readiness verdict:** **ACCEPT (`D=A`)**
- **Fresh readiness severity ledger:** **C0/H0/M0/L0**
- **Package disposition:** **Held candidate preparation**

This disposition supersedes only the failed Product/Design readiness result above. It does not erase or reinterpret the failed recheck, does not supersede independent QA Round 1, and is not an independent-QA Round 2 verdict. It authorizes the Project Manager to prepare a replacement exact manifest and assign a fresh read-only QA agent; it does not authorize freeze, commit, push, requirement closure, or v18 work.

### Exact repair history after the failed recheck

1. **Compact launcher repair.** The inactive launcher remains in normal document flow but now clears the frozen banner before its first visible pixel. Fresh archive captures at `390×844` and `320×900` report the launcher fully visible, at least `44×44`, focused after archive return, hit-testable at its center and all four inset corners, and intersecting zero visible inherited controls.
2. **Consequence-card repair.** The Current day and Destination day cards now switch to one column at the `1020 px` breakpoint, satisfying the required stacked reading order at the named `960 px` and `1000 px` checks while preserving the wide two-column presentation.
3. **Fresh Design contrast finding.** The first post-layout Design recheck correctly returned a new **Medium** finding: the light-theme `--lid-faint` normal-text token `#727d76` measured only `4.2068:1` against its surface, below the `4.5:1` normal-text floor. No acceptance or deferral was granted.
4. **Contrast repair.** The token was changed to `#6b766e`, measuring `4.650835:1` against the same surface. The final `styles-v17.css` SHA-256 is `dbebc3b92af0fca95fd1f61fcfbe308c320a30df798ff2e2801210f80dddade2`.
5. **Complete final recapture.** After the final CSS bytes, all eight active-state PNG/JSON pairs were recaptured and two archive-launcher pairs were added. The ordered 20-file aggregate, using lexicographically sorted complete `<sha256><two spaces><relative path><newline>` records, is SHA-256 `2b8307f01db583cab9ed324dfc852e6a44a907a28754f3ad4ffc2ac16c5ae296`.

### Fresh Product and Design decisions

- **Product Manager:** `P=A`, fresh **C0/H0/M0/L0**. The repaired launcher is reliably available without covering inherited controls, the two-day consequence presentation preserves meaning in its required responsive order, and the contrast repair changes no product semantics. Product identified no unresolved readiness finding.
- **Expert UI/UX Designer:** `D=A`, fresh **C0/H0/M0/L0**. The final compact launcher geometry, below-`1024 px` card order, target size, focus, light/dark treatment, reduced-motion treatment, forced-colour treatment, and repaired normal-text contrast satisfy the approved v17 experience contract at the bounded prototype level. Design identified no unresolved readiness finding.
- **Project Manager:** `C=A` remains the governing Council approval and `I=A` is restored for the final repaired working candidate. The next gate is replacement-manifest preparation followed by a fresh independent QA Round 2 from zero.

### Exact authority identity at acceptance

| Authority artifact | SHA-256 |
| --- | --- |
| `docs/phase2/PRODUCT-ACCEPTANCE-v17-v35.md` | `9833512ed8dc7358630487cda208c31f7867f4fb1f0bf43ca6a7171044351a84` |
| `docs/phase2/UX-CONTRACT-v17-v35.md` | `d6a505ba6ec137af1bc43d5986c1551a8b5c29e85122ae5ba0adbc24c9182cf6` |
| `docs/prototypes/v17/COUNCIL-v17.md` | `632691dce8d7964944374dc821221ffcf63f4e7b207c8573b81ecd9cec868ec7` |
| `docs/prototypes/v17/ATOMIC-REDATING-FIXTURES-v17.md` | `7f4dfe0f80eedcc150d2a4e1a87ea7264d670d92bdff3de0b5eadd0fde3c443f` |

The four complete checksum records above, sorted lexicographically and hashed as recorded lines, have aggregate SHA-256 `5fd6262e41245421b8e2ee8a11e6a7f88175a2ae5a917c0be060326c4e54f32e`.

### Gate and proof-boundary disposition

- The Round 1 manifest SHA-256 `51f8e49fe588c139d3c542da22833cf9dd2bd840cdac39fe7b6ab1efde570466` and held aggregate `14abca5efb18c2887fb4790a481abe26acafc9674317d6d20a45f093f75e6bbe` remain useful historical identities but are obsolete for the repaired bytes. They must be replaced, not amended or reused.
- `Q=F` remains the historical independent QA Round 1 result. Fresh QA Round 2 is pending and must start only after the replacement candidate manifest is sealed.
- `F=—`. There is no freeze, commit, push, remote readback, or requirement closure from this Product/Design acceptance.
- `LID-SCP-002`, `LID-SRC-003`, and the redating portion of `LID-SRC-004` remain `Open` until independent QA Pass and the required freeze, push, and remote-readback sequence completes.
- The final recheck is bounded to deterministic synthetic frontend behavior in the tested browser/viewports. It does not establish backend atomicity, persistence, concurrency, idempotency, provider behavior, authentication, authorization, encryption, deployment, native zoom, real assistive-technology behavior, formal accessibility conformance, production privacy, or production readiness.
