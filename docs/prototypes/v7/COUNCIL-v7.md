# Life in Days prototype v7 — Product Council contract

- **Feature:** `PVA-002 Calendar Contract Completion`
- **Council date:** 2026-08-14
- **Baseline:** frozen v6 implementation commit `2c0fbf2`; freeze record `a1596ec`
- **Product Manager:** `/root/prototype_product_manager`
- **UI/UX Designer:** `/root/prototype_ui_designer`
- **Project Manager:** `/root/prototype_project_manager`
- **Council disposition:** **Approved for implementation**
- **Gates:** Product `A`; Design `A`; Council `A`; Implementation `IP`; independent QA not yet assigned

This contract governs the v7 prototype slice. It represents interaction intent with synthetic fixtures only. It does not prove persistence, authentication, media delivery, private caching, server logging, accessibility conformance, deployment, or production readiness.

## 1. Scope and closure

V7 closes the Calendar-specific prototype gap in `LID-REF-001`: the missing compact month/year chooser and the approved equivalent treatments for Today, selection, keyboard focus, and attention under Council decision C-01.

`LID-REF-005` and `LID-SCP-004` are regression requirements in v7, not closure claims. Theme fidelity and quiet hidden/empty-day behavior must remain intact, while their primary closure remains v35 and v19 respectively. Full browser, WCAG, 400% zoom, lifecycle, loading, error, retry, and connectivity evidence remains assigned to later packages.

Authority used for this decision:

1. Arun's direct approved image-only Calendar direction;
2. Council decision C-01;
3. the PRD;
4. unsuperseded UX-specification language.

No additional owner decision is required.

## 2. Reconciled council decisions

The Product and Design proposals agreed on C-01, the Calendar anatomy, external layered cell states, responsive behavior, accessibility semantics, progressive disclosure, and regression boundaries. Where their chooser details differed, Council resolved them as follows:

| Topic | Product acceptance | Design proposal | Council resolution |
| --- | --- | --- | --- |
| Month choices | Exactly 12 textual buttons labelled `Jan` through `Dec` | Exactly 12 full-name month buttons | **Use the Product contract:** 12 textual `Jan`–`Dec` buttons. Accessible names may expose the full month name and state. |
| Commit model | Selecting a month commits immediately | Draft selection followed by dynamic `View…` confirmation | **Use the Product contract:** immediate commit. There is no draft month and no View/Confirm button. |
| Year movement | `Previous year` and `Next year` change the chooser year only | Same draft-year concept | **Use the Product contract:** year controls never change the Calendar until a month button is selected. |
| Month labels | Viewed month is selected; current month is labelled `Current month` | Viewed/draft/current helper distinctions | **Use the Product contract:** viewed month has `aria-pressed=true` plus selected shape/text; the Asia/Kolkata current month has visible `Current month` helper text. These states may coexist. |
| Initial focus | Focus begins on the viewed-month button | Focus begins on the dialog heading | **Use the Product contract:** focus the viewed-month button when the chooser opens. Dialog heading remains programmatically named. |
| Tile states | Double/solid/dashed external perimeters | Detailed layered external ring tokens | **Use the Designer contract:** external, non-layout-shifting layered rings described in Section 4, while preserving the Product meanings. |

## 3. Accepted Calendar behavior

### 3.1 Default anatomy

- Calendar remains the default signed-in route with synthetic Today fixed to `13 August 2026` in `Asia/Kolkata`.
- Preserve `en-IN`, Monday-first, seven columns, the current header, Calendar/Almanac switcher, Search entry, previous/Today/next controls, and the Museum Margin.
- The month/year heading becomes a quiet button named, for example, `Choose month and year, currently showing August 2026`. It continues to label the grid programmatically.
- Browser title stays exactly `Life in Days`.

### 3.2 C-01 image-only tile contract

- Real-photo and artwork-cover tiles contain only the cover image and date number.
- No tile may contain an AI artwork, Telegram photo, Journal, source-count, attention, title, caption, tag, generated-state, Today, or provenance chip, badge, dot, watermark, lower-third, scrim label, hover disclosure, or legend.
- A real Daily Photo remains the cover whenever one exists. Artwork may cover only a day without a real photo.
- The 8 August journal-only paper treatment remains: date, restrained title, and journal count, with no fabricated image.
- An empty date remains a quiet date cell. It does not imply missed, incomplete, or absent habit behavior and does not create content.

### 3.3 Museum Margin and progressive disclosure

After a populated date is selected, the Margin reveals information outside the image:

- exact cover/source type;
- title and full date;
- photo and journal counts;
- caption or summary;
- Original Timestamp, Generation, or Archive status as appropriate;
- an exact `Needs attention` row and reason where applicable;
- `Open full Journal Day` as the safe attention action.

The image pixels remain clean. All essential provenance text is at least 13 px. Close, Escape, and backdrop return focus to the selected tile.

## 4. External layered day states

These visual layers must coexist without changing grid track size, covering image pixels, or relying on color alone:

| State | Visual contract | Semantic contract |
| --- | --- | --- |
| Default | Neutral 1 px cell edge | Date remains identifiable |
| Today | External 2 px dotted accent perimeter, separated 2 px from the cell | `aria-current="date"`; accessible name includes `Today` |
| Selected | External solid 3 px forest/accent ring with 2 px paper separation | `aria-selected="true"`; accessible name includes `Selected` |
| Keyboard focus | Outermost 3 px high-contrast `--focus` dashed ring with 3 px paper offset | Exactly one calendar cell has `tabindex="0"` |
| Today + selected + focus | Selected solid inner layer, Today dotted middle layer, focus dashed outer layer | All three meanings remain independently available |
| Hover | Stronger neutral edge and restrained elevation only | Must not resemble Today, selected, focus, or attention |

Attention has no visible tile marker under C-01. The exact reason appears in the accessible name and, after selection, in the Margin. Reduced motion removes lifts and transitions.

Accessible day names contain only safe structural information. Examples:

- `Monday, 3 August 2026, no Journal Day`
- `Saturday, 8 August 2026, 0 photos, 1 journal, no cover image`
- `Thursday, 13 August 2026, Today, Selected, 2 photos, 2 journals, Telegram photo cover, needs attention: Generated summary needs review`
- `Tuesday, 11 August 2026, 0 photos, 1 journal, AI artwork cover`

They never contain a private title, caption, summary, tag, journal text, or private image description. Only populated dates expose detail-control expansion semantics.

## 5. Month/year chooser acceptance

### 5.1 Anatomy and copy

- Dialog title: `Choose month and year`.
- Supporting line: `Journal Dates use Asia/Kolkata.`
- Year row: `Previous year`, visible four-digit year, and `Next year`; both controls meet a 44 px minimum target.
- Month grid: exactly 12 textual buttons in calendar order, `Jan` through `Dec`, arranged 3 × 4 at all supported widths. Each button's accessible name gives the full month and relevant state.
- The viewed month has `aria-pressed="true"` and a solid selected boundary/tonal shape.
- The current `Asia/Kolkata` month has visible helper text `Current month`. When viewed and current coincide, one button carries both meanings without duplicated indicators.
- The chooser contains no mini-calendar, thumbnails, private content, Journal Day counts, year mosaic, streak, or On This Day material.

### 5.2 Interaction

- Opening focuses the currently viewed month button and traps focus within the chooser.
- `Previous year` and `Next year` change the year displayed in the chooser only; they do not change the Calendar, URL, or selected Journal Day.
- Selecting any month button commits immediately: close the chooser, clear selected-day detail, update the Calendar and safe `month=YYYY-MM` URL through the centralized month setter, focus Today if the destination is the current month or day 1 otherwise, and announce `Showing <Month> <Year>` in a private-safe polite live region.
- Selecting the already viewed month closes without adding a redundant history entry.
- Escape, Close, and backdrop cancel an uncommitted year change, leave the Calendar unchanged, and return focus to the month trigger.
- Historical years have no arbitrary limit. Future months may be browsed, but future Journal Dates never enter the Calendar as Source Items.

## 6. URL, history, focus, and keyboard

- Allowed Calendar URL state is `view=calendar`, safe `month=YYYY-MM`, optional valid `date`, and optional `screen=day`; no private content or search query is serialized.
- Previous, Next, Today, and a committed chooser selection each create exactly one history entry only when the month changes.
- Day selection creates one entry. Closing an in-app selected Margin uses the appropriate history action so Back does not reopen it; direct deep links are sanitized/replaced safely.
- Back after month navigation restores the previous month, selected/unselected context, scroll, and logical tile focus. Invalid combinations are canonicalized.
- Roving calendar focus remains: arrows move by one/seven days, Home/End move Monday/Sunday including adjacent-month dates, Page Up/Down move a month while preserving or clamping day of month, and Enter/Space opens a populated day.
- Month transitions retain logical focus. Opening the Margin moves focus into it; closing restores the originating cell.
- Activating an empty date creates nothing. It may only expose the existing prefilled Upload Journal action and never a blank browser composer.

## 7. Required quiet and failure fixtures

- July 2026 represents an ordinary empty viewed month: a complete clean grid plus `No journaled days in this month.` outside the grid. It is not first-use language and makes no blame, missing-import, or habit claim.
- `Today` returns to August 2026.
- 4 August represents partial media failure without recycling another image: neutral no-image treatment, accessible name includes `Image unavailable`, and its Margin explains that the authentic journal remains available. Retry is explicitly simulated and remains a v10 state-family responsibility.

## 8. Responsive and accessibility design contract

- Wide (`>=1280`): seven image-led columns; Calendar/Margin split.
- Medium (`961–1279`): seven columns; split retained; Margin media may stack above its placard.
- Drawer (`701–960`): seven columns; Margin becomes a right drawer up to approximately 620 px with scrim; chooser remains centered.
- Compact (`390` and `320`): 10–16 px outer padding, approximately 3 px grid gaps, seven columns without page horizontal scroll, cells at least 44 px high where feasible, full-width chooser bottom sheet, 3 × 4 month buttons at least 44 px high, reachable year controls, and full-screen Margin above compact navigation with safe-area padding.
- Weekday labels remain visible or programmatically associated. The layout remains usable at 200% text zoom. At 400% page zoom, compact behavior is used and state rings cannot clip; formal 400% acceptance remains v35.
- One page H1, a labelled grid, normal-text contrast target of 4.5:1, focus contrast target of 3:1, no new essential text below 13 px, no color-only state, chooser focus trap/return, restrained live announcements, and reduced-motion equivalence are required.

## 9. Synthetic fixtures

| Fixture | Purpose |
| --- | --- |
| 13 August 2026 | Today + selected + real cover + stale-summary attention |
| 11 August 2026 | Artwork-only cover with AI provenance only in accessible name/Margin |
| 6 August 2026 | Real cover + source-conflict attention |
| 8 August 2026 | Journal-only paper treatment |
| 4 August 2026 | Partial media failure with authentic journal intact |
| 3 August 2026 | Quiet empty date |
| July 2026 | Ordinary empty month |
| September 2026 | Future-month browsing without future Source Items |

## 10. Explicit exclusions and evidence boundary

V7 does not add or claim:

- v9 first-use readiness;
- v10 loading, complete error/retry, connection, session, or authorization state families;
- v11 Needs Date Review;
- v19 delete/restore-last-source lifecycle completion;
- v35 formal browser, screen-reader, WCAG, or 400% zoom completion;
- year mosaic, replacement Timeline, media wall, On This Day, streaks, reminders, a blank composer, web photo upload, or any deferred feature;
- implementation or verification of server persistence, storage, authentication, logging, integration, media delivery, encryption, deployment, or production privacy.

V7 must regress the frozen v6 private Search contract, real-photo cover precedence, image-only tiles, paper days, provenance outside pixels, switcher, Settings, themes, Upload, gallery, generated reflection, Journal Day detail, Monday/`Asia/Kolkata`, and every deferred-scope guardrail. No v6 artifact may be edited.

## 11. Independent QA gate

A fresh QA agent must verify at minimum:

1. wide light default Calendar;
2. dark 13 August combined Today/selected/focus, real cover, and Margin attention;
3. 11 August art-only accessible name and Margin, with no tile label;
4. 6 August attention only in accessible name/Margin;
5. 8 August paper day, 4 August media failure, and 3 August quiet empty date;
6. chooser 12-button anatomy, viewed/current states, year-only changes, immediate month commit, cancel, focus trap/return, and no extra/private content;
7. July empty month, September future browsing, and Today return;
8. Previous/Next/Today/chooser history, Back restoration, safe URL/title, and invalid-state canonicalization;
9. arrows, Home/End, Page Up/Down, Enter/Space, Escape, independent selection/focus, and roving `tabindex`;
10. 1280, 960, 700, 390, and 320 widths; light/dark; 200% text; 400% compact observation; reduced motion; no horizontal overflow or clipped rings;
11. DOM/accessibility assertions for labels, rings, Margin, live region, chooser, and the absence of provenance/attention markup in cover tiles;
12. no console or syntax errors and no v6 or forbidden-scope regression.

QA failure is repaired in the same unfrozen v7 candidate. V7 is frozen and v8 is released only after an independent `Pass` with evidence.

## 12. Append-only clarification — compact journal-only tiles

**Issued:** 2026-08-14

**Disposition:** Approved; this clarification supersedes Section 3.2 only for the compact visual presentation of a journal-only Calendar tile. All other v7 Council decisions remain unchanged.

The earlier Product acceptance preserved the 8 August paper tile with a visible date, title, and restrained journal count, while the responsive Design contract allowed narrow cells to reduce secondary text. At 320 px, a seven-column grid cannot display 13 px title/count text without clipping, illegible truncation, or horizontal overflow. Council therefore adopts the least-divergent rule:

- At wide, medium, and drawer layouts where the cell can present metadata legibly, the 8 August journal-only tile keeps its date, restrained title, and journal count on the quiet paper treatment.
- At compact effective widths up to 480 px—including the 390 px and 320 px acceptance viewports and compact layout triggered by zoom—the visible tile keeps the date plus the recognisable quiet paper treatment. One or more subtle horizontal paper rules may remain, but title and journal-count text are visually omitted.
- Omitted compact text is not reduced below the 13 px essential-text floor, squeezed, iconized, shown as a tooltip-only value, or moved over fabricated imagery.
- The complete safe accessible name remains: `Saturday, 8 August 2026, 0 photos, 1 journal, no cover image`. Selecting the tile still reveals its title, counts, and provenance in the Museum Margin outside image pixels.
- The rule does not affect real-photo or artwork cover tiles: they remain image plus date only at every width under C-01.
- The rule does not affect quiet empty dates: they remain date-only and must not acquire paper rules that could imply a Journal Day.

Independent QA must verify 8 August at wide, 390 px, 320 px, 200% text zoom, and 400% compact observation. Pass requires a distinguishable paper day, the safe complete accessible name, no clipped or sub-13 px metadata, no horizontal overflow, and successful selection into the full Museum Margin.

## 13. Append-only clarification — prototype year representation

**Issued:** 2026-08-14

**Disposition:** Approved; this clarification supersedes only the phrase `Historical years have no arbitrary limit` in Section 5.2 for the synthetic v7 prototype's representable chooser state.

The product has no archive-year cap: Life in Days must not discard, hide, reject, or make an authentic historical Journal Date inaccessible merely because of a UI-imposed year range. The v7 synthetic frontend prototype, however, uses the safe four-digit `YYYY-MM` route and display contract and is therefore representationally bounded to years `0001` through `9999`.

- The chooser renders the year as exactly four digits within `0001`–`9999`.
- At `0001`, `Previous year` is disabled and exposes the disabled state programmatically. At `9999`, `Next year` is disabled likewise.
- Year navigation and incoming Calendar state must never produce year `0000`, a negative/signed year, more than four digits, `NaN`, rollover into another year, or an invalid `month` value.
- An invalid or out-of-representation `month` value is canonicalized to a safe valid Calendar month without putting the invalid value back into history.
- The edge state is a truthful prototype implementation limit, not an MVP product rule, retention rule, archive limit, or permission to reject an otherwise valid historical Source Item in production.
- Future months inside the prototype range remain browsable, while the existing rule still forbids future Journal Dates from being admitted as Source Items.

Independent v7 QA must inspect or exercise the `0001` and `9999` chooser edge states, disabled-control semantics, four-digit rendering, and invalid URL canonicalization. QA must describe the bound as prototype representation only and must not claim that the production date model has been selected or verified.
