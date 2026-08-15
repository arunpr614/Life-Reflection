# PC-001 — readiness-control evidence design specification

- **Task ID:** `PC-001`
- **Artifact kind:** `design`
- **Artifact state:** `in-review`
- **Roadmap status:** `Done` — historical planning only
- **Milestone:** `P0`
- **Execution allowed:** `false`
- **Design applicability:** `applicable` to operator-facing CLI, Markdown, issue, Project, workbook, and Wiki evidence
- **Evidence boundary:** no Life in Days application UI, frozen prototype, or R0 feature flow changes under this task.

## Inputs

- [Task product requirements](./P0-PC-001-PRD.md)
- [Task technical plan](./P0-PC-001-TECHNICAL-PLAN.md)
- [Task Definition of Ready](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [Governing UX specification](../../design/UX-SPECIFICATION.md)

## Experience objective

Make the control plane understandable without teaching an operator its JSON schema. A reviewer must distinguish historical Roadmap status, artifact completeness, execution permission, structural validation, publication state, blockers, and the next safe action on first read. No success styling or word may imply product implementation, deployment, restore, or release evidence.

## Operator journeys

### `PC-001-D-001` — Author and reviewer inspect a dossier

1. Start from issue #3 or the task register and see the bounded corrective scope.
2. Read `Roadmap status`, derived `Artifact readiness`, derived `Execution allowed`, execution scope, blockers, and next action before dense detail.
3. Open all six task-bound artifact links and see their content/review state, reviewer role, candidate revision, digest, and public-safe evidence reference.
4. Compare the task candidate with the approval record without mistaking the later record for a self-review.
5. End with one explicit result: still held, ready for local synthetic work, ready for private work, or release proceeding.

### `PC-001-D-002` — Project Manager publishes reconciled evidence

1. Run structural generation/validation and see that a pass means only `Control validation: Passed`.
2. Run the local structural validator against one captured manifest/issue-map snapshot before fetch; only after it passes may start/sync preflight fetch exact main. A dirty, stale, wrong-branch, unmerged, or snapshot-drift state is denied.
3. Review generated issue/Project/workbook/Wiki payloads and their source SHA before mutation.
4. Publish only from exact merged main, then verify two quiescent zero-mismatch snapshots.
5. Preserve issue #3 as closed and `Done — historical planning`; no R0 task is promoted by this slice.

### `PC-001-D-003` — Operator encounters a failed or protected action

1. The control stops before an unsafe mutation and exits nonzero.
2. Evaluator/start/refresh output identifies its stable gate code, task ID, failed condition, and safe next action. A sync structural failure instead emits the complete review projection labeled `Control validation: Failed`, exits nonzero, and blocks live modes before fetch or `gh`; detailed validator findings remain in the validator output.
3. For `--refresh-drafts`, output previews affected/protected artifacts and reports created/refreshed/preserved counts only after success.
4. No message exposes a secret, private target/account/topology, raw response, Project node ID, recovery value, authentic content, or photo-derived data.
5. Retry is offered only after the named stale/missing evidence is corrected; a partial result is never presented as success.

## First-read evidence hierarchy

1. Bounded remediation scope and non-goals.
2. `Roadmap status: Planning Done — historical`.
3. `Artifact readiness: Incomplete | Ready` with `Derived from six task artifacts`.
4. `Execution allowed: No | Yes` with execution scope.
5. Blocking gate codes and next safe action.
6. Six artifact links and effective/review states.
7. Candidate revision, dossier digest, role-bound attestations, and public-safe evidence references.
8. Structural validation, publication, external parity, and remaining limitations.

## Existing 17-field Project mapping

No new Project field, field rename, view, or workflow is required. Gate B changes only the generated values in the existing managed payload:

| Required concept | Existing Project value | Exact presentation contract |
| --- | --- | --- |
| Historical Roadmap state | `Status` plus `Task summary` | Native Status stays `Done`; the first Task summary line is `Roadmap status: Planning Done — historical`. |
| Derived artifact completeness | `Artifact readiness` | Exact `Incomplete` or `Ready`; no icon-only or validation-pass substitute. |
| Derived permission and bounded scope | `Execution scope` | First line `Execution allowed: No|Yes`; second line `Scope: <canonical scope>`. The field name remains unchanged. |
| Blockers and next safe action | `Task summary` | Exact line order is Roadmap status, task description, `Blockers: <count and stable-code preview or None>`, then `Next action: <one safe action>`. |
| Six artifacts and effective review evidence | `PRD / PID`, `Design artifact`, `Architecture plan`, `QA plan`, `Delivery control`, `Council decision`, and `Task dossier` | Dedicated links remain; Task dossier lists all six. Issue body carries the expanded state/reviewer table. |
| Candidate, digest, evidence, and structural validation | `Evidence` | Ordered lines: `Control validation`, `Candidate revision`, `Dossier digest`, `Required evidence`, bounded reference count with exact URLs retained in the linked issue/dossier, and `Remaining limitation`. Missing, blank, malformed, or partial candidate/digest/authority/reference values use `Not yet recorded`; complete valid values are preserved. |
| Traceability and ownership | `Requirement IDs`, `Owner role` | Stable IDs and accountable role; no readiness inference. |
| Schedule and prioritization | `Start date`, `Target date`, `Priority` | Existing values remain estimates/control metadata and never imply permission. R10 blanks remain blank. |

The issue body remains the detailed accessible surface for seat rationales, Design coverage, private-authority state, owner actions, open decisions, and blockers. The Project fields provide a first-read summary plus links; every value is generated from the same manifest/dossier record.

## Frozen language

| Concept | Required presentation |
| --- | --- |
| Historical task state | `Roadmap status: Planning Done — historical` |
| Artifact completeness | `Artifact readiness: Incomplete` or `Artifact readiness: Ready`; always labeled derived |
| Permission | `Execution allowed: No` or `Execution allowed: Yes`; always labeled derived |
| Structural validator | `Control validation: Passed` or `Control validation: Failed`; never `Ready` or `Approved` |
| Missing review | `Not yet reviewed` |
| Missing binding/evidence | `Not yet recorded` for missing, blank, malformed, or partial candidate/digest/private-authority/reference values |
| Private denial | `Blocked — private authority required` |
| Deployment unknown | `Unknown — private read authority pending` |
| Historical enum | Show `Historical — non-authorizing` alongside `historical-non-authorizing` |
| Local enum | Show `Ready — local synthetic only` alongside `ready-local-synthetic` |

Blank, `null`, `undefined`, a malformed/partial binding, a green success icon, and an unlabeled `Passed` are not acceptable substitutes for these states. Shortened hashes may be visual conveniences only when the full value remains retrievable and copyable.

## State contract

| State | Required behavior and content |
| --- | --- |
| Normal/held | Show all derived values, blocking gates, and next safe action; historical `Done` remains visually and verbally separate. |
| Empty/never reviewed | Use `Not yet reviewed` / `Not yet recorded`; never infer a pass from absence. |
| Bounded processing | Name the non-mutating phase, current task/count, and that authorization has not changed. |
| Validation error | Evaluator/start/refresh surfaces show stable gate code, task ID, failed condition, corrective action, and nonzero result. Sync shows `Control validation: Failed`, complete review JSON, and nonzero result while the validator retains detailed findings. No ambiguous partial success. |
| Stale candidate | State which binding is stale or mismatched and require a new exact-candidate review. |
| Interrupted/retry | Preserve prior accepted state, say no authorization changed, and require a fresh complete rerun. |
| Denied/blocked | Explain the missing scope/role/action/authority class without exposing private detail. |
| Origin unavailable | Fail closed; distinguish network/fetch uncertainty from a task gate failure. |
| Protected refresh | Preview protected paths/reasons and refuse before mutation; never suggest force/overwrite. |
| Successful refresh | Report created/refreshed/preserved counts and subsequent validation command; success does not imply readiness. |

## Accessibility and responsive contract

- Use semantic Markdown heading order and real table headers; critical readiness text also appears in plain text outside dense tables.
- Use meaningful link labels that name task and artifact, not repeated `here` labels.
- Never use color alone for pass/fail/hold; text and stable codes carry the state.
- Keep evidence readable with wrapping at 320 px, 200% text enlargement, and 400% page zoom; avoid fixed-width layouts that clip full identifiers.
- CLI order is scope, state, blocker, action, details so screen readers encounter the decision before hashes.
- Native links and controls preserve keyboard order, focus visibility, activation, and return behavior; no custom focus trap or motion is introduced.
- Tables have a logical reading order and a linear fallback; status glyphs, if any, have equivalent text.
- Reduced-motion, light/dark theme, target-size, and contrast requirements inherit the native renderer; this documentation plan makes no conformance claim without rendered evidence.

## Structured coverage

- **Journey IDs:** `PC-001-D-001`, `PC-001-D-002`, `PC-001-D-003`.
- **Normal, empty, loading:** `PC-001-D-001`.
- **Error, interruption, destructive/protected action:** `PC-001-D-003`.
- **Keyboard, focus, screen reader, target size, contrast, zoom, and reduced motion:** `PC-001-D-002`.
- **Machine-state wording:** the register and manifest show `applicable` plus these mapped scenario IDs while reviews remain Hold; operator text says `Proposed coverage mapped — approval pending` until a valid Design attestation exists.

## Design verification scenarios

1. **`PC-001-D-001` — Evidence comprehension:** the first-read hierarchy and exact labels prevent historical status, validation, readiness, and permission from being conflated.
2. **`PC-001-D-002` — Accessible publication:** every operator surface preserves semantic order, non-color cues, full evidence retrieval, and readable/operable responsive behavior.
3. **`PC-001-D-003` — Safe failure:** stale, missing, denied, interrupted, unavailable-origin, and protected-refresh states stop safely and provide a public-safe next action without partial-success language.

## Gate B implementation evidence contract

- The exact implementation candidate must include this Design artifact in its complete non-excluded Git diff; listing an unchanged Design hash beside changed code is not candidate-bound review evidence.
- CLI, generated Markdown, issue bodies, Project values, and workbook cells retain the frozen labels above. `Status` remains historical roadmap state; `Artifact readiness`, `Execution allowed`, validator result, blocker codes, and next action remain separately labeled and retrievable.
- The 48-case sync oracle preserves this language through a captured manifest/issue-map snapshot: byte drift across validator/projection/output fails, all malformed/missing bindings use the exact fallback, Failed dry-run JSON remains fully reviewable and exits nonzero, and live modes stop before network.
- The final workbook review and canonical copies must hash-match within one build. Its resolved Review Guide must show the exact raw roadmap-manifest SHA-256, all 20 paginated renders must remain readable without clipped identifiers, and the workbook must retain text/non-color state cues, full identifiers, semantic table headers, R10 blanks, and zero formula errors.
- Exact candidate review evidence records the candidate revision, complete task-file digest, six artifact hashes, independent workbook disposition, and all five seat references in the audit-only `controlReviews.PC-001` entry of `P0-EXECUTION-APPROVAL-REGISTRY.json`. That already-declared descendant path may report executed checks, but the evaluator ignores `controlReviews`; only the separately governed `taskApprovals` section can participate in a future execution decision.
- There is still no Life in Days product UI or prototype change in this slice. The only rendered artifact is the synthetic planning workbook; no authentic photo, journal entry, private target, credential, or photo-derived data may be opened or represented.

## Design vetoes and exclusions

- Design is not `not-applicable`; these operational surfaces are human-facing.
- No editable derived readiness/permission and no shared green/pass treatment for validation and authorization.
- No marker-only overwrite after review, candidate, seat, attestation, or evidence binding exists.
- No application/prototype change; `UX-R0-001` owns R0 product flows.
- No private or authentic data and no production/recovery claim in public evidence.
- No inference that issue #3 being closed/Done means hardening or R0 is execution-ready.

## UI/UX Designer disposition

**In review / Hold.** The operator experience contract and Gate B evidence boundary are complete for exact-candidate Council review. Product-UI screenshots remain not applicable because this slice changes no product UI; workbook/CLI evidence is reviewed only for the bounded operator-control claims above. PC-001 and every R0 task remain non-authorizing.
