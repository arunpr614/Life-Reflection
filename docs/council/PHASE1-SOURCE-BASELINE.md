# Life in Days Phase 1 — source baseline

- **Status:** frozen planning input
- **Baseline date:** 2026-08-14
- **Owner:** Life in Days Product Council

## Purpose

This record identifies the exact artifacts used to create the Phase 1 release plan. It prevents a later prototype or document revision from silently changing the scope of an already-reviewed release.

## Authoritative planning inputs

| Artifact | Role in the council review | SHA-256 |
| --- | --- | --- |
| [Global product requirements](../product/PRODUCT-REQUIREMENTS.md) | Canonical `LID-*` behavior, acceptance, privacy, recovery, and deferred-scope contracts | `9f8ad449a8e3c8f5387a8deb32b1b51b5d8bd0252fd1e1647137e9b981d0aa35` |
| [UX specification](../design/UX-SPECIFICATION.md) | Canonical interaction, responsive, accessibility, state, content, and validation contracts | `1076228160f253cf8d291c8c5884dfecb7bf8883e82b208f181776cf94c68b8e` |
| [v5 prototype entry point](../../prototypes/calendar-ui/index-v5.html) | Frozen UX intent for the council review; not implementation or production evidence | `ced79f43c0e3b8916f029898a6469a8290aa90e9e45c28be7b612c177d4ca17d` |
| [v5 prototype behavior](../../prototypes/calendar-ui/app-v5.js) | Interaction/state fixture behind the v5 prototype | `3e99414a1c3f6cd71047dee6964a26fb502250e1b0061f153f935c397714383d` |
| [v5 prototype presentation](../../prototypes/calendar-ui/styles-v5.css) | Visual and responsive fixture behind the v5 prototype | `64858881f2189d0e919da66e8d17687e17e06dcb8c2e5a4325f65420195b6cd1` |

The user-supplied product-requirements checkout also contained a later uncommitted wording variant with SHA-256 `513a5bc62cdccc0112d8876f6b75915782ce9a4c118f9a8207b1ef588f8edf5c`. Its functional `LID-*` requirements match this public-safe baseline. Phase 1 artifacts use the public-safe wording and do not copy legacy internal-template text.

## Interpretation rules

1. The global PRD defines product behavior. Release PRDs may narrow a milestone but may not weaken a `P0` acceptance contract.
2. The UX specification defines experience behavior. The v5 prototype illustrates intent and may reveal gaps; it does not prove that a feature is built, tested, accessible, secure, or deployable.
3. Existing architecture and tracker documents are planning evidence. A task becomes **Done** only when its named acceptance evidence exists.
4. Proposed dates are planning ranges, not commitments. A failed entry gate moves dependent work; it does not compress privacy, recovery, or quality gates.
5. Real photos and photo-derived data remain outside every AI request path.
6. The release plan is for one private user, fixed `Asia/Kolkata` Journal Dates, prospective capture, and the approved no-sharing/no-coaching MVP boundary.

## Change control

Any change to a source hash, requirement ID, release boundary, or milestone date must update:

- the affected release PRD;
- the council decision record;
- the detailed release backlog and workbook;
- the GitHub issue and Project fields; and
- requirement/design traceability validation.
