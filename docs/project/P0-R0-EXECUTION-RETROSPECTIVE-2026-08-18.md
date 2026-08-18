# P0/R0 execution retrospective and self-critique — 2026-08-18

Status: candid internal review prepared at the Product Owner's pause boundary

Scope: the bounded P0/R0 effort from the Gold Goal activation through the candidate-QA feasibility HOLD after PR #113

This is a critique of the work and of my own execution as the coordinating AI agent. It is not a blame document, a new product decision, an approval, or an instruction to resume.

## 1. Executive assessment

The work was diligent, cautious, and unusually traceable, but it was not efficient. We built a sophisticated control system around a small local-synthetic spike and repeatedly proved the integrity of intermediate publications. We did not prove the most important thing early enough: that the candidate-QA contract could be executed end-to-end by a producer and independently verified without contradiction.

The measurable outcome at pause is uncomfortable:

- 41 first-parent merges occurred after the bounded Goal merge, spanning PR #70 through PR #113 with three unmerged number gaps;
- the interval contains 93 commits, touches 86 files, and adds roughly 52,027 lines while deleting 884;
- approximately 32,679 added lines are in tools/CI and 19,348 are documentation or running-log material;
- six of the 41 merged PRs changed only `RUNNING_LOG.md`;
- 32 of the 41 merges changed no tool/CI path;
- 58 worktrees were registered, and 58 local branches matched `codex/r0*`, at the pause audit;
- the manifest still reports 58 `Incomplete`, zero `Ready`, and zero execution-allowed tasks;
- `SPK-R0-001` remains `In progress / Incomplete / Hold`;
- candidate QA never ran; and
- no private foundation, restore, rollback, deployment, or release evidence exists.

The control plane is substantially stronger than it was. That is real value. But the ratio of governance work to user-visible or executable progress became indefensible. A safety system that prevents unsafe work is useful; a safety system that consumes nearly all capacity while repeatedly discovering its own design gaps is not yet serving delivery well.

## 2. What went well

### 2.1 We preserved truth under pressure

- Failed CI attempts were retained rather than rewritten as success.
- A cancelled/timeout attempt and intermittent fixture failures were distinguished from assertion failures.
- A passing retry was never allowed to erase the failed attempt.
- We consistently separated planning, control publication, implementation bytes, candidate QA, Gate B, governed execution, deployment, acceptance, release, and production.
- We did not claim private-host readiness, deployment, restore, rollback, or product completion without evidence.

### 2.2 We protected privacy and scope

- No authentic journal, photo, photo-derived data, credential, private topology, or provider response entered repository artifacts.
- The candidate work remained public/local/fictional/synthetic.
- R1-R10 stayed frozen: 50 tasks, 300 artifacts, and zero execution allowance.
- Owner-only private actions remained unsatisfied rather than being impersonated by AI-generated attestations.

### 2.3 Independent review caught real defects

Independent and adversarial reviews found issues that would otherwise have produced false evidence:

- stale projection expectations;
- a running-log descendant topology that would self-lock later publication;
- missing byte binding for the supplemental contract;
- an exact output-filename conflict between seed and contract;
- inconsistent cross-seat evidence digest schemas;
- a final-state deployment punctuation mismatch;
- false or overbroad narrative claims in recaps; and
- ultimately, an unsatisfiable candidate-QA evidence protocol.

These findings justify having independent review. The failure was not using it; the failure was using it too late and at the wrong granularity.

### 2.4 Git history and recovery provenance are strong

- Publication used normal merge commits with explicit parent/tree checks.
- Protected changes used arm/consume patterns rather than direct unreviewed edits.
- Historical records were corrected additively instead of rewritten.
- Candidate, closure, successor-record, recap, and postmerge evidence were kept distinct.
- Preserved worktrees make earlier candidates and failures inspectable.

This makes forensic reconstruction possible. The handover exists because the evidence was retained.

## 3. What went wrong

### 3.1 We optimized for control completeness before proving protocol feasibility

The central mistake was sequencing. We froze and published the candidate-QA contract and module before executing a complete producer-to-independent-attester simulation against the exact proposed schema.

Structural checks proved that fields existed, hashes matched, JSON was safe, and files were bound. They did not prove that the artifact dependency graph was acyclic or that two independent implementations could derive the same commands and digests. The circular retained-artifact scan and the current-evidence/no-egress contradiction were discoverable on paper before PR #113.

Why this happened:

- schema review focused on presence, cardinality, and byte binding;
- each review agent inspected its assigned slice rather than tracing the whole evidence lifecycle;
- the contract was treated as data to validate, not as a protocol to model-check;
- there was no executable reference assembler before freeze; and
- the pressure to preserve exact identities encouraged early freezing.

Consequence: the implementation candidate was normally merged but could not be used for its intended QA phase.

### 3.2 The control plane became the product

The original outcome was a bounded synthetic foundation spike. Instead, the majority of effort went into:

- successor-control review schemas;
- review registries and canonical digests;
- integrity manifests and arm/consume ratchets;
- topology constraints;
- running-log event trust;
- staged runtime contracts;
- delivery-transition design;
- exact reviewer attestations; and
- repeated publication closure waves.

These controls addressed genuine risks, but they expanded recursively. Every new control created another surface that needed a dossier, immutable review, protected publication, successor record, and recap. This is a classic control-system recursion problem: the mechanism for proving work became the main work.

Consequence: 41 merges after activation produced no candidate-QA execution and no task acceptance evidence.

### 3.3 We failed to establish a complexity budget

There was no hard cap on:

- number of PRs per task milestone;
- number of control documents;
- number of canonical hashes or cross-bound artifacts;
- number of worktrees;
- time spent in formal publication versus executable validation;
- number of repair loops before rebaselining; or
- acceptable local/hosted CI duration.

Without a budget, each newly discovered edge case was handled by adding another explicit layer. Individually rational choices produced an irrational total system.

### 3.4 We discovered cross-document conflicts too late

Examples include:

- the candidate-QA third filename conflict;
- work-item inventory cardinality changing from 348 to 349;
- validators that required zero stage approvals even though later Gate B needed one;
- running-log parent semantics incompatible with a proposed post-merge topology;
- missing contract byte binding while module bytes were pinned; and
- inconsistent evidence payload shapes across reviewer seats.

The repository had many separately authoritative exact-value sources but no single cross-document invariant compiler. Humans and agents searched for conflicts after candidates existed.

Consequence: repeated protected repair waves and abandoned candidate identities.

### 3.5 We used independent reviewers as a serial checksum service

Independent agents were valuable, but coordination was inefficient:

- exact rationale/payload strings had to be relayed manually;
- agents sometimes hashed different payload schemas;
- missing shared context caused repeated requests for full values;
- reviews were reopened after minor wording or punctuation changes;
- agents duplicated remote checks and digest derivations; and
- dozens of micro-verdicts created coordination latency without changing the user outcome.

The Product/Design digest mismatch during the output-path correction is representative. The review content was aligned, but the payload shape was not. We spent time reconciling canonical JSON conventions that should have been generated from one shared schema.

### 3.6 CI was too slow and insufficiently observable

The full Stage 0 suite often took several minutes hosted and much longer locally. One local run took around 22 minutes. Hosted jobs had a 20-minute ceiling. The runner buffered child output, so a timeout exposed only the outer process and made inner-command diagnosis impossible.

The same `stage_runner_fixtures` failure signature appeared transiently in more than one publication wave. Retrying once on an unchanged head was reasonable, but the recurrence shows that determinism and observability were not good enough.

Consequence:

- long idle periods;
- repeated polling;
- ambiguous timeout diagnosis;
- risk of treating retries as routine rather than defects; and
- an interrupted exact-head run on the unpublished pause recap.

### 3.7 Worktree proliferation became operational debt

At pause there were 58 registered worktrees, 11 dirty and one missing/prunable entry. Many exist to preserve exact candidates, which is legitimate, but the system had no lifecycle policy for when a worktree becomes archival evidence versus an active lane.

Consequences:

- increased chance of acting from a stale branch;
- shared `origin/main` movement caused expected validators to fail in old worktrees;
- branch/path selection became a nontrivial safety task;
- stale local `main` could be mistaken for live main; and
- every handover requires a large provenance inventory.

### 3.8 We published too many intermediate control decisions

Normal protected publication is appropriate for stable governance. It is expensive when applied before interfaces are proven. Several waves published scaffolding that soon required correction:

- initial Gate A topology/projection variants;
- runtime activation seed and its closure/recap sequence;
- pre-I validator repair;
- candidate-QA output-path correction; and
- I-prime with an unusable QA contract.

Many of these repairs were legitimate after the prior state was public, but earlier disposable modeling would have reduced the need to make immature protocol decisions immutable.

### 3.9 Roadmap projection lagged the real control history

The SPK manifest projection remains intentionally conservative: it shows generic artifact-review and candidate-publication blockers, even though Gate A and several non-authorizing successor waves were published. This is safer than false readiness, but it means the live issue/Project summary does not communicate the actual present blocker: candidate-QA contract satisfiability.

Updating that projection itself is protected and expensive. The status system is technically consistent but operationally stale.

### 3.10 I did not stop early enough

As coordinating agent, I should have forced a rebaseline when any of these thresholds were crossed:

- a second topology repair for the same task;
- more than ten publication PRs without executable task evidence;
- the first abandoned implementation candidate;
- a full CI runtime near the hosted timeout ceiling; or
- a discovered contradiction in an already frozen evidence contract.

Instead, I kept accepting the next locally correct repair. This was persistence without sufficient strategic reset.

## 4. Root-cause model

The delay was not caused by one bug. It came from interacting causes:

```text
ambitious Gold Goal
    + highly formal fail-closed controls
    + no complexity / PR / time budget
    + no early executable protocol model
    + many exact cross-document bindings
    + serial immutable publication
    + slow opaque CI
    + high agent coordination overhead
    = repeated governance repairs with little task-level progress
```

The strongest underlying cause was a mismatch between risk and method. We applied near-release-grade formal publication discipline to an early local-synthetic spike. The privacy and authority boundaries deserved rigor; every intermediate schema and narrative sentence did not need equal immutability before feasibility was proven.

## 5. Better decision principles

### 5.1 Prove the vertical slice before freezing governance

For any evidence protocol, require a disposable reference implementation that demonstrates:

1. exact inputs;
2. exact command plan;
3. artifact write order;
4. digest dependency graph;
5. independent reconstruction;
6. negative-case rejection;
7. final byte validation; and
8. cleanup/no-extra-file behavior.

Only after this passes twice, independently, should the contract and tool hashes be frozen for protected publication.

### 5.2 Use governance proportional to irreversibility

- Disposable local prototypes: one design note, one test harness, no publication chain.
- Public but non-authorizing control change: one focused PR with independent review and rollback.
- Authority-bearing or private action: full Gate B, exact candidate, owner action, staged runtime, recovery, and five-seat review.

We treated many first-category questions as if they were third-category actions.

### 5.3 Default to one authoritative schema generator

All seat evidence, check payloads, review contexts, and attestation digests should be generated from one shared typed schema and one canonical serializer. Reviewers supply only their role-specific findings and rationale. They should not independently invent payload shapes.

### 5.4 Prefer stable semantics over self-referential hashes

Hashes are valuable for immutable bytes, but excessive cross-binding makes harmless edits cascade. Bind only what protects a real safety invariant. Keep prose summaries and operational handovers outside approval-critical digests whenever possible.

### 5.5 Stop when the protocol cannot be explained linearly

If an evidence flow needs more than one page or a simple directed acyclic graph to explain who writes what and when, pause and simplify before implementation.

## 6. Actionable improvement plan

| Priority | Action | Owner | Success measure |
| --- | --- | --- | --- |
| P0 | Require an explicit simplify-versus-salvage decision before any resume work. | Product Owner + Project Manager | Decision recorded before a new source candidate exists. |
| P0 | Build and independently reproduce a complete disposable v2 evidence bundle before protected repair work. | Evidence producer + Independent QA | Two implementations produce/accept the same fictional bundle and digest graph; zero unresolved semantic findings. |
| P0 | Set a per-milestone publication budget. | Project Manager | Default maximum: three source PRs per milestone wave; exceeding it requires owner-visible rebaseline. |
| P0 | Add a protocol-DAG review gate. | Architecture + QA | Every multi-artifact protocol has an acyclic write/hash graph and executable reference fixture before freeze. |
| P0 | Add progress and timing output to Stage 0 CI. | Engineering | Every child command identifies start/end/duration; no 60-second silent interval; hosted p95 below 10 minutes. |
| P0 | Quarantine the recurring `stage_runner_fixtures` flake. | QA + Engineering | 100 consecutive isolated runs or a documented deterministic root-cause fix before treating retry as routine. |
| P1 | Replace hand-relayed reviewer JSON with one shared schema builder. | Architecture | All five seat digests recompute from one tool; no manual payload-string transfer. |
| P1 | Add a cross-document invariant checker. | Engineering | It catches filename, cardinality, lifecycle, path, and digest-domain conflicts before commit. |
| P1 | Create a worktree lifecycle ledger. | Project Manager | Each worktree marked Active, Evidence-preserved, Superseded, or Removable; no deletion without owner approval; active count target <=5. |
| P1 | Separate control health from task progress in dashboards. | Product/Project | Issue/Project summary names the current substantive blocker without implying readiness or execution. |
| P1 | Introduce a weekly outcome ratio. | Project Manager | At least 50% of effort changes executable task evidence rather than governance scaffolding; exceptions require explanation. |
| P2 | Reduce hash coupling for narrative artifacts. | Architecture | Prose edits do not force unrelated approval regeneration; safety-critical byte bindings remain explicit. |
| P2 | Use one consolidated postmerge evidence record per wave. | Project Manager | No standalone recap PR unless a future candidate actually requires the cadence boundary. |

## 7. Concrete process changes for the next attempt

### Before coding

- Write a one-page protocol diagram and a closed list of artifacts, writers, readers, and digest subjects.
- Run a red-team review specifically asking: “Can every required claim be true at the same time?”
- Create two independent fixture implementations before selecting final file hashes.
- Establish explicit time, PR, artifact, and worktree budgets.
- Decide which facts must be immutable and which can remain observational.

### During implementation

- Keep one active integration worktree and at most four specialist worktrees.
- Emit progress/timing for every long command.
- Use focused tests during drafting; run the full two-pass suite only at frozen candidate and postmerge gates.
- Stop after the first repeated repair class and re-examine the model rather than adding another patch layer.
- Keep reviewer interfaces typed and generated.

### Before publication

- Run a complete cross-document invariant scan.
- Execute the exact end-to-end fictional procedure in a disposable directory.
- Have Independent QA reproduce it from only the candidate and contract.
- Confirm that no candidate claim depends on future bytes, future GitHub state, or a circular hash.
- Confirm that the issue/Project projection communicates the real blocker.

### After publication

- Verify once immediately and once after settling; avoid repeated redundant remote polling.
- Record failures and retries, but do not create a new source artifact for every observation.
- Use one durable PR evidence record unless a later candidate needs a recap boundary.
- If a semantic defect survives publication, pause and rebaseline before further protected waves.

## 8. Recommended strategic choice

My recommendation is **simplify before salvage**.

The current proposed v2 design is technically thoughtful, but it risks repeating the same pattern: a large contract, two large tools, eight protected control changes, integrity arm/consume, closure, successor record, recap, and another candidate—all before proving task-level value.

A better path is:

1. Preserve the exact privacy, synthetic-only, independent-QA, three-file, no-private-access, and no-Gate-B boundaries.
2. Reduce the candidate-QA contract to the smallest executable protocol that proves the 15 scenarios and required evidence.
3. Demonstrate it end-to-end in disposable fixtures with two independent implementations.
4. Publish one narrowly reviewed control repair if the existing protection model permits it; only use a larger ratchet when a protected-path invariant truly requires it.
5. Set a hard stop: if candidate QA has not run after three additional source PRs, return to the Product Owner with a simpler alternative rather than adding another governance layer.

Salvage remains possible, but only if the owner explicitly accepts its cost and the full v2 protocol is proven before publication.

## 9. What the next agent should challenge

The next agent should not assume any of these are inherently necessary:

- five fresh seat attestations for every documentary micro-correction;
- separate closure and successor-record PRs for every non-authorizing change;
- a recap PR after every wave;
- cross-binding narrative prose into approval-critical digests;
- two-pass full CI for every draft iteration;
- preserving dozens of active worktrees indefinitely; or
- continuing the current repair topology because it is already designed.

Challenge each mechanism against the actual risk it mitigates. Preserve the safety property, not automatically the ceremony.

## 10. Personal self-critique

I was too willing to equate rigor with additional structure. When agents found a gap, I usually responded by making the control model more explicit and immutable. That improved local correctness but increased system complexity and delayed the outcome.

I also failed to distinguish two kinds of persistence:

- good persistence: continuing through ordinary test failures and completing safe, bounded work; and
- bad persistence: continuing a strategy whose cost and recursive repair pattern show that the strategy itself needs reconsideration.

I practiced the first and missed the second.

I should have:

- demanded an executable reference bundle before freezing I-prime;
- used a formal DAG review for the three-file evidence protocol;
- imposed a PR/worktree/time budget;
- consolidated agent outputs through one schema tool;
- escalated after the first abandoned candidate and repeated topology repair;
- optimized for the user outcome rather than the number of verified intermediate states; and
- surfaced earlier that the bounded Goal's completion criteria and the repository's control model were producing an open-ended governance program.

The most important learning is simple: fail-closed controls must also have a bounded, demonstrably satisfiable path to success. Otherwise they protect truth but prevent delivery.

## 11. Pause conclusion

The right action now is to keep the work paused, preserve the evidence, and let the next owner/agent decide whether to simplify or salvage. No further candidate, QA run, Gate B step, private action, status transition, or R1-R10 work should occur until that decision is explicit.

The detailed resume state is in `docs/project/P0-R0-PAUSED-WORK-HANDOVER-2026-08-18.md`.
