# Life in Days calendar UI prototype v2

> **Throwaway UI prototype · simulated data · no integrations connected**

This version applies the selected **Margin Companion** treatment to all three calendar directions. It replaces separate generated-title, generated-summary, and generated-tag cards with one calm reading composition:

- the generated title and summary form the primary prose column;
- one compact margin rail explains AI provenance once;
- topics appear as a plain semantic list rather than pills;
- one **Manage reflection** action opens editing and update controls away from reading mode.

The authentic source journals remain separate below the generated reflection. A real Daily Photo remains visually and semantically distinct from generated artwork.

## Run and check

From this directory:

```sh
npm run check:v2
npm run prototype
```

Then open one of the versioned routes:

- [Archive Desk](http://127.0.0.1:4173/index-v2.html?variant=A) — `index-v2.html?variant=A`
- [Living Mosaic](http://127.0.0.1:4173/index-v2.html?variant=B) — `index-v2.html?variant=B`
- [Monthly Almanac](http://127.0.0.1:4173/index-v2.html?variant=C) — `index-v2.html?variant=C`

Use the prototype switcher or the left and right arrow keys to compare directions. Arrow keys keep their native behavior while focus is inside a form, dialog, gallery control, or calendar day.

## Shared Margin Companion behavior

Reading mode deliberately avoids per-field cards, repeated AI badges, tag pills, divider-heavy controls, and persistent Edit links. Instead it presents:

1. one title and summary as editorial prose;
2. one group-level provenance label, such as **AI reflection · Based on journal text**;
3. a short Topics list in the margin;
4. one quiet **Manage reflection** button.

When a generated field is stale, the reflection states that an update is available while confirming that the current version is unchanged. **Review update** opens a comparison inside the management sheet; it never replaces personal edits silently.

The same information hierarchy adapts by direction:

| Key | Direction | v2 treatment |
| --- | --- | --- |
| A | Archive Desk | Keeps the month and persistent selected-day preview together. The full day uses a restrained desk-sized prose column and margin rail. |
| B | Living Mosaic | Preserves the image-led month and immersive day opening. The reflection receives more generous type and whitespace without competing with the gallery. |
| C | Monthly Almanac | Places the reflection at the opening of each continuous book-like chapter, followed by media and expandable authentic source journals. |

On narrow screens the provenance, prose, topics, and management action become a single readable column. The margin rail does not become a stack of cards.

## Manage reflection sheet

**Manage reflection** opens a right-side sheet on larger screens and a full-width sheet on narrow screens. The sheet keeps Title, Summary, and Tags independently manageable and shows whether each field is generated, accepted, edited and protected, or stale with an update available.

The sheet supports these simulated interactions:

- edit Title, Summary, or Tags independently;
- save a protected personal version;
- review the current summary beside the newest generated suggestion;
- keep the current version, edit it, or use the suggested version;
- resume automatic summary updates through an explicit action;
- invoke placeholder actions for regeneration and generation details.

Accessibility behavior implemented in the prototype includes a labeled modal dialog, background `inert` state while the sheet is open, initial focus placement, a contained Tab sequence, Escape-to-close, and focus restoration to the originating **Manage reflection** button. Visible focus styles and semantic topic lists are retained across the responsive layouts.

## Prototype boundary

Everything is fictional and held in browser memory. No personal journal, real photo, provider, webhook, Telegram bot, VoiceNotes account, database, authentication, persistence, AI call, hosting, or deployment is connected. Refreshing the page resets simulated changes.

This v2 exploration is not production code. It demonstrates interaction and hierarchy only; it does not verify ingestion, privacy enforcement, storage, backup, or model behavior.

## v2 review artifacts

The captured and visually compared artifacts are under `docs/prototypes/v2/`:

- `archive-desk-v2.png`
- `living-mosaic-v2.png`
- `monthly-almanac-v2.png`
- `manage-reflection-v2.png`
- `reflection-update-v2.png`
- `reflection-mobile-v2.png`

The combined source-versus-implementation comparison is `margin-companion-v2-design-qa-comparison.png`. The executed review record is [`../../design-qa-v2.md`](../../design-qa-v2.md).
