# Life in Days Phase 1 — P0 task Definition of Ready

- **Effective:** 2026-08-14
- **Applies to:** All 58 canonical roadmap tasks and their existing GitHub issues
- **Decision:** Product Council `Hold` on substantive execution until the task-bound dossier passes
- **Implementation state at adoption:** No `ENG-*` task is `In progress` or `Done`
- **Private deployment state:** **Unknown — private read authority pending**

## Purpose

Every task must be understandable, reviewable, testable, reversible, and represented truthfully in its GitHub issue and Project fields before substantive work begins. Release PRDs, the global implementation plan, the UX specification, research, and prototypes are parent inputs. They do not by themselves authorize a task.

The existing 58 issues remain canonical. This policy creates no additional delivery issue. Each issue receives one task-bound dossier made of six `P0-` artifacts stored inside the Phase1 project folder.

## Required task dossier

For task `<TASK-ID>`:

```text
docs/work-items/<TASK-ID>/
  P0-<TASK-ID>-PRD.md
  P0-<TASK-ID>-TECHNICAL-PLAN.md
  P0-<TASK-ID>-DESIGN-SPEC.md
  P0-<TASK-ID>-QA-PLAN.md
  P0-<TASK-ID>-DELIVERY-CHECKLIST.md
  P0-<TASK-ID>-COUNCIL-READINESS.md
```

The generated central register is `docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json`. The manifest embeds the same record for each task. Every issue body and the live Project must link the task-bound artifacts rather than presenting shared parent sources as task approval.

The editable machine state is `docs/project/P0-PHASE1-TASK-READINESS-STATE.json`. The task-artifact generator creates missing files, preserves every existing specialist-authored file, reads its declared artifact state, recomputes hashes, and rebuilds the register. `--refresh-drafts` is an explicit bootstrap/remediation action that may replace draft content; it must not be used after specialist drafting begins without reviewing the exact affected files. It never replaces `in-review`, `approved`, `blocked`, or `not-applicable` artifacts.

## Discipline contracts

### Product artifact

The Product Manager owns a task-specific outcome, exclusions, exact requirement IDs, dependencies, acceptance scenarios, metric/evidence contract, product risks, owner actions, and unresolved product decisions. A release PRD/PID is linked as a parent source and remains intact.

Product is always required. `not-applicable` is not permitted for the Product artifact.

### Technical plan

The Technical Architect owns the task-specific modules/files, APIs, schemas, data invariants, ADRs, trust boundaries, threats, secrets/log/cache rules, concurrency/replay/idempotency behavior, capacity assumptions, observability, migration, compatibility, backup, separate-path restore, rollback/forward-fix, implementation sequence, and stop conditions.

Architecture may be `not-applicable` only when the dedicated artifact gives a concrete task-specific rationale and the Architect concurs in the council record. Shared plans are inputs, not approval.

### Design specification

The UI/UX Designer owns all applicable journeys, information architecture, content, normal/empty/loading/error/interruption/destructive states, responsive behavior, keyboard/focus/screen-reader semantics, target sizes, contrast, zoom, theme, reduced motion, privacy cues, and usability evidence.

Design may be `not-applicable` only when the dedicated artifact explains why no human-facing, operator-facing, error, status, accessibility, or content decision exists and the Designer concurs. A prototype is design evidence only, never runtime proof.

### QA plan

Independent QA owns scenario IDs, fixtures, negative/regression scope, functional/privacy/security/browser/accessibility coverage, schema/migration checks, backup versus separate-path restore, rollback, defect severity, evidence bundle fields, reviewer independence, stop conditions, and the permitted claim.

QA is always required. `not-applicable` is not permitted for the QA artifact.

### Delivery checklist

The Project Manager owns dependencies and their entry evidence, issue/Project status, dates, risks, owner actions, branch/PR/check strategy, artifact hashes, evidence links, workbook/Wiki/running-log parity, rollback coordination, and post-change reconciliation.

Delivery is always required. `not-applicable` is not permitted for the Delivery artifact.

### Council readiness

The council artifact records individual Product, Design, Architecture, QA, and Project verdicts, the exact reviewed commit, artifact hashes, unresolved blockers, approved execution scope, human gates, and one overall verdict.

The readiness register also carries a structured record for each of those five seat verdicts: verdict, named reviewer, exact reviewed revision, and rationale. A prose table without the matching structured record cannot authorize execution.

Allowed verdicts are:

- `hold`
- `ready-local-synthetic`
- `ready-private-execution`
- `proceed-release`
- `historical-non-authorizing`
- `not-applicable`

No chair, schedule, status, issue closure, or existing artifact overrides a specialist veto.

## Artifact states

Allowed states are `missing`, `draft`, `in-review`, `approved`, `blocked`, and `not-applicable`.

- `missing`: required file does not exist.
- `draft`: task-bound content exists but has not completed specialist review.
- `in-review`: stable candidate is under specialist/council review.
- `approved`: accountable specialist approved the exact recorded hash and reviewed commit.
- `blocked`: an identified gate prevents approval.
- `not-applicable`: permitted only for Architecture or Design, with a task-specific rationale and council concurrence.

Editing an approved artifact changes its hash, invalidates approval, and returns the task to review.

## Structured approval record

Each of the six artifact kinds has an `artifactReviews` record containing `decision`, named `reviewer`, `reviewedRevision`, `artifactSha256`, `notApplicableRationale`, and `specialistConcurrence`. An `approved` decision is valid only when the named reviewer approved the exact registered SHA-256 at a Git commit that exists, is an ancestor of fetched `origin/main`, and contains the same artifact bytes. `not-applicable` is valid only for Architecture or Design and requires a concrete task-specific rationale plus explicit specialist concurrence.

Design also has a fail-closed structured coverage record. `journeyIds` must be nonempty, and every required state dimension (`normal`, `empty`, `loading`, `error`, `interruption`, `destructive`) and accessibility dimension (`keyboard`, `focus`, `screenReader`, `targetSize`, `contrast`, `zoom`, `reducedMotion`) must point to one or more registered task acceptance-scenario IDs. A valid Design `not-applicable` decision uses the rationale/concurrence route instead; it cannot be inferred from a task type or an empty UI section.

The five `council.seatVerdicts` records are Product, Design, Architecture, QA, and Project. Each must carry an allowed verdict, named reviewer, exact reviewed revision, and rationale. The seat revision is the task candidate reviewed by the council. The later Council artifact may record that candidate revision in a subsequent commit; its own artifact review then identifies the later commit containing the exact Council artifact bytes. This two-revision sequence avoids a self-referential commit hash.

Private execution additionally requires a public-safe opaque `privateAuthorityEvidenceReference` matching `P0-AUTH-*`. It is only a pointer to the separately controlled authority evidence; it must contain no host identifier, account identifier, credential, secret, or private evidence payload.

## Machine-checkable start rule

`executionAllowed` may become `true` only when all conditions are true:

1. exactly one register record, manifest task, issue-map entry, GitHub issue, and Project issue item share the stable task ID;
2. Product, QA, Delivery, and Council artifacts exist and are `approved`, with named exact-hash/exact-revision artifact reviews;
3. Architecture and Design are `approved` or validly `not-applicable`, with named exact-hash/exact-revision review plus task-specific rationale and specialist concurrence for `not-applicable`;
4. approved Design has complete structured journey, state, and accessibility coverage;
5. all five individual council-seat records have a named reviewer, rationale, the same exact task-candidate revision, and a permitting verdict with no specialist veto;
6. every basename begins `P0-`, task/kind markers match, and SHA-256 hashes match;
7. the reviewed commits exist, are ancestors of fetched `origin/main`, and contain the registered artifact bytes;
8. task requirement IDs exactly match the manifest and task acceptance scenario IDs are nonempty;
9. all required dependency entry evidence—not merely dependency status—passes;
10. `openDecisions` and unresolved council blockers are empty;
11. council verdict permits the requested execution scope;
12. private authority and its public-safe opaque evidence reference are verified for a private action;
13. due human-only owner actions are complete; and
14. no privacy, security, recovery, accessibility, evidence, or specialist veto remains.

An `In progress` roadmap status cannot substitute for this rule. A task can be historically `Done` as planning evidence and still be `historical-non-authorizing` for downstream execution.

## Current adoption disposition

- The 13 existing planning `Done` tasks retain their narrow historical status and receive `historical-non-authorizing`; they do not make a dependent execution task Ready.
- `SPK-R0-001` remains historically `In progress`, but `executionAllowed` is `false`. Only readiness-document remediation and already-authorized local/public control work may continue; no private probe is allowed.
- The four `Next` R0 tasks and all 40 Backlog tasks are `hold`.
- Every generated task artifact begins as `draft`; creation is not approval.
- No authentic content or authentic media is used in dossier creation or agent-controlled QA.

## GitHub issue and Project projection

Every issue body includes:

- task outcome, requirements, dependencies, status, and dates;
- task-bound Product, Architecture, Design, QA, Delivery, and Council links with states and hashes;
- parent release PRD/PID, global technical/UX inputs, evidence references, rollback/restore impact, owner actions, execution scope, blockers, and explicit `executionAllowed` state; and
- a warning that shared sources, prototypes, code, CI, deployment, or backup upload do not prove acceptance.

Project fields add `Architecture plan`, `QA plan`, `Delivery control`, `Council decision`, `Artifact readiness`, and `Execution scope`. Existing issue bodies and Project values are synchronized only from an exact merged remote-main revision and verified read-only afterward.

## Owner information boundary

No owner input is needed to create and review local/public task dossiers. Private-system work remains blocked on `P0-OA-001`; workflow-rule mutations remain blocked on `P0-OA-002` unless the exact configuration and rollback are captured. Later authentic-content, credentials/OAuth, provider/privacy/spend, recovery-key/ceremony, final R9, and triggered R10 acts remain just-in-time human gates in the Owner Action Ledger.
