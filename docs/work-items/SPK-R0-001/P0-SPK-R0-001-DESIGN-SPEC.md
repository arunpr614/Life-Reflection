# SPK-R0-001 — synthetic-foundation evidence design specification

- **Task ID:** `SPK-R0-001`
- **Artifact kind:** `design`
- **Artifact state:** `in-review`
- **Roadmap status:** `In progress`
- **Milestone:** `R0`
- **Execution allowed:** `false`
- **Preparation review:** `P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION`
- **Intended later stage:** `P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION`
- **Scope/action pair:** `local-synthetic` / `synthetic-foundation`
- **Task-contract SHA-256:** `f58e65c56e58dc4b1e12deab68f7349822f7f95dd33eee4fcd4872243170fa23`
- **Design applicability:** `applicable` only to the reviewer/operator evidence surface for this proposed stage.
- **Evidence boundary:** This file itself authorizes no candidate authoring, test run, task-stage execution, private or external access, deployment, acceptance, task-status change, release, or production use. Only a later accepted Gate A record may permit bounded implementation-candidate authoring and independent local-synthetic candidate QA as preparation evidence; task-stage invocation still requires Gate B.
- **Immutable snapshot rule:** These proposal bytes remain `in-review` and `executionAllowed=false` after publication. Current Gate A state, if it later changes, exists only in the append-only preparation registry plus exact-main immutable-history replay and must never be inferred from this frozen file.

## Design inputs

- [Task product requirements](./P0-SPK-R0-001-PRD.md)
- [R0 parent PRD](../../product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md)
- [Task Definition of Ready](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [Stage 0 state contract](../../council/execution/releases/P0-P0-R0-STAGE0-STATE-CONTRACT.md)
- [UX Design Review](../../council/UX-DESIGN-REVIEW.md)
- [Governing UX specification](../../design/UX-SPECIFICATION.md)

The shared UX sources provide language and accessibility constraints. They do not make a frozen prototype, screenshot, product shell, or parent design review evidence for this task candidate.

## Applicability and experience objective

This design applies only to the human-readable evidence used by a reviewer or operator to inspect the proposed local synthetic stage: Markdown proposal and report views, canonical machine-result summaries, and bounded command-line progress/failure output. It specifies no Life in Days product UI, owner journey, private shell, System Health screen, deployment console, or prototype change.

The evidence surface must let a reviewer answer, on first read:

1. which exact task, preparation review, intended stage, pair, revision, and fixture the evidence concerns;
2. whether the display is a proposal, never-run state, in-progress observation, terminal synthetic result, interruption, or blocked-private stop;
3. which of the eleven requirements and fifteen canonical scenarios have explicit results;
4. which result facts are deterministic and which observations are non-semantic;
5. which live-host facts remain unproven; and
6. the one safe next action, without implying implementation, execution, task acceptance, status change, release, or production readiness.

## Evidence information hierarchy

Every reviewer/operator view follows this order:

1. One exact lifecycle label: `Preparation proposal — execution not allowed`, `Gate A preparation accepted — task-stage execution not allowed`, `Candidate QA — Gate A preparation evidence`, or the later governed Gate B stage state.
2. Task ID, preparation review ID, intended stage ID, scope/action pair, source revision, task-contract digest, and fictional fixture identifier.
3. Bounded conclusion: `not run`, `running`, `synthetic foundation passes`, `synthetic foundation fails`, `interrupted`, or `blocked — private evidence required`.
4. Requirement and scenario counts with explicit pass/fail/blocked/not-run values.
5. Determinism comparison, public-safety result, and exact content digests.
6. Failure/interruption detail and one safe retry, review, or stop action.
7. Live-host acceptance remainder and non-claims.
8. Detailed evidence records.

No green icon, `Healthy` label, completed progress indicator, repository state, merged proposal, or validator pass may substitute for the bounded conclusion. `Healthy` is reserved for durable health state `success`; it never describes Gate A or overall task readiness.

The publication-state presentation is equally fail-closed. `M` (proposal merged), `A/AM` (registry hash armed), and unmerged `P` (consume candidate) must all retain `Preparation proposal — execution not allowed`; arm-only, consume-only, stale-hash, cancelled, or tree-mismatched states must never appear accepted, ready, or green. Only after `P` directly parents `AM`, `PM=[AM,P]` is the exact normal merge, and exact-main replay verifies the consumed protected hash may the evidence surface show `Gate A preparation accepted — task-stage execution not allowed`.

## Reviewer/operator journeys

### `SPK-R0-001-D-001` — Review complete state coverage

1. Open the proposal or later local evidence summary and encounter the boundary label before any result.
2. Verify exact task/stage/pair/contract/fixture bindings and see all eleven requirement IDs and fifteen scenario IDs.
3. Inspect the applicable normal, empty, loading, error, interruption, destructive, and blocked-private state without relying on color.
4. Compare the deterministic result facts and digests while keeping elapsed time and other non-semantic observations separate.
5. End at a bounded synthetic conclusion plus the still-outstanding live-host acceptance inventory.

### `SPK-R0-001-D-002` — Review responsive and accessible evidence

1. Navigate headings, summaries, tables, links, disclosures, and any future operator controls by keyboard in a logical order.
2. Read the decision, blockers, and next action before dense hashes through a screen reader and linearized layout.
3. Retrieve complete identifiers without clipping at 320 px, 200% text size, 400% page zoom, and landscape orientation.
4. Distinguish all states with text and structure in light/dark themes and with reduced motion.
5. Return focus to the initiating control after dismissing a detail or cancellation confirmation, if such a control exists in a later operator wrapper.

### `SPK-R0-001-D-003` — Preserve truth and privacy at failure boundaries

1. A missing, malformed, stale, interrupted, or contradictory record renders a fail-closed state and never inherits a prior success label.
2. A private endpoint, account, credential, authentic-content, owner-only act, or external-call requirement stops at `blocked — private evidence required` without attempting access.
3. Destructive-looking local restore/rollback rehearsal steps remain clearly labeled disposable and synthetic, show the affected fictional target, and require an accepted Gate A record plus the exact immutable candidate before candidate QA. A later governed task-stage run separately requires Gate B.
4. Evidence shows opaque public-safe references only and exposes no private topology, secret, recovery value, account identifier, authentic memory, photo, or photo-derived data.
5. The surface states that synthetic evidence cannot satisfy sanitized live-host acceptance.

## Complete state contract

| Required state | Reviewer/operator presentation | Permitted action and truth boundary |
| --- | --- | --- |
| **Normal / proposal** | `Preparation proposal — execution not allowed`, exact bindings, proposed coverage, and live-host remainder. | Review or return Hold; no run control and no readiness claim. |
| **Normal / accepted preparation** | `Gate A preparation accepted — task-stage execution not allowed`, exact PM/history replay binding, and the unchanged live-host remainder. | Author and independently test only the exact local/public/fictional/synthetic candidate within the accepted Gate A boundary; do not invoke the task stage or infer Gate B. |
| **Normal / candidate-QA result** | `Candidate QA evidence — not a stage receipt`, exact terminal synthetic conclusion, requirement/scenario results, determinism comparison, digests, and remainder. | Submit the immutable evidence for independent QA and Gate B review; do not invoke the task stage, change task status, or infer live-host fit. |
| **Normal / governed stage result** | `Gate B stage receipt`, exact terminal synthetic conclusion, bound stage receipt, requirement/scenario results, digests, and remainder. | Submit for the separately governed next decision; do not change task status or infer live-host fit. |
| **Empty / never run** | State separately whether accepted-Gate-A candidate-QA evidence is absent and whether a Gate B stage receipt is absent; show zero results, expected fixture/version, and why either absence is not a pass. | Review the missing preparation, evidence, or stage gate and stop. |
| **Loading / long-running** | Exact lifecycle (`candidate QA` or `governed stage`), phase, bounded item count, elapsed observation, cancellation consequence, and `authorization unchanged`. No optimistic percentage is shown unless the denominator is fixed. | Observe/cancel candidate QA only inside accepted Gate A preparation, or use the later approved stage runner only after Gate B; do not navigate into a private target. |
| **Validation or dependency error** | Stable error class, affected requirement/scenario, expected versus sanitized actual shape, no partial-success language, and one corrective action. | Correct the fictional input or proposal and obtain a fresh review where bindings changed. |
| **Interruption / timeout / stale result** | `Interrupted — terminal result not established`, last durable local phase, stale binding if any, and prior accepted evidence kept distinct. | Start only a fresh, separately authorized attempt; never reuse an ambiguous partial result. |
| **Destructive restore / rollback rehearsal** | `Disposable synthetic target only`, exact fictional target identifier, planned deletion/replacement boundary, pre-state digest, recovery path, and consequence. | Run as candidate QA only after accepted Gate A and exact disposable/local candidate binding; a later task-stage invocation separately requires Gate B. |
| **Blocked — private evidence required** | Name the missing class in public-safe terms, show `No private or external access attempted`, preserve all local results, and list the later authority/gate category without private detail. | Stop and seek a separate authorized stage; never offer bypass, force, pasted credentials, or retry against a target. |
| **Unavailable / not configured** | Distinguish unavailable local dependency from a private prerequisite and from durable job evidence; neither appears `Healthy`. | Repair only a fictional/local dependency within the approved preparation boundary, otherwise stop. |

Success, failure, stale, blocked, and interrupted states retain their text labels in every rendering. A prior synthetic pass never masks a current malformed or mismatched binding.

## Requirement-to-evidence-surface mapping

| Requirement IDs | Design consequence for this evidence surface |
| --- | --- |
| `LID-SCP-001`, `LID-OPS-001` | Show the one-fictional-owner access matrix, allow/deny result counts, and explicit absence of a live identity/provider claim. |
| `LID-OPS-002` | Separate machine-boundary cases from human-route cases and expose bounded host/path/method/size result classes without real endpoint details. |
| `LID-OPS-003`, `LID-OPS-016` | Show only sentinel-scan totals, allowlisted log fields, retention result class, and opaque references; never render tested values or raw logs. |
| `LID-OPS-004`, `LID-OPS-008` | Show algorithm/version and ciphertext/cache assertion classes without plaintext, test material, storage locator, signed URL, or browser key. |
| `LID-OPS-011`, `LID-OPS-012` | Keep snapshot creation, repository check, restore, decrypt comparison, and fictional rehearsal distinct; never call backup creation a restore or rehearsal an owner ceremony. |
| `LID-OPS-014` | Render durable states exactly as `unknown`, `never run`, `success`, `delayed`, `failed`, and `blocked`; use `Healthy` only for `success`. |
| `LID-OPS-018` | Show restart/idempotency, dependency isolation, fixed synthetic resource envelope, and no-HA/no-SLA limitation separately from unmeasured live capacity. |

All eleven task requirements are represented. This mapping governs evidence presentation only; it neither supplies nor claims requirement evidence.

## Accessibility and responsive contract

- Use one logical heading hierarchy, semantic table headers, descriptive links, ordered lists, and a linear text fallback for every dense table.
- Put boundary, conclusion, blockers, and next action before hashes and detailed records in DOM, Markdown, and CLI reading order.
- Preserve full copyable IDs and digests with wrapping; abbreviated values are secondary labels only.
- At 320 px, 200% text size, 400% page zoom, and landscape orientation, content reflows without two-dimensional scrolling except an intrinsically tabular evidence matrix, which also has a linear fallback.
- Keyboard order follows visual/reading order; every later interactive control has an accessible name, visible focus, at least a 24 by 24 CSS-pixel target or equivalent spacing, and predictable focus entry/return.
- Status announcements in a later interactive wrapper use a polite live region for phase changes and an assertive alert only for a blocking failure; repeated progress does not flood assistive technology.
- State, diff, and pass/fail meaning never rely on hue, icons, position, animation, or monospace treatment alone. Light and dark themes retain WCAG 2.2 AA text and component contrast targets.
- Reduced-motion mode removes nonessential animation; interruption and progress remain understandable as static text. No timed reading or motion-dependent action is required.
- Screen-reader order presents table caption/context, row headers, result, evidence reference, and limitation. Raw decorative punctuation and repeated digests are not used as accessible names.

These are proposed verification criteria. This document makes no rendered accessibility-conformance claim.

## Design verification scenarios

1. **`SPK-R0-001-D-001` — Complete states:** the applicable state family above is specified with exact content and permitted actions. Verification must cover normal/proposal, normal/result, empty, loading, validation/dependency error, interruption/timeout/stale, destructive rehearsal, unavailable/not-configured, and blocked-private states.
2. **`SPK-R0-001-D-002` — Responsive/accessibility:** the task remains understandable and operable across the named responsive, keyboard, focus, screen-reader, contrast, zoom, theme, and motion conditions. Evidence must retain complete identifiers, text/non-color cues, logical order, and a linear table fallback.
3. **`SPK-R0-001-D-003` — Truth/privacy:** copy never claims success before durable evidence, never confuses backup with restore, and never exposes authentic/private data in review artifacts. The synthetic/live boundary and `No private or external access attempted` stop message remain explicit.

These are the unchanged canonical Design scenario IDs. The expanded criteria bind them only to the proposed reviewer/operator evidence surface.

## Resolved and deferred design decisions

Design is applicable; it is not `not-applicable`. The surface, hierarchy, state vocabulary, complete state coverage, responsive behavior, accessibility criteria, blocked-private stop, and synthetic/live claim boundary are resolved for Gate A review. The canonical evidence is text-first Markdown/JSON/CLI output; no product UI or visual prototype is required or proposed.

Private-shell layouts, owner first-use, access-denial and session-expiry product screens, live System Health, deployment controls, provider-specific recovery UI, actual component technology, runtime timing, private evidence source, and host/provider behavior are deferred to their owning later tasks or separately authorized stages. A frozen prototype is design direction only and cannot prove this surface, runtime behavior, accessibility, privacy, recovery, or acceptance.

## Design vetoes and non-goals

- No Life in Days product UI, owner flow, prototype edit, screenshot proof, or visual-polish deliverable.
- No private target, account, endpoint, topology, credential, recovery material, authentic memory, authentic photo, or photo-derived data.
- No control that starts governed task-stage execution, performs an external mutation, changes Roadmap status, or bypasses Gate B. A candidate-QA control, if one later exists, must be visibly bound to accepted Gate A preparation and cannot invoke the stage runtime.
- No optimistic success, backup-equals-restore wording, hidden live-host remainder, force/retry-on-private action, or color-only state.
- No assertion that this proposal or a later local synthetic result proves full-task implementation, live-host fit, deployment, acceptance, release, or production readiness. A later result may prove only the exact candidate QA cases it records after accepted Gate A.

## UI/UX Designer disposition

**In review / Hold.** The reviewer/operator evidence experience is fully specified for exact-candidate Gate A review, including the complete state and accessibility families. It remains preparation-only. No product UI or prototype proof is supplied. An accepted Gate A record is required before candidate-QA evidence can be produced, and a separate Gate B decision is required before any governed task-stage invocation.
