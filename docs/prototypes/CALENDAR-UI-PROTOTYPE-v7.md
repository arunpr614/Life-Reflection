# Life in Days — Calendar contract prototype v7

Date: 2026-08-14

Branch: `prototype/calendar-ui-v7-calendar-contract`

Starting point: frozen v6 record `a1596ec` (implementation `2c0fbf2`)

Status: independently QA-passed and frozen at implementation/evidence commit `05975fc`

## Stable feature in v7

V7 implements `PVA-002 Calendar Contract Completion`, the second package in the v5 feature-audit remediation program. It resolves the written Calendar-versus-approved-design conflict through Product Council decision C-01: Calendar Cover cells stay image-only, while exact provenance and attention are exposed in safe accessible names and the selected-day Museum Margin.

## Behavior represented

| State or action | v7 behavior |
| --- | --- |
| Month heading | Opens a private-content-free month/year chooser with exactly 12 textual month buttons. |
| Year movement | Previous/Next year changes only the chooser draft year. |
| Month choice | Commits immediately, clears detail, writes a safe month URL, focuses Today in the current month or day 1 otherwise, and announces the month. |
| Today | Uses an external dotted cell perimeter plus `aria-current=date`; there is no image overlay. |
| Selected | Uses an external solid perimeter and `aria-selected=true`. |
| Keyboard focus | Uses an outer dashed focus ring independent of Today and selection, with one roving tab stop. |
| Cover days | Show only the image and date number in Calendar; real-photo precedence is preserved. |
| Journal-only | Keeps the quiet paper treatment with title/count above 480 px; at 480 px and below it keeps date plus an unmistakable paper rule while the complete safe accessible name and Museum Margin preserve the metadata. |
| Selected detail | Reveals cover source, date, counts, description, provenance, and exact attention outside the image. |
| Empty day | Creates nothing and explains that journal upload is the only web beginning action. |
| Empty month | Shows a complete calendar plus the quiet sentence `No journaled days in this month.` |
| Keyboard navigation | Arrow, Home/End, and Page Up/Down can cross month boundaries while preserving/clamping logical dates. |

## Council decision and deliberate limits

The v7 council chose the Product Manager's immediate-commit Jan–Dec chooser and the Designer's layered external state rings. C-01 intentionally supersedes older UX text that requested Calendar overlay labels. Source/AI/attention remain available after selection and programmatically, without covering memory imagery.

The product has no archive-year cap. This synthetic prototype safely represents four-digit years `0001`–`9999` and disables the corresponding edge control; that is a URL/fixture boundary, not a product retention or ingestion limit.

V7 closes only the Calendar-specific `LID-REF-001` gap. Formal accessibility conformance, complete first-use/loading/error/authorization families, lifecycle behavior, and production implementation remain assigned to later packages. `LID-REF-005` and `LID-SCP-004` are regression checks, not closure claims here.

## Inherited behavior

The frozen v6 private Search contract is carried forward: query terms are never serialized into the URL, history state, page title, or persistent browser storage; legacy `q` is stripped; reload clears terms; and fresh Search contains no personal suggestions or recent-memory results.

The v5/v6 Journal Day, Monthly Almanac, Settings, upload simulation, theme, gallery, and source/derived separation remain available with versioned selectors and storage keys.

## Files

- [`../../prototypes/calendar-ui/index-v7.html`](../../prototypes/calendar-ui/index-v7.html)
- [`../../prototypes/calendar-ui/app-v7.js`](../../prototypes/calendar-ui/app-v7.js)
- [`../../prototypes/calendar-ui/styles-v7.css`](../../prototypes/calendar-ui/styles-v7.css)
- [`../../prototypes/calendar-ui/README-v7.md`](../../prototypes/calendar-ui/README-v7.md)
- [`v7/COUNCIL-v7.md`](v7/COUNCIL-v7.md)
- [`../../design-qa-v7.md`](../../design-qa-v7.md) — independent current-run QA pass
- [`v7/`](v7/) — versioned current-run evidence

## Evidence boundary

This is a static frontend prototype with fictional fixtures and browser-memory mutations. It does not implement or verify server persistence, authentication, Cloudflare, Hetzner, storage, encryption, logging, Telegram, VoiceNotes, AI providers, backup, recovery, deployment, production privacy, or formal accessibility conformance.
