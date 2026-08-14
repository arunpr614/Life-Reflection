# Phase 1 GitHub Project V2 sync

Status: the 2026-08-14 live baseline is recorded below; the current P0 controls require a new read-only parity check and a narrowly staged saved-view filter update before synchronization can be called current

Target: <https://github.com/users/arunpr614/projects/1>

Canonical source: [`PHASE1-ROADMAP-MANIFEST.json`](./PHASE1-ROADMAP-MANIFEST.json)

Tool: [`sync_phase1_github.mjs`](../../tools/sync_phase1_github.mjs)

## Decision

Use the manifest-driven script to create or update the 58 repository issues, add every issue to Project #1, and set 17 Project fields. Keep dry-run as the default. Require an explicit `--apply` for mutations and use `--project-only` when the issues already exist. Every issue body and Project item projects the six task-bound P0 dossier artifacts; shared release/global documents remain inputs rather than task approval.

The script creates or updates two saved views by exact name:

| View | Layout | API configuration |
| --- | --- | --- |
| Phase 1 Status | Board | GraphQL creates/updates layout, the exact Phase 1 issue filter, and all visible planning fields; Status columns remain a UI setting |
| Phase 1 Roadmap | Roadmap | GraphQL creates/updates layout and the exact Phase 1 issue filter; date fields and Milestone grouping remain UI settings |

The Status board requests 18 visible fields: Status, Milestone, Start date, Target date, Priority, Owner role, PRD / PID, Design artifact, Architecture plan, QA plan, Delivery control, Council decision, Task dossier, Artifact readiness, Execution scope, Requirement IDs, Evidence, and Task summary. GraphQL's `ProjectV2ViewConfigurationInput` exposes `visibleFieldIds`, so those columns are synchronized on the board.

GitHub's current GraphQL view inputs do not expose board grouping or the roadmap's grouping and selected date fields. The live UI configuration therefore keeps Status as the board columns and uses Milestone, Start date, and Target date in the roadmap.

## Evidence boundary

The earlier live apply and independent read-only reconciliation on 2026-08-14 established the following historical baseline. It does not prove current parity after later local changes:

- GitHub CLI 2.94.0 is installed and includes `gh project` field/item commands.
- The credential initially lacked Project access; it was subsequently refreshed outside this spike and now has `project`. The smallest direct Project query succeeds.
- Sanitized live metadata confirms Project #1 is linked to `arunpr614/Life-Reflection` and had 25 GraphQL-visible fields at the baseline. All 11 then-required board fields—including built-in Milestone—existed with the expected types. The seven task-readiness fields introduced by the current candidate are not claimed live until the staged apply and read-only verification complete. Status has exactly Backlog, Next, In progress, and Done.
- The authorized apply created or synchronized 58 issue-backed Phase 1 items and 12 milestones; issue state is 45 open and 13 evidence-backed Done/closed. A later owner-requested cleanup removed the eight initial-spike `[PVA-001]` through `[PVA-008]` drafts and the template `Monthly roadmap`, `Quarterly roadmap`, and `Backlog` views. The Project now contains the 58 canonical issues and separately filtered merged pull-request records, with no draft items; only the canonical **Phase 1 Status** and **Phase 1 Roadmap** views remain.
- At the earlier baseline, every task matched its issue title, body, labels, milestone, state, Project item, and the ten then-managed Project field values: 580 field-value checks with zero mismatches. This is historical evidence, not parity for the current 17-field/dossier candidate. Status remains planned as exactly 40 Backlog, 4 Next, 1 In progress, and 13 Done. R10 has no milestone due date or task dates.
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

The script uses paginated GraphQL queries for fields and views so it does not rely on the 100-record CLI examples.

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
| Execution scope | Text | `task.executionScope` |
| Requirement IDs | Text | comma-separated `task.requirementIds`, or `Planning-only` |
| Evidence | Text | `task.acceptanceEvidence`, followed by the task's retrievable `task.evidenceReferenceUrls` when present |
| Owner role | Text | `task.ownerRole` |
| Task summary | Text | `task.description` |

The longest current Requirement IDs value is 901 characters; other generated text values are shorter. The script does not truncate any field value.

When a required field is absent, the script creates it. A same-name field with a different data type is a hard failure. For Status and Priority, required options are added and canonical case/color/description is reconciled; unrelated pre-existing options are retained to avoid silently clearing values on unrelated Project items.

## Exact item and field commands

The current CLI equivalent for adding one of the 58 issues is:

```bash
gh project item-add 1 \
  --owner arunpr614 \
  --url 'https://github.com/arunpr614/Life-Reflection/issues/ISSUE_NUMBER' \
  --format json
```

The script uses the documented GraphQL mutation so it can use the issue's node ID directly:

```bash
gh api graphql \
  -f query='mutation($projectId:ID!,$contentId:ID!){addProjectV2ItemById(input:{projectId:$projectId,contentId:$contentId}){item{id}}}' \
  -f projectId='PROJECT_NODE_ID' \
  -f contentId='ISSUE_NODE_ID'
```

GitHub documents that adding content already present returns the existing Project item ID instead of making a duplicate. GitHub also requires adding an item and updating it to be separate API calls.

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

For efficiency, the script batches all 17 `updateProjectV2ItemFieldValue` or `clearProjectV2ItemFieldValue` operations for one item into one GraphQL mutation. It still performs the add mutation first, as required by GitHub.

## Saved-view API

`gh project` currently has no saved-view create/update subcommand. The script uses the `createProjectV2View` and `updateProjectV2View` mutations exposed by the live GraphQL schema.

Creation uses this shape; the Status board supplies all 18 field node IDs, including built-in Milestone, in `visibleFieldIds`, while the Roadmap omits `configuration`:

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

`CreateProjectV2ViewInput` does not contain `filter`, so the script immediately follows creation with an update. The same update runs when a matching view already exists:

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

Idempotence is exact-name based:

- No match: create the view, then update its filter and configuration.
- One match: update its name, layout, filter, and board-visible fields in place.
- Multiple exact matches: stop without guessing which view to modify.
- A failure after create but before update is safe to rerun; the next run finds and updates the new view.

The live inputs expose no horizontal/vertical grouping, roadmap date-field selection, zoom, marker, or view-order properties. Those settings remain explicit UI completion steps; the script does not claim them as API-synchronized.

## Running the tool

Safe local dry-run; no `gh` process is started and no files are written:

```bash
node tools/sync_phase1_github.mjs
```

The dry-run JSON includes every exact generated issue body and all 17 expected Project field values, so public wording, dossier URLs, hashes, owner actions, scope, and blockers can be reviewed before any mutation.

Direct read-only parity verification performs live GitHub reads but makes no mutation and writes no file:

```bash
node tools/sync_phase1_github.mjs --verify
```

It compares all 58 canonical issues, the public issue map, repository title/body/labels/milestone/state, Project membership and all 17 managed field values, R10 date absence, and both saved-view names/layouts/filters. Pull-request items are counted separately and are not treated as delivery tasks. Any mismatch or ambiguous task identity is a hard failure.

Saved-view containment can be changed one view at a time, with an exact sanitized before/after record and verification between steps:

```bash
node tools/sync_phase1_github.mjs --views-only --view-status
node tools/sync_phase1_github.mjs --apply --views-only --view-status
node tools/sync_phase1_github.mjs --verify

node tools/sync_phase1_github.mjs --views-only --view-roadmap
node tools/sync_phase1_github.mjs --apply --views-only --view-roadmap
node tools/sync_phase1_github.mjs --verify
```

The first command in each pair is a local dry-run. Before either apply, retain the live view name, layout, filter, and visible-field configuration needed for rollback. A view filter reduces accidental visibility but does not contain workflow automation; workflow scope requires a separate readable configuration or owner attestation.

After reviewing every manifest Done task's named evidence, approving GitHub mutations, and refreshing the `project` scope, synchronize repository issues and Project #1 while preserving the intended open/closed projection:

```bash
node tools/sync_phase1_github.mjs --apply --close-done
```

The repository pass preserves the current state of every existing managed issue. The optional `--close-done` second pass closes only manifest `Done` tasks and opens manifest non-Done tasks. It never uses an open-first transition, so reviewed Done issues are not transiently reopened.

If all 58 issues already exist and only Project #1 should change:

```bash
node tools/sync_phase1_github.mjs --apply --project-only
```

That project-only command is the least expansive recovery path when repository issues already exist. It idempotently refreshes the 58 Project item fields and creates or updates the two saved views without rewriting repository issues or milestones. The public issue map is rewritten only if its semantic task-to-issue mapping changes. This mode was used successfully to recover from the initial saved-view endpoint failure.

Other guarded modes:

```bash
node tools/sync_phase1_github.mjs --apply --issues-only --close-done
node tools/sync_phase1_github.mjs --apply --project-only --skip-views
node tools/sync_phase1_github.mjs --apply --close-done
```

`--close-done` is deliberately separate because Project Status and GitHub issue state are different mutations. Only use it when every current manifest `Done` task's named evidence has been reviewed. Prefer `--project-only` whenever issue and milestone metadata are already correct; when full sync is necessary, run it only with explicit authority, verify final issue state immediately, and verify again after two consecutive read-only snapshots show no further relevant issue or Project workflow changes.

## Apply semantics and recovery

- The operation is idempotent only after one unique managed issue is identified by all five signals: canonical title prefix, hidden task marker, `phase1` label, public issue-map number/URL, and manifest task ID. Missing, conflicting, or duplicate identity signals stop the run.
- It is not atomic: a network or API failure can leave a prefix of tasks synchronized. Because the first repository pass preserves existing issue state, it cannot transiently reopen reviewed Done issues; still inspect and reconcile state before retrying or claiming success.
- It does not delete issues, labels, milestones, Project items, Project fields, field options, or views.
- It preserves unrelated Project single-select options and unrelated views.
- It fails closed if the trigger-only R10 milestone acquires a due date. GitHub's milestone API rejects both `null` and an empty string as a clearing value, so clear that date in the GitHub UI before rerunning rather than silently retaining drift.
- It is not transactional. A network/API failure can leave a prefix of tasks synchronized; rerun after resolving the error.
- Review the dry-run first. After an apply, run `--verify`; then obtain two consecutive quiescent read-only snapshots before calling the roadmap synchronized.
- If an incorrect field value is written, correct the manifest and rerun. Removing a mistakenly added Project item or view is a separate destructive operation and is outside this script.

## UI-only completion record

- [x] **Phase 1 Status** uses Status as its columns and shows Backlog, Next, In progress, and Done.
- [x] **Phase 1 Roadmap** groups rows by Milestone.
- [x] **Start date** and **Target date** drive the roadmap bars.
- [x] Month zoom is retained; no optional date marker is required for this baseline.
- [ ] Both views use the exact `repo:arunpr614/Life-Reflection is:issue label:phase1` filter and display exactly the 58 managed tasks. The broad historical filter remains observed until the staged live update and read-only verification succeed.
- [x] R10 dates remain blank until its measured threshold trigger is approved.

## First-party sources

- GitHub, [Using the API to manage Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects?tool=cli)
- GitHub, [OAuth scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)
- GitHub, [REST API endpoints for Project views](https://docs.github.com/en/rest/projects/views?apiVersion=2026-03-10) — published endpoint evaluated during the spike; the live user-owned POST returned 404, so the script does not use it
- GitHub CLI, [`gh project`](https://cli.github.com/manual/gh_project)
- GitHub CLI, [`gh project field-create`](https://cli.github.com/manual/gh_project_field-create)
- GitHub CLI, [`gh project item-add`](https://cli.github.com/manual/gh_project_item-add)
- GitHub CLI, [`gh project item-edit`](https://cli.github.com/manual/gh_project_item-edit)
