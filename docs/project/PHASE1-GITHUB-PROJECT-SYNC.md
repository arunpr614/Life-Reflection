# Phase 1 GitHub Project V2 sync

Status: current R0-only control contract as of 2026-08-16; all R1-R10 tasks/artifacts are frozen and out of scope until a new direct Product Owner activation; the 2026-08-14 publication reconciliation below remains historical evidence

Target: <https://github.com/users/arunpr614/projects/1>

Canonical source: [`PHASE1-ROADMAP-MANIFEST.json`](./PHASE1-ROADMAP-MANIFEST.json)

Tool: [`sync_phase1_github.mjs`](../../tools/sync_phase1_github.mjs)

## P0 live reconciliation — 2026-08-14

The P0 control package was merged through [PR #64](https://github.com/arunpr614/Life-Reflection/pull/64). Clean fetched source, `origin/main`, and remote `main` all resolved to merge commit `dbd497b496c0bfb982d67a61d6b93ab29d7c59ad`; published head `a3701d2d3e14d7c87b39f9c30a26a03d098292cf` is its ancestor. Five-seat review binds exact candidate `1391bea9abcc899aefcad446324d7c0a2b0199c2`; the published head has the same tree except for the append-only running-log and P0 control-review attestation updates.

The live update was deliberately split into least-expansive stages:

1. Retain sanitized rollback snapshots for all 58 issues, 12 milestones, Project items, fields, and complete view configurations.
2. Run the then-supported `--apply --project-only --skip-views` bootstrap command to create/populate the required task fields and reconcile all 58 issue-backed items without touching issue content or saved views. That creation-capable mode is historical and is not present in the current tool.
3. Apply **Phase 1 Status** and **Phase 1 Roadmap** separately, verifying between mutations. Both now use `repo:arunpr614/Life-Reflection is:issue label:phase1`; Status remains a board grouped by Status and Roadmap remains grouped by Milestone.
4. Review an issue-only dry run, then run the then-supported `--apply --issues-only` path without the optional close flag. This updated the 58 existing issue bodies and changed only issue titles #22 and #24 from Timeline to Almanac. The current tool no longer accepts any issue-state mutation flag.
5. Run `--verify` twice with a 15-second quiescent interval.

The final verified state is:

- 58 unique managed issues and 58 issue-backed Project items;
- 45 issues open and 13 closed, unchanged by the P0 synchronization;
- 40 Backlog, 4 Next, 1 In progress, and 13 Done;
- exactly five expected labels and six task-bound P0 dossier links on every issue;
- all 58 issues assigned across the expected 12 milestones, with R10 still undated;
- 986/986 managed field comparisons passing: 17 fields across 58 tasks;
- 58 `Incomplete`, zero `Ready`, and zero tasks/issues with `executionAllowed=true`; and
- two 437-byte verifier outputs, captured at 23:30:14 and 23:30:35 IST, each with `passed: true` and `mismatchCount: 0`; the files are byte-identical at SHA-256 `4f94bf15d12ef1bfbdb2eda1679ec1ae836d301af8ef74109e5c6e67c1c2ccfc`.

The first Status-view apply attempt failed before mutation because seven target fields did not yet exist. The safe recovery was to populate Project fields first, then apply each saved view separately. The reconciliation created or deleted no issue, changed no issue state, changed no Project workflow, and wrote no private content. The package remains a planning/control publication; it is not implementation, deployment, recovery, or production evidence.

## PC-001 Gate C reconciliation — 2026-08-15

The bounded readiness-control implementation followed the reviewed three-stage sequence. Gate A planning merged through [PR #66](https://github.com/arunpr614/Life-Reflection/pull/66) at `2fc31ec905f4c664b86bebdc511a87390a24a4e9`. Five independent seats approved exact Gate B implementation candidate `946a36e2e68796f4c7a0cd2156103fbd1416302d`, canonical dossier `sha256:1facc3894f745ab695d52d61fb034f6c7c42ae82cc810d0778095d4e28787dd6`, and review context `8efcd458442920dc0a9f050c691d677ec2c811e502dfb9555ae0c6c393a198b8` with no vetoes. Audit-only registry commit `6bf7da157220f59cb0fab6e07d0bf783e8b4265b` preserved those exact attestations without creating a task approval, and [PR #67](https://github.com/arunpr614/Life-Reflection/pull/67) merged normally at `0694e7ad548d15132171d7c910ce35d8bc05a4bc` with required checks passing.

From a clean non-detached branch tracking exact merged `origin/main`, the reviewed apply had canonical delta digest `sha256:2b34c39c849ced1b92c79d77762fc000ab66ed1884f93592ed4b1a52a36f648e` and changed only:

- 58 existing issue bodies; and
- 174 existing Project values: `Execution scope`, `Evidence`, and `Task summary` for each of the 58 issue-backed items.

The apply created no issue or Project item, changed no issue state/status/label/milestone, created or reconfigured no field/view/workflow, and did not rewrite the public issue map. Its built-in post-apply parity passed. Two later, separately invoked `--verify` reports are byte-identical at SHA-256 `2e3cc06bac969760809a12e4aef28d1e3fcb082207139fc5efa0c12b77bbe710`; both bind source `0694e7ad548d15132171d7c910ce35d8bc05a4bc`, report `passed: true`, and have `mismatchCount: 0`. The resulting Project distribution remains 40 Backlog / 4 Next / 1 In progress / 13 Done; issue state remains 45 open / 13 closed.

Wiki publication is separate from issue/Project parity. Wiki commit `25f438faa2adc57d42f62ef139a9f615de57af99` was pushed normally from two byte-identical builds of the same merged source. A fresh clone was clean, contained exactly 456 generated files, and matched the build byte-for-byte. `Page-Audit.md` has SHA-256 `e0799bf18967e9c264547f729de4daf6e8a84d7ca8582d24a9ad0a1304b8a8b7`, identifies source `0694e7ad548d15132171d7c910ce35d8bc05a4bc`, maps all 450 Markdown sources exactly once, and records zero preserved live-only pages.

This evidence establishes local/public control publication and planning-surface parity only. All 58 dossiers remain Incomplete, all 342 non-PC artifacts remain Draft, all six PC-001 artifacts remain In review, and zero tasks are Ready or execution-authorized. No R0 implementation, private-system read, authentic-media access, credential use, deployment, release, or production operation occurred.

## Decision

Use the manifest-driven script only to reconcile the existing canonical 58 issues and 58 Project items. Dry-run remains the default. Every real mode first captures exact manifest/issue-map bytes and runs the local structural validator across that guarded snapshot; failure stops live modes before fetch or `gh`. Only a passing live `--apply` then fetches canonical origin and requires a clean non-detached branch tracking `origin/main` with exact `HEAD === origin/main`. It resolves all 58 issues/items, all 17 managed fields, and both saved views before the first mutation. Any source drift, missing identity, item, field, option, or view fails closed.

The current apply boundary permits only mismatched issue-body and existing Project-field-value updates. Before the first mutation, before every issue or Project target mutation, and after automatic parity, it re-fetches canonical `origin/main` and requires the checkout, upstream, clean state, manifest bytes, and issue-map bytes to remain bound to the original verified source revision. Immediately before each issue write it also re-reads and compares the complete issue snapshot; immediately before each changed Project item it re-queries and compares all managed field values. Source or target drift aborts before that target is written. It creates no issue/item/field/view/workflow, changes no issue state/status/label/milestone, reconfigures no Project definition, and never rewrites the issue map. Every issue and item still projects the six task-bound P0 artifacts; shared release/global documents remain inputs rather than task approval.

The script verifies, but does not create or update, two saved views by exact name, layout, and filter:

| View | Layout | Verified API configuration |
| --- | --- | --- |
| Phase 1 Status | Board | Exact Phase 1 issue filter only; visible fields and grouping remain UI-managed and are not verified by this tool |
| Phase 1 Roadmap | Roadmap | Exact Phase 1 issue filter only; selected date fields and Milestone grouping remain UI-managed and are not verified by this tool |

The established Status board was historically configured with 18 visible fields: Status, Milestone, Start date, Target date, Priority, Owner role, PRD / PID, Design artifact, Architecture plan, QA plan, Delivery control, Council decision, Task dossier, Artifact readiness, Execution scope, Requirement IDs, Evidence, and Task summary. The current verifier does not query or attest that visible-field configuration. It also does not attest board grouping, roadmap grouping, or selected roadmap date fields. Those UI-managed settings require a separate read-only UI review before any claim about them.

## Evidence boundary

The earlier live apply and independent read-only reconciliation on 2026-08-14 established the following historical baseline. It does not prove current parity after later local changes:

- GitHub CLI 2.94.0 is installed and includes `gh project` field/item commands.
- The credential initially lacked Project access; it was subsequently refreshed outside this spike and now has `project`. The smallest direct Project query succeeds.
- Sanitized live metadata confirms Project #1 is linked to `arunpr614/Life-Reflection` and had 25 GraphQL-visible fields at the historical baseline. All 11 then-required board fields—including built-in Milestone—existed with the expected types. The current P0 reconciliation has since created/populated every required task-readiness field and verified all 17 managed fields for all 58 tasks. Status has exactly Backlog, Next, In progress, and Done.
- The authorized apply created or synchronized 58 issue-backed Phase 1 items and 12 milestones; issue state is 45 open and 13 evidence-backed Done/closed. A later owner-requested cleanup removed the eight initial-spike `[PVA-001]` through `[PVA-008]` drafts and the template `Monthly roadmap`, `Quarterly roadmap`, and `Backlog` views. The Project now contains the 58 canonical issues and separately filtered merged pull-request records, with no draft items; only the canonical **Phase 1 Status** and **Phase 1 Roadmap** views remain.
- At the earlier baseline, every task matched its issue title, body, labels, milestone, state, Project item, and the ten then-managed Project field values: 580 field-value checks with zero mismatches. The P0 reconciliation above supersedes that historical count with 986/986 current managed-field comparisons. Status is exactly 40 Backlog, 4 Next, 1 In progress, and 13 Done. R10 has no milestone due date or task dates.
- **Phase 1 Status** and **Phase 1 Roadmap** were observed with the broad `repo:arunpr614/Life-Reflection is:issue` filter. That historical filter must not be described as Phase 1 containment: the current canonical filter is `repo:arunpr614/Life-Reflection is:issue label:phase1`. The board grouping and roadmap date/grouping settings remain UI-managed.
- The first saved-view attempt exposed a live compatibility failure: the published user-owned `POST /users/{user_id}/projectsV2/{project_number}/views` route returned 404 with API version `2026-03-10`. The idempotent recovery used the live GraphQL view mutations and succeeded without deleting or duplicating existing content.
- Live GraphQL schema introspection shows `createProjectV2View`, `updateProjectV2View`, and `deleteProjectV2View`. `CreateProjectV2ViewInput` accepts name, layout, project ID, and visible-field configuration. `UpdateProjectV2ViewInput` additionally accepts a filter. Neither input exposes grouping or roadmap date-field selection.
- The canonical manifest, public issue map, and both workbook copies were regenerated with the 58 live issue URLs. The map intentionally retains no private Project item, field, account, or view node IDs. This evidence validates planning synchronization only; it does not claim application implementation, Hetzner readiness, deployment, or release acceptance.

## Smallest authorization refresh

For read-only inspection only:

```bash
gh auth refresh -h github.com -s read:project
```

For the actual sync:

```bash
gh auth refresh -h github.com -s project
```

`project` is the smallest additional OAuth scope that covers both Project V2 queries and mutations; it subsumes the read-only Project access needed by the preflight. The existing repository authorization is still needed to create or update issues. This runbook assumes the GitHub CLI's current authenticated user token.

The current CLI credential now has `project`; the refresh commands above remain the minimum-scope recipe for another workstation or replacement credential.

Do not run both refresh commands. Use `read:project` for a read-only audit or `project` for an approved apply.

## Exact read-only queries

Query Project #1 without printing item content:

```bash
gh api graphql \
  -f query='query($login:String!,$number:Int!){user(login:$login){projectV2(number:$number){id number title url}}}' \
  -f login='arunpr614' \
  -F number=1
```

Equivalent current CLI discovery:

```bash
gh project view 1 --owner arunpr614 --format json
gh project field-list 1 --owner arunpr614 --limit 100 --format json
gh project item-list 1 --owner arunpr614 --limit 100 --format json
```

The script uses cursor-paginated GraphQL queries with `totalCount` reconciliation for Project items, fields, and views, so pull-request growth cannot hide items behind a fixed CLI limit and the tool does not rely on the 100-record CLI examples.

## Intended Project schema

| Field | Type | Values/source |
| --- | --- | --- |
| Status | Single select | Backlog, Next, In progress, Done |
| Start date | Date | `task.startDate`; cleared for trigger-gated R10 |
| Target date | Date | `task.targetDate`; cleared for trigger-gated R10 |
| Priority | Single select | High, Medium, Low |
| PRD / PID | Text | task-bound `task.taskPrdUrl`; parent release PRD/PID remains linked in the issue |
| Design artifact | Text | task-bound `task.taskDesignUrl` |
| Architecture plan | Text | task-bound `task.taskArchitectureUrl` |
| QA plan | Text | task-bound `task.taskQaUrl` |
| Delivery control | Text | task-bound `task.taskDeliveryUrl` |
| Council decision | Text | task-bound `task.taskCouncilUrl` |
| Task dossier | Text | newline-separated URLs for all six task-bound artifacts |
| Artifact readiness | Text | `task.artifactReadiness` |
| Execution scope | Text | two lines: derived `Execution allowed: No|Yes`, then canonical `Scope: ...` |
| Requirement IDs | Text | comma-separated `task.requirementIds`, or `Planning-only` |
| Evidence | Text | exact ordered lines: `Control validation: Passed|Failed`, `Candidate revision`, `Dossier digest`, `Required evidence`, bounded `References: <count> linked in the issue/dossier`, and `Remaining limitation`; exact reference URLs remain in the issue/dossier and validation never substitutes for permission |
| Owner role | Text | `task.ownerRole` |
| Task summary | Text | exact order: `Roadmap status` (`Planning Done — historical` for Done), task description, `Blockers` count plus deterministic first-eight code preview, and `Next action`; the linked issue/dossier retains the complete set |

Every generated Text value is asserted at 1,000 characters or fewer before a dry-run or apply can proceed; the longest current Requirement IDs value is 901 characters. The script does not silently truncate a field value.

When a required field, option, item, or view is absent or type/configuration drifted, current apply fails before mutation. Field/view/workflow creation or reconfiguration requires a separately reviewed `P0-OA-002`-compatible control change; it is not a recovery behavior of this sync.

## Exact item and field commands

The creation commands below document the historical bootstrap API only. The current existing-only apply path never invokes item-add, field-create, view-create/update, label creation, milestone creation, or issue creation.

The historical bootstrap CLI equivalent for adding one of the 58 issues was the following. It is not an authorized current sync operation:

```bash
gh project item-add 1 \
  --owner arunpr614 \
  --url 'https://github.com/arunpr614/Life-Reflection/issues/ISSUE_NUMBER' \
  --format json
```

The historical bootstrap implementation used the documented GraphQL mutation below so it could use the issue's node ID directly. The current script contains no item-add mutation:

```bash
gh api graphql \
  -f query='mutation($projectId:ID!,$contentId:ID!){addProjectV2ItemById(input:{projectId:$projectId,contentId:$contentId}){item{id}}}' \
  -f projectId='PROJECT_NODE_ID' \
  -f contentId='ISSUE_NODE_ID'
```

At bootstrap time, GitHub documented that adding content already present returned the existing Project item ID instead of making a duplicate and required item-add and item-update to be separate calls. This is provenance, not current behavior claimed or invoked by the tool.

CLI field creation examples:

```bash
gh project field-create 1 --owner arunpr614 --name 'Status' --data-type SINGLE_SELECT --single-select-options 'Backlog,Next,In progress,Done' --format json
gh project field-create 1 --owner arunpr614 --name 'Start date' --data-type DATE --format json
gh project field-create 1 --owner arunpr614 --name 'Task summary' --data-type TEXT --format json
```

CLI field-value equivalents after resolving the Project, item, field, and option node IDs:

```bash
gh project item-edit --project-id PROJECT_NODE_ID --id ITEM_NODE_ID --field-id STATUS_FIELD_NODE_ID --single-select-option-id STATUS_OPTION_ID
gh project item-edit --project-id PROJECT_NODE_ID --id ITEM_NODE_ID --field-id START_FIELD_NODE_ID --date '2026-08-17'
gh project item-edit --project-id PROJECT_NODE_ID --id ITEM_NODE_ID --field-id SUMMARY_FIELD_NODE_ID --text 'TASK_SUMMARY'
gh project item-edit --project-id PROJECT_NODE_ID --id ITEM_NODE_ID --field-id START_FIELD_NODE_ID --clear
```

For efficiency, the current script batches only mismatched existing `updateProjectV2ItemFieldValue` or `clearProjectV2ItemFieldValue` operations for one already-resolved item. It performs no add mutation.

## Saved-view API

The mutation shapes below preserve historical bootstrap/rollback knowledge. Current apply verifies the two established views and refuses drift; it does not execute these mutations.

At the historical bootstrap, `gh project` had no saved-view create/update subcommand, so the bootstrap used the then-observed `createProjectV2View` and `updateProjectV2View` mutations. Current apply rejects either operation.

The historical creation used this shape; the Status board supplied all 18 field node IDs, including built-in Milestone, in `visibleFieldIds`, while the Roadmap omitted `configuration`:

```bash
gh api graphql --input - <<'JSON'
{
  "query": "mutation($input:CreateProjectV2ViewInput!){createProjectV2View(input:$input){projectV2View{id name layout}}}",
  "variables": {
    "input": {
      "projectId": "PROJECT_NODE_ID",
      "name": "Phase 1 Status",
      "layout": "BOARD_LAYOUT",
      "configuration": {
        "visibleFieldIds": [
          "STATUS_FIELD_NODE_ID",
          "MILESTONE_FIELD_NODE_ID",
          "START_FIELD_NODE_ID",
          "TARGET_FIELD_NODE_ID",
          "PRIORITY_FIELD_NODE_ID",
          "OWNER_ROLE_FIELD_NODE_ID",
          "PRD_PID_FIELD_NODE_ID",
          "DESIGN_FIELD_NODE_ID",
          "ARCHITECTURE_FIELD_NODE_ID",
          "QA_FIELD_NODE_ID",
          "DELIVERY_FIELD_NODE_ID",
          "COUNCIL_FIELD_NODE_ID",
          "DOSSIER_FIELD_NODE_ID",
          "READINESS_FIELD_NODE_ID",
          "EXECUTION_SCOPE_FIELD_NODE_ID",
          "REQUIREMENTS_FIELD_NODE_ID",
          "EVIDENCE_FIELD_NODE_ID",
          "SUMMARY_FIELD_NODE_ID"
        ]
      }
    }
  }
}
JSON
```

At that bootstrap snapshot, `CreateProjectV2ViewInput` did not contain `filter`, so creation was followed by an update. The historical update shape is retained below only as rollback/provenance knowledge:

```bash
gh api graphql --input - <<'JSON'
{
  "query": "mutation($input:UpdateProjectV2ViewInput!){updateProjectV2View(input:$input){projectV2View{id name layout filter}}}",
  "variables": {
    "input": {
      "viewId": "VIEW_NODE_ID",
      "name": "Phase 1 Status",
      "layout": "BOARD_LAYOUT",
      "filter": "repo:arunpr614/Life-Reflection is:issue label:phase1",
      "configuration": {
        "visibleFieldIds": ["STATUS_FIELD_NODE_ID", "OTHER_VISIBLE_FIELD_NODE_IDS"]
      }
    }
  }
}
JSON
```

The historical bootstrap's retry behavior was exact-name based:

- No match meant create the view, then update its filter and configuration.
- One match meant update its name, layout, filter, and board-visible fields in place.
- Multiple exact matches stopped without guessing which view to modify.
- A failure after create but before update could be rerun; the next run found and updated the new view.

None of those creation/update branches exists in the current script. Any missing or drifted view now fails before mutation and requires a separately authorized control change.

The live inputs expose no horizontal/vertical grouping, roadmap date-field selection, zoom, marker, or view-order properties. Those settings remain explicit UI completion steps; the script does not claim them as API-synchronized.

## Running the tool

Safe local dry-run; no `gh` process is started and no files are written:

```bash
node tools/sync_phase1_github.mjs
```

Before constructing any real dry-run, verify, or apply projection, the script executes the structural P0 validator. It guards the captured manifest/issue-map bytes before and after validation and immediately before projection/output; drift raises `P0_CONTROL_SNAPSHOT_DRIFT`. The six-line `Evidence` value derives `Control validation: Passed|Failed` from that result; it never derives validation from readiness or execution permission. A failed dry-run still emits the complete reviewable 58-task fail-closed payload with `Control validation: Failed` and exits nonzero, while live verify/apply stops before fetch or `gh`. Missing, blank, malformed, or partial candidate, digest, authority, or reference values use the frozen `Not yet recorded` copy; complete valid values are preserved. The exact local sync oracle is `56/56`: it retains the 30 existing-only/mutation cases, 16 projection-contract cases (including ten fallback-normalization cases), two snapshot-binding cases, four source-main movement boundaries, exact frozen-scope target rejection, and a real subprocess capture proving the greater-than-64-KiB freeze adapter flushes as complete parseable JSON.

The dry-run JSON includes every exact generated issue body and all 17 expected Project field values, so public wording, dossier URLs, hashes, owner actions, scope, and blockers can be reviewed before any mutation. Apply records a canonical delta digest, rechecks exact-main source provenance and each exact target immediately before its bounded mutation, automatically runs full read-only parity after the last mutation, then re-fetches and rechecks the source revision once more; a moved source or nonzero post-apply mismatch is a hard failure.

Direct read-only parity verification first passes the local structural/snapshot gate, then fetches origin and requires the same clean, non-detached, exact-`origin/main` provenance as apply. It binds its in-memory manifest and issue-map bytes to that verified Git revision, then performs live GitHub reads without mutation or file writes:

```bash
node tools/sync_phase1_github.mjs --verify
```

It reports the exact source revision and compares all 58 canonical issues, the public issue map, repository title/body/labels/milestone/state, Project membership and all 17 managed field values, R10 date absence, and both saved-view names/layouts/filters. It does not verify saved-view visible fields, grouping, or selected date fields. Pull-request items are counted separately and are not treated as delivery tasks. Any provenance failure, mismatch, or ambiguous task identity is a hard failure.

After the reviewed source is merged, use a clean non-detached exact-main checkout. The apply command records the exact source revision and a digest of the complete preflighted delta, then changes only mismatched existing bodies/values:

```bash
git fetch origin main
git switch --create codex/p0-exact-main-reconcile --track origin/main
node tools/sync_phase1_github.mjs --apply
node tools/sync_phase1_github.mjs --verify
```

The branch name is not special; it must be non-detached, track `origin/main`, be clean, and have `HEAD === origin/main`. A local branch named `main` is not required. If only existing Project field values should change:

```bash
node tools/sync_phase1_github.mjs --apply --project-only
```

That project-only command still performs the complete issue/item/field/view preflight, then skips issue-body writes. It does not create or update views, items, fields, issues, milestones, or the issue map.

If only existing issue bodies should change:

```bash
node tools/sync_phase1_github.mjs --apply --issues-only
```

Legacy issue-state and view-mutation arguments are rejected as unsupported. Any issue state/status/label/milestone change or Project item/field/view/workflow creation/configuration requires a separately scoped, reviewed tool change and authority. After any apply, run two consecutive quiescent read-only verifier snapshots before calling the roadmap synchronized.

## Apply semantics and recovery

- Before mutation, all 58 managed issues must satisfy canonical title prefix, hidden task marker, `phase1` label, public issue-map number/URL/status/state, manifest ID, labels, milestone, and state. All 58 Project items, 17 existing fields/options, and two saved views must also resolve exactly.
- It creates, deletes, or reconfigures nothing and never changes issue state/status/labels/milestones. Static drift is a blocker, not an implicit repair authorization.
- It is not externally atomic: a network/API failure can leave a prefix of the preflighted body/value delta synchronized, and GitHub exposes no cross-issue/Project transaction or conditional Project-field version. Per-target source refetch/byte checks and target rechecks narrow but cannot eliminate the final check-to-write micro-race or a remote main change after the last fetch. The source revision, delta digest, automatic post-apply parity, and final source recheck make retry comparison auditable; inspect and verify before retrying or claiming success.
- It fails closed if R10 acquires dates or if any established Project definition/view drifts.
- Review the dry-run first. Apply itself requires a zero-mismatch post-apply parity read. Then run `--verify` twice as separate consecutive quiescent snapshots before calling the roadmap synchronized.
- If an incorrect body/value is written, correct the source, merge normally, and rerun from exact main. Destructive removal or definition repair is outside this script.

## UI-only completion record

- [x] **Phase 1 Status** uses Status as its columns and shows Backlog, Next, In progress, and Done.
- [x] **Phase 1 Roadmap** groups rows by Milestone.
- [x] **Start date** and **Target date** drive the roadmap bars.
- [x] Month zoom is retained; no optional date marker is required for this baseline.
- [x] Both views use the exact `repo:arunpr614/Life-Reflection is:issue label:phase1` filter and display exactly the 58 managed tasks; two quiescent read-only verifier snapshots confirm zero drift.
- [x] R10 dates remain blank until its measured threshold trigger is approved.

## First-party sources

- GitHub, [Using the API to manage Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects?tool=cli)
- GitHub, [OAuth scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)
- GitHub, [REST API endpoints for Project views](https://docs.github.com/en/rest/projects/views?apiVersion=2026-03-10) — published endpoint evaluated during the spike; the live user-owned POST returned 404, so the script does not use it
- GitHub CLI, [`gh project`](https://cli.github.com/manual/gh_project)
- GitHub CLI, [`gh project field-create`](https://cli.github.com/manual/gh_project_field-create)
- GitHub CLI, [`gh project item-add`](https://cli.github.com/manual/gh_project_item-add)
- GitHub CLI, [`gh project item-edit`](https://cli.github.com/manual/gh_project_item-edit)
