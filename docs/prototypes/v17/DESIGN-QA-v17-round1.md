# Life in Days v17 independent design QA — Round 1

- **Package:** `PVA-012 Atomic Redating`
- **Baseline:** frozen v16 commit `01d1f054a12773e07f91096b8d76b0c5f4064329`
- **Independent QA agent:** fresh read-only `/root/qa_v17`
- **Held candidate manifest SHA-256:** `51f8e49fe588c139d3c542da22833cf9dd2bd840cdac39fe7b6ab1efde570466`
- **Held 29-file aggregate SHA-256:** `14abca5efb18c2887fb4790a481abe26acafc9674317d6d20a45f093f75e6bbe`
- **Held at:** `2026-08-19T13:10:49+05:30`
- **Final unchanged rehash:** `2026-08-19T13:28:50+05:30`
- **Round 1 verdict:** **FAIL**
- **Severity counts:** **Critical 0 · High 2 · Medium 3 · Low 0**

This is the durable record of the first independent QA run. The held files and manifest remained byte-identical through the final rehash, but the behavioral and experience findings below fail the approved v17 contract. This candidate is invalidated for freeze or publication. V17 remains open: repair, complete recapture where affected, reseal under a new exact manifest, and a fresh independent QA run from zero are required. No requirement row closes from this round.

## Findings

### H1 — Inherited openings do not preserve exact context, freshness, or initial focus

Inherited `Change Journal Date` controls opened the fixed `Monsoon walk note` fixture instead of the exact invoking context. QA reproduced this from the uploaded journal `evening-rain.txt`, the Voice Journal `Market morning`, and a Daily Photo. After an earlier successful outcome, a later inherited opening also retained the stale success state with **1 archive effect and 1 history event** instead of constructing a fresh ready state at `0/0/0/0`. Initial focus remained on the prior selector instead of moving to the feature `h1`.

This violates the approved LaunchContext, freshness, source-binding, and focus contract. It is a High finding because the UI can attribute a date-change review and prior represented result to the wrong Source Item.

- **Repair owner:** v17 runtime and interaction implementation
- **Disposition:** Fix in v17; Product and Design accepted the finding and approved no deferral.

### H2 — Fixed launcher occludes a frozen archive control

At `1280×720`, the inactive v17 launcher overlaps the frozen v16 **Populated archive** control. The tested launcher center was `(1136.6, 677.4)` inside the archive control rectangle `x=1063.1–1260`, `y=634.5–700`.

This violates the Council requirement that the inactive launcher remain in normal flow and occlude no archive control.

- **Repair owner:** v17 runtime and layout implementation
- **Disposition:** Fix in v17; Product and Design accepted the finding and approved no deferral.

### M1 — Proof console precedes the primary task on medium and compact layouts

The prototype-state/proof console renders before the primary redating task instead of after it. QA measured the console preceding the task by approximately **410 px at 960 px**, **529 px at 568×320**, and **996 px at 390 px and 320 px**.

This reverses the approved task-first visual hierarchy on viewports at and below the `1020 px` reflow boundary.

- **Repair owner:** v17 responsive layout implementation
- **Disposition:** Fix in v17; Product and Design accepted the finding and approved no deferral.

### M2 — Empty-date state is internally incoherent and loses focus

Clearing **New Journal Date** correctly marks the field invalid, but the operation heading remains **Ready for review**, the **Ready** fixture control remains pressed, and focus is lost instead of remaining on the required date field. The expected `date-required` presentation is **Destination required**, with no fixture button pressed and the enabled date field focused.

- **Repair owner:** v17 validation, fixture-selector, rendering, and focus implementation
- **Disposition:** Fix in v17; Product and Design accepted the finding and approved no deferral.

### M3 — Pre-intent Cancel resets the fixture instead of returning to the invoker

From an inherited Source Item dated `2026-08-16`, **Cancel · return to Source Item** reset the destination to `2026-08-17`, remained in the v17 task, and focused the date field. It did not restore the exact invoking control, scroll position, and frozen archive view as the approved safe-exit contract requires.

- **Repair owner:** v17 route-exit and focus-restoration implementation
- **Disposition:** Fix in v17; Product and Design accepted the finding and approved no deferral.

## Checks that passed in Round 1

- The candidate manifest, all listed file hashes, and all eight PNG/JSON evidence pairs were internally consistent and remained unchanged through the final rehash. Evidence chronology was coherent with the held UI bytes.
- JavaScript syntax checks, `check-v17.mjs`, frozen-v16 hash guards, and worktree-diff inspection passed for the held candidate.
- All ten named v17 fixtures and all five natural represented outcomes were reachable, and the tested result cardinality remained zero-or-one.
- Retry, status check, competing-revision, duplicate-delivery, both resulting-day links, unchanged Original Timestamp, and the two-day consequence projection passed their tested paths.
- Tested viewports `1440`, `960`, `568`, `390`, and `320` had no horizontal page overflow. Sample target-size, 13 px metadata, contrast, forced-colors, and reduced-motion checks passed, subject to the limitations below.
- URL, title, browser-history state, local/session storage, IndexedDB, Cache Storage, service-worker, network, and console privacy checks passed for the tested run. Requests remained local to the prototype server.
- Direct frozen-v16 access and stale-copy correction passed. Tested Escape handling and the return-focus path outside the failed pre-intent Cancel case passed.

Passing checks do not override either High finding or any undispositioned Medium finding. The exact Round 1 verdict remains **FAIL**.

## Product, Design, and Project disposition

The Product Manager and Expert UI/UX Designer accepted all five findings as valid against the approved v17 contract. Every finding requires repair in v17; neither role accepted or deferred any item. The Project Manager therefore keeps `LID-SCP-002`, `LID-SRC-003`, and the redating portion of `LID-SRC-004` open, marks QA Round 1 failed, and returns the same unnumbered v17 candidate to repair.

The failed candidate must not enter the freeze/push gate. Any repair changes invalidate the held hashes and evidence affected by those bytes. A repaired candidate requires a complete new hold, manifest, evidence reconciliation, and a fresh independent QA agent/run.

## Test limitations and proof boundary

Round 1 did not verify native browser zoom, a real assistive-technology session, or reliable browser-default Enter/Space activation synthesis. It did not and could not prove backend atomicity, durable persistence, provider behavior, authentication, authorization, encryption, security controls, deployment, production privacy, accessibility conformance, or production readiness. The prototype remains deterministic synthetic browser-memory representation only.

## Repository guard observation

The frozen archive/base guard remained `01d1f054a12773e07f91096b8d76b0c5f4064329`. Separately, the observed `origin/main` reference was `9cfa841257363c28cb76c0d7feed2ae3a37a5023`, a drift from the initialization snapshot outside the v17 candidate. This record does not attribute that external drift and does not claim any v17 mutation of `main`.

## Required next action

Repair all five findings in the same v17 package; rerun current evidence for every affected state and viewport; reseal exact candidate bytes under a new manifest; and assign fresh read-only independent QA from zero. V18 must not start, and v17 must not be committed, pushed, frozen, or marked complete, until that new run passes and the later freeze/readback gates succeed.
