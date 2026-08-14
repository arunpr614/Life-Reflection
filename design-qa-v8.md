# Life in Days prototype v8 — independent design QA

Date: 2026-08-14  
Package: `PVA-003 Cross-month Almanac`  
Requirement disposition: `LID-REF-002` prototype-represented; implementation unverified  
Independent QA agent: `/root/v8_independent_qa`  
Verdict: **Pass**

## Immutable artifact identity

The Pass applies only to these exact SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/index-v8.html` | `0f876cf44f7f68478fa64653770ecd46bba9cd853bc6fcc3f3057e123a4ae384` |
| `prototypes/calendar-ui/app-v8.js` | `bc478af42d55df256fab8b2e9f0773d00b049a7879a12535a2a7effe11815760` |
| `prototypes/calendar-ui/styles-v8.css` | `453577e1b9c93ff63e215886b50215b8ad53a795dff5830afe47920711f19bda` |
| `prototypes/calendar-ui/styles-v8-almanac.css` | `87ef6345aa6ef054d76354c5c27e901980f99478fc2802b62a8d51c8ae618007` |

Any byte change to these artifacts invalidates this disposition and requires fresh independent QA.

## Severity summary

| Critical | High | Medium | Low |
| ---: | ---: | ---: | ---: |
| 0 | 0 | 0 | 0 |

## Coverage completed

### Almanac truth and chronology

- Verified initial August 2026 order `13, 11, 8, 6, 4, 2` and H1/H2/H3/article hierarchy.
- Verified real-photo cover precedence, artwork-only, journal-only, and unavailable-media chapters.
- Verified source, artwork, status, and caption text remain outside image pixels.
- Verified browse chapters do not expose raw journal transcripts.
- Verified Trash-only and history-only sentinel fixtures do not render or affect counts.

### Deterministic range behavior

- Verified each `Load earlier days` action adds one month: empty July, populated June, then populated May.
- Verified loading, failure, Retry, success, end state, no duplicate month insertion, live-region copy, focus retention, and viewport compensation.
- Verified browser Back/Forward restores the exact loaded boundary, control focus, and reading context.
- Verified leaving Almanac during a pending load cancels stale completion without mutating another view or latent Almanac state.

### Jump, URL, and bounded work

- Verified the twelve-button month/year chooser, draft-only year changes, Cancel/Escape/focus trap, June commit, July empty state, September future-empty state, Today return, and `0001`/`9999` edges.
- Verified safe canonical parameters only: `view`, `month`, optional `through`, optional `date`, optional `screen`, optional `rail`, and Settings `section` where relevant.
- Verified ancient `through=0001-01` clamps to the May 2026 synthetic boundary rather than materializing a pathological range.
- Verified distant live dates normalize to one target month, distant non-live dates are removed, and distant empty browsing remains one bounded quiet month.
- Verified document title remains `Life in Days` and history state contains only opaque `entryId`.

### Reading-context preservation

- Verified wide index Hide/Show preserves selected and unselected chapter position, scroll, active index state, and toggle focus.
- Verified Almanac → Calendar → Almanac restores loaded range, selection, scroll, and logical focus.
- Verified manual theme and OS-driven theme changes preserve the same reading anchor; private Search draft, selection, and caret survive applicable rerenders.
- Verified the canonical full Journal Day route and adjacent-day navigation return to the exact invoking Almanac range, chapter position, selection, and `Read full Journal Day` control.
- Verified a direct full-day link without an in-memory Almanac origin offers and follows the safe Calendar return.

### Responsive, accessibility, and modal behavior

- Verified 1280, 960, 700, 390, and 320 px layouts, compact drawer behavior, 4:5 media, bottom-navigation clearance, and no horizontal page overflow.
- Verified all compact Almanac Read, Load, Retry, and archive-end controls are at least 44 px high at 390 and 320 px.
- Verified drawer/dialog focus traps, Escape/Close return, breakpoint-aware logical focus, visible focus, external provenance, and polite status behavior.
- Verified Upload, photo-view, sparse-artwork warning, artwork completion, and empty-archive flows preserve or deliberately move focus.
- Verified light and dark themes, reduced motion, 200% text zoom, and compact high-zoom observation. The available browser capped the latter at 300%; formal 400% and browser/accessibility closeout remain assigned to v35.

### Inherited regressions and static checks

- Verified v6 private Search strips legacy `q`, never writes the live term to URL/title/history/persistent storage, preserves it only in the active page, and clears it on reload.
- Verified frozen v7 Calendar artifacts remain byte-identical and core chooser, Calendar state, Museum Margin, clean image cells, focus, and responsive behavior remain available.
- `npm run check:v8` passed; `git diff --check` passed; runtime console had no warnings or errors in the tested routes.

## Findings repaired before the final Pass

The candidate remained v8 while findings were repaired and the complete gate restarted after every fingerprint change:

1. Reading focus/history state was moved from browser history payloads to an opaque `entryId` backed by an in-memory snapshot map.
2. Rail Hide/Show initially displaced the reading chapter; a stable in-memory chapter anchor now restores exact position.
3. Adjacent full-day navigation initially overwrote the browse origin; the settled Almanac anchor is now preserved separately from incidental click scrolling.
4. Theme rerenders initially displaced the reading chapter; manual and device-theme paths now use the same stable-anchor restoration.
5. Compact Read and archive-end buttons initially measured below the required 44 px minimum; the final Almanac cascade now guarantees 44 px for Read, Load, Retry, and end-state controls.

No finding remains open in this v8 package.

## Evidence boundary

This QA verifies fictional frontend interaction intent, deterministic in-browser state behavior, responsive rendering, and the exact static files above. It does not verify database ordering or visibility filters, server pagination, lifecycle enforcement, persistence, authentication, media delivery, integrations, deployment, production accessibility, or production readiness.

The only allowed closure statement is: **`LID-REF-002` is prototype-represented; implementation remains unverified.**
