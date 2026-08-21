# Project rules

## GitHub identity

Always use the `arunpr614` account (`github.com`) for this repository. Never use the `daydreamer614` / toasttab.com (`github.toasttab.com`) account for any GitHub operation in this project — e.g. pass `GH_HOST=github.com` to `gh`, and use the `github.com` remote/credentials for git operations.

This covers the **commit author identity**, not just the API account. Commits in this repository must not carry a `toasttab.com` address. This repo pins the identity locally:

```sh
git config --local user.name  "Arun Prakash N"
git config --local user.email "arunpr614@users.noreply.github.com"
```

Check with `git log -1 --format='%an <%ae>'` before pushing. The two fresh-start commits on `main` (`d85561e`, `53d2e5a`) predate this rule and keep the old address — leave them alone, because rewriting `main` is forbidden below.

## Never force-push `main`

Branch protection blocks force-push and deletion on `main`. Feature branches you own are yours to amend and force-push (prefer `--force-with-lease`).

## No meta-tooling

Do not build validators, registries, ledgers, councils, dossiers, readiness states, or any code whose purpose is to govern this project. If a change doesn't move pixels or data for the single user, don't make it. This project's history (see `archive/generation-0` and the `gen0-final` tag) is a cautionary example of what happens when this rule is ignored: 137 commits and ~5,800 lines of coordination code, zero rendered journal entries.

## Every session ends with something visible

Every commit must leave the app runnable. Every working session should end with something visible in the browser — a real change you can point at, not a plan for one.

## Privacy boundary

Never commit real journals, photos, identifiers, credentials, provider responses, or private URLs. Real data lives under `data/`, which is gitignored. See `reference/PRINCIPLES.md` for the fuller data-handling rules carried over from the original plan.

## Reference material

`reference/` holds notes salvaged from the pre-reset project (`archive/generation-0` / `gen0-final`): domain glossary, product requirements, UX spec, the v10 static prototype, and Hetzner deployment research. Treat it as background reading, not as authority — it describes intent, not a contract to satisfy before writing code.
