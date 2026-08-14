# Life in Days v4 — design QA

Date: 2026-08-13  
Final result: passed

## Comparison target

Two approved desktop states are the visual truth for this build:

1. Default/no-selection Calendar: approved generated reference image supplied during review; the machine-local source file was not retained in the repository.
2. Selected-day Museum Margin: approved generated reference image supplied during review; the machine-local source file was not retained in the repository.

Implementation evidence:

1. `docs/prototypes/v4/living-mosaic-landing-v4.png`
2. `docs/prototypes/v4/living-mosaic-museum-margin-v4.png`
3. `docs/prototypes/v4/living-mosaic-detail-tablet-v4.png`
4. `docs/prototypes/v4/living-mosaic-detail-mobile-v4.png`

Side-by-side comparison evidence:

1. `docs/prototypes/v4/living-mosaic-landing-v4-design-qa-comparison.png`
2. `docs/prototypes/v4/living-mosaic-museum-margin-v4-design-qa-comparison.png`

## Capture normalization

- Source images: 1487 × 1058 px.
- Browser implementation captures: 1404 × 1059 px at a 1404 × 1059 CSS viewport and density factor 1.
- Responsive captures: 820 × 1000 px tablet and 390 × 844 px mobile, each at matching CSS viewport dimensions and density factor 1.
- Comparison boards normalize each source and implementation to 744 × 529 px before placing them side by side. The 83 px source/implementation width difference is an in-app Browser viewport limit, not horizontal application overflow.
- Browser checks reported `scrollWidth === innerWidth` at desktop, 820 px tablet, and 390 px mobile.
- State, data, light theme, and August 2026 month match the approved references. The prototype warning bar is intentionally retained because this artifact must remain unmistakably throwaway.

## Comparison history

### Pass 1 — actionable findings

- [P2] Large selected image had paper bands above and below it because `object-fit: contain` was used in the 4:5 Museum frame. This made the media feel smaller than the approved immersive reference.
- [P2] The selected photo caption included the fixture phrase “fictional caption,” which read like prototype scaffolding inside the product experience.
- [P2] Default Calendar cells were taller than the approved visual and pushed the last row below the intended first-screen composition.

Fixes:

- changed the Museum image to `object-fit: cover` and set the rain-window fixture focal point to the right so the cup remains visible;
- removed “fictional caption” from the visible media captions while retaining the global simulated-data banner;
- reduced default Mosaic tile height to `clamp(100px, 7.7vw, 142px)`.

### Pass 2 — post-fix evidence

The recaptured selected state at `docs/prototypes/v4/living-mosaic-museum-margin-v4.png` shows an immersive uninterrupted figure, external source/title/date/count/caption treatment, and no watermark, label, description, control, or gradient over image pixels. The recaptured default state at `docs/prototypes/v4/living-mosaic-landing-v4.png` fits the month more closely to the approved density and retains a full-width no-selection composition.

No actionable P0, P1, or P2 differences remain.

## Required fidelity surfaces

### Fonts and typography

- Existing Georgia editorial display type and Inter/system UI type are preserved from v3 and closely match the approved serif/sans hierarchy.
- Month, title, placard source, date, counts, and caption maintain the same visual order as the references.
- Placard title supports up to four lines; summary/caption remains outside the image and is not visually clamped.

### Spacing and layout rhythm

- Default landing uses the full width with no placeholder detail rail.
- Selected desktop uses a 37% Calendar track, one vertical divider, large media, and external placard.
- Selection is an external keyline rather than an image overlay.
- The implementation includes a small “Selected Journal Day” orientation eyebrow and a deeper “Open full Journal Day” action. These are intentional interaction affordances absent from the static mock, and they do not disrupt the core hierarchy.

### Colors and visual tokens

- Existing warm paper, forest green, muted ink, and line tokens match the approved direction.
- No new provenance color system was introduced; generated/authentic meaning is communicated by external text.
- Light-theme contrast remains consistent with v3. Dark theme inherits the same token model.

### Image quality and asset fidelity

- Existing rasterized SVG fixture assets are source assets from v3; no placeholder, CSS art, handcrafted replacement image, or image-overlay UI was introduced.
- Calendar tiles use cover crops; the Museum figure uses a deliberate focal crop for the rain-window fixture.
- Real-photo cover precedence remains enforced by `calendarCover`.

### Copy and content

- Calendar image tiles contain no source, title, count, tag, caption, or status copy.
- Journal-only cells retain title plus journal count.
- The selected Margin uses `Telegram photo` and `AI-generated artwork` as explicit provenance labels.
- Prototype/simulation context stays in the global banner rather than leaking into the memory caption.

## Focused region comparison

The selected-day comparison board is the focused evidence because provenance placement and image cleanliness are the decision-critical region. It confirms that the implementation moves source and description completely outside the image while preserving the Calendar beside it. No additional crop was needed because the relevant tile, large figure, and placard are readable at the normalized comparison size.

## Browser-rendered verification

Primary interactions tested in the Codex in-app Browser:

- default route has no `date` parameter, no selected cell, and no detail region;
- selecting 13 August updates the URL and opens the `Telegram photo` Museum Margin;
- closing details removes the `date` parameter and restores focus to 13 August;
- opening the full Journal Day adds `screen=day` and renders its existing Back control;
- selecting 11 August shows `AI-generated artwork` in the Margin while its tile visible text remains only `11`;
- responsive selected state uses a 620 px right sheet at an 820 px viewport;
- responsive selected state uses a 390 px full-width sheet at a 390 px viewport;
- no horizontal document overflow at reviewed desktop, tablet, or mobile widths;
- browser console warnings/errors checked: none.

## Residual P3 polish

- At very small mobile widths, the prototype warning text truncates to protect the product header; this is acceptable for the throwaway banner.
- The static reference uses photographic rain imagery while the prototype reuses its established fictional illustrated fixture. This is an intentional asset-boundary difference, not a layout or provenance regression.

## Implementation checklist

- [x] Image-only real-photo and artwork Calendar tiles.
- [x] Journal-only paper treatment.
- [x] No-selection default Calendar.
- [x] Selected-day Museum Margin with external provenance.
- [x] Close/Escape/Back state recovery and URL reconstruction.
- [x] Full Journal Day handoff.
- [x] Responsive right sheet and full-width mobile state.
- [x] Syntax check, console check, comparison captures, and design-QA pass.

final result: passed
