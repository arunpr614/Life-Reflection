# SPK-R0-001 — synthetic-foundation preparation product requirements

- **Task ID:** `SPK-R0-001`
- **Artifact kind:** `product`
- **Artifact state:** `in-review`
- **Roadmap status:** `In progress`
- **Milestone:** `R0`
- **Execution allowed:** `false`
- **Preparation review:** `P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION`
- **Intended later stage:** `P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION`
- **Scope/action pair:** `local-synthetic` / `synthetic-foundation`
- **Task-contract SHA-256:** `f58e65c56e58dc4b1e12deab68f7349822f7f95dd33eee4fcd4872243170fa23`
- **Evidence boundary:** This file itself authorizes no candidate authoring, test run, task-stage execution, private or external access, deployment, acceptance, task-status change, release, or production use. Only a later accepted Gate A record may permit bounded implementation-candidate authoring and independent local-synthetic candidate QA as preparation evidence; task-stage invocation still requires Gate B.
- **Immutable snapshot rule:** These proposal bytes remain `in-review` and `executionAllowed=false` after publication. Current Gate A state, if it later changes, exists only in the append-only preparation registry plus exact-main immutable-history replay and must never be inferred from this frozen file.

## Parent product and control sources

- [R0 parent PRD](../../product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md)
- [Governing product requirements](../../product/PRODUCT-REQUIREMENTS.md)
- [Task Definition of Ready](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [Stage 0 state contract](../../council/execution/releases/P0-P0-R0-STAGE0-STATE-CONTRACT.md)
- [Shared-host research runbook](../../architecture/HETZNER-SHARED-HOST-RUNBOOK.md)

These sources define the full R0 intent. This proposal narrows only the first host-independent preparation stage and does not make a parent planning document, research note, or historical task state authorizing.

## Task contract and bounded decision

The immutable task outcome remains:

> Prove namespaced shared-host fit with synthetic data, explicit capacity assumptions, non-regression, restore, and rollback.

The immutable full-task acceptance evidence remains:

> Research report plus sanitized live host capacity/topology, collision, restart, backup/restore, rollback, and co-resident non-regression evidence.

This Gate A proposal selects only the first task-owned pair, `local-synthetic / synthetic-foundation`. If Gate A later passes, it may permit preparation of a separate immutable implementation-and-evidence candidate for the intended stage, including the bounded independent local-synthetic QA needed to review it. It cannot invoke that candidate as the governed task stage. A separate Gate B decision would still be required before any task-stage execution.

In this proposal, **candidate preparation** means authoring the exact code, fixtures, verifier, and evidence contract and running only the independent local/public/fictional/synthetic QA needed to review that immutable candidate. **Task-stage execution** means invoking the approved module as the governed `SPK-R0-001` stage through the exact-main runtime. Gate A may permit the first activity; only Gate B may permit the second. Repository generation, review, CI, and normal guarded publication are control-plane governance operations, not a task-stage invocation or evidence that the task action ran.

The task's second, private-bearing pair and every live-host acceptance fact remain outside this stage. Therefore, even a later successful synthetic-foundation receipt would not complete `SPK-R0-001`, satisfy live-host acceptance, change its `In progress` Roadmap status, or authorize a private probe.

## Deterministic synthetic-foundation outcome

The intended later stage is defined to produce a host-independent, reproducible evidence bundle from one versioned fictional fixture set. The future candidate must freeze its seed, input schema, declared capacity envelope, expected results, command versions, normalization rules, and stop conditions before Gate B review. It must use no private endpoint, account, credential, authentic memory, authentic photo, or external service.

For identical approved inputs, two clean local runs must yield the same canonical pass/fail facts and content digests after excluding explicitly non-semantic run metadata such as elapsed time. The bundle must make each result independently traceable to this task, the exact stage, all eleven requirements, and the fifteen canonical P/T/D/QA scenario IDs. A failed assertion remains a visible failure; missing evidence cannot be inferred as success.

The bounded synthetic outcome is a decision-quality answer to: **Is the namespacing, boundary, recovery, health, and failure-isolation design internally coherent under fixed fictional conditions, and is a later private-host qualification safe to propose?** The only permitted conclusion is one of `synthetic foundation passes`, `synthetic foundation fails`, or `blocked — private evidence required`. None is a live-host fit or release claim.

## Included requirement traceability

| Requirement | Required preparation contract for the intended later stage | Explicit later acceptance boundary |
| --- | --- | --- |
| `LID-SCP-001` | Model exactly one fictional allowlisted human and prove that anonymous, second-user, sharing, invitation, and public-route cases are denied by the synthetic contract. | Real identity policy, hostname, and owner access require separately authorized private evidence. |
| `LID-OPS-001` | Define fictional valid, missing, malformed, wrong-owner, and expired assertion fixtures at the application boundary; no password store or live identity provider is used. | Live access policy, MFA, session, tunnel, and assertion verification remain later private acceptance. |
| `LID-OPS-002` | Define isolated fictional machine-callback host/path/method/size cases and prove they cannot resolve a human, session, media, or archive route in the synthetic model. | Real callback endpoints, provider authenticity, rate controls, DNS, and routing remain later gated work. |
| `LID-OPS-003` | Use named non-secret sentinels to specify repository, fixture, client, log, export, and evidence scans; define rotation without archive-history rewrite. | Runtime secret injection, permissions, custody, and rotation require separately authorized runtime evidence. |
| `LID-OPS-004` | Define a disposable fictional plaintext sample, versioned authenticated-ciphertext expectation, independently supplied fictional test material, and negative decrypt/tamper cases. | Real key custody, disk/swap behavior, and deployed data-at-rest evidence remain later acceptance. |
| `LID-OPS-008` | Specify fictional same-origin personal-shaped responses, private/no-store headers, shared-cache denial, and absence of storage locators or decryption material from browser-visible output. | Live proxy, object-store, browser, and shared-cache behavior remain later private evidence. |
| `LID-OPS-011` | Define a local disposable snapshot, integrity manifest, separate-empty-path restore, content comparison, corrupt/missing snapshot failures, and the rule that creation alone is not restore proof. | Live repository checks, off-server backup, retention, sampled restore, and full drill remain later acceptance. |
| `LID-OPS-012` | Define a fictional recovery rehearsal using two opaque fictional custody-location descriptions and disposable test material, without representing owner sign-off or real custody. | The human Recovery Ceremony, real off-server copies, real recovery material, and launch gate remain outside this stage. |
| `LID-OPS-014` | Define durable evidence states exactly as `unknown`, `never run`, `success`, `delayed`, `failed`, and `blocked`; only `success` may be labeled `Healthy`, and job start alone never changes the result to success. | Live job evidence, capacity observations, provider health, and product System Health remain later work. |
| `LID-OPS-016` | Define an allowlisted fictional structured-log schema, forbidden-sentinel scan, retention transition, and public-safe diagnostic evidence containing no personal-shaped content. | Deployed logging, filesystem retention, support bundles, and runtime redaction remain later acceptance. |
| `LID-OPS-018` | Define deterministic restart/idempotency, dependency-failure isolation, fixed resource-envelope, and no-HA/no-SLA cases without asserting host capacity. | Actual restart, scheduler, provider outage, host capacity, and co-resident non-regression require live authorized evidence. |

All eleven IDs are included; no new requirement is introduced. `LID-UP-004` and `LID-DEF-001` through `LID-DEF-006` remain excluded. Later-release feature requirements remain outside this proposal.

## Product acceptance scenarios

1. **`SPK-R0-001-P-001` — Outcome:** the task produces exactly the immutable outcome above and the result is reviewable without implying a later task or release is complete. For this stage, the proposed evidence must additionally label the bounded synthetic conclusion and the unsatisfied live-host remainder.
2. **`SPK-R0-001-P-002` — Boundary:** every mapped requirement is addressed, every deferred requirement stays absent, and no authentic/private/human-only act is inferred from synthetic or public evidence. Any input that would require such an act stops as `blocked — private evidence required`.
3. **`SPK-R0-001-P-003` — Evidence:** the task's named acceptance evidence is retrievable, task-bound, independently reviewable, and no broader than the supported claim. The intended stage may supply only the local synthetic portion; the sanitized live-host evidence named by the task contract remains outstanding.

These scenario IDs and their task-level meaning are unchanged. This proposal only makes their first-stage synthetic boundaries deterministic.

## Preparation deliverables

Gate A, if accepted, may authorize preparation of a candidate containing only the minimum fictional/local materials needed for later Gate B review:

1. a versioned fictional fixture and declared synthetic resource envelope;
2. a deterministic namespace, boundary, health-state, restart, recovery, rollback, and isolation oracle;
3. exact local commands and dependency versions with no network requirement;
4. canonical requirement/scenario result records and content digests;
5. public-safe failure, interruption, and blocked-private records; and
6. an explicit inventory of live-host facts that remain unproven.

This list is a preparation contract, not evidence that any material exists or any check ran.

## Product metrics and stop conditions

The later synthetic stage can pass only if all eleven requirement rows and all fifteen canonical scenarios receive an explicit deterministic result, two clean-run canonical outputs agree, forbidden-content scans report zero findings, and the remaining live-host acceptance inventory is nonempty and plainly labeled. No scenario is optional or waivable. Any mismatch, optimistic state, hidden remainder, nondeterministic result, authentic/private input, external dependency, or attempt to broaden the claim stops the stage.

No synthetic result may be promoted to a host-capacity, provider, deployment, restore, co-resident, acceptance, release, or production metric.

## Resolved proposal decisions

- `SPK-R0-001` remains one task; this proposal neither splits it nor creates another Roadmap item.
- The first intended stage uses exactly `local-synthetic / synthetic-foundation`. A later Gate B envelope may bind sequence `1` and a null predecessor; this Gate A proposal persists neither field.
- All inputs are versioned, fictional, host-independent, public-safe, and locally reproducible; external calls are forbidden.
- Canonical result facts and digests are deterministic; wall-clock timing may be reported only as non-semantic observation and cannot affect pass/fail.
- A private-required condition is a blocked result, never permission to inspect a target.
- Synthetic-stage success, if later proven, is entry evidence for a later decision and is not full-task acceptance or a Roadmap status transition.

There is no unresolved product choice inside this Gate A preparation scope. Gate A Council review is still pending, but that pending approval is a required gate rather than an open product decision.

## Deferred decisions and non-goals

Private-host identity, topology, capacity thresholds derived from measurements, route and process allocation, SQLCipher-versus-PostgreSQL selection, providers, accounts, credentials, DNS/tunnel configuration, off-server repository, real recovery custody, runtime supervision, deployment, restart, backup/restore, rollback, and co-resident checks are deliberately deferred to separately authorized later stages and acceptance gates.

This proposal does not include product UI, prototype validation, application implementation, test execution, host probing, account authentication, credential use, provider/spend change, Project mutation, authentic content, release acceptance, or production activity.

## Product Manager disposition

**In review / Hold.** The synthetic-foundation product contract is bounded and has no open product decision within Gate A scope. It remains a preparation proposal only; five-seat exact-candidate review and a later accepted Gate A record are required before candidate authoring or candidate QA, and a separate Gate B decision is required before any task-stage execution.
