/*
 * PROTOTYPE ONLY — Life in Days v8 Cross-month Almanac contract completion.
 * All data and mutations are simulated in memory. There are no integrations.
 */

const root = document.querySelector("#prototype-root");
const modalRoot = document.querySelector("#modal-root");
const calendarStatusLive = document.querySelector("#calendar-status-live-v8");
const almanacStatusLive = document.querySelector("#almanac-status-live-v8");
const toastRegion = document.querySelector("#toast-region");
const calendarSelectionSheetQuery = window.matchMedia("(max-width: 960px)");
if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

const SYNTHETIC_NOTICE = "Fictional sample written only for this design prototype.";
const today = "2026-08-13";
const prototypeNewestMonth = "2026-08";
const prototypeOldestMonth = "2026-05";

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
      "A short fictional entry notices the changing light before a storm and the relief of finishing one small task. The authentic source journal remains available in the full Journal Day; this generated summary is only a navigational aid.",
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
  "2026-06-27": {
    date: "2026-06-27",
    title: "Tea before the city woke",
    titleStatus: "AI-generated",
    summary:
      "A fictional early-morning journal remembers two cups of tea on a quiet balcony before the nearby streets became busy. The photograph remains the authentic Calendar Cover; this short generated summary is only a reading aid for the archive.",
    summaryStatus: "AI-generated",
    tags: ["balcony", "morning", "tea"],
    tagsStatus: "AI-generated",
    photos: [
      {
        id: "p-june-balcony",
        src: "assets/photo-balcony-cups.svg",
        alt: "Synthetic balcony fixture with two cups, plants, and distant city lights",
        caption: "Tea before the street grew busy",
        timestamp: "27 Jun 2026, 6:18 am IST",
        isCover: true,
      },
    ],
    artworks: [],
    journals: [
      {
        id: "v-june-27",
        kind: "VoiceNotes journal",
        title: "Early balcony — synthetic fixture",
        timestamp: "27 Jun 2026, 7:02 am IST",
        status: "Upstream current",
        text: `${SYNTHETIC_NOTICE} I carried tea outside before the street woke. The plants were still wet, the air was cool, and for a few minutes the whole neighbourhood seemed to be holding its breath.`,
      },
    ],
  },
  "2026-06-09": {
    date: "2026-06-09",
    title: "A long table, finally clear",
    titleStatus: "AI-generated",
    summary:
      "A fictional journal describes an unhurried afternoon spent sorting a crowded table, returning books to their shelves, and finishing several small tasks that had been postponed. Nothing dramatic happened, but the gradual clearing made the room feel easier to inhabit. By evening, the open surface became a place for dinner rather than another reminder of unfinished work. The entry notices that practical care can change the emotional weight of a space without needing to become a grand project.",
    summaryStatus: "AI-generated",
    tags: ["home", "reset", "small tasks"],
    tagsStatus: "AI-generated",
    photos: [],
    artworks: [],
    journals: [
      {
        id: "u-june-09",
        kind: "Uploaded journal",
        title: "clear-table.md",
        timestamp: "9 Jun 2026, 8:14 pm IST",
        status: "Current displayed version",
        text: `${SYNTHETIC_NOTICE} I worked through the table one small pile at a time, returned the books, and finished the notes I had been avoiding. By dinner there was room to sit without moving anything first.`,
      },
    ],
  },
  "2026-05-31": {
    date: "2026-05-31",
    title: "The path through late light",
    titleStatus: "AI-generated",
    summary:
      "A fictional end-of-month note follows a quiet walk as late sunlight made an ordinary path feel briefly unfamiliar. Generated artwork is the Calendar Cover because the day has no Daily Photo.",
    summaryStatus: "AI-generated",
    tags: ["walk", "late light", "month end"],
    tagsStatus: "AI-generated",
    photos: [],
    artworks: [
      {
        id: "a-may-path",
        src: "assets/art-golden-path.svg",
        alt: "AI artwork for 31 May 2026 showing a symbolic golden path",
        brief: "A narrow gold path crossing a quiet landscape at the end of the day; painterly, symbolic, and non-photorealistic.",
        created: "1 Jun 2026, 1:03 am IST",
        trigger: "01:00 Artwork Sweep",
        active: true,
      },
    ],
    journals: [
      {
        id: "v-may-31",
        kind: "VoiceNotes journal",
        title: "Month-end walk — synthetic fixture",
        timestamp: "31 May 2026, 8:03 pm IST",
        status: "Upstream current",
        text: `${SYNTHETIC_NOTICE} The path looked ordinary when I started and almost golden by the time I turned home. It was a quiet ending to the month.`,
      },
    ],
  },
  "2026-05-14": {
    date: "2026-05-14",
    title: "Colour at the corner stall",
    titleStatus: "AI-generated",
    summary:
      "A fictional weekday errand pauses at a flower stall, where a small burst of colour interrupts an otherwise practical afternoon. The real photograph remains the Calendar Cover.",
    summaryStatus: "AI-generated",
    tags: ["flowers", "errand", "colour"],
    tagsStatus: "AI-generated",
    photos: [
      {
        id: "p-may-flowers",
        src: "assets/photo-market-flowers.svg",
        alt: "Synthetic flower-market fixture with orange, cream, and red flowers",
        caption: "Colour at the corner stall",
        timestamp: "14 May 2026, 4:46 pm IST",
        isCover: true,
      },
    ],
    artworks: [],
    journals: [
      {
        id: "v-may-14",
        kind: "VoiceNotes journal",
        title: "Corner stall — synthetic fixture",
        timestamp: "14 May 2026, 6:10 pm IST",
        status: "Upstream current",
        text: `${SYNTHETIC_NOTICE} I stopped for flowers while finishing errands. The colour felt unusually bright against the grey afternoon, so I brought a small bundle home.`,
      },
    ],
  },
};

// Explicitly non-live fixtures exist only to prove that ordinary Almanac rendering
// never admits Trash-only or history-only records. Their sentinel text must never
// be interpolated into the product DOM, accessible names, counts, or jump metadata.
const excludedAlmanacFixtures = Object.freeze({
  "2026-06-20": { lifecycle: "trash-only", sentinel: "V8_TRASH_ONLY_JUNE_20" },
  "2026-05-18": { lifecycle: "history-only", sentinel: "V8_HISTORY_ONLY_MAY_18" },
});

function stripLegacySearchQueryFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("q")) return url;
  url.searchParams.delete("q");
  // Replace the legacy entry with the prototype's known-safe navigation shape.
  window.history.replaceState(null, "", url);
  return url;
}

const initialUrl = stripLegacySearchQueryFromUrl();
const initialParams = initialUrl.searchParams;
const requestedView = initialParams.get("view");
const requestedDate = initialParams.get("date");
const requestedMonth = initialParams.get("month");
const requestedThrough = initialParams.get("through");
const requestedSettingsSection = initialParams.get("section");
const allowedViews = new Set(["calendar", "almanac", "search", "settings"]);
const allowedSettingsSections = new Set(["overview", "journal", "integrations", "ai", "appearance"]);
const allowedThemePreferences = new Set(["device", "light", "dark"]);
const savedThemePreference = window.localStorage.getItem("life-in-days-v8-theme") || "device";
const isMonthKey = (value) => /^(?!0000)\d{4}-(0[1-9]|1[0-2])$/.test(value || "");
const isDateKey = (value) => isMonthKey(String(value || "").slice(0, 7)) && datesForMonth(String(value).slice(0, 7)).includes(value);
const monthOrdinal = (monthKey) => {
  const [year, month] = String(monthKey).split("-").map(Number);
  return year * 12 + month - 1;
};
const monthIsWithinPrototypeRange = (monthKey) =>
  monthOrdinal(monthKey) >= monthOrdinal(prototypeOldestMonth)
  && monthOrdinal(monthKey) <= monthOrdinal(prototypeNewestMonth);
const normalizeAlmanacRange = (newest, oldest, liveDate = null) => {
  const anchorMonth = liveDate && days[liveDate] ? liveDate.slice(0, 7) : null;
  if (anchorMonth && (!monthIsWithinPrototypeRange(newest) || !monthIsWithinPrototypeRange(anchorMonth))) {
    return { newest: anchorMonth, oldest: anchorMonth };
  }
  if (!isMonthKey(newest)) newest = prototypeNewestMonth;
  if (!isMonthKey(oldest) || monthOrdinal(oldest) > monthOrdinal(newest)) oldest = newest;
  if (monthIsWithinPrototypeRange(newest) && monthOrdinal(oldest) < monthOrdinal(prototypeOldestMonth)) {
    oldest = prototypeOldestMonth;
  }
  // A distant synthetic jump is always a one-month window; never enumerate
  // the calendar distance back to the fixed 2026 evidence range.
  if (!monthIsWithinPrototypeRange(newest)) oldest = newest;
  if (anchorMonth && monthIsWithinPrototypeRange(newest) && monthIsWithinPrototypeRange(anchorMonth)) {
    if (monthOrdinal(anchorMonth) > monthOrdinal(newest)) newest = anchorMonth;
    if (monthOrdinal(anchorMonth) < monthOrdinal(oldest)) oldest = anchorMonth;
  }
  return { newest, oldest };
};
const initialView = allowedViews.has(requestedView) ? requestedView : "calendar";
let initialMonth = isMonthKey(requestedMonth) ? requestedMonth : isDateKey(requestedDate) ? requestedDate.slice(0, 7) : "2026-08";
let initialAlmanacThrough = isMonthKey(requestedThrough) && monthOrdinal(requestedThrough) <= monthOrdinal(initialMonth)
  ? requestedThrough
  : initialMonth;
if (initialView === "almanac") {
  const initialLiveDate = isDateKey(requestedDate) && days[requestedDate] ? requestedDate : null;
  const normalized = normalizeAlmanacRange(initialMonth, initialAlmanacThrough, initialLiveDate);
  initialMonth = normalized.newest;
  initialAlmanacThrough = normalized.oldest;
}
const initialFocusDate = datesForMonth(initialMonth).includes(requestedDate)
  ? requestedDate
  : initialMonth === today.slice(0, 7) ? today : `${initialMonth}-01`;
const initialSelectedDate = initialView === "calendar"
  ? isDateKey(requestedDate) && days[requestedDate] && requestedDate.startsWith(`${initialMonth}-`) ? requestedDate : null
  : initialView === "almanac" && isDateKey(requestedDate) && days[requestedDate] ? requestedDate : null;
const state = {
  view: initialView,
  month: initialMonth,
  calendarMonth: initialMonth,
  almanacMonth: initialMonth,
  almanacThrough: initialAlmanacThrough,
  almanacVisibleMonth: initialSelectedDate?.slice(0, 7) || initialMonth,
  almanacVisibleDate: initialSelectedDate,
  almanacStatus: "idle",
  almanacStatusMessage: "",
  almanacFailNext: false,
  almanacEmptyArchive: false,
  almanacLoadRequestId: 0,
  almanacReturnFocusDate: null,
  almanacLastFocusAction: null,
  almanacPendingDestination: null,
  almanacRestoringHistory: false,
  selectedDate: initialSelectedDate,
  focusDate: initialFocusDate,
  screen: initialParams.get("screen") === "day" && initialSelectedDate ? "day" : "month",
  themePreference: allowedThemePreferences.has(savedThemePreference) ? savedThemePreference : "device",
  settingsSection: allowedSettingsSections.has(requestedSettingsSection) ? requestedSettingsSection : "overview",
  galleryIndex: {},
  generation: {},
  // Search terms intentionally live only in this running JavaScript instance.
  searchQuery: "",
  searchDraft: "",
  searchReturnView: "calendar",
  almanacCollapsed: initialParams.get("rail") === "collapsed" || window.localStorage.getItem("life-in-days-v8-almanac-collapsed") === "true",
  pendingChapterScroll: false,
  scrollByView: { calendar: 0, almanac: 0, search: 0, settings: 0 },
  viewMemory: { calendar: null, almanac: null, search: null, settings: null },
  almanacReadingAnchor: null,
  pendingInputSelection: null,
  searchSelection: null,
  transientFocusSelector: null,
  pendingDrawerFocusSelector: null,
  modal: null,
  focusAfterRender: null,
  monthAnnouncement: "",
  pendingSelectionCloseFocus: null,
};

// A safe deep link may name a Journal Date without exposing any private content.
// Queue that chapter as the first reading destination so the URL, viewport,
// keyboard focus, and Almanac index all describe the same place after reload.
if (state.view === "almanac" && state.screen === "month" && state.selectedDate) {
  state.almanacPendingDestination = {
    selector: `#chapter-${state.selectedDate}`,
    announcement: `Showing ${longDate(state.selectedDate)} in the Almanac.`,
  };
}

// Browser history carries only an opaque entry key. Scroll, focus, transient
// input state, and prototype-only flags stay in this tab's memory and vanish
// on reload. This keeps private reading context out of browser history.
const historyEntries = new Map();
let historyEntryCounter = 0;
const nextHistoryEntryId = () => `e${++historyEntryCounter}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;

const html = (value = "") =>
  String(value).replace(
    /[&<>'"]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character],
  );

function dateParts(date) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

function utcCalendarDate(year, month, day) {
  const value = new Date(0);
  value.setUTCHours(0, 0, 0, 0);
  value.setUTCFullYear(year, month - 1, day);
  return value;
}

function longDate(date) {
  const { year, month, day } = dateParts(date);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(utcCalendarDate(year, month, day));
}

function shortDate(date) {
  const { year, month, day } = dateParts(date);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  }).format(utcCalendarDate(year, month, day));
}

function monthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const monthName = new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", month: "long" }).format(utcCalendarDate(2026, month, 1));
  return `${monthName} ${String(year).padStart(4, "0")}`;
}

function shiftMonth(monthKey, delta) {
  const [year, month] = monthKey.split("-").map(Number);
  const shifted = utcCalendarDate(year, month + delta, 1);
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
}

function shiftDate(date, deltaDays) {
  const { year, month, day } = dateParts(date);
  const shifted = utcCalendarDate(year, month, day + deltaDays);
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}-${String(shifted.getUTCDate()).padStart(2, "0")}`;
}

function dateForMonthDay(monthKey, requestedDay) {
  const dates = datesForMonth(monthKey);
  return dates[Math.min(Math.max(1, requestedDay), dates.length) - 1];
}

function datesForMonth(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const count = utcCalendarDate(year, month + 1, 0).getUTCDate();
  return Array.from({ length: count }, (_, index) => `${year}-${String(month).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`);
}

function leadingCalendarCells(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const sundayFirst = utcCalendarDate(year, month, 1).getUTCDay();
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
  const states = [date === today ? "Today" : "", date === state.selectedDate ? "Selected" : ""].filter(Boolean);
  if (!day) return `${longDate(date)}, no Journal Day${states.length ? `, ${states.join(", ")}` : ""}`;
  const { photoCount, journalCount } = dayCounts(day);
  const cover = calendarCover(day);
  const counts = `${photoCount} ${photoCount === 1 ? "photo" : "photos"}, ${journalCount} ${journalCount === 1 ? "journal" : "journals"}`;
  const coverDescription = day.imageFailed
    ? "no cover image, Image unavailable"
    : cover?.kind === "photo"
      ? "Telegram photo cover"
      : cover?.kind === "artwork"
        ? "AI artwork cover"
        : "no cover image";
  const attention = day.attention ? `, needs attention: ${day.attention}` : "";
  return `${longDate(date)}, ${counts}, ${coverDescription}${attention}${states.length ? `, ${states.join(", ")}` : ""}`;
}

function populatedDates(monthKey = state.month) {
  if (state.almanacEmptyArchive) return [];
  return Object.keys(days)
    .filter((date) => date.startsWith(`${monthKey}-`))
    .sort();
}

function visibleJournalDays() {
  if (state.almanacEmptyArchive) return [];
  return Object.values(days).sort((a, b) => b.date.localeCompare(a.date));
}

function liveDaysInMonth(monthKey) {
  return visibleJournalDays().filter((day) => day.date.startsWith(`${monthKey}-`));
}

function almanacLoadedMonths() {
  if (!monthIsWithinPrototypeRange(state.almanacMonth)) return [state.almanacMonth];
  const months = [];
  let cursor = state.almanacMonth;
  const oldest = monthOrdinal(state.almanacThrough) < monthOrdinal(prototypeOldestMonth)
    ? prototypeOldestMonth
    : state.almanacThrough;
  while (isMonthKey(cursor) && monthOrdinal(cursor) >= monthOrdinal(oldest)) {
    months.push(cursor);
    if (cursor === oldest) break;
    cursor = shiftMonth(cursor, -1);
  }
  return months;
}

function loadedAlmanacDays() {
  const loaded = new Set(almanacLoadedMonths());
  return visibleJournalDays().filter((day) => loaded.has(day.date.slice(0, 7)));
}

function almanacRangeLabel() {
  const newest = state.almanacMonth;
  const oldest = state.almanacThrough;
  return newest === oldest ? monthLabel(newest) : `${monthLabel(oldest)}–${monthLabel(newest)}`;
}

function isAlmanacAtBeginning() {
  return monthIsWithinPrototypeRange(state.almanacMonth)
    && monthOrdinal(state.almanacThrough) <= monthOrdinal(prototypeOldestMonth);
}

function almanacCoverLabel(day) {
  const cover = calendarCover(day);
  if (day.imageFailed) return "Calendar Cover unavailable";
  if (cover?.kind === "photo") return "Calendar Cover · Telegram photo";
  if (cover?.kind === "artwork") return "Calendar Cover · AI artwork";
  return "No cover image · Journal only";
}

function almanacCoverIndicator(day) {
  const cover = calendarCover(day);
  if (day.imageFailed) return "Cover unavailable";
  if (cover?.kind === "photo") return "Real photo";
  if (cover?.kind === "artwork") return "AI artwork";
  return "Journal only";
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
      <strong>Throwaway UI prototype · v8</strong>
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

function resolvedTheme() {
  if (state.themePreference === "device") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return state.themePreference;
}

function themeButton() {
  const current = resolvedTheme();
  const next = current === "light" ? "dark" : "light";
  return `<button class="theme-button" type="button" data-action="toggle-theme" aria-label="Use ${next} theme" title="Use ${next} theme">${next === "dark" ? "Dark" : "Light"}</button>`;
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
      <button class="${state.view === "settings" ? "is-active" : ""}" type="button" data-action="open-more" aria-haspopup="dialog" ${state.view === "settings" ? 'aria-current="page"' : ""}>More</button>
    </nav>`;
}

function calendarTile(date, mode) {
  const day = state.almanacEmptyArchive ? null : days[date];
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
      ${date === today ? 'aria-current="date"' : ""}
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
      ${day && !cover && !day.imageFailed ? `<span class="paper-day"><strong>${html(day.title)}</strong><small>${counts.journalCount} ${counts.journalCount === 1 ? "journal" : "journals"}</small></span>` : ""}
      ${day && cover && !isMosaic ? `<span class="tile-caption"><strong>${html(day.title)}</strong><small>${counts.label}</small></span>` : ""}
      ${day?.attention && !isMosaic ? `<span class="attention-dot" title="${html(day.attention)}"><span aria-hidden="true">!</span><span class="sr-only">${html(day.attention)}</span></span>` : ""}
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
      ${populatedDates().length ? "" : '<p class="empty-month-note">No journaled days in this month.</p>'}
    </div>`;
}

function chapterMedia(day) {
  const cover = calendarCover(day);
  const counts = dayCounts(day);
  if (day.imageFailed) {
    return `<div class="almanac-cover-fallback is-unavailable"><span aria-hidden="true">${dateParts(day.date).day}</span><div><strong class="almanac-cover-provenance-v8">${almanacCoverLabel(day)}</strong><p>Image unavailable · The Journal Day remains readable.</p></div></div>`;
  }
  if (!cover) {
    return `<div class="almanac-cover-fallback"><span aria-hidden="true">${dateParts(day.date).day}</span><div><strong class="almanac-cover-provenance-v8">${almanacCoverLabel(day)}</strong><p>The full Journal Day remains available to read.</p></div></div>`;
  }
  const description = cover.kind === "photo" ? cover.caption : "Derived from a minimized Visual Brief";
  const extraPhotos = cover.kind === "photo" && counts.photoCount > 1 ? ` · +${counts.photoCount - 1} photo${counts.photoCount - 1 === 1 ? "" : "s"}` : "";
  return `
    <figure class="almanac-cover-figure ${cover.kind === "artwork" ? "is-artwork" : "is-photo"}">
      <div class="almanac-cover-frame"><img src="${html(cover.src)}" alt="${html(cover.alt)}" /></div>
      <figcaption><strong>${almanacCoverLabel(day)}</strong><span>${html(description)}${extraPhotos}</span></figcaption>
    </figure>`;
}

function almanacChapter(day) {
  const counts = dayCounts(day);
  const isCurrent = state.almanacVisibleDate === day.date;
  return `
    <article class="almanac-chapter almanac-chapter-v8 ${state.selectedDate === day.date ? "is-selected" : ""} ${isCurrent ? "is-current" : ""}" id="chapter-${day.date}" data-chapter-date="${day.date}" aria-labelledby="almanac-day-title-${day.date}" tabindex="-1">
      <header class="almanac-chapter-heading-v8">
        <div>
          <p class="almanac-chapter-date-v8">${longDate(day.date)} · ${counts.label}</p>
          <span class="almanac-title-origin-v8">Generated title · reading aid</span>
          <h3 id="almanac-day-title-${day.date}">${html(day.title)}</h3>
        </div>
        ${day.attention && !day.imageFailed ? '<span class="almanac-review-state">Review update</span>' : ""}
      </header>
      ${chapterMedia(day)}
      <div class="almanac-reflection-preview-v8">
        <p class="eyebrow">Generated reflection · reading aid</p>
        <p class="almanac-summary-preview-v8">${html(day.summary)}</p>
        <ul aria-label="Selected tags">${day.tags.slice(0, 3).map((tag) => `<li>${html(tag)}</li>`).join("")}</ul>
      </div>
      <footer class="chapter-footer">
        <button type="button" class="primary-button almanac-read-day" data-action="open-full-day" data-date="${day.date}" aria-label="Read full Journal Day for ${longDate(day.date)}">Read full Journal Day</button>
        <button type="button" class="text-button" data-action="open-upload" data-date="${day.date}">Upload journal for this date</button>
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
      <div class="topbar-actions">
        <button class="settings-quiet ${state.view === "settings" ? "is-active" : ""}" type="button" data-action="open-settings" ${state.view === "settings" ? 'aria-current="page"' : ""}>Settings</button>
        ${themeButton()}
        <button class="upload-quiet" type="button" data-action="open-upload">Add journal</button>
      </div>
    </header>`;
}

function calendarSelection(day) {
  if (!day) return "";
  const cover = calendarCover(day);
  const counts = dayCounts(day);
  const sourceLabel = day.imageFailed ? "Calendar Cover unavailable" : cover?.kind === "photo" ? "Calendar Cover · Telegram photo" : cover?.kind === "artwork" ? "Calendar Cover · AI artwork" : "No cover image · Journal only";
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
          ${day.attention ? `<div class="museum-attention"><strong>Needs attention</strong><span>${html(day.attention)}</span></div>` : ""}
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
  const day = !state.almanacEmptyArchive && state.selectedDate ? days[state.selectedDate] : null;
  if (state.screen === "day" && day) {
    return `<main id="prototype-main" class="mosaic-day-page" tabindex="-1">${dayDetail(day, "mosaic")}</main>`;
  }
  return `
    <main id="prototype-main" class="mosaic-calendar-page ${day ? "has-calendar-selection" : "is-calendar-landing"}" tabindex="-1">
      <div class="mosaic-calendar-layout">
        <section class="mosaic-calendar-column" aria-labelledby="month-heading-mosaic-v8">
          <section class="mosaic-intro">
            <div><p class="eyebrow">A private month in pictures</p><h1 id="month-heading-mosaic-v8"><button type="button" class="month-year-trigger" data-action="open-month-chooser" aria-haspopup="dialog" aria-label="Choose month and year, currently showing ${monthLabel(state.month)}"><span>${monthLabel(state.month)}</span><span aria-hidden="true">⌄</span></button></h1></div>
            ${day ? "" : "<p>Recognize a day by its texture. Open it when you want the full, authentic record.</p>"}
          </section>
          <div class="mosaic-month-actions">
            <button type="button" class="icon-button" data-action="previous-month" aria-label="Previous month">←</button>
            <span>Monday first · Asia/Kolkata</span>
            <button type="button" class="today-button" data-action="today" aria-label="Go to today, 13 August 2026">Today</button>
            <button type="button" class="icon-button" data-action="next-month" aria-label="Next month">→</button>
          </div>
          ${calendarGrid("mosaic", "month-heading-mosaic-v8")}
          ${day ? '<p class="mosaic-selection-note">Recognize a day by its texture. Open it when you want the full, authentic record.</p>' : ""}
        </section>
        ${calendarSelection(day)}
      </div>
    </main>`;
}

function almanacNavigatorContent(context = "desktop") {
  const loadedMonths = almanacLoadedMonths();
  const activeMonth = state.almanacVisibleMonth || state.almanacMonth;
  return `
    <div class="almanac-index-content-v8" id="almanac-index-content-${context}-v8">
      <header class="almanac-index-heading-v8"><p class="eyebrow">Chronological index</p><h2>${context === "drawer" ? "Almanac index" : "Browse the Almanac"}</h2></header>
      <button type="button" class="secondary-button almanac-jump-trigger-v8" data-action="open-almanac-jump" aria-haspopup="dialog">Jump to month and year</button>
      <nav class="almanac-volume-nav-v8" aria-label="Loaded Almanac volumes">
        <p>Loaded volumes</p>
        ${loadedMonths.map((monthKey) => {
          const monthDays = liveDaysInMonth(monthKey);
          const monthIsActive = activeMonth === monthKey;
          return `<section class="almanac-index-volume-v8 ${monthIsActive ? "is-current" : ""}" data-index-month="${monthKey}">
            <button type="button" class="almanac-index-month-v8" data-action="select-almanac-month" data-month-key="${monthKey}" ${monthIsActive && !state.almanacVisibleDate ? 'aria-current="location"' : ""}>
              <strong>${monthLabel(monthKey)}</strong><span>${monthDays.length} Journal ${monthDays.length === 1 ? "Day" : "Days"}</span>
            </button>
            ${monthDays.length ? `<ol>${monthDays.map((day) => `<li><button type="button" data-action="select-almanac-chapter" data-date="${day.date}" ${state.almanacVisibleDate === day.date ? 'aria-current="location"' : ""}><span><strong>${shortDate(day.date)}</strong>${html(day.title)}</span><small>${almanacCoverIndicator(day)}</small></button></li>`).join("")}</ol>` : '<p class="almanac-index-empty-v8">No Journal Days</p>'}
          </section>`;
        }).join("")}
      </nav>
      <button class="upload-primary" type="button" data-action="open-upload">Upload journal</button>
      <p class="almanac-timezone">Journal Dates use Asia/Kolkata</p>
    </div>`;
}

function almanacIndexV8() {
  const collapsed = state.almanacCollapsed;
  return `
    <aside class="almanac-index almanac-index-v8 ${collapsed ? "is-collapsed" : ""}" aria-label="Almanac index">
      <button type="button" class="almanac-rail-toggle" data-action="toggle-almanac-rail" aria-controls="almanac-index-content-desktop-v8" aria-expanded="${!collapsed}">
        <strong>${collapsed ? "Show index" : "Hide index"}</strong><span>${collapsed ? monthLabel(state.almanacVisibleMonth || state.almanacMonth) : "Immersive reading"}</span>
      </button>
      <div ${collapsed ? 'hidden inert aria-hidden="true"' : ""}>${almanacNavigatorContent("desktop")}</div>
    </aside>`;
}

function almanacPagination() {
  const count = loadedAlmanacDays().length;
  const atBeginning = isAlmanacAtBeginning();
  const status = state.almanacStatus;
  if (!monthIsWithinPrototypeRange(state.almanacMonth)) {
    return `<section class="almanac-pagination-v8" aria-label="Return to the fictional Almanac evidence window"><p>${monthLabel(state.almanacMonth)} is a quiet browse target outside the fictional May–August 2026 evidence window.</p><button type="button" class="primary-button" data-action="almanac-today">Return to newest days</button></section>`;
  }
  return `
    <section class="almanac-pagination-v8" aria-label="Load earlier Journal Days" aria-busy="${status === "loading"}">
      <p>Showing ${count} Journal ${count === 1 ? "Day" : "Days"} from ${almanacRangeLabel()}</p>
      ${status === "error" ? `<div class="almanac-load-error-v8" role="alert"><strong>Earlier Journal Days could not be loaded.</strong><span>What is already shown is unchanged.</span></div><button type="button" class="primary-button" data-action="retry-load-earlier">Retry loading earlier days</button>`
        : atBeginning ? '<div class="almanac-beginning-v8"><button type="button" class="primary-button" data-action="almanac-beginning" aria-disabled="true">Beginning of this prototype archive</button><span>No earlier live Journal Days are available.</span></div>'
          : `<button type="button" class="primary-button" data-action="load-earlier" ${status === "loading" ? 'aria-disabled="true"' : ""}>${status === "loading" ? "Loading earlier days" : "Load earlier days"}</button>`}
      ${!atBeginning && status === "idle" ? '<button type="button" class="prototype-state-control-v8" data-action="simulate-load-failure">Prototype state · fail next load</button>' : ""}
      ${status === "idle" ? '<button type="button" class="prototype-state-control-v8" data-action="simulate-empty-archive">Prototype state · empty archive</button>' : ""}
    </section>`;
}

function almanacVolumeMarkup(monthKey) {
  const monthDays = liveDaysInMonth(monthKey);
  if (!monthDays.length) return "";
  return `<section class="almanac-volume-v8" id="volume-${monthKey}" data-almanac-month="${monthKey}" aria-labelledby="volume-title-${monthKey}">
    <header class="almanac-volume-heading-v8" tabindex="-1"><p>Volume ${monthKey.slice(5)} · ${monthKey.slice(0, 4)}</p><div><h2 id="volume-title-${monthKey}">${monthLabel(monthKey)}</h2><span>${monthDays.length} Journal ${monthDays.length === 1 ? "Day" : "Days"}</span></div></header>
    <div class="almanac-volume-days-v8">${monthDays.map((day) => almanacChapter(day)).join('<div class="chapter-divider-v8" aria-hidden="true"></div>')}</div>
  </section>`;
}

function renderAlmanacView() {
  const selectedDay = state.selectedDate ? days[state.selectedDate] : null;
  if (state.screen === "day" && selectedDay) {
    return `<main id="prototype-main" class="mosaic-day-page almanac-day-page-v8" tabindex="-1">${dayDetail(selectedDay, "almanac")}</main>`;
  }
  const loadedMonths = almanacLoadedMonths();
  const populatedGroups = loadedMonths.map((monthKey) => ({ monthKey, days: liveDaysInMonth(monthKey) })).filter((group) => group.days.length);
  const archiveIsEmpty = state.almanacEmptyArchive && !visibleJournalDays().length;
  const onlyMonthIsEmpty = loadedMonths.length === 1 && !populatedGroups.length;
  return `
    <div class="almanac-mobile-toolbar">
      <button type="button" class="secondary-button" data-action="open-almanac-drawer" aria-haspopup="dialog">Browse Almanac</button>
      <span data-almanac-toolbar-month>${monthLabel(state.almanacVisibleMonth || state.almanacMonth)}</span>
    </div>
    <div class="almanac-shell almanac-shell-v8 ${state.almanacCollapsed ? "is-collapsed" : ""}">
      ${almanacIndexV8()}
      <main id="prototype-main" class="almanac-reading" tabindex="-1">
        <header class="almanac-title-page almanac-title-page-v8">
          <div><p class="eyebrow">Chronological Almanac</p><h1>Almanac</h1></div>
          <div class="almanac-title-actions"><button type="button" class="today-button" data-action="almanac-today">Today</button></div>
          <p>Your Journal Days, arranged from newest to oldest.</p>
          <small>Live Journal Days only · Asia/Kolkata</small>
        </header>
        ${archiveIsEmpty ? `<section class="almanac-empty almanac-empty-v8 almanac-archive-empty-v8" aria-labelledby="archive-empty-title-v8"><p class="eyebrow">Private archive</p><h2 id="archive-empty-title-v8" tabindex="-1">No live Journal Days are available to read.</h2><p>Calendar browsing and text upload remain available without implying that setup is complete.</p><div><button type="button" class="secondary-button" data-action="set-view" data-view="calendar">View Calendar</button><button type="button" class="primary-button" data-action="open-upload">Upload journal</button></div><button type="button" class="prototype-state-control-v8" data-action="restore-sample-archive">Prototype state · restore sample archive</button></section>` : `<div id="almanac-volumes-v8">${populatedGroups.map(({ monthKey }) => almanacVolumeMarkup(monthKey)).join("")}</div>
        ${onlyMonthIsEmpty ? `<section class="almanac-empty almanac-empty-v8" id="volume-${state.almanacMonth}" data-almanac-month="${state.almanacMonth}" aria-labelledby="empty-volume-title-v8"><p class="eyebrow">${monthLabel(state.almanacMonth)}</p><h2 id="empty-volume-title-v8" tabindex="-1">No journaled days in this month.</h2><p>This month remains part of the archive without being marked incomplete.</p><button type="button" class="secondary-button" data-action="almanac-today">Return to newest days</button></section>` : ""}
        ${almanacPagination()}`}
      </main>
    </div>`;
}

function searchResults(query) {
  const needle = query.trim().toLocaleLowerCase("en-IN");
  return (state.almanacEmptyArchive ? [] : Object.values(days))
    .filter((day) => !needle || [day.title, day.summary, day.tags.join(" "), combinedJournalText(day)].join(" ").toLocaleLowerCase("en-IN").includes(needle))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function renderSearchView() {
  const hasQuery = Boolean(state.searchQuery);
  const results = hasQuery ? searchResults(state.searchQuery) : [];
  return `
    <main id="prototype-main" class="search-page-v8" tabindex="-1">
      <header class="search-heading-v8">
        <p class="eyebrow">Private deterministic search</p>
        <h1>Search your archive</h1>
        <p>Find literal words in the authentic record without suggestions, generated answers, or fuzzy interpretation.</p>
      </header>
      <form class="archive-search-v8" data-action="search-form" role="search">
        <label for="archive-search-input-v8">Words or exact phrase</label>
        <div><input id="archive-search-input-v8" type="search" value="${html(state.searchDraft)}" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Enter literal text" /><button class="primary-button" type="submit">Search archive</button></div>
      </form>
      <section class="search-results-v8" aria-live="polite" aria-labelledby="search-results-heading-v8">
        ${!hasQuery ? `
          <div class="search-initial-v8">
            <p class="eyebrow">Search without guesswork</p>
            <h2 id="search-results-heading-v8" tabindex="-1">Only the words you enter</h2>
            <p>This version searches literal text in titles, summaries, stored topics, and displayed journal text. It does not infer alternatives or generate an answer.</p>
            <dl>
              <div><dt>Private in this page</dt><dd>Search terms are not added to the address, page title, or persistent browser storage.</dd></div>
              <div><dt>Current archive only</dt><dd>Photo captions, dates, and historical versions remain outside this first privacy correction and are tracked for the complete lexical-search version.</dd></div>
              <div><dt>No AI or image search</dt><dd>No semantic similarity, OCR, image recognition, or conversational retrieval is used.</dd></div>
            </dl>
          </div>` : `
          <div class="search-results-heading-v8"><h2 id="search-results-heading-v8" tabindex="-1">${results.length} ${results.length === 1 ? "Journal Day" : "Journal Days"}</h2>${results.length ? '<button type="button" class="text-button" data-action="clear-search">Clear search</button>' : ""}</div>
          ${results.length ? `<div class="search-result-grid-v8">${results.map((day) => {
          const cover = calendarCover(day);
          const counts = dayCounts(day);
          return `<button type="button" class="search-result-card-v8" data-action="open-search-result" data-date="${day.date}" aria-label="${html(`${shortDate(day.date)}: ${day.title}${cover?.kind === "artwork" ? ", AI artwork" : ""}`)}" aria-describedby="search-result-description-${day.date}">
            <span class="search-result-media-v8 ${cover ? "has-media" : "is-paper"}">${cover ? `<img src="${html(cover.src)}" alt="" />` : `<span>${dateParts(day.date).day}</span>`}</span>
            <span class="search-result-copy-v8"><small>${shortDate(day.date)} · ${counts.label}${cover?.kind === "artwork" ? " · AI artwork" : ""}</small><strong>${html(day.title)}</strong><span id="search-result-description-${day.date}">${html(day.summary)}</span><em>${day.tags.map((tag) => html(tag)).join(" · ")}</em></span>
          </button>`;
        }).join("")}</div>` : '<div class="search-empty-v8"><h3>No exact matches</h3><p>Life in Days does not infer alternatives. Try another literal word or clear the search.</p><button type="button" class="secondary-button" data-action="clear-search">Clear search</button></div>'}`}
      </section>
    </main>`;
}

function settingsRows(rows) {
  return `<dl class="settings-rows">${rows.map(({ label, value, detail, stateLabel }) => `
    <div class="settings-row">
      <dt>${html(label)}</dt>
      <dd><strong>${html(value)}</strong>${stateLabel ? `<span class="settings-state">${html(stateLabel)}</span>` : ""}${detail ? `<small>${html(detail)}</small>` : ""}</dd>
    </div>`).join("")}</dl>`;
}

function settingsOverview() {
  const rows = [
    { section: "journal", label: "Journal rules", value: "Asia/Kolkata · English (India) · Monday first", detail: "Fixed rules keep every Journal Day consistent." },
    { section: "integrations", label: "Integrations", value: "VoiceNotes and Telegram", detail: "Exact eligibility, activation boundary, and private-chat restrictions." },
    { section: "ai", label: "AI & privacy", value: "Model evaluation not completed", detail: "Independent providers; photos and photo-derived data never go to AI." },
    { section: "appearance", label: "Appearance & site", value: state.themePreference === "device" ? "Use device setting" : `${state.themePreference[0].toUpperCase()}${state.themePreference.slice(1)} theme`, detail: "Theme, reduced-motion behavior, and deployment context." },
  ];
  return `
    <section class="settings-panel settings-overview-panel" aria-labelledby="settings-section-heading">
      <header class="settings-panel-heading"><p class="eyebrow">Configuration summary</p><h2 id="settings-section-heading" tabindex="-1">Your archive, at a glance</h2><p>Only approved MVP rules are shown here. Operational evidence stays in System Health.</p></header>
      <div class="settings-overview-list">
        ${rows.map((row) => `<button type="button" class="settings-overview-row" data-action="set-settings-section" data-section="${row.section}"><span><strong>${html(row.label)}</strong><small>${html(row.detail)}</small></span><span>${html(row.value)}</span></button>`).join("")}
      </div>
      <p class="settings-prototype-note">Prototype fixture · no integration, provider, credential, backup, or storage state is being read from a server.</p>
    </section>`;
}

function settingsJournal() {
  return `
    <section class="settings-panel" aria-labelledby="settings-section-heading">
      <button type="button" class="settings-mobile-back" data-action="set-settings-section" data-section="overview">Back to Settings</button>
      <header class="settings-panel-heading"><p class="eyebrow">Journal rules</p><h2 id="settings-section-heading" tabindex="-1">A consistent calendar record</h2><p>These rules are deliberately fixed for MVP and cannot be changed here.</p></header>
      ${settingsRows([
        { label: "Product", value: "Life in Days", stateLabel: "Private archive" },
        { label: "Human site", value: "life.arunp.in", detail: "Planned authenticated archive hostname." },
        { label: "Journal timezone", value: "Asia/Kolkata", stateLabel: "Fixed for MVP", detail: "Journal Dates and 01:00 schedules use this timezone." },
        { label: "Calendar", value: "English (India) · Monday first", stateLabel: "Fixed for MVP" },
        { label: "Source quiet period", value: "15 minutes", detail: "Untouched generated text waits until journal sources settle." },
        { label: "Final refresh & Artwork Sweep", value: "01:00 Asia/Kolkata", detail: "Eligible image-less Journal Days are checked without sending reminders." },
      ])}
      <aside class="settings-footnote" role="note">Historical automatic import, reminders, streaks, and coaching are not part of MVP.</aside>
    </section>`;
}

function settingsIntegrations() {
  return `
    <section class="settings-panel" aria-labelledby="settings-section-heading">
      <button type="button" class="settings-mobile-back" data-action="set-settings-section" data-section="overview">Back to Settings</button>
      <header class="settings-panel-heading"><p class="eyebrow">Integrations</p><h2 id="settings-section-heading" tabindex="-1">Capture boundaries</h2><p>Configuration is summarized here without exposing secrets, identifiers, or callback paths.</p></header>
      <section class="settings-group" aria-labelledby="voicenotes-settings-title">
        <div class="settings-group-heading"><div><p class="eyebrow">Journal capture</p><h3 id="voicenotes-settings-title">VoiceNotes</h3></div><span class="settings-state is-neutral">Not connected in prototype</span></div>
        ${settingsRows([
          { label: "Eligibility tag", value: "life-in-days", stateLabel: "Exact · read-only" },
          { label: "Integration Activation", value: "Not activated", detail: "Activation cannot be backdated through Settings." },
          { label: "Last reconciliation", value: "Never run in prototype" },
        ])}
        <p class="settings-boundary-copy">Only notes tagged exactly <code>life-in-days</code> and created at or after Integration Activation are eligible. Older notes are never imported automatically, even if edited or tagged later.</p>
      </section>
      <section class="settings-group" aria-labelledby="telegram-settings-title">
        <div class="settings-group-heading"><div><p class="eyebrow">Photo capture</p><h3 id="telegram-settings-title">Telegram</h3></div><span class="settings-state is-neutral">Not connected in prototype</span></div>
        ${settingsRows([
          { label: "Allowed sender", value: "Not configured in prototype", stateLabel: "Never displayed in browser" },
          { label: "Conversation", value: "One private chat only", detail: "Groups and every other sender are rejected." },
          { label: "Webhook secret", value: "Server configuration only", detail: "The value is never visible or editable in the browser." },
        ])}
        <button type="button" class="text-button settings-related-action" data-action="settings-related" data-label="System Health">View integration health</button>
      </section>
    </section>`;
}

function settingsAi() {
  return `
    <section class="settings-panel" aria-labelledby="settings-section-heading">
      <button type="button" class="settings-mobile-back" data-action="set-settings-section" data-section="overview">Back to Settings</button>
      <header class="settings-panel-heading"><p class="eyebrow">AI & privacy</p><h2 id="settings-section-heading" tabindex="-1">What leaves Life in Days</h2><p>Generated presentation stays separate from authentic source material.</p></header>
      <dl class="privacy-lanes">
        <div><dt>Text Provider</dt><dd>Approved journal text plus minimal date and language hints.</dd></div>
        <div><dt>Artwork Provider</dt><dd>The read-only minimized Visual Brief only.</dd></div>
        <div><dt>Never sent to AI</dt><dd>Real photos, thumbnails, metadata, identifiers, captions, or photo-derived descriptions.</dd></div>
      </dl>
      <div class="provider-settings-grid">
        <label class="provider-setting" for="text-provider-model"><span>Text Provider & model</span><select id="text-provider-model" disabled><option>Model evaluation not completed</option></select><small>Only configurations that pass the approved journal-fidelity gates will appear.</small><em>Credential state · Missing in prototype</em></label>
        <label class="provider-setting" for="artwork-provider-model"><span>Artwork Provider & model</span><select id="artwork-provider-model" disabled><option>Model evaluation not completed</option></select><small>Only passing 4:5 artwork configurations will appear; premium options are manual-only.</small><em>Credential state · Missing in prototype</em></label>
      </div>
      <p class="credential-note">Credentials are provisioned on the server and are never displayed or edited here. A future provider change applies only to future generations; existing artifacts keep their provenance and there is no silent fallback.</p>
      <aside class="provider-retention-note" role="note"><strong>Hosted-provider retention</strong><span>Eligible requests may be retained for abuse monitoring. No zero-retention claim is made. Each approved option will show its current retention terms, region, and privacy link before it can be selected.</span></aside>
      <section class="budget-summary" aria-labelledby="budget-summary-title">
        <div><p class="eyebrow">Fixed application guardrail</p><h3 id="budget-summary-title">Monthly AI ceiling</h3></div>
        <dl><div><dt>Total</dt><dd>$5.00</dd></div><div><dt>Text reserve</dt><dd>$0.50</dd></div><div><dt>Artwork maximum</dt><dd>$4.50</dd></div><div><dt>Warning</dt><dd>80%</dd></div></dl>
        <p>This is read-only in the browser. Generation stops before a predicted request exceeds the applicable ceiling; the archive remains available.</p>
      </section>
    </section>`;
}

function settingsAppearance() {
  const themeOption = (value, label, detail) => `<label class="theme-option"><input type="radio" name="theme-preference" value="${value}" data-action="set-theme-preference" ${state.themePreference === value ? "checked" : ""} /><span><strong>${label}</strong><small>${detail}</small></span></label>`;
  return `
    <section class="settings-panel" aria-labelledby="settings-section-heading">
      <button type="button" class="settings-mobile-back" data-action="set-settings-section" data-section="overview">Back to Settings</button>
      <header class="settings-panel-heading"><p class="eyebrow">Appearance & site</p><h2 id="settings-section-heading" tabindex="-1">A calm reading environment</h2><p>Theme changes apply immediately and never alter journal content.</p></header>
      <fieldset class="theme-options"><legend>Theme</legend>${themeOption("device", "Use device setting", "Follow the operating-system light or dark appearance.")}${themeOption("light", "Light", "Warm paper and deep green ink.")}${themeOption("dark", "Dark", "Deep ink surfaces with restrained contrast.")}</fieldset>
      ${settingsRows([
        { label: "Reduced motion", value: "Follows operating system", detail: "No essential operation depends on motion." },
        { label: "Human archive", value: "life.arunp.in", detail: "Cloudflare Access is the only planned human login layer." },
        { label: "Machine callbacks", value: "life-hooks.arunp.in", detail: "Integration callbacks only; no human journal pages or visible callback paths." },
      ])}
      <aside class="settings-footnote" role="note">Life in Days has no application password, password reset, profiles, invitations, sharing, or public links.</aside>
    </section>`;
}

function settingsSectionContent() {
  if (state.settingsSection === "journal") return settingsJournal();
  if (state.settingsSection === "integrations") return settingsIntegrations();
  if (state.settingsSection === "ai") return settingsAi();
  if (state.settingsSection === "appearance") return settingsAppearance();
  return settingsOverview();
}

function renderSettingsView() {
  const navItems = [
    ["overview", "Overview"],
    ["journal", "Journal rules"],
    ["integrations", "Integrations"],
    ["ai", "AI & privacy"],
    ["appearance", "Appearance & site"],
  ];
  return `
    <main id="prototype-main" class="settings-page settings-is-${state.settingsSection}" tabindex="-1">
      <header class="settings-page-heading"><p class="eyebrow">Private configuration</p><h1>Settings</h1><p>The fixed rules and private choices behind your archive—not a consumer account centre.</p></header>
      <div class="settings-shell">
        <aside class="settings-section-nav" aria-label="Settings sections">
          <nav>${navItems.map(([section, label]) => `<button type="button" data-action="set-settings-section" data-section="${section}" class="${state.settingsSection === section ? "is-active" : ""}" ${state.settingsSection === section ? 'aria-current="page"' : ""}>${label}</button>`).join("")}</nav>
          <div class="settings-related"><p>Related management</p>${["System Health", "Export archive", "Trash", "Suppressions", "History"].map((label) => `<button type="button" data-action="settings-related" data-label="${label}">${label}</button>`).join("")}</div>
        </aside>
        <div class="settings-content">${settingsSectionContent()}</div>
      </div>
    </main>`;
}

function renderUnifiedApp() {
  const content = state.view === "calendar"
    ? renderMosaicView()
    : state.view === "almanac"
      ? renderAlmanacView()
      : state.view === "search"
        ? renderSearchView()
        : renderSettingsView();
  return `
    <div class="prototype-app unified-v8 view-${state.view}">
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
        <p class="source-boundary">Real photos never go to AI · <button type="button" data-action="open-settings" data-section="ai" aria-label="Review what Life in Days sends to AI providers">AI & privacy</button></p>
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
          <div><p class="eyebrow">Derived media</p><h3 id="artwork-title-${day.date}" tabindex="-1">Generated artwork</h3></div>
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
      <div class="generation-state" id="generation-status-${day.date}" role="status" tabindex="-1">
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
          <article class="journal-card" id="journal-${html(journal.id)}" tabindex="-1">
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

function dayDetail(day, mode) {
  const previous = adjacentPopulatedDate(day.date, -1);
  const next = adjacentPopulatedDate(day.date, 1);
  const counts = dayCounts(day);
  const operationalAttention = day.attention && (day.conflict || day.summaryStatus !== "Stale") ? day.attention : null;
  const hasAlmanacOrigin = mode === "almanac" && Boolean(currentHistorySnapshot()?.fullDayOpenedInApp);
  const backLabel = mode === "almanac" && hasAlmanacOrigin ? "Back to Almanac" : mode === "almanac" ? "Back to Calendar" : `Back to ${monthLabel(state.month)}`;
  return `
    <div class="day-detail day-detail--${mode}">
      <header class="day-detail-header">
        <button type="button" class="back-button" data-action="close-day"><span aria-hidden="true">←</span> ${backLabel}</button>
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
    <div class="modal-backdrop almanac-drawer-backdrop-v8" data-action="modal-backdrop">
      <aside class="almanac-mobile-drawer-v8" role="dialog" aria-modal="true" aria-labelledby="almanac-drawer-title-v8" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Chronological navigation</p><h2 id="almanac-drawer-title-v8" tabindex="-1">Almanac index</h2></div><button type="button" class="secondary-button" data-action="close-modal">Close</button></header>
        ${almanacNavigatorContent("drawer")}
      </aside>
    </div>`;
}

function renderAlmanacJump() {
  const draftYear = state.modal.year;
  const yearLabel = String(draftYear).padStart(4, "0");
  const viewedMonthNumber = Number(state.almanacMonth.slice(5, 7));
  const viewedYear = Number(state.almanacMonth.slice(0, 4));
  const currentYear = Number(today.slice(0, 4));
  const currentMonthNumber = Number(today.slice(5, 7));
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fullNames = Array.from({ length: 12 }, (_, index) =>
    new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", month: "long" }).format(new Date(Date.UTC(2026, index, 1))),
  );
  return `
    <div class="modal-backdrop month-chooser-backdrop almanac-jump-backdrop-v8" data-action="modal-backdrop">
      <section class="modal-card month-chooser-dialog almanac-jump-dialog-v8" role="dialog" aria-modal="true" aria-labelledby="almanac-jump-title-v8" aria-describedby="almanac-jump-description-v8" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Almanac navigation</p><h2 id="almanac-jump-title-v8">Jump to a month in the Almanac</h2><p id="almanac-jump-description-v8">Moves to the first live Journal Day in that month. Journal Dates use Asia/Kolkata.</p></div><button type="button" class="icon-button" data-action="close-modal" aria-label="Close Almanac month chooser">×</button></header>
        <div class="month-chooser-year" aria-label="Choose year">
          <button type="button" class="icon-button" data-action="almanac-chooser-year" data-delta="-1" aria-label="Previous year" ${draftYear <= 1 ? "disabled" : ""}>←</button>
          <strong>${yearLabel}</strong>
          <button type="button" class="icon-button" data-action="almanac-chooser-year" data-delta="1" aria-label="Next year" ${draftYear >= 9999 ? "disabled" : ""}>→</button>
        </div>
        <div class="month-chooser-grid" aria-label="Choose an Almanac month">
          ${names.map((name, index) => {
            const monthKey = `${yearLabel}-${String(index + 1).padStart(2, "0")}`;
            const count = liveDaysInMonth(monthKey).length;
            const isViewed = draftYear === viewedYear && index + 1 === viewedMonthNumber;
            const isCurrent = draftYear === currentYear && index + 1 === currentMonthNumber;
            const states = [isViewed ? "viewed month" : "", isCurrent ? "current month" : "", `${count} Journal ${count === 1 ? "Day" : "Days"}`].filter(Boolean);
            return `<button type="button" data-action="choose-almanac-month" data-month-key="${monthKey}" aria-label="${fullNames[index]} ${yearLabel}, ${states.join(", ")}" aria-pressed="${isViewed}"><span>${name}</span>${isCurrent ? "<small>Current month</small>" : isViewed ? "<small>Viewed month</small>" : count ? `<small>${count} days</small>` : "<small>No days</small>"}</button>`;
          }).join("")}
        </div>
        <footer class="month-chooser-footer"><span>Textual navigation · no memory previews</span><button type="button" class="secondary-button" data-action="close-modal">Cancel</button></footer>
      </section>
    </div>`;
}

function renderMoreSheet() {
  return `
    <div class="modal-backdrop more-backdrop" data-action="modal-backdrop">
      <aside class="more-sheet" role="dialog" aria-modal="true" aria-labelledby="more-sheet-title" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Life in Days</p><h2 id="more-sheet-title">More</h2></div><button type="button" class="secondary-button" data-action="close-modal">Close</button></header>
        <nav aria-label="More actions">
          <button type="button" data-action="open-upload"><strong>Add journal</strong><small>Upload a .txt or .md file</small></button>
          <button type="button" data-action="open-settings" data-section="overview"><strong>Settings</strong><small>Journal rules, integrations, AI privacy, and appearance</small></button>
        </nav>
        <div class="more-management"><p>Management</p>${["System Health", "Export archive", "Trash", "Suppressions", "History"].map((label) => `<button type="button" data-action="settings-related" data-label="${label}">${label}</button>`).join("")}</div>
        <p class="more-boundary">Private single-user archive · no sharing or public links</p>
      </aside>
    </div>`;
}

function renderMonthChooser() {
  const draftYear = state.modal.year;
  const draftYearLabel = String(draftYear).padStart(4, "0");
  const currentMonthNumber = Number(state.month.slice(5, 7));
  const currentYear = Number(today.slice(0, 4));
  const viewedYear = Number(state.month.slice(0, 4));
  const fullMonthNames = Array.from({ length: 12 }, (_, index) =>
    new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", month: "long" }).format(new Date(Date.UTC(2026, index, 1))),
  );
  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `
    <div class="modal-backdrop month-chooser-backdrop" data-action="modal-backdrop">
      <section class="modal-card month-chooser-dialog" role="dialog" aria-modal="true" aria-labelledby="month-chooser-title" aria-describedby="month-chooser-description" tabindex="-1" data-modal-card>
        <header>
          <div><p class="eyebrow">Calendar navigation</p><h2 id="month-chooser-title">Choose month and year</h2><p id="month-chooser-description">Journal Dates use Asia/Kolkata.</p></div>
          <button type="button" class="icon-button" data-action="close-modal" aria-label="Close month and year chooser">×</button>
        </header>
        <div class="month-chooser-year" aria-label="Choose year">
          <button type="button" class="icon-button" data-action="chooser-year" data-delta="-1" aria-label="Previous year" ${draftYear <= 1 ? "disabled" : ""}>←</button>
          <strong>${draftYearLabel}</strong>
          <button type="button" class="icon-button" data-action="chooser-year" data-delta="1" aria-label="Next year" ${draftYear >= 9999 ? "disabled" : ""}>→</button>
        </div>
        <div class="month-chooser-grid" aria-label="Choose a month">
          ${shortMonthNames.map((name, index) => {
            const monthNumber = index + 1;
            const monthKey = `${draftYearLabel}-${String(monthNumber).padStart(2, "0")}`;
            const isViewed = draftYear === viewedYear && monthNumber === currentMonthNumber;
            const isCurrent = draftYear === currentYear && monthNumber === Number(today.slice(5, 7));
            const states = [isViewed ? "viewed month" : "", isCurrent ? "current month" : ""].filter(Boolean);
            const accessibleLabel = `${fullMonthNames[index]} ${draftYearLabel}${states.length ? `, ${states.join(", ")}` : ""}`;
            return `<button type="button" data-action="choose-month" data-month-key="${monthKey}" aria-label="${accessibleLabel}" aria-pressed="${isViewed}"><span>${name}</span>${isCurrent ? "<small>Current month</small>" : isViewed ? "<small>Viewed month</small>" : ""}</button>`;
          }).join("")}
        </div>
        <footer class="month-chooser-footer"><span>Textual calendar navigation · no memory previews</span><button type="button" class="secondary-button" data-action="close-modal">Cancel</button></footer>
      </section>
    </div>`;
}

function renderModal() {
  if (!state.modal) return "";
  if (state.modal.type === "manage-reflection") return renderManageReflectionSheet();
  if (state.modal.type === "upload") return renderUploadModal();
  if (state.modal.type === "photo") return renderPhotoModal();
  if (state.modal.type === "sparse-art") return renderSparseArtworkModal();
  if (state.modal.type === "almanac-drawer") return renderAlmanacDrawer();
  if (state.modal.type === "almanac-jump") return renderAlmanacJump();
  if (state.modal.type === "more") return renderMoreSheet();
  if (state.modal.type === "month-chooser") return renderMonthChooser();
  return "";
}

function render() {
  const liveSearchInput = root.querySelector("#archive-search-input-v8");
  if (liveSearchInput) state.searchDraft = liveSearchInput.value;
  document.documentElement.dataset.theme = resolvedTheme();
  if (state.view !== "calendar") calendarStatusLive.textContent = "";
  root.innerHTML = renderUnifiedApp();
  modalRoot.innerHTML = renderModal();
  root.inert = Boolean(state.modal);
  if (state.modal) root.setAttribute("aria-hidden", "true");
  else root.removeAttribute("aria-hidden");

  const calendarColumn = root.querySelector(".mosaic-calendar-column");
  const selectedDayIsModal = calendarSelectionSheetQuery.matches && state.view === "calendar" && state.screen === "month" && Boolean(state.selectedDate);
  if (calendarColumn) {
    calendarColumn.inert = selectedDayIsModal;
    if (selectedDayIsModal) calendarColumn.setAttribute("aria-hidden", "true");
    else calendarColumn.removeAttribute("aria-hidden");
  }

  const focusTarget = state.modal
    ? resolveLogicalSelector(state.modal.focusSelector || "[data-modal-card]")
    : state.focusAfterRender
      ? resolveLogicalSelector(state.focusAfterRender)
      : null;
  state.focusAfterRender = null;
  if (state.modal) state.modal.focusSelector = null;
  if (focusTarget) requestAnimationFrame(() => {
    focusTarget.focus({ preventScroll: true });
    if (state.pendingInputSelection && focusTarget.id === "archive-search-input-v8") {
      const { start, end, direction } = state.pendingInputSelection;
      focusTarget.setSelectionRange(start, end, direction);
      state.pendingInputSelection = null;
    }
    if (state.modal?.scrollY != null) withInstantScroll(() => window.scrollTo({ top: state.modal.scrollY, behavior: "auto" }));
  });

  const shouldPositionAlmanacChapter = state.pendingChapterScroll && state.view === "almanac";
  const pendingAlmanacDestination = state.view === "almanac" && state.screen === "month"
    ? state.almanacPendingDestination
    : null;

  if (shouldPositionAlmanacChapter) {
    state.pendingChapterScroll = false;
    requestAnimationFrame(() => {
      const chapter = root.querySelector(`#chapter-${CSS.escape(state.selectedDate)}`);
      scrollElementIntoViewInstant(chapter);
      chapter?.focus({ preventScroll: true });
      syncUrl({ scrollY: window.scrollY });
      requestAnimationFrame(updateAlmanacViewportState);
    });
  }

  if (pendingAlmanacDestination) {
    const destination = pendingAlmanacDestination;
    state.almanacPendingDestination = null;
    requestAnimationFrame(() => {
      const target = root.querySelector(destination.selector);
      scrollElementIntoViewInstant(target);
      target?.focus({ preventScroll: true });
      if (destination.announcement) announceAlmanac(destination.announcement);
      syncUrl({ scrollY: window.scrollY });
      state.viewMemory.almanac = captureViewMemory("almanac");
      state.almanacReadingAnchor = captureAlmanacReadingAnchor();
      requestAnimationFrame(updateAlmanacViewportState);
    });
  }
  if (state.view === "almanac" && state.screen === "month" && !shouldPositionAlmanacChapter && !pendingAlmanacDestination && !state.almanacRestoringHistory) {
    requestAnimationFrame(updateAlmanacViewportState);
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

function canonicalRouteUrl() {
  const url = new URL(window.location.pathname, window.location.origin);
  url.searchParams.set("view", state.view);
  url.searchParams.set("month", state.month);
  if (state.view === "almanac" && state.almanacThrough !== state.almanacMonth) url.searchParams.set("through", state.almanacThrough);
  else url.searchParams.delete("through");
  if (["calendar", "almanac"].includes(state.view) && state.selectedDate) url.searchParams.set("date", state.selectedDate);
  else url.searchParams.delete("date");
  if (["calendar", "almanac"].includes(state.view) && state.screen === "day") url.searchParams.set("screen", "day");
  else url.searchParams.delete("screen");
  if (state.view === "settings") url.searchParams.set("section", state.settingsSection);
  else url.searchParams.delete("section");
  if (state.view === "almanac" && state.almanacCollapsed) url.searchParams.set("rail", "collapsed");
  else url.searchParams.delete("rail");
  return url;
}

function currentHistorySnapshot() {
  return historyEntries.get(window.history.state?.entryId) || null;
}

function ensureHistoryEntry() {
  const currentId = window.history.state?.entryId;
  if (currentId && historyEntries.has(currentId)) return currentId;
  const entryId = nextHistoryEntryId();
  historyEntries.set(entryId, {});
  window.history.replaceState({ entryId }, "", canonicalRouteUrl());
  return entryId;
}

function syncLiveSearchDraft() {
  const input = root.querySelector("#archive-search-input-v8");
  if (input) state.searchDraft = input.value;
}

function captureHistorySnapshot(overrides = {}) {
  syncLiveSearchDraft();
  const focusElement = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
  const focusSelector = overrides.focusSelector !== undefined
    ? overrides.focusSelector
    : selectorForLogicalFocus(focusElement);
  const focusTop = overrides.focusTop !== undefined
    ? overrides.focusTop
    : focusElement?.getBoundingClientRect?.().top ?? null;
  const prior = currentHistorySnapshot() || {};
  return {
    ...prior,
    scrollY: overrides.scrollY ?? window.scrollY,
    focusSelector,
    focusTop: Number.isFinite(focusTop) ? focusTop : null,
    selectionOpenedInApp: overrides.selectionOpenedInApp ?? prior.selectionOpenedInApp ?? false,
    fullDayOpenedInApp: overrides.fullDayOpenedInApp ?? prior.fullDayOpenedInApp ?? false,
    almanacEmptyArchive: state.almanacEmptyArchive,
    almanacVisibleMonth: state.almanacVisibleMonth,
    almanacVisibleDate: state.almanacVisibleDate,
    almanacReturnFocusDate: state.almanacReturnFocusDate,
    calendarMonth: state.calendarMonth,
    focusDate: state.focusDate,
  };
}

function saveCurrentHistorySnapshot(overrides = {}) {
  const entryId = ensureHistoryEntry();
  const snapshot = captureHistorySnapshot(overrides);
  historyEntries.set(entryId, snapshot);
  return snapshot;
}

function syncUrl({ push = false, selectionOpenedInApp, fullDayOpenedInApp, scrollY, focusSelector, focusTop, originAlreadySaved = false } = {}) {
  const previous = currentHistorySnapshot() || {};
  const snapshotOverrides = { scrollY, focusSelector, focusTop };
  if (selectionOpenedInApp !== undefined) snapshotOverrides.selectionOpenedInApp = selectionOpenedInApp;
  if (fullDayOpenedInApp !== undefined) snapshotOverrides.fullDayOpenedInApp = fullDayOpenedInApp;

  if (push && !originAlreadySaved) saveCurrentHistorySnapshot();

  const entryId = push ? nextHistoryEntryId() : ensureHistoryEntry();
  const destinationSnapshot = captureHistorySnapshot({
    ...snapshotOverrides,
    selectionOpenedInApp: selectionOpenedInApp ?? (push ? false : previous.selectionOpenedInApp),
    fullDayOpenedInApp: fullDayOpenedInApp ?? (push ? false : previous.fullDayOpenedInApp),
    focusSelector: focusSelector !== undefined ? focusSelector : state.focusAfterRender || selectorForLogicalFocus(document.activeElement),
    scrollY: scrollY ?? (state.screen === "day" ? 0 : window.scrollY),
  });
  historyEntries.set(entryId, destinationSnapshot);
  window.history[push ? "pushState" : "replaceState"]({ entryId }, "", canonicalRouteUrl());
}

function setCalendarMonth(nextMonth, { push = true, focusDate = null, focusTarget = "calendar-cell" } = {}) {
  if (!isMonthKey(nextMonth)) return;
  if (push) saveCurrentHistorySnapshot();
  const previousDay = dateParts(state.focusDate || `${state.month}-01`).day;
  state.month = nextMonth;
  state.calendarMonth = nextMonth;
  state.selectedDate = null;
  state.screen = "month";
  state.focusDate = focusDate && focusDate.startsWith(`${nextMonth}-`) ? focusDate : dateForMonthDay(nextMonth, previousDay);
  state.monthAnnouncement = `Showing ${monthLabel(nextMonth)}`;
  calendarStatusLive.textContent = "";
  if (focusTarget === "month-trigger") state.focusAfterRender = '[data-action="open-month-chooser"]';
  else if (focusTarget === "calendar-cell" && state.view === "calendar") state.focusAfterRender = `[data-calendar-date="${state.focusDate}"]`;
  else if (state.view === "almanac" && state.modal?.type === "almanac-drawer") state.modal.focusSelector = ".almanac-mobile-drawer-v8";
  syncUrl({ push, originAlreadySaved: push });
  render();
  requestAnimationFrame(() => { calendarStatusLive.textContent = state.monthAnnouncement; });
}

function withInstantScroll(callback) {
  const previous = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  callback();
  document.documentElement.style.scrollBehavior = previous;
}

function scrollElementIntoViewInstant(element, block = "start") {
  if (!element) return;
  withInstantScroll(() => element.scrollIntoView({ behavior: "auto", block }));
}

function restoreViewScroll(view, exactScrollY = state.scrollByView[view] || 0, anchorSelector = null, anchorTop = null) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    withInstantScroll(() => window.scrollTo({ top: exactScrollY, behavior: "auto" }));
    requestAnimationFrame(() => {
      const anchor = anchorSelector ? root.querySelector(anchorSelector) : null;
      if (anchor && Number.isFinite(anchorTop)) {
        const delta = anchor.getBoundingClientRect().top - anchorTop;
        if (Math.abs(delta) > 0.5) withInstantScroll(() => window.scrollBy({ top: delta, behavior: "auto" }));
      }
      if (view === "almanac") {
        state.almanacRestoringHistory = false;
        updateAlmanacViewportState();
      }
      if (state.view === view) state.viewMemory[view] = captureViewMemory(view);
      if (view === "almanac" && state.view === "almanac") state.almanacReadingAnchor = captureAlmanacReadingAnchor();
    });
  }));
}

function captureViewMemory(view) {
  syncLiveSearchDraft();
  const focusElement = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
  return {
    month: state.month,
    calendarMonth: state.calendarMonth,
    almanacMonth: state.almanacMonth,
    almanacThrough: state.almanacThrough,
    almanacVisibleMonth: state.almanacVisibleMonth,
    almanacVisibleDate: state.almanacVisibleDate,
    almanacEmptyArchive: state.almanacEmptyArchive,
    selectedDate: state.selectedDate,
    focusDate: state.focusDate,
    screen: state.screen,
    scrollY: window.scrollY,
    focusSelector: selectorForLogicalFocus(focusElement),
    focusTop: focusElement?.getBoundingClientRect?.().top ?? null,
    searchQuery: state.searchQuery,
    searchDraft: state.searchDraft,
    settingsSection: state.settingsSection,
  };
}

function captureAlmanacReadingAnchor() {
  if (state.view !== "almanac" || state.screen !== "month") return null;
  const isVisible = (chapter) => {
    if (!chapter) return false;
    const rect = chapter.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };
  const selected = state.selectedDate ? root.querySelector(`#chapter-${CSS.escape(state.selectedDate)}`) : null;
  const current = root.querySelector("[data-chapter-date].is-current");
  const chapter = [selected, current, ...root.querySelectorAll("[data-chapter-date]")].find(isVisible);
  if (!chapter?.dataset.chapterDate) return null;
  return {
    date: chapter.dataset.chapterDate,
    selector: `#chapter-${CSS.escape(chapter.dataset.chapterDate)}`,
    top: chapter.getBoundingClientRect().top,
    scrollY: window.scrollY,
  };
}

function renderPreservingAlmanacReading(focusSelector = state.focusAfterRender) {
  const anchor = state.view === "almanac" && state.screen === "month" && !state.modal
    ? state.almanacReadingAnchor || captureAlmanacReadingAnchor()
    : null;
  if (!anchor) {
    render();
    return;
  }
  const priorOverflowAnchor = document.documentElement.style.overflowAnchor;
  const restore = () => {
    withInstantScroll(() => window.scrollTo({ top: anchor.scrollY, behavior: "auto" }));
    const element = root.querySelector(anchor.selector);
    if (element && Number.isFinite(anchor.top)) {
      const delta = element.getBoundingClientRect().top - anchor.top;
      if (Math.abs(delta) > 0.5) withInstantScroll(() => window.scrollBy({ top: delta, behavior: "auto" }));
    }
  };
  document.documentElement.style.overflowAnchor = "none";
  state.almanacRestoringHistory = true;
  render();
  requestAnimationFrame(() => requestAnimationFrame(restore));
  window.setTimeout(() => {
    restore();
    document.documentElement.style.overflowAnchor = priorOverflowAnchor;
    state.almanacRestoringHistory = false;
    resolveLogicalSelector(focusSelector)?.focus({ preventScroll: true });
    updateAlmanacViewportState();
    syncUrl({ scrollY: window.scrollY, focusSelector, focusTop: null });
    state.viewMemory.almanac = captureViewMemory("almanac");
    state.almanacReadingAnchor = captureAlmanacReadingAnchor();
  }, 80);
}

function restoreViewMemory(view, memory) {
  if (!memory) return false;
  if (view === "almanac") {
    state.almanacMonth = memory.almanacMonth;
    state.almanacThrough = memory.almanacThrough;
    state.almanacVisibleMonth = memory.almanacVisibleMonth;
    state.almanacVisibleDate = memory.almanacVisibleDate;
    state.almanacEmptyArchive = memory.almanacEmptyArchive;
    state.month = memory.almanacMonth;
    state.selectedDate = memory.selectedDate;
    state.screen = memory.screen === "day" ? "day" : "month";
  } else if (view === "calendar") {
    state.calendarMonth = memory.calendarMonth;
    state.month = memory.calendarMonth;
    state.selectedDate = memory.selectedDate;
    state.focusDate = memory.focusDate;
    state.screen = memory.screen;
  } else if (view === "search") {
    state.searchQuery = memory.searchQuery;
    state.searchDraft = memory.searchDraft;
    state.screen = "month";
  } else if (view === "settings") {
    state.settingsSection = memory.settingsSection;
    state.screen = "month";
  }
  state.focusAfterRender = memory.focusSelector;
  return true;
}

function setView(nextView, { push = true } = {}) {
  if (!allowedViews.has(nextView)) return;
  const previousView = state.view;
  const previousSelectedDate = state.selectedDate;
  const viewSwitchControl = document.activeElement?.closest?.('[data-action="set-view"]');
  if (!(previousView === "almanac" && viewSwitchControl && state.viewMemory.almanac)) {
    state.viewMemory[previousView] = captureViewMemory(previousView);
  }
  saveCurrentHistorySnapshot();
  if (previousView === "almanac") {
    if (state.almanacStatus === "loading") {
      state.almanacLoadRequestId += 1;
      state.almanacStatus = "idle";
      state.almanacFailNext = false;
    }
    const activeControl = document.activeElement?.closest?.("[data-action]");
    if (activeControl?.dataset.date) state.almanacReturnFocusDate = activeControl.dataset.date;
    else if (activeControl?.dataset.action) state.almanacLastFocusAction = activeControl.dataset.action;
  }
  state.scrollByView[previousView] = window.scrollY;
  if (previousView === "calendar") state.calendarMonth = state.month;
  if (previousView === "almanac") state.almanacMonth = state.month;
  if (nextView === "search" && ["calendar", "almanac"].includes(previousView)) state.searchReturnView = previousView;
  state.view = nextView;

  const savedView = state.viewMemory[nextView];
  if (savedView) {
    restoreViewMemory(nextView, savedView);
    syncUrl({ push, originAlreadySaved: push });
    render();
    restoreViewScroll(nextView, savedView.scrollY, savedView.focusSelector, savedView.focusTop);
    const viewLabels = { calendar: "Calendar", almanac: "Almanac", search: "Search", settings: "Settings" };
    toast(nextView === "settings" ? "Settings opened." : `${viewLabels[nextView]} view, ${monthLabel(state.month)}.`);
    return;
  }

  const shouldScrollChapter = nextView === "almanac" && previousView === "calendar" && Boolean(state.selectedDate);
  if (nextView === "calendar") {
    state.month = state.calendarMonth;
    state.selectedDate = previousSelectedDate?.startsWith(`${state.calendarMonth}-`) ? previousSelectedDate : null;
    state.screen = "month";
    state.focusAfterRender = '[data-action="set-view"][data-view="calendar"]';
  } else if (nextView === "almanac") {
    state.month = state.almanacMonth;
    state.screen = "month";
    const almanacAnchor = previousView === "calendar" && previousSelectedDate ? previousSelectedDate : state.almanacVisibleDate;
    state.selectedDate = almanacAnchor && days[almanacAnchor] ? almanacAnchor : null;
    if (state.selectedDate) {
      const anchorMonth = state.selectedDate.slice(0, 7);
      const normalized = normalizeAlmanacRange(state.almanacMonth, state.almanacThrough, state.selectedDate);
      state.almanacMonth = normalized.newest;
      state.almanacThrough = normalized.oldest;
      state.month = state.almanacMonth;
      state.almanacVisibleMonth = anchorMonth;
      state.almanacVisibleDate = state.selectedDate;
    }
    state.focusAfterRender = state.almanacReturnFocusDate
      ? `[data-action="open-full-day"][data-date="${state.almanacReturnFocusDate}"]`
      : state.almanacLastFocusAction
        ? `[data-action="${state.almanacLastFocusAction}"]`
        : '[data-action="set-view"][data-view="almanac"]';
    state.pendingChapterScroll = shouldScrollChapter;
  } else if (nextView === "search") {
    state.focusAfterRender = "#archive-search-input-v8";
  } else {
    state.screen = "month";
    state.focusAfterRender = "#settings-section-heading";
  }

  syncUrl({ push, originAlreadySaved: push });
  render();
  if (!shouldScrollChapter) restoreViewScroll(nextView);
  const viewLabels = { calendar: "Calendar", almanac: "Almanac", search: "Search", settings: "Settings" };
  toast(nextView === "settings" ? "Settings opened." : `${viewLabels[nextView]} view, ${monthLabel(state.month)}.`);
}

function announceAlmanac(message) {
  state.almanacStatusMessage = message;
  almanacStatusLive.textContent = "";
  requestAnimationFrame(() => { almanacStatusLive.textContent = message; });
}

function queueAlmanacDestination(selector, announcement = "") {
  state.almanacPendingDestination = { selector, announcement };
}

function replaceAlmanacPagination() {
  const current = root.querySelector(".almanac-pagination-v8");
  if (current) current.outerHTML = almanacPagination();
}

function replaceAlmanacIndex() {
  const current = root.querySelector("#almanac-index-content-desktop-v8");
  if (current) {
    const indexScroll = current.querySelector(".almanac-volume-nav-v8")?.scrollTop || 0;
    current.outerHTML = almanacNavigatorContent("desktop");
    const replacement = root.querySelector("#almanac-index-content-desktop-v8 .almanac-volume-nav-v8");
    if (replacement) replacement.scrollTop = indexScroll;
  }
}

function jumpAlmanacMonth(targetMonth, { push = true, originSelector = null } = {}) {
  if (!isMonthKey(targetMonth)) return;
  state.almanacLoadRequestId += 1;
  if (push) {
    const selector = originSelector || state.modal?.returnFocusSelector || selectorForLogicalFocus(document.activeElement);
    const origin = selector ? resolveLogicalSelector(selector) : null;
    saveCurrentHistorySnapshot({
      focusSelector: selector,
      focusTop: origin?.getBoundingClientRect().top ?? null,
      scrollY: window.scrollY,
    });
  }
  state.modal = null;
  state.almanacMonth = targetMonth;
  state.almanacThrough = targetMonth;
  state.month = targetMonth;
  state.screen = "month";
  state.almanacStatus = "idle";
  const targetDays = liveDaysInMonth(targetMonth);
  state.selectedDate = targetDays[0]?.date || null;
  state.almanacVisibleDate = state.selectedDate;
  state.almanacVisibleMonth = targetMonth;
  queueAlmanacDestination(
    targetDays.length ? `#chapter-${targetDays[0].date}` : `#volume-${targetMonth} h2`,
    targetDays.length ? `Showing ${monthLabel(targetMonth)}.` : `No journaled days in ${monthLabel(targetMonth)}.`,
  );
  syncUrl({
    push,
    originAlreadySaved: push,
    focusSelector: targetDays.length ? `#chapter-${targetDays[0].date}` : `#volume-${targetMonth} h2`,
    scrollY: 0,
  });
  render();
}

function selectAlmanacChapter(date, { fromDrawer = false } = {}) {
  if (!days[date]) return;
  const monthKey = date.slice(0, 7);
  const normalized = normalizeAlmanacRange(state.almanacMonth, state.almanacThrough, date);
  state.almanacMonth = normalized.newest;
  state.almanacThrough = normalized.oldest;
  state.month = state.almanacMonth;
  state.selectedDate = date;
  state.almanacVisibleDate = date;
  state.almanacVisibleMonth = monthKey;
  state.screen = "month";
  if (fromDrawer) state.modal = null;
  queueAlmanacDestination(`#chapter-${date}`, `${longDate(date)} selected in the Almanac.`);
  syncUrl();
  render();
}

function loadEarlierAlmanac() {
  if (state.view !== "almanac" || state.screen === "day" || state.almanacStatus === "loading" || isAlmanacAtBeginning()) return;
  const nextMonth = shiftMonth(state.almanacThrough, -1);
  const originThrough = state.almanacThrough;
  const requestId = ++state.almanacLoadRequestId;
  const currentControl = root.querySelector('[data-action="load-earlier"], [data-action="retry-load-earlier"]');
  const controlTop = currentControl?.getBoundingClientRect().top ?? null;
  syncUrl({ scrollY: window.scrollY });
  state.almanacStatus = "loading";
  replaceAlmanacPagination();
  const loadingControl = root.querySelector('[data-action="load-earlier"]');
  loadingControl?.focus({ preventScroll: true });
  announceAlmanac("Loading the next earlier volume.");

  window.setTimeout(() => {
    if (requestId !== state.almanacLoadRequestId
      || state.view !== "almanac"
      || state.screen !== "month"
      || state.almanacThrough !== originThrough
      || state.almanacEmptyArchive) return;
    if (state.almanacFailNext) {
      state.almanacFailNext = false;
      state.almanacStatus = "error";
      replaceAlmanacPagination();
      const retry = root.querySelector('[data-action="retry-load-earlier"]');
      retry?.focus({ preventScroll: true });
      announceAlmanac("Earlier Journal Days could not be loaded. What is already shown is unchanged.");
      return;
    }

    state.almanacStatus = "idle";
    state.almanacThrough = nextMonth;
    const addedDays = liveDaysInMonth(nextMonth);
    syncUrl({ push: true });
    const volumes = root.querySelector("#almanac-volumes-v8");
    const markup = almanacVolumeMarkup(nextMonth);
    if (volumes && markup && !root.querySelector(`#volume-${CSS.escape(nextMonth)}`)) volumes.insertAdjacentHTML("beforeend", markup);
    replaceAlmanacIndex();
    replaceAlmanacPagination();
    const nextControl = root.querySelector('[data-action="load-earlier"], [data-action="almanac-beginning"]');
    if (controlTop != null && nextControl) {
      const delta = nextControl.getBoundingClientRect().top - controlTop;
      withInstantScroll(() => window.scrollBy({ top: delta, behavior: "auto" }));
      nextControl.focus({ preventScroll: true });
    }
    syncUrl({ scrollY: window.scrollY });
    announceAlmanac(`${monthLabel(nextMonth)} loaded. ${addedDays.length ? `${addedDays.length} Journal ${addedDays.length === 1 ? "Day" : "Days"} added.` : "No Journal Days."}`);
  }, 420);
}

function openSettings(section = "overview") {
  if (allowedSettingsSections.has(section)) state.settingsSection = section;
  state.scrollByView.settings = 0;
  state.modal = null;
  if (state.view === "settings") {
    state.focusAfterRender = "#settings-section-heading";
    syncUrl({ push: true });
    render();
    requestAnimationFrame(() => withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" })));
    return;
  }
  setView("settings");
}

function setSettingsSection(section, { push = true } = {}) {
  if (!allowedSettingsSections.has(section)) return;
  state.settingsSection = section;
  state.focusAfterRender = "#settings-section-heading";
  state.scrollByView.settings = 0;
  syncUrl({ push });
  render();
  requestAnimationFrame(() => withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" })));
}

function showDay(date) {
  if (!days[date]) return;
  state.focusDate = date;
  state.galleryIndex[date] ??= 0;

  if (state.view === "calendar") {
    const replacingOpenSelection = Boolean(state.selectedDate);
    if (!replacingOpenSelection) syncUrl();
    state.selectedDate = date;
    state.screen = "month";
    state.focusAfterRender = ".calendar-selection";
    syncUrl({ push: !replacingOpenSelection, selectionOpenedInApp: true });
  } else if (state.view === "almanac") {
    selectAlmanacChapter(date, { fromDrawer: state.modal?.type === "almanac-drawer" });
    return;
  }
  render();
}

function closeCalendarSelection() {
  const previousDate = state.selectedDate;
  if (currentHistorySnapshot()?.selectionOpenedInApp) {
    state.pendingSelectionCloseFocus = previousDate;
    window.history.back();
    return;
  }
  state.selectedDate = null;
  state.screen = "month";
  state.focusDate = previousDate || state.focusDate;
  state.focusAfterRender = previousDate ? `[data-calendar-date="${previousDate}"]` : null;
  syncUrl();
  render();
}

function openUpload(date, returnFocusSelector = null) {
  state.modal = { type: "upload", stage: "choose", date: date || state.selectedDate || today, error: "", returnFocusSelector };
  render();
}

function uploadReturnFocusSelector(control, date) {
  if (state.modal?.type === "more") return '[data-action="open-more"]';
  if (state.modal?.type === "almanac-drawer") return '[data-action="open-almanac-drawer"]';
  if (date) {
    const chapter = control.closest("[data-chapter-date]");
    if (chapter) return `[data-chapter-date="${date}"] [data-action="open-upload"][data-date="${date}"]`;
    const sourceSection = control.closest(".sources-section");
    if (sourceSection) return `.sources-section [data-action="open-upload"][data-date="${date}"]`;
    const actionsSection = control.closest(".day-actions-section");
    if (actionsSection) return `.day-actions-section [data-action="open-upload"][data-date="${date}"]`;
    return `[data-action="open-upload"][data-date="${date}"]`;
  }
  if (control.closest(".unified-topbar")) return ".unified-topbar [data-action=\"open-upload\"]";
  if (control.closest(".almanac-index-v8")) return ".almanac-index-v8 [data-action=\"open-upload\"]";
  if (control.closest(".almanac-archive-empty-v8")) return ".almanac-archive-empty-v8 [data-action=\"open-upload\"]";
  return '[data-action="open-upload"]';
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
  if (modal?.type === "almanac-jump" && modal.returnToDrawer) {
    state.modal = {
      type: "almanac-drawer",
      returnFocusSelector: '[data-action="open-almanac-drawer"]',
      focusSelector: '[data-action="open-almanac-jump"]',
    };
    render();
    return;
  }
  if (modal?.returnFocusSelector) state.focusAfterRender = modal.returnFocusSelector;
  const returnScrollY = modal?.scrollY;
  state.modal = null;
  render();
  if (returnScrollY != null) requestAnimationFrame(() => withInstantScroll(() => window.scrollTo({ top: returnScrollY, behavior: "auto" })));
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
  const returnFocusSelector = modal.returnFocusSelector;
  const returnToFullDay = state.screen === "day";
  modal.stage = "saving";
  render();
  window.setTimeout(() => {
    const day = days[modal.date] || (days[modal.date] = defaultUploadedDay(modal.date));
    const journalId = `uploaded-${Date.now()}`;
    day.journals.push({
      id: journalId,
      kind: "Uploaded journal",
      title: modal.fileName,
      timestamp: `${longDate(today).replace(/^\w+, /, "")}, simulated upload time`,
      status: "Current displayed version",
      text: modal.text,
    });
    state.almanacEmptyArchive = false;
    state.selectedDate = modal.date;
    state.focusDate = modal.date;
    state.modal = null;
    if (returnToFullDay) {
      state.focusAfterRender = `#journal-${journalId}`;
    } else if (state.view === "almanac") {
      const normalized = normalizeAlmanacRange(state.almanacMonth, state.almanacThrough, modal.date);
      state.almanacMonth = normalized.newest;
      state.almanacThrough = normalized.oldest;
      state.month = normalized.newest;
      state.almanacVisibleMonth = modal.date.slice(0, 7);
      state.almanacVisibleDate = modal.date;
      queueAlmanacDestination(`#chapter-${modal.date}`, `Journal added to ${longDate(modal.date)}.`);
    } else if (state.view === "calendar") {
      state.calendarMonth = modal.date.slice(0, 7);
      state.month = state.calendarMonth;
      state.screen = "month";
      state.focusAfterRender = ".calendar-selection";
    } else {
      state.focusAfterRender = returnFocusSelector || "#prototype-main";
    }
    syncUrl();
    render();
    toast(`Journal added to ${longDate(modal.date).replace(/^\w+, /, "")}. View day.`);
  }, 650);
}

function beginArtworkGeneration(date) {
  const day = days[date];
  if (!day) return;
  state.modal = null;
  state.generation[date] = "waiting";
  state.focusAfterRender = `#generation-status-${date}`;
  render();
  toast("Artwork simulation queued. Authentic journals remain available.");

  window.setTimeout(() => {
    if (!days[date]) return;
    state.generation[date] = "in-progress";
    state.focusAfterRender = `#generation-status-${date}`;
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
    state.focusAfterRender = `#artwork-title-${date}`;
    render();
    toast(day.photos.length ? "Synthetic artwork added. The real Daily Photo remains the Calendar Cover." : "Synthetic artwork added and shown as the AI artwork cover.");
    window.setTimeout(() => {
      delete state.generation[date];
    }, 1400);
  }, 1900);
}

function triggerArtwork(date, returnFocusSelector = null) {
  const day = days[date];
  const count = meaningfulWordCount(day);
  if (count < 5) {
    toast("At least 5 meaningful journal words are needed.");
    return;
  }
  if (count < 20) {
    state.modal = {
      type: "sparse-art",
      date,
      returnFocusSelector: returnFocusSelector || `[data-action="trigger-art"][data-date="${date}"]`,
    };
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
  if (state.almanacStatus === "loading" && !["load-earlier", "retry-load-earlier"].includes(action)) {
    state.almanacLoadRequestId += 1;
    state.almanacStatus = "idle";
    state.almanacFailNext = false;
  }

  if (action === "set-view") {
    if (control.dataset.view === state.view && state.view === "calendar") {
      state.screen = "month";
      syncUrl({ push: true });
      render();
      restoreViewScroll("calendar");
    } else if (control.dataset.view !== state.view) setView(control.dataset.view);
  } else if (action === "open-settings") {
    openSettings(control.dataset.section || "overview");
  } else if (action === "set-settings-section") {
    setSettingsSection(control.dataset.section || "overview");
  } else if (action === "open-more") {
    state.modal = { type: "more", returnFocusSelector: '[data-action="open-more"]' };
    render();
  } else if (action === "settings-related") {
    const label = control.dataset.label || "Management";
    if (state.modal) closeModal();
    toast(`${label} is a documented management surface outside this v8 Settings prototype.`);
  } else if (action === "toggle-theme") {
    state.themePreference = resolvedTheme() === "light" ? "dark" : "light";
    window.localStorage.setItem("life-in-days-v8-theme", state.themePreference);
    state.focusAfterRender = '[data-action="toggle-theme"]';
    renderPreservingAlmanacReading('[data-action="toggle-theme"]');
    toast(`${state.themePreference === "dark" ? "Dark" : "Light"} theme applied.`);
  } else if (action === "toggle-almanac-rail") {
    const settledReading = state.viewMemory.almanac;
    const settledAnchor = state.almanacReadingAnchor;
    const scrollY = Number.isFinite(settledAnchor?.scrollY)
      ? settledAnchor.scrollY
      : Number.isFinite(settledReading?.scrollY) ? settledReading.scrollY : window.scrollY;
    const chapterIsVisible = (chapter) => {
      if (!chapter) return false;
      const rect = chapter.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };
    const selectedChapter = state.selectedDate ? root.querySelector(`#chapter-${CSS.escape(state.selectedDate)}`) : null;
    const currentChapter = root.querySelector("[data-chapter-date].is-current");
    const visibleChapter = [selectedChapter, currentChapter, ...root.querySelectorAll("[data-chapter-date]")]
      .find(chapterIsVisible);
    const anchorDate = settledAnchor?.date || visibleChapter?.dataset.chapterDate || state.almanacVisibleDate || state.selectedDate;
    const anchorSelector = anchorDate ? `#chapter-${CSS.escape(anchorDate)}` : null;
    const rememberedAnchorTop = settledAnchor?.selector === anchorSelector
      ? settledAnchor.top
      : settledReading?.focusSelector === anchorSelector ? settledReading.focusTop : null;
    const anchorTop = Number.isFinite(rememberedAnchorTop)
      ? rememberedAnchorTop
      : anchorSelector ? root.querySelector(anchorSelector)?.getBoundingClientRect().top ?? null : null;
    const priorOverflowAnchor = document.documentElement.style.overflowAnchor;
    const restoreReadingAnchor = () => {
      withInstantScroll(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
      const anchor = anchorSelector ? root.querySelector(anchorSelector) : null;
      if (anchor && Number.isFinite(anchorTop)) {
        const delta = anchor.getBoundingClientRect().top - anchorTop;
        if (Math.abs(delta) > 0.5) withInstantScroll(() => window.scrollBy({ top: delta, behavior: "auto" }));
      }
    };
    document.documentElement.style.overflowAnchor = "none";
    state.almanacRestoringHistory = true;
    state.almanacCollapsed = !state.almanacCollapsed;
    window.localStorage.setItem("life-in-days-v8-almanac-collapsed", String(state.almanacCollapsed));
    state.focusAfterRender = '[data-action="toggle-almanac-rail"]';
    syncUrl();
    render();
    requestAnimationFrame(() => requestAnimationFrame(restoreReadingAnchor));
    window.setTimeout(() => {
      restoreReadingAnchor();
      document.documentElement.style.overflowAnchor = priorOverflowAnchor;
      state.almanacRestoringHistory = false;
      resolveLogicalSelector('[data-action="toggle-almanac-rail"]')?.focus({ preventScroll: true });
      updateAlmanacViewportState();
      syncUrl({ scrollY: window.scrollY, focusSelector: '[data-action="toggle-almanac-rail"]', focusTop: null });
      state.viewMemory.almanac = captureViewMemory("almanac");
      state.almanacReadingAnchor = captureAlmanacReadingAnchor();
    }, 240);
  } else if (action === "open-almanac-drawer") {
    const pending = state.pendingDrawerFocusSelector;
    state.pendingDrawerFocusSelector = null;
    state.modal = {
      type: "almanac-drawer",
      returnFocusSelector: '[data-action="open-almanac-drawer"]',
      focusSelector: pending || "#almanac-drawer-title-v8",
    };
    render();
  } else if (action === "open-almanac-jump") {
    const returnToDrawer = state.modal?.type === "almanac-drawer";
    const returnFocusSelector = returnToDrawer
      ? ".almanac-mobile-drawer-v8 [data-action=\"open-almanac-jump\"]"
      : '.almanac-index-v8 [data-action="open-almanac-jump"]';
    state.modal = {
      type: "almanac-jump",
      year: Number(state.almanacMonth.slice(0, 4)),
      returnFocusSelector,
      returnToDrawer,
      focusSelector: `[data-month-key="${state.almanacMonth}"]`,
    };
    render();
  } else if (action === "almanac-chooser-year") {
    const delta = Number(control.dataset.delta);
    state.modal.year = Math.min(9999, Math.max(1, state.modal.year + delta));
    state.modal.focusSelector = `[data-action="almanac-chooser-year"][data-delta="${delta}"]`;
    render();
  } else if (action === "choose-almanac-month") {
    jumpAlmanacMonth(control.dataset.monthKey, { push: control.dataset.monthKey !== state.almanacMonth || state.almanacThrough !== state.almanacMonth });
  } else if (action === "select-almanac-chapter") {
    selectAlmanacChapter(date, { fromDrawer: state.modal?.type === "almanac-drawer" });
  } else if (action === "select-almanac-month") {
    const monthKey = control.dataset.monthKey;
    const monthDays = liveDaysInMonth(monthKey);
    const fromDrawer = state.modal?.type === "almanac-drawer";
    if (fromDrawer) state.modal = null;
    state.almanacVisibleMonth = monthKey;
    state.almanacVisibleDate = monthDays[0]?.date || null;
    state.selectedDate = monthDays[0]?.date || null;
    if (monthDays.length) queueAlmanacDestination(`#chapter-${monthDays[0].date}`, `Showing ${monthLabel(monthKey)}.`);
    else {
      state.focusAfterRender = fromDrawer
        ? '[data-action="open-almanac-drawer"]'
        : `.almanac-index-v8 [data-action="select-almanac-month"][data-month-key="${monthKey}"]`;
      state.almanacStatusMessage = `No journaled days in ${monthLabel(monthKey)}.`;
    }
    syncUrl();
    render();
    if (!monthDays.length) announceAlmanac(state.almanacStatusMessage);
  } else if (action === "load-earlier" || action === "retry-load-earlier") {
    loadEarlierAlmanac();
  } else if (action === "simulate-load-failure") {
    state.almanacFailNext = true;
    toast("Prototype state armed. The next earlier-month request will fail once; Retry will remain available.");
  } else if (action === "simulate-empty-archive") {
    state.almanacLoadRequestId += 1;
    state.almanacEmptyArchive = true;
    state.selectedDate = null;
    state.almanacVisibleDate = null;
    state.focusAfterRender = "#archive-empty-title-v8";
    syncUrl();
    render();
  } else if (action === "restore-sample-archive") {
    state.almanacEmptyArchive = false;
    state.selectedDate = null;
    state.almanacVisibleDate = null;
    state.almanacVisibleMonth = state.almanacMonth;
    state.focusAfterRender = "#prototype-main";
    syncUrl();
    render();
  } else if (action === "almanac-today") {
    jumpAlmanacMonth(today.slice(0, 7), {
      push: state.almanacMonth !== today.slice(0, 7) || state.almanacThrough !== today.slice(0, 7),
      originSelector: selectorForLogicalFocus(control),
    });
  } else if (action === "open-month-chooser") {
    state.modal = {
      type: "month-chooser",
      year: Number(state.month.slice(0, 4)),
      returnFocusSelector: '[data-action="open-month-chooser"]',
      focusSelector: `[data-month-key="${state.month}"]`,
    };
    render();
  } else if (action === "chooser-year") {
    const delta = Number(control.dataset.delta);
    state.modal.year = Math.min(9999, Math.max(1, state.modal.year + delta));
    state.modal.focusSelector = `[data-action="chooser-year"][data-delta="${delta}"]`;
    render();
  } else if (action === "choose-month") {
    const nextMonth = control.dataset.monthKey;
    if (!isMonthKey(nextMonth)) return;
    state.modal = null;
    const destinationFocus = nextMonth === today.slice(0, 7) ? today : `${nextMonth}-01`;
    setCalendarMonth(nextMonth, { push: nextMonth !== state.month, focusDate: destinationFocus, focusTarget: "calendar-cell" });
  } else if (action === "previous-month" || action === "next-month") {
    setCalendarMonth(shiftMonth(state.month, action === "previous-month" ? -1 : 1), { push: true });
  } else if (action === "today") {
    setCalendarMonth(today.slice(0, 7), { push: state.month !== today.slice(0, 7), focusDate: today });
  } else if (action === "select-day") showDay(date);
  else if (action === "empty-day") toast(`${longDate(date).replace(/^\w+, /, "")} has no Journal Day. Uploading a journal is the only way to begin this date on the web.`);
  else if (action === "open-day") showDay(date);
  else if (action === "open-full-day") {
    if (state.view === "almanac") {
      const stableReading = state.almanacReadingAnchor;
      const returnFocusSelector = selectorForLogicalFocus(control)
        || `#chapter-${CSS.escape(date)} [data-action="open-full-day"][data-date="${CSS.escape(date)}"]`;
      state.almanacReturnFocusDate = date;
      state.selectedDate = date;
      state.focusDate = date;
      state.screen = "month";
      // A pointer/automation activation may scroll the Read control into view
      // immediately before click dispatch. Preserve the settled reading
      // anchor captured before that incidental scroll, while returning focus
      // to the exact invoking control without using it as a scroll anchor.
      syncUrl({
        scrollY: Number.isFinite(stableReading?.scrollY) ? stableReading.scrollY : window.scrollY,
        focusSelector: returnFocusSelector,
        focusTop: null,
      });
    }
    state.selectedDate = date;
    state.focusDate = date;
    state.screen = "day";
    state.focusAfterRender = ".day-detail-header .back-button";
    syncUrl({ push: true, fullDayOpenedInApp: true, originAlreadySaved: state.view === "almanac" });
    render();
    requestAnimationFrame(() => withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" })));
  }
  else if (action === "close-calendar-selection") {
    closeCalendarSelection();
  }
  else if (action === "close-day") {
    if (currentHistorySnapshot()?.fullDayOpenedInApp) {
      window.history.back();
      return;
    }
    if (state.view === "almanac") {
      const fallbackDate = state.selectedDate;
      state.view = "calendar";
      state.calendarMonth = fallbackDate?.slice(0, 7) || state.calendarMonth;
      state.month = state.calendarMonth;
      state.screen = "month";
      state.focusDate = fallbackDate || state.focusDate;
      state.focusAfterRender = fallbackDate ? `[data-calendar-date="${fallbackDate}"]` : '[data-action="set-view"][data-view="calendar"]';
      syncUrl();
      render();
      return;
    }
    state.screen = "month";
    state.focusDate = state.selectedDate;
    state.focusAfterRender = `[data-calendar-date="${state.selectedDate}"]`;
    syncUrl();
    render();
  } else if (action === "adjacent-day" && date) {
    state.selectedDate = date;
    state.focusDate = date;
    state.screen = "day";
    state.galleryIndex[date] ??= 0;
    syncUrl({ push: state.view !== "almanac" });
    render();
    requestAnimationFrame(() => withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" })));
  } else if (action === "clear-search") {
    state.searchQuery = "";
    state.searchDraft = "";
    syncUrl();
    render();
    root.querySelector("#archive-search-input-v8")?.focus();
  } else if (action === "open-search-result") {
    state.scrollByView.search = window.scrollY;
    state.selectedDate = date;
    state.focusDate = date;
    state.month = date.slice(0, 7);
    state.galleryIndex[date] ??= 0;
    if (state.searchReturnView === "almanac") {
      state.view = "almanac";
      const anchorMonth = date.slice(0, 7);
      const normalized = normalizeAlmanacRange(state.almanacMonth, state.almanacThrough, date);
      state.almanacMonth = normalized.newest;
      state.almanacThrough = normalized.oldest;
      state.month = state.almanacMonth;
      state.almanacVisibleMonth = anchorMonth;
      state.almanacVisibleDate = date;
      state.screen = "month";
      queueAlmanacDestination(`#chapter-${date}`, `${longDate(date)} selected in the Almanac.`);
    } else {
      state.view = "calendar";
      state.screen = "day";
      state.focusAfterRender = ".day-detail-header .back-button";
    }
    syncUrl({ push: true });
    render();
  } else if (action === "open-upload") openUpload(date, uploadReturnFocusSelector(control, date));
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
    state.modal = {
      type: "photo",
      day,
      photo,
      returnFocusSelector: `[data-action="open-photo"][data-date="${date}"][data-photo-id="${CSS.escape(control.dataset.photoId)}"]`,
    };
    render();
  } else if (action === "make-cover") makeCover(date, control.dataset.photoId);
  else if (action === "move-photo") movePhoto(date, control.dataset.photoId, Number(control.dataset.direction));
  else if (action === "trigger-art") triggerArtwork(date, `[data-action="trigger-art"][data-date="${date}"]`);
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
  else if (action === "nav-placeholder") toast(`${control.dataset.label} is outside this v8 prototype’s review scope.`);
  else if (["view-provenance", "view-art-history", "view-diff", "regenerate-brief", "change-date", "download-placeholder", "trash-placeholder", "journal-menu", "correct-text", "export-placeholder", "regenerate-reflection", "generation-details"].includes(action)) {
    toast("This control is present to evaluate hierarchy; its workflow is documented but not built in this UI prototype.");
  }
}

function handleChange(event) {
  const control = event.target.closest("[data-action]");
  if (!control) return;
  if (control.dataset.action === "set-theme-preference") {
    const preference = control.value;
    if (!allowedThemePreferences.has(preference)) return;
    state.themePreference = preference;
    window.localStorage.setItem("life-in-days-v8-theme", preference);
    state.focusAfterRender = `[data-action="set-theme-preference"][value="${preference}"]`;
    render();
    toast(`${preference === "device" ? "Device theme" : `${preference[0].toUpperCase()}${preference.slice(1)} theme`} applied.`);
    return;
  }
  if (!state.modal) return;
  if (control.dataset.action === "journal-file") readJournalFile(control.files?.[0]);
  if (control.dataset.action === "upload-date") state.modal.date = control.value;
}

function handleCalendarKeyboard(event) {
  const cell = event.target.closest("[data-calendar-date]");
  if (!cell) return false;
  const key = event.key;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(key)) return false;
  event.preventDefault();
  const currentDate = cell.dataset.calendarDate;
  let targetDate;
  if (key === "PageUp" || key === "PageDown") {
    targetDate = dateForMonthDay(shiftMonth(state.month, key === "PageUp" ? -1 : 1), dateParts(currentDate).day);
  } else {
    const { year, month, day } = dateParts(currentDate);
    const mondayOffset = (utcCalendarDate(year, month, day).getUTCDay() + 6) % 7;
    const delta = key === "ArrowLeft" ? -1
      : key === "ArrowRight" ? 1
        : key === "ArrowUp" ? -7
          : key === "ArrowDown" ? 7
            : key === "Home" ? -mondayOffset
              : 6 - mondayOffset;
    targetDate = shiftDate(currentDate, delta);
  }
  const targetMonth = targetDate.slice(0, 7);
  if (targetMonth !== state.month) {
    setCalendarMonth(targetMonth, { push: true, focusDate: targetDate, focusTarget: "calendar-cell" });
    return true;
  }
  const dateCells = [...cell.closest(".calendar-grid").querySelectorAll("[data-calendar-date]")];
  const target = dateCells.find((dateCell) => dateCell.dataset.calendarDate === targetDate);
  dateCells.forEach((dateCell) => { dateCell.tabIndex = -1; });
  if (target) {
    state.focusDate = targetDate;
    syncUrl();
    target.tabIndex = 0;
    target.focus();
  }
  return true;
}

function handleKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase("en-IN") === "k" && !state.modal) {
    event.preventDefault();
    if (state.view !== "search") setView("search");
    else root.querySelector("#archive-search-input-v8")?.focus();
    return;
  }
  if (event.key === "Enter" && !event.isComposing && event.target.matches("#archive-search-input-v8")) {
    event.preventDefault();
    submitSearchValue(event.target.value);
    return;
  }
  if (event.key === "Escape" && state.modal) {
    closeModal();
    return;
  }
  if (event.key === "Escape" && state.view === "calendar" && state.screen === "month" && state.selectedDate) {
    closeCalendarSelection();
    return;
  }
  if (event.key === "Tab" && calendarSelectionSheetQuery.matches && state.view === "calendar" && state.screen === "month" && state.selectedDate) {
    const panel = root.querySelector(".calendar-selection");
    const focusable = panel
      ? [...panel.querySelectorAll('a[href], button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hidden && element.getClientRects().length)
      : [];
    if (!focusable.length) {
      event.preventDefault();
      panel?.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel)) {
      event.preventDefault();
      first.focus();
    }
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

function submitSearchValue(value) {
  state.searchDraft = String(value || "");
  state.searchQuery = state.searchDraft.trim();
  state.focusAfterRender = state.searchQuery ? "#search-results-heading-v8" : "#archive-search-input-v8";
  syncUrl();
  render();
}

function handleSubmit(event) {
  const form = event.target.closest('[data-action="search-form"]');
  if (!form) return;
  event.preventDefault();
  submitSearchValue(form.querySelector("#archive-search-input-v8")?.value);
}

let almanacScrollFrame = 0;
let almanacMemoryTimer = 0;
function updateAlmanacViewportState() {
  almanacScrollFrame = 0;
  if (state.view !== "almanac" || state.screen !== "month" || state.modal || state.almanacRestoringHistory) return;
  const offset = Math.min(window.innerHeight * 0.32, 240);
  const articles = [...root.querySelectorAll("[data-chapter-date]")];
  const activeArticle = articles.find((article) => article.getBoundingClientRect().bottom > offset) || articles.at(-1) || null;
  const volumes = [...root.querySelectorAll("[data-almanac-month]")];
  const activeVolume = volumes.find((volume) => volume.getBoundingClientRect().bottom > offset) || volumes.at(-1) || null;
  const nextDate = activeArticle?.dataset.chapterDate || null;
  const nextMonth = activeArticle?.dataset.chapterDate?.slice(0, 7) || activeVolume?.dataset.almanacMonth || state.almanacMonth;
  if (nextDate === state.almanacVisibleDate && nextMonth === state.almanacVisibleMonth) return;
  state.almanacVisibleDate = nextDate;
  state.almanacVisibleMonth = nextMonth;
  root.querySelectorAll("[data-index-month]").forEach((group) => group.classList.toggle("is-current", group.dataset.indexMonth === nextMonth));
  root.querySelectorAll('[data-action="select-almanac-chapter"]').forEach((button) => {
    if (button.dataset.date === nextDate) button.setAttribute("aria-current", "location");
    else button.removeAttribute("aria-current");
  });
  root.querySelectorAll('[data-action="select-almanac-month"]').forEach((button) => {
    if (!nextDate && button.dataset.monthKey === nextMonth) button.setAttribute("aria-current", "location");
    else button.removeAttribute("aria-current");
  });
  root.querySelectorAll("[data-almanac-toolbar-month]").forEach((label) => { label.textContent = monthLabel(nextMonth); });
  const collapsedLabel = root.querySelector(".almanac-index-v8.is-collapsed .almanac-rail-toggle span");
  if (collapsedLabel) collapsedLabel.textContent = monthLabel(nextMonth);
}

function handleAlmanacScroll() {
  if (almanacScrollFrame) return;
  almanacScrollFrame = requestAnimationFrame(updateAlmanacViewportState);
  clearTimeout(almanacMemoryTimer);
  almanacMemoryTimer = window.setTimeout(() => {
    const switchingViews = document.activeElement?.closest?.('[data-action="set-view"]');
    if (state.view === "almanac" && state.screen === "month" && !state.modal && !switchingViews) {
      state.viewMemory.almanac = captureViewMemory("almanac");
      state.almanacReadingAnchor = captureAlmanacReadingAnchor();
    }
  }, 180);
}

function selectorForLogicalFocus(element, { compact = calendarSelectionSheetQuery.matches } = {}) {
  if (!element || element === document.body) return null;
  if (element.id === "archive-search-input-v8") return "#archive-search-input-v8";
  const control = element.closest?.("[data-action]");
  const chapter = element.closest?.("[data-chapter-date]");
  const inAlmanacIndex = Boolean(element.closest?.(".almanac-index-v8, .almanac-mobile-drawer-v8"));
  if (control?.dataset.action === "open-almanac-drawer" || control?.dataset.action === "toggle-almanac-rail") {
    return compact ? '[data-action="open-almanac-drawer"]' : '[data-action="toggle-almanac-rail"]';
  }
  if (control?.dataset.action === "open-almanac-jump") {
    // The compact Jump control lives inside a closed drawer. Preserve the
    // logical navigation point by targeting Browse Almanac when moving into
    // compact mode, and the visible Jump trigger when moving back to wide.
    return compact ? '[data-action="open-almanac-drawer"]' : '[data-action="open-almanac-jump"]';
  }
  if (inAlmanacIndex && control?.dataset.action) {
    const fields = ["date", "monthKey", "delta", "view", "section"];
    const qualifiers = fields
      .filter((field) => control.dataset[field] != null)
      .map((field) => `[data-${field.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${CSS.escape(control.dataset[field])}"]`)
      .join("");
    const exact = `[data-action="${CSS.escape(control.dataset.action)}"]${qualifiers}`;
    if (compact) {
      // The compact equivalents live inside a closed modal sheet. Keep the
      // intended item in memory, but focus the visible Browse trigger.
      state.pendingDrawerFocusSelector = exact;
      return '[data-action="open-almanac-drawer"]';
    }
    return `.almanac-index-v8 ${exact}`;
  }
  if (control?.dataset.action) {
    const fields = ["date", "monthKey", "delta", "view", "section"];
    const qualifiers = fields
      .filter((field) => control.dataset[field] != null)
      .map((field) => `[data-${field.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${CSS.escape(control.dataset[field])}"]`)
      .join("");
    const exact = `[data-action="${CSS.escape(control.dataset.action)}"]${qualifiers}`;
    if (control.closest(".almanac-pagination-v8")) return `.almanac-pagination-v8 ${exact}`;
    if (control.closest(".almanac-title-actions")) return `.almanac-title-actions ${exact}`;
    if (control.closest(".almanac-empty-v8")) return `.almanac-empty-v8 ${exact}`;
    if (chapter?.dataset.chapterDate) return `#chapter-${CSS.escape(chapter.dataset.chapterDate)} ${exact}`;
    if (control.closest(".sources-section")) return `.sources-section ${exact}`;
    if (control.closest(".day-actions-section")) return `.day-actions-section ${exact}`;
    if (control.closest(".unified-topbar")) return `.unified-topbar ${exact}`;
    return exact;
  }
  if (chapter?.dataset.chapterDate) return `#chapter-${CSS.escape(chapter.dataset.chapterDate)}`;
  if (element.id) return `#${CSS.escape(element.id)}`;
  return null;
}

function resolveLogicalSelector(selector) {
  if (!selector) return null;
  const candidates = [...root.querySelectorAll(selector), ...modalRoot.querySelectorAll(selector)];
  return candidates.find((element) => !element.hidden && !element.closest("[hidden],[inert]") && element.getClientRects().length) || null;
}

function captureTransientInteraction() {
  syncLiveSearchDraft();
  const active = document.activeElement;
  const selector = selectorForLogicalFocus(active) || state.transientFocusSelector;
  if (active?.id === "archive-search-input-v8") {
    state.searchSelection = {
      start: active.selectionStart,
      end: active.selectionEnd,
      direction: active.selectionDirection,
    };
  }
  if (selector === "#archive-search-input-v8" && state.searchSelection) state.pendingInputSelection = { ...state.searchSelection };
  return selector;
}

function handlePopState(event) {
  state.almanacLoadRequestId += 1;
  const snapshot = historyEntries.get(event?.state?.entryId) || null;
  const params = stripLegacySearchQueryFromUrl().searchParams;
  const nextView = params.get("view");
  state.view = allowedViews.has(nextView) ? nextView : "calendar";
  const nextMonth = params.get("month");
  const nextThrough = params.get("through");
  const nextDate = params.get("date");
  const validLiveDate = isDateKey(nextDate) && Boolean(days[nextDate]);
  state.almanacEmptyArchive = Boolean(snapshot?.almanacEmptyArchive);

  if (state.view === "almanac") {
    const newest = isMonthKey(nextMonth) ? nextMonth : validLiveDate ? nextDate.slice(0, 7) : prototypeNewestMonth;
    const oldest = isMonthKey(nextThrough) && monthOrdinal(nextThrough) <= monthOrdinal(newest) ? nextThrough : newest;
    const normalized = normalizeAlmanacRange(newest, oldest, validLiveDate ? nextDate : null);
    state.almanacMonth = normalized.newest;
    state.almanacThrough = normalized.oldest;
    state.month = normalized.newest;
    state.selectedDate = validLiveDate ? nextDate : null;
    state.almanacVisibleMonth = snapshot?.almanacVisibleMonth || state.selectedDate?.slice(0, 7) || normalized.newest;
    state.almanacVisibleDate = snapshot?.almanacVisibleDate && days[snapshot.almanacVisibleDate]
      ? snapshot.almanacVisibleDate
      : state.selectedDate;
    state.almanacReturnFocusDate = snapshot?.almanacReturnFocusDate && days[snapshot.almanacReturnFocusDate]
      ? snapshot.almanacReturnFocusDate
      : null;
  } else {
    state.month = isMonthKey(nextMonth) ? nextMonth : validLiveDate ? nextDate.slice(0, 7) : snapshot?.calendarMonth || prototypeNewestMonth;
    if (state.view === "calendar") state.calendarMonth = state.month;
    state.selectedDate = state.view === "calendar" && validLiveDate && nextDate.startsWith(`${state.month}-`) ? nextDate : null;
  }

  const rememberedFocusDate = snapshot?.focusDate;
  state.focusDate = datesForMonth(state.month).includes(rememberedFocusDate)
    ? rememberedFocusDate
    : state.selectedDate || (state.month === today.slice(0, 7) ? today : `${state.month}-01`);
  if (state.pendingSelectionCloseFocus && !state.selectedDate && state.pendingSelectionCloseFocus.startsWith(`${state.month}-`)) {
    state.focusDate = state.pendingSelectionCloseFocus;
  }
  state.pendingSelectionCloseFocus = null;
  state.screen = ["calendar", "almanac"].includes(state.view) && params.get("screen") === "day" && days[state.selectedDate] ? "day" : "month";
  const nextSettingsSection = params.get("section");
  state.settingsSection = allowedSettingsSections.has(nextSettingsSection) ? nextSettingsSection : "overview";
  state.almanacCollapsed = params.get("rail") === "collapsed";
  state.almanacStatus = "idle";
  state.almanacFailNext = false;
  state.modal = null;
  state.monthAnnouncement = `Showing ${monthLabel(state.month)}`;

  const defaultFocus = state.view === "search" ? "#archive-search-input-v8"
    : state.view === "settings" ? "#settings-section-heading"
      : state.view === "calendar" && state.screen === "day" ? ".day-detail-header .back-button"
        : state.view === "calendar" && state.selectedDate ? ".calendar-selection"
          : state.view === "calendar" ? `[data-calendar-date="${state.focusDate}"]`
            : state.view === "almanac" && state.screen === "day" ? ".day-detail-header .back-button"
              : state.view === "almanac" && state.selectedDate ? `#chapter-${state.selectedDate}`
                : `[data-action="set-view"][data-view="${state.view}"]`;
  let focusSelector = snapshot?.focusSelector || defaultFocus;
  if (calendarSelectionSheetQuery.matches && focusSelector?.startsWith(".almanac-index-v8 ")) {
    state.pendingDrawerFocusSelector = focusSelector.replace(/^\.almanac-index-v8\s+/, "");
    focusSelector = '[data-action="open-almanac-drawer"]';
  }
  state.focusAfterRender = focusSelector;
  const historyScrollY = Number(snapshot?.scrollY) || 0;
  const historyFocusTop = Number.isFinite(snapshot?.focusTop) ? snapshot.focusTop : null;
  state.almanacRestoringHistory = state.view === "almanac" && state.screen === "month";

  let entryId = event?.state?.entryId;
  if (!snapshot) {
    entryId = nextHistoryEntryId();
    historyEntries.set(entryId, captureHistorySnapshot({ scrollY: 0, focusSelector: defaultFocus, focusTop: null }));
  }
  window.history.replaceState({ entryId }, "", canonicalRouteUrl());
  render();
  requestAnimationFrame(() => { calendarStatusLive.textContent = state.monthAnnouncement; });
  restoreViewScroll(state.view, historyScrollY, focusSelector, historyFocusTop);
}

root.addEventListener("click", handleClick);
root.addEventListener("submit", handleSubmit);
root.addEventListener("change", handleChange);
root.addEventListener("input", (event) => {
  if (event.target.matches("#archive-search-input-v8")) {
    state.searchDraft = event.target.value;
    state.searchSelection = {
      start: event.target.selectionStart,
      end: event.target.selectionEnd,
      direction: event.target.selectionDirection,
    };
  }
});
document.addEventListener("focusin", (event) => {
  const selector = selectorForLogicalFocus(event.target);
  if (selector) state.transientFocusSelector = selector;
});
document.addEventListener("selectionchange", () => {
  const input = document.activeElement;
  if (input?.id === "archive-search-input-v8") {
    state.searchSelection = { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection };
  }
});
modalRoot.addEventListener("click", handleClick);
modalRoot.addEventListener("change", handleChange);
document.addEventListener("keydown", handleKeydown);
window.addEventListener("popstate", handlePopState);
window.addEventListener("scroll", handleAlmanacScroll, { passive: true });
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (state.themePreference === "device") {
    const selector = captureTransientInteraction();
    if (state.modal) state.modal.focusSelector = selector;
    else state.focusAfterRender = selector;
    if (state.modal) render();
    else renderPreservingAlmanacReading(selector);
  }
});
calendarSelectionSheetQuery.addEventListener("change", (event) => {
  let selector = captureTransientInteraction();
  if (event.matches && selector?.startsWith(".almanac-index-v8 ")) {
    state.pendingDrawerFocusSelector = selector.replace(/^\.almanac-index-v8\s+/, "");
    selector = '[data-action="open-almanac-drawer"]';
  } else if (!event.matches && selector?.includes('open-almanac-drawer') && state.pendingDrawerFocusSelector) {
    selector = `.almanac-index-v8 ${state.pendingDrawerFocusSelector}`;
  }
  if (state.view === "calendar" && state.selectedDate && state.screen === "month") state.focusAfterRender = ".calendar-selection";
  else if (!state.modal) state.focusAfterRender = selector;
  if (state.view === "almanac") {
    if (state.modal?.type === "almanac-drawer" && !event.matches) {
      const wideSelector = selectorForLogicalFocus(document.activeElement, { compact: false });
      state.modal = null;
      state.focusAfterRender = wideSelector || '[data-action="toggle-almanac-rail"]';
    } else {
      const responsiveSelector = selectorForLogicalFocus(document.activeElement, { compact: event.matches }) || selector;
      if (state.modal) state.modal.focusSelector = responsiveSelector;
      else state.focusAfterRender = responsiveSelector;
    }
  }
  if (state.modal?.returnFocusSelector) {
    const returnSelector = state.modal.returnFocusSelector;
    if (event.matches && (returnSelector.includes(".almanac-index-v8") || returnSelector.includes('open-almanac-jump') || returnSelector.includes('toggle-almanac-rail'))) {
      state.pendingDrawerFocusSelector = returnSelector.replace(/^\.almanac-index-v8\s+/, "");
      state.modal.returnFocusSelector = '[data-action="open-almanac-drawer"]';
      state.modal.returnToDrawer = false;
    } else if (event.matches && returnSelector.includes('.unified-topbar') && returnSelector.includes('open-upload')) {
      state.modal.returnFocusSelector = '[data-action="open-more"]';
    } else if (!event.matches && (returnSelector.includes('open-almanac-drawer') || returnSelector.includes('.almanac-mobile-drawer-v8'))) {
      state.modal.returnFocusSelector = state.modal.type === "almanac-jump"
        ? '.almanac-index-v8 [data-action="open-almanac-jump"]'
        : state.pendingDrawerFocusSelector
          ? `.almanac-index-v8 ${state.pendingDrawerFocusSelector}`
          : '[data-action="toggle-almanac-rail"]';
      state.modal.returnToDrawer = false;
    } else if (!event.matches && returnSelector.includes('open-more') && state.modal.type === "upload") {
      state.modal.returnFocusSelector = '.unified-topbar [data-action="open-upload"]';
    }
  }
  render();
});

syncUrl();
render();
