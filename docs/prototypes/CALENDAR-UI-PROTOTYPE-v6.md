# Life in Days — private Search prototype v6

Date: 2026-08-14

Branch: `prototype/calendar-ui-v6-private-search`

Starting point: v5 commit `f74455f`

Status: independently QA-passed; frozen after the recorded v6 commit

## Stable feature in v6

v6 implements `PVA-001 Private Search State`, the first package in the prototype-completeness program created from the v5 PRD feature audit.

The v5 search term previously appeared in a `q` URL parameter. v6 keeps the term inside the current JavaScript instance, removes legacy `q` parameters, retains a generic page title, and replaces the initial recent-memory/suggestion experience with an explicit deterministic-scope explanation.

## Behavior represented

| State or action | v6 behavior |
| --- | --- |
| Fresh Search | Shows a visible form and `Search without guesswork`; no results, recent days, or suggestions. |
| Submit | Performs case-insensitive literal matching over current title, summary, tags, and displayed journal text. Focus moves to the result count. |
| No result | Explains that the product does not infer alternatives and offers Clear search. |
| Clear | Clears the live term and returns focus to the input. |
| Open a result | Opens the inherited full Journal Day without putting the term in the address or history state. |
| Browser Back/Forward | Preserves the live term while the page stays open. |
| Reload | Intentionally clears the term. |
| Incoming legacy `q` | Ignores and removes it immediately. |

## Deliberate limits

v6 fixes the privacy leak and initial-state framing; it is not the final lexical Search design. Photo Captions, date ranges, exact-tag filters, Include history, matched-field snippets, result grouping, index update/error states, and historical-result destinations depend on later History, Trash, and Suppressions surfaces and remain tracked for v21.

## Inherited behavior

The v5 Living Mosaic, selected-day Museum Margin, full Journal Day, Monthly Almanac, Settings, responsive navigation, theme controls, upload simulation, and disclosure boundaries are copied forward unchanged except for versioned selectors and storage keys.

## Files

- [`../../prototypes/calendar-ui/index-v6.html`](../../prototypes/calendar-ui/index-v6.html)
- [`../../prototypes/calendar-ui/app-v6.js`](../../prototypes/calendar-ui/app-v6.js)
- [`../../prototypes/calendar-ui/styles-v6.css`](../../prototypes/calendar-ui/styles-v6.css)
- [`../../prototypes/calendar-ui/README-v6.md`](../../prototypes/calendar-ui/README-v6.md)
- [`v6/COUNCIL-v6.md`](v6/COUNCIL-v6.md)
- [`../../design-qa-v6.md`](../../design-qa-v6.md)
- [`v6/`](v6/) — current-run evidence after QA

## Evidence boundary

This is a static frontend prototype with fictional fixtures and browser-memory mutations. It does not implement or verify server-side Search, proxy/CDN logging, analytics controls, Telegram, VoiceNotes, AI providers, authentication, persistence, storage, backup, recovery, Hetzner, Cloudflare, or deployment.
