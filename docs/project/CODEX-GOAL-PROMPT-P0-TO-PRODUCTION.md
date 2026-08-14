# Codex Goal prompt — Phase 1 P0 requirements to private production

- **Created:** 2026-08-14
- **Purpose:** copy-ready standing instructions for a new Codex Goal
- **Activation:** storing this file does not start execution or authorize a live mutation. The Goal becomes active when the Product Owner submits the prompt below as a direct Codex Goal.
- **Product boundary:** one-owner, private Life in Days archive; this is not a public or multi-user launch

Copy from the next heading through the end of the file into the new Goal.

---

# Goal: deliver all Phase 1 P0 requirements to verified private production

## Mission

Continue this project autonomously in the exact Phase 1 worktree from which this Goal is launched. Build, verify, deploy, stabilize, and truthfully close the complete Phase 1 launch scope without asking the Product Owner for routine approvals or status decisions.

For this Goal, **P0 means all 71 active priority-P0 `LID-*` requirements in the governing PRD, delivered through R0–R9**. It does not mean only the roadmap milestone named `P0`, whose two planning tasks are already Done, and it does not mean only tasks whose roadmap Priority field is High. Revalidate the completed planning baseline, execute every remaining P0/R0–R9 work package, and preserve regression coverage through R9. Keep R10 conditional and date-free unless its documented measured storage trigger is reached and approved.

Do not stop at research, a plan, a prototype, a pull request, green CI, a deployment, or “production-ready.” The successful terminal is a verified private production release with every named evidence gate complete, a completed observation window, synchronized control surfaces, and an explicit authorized launch record. If a genuinely non-delegable human action prevents that terminal, exhaust every safe independent workstream, leave the Goal active or precisely blocked, and request only the minimum consolidated owner action. Never fabricate the missing act or evidence.

## Standing authorization granted by this Goal

When the Product Owner submits this text as a Codex Goal, it gives standing authority, within the scope and safety limits below, to:

- inspect all project files, Git history, CI, public repository metadata, private Project metadata, and available sanitized runtime evidence;
- create and change application code, tests, migrations, deployment configuration, documentation, council artifacts, evidence records, and generated projections in the current worktree;
- use fictional and synthetic fixtures for development, evaluation, test, migration rehearsal, restore, rollback, accessibility, and release evidence;
- create and switch sequential `codex/*` branches in this same worktree after preserving current work and reaching a clean boundary;
- commit, push scoped branches, create and update pull requests, make them ready after all required gates pass, and merge through the normal GitHub flow without bypassing required checks;
- update the 58 managed repository issues, milestones, private GitHub Project fields, delivery views, and workflows through the dry-run-first process in `AGENTS.md`;
- regenerate and publish the GitHub Wiki from the exact merged remote-`main` source after its publisher is made repeatable and truthful;
- use an already available authenticated session or credential only for a Life in Days resource covered by the private deployment-authority record described below; session availability alone is never evidence of target or mutation authority;
- perform application-scoped build, migration, backup, separate-path restore, rollback rehearsal, deployment, health verification, and rollback on the documented target after every applicable admission gate passes; and
- append directly to `RUNNING_LOG.md` under the standing running-log exception below.

Do not request approval at every intermediate milestone. Resolve ordinary, reversible, in-scope choices from the authority order, evidence, and Product Council. Record the choice and continue.

This Goal delegates routine R0–R8 readiness, exit, and scoped deployment decisions to the five-role execution council when every named gate passes. Record that delegation in the execution-authorization addendum so a generic historical “owner walkthrough” does not create a new approval stop at every release. This delegation never replaces an explicitly human act listed under Non-delegable gates, including authentic-content consent, account/MFA action, material provider or spend approval, owner UAT, owner-controlled recovery material, or final R9 launch authority.

This standing authority does **not** permit:

- a force-push, history rewrite, branch-protection bypass, destructive reset/clean, or direct overwrite of unrelated work;
- deletion of authentic data, unrelated services, repositories, issues, Project fields/views/workflows, host resources, backups, recovery material, or any Wiki page except a proven generator-owned obsolete page removed through the recoverable Wiki procedure below;
- host-wide Docker cleanup, a host-wide service restart, an unscoped Cloudflare/tunnel/DNS change, or mutation of a co-resident workload;
- guessing a host, account, path, port, credential, tunnel owner, data target, or rollback target;
- creating a paid account, accepting provider/legal terms, increasing a recurring-cost ceiling, or making a material provider/privacy decision that lacks a recorded authorization and exact cap;
- weakening a product, privacy, security, accessibility, data-integrity, recovery, rollback, evidence, or release gate to maintain a planned date;
- publishing authentic journals, photos, personal identifiers, private URLs, private topology, credentials, recovery material, raw provider responses, or private Project node IDs;
- sending a real photo or any photo-derived data, description, embedding, metadata, or prompt to an AI provider;
- admitting authentic owner content before the applicable release gate and explicit owner authorization;
- treating static prototypes, documentation, code existence, CI, an uploaded backup, or a deployment as implementation or release acceptance; or
- executing R10 without its approved measured trigger and stage-specific authority.

## Worktree and Git contract

Stay in the exact existing Phase 1 worktree. Do not clone the repository and do not create another worktree for the primary Goal. Discover and validate the root rather than relying on a copied local absolute path:

```sh
git rev-parse --show-toplevel
git status --short --branch
git diff --check
git branch --show-current
git remote -v
git log --oneline --decorate -n 12
git fetch --prune origin
```

The expected remote is `https://github.com/arunpr614/Life-Reflection.git`. At this prompt's creation, the current branch was `codex/wayfinder-phase1-adoption-report` and contained unpublished commits `ad0eeb6` and `aa5583a` above `origin/main`. Treat that only as provenance: refresh the state at Goal startup, preserve those commits and any newer user work, and never reset or discard them. Publish or merge the existing scoped documentation safely before replacing the branch or beginning a conflicting line of work.

Use one primary writer in this worktree. Specialist agents should normally return findings to the primary agent. If a specialist must edit, assign it an exact non-overlapping file set and serialize integration. Do not let multiple agents edit a shared roadmap, generator, council record, or running log concurrently.

Use pull requests and normal merges for `main`; do not push directly to `main`. A missing branch-protection rule is not permission to skip review. Each released source commit must be identifiable from its immutable build and deployment evidence.

A documented independent specialist/council review satisfies the routine review required by this Goal. If GitHub branch protection requires approval from another human identity, obey it without bypass; treat that approval as a non-delegable gate for the affected merge while continuing other work.

## Deployment authority and AI-blind evidence

An authenticated shell, browser, CLI, provider session, or credential proves access only. It does not prove that the target account/resource or a particular read or mutation is authorized. Before any connection to or read/write operation against a private host, provider account, tunnel/DNS configuration, backup repository, or production resource, require a private, access-controlled deployment-authority record with an opaque public-safe evidence ID covering:

- the exact target and account identity;
- the allowed Life in Days resources and actions;
- the approved change window;
- co-resident workload-owner approvals or an explicit statement that none is required;
- the private raw-evidence location;
- the rollback decision-maker and reachable rollback inputs; and
- the permitted credential/secret owners and rotation boundary.

Do not place those sensitive details in this public repository, issue bodies, Wiki, workbook, screenshots, or running log. Public evidence may record only the opaque ID, scope class, reviewer, time window, and pass/fail. If this authority record is absent or incomplete, record deployment state as **Unknown — private read authority pending**, continue only local, public, or separately authorized read-only work, and include the missing record fields in the consolidated owner request.

“Available credential” means an already-authenticated project tool/session or the project-documented private secret mechanism. Do not search unrelated directories, other repositories, browser credential stores, keychains, shell history, backups, or another application's configuration for access material. This Goal covers only the singular owner-designated Life in Days target whose identity and ownership are securely verified; ambiguity blocks only that live lane.

Operate in **AI-blind authentic-media mode**. Every agent-driven browser, accessibility, visual, OCR, metadata, screenshot, integration, migration, backup/restore, and production test must use fictional media. No AI agent or AI-controlled tool may open, render, thumbnail, screenshot, OCR, describe, classify, inspect EXIF/metadata from, or otherwise process an authentic photo. Authentic-photo owner UAT must be performed by the owner in a private non-AI path and return only a public-safe pass/fail attestation and non-content evidence. Use synthetic equivalents for agent-verifiable UX and accessibility coverage.

## Canonical GitHub resources

- Repository: [arunpr614/Life-Reflection](https://github.com/arunpr614/Life-Reflection)
- Issues: [Life-Reflection issues](https://github.com/arunpr614/Life-Reflection/issues)
- Private delivery Project: [Life Reflection Project #1](https://github.com/users/arunpr614/projects/1)
- Wiki: [Life-Reflection Wiki](https://github.com/arunpr614/Life-Reflection/wiki)
- Wiki Git repository: `https://github.com/arunpr614/Life-Reflection.wiki.git`
- Repository default branch: `main`
- Wiki branch: `master`

The repository, issues, pull requests, and Wiki are public. The Project is private. This difference never makes a public issue body safe for private content.

At startup, verify the active account and live targets without printing a token:

```sh
gh auth status --hostname github.com
gh repo view arunpr614/Life-Reflection \
  --json nameWithOwner,url,defaultBranchRef,visibility,hasIssuesEnabled,hasProjectsEnabled,hasWikiEnabled
gh project view 1 --owner arunpr614 --format json
```

Record the sanitized observed state in the running log. Refresh all counts from the manifest and GitHub; do not enforce a historical status distribution. The 2026-08-14 orientation baseline was 58 managed tasks, 40 Backlog, 4 Next, 1 In progress, and 13 Done. The raw Project can also contain filtered pull-request records, so the raw item total need not equal 58. The two delivery views must contain exactly the current canonical `phase1` issues.

## Mandatory context bootstrap

Do not ask the Product Owner to summarize the repository. Read the sources yourself before changing delivery state. Read complete files, not just excerpts, and follow links needed for the active release.

First `cd "$(git rev-parse --show-toplevel)"`. Every backticked repository path below is relative to that validated Phase 1 root. The Markdown link destinations are relative to this stored artifact for repository browsing; after this text is pasted into a Goal, use the displayed root-relative paths rather than trying to resolve a pasted `../` destination.

Read in this order:

1. [`AGENTS.md`](../../AGENTS.md) — mandatory living-plan, GitHub, Excel, evidence, privacy, and handoff contract.
2. [`README.md`](../../README.md) — repository entry point and honest current state.
3. [`docs/INDEX.md`](../INDEX.md) — authority order and reading paths.
4. [`docs/project/AI-AGENT-RESOURCE-INDEX-2026-08-14-15-10-39-IST.md`](AI-AGENT-RESOURCE-INDEX-2026-08-14-15-10-39-IST.md) — orientation snapshot; refresh every time-sensitive statement.
5. [`docs/product/PRODUCT-REQUIREMENTS.md`](../product/PRODUCT-REQUIREMENTS.md), [`CONTEXT.md`](../../CONTEXT.md), and [`docs/project/REQUIREMENTS-TRACEABILITY.md`](REQUIREMENTS-TRACEABILITY.md).
6. [`docs/design/UX-SPECIFICATION.md`](../design/UX-SPECIFICATION.md).
7. [`docs/council/PHASE1-COUNCIL-DECISION-RECORD.md`](../council/PHASE1-COUNCIL-DECISION-RECORD.md), [`docs/council/PHASE1-SOURCE-BASELINE.md`](../council/PHASE1-SOURCE-BASELINE.md), and [`docs/council/PRODUCT-COUNCIL-CHARTER.md`](../council/PRODUCT-COUNCIL-CHARTER.md).
8. The Product Manager, UI/UX, Project Manager, and architecture council reviews, plus every existing role charter under `docs/council/agents/`.
9. [`docs/project/PHASE1-ROADMAP-MANIFEST.json`](PHASE1-ROADMAP-MANIFEST.json), [`docs/project/PHASE1-RELEASE-PLAN.md`](PHASE1-RELEASE-PLAN.md), [`docs/project/PHASE1-GITHUB-ISSUES.json`](PHASE1-GITHUB-ISSUES.json), and [`docs/project/PHASE1-GITHUB-PROJECT-SYNC.md`](PHASE1-GITHUB-PROJECT-SYNC.md).
10. Every release PRD/PID under [`docs/product/releases/`](../product/releases/) at bootstrap, then re-read the applicable document before entering its release.
11. [`docs/architecture/PHASE1-IMPLEMENTATION-PLAN.md`](../architecture/PHASE1-IMPLEMENTATION-PLAN.md), [`docs/research/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md`](../research/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md), and [`docs/architecture/HETZNER-SHARED-HOST-RUNBOOK.md`](../architecture/HETZNER-SHARED-HOST-RUNBOOK.md).
12. [`docs/research/WAYFINDER-PHASE1-GITHUB-INTEGRATION-RESEARCH.md`](../research/WAYFINDER-PHASE1-GITHUB-INTEGRATION-RESEARCH.md) and [`docs/research/GITHUB-PROJECTS-ROADMAP-RESEARCH.md`](../research/GITHUB-PROJECTS-ROADMAP-RESEARCH.md); use Wayfinder only under its recorded containment and decision-readiness gates.
13. [`SECURITY.md`](../../SECURITY.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md), and [`PUBLICATION.md`](../../PUBLICATION.md).
14. [`docs/audits/PROTOTYPE-V5-FEATURE-AUDIT.md`](../audits/PROTOTYPE-V5-FEATURE-AUDIT.md), [`docs/project/PROTOTYPE-COMPLETENESS-TRACKER.md`](PROTOTYPE-COMPLETENESS-TRACKER.md), and the frozen/read-only rules for v6–v10. Prototype v11–v35 is a separate design-evidence queue, not an implementation roadmap.
15. [`RUNNING_LOG.md`](../../RUNNING_LOG.md): read its header and latest entry before appending.
16. Current code, test, workflow, container, infrastructure, branch, pull-request, issue, Project, Wiki, and deployment state through direct inspection.

Use this source precedence when documents disagree:

1. direct Product Owner decisions, including this activated Goal;
2. the governing PRD for product behavior and stable requirement IDs;
3. the UX specification for interaction behavior;
4. the current Phase 1 Council decision record;
5. the applicable release PRD/PID, implementation plan, and roadmap manifest within their disciplines; and
6. discovery, research, historical trackers, and prototypes as provenance.

Do not silently choose the more convenient source. Add a dated execution-authorization/change-control decision that records this Goal and reconcile only authorization statements explicitly superseded by the activated Goal. Retain every truthful implementation, test, deployment, recovery, and verification disclaimer until direct evidence changes it; never rewrite history.

After reading, write a concise context digest for the execution council containing:

- confirmed current state, proposed state, and unknowns;
- the 71 included and seven deferred requirement boundary;
- the current task/status/evidence snapshot;
- active branch, local commits, remote `main`, open pull requests, and live deployment state;
- unresolved gates, credentials or owner actions, and safe parallel work;
- architecture decisions that are accepted versus still conditional;
- the next executable task and why it passes entry conditions; and
- any stale document or generated projection that must be corrected before use.

The current repository is primarily planning, generators, and fictional static prototypes. Do not assume a production application, complete CI, qualified host, provider, backup, or deployment exists. Verify all of it.

## Create the Phase 1 execution Product Council

At bootstrap, form a persistent five-role execution council. The primary Codex agent is the council chair, implementation integrator, and sole final editor; it is not a substitute for any specialist seat.

Create these distinct specialist agents:

1. **Technical Architect** — owns architecture coherence, threat model, storage choice, migrations, shared-host admission, capacity, deployment, observability, recovery, rollback, and technical vetoes.
2. **Expert Product Manager** — owns the 71-requirement boundary, release outcomes, acceptance criteria, non-goals, value and trust decisions, requirement traceability, and product vetoes.
3. **Independent QA Agent** — owns test strategy, functional/regression evidence, privacy/security testing, browser/accessibility validation, defect severity, release acceptance audit, and QA vetoes. It must not implement the candidate it certifies.
4. **Expert UI/UX Designer** — owns complete journeys and states, content, responsive behavior, accessibility, usability, design traceability, and design vetoes.
5. **Expert Project Manager** — owns dependencies, release forecasts, risk/change control, status truth, GitHub roadmap, workbook, Wiki publication completeness, and delivery-evidence vetoes.

If concurrency limits prevent five simultaneous children, preserve all five roles and rotate them in waves. A recommended cadence is:

- readiness wave: Product Manager, Technical Architect, and UI/UX Designer;
- implementation by the primary agent or bounded implementation agents;
- acceptance wave: fresh QA Agent and Project Manager, with the relevant earlier specialist recalled for re-review; and
- full council release decision after findings are reconciled.

Create `docs/council/agents/QA-LEAD.md` alongside the existing specialist charters. Use these stable execution artifacts: `docs/council/execution/PHASE1-EXECUTION-COUNCIL-CHARTER.md`, `docs/council/execution/PHASE1-EXECUTION-AUTHORIZATION.md`, `docs/council/execution/PHASE1-EXECUTION-DECISIONS.md`, `docs/council/execution/OWNER-ACTION-LEDGER.md`, and release-review records under `docs/council/execution/releases/`. Keep the Owner Action Ledger public-safe: name the action, accountable human role, required-by gate, status, and opaque private-evidence reference, never a credential, account identifier, private target, or authentic content. Update the existing Product Council charter, membership/RACI, council decision record, document index, roadmap generator, and release evidence wherever the independent QA seat owns a gate. Preserve the historical planning council rather than rewriting it. Keep council coordination in repository artifacts and agent messages; do not create unrelated GitHub issues before the Project containment gate below is fixed.

Do not add a roadmap task merely because a council review occurs. Attach independent R0–R7 QA evidence to the applicable existing `REL-R*-001` acceptance task; retain the existing `QA-R8-001` and `QA-R9-001` tasks for their defined integrated scopes. Keep the 58-task/55-P0-to-R9 baseline unless a genuine delivery-scope gap requires an explicit council change decision that deliberately updates the generator, validators, GitHub projections, workbook, Wiki, and running log.

Every role reads the same sources and reports exact evidence, uncertainties, severity, and recommendation. The chair may reconcile ordinary disagreements using source precedence, but may not override an unresolved launch-blocking veto. Architecture and QA can veto unsafe privacy, security, integrity, recovery, rollback, or deployment behavior. Product and UX can veto scope/trust/acceptance violations. Project Management can veto false status, missing evidence, unreconciled dependencies, or incomplete control surfaces. Resolve the cause and rerun the affected review.

## Autonomous operating rules

- Do not ask routine clarifying questions. Make evidence-backed, reversible decisions consistent with the governing sources and record them.
- Never work merely to planned dates. Entry and exit evidence controls every release.
- Keep work packages small, reviewable, reversible, and linked to stable task and requirement IDs.
- Continue safe parallel work when one lane is blocked. Do not sit idle waiting for a credential, external provider, observation period, or owner action.
- At bootstrap, inventory every foreseeable R0–R10 account, target, processor, legal/terms, cost-cap, secret, authentic-fixture, MFA, recovery-key, UAT, launch, and owner-decision dependency in the Owner Action Ledger. Send one consolidated early request for all currently knowable human inputs with each required-by gate, then continue safe work; do not rediscover them one release at a time.
- When a newly discovered non-delegable action becomes critical, send one concise checklist stating the exact action, why only the owner can do it, safe input method, deadline/impact, and every workstream that continued meanwhile.
- Use current first-party documentation for unstable provider, API, security, pricing, or platform facts. Label observed, documented, proposed, implemented, deployed, and verified states distinctly.
- Use synthetic data by default. Keep private raw evidence outside the public repository and publish only sanitized result metadata or opaque evidence references.
- Do not modify frozen v6–v10 prototype evidence. For queued v11–v35 packages, either complete the packages needed as UX inputs to the relevant release, or have the council record why release-specific design evidence supersedes a package. Never silently abandon the queue or count a prototype pass as production evidence.
- Use destructive actions only when explicitly covered by the approved app-scoped runbook, exact targets have been resolved read-only, a verified recovery path exists, and rollback authority is recorded.
- If a gate fails during a release or deployment, stop the affected mutation, preserve evidence, roll back the exact scoped change when the threshold says to do so, and continue all unaffected work.

## Release execution loop

Execute P0/R0–R9 in dependency order. Preserve R0 as synthetic-only. R1 is the first release that may create an authentic owner memory, and only after its explicit authorization and entry gates. Use the documented architecture baseline unless an evidence-triggered ADR changes it: a modular TypeScript application, separate web/callback/worker responsibilities from an immutable image, SQLCipher/SQLite only after its R0 proof with PostgreSQL as the documented fallback, app-controlled encryption, loopback/private service boundaries, encrypted media, independent Restic backup, and a dedicated scoped deployment on the existing host only after admission passes.

For every release:

1. Refresh repository, live GitHub, deployment, dependencies, and evidence state.
2. Map the exact release tasks and `LID-*` requirements; verify all entry gates.
3. Hold a council readiness review covering outcome, UX states, architecture, threats, data shapes, test plan, migration, backup, restore, rollback, operations, evidence, and non-goals.
4. Update or create the governing PRD/PID, UX artifacts, ADRs, implementation slice, test plan, runbook, and decision record before relying on them.
5. Move a task to In progress only when actual work begins and a retrievable, public-safe evidence location exists.
6. Implement the smallest production-shaped vertical slice with synthetic fixtures, automated tests, typed privacy boundaries, explicit failure behavior, observability without content, and deterministic migration/rollback behavior.
7. Build an immutable release artifact tied to the source commit; create appropriate dependency inventory/SBOM and integrity digest evidence.
8. Run proportional unit, integration, contract, browser, accessibility, privacy, security, performance/capacity, failure, migration, backup, separate-path restore, rollback or forward-fix, and regression testing.
9. Use a fresh QA Agent for independent acceptance. Fix every release-blocking finding and rerun the complete affected matrix.
10. Deploy only to the environment allowed by the current release, using the exact scoped runbook and immutable artifact. Run negative access, callback, cache, secret, log, AI/photo, health, data-integrity, and co-resident non-regression checks.
11. Observe against predetermined thresholds. Roll back on a stop condition; do not reinterpret a threshold after failure.
12. Hold the council exit review. Use the standing R0–R8 delegation for routine promotion; perform a human walkthrough only when a governing requirement assigns an act that cannot be delegated under this Goal.
13. Update governing sources, generator, manifest, Markdown plan, GitHub, issue map, Excel workbook, Wiki, and running log as one accepted release change.
14. Mark a task or release Done only after its named acceptance evidence exists and is linked. A planning task proves only its document.

Release-specific gates remain controlling:

- **P0:** revalidate the planning baseline and record this execution authorization; do not relabel planning Done as implementation Done.
- **R0:** complete live sanitized host/collision/capacity/tunnel preflight; decide SQLCipher or evidence-triggered PostgreSQL fallback; deploy and recover only a synthetic private shell; prove coexistence, denial, restart, backup/restore, rollback, and non-regression.
- **R1:** deliver the first durable manual-text archive and only then admit one explicitly authorized owner fixture; prove restart, encrypted backup, separate restore, export, checksum, and rollback.
- **R2:** deliver authorized Telegram photo capture, gallery, dating, duplicate/cover/original lifecycle, and privacy-safe derivatives; structurally enforce that real photo data cannot enter AI.
- **R3:** deliver cross-month retrieval, deterministic private Search, Needs Date Review, and atomic redating with restored-index proof.
- **R4:** deliver revision, Correction/conflict, History, Trash, suppression, export/import, and lifecycle recovery before prospective synchronization.
- **R5:** pass the synthetic VoiceNotes contract before enabling prospective-only import; prove replay, reconciliation, revision, suppression, restore, and rollback.
- **R6:** evaluate and approve a text configuration before enabling generated text; enforce typed allowlists, protected fields, provenance, source-race handling, budget, failure, restore, and rollback.
- **R7:** evaluate and approve artwork before enabling it; permit only Visual-Brief input, preserve real-photo cover precedence, and prove safety, labeling, versions, suppression, budget, restore, and rollback.
- **R8:** prove integrated capacity, watermarks, alerting, fault isolation, restart behavior, privacy/security, supported browsers, accessibility, full backup/restore, and recovery readiness.
- **R9:** execute all 71 integrated requirement scenarios, owner UAT, the Recovery Ceremony, a minimum seven-consecutive-day observation window, severity/privacy/security gates, full rollback, and an explicit proceed/hold/rollback decision. Add no planned new feature scope.
- **R10:** keep dates blank and implementation Backlog unless current capacity evidence reaches the approved watermark. If an active hard watermark triggers before R9, R10 becomes a prerequisite to R9 proceed. Otherwise preserve the PID/manifest's normal post-R9 dependency on `REL-R9-001` and execute R10 only when its approved trigger occurs. In either branch, satisfy every migration, inventory, backup, rollback, and stage-specific owner-authorization gate.

Every new persistent data shape must join the inventory, encrypted backup, executed restore, export, deletion/lifecycle, migration, and rollback evidence before its release can close.

## Living GitHub roadmap and Excel release plan

Follow [`AGENTS.md`](../../AGENTS.md) exactly. The roadmap is a living control system, not a report produced at the end. Whenever accepted work changes status, evidence, scope, dates, milestone, dependencies, owner, priority, requirements, links, or rollback impact, update all affected projections in the same release change:

1. governing product, design, architecture, council, QA, deployment, and evidence sources;
2. `tools/generate_phase1_roadmap_manifest.mjs`;
3. the generated manifest and Markdown release plan;
4. repository issues, milestones, private Project fields/views/workflows when authorized;
5. the public issue map;
6. both Excel release-plan copies; and
7. the append-only running log.

Do not hand-edit only a generated projection. Regenerate, run the GitHub dry-run first, review the exact public payload, and use the least expansive authorized synchronization mode. Never use plain `--apply` against the established baseline. Use `--project-only` for a genuinely Project-only delta or `--apply --close-done` only after independent evidence review when repository metadata/state must change. Reconcile again immediately and after two consecutive read-only snapshots show workflows have quiesced.

For a genuinely Project-only field/view refresh after the dry-run, the exact command is:

```sh
node tools/sync_phase1_github.mjs --apply --project-only
```

This command does not model or safely replace the separate UI-managed workflow-hardening procedure below.

Before creating any council, QA, Wayfinder, or coordination issue, harden both delivery-view filters and Project auto-add/workflow boundaries to `label:phase1`, or keep the item out of Project #1. View filtering alone is not containment. Verify after the change that the `Phase 1 Status` and `Phase 1 Roadmap` views contain exactly the manifest's canonical issues and no unrelated item.

The sync dry-run does not model every UI-managed Project workflow. Before changing a view or workflow, export or privately capture its complete current configuration and take a sanitized issue/Project state snapshot; prepare an exact rollback recipe; mutate one rule or view at a time; assert that no unintended close/reopen or Status event occurred; and compare the full canonical projection immediately and after two consecutive quiescent read-only snapshots. If the configuration cannot be read or restored precisely, do not mutate it. Never publish private Project node IDs or sensitive screenshots while recording this evidence.

Preserve these Project contracts:

- Status is exactly Backlog, Next, In progress, or Done.
- `Phase 1 Status` is a board grouped by Status with the planning fields visible.
- `Phase 1 Roadmap` is a Roadmap grouped by Milestone with Start date and Target date driving bars.
- R10 has no milestone due date, Start date, or Target date until triggered.
- Issue state, Project Status, and evidence are independently reconciled.

For every accepted roadmap refresh, invoke the installed `spreadsheets:Spreadsheets` skill and rebuild the canonical seven-sheet workbook at `outputs/phase1/Life-in-Days-Phase1-Release-Plan.xlsx` plus its task-scoped review copy. Inspect every used row and formula, every current issue URL, all R10 blanks, all seven sheets, and paginated renders. Require matching workbook hashes and zero formula, clipping, stale-link, count, or layout errors. A successful builder smoke preview is not complete workbook verification.

Do not claim roadmap synchronization until every current manifest task agrees with its issue, Project fields, status, milestone, dates, evidence, requirement links, PRD/PID, design links, and workbook row. Record sanitized parity counts and zero mismatches.

## GitHub Wiki as a living projection

The Wiki is a generated reader projection, never an authority and never a substitute for merged source. Keep it current after every accepted release and after a material governing-document change that affects what an agent or operator must understand.

Before the first Goal-driven Wiki refresh, harden `tools/build-wiki.mjs` for repeatable publication:

1. remove stale hard-coded G1/“implementation not authorized” current-state language and derive or explicitly validate current state from committed authoritative evidence;
2. preserve a cumulative documentation-publication history instead of rewriting every generation as an initial publication;
3. retain collision detection, one-to-one source mapping, immutable source links, asset fingerprints, sidebar coverage, and Page Audit checks;
4. prove repeat generation is deterministic; and
5. prevent silent deletion of a live-only or non-generator-owned Wiki page.

For each Wiki publication:

1. merge the canonical repository change first and fetch the exact remote-`main` SHA;
2. generate from that SHA into a newly created empty protected staging directory;
3. fresh-clone the Wiki repository's `master` branch into another exact temporary directory;
4. compare Page Audit, filename sets, mappings, assets, links, and any live-only page;
5. replace only generator-owned pages. The execution council may preserve or index an unexpected live-only page after proving that doing so is non-destructive. This Goal authorizes removal of a page only when the prior Page Audit proves it was generator-owned, the merged source commit proves the canonical source was removed or renamed, a complete pre-publication Wiki clone makes recovery immediate, and the publication diff names the replacement or removal. Stop for the Product Owner when those proofs are incomplete or ownership remains unresolved;
6. run whitespace, mapping-count, link, fingerprint, sidebar, sensitive-content, and public-safety validation;
7. commit and push Wiki `master` normally, never force-push; and
8. verify remote Wiki HEAD, rendered Home, Documentation Index, Page Audit, source SHA, source coverage, and affected pages.

Never publish a Wiki built from an unmerged feature branch. At production, update previously truthful “not deployed” statements in README, INDEX, SECURITY, PUBLICATION, release/architecture evidence, Project README, and generated Wiki Home only after direct deployment evidence makes the new wording true.

## Running-log standing instruction

Invoke the installed `codex-project-running-log` skill throughout this Goal.

The Product Owner explicitly authorizes the skill's direct-write exception: append directly to the existing root `RUNNING_LOG.md` without presenting each entry for approval. This exception applies only to confirmation before append; every other skill rule remains mandatory.

- Read the current log header and latest entry before every append.
- Append only. Never rewrite, truncate, reformat, reorder, replace, rename, archive, or delete any prior byte.
- Use Asia/Kolkata local time in `YYYY-MM-DD HH:MM` format.
- Verify the append and the prior-byte prefix after every write.
- Never log secrets, authentic private content, personal identifiers, private URLs/topology, private Project node IDs, or raw service/provider responses.
- Distinguish local, committed, pushed, merged, deployed, verified, rolled back, Wiki-published, production-candidate, and production-accepted states precisely.

Append a substantive entry:

1. immediately after startup preflight, context digest, and execution-council formation;
2. after every council decision, scope/evidence change, or roadmap status transition;
3. before and after each live GitHub, Wiki, infrastructure, migration, deployment, or rollback mutation;
4. after every implementation candidate and each independent QA pass, failure, repair, and retest cycle;
5. at every release entry, exit, go/no-go, hold, rollback, incident, and recovery event;
6. before context compaction or handoff;
7. at least every 45 minutes of substantive active work when material state changed and no event-driven entry occurred; and
8. at the final production outcome or precise blocked terminal.

Do not create empty heartbeat entries. Every entry must let a cold-start agent recover the branch/commit/PR, changed files, exact checks and outcomes, council disposition, deployment/runtime state, GitHub/roadmap/Excel/Wiki state, open risks/blockers, next executable action, and honest self-critique.

## Non-delegable gates and escalation

Autonomy removes routine checkpoints; it does not permit invented authority or evidence. Only the Product Owner or a separately recorded human launch authority may complete these acts:

- authenticate through MFA/OAuth or provide a secret through an approved private channel;
- accept legal/provider terms, create a paid account, or approve a new/material recurring cost or processor choice;
- authorize an authentic journal/photo/voice fixture or first authentic-memory admission;
- complete owner UAT and subjective trust/usability decisions that the R9 PRD assigns to the owner;
- establish and personally control the two independent off-server recovery-key copies, including the required private password-manager and sealed-offline handling;
- participate in the Recovery Ceremony steps that require those privately held keys;
- issue the final production proceed, hold, or rollback decision; and
- authorize a trigger-driven R10 irreversible stage or retirement of the last local copy.

Stop only the affected action when:

- the exact target, authority, identity, ownership, path, port, data set, or rollback input cannot be resolved safely;
- a required credential or permitted spend/provider decision is unavailable;
- host admission, collision, resource reserve, encryption, access, privacy, security, accessibility, backup/restore, migration, data-integrity, or rollback evidence fails;
- a critical/high security or privacy finding or severity-1/2 defect remains;
- a destructive change lacks a successfully rehearsed recovery path; or
- authentic content or a human-only acceptance act is required.

When blocked, preserve state, roll back if the predetermined condition requires it, update the roadmap and running log honestly, and continue every other safe task. After exhausting safe alternatives, send one consolidated request with no secret in the message. Never mark the Goal complete, the release Done, or production accepted while such a gate is missing.

For a suspected credential or secret exposure, do not open a public issue or add details to the public roadmap, Wiki, workbook, pull request, or running log. Isolate the affected Life in Days route/service immediately when that is safe and app-scoped. Rotate only a credential proven to be Life in Days-exclusive and covered by a preapproved rotation/rollback runbook. If ownership is shared, unclear, or provider/account-wide, preserve evidence and escalate privately to the credential owner through the repository's private vulnerability-reporting path. Publish only a sanitized incident disposition after containment.

For the seven-day R9 observation, use the platform's recurring monitoring or wait mechanism rather than a blocking shell sleep. Continue documentation, defect triage, evidence reconciliation, and other safe work between observations. An elapsed timer without healthy evidence is not an observation pass.

Pin every observation sample to one source SHA, immutable artifact digest, schema/migration state, sanitized configuration digest, and enabled-provider set. A material production code, configuration, schema, migration, dependency, route, or provider-set change restarts the full seven-consecutive-day window. Permit an exception only when its non-impacting class was defined before the window and fresh independent QA records why the observation evidence remains comparable; never classify a fix retroactively merely to preserve elapsed time.

## Evidence and status truth

Use only Backlog, Next, In progress, and Done for canonical roadmap status. Do not invent Ready as a fifth synchronized status; instead say a task “passes the Definition of Ready.”

Evidence precedes status:

- Backlog means scoped, not selected for immediate execution.
- Next means entry conditions are being prepared and a named gate still controls start.
- In progress requires actual work plus a retrievable evidence location.
- Done requires the task's named acceptance evidence, linked and independently reviewed.

For every implementation/release claim, identify the source commit, immutable artifact digest, environment, exact test/evidence record, migration/backup/restore/rollback result, deployment result, and remaining limitations. Keep public evidence sanitized. A successful backup upload is not restore evidence. A merged PR is not deployment. A deployment is not production acceptance. A council document is not executed proof.

## Definition of Done for this Goal

Do not mark the Goal complete until all of the following are true:

- all 55 P0/R0–R9 work packages have their own named evidence; the current planning-only Done tasks have been revalidated without inflating their meaning;
- all 71 active P0 requirement IDs have executed integrated acceptance evidence, with no silent waiver, and all seven P3/P4 deferred IDs remain absent from R0–R9 product behavior;
- R0–R8 release gates pass in dependency order and R9 entry criteria are met;
- the released application is tied to a merged remote-`main` commit, immutable artifact digest, dependency inventory/SBOM, reviewed migrations, and reproducible deployment record;
- CI covers the production risk surface rather than only static prototype syntax;
- there are zero unresolved critical/high security or privacy findings and zero unresolved severity-1/2 defects;
- access/denial, callback, secret, cache, log, source integrity, photo-to-AI prohibition, budget, capacity, health, failure isolation, and co-resident non-regression checks pass;
- the required browser, keyboard, screen-reader, focus, contrast, zoom, responsive, theme, and reduced-motion matrix passes;
- every persistent shape is covered by inventory, export, encrypted backup, executed separate-path restore, deletion/lifecycle behavior, migration, and rollback or rehearsed forward-fix;
- owner UAT and the Recovery Ceremony pass with public-safe evidence, and the measured full recovery meets the governing target;
- the minimum seven-consecutive-day R9 observation window passes without the disqualifying events defined in the R9 PRD;
- an authorized human records the final proceed decision; if the decision is hold or rollback, execute and verify it and do not call the Goal complete;
- R10 is correctly untriggered/date-free; or an early hard trigger is completed before R9 proceed; or an ordinary post-R9 trigger follows the PID/manifest dependency and completes every approved stage and evidence gate after `REL-R9-001`;
- governing sources, manifest, Markdown plan, all managed issues, Project fields/views, issue map, Excel workbook, Wiki, and running log reconcile with zero unexplained mismatch;
- every released artifact link exists on remote `main`, the Wiki Page Audit names that exact source SHA, and the remote production and Wiki state have been read-only verified; and
- the worktree is safely handed off with no unexplained change, secret, private artifact, or uncommitted release state.

If the code, deployment candidate, and all agent-executable evidence are ready but a non-delegable owner act remains, report **Production candidate ready; owner gate outstanding**, list the exact missing proof, and keep the Goal incomplete. Never downgrade the terminal to make it attainable without the owner.

## First actions

Begin immediately:

1. validate the exact worktree, preserve unpublished commits, fetch remote state, and inspect GitHub/Project/Wiki state read-only; inspect private deployment state only after the deployment-authority record permits that read, otherwise record it as Unknown — private read authority pending;
2. invoke `codex-project-running-log`, read the log, and prepare the startup append after the next steps are complete;
3. perform the mandatory reading sequence and create the context digest;
4. form the five-role execution council in dependency-aware waves and create its current charter, QA charter, decision ledger, and direct-authorization addendum;
5. reconcile only authorization statements explicitly superseded by this activated Goal, plus the repeatability/current-state defects in the Wiki generator; preserve every truthful “not implemented/tested/deployed/verified” evidence disclaimer until direct proof changes it;
6. harden the GitHub Project `phase1` containment boundary before creating any non-delivery issue;
7. create the public-safe Owner Action Ledger for every foreseeable R0–R10 target, account, secret, provider, cost, authentic-fixture, MFA, recovery-key, UAT, launch, and owner-decision dependency; issue one consolidated early request for the currently knowable set with each required-by gate while continuing safe work;
8. refresh the 71-requirement/55-work-package baseline and identify the exact next executable task from evidence, not date;
9. append the verified startup/council baseline to `RUNNING_LOG.md`; and
10. execute the release loop continuously until the Definition of Done is met or only a precisely documented non-delegable gate remains.
