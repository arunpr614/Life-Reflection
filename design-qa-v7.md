# Life in Days v7 — independent design and interaction QA

Date: 2026-08-14

Version: v7 `PVA-002 Calendar Contract Completion`

Branch: `prototype/calendar-ui-v7-calendar-contract`

Independent QA agent: `/root/v7_independent_qa`

Final candidate hashes:

- `index-v7.html`: `03cdafe8c3499ed496eb4cf6f353b1be8f64794b2e270c23775be8fc02e55841`
- `app-v7.js`: `90f2d2b847a7534708b0b43aa4c09c69d31077b2aa954548c54a5bc57917c2dc`
- `styles-v7.css`: `0fe7faec523f1cb80de69db21918b87f8485f907dfb108ec8a14a966d3fe6da3`

Verdict: **PASS — may be frozen**

## Disposition

| Severity | Open findings |
| --- | ---: |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |

The independent run was restarted after implementation changes and passed on the exact hashes above. A separate adversarial static review also reached a clean disposition before final QA. Candidate repairs remained within v7; no partially reviewed version was released.

## Acceptance results

| Area | Result and evidence |
| --- | --- |
| Syntax and diff integrity | PASS — `npm run check:v7`, JavaScript syntax, and `git diff --check`. |
| Month/year chooser | PASS — exactly 12 `Jan`–`Dec` buttons, viewed/current semantics, 44 × 44 px year controls, focus trap/return, draft-year cancellation, immediate commit, and safe four-digit edge states. |
| Month navigation | PASS — July empty month, September future browse, Today return, safe URL, generic title, and private-safe live announcements. |
| History and focus | PASS — Back restores month and roving focus; direct deep-link close canonicalizes safely; closing detail does not reopen it; full-day return and switched-selection focus return are coherent. |
| Calendar state language | PASS — Today dotted, selected solid, and keyboard focus dashed layers remain independent and outside image pixels. |
| C-01 image-only cells | PASS — real-photo/artwork cells contain only image plus date; no source, AI, attention, title, caption, count, tag, or watermark overlay. |
| Progressive disclosure | PASS — days 13, 11, 6, and 4 expose exact source/AI/attention/failure only in safe accessible names and the external Museum Margin. |
| Authentic-cover precedence | PASS — 13 August uses its selected Telegram photo even though generated artwork also exists. |
| Paper and empty states | PASS — 8 August retains the council-approved paper treatment; at compact width it becomes date plus a quiet paper rule; 3 August creates nothing; July uses a quiet empty-month note. |
| Media failure | PASS — 4 August uses a neutral no-image cell and external `Calendar Cover unavailable`, authentic-journal availability, and simulated retry disclosure. |
| Keyboard | PASS — one roving tab stop; Arrow, Home/End, Page Up/Down cross months; Enter/Space, Escape, chooser trap, drawer trap, and focus restoration work. |
| Responsive | PASS — 1280, 960, 700, 390, and 320 px; seven columns; 3 px compact gaps; 62/54.6/48 px compact cell heights; no horizontal page overflow. |
| Compact chooser | PASS — 3 × 4 grid, 52 px month buttons, 44 px year controls, no clipping or private previews. |
| Drawer stacking | PASS — 960 px scrim/drawer and compact full-width sheet; selection layer is above compact navigation and background is inert. |
| Theme and motion | PASS — light/dark states and reduced-motion equivalence. 200%/400% were observations only under the council's v35 conformance boundary. |
| Accessible naming | PASS — counts, cover type, attention, Today, and Selected are available without private titles, captions, summaries, tags, journal text, or image descriptions. |
| Frozen v6 Search | PASS — legacy `q` removed; term never enters URL/title; Back preserves live-memory term; reload clears it; no suggestion/recent-memory regression. |
| Browser console | PASS — no warnings or errors across final test tabs. |
| Evidence boundary | PASS — static fictional-data frontend evidence only; no backend, security, integration, accessibility-conformance, deployment, or production claim. |

## Current-run visual evidence

- [`docs/prototypes/v7/calendar-landing-light-1280-v7.png`](docs/prototypes/v7/calendar-landing-light-1280-v7.png) — light default Calendar with image-only cover cells and external Today perimeter.
- [`docs/prototypes/v7/calendar-selected-today-dark-1280-v7.png`](docs/prototypes/v7/calendar-selected-today-dark-1280-v7.png) — Today + selected authentic cover and external Museum Margin.
- [`docs/prototypes/v7/calendar-selected-artwork-dark-1280-v7.png`](docs/prototypes/v7/calendar-selected-artwork-dark-1280-v7.png) — artwork-only day with provenance outside image pixels.
- [`docs/prototypes/v7/month-chooser-dark-1280-v7.png`](docs/prototypes/v7/month-chooser-dark-1280-v7.png) — wide twelve-button chooser.
- [`docs/prototypes/v7/calendar-selected-drawer-dark-960-v7.png`](docs/prototypes/v7/calendar-selected-drawer-dark-960-v7.png) — responsive selected-day drawer.
- [`docs/prototypes/v7/calendar-landing-dark-390-v7.png`](docs/prototypes/v7/calendar-landing-dark-390-v7.png) — compact seven-column Calendar.
- [`docs/prototypes/v7/month-chooser-dark-320-v7.png`](docs/prototypes/v7/month-chooser-dark-320-v7.png) — 320 px chooser sheet.
- [`docs/prototypes/v7/calendar-empty-month-dark-320-v7.png`](docs/prototypes/v7/calendar-empty-month-dark-320-v7.png) — compact ordinary empty month.

## Evidence boundary

This QA verifies the current static frontend candidate and local server behavior only. It does not verify persistence, authentication, server logs, cache headers, Telegram, VoiceNotes, AI providers, encryption, backup, recovery, Hetzner, Cloudflare, deployment, formal WCAG conformance, or production privacy controls.
