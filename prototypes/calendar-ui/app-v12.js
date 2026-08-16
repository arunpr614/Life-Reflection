/*
 * PROTOTYPE ONLY — Life in Days v12 Telegram Capture Companion.
 * All data and mutations are simulated in memory. There are no integrations.
 */

const root = document.querySelector("#prototype-root");
const modalRoot = document.querySelector("#modal-root");
const calendarStatusLive = document.querySelector("#calendar-status-live-v9");
const almanacStatusLive = document.querySelector("#almanac-status-live-v9");
const shellStatusLive = document.querySelector("#shell-status-live-v10");
const toastRegion = document.querySelector("#toast-region");
const calendarSelectionSheetQuery = window.matchMedia("(max-width: 960px)");
const dateReviewStatusLive = document.querySelector("#date-review-status-live-v11");
const captureStatusLiveV12 = document.querySelector("#capture-status-live-v12");
if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

const SYNTHETIC_NOTICE = "Fictional sample written only for this design prototype.";
const today = "2026-08-13";
const prototypeNewestMonth = "2026-08";
const prototypeOldestMonth = "2026-05";
const DATE_REVIEW_MAX_DATE = "2026-08-13";

const DATE_REVIEW_FIXTURES = Object.freeze({
  "date-review/empty": "Empty",
  "date-review/populated": "Four preserved items",
  "date-review/final-item": "Final item",
  "date-review/loading": "Loading",
  "date-review/load-failure": "Load failure",
});
const DATE_REVIEW_BRANCHES = Object.freeze({
  success: "Success next",
  "repeat-failure": "Failure next",
  "rapid-repeat": "Rapid repeat",
  "navigate-before-completion": "Navigate before completion",
  "date-change-before-completion": "Date change before completion",
  "connection-interruption": "Connection interruption",
});

// Product owns every differing fixture value and sentence in this table.
// The opaque keys never enter a URL or browser-history payload.
const DATE_REVIEW_ITEMS = Object.freeze([
  Object.freeze({
    key: "held-a",
    source: "telegram",
    sourceType: "Telegram photo",
    reasonHeading: "Invalid entered date",
    enteredDate: "2026-13-08",
    originalTimestamp: "12 Aug 2026 7:40 pm IST",
    received: "12 Aug 2026 7:41 pm IST",
    added: "12 Aug 2026 7:41 pm IST",
    caption: "Monsoon light through the window",
    reason: "The entered date 2026-13-08 is not a valid Journal Date. Telegram receipt time is shown only as provenance and has not been used.",
    guidedDate: "2026-08-10",
    image: "assets/photo-rain-window.svg",
    destinationId: "date-review-photo-1",
    successNoun: "Photo",
  }),
  Object.freeze({
    key: "held-b",
    source: "telegram",
    sourceType: "Telegram photo",
    reasonHeading: "Future entered date",
    enteredDate: "2026-08-20",
    originalTimestamp: "12 Aug 2026 8:16 pm IST",
    received: "12 Aug 2026 8:17 pm IST",
    added: "12 Aug 2026 8:17 pm IST",
    caption: "A quiet street after rain",
    reason: "The entered date 2026-08-20 is after the prototype date. Telegram receipt time has not been used.",
    guidedDate: "2026-08-11",
    image: "assets/photo-balcony-cups.svg",
    destinationId: "date-review-photo-2",
    successNoun: "Photo",
  }),
  Object.freeze({
    key: "held-c",
    source: "voicenotes",
    sourceType: "VoiceNotes journal",
    reasonHeading: "Original Timestamp unavailable",
    title: "Late train notes — synthetic fixture",
    originalTimestamp: "Unavailable from VoiceNotes",
    retrieved: "12 Aug 2026 9:05 pm IST",
    added: "12 Aug 2026 9:05 pm IST",
    reason: "VoiceNotes did not provide a creation timestamp that can assign a Journal Date. The operational retrieval time is not a Journal Date suggestion.",
    guidedDate: "2026-08-08",
    bodyPreview: `${SYNTHETIC_NOTICE} The late train was quieter than expected, and the station lights receded one by one.`,
    destinationId: "date-review-journal-1",
    successNoun: "Voice Journal",
  }),
  Object.freeze({
    key: "held-d",
    source: "voicenotes",
    sourceType: "VoiceNotes journal",
    reasonHeading: "Untrusted creation value",
    title: "Morning walk — synthetic fixture",
    rawValue: "2026-08-12 07:25",
    provenanceStatus: "Timezone absent · untrusted · retained without parsing",
    originalTimestamp: "Not established",
    retrieved: "13 Aug 2026 9:14 am IST",
    added: "13 Aug 2026 9:14 am IST",
    reason: "VoiceNotes returned a creation value without a timezone. It is preserved as untrusted provenance and has not been converted into a Journal Date.",
    guidedDate: "2026-08-02",
    bodyPreview: `${SYNTHETIC_NOTICE} The morning path was still damp, and the first shops were only beginning to open.`,
    destinationId: "date-review-journal-2",
    successNoun: "Voice Journal",
  }),
]);

function dateReviewFixtureState(fixture = "date-review/empty", generation = 0, branch = "success") {
  const safeFixture = Object.hasOwn(DATE_REVIEW_FIXTURES, fixture) ? fixture : "date-review/empty";
  const unresolved = safeFixture === "date-review/empty"
    ? []
    : safeFixture === "date-review/final-item"
      ? [DATE_REVIEW_ITEMS[0].key]
      : DATE_REVIEW_ITEMS.map((item) => item.key);
  return {
    fixture: safeFixture,
    status: safeFixture === "date-review/loading" ? "loading" : safeFixture === "date-review/load-failure" ? "failed" : "settled",
    unresolved,
    resolved: {},
    detailKey: null,
    draft: "",
    validation: { kind: "blank", message: "" },
    preview: null,
    assignment: { status: "idle", operation: null, attempt: 0 },
    success: null,
    generation,
    branch: Object.hasOwn(DATE_REVIEW_BRANCHES, branch) ? branch : "success",
    loadAttempt: 0,
  };
}

// Pure reducer/state-machine seam for the v11 question. DOM, timers, history,
// and destination mutation stay outside this module.
function transitionDateReview(review, type, payload = {}) {
  switch (type) {
    case "FIXTURE_SET":
      return dateReviewFixtureState(payload.fixture, review.generation + 1, review.branch);
    case "BRANCH_SET":
      return { ...review, branch: Object.hasOwn(DATE_REVIEW_BRANCHES, payload.branch) ? payload.branch : "success" };
    case "DETAIL_OPEN":
      if (!review.unresolved.includes(payload.key)) return review;
      return {
        ...review,
        detailKey: payload.key,
        draft: "",
        validation: { kind: "blank", message: "" },
        preview: null,
        assignment: { status: "idle", operation: null, attempt: review.assignment.attempt },
        success: null,
      };
    case "DETAIL_CLOSE":
      return {
        ...review,
        detailKey: null,
        draft: "",
        validation: { kind: "blank", message: "" },
        preview: null,
        assignment: { status: "idle", operation: null, attempt: review.assignment.attempt },
      };
    case "DRAFT_SET":
      return {
        ...review,
        draft: payload.value,
        validation: payload.validation,
        preview: payload.preview || null,
        assignment: review.assignment.status === "assigning"
          ? { status: "idle", operation: null, attempt: review.assignment.attempt }
          : review.assignment.status === "failed"
            ? { status: "idle", operation: null, attempt: review.assignment.attempt }
            : review.assignment,
      };
    case "ASSIGN_START":
      if (!review.detailKey || !review.preview || review.validation.kind !== "valid" || review.assignment.status === "assigning") return review;
      return {
        ...review,
        assignment: {
          status: "assigning",
          operation: payload.operation,
          attempt: review.assignment.attempt + 1,
        },
        success: null,
      };
    case "ASSIGN_FAIL":
      if (review.assignment.operation !== payload.operation) return review;
      return { ...review, assignment: { status: "failed", operation: null, attempt: review.assignment.attempt } };
    case "ASSIGN_CANCEL":
      return { ...review, assignment: { status: "idle", operation: null, attempt: review.assignment.attempt } };
    case "ASSIGN_SUCCESS":
      if (review.assignment.operation !== payload.operation || !review.unresolved.includes(payload.key)) return review;
      return {
        ...review,
        unresolved: review.unresolved.filter((key) => key !== payload.key),
        resolved: { ...review.resolved, [payload.key]: payload.date },
        detailKey: null,
        draft: "",
        validation: { kind: "blank", message: "" },
        preview: null,
        assignment: { status: "idle", operation: null, attempt: review.assignment.attempt },
        success: { key: payload.key, date: payload.date, message: payload.message },
      };
    case "LOAD_START":
      return {
        ...review,
        status: "loading",
        unresolved: [],
        detailKey: null,
        success: null,
        loadAttempt: review.loadAttempt + 1,
        generation: review.generation + 1,
        assignment: { status: "idle", operation: null, attempt: review.assignment.attempt },
      };
    case "LOAD_FAIL":
      return payload.loadAttempt === review.loadAttempt ? { ...review, status: "failed", unresolved: [] } : review;
    case "LOAD_CANCEL":
      return { ...review, status: "failed", unresolved: [], generation: review.generation + 1 };
    case "LOAD_READY":
      return payload.loadAttempt === review.loadAttempt
        ? { ...review, status: "settled", unresolved: DATE_REVIEW_ITEMS.map((item) => item.key), fixture: "date-review/populated" }
        : review;
    case "INVALIDATE":
      return {
        ...review,
        assignment: { status: "idle", operation: null, attempt: review.assignment.attempt },
        generation: review.generation + 1,
      };
    default:
      return review;
  }
}

const CAPTURE_FIXED_DATE_V12 = "2026-08-13";
const CAPTURE_FIXED_DATE_LABEL_V12 = "13 August 2026";
const CAPTURE_TIMEZONE_V12 = "Asia/Kolkata";
const CAPTURE_GUIDE_V12 = Object.freeze([
  "Send photos only in your configured private Telegram chat. Groups and other senders are rejected.",
  "Ordinary photo messages may be compressed by Telegram. Send an image as a document to preserve the exact image bytes Telegram supplies.",
  "Accepted still images: JPEG, PNG, WebP, HEIC, and HEIF. Each file may be up to 20 MB, 100 megapixels, and 20,000 pixels on either side.",
  "Life in Days sets no product-level item-count limit. Each accepted image becomes a separate Daily Photo.",
  "Start a caption with YYYY-MM-DD to choose a Journal Date. Historical dates are allowed; future dates are not. Without a leading date, Telegram receipt time in Asia/Kolkata supplies the Journal Date.",
  "Text after the leading date becomes the Photo Caption. Real photos, their metadata and identifiers, and Photo Captions are never sent to AI.",
]);

const CAPTURE_SCENARIOS_V12 = Object.freeze({
  guide: Object.freeze({ key: "guide", kind: "guide", label: "Guide" }),
  t1: Object.freeze({
    key: "t1",
    kind: "scenario",
    label: "T1 · ordinary photo",
    title: "Ordinary compressed photo",
    asset: "assets/photo-rain-window.svg",
    alt: "Synthetic rain-window fixture with an amber room, wet glass, and blue-green trees",
    sourceForm: "Telegram photo message",
    format: "JPEG",
    bytes: 1842112,
    width: 3024,
    height: 4032,
    messageTime: "13 Aug 2026 7:58 am IST",
    receivedTime: "13 Aug 2026 8:00 am IST",
    rawCaption: "Morning rain on the balcony",
    photoCaption: "Morning rain on the balcony",
    journalDate: "2026-08-13",
    dateSource: "Telegram receipt time in Asia/Kolkata",
    originalTimestamp: "13 Aug 2026 7:58 am IST",
    success: "Photo saved to 13 August 2026.",
    destination: "2 photos and 2 journals → 3 photos and 2 journals. Appended chronologically before the 4:38 pm and 7:21 pm photos; the existing first real-photo Calendar Cover remains.",
    actions: ["view-day", "change-date"],
  }),
  t2: Object.freeze({
    key: "t2",
    kind: "scenario",
    label: "T2 · image document",
    title: "Image document with a historical date",
    asset: "assets/photo-market-flowers.svg",
    alt: "Synthetic flower-market fixture with orange, cream, and red flowers under a green awning",
    sourceForm: "Telegram image document",
    format: "HEIC",
    bytes: 6482944,
    width: 3024,
    height: 4032,
    messageTime: "13 Aug 2026 9:02 am IST",
    receivedTime: "13 Aug 2026 9:03 am IST",
    rawCaption: "2026-08-10 Monsoon light through the window",
    photoCaption: "Monsoon light through the window",
    journalDate: "2026-08-10",
    dateSource: "Explicit leading date instruction",
    originalTimestamp: "13 Aug 2026 9:02 am IST",
    success: "Photo saved to 10 August 2026.",
    destination: "No current day → visible day with 1 photo and 0 journals. This real Daily Photo becomes Calendar Cover.",
    actions: ["view-day", "change-date"],
  }),
  t3: Object.freeze({
    key: "t3",
    kind: "scenario",
    label: "T3 · three received photos",
    title: "Three received media-group messages",
    sourceForm: "Three Telegram photo messages",
    format: "JPEG · each received photo is a still image within every limit",
    bytes: null,
    width: null,
    height: null,
    messageTime: "13 Aug 2026 9:20:00–9:20:02 am IST",
    receivedTime: "13 Aug 2026 9:21:00–9:21:02 am IST",
    rawCaption: "2026-08-09\nSunday market flowers",
    photoCaption: "Sunday market flowers",
    journalDate: "2026-08-09",
    dateSource: "Explicit leading date instruction from the caption-bearing message",
    originalTimestamp: "13 Aug 2026 9:20:00–9:20:02 am IST",
    success: "3 received photos saved to 9 August 2026.",
    destination: "No current day → visible day with 3 photos and 0 journals, in received order. The first Daily Photo becomes Calendar Cover.",
    actions: ["view-day", "change-date"],
    members: Object.freeze([
      Object.freeze({ asset: "assets/photo-market-flowers.svg", alt: "Synthetic flower-market fixture", messageTime: "13 Aug 2026 9:20:00 am IST", receivedTime: "13 Aug 2026 9:21:00 am IST", caption: "Sunday market flowers" }),
      Object.freeze({ asset: "assets/photo-balcony-cups.svg", alt: "Synthetic balcony-cups fixture", messageTime: "13 Aug 2026 9:20:01 am IST", receivedTime: "13 Aug 2026 9:21:01 am IST", caption: "" }),
      Object.freeze({ asset: "assets/photo-rain-window.svg", alt: "Synthetic rain-window fixture", messageTime: "13 Aug 2026 9:20:02 am IST", receivedTime: "13 Aug 2026 9:21:02 am IST", caption: "" }),
    ]),
  }),
  t4: Object.freeze({
    key: "t4",
    kind: "scenario",
    label: "T4 · forwarded authorized",
    title: "Forwarded photo from the authorized private chat",
    asset: "assets/photo-rain-window.svg",
    alt: "Synthetic rain-window fixture with an amber room, wet glass, and blue-green trees",
    sourceForm: "Telegram photo message",
    format: "JPEG",
    bytes: 1842112,
    width: 3024,
    height: 4032,
    messageTime: "13 Aug 2026 7:58 am IST",
    receivedTime: "13 Aug 2026 8:00 am IST",
    rawCaption: "Morning rain on the balcony",
    photoCaption: "Morning rain on the balcony",
    journalDate: "2026-08-13",
    dateSource: "Telegram receipt time in Asia/Kolkata",
    originalTimestamp: "13 Aug 2026 7:58 am IST",
    forwarded: true,
    success: "Photo saved to 13 August 2026.",
    destination: "2 photos and 2 journals → 3 photos and 2 journals. Appended chronologically before the 4:38 pm and 7:21 pm photos; the existing first real-photo Calendar Cover remains.",
    actions: ["view-day", "change-date"],
  }),
  t5: Object.freeze({
    key: "t5",
    kind: "scenario",
    label: "T5 · invalid date review",
    title: "Invalid leading date",
    asset: "assets/photo-rain-window.svg",
    alt: "Synthetic rain-window fixture with an amber room, wet glass, and blue-green trees",
    sourceForm: "Telegram photo message",
    format: "Not specified in this synthetic fixture",
    bytes: null,
    width: null,
    height: null,
    messageTime: "12 Aug 2026 7:40 pm IST",
    receivedTime: "12 Aug 2026 7:41 pm IST",
    rawCaption: "2026-13-08 Monsoon light through the window",
    photoCaption: "Monsoon light through the window",
    enteredDate: "2026-13-08",
    dateSource: "Invalid leading date instruction",
    originalTimestamp: "12 Aug 2026 7:40 pm IST",
    reviewKey: "held-a",
    reviewMessage: "The photo is safe, but 2026-13-08 is not a valid Journal Date. Choose a date to add it to the calendar.",
    reviewBoundary: "It is in Needs Date Review and is not on the Calendar or Almanac.",
    actions: ["review-date"],
  }),
  t6: Object.freeze({
    key: "t6",
    kind: "scenario",
    label: "T6 · future date review",
    title: "Future leading date",
    asset: "assets/photo-balcony-cups.svg",
    alt: "Synthetic balcony fixture with two cups, plants, and evening city lights",
    sourceForm: "Telegram photo message",
    format: "Not specified in this synthetic fixture",
    bytes: null,
    width: null,
    height: null,
    messageTime: "12 Aug 2026 8:16 pm IST",
    receivedTime: "12 Aug 2026 8:17 pm IST",
    rawCaption: "2026-08-20 A quiet street after rain",
    photoCaption: "A quiet street after rain",
    enteredDate: "2026-08-20",
    dateSource: "Future leading date instruction",
    originalTimestamp: "12 Aug 2026 8:16 pm IST",
    reviewKey: "held-b",
    reviewMessage: "The photo is safe, but future Journal Dates are not supported in this version. Choose 13 August 2026 or earlier.",
    reviewBoundary: "It is in Needs Date Review and is not on the Calendar or Almanac.",
    actions: ["review-date"],
  }),
  t7: Object.freeze({
    key: "t7",
    kind: "scenario",
    label: "T7 · capture failure",
    title: "Failure before durable capture",
    sourceForm: "Telegram image document",
    format: "HEIF",
    bytes: 4104192,
    width: 3024,
    height: 4032,
    messageTime: "Not specified in this synthetic fixture",
    receivedTime: "13 Aug 2026 10:12 am IST",
    rawCaption: "2026-08-10 Station light before dawn",
    photoCaption: "Station light before dawn",
    journalDate: "2026-08-10",
    dateSource: "Explicit leading date instruction",
    originalTimestamp: "Not specified in this synthetic fixture",
    failure: "Photo was not saved because Life in Days could not finish storing it. Nothing was added. The Telegram message remains in this chat.",
    failureState: "No Source Item · no Journal Day change · safe to retry",
    success: "Photo saved to 10 August 2026.",
    actions: [],
  }),
});

const CAPTURE_AUTHORIZATION_FIXTURES_V12 = Object.freeze({
  group: "Group chat",
  "other-sender": "Other sender",
  "other-private-chat": "Other private chat",
  secret: "Invalid or missing secret",
  forwarded: "Forwarded authorized",
});

const CAPTURE_MEDIA_FIXTURES_V12 = Object.freeze({
  jpeg: Object.freeze({ label: "JPEG", format: "JPEG", bytes: 1842112, width: 3024, height: 4032 }),
  png: Object.freeze({ label: "PNG", format: "PNG", bytes: 2210016, width: 2400, height: 3000 }),
  webp: Object.freeze({ label: "WebP", format: "WebP", bytes: 1280040, width: 2400, height: 3000 }),
  heic: Object.freeze({ label: "HEIC", format: "HEIC", bytes: 6482944, width: 3024, height: 4032 }),
  heif: Object.freeze({ label: "HEIF", format: "HEIF", bytes: 4104192, width: 3024, height: 4032 }),
  "mismatch-png": Object.freeze({ label: "Filename mismatch · PNG", format: "PNG", bytes: 2210016, width: 2400, height: 3000, sourceForm: "Telegram image document", note: "The filename says JPEG; decoded bytes identify PNG." }),
  equality: Object.freeze({ label: "Equality HEIF", format: "HEIF", bytes: 20000000, width: 20000, height: 5000 }),
  animated: Object.freeze({ label: "Animated WebP", format: "WebP", bytes: 1280040, width: 2400, height: 3000, animated: true }),
  svg: Object.freeze({ label: "SVG", format: "SVG", bytes: 84200, width: 1200, height: 1500 }),
  tiff: Object.freeze({ label: "TIFF", format: "TIFF", bytes: 3200000, width: 2400, height: 3000 }),
  pdf: Object.freeze({ label: "PDF", format: "PDF", bytes: 920000, width: 1200, height: 1500 }),
  raw: Object.freeze({ label: "RAW", format: "RAW", bytes: 8400000, width: 3024, height: 4032 }),
  disguised: Object.freeze({ label: "Filename says JPEG · decodes TIFF", format: "TIFF", bytes: 3200000, width: 2400, height: 3000, disguised: true }),
  malformed: Object.freeze({ label: "Malformed plus oversized", format: "Unknown", bytes: 20000001, width: 20001, height: 800, decoded: false }),
  "over-bytes": Object.freeze({ label: "20,000,001 bytes", format: "HEIF", bytes: 20000001, width: 2000, height: 2500 }),
  "over-pixels": Object.freeze({ label: "108 megapixels", format: "JPEG", bytes: 18000000, width: 12000, height: 9000 }),
  "over-side": Object.freeze({ label: "20,001 pixel side", format: "PNG", bytes: 5000000, width: 20001, height: 800 }),
});

const CAPTURE_CAPTION_FIXTURES_V12 = Object.freeze({
  "valid-historical": Object.freeze({ label: "Valid historical date", raw: "2026-08-10 Market morning" }),
  "valid-today": Object.freeze({ label: "Valid prototype date", raw: "2026-08-13 Market morning" }),
  "token-only": Object.freeze({ label: "Date token only", raw: "2026-08-10" }),
  multiline: Object.freeze({ label: "Line-break caption", raw: "2026-08-09\nSunday market flowers" }),
  "leading-space": Object.freeze({ label: "Leading space · no match", raw: " 2026-08-10 Market morning" }),
  slashes: Object.freeze({ label: "Slashes · no match", raw: "2026/08/10 Market morning" }),
  "short-month": Object.freeze({ label: "Short month · no match", raw: "2026-8-10 Market morning" }),
  "no-separator": Object.freeze({ label: "No separator · no match", raw: "2026-08-10Market morning" }),
  "invalid-month": Object.freeze({ label: "Invalid month · review", raw: "2026-13-08 Market morning" }),
  impossible: Object.freeze({ label: "Impossible date · review", raw: "2026-02-30 Market morning" }),
  "year-zero": Object.freeze({ label: "Year zero · review", raw: "0000-01-01 Market morning" }),
  future: Object.freeze({ label: "Future date · review", raw: "2026-08-20 Market morning" }),
});

const CAPTURE_OPERATION_BRANCHES_V12 = Object.freeze({
  success: "Success",
  failure: "Failure",
  "rapid-repeat": "Rapid repeat",
  replay: "Replay",
  "navigate-before-completion": "Navigate before completion",
  "reset-before-completion": "Reset before completion",
  "connection-interruption": "Connection interruption",
  "session-interruption": "Session interruption",
  "partial-media-group": "Partial media-group progress",
});

function isGregorianDateV12(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const limit = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  return day >= 1 && day <= limit;
}

// Pure caption seam: fixed date and timezone inputs make every result portable.
function analyzeCaptureCaptionV12(rawCaption, receiptDate = CAPTURE_FIXED_DATE_V12) {
  const raw = String(rawCaption ?? "");
  const match = /^(\d{4}-\d{2}-\d{2})(?:$|[ \t\r\n]+([\s\S]*))$/.exec(raw);
  if (!match) {
    return { matched: false, raw, journalDate: receiptDate, dateSource: "Telegram receipt time in Asia/Kolkata", photoCaption: raw, review: false };
  }
  const enteredDate = match[1];
  const photoCaption = match[2] ?? "";
  const valid = isGregorianDateV12(enteredDate);
  const future = valid && enteredDate > CAPTURE_FIXED_DATE_V12;
  return {
    matched: true,
    raw,
    enteredDate,
    journalDate: valid && !future ? enteredDate : null,
    dateSource: valid && !future ? "Explicit leading date instruction" : "Needs Date Review",
    photoCaption,
    review: !valid || future,
    reviewReason: !valid ? "The leading token is not a real Gregorian date." : future ? "The leading token is after 13 August 2026." : "",
  };
}

// Pure media seam: decoded content wins over a filename, and precedence is exact.
function validateCaptureMediaV12(media) {
  if (media.decoded === false) return { accepted: false, kind: "decode", message: "Photo not added. Life in Days could not decode this file as a supported still image." };
  if (media.animated) return { accepted: false, kind: "type", message: "Photo not added. Animated images are not supported. Send a still JPEG, PNG, WebP, HEIC, or HEIF image." };
  const accepted = new Set(["JPEG", "PNG", "WebP", "HEIC", "HEIF"]);
  if (!accepted.has(media.format)) {
    const message = media.disguised
      ? "Photo not added. This file decodes as TIFF, which is not supported. The filename was not used to accept it."
      : `Photo not added. ${media.format} is not supported. Send a still JPEG, PNG, WebP, HEIC, or HEIF image.`;
    return { accepted: false, kind: "type", message };
  }
  if (media.bytes > 20000000) return { accepted: false, kind: "bytes", message: `Photo not added. This file is ${media.bytes.toLocaleString("en-US")} bytes. The limit is 20,000,000 bytes (20 MB).` };
  if (media.width * media.height > 100000000) return { accepted: false, kind: "pixels", message: `Photo not added. This image is ${media.width * media.height / 1000000} megapixels. The limit is 100 megapixels.` };
  if (media.width > 20000 || media.height > 20000) return { accepted: false, kind: "side", message: `Photo not added. This image is ${media.width.toLocaleString("en-US")} × ${media.height.toLocaleString("en-US")} pixels. Neither side may exceed 20,000 pixels.` };
  return { accepted: true, kind: "accepted", message: `Accepted for represented capture. This file decodes as ${media.format} and is within every per-file limit.` };
}

function captureFixtureV12(selection) {
  if (!selection || typeof selection !== "object") return CAPTURE_SCENARIOS_V12.guide;
  if (selection.group === "scenario") return CAPTURE_SCENARIOS_V12[selection.key] || CAPTURE_SCENARIOS_V12.guide;
  if (selection.group === "authorization" && Object.hasOwn(CAPTURE_AUTHORIZATION_FIXTURES_V12, selection.key)) {
    if (selection.key === "forwarded") return { ...CAPTURE_SCENARIOS_V12.t4, label: CAPTURE_AUTHORIZATION_FIXTURES_V12.forwarded };
    return { key: selection.key, kind: "authorization", label: CAPTURE_AUTHORIZATION_FIXTURES_V12[selection.key] };
  }
  if (selection.group === "media" && Object.hasOwn(CAPTURE_MEDIA_FIXTURES_V12, selection.key)) {
    return { key: selection.key, kind: "media", ...CAPTURE_MEDIA_FIXTURES_V12[selection.key], sourceForm: CAPTURE_MEDIA_FIXTURES_V12[selection.key].sourceForm || "Telegram photo message" };
  }
  if (selection.group === "caption" && Object.hasOwn(CAPTURE_CAPTION_FIXTURES_V12, selection.key)) {
    return { key: selection.key, kind: "caption", ...CAPTURE_CAPTION_FIXTURES_V12[selection.key], analysis: analyzeCaptureCaptionV12(CAPTURE_CAPTION_FIXTURES_V12[selection.key].raw) };
  }
  return CAPTURE_SCENARIOS_V12.guide;
}

function initialCaptureStateV12(generation = 0, branch = "success") {
  return {
    generation,
    selection: { group: "scenario", key: "guide" },
    branch: Object.hasOwn(CAPTURE_OPERATION_BRANCHES_V12, branch) ? branch : "success",
    surface: "companion",
    stage: "guide",
    active: null,
    terminal: null,
    attempt: 0,
    albumProgress: 0,
    fixtureIdentity: null,
    reviewHandoffKey: null,
    reviewResolved: false,
    replayGuarded: false,
  };
}

// Pure v12 state machine. DOM, timers, archive mutation, and history stay outside.
function transitionCaptureV12(capture, type, payload = {}) {
  switch (type) {
    case "SELECT": {
      const fixture = captureFixtureV12(payload.selection);
      return {
        ...initialCaptureStateV12(capture.generation + 1, capture.branch),
        selection: fixture.kind === "guide" ? { group: "scenario", key: "guide" } : { ...payload.selection },
        fixtureIdentity: fixture.kind === "guide" ? null : payload.fixtureIdentity,
        stage: fixture.kind === "guide" ? "guide" : "selected",
      };
    }
    case "BRANCH_SET":
      return { ...capture, branch: Object.hasOwn(CAPTURE_OPERATION_BRANCHES_V12, payload.branch) ? payload.branch : "success", replayGuarded: false };
    case "START":
      if (capture.active) return capture;
      return { ...capture, stage: "received", active: payload.token, terminal: payload.terminal || null, attempt: capture.attempt + 1, albumProgress: Math.max(0, Number(payload.albumProgress) || 0), reviewResolved: payload.reviewResolved ?? capture.reviewResolved, replayGuarded: false };
    case "STAGE":
      if (!capture.active || capture.active.id !== payload.token?.id) return capture;
      return { ...capture, stage: payload.stage };
    case "ALBUM_PROGRESS": {
      if (!capture.active || capture.active.id !== payload.token?.id) return capture;
      const albumProgress = Math.max(capture.albumProgress, payload.count);
      const terminal = capture.terminal?.type === "partial" ? { ...capture.terminal, albumProgress } : capture.terminal;
      return { ...capture, stage: "waiting", albumProgress, terminal };
    }
    case "TERMINAL": {
      if (!capture.active || capture.active.id !== payload.token?.id) return capture;
      const albumProgress = Math.max(capture.albumProgress, Number(payload.terminal.albumProgress) || 0);
      const terminal = albumProgress || payload.terminal.albumProgress != null
        ? { ...payload.terminal, albumProgress }
        : payload.terminal;
      return { ...capture, stage: terminal.stage, active: null, terminal, albumProgress, reviewResolved: terminal.reviewResolved ?? capture.reviewResolved };
    }
    case "CANCEL":
      return {
        ...capture,
        generation: capture.generation + 1,
        active: null,
        terminal: payload.terminal || (payload.keepTerminal ? capture.terminal : null),
        stage: payload.terminal?.stage || payload.stage || "selected",
        albumProgress: payload.terminal?.albumProgress ?? (payload.keepTerminal ? capture.albumProgress : 0),
        replayGuarded: payload.keepTerminal ? capture.replayGuarded : false,
      };
    case "SURFACE":
      return { ...capture, surface: ["companion", "change-date"].includes(payload.surface) ? payload.surface : "companion" };
    case "REVIEW_HANDOFF":
      return { ...capture, reviewHandoffKey: payload.key || null };
    case "REVIEW_RESOLVED":
      return { ...capture, reviewResolved: true, terminal: capture.terminal ? { ...capture.terminal, reviewResolved: true } : capture.terminal };
    case "REPLAY_GUARDED":
      if (capture.active || capture.fixtureIdentity !== payload.fixtureIdentity || capture.terminal?.type !== "captured-valid") return capture;
      return { ...capture, replayGuarded: true };
    case "RESET":
      return initialCaptureStateV12(capture.generation + 1, capture.branch);
    default:
      return capture;
  }
}

const SHELL_FIXTURES = Object.freeze({
  "shell/ready": "Ready",
  "shell/app-loading": "Initial loading",
  "shell/month-failure": "Month unavailable",
  "shell/media-failure": "Image unavailable",
  "shell/connection-interrupted": "Connection interrupted",
  "shell/correction-interrupted": "Unsaved Correction",
  "shell/session-expired": "Session ended",
  "shell/session-expired-with-draft": "Session ended with unsaved Correction",
  "shell/server-failure": "Server unavailable",
});
const SHELL_BRANCHES = new Set(["success", "repeat-failure", "rapid-repeat", "navigate-before-completion"]);
const SHELL_MEDIA_ITEM = Object.freeze({ date: "2026-08-06", photoId: "p-market" });
const CORRECTION_FIXTURE_TEXT = "Fictional sample: I stopped at the flower stall after breakfast and carried a bright bundle home.";

function emptyCorrectionV10(overrides = {}) {
  return {
    open: false,
    date: null,
    journalId: null,
    baseline: "",
    draft: "",
    dirty: false,
    status: "clean",
    saveCount: 0,
    operationKey: null,
    selection: null,
    returnFocusSelector: null,
    ...overrides,
  };
}

function shellFixtureState(fixture = "shell/ready", generation = 0, branch = "success") {
  const safeFixture = Object.hasOwn(SHELL_FIXTURES, fixture) ? fixture : "shell/ready";
  const base = {
    fixture: safeFixture,
    phase: "ready",
    connection: "connected",
    connectionMessage: "",
    pendingMonth: null,
    media: {},
    representedCorrections: {},
    correction: emptyCorrectionV10(),
    leaveConfirm: null,
    sessionHadDraft: false,
    server: { status: "idle", settled: false },
    branch: SHELL_BRANCHES.has(branch) ? branch : "success",
    ops: { seq: 0, generation, active: {} },
  };
  if (safeFixture === "shell/app-loading") return { ...base, phase: "app-loading" };
  if (safeFixture === "shell/month-failure") {
    return { ...base, pendingMonth: { origin: "2026-08", target: "2026-09", status: "failed", historyCommitted: false } };
  }
  if (safeFixture === "shell/media-failure") {
    return { ...base, media: { [SHELL_MEDIA_ITEM.photoId]: { ...SHELL_MEDIA_ITEM, status: "failed", attempts: 0 } } };
  }
  if (safeFixture === "shell/connection-interrupted") return { ...base, connection: "interrupted" };
  if (safeFixture === "shell/correction-interrupted") {
    return {
      ...base,
      connection: "interrupted",
      correction: emptyCorrectionV10({
        open: true,
        date: SHELL_MEDIA_ITEM.date,
        journalId: "v-06",
        baseline: days?.[SHELL_MEDIA_ITEM.date]?.journals?.[0]?.text || "",
        draft: CORRECTION_FIXTURE_TEXT,
        dirty: true,
        status: "dirty",
        selection: { start: CORRECTION_FIXTURE_TEXT.length, end: CORRECTION_FIXTURE_TEXT.length, direction: "none" },
        returnFocusSelector: '[data-action="correct-text"][data-journal-id="v-06"]',
      }),
    };
  }
  if (safeFixture === "shell/session-expired") return { ...base, phase: "session-expired" };
  if (safeFixture === "shell/session-expired-with-draft") {
    return {
      ...base,
      phase: "session-expired",
      sessionHadDraft: true,
      correction: emptyCorrectionV10(),
    };
  }
  if (safeFixture === "shell/server-failure") {
    return { ...base, phase: "server-failure", server: { status: "failed", settled: false } };
  }
  return base;
}

// Pure reducer: every prototype shell transition returns a new shell value.
// Timers and DOM effects are intentionally kept in the in-memory registry below.
function transitionShell(shell, type, payload = {}) {
  const correction = { ...shell.correction };
  const active = { ...shell.ops.active };
  switch (type) {
    case "FIXTURE_SET":
      return shellFixtureState(payload.fixture, shell.ops.generation + 1, shell.branch);
    case "BRANCH_SET":
      return { ...shell, branch: SHELL_BRANCHES.has(payload.branch) ? payload.branch : "success" };
    case "APP_LOAD_START":
      return { ...shell, phase: "app-loading", server: { status: "idle", settled: false } };
    case "APP_LOAD_READY":
      return { ...shell, phase: "ready", server: { status: "idle", settled: false } };
    case "APP_LOAD_FAIL":
      return { ...shell, phase: "server-failure", server: { status: "failed", settled: false } };
    case "MONTH_START":
    case "MONTH_RETRY":
      return {
        ...shell,
        pendingMonth: {
          origin: payload.origin || shell.pendingMonth?.origin,
          target: payload.target || shell.pendingMonth?.target,
          status: "pending",
          historyCommitted: Boolean(shell.pendingMonth?.historyCommitted),
        },
      };
    case "MONTH_FAIL":
      return { ...shell, pendingMonth: shell.pendingMonth ? { ...shell.pendingMonth, status: "failed" } : null };
    case "MONTH_READY":
    case "MONTH_CANCEL":
      return { ...shell, pendingMonth: null };
    case "MEDIA_FAIL":
      return {
        ...shell,
        media: {
          ...shell.media,
          [payload.photoId]: {
            date: payload.date,
            photoId: payload.photoId,
            status: "failed",
            attempts: shell.media[payload.photoId]?.attempts || 0,
          },
        },
      };
    case "MEDIA_RETRY_START":
      return {
        ...shell,
        media: {
          ...shell.media,
          [payload.photoId]: { ...shell.media[payload.photoId], status: "pending", attempts: (shell.media[payload.photoId]?.attempts || 0) + 1 },
        },
      };
    case "MEDIA_READY":
      return { ...shell, media: { ...shell.media, [payload.photoId]: { ...shell.media[payload.photoId], status: "available" } } };
    case "MEDIA_RETRY_FAIL":
      return { ...shell, media: { ...shell.media, [payload.photoId]: { ...shell.media[payload.photoId], status: "failed" } } };
    case "CONNECTION_INTERRUPT":
      return { ...shell, connection: "interrupted", connectionMessage: "" };
    case "CONNECTION_CHECK_START":
      return { ...shell, connection: "checking", connectionMessage: "" };
    case "CONNECTION_RESTORE":
      return { ...shell, connection: "connected", connectionMessage: "Connection restored. Refresh content before relying on the latest changes." };
    case "CONNECTION_CHECK_FAIL":
      return { ...shell, connection: "interrupted", connectionMessage: "Still disconnected. Nothing was saved." };
    case "CORRECTION_OPEN":
      {
        const correctionKey = `${payload.date}:${payload.journalId}`;
        const representedText = shell.representedCorrections[correctionKey];
      return {
        ...shell,
        correction: emptyCorrectionV10({
          open: true,
          date: payload.date,
          journalId: payload.journalId,
          baseline: representedText ?? payload.baseline,
          draft: payload.draft ?? representedText ?? payload.baseline,
          dirty: Boolean(payload.dirty),
          status: payload.dirty ? "dirty" : "clean",
          saveCount: representedText == null ? 0 : 1,
          selection: payload.selection || null,
          returnFocusSelector: payload.returnFocusSelector || null,
        }),
      };
      }
    case "CORRECTION_INPUT": {
      const dirty = payload.draft !== correction.baseline;
      return { ...shell, correction: { ...correction, draft: payload.draft, dirty, status: dirty ? "dirty" : "clean", selection: payload.selection || correction.selection } };
    }
    case "CORRECTION_SELECTION":
      return { ...shell, correction: { ...correction, selection: payload.selection || correction.selection } };
    case "CORRECTION_SAVE_START":
      return { ...shell, correction: { ...correction, status: "saving", operationKey: payload.operationKey || correction.operationKey } };
    case "CORRECTION_SAVE_FAIL":
      return { ...shell, correction: { ...correction, status: "failed", dirty: true, operationKey: null } };
    case "CORRECTION_SAVE_READY": {
      const correctionKey = `${correction.date}:${correction.journalId}`;
      return {
        ...shell,
        representedCorrections: { ...shell.representedCorrections, [correctionKey]: correction.draft },
        correction: { ...correction, status: "saved", dirty: false, saveCount: 1, operationKey: null },
      };
    }
    case "CORRECTION_CLOSE":
      return { ...shell, correction: { ...correction, open: false, dirty: false, status: correction.saveCount ? "saved" : "clean", selection: null } };
    case "LEAVE_REQUEST":
      return { ...shell, leaveConfirm: { reason: payload.reason || "leave" } };
    case "LEAVE_KEEP":
      return { ...shell, leaveConfirm: null };
    case "LEAVE_DISCARD":
      return { ...shell, leaveConfirm: null, correction: { ...correction, open: false, dirty: false, status: "clean", selection: null } };
    case "SESSION_EXPIRE":
      return {
        ...shell,
        phase: "session-expired",
        sessionHadDraft: payload.hadDraft ?? correction.dirty,
        leaveConfirm: null,
        correction: emptyCorrectionV10(),
        ops: { ...shell.ops, generation: shell.ops.generation + 1, active: {} },
      };
    case "REAUTH_START":
      return { ...shell, phase: "reauth", correction: emptyCorrectionV10(), leaveConfirm: null };
    case "REAUTH_RETURN":
      return shellFixtureState("shell/ready", shell.ops.generation + 1, shell.branch);
    case "SERVER_FAIL":
      return {
        ...shell,
        phase: payload.settled ? "ready" : "server-failure",
        server: { status: "failed", settled: Boolean(payload.settled) },
      };
    case "SERVER_RETRY_START":
      return { ...shell, phase: shell.server.settled ? "ready" : "server-retrying", server: { ...shell.server, status: "pending" } };
    case "SERVER_RETRY_READY":
      return { ...shell, phase: "ready", server: { status: "idle", settled: false } };
    case "SERVER_RETRY_FAIL":
      return { ...shell, phase: shell.server.settled ? "ready" : "server-failure", server: { ...shell.server, status: "failed" } };
    case "OPS_BEGIN":
      return { ...shell, ops: { ...shell.ops, seq: Math.max(shell.ops.seq, payload.id || 0), active: { ...active, [payload.identity]: payload.id } } };
    case "OPS_END":
      delete active[payload.identity];
      return { ...shell, ops: { ...shell.ops, active } };
    case "OPS_CANCEL_LOCAL":
      Object.keys(active).filter((identity) => payload.kinds?.includes(identity.split(":")[0])).forEach((identity) => delete active[identity]);
      return { ...shell, ops: { ...shell.ops, active } };
    case "OPS_CANCEL_ALL":
      return { ...shell, ops: { ...shell.ops, generation: shell.ops.generation + 1, active: {} } };
    default:
      return shell;
  }
}

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
      "A fictional journal describes a slow morning, a reset of the room, and the satisfying calm that followed. There is enough source text to try a symbolic artwork, but none has been generated in this prototype yet.",
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
      "A fictional late-night note reflects on an idea that arrived after the rest of the house grew quiet. Its generated artwork imagines a midnight garden with luminous flowers along a narrow path.",
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
      "A fictional early-morning journal remembers two cups of tea on a quiet balcony before the nearby streets became busy. This short generated summary is only a reading aid for the archive.",
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
      "A fictional end-of-month note follows a quiet walk as late sunlight made an ordinary path feel briefly unfamiliar. Its generated artwork imagines a narrow golden path crossing a quiet landscape.",
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
      "A fictional weekday errand pauses at a flower stall, where a small burst of colour interrupts an otherwise practical afternoon.",
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

// The inherited first-use upload intentionally replaces the visible fixture
// archive. V10 shell scenarios must nevertheless remain deterministic within
// the same tab, so each explicit prototype-state transition restores either a
// fresh synthetic archive or a genuinely empty first-use dataset.
const syntheticArchiveDaysV10 = structuredClone(days);
// V12 owns an archive-only baseline. It never borrows v11's readiness fixture
// reset, so selecting a capture scenario cannot change Telegram configuration.
const captureArchiveBaselineV12 = structuredClone(syntheticArchiveDaysV10);

function resetSyntheticArchiveDaysV10(populated) {
  Object.keys(days).forEach((date) => delete days[date]);
  if (!populated) return;
  Object.assign(days, structuredClone(syntheticArchiveDaysV10));
}

function restoreCaptureArchiveBaselineV12() {
  Object.keys(days).forEach((date) => delete days[date]);
  Object.assign(days, structuredClone(captureArchiveBaselineV12));
  state.captureArchiveActive = true;
  state.almanacEmptyArchive = false;
  state.selectedDate = null;
  state.screen = "month";
  state.galleryIndex = {};
  state.viewMemory.calendar = null;
  state.viewMemory.almanac = null;
  state.scrollByView.calendar = 0;
  state.scrollByView.almanac = 0;
}

function captureOnlyDayV12(date, title) {
  return {
    date,
    title,
    titleStatus: "Source caption",
    summary: "",
    summaryStatus: "AI not run",
    tags: [],
    tagsStatus: "AI not run",
    photos: [],
    artworks: [],
    journals: [],
    captureOnlyV12: true,
  };
}

function capturePhotoV12({ id, src, alt, caption, timestamp, isCover }) {
  return { id, src, alt, caption, timestamp, isCover, capturedByV12: true };
}

function attachCaptureResultV12(fixture, identity) {
  if (!fixture || captureCommittedIdentitiesV12.has(identity)) return false;
  if (["t5", "t6"].includes(fixture.key)) return false;
  if (["t1", "t4"].includes(fixture.key)) {
    const destination = days["2026-08-13"];
    const photoId = fixture.key === "t4" ? "capture-forwarded-v12" : "capture-receipt-v12";
    if (!destination?.photos?.some((photo) => photo.id === photoId)) {
      destination.photos.splice(0, 0, capturePhotoV12({
        id: photoId,
        src: fixture.asset,
        alt: fixture.alt,
        caption: fixture.photoCaption,
        timestamp: fixture.originalTimestamp,
        isCover: false,
      }));
    }
  } else if (fixture.key === "t2") {
    const destination = captureOnlyDayV12("2026-08-10", fixture.photoCaption);
    destination.photos.push(capturePhotoV12({
      id: "capture-document-v12",
      src: fixture.asset,
      alt: fixture.alt,
      caption: fixture.photoCaption,
      timestamp: fixture.originalTimestamp,
      isCover: true,
    }));
    days[destination.date] = destination;
  } else if (fixture.key === "t3") {
    const destination = captureOnlyDayV12("2026-08-09", fixture.photoCaption);
    destination.photos = fixture.members.map((member, index) => capturePhotoV12({
      id: `capture-group-member-v12-${index + 1}`,
      src: member.asset,
      alt: member.alt,
      caption: member.caption,
      timestamp: member.messageTime,
      isCover: index === 0,
    }));
    days[destination.date] = destination;
  } else if (fixture.key === "t7") {
    const destination = captureOnlyDayV12("2026-08-10", fixture.photoCaption);
    // Product intentionally leaves the T7 visual unspecified. The archive
    // record uses a neutral treatment flag; no T7-specific cover copy/action
    // is exposed by the companion.
    destination.photos.push(capturePhotoV12({
      id: "capture-retry-v12",
      src: "assets/photo-rain-window.svg",
      alt: "Synthetic Daily Photo represented after retry",
      caption: fixture.photoCaption,
      timestamp: fixture.originalTimestamp,
      isCover: true,
    }));
    days[destination.date] = destination;
  } else return false;
  captureCommittedIdentitiesV12.add(identity);
  state.almanacEmptyArchive = false;
  return true;
}

// Explicitly non-live fixtures exist only to prove that ordinary Almanac rendering
// never admits Trash-only or history-only records. Their sentinel text must never
// be interpolated into the product DOM, accessible names, counts, or jump metadata.
const excludedAlmanacFixtures = Object.freeze({
  "2026-06-20": { lifecycle: "trash-only", sentinel: "V9_TRASH_ONLY_JUNE_20" },
  "2026-05-18": { lifecycle: "history-only", sentinel: "V9_HISTORY_ONLY_MAY_18" },
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
const allowedViews = new Set(["calendar", "almanac", "search", "settings", "date-review", "telegram-capture"]);
const allowedSettingsSections = new Set(["overview", "journal", "integrations", "ai", "appearance"]);
const allowedThemePreferences = new Set(["device", "light", "dark"]);
const savedThemePreference = window.localStorage.getItem("life-in-days-v9-theme") || "device";
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
// Readiness fixtures are intentionally live-memory-only. A reload therefore
// starts from first use, while ordinary allowlisted view/month navigation stays
// shareable without encoding readiness state or private content.
// V11 review state is deliberately page-memory-only. Reloading its structural
// route therefore returns to the inherited ready/first-use Calendar instead of
// presenting an empty queue that could be mistaken for the prior verified
// review snapshot. Other inherited safe structural routes keep their v10
// deep-link behavior.
const initialView = ["date-review", "telegram-capture"].includes(requestedView)
  ? "calendar"
  : allowedViews.has(requestedView) ? requestedView : "calendar";
let initialMonth = isMonthKey(requestedMonth) ? requestedMonth : "2026-08";
let initialAlmanacThrough = initialView === "almanac"
  && isMonthKey(requestedThrough)
  && monthOrdinal(requestedThrough) <= monthOrdinal(initialMonth)
  ? requestedThrough
  : initialMonth;
if (initialView === "almanac") {
  const normalized = normalizeAlmanacRange(initialMonth, initialAlmanacThrough);
  initialMonth = normalized.newest;
  initialAlmanacThrough = normalized.oldest;
}
const initialFocusDate = initialMonth === today.slice(0, 7) ? today : `${initialMonth}-01`;
const initialSelectedDate = null;
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
  almanacEmptyArchive: true,
  readinessFixture: "first-use/default",
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
  almanacCollapsed: initialParams.get("rail") === "collapsed" || window.localStorage.getItem("life-in-days-v9-almanac-collapsed") === "true",
  pendingChapterScroll: false,
  scrollByView: { calendar: 0, almanac: 0, search: 0, settings: 0, "date-review": 0, "telegram-capture": 0 },
  viewMemory: { calendar: null, almanac: null, search: null, settings: null, "date-review": null, "telegram-capture": null },
  almanacReadingAnchor: null,
  pendingInputSelection: null,
  pendingDateReviewSelection: null,
  searchSelection: null,
  transientFocusSelector: null,
  pendingDrawerFocusSelector: null,
  modal: null,
  focusAfterRender: null,
  monthAnnouncement: "",
  pendingSelectionCloseFocus: null,
  shellLabOpen: false,
  shell: shellFixtureState(),
  dateReviewLabOpen: false,
  dateReview: dateReviewFixtureState(),
  capture: initialCaptureStateV12(),
  captureArchiveActive: false,
};

const shellOperations = new Map();
const shellOperationTimers = new Map();
let shellOperationSequence = 0;
let pendingLeaveNavigation = null;
let pendingPopGuard = null;
let suppressGuardedPopstate = false;
let inheritedAsyncGenerationV10 = 0;
let liveAnnouncementEpochV10 = 0;
let dateReviewAnnouncementEpochV11 = 0;
let dateReviewOperationSequenceV11 = 0;
let dateReviewLoadSequenceV11 = 0;
const dateReviewTimersV11 = new Map();
const captureTimersV12 = new Map();
const captureCommittedIdentitiesV12 = new Set();
const captureResolvedReviewIdentitiesV12 = new Set();
let captureOperationSequenceV12 = 0;
let captureAnnouncementEpochV12 = 0;
let navigationFocusEpochV12 = 0;
let pendingNavigationFocusV12 = null;
let viewScrollRestoreEpochV12 = 0;
const historyPositions = new Map();
let currentHistoryPosition = 0;

function dispatchShell(type, payload = {}) {
  state.shell = transitionShell(state.shell, type, payload);
  return state.shell;
}

function shellOperationIdentity(kind, key) {
  return `${kind}:${key}`;
}

function beginOp(kind, key) {
  const identity = shellOperationIdentity(kind, key);
  const existing = shellOperations.get(identity);
  if (existing && existing.generation === state.shell.ops.generation) return null;
  const token = Object.freeze({
    id: ++shellOperationSequence,
    generation: state.shell.ops.generation,
    kind,
    key,
    identity,
  });
  shellOperations.set(identity, token);
  dispatchShell("OPS_BEGIN", { identity, id: token.id });
  return token;
}

function isCurrentOp(token) {
  return Boolean(token)
    && state.shell.ops.generation === token.generation
    && shellOperations.get(token.identity)?.id === token.id
    && state.shell.ops.active[token.identity] === token.id;
}

function finishOp(token) {
  if (!token || shellOperations.get(token.identity)?.id !== token.id) return false;
  const timer = shellOperationTimers.get(token.identity);
  if (timer) window.clearTimeout(timer);
  shellOperationTimers.delete(token.identity);
  shellOperations.delete(token.identity);
  dispatchShell("OPS_END", { identity: token.identity });
  return true;
}

function scheduleOp(token, callback, delay = 650) {
  if (!token) return;
  const timer = window.setTimeout(() => {
    shellOperationTimers.delete(token.identity);
    if (!isCurrentOp(token)) return;
    callback(token);
    finishOp(token);
  }, delay);
  shellOperationTimers.set(token.identity, timer);
}

function cancelShellOperations(kinds = null) {
  const kindSet = kinds ? new Set(kinds) : null;
  for (const [identity, token] of shellOperations) {
    if (kindSet && !kindSet.has(token.kind)) continue;
    const timer = shellOperationTimers.get(identity);
    if (timer) window.clearTimeout(timer);
    shellOperationTimers.delete(identity);
    shellOperations.delete(identity);
  }
  if (kindSet) dispatchShell("OPS_CANCEL_LOCAL", { kinds: [...kindSet] });
  else dispatchShell("OPS_CANCEL_ALL");
}

function queueLiveAnnouncementV10(node, message) {
  if (!node) return;
  const epoch = liveAnnouncementEpochV10;
  node.textContent = "";
  requestAnimationFrame(() => {
    if (epoch === liveAnnouncementEpochV10) node.textContent = message;
  });
}

function announceShell(message, { assertive = false } = {}) {
  if (!shellStatusLive) return;
  shellStatusLive.setAttribute("aria-live", assertive ? "assertive" : "polite");
  queueLiveAnnouncementV10(shellStatusLive, message);
}

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
// Capture View-day destinations are resolved only behind the opaque browser
// entry ID. The exact Journal Date never enters the URL or history.state.
const captureDayHistoryTargetsV12 = new Map();
let historyEntryCounter = 0;
const nextHistoryEntryId = () => `e${++historyEntryCounter}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;

const html = (value = "") =>
  String(value).replace(
    /[&<>'"]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character],
  );

const READINESS_FIXTURES = Object.freeze({
  "first-use/default": Object.freeze({
    voiceNotes: "default",
    telegram: "default",
    ai: "default",
    backup: "default",
  }),
  "first-use/configured-unverified": Object.freeze({
    voiceNotes: "configured",
    telegram: "configured",
    ai: "default",
    backup: "unverified",
  }),
  "first-use/ai-unavailable": Object.freeze({
    voiceNotes: "default",
    telegram: "configured",
    ai: "unavailable",
    backup: "unverified",
  }),
  "archive/populated": Object.freeze({
    voiceNotes: "archive",
    telegram: "archive",
    ai: "archive",
    backup: "archive",
  }),
});

function isFirstUseFixture() {
  return state.readinessFixture.startsWith("first-use/") && !state.captureArchiveActive;
}

function readinessFixture() {
  return READINESS_FIXTURES[state.readinessFixture] || READINESS_FIXTURES["first-use/default"];
}

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
  return `${String(shifted.getUTCFullYear()).padStart(4, "0")}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
}

function shiftDate(date, deltaDays) {
  const { year, month, day } = dateParts(date);
  const shifted = utcCalendarDate(year, month, day + deltaDays);
  return `${String(shifted.getUTCFullYear()).padStart(4, "0")}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}-${String(shifted.getUTCDate()).padStart(2, "0")}`;
}

function dateForMonthDay(monthKey, requestedDay) {
  const dates = datesForMonth(monthKey);
  return dates[Math.min(Math.max(1, requestedDay), dates.length) - 1];
}

function datesForMonth(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const count = utcCalendarDate(year, month + 1, 0).getUTCDate();
  return Array.from({ length: count }, (_, index) => `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`);
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

function mediaStateForPhoto(photo) {
  return photo?.id ? state.shell.media[photo.id] || null : null;
}

function mediaUnavailable(photo) {
  const status = mediaStateForPhoto(photo)?.status;
  return status === "failed" || status === "pending";
}

function calendarCover(day) {
  const photo = selectedPhoto(day);
  if (photo) return { ...photo, kind: "photo", unavailable: mediaUnavailable(photo) };
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
  const coverDescription = cover?.unavailable
    ? "cover image unavailable, Journal Day remains available"
    : day.imageFailed
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
  if (day.imageFailed || cover?.unavailable) return "Calendar Cover unavailable";
  if (cover?.kind === "photo") return "Calendar Cover · Telegram photo";
  if (cover?.kind === "artwork") return "Calendar Cover · AI artwork";
  return "No cover image · Journal only";
}

function almanacCoverIndicator(day) {
  const cover = calendarCover(day);
  if (day.imageFailed || cover?.unavailable) return "Cover unavailable";
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

function dispatchDateReview(type, payload = {}) {
  state.dateReview = transitionDateReview(state.dateReview, type, payload);
  return state.dateReview;
}

function dateReviewItem(key) {
  return DATE_REVIEW_ITEMS.find((item) => item.key === key) || null;
}

function unresolvedDateReviewItems() {
  if (state.dateReview.status !== "settled") return [];
  return state.dateReview.unresolved.map(dateReviewItem).filter(Boolean);
}

function dateReviewCount() {
  return state.dateReview.status === "settled" ? state.dateReview.unresolved.length : null;
}

function dateReviewDisplayDate(date) {
  const { year, month, day } = dateParts(date);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(utcCalendarDate(year, month, day));
}

function validateDateReviewDate(rawValue) {
  const value = String(rawValue ?? "");
  if (!value) return { kind: "blank", message: "Choose a Journal Date." };
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return { kind: "invalid", message: `${value} is not a valid Journal Date.` };
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > monthDays[month - 1]) {
    return { kind: "invalid", message: `${value} is not a valid Journal Date.` };
  }
  if (value > DATE_REVIEW_MAX_DATE) {
    return { kind: "future", message: "Future Journal Dates are not supported. Choose 13 August 2026 or earlier." };
  }
  return { kind: "valid", message: "" };
}

function requiredDateReviewPreview(item, date) {
  if (date !== item.guidedDate) return null;
  const required = {
    "held-a": {
      before: "0 photos · 0 journals · no current day",
      after: "1 photo · 0 journals",
      visibility: "Day becomes visible",
      cover: "The real Daily Photo becomes Calendar Cover.",
    },
    "held-b": {
      before: "0 photos · 1 journal · AI artwork",
      after: "1 photo · 1 journal",
      visibility: "Day stays visible",
      cover: "The real photo becomes Calendar Cover; existing AI artwork remains labeled in the gallery.",
    },
    "held-c": {
      before: "0 photos · 1 journal",
      after: "0 photos · 2 journals",
      visibility: "Day stays visible",
      cover: "Cover unchanged; no cover is invented.",
    },
    "held-d": {
      before: "0 photos · 1 journal",
      after: "0 photos · 2 journals",
      visibility: "Day stays visible",
      cover: "Cover unchanged; no cover is invented.",
    },
  };
  return required[item.key] || null;
}

function dateReviewPreview(item, date) {
  if (!item || validateDateReviewDate(date).kind !== "valid") return null;
  const required = requiredDateReviewPreview(item, date);
  if (required) return { date, ...required };
  const destination = days[date] || null;
  const beforePhotos = destination?.photos?.length || 0;
  const beforeJournals = destination?.journals?.length || 0;
  const addsPhoto = item.source === "telegram";
  const beforeCover = calendarCover(destination);
  return {
    date,
    before: `${beforePhotos} ${beforePhotos === 1 ? "photo" : "photos"} · ${beforeJournals} ${beforeJournals === 1 ? "journal" : "journals"}${destination ? "" : " · no current day"}`,
    after: `${beforePhotos + (addsPhoto ? 1 : 0)} ${beforePhotos + (addsPhoto ? 1 : 0) === 1 ? "photo" : "photos"} · ${beforeJournals + (addsPhoto ? 0 : 1)} ${beforeJournals + (addsPhoto ? 0 : 1) === 1 ? "journal" : "journals"}`,
    visibility: destination ? "Day stays visible" : "Day becomes visible",
    cover: addsPhoto
      ? beforeCover?.kind === "artwork"
        ? "The real photo becomes Calendar Cover; existing AI artwork remains labeled in the gallery."
        : "The real Daily Photo becomes Calendar Cover."
      : "Cover unchanged; no cover is invented.",
  };
}

function announceDateReview(message, { assertive = false } = {}) {
  dateReviewAnnouncementEpochV11 += 1;
  const epoch = dateReviewAnnouncementEpochV11;
  if (!dateReviewStatusLive) return;
  dateReviewStatusLive.setAttribute("aria-live", assertive ? "assertive" : "polite");
  dateReviewStatusLive.textContent = "";
  requestAnimationFrame(() => {
    if (epoch === dateReviewAnnouncementEpochV11) dateReviewStatusLive.textContent = message;
  });
}

function clearDateReviewAnnouncementV11() {
  dateReviewAnnouncementEpochV11 += 1;
  if (!dateReviewStatusLive) return;
  dateReviewStatusLive.setAttribute("aria-live", "polite");
  dateReviewStatusLive.textContent = "";
}

function dateReviewRowProvenance(item) {
  if (item.source === "telegram") {
    return `
      <dl class="date-review-meta-v11">
        <div><dt>Added to review</dt><dd>${html(item.added)}</dd></div>
        <div><dt>Entered date</dt><dd>${html(item.enteredDate)}</dd></div>
        <div><dt>Original Timestamp · Telegram message</dt><dd>${html(item.originalTimestamp)}</dd></div>
        <div><dt>Received by Life in Days</dt><dd>${html(item.received)} · operational provenance only</dd></div>
      </dl>`;
  }
  return `
    <dl class="date-review-meta-v11">
      <div><dt>Added to review</dt><dd>${html(item.added)}</dd></div>
      <div><dt>${item.key === "held-c" ? "Original Timestamp · Unavailable" : "Original Timestamp · Not established"}</dt><dd>${html(item.originalTimestamp)}</dd></div>
      ${item.rawValue ? `<div><dt>Source-reported raw value</dt><dd>${html(item.rawValue)} · ${html(item.provenanceStatus)}</dd></div>` : ""}
      <div><dt>Retrieved and preserved</dt><dd>${html(item.retrieved)} · operational provenance only</dd></div>
    </dl>`;
}

function renderDateReviewRow(item, index) {
  const preview = item.source === "telegram"
    ? `<span class="date-review-preview-v11 is-photo"><img src="${html(item.image)}" alt="" /></span>`
    : `<span class="date-review-preview-v11 is-journal" aria-hidden="true"><span>Voice Journal</span></span>`;
  const display = item.source === "telegram" ? item.caption : item.title;
  return `
    <li>
      <article class="date-review-row-v11" id="date-review-row-v11-${index}" data-date-review-row tabindex="-1">
        ${preview}
        <div class="date-review-row-copy-v11">
          <p class="date-review-source-v11">${html(item.sourceType)}</p>
          <h2>${html(display)}</h2>
          <div class="date-review-reason-v11"><strong>${html(item.reasonHeading)}</strong><p>${html(item.reason)}</p></div>
          ${dateReviewRowProvenance(item)}
          <p class="date-review-preserved-v11">Preserved · not on the calendar</p>
        </div>
        <div class="date-review-row-action-v11">
          <button type="button" class="primary-button" data-action="open-date-review-item" data-review-index="${index}" aria-label="Assign Journal Date for ${html(item.sourceType)}: ${html(item.reason)}">Assign Journal Date</button>
        </div>
      </article>
    </li>`;
}

function renderDateReviewQueueState() {
  const review = state.dateReview;
  if (review.status === "loading") {
    const skeletons = Array.from({ length: 4 }, () => '<li class="date-review-skeleton-v11"><span></span><span></span><span></span></li>').join("");
    return `
      <section class="date-review-loading-v11" aria-labelledby="date-review-loading-title-v11" aria-busy="true">
        <h2 id="date-review-loading-title-v11" tabindex="-1">Loading items that need a Journal Date…</h2>
        <ul aria-hidden="true">${skeletons}</ul>
      </section>`;
  }
  if (review.status === "failed") {
    return `
      <section class="date-review-load-failure-v11" role="alert" aria-labelledby="date-review-load-failure-title-v11">
        <h2 id="date-review-load-failure-title-v11" tabindex="-1">Needs Date Review could not be loaded</h2>
        <p>Needs Date Review could not be loaded. No item has been changed.</p>
        <button type="button" class="primary-button" data-action="retry-date-review-load">Retry loading queue</button>
      </section>`;
  }
  const items = unresolvedDateReviewItems();
  if (!items.length) {
    return `
      <section class="date-review-empty-v11" aria-labelledby="date-review-empty-title-v11">
        <h2 id="date-review-empty-title-v11" tabindex="-1">No items need a Journal Date.</h2>
        <p>Items with missing, invalid, or future dates will stay here until you choose one.</p>
      </section>`;
  }
  return `<ul class="date-review-list-v11" id="date-review-list-v11" aria-label="Preserved items that need a Journal Date">${items.map(renderDateReviewRow).join("")}</ul>`;
}

function renderDateReviewSuccess() {
  const success = state.dateReview.success;
  if (!success) return "";
  return `
    <section class="date-review-status-v11 is-success" role="group" aria-labelledby="date-review-success-title-v11">
      <h2 id="date-review-success-title-v11">${html(success.message)}</h2>
      <p>The same preserved Source Item was attached once in this open prototype page. Original Timestamp and source content are unchanged.</p>
      <button type="button" class="secondary-button" data-action="view-date-review-day" data-date="${html(success.date)}">View day</button>
    </section>`;
}

function renderDateReviewQueue() {
  const count = dateReviewCount();
  const settledIntro = count == null
    ? "Items with missing, invalid, or future dates stay here until a Journal Date can be chosen."
    : count > 0 ? "These preserved items are not on the Calendar or Almanac until you choose a Journal Date." : "";
  const summary = count == null ? "Count unavailable while this local queue is unsettled."
    : count > 0 ? `${count} ${count === 1 ? "item needs" : "items need"} a Journal Date.` : "";
  return `
    <main id="prototype-main" class="date-review-page-v11" tabindex="-1">
      <header class="date-review-header-v11">
        <p class="eyebrow">Management</p>
        <h1 id="date-review-title-v11" tabindex="-1">Needs Date Review</h1>
        ${settledIntro ? `<p>${settledIntro}</p>` : ""}
        ${summary ? `<p class="date-review-summary-v11" id="date-review-summary-v11">${summary}</p>` : ""}
        <p class="date-review-invariant-v11">Prototype date · 13 August 2026 · Asia/Kolkata</p>
      </header>
      ${renderDateReviewSuccess()}
      ${renderDateReviewQueueState()}
    </main>`;
}

function renderDateReviewDetailProvenance(item) {
  if (item.source === "telegram") {
    const tokenState = item.key === "held-a" ? "Invalid" : "Future";
    return `
      <dl class="date-review-provenance-v11">
        <div><dt>Source type</dt><dd>Telegram photo</dd></div>
        <div><dt>Original Timestamp · Telegram message</dt><dd>${html(item.originalTimestamp)} <strong>Immutable</strong></dd></div>
        <div><dt>Received by Life in Days</dt><dd>${html(item.received)} <strong>Operational provenance · not a suggested Journal Date</strong></dd></div>
        <div><dt>Entered date</dt><dd>${html(item.enteredDate)} <strong>${tokenState}</strong></dd></div>
        <div><dt>Raw Telegram caption</dt><dd>${html(item.caption)} <strong>Retained unchanged</strong></dd></div>
        <div><dt>Added to review</dt><dd>${html(item.added)}</dd></div>
      </dl>
      <p class="date-review-invariant-v11">Telegram notice represented · no message was sent.</p>`;
  }
  const unavailable = item.key === "held-c";
  return `
    <dl class="date-review-provenance-v11">
      <div><dt>Source type</dt><dd>VoiceNotes journal</dd></div>
      <div><dt>Source title</dt><dd>${html(item.title)}</dd></div>
      <div><dt>${unavailable ? "Original Timestamp · Unavailable" : "Original Timestamp · Not established"}</dt><dd>${html(item.originalTimestamp)}</dd></div>
      ${unavailable ? "" : `<div><dt>Source-reported raw value</dt><dd>${html(item.rawValue)} <strong>${html(item.provenanceStatus)}</strong></dd></div>`}
      <div><dt>Retrieved and preserved</dt><dd>${html(item.retrieved)} <strong>Operational provenance · not a suggested Journal Date</strong></dd></div>
      <div><dt>Added to review</dt><dd>${html(item.added)}</dd></div>
      <div><dt>Source identity</dt><dd>Opaque reference retained · not displayed</dd></div>
    </dl>
    <p class="date-review-invariant-v11">No Original Timestamp will be invented.</p>`;
}

function renderDateReviewDestination() {
  const preview = state.dateReview.preview;
  if (!preview) {
    return `<section class="date-review-destination-v11" id="date-review-destination-v11" aria-labelledby="date-review-destination-title-v11"><h2 id="date-review-destination-title-v11">Destination preview</h2><p>Choose a Journal Date to preview its destination.</p></section>`;
  }
  return `
    <section class="date-review-destination-v11 is-ready" id="date-review-destination-v11" aria-labelledby="date-review-destination-title-v11">
      <h2 id="date-review-destination-title-v11">${html(dateReviewDisplayDate(preview.date))}</h2>
      <div class="date-review-effect-grid-v11">
        <div><strong>Before</strong><span>${html(preview.before)}</span></div>
        <div><strong>After assignment</strong><span>${html(preview.after)}</span></div>
      </div>
      <p><strong>${html(preview.visibility)}.</strong> ${html(preview.cover)}</p>
      <p class="date-review-invariant-v11">Original Timestamp and source content will not change.</p>
    </section>`;
}

function renderDateReviewDetail() {
  const item = dateReviewItem(state.dateReview.detailKey);
  if (!item || !state.dateReview.unresolved.includes(item.key)) return renderDateReviewQueue();
  const assigning = state.dateReview.assignment.status === "assigning";
  const failed = state.dateReview.assignment.status === "failed";
  const valid = state.dateReview.validation.kind === "valid" && Boolean(state.dateReview.preview);
  const error = state.dateReview.validation.message;
  const disconnected = state.shell.connection !== "connected";
  return `
    <main id="prototype-main" class="date-review-detail-v11" tabindex="-1">
      <button type="button" class="date-review-back-v11" data-action="close-date-review-item">${state.capture.reviewHandoffKey === item.key ? "Back to Telegram Capture Companion" : "Back to Needs Date Review"}</button>
      <header class="date-review-header-v11">
        <p class="eyebrow">Management</p>
        <h1 id="date-review-detail-title-v11" tabindex="-1">Assign a Journal Date</h1>
        <p>This item is preserved, but it is not on the Calendar or Almanac.</p>
        <p>No Journal Date has been suggested. Choose the date you know is correct.</p>
        <p class="date-review-invariant-v11">Prototype date · 13 August 2026 · Asia/Kolkata</p>
      </header>
      <div class="date-review-detail-grid-v11">
        <section class="date-review-source-panel-v11" aria-labelledby="date-review-why-title-v11">
          <p class="date-review-source-v11">${html(item.sourceType)}</p>
          <h2 id="date-review-why-title-v11">Why this needs review</h2>
          <p class="date-review-reason-v11">${html(item.reason)}</p>
          <p class="date-review-preserved-v11">Preserved · not on the calendar</p>
          ${renderDateReviewDetailProvenance(item)}
        </section>
        <section class="date-review-form-panel-v11" aria-labelledby="date-review-date-title-v11" aria-busy="${assigning}">
          <form id="date-review-form-v11" data-action="date-review-form" novalidate>
            <div class="date-review-field-v11">
              <label for="date-review-date-input-v11" id="date-review-date-title-v11">Journal Date</label>
              <div class="date-review-input-row-v11">
                <input class="date-review-input-v11" id="date-review-date-input-v11" name="journal-date" type="text" inputmode="numeric" placeholder="YYYY-MM-DD" autocomplete="off" spellcheck="false" value="${html(state.dateReview.draft)}" aria-describedby="date-review-date-help-v11${error ? " date-review-date-error-v11" : ""}" aria-invalid="${Boolean(error)}" ${error ? 'aria-errormessage="date-review-date-error-v11"' : ""} ${assigning ? "disabled" : ""} />
                <button type="button" class="secondary-button" data-action="open-date-review-picker" aria-haspopup="dialog" ${assigning ? "disabled" : ""}>Choose from calendar</button>
              </div>
              <p class="date-review-help-v11" id="date-review-date-help-v11">Use exact YYYY-MM-DD. 13 August 2026 is allowed; future dates are disabled. Journal timezone: Asia/Kolkata.</p>
              ${error ? `<p class="date-review-error-v11" id="date-review-date-error-v11">${html(error)}</p>` : ""}
            </div>
            ${item.source === "voicenotes" ? `<details class="date-review-voice-preview-v11"><summary>Read fictional Voice Journal preview</summary><p>${html(item.bodyPreview)}</p></details>` : ""}
            ${renderDateReviewDestination()}
            ${assigning ? '<p class="date-review-status-v11 is-pending" id="date-review-operation-status-v11" tabindex="-1">Assigning…</p>' : ""}
            ${failed ? '<div class="date-review-status-v11 is-failure" id="date-review-assignment-failure-v11" role="alert" tabindex="-1"><strong>Journal Date was not assigned. The preserved item remains in Needs Date Review.</strong></div>' : ""}
            <p class="date-review-invariant-v11">Original Timestamp and source content will not change.</p>
            <div class="date-review-actions-v11">
              <button type="button" class="secondary-button" data-action="close-date-review-item">Cancel</button>
              ${failed ? `<button type="button" class="primary-button" data-action="retry-date-review-assignment" ${disconnected ? "disabled" : ""}>Retry assigning</button>` : `<button type="submit" class="primary-button" ${!valid || assigning || disconnected ? "disabled" : ""}>${assigning ? "Assigning…" : "Assign Journal Date"}</button>`}
            </div>
          </form>
        </section>
      </div>
    </main>`;
}

function renderDateReviewView() {
  return state.dateReview.detailKey ? renderDateReviewDetail() : renderDateReviewQueue();
}

function prototypeBanner() {
  return `
    <div class="prototype-banner" role="note">
      <span class="prototype-dot" aria-hidden="true"></span>
      <strong>Throwaway UI prototype · v12</strong>
      <span>Prototype data · no persistence · no integrations connected</span>
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
  const moreIsCurrent = ["settings", "date-review"].includes(state.view);
  const item = (view, label) => `
    <button class="${state.view === view ? "is-active" : ""}" type="button" data-action="set-view" data-view="${view}" ${state.view === view ? 'aria-current="page"' : ""}>
      ${label}
    </button>`;
  return `
    <nav class="compact-navigation" aria-label="Primary">
      ${item("calendar", "Calendar")}
      ${item("almanac", "Almanac")}
      ${item("search", "Search")}
      <button class="${moreIsCurrent ? "is-active" : ""}" type="button" data-action="open-more" aria-haspopup="dialog" ${moreIsCurrent ? 'aria-current="page"' : ""}>More</button>
    </nav>`;
}

function calendarTile(date, mode) {
  const day = state.almanacEmptyArchive ? null : days[date];
  const cover = calendarCover(day);
  const coverUnavailable = Boolean(cover?.unavailable);
  const { day: dayNumber } = dateParts(date);
  const classes = ["calendar-tile", `calendar-tile--${mode}`];
  if (day) classes.push("has-day");
  if (cover?.kind === "photo" && !coverUnavailable) classes.push("has-real-cover");
  if (cover?.kind === "artwork") classes.push("has-art-cover");
  if (day && !cover) classes.push("is-journal-only");
  if (coverUnavailable) classes.push("is-media-unavailable-v10");
  if (day?.attention) classes.push("needs-attention");
  if (date === today) classes.push("is-today");
  if (date === state.selectedDate) classes.push("is-selected");

  const style = cover && !coverUnavailable ? `style="--tile-image: url('${html(cover.src)}')"` : "";
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
      ${isMosaic && cover && !coverUnavailable ? `<img class="calendar-cover-image" src="${html(cover.src)}" alt="" />` : '<span class="tile-scrim" aria-hidden="true"></span>'}
      <span class="tile-topline">
        <span class="day-number">${dayNumber}</span>
        ${date === today && !isMosaic ? '<span class="today-marker">Today</span>' : ""}
      </span>
      ${!isMosaic && cover?.kind === "artwork" ? '<span class="badge badge-ai">AI artwork</span>' : ""}
      ${day?.imageFailed && !isMosaic ? '<span class="image-failed"><span aria-hidden="true">↻</span> Image unavailable</span>' : ""}
      ${day && !cover && !day.imageFailed ? `<span class="paper-day"><strong>${html(day.title)}</strong><small>${counts.journalCount} ${counts.journalCount === 1 ? "journal" : "journals"}</small></span>` : ""}
      ${day && cover && !isMosaic && !coverUnavailable ? `<span class="tile-caption"><strong>${html(day.title)}</strong><small>${counts.label}</small></span>` : ""}
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
      ${populatedDates().length || isFirstUseFixture() ? "" : '<p class="empty-month-note">No journaled days in this month.</p>'}
    </div>`;
}

function chapterMedia(day) {
  const cover = calendarCover(day);
  const counts = dayCounts(day);
  if (cover?.unavailable) {
    const pending = mediaStateForPhoto(cover)?.status === "pending";
    const canRetry = state.shell.connection === "connected";
    return `
      <div class="almanac-cover-fallback is-unavailable media-state-v10">
        <span aria-hidden="true">${dateParts(day.date).day}</span>
        <div>
          <strong class="almanac-cover-provenance-v9">Calendar Cover unavailable</strong>
          <p>This image could not be loaded. The photo record and authentic journals remain available; this prototype does not verify the Original.</p>
          ${canRetry ? `<button type="button" class="secondary-button" data-action="retry-shell-image" data-date="${day.date}" data-photo-id="${html(cover.id)}" ${pending ? 'aria-disabled="true"' : ""}>${pending ? "Retrying image…" : "Retry image"}</button>` : '<small>Restore the connection before retrying this image.</small>'}
        </div>
      </div>`;
  }
  if (day.imageFailed) {
    return `<div class="almanac-cover-fallback is-unavailable"><span aria-hidden="true">${dateParts(day.date).day}</span><div><strong class="almanac-cover-provenance-v9">${almanacCoverLabel(day)}</strong><p>Image unavailable · The Journal Day remains readable.</p></div></div>`;
  }
  if (!cover) {
    return `<div class="almanac-cover-fallback"><span aria-hidden="true">${dateParts(day.date).day}</span><div><strong class="almanac-cover-provenance-v9">${almanacCoverLabel(day)}</strong><p>The full Journal Day remains available to read.</p></div></div>`;
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
    <article class="almanac-chapter almanac-chapter-v9 ${state.selectedDate === day.date ? "is-selected" : ""} ${isCurrent ? "is-current" : ""}" id="chapter-${day.date}" data-chapter-date="${day.date}" aria-labelledby="almanac-day-title-${day.date}" tabindex="-1">
      <header class="almanac-chapter-heading-v9">
        <div>
          <p class="almanac-chapter-date-v9">${longDate(day.date)} · ${counts.label}</p>
          <span class="almanac-title-origin-v9">Generated title · reading aid</span>
          <h3 id="almanac-day-title-${day.date}">${html(day.title)}</h3>
        </div>
        ${day.attention && !day.imageFailed ? '<span class="almanac-review-state">Review update</span>' : ""}
      </header>
      ${chapterMedia(day)}
      <div class="almanac-reflection-preview-v9">
        <p class="eyebrow">Generated reflection · reading aid</p>
        <p class="almanac-summary-preview-v9">${html(day.summary)}</p>
        <ul aria-label="Selected tags">${day.tags.slice(0, 3).map((tag) => `<li>${html(tag)}</li>`).join("")}</ul>
      </div>
      <footer class="chapter-footer">
        <button type="button" class="primary-button almanac-read-day" data-action="open-full-day" data-date="${day.date}" aria-label="Read full Journal Day for ${longDate(day.date)}">Read full Journal Day</button>
        <button type="button" class="text-button" data-action="open-upload" data-date="${day.date}">Upload journal for this date</button>
      </footer>
    </article>`;
}

function unifiedTopbar() {
  const reviewCount = dateReviewCount();
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
        ${reviewCount > 0 ? `<button class="date-review-nav-v11 ${state.view === "date-review" ? "is-active" : ""}" type="button" data-action="open-date-review" aria-label="${reviewCount} ${reviewCount === 1 ? "item needs" : "items need"} a Journal Date" ${state.view === "date-review" ? 'aria-current="page"' : ""}>Needs date · ${reviewCount}</button>` : ""}
        <button class="upload-quiet" type="button" data-action="open-upload">Add journal</button>
      </div>
    </header>`;
}

function calendarSelection(day) {
  if (!day) return "";
  const cover = calendarCover(day);
  const coverUnavailable = Boolean(cover?.unavailable);
  const mediaPending = coverUnavailable && mediaStateForPhoto(cover)?.status === "pending";
  const canRetryMedia = state.shell.connection === "connected";
  const counts = dayCounts(day);
  const sourceLabel = day.imageFailed || coverUnavailable ? "Calendar Cover unavailable" : cover?.kind === "photo" ? "Calendar Cover · Telegram photo" : cover?.kind === "artwork" ? "Calendar Cover · AI artwork" : "No cover image · Journal only";
  const coverClass = cover?.id && !coverUnavailable ? `cover-${String(cover.id).replace(/[^a-z0-9_-]/gi, "-")}` : "no-cover";
  const sourceDetail = coverUnavailable
    ? "This prototype does not verify the Original."
    : day.imageFailed
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
      <div class="museum-display ${cover && !coverUnavailable ? "has-cover" : "is-paper"} ${coverClass}">
        <figure id="museum-media-${day.date}" class="museum-figure${coverUnavailable ? " is-media-unavailable-v10" : ""}" tabindex="-1" aria-label="${html(sourceLabel)}">
          ${cover && !coverUnavailable
            ? `<img src="${html(cover.src)}" alt="${html(cover.alt)}" />`
            : `<div class="museum-paper-memory"><span>${dateParts(day.date).day}</span><p>${coverUnavailable ? "cover image unavailable" : html(day.title)}</p></div>`}
        </figure>
        <aside class="museum-placard" aria-label="Selected day details and provenance">
          <p class="museum-source">${sourceLabel}</p>
          ${coverUnavailable ? '<p class="surface-state-row-v10">This image could not be loaded. The photo record and authentic journals remain available; this prototype does not verify the Original.</p>' : ""}
          ${coverUnavailable ? canRetryMedia ? `<button type="button" class="secondary-button" data-action="retry-shell-image" data-date="${day.date}" data-photo-id="${html(cover.id)}" ${mediaPending ? 'aria-disabled="true"' : ""}>${mediaPending ? "Retrying image…" : "Retry image"}</button>` : '<small>Restore the connection before retrying this image.</small>' : ""}
          <h2 id="calendar-selection-title">${html(day.title)}</h2>
          <p class="museum-date">${longDate(day.date)}</p>
          <p class="museum-counts">${counts.label}</p>
          ${day.attention ? `<div class="museum-attention"><strong>Needs attention</strong><span>${html(day.attention)}</span></div>` : ""}
          <p class="museum-description">${html(description)}</p>
          <dl class="museum-provenance">
            <div><dt>${day.imageFailed || coverUnavailable ? "Status" : cover?.kind === "photo" ? "Original Timestamp" : cover?.kind === "artwork" ? "Generation" : "Archive status"}</dt><dd>${html(sourceDetail)}</dd></div>
          </dl>
          ${day.imageFailed ? '<button type="button" class="secondary-button" data-action="retry-image">Retry image</button>' : ""}
          <button type="button" class="primary-button museum-open-day" data-action="open-full-day" data-date="${day.date}">Open full Journal Day</button>
        </aside>
      </div>
    </section>`;
}

function readinessStatusKind(status) {
  if (status === "Blocked") return "blocked";
  if (status.startsWith("Unavailable")) return "unavailable";
  if (status.includes("Never verified")) return "never-verified";
  return "not-configured";
}

function readinessRow({ key, title, status, copy, action, actionLabel, checklist = [] }) {
  return `
    <article class="readiness-row-v9" aria-labelledby="readiness-${key}-title-v9 readiness-${key}-status-v9 readiness-${key}-copy-v9 readiness-${key}-action-v9">
      <div class="readiness-row-heading-v9">
        <h3 id="readiness-${key}-title-v9">${html(title)}</h3>
        <p id="readiness-${key}-status-v9" class="readiness-status-v9" data-status="${readinessStatusKind(status)}">${html(status)}</p>
      </div>
      <p id="readiness-${key}-copy-v9" class="readiness-row-copy-v9">${html(copy)}</p>
      ${checklist.length ? `<ul class="readiness-checklist-v9" aria-label="Recovery Ceremony evidence">${checklist.map((item) => `<li><span>${html(item.label)}</span><strong>${html(item.status)}</strong></li>`).join("")}</ul>` : ""}
      <button id="readiness-${key}-action-v9" type="button" class="text-button readiness-action-v9" data-action="${action}" data-readiness-key="${key}">${html(actionLabel)}</button>
    </article>`;
}

function readinessAside() {
  const fixture = readinessFixture();
  const configuredVoiceNotes = fixture.voiceNotes === "configured";
  const configuredTelegram = fixture.telegram === "configured";
  const aiUnavailable = fixture.ai === "unavailable";
  const backupUnverified = fixture.backup === "unverified";
  return `
    <aside class="readiness-aside-v9" aria-labelledby="readiness-title-v9">
      <header class="readiness-header-v9">
        <p class="eyebrow">Private capture</p>
        <h2 id="readiness-title-v9" tabindex="-1">Readiness</h2>
        <p>Prototype status only. Configuration happens outside this page.</p>
      </header>
      <div class="readiness-list-v9">
        ${readinessRow({
          key: "voicenotes",
          title: "VoiceNotes",
          status: configuredVoiceNotes ? "Configured on server · Never verified" : "Needs server configuration",
          copy: configuredVoiceNotes
            ? "Configuration is represented for this prototype; no VoiceNotes connection has been verified."
            : "Only notes tagged exactly “life-in-days” and created on or after Integration Activation are eligible. Older notes are never imported automatically.",
          action: "view-readiness-settings",
          actionLabel: configuredVoiceNotes ? "View boundary" : "View private setup instructions",
        })}
        ${readinessRow({
          key: "telegram",
          title: "Telegram",
          status: configuredTelegram ? "Configured on server · Never verified" : "Needs server configuration",
          copy: configuredTelegram
            ? "Configuration is represented for this prototype; no Telegram connection has been verified."
            : "One configured numeric user in one private chat is accepted. Groups and other senders are rejected. Ordinary photo messages may be compressed.",
          action: "view-readiness-settings",
          actionLabel: configuredTelegram ? "View boundary" : "View private setup instructions",
        })}
        ${readinessRow({
          key: "ai",
          title: "AI",
          status: aiUnavailable ? "Unavailable · Authentic capture available" : "Optional · Not configured",
          copy: aiUnavailable
            ? "Journal and photo capture, browsing, upload, and authentic source reading remain available without AI."
            : "Journals and photos remain useful without AI. No text or artwork provider is selected in this prototype.",
          action: "view-readiness-settings",
          actionLabel: "Learn what stays available",
        })}
        ${readinessRow({
          key: "backup",
          title: "Backup",
          status: backupUnverified ? "Never verified" : "Not configured",
          copy: backupUnverified
            ? "A backup upload would not prove that this archive can be restored."
            : "No encrypted backup is represented as configured.",
          action: "open-readiness-disclosure",
          actionLabel: "View recovery requirements",
        })}
        ${readinessRow({
          key: "recovery",
          title: "Recovery Ceremony",
          status: "Blocked",
          copy: "Launch remains blocked until two independent off-server recovery-key copies exist and a representative encrypted archive has been restored and decrypted.",
          checklist: [
            { label: "Password-manager copy", status: "Not evidenced" },
            { label: "Sealed offline copy", status: "Not evidenced" },
            { label: "Restore and decrypt sample", status: "Not evidenced" },
          ],
          action: "open-readiness-disclosure",
          actionLabel: "Review ceremony requirements",
        })}
      </div>
      <fieldset class="readiness-fixture-controls-v9">
        <legend class="prototype-data-label-v9">Prototype data</legend>
        <p>Switch fictional, in-memory review states. Reload returns to first use.</p>
        <div>
          ${[
            ["first-use/default", "First use"],
            ["first-use/configured-unverified", "Configured, not verified"],
            ["first-use/ai-unavailable", "AI unavailable"],
            ["archive/populated", "Populated archive"],
          ].map(([key, label]) => `<button type="button" class="text-button" data-action="set-readiness-fixture" data-fixture="${key}" aria-pressed="${state.readinessFixture === key}">${label}</button>`).join("")}
        </div>
      </fieldset>
    </aside>`;
}

function renderFirstUseCalendar() {
  return `
    <main id="prototype-main" class="mosaic-calendar-page is-calendar-landing is-first-use-v9" tabindex="-1">
      <div class="first-use-layout-v9">
        <section class="first-use-calendar-v9" aria-labelledby="first-use-title-v9">
          <header class="first-use-intro-v9">
            <div class="first-use-intro-copy-v9">
              <p class="eyebrow">Private archive</p>
              <h1 id="first-use-title-v9" tabindex="-1">Your archive begins here.</h1>
              <p>Add your first journal, or review private capture and recovery readiness.</p>
            </div>
            <div class="first-use-intro-actions-v9">
              <button type="button" class="primary-button" data-action="open-upload">Upload journal</button>
              <button type="button" class="secondary-button" data-action="review-readiness">Review readiness</button>
            </div>
          </header>
          <section class="mosaic-calendar-column" aria-labelledby="first-use-month-heading-v9">
            <div class="mosaic-intro">
              <div>
                <p class="eyebrow">Monday first · Asia/Kolkata</p>
                <h2 id="first-use-month-heading-v9"><button type="button" class="month-year-trigger" data-action="open-month-chooser" aria-haspopup="dialog" aria-label="Choose month and year, currently showing ${monthLabel(state.month)}"><span>${monthLabel(state.month)}</span><span aria-hidden="true">⌄</span></button></h2>
              </div>
            </div>
            <div class="mosaic-month-actions">
              <button type="button" class="icon-button" data-action="previous-month" aria-label="Previous month">←</button>
              <span>Every empty date remains quiet</span>
              <button type="button" class="today-button" data-action="today" aria-label="Go to today, 13 August 2026">Today</button>
              <button type="button" class="icon-button" data-action="next-month" aria-label="Next month">→</button>
            </div>
            ${calendarGrid("mosaic", "first-use-month-heading-v9")}
          </section>
        </section>
        ${readinessAside()}
      </div>
    </main>`;
}

function renderMosaicView() {
  if (isFirstUseFixture()) return renderFirstUseCalendar();
  const day = !state.almanacEmptyArchive && state.selectedDate ? days[state.selectedDate] : null;
  if (state.screen === "day" && day) {
    return `<main id="prototype-main" class="mosaic-day-page" tabindex="-1">${dayDetail(day, "mosaic")}</main>`;
  }
  return `
    <main id="prototype-main" class="mosaic-calendar-page ${day ? "has-calendar-selection" : "is-calendar-landing"}" tabindex="-1">
      <div class="mosaic-calendar-layout">
        <section class="mosaic-calendar-column" aria-labelledby="month-heading-mosaic-v9">
          <section class="mosaic-intro">
            <div><p class="eyebrow">A private month in pictures</p><h1 id="month-heading-mosaic-v9"><button type="button" class="month-year-trigger" data-action="open-month-chooser" aria-haspopup="dialog" aria-label="Choose month and year, currently showing ${monthLabel(state.month)}"><span>${monthLabel(state.month)}</span><span aria-hidden="true">⌄</span></button></h1></div>
            ${day ? "" : "<p>Recognize a day by its texture. Open it when you want the full, authentic record.</p>"}
          </section>
          <div class="mosaic-month-actions">
            <button type="button" class="icon-button" data-action="previous-month" aria-label="Previous month">←</button>
            <span>Monday first · Asia/Kolkata</span>
            <button type="button" class="today-button" data-action="today" aria-label="Go to today, 13 August 2026">Today</button>
            <button type="button" class="icon-button" data-action="next-month" aria-label="Next month">→</button>
          </div>
          ${calendarGrid("mosaic", "month-heading-mosaic-v9")}
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
    <div class="almanac-index-content-v9" id="almanac-index-content-${context}-v9">
      <header class="almanac-index-heading-v9"><p class="eyebrow">Chronological index</p><h2>${context === "drawer" ? "Almanac index" : "Browse the Almanac"}</h2></header>
      <button type="button" class="secondary-button almanac-jump-trigger-v9" data-action="open-almanac-jump" aria-haspopup="dialog">Jump to month and year</button>
      <nav class="almanac-volume-nav-v9" aria-label="Loaded Almanac volumes">
        <p>Loaded volumes</p>
        ${loadedMonths.map((monthKey) => {
          const monthDays = liveDaysInMonth(monthKey);
          const monthIsActive = activeMonth === monthKey;
          return `<section class="almanac-index-volume-v9 ${monthIsActive ? "is-current" : ""}" data-index-month="${monthKey}">
            <button type="button" class="almanac-index-month-v9" data-action="select-almanac-month" data-month-key="${monthKey}" ${monthIsActive && !state.almanacVisibleDate ? 'aria-current="location"' : ""}>
              <strong>${monthLabel(monthKey)}</strong><span>${monthDays.length} Journal ${monthDays.length === 1 ? "Day" : "Days"}</span>
            </button>
            ${monthDays.length ? `<ol>${monthDays.map((day) => `<li><button type="button" data-action="select-almanac-chapter" data-date="${day.date}" ${state.almanacVisibleDate === day.date ? 'aria-current="location"' : ""}><span><strong>${shortDate(day.date)}</strong>${html(day.title)}</span><small>${almanacCoverIndicator(day)}</small></button></li>`).join("")}</ol>` : '<p class="almanac-index-empty-v9">No Journal Days</p>'}
          </section>`;
        }).join("")}
      </nav>
      <button class="upload-primary" type="button" data-action="open-upload">Upload journal</button>
      <p class="almanac-timezone">Journal Dates use Asia/Kolkata</p>
    </div>`;
}

function almanacIndexV9() {
  const collapsed = state.almanacCollapsed;
  return `
    <aside class="almanac-index almanac-index-v9 ${collapsed ? "is-collapsed" : ""}" aria-label="Almanac index">
      <button type="button" class="almanac-rail-toggle" data-action="toggle-almanac-rail" aria-controls="almanac-index-content-desktop-v9" aria-expanded="${!collapsed}">
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
    return `<section class="almanac-pagination-v9" aria-label="Return to the fictional Almanac evidence window"><p>${monthLabel(state.almanacMonth)} is a quiet browse target outside the fictional May–August 2026 evidence window.</p><button type="button" class="primary-button" data-action="almanac-today">Return to newest days</button></section>`;
  }
  return `
    <section class="almanac-pagination-v9" aria-label="Load earlier Journal Days" aria-busy="${status === "loading"}">
      <p>Showing ${count} Journal ${count === 1 ? "Day" : "Days"} from ${almanacRangeLabel()}</p>
      ${status === "error" ? `<div class="almanac-load-error-v9" role="alert"><strong>Earlier Journal Days could not be loaded.</strong><span>What is already shown is unchanged.</span></div><button type="button" class="primary-button" data-action="retry-load-earlier">Retry loading earlier days</button>`
        : atBeginning ? '<div class="almanac-beginning-v9"><button type="button" class="primary-button" data-action="almanac-beginning" aria-disabled="true">Beginning of this prototype archive</button><span>No earlier live Journal Days are available.</span></div>'
          : `<button type="button" class="primary-button" data-action="load-earlier" ${status === "loading" ? 'aria-disabled="true"' : ""}>${status === "loading" ? "Loading earlier days" : "Load earlier days"}</button>`}
      ${!atBeginning && status === "idle" ? '<button type="button" class="prototype-state-control-v9" data-action="simulate-load-failure">Prototype state · fail next load</button>' : ""}
      ${status === "idle" ? '<button type="button" class="prototype-state-control-v9" data-action="simulate-empty-archive">Prototype state · empty archive</button>' : ""}
    </section>`;
}

function almanacVolumeMarkup(monthKey) {
  const monthDays = liveDaysInMonth(monthKey);
  if (!monthDays.length) return "";
  return `<section class="almanac-volume-v9" id="volume-${monthKey}" data-almanac-month="${monthKey}" aria-labelledby="volume-title-${monthKey}">
    <header class="almanac-volume-heading-v9" tabindex="-1"><p>Volume ${monthKey.slice(5)} · ${monthKey.slice(0, 4)}</p><div><h2 id="volume-title-${monthKey}">${monthLabel(monthKey)}</h2><span>${monthDays.length} Journal ${monthDays.length === 1 ? "Day" : "Days"}</span></div></header>
    <div class="almanac-volume-days-v9">${monthDays.map((day) => almanacChapter(day)).join('<div class="chapter-divider-v9" aria-hidden="true"></div>')}</div>
  </section>`;
}

function renderAlmanacView() {
  const selectedDay = state.selectedDate ? days[state.selectedDate] : null;
  if (state.screen === "day" && selectedDay) {
    return `<main id="prototype-main" class="mosaic-day-page almanac-day-page-v9" tabindex="-1">${dayDetail(selectedDay, "almanac")}</main>`;
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
    <div class="almanac-shell almanac-shell-v9 ${state.almanacCollapsed ? "is-collapsed" : ""}">
      ${almanacIndexV9()}
      <main id="prototype-main" class="almanac-reading" tabindex="-1">
        <header class="almanac-title-page almanac-title-page-v9">
          <div><p class="eyebrow">Chronological Almanac</p><h1>Almanac</h1></div>
          <div class="almanac-title-actions"><button type="button" class="today-button" data-action="almanac-today">Today</button></div>
          <p>Your Journal Days, arranged from newest to oldest.</p>
          <small>Live Journal Days only · Asia/Kolkata</small>
        </header>
        ${archiveIsEmpty ? `<section class="almanac-empty almanac-empty-v9 almanac-archive-empty-v9" aria-labelledby="archive-empty-title-v9"><p class="eyebrow">Private archive</p><h2 id="archive-empty-title-v9" tabindex="-1">No live Journal Days are available to read.</h2><p>Calendar browsing and text upload remain available without implying that setup is complete.</p><div><button type="button" class="secondary-button" data-action="set-view" data-view="calendar">View Calendar</button><button type="button" class="primary-button" data-action="open-upload">Upload journal</button></div><button type="button" class="prototype-state-control-v9" data-action="restore-sample-archive">Prototype state · restore sample archive</button></section>` : `<div id="almanac-volumes-v9">${populatedGroups.map(({ monthKey }) => almanacVolumeMarkup(monthKey)).join("")}</div>
        ${onlyMonthIsEmpty ? `<section class="almanac-empty almanac-empty-v9" id="volume-${state.almanacMonth}" data-almanac-month="${state.almanacMonth}" aria-labelledby="empty-volume-title-v9"><p class="eyebrow">${monthLabel(state.almanacMonth)}</p><h2 id="empty-volume-title-v9" tabindex="-1">No journaled days in this month.</h2><p>This month remains part of the archive without being marked incomplete.</p><button type="button" class="secondary-button" data-action="almanac-today">Return to newest days</button></section>` : ""}
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
    <main id="prototype-main" class="search-page-v9" tabindex="-1">
      <header class="search-heading-v9">
        <p class="eyebrow">Private deterministic search</p>
        <h1>Search your archive</h1>
        <p>Find literal words in the authentic record without suggestions, generated answers, or fuzzy interpretation.</p>
      </header>
      <form class="archive-search-v9" data-action="search-form" role="search">
        <label for="archive-search-input-v9">Words or exact phrase</label>
        <div><input id="archive-search-input-v9" type="search" value="${html(state.searchDraft)}" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Enter literal text" /><button class="primary-button" type="submit">Search archive</button></div>
      </form>
      <section class="search-results-v9" aria-live="polite" aria-labelledby="search-results-heading-v9">
        ${!hasQuery ? `
          <div class="search-initial-v9">
            <p class="eyebrow">Search without guesswork</p>
            <h2 id="search-results-heading-v9" tabindex="-1">Only the words you enter</h2>
            <p>This version searches literal text in titles, summaries, stored topics, and displayed journal text. It does not infer alternatives or generate an answer.</p>
            <dl>
              <div><dt>Private in this page</dt><dd>Search terms are not added to the address, page title, or persistent browser storage.</dd></div>
              <div><dt>Current archive only</dt><dd>Photo captions, dates, and historical versions remain outside this first privacy correction and are tracked for the complete lexical-search version.</dd></div>
              <div><dt>No AI or image search</dt><dd>No semantic similarity, OCR, image recognition, or conversational retrieval is used.</dd></div>
            </dl>
          </div>` : `
          <div class="search-results-heading-v9"><h2 id="search-results-heading-v9" tabindex="-1">${results.length} ${results.length === 1 ? "Journal Day" : "Journal Days"}</h2>${results.length ? '<button type="button" class="text-button" data-action="clear-search">Clear search</button>' : ""}</div>
          ${results.length ? `<div class="search-result-grid-v9">${results.map((day) => {
          const cover = calendarCover(day);
          const counts = dayCounts(day);
          return `<button type="button" class="search-result-card-v9" data-action="open-search-result" data-date="${day.date}" aria-label="${html(`${shortDate(day.date)}: ${day.title}${cover?.kind === "artwork" ? ", AI artwork" : ""}`)}" aria-describedby="search-result-description-${day.date}">
            <span class="search-result-media-v9 ${cover ? "has-media" : "is-paper"}">${cover ? `<img src="${html(cover.src)}" alt="" />` : `<span>${dateParts(day.date).day}</span>`}</span>
            <span class="search-result-copy-v9"><small>${shortDate(day.date)} · ${counts.label}${cover?.kind === "artwork" ? " · AI artwork" : ""}</small><strong>${html(day.title)}</strong><span id="search-result-description-${day.date}">${html(day.summary)}</span><em>${day.tags.map((tag) => html(tag)).join(" · ")}</em></span>
          </button>`;
        }).join("")}</div>` : '<div class="search-empty-v9"><h3>No exact matches</h3><p>Life in Days does not infer alternatives. Try another literal word or clear the search.</p><button type="button" class="secondary-button" data-action="clear-search">Clear search</button></div>'}`}
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
        <button type="button" class="settings-overview-row" data-action="open-date-review"><span><strong>Needs Date Review</strong><small>Preserved items with a missing, invalid, or future Journal Date.</small></span><span>${dateReviewCount() == null ? "Count unavailable" : `${dateReviewCount()} unresolved`}</span></button>
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
        { label: "Human site", value: "Private authenticated archive", detail: "The hostname is provisioned outside this browser prototype and is not displayed here." },
        { label: "Journal timezone", value: "Asia/Kolkata", stateLabel: "Fixed for MVP", detail: "Journal Dates and 01:00 schedules use this timezone." },
        { label: "Calendar", value: "English (India) · Monday first", stateLabel: "Fixed for MVP" },
        { label: "Source quiet period", value: "15 minutes", detail: "Untouched generated text waits until journal sources settle." },
        { label: "Final refresh & Artwork Sweep", value: "01:00 Asia/Kolkata", detail: "Eligible image-less Journal Days are checked without sending reminders." },
      ])}
      <aside class="settings-footnote" role="note">Historical automatic import, reminders, streaks, and coaching are not part of MVP.</aside>
    </section>`;
}

function settingsIntegrations() {
  const fixture = readinessFixture();
  const voiceNotesStatus = fixture.voiceNotes === "configured" ? "Configured on server · Never verified" : "Needs server configuration";
  const telegramStatus = fixture.telegram === "configured" ? "Configured on server · Never verified" : "Needs server configuration";
  return `
    <section class="settings-panel" aria-labelledby="settings-section-heading">
      <button type="button" class="settings-mobile-back" data-action="set-settings-section" data-section="overview">Back to Settings</button>
      <header class="settings-panel-heading"><p class="eyebrow">Integrations</p><h2 id="settings-section-heading" tabindex="-1">Capture boundaries</h2><p>Configuration is summarized here without exposing secrets, identifiers, or callback paths.</p></header>
      <section class="settings-group" aria-labelledby="capture-source-a-settings-title-v12">
        <div class="settings-group-heading"><div><p class="eyebrow">Journal capture</p><h3 id="capture-source-a-settings-title-v12" tabindex="-1">VoiceNotes</h3></div><span class="settings-state is-neutral">${voiceNotesStatus}</span></div>
        ${settingsRows([
          { label: "Eligibility tag", value: "life-in-days", stateLabel: "Exact · read-only" },
          { label: "Integration Activation", value: "Not activated", detail: "Activation cannot be backdated through Settings." },
          { label: "Last reconciliation", value: "Never run in prototype" },
        ])}
        <p class="settings-boundary-copy">Only notes tagged exactly <code>life-in-days</code> and created at or after Integration Activation are eligible. Older notes are never imported automatically, even if edited or tagged later.</p>
      </section>
      <section class="settings-group" aria-labelledby="capture-source-b-settings-title-v12">
        <div class="settings-group-heading"><div><p class="eyebrow">Photo capture</p><h3 id="capture-source-b-settings-title-v12" tabindex="-1">Telegram</h3></div><span class="settings-state is-neutral">${telegramStatus}</span></div>
        ${settingsRows([
          { label: "Allowed sender", value: fixture.telegram === "configured" ? "Configured on server" : "Not configured in prototype", stateLabel: "Never displayed in browser" },
          { label: "Conversation", value: "One private chat only", detail: "Groups and every other sender are rejected." },
          { label: "Request verification", value: "Server configuration only", detail: "No secret or identifier is visible or editable in the browser." },
        ])}
        <button type="button" class="primary-button settings-related-action" data-action="open-capture-companion">Open capture companion</button>
        <button type="button" class="text-button settings-related-action" data-action="settings-related" data-label="System Health">View integration health</button>
      </section>
    </section>`;
}

function settingsAi() {
  return `
    <section class="settings-panel" aria-labelledby="settings-section-heading">
      <button type="button" class="settings-mobile-back" data-action="set-settings-section" data-section="overview">Back to Settings</button>
      <header class="settings-panel-heading"><p class="eyebrow">AI & privacy</p><h2 id="settings-section-heading" tabindex="-1">What leaves Life in Days</h2><p>Generated presentation stays separate from authentic source material. Journal and photo capture, browsing, upload, and authentic source reading remain available when AI is unavailable.</p></header>
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
        { label: "Human archive", value: "Private authenticated site", detail: "Cloudflare Access is the only planned human login layer; the hostname is not displayed here." },
        { label: "Machine callbacks", value: "Server-only callback host", detail: "The callback hostname and paths are never displayed in the browser." },
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
          <div class="settings-related"><p>Related management</p><button type="button" data-action="open-date-review">Needs Date Review</button>${["System Health", "Export archive", "Trash", "Suppressions", "History"].map((label) => `<button type="button" data-action="settings-related" data-label="${label}">${label}</button>`).join("")}</div>
        </aside>
        <div class="settings-content">${settingsSectionContent()}</div>
      </div>
    </main>`;
}

function captureSelectedFixtureV12() {
  return captureFixtureV12(state.capture.selection);
}

function captureLongDateV12(date) {
  return date ? dateReviewDisplayDate(date) : "Needs Date Review";
}

function captureGuideMarkupV12() {
  const expanded = captureSelectedFixtureV12().kind === "guide";
  return `
    <details class="telegram-guide" id="capture-guide-v12" ${expanded ? "open" : ""}>
      <summary>Telegram photo guide</summary>
      <ol>${CAPTURE_GUIDE_V12.map((item) => `<li>${html(item)}</li>`).join("")}</ol>
    </details>`;
}

function capturePreviewMarkupV12(fixture) {
  if (fixture.kind === "authorization") return "";
  if (fixture.kind === "caption" || fixture.kind === "media" || fixture.key === "t7") {
    return `<div class="telegram-document-preview" aria-hidden="true"><span>Image document</span><small>Synthetic fixture</small></div>`;
  }
  if (fixture.key === "t3") {
    const representedCount = state.capture.albumProgress;
    return `<div class="telegram-media-group" aria-label="Three received photo previews">${fixture.members.map((member, index) => `
      <figure class="telegram-media-row" data-state="${index < representedCount ? "complete" : state.capture.active && state.capture.stage === "waiting" && index === representedCount ? "pending" : "unavailable"}"><img src="${html(member.asset)}" alt="" /><figcaption class="telegram-media-row-copy"><strong>Received photo ${index + 1}</strong><span>${member.caption ? html(member.caption) : "No Photo Caption"}</span><small>Status · ${index < representedCount ? "Complete" : state.capture.active && state.capture.stage === "waiting" && index === representedCount ? "In progress" : "Unavailable"}</small></figcaption></figure>`).join("")}</div>`;
  }
  return fixture.asset ? `<figure class="telegram-preview"><img src="${html(fixture.asset)}" alt="${html(fixture.alt)}" /><figcaption>Synthetic local fixture · non-destructive 4:5 preview</figcaption></figure>` : "";
}

function captureInputMarkupV12() {
  const fixture = captureSelectedFixtureV12();
  if (fixture.kind === "guide") {
    return `<section class="telegram-empty" aria-labelledby="capture-selected-title-v12"><h2 id="capture-selected-title-v12" tabindex="-1">Synthetic Telegram message</h2><p>No Telegram activity is being read. Choose a synthetic message to inspect its path.</p></section>`;
  }
  if (fixture.kind === "authorization") {
    return `
      <article class="telegram-input" aria-labelledby="capture-selected-title-v12">
        <header><p class="eyebrow">Selected synthetic request</p><h2 id="capture-selected-title-v12" tabindex="-1">Synthetic Telegram message</h2></header>
        <p>Authorization is represented before media download. Media preview and metadata remain unavailable.</p>
      </article>`;
  }
  const isMedia = fixture.kind === "media";
  const isCaption = fixture.kind === "caption";
  const unspecified = "Not specified in this synthetic fixture";
  const sourceForm = fixture.sourceForm || unspecified;
  const decodedFormat = fixture.format || unspecified;
  const messageTime = fixture.messageTime || unspecified;
  const receivedTime = fixture.receivedTime || unspecified;
  const rawCaption = fixture.rawCaption ?? fixture.raw ?? unspecified;
  return `
    <article class="telegram-input" aria-labelledby="capture-selected-title-v12">
        <header><p class="eyebrow">${isMedia ? "Media validation fixture" : isCaption ? "Caption grammar fixture" : "Selected synthetic input"}</p><h2 id="capture-selected-title-v12" tabindex="-1">Synthetic Telegram message</h2><p class="telegram-status"><strong>${html(fixture.title || fixture.label)}</strong></p></header>
      <div class="telegram-input-grid">
        ${capturePreviewMarkupV12(fixture)}
        <dl class="telegram-facts">
          <div><dt>Source form</dt><dd>${html(sourceForm)}</dd></div>
          <div><dt>Decoded format</dt><dd>${html(decodedFormat)}</dd></div>
          <div><dt>Exact bytes</dt><dd>${fixture.bytes == null ? "Not specified in this synthetic fixture" : Number(fixture.bytes).toLocaleString("en-US")}</dd></div>
          <div><dt>Dimensions</dt><dd>${fixture.width == null || fixture.height == null ? "Not specified in this synthetic fixture" : `${Number(fixture.width).toLocaleString("en-US")} × ${Number(fixture.height).toLocaleString("en-US")} pixels`}</dd></div>
          <div><dt>Telegram message time</dt><dd>${html(messageTime)}</dd></div>
          <div><dt>Received by Life in Days</dt><dd>${html(receivedTime)}</dd></div>
          <div><dt>Raw caption</dt><dd class="telegram-caption">${html(rawCaption)}</dd></div>
          ${fixture.forwarded ? "<div><dt>Forwarded</dt><dd>Forwarded photo · current private chat authorization represented</dd></div>" : ""}
          ${fixture.key === "t3" ? "<div><dt>Received photos</dt><dd>3 received photos · each represented independently</dd></div>" : ""}
          ${fixture.note ? `<div><dt>Prototype detail</dt><dd>${html(fixture.note)}</dd></div>` : ""}
        </dl>
      </div>
    </article>`;
}

function captureStageStateV12(name) {
  const capture = state.capture;
  const order = ["received", "authorizing", "validating", "waiting"];
  const currentIndex = order.indexOf(capture.stage);
  const stageIndex = order.indexOf(name);
  if (capture.stage === name && capture.active) return { word: "In progress", modifier: "pending" };
  const interruptedAtIndex = order.indexOf(capture.terminal?.interruptedAt);
  if (["interrupted", "partial"].includes(capture.stage) && interruptedAtIndex >= 0) {
    return interruptedAtIndex > stageIndex
      ? { word: "Complete", modifier: "complete" }
      : { word: "Unavailable", modifier: "unavailable" };
  }
  if (currentIndex > stageIndex || ["captured-valid", "captured-review", "capture-failed", "media-accepted", "media-rejected", "authorization-rejected", "caption-result", "partial"].includes(capture.stage)) {
    const terminalBefore = (capture.stage === "authorization-rejected" && stageIndex > 1)
      || (["media-accepted", "media-rejected", "caption-result"].includes(capture.stage) && stageIndex > 2);
    if (!terminalBefore) return { word: "Complete", modifier: "complete" };
  }
  return { word: "Unavailable", modifier: "unavailable" };
}

function capturePathMarkupV12() {
  const fixture = captureSelectedFixtureV12();
  if (fixture.kind === "guide" || state.capture.stage === "selected") {
    return `<section class="telegram-conversation" aria-labelledby="capture-path-title-v12"><h2 id="capture-path-title-v12">Simulated Telegram path</h2><p class="telegram-empty">No archive outcome has been represented.</p></section>`;
  }
  const authorizationRepresented = fixture.kind !== "authorization"
    && !["received", "authorizing", "selected", "guide"].includes(state.capture.stage);
  const stages = [
    ["received", "Received", "Synthetic input received in this browser."],
    ["authorizing", "Authorizing", authorizationRepresented ? "Authorized private chat represented" : "Private-chat authorization is represented before media download."],
    ["validating", "Validating", "Decoded type and inclusive per-file thresholds are evaluated."],
    ["waiting", "Waiting for durable capture…", state.capture.albumProgress ? `${state.capture.albumProgress} received photos represented so far.` : "No acknowledgement is represented before a terminal result."],
  ];
  const terminal = state.capture.terminal;
  const terminalLabel = terminal?.type === "captured-valid" ? "Captured"
    : terminal?.type === "captured-review" ? "Needs Date Review"
      : terminal?.type === "authorization-rejected" ? "Request not accepted"
        : terminal?.type === "media-rejected" ? "Photo not added"
          : terminal?.type === "media-accepted" || terminal?.type === "caption-result" ? "Validation complete"
            : terminal?.type === "partial" ? terminal.albumProgress === 3 ? "Final acknowledgement not represented" : "Waiting for another received photo"
              : terminal ? "Capture unavailable" : "Terminal outcome";
  const terminalState = terminal?.type === "captured-valid" || terminal?.type === "media-accepted" || terminal?.type === "caption-result" ? "complete"
    : terminal?.type === "captured-review" || terminal?.type === "partial" ? "attention"
      : terminal ? "attention" : "unavailable";
  return `
    <section class="telegram-conversation" aria-labelledby="capture-path-title-v12">
      <h2 id="capture-path-title-v12">Simulated Telegram path</h2>
      <ol class="telegram-path" ${state.capture.active ? 'aria-busy="true"' : ""}>
        ${stages.map(([key, title, copy]) => {
          const status = captureStageStateV12(key);
          return `<li><article class="telegram-stage telegram-stage--${status.modifier}" data-state="${status.modifier}"><div><h3>${title}</h3><p>${html(copy)}</p></div><span class="telegram-status">${status.word}</span></article></li>`;
        }).join("")}
        <li><article class="telegram-stage telegram-stage--${terminalState}" data-state="${terminalState}"><div><h3>${html(terminalLabel)}</h3><p>${terminal ? "A terminal prototype outcome is shown below." : "No terminal outcome yet."}</p></div><span class="telegram-status">${terminal ? terminalState === "complete" ? "Complete" : "Needs attention" : "Unavailable"}</span></article></li>
      </ol>
    </section>`;
}

function capturePrivateActionV12(action, label) {
  return `<div class="telegram-action-pair"><button type="button" class="${action === "capture-review-date" ? "primary-button" : "secondary-button"}" data-action="${action}">${label}</button><span class="telegram-private-link">Private link · authentication required</span></div>`;
}

function captureFactsV12(fixture, { includeDestination = true } = {}) {
  const caption = fixture.key === "t3"
    ? "Received photo 1 · Sunday market flowers; received photos 2 and 3 · No Photo Caption"
    : fixture.photoCaption ? fixture.photoCaption : "No Photo Caption";
  const dateValue = fixture.journalDate ? captureLongDateV12(fixture.journalDate) : "Needs Date Review";
  const destination = includeDestination && fixture.destination ? `<div><dt>Product-defined destination effect</dt><dd>${html(fixture.destination)}</dd></div>` : "";
  return `<dl class="telegram-facts">
    <div><dt>Source form</dt><dd>${html(fixture.sourceForm)}</dd></div>
    <div><dt>Journal Date source</dt><dd>${html(fixture.dateSource)}</dd></div>
    <div><dt>Journal Date</dt><dd>${html(dateValue)}</dd></div>
    <div><dt>Photo Caption state</dt><dd class="telegram-caption">${html(caption)}</dd></div>
    <div><dt>Original Timestamp</dt><dd>${html(fixture.originalTimestamp)}</dd></div>
    ${destination}
  </dl>`;
}

function captureOutcomeMarkupV12() {
  const fixture = captureSelectedFixtureV12();
  const terminal = state.capture.terminal;
  if (!terminal) {
    return `<section class="telegram-outcome" data-state="pending" aria-labelledby="capture-outcome-title-v12"><h2 id="capture-outcome-title-v12">Life in Days outcome</h2><div class="telegram-outcome-body"><p>No archive outcome has been represented.</p></div></section>`;
  }
  if (terminal.type === "authorization-rejected") {
    return `<section class="telegram-outcome telegram-outcome--rejected" data-state="rejected" aria-labelledby="capture-outcome-title-v12"><h2 id="capture-outcome-title-v12" tabindex="-1">Request not accepted</h2><div class="telegram-outcome-body"><p>This request was not accepted. No photo was downloaded or added.</p><p><strong>Rejected before media download · no Source Item</strong></p><p>No Telegram reply is represented.</p></div></section>`;
  }
  if (terminal.type === "media-rejected") {
    return `<section class="telegram-outcome telegram-outcome--rejected" data-state="rejected" aria-labelledby="capture-outcome-title-v12"><h2 id="capture-outcome-title-v12" tabindex="-1">Photo not added</h2><div class="telegram-outcome-body"><p>${html(terminal.message)}</p><p><strong>No Source Item was created. The Telegram message remains in this chat.</strong></p>${terminal.detail ? `<details><summary>Prototype gate details</summary><p>${html(terminal.detail)}</p></details>` : ""}</div></section>`;
  }
  if (terminal.type === "media-accepted") {
    return `<section class="telegram-outcome telegram-outcome--accepted" data-state="accepted" aria-labelledby="capture-outcome-title-v12"><h2 id="capture-outcome-title-v12">Life in Days outcome</h2><div class="telegram-outcome-body"><p>${html(terminal.message)}</p><p>No archive outcome has been represented by this validation fixture.</p></div></section>`;
  }
  if (terminal.type === "caption-result") {
    const analysis = terminal.analysis;
    const caption = analysis.photoCaption ? analysis.photoCaption : "No Photo Caption";
    return `<section class="telegram-outcome ${analysis.review ? "telegram-outcome--review" : "telegram-outcome--accepted"}" data-state="${analysis.review ? "review" : "accepted"}" aria-labelledby="capture-outcome-title-v12"><h2 id="capture-outcome-title-v12">Caption result</h2><div class="telegram-outcome-body"><dl class="telegram-facts"><div><dt>Leading instruction</dt><dd>${analysis.matched ? "Exact-shaped token matched" : "No leading date instruction matched"}</dd></div><div><dt>Journal Date source</dt><dd>${html(analysis.dateSource)}</dd></div><div><dt>Journal Date</dt><dd>${analysis.journalDate ? html(captureLongDateV12(analysis.journalDate)) : "Needs Date Review"}</dd></div><div><dt>Photo Caption state</dt><dd class="telegram-caption">${html(caption)}</dd></div>${analysis.reviewReason ? `<div><dt>Review reason</dt><dd>${html(analysis.reviewReason)}</dd></div>` : ""}</dl><p>No Source Item or archive change is represented by this grammar fixture.</p></div></section>`;
  }
  if (terminal.type === "captured-review") {
    if (terminal.reviewResolved || state.capture.reviewResolved) {
      return `<section class="telegram-outcome telegram-outcome--accepted" data-state="accepted" aria-labelledby="capture-outcome-title-v12"><h2 id="capture-outcome-title-v12" tabindex="-1">Journal Date assigned</h2><div class="telegram-outcome-body"><p>The matching item is no longer unresolved in Needs Date Review.</p><p>Returning here did not recreate the item or repeat its capture acknowledgement.</p></div></section>`;
    }
    return `<section class="telegram-outcome telegram-outcome--review" data-state="review" aria-labelledby="capture-outcome-title-v12"><h2 id="capture-outcome-title-v12">Life in Days outcome</h2><div class="telegram-outcome-body"><p>${html(fixture.reviewMessage)}</p><p><strong>${html(fixture.reviewBoundary)}</strong></p>${captureFactsV12(fixture, { includeDestination: false })}<dl class="telegram-facts"><div><dt>Product-defined destination effect</dt><dd>Needs Date Review only · no Calendar or Almanac change.</dd></div><div><dt>Represented archive result</dt><dd>One undated holding item represented after media and holding-record completion.</dd></div></dl><div class="telegram-actions">${capturePrivateActionV12("capture-review-date", "Review date")}</div></div></section>`;
  }
  if (terminal.type === "capture-failed" || terminal.type === "interrupted") {
    const disconnected = state.shell.connection !== "connected";
    const message = terminal.type === "interrupted"
      ? "The capture result is unavailable while the connection is interrupted. Nothing was queued or added."
      : fixture.failure || "Photo was not saved because Life in Days could not finish storing it. Nothing was added. The Telegram message remains in this chat.";
    const stateLine = fixture.failureState || "No Source Item · no Journal Day change · safe to retry";
    return `<section class="telegram-outcome telegram-outcome--failure" data-state="failure" aria-labelledby="capture-outcome-title-v12"><h2 id="capture-outcome-title-v12" tabindex="-1">Photo not saved</h2><div class="telegram-outcome-body"><p>${html(message)}</p><p><strong>${html(stateLine)}</strong></p>${captureFactsV12(fixture, { includeDestination: false })}<div class="telegram-actions"><button type="button" class="primary-button" data-action="capture-retry" ${disconnected ? 'aria-disabled="true"' : ""}>Try again</button></div></div></section>`;
  }
  if (terminal.type === "partial") {
    const count = Math.max(1, Math.min(3, Number(terminal.albumProgress) || 1));
    const members = count === 1 ? "Received photo 1 is" : count === 2 ? "Received photos 1 and 2 are" : "Received photos 1, 2, and 3 are";
    const heading = count === 3 ? "Final acknowledgement not represented" : "Waiting for another received photo";
    const attemptNote = terminal.continuationAttemptAddedNothing ? "<p><strong>The new continuation attempt added nothing.</strong> The already represented photos remain unchanged.</p>" : "";
    const retryAction = terminal.retryAvailable
      ? `<div class="telegram-actions"><button type="button" class="primary-button" data-action="capture-retry" ${state.shell.connection !== "connected" ? 'aria-disabled="true"' : ""}>Try again</button></div>`
      : "";
    return `<section class="telegram-outcome telegram-outcome--review" data-state="review" aria-labelledby="capture-outcome-title-v12"><h2 id="capture-outcome-title-v12" tabindex="-1">${heading}</h2><div class="telegram-outcome-body"><p>${count} of 3 received photos have been represented so far.</p><p>${members} represented durably. No complete-album claim or terminal Telegram acknowledgement is represented.</p>${attemptNote}${retryAction}</div></section>`;
  }
  const isT7 = fixture.key === "t7";
  const actions = isT7 ? "" : (fixture.actions || []).map((action) => action === "view-day"
    ? capturePrivateActionV12("capture-view-day", "View day")
    : capturePrivateActionV12("capture-change-date", "Change Journal Date")).join("");
  return `<section class="telegram-outcome telegram-outcome--accepted" data-state="accepted" aria-labelledby="capture-outcome-title-v12"><h2 id="capture-outcome-title-v12">Life in Days outcome</h2><div class="telegram-outcome-body"><p><strong>${html(fixture.success)}</strong></p>${captureFactsV12(fixture, { includeDestination: !isT7 })}<dl class="telegram-facts"><div><dt>Represented archive result</dt><dd>${isT7 ? "One Daily Photo attachment represented after exactly one retry success." : "The Product-defined Daily Photo attachment and destination recalculation are represented once."}</dd></div></dl>${actions ? `<div class="telegram-actions">${actions}</div>` : ""}</div></section>`;
}

function renderCaptureChangeDateV12() {
  const fixture = captureSelectedFixtureV12();
  return `<main id="prototype-main" class="telegram-handoff-page telegram-change-date" tabindex="-1"><button type="button" class="telegram-back" data-action="capture-handoff-back"><span aria-hidden="true">←</span> Back</button><header><p class="eyebrow">Private photo capture</p><h1 id="capture-change-title-v12" tabindex="-1">Change Journal Date</h1><p class="telegram-private-link">Private link · authentication required</p></header><dl class="telegram-facts"><div><dt>Source type</dt><dd>${html(fixture.sourceForm)}</dd></div><div><dt>Current Journal Date</dt><dd>${html(captureLongDateV12(fixture.journalDate))}</dd></div><div><dt>Original Timestamp</dt><dd>${html(fixture.originalTimestamp)} · Immutable</dd></div></dl><p class="telegram-note"><strong>Date change action is not part of this prototype.</strong></p></main>`;
}

function renderCaptureCompanionV12() {
  if (state.capture.surface === "change-date") return renderCaptureChangeDateV12();
  const fixture = captureSelectedFixtureV12();
  const active = Boolean(state.capture.active);
  const committed = Boolean(state.capture.fixtureIdentity && captureCommittedIdentitiesV12.has(state.capture.fixtureIdentity));
  const retryOnly = ["capture-failed", "interrupted"].includes(state.capture.terminal?.type) || Boolean(state.capture.terminal?.retryAvailable);
  const canRun = fixture.kind !== "guide" && !committed && !retryOnly && state.shell.connection === "connected";
  return `
    <main id="prototype-main" class="telegram-capture-page" tabindex="-1">
      <button type="button" class="telegram-back" data-action="capture-back"><span aria-hidden="true">←</span> Back</button>
      <header class="telegram-capture-header">
        <p class="eyebrow">Private photo capture</p>
        <h1 id="capture-title-v12" tabindex="-1">Telegram Capture Companion</h1>
        <p class="telegram-intro">See what Life in Days accepts and how each Telegram outcome reaches your private archive.</p>
        <p class="telegram-boundary">Prototype data · no Telegram connection · no messages sent · no persistence</p>
        <p class="telegram-note">Prototype date · 13 August 2026 · Asia/Kolkata</p>
        ${fixture.kind === "guide" ? "" : `<p class="telegram-status">Selected synthetic state · ${fixture.kind === "authorization" ? "Authorization rejection fixture" : html(fixture.label || fixture.title)}</p>`}
      </header>
      <div class="telegram-input-summary">
        ${captureInputMarkupV12()}
      </div>
      <div class="telegram-layout">
        <div class="telegram-conversation">
          ${fixture.kind === "guide" ? "" : `<div class="telegram-actions"><button type="button" class="primary-button" data-action="capture-run" ${active || !canRun ? 'aria-disabled="true"' : ""}>${active ? "Running selected fixture…" : "Run selected fixture"}</button></div>`}
          ${capturePathMarkupV12()}
        </div>
        <aside class="telegram-side">
          ${captureOutcomeMarkupV12()}
          ${captureGuideMarkupV12()}
        </aside>
      </div>
    </main>`;
}

function renderCaptureFixtureConsoleV12() {
  const fixture = captureSelectedFixtureV12();
  const buttons = (entries, group) => entries.map(([key, label]) => `<button type="button" class="text-button" data-action="capture-select" data-capture-group="${group}" data-capture-key="${key}" aria-pressed="${state.capture.selection.group === group && state.capture.selection.key === key}">${html(label)}</button>`).join("");
  return `<section class="telegram-fixture-group-v12 telegram-console" aria-labelledby="capture-console-title-v12"><h3 id="capture-console-title-v12">Telegram Capture Companion · synthetic states</h3><p>Live-memory-only fixtures. No control calls Telegram, a server, AI, or the network.</p><p class="prototype-data-label-v9">Current capture state · ${html(fixture.label || fixture.title || "Guide")} · ${html(state.capture.stage.replaceAll("-", " "))}<span data-capture-replay-proof-v12>${state.capture.branch === "replay" && state.capture.replayGuarded ? " · Replay ignored · existing represented result unchanged" : ""}</span></p><div class="telegram-console-grid">
    <fieldset class="telegram-fixture-group"><legend>Scenario</legend><div class="telegram-fixture-controls-v12">${buttons(Object.values(CAPTURE_SCENARIOS_V12).map((item) => [item.key, item.label]), "scenario")}</div></fieldset>
    <fieldset class="telegram-fixture-group"><legend>Authorization</legend><div class="telegram-fixture-controls-v12">${buttons(Object.entries(CAPTURE_AUTHORIZATION_FIXTURES_V12), "authorization")}</div></fieldset>
    <fieldset class="telegram-fixture-group"><legend>Media validation</legend><div class="telegram-fixture-controls-v12">${buttons(Object.entries(CAPTURE_MEDIA_FIXTURES_V12).map(([key, item]) => [key, item.label]), "media")}</div></fieldset>
    <fieldset class="telegram-fixture-group"><legend>Caption grammar</legend><div class="telegram-fixture-controls-v12">${buttons(Object.entries(CAPTURE_CAPTION_FIXTURES_V12).map(([key, item]) => [key, item.label]), "caption")}</div></fieldset>
    <fieldset class="telegram-fixture-group"><legend>Operation</legend><div class="telegram-fixture-controls-v12">${Object.entries(CAPTURE_OPERATION_BRANCHES_V12).map(([key, label]) => `<button type="button" class="text-button" data-action="capture-branch" data-capture-branch="${key}" aria-pressed="${state.capture.branch === key}">${html(label)}</button>`).join("")}</div></fieldset>
  </div><div class="telegram-actions"><button type="button" class="secondary-button" data-action="capture-open-selected">Open selected state</button><button type="button" class="text-button" data-action="capture-reset">Reset capture companion</button></div></section>`;
}

function dispatchCaptureV12(type, payload = {}) {
  state.capture = transitionCaptureV12(state.capture, type, payload);
  return state.capture;
}

function announceCaptureV12(message) {
  captureAnnouncementEpochV12 += 1;
  const epoch = captureAnnouncementEpochV12;
  if (!captureStatusLiveV12) return;
  captureStatusLiveV12.setAttribute("aria-live", "polite");
  captureStatusLiveV12.textContent = "";
  requestAnimationFrame(() => {
    if (epoch === captureAnnouncementEpochV12) captureStatusLiveV12.textContent = message;
  });
}

function clearCaptureAnnouncementV12() {
  captureAnnouncementEpochV12 += 1;
  if (!captureStatusLiveV12) return;
  captureStatusLiveV12.setAttribute("aria-live", "polite");
  captureStatusLiveV12.textContent = "";
}

function clearCaptureTimersV12(token = null) {
  for (const [key, entry] of captureTimersV12) {
    if (token && entry.tokenId !== token.id) continue;
    window.clearTimeout(entry.timer);
    captureTimersV12.delete(key);
  }
}

function captureOperationIsCurrentV12(token, { requireConnection = true } = {}) {
  return Boolean(token)
    && state.capture.active?.id === token.id
    && state.capture.generation === token.generation
    && state.capture.fixtureIdentity === token.fixtureIdentity
    && state.capture.selection.group === token.selection.group
    && state.capture.selection.key === token.selection.key
    && state.shell.phase === "ready"
    && state.shell.ops.generation === token.sessionGeneration
    && (!requireConnection || state.shell.connection === "connected");
}

function scheduleCaptureV12(token, label, delay, callback, { requireConnection = true } = {}) {
  const key = `${token.id}:${label}`;
  const timer = window.setTimeout(() => {
    captureTimersV12.delete(key);
    if (!captureOperationIsCurrentV12(token, { requireConnection })) return;
    callback();
  }, delay);
  captureTimersV12.set(key, { timer, tokenId: token.id });
}

function scheduleCaptureContinuationV12(token, label, delay, callback) {
  const key = `${token.id}:continuation:${label}`;
  const timer = window.setTimeout(() => {
    captureTimersV12.delete(key);
    const current = state.capture;
    if (current.generation !== token.generation
      || current.fixtureIdentity !== token.fixtureIdentity
      || current.selection.group !== token.selection.group
      || current.selection.key !== token.selection.key
      || current.active
      || state.view !== "telegram-capture"
      || state.shell.phase !== "ready"
      || state.shell.connection !== "connected"
      || state.shell.ops.generation !== token.sessionGeneration) return;
    callback();
  }, delay);
  captureTimersV12.set(key, { timer, tokenId: token.id });
}

function captureDurableMemberCountV12(identity = state.capture.fixtureIdentity) {
  if (!identity) return 0;
  return [1, 2, 3].filter((member) => captureCommittedIdentitiesV12.has(`${identity}:member-${member}`)).length;
}

function cancelCaptureOperationsV12({ keepTerminal = false, stage = "selected", terminal = null, continuationAttemptAddedNothing = false, retryAvailable = false } = {}) {
  const interruptedTerminal = terminal?.type === "interrupted"
    ? { ...terminal, interruptedAt: terminal.interruptedAt || state.capture.stage }
    : terminal;
  const durableMemberCount = state.capture.active && captureSelectedFixtureV12().key === "t3"
    ? captureDurableMemberCountV12()
    : 0;
  const durableProgress = durableMemberCount
    ? {
      type: "partial",
      stage: "partial",
      albumProgress: durableMemberCount,
      cancelledAfterDurableProgress: true,
      continuationAttemptAddedNothing,
      retryAvailable,
      ...(interruptedTerminal?.interruptedAt ? { interruptedAt: interruptedTerminal.interruptedAt } : {}),
    }
    : null;
  const cancellationTerminal = durableProgress || interruptedTerminal;
  clearCaptureTimersV12();
  dispatchCaptureV12("CANCEL", {
    keepTerminal: keepTerminal || Boolean(cancellationTerminal),
    stage: cancellationTerminal?.stage || stage,
    terminal: cancellationTerminal,
  });
  clearCaptureAnnouncementV12();
}

function resetCaptureReviewSeedV12() {
  cancelDateReviewOperationsV11();
  restoreDateReviewDestinationsV11();
  const branch = state.dateReview?.branch || "success";
  state.dateReview = dateReviewFixtureState("date-review/empty", (state.dateReview?.generation || 0) + 1, branch);
}

function selectCaptureFixtureV12(selection, { open = true, push = false } = {}) {
  const fixture = captureFixtureV12(selection);
  const safeSelection = fixture.kind === "guide" ? { group: "scenario", key: "guide" } : selection;
  cancelCaptureOperationsV12();
  resetCaptureReviewSeedV12();
  restoreCaptureArchiveBaselineV12();
  const fixtureIdentity = fixture.kind === "guide" ? null : crypto.getRandomValues(new Uint32Array(3)).join("-");
  dispatchCaptureV12("SELECT", { selection: safeSelection, fixtureIdentity });
  state.capture.surface = "companion";
  state.capture.reviewHandoffKey = null;
  state.capture.reviewResolved = false;
  state.modal = null;
  if (open && state.view !== "telegram-capture") {
    saveCurrentHistorySnapshot();
    state.scrollByView[state.view] = window.scrollY;
    state.view = "telegram-capture";
    state.screen = "month";
    state.selectedDate = null;
    state.focusAfterRender = fixture.kind === "guide" ? "#capture-selected-title-v12" : "#capture-selected-title-v12";
    syncUrl({ push: true, originAlreadySaved: true, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  } else {
    state.focusAfterRender = "#capture-selected-title-v12";
    syncUrl({ push });
  }
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
}

function seedCaptureReviewItemV12(key) {
  const item = dateReviewItem(key);
  if (!item) return false;
  cancelDateReviewOperationsV11();
  restoreDateReviewDestinationsV11();
  const branch = state.dateReview?.branch || "success";
  const review = dateReviewFixtureState("date-review/final-item", (state.dateReview?.generation || 0) + 1, branch);
  review.unresolved = [key];
  review.fixture = "date-review/final-item";
  state.dateReview = review;
  return true;
}

function attachCaptureGroupProgressV12(fixture, identity, count) {
  if (fixture.key !== "t3") return false;
  let destination = days[fixture.journalDate];
  if (!destination?.captureOnlyV12) {
    destination = captureOnlyDayV12(fixture.journalDate, fixture.photoCaption);
    days[fixture.journalDate] = destination;
  }
  fixture.members.slice(0, count).forEach((member, index) => {
    const memberIdentity = `${identity}:member-${index + 1}`;
    if (captureCommittedIdentitiesV12.has(memberIdentity)) return;
    const id = `daily-photo-v12-${String.fromCharCode(97 + index)}`;
    if (!destination.photos.some((photo) => photo.id === id)) {
      destination.photos.push(capturePhotoV12({ id, src: member.asset, alt: member.alt, caption: member.caption, timestamp: member.messageTime, isCover: index === 0 }));
    }
    captureCommittedIdentitiesV12.add(memberIdentity);
  });
  state.almanacEmptyArchive = false;
  return true;
}

function captureTerminalV12(token, terminal, { focusOutcome = false, announcement = "" } = {}) {
  if (!captureOperationIsCurrentV12(token)) return;
  const normalizedTerminal = captureSelectedFixtureV12().key === "t3"
    ? {
      ...terminal,
      albumProgress: Math.max(
        state.capture.albumProgress,
        captureDurableMemberCountV12(token.identity),
        Number(terminal.albumProgress) || 0,
      ),
    }
    : terminal;
  clearCaptureTimersV12(token);
  dispatchCaptureV12("TERMINAL", { token, terminal: normalizedTerminal });
  state.focusAfterRender = focusOutcome ? "#capture-outcome-title-v12" : '[data-action="capture-run"]';
  render();
  if (focusOutcome && ["authorization-rejected", "media-rejected", "capture-failed", "interrupted", "partial"].includes(normalizedTerminal.type)) {
    revealCaptureFailureOutcomeV12();
  }
  if (announcement) announceCaptureV12(normalizedTerminal.type === "partial"
    ? `${normalizedTerminal.albumProgress} of 3 received photos represented; no complete acknowledgement.`
    : announcement);
}

function completeCaptureOperationV12(token, { retry = false, replay = false } = {}) {
  if (!captureOperationIsCurrentV12(token)) return;
  const fixture = captureSelectedFixtureV12();
  const branch = state.capture.branch;
  if (fixture.kind === "authorization") {
    captureTerminalV12(token, { type: "authorization-rejected", stage: "authorization-rejected" }, { focusOutcome: true, announcement: "Request not accepted before media download." });
    return;
  }
  if (fixture.kind === "media") {
    const result = validateCaptureMediaV12(fixture);
    const terminal = result.accepted
      ? { type: "media-accepted", stage: "media-accepted", message: result.message }
      : { type: "media-rejected", stage: "media-rejected", message: result.message, detail: fixture.key === "malformed" ? "Decode failed first; byte and side-limit failures did not replace the primary rejection." : "" };
    captureTerminalV12(token, terminal, { focusOutcome: !result.accepted, announcement: result.accepted ? `${fixture.format} validation accepted.` : "Photo not added after media validation." });
    return;
  }
  if (fixture.kind === "caption") {
    captureTerminalV12(token, { type: "caption-result", stage: "caption-result", analysis: fixture.analysis }, { announcement: fixture.analysis.review ? "Caption entered Needs Date Review." : "Caption grammar result ready." });
    return;
  }
  if ((branch === "failure" && !retry) || (fixture.key === "t7" && !retry)) {
    if (fixture.key === "t3" && captureDurableMemberCountV12(token.identity)) {
      cancelCaptureOperationsV12({
        stage: "capture-failed",
        terminal: { type: "capture-failed", stage: "capture-failed" },
        continuationAttemptAddedNothing: true,
      });
      state.focusAfterRender = "#capture-outcome-title-v12";
      render();
      revealCaptureFailureOutcomeV12();
      announceCaptureV12("The continuation attempt added nothing. Already represented photos remain unchanged.");
      return;
    }
    captureTerminalV12(token, { type: "capture-failed", stage: "capture-failed" }, { focusOutcome: true, announcement: "Photo not saved. Nothing was added." });
    return;
  }
  if (["t5", "t6"].includes(fixture.key)) {
    let reviewResolved = state.capture.reviewResolved || captureResolvedReviewIdentitiesV12.has(token.identity);
    if (!captureCommittedIdentitiesV12.has(token.identity)) {
      captureCommittedIdentitiesV12.add(token.identity);
      seedCaptureReviewItemV12(fixture.reviewKey);
    } else if (!state.dateReview.unresolved.includes(fixture.reviewKey)) {
      reviewResolved = true;
      captureResolvedReviewIdentitiesV12.add(token.identity);
    }
    captureTerminalV12(token, { type: "captured-review", stage: "captured-review", reviewResolved }, { announcement: reviewResolved ? "The represented review item is already resolved." : "Photo entered Needs Date Review." });
    return;
  }
  const wasCommitted = captureCommittedIdentitiesV12.has(token.identity);
  if (fixture.key === "t3") {
    attachCaptureGroupProgressV12(fixture, token.identity, 3);
    captureCommittedIdentitiesV12.add(token.identity);
  } else attachCaptureResultV12(fixture, token.identity);
  captureTerminalV12(token, { type: "captured-valid", stage: "captured-valid", albumProgress: fixture.key === "t3" ? 3 : 0 }, {
    announcement: wasCommitted || replay ? "The represented terminal result is unchanged." : fixture.key === "t3" ? "3 received photos saved to 9 August 2026." : `Photo saved to ${captureLongDateV12(fixture.journalDate)}.`,
  });
  if (branch === "replay" && !replay && !wasCommitted) {
    scheduleCaptureContinuationV12(token, "replay", 220, () => {
      if (!captureCommittedIdentitiesV12.has(token.identity) || state.capture.terminal?.type !== "captured-valid") return;
      dispatchCaptureV12("REPLAY_GUARDED", { fixtureIdentity: token.fixtureIdentity });
      const proof = root.querySelector("[data-capture-replay-proof-v12]");
      if (proof) proof.textContent = " · Replay ignored · existing represented result unchanged";
    });
  }
}

function beginCaptureOperationV12({ retry = false, replay = false } = {}) {
  const fixture = captureSelectedFixtureV12();
  if (fixture.kind === "guide"
    || state.capture.active
    || (state.capture.fixtureIdentity && captureCommittedIdentitiesV12.has(state.capture.fixtureIdentity))
    || state.shell.connection !== "connected"
    || state.shell.phase !== "ready") return;
  const token = Object.freeze({
    id: ++captureOperationSequenceV12,
    identity: state.capture.fixtureIdentity,
    fixtureIdentity: state.capture.fixtureIdentity,
    generation: state.capture.generation,
    selection: { ...state.capture.selection },
    attempt: state.capture.attempt + 1,
    sessionGeneration: state.shell.ops.generation,
    intended: retry ? "retry-success" : state.capture.branch,
  });
  const durableAlbumProgress = fixture.key === "t3" ? captureDurableMemberCountV12(token.identity) : 0;
  const durablePartialTerminal = durableAlbumProgress
    ? { type: "partial", stage: "partial", albumProgress: durableAlbumProgress, continuingAfterDurableProgress: true }
    : null;
  dispatchCaptureV12("START", {
    token,
    albumProgress: durableAlbumProgress,
    terminal: durablePartialTerminal,
    reviewResolved: captureResolvedReviewIdentitiesV12.has(token.identity) || state.capture.reviewResolved,
  });
  state.focusAfterRender = '[data-action="capture-run"]';
  render();
  announceCaptureV12("Synthetic message received.");

  const stage = (name, announcement) => {
    if (!captureOperationIsCurrentV12(token)) return;
    dispatchCaptureV12("STAGE", { token, stage: name });
    state.focusAfterRender = '[data-action="capture-run"]';
    render();
    if (announcement) announceCaptureV12(announcement);
  };
  scheduleCaptureV12(token, "authorize", 220, () => stage("authorizing", "Authorization check represented."));
  if (fixture.kind === "authorization") {
    scheduleCaptureV12(token, "terminal", 540, () => completeCaptureOperationV12(token, { retry, replay }));
    return;
  }
  scheduleCaptureV12(token, "validate", 500, () => stage("validating", "Authorized private chat represented. Media validation in progress."));
  if (["media", "caption"].includes(fixture.kind)) {
    scheduleCaptureV12(token, "terminal", 840, () => completeCaptureOperationV12(token, { retry, replay }));
    return;
  }
  scheduleCaptureV12(token, "waiting", 760, () => stage("waiting", "Waiting for durable capture…"));

  const branch = state.capture.branch;
  if (fixture.key === "t3" && ["success", "replay", "rapid-repeat", "partial-media-group"].includes(branch)) {
    const targetMembers = branch === "partial-media-group" && !retry ? [1, 2] : [1, 2, 3];
    const missingMembers = targetMembers.filter((member) => !captureCommittedIdentitiesV12.has(`${token.identity}:member-${member}`));
    missingMembers.forEach((count, index) => scheduleCaptureV12(token, `member-${count}`, 930 + index * 210, () => {
      attachCaptureGroupProgressV12(fixture, token.identity, count);
      const representedCount = captureDurableMemberCountV12(token.identity);
      dispatchCaptureV12("ALBUM_PROGRESS", { token, count: representedCount });
      state.focusAfterRender = '[data-action="capture-run"]';
      render();
      announceCaptureV12(`${representedCount} of 3 received photos represented.`);
    }));
  }

  if (branch === "rapid-repeat") beginCaptureOperationV12({ retry, replay });
  if (branch === "navigate-before-completion") {
    scheduleCaptureV12(token, "navigate", 940, () => {
      cancelCaptureOperationsV12();
      setView("calendar");
    });
    return;
  }
  if (branch === "reset-before-completion") {
    scheduleCaptureV12(token, "reset", 940, () => selectCaptureFixtureV12(token.selection, { open: true }));
    return;
  }
  if (branch === "connection-interruption" && token.intended !== "retry-success") {
    scheduleCaptureV12(token, "connection", 940, () => {
      cancelCaptureOperationsV12({
        stage: "interrupted",
        terminal: { type: "interrupted", stage: "interrupted" },
        continuationAttemptAddedNothing: true,
        retryAvailable: true,
      });
      dispatchShell("CONNECTION_INTERRUPT");
      state.focusAfterRender = "#capture-outcome-title-v12";
      render();
      revealCaptureFailureOutcomeV12();
      announceCaptureV12("Capture result unavailable after connection interruption.");
    });
    return;
  }
  if (branch === "session-interruption") {
    scheduleCaptureV12(token, "session", 940, () => expireShellSessionV10());
    return;
  }
  if (branch === "partial-media-group" && fixture.key === "t3" && !retry) {
    scheduleCaptureV12(token, "partial", 1360, () => captureTerminalV12(token, { type: "partial", stage: "partial", albumProgress: 2 }, { focusOutcome: true, announcement: "2 of 3 received photos represented; no complete acknowledgement." }));
    return;
  }
  scheduleCaptureV12(token, "complete", fixture.key === "t3" ? 1660 : 1380, () => completeCaptureOperationV12(token, { retry, replay }));
}

function invalidateNavigationFocusV12() {
  navigationFocusEpochV12 += 1;
  pendingNavigationFocusV12 = null;
}

function reinforceNavigationFocusV12(selector, expectedView, expectedSurface = null) {
  const focusEpoch = ++navigationFocusEpochV12;
  const expectedEntryId = window.history.state?.entryId;
  pendingNavigationFocusV12 = { epoch: focusEpoch, selector };
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (navigationFocusEpochV12 !== focusEpoch) return;
    pendingNavigationFocusV12 = null;
    if (state.view !== expectedView || window.history.state?.entryId !== expectedEntryId) return;
    if (expectedSurface && state.capture.surface !== expectedSurface) return;
    const target = resolveLogicalSelector(selector);
    if (!target?.isConnected) return;
    const active = document.activeElement;
    const focusIsUnclaimed = !active
      || active === document.body
      || active === document.documentElement
      || active === root
      || active === target;
    if (!focusIsUnclaimed) return;
    target.focus({ preventScroll: true });
  }));
}

function openCaptureCompanionV12(originControl = null) {
  if (state.view === "telegram-capture") {
    cancelCaptureOperationsV12({ keepTerminal: !state.capture.active, stage: state.capture.active ? "selected" : state.capture.stage });
    dispatchCaptureV12("SURFACE", { surface: "companion" });
    // The guarded reinforcement below supplies the H1 only while focus remains
    // unclaimed, so an immediate user Tab is not undone by the render frame.
    state.focusAfterRender = null;
    render();
    withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
    const captureTitle = resolveLogicalSelector("#capture-title-v12");
    state.scrollByView["telegram-capture"] = window.scrollY;
    saveCurrentHistorySnapshot({
      scrollY: window.scrollY,
      focusSelector: "#capture-title-v12",
      focusTop: captureTitle?.getBoundingClientRect?.().top ?? null,
    });
    reinforceNavigationFocusV12("#capture-title-v12", "telegram-capture", "companion");
    return;
  }
  const originSelector = selectorForLogicalFocus(originControl) || '[data-action="open-capture-companion"]';
  saveCurrentHistorySnapshot({ scrollY: window.scrollY, focusSelector: originSelector, focusTop: originControl?.getBoundingClientRect?.().top ?? null });
  state.viewMemory[state.view] = captureViewMemory(state.view);
  state.scrollByView[state.view] = window.scrollY;
  state.modal = null;
  state.view = "telegram-capture";
  state.screen = "month";
  state.selectedDate = null;
  dispatchCaptureV12("SURFACE", { surface: "companion" });
  state.focusAfterRender = "#capture-title-v12";
  syncUrl({ push: true, originAlreadySaved: true, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  reinforceNavigationFocusV12("#capture-title-v12", "telegram-capture", "companion");
}

function captureBackV12() {
  cancelCaptureOperationsV12({ keepTerminal: !state.capture.active, stage: state.capture.active ? "selected" : state.capture.stage });
  if (currentHistoryPosition > 0) {
    window.history.back();
    return;
  }
  state.view = "settings";
  state.settingsSection = "integrations";
  state.focusAfterRender = '[data-action="open-capture-companion"]';
  syncUrl();
  render();
}

function openCaptureChangeDateV12(control) {
  const fixture = captureSelectedFixtureV12();
  if (state.capture.terminal?.type !== "captured-valid" || !fixture.actions?.includes("change-date")) return;
  cancelCaptureOperationsV12({ keepTerminal: true, stage: state.capture.stage });
  const originSelector = '[data-action="capture-change-date"]';
  saveCurrentHistorySnapshot({ scrollY: window.scrollY, focusSelector: originSelector, focusTop: control?.getBoundingClientRect?.().top ?? null });
  dispatchCaptureV12("SURFACE", { surface: "change-date" });
  state.focusAfterRender = "#capture-change-title-v12";
  syncUrl({ push: true, originAlreadySaved: true, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  reinforceNavigationFocusV12("#capture-change-title-v12", "telegram-capture", "change-date");
}

function viewCaptureDayV12(control) {
  const fixture = captureSelectedFixtureV12();
  const date = fixture.journalDate;
  if (state.capture.terminal?.type !== "captured-valid" || !fixture.actions?.includes("view-day") || !days[date]) return;
  cancelCaptureOperationsV12({ keepTerminal: true, stage: state.capture.stage });
  const originSelector = '[data-action="capture-view-day"]';
  saveCurrentHistorySnapshot({ scrollY: window.scrollY, focusSelector: originSelector, focusTop: control?.getBoundingClientRect?.().top ?? null });
  state.viewMemory["telegram-capture"] = captureViewMemory("telegram-capture");
  state.view = "calendar";
  state.month = date.slice(0, 7);
  state.calendarMonth = state.month;
  state.selectedDate = date;
  state.focusDate = date;
  state.screen = "day";
  state.focusAfterRender = "#journal-day-title-v12";
  syncUrl({ push: true, originAlreadySaved: true, fullDayOpenedInApp: true, captureDayDate: date, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  reinforceNavigationFocusV12("#journal-day-title-v12", "calendar");
}

function openCaptureReviewDateV12(control) {
  const fixture = captureSelectedFixtureV12();
  const identity = state.capture.fixtureIdentity;
  if (state.capture.terminal?.type !== "captured-review"
    || state.capture.reviewResolved
    || captureResolvedReviewIdentitiesV12.has(identity)
    || !fixture.reviewKey) return;
  if (!state.dateReview.unresolved.includes(fixture.reviewKey)) {
    if (captureCommittedIdentitiesV12.has(identity)) {
      captureResolvedReviewIdentitiesV12.add(identity);
      dispatchCaptureV12("REVIEW_RESOLVED");
      render();
    }
    return;
  }
  cancelCaptureOperationsV12({ keepTerminal: true, stage: state.capture.stage });
  const originSelector = '[data-action="capture-review-date"]';
  saveCurrentHistorySnapshot({ scrollY: window.scrollY, focusSelector: originSelector, focusTop: control?.getBoundingClientRect?.().top ?? null });
  state.viewMemory["telegram-capture"] = captureViewMemory("telegram-capture");
  dispatchCaptureV12("REVIEW_HANDOFF", { key: fixture.reviewKey });
  state.view = "date-review";
  state.screen = "month";
  state.selectedDate = null;
  dispatchDateReview("DETAIL_OPEN", { key: fixture.reviewKey });
  state.focusAfterRender = "#date-review-detail-title-v11";
  syncUrl({ push: true, originAlreadySaved: true, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  reinforceNavigationFocusV12("#date-review-detail-title-v11", "date-review");
}

function renderShellActionV10(action, label, { disabled = false, className = "secondary-button" } = {}) {
  return `<button type="button" class="${className} shell-status-action-v10" data-action="${action}" ${disabled ? 'aria-disabled="true"' : ""}>${label}</button>`;
}

function renderShellStatusBarV10() {
  const shell = state.shell;
  if (shell.connection === "interrupted" || shell.connection === "checking") {
    const checking = shell.connection === "checking";
    return `
      <aside class="shell-status-bar-v10 is-connection" data-state="connection" role="region" aria-labelledby="connection-title-v10">
        <div class="shell-status-copy-v10">
          <strong id="connection-title-v10">Connection interrupted</strong>
          <p>What is already visible can be read, but it may be out of date. Changes cannot be saved until the connection returns.</p>
          ${shell.connectionMessage ? `<small>${html(shell.connectionMessage)}</small>` : ""}
        </div>
        ${renderShellActionV10("check-shell-connection", checking ? "Checking connection…" : "Check connection", { disabled: checking })}
      </aside>`;
  }
  if (shell.server.settled && ["failed", "pending"].includes(shell.server.status)) {
    const pending = shell.server.status === "pending";
    return `
      <aside class="shell-status-bar-v10 is-server" data-state="server" role="region" aria-labelledby="server-strip-title-v10">
        <div class="shell-status-copy-v10"><strong id="server-strip-title-v10">Life in Days could not complete this request.</strong><p>The result was not confirmed. What is already open remains unchanged in this page.</p></div>
        ${renderShellActionV10("retry-shell-server", pending ? "Trying again…" : "Try again", { disabled: pending })}
      </aside>`;
  }
  const monthRequest = shell.pendingMonth;
  if (monthRequest?.status === "pending") {
    return `<aside class="shell-status-bar-v10 is-month" data-state="pending" role="region" aria-label="Month request"><div class="shell-status-copy-v10"><strong>Loading ${html(monthLabel(monthRequest.target))}…</strong><p>The verified month remains unchanged until this request succeeds.</p></div></aside>`;
  }
  if (monthRequest?.status === "failed") {
    return `
      <aside class="shell-status-bar-v10 is-month" data-state="server" role="region" aria-labelledby="month-failure-title-v10">
        <div class="shell-status-copy-v10"><strong id="month-failure-title-v10">${html(monthLabel(monthRequest.target))} could not be loaded.</strong><p>${html(monthLabel(monthRequest.origin).replace(/\s+\d{4}$/, ""))} remains shown and unchanged.</p></div>
        ${renderShellActionV10("retry-shell-month", `Retry loading ${monthLabel(monthRequest.target).replace(/\s+\d{4}$/, "")}`)}
      </aside>`;
  }
  if (shell.connectionMessage) {
    return `<aside id="connection-restored-v10" class="shell-status-bar-v10 is-restored" data-state="restored" role="region" aria-label="Connection restored" tabindex="-1"><div class="shell-status-copy-v10"><strong>Connection restored</strong><p>${html(shell.connectionMessage)}</p></div></aside>`;
  }
  return "";
}

function renderAppLoadingV10() {
  const skeletons = Array.from({ length: 14 }, () => '<span class="skeleton-tile-v10"></span>').join("");
  return `
    <main id="prototype-main" class="archive-loading-v10" tabindex="-1" aria-busy="true" aria-labelledby="app-loading-title-v10">
      <header><p class="eyebrow">Private archive</p><h1 id="app-loading-title-v10" tabindex="-1">Loading your archive…</h1><p>Waiting for the server. No new archive content is shown until this request finishes.</p></header>
      <div class="calendar-skeleton-v10" aria-hidden="true">${skeletons}</div>
    </main>`;
}

function renderMonthLoadingV10() {
  const target = state.shell.pendingMonth?.target || "2026-09";
  const skeletons = Array.from({ length: 35 }, () => '<span class="skeleton-tile-v10"></span>').join("");
  return `
    <main id="prototype-main" class="archive-loading-v10 month-state-v10" tabindex="-1" aria-busy="true" aria-labelledby="month-loading-title-v10">
      <header><p class="eyebrow">Monday first · Asia/Kolkata</p><h1 id="month-loading-title-v10" tabindex="-1">${html(monthLabel(target))}</h1><p>Loading ${html(monthLabel(target))}…</p></header>
      <div class="calendar-skeleton-v10" role="grid" aria-label="Loading calendar" aria-hidden="true">${skeletons}</div>
    </main>`;
}

function renderTotalServerFailureV10() {
  if (state.shell.server.status === "pending" || state.shell.phase === "server-retrying") return renderAppLoadingV10();
  return `
    <main id="prototype-main" class="server-state-v10" tabindex="-1" aria-labelledby="server-failure-title-v10">
      <header><p class="eyebrow">Private archive</p><h1 id="server-failure-title-v10" tabindex="-1">Life in Days is temporarily unavailable</h1><p>Archive data could not be loaded from the server. No change was submitted. The shell remains available, but archive content is not shown as current.</p></header>
      ${renderShellActionV10("retry-shell-server", "Retry loading archive", { className: "primary-button" })}
      <details class="sanitized-details-v10"><summary>Show sanitized details</summary><dl><div><dt>Error class</dt><dd>Temporary server failure</dd></div><div><dt>Operation</dt><dd>Load archive</dd></div><div><dt>Personal content</dt><dd>Not included</dd></div></dl></details>
    </main>`;
}

function renderShellFixtureLabV10() {
  const mediaFixtureState = state.shell.media[SHELL_MEDIA_ITEM.photoId]?.status;
  const effectiveState = state.shell.phase === "app-loading" || state.shell.phase === "server-retrying"
    ? "Loading archive"
    : state.shell.phase === "server-failure"
      ? "Server unavailable"
      : state.shell.server.settled && state.shell.server.status === "pending"
    ? "Settled request retrying"
    : state.shell.server.settled && state.shell.server.status === "failed"
      ? "Settled request failed"
      : state.shell.pendingMonth?.status === "pending"
        ? `Loading ${monthLabel(state.shell.pendingMonth.target)}`
        : state.shell.pendingMonth?.status === "failed"
          ? `${monthLabel(state.shell.pendingMonth.target)} unavailable`
          : state.shell.connection === "checking"
            ? "Checking connection"
            : state.shell.connection === "interrupted"
              ? "Connection interrupted"
              : state.shell.connectionMessage
                ? "Connection restored"
                : state.shell.correction.status === "saving"
                  ? "Saving Correction"
                  : state.shell.correction.status === "failed"
                    ? "Correction not saved"
                    : state.shell.correction.status === "saved"
                      ? "Correction save represented"
                      : mediaFixtureState === "pending"
                        ? "Retrying image"
                        : state.shell.fixture === "shell/media-failure" && mediaFixtureState === "available"
                          ? "Image available"
                          : state.shell.fixture === "shell/media-failure"
                            ? "Image unavailable"
                            : state.shell.fixture === "shell/month-failure" && !state.shell.pendingMonth
                              ? `${monthLabel(state.month)} shown`
                              : state.shell.fixture === "shell/server-failure" && state.shell.server.status === "idle"
                                ? "Archive available"
                                : state.shell.phase === "ready"
                                  ? "Ready"
                                  : SHELL_FIXTURES[state.shell.fixture];
  const fixtureButtons = Object.entries(SHELL_FIXTURES).map(([key, label]) => `
    <button type="button" class="text-button" data-action="set-shell-fixture" data-fixture="${key}" aria-pressed="${state.shell.fixture === key}">${label}</button>`).join("");
  const branchButtons = [
    ["success", "Success next"],
    ["repeat-failure", "Failure next"],
    ["rapid-repeat", "Rapid repeat"],
    ["navigate-before-completion", "Navigate before completion"],
  ].map(([branch, label]) => `<button type="button" class="text-button" data-action="set-shell-branch" data-branch="${branch}" aria-pressed="${state.shell.branch === branch}">${label}</button>`).join("");
  const dateReviewFixtureButtons = Object.entries(DATE_REVIEW_FIXTURES).map(([key, label]) => `
    <button type="button" class="text-button" data-action="set-date-review-fixture" data-fixture="${key}" aria-pressed="${state.dateReview.fixture === key}">${label}</button>`).join("");
  const dateReviewBranchButtons = Object.entries(DATE_REVIEW_BRANCHES).map(([branch, label]) => `
    <button type="button" class="text-button" data-action="set-date-review-branch" data-branch="${branch}" aria-pressed="${state.dateReview.branch === branch}">${label}</button>`).join("");
  const reviewState = state.dateReview.status === "loading" ? "Loading"
    : state.dateReview.status === "failed" ? "Load failure"
      : `${state.dateReview.unresolved.length} unresolved${state.dateReview.assignment.status !== "idle" ? ` · ${state.dateReview.assignment.status}` : ""}`;
  return `
    <details class="shell-fixture-lab-v10" ${state.shellLabOpen ? "open" : ""}>
      <summary data-action="toggle-shell-lab">Prototype states</summary>
      <div class="shell-fixture-lab-body-v10">
        <p>In-memory interruption fixtures. Reload returns to the frozen first-use Calendar; no state enters URL, history, or storage.</p>
        <p class="prototype-data-label-v9">Current state · ${html(effectiveState)}</p>
        <fieldset><legend>State</legend><div class="shell-fixture-controls-v10">${fixtureButtons}</div></fieldset>
        <fieldset><legend>Guided branch</legend><div class="shell-fixture-controls-v10">${branchButtons}</div></fieldset>
        <div class="inline-actions shell-fixture-controls-v10">
          <button type="button" class="secondary-button" data-action="run-shell-scenario">Run current branch</button>
          <button type="button" class="text-button" data-action="toggle-shell-connection">Toggle connection collision</button>
          <button type="button" class="text-button" data-action="toggle-shell-server-variant">Toggle empty or settled server failure</button>
          <button type="button" class="text-button" data-action="expire-shell-session">End session</button>
        </div>
        <section class="date-review-fixture-group-v11" aria-labelledby="date-review-fixture-title-v11">
          <h3 id="date-review-fixture-title-v11">Needs Date Review · synthetic states</h3>
          <p>Live-memory-only Product fixtures. Public fixture keys do not enter the URL, history payload, or storage.</p>
          <p class="prototype-data-label-v9">Current date-review state · ${html(reviewState)}</p>
          <fieldset><legend>Queue state</legend><div class="shell-fixture-controls-v10">${dateReviewFixtureButtons}</div></fieldset>
          <fieldset><legend>Assignment branch</legend><div class="shell-fixture-controls-v10">${dateReviewBranchButtons}</div></fieldset>
          <fieldset><legend>Open exact Product item</legend><div class="shell-fixture-controls-v10">
            ${["Telegram invalid date", "Telegram future date", "VoiceNotes missing timestamp", "VoiceNotes untrusted value"].map((label, index) => `<button type="button" class="text-button" data-action="open-date-review-guided-item" data-review-index="${index}">${label}</button>`).join("")}
          </div></fieldset>
          <button type="button" class="secondary-button" data-action="run-date-review-scenario">Run assignment branch</button>
        </section>
        ${renderCaptureFixtureConsoleV12()}
      </div>
    </details>`;
}

function renderSessionGateV10() {
  const reauth = state.shell.phase === "reauth";
  const title = reauth ? "Reauthentication represented" : "Your session has ended";
  return `
    <main id="prototype-main" class="session-gate-v10" tabindex="-1">
      <section class="session-gate-panel-v10" role="dialog" aria-modal="true" aria-labelledby="session-gate-title-v10" aria-describedby="session-gate-copy-v10" tabindex="-1" data-session-gate-v10>
        <p class="eyebrow">Private archive</p>
        <h1 id="session-gate-title-v10" tabindex="-1">${title}</h1>
        ${reauth
          ? '<p id="session-gate-copy-v10">The production service would return through Cloudflare Access. This prototype has not verified an account, MFA, assertion, or session.</p>'
          : '<p id="session-gate-copy-v10">Life in Days remains private. Your archive has not been deleted. Reauthenticate to continue.</p>'}
        ${!reauth && state.shell.sessionHadDraft ? '<p class="surface-state-row-v10">An unsaved Correction cannot be carried through reauthentication and will be discarded when you continue.</p>' : ""}
        <p class="reauth-boundary-v10">Prototype state · No authentication occurs here.</p>
        <button type="button" class="primary-button" data-action="${reauth ? "return-from-shell-reauth" : "start-shell-reauth"}">${reauth ? "Return to Life in Days" : "Reauthenticate"}</button>
      </section>
    </main>`;
}

function renderUnifiedApp() {
  if (["session-expired", "reauth"].includes(state.shell.phase)) {
    return `<div class="prototype-app unified-v9 unified-v10 unified-v11 is-session-gated">${prototypeBanner()}${renderSessionGateV10()}</div>`;
  }
  const content = state.view === "calendar"
    ? renderMosaicView()
    : state.view === "almanac"
      ? renderAlmanacView()
      : state.view === "search"
        ? renderSearchView()
        : state.view === "date-review"
          ? renderDateReviewView()
          : state.view === "telegram-capture"
            ? renderCaptureCompanionV12()
            : renderSettingsView();
  const shellContent = state.shell.phase === "app-loading"
    ? renderAppLoadingV10()
    : ["server-failure", "server-retrying"].includes(state.shell.phase) && !state.shell.server.settled
      ? renderTotalServerFailureV10()
      : state.shell.pendingMonth?.status === "pending"
        ? renderMonthLoadingV10()
        : content;
  const totalShellOwnsSurface = state.shell.phase === "app-loading"
    || (["server-failure", "server-retrying"].includes(state.shell.phase) && !state.shell.server.settled);
  const monthCollision = state.shell.pendingMonth?.status === "failed" && state.shell.connection !== "connected"
    ? `<aside class="surface-state-row-v10 month-state-v10">${html(monthLabel(state.shell.pendingMonth.target))} could not be loaded. ${html(monthLabel(state.shell.pendingMonth.origin).replace(/\s+\d{4}$/, ""))} remains shown and unchanged.</aside>`
    : "";
  return `
    <div class="prototype-app unified-v9 unified-v10 unified-v11 unified-v12 view-${state.view}">
      ${prototypeBanner()}
      ${state.view === "telegram-capture" ? "" : unifiedTopbar()}
      ${totalShellOwnsSurface ? "" : renderShellStatusBarV10()}
      ${monthCollision}
      ${shellContent}
      ${state.view === "telegram-capture" ? "" : compactNavigation()}
      ${renderShellFixtureLabV10()}
    </div>`;
}

function gallery(day) {
  const currentIndex = Math.min(state.galleryIndex[day.date] || 0, Math.max(day.photos.length - 1, 0));
  const currentPhoto = day.photos[currentIndex];
  const currentPhotoUnavailable = mediaUnavailable(currentPhoto);
  const currentPhotoPending = mediaStateForPhoto(currentPhoto)?.status === "pending";
  const canRetryCurrentPhoto = state.shell.connection === "connected";
  const artwork = activeArtwork(day);

  return `
    <section class="day-section gallery-section" aria-labelledby="gallery-title-${day.date}">
      <div class="section-heading">
        <div><p class="eyebrow">Authentic media</p><h2 id="gallery-title-${day.date}" tabindex="-1">Daily Photos</h2></div>
        <p class="source-boundary">Real photos never go to AI · <button type="button" data-action="open-settings" data-section="ai" aria-label="Review what Life in Days sends to AI providers">AI & privacy</button></p>
      </div>
      ${currentPhoto && !currentPhotoUnavailable ? `
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
        </details>` : currentPhotoUnavailable ? `
          <div class="gallery-empty gallery-failed media-state-v10">
            <span aria-hidden="true">${dateParts(day.date).day}</span>
            <h3>Image unavailable</h3>
            <p>This image could not be loaded. The photo record and authentic journals remain available; this prototype does not verify the Original.</p>
            <p class="quiet-label">Photo ${currentIndex + 1} of ${day.photos.length} · identity and order unchanged</p>
            ${canRetryCurrentPhoto ? `<button type="button" class="secondary-button" data-action="retry-shell-image" data-date="${day.date}" data-photo-id="${html(currentPhoto.id)}" ${currentPhotoPending ? 'aria-disabled="true"' : ""}>${currentPhotoPending ? "Retrying image…" : "Retry image"}</button>` : '<small>Restore the connection before retrying this image.</small>'}
          </div>` : day.imageFailed ? `
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
        ${day.journals.map((journal) => {
          const representedText = state.shell.representedCorrections[`${day.date}:${journal.id}`];
          const representedCorrection = representedText != null;
          const displayedText = representedCorrection ? representedText : journal.text;
          return `
          <article class="journal-card" id="journal-${html(journal.id)}" tabindex="-1">
            <header>
              <div><span class="badge badge-source">${html(journal.kind)}</span>${journal.correction || representedCorrection ? `<span class="badge badge-correction">${representedCorrection ? "Correction displayed · prototype only" : "Correction displayed"}</span>` : ""}<h3>${html(journal.title)}</h3></div>
              <button type="button" class="icon-button" data-action="journal-menu" aria-label="Manage ${html(journal.title)}">•••</button>
            </header>
            <p class="journal-text">${html(displayedText)}</p>
            <footer><span>Original Timestamp · ${html(journal.timestamp)}</span><span>${html(journal.status)}</span></footer>
            <div class="journal-actions"><button type="button" class="text-button" data-action="correct-text" data-date="${day.date}" data-journal-id="${html(journal.id)}">Correct displayed text</button><button type="button" class="text-button" data-action="change-date" data-date="${day.date}">Change Journal Date</button><button type="button" class="text-button" data-action="view-provenance">Revisions & provenance</button></div>
          </article>`;
        }).join("")}
      </div>
    </section>`;
}

function dayDetail(day, mode) {
  const previous = adjacentPopulatedDate(day.date, -1);
  const next = adjacentPopulatedDate(day.date, 1);
  const counts = dayCounts(day);
  const isCaptureDayHandoffV12 = mode === "mosaic"
    && captureDayHistoryTargetsV12.get(window.history.state?.entryId) === day.date;
  const operationalAttention = day.attention && (day.conflict || day.summaryStatus !== "Stale") ? day.attention : null;
  const hasAlmanacOrigin = mode === "almanac" && Boolean(currentHistorySnapshot()?.fullDayOpenedInApp);
  const backLabel = mode === "almanac" && hasAlmanacOrigin ? "Back to Almanac" : mode === "almanac" ? "Back to Calendar" : `Back to ${monthLabel(state.month)}`;
  return `
    <div class="day-detail day-detail--${mode}">
      <header class="day-detail-header">
        <button type="button" class="back-button" data-action="close-day"><span aria-hidden="true">←</span> ${backLabel}</button>
        <div class="day-date-row ${mode === "mosaic" ? "day-date-row--compact" : ""}">
          <div${isCaptureDayHandoffV12 ? ' style="display: block"' : ""}><p class="eyebrow">Journal Day · Asia/Kolkata</p><h1 id="journal-day-title-v12" tabindex="-1">${longDate(day.date)}</h1><p>${counts.label}</p></div>
          <div class="adjacent-days" aria-label="Adjacent populated Journal Days">
            <button type="button" class="icon-button" data-action="adjacent-day" data-date="${previous || ""}" aria-label="Previous populated Journal Day" ${previous ? "" : "disabled"}>←</button>
            <button type="button" class="icon-button" data-action="adjacent-day" data-date="${next || ""}" aria-label="Next populated Journal Day" ${next ? "" : "disabled"}>→</button>
          </div>
        </div>
        ${operationalAttention ? `<a class="attention-banner" href="#sources-title-${day.date}"><span aria-hidden="true">!</span><span><strong>${html(operationalAttention)}</strong><small>Authentic sources are unchanged.</small></span><span aria-hidden="true">→</span></a>` : ""}
      </header>
      <div class="day-detail-body">
        ${gallery(day)}
        ${day.captureOnlyV12 ? "" : generatedReflection(day, mode)}
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
  const isDuplicate = modal.stage === "review"
    && !isFirstUseFixture()
    && Object.values(days).some((day) => day.journals?.some((journal) => journal.text === modal.text));
  const isSaving = modal.stage === "saving";
  return `
    <div class="modal-backdrop" data-action="modal-backdrop">
      <section class="modal-card upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title" tabindex="-1" data-modal-card ${isSaving ? 'aria-busy="true"' : ""}>
        <header><div><p class="eyebrow">Manual capture</p><h2 id="upload-modal-title" tabindex="-1">Upload a journal</h2></div>${isSaving ? '<span class="settings-state is-neutral">Saving</span>' : '<button type="button" class="icon-button" data-action="close-modal" aria-label="Close upload dialog">×</button>'}</header>
        ${modal.stage === "choose" ? `
          <div class="upload-fields">
            <label>Journal Date <input id="upload-date" type="date" value="${date}" max="${today}" data-action="upload-date" /></label>
            <p class="field-help">Day boundaries always use Asia/Kolkata. Historical backdating is allowed; future dates are not.</p>
            <label class="file-drop" for="journal-file"><span aria-hidden="true">⇧</span><strong>Choose one .txt or .md file</strong><small>UTF-8 · up to 1 MiB · no Word, PDF, or photo files</small><input id="journal-file" type="file" accept=".txt,.md,text/plain,text/markdown" data-action="journal-file" /></label>
            ${modal.error ? `<p class="form-error" role="alert">${html(modal.error)}</p>` : ""}
            <aside class="local-only-note"><span aria-hidden="true">◈</span><p>This prototype reads the file only in this browser tab and keeps it in memory. It makes no upload or network request.</p></aside>
          </div>` : modal.stage === "review" ? `
          <div class="upload-review">
            <h3 id="upload-review-title-v9" tabindex="-1">Review journal</h3>
            <dl><div><dt>File</dt><dd>${html(modal.fileName)}</dd></div><div><dt>Size</dt><dd>${Math.max(1, Math.round(modal.fileSize / 1024))} KiB</dd></div><div><dt>Journal Date</dt><dd>${longDate(date)} · Asia/Kolkata</dd></div><div><dt>Source</dt><dd>Uploaded journal</dd></div></dl>
            <div class="text-preview"><strong>Inert text preview</strong><pre>${html(modal.text.slice(0, 1800))}</pre>${modal.text.length > 1800 ? '<small>Preview shortened; the in-memory fixture keeps the complete text.</small>' : ""}</div>
            ${isDuplicate ? '<div class="duplicate-warning" role="alert"><strong>This exact text is already present.</strong><p>Cancel, or explicitly add the duplicate anyway.</p></div>' : ""}
            <div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancel</button><button type="button" class="primary-button" data-action="confirm-upload" data-force="${isDuplicate ? "true" : "false"}">${isDuplicate ? "Add duplicate anyway" : "Add journal"}</button></div>
          </div>` : `
          <div class="saving-state" role="status"><span class="generation-orbit" aria-hidden="true"></span><h3 id="upload-saving-title-v9" tabindex="-1">Adding journal</h3><p>Adding this journal to the temporary prototype…</p></div>`}
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
    <div class="modal-backdrop almanac-drawer-backdrop-v9" data-action="modal-backdrop">
      <aside class="almanac-mobile-drawer-v9" role="dialog" aria-modal="true" aria-labelledby="almanac-drawer-title-v9" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Chronological navigation</p><h2 id="almanac-drawer-title-v9" tabindex="-1">Almanac index</h2></div><button type="button" class="secondary-button" data-action="close-modal">Close</button></header>
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
    <div class="modal-backdrop month-chooser-backdrop almanac-jump-backdrop-v9" data-action="modal-backdrop">
      <section class="modal-card month-chooser-dialog almanac-jump-dialog-v9" role="dialog" aria-modal="true" aria-labelledby="almanac-jump-title-v9" aria-describedby="almanac-jump-description-v9" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Almanac navigation</p><h2 id="almanac-jump-title-v9">Jump to a month in the Almanac</h2><p id="almanac-jump-description-v9">Moves to the first live Journal Day in that month. Journal Dates use Asia/Kolkata.</p></div><button type="button" class="icon-button" data-action="close-modal" aria-label="Close Almanac month chooser">×</button></header>
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
  const reviewCount = dateReviewCount();
  return `
    <div class="modal-backdrop more-backdrop" data-action="modal-backdrop">
      <aside class="more-sheet" role="dialog" aria-modal="true" aria-labelledby="more-sheet-title" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Life in Days</p><h2 id="more-sheet-title">More</h2></div><button type="button" class="secondary-button" data-action="close-modal">Close</button></header>
        <nav aria-label="More actions">
          <button type="button" data-action="open-upload"><strong>Add journal</strong><small>Upload a .txt or .md file</small></button>
          ${reviewCount > 0 ? `<button type="button" class="date-review-more-v11" data-action="open-date-review" aria-label="${reviewCount} ${reviewCount === 1 ? "item needs" : "items need"} a Journal Date"><strong>Needs Date Review · ${reviewCount}</strong><small>Choose dates for preserved items</small></button>` : ""}
          <button type="button" data-action="open-settings" data-section="overview"><strong>Settings</strong><small>Journal rules, integrations, AI privacy, and appearance</small></button>
        </nav>
        <div class="more-management"><p>Management</p><button type="button" data-action="open-date-review">Needs Date Review</button>${["System Health", "Export archive", "Trash", "Suppressions", "History"].map((label) => `<button type="button" data-action="settings-related" data-label="${label}">${label}</button>`).join("")}</div>
        <p class="more-boundary">Private single-user archive · no sharing or public links</p>
      </aside>
    </div>`;
}

function renderDateReviewPicker() {
  const monthKey = state.modal.month;
  const focusDate = state.modal.focusDate;
  const selectedDate = validateDateReviewDate(state.dateReview.draft).kind === "valid" ? state.dateReview.draft : null;
  const leading = Array.from({ length: leadingCalendarCells(monthKey) }, () => '<span class="date-picker-spacer-v11" aria-hidden="true"></span>').join("");
  const cells = datesForMonth(monthKey).map((date) => {
    const disabled = date > DATE_REVIEW_MAX_DATE;
    const isPrototypeDate = date === DATE_REVIEW_MAX_DATE;
    const selected = date === selectedDate;
    const label = `${dateReviewDisplayDate(date)}${isPrototypeDate ? ", Prototype date" : ""}${disabled ? ", unavailable future date" : ""}`;
    return `<button type="button" role="gridcell" class="date-picker-day-v11${isPrototypeDate ? " is-prototype-date" : ""}${selected ? " is-selected" : ""}" data-action="choose-date-review-date" data-picker-date="${date}" aria-label="${html(label)}" aria-selected="${selected}" ${isPrototypeDate ? 'aria-current="date"' : ""} ${disabled ? "disabled" : `tabindex="${date === focusDate ? "0" : "-1"}"`}>${dateParts(date).day}${isPrototypeDate ? "<small>Prototype date</small>" : ""}</button>`;
  }).join("");
  const atMinimum = monthKey === "0001-01";
  const atMaximum = monthKey === "2026-08";
  return `
    <div class="modal-backdrop date-picker-backdrop-v11" data-action="modal-backdrop">
      <section class="modal-card date-picker-v11" role="dialog" aria-modal="true" aria-labelledby="date-picker-title-v11" aria-describedby="date-picker-boundary-v11" tabindex="-1" data-modal-card>
        <header class="date-picker-header-v11">
          <div><p class="eyebrow">Journal Date</p><h2 id="date-picker-title-v11">Choose Journal Date</h2><p id="date-picker-boundary-v11">Prototype date · 13 August 2026 · Asia/Kolkata</p></div>
          <button type="button" class="icon-button" data-action="close-modal" aria-label="Close Journal Date calendar">×</button>
        </header>
        <div class="date-picker-month-v11">
          <button type="button" class="icon-button" data-action="date-review-picker-year" data-delta="-1" aria-label="Previous year" ${monthKey.slice(0, 4) === "0001" ? "disabled" : ""}>«</button>
          <button type="button" class="icon-button" data-action="date-review-picker-month" data-delta="-1" aria-label="Previous month" ${atMinimum ? "disabled" : ""}>←</button>
          <strong>${html(monthLabel(monthKey))}</strong>
          <button type="button" class="icon-button" data-action="date-review-picker-month" data-delta="1" aria-label="Next month" ${atMaximum ? "disabled" : ""}>→</button>
          <button type="button" class="icon-button" data-action="date-review-picker-year" data-delta="1" aria-label="Next year" ${monthKey.slice(0, 4) === "2026" ? "disabled" : ""}>»</button>
        </div>
        <div class="date-picker-weekdays-v11" role="row">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => `<span role="columnheader">${day}</span>`).join("")}</div>
        <div class="date-picker-grid-v11" role="grid" aria-label="${html(monthLabel(monthKey))}">
          ${leading}${cells}
        </div>
        <footer class="date-picker-actions-v11">
          <span>Future Journal Dates are unavailable.</span>
          <button type="button" class="secondary-button" data-action="close-modal">Cancel</button>
        </footer>
      </section>
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

function renderReadinessDisclosure() {
  const isRecovery = state.modal.readinessKey === "recovery";
  const title = isRecovery ? "Recovery Ceremony requirements" : "Backup and restore evidence";
  return `
    <div class="modal-backdrop readiness-disclosure-backdrop-v9" data-action="modal-backdrop">
      <section class="modal-card readiness-disclosure-v9" role="dialog" aria-modal="true" aria-labelledby="readiness-disclosure-title-v9" aria-describedby="readiness-disclosure-intro-v9" tabindex="-1" data-modal-card>
        <header class="readiness-disclosure-header-v9">
          <div><p class="eyebrow">Read-only requirements</p><h2 id="readiness-disclosure-title-v9" tabindex="-1">${title}</h2></div>
          <button type="button" class="icon-button readiness-disclosure-close-v9" data-action="close-modal" aria-label="Close requirements">×</button>
        </header>
        ${isRecovery ? `
          <p id="readiness-disclosure-intro-v9">Recovery Ceremony remains Blocked. This prototype offers no checkbox, bypass, or completion state.</p>
          <ul class="readiness-evidence-list-v9">
            <li><strong>Password-manager copy</strong><span>Not evidenced. No key value or custody location is shown.</span></li>
            <li><strong>Sealed offline copy</strong><span>Not evidenced. A second independent off-server copy is required.</span></li>
            <li><strong>Restore and decrypt sample</strong><span>Not evidenced. A representative encrypted archive must be restored and decrypted.</span></li>
          </ul>
          <aside class="settings-footnote" role="note">Version 32 will represent evidence and completion states. V10 cannot prove recovery readiness.</aside>` : `
          <p id="readiness-disclosure-intro-v9">Each stage answers a different question. None is represented as completed in this prototype.</p>
          <ol class="readiness-evidence-list-v9">
            <li><strong>Configuration</strong><span>An encrypted repository and schedule are defined.</span></li>
            <li><strong>Upload or snapshot</strong><span>Archive material reached the repository.</span></li>
            <li><strong>Repository check</strong><span>The stored object can be found and inspected without implying restore success.</span></li>
            <li><strong>Restore evidence</strong><span>A representative archive was restored and decrypted.</span></li>
          </ol>
          <aside class="settings-footnote" role="note">System Health is the future evidence surface. V10 renders no health metric, snapshot result, or simulated success.</aside>`}
        <footer class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancel</button></footer>
      </section>
    </div>`;
}

function renderCorrectionSheetV10() {
  const correction = state.shell.correction;
  const saving = correction.status === "saving";
  const failed = correction.status === "failed";
  const saved = correction.status === "saved";
  const disconnected = state.shell.connection !== "connected";
  const checkingConnection = state.shell.connection === "checking";
  return `
    <div class="modal-backdrop correction-sheet-backdrop-v10" data-action="modal-backdrop">
      <section class="modal-card correction-sheet-v10" role="dialog" aria-modal="true" aria-labelledby="correction-title-v10" aria-describedby="correction-helper-v10" tabindex="-1" data-modal-card>
        <header>
          <p class="eyebrow">Prototype interruption exercise</p>
          <h2 id="correction-title-v10" tabindex="-1">Correct displayed text</h2>
          <p id="correction-helper-v10">This draft is kept only in this open page until a save is confirmed. The source journal remains unchanged.</p>
        </header>
        <div class="correction-sheet-body-v10">
          <label for="correction-draft-v10"><span>Displayed text</span><textarea id="correction-draft-v10" class="correction-editor-v10" rows="9" data-action="correction-input" ${saving || saved ? "disabled" : ""}>${html(correction.draft)}</textarea></label>
          <p class="correction-status-v10" data-state="${html(correction.status)}" ${correction.dirty ? "" : "hidden"}>Unsaved changes · kept only while this page remains open.</p>
        ${failed ? `
          <div id="correction-save-failure-v10" class="surface-state-row-v10" role="group" aria-labelledby="correction-save-failure-title-v10" aria-describedby="correction-save-failure-copy-v10" tabindex="-1"><strong id="correction-save-failure-title-v10">Correction not saved</strong><span id="correction-save-failure-copy-v10">The connection was interrupted. Your text remains only in this open page. The source journal is unchanged.</span>${state.shell.connectionMessage ? `<small>${html(state.shell.connectionMessage)}</small>` : ""}</div>` : ""}
        ${saving ? '<p id="correction-operation-status-v10" class="surface-state-row-v10" role="group" aria-label="Saving Correction" tabindex="-1">Saving Correction…</p>' : ""}
          ${saved ? '<p class="surface-state-row-v10" role="group" aria-label="Correction save simulated">Correction save simulated. One Correction is displayed in this tab; nothing was persisted.</p>' : ""}
        </div>
        <footer class="modal-actions unsaved-savebar-v10">
          ${failed
            ? `${renderShellActionV10("retry-shell-correction", "Retry saving", { disabled: saving, className: "primary-button" })}${disconnected ? renderShellActionV10("check-shell-connection", checkingConnection ? "Checking connection…" : "Check connection", { disabled: checkingConnection }) : ""}`
            : saved
              ? renderShellActionV10("close-shell-correction", "Close", { className: "primary-button" })
              : `${renderShellActionV10("save-shell-correction", saving ? "Saving Correction…" : "Save Correction", { disabled: saving || !correction.dirty, className: "primary-button" })}${renderShellActionV10("cancel-shell-correction", "Cancel", { disabled: saving })}`}
          ${failed ? renderShellActionV10("cancel-shell-correction", "Cancel") : ""}
          <button type="button" class="text-button" data-action="expire-shell-session">Simulate session end</button>
        </footer>
      </section>
    </div>`;
}

function renderLeaveConfirmV10() {
  return `
    <div class="modal-backdrop leave-confirm-backdrop-v10" data-action="modal-backdrop">
      <section class="modal-card leave-confirm-v10" role="dialog" aria-modal="true" aria-labelledby="leave-confirm-title-v10" aria-describedby="leave-confirm-copy-v10" tabindex="-1" data-modal-card>
        <header><p class="eyebrow">Unsaved Correction</p><h2 id="leave-confirm-title-v10" tabindex="-1">Leave with an unsaved Correction?</h2></header>
        <p id="leave-confirm-copy-v10">This Correction is kept only in this open page. Leaving or reloading will discard it.</p>
        <footer class="modal-actions leave-confirm-actions-v10">
          <button type="button" class="primary-button" data-action="keep-shell-correction">Keep editing</button>
          <button type="button" class="secondary-button" data-action="discard-shell-correction">Discard Correction and leave</button>
        </footer>
      </section>
    </div>`;
}

function renderModal() {
  if (!state.modal) return "";
  if (state.modal.type === "date-review-picker") return renderDateReviewPicker();
  if (state.modal.type === "correction-v10") return renderCorrectionSheetV10();
  if (state.modal.type === "leave-correction-v10") return renderLeaveConfirmV10();
  if (state.modal.type === "manage-reflection") return renderManageReflectionSheet();
  if (state.modal.type === "upload") return renderUploadModal();
  if (state.modal.type === "photo") return renderPhotoModal();
  if (state.modal.type === "sparse-art") return renderSparseArtworkModal();
  if (state.modal.type === "almanac-drawer") return renderAlmanacDrawer();
  if (state.modal.type === "almanac-jump") return renderAlmanacJump();
  if (state.modal.type === "more") return renderMoreSheet();
  if (state.modal.type === "month-chooser") return renderMonthChooser();
  if (state.modal.type === "readiness-disclosure") return renderReadinessDisclosure();
  return "";
}

function render() {
  invalidateNavigationFocusV12();
  viewScrollRestoreEpochV12 += 1;
  const liveSearchInput = root.querySelector("#archive-search-input-v9");
  if (liveSearchInput) state.searchDraft = liveSearchInput.value;
  const liveCorrection = modalRoot.querySelector("#correction-draft-v10");
  if (liveCorrection && document.activeElement === liveCorrection && state.shell.correction.open && !["saving", "saved"].includes(state.shell.correction.status)) {
    const liveSelection = { start: liveCorrection.selectionStart, end: liveCorrection.selectionEnd, direction: liveCorrection.selectionDirection };
    if (liveCorrection.value !== state.shell.correction.draft) {
      dispatchShell("CORRECTION_INPUT", { draft: liveCorrection.value, selection: liveSelection });
    } else {
      dispatchShell("CORRECTION_SELECTION", { selection: liveSelection });
    }
  }
  document.documentElement.dataset.theme = resolvedTheme();
  if (state.view !== "calendar") calendarStatusLive.textContent = "";
  if (state.view !== "telegram-capture") captureStatusLiveV12.textContent = "";
  root.innerHTML = renderUnifiedApp();
  modalRoot.innerHTML = renderModal();
  const renderedCorrection = modalRoot.querySelector("#correction-draft-v10");
  if (renderedCorrection && state.shell.correction.selection) {
    const { start, end, direction } = state.shell.correction.selection;
    renderedCorrection.setSelectionRange(start, end, direction);
  }
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
    if (state.modal?.type === "more" && Number.isFinite(state.modal.sheetScrollTop)) {
      const moreSheet = modalRoot.querySelector(".more-sheet");
      if (moreSheet) moreSheet.scrollTop = state.modal.sheetScrollTop;
    }
    if (state.pendingInputSelection && focusTarget.id === "archive-search-input-v9") {
      const { start, end, direction } = state.pendingInputSelection;
      focusTarget.setSelectionRange(start, end, direction);
      state.pendingInputSelection = null;
    }
    if (state.pendingDateReviewSelection && focusTarget.id === "date-review-date-input-v11") {
      const { start, end, direction } = state.pendingDateReviewSelection;
      focusTarget.setSelectionRange(start, end, direction);
      state.pendingDateReviewSelection = null;
    }
    if (focusTarget.id === "correction-draft-v10" && state.shell.correction.selection) {
      const { start, end, direction } = state.shell.correction.selection;
      focusTarget.setSelectionRange(start, end, direction);
      requestAnimationFrame(() => withInstantScroll(() => focusTarget.scrollIntoView({ behavior: "auto", block: "center" })));
    }
    if (state.modal?.scrollY != null) withInstantScroll(() => window.scrollTo({ top: state.modal.scrollY, behavior: "auto" }));
  });

  if (["session-expired", "reauth"].includes(state.shell.phase)) {
    requestAnimationFrame(() => root.querySelector("#session-gate-title-v10")?.focus({ preventScroll: true }));
  }

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

function clearShellBoundaryTransientsV10() {
  liveAnnouncementEpochV10 += 1;
  clearTimeout(toastTimer);
  toastRegion.innerHTML = "";
  calendarStatusLive.textContent = "";
  almanacStatusLive.textContent = "";
  shellStatusLive.textContent = "";
  clearDateReviewAnnouncementV11();
  clearCaptureAnnouncementV12();
  pendingLeaveNavigation = null;
  pendingPopGuard = null;
  suppressGuardedPopstate = false;
}

function canonicalRouteUrl({ entryId = window.history.state?.entryId } = {}) {
  const url = new URL(window.location.pathname, window.location.origin);
  url.searchParams.set("view", state.view);
  if (["date-review", "telegram-capture"].includes(state.view)) return url;
  url.searchParams.set("month", state.month);
  if (state.view === "almanac" && state.almanacThrough !== state.almanacMonth) url.searchParams.set("through", state.almanacThrough);
  else url.searchParams.delete("through");
  const opaqueCaptureDay = state.view === "calendar"
    && state.screen === "day"
    && captureDayHistoryTargetsV12.get(entryId) === state.selectedDate;
  if (["calendar", "almanac"].includes(state.view) && state.selectedDate && !opaqueCaptureDay) url.searchParams.set("date", state.selectedDate);
  else url.searchParams.delete("date");
  if (["calendar", "almanac"].includes(state.view) && state.screen === "day" && !opaqueCaptureDay) url.searchParams.set("screen", "day");
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

function setDateReviewMoreOriginV11(control) {
  const entryId = ensureHistoryEntry();
  const sheet = control?.closest?.(".more-sheet");
  const origin = {
    control: control?.classList?.contains("date-review-more-v11") ? "conditional" : "management",
    sheetScrollTop: Number(sheet?.scrollTop) || 0,
  };
  const snapshot = captureHistorySnapshot({
    scrollY: window.scrollY,
    focusSelector: '[data-action="open-more"]',
    focusTop: null,
  });
  historyEntries.set(entryId, { ...snapshot, dateReviewMoreOrigin: origin });
}

function clearDateReviewMoreOriginV11(entryId = window.history.state?.entryId) {
  const snapshot = historyEntries.get(entryId);
  if (!snapshot?.dateReviewMoreOrigin) return;
  const { dateReviewMoreOrigin: _dateReviewMoreOrigin, ...safeSnapshot } = snapshot;
  historyEntries.set(entryId, safeSnapshot);
}

function ensureHistoryEntry() {
  const currentId = window.history.state?.entryId;
  if (currentId && historyEntries.has(currentId)) {
    if (!historyPositions.has(currentId)) historyPositions.set(currentId, currentHistoryPosition);
    return currentId;
  }
  const entryId = nextHistoryEntryId();
  historyEntries.set(entryId, {});
  historyPositions.set(entryId, currentHistoryPosition);
  window.history.replaceState({ entryId }, "", canonicalRouteUrl());
  return entryId;
}

function syncLiveSearchDraft() {
  const input = root.querySelector("#archive-search-input-v9");
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
  const { almanacEmptyArchive: _priorAlmanacEmptyArchive, ...safePrior } = prior;
  return {
    ...safePrior,
    scrollY: overrides.scrollY ?? window.scrollY,
    focusSelector,
    focusTop: Number.isFinite(focusTop) ? focusTop : null,
    selectionOpenedInApp: overrides.selectionOpenedInApp ?? prior.selectionOpenedInApp ?? false,
    fullDayOpenedInApp: overrides.fullDayOpenedInApp ?? prior.fullDayOpenedInApp ?? false,
    // The first-use fixture itself never enters history payloads. The older
    // Almanac-only empty-state flag remains available solely inside the
    // populated regression fixture inherited from v8.
    ...(isFirstUseFixture() ? {} : { almanacEmptyArchive: state.almanacEmptyArchive }),
    almanacVisibleMonth: state.almanacVisibleMonth,
    almanacVisibleDate: state.almanacVisibleDate,
    almanacReturnFocusDate: state.almanacReturnFocusDate,
    calendarMonth: state.calendarMonth,
    focusDate: state.focusDate,
    // This map exists only in live memory. Browser history receives only the
    // opaque entryId stored by syncUrl.
    dateReviewDetailKey: state.view === "date-review" ? state.dateReview.detailKey : null,
    captureSurface: state.view === "telegram-capture" ? state.capture.surface : null,
  };
}

function saveCurrentHistorySnapshot(overrides = {}) {
  const entryId = ensureHistoryEntry();
  const snapshot = captureHistorySnapshot(overrides);
  historyEntries.set(entryId, snapshot);
  return snapshot;
}

function syncUrl({ push = false, selectionOpenedInApp, fullDayOpenedInApp, captureDayDate, scrollY, focusSelector, focusTop, originAlreadySaved = false } = {}) {
  const previous = currentHistorySnapshot() || {};
  const snapshotOverrides = { scrollY, focusSelector, focusTop };
  if (selectionOpenedInApp !== undefined) snapshotOverrides.selectionOpenedInApp = selectionOpenedInApp;
  if (fullDayOpenedInApp !== undefined) snapshotOverrides.fullDayOpenedInApp = fullDayOpenedInApp;

  if (push && !originAlreadySaved) saveCurrentHistorySnapshot();

  const entryId = push ? nextHistoryEntryId() : ensureHistoryEntry();
  if (push) currentHistoryPosition += 1;
  if (isDateKey(captureDayDate) && state.view === "calendar" && state.screen === "day" && state.selectedDate === captureDayDate) {
    captureDayHistoryTargetsV12.set(entryId, captureDayDate);
  } else {
    const mappedDate = captureDayHistoryTargetsV12.get(entryId);
    if (mappedDate && !(state.view === "calendar" && state.screen === "day" && state.selectedDate === mappedDate)) {
      captureDayHistoryTargetsV12.delete(entryId);
    }
  }
  const destinationSnapshot = captureHistorySnapshot({
    ...snapshotOverrides,
    selectionOpenedInApp: selectionOpenedInApp ?? (push ? false : previous.selectionOpenedInApp),
    fullDayOpenedInApp: fullDayOpenedInApp ?? (push ? false : previous.fullDayOpenedInApp),
    focusSelector: focusSelector !== undefined ? focusSelector : state.focusAfterRender || selectorForLogicalFocus(document.activeElement),
    scrollY: scrollY ?? (state.screen === "day" ? 0 : window.scrollY),
  });
  historyEntries.set(entryId, destinationSnapshot);
  historyPositions.set(entryId, currentHistoryPosition);
  window.history[push ? "pushState" : "replaceState"]({ entryId }, "", canonicalRouteUrl({ entryId }));
  return entryId;
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
  if (focusTarget === "month-trigger") state.focusAfterRender = '[data-action="open-month-chooser"]';
  else if (focusTarget === "calendar-cell" && state.view === "calendar") state.focusAfterRender = `[data-calendar-date="${state.focusDate}"]`;
  else if (state.view === "almanac" && state.modal?.type === "almanac-drawer") state.modal.focusSelector = ".almanac-mobile-drawer-v9";
  syncUrl({ push, originAlreadySaved: push });
  render();
  queueLiveAnnouncementV10(calendarStatusLive, state.monthAnnouncement);
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

function handleCaptureSkipLinkV12(event) {
  const skipLink = event.target.closest?.('.skip-link[href="#prototype-main"]');
  if (!skipLink
    || state.view !== "telegram-capture"
    || event.button !== 0
    || event.metaKey
    || event.ctrlKey
    || event.shiftKey
    || event.altKey) return;
  const target = root.querySelector("#prototype-main.telegram-capture-page, #prototype-main.telegram-handoff-page");
  if (!target) return;

  event.preventDefault();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  target.focus({ preventScroll: true });
  state.scrollByView["telegram-capture"] = window.scrollY;
  saveCurrentHistorySnapshot({
    scrollY: window.scrollY,
    focusSelector: "#prototype-main",
    focusTop: target.getBoundingClientRect().top,
  });
}

function revealCaptureFailureOutcomeV12() {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (state.view !== "telegram-capture" || ["session-expired", "reauth"].includes(state.shell.phase)) return;
    const selector = "#capture-outcome-title-v12";
    const target = root.querySelector(selector);
    if (!target?.getClientRects().length) return;

    target.focus({ preventScroll: true });
    const viewportTop = Number(window.visualViewport?.offsetTop) || 0;
    const viewportHeight = Number(window.visualViewport?.height) || window.innerHeight;
    const viewportBottom = viewportTop + viewportHeight;
    const visibleRect = (element) => element?.getClientRects().length ? element.getBoundingClientRect() : null;
    const topOccluderBottom = [root.querySelector(".prototype-banner"), root.querySelector(".unified-topbar")]
      .map(visibleRect)
      .filter(Boolean)
      .reduce((bottom, rect) => Math.max(bottom, rect.bottom), viewportTop);
    const compactNavigationRect = visibleRect(root.querySelector(".compact-navigation"));
    const bottomOccluderTop = compactNavigationRect
      ? Math.min(viewportBottom, compactNavigationRect.top)
      : viewportBottom;
    const safeTop = Math.min(viewportBottom, Math.max(viewportTop, topOccluderBottom) + 8);
    const safeBottom = Math.max(safeTop, bottomOccluderTop - 8);
    const targetRect = target.getBoundingClientRect();
    const outsideSafeAperture = targetRect.top < safeTop || targetRect.bottom > safeBottom;
    if (outsideSafeAperture) {
      withInstantScroll(() => window.scrollBy({ top: targetRect.top - safeTop, behavior: "auto" }));
    }
    target.focus({ preventScroll: true });

    const finalRect = target.getBoundingClientRect();
    state.scrollByView["telegram-capture"] = window.scrollY;
    saveCurrentHistorySnapshot({
      scrollY: window.scrollY,
      focusSelector: selector,
      focusTop: finalRect.top,
    });
  }));
}

function reconcileDateReviewSafeFocusV11(selector, { refreshPriorQueueEntry = false } = {}) {
  requestAnimationFrame(() => {
    if (state.view !== "date-review" || ["session-expired", "reauth"].includes(state.shell.phase)) return;
    const target = resolveLogicalSelector(selector);
    if (!target) return;

    target.focus({ preventScroll: true });
    const viewportTop = Number(window.visualViewport?.offsetTop) || 0;
    const viewportHeight = Number(window.visualViewport?.height) || window.innerHeight;
    const viewportBottom = viewportTop + viewportHeight;
    const visibleRect = (element) => element?.getClientRects().length ? element.getBoundingClientRect() : null;
    const topOccluderBottom = [root.querySelector(".prototype-banner"), root.querySelector(".unified-topbar")]
      .map(visibleRect)
      .filter(Boolean)
      .reduce((bottom, rect) => Math.max(bottom, rect.bottom), viewportTop);
    const compactNavigationRect = visibleRect(root.querySelector(".compact-navigation"));
    const bottomOccluderTop = compactNavigationRect
      ? Math.min(viewportBottom, compactNavigationRect.top)
      : viewportBottom;
    const safeTop = Math.min(viewportBottom, Math.max(viewportTop, topOccluderBottom) + 8);
    const safeBottom = Math.max(safeTop, bottomOccluderTop - 8);
    const safeHeight = Math.max(0, safeBottom - safeTop);
    const targetRect = target.getBoundingClientRect();
    const outsideSafeAperture = targetRect.height > safeHeight
      || targetRect.top < safeTop
      || targetRect.bottom > safeBottom;
    const delta = outsideSafeAperture ? targetRect.top - safeTop : 0;

    if (Math.abs(delta) > 0.5) {
      withInstantScroll(() => window.scrollBy({ top: delta, behavior: "auto" }));
    }
    target.focus({ preventScroll: true });

    const finalRect = target.getBoundingClientRect();
    state.scrollByView["date-review"] = window.scrollY;
    const entryId = ensureHistoryEntry();
    const snapshot = captureHistorySnapshot({
      scrollY: window.scrollY,
      focusSelector: selector,
      focusTop: finalRect.top,
    });
    historyEntries.set(entryId, snapshot);
    if (refreshPriorQueueEntry) {
      for (const [priorEntryId, position] of historyPositions) {
        if (position !== currentHistoryPosition - 1) continue;
        historyEntries.set(priorEntryId, { ...snapshot });
        break;
      }
    }
  });
}

function restoreViewScroll(view, exactScrollY = state.scrollByView[view] || 0, anchorSelector = null, anchorTop = null) {
  const restoreEpoch = ++viewScrollRestoreEpochV12;
  const expectedEntryId = window.history.state?.entryId;
  const restorationIsCurrent = () => viewScrollRestoreEpochV12 === restoreEpoch
    && state.view === view
    && window.history.state?.entryId === expectedEntryId;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (!restorationIsCurrent()) return;
    withInstantScroll(() => window.scrollTo({ top: exactScrollY, behavior: "auto" }));
    requestAnimationFrame(() => {
      if (!restorationIsCurrent()) return;
      const anchor = anchorSelector ? resolveLogicalSelector(anchorSelector) : null;
      if (anchor && Number.isFinite(anchorTop)) {
        const delta = anchor.getBoundingClientRect().top - anchorTop;
        if (Math.abs(delta) > 0.5) withInstantScroll(() => window.scrollBy({ top: delta, behavior: "auto" }));
      }
      anchor?.focus({ preventScroll: true });
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
  const logicalFocusSelector = selectorForLogicalFocus(focusElement);
  const priorDateReviewMemory = state.viewMemory["date-review"];
  // Cross-view controls live in the shared shell, not in the date-review
  // page. Never save one as that page's re-entry target. Detail scroll also
  // must not replace the queue scroll captured before the detail opened.
  const dateReviewScrollY = state.dateReview.detailKey
    ? Number(priorDateReviewMemory?.scrollY) || 0
    : window.scrollY;
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
    scrollY: view === "date-review" ? dateReviewScrollY : window.scrollY,
    focusSelector: view === "date-review"
      ? "#date-review-title-v11"
      : view === "telegram-capture"
        ? logicalFocusSelector || (state.capture.surface === "change-date" ? "#capture-change-title-v12" : "#capture-title-v12")
        : logicalFocusSelector,
    focusTop: view === "date-review" ? null : focusElement?.getBoundingClientRect?.().top ?? null,
    searchQuery: state.searchQuery,
    searchDraft: state.searchDraft,
    settingsSection: state.settingsSection,
    dateReviewDetailKey: null,
    captureSurface: view === "telegram-capture" ? state.capture.surface : "companion",
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
  } else if (view === "date-review") {
    // Explicit cross-view entry always opens the queue. Same-URL detail
    // restoration belongs to the opaque browser-history snapshot instead.
    state.dateReview.detailKey = null;
    state.screen = "month";
  } else if (view === "telegram-capture") {
    state.capture.surface = ["companion", "change-date"].includes(memory.captureSurface) ? memory.captureSurface : "companion";
    state.screen = "month";
    state.selectedDate = null;
  }
  state.focusAfterRender = view === "date-review"
    ? "#date-review-title-v11"
    : view === "telegram-capture"
      ? memory.focusSelector || (state.capture.surface === "change-date" ? "#capture-change-title-v12" : "#capture-title-v12")
      : memory.focusSelector;
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
  if (previousView === "date-review" && nextView !== previousView) {
    if (state.dateReview.assignment.status === "assigning" || dateReviewTimersV11.size) {
      cancelDateReviewOperationsV11({ preserveFailure: false });
    } else clearDateReviewAnnouncementV11();
  }
  if (previousView === "telegram-capture" && nextView !== previousView) {
    cancelCaptureOperationsV12({ keepTerminal: !state.capture.active, stage: state.capture.active ? "selected" : state.capture.stage });
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
    const restoredFocus = nextView === "date-review"
      ? "#date-review-title-v11"
      : nextView === "telegram-capture"
        ? savedView.focusSelector || "#capture-title-v12"
        : savedView.focusSelector;
    restoreViewScroll(nextView, savedView.scrollY, restoredFocus, nextView === "date-review" ? null : savedView.focusTop);
    const viewLabels = { calendar: "Calendar", almanac: "Almanac", search: "Search", settings: "Settings", "date-review": "Needs Date Review" };
    if (nextView !== "telegram-capture") toast(nextView === "settings" ? "Settings opened." : nextView === "date-review" ? "Needs Date Review opened." : `${viewLabels[nextView]} view, ${monthLabel(state.month)}.`);
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
    state.focusAfterRender = "#archive-search-input-v9";
  } else if (nextView === "date-review") {
    state.screen = "month";
    state.dateReview.detailKey = null;
    state.focusAfterRender = "#date-review-title-v11";
  } else if (nextView === "telegram-capture") {
    state.screen = "month";
    state.selectedDate = null;
    state.capture.surface = "companion";
    state.focusAfterRender = "#capture-title-v12";
  } else {
    state.screen = "month";
    state.focusAfterRender = "#settings-section-heading";
  }

  syncUrl({ push, originAlreadySaved: push });
  render();
  if (!shouldScrollChapter) restoreViewScroll(nextView);
  const viewLabels = { calendar: "Calendar", almanac: "Almanac", search: "Search", settings: "Settings", "date-review": "Needs Date Review" };
  if (nextView !== "telegram-capture") toast(nextView === "settings" ? "Settings opened." : nextView === "date-review" ? "Needs Date Review opened." : `${viewLabels[nextView]} view, ${monthLabel(state.month)}.`);
}

function announceAlmanac(message) {
  state.almanacStatusMessage = message;
  queueLiveAnnouncementV10(almanacStatusLive, message);
}

function queueAlmanacDestination(selector, announcement = "") {
  state.almanacPendingDestination = { selector, announcement };
}

function replaceAlmanacPagination() {
  const current = root.querySelector(".almanac-pagination-v9");
  if (current) current.outerHTML = almanacPagination();
}

function replaceAlmanacIndex() {
  const current = root.querySelector("#almanac-index-content-desktop-v9");
  if (current) {
    const indexScroll = current.querySelector(".almanac-volume-nav-v9")?.scrollTop || 0;
    current.outerHTML = almanacNavigatorContent("desktop");
    const replacement = root.querySelector("#almanac-index-content-desktop-v9 .almanac-volume-nav-v9");
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
    const volumes = root.querySelector("#almanac-volumes-v9");
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

function openReadinessSettings(readinessKey, originControl) {
  const destinations = {
    voicenotes: { section: "integrations", selector: "#capture-source-a-settings-title-v12" },
    telegram: { section: "integrations", selector: "#capture-source-b-settings-title-v12" },
    ai: { section: "ai", selector: "#settings-section-heading" },
  };
  const destination = destinations[readinessKey];
  if (!destination) return;
  const originSelector = `[data-action="view-readiness-settings"][data-readiness-key="${readinessKey}"]`;
  saveCurrentHistorySnapshot({
    scrollY: window.scrollY,
    focusSelector: originSelector,
    focusTop: originControl?.getBoundingClientRect?.().top ?? null,
  });
  state.viewMemory.calendar = captureViewMemory("calendar");
  state.scrollByView.calendar = window.scrollY;
  state.view = "settings";
  state.settingsSection = destination.section;
  state.screen = "month";
  state.selectedDate = null;
  state.focusAfterRender = destination.selector;
  syncUrl({ push: true, originAlreadySaved: true, scrollY: 0, focusSelector: destination.selector, focusTop: null });
  render();
  requestAnimationFrame(() => withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" })));
}

function setReadinessFixture(fixtureKey) {
  if (!Object.hasOwn(READINESS_FIXTURES, fixtureKey)) fixtureKey = "first-use/default";
  cancelCaptureOperationsV12();
  state.capture = initialCaptureStateV12((state.capture?.generation || 0) + 1, state.capture?.branch || "success");
  state.captureArchiveActive = false;
  resetDateReviewV11("date-review/empty");
  resetSyntheticArchiveDaysV10(fixtureKey === "archive/populated");
  state.readinessFixture = fixtureKey;
  state.almanacEmptyArchive = fixtureKey !== "archive/populated";
  state.almanacLoadRequestId += 1;
  state.view = "calendar";
  state.month = "2026-08";
  state.calendarMonth = "2026-08";
  state.almanacMonth = "2026-08";
  state.almanacThrough = "2026-08";
  state.almanacVisibleMonth = "2026-08";
  state.almanacVisibleDate = null;
  state.selectedDate = null;
  state.screen = "month";
  state.focusDate = today;
  state.modal = null;
  state.viewMemory = { calendar: null, almanac: null, search: null, settings: null, "date-review": null, "telegram-capture": null };
  state.scrollByView = { calendar: 0, almanac: 0, search: 0, settings: 0, "date-review": 0, "telegram-capture": 0 };
  state.focusAfterRender = fixtureKey === "archive/populated"
    ? '[data-action="open-month-chooser"]'
    : "#first-use-title-v9";
  syncUrl({ scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  const announcement = fixtureKey === "archive/populated"
    ? "Prototype data changed to the populated archive."
    : fixtureKey === "first-use/configured-unverified"
      ? "Prototype data changed to configured but never verified."
      : fixtureKey === "first-use/ai-unavailable"
        ? "Prototype data changed to AI unavailable. Authentic capture remains available."
        : "Prototype data changed to first use.";
  queueLiveAnnouncementV10(calendarStatusLive, announcement);
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
  state.modal = { type: "upload", stage: "choose", date: date || state.selectedDate || today, error: "", returnFocusSelector, focusSelector: "#upload-modal-title" };
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
  if (control.closest(".first-use-intro-actions-v9")) return '.first-use-intro-actions-v9 [data-action="open-upload"]';
  if (control.closest(".almanac-index-v9")) return ".almanac-index-v9 [data-action=\"open-upload\"]";
  if (control.closest(".almanac-archive-empty-v9")) return ".almanac-archive-empty-v9 [data-action=\"open-upload\"]";
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
  if (modal?.type === "leave-correction-v10") {
    pendingLeaveNavigation = null;
    dispatchShell("LEAVE_KEEP");
    state.modal = { type: "correction-v10", focusSelector: "#correction-draft-v10", scrollY: modal.scrollY ?? window.scrollY };
    render();
    return;
  }
  if (modal?.type === "correction-v10") {
    if (state.shell.correction.status === "saving") {
      toast("Saving this Correction. Wait for the simulated result before leaving.");
      return;
    }
    if (state.shell.correction.dirty) {
      requestCorrectionLeaveV10("close", { kind: "close" });
      return;
    }
    const returnSelector = state.shell.correction.returnFocusSelector;
    dispatchShell("CORRECTION_CLOSE");
    state.modal = null;
    state.focusAfterRender = returnSelector;
    render();
    return;
  }
  // Once the owner confirms an upload, the short simulated commit is atomic.
  // Escape and backdrop clicks must not make it look cancelled while a stale
  // callback later creates the Journal Day.
  if (modal?.type === "upload" && modal.stage === "saving") {
    toast("Saving this journal. The dialog will close when the save finishes.");
    return;
  }
  if (modal?.type === "almanac-jump" && modal.returnToDrawer) {
    state.modal = {
      type: "almanac-drawer",
      returnFocusSelector: '[data-action="open-almanac-drawer"]',
      focusSelector: '[data-action="open-almanac-jump"]',
    };
    render();
    return;
  }
  if (modal?.type === "more" && modal.restoredFromDateReviewHistoryV11) {
    clearDateReviewMoreOriginV11();
  }
  if (modal?.returnFocusSelector) state.focusAfterRender = modal.returnFocusSelector;
  const returnScrollY = modal?.scrollY;
  state.modal = null;
  render();
  if (returnScrollY != null) requestAnimationFrame(() => withInstantScroll(() => window.scrollTo({ top: returnScrollY, behavior: "auto" })));
}

async function readJournalFile(file) {
  if (!file) return;
  const uploadModalAtStart = state.modal;
  const uploadGenerationAtStart = inheritedAsyncGenerationV10;
  if (uploadModalAtStart?.type !== "upload") return;
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
    if (state.modal !== uploadModalAtStart || inheritedAsyncGenerationV10 !== uploadGenerationAtStart) return;
    const textValue = new TextDecoder("utf-8", { fatal: true }).decode(buffer).replace(/^\uFEFF/, "");
    if (!textValue.trim()) throw new Error("empty");
    state.modal = {
      ...uploadModalAtStart,
      stage: "review",
      fileName: file.name,
      fileSize: file.size,
      text: textValue,
      error: "",
      focusSelector: "#upload-review-title-v9",
    };
    render();
  } catch (error) {
    if (state.modal !== uploadModalAtStart || inheritedAsyncGenerationV10 !== uploadGenerationAtStart) return;
    state.modal = {
      ...uploadModalAtStart,
      error: error.message === "empty" ? "This journal file is empty." : "The file is not valid UTF-8 text.",
    };
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
  const startingFromFirstUse = isFirstUseFixture();
  const returnFocusSelector = modal.returnFocusSelector;
  const returnToFullDay = state.screen === "day";
  modal.stage = "saving";
  modal.focusSelector = "#upload-saving-title-v9";
  render();
  window.setTimeout(() => {
    // Popstate or another structural navigation may legitimately discard this
    // local modal. In that case, never let its delayed callback commit later.
    if (state.modal !== modal || modal.stage !== "saving") return;
    // First use represents a genuinely empty archive. The frozen v8 sample
    // remains available through its explicit fixture, but must never appear as
    // an accidental side effect of adding the owner's first uploaded journal.
    if (startingFromFirstUse) Object.keys(days).forEach((date) => delete days[date]);
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
    state.readinessFixture = startingFromFirstUse ? "archive/owner-started" : state.readinessFixture;
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
  const asyncGeneration = inheritedAsyncGenerationV10;
  state.modal = null;
  state.generation[date] = "waiting";
  state.focusAfterRender = `#generation-status-${date}`;
  render();
  toast("Artwork simulation queued. Authentic journals remain available.");

  window.setTimeout(() => {
    if (asyncGeneration !== inheritedAsyncGenerationV10 || !days[date]) return;
    state.generation[date] = "in-progress";
    state.focusAfterRender = `#generation-status-${date}`;
    render();
  }, 650);

  window.setTimeout(() => {
    if (asyncGeneration !== inheritedAsyncGenerationV10 || !days[date]) return;
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
      if (asyncGeneration !== inheritedAsyncGenerationV10) return;
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

const dateReviewDestinationBackupsV11 = new Map();

function restoreDateReviewDestinationsV11() {
  for (const [date, backup] of dateReviewDestinationBackupsV11) {
    if (backup) days[date] = structuredClone(backup);
    else delete days[date];
  }
  dateReviewDestinationBackupsV11.clear();
}

function establishDateReviewArchiveBaselineV11(populated) {
  // Queue fixture transitions own an exact destination baseline. Re-clone the
  // frozen v10 archive (or the first-use empty archive) only after any prior
  // assignment backup has been restored, so no represented attachment can
  // leak into a later fixture.
  resetSyntheticArchiveDaysV10(populated);
  state.captureArchiveActive = false;
  state.readinessFixture = populated ? "archive/populated" : "first-use/default";
  state.almanacEmptyArchive = !populated;
  state.selectedDate = null;
  state.screen = "month";
  state.month = prototypeNewestMonth;
  state.calendarMonth = prototypeNewestMonth;
  state.almanacMonth = prototypeNewestMonth;
  state.almanacThrough = prototypeNewestMonth;
  state.almanacVisibleMonth = prototypeNewestMonth;
  state.almanacVisibleDate = null;
  state.focusDate = today;
  state.viewMemory.calendar = null;
  state.viewMemory.almanac = null;
  state.scrollByView.calendar = 0;
  state.scrollByView.almanac = 0;
}

function cancelDateReviewOperationsV11({ preserveFailure = false } = {}) {
  clearDateReviewAnnouncementV11();
  const hadLoad = [...dateReviewTimersV11.keys()].some((key) => String(key).startsWith("load-"));
  for (const timer of dateReviewTimersV11.values()) window.clearTimeout(timer);
  dateReviewTimersV11.clear();
  if (state.dateReview.assignment.status === "assigning") {
    if (preserveFailure) {
      const operation = state.dateReview.assignment.operation;
      dispatchDateReview("ASSIGN_FAIL", { operation });
    } else dispatchDateReview("INVALIDATE");
  }
  if (hadLoad && state.dateReview.status === "loading") dispatchDateReview("LOAD_CANCEL");
}

function resetDateReviewV11(fixture = "date-review/empty", { restoreDestinations = true } = {}) {
  cancelDateReviewOperationsV11();
  if (restoreDestinations) restoreDateReviewDestinationsV11();
  const populated = ["date-review/populated", "date-review/final-item"].includes(fixture);
  establishDateReviewArchiveBaselineV11(populated);
  const branch = state.dateReview?.branch || "success";
  const generation = (state.dateReview?.generation || 0) + 1;
  state.dateReview = dateReviewFixtureState(fixture, generation, branch);
  state.viewMemory["date-review"] = null;
  state.scrollByView["date-review"] = 0;
}

function setDateReviewFixtureV11(fixture) {
  if (!Object.hasOwn(DATE_REVIEW_FIXTURES, fixture)) {
    dispatchShell("FIXTURE_SET", { fixture: "shell/ready" });
    resetShellViewV10();
    state.focusAfterRender = "#first-use-title-v9";
    syncUrl({ scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
    render();
    return;
  }
  const safeFixture = fixture;
  resetDateReviewV11(safeFixture);
  state.modal = null;
  if (state.view !== "date-review") {
    setView("date-review");
  } else {
    state.focusAfterRender = safeFixture === "date-review/loading"
      ? "#date-review-loading-title-v11"
      : safeFixture === "date-review/load-failure"
        ? "#date-review-load-failure-title-v11"
        : safeFixture === "date-review/empty"
          ? "#date-review-empty-title-v11"
          : "#date-review-title-v11";
    syncUrl({ scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
    render();
  }
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  announceDateReview(`Prototype Needs Date Review state changed to ${DATE_REVIEW_FIXTURES[safeFixture]}.`);
}

function openDateReviewV11(originControl = null) {
  const fromModal = Boolean(state.modal);
  const fromMore = state.view !== "date-review"
    && state.modal?.type === "more"
    && Boolean(originControl?.closest?.(".more-sheet"));
  if (fromMore) setDateReviewMoreOriginV11(originControl);
  state.modal = null;
  if (state.view === "date-review") {
    if (state.dateReview.detailKey) closeDateReviewItemV11();
    else {
      state.focusAfterRender = "#date-review-title-v11";
      render();
    }
    return;
  }
  if (fromModal) state.focusAfterRender = null;
  setView("date-review");
  // The More origin belongs only to the entry we just left. The destination
  // keeps no modal/control descriptor; browser history.state remains entryId.
  if (fromMore) clearDateReviewMoreOriginV11();
}

function openDateReviewItemV11(index, { guided = false } = {}) {
  const items = unresolvedDateReviewItems();
  const item = items[Number(index)];
  if (!item) return;
  const originSelector = `[data-action="open-date-review-item"][data-review-index="${Number(index)}"]`;
  const origin = resolveLogicalSelector(originSelector);
  state.viewMemory["date-review"] = captureViewMemory("date-review");
  saveCurrentHistorySnapshot({
    scrollY: window.scrollY,
    focusSelector: originSelector,
    focusTop: origin?.getBoundingClientRect().top ?? null,
  });
  dispatchDateReview("DETAIL_OPEN", { key: item.key });
  if (guided) {
    const validation = validateDateReviewDate(item.guidedDate);
    dispatchDateReview("DRAFT_SET", { value: item.guidedDate, validation, preview: dateReviewPreview(item, item.guidedDate) });
  }
  state.focusAfterRender = "#date-review-detail-title-v11";
  syncUrl({ push: true, originAlreadySaved: true, scrollY: 0, focusSelector: "#date-review-detail-title-v11", focusTop: null });
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
}

function closeDateReviewItemV11() {
  cancelDateReviewOperationsV11();
  if (currentHistorySnapshot()?.dateReviewDetailKey) {
    window.history.back();
    return;
  }
  dispatchDateReview("DETAIL_CLOSE");
  state.focusAfterRender = "#date-review-title-v11";
  syncUrl({ focusSelector: state.focusAfterRender });
  render();
}

function setDateReviewDraftV11(value, { selection = null, announce = true } = {}) {
  if (!state.dateReview.detailKey || state.dateReview.assignment.status === "assigning") return;
  const item = dateReviewItem(state.dateReview.detailKey);
  const validation = validateDateReviewDate(value);
  const preview = validation.kind === "valid" ? dateReviewPreview(item, value) : null;
  dispatchDateReview("DRAFT_SET", { value, validation, preview });
  state.pendingDateReviewSelection = selection;
  state.focusAfterRender = "#date-review-date-input-v11";
  render();
  if (announce && preview) {
    announceDateReview(`${dateReviewDisplayDate(value)} destination preview ready. ${preview.before} before; ${preview.after} after.`);
  }
}

function ensureDateReviewDestinationV11(item, date) {
  if (!dateReviewDestinationBackupsV11.has(date)) {
    dateReviewDestinationBackupsV11.set(date, days[date] ? structuredClone(days[date]) : null);
  }
  if (!days[date] && syntheticArchiveDaysV10[date]) days[date] = structuredClone(syntheticArchiveDaysV10[date]);
  if (!days[date]) {
    days[date] = {
      date,
      title: "A Journal Day assigned in this prototype",
      titleStatus: "AI not run",
      summary: "A deterministic synthetic destination created only to exercise Needs Date Review.",
      summaryStatus: "AI not run",
      tags: ["prototype"],
      tagsStatus: "AI not run",
      photos: [],
      artworks: [],
      journals: [],
    };
  }
  const destination = days[date];
  if (item.source === "telegram") {
    const id = item.destinationId;
    if (!destination.photos.some((photo) => photo.id === id)) {
      destination.photos.forEach((photo) => { photo.isCover = false; });
      destination.photos.push({
        id,
        src: item.image,
        alt: "Synthetic Daily Photo assigned from Needs Date Review",
        caption: item.caption,
        timestamp: item.originalTimestamp,
        isCover: true,
      });
    }
  } else {
    const id = item.destinationId;
    if (!destination.journals.some((journal) => journal.id === id)) {
      destination.journals.push({
        id,
        kind: "VoiceNotes journal",
        title: item.title,
        timestamp: item.originalTimestamp,
        status: "Assigned from Needs Date Review · synthetic fixture",
        text: item.bodyPreview,
      });
    }
  }
  if (!state.capture.reviewHandoffKey) state.readinessFixture = "archive/populated";
  state.almanacEmptyArchive = false;
}

function dateReviewOperationIsCurrentV11(token) {
  return Boolean(token)
    && state.dateReview.assignment.status === "assigning"
    && state.dateReview.assignment.operation === token
    && state.dateReview.generation === token.generation
    && state.dateReview.fixture === token.fixture
    && state.dateReview.detailKey === token.key
    && state.dateReview.draft === token.date
    && state.view === "date-review"
    && state.shell.phase === "ready"
    && state.shell.ops.generation === token.sessionGeneration
    && state.shell.connection === "connected";
}

function completeDateReviewAssignmentV11(token) {
  dateReviewTimersV11.delete(token.id);
  if (!dateReviewOperationIsCurrentV11(token)) return;
  const review = state.dateReview;
  const item = dateReviewItem(token.key);
  const removedIndex = review.unresolved.indexOf(token.key);
  if (!item || removedIndex < 0) return;
  if (review.branch === "repeat-failure") {
    dispatchDateReview("ASSIGN_FAIL", { operation: token });
    clearDateReviewAnnouncementV11();
    state.focusAfterRender = "#date-review-assignment-failure-v11";
    render();
    reconcileDateReviewSafeFocusV11("#date-review-assignment-failure-v11");
    return;
  }
  ensureDateReviewDestinationV11(item, token.date);
  const message = `${item.successNoun} added to ${dateReviewDisplayDate(token.date)}.`;
  dispatchDateReview("ASSIGN_SUCCESS", { operation: token, key: item.key, date: token.date, message });
  if (state.capture.reviewHandoffKey === item.key) {
    if (state.capture.fixtureIdentity) captureResolvedReviewIdentitiesV12.add(state.capture.fixtureIdentity);
    dispatchCaptureV12("REVIEW_RESOLVED");
  }
  const remaining = state.dateReview.unresolved.length;
  if (!remaining) state.focusAfterRender = "#date-review-empty-title-v11";
  else {
    const nextIndex = Math.min(removedIndex, remaining - 1);
    state.focusAfterRender = `#date-review-row-v11-${nextIndex}`;
  }
  syncUrl({ focusSelector: state.focusAfterRender, scrollY: window.scrollY });
  render();
  reconcileDateReviewSafeFocusV11(
    state.dateReview.unresolved.length ? `#date-review-row-v11-${Math.min(removedIndex, state.dateReview.unresolved.length - 1)}` : "#date-review-empty-title-v11",
    { refreshPriorQueueEntry: true },
  );
  announceDateReview(`${message} ${remaining} ${remaining === 1 ? "item remains" : "items remain"} in Needs Date Review.`);
}

function beginDateReviewAssignmentV11({ retry = false } = {}) {
  const review = state.dateReview;
  const item = dateReviewItem(review.detailKey);
  const validation = validateDateReviewDate(review.draft);
  if (!item || validation.kind !== "valid" || !review.preview || review.assignment.status === "assigning" || state.shell.connection !== "connected") return;
  const token = Object.freeze({
    id: ++dateReviewOperationSequenceV11,
    identity: `${item.key}|${review.draft}|${review.generation}`,
    key: item.key,
    date: review.draft,
    generation: review.generation,
    fixture: review.fixture,
    sessionGeneration: state.shell.ops.generation,
  });
  dispatchDateReview("ASSIGN_START", { operation: token });
  state.focusAfterRender = "#date-review-operation-status-v11";
  render();
  reconcileDateReviewSafeFocusV11("#date-review-operation-status-v11");
  announceDateReview("Assigning Journal Date. The preserved item remains unresolved until completion.");
  const timer = window.setTimeout(() => completeDateReviewAssignmentV11(token), 720);
  dateReviewTimersV11.set(token.id, timer);

  if (state.dateReview.branch === "rapid-repeat") beginDateReviewAssignmentV11({ retry });
  else if (state.dateReview.branch === "navigate-before-completion") {
    setView("calendar");
  } else if (state.dateReview.branch === "date-change-before-completion") {
    window.clearTimeout(timer);
    dateReviewTimersV11.delete(token.id);
    dispatchDateReview("INVALIDATE");
    const changedDate = token.date === "0001-01-01" ? "0001-01-02" : shiftDate(token.date, -1);
    setDateReviewDraftV11(changedDate, { announce: false });
    announceDateReview("The date changed before completion. Nothing was assigned.");
  } else if (state.dateReview.branch === "connection-interruption") {
    window.clearTimeout(timer);
    dateReviewTimersV11.delete(token.id);
    dispatchDateReview("ASSIGN_FAIL", { operation: token });
    dispatchShell("CONNECTION_INTERRUPT");
    clearDateReviewAnnouncementV11();
    state.focusAfterRender = "#date-review-assignment-failure-v11";
    render();
    reconcileDateReviewSafeFocusV11("#date-review-assignment-failure-v11");
  }
}

function retryDateReviewLoadV11() {
  const existing = [...dateReviewTimersV11.keys()].find((key) => String(key).startsWith("load-"));
  if (existing) return;
  dispatchDateReview("LOAD_START");
  const attempt = state.dateReview.loadAttempt;
  const token = `load-${++dateReviewLoadSequenceV11}`;
  state.focusAfterRender = "#date-review-loading-title-v11";
  render();
  reconcileDateReviewSafeFocusV11("#date-review-loading-title-v11");
  announceDateReview("Loading items that need a Journal Date.");
  const timer = window.setTimeout(() => {
    dateReviewTimersV11.delete(token);
    if (state.view !== "date-review" || attempt !== state.dateReview.loadAttempt) return;
    if (state.dateReview.branch === "repeat-failure") {
      dispatchDateReview("LOAD_FAIL", { loadAttempt: attempt });
      clearDateReviewAnnouncementV11();
      state.focusAfterRender = "#date-review-load-failure-title-v11";
      render();
      reconcileDateReviewSafeFocusV11("#date-review-load-failure-title-v11");
      return;
    }
    restoreDateReviewDestinationsV11();
    establishDateReviewArchiveBaselineV11(true);
    dispatchDateReview("LOAD_READY", { loadAttempt: attempt });
    state.focusAfterRender = "#date-review-title-v11";
    render();
    reconcileDateReviewSafeFocusV11("#date-review-title-v11");
    announceDateReview("4 items need a Journal Date.");
  }, 650);
  dateReviewTimersV11.set(token, timer);
  if (state.dateReview.branch === "rapid-repeat") retryDateReviewLoadV11();
}

function runDateReviewScenarioV11() {
  if (state.dateReview.status === "failed") {
    retryDateReviewLoadV11();
    return;
  }
  if (state.dateReview.status !== "settled" || !state.dateReview.unresolved.length) return;
  if (!state.dateReview.detailKey) openDateReviewItemV11(0, { guided: true });
  else {
    const item = dateReviewItem(state.dateReview.detailKey);
    if (item && state.dateReview.draft !== item.guidedDate) setDateReviewDraftV11(item.guidedDate, { announce: false });
  }
  beginDateReviewAssignmentV11();
}

function viewDateReviewDayV11(date) {
  if (!days[date] || validateDateReviewDate(date).kind !== "valid") return;
  saveCurrentHistorySnapshot();
  state.viewMemory["date-review"] = captureViewMemory("date-review");
  clearDateReviewAnnouncementV11();
  state.view = "calendar";
  state.month = date.slice(0, 7);
  state.calendarMonth = state.month;
  state.selectedDate = date;
  state.focusDate = date;
  state.screen = "day";
  state.focusAfterRender = ".day-detail-header .back-button";
  syncUrl({ push: true, originAlreadySaved: true, fullDayOpenedInApp: true, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
}

function resetShellViewV10({ populated = false, selectedDate = null, screen = "month" } = {}) {
  cancelCaptureOperationsV12();
  captureCommittedIdentitiesV12.clear();
  captureResolvedReviewIdentitiesV12.clear();
  captureDayHistoryTargetsV12.clear();
  state.capture = initialCaptureStateV12((state.capture?.generation || 0) + 1, state.capture?.branch || "success");
  state.captureArchiveActive = false;
  resetDateReviewV11("date-review/empty");
  resetSyntheticArchiveDaysV10(populated);
  state.readinessFixture = populated ? "archive/populated" : "first-use/default";
  state.almanacEmptyArchive = !populated;
  state.view = "calendar";
  state.month = "2026-08";
  state.calendarMonth = "2026-08";
  state.almanacMonth = "2026-08";
  state.almanacThrough = "2026-08";
  state.almanacVisibleMonth = "2026-08";
  state.almanacVisibleDate = selectedDate;
  state.selectedDate = selectedDate;
  state.focusDate = selectedDate || today;
  state.screen = screen;
  state.searchQuery = "";
  state.searchDraft = "";
  state.modal = null;
  state.viewMemory = { calendar: null, almanac: null, search: null, settings: null, "date-review": null, "telegram-capture": null };
  state.scrollByView = { calendar: 0, almanac: 0, search: 0, settings: 0, "date-review": 0, "telegram-capture": 0 };
}

function setShellFixtureV10(fixture) {
  inheritedAsyncGenerationV10 += 1;
  state.generation = {};
  cancelShellOperations();
  clearShellBoundaryTransientsV10();
  const requestedFixture = Object.hasOwn(SHELL_FIXTURES, fixture) ? fixture : "shell/ready";
  const populated = ["shell/month-failure", "shell/media-failure", "shell/connection-interrupted", "shell/correction-interrupted"].includes(requestedFixture);
  resetSyntheticArchiveDaysV10(populated);
  dispatchShell("FIXTURE_SET", { fixture });
  const safeFixture = state.shell.fixture;
  const selectedDate = safeFixture === "shell/media-failure" ? SHELL_MEDIA_ITEM.date : safeFixture === "shell/correction-interrupted" ? SHELL_MEDIA_ITEM.date : null;
  resetShellViewV10({ populated, selectedDate, screen: safeFixture === "shell/correction-interrupted" ? "day" : "month" });
  if (safeFixture === "shell/correction-interrupted") {
    state.modal = { type: "correction-v10", focusSelector: "#correction-draft-v10" };
  }
  if (["shell/session-expired", "shell/session-expired-with-draft"].includes(safeFixture)) {
    state.focusAfterRender = "#session-gate-title-v10";
  } else if (safeFixture === "shell/app-loading") state.focusAfterRender = "#app-loading-title-v10";
  else if (safeFixture === "shell/server-failure") state.focusAfterRender = "#server-failure-title-v10";
  else if (safeFixture === "shell/month-failure") state.focusAfterRender = '[data-action="retry-shell-month"]';
  else if (safeFixture === "shell/media-failure") state.focusAfterRender = `[data-action="retry-shell-image"][data-photo-id="${SHELL_MEDIA_ITEM.photoId}"]`;
  else state.focusAfterRender = isFirstUseFixture() ? "#first-use-title-v9" : "#prototype-main";
  syncUrl({ scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  requestAnimationFrame(() => {
    withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
    requestAnimationFrame(() => {
      withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
      if (safeFixture === "shell/media-failure") {
        withInstantScroll(() => resolveLogicalSelector(`[data-action="retry-shell-image"][data-photo-id="${SHELL_MEDIA_ITEM.photoId}"]`)?.scrollIntoView({ behavior: "auto", block: "nearest" }));
      }
    });
  });
  announceShell(`Prototype state changed to ${SHELL_FIXTURES[safeFixture]}.`);
}

function requestCalendarMonthV10(target, { focusDate = null, focusTarget = "calendar-cell" } = {}) {
  if (!isMonthKey(target) || target === state.month) return;
  const origin = state.month;
  const token = beginOp("month", `${origin}->${target}`);
  if (!token) return;
  dispatchShell("MONTH_START", { origin, target });
  state.modal = null;
  state.focusAfterRender = "#month-loading-title-v10";
  render();
  announceShell(`Loading ${monthLabel(target)}.`);
  scheduleOp(token, () => {
    if (state.shell.branch === "repeat-failure") {
      dispatchShell("MONTH_FAIL");
      state.focusAfterRender = '[data-action="retry-shell-month"]';
      render();
      announceShell(`${monthLabel(target)} could not be loaded. ${monthLabel(origin).replace(/\s+\d{4}$/, "")} remains shown and unchanged.`);
      return;
    }
    dispatchShell("MONTH_READY");
    setCalendarMonth(target, { push: true, focusDate, focusTarget });
  });
  if (state.shell.branch === "navigate-before-completion") {
    cancelShellOpsForNavigationV10();
    setView("search");
  }
}

function retryShellMediaV10(date, photoId) {
  const media = state.shell.media[photoId];
  if (!media || media.status === "available") return;
  const retrySelector = `[data-action="retry-shell-image"][data-photo-id="${CSS.escape(photoId)}"]`;
  const itemSelector = state.view === "calendar" && state.screen === "month" && state.selectedDate === date
    ? `#museum-media-${date}`
    : state.view === "calendar" && state.screen === "month"
      ? `[data-calendar-date="${date}"]`
      : state.view === "almanac" && state.screen === "month"
        ? `#chapter-${date}`
        : `#gallery-title-${date}`;
  const pendingFocusSelector = resolveLogicalSelector(retrySelector) ? retrySelector : itemSelector;
  if (state.shell.connection !== "connected") {
    dispatchShell("MEDIA_RETRY_FAIL", { photoId });
    announceShell("The image is still unavailable. Check the connection before retrying.");
    state.focusAfterRender = pendingFocusSelector;
    render();
    return;
  }
  const token = beginOp("media", photoId);
  if (!token) return;
  dispatchShell("MEDIA_RETRY_START", { photoId });
  state.focusAfterRender = pendingFocusSelector;
  render();
  scheduleOp(token, () => {
    if (state.shell.branch === "repeat-failure") {
      dispatchShell("MEDIA_RETRY_FAIL", { photoId });
      announceShell("The image is still unavailable.");
    } else {
      dispatchShell("MEDIA_READY", { photoId });
      announceShell("Image available.");
    }
    state.focusAfterRender = itemSelector;
    render();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const block = itemSelector.startsWith("#gallery-title-") ? "center" : "nearest";
      withInstantScroll(() => resolveLogicalSelector(itemSelector)?.scrollIntoView({ behavior: "auto", block }));
    }));
  });
  if (state.shell.branch === "navigate-before-completion") {
    cancelShellOpsForNavigationV10();
    setView("search");
  }
}

function shellReadyFocusSelectorV10() {
  if (state.view === "date-review") {
    if (state.dateReview.detailKey) return state.dateReview.assignment.status === "failed" ? "#date-review-assignment-failure-v11" : "#date-review-detail-title-v11";
    return "#date-review-title-v11";
  }
  if (state.screen === "day") return ".day-detail-header .back-button";
  if (state.view === "search") return "#archive-search-input-v9";
  if (state.view === "settings") return "#settings-section-heading";
  if (state.view === "almanac") return '[data-action="almanac-today"]';
  if (isFirstUseFixture()) return "#first-use-title-v9";
  return '[data-action="open-month-chooser"]';
}

function checkShellConnectionV10() {
  if (state.shell.connection === "checking") return;
  const token = beginOp("connection", "primary");
  if (!token) return;
  dispatchShell("CONNECTION_CHECK_START");
  if (state.modal?.type === "correction-v10") state.modal.focusSelector = '[data-action="check-shell-connection"]';
  else state.focusAfterRender = '[data-action="check-shell-connection"]';
  render();
  scheduleOp(token, () => {
    if (state.shell.branch === "repeat-failure") {
      dispatchShell("CONNECTION_CHECK_FAIL");
      announceShell("Still disconnected. Nothing was saved.", { assertive: Boolean(state.shell.correction.open) });
    } else {
      dispatchShell("CONNECTION_RESTORE");
      announceShell("Connection restored. Refresh content before relying on the latest changes.");
    }
    if (state.modal?.type === "correction-v10") state.modal.focusSelector = state.shell.correction.status === "failed" ? '[data-action="retry-shell-correction"]' : "#correction-draft-v10";
    else state.focusAfterRender = state.shell.connection === "connected" ? "#connection-restored-v10" : '[data-action="check-shell-connection"]';
    render();
  });
  if (state.shell.branch === "navigate-before-completion" && state.modal?.type !== "correction-v10") {
    // Connection checks are the only shell operation allowed to survive an
    // ordinary view change. The destination keeps the interrupted banner
    // until this same guarded check settles.
    setView("search");
  }
}

function openShellCorrectionV10(date, journalId, returnFocusSelector = null) {
  const journal = days[date]?.journals?.find((item) => item.id === journalId);
  if (!journal) return;
  dispatchShell("CORRECTION_OPEN", { date, journalId, baseline: journal.text, returnFocusSelector });
  state.modal = { type: "correction-v10", focusSelector: "#correction-draft-v10", scrollY: window.scrollY };
  render();
}

function saveShellCorrectionV10({ retry = false } = {}) {
  const liveEditor = modalRoot.querySelector("#correction-draft-v10");
  if (liveEditor && !liveEditor.disabled) {
    dispatchShell("CORRECTION_SELECTION", {
      selection: {
        start: liveEditor.selectionStart,
        end: liveEditor.selectionEnd,
        direction: liveEditor.selectionDirection,
      },
    });
  }
  const correction = state.shell.correction;
  if (!correction.open || !correction.dirty || correction.status === "saving") return;
  if (state.shell.connection !== "connected") {
    dispatchShell("CORRECTION_SAVE_FAIL");
    state.modal.focusSelector = "#correction-save-failure-v10";
    render();
    requestAnimationFrame(() => withInstantScroll(() => resolveLogicalSelector("#correction-save-failure-v10")?.scrollIntoView({ behavior: "auto", block: "nearest" })));
    announceShell("Correction not saved. The connection was interrupted.", { assertive: true });
    return;
  }
  const key = `${correction.date}:${correction.journalId}`;
  const token = beginOp("correction", key);
  if (!token) return;
  dispatchShell("CORRECTION_SAVE_START", { operationKey: key });
  state.modal.focusSelector = "#correction-operation-status-v10";
  render();
  announceShell("Saving Correction.");
  scheduleOp(token, () => {
    if (state.shell.branch === "repeat-failure") {
      // The synthetic repeat-failure path represents a connection loss during
      // the save. Keep the global shell and the local draft result truthful as
      // one coordinated state, including clearing any prior restored message.
      dispatchShell("CONNECTION_INTERRUPT");
      dispatchShell("CORRECTION_SAVE_FAIL");
      state.modal.focusSelector = "#correction-save-failure-v10";
      announceShell("Correction not saved. The connection was interrupted.", { assertive: true });
    } else {
      dispatchShell("CORRECTION_SAVE_READY");
      state.modal.focusSelector = '[data-action="close-shell-correction"]';
      announceShell("Correction save simulated. One Correction is displayed in this tab; nothing was persisted.");
    }
    render();
    if (state.shell.correction.status === "failed") {
      requestAnimationFrame(() => withInstantScroll(() => resolveLogicalSelector("#correction-save-failure-v10")?.scrollIntoView({ behavior: "auto", block: "nearest" })));
    }
  });
  if (retry && state.shell.branch === "rapid-repeat") saveShellCorrectionV10({ retry: true });
}

function requestCorrectionLeaveV10(reason = "leave", navigation = null) {
  pendingLeaveNavigation = navigation;
  dispatchShell("LEAVE_REQUEST", { reason });
  state.modal = { type: "leave-correction-v10", focusSelector: '[data-action="keep-shell-correction"]' };
  render();
}

function expireShellSessionV10() {
  const hadDraft = state.shell.correction.dirty;
  inheritedAsyncGenerationV10 += 1;
  state.generation = {};
  cancelShellOperations();
  dispatchShell("SESSION_EXPIRE", { hadDraft });
  clearShellBoundaryTransientsV10();
  state.modal = null;
  resetShellViewV10();
  state.focusAfterRender = "#session-gate-title-v10";
  syncUrl({ push: false, scrollY: 0, focusSelector: null, focusTop: null });
  render();
  announceShell("Your session has ended.", { assertive: true });
}

function retryShellServerV10() {
  const key = state.shell.server.settled ? "settled-request" : "load-archive";
  const token = beginOp("server", key);
  if (!token) return;
  dispatchShell("SERVER_RETRY_START");
  state.focusAfterRender = state.shell.server.settled ? '[data-action="retry-shell-server"]' : "#app-loading-title-v10";
  render();
  scheduleOp(token, () => {
    if (state.shell.branch === "repeat-failure") {
      dispatchShell("SERVER_RETRY_FAIL");
      announceShell("Life in Days could not complete this request.");
      state.focusAfterRender = '[data-action="retry-shell-server"]';
    } else {
      dispatchShell("SERVER_RETRY_READY");
      announceShell("Archive available in this prototype.");
      state.focusAfterRender = shellReadyFocusSelectorV10();
    }
    render();
  });
  if (state.shell.branch === "navigate-before-completion") {
    cancelShellOpsForNavigationV10();
    setView("search");
    state.focusAfterRender = "#server-failure-title-v10";
    render();
    announceShell("Server retry cancelled before completion.");
  }
}

function revealGuidedShellSurfaceV10() {
  // The separate prototype console lives after the application surface. A
  // guided branch replaces or updates that surface, so reveal the outcome
  // instead of leaving its logical focus above the compact viewport.
  requestAnimationFrame(() => {
    withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
    requestAnimationFrame(() => withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" })));
  });
}

function runShellScenarioV10() {
  const fixture = state.shell.fixture;
  if (fixture === "shell/app-loading") {
    if (state.shell.branch === "navigate-before-completion") {
      dispatchShell("APP_LOAD_READY");
      setView("search");
      announceShell("Initial loading cancelled before completion.");
    } else if (state.shell.branch === "repeat-failure") {
      dispatchShell("APP_LOAD_FAIL");
      state.focusAfterRender = "#server-failure-title-v10";
    } else {
      dispatchShell("APP_LOAD_READY");
      state.focusAfterRender = shellReadyFocusSelectorV10();
    }
    if (state.shell.branch !== "navigate-before-completion") render();
  } else if (fixture === "shell/month-failure") {
    requestCalendarMonthV10(state.shell.pendingMonth?.target || "2026-09");
    if (state.shell.branch === "rapid-repeat") requestCalendarMonthV10(state.shell.pendingMonth?.target || "2026-09");
  } else if (fixture === "shell/media-failure") {
    retryShellMediaV10(SHELL_MEDIA_ITEM.date, SHELL_MEDIA_ITEM.photoId);
    if (state.shell.branch === "rapid-repeat") retryShellMediaV10(SHELL_MEDIA_ITEM.date, SHELL_MEDIA_ITEM.photoId);
  } else if (["shell/connection-interrupted", "shell/correction-interrupted"].includes(fixture)) {
    checkShellConnectionV10();
    if (state.shell.branch === "rapid-repeat") checkShellConnectionV10();
  } else if (fixture === "shell/server-failure") {
    retryShellServerV10();
    if (state.shell.branch === "rapid-repeat") retryShellServerV10();
  }
  else announceShell("Ready state has no pending operation.");
  if (fixture !== "shell/ready") revealGuidedShellSurfaceV10();
}

function cancelShellOpsForNavigationV10() {
  const hadPendingMonth = state.shell.pendingMonth?.status === "pending";
  const pendingMedia = Object.entries(state.shell.media).filter(([, media]) => media.status === "pending").map(([photoId]) => photoId);
  const correctionSaving = state.shell.correction.status === "saving";
  const serverPending = state.shell.server.status === "pending";
  cancelShellOperations(["month", "media", "correction", "server"]);
  if (hadPendingMonth) dispatchShell("MONTH_CANCEL");
  pendingMedia.forEach((photoId) => dispatchShell("MEDIA_RETRY_FAIL", { photoId }));
  if (correctionSaving) dispatchShell("CORRECTION_SAVE_FAIL");
  if (serverPending) dispatchShell("SERVER_RETRY_FAIL");
  if (state.dateReview.assignment.status === "assigning" || dateReviewTimersV11.size) cancelDateReviewOperationsV11();
  if (state.view === "telegram-capture" || state.capture.active || captureTimersV12.size) {
    cancelCaptureOperationsV12({
      keepTerminal: state.view === "telegram-capture" && !state.capture.active,
      stage: state.capture.active ? "selected" : state.capture.stage,
    });
  }
}

function handleClick(event) {
  const control = event.target.closest("[data-action]");
  if (!control) return;
  if (control.disabled || control.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
    return;
  }
  const action = control.dataset.action;
  const date = control.dataset.date;

  if (action === "toggle-shell-lab") {
    state.shellLabOpen = !control.parentElement.open;
    return;
  }

  if (action === "open-capture-companion" || action === "capture-open-selected") {
    openCaptureCompanionV12(control);
    return;
  }
  if (action === "capture-select") {
    selectCaptureFixtureV12({ group: control.dataset.captureGroup, key: control.dataset.captureKey }, { open: true });
    return;
  }
  if (action === "capture-branch") {
    const fixtureIdentity = state.capture.fixtureIdentity;
    const hasDurableCaptureTruth = Boolean(fixtureIdentity) && (
      captureCommittedIdentitiesV12.has(fixtureIdentity)
      || [...captureCommittedIdentitiesV12].some((identity) => identity.startsWith(`${fixtureIdentity}:member-`))
    );
    cancelCaptureOperationsV12({
      keepTerminal: hasDurableCaptureTruth,
      stage: hasDurableCaptureTruth ? state.capture.stage : "selected",
    });
    dispatchCaptureV12("BRANCH_SET", { branch: control.dataset.captureBranch });
    state.focusAfterRender = `[data-action="capture-branch"][data-capture-branch="${CSS.escape(state.capture.branch)}"]`;
    render();
    announceCaptureV12(`Operation branch set to ${CAPTURE_OPERATION_BRANCHES_V12[state.capture.branch]}.`);
    return;
  }
  if (action === "capture-reset") {
    selectCaptureFixtureV12({ group: "scenario", key: "guide" }, { open: true });
    return;
  }
  if (action === "capture-run") {
    beginCaptureOperationV12();
    return;
  }
  if (action === "capture-retry") {
    beginCaptureOperationV12({ retry: true });
    return;
  }
  if (action === "capture-back") {
    captureBackV12();
    return;
  }
  if (action === "capture-handoff-back") {
    window.history.back();
    return;
  }
  if (action === "capture-change-date") {
    openCaptureChangeDateV12(control);
    return;
  }
  if (action === "capture-view-day") {
    viewCaptureDayV12(control);
    return;
  }
  if (action === "capture-review-date") {
    openCaptureReviewDateV12(control);
    return;
  }

  if (action === "set-date-review-fixture") {
    setDateReviewFixtureV11(control.dataset.fixture);
    return;
  }
  if (action === "set-date-review-branch") {
    dispatchDateReview("BRANCH_SET", { branch: control.dataset.branch });
    state.focusAfterRender = `[data-action="set-date-review-branch"][data-branch="${CSS.escape(state.dateReview.branch)}"]`;
    render();
    announceDateReview(`Needs Date Review branch set to ${DATE_REVIEW_BRANCHES[state.dateReview.branch]}.`);
    return;
  }
  if (action === "open-date-review-guided-item") {
    const requestedIndex = Math.min(3, Math.max(0, Number(control.dataset.reviewIndex) || 0));
    if (state.dateReview.fixture !== "date-review/populated" || state.dateReview.status !== "settled" || state.dateReview.unresolved.length !== 4) {
      resetDateReviewV11("date-review/populated");
    }
    state.modal = null;
    if (state.view !== "date-review") setView("date-review");
    openDateReviewItemV11(requestedIndex);
    return;
  }
  if (action === "run-date-review-scenario") {
    runDateReviewScenarioV11();
    return;
  }

  if (action === "set-shell-fixture") {
    setShellFixtureV10(control.dataset.fixture);
    return;
  }
  if (action === "set-shell-branch") {
    dispatchShell("BRANCH_SET", { branch: control.dataset.branch });
    state.focusAfterRender = `[data-action="set-shell-branch"][data-branch="${CSS.escape(state.shell.branch)}"]`;
    render();
    announceShell(`Guided branch set to ${control.textContent.trim()}.`);
    return;
  }
  if (action === "run-shell-scenario") {
    runShellScenarioV10();
    return;
  }
  if (action === "toggle-shell-connection") {
    if (["interrupted", "checking"].includes(state.shell.connection)) dispatchShell("CONNECTION_RESTORE");
    else {
      if (state.dateReview.assignment.status === "assigning" || dateReviewTimersV11.size) cancelDateReviewOperationsV11({ preserveFailure: true });
      if (state.capture.active) {
        cancelCaptureOperationsV12({
          stage: "interrupted",
          terminal: { type: "interrupted", stage: "interrupted" },
          retryAvailable: true,
        });
      } else if (state.capture.terminal?.type === "partial" && !state.capture.terminal.retryAvailable && captureSelectedFixtureV12().key === "t3") {
        cancelCaptureOperationsV12({
          stage: "partial",
          terminal: { ...state.capture.terminal, retryAvailable: true },
        });
      }
      dispatchShell("CONNECTION_INTERRUPT");
    }
    state.focusAfterRender = '[data-action="toggle-shell-connection"]';
    render();
    announceShell(state.shell.connection === "connected" ? "Connection restored in this prototype." : "Connection interrupted.");
    return;
  }
  if (action === "toggle-shell-server-variant") {
    const settled = !state.shell.server.settled;
    clearShellBoundaryTransientsV10();
    dispatchShell("SERVER_FAIL", { settled });
    resetShellViewV10({ populated: settled });
    state.focusAfterRender = settled ? "#prototype-main" : "#server-failure-title-v10";
    syncUrl({ scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
    render();
    requestAnimationFrame(() => {
      withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
      requestAnimationFrame(() => withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" })));
    });
    announceShell(settled ? "Settled request failure shown. Existing content remains unchanged." : "Total server failure shown. Archive content is not shown as current.");
    return;
  }
  if (action === "retry-shell-month") {
    requestCalendarMonthV10(state.shell.pendingMonth?.target || "2026-09");
    return;
  }
  if (action === "retry-shell-image") {
    retryShellMediaV10(date, control.dataset.photoId);
    return;
  }
  if (action === "check-shell-connection") {
    checkShellConnectionV10();
    return;
  }
  if (action === "correct-text") {
    openShellCorrectionV10(date, control.dataset.journalId, selectorForLogicalFocus(control));
    return;
  }
  if (action === "save-shell-correction") {
    saveShellCorrectionV10();
    return;
  }
  if (action === "retry-shell-correction") {
    if (state.shell.connection !== "connected") {
      dispatchShell("CORRECTION_SAVE_FAIL");
      dispatchShell("CONNECTION_CHECK_FAIL");
      state.modal.focusSelector = '[data-action="retry-shell-correction"]';
      render();
      announceShell("Still disconnected. Nothing was saved.", { assertive: true });
    } else saveShellCorrectionV10({ retry: true });
    return;
  }
  if (action === "cancel-shell-correction") {
    if (state.shell.correction.dirty) requestCorrectionLeaveV10("cancel", { kind: "close" });
    else {
      const returnSelector = state.shell.correction.returnFocusSelector;
      dispatchShell("CORRECTION_CLOSE");
      state.modal = null;
      state.focusAfterRender = returnSelector;
      render();
    }
    return;
  }
  if (action === "close-shell-correction") {
    const returnSelector = state.shell.correction.returnFocusSelector || `#journal-${state.shell.correction.journalId}`;
    dispatchShell("CORRECTION_CLOSE");
    state.modal = null;
    state.focusAfterRender = returnSelector;
    render();
    return;
  }
  if (action === "keep-shell-correction") {
    pendingLeaveNavigation = null;
    dispatchShell("LEAVE_KEEP");
    state.modal = { type: "correction-v10", focusSelector: "#correction-draft-v10" };
    render();
    return;
  }
  if (action === "discard-shell-correction") {
    const pending = pendingLeaveNavigation;
    pendingLeaveNavigation = null;
    dispatchShell("LEAVE_DISCARD");
    state.modal = null;
    if (pending?.kind === "pop" && Number.isFinite(pending.delta) && pending.delta !== 0) {
      window.history.go(pending.delta);
    } else {
      state.focusAfterRender = state.shell.correction.returnFocusSelector;
      render();
    }
    return;
  }
  if (action === "expire-shell-session") {
    expireShellSessionV10();
    return;
  }
  if (action === "start-shell-reauth") {
    dispatchShell("REAUTH_START");
    state.focusAfterRender = "#session-gate-title-v10";
    render();
    return;
  }
  if (action === "return-from-shell-reauth") {
    cancelShellOperations();
    clearShellBoundaryTransientsV10();
    dispatchShell("REAUTH_RETURN");
    resetShellViewV10();
    historyEntries.clear();
    historyPositions.clear();
    currentHistoryPosition = 0;
    const entryId = nextHistoryEntryId();
    historyEntries.set(entryId, captureHistorySnapshot({ scrollY: 0, focusSelector: "#first-use-title-v9", focusTop: null }));
    historyPositions.set(entryId, 0);
    window.history.replaceState({ entryId }, "", canonicalRouteUrl());
    state.focusAfterRender = "#first-use-title-v9";
    render();
    announceShell("Returned to Life in Days in this prototype. No authentication was performed.");
    return;
  }
  if (action === "retry-shell-server") {
    retryShellServerV10();
    return;
  }
  if (["set-view", "open-settings", "set-settings-section", "open-more", "open-date-review", "select-day", "open-day", "open-full-day", "close-day", "adjacent-day", "open-search-result", "previous-month", "next-month", "today", "choose-month"].includes(action)) {
    cancelShellOpsForNavigationV10();
  }
  if (state.almanacStatus === "loading" && !["load-earlier", "retry-load-earlier"].includes(action)) {
    state.almanacLoadRequestId += 1;
    state.almanacStatus = "idle";
    state.almanacFailNext = false;
  }

  if (action === "open-date-review") {
    openDateReviewV11(control);
  } else if (action === "open-date-review-item") {
    openDateReviewItemV11(control.dataset.reviewIndex);
  } else if (action === "close-date-review-item") {
    closeDateReviewItemV11();
  } else if (action === "open-date-review-picker") {
    const selected = validateDateReviewDate(state.dateReview.draft).kind === "valid" ? state.dateReview.draft : null;
    const month = selected ? selected.slice(0, 7) : "2026-08";
    state.modal = {
      type: "date-review-picker",
      month,
      focusDate: selected || `${month}-01`,
      returnFocusSelector: '[data-action="open-date-review-picker"]',
      focusSelector: `.date-picker-day-v11[data-picker-date="${selected || `${month}-01`}"]`,
    };
    render();
  } else if (action === "date-review-picker-month") {
    const candidate = shiftMonth(state.modal.month, Number(control.dataset.delta));
    if (candidate < "0001-01" || candidate > "2026-08") return;
    state.modal.month = candidate;
    state.modal.focusDate = `${candidate}-01`;
    state.modal.focusSelector = `.date-picker-day-v11[data-picker-date="${state.modal.focusDate}"]`;
    render();
  } else if (action === "date-review-picker-year") {
    const [year, month] = state.modal.month.split("-").map(Number);
    const nextYear = Math.min(2026, Math.max(1, year + Number(control.dataset.delta)));
    let candidate = `${String(nextYear).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
    if (candidate > "2026-08") candidate = "2026-08";
    state.modal.month = candidate;
    state.modal.focusDate = `${candidate}-01`;
    state.modal.focusSelector = `.date-picker-day-v11[data-picker-date="${state.modal.focusDate}"]`;
    render();
  } else if (action === "choose-date-review-date") {
    const chosen = control.dataset.pickerDate;
    if (validateDateReviewDate(chosen).kind !== "valid") return;
    state.modal = null;
    setDateReviewDraftV11(chosen, { announce: true });
  } else if (action === "retry-date-review-load") {
    retryDateReviewLoadV11();
  } else if (action === "retry-date-review-assignment") {
    beginDateReviewAssignmentV11({ retry: true });
  } else if (action === "view-date-review-day") {
    viewDateReviewDayV11(date);
  } else if (action === "set-view") {
    if (control.dataset.view === state.view && state.view === "calendar") {
      state.screen = "month";
      syncUrl({ push: true });
      render();
      restoreViewScroll("calendar");
    } else if (control.dataset.view !== state.view) setView(control.dataset.view);
  } else if (action === "open-settings") {
    openSettings(control.dataset.section || "overview");
  } else if (action === "set-settings-section") {
    setSettingsSection(control.dataset.section || "overview", { push: !control.classList.contains("settings-mobile-back") });
  } else if (action === "review-readiness") {
    const heading = root.querySelector("#readiness-title-v9");
    scrollElementIntoViewInstant(heading?.closest(".readiness-header-v9") || heading, "start");
    heading?.focus({ preventScroll: true });
  } else if (action === "view-readiness-settings") {
    openReadinessSettings(control.dataset.readinessKey, control);
  } else if (action === "open-readiness-disclosure") {
    const readinessKey = control.dataset.readinessKey;
    state.modal = {
      type: "readiness-disclosure",
      readinessKey,
      scrollY: window.scrollY,
      returnFocusSelector: `[data-action="open-readiness-disclosure"][data-readiness-key="${readinessKey}"]`,
      focusSelector: "#readiness-disclosure-title-v9",
    };
    render();
  } else if (action === "set-readiness-fixture") {
    setReadinessFixture(control.dataset.fixture);
  } else if (action === "open-more") {
    state.modal = { type: "more", returnFocusSelector: '[data-action="open-more"]' };
    render();
  } else if (action === "settings-related") {
    const label = control.dataset.label || "Management";
    if (state.modal) closeModal();
    toast(`${label} is a documented management surface outside this v10 Settings prototype.`);
  } else if (action === "toggle-theme") {
    state.themePreference = resolvedTheme() === "light" ? "dark" : "light";
    window.localStorage.setItem("life-in-days-v9-theme", state.themePreference);
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
    window.localStorage.setItem("life-in-days-v9-almanac-collapsed", String(state.almanacCollapsed));
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
      focusSelector: pending || "#almanac-drawer-title-v9",
    };
    render();
  } else if (action === "open-almanac-jump") {
    const returnToDrawer = state.modal?.type === "almanac-drawer";
    const returnFocusSelector = returnToDrawer
      ? ".almanac-mobile-drawer-v9 [data-action=\"open-almanac-jump\"]"
      : '.almanac-index-v9 [data-action="open-almanac-jump"]';
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
        : `.almanac-index-v9 [data-action="select-almanac-month"][data-month-key="${monthKey}"]`;
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
    state.focusAfterRender = "#archive-empty-title-v9";
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
    if (nextMonth === state.month) {
      state.focusAfterRender = `[data-calendar-date="${destinationFocus}"]`;
      render();
    } else requestCalendarMonthV10(nextMonth, { focusDate: destinationFocus, focusTarget: "calendar-cell" });
  } else if (action === "previous-month" || action === "next-month") {
    requestCalendarMonthV10(shiftMonth(state.month, action === "previous-month" ? -1 : 1));
  } else if (action === "today") {
    if (state.month === today.slice(0, 7)) {
      state.focusDate = today;
      state.focusAfterRender = `[data-calendar-date="${today}"]`;
      render();
    } else requestCalendarMonthV10(today.slice(0, 7), { focusDate: today });
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
    const searchInput = root.querySelector("#archive-search-input-v9");
    if (searchInput) searchInput.value = "";
    state.searchQuery = "";
    state.searchDraft = "";
    syncUrl({ focusSelector: "#archive-search-input-v9", focusTop: null });
    render();
    const clearedInput = root.querySelector("#archive-search-input-v9");
    clearedInput?.focus();
    state.scrollByView.search = window.scrollY;
    state.viewMemory.search = captureViewMemory("search");
    saveCurrentHistorySnapshot({
      scrollY: window.scrollY,
      focusSelector: "#archive-search-input-v9",
      focusTop: clearedInput?.getBoundingClientRect?.().top ?? null,
    });
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
  else if (action === "nav-placeholder") toast(`${control.dataset.label} is outside this v10 prototype’s review scope.`);
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
    window.localStorage.setItem("life-in-days-v9-theme", preference);
    state.focusAfterRender = `[data-action="set-theme-preference"][value="${preference}"]`;
    render();
    toast(`${preference === "device" ? "Device theme" : `${preference[0].toUpperCase()}${preference.slice(1)} theme`} applied.`);
    return;
  }
  if (!state.modal) return;
  if (control.dataset.action === "journal-file") readJournalFile(control.files?.[0]);
  if (control.dataset.action === "upload-date") state.modal.date = control.value;
}

function handleShellInputV10(event) {
  if (!event.target.matches("#correction-draft-v10")) return;
  const input = event.target;
  const wasFailed = state.shell.correction.status === "failed";
  dispatchShell("CORRECTION_INPUT", {
    draft: input.value,
    selection: { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection },
  });
  if (wasFailed) {
    state.modal.focusSelector = "#correction-draft-v10";
    render();
    return;
  }
  const card = input.closest("[data-modal-card]");
  const unsaved = card?.querySelector(".correction-status-v10");
  if (unsaved) unsaved.hidden = !state.shell.correction.dirty;
  const save = card?.querySelector('[data-action="save-shell-correction"]');
  if (save) {
    save.setAttribute("aria-disabled", String(!state.shell.correction.dirty));
  }
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
    requestCalendarMonthV10(targetMonth, { focusDate: targetDate, focusTarget: "calendar-cell" });
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

function handleDateReviewPickerKeyboardV11(event) {
  if (state.modal?.type !== "date-review-picker") return false;
  const cell = event.target.closest("[data-picker-date]");
  if (!cell) return false;
  const key = event.key;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(key)) return false;
  event.preventDefault();
  const currentDate = cell.dataset.pickerDate;
  let targetDate = currentDate;
  if (key === "PageUp" || key === "PageDown") {
    const candidateMonth = shiftMonth(currentDate.slice(0, 7), key === "PageUp" ? -1 : 1);
    if (candidateMonth < "0001-01" || candidateMonth > "2026-08") return true;
    targetDate = dateForMonthDay(candidateMonth, dateParts(currentDate).day);
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
  if (targetDate < "0001-01-01") return true;
  if (targetDate > DATE_REVIEW_MAX_DATE) targetDate = DATE_REVIEW_MAX_DATE;
  state.modal.month = targetDate.slice(0, 7);
  state.modal.focusDate = targetDate;
  state.modal.focusSelector = `.date-picker-day-v11[data-picker-date="${targetDate}"]`;
  render();
  return true;
}

function handleKeydown(event) {
  if (event.key === "Tab" && pendingNavigationFocusV12) invalidateNavigationFocusV12();
  const sessionGate = root.querySelector("[data-session-gate-v10]");
  if (event.key === "Tab" && sessionGate) {
    const focusable = [...sessionGate.querySelectorAll('button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((element) => element.getClientRects().length);
    const first = focusable[0] || sessionGate;
    const last = focusable.at(-1) || sessionGate;
    if (!focusable.includes(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
    return;
  }
  if (sessionGate) return;
  if (event.key === "Escape" && state.modal?.type === "leave-correction-v10") {
    event.preventDefault();
    pendingLeaveNavigation = null;
    dispatchShell("LEAVE_KEEP");
    state.modal = { type: "correction-v10", focusSelector: "#correction-draft-v10" };
    render();
    return;
  }
  if (event.key === "Escape" && state.modal?.type === "correction-v10") {
    event.preventDefault();
    if (state.shell.correction.status === "saving") {
      toast("Saving this Correction. Wait for the simulated result before leaving.");
      return;
    }
    if (state.shell.correction.dirty) requestCorrectionLeaveV10("escape", { kind: "close" });
    else {
      const returnSelector = state.shell.correction.returnFocusSelector;
      dispatchShell("CORRECTION_CLOSE");
      state.modal = null;
      state.focusAfterRender = returnSelector;
      render();
    }
    return;
  }
  if (event.key === "Escape" && !state.modal && state.view === "date-review" && state.dateReview.detailKey) {
    event.preventDefault();
    closeDateReviewItemV11();
    return;
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase("en-IN") === "k" && !state.modal) {
    event.preventDefault();
    if (state.view !== "search") setView("search");
    else root.querySelector("#archive-search-input-v9")?.focus();
    return;
  }
  if (event.key === "Enter" && !event.isComposing && event.target.matches("#archive-search-input-v9")) {
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
    if (!focusable.includes(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && (document.activeElement === first || document.activeElement === modal)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
    return;
  }
  if (handleDateReviewPickerKeyboardV11(event)) return;
  if (handleCalendarKeyboard(event)) return;
}

function submitSearchValue(value) {
  state.searchDraft = String(value || "");
  state.searchQuery = state.searchDraft.trim();
  if (state.viewMemory.search) {
    state.viewMemory.search.searchQuery = state.searchQuery;
    state.viewMemory.search.searchDraft = state.searchDraft;
  }
  state.focusAfterRender = state.searchQuery ? "#search-results-heading-v9" : "#archive-search-input-v9";
  syncUrl();
  render();
}

function handleSubmit(event) {
  const dateReviewForm = event.target.closest('[data-action="date-review-form"]');
  if (dateReviewForm) {
    event.preventDefault();
    const input = dateReviewForm.querySelector("#date-review-date-input-v11");
    const value = input?.value || "";
    const validation = validateDateReviewDate(value);
    if (validation.kind !== "valid") {
      dispatchDateReview("DRAFT_SET", { value, validation, preview: null });
      state.focusAfterRender = "#date-review-date-input-v11";
      state.pendingDateReviewSelection = { start: value.length, end: value.length, direction: "none" };
      render();
      return;
    }
    const item = dateReviewItem(state.dateReview.detailKey);
    if (!state.dateReview.preview) dispatchDateReview("DRAFT_SET", { value, validation, preview: dateReviewPreview(item, value) });
    beginDateReviewAssignmentV11();
    return;
  }
  const form = event.target.closest('[data-action="search-form"]');
  if (!form) return;
  event.preventDefault();
  submitSearchValue(form.querySelector("#archive-search-input-v9")?.value);
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
  const collapsedLabel = root.querySelector(".almanac-index-v9.is-collapsed .almanac-rail-toggle span");
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
  if (element.id === "archive-search-input-v9") return "#archive-search-input-v9";
  const control = element.closest?.("[data-action]");
  const chapter = element.closest?.("[data-chapter-date]");
  const inAlmanacIndex = Boolean(element.closest?.(".almanac-index-v9, .almanac-mobile-drawer-v9"));
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
    const fields = ["date", "monthKey", "delta", "view", "section", "photoId", "journalId", "reviewIndex", "pickerDate", "captureGroup", "captureKey", "captureBranch"];
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
    return `.almanac-index-v9 ${exact}`;
  }
  if (control?.dataset.action) {
    const fields = ["date", "monthKey", "delta", "view", "section", "photoId", "journalId", "reviewIndex", "pickerDate", "captureGroup", "captureKey", "captureBranch"];
    const qualifiers = fields
      .filter((field) => control.dataset[field] != null)
      .map((field) => `[data-${field.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${CSS.escape(control.dataset[field])}"]`)
      .join("");
    const exact = `[data-action="${CSS.escape(control.dataset.action)}"]${qualifiers}`;
    if (control.closest(".almanac-pagination-v9")) return `.almanac-pagination-v9 ${exact}`;
    if (control.closest(".almanac-title-actions")) return `.almanac-title-actions ${exact}`;
    if (control.closest(".almanac-empty-v9")) return `.almanac-empty-v9 ${exact}`;
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
  if (active?.id === "archive-search-input-v9") {
    state.searchSelection = {
      start: active.selectionStart,
      end: active.selectionEnd,
      direction: active.selectionDirection,
    };
  }
  if (selector === "#archive-search-input-v9" && state.searchSelection) state.pendingInputSelection = { ...state.searchSelection };
  return selector;
}

function handlePopState(event) {
  const targetPosition = historyPositions.get(event?.state?.entryId);
  if (["session-expired", "reauth"].includes(state.shell.phase)) {
    pendingPopGuard = null;
    suppressGuardedPopstate = false;
    if (Number.isFinite(targetPosition)) currentHistoryPosition = targetPosition;
    resetShellViewV10();
    const entryId = event?.state?.entryId || nextHistoryEntryId();
    historyEntries.set(entryId, captureHistorySnapshot({ scrollY: 0, focusSelector: null, focusTop: null }));
    historyPositions.set(entryId, currentHistoryPosition);
    window.history.replaceState({ entryId }, "", canonicalRouteUrl());
    state.focusAfterRender = "#session-gate-title-v10";
    render();
    return;
  }
  if (suppressGuardedPopstate && pendingPopGuard) {
    suppressGuardedPopstate = false;
    currentHistoryPosition = pendingPopGuard.originPosition;
    const delta = pendingPopGuard.targetPosition - pendingPopGuard.originPosition;
    pendingPopGuard = null;
    requestCorrectionLeaveV10("history", { kind: "pop", delta });
    return;
  }
  if (state.shell.correction.dirty) {
    // A history attempt is a navigation boundary. Invalidate any in-flight
    // save before presenting the leave guard so a stale completion cannot
    // mark the draft saved behind an "unsaved" confirmation.
    cancelShellOpsForNavigationV10();
    const resolvedTarget = Number.isFinite(targetPosition) ? targetPosition : currentHistoryPosition - 1;
    const returnDelta = currentHistoryPosition - resolvedTarget;
    pendingPopGuard = { originPosition: currentHistoryPosition, targetPosition: resolvedTarget };
    suppressGuardedPopstate = true;
    window.history.go(returnDelta || 1);
    return;
  }
  if (Number.isFinite(targetPosition)) currentHistoryPosition = targetPosition;
  const previousView = state.view;
  const dateReviewHadPendingOperation = previousView === "date-review"
    && (state.dateReview.assignment.status === "assigning" || dateReviewTimersV11.size > 0);
  cancelShellOpsForNavigationV10();
  state.almanacLoadRequestId += 1;
  const snapshot = historyEntries.get(event?.state?.entryId) || null;
  const opaqueCaptureDayDate = captureDayHistoryTargetsV12.get(event?.state?.entryId);
  const validOpaqueCaptureDay = isDateKey(opaqueCaptureDayDate) && Boolean(days[opaqueCaptureDayDate]);
  const params = stripLegacySearchQueryFromUrl().searchParams;
  const nextView = params.get("view");
  const resolvedNextView = nextView === "telegram-capture" && !snapshot
    ? "calendar"
    : allowedViews.has(nextView) ? nextView : "calendar";
  if (previousView === "date-review" && resolvedNextView !== previousView && !dateReviewHadPendingOperation) {
    clearDateReviewAnnouncementV11();
  }
  if (previousView === "date-review" && resolvedNextView === "telegram-capture" && state.capture.reviewHandoffKey) {
    const handoffKey = state.capture.reviewHandoffKey;
    if (Object.hasOwn(state.dateReview.resolved, handoffKey) || !state.dateReview.unresolved.includes(handoffKey)) {
      if (state.capture.fixtureIdentity) captureResolvedReviewIdentitiesV12.add(state.capture.fixtureIdentity);
      dispatchCaptureV12("REVIEW_RESOLVED");
    }
  }
  state.view = resolvedNextView;
  const nextMonth = params.get("month");
  const nextThrough = params.get("through");
  const nextDate = params.get("date");
  const validLiveDate = !isFirstUseFixture() && isDateKey(nextDate) && Boolean(days[nextDate]);
  state.almanacEmptyArchive = isFirstUseFixture() ? true : Boolean(snapshot?.almanacEmptyArchive);

  if (state.view === "date-review") {
    state.selectedDate = null;
    state.screen = "month";
    state.dateReview.detailKey = snapshot?.dateReviewDetailKey && state.dateReview.unresolved.includes(snapshot.dateReviewDetailKey)
      ? snapshot.dateReviewDetailKey
      : null;
  } else if (state.view === "telegram-capture") {
    state.selectedDate = null;
    state.screen = "month";
    state.capture.surface = ["companion", "change-date"].includes(snapshot?.captureSurface) ? snapshot.captureSurface : "companion";
  } else if (state.view === "almanac") {
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
    state.month = validOpaqueCaptureDay ? opaqueCaptureDayDate.slice(0, 7) : isMonthKey(nextMonth) ? nextMonth : validLiveDate ? nextDate.slice(0, 7) : snapshot?.calendarMonth || prototypeNewestMonth;
    if (state.view === "calendar") state.calendarMonth = state.month;
    state.selectedDate = state.view === "calendar" && validOpaqueCaptureDay
      ? opaqueCaptureDayDate
      : state.view === "calendar" && validLiveDate && nextDate.startsWith(`${state.month}-`) ? nextDate : null;
  }

  const rememberedFocusDate = snapshot?.focusDate;
  state.focusDate = ["date-review", "telegram-capture"].includes(state.view)
    ? state.focusDate
    : datesForMonth(state.month).includes(rememberedFocusDate)
      ? rememberedFocusDate
      : state.selectedDate || (state.month === today.slice(0, 7) ? today : `${state.month}-01`);
  if (state.pendingSelectionCloseFocus && !state.selectedDate && state.pendingSelectionCloseFocus.startsWith(`${state.month}-`)) {
    state.focusDate = state.pendingSelectionCloseFocus;
  }
  state.pendingSelectionCloseFocus = null;
  state.screen = state.view === "calendar" && validOpaqueCaptureDay
    ? "day"
    : ["calendar", "almanac"].includes(state.view) && params.get("screen") === "day" && days[state.selectedDate] ? "day" : "month";
  const nextSettingsSection = params.get("section");
  state.settingsSection = allowedSettingsSections.has(nextSettingsSection) ? nextSettingsSection : "overview";
  state.almanacCollapsed = params.get("rail") === "collapsed";
  state.almanacStatus = "idle";
  state.almanacFailNext = false;
  const dateReviewMoreOrigin = state.view !== "date-review" ? snapshot?.dateReviewMoreOrigin : null;
  const moreReturnFocus = dateReviewMoreOrigin?.control === "conditional" && dateReviewCount() > 0
    ? ".more-sheet .date-review-more-v11[data-action=\"open-date-review\"]"
    : '.more-management [data-action="open-date-review"]';
  state.modal = dateReviewMoreOrigin
    ? {
        type: "more",
        returnFocusSelector: '[data-action="open-more"]',
        focusSelector: moreReturnFocus,
        sheetScrollTop: Number(dateReviewMoreOrigin.sheetScrollTop) || 0,
        restoredFromDateReviewHistoryV11: true,
      }
    : null;
  state.monthAnnouncement = `Showing ${monthLabel(state.month)}`;

  const defaultFocus = state.view === "calendar" && isFirstUseFixture() ? "#first-use-title-v9"
    : state.view === "search" ? "#archive-search-input-v9"
    : state.view === "settings" ? "#settings-section-heading"
      : state.view === "telegram-capture" ? state.capture.surface === "change-date" ? "#capture-change-title-v12" : "#capture-title-v12"
      : state.view === "date-review" && state.dateReview.detailKey ? "#date-review-detail-title-v11"
        : state.view === "date-review" ? "#date-review-title-v11"
      : state.view === "calendar" && state.screen === "day" ? ".day-detail-header .back-button"
        : state.view === "calendar" && state.selectedDate ? ".calendar-selection"
          : state.view === "calendar" ? `[data-calendar-date="${state.focusDate}"]`
            : state.view === "almanac" && state.screen === "day" ? ".day-detail-header .back-button"
              : state.view === "almanac" && state.selectedDate ? `#chapter-${state.selectedDate}`
                : `[data-action="set-view"][data-view="${state.view}"]`;
  let focusSelector = snapshot?.focusSelector || defaultFocus;
  if (dateReviewMoreOrigin) focusSelector = moreReturnFocus;
  const resolvedCaptureFocusFallback = state.view === "telegram-capture"
    && state.capture.reviewResolved
    && (focusSelector?.includes('data-action="capture-review-date"')
      || focusSelector?.includes("date-review"));
  if (resolvedCaptureFocusFallback) focusSelector = "#capture-outcome-title-v12";
  if (calendarSelectionSheetQuery.matches && focusSelector?.startsWith(".almanac-index-v9 ")) {
    state.pendingDrawerFocusSelector = focusSelector.replace(/^\.almanac-index-v9\s+/, "");
    focusSelector = '[data-action="open-almanac-drawer"]';
  }
  state.focusAfterRender = focusSelector;
  const historyScrollY = Number(snapshot?.scrollY) || 0;
  const historyFocusTop = resolvedCaptureFocusFallback
    ? Math.min(120, Math.max(40, window.innerHeight * 0.25))
    : dateReviewMoreOrigin
      ? null
      : Number.isFinite(snapshot?.focusTop) ? snapshot.focusTop : null;
  state.almanacRestoringHistory = state.view === "almanac" && state.screen === "month";

  let entryId = event?.state?.entryId;
  if (!snapshot) {
    entryId = nextHistoryEntryId();
    historyEntries.set(entryId, captureHistorySnapshot({ scrollY: 0, focusSelector: defaultFocus, focusTop: null }));
    historyPositions.set(entryId, currentHistoryPosition);
  }
  window.history.replaceState({ entryId }, "", canonicalRouteUrl({ entryId }));
  render();
  const restoredFocusSelector = resolveLogicalSelector(focusSelector)
    ? focusSelector
    : resolveLogicalSelector(defaultFocus)
      ? defaultFocus
      : resolveLogicalSelector("#prototype-main") ? "#prototype-main" : null;
  const restoredFocusTop = restoredFocusSelector === focusSelector ? historyFocusTop : null;
  if (snapshot && restoredFocusSelector && restoredFocusSelector !== focusSelector) {
    historyEntries.set(entryId, { ...snapshot, focusSelector: restoredFocusSelector, focusTop: null });
  }
  if (!["date-review", "telegram-capture"].includes(state.view)) queueLiveAnnouncementV10(calendarStatusLive, state.monthAnnouncement);
  restoreViewScroll(state.view, historyScrollY, restoredFocusSelector, restoredFocusTop);
}

root.addEventListener("click", handleClick);
root.addEventListener("submit", handleSubmit);
root.addEventListener("change", handleChange);
document.addEventListener("click", handleCaptureSkipLinkV12);
root.addEventListener("input", (event) => {
  handleShellInputV10(event);
  if (event.target.matches("#date-review-date-input-v11")) {
    const input = event.target;
    setDateReviewDraftV11(input.value, {
      selection: { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection },
    });
    return;
  }
  if (event.target.matches("#archive-search-input-v9")) {
    state.searchDraft = event.target.value;
    if (state.viewMemory.search) state.viewMemory.search.searchDraft = state.searchDraft;
    state.searchSelection = {
      start: event.target.selectionStart,
      end: event.target.selectionEnd,
      direction: event.target.selectionDirection,
    };
  }
});
document.addEventListener("focusin", (event) => {
  const pendingNavigationFocus = pendingNavigationFocusV12;
  if (pendingNavigationFocus) {
    const intendedTarget = resolveLogicalSelector(pendingNavigationFocus.selector);
    if (event.target !== intendedTarget) invalidateNavigationFocusV12();
  }
  const selector = selectorForLogicalFocus(event.target);
  if (selector) state.transientFocusSelector = selector;
});
document.addEventListener("selectionchange", () => {
  const input = document.activeElement;
  if (input?.id === "archive-search-input-v9") {
    state.searchSelection = { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection };
  }
  if (input?.id === "correction-draft-v10") {
    dispatchShell("CORRECTION_SELECTION", { selection: { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection } });
  }
});
modalRoot.addEventListener("click", handleClick);
modalRoot.addEventListener("change", handleChange);
modalRoot.addEventListener("input", handleShellInputV10);
document.addEventListener("keydown", handleKeydown);
window.addEventListener("popstate", handlePopState);
window.addEventListener("beforeunload", (event) => {
  if (!state.shell.correction.dirty) return;
  event.preventDefault();
  event.returnValue = "";
});
window.addEventListener("scroll", handleAlmanacScroll, { passive: true });
let shellFocusedResizeFrameV10 = 0;
function scheduleShellFocusedElementReconcileV10() {
  cancelAnimationFrame(shellFocusedResizeFrameV10);
  shellFocusedResizeFrameV10 = requestAnimationFrame(() => {
    shellFocusedResizeFrameV10 = requestAnimationFrame(() => {
      const active = document.activeElement;
      if (!active || active === document.body) return;
      const ownsShellFocus = active.closest?.("#modal-root, .calendar-selection, .session-gate-v10")
        || active.matches?.("#connection-restored-v10, #app-loading-title-v10, #server-failure-title-v10");
      if (!ownsShellFocus) return;
      const block = active.id === "correction-draft-v10" ? "center" : "nearest";
      withInstantScroll(() => active.scrollIntoView({ behavior: "auto", block }));
    });
  });
}
window.addEventListener("resize", scheduleShellFocusedElementReconcileV10, { passive: true });
window.visualViewport?.addEventListener("resize", scheduleShellFocusedElementReconcileV10, { passive: true });
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
  if (event.matches && selector?.startsWith(".almanac-index-v9 ")) {
    state.pendingDrawerFocusSelector = selector.replace(/^\.almanac-index-v9\s+/, "");
    selector = '[data-action="open-almanac-drawer"]';
  } else if (!event.matches && selector?.includes('open-almanac-drawer') && state.pendingDrawerFocusSelector) {
    selector = `.almanac-index-v9 ${state.pendingDrawerFocusSelector}`;
  }
  if (state.modal) state.modal.focusSelector = selector;
  else if (state.view === "calendar" && state.selectedDate && state.screen === "month") {
    state.focusAfterRender = selector?.includes("retry-shell-image") || selector?.includes("museum-media-") ? selector : ".calendar-selection";
  } else state.focusAfterRender = selector;
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
    if (event.matches && (returnSelector.includes(".almanac-index-v9") || returnSelector.includes('open-almanac-jump') || returnSelector.includes('toggle-almanac-rail'))) {
      state.pendingDrawerFocusSelector = returnSelector.replace(/^\.almanac-index-v9\s+/, "");
      state.modal.returnFocusSelector = '[data-action="open-almanac-drawer"]';
      state.modal.returnToDrawer = false;
    } else if (event.matches && returnSelector.includes('.unified-topbar') && returnSelector.includes('open-upload')) {
      state.modal.returnFocusSelector = '[data-action="open-more"]';
    } else if (!event.matches && (returnSelector.includes('open-almanac-drawer') || returnSelector.includes('.almanac-mobile-drawer-v9'))) {
      state.modal.returnFocusSelector = state.modal.type === "almanac-jump"
        ? '.almanac-index-v9 [data-action="open-almanac-jump"]'
        : state.pendingDrawerFocusSelector
          ? `.almanac-index-v9 ${state.pendingDrawerFocusSelector}`
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
