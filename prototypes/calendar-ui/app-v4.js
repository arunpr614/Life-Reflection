/*
 * PROTOTYPE ONLY — Life in Days v4 Museum Margin calendar experience.
 * All data and mutations are simulated in memory. There are no integrations.
 */

const root = document.querySelector("#prototype-root");
const modalRoot = document.querySelector("#modal-root");
const toastRegion = document.querySelector("#toast-region");

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
        caption: "A bright stop on the way home",
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
    title: "The rain that stayed at the edge",
    titleStatus: "Accepted",
    summary:
      "A short fictional entry notices the changing light before a storm and the relief of finishing one small task.",
    suggestedSummary:
      "A sudden monsoon shower changed the pace of a fictional workday. Later, two cups of tea on the balcony turned an ordinary evening into a spacious conversation. A second journal added the detail of city lights returning after the rain and the decision to leave tomorrow unplanned.",
    summaryStatus: "Stale",
    summaryProtected: true,
    tags: ["rain", "quiet work", "evening"],
    tagsStatus: "Accepted",
    photos: [
      {
        id: "p-rain",
        src: "assets/photo-rain-window.svg",
        alt: "Synthetic rain-window fixture with an amber room, wet glass, and blue-green trees",
        caption: "The shower arrived all at once",
        timestamp: "13 Aug 2026, 4:38 pm IST",
        isCover: true,
      },
      {
        id: "p-cups",
        src: "assets/photo-balcony-cups.svg",
        alt: "Synthetic balcony fixture with two cups, plants, and evening city lights",
        caption: "Two cups after the rain",
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

const initialParams = new URLSearchParams(window.location.search);
const requestedView = initialParams.get("view");
const requestedDate = initialParams.get("date");
const requestedMonth = initialParams.get("month");
const allowedViews = new Set(["calendar", "almanac", "search"]);
const isMonthKey = (value) => /^\d{4}-(0[1-9]|1[0-2])$/.test(value || "");
const isDateKey = (value) => /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/.test(value || "");
const initialMonth = isMonthKey(requestedMonth) ? requestedMonth : isDateKey(requestedDate) ? requestedDate.slice(0, 7) : "2026-08";
const state = {
  view: allowedViews.has(requestedView) ? requestedView : "calendar",
  month: initialMonth,
  selectedDate: isDateKey(requestedDate) && days[requestedDate] ? requestedDate : null,
  focusDate: isDateKey(requestedDate) && requestedDate.startsWith(`${initialMonth}-`) ? requestedDate : initialMonth === today.slice(0, 7) ? today : `${initialMonth}-01`,
  screen: initialParams.get("screen") === "day" && days[requestedDate] ? "day" : "month",
  theme: "light",
  galleryIndex: {},
  generation: {},
  searchQuery: initialParams.get("q") || "",
  searchReturnView: "calendar",
  almanacCollapsed: initialParams.get("rail") === "collapsed" || window.localStorage.getItem("life-in-days-v4-almanac-collapsed") === "true",
  pendingChapterScroll: false,
  scrollByView: { calendar: 0, almanac: 0, search: 0 },
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
      <strong>Throwaway UI prototype · v4</strong>
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

function compactNavigation() {
  const item = (view, label) => `
    <button class="${state.view === view ? "is-active" : ""}" type="button" data-action="set-view" data-view="${view}" ${state.view === view ? 'aria-current="page"' : ""}>
      ${label}
    </button>`;
  return `
    <nav class="compact-navigation" aria-label="Primary">
      ${item("calendar", "Calendar")}
      ${item("almanac", "Almanac")}
      ${item("search", "Search")}
      <button type="button" data-action="open-upload">Add journal</button>
    </nav>`;
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
  const isMosaic = mode === "mosaic";
  const tabIndex = date === state.focusDate ? "0" : "-1";

  return `
    <button
      type="button"
      class="${classes.join(" ")}"
      data-action="${action}"
      data-date="${date}"
      data-calendar-date="${date}"
      role="gridcell"
      tabindex="${tabIndex}"
      aria-selected="${date === state.selectedDate}"
      ${day ? `aria-controls="calendar-selection-panel" aria-expanded="${date === state.selectedDate}"` : ""}
      aria-label="${html(accessibleDayName(date, day))}"
      ${style}
    >
      ${isMosaic && cover ? `<img class="calendar-cover-image" src="${html(cover.src)}" alt="" />` : '<span class="tile-scrim" aria-hidden="true"></span>'}
      <span class="tile-topline">
        <span class="day-number">${dayNumber}</span>
        ${date === today && !isMosaic ? '<span class="today-marker">Today</span>' : ""}
      </span>
      ${!isMosaic && cover?.kind === "artwork" ? '<span class="badge badge-ai">AI artwork</span>' : ""}
      ${day?.imageFailed && !isMosaic ? '<span class="image-failed"><span aria-hidden="true">↻</span> Image unavailable</span>' : ""}
      ${day && !cover && (isMosaic || !day.imageFailed) ? `<span class="paper-day"><strong>${html(day.title)}</strong><small>${counts.journalCount} ${counts.journalCount === 1 ? "journal" : "journals"}</small></span>` : ""}
      ${day && cover && !isMosaic ? `<span class="tile-caption"><strong>${html(day.title)}</strong><small>${counts.label}</small></span>` : ""}
      ${day?.attention ? `<span class="${isMosaic ? "sr-only" : "attention-dot"}" title="${html(day.attention)}"><span aria-hidden="true">!</span><span class="sr-only">${html(day.attention)}</span></span>` : ""}
    </button>`;
}

function calendarGrid(mode = "desk", headingId = `month-heading-${mode}`) {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const leading = Array.from({ length: leadingCalendarCells(state.month) }, () => '<div class="calendar-spacer" aria-hidden="true"></div>').join("");
  const cells = datesForMonth(state.month).map((date) => calendarTile(date, mode)).join("");

  return `
    <div class="calendar-shell calendar-shell--${mode}">
      <div class="weekday-row" aria-hidden="true">${weekdays.map((weekday) => `<span>${weekday}</span>`).join("")}</div>
      <div class="calendar-grid" role="grid" aria-labelledby="${headingId}" aria-colcount="7">
        ${leading}${cells}
      </div>
      ${populatedDates().length ? "" : '<p class="empty-month-note">No journaled days in this month</p>'}
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
      ${generatedReflection(day, "almanac", 2, true)}
      ${chapterMedia(day)}
      ${artwork && day.photos.length ? `<details class="inline-artwork"><summary><span class="badge badge-ai">AI artwork</span> View derived artwork</summary><img src="${html(artwork.src)}" alt="${html(artwork.alt)}" /><p>Shown separately; a real Daily Photo remains the Calendar Cover.</p></details>` : ""}
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
      <footer class="chapter-footer">
        <button type="button" class="text-button" data-action="open-upload" data-date="${day.date}">Upload journal for this date</button>
        <button type="button" class="text-button" data-action="view-provenance" data-date="${day.date}">View history & provenance</button>
      </footer>
    </article>`;
}

function unifiedTopbar() {
  const viewButton = (view, label) => `
    <button type="button" data-action="set-view" data-view="${view}" ${state.view === view ? 'class="is-active" aria-current="page"' : ""}>${label}</button>`;
  return `
    <header class="unified-topbar">
      ${brandMark()}
      <nav class="unified-primary" aria-label="Archive views">
        <div class="experience-switcher" aria-label="Choose archive experience">
          ${viewButton("calendar", "Calendar")}
          ${viewButton("almanac", "Almanac")}
        </div>
        <button type="button" class="search-view-button ${state.view === "search" ? "is-active" : ""}" data-action="set-view" data-view="search" ${state.view === "search" ? 'aria-current="page"' : ""}>Search</button>
      </nav>
      <div class="topbar-actions">${themeButton()}<button class="upload-quiet" type="button" data-action="open-upload">Add journal</button></div>
    </header>`;
}

function calendarSelection(day) {
  if (!day) return "";
  const cover = calendarCover(day);
  const counts = dayCounts(day);
  const sourceLabel = day.imageFailed ? "Image unavailable" : cover?.kind === "photo" ? "Telegram photo" : cover?.kind === "artwork" ? "AI-generated artwork" : "Journal day";
  const coverClass = cover?.id ? `cover-${String(cover.id).replace(/[^a-z0-9_-]/gi, "-")}` : "no-cover";
  const sourceDetail = day.imageFailed
    ? "The archived Journal Day is still available while media recovery is attempted."
    : cover?.kind === "photo"
    ? cover.timestamp
    : cover?.kind === "artwork"
      ? `Created ${cover.created || "from a minimized Visual Brief"}`
      : `${counts.journalCount} ${counts.journalCount === 1 ? "source journal" : "source journals"}`;
  const description = cover?.kind === "photo" && cover.caption ? cover.caption : day.summary;

  return `
    <section id="calendar-selection-panel" class="calendar-selection" role="region" aria-labelledby="calendar-selection-title" tabindex="-1">
      <button type="button" class="calendar-selection-backdrop" data-action="close-calendar-selection" aria-label="Close selected day details" tabindex="-1"></button>
      <div class="calendar-selection-toolbar">
        <span>Selected Journal Day</span>
        <button type="button" class="secondary-button calendar-selection-close" data-action="close-calendar-selection" aria-label="Close details and return to the full calendar">× <span>Close details</span></button>
      </div>
      <div class="museum-display ${cover ? "has-cover" : "is-paper"} ${coverClass}">
        <figure class="museum-figure">
          ${cover
            ? `<img src="${html(cover.src)}" alt="${html(cover.alt)}" />`
            : `<div class="museum-paper-memory"><span>${dateParts(day.date).day}</span><p>${html(day.title)}</p></div>`}
        </figure>
        <aside class="museum-placard" aria-label="Selected day details and provenance">
          <p class="museum-source">${sourceLabel}</p>
          <h2 id="calendar-selection-title">${html(day.title)}</h2>
          <p class="museum-date">${longDate(day.date)}</p>
          <p class="museum-counts">${counts.label}</p>
          <p class="museum-description">${html(description)}</p>
          <dl class="museum-provenance">
            <div><dt>${day.imageFailed ? "Status" : cover?.kind === "photo" ? "Original Timestamp" : cover?.kind === "artwork" ? "Generation" : "Archive status"}</dt><dd>${html(sourceDetail)}</dd></div>
          </dl>
          ${day.imageFailed ? '<button type="button" class="secondary-button" data-action="retry-image">Retry image</button>' : ""}
          <button type="button" class="primary-button museum-open-day" data-action="open-full-day" data-date="${day.date}">Open full Journal Day</button>
        </aside>
      </div>
    </section>`;
}

function renderMosaicView() {
  const day = state.selectedDate ? days[state.selectedDate] : null;
  if (state.screen === "day" && day) {
    return `<main id="prototype-main" class="mosaic-day-page" tabindex="-1">${dayDetail(day, "mosaic")}</main>`;
  }
  return `
    <main id="prototype-main" class="mosaic-calendar-page ${day ? "has-calendar-selection" : "is-calendar-landing"}" tabindex="-1">
      <div class="mosaic-calendar-layout">
        <section class="mosaic-calendar-column" aria-labelledby="month-heading-mosaic-v4">
          <section class="mosaic-intro">
            <div><p class="eyebrow">A private month in pictures</p><h1 id="month-heading-mosaic-v4">${monthLabel(state.month)}</h1></div>
            ${day ? "" : "<p>Recognize a day by its texture. Open it when you want the full, authentic record.</p>"}
          </section>
          <div class="mosaic-month-actions">
            <button type="button" class="icon-button" data-action="previous-month" aria-label="Previous month">←</button>
            <span>Monday first · Asia/Kolkata</span>
            <button type="button" class="today-button" data-action="today">Today</button>
            <button type="button" class="icon-button" data-action="next-month" aria-label="Next month">→</button>
          </div>
          ${calendarGrid("mosaic", "month-heading-mosaic-v4")}
          ${day ? '<p class="mosaic-selection-note">Recognize a day by its texture. Open it when you want the full, authentic record.</p>' : ""}
        </section>
        ${calendarSelection(day)}
      </div>
    </main>`;
}

function almanacNavigatorContent(context = "desktop") {
  const headingId = `month-heading-index-${context}-v4`;
  return `
    <div class="almanac-index-content-v4" id="almanac-index-content-${context}-v4">
      <div class="almanac-index-header">
        <button type="button" class="icon-button" data-action="previous-month" aria-label="Previous month">←</button>
        <strong id="${headingId}">${monthLabel(state.month)}</strong>
        <button type="button" class="icon-button" data-action="next-month" aria-label="Next month">→</button>
      </div>
      ${calendarGrid("index", headingId)}
      <button class="upload-primary" type="button" data-action="open-upload">Upload journal</button>
      <div class="almanac-legend" aria-label="Calendar legend">
        <span><i class="legend-real"></i>Real photo</span>
        <span><i class="legend-ai"></i>AI artwork</span>
        <span><i class="legend-paper"></i>Journal only</span>
      </div>
      <p class="almanac-timezone">Journal Dates use Asia/Kolkata</p>
    </div>`;
}

function almanacIndexV4() {
  const collapsed = state.almanacCollapsed;
  return `
    <aside class="almanac-index almanac-index-v4 ${collapsed ? "is-collapsed" : ""}" aria-label="Monthly navigation">
      <button type="button" class="almanac-rail-toggle" data-action="toggle-almanac-rail" aria-controls="almanac-index-content-desktop-v4" aria-expanded="${!collapsed}">
        <strong>${collapsed ? "Show month" : "Hide month"}</strong><span>${collapsed ? monthLabel(state.month) : "Immersive reading"}</span>
      </button>
      <div ${collapsed ? 'hidden inert aria-hidden="true"' : ""}>${almanacNavigatorContent("desktop")}</div>
    </aside>`;
}

function renderAlmanacView() {
  const monthDays = populatedDates().sort().reverse();
  const [volumeYear, volumeMonth] = state.month.split("-");
  return `
    <div class="almanac-mobile-toolbar">
      <button type="button" class="secondary-button" data-action="open-almanac-drawer" aria-haspopup="dialog">Open month index</button>
      <span>${monthLabel(state.month)}</span>
    </div>
    <div class="almanac-shell almanac-shell-v4 ${state.almanacCollapsed ? "is-collapsed" : ""}">
      ${almanacIndexV4()}
      <main id="prototype-main" class="almanac-reading" tabindex="-1">
        <header class="almanac-title-page">
          <div><p class="eyebrow">Volume ${volumeMonth} · ${volumeYear}</p><h1>${monthLabel(state.month)}</h1></div>
          <div class="almanac-title-actions"><button type="button" class="today-button" data-action="today">Today</button></div>
          <p>A private monthly book assembled from authentic photographs and journals. Generated interpretation is always labeled and kept apart.</p>
        </header>
        ${monthDays.length ? monthDays.map((date) => almanacChapter(days[date])).join('<div class="chapter-divider" aria-hidden="true">✦</div>') : '<div class="almanac-empty"><h2>No journaled days in this month</h2><p>The month remains part of the archive without being marked incomplete.</p></div>'}
        <footer class="book-end"><span aria-hidden="true">◇</span><p>End of ${monthLabel(state.month)}</p></footer>
      </main>
    </div>`;
}

function searchResults(query) {
  const needle = query.trim().toLocaleLowerCase("en-IN");
  return Object.values(days)
    .filter((day) => !needle || [day.title, day.summary, day.tags.join(" "), combinedJournalText(day)].join(" ").toLocaleLowerCase("en-IN").includes(needle))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function renderSearchView() {
  const results = searchResults(state.searchQuery);
  return `
    <main id="prototype-main" class="search-page-v4" tabindex="-1">
      <header class="search-heading-v4">
        <p class="eyebrow">Search the authentic archive</p>
        <h1>Find a remembered detail</h1>
        <p>Search titles, summaries, topics, and complete journal text. Results remain tied to their Journal Day.</p>
      </header>
      <form class="archive-search-v4" data-action="search-form" role="search">
        <label for="archive-search-input-v4">Search your archive</label>
        <div><input id="archive-search-input-v4" name="query" type="search" value="${html(state.searchQuery)}" autocomplete="off" placeholder="Try rain, market, or quiet" /><button class="primary-button" type="submit">Search</button></div>
      </form>
      <div class="search-suggestions-v4" aria-label="Suggested searches">
        <span>Try</span>
        ${["rain", "quiet", "evening"].map((query) => `<button type="button" data-action="run-search" data-query="${query}">${query}</button>`).join("")}
        ${state.searchQuery ? '<button type="button" data-action="clear-search">Clear</button>' : ""}
      </div>
      <section class="search-results-v4" aria-live="polite" aria-labelledby="search-results-heading-v4">
        <div class="search-results-heading-v4"><h2 id="search-results-heading-v4">${state.searchQuery ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "Recent Journal Days"}</h2><span>All Journal Days</span></div>
        ${results.length ? `<div class="search-result-grid-v4">${results.map((day) => {
          const cover = calendarCover(day);
          const counts = dayCounts(day);
          return `<button type="button" class="search-result-card-v4" data-action="open-search-result" data-date="${day.date}" aria-label="${html(`${shortDate(day.date)}: ${day.title}`)}" aria-describedby="search-result-description-${day.date}">
            <span class="search-result-media-v4 ${cover ? "has-media" : "is-paper"}">${cover ? `<img src="${html(cover.src)}" alt="" />${cover.kind === "artwork" ? '<span class="badge badge-ai">AI artwork</span>' : ""}` : `<span>${dateParts(day.date).day}</span>`}</span>
            <span class="search-result-copy-v4"><small>${shortDate(day.date)} · ${counts.label}</small><strong>${html(day.title)}</strong><span id="search-result-description-${day.date}">${html(day.summary)}</span><em>${day.tags.map((tag) => html(tag)).join(" · ")}</em></span>
          </button>`;
        }).join("")}</div>` : '<div class="search-empty-v4"><h3>No matching Journal Days</h3><p>Try a broader word or clear the search to see recent days.</p><button type="button" class="secondary-button" data-action="clear-search">Show recent days</button></div>'}
      </section>
    </main>`;
}

function renderUnifiedApp() {
  const content = state.view === "calendar" ? renderMosaicView() : state.view === "almanac" ? renderAlmanacView() : renderSearchView();
  return `
    <div class="prototype-app unified-v4 view-${state.view}">
      ${prototypeBanner()}
      ${unifiedTopbar()}
      ${content}
      ${compactNavigation()}
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

function reflectionState(day) {
  const statuses = [day.titleStatus, day.summaryStatus, day.tagsStatus];
  const isStale = statuses.includes("Stale");
  const hasEdits = statuses.some((status) => status === "Edited");
  return {
    isStale,
    label: hasEdits && !isStale ? "Reflection" : "AI reflection",
    detail: hasEdits && !isStale ? "AI-generated with your edits" : "Based on journal text",
  };
}

function generatedReflection(day, mode = "desk", headingLevel = 2, includeDate = false) {
  const reflection = reflectionState(day);
  const headingTag = headingLevel === 3 ? "h3" : "h2";
  const titleId = `reflection-title-${mode}-${day.date}`;
  const counts = dayCounts(day);
  return `
    <section class="reflection-companion reflection-companion--${mode}" aria-labelledby="${titleId}">
      <div class="reflection-origin">
        <strong>${html(reflection.label)}</strong>
        ${reflection.isStale ? `<span>Summary update available</span><small>Your current version is unchanged</small><button type="button" class="reflection-review" data-action="review-suggestion" data-date="${day.date}" data-field="summary">Review update</button>` : `<span>${html(reflection.detail)}</span>`}
      </div>
      <div class="reflection-prose">
        ${includeDate || mode === "mosaic" ? `<p class="reflection-dateline">${longDate(day.date)} · ${counts.label}</p>` : ""}
        <${headingTag} id="${titleId}">${html(day.title)}</${headingTag}>
        <p class="reflection-summary">${html(day.summary)}</p>
      </div>
      <div class="reflection-meta">
        <p class="reflection-topics-label">Topics</p>
        <ul class="reflection-topics">${day.tags.slice(0, 3).map((tag) => `<li>${html(tag)}</li>`).join("")}</ul>
        <button type="button" class="reflection-manage" data-action="open-manage-reflection" data-date="${day.date}">Manage reflection</button>
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
  const operationalAttention = day.attention && (day.conflict || day.summaryStatus !== "Stale") ? day.attention : null;
  return `
    <div class="day-detail day-detail--${mode}">
      <header class="day-detail-header">
        <button type="button" class="back-button" data-action="close-day"><span aria-hidden="true">←</span> Back to ${monthLabel(state.month)}</button>
        <div class="day-date-row ${mode === "mosaic" ? "day-date-row--compact" : ""}">
          <div><p class="eyebrow">Journal Day · Asia/Kolkata</p><h1>${longDate(day.date)}</h1><p>${counts.label}</p></div>
          <div class="adjacent-days" aria-label="Adjacent populated Journal Days">
            <button type="button" class="icon-button" data-action="adjacent-day" data-date="${previous || ""}" aria-label="Previous populated Journal Day" ${previous ? "" : "disabled"}>←</button>
            <button type="button" class="icon-button" data-action="adjacent-day" data-date="${next || ""}" aria-label="Next populated Journal Day" ${next ? "" : "disabled"}>→</button>
          </div>
        </div>
        ${operationalAttention ? `<a class="attention-banner" href="#sources-title-${day.date}"><span aria-hidden="true">!</span><span><strong>${html(operationalAttention)}</strong><small>Authentic sources are unchanged.</small></span><span aria-hidden="true">→</span></a>` : ""}
      </header>
      <div class="day-detail-body">
        ${gallery(day)}
        ${generatedReflection(day, mode)}
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

function reflectionFieldStatus(day, field) {
  const status = day[`${field}Status`];
  if (status === "Stale") return "Protected · update available";
  if (status === "Edited") return "Edited · protected";
  if (status === "Accepted") return "Accepted · protected";
  return status || "Not generated";
}

function renderManageReflectionSheet() {
  const modal = state.modal;
  const day = days[modal.date];
  const view = modal.view || "list";
  const field = modal.field;
  const value = field === "tags" ? day.tags.join(", ") : day[field];
  const fieldLabel = field ? `${field[0].toUpperCase()}${field.slice(1)}` : "";
  const fieldRow = (name, label, display) => `
    <section class="reflection-manage-row" data-field-row="${name}" tabindex="-1">
      <header><h3>${label}</h3><span>${html(reflectionFieldStatus(day, name))}</span></header>
      ${name === "tags" ? `<p class="manage-topics">${day.tags.map((tag) => html(tag)).join(" · ")}</p>` : `<p>${html(display)}</p>`}
      <div class="manage-row-actions">
        ${name === "summary" && day.summaryStatus === "Stale" ? `<button type="button" class="text-button reflection-review" data-action="review-suggestion" data-date="${day.date}" data-field="summary">Review update</button>` : ""}
        <button type="button" class="text-button" data-action="edit-generated" data-date="${day.date}" data-field="${name}">Edit ${name}</button>
        ${name === "summary" && day.summaryProtected ? `<button type="button" class="text-button" data-action="resume-updates" data-date="${day.date}">Resume automatic updates</button>` : ""}
      </div>
    </section>`;

  const listView = `
    <div class="reflection-sheet-intro">
      <h2 id="manage-reflection-title">Manage reflection</h2>
      <p class="reflection-sheet-date">${longDate(day.date).replace(/^\w+, /, "")}</p>
      <p>Generated from journal text. Your changes never alter source journals.</p>
    </div>
    <div class="reflection-manage-fields">
      ${fieldRow("title", "Title", day.title)}
      ${fieldRow("summary", "Summary", day.summary)}
      ${fieldRow("tags", "Tags", day.tags)}
    </div>
    <footer class="reflection-sheet-footer">
      <button type="button" class="text-button" data-action="regenerate-reflection">Regenerate reflection</button>
      <button type="button" class="text-button" data-action="generation-details">View generation details</button>
    </footer>`;

  const editView = `
    <button type="button" class="sheet-back" data-action="manage-back"><span aria-hidden="true">←</span> Manage reflection</button>
    <div class="reflection-sheet-intro">
      <h2 id="manage-reflection-title">Edit ${html(fieldLabel)}</h2>
      <p>Your saved version is protected from silent replacement.</p>
    </div>
    <label class="edit-label" for="generated-edit-value">Your ${html(field)}
      <textarea id="generated-edit-value" rows="${field === "title" ? 3 : field === "tags" ? 4 : 10}">${html(value)}</textarea>
    </label>
    <p class="field-help">If sources change later, Life in Days will offer a generated replacement for review. Your version will stay unchanged until you choose.</p>
    <div class="sheet-sticky-actions"><button type="button" class="secondary-button" data-action="manage-back">Cancel</button><button type="button" class="primary-button" data-action="save-generated" data-date="${day.date}" data-field="${field}">Save ${html(field)}</button></div>`;

  const suggestionView = `
    <button type="button" class="sheet-back" data-action="manage-back"><span aria-hidden="true">←</span> Manage reflection</button>
    <div class="reflection-sheet-intro">
      <h2 id="manage-reflection-title">Review summary update</h2>
      <p>New generated suggestion based on updated sources. Your current version has not changed.</p>
    </div>
    <div class="reflection-comparison">
      <article><header><h3>Current version</h3><span>Protected</span></header><p>${html(day.summary)}</p></article>
      <article><header><h3>Newest suggestion</h3><span>Generated</span></header><p>${html(day.suggestedSummary || day.summary)}</p></article>
    </div>
    <div class="sheet-choice-actions">
      <button type="button" class="secondary-button" data-action="keep-summary" data-date="${day.date}">Keep current version</button>
      <button type="button" class="secondary-button" data-action="edit-generated" data-date="${day.date}" data-field="summary">Edit current version</button>
      <button type="button" class="primary-button" data-action="use-summary" data-date="${day.date}">Use suggested version</button>
    </div>`;

  return `
    <div class="reflection-sheet-backdrop" data-action="modal-backdrop">
      <aside class="reflection-sheet" role="dialog" aria-modal="true" aria-labelledby="manage-reflection-title" tabindex="-1" data-modal-card>
        <button type="button" class="reflection-sheet-close" data-action="close-modal" aria-label="Close Manage reflection">×</button>
        <div class="reflection-sheet-body">${view === "edit" ? editView : view === "suggestion" ? suggestionView : listView}</div>
      </aside>
    </div>`;
}

function renderAlmanacDrawer() {
  return `
    <div class="modal-backdrop almanac-drawer-backdrop-v4" data-action="modal-backdrop">
      <aside class="almanac-mobile-drawer-v4" role="dialog" aria-modal="true" aria-labelledby="almanac-drawer-title-v4" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Monthly navigation</p><h2 id="almanac-drawer-title-v4">Find a Journal Day</h2></div><button type="button" class="secondary-button" data-action="close-modal">Close</button></header>
        ${almanacNavigatorContent("drawer")}
      </aside>
    </div>`;
}

function renderModal() {
  if (!state.modal) return "";
  if (state.modal.type === "manage-reflection") return renderManageReflectionSheet();
  if (state.modal.type === "upload") return renderUploadModal();
  if (state.modal.type === "photo") return renderPhotoModal();
  if (state.modal.type === "sparse-art") return renderSparseArtworkModal();
  if (state.modal.type === "almanac-drawer") return renderAlmanacDrawer();
  return "";
}

function render() {
  document.documentElement.dataset.theme = state.theme;
  root.innerHTML = renderUnifiedApp();
  modalRoot.innerHTML = renderModal();
  root.inert = Boolean(state.modal);
  if (state.modal) root.setAttribute("aria-hidden", "true");
  else root.removeAttribute("aria-hidden");

  const focusTarget = state.modal
    ? modalRoot.querySelector(state.modal.focusSelector || "[data-modal-card]")
    : state.focusAfterRender
      ? root.querySelector(state.focusAfterRender)
      : null;
  state.focusAfterRender = null;
  if (state.modal) state.modal.focusSelector = null;
  if (focusTarget) requestAnimationFrame(() => {
    focusTarget.focus({ preventScroll: true });
    if (state.modal?.scrollY != null) window.scrollTo({ top: state.modal.scrollY, behavior: "auto" });
  });

  if (state.pendingChapterScroll && state.view === "almanac") {
    state.pendingChapterScroll = false;
    requestAnimationFrame(() => {
      const chapter = root.querySelector(`#chapter-${CSS.escape(state.selectedDate)}`);
      chapter?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      chapter?.focus({ preventScroll: true });
    });
  }
}

let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  toastRegion.innerHTML = `<div class="toast"><span aria-hidden="true">✓</span><span>${html(message)}</span></div>`;
  toastTimer = window.setTimeout(() => {
    toastRegion.innerHTML = "";
  }, 4200);
}

function syncUrl({ push = false } = {}) {
  const url = new URL(window.location.href);
  url.searchParams.delete("variant");
  url.searchParams.set("view", state.view);
  url.searchParams.set("month", state.month);
  if (state.selectedDate) url.searchParams.set("date", state.selectedDate);
  else url.searchParams.delete("date");
  if (state.view === "calendar" && state.screen === "day") url.searchParams.set("screen", "day");
  else url.searchParams.delete("screen");
  if (state.view === "search" && state.searchQuery) url.searchParams.set("q", state.searchQuery);
  else url.searchParams.delete("q");
  if (state.almanacCollapsed) url.searchParams.set("rail", "collapsed");
  else url.searchParams.delete("rail");
  window.history[push ? "pushState" : "replaceState"]({ prototype: true, view: state.view, date: state.selectedDate, screen: state.screen }, "", url);
}

function restoreViewScroll(view) {
  requestAnimationFrame(() => window.scrollTo({ top: state.scrollByView[view] || 0, behavior: "auto" }));
}

function setView(nextView, { push = true } = {}) {
  if (!allowedViews.has(nextView)) return;
  const previousView = state.view;
  const previousScreen = state.screen;
  state.scrollByView[previousView] = window.scrollY;
  if (nextView === "search" && previousView !== "search") state.searchReturnView = previousView;
  state.view = nextView;

  const shouldScrollChapter = nextView === "almanac" && previousView === "calendar" && Boolean(state.selectedDate);
  if (nextView === "calendar") {
    state.screen = "month";
    state.focusAfterRender = '[data-action="set-view"][data-view="calendar"]';
  } else if (nextView === "almanac") {
    state.screen = "month";
    state.pendingChapterScroll = shouldScrollChapter;
    state.focusAfterRender = '[data-action="set-view"][data-view="almanac"]';
  } else {
    state.focusAfterRender = "#archive-search-input-v4";
  }

  syncUrl({ push });
  render();
  if (!shouldScrollChapter) restoreViewScroll(nextView);
  toast(`${nextView === "calendar" ? "Calendar" : nextView === "almanac" ? "Almanac" : "Search"} view, ${monthLabel(state.month)}.`);
}

function showDay(date) {
  if (!days[date]) return;
  state.selectedDate = date;
  state.focusDate = date;
  state.galleryIndex[date] ??= 0;

  if (state.view === "calendar") {
    state.screen = "month";
    state.focusAfterRender = ".calendar-selection";
    syncUrl({ push: true });
  } else if (state.view === "almanac") {
    if (state.modal?.type === "almanac-drawer") state.modal = null;
    state.pendingChapterScroll = true;
    syncUrl();
  }
  render();
}

function openUpload(date) {
  state.modal = { type: "upload", stage: "choose", date: date || state.selectedDate || today, error: "" };
  render();
}

function openManageReflection(date, view = "list", field = null) {
  const current = state.modal?.type === "manage-reflection" ? state.modal : null;
  state.modal = {
    type: "manage-reflection",
    date,
    view,
    field,
    scrollY: current?.scrollY ?? window.scrollY,
    returnFocusSelector: current?.returnFocusSelector || `[data-action="open-manage-reflection"][data-date="${date}"]`,
  };
  render();
}

function closeModal() {
  const modal = state.modal;
  if (modal?.returnFocusSelector) state.focusAfterRender = modal.returnFocusSelector;
  const returnScrollY = modal?.scrollY;
  state.modal = null;
  render();
  if (returnScrollY != null) requestAnimationFrame(() => window.scrollTo({ top: returnScrollY, behavior: "auto" }));
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
    state.focusDate = modal.date;
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

  if (action === "set-view") {
    if (control.dataset.view === state.view && state.view === "calendar") {
      state.screen = "month";
      syncUrl({ push: true });
      render();
      restoreViewScroll("calendar");
    } else if (control.dataset.view !== state.view) setView(control.dataset.view);
  } else if (action === "toggle-theme") {
    state.theme = state.theme === "light" ? "dark" : "light";
    render();
  } else if (action === "toggle-almanac-rail") {
    const scrollY = window.scrollY;
    state.almanacCollapsed = !state.almanacCollapsed;
    window.localStorage.setItem("life-in-days-v4-almanac-collapsed", String(state.almanacCollapsed));
    state.focusAfterRender = '[data-action="toggle-almanac-rail"]';
    syncUrl();
    render();
    requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
  } else if (action === "open-almanac-drawer") {
    state.modal = { type: "almanac-drawer", returnFocusSelector: '[data-action="open-almanac-drawer"]' };
    render();
  } else if (action === "previous-month" || action === "next-month") {
    state.month = shiftMonth(state.month, action === "previous-month" ? -1 : 1);
    state.screen = "month";
    state.selectedDate = null;
    state.focusDate = `${state.month}-01`;
    if (state.modal?.type === "almanac-drawer") state.modal.focusSelector = ".almanac-mobile-drawer-v4";
    syncUrl();
    render();
  } else if (action === "today") {
    state.month = today.slice(0, 7);
    state.selectedDate = null;
    state.focusDate = today;
    state.screen = "month";
    syncUrl();
    render();
  } else if (action === "select-day") showDay(date);
  else if (action === "empty-day") toast(`${longDate(date).replace(/^\w+, /, "")} has no Journal Day. Empty dates remain part of the calendar.`);
  else if (action === "open-day") showDay(date);
  else if (action === "open-full-day") {
    state.selectedDate = date;
    state.focusDate = date;
    state.screen = "day";
    state.focusAfterRender = ".day-detail-header .back-button";
    syncUrl({ push: true });
    render();
  }
  else if (action === "close-calendar-selection") {
    const previousDate = state.selectedDate;
    state.selectedDate = null;
    state.screen = "month";
    state.focusDate = previousDate || state.focusDate;
    state.focusAfterRender = previousDate ? `[data-calendar-date="${previousDate}"]` : null;
    syncUrl({ push: true });
    render();
  }
  else if (action === "close-day") {
    state.screen = "month";
    state.focusDate = state.selectedDate;
    state.focusAfterRender = `[data-calendar-date="${state.selectedDate}"]`;
    syncUrl({ push: true });
    render();
  } else if (action === "adjacent-day" && date) {
    state.selectedDate = date;
    state.focusDate = date;
    state.screen = "day";
    state.galleryIndex[date] ??= 0;
    syncUrl({ push: true });
    render();
  } else if (action === "run-search") {
    state.searchQuery = control.dataset.query || "";
    state.focusAfterRender = "#archive-search-input-v4";
    syncUrl();
    render();
  } else if (action === "clear-search") {
    state.searchQuery = "";
    syncUrl();
    render();
    root.querySelector("#archive-search-input-v4")?.focus();
  } else if (action === "open-search-result") {
    state.scrollByView.search = window.scrollY;
    state.selectedDate = date;
    state.focusDate = date;
    state.month = date.slice(0, 7);
    state.galleryIndex[date] ??= 0;
    if (state.searchReturnView === "almanac") {
      state.view = "almanac";
      state.screen = "month";
      state.pendingChapterScroll = true;
    } else {
      state.view = "calendar";
      state.screen = "day";
      state.focusAfterRender = ".day-detail-header .back-button";
    }
    syncUrl({ push: true });
    render();
  } else if (action === "open-upload") openUpload(date);
  else if (action === "open-manage-reflection") openManageReflection(date);
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
    openManageReflection(date, "suggestion", control.dataset.field || "summary");
  } else if (action === "manage-back") {
    const field = state.modal?.field || "summary";
    state.modal = { ...state.modal, view: "list", field: null, focusSelector: `[data-field-row="${field}"]` };
    render();
  } else if (action === "keep-summary") {
    const day = days[date];
    day.summaryStatus = "Accepted";
    day.attention = day.conflict ? "Review source update" : null;
    day.summaryProtected = true;
    state.modal = { ...state.modal, view: "list", field: null, focusSelector: '[data-field-row="summary"]' };
    render();
    toast("Current summary kept and protected.");
  } else if (action === "use-summary") {
    const day = days[date];
    day.summary = day.suggestedSummary;
    day.summaryStatus = "Accepted";
    day.attention = day.conflict ? "Review source update" : null;
    day.summaryProtected = true;
    state.modal = { ...state.modal, view: "list", field: null, focusSelector: '[data-field-row="summary"]' };
    render();
    toast("Suggested summary accepted. The prior generated version remains in history.");
  } else if (action === "edit-generated") {
    openManageReflection(date, "edit", control.dataset.field);
  } else if (action === "save-generated") {
    const day = days[date];
    const field = control.dataset.field;
    const value = document.querySelector("#generated-edit-value")?.value.trim();
    if (!value) return;
    day[field] = field === "tags" ? value.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 7) : value;
    day[`${field}Status`] = "Edited";
    if (field === "summary") day.summaryProtected = true;
    if (field === "summary") day.attention = day.conflict ? "Review source update" : null;
    state.modal = { ...state.modal, view: "list", field: null, focusSelector: `[data-field-row="${field}"]` };
    render();
    toast(`${field[0].toUpperCase()}${field.slice(1)} saved and protected from automatic overwrite.`);
  } else if (action === "resume-updates") {
    const day = days[date];
    day.summaryProtected = false;
    day.summaryStatus = "AI-generated";
    day.attention = day.conflict ? "Review source update" : null;
    state.modal = { ...state.modal, focusSelector: '[data-field-row="summary"]' };
    render();
    toast("Automatic summary updates resumed. The current text was not replaced.");
  } else if (action === "resolve-conflict") {
    const day = days[date];
    day.conflict = false;
    day.attention = day.summaryStatus === "Stale" ? "Generated summary needs review" : null;
    render();
    toast(`${control.dataset.choice} selected. Every source revision remains retained.`);
  } else if (action === "retry-image") toast("Retry simulated. The image remains unavailable so the failure state stays visible.");
  else if (action === "nav-placeholder") toast(`${control.dataset.label} is outside this v4 prototype’s review scope.`);
  else if (["view-provenance", "view-art-history", "view-diff", "regenerate-brief", "change-date", "download-placeholder", "trash-placeholder", "journal-menu", "correct-text", "export-placeholder", "regenerate-reflection", "generation-details"].includes(action)) {
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
    state.selectedDate = null;
    state.focusDate = `${state.month}-01`;
    state.focusAfterRender = `[data-calendar-date="${state.focusDate}"]`;
    syncUrl();
    render();
    return true;
  }

  const dateCells = [...cell.closest(".calendar-grid").querySelectorAll("[data-calendar-date]")];
  const index = dateCells.indexOf(cell);
  const weekOffset = (index + leadingCalendarCells(state.month)) % 7;
  const offset =
    key === "ArrowLeft" ? -1 : key === "ArrowRight" ? 1 : key === "ArrowUp" ? -7 : key === "ArrowDown" ? 7 : key === "Home" ? -weekOffset : 6 - weekOffset;
  const target = dateCells[Math.max(0, Math.min(dateCells.length - 1, index + offset))];
  dateCells.forEach((dateCell) => { dateCell.tabIndex = -1; });
  if (target) {
    state.focusDate = target.dataset.calendarDate;
    target.tabIndex = 0;
    target.focus();
  }
  return true;
}

function handleKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase("en-IN") === "k" && !state.modal) {
    event.preventDefault();
    if (state.view !== "search") setView("search");
    else root.querySelector("#archive-search-input-v4")?.focus();
    return;
  }
  if (event.key === "Escape" && state.modal) {
    closeModal();
    return;
  }
  if (event.key === "Escape" && state.view === "calendar" && state.screen === "month" && state.selectedDate) {
    const previousDate = state.selectedDate;
    state.selectedDate = null;
    state.focusDate = previousDate;
    state.focusAfterRender = `[data-calendar-date="${previousDate}"]`;
    syncUrl({ push: true });
    render();
    return;
  }
  if (event.key === "Tab" && state.modal) {
    const modal = modalRoot.querySelector("[data-modal-card]");
    const focusable = modal
      ? [...modal.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hidden && element.getClientRects().length)
      : [];
    if (!focusable.length) {
      event.preventDefault();
      modal?.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === modal)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
    return;
  }
  if (handleCalendarKeyboard(event)) return;
}

function handleSubmit(event) {
  const form = event.target.closest('[data-action="search-form"]');
  if (!form) return;
  event.preventDefault();
  state.searchQuery = new FormData(form).get("query")?.toString().trim() || "";
  state.focusAfterRender = "#archive-search-input-v4";
  syncUrl();
  render();
}

function handlePopState() {
  const params = new URLSearchParams(window.location.search);
  state.scrollByView[state.view] = window.scrollY;
  const nextView = params.get("view");
  state.view = allowedViews.has(nextView) ? nextView : "calendar";
  const nextMonth = params.get("month");
  const nextDate = params.get("date");
  if (isMonthKey(nextMonth)) state.month = nextMonth;
  else if (isDateKey(nextDate)) state.month = nextDate.slice(0, 7);
  state.selectedDate = isDateKey(nextDate) && days[nextDate] ? nextDate : null;
  state.focusDate = state.selectedDate || (state.month === today.slice(0, 7) ? today : `${state.month}-01`);
  state.screen = state.view === "calendar" && params.get("screen") === "day" && days[state.selectedDate] ? "day" : "month";
  state.searchQuery = params.get("q") || "";
  state.almanacCollapsed = params.get("rail") === "collapsed";
  state.modal = null;
  state.focusAfterRender = state.view === "search" ? "#archive-search-input-v4" : `[data-action="set-view"][data-view="${state.view}"]`;
  render();
  restoreViewScroll(state.view);
}

root.addEventListener("click", handleClick);
root.addEventListener("submit", handleSubmit);
modalRoot.addEventListener("click", handleClick);
modalRoot.addEventListener("change", handleChange);
document.addEventListener("keydown", handleKeydown);
window.addEventListener("popstate", handlePopState);

render();
