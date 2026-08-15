# AI agent operating contract — keep Phase 1 alive

Updated: 2026-08-14

Scope: this entire repository.

## Non-negotiable rule

The Phase 1 plan is a living control system, not a periodic report. Whenever accepted work changes a task's status, dates, milestone, owner, priority, description, dependencies, requirements, PRD/PID or design links, evidence, rollback impact, or issue mapping, update every affected projection in the **same change**:

1. governing product, design, architecture, decision, and evidence documents;
2. the editable roadmap generator;
3. the generated JSON manifest and Markdown release plan;
4. the repository issues and GitHub Project roadmap, when live mutation is authorized;
5. the public issue map;
6. the Excel release-plan workbook; and
7. the append-only running log.

If live GitHub mutation is not explicitly authorized or cannot be completed safely, finish and validate the local projections, record **Live GitHub sync pending** with the exact reason and next command, and do not claim that the roadmap is synchronized.

## Read before changing delivery state

- [AI-agent resource index](docs/project/AI-AGENT-RESOURCE-INDEX-2026-08-14-15-10-39-IST.md) — orientation snapshot; refresh time-sensitive facts.
- [Document index and authority order](docs/INDEX.md) — current source precedence and reading paths.
- [Phase 1 council decision](docs/council/PHASE1-COUNCIL-DECISION-RECORD.md) — release and evidence boundary.
- [GitHub Project sync runbook](docs/project/PHASE1-GITHUB-PROJECT-SYNC.md) — complete schema, mutation, recovery, and UI instructions.
- [Phase 1 release plan](docs/project/PHASE1-RELEASE-PLAN.md) — human-readable task and evidence model.
- [Security](SECURITY.md) and [Contributing](CONTRIBUTING.md) — publication, synthetic-data, and frozen-evidence rules.

Direct owner instructions outrank repository documents. Do not silently resolve a conflict between authoritative sources; record it in the council decision record and the affected task before proceeding.

## Current bounded P0/R0 authority and artifact naming

The historical Phase 1 P0-to-production Goal is superseded. On 2026-08-15 the Product Owner published the bounded P0/R0 Gold Goal through normal PR #69 and activated it from clean exact main `2dc4d05cdeca8cb9aeacf393076f6c6f946ff62b`. It owns exactly eight P0/R0 task records, freezes all 50 R1-R10 tasks, and currently authorizes only Stage 0 local/public control-plane repair under existing issue #3. It does not itself authorize an R0 action, private access, authentic content, deployment, release, or production. The governing sources are:

- [`P0-PHASE1-EXECUTION-AUTHORIZATION.md`](docs/council/execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md);
- [`P0-PHASE1-EXECUTION-COUNCIL-CHARTER.md`](docs/council/execution/P0-PHASE1-EXECUTION-COUNCIL-CHARTER.md);
- [`P0-PHASE1-EXECUTION-DECISIONS.md`](docs/council/execution/P0-PHASE1-EXECUTION-DECISIONS.md); and
- [`P0-OWNER-ACTION-LEDGER.md`](docs/council/execution/P0-OWNER-ACTION-LEDGER.md); and
- [`P0-CODEX-GOLD-GOAL-PROMPT-P0-R0-ONLY-2026-08-15.md`](docs/project/P0-CODEX-GOLD-GOAL-PROMPT-P0-R0-ONLY-2026-08-15.md).

Every one of the 58 canonical tasks is also governed by the [P0 task Definition of Ready](docs/council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md) and [task artifact register](docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json). The current baseline is exactly **58 Incomplete; 45 Hold + 13 Historical non-authorizing; 0 Ready; 0 execution-allowed**. For the five substantive R0 tasks, Gate A may later permit only preparation of one named local/public/fictional/synthetic candidate; `preparationAllowed` can never substitute for `executionAllowed`. Gate B requires a later exact implementation/evidence candidate, one immutable stage and scope/action pair, independent executed QA, rollback evidence, current dependencies and owner actions, exact environment/authority where due, five exact-candidate seats, append-only stage publication, and exact-main guarded runtime verification. Historical AUD-001, PC-001, and PRD-R0-001 can never become execution stages. Roadmap status, code, a prototype, a shared PRD, a global plan, a control review, or Gate A cannot override Gate B.

The bounded activation changes no implementation, test, deployment, recovery, or production evidence by itself. Routine R0 decisions are delegated to the five-seat execution council only when every named stage gate passes. R1-R10 work is frozen and out of scope. Human-only account/MFA/secret, terms/spend/provider, authentic-content, authentic-photo UAT, recovery-key, Recovery Ceremony, final R9, and irreversible R10 acts remain non-delegable.

Every newly created document or evidence/build artifact must have a basename beginning `P0-`. Existing canonical files, generated outputs, stable IDs, frozen v6–v10 artifacts, runtime/config filenames, and `RUNNING_LOG.md` are grandfathered; edit them under normal change control rather than renaming or duplicating them.

Before any private host/provider/tunnel/backup/production read or mutation, require the complete private deployment-authority record. Until then, use the exact state **Unknown — private read authority pending** and continue only local/public/synthetic work.

## Authority and projection chain

```text
approved evidence, task state, and governing documents
                |
                v
tools/P0-generate-task-artifacts.mjs         <- source-only readiness state + reviewer/approval/action registries
                |
                +--> docs/work-items/<TASK-ID>/P0-<TASK-ID>-*.md
                +--> docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json
                |
                v
tools/generate_phase1_roadmap_manifest.mjs   <- edit releases/tasks; status comes from the P0 task-state ledger
                |
                +--> docs/project/PHASE1-ROADMAP-MANIFEST.json
                +--> docs/project/PHASE1-RELEASE-PLAN.md
                |
                v
repeat both generators and reject byte drift
                |
                v
tools/sync_phase1_github.mjs                 <- clean exact origin/main only
                |
                +--> mismatched bodies on the existing 58 issues
                +--> mismatched values in the existing 58 Project items / 17 managed fields
                |
                v
tools/build_phase1_release_plan.mjs
                |
                +--> task-scoped review workbook
                +--> outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx
```

The generated [roadmap manifest](docs/project/PHASE1-ROADMAP-MANIFEST.json) is the canonical machine-readable delivery contract. It is not the editing surface. Readiness input is source-only: never set `artifactReadiness`, `executionDecision`, `executionAllowed`, aggregate dependency/authority/action satisfaction, blockers, or next action. The evaluator derives them, the validator independently rebuilds all 58 inputs and compares every projection, and the runtime verifier repeats the decision at actual start time. Update source files and run both generators twice; never hand-edit only the register, manifest, generated Markdown plan, live GitHub fields, issue map, or workbook.

## Status and evidence policy

Use only `Backlog`, `Next`, `In progress`, and `Done`.

| Status | Required meaning |
| --- | --- |
| Backlog | Scoped, but not selected for immediate execution. |
| Next | Entry conditions are being prepared; a named dependency or gate still controls start. |
| In progress | Actual work has begun and linked evidence exists; exit criteria remain incomplete. |
| Done | The task's named `acceptanceEvidence` exists and is linked. |

Apply these rules strictly:

- Evidence precedes status. Never promote a task because of intention, elapsed time, code existence, a PR merge, a prototype/demo, or a backup upload alone.
- A planning or product-definition task marked Done proves only its named planning artifact. It does not prove implementation, testing, deployment, production readiness, or release acceptance.
- Implementation, persistent-data, QA, and release tasks need the applicable merged implementation, tests, migration, restore, rollback, defect-gate, and owner-acceptance evidence named by the task.
- Prototype evidence is design intent unless the task explicitly asks for prototype evidence. It cannot close an implementation or release task.
- GitHub issue open/closed state and Project Status are separate. The current sync tool cannot change either; any future state/status mutation needs a separately reviewed and authorized control change.
- Planned dates are estimates. Evidence gates control entry and exit.
- Keep R10 release and task dates blank until its measured storage trigger is explicitly approved.

Never conflate the state vocabularies. Task status is `Backlog`, `Next`, `In progress`, or `Done`; artifact readiness is `Incomplete` or `Ready`; execution decision is `Hold`, `Historical non-authorizing`, or a gate-specific readiness decision; issue state is `Open` or `Closed`; permission is the separate boolean `executionAllowed`; and a control review can be only `Hold` or `Accepted for merge`. Stage state is separately one of `declared`, `ready`, `running`, `verification-pending`, `recovery-required`, `rolling-back`, `verified-complete`, `verified-rolled-back`, `cancelled-before-mutation`, `blocked-no-mutation`, or `expired-before-mutation`. Never display an unqualified `Ready`, `Approved`, `Complete`, or `Done`. A verified stage does not make its task Done without the task's named acceptance evidence and reviewed delivery transition.

## Mandatory update workflow

### 1. Preflight and evidence

Work in a clean, isolated worktree. Preserve unrelated changes.

```sh
git status --short --branch
git diff --check
```

Read the affected issue, manifest task, dependencies, acceptance evidence, release PRD/PID, design and architecture links, and current GitHub state. Link durable evidence; do not paste secrets, personal content, or raw private-service responses.

### 2. Update the authoritative inputs

Update the governing source document or decision record first. Then edit the generator's release/task definition, status, dates, dependencies, requirements, links, evidence, and rollback impact as needed.

On every accepted planning refresh, update the generator's `generatedAt` literal and the workbook builder's generated-on subtitle date to the actual refresh date. Keep those two dates aligned; do not change release/task dates without evidence and approval.

Do not renumber a stable task or requirement ID casually. A scope change must update every validator and traceability artifact deliberately.

### 3. Regenerate and run the safe dry-run

```sh
node --check tools/generate_phase1_roadmap_manifest.mjs
node --check tools/P0-generate-task-artifacts.mjs
node --check tools/P0-validate-execution-controls.mjs
node --check tools/sync_phase1_github.mjs
node --check tools/build_phase1_release_plan.mjs

node tools/generate_phase1_roadmap_manifest.mjs
node tools/P0-generate-task-artifacts.mjs
node tools/generate_phase1_roadmap_manifest.mjs
node tools/P0-validate-execution-controls.mjs
node tools/sync_phase1_github.mjs
```

The sync command is dry-run by default: it starts no `gh` process and writes no file. Review the complete plan and correct source drift before any mutation.

The task-artifact generator creates missing artifacts, preserves existing specialist content, and recomputes the register. Use `--refresh-drafts` only for an explicitly reviewed bootstrap/remediation rewrite; it may replace every still-draft task artifact and therefore must not be used casually after specialist drafting starts. It never replaces non-draft artifacts.

Validate the generated contract dynamically; status counts must match the current manifest rather than a historical snapshot:

```sh
jq -e '
  (.releases | length) == 12 and
  (.tasks | length) == 58 and
  (.requirementMap | length) == 78 and
  ([.tasks[].id] | length) == ([.tasks[].id] | unique | length) and
  ([.tasks[].status] - ["Backlog", "Next", "In progress", "Done"] | length) == 0 and
  ([.releases[] | select(.id == "R10" and (.startDate != null or .targetDate != null))] | length) == 0 and
  ([.tasks[] | select(.milestone == "R10" and (.startDate != null or .targetDate != null))] | length) == 0
' docs/project/PHASE1-ROADMAP-MANIFEST.json
```

### 4. Synchronize GitHub only with explicit authority

Use the least expansive mode that covers the accepted delta. The live target is [Life Reflection Project #1](https://github.com/users/arunpr614/projects/1).

```sh
# Confirm the active account without printing a token:
gh auth status --hostname github.com

# Read-only Project access on a new credential:
gh auth refresh -h github.com -s read:project

# Approved Project mutation on a new credential; do not run both refreshes:
gh auth refresh -h github.com -s project

# Repository issues and milestones are already correct; update only mismatched values in existing Project fields:
node tools/sync_phase1_github.mjs --apply --project-only

# Update only mismatched bodies on the existing 58 issues:
node tools/sync_phase1_github.mjs --apply --issues-only
```

Every apply first fetches canonical origin and requires a clean non-detached branch tracking `origin/main` with exact `HEAD === origin/main`. Plain `--apply` may update only mismatched existing issue bodies and existing Project field values after the complete preflight. It cannot create or reconfigure issues, items, fields, views, labels, milestones, or workflows, and it cannot change issue state/status/labels/milestones.

Keep the stable `[TASK-ID]` prefix and hidden task marker on every managed issue; the sync uses the public issue map plus those signals as identity and refuses ambiguous or drifted issues. Managed issue bodies are source projections, so put durable evidence and metadata in the governing documents and generator rather than relying on manual issue-only edits.

Do not use full sync for a Project-only change. After any authorized delta apply, verify immediately and again after two consecutive read-only snapshots show no further relevant issue or Project workflow changes; an immediate pass alone can precede asynchronous automation. A partial failure can still leave drift because GitHub mutations are not transactional.

The operation is idempotent by stable task ID but is not transactional. On an API or network failure, stop, inspect the partial state, fix the authoritative source or access problem, and rerun the appropriate idempotent mode. Never claim synchronization until a read-only reconciliation passes. Deletion of an issue, milestone, field, option, item, or view is a separate destructive action and needs explicit authorization.

### 5. Refresh generated links and rebuild Excel

The existing-only apply never rewrites [`PHASE1-GITHUB-ISSUES.json`](docs/project/PHASE1-GITHUB-ISSUES.json); the complete preflight requires that map to match before the first mutation. Rerun the manifest generator after an authorized source change, but do not claim or fabricate an issue-map refresh unless a separately authorized issue-identity change actually occurred:

```sh
node tools/generate_phase1_roadmap_manifest.mjs
```

For the workbook, use the installed `spreadsheets:Spreadsheets` skill and follow it fully: load the workspace dependency runtime, use only its Node and `node_modules`, prepare the untracked working-directory dependency link it prescribes, and run its artifact-operation marker exactly once immediately before the first workbook edit. This builder writes two `.xlsx` copies, so use operation kind `edit` and expected output count `2`. Do not install a replacement spreadsheet library, modify the provided dependency directory, or manually edit the generated `.xlsx`.

```sh
workbook_run_id="P0-$(date +%Y%m%d%H%M%S)"
node tools/build_phase1_release_plan.mjs "$workbook_run_id"

shasum -a 256 \
  "outputs/$workbook_run_id/P0-Life-in-Days-Phase1-Release-Plan.xlsx" \
  outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx
```

The builder must report 12 releases, 58 tasks, 78 requirements, and zero formula errors. Its built-in inspection and previews are smoke checks over leading ranges, not proof of the complete workbook. Use the spreadsheet skill to inspect every used row and formula, confirm all 58 issue URLs and all R10 blanks programmatically, and render additional paginated ranges so every task, release, requirement, risk, and guide row is visually covered. Inspect `/tmp/life-in-days-phase1-workbook-$workbook_run_id/workbook-inspect.txt` and the built-in preview for each sheet as part of that full review:

1. Executive Summary
2. Release Plan
3. Roadmap Tasks
4. Roadmap Timeline
5. Requirement Map
6. Risks & Gates
7. Review Guide

Reject the workbook if a formula error, clipping, broken layout, stale issue URL, incorrect count, or R10 date appears. The resolved Review Guide must contain exactly one visible `Source manifest SHA-256` label/value whose digest equals the raw current manifest bytes. The task-scoped and canonical workbook hashes must match. Only `outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx` is the stable public copy; task-scoped exports are local review artifacts covered by `.gitignore` when their directory begins with at least four hexadecimal characters.

### 6. Reconcile the live control surfaces

After an authorized apply, run read-only checks:

```sh
gh project view 1 --owner arunpr614 --format json
gh project field-list 1 --owner arunpr614 --limit 100 --format json
gh project item-list 1 --owner arunpr614 --limit 100 --format json
gh issue list --repo arunpr614/Life-Reflection --state all --limit 100 \
  --json number,title,state,labels,milestone,url
```

Compare, do not merely count. Require one issue-backed Project item for every manifest task and exact agreement for title, body, labels, milestone, issue state, all 17 managed Project fields, six dossier links and hashes, readiness, execution scope, and explicit execution authorization. The raw Project can contain separately filtered PR records, so it need not total 58; the two delivery views must contain exactly the manifest's current 58 `phase1` issues.

These CLI commands are discovery dumps, not the pass/fail result. Use `node tools/sync_phase1_github.mjs --verify` for the reusable read-only live-parity check, then retain only its sanitized counts and mismatch list. Do not repeat the historical “580 checks” claim; the current contract manages 17 fields and must be verified from the current merged revision.

Open GitHub and visually verify the UI-only settings:

- **Phase 1 Status:** board layout, grouped into Backlog / Next / In progress / Done by Status, with all planning fields visible.
- **Phase 1 Roadmap:** roadmap layout, grouped by Milestone, Start date and Target date driving bars, Month zoom, and no optional marker unless approved.
- Both views show the current manifest status distribution and no non-delivery issue.
- R10 has no milestone due date, Start date, or Target date.

### 7. Record and commit the complete projection

Append an evidence-focused entry to [`RUNNING_LOG.md`](RUNNING_LOG.md). State what changed, which sources were updated, whether GitHub was mutated, exact validation performed, and any pending external sync. Do not rewrite prior log entries.

Before handing off:

```sh
git status --short
git diff --check
git diff --stat
```

Commit the source change and all regenerated tracked projections together. Do not push, open a pull request, deploy, or mutate another external system unless the user explicitly authorizes it.

Generated issue and artifact links target `main`. Do not claim publication is complete until every referenced path exists on remote `main`; a local commit or feature-branch file is not enough.

## Current tool limitations — fail closed

- `acceptanceEvidence` describes the evidence required; it is not itself proof. Before `In progress` or `Done`, record retrievable evidence links in the task dossier and affected issue or decision record, then review them manually. Never let status logic or `executionAllowed` substitute for semantic review.
- Live apply first fetches canonical origin and requires a clean non-detached branch tracking `origin/main` with exact `HEAD === origin/main`. It then resolves all existing issues, items, fields, and views before the first mutation. It may change only mismatched issue bodies and existing field values; issue/item/field/view/workflow creation and status/state/label/milestone mutation fail closed.
- The dry-run validates local shape but does not query live GitHub. A successful dry-run is not live reconciliation.
- Workbook acceptance requires whole-workbook programmatic inspection plus all 20 paginated renders and an exact visible raw-manifest SHA-256 binding in the resolved Review Guide. Same-build canonical/review copies must hash equally; an isolated rebuild is compared by sheet/order/used-range/cell/formula/link/count/R10/render semantics rather than OOXML ZIP packaging bytes. CI also requires every one of the 352 canonical generated targets to remain a tracked, present, clean regular `100644` Git blob.
- `generatedAt` and the workbook subtitle date are literals. Update both during every accepted refresh until the builder derives its date from the manifest.

Treat these as known controls, not optional improvement ideas. If the compensating check cannot be completed, leave the task blocked and state which tool gap prevented trustworthy synchronization.

## Current GitHub automation hazard

The 2026-08-14 P0 publication reconciliation verified that both delivery views now use `repo:arunpr614/Life-Reflection is:issue label:phase1`; the Status board remains grouped by Status and the Roadmap remains grouped by Milestone. Two quiescent read-only verifier snapshots returned zero mismatches. Project #1 still has workflows that can auto-add open issues/PRs and sub-issues, set Backlog on add, set Done on close, and close items moved to Done. The reviewed API does not expose their complete filters and effects, and the P0 publication did not change them.

Therefore:

- Do not create unrelated or Wayfinder issues until an authorized hardening change narrows the Project auto-add/workflow boundaries to `label:phase1`, or places those issues in a separate Project. Saved-view narrowing is complete but does not satisfy the workflow gate.
- View filtering alone is not containment; hidden items can still affect shared Status, closure automation, raw Project state, and Insights.
- After any issue creation, confirm that only canonical `phase1` delivery issues feed the two delivery views and delivery workflows.
- Do not change workflow rules casually; audit their filters and effects, preserve unrelated behavior, and verify the full projection afterward.

## Privacy and claim boundaries

The repository and repository issues are public even though Project #1 is private.

Before any live apply, manually review every changed task description, evidence requirement/link, rollback/restore statement, and artifact URL exactly as it will appear in a public issue. Then scan unstaged, staged, and untracked text; any match requires investigation and sanitization, not blind deletion:

```bash
safety_pattern='(/(Users)/|/var/(folders)/|file[:]//|github[_]pat_|gh[pousr]_[A-Za-z0-9]{20,}|sk[-_][A-Za-z0-9_-]{12,}|Bearer[[:space:]]+[A-Za-z0-9._-]{12,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,}|BEGIN[[:space:]].*PRIVATE[[:space:]]KEY|PVT[A-Z_][A-Za-z0-9_]+)'

umask 077
safety_scan_dir="$(mktemp -d)" || {
  echo 'Could not create the protected safety-scan directory.' >&2
  exit 1
}
trap 'rm -r -- "$safety_scan_dir"' EXIT

git diff --no-ext-diff -- . >"$safety_scan_dir/unstaged.diff" || {
  echo 'Could not materialize the unstaged diff for safety scanning.' >&2
  exit 1
}
git diff --cached --no-ext-diff -- . >"$safety_scan_dir/staged.diff" || {
  echo 'Could not materialize the staged diff for safety scanning.' >&2
  exit 1
}
git ls-files --others --exclude-standard -z >"$safety_scan_dir/untracked.z" || {
  echo 'Could not enumerate untracked files for safety scanning.' >&2
  exit 1
}

for diff_kind in unstaged staged; do
  diff_scan_status=0
  rg --no-messages -q "$safety_pattern" "$safety_scan_dir/$diff_kind.diff" || diff_scan_status=$?
  if [ "$diff_scan_status" -eq 0 ]; then
    echo "Potential sensitive value detected in $diff_kind changes; inspect in a protected local workflow." >&2
    exit 1
  elif [ "$diff_scan_status" -gt 1 ]; then
    echo "$diff_kind safety scan failed." >&2
    exit "$diff_scan_status"
  fi
done

untracked_scan_failed=0
while IFS= read -r -d '' candidate_file; do
  candidate_scan_status=0
  rg --no-messages -I -q "$safety_pattern" -- "$candidate_file" || candidate_scan_status=$?
  if [ "$candidate_scan_status" -eq 0 ]; then
    untracked_scan_failed=1
    break
  elif [ "$candidate_scan_status" -gt 1 ]; then
    echo 'Untracked-file safety scan failed.' >&2
    exit "$candidate_scan_status"
  fi
done <"$safety_scan_dir/untracked.z"

if [ "$untracked_scan_failed" -ne 0 ]; then
  echo 'Potential sensitive value detected in an untracked file; inspect in a protected local workflow.' >&2
  exit 1
fi
```

These checks deliberately print no matching line or filename, because the match itself may be sensitive. A clean regex scan cannot prove the absence of personal content, private URLs, or sensitive topology. Human semantic review remains required; never paste a detected value into a task log while investigating it.

- Never publish authentic journals, photos, photo-derived descriptions, personal identifiers, credentials, tokens, browser state, private URLs, host topology, private Project node IDs, or raw provider/service responses.
- Never send real photos or photo-derived data to an AI provider.
- Use fictional fixtures and sanitized evidence only.
- Never claim that a feature was tested, deployed, restored, production-verified, or released without direct named evidence.
- Keep implementation, deployment, publication, and live GitHub authorization separate.

## Definition of complete

A roadmap-affecting change is complete only when:

- governing evidence and the editable generator agree;
- manifest, Markdown plan, issue map, live GitHub projection where authorized, and Excel workbook agree;
- status/evidence language is truthful and status counts match the current manifest;
- issue links and all Project fields reconcile by stable task ID;
- the two saved views and their UI-only settings pass visual inspection after live changes;
- R10 remains undated unless its trigger is approved;
- workbook formulas, all seven visual previews, and both output hashes pass;
- privacy and publication scans are clean;
- `RUNNING_LOG.md` records the result and any pending sync; and
- the agent reports local-only, committed, pushed, and live-mutated state precisely.

If any one of these checks fails, the living plan is not synchronized. Fix it or leave a precise blocker; never paper over drift.
