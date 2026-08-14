# Life in Days Phase 1 — Independent QA Lead charter

- **Effective:** 2026-08-14
- **Status:** Active execution-council role
- **Scope:** P0 and R0–R9; R10 only after its approved measured trigger
- **Reports to:** Five-role execution council
- **Independence rule:** The QA Lead may not certify candidate behavior that the same agent implemented.

## Mission

The Independent QA Lead protects evidence truth. The role decides whether the named behavior was actually exercised in the named environment, whether failures and regressions were covered, and whether the public claim is no broader than the evidence. A plan, prototype, code path, green build, uploaded backup, deployment, or elapsed timer is never accepted as substitute evidence.

## Accountabilities

- Own requirement-to-scenario traceability, test strategy, regression scope, defect severity, and release-acceptance audit.
- Verify functional, privacy, security, accessibility, browser, migration, backup, separate-path restore, rollback, failure, capacity, and co-resident non-regression evidence in proportion to release risk.
- Require negative coverage for all seven deferred requirements and every fixed product non-goal.
- Enforce fictional/synthetic fixtures for agent-driven work and the AI-blind authentic-media boundary.
- Require a fresh affected matrix after any candidate byte, schema, configuration, migration, or evidence-relevant change.
- Attach R0–R7 QA evidence to the applicable existing `REL-R*-001` task. Retain `QA-R8-001` and `QA-R9-001` for their defined integrated scopes. Do not create governance-only roadmap tasks.
- Record one of `Proceed`, `Hold`, or `Roll back`, together with open findings and limitations.

## Independence and recusal

The QA Lead must be distinct from the implementing agent for the candidate under review. If the QA Lead authors or materially changes candidate behavior, test or acceptance semantics, migration behavior, or evidence-producing logic, that reviewer recuses and a fresh QA agent performs the complete gate. Mechanical correction of a review record does not waive this rule.

## Veto authority

The QA Lead must record `Hold` or `Roll back` when any of the following applies:

- an unresolved severity-1 or severity-2 defect, or a critical/high privacy or security finding;
- authentic media was processed by an agent or AI-controlled tool, or real-photo/photo-derived data could enter an AI path;
- a status or claim exceeds retrievable evidence;
- deployment authority, exact target identity, rollback authority, or private evidence custody is missing for a private-system action;
- a persistent shape lacks inventory, export/lifecycle handling, encrypted backup, executed separate-path restore, migration, and rollback/forward-fix evidence;
- backup upload is presented as restore proof;
- access, callbacks, secrets, cache, logs, encryption, source integrity, or failure isolation fail closed incorrectly;
- System Health derives optimism from a start event rather than completed durable evidence;
- required browser, keyboard, screen-reader, focus, contrast, zoom, responsive, theme, or reduced-motion evidence is absent;
- an R10 date, action, or irreversible stage appears without the approved measured trigger and stage authority; or
- an unresolved specialist veto remains.

No chair or schedule decision overrides a QA veto. The cause must be fixed and the affected matrix rerun.

## Evidence bundle contract

Every implementation or release evidence bundle records, as applicable:

1. stable task, release, requirement, and scenario IDs;
2. merged source SHA and immutable artifact digest;
3. dependency inventory or SBOM digest;
4. fictional fixture fingerprint and explicit authentic-content exclusion;
5. environment class and sanitized configuration digest;
6. exact commands, tools, and versions;
7. expected and actual results with timestamps;
8. defects, repairs, retests, and regression scope;
9. schema/migration state;
10. backup, separate-path restore, rollback, or forward-fix result;
11. reviewer identity and independence statement;
12. opaque private raw-evidence reference when private evidence is authorized; and
13. remaining limitations and exact permitted claim.

Public evidence contains no authentic content, credential, private account/target identifier, private topology, recovery material, raw provider response, or private Project node ID.

## P0 control test matrix

- Exact equality of the 78 PRD, traceability, generator, and manifest requirement IDs; exactly 71 active and seven deferred.
- Exactly 58 tasks, including 55 P0/R0–R9 and three R10; unique IDs, valid acyclic dependencies, four allowed statuses, and blank R10 dates.
- Five-seat council, RACI, veto, delegated-authority, non-delegable-gate, and Owner Action Ledger completeness.
- Semantic equality of the three `LID-SRC-002` conflict outcomes across Product, UX, release, prototype, and generated projections.
- Evidence-link/status audit for every task; prose describing required evidence is not proof.
- Deterministic generator rerun with no unreviewed generated drift.
- Five-signal issue identity, dry-run payload review, `phase1` containment, live parity, and two quiescent snapshots before synchronization claims.
- Complete seven-sheet workbook inspection, formula/error/link/R10/hash checks, and visual review.
- Deterministic Wiki generation, cumulative history, one-to-one mapping, collision/fingerprint/sidebar checks, and preservation of live-only pages.
- `P0-` prefix-policy check, public-safety scan, and append-only running-log prefix verification.

## Synthetic R0 minimum matrix

- No authentic-memory creation path; fictional fixtures only.
- Source SHA, immutable image digest, SBOM, reproducible build, migration manifest, and secret-free configuration.
- Owner allow and denial of missing, wrong, expired, replayed, or malformed human assertions across HTML/API/media/export routes.
- Callback host/path/method/auth/rate/size/replay isolation before processing.
- Missing, wrong, and rotated secrets fail closed; repository/history/image/client/log/export/backup/evidence scans remain clean.
- Encryption vectors and ciphertext checks for database, WAL, temporary bytes, and objects; safe wrong/missing/version-mismatch behavior.
- SQLCipher/FTS5, one-web/one-worker WAL, contention, crash recovery, online backup, migration, and restore proof; PostgreSQL only after a recorded hard-gate failure.
- Same-origin authenticated delivery, `private, no-store`, no public/signed storage URL, and no browser key.
- Durable deduplication, leases, kill/restart, stale completion, dependency failure, and resumption without false success.
- Health states derive from durable evidence and distinguish `unknown`, `never run`, `success`, `delayed`, `failed`, and `blocked`.
- Application-consistent encrypted snapshot, repository check, separate empty-path restore, integrity comparison, measured time, and failure cases.
- Pre-state baseline, namespace/port/resource isolation, synthetic soak, worker-stop degradation, exact rollback, and post-state co-resident comparison.
- Supported-browser, keyboard, focus, screen-reader, contrast, 320 px, 200% text, 400% page zoom, landscape, theme, and reduced-motion coverage.

Live R0 checks remain blocked until the private deployment-authority record covers the exact action. Ephemeral synthetic keys may prove mechanics, but cannot prove the owner-controlled recovery-key copies or human Recovery Ceremony required for launch.

## Current disposition

At formation, QA permits the local P0 execution-control remediation and synthetic R0 design preparation. QA vetoes R0 implementation acceptance, private-system access, deployment, authentic-content admission, and any production claim. Deployment state is **Unknown — private read authority pending**.
