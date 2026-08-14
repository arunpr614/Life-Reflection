# Life in Days — private Settings and compact privacy prototype v5

Date: 2026-08-13

Branch: `prototype/calendar-ui-v5-settings`

Starting point: v4 commit `5028801`
Status: implemented and locally reviewed as a throwaway, simulated prototype

## Decision represented by v5

v5 preserves the accepted Calendar, Museum Margin, Almanac, Search, Journal Day, and media-provenance patterns from v4. It resolves one density problem and adds one requested product surface:

1. the oversized `Authentic memories stay in their lane` disclosure is replaced by a small contextual link beside `Daily Photos`;
2. the complete disclosure and the PRD-approved configuration summary move into a dedicated Settings suite.

The result keeps the reflection experience dominant while making the privacy contract easy to inspect on demand.

## Settings information architecture

| Screen | Purpose | Editable in v5 |
| --- | --- | --- |
| Overview | Scan Journal rules, Connections, AI and privacy, and Appearance. | Navigation only |
| Journal rules | Explain product identity, `Asia/Kolkata`, `en-IN`, Monday-first, quiet period, and the 01:00 sweep. | No |
| Integrations | Explain exact VoiceNotes eligibility and private Telegram authorization without revealing secrets. | No |
| AI and privacy | Disclose the two AI lanes, forbidden photo data, provider readiness, credential state, and fixed budget. | Provider selects remain disabled |
| Appearance and site | Choose device, Light, or Dark theme and inspect host boundaries. | Theme only |

### Why management stays separate

System Health, storage use, backup and restore evidence, integration failures, export, Trash, Suppressions, and History are linked but not embedded as Settings forms. These are operational evidence or irreversible management flows, not personal preferences.

## Compact privacy treatment

The former disclosure occupied a full-width card of roughly 200 pixels. v5 uses one muted line:

> Real photos never go to AI · AI & privacy

`AI & privacy` is a real control. It opens `?view=settings&section=ai`; browser Back returns to the exact Journal Day. The source image, caption, gallery, and management actions keep their existing prominence.

## Source-grounded controls

### Journal rules

- product: `Life in Days`;
- human archive: `life.arunp.in`;
- timezone: `Asia/Kolkata`, fixed for MVP;
- locale/calendar: English India and Monday-first, fixed for MVP;
- generation quiet period: 15 minutes;
- final text refresh and missing-art sweep: 01:00 Asia/Kolkata;
- no reminders, streaks, prompts, coaching, sharing, or automatic historical import controls.

### VoiceNotes and Telegram

- exact VoiceNotes tag: `life-in-days`;
- Integration Activation cannot be backdated through Settings;
- older notes never become automatically eligible merely because they are edited or tagged later;
- Telegram accepts one allowlisted numeric user in one private chat;
- groups and every other sender are rejected;
- identifiers are masked and secrets/callback paths never appear in the browser.

### AI and privacy

- Text Provider receives approved journal text and minimal date/language hints;
- Artwork Provider receives only the read-only minimized Visual Brief;
- photos, thumbnails, metadata, identifiers, captions, and photo-derived descriptions never go to AI;
- Text and Artwork providers are independent;
- both dropdowns read `Model evaluation not completed` because the evaluation reports have not qualified a production model;
- credentials are server-provisioned and displayed only as `Available`, `Missing`, or `Needs attention` states;
- hosted providers may retain eligible requests for abuse monitoring; no zero-retention claim is made, and every approved option must show current retention terms, region, and a privacy link before selection;
- provider changes will apply only to future artifacts and have no silent fallback;
- the browser cannot bypass the fixed `$5.00` monthly ceiling, `$0.50` text reserve, `$4.50` artwork maximum, or 80% warning.

## Responsive and interaction model

- desktop: sticky section navigation plus a single restrained reading panel;
- tablet: horizontal section picker;
- mobile: Settings Overview first, then a focused screen with `Back to Settings`;
- mobile navigation: Calendar, Almanac, Search, and More;
- More is a dismissible, focus-trapped sheet and restores focus when closed;
- section state is URL-backed and supports Back/Forward;
- theme changes immediately and survives section navigation/reload;
- Settings URLs remove irrelevant `date`, `screen`, search, and Almanac-rail parameters.

## Working interactions reviewed

- Settings entry from the desktop header;
- Settings Overview to all four detailed sections;
- compact Journal Day privacy link to AI and privacy Settings;
- browser Back from AI and privacy Settings to the exact Journal Day;
- device, Light, and Dark appearance controls;
- mobile More open, Escape close, and focus restoration;
- preserved default Calendar, selected Museum Margin, and full Journal Day routes;
- 1280 px desktop, 820 px tablet, 390 px mobile, and 320 px narrow layouts without horizontal overflow.

## Files

- [`../../prototypes/calendar-ui/index-v5.html`](../../prototypes/calendar-ui/index-v5.html)
- [`../../prototypes/calendar-ui/app-v5.js`](../../prototypes/calendar-ui/app-v5.js)
- [`../../prototypes/calendar-ui/styles-v5.css`](../../prototypes/calendar-ui/styles-v5.css)
- [`../../prototypes/calendar-ui/README-v5.md`](../../prototypes/calendar-ui/README-v5.md)
- [`../../design-qa-v5.md`](../../design-qa-v5.md)
- [`v5/`](v5/) — captured review images and comparison sheet

## Boundary

This is frontend interaction evidence only. It uses fictional fixtures and browser memory. It does not implement or verify Telegram, VoiceNotes, AI calls, authentication, persistence, storage, backup, Hetzner, Cloudflare, deployment, recovery, or production privacy enforcement.
