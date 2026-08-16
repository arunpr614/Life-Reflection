# SPK-R0-001 — synthetic foundation technical proposal

- **Task ID:** `SPK-R0-001`
- **Artifact kind:** `architecture`
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

## Governing inputs

- [R0 product requirements](../../product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md)
- [Phase 1 implementation plan](../../architecture/PHASE1-IMPLEMENTATION-PLAN.md)
- [Shared-host research report](../../research/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md)
- [Shared-host runbook](../../architecture/HETZNER-SHARED-HOST-RUNBOOK.md)
- [Task Definition of Ready](../../council/execution/P0-PHASE1-TASK-DEFINITION-OF-READY.md)
- [Execution authorization](../../council/execution/P0-PHASE1-EXECUTION-AUTHORIZATION.md)
- [Owner Action Ledger](../../council/execution/P0-OWNER-ACTION-LEDGER.md)

The research report and runbook are planning inputs. Their host, runtime, database, provider, and recovery examples are not observed facts and are not selected by this proposal.

## Bounded technical objective

Freeze the behavior of one later, reversible, local synthetic foundation candidate that can model shared-host admission, isolation, encryption, recovery, health, logging, and interruption without contacting or describing a real target. The later candidate must produce a public-safe receipt from fictional inputs. It cannot establish that a live host fits, that an R0 implementation exists, or that the task's named acceptance evidence has been obtained.

Gate A may permit only preparation of that candidate. The accepted preparation record, exact implementation candidate, independent executed QA, rollback evidence, stage approval, publication history, and guarded exact-main runtime remain distinct later gates.

## Exact task binding

- **Outcome:** Prove namespaced shared-host fit with synthetic data, explicit capacity assumptions, non-regression, restore, and rollback.
- **Dependency:** `PC-001`; one passing public-safe dependency-entry reference is required by Gate A. Historical status alone is insufficient.
- **Requirement IDs (11):** `LID-SCP-001`, `LID-OPS-001`, `LID-OPS-002`, `LID-OPS-003`, `LID-OPS-004`, `LID-OPS-008`, `LID-OPS-011`, `LID-OPS-012`, `LID-OPS-014`, `LID-OPS-016`, `LID-OPS-018`.
- **Canonical scenarios (15):** `SPK-R0-001-P-001` through `SPK-R0-001-P-003`; `SPK-R0-001-T-001` through `SPK-R0-001-T-003`; `SPK-R0-001-D-001` through `SPK-R0-001-D-003`; and `SPK-R0-001-QA-001` through `SPK-R0-001-QA-006`.
- **Fixture boundary:** local, public, fictional, and synthetic only. Fixtures must carry a reproducible canonical digest and an explicit authentic-content exclusion.
- **Current permission:** artifact authoring and proposal review only; `preparationAllowed` has not been granted and `executionAllowed=false`.

## Frozen behavioral contracts

### 1. Disjoint human and callback surfaces

The candidate must model two disjoint surfaces, using fictional assertions and opaque route tokens:

- a human assertion can authorize only the human surface; absence, expiry, invalidity, or a non-allowlisted fictional identity is denied before content or state access;
- callback authorization is independent of the human assertion and is checked before body processing or a durable state change;
- human routes, sessions, media responses, search, and export behavior are unreachable from the callback surface;
- callback routes and callback-only actions are unreachable from the human surface;
- an unknown route, host class, method, authorization class, or oversized synthetic body fails closed with no partial state and no success receipt; and
- personal-shaped synthetic responses are same-origin and carry private, no-store behavior; no storage location, signed locator, or decryption material is exposed.

No real identity, account, hostname, port, tunnel, callback provider, token, payload, or personal content is permitted. This contract proves only boundary behavior in the fictional model.

### 2. Deterministic fictional capacity and collision model

Capacity inputs are non-negative safe integers in a closed, versioned fictional resource-dimension set. Namespace inputs are canonical opaque strings paired with a closed fictional namespace class. The model must reject missing dimensions, negative or non-integer values, arithmetic overflow, duplicate keys, and unknown classes.

For every dimension, admission is true only when the candidate peak is no greater than fictional available capacity minus the separately declared reserve. Overall admission is true only when every dimension passes and no candidate namespace token exactly equals a pre-existing token in the same namespace class. Equality at the usable-capacity boundary passes; one unit over fails. A collision is reported, never deleted, overwritten, ignored, or silently remapped.

Canonicalized equal inputs must return byte-equivalent decisions and digests independent of input ordering. The receipt reports only dimension classes, pass/fail decisions, and canonical digests—not real values, names, topology, or co-resident workload facts. A modeled pass is not live capacity or coexistence evidence.

### 3. Synthetic authenticated-encryption and wrong-key behavior

The later candidate must use only fictional plaintext canaries and test-only key material. It must demonstrate these storage-adapter properties without selecting a production database or key service:

- stored bytes are a versioned authenticated-encryption envelope containing the ciphertext and the unique non-secret nonce required to decrypt it, and do not contain the plaintext canary;
- the matching synthetic key and version recover exactly the canonical input bytes;
- a missing key, wrong key, unknown version, truncated ciphertext, or modified ciphertext fails authentication before returning plaintext or success;
- every encryption uses a fresh nonce that is never reused with the same synthetic key, while the envelope retains only the nonce needed for decryption;
- no partial plaintext, key material, or canary appears in the receipt, log, cache, export, or retained ordinary-disk fixture, and no nonce appears outside its versioned authenticated envelope; and
- encryption scope and limitations are explicit: this is not end-to-end, zero-knowledge, production-key, or copied-live-disk evidence.

Algorithm, library, key custody, rotation implementation, and database integration are later reviewed implementation decisions. Gate B must bind their exact module bytes before any stage can execute.

### 4. Backup, separate-path restore, comparison, and rollback

The candidate must start from a canonical fictional baseline, create one encrypted synthetic backup representation plus secret-free manifest, and restore into a distinct empty synthetic destination. It must refuse a destination that is non-empty, aliases the source, or cannot prove separation.

Restore comparison covers canonical record/object inventory, relationship counts, ciphertext digests, version metadata, and expected-absence rules. Every comparison must pass before the restore is described as verified. Backup creation, repository/package inspection, restore, comparison, and rollback are separate results; one cannot substitute for another.

Rollback returns the candidate-owned synthetic state to the exact pre-action baseline digest, preserves the source and backup representations, and repeats the invariant and collision checks. Any interruption, mismatch, or rollback failure leaves a durable failure/recovery-required state and forbids a success receipt. No actual filesystem location, backup service, recovery key, or private repository is selected or accessed here.

### 5. Durable health vocabulary

Every modeled durable health value is exactly one of `unknown`, `never run`, `success`, `delayed`, `failed`, or `blocked`. `Healthy` is only a presentation label for durable `success`.

- start, enqueue, attempt, upload, backup creation, and process liveness do not produce `success`;
- `success` requires the scenario's completed durable evidence;
- missing or untrusted evidence maps to `unknown`, no attempt maps to `never run`, overdue incomplete work maps to `delayed`, an unsuccessful completed attempt maps to `failed`, and a known unmet prerequisite maps to `blocked`;
- restart reconstructs state from durable events rather than optimistic in-memory state; and
- backup health and restore-verification health remain separate facts.

The public receipt must preserve the lower-case durable value and may separately include its presentation label. It must never collapse unknown, delayed, failed, or blocked into Healthy.

### 6. Sanitized local-log allowlist

The modeled local structured log schema is closed to timestamps, opaque identifiers, and enumerated event/error classes. Task, stage, requirement, and scenario IDs may appear only as public control identifiers. Any additional field is rejected.

Journal-like text, prompts, captions, filenames, routes, bodies, assertions, account or target identifiers, host facts, credentials, keys, recovery material, ciphertext, provider responses, signed locators, stack dumps containing input, and authentic or photo-derived data are forbidden. Logs use no analytics or external sink. A synthetic-clock retention check must show expiry at the documented 30-day boundary without changing receipt or recovery evidence.

### 7. Replay, idempotency, interruption, and crash semantics

Each fictional mutating request carries one opaque idempotency key and a canonical request digest:

- first use may produce at most one durable effect and one receipt;
- an exact replay returns the same receipt identity and produces no second effect;
- reuse of a key with a different request digest is rejected;
- acknowledgement cannot precede the durable effect and durable receipt;
- interruption before the atomic durability boundary leaves no success receipt and permits one safe retry;
- interruption after the boundary but before acknowledgement returns the existing receipt on retry; and
- restart replays durable incomplete work at most once, preserves terminal failures, and never converts an ambiguous attempt to success.

Dependency failure remains visible and isolated. It cannot broaden access, discard the durable request identity, corrupt the accepted baseline, or make an otherwise healthy local shell unavailable in the fictional model.

### 8. Public-safe candidate-evidence and governed-stage receipts

Candidate QA and governed stage runtime have two non-interchangeable machine records:

- The Gate A candidate-evidence receipt must bind exact `receiptKind=candidate-qa-evidence-v1`, `lifecycle=gate-a-preparation`, `taskStageInvoked=false`, and `gateBStageReceiptSha256=null`, plus the task, accepted preparation record and digest, intended stage, scope/action pair, implementation revision and module digest, fictional-fixture digest, all exercised scenario IDs, start/end times, per-contract pass/fail results, before/after/backup/restore/rollback digests, durable health values, sanitized-log scan result, defects, limitations, and the exact permitted claim. It can support later Gate B review but can never be presented as a stage receipt.
- Only the guarded exact-main runtime may create the governed terminal stage receipt after Gate B. That separate append-only journal receipt is identified by the runtime-owned terminal `state`, Gate B `gateKind`, stage-approval, registry, stage-binding, source, predecessor, idempotency, preparation, candidate, module, verification, and evidence digests. Candidate code or candidate QA may not mint, copy, or claim those authority fields; the runtime may bind the candidate-evidence digest without changing its lifecycle.

Both records must contain no raw fixture content, real capacity, path, listener, hostname, account, provider, topology, credential, key, assertion, private evidence, or authentic-content-derived value. Neither record is the task's live-host acceptance evidence, a release result, or permission for a private follow-on.

## Requirement traceability

| Requirement | Frozen proposal coverage | Primary technical/QA scenarios |
| --- | --- | --- |
| `LID-SCP-001` | One fictional human allowlist; no public, sharing, or multi-user surface | `T-001`, `T-003`, `QA-001`, `QA-003` |
| `LID-OPS-001` | Fictional human assertion allow/deny boundary only | `T-001`, `T-003`, `QA-002`, `QA-003` |
| `LID-OPS-002` | Disjoint callback and human surfaces; route/method/body rejection | `T-001`, `T-003`, `QA-002`, `QA-003` |
| `LID-OPS-003` | No runtime or real secrets; closed public-safe evidence and log schemas | `T-003`, `QA-003` |
| `LID-OPS-004` | Versioned authenticated synthetic ciphertext; correct-, wrong-, missing-key and tamper behavior | `T-001`, `T-002`, `QA-003`, `QA-004` |
| `LID-OPS-008` | Same-origin personal-shaped synthetic delivery with private, no-store behavior | `T-003`, `QA-003` |
| `LID-OPS-011` | Encrypted synthetic backup plus distinct restore, comparison, and rollback results | `T-002`, `QA-004` |
| `LID-OPS-012` | Test-only recovery material proves synthetic decrypt; no human ceremony claim | `T-002`, `QA-003`, `QA-004` |
| `LID-OPS-014` | Exact durable health vocabulary and evidence-driven transitions | `T-001`, `QA-001`, `QA-006` |
| `LID-OPS-016` | Closed local-log allowlist and synthetic-clock retention | `T-003`, `QA-003` |
| `LID-OPS-018` | Durable replay, idempotency, restart, crash, and dependency isolation | `T-001`, `T-003`, `QA-002`, `QA-006` |

Scenario abbreviations in this table retain the full `SPK-R0-001-` prefix.

## Exact technical verification scenarios

1. **`SPK-R0-001-T-001` — Boundary and failure:** invalid, absent, repeated, interrupted, or out-of-order inputs fail safely and leave no partial or falsely successful state.
2. **`SPK-R0-001-T-002` — Recovery:** every persistent synthetic shape introduced or changed by the candidate is inventoried, backed up, restored in a separate empty destination, compared, and rolled back or forward-fixed.
3. **`SPK-R0-001-T-003` — Isolation:** privacy, security, resource, dependency, and co-resident failure cannot broaden access, leak forbidden data, or corrupt the accepted fictional baseline.

These are proposal definitions, not executed results. The QA plan binds them into the canonical 15-scenario matrix; only independent candidate QA performed after accepted Gate A may record actual local-synthetic outcomes for later Gate B review. Those outcomes are preparation evidence, not a task-stage invocation.

## Later implementation-candidate obligations

Gate A deliberately does not invent implementation filenames. If preparation is later accepted, the implementation candidate must bind before review:

- one exact code-owned module ID, regular `100644` path, raw-byte hash, transitive dependency closure, capability profile, and invocation contract;
- one exact versioned fixture schema and canonicalization algorithm implementing the contracts above;
- one exact public-safe receipt schema and outcome verifier;
- deterministic time, interruption, collision, dependency-failure, and crash controls that require no private or native external I/O;
- exact rollback steps that affect only candidate-owned fictional state; and
- the complete implementation/evidence diff, test commands, tool versions, limits, and known limitations.

No code, fixture, evidence output, build artifact, runtime callback, or production-map entry is part of this Gate A proposal commit.

## Explicitly excluded implementation choices

The following are outside this local-synthetic proposal and are not inferred from a future modeled pass:

- real listener numbers, hostnames, paths, namespaces, schedules, quotas, capacity values, or co-resident workload measurements;
- Docker Compose versus native systemd, tunnel/DNS configuration, provider selection, live callbacks, or any external service;
- SQLCipher/SQLite versus PostgreSQL, a production encryption library, production key custody, or migration strategy;
- a live target, private account, credential, recovery material, authentic fixture, photo, or photo-derived value; and
- deployment, restore against a private backup, owner Recovery Ceremony, release acceptance, or production use.

A later private or deployment proposal must re-enter its own exact authority, owner-action, architecture, security, recovery, QA, and stage gates. This proposal cannot be widened in place.

## Gate sequence and stop conditions

1. Review and merge exactly the six `in-review` SPK proposal artifacts through the controlled C1/C2 proposal history.
2. Publish and verify the registry-only accepted preparation record for `P0-PREP-SPK-R0-001-SYNTHETIC-FOUNDATION` if and only if Gate A passes with five independent seats.
3. Prepare one exact local-synthetic implementation/evidence candidate beneath the accepted preparation boundary; it is eligible for bounded candidate QA but is not authorized for task-stage invocation.
4. Run independent local-synthetic candidate QA within the accepted Gate A preparation boundary, then obtain exact-candidate five-seat Gate B review for `P0-STAGE-SPK-R0-001-SYNTHETIC-FOUNDATION`. That QA produces pre-review evidence; it is not a task-stage invocation.
5. Only a separately published, immutable Gate B stage may be invoked through the guarded exact-main runtime. Its receipt supports only the bounded synthetic claim.

Stop and retain `executionAllowed=false` for any task-contract drift, dependency failure, open decision, veto, private or authentic input, external access, undefined module or receipt contract, nondeterminism, collision overwrite, optimistic health state, log-policy breach, restore/compare/rollback failure, unresolved Sev-1/Sev-2, or evidence/publication mismatch.

No owner action is due or satisfiable for this Gate A proposal. Private deployment state remains **Unknown — private read authority pending**.

## Technical Architect disposition

**In review / Hold.** The local fictional/synthetic behavior is bounded for exact-candidate Gate A review. Implementation-candidate authoring and independent local-synthetic candidate QA remain prohibited until an accepted Gate A preparation record exists. Task-stage invocation, acceptance, and any broader action remain prohibited until the separate Gate B sequence passes in full.
