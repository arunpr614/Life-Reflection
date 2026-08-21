# Shared host: `brain-processing-audit.service` failure — read-only investigation

_Investigated 2026-08-21 on branch `spike/m0.1-hosting-research`. **Read-only. Nothing on the host was changed, no service was started or stopped, no file was written, and no database write was issued.** The failing unit belongs to **AI Brain, not Life in Days** — this document records what is wrong and why, so the owner can decide. It is here because it is evidence about the operational state of the host M0.1 is evaluating (#316, #317, #324)._

---

## 1. Headline

`brain-processing-audit.service` is the only failed unit on the host. It has failed **every scheduled run since 2026-08-19 18:25 IST** — nine consecutive failures over roughly two days.

**Root cause, confirmed by direct comparison:** migration `029_transcript_job_sweeps.sql` was **hand-applied to the production database** on **2026-08-19 at 14:45:42 IST**, and it is **not present in any release package on disk**. The audit's `applied_migration_not_packaged` check is firing correctly. This is a real integrity divergence between the deployed code and the live database — not a false alarm, and not a flaky job.

**AI Brain itself is still serving.** The unit is a 6-hourly integrity audit, not a liveness gate; `brain.service` is active and the audit's own checkpoint still reports `read: true, write: true, navigation: true`.

---

## 2. Evidence

### 2.1 The unit and its schedule

```
# /etc/systemd/system/brain-processing-audit.service
Description=AI Brain Processing integrity audit
Type=oneshot
User=brain  Group=brain-data
WorkingDirectory=/opt/brain/current
ExecStart=/usr/bin/node /opt/brain/current/scripts/dist/processing-readiness-prod.mjs \
          audit --require-ready --require-production-config
Nice=10  IOSchedulingClass=idle  TimeoutStartSec=5m
NoNewPrivileges=true  PrivateTmp=true  ProtectSystem=strict  ProtectHome=true
ReadWritePaths=/opt/brain/data  UMask=0007
```

```
# /etc/systemd/system/brain-processing-audit.timer
OnBootSec=10m  OnUnitActiveSec=6h  Persistent=true  RandomizedDelaySec=5m
```

State:

```
ActiveState=failed   SubState=failed   Result=exit-code
ExecMainStatus=1     ExecMainCode=1    NRestarts=0
ConditionResult=yes  AssertResult=yes  UnitFileState=static
Next run: Sat 2026-08-22 00:48:38 IST
```

`ConditionResult=yes` and `AssertResult=yes` rule out environmental gating. `NRestarts=0` and a clean `exit-code` rule out OOM, timeout, and signal death. The script ran and deliberately exited 1.

### 2.2 The failure is unbroken, and it starts at a specific moment

60 runs are in the journal: **51 `"ok":true`, 9 `"ok":false`**, and the nine failures are the nine most recent — every run since the transition, with no intermittency.

| Run | Result |
|---|---|
| … through 2026-08-19 **12:21:28** IST | `"ok":true` |
| 2026-08-19 **18:25:27** IST | `"ok":false` ← first failure |
| 2026-08-20 00:27:35 / 06:31:35 / 12:32:27 / 18:34:55 | `"ok":false` |
| 2026-08-21 00:36:28 / 06:37:36 / 12:40:28 / 18:43:49 | `"ok":false` |

### 2.3 The payloads, side by side

Last good run (2026-08-19 12:21:28 IST) versus most recent failure (2026-08-21 18:43:49 IST):

| Field | Last good | Latest failure |
|---|---|---|
| `ok` | `true` | **`false`** |
| `auditFailures` | `[]` | `[]` |
| **`migrationFailures`** | `[]` | **`["applied_migration_not_packaged"]`** |
| `configurationFailures` | `[]` | `[]` |
| `checkpoint.state` | `green` | **`red`** |
| `checkpoint.failureCode` | `null` | **`applied_migration_not_packaged`** |
| `checkpoint.auditedAppSha` | `fe05521862b637fa58dfee6c58c5aa94d2b56b77` | **identical** |
| `checkpoint.auditedMigrationHash` | `39af4c96a82b8efdddf937415c12fa641d4a41703708527b8243448c7077f8cb` | **identical** |
| `checkpoint.flags` | read/write/navigation all `true` | **all still `true`** |
| `checkpoint.workflowEpoch` | 133 | 146 |
| `checkpoint.taxonomyEpoch` | 2762 | 5739 |

**This is the key inference.** The deployed app SHA and the packaged migration-manifest hash are **byte-identical** across the green→red transition. The package did not change. Therefore the *database* changed — it acquired an applied-migration record that the package does not contain.

### 2.4 Confirmation — the applied-migrations table versus the shipped package

Read-only query against `file:/opt/brain/data/brain.sqlite?mode=ro`:

```
id  name                            applied_at     sha256
--  ------------------------------  -------------  ----------------------------------------
31  029_transcript_job_sweeps.sql   1787130942000  manual_applied          ← 2026-08-19 14:45:42 IST
30  028_transcript_jobs.sql         1787056376000  7453334282d2dd6eaf7dc3e1f3fe7689ddf9…
29  027_notebooklm_url_sources.sql  1784802921000  a488c7e15c54d232ad16708541bbc4a6fea6…
28  026_notebooklm_export.sql       1784716033000  1ba76b030c58af334b588923ee2eef34282c…
```

Packaged migrations in the deployed release (`/opt/brain/current/src/db/migrations/*.sql`, newest four):

```
025_item_workflow.sql
026_notebooklm_export.sql
027_notebooklm_url_sources.sql
028_transcript_jobs.sql          ← highest packaged migration
```

**`029_transcript_job_sweeps.sql` is applied in the database and absent from the package.** Its `sha256` column reads the literal string **`manual_applied`** rather than a content hash — the codebase's own marker for a migration applied by hand rather than by the migration runner, which is why the audit can detect it at all.

The same three most recent release directories were checked (`fe055218…`, `bfa2615b…`, `e77c0435…`); **all three top out at `028`**. So this is not a rollback to an older release — migration 029 was applied from something that is not on this machine.

### 2.5 The window it happened in

Migration 029 was applied at **14:45:42 IST on 2026-08-19**. The surrounding activity:

- `/opt/brain/current` → `/opt/brain/releases/fe05521862b637fa58dfee6c58c5aa94d2b56b77/runtime`, symlink created **2026-08-18 23:30** and unchanged since.
- Seven releases were built on **2026-08-18** between 18:02 and 23:30 — an active deployment session the day before.
- **14:55 on 2026-08-19**: `brain.service` crash-looping with
  `Error: An error occurred while loading instrumentation hook: Cannot find module '…/runtime/node_modules/node-cron/dist/esm/node-cron.js'`
  — an incomplete `node_modules` in the deployed release.
- **Seven `brain.service` restarts** followed between 14:56:55 and 19:38:19 IST.
- The audit flipped green→red inside that window (last green 12:21, first red 18:25).

The consistent reading: a change was being worked on around midday on 2026-08-19, migration 029 was applied by hand to production to unblock it, the accompanying code was never packaged into a release on this host, and the audit — correctly — has been reporting the divergence ever since.

### 2.6 One oddity worth flagging to whoever owns AI Brain

In the failing payloads, `checkpoint.lastDeepSuccessAt` equals `lastDeepAttemptAt` (`1787318029472`) even though `ok` is `false` and `state` is `red`. If `lastDeepSuccessAt` is meant to record the last *successful* audit, it is being stamped on failed attempts too — which would make "how long has this been broken?" unanswerable from the checkpoint alone. Not investigated further; it is not Life in Days' code.

---

## 3. What I did not do

- Did not run the audit script (`audit` mode writes a checkpoint row, so it is not read-only).
- Did not restart, reset, stop, or disable the unit or its timer.
- Did not apply, revert, or package migration 029.
- Did not read journal content, item content, or any table other than `_migrations`; the only values reproduced above are migration filenames, timestamps, and hashes.
- Did not print or copy anything from `/etc/brain/.env`; only the **key names** in `/etc/brain/release.env` were listed (`BRAIN_APP_SHA`, `BRAIN_BUILDER_SHA`, `BRAIN_RELEASE_ID`) and no values.
- Did not install any package on the host (`sqlite3` was already present).

## 4. Options for the owner — AI Brain's call, not Life in Days'

1. **Package migration 029 and cut a release** containing it, so the manifest and the database agree. This is the fix if 029 is wanted (which the applied row and the `transcript_jobs`/`transcript_job_sweeps` naming suggest it is).
2. **Revert 029** in the database if it was applied by mistake — requires knowing what its SQL did, and that SQL is not on this host.
3. **Leave it.** The audit will keep failing every six hours and `systemctl --failed` will keep showing one failed unit. AI Brain keeps working. The cost is that a genuine integrity alarm is now permanently on, so the next real divergence will be invisible inside the noise.

Option 3 is the current default and it is the worst of the three, for the reason in the last sentence.

## 5. Why this is in the M0.1 folder

It changes nothing about the hosting recommendation, but it is relevant evidence for #317 and #324:

- **`systemctl --failed` was not clean before Life in Days arrived.** Any "did we break something?" check after a Life in Days deployment needs this pre-existing failure recorded as the baseline, or it will be misattributed.
- **The host has hand-applied production state.** Migration 029 exists only in the database. A host restore from a Hetzner snapshot, or a rebuild from the release artifacts, would silently produce a *different* AI Brain than the one running now. That is a recovery risk on the shared host today, independent of Life in Days.
- It is a concrete instance of the general point in `IMPLEMENTATION-PLAN-POST-M6.md` §7.8: this machine is somebody's live production, mid-flight, and it does not have spare attention. Recommendation 3 in the hosting report — fix this before adding a third tenant — follows from it.
