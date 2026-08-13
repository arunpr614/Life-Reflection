# v6 Product Council contract — Private Search State

Date: 2026-08-14

Feature package: `PVA-001`

Candidate version: v6

Requirements: `LID-REF-003`, `LID-OPS-008`, `LID-OPS-016`

Starting point: v5 at `f74455f`

Status: approved for implementation; acceptance remains subject to independent QA

## Product Manager decision

The audit identified an immediate privacy defect: v5 serializes a personal search term into `?q=`, where browser history, referrers, reverse-proxy access logs, and other infrastructure could observe it. v6 closes only that self-contained defect and establishes an honest initial Search state. It does not claim to complete the broader lexical Search requirement.

Acceptance requires all of the following:

1. no search-term read or write in URL parameters, `history.state`, document title, local storage, or session storage;
2. a term exists only in live JavaScript memory and is cleared by reload;
3. internal navigation and Back/Forward preserve that live-memory term while the page remains open;
4. any incoming legacy `q` parameter is ignored and stripped immediately;
5. the initial screen contains a plain scope explanation and no personal suggestions, recent-memory content, or generated answer;
6. clearing Search removes the live value and returns focus to the input;
7. all v5 surfaces remain available without regression.

## UI/UX Designer decision

Search becomes a calm, text-led archive index within the established warm-paper visual language.

- The editorial heading is smaller than v5 so the visible form and scope remain dominant.
- The label is `Words or exact phrase`; the action is `Search archive`.
- The initial state is headed `Search without guesswork` and explains private page-local state, current-scope limitations, and the absence of AI or image search.
- No suggested terms or recent Journal Days appear before a search.
- Result imagery remains orienting and contains no source/provenance overlay.
- Search metadata uses the 13 px functional floor.
- Compact layouts stack the form and explanatory rows without horizontal scrolling.
- Submit moves focus to the result count; Clear returns focus to the search field.

The complete match-level result design—date and exact-tag filters, photo captions, Include history, field/source snippets, index states, and historical destinations—remains approved for the later dependency-complete Search version.

## Project Manager gate

The candidate must not be frozen or described as accepted until a fresh QA agent checks:

- static syntax and privacy-oriented source inspection;
- incoming legacy-query stripping;
- submit, no-result, clear, internal navigation, browser Back/Forward, and reload behavior;
- generic title and clean URL/history state throughout;
- desktop and compact visual states;
- keyboard focus behavior and v5 smoke regression;
- current-run screenshots and a written QA disposition.

Any failure is repaired in the same v6 candidate. The version number changes only after the candidate passes.

## Council boundary

This version is frontend interaction evidence using fictional fixtures. It cannot prove deployed HTTP cache headers, proxy and CDN logs, telemetry retention, backend query handling, or server-side encryption. Those requirements remain implementation-unverified even when their product-facing state is represented.
