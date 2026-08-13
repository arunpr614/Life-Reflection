# Life in Days prototype v8 — Product Council contract

- **Feature:** `PVA-003 Cross-month Almanac`
- **Council date:** 2026-08-14
- **Baseline:** frozen v7 implementation/evidence commit `05975fc`; freeze record `dda1b9c`
- **Branch:** `prototype/calendar-ui-v8-cross-month-almanac`
- **Product Manager:** `/root/prototype_product_manager`
- **UI/UX Designer:** `/root/prototype_ui_designer`
- **Project Manager:** `/root/prototype_project_manager`
- **Council disposition:** **Approved for implementation**
- **Gates:** Product `A`; Design `A`; Council `A`; Implementation `IP`; independent QA not yet assigned

This contract governs the v8 prototype slice. It represents the Almanac interaction and visual contract with fictional frontend fixtures. It does not prove database ordering or filtering, lifecycle enforcement, pagination, persistence, authentication, media delivery, deployment, accessibility conformance, or production readiness.

## 1. Authority, purpose, and closure

V8 turns the approved Monthly Almanac into the product's cross-month chronological browsing experience while preserving its book-like visual direction. Under Council decisions C-02 and C-03, the user-facing name remains **Almanac**, the Calendar/Almanac switcher remains the browse-mode control, and no third `Timeline` destination is added.

Authority used:

1. Arun's direct approved Calendar/Almanac direction;
2. Council decisions C-02 and C-03;
3. `LID-REF-002` in the PRD;
4. unsuperseded UX Timeline, navigation, responsive, and accessibility contracts;
5. frozen v7 and v6 interaction/privacy invariants.

After independent QA passes, v8 may close audit gap 11 and mark only `LID-REF-002` as prototype-represented. `LID-REF-004`, `LID-REF-005`, `LID-REF-006`, and `LID-SCP-004` are regression requirements, not v8 closure claims. No implementation claim follows from a prototype pass.

No further decision from Arun is required.

## 2. Product and Design reconciliation

The Product and Design contracts agree on the Almanac name, reverse chronology, semantic month sections and day articles, book-like presentation, collapsible local navigator, deterministic manual pagination, canonical Journal Day destination, progressive disclosure outside image pixels, responsive drawers, and safe accessibility behavior. Council resolves their remaining differences as follows:

| Topic | Product contract | Design contract | Council resolution |
| --- | --- | --- | --- |
| Initial loaded window | Exactly the newest/current synthetic month, August 2026 | At least two populated months, August and July | **Use Product:** entry loads August only. Cross-month behavior is revealed deliberately through `Load earlier days`. |
| July fixture | July 2026 is a loaded empty month | July has at least three live days | **Use Product:** July is known empty. First load advances the boundary through July and reports zero days without jumping the reader. |
| Pagination unit | Exactly one immediately preceding calendar month per action, including an empty month | One earlier month/batch; first earlier fixture June | **Use Product:** first load July, second June, third May. No batching around empty months. |
| Fixture days | August six; June 27/9; May 31/14; hidden June 20 and May 18 | July populated; June three; May hidden/Trash | **Use Product:** exact fixture inventory in Section 11. |
| Load-success focus | Retain focus on the same Load control and compensate viewport offset | Replace old control with a focusable boundary-status anchor | **Use Product:** keep the same logical Load control focused with `preventScroll`/viewport compensation; announce success through a polite status. |
| Jump label | `Jump to month and year` | `Jump to month` | **Use Product:** exact label `Jump to month and year`. |
| Jump commit | Immediate month commit resets the window to the selected month | Loaded target focuses; unloaded target loads a containing slice | **Use Product:** every selection resets to exactly one target month; `month=through=target`. |
| Chapter CTA | `Read full Journal Day` | `Open full Journal Day` | **Use Product:** exact label `Read full Journal Day`. |
| Index contents | Loaded range, month groups, and live-day links | Month-level Loaded volumes only | **Use Product content in Design hierarchy:** month groups contain safe live-day links; no mini-calendar. |
| URL model | `month` newest, `through` oldest, optional `date` anchor | Safe optional month/year anchor | **Use Product:** deterministic boundary model in Section 8. |

Design governs hierarchy, editorial rhythm, media presentation, external provenance, truncation, responsive transformation, focus styling, and accessibility details wherever these do not conflict with the explicit Product acceptance above.

## 3. Information architecture and reading order

- The top browse switcher remains `Calendar | Almanac`; Search remains a sibling; Management remains under Settings/More.
- Almanac is one reverse-chronological reading surface across a loaded range, not a set of disconnected month pages, a Calendar grid, or a social feed.
- The page has exactly one H1, `Almanac`, beneath eyebrow `CHRONOLOGICAL ALMANAC` and lead `Your Journal Days, arranged from newest to oldest.`
- A truth line reads `Live Journal Days only · Asia/Kolkata`.
- Loaded non-empty months render as semantic sections with H2 month/year headings, newest month first. Journal Days render as articles with H3 titles and descend by fixed `Asia/Kolkata` Journal Date inside each month.
- Empty months crossed by pagination do not create false month-volume headings in the main reading flow. Their loaded boundary remains represented through safe range/status/index metadata. When an empty month is the sole jump target, the main surface shows `No journaled days in this month.`
- The term `Timeline` does not appear as a competing navigation item. User-facing copy avoids `feed`, `entries`, `memories for you`, missing/gap/streak language, and social-engagement language.

## 4. Wide index and compact drawer

### 4.1 Wide local navigator

- At wide widths, a 300–340 px collapsible `<aside aria-label="Almanac index">` accompanies a reading column.
- Heading: `Browse the Almanac`; action: `Jump to month and year`; range group: `Loaded volumes`.
- Replace the inherited duplicate month grid with a cross-month index. Each loaded month group shows month/year and derived live-day count. Each non-empty month contains live-day links with date, concise title, and safe cover indicator only—never caption, summary, source-journal excerpt, Trash/history content, or private media metadata.
- The current viewport chapter link has `aria-current="location"` plus non-color shape/weight treatment. Updating the active item as the reader scrolls must not create URL/history churn.
- The index may display a loaded empty boundary month as `July 2026 · 0 Journal Days`, with no day links. It must not fabricate a main reading chapter.
- Expanded action: `Hide index`; collapsed control: `Show index` plus the current visible month. Collapsing/expanding preserves loaded boundaries, selection, reading scroll, and logical focus. A versioned local preference may store only expanded/collapsed state.
- `Journal Dates use Asia/Kolkata` and the existing Upload Journal entry remain at the foot.

### 4.2 Compact navigator

- At 960 px and below, replace the rail with a sticky `Browse Almanac` control plus visible current month.
- It opens a focus-trapped `Almanac index` sheet: up to approximately 380 px wide at tablet, full-screen at phone, above bottom-navigation safe areas.
- The sheet mirrors Jump, loaded month groups and live-day links, Upload, and Close. Selecting a link closes the sheet, focuses the exact target month/day destination, and preserves boundaries.
- Close and Escape restore the invoking Browse control.

## 5. Journal Day chapter contract

Every visible Journal Day article contains:

- full Journal Date;
- generated title when current/available, without treating it as source truth;
- photo/journal counts;
- factual generated summary preview clamped to approximately three lines;
- at most three selected tags;
- the shared Calendar Cover using the same real-photo precedence;
- exact CTA `Read full Journal Day`.

Rules:

- Do not render raw source-journal text or a collapsible source transcript in Almanac. Authentic sources remain in the canonical full Journal Day.
- Use one dominant stable 4:5 Calendar Cover. Additional media may be indicated outside pixels with a quiet `+N photos` cue rather than an equal competing image.
- A real Daily Photo is always the cover when present. AI artwork may cover only a day without real photos. A journal-only day receives a neutral no-image placard. Failed media receives a truthful unavailable fallback without hiding the day.
- Provenance and captions are external text at least 13 px, never an absolute/gradient image overlay: `Calendar Cover · Telegram photo`, `Calendar Cover · AI artwork`, `No cover image · Journal only`, or `Calendar Cover unavailable`.
- Derived attention appears outside media as `Review update`. AI or media failure cannot hide authentic day identity or prevent navigation.
- Real-photo alternative text uses only approved local/synthetic fixture text, never AI description. Artwork alternative text identifies it as AI artwork. No-image state is ordinary text, not decorative image alt.
- `Read full Journal Day` accessible name includes the date.

## 6. Visibility and ordering

- Include only Journal Days with at least one live Source Item.
- Sort and group by fixed `Asia/Kolkata` Journal Date, newest month/day first.
- Exclude empty shells containing only historic or generated artifacts, Trash-only days, suppression-only days, unresolved Needs Date Review items, and invalid future-dated sources.
- A day containing both live and Trashed sources appears using only live/current source counts and presentation. Trash does not appear or count in Almanac.
- Hidden/Trash/history-only fixture sentinel strings must be absent from visible text, DOM text, accessible names, counts, jump metadata, and index links.
- This filtering is simulated fixture behavior; it is not evidence of backend lifecycle enforcement.

Whole-archive empty state:

- H1 `Almanac`;
- copy `No live Journal Days are available to read.`;
- actions `View Calendar` and `Upload journal`;
- no first-use/readiness, failure, or blame implication.

## 7. Deterministic Load earlier behavior

### 7.1 Boundary model

- Initial entry loads exactly August 2026, the newest/current synthetic month.
- `Load earlier days` is the only pagination trigger. No infinite loading, scroll observer, auto-load, or focus-hostile endless stream is permitted.
- Each activation appends exactly one immediately preceding calendar month and updates only the oldest `through` boundary. Existing months/articles remain in the same order and are not recreated, removed, or reordered.
- First activation loads empty July and adds zero days. Second loads June. Third loads May. Reaching May shows `Beginning of this prototype archive`; this is fixture scope, not a product retention/archive limit.

### 7.2 Action states and focus

- Loading is scoped to the pagination region: disable the control, label it `Loading earlier days`, set `aria-busy` only on that region, and announce `Loading the next earlier volume.`
- Before append, record the Load control and viewport offset. After success, keep the same logical Load control focused with `preventScroll` and compensate the viewport so the reader does not jump. New content follows the existing reading flow.
- Success announces, for example, `July 2026 loaded. No Journal Days.` or `June 2026 loaded. 2 Journal Days added.` without announcing appended prose.
- Preserve all prior loaded content, selection, expanded state, and index state.
- End state: `Beginning of this prototype archive` and `No earlier live Journal Days are available.` The Load action is removed or disabled honestly.
- A component-local simulated failure says `Earlier Journal Days could not be loaded. What is already shown is unchanged.` with `Retry loading earlier days`. Focus remains on Retry; retry never duplicates a month/day. Complete application failure handling remains v10.
- Browser Back/Forward across Load actions restores the exact safe boundary and in-memory scroll/focus context without duplicate insertion.

## 8. URL, history, anchors, and canonical detail

### 8.1 Safe URL model

Allowed Almanac state:

```text
view=almanac
month=YYYY-MM        newest loaded boundary
through=YYYY-MM      oldest loaded boundary; omitted when equal to month
date=YYYY-MM-DD      optional selected chapter anchor
screen=day           only for canonical full Journal Day
rail=collapsed       only for collapsed wide index
```

- `through` must be no later than `month`. Invalid or inverted ranges reset through `replaceState` to one safe valid month.
- The v7 representational year boundary `0001`–`9999` remains a synthetic URL/chooser constraint, not a product archive-year cap.
- No loaded arrays, title, summary, tag, caption, source text, query, scroll, focus selector, or other private state enters URL/history.
- Browser title remains `Life in Days`.
- Reload reconstructs the safe range and optional anchor. Exact scroll after reload is not promised beyond normal browser restoration.

### 8.2 Load, jump, and chapter anchors

- Load earlier changes only `through` and creates one history entry for a changed boundary.
- Jump resets the range to exactly the selected target month: `month=target`, `through=target`/omitted, then focuses the newest live day or empty-month note.
- Index or Calendar arrival may set safe `date` and focus/scroll the chapter without opening full-day detail. Later chapter selection replaces the date in the same browse-history entry rather than generating scroll-history noise.
- A valid deep-link date outside the stated range expands the range minimally between the newest boundary and the date's month, then canonicalizes.
- Invalid, hidden, Trash-only, or history-only `date` is removed without exposing or targeting it; the valid range remains.

### 8.3 Canonical full Journal Day and return

- Every `Read full Journal Day` opens the exact inherited full-day renderer at `view=almanac&month=<newest>&through=<oldest>&date=<day>&screen=day`.
- Full-day actions remain identical to Calendar. Adjacent populated-day navigation may cross a month boundary.
- Before opening, save only safe in-memory origin state: boundaries, scroll, invoking day/control, index state, and logical focus. Never serialize private content or scroll position.
- Browser Back and `Back to Almanac` restore the exact loaded range, selection, index state, reading scroll, and focus to the invoking Read control—even after adjacent-day navigation.
- A direct full-day deep link without an origin returns to the normal safe Calendar/default destination rather than inventing Almanac history.

### 8.4 View preservation

- Almanac → Calendar → Almanac restores range, scroll, selection, index state, and logical focus.
- Search return to Almanac preserves the range and anchors the selected result.
- Theme, index, resize, and reduced-motion re-render preserve the same safe browsing context.

## 9. Jump to month and year

- Trigger: `Jump to month and year`.
- Dialog/sheet title: `Jump to a month in the Almanac`.
- Support: `Moves to the first live Journal Day in that month. Journal Dates use Asia/Kolkata.`
- Reuse the v7 four-digit year row with `Previous year`, visible year, and `Next year`, plus exactly 12 textual `Jan`–`Dec` buttons. Year navigation changes draft year only.
- Opening focuses the viewed target. Buttons expose selected/current state and safe full-month accessible names. No thumbnails, day titles, private visuals/text, year mosaic, On This Day, or import controls.
- Selecting a month commits immediately, closes, resets the window to that target only, clears an anchor outside it, and focuses the newest visible Journal Day.
- Known empty July/September targets focus the empty-month note and announce `No journaled days in this month.` They never redirect to another month.
- Cancel, Escape, and backdrop preserve the Almanac and return focus to the trigger.
- Future months may be browsed but contain no future-admitted Journal Days.
- The v7 `0001`–`9999` prototype-representation clarification applies at year edges, with disabled year controls and no product-year-cap implication.

## 10. Responsive, accessibility, and motion contract

- `>=1280`: 300–340 px index; reading canvas approximately 1050–1120 px; prose remains 60–72ch even when index collapses.
- `961–1279`: 280–310 px index; metadata may remain two-column; media and placard may stack.
- At exactly `960` and through `701`: full-width reading, sticky compact Browse control, drawer up to 380 px, single-column cover.
- `390/320`: 14–16 px gutters, one column, stable 4:5 cover, external provenance, at most three tags, full-width 44 px primary/load controls, full-screen index sheet above safe-area-aware bottom navigation, and no page horizontal scroll.
- At 200% text zoom, retain every action and essential text at least 13 px. Capture compact 400% observation; formal 400%/browser/accessibility closure remains v35.
- Semantic `<main>`, month `<section aria-labelledby>`, day `<article>`, H1/H2/H3 hierarchy; no Calendar grid or social-feed semantics.
- Index navigation has its own labels; current location uses `aria-current="location"`; focus and state do not rely on color alone.
- Retain v7 focus-visible contrast target and minimum target sizes. Dialog/drawer traps focus and always restores it. Programmatic month/chapter destinations may use `tabindex="-1"`.
- Load status uses one polite live region. Do not announce inserted summaries or every index update.
- No parallax, page-turn, image zoom, autoplay, or insertion animation. Smooth jump scrolling is allowed only without reduced motion. Drawer/index transitions stay at or below 200 ms; reduced-motion path is immediate without translation.

## 11. Exact synthetic fixtures

All content is fictional.

| Month | Visible live fixtures | Boundary purpose |
| --- | --- | --- |
| August 2026 | 13 real + attention; 11 AI art; 8 journal-only; 6 conflict; 4 image unavailable; 2 sparse journal | Initial six-day month, order `13, 11, 8, 6, 4, 2` |
| July 2026 | No live Journal Days | First Load earlier adds zero days; sole jump target shows quiet empty month |
| June 2026 | 27 real photo; 9 no image | Second Load earlier; order `27, 9` |
| May 2026 | 31 AI art; 14 real photo | Third Load earlier; oldest prototype boundary |
| Hidden sentinels | 20 June Trash-only; 18 May history-only | Must never render, count, appear in DOM/accessibility, index, jump, or targeting |
| September 2026 | Future known-empty month | Future browse without future Source Items |

## 12. Explicit exclusions and regression contract

V8 does not include or claim:

- a Timeline tab or third browse mode;
- infinite/automatic loading;
- year mosaic, media wall, map, On This Day, raw journal feed, or social interactions;
- v9 first-use readiness, v10 global state shell, v18 History, v19 Trash, v21 full Search, or v35 final accessibility evidence;
- historic automatic import, sharing/public links, coaching, reminders, streaks, semantic/AI search, offline mode, blank browser composition, or web photo upload;
- backend filtering/order/pagination, lifecycle enforcement, persistence, authentication, media/storage behavior, production accessibility, deployment, or production privacy evidence.

V8 must regress:

- frozen v7 Calendar chooser, external Today/selected/focus states, compact paper-day rule, safe year representation, C-01 clean-image tiles, and real-cover precedence;
- frozen v6 Search privacy and no `q`/private URL state;
- C-03 switcher, Museum Margin, canonical full day, gallery, Upload, generated reflection, Settings, themes, `Asia/Kolkata`, `en-IN`, exact prospective tag, all deferred-scope exclusions, and no provider/production claim;
- immutability of all v7 and earlier versioned artifacts.

## 13. Independent QA gate

A fresh QA agent must verify at minimum:

1. default August contains one month group and ordered days `13, 11, 8, 6, 4, 2`;
2. semantic H1/H2/H3/section/article hierarchy, complete chapter anatomy, clamped generated previews, and no raw source journal;
3. correct real/art/no-image/unavailable cover variants, real-cover precedence, external provenance, and zero text overlays on pixels;
4. wide index month/day hierarchy, active chapter tracking without history churn, and collapse/expand without scroll/focus loss;
5. first Load earlier reaches empty July, adds zero days, preserves viewport/focus/content, updates only `through`, and does not auto-load June;
6. second Load adds June once in order `27, 9`, with hidden 20 June absent; Back/Forward restores the boundary without duplicates;
7. third Load adds May in order `31, 14`, hidden 18 May absent, and reaches the honest prototype beginning;
8. component-local pagination failure and Retry preserve loaded content and create no duplicates;
9. Jump cancel, immediate June commit, July empty result, September future-empty result, and Today reset to August;
10. valid chapter anchor replacement, valid out-of-range deep-link minimal expansion, and invalid/inverted/hidden state sanitization;
11. Read June 27 opens the canonical full Journal Day and Back restores exact range, scroll, index state, and invoking-control focus; adjacent cross-month navigation does not break return;
12. Almanac/Calendar/Search transitions, theme, rail, resize, and reduced motion preserve safe context;
13. 1280, 960, 700, 390, and 320 layouts; compact drawer; keyboard/focus/live-region behavior; light/dark; 200% text and compact 400% observation; no overflow;
14. hidden/Trash sentinels absent from visible DOM/accessibility/counts/index/jump; safe URL/title/storage; console and syntax clean; frozen v6/v7 regression/immutability.

Pass means a user can browse newest-to-oldest across multiple months, deliberately load one deterministic earlier calendar month at a time, jump to a target month, enter the same full Journal Day, and return to the exact reading context. Only live/current fixtures appear, real-photo cover precedence holds, and provenance remains outside pixels. After a pass, the allowed conclusion is only: **`LID-REF-002` is prototype-represented; implementation remains unverified.**

## 14. Append-only clarification — bounded synthetic range materialization

**Issued:** 2026-08-14

**Disposition:** Approved. This clarification supersedes only the unbounded materialization implications of Sections 7.1, 8.1, 8.2, and 9 for the fictional v8 dataset. It does not change the product's archive semantics or create a product archive-year cap.

The v8 prototype has declared synthetic data only from May through August 2026, plus known-empty September 2026. It must not materialize an arbitrary number of empty month sections merely because a syntactically valid four-digit URL or chooser state names a distant month.

Exact normalization rules:

1. **Declared browse-range floor.** For ordinary Almanac range state whose newest boundary is within the declared 2026 fixture window, any valid `through` earlier than `2026-05` is clamped through `replaceState` to `2026-05`. No month before May 2026 is rendered, indexed, counted, loaded, or described as part of the prototype archive.
2. **Declared beginning.** May 2026 remains `Beginning of this prototype archive`. This wording describes the fictional evidence dataset only; it is not a retention rule, ingestion rule, product archive limit, or claim that earlier real Journal Dates are unsupported.
3. **Valid live-date anchor outside the current safe window.** If a valid live Journal Day from a future expanded fixture or an inherited safe result is targeted and its month is outside the current loaded/safe materialization range, normalize the Almanac window to exactly that live date's month: `month=<date month>`, omit `through` because it equals `month`, preserve safe `date=<live date>`, and focus that chapter. Do not enumerate or render intervening empty months.
4. **No live target.** A syntactically valid distant `date` that does not identify a live fictional Journal Day is removed. The nearest existing valid Almanac boundary remains; the prototype never invents a day or expands a range for it.
5. **Jump to a distant month.** Jump continues to reset the window to exactly the chosen target month, without materializing intervening months. If that target has no declared live fixtures, render the quiet sole-month empty state. Pagination from an out-of-fixture target must not imply that thousands of unknown months are known empty; return to the declared newest days or another explicit jump before using the fixed May-boundary evidence sequence.
6. **Inverted and mixed-range state.** After applying a valid live-date normalization, `through` cannot remain from the previous window. Otherwise `through > month` still resets to a single valid month, and an in-fixture range older than May still clamps to May.
7. **Bounded work invariant.** No single route parse, Back/Forward transition, Search return, Calendar arrival, Jump, or detail return may create work proportional to the calendar distance from `0001` or `9999`. For the current dataset, ordinary loaded-range materialization is bounded to May–August 2026.
8. **Privacy and evidence boundary.** Normalization uses only safe date keys and never puts title, query, source text, caption, scroll position, or focus selector in the URL. These rules demonstrate bounded synthetic UI behavior only; they do not select or verify the production pagination/data-access architecture.

Required QA additions:

- `view=almanac&month=2026-08&through=0001-01` canonicalizes to `through=2026-05` without rendering pre-May month nodes;
- a distant empty jump, such as year `9999`, creates exactly one quiet empty target month and no intervening nodes;
- returning from a synthetic valid live-date result outside the current window creates a one-month window anchored to that date rather than an expanded millennia-long range;
- an equally distant non-live date is removed without range expansion;
- Back/Forward, direct reload, and full-day return preserve the normalized bounded window;
- no copy implies that May 2026 is the product's earliest supported date.
