# Implementation plan — Phase 1.5

_Written 2026-08-20 against `main` at `53d2e5a`. Sources: `reference/PRODUCT-REQUIREMENTS.md`, `reference/UX-SPECIFICATION.md`, `reference/CONTEXT.md`, `reference/prototype-v10/`._

This is the only planning document for Phase 1.5. It says what gets built, in what order, with what technology, and where the work is actually likely to go wrong. It is not a contract, a governance artifact, or a substitute for the tickets — the tickets are on GitHub and the code is the deliverable.

---

## 1. What "done" means for v0.1

From `RESET-DECISION.md`, unchanged:

> Open the app locally, see a real month as a calendar grid, click a day, read an actual journal entry with an actual photo attached.

That is the whole target. Four things have to be true at once: a server runs, a month renders as a grid, a day opens, and the day shows the owner's real journal text next to the owner's real photo.

**Out of v0.1, by decision:** Telegram capture (`LID-TG-*`), VoiceNotes (`LID-VN-*`), all AI text derivation (`LID-AIT-*`), all Generated Artwork (`LID-AIA-*`), authentication, encryption at rest, R2 migration, Restic backups, the Recovery Ceremony, Docker, CI. Each is a later increment on something that already works, not a prerequisite.

The PRD describes the finished system, not v0.1. Roughly 80% of its requirement IDs are out of scope here. That asymmetry is the single biggest risk in this project and §8 treats it as one.

---

## 2. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Runtime | Node 22 LTS + TypeScript | One language, one process; `tsx` for dev, `tsc` for the built artifact |
| HTTP | Fastify | Small, typed, fast enough for one user; static + streaming without ceremony |
| Database | SQLite via `better-sqlite3` | One file, real transactions, no server, trivially backed up by copying |
| Views | Server-rendered HTML from tagged-template functions | No build step, no hydration, no client framework |
| CSS | Hand-written, one stylesheet, tokens from UX §28 | The prototype is a visual reference, not a dependency (see §8.7) |
| Images | `sharp`, added at M3 only | Metadata-stripped derivatives; EXIF GPS removal is a privacy property, not a nicety |
| Tests | `node:test` + `node:assert` | Zero dependencies; enough for the date and ingest logic that actually needs proving |

**No React, no Next.js, no ORM, no migration framework, no job queue, no Docker in v0.1.** The whole thing is one process serving HTML from one SQLite file.

The handover invited one brief challenge to this stack. I don't intend to make it. The reasons hold: the target is a single Hetzner host running one process, a build step is pure cost for a single-user server-rendered app, and an ORM would hide exactly the transaction boundaries (§5.2) that the domain makes load-bearing. The one genuine cost is that `better-sqlite3` is synchronous and native — see §8.4.

Migrations are numbered `.sql` files in `migrations/`, applied in order by a ~30-line runner that records applied names in a `schema_migration` table. That is a runner, not a framework, and it is the only piece of infrastructure code this plan authorises.

---

## 3. Where the data lives

```
data/                       # gitignored. Real journals and photos. Never committed.
  archive.sqlite            # the database
  media/
    originals/<sha256>      # exact received bytes, never modified
    derivatives/<sha256>    # metadata-stripped display copies
  inbox/photos/             # drop zone for M3 ingest (see §4)
fixtures/                   # fictional data, committed, used by the seed script
```

`data/` is already gitignored, as are `*.sqlite` and `*.db`. Fixtures are fictional — never the owner's journal text or photos, per `CLAUDE.md`.

Media is content-addressed by SHA-256. That gives duplicate detection for free (`LID-UP-*`, `UX-UPLOAD-05`) and means the originals directory is idempotent to re-ingest.

---

## 4. How real data gets in — the gap worth naming first

The MVP definition of done requires "an actual photo attached." Neither reference document provides a path to that in v0.1:

- UX §9.6 (Day actions): _"Send a photo through Telegram — instruction only; **the web product does not upload Daily Photos in MVP**."_
- Telegram capture (`LID-TG-*`) is explicitly out of v0.1.

So the specified photo path is closed and the only specified capture path is deferred. Something has to fill the gap, and no requirement describes it.

**Proposed: a filesystem ingest.** The owner drops photos into `data/inbox/photos/`. A command — `npm run ingest` — walks the directory and for each file:

1. reads bytes, computes SHA-256, skips if that hash is already a Media Asset;
2. derives the Journal Date from a leading `YYYY-MM-DD` in the filename if present, else from EXIF `DateTimeOriginal`, else from file mtime, each interpreted in `Asia/Kolkata`;
3. if no date can be derived, or the derived date is in the future, creates the Source Item with `journal_date = NULL` — which is **Needs Date Review** (`UX-DATE-01`), preserved but absent from the Calendar;
4. copies (never moves) the file to `data/media/originals/<sha256>`, writes the Media Asset row, generates the derivative;
5. leaves the inbox file exactly where it was.

This respects the requirements that matter — Original Timestamp is immutable, the date rule is fixed `Asia/Kolkata` (`UX-GEN-11`), future dates are excluded (`UX-GEN-13`), undatable items go to the holding queue rather than being guessed at (`UX-DATE-03`, `UX-DATE-04`) — while not contradicting `UX-DAY`'s ban on *web* photo upload. It is a local operator tool, not a product surface, and it disappears the day Telegram capture lands.

Journal text has a specified path and keeps it: manual upload of one UTF-8 `.txt`/`.md` per submission, ≤1 MiB (`UX-UPLOAD-02`). That is a real product surface and it is built at M4. Before M4, journals arrive through the same ingest command so that M3 can demonstrate the DoD.

**Decided (2026-08-20): approved as designed.** Daily Photo capture in v0.1 is the local filesystem ingest above — not Telegram, not web upload. It is the one place where the plan invents behaviour rather than implementing it, so before it is ever pointed at real photos, the date-inference fallback chain (filename → EXIF → mtime) and the SHA-256 dedup get tests of their own, ahead of and independent from the rest of M3.

---

## 5. Design

### 5.1 Schema (v0.1)

The PRD is emphatic on one point and it shapes everything: _"Do not collapse source text and AI output into one mutable entry row."_ Even with no AI in v0.1, the tables are separated now, because merging them later is a rewrite and separating them now is free.

```sql
-- A Journal Day is an aggregate keyed by Journal Date. Never created empty (UX-CAL-09).
CREATE TABLE journal_day (
  journal_date    TEXT PRIMARY KEY,          -- 'YYYY-MM-DD', Asia/Kolkata
  cover_media_id  TEXT REFERENCES media_asset(id) ON DELETE SET NULL,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);

-- Authentic captured content. Two kinds in v0.1.
CREATE TABLE source_item (
  id                 TEXT PRIMARY KEY,
  kind               TEXT NOT NULL CHECK (kind IN ('uploaded_journal','daily_photo')),
  journal_date       TEXT REFERENCES journal_day(journal_date),  -- NULL = Needs Date Review
  original_timestamp TEXT NOT NULL,          -- immutable, ISO-8601 with offset
  source_title       TEXT,                   -- filename, for an Uploaded Journal
  content_sha256     TEXT NOT NULL,
  trashed_at         TEXT,                   -- non-NULL = in Trash, 30-day window
  created_at         TEXT NOT NULL
);

-- Immutable text history. A Correction appends; it never updates in place.
CREATE TABLE source_revision (
  id             TEXT PRIMARY KEY,
  source_item_id TEXT NOT NULL REFERENCES source_item(id),
  revision_no    INTEGER NOT NULL,
  displayed_text TEXT NOT NULL,
  origin         TEXT NOT NULL CHECK (origin IN ('captured','correction')),
  created_at     TEXT NOT NULL,
  UNIQUE (source_item_id, revision_no)
);

-- Opaque media identity: backend + key, never a provider URL.
CREATE TABLE media_asset (
  id             TEXT PRIMARY KEY,
  source_item_id TEXT NOT NULL REFERENCES source_item(id),
  backend        TEXT NOT NULL DEFAULT 'local_fs',
  original_key   TEXT NOT NULL,
  derivative_key TEXT,
  sha256         TEXT NOT NULL UNIQUE,
  mime           TEXT NOT NULL,
  bytes          INTEGER NOT NULL,
  width          INTEGER,
  height         INTEGER,
  photo_caption  TEXT,
  private_image_description TEXT,            -- owner-authored; never sent to AI (UX-DAY-09)
  display_order  INTEGER NOT NULL,
  created_at     TEXT NOT NULL
);
```

Four tables. No `derived_artifact` table yet — it arrives with the first AI increment, and the PRD's field-level Protected Field / stale semantics (`UX-DAY-11`…`UX-DAY-15`) get designed then, against real generated output, rather than guessed at now.

`private_image_description` exists from day one even though nothing sends anything anywhere in v0.1. It is the column that makes "real photos never receive AI-generated descriptions" enforceable later, and adding it now costs one line.

### 5.2 The transaction that matters

Per the PRD: _"Moving an item must update old/new days, cover selection, search index, day visibility, stale state, and active artwork eligibility atomically."_

In v0.1 the reachable subset is: change `source_item.journal_date`; create the destination Journal Day if absent; delete the origin Journal Day if it has no remaining live Source Items; recompute `cover_media_id` on **both** days. One `better-sqlite3` transaction, one function, `src/domain/redate.ts`, with tests for every branch. This is the single piece of domain logic where a bug silently misfiles a memory, which is the failure the whole product exists to prevent.

### 5.3 Journal Date derivation

One module, `src/domain/journal-date.ts`, no dependency:

```ts
export function toJournalDate(instant: Date): string   // 'YYYY-MM-DD' in Asia/Kolkata
export function todayJournalDate(): string
export function isFutureJournalDate(d: string): boolean
```

Built on `Intl.DateTimeFormat` with `timeZone: 'Asia/Kolkata'`, which Node's bundled ICU handles correctly. One fact makes this much less dangerous than the PRD's risk table implies: **IST is UTC+05:30 year-round with no DST.** There is no ambiguous or nonexistent local time to reason about. What still needs tests is the midnight boundary (23:59 and 00:01 IST, and the same instants expressed in UTC and US-Pacific), and future-date exclusion.

Display is `en-IN` and months start Monday (`UX-GEN-12`).

### 5.4 Routes

| Route | Renders | Requirements |
| --- | --- | --- |
| `GET /` | 302 to the current `Asia/Kolkata` month | `UX-CAL-01`, `UX-GEN-14` |
| `GET /calendar?month=YYYY-MM` | Month grid | `UX-CAL-01`…`UX-CAL-11` |
| `GET /day/:journalDate` | Journal Day detail | `UX-DAY-01`…`UX-DAY-21` (v0.1 subset) |
| `GET /media/:id/derivative` | Display copy, `private, no-store` | `UX-DAY-10`, `LID-OPS-*` private read path |
| `GET /media/:id/original` | Exact original, explicit request only | `UX-DAY-10` |
| `GET /upload`, `POST /upload` | Manual journal upload + review step | `UX-UPLOAD-01`…`UX-UPLOAD-06` |
| `GET /review` | Needs Date Review queue | `UX-DATE-01`…`UX-DATE-06` |

No JSON API. The pages are the interface. A handful of forms and a few `<button>`s posting to routes cover every v0.1 mutation; there is no client-side state to synchronise.

### 5.5 Templates and escaping

Views are functions returning strings, composed with one tagged template that escapes every interpolation by default:

```ts
html`<h1>${journalDate}</h1>`          // escaped
html`<div>${raw(sanitizedFragment)}</div>`  // explicit, audited opt-out
```

Roughly 40 lines. This is the mechanism behind `UX-UPLOAD-04` — uploaded Markdown must never execute embedded HTML, load remote images, or run scripts. **v0.1 renders `.md` as source text, not as interpreted Markdown.** The spec permits either ("displayed safely as source text or sanitized presentation"), and choosing source text removes a Markdown parser and a sanitizer from the dependency list and removes the entire class of sanitizer-bypass bugs. Rendered Markdown is a later, separate increment.

### 5.6 CSS

One stylesheet built in two layers: a token layer transcribed from UX §28.1–28.4 (colours, type scale, 4px spacing steps, 12/10/8px radii, 120/180/240ms motion with a `prefers-reduced-motion` override), then component rules for the Calendar grid and Journal Day written against those tokens.

The Calendar stays a 7-column Monday-first grid down to 320px (`WF-02`) — that is `grid-template-columns: repeat(7, 1fr)` and it never becomes a list. Responsive bands per UX §25: compact 320–599, medium 600–1023, wide ≥1024.

On reusing the v10 prototype CSS: see §8.7. Short version — take the tokens, not the 8,000 lines.

---

## 6. Milestones

Six execution milestones. Each is a demoable increment; none is a process stage. Named `Phase 1.5 — M<n> — <short outcome>`.

**`Phase 1.5 — M1 — A real month renders in the browser`** (~7 tickets)
Repo scaffold, migration runner, the four tables, `journal-date.ts` with its boundary tests, the token layer, the Calendar grid, a fictional-data seed script.
_Demo:_ `npm run dev`, open `/calendar` — a real month as a 7-column Monday-first grid with day tiles, today marked, month navigation working.

**`Phase 1.5 — M2 — Click a day and read a journal`** (~5 tickets)
Journal Day detail in the reading order of UX §9.1, the `html` escaping helper, Source Item cards with Original Timestamp, adjacent-populated-day navigation, `en-IN` date formatting.
_Demo:_ click a tile, read the journal text; keyboard arrows move across the grid and Enter opens a day.

**`Phase 1.5 — M3 — Real photos on the calendar and the day`** (~8 tickets)
Media Asset storage with the local filesystem backend (`put`/`getStream`/`head` — the minimum subset of the PRD's storage contract), the ingest command from §4, `sharp` derivative generation with metadata stripped, the two `/media` routes with `private, no-store`, Calendar Cover selection (`UX-CAL-04` — a real Daily Photo always wins), the day gallery, keyboard-operable reordering (`UX-DAY-06`).
_Demo:_ **the v0.1 definition of done is met here.** A real month, real covers, a real day, a real journal, a real photo.

**`Phase 1.5 — M4 — Upload a journal from the browser`** (~5 tickets)
`GET/POST /upload`, the review step (filename, size, `Asia/Kolkata` note, safe text preview), duplicate detection by `content_sha256` with Cancel/Add anyway, the full `UX-UPLOAD` §10.3 error table, `/review` for the Needs Date Review queue.
_Demo:_ upload a `.txt` from the browser and watch it appear on the right day.

**`Phase 1.5 — M5 — Correct, redate, and trash without losing anything`** (~6 tickets)
Correction appending a Source Revision, Change Journal Date on a Source Item using the §5.2 transaction, Trash with the 30-day window and restore, day history view, `Make calendar cover`.
_Demo:_ correct a journal, move a photo to a different day, put something in Trash and restore it — and see that nothing was destroyed at any point.

**`Phase 1.5 — M6 — The archive runs on the Hetzner host`** (~5 tickets)
Build output, process supervision, Cloudflare Access in front of the origin, origin bound to loopback, a backup that copies the SQLite file and the originals directory, a documented restore.
_Demo:_ the archive is reachable from the owner's phone, and a restore has actually been performed once.

**~36 tickets.** Zero of them are process tickets. Every one should end with something visible in the browser or verifiable in a shell.

M6 comes last deliberately. The agreed sequence is local → GitHub → verify locally → production, and there is no value in deploying a calendar that doesn't render a photo yet.

---

## 7. What this plan deliberately does not build

Named so that no ticket quietly imports them: `LID-TG-*`, `LID-VN-*`, `LID-AIT-*`, `LID-AIA-*`, Source Quiet Period, Visual Brief, Artwork Sweep, Artwork Suppression, Text/Artwork Provider adapters, SQLCipher and encryption at rest, R2 migration and dual-write, Restic and the Backup evidence state machine, the Recovery Ceremony, encrypted export with one-time passphrase, System Health, the structured operational event schema, Search (`UX-SEARCH-*`), Monthly Almanac (`UX-TIME-*`), Integration Activation, and everything under `LID-DEF-*`.

Search and Monthly Almanac are the two most tempting, because they're browsing features and the tables already hold what they need. They are still v0.2. The DoD says calendar and day, and a month grid that renders a real photo is worth more than three half-built browsing surfaces.

**Rule for ticket writing:** a Phase 1.5 ticket may cite any requirement ID as context, but if satisfying it requires an AI provider, a cloud storage backend, a cryptographic envelope, or an authentication decision, it is not a Phase 1.5 ticket.

---

## 8. Real risks

Ordered by how much damage they do, not how likely they are.

### 8.1 The two reference documents disagree about the visual design — decided

This was not a minor mismatch. The v10 prototype and UX §28.1 specify different palettes:

| | Prototype v10 | UX §28.1 |
| --- | --- | --- |
| Canvas (light) | `#f4f0e7` | `#F7F1E8` |
| Accent | `--forest: #255949` (green) | `#70543D` (warm brown) |
| Focus ring | `#0a7762` (green) | `#175CD3` (blue) |

The accent hues are not adjacent — one archive reads green, the other reads brown. They also disagree structurally: the prototype defines `--rail-width: 238px` and ships a navigation rail, while `WF-01` says _"Do not add overlay badges or a persistent primary-navigation rail."_

Both artifacts are non-authoritative reference notes, so neither won by default; a side-by-side prototype (`prototype/palette-comparison`, two variants of the month grid, never merged) was built to compare them directly rather than in the abstract.

**Decided (2026-08-20): prototype v10 — green palette (`#255949` accent, `#0a7762` focus) with the persistent 238px navigation rail.** This overrides `WF-01`'s ban on a persistent primary-navigation rail; that wireframe rule is superseded for v0.1 by this decision, not silently ignored. M1's token layer and top-level layout are written against v10, not UX §28.1's palette section.

### 8.2 Photo ingestion is unspecified — decided

Covered in §4. The gap was real, the proposal was mine, and it is now approved as designed (2026-08-20): a local `npm run ingest` command, not Telegram, not web upload.

### 8.3 Scope gravity from the PRD

The PRD is a 380-line description of a system with encrypted per-object storage, provider adapters, budget ceilings, artwork sweeps, and a launch-gating Recovery Ceremony. Its own header still carries pre-reset governance language ("Product Council", "Authorization boundary", "dossier") that the reset discarded. Reading it while writing a ticket exerts constant pull toward building the finished system.

This is the exact failure that produced 137 commits and zero rendered journal entries. The mitigations are the §7 rule, ticket sizes of about a day, and the `CLAUDE.md` requirement that every session end with something visible. Nothing else — no validator, no checklist artifact, no registry. Adding governance machinery to prevent a governance-machinery failure is how this happened the first time.

### 8.4 `better-sqlite3` is synchronous and native

Every query blocks the event loop, and the package compiles a native binding that must match the deployment host's Node ABI. For one user reading their own archive this is genuinely fine and much simpler than the async alternative. It stops being fine the moment there are two concurrent users or a long-running media job in the same process. Accept it now, note it here, revisit when M3's derivative generation shows real latency — and expect one afternoon of pain when M6 first installs it on the Hetzner host.

### 8.5 Photo bytes are the only unrecoverable asset

The database can be rebuilt from the originals. The originals cannot be rebuilt from anything. Consequences for the code: ingest **copies**, never moves; `data/media/originals/` is written once per hash and never modified or deleted; Trash marks rows, it does not unlink files; the M6 backup covers `originals/` before it covers anything else. No `rm` anywhere in the ingest path.

### 8.6 Dates are less dangerous than the PRD suggests, but not safe

IST has no DST, which removes the whole class of ambiguous-local-time bugs. What remains: reading a `YYYY-MM-DD` from a filename and treating it as an instant, or letting a browser's local timezone leak into a Journal Date. Mitigation is structural — a single module derives Journal Dates and nothing else calls `Intl` or constructs dates from strings, enforced by keeping the conversion functions in one file with tests for the midnight boundary in three timezones.

### 8.7 The prototype CSS is a trap

`styles.css` is 6,277 lines and 122 KB; with the other three files it is over 8,000 lines. The class names are versioned to prototype generations (`.almanac-chapter-v9`, `.almanac-shell-v9`) and much of the volume implements prototype-only state theatre — simulated session expiry, fixture switchers, synthetic failure banners — plus (now that §8.1 has decided the rail stays) a fair amount that's directly reusable.

Importing it wholesale would still deliver a fast-looking M1 and then cost weeks — the state-theatre classes and version-pinned selectors don't belong in production regardless of which palette won. The plan is to extract the token definitions and the rail/calendar-tile/day-detail *structure*, and write them fresh rather than importing the file. Expect M1's CSS to look plainer than the prototype. That is the correct trade at this stage.

### 8.8 `sharp` may not be worth its cost at M3

It is a second native dependency, and the PRD wants untrusted images decoded in a constrained worker — a requirement that exists because Telegram will one day deliver bytes from the internet. In v0.1 the images are the owner's own photos, ingested from their own filesystem. If `sharp` installation on the Hetzner host proves painful, the honest fallback is to serve originals directly for v0.1 and add derivative generation with the Telegram increment. The reason to include it anyway is EXIF: photos carry GPS coordinates, and stripping them before the browser ever sees the bytes is a privacy property the owner actually wants.

---

## 9. Decisions needed before ticket-writing starts

1. ~~**Palette and structure** (§8.1) — UX §28.1 or prototype v10?~~ **Decided 2026-08-20: prototype v10** (green, 238px rail).
2. ~~**Photo ingest** (§4, §8.2) — is a local `npm run ingest` command an acceptable v0.1 path?~~ **Decided 2026-08-20: approved as designed.**
3. **Issues #174–181** (`mvp`, no milestone) — fold into the Phase 1.5 milestones, or close and replace? Blocks ticket creation.
4. **Hetzner access** — needed only at M6, but if credentials take time to arrange, that is worth knowing now.

Questions 3 and 4 remain; they are logistics, not design.

---

## 10. Vocabulary

`reference/CONTEXT.md` is the ubiquitous language and is used verbatim in tickets, identifiers, and UI copy: Journal Day, Journal Date, Original Timestamp, Needs Date Review, Source Item, Derived Artifact, Uploaded Journal, Daily Photo, Photo Caption, Media Asset, Source Revision, Correction, Protected Field, Calendar Cover, Trash.

Its `_Avoid_` alias lists are as binding as the definitions. "Entry", "post", and "memory" are not names for a Journal Day; a Correction is not an edit to VoiceNotes (`UX-DAY-20`); a Journal Day is an aggregate, not a document, which is why `Change date` lives on Source Items (`UX-DAY-02`).
