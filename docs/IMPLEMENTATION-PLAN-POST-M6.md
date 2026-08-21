# Implementation plan — Phase 1.5, post-M6 (M7–M19)

_Written 2026-08-21 on branch `plan/post-m6`. Sequel to `docs/IMPLEMENTATION-PLAN.md`, which covers M1–M6 and is not superseded by this document. Sources: `reference/PRODUCT-REQUIREMENTS.md`, `reference/UX-SPECIFICATION.md`, `reference/CONTEXT.md`, `reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md`._

The existing plan takes the archive from nothing to a deployed private web app: browse a calendar, read a Journal Day, see real photos, upload a journal, correct and redate and trash, reach it from a phone. This document covers everything the product is supposed to be after that, and it is the second half of one plan, not a new one. Read them together. Where this document and the existing plan disagree, the disagreement is called out explicitly and the reason is given — there is no silent override anywhere in here.

Like the existing plan, this is not a contract or a governance artifact. The tickets are on GitHub and the code is the deliverable.

---

## 0. Two things that changed, before anything else

### 0.1 The scope rule in existing plan §7 is superseded

The M1–M6 plan closes §7 with a rule that decided what was and was not a Phase 1.5 ticket:

> **Rule for ticket writing:** a Phase 1.5 ticket may cite any requirement ID as context, but if satisfying it requires an AI provider, a cloud storage backend, a cryptographic envelope, or an authentication decision, it is not a Phase 1.5 ticket.

That rule was correct for M1–M6 and it is **no longer in force.** The owner has expanded Phase 1.5 to cover the full v1 product, so AI providers (M10, M11), a cloud storage backend (M14), a cryptographic envelope (M13, M16), and an authentication decision (M13) are all now in scope and each has its own milestone. Existing plan §7's *list* of unbuilt things is therefore not a boundary any more — it is this document's table of contents. The only part of §7 that survives is `LID-DEF-*`, which stays out (see §6).

Nothing else in the existing plan is superseded. In particular §5.1's schema, §5.3's Journal Date module, §8.1's palette decision, and §8.2's ingest decision all still hold, and §3's directory layout is extended rather than replaced.

### 0.2 This plan is much bigger than the reset intended, and that is worth saying out loud

`HANDOVER-PHASE-1.5.md` §4 diagnoses why this project failed twice — 137 commits, 466 planning documents, a 58-task governance roadmap, a five-seat "Product Council," ~5,800 lines of coordination code, and zero rendered journal entries — and prescribes a size limit in response:

> Aim for roughly 25–40 tickets total, not 58, and certainly not 300.

M1–M6 came in at 36 tickets and honoured that. This document adds roughly ninety more, which is more than double the prescribed ceiling. I am not going to pretend that is consistent.

Here is the honest version. The 25–40 figure was a limit on **planning for a product whose first screen did not exist yet.** That constraint has done its job: the calendar renders, a day opens, a photo displays. What follows is not speculative planning — every milestone below extends something already running. The failure mode §4 describes was tickets *about the project* (readiness states, dossiers, councils, coverage trackers). Ninety tickets about capturing photos, deriving titles, and proving a restore is a different thing from ninety tickets about governing the work.

The limit that actually still binds, and that I have applied instead, is the one in `CLAUDE.md`: **no meta-tooling, and every milestone ends with something the owner can see or do that he could not before.** Every ticket in M7–M19 moves pixels or data. There is no validator, no registry, no traceability database, no ticket-generation script, and no "decisions" milestone. If the count is the wrong trade, the right response is to cut whole milestones from the end of the list — not to compress ninety real contracts into forty vague ones.

---

## 1. What "done" means for v1

M6 leaves the owner with an archive he can read. v1 leaves him with an archive that **maintains itself and cannot be lost.** Six things have to become true:

1. **Photos arrive by themselves.** He takes a photo on his phone, sends it to a Telegram bot, and it is on the right Journal Day a moment later with an acknowledgement telling him which day it landed on. No filesystem, no laptop. (M8)
2. **Journals arrive by themselves.** He speaks into VoiceNotes, tags it `life-in-days`, and the transcript appears on the right day. Editing it upstream later updates the archive without destroying what was already there. (M9)
3. **Days describe themselves.** Each Journal Day carries a title, a short factual summary, and a few tags he did not have to write — and any field he edits himself stops being overwritten, permanently, until he says otherwise. (M10)
4. **Empty days have a face.** A day with words but no photo gets a piece of generated artwork, in one consistent style, so the calendar has no blank tiles. A real Daily Photo always outranks it. (M11)
5. **He can find anything.** Type a phrase and get the days that contain it. Read a month as a Monthly Almanac instead of a grid. (M7)
6. **He could lose the server without losing the archive.** The database is unreadable without a key he holds in two places off the server, media has somewhere to grow to, and a restore has been rehearsed against a four-hour objective rather than assumed. (M13, M14, M15, M16)

Underneath those, two things have to be true that he will mostly not notice until they matter: the archive tells him when a backup has stopped running or an integration has gone quiet (M17), and every surface works by keyboard, by screen reader, and on a phone (M18). M19 is the day he checks the whole thing over and decides it is good enough to trust with fourteen years of days.

**What v1 is still not:** a public product, a multi-user system, a mobile app, a semantic search engine, or a reflection surface. See §6.

---

## 2. What changes in the stack, and what does not

Nothing in existing plan §2 is reversed. Node 22 LTS, TypeScript, Fastify, `better-sqlite3`, server-rendered HTML from tagged-template functions, one hand-written stylesheet, `sharp`, `node:test` + `node:assert`. **React, Next.js, an ORM, and a migration framework stay rejected**, and the reasons still hold: one user, one host, one process, and transaction boundaries (existing plan §5.2, extended in M12) that the domain makes load-bearing and an ORM would hide.

What is genuinely new:

| Layer | Addition | Milestone | Note |
| --- | --- | --- | --- |
| Search | SQLite **FTS5**, in the same database file | M7 | Not a new dependency — a compile-time SQLite feature. It must be *proven present* in the pinned build, not assumed (spike §5.4). |
| Inbound webhooks | A second Fastify listener on a separate hostname with no human routes | M8 | Not a second framework. Same process tree, different bound port and route table. |
| Outbound HTTP | One provider-adapter module per role, `fetch` only | M10, M11 | No SDK. See below. |
| Object storage | Cloudflare **R2** via the S3-compatible API | M14 | A second implementation behind the storage interface #196 already defines. |
| Backups | **Restic** to Backblaze **B2 EU Central** | M15 | An external binary invoked by a script, not a library. |
| Encryption at rest | Undecided — M13's ADR chooses | M13 | See §2.3. |
| Archives | AES-256 ZIP for export | M16 | Library choice deferred to a small ADR inside M16. |

### 2.1 The scheduler: not decided here, and deliberately not assumed

Five things in this plan need to happen without the owner asking: the 01:00 AI text refresh, the 01:00 Artwork Sweep, the 15-minute Source Quiet Period, VoiceNotes reconciliation, and scheduled backups. Existing plan §2 says **no job queue**, and the PRD defers "durable job/scheduler mechanism" to an ADR that has never been written.

I am not resolving that here, and I am not designing around it either. **The scheduler ADR is the second ticket of M10** — the first milestone that genuinely needs it — and every scheduled behaviour in M10, M11, M15 and M17 declares a dependency on it. The ADR decides between the two honest options and one hybrid:

- **`cron` plus idempotent commands.** Each scheduled behaviour is a command safe to run twice. No new tables, no leases, no worker process. Fails badly if a run needs to survive a crash mid-way or retry with backoff.
- **A `job` table in the same SQLite file, polled by one in-process worker.** Durable, leasable, retryable, and observable from the System Health surface in M17. Costs a table, a lease protocol, and the "one writer" reasoning that SQLite WAL forces (spike §5.4).
- **Hybrid:** `cron` triggers, `job` rows only for work that must survive a crash (provider calls with spend attached, R2 dual-write, Restic runs).

The `job` table sketched in §3.9 exists in this document **only to show what the second option would cost.** It is not a decision and no ticket outside the ADR references it as though it were.

### 2.2 The provider-adapter shape

Two roles, **Text Provider** and **Artwork Provider**, configured independently, with **no silent fallback** between them or between models. One module each, one interface, `fetch` and nothing else:

```ts
// src/providers/types.ts
export interface TextProviderRequest {
  readonly journalText: string;      // ordered, normalized. The ONLY personal content.
  readonly modelId: string;
}
export interface TextProviderResult {
  readonly title: string;
  readonly summary: string;          // 80–140 words
  readonly tags: readonly string[];  // 3–7, short, unique
  readonly visualBrief: string;      // 150–300 tokens, consumed by the Artwork Provider
}
export interface ArtworkProviderRequest {
  readonly visualBrief: string;      // read-only. The ONLY personal content.
  readonly modelId: string;
}
```

Three properties are structural, not stylistic, and each has a ticket that proves it:

- **The request types cannot carry a photo, a caption, or an identifier.** There is no field for one. That is the privacy boundary expressed as a type signature rather than as a comment, and it is why the interface is worth writing down in a plan.
- **Requests are stateless.** No conversation, no files, no tools, no grounding, no retrieval. Every call is complete in itself.
- **No SDK.** An official client library adds telemetry surface, transitive dependencies, and its own retry policy competing with the one the PRD specifies. Two POSTs and a JSON schema check do not need one.

Retry policy, identical in both adapters: timeouts, 429s and transient 5xx retry up to **3 times** with backoff and jitter, honouring `Retry-After`; an invalid response schema retries **once** against the same provider and model; **auth, quota and billing errors stop immediately** and surface to the owner. A refusal is not an error to retry — see M11.

### 2.3 Encryption is undecided, and the spike is not authority

The PRD requires **application-controlled, versioned encryption at rest** and is explicit that this is **not** end-to-end and **not** zero-knowledge. It never names a library. `reference/HETZNER-SHARED-HOST-DEPLOYMENT-SPIKE.md` names SQLCipher throughout, and that document is over-scoped reference research — it assumes Docker Compose, three services, R2 and Restic as settled facts — so its choice is one option, not a decision.

**M13's first ticket is the encryption and key-design ADR** and every other M13 ticket depends on it. The one fact from the spike worth carrying forward as input rather than conclusion: SQLCipher is a *specialized SQLite build, not a loadable extension* (spike §5.4), so choosing it means pinning and proving a custom `better-sqlite3` build with FTS5 enabled — which collides directly with M7's search index and with existing plan §8.4's warning about native ABI pain on the Hetzner host. The ADR has to price that in, not discover it.

### 2.4 Where the data lives — extending existing plan §3

```
data/                          # gitignored. Never committed.
  archive.sqlite               # the database; encryption per M13's ADR
  media/
    originals/<sha256>         # exact received bytes, never modified, never deleted
    derivatives/<sha256>       # metadata-stripped display copies
    artwork/<sha256>           # Generated Artwork bytes (M11) — derived, not captured
  inbox/photos/                # M3 ingest drop zone. Still supported. Not deprecated by M8.
  staging/                     # M8/M13: memory-backed, bounded, cleared on completion
  export/                      # M16: encrypted archives, deleted on download or after 1 hour
  backup/                      # M15: Restic cache and the local fast-path snapshot
```

`data/media/artwork/` is separate from `originals/` on purpose. Originals are the one unrecoverable asset in the system (existing plan §8.5); artwork is regenerable and must never be mistaken for a captured photo by a backup policy, a storage watermark, or a person reading a directory listing.

---

## 3. Schema additions — extending existing plan §5.1

The four v0.1 tables (`journal_day`, `source_item`, `source_revision`, `media_asset`) are not touched structurally except one CHECK constraint (§3.1). Everything else below is additive: new tables, referencing the existing ones by their existing column names. Migrations remain numbered `.sql` files applied by the existing runner (#185) — nothing here authorises a migration framework.

### 3.1 One CHECK constraint has to widen: Voice Journals are a new `source_item.kind`

```sql
-- source_item.kind was CHECK (kind IN ('uploaded_journal','daily_photo')).
-- M9 adds a third kind. SQLite cannot ALTER a CHECK constraint in place, so this migration
-- rebuilds the table (recreate, copy, drop, rename) rather than fighting for an ALTER syntax
-- that does not exist. With ~36 fixture rows in dev and no production data yet, this is cheap.
CREATE TABLE source_item_new (
  id                 TEXT PRIMARY KEY,
  kind               TEXT NOT NULL CHECK (kind IN ('uploaded_journal','daily_photo','voice_journal')),
  journal_date       TEXT REFERENCES journal_day(journal_date),
  original_timestamp TEXT NOT NULL,
  source_title       TEXT,
  content_sha256     TEXT NOT NULL,
  trashed_at         TEXT,
  created_at         TEXT NOT NULL
);
INSERT INTO source_item_new SELECT * FROM source_item;
DROP TABLE source_item;
ALTER TABLE source_item_new RENAME TO source_item;
```

### 3.2 Telegram provenance — one row per Daily Photo `source_item`

```sql
-- Identity needed for LID-TG-004's idempotent acknowledgement and LID-TG-005's media-group dating.
-- Not columns on source_item, because nothing else in the schema needs to know a photo came
-- from Telegram specifically — this table is the only thing that does.
CREATE TABLE telegram_origin (
  source_item_id  TEXT PRIMARY KEY REFERENCES source_item(id),
  update_id       INTEGER NOT NULL,
  message_id      INTEGER NOT NULL,
  chat_id         INTEGER NOT NULL,
  media_group_id  TEXT,                     -- NULL for a photo sent outside an album
  UNIQUE (chat_id, message_id)              -- the idempotency key for LID-TG-004
);
```

### 3.3 VoiceNotes provenance — one row per Voice Journal `source_item`

```sql
-- upstream_note_id is the opaque MCP identity from the spike (LID-VN-001). It is the one field
-- retained by source_suppression (§3.6) after a permanent local deletion, per LID-VN-007.
CREATE TABLE voicenotes_origin (
  source_item_id      TEXT PRIMARY KEY REFERENCES source_item(id),
  upstream_note_id    TEXT NOT NULL UNIQUE,
  upstream_created_at TEXT NOT NULL,        -- as retrieved through MCP, never webhook receipt time (LID-VN-004)
  upstream_tag        TEXT NOT NULL DEFAULT 'life-in-days',
  last_reconciled_at  TEXT
);
```

### 3.4 Derived text fields — current value plus full attempt history

The PRD's per-field protection (`LID-AIT-005`) needs a "what's showing now" row and a "every attempt, including failures" history, kept apart so a failed attempt never overwrites what's displayed:

```sql
-- One row per (journal_date, field): the value actually displayed, and its protection state.
-- Visual Brief is deliberately not here — see §3.5, it has no "protected" state, only current/stale.
CREATE TABLE derived_field (
  journal_date        TEXT NOT NULL REFERENCES journal_day(journal_date),
  field               TEXT NOT NULL CHECK (field IN ('title','summary','tags')),
  value               TEXT,                  -- NULL until first successful generation; tags = JSON array
  status              TEXT NOT NULL DEFAULT 'absent'
                      CHECK (status IN ('absent','generating','current','protected','stale')),
  current_version_id  TEXT,                  -- REFERENCES derived_field_version(id); the attempt that produced `value`
  protected_at        TEXT,                  -- non-NULL iff status = 'protected'
  updated_at          TEXT NOT NULL,
  PRIMARY KEY (journal_date, field)
);

-- Every generation attempt for a field, successful or not — the provenance LID-AIT-007 requires.
CREATE TABLE derived_field_version (
  id                   TEXT PRIMARY KEY,
  journal_date         TEXT NOT NULL,
  field                TEXT NOT NULL,
  value                TEXT,                  -- NULL on refusal/failure/schema_invalid
  source_revision_ids  TEXT NOT NULL,         -- JSON array, the exact ordered set this attempt read (LID-SRC-004)
  provider             TEXT NOT NULL,
  requested_model_id   TEXT NOT NULL,
  returned_model_id    TEXT,                  -- what the provider actually reported back
  request_id           TEXT,
  outcome              TEXT NOT NULL CHECK (outcome IN ('succeeded','refused','failed','schema_invalid')),
  cost_usd             REAL,
  latency_ms           INTEGER,
  created_at           TEXT NOT NULL
);
```

`Resume automatic updates` (LID-AIT-005) is `UPDATE derived_field SET status = 'current' WHERE journal_date = ? AND field = ?` — it only ever touches the one field named, never its siblings.

### 3.5 Visual Brief — the sole personal-content input to the Artwork Provider

```sql
-- No "protected" state: the Visual Brief is never manually edited (LID-AIA-002 forbids free-form
-- editing in MVP). Only current/superseded exist. `is_current` lets an artwork_version (§3.6) always
-- resolve "the brief in force right now" without a self-join on max(created_at).
CREATE TABLE visual_brief (
  id                   TEXT PRIMARY KEY,
  journal_date         TEXT NOT NULL REFERENCES journal_day(journal_date),
  value                TEXT NOT NULL,          -- 150–300 tokens
  source_revision_ids  TEXT NOT NULL,          -- JSON array
  provider             TEXT NOT NULL,
  requested_model_id   TEXT NOT NULL,
  returned_model_id    TEXT,
  request_id           TEXT,
  is_current           INTEGER NOT NULL DEFAULT 1,
  created_at           TEXT NOT NULL
);
```

### 3.6 Generated Artwork — its own byte store, deliberately not `media_asset`

`media_asset` (existing plan §5.1) is Daily Photo bytes — authentic, captured content. Artwork bytes are derived, not captured. Reusing `media_asset` for both is exactly the "collapse source and AI output into one row" the PRD forbids (Technical Considerations, `reference/PRODUCT-REQUIREMENTS.md`); keeping them apart is also what makes §2.4's `data/media/artwork/` directory split enforceable in code, not just in a comment.

```sql
-- Parallel to media_asset, for Generated Artwork bytes only.
CREATE TABLE artwork_asset (
  id             TEXT PRIMARY KEY,
  backend        TEXT NOT NULL DEFAULT 'local_fs',
  original_key   TEXT NOT NULL,
  derivative_key TEXT,
  sha256         TEXT NOT NULL UNIQUE,
  mime           TEXT NOT NULL,
  bytes          INTEGER NOT NULL,
  width          INTEGER,
  height         INTEGER,
  created_at     TEXT NOT NULL
);

-- One row per generation attempt. Exactly one succeeded row per journal_date may have is_active = 1.
CREATE TABLE artwork_version (
  id                 TEXT PRIMARY KEY,
  journal_date       TEXT NOT NULL REFERENCES journal_day(journal_date),
  visual_brief_id    TEXT NOT NULL REFERENCES visual_brief(id),
  artwork_asset_id   TEXT REFERENCES artwork_asset(id),   -- NULL unless outcome = 'succeeded'
  provider           TEXT NOT NULL,
  requested_model_id TEXT NOT NULL,
  returned_model_id  TEXT,
  request_id         TEXT,
  trigger            TEXT NOT NULL CHECK (trigger IN ('manual','sweep')),
  outcome            TEXT NOT NULL CHECK (outcome IN ('succeeded','refused','failed')),
  refusal_category   TEXT,               -- coarse only — never the raw journal or prompt (LID-AIA-006)
  is_active          INTEGER NOT NULL DEFAULT 0,
  is_stale           INTEGER NOT NULL DEFAULT 0,
  cost_usd           REAL,
  created_at         TEXT NOT NULL
);
```

`journal_day.cover_media_id` (existing plan §5.1) already encodes "a real photo is the cover." Add one nullable column for the artwork case, with the precedence rule (`LID-AIA-008`) enforced by the cover-selection transaction (extends #210's redate transaction), never by a CHECK constraint that can't see sibling rows:

```sql
ALTER TABLE journal_day ADD COLUMN cover_artwork_id TEXT REFERENCES artwork_asset(id) ON DELETE SET NULL;
-- Invariant, enforced in src/domain/redate.ts and the cover-selection path, not the schema:
-- cover_artwork_id is only ever read when cover_media_id IS NULL.
```

### 3.7 Suppressions — two, deliberately not the same table

`Source Suppression` and `Artwork Suppression` block different automation (VoiceNotes reconciliation vs. the Artwork Sweep) and have different retention rules (Source Suppression outlives permanent deletion; Artwork Suppression is keyed to a Journal Day that still exists). Conflating them was tempting and wrong.

```sql
-- LID-VN-007. upstream_identifier is the one thing retained after a Voice Journal is permanently deleted.
CREATE TABLE source_suppression (
  id                   TEXT PRIMARY KEY,
  upstream_identifier  TEXT NOT NULL UNIQUE,
  created_at           TEXT NOT NULL,
  removed_at           TEXT              -- non-NULL after explicit "Allow re-import"
);

-- LID-AIA-009. Blocks only the 01:00 sweep; a manual Artwork Request is unaffected.
CREATE TABLE artwork_suppression (
  journal_date  TEXT PRIMARY KEY REFERENCES journal_day(journal_date),
  created_at    TEXT NOT NULL,
  removed_at    TEXT              -- non-NULL after explicit "Allow generation"
);
```

### 3.8 Source/Correction conflicts (M12)

Corrections themselves need no new table — a Correction is already a `source_revision` row with `origin = 'correction'` (existing plan §5.1). Only the *conflict* — a Correction and a newer upstream revision both pending — needs a marker, and only while unresolved:

```sql
-- Present only between LID-SRC-002 detecting a conflict and one of its three actions resolving it.
-- Resolution deletes this row; it never accumulates history of its own.
CREATE TABLE source_conflict (
  source_item_id          TEXT PRIMARY KEY REFERENCES source_item(id),
  correction_revision_id  TEXT NOT NULL REFERENCES source_revision(id),
  upstream_revision_id    TEXT NOT NULL REFERENCES source_revision(id),
  detected_at             TEXT NOT NULL
);
```

### 3.9 The `job` table — a sketch, not a decision

Referenced from §2.1. This table is created only if the scheduler ADR (first ticket of M10) chooses the job-table or hybrid option. It exists here solely so that ADR can price the option concretely instead of estimating it from memory.

```sql
-- SKETCH — not authorised by this document. See §2.1.
CREATE TABLE job (
  id            TEXT PRIMARY KEY,
  kind          TEXT NOT NULL,      -- 'ai_text_refresh' | 'artwork_sweep' | 'voicenotes_reconcile' | 'backup_snapshot' | ...
  payload       TEXT NOT NULL,      -- small JSON
  status        TEXT NOT NULL CHECK (status IN ('pending','leased','done','failed')),
  leased_until  TEXT,
  attempts      INTEGER NOT NULL DEFAULT 0,
  run_after     TEXT NOT NULL,
  created_at    TEXT NOT NULL
);
```

### 3.10 Provider configuration (M10, M11)

```sql
-- Typed, versioned. No free-form model strings from the settings UI (LID-AIA-011).
CREATE TABLE provider_config (
  id                        TEXT PRIMARY KEY,
  role                      TEXT NOT NULL CHECK (role IN ('text','artwork')),
  provider                  TEXT NOT NULL,          -- 'openai' | 'google' | ...
  display_label             TEXT NOT NULL,
  model_id                  TEXT NOT NULL,           -- exact model/snapshot, never a moving alias
  endpoint                  TEXT NOT NULL,
  api_version               TEXT,
  region                    TEXT,
  size                      TEXT,                    -- artwork only
  quality                   TEXT,                    -- artwork only
  format                    TEXT,                    -- artwork only
  safety_setting            TEXT,
  unit_cost_usd             REAL NOT NULL,
  lifecycle_review_date     TEXT NOT NULL,
  enabled                   INTEGER NOT NULL DEFAULT 0,
  automatic_sweep_eligible  INTEGER NOT NULL DEFAULT 0,   -- any premium/manual-only model: must stay 0
  created_at                TEXT NOT NULL
);

-- Which configuration each role currently points at. Changing this affects future generations only.
CREATE TABLE provider_selection (
  role                TEXT PRIMARY KEY CHECK (role IN ('text','artwork')),
  provider_config_id  TEXT NOT NULL REFERENCES provider_config(id),
  updated_at          TEXT NOT NULL
);
```

### 3.11 AI spend ledger (M10, M11, M17)

```sql
-- One row per metered attempt, whether it succeeded or not. billing_month uses the same
-- Asia/Kolkata accounting rule as everywhere else in this schema — no separate UTC ledger.
CREATE TABLE ai_usage_ledger (
  id                  TEXT PRIMARY KEY,
  role                TEXT NOT NULL CHECK (role IN ('text','artwork')),
  journal_date        TEXT,                 -- NULL for evaluation-phase spend (LID-AIT-001/LID-AIA-001)
  provider_config_id  TEXT REFERENCES provider_config(id),
  cost_usd            REAL NOT NULL,
  billing_month       TEXT NOT NULL,        -- 'YYYY-MM'
  created_at          TEXT NOT NULL
);
```

### 3.12 System Health (M17)

```sql
-- System Health reads the latest row per domain. detail_code is opaque and allowlisted —
-- never a message string, per LID-OPS-016's "allowlist-first" requirement.
CREATE TABLE health_event (
  id           TEXT PRIMARY KEY,
  domain       TEXT NOT NULL CHECK (domain IN (
                 'telegram_capture','voicenotes_reconciliation',
                 'backup_snapshot','backup_restore_sample',
                 'r2_migration','ai_text','ai_artwork'
               )),
  state        TEXT NOT NULL CHECK (state IN ('unknown','never_run','success','delayed','failed','blocked')),
  detail_code  TEXT,
  occurred_at  TEXT NOT NULL
);
```

### 3.13 Storage migration inventory (M14)

```sql
-- One row per media_asset once R2 migration begins. LID-OPS-007 requires this reconciliation
-- to be provably complete before any root copy is evicted — root_evictable is the one flag
-- that authorises eviction, and nothing sets it before r2_verified_at is non-NULL.
CREATE TABLE storage_migration_state (
  media_asset_id    TEXT PRIMARY KEY REFERENCES media_asset(id),
  root_verified_at  TEXT NOT NULL,
  r2_key            TEXT,             -- random opaque key — no dates, filenames, or hashes (LID-OPS-007)
  r2_written_at     TEXT,
  r2_verified_at    TEXT,             -- hash-confirmed durable
  root_evictable    INTEGER NOT NULL DEFAULT 0
);
```

### 3.14 Export requests (M16)

```sql
-- Ephemeral by design: the row and the ZIP disappear together (LID-OPS-013).
CREATE TABLE export_request (
  id             TEXT PRIMARY KEY,
  status         TEXT NOT NULL CHECK (status IN ('preparing','ready','downloaded','expired')),
  artifact_key   TEXT,
  requested_at   TEXT NOT NULL,
  expires_at     TEXT NOT NULL,       -- requested_at + 1 hour
  downloaded_at  TEXT
);
```

### 3.15 Search index (M7)

```sql
-- Illustrative, not final DDL — the exact contentless-vs-external-content FTS5 shape is
-- M7's own ticket to decide and prove (existing plan §2's "must be proven present, not assumed").
-- The four source columns stay authoritative; this is a derived, rebuildable cache.
CREATE VIRTUAL TABLE search_index USING fts5(
  journal_date UNINDEXED,
  field,        -- 'journal_text' | 'title' | 'summary' | 'tags' | 'photo_caption'
  content,
  tokenize = 'porter unicode61'
);
```

Index maintenance is transactional with every Correction, redate, Trash/restore, and field-protection change (Technical Considerations, `reference/PRODUCT-REQUIREMENTS.md`, "Search" — index updates must be transactional or recoverably queued). Photo Captions are indexed here and nowhere near an AI request payload — the one field that is searchable but never sent to a provider (`LID-TG-009`).

---

## 4. The privacy architecture

One rule shapes M10 and M11 more than any other in this document, and it comes from `reference/PRINCIPLES.md` directly: **real photos and photo-derived data must never be sent to AI providers.** Everything below is that rule made specific enough to test.

### 4.1 What is capable of crossing the boundary — enumerated, not implied

Exactly two payload shapes ever leave this server for an AI provider, and each has exactly one producer:

| Payload | Produced by | Consumed by | Contains |
| --- | --- | --- | --- |
| Text-generation request | `src/providers/text/*.ts` | Text Provider | Ordered, normalized journal text (all live Source Items for one Journal Day, concatenated with source boundaries) plus a minimal date/language hint and the requested `modelId` |
| Artwork-generation request | `src/providers/artwork/*.ts` | Artwork Provider | The current Visual Brief (150–300 tokens, §3.5) and the requested `modelId` — nothing else |

The existing plan's `TextProviderRequest`/`ArtworkProviderRequest` interfaces (§2.2 above) are the enforcement mechanism: there is no field on either type a photo, a caption, an identifier, or a filename could occupy. A reviewer checking this boundary reads two `.ts` files, not a policy document.

### 4.2 What never crosses it — the enumerated list `LID-AIT-006` requires

Never serialized into any AI request, by any code path, under any milestone:

- Real photo bytes, thumbnails, derivatives, or EXIF/IPTC/XMP metadata (`LID-TG-010`)
- Photo Captions — searchable in M7, never an AI input (`LID-TG-009`)
- The owner-authored private accessibility description on a Media Asset (`LID-REF-006`, existing plan §5.1's `private_image_description` column — present since M1, unused by anything until this sentence)
- Telegram or VoiceNotes account/chat/message/note identifiers, or any opaque ID from `telegram_origin` / `voicenotes_origin` (§3.2, §3.3)
- Names, filenames, or source titles added by the application
- Internal database IDs, request IDs from a *different* provider call, or anything from `ai_usage_ledger` (§3.11)
- Credentials, tokens, API keys, or any value from the runtime secret path (`LID-OPS-003`)
- A real Daily Photo, ever, as artwork-generation input — the Visual Brief is text-only and is itself derived only from journal text, never from a photo

A contract test asserting this list — one test per forbidden field, serializing a worst-case fixture and asserting the field's absence from the outgoing JSON — is the M10/M11 acceptance criterion this section exists to make checkable, not just statable.

### 4.3 Two boundary properties that are structural, not procedural

- **Stateless, allowlisted requests.** Every request is complete in itself: no conversation, no files, no tools, no grounding, no provider-side session, no persistent request ID reused across calls. Journal text is treated as untrusted quoted data with a frozen instruction hierarchy — this is also the prompt-injection mitigation (existing plan's risk register style continues in §7 below), not a separate feature.
- **No silent fallback, ever, in either direction.** Not between providers, not between models, not from Artwork Provider back to Text Provider if artwork fails, not from a failed evaluation candidate to an unevaluated one. A failure is a visible state (§3.4's `outcome`, §3.6's `outcome`), never a redirected request.

### 4.4 Where the boundary is enforced, and where it is merely described

The boundary lives in three places, in this order of trust:

1. **The type signatures** (§2.2) — cannot represent a forbidden field. This is the strongest guarantee; it fails at compile time, not at request time.
2. **The allowlisted serializer** — a single function per role that builds the outgoing payload field-by-field from an explicit allowlist, never by taking an object and stripping a denylist. An allowlist that omits a field is silent; a denylist that misses a field is a leak.
3. **The contract test** (§4.2) — catches the case where someone widens the type or the serializer later without re-reading this section.

Ticket-writing note for M10/M11 (also stated in the controlling brief §8.4): every ticket that touches an AI provider states this boundary in its `## Scope`, not only its `## Technical notes` — what is sent, and cites this section's enumerated "never" list rather than restating it.

---

## 5. Milestones M7–M19

Named and sequenced per the controlling brief §10, which the owner has already seen the outline of. Each paragraph states the user-visible outcome first, then requirement IDs, dependencies, and what the milestone deliberately does not do — the same four things every ticket inside it must trace back to.

### M7 — Find any day, and browse the archive like a book

**Outcome:** typing a phrase or a tag into Search returns the days that contain it, with a snippet showing why each matched; the Almanac reads the archive as one continuous scroll of days instead of a grid the owner has to page through month by month. **Requirement IDs:** `LID-REF-002`, `LID-REF-003`, `LID-TG-009` (Photo Captions become searchable here). **Depends on:** nothing outside M1–M6 — the four existing tables and #185's migration runner already hold everything M7 reads; §3.15's FTS5 index is the only new schema. **Deliberately does not:** build semantic or conversational search (`LID-DEF-003` stays out), or a competing Timeline tab — the Almanac *is* the timeline, per `UX-REF-002`.

### M8 — Photos arrive from the phone over Telegram

**Outcome:** the owner sends a photo in his private Telegram chat and it is on the right Journal Day moments later, with a reply naming the date and a link to change it — no filesystem, no laptop, and the M3 ingest command keeps working exactly as before for anything he still wants to drop in by hand. **Requirement IDs:** `LID-TG-001` through `LID-TG-010`, `LID-OPS-002`. **Depends on:** `media_asset` and the local storage backend (#196, #199, M3); `telegram_origin` (§3.2) is new. **Deliberately does not:** replace or deprecate the M3 ingest command, validate against any sender/chat other than the one exact configured pair, or fall back to receipt-date guessing for an invalid or future caption date — that goes to Needs Date Review, same as M4's existing queue.

### M9 — Journals arrive by voice, without trusting an unproven integration

**Outcome:** the owner speaks into VoiceNotes, tags it `life-in-days`, and the transcript appears on the right Journal Day without him doing anything else — but only after a synthetic spike has actually proven the integration behaves the way this plan assumes, because guessing at an undocumented webhook contract is exactly how a real journal entry gets silently lost. **Requirement IDs:** `LID-VN-001` through `LID-VN-007`. **Depends on:** the spike (`LID-VN-001`) gates every other ticket in the milestone; `voicenotes_origin` and `source_suppression` (§3.3, §3.7) are new; the widened `source_item.kind` CHECK (§3.1) lands here. **Deliberately does not:** treat a webhook payload as authoritative (the MCP surface always is), backdate Integration Activation, or attempt fuzzy tag matching (`LID-DEF-006` stays out).

### M10 — Every day gets a title, a summary, and tags

**Outcome:** each Journal Day quietly grows a one-line title, a short factual summary, and a few tags the owner never typed — and the moment he edits one himself, that field stops being touched by automation until he explicitly asks for it back. **Requirement IDs:** `LID-AIT-001` through `LID-AIT-007`. **Depends on:** the evaluation gate (`LID-AIT-001`) and the scheduler ADR (§2.1) are the first two tickets, in that order, and every other M10 ticket depends on both; `derived_field`, `derived_field_version`, `visual_brief` (§3.4, §3.5), `provider_config`, `provider_selection` (§3.10), and `ai_usage_ledger` (§3.11) are new. **Deliberately does not:** send anything a real photo touched to any provider (§4 governs this milestone directly), retry past three attempts or past one schema-invalid retry, or let the $15 evaluation ceiling in `LID-AIT-001` run independently of M11's — the two share one budget.

### M11 — Days without a photo still have a face

**Outcome:** a day with words but no photo gets a piece of warm, painterly artwork instead of a blank calendar tile, generated from nothing more than a 150–300-token Visual Brief — and the instant a real photo exists for that day, the artwork steps aside as cover but stays visible in the gallery, clearly labeled. **Requirement IDs:** `LID-AIA-001` through `LID-AIA-011`. **Depends on:** M10's Visual Brief (§3.5) is the only personal-content input this milestone is allowed to read (§4.1); the evaluation gate (`LID-AIA-001`) shares M10's $15 ceiling and is this milestone's first ticket; `artwork_asset`, `artwork_version` (§3.6), and `artwork_suppression` (§3.7) are new. **Deliberately does not:** auto-retry a safety refusal, switch providers on failure, let artwork outrank a real photo for Calendar Cover under any state transition (`LID-AIA-008`), or regenerate automatically on a late text change — that's manual only.

### M12 — Upstream edits and your Corrections stop fighting

**Outcome:** correcting a journal never risks losing what VoiceNotes says upstream, and if the two disagree, the owner gets a clear side-by-side choice — keep the correction, take the newer upstream version, or write a new correction that accounts for both — never a silent merge. **Requirement IDs:** `LID-SRC-001` through `LID-SRC-004`. **Depends on:** `source_revision` and its `origin = 'correction'` rows (existing plan §5.1) need no new table for the Correction itself; `source_conflict` (§3.8) is new; the redate transaction (#210, extended here) recalculates cover, search visibility, and artwork staleness on both the old and new day atomically. **Deliberately does not:** offer a fourth resolution action, auto-merge personal journal text under any circumstance, or let a same-day staleness (new revision, same day) hide artwork the way a cross-day removal (redating away) does — those are two different states and the ticket set keeps them that way.

### M13 — The archive is unreadable without the key

**Outcome:** if the Hetzner disk were copied or the server compromised while offline, the database and every photo would be unreadable without a key the owner holds — and the app now validates his own login at the boundary instead of trusting Cloudflare Access alone, closing the gap #216 deliberately left open. **Requirement IDs:** `LID-OPS-001`, `LID-OPS-003`, `LID-OPS-004`, `LID-OPS-005`. **Depends on:** the encryption/key-design ADR is this milestone's first ticket and every other M13 ticket depends on it; nothing in M8–M11's schema additions (§3) assumes an encryption mechanism, so M13 can adopt whichever the ADR chooses without a schema rewrite. **Deliberately does not:** claim end-to-end or zero-knowledge encryption (the PRD is explicit this is application-controlled only), build a second username/password layer alongside Cloudflare Access, or let a single unreviewed premium provider decision leak into this milestone's scope — that boundary stays in M10/M11.

### M14 — Storage grows without ever surprising you

**Outcome:** the owner never gets a "disk full" surprise — the archive warns him well before it's tight, quietly starts copying media to Cloudflare R2 in the background, and never once deletes or shrinks an original photo to make room. **Requirement IDs:** the storage watermark and R2-migration rows of `LID-OPS-*` (§4.2 of the PRD's requirement table, "Privacy, security, storage, recovery, and operations"), principally the four-watermark sequence and `LID-OPS-007`/`LID-OPS-009`. **Depends on:** #196's storage interface (M3) already defines `put`/`getStream`/`head` — R2 is a second implementation behind it; `storage_migration_state` (§3.13) is new. **Deliberately does not:** cut over to R2 before a complete paginated inventory reconciliation, verified hashes, a fail-closed Restic path, and seven days of observed reads all pass — that checklist is an acceptance-criteria block, not prose, per the controlling brief §10; and it never deletes a Media Asset while any live or Trash Daily Photo still references it (extends #212's Trash window).

### M15 — Recovery you have actually rehearsed

**Outcome:** the owner could lose the Hetzner server entirely and get his archive back — not because an upload succeeded, but because a restore has actually been run, timed, and measured against a four-hour target, on a schedule, not just once at launch. **Requirement IDs:** the backup/recovery rows of `LID-OPS-*`, principally `LID-OPS-011` and `LID-OPS-012` (the Recovery Ceremony). **Depends on:** M13's encryption ADR (Restic snapshots need to know what they're snapshotting); the R2-to-Restic remote-source backup-mechanism ADR is this milestone's first ticket; supersedes #217/#218 in capability while keeping the local fast path they built. **Deliberately does not:** treat a completed upload as restore evidence — that sentence goes directly into the ticket, per the controlling brief §10, because it is the single most common way backup projects lie to themselves — and the Recovery Ceremony gate cannot be bypassed by a later decision short of an explicit new one.

### M16 — Take the whole archive with you

**Outcome:** the owner can request a full export of everything — journals, photos, artwork, revision history, all of it — as one AES-256-encrypted ZIP with a passphrase he sees exactly once, and the file removes itself from the server the moment he's downloaded it or an hour has passed, whichever comes first. **Requirement IDs:** `LID-OPS-013`. **Depends on:** M12's source-set binding (§3.8, existing `source_revision`) so an export can reconstruct provenance; `export_request` (§3.14) is new; a small export-lifecycle ADR (passphrase handoff, restart behaviour, partial-file cleanup) is this milestone's first ticket, per the PRD's own requirement that one exist before implementation. **Deliberately does not:** store the one-time passphrase anywhere, ever, or let an unencrypted export skip its explicit privacy warning.

### M17 — The archive tells you when it needs attention

**Outcome:** without the owner asking, System Health shows him — and only him — whether Telegram capture, VoiceNotes reconciliation, and backups are actually working, using six honest states (unknown, never verified, healthy, attention/delayed, failed, blocked) instead of a false green checkmark; a repeated failure reaches him on Telegram, but the app never nags him to write. **Requirement IDs:** `LID-OPS-014` through `LID-OPS-016`. **Depends on:** `health_event` (§3.12) reads from every domain built in M8–M15; nothing here is new machinery beyond that one table and the alert path — this is evidence, not a dashboard product. **Deliberately does not:** add third-party analytics or crash reporting (explicitly forbidden), send a journaling reminder or streak message of any kind, or redact log fields after the fact — the schema is allowlist-first, fields are permitted in, never stripped out later.

### M18 — Usable by keyboard, by screen reader, on a phone

**Outcome:** every surface built in M1–M17 — not just the original calendar and day view — works fully by keyboard, reads correctly to a screen reader, and holds up on the current two major versions of Chrome, Edge, Firefox, Safari, plus iOS Safari and Android Chrome. **Requirement IDs:** `LID-REF-006`, and the accessibility/responsive/state contracts implicit across `reference/UX-SPECIFICATION.md` §25, §26, and §30. **Depends on:** everything M7–M17 shipped — this is an audit-and-fix milestone, not new product surface, organised by surface (Search, Telegram review queue, Settings, System Health, ...) so each ticket stays completable rather than split by WCAG criterion. **Deliberately does not:** introduce a new UI surface of its own, or treat this as a one-time pass — any UI ticket landing after M18 still owes the same verification loop (`UI-DESIGN-INSTRUCTIONS.md` §9).

### M19 — Ready to trust with fourteen years of days

**Outcome:** the owner gets one session where everything built across M7–M18 is walked against the PRD's own acceptance summary and traceability matrix, the Recovery Ceremony gate is confirmed to have actually passed, and the six deferred boundaries (`LID-DEF-*`) are written down in one place so nobody drifts into building them by accident. **Requirement IDs:** none new — this milestone consumes the PRD's UX §34/§35 (traceability matrix, acceptance summary) and Provider/Privacy Risk Checklist and Legal sections. **Depends on:** every other M7–M18 ticket; M15's Recovery Ceremony gate specifically, since it is the one gate in the whole plan that cannot be bypassed. **Deliberately does not:** implement anything — this is a release-acceptance milestone, and its `LID-DEF-*` ticket (§6 below) is a record, not machinery.

---

## 6. What this plan still does not build

`LID-DEF-001` through `LID-DEF-006` were out of scope for M1–M6 and stay out of scope here too — the owner's expansion of Phase 1.5 (§0.1) widened the boundary to cover the full v1 product, but v1 was never defined as "everything in the PRD." Each is a deferral boundary, not a specification a future agent can quietly half-build from:

| ID | Deferred |
| --- | --- |
| `LID-DEF-001` | Historical or bulk VoiceNotes import |
| `LID-DEF-002` | Reflection surfaces — On This Day, weekly themes/reports |
| `LID-DEF-003` | Semantic or conversational search |
| `LID-DEF-004` | Year mosaic, media wall, maps, native app, offline |
| `LID-DEF-005` | PDF/Word/OCR ingestion, printing |
| `LID-DEF-006` | Additional VoiceNotes tags, fuzzy tag matching |

One ticket in M19, `type:product-definition`, records all six and — for each — what a future specification would have to cover before it becomes buildable (for `LID-DEF-001`: preview, exact selection, privacy, deduplication, spend, rollback). That is one ticket, not six, and it is a record, not machinery, consistent with `CLAUDE.md`'s no-meta-tooling rule.

Two things beyond `LID-DEF-*` that this plan also does not build, named so no ticket quietly reaches for them: a public product, multi-user access, or anything resembling sharing (`LID-SCP-001` still holds unchanged from M1–M6); and a mobile-native app of any kind, which `LID-DEF-004` already covers but is worth restating because M18's responsive/accessibility work could otherwise be mistaken for a step toward one. It is not — M18 makes the existing web surfaces usable on a phone's browser, nothing more.

---

## 7. Real risks

Ordered by how much damage they do, not how likely they are, matching the register of existing plan §8.

### 7.1 Two independent evaluations share one $15 ceiling, and nobody has decided the split

`LID-AIT-001` and `LID-AIA-001` are a shared, one-time, $15 combined evaluation budget — not $15 each. Whichever milestone's evaluation runs second inherits whatever the first one left, and if M10 runs first and spends $12 chasing statistical significance across six text models and three repeats, M11's artwork bake-off is left with $3 for a ten-prompt blind stage across four models plus a second uncurated round. This is not a hypothetical scheduling detail — it can make M11's evaluation gate fail for lack of budget rather than for any quality reason. **Mitigation:** each evaluation ticket must check remaining shared budget before spending, log spend against the same ledger row (`ai_usage_ledger`, §3.11, with `journal_date IS NULL`), and stop hard before $15 combined. The actual split (question 3, §8 below) is the owner's to set, not an implementing agent's to discover by running out first.

### 7.2 The scheduler decision is a single point of failure for four milestones at once

M10's quiet period and final refresh, M11's Artwork Sweep, M15's scheduled backups, and M17's health-check cadence all assume *some* durable, restart-safe scheduling mechanism exists — and none of them can honestly be written as tickets until the ADR (§2.1, first-but-one ticket of M10) picks `cron`, the `job` table (§3.9), or the hybrid. If the ADR under-scopes — picks bare `cron` and later discovers a provider call needs to survive a crash mid-retry with its spend already committed — the fix touches ticket bodies in four milestones, not one. **Mitigation:** the ADR ticket explicitly walks all four consumers before deciding, not just M10's own quiet period, and every dependent ticket in M11/M15/M17 states its scheduling dependency as a link to the ADR issue, not as an assumed mechanism, so a later correction is one ticket's worth of rework per consumer rather than a silent contradiction discovered in production.

### 7.3 Encryption lands in M13, after real Telegram photos and provider-derived text have already accumulated on an unencrypted disk

M8–M11 ship real captured content — Telegram photos, VoiceNotes transcripts, AI-generated titles and artwork — before M13's encryption ADR has even been written. This is a deliberate trade for visible progress per milestone (§0's `CLAUDE.md` constraint), and the controlling brief already names it as the owner's call, not an implementer's (open question 5, §8 below). The risk is that "M13 comes later" quietly becomes "M13 comes never" once M8–M12 are shipped and feel done. **Mitigation:** state the ordering trade explicitly in M13's own milestone description (done in §5 above) so a future reader can't mistake sequencing for a decision that encryption is optional; the Recovery Ceremony gate in M15 depends on M13 specifically so encryption can't be skipped without also blocking backup/restore sign-off.

### 7.4 The Visual Brief is the only thing allowed to reach the Artwork Provider, and it is itself the output of a different AI provider

`LID-AIA-002`'s "read-only Visual Brief, sole personal-content input" is a strong privacy guarantee against photos and raw journal text leaking to the Artwork Provider — but the brief is text the Text Provider wrote, derived from the owner's actual words, and if the Text Provider hallucinates a specific enough detail (a name, a place, a fact that reads as more personal than the summary it came from), that detail flows straight to the Artwork Provider with none of the Text-Provider-request boundary's own scrutiny re-applied. The two providers' privacy contracts are not composable by inspection; a fixture that looks safe against `LID-AIT-006` in isolation can still leak through `LID-AIA-002` in combination. **Mitigation:** M10's fidelity gate (`LID-AIT-001`, "zero accepted critical inventions") is the actual control here, not a second privacy filter on the brief — treat this as a reason the fidelity gate matters for privacy, not only for quality, and say so explicitly in the M10 evaluation ticket so a future reader doesn't think fidelity and privacy are unrelated concerns.

### 7.5 Telegram's format-sniffing requirement is easy to get wrong from the filename, and getting it wrong is a security gap, not a cosmetic one

`LID-TG-003` requires format determination "from decoded content, not filename alone" — precisely because a filename extension is attacker-controlled input from Telegram's own upload path, and trusting it is how a disguised SVG or a decompression-bomb TIFF gets past a check that looks correct at a glance. The natural-looking implementation (`if (filename.endsWith('.jpg'))`) passes every happy-path test and fails exactly the adversarial fixture the requirement exists for. **Mitigation:** the M8 ticket for image validation must include a fixture set of mismatched-extension files (a `.jpg`-named SVG, a renamed TIFF) as acceptance criteria, not just well-formed JPEGs — a green test suite built only from correctly-named fixtures would pass while still violating the requirement.

### 7.6 `cover_artwork_id`'s precedence rule lives in application code, not in the schema, and SQLite cannot check it

§3.6 adds `journal_day.cover_artwork_id` next to the existing `cover_media_id`, with the invariant "artwork is cover-eligible only when no live Daily Photo exists" enforced entirely by the redate/cover-selection transaction. SQLite's `CHECK` constraints cannot see sibling rows (whether any live `media_asset`-backed Daily Photo exists for the day), so nothing at the database layer prevents a future bug — a new code path added in M14 or M17 that writes `cover_artwork_id` without checking `LID-AIA-008` first — from quietly promoting artwork over a real photo. This is the same class of risk existing plan §5.2 already flagged for the original redate transaction, now with a second column that can violate the same invariant a different way. **Mitigation:** keep every write to either cover column inside the one redate/cover-selection function (extending #210, not duplicating it), and add a test that asserts the invariant after every M11 and M12 state transition, not only after the transaction function's own unit tests.

### 7.7 Widening `source_item.kind` rebuilds a table that other tables already hold foreign keys into

§3.1's migration recreates `source_item` to add `'voice_journal'` to a `CHECK` constraint SQLite cannot `ALTER` in place. `id` is a `TEXT PRIMARY KEY`, not a `rowid` alias, so a plain `INSERT ... SELECT` preserves every existing ID exactly — that part is safe. The real gotcha is SQLite's own documented hazard for this exact operation: dropping and recreating a table that other tables (`source_revision`, `media_asset`, and by M9 also `telegram_origin`) hold a `REFERENCES source_item(id)` foreign key into can violate referential integrity or silently leave stale foreign-key definitions if done with `PRAGMA foreign_keys = ON`, which is why SQLite's documentation prescribes a specific multi-step procedure (disable foreign keys for the transaction, rebuild, then run `PRAGMA foreign_key_check` before re-enabling) rather than a naive four-statement rebuild. Copying the shape from `sqlite.org`'s own migration guidance, not from this plan's illustrative sketch, is the point. **Mitigation:** the M9 migration ticket writes and passes a test that seeds fixture rows in every table with a foreign key into `source_item`, runs the migration inside the documented procedure, and runs `PRAGMA foreign_key_check` afterward asserting zero violations — before this migration is ever run against anything but a disposable test database.
