# Fresh-start decision — 2026-08-20

## What happened

Two independent AI-agent sessions (2026-08-18 and 2026-08-19) spent all their effort building governance machinery — a Candidate-QA layer, then a "Generation 0" multi-agent coordination control plane — and produced zero product code. 137 commits, 466 markdown planning docs, ~5,800 lines of unmerged coordination code, and no rendered journal entry.

Full retrospective and research trail: `archive/generation-0` branch and `gen0-final` tag (both pushed to `origin`, pointing at the old `main` tip `fb59c1f1`). Nothing was deleted — only reset out of `main`.

## Decision

Reset `main` to a fresh root commit. Keep five things as non-authoritative reference notes under `reference/`:

- `CONTEXT.md` — domain glossary (Journal Day vs Journal Date, Source Item, Derived Artifact, the `Asia/Kolkata` rule)
- `PRODUCT-REQUIREMENTS.md`
- `UX-SPECIFICATION.md` + the v10 static prototype (`prototype-v10/`)
- `HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md`
- `PRINCIPLES.md` (extracted from the old README)

Everything else — the Product Council, task dossiers, readiness state machines, the Generation 0 control plane, the 58-item Phase 1 work-package roadmap, `AGENTS.md` — stays archived and is not re-read for this effort.

## Sequence

local build → GitHub (from commit #1) → verify locally → production. GitHub issues labeled `phase2` (prototype visual-design refinement, v1–v35) are left untouched for possible future work. Issues labeled `phase1` (the old P0/R0–R10 governance roadmap) are bulk-closed as not planned, pointing at `gen0-final`.

## MVP definition of done (v0.1)

Open the app locally, see a real month as a calendar grid, click a day, read an actual journal entry with an actual photo attached. No Telegram, no VoiceNotes integration, no AI, no auth, no encryption-at-rest, no Docker/CI, in v0.1 — each is a later increment on something that already works.

See `CLAUDE.md` for the operating rules going forward (no meta-tooling; every session ends with something visible in the browser).
