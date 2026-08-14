# Life in Days — Hetzner shared-host runbook

- **Date:** 2026-08-14
- **Owner:** Product Council — Technical Architect
- **Status:** Sanitized planning runbook; no target preflight, deployment, rollback, or restore has been executed
**Roadmap tasks:** `SPK-R0-001`, `ARCH-R0-001`, `ENG-R0-001`, `REL-R0-001`; date-free R10 appendix for `ARCH-R10-001`

Canonical status at this handoff: `SPK-R0-001` is `In progress`; the R0 architecture, engineering, and release tasks are `Next`; R10 is `Backlog` and date-free. The [Phase1 Roadmap Manifest](../project/PHASE1-ROADMAP-MANIFEST.json) is authoritative.

## 1. Scope, authority, and safety

This runbook describes the proposed coexistence-safe operating sequence for Life in Days on an already-used Hetzner server. It implements the decisions in the [shared-host spike](../research/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md) and [Phase1 implementation plan](PHASE1-IMPLEMENTATION-PLAN.md). It is not evidence that the host is qualified or that any command has run.

This version covers the recommended dedicated Docker Compose topology. If the exact host lacks a supported Compose runtime or measured container overhead fails admission, stop and approve a native-systemd ADR/addendum that repeats every process, filesystem, secret, listener, resource, backup, tunnel, rollback, and non-regression gate; do not translate these commands ad hoc during a change window.

Use it only after an operator has all of the following:

- explicit authority for the exact target and provider account;
- an approved change window and an identified owner for every co-resident workload;
- a private evidence location that is not this repository;
- filled, reviewed placeholders and immutable release inputs;
- an approved stop/rollback decision-maker;
- synthetic fixtures only until `REL-R0-001` passes.

Never paste command output containing hostnames, addresses, domains, account IDs, usernames, container/project names belonging to other applications, object keys, credentials, journal text, filenames, or media into public artifacts. Record only normalized totals, version numbers, pass/fail outcomes, ranges, and opaque evidence IDs here.

### Prohibited operations

Do not run any of these as part of this runbook:

- `docker system prune`, `docker volume prune`, or host-wide image/network cleanup;
- `docker compose down -v` or any unscoped `docker compose down`;
- a host-wide Docker or `cloudflared` restart without separate approved impact analysis;
- commands against a Compose project other than the exact reviewed Life in Days project;
- wildcard deletion, recursive deletion of a variable-derived path, or overwrite of the active database/media tree;
- editing the live tunnel file before making a protected copy and validating the complete candidate;
- copying a live SQLite/SQLCipher database file or a database/WAL pair as a backup;
- exposing a database, media directory, Docker socket, wildcard-bound web port, or public object bucket;
- using personal journals or photos in R0 probes.

If any exact target, path, project, listener, tunnel owner, or rollback input is ambiguous, stop.

## 2. Placeholder contract

Resolve these values in a root-restricted operator environment. Do not commit the resolved file.

```sh
LID_PROJECT="life-in-days"
LID_TARGET_ALIAS="<AUTHORIZED_SSH_ALIAS>"
LID_ROOT_PARENT="<EXISTING_PARENT_FILESYSTEM_PATH>"
LID_ROOT="<APP_ROOT>"
LID_RELEASE_DIR="<RELEASE_DIRECTORY>"
LID_CONFIG_DIR="<CONFIG_DIRECTORY>"
LID_SECRET_DIR="<ROOT_RESTRICTED_SECRET_DIRECTORY>"
LID_DB_DIR="<DATABASE_DIRECTORY>"
LID_MEDIA_DIR="<ENCRYPTED_MEDIA_DIRECTORY>"
LID_PREPARED_DIR="<PREPARED_BACKUP_DIRECTORY>"
LID_RESTORE_ROOT="<SEPARATE_RESTORE_DIRECTORY>"
LID_HUMAN_PORT="<LOOPBACK_HUMAN_PORT>"
LID_HOOK_PORT="<LOOPBACK_CALLBACK_PORT>"
LID_HUMAN_HOSTNAME="<HUMAN_HOSTNAME>"
LID_HOOK_HOSTNAME="<CALLBACK_HOSTNAME>"
LID_TUNNEL_CONFIG="<TUNNEL_CONFIG_PATH>"
LID_COMPOSE_FILE="<REVIEWED_COMPOSE_FILE>"
LID_ENV_FILE="<ROOT_RESTRICTED_NONSECRET_ENV_FILE>"
LID_IMAGE="<REGISTRY_IMAGE_AT_IMMUTABLE_DIGEST>"
LID_PRIOR_IMAGE="<PRIOR_REGISTRY_IMAGE_AT_IMMUTABLE_DIGEST>"
LID_CHANGE_ID="<OPAQUE_CHANGE_ID>"
LID_EVIDENCE_ID="<OPAQUE_EVIDENCE_ID>"
LID_RESTIC_COMMAND="<ROOT_OWNED_RESTIC_WRAPPER>"
LID_RESTIC_REPOSITORY_FILE="<ROOT_RESTRICTED_REPOSITORY_FILE>"
LID_RESTIC_PASSWORD_FILE="<ROOT_RESTRICTED_RESTIC_PASSWORD_FILE>"
```

Before any mutating command, print and visually compare only the non-sensitive resolved scope:

```sh
test "$LID_PROJECT" = "life-in-days"
test -d "$LID_ROOT_PARENT" && test "$LID_ROOT_PARENT" != "/"
test -n "$LID_ROOT" && test "$LID_ROOT" != "/"
test -n "$LID_RELEASE_DIR" && test "$LID_RELEASE_DIR" != "/"
test -n "$LID_CONFIG_DIR" && test "$LID_CONFIG_DIR" != "/"
test -n "$LID_DB_DIR" && test "$LID_DB_DIR" != "/"
test -n "$LID_MEDIA_DIR" && test "$LID_MEDIA_DIR" != "/"
test -n "$LID_RESTORE_ROOT" && test "$LID_RESTORE_ROOT" != "/"
test -x "$LID_RESTIC_COMMAND"
printf '%s\n' "$LID_PROJECT" "$LID_ROOT_PARENT" "$LID_ROOT" "$LID_RELEASE_DIR" "$LID_CONFIG_DIR" "$LID_DB_DIR" "$LID_MEDIA_DIR" "$LID_RESTORE_ROOT"
```

A reviewer must confirm that none of the paths is a system, user-home, workspace, repository-root, or another application's directory.

## 3. R0 read-only preflight

Run this section before installing, creating, stopping, starting, or editing anything. Keep raw output private and publish only the sanitized record in section 15.

### 3.1 Target identity and runtime

Connect only through the approved alias:

```sh
ssh -o BatchMode=yes -o ConnectTimeout=10 "$LID_TARGET_ALIAS" 'true'
```

On the target, collect versions and service state without printing network identity:

```sh
uname -srm
sed -n 's/^\(ID\|VERSION_ID\)=/\1=/p' /etc/os-release
getconf _NPROCESSORS_ONLN
docker version --format 'client={{.Client.Version}} server={{.Server.Version}}'
docker compose version
docker info --format 'driver={{.Driver}} cgroup={{.CgroupDriver}} version={{.CgroupVersion}} rootless={{.SecurityOptions}}'
cloudflared version
systemctl is-active docker
systemctl is-active cloudflared
```

Do not publish the raw `docker info` security-options value until it has been checked for identifying text.

### 3.2 Capacity and pressure baseline

```sh
awk '/^(MemTotal|MemAvailable|SwapTotal|SwapFree):/{print $1,$2,$3}' /proc/meminfo
awk '{print "load1=" $1, "load5=" $2, "load15=" $3}' /proc/loadavg
df -Pk "$LID_ROOT_PARENT"
df -Pi "$LID_ROOT_PARENT"
swapon --show --noheadings --bytes | awk '{total+=$3; used+=$4} END{print "swap_total=" total, "swap_used=" used}'
journalctl -k --since '<BASELINE_WINDOW_START>' --no-pager | grep -Ec 'oom-kill|Out of memory' || true
docker ps -q | wc -l
docker stats --no-stream --format '{{.CPUPerc}} {{.MemUsage}} {{.PIDs}}'
vmstat 5 12
```

The `docker stats` rows intentionally omit container names. Aggregate them in the private evidence worksheet; do not publish per-workload values. Repeat at representative quiet and busy periods. One workstation snapshot is not admission evidence.

### 3.3 Collision checks

Check only the candidate resources; do not enumerate other applications into the public record:

```sh
test "$(docker ps -aq --filter "label=com.docker.compose.project=$LID_PROJECT" | wc -l | tr -d ' ')" -eq 0
test "$(docker network ls -q --filter "label=com.docker.compose.project=$LID_PROJECT" | wc -l | tr -d ' ')" -eq 0
test "$(docker volume ls -q --filter "label=com.docker.compose.project=$LID_PROJECT" | wc -l | tr -d ' ')" -eq 0
test "$(ss -H -ltn "sport = :$LID_HUMAN_PORT" | wc -l | tr -d ' ')" -eq 0
test "$(ss -H -ltn "sport = :$LID_HOOK_PORT" | wc -l | tr -d ' ')" -eq 0
test "$LID_HUMAN_PORT" != "$LID_HOOK_PORT"
systemctl list-timers --all --no-legend | grep -F 'life-in-days' || true
```

If a prior Life in Days rehearsal is expected, replace the zero-count assumptions with an approved inventory and prove exact ownership. Never remove an unknown collision.

### 3.4 Tunnel ownership and rule preflight

Read the candidate configuration privately. Record only whether the file exists, its permission class, its responsible service unit, validation result, and rule-test result.

```sh
test -r "$LID_TUNNEL_CONFIG"
stat -c 'mode=%a' "$LID_TUNNEL_CONFIG"
cloudflared tunnel --config "$LID_TUNNEL_CONFIG" ingress validate
cloudflared tunnel --config "$LID_TUNNEL_CONFIG" ingress rule "https://$LID_HUMAN_HOSTNAME/<SYNTHETIC_PATH>"
cloudflared tunnel --config "$LID_TUNNEL_CONFIG" ingress rule "https://$LID_HOOK_HOSTNAME/<SYNTHETIC_CALLBACK_PATH>"
cloudflared tunnel --config "$LID_TUNNEL_CONFIG" ingress rule "https://<UNMATCHED_HOSTNAME>/<SYNTHETIC_PATH>"
```

The unmatched rule must resolve to the explicit 404 catch-all. A validation pass does not authorize editing or restarting the service.

### 3.5 Admission record and stop conditions

Do not assign container limits until the council accepts measured values for:

- protected host memory, CPU, disk-byte, inode and process reserves;
- quiet and busy co-resident baselines;
- Life in Days web/worker/media/backup peak envelopes under synthetic load;
- heavy-job non-overlap schedule;
- safe worker-stop and read-only-web behavior;
- exact candidate ports, paths, Compose resources, timers and tunnel rules.

Stop R0 if Docker/Compose behavior is unsupported, loopback publishing is not enforceable, unencrypted swap cannot be prohibited for image work, reserve is insufficient, a collision is unexplained, tunnel ownership is unclear, or a co-resident workload regresses beyond the agreed range.

If swap is enabled, media processing remains blocked unless the operator produces current boot/runtime evidence that every applicable swap device/file is encrypted and recovery-safe. Disabling or reconfiguring host swap affects co-resident workloads and requires a separate approved host change; it is not a Life in Days deployment command.

## 4. R0 SQLCipher decision experiment

This is a synthetic target-runtime experiment, not a personal-data migration.

### 4.1 Required application CLI contract

The immutable application image must provide commands equivalent to:

```sh
docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=<TMP_LIMIT> "$LID_IMAGE" lid doctor sqlcipher
docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=<TMP_LIMIT> "$LID_IMAGE" lid test encryption-canaries
docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=<TMP_LIMIT> "$LID_IMAGE" lid test wal-concurrency
docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=<TMP_LIMIT> "$LID_IMAGE" lid test lease-recovery
docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=<TMP_LIMIT> "$LID_IMAGE" lid test backup-restore
```

The release is not deployable until the real CLI and mounts are documented and these tests prove:

1. a pinned SQLCipher version and expected cipher settings;
2. FTS5 and required compile options;
3. no synthetic canary recoverable from DB, WAL, journal, temp or staged files without the key;
4. wrong/missing keys fail closed;
5. bounded busy handling with one web, one callback-gateway, and one worker process;
6. durable lease/outbox recovery after kill and stale lease;
7. Online Backup output opens, verifies, restores and matches invariants;
8. memory, CPU and I/O fit the accepted coexistence envelope.

### 4.2 Fallback decision

If any hard SQLCipher gate fails, record ADR-002 as PostgreSQL fallback and repeat capacity, encryption, search, backup, restore and upgrade proofs. PostgreSQL must be private to the Compose network, publish no host port, use a dedicated service secret, and fit the same host reserve. Do not run both databases in steady state except inside an approved bounded migration rehearsal.

## 5. Directory and secret preparation

Run only after preflight approval. The values below must already resolve to narrow, reviewed paths.

```sh
sudo install -d -o root -g root -m 0750 "$LID_ROOT"
sudo install -d -o root -g root -m 0750 "$LID_RELEASE_DIR" "$LID_CONFIG_DIR"
sudo install -d -o <APP_UID> -g <APP_GID> -m 0750 "$LID_DB_DIR" "$LID_MEDIA_DIR"
sudo install -d -o <BACKUP_UID> -g <BACKUP_GID> -m 0750 "$LID_PREPARED_DIR"
sudo install -d -o root -g root -m 0700 "$LID_SECRET_DIR"
sudo test ! -e "$LID_SECRET_DIR/sqlcipher-key"
sudo test ! -e "$LID_SECRET_DIR/media-keyring"
sudo test ! -e "$LID_SECRET_DIR/access-audience"
sudo test ! -e "$LID_SECRET_DIR/callback-test-secret"
sudo install -m 0600 -o root -g root /dev/null "$LID_SECRET_DIR/sqlcipher-key"
sudo install -m 0600 -o root -g root /dev/null "$LID_SECRET_DIR/media-keyring"
sudo install -m 0600 -o root -g root /dev/null "$LID_SECRET_DIR/access-audience"
sudo install -m 0600 -o root -g root /dev/null "$LID_SECRET_DIR/callback-test-secret"
```

Provision values with the approved interactive secret manager or root-only provisioning command. Do not place secret values in shell history, process arguments, environment files, Compose YAML, chat, screenshots, or the repository. Verify only permissions and non-zero length:

```sh
sudo stat -c '%a %s' "$LID_SECRET_DIR/sqlcipher-key" "$LID_SECRET_DIR/media-keyring" "$LID_SECRET_DIR/access-audience" "$LID_SECRET_DIR/callback-test-secret"
sudo test "$(sudo stat -c '%a' "$LID_SECRET_DIR/sqlcipher-key")" = "600"
sudo test -s "$LID_SECRET_DIR/sqlcipher-key"
sudo test -s "$LID_SECRET_DIR/media-keyring"
sudo test -s "$LID_SECRET_DIR/access-audience"
sudo test -s "$LID_SECRET_DIR/callback-test-secret"
```

Provider credentials are separate files and granted only to the service that needs each one. The web service never receives Telegram, VoiceNotes, text-model, artwork-model, backup-repository, or tunnel credentials.

## 6. Compose isolation contract

The production Compose file must resolve to the properties below. Values remain placeholders until the R0 capacity gate passes.

```yaml
name: life-in-days

services:
  web:
    image: ${LID_IMAGE:?immutable image digest required}
    user: "${LID_APP_UID:?}:${LID_APP_GID:?}"
    read_only: true
    init: true
    restart: unless-stopped
    stop_grace_period: 30s
    cap_drop: [ALL]
    security_opt: ["no-new-privileges:true"]
    pids_limit: ${LID_WEB_PIDS:?}
    mem_limit: ${LID_WEB_MEMORY:?}
    memswap_limit: ${LID_WEB_MEMORY:?}
    cpus: ${LID_WEB_CPUS:?}
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=${LID_WEB_TMPFS:?}
    ports:
      - "127.0.0.1:${LID_HUMAN_PORT:?}:8080"
    secrets: [sqlcipher_key, media_keyring, access_audience]
    volumes:
      - type: bind
        source: ${LID_DB_DIR:?}
        target: /var/lib/lid/db
        bind: {create_host_path: false}
      - type: bind
        source: ${LID_MEDIA_DIR:?}
        target: /var/lib/lid/media
        read_only: true
        bind: {create_host_path: false}
    networks: [backend, egress]
    healthcheck:
      test: [CMD, /app/bin/lid, health, local]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s
    logging:
      driver: json-file
      options: {max-size: "${LID_LOG_MAX_SIZE:?}", max-file: "${LID_LOG_MAX_FILES:?}"}

  hooks:
    image: ${LID_IMAGE:?immutable image digest required}
    command: [/app/bin/lid, serve, hooks]
    user: "${LID_APP_UID:?}:${LID_APP_GID:?}"
    read_only: true
    init: true
    restart: unless-stopped
    stop_grace_period: 30s
    cap_drop: [ALL]
    security_opt: ["no-new-privileges:true"]
    pids_limit: ${LID_HOOK_PIDS:?}
    mem_limit: ${LID_HOOK_MEMORY:?}
    memswap_limit: ${LID_HOOK_MEMORY:?}
    cpus: ${LID_HOOK_CPUS:?}
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=${LID_HOOK_TMPFS:?}
    ports:
      - "127.0.0.1:${LID_HOOK_PORT:?}:8081"
    secrets: [sqlcipher_key, callback_test_secret]
    volumes:
      - type: bind
        source: ${LID_DB_DIR:?}
        target: /var/lib/lid/db
        bind: {create_host_path: false}
    networks: [backend, egress]
    healthcheck:
      test: [CMD, /app/bin/lid, health, hooks]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s
    logging:
      driver: json-file
      options: {max-size: "${LID_LOG_MAX_SIZE:?}", max-file: "${LID_LOG_MAX_FILES:?}"}

  worker:
    image: ${LID_IMAGE:?immutable image digest required}
    command: [/app/bin/lid, work, --media-concurrency=1]
    user: "${LID_APP_UID:?}:${LID_APP_GID:?}"
    read_only: true
    init: true
    restart: unless-stopped
    stop_grace_period: 60s
    cap_drop: [ALL]
    security_opt: ["no-new-privileges:true"]
    pids_limit: ${LID_WORKER_PIDS:?}
    mem_limit: ${LID_WORKER_MEMORY:?}
    memswap_limit: ${LID_WORKER_MEMORY:?}
    cpus: ${LID_WORKER_CPUS:?}
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=${LID_MEDIA_TMPFS:?}
    secrets: [sqlcipher_key, media_keyring]
    volumes:
      - type: bind
        source: ${LID_DB_DIR:?}
        target: /var/lib/lid/db
        bind: {create_host_path: false}
      - type: bind
        source: ${LID_MEDIA_DIR:?}
        target: /var/lib/lid/media
        bind: {create_host_path: false}
    networks: [backend, egress]
    healthcheck:
      test: [CMD, /app/bin/lid, health, worker]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 30s
    logging:
      driver: json-file
      options: {max-size: "${LID_LOG_MAX_SIZE:?}", max-file: "${LID_LOG_MAX_FILES:?}"}

networks:
  backend:
    internal: true
  egress: {}

secrets:
  sqlcipher_key: {file: ${LID_SECRET_DIR:?}/sqlcipher-key}
  media_keyring: {file: ${LID_SECRET_DIR:?}/media-keyring}
  access_audience: {file: ${LID_SECRET_DIR:?}/access-audience}
  callback_test_secret: {file: ${LID_SECRET_DIR:?}/callback-test-secret}
```

This is an R0 synthetic control skeleton, not a deployable file. The implementation must add exact environment allowlists, backup service/profile, dependency readiness, and an egress policy. The target rehearsal must prove that equal memory/swap limits have the intended no-container-swap effect; that setting does not replace the host-level unencrypted-swap gate for tmpfs media. R2 may add Telegram webhook-secret and numeric sender-policy grants to `hooks`, and the bot token to `worker`, only after its acceptance gates; R5 and AI releases follow the same service-specific overlay rule. R0 uses only the synthetic callback secret and must not provision live-provider credentials. No release may add `container_name`, `privileged`, host network/PID, wildcard port binding, Docker socket, another application's network/volume, or mutable image tags.

Validate the exact release without starting it:

```sh
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" config --quiet
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" config --images
docker image inspect "$LID_IMAGE" --format 'digest={{json .RepoDigests}} user={{json .Config.User}}'
```

Review the resolved file privately for accidental secrets, wildcard ports, unbounded resources, shared mounts, mutable tags, and extra services. Record only digest and pass/fail evidence.

## 7. Tunnel candidate and Access contract

Prefer a dedicated Life in Days tunnel/configuration service if the account and host review approve it. Otherwise make the smallest edit to the existing complete configuration under its owner's change process.

```yaml
ingress:
  - hostname: <HUMAN_HOSTNAME>
    service: http://127.0.0.1:<LOOPBACK_HUMAN_PORT>
  - hostname: <CALLBACK_HOSTNAME>
    service: http://127.0.0.1:<LOOPBACK_CALLBACK_PORT>
  - service: http_status:404
```

Before replacement, copy the existing configuration to a root-restricted change directory, generate a candidate file, and validate the entire candidate. Do not print either file.

```sh
sudo install -d -o root -g root -m 0700 "$LID_CONFIG_DIR/tunnel-change-$LID_CHANGE_ID"
sudo test ! -e "$LID_CONFIG_DIR/tunnel-change-$LID_CHANGE_ID/original.yml"
sudo install -o root -g root -m 0600 "$LID_TUNNEL_CONFIG" "$LID_CONFIG_DIR/tunnel-change-$LID_CHANGE_ID/original.yml"
cloudflared tunnel --config "$LID_CONFIG_DIR/tunnel-change-$LID_CHANGE_ID/candidate.yml" ingress validate
cloudflared tunnel --config "$LID_CONFIG_DIR/tunnel-change-$LID_CHANGE_ID/candidate.yml" ingress rule "https://$LID_HUMAN_HOSTNAME/<SYNTHETIC_PATH>"
cloudflared tunnel --config "$LID_CONFIG_DIR/tunnel-change-$LID_CHANGE_ID/candidate.yml" ingress rule "https://$LID_HOOK_HOSTNAME/<SYNTHETIC_CALLBACK_PATH>"
cloudflared tunnel --config "$LID_CONFIG_DIR/tunnel-change-$LID_CHANGE_ID/candidate.yml" ingress rule "https://<UNMATCHED_HOSTNAME>/<SYNTHETIC_PATH>"
```

The human Access application must require the exact owner policy, reviewed MFA and session duration. The origin must validate Access JWT signature, issuer, audience, expiry and key rotation. The callback hostname must not use the human session as machine authorization; each provider uses its own strict method/path/body/auth/idempotency contract.

All personal HTML/API/media responses must include `Cache-Control: private, no-store`, an appropriate `Referrer-Policy`, and no permissive CORS. Confirm no edge rule overrides these headers. Content-hashed static application assets may use a separately reviewed cache policy.

## 8. Application-consistent predeploy backup

No release with a persistent-data change starts until this sequence passes.

### 8.1 Prepare a consistent snapshot

The application CLI must stop new job claims or establish an equivalent transaction boundary, use the SQLCipher-compatible SQLite Online Backup API, and produce an encrypted snapshot plus secret-free manifest. Do not use `cp` on the live database.

```sh
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" exec -T web /app/bin/lid jobs pause --reason "$LID_CHANGE_ID"
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" exec -T web /app/bin/lid jobs await-safe --timeout <SECONDS>
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" run --rm --no-deps backup /app/bin/lid backup prepare --output "/prepared/$LID_CHANGE_ID"
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" run --rm --no-deps backup /app/bin/lid backup verify-prepared --input "/prepared/$LID_CHANGE_ID"
```

If this is first R0 start, use the same commands against synthetic state in the rehearsal stack. The backup service receives read-only media and a prepared-snapshot destination; it does not receive provider credentials or the Docker socket.

### 8.2 Store independently with Restic

```sh
sudo -u <BACKUP_USER> "$LID_RESTIC_COMMAND" --repository-file "$LID_RESTIC_REPOSITORY_FILE" --password-file "$LID_RESTIC_PASSWORD_FILE" backup "$LID_PREPARED_DIR/$LID_CHANGE_ID"
sudo -u <BACKUP_USER> "$LID_RESTIC_COMMAND" --repository-file "$LID_RESTIC_REPOSITORY_FILE" --password-file "$LID_RESTIC_PASSWORD_FILE" snapshots --latest 1
sudo -u <BACKUP_USER> "$LID_RESTIC_COMMAND" --repository-file "$LID_RESTIC_REPOSITORY_FILE" --password-file "$LID_RESTIC_PASSWORD_FILE" check --read-data-subset=<REVIEWED_SUBSET>
```

The root-owned wrapper is a reviewed executable that injects only the backup identity's scoped backend credential from a protected file, scrubs unrelated environment variables, and never places credentials in arguments or logs. A repository check is not a restore. Capture the opaque snapshot ID privately and complete section 11 before claiming recovery evidence. Retention/prune runs only through a separate reviewed timer and never during a deployment window.

## 9. Controlled deploy

### 9.1 Entry checklist

Require all of these:

- authorized exact target and approved change record;
- R0 capacity/collision/SQLCipher decision evidence accepted;
- immutable image digest, SBOM and migration reviewed;
- resolved Compose configuration reviewed and secret-free;
- current consistent snapshot, independent Restic snapshot and restore evidence;
- prior immutable digest and compatible rollback decision available;
- tunnel candidate validated and catch-all tested;
- operator, observer and rollback decision-maker present;
- synthetic fixtures only for R0.

### 9.2 Start sequence

```sh
docker pull "$LID_IMAGE"
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" config --quiet
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" run --rm --no-deps web /app/bin/lid migrate precheck
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" run --rm --no-deps web /app/bin/lid migrate apply
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" up -d --no-build web hooks worker
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" ps
```

The command deliberately omits `--remove-orphans`; compare the exact scoped project inventory before and after. Never run `down` to achieve an upgrade.

Apply the validated tunnel candidate only through the approved service-specific change method. If the existing `cloudflared` unit serves other applications, its owner must approve and observe the change. A whole-service restart is not implied by this runbook.

### 9.3 Local and external verification

Use only synthetic identifiers and bodies:

```sh
curl --fail --silent --show-error "http://127.0.0.1:$LID_HUMAN_PORT/health/live"
curl --fail --silent --show-error "http://127.0.0.1:$LID_HUMAN_PORT/health/ready"
curl --fail --silent --show-error "http://127.0.0.1:$LID_HOOK_PORT/health/live"
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' "http://127.0.0.1:$LID_HUMAN_PORT/<PRIVATE_ROUTE>"
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' -X POST "http://127.0.0.1:$LID_HOOK_PORT/<SYNTHETIC_CALLBACK_PATH>"
```

Expected negative results must be defined before running them. Verify externally from an authorized browser/test client:

- missing, malformed, wrong-audience and expired Access assertions are denied at origin;
- exact owner Access session succeeds and session expiry returns to authentication safely;
- human routes are absent on the callback hostname and callback routes absent on the human hostname;
- wrong method/path, oversized body, missing/wrong provider secret, wrong sender/chat and replay are rejected before media download;
- unmatched hostname reaches the 404 catch-all;
- personal routes emit private/no-store headers and are absent from shared-cache evidence;
- no query, journal content, filename, token, assertion, prompt, image metadata or photo-derived field appears in URL/log output;
- schema, queue, backup status, storage state and software version in System Health are factual.

### 9.4 Co-resident non-regression observation

Compare the accepted quiet/busy baseline with the post-start and synthetic-soak windows. Report only normalized aggregate ranges. Stop the Life in Days worker first if host reserve or a co-resident error budget is breached; do not stop or reconfigure another workload.

## 10. Rollback

Declare the rollback branch in the migration review before deployment.

### 10.1 Compatible-schema image rollback

```sh
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" exec -T web /app/bin/lid jobs pause --reason "$LID_CHANGE_ID-rollback"
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" exec -T web /app/bin/lid jobs await-safe --timeout <SECONDS>
LID_IMAGE="$LID_PRIOR_IMAGE" docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" up -d --no-build web hooks worker
LID_IMAGE="$LID_PRIOR_IMAGE" docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" exec -T web /app/bin/lid migrate postcheck
LID_IMAGE="$LID_PRIOR_IMAGE" docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" exec -T web /app/bin/lid health invariant
LID_IMAGE="$LID_PRIOR_IMAGE" docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" exec -T web /app/bin/lid jobs resume
```

Repeat access, callback, cache, content, queue and co-resident checks. Retain the failed image and evidence until incident closure; do not prune.

### 10.2 Forward-only schema

Do not run an improvised reverse migration. Keep writes paused and apply only the pre-reviewed forward fix. If there is no safe forward fix, use separate-path restore.

### 10.3 Tunnel-only rollback

Restore only the tunnel candidate's protected original through the tunnel owner's approved command, validate it first, and rule-test existing mappings plus catch-all. Do not restart an unrelated proxy or Docker service. Preserve application receipts so reconciliation can recover missed callbacks.

### 10.4 Provider isolation rollback

Disable only the affected callback or exact AI configuration. Never silently switch providers. Authentic capture, browsing, correction, export and backup remain available where safe.

## 11. Restore and Recovery Ceremony

A backup is not recovery evidence until this section passes.

### 11.1 Restore into a separate path

Resolve a new, empty, reviewed directory that is neither the active root nor its parent. Do not delete or overwrite the active copy.

```sh
test -n "$LID_RESTORE_ROOT" && test "$LID_RESTORE_ROOT" != "/" && test "$LID_RESTORE_ROOT" != "$LID_ROOT"
sudo install -d -o <RESTORE_UID> -g <RESTORE_GID> -m 0750 "$LID_RESTORE_ROOT"
sudo -u <BACKUP_USER> "$LID_RESTIC_COMMAND" --repository-file "$LID_RESTIC_REPOSITORY_FILE" --password-file "$LID_RESTIC_PASSWORD_FILE" restore <OPAQUE_SNAPSHOT_ID> --target "$LID_RESTORE_ROOT"
docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=<TMP_LIMIT> --mount "type=bind,src=$LID_RESTORE_ROOT,dst=/restore,readonly" --mount "type=bind,src=<RECOVERY_KEY_FILE>,dst=/run/secrets/recovery-key,readonly" "$LID_IMAGE" /app/bin/lid restore verify --input /restore
```

The verifier must check manifest/schema/application version, ciphertext hashes, relationship counts, all implemented record/media/artwork/export shapes, expected absence rules, sample decrypt/render with synthetic fixtures, and no unexpected external calls.

### 11.2 Disposable restored stack

Start a separately named rehearsal project on separately confirmed loopback ports, with provider egress disabled and no tunnel mapping:

```sh
LID_RESTORE_PROJECT="life-in-days-restore-<OPAQUE_ID>"
test "$(docker ps -aq --filter "label=com.docker.compose.project=$LID_RESTORE_PROJECT" | wc -l | tr -d ' ')" -eq 0
docker compose -p "$LID_RESTORE_PROJECT" --env-file <RESTORE_ENV_FILE> -f <RESTORE_COMPOSE_FILE> config --quiet
docker compose -p "$LID_RESTORE_PROJECT" --env-file <RESTORE_ENV_FILE> -f <RESTORE_COMPOSE_FILE> up -d --no-build web worker
docker compose -p "$LID_RESTORE_PROJECT" --env-file <RESTORE_ENV_FILE> -f <RESTORE_COMPOSE_FILE> exec -T web /app/bin/lid health invariant
docker compose -p "$LID_RESTORE_PROJECT" --env-file <RESTORE_ENV_FILE> -f <RESTORE_COMPOSE_FILE> stop worker web
```

After evidence retention, remove this exact rehearsal project only under a separately reviewed cleanup step. Do not use `-v`; retain restored data until the evidence owner approves recoverable disposal.

### 11.3 Recovery Ceremony acceptance

The owner must prove that two off-server recovery-key copies can be located and used, a clean environment can rebuild from repository artifacts, the selected independent snapshot decrypts and restores, representative authentic shapes render correctly when personal-data use is later authorized, and the measured recovery time is recorded. Do not call the four-hour objective an SLA.

## 12. Pressure and incident responses

### Host pressure

1. Pause new heavy-job claims.
2. Stop only the scoped worker if reserve remains breached.
3. Keep authenticated reads and permitted non-media actions only when invariants remain healthy.
4. Reject new media with the exact safe capacity state; do not delete Originals or another workload's data.
5. Collect sanitized aggregate pressure evidence and open an incident decision.

```sh
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" exec -T web /app/bin/lid jobs pause --reason capacity
docker compose -p "$LID_PROJECT" --env-file "$LID_ENV_FILE" -f "$LID_COMPOSE_FILE" stop worker
```

### Suspected plaintext or secret exposure

Stop affected ingestion/generation, preserve access-controlled evidence, revoke/rotate the exact credential through its provider, assess ciphertext and log boundaries, and restore service only after canary and negative tests pass. Never paste the exposed value into the incident record.

### Database integrity failure

Freeze writes, do not vacuum/rekey/repair the only copy, prepare a separate-path restore, compare manifests and invariants, then make an explicit cutover/forward-fix decision.

### Callback failure

Disable only the affected route if needed, preserve durable receipts, and recover through idempotent reconciliation. Telegram success acknowledgement must never precede durable capture. VoiceNotes remains disabled until its R5 synthetic contract passes.

### Backup or restore failure

Mark System Health as failed/unknown accurately, block releases and personal-data launch gates, retain the last known restorable snapshot, and repair the recovery path before resuming a change. A successful upload or repository check does not clear the incident.

## 13. Scheduled operation templates

Install timers only after collision review. Use dedicated service users, lock files, timeouts, resource constraints, randomized delays where appropriate, and non-overlap with image/export/artwork work.

| Operation | Contract |
| --- | --- |
| Queue worker | Durable leases; restart-safe; image concurrency one; safe stale-lease recovery |
| VoiceNotes reconciliation | R5 onward only; complete paging; partial listing aborts without destructive conclusions |
| Artwork sweep | R7 onward only; 01:00 Asia/Kolkata product rule; idempotent; budget and source-hash gates |
| Backup prepare/Restic | Application-consistent snapshot; heavy-job semaphore; repository check and scheduled restore |
| Retention/prune | Separate from deployment; reviewed 48 hourly/30 daily/12 monthly policy; no success claim without restore |
| Export cleanup | Lease-aware expiry; never remove active or failed-review artifacts silently |
| System Health projection | Durable safe fields only; no journal/media/provider payloads or raw logs |

## 14. R10 date-free object-store transition appendix

Do not execute this section until a measured PRD watermark triggers `PID-R10-001`, the PID is approved, and `ARCH-R10-001` has provider-specific commands. R10 has no start or target date before that trigger.

Required phases:

1. record trigger evidence and freeze the media manifest schema;
2. create a private EU target with public access disabled and least-privilege scoped credentials;
3. inventory every root object through complete pagination and compare count, ciphertext byte size, hash, type, references and backup eligibility;
4. copy ciphertext idempotently while root remains authoritative;
5. enable durable dual-write and reconcile interrupted/unknown outcomes fail closed;
6. make the remote store an application-consistent Restic source and prove clean restore;
7. switch the authoritative pointer reversibly and observe real authenticated reads for the approved window;
8. roll back on any mismatch, missing object, decrypt failure, partial list, backup/restore failure or read error;
9. evict eligible root ciphertext only after council acceptance, never Originals by ad hoc cleanup.

Expected application-level command contract:

```sh
/app/bin/lid object-store inventory --manifest <SIGNED_MANIFEST_PATH>
/app/bin/lid object-store copy --resume --manifest <SIGNED_MANIFEST_PATH>
/app/bin/lid object-store reconcile --complete-list --verify-ciphertext-hashes
/app/bin/lid object-store dual-write enable --change <OPAQUE_CHANGE_ID>
/app/bin/lid object-store authority switch --to remote --reversible
/app/bin/lid object-store observe-reads --window <APPROVED_WINDOW>
/app/bin/lid object-store authority rollback --to root
```

These placeholders are not a provider selection or executable implementation. The approved PID/runbook must supply exact flags, pagination/error semantics, credentials, independent-backup behavior, cutover invariants and rollback evidence. Never enable a public development URL or direct browser object URL.

## 15. Public-safe evidence record

Store raw evidence privately. The repository record may contain only:

| Field | Allowed value |
| --- | --- |
| Evidence ID | Opaque identifier |
| Date/window | Date and duration, without access URL |
| Operator/reviewer | Role, not private account details |
| Release/task | Canonical ID such as `SPK-R0-001` or `REL-R0-001` |
| Target class | `shared host`, without hostname/address/account ID |
| Runtime | Sanitized OS/arch and Docker/Compose/cloudflared versions |
| Baseline | Normalized aggregate memory/CPU/disk/load ranges and protected reserve |
| Collision result | Pass/fail and collision class, without other project names |
| SQLCipher decision | Pass/fail per gate; selected baseline/fallback; image digest |
| Access/callback/cache | Named negative scenarios and pass/fail |
| Backup/restore | Opaque snapshot/evidence ID, counts/hashes matched, elapsed time |
| Coexistence | Accepted range and pass/fail, without another service's identity |
| Rollback | Branch exercised, result, elapsed time |
| Exceptions | Sanitized risk, owner role, expiry and next action |
| Decision | Stop, continue synthetic, or authorize next gate; never infer live launch |

## 16. Gate-to-command map

| Gate | Runbook evidence | Canonical task |
| --- | --- | --- |
| Target/runtime/capacity/collision | Sections 3.1–3.5 | `SPK-R0-001`, `ARCH-R0-001` |
| SQLCipher versus PostgreSQL | Section 4 | `SPK-R0-001`, `ARCH-R0-001` |
| Secrets/process/filesystem isolation | Sections 5–6 | `ARCH-R0-001`, `ENG-R0-001` |
| Tunnel, Access, callback and cache | Section 7 and 9.3 | `ARCH-R0-001`, `ENG-R0-001` |
| Consistent backup and independent restore | Sections 8 and 11 | `ENG-R0-001`, `REL-R0-001` |
| Deploy and co-resident non-regression | Section 9 | `ENG-R0-001`, `REL-R0-001` |
| Compatible rollback/separate-path restore | Sections 10–11 | `REL-R0-001` |
| Conditional object-store transition | Section 14 | `PID-R10-001`, `ARCH-R10-001`, `REL-R10-001` |

R0 is accepted only from executed synthetic evidence for every named gate. This document's existence is planning evidence, not deployment, restore, or readiness evidence.
