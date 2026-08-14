# GitHub Projects Roadmap — current capability research

Research snapshot: 2026-08-14
Scope: GitHub.com Projects (the current Projects/`ProjectV2` product), with the native **Roadmap** layout as the main subject
Source policy: GitHub-owned sources only — GitHub Docs, GitHub Changelog, official GitHub CLI documentation, GitHub's public API/schema, and GitHub's own `github/roadmap` repository and Project
Change policy: this was a read-only spike. It did not create or modify a GitHub Project, issue, field, workflow, repository setting, or authentication scope.

> [!NOTE]
> This report preserves the pre-implementation research snapshot. The current 58-task operating model is governed by the [Phase 1 roadmap manifest](../project/PHASE1-ROADMAP-MANIFEST.json), [release plan](../project/PHASE1-RELEASE-PLAN.md), and live Project rather than the smaller pilot proposed here.

## Evidence labels used in this report

- **Documented** — stated in current GitHub documentation or a dated GitHub announcement.
- **Direct observation** — read from GitHub's own public repository, public Project, or public API response on the snapshot date.
- **Inference** — a design conclusion drawn from documented behavior; it is not a GitHub product promise.
- **Gap** — a capability absent from the current documented UI/API/CLI surface reviewed here. Absence is not a guarantee that an undocumented or future capability does not exist.

## Executive summary

GitHub Projects can provide a credible lightweight roadmap for work already represented as GitHub issues and pull requests. A single Project can hold multiple saved views over the same items: table, board, and timeline-style Roadmap. The native Roadmap lays issues across a timeline using custom Date or Iteration fields; it supports draggable scheduling, date/iteration/milestone markers, Month/Quarter/Year zoom, filtering, sorting, grouping, slicing, and numeric roll-ups. These are views over shared items and fields, not separate copies of the work. [About Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects) and [customizing the Roadmap layout](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-roadmap-layout) are the current functional baselines.

The feature that became generally available on **2023-03-23** was the Roadmap layout itself. It already included start/target configuration, drag-to-change dates or iterations, markers, grouping, and a template. It did **not** establish every capability visible in 2026. Native issue dependencies became GA in 2025; Project hierarchy became GA in 2026; explicit Boolean Project search became GA in July 2026; and write APIs for Project views arrived in the GraphQL schema in late July 2026. [The 2023 GA announcement](https://github.blog/changelog/2023-03-23-roadmaps-in-projects-are-now-generally-available/) must therefore be treated as a dated launch record, not as current exhaustive documentation.

The strongest current limitations are important for the proposed Life in Days roadmap:

1. The Roadmap is a scheduling view, not a full critical-path planner. Native issue dependencies exist, but GitHub's Roadmap documentation does not promise dependency connector lines, automatic schedule propagation, critical-path calculation, resource leveling, or baseline-versus-actual tracking.
2. Roadmap setup is only partly automatable. Current GraphQL and REST APIs can create a view with `ROADMAP_LAYOUT`/`roadmap` layout, but Start/Target field mapping, markers, zoom, slicing, sums, and saved-view ordering remain UI-only in the exposed schemas reviewed here.
3. Core `gh project` commands manage projects, fields, and items but have no view-create or view-configure command. `gh project field-create` also omits Iteration and Multi-select even though the current GraphQL schema supports those field types.
4. GitHub's own public roadmap is a valuable governance/content model, but its live Project currently uses **board** views grouped by Quarter and sliced by Product Focus Area — not the native timeline Roadmap layout.
5. **Inference for Life in Days:** because the local tracker deliberately uses evidence gates and dependencies without calendar commitments, a status/gate board should remain the truthful primary view. Add a Roadmap view only when Start/Target dates or real time-boxed iterations are known; do not manufacture dates merely to make a timeline look full.

## 1. What was GA in 2023, and what is current in 2026

| Capability | 2023-03-23 evidence | Current 2026 evidence | Classification |
| --- | --- | --- | --- |
| Roadmap layout | GitHub announced Roadmaps in Projects as GA and said a Roadmap layout could be selected in a new or existing Project. | Current Docs define Roadmap as one of three view layouts. | 2023 GA baseline |
| Timeline fields | Start and target dates could be chosen; dragging changed dates or iterations. | Start and Target can each map to a custom Date or Iteration field; the same field can be used for both. | Baseline, currently documented |
| Markers | Milestones, iterations, and date fields could be displayed as markers. | The same three marker categories are documented now. | Baseline, currently documented |
| Grouping and movement | The GA post showed grouping and dragging between groups to change a field such as Status or Team. | Current Roadmap Docs add explicit grouping, slicing, multi-field sorting, and numeric sums. | Current behavior is broader than the dated post |
| Sub-issue hierarchy | Not established by the Roadmap GA post. | Project hierarchy view became GA on 2026-03-19; parent and sub-issue progress fields can be shown, filtered, and grouped. | Later capability |
| Issue dependencies | Not established by the Roadmap GA post. | Blocking/blocked-by relationships became GA on 2025-08-21 and are filterable in Projects. | Later capability |
| Boolean Project filtering | Not established by the Roadmap GA post. | Explicit `AND` and `OR` in any Project view became GA on 2026-07-16. | Later capability |
| View write API | Not established by the Roadmap GA post. | GraphQL added create/delete/update Project view mutations on 2026-07-28 and view configuration on 2026-07-30; current REST can create Project views. | Later capability |
| Multi-select fields | Not established by the Roadmap GA post. | Multi-select fields entered public preview on 2026-07-23 and appear in the current GraphQL field enum. | Current preview, not GA |

Sources: [Roadmaps GA announcement](https://github.blog/changelog/2023-03-23-roadmaps-in-projects-are-now-generally-available/), [Roadmap layout Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-roadmap-layout), [dependencies GA](https://github.blog/changelog/2025-08-21-dependencies-on-issues/), [hierarchy GA](https://github.blog/changelog/2026-03-19-hierarchy-view-in-github-projects-is-now-generally-available/), [advanced Project search GA](https://github.blog/changelog/2026-07-16-advanced-search-for-projects-is-generally-available/), [GraphQL schema changes for 2026-07-28](https://docs.github.com/en/graphql/overview/changelog#schema-changes-for-2026-07-28), [GraphQL schema changes for 2026-07-30](https://docs.github.com/en/graphql/overview/changelog#schema-changes-for-2026-07-30), and [multi-select public preview](https://github.blog/changelog/2026-07-23-multi-select-fields-for-projects-and-issues-in-public-preview/).

## 2. Product model: one data set, several projections

A GitHub Project is owned by a user or organization. It can contain issues, pull requests, and draft issues, plus project-specific field values. Issue and pull-request metadata such as assignees, labels, milestones, and state stays synchronized with the source item; project custom fields add planning metadata scoped to that Project. Multiple saved views can then filter and arrange the same underlying items. [GitHub's Projects overview](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects) describes this as a flexible system rather than a prescribed delivery method.

The three layouts serve different questions:

- **Table:** dense inventory, editing, multi-sort, grouping, slicing, field visibility, and numeric summaries. [Table layout Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-table-layout)
- **Board:** flow/state view with columns driven by one single-select or Iteration field. Dragging a card to another column changes that field. Board column limits are advisory; people and automations can exceed them. [Board layout Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-board-layout)
- **Roadmap:** timeline view driven by Date or Iteration fields. [Roadmap layout Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-roadmap-layout)

Saved views appear as tabs and retain their layout and filtering/display choices. A user can create, duplicate, rename, reorder, and delete views. Display changes remain private and marked as unsaved until explicitly saved, so exploratory rearrangement need not immediately change the shared view. [Managing Project views](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)

**Inference:** use one Project as the source of planning metadata and build purpose-specific views rather than maintaining separate manual roadmaps. GitHub's own [best practices](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/best-practices-for-projects) recommend custom views, hierarchy, dependencies, automation, and a single source of truth.

## 3. Native Roadmap layout

### 3.1 Scheduling model

Every bar needs a beginning and end derived from Project fields:

- **Start date** selects a custom Date or Iteration field.
- **Target date** selects a custom Date or Iteration field.
- The same field may be used for both. With a single Date, the item is effectively a point/day; with an Iteration, the iteration span supplies the range.
- An item without the required configured value is not placed on the timeline until scheduled.
- Dragging the whole bar changes both boundaries; dragging an edge changes the corresponding boundary. If one Iteration field supplies both boundaries, dragging moves the item to another iteration.

These behaviors are documented in [Customizing the Roadmap layout](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-roadmap-layout). Because dragging mutates field values, the timeline is an editor, not merely a report.

### 3.2 Dates, iterations, milestones, and project status dates are different concepts

| Concept | Scope and semantics | Roadmap role | Important constraint |
| --- | --- | --- | --- |
| Custom Date field | One calendar date stored on each Project item. | Can be Start, Target, or a vertical marker source. | No default value; dates support exact, relative, comparison, and range filters. |
| Iteration field | Repeating named blocks of days or weeks, configured for the Project. | Can be Start/Target; iteration boundaries can be markers. | Initial creation produces three iterations; individual names/dates/durations can be changed and breaks inserted. |
| Repository milestone | Repository-scoped issue/PR grouping with a due date. | Milestone dates can appear as vertical reference markers. | It is not the Roadmap bar's Start/Target field. |
| Project status-update Start/Target | Project-level dates shown with a written status update. | Communicates the overall Project window. | It is Project metadata, not per-item timeline data. |

Sources: [date fields](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-date-fields), [iteration fields](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-iteration-fields), [milestones](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones), and [Project status updates](https://docs.github.com/en/issues/planning-and-tracking-with-projects/sharing-project-updates).

Iteration fields support fixed repeating blocks, editable spans, breaks, grouping/sorting/filtering, and relative filters such as `@current`, `@previous`, and `@next`. Groups of items can be bulk-moved from one iteration to another. [About iteration fields](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-iteration-fields)

**Inference:** choose Iteration when work is genuinely planned in recurring time boxes. Choose Date fields for independently scheduled outcomes. A gate-sequenced plan with unknown dates should use dependency/gate/status fields until dates become credible.

### 3.3 Timeline presentation and interaction

The current layout supports:

- Month, Quarter, or Year zoom.
- Horizontal scrolling and direct bar manipulation.
- Vertical markers for Project iterations, item Date fields, and repository milestones.
- Filtering, multi-field sorting, grouping, and slicing.
- A sum for a supported numeric field in each group header.

Markers are reference lines, not dependency edges. A milestone marker, for example, can show a deadline against every bar without making those items children of the milestone. [Roadmap layout Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-roadmap-layout)

### 3.4 Grouping, slicing, sorting, and filtering

These operations answer different questions:

| Operation | Effect in a Roadmap view | Current constraints called out by GitHub |
| --- | --- | --- |
| Filter | Includes only matching items; the query is saved with the view. | Syntax/field support varies; see the filtering notes below. |
| Sort | Orders items within the display; multiple fields can be applied in order. | None specific to Roadmap beyond field support. |
| Group | Creates horizontal swimlanes by a field and can show numeric sums. | Cannot group by Title, Labels, Reviewers, or Linked pull requests. |
| Slice | Shows one selected value at a time for a field, preserving the rest of the view design. | Cannot slice by Title, Reviewers, or Linked pull requests. |

The exclusions above come from [the current Roadmap layout documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-roadmap-layout).

Project filters support field values, negation, `has:`/`no:`, repository and item type/state, close reason, assignees, labels, milestone, date/number/iteration comparisons and ranges, relative date and iteration keywords, issue type, and parent issue. [Filtering Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/filtering-projects)

There is a current documentation inconsistency. The filtering help page still says different fields are combined as AND, comma-separated values within one field act as OR, and logical OR across fields is unsupported. A newer dated announcement says explicit `AND` and `OR` became GA in the filter bar of **any** Project view on 2026-07-16, and also added the `reviews:` filter. The later dated announcement is the stronger evidence for current GitHub.com behavior. [Advanced search for Projects is generally available](https://github.blog/changelog/2026-07-16-advanced-search-for-projects-is-generally-available/)

**Operational caution:** save explicit, readable filters and test empty/unset cases. Sophisticated Boolean filters improve view reuse but also make it easier for an item to disappear from a view while remaining in the Project.

## 4. Hierarchy, dependencies, and markers

### 4.1 Sub-issues and progress

An issue can contain sub-issues up to eight levels deep and can have at most 100 direct children. Projects expose built-in Parent issue and Sub-issue progress fields, and can group or filter using parent relationships. [Adding sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues) and [Parent issue/Sub-issue progress fields](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-parent-issue-and-sub-issue-progress-fields)

Hierarchy view is currently GA and enabled by default for new Project views; existing views can enable it. GitHub says hierarchy can coexist with grouping, slicing, sorting, and filtering while preserving nesting. [Hierarchy view GA, 2026-03-19](https://github.blog/changelog/2026-03-19-hierarchy-view-in-github-projects-is-now-generally-available/)

**Inference:** use parent/sub-issue structure for decomposition — for example, milestone outcome → epic → independently completable work — but not simply to create a visual indentation. The hierarchy limits and shared issue semantics favor a small number of meaningful levels.

### 4.2 Blocking dependencies

Issues support native `blocked by` and `blocking` relationships. GitHub documents availability on Free, Pro, Team, and Enterprise Cloud, and requires at least triage permission to create relationships. The dependency GA announcement set a limit of 50 issues in each relationship direction and documented Project filters including `is:blocked`, `is:blocking`, `blocked-by:`, and `blocking:`. [Creating issue dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies) and [dependencies GA, 2025-08-21](https://github.blog/changelog/2025-08-21-dependencies-on-issues/)

The current CLI can create, edit, and inspect issue relationships through flags such as `--blocked-by`, `--blocking`, `--add-blocked-by`, and JSON fields `blockedBy`/`blocking`. [GitHub CLI issue-create](https://cli.github.com/manual/gh_issue_create), [issue-edit](https://cli.github.com/manual/gh_issue_edit), and [issue-view](https://cli.github.com/manual/gh_issue_view)

**Gap:** the reviewed Roadmap documentation does not describe Gantt-style dependency connector lines, automatic downstream date changes, slack/critical-path calculations, or resource-level scheduling. Dependencies are first-class issue relationships and filters, but the Roadmap remains a date/iteration visualization. A blocked item can therefore retain an obsolete planned date until a person or automation changes it.

### 4.3 Markers

Roadmap markers can visualize:

- iteration boundaries,
- dates stored in a selected item Date field, and
- repository milestone dates.

They are optional vertical reference lines configured per view. They do not express parentage or blocking. [Roadmap marker documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-roadmap-layout#adding-markers)

## 5. Automation

### 5.1 Built-in workflows

Projects include built-in workflow rules that can change Status when an item is added, when an issue is closed or reopened, and when a pull request is merged or reopened. New Projects include default rules that set closed issues and merged pull requests to Done. [Using built-in automations](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations)

Auto-add workflows can add newly created or subsequently updated matching issues and pull requests from selected repositories. They do **not** backfill pre-existing matches, so existing items need an initial bulk-add or another API/import step. Auto-add filters are a limited subset (`is`, `label`, `reason`, `assignee`, `no`). Limits are 1 active auto-add workflow on Free, 5 on Pro or Team, and 20 on Enterprise Cloud or Enterprise Server. [Adding items automatically](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically)

Auto-archive can hide matching items while preserving Project custom-field data; archived items can be restored. Its filter surface is also deliberately narrow. [Archiving items automatically](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/archiving-items-automatically)

### 5.2 Actions and API automation

GitHub Actions or another integration can use the GraphQL API for custom behavior. A Project can span repositories, but a repository Action workflow is defined in each participating repository. GitHub documents an important authentication constraint: a workflow's built-in `GITHUB_TOKEN` cannot access Projects. GitHub recommends a GitHub App for organization Projects or a personal access token for a user Project, scoped according to the operation. [Automating Projects using Actions](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/automating-projects-using-actions)

GraphQL Project queries require `read:project`; mutations require `project` on a classic token. [Using the API to manage Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects)

**Inference:** begin with a narrowly filtered auto-add workflow. Enable close/merge → Done only when issue closure or pull-request merge is itself sufficient completion evidence; otherwise disable those defaults or reconcile required evidence before closure. Add a custom Action only for a real invariant that cannot be represented in built-ins, and use a dedicated least-privilege credential rather than a broad personal token where the ownership model permits.

## 6. Visibility, access, and repository linking

A Project can be public or private. A public Project is visible on the internet, but each viewer still needs access to an item's source repository to see that issue or pull request. Making a Project public does not disclose private-repository item details to unauthorized viewers. Only the Project owner or an administrator can change visibility. [Managing Project visibility](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-your-project/managing-visibility-of-your-projects)

For a user-owned Project, the owner can invite individual collaborators with read, write, or admin roles. Project permission does not itself grant access to repository content. [Managing access to Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-your-project/managing-access-to-your-projects)

A Project can be linked to a repository when both have the same user or organization owner. Linking makes the Project discoverable from the repository's Projects tab; setting a default repository also directs newly created Project issues to that repository. Viewers must still have permission to see the Project. [Adding a Project to a repository](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-your-project/adding-your-project-to-a-repository)

**Life in Days boundary:** a public planning Project is acceptable only for sanitized engineering/planning issues. It must never contain real journals, photos, private identifiers, credentials, provider responses, private URLs, or descriptions derived from private photos. A public Project is a planning surface, not a safe place for product data.

## 7. API and CLI coverage

### 7.1 GraphQL

The current `ProjectV2` GraphQL schema is the broadest programmable surface reviewed. It can create/copy/update/delete Projects; link them to repositories and teams; manage items, item positions, draft issues, fields, values, collaborators, status updates, views, and some workflows. The field enum includes Text, Number, Date, Single-select, Iteration, and Multi-select, and field creation accepts Iteration and Multi-select configuration. [GraphQL Projects reference](https://docs.github.com/en/graphql/reference/projects)

View write support is new relative to the original Roadmap release:

- On **2026-07-28**, the schema added `createProjectV2View`, `deleteProjectV2View`, and `updateProjectV2View`. Creation accepts project, name, and layout; update also exposes name, layout, and filter. [GraphQL schema changelog](https://docs.github.com/en/graphql/overview/changelog#schema-changes-for-2026-07-28)
- On **2026-07-30**, it added `ProjectV2ViewConfiguration`/`ProjectV2ViewConfigurationInput`, currently exposing ordered visible field IDs for create/update. [GraphQL schema changelog](https://docs.github.com/en/graphql/overview/changelog#schema-changes-for-2026-07-30)

Queries can read a view's layout, filter, fields, grouping, vertical grouping, and sorting. The current mutation inputs can create a named layout, update its filter, and set `visibleFieldIds`, but do not expose Roadmap Start/Target field selection, markers, zoom, slicing, numeric sum choice, or saved-view tab order. [GraphQL Projects schema](https://docs.github.com/en/graphql/reference/projects)

**Gap, inferred from the documented schema:** full-fidelity Roadmap view configuration cannot currently be reproduced solely with the public GraphQL view mutations.

### 7.2 REST API version `2026-03-10`

The versioned REST API now exposes substantial ProjectV2 endpoints for projects, fields, items, and views:

- [Projects](https://docs.github.com/en/rest/projects/projects?apiVersion=2026-03-10)
- [Project fields](https://docs.github.com/en/rest/projects/fields?apiVersion=2026-03-10)
- [Project items](https://docs.github.com/en/rest/projects/items?apiVersion=2026-03-10)
- [Project views](https://docs.github.com/en/rest/projects/views?apiVersion=2026-03-10)

The view endpoint can create `table`, `board`, or `roadmap` layouts with an initial filter, multi-sort, horizontal grouping, and vertical grouping. `visible_fields` applies to table and board, not Roadmap. It does not expose Roadmap-specific Start/Target mapping, markers, zoom, slice, sums, or view ordering. The current REST view surface is also asymmetric: the reviewed documentation exposes view creation but not equivalent general update/delete operations.

For user-owned Projects, the REST create-view documentation says GitHub App tokens and fine-grained personal access tokens are unsupported for that endpoint. This makes token/ownership choice a real implementation constraint; a classic PAT may be required unless GraphQL or manual UI setup is used. [REST Project views](https://docs.github.com/en/rest/projects/views?apiVersion=2026-03-10)

### 7.3 GitHub CLI

Core [`gh project`](https://cli.github.com/manual/gh_project) commands can create, copy, edit, close, delete, link, unlink, and inspect Projects; create/delete/list fields; and create/add/edit/list/archive/delete items. They require at least the `project` token scope for mutation.

The gaps are concrete:

- There is no core `gh project` command to create, update, delete, or configure a saved view.
- [`gh project field-create`](https://cli.github.com/manual/gh_project_field-create) advertises Text, Single-select, Date, and Number only — not Iteration or Multi-select.
- [`gh project item-edit`](https://cli.github.com/manual/gh_project_item-edit) can assign an Iteration option once an Iteration field already exists.
- `gh api graphql` or `gh api` REST calls can reach API functionality that lacks a dedicated high-level command, provided the token has the required access.

### 7.4 Practical configuration matrix

| Operation | UI | GraphQL | REST `2026-03-10` | Core `gh project` |
| --- | --- | --- | --- | --- |
| Create Project | Yes | Yes | Yes | Yes |
| Create Date field | Yes | Yes | Yes | Yes |
| Create Iteration field | Yes | Yes | Yes | No |
| Create Multi-select field | Preview | Yes | No in the current create-field input | No |
| Add/edit items and values | Yes | Yes | Yes | Yes, including iteration assignment |
| Create Roadmap-layout view | Yes | Yes | Yes | No |
| Set view filter | Yes | Yes, through update after creation | Yes at creation | No |
| Set initial sort/group | Yes | Readable, not writable through current view input | Yes at creation | No |
| Select Roadmap Start/Target fields | Yes | No exposed mutation input | No exposed input | No |
| Configure markers/zoom/slice/sum | Yes | No exposed mutation input | No exposed input | No |
| Reorder saved views | Yes | No exposed mutation | No exposed endpoint | No |

The table reports the public surfaces reviewed on the snapshot date; API evolution is active, so schema introspection and versioned REST Docs should be rechecked before implementation.

## 8. Current limits and operational edges

| Limit or edge | Current documented value/behavior | Source |
| --- | --- | --- |
| Total Project items | 50,000, counting active and archived items | [Archiving items](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-items-in-your-project/archiving-items-from-your-project) |
| Total Project fields | 50, including built-in and custom fields | [About Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects) |
| Sub-issues | 100 direct children per parent; eight nesting levels | [Adding sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues) |
| Issue dependencies | Up to 50 in each relationship direction | [Dependencies GA](https://github.blog/changelog/2025-08-21-dependencies-on-issues/) |
| Auto-add workflows | Free 1; Pro/Team 5; Enterprise Cloud/Server 20 | [Adding items automatically](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically) |
| Auto-add backfill | None; only a newly created or later updated matching item triggers the rule | Same source |
| Date field defaults | Not supported | [About Date fields](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-date-fields) |
| Board WIP limits | Advisory; people and automations can exceed them | [Board layout Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-board-layout) |
| Roadmap slice exclusions | Title, Reviewers, Linked pull requests | [Roadmap layout Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-roadmap-layout) |
| Roadmap group exclusions | Title, Labels, Reviewers, Linked pull requests | Same source |

Additional operational edges:

- A Project item can exist but be hidden by a saved view's filter, slice, or grouping state.
- Dragging in board or Roadmap layouts writes field values and can trigger downstream automation.
- Archiving reduces visible clutter but does not reduce the 50,000-item total.
- Project custom fields are Project-scoped. Organization Issue fields are a separate 2026 feature and do not replace Project fields for a user-owned Project. [Managing organization Issue fields](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/managing-issue-fields-in-your-organization)
- Multi-select fields are still explicitly labeled public preview in the July 2026 announcement, so they should not be treated as a stable GA dependency without a fresh check.

## 9. How `github/roadmap` actually uses Projects

GitHub's [`github/roadmap` repository](https://github.com/github/roadmap) is the editorial front door for the [GitHub Public Roadmap Project](https://github.com/orgs/github/projects/4247). Its README says each roadmap deliverable is represented by a GitHub issue and classified by release phase, feature area, feature, SKU, and deployment model. When shipped, an item receives a shipped label, is closed, and links to the relevant changelog. It also warns that the roadmap is forward-looking and subject to change.

GitHub's November 2024 [public-roadmap refresh announcement](https://github.com/orgs/community/discussions/145255) reinforces the pattern: releases are sorted by Product Focus Area and release phase; every Project item links to a detailed issue; and timing is tentative.

### Direct observation of Project 4247 on 2026-08-14

GitHub's current public Project/API exposed:

- Project title **GitHub Public Roadmap**, public visibility, and current activity on the snapshot date.
- Custom single-select fields for Status, Product Focus Area, Release Phase, Theme, and Quarter.
- Status options: Up Next, Exploring, Shipped, and Paused.
- Quarter options covering Q3 2025 through Q4 2026 plus Future.
- Six saved views: All Items, General Availability Items, Public Previews, Server (GHES), Recently Shipped, and All - Status.
- All six observed saved views use a **board** layout.
- The primary view uses Quarter as the board grouping/column dimension and slices by Product Focus Area.

Evidence: [public Project 4247](https://github.com/orgs/github/projects/4247), [public Project metadata API](https://api.github.com/orgs/github/projectsV2/4247), and [public Project fields API](https://api.github.com/orgs/github/projectsV2/4247/fields). The saved-view configuration was observed directly in the first-party Project page's delivered configuration on the snapshot date; it is not asserted as a permanent design.

### What to copy — and what not to copy

Useful patterns:

- One issue per roadmap-scale deliverable, with the issue body carrying detail and discussion.
- A small structured vocabulary for state, horizon, focus area, and release phase.
- Separate views for distinct audiences/questions rather than duplicate issue sets.
- A clear shipped convention and changelog/evidence link.
- An explicit warning that future timing can change.

Do not misread GitHub's example:

- The repository is called a roadmap, but the current live Project is not using the native timeline Roadmap layout.
- Quarter buckets are single-select categories in the observed Project, not Date/Iteration bars.
- The README's detailed GHES quarter table ends in 2024; the live Project is stronger evidence for current configuration.
- GitHub's scale and release vocabulary should not be copied mechanically into a private single-user product plan.

**Conclusion:** `github/roadmap` demonstrates a governance and information-architecture pattern for a public roadmap. It does not demonstrate the current native Roadmap timeline feature.

## 10. Implications for the Life in Days design spike

This section is intentionally a bridge to a separate design artifact, not a claim that a Project has been created.

1. **Use real repository issues for roadmap deliverables.** Native dependencies, hierarchy, issue history, closing, and linking work best when roadmap items are issues rather than Project-only draft items. Keep issue granularity at an independently understandable deliverable, not every checklist line.
2. **Keep a gate/status board as the primary truthful view.** The existing plan is evidence-gated and explicitly avoids calendar dates. Represent gates, status, milestone, epic, and evidence state directly; do not invent dates to populate a timeline.
3. **Add a Roadmap view only for scheduled work.** Use Date fields when independent Start/Target dates are approved. Use Iteration only if a repeating execution cadence is actually adopted. Unscheduled items can remain visible in table/board views.
4. **Model decomposition and blocking separately.** Use parent/sub-issues for hierarchy and native blocked-by relations for sequencing. Do not expect dependency lines or date propagation on the timeline.
5. **Prefer a small stable field set.** A plausible minimum is Status, Gate, Milestone, Epic/Area, Evidence state, Start, and Target. Keep GitHub labels for repository-wide classification and Project fields for this roadmap's planning metadata.
6. **Use saved views as questions.** Candidate views are Gate Board, Deliverable Table, Confirmed Schedule (Roadmap), Blocked Work, Evidence Needed, and Recently Completed. Each should have an explicit audience and filter.
7. **Plan for a hybrid setup.** Project/fields/items and the initial Roadmap view can be scripted with GraphQL/REST, but final Roadmap field mapping, markers, zoom, slice, sums, and tab order require UI configuration today. Record those manual steps as reproducible configuration evidence.
8. **Start automation narrowly.** Auto-add eligible repository issues. Disable close/merge → Done when completion also requires evidence review, or reconcile that evidence before closure. Backfill the existing backlog explicitly because auto-add will not do it.
9. **Protect the public/private boundary.** Only sanitized planning artifacts belong in the repository and Project. Never turn personal product content into issues or Project field values.

## 11. Spike verdict

**Feasible with constraints.** GitHub Projects can host a useful Life in Days roadmap without another planning system. Its main strength is that delivery artifacts, discussions, dependencies, hierarchy, status, and multiple stakeholder views remain attached to the repository's issues. Its native Roadmap is suitable for approved schedule visualization, but it should not become the canonical expression of a dependency-first plan before dates exist.

The recommended design principle is:

> **Issues are the work record; fields are planning metadata; views are projections; the Roadmap is the confirmed schedule, not the source of truth.**

The implementation spike should therefore design the data model and non-timeline views first, then add a timeline view as an optional scheduled projection. A complete scripted bootstrap is not currently possible through core `gh project`, and a complete Roadmap view configuration is not currently possible through the exposed GraphQL/REST view inputs; the spike must include a short, reviewable UI configuration step.

## Source index

### Dated GitHub announcements

- [Roadmaps in Projects are generally available — 2023-03-23](https://github.blog/changelog/2023-03-23-roadmaps-in-projects-are-now-generally-available/)
- [Dependencies on issues — 2025-08-21](https://github.blog/changelog/2025-08-21-dependencies-on-issues/)
- [Hierarchy view in Projects GA — 2026-03-19](https://github.blog/changelog/2026-03-19-hierarchy-view-in-github-projects-is-now-generally-available/)
- [Advanced search for Projects GA — 2026-07-16](https://github.blog/changelog/2026-07-16-advanced-search-for-projects-is-generally-available/)
- [Multi-select fields public preview — 2026-07-23](https://github.blog/changelog/2026-07-23-multi-select-fields-for-projects-and-issues-in-public-preview/)
- [GraphQL schema changes — 2026-07-28](https://docs.github.com/en/graphql/overview/changelog#schema-changes-for-2026-07-28)
- [GraphQL schema changes — 2026-07-30](https://docs.github.com/en/graphql/overview/changelog#schema-changes-for-2026-07-30)

### Current GitHub Docs and official CLI/API references

- [About Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects)
- [Best practices for Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/best-practices-for-projects)
- [Customizing the Roadmap layout](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-roadmap-layout)
- [Filtering Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/filtering-projects)
- [Managing Project views](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)
- [About Date fields](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-date-fields)
- [About Iteration fields](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-iteration-fields)
- [Creating issue dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies)
- [Adding sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues)
- [Built-in Project automation](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations)
- [Auto-add workflows](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically)
- [Actions automation](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/automating-projects-using-actions)
- [GraphQL Projects reference](https://docs.github.com/en/graphql/reference/projects)
- [REST Project views](https://docs.github.com/en/rest/projects/views?apiVersion=2026-03-10)
- [`gh project` manual](https://cli.github.com/manual/gh_project)

### GitHub's own roadmap evidence

- [`github/roadmap` repository](https://github.com/github/roadmap)
- [GitHub Public Roadmap Project 4247](https://github.com/orgs/github/projects/4247)
- [Re-introducing the GitHub Public Roadmap — 2024-11-21](https://github.com/orgs/community/discussions/145255)
- [Project 4247 metadata API](https://api.github.com/orgs/github/projectsV2/4247)
- [Project 4247 fields API](https://api.github.com/orgs/github/projectsV2/4247/fields)
