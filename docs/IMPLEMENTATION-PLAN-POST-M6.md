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
