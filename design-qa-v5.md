# Life in Days v5 design QA

Date: 2026-08-13

Prototype: `prototypes/calendar-ui/index-v5.html`
Review scope: compact privacy disclosure, Settings information hierarchy, responsive behavior, and v4 regression checks

## Comparison target and normalization

- Source visual truth: `/var/folders/qk/nxm5t7y94tsdz3vllht0p0cw0000gp/T/codex-clipboard-b878246b-7f88-4811-ae84-ef0d74d02cc1.png` (`2598 × 510` physical pixels, user-provided crop of the oversized disclosure).
- Normalized source state: `docs/prototypes/v5/privacy-reference-v4-normalized.png` (`1280 × 720`, CSS viewport `1280 × 720`, device scale factor 1, light theme, full Journal Day).
- Implementation state: `docs/prototypes/v5/privacy-result-v5-normalized.png` (`1280 × 720`, CSS viewport `1280 × 720`, device scale factor 1, light theme, same full Journal Day).
- Same-input comparison: `docs/prototypes/v5/privacy-density-comparison-v5.png` (`1400 × 1740` comparison sheet containing both normalized states).

The user crop documents the problem area precisely; the normalized v4 and v5 captures provide equivalent route, state, viewport, theme, and density for judging the integrated page. A focused privacy-region comparison was not separately required because the cue, surrounding heading, and media hierarchy are legible in the same-input full-view sheet.

## Full-view comparison findings

No actionable P0, P1, or P2 differences remain.

- Layout and spacing: the requested full-width sage card is absent. Privacy occupies one contextual line beside `Daily Photos`, leaving the photograph and day-management hierarchy dominant.
- Typography: v5 keeps the existing serif editorial hierarchy and raises meaningful helper/action text to a readable 12px floor. The cue remains visually quiet but discoverable.
- Colors and tokens: v5 reuses the existing warm-paper, deep-ink, forest, line, and focus tokens. No new callout color competes with authentic media.
- Image quality: the same synthetic source image, crop, aspect ratio, and resolution are retained; no new illustration, placeholder, custom SVG, or CSS art was introduced.
- Copy and content: the cue is the precise approved promise, `Real photos never go to AI · AI & privacy`; it does not imply zero knowledge or provider invisibility.
- Affordance: `AI & privacy` has a 44px effective touch target and opens the complete disclosure.

## Settings screen review

| State | Evidence | Result |
| --- | --- | --- |
| Settings overview | `docs/prototypes/v5/settings-overview-v5.png` | Four scan-friendly categories in one restrained reading panel. |
| Integrations | `docs/prototypes/v5/settings-integrations-v5.png` | Exact tag and activation behavior are visible; identifiers, secret values, and callback paths are absent. |
| AI and privacy | `docs/prototypes/v5/settings-ai-privacy-v5.png` | Clear three-lane disclosure; independent providers remain disabled truthfully; hosted-provider retention and fixed budget are explicit. |
| Compact Journal Day cue | `docs/prototypes/v5/journal-day-privacy-note-v5.png` | The old card is gone and the disclosure entry point is contextual. |
| Appearance on mobile | `docs/prototypes/v5/settings-appearance-mobile-v5.png` | Non-overview hero is removed, controls appear above the fold, and tap targets remain practical. |
| More on mobile | `docs/prototypes/v5/settings-more-mobile-v5.png` | Add journal, Settings, and separate management destinations remain reachable in a four-item bottom-navigation model. |

## Comparison history

### Pass 1 — blocked

- P2 mobile hierarchy: non-overview Settings repeated the global Settings hero before the section heading, delaying the first control.
- P2 legibility: privacy, status, provider helper, budget, and More supporting text fell to 9–10px.
- P2 product-copy precision: `Photos stay private` was broader than the approved no-photo-to-AI boundary.
- P2 content completeness: hosted-provider retention and Suppressions were absent; Telegram showed a masked sender beside a not-connected state.
- P2 responsive navigation: at 901–960px the unified header hid primary navigation before the fixed compact-navigation rules applied.

### Fixes applied

- hide the global Settings hero on non-overview mobile screens and reduce the local title scale;
- raise functional helper text to 12px and status/eyebrow text to at least 10px;
- use `Real photos never go to AI` and give the link a 44px effective target;
- add the pending hosted-provider retention disclosure and Suppressions destination;
- replace the contradictory Telegram sender fixture with `Not configured in prototype · Never displayed in browser`.
- align the complete four-item fixed-navigation treatment with the 960px unified-header breakpoint.

### Pass 2 — passed

Post-fix evidence is in the six v5 screen captures and the final normalized comparison sheet. No P0/P1/P2 finding remains.

## Interaction checks

- Overview rows open the correct URL-backed section.
- the compact privacy cue opens AI and privacy Settings;
- browser Back restores `view=calendar&date=2026-08-13&screen=day`;
- Settings URLs do not retain irrelevant day, screen, search, or Almanac rail state;
- both provider selects remain disabled and read `Model evaluation not completed`;
- device, Light, and Dark controls update immediately; reload preserves the preference;
- mobile More opens as a modal sheet, closes with Escape, and restores focus to More;
- default Calendar and selected Museum Margin still render and open correctly.

## Responsive and diagnostic checks

| Viewport | Check | Result |
| --- | --- | --- |
| 1280 × 720/1400 | desktop Settings, Calendar, Museum Margin, Journal Day | Passed |
| 820 × 900 | horizontal Settings navigation and content | Passed; `scrollWidth === innerWidth` |
| 930 × 800 | compact navigation across the former 901–960px gap | Passed; fixed four-column navigation |
| 390 × 844 | focused Settings and More sheet | Passed; `scrollWidth === innerWidth` |
| 320 × 740 | narrow Integration screen | Passed; `scrollWidth === innerWidth` |

Browser console errors and warnings observed during the reviewed flows: none.

## Boundary

This is a visual and interaction review of a simulated frontend prototype. It is not evidence of connected integrations, secret handling on a server, provider qualification, deployed security controls, persistence, backup, or production accessibility certification.

final result: passed
