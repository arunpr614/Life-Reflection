# Life in Days — calendar UI prototype

Status: **throwaway design exploration on branch `prototype/calendar-ui-directions`**

Question:

> Which calendar and Journal Day hierarchy makes Life in Days feel most beautiful to revisit while keeping authentic sources and AI-generated material unmistakably separate?

The runnable prototype is in [`prototypes/calendar-ui/README.md`](../../prototypes/calendar-ui/README.md). It compares three structurally different directions on one route using the same fictional data:

| Key | Direction | Structural hypothesis |
| --- | --- | --- |
| A | Archive Desk | Keeping the month and selected-day preview together makes revisiting fast without losing calendar context. |
| B | Living Mosaic | Giving photographs most of the viewport creates stronger visual recall without obscuring dates or provenance. |
| C | Monthly Almanac | Treating populated days as book-like chapters creates a calmer reflection experience than opening one record at a time. |

This artifact does not implement or verify ingestion, persistence, authentication, AI, encryption, backup, restore, hosting, or deployment. It uses no personal journal text or real personal photos. Any simulated mutation resets on refresh.

## Decision capture

No direction has been selected yet. Record the chosen structure, useful elements from other variants, rejected tradeoffs, and the reason for the decision here after review. Production code must be written separately under the approved implementation gates.
