# Life in Days v6 — independent design and interaction QA

Date: 2026-08-14

Version: v6 `PVA-001 Private Search State`

Branch: `prototype/calendar-ui-v6-private-search`

Independent QA agent: `/root/v6_independent_qa`

Verdict: **PASS — may be frozen**

## Disposition

| Severity | Open findings |
| --- | ---: |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |

The first QA pass found one High accessibility defect: pressing Enter from the labelled Search input did not submit. The candidate was not version-incremented. The implementation added one shared, keyboard-safe submission path used by both Enter and form submission; the fresh QA agent reran the affected and full matrices and recorded a pass.

## Acceptance results

| Area | Result and evidence |
| --- | --- |
| Syntax and diff integrity | PASS — `npm run check:v6`, JavaScript syntax, and `git diff --check`. |
| Fresh Search | PASS — no suggestions, recent memories, results, or generated answer. |
| Button and Enter | PASS — both submit; the result heading receives focus. |
| No result | PASS — the term remains only in the input and is not echoed into error copy. |
| Clear | PASS — clears the live value and returns focus to the input. |
| URL/title privacy | PASS through submit, result opening, Back, Forward, legacy URL, and reload. Title remains `Life in Days`; no `q` survives. |
| History state | PASS — only known navigation fields are written; incoming legacy query state is replaced with a safe prototype state. |
| Persistent browser storage | PASS — Search is absent from local and session storage; only inherited theme/rail preferences use local storage. |
| Back/Forward | PASS — the term and results remain available from live memory while the same page instance remains open. |
| Reload | PASS — term and results clear intentionally. |
| Legacy `q` | PASS — ignored and stripped without populating Search. |
| Desktop 1280 px | PASS — no horizontal overflow and form/scope/results remain readable. |
| Compact 390 px | PASS — stacked form, readable scope, four-item compact navigation, and no overflow. |
| Narrow 320 px | PASS — controls and results fit without page-level overflow. |
| Accessibility semantics | PASS — visible label, Search landmark, polite status region, focusable result heading, skip link, and autocomplete/autocapitalization/spellcheck disabled. |
| Browser console | PASS — no warnings or errors. |
| Inherited Calendar | PASS — landing, selected Museum Margin, and full Journal Day. |
| Inherited Almanac | PASS — six synthetic chapters and collapsible index. |
| Inherited Settings | PASS — routes and truthful prototype disclosures remain present. |
| Boundary | PASS — fictional frontend evidence; no integration, security, logging, encryption, persistence, recovery, or deployment claim. |

## Current-run evidence

- [`docs/prototypes/v6/search-landing-desktop-v6.jpg`](docs/prototypes/v6/search-landing-desktop-v6.jpg) — 1280 × 720 initial viewport.
- [`docs/prototypes/v6/search-landing-desktop-full-v6.jpg`](docs/prototypes/v6/search-landing-desktop-full-v6.jpg) — complete initial-state explanation.
- [`docs/prototypes/v6/search-results-rain-desktop-v6.jpg`](docs/prototypes/v6/search-results-rain-desktop-v6.jpg) — literal `rain` results with no query in the visible address state.
- [`docs/prototypes/v6/search-landing-mobile-390-v6.jpg`](docs/prototypes/v6/search-landing-mobile-390-v6.jpg) — compact initial viewport.
- [`docs/prototypes/v6/search-landing-mobile-390-full-v6.jpg`](docs/prototypes/v6/search-landing-mobile-390-full-v6.jpg) — full compact state.

## Evidence boundary

This QA verifies the current static frontend candidate and local server behavior only. It does not verify deployed reverse-proxy/CDN access logs, telemetry allowlists, server-side Search, authentication, encryption, storage, Telegram, VoiceNotes, AI providers, backup, recovery, Hetzner, Cloudflare, or production privacy controls.
