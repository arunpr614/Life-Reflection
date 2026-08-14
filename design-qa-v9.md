# Life in Days prototype v9 — independent design QA

Date: 2026-08-14
Package: `PVA-004 First-use Readiness`
Requirement disposition: audit gap 3 first-use portion prototype-represented; v10 interruption states remain open
Independent QA agent: `/root/v9_independent_qa`
Upload QA agent: `/root/v9_upload_qa`
Verdict: **Pass**

## Immutable artifact identity

The Pass applies only to these exact SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `prototypes/calendar-ui/index-v9.html` | `96527f3e8e96e1bfdaa5a3e31cf6885a6b5505a108ca9c287e00d7b570719af9` |
| `prototypes/calendar-ui/app-v9.js` | `9677a6023baf45e67a8580e46cec48261c4747d62d391969e3cf4877ce3875ee` |
| `prototypes/calendar-ui/styles-v9.css` | `3f38acbe74ffdac691b5963a779b27d61f3f19e3f03775aabec626b74bb12869` |
| `prototypes/calendar-ui/styles-v9-almanac.css` | `7ca0b5ad77cef1e08681479cd1d79d9dd1dafb70e520d1e0ee04d15860b38b8b` |
| `prototypes/calendar-ui/styles-v9-readiness.css` | `e2c07c35b05307ff682ed0ecb21ceb4e33fcb8b5a45f2cd227b23d86584cd42e` |

Any byte change to these artifacts invalidates this disposition and requires fresh independent QA.

## Severity summary

| Critical | High | Medium | Low |
| ---: | ---: | ---: | ---: |
| 0 | 0 | 0 | 0 |

## Coverage completed

### First-use truth and independent readiness

- Verified reload opens the empty August 2026 Calendar with one H1, 31 quiet dates, Monday-first `Asia/Kolkata` context, and no fabricated memory, guilt language, or AI action.
- Verified the exact VoiceNotes tag/activation boundary, Telegram private-chat/compression boundary, optional/unavailable AI, Backup `Not configured`/`Never verified`, and Recovery Ceremony `Blocked` with exactly three `Not evidenced` prerequisites.
- Verified configured-unverified and AI-unavailable fixtures stay independent, visibly synthetic, and never imply a live server read, connection, provider, backup, restore, or launch readiness.
- Verified every readiness article exposes its domain, status, explanation, and action through a complete programmatic name.

### Capture and first Journal Day

- Verified a real `.txt` chooser reaches a concise review heading, preserves filename and complete text, assigns the chosen Journal Date, and labels the authentic source as `Uploaded journal`.
- Verified hidden populated fixtures do not participate in first-use duplicate detection.
- Verified confirmation moves to a concise `Adding journal` status and accurately says it is being added to the temporary prototype.
- Verified Escape and backdrop cannot visually cancel an atomic save; the first commit produces exactly one populated day and 30 empty dates without revealing the six populated regression fixtures.
- Verified a browser Back during saving invalidates the delayed callback, so no Journal Day appears later.
- Verified the full Journal Day retains the uploaded filename and complete source text, while reload returns to pristine first use.

### Navigation, privacy, and recovery disclosures

- Verified `Review readiness` focuses the Readiness H2 without URL churn.
- Verified VoiceNotes, Telegram, and AI actions use safe structural Settings routes, focus the exact destination, and Browser Back/Forward restores the exact invoking action.
- Verified Settings and source contain no hostname, account/service identifier, callback path, secret-shaped field, credential, recovery key, or masked identifier.
- Verified Backup and Recovery disclosures have no mutation control; focus enters the heading, Tab/Shift+Tab enter and wrap through actionable controls, and Escape/backdrop returns to the exact origin.
- Verified fixture state and Search terms remain absent from URL, title, history payload, persistent storage, and outbound requests; invalid/query-shaped state fails closed.

### Calendar, responsive, and inherited behavior

- Verified Previous/next/Today, the twelve-button month chooser, Arrow/Home/End/Page navigation, empty-date no-creation behavior, focus states, and seven Calendar columns.
- Verified light/dark and reduced-motion behavior at 1440, 1280, 960, 700, 390, and 320 px plus landscape and compact zoom-equivalent reflow observations.
- Verified no horizontal page overflow, no visible target below 24 px, preferred 44 px primary actions, and fixed-bottom-navigation clearance.
- Verified the compact prototype banner shows the complete `Simulated data · no persistence · no integrations connected` boundary at 390 and 320 px without clipping, and that the shared 66 px banner token keeps the header correctly offset.
- Verified the populated regression retains six August Journal Days, real-photo cover precedence, Calendar–Almanac navigation, bounded Almanac loading, canonical full-day return, hidden/Trash-only exclusion, and private Search behavior.
- Verified frozen v8 hashes remain identical, `npm run check:v9` and `git diff --check` pass, and the browser console has no warnings or errors on tested routes.

## Findings repaired before the final Pass

The candidate remained v9 while findings were repaired, and the independent gate restarted after every fingerprint change:

1. First upload initially revealed the six populated fixtures; first-use commit now begins from a genuinely empty in-memory archive.
2. Escape during the saving delay initially closed the dialog while the callback still committed; saving is now atomic and stale navigation cancels the callback.
3. Hidden fixture journals initially participated in duplicate detection; first-use duplicate checks now inspect only represented live content.
4. Readiness groups initially omitted state/copy/action from their programmatic names; all four parts are now named.
5. Inherited Settings exposed a callback hostname and human archive hostname; v9 now describes server-only boundaries without identifiers or paths.
6. Tab from a programmatically focused disclosure heading initially stalled; the focus trap now enters the first or last actionable control explicitly.
7. The compact prototype boundary initially ellipsized the no-persistence/no-integration disclosure; it now wraps completely and updates the shared layout token.
8. Upload progress initially used contradictory `durable`/`in memory` language and broad dialog focus; it now uses truthful temporary-prototype copy with concise review and saving focus targets.

No finding remains open in this v9 package.

## Current-run visual evidence

- [`01-first-use-desktop-light-v9.jpg`](docs/prototypes/v9/01-first-use-desktop-light-v9.jpg)
- [`02-first-use-desktop-dark-v9.jpg`](docs/prototypes/v9/02-first-use-desktop-dark-v9.jpg)
- [`03-configured-unverified-v9.jpg`](docs/prototypes/v9/03-configured-unverified-v9.jpg)
- [`04-ai-unavailable-v9.jpg`](docs/prototypes/v9/04-ai-unavailable-v9.jpg)
- [`05-backup-requirements-v9.jpg`](docs/prototypes/v9/05-backup-requirements-v9.jpg)
- [`06-recovery-ceremony-v9.jpg`](docs/prototypes/v9/06-recovery-ceremony-v9.jpg)
- [`07-first-use-960-v9.jpg`](docs/prototypes/v9/07-first-use-960-v9.jpg)
- [`08-first-use-390-v9.jpg`](docs/prototypes/v9/08-first-use-390-v9.jpg)
- [`09-first-use-320-v9.jpg`](docs/prototypes/v9/09-first-use-320-v9.jpg)
- [`10-readiness-320-v9.jpg`](docs/prototypes/v9/10-readiness-320-v9.jpg)
- [`11-populated-regression-v9.jpg`](docs/prototypes/v9/11-populated-regression-v9.jpg)

## Evidence boundary

This QA verifies fictional frontend interaction intent, deterministic browser-memory behavior, responsive rendering, and the exact static files above. It does not verify live VoiceNotes or Telegram behavior, persistence, AI providers, backup, restoration, recovery-key custody, encryption, authentication, deployment, formal screen-reader/contrast conformance, production accessibility, or production readiness. Text-only zoom was observed through equivalent compact reflow rather than a native user-agent text-only zoom session.

The only allowed closure statement is: **First-use readiness is prototype-represented with synthetic fixtures; integrations, recovery, implementation, and operations remain unverified.**
