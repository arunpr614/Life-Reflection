# Life in Days — Cross-month Almanac prototype v8

Date: 2026-08-14  
Branch: `prototype/calendar-ui-v8-cross-month-almanac`  
Baseline: frozen v7 implementation `05975fc`; freeze record `dda1b9c`  
Status: complete; independently passed and ready to freeze

## Stable feature

V8 implements `PVA-003 Cross-month Almanac`, representing `LID-REF-002` in the frontend prototype. Council decisions C-02 and C-03 preserve the name **Almanac**, the book-like direction, the Calendar/Almanac switcher, and the collapsible local index; no competing Timeline destination was created.

## Behavior represented

| Area | V8 behavior |
| --- | --- |
| Chronology | Live fictional Journal Days appear newest-to-oldest, grouped by fixed Asia/Kolkata Journal Date month. |
| Initial range | August 2026 only, six days ordered 13, 11, 8, 6, 4, 2. |
| Pagination | One deliberate calendar month per action: July adds zero, June adds two, May adds two and reaches the explicit prototype boundary. |
| Index | Wide collapsible index or compact sheet; loaded months and safe day links; no duplicate Calendar grid. |
| Jump | Immediate-commit twelve-button month/year chooser; target becomes the only loaded month, including truthful empty months. |
| Chapter | One shared Calendar Cover, external provenance, generated title/summary/tags, counts, and `Read full Journal Day`; no raw source transcript. |
| Full day | Exact inherited full-day renderer; Back restores Almanac range, scroll, and invoking control. |
| URL | `view=almanac`, newest `month`, optional oldest `through`, optional safe `date`, `screen=day`, and optional `rail=collapsed`. |
| Exclusion | Trash-only and history-only sentinels do not render, count, appear in accessibility output, or become anchors. |
| Responsive | Wide rail; at 960 px and below a Browse toolbar plus drawer; 390/320 one-column reading and external media labels. |

## Deliberate limits

The oldest May 2026 boundary and four-digit chooser range are synthetic representation constraints, not product retention rules. The component-local failure/Retry proves only the Almanac pagination interaction. Complete app loading, interruption, session, and server-error states remain v10. History, Trash, complete Search, and formal browser/accessibility closure remain assigned to later packages.

## Files

- [`../../prototypes/calendar-ui/index-v8.html`](../../prototypes/calendar-ui/index-v8.html)
- [`../../prototypes/calendar-ui/app-v8.js`](../../prototypes/calendar-ui/app-v8.js)
- [`../../prototypes/calendar-ui/styles-v8.css`](../../prototypes/calendar-ui/styles-v8.css)
- [`../../prototypes/calendar-ui/styles-v8-almanac.css`](../../prototypes/calendar-ui/styles-v8-almanac.css)
- [`../../prototypes/calendar-ui/README-v8.md`](../../prototypes/calendar-ui/README-v8.md)
- [`v8/COUNCIL-v8.md`](v8/COUNCIL-v8.md)
- [`../../design-qa-v8.md`](../../design-qa-v8.md) — independent QA Pass bound to exact artifact hashes
- [`v8/`](v8/) — current-run evidence

## Evidence boundary

This is a static frontend prototype with fictional fixtures and browser-memory mutations. It does not implement or verify server filtering/order, lifecycle, persistence, authentication, media delivery, integrations, deployment, formal accessibility, or production readiness. The independent QA result supports only: `LID-REF-002` prototype-represented; implementation unverified.
