# SPK-R0-001 — synthetic foundation QA proposal

- **Task ID:** `SPK-R0-001`
- **Artifact kind:** `qa`
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

## QA inputs

- [Task product requirements](./P0-SPK-R0-001-PRD.md)
- [Task technical proposal](./P0-SPK-R0-001-TECHNICAL-PLAN.md)
- [Task design proposal](./P0-SPK-R0-001-DESIGN-SPEC.md)
- [R0 product requirements](../../product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md)
- [Task Definition of Ready](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [QA Lead contract](../../council/agents/P0-QA-LEAD.md)
- [Owner Action Ledger](../../council/execution/P0-OWNER-ACTION-LEDGER.md)

## Bounded QA objective

Make the exact code-derived 15-scenario set reviewable for one later `local-synthetic` / `synthetic-foundation` candidate. This document defines fixtures, expected assertions, evidence shape, independence, severity, and stop rules. It records no executed QA.

Gate A can permit preparation only. After an accepted Gate A record exists, a registered evidence producer may execute the exact candidate's local/public/fictional/synthetic scenarios to create pre-review evidence, and an independent QA reviewer may verify or reproduce them without becoming the candidate's designated evidence producer. That work is not a governed task-stage invocation. Gate B alone may authorize the later exact-main stage runtime; neither activity may use private systems, real providers, authentic memories, photos, photo-derived data, credentials, or external mutation.

Publication QA must prove the exact `M → A → AM → P → PM` chain before treating that record as accepted. It must reject direct `P`-after-`M`, `PM=[M,P]`, unarmed or cancelled publication, the wrong inventory operation or target hash, uncleared `next`, a missing installed `current` entry, extra paths, stale or interleaved parents, octopus or tree-mismatched merges, and any record not replayable from exact current main. For this first nonempty registry publication, the required inventory operation is `add`, producing protected current path 55. These are publication-oracle checks only and add no scenario ID to the canonical set of fifteen.

## Exact traceability binding

- **Dependency:** `PC-001`; Gate A requires one passing opaque public-safe dependency-entry reference.
- **Requirement IDs (11):** `LID-SCP-001`, `LID-OPS-001`, `LID-OPS-002`, `LID-OPS-003`, `LID-OPS-004`, `LID-OPS-008`, `LID-OPS-011`, `LID-OPS-012`, `LID-OPS-014`, `LID-OPS-016`, `LID-OPS-018`.
- **Fixture class:** local, public, fictional, and synthetic only; fixed schema/seed or canonical bytes, canonical digest, and authentic-content exclusion required.
- **Scenario cardinality:** exactly 15 unique canonical IDs: three Product, three Technical, three Design, and six QA.
- **Current result:** proposal only; every scenario below is `Not executed — accepted Gate A preparation required`.

## Canonical 15-scenario proposal matrix

| Scenario | Reviewable expected assertion | Planned candidate evidence for Gate B | Current state |
| --- | --- | --- | --- |
| `SPK-R0-001-P-001` — Outcome | The later stage produces the bounded fictional capacity/collision, isolation, encryption, recovery, health, replay, and receipt outcome without implying task or release completion. | Exact candidate/stage binding, canonical fixture digest, per-contract results, and closed permitted claim | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-P-002` — Boundary | All 11 requirements are traced; deferred requirements remain absent; no private, authentic, human-only, provider, deployment, or external act is inferred. | Requirement matrix, excluded-scope scan, authentic-content exclusion, and external-I/O proof | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-P-003` — Evidence | Evidence is retrievable, task/stage/candidate-bound, public-safe, independently reviewable, and no broader than the supported local-synthetic claim. | Canonical receipt and evidence index with hashes, reviewer identity, limitations, and permitted claim | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-T-001` — Boundary and failure | Invalid, absent, repeated, interrupted, or out-of-order inputs fail safely and leave no partial or falsely successful state. | Table-driven boundary/fault results, before/after digests, durable events, and no-success assertions | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-T-002` — Recovery | Every persistent synthetic shape introduced or changed by the candidate is inventoried, backed up, restored in a separate empty destination, compared, and rolled back or forward-fixed. | Inventory/backup/restore/compare/rollback digests, separation proof, interruption cases, and elapsed time | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-T-003` — Isolation | Privacy, security, resource, dependency, and co-resident failure cannot broaden access, leak forbidden data, or corrupt the accepted fictional baseline. | Cross-surface denial, collision/capacity, dependency-failure, content-scan, and baseline comparison results | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-D-001` — Complete states | The applicable normal proposal/result, empty/never-run, loading/long-running, validation/dependency-error, interruption/timeout/stale-result, destructive restore/rollback-rehearsal, blocked-private, and unavailable/not-configured states have the exact truthful content and permitted actions defined by the Design specification; durable health within them uses only `unknown`, `never run`, `success`, `delayed`, `failed`, or `blocked`. | State inventory and copy/transition review bound to durable evidence sources | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-D-002` — Responsive/accessibility | Every human-facing candidate surface is understandable and operable under the declared responsive, keyboard, focus, screen-reader, contrast, zoom, theme, and motion conditions. | Surface inventory plus applicable automated/manual accessibility results; absence of a rendered surface is stated, not generalized to R0 | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-D-003` — Truth/privacy | Copy never claims success before durable evidence, never confuses backup with restore, and never exposes authentic/private data in review artifacts. | Copy assertions, state-source trace, receipt/log scan, and forbidden-claim scan | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-QA-001` — Happy path and exact task outcome | Canonical fictional inputs fit reserve, avoid collisions, preserve surface separation, round-trip authenticated ciphertext, restore/compare/rollback, reach evidence-backed health states, and emit one public-safe receipt. | One complete deterministic happy-path record with exact expected/actual results and all intermediate digests | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-QA-002` — Invalid, missing, duplicate, replayed, interrupted, timeout, stale, dependency-failure, and retry behavior | Each isolated negative fails with the specified state, at-most-once effect, stable receipt identity where applicable, and no optimistic success. | One-row-per-mutation negative matrix, crash-boundary injection, replay counters, durable events, and retry result | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-QA-003` — Privacy/security/authorization, secret/log/cache/export/backup/evidence scans, and AI exclusions | Human/callback authorization remains disjoint; wrong-key/tamper fails closed; cache and log rules hold; every retained artifact is public-safe; no AI path receives content. | Authorization matrix, ciphertext canary scan, forbidden-field/sentinel scans, cache assertions, dependency/capability inventory | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-QA-004` — Schema, migration, compatibility, inventory, backup, separate-path restore, rollback/forward-fix | Versioned fictional shapes reject unknown/incompatible input, restore only to a proved empty separate destination, compare exactly, and return to the baseline or an explicit non-success recovery state. | Version matrix, canonical inventories, distinct-destination proof, before/after hashes, rollback and forward-fix decisions | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-QA-005` — Supported browsers, keyboard, focus, screen reader, contrast, 320 px, text/page zoom, landscape, themes, reduced motion | Every declared human-facing surface passes its complete applicable accessibility matrix; a candidate with no rendered UI states that limitation and cannot claim R0 UI coverage. | Declared surface/browser matrix, automated results, manual keyboard/screen-reader notes, renders, defects, or explicit bounded no-surface evidence | Not executed — accepted Gate A preparation required |
| `SPK-R0-001-QA-006` — Dependencies, co-resident/non-regression scope, performance/capacity bounds, observability and exact health states | `PC-001` evidence is current; capacity/collision arithmetic is deterministic; synthetic baseline remains unchanged; health uses exactly the six durable values; no SLA, HA, live-fit, or production claim appears. | Dependency record, boundary/overflow vectors, repeated-run digest equality, baseline comparison, health-state transitions, and claim scan | Not executed — accepted Gate A preparation required |

The IDs and cardinality above are the canonical task-contract set. A Gate B evidence bundle that omits, duplicates, renames, or substitutes a scenario fails review.

## Frozen fixture and oracle families

### Access and surface isolation

- one allowlisted fictional human assertion plus absent, malformed, expired, and non-allowlisted variants;
- one separately authorized fictional callback plus wrong authorization class, route, host class, method, body bound, and replay variants;
- cross-surface attempts proving human authorization cannot authorize callback work and callback authorization cannot retrieve human, session, search, media, or export behavior; and
- personal-shaped but non-personal response headers proving same-origin, private, no-store behavior without a storage locator or key.

### Capacity and collision

- exact usable-capacity equality, one unit below, and one unit above for every closed fictional dimension;
- missing, unknown, negative, non-integer, duplicate, and overflow inputs;
- no collision plus one exact duplicate in each closed namespace class; and
- permuted but canonically equivalent inputs producing byte-equivalent decisions and digests.

The oracle admits only when every dimension preserves its declared reserve and every namespace is collision-free. It never silently remaps or removes an existing fictional resource.

### Encryption and recovery

- fictional canary encryption in a versioned envelope, correct-key exact recovery, wrong/missing key, unknown version, truncation, and tamper;
- nonce uniqueness/non-reuse checks plus scans showing that a nonce is retained only in its authenticated envelope and that no canary, key, or partial plaintext appears in retained storage, logs, receipt, cache, or evidence;
- encrypted backup representation with secret-free manifest, restore into a proved distinct empty destination, canonical inventory/relationship/hash comparison, and exact baseline rollback; and
- failure injection before backup completion, during restore, during comparison, and during rollback, each retaining a non-success durable state.

### Health, logging, replay, and crash recovery

- all durable health values exactly `unknown`, `never run`, `success`, `delayed`, `failed`, and `blocked`, with `Healthy` used only as a presentation label for `success`;
- start/attempt/upload/backup events that prove they cannot alone produce `success`;
- logs containing only timestamps, opaque identifiers, and enumerated event/error classes, plus forbidden-field and 30-day synthetic-clock expiry checks;
- first request, exact replay, conflicting digest under the same key, interruption before durability, interruption after durability but before acknowledgement, restart, timeout, stale dependency, and retry; and
- one dependency failure that remains visible without corrupting the baseline or broadening access.

## Requirement-to-scenario coverage

| Requirement | Required scenario coverage |
| --- | --- |
| `LID-SCP-001` | `P-001`, `P-002`, `T-001`, `T-003`, `D-003`, `QA-001`, `QA-003` |
| `LID-OPS-001` | `T-001`, `T-003`, `D-001`, `D-003`, `QA-002`, `QA-003` |
| `LID-OPS-002` | `T-001`, `T-003`, `QA-002`, `QA-003` |
| `LID-OPS-003` | `P-002`, `P-003`, `T-003`, `D-003`, `QA-003` |
| `LID-OPS-004` | `T-001`, `T-002`, `T-003`, `QA-003`, `QA-004` |
| `LID-OPS-008` | `T-003`, `D-003`, `QA-003` |
| `LID-OPS-011` | `P-001`, `T-002`, `D-003`, `QA-001`, `QA-004` |
| `LID-OPS-012` | `P-002`, `T-002`, `T-003`, `QA-003`, `QA-004` |
| `LID-OPS-014` | `P-001`, `T-001`, `D-001`, `D-003`, `QA-001`, `QA-002`, `QA-006` |
| `LID-OPS-016` | `P-003`, `T-003`, `D-003`, `QA-003` |
| `LID-OPS-018` | `T-001`, `T-003`, `D-001`, `QA-002`, `QA-006` |

Scenario abbreviations in this table retain the full `SPK-R0-001-` prefix. Gate B requirement evidence may cite multiple canonical scenario IDs, but every requirement needs its own passing record and no scenario result substitutes for another requirement.

## Gate B candidate-evidence protocol

If Gate A and the accepted-preparation publication later pass, a registered evidence producer and a distinct Independent QA reviewer must establish the exact local-synthetic candidate evidence required for a later Gate B review. This is preparation work under the accepted Gate A boundary, not invocation of the governed task stage. Together they must:

1. Verify the accepted preparation review, intended stage ID, task-contract digest, immutable implementation candidate, module path/hash/capability profile, exact scope/action pair, and public-safe dependency evidence before running anything.
2. Use only the candidate's canonical fictional fixtures from a clean local synthetic environment with external egress and private targets absent.
3. Record exact commands, tool/runtime versions, source and artifact hashes, fixture schema/digest, controlled clock/seed, environment class, expected/actual results, start/end times, defects, and retests.
4. Have the registered evidence producer execute all 15 scenario IDs, the complete negative mutation set, rollback/recovery checks, and repeated determinism runs. Preserve per-case results; an aggregate count alone is insufficient.
5. Have Independent QA inspect the full evidence bundle and independently verify or reproduce the required assertions, including scans of source, dependencies, logs, receipt, backup representation, restored output, and retained evidence for forbidden fields, sensitive sentinels, authentic content, media carriers, credentials, private targets, external calls, and unsupported output.
6. Confirm the public-safe candidate-evidence receipt binds `receiptKind=candidate-qa-evidence-v1`, `lifecycle=gate-a-preparation`, `taskStageInvoked=false`, and `gateBStageReceiptSha256=null`, plus the exact candidate and intended stage, and records only the bounded local-synthetic claim and limitations. It must not contain or imitate runtime-owned Gate B terminal fields.
7. Re-run affected cases after any candidate byte, dependency, fixture, schema, configuration, or evidence change; a changed candidate invalidates prior QA.

No command is authorized by this proposal file. After an accepted Gate A record exists, exact commands and expected counts must come from the immutable implementation candidate and may run only as local/public/fictional/synthetic preparation evidence. They do not become a task-stage invocation, and cannot authorize one; the separate five-seat Gate B publication must still precede any exact-main stage runtime call.

## Evidence bundle contract

Executed evidence must contain:

- `receiptKind=candidate-qa-evidence-v1`, `lifecycle=gate-a-preparation`, `taskStageInvoked=false`, and `gateBStageReceiptSha256=null`;
- task ID, preparation-review ID, intended stage ID, scope/action pair, task-contract digest, candidate revision, module/definition digests, and accepted-preparation record digest;
- all 11 requirement IDs and all 15 scenario IDs with individual expected, actual, pass/fail, evidence-reference, and defect/retest fields;
- fixture class/schema/digest and explicit fictional, synthetic, public, local, authentic-content, private-target, and external-I/O attestations;
- exact tool versions and commands, controlled time/seed inputs, environment digest, dependency inventory, and sanitized capability map;
- before/after, backup, restore, comparison, rollback, idempotency, crash/restart, capacity/collision, health, cache, log, and privacy/security results;
- registered evidence-producer ID/role; Independent QA reviewer ID/role; evidence that those identities are distinct from each other and the implementer; timestamps, unresolved findings, limitations, and one exact permitted claim; and
- one canonical public-safe candidate-evidence receipt whose hash is bound by the evidence index and which cannot satisfy or masquerade as the separate exact-main Gate B terminal receipt.

Evidence never includes raw fixture content, real host values, routes, ports, paths, topology, account/provider details, credentials, keys, assertions, recovery values, private responses, authentic memories, photos, or photo-derived data.

## Independence, severity, and stop gate

The candidate evidence producer must be an active `evidence-producer` identity and may execute and record the candidate-QA evidence bundle after accepted Gate A. The Independent QA reviewer must be an active `qa` identity distinct from the proposal author, every implementation author, and every designated candidate evidence producer. Independent QA may create only its independent review/attestation record; it must not author or alter the candidate evidence it certifies. Review of this proposal is not executed QA and does not satisfy that independence requirement.

Any missing scenario or requirement record, non-deterministic decision, unexplained digest drift, partial effect, replay duplication, wrong-key plaintext, separation failure, optimistic Health state, forbidden log/cache/evidence field, private/authentic/external access, unresolved Sev-1/Sev-2, critical/high privacy or security finding, restore/compare/rollback failure, dependency mismatch, publication mismatch, or specialist veto produces `Hold` or `Roll back`. There is no waiver by aggregate pass count.

The stage remains narrower than the full `SPK-R0-001` acceptance evidence. A Gate B pass for this synthetic foundation cannot prove sanitized live-host capacity/topology, deployment, owner recovery ceremony, private access, release acceptance, or production readiness and cannot make the task `Done`.

No owner action is due or satisfiable for Gate A or local synthetic QA. Private deployment state remains **Unknown — private read authority pending**.

## Independent QA disposition

**In review / Hold.** The exact 15-scenario proposal is reviewable. No QA has been executed, and no implementation, execution, private action, deployment, acceptance, status transition, release, or production claim is supported.
