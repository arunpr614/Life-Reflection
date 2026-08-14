/*
 * PROTOTYPE ONLY — three Life in Days UI directions, switchable with ?variant=.
 * All data and mutations are simulated in memory. There are no integrations.
 */

const root = document.querySelector("#prototype-root");
const modalRoot = document.querySelector("#modal-root");
const toastRegion = document.querySelector("#toast-region");

const VARIANTS = {
  A: {
    name: "Archive Desk",
    prompt: "Does a persistent day preview make calendar reflection faster without feeling administrative?",
  },
  B: {
    name: "Living Mosaic",
    prompt: "Can a visually immersive month remain legible, calm, and honest about provenance?",
  },
  C: {
    name: "Monthly Almanac",
    prompt: "Does a book-like continuous month create a more reflective experience than record-by-record navigation?",
  },
};

const SYNTHETIC_NOTICE = "Fictional sample written only for this design prototype.";
const today = "2026-08-13";

const days = {
  "2026-08-02": {
    date: "2026-08-02",
    title: "A few words before sleep",
    titleStatus: "AI-generated",
    summary: "A deliberately sparse fictional fixture used to review the short-journal artwork warning.",
    summaryStatus: "AI-generated",
    tags: ["night", "rain"],
    tagsStatus: "AI-generated",
    photos: [],
    artworks: [],
    journals: [
      {
        id: "v-02",
        kind: "VoiceNotes journal",
        title: "Before sleep — synthetic fixture",
        timestamp: "2 Aug 2026, 10:18 pm IST",
        status: "Upstream current",
        text: `${SYNTHETIC_NOTICE} Rain stopped. I closed the window and slept earlier than usual.`,
      },
    ],
  },
  "2026-08-04": {
    date: "2026-08-04",
    title: "The rain that stayed at the edge",
    titleStatus: "AI-generated",
    summary:
      "A short fictional entry notices the changing light before a storm and the relief of finishing one small task. The source journal is still available below; this generated summary is only a navigational aid.",
    summaryStatus: "AI-generated",
    tags: ["rain", "quiet work", "evening"],
    tagsStatus: "AI-generated",
    photos: [],
    artworks: [],
    imageFailed: true,
    attention: "Image unavailable",
    journals: [
      {
        id: "v-04",
        kind: "VoiceNotes journal",
        title: "Before the storm — synthetic fixture",
        timestamp: "4 Aug 2026, 6:42 pm IST",
        status: "Upstream current",
        text: `${SYNTHETIC_NOTICE} The sky held itself very still this evening. I closed the last open task, made tea, and watched the trees wait for rain.`,
      },
    ],
  },
  "2026-08-06": {
    date: "2026-08-06",
    title: "Colour carried home",
    titleStatus: "Accepted",
    summary:
      "A fictional morning market visit becomes a small study in colour, familiar rituals, and the pleasure of carrying something bright back home.",
    summaryStatus: "Edited",
    tags: ["market", "flowers", "morning"],
    tagsStatus: "Accepted",
    photos: [
      {
        id: "p-market",
        src: "assets/photo-market-flowers.svg",
        alt: "Synthetic flower-market fixture with orange, cream, and red flowers under a green awning",
        caption: "A bright stop on the way home — fictional caption",
        timestamp: "6 Aug 2026, 9:16 am IST",
        isCover: true,
      },
    ],
    artworks: [],
    attention: "Review source update",
    conflict: true,
    journals: [
      {
        id: "v-06",
        kind: "VoiceNotes journal",
        title: "Market morning — synthetic fixture",
        timestamp: "6 Aug 2026, 10:03 am IST",
        status: "Correction differs from newest upstream revision",
        correction: true,
        text: `${SYNTHETIC_NOTICE} I stopped at the flower stall after breakfast. The table looked like a field compressed into one bright rectangle, and I brought home a small bundle.`,
      },
    ],
  },
  "2026-08-08": {
    date: "2026-08-08",
    title: "A useful kind of quiet",
    titleStatus: "AI-generated",
    summary:
      "A fictional journal-only day describes a slow morning, a reset of the room, and the satisfying calm that followed. There is enough source text to try a symbolic artwork, but none has been generated in this prototype yet.",
    summaryStatus: "AI-generated",
    tags: ["home", "reset", "quiet"],
    tagsStatus: "AI-generated",
    photos: [],
    artworks: [],
    journals: [
      {
        id: "u-08",
        kind: "Uploaded journal",
        title: "quiet-saturday.md",
        timestamp: "8 Aug 2026, 11:28 am IST",
        status: "Current displayed version",
        text: `${SYNTHETIC_NOTICE} I spent the morning putting the room back in order. Nothing dramatic happened, but the open window, clean desk, and unhurried breakfast made the whole day feel newly spacious.`,
      },
    ],
  },
  "2026-08-11": {
    date: "2026-08-11",
    title: "The garden after midnight",
    titleStatus: "AI-generated",
    summary:
      "A fictional late-night note reflects on an idea that arrived after the rest of the house grew quiet. The active cover is generated artwork because this Journal Day has no real Daily Photo.",
    summaryStatus: "AI-generated",
    tags: ["late night", "ideas", "garden"],
    tagsStatus: "AI-generated",
    photos: [],
    artworks: [
      {
        id: "a-night",
        src: "assets/art-night-bloom.svg",
        alt: "AI artwork for 11 August 2026",
        brief: "A symbolic midnight garden where luminous flowers appear along a narrow gold path; painterly and non-photorealistic.",
        created: "12 Aug 2026, 1:04 am IST",
        trigger: "01:00 Artwork Sweep",
        active: true,
      },
    ],
    journals: [
      {
        id: "v-11",
        kind: "VoiceNotes journal",
        title: "An idea after midnight — synthetic fixture",
        timestamp: "11 Aug 2026, 11:47 pm IST",
        status: "Upstream current",
        text: `${SYNTHETIC_NOTICE} An idea I had set aside returned after midnight. It felt less like a solution and more like finding a path through a dark garden, one step visible at a time.`,
      },
    ],
  },
  "2026-08-13": {
    date: "2026-08-13",
    title: "Rain, tea, and an unhurried evening",
    titleStatus: "Accepted",
    summary:
      "This fictional day moves from a sudden shower to an easy conversation over tea. The journals notice small sensory details—the wet trees, two cups on the balcony, and the sense that time had briefly widened. A manually edited summary is preserved here, even though a later source entry has made it stale. The authentic journals remain complete and separate below.",
    suggestedSummary:
      "A sudden monsoon shower changed the pace of a fictional workday. Later, two cups of tea on the balcony turned an ordinary evening into a spacious conversation. A second journal added the detail of city lights returning after the rain and the decision to leave tomorrow unplanned.",
    summaryStatus: "Stale",
    summaryProtected: true,
    tags: ["monsoon", "tea", "conversation", "home"],
    tagsStatus: "Accepted",
    photos: [
      {
        id: "p-rain",
        src: "assets/photo-rain-window.svg",
        alt: "Synthetic rain-window fixture with an amber room, wet glass, and blue-green trees",
        caption: "The shower arrived all at once — fictional caption",
        timestamp: "13 Aug 2026, 4:38 pm IST",
        isCover: true,
      },
      {
        id: "p-cups",
        src: "assets/photo-balcony-cups.svg",
        alt: "Synthetic balcony fixture with two cups, plants, and evening city lights",
        caption: "Two cups after the rain — fictional caption",
        timestamp: "13 Aug 2026, 7:21 pm IST",
        isCover: false,
      },
    ],
    artworks: [
      {
        id: "a-ribbons",
        src: "assets/art-rain-ribbons.svg",
        alt: "AI artwork for 13 August 2026",
        brief: "Curved ribbons of rain around a warm table with two cups; symbolic, intimate, painterly, and without recognizable people.",
        created: "13 Aug 2026, 8:12 pm IST",
        trigger: "Generate artwork now",
        active: true,
        stale: true,
      },
    ],
    attention: "Generated summary needs review",
    journals: [
      {
        id: "v-13",
        kind: "VoiceNotes journal",
        title: "Rain at the window — synthetic fixture",
        timestamp: "13 Aug 2026, 5:12 pm IST",
        status: "Upstream current",
        text: `${SYNTHETIC_NOTICE} The rain arrived suddenly, blurring the trees beyond the window. I stopped trying to finish everything at once, made tea, and listened until the room felt quieter than it had all week.`,
      },
      {
        id: "u-13",
        kind: "Uploaded journal",
        title: "evening-note.md",
        timestamp: "13 Aug 2026, 9:04 pm IST",
        status: "Current displayed version",
        text: `${SYNTHETIC_NOTICE} We carried two cups to the balcony after the shower. The city lights returned slowly. The conversation wandered, and for once I did not try to turn tomorrow into a plan.`,
      },
    ],
  },
};

const requestedVariant = new URLSearchParams(window.location.search).get("variant")?.toUpperCase();
const state = {
  variant: VARIANTS[requestedVariant] ? requestedVariant : "A",
  month: "2026-08",
  selectedDate: "2026-08-13",
  screen: "calendar",
  theme: "light",
  galleryIndex: {},
  generation: {},
  modal: null,
  focusAfterRender: null,
};

const html = (value = "") =>
  String(value).replace(
    /[&<>'"]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character],
  );

function dateParts(date) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

function longDate(date) {
  const { year, month, day } = dateParts(date);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function shortDate(date) {
  const { year, month, day } = dateParts(date);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function monthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", month: "long", year: "numeric" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

function shiftMonth(monthKey, delta) {
  const [year, month] = monthKey.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1 + delta, 1));
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
}

function datesForMonth(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: count }, (_, index) => `${year}-${String(month).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`);
}

function leadingCalendarCells(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const sundayFirst = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  return (sundayFirst + 6) % 7;
}

function activeArtwork(day) {
  return day?.artworks?.find((artwork) => artwork.active) || day?.artworks?.at(-1) || null;
}

function selectedPhoto(day) {
  if (!day?.photos?.length) return null;
  return day.photos.find((photo) => photo.isCover) || day.photos[0];
}

function calendarCover(day) {
  const photo = selectedPhoto(day);
  if (photo) return { ...photo, kind: "photo" };
  const artwork = activeArtwork(day);
  return artwork ? { ...artwork, kind: "artwork" } : null;
}

function dayCounts(day) {
  const photoCount = day?.photos?.length || 0;
  const journalCount = day?.journals?.length || 0;
  const photos = `${photoCount} ${photoCount === 1 ? "photo" : "photos"}`;
  const journals = `${journalCount} ${journalCount === 1 ? "journal" : "journals"}`;
  return { photoCount, journalCount, label: `${photos} · ${journals}` };
}

function accessibleDayName(date, day) {
  if (!day) return `${longDate(date)}, no Journal Day`;
  const { photoCount, journalCount } = dayCounts(day);
  const cover = calendarCover(day);
  const counts = `${photoCount} ${photoCount === 1 ? "photo" : "photos"}, ${journalCount} ${journalCount === 1 ? "journal" : "journals"}`;
  return `${longDate(date)}, ${counts}${cover?.kind === "artwork" ? ", AI artwork cover" : ""}${day.attention ? ", needs attention" : ""}`;
}

function populatedDates(monthKey = state.month) {
  return Object.keys(days)
    .filter((date) => date.startsWith(`${monthKey}-`))
    .sort();
}

function adjacentPopulatedDate(date, direction) {
  const list = Object.keys(days).sort();
  const index = list.indexOf(date);
  return list[index + direction] || null;
}

function combinedJournalText(day) {
  return day?.journals?.map((journal) => journal.text).join(" ") || "";
}

function meaningfulWordCount(day) {
  return combinedJournalText(day)
    .replace(SYNTHETIC_NOTICE, "")
    .trim()
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

function prototypeBanner() {
  return `
    <div class="prototype-banner" role="note">
      <span class="prototype-dot" aria-hidden="true"></span>
      <strong>Throwaway UI prototype</strong>
      <span>Simulated data · no persistence · no integrations connected</span>
    </div>`;
}

function brandMark() {
  return `
    <div class="brand-lockup" aria-label="Life in Days">
      <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
      <span><strong>Life in Days</strong><small>Private archive</small></span>
    </div>`;
}

function themeButton() {
  const next = state.theme === "light" ? "dark" : "light";
  return `<button class="icon-button theme-button" type="button" data-action="toggle-theme" aria-label="Use ${next} theme" title="Use ${next} theme">${state.theme === "light" ? "◐" : "☀"}</button>`;
}

function navigationRail(active = "calendar") {
  const navItem = (key, label, icon) => `
    <button type="button" class="nav-item ${active === key ? "is-active" : ""}" data-action="nav-placeholder" data-label="${label}" ${active === key ? 'aria-current="page"' : ""}>
      <span aria-hidden="true">${icon}</span><span>${label}</span>
    </button>`;

  return `
    <aside class="navigation-rail" aria-label="Archive navigation">
      ${brandMark()}
      <button class="upload-primary" type="button" data-action="open-upload"><span aria-hidden="true">＋</span> Upload journal</button>
      <nav aria-label="Primary">
        ${navItem("calendar", "Calendar", "▦")}
        ${navItem("timeline", "Timeline", "≋")}
        ${navItem("search", "Search", "⌕")}
      </nav>
      <div class="nav-section-label">Management</div>
      <nav aria-label="Management">
        ${navItem("history", "History", "↺")}
        ${navItem("trash", "Trash", "♲")}
        ${navItem("export", "Export", "⇩")}
        ${navItem("health", "System Health", "◌")}
        ${navItem("settings", "Settings", "⚙")}
      </nav>
      <div class="rail-spacer"></div>
      <div class="rail-privacy">
        <span aria-hidden="true">◈</span>
        <span><strong>Private by design</strong><small>No sharing or public links</small></span>
      </div>
    </aside>`;
}

function compactNavigation() {
  return `
    <nav class="compact-navigation" aria-label="Primary">
      <button class="is-active" type="button" data-action="nav-placeholder" data-label="Calendar"><span aria-hidden="true">▦</span>Calendar</button>
      <button type="button" data-action="nav-placeholder" data-label="Timeline"><span aria-hidden="true">≋</span>Timeline</button>
      <button type="button" data-action="nav-placeholder" data-label="Search"><span aria-hidden="true">⌕</span>Search</button>
      <button type="button" data-action="nav-placeholder" data-label="More"><span aria-hidden="true">•••</span>More</button>
    </nav>`;
}

function monthControls({ compact = false, headingId = "month-heading" } = {}) {
  return `
    <div class="month-controls ${compact ? "is-compact" : ""}">
      <div class="month-title-group">
        ${compact ? "" : '<p class="eyebrow">Your visual memory archive</p>'}
        <h1 id="${headingId}">${monthLabel(state.month)}</h1>
        ${compact ? "" : '<p class="month-timezone">Monday first · Journal Dates in Asia/Kolkata</p>'}
      </div>
      <div class="month-actions" aria-label="Calendar month controls">
        <button type="button" class="icon-button" data-action="previous-month" aria-label="Previous month">←</button>
        <button type="button" class="today-button" data-action="today">Today</button>
        <button type="button" class="icon-button" data-action="next-month" aria-label="Next month">→</button>
      </div>
    </div>`;
}

function calendarTile(date, mode) {
  const day = days[date];
  const cover = calendarCover(day);
  const { day: dayNumber } = dateParts(date);
  const classes = ["calendar-tile", `calendar-tile--${mode}`];
  if (day) classes.push("has-day");
  if (cover?.kind === "photo") classes.push("has-real-cover");
  if (cover?.kind === "artwork") classes.push("has-art-cover");
  if (day && !cover) classes.push("is-journal-only");
  if (day?.attention) classes.push("needs-attention");
  if (date === today) classes.push("is-today");
  if (date === state.selectedDate) classes.push("is-selected");

  const style = cover ? `style="--tile-image: url('${html(cover.src)}')"` : "";
  const counts = day ? dayCounts(day) : null;
  const action = day ? "select-day" : "empty-day";

  return `
    <button
      type="button"
      class="${classes.join(" ")}"
      data-action="${action}"
      data-date="${date}"
      data-calendar-date="${date}"
      role="gridcell"
      aria-selected="${date === state.selectedDate}"
      aria-label="${html(accessibleDayName(date, day))}"
      ${style}
    >
      <span class="tile-scrim" aria-hidden="true"></span>
      <span class="tile-topline">
        <span class="day-number">${dayNumber}</span>
        ${date === today ? '<span class="today-marker">Today</span>' : ""}
      </span>
      ${cover?.kind === "artwork" ? '<span class="badge badge-ai">AI artwork</span>' : ""}
      ${day?.imageFailed ? '<span class="image-failed"><span aria-hidden="true">↻</span> Image unavailable</span>' : ""}
      ${day && !cover && !day.imageFailed ? `<span class="paper-day"><strong>${html(day.title)}</strong><small>${counts.journalCount} ${counts.journalCount === 1 ? "journal" : "journals"}</small></span>` : ""}
      ${day && cover ? `<span class="tile-caption"><strong>${html(day.title)}</strong><small>${counts.label}</small></span>` : ""}
      ${day?.attention ? `<span class="attention-dot" title="${html(day.attention)}"><span aria-hidden="true">!</span><span class="sr-only">${html(day.attention)}</span></span>` : ""}
    </button>`;
}

function calendarGrid(mode = "desk") {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const leading = Array.from({ length: leadingCalendarCells(state.month) }, () => '<div class="calendar-spacer" aria-hidden="true"></div>').join("");
  const cells = datesForMonth(state.month).map((date) => calendarTile(date, mode)).join("");

  return `
    <div class="calendar-shell calendar-shell--${mode}">
      <div class="weekday-row" aria-hidden="true">${weekdays.map((weekday) => `<span>${weekday}</span>`).join("")}</div>
      <div class="calendar-grid" role="grid" aria-labelledby="month-heading-${mode}" aria-colcount="7">
        ${leading}${cells}
      </div>
      ${populatedDates().length ? "" : '<p class="empty-month-note">No journaled days in this month</p>'}
    </div>`;
}

function previewMedia(day) {
  const cover = calendarCover(day);
  if (day.imageFailed) {
    return `<div class="preview-media preview-media--failed"><span aria-hidden="true">↻</span><strong>Image unavailable</strong><button type="button" data-action="retry-image">Retry</button></div>`;
  }
  if (!cover) {
    return `<div class="preview-media preview-media--paper"><span class="paper-lines" aria-hidden="true"></span><strong>Journal-only day</strong><span>No cover image has been added.</span></div>`;
  }
  return `
    <div class="preview-media">
      <img src="${html(cover.src)}" alt="${html(cover.kind === "photo" ? cover.alt : `AI artwork for ${longDate(day.date).replace(/^\w+, /, "")}`)}" />
      ${cover.kind === "artwork" ? '<span class="badge badge-ai">AI artwork</span>' : '<span class="badge badge-source">Real Daily Photo</span>'}
    </div>`;
}

function dayPreview(day) {
  if (!day) {
    return `
      <div class="day-preview-empty">
        <span class="empty-glyph" aria-hidden="true">◇</span>
        <h2>Select a Journal Day</h2>
        <p>Your month stays in view while you browse. Empty dates remain quiet.</p>
      </div>`;
  }

  const counts = dayCounts(day);
  return `
    <div class="day-preview-content">
      <div class="preview-heading">
        <div><p class="eyebrow">Selected Journal Day</p><h2>${longDate(day.date)}</h2><p>${counts.label}</p></div>
        ${day.attention ? `<span class="status-chip status-attention">${html(day.attention)}</span>` : ""}
      </div>
      ${previewMedia(day)}
      <section class="preview-reflection" aria-labelledby="preview-reflection-title">
        <div class="section-kicker"><span>Generated reflection</span><span class="status-chip">${html(day.summaryStatus)}</span></div>
        <h3 id="preview-reflection-title">${html(day.title)}</h3>
        <p>${html(day.summary)}</p>
        <div class="tag-list">${day.tags.map((tag) => `<span>${html(tag)}</span>`).join("")}</div>
      </section>
      <div class="preview-sources">
        <span>Authentic sources</span>
        ${day.photos.length ? `<strong>${day.photos.length} Telegram ${day.photos.length === 1 ? "photo" : "photos"}</strong>` : ""}
        ${day.journals.map((journal) => `<strong>${html(journal.kind)}</strong>`).join("")}
      </div>
      <button type="button" class="primary-button open-day-button" data-action="open-day" data-date="${day.date}">Open full day <span aria-hidden="true">→</span></button>
    </div>`;
}

function renderVariantA() {
  const day = days[state.selectedDate];
  const page = state.screen === "day" && day ? dayDetail(day, "desk") : `
    <div class="desk-calendar-page">
      ${monthControls({ headingId: "month-heading-desk" })}
      <div class="desk-workspace">
        <section class="calendar-panel" aria-label="Month calendar">
          ${calendarGrid("desk")}
        </section>
        <aside class="day-preview" aria-label="Selected day preview">${dayPreview(day)}</aside>
      </div>
    </div>`;

  return `
    <div class="prototype-app variant-a">
      ${prototypeBanner()}
      <div class="app-frame">
        ${navigationRail("calendar")}
        <main id="prototype-main" class="variant-main" tabindex="-1">${page}</main>
      </div>
      ${compactNavigation()}
      ${prototypeSwitcher()}
    </div>`;
}

function mosaicTopbar() {
  return `
    <header class="mosaic-topbar">
      ${brandMark()}
      <nav aria-label="Primary">
        <button class="is-active" type="button" data-action="nav-placeholder" data-label="Calendar">Calendar</button>
        <button type="button" data-action="nav-placeholder" data-label="Timeline">Timeline</button>
        <button type="button" data-action="nav-placeholder" data-label="Search">Search</button>
      </nav>
      <div class="topbar-actions">${themeButton()}<button class="upload-quiet" type="button" data-action="open-upload">＋ Journal</button></div>
    </header>`;
}

function renderVariantB() {
  const day = days[state.selectedDate];
  const page = state.screen === "day" && day ? `
    <div class="mosaic-day-page">
      ${dayDetail(day, "mosaic")}
    </div>` : `
    <main id="prototype-main" class="mosaic-calendar-page" tabindex="-1">
      <section class="mosaic-intro">
        <div><p class="eyebrow">A private month in pictures</p><h1 id="month-heading-mosaic">${monthLabel(state.month)}</h1></div>
        <p>Recognize a day by its texture. Open it when you want the full, authentic record.</p>
      </section>
      <div class="mosaic-month-actions">
        <button type="button" class="icon-button" data-action="previous-month" aria-label="Previous month">←</button>
        <span>Monday first · Asia/Kolkata</span>
        <button type="button" class="today-button" data-action="today">Today</button>
        <button type="button" class="icon-button" data-action="next-month" aria-label="Next month">→</button>
      </div>
      ${calendarGrid("mosaic")}
      <section class="mosaic-boundary" aria-label="AI privacy boundary">
        <span aria-hidden="true">◈</span>
        <p><strong>Your photographs stay private.</strong> Only approved journal text may reach a Text Provider; an Artwork Provider receives a minimized Visual Brief, never a photo.</p>
      </section>
    </main>`;

  return `
    <div class="prototype-app variant-b">
      ${prototypeBanner()}
      ${mosaicTopbar()}
      ${page}
      ${compactNavigation()}
      ${prototypeSwitcher()}
    </div>`;
}

function chapterMedia(day) {
  const photos = day.photos || [];
  const artwork = activeArtwork(day);

  if (!photos.length && !artwork) {
    return `<div class="chapter-paper"><span aria-hidden="true">${dateParts(day.date).day}</span><p>No image for this Journal Day</p></div>`;
  }

  return `
    <div class="chapter-media ${photos.length > 1 ? "has-pair" : ""}">
      ${photos.map((photo) => `<figure><img src="${html(photo.src)}" alt="${html(photo.alt)}" /><figcaption><span class="badge badge-source">Telegram photo</span>${html(photo.caption)}</figcaption></figure>`).join("")}
      ${!photos.length && artwork ? `<figure class="chapter-art"><img src="${html(artwork.src)}" alt="${html(artwork.alt)}" /><figcaption><span class="badge badge-ai">AI artwork</span>Derived from a Visual Brief</figcaption></figure>` : ""}
    </div>`;
}

function almanacChapter(day) {
  const artwork = activeArtwork(day);
  return `
    <article class="almanac-chapter ${state.selectedDate === day.date ? "is-selected" : ""}" id="chapter-${day.date}" data-chapter-date="${day.date}" tabindex="-1">
      <header class="chapter-header">
        <div><p class="chapter-date">${longDate(day.date)}</p><h2>${html(day.title)}</h2></div>
        <div><span>${dayCounts(day).label}</span>${day.attention ? `<span class="status-chip status-attention">${html(day.attention)}</span>` : ""}</div>
      </header>
      ${chapterMedia(day)}
      <div class="chapter-reading">
        <section class="chapter-reflection" aria-labelledby="reflection-${day.date}">
          <div class="section-kicker"><span>Generated reflection</span><span class="status-chip">${html(day.summaryStatus)}</span></div>
          <h3 id="reflection-${day.date}">A concise orientation</h3>
          <p>${html(day.summary)}</p>
          <div class="tag-list">${day.tags.map((tag) => `<span>${html(tag)}</span>`).join("")}</div>
          ${artwork && day.photos.length ? `<details class="inline-artwork"><summary><span class="badge badge-ai">AI artwork</span> View derived artwork</summary><img src="${html(artwork.src)}" alt="${html(artwork.alt)}" /><p>Shown separately; it cannot replace a real-photo cover.</p></details>` : ""}
        </section>
        <section class="chapter-journals" aria-labelledby="journals-${day.date}">
          <div class="section-kicker"><span>Source journals · authentic record</span><span>${day.journals.length}</span></div>
          <h3 id="journals-${day.date}" class="sr-only">Source journals</h3>
          ${day.journals.map((journal, index) => `
            <details ${index === 0 ? "open" : ""}>
              <summary><strong>${html(journal.kind)}</strong><span>${html(journal.timestamp)}</span></summary>
              <p>${html(journal.text)}</p>
              <small>${html(journal.status)}</small>
            </details>`).join("")}
        </section>
      </div>
      <footer class="chapter-footer">
        <button type="button" class="text-button" data-action="open-upload" data-date="${day.date}">Upload journal for this date</button>
        <button type="button" class="text-button" data-action="view-provenance" data-date="${day.date}">View history & provenance</button>
      </footer>
    </article>`;
}

function almanacIndex() {
  return `
    <aside class="almanac-index">
      ${brandMark()}
      <div class="almanac-index-header">
        <button type="button" class="icon-button" data-action="previous-month" aria-label="Previous month">←</button>
        <strong id="month-heading-index">${monthLabel(state.month)}</strong>
        <button type="button" class="icon-button" data-action="next-month" aria-label="Next month">→</button>
      </div>
      ${calendarGrid("index")}
      <button class="upload-primary" type="button" data-action="open-upload">＋ Upload journal</button>
      <div class="almanac-legend">
        <span><i class="legend-real"></i>Real photo</span>
        <span><i class="legend-ai"></i>AI artwork</span>
        <span><i class="legend-paper"></i>Journal only</span>
      </div>
      <p class="almanac-timezone">Journal Dates use Asia/Kolkata</p>
    </aside>`;
}

function renderVariantC() {
  const monthDays = populatedDates().sort().reverse();
  return `
    <div class="prototype-app variant-c">
      ${prototypeBanner()}
      <div class="almanac-shell">
        ${almanacIndex()}
        <main id="prototype-main" class="almanac-reading" tabindex="-1">
          <header class="almanac-title-page">
            <div><p class="eyebrow">Volume 08 · 2026</p><h1>${monthLabel(state.month)}</h1></div>
            <div class="almanac-title-actions">${themeButton()}<button type="button" class="today-button" data-action="today">Today</button></div>
            <p>A private monthly book assembled from authentic photographs and journals. Generated interpretation is always labeled and kept apart.</p>
          </header>
          ${monthDays.length ? monthDays.map((date) => almanacChapter(days[date])).join('<div class="chapter-divider" aria-hidden="true">✦</div>') : '<div class="almanac-empty"><h2>No journaled days in this month</h2><p>The month remains part of the archive without being marked incomplete.</p></div>'}
          <footer class="book-end"><span aria-hidden="true">◇</span><p>End of ${monthLabel(state.month)}</p></footer>
        </main>
      </div>
      ${compactNavigation()}
      ${prototypeSwitcher()}
    </div>`;
}

function gallery(day) {
  const currentIndex = Math.min(state.galleryIndex[day.date] || 0, Math.max(day.photos.length - 1, 0));
  const currentPhoto = day.photos[currentIndex];
  const artwork = activeArtwork(day);

  return `
    <section class="day-section gallery-section" aria-labelledby="gallery-title-${day.date}">
      <div class="section-heading">
        <div><p class="eyebrow">Authentic media</p><h2 id="gallery-title-${day.date}">Daily Photos</h2></div>
        <span class="source-boundary">Real photos are never sent to AI</span>
      </div>
      ${currentPhoto ? `
        <div class="gallery-stage">
          <button type="button" class="gallery-image-button" data-action="open-photo" data-date="${day.date}" data-photo-id="${currentPhoto.id}" aria-label="View original: ${html(currentPhoto.alt)}">
            <img src="${html(currentPhoto.src)}" alt="${html(currentPhoto.alt)}" />
            ${currentPhoto.isCover ? '<span class="badge badge-cover">Calendar cover</span>' : ""}
            <span class="view-original">View original ↗</span>
          </button>
          <div class="gallery-caption">
            <span class="badge badge-source">Telegram photo</span>
            <strong>${html(currentPhoto.caption)}</strong>
            <span>Original Timestamp · ${html(currentPhoto.timestamp)}</span>
          </div>
        </div>
        <div class="gallery-thumbnails" aria-label="Daily Photos">
          ${day.photos.map((photo, index) => `
            <button type="button" class="gallery-thumbnail ${index === currentIndex ? "is-active" : ""}" data-action="select-photo" data-date="${day.date}" data-index="${index}" aria-label="Show Daily Photo ${index + 1} of ${day.photos.length}" ${index === currentIndex ? 'aria-current="true"' : ""}>
              <img src="${html(photo.src)}" alt="" />
              <span>${index + 1}</span>
            </button>`).join("")}
        </div>
        <div class="media-actions" data-prevent-variant-keys>
          <button type="button" class="text-button" data-action="move-photo" data-date="${day.date}" data-photo-id="${currentPhoto.id}" data-direction="-1">Move earlier</button>
          <button type="button" class="text-button" data-action="move-photo" data-date="${day.date}" data-photo-id="${currentPhoto.id}" data-direction="1">Move later</button>
          ${currentPhoto.isCover ? '<span class="quiet-label">Selected cover</span>' : `<button type="button" class="text-button" data-action="make-cover" data-date="${day.date}" data-photo-id="${currentPhoto.id}">Make calendar cover</button>`}
          <button type="button" class="text-button" data-action="change-date" data-date="${day.date}">Change Journal Date</button>
          <button type="button" class="text-button" data-action="download-placeholder">Download original</button>
          <button type="button" class="text-button is-danger" data-action="trash-placeholder">Move to Trash</button>
        </div>
        <details class="provenance-details">
          <summary>Photo provenance</summary>
          <dl><div><dt>Source</dt><dd>Telegram photo</dd></div><div><dt>Original Timestamp</dt><dd>${html(currentPhoto.timestamp)}</dd></div><div><dt>Journal Date</dt><dd>${shortDate(day.date)} · Asia/Kolkata</dd></div><div><dt>AI boundary</dt><dd>Photo bytes, metadata, identifiers, and derived descriptions never leave for AI.</dd></div></dl>
        </details>` : day.imageFailed ? `
          <div class="gallery-empty gallery-failed"><span aria-hidden="true">↻</span><h3>Image unavailable</h3><p>The Journal Day remains readable. This simulated media failure does not hide its date or journals.</p><button type="button" class="secondary-button" data-action="retry-image">Retry</button></div>` : `
          <div class="gallery-empty"><span aria-hidden="true">◇</span><h3>No Daily Photos</h3><p>Send a photo through the private Telegram bot to add it. Web photo upload is not part of MVP.</p></div>`}

      <div class="derived-artwork-block">
        <div class="section-heading compact-heading">
          <div><p class="eyebrow">Derived media</p><h3>Generated artwork</h3></div>
          ${artwork ? '<span class="badge badge-ai">AI artwork</span>' : '<span class="quiet-label">No artwork yet</span>'}
        </div>
        ${artwork ? `
          <div class="artwork-row">
            <img src="${html(artwork.src)}" alt="${html(artwork.alt)}" />
            <div>
              <div class="status-row"><span class="status-chip">Active version</span>${artwork.stale ? '<span class="status-chip status-attention">Based on an earlier journal version</span>' : ""}</div>
              <p>${html(artwork.brief)}</p>
              <small>Synthetic prototype · provider not selected · ${html(artwork.trigger)}</small>
              <div class="inline-actions"><button type="button" class="text-button" data-action="trigger-art" data-date="${day.date}">Regenerate artwork</button><button type="button" class="text-button" data-action="view-art-history">View versions</button><button type="button" class="text-button is-danger" data-action="trash-placeholder">Move to Trash</button></div>
            </div>
          </div>
          ${day.photos.length ? '<p class="artwork-cover-rule"><span aria-hidden="true">✓</span> A real Daily Photo remains the Calendar Cover.</p>' : ""}
          <details class="provenance-details"><summary>Artwork provenance & Visual Brief</summary><dl><div><dt>Trigger</dt><dd>${html(artwork.trigger)}</dd></div><div><dt>Created</dt><dd>${html(artwork.created)}</dd></div><div><dt>Provider/model</dt><dd>Synthetic prototype — not selected</dd></div><div><dt>Artwork input</dt><dd>Visual Brief only. No photo is used.</dd></div></dl><blockquote>${html(artwork.brief)}</blockquote><button type="button" class="text-button" data-action="regenerate-brief">Regenerate brief</button></details>` : artworkAction(day)}
      </div>
    </section>`;
}

function artworkAction(day) {
  const count = meaningfulWordCount(day);
  const generationStatus = state.generation[day.date];

  if (generationStatus) {
    const label = generationStatus === "waiting" ? "Waiting" : generationStatus === "in-progress" ? "In progress" : "Complete";
    return `
      <div class="generation-state" role="status">
        <span class="generation-orbit" aria-hidden="true"></span>
        <div><strong>${label}</strong><p>${generationStatus === "complete" ? "Synthetic artwork added to this in-memory Journal Day." : "You can keep reading authentic sources while this local simulation runs."}</p></div>
      </div>`;
  }

  return `
    <div class="artwork-empty-state">
      <p>A symbolic, non-photorealistic image can be created from a minimized Visual Brief. The Artwork Provider receives neither raw photos nor photo-derived data.</p>
      <button type="button" class="secondary-button" data-action="trigger-art" data-date="${day.date}" ${count < 5 ? "disabled" : ""}>Generate artwork now</button>
      ${count < 5 ? '<small>At least 5 meaningful journal words are needed.</small>' : count < 20 ? `<small>Only ${count} meaningful words are available. You will review a sparse-source warning first.</small>` : `<small>${count} meaningful journal words are available.</small>`}
    </div>`;
}

function generatedReflection(day) {
  const field = (name, label, value, status) => `
    <article class="generated-field ${status === "Stale" ? "is-stale" : ""}">
      <header><span>${label}</span><span class="status-chip ${status === "Stale" ? "status-attention" : ""}">${html(status)}</span></header>
      ${name === "title" ? `<h3>${html(value)}</h3>` : name === "tags" ? `<div class="tag-list">${value.map((tag) => `<span>${html(tag)}</span>`).join("")}</div>` : `<p>${html(value)}</p>`}
      <footer>
        <button type="button" class="text-button" data-action="edit-generated" data-date="${day.date}" data-field="${name}">Edit</button>
        ${status === "Stale" ? `<button type="button" class="text-button attention-action" data-action="review-suggestion" data-date="${day.date}" data-field="${name}">Review suggested update</button>` : ""}
      </footer>
    </article>`;

  return `
    <section class="day-section reflection-section" aria-labelledby="generated-title-${day.date}">
      <div class="section-heading">
        <div><p class="eyebrow">Derived from journal text</p><h2 id="generated-title-${day.date}">Generated reflection</h2></div>
        <span class="source-boundary">Editable · never source truth</span>
      </div>
      <div class="generated-fields">
        ${field("title", "AI-generated title", day.title, day.titleStatus)}
        ${field("summary", "AI-generated summary", day.summary, day.summaryStatus)}
        ${field("tags", "AI-generated tags", day.tags, day.tagsStatus)}
      </div>
    </section>`;
}

function sourceConflict(day) {
  if (!day.conflict) return "";
  return `
    <aside class="conflict-panel" aria-labelledby="conflict-title-${day.date}">
      <div class="conflict-icon" aria-hidden="true">≠</div>
      <div>
        <p class="eyebrow">Source revision conflict</p>
        <h3 id="conflict-title-${day.date}">Your Correction and the newest VoiceNotes revision differ</h3>
        <p>No personal journal text is auto-merged. Every source revision remains retained.</p>
        <button type="button" class="text-button" data-action="view-diff">Show differences</button>
        <div class="conflict-actions">
          <button type="button" class="secondary-button" data-action="resolve-conflict" data-date="${day.date}" data-choice="Keep the Correction">Keep the Correction</button>
          <button type="button" class="secondary-button" data-action="resolve-conflict" data-date="${day.date}" data-choice="Display the newest upstream revision">Display newest upstream revision</button>
          <button type="button" class="secondary-button" data-action="resolve-conflict" data-date="${day.date}" data-choice="Create a new Correction based on both">Create new Correction based on both</button>
        </div>
      </div>
    </aside>`;
}

function sourceJournals(day) {
  return `
    <section class="day-section sources-section" aria-labelledby="sources-title-${day.date}">
      <div class="section-heading">
        <div><p class="eyebrow">Authentic record</p><h2 id="sources-title-${day.date}">Source journals</h2></div>
        <button type="button" class="secondary-button" data-action="open-upload" data-date="${day.date}">＋ Upload journal</button>
      </div>
      ${sourceConflict(day)}
      <div class="journal-list">
        ${day.journals.map((journal) => `
          <article class="journal-card">
            <header>
              <div><span class="badge badge-source">${html(journal.kind)}</span>${journal.correction ? '<span class="badge badge-correction">Correction displayed</span>' : ""}<h3>${html(journal.title)}</h3></div>
              <button type="button" class="icon-button" data-action="journal-menu" aria-label="Manage ${html(journal.title)}">•••</button>
            </header>
            <p class="journal-text">${html(journal.text)}</p>
            <footer><span>Original Timestamp · ${html(journal.timestamp)}</span><span>${html(journal.status)}</span></footer>
            <div class="journal-actions"><button type="button" class="text-button" data-action="correct-text">Correct displayed text</button><button type="button" class="text-button" data-action="change-date" data-date="${day.date}">Change Journal Date</button><button type="button" class="text-button" data-action="view-provenance">Revisions & provenance</button></div>
          </article>`).join("")}
      </div>
    </section>`;
}

function privacyBoundary() {
  return `
    <aside class="privacy-boundary" aria-label="AI privacy boundary">
      <span class="privacy-seal" aria-hidden="true">◈</span>
      <div><h3>Authentic memories stay in their lane</h3><p>Approved journal text may go to the selected Text Provider. The Artwork Provider receives only a minimized Visual Brief. Real photos, thumbnails, metadata, identifiers, captions, and photo-derived descriptions never go to AI.</p></div>
    </aside>`;
}

function dayDetail(day, mode) {
  const previous = adjacentPopulatedDate(day.date, -1);
  const next = adjacentPopulatedDate(day.date, 1);
  const counts = dayCounts(day);
  return `
    <div class="day-detail day-detail--${mode}">
      <header class="day-detail-header">
        <button type="button" class="back-button" data-action="close-day"><span aria-hidden="true">←</span> Back to ${monthLabel(state.month)}</button>
        <div class="day-date-row">
          <div><p class="eyebrow">Journal Day · Asia/Kolkata</p><h1>${longDate(day.date)}</h1><p>${counts.label}</p></div>
          <div class="adjacent-days" aria-label="Adjacent populated Journal Days">
            <button type="button" class="icon-button" data-action="adjacent-day" data-date="${previous || ""}" aria-label="Previous populated Journal Day" ${previous ? "" : "disabled"}>←</button>
            <button type="button" class="icon-button" data-action="adjacent-day" data-date="${next || ""}" aria-label="Next populated Journal Day" ${next ? "" : "disabled"}>→</button>
          </div>
        </div>
        ${day.attention ? `<a class="attention-banner" href="#generated-title-${day.date}"><span aria-hidden="true">!</span><span><strong>${html(day.attention)}</strong><small>Authentic sources are unchanged.</small></span><span aria-hidden="true">→</span></a>` : ""}
      </header>
      <div class="day-detail-body">
        ${gallery(day)}
        ${generatedReflection(day)}
        ${sourceJournals(day)}
        ${privacyBoundary()}
        <section class="day-actions-section" aria-labelledby="day-actions-title-${day.date}">
          <div><p class="eyebrow">Manage this day</p><h2 id="day-actions-title-${day.date}">History and actions</h2></div>
          <div><button type="button" class="secondary-button" data-action="view-provenance">View day history</button><button type="button" class="secondary-button" data-action="open-upload" data-date="${day.date}">Upload journal</button><button type="button" class="secondary-button" data-action="export-placeholder">Export archive</button></div>
          <p>To add a Daily Photo, send it through your private Telegram bot. There is no web photo upload in MVP.</p>
        </section>
      </div>
    </div>`;
}

function prototypeSwitcher() {
  // The host check keeps this prototype-only chrome away from the intended production hostname.
  if (/^(life|www)\.arunp\.in$/i.test(window.location.hostname)) return "";
  const info = VARIANTS[state.variant];
  return `
    <div class="prototype-switcher" role="toolbar" aria-label="Prototype variants" data-prevent-variant-keys>
      <button type="button" data-action="previous-variant" aria-label="Previous UI direction">←</button>
      <button type="button" class="variant-label" data-action="show-variant-question" aria-label="About ${info.name}"><strong>${state.variant} — ${info.name}</strong><span>View design question</span></button>
      <button type="button" data-action="next-variant" aria-label="Next UI direction">→</button>
    </div>`;
}

function renderUploadModal() {
  const modal = state.modal;
  const date = modal.date || state.selectedDate || today;
  const isDuplicate = modal.stage === "review" && Object.values(days).some((day) => day.journals?.some((journal) => journal.text === modal.text));
  return `
    <div class="modal-backdrop" data-action="modal-backdrop">
      <section class="modal-card upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Manual capture</p><h2 id="upload-modal-title">Upload a journal</h2></div><button type="button" class="icon-button" data-action="close-modal" aria-label="Close upload dialog">×</button></header>
        ${modal.stage === "choose" ? `
          <div class="upload-fields">
            <label>Journal Date <input id="upload-date" type="date" value="${date}" max="${today}" data-action="upload-date" /></label>
            <p class="field-help">Day boundaries always use Asia/Kolkata. Historical backdating is allowed; future dates are not.</p>
            <label class="file-drop" for="journal-file"><span aria-hidden="true">⇧</span><strong>Choose one .txt or .md file</strong><small>UTF-8 · up to 1 MiB · no Word, PDF, or photo files</small><input id="journal-file" type="file" accept=".txt,.md,text/plain,text/markdown" data-action="journal-file" /></label>
            ${modal.error ? `<p class="form-error" role="alert">${html(modal.error)}</p>` : ""}
            <aside class="local-only-note"><span aria-hidden="true">◈</span><p>This prototype reads the file only in this browser tab and keeps it in memory. It makes no upload or network request.</p></aside>
          </div>` : modal.stage === "review" ? `
          <div class="upload-review">
            <dl><div><dt>File</dt><dd>${html(modal.fileName)}</dd></div><div><dt>Size</dt><dd>${Math.max(1, Math.round(modal.fileSize / 1024))} KiB</dd></div><div><dt>Journal Date</dt><dd>${longDate(date)} · Asia/Kolkata</dd></div><div><dt>Source</dt><dd>Uploaded journal</dd></div></dl>
            <div class="text-preview"><strong>Inert text preview</strong><pre>${html(modal.text.slice(0, 1800))}</pre>${modal.text.length > 1800 ? '<small>Preview shortened; the in-memory fixture keeps the complete text.</small>' : ""}</div>
            ${isDuplicate ? '<div class="duplicate-warning" role="alert"><strong>This exact text is already present.</strong><p>Cancel, or explicitly add the duplicate anyway.</p></div>' : ""}
            <div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancel</button><button type="button" class="primary-button" data-action="confirm-upload" data-force="${isDuplicate ? "true" : "false"}">${isDuplicate ? "Add duplicate anyway" : "Add journal"}</button></div>
          </div>` : `
          <div class="saving-state" role="status"><span class="generation-orbit" aria-hidden="true"></span><h3>In progress</h3><p>Simulating a durable save in memory…</p></div>`}
      </section>
    </div>`;
}

function renderPhotoModal() {
  const { day, photo } = state.modal;
  return `
    <div class="modal-backdrop lightbox-backdrop" data-action="modal-backdrop">
      <section class="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" tabindex="-1" data-modal-card>
        <header><div><span class="badge badge-source">Telegram photo</span><h2 id="lightbox-title">${html(photo.caption)}</h2><p>${longDate(day.date)} · ${html(photo.timestamp)}</p></div><button type="button" class="lightbox-close" data-action="close-modal" aria-label="Close original view">×</button></header>
        <img src="${html(photo.src)}" alt="${html(photo.alt)}" />
        <footer><p>Synthetic visual fixture · this is not a personal photograph.</p><span>Real originals open only on explicit request in the planned product.</span></footer>
      </section>
    </div>`;
}

function renderSuggestionModal() {
  const day = days[state.modal.date];
  return `
    <div class="modal-backdrop" data-action="modal-backdrop">
      <section class="modal-card suggestion-modal" role="dialog" aria-modal="true" aria-labelledby="suggestion-title" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Protected field · source changed</p><h2 id="suggestion-title">Review suggested summary</h2></div><button type="button" class="icon-button" data-action="close-modal" aria-label="Close review">×</button></header>
        <div class="diff-columns">
          <article><span class="status-chip status-attention">Your edited version · Stale</span><h3>Current summary</h3><p>${html(day.summary)}</p></article>
          <article><span class="status-chip">Generated suggestion</span><h3>Newest source revision</h3><p>${html(day.suggestedSummary || day.summary)}</p></article>
        </div>
        <p class="suggestion-note">Nothing changes until you choose. Your manually edited version is never overwritten silently.</p>
        <div class="modal-actions three-actions"><button type="button" class="secondary-button" data-action="keep-summary" data-date="${day.date}">Keep current version</button><button type="button" class="secondary-button" data-action="edit-generated" data-date="${day.date}" data-field="summary">Edit current version</button><button type="button" class="primary-button" data-action="use-summary" data-date="${day.date}">Use suggested version</button></div>
      </section>
    </div>`;
}

function renderSparseArtworkModal() {
  const day = days[state.modal.date];
  const count = meaningfulWordCount(day);
  return `
    <div class="modal-backdrop" data-action="modal-backdrop">
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="sparse-title" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Before generation</p><h2 id="sparse-title">The journal is very short</h2></div><button type="button" class="icon-button" data-action="close-modal" aria-label="Close artwork warning">×</button></header>
        <p>Only ${count} meaningful words are available. The result may be generic or miss important context.</p>
        <aside class="local-only-note"><span aria-hidden="true">◈</span><p>This simulation sends nothing. In the planned product, an Artwork Provider receives only the minimized Visual Brief—never raw journal text or a photo.</p></aside>
        <div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancel</button><button type="button" class="primary-button" data-action="confirm-art" data-date="${day.date}">Generate anyway</button></div>
      </section>
    </div>`;
}

function renderEditModal() {
  const day = days[state.modal.date];
  const field = state.modal.field;
  const value = field === "tags" ? day.tags.join(", ") : day[field];
  return `
    <div class="modal-backdrop" data-action="modal-backdrop">
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="edit-title" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Protect this generated field</p><h2 id="edit-title">Edit ${html(field)}</h2></div><button type="button" class="icon-button" data-action="close-modal" aria-label="Close editor">×</button></header>
        <label class="edit-label">Your version<textarea id="generated-edit-value" rows="${field === "title" ? 2 : 7}">${html(value)}</textarea></label>
        <p class="field-help">Once saved, future source changes will mark this field stale and offer a replacement for review. They will not overwrite it.</p>
        <div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancel</button><button type="button" class="primary-button" data-action="save-generated" data-date="${day.date}" data-field="${field}">Save ${html(field)}</button></div>
      </section>
    </div>`;
}

function renderQuestionModal() {
  const info = VARIANTS[state.variant];
  return `
    <div class="modal-backdrop" data-action="modal-backdrop">
      <section class="modal-card question-modal" role="dialog" aria-modal="true" aria-labelledby="question-title" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Direction ${state.variant}</p><h2 id="question-title">${info.name}</h2></div><button type="button" class="icon-button" data-action="close-modal" aria-label="Close design question">×</button></header>
        <blockquote>${info.prompt}</blockquote>
        <p>Compare the emotional pull of the calendar, the ease of reading a full day, and the clarity of authentic versus generated material. You can combine elements rather than choosing a direction wholesale.</p>
        <button type="button" class="primary-button" data-action="close-modal">Continue exploring</button>
      </section>
    </div>`;
}

function renderModal() {
  if (!state.modal) return "";
  if (state.modal.type === "upload") return renderUploadModal();
  if (state.modal.type === "photo") return renderPhotoModal();
  if (state.modal.type === "suggestion") return renderSuggestionModal();
  if (state.modal.type === "sparse-art") return renderSparseArtworkModal();
  if (state.modal.type === "edit-generated") return renderEditModal();
  if (state.modal.type === "question") return renderQuestionModal();
  return "";
}

function render() {
  document.documentElement.dataset.theme = state.theme;
  root.innerHTML = state.variant === "A" ? renderVariantA() : state.variant === "B" ? renderVariantB() : renderVariantC();
  modalRoot.innerHTML = renderModal();

  const focusTarget = state.modal
    ? modalRoot.querySelector("[data-modal-card]")
    : state.focusAfterRender
      ? root.querySelector(state.focusAfterRender)
      : null;
  state.focusAfterRender = null;
  if (focusTarget) requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
}

let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  toastRegion.innerHTML = `<div class="toast"><span aria-hidden="true">✓</span><span>${html(message)}</span></div>`;
  toastTimer = window.setTimeout(() => {
    toastRegion.innerHTML = "";
  }, 4200);
}

function setVariant(nextVariant) {
  state.variant = nextVariant;
  const url = new URL(window.location.href);
  url.searchParams.set("variant", nextVariant);
  window.history.replaceState({ prototype: true }, "", url);
  render();
}

function cycleVariant(direction) {
  const keys = Object.keys(VARIANTS);
  const index = keys.indexOf(state.variant);
  setVariant(keys[(index + direction + keys.length) % keys.length]);
}

function showDay(date, direct = false) {
  if (!days[date]) return;
  state.selectedDate = date;
  state.galleryIndex[date] ??= 0;

  if (state.variant === "B" || direct) {
    state.screen = "day";
    state.focusAfterRender = ".day-detail-header .back-button";
    window.history.pushState({ screen: "day", date }, "", window.location.href);
  } else if (state.variant === "C") {
    render();
    requestAnimationFrame(() => document.querySelector(`#chapter-${CSS.escape(date)}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    return;
  }
  render();
}

function openUpload(date) {
  state.modal = { type: "upload", stage: "choose", date: date || state.selectedDate || today, error: "" };
  render();
}

function closeModal() {
  state.modal = null;
  render();
}

async function readJournalFile(file) {
  if (!file) return;
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!["txt", "md"].includes(extension)) {
    state.modal.error = "Choose a .txt or .md file. Word, PDF, and photo files are not accepted.";
    render();
    return;
  }
  if (file.size > 1024 * 1024) {
    state.modal.error = "This file is larger than the 1 MiB prototype limit.";
    render();
    return;
  }
  try {
    const buffer = await file.arrayBuffer();
    const textValue = new TextDecoder("utf-8", { fatal: true }).decode(buffer).replace(/^\uFEFF/, "");
    if (!textValue.trim()) throw new Error("empty");
    state.modal = {
      ...state.modal,
      stage: "review",
      fileName: file.name,
      fileSize: file.size,
      text: textValue,
      error: "",
    };
    render();
  } catch (error) {
    state.modal.error = error.message === "empty" ? "This journal file is empty." : "The file is not valid UTF-8 text.";
    render();
  }
}

function defaultUploadedDay(date) {
  return {
    date,
    title: "A newly added journal",
    titleStatus: "Unavailable",
    summary: "Generated reflection has not run in this throwaway prototype.",
    summaryStatus: "Unavailable",
    tags: ["uploaded"],
    tagsStatus: "Unavailable",
    photos: [],
    artworks: [],
    journals: [],
  };
}

function confirmUpload() {
  const modal = state.modal;
  if (!modal?.text) return;
  modal.stage = "saving";
  render();
  window.setTimeout(() => {
    const day = days[modal.date] || (days[modal.date] = defaultUploadedDay(modal.date));
    day.journals.push({
      id: `uploaded-${Date.now()}`,
      kind: "Uploaded journal",
      title: modal.fileName,
      timestamp: `${longDate(today).replace(/^\w+, /, "")}, simulated upload time`,
      status: "Current displayed version",
      text: modal.text,
    });
    state.selectedDate = modal.date;
    state.modal = null;
    render();
    toast(`Journal added to ${longDate(modal.date).replace(/^\w+, /, "")}. View day.`);
  }, 650);
}

function beginArtworkGeneration(date) {
  const day = days[date];
  if (!day) return;
  state.modal = null;
  state.generation[date] = "waiting";
  render();
  toast("Artwork simulation queued. Authentic journals remain available.");

  window.setTimeout(() => {
    if (!days[date]) return;
    state.generation[date] = "in-progress";
    render();
  }, 650);

  window.setTimeout(() => {
    if (!days[date]) return;
    day.artworks.forEach((artwork) => {
      artwork.active = false;
    });
    day.artworks.push({
      id: `synthetic-art-${Date.now()}`,
      src: "assets/art-golden-path.svg",
      alt: `AI artwork for ${longDate(date).replace(/^\w+, /, "")}`,
      brief: "A winding golden path through warm hills; quiet, symbolic, painterly, and without recognizable people.",
      created: "Just now · simulated",
      trigger: "Generate artwork now",
      active: true,
    });
    state.generation[date] = "complete";
    render();
    toast(day.photos.length ? "Synthetic artwork added. The real Daily Photo remains the Calendar Cover." : "Synthetic artwork added and shown as the AI artwork cover.");
    window.setTimeout(() => {
      delete state.generation[date];
      render();
    }, 1400);
  }, 1900);
}

function triggerArtwork(date) {
  const day = days[date];
  const count = meaningfulWordCount(day);
  if (count < 5) {
    toast("At least 5 meaningful journal words are needed.");
    return;
  }
  if (count < 20) {
    state.modal = { type: "sparse-art", date };
    render();
    return;
  }
  beginArtworkGeneration(date);
}

function makeCover(date, photoId) {
  const day = days[date];
  day.photos.forEach((photo) => {
    photo.isCover = photo.id === photoId;
  });
  render();
  toast("Calendar Cover updated. Generated artwork remains separate and labeled.");
}

function movePhoto(date, photoId, direction) {
  const day = days[date];
  const index = day.photos.findIndex((photo) => photo.id === photoId);
  const destination = Math.max(0, Math.min(day.photos.length - 1, index + Number(direction)));
  if (index === destination) return;
  const [photo] = day.photos.splice(index, 1);
  day.photos.splice(destination, 0, photo);
  state.galleryIndex[date] = destination;
  render();
  toast(`Daily Photo moved ${direction < 0 ? "earlier" : "later"}.`);
}

function handleClick(event) {
  const control = event.target.closest("[data-action]");
  if (!control) return;
  const action = control.dataset.action;
  const date = control.dataset.date;

  if (action === "previous-variant") cycleVariant(-1);
  else if (action === "next-variant") cycleVariant(1);
  else if (action === "show-variant-question") {
    state.modal = { type: "question" };
    render();
  } else if (action === "toggle-theme") {
    state.theme = state.theme === "light" ? "dark" : "light";
    render();
  } else if (action === "previous-month" || action === "next-month") {
    state.month = shiftMonth(state.month, action === "previous-month" ? -1 : 1);
    state.screen = "calendar";
    const available = populatedDates();
    state.selectedDate = available.at(-1) || `${state.month}-01`;
    render();
  } else if (action === "today") {
    state.month = today.slice(0, 7);
    state.selectedDate = today;
    state.screen = "calendar";
    render();
    if (state.variant === "C") requestAnimationFrame(() => document.querySelector(`#chapter-${CSS.escape(today)}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  } else if (action === "select-day") showDay(date);
  else if (action === "empty-day") toast(`${longDate(date).replace(/^\w+, /, "")} has no Journal Day. Empty dates remain part of the calendar.`);
  else if (action === "open-day") showDay(date, true);
  else if (action === "close-day") {
    state.screen = "calendar";
    state.focusAfterRender = `[data-calendar-date="${state.selectedDate}"]`;
    render();
  } else if (action === "adjacent-day" && date) {
    state.selectedDate = date;
    state.screen = "day";
    state.galleryIndex[date] ??= 0;
    render();
  } else if (action === "open-upload") openUpload(date);
  else if (action === "close-modal") closeModal();
  else if (action === "modal-backdrop" && event.target === control) closeModal();
  else if (action === "confirm-upload") confirmUpload();
  else if (action === "select-photo") {
    state.galleryIndex[date] = Number(control.dataset.index);
    render();
  } else if (action === "open-photo") {
    const day = days[date];
    const photo = day.photos.find((item) => item.id === control.dataset.photoId);
    state.modal = { type: "photo", day, photo };
    render();
  } else if (action === "make-cover") makeCover(date, control.dataset.photoId);
  else if (action === "move-photo") movePhoto(date, control.dataset.photoId, Number(control.dataset.direction));
  else if (action === "trigger-art") triggerArtwork(date);
  else if (action === "confirm-art") beginArtworkGeneration(date);
  else if (action === "review-suggestion") {
    state.modal = { type: "suggestion", date, field: control.dataset.field };
    render();
  } else if (action === "keep-summary") {
    const day = days[date];
    day.summaryStatus = "Accepted";
    day.attention = day.conflict ? "Review source update" : null;
    closeModal();
    toast("Current summary kept and protected.");
  } else if (action === "use-summary") {
    const day = days[date];
    day.summary = day.suggestedSummary;
    day.summaryStatus = "Accepted";
    day.attention = day.conflict ? "Review source update" : null;
    closeModal();
    toast("Suggested summary accepted. The prior generated version remains in history.");
  } else if (action === "edit-generated") {
    state.modal = { type: "edit-generated", date, field: control.dataset.field };
    render();
  } else if (action === "save-generated") {
    const day = days[date];
    const field = control.dataset.field;
    const value = document.querySelector("#generated-edit-value")?.value.trim();
    if (!value) return;
    day[field] = field === "tags" ? value.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 7) : value;
    day[`${field}Status`] = "Edited";
    if (field === "summary") day.attention = day.conflict ? "Review source update" : null;
    closeModal();
    toast(`${field[0].toUpperCase()}${field.slice(1)} saved and protected from automatic overwrite.`);
  } else if (action === "resolve-conflict") {
    const day = days[date];
    day.conflict = false;
    day.attention = day.summaryStatus === "Stale" ? "Generated summary needs review" : null;
    render();
    toast(`${control.dataset.choice} selected. Every source revision remains retained.`);
  } else if (action === "retry-image") toast("Retry simulated. The image remains unavailable so the failure state stays visible.");
  else if (action === "nav-placeholder") toast(`${control.dataset.label} is shown for information architecture only in this calendar prototype.`);
  else if (["view-provenance", "view-art-history", "view-diff", "regenerate-brief", "change-date", "download-placeholder", "trash-placeholder", "journal-menu", "correct-text", "export-placeholder"].includes(action)) {
    toast("This control is present to evaluate hierarchy; its workflow is documented but not built in this UI prototype.");
  }
}

function handleChange(event) {
  const control = event.target.closest("[data-action]");
  if (!control || !state.modal) return;
  if (control.dataset.action === "journal-file") readJournalFile(control.files?.[0]);
  if (control.dataset.action === "upload-date") state.modal.date = control.value;
}

function handleCalendarKeyboard(event) {
  const cell = event.target.closest("[data-calendar-date]");
  if (!cell) return false;
  const key = event.key;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(key)) return false;
  event.preventDefault();

  if (key === "PageUp" || key === "PageDown") {
    state.month = shiftMonth(state.month, key === "PageUp" ? -1 : 1);
    state.selectedDate = `${state.month}-01`;
    state.focusAfterRender = `[data-calendar-date="${state.selectedDate}"]`;
    render();
    return true;
  }

  const dateCells = [...cell.closest(".calendar-grid").querySelectorAll("[data-calendar-date]")];
  const index = dateCells.indexOf(cell);
  const weekOffset = index % 7;
  const offset =
    key === "ArrowLeft" ? -1 : key === "ArrowRight" ? 1 : key === "ArrowUp" ? -7 : key === "ArrowDown" ? 7 : key === "Home" ? -weekOffset : 6 - weekOffset;
  dateCells[Math.max(0, Math.min(dateCells.length - 1, index + offset))]?.focus();
  return true;
}

function handleKeydown(event) {
  if (event.key === "Escape" && state.modal) {
    closeModal();
    return;
  }
  if (handleCalendarKeyboard(event)) return;
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  if (event.target.closest("input, textarea, select, [contenteditable], [role='dialog'], [data-prevent-variant-keys], .gallery-section")) return;
  event.preventDefault();
  cycleVariant(event.key === "ArrowLeft" ? -1 : 1);
}

function handlePopState(event) {
  const variant = new URLSearchParams(window.location.search).get("variant")?.toUpperCase();
  if (VARIANTS[variant]) state.variant = variant;
  if (event.state?.screen === "day" && event.state.date && days[event.state.date]) {
    state.screen = "day";
    state.selectedDate = event.state.date;
  } else {
    state.screen = "calendar";
  }
  render();
}

root.addEventListener("click", handleClick);
modalRoot.addEventListener("click", handleClick);
modalRoot.addEventListener("change", handleChange);
document.addEventListener("keydown", handleKeydown);
window.addEventListener("popstate", handlePopState);

render();
