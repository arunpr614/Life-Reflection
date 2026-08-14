# Life in Days v2 — design QA

Status: **Passed for the throwaway prototype scope**

Reviewed: 2026-08-13

## Comparison set

- Selected source: [`docs/prototypes/v2/option-2-margin-companion-v2-reference.png`](docs/prototypes/v2/option-2-margin-companion-v2-reference.png)
- Combined comparison: [`docs/prototypes/v2/margin-companion-v2-design-qa-comparison.png`](docs/prototypes/v2/margin-companion-v2-design-qa-comparison.png)
- A: [`docs/prototypes/v2/archive-desk-v2.png`](docs/prototypes/v2/archive-desk-v2.png)
- B: [`docs/prototypes/v2/living-mosaic-v2.png`](docs/prototypes/v2/living-mosaic-v2.png)
- C: [`docs/prototypes/v2/monthly-almanac-v2.png`](docs/prototypes/v2/monthly-almanac-v2.png)
- Management: [`docs/prototypes/v2/manage-reflection-v2.png`](docs/prototypes/v2/manage-reflection-v2.png)
- Update review: [`docs/prototypes/v2/reflection-update-v2.png`](docs/prototypes/v2/reflection-update-v2.png)
- Mobile: [`docs/prototypes/v2/reflection-mobile-v2.png`](docs/prototypes/v2/reflection-mobile-v2.png)

## Fidelity result

The v2 implementation carries the selected Margin Companion pattern into all three existing calendar structures:

- generated title and summary read as one editorial object;
- one quiet vertical rule separates prose from a narrow provenance and topics rail;
- provenance appears once for the reflection group;
- topics are plain text rather than pills;
- one low-emphasis **Manage reflection** action replaces visible per-field Edit controls;
- authentic source journals remain a clearly separate downstream section.

The three directions remain materially different. Archive Desk keeps its persistent archive rail and restrained title scale. Living Mosaic uses the most spacious, image-led treatment and largest title. Monthly Almanac turns the same hierarchy into a chapter opening before its media.

Intentional differences from the generated reference are product-correct rather than fidelity defects. The fixture keeps two real Daily Photos instead of inventing a third, does not place Generated Artwork in the real-photo strip, and does not turn a text source journal into a notebook photograph. The captured day also demonstrates the required stale-summary state in the companion rail.

## Interaction and responsive checks

Targeted browser QA covered:

- A, B, and C at 1440 × 1024;
- the stacked reflection at 390 × 844;
- management-sheet reflow at 320 px with no horizontal overflow;
- light and dark theme token application;
- management-sheet background isolation with `inert` and `aria-hidden`;
- contained Tab navigation, Escape-to-close, and focus restoration;
- Title edit and save returning focus to the edited field row;
- stale-summary comparison with explicit keep, edit, and use actions.

Automated DOM checks found zero rendered legacy generated-field cards, zero reading-mode Title/Summary/Tags Edit buttons, one Manage action per reflection, no more than three reading-mode topics, and no horizontal overflow in the checked viewports. Browser console warning/error capture was empty. All loaded CSS, JavaScript, and image assets were local prototype files.

## Static checks

`npm run check:v2` passed, and `git diff --check` reported no whitespace errors.

This result validates visual fidelity and the targeted prototype interactions only. It is not a production accessibility certification, integration test, privacy verification, deployment verification, or usability-study result.
