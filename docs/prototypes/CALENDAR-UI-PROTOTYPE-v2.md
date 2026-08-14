# Life in Days — calendar UI prototype v2

Status: **active throwaway design exploration on branch `prototype/calendar-ui-v2-margin-companion`**

The runnable prototype is documented in [`prototypes/calendar-ui/README-v2.md`](../../prototypes/calendar-ui/README-v2.md). It carries the selected **Margin Companion** reflection pattern across all three calendar structures while keeping their navigation and memory-recall hypotheses distinct.

## Design decision under review

The v2 hypothesis is that generated interpretation should read like a quiet editorial companion, not an administrative form. A Journal Day therefore presents its generated title and summary as one prose composition, with a single AI provenance statement, a plain Topics list, and one **Manage reflection** action in a narrow margin rail.

The authentic record remains downstream and separately labeled. Generated interpretation never masquerades as source truth, but provenance is stated once rather than repeated in a badge on every field.

## Routes and structural differences

Run the local prototype and use these versioned routes:

| Key | Direction | Route | Structural hypothesis |
| --- | --- | --- | --- |
| A | Archive Desk | `index-v2.html?variant=A` | A month calendar plus persistent selected-day preview makes revisiting fast while the full Journal Day stays calm and readable. |
| B | Living Mosaic | `index-v2.html?variant=B` | An image-led month and spacious day composition create stronger visual recognition without obscuring provenance. |
| C | Monthly Almanac | `index-v2.html?variant=C` | Continuous, book-like chapters make a month feel reflective; each chapter opens with the Margin Companion before media and authentic journals. |

All routes use the same fictional fixture data, so differences in hierarchy and emotional tone can be compared without content drift.

## Shared Margin Companion contract

- Reading mode has no separate generated Title, Summary, and Tags boxes.
- Title and summary occupy the primary prose column.
- One margin rail carries the group-level AI origin, Topics list, and **Manage reflection** action.
- Topics are plain list items, not pill controls.
- A stale generated field announces that a suggestion is available and that the current protected version is unchanged.
- **Review update** opens a current-versus-newest comparison; generated content is never silently substituted.
- On narrow screens the margin information and prose collapse into a linear reading order rather than card stacks.

## Manage reflection behavior

The management surface is intentionally separated from reading mode. It opens as a right-side sheet on larger viewports and a full-width sheet on narrow viewports. Title, Summary, and Tags retain independent status and edit actions.

The simulated stale-summary flow offers three choices: keep the current protected version, edit the current version, or use the newest generated suggestion. Saving an edit protects that field from silent refresh. Automatic updates resume only when that action is selected explicitly.

The implemented interaction model includes:

- dialog naming and modal semantics;
- focus entry into the sheet;
- keyboard focus containment while it is open;
- Escape-to-close;
- an inert background;
- focus restoration to the originating **Manage reflection** control;
- visible focus treatment and responsive single-column behavior.

## Run and static check

From `prototypes/calendar-ui/`:

```sh
npm run check:v2
npm run prototype
```

The first command syntax-checks the versioned application and local server. The second serves the prototype at `http://127.0.0.1:4173/`; append any route from the table above.

## Visual review artifacts

The following v2 image files were captured in [`docs/prototypes/v2/`](v2/) and compared against the selected reference:

- `archive-desk-v2.png`
- `living-mosaic-v2.png`
- `monthly-almanac-v2.png`
- `manage-reflection-v2.png`
- `reflection-update-v2.png`
- `reflection-mobile-v2.png`

The selected visual reference is [`option-2-margin-companion-v2-reference.png`](v2/option-2-margin-companion-v2-reference.png).
The combined comparison is [`margin-companion-v2-design-qa-comparison.png`](v2/margin-companion-v2-design-qa-comparison.png), and the executed review record is [`../../design-qa-v2.md`](../../design-qa-v2.md).

## Scope boundary

This is a dependency-light, in-memory prototype using synthetic journal text and synthetic image fixtures. It does not connect to VoiceNotes, Telegram, an AI provider, a database, authentication, storage, backup, Cloudflare, Hetzner, or `life.arunp.in`. It neither sends data nor persists simulated changes.

No ingestion, privacy guarantee, AI behavior, production architecture, hosting, deployment, or operational readiness is implemented or verified by this artifact. Production code remains a separate, approval-gated implementation step.
