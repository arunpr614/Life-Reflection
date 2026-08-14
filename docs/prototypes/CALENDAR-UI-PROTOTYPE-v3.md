# Life in Days — unified Calendar and Almanac prototype v3

Date: 2026-08-13
Branch: `prototype/calendar-ui-v3-unified`
Starting point: v2 commit `7e3b2da`
Status: implemented and locally reviewed as a throwaway, simulated prototype

## Decision represented by v3

v3 narrows the design exploration to one experience:

- **Calendar** is the default Living Mosaic landing.
- **Almanac** is the Monthly Almanac reading mode.
- Calendar and Almanac are a quiet two-view switcher in the shared header, immediately beside Search.
- Archive Desk, Timeline, the A/B/C direction selector, and duplicate product chrome are removed.
- Search, theme, and Add journal remain shared utilities rather than competing destinations.

The interaction architecture and responsive behavior were reviewed by an expert UI/UX designer agent and a separate interaction-architecture agent. Their strongest contribution was treating Calendar and Almanac as two lenses over one selected Journal Date, not separate products with separate state.

## Experience model

| Product concept | Calendar / Living Mosaic | Monthly Almanac |
| --- | --- | --- |
| Primary intent | Recognize a day visually and browse a month quickly. | Read the month as a continuous personal book. |
| Default entry | Yes. | No; chosen from the shared switcher or a search result. |
| Journal Date continuity | Opening a full day selects that date. | Switching from that day scrolls and focuses its matching chapter. |
| Month continuity | Month controls update a durable `month` URL parameter. | The same month opens, including months with no Journal Days. |
| Real photo treatment | Photo is the Calendar Cover. | Photo is chapter media and remains labeled Telegram photo. |
| Generated artwork | Cover only when no real photo exists. | Visible and labeled; secondary when real photos exist. |
| Generated reflection | Editorial reading composition with one management action. | Chapter opening; on mobile, prose precedes AI provenance/status. |
| Authentic journals | Full source section in the Journal Day. | Expandable source records inside each chapter. |

## Screen inventory

### 1. Living Mosaic landing

The image-led month is the default route. The oversized month title and real-photo/AI-artwork tiles provide visual recognition; empty dates remain calm and selectable only for an explanatory state. Month controls, Today, selected date, attention markers, timezone, and the private-photo boundary are visible without turning the month into an operations dashboard.

### 2. Full Journal Day

Opening a populated tile provides gallery navigation, real-photo cover management, generated reflection, source journals, artwork controls, privacy language, and day actions. Calendar remains the owning view; switching to Almanac hands off to the same date.

### 3. Monthly Almanac with navigator

The expanded desktop state uses a 331 px month navigator and a continuous reading column. The navigator includes month movement, compact calendar, upload action, legend, timezone, and a Hide month control.

### 4. Immersive Monthly Almanac

Collapsing the navigator changes its grid track to exactly `0px`; no blank rail is reserved. A quiet Show month control remains available. Reading position is retained while toggling.

### 5. Mobile Monthly Almanac and drawer

At 960 px and below, the persistent rail disappears. Open month index launches a modal drawer with the full calendar and upload action. It supports initial focus, Tab containment, Escape, backdrop close, and focus restoration. Selecting a populated date closes the drawer and moves to the matching chapter.

### 6. Archive Search

Search covers all fictional Journal Days, not only the currently displayed month. It searches generated navigation fields and complete authentic journal fixture text. Results return to the view from which Search was opened: a Calendar day or Almanac chapter.

### 7. Manage reflection

Reading mode shows one generated reflection and one Manage reflection action. The sheet keeps Title, Summary, and Tags individually editable while keeping source journals separate. Protected edits are never silently overwritten; a stale suggestion can be reviewed and explicitly kept, edited, or adopted.

### 8. Add journal

Add journal is reachable in the desktop header, Almanac navigator/drawer, Journal Day, Almanac chapter, and mobile bottom navigation. The simulated flow accepts one `.txt` or `.md` file for a chosen Journal Date, previews it, warns about identical text, and confirms only in browser memory.

## URL and navigation contract

| Parameter | Meaning |
| --- | --- |
| `view=calendar|almanac|search` | Active top-level lens. Calendar is the default when omitted or invalid. |
| `month=YYYY-MM` | Displayed month. Persists empty months across reloads. |
| `date=YYYY-MM-DD` | Selected Journal Date, including an empty date used as month context. |
| `screen=day` | Opens the full Calendar Journal Day when the selected date has content. |
| `rail=collapsed` | Enables zero-width desktop Almanac reading mode. |
| `q=…` | Current Search query. |

Switcher actions use browser history. Back/Forward reconstructs the view, month, selected date, search query, rail state, focus target, and a useful per-view scroll position.

## Interaction details

- Clicking Calendar while already on a full day returns to the Living Mosaic month.
- Calendar to Almanac from a full day scrolls to and focuses the matching chapter.
- Almanac to Calendar preserves month/date and returns to the month overview.
- Search remembers whether Calendar or Almanac launched it and returns a result accordingly.
- `Cmd/Ctrl+K` opens Search and focuses its field.
- One Calendar date is tabbable; arrows move one day or one week, Home/End use the actual visual week, and Page Up/Page Down changes month.
- Theme, rail, search, upload, reflection-management, gallery, cover, artwork, and month controls all have visible feedback.
- Unbuilt management workflows announce their bounded prototype status with a toast.

## Responsive rules

| Width | Behavior |
| --- | --- |
| Above 960 px | Shared desktop header; Almanac expanded/collapsed rail. |
| 960 px and below | Almanac rail replaced by full-height modal month drawer. |
| 700 px and below | Shared utilities simplify; persistent bottom navigation exposes Calendar, Almanac, Search, and Add journal. |
| 420 px and below | Theme control hides to protect the primary tasks; theme remains a desktop/tablet review control. |

## Feedback prompts

The most useful next feedback is about the single combined direction:

1. Does Living Mosaic feel like the right default home, or should it remember the last-used view?
2. Is Calendar/Almanac the right naming, especially on mobile?
3. Does the expanded Almanac navigator contain the right amount of information?
4. Is the collapsed Show month control discoverable without disturbing the reading surface?
5. Does the memory-first reflection hierarchy feel quiet enough on desktop and mobile?
6. Should Search remain a full page or become a command-style overlay later?

## Files

- [`../../prototypes/calendar-ui/index-v3.html`](../../prototypes/calendar-ui/index-v3.html)
- [`../../prototypes/calendar-ui/app-v3.js`](../../prototypes/calendar-ui/app-v3.js)
- [`../../prototypes/calendar-ui/styles-v3.css`](../../prototypes/calendar-ui/styles-v3.css)
- [`../../prototypes/calendar-ui/README-v3.md`](../../prototypes/calendar-ui/README-v3.md)
- [`../../design-qa-v3.md`](../../design-qa-v3.md)
- [`v3/`](v3/) — captured review images and comparison sheet

## Boundary

This is frontend interaction evidence only. It uses fictional data and browser memory. It does not implement or verify Telegram, VoiceNotes, provider calls, authentication, persistence, storage, backup, Hetzner, Cloudflare, deployment, recovery, or production privacy enforcement.
